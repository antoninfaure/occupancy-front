import { Link } from "react-router-dom";

export default function Event({
    schedule,
    style,
    displayDate = false,
    displayTime = false,
    updateSheet = () => { },
}: {
    schedule: any;
    style: React.CSSProperties,
    displayDate?: boolean,
    displayTime?: boolean,
    updateSheet?: (content: any) => void,
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
    startDateTime.setHours(startDateTime.getUTCHours())
    const endDateTime = new Date(schedule.end_datetime);
    endDateTime.setHours(endDateTime.getUTCHours())

    return (
        <div  className="flex flex-col col-span-3 overflow-x-auto px-3 pb-1.5 pt-0.5">
            {
                schedule?.course ? (
                    <>
                        {displayDate ? (
                            <span className="mb-1 mt-2">
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
                            className={`${borderStyle} flex flex-col h-full border-l-[6px] border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-2 w-full max-w-screen-md hover:bg-primary/10 dark:hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}
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
                                </div>
                            ) : null
                            }
                            {displayTime && schedule.rooms && schedule.rooms.length > 0 && (<hr className="mt-2 mb-1.5" />)}
                            <div className="text-sm leading-snug text-muted-foreground">
                                {schedule.rooms?.sort((a: any, b: any) => {
                                    if (a.name < b.name) { return -1; }
                                    if (a.name > b.name) { return 1; }
                                    return 0;
                                }).slice(0, 3).map((room: any) => room.name).join(", ")}
                                {schedule.rooms?.length > 3 && (
                                    <span className="text-muted-foreground ml-1">+{schedule.rooms?.length - 3} more</span>
                                )}
                            </div>
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
                        {
                            schedule.rooms ? (
                                <div
                                    className={`${borderStyle} h-full border-l-[6px] border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-2 w-full cursor-pointer hover:bg-primary/10 dark:hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}
                                    onClick={() => updateSheet(schedule)}
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
                                    <div className="text-sm leading-snug flex flex-col gap-1.5 pt-1" >
                                        {schedule.rooms?.sort((a: any, b: any) => {
                                            if (a.name < b.name) { return -1; }
                                            if (a.name > b.name) { return 1; }
                                            return 0;
                                        }).slice(0, 3).map((room: any, index: number) => (
                                            <span key={index} className="text-muted-foreground">{room.name}</span>
                                        ))}
                                        {schedule.rooms?.length > 3 && (
                                            <span className="text-muted-foreground">+{schedule.rooms?.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={style}
                                    className={`col-span-3 ${borderStyle} border-l-[6px] border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-2 w-full hover:bg-primary/10 dark:hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}
                                >
                                    <span>
                                        {schedule?.name}
                                    </span>
                                    <div className="text-sm leading-snug text-muted-foreground">Event from ewa</div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    );
}
