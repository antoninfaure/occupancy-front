import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='main'>
            <Navbar />
            <div className='container'>
                <Outlet/>
            </div>
            <Footer />
        </div>

    )
}

export default Layout;