import { addChange, closeSelectBox, closeLogoBox, getNameBoxStatus, openNameBox, closeNameBox, stopAnalysis } from "../helper.js";
import { worker } from "./RWD-v2.js";

function nameBoxControl() {
  const open = getNameBoxStatus();
  if (open == "closed") {
    closeLogoBox();
    closeSelectBox();
    openNameBox();
  }
  if (open == "open") {
    closeNameBox();
  }
}

async function getFileValue(e) {
  const data = await e.target.files[0].text();
  worker.postMessage({ msg: "write", data });
  closeNameBox();
  stopAnalysis()
}

addChange("nameBoxInput", getFileValue);

export { nameBoxControl, closeNameBox };