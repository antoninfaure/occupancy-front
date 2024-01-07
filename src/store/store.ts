// store.ts
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import roomsReducer from './roomsSlice';
import coursesSlice from './coursesSlice';
import studyplansSlice from './studyplansSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['rooms', 'courses', 'studyplans'],
};

const rootReducer = combineReducers({
  rooms: roomsReducer,
  courses: coursesSlice,
  studyplans: studyplansSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;