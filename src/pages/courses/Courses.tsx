import { useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import Chip from '@mui/material/Chip';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';

import OutputIcon from '@mui/icons-material/Output';

import './courses.scss'

// Store
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/coursesSlice';
import { RootState, AppDispatch } from '../../store/store';

function Courses() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, lastUpdated  } = useSelector((state: RootState) => state.courses);
  const MAX_CACHE_AGE = 1000 * 60 * 60 // 1 hour

  useEffect(() => {
    const currentTime = Date.now();
    if (!lastUpdated || currentTime - lastUpdated > MAX_CACHE_AGE) {
      dispatch(fetchCourses());
    }
  }, [dispatch, lastUpdated, MAX_CACHE_AGE]);

  document.title = `Occupancy EPFL - Courses`;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 300,
      flex: 1,
    },
    {
      field: 'code',
      headerName: 'Code',
      minWidth: 150,
    }, {
      field: 'credits',
      headerName: 'Credits',
      minWidth: 100,
    }, {
      field: 'semester',
      headerName: 'Semester',
      minWidth: 350,
      renderCell: (params: GridRenderCellParams) => {
        return (
          
            params.row.semesterType &&
              <div>
                <span>{params.row.semester}
                  <Chip
                    sx={{ marginLeft: '5px', padding: '5px' }}
                    label={params.row.semesterType === 'fall' ? 'Fall' : 'Spring'}
                    color={params.row.semesterType === 'fall' ? 'primary' : 'error'}
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
            <Link
              to={`${params.row.code}`}
            >
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
    <div className='courses'>
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
              Courses
            </Link>
          </Breadcrumbs>
      </div>
      <div className='info'>
        <h1>Courses</h1>
      </div>
      <DataTable
        columns={columns}
        loading={loading}
        rows={courses}
      />
    </div>
  );
}

export default Courses;
