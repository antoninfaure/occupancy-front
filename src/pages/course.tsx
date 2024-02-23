import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourse } from '@/api/courses';
import BaseCalendar from '@/components/calendar/Base';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const Room = () => {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);

    document.title = `Occupancy FLEP${course ? (' - ' + course.name) : ''}`;

    async function findSoonestDate(schedules: any) {
        // Find the soonest date with a schedule greater than now
        if (!schedules) return null;
        let soonestDate = await schedules
            .filter((schedule: any) => schedule.start_datetime > new Date())
            .reduce((acc: any, schedule: any) => {
            if (!schedule.start_datetime) return acc;
            const startDateTime = new Date(schedule.start_datetime);
            if (startDateTime < new Date()) return acc;
            if (startDateTime < acc) return startDateTime;
            return acc;
        }, new Date());

        return soonestDate;
    }

    const fetchCourse = useCallback(() => {
        setLoading(true);
        getCourse(code as string)
            .then(async (data: any) => {
                const soonestDate = await findSoonestDate(data.schedules);
                setInitialDate(soonestDate);
                // if semester.type is fall or spring, set the semesterType to fall or spring
                const semesterType = data?.studyplans.reduce((acc: any, studyplan: any) => {
                    if (studyplan.semester.type === 'fall') return 'fall';
                    if (studyplan.semester.type === 'spring') return 'spring';
                    return acc;
                }, 'year');
                setCourse({ ...data, semesterType });
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                // redirect to courses page
                const { origin } = window.location;
                window.location.href = `${origin}/courses`;

            })
    }, [code])

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse])

    const [sheetContent, setSheetContent] = useState<any>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetClass, setSheetClass] = useState("");

    const updateSheet = (content: any) => {
        if (!content) setSheetOpen(false);
        setSheetContent(content);
        setSheetOpen(true);

        const style = (() => {
            switch (content?.label) {
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

        setSheetClass(style);
    }

    return (
        <div className="flex w-full">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side={'left'} className={`border-l-8 border-r-0 pb-2 ${sheetClass}`}>
                    <SheetHeader className={`text-left`}>
                        <SheetTitle className={`text-2xl font-bold`}>
                            {(() => {
                                switch (sheetContent?.label) {
                                    case "cours":
                                        return "Course";
                                    case "projet":
                                        return "Project";
                                    case "exercice":
                                        return "Exercise";
                                    case "event":
                                        return "Event";
                                    default:
                                        return null;
                                }
                            })()}
                        </SheetTitle>
                        <SheetDescription>
                            {(sheetContent?.start_datetime && sheetContent?.end_datetime) && (
                                (() => {
                                    const startDateTime = new Date(sheetContent.start_datetime);
                                    const endDateTime = new Date(sheetContent.end_datetime);
                                    startDateTime.setHours(startDateTime.getUTCHours());
                                    endDateTime.setHours(endDateTime.getUTCHours());
                                    const hourOffset = startDateTime.getTimezoneOffset() / 60;
                                    return (
                                        <div className='flex flex-col gap-1'>
                                            <span>{startDateTime.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                            </span>
                                            <span>
                                                {
                                                    startDateTime.getUTCHours() - hourOffset === 0 ? '00' : startDateTime.getUTCHours() - hourOffset
                                                }:{
                                                    startDateTime.getMinutes() === 0 ? '00' : startDateTime.getMinutes()
                                                } - {
                                                    endDateTime.getUTCHours() - hourOffset === 0 ? '00' : endDateTime.getUTCHours() - hourOffset
                                                }:{
                                                    endDateTime.getUTCMinutes() === 0 ? '00' : endDateTime.getUTCMinutes()
                                                }
                                            </span>
                                        </div>

                                    )
                                })()
                            )}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 py-4 w-full">
                        <hr />
                        {(sheetContent?.rooms && sheetContent?.rooms?.length > 0) ? (
                            <>
                                <span className='font-bold'>
                                    Rooms
                                </span>
                                {sheetContent?.rooms?.map((room: any, index: number) => (
                                    <Link to={`/rooms/${room.name}`} key={index}
                                        className="flex bg-accent hover:bg-accent-foreground/10 dark:hover:bg-accent-foreground/20 rounded-md p-2 w-full">
                                        <span className="text-muted-foreground">{room.name}</span>
                                    </Link>
                                ))}
                            </>
                        ) : <span className='text-muted-foreground'>No rooms</span>}
                    </div>
                </SheetContent>
                <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-2">
                        <div className='flex flex-col gap-1 w-full md:w-1/2'>
                            {!loading ? (
                                <h1 className="text-3xl font-bold">
                                    {course?.name}
                                </h1>) : (
                                <Skeleton className='h-10 w-1/2 md:w-full' />
                            )}
                            {!loading ? (
                                <h4 className="text-muted-foreground">

                                    {course?.code} / <span className='text-accent-foreground font-semibold'>{course?.credits} ECTS</span></h4>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Skeleton className='h-5 w-20' /> / <Skeleton className='h-5 w-32' />
                                </div>
                            )}

                            {!loading ?
                                (course?.teachers && course?.teachers?.length > 0) ? (
                                    <div className='flex flex-col lg:flex-row gap-1'>
                                        <span className='font-bold'>Teachers:</span>
                                        {course?.teachers?.map((teacher: any, index: number) => (
                                            <Link to={teacher.people_url} target='_blank' rel='noopener noreferrer' key={index}
                                                className="text-muted-foreground underline hover:decoration-red-600 hover:text-red-600/90">
                                                {teacher.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null : (
                                    <div className='flex flex-col lg:flex-row gap-1 mt-1'>
                                        <Skeleton className='h-5 w-28' />
                                    </div>
                                )
                            }

                            {!loading ? (
                                course?.language && (
                                    <span className='font-bold flex items-center gap-1'>
                                        Language: <span className='font-normal text-muted-foreground'>{course?.language}</span>
                                    </span>
                                )
                            ) : (
                                <span className='font-bold flex items-center gap-1 mt-1'>
                                    <Skeleton className='h-5 w-20' />
                                </span>
                            )}
                            {!loading ? (
                                <span className=' mt-1'>
                                    {
                                        course?.semesterType === 'fall' ?
                                            <Badge className='mr-2 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700'>
                                                Fall
                                            </Badge>
                                            :
                                            course?.semesterType === 'spring' ?
                                                <Badge className='mr-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-700'>
                                                    Spring
                                                </Badge>
                                                :
                                                course?.semesterType === 'year' ?
                                                    <Badge className='mr-2 py-1 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-400 hover:text-zinc-800'>
                                                        Year
                                                    </Badge>
                                                    :
                                                    null
                                    }
                                </span>
                            ) : (
                                <span className=' mt-1'>
                                    <Skeleton className='h-6 w-12 rounded-full' />
                                </span>
                            )}
                        </div>
                        {(!loading && course?.edu_url) ? (
                            <Link
                                to={course?.edu_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600 flex">
                                See on Edu
                            </Link>
                        ) : null}
                    </div>
                    <Tabs defaultValue="schedules" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="schedules">
                                Schedules
                            </TabsTrigger>
                            <TabsTrigger value="studyplans">
                                Study Plans
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedules" className='pt-4'>
                            {course?.schedules?.length === 0 ? (
                                <div className='flex flex-col items-center gap-2'>
                                    <span className='text-2xl font-bold'>No schedules</span>
                                    <span className='text-muted-foreground'>This course has no schedules (yet)</span>
                                </div>
                            ) : (
                                <BaseCalendar
                                    schedules={course?.schedules}
                                    initialDate={initialDate}
                                    loading={loading}
                                    updateSheet={updateSheet}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="studyplans">
                            <div className="flex flex-col gap-2">
                                {course?.studyplans?.sort((a: any, b: any) => a.unit?.name.localeCompare(b.unit?.name)).map((studyplan: any, index: number) => (
                                    <Link
                                        key={index}
                                        to={`/studyplans/${studyplan._id}`}
                                        className="flex flex-col gap-1  border-l-[6px] border-black dark:border-accen border-solid pl-2 pr-3 bg-accent/50 rounded py-2 w-full hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out">

                                        <span className="text-xl font-bold"
                                        >{studyplan.unit.name.split('-').slice(0, -1).join('-')}</span>
                                        <span className="text-muted-foreground"
                                        >{studyplan.unit.name.split('-').slice(-1)}</span>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Sheet>
        </div>
    )
}

export default Room;