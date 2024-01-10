import { useEffect, useState } from "react"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    CaretSortIcon
} from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import DataTable from "@/components/datatable"
import { getCourses } from "@/api/courses"

type Course = {
    id: string
    name: string
    code: string
}

const columns: ColumnDef<Course>[] = [
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
                    to={`/courses/${row.getValue("code")}`}
                    className="capitalize w-full flex"
                >
                    <span>
                    {row.getValue("name")}
                    </span>
                </Link>
            )
        },
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link
                    to={`/courses/${row.getValue("code")}`}
                    className="capitalize w-full flex"
                >
                    <span>
                        {row.getValue("code")}
                    </span>
                </Link>
            )
        },
    }
]

const Courses = () => {

    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getCourses()
            .then((data: any) => {
                setCourses(data)
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
                    <h1 className="text-3xl font-bold">Courses</h1>
                </div>

                <DataTable columns={columns} data={courses} loading={loading} />
            </div>
        </div>
    )
}

export default Courses