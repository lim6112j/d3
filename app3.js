import url from './yahoo.csv';
import * as d3 from 'd3';
import * as fc from 'd3fc';
const loadDataEndOfDay = d3.csv(url, d => ({
  date: new Date(d.Timestamp * 1000),
  volume: Number(d.volume),
  high: Number(d.high),
  low: Number(d.low),
  open: Number(d.open),
  close: Number(d.close)
}));
loadDataEndOfDay.then(data => {

  const xExtent = fc.extentDate()
    .accessors([d => d.date]);
  const yExtent = fc.extentLinear()
    .pad([0.1, 0.1])
    .accessors([d => d.high, d => d.low]);

  const lineSeries = fc
    .seriesSvgLine()
    .mainValue(d => d.high)
    .crossValue(d => d.date);
  const areaSeries = fc
    .seriesSvgArea()
    .baseValue(d => yExtent(data)[0])
    .mainValue(d => d.high)
    .crossValue(d => d.date);
  const gridlines = fc
    .annotationSvgGridline()
    .yTicks(5)
    .xTicks(0);
  // average
  const ma = fc
    .indicatorMovingAverage()
    .value(d => d.high)
    .period(15);

  const maData = ma(data);
  data = data.map((d, i) => ({ ma: maData[i], ...d }));
  const movingAverageSeries = fc
  .seriesSvgLine()
  .mainValue(d => d.ma)
  .crossValue(d => d.date)
  .decorate(sel =>
    sel.enter()
      .classed("ma", true)
  );
  // volumn
  const volumeExtent = fc
    .extentLinear()
    .include([0])
    .pad([0, 2])
    .accessors([d => d.volume]);
  const volumeDomain = volumeExtent(data);
  const volumeToPriceScale = d3
  .scaleLinear()
  .domain(volumeDomain)
  .range(yExtent(data));
  const volumeSeries = fc
  .seriesSvgBar()
  .bandwidth(2)
  .crossValue(d => d.date)
  .mainValue(d => volumeToPriceScale(d.volume))
  .decorate(sel =>
    sel
      .enter()
      .classed("volume", true)
      .attr("fill", d => (d.open > d.close ? "red" : "green"))
  );
  // multi view
  const multi = fc.seriesSvgMulti()
    .series([gridlines, areaSeries, lineSeries, movingAverageSeries, volumeSeries]);
  // legend
  const legend = () => {
    const labelJoin = fc.dataJoin("text", "legend-label");
    const valueJoin = fc.dataJoin("text", "legend-value");
  
    const instance = selection => {
      selection.each((data, selectionIndex, nodes) => {
        labelJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(100, " + (i + 1) * 15 + ")")
          .text(d => d.name);
  
        valueJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(160, " + (i + 1) * 15 + ")")
          .text(d => d.value);
      });
    };
  
    return instance;
  };
  const dateFormat = d3.timeFormat("%a %H:%M%p");
  const priceFormat = d3.format(",.2f");
  const legendData = datum => [
    { name: "Open", value: priceFormat(datum.open) },
    { name: "High", value: priceFormat(datum.high) },
    { name: "Low", value: priceFormat(datum.low) },
    { name: "Close", value: priceFormat(datum.close) },
    { name: "Volume", value: priceFormat(datum.volume) }
  ];
  const chartLegend = legend();
  // chart main
  const chart = fc
    .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yOrient("right")
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi)
    .decorate(sel => {
      sel
        .datum(legendData(data[data.length - 1]))
        .append("svg")
        .style("grid-column", 3)
        .style("grid-row", 3)
        .classed("legend", true)
        .call(chartLegend);
    });

  d3.select("#chart-element")
    .datum(data)
    .call(chart);
  }
);
