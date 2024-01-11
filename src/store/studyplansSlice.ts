// src/store/studyplansSlice.js
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Studyplan } from '@/types';
import { getStudyplans } from '../api/studyplans';

interface StudyplansState {
  studyplans: Studyplan[];
  loading: boolean;
  lastUpdated: number | null;
}

const initialState: StudyplansState = {
  studyplans: [],
  loading: true,
  lastUpdated: null,
};

export const fetchStudyplans = createAsyncThunk<Studyplan[]>(
  'studyplans/fetchStudyplans',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getStudyplans();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const studyplansSlice = createSlice({
  name: 'studyplans',
  initialState,
  reducers: {
    // Add any synchronous reducers here
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudyplans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStudyplans.fulfilled, (state, action: PayloadAction<Studyplan[]>) => {
      let studyplans = action.payload;
      studyplans = studyplans.map((studyplan, i) => {
        return {
          ...studyplan,
          id: i,
        };
      });
      state.studyplans = studyplans;
      state.loading = false;
      state.lastUpdated = Date.now();
    });
    builder.addCase(fetchStudyplans.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default studyplansSlice.reducer;