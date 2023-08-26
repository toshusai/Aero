import styled from "styled-components";
import React from "react";
import { BLACK_KEY_WIDTH } from "../const/BLACK_KEY_WIDTH";
import { getHeight } from "../pages/utils";
import { codes, codesOffsetTop } from "../const";

export function Keyboard() {
  return (
    <>
      {codes
        .map((code, i) => {
          return (
            <div className="relative" key={i}>
              {code.includes("#") ? (
                <BlackKeyDiv
                  style={{
                    top: `-${codesOffsetTop[code]}px`,
                    height: `${BLACK_KEY_WIDTH}px`,
                  }}
                />
              ) : (
                <WhiteKeyDiv
                  style={{
                    height: `${getHeight(code, i)}px`,
                  }}
                />
              )}
            </div>
          );
        })
        .reverse()}
    </>
  );
}
const BlackKeyDiv = styled.div`
  background: black;
  width: 50px;
  border: 0.5px solid #202020;
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  :hover {
    background: #616078;
  }
`;
const WhiteKeyDiv = styled.div`
  box-sizing: border-box;
  background: white;
  width: 70px;
  border: 0.5px solid #5c5c5c;

  :hover {
    background: #d9d2fb;
  }
`;
