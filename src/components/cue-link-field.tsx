import {Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator} from "@/components/ui/field.tsx";
import {ButtonGroup, ButtonGroupText} from "@/components/ui/button-group.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {IconPencilCog, IconPower, IconSparkles2} from "@tabler/icons-react";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import NumberInput from "@/components/number-input.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Kbd, KbdGroup} from "@/components/ui/kbd.tsx";

const CueLinkSettingsPopover = ({
                                    cueList,
                                    firstCue,
                                    createCues,
                                    smartCueNumbers,
                                    setCueList,
                                    setFirstCue,
                                    setCreateCues,
                                    setSmartCueNumbers
                                }: CueLinkSettingsPopoverProps) => {
    return <Popover>
        <PopoverTrigger
            render={<Button size="icon" variant="outline"><IconPencilCog/></Button>}/>
        <PopoverContent className="w-64" align="start">
            <PopoverHeader>
                <PopoverTitle>Cue links settings</PopoverTitle>
                <PopoverDescription>
                    Link each event to cues in the selected Eos cue list. By default,
                    only cue references are added; cues themselves are not created.
                </PopoverDescription>
            </PopoverHeader>
            <FieldGroup className="gap-4">
                <Field orientation={"horizontal"}>
                    <FieldLabel htmlFor="cue-list">Cue List</FieldLabel>
                    <NumberInput id={"cue-list"} value={cueList} onChange={(value) => setCueList(value)}/>
                </Field>
                <Tooltip disabled={!smartCueNumbers}>
                    <TooltipTrigger render={<Field orientation={"horizontal"}>
                        <FieldLabel htmlFor="first-cue" className={smartCueNumbers ? "text-muted-foreground" : ""}>
                            First Cue
                        </FieldLabel>
                        <NumberInput id={"first-cue"}
                                     value={firstCue}
                                     onChange={(value) => setFirstCue(value)}
                                     disabled={smartCueNumbers}
                                     elementBefore={<p className="font-mono">{cueList} /</p>}/>
                    </Field>}/>
                    <TooltipContent>
                        Disable "Smart cue numbering" to manually set the first cue.
                    </TooltipContent>
                </Tooltip>
                <FieldSeparator/>
                <Field orientation={"horizontal"}>
                    <FieldLabel htmlFor="create-cues">Create cues</FieldLabel>
                    <Switch id={"create-cues"} checked={createCues} onCheckedChange={setCreateCues}/>
                </Field>
                <Field orientation={"horizontal"}>
                    <FieldContent>
                        <FieldLabel htmlFor="smart-cue-numbering">Smart cue numbering</FieldLabel>
                        <FieldDescription>
                            Number cues by <span className="whitespace-nowrap">
                                <Kbd>measure</Kbd> . <KbdGroup><Kbd>beat</Kbd><Kbd>decimals</Kbd></KbdGroup>
                            </span> (calculated using BPM from REAPER project)
                        </FieldDescription>
                    </FieldContent>
                    <Switch id="smart-cue-numbering" onCheckedChange={setSmartCueNumbers} checked={smartCueNumbers}/>
                </Field>
            </FieldGroup>
        </PopoverContent>
    </Popover>;
}

const CueLinkField = ({
                          cueList,
                          firstCue,
                          createCueLinks,
                          createCues,
                          smartCueNumbers,
                          setCueList,
                          setFirstCue,
                          setCreateCueLinks,
                          setCreateCues,
                          setSmartCueNumbers
                      }: CueLinkFieldProps) => {
    return <Field orientation={"horizontal"} className="items-center!">
        <FieldContent>
            <FieldLabel>Cue links</FieldLabel>
        </FieldContent>
        {createCueLinks && <p className="text-muted-foreground select-none">Reference cues starting at Cue</p>}
        <ButtonGroup>
            {createCueLinks && <>
                <ButtonGroupText
                    className={`font-mono ${smartCueNumbers ? "bg-primary/10 border-primary" : ""}`}>
                    <Tooltip disabled={!smartCueNumbers}>
                        <TooltipTrigger><p
                            className="flex items-center">{cueList} / {smartCueNumbers ? <IconSparkles2
                            className="inline! h-[1em]! ml-0.5 w-auto! align-text-center! text-primary"/> : firstCue}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            Smart cue numbering is active
                        </TooltipContent>
                    </Tooltip>
                </ButtonGroupText>
                <CueLinkSettingsPopover cueList={cueList} firstCue={firstCue} createCues={createCues}
                                        smartCueNumbers={smartCueNumbers} setCueList={setCueList}
                                        setFirstCue={setFirstCue} setCreateCues={setCreateCues}
                                        setSmartCueNumbers={setSmartCueNumbers}/>
            </>}
            <Button variant={createCueLinks ? "default" : "outline"} size="icon"
                    onClick={() => setCreateCueLinks(!createCueLinks)}><IconPower/></Button>
        </ButtonGroup>
    </Field>;
}

interface CueLinkFieldProps {
    cueList: number;
    firstCue: number;
    createCueLinks: boolean;
    createCues: boolean;
    smartCueNumbers: boolean;
    setCueList: (cueList: number) => void;
    setFirstCue: (firstCue: number) => void;
    setCreateCueLinks: (createCueLinks: boolean) => void;
    setCreateCues: (createCues: boolean) => void;
    setSmartCueNumbers: (smartCueNumbers: boolean) => void;
}

interface CueLinkSettingsPopoverProps {
    cueList: number;
    firstCue: number;
    createCues: boolean;
    smartCueNumbers: boolean;
    setCueList: (cueList: number) => void;
    setFirstCue: (firstCue: number) => void;
    setCreateCues: (createCues: boolean) => void;
    setSmartCueNumbers: (smartCueNumbers: boolean) => void;
}

export {
    CueLinkField, CueLinkSettingsPopover, type CueLinkFieldProps
}