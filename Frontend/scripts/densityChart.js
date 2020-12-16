import { convertDateToTimeStamp, getDataForAllCategories } from "./utils.js";
import { updateMapData } from "./map.js";
import { plotGridMap } from "./gridMap.js";

var densityChartSvg;
var brush;
var gBrush;
let brushFlag = 0;
let interval;
let brushMinExtent, brushMaxExtent;
let brushExtentDiff;
var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = 900 - margin.left - margin.right,
  height = 120 - margin.top - margin.bottom;

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  densityChartSvg = d3.select("#densitychart");
  densityChartSvg
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + (margin.left + 100) + "," + (margin.top + 300) + ")"
    );

  fetch("http://localhost:5000/reportcount").then((response) => {
    response.json().then(function (data) {
      drawDensityChart(data);
    });
  });
});

document.getElementById("playbtn").addEventListener("click", function () {
  document.getElementById("playbtn").classList.add("selected-button");
  document.getElementById("pausebtn").classList.remove("selected-button");
  playClicked();
});

document.getElementById("pausebtn").addEventListener("click", function () {
  document.getElementById("playbtn").classList.remove("selected-button");
  document.getElementById("pausebtn").classList.add("selected-button");
  pauseClicked();
});

function playClicked() {
  interval = setInterval(() => {
    if (brushMinExtent <= 1070 && brushMaxExtent <= 1070) {
      brushFlag = 1;
      gBrush.call(brush.move, [brushMinExtent + 10, brushMaxExtent + 10]);
    } else {
      brushMinExtent = 100;
      brushMaxExtent = 100 + brushExtentDiff;
      brushFlag = 1;
      gBrush.call(brush.move, [brushMinExtent, brushMaxExtent]);
    }
  }, 2000);
}

function pauseClicked() {
  clearInterval(interval);
}

// Draw the densityChart in the #densityChart svg
function drawDensityChart(data) {
  let values = data.map((val) => ({ time: val.time, log_val: val.log_value }));

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(
      d3.extent(values, function (d) {
        return d.time;
      })
    )
    .range([0, width + 150]);
  densityChartSvg
    .append("g")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d-%Y %H:%M")));

  densityChartSvg
    .append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 30)
    .attr("x", -(height + 70))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "0.9em")
    .text(`Log 11 value of`);

  densityChartSvg
    .append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 50)
    .attr("x", -(height + 70))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "0.9em")
    .text("number of reports");

  densityChartSvg
    .append("text")
    .attr("class", "xlabel")
    .attr(
      "transform",
      "translate(" +
        width / 1.35 +
        " ," +
        (1.1 * height + margin.top + 150) +
        ")"
    )
    .style("text-anchor", "middle")
    .style("font-size", "0.9em")
    .text("Time");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, function (d) {
        return +d.log_val;
      }),
    ])
    .range([height, -100]);
  densityChartSvg
    .append("g")
    .attr("transform", "translate(100,150)")
    .call(d3.axisLeft(y));

  densityChartSvg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width + 270) + " ," + (height + 20) + ")"
    )
    .style("font-size", "0.9em")
    .text("Number of Reports: Respective Y scale");

  densityChartSvg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width + 300) + " ," + (height + 50) + ")"
    )
    .style("font-size", "0.9em")
    .text("100 report count: 1.92");

  densityChartSvg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width + 300) + " ," + (height + 70) + ")"
    )
    .style("font-size", "0.9em")
    .text("1000 report count: 2.88");

  densityChartSvg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width + 300) + " ," + (height + 90) + ")"
    )
    .style("font-size", "0.9em")
    .text("3000 report count: 3.33");

  brush = d3
    .brushX()
    .extent([
      [100, 50],
      [width + 250, height + 150],
    ])
    .on("end", brushmoved);

  let lines = densityChartSvg
    .append("path")
    .attr("transform", "translate(100,150)")
    .datum(values)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.log_val);
        })
    );

  gBrush = densityChartSvg.append("g").attr("class", "brush").call(brush);

  var brushResizePath = function (d) {
    var e = +(d.type == "e"),
      x = e ? 1 : -1,
      y = height / 2;
    return (
      "M" +
      0.5 * x +
      "," +
      y +
      "A6,6 0 0 " +
      e +
      " " +
      6.5 * x +
      "," +
      (y + 6) +
      "V" +
      (2 * y - 6) +
      "A6,6 0 0 " +
      e +
      " " +
      0.5 * x +
      "," +
      2 * y +
      "Z" +
      "M" +
      2.5 * x +
      "," +
      (y + 8) +
      "V" +
      (2 * y - 8) +
      "M" +
      4.5 * x +
      "," +
      (y + 8) +
      "V" +
      (2 * y - 8)
    );
  };

  var handle = gBrush
    .selectAll(".handle--custom")
    .data([{ type: "w" }, { type: "e" }])
    .enter()
    .append("path")
    .attr("class", "handle--custom")
    .attr("stroke", "#000")
    .attr("cursor", "ew-resize")
    .attr("d", brushResizePath);

  gBrush.call(brush.move, [100, 250]);

  function brushmoved() {
    let userSelect = false;
    if (brushFlag == 0) {
      userSelect = true;
      document.getElementById("playbtn").classList.remove("selected-button");
      document.getElementById("pausebtn").classList.remove("selected-button");
      clearInterval(interval);
    }
    brushFlag = 0;

    var s = d3.event.selection;

    if (s == null) {
      handle.attr("display", "none");
      lines.classed("selected", false);
    } else {
      brushMinExtent = s[0];
      brushMaxExtent = s[1];
      brushExtentDiff = brushMaxExtent - brushMinExtent;
      var sx = s.map(x.invert);
      let date1 = new Date(sx[0]);
      let date2 = new Date(sx[1]);
      let months = [
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
      document.getElementById("selectedtime").innerHTML = `<b>${
        months[date1.getMonth()]
      } ${date1.getDate()} ${date1.getFullYear()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}</b> to <b>${
        months[date2.getMonth()]
      } ${date2.getDate()} ${date2.getFullYear()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}</b>`;
      let ts1 = convertDateToTimeStamp(date1);
      let ts2 = convertDateToTimeStamp(date2);
      if (userSelect) {
        userSelectedTime(ts1, ts2);
      }
      timeSelected(ts1, ts2);
      handle.attr("display", null).attr("transform", function (d, i) {
        return "translate(" + [s[i], -(height - 370) / 4] + ")";
      });
    }
  }
}

function timeSelected(ts1, ts2) {
  drawchart(ts1, ts2);
  updateMapData(ts1, ts2);
}

function userSelectedTime(ts1, ts2) {
  plotGridMap(ts1, ts2);
}
