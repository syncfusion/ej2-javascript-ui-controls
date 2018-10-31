/**
 * Funnel Series
 */
import { AccumulationChart,  AccumulationDataLabel, FunnelSeries, PieSeries,
         PyramidSeries, AccumulationAnnotation, AccumulationLegend } from '../../../src/accumulation-chart/index';
import { IAccTextRenderEventArgs, IAccPointRenderEventArgs } from '../../../src/accumulation-chart/index';
AccumulationChart.Inject(AccumulationDataLabel, FunnelSeries, PieSeries, PyramidSeries);
AccumulationChart.Inject(AccumulationLegend, AccumulationAnnotation);

let data: object[] = [{ x: 'English', y: 48.20, text: '18.20%' },
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
        dataLabel: { name: 'text', visible: true, position: 'Outside',
        connectorStyle: { type: 'Curve', color: 'black', width: 2, dashArray: '2,1', length: '5' }  },
    }],

    //text render events checking
    textRender: (args: IAccTextRenderEventArgs) => {
        args.text = args.point.x + ' : ' + args.text;
        if (args.point.index === 2) {
            args.cancel = true;
        }
        if (args.point.index === 1) {
            args.border.color = 'red'; args.border.width = 2;
        }
        args.series.border = { width: 1, color: 'violet'};

        if (args.point.index === 1) {
            args.color = 'yellow';
        }
        if (args.point.index === 7 ) {
            args.text = 'Physics means Universe';
        }
    },
    annotations: [{ region: 'Series', x: 0, y: 0, content: '<div>Pie Chart</div>' }],
    border: { color: 'red', width: 2}, background: 'pink', tooltip: { enable: true },
    title: 'Pie series checking with textRender',
});
chart.appendTo('#container1');

let doughnut: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
        dataLabel: { name: 'text', visible: true, position: 'Inside', }, explode: true,
        innerRadius: '40%', border: { color: 'green', width: 2 }, explodeIndex: 3, explodeOffset: '10', groupTo: '60',
    }],
   
    annotations: [{ region: 'Series', x: 50, y: 128.7, content: '<div>groupTo Property less than 60</div>' , coordinateUnits: 'Pixel'}],
    legendSettings: { position: 'Top', background: 'red', opacity: 0.5},
    title: 'Doughnut checking series border && explodeIndex as 3 and offset as 10',
});
doughnut.appendTo('#container2');

let semiPie: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
        startAngle: 270, endAngle: 90,
        dataLabel: { name: 'text', visible: true, position: 'Inside' }, explode: true,
    }],
    legendSettings: { position: 'Top', height: '50', width: '300', alignment: 'Far'},
    enableSmartLabels: true,
    tooltip: { enable: true },
    title: 'Semi Pie with legend position as Top',
});
semiPie.appendTo('#container3');

let semiDoughnut: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false},
        startAngle: 270, endAngle: 90, innerRadius: '50%',
        dataLabel: { name: 'text', visible: true, position: 'Outside',
        connectorStyle: { type: 'Line', color: 'brown', width: 3, dashArray: '2,1', length: '8' } },
    }],
    enableSmartLabels: true,
    legendSettings: { position: 'Bottom', shapePadding: 10, shapeHeight: 20, shapeWidth: 20, border: { color: 'AACCDD', width: 2}},
    tooltip: { enable: true },
    title: 'Semi doughnut with legend position bottom datalabel outside',
});
semiDoughnut.appendTo('#container4');

let pyramid: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pyramid', dataSource: data, xName: 'x', yName: 'y',
        gapRatio: 0.1,
        dataLabel: { name: 'text', visible: true, position: 'Outside', fill: 'black',
        font: { fontFamily: 'Times New Roman', fontStyle: 'bold', fontWeight: '500', color: 'skyblue'},
        connectorStyle: { type: 'Curve', color: 'brown', width: 3, dashArray: '2,1', length: '8' } }, explode: true,
    }],
    enableSmartLabels: true,
    legendSettings: { position: 'Left', border: { color: 'black', width: 2}},
    tooltip: { enable: true },
    title: 'Left legend Linear Pyramid with gap ration as 0.1',
});
pyramid.appendTo('#container5');

let pyramidSurface: AccumulationChart = new AccumulationChart({
    series: [{
        type: 'Pyramid', dataSource: data, xName: 'x', yName: 'y',
        gapRatio: 0.1, pyramidMode: 'Surface', explode: true,
        dataLabel: { name: 'text', visible: true, position: 'Inside', fill: 'orange',
        font: { fontFamily: 'Times New Roman', fontStyle: 'bold', fontWeight: '500', color: 'black'} }, legendShape: 'Pentagon'
    }],
    enableSmartLabels: true, 
    selectedDataIndexes: [{ series: 0, point: 4}],
    legendSettings: { position: 'Custom', location: { x: 34, y: 50 }, shapePadding: 10,
    shapeHeight: 20, shapeWidth: 20, border: { color: 'AACCDD', width: 2}},
    tooltip: { enable: true },
    title: 'Custom legend Surface Pyramid',
});
pyramidSurface.appendTo('#container6');