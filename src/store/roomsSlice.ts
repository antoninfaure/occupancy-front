// src/store/roomsSlice.js
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Room } from '@/types';
import { getRooms } from '../api/rooms';

interface RoomsState {
  rooms: Room[];
  loading: boolean;
  lastUpdated: number | null;
}

const initialState: RoomsState = {
  rooms: [],
  loading: true,
  lastUpdated: null,
};

export const fetchRooms = createAsyncThunk<Room[]>(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRooms();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // Add any synchronous reducers here
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
      let rooms = action.payload;
      state.rooms = rooms.map((room, i) => {
        return {
          building: room.name.split(/[0-9]/)[0].split(/[-_]/).join(" "),
          ...room,
          id: i,
        };
      });;
      state.loading = false;
      state.lastUpdated = Date.now();
    });
    builder.addCase(fetchRooms.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default roomsSlice.reducer;