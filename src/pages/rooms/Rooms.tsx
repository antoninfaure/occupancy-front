import { useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';

import OutputIcon from '@mui/icons-material/Output';

import './rooms.scss'

// Store
import { useSelector, useDispatch } from 'react-redux';
import { fetchRooms } from '../../store/roomsSlice';
import { RootState, AppDispatch } from '../../store/store';

function Rooms() {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading, lastUpdated  } = useSelector((state: RootState) => state.rooms);
  const MAX_CACHE_AGE = 1000 * 60 * 60 // 1 hour

  useEffect(() => {
    const currentTime = Date.now();
    if (!lastUpdated || currentTime - lastUpdated > MAX_CACHE_AGE) {
      dispatch(fetchRooms());
    }
  }, [dispatch, lastUpdated, MAX_CACHE_AGE]);

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
