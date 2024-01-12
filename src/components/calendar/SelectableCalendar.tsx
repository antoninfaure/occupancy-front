import CalendarRoot from "./Root"

const SelectableCalendar = ({
    sendSlots,
    startHour = 8,
    endHour = 20,
    slotsGap = 60,
    enablePosition = true,
    setEnablePosition = () => { }
}: {
    sendSlots: (slots: any[]) => Promise<void>,
    startHour?: number,
    endHour?: number,
    slotsGap?: number,
    enablePosition?: boolean,
    setEnablePosition?: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    const initialDate = new Date();
    return (
        <CalendarRoot
            loading={false}
            startHour={startHour}
            endHour={endHour}
            legend={false}
            slotsGap={slotsGap}
            selectable={true}
            sendSlots={sendSlots}
            allowedModes={["week", "3 days", "day"]}
            initialDate={initialDate}
            enablePosition={enablePosition}
            setEnablePosition={setEnablePosition}
            weekend={true}
        />
    );
}

export default SelectableCalendar