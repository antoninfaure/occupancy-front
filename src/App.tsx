import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import "./styles/global.scss";

import Courses from './pages/courses/Courses';
import Course from './pages/course/Course';

import Rooms from './pages/rooms/Rooms';
import Room from './pages/room/Room';

import StudyPlans from './pages/studyplans/Studyplans';
import StudyPlan from './pages/studyplan/Studyplan';

function App() {


  return (
    
    <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>

            <Route path="" element={<Home />} />

            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:name" element={<Room />}  />

            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:code" element={<Course />} />

            <Route path="/studyplans" element={<StudyPlans />} />
            <Route path="/studyplans/:id" element={<StudyPlan />} />

          </Route>
        </Routes>
    </Router>
  );
}

export default App;
