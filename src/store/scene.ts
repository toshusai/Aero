import { Strip } from "@/pages/Strip";
import { createSlice } from "@reduxjs/toolkit";

export type SceneState = {
  isPlaying: boolean;
  currentTime: number;
  cursorMode: "select" | "add";
  strips: Strip[];
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    strips: [
      {
        id: "1",
        nodes: [],
      },
    ],
    currentTime: 0,
    isPlaying: false,
    cursorMode: "select",
  } as SceneState,
  reducers: {
    setPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    setCursorMode(state, action) {
      state.cursorMode = action.payload;
    },
    addNode(state, action) {
      const { stripId, node } = action.payload;
      const strip = state.strips.find((strip) => strip.id === stripId);
      if (strip) {
        strip.nodes.push(node);
      }
    },
    removeNode(state, action) {
      const { stripId, nodeId } = action.payload;
      const strip = state.strips.find((strip) => strip.id === stripId);
      if (strip) {
        strip.nodes = strip.nodes.filter((node) => node.id !== nodeId);
      }
    },
    updateNode(state, action) {
      const { stripId, node } = action.payload;
      const strip = state.strips.find((strip) => strip.id === stripId);
      if (strip) {
        const index = strip.nodes.findIndex((n) => n.id === node.id);
        strip.nodes[index] = node;
      }
    },
  },
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
