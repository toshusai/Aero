import { createSlice } from "@reduxjs/toolkit";

export type SceneState = {};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {} as SceneState,
  reducers: {},
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
