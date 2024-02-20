import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRoom } from '@/api/rooms';
import BaseCalendar from '@/components/calendar/Base';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle } from 'lucide-react';

const Room = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<any>(null);
    const [initialDate, setInitialDate] = useState<any>(null);
    const [available, setAvailable] = useState(false);
    const [availability, setAvailability] = useState("")

    document.title = `Occupancy FLEP${room ? (' - ' + room.name) : ''}`;

    async function findSoonestSchedule(schedules: any) {
        // Find the soonest schedule with a end_datetime greater than now
        if (!schedules) return null;

        let sortedSchedules = schedules.sort((a: any, b: any) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime() || new Date(a.end_datetime).getTime() - new Date(b.end_datetime).getTime());

        let soonestSchedule = null;
        for (let i = 0; i < sortedSchedules.length; i++) {
            let current = sortedSchedules[i];

            if (new Date(current.end_datetime) < new Date()) continue;

            // if no soonestSchedule, set the current schedule as current
            if (!soonestSchedule) {
                soonestSchedule = current;
                continue;
            }

            // Check if the current schedule ends when the next one starts
            if (soonestSchedule && new Date(soonestSchedule.end_datetime).getTime() === new Date(current.start_datetime).getTime()) {
                soonestSchedule = {
                    start_datetime: soonestSchedule.start_datetime,
                    end_datetime: current.end_datetime
                };
                continue;
            }

            return soonestSchedule;
        
        }
        return soonestSchedule;
    }

    const computeAvailability = (soonestSchedule: any) => {
        if (!soonestSchedule) {
            setAvailable(true)
            setAvailability("Always available")
            return
        }

        const start_datetime = new Date(soonestSchedule.start_datetime)
        start_datetime.setHours(start_datetime.getUTCHours())

        const end_datetime = new Date(soonestSchedule.end_datetime)
        end_datetime.setHours(end_datetime.getUTCHours())

        const today = new Date()
        today.setHours(today.getHours())

        // if start_datetime print 'occupied until' end_datetime else print 'available until' end_datetime
        if (start_datetime <= today && today <= end_datetime) {
            setAvailable(false)
            setAvailability(`Occupied until ${end_datetime.toLocaleString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            })}`)
        } else {
            // if end_datetime is today print hour else print date and hour
            if (end_datetime.getDate() === today.getDate() && end_datetime.getMonth() === today.getMonth() && end_datetime.getFullYear() === today.getFullYear()) {
                setAvailable(true)
                setAvailability(`Available until ${start_datetime.toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`)
            } else {
                setAvailable(true)
                setAvailability(`Available until ${start_datetime.toLocaleString('fr-FR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                })}`)
            }
        }
    }

    const fetchRoom = useCallback(() => {
        setLoading(true);
        getRoom(name as string)
            .then(async (data: any) => {
                const soonestSchedule = await findSoonestSchedule(data.schedules);
                computeAvailability(soonestSchedule);

                const soonestDate = soonestSchedule ? new Date(soonestSchedule.start_datetime) : new Date();
                setInitialDate(soonestDate);
                setRoom(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                // redirect to rooms page
                const { origin } = window.location;
                window.location.href = `${origin}/rooms`;

            })
    }, [name])

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom])

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-2 px-4">
                    <div className='flex flex-col gap-1 px-2 w-full md:w-1/2'>
                        {!loading ? (
                            <h1 className="text-3xl font-bold">{room?.name}</h1>
                        ) : (
                            <Skeleton className='h-10 w-48' />
                        )}
                        {!loading ? (
                            <h4 className="text-muted-foreground text-lg">{room?.type}</h4>
                        ) : (
                            <Skeleton className='h-6 w-32' />
                        )}
                        {!loading ? (
                            room?.building && (
                                <span className='font-bold flex items-center gap-1'>
                                    Building: <span className='font-normal text-muted-foreground'>
                                        {room?.building} {'level' in room ? `(floor ${room?.level})` : null}
                                    </span>
                                </span>
                            )
                        ) : (
                            <span className='font-bold flex items-center gap-1 mt-1'>
                                <Skeleton className='h-5 w-20' />
                            </span>
                        )}
                        {!loading ? (
                            room?.capacity && (
                                <span className='font-bold flex items-center gap-1'>
                                    Capacity: <span className='font-normal text-muted-foreground'>
                                        {room?.capacity}
                                    </span>
                                </span>
                            )
                        ) : (
                            <span className='font-bold flex items-center gap-1 mt-1'>
                                <Skeleton className='h-5 w-20' />
                            </span>
                        )}
                        {!loading ? (
                            <div className='flex items-center'>
                                <span className="flex items-center gap-1">
                                    {available ? (
                                        <CheckCircle2 className="text-green-500 h-5 w-5" style={{ flex: "0 0 auto" }} />
                                    ) : (
                                        <XCircle className="text-red-500 h-5 w-5" style={{ flex: "0 0 auto" }} />
                                    )}
                                    <span className='font-semibold'>
                                        {availability}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <Skeleton className='h-6 w-48' />
                        )}

                    </div>
                    {(!loading && room?.link) ? (
                        <Link
                            to={room?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-red-500/90 text-white px-2 py-1 rounded-md hover:bg-red-600 ml-2">
                            See on plan
                        </Link>) : null}
                </div>
                {((!loading && room?.schedules && room?.schedules.length !== 0) || loading) ? (
                    <BaseCalendar
                        schedules={room?.schedules}
                        initialDate={initialDate}
                        loading={loading}
                        weekend={true}
                        startHour={8}
                        endHour={24}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-4 min-h-96">
                        <h1 className="text-2xl font-bold">No schedule</h1>
                        <p className="text-lg text-gray-500">This room has no schedule</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Room;