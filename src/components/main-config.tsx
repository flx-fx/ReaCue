import {CueLinkField} from "./cue-link-field";
import {FileUploadField} from "./file-upload-field";
import Logo from "./logo";
import TimecodeSourceField from "./timecode-source-field";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card";
import {FieldGroup, FieldSeparator} from "./ui/field";
import {IconChevronRight, IconDownload, IconQuestionMark} from "@tabler/icons-react";
import {ButtonGroup} from "./ui/button-group";
import GitHubButton from "./github-button";
import {ModeToggle} from "./mode-toggle";
import {useState} from "react";
import type {TimecodeSource} from "@/types";
import {generateEosImport} from "@/lib/core";
import {Button} from "./ui/button";
import TimecodeOffsetField from "./timecode-offset-field";
import EventListField from "./event-list-field";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Kbd} from "@/components/ui/kbd.tsx";

const MainConfig = () => {
    const [projectFiles, setProjectFiles] = useState<File[]>([]);
    const [timecodeOffset, setTimecodeOffset] = useState<string>("00:00:00:00")
    const [eventList, setEventList] = useState<number>(1);
    const [firstEvent, setFirstEvent] = useState<number>(1);
    const [cueList, setCueList] = useState<number>(1);
    const [firstCue, setFirstCue] = useState<number>(1);
    const [createCueLinks, setCreateCueLinks] = useState<boolean>(true)
    const [createCues, setCreateCues] = useState<boolean>(false);
    const [smartCueNumbers, setSmartCueNumbers] = useState<boolean>(false);
    const [timecodeSource, setTimecodeSource] = useState<TimecodeSource>("midi");

    const handleGenerate = generateEosImport(projectFiles, eventList, timecodeSource, timecodeOffset, createCueLinks, cueList, smartCueNumbers, firstCue, firstEvent);

    return (<Card
        className="relative w-full m-4 min-w-xs overflow-hidden ring-0 bg-transparent shadow-none rounded-none box-shadow-sm box-shadow-primary sm:ring-1 sm:bg-card sm:shadow-sm sm:rounded-xl sm:max-w-md sm:m-0">
        <CardHeader>
            <CardTitle className="text-lg font-bold flex gap-2 items-center">
                <Logo className="inline h-[0.7em] w-auto align-text-top"/>
                ReaCue
            </CardTitle>
            <CardDescription>
                Convert REAPER markers into Eos event list entries for timecode-driven playback.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <FieldGroup>
                <FileUploadField projectFiles={projectFiles} setProjectFiles={setProjectFiles}/>
                <FieldSeparator/>
                <TimecodeOffsetField setTimecodeOffset={setTimecodeOffset}/>
                <FieldSeparator/>
                <EventListField eventList={eventList} firstEvent={firstEvent} setEventList={setEventList}
                                setFirstEvent={setFirstEvent}/>
                <FieldSeparator/>
                <CueLinkField cueList={cueList} firstCue={firstCue} createCueLinks={createCueLinks}
                              createCues={createCues} smartCueNumbers={smartCueNumbers} setCueList={setCueList}
                              setFirstCue={setFirstCue} setCreateCueLinks={setCreateCueLinks}
                              setCreateCues={setCreateCues} setSmartCueNumbers={setSmartCueNumbers}/>
                <FieldSeparator/>
                <TimecodeSourceField timecodeSource={timecodeSource} setTimecodeSource={setTimecodeSource}/>
            </FieldGroup>
            <div className="h-20 sm:hidden"/>
        </CardContent>
        <CardFooter
            className="justify-between sm:relative sm:rounded-xl fixed w-full rounded-none bottom-0 left-0 bg-card sm:bg-muted/50">
            <div className="flex gap-1">
                <Button disabled={!projectFiles.length} onClick={handleGenerate}>
                    <IconDownload/>Export EOS show data (.csv)
                </Button>
                <Tooltip>
                    <TooltipTrigger render={<Button size="icon" variant="ghost">
                        <IconQuestionMark/>
                    </Button>}/>
                    <TooltipContent>
                        <strong>Importing show data in Eos:</strong>
                        <p>In Eos: Navigate to <Kbd>CIA</Kbd><IconChevronRight
                            className="inline h-[1.1em] w-auto align-text-center"/>
                            <Kbd>Browser</Kbd><IconChevronRight className="inline h-[1.1em] w-auto align-text-center"/>
                            <Kbd>Import</Kbd><IconChevronRight className="inline h-[1.1em] w-auto align-text-center"/>
                            <Kbd>Csv</Kbd> and browse for the file exported from ReaCue.</p>
                    </TooltipContent>
                </Tooltip></div>
            <ButtonGroup>
                <GitHubButton/>
                <ModeToggle/>
            </ButtonGroup>
        </CardFooter>
    </Card>)
}

export default MainConfig;