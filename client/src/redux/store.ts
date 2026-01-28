import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./features/counter/counterSlice";
import userReducer from "./user/userSlice"
import authReducer from "./auth/authSlice"

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
