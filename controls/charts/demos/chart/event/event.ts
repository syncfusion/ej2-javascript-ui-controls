/**
 * axis spec 
 */

export let xyData1 = [{ x: 'India', y: 2000 }, { x: 'Peru', y: 30 },
{ x: 'England', y: 15 }, { x: 'America', y: 65 },
{ x: 'Chile', y: 10 }, { x: 'Ghana', y: 850 }];

export let xyData2 = [{ x: 'Mumbai', y: 100 }, { x: 'London', y: 30 },
{ x: 'Sydney', y: 15 }, { x: 'Berlin', y: 65 },
{ x: 'Lisbon', y: 10 }, { x: 'Tokyo', y: 85 }];

export let hiloData = [
                { x: '1965', low: 18.98, high: 29.16 }, { x: '1966', low: 19.31, high: 29.41 },
                { x: '1967', low: 19.08, high: 29.14 }, { x: '1968', low: 18.83, high: 29.07 },
                { x: '1969', low: 19.32, high: 29.61 }, { x: '1970', low: 19.16, high: 29.47 },
                { x: '1971', low: 18.77, high: 29.15 }, { x: '1972', low: 18.91, high: 29.31 },
            ];
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

let pointRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 4) {
        if (args.point.index === 2) {
            args.fill = 'red';
            args.border.color = 'green';
            args.border.width = 2;
        }
    }
    if ((<Series>(args.series)).index === 1) {
        if (args.point.index === 2) {
            args.fill = 'blue';
            args.border.color = 'green';
            args.border.width = 2;
        }
    }
};
let textRender: EmitType<ITextRenderEventArgs> = (args: ITextRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 3) {
        if (args.point.index === 3) {
            args.text = 'Low Level Data';
            args.color = 'yellow';
            args.border.color = 'black';
            args.border.width = 1.5;
        }
    };
};
let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', title: 'horizontalAxis1', majorGridLines: { width: 0 },
        titleStyle: { fontFamily: 'Book Antiqua', color: 'green', fontWeight: 'bold', fontStyle: 'italic' },
    },
    primaryYAxis: {
         majorGridLines: { width: 0 }
    },
     rows: [
        { height: '50%', border: { color: 'red', width: 2 } },
        { height: '50%', border: { color: 'green', width: 2 } }
    ],
    columns: [
        { width: '50%', border: { color: 'blue', width: 1 } },
        { width: '50%', border: { color: 'black', width: 1 } }
    ],
    pointRender: pointRender,
    textRender: textRender,
    annotationRender: (args: IAnnotationRenderEventArgs): void => {
     args.content.children[0].innerHTML = 'Annotaion Text 160';
         },
    annotations: [
            {
            content: '<div id="point1" style="font-size:18px;font-weight:bold;color:gray;fill:gray;"><span>Candle Feb- 190</span></div>',
            x: 'Feb', y: '110', coordinateUnits: 'Point'
           },
        ],
    axes: [
        {
            columnIndex: 1, name: 'horizontalAxis2', title: 'horizontalAxis2', valueType: 'Category',
            plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            columnIndex: 1, name: 'verticalAxis2', title: 'verticalAxis2', opposedPosition: true, valueType: 'Logarithmic',
            logBase: 2, plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, name: 'horizontalAxis3', title: 'horizontalAxis3', opposedPosition: true, valueType: 'Category',
            plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, name: 'verticalAxis3', title: 'verticalAxis3',
            plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 1, name: 'horizontalAxis4', title: 'horizontalAxis4', opposedPosition: true,
            valueType: 'Category', labelPlacement: 'OnTicks', plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 1, name: 'verticalAxis4', title: 'verticalAxis4', opposedPosition: true,
             plotOffset: 10, majorGridLines: { width: 0 },
        },
    ],
    series: [
        { dataSource: hilo2, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close', animation: { enable: false }, type: 'Candle' },
        {
            type: 'RangeArea', animation: { enable: false },
            dataSource: hiloData,
            xName: 'x', high: 'high', low: 'low', opacity: 0.5,
            fill: '#69D2E7', border: { color: 'blueviolet', width: 1 },
            marker: {
                visible: true,
                height: 10, width: 10,
                shape: 'Pentagon', border: { color: 'red', width: 2 },
            }, xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis2'
        },
        {
            dataSource: hilo2, xName: 'x', yName: 'high', xAxisName: 'horizontalAxis3', yAxisName: 'verticalAxis3',
            animation: { enable: false }, marker: {
                visible: true,
                height: 10, width: 10,
                shape: 'Circle',
                dataLabel: { visible: true, position: 'Outer' }
            }, width: 3
        },
        {
            dataSource: hilo2, xName: 'x', yName: 'low', xAxisName: 'horizontalAxis3', yAxisName: 'verticalAxis3',
            type: 'Spline', animation: { enable: false },
             marker: {
                visible: true,
                height: 10, width: 10,
                shape: 'Triangle',
                dataLabel: { visible: true, position: 'Outer' }
            }, width: 3
        },
        {
            dataSource: hiloData, xName: 'x', yName: 'high', xAxisName: 'horizontalAxis4', yAxisName: 'verticalAxis4',
            type: 'Column', animation: { enable: false }
        },
    ],
    height: '800',
    title: 'checking events',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart.appendTo('#container');