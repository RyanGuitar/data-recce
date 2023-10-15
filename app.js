import { 
  addClick, 
  listenInputBox,
} from "./helper.js";
import {
  selectBoxControl
} from "../scripts/selectBox.js"
import {
  analyseData,
} from "./scripts/analysis.js"
import {
  nameBoxControl
} from "./scripts/nameBox.js"
import {
  logoBoxControl
} from "./scripts/logoBox.js"

addClick("inputBox", listenInputBox);
addClick("analysis", analyseData)
addClick("selectDate", selectBoxControl);
addClick("logo", logoBoxControl)
addClick("name", nameBoxControl)