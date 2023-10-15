import {
  addClick,
  closeSelectBox,
  closeLogoBox,
  openLogoBox,
  getLogoBoxStatus,
  closeNameBox,
  fileDownload
} from "../helper.js";

function logoBoxControl() {
  const fileOpen = getLogoBoxStatus();
  if (fileOpen == "closed") {
    closeNameBox();
    closeSelectBox();
    openLogoBox();
  }
  if (fileOpen == "open") {
    closeLogoBox();
  }
}

addClick("logoBoxDownloadBtn", fileDownload);

export { logoBoxControl, closeLogoBox };
