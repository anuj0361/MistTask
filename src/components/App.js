import React, { Component } from "react";
import airlineData from "../data/airline-data";
import airlines from "../data/airlines";
import Chart from "chart.js";

class App extends Component {
  constructor() {
    super();
    this.state = { value: "" };
  }

  componentDidMount() {
    this.populateData(airlineData, "All Airlines");
  }

  drawChart = (noOfAirlines, total, airline) => {
    let config = {
      type: "line",
      data: {
        labels: [
          "00:59:59",
          "01:59:59",
          "02:59:59",
          "03:59:59",
          "04:59:59",
          "05:59:59",
          "06:59:59",
          "07:59:59",
          "08:59:59",
          "09:59:59",
          "10:59:59",
          "11:59:59",
          "12:59:59",
          "13:59:59",
          "14:59:59",
          "15:59:59",
          "16:59:59",
          "17:59:59",
          "18:59:59",
          "20:59:59",
          "21:59:59",
          "22:59:59",
          "23:59:59"
        ],
        datasets: [
          {
            label: "Number of Flighs",
            data: noOfAirlines,
            borderColor: "skyblue"
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          position: "top",
          text: `${total} Filghts ${airline}`,
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 16
          }
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: "HH:mm:ss",
                unit: "hour",
                unitStepSize: 1,
                displayFormats: {
                  minute: "HH:mm:ss",
                  hour: "HH:mm:ss",
                  min: "00:00:00",
                  max: "23:59:59"
                }
              }
            }
          ]
        }
      }
    };

    let ctx = document.getElementById("myChart");
    new Chart(ctx, config);
  };

  filterData = option => {
    if (option === "All") {
      this.populateData(airlineData, "All Airlines");
    } else {
      let data = airlineData.filter(airline => {
        if (
          typeof airline === "object" &&
          airline != null &&
          airline.hasOwnProperty("airline")
        ) {
          if (airline.airline === option) return airline;
        }
      });
      this.populateData(data, option);
    }
  };

  populateData = (data, label) => {
    const noOfAirlines = new Array(24).fill(0);
    let total = 0;

    data.forEach(timeSlot => {
      if (typeof timeSlot === "object" && timeSlot != null) {
        if (
          timeSlot.hasOwnProperty("airline") &&
          timeSlot.hasOwnProperty("time")
        ) {
          let time = timeSlot.time.split(":");
          let timeStamp = +time[0];
          ++noOfAirlines[timeStamp];
        }
      }
    });

    noOfAirlines.forEach(num => {
      if (!isNaN(num)) total += num;
    });
    if (label !== "All Airlines") {
      label = airlines[label];
    }

    this.drawChart(noOfAirlines, total, label);
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  blurEvent = e => {
    let airlineVal = [];
    let airlineArray = Object.values(airlines);
    airlineArray.forEach(airline => {
      if (airline.toLowerCase().includes(this.state.value.toLowerCase())) {
        airlineVal.push(airline);
      }
    });
    let key = Object.keys(airlines).find(
      key => airlines[key] === airlineVal[0]
    );
    if (this.state.value === "" || key === undefined) this.filterData("All");
    else this.filterData(key);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") this.blurEvent();
  };

  render() {
    const chartStyle = {
      position: "relative",
      height: "40vh",
      width: "80vw"
    };

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">Airplane Flights</a>
            </div>
            <div className="form-group">
              <input
                type="text"
                value={this.state.value}
                className="form-control"
                style={{ width: "200px", float: "right", marginTop: "8px" }}
                placeholder="Search Flights"
                onChange={this.handleChange}
                onBlur={this.blurEvent}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>
        </nav>
        <div className="chart-container" style={chartStyle}>
          <canvas id="myChart" />
        </div>
      </div>
    );
  }
}

export default App;
