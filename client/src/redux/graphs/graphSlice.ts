import { createSlice } from "@reduxjs/toolkit";
import type { Graph } from "../../types/GraphTypes";
import { fetchGraphById } from "./graphThunks";

type GraphState = {
  graphs: Graph[];
  loading: boolean;
  error: string | null;
};

const initialState: GraphState = {
  graphs: [],
  loading: false,
  error: null
};


const graphSlice = createSlice({
  name: "graphs",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGraphById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraphById.fulfilled, (state, action) => {
        state.loading = false;

        const incoming = action.payload;

        const index = state.graphs.findIndex(
          g => g.id === incoming.id
        );

        if (index === -1) {
          state.graphs.push(incoming);
        } else {
          state.graphs[index] = incoming;
        }
      })
      .addCase(fetchGraphById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default graphSlice.reducer;