import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import OutputIcon from '@mui/icons-material/Output';
import { GridRenderCellParams } from '@mui/x-data-grid';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import DownloadIcon from '@mui/icons-material/Download';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import Typography from '@mui/material/Typography';

import './home.scss'

import { findFreeRooms } from '../../api/rooms';
import DataTable from '../../components/dataTable/DataTable';

import { API_URL } from '../../api/utils';
const Home = () => {

    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);

    
    console.log(API_URL)
    document.title = `Occupancy EPFL - Home`;

    const roomsColumns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 300,
            flex: 0.5
        },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 300,
            flex: 0.5
        }, {
            field: 'actions',
            headerName: '',
            minWidth: 50,
            align: 'center',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div className='action'>
                        <Link to={`/rooms/${params.row.name}`}>
                            <OutputIcon
                                color='primary'
                            />
                        </Link>
                    </div>
                )
            }
        }
    ];


    const calendarRef = React.createRef<FullCalendar>()

    const resetSelection = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().removeAllEvents();
        }
        setRooms([]);
    }

    const submitSelection = () => {
        if (!calendarRef.current) {
            return;
        }
        const events = calendarRef.current.getApi().getEvents();

        let schedules: any[] = [];
        events.forEach((event: any) => {
            schedules.push({
                start: event.start,
                end: event.end,
            })
        })
        setLoading(true);
        findFreeRooms(schedules)
            .then((data: any) => {
                data.forEach((room: any, i: number) => {
                    room.id = i;
                })
                setRooms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            })

    }

    const handleSelect = (selectInfo: any) => {
        const { start, end } = selectInfo;

        // Create an event object
        const event = {
            start: start,
            end: end,
            rendering: 'background',
            block: true,
        };

        // Get all events currently in the calendar
        const allEvents = selectInfo.view ? selectInfo.view.calendar.getEvents() : [];

        // Check if the selected range overlaps with any existing event
        const overlappingEvents = allEvents.filter((existingEvent: any) => {
            return (
                start < existingEvent.end && end > existingEvent.start && existingEvent.extendedProps.block
            );
        });

        // Remove overlapping events
        overlappingEvents.forEach((overlappingEvent: any) => {
            overlappingEvent.remove();
        });

        // Add the new event to the FullCalendar instance
        if (selectInfo.view) {
            selectInfo.view.calendar.addEvent(event);
        }

        // Unselect the selection
        if (selectInfo.view) {
            selectInfo.view.calendar.unselect();
        }
    };


    return (
        <div className="home">
            <div className='sections'>
                <div className='calendar'>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[timeGridPlugin, interactionPlugin]}
                        headerToolbar={
                            {
                                left: 'timeGridDay,timeGridWeek',
                                center: 'title',
                                right: 'prev,next today'
                            }
                        }
                        initialView={
                            window.innerWidth < 1200 ? 'timeGridDay' : 'timeGridWeek'
                        }
                        windowResize={function (arg) {
                            if (calendarRef.current === null) return;
                            if (window.innerWidth < 1200) {
                                calendarRef.current.getApi().changeView('timeGridDay');
                            } else {
                                calendarRef.current.getApi().changeView('timeGridWeek');
                            }
                        }}
                        weekends={true}
                        contentHeight={'auto'}
                        locale={frLocale}
                        slotMinTime={'07:30:00'}
                        slotMaxTime={'22:30:00'}
                        slotDuration={'00:15:00'}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        selectable={true}
                        select={handleSelect}
                        selectLongPressDelay={150}
                        validRange={function (nowDate) {
                            // Adjust for UTC+2 (2 hours ahead of UTC)
                            var nowDateUTC2 = new Date(nowDate);
                            nowDateUTC2.setHours(nowDate.getHours() - 2);

                            // Calculate the start of the current week in UTC+2
                            var startOfWeek = new Date(nowDateUTC2);
                            startOfWeek.setDate(nowDateUTC2.getDate() - nowDateUTC2.getDay() + 1);

                            // Calculate the end of the current week in UTC+2
                            var endOfWeek = new Date(nowDateUTC2);
                            endOfWeek.setDate(nowDateUTC2.getDate() - nowDateUTC2.getDay() + 7);

                            return {
                                start: startOfWeek,
                                end: endOfWeek
                            };
                        }}
                    />
                </div>
                <div className='description'>
                    <h1>Find free rooms</h1>
                    <Timeline position="alternate" className='timeline'>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">
                                    <HighlightAltIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6" component="span">
                                    Select
                                </Typography>
                                <Typography>Drag select a time range</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="error">
                                    <DownloadIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6" component="span">
                                    Query
                                </Typography>
                                <Typography>Click on "Find rooms" to query the available rooms</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="info">
                                    <FormatListBulletedIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6" component="span">
                                    Explore
                                </Typography>
                                <Typography>
                                    Click on a room to see its schedule
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot>
                                    <RestartAltIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6" component="span">
                                    Reset
                                </Typography>
                                <Typography>Click on "Reset" to clear everything</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                    <div className='buttons'>
                        <Button
                            variant="contained"
                            color='inherit'
                            onClick={resetSelection}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={submitSelection}
                        >
                            Find rooms
                        </Button>
                    </div>
                    <div className='results'>
                        <DataTable
                            columns={roomsColumns}
                            loading={loading}
                            rows={rooms}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home;