import { CSSProperties } from "react";
import Event from "./Event";

export default function Day({
    date,
    schedules = [],
    slotsGap,
    startHour,
    endHour,
    seletable = false,
    selectedSlots = [],
    setSelectedSlots = () => { },
    updateSheet = () => { },
    style
}: {
    date: Date | undefined;
    schedules?: any[]; // Replace 'any[]' with your actual schedule data type
    slotsGap: number;
    startHour: number;
    endHour: number;
    seletable?: boolean,
    selectedSlots?: any[],
    setSelectedSlots?: React.Dispatch<React.SetStateAction<any[]>>,
    updateSheet?: (content: any) => void,
    style?: React.CSSProperties
}) {
    const totalRows = ((endHour - startHour) * 60) / slotsGap;

    const currentHourClass = 'border-t-2 border-[#f00]'

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

    const styleDay: CSSProperties = {
        gridRowStart: 1,
        gridRowEnd: totalRows + 2
    }

    return (
        <div style={{ ...style, ...styleDay }} className={`grid col-span-3 grid-cols-${totalColumns} gap-0 gap-x-0 gap-y-0 w-full grid-rows-subgrid ${!seletable && 'border-r-2 border-muted'}` }>
            <div style={{
                gridRowStart: 1,
                gridColumnStart: 1,
                gridColumnEnd: totalColumns * 3 + 1,
            }} className={`text-center mb-3 px-3 text-muted-foreground w-full`}>
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

                    const eventStartHour = startDateTime.getUTCHours()
                    const eventStartMinute = startDateTime.getUTCMinutes();
                    const eventEndHour = endDateTime.getUTCHours()
                    const eventEndMinute = endDateTime.getUTCMinutes()
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
                            updateSheet={updateSheet}
                        />
                    )
                })
                // add an empty cell at the current hour if the current hour is not in the schedule
                .concat(new Date().getHours() >= startHour && new Date().getHours() < endHour ? (
                    <div style={{
                        gridRowStart: new Date().getHours() - startHour + 2,
                        gridRowEnd: new Date().getHours() - startHour + 3
                    }} className={"text-end text-sm leading-snug text-muted-foreground w-full col-span-3 " + currentHourClass}>
                    </div>
                ) : [])
                
                
                
                ) : (
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
                            slotDate.getUTCHours() === startHour + rowIndex + slotDate.getTimezoneOffset() / 60 + 2  &&
                            slotDate.getUTCMinutes() === 0 &&
                            slotDate.getUTCSeconds() === 0
                        )
                    })) {
                        return (
                            <div key={rowIndex} style={cellStyle} className={"cursor-pointer text-end text-sm leading-snug text-muted-foreground w-full " + (new Date().getHours() == rowIndex + startHour ? currentHourClass : '')}>
                                <div className="border-r-2 border-muted py-2 px-3 w-full">
                                    <div className="w-full h-10 cursor-pointer rounded-md bg-red-600 hover:bg-red-800" onClick={() => {
                                        // Remove the selected slot
                                        const newSelectedSlots = selectedSlots.filter((slot) => {
                                            const slotDate = new Date(slot.start_datetime)
                                            return (
                                                slotDate.getDate() !== date?.getDate() ||
                                                slotDate.getMonth() !== date?.getMonth() ||
                                                slotDate.getFullYear() !== date?.getFullYear() ||
                                                slotDate.getUTCHours() !== startHour + rowIndex + slotDate.getTimezoneOffset() / 60 + 2 ||
                                                slotDate.getUTCMinutes() !== 0 ||
                                                slotDate.getUTCSeconds() !== 0
                                            )
                                        })
                                        setSelectedSlots(newSelectedSlots)
                                    }} />
                                </div>
                            </div>
                        )
                    }
                    // if the slot is before the current date and time, return a disabled cell
                    const currentDateTime = new Date()
                    const hoursOffset = currentDateTime.getTimezoneOffset() / 60
                    currentDateTime.setMinutes(0, 0, 0)
                    currentDateTime.setHours(currentDateTime.getUTCHours() - hoursOffset)

                    const slotDateTime = new Date(date as Date)
                    slotDateTime.setHours(startHour + rowIndex)
                    if (currentDateTime > slotDateTime) {
                        return (
                            <div key={rowIndex} style={cellStyle} className={"text-end text-sm leading-snug text-muted-foreground w-full h-full " + (new Date().getHours() === rowIndex + startHour ? currentHourClass : '')}>
                                <div className="border-r-2 border-muted py-2 px-3 w-full h-full">
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div key={rowIndex} style={cellStyle} className={"text-end text-sm leading-snug text-muted-foreground w-full " + (new Date().getHours() === rowIndex + startHour ? currentHourClass : '')}>
                            <div className="border-r-2 border-muted py-2 px-3 w-full">
                                <div className="w-full h-10 cursor-pointer bg-primary/10 hover:bg-primary/20 rounded-md" onClick={() => {
                                    const newDate = new Date(date as Date)
                                    newDate.setHours(startHour + rowIndex - hoursOffset)
                                    newDate.setMinutes(0)
                                    newDate.setSeconds(0)
                                    newDate.setMilliseconds(0)

                                    const endDateTime = new Date(newDate)
                                    endDateTime.setHours(startHour + rowIndex - hoursOffset + 1)
                                    setSelectedSlots([...selectedSlots, {
                                        start_datetime: newDate.toISOString(),
                                        end_datetime: endDateTime.toISOString(),
                                    }])
                                }} />
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
}