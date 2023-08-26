import { Provider } from "react-redux";
import React from "react";

import {
  BottomSpaceDiv,
  COLOR_BACKGROUND_NAME,
  GlobalStyle,
  HeaderDiv,
  HPanel,
  KeyboardInput,
  MainDiv,
  RootDiv,
  VPanel,
} from "@/app-ui/src";

import store from "@/store";
import * as Tone from "tone/build/esm";
import { Timeline } from "./Timeline";

const IndexPage = () => {
  KeyboardInput.init(() => {});
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <RootDiv>
          <HeaderDiv></HeaderDiv>
          <MainDiv>
            <VPanel
              top={
                <div
                  style={{
                    backgroundColor: `var(${COLOR_BACKGROUND_NAME})`,
                    height: "100%",
                    width: "100%",
                  }}
                ></div>
              }
              bottom={<Timeline />}
            />
          </MainDiv>
          <BottomSpaceDiv />
        </RootDiv>
      </Provider>
    </>
  );
};

export default IndexPage;

export let synth: Tone.PolySynth | null = null;

export function getSynth() {
  return synth;
}
export function setSynth(s: Tone.PolySynth) {
  synth = s;
}
