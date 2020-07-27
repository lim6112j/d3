import * as d3 from 'd3';

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// create dummy data
var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]
// compute data summary
const data_sorted = data.sort(d3.ascending);
const q1 = d3.quantile(data, 0.25);
const median = d3.quantile(data, 0.5);
const q3 = d3.quantile(data, 0.75);
const interQuantileRange = q3 - q1;
const min = q1 - 1.5 * interQuantileRange;
const max = q1 + 1.5 * interQuantileRange;

const y = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);
svg.call(d3.axisLeft(y));

// features of a box
const center = 200;
const box_width = 100;

// show the main vertical line
svg.append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min))
    .attr("y2", y(max))
    .attr("stroke", "black")
// Show the box
svg
.append("rect")
  .attr("x", center - box_width/2)
  .attr("y", y(q3) )
  .attr("height", (y(q1)-y(q3)) )
  .attr("width", box_width )
  .attr("stroke", "black")
  .style("fill", "#69b3a2");

// show median, min and max horizontal lines
svg
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")
  .attr("x1", center-box_width/2)
  .attr("x2", center+box_width/2)
  .attr("y1", function(d){ return(y(d))} )
  .attr("y2", function(d){ return(y(d))} )
  .attr("stroke", "black")