import Header from '../header';
import { Outlet } from 'react-router-dom';
import Footer from '../footer';


const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen w-full'>
            <Header />
            <div className='flex flex-col w-full grow'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout;
