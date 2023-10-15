import {
  addToId, 
  getId
} from "../helper.js"

function generateBarChart(dataObject) {
  addToId("canvasBox", `<canvas id="barChart"></canvas>`);
  const ctx = getId("barChart").getContext("2d");
  const labels = Object.keys(dataObject);

  const data = Object.values(dataObject);
  const chartContainer = getId("canvasBox");
  const minBarWidth = 50;
  const numBars = labels.length;
  const calculatedWidth = minBarWidth * numBars + 50;
  chartContainer.style.width = `${calculatedWidth}px`;
  ctx.canvas.style.width = `${calculatedWidth}px`;

  const barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["rgba(93, 101, 69, 1)", "rgba(78, 76, 60, 1)"],
          borderColor: "rgba(45, 45, 50, 1)",
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 1,
        },
      ],
    },
    options: {
      onClick: handleBarClick,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          title: {
            display: true,
            text: "Percentages",
            color: "white",
            padding: {
              top: 10,
              bottom: 0,
            },
          },
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
        },
      },
    },
  });
  function handleBarClick(event, elements) {
    if (elements.length <= 0) {
      return;
    }
    const clickedElement = elements[0];
    getId("input").value = labels[clickedElement.index];
  }
}

function generatePieChart(total, addresses) {
  addToId("canvasBox2", `<canvas id="pieChart"></canvas>`);
  const ctx = getId("pieChart").getContext("2d");
  const labels = ["alarms", "addresses"];
  const data = [total, addresses];

  const barChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["rgba(93, 101, 69, 1)", "rgba(78, 76, 60, 1)"],
          borderColor: "rgba(45, 45, 50, 1)",
          borderWidth: 1,
          categoryPercentage: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function generatePercentagePieChart(repeats, alarms, percentage) {
  addToId("canvasBox2", `<canvas id="pieChart"></canvas>`);
  const ctx = getId("pieChart").getContext("2d");
  const labels = ["repeats", "alarms"];
  const data = [repeats, alarms];

  const pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["rgba(93, 101, 69, 1)", "rgba(78, 76, 60, 1)"],
          borderColor: "rgba(45, 45, 50, 1)",
          borderWidth: 1,
          categoryPercentage: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
        title: {
          display: true,
          text: `${percentage} %`,
          color: "white",
          padding: {
            top: 10,
            bottom: 0,
          },
          font: {
            size: 25,
          },
        },
      },
    },
  });
}
  
  export {
    generateBarChart,
    generatePieChart,
    generatePercentagePieChart
  }