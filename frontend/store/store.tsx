import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from '@/store/slices/authSlice';
import sessionReducer from '@/store/slices/sessionSlice';
import gymSessionReducer from '@/store/slices/gymSessionSlice';
import gymReducer from './slices/gymSlice';
import trainerReducer from './slices/trainerSlice';
import memberReducer from './slices/memberSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    gymSession: gymSessionReducer,
    gym: gymReducer,
    trainer: trainerReducer,
    member: memberReducer
  },

});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;