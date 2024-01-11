import Header from '../header';
import { Outlet } from 'react-router-dom';
import Footer from '../footer';


const Layout = () => {
    return (
        <>
            <div className='main'>

                <Header />
                <div className='flex flex-col w-100'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>

    )
}

export default Layout;
