import { getGlobalDimension, getClickedCity } from "./map.js";

var scatterPlotSvg;
var x;
var svg;
var y;
var radiusScale;
var cityEvents;

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  scatterPlotSvg = d3.select("#scatterplot");

  //xScale
  x = d3.scaleLinear().range([0, 850]);

  //yScale
  y = d3.scaleLinear().range([height, 0]);
 
  //radiusScale
  radiusScale = d3.scaleSqrt();
  var lx = getClickedCity();

  Promise.all([d3.json("data/StHimartEvents.json")]).then((jsonData) => {
    cityEvents = jsonData[0];
  });

  fetch("http://localhost:5000/reportcountanddamage/" + lx).then((response) => {
    response.json().then(function (data) {
      var cP_x = getGlobalDimension();

      var colorScheme;
      var cScheme;
      switch (cP_x) {
        case "power":
          colorScheme = d3.schemeReds[3];
          cScheme = "#de2d26";
          break;
        case "buildings":
          colorScheme = d3.schemeBlues[3];
          cScheme = "#3182bd";
          break;
        case "medical":
          colorScheme = d3.schemeGreens[3];
          cScheme = "#31a354";
          break;
        case "shake_intensity":
          colorScheme = d3.schemePurples[3];
          cScheme = "#756bb1";
          break;
        case "sewer_and_water":
          colorScheme = d3.schemeOranges[3];
          cScheme = "#e6550d";
          break;
        case "roads_and_bridges":
          colorScheme = d3.schemePuRd[3];
          cScheme = "#dd1c77";
          break;
        default:
          colorScheme = d3.schemeReds[3];
          cScheme = "#de2d26";
          break;
      }
      var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
      svg = scatterPlotSvg.attr("width", 1000).attr("height", 1000);

      x.domain(
        d3.extent(data, function (d) {
          let val = new Date(d.time);
          return val;
        })
      );

      y.domain([0, 10]);
      

      svg
        .append("g")
        .attr("class", "y_axis")
        .attr("transform", "translate(100,150)")
        .call(d3.axisLeft(y));

      radiusScale
        .domain(
          d3.extent(data, function (d) {
            return d.count;
          })
        )
        .range([10, 20]);
      // var colorScale = d3.scaleOrdinal(colorScheme).domain([10, 10]);

      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Add dots
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("transform", "translate(100,150)")
        .attr("cx", function (d) {
          return x(d.time);
        })
        .attr("cy", function (d) {
          return y(d[cP_x]);
        })
        .attr("r", (d) => {
          let val = d[cP_x];
          if (val == null) {
            return 0;
          } else {
            return radiusScale(d.count);
          }
        })
        .style("fill", cScheme)
        .style("opacity", 0.8)
        .style("cursor", "pointer")
        .on("mouseover", function (d, i) {
          tooltip
            .style("class", ".tooltip")
            .text(function () {
              return "Count: " + d.count;
            })
            .style("opacity", 1)
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 10 + "px");
        })
        .on("mousemove", function (d, i) {})
        .on("mouseout", function (d, i) {
          tooltip.style("opacity", 0);
        });
    });
  });
});

// ** Update data section (Called from the onclick)
export function updateData(loc) {
  fetch("http://localhost:5000/reportcountanddamage/" + loc).then(
    (response) => {
      response.json().then(function (data) {
        var l_x = "time";
        var cP_x = getGlobalDimension();

        var colorScheme;
        var cScheme;
        switch (cP_x) {
          case "power":
            colorScheme = d3.schemeReds[3];
            cScheme = "#de2d26";
            break;
          case "buildings":
            colorScheme = d3.schemeBlues[3];
            cScheme = "#3182bd";
            break;
          case "medical":
            colorScheme = d3.schemeGreens[3];
            cScheme = "#31a354";
            break;
          case "shake_intensity":
            colorScheme = d3.schemePurples[3];
            cScheme = "#756bb1";
            break;
          case "sewer_and_water":
            colorScheme = d3.schemeOranges[3];
            cScheme = "#e6550d";
            break;
          case "roads_and_bridges":
            colorScheme = d3.schemePuRd[3];
            cScheme = "#dd1c77";
            break;
          default:
            colorScheme = d3.schemeReds[3];
            cScheme = "#de2d26";
            break;
        }

        svg.selectAll("g").remove();
        svg.selectAll("text").remove();

        svg = scatterPlotSvg.attr("width", 1000).attr("height", 1000);

        x.domain(
          d3.extent(data, function (d) {
            return d[l_x];
          })
        );
        y.domain([0, 10]);

        svg
          .append("g")
          .attr("class", "x_axis")
          .attr("transform", "translate(100," + (height + 150) + ")")
          .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d-%Y %H:%M")));

        svg
          .append("g")
          .attr("class", "y_axis")
          .attr("transform", "translate(100,150)")
          .call(d3.axisLeft(y));

        radiusScale
          .domain(
            d3.extent(data, function (d) {
              return d.count;
            })
          )
          .range([10, 20]);

        var cP_x = getGlobalDimension();

        let selectedCityEvents = cityEvents.filter(
          (cityEvent) => cityEvent.Id == +getClickedCity()
        )[0];
        svg
          .append("text")
          .attr("x", 60)
          .attr("y", 40)
          .attr("dy", "1em")
          .style("font-size", "1.1em")
          .text(`Neighbourhood: `);
          
          svg.append("text")
    
    .attr("transform",
      "translate(" + (width +150) + " ," +
      (1.2 * height + margin.top + 100) + ")")
    .style("text-anchor", "middle")
    .text("Time");

          svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 40)
          .attr("x", 0 - (height ))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Damage Ratings")
          ;
        svg
          .append("text")
          .attr("x", 190)
          .attr("y", 40)
          .attr("dy", "1em")
          .style("font-size", "1.1em")
          .style("font-weight", 600)
          .text(`${selectedCityEvents.Nbrhood}`);
        if (selectedCityEvents.Events) {
          svg
            .append("text")
            .attr("x", 400)
            .attr("y", 40)
            .attr("dy", "1em")
            .style("font-size", "1em")
            .style("font-weight", 500)
            .text(`Events: `);

          svg
            .append("text")
            .attr("x", 460)
            .attr("y", 40)
            .attr("dy", "1em")
            .style("font-size", "1em")
            .text(`${selectedCityEvents.Events}`);
        }
        if (selectedCityEvents.Constructions) {
          svg
            .append("text")
            .attr("x", 400)
            .attr("y", 80)
            .attr("dy", "1em")
            .style("font-size", "1em")
            .style("font-weight", 500)
            .text(`Constructions: `);

          svg
            .append("text")
            .attr("x", 508)
            .attr("y", 80)
            .attr("dy", "1em")
            .style("font-size", "1em")
            .text(`${selectedCityEvents.Constructions}`);
        }

        var tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        // Add dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("transform", "translate(100,150)")
          .attr("cx", function (d) {
            return x(d[l_x]);
          })
          .attr("cy", function (d) {
            return y(d[cP_x]);
          })
          .attr("r", (d) => {
            let val = d[cP_x];
            if (val == null) {
              return 0;
            } else {
              return radiusScale(d.count);
            }
          })
          .style("fill", cScheme)
          .style("opacity", 0.8)
          .on("mouseover", function (d, i) {
            tooltip
              .style("class", ".tooltip")
              .text(function () {
                return "Count: " + d.count;
              })
              .style("opacity", 1)
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 10 + "px");
          })
          .on("mousemove", function (d, i) {})
          .on("mouseout", function (d, i) {
            tooltip.style("opacity", 0);
          });
      });
    }
  );
}

export function plotfrommap(globalDimension) {
  var l = getClickedCity();

  fetch("http://localhost:5000/reportcountanddamage/" + l).then((response) => {
    response.json().then(function (data) {
      var l_x = "time";
      var cP_x = globalDimension;

      var colorScheme;
      var cScheme;
      switch (cP_x) {
        case "power":
          colorScheme = d3.schemeReds[3];
          cScheme = "#de2d26";
          break;
        case "buildings":
          colorScheme = d3.schemeBlues[3];
          cScheme = "#3182bd";
          break;
        case "medical":
          colorScheme = d3.schemeGreens[3];
          cScheme = "#31a354";
          break;
        case "shake_intensity":
          colorScheme = d3.schemePurples[3];
          cScheme = "#756bb1";
          break;
        case "sewer_and_water":
          colorScheme = d3.schemeOranges[3];
          cScheme = "#e6550d";
          break;
        case "roads_and_bridges":
          colorScheme = d3.schemePuRd[3];
          cScheme = "#dd1c77";
          break;
        default:
          colorScheme = d3.schemeReds[3];
          cScheme = "#de2d26";
          break;
      }

      svg.selectAll("g").remove();
      svg.selectAll("text").remove();

      svg = scatterPlotSvg.attr("width", 1000).attr("height", 1000);

      x.domain(
        d3.extent(data, function (d) {
          return d[l_x];
        })
      );
      y.domain([0, 10]);

      svg
        .append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(100," + (height + 150) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d-%Y %H:%M")));

      svg
        .append("g")
        .attr("class", "y_axis")
        .attr("transform", "translate(100,150)")
        .call(d3.axisLeft(y));

      radiusScale
        .domain(
          d3.extent(data, function (d) {
            return d.count;
          })
        )
        .range([10, 20]);
      var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
      // Add dots
      svg
        .append("g")

        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("transform", "translate(100,150)")
        .attr("cx", function (d) {
          return x(d[l_x]);
        })
        .attr("cy", function (d) {
          return y(d[cP_x]);
        })
        .attr("r", (d) => {
          let val = d[cP_x];
          if (val == null) {
            return 0;
          } else {
            return radiusScale(d.count);
          }
        })
        .style("fill", cScheme)
        .style("opacity", 0.8)
        .on("mouseover", function (d, i) {
          tooltip
            .style("class", ".tooltip")
            .text(function () {
              return "Count: " + d.count;
            })
            .style("opacity", 1)
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 10 + "px");
        })
        .on("mousemove", function (d, i) {})
        .on("mouseout", function (d, i) {
          tooltip.style("opacity", 0);
        });
    });
  });
}
