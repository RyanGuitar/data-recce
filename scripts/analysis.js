import {
  sortDataObject,
  getAnalysisStatus,
  addFocus,
  closeSelectBox,
  getRepeatAlarms,
  stopAnalysis,
  startAnalysis,
  getSelectedDate,
  getDownloadDate,
  closeNameBox,
  closeLogoBox,
  getTotalAlarms,
} from "../helper.js"
import {
  getData,
  worker
} from "./RWD.js"
import {
  generateBarChart,
  generatePercentagePieChart,
  generatePieChart
} from "./drawCharts.js"
import {
  processSearchedMonth,
} from "./selectBox.js"

function analyseData(){
  let dataObj = {}
  if(getSelectedDate().day){
    const data = getData()
    const {year, month, day} = getSelectedDate()
    dataObj = data[year][month][day]
  } else {
    dataObj = processSearchedMonth()
  }
  const addresses = Object.entries(dataObj).length
  const totalAlarms = getTotalAlarms(dataObj)
  const start = getAnalysisStatus()
 
  if(start == "stop"){
    const repeatAlarms = getRepeatAlarms(dataObj)
    const dataObject = Object.fromEntries(repeatAlarms);
    const totalRepeats = getTotalAlarms(dataObject)
    const percentageRepeat = Math.round(totalRepeats/totalAlarms * 100)
    generateBarChart(dataObject)
    generatePercentagePieChart(totalRepeats, totalAlarms, percentageRepeat)
    startAnalysis()
  } 
  if (start == "start") {
    generatePieChart(totalAlarms, addresses)
    generateBarChart(sortDataObject(dataObj))
    stopAnalysis()
  }
  closeNameBox()
  closeSelectBox()
  closeLogoBox()
}

function inputControl(){
  const start = getAnalysisStatus()
  const today = Object.values(getDownloadDate()).join(" ")
  const selectedDate = Object.values(getSelectedDate()).join(" ")
  if(start == "start"){
    stopAnalysis()
    worker.postMessage({ msg: "read", data: "" });
  }
  if(selectedDate != today){
    worker.postMessage({ msg: "read", data: "" });
  }
  closeNameBox()
  closeSelectBox()
  closeLogoBox()
}

addFocus("input", inputControl)

export {
  analyseData,
  stopAnalysis
}