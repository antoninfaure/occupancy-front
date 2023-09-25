import React, { useState, useCallback, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import Chip from '@mui/material/Chip';
import { getCourses } from '../../api/courses';
import './courses.scss'
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import OutputIcon from '@mui/icons-material/Output';
import { Breadcrumbs } from '@mui/material';


function Courses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 300,
      flex: 1
    },
    {
      field: 'code',
      headerName: 'Code',
      minWidth: 150
    }, {
      field: 'credits',
      headerName: 'Credits',
      minWidth: 100
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

  const fetchCourses = useCallback(() => {
    setLoading(true);
    getCourses()
      .then((data) => {
        data.forEach((course: any) => {
          course.id = course._id;
        })
        setCourses(data);
        setLoading(false);
      })

      .catch((error) => {
        console.error(error.message);
      })
  }, [])

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses])

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
