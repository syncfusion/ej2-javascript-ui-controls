/**
 * axis spec 
 */

export let xyData1 = [{ x: 'India', y: 2000 }, { x: 'Peru', y: 30 },
{ x: 'England', y: 15 }, { x: 'America', y: 65 },
{ x: 'Chile', y: 10 }, { x: 'Ghana', y: 850 }];

export let xyData2 = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
    { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
    { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }];

export let hiloData = [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
    { x: 7, y: 8 }, { x: 8, y: 6 }];
export let hilo2 = [ { x: 'Jan', open: 120, high: 160, low: 100, close: 140 },
    { x: 'Feb', open: 150, high: 190, low: 130, close: 170 },
    { x: 'Mar', open: 130, high: 170, low: 110, close: 150 },
    { x: 'Apr', open: 160, high: 180, low: 120, close: 140 },
    { x: 'May', open: 150, high: 170, low: 110, close: 130 }];

import { Chart, Category, Logarithmic, DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
         CandleSeries, SplineSeries, Series, IAnnotationRenderEventArgs,
         IPointRenderEventArgs, RangeAreaSeries, DataLabel, ITextRenderEventArgs, ChartAnnotation  } from '../../../src/chart/index';
import { Axis } from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(Category, Logarithmic, LineSeries, DateTime, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
             CandleSeries, SplineSeries, RangeAreaSeries, DataLabel, ChartAnnotation );

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', majorGridLines: { width: 0 },
    },
    primaryYAxis: {
        valueType: 'Logarithmic',
         majorGridLines: { width: 0 }
    },
    annotations: [
            {
            content: '<div id="point1" style="font-size:18px;font-weight:bold;color:gray;fill:gray;"><span>America-65</span></div>',
            x: 'America', y: '65', coordinateUnits: 'Point', region: 'Series'
           },
        ],
    series: [
        { dataSource: xyData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column', fill:'#0450C2' },
    ],
    title: 'chart Annotation Coordinateunit Point',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart.appendTo('#container1');
let chart2: Chart = new Chart({
    primaryXAxis: {
        valueType: 'DateTime',  majorGridLines: { width: 0 },
    },
    primaryYAxis: {
        majorGridLines: { width: 0 }
   },
    annotations: [
        {
            content: '<div id="point1" style="font-size:18px;font-weight:bold;color:blue;fill:blue;"><span>Annotation pixel</span></div>',
            x: '120', y: '50', coordinateUnits: 'Pixel'
        },
        ],
    series: [
        { dataSource: xyData2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column', fill:'#EE7715' },
    ],
    title: 'chart Annotation Coordinateunit Pixel',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart2.appendTo('#container2');
let chart3: Chart = new Chart({
    primaryXAxis: {
        majorGridLines: { width: 0 },
    },
    primaryYAxis: {
         majorGridLines: { width: 0 }
    },
    annotations: [
            {
                content: '<div style="border: 1px solid black; padidng: 5px 5px 5px 5px, backgrund:#f5f5f5">Highest Medal Count</div>',
                x: 210,
                y: 110,
                verticalAlignment: 'Top',
                horizontalAlignment: 'Near'
           },
        ],
    series: [
        { dataSource: hiloData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column', fill:'#3D3D3D' },
    ],
    title: 'chart Annotation Region Alignment',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart3.appendTo('#container3');
let chart4: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', majorGridLines: { width: 0 },
    },
    primaryYAxis: {
        valueType: 'Logarithmic',
         majorGridLines: { width: 0 }
    },
    annotations: [
            {
            content: '<div style="border: 1px solid black;background-color:#f5f5f5;fill:blue; padding: 5px 5px 5px 5px">Region Chart</span></div>',
            x: 'America', y: '65', coordinateUnits: 'Point', region: 'Chart'
           },
        ],
    series: [
        { dataSource: xyData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column', fill:'#0450C2' },
    ],
    title: 'chart Annotation Coordinateunit Chart',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart4.appendTo('#container4');