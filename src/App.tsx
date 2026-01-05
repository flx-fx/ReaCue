import {useState} from "react";
import {ThemeProvider} from "./components/theme-provider";
import {Button} from "./components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./components/ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet, FieldTitle
} from "./components/ui/field";
import {Input} from "./components/ui/input";
import {Switch} from "./components/ui/switch";
import {IconBrandGithub, IconChevronDown, IconChevronUp, IconDownload} from "@tabler/icons-react";
import {ModeToggle} from "./components/mode-toggle";
import * as React from "react";
import type {Marker} from "@/types.ts";
import {ButtonGroup, ButtonGroupText} from "@/components/ui/button-group.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import Logo from "@/components/logo.tsx";

export function App() {
    const [fillCues, setFillCues] = useState(false);
    const [cueList, setCueList] = useState<number | null>(1);
    const [eventList, setEventList] = useState<number | null>(1);
    const [startEvent, setStartEvent] = useState<number | null>(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [timecodeMode, setTimecodeMode] = useState<string>("midi");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    function parseReaperMarkers(reaperProjectFileText: string) {
        const markerRegex = /^\s*MARKER\s+(\d+)\s+([0-9.]+)\s+(?:"([^"]*)"|'([^']*)'|(\S+))/gm;
        const markers: Marker[] = [];

        let match;
        while ((match = markerRegex.exec(reaperProjectFileText)) !== null) {
            const [, id, time, doubleQuoted, singleQuoted, unquoted] = match;
            markers.push({
                id: id as unknown as number,
                time: time as unknown as number,
                name: doubleQuoted ?? singleQuoted ?? unquoted
            });
        }
        return markers.sort((a, b) => a.time - b.time);
    }

    function getTimeCodeFromSeconds(time: number, fps: number = 30) {
        const hours = Math.floor(time / 3600).toString().padStart(2, "0");
        const minutes = Math.floor(time % 3600 / 60).toString().padStart(2, "0");
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        const frames = Math.floor(time % 1 * fps).toString().padStart(2, "0");

        return `${hours}:${minutes}:${seconds}:${frames}`;
    }

    const generateEosImport = async () => {
        if (!selectedFile) return;
        try {
            const reaperProjectFileText = await selectedFile.text();

            const markers = parseReaperMarkers(reaperProjectFileText);

            const lines: string[] = [];
            lines.push("START_SHOWCONTROL");
            lines.push("TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,PART_NUMBER,LABEL,TIME_ADDRESS,DATE,TRIGGER,ACTION");
            lines.push(`28,Event,${eventList ?? 1},0,${timecodeMode === "midi" ? 1 : 2},,,,Source 1,${timecodeMode.toUpperCase()}`);

            lines.push(...markers.map((marker, index) => `28,Event,${eventList ?? 1},${index + (startEvent ?? 1)},${timecodeMode === "midi" ? 1 : 2},"${marker.name.replaceAll("\"", "")}",${getTimeCodeFromSeconds(marker.time)},,,${fillCues ? `Cue  ${cueList ?? 1} / ${index + 1} ` : ""}`))

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

    const handleEventListChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === "") {
                setEventList(null)
            } else {
                const parsedValue = parseInt(value, 10)
                if (!isNaN(parsedValue) && parsedValue !== 0) {
                    setEventList(parsedValue)
                }
            }
        },
        []
    )

    const handleEventListAdj = React.useCallback((adjustment: number) => {
        setEventList((prevCount) =>
            Math.max(1, Math.min(9999, (prevCount ?? 0) + adjustment))
        )
    }, [])

    const handleStartEventChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === "") {
                setStartEvent(null)
            } else {
                const parsedValue = parseInt(value, 10)
                if (!isNaN(parsedValue) && parsedValue !== 0) {
                    setStartEvent(parsedValue)
                }
            }
        },
        []
    )

    const handleStartEventAdj = React.useCallback((adjustment: number) => {
        setStartEvent((prevCount) =>
            Math.max(1, Math.min(9999, (prevCount ?? 0) + adjustment))
        )
    }, [])

    const handleCueListChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === "") {
                setCueList(null)
            } else {
                const parsedValue = parseInt(value, 10)
                if (!isNaN(parsedValue) && parsedValue !== 0) {
                    setCueList(parsedValue)
                }
            }
        },
        []
    )

    const handleCueListAdj = React.useCallback((adjustment: number) => {
        setCueList((prevCount) =>
            Math.max(1, Math.min(9999, (prevCount ?? 0) + adjustment))
        )
    }, [])

    return <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex justify-center items-center min-h-screen w-full">
            <Card className="relative w-full max-w-md overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex gap-2 items-center"><Logo
                        className="h-3"/>ReaCue</CardTitle>
                    <CardDescription>Select a Reaper project file. You have to use a framerate of 30fps for both Reaper
                        and EOS.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Reaper Project File (.rpp)</FieldLabel>
                            <Input id="reaper-file" type="file" accept=".rpp" onChange={handleFileChange}/>
                        </Field>
                        <FieldSeparator/>
                        <FieldSet>
                            <FieldLabel>Timecode Mode</FieldLabel>
                            <FieldDescription>Select how you want to receive Timecode in EOS.</FieldDescription>
                            <RadioGroup defaultValue="midi" onValueChange={(value) => {setTimecodeMode(value as string)}}>
                                <FieldLabel htmlFor="midi-rgi">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>MIDI</FieldTitle>
                                            <FieldDescription>Useful when running Reaper and EOS on the same
                                                computer.</FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="midi" id="midi-rgi"/>
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="smtp-rgi">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>SMTP</FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem value="smtp" id="smtp-rgi"/>
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>
                        </FieldSet>
                        <Field orientation={"horizontal"}>
                            <FieldContent>
                                <FieldLabel htmlFor="event-list">Event List Number</FieldLabel>
                                <FieldDescription>Show Control List to import markers</FieldDescription>
                            </FieldContent>
                            <div className="flex">
                                <Input className="rounded-r-none" size={4} maxLength={4} id="event-list"
                                       value={eventList ?? ""}
                                       onChange={handleEventListChange} placeholder="123"/>
                                <ButtonGroup orientation="vertical" className="rounded-l-none">
                                    <Button className="h-4 w-6 rounded-tl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Increment"
                                            onClick={() => handleEventListAdj(1)}
                                            disabled={eventList !== null && eventList >= 9999}><IconChevronUp
                                        className="size-3.5"/></Button>
                                    <Button className="h-4 w-6 rounded-bl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Decrement"
                                            onClick={() => handleEventListAdj(-1)}
                                            disabled={eventList === null || eventList <= 1}><IconChevronDown
                                        className="size-3.5"/></Button>
                                </ButtonGroup>
                            </div>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="start-event">Start at Event</FieldLabel>
                            <div className="flex">
                                <ButtonGroup>
                                    <ButtonGroupText>{eventList ?? 1} /</ButtonGroupText>
                                    <Input className="rounded-r-none!" size={4} maxLength={4} id="start-event"
                                           value={startEvent ?? ""}
                                           onChange={handleStartEventChange} placeholder="123"/>
                                </ButtonGroup>
                                <ButtonGroup orientation="vertical" className="rounded-l-none">
                                    <Button className="h-4 w-6 rounded-tl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Increment"
                                            onClick={() => handleStartEventAdj(1)}
                                            disabled={startEvent !== null && startEvent >= 9999}><IconChevronUp
                                        className="size-3.5"/></Button>
                                    <Button className="h-4 w-6 rounded-bl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Decrement"
                                            onClick={() => handleStartEventAdj(-1)}
                                            disabled={startEvent === null || startEvent <= 1}><IconChevronDown
                                        className="size-3.5"/></Button>
                                </ButtonGroup>
                            </div>
                        </Field>
                        <FieldSeparator/>
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor="fill-cues">Populate with Cues</FieldLabel>
                                <FieldDescription>
                                    Pre-fill the generated Timecode Actions with Cue References. Does not create the
                                    referenced Cues.
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="fill-cues" checked={fillCues}
                                    onCheckedChange={(checked) => setFillCues(checked)}/>
                        </Field>
                        {fillCues ? <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor="cue-list">Cue List Number</FieldLabel>
                                <FieldDescription>
                                    Choose a Cue List to fill the Timecode Actions.
                                </FieldDescription>
                            </FieldContent>
                            <div className="flex">
                                <Input className="rounded-r-none" size={4} maxLength={4} id="cue-list"
                                       value={cueList ?? ""}
                                       onChange={handleCueListChange} placeholder="123"/>
                                <ButtonGroup orientation="vertical" className="rounded-l-none">
                                    <Button className="h-4 w-6 rounded-tl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Increment"
                                            onClick={() => handleCueListAdj(1)}
                                            disabled={cueList !== null && cueList >= 9999}><IconChevronUp
                                        className="size-3.5"/></Button>
                                    <Button className="h-4 w-6 rounded-bl-none! border-l-0" size="icon"
                                            variant="outline" aria-label="Decrement"
                                            onClick={() => handleEventListAdj(-1)}
                                            disabled={cueList === null || cueList <= 1}><IconChevronDown
                                        className="size-3.5"/></Button>
                                </ButtonGroup>
                            </div>
                        </Field> : ""}
                    </FieldGroup>
                </CardContent>
                <CardFooter className="justify-between">
                    <Button disabled={!selectedFile} onClick={generateEosImport}><IconDownload/>Generate EOS
                        import</Button>
                    <ButtonGroup>
                        <Button size={"icon"} variant="outline" render={<a href="https://github.com/flx-fx/ReaCue"
                                                                           target="_blank"
                                                                           rel="noopener noreferrer"><IconBrandGithub/></a>}></Button>
                        <ModeToggle/>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </div>
    </ThemeProvider>;
}

export default App;