import {
  getId,
  addToId,
  addClick,
  sortDataObject,
  getTotalDateAlarms,
  clear,
  addKeyup,
  openSelectBox,
  closeSelectBox,
  getSelectedDate,
  closeNameBox,
  closeLogoBox 
} from "../helper.js";
import { getData } from "./RWD-v2.js";
import { generatePieChart, generateBarChart } from "./drawCharts.js";
import { stopAnalysis } from "./analysis.js";

let dates = [];
let months = [];
let data = {};
let years = [];
let totalAlarms = 0;

function selectBoxControl() {
  const open = getSelectBoxStatus();

  if (open === "closed") {
    openSelectBox();
    closeLogoBox();
    closeNameBox();
    getDataDates();
    dayPeriodActive();
  }
  if (open === "open") {
    addToId("searchedDatesBox", "");
    closeSelectBox();
  }
}

function dayPeriodActive() {
  getId("dayPeriod").style.background = "rgba(93, 101, 69, 1)";
  getId("monthPeriod").style.background = "transparent";
  getId("dayPeriod").dataset.active = "no";
  getDataDates();
}

function getSelectBoxStatus() {
  return getId("selectBox").dataset.open;
}

function getDataDates() {
  dates = [];
  data = getData();
  years = Object.keys(data);

  for (const year of years) {
    months = Object.keys(data[year]);
    for (const month of months) {
      const days = Object.keys(data[year][month]);
      for (const day of days) {
        dates.push(`${day} ${month} ${year}`);
      }
    }
  }

  const showDataDates = dates.map((date) => `<div>${date}</div>`);
  addToId("searchedDatesBox", showDataDates.join(""));
}

function getDataMonths() {
  dates = [];
  for (const year of years) {
    for (const month of months) {
      dates.push(`${months} ${year}`);
    }
  }
  const showDataDates = dates.map((date) => `<div>${date}</div>`);
  addToId("searchedDatesBox", showDataDates.join(""));
}

function searchDates(e) {
  const inputValue = e.target.value;
  const filteredDate = dates.filter((date) => date.includes(inputValue));
  const showFilteredDate = filteredDate.map((date) => `<div>${date}</div>`);
  addToId("searchedDatesBox", showFilteredDate.join(""));
}

function processSearchedDate() {
  const { year, month, day } = getSelectedDate();
  const sortedDataObject = sortDataObject(data[year][month][day]);
  const totals = getTotalDateAlarms(data).split(" ");
  totalAlarms = totals[0];
  generatePieChart(totalAlarms, totals[1]);
  generateBarChart(sortedDataObject);
}

function getTotalMonthsAlarms(dataObj) {
  let totalAlarms = 0;
  const addresses = Object.values(dataObj);
  addresses.map((alarm) => (totalAlarms += alarm));
  return `${totalAlarms} ${addresses.length}`;
}

function processSearchedMonth() {
  let days = [];
  const mergedObject = {};
  const { year, month } = getSelectedDate();
  const dataEntries = Object.entries(data[year][month]);
  let objects = [];
  for (const entries of dataEntries) {
    objects.push(entries[1]);
  }
  for (const object of objects) {
    for (const key in object) {
      if (mergedObject.hasOwnProperty(key)) {
        mergedObject[key] += object[key];
      } else {
        mergedObject[key] = object[key];
      }
    }
  }
  const sortedDataObject = sortDataObject(mergedObject);
  const totals = getTotalMonthsAlarms(sortedDataObject).split(" ");
  generatePieChart(totals[0], totals[1]);
  generateBarChart(sortedDataObject);
  return sortedDataObject;
}

function getSearchedDate(e) {
  if (e.target.id == "searchedDatesBox") return;
  const date = e.target.innerHTML.split(" ");
  addToId("date", date.join(" "));
  if (getSelectedDate().day) {
    processSearchedDate();
  } else {
    processSearchedMonth();
  }
  clear("search");
  closeSelectBox();
  stopAnalysis();
}

function monthPeriodActive() {
  getId("monthPeriod").style.background = "rgba(93, 101, 69, 1)";
  getId("dayPeriod").style.background = "transparent";
  getId("dayPeriod").dataset.active = "yes";
  getDataMonths();
}

function setDatePeriod() {
  const day = getId("dayPeriod").dataset.active;
  if (day == "yes") {
    dayPeriodActive();
  }
  if (day == "no") {
    monthPeriodActive();
  }
}

addClick("searchedDatesBox", getSearchedDate);
addKeyup("search", searchDates);
addClick("selectBoxPeriod", setDatePeriod);

export {
  selectBoxControl,
  processSearchedMonth,
  getSearchedDate,
  searchDates,
  closeSelectBox,
};
