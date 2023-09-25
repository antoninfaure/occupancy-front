import React, { useState, useCallback, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import OutputIcon from '@mui/icons-material/Output';
import Chip from '@mui/material/Chip';
import { Breadcrumbs } from '@mui/material';

import { getStudyplans } from '../../api/studyplans';

import './studyplans.scss'

function Rooms() {
  const [loading, setLoading] = useState(true);
  const [studyplans, setStudyplans] = useState<any[]>([]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 350,
      flex: 1
    },
    {
      field: 'section',
      headerName: 'Section',
      minWidth: 80
    }, {
      field: 'promo',
      headerName: 'Promotion',
      minWidth: 80
    }, {
      field: 'semester',
      headerName: 'Semester',
      minWidth: 350,
      renderCell: (params: GridRenderCellParams) => {
        return (
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
            <Link to={`${params.row.id}`}>
              <OutputIcon
                color='primary'
              />
            </Link>
          </div>
        )
      }
    }
  ];

  const fetchStudyplans = useCallback(() => {
    setLoading(true);
    getStudyplans()
      .then((data) => {
        data.forEach((studyplan: any) => {
          studyplan.id = studyplan._id;
        })
        setStudyplans(data);
        setLoading(false);
      })

      .catch((error) => {
        console.error(error.message);
      })
  }, [])

  useEffect(() => {
    fetchStudyplans();
  }, [fetchStudyplans])

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
