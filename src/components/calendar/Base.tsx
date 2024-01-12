import CalendarRoot from "./Root"

export const BaseCalendar = ({
    schedules,
    initialDate = new Date(),
    loading = true,
    startHour = 8,
    endHour = 20,
    slotsGap = 60,
    defaultMode = window.innerWidth < 800 ? "day" : "week",
    updateSheet = () => { },
}: {
    schedules: any[],
    initialDate?: Date,
    loading?: boolean,
    startHour?: number,
    endHour?: number,
    slotsGap?: number,
    defaultMode?: "week" | "day" | "3 days" | "list",
    updateSheet?: (content: any) => void,
}) => {
    return (

        <CalendarRoot
            schedules={schedules}
            initialDate={initialDate}
            loading={loading}
            startHour={startHour}
            endHour={endHour}
            slotsGap={slotsGap}
            defaultMode={defaultMode}
            selectable={false}
            updateSheet={updateSheet}
        />

    )
};

export default BaseCalendar;