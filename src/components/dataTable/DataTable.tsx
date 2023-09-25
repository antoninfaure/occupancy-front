import React, { useState, useEffect } from 'react';
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

    // State to track the column order
    const [columnOrder, setColumnOrder] = useState([...columns.map((col) => col.field)]);

    // Function to update column order based on window size
    const updateColumnOrder = () => {
        if (window.innerWidth <= 1200) {
            // Change the column order for small screens
            setColumnOrder(['actions', ...columns.filter((col) => col.field != 'actions').map((col) => col.field)]);
        } else {
            // Reset the column order for larger screens
            setColumnOrder([...columns.filter((col) => col.field != 'actions').map((col) => col.field), 'actions']);
        }
    };

    // Add an event listener to update column order when window size changes
    useEffect(() => {

        updateColumnOrder();

        window.addEventListener('resize', updateColumnOrder);
        return () => {
            window.removeEventListener('resize', updateColumnOrder);
        };
    }, []);

    // Rearrange columns based on columnOrder
    const rearrangedColumns = columnOrder.map((fieldName) =>
        columns.find((col) => col.field === fieldName)
    );

    // Trigger a re-render when the data loading is complete
    useEffect(() => {
        if (!loading) {
            // Force a re-render by setting state
            setColumnOrder([...columnOrder]);
        }
    }, [loading, columnOrder]);

    return (
        <div className='dataTable'>
            <DataGrid
                className='dataGrid'
                rows={rows}
                columns={rearrangedColumns}
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