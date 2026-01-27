import {Input} from "@/components/ui/input.tsx";
import {ButtonGroup, ButtonGroupText} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IconChevronDown, IconChevronUp, type ReactNode} from "@tabler/icons-react";
import * as React from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 9999;

export default function NumberInput({id, value, onChange, elementBefore, disabled = false}: NumberInputProps) {

    const [text, setText] = React.useState<string>(String(value));
    const isEditingRef = React.useRef(false);

    const clamp = (n: number) => Math.max(MIN_VALUE, Math.min(MAX_VALUE, n));

    React.useEffect(() => {
        if (!isEditingRef.current) {
            setText(String(value));
        }
    }, [value]);

    const commit = React.useCallback(() => {
        const trimmed = text.trim();

        if (trimmed === "") {
            onChange(MIN_VALUE);
            setText(String(MIN_VALUE));
            return;
        }

        const parsed = parseInt(trimmed, 10);
        const next = Number.isNaN(parsed) ? MIN_VALUE : clamp(parsed);

        onChange(next);
        setText(String(next));
    }, [onChange, text]);

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = e.target.value;

            if (next === "") {
                setText("");
                return;
            }

            if (!/^\d+$/.test(next)) return;

            setText(next);
        },
        []
    );

    const handleAdjust = (adj: number) => {
        const base = clamp(value);
        const next = clamp(base + adj);
        onChange(next);
        setText(String(next));
    };

    return <div className="flex">
        <ButtonGroup>
            {elementBefore && (
                <ButtonGroupText className={disabled ? "text-muted-foreground select-none" : "select-none"}>
                    {elementBefore}
                </ButtonGroupText>
            )}
            <Input
                className="rounded-r-none! font-mono"
                size={4}
                maxLength={4}
                id={id}
                value={text}
                onFocus={() => { isEditingRef.current = true; }}
                onBlur={() => {
                    isEditingRef.current = false;
                    commit();
                }}
                onChange={handleChange}
                placeholder="123"
                disabled={disabled}
                inputMode="numeric"
            />
        </ButtonGroup>
        <ButtonGroup orientation="vertical" className="rounded-l-none">
            <Button
                className="h-4 w-6 rounded-tl-none! border-l-0"
                size="icon"
                variant="outline"
                aria-label="Increment"
                onClick={() => handleAdjust(1)}
                disabled={(value >= MAX_VALUE) || disabled}
            >
                <IconChevronUp className="size-3.5"/>
            </Button>
            <Button
                className="h-4 w-6 rounded-bl-none! border-l-0"
                size="icon"
                variant="outline"
                aria-label="Decrement"
                onClick={() => handleAdjust(-1)}
                disabled={(value <= MIN_VALUE) || disabled}
            >
                <IconChevronDown className="size-3.5"/>
            </Button>
        </ButtonGroup>
    </div>;
}

interface NumberInputProps {
    id: string;
    value: number;
    onChange: (value: number) => void;
    elementBefore?: ReactNode;
    disabled?: boolean;
}