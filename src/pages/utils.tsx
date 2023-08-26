import { codes, codesOffsetTop } from "../const";
import { BLACK_KEY_WIDTH } from "../const";

export function getHeight(code: string, i: number) {
  const next = getNextCode(code);
  const prev = getPrevCode(code);
  const useNext = !next.startsWith("#") && code != "B" && code != "E";
  const usePrev = !prev.startsWith("#") && code != "C" && code != "F";
  return (
    BLACK_KEY_WIDTH +
    (useNext ? BLACK_KEY_WIDTH - codesOffsetTop[next] : 0) +
    (usePrev ? codesOffsetTop[prev] : 0)
  );
}

function getNextCode(code: string) {
  const index = codes.indexOf(code);
  if (index === codes.length - 1) {
    return codes[0];
  }
  return codes[index + 1];
}

function getPrevCode(code: string) {
  const index = codes.indexOf(code);
  if (index === 0) {
    return codes[codes.length - 1];
  }
  return codes[index - 1];
}
