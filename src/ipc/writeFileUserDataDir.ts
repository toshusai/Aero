import { WRITE_FILE_USER_DATA_DIR } from "@/electron-src/ipc/const";

import { isElectron, toUserDataLocalPath } from "./readFileUserDataDir";
/**
 * Writes data to a file in the userData directory
 * @param path relative path from userData directory e.g. "recent-projects.json"
 * @param data data to write
 * @returns
 */

export function writeFileUserDataDir(path: string, data: string) {
  if (!isElectron()) {
    localStorage.setItem(toUserDataLocalPath(path), data);
    return true;
  }
  const res = ipcRenderer.sendSync(WRITE_FILE_USER_DATA_DIR, path, data);
  return res;
}
