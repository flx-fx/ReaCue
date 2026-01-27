import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group.tsx";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { IconPencilCog } from "@tabler/icons-react";
import NumberInput from "@/components/number-input.tsx";

const EventListSettingsPopover = ({ eventList, firstEvent, setEventList, setFirstEvent }: EventListFieldProps) => {
    return <Popover>
        <PopoverTrigger
            render={<Button size="icon" variant="outline"><IconPencilCog /></Button>} />
        <PopoverContent className="w-64" align="start">
            <PopoverHeader>
                <PopoverTitle>Event list settings</PopoverTitle>
                <PopoverDescription>
                    Select the Eos event list and first event number to receive the imported
                    entries.
                </PopoverDescription>
            </PopoverHeader>
            <FieldGroup className="gap-4">
                <Field orientation={"horizontal"}>
                    <FieldLabel htmlFor="event-list">Event list</FieldLabel>
                    <NumberInput id={"event-list"} value={eventList}
                        onChange={(value) => setEventList(value)} />
                </Field>
                <Field orientation={"horizontal"}>
                    <FieldLabel htmlFor="first-event">First event</FieldLabel>
                    <NumberInput id={"first-event"} value={firstEvent}
                        onChange={(value) => setFirstEvent(value)}
                        elementBefore={<p
                            className="font-mono">{eventList} /</p>} />
                </Field>
            </FieldGroup>
        </PopoverContent>
    </Popover>;
}

const EventListField = ({ eventList, firstEvent, setEventList, setFirstEvent }: EventListFieldProps) => {
    return <Field orientation={"horizontal"} className="items-center!">
        <FieldContent>
            <FieldLabel>Event list</FieldLabel>
        </FieldContent>
        <p className="text-muted-foreground">Import starting at Event</p>
        <ButtonGroup>
            <ButtonGroupText className="font-mono">
                {eventList} / {firstEvent}
            </ButtonGroupText>
            <EventListSettingsPopover eventList={eventList} firstEvent={firstEvent} setEventList={setEventList} setFirstEvent={setFirstEvent} />
        </ButtonGroup>
    </Field>;
}

interface EventListFieldProps {
    eventList: number;
    firstEvent: number;
    setEventList: (eventList: number) => void;
    setFirstEvent: (firstEvent: number) => void;
}

export default EventListField
export { EventListSettingsPopover, type EventListFieldProps }