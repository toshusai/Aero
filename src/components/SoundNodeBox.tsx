import React from "react";
import { codes } from "../const";
import { SoundNode } from "../types/SoundNode";
import styled from "styled-components";
import { createDragPointerHandler } from "@/app-ui/src";
import { useDispatch } from "react-redux";
import { actions } from "@/store/scene";

export function SoundNodeBox(props: { node: SoundNode; pxPerSec: number }) {
  const dispatch = useDispatch();
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
      return {
        offsetX,
      };
    },
    onMove: (ctx) => {
      if (!ctx.pass) return;
      const time = props.node.time + ctx.diffX / props.pxPerSec;
      const roundTime = Math.round(time * 4) / 4;
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
            .indexOf(props.node.code) * 14
        }px`,
        left: `${props.node.time * props.pxPerSec}px`,
        width: `${
          props.node.length ? props.node.length * props.pxPerSec : 20
        }px`,
      }}
    ></SoundNodeDiv>
  );
}

export const SoundNodeDiv = styled.div`
  position: absolute;
  background: #529de2;
  border: 1px solid #00000000;
  box-sizing: border-box;
  height: 14px;
  width: 20px;
  z-index: 2;
`;
