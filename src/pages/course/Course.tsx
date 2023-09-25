import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr';

import { getCourse } from '../../api/courses';

import './course.scss'

function Room() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState<any>({});
  const calendarRef = React.createRef<FullCalendar>();

  document.title = `Occupancy EPFL - ${course?.code}`;

  const handleDialogToggle = (scheduleid: string) => {
    // Use the room as the key to manage individual dialog open state
    setDialogOpen((prevState: any) => ({
      ...prevState,
      [scheduleid]: !prevState[scheduleid],
    }));
  };

  const fetchCourse = useCallback(() => {
    setLoading(true);
    getCourse(code as string)
      .then((data: any) => {

        // if schedule has multiple rooms, we need to create a schedule for each room
        data.schedules.forEach((schedule: any) => {
          if (!('extendedProps' in schedule)) {
            schedule.extendedProps = {};
          }
          schedule.extendedProps.rooms = schedule?.rooms ? schedule.rooms : [];
          schedule.extendedProps.label = schedule?.label;
          schedule.extendedProps.scheduleid = schedule?._id;

        })

        setCourse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
      })
  }, [])

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse])

  return (
    <div className='course'>
      <div className='breadcrumbs'>
        {!loading &&
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Home
            </Link>
            <Link
              color="inherit"
              to="/courses/"
            >
              Courses
            </Link>
            <Link
              to="#"
              aria-current="page"
              style={{
                color: 'black'
              }}
            >
              {course?.name}
            </Link>
          </Breadcrumbs>
        }
      </div>
      <div className='info'>
        <h1>{course?.name}</h1>
        <p>{course?.code}</p>
        {course && 
        <div className='details'>
          { course?.semester &&
          <div>
            <p>Semester</p>
            <p>{course?.semester.name}</p>
          </div>
          }
          <div>
            <p>Credits</p>
            <p>{course?.credits}</p>
          </div>
          <div>
            <p>Teachers</p>
            <div className='teachers'>
              {course?.teachers?.map((teacher: any) => (
                <Chip label={teacher.name} key={teacher._id} 
                component={Link}
                to={teacher.people_url}
                target='_blank'
                rel='noreferrer'
                sx={{
                  cursor: 'pointer'
                }}
                />
              ))}
            </div>
          </div>
          <div>
            <p>Link to edu.epfl.ch</p>
            <Chip label='Link'
              component={Link}
              color='error'
              to={course?.edu_url}
              target='_blank'
              rel='noreferrer'
              sx={{
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
        }
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
          events={course?.schedules || []}
          slotEventOverlap={false}
          locale={frLocale}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          expandRows={true}
          contentHeight={'auto'}
          slotMinTime={'07:30:00'}
          slotMaxTime={'22:30:00'}
          slotDuration={'00:15:00'}
          eventContent={(arg) => (

            <>
              <span>{arg.timeText}</span>

              <div className='rooms'>
                {arg.event.extendedProps.rooms?.length > 1 ?
                  <>
                    <Button
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
