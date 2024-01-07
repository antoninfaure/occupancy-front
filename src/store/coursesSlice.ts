// src/store/coursesSlice.js
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Course } from '../types';
import { getCourses } from '../api/courses';

interface CoursesState {
  courses: Course[];
  loading: boolean;
  lastUpdated: number | null;
}

const initialState: CoursesState = {
  courses: [],
  loading: true,
  lastUpdated: null,
};

export const fetchCourses = createAsyncThunk<Course[]>(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCourses();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    // Add any synchronous reducers here
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
      let courses = action.payload;
      courses = courses.map((course, i) => {
        return {
          ...course,
          id: i,
        };
      });
      state.courses = courses;
      state.loading = false;
      state.lastUpdated = Date.now();
    });
    builder.addCase(fetchCourses.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default coursesSlice.reducer;