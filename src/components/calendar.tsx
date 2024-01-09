import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"


function Event({
    schedule,
    slotsGap,
    dayStartHour
}: {
    schedule: any;
    slotsGap: number;
    dayStartHour: number
}) {

    const startDateTime = new Date(schedule.start_datetime);
    const endDateTime = new Date(schedule.end_datetime);

    const startHour = startDateTime.getHours() - 1
    const startMinute = startDateTime.getMinutes();
    const endHour = endDateTime.getHours() - 1
    const endMinute = endDateTime.getMinutes()
    const rowSpan = ((endHour - startHour) * 60 + (endMinute - startMinute)) / slotsGap

    // Calculate the available row for this event in the column
    const totalMinutes = (startHour - dayStartHour) * 60 + startMinute;

    // Calculate the row index based on the time slot gap
    const rowIndex = Math.floor(totalMinutes / slotsGap);


    const borderStyle = (() => {
        switch (schedule.label) {
            case "cours":
                return "border-[#ff0000]";
            case "projet":
                return "border-[#8e0000]";
            case "exercice":
                return "border-[#b51f1f]";
            default:
                return "border-[#5B248F]";
        }
    })();

    const eventStyles = {
        gridRowStart: rowIndex,
        gridRowEnd: rowIndex + rowSpan,
    };


    return (
        <div
            style={eventStyles}
            className={`col-span-1 ${borderStyle} border-l-[5px] border-solid pl-2 pr-3 bg-accent/50 rounded py-2 w-100`}
        >
            {schedule?.course && (<div>{schedule.course.name}</div>)}
            <div className="text-sm leading-snug text-muted-foreground">{schedule.rooms.map((room: any) => room.name).join(", ")}</div>
        </div>
    );
}

function Day({
    date,
    schedules,
    slotsGap,
    startHour,
    endHour,
}: {
    date: Date;
    schedules: any[]; // Replace 'any[]' with your actual schedule data type
    slotsGap: number;
    startHour: number;
    endHour: number;
}) {
    const totalRows = ((endHour - startHour) * 60) / slotsGap;
    
    // get the maximum number of schedules the same time
    const totalColumns = schedules.reduce((max, schedule) => {
        const startDateTime = new Date(schedule.start_datetime);
        const endDateTime = new Date(schedule.end_datetime);

        const startHour = startDateTime.getHours();
        const startMinute = startDateTime.getMinutes();
        const endHour = endDateTime.getHours();
        const endMinute = endDateTime.getMinutes();

        const rowSpan = ((endHour - startHour) * 60 + (endMinute - startMinute)) / slotsGap + 1;

        return Math.max(max, rowSpan);
    }, 0);

    return (
        <div className={`grid col-span-3 grid-cols-${totalColumns} gap-4 p-4 w-100 grid-rows-subgrid row-span-${totalRows}`}>
            {schedules.map((schedule, index) => (
                <Event
                    key={index}
                    schedule={schedule}
                    slotsGap={slotsGap}
                    dayStartHour={startHour}
                />
            ))}
        </div>
    );
}

const Calendar = ({
    schedules,
    initialDate = new Date(),
}: {
    schedules: any[],
    initialDate?: Date
}) => {

    const [dates, setDates] = useState<Date | undefined>(initialDate)
    const slotGap = 60; // minutes

    const startHour = 8
    const endHour = 20

    const totalRows = ((endHour - startHour) * 60) / slotGap

    function filterSchedulesByDate(date: Date, schedules: any[]) {
        return schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.start_datetime);
            return (
                scheduleDate.getDate() === date.getDate() &&
                scheduleDate.getMonth() === date.getMonth() &&
                scheduleDate.getFullYear() === date.getFullYear()
            );
        });
    }



    return (
        <div className="flex">
            <div className="flex flex-col w-100">
                <div className={`grid grid-rows-${totalRows} grid-cols-7 gap-4 p-4 w-100`}>
                
                    {Array.from({ length: totalRows }).map((_, rowIndex) => {
                        const cellStyle = {
                            gridRowStart: rowIndex,
                            gridRowEnd: rowIndex + 1
                        }
                        const currentHour = startHour + rowIndex
                        return (
                            <div key={rowIndex} style={cellStyle} className="text-end text-sm leading-snug text-muted-foreground">
                                <span className="border-t-2 pt-0.5">{currentHour}:00</span>
                            </div>
                        )
                    })}
                    <Day
                        date={new Date(2024, 2, 19)}
                        schedules={filterSchedulesByDate(new Date(2024, 2, 19), schedules)}
                        slotsGap={slotGap}
                        startHour={startHour}
                        endHour={endHour}
                    />
                </div>
            </div>
            <CalendarUI
                selected={dates}
                mode="single"
                onSelect={(date: Date | undefined) => setDates(date)}
            />
        </div>
    )
}

export default Calendar

