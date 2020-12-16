import { getDataForAllCategories } from "./utils.js";
var gridMapSvg;
var mapData;

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  gridMapSvg = d3.select("#gridmap");

  // Load both files before doing anything else
  Promise.all([d3.json("data/gridmap-layout-stHimark.json")]).then(function (
    values
  ) {
    mapData = values[0];
  });
});

function getDateDiff(date1, date2) {
  var timeStamp1 = Date.parse(date1, "YYYY-MM-DD HH:mm:ss");
  var timeStamp2 = Date.parse(date2, "YYYY-MM-DD HH:mm:ss");
  var difference = timeStamp2 - timeStamp1;
  return difference / 6;
}

export function plotGridMap(startInterval, endInterval) {
  var dateDiff = getDateDiff(startInterval, endInterval);
  var timeStamp1 = Date.parse(startInterval, "YYYY-MM-DD HH:mm:ss");

  var gridSvg = gridMapSvg.attr("width", 600).attr("height", 600);
  let damageArray = [
    "power",
    "buildings",
    "medical",
    "shake_intensity",
    "sewer_and_water",
    "roads_and_bridges",
  ];
  gridSvg.selectAll("*").remove();
  var sEnter = gridSvg
    .append("g")
    .selectAll("g")
    .data(mapData)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + d.x * 150 + "," + d.y * 150 + ")";
    });

  var lineGraph = d3.select("#gridmap").append("svg");
  var colorScale = d3.scaleLinear().domain([0, 10]).range(["white", "maroon"]);

  let changedTimestamps = [];
  let index = 0;
  for (let i = 0; i < 6; i++) {
    changedTimestamps[index] = moment(timeStamp1 + dateDiff * i).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    changedTimestamps[index + 1] = moment(
      timeStamp1 + dateDiff * (i + 1)
    ).format("YYYY-MM-DD HH:mm:ss");
    index = index + 1;
  }

  //create a tooltip
  var divTooltip = d3
    .select("#gridtooltip")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("background", "white")
    .style("color", "black")
    .style("padding", "8px")
    .style("border", "1px solid #313639")
    .style("border-radius", "4px")
    .style("opacity", 0);

  let data0 = [];
  Promise.all([
    getDataForAllCategories(changedTimestamps[0], changedTimestamps[1]),
    getDataForAllCategories(changedTimestamps[1], changedTimestamps[2]),
    getDataForAllCategories(changedTimestamps[2], changedTimestamps[3]),
    getDataForAllCategories(changedTimestamps[3], changedTimestamps[4]),
    getDataForAllCategories(changedTimestamps[4], changedTimestamps[5]),
    getDataForAllCategories(changedTimestamps[5], changedTimestamps[6]),
  ]).then(function (values) {
    for (let i = 0; i < values.length; i++) {
      let data = values[i];
      data0[i] = data[1];
      for (var k = 0; k < mapData.length; k++) {
        for (var j = 0; j < 6; j++) {
          lineGraph
            .append("svg:rect")
            .attr("width", 25)
            .attr("height", 25)
            .attr("transform", function (d) {
              return (
                "translate(" +
                (150 * mapData[k].x + i * 25) +
                "," +
                (mapData[k].y * 150 + (j + 4) * 25) +
                ")"
              );
            })
            .style("fill", (d) => {
              let damage = damageArray[j];
              let strk = (k + 1).toString();
              if (data[strk]) {
                if (data[strk][damage] == null) {
                  return colorScale(0);
                }
                return colorScale(data[strk][damage]);
              } else {
                return colorScale(0);
              }
            })
            .style("stroke", "black")
            .style("stroke-width", 0.5);
        }
      }
    }

    let subrect = d3.select("#gridmap").append("svg");
    subrect
      .append("rect")
      .attr("x", 120)
      .attr("y", 700)
      .attr("id", "rectlegend")
      .attr("stroke-width", 5)
      .attr("width", 150)
      .attr("height", 150)
      .style("stroke", "black")
      .style("fill", function (d) {
        return "white";
      });

    for (let b = 0; b < 6; b++) {
      for (let u = 0; u < 6; u++) {
        subrect
          .append("svg:rect")
          .attr("width", 25)
          .attr("height", 25)
          .attr("x", 120 + b * 25)
          .attr("y", 700 + u * 25)
          .style("fill", function (d) {
            let damage = damageArray[u];
            return colorScale(data0[b][damage]);
          })
          .style("stroke", "black")
          .style("stroke-width", 0.5)
          .on("mouseover", function () {
            divTooltip
              .html("Neighborhood : Palace Hills")
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 20 + "px")
              .style("opacity", 1);
          })
          .on("mouseout", function (d, i) {
            divTooltip.style("opacity", 0);
          });
        subrect
          .append("text")
          .style("font-size", "13px")
          .attr("x", 115)
          .attr("y", 717 + u * 25)
          .text(damageArray[u])
          .attr("text-anchor", "end");
      }
      subrect
        .append("text")
        .attr("transform", "rotate(90 " + (115 + b * 25) + " " + 555 + ")")
        .style("font-size", "13px")
        .attr("font-weight", 600)
        .style("text-anchor", "start")
        .attr("x", 115 + b * 25)
        .attr("y", 555)
        .text(changedTimestamps[b]);
    }
    for (let f = 0; f < 7; f++) {
      legendSvg
        .append("text")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .attr("x", f * 24 + 4)
        .attr("y", 35)
        .text(function (d) {
          return Math.round(f * 1.66);
        });
    }
    subrect
      .append("text")
      .attr("transform", "rotate(90 " + (115 + 6 * 25) + " " + 555 + ")")
      .style("font-size", "13px")
      .attr("font-weight", 600)
      .style("text-anchor", "start")
      .attr("x", 115 + 6 * 25)
      .attr("y", 555)
      .text(changedTimestamps[6]);

    subrect
      .append("text")
      .style("font-size", "18px")
      .attr("font-weight", 600)
      .style("text-anchor", "middle")
      .attr("x", 200)
      .attr("y", 870)
      .text("Palace Hills");
    for (let i = 0; i < mapData.length; i++) {
      gridSvg
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 4)
        .attr("x1", 150 * mapData[i].x + 150)
        .attr("y1", 150 * mapData[i].y + 100)
        .attr("x2", 150 * mapData[i].x + 150)
        .attr("y2", 150 * mapData[i].y + 250);
    }

    for (let w = 0; w < mapData.length; w++) {
      gridSvg
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 4)
        .attr("x1", 150 * mapData[w].x)
        .attr("y1", 150 * mapData[w].y + 250)
        .attr("x2", 150 * mapData[w].x + 150)
        .attr("y2", 150 * mapData[w].y + 250);
    }
    sEnter
      .append("rect")
      .attr("width", 150)
      .attr("height", 150)
      .attr("vector-effect", "non-scaling-stroke")
      .style("stroke", "black")
      .style("stroke-width", 6)
      .style("fill", function (d) {
        return "white";
      })
      .attr("transform", "translate(0,100)");
  });

  let legendSvg = d3
    .select("#gridmap")
    .append("svg")
    .attr("x", 120)
    .attr("y", 900);
  for (let i = 0; i < 6; i++) {
    legendSvg
      .append("rect")
      .attr("width", 25)
      .attr("height", 25)
      .attr("transform", function () {
        return "translate(" + i * 25 + "," + 0 + ")";
      })
      .style("fill", colorScale(i * 1.66))
      .style("stroke", "black")
      .style("stroke-width", 0.5);
  }

  let currentCity = "";
  gridSvg
    .select("svg")
    .on("mouseover", function () {
      let x = d3.event.pageX;
      let y = d3.event.pageY - 1300;
      for (let h = 0; h < mapData.length; h++) {
        let mapx = mapData[h].x * 150;
        let mapy = mapData[h].y * 150;
        if (x > mapx && y > mapy && x < mapx + 150 && y < mapy + 150) {
          currentCity = mapData[h].enName;
        }
      }
      divTooltip
        .html("Neighborhood : " + currentCity)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 20 + "px")
        .style("opacity", 1);
    })
    .on("mouseout", function (d, i) {
      divTooltip.style("opacity", 0);
    });
}
