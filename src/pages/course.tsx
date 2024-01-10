import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourse } from '@/api/courses';
import Calendar from '@/components/calendar';

const Room = () => {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);

    // current root path
    const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';

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
            <div className="flex flex-col w-full p-4">
                <div className="flex flex-row items-center justify-between gap-2 p-4">
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold">{course?.name}</h1>
                        <h4 className="text-muted-foreground">{course?.code}</h4>
                        <span>{course?.teachers?.map((teacher: any) => teacher.name).join(', ')}</span>
                        <span>{course?.credits} ECTS</span>
                    </div>
                    <Link to={course?.edu_url} className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600">
                        See on Edu
                    </Link>
                </div>

                <Calendar
                    schedules={course?.schedules}
                    initialDate={initialDate}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Room;