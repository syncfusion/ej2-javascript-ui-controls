/**
 * Funnel Series
 */
import {
    AccumulationChart, AccumulationDataLabel, FunnelSeries, PieSeries,
    PyramidSeries, AccumulationAnnotation, AccumulationLegend
} from '../../../src/accumulation-chart/index';
import { IAccTextRenderEventArgs, IAccPointRenderEventArgs, IAccSeriesRenderEventArgs } from '../../../src/accumulation-chart/index';
import { IAnnotationRenderEventArgs } from '../../../src/common/model/interface';
    AccumulationChart.Inject(AccumulationDataLabel, FunnelSeries, PieSeries, PyramidSeries);
    AccumulationChart.Inject(AccumulationLegend, AccumulationAnnotation);

    let data: object[] = [{ x: 'English', y: 48.20, text: '18.20%' },  { x: 'Sanskrit', y: 27.3, text: '27.3%' },
    { x: 'French', y: 27.3, text: '27.3%' },{ x: 'Tamil', y: 55.9, text: '55.9%' }, { x: 'Maths', y: 76.8, text: '76.8%' },
    { x: 'Chemistry', y: 86.8, text: '76.8%' },{ x: 'Biology', y: 96.8, text: '76.8%' }, { x: 'Physics', y: 100, text: '100%' }];
    let chart: AccumulationChart = new AccumulationChart({
        series: [{
            type: 'Funnel', dataSource: data, xName: 'x', yName: 'y',
            dataLabel: { name: 'text', visible: true, position: 'Outside',
                connectorStyle: { type: 'Curve', color: 'black', width: 2, dashArray: '2,1', length: '5' }
            }}],

        //text render events checking
        pointRender: (args: IAccPointRenderEventArgs) => {
            if (args.point.index === 2) {
                args.border = { color: 'red', width: 2 }
            }
            if (args.point.index === 1) {
                args.fill = 'blue';
            }
            args.series.explodeIndex = 2;
            if (args.point.index === 0) {
                args.cancel = true;
            }
        },
        annotationRender: (args: IAnnotationRenderEventArgs) => { args.location.x = 100;},
        annotations: [{ region: 'Series', x: 0, y: 180, content: '<div>1.index2-border<br>2.index1-blue color<br>3.index0-cancel</div>' }],
        border: { color: 'red', width: 2 }, title: 'Default Funnel series checking with pointRender',
    });
    chart.appendTo('#container1');

    let funnelGap: AccumulationChart = new AccumulationChart({
        series: [{ type: 'Funnel', dataSource: data, xName: 'x', yName: 'y',neckHeight: '50%', neckWidth: '20%',
            dataLabel: { name: 'text', visible: true, position: 'Inside', }, explode: true}],
        annotations: [{ region: 'Series', x: 50, y: 128.7, content: '<div></div>', coordinateUnits: 'Pixel' }],
        annotationRender: (args: IAnnotationRenderEventArgs) => {args.cancel = true;},
        legendSettings: { position: 'Top', background: 'red', opacity: 0.5 }, title: 'Funnel series with neck width and height',
    });
    funnelGap.appendTo('#container2');

    let semiPie: AccumulationChart = new AccumulationChart({
        series: [{
            type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },startAngle: 270, endAngle: 90,
            dataLabel: { name: 'text', visible: true, position: 'Inside' }}],
        seriesRender: (args: IAccSeriesRenderEventArgs) => { 
        args.data = [{ x: 'English', y: 48.20, text: '18.20%' },{ x: 'Sanskrit', y: 27.3, text: '27.3%' }]; },
        legendSettings: { position: 'Top', height: '50', width: '300', alignment: 'Far' },  enableSmartLabels: true, 
        title: 'Acc Chart with series render and smart labels enabled true',
    });
    semiPie.appendTo('#container3');

    let semiDoughnut: AccumulationChart = new AccumulationChart({
        series: [{
            type: 'Pie', dataSource: [{ x: 'America', y: null }, { x: 'England', y: 14 }, { x: 'Germany', y: 12 }], xName: 'x', yName: 'y',
            innerRadius: '50%', emptyPointSettings: { mode: 'Drop' }, animation: { enable: false },
            dataLabel: {name: 'text', visible: true, position: 'Outside',
                connectorStyle: { type: 'Line', color: 'brown', width: 3, dashArray: '2,1', length: '8' }},
        }],
        legendSettings: { position: 'Bottom', shapePadding: 10, shapeHeight: 20, shapeWidth: 20, border: { color: 'AACCDD', width: 2 } },
        title: 'Semi Empty point',enableSmartLabels: true,
    });
    semiDoughnut.appendTo('#container4');

    let pyramid: AccumulationChart = new AccumulationChart({
        series: [{
            type: 'Pie', dataSource: [{ x: 'America', y: null }, { x: 'England', y: 14 }, { x: 'Germany', y: 12 }], xName: 'x', yName: 'y', animation: { enable: false },
            dataLabel: {
                name: 'text', visible: true, position: 'Outside', fill: 'black',
                font: { fontFamily: 'Times New Roman', fontStyle: 'bold', fontWeight: '500', color: 'skyblue' },
                connectorStyle: { type: 'Curve', color: 'brown', width: 3, dashArray: '2,1', length: '8' }
            }, explode: true, emptyPointSettings: { mode: 'Average', fill: 'red' }
        }],
        legendSettings: { position: 'Left', shapePadding: 10, shapeHeight: 20, shapeWidth: 20, border: { color: 'black', width: 2 } },
        title: 'Empty Point as average', enableSmartLabels: true,
    });
    pyramid.appendTo('#container5');

    let pyramidSurface: AccumulationChart = new AccumulationChart({
        series: [{
            type: 'Pyramid', dataSource: [{ x: 'America', y: null }, { x: 'England', y: 14 }, { x: 'Germany', y: 12 }], xName: 'x', yName: 'y',
            gapRatio: 0.1, pyramidMode: 'Surface', explode: true,
            dataLabel: {
                name: 'text', visible: true, position: 'Inside', fill: 'orange',
                font: { fontFamily: 'Times New Roman', fontStyle: 'bold', fontWeight: '500', color: 'black' }
            }, legendShape: 'Pentagon', emptyPointSettings: { mode: 'Zero', fill: 'pink' }
        }],
        enableSmartLabels: true, selectedDataIndexes: [{ series: 0, point: 4 }],
        legendSettings: {
            position: 'Custom', location: { x: 34, y: 50 }, shapePadding: 10,
            shapeHeight: 20, shapeWidth: 20, border: { color: 'AACCDD', width: 2 }
        }, title: 'Custom legend Surface Pyramid',
    });
    pyramidSurface.appendTo('#container6');