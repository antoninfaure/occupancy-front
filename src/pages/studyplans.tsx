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
import { getStudyplans } from "@/api/studyplans"
import { Badge } from "@/components/ui/badge"

type Studyplan = {
    _id: string
    id: string
    unit: {
        name: string
        promo?: string
        section?: string
    }
    semester: {
        name: string
        type: string
    }
}

const columns: ColumnDef<Studyplan>[] = [
    {
        id: "name",
        accessorFn: (row) => row.unit.name,
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
            const unit = row.original['unit'] as {
                name: string
                promo?: string
                section?: string
            }
            return (
                <Link
                    to={`/studyplans/${row.original['_id']}`}
                    className="capitalize w-full flex"
                >
                    <span>
                        {unit?.name}
                    </span>
                </Link>
            )
        },
    },
    {
        id: "section",
        accessorFn: (row) => row.unit.section,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Section
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const unit = row.original['unit'] as {
                name: string
                promo?: string
                section?: string
            }
            return (
                <Link
                    to={`/studyplans/${row.original['_id']}`}
                    className="capitalize w-full flex"
                >
                    <span>
                        {unit?.section}
                    </span>
                </Link>
            )
        },
    }, {
        id: "promo",
        accessorFn: (row) =>  row.unit.promo,
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
            const unit = row.original['unit'] as {
                name: string
                promo?: string
                section?: string
            }
            return (
                <Link
                    to={`/studyplans/${row.original['_id']}`}
                    className="w-full flex"
                >
                    <span>
                        {unit?.promo}
                    </span>
                </Link>
            )
        },
    },
    {
        id: "type",
        accessorFn: (row) =>  row.semester.type,
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
            const semester = row.original['semester'] as {
                name: string
                type: string
            }
            return (
                <Link
                    to={`/studyplans/${row.original['_id']}`}
                    className="capitalize w-full flex"
                >
                    <span>
                        {
                            semester?.type === 'fall' ?
                                <Badge className='mr-2 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700'>
                                    Fall
                                </Badge>
                                :
                                semester?.type === 'spring' ?
                                    <Badge className='mr-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-700'>
                                        Spring
                                    </Badge>
                                    :
                                    semester?.type === 'year' ?
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

const Studyplans = () => {

    const [studyplans, setStudyplans] = useState<Studyplan[]>([])
    const [loading, setLoading] = useState(true)
    const [tableSorting, setTableSorting] = useState<any>([{ id: "name", desc: false }])

    useEffect(() => {
        setLoading(true)
        getStudyplans()
            .then((data: any) => {
                setStudyplans(data)
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
                    <h1 className="text-3xl font-bold">Studyplans</h1>
                </div>

                <DataTable
                    columns={columns}
                    data={studyplans}
                    loading={loading}
                    sorting={tableSorting}
                    setSorting={setTableSorting}
                />
            </div>
        </div>
    )
}

export default Studyplans