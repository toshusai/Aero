import React, { useEffect } from "react";
import { BLACK_KEY_WIDTH, codes } from "../const";
import { SoundNode } from "../types/SoundNode";
import styled from "styled-components";
import { Key, KeyboardInput, createDragPointerHandler } from "@/app-ui/src";
import { useDispatch } from "react-redux";
import { actions } from "@/store/scene";
import { octaves } from "./Keyboard";
import { snapToBeat, useBps } from "@/pages/Timeline";
import { useSelector } from "@/store/useSelector";

export function SoundNodeBox(props: { node: SoundNode; pxPerSec: number }) {
  const dispatch = useDispatch();
  const bps = useBps();
  const selected = useSelector((state) => state.scene.selectedNodeIds).includes(
    props.node.id
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selected) {
        dispatch(
          actions.removeNode({
            stripId: "1",
            nodeId: props.node.id,
          })
        );
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, props.node.id, selected]);
  const handlePointerDown = createDragPointerHandler<
    | {
        offsetX: number;
      }
    | undefined,
    undefined
  >({
    onDown: (ctx) => {
      if (!ctx.event.target) return;
      if (!(ctx.event.target instanceof HTMLElement)) return;
      const offsetX =
        ctx.event.clientX - ctx.event.target?.getBoundingClientRect().left;
      dispatch(actions.setSelectedNodeIds([props.node.id]));
      return {
        offsetX,
      };
    },
    onMove: (ctx) => {
      if (!ctx.pass) return;
      const time = props.node.time + ctx.diffX / props.pxPerSec;
      const roundTime = snapToBeat(time, bps);
      dispatch(
        actions.updateNode({
          node: {
            ...props.node,
            time: roundTime,
          },
          stripId: "1",
        })
      );
    },
  });
  return (
    <SoundNodeDiv
      onPointerDown={handlePointerDown}
      style={{
        top: `${
          codes
            .map((x) => x)
            .reverse()
            .indexOf(props.node.code) *
            BLACK_KEY_WIDTH +
          octaves
            .map((x) => x)
            .reverse()
            .indexOf(props.node.octave) *
            BLACK_KEY_WIDTH *
            codes.length
        }px`,
        left: `${props.node.time * props.pxPerSec}px`,
        width: `${props.node.length * props.pxPerSec}px`,
        border: selected ? "1px solid white" : "1px solid #00000000",
      }}
    ></SoundNodeDiv>
  );
}

export const SoundNodeDiv = styled.div`
  position: absolute;
  background: #529de2;
  border: 1px solid #00000000;
  box-sizing: border-box;
  height: ${BLACK_KEY_WIDTH}px;
  width: 20px;
  z-index: 2;
`;
