import {
  toText,
  addToId,
  getId,
  getTotalDateAlarms,
  sortDataObject,
  getTodaysDate
} from "../helper.js"
import {
  generateBarChart,
  generatePieChart
} from "./drawCharts.js"

let data = {}

const worker = new Worker("worker.js");

worker.addEventListener("message", (event) => {
  const { data, msg } = event.data;

  if (msg === "write") {
    worker.postMessage({ msg: "read", data: "" });
  }
  if (msg === "read" && data) {
    setData(data);
   const {year, month, day} = getTodaysDate()
   
    if(!data[year]?.[month]?.[day]){
      addToId("canvasBox", "");
      getId("canvasBox").style.width = `${0}px`
      addToId("canvasBox2", "");
    }
    init()
  }
  if(msg == "error"){
    return
  }
});

function init() {
  let {year, month, day} = getTodaysDate()
  const data = getData();
  if (!data[year]?.[month]?.[day]) {
    return;
  }
  const totals = getTotalDateAlarms(data).split(" ")
  generateBarChart(sortDataObject(data[year][month][day]));
  generatePieChart(totals[0], totals[1])
}

function getValue(action) {
  const value = getId("input").value.trim();
  if (value === "") return;
  const splitValue = value.split(" ");
  const alarm = splitValue
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (action === "plus") {
    addAlarm(alarm);
  }
  if (action === "minus") {
    deleteAlarm(alarm);
  }
}

function addAlarm(alarm) {
  const {day, year, month} = getTodaysDate()
  if (!data[year]) {
    data[year] = {};
    data[year][month] = {};
    data[year][month][day] = {};
  }
  if (!data[year][month]) {
    data[year][month] = {};
    data[year][month][day] = {};
  }
  if (!data[year][month][day]) {
    data[year][month][day] = {};
  }
  if (data[year][month][day][alarm]) {
    data[year][month][day][alarm]++;
  } else {
    data[year][month][day][alarm] = 1;
  }
  worker.postMessage({msg:"write", data: toText(data)})
}

function deleteAlarm(alarm) {
  const {day, year, month} = getTodaysDate()
  if (!data[year]) {
    return;
  }
  if (!data[year][month]) {
    return;
  }
  if (!data[year][month][day]) {
    return;
  }
  if (!data[year][month][day][alarm]) {
    return;
  }

  data[year][month][day][alarm]--;
  if (data[year][month][day][alarm] < 1) {
    delete data[year][month][day][alarm];
    if (Object.entries(data[year][month][day]).length == 0) {
      delete data[year][month][day];
    }
    if (Object.entries(data[year][month]).length == 0) {
      delete data[year][month];
    }
    if (Object.entries(data[year]).length == 0) {
      delete data[year];
    }
  }
  worker.postMessage({ msg: "write", data: toText(data) });
}

function setData(readData){
  data = readData
}

function getData(){
  return data
}

worker.postMessage({ msg: "read", data: "" });

export {
  addAlarm,
  deleteAlarm,
  worker,
  getData,
  data,
  getValue
}
