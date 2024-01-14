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
import { Badge } from "@/components/ui/badge"

// Store
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '@/store/coursesSlice';
import { RootState, AppDispatch } from '@/store/store';

type Course = {
    id: string
    name: string
    code: string
}

const columns: ColumnDef<Course>[] = [
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
        id: "code",
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
    }, {
        'id': 'semesterType',
        accessorKey: 'semesterType',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Semester
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
                        {
                            row.getValue('semesterType') === 'fall' ?
                                <Badge className='mr-2 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700'>
                                    Fall
                                </Badge>
                                :
                                row.getValue('semesterType') === 'spring' ?
                                    <Badge className='mr-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-700'>
                                        Spring
                                    </Badge>
                                    :
                                    row.getValue('semesterType') === 'year' ?
                                        <Badge className='mr-2 py-1 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-400 hover:text-zinc-800'>
                                            Year
                                        </Badge>
                                        :
                                        null
                        }
                    </span>
                </Link>
            )
        },
    }
]

const Courses = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, lastUpdated  } = useSelector((state: RootState) => state.courses);
    const MAX_CACHE_AGE = 1000 * 60 * 60 // 1 hour

    document.title = `Occupancy FLEP - Courses`;

    const [tableSorting, setTableSorting] = useState<any>([{ id: "name", desc: false }])

    useEffect(() => {
        const currentTime = Date.now();
        if (!lastUpdated || currentTime - lastUpdated > MAX_CACHE_AGE) {
          dispatch(fetchCourses());
        }
      }, [dispatch, lastUpdated, MAX_CACHE_AGE]);
      

    return (
        <div className="flex w-full max-w-screen-xl mx-auto">
            <div className="flex flex-col w-full p-4">
                <div className="flex flex-row items-center justify-between gap-2 p-4">
                    <h1 className="text-3xl font-bold">Courses</h1>
                </div>

                <DataTable
                    columns={columns}
                    data={courses}
                    loading={loading}
                    sorting={tableSorting}
                    setSorting={setTableSorting}
                />
            </div>
        </div>
    )
}

export default Courses