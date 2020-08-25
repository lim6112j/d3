// import * as d3 from 'd3';
// import { median, min } from 'd3';
import url from './gold.csv';
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv(url, function(data) {
    // console.log(data)
    // console.log(data[0].High)
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  data = data.reverse();
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Date.split(",")[0];})
    .rollup(function(d) {
        // console.log(d)
    //   q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
    //   median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
    //   q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
    //   interQuantileRange = q3 - q1
    //   min = q1 - 1.5 * interQuantileRange
    //   max = q3 + 1.5 * interQuantileRange
    //   return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})


        // return data.map(function(d){
            const high = d[0].High.split(",").join("");
            const low = d[0].Low.split(",").join("");
            const open = d[0].Open.split(",").join("");
            const close = d[0].Price.split(",").join("");
            const top = open > close ? open : close;
            const bottom = open < close ? open : close;
            console.log("high :", high, " top: ", top );
            return {high, low, open, close, top, bottom}
        // });
    })
    .entries(data)

  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(sumstat.map(d => d.key))
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([1800, 2100])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))
  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    //   .attr("aaa", function(d) {
    //       console.log(d.value.low);
    //   })
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return y(d.value.low)})
      .attr("y2", function(d){return y(d.value.high)})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 10
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.top))})
        .attr("height", function(d){return(y(d.value.bottom)-y(d.value.top))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", d => d.value.open == d.value.top ? "#b90a0a" : "#16aa2e")

  // Show the median
//   svg
//     .selectAll("medianLines")
//     .data(sumstat)
//     .enter()
//     .append("line")
//       .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
//       .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
//       .attr("y1", function(d){return(y(d.value.median))})
//       .attr("y2", function(d){return(y(d.value.median))})
//       .attr("stroke", "black")
//       .style("width", 80)
})