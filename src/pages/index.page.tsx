import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";

const DynamicComponent = dynamic(() => import("./index"), {
  ssr: false,
});
import Index from "./index";
export default () => {
  return (
    <>
      <Index />
    </>
  );
};
