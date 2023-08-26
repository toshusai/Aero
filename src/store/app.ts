import { createSlice } from "@reduxjs/toolkit";

export type AppState = {};

export const sceneSlice = createSlice({
  name: "app",
  initialState: {} as AppState,
  reducers: {},
});

export const appAction = sceneSlice.actions;

export const appReducer = sceneSlice.reducer;
