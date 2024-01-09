import Calendar from "@/components/calendar"
import mockData from '../data/studyplan.json'

const Home = () => {
    return (
        <div className="flex w-100">
            <div className="grid grid-cols-2 gap-4 w-100">
                <div className="col-span-2 p-4">
                    <Calendar 
                        schedules={mockData}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home