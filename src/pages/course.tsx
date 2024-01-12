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

const Room = () => {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);

    document.title = `Occupancy EPFL${course ? (' - ' + course.name) : ''}`;

    async function findSoonestDate(schedules: any) {
        // Find the soonest date with a schedule greater than now
        let soonestDate = await schedules.reduce((acc: any, schedule: any) => {
            const startDateTime = new Date(schedule.start_datetime);
            if (startDateTime < new Date()) return acc;
            if (startDateTime < acc) return startDateTime;
            return acc;
        }, new Date(schedules[0].start_datetime));

        return soonestDate;
    }

    const fetchCourse = useCallback(() => {
        setLoading(true);
        getCourse(code as string)
            .then(async (data: any) => {
                const soonestDate = await findSoonestDate(data.schedules);
                setInitialDate(soonestDate);
                setCourse(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                // redirect to courses page
                //window.location.href = PUBLIC_URL + '/courses';

            })
    }, [code])

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse])

    const [sheetContent, setSheetContent] = useState<any>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const updateSheet = (content: any) => {
        if (!content) setSheetOpen(false);
        setSheetContent(content);
        setSheetOpen(true);
    }

    return (
        <div className="flex w-full">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side={'left'}>
                    <SheetHeader className='text-left'>
                        <SheetTitle className='text-2xl font-bold'>
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
                                <>
                                    {new Date(sheetContent.start_datetime).toLocaleDateString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} - {new Date(sheetContent.end_datetime).toLocaleDateString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </>
                            )}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 py-4 w-full">
                        {sheetContent?.rooms?.map((room: any, index: number) => (
                            <Link to={`/rooms/${room.name}`} key={index}
                                className="flex bg-accent hover:bg-accent-foreground/10 dark:hover:bg-accent-foreground/20 rounded-md p-2 w-full">
                                <span className="text-muted-foreground">{room.name}</span>
                            </Link>
                        ))}
                    </div>
                </SheetContent>
                <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-2">
                        <div className='flex flex-col gap-1 w-full'>
                            {!loading ? (
                                <h1 className="text-3xl font-bold">
                                    {course?.name}
                                </h1>) : (
                                <Skeleton className='h-10 w-1/2' />
                            )}
                            {!loading ? (
                                <h4 className="text-muted-foreground">

                                    {course?.code} / <span className='text-accent-foreground font-semibold'>{course?.credits} ECTS</span></h4>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Skeleton className='h-5 w-20' /> / <Skeleton className='h-5 w-32' />
                                </div>
                            )}
                            <div className='flex flex-col lg:flex-row gap-1'>
                                <span className='font-bold'>Teachers:</span>
                                {!loading ?
                                    course?.teachers?.map((teacher: any, index: number) => (
                                        <Link to={teacher.people_url} target='_blanl' rel='noreferrer' key={index}
                                            className="text-muted-foreground underline hover:decoration-red-600 hover:text-red-600/90">
                                            {teacher.name}
                                        </Link>
                                    )) : (
                                        <Skeleton className='h-4 w-28' />
                                    )}
                            </div>

                            <span className='font-bold flex items-center gap-1'>Language: {!loading ? (<span className='font-normal text-muted-foreground'>{course?.language}</span>) : <Skeleton className='h-4 w-20' />}</span>
                        </div>
                        {(!loading && course?.edu_url) ? (
                        <Link to={course?.edu_url} className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600">
                            See on Edu
                        </Link>
                        ): null}
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
                            <BaseCalendar
                                schedules={course?.schedules}
                                initialDate={initialDate}
                                loading={loading}
                                updateSheet={updateSheet}
                            />
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