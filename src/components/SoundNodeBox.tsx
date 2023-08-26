import React from "react";
import { codes } from "../const";
import { SoundNode } from "../types/SoundNode";
import styled from "styled-components";

export function SoundNodeBox(props: { node: SoundNode }) {
  return (
    <SoundNodeDiv
      style={{
        top: `${
          codes
            .map((x) => x)
            .reverse()
            .indexOf(props.node.code) * 14
        }px`,
        left: `${props.node.time * 100}px`,
        width: `${props.node.length ? props.node.length * 100 : 20}px`,
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
