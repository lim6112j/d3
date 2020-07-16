import * as d3 from 'd3';
// import { csv } from 'd3-request';
import url from './cities.csv';

d3.csv(url, d => console.log(d));