import {Field, FieldContent, FieldDescription, FieldLabel, FieldSet, FieldTitle} from "@/components/ui/field.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import type {TimecodeSource} from "@/types.ts";

const TimecodeSourceField = ({timecodeSource, setTimecodeSource}: TimecodeSourceFieldProps) =>
    <FieldSet>
        <FieldContent>
            <FieldLabel>Timecode source</FieldLabel>
            <FieldDescription>Choose how Eos receives timecode for this event
                list.</FieldDescription>
        </FieldContent>
        <RadioGroup value={timecodeSource} onValueChange={(value) => {
            setTimecodeSource(value as TimecodeSource)
        }}>
            <FieldLabel htmlFor="midi-rgi">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>MIDI Timecode (MTC)</FieldTitle>
                        <FieldDescription>Use when REAPER sends MIDI Timecode to
                            Eos.</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="midi" id="midi-rgi"/>
                </Field>
            </FieldLabel>
            <FieldLabel htmlFor="smpte-rgi">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>SMPTE Timecode</FieldTitle>
                        <FieldDescription>Use when Eos receives SMPTE Timecode via a Show Control
                            Gateway.</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="smpte" id="smpte-rgi"/>
                </Field>
            </FieldLabel>
        </RadioGroup>
    </FieldSet>;

interface TimecodeSourceFieldProps {
    timecodeSource: TimecodeSource;
    setTimecodeSource: (value: TimecodeSource) => void;
}

export default TimecodeSourceField;
export type {TimecodeSourceFieldProps};