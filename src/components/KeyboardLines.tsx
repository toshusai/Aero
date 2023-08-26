import styled from "styled-components";
import React from "react";
import { BLACK_KEY_WIDTH, codes } from "../const";

export function KeyboardLines() {
  return (
    <>
      {codes
        .map((code, i) => {
          return (
            <React.Fragment key={i}>
              {code.includes("#") ? (
                <BlackLineDiv />
              ) : (
                <WhiteLineDiv
                  style={{
                    height: `${14}px`,
                  }}
                />
              )}
            </React.Fragment>
          );
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
  height: ${BLACK_KEY_WIDTH}px;
  width: 100%;
  pointer-events: none;
`;
const WhiteLineDiv = styled.div`
  background: #2d2d2d;
  --color: #3f3f3f;
  border-top: 0.5px solid var(--color);
  border-bottom: 0.5px solid var(--color);
  box-sizing: border-box;
  height: ${13}px;
  width: 100%;
  pointer-events: none;
`;
