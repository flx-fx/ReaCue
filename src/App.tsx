import * as React from "react";
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
    FieldSet,
    FieldTitle
} from "./components/ui/field";
import {Input} from "./components/ui/input";
import {Switch} from "./components/ui/switch";
import {IconDownload} from "@tabler/icons-react";
import {ModeToggle} from "./components/mode-toggle";
import type {TimeCodeMode} from "@/types.ts";
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import Logo from "@/components/logo.tsx";
import {exportEosCsvFile, getTimeCodeFromSeconds, parseReaperMarkers} from "@/lib/utils.ts";
import NumberInput from "@/components/number-input.tsx";
import GitHubButton from "@/components/github-button.tsx";

export function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [timecodeMode, setTimecodeMode] = useState<TimeCodeMode>("midi");
    const [eventList, setEventList] = useState<number | null>(1);
    const [startEvent, setStartEvent] = useState<number | null>(1);
    const [fillCues, setFillCues] = useState(false);
    const [cueList, setCueList] = useState<number | null>(1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const generateEosImport = async () => {
        if (!selectedFile) return;
        try {
            const markers = parseReaperMarkers(await selectedFile.text());

            const lines: string[] = [];
            lines.push("START_SHOWCONTROL");
            lines.push("TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,PART_NUMBER,LABEL,TIME_ADDRESS,DATE,TRIGGER,ACTION");
            lines.push(`28,Event,${eventList ?? 1},0,${timecodeMode === "midi" ? 1 : 2},,,,Source 1,${timecodeMode.toUpperCase()}`);
            lines.push(...markers.map((marker, index) => `28,Event,${eventList ?? 1},${index + (startEvent ?? 1)},${timecodeMode === "midi" ? 1 : 2},"${marker.name.replaceAll("\"", "")}",${getTimeCodeFromSeconds(marker.time)},,,${fillCues ? `Cue  ${cueList ?? 1} / ${index + 1} ` : ""}`))
            lines.push("END_SHOWCONTROL");

            exportEosCsvFile(lines.join("\n"))
        } catch (err) {
            console.error("Failed to read file:", err);
        }
    }

    return <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex justify-center sm:items-center items-start min-h-screen w-full">
            <Card className="relative w-full m-4 min-w-xs overflow-hidden ring-0 bg-transparent shadow-none rounded-none sm:ring-1 sm:bg-card sm:shadow-sm sm:rounded-xl sm:max-w-md sm:m-0">
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
                            <RadioGroup defaultValue="midi" onValueChange={(value) => {
                                setTimecodeMode(value as TimeCodeMode)
                            }}>
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
                            <NumberInput id={"event-list"} value={eventList} onChange={(value) => setEventList(value)}/>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="start-event">Start at Event</FieldLabel>
                            <NumberInput id={"start-event"} value={startEvent}
                                         onChange={(value) => setStartEvent(value)}
                                         elementBefore={`${eventList ?? 1} /`}/>
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
                            <NumberInput id={"cue-list"} value={cueList} onChange={(value) => setCueList(value)}/>
                        </Field> : ""}
                    </FieldGroup>
                    <div className="h-20 sm:hidden"/>
                </CardContent>
                <CardFooter className="justify-between sm:relative sm:rounded-xl fixed w-full rounded-none bottom-0 left-0 bg-card sm:bg-muted/50">
                    <Button disabled={!selectedFile} onClick={generateEosImport}>
                        <IconDownload/>Export EOS data (.csv)
                    </Button>
                    <ButtonGroup>
                        <GitHubButton/>
                        <ModeToggle/>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </div>
    </ThemeProvider>;
}

export default App;