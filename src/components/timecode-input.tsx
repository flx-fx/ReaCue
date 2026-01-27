import { useMaskInput } from "use-mask-input";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

const TimecodeInput = ({ onChange, id }: { onChange: (value: string) => void, id: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [hasBlurred, setHasBlurred] = useState(false);

    const normalizeTimecode = (timecode: string) => {
        let [hh = 0, mm = 0, ss = 0, ff = 0] = timecode
            .split(":")
            .map((p) => parseInt(p, 10) || 0);

        ss += Math.floor(ff / 30);
        mm += Math.floor(ss / 60);
        hh += Math.floor(mm / 60);

        if (hh < 24) {
            ff %= 30;
            ss %= 60;
            mm %= 60;
        } else {
            hh = 23;
            mm = 59;
            ss = 59;
            ff = 29;
        }

        return [hh, mm, ss, ff]
            .map((v) => v.toString().padStart(2, "0"))
            .join(":");
    };

    const timecodeMask = useMaskInput({
        mask: "99:99:99:99",
        options: {
            placeholder: "0",
            showMaskOnFocus: true,
            numericInput: true,
            showMaskOnHover: true,
            undoOnEscape: true,
            clearMaskOnLostFocus: true,
            insertMode: true,
            onBeforePaste: normalizeTimecode,
        },
    });

    const handleBlur = () => {
        if (inputRef.current) {
            const currentValue = inputRef.current.value;
            const normalized = normalizeTimecode(currentValue);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const maskInstance = (inputRef.current as any).inputmask;
            if (maskInstance) {
                maskInstance.setValue(normalized);
                onChange(normalized);
            }
        }
    };

    const handleFocus = () => {
        if (hasBlurred && inputRef.current) {
            inputRef.current.value = "";
            setHasBlurred(false);
        }
    };

    const handleBlurWrapper = () => {
        setHasBlurred(true);
        handleBlur();
    };

    return (
        <Input
            maxLength={11}
            className="text-center! font-mono w-[calc(--spacing(6)+11ch)]!"
            id={id}
            type="text"
            defaultValue=""
            placeholder="HH:MM:SS:FF"
            inputMode="numeric"
            ref={(el) => {
                inputRef.current = el;
                // eslint-disable-next-line react-hooks/immutability,@typescript-eslint/no-explicit-any
                (timecodeMask as any).current = el;
            }}
            onBlur={handleBlurWrapper}
            onFocus={handleFocus}
        />
    );
};

export default TimecodeInput;
