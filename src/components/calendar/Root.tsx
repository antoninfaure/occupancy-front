import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import Day from "./Day"
import Event from "./Event"

export default function CalendarRoot({
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
    allowedModes = ["week", "3 days", "day", "list"],
    enablePosition = true,
    weekend = false,
    setEnablePosition = () => { },
    updateSheet = () => { },
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
    allowedModes?: string[],
    enablePosition?: boolean,
    weekend?: boolean,
    setEnablePosition?: React.Dispatch<React.SetStateAction<boolean>>,
    updateSheet?: (content: any) => void,
}) {

    const [date, setDate] = useState<Date | undefined>(initialDate)
    const [currentMonth, setCurrentMonth] = useState<Date | undefined>(initialDate)
    const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(initialDate)
    const [displayedDates, setDisplayedDates] = useState<Date[]>([])
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
    let modes = [] as ("week" | "3 days" | "day" | "list")[]
    if (window.innerWidth < 800) {
        modes = ["day", "list"].filter((mode) => allowedModes?.includes(mode)) as ("day" | "list")[]
    } else {
        modes = ["week", "3 days", "day", "list"].filter((mode) => allowedModes?.includes(mode)) as ("week" | "3 days" | "day" | "list")[]
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth < 800) {
            if (isMobile) return;
            modes = ["day", "list"].filter(
                (mode) => allowedModes?.includes(mode)
            ) as ("day" | "list")[]
            console.log(modes)
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
            const day = date.getDay() > 0 ? date.getDay() - 1 : 6
            const first = date.getDate() - day
            const firstDayOfWeek = new Date(date);
            firstDayOfWeek.setDate(first);
            // Create an array of 5 days (7 if weekend) starting from the first day of the week
            const dates = Array.from({ length: weekend ? 7 : 5 }).reduce((acc: Date[], _, i) => {
                const newDate = new Date(firstDayOfWeek);
                newDate.setDate(first + i);
                return [...acc, newDate]
            }, [] as Date[])

            setDisplayedDates(dates);

        } else if (mode === "3 days") {
            // Set the displayed dates as the selected date and the 2 following days
            if (!date) return;
            const startDate = new Date(date);
            const dates = Array.from({ length: 3 }, (_, i) => {
                const newDate = new Date(startDate);
                newDate.setDate(startDate.getDate() + i)
                return newDate;
            });
            setDisplayedDates(dates);

        } else if (mode === "day") {
            // Set the displayed dates as the selected date
            if (!date) return;
            setDisplayedDates([date])

        }

    }, [mode, date])


    return (
        <div className="flex flex-col md:flex-row justify-between w-full gap-1">
            <div className={`flex order-2 md:order-1 flex-col w-full overflow-x-auto mt-6 md:mt-0 ${mode === 'list' ? 'p-4' : 'pr-12'} md:pr-4`}>
                <div className="flex justify-between w-full px-6">
                    {(legend && mode === 'list') ? (
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
                            displayedDates.map((date, index: number) => (
                                <Day
                                    style={{
                                        border: (index == (displayedDates.length - 1)) ? 'none' : undefined
                                    }}
                                    key={index}
                                    date={date}
                                    schedules={filterSchedulesByDate(date, schedules)}
                                    slotsGap={slotsGap}
                                    startHour={startHour}
                                    endHour={endHour}
                                    seletable={selectable}
                                    selectedSlots={selectedSlots}
                                    setSelectedSlots={setSelectedSlots}
                                    updateSheet={updateSheet}
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
                    <div className="flex order-1 md:order-2 flex-col mx-auto gap-2">
                        <CalendarUI
                            selected={date}
                            mode="single"
                            onSelect={(date: Date | undefined) => setDate(date)}
                            weekStartsOn={1}
                            defaultMonth={defaultMonth}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="md:pl-4 mx-auto"
                            modifiers={{ highlighted: displayedDates }}
                            modifiersClassNames={{ highlighted: 'bg-accent', today: '!bg-red-600 !text-white' }}
                        />
                        {legend ? (
                            <div className="flex flex-col items-start gap-2">

                                <div className="flex gap-1 items-center">
                                    <span className="h-4 w-4 bg-[#ff0000]"></span> <span className="text-sm leading-snug text-muted-foreground">Course</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="h-4 w-4 bg-[#b51f1f]">
                                    </span> <span className="text-sm leading-snug text-muted-foreground">Exercise</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="h-4 w-4 bg-[#8e0000]"></span> <span className="text-sm leading-snug text-muted-foreground">Project</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="h-4 w-4 bg-[#5B248F]"></span> <span className="text-sm leading-snug text-muted-foreground">Other</span>
                                </div>
                            </div>) : <div></div>}
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
                                    className={`w-full ${selectedSlots.length === 0 ? 'bg-muted text-muted-foreground' : 'bg-red-600 dark:text-primary hover:bg-red-700'}`}>
                                    Find a room
                                </Button>
                                <div className="flex items-center justify-end gap-3 mt-2">
                                    <Label htmlFor="enable-position" className="text-md font-medium leading-snug text-muted-foreground flex items-center gap-1">
                                        Position {enablePosition ? 'enabled' : 'disabled'}
                                    </Label>
                                    <Switch
                                        checked={enablePosition}
                                        onCheckedChange={setEnablePosition}
                                        id="enable-position"
                                        className="data-[state=checked]:[&>*]:bg-background [&>*]:bg-primary scale-125 mr-1"
                                    />

                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null
            )}
        </div>
    )
}
