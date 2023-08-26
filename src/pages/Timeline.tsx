import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  createDragPointerHandler,
  IconButton,
  iconProps,
  TimeCursor,
  TimeView,
  useWidth,
} from "@/app-ui/src";
import * as Tone from "tone/build/esm";
import { Keyboard } from "../components/Keyboard";
import { BLACK_KEY_WIDTH } from "../const";
import { codes } from "../const";
import { KeyboardLines } from "../components/KeyboardLines";
import { SoundNodeBox } from "../components/SoundNodeBox";
import { VerticalLines } from "../components/VerticalLines";
import { getSynth, setSynth } from ".";
import { Strip } from "./Strip";
import { SoundNode } from "../types/SoundNode";
import { HandMove, Pencil, PlayerPlay, PlayerStop } from "tabler-icons-react";
import { useDispatch } from "react-redux";
import { SceneState, actions } from "@/store/scene";
import { useSelector } from "@/store/useSelector";

export function useCurrentTime() {
  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state.scene.currentTime);
  return [
    currentTime,
    (time: number) => dispatch(actions.setCurrentTime(time)),
  ] as const;
}

export function useIsPlaying() {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.scene.isPlaying);
  return [
    isPlaying,
    (isPlaying: boolean) => dispatch(actions.setPlaying(isPlaying)),
  ] as const;
}

export function useCursorMode() {
  const dispatch = useDispatch();
  const cursorMode = useSelector((state) => state.scene.cursorMode);
  return [
    cursorMode,
    (cursorMode: SceneState["cursorMode"]) =>
      dispatch(actions.setCursorMode(cursorMode)),
  ] as const;
}

export function useNode(id: string) {
  const dispatch = useDispatch();
  const node = useSelector((state) => {
    let node: SoundNode | undefined;
    state.scene.strips.find(
      (strip) => (node = strip.nodes.find((node) => node.id === id))
    );
    return node;
  });
  return [
    node,
    (node: SoundNode) => dispatch(actions.updateNode(node)),
  ] as const;
}

export function Timeline() {
  const [width, ref] = useWidth();
  const [currentTime, setCurrentTime] = useCurrentTime();
  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [cursorMode, setCursorMode] = useCursorMode();
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.scene.strips[0].nodes);

  const BPM = 120;
  const BPS = BPM / 60;
  const measure = 4;
  const pxPerSec = BPS * 50;

  const handleTogglePlay = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      const now = Tone.now();
      nodes.forEach((node) => {
        synth?.triggerAttackRelease(
          node.code + node.octave,
          node.length,
          now + node.time - currentTime
        );
      });
      setSynth(synth);
    } else {
      const synth = getSynth();
      if (synth) synth.dispose();
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    let i = 0;
    let timer = currentTime;
    const update = () => {
      timer += 1 / 60;
      setCurrentTime(timer);

      i = requestAnimationFrame(() => {
        update();
      });
    };
    update();
    return () => {
      cancelAnimationFrame(i);
    };
  }, [isPlaying]);

  const handlePointerDownTimeView = createDragPointerHandler({
    onDown: (ctx) => {
      if (!(ctx.event.target instanceof HTMLElement)) return;
      const clientX =
        ctx.event.clientX - ctx.event.target.getBoundingClientRect().left;
      const time = clientX / pxPerSec;
      setCurrentTime(time);
    },
  });

  const handlePointerDown = createDragPointerHandler<
    | {
        node: SoundNode;
      }
    | undefined,
    undefined
  >({
    onDown: (ctx) => {
      const event = ctx.event;
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target !== ref.current) return;
      if (cursorMode === "select") return;
      const offsetY = event.clientY - event.target.getBoundingClientRect().top;
      const codeIndex = Math.floor(offsetY / BLACK_KEY_WIDTH);
      const code = codes[codes.length - codeIndex - 1];
      const clientX = event.clientX - event.target.getBoundingClientRect().left;
      const time = clientX / pxPerSec;
      const roundTime = Math.floor(time * 4) / 4;
      const node = {
        id: Date.now().toString(),
        octave: 4,
        code,
        time: roundTime,
        length: 0.25,
      };

      dispatch(actions.addNode({ stripId: "1", node }));
      return {
        node,
      };
    },
    onMove: (ctx) => {
      if (!ctx.pass) return;
      if (!(ctx.event.target instanceof HTMLElement)) return;
      const clientX =
        ctx.event.clientX - ctx.event.target.getBoundingClientRect().left;
      const time = clientX / pxPerSec;
      const roundTime = Math.floor(time * 4) / 4;
      const length = Math.max(roundTime - ctx.pass.node.time, 0.25);
      dispatch(
        actions.updateNode({
          stripId: "1",
          node: {
            ...ctx.pass.node,
            length,
          },
        })
      );
    },
  });

  const steps = [1 / BPS, (1 / BPS) * measure];

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-center">
        <div className="flex gap-8">
          <ButtonGroup>
            <IconButton onClick={() => setCursorMode("select")}>
              <HandMove
                {...iconProps}
                color={
                  cursorMode === "select" ? "var(--color-primary)" : "white"
                }
              />
            </IconButton>
            <IconButton onClick={() => setCursorMode("add")}>
              <Pencil
                {...iconProps}
                color={cursorMode === "add" ? "var(--color-primary)" : "white"}
              />
            </IconButton>
          </ButtonGroup>
          <IconButton onClick={handleTogglePlay}>
            {isPlaying ? (
              <PlayerStop {...iconProps} />
            ) : (
              <PlayerPlay {...iconProps} />
            )}
          </IconButton>
        </div>
      </div>
      <div className="flex w-full">
        <div style={{ minWidth: "70px" }}></div>
        <div className="flex w-full relative">
          <TimeView
            offsetSec={0}
            pxPerSec={pxPerSec}
            onPointerDown={handlePointerDownTimeView}
            steps={steps}
            renderText={(v) => {
              const m = (v * BPS) / measure;
              if (m % 1 !== 0) {
                return (
                  Math.ceil(m) + "." + ((m % 1) / (1 / measure) + 1).toFixed(0)
                );
              }

              return (m + 1).toFixed(0) + ".1";
            }}
          />
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col">
          <Keyboard />
        </div>
        <div
          className="flex flex-col w-full relative"
          ref={ref}
          onPointerDown={handlePointerDown}
        >
          <KeyboardLines />
          <VerticalLines
            width={width}
            measure={measure}
            steps={steps}
            pxPerSec={pxPerSec}
          />

          {nodes.map((node) => {
            return <SoundNodeBox key={node.id} node={node} />;
          })}
          <TimeCursor left={currentTime * pxPerSec} top={-20} bottom={-2} />
        </div>
      </div>
    </div>
  );
}
