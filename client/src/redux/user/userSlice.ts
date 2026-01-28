import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Graph } from "../../types/GraphTypes";
import { fetchMe } from "../auth/authThunks";

interface User {
  name: string | null;
  email: string | null;
  profilePicture?: string;
  graphs: Graph[]
}

const initialState:User={
    name: null,
    email: null,
    graphs: []
}

const userSlice=createSlice({
    name: "user",
    initialState,
    reducers:{
        setUser: (state, action: PayloadAction<any>)=>{
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.profilePicture=action.payload.profilePicture;
            state.graphs=action.payload.graphs;
        }
    },
    extraReducers: builder => {
    builder.addCase(fetchMe.fulfilled, (state, action) => {
        console.log(action.payload);
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture;
      state.graphs = action.payload.graphs;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;