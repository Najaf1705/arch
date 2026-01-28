// graphThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Graph } from "../../types/GraphTypes";
import axios from "axios";

export const fetchGraphById = createAsyncThunk<Graph,string>(
  "graphs/fetchById",
  async (graphId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/graphs/${graphId}`);
      return res.data; // Graph
    } catch (err: any) {
      return rejectWithValue("Failed to fetch graph");
    }
  }
);
