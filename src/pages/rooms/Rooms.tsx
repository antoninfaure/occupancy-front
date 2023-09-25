import React, { useState, useCallback, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { getRooms } from '../../api/rooms';
import './rooms.scss'
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import OutputIcon from '@mui/icons-material/Output';
import { Breadcrumbs } from '@mui/material';

function Rooms() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);

  document.title = `Occupancy EPFL - Rooms`;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 0.5
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 150,
      flex: 0.5,
    }, {
      field: 'actions',
      headerName: '',
      minWidth: 50,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className='action'>
              <Link to={`${params.row.name}`}>
                <OutputIcon
                  color='primary'
                />
              </Link>
          </div>
        )
      }
    }
  ];

  const fetchRooms = useCallback(() => {
    setLoading(true);
    getRooms()
      .then((data) => {
        data.forEach((room: any) => {
          room.id = room._id;
        })
        setRooms(data);
        setLoading(false);
      })

      .catch((error) => {
        console.error(error.message);
      })
  }, [])

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms])

  return (
    <div className='rooms'>
      <div className='breadcrumbs'>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Home
            </Link>
            <Link
              to="#"
              aria-current="page"
              style={{
                color: 'black'
              }}
            >
              Rooms
            </Link>
          </Breadcrumbs>
      </div>
      <div className='info'>
        <h1>Rooms</h1>
      </div>
      <DataTable
        columns={columns}
        loading={loading}
        rows={rooms}
      />
    </div>
  );
}

export default Rooms;
