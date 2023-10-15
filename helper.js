import {
  getValue,
  getData,
} from "./scripts/RWD.js"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getId(id) {
  return document.getElementById(id);
}

function addClick(id, fn) {
  getId(id).addEventListener("click", fn);
}

function addToId(id, el) {
  getId(id).innerHTML = el;
}

function toText(data) {
  return JSON.stringify(data);
}

function clear(id) {
  getId(id).value = "";
}

function getInnerHTML(id){
  return getId(id).innerHTML
}

function addKeyup(id, fn){
  getId(id).addEventListener("keyup", fn)
}

function sortDataObject(dataObj){
  const dataArray = Object.entries(dataObj)
  dataArray.sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(dataArray);
}

function listenInputBox(e) {
  if (e.target.id === "plus") {
    getValue("plus");
  }
  if (e.target.id === "minus") {
    getValue("minus");
  }
  clear("input");
}

function getAnalysisStatus(){
  return getId("analysis").dataset.analyse
}

function addFocus(id, fn){
  getId(id).addEventListener("focus", fn)
}

function addChange(id, fn){
  getId(id).addEventListener("change", fn)
}

function getTotalDateAlarms(data) {
  let {year, month, day} = getSelectedDate()
  let totalAlarms = 0
  if (!data[year]?.[month]?.[day]) {
    return;
  }
  const addresses = Object.values(data[year][month][day]);
  addresses.map((alarm) => (totalAlarms += alarm));
  return `${totalAlarms} ${addresses.length}`
}

function openSelectBox() {
  getId("selectBox").style.transform = "translate(0, 0)";
  getId("selectBox").dataset.open = "open";
  getId("selectDate").style.background = "rgba(93, 101, 69, 1)";
}

function closeSelectBox() {
  getId("selectBox").style.transform = "translate(0, -100%)";
  getId("selectBox").dataset.open = "closed";
  getId("selectDate").style.background = "transparent";
}

function getRepeatAlarms(dataObj){
  return Object.entries(dataObj).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1])
 }

 function stopAnalysis(){
  getId("analysis").style.background = "transparent"
  getId("analysis").dataset.analyse = "stop"
}

function startAnalysis(){
  getId("analysis").style.background = "rgba(93, 101, 69, 1)"
  getId("analysis").dataset.analyse = "start"
} 

function getTodaysDate(){
  const dateO = {}
  const date = new Date();
  const month = date.getMonth();
  dateO.day = date.getDate();
  dateO.month = months[month]
  dateO.year = date.getFullYear();
  addToId("date", `${dateO.day} ${dateO.month} ${dateO.year}`)
  return dateO
}

function getDownloadDate(){
  const dateO = {}
  const date = new Date();
  const month = date.getMonth();
  dateO.day = date.getDate();
  dateO.month = months[month]
  dateO.year = date.getFullYear();
  return dateO
}

function getSelectedDate(){
  const dateO = {}
  const date = getInnerHTML("date")
  const splitDate = date.split(" ")
  if(splitDate.length == 3){
    dateO.day = splitDate[0]
    dateO.month = splitDate[1]
    dateO.year = splitDate[2]
  } else {
    dateO.month = splitDate[0]
    dateO.year = splitDate[1]
  }
  return dateO
}

function closeLogoBox() {
  getId("logoBox").style.transform = "translate(0, -100%)";
  getId("logoBox").dataset.open = "closed";
  getId("logo").style.filter = "drop-shadow(2px 2px 2px black)";
}

function openLogoBox() {
  const { day, month, year } = getDownloadDate();
  addToId("logoBoxDate", `${day} ${month} ${year}`);
  getId("logoBox").style.transform = "translate(0, 0)";
  getId("logoBox").dataset.open = "open";
  getId("logo").style.filter = "drop-shadow(0px 0px 0px black)";
}

function getLogoBoxStatus() {
  return getId("logoBox").dataset.open;
}

function getNameBoxStatus() {
  return getId("nameBox").dataset.open;
}

function openNameBox() {
  getId("nameBox").style.transform = "translate(0, 0)";
  getId("nameBox").dataset.open = "open";
  getId("name").style.filter = "drop-shadow(0px 0px 0px black)";
}

function closeNameBox() {
  getId("nameBox").style.transform = "translate(0, -100%)";
  getId("nameBox").dataset.open = "closed";
  getId("name").style.filter = "drop-shadow(2px 2px 2px black)";
}

function getTotalAlarms(dataObj){
  let total = 0
  const dataArray = Object.values(dataObj)
  dataArray.map((alarm) => (total += alarm));
  return total
}

function fileDownload() {
  const text = toText(getData());
  const logoBoxArea = getId("logoBoxArea").textContent.trim();
  const logoBoxDate = getId("logoBoxDate").textContent.trim();
  const fileName = `${logoBoxArea}:${logoBoxDate}`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  closeLogoBox();
}

export { 
  getId, 
  addToId, 
  addClick, 
  toText, 
  clear, 
  getInnerHTML, 
  addKeyup, 
  sortDataObject,
  listenInputBox,
  getAnalysisStatus,
  addFocus,
  addChange,
  getTotalDateAlarms,
  openSelectBox,
  closeSelectBox,
  getRepeatAlarms,
  stopAnalysis,
  startAnalysis,
  getTodaysDate,
  getDownloadDate,
  getSelectedDate,
  closeLogoBox,
  openLogoBox,
  getLogoBoxStatus,
  getNameBoxStatus,
  closeNameBox,
  openNameBox,
  getTotalAlarms,
  fileDownload
};
