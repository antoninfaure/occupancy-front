import { useEffect, useState } from "react"
import { getRooms } from "@/api/rooms"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    CaretSortIcon
} from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import DataTable from "@/components/datatable"

type Room = {
    id: string
    name: string
    type: string
}

const columns: ColumnDef<Room>[] = [
    {
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
]

const Rooms = () => {

    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getRooms()
            .then((data: any) => {
                data.map((room: any) => {
                    room.building = room.name.split(/[0-9]/)[0].split(/[-_]/).join(" ")
                    return room
                })
                setRooms(data)
                setLoading(false)
            })
            .catch((error: Error) => {
                console.error(error.message)
            })
    }, [])

    return (
        <div className="flex w-full max-w-screen-xl mx-auto">
            <div className="flex flex-col w-full p-4">
                <div className="flex flex-row items-center justify-between gap-2 p-4">
                    <h1 className="text-3xl font-bold">Rooms</h1>
                </div>

                <DataTable columns={columns} data={rooms} loading={loading} />
            </div>
        </div>
    )
}

export default Rooms