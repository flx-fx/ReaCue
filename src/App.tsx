import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Switch } from "./components/ui/switch";
import { IconDownload } from "@tabler/icons-react";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
    const [fillCues, setFillCues] = useState(false);
    const [cueList, setCueList] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const generateEosImport = async () => {
        if (!selectedFile) return;
        try {
            const reaperFile = await selectedFile.text();

            const markerRegex = /^\s*MARKER\s+(\d+)\s+(\d+(?:\.\d+)?)\s+(?:"([^"]+)"|(\S+))\s\d+\s\d+\s\d+\s.*$/gm;
            const markers: { id: number; time: number; name: string }[] = [];

            let m: RegExpExecArray | null;
            while ((m = markerRegex.exec(reaperFile)) !== null) {
                const id = parseInt(m[1], 10);
                const time = parseFloat(m[2]);
                const name = (m[3] ?? m[4] ?? "").trim();
                markers.push({ id, time, name });
            }

            const secondsToTimecode = (seconds: number, fps = 30) => {
                const totalFrames = Math.round(seconds * fps);
                const framesPerHour = 3600 * fps;
                const hours = Math.floor(totalFrames / framesPerHour);
                const remainder = totalFrames - hours * framesPerHour;
                const minutes = Math.floor(remainder / (60 * fps));
                const secs = Math.floor((remainder - minutes * 60 * fps) / fps);
                const frames = remainder % fps;
                const pad = (n: number, w = 2) => String(n).padStart(w, "0");
                return `${pad(hours)}:${pad(minutes)}:${pad(secs)}:${pad(frames)}`;
            };

            const lines: string[] = [];
            lines.push("START_SHOWCONTROL");
            lines.push("TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,PART_NUMBER,LABEL,TIME_ADDRESS,DATE,TRIGGER,ACTION");
            lines.push("28,Event,1,0,2,,,,Source 1,MIDI");

            markers.forEach((marker) => {
                const timecode = secondsToTimecode(marker.time, 30);
                const targetId = marker.id;
                const partNumber = 2;
                const label = marker.name;
                const date = "";
                const trigger = "";
                const action = fillCues ? `Cue  ${cueList} / ${marker.id}` : "";
                const row = [
                    "28",
                    "Event",
                    "1",
                    String(targetId),
                    String(partNumber),
                    label,
                    timecode,
                    date,
                    trigger,
                    action,
                ].join(",");
                lines.push(row);
            });

            lines.push("END_SHOWCONTROL");

            const output = lines.join("\n");

            const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "eos_import.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to read file:", err);
        }
    }

    return <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex justify-center items-center min-h-screen w-full">
            <Card className="relative w-full max-w-sm overflow-hidden">
                <CardHeader>
                    <CardTitle>ReaCue</CardTitle>
                    <CardDescription>Select a Reaper project file. You have to use a framerate of 30fps for both Reaper and EOS.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Reaper Project File (.rpp)</FieldLabel>
                            <Input id="reaper-file" type="file" accept=".rpp" onChange={handleFileChange} />
                        </Field>
                        <FieldSeparator/>
                        <Field orientation="horizontal">
                        <FieldContent>
                            <FieldLabel htmlFor="fill-cues">Populate with Cues</FieldLabel>
                            <FieldDescription>
                                Pre-fill the generated Timecode Actions with Cue References. Does not create the referenced Cues.
                            </FieldDescription>
                        </FieldContent>
                        <Switch id="fill-cues" checked={fillCues} onClick={() => setFillCues(!fillCues)} />
                    </Field>
                    {fillCues ? <Field orientation="horizontal">
                        <FieldContent>
                            <FieldLabel htmlFor="cuelist">CueList Number</FieldLabel>
                            <FieldDescription>
                                Choose a cuelist to fill the Timecode Actions.
                            </FieldDescription>
                        </FieldContent>
                        <Input className="w-18" id="cuelist" type="number" value={cueList} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCueList(e.currentTarget.valueAsNumber)} />
                    </Field> : ""}
                    </FieldGroup>
                </CardContent>
                <CardFooter className="justify-between">
                    <Button disabled={!selectedFile} onClick={generateEosImport}><IconDownload/>Generate EOS import</Button>
                    <ModeToggle/>
                </CardFooter>
            </Card>
        </div>
    </ThemeProvider>;
}

export default App;