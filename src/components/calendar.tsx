import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    ChevronDownIcon,
} from "@radix-ui/react-icons"

export function Event({
    schedule,
    style,
    displayDate = false,
    displayTime = false
}: {
    schedule: any;
    style: React.CSSProperties,
    displayDate?: boolean,
    displayTime?: boolean
}) {

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

    const startDateTime = new Date(schedule.start_datetime);
    startDateTime.setHours(startDateTime.getHours() - 1)
    const endDateTime = new Date(schedule.end_datetime);
    endDateTime.setHours(endDateTime.getHours() - 1)

    return (
        schedule?.course ? (
            <>
                {displayDate ? (
                    <span>
                        {schedule?.start_datetime && (
                            <span className="text-sm leading-snug text-muted-foreground">
                                {new Date(schedule.start_datetime).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                    </span>
                ) : null}
                <Link
                    to={`/courses/${schedule.course?.code}`}
                    style={style}
                    className={`col-span-3 overflow-x-auto ${borderStyle} border-l-[6px] border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-2 w-full max-w-screen-md hover:bg-primary/10 dark:hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}
                >

                    {schedule?.course && (<div>{schedule.course.name}</div>)}
                    {schedule?.course && (<div className="text-sm leading-snug text-muted-foreground">{schedule.course.code}</div>)}
                    {schedule.rooms && schedule.rooms.length > 0 && (<hr className="my-2" />)}
                    {displayTime ? (
                        <div className="text-sm leading-snug text-muted-foreground">
                            {startDateTime && (
                                <span>
                                    {startDateTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    {" - "}
                                </span>
                            )}
                            {endDateTime && (
                                <span>
                                    {endDateTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            )}
                            <hr className="mt-2 mb-1.5" />
                        </div>
                    ) : null
                    }
                    <div className="text-sm leading-snug text-muted-foreground">{schedule.rooms?.map((room: any) => room.name).join(", ")}</div>
                </Link>
            </>
        ) : (
            <>
                {displayDate ? (
                    <span>
                        {schedule?.start_datetime && (
                            <span className="text-sm leading-snug text-muted-foreground">
                                {new Date(schedule.start_datetime).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        )}
                    </span>
                ) : null}
                <div
                    style={style}
                    className={`col-span-3 ${borderStyle} border-l-[6px] border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-2 w-full`}
                >
                    {displayTime ? (
                        <div className="text-sm leading-snug text-muted-foreground">
                            {startDateTime && (
                                <span>
                                    {startDateTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    {" - "}
                                </span>
                            )}
                            {endDateTime && (
                                <span>
                                    {endDateTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            )}
                        </div>
                    ) : null
                    }
                    <div className="text-sm leading-snug flex flex-col gap-1.5 pt-1">
                        {schedule.rooms?.map((room: any) => {
                            return (
                                <Link
                                    key={room.id}
                                    to={`/rooms/${room.name}`}
                                    className="hover:underline"
                                >
                                    {room.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </>
        )
    );
}

export function Day({
    date,
    schedules = [],
    slotsGap,
    startHour,
    endHour,
    seletable = false,
    selectedSlots = [],
    setSelectedSlots = () => { }
}: {
    date: Date | undefined;
    schedules?: any[]; // Replace 'any[]' with your actual schedule data type
    slotsGap: number;
    startHour: number;
    endHour: number;
    seletable?: boolean,
    selectedSlots?: any[],
    setSelectedSlots?: React.Dispatch<React.SetStateAction<any[]>>
}) {
    const totalRows = ((endHour - startHour) * 60) / slotsGap;

    // get the maximum number of schedules that overlaps
    const totalColumns = ((schedules: any[]) => {
        let times = [] as any[];

        // Extracting start and end times from each schedule
        schedules.forEach(schedule => {
            const startDateTime = new Date(schedule.start_datetime);
            const endDateTime = new Date(schedule.end_datetime);

            times.push({ time: startDateTime, type: 'start' });
            times.push({ time: endDateTime, type: 'end' });
        });

        // Sorting the times
        times.sort((a, b) => a.time - b.time);

        let currentOverlap = 0;
        let maxOverlap = 0;

        // Sweeping through the times
        times.forEach(event => {
            if (event.type === 'start') {
                currentOverlap++;
                maxOverlap = Math.max(maxOverlap, currentOverlap);
            } else {
                currentOverlap--;
            }
        });

        return maxOverlap;
    })(schedules);

    const style = {
        gridRowStart: 1,
        gridRowEnd: totalRows + 2,
    }

    return (
        <div style={style} className={`grid col-span-3 grid-cols-${totalColumns} w-full grid-rows-subgrid border-r-2 pr-3 gap-3 border-muted`}>
            <div style={{
                gridRowStart: 1,
                gridColumnStart: 1,
                gridColumnEnd: totalColumns * 3 + 1,
            }} className={`text-center mb-3 text-muted-foreground w-full`}>
                <span className="w-full">
                    {date?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            </div>
            {!seletable ? (
                schedules.map((schedule, index) => {
                    const startDateTime = new Date(schedule.start_datetime);
                    const endDateTime = new Date(schedule.end_datetime);

                    const eventStartHour = startDateTime.getHours() - 1
                    const eventStartMinute = startDateTime.getMinutes();
                    const eventEndHour = endDateTime.getHours() - 1
                    const eventEndMinute = endDateTime.getMinutes()
                    const rowSpan = ((eventEndHour - eventStartHour) * 60 + (eventEndMinute - eventStartMinute)) / slotsGap

                    // Calculate the available row for this event in the column
                    const totalMinutes = (eventStartHour - startHour) * 60 + eventStartMinute;

                    // Calculate the row index based on the time slot gap
                    const rowIndex = Math.floor(totalMinutes / slotsGap);

                    const eventStyles = {
                        gridRowStart: rowIndex + 2,
                        gridRowEnd: rowIndex + rowSpan + 2,
                    };

                    return (
                        <Event
                            style={eventStyles}
                            key={index}
                            schedule={schedule}
                        />
                    )
                })) : (
                Array.from({ length: totalRows }).map((_, rowIndex) => {
                    const cellStyle = {
                        gridRowStart: rowIndex + 2,
                        gridRowEnd: rowIndex + 3
                    }
                    // if the cell is selected, return a selected cell
                    if (selectedSlots.find((slot) => {
                        const slotDate = new Date(slot.start_datetime)
                        return (
                            slotDate.getDate() === date?.getDate() &&
                            slotDate.getMonth() === date?.getMonth() &&
                            slotDate.getFullYear() === date?.getFullYear() &&
                            slotDate.getHours() === startHour + rowIndex + 1 &&
                            slotDate.getMinutes() === 0 &&
                            slotDate.getSeconds() === 0
                        )
                    })) {
                        return (
                            <div key={rowIndex} style={cellStyle} className="cursor-pointertext-end text-sm leading-snug text-muted-foreground pb-4 w-full">
                                <div className="w-full h-10 cursor-pointer rounded-md bg-red-600 hover:bg-red-800" onClick={() => {
                                    // Remove the selected slot
                                    const newSelectedSlots = selectedSlots.filter((slot) => {
                                        const slotDate = new Date(slot.start_datetime)
                                        return (
                                            slotDate.getDate() !== date?.getDate() ||
                                            slotDate.getMonth() !== date?.getMonth() ||
                                            slotDate.getFullYear() !== date?.getFullYear() ||
                                            slotDate.getHours() !== startHour + rowIndex + 1 ||
                                            slotDate.getMinutes() !== 0 ||
                                            slotDate.getSeconds() !== 0
                                        )
                                    })
                                    setSelectedSlots(newSelectedSlots)
                                }} />
                            </div>
                        )
                    }
                    // if the slot is before the current date and time, return a disabled cell
                    const currentDateTime = new Date()
                    currentDateTime.setMinutes(0, 0, 0)
                    currentDateTime.setHours(currentDateTime.getHours() + 1)

                    const slotDateTime = new Date(date as Date)
                    slotDateTime.setHours(startHour + rowIndex + 1)
                    if (currentDateTime > slotDateTime) {
                        return (
                            <div key={rowIndex} style={cellStyle} className="text-end text-sm leading-snug text-muted-foreground pb-4 w-full">

                            </div>
                        )
                    }
                    return (
                        <div key={rowIndex} style={cellStyle} className="text-end text-sm leading-snug text-muted-foreground pb-4 w-full">
                            <div className="w-full h-10 cursor-pointer bg-primary/10 hover:bg-primary/20 rounded-md" onClick={() => {
                                const newDate = new Date(date as Date)
                                newDate.setHours(startHour + rowIndex + 1)
                                newDate.setMinutes(0)
                                newDate.setSeconds(0)
                                newDate.setMilliseconds(0)

                                const endDateTime = new Date(newDate)
                                endDateTime.setHours(startHour + rowIndex + 2)
                                setSelectedSlots([...selectedSlots, {
                                    start_datetime: newDate.toISOString(),
                                    end_datetime: endDateTime.toISOString(),
                                }])
                            }} />
                        </div>
                    )
                })
            )}
        </div>
    );
}

const CalendarBase = ({
    schedules = [],
    initialDate = undefined,
    loading = true,
    startHour = 8,
    endHour = 20,
    slotsGap = 60,
    defaultMode = window.innerWidth < 800 ? "day" : "week",
    legend = true,
    selectable = false,
    sendSlots = Promise.resolve,
    allowedModes = ["week", "3 days", "day", "list"]
}: {
    schedules?: any[],
    initialDate?: Date | undefined,
    loading?: boolean,
    startHour?: number,
    endHour?: number,
    slotsGap?: number,
    legend?: boolean,
    defaultMode?: "week" | "day" | "3 days" | "list",
    selectable?: boolean,
    sendSlots?: (slots: any[]) => Promise<void>,
    allowedModes?: string[]
}) => {

    const [date, setDate] = useState<Date | undefined>(initialDate)
    const [currentMonth, setCurrentMonth] = useState<Date | undefined>(initialDate)
    const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(initialDate)
    const [displayedDates, setDisplayedDates] = useState<Date[] >([])
    const [selectedSlots, setSelectedSlots] = useState<any[]>([])
    const [mode, setMode] = useState(defaultMode)
    let isMobile = window.innerWidth < 800

    useEffect(() => {
        if (initialDate) {
            setDate(initialDate)
            setCurrentMonth(initialDate)
            setDefaultMonth(initialDate)
            setDisplayedDates([initialDate])
        }
    }, [initialDate])

    // if mobile possible modes are ["day"]
    // if desktop possible modes are ["week", "3 days", "day"]
    let modes = []
    if (window.innerWidth < 800) {
        modes = ["day"].filter((mode) => allowedModes?.includes(mode)) as ("day" | "list")[]
    } else {
        modes = ["week", "3 days", "day", "list"].filter((mode) => allowedModes?.includes(mode)) as ("week" | "3 days" | "day" | "list")[]
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth < 800) {
            if (isMobile) return;
            modes = ["day", "list"].filter(
                (mode) => allowedModes?.includes(mode)
            ) as ("day" | "list")[]
            setMode("day")
            isMobile = true
        } else {
            if (!isMobile) return;
            modes = ["week", "3 days", "day", "list"].filter(
                (mode) => allowedModes?.includes(mode)
            ) as ("week" | "3 days" | "day" | "list")[]
            setMode("week")
            isMobile = false
        }
    })

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

    useEffect(() => {
        if (mode === "week") {
            // Set the displayed dates as the dates of the week of the selected date
            if (!date) return;
            const day = date.getDay() - 1
            const first = date.getDate() - day
            const firstDayOfWeek = new Date(date);
            firstDayOfWeek.setDate(first);
            // Create an array of 5 days starting from the first day of the week
            const dates = Array.from({ length: 5 }).reduce((acc: Date[], _, i) => {
                const newDate = new Date(firstDayOfWeek);
                newDate.setDate(first + i);
                return [...acc, newDate]
            }, [] as Date[])

            setDisplayedDates(dates);

        } else if (mode === "3 days") {
            // Set the displayed dates as the selected date and the 2 following days
            if (!date) return;
            const startDate = new Date(date);
            const dates = Array.from({ length: 3 }, (_, i) => new Date(startDate.setDate(startDate.getDate() + i)));
            setDisplayedDates(dates);

        } else if (mode === "day") {
            // Set the displayed dates as the selected date
            if (!date) return;
            setDisplayedDates([date])

        }

    }, [mode, date])

    return (
        <div className="flex justify-between w-full gap-1">
            <div className="flex flex-col w-full overflow-x-auto">
                <div className="flex justify-between w-full px-6">
                    {legend ? (
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">

                            <div className="flex gap-1 items-center">
                                <span className="h-4 w-4 bg-[#ff0000]"></span> <span className="text-sm leading-snug text-muted-foreground">Cours</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="h-4 w-4 bg-[#b51f1f]">
                                </span> <span className="text-sm leading-snug text-muted-foreground">Exercice</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="h-4 w-4 bg-[#8e0000]"></span> <span className="text-sm leading-snug text-muted-foreground">Projet</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="h-4 w-4 bg-[#5B248F]"></span> <span className="text-sm leading-snug text-muted-foreground">Autre</span>
                            </div>
                        </div>) : <div></div>}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto capitalize">
                                {mode} <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {modes
                                .map((mode_: "week" | "day" | "3 days" | "list", index: number) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            className="capitalize"
                                            checked={mode === mode_}
                                            onCheckedChange={(_) =>
                                                setMode(mode_)
                                            }
                                        >
                                            {mode_}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className={`inline-grid grid-rows-${totalRows} gap-y-1.5 gap-x-3 grid-cols-auto p-4 w-full overflow-x-auto`}>
                    {mode !== "list" && (
                        Array.from({ length: totalRows }).map((_, rowIndex) => {
                            const cellStyle = {
                                gridRowStart: rowIndex + 2,
                                gridRowEnd: rowIndex + 3
                            }
                            const currentHour = startHour + rowIndex
                            return (
                                <div key={rowIndex} style={cellStyle} className="text-end text-sm leading-snug text-muted-foreground pb-4 w-full">
                                    <span className="border-t-2 pt-0.5">{currentHour}:00</span>
                                </div>
                            )
                        }))}
                    {loading ? (
                        <>
                            <div></div>
                            {
                                Array.from({ length: totalRows }).map((_, rowIndex) => {
                                    const cellStyle = {
                                        gridRowStart: rowIndex + 2,
                                        gridRowEnd: rowIndex + 3
                                    }
                                    return (
                                        <div key={rowIndex} style={cellStyle} className="flex justify-center items-center col-span-3">
                                            <Skeleton className="w-full h-10" />
                                        </div>
                                    )
                                })
                            }
                        </>
                    ) : (
                        mode === "list" ? (
                            <div className="flex flex-col gap-2 col-span-3">
                                {(() => {

                                    const sortedSchedules = schedules.sort((a, b) => {
                                        const aDate = new Date(a.start_datetime)
                                        const bDate = new Date(b.start_datetime)
                                        return aDate.getTime() - bDate.getTime()
                                    })
                                    let lastDate: Date | undefined = undefined

                                    return sortedSchedules.map((schedule, index) => {
                                        // If new day, display the date
                                        const scheduleDate = new Date(schedule.start_datetime)
                                        let displayDate = false
                                        if (lastDate && scheduleDate.getDate() !== lastDate.getDate()) {
                                            lastDate = scheduleDate
                                            displayDate = true
                                        } else if (!lastDate) {
                                            lastDate = scheduleDate
                                            displayDate = true
                                        }
                                        return (

                                            <Event
                                                key={index}
                                                schedule={schedule}
                                                style={{
                                                    gridRowStart: index + 2,
                                                    gridRowEnd: index + 3
                                                }}
                                                displayDate={displayDate}
                                                displayTime={true}
                                            />
                                        )
                                    })
                                })()}
                            </div>
                        ) : (
                            displayedDates.map((date) => (
                                <Day
                                    key={date?.toString()}
                                    date={date}
                                    schedules={filterSchedulesByDate(date, schedules)}
                                    slotsGap={slotsGap}
                                    startHour={startHour}
                                    endHour={endHour}
                                    seletable={selectable}
                                    selectedSlots={selectedSlots}
                                    setSelectedSlots={setSelectedSlots}
                                />
                            ))
                        )
                    )}
                </div>
            </div>
            {loading ? (
                <Skeleton className="w-96 h-96 m-4" />
            ) : (
                mode !== "list" ? (
                    <div className="flex flex-col gap-2">
                        <CalendarUI
                            selected={date}
                            mode="single"
                            onSelect={(date: Date | undefined) => setDate(date)}
                            weekStartsOn={1}
                            defaultMonth={defaultMonth}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="pl-4"
                        />
                        {selectable ? (
                            <div className="flex flex-col gap-2">
                                <Button 
                                    onClick={() => setSelectedSlots([])}
                                    disabled={selectedSlots.length === 0}
                                    className={`w-full ${selectedSlots.length === 0 ? 'bg-muted text-muted-foreground' : ''}`}
                                >
                                    Clear selection
                                </Button>
                                <Button 
                                    onClick={() => sendSlots(selectedSlots).finally(() => setSelectedSlots([]))}
                                    disabled={selectedSlots.length === 0}
                                    className={`w-full ${selectedSlots.length === 0 ? 'bg-muted text-muted-foreground' : 'bg-red-600 text-primary hover:bg-red-700'}`}>
                                    Find a room
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ) : null
            )}
        </div>
    )
}

const Calendar = ({
    schedules,
    initialDate = new Date(),
    loading = true,
    startHour = 8,
    endHour = 20,
    slotsGap = 60,
    defaultMode = window.innerWidth < 800 ? "day" : "week",
}: {
    schedules: any[],
    initialDate?: Date,
    loading?: boolean,
    startHour?: number,
    endHour?: number,
    slotsGap?: number,
    defaultMode?: "week" | "day" | "3 days" | "list"
}) => {
    return (

        <CalendarBase
            schedules={schedules}
            initialDate={initialDate}
            loading={loading}
            startHour={startHour}
            endHour={endHour}
            slotsGap={slotsGap}
            defaultMode={defaultMode}
            selectable={false}
        />

    )
}
export default Calendar


export const SelectableCalendar = ({
    sendSlots,
    startHour = 8,
    endHour = 20,
    slotsGap = 60,
}: {
    sendSlots: (slots: any[]) => Promise<void>,
    startHour?: number,
    endHour?: number,
    slotsGap?: number,
}) => {
    return (
        <CalendarBase
            loading={false}
            startHour={startHour}
            endHour={endHour}
            legend={false}
            slotsGap={slotsGap}
            selectable={true}
            sendSlots={sendSlots}
            allowedModes={["week", "3 days", "day"]}
            initialDate={new Date()}
        />
    );
}