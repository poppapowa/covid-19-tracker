import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";
//https://disease.sh/v3/covid-19/historical/all?lastdays=120

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
}

// generates line graph data
const buildChartData = (data, casesType="cases") => {
  // if-else needed because of different data formats
  if (casesType === "vaccinations") {
    const chartData = [];
    let lastDataPoint;
    for (let date in data) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[date] - lastDataPoint
        }
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[date];
    }
    return chartData;
  } else {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint
        }
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  }
};

// LineGraph component
function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  // get appropriate data depending on which info box is selected
  useEffect(() => {
    if (casesType === "vaccinations") {
      const fetchData = async () => {
        await fetch("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=60")
          .then((response) => response.json())
          .then((data) => {
            const chartData = buildChartData(data, casesType);
            setData(chartData);
          });
      }
      fetchData();      
    } else {
      const fetchData = async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const chartData = buildChartData(data, casesType);
            setData(chartData);
          });
      }
      fetchData();
    }
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options = {options}
          data={{
            datasets: [{
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: data,
            }]
          }}
        /> 
      )}
      
    </div>
  )
}

export default LineGraph
