import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import Home from '@/pages/home';
import Room from '@/pages/room';
import Course from '@/pages/course';
import { ThemeProvider } from './components/theme/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='occupancy-vite-ui-theme'>
      <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<Layout />}>

              <Route path="" element={<Home />} />

              <Route path="rooms/:name" element={<Room />} />

              <Route path="courses/:code" element={<Course />} />
            </Route>
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;