import * as d3 from 'd3';
import { median, min } from 'd3';

const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data){
    console.log(data);
    //{Sepal_Length: "4.6",
    // Sepal_Width: "3.1", 
    // Petal_Length: "1.5", 
    // Petal_Width: "0.2", 
    // Species: "setosa"}
    const sumstat = d3.nest()
        .key(function(d){ return d.Species; })
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g){return g.Sepal_Length}).sort(d3.ascending), 0.25);
            median = d3.quantile(d.map(function(g) {return g.Sepal_Length}).sort(d3.ascending), 0.5);
            q3 = d3.quantile(d.map(function(g){return g.Sepal_Length}).sort(d3.ascending), 0.75);
            interQuantileRange = q3-q1;
            min = q1 - 1.5 * interQuantileRange;
            max = q1 + 1.5 * interQuantileRange;
            return {q1: q1, q3: q3, median: median, interQuantileRange: interQuantileRange, min: min, max: max};
        })
        .entries(data);
      // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["setosa", "versicolor", "virginica"])
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
});