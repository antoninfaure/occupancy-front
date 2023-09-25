import React from 'react';
import { DataGrid, GridRenderCellParams, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { LinearProgress, ThemeProvider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import './dataTable.scss'
import OutputIcon from '@mui/icons-material/Output';

function CustomToolbar(props: any) {
    return (
        <GridToolbarContainer>
            <div>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
            </div>
            <GridToolbarQuickFilter></GridToolbarQuickFilter>
        </GridToolbarContainer>
    );
}

const DataTable = ({
    columns,
    rows,
    loading = false,
}: {
    columns: any[],
    rows: any[],
    loading?: boolean,
}) => {

    return (
        <div className='dataTable'>
            <DataGrid
                className='dataGrid'
                rows={rows}
                columns={columns}
                pageSizeOptions={[25, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                    sorting: {
                        sortModel: [{ field: 'name', sort: 'asc' }],
                    },
                }}
                loading={loading ? loading : false}
                disableRowSelectionOnClick
                slots={{
                    toolbar: CustomToolbar
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {
                            debounceMs: 500,
                        }
                    }
                }}
            />
        </div>
    )
}

export default DataTable;