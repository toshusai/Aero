import React, { useEffect, useState } from "react";
import {
  createDragPointerHandler,
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

export function Timeline() {
  const [width, ref] = useWidth();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const BPM = 120;
  const BPS = BPM / 60;
  const measure = 4;
  const pxPerSec = BPS * 50;

  const [state, setState] = useState<Strip>({
    id: "1",
    nodes: [],
  });

  const handleTogglePlay = async () => {
    await Tone.start();
    setIsPlaying((isPlaying) => !isPlaying);
    if (!isPlaying) {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      state.nodes.forEach((node) => {
        synth?.triggerAttackRelease(
          node.code + node.octave,
          node.length,
          node.time + Tone.now()
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
      setCurrentTime(0);
      return;
    }
    let i = 0;
    const update = () => {
      setCurrentTime((prev) => {
        return prev + 1 / 60;
      });

      i = requestAnimationFrame(() => {
        update();
      });
    };
    update();
    return () => {
      cancelAnimationFrame(i);
    };
  }, [isPlaying]);
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

      setState((state) => {
        return {
          ...state,
          nodes: [...state.nodes, node],
        };
      });
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
      ctx.pass.node.length = Math.max(roundTime - ctx.pass.node.time, 0.25);
      setState((state) => {
        return {
          ...state,
          nodes: [...state.nodes],
        };
      });
    },
  });

  const steps = [1 / BPS, (1 / BPS) * measure];

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center">
        <button onClick={handleTogglePlay}>play</button>
      </div>
      <div className="flex w-full">
        <div style={{ minWidth: "70px" }}></div>
        <div className="flex w-full relative">
          <TimeView
            offsetSec={0}
            pxPerSec={pxPerSec}
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
          <TimeCursor left={currentTime * pxPerSec} top={0} />
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

          {state.nodes.map((node) => {
            return <SoundNodeBox key={node.id} node={node} />;
          })}
        </div>
      </div>
    </div>
  );
}
