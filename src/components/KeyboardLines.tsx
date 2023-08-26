import styled from "styled-components";
import React from "react";
import { BLACK_KEY_WIDTH, codes } from "../const";
import { octaves } from "./Keyboard";

export function KeyboardLines() {
  return (
    <>
      {octaves
        .map((octave) => {
          return codes
            .map((code, i) => {
              return (
                <React.Fragment key={i}>
                  {code.includes("#") ? (
                    <BlackLineDiv>
                      <div>
                        {code}
                        {octave}
                      </div>
                    </BlackLineDiv>
                  ) : (
                    <WhiteLineDiv>
                      <div>
                        {code}
                        {octave}
                      </div>
                    </WhiteLineDiv>
                  )}
                </React.Fragment>
              );
            })
            .reverse();
        })
        .reverse()}
    </>
  );
}
const BlackLineDiv = styled.div`
  background: #0a0a0a;
  box-sizing: border-box;
  --color: #3f3f3f;
  border-top: 0.5px solid var(--color);
  border-bottom: 0.5px solid var(--color);
  min-height: ${BLACK_KEY_WIDTH}px;
  max-height: ${BLACK_KEY_WIDTH}px;
  width: 100%;
  pointer-events: none;
  padding-left: 4px;
  display: flex;
  font-size: 10px;
  justify-content: flex-start;
  align-items: center;
  > div {
    color: gray;
    transform: scale(0.8);
    transform-origin: left center;
  }
`;
const WhiteLineDiv = styled.div`
  background: #2d2d2d;
  --color: #3f3f3f;
  border-top: 0.5px solid var(--color);
  border-bottom: 0.5px solid var(--color);
  box-sizing: border-box;
  min-height: ${BLACK_KEY_WIDTH}px;
  max-height: ${BLACK_KEY_WIDTH}px;
  width: 100%;
  pointer-events: none;
  display: flex;
  padding-left: 4px;
  font-size: 10px;
  justify-content: flex-start;
  align-items: center;
  > div {
    transform: scale(0.8);
    transform-origin: left center;
  }
`;
