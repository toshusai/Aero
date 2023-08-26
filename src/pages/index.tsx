import { Provider } from "react-redux";
import React from "react";

import {
  BottomSpaceDiv,
  GlobalStyle,
  HeaderDiv,
  HPanel,
  MainDiv,
  RootDiv,
  VPanel,
} from "@/app-ui/src";

import store from "@/store";
import * as Tone from "tone/build/esm";
import { Timeline } from "./Timeline";

const IndexPage = () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <RootDiv>
          <HeaderDiv></HeaderDiv>
          <MainDiv>
            <VPanel
              top={<Timeline />}
              bottom={
                <HPanel left={<div>left</div>} right={<div>right</div>} />
              }
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
