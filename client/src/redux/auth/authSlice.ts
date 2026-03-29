// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchMe } from "./authThunks";
import type { AuthState } from "../../types/AuthState";


const initialState: AuthState = {
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMe.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchMe.rejected, state => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export default authSlice.reducer;
