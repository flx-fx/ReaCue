import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import TimecodeInput from "@/components/timecode-input.tsx";

const TimecodeOffsetField = ({ setTimecodeOffset }: TimecodeOffsetFieldProps) => {
    return <Field orientation={"horizontal"} className="">
        <FieldContent>
            <FieldLabel htmlFor="timecode-offset">Timecode offset</FieldLabel>
            <FieldDescription>Offset all event timestamps by a fixed value.</FieldDescription>
        </FieldContent>
        <TimecodeInput id="timecode-offset" onChange={(value) => setTimecodeOffset(value)} />
    </Field>;
}

interface TimecodeOffsetFieldProps {
    setTimecodeOffset: (timecodeOffset: string) => void;
}

export default TimecodeOffsetField
export type { TimecodeOffsetFieldProps }