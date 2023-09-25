import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemButton from '@mui/material/ListItemButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr';

import { getStudyplan } from '../../api/studyplans';

import './studyplan.scss'

function Room() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [studyplan, setStudyplan] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState<any>({});
  const calendarRef = React.createRef<FullCalendar>();

  const handleDialogToggle = (scheduleid: string) => {
    // Use the room as the key to manage individual dialog open state
    setDialogOpen((prevState: any) => ({
      ...prevState,
      [scheduleid]: !prevState[scheduleid],
    }));
  };

  const fetchStudyplan = useCallback(() => {
    setLoading(true);
    getStudyplan(id as string)
      .then((data: any) => {
        data.schedules.forEach((schedule: any) => {
          schedule['title'] = schedule.course.name;

          if (!('extendedProps' in schedule)) {
            schedule.extendedProps = {};
          }
          schedule.extendedProps.url = `/courses/${schedule.course.code}`;
          schedule.extendedProps.rooms = schedule?.rooms ? schedule.rooms : [];
          schedule.extendedProps.label = schedule?.label;
          schedule.extendedProps.scheduleid = schedule?._id;
        })
        setStudyplan(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
      })
  }, [])

  useEffect(() => {
    fetchStudyplan();
  }, [fetchStudyplan])

  return (
    <div className='studyplan'>
      <div className='breadcrumbs'>
        {!loading &&
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Home
            </Link>
            <Link
              color="inherit"
              to="/studyplans/"
            >
              Studyplans
            </Link>
            <Link
              to="#"
              aria-current="page"
              style={{
                color: 'black'
              }}
            >
              {studyplan?.unit.name}
            </Link>
          </Breadcrumbs>
        }
      </div>
      <div className='info'>
        <h1>{studyplan?.unit.name}</h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}>
          {studyplan?.semester}
          {studyplan?.semesterType &&
            <Chip
              sx={{ marginLeft: '5px', padding: '5px' }}
              label={studyplan?.semesterType === 'fall' ? 'Fall' : 'Spring'}
              color={studyplan?.semesterType === 'fall' ? 'primary' : 'error'}
              size='small'
            />
          }
        </div>
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
              calendarRef.current.getApi().setOption('slotDuration', '00:05:00');
            } else {
              calendarRef.current.getApi().changeView('timeGridWeek');
              calendarRef.current.getApi().setOption('slotDuration', '00:15:00');
            }
          }}
          weekends={false}
          events={studyplan?.schedules || []}
          slotEventOverlap={false}
          contentHeight={'auto'}
          locale={frLocale}
          slotMinTime={'07:30:00'}
          slotMaxTime={'22:30:00'}
          slotDuration={
            window.innerWidth < 1200 ? '00:05:00' : '00:15:00'
          }
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          eventContent={(arg) => (

            <>
              <span>{arg.timeText}</span>
              <span>
                <Link
                  style={{ textDecoration: 'underline' }}
                  to={arg.event.extendedProps.url}
                >
                  {arg.event.title}
                </Link>
              </span>

              <div className='rooms'>
                {arg.event.extendedProps.rooms?.length > 1 ?
                  <>
                    <Button
                      sx={{ padding: '0' }}
                      className='room'
                      onClick={() => handleDialogToggle(arg.event.extendedProps.scheduleid)}
                      size='small'
                    >
                      {dialogOpen[arg.event.extendedProps.scheduleid] ? <ExpandLess /> : <ExpandMore />}
                    </Button>

                    <Dialog
                      onClose={() => handleDialogToggle(arg.event.extendedProps.scheduleid)}
                      open={dialogOpen[arg.event.extendedProps.scheduleid]}
                    >
                      <DialogTitle>Rooms</DialogTitle>
                      <List sx={{ p: 2, pt: 0 }}>
                        {arg.event.extendedProps.rooms.map((room: any) => (
                          <ListItemButton
                            className='room'
                            to={`/rooms/${room}`}
                            component={Link}
                            key={room}
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            {room}
                          </ListItemButton >
                        ))}
                      </List>
                    </Dialog>
                  </>
                  :
                  arg.event.extendedProps.rooms && arg.event.extendedProps.rooms.map((room: any) => (
                    <Link
                      className='room'
                      to={`/rooms/${room}`}
                      key={room}
                    >
                      {room}
                    </Link>
                  ))
                }
              </div>
            </>
          )}
          eventClassNames={(arg) => {
            return ['taken', arg.event.extendedProps.label]
          }}
          eventBorderColor='transparent'
        />
      }
    </div>
  );
}

export default Room;
