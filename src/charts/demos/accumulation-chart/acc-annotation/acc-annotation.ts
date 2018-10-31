/**
 * Funnel Series
 */
import { AccumulationChart,  AccumulationDataLabel, FunnelSeries, PieSeries,
         PyramidSeries, AccumulationAnnotation, AccumulationLegend } from '../../../src/accumulation-chart/index';
AccumulationChart.Inject(AccumulationDataLabel, FunnelSeries, PieSeries, PyramidSeries);
AccumulationChart.Inject(AccumulationLegend, AccumulationAnnotation);

let data: Object[] = [{ x: 'English', y: 48.20, text: '18.20%' },
{ x: 'Sanskrit', y: 27.3, text: '27.3%' },
{ x: 'French', y: 27.3, text: '27.3%' },
{ x: 'Tamil', y: 55.9, text: '55.9%' },
{ x: 'Maths', y: 76.8, text: '76.8%' },
{ x: 'Chemistry', y: 86.8, text: '76.8%' },
{ x: 'Biology', y: 96.8, text: '76.8%' },
{ x: 'Physics', y: 100, text: '100%' }];

let chart: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
    }],
    annotations: [{content: '<div>Tamil score:55.9</div>',
        region: 'Series',
        coordinateUnits: 'Point',
        x: 'Tamil',
        y: 55.9
     }],
    legendSettings: { visible: false },
    title: 'Pie Annotation CoordinateUnits Point'
});
chart.appendTo('#container1');

let doughnut: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
        innerRadius: '40%',
    }],
    annotations: [{ region: 'Series', x: 155, y: 155, content: '<div>Annotation Pixel</div>' , coordinateUnits: 'Pixel'}],
    legendSettings: { visible: false },
    title: 'Pie Annotation CoordinateUnits pixel'
});
doughnut.appendTo('#container2');

let semiPie: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
        innerRadius: '40%',
    }],
    annotations: [{ region: 'Chart', x: 50, y: 128.7, content: '<div>Region Chart</div>'}],
    legendSettings: { visible: false },
    title: 'Pie Annotation Region Chart'
});
semiPie.appendTo('#container3');

let semiDoughnut: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
    }],
    annotations: [{ content:'<div style="border: 1px solid black;background-color:#f5f5f5;fill:blue; padding: 5px 5px 5px 5px">Maths : 76.8</div>',
        region: 'Series',
        coordinateUnits: 'Point',
        x: 'Maths',
        y: 76.8,
        verticalAlignment: 'Top',
        horizontalAlignment: 'Near' }],
    legendSettings: { visible: false },
    title: 'Pie Annotation Alignment'
});
semiDoughnut.appendTo('#container4');