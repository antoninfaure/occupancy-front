import SelectableCalendar from '@/components/calendar/SelectableCalendar';
import { useEffect, useState } from 'react';
import { findFreeRooms, findSoonestAvailability } from '@/api/rooms';
import DataTable from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    CaretSortIcon
} from "@radix-ui/react-icons"
import {
    ColumnDef
} from "@tanstack/react-table"
import { CheckCircle2, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';



type Room = {
    id: string
    name: string
    type: string
    building: string
    distance: number
    availability?: string
    available?: boolean
}

const columns: ColumnDef<Room>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link
                    to={`/rooms/${row.getValue("name")}`}
                    className="uppercase w-full flex"
                >
                    <span>
                        {row.getValue("name")}
                    </span>
                </Link>
            )
        },
    },
    {
        id: "type",
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link
                    to={`/rooms/${row.getValue("name")}`}
                    className="capitalize w-full flex"
                >
                    <span>
                        {row.getValue("type")}
                    </span>
                </Link>
            )
        },
    }, {
        id: "building",
        accessorKey: "building",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Building
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )

        },
        cell: ({ row }) => {
            return (
                <Link
                    to={`/rooms/${row.getValue("name")}`}
                    className="w-full flex"
                >
                    <span>
                        {row.getValue("building")}
                    </span>
                </Link>
            )
        },
    },
    {
        id: "availability",
        accessorFn: (row) => row.availability,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Availability
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link
                    to={`/rooms/${row.getValue("name")}`}
                    className="w-full flex"
                >
                    {row.getValue('availability') ? (
                        <span className="flex items-center gap-2">
                            {'available' in row.original && (
                                row.original.available ? (
                                    <CheckCircle2 className="text-green-500 h-4 w-4" style={{ flex: "0 0 auto" }} />
                                ) : (
                                    <XCircle className="text-red-500 h-4 w-4" style={{ flex: "0 0 auto" }} />
                                ))}
                            {row.getValue("availability")}
                        </span>
                    ) : (
                        <Skeleton className="w-full h-6" />
                    )}
                </Link>
            )
        },
    }
]


const Home = () => {

    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [position, setPosition] = useState<any>(undefined);
    const [positionAccuracy, setPositionAccuracy] = useState<any>(undefined);
    const [queriedSlots, setQueriedSlots] = useState<any[]>([]);
    const [tableColumns, setTableColumns] = useState<any[]>(columns);
    const [tableSorting, setTableSorting] = useState<any[]>([]);
    const [availability, setAvailability] = useState(false);
    const [enablePosition, setEnablePosition] = useState(true);

    function mergeContiguousSlots(slots: any[]) {
        if (slots.length === 0) {
            setQueriedSlots([]);
            return;
        }
        // Sort the slots by start datetime
        slots.sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());

        // Array to hold the merged slots
        const mergedSlots = [];

        // Temporary slot to hold the merging slots
        let currentSlot = slots[0];

        for (let i = 1; i < slots.length; i++) {
            const nextSlot = slots[i];

            if (new Date(currentSlot.end).getTime() === new Date(nextSlot.start).getTime()) {
                // If contiguous, extend the currentSlot's end_datetime
                currentSlot.end = nextSlot.end;
            } else {
                // If not contiguous, push the currentSlot to mergedSlots and start a new merge
                mergedSlots.push(currentSlot);
                currentSlot = nextSlot;
            }
        }

        // Push the last merged or single slot
        mergedSlots.push(currentSlot);

        setQueriedSlots(mergedSlots);
    }

    useEffect(() => {
        if (availability) return
        if (rooms.length === 0) return
        findSoonestAvailability()
            .then((dataAvailability: any) => {
                const new_rooms = [...rooms]
                new_rooms.map((room: any) => {
                    const soonestBooking = dataAvailability.find((room_availability: any) => room_availability.name === room.name).soonest_booking

                    if (!soonestBooking) {
                        room.availability = "Always available"
                        room.available = true
                        return room
                    }

                    const start_datetime = new Date(soonestBooking.start_datetime)
                    start_datetime.setHours(start_datetime.getHours() - 1)

                    const end_datetime = new Date(soonestBooking.end_datetime)
                    end_datetime.setHours(end_datetime.getHours() - 1)

                    const after_date = new Date()
                    after_date.setHours(after_date.getHours() - 1)

                    // if start_datetime print 'occupied until' end_datetime else print 'available until' end_datetime
                    if (start_datetime <= after_date && after_date <= end_datetime) {
                        room.available = false
                        room.availability = `Occupied until ${end_datetime.toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}`
                    } else {
                        // if end_datetime is today print hour else print date and hour
                        if (end_datetime.getDate() === after_date.getDate()) {
                            room.available = true
                            room.availability = `Available until ${start_datetime.toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`
                        } else {
                            room.available = true
                            room.availability = `Available until ${start_datetime.toLocaleString('fr-FR', {
                                year: '2-digit',
                                month: '2-digit',
                                day: '2-digit',
                                hour: 'numeric',
                            })}`
                        }
                    }
                    return room
                })

                setRooms(new_rooms)
                setAvailability(true)
            })
            .catch((error: Error) => {
                console.error(error.message)
            })
    }, [rooms, availability])


    const sendSlots = async (slots: any[]) => {
        let schedules: any[] = [];

        slots.forEach((event: any) => {
            schedules.push({
                start: event.start_datetime,
                end: event.end_datetime,
            })
        })

        let coordinates: any = undefined;
        setPosition(undefined);
        setPositionAccuracy(undefined);
        if (enablePosition) {
            try {
                coordinates = await (new Promise((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            const { latitude, longitude, accuracy } = position.coords;
                            setPositionAccuracy(accuracy);
                            setPosition({ latitude, longitude });
                            resolve({ latitude, longitude });
                        }, (error) => {
                            console.error(error);
                            reject(undefined);
                        }, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        });
                    } else {
                        reject(undefined);
                    }
                }))
            } catch (error) {
                console.error(error);
            }
        }

        setLoading(true);
        mergeContiguousSlots(schedules)
        findFreeRooms(schedules, coordinates)
            .then((data: any) => {
                data.forEach((room: any, i: number) => {
                    room.id = i;
                    room.building = room.name.split(/[0-9]/)[0].split(/[-_]/).join(" ");
                    room.distance = Math.round(room.distance);
                })

                // If distance is not available, sort by name
                if (data[0].distance === undefined || data[0].distance === null || isNaN(data[0].distance)) {
                    setTableColumns(columns);
                    setTableSorting([{ id: 'name', desc: false }])
                } else {
                    setTableColumns([...columns, distanceColumn[0]]);
                    setTableSorting([{ id: 'distance', desc: false }])
                }
                setRooms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            })

    }


    const distanceColumn: ColumnDef<Room>[] = [
        {
            id: "distance",
            accessorKey: "distance",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Distance
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )

            },
            cell: ({ row }) => {
                return (
                    <Link
                        to={`/rooms/${row.getValue("name")}`}
                        className="w-full flex"
                    >
                        <span>
                            {row.getValue("distance")}m
                        </span>
                    </Link>
                )
            },
        }
    ]

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full max-w-screen-xl mx-auto p-4 gap-3">
                <div className='w-full'>
                    {queriedSlots.length > 0 ? (
                        <div className='flex flex-col gap-2 p-4'>
                            <h3 className='text-2xl font-bold'>Available Rooms</h3>
                            <span className='text-white'>Found {rooms.length} rooms</span>
                            <div className='flex flex-col lg:flex-row gap-4'>
                                <DataTable
                                    data={rooms}
                                    columns={tableColumns}
                                    loading={loading}
                                    sorting={tableSorting}
                                    setSorting={setTableSorting}
                                />
                                <div className='flex flex-col gap-2 pt-4'>
                                    <Button onClick={() => setQueriedSlots([])}>
                                        Clear
                                    </Button>
                                    {position && (
                                        <>
                                            <span className='text-white mt-2 text-lg'>Position</span>
                                            <div className='flex flex-col gap-2 w-full min-w-48 text-muted-foreground '>
                                                <span className='text-sm'>Latitude: {position?.latitude.toFixed(6)}</span>
                                                <span className='text-sm'>Longitude: {position?.longitude.toFixed(6)}</span>
                                                <span className='text-sm'>Accuracy: {positionAccuracy?.toFixed(2)}m</span>
                                            </div>
                                            <hr className='border-white border-opacity-50' />
                                        </>
                                    )}
                                    <span className='text-white text-lg'>Selection</span>
                                    <div className='flex flex-col gap-2 w-full min-w-48'>
                                        {
                                            (() => {
                                                let lastDate: Date | null = null;

                                                return queriedSlots.map((slot: any) => {

                                                    let displayDate = false;
                                                    if (lastDate === null) {
                                                        displayDate = true;
                                                        lastDate = new Date(slot.start);
                                                    } else {
                                                        if (new Date(slot.start).getDate() !== lastDate.getDate()) {
                                                            displayDate = true;
                                                            lastDate = new Date(slot.start);
                                                        }
                                                    }

                                                    const start_datetime = new Date(slot.start)
                                                    start_datetime.setHours(start_datetime.getHours() - 1)
                                                    const end_datetime = new Date(slot.end)
                                                    end_datetime.setHours(end_datetime.getHours() - 1)
                                                    return (
                                                        <>
                                                            {displayDate && (
                                                                <span className="text-sm leading-snug text-muted-foreground">
                                                                    {new Date(slot.start).toLocaleDateString("en-US", {
                                                                        weekday: "long",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    })}
                                                                </span>
                                                            )}
                                                            <div className={`col-span-3 overflow-x-auto border-l-[6px] border-red-500 border-solid pl-2 pr-3 bg-primary/5 text-primary dark:bg-accent/50 dark:text-primary rounded py-3 w-full max-w-screen-md hover:bg-primary/10 dark:hover:bg-accent/100 hover:shadow-md transition-all duration-200 ease-in-out`}>
                                                                <div className="text-sm leading-snug text-muted-foreground">
                                                                    {start_datetime && (
                                                                        <span>
                                                                            {start_datetime.toLocaleTimeString("fr-FR", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                            {" - "}
                                                                        </span>
                                                                    )}
                                                                    {end_datetime && (
                                                                        <span>
                                                                            {end_datetime.toLocaleTimeString("fr-FR", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>


                                                    )
                                                })
                                            })()
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SelectableCalendar
                            sendSlots={sendSlots}
                            startHour={7}
                            endHour={23}
                            enablePosition={enablePosition}
                            setEnablePosition={setEnablePosition}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home