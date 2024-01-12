import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import Home from '@/pages/home';
import Room from '@/pages/room';
import Course from '@/pages/course';
import { ThemeProvider } from './components/theme/theme-provider';
import Rooms from './pages/rooms';
import Courses from './pages/courses';
import Studyplans from './pages/studyplans';
import Studyplan from './pages/studyplan';
import ScrollToTop from '@/components/scrollToTop'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='occupancy-vite-ui-theme'>
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>

            <Route path="" element={<Home />} />

            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:name" element={<Room />} />

            <Route path="courses" element={<Courses />} />
            <Route path="courses/:code" element={<Course />} />

            <Route path="studyplans" element={<Studyplans />} />
            <Route path="studyplans/:id" element={<Studyplan />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;