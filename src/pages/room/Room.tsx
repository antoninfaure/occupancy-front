import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr';

import { getRoom } from '../../api/rooms';

import './room.scss'

function Room() {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);

  const fetchRoom = useCallback(() => {
    setLoading(true);
    getRoom(name as string)
      .then((data: any) => {
        data.schedules.forEach((schedule: any) => {
          schedule['title'] = schedule.course.name;
          schedule['classNames'] = ['taken', schedule.label];
          schedule['url'] = `/courses/${schedule.course.code}`;
          schedule['borderColor'] = 'transparent';
        })
        setRoom(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
      })
  }, [])

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
      </div>
      {loading ? <CircularProgress /> :
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
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
