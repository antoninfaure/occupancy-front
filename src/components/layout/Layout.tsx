import React from 'react';
import Header from '../header';
import { Outlet } from 'react-router-dom';


const Layout = () => {
    return (
        <>
            <div className='main'>

                <Header />
                <div className='flex flex-col w-100'>
                    <Outlet />
                </div>
            </div>
        </>

    )
}

export default Layout;