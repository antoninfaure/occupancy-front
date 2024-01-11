import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRoom } from '@/api/rooms';
import Calendar from '@/components/calendar';

const Room = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);

    document.title = `Occupancy EPFL${room ? (' - ' + room.name) : ''}`;

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
        getRoom(name as string)
            .then(async (data: any) => {
                const soonestDate = await findSoonestDate(data.schedules);
                setInitialDate(soonestDate);
                setRoom(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                // redirect to rooms page
                //window.location.href = PUBLIC_URL + '/rooms';

            })
    }, [name])

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom])

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                <div className="flex flex-row items-start justify-between gap-2 px-4">
                    <h1 className="text-3xl font-bold px-2">{room?.name}</h1>
                    <Link to={room?.link} className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600">
                        See on plan
                    </Link>
                </div>

                <Calendar
                    schedules={room?.schedules}
                    initialDate={initialDate}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Room;