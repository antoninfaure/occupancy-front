import { useEffect, useState } from "react"
import { findSoonestAvailability } from "@/api/rooms"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    CaretSortIcon
} from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import DataTable from "@/components/datatable"
import { CheckCircle2, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Store
import { useSelector, useDispatch } from 'react-redux';
import { fetchRooms } from '@/store/roomsSlice';
import { RootState, AppDispatch } from '@/store/store';

type Room = {
    id: string
    name: string
    type: string
    building: string
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
                                    <XCircle className="text-red-500 h-4 w-4" style={{ flex: "0 0 auto" }}  />
                                ))}
                            <span>
                                {row.getValue("availability")}
                            </span>
                        </span>
                    ) : (
                        <Skeleton className="w-full h-6" />
                    )}
                </Link>
            )
        },
    }
]

const Rooms = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { rooms, loading, lastUpdated } = useSelector((state: RootState) => state.rooms);
    const MAX_CACHE_AGE = 1000 * 60 * 60 // 1 hour

    const [tableSorting, setTableSorting] = useState<any>([{ id: "name", desc: false }])
    const [availability, setAvailability] = useState<boolean>(false)

    const [data, setData] = useState<any>([])

    useEffect(() => {
        const currentTime = Date.now();
        if (!lastUpdated || currentTime - lastUpdated > MAX_CACHE_AGE) {
            dispatch(fetchRooms());
        }
        setData(rooms)
    }, [dispatch, lastUpdated, MAX_CACHE_AGE]);


    useEffect(() => {
        if (availability) return
        if (data.length === 0) return
        setData(rooms)
        findSoonestAvailability()
            .then((dataAvailability: any) => {
                let new_rooms = [] as Room[]
                data.map((room: any) => {
                    let new_room = { ...room }
                    const soonestBooking = dataAvailability.find((room_availability: any) => room_availability.name === new_room.name).soonest_booking

                    if (!soonestBooking) {
                        new_room.availability = "Always available"
                        new_room.available = true
                        new_rooms.push(new_room)
                        return new_room
                    }

                    const start_datetime = new Date(soonestBooking.start_datetime)
                    start_datetime.setHours(start_datetime.getHours() - 1)

                    const end_datetime = new Date(soonestBooking.end_datetime)
                    end_datetime.setHours(end_datetime.getHours() - 1)

                    const after_date = new Date()
                    after_date.setHours(after_date.getHours() - 1)

                    // if start_datetime print 'occupied until' end_datetime else print 'available until' end_datetime
                    if (start_datetime <= after_date && after_date <= end_datetime) {
                        new_room.available = false
                        new_room.availability = `Occupied until ${end_datetime.toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}`
                    } else {
                        // if end_datetime is today print hour else print date and hour
                        if (end_datetime.getDate() === after_date.getDate()) {
                            new_room.available = true
                            new_room.availability = `Available until ${start_datetime.toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`
                        } else {
                            new_room.available = true
                            new_room.availability = `Available until ${start_datetime.toLocaleString('fr-FR', {
                                year: '2-digit',
                                month: '2-digit',
                                day: '2-digit',
                                hour: 'numeric',
                            })}`
                        }
                    }
                    new_rooms.push(new_room)
                    return new_room
                })

                setData(new_rooms)
                setAvailability(true)
            })
            .catch((error: Error) => {
                console.error(error.message)
            })
    }, [data, availability])

    useEffect(() => {
        if (availability) {
            setTableSorting([{ id: "availability", desc: false }])
        } else {
            setTableSorting([{ id: "name", desc: false }])
        }
    }, [availability])


    return (
        <div className="flex w-full max-w-screen-xl mx-auto">
            <div className="flex flex-col w-full p-4">
                <div className="flex flex-row items-center justify-between gap-2 p-4">
                    <h1 className="text-3xl font-bold">Rooms</h1>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    sorting={tableSorting}
                    setSorting={setTableSorting}
                />
            </div>
        </div>
    )
}

export default Rooms