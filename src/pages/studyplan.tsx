import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BaseCalendar from '@/components/calendar/Base';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { getStudyplan } from '@/api/studyplans';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Studyplan = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [studyplan, setStudyplan] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);

    document.title = `Occupancy EPFL${studyplan ? (' - ' + studyplan.unit?.name) : ''}`;

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

    const fetchStudyplan = useCallback(() => {
        setLoading(true);
        getStudyplan(id as string)
            .then(async (data: any) => {
                const soonestDate = await findSoonestDate(data.schedules);
                setInitialDate(soonestDate);
                setStudyplan(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                // redirect to courses page
                //window.location.href = PUBLIC_URL + '/courses';

            })
    }, [id])

    useEffect(() => {
        fetchStudyplan();
    }, [fetchStudyplan])

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                <div className="flex flex-row items-start justify-between gap-2">
                    <div className='flex flex-col gap-1 w-full'>
                        {!loading ? (
                            <h1 className="text-3xl font-bold">{studyplan?.unit?.name}</h1>
                        ) : <Skeleton className='h-10 w-1/2' />}

                        {!loading ? (
                            <h4 className="text-muted-foreground">{studyplan?.unit.section} - {studyplan?.unit.promo}</h4>
                        ) : (
                            <div className='flex items-center gap-1'>
                                <Skeleton className='h-6 w-12' /> - <Skeleton className='h-6 w-16' /> 
                            </div>
                        )}
                        <span>
                            {
                                studyplan?.semester?.type === 'fall' ?
                                    <Badge className='mr-2 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700'>
                                        Fall
                                    </Badge>
                                    :
                                    studyplan?.semester?.type === 'spring' ?
                                        <Badge className='mr-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-700'>
                                            Spring
                                        </Badge>
                                        :
                                        studyplan?.semester?.type === 'year' ?
                                            <Badge className='mr-2 py-1 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-400 hover:text-zinc-800'>
                                                Year
                                            </Badge>
                                            :
                                            null
                            }
                        </span>

                    </div>
                </div>
                <Tabs defaultValue="schedules" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="schedules">
                            Schedules
                        </TabsTrigger>
                        <TabsTrigger value="courses">
                            Courses
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="schedules" className='pt-4'>
                        <BaseCalendar
                            schedules={studyplan?.schedules}
                            initialDate={initialDate}
                            loading={loading}
                            defaultMode='list'
                        />
                    </TabsContent>
                    <TabsContent value="courses">
                        <div className="flex flex-col gap-2">
                            {studyplan?.courses?.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((course: any, index: number) => (
                                <Link
                                    key={index}
                                    to={`/courses/${course?.code}`}
                                    className="flex flex-col gap-1  border-l-[6px] border-black dark:border-accent border-solid pl-2 pr-3 bg-accent/50 rounded py-2 w-full hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out">

                                    <span className="text-xl font-bold capitalize"
                                    >{course.name}</span>
                                    <span className="text-muted-foreground"
                                    >{course.code} / <span className='font-semibold text-primary'>{course?.credits} ECTS</span></span>
                                    <div className='flex flex-col lg:flex-row gap-1'>
                                        <span className='font-semibold'>Teachers:</span>
                                        {course?.teachers?.map((teacher: any, index: number) => (
                                            <span key={index}
                                                className="text-muted-foreground flex">
                                                {teacher.name}
                                                <span className='hidden lg:block'>{index !== course?.teachers?.length - 1 && ','}</span>
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}

export default Studyplan;