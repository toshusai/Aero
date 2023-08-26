import React from "react";
import { getStepPixel } from "@/app-ui/src";

export function VerticalLines(props: {
  width: number;
  steps: number[];
  pxPerSec: number;
  measure: number;
}) {
  const { width } = props;
  const steps = getStepPixel(props.pxPerSec, 32, props.steps, width, 0);
  const subSteps = getStepPixel(
    props.pxPerSec,
    32 / props.measure,
    props.steps,
    width,
    0
  );
  return (
    <>
      {subSteps.map((left) => {
        return (
          <div
            key={left}
            style={{
              position: "absolute",
              left: `${left}px`,
              borderLeft: "1px solid #323232",
              height: "100%",
              background: "black",
              pointerEvents: "none",
            }}
          />
        );
      })}
      {steps.map((left) => {
        return (
          <div
            key={left}
            style={{
              position: "absolute",
              left: `${left}px`,
              borderLeft: "1px solid #676767",
              height: "100%",
              background: "black",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}
