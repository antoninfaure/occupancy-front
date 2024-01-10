import Calendar from "@/components/calendar"
import mockData from '../data/studyplan.json'

const Home = () => {

    // Find the soonest date with a schedule greater than now
    let soonestDate = mockData.reduce((acc: any, schedule: any) => {
        const startDateTime = new Date(schedule.start_datetime);
        if (startDateTime < new Date()) return acc;
        if (startDateTime < acc) return startDateTime;
        return acc;
      }, new Date(mockData[0].start_datetime));

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full p-4">
                <Calendar
                    schedules={mockData}
                    initialDate={soonestDate}
                />
            </div>
        </div>
    )
}

export default Home