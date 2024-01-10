import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom";


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
        gridRowStart: rowIndex + 1,
        gridRowEnd: rowIndex + rowSpan + 1,
    };

    return (
        schedule?.course ? (
            <Link
                to={`/courses/${schedule.course?.code}`}
                style={eventStyles}
                className={`col-span-3 ${borderStyle} border-l-[5px] border-solid pl-2 pr-3 bg-accent/50 rounded py-2 w-full hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}
            >
                {schedule?.course && (<div>{schedule.course.name}</div>)}
                {schedule?.course && (<div className="text-sm leading-snug text-muted-foreground">{schedule.course.code}</div>)}
                {schedule.rooms && schedule.rooms.length > 0 && (<hr className="my-2" />)}
                <div className="text-sm leading-snug text-muted-foreground">{schedule.rooms?.map((room: any) => room.name).join(", ")}</div>
            </Link>
        ) : (
            <div
                style={eventStyles}
                className={`col-span-3 ${borderStyle} border-l-[5px] border-solid pl-2 pr-3 bg-accent/50 rounded py-2 w-full`}
            >
                <div className="text-sm leading-snug text-muted-foreground flex flex-col gap-1.5">
                    {schedule.rooms?.map((room: any) => {
                        return (
                            <Link
                                key={room.id}
                                to={`/rooms/${room.name}`}
                                className="hover:text-accent/100 hover:underline"
                            >
                                {room.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        )
    );
}

function Day({
    date,
    schedules,
    slotsGap,
    startHour,
    endHour,
}: {
    date: Date | undefined;
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

        const startHour = startDateTime.getHours() - 1
        const startMinute = startDateTime.getMinutes();
        const endHour = endDateTime.getHours() - 1
        const endMinute = endDateTime.getMinutes();

        const rowSpan = ((endHour - startHour) * 60 + (endMinute - startMinute)) / slotsGap + 1;

        return Math.max(max, rowSpan);
    }, 0);

    const style = {
        gridRowStart: 1,
        gridRowEnd: totalRows + 1,
    }

    return (
        <div style={style} className={`grid col-span-3 grid-cols-${totalColumns} w-full grid-rows-subgrid`}>
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
    loading = false,
    startHour = 8,
    endHour = 20,
    slotsGap = 60
}: {
    schedules: any[],
    initialDate?: Date,
    loading?: boolean,
    startHour?: number,
    endHour?: number,
    slotsGap?: number
}) => {

    const [date, setDate] = useState<Date | undefined>(initialDate)

    const [defaultDate, setDefaultDate] = useState<Date | undefined>(initialDate)

    useEffect(() => {
        setDate(initialDate)
    }, [initialDate])

    useEffect(() => {
        setDefaultDate(initialDate)
    }, [initialDate])

    const totalRows = ((endHour - startHour) * 60) / slotsGap

    function filterSchedulesByDate(date: Date | undefined, schedules: any[]) {
        if (!date) return [];
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
        <div className="flex justify-between w-full">
            <div className="flex flex-col w-full">
                <div className="px-8">
                    <span>{date?.toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
                <div className={`inline-grid grid-rows-${totalRows} gap-y-1.5 gap-x-3 grid-cols-auto p-4 w-full`}>
                    {Array.from({ length: totalRows }).map((_, rowIndex) => {
                        const cellStyle = {
                            gridRowStart: rowIndex,
                            gridRowEnd: rowIndex + 1
                        }
                        const currentHour = startHour + rowIndex
                        return (
                            <div key={rowIndex} style={cellStyle} className="text-end text-sm leading-snug text-muted-foreground pb-4 w-12">
                                <span className="border-t-2 pt-0.5">{currentHour}:00</span>
                            </div>
                        )
                    })}
                    {loading ? (
                        Array.from({ length: totalRows }).map((_, rowIndex) => {
                            const cellStyle = {
                                gridRowStart: rowIndex,
                                gridRowEnd: rowIndex + 1
                            }
                            return (
                                <div key={rowIndex} style={cellStyle} className="flex justify-center items-center col-span-3">
                                    <Skeleton className="w-full h-10" />
                                </div>
                            )
                        })
                    ) : (
                        <Day
                            key={date?.toString()}
                            date={date}
                            schedules={filterSchedulesByDate(date, schedules)}
                            slotsGap={slotsGap}
                            startHour={startHour}
                            endHour={endHour}
                        />
                    )}
                </div>
            </div>
            <CalendarUI
                selected={date}
                mode="single"
                onSelect={(date: Date | undefined) => setDate(date)}
                defaultMonth={defaultDate}
                weekStartsOn={1}
            />
        </div>
    )
}

export default Calendar

