import {Input} from "@/components/ui/input.tsx";
import {ButtonGroup, ButtonGroupText} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IconChevronDown, IconChevronUp, type ReactNode} from "@tabler/icons-react";
import * as React from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 9999;

export default function NumberInput({id, value, onChange, elementBefore}: NumberInputProps) {
    
    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === "") {
                onChange(null)
            } else {
                const parsedValue = parseInt(value, 10)
                if (!isNaN(parsedValue) && parsedValue !== 0) {
                    onChange(parsedValue)
                }
            }
        },
        [onChange]
    )

    const handleAdjust = (adj: number) => {
        onChange(Math.max(MIN_VALUE, Math.min(MAX_VALUE, (value ?? 0) + adj)));
    };

    return <div className="flex">
        <ButtonGroup>
            {elementBefore && <ButtonGroupText>{elementBefore}</ButtonGroupText>}
            <Input className="rounded-r-none!" size={4} maxLength={4} id={id}
                   value={value ?? ""}
                   onChange={handleChange} placeholder="123"/>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" className="rounded-l-none">
            <Button className="h-4 w-6 rounded-tl-none! border-l-0" size="icon"
                    variant="outline" aria-label="Increment"
                    onClick={() => handleAdjust(1)}
                    disabled={value !== null && value >= MAX_VALUE}><IconChevronUp
                className="size-3.5"/></Button>
            <Button className="h-4 w-6 rounded-bl-none! border-l-0" size="icon"
                    variant="outline" aria-label="Decrement"
                    onClick={() => handleAdjust(-1)}
                    disabled={value === null || value <= MIN_VALUE}><IconChevronDown
                className="size-3.5"/></Button>
        </ButtonGroup>
    </div>
}

interface NumberInputProps {
    id: string;
    value: number | null;
    onChange: (value: number | null) => void;
    elementBefore?: ReactNode;
}