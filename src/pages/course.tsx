import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourse } from '@/api/courses';
import Calendar from '@/components/calendar';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

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

    const fetchRoom = useCallback(() => {
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
    }, [name])

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom])

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                <div className="flex flex-row items-start justify-between gap-2">
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold">{course?.name}</h1>
                        <h4 className="text-muted-foreground">{course?.code} / <span className='text-white'>{course?.credits} ECTS</span></h4>
                        <div className='flex flex-col lg:flex-row gap-1'>
                            <span className='font-bold'>Teachers:</span>
                            {course?.teachers?.map((teacher: any, index: number) => (
                                <Link to={teacher.people_url} target='_blanl' rel='noreferrer' key={index}
                                    className="text-muted-foreground underline hover:decoration-red-600 hover:text-red-600/90">
                                    {teacher.name}
                                </Link>
                            ))}
                        </div>

                        <span className='font-bold'>Language: <span className='font-normal text-muted-foreground'>{course?.language}</span></span>
                    </div>
                    <Link to={course?.edu_url} className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600">
                        See on Edu
                    </Link>
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
                        <Calendar
                            schedules={course?.schedules}
                            initialDate={initialDate}
                            loading={loading}
                        />
                    </TabsContent>
                    <TabsContent value="studyplans">
                        <div className="flex flex-col gap-2">
                            {course?.studyplans?.sort((a: any, b: any) => a.unit?.name.localeCompare(b.unit?.name)).map((studyplan: any) => (
                                <Link
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
        </div>
    )
}

export default Room;