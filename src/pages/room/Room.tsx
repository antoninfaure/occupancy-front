import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr';

import { getRoom } from '../../api/rooms';

import './room.scss'

function Room() {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const calendarRef = React.createRef<FullCalendar>();
  // current root path
  const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';

  document.title = `Occupancy EPFL${ room ? (' - ' + room.name) : ''}`;

  const fetchRoom = useCallback(() => {
    setLoading(true);
    getRoom(name as string)
      .then((data: any) => {
        data.schedules.forEach((schedule: any) => {
          schedule['title'] = schedule.course.name;
          schedule['classNames'] = ['taken', schedule.label];
          schedule['url'] = PUBLIC_URL + `/courses/${schedule.course.code}`;
          schedule['borderColor'] = 'transparent';
          schedule.start = schedule.start_datetime;
          schedule.end = schedule.end_datetime;
        })
        setRoom(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        // redirect to rooms page
        window.location.href = PUBLIC_URL + '/rooms';

      })
  }, [name])

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom])

  return (
    <div className='room'>
      <div className='breadcrumbs'>
        {!loading &&
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Home
            </Link>
            <Link
              color="inherit"
              to="/rooms/"
            >
              Rooms
            </Link>
            <Link
              to="#"
              aria-current="page"
              style={{
                color: 'black'
              }}
            >
              {room?.name}
            </Link>
          </Breadcrumbs>
        }
      </div>
      <div className='info'>
        <h1>{room?.name}</h1>
        <p>{room?.type}</p>
        {room && (
        <a 
          href={`${room?.link}`}
          target='_blank'
          rel='noreferrer'
          className='btn'
        >
          See on plan.epfl.ch
        </a>
        )}
      </div>
      {loading ? <CircularProgress /> :
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
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
          events={room?.schedules || []}
          slotEventOverlap={false}
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
        />
      }
    </div>
  );
}

export default Room;
