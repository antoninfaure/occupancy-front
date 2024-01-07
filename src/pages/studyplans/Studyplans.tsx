import { useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { Breadcrumbs } from '@mui/material';

import OutputIcon from '@mui/icons-material/Output';

import './studyplans.scss'

// Store
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudyplans } from '../../store/studyplansSlice';
import { RootState, AppDispatch } from '../../store/store';

function Rooms() {
  const dispatch = useDispatch<AppDispatch>();
  const { studyplans, loading, lastUpdated  } = useSelector((state: RootState) => state.studyplans);
  const MAX_CACHE_AGE = 1000 * 60 * 60 // 1 hour

  useEffect(() => {
    const currentTime = Date.now();
    if (!lastUpdated || currentTime - lastUpdated > MAX_CACHE_AGE) {
      dispatch(fetchStudyplans());
    }
  }, [dispatch, lastUpdated, MAX_CACHE_AGE]);

  document.title = `Occupancy EPFL - Studyplans`;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 350,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <span>{params.row.unit.name}</span>
        )
      },
      valueGetter: (params: GridRenderCellParams) => {
        return params.row.unit.name;
      }
    },
    {
      field: 'section',
      headerName: 'Section',
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <span>{params.row.unit.section}</span>
        )
      },
      valueGetter: (params: GridRenderCellParams) => {
        return params.row.unit.section;
      }
    }, {
      field: 'promo',
      headerName: 'Promotion',
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <span>{params.row.unit.promo}</span>
        )
      },
      valueGetter: (params: GridRenderCellParams) => {
        return params.row.unit.promo;
      }
    }, {
      field: 'semester',
      headerName: 'Semester',
      minWidth: 350,
      valueGetter: (params: GridRenderCellParams) => {
        return params.row.semester.name;
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div>
            <span>{params.row.semester.name}
              <Chip
                sx={{ marginLeft: '5px', padding: '5px' }}
                label={params.row.semester.type === 'fall' ? 'Fall' : 
                  params.row.semester.type === 'spring' ? 'Spring' : 'Other'}
                color={params.row.semester.type === 'fall' ? 'primary' : 
                  params.row.semester.type === 'spring' ? 'error' :
                
                'default'}
                size='small'
              />
            </span>
          </div>
        )
      }
    }, {
      field: 'actions',
      headerName: '',
      minWidth: 50,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className='action'>
            <Link to={`${params.row._id}`}>
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
    <div className='studyplans'>
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
              Studyplans
            </Link>
          </Breadcrumbs>
      </div>
      <div className='info'>
        <h1>Studyplans</h1>
      </div>
      <DataTable
        columns={columns}
        loading={loading}
        rows={studyplans}
      />
    </div>
  );
}

export default Rooms;
