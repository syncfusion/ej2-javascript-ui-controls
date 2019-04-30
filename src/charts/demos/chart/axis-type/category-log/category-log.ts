/**
 * axis spec 
 */

export let xyData1 = [{ x: 'India', y: 2000 }, { x: 'Peru', y: 30 },
{ x: 'England', y: 15 }, { x: 'America', y: 65 },
{ x: 'Chile', y: 10 }, { x: 'Ghana', y: 850 }];

export let xyData2 = [{ x: 'Mumbai', y: 100 }, { x: 'London', y: 30 },
{ x: 'Sydney', y: 15 }, { x: 'Berlin', y: 65 },
{ x: 'Lisbon', y: 10 }, { x: 'Tokyo', y: 85 }];

import { Chart, Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine } from '../../../../src/chart/index';
import { Axis } from '../../../../src/chart/index';
Chart.Inject(Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine);

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', title: 'horizontalAxis1', majorGridLines: { width: 0 },
        titleStyle: { fontFamily: 'Book Antiqua', color: 'green', fontWeight: 'bold', fontStyle: 'italic' },
        stripLines: [
            {
                start: 5, end: 6, visible: true, text: 'Category', color: 'green', opacity: 0.2,
                horizontalAlignment: 'Start', verticalAlignment: 'Start'
            },
            {
                startFromAxis: true, size: 3, visible: true, text: 'strips', opacity: 0.4,
                horizontalAlignment: 'Start', verticalAlignment: 'Middle'
            }
        ]
    },
    primaryYAxis: {
        valueType: 'Logarithmic', title: 'verticalAxis1', majorGridLines: { width: 0 },
        titleStyle: { fontFamily: 'Times New Roman', color: 'blue', fontWeight: 'bolder', fontStyle: 'oblique' },
        stripLines: [
            {
                startFromAxis: true, end: 100, visible: true, text: 'Category', color: 'black', opacity: 0.3,
                horizontalAlignment: 'Start', verticalAlignment: 'End'
            },
            {
                start: 200, end: 500, visible: true, text: 'strips', opacity: 0.5, color: 'violet',
                horizontalAlignment: 'Middle', verticalAlignment: 'Start'
            },
        ]
    },
    rows: [
        { height: '50%', border: { color: 'red', width: 2 } },
        { height: '50%', border: { color: 'green', width: 2 } }
    ],
    columns: [
        { width: '50%', border: { color: 'blue', width: 1 } },
        { width: '50%', border: { color: 'black', width: 1 } }
    ],
    axes: [
        {
            columnIndex: 1, name: 'horizontalAxis2', title: 'horizontalAxis2', valueType: 'Category', labelPlacement: 'OnTicks',
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
            rowIndex: 1, name: 'verticalAxis3', title: 'verticalAxis3', valueType: 'Logarithmic', logBase: 3, minimum: 9,
            plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 1, name: 'horizontalAxis4', title: 'horizontalAxis4', opposedPosition: true,
            valueType: 'Category', labelPlacement: 'OnTicks', plotOffset: 10, majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 1, name: 'verticalAxis4', title: 'verticalAxis4', opposedPosition: true,
            valueType: 'Logarithmic', logBase: 12, plotOffset: 10, majorGridLines: { width: 0 },
        },
    ],
    series: [
        { dataSource: xyData1, xName: 'x', yName: 'y', animation: { enable: false } },
        { dataSource: xyData2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StepLine' },
        {
            dataSource: xyData1, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis2',
            type: 'Column', animation: { enable: false }
        },
        {
            dataSource: xyData1, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis3', yAxisName: 'verticalAxis3',
            type: 'Area', animation: { enable: false }
        },
        {
            dataSource: xyData1, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis4', yAxisName: 'verticalAxis4',
            type: 'Bubble', animation: { enable: false }
        },
    ],
    height: '800',
    title: 'checking category-log axis',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart.appendTo('#container');

let inversed: any = document.getElementById('inversed');
inversed.onclick = () => {
    chart.title = 'category-log axis with axis inversed';
    chart.primaryXAxis.isInversed = inversed.checked;
    chart.primaryYAxis.isInversed = inversed.checked;
    for (let axis of chart.axes) {
            axis.isInversed = inversed.checked;
    }
    chart.refresh();
};

let indexed: any = document.getElementById('indexed');
indexed.onclick = () => {
    chart.title = 'category-log indexed category axis';
    chart.primaryXAxis.isIndexed = indexed.checked;
    chart.refresh();
};

let minimum: any = document.getElementById('minimum');
minimum.onclick = () => {
    if (minimum.checked) {
        chart.title = 'log axis min for verticalAxis1=10,v.Axis2=3, v.Axis3=64,v.Axis4=144';
        chart.primaryYAxis.minimum = 10;
        chart.axes[1].minimum = 3;
        chart.axes[3].minimum = 64;
        chart.axes[5].minimum = 144;
    } else {
        chart.primaryYAxis.interval = null; chart.primaryYAxis.maximum = null; chart.primaryYAxis.minimum = null;
        chart.axes[1].interval = null; chart.axes[1].maximum = null; chart.axes[1].minimum = null;
        chart.axes[3].interval = null; chart.axes[3].maximum = null; chart.axes[3].minimum = null;
        chart.axes[5].interval = null; chart.axes[5].maximum = null; chart.axes[5].minimum = null;
    }
    chart.refresh();
};

let maximum: any = document.getElementById('maximum');
maximum.onclick = () => {
    if (maximum.checked) {
        chart.title = 'log axis max for verticalAxis1=10000,v.Axis2=1728, v.Axis3=5000,v.Axis4=4000';
        chart.primaryYAxis.maximum = 10000;
        chart.axes[1].maximum = 1728;
        chart.axes[3].maximum = 5000;
        chart.axes[5].maximum = 4000;
        chart.primaryYAxis.minimum = null;
        chart.axes[1].minimum = null;
        chart.axes[3].minimum = null;
        chart.axes[5].minimum = null;
    } else {
        chart.primaryYAxis.interval = null; chart.primaryYAxis.maximum = null; chart.primaryYAxis.minimum = null;
        chart.axes[1].interval = null; chart.axes[1].maximum = null; chart.axes[1].minimum = null;
        chart.axes[3].interval = null; chart.axes[3].maximum = null; chart.axes[3].minimum = null;
        chart.axes[5].interval = null; chart.axes[5].maximum = null; chart.axes[5].minimum = null;
    }
    chart.refresh();
};

let interval: any = document.getElementById('interval');
interval.onclick = () => {
    if (interval.checked) {
        chart.title = 'log axis range for verticalAxis1=1,v.Axis2=2, v.Axis3=3,v.Axis4=1';
        chart.primaryYAxis.interval = 1;
        chart.axes[1].interval = 2;
        chart.axes[3].interval = 3;
        chart.axes[5].interval = 1;
        chart.primaryYAxis.maximum = null;
        chart.axes[1].maximum = null;
        chart.axes[3].maximum = null;
        chart.axes[5].maximum = null;
        chart.primaryYAxis.minimum = null;
        chart.axes[1].minimum = null;
        chart.axes[3].minimum = null;
        chart.axes[5].minimum = null;
    } else {
        chart.primaryYAxis.interval = null; chart.primaryYAxis.maximum = null; chart.primaryYAxis.minimum = null;
        chart.axes[1].interval = null; chart.axes[1].maximum = null; chart.axes[1].minimum = null;
        chart.axes[3].interval = null; chart.axes[3].maximum = null; chart.axes[3].minimum = null;
        chart.axes[5].interval = null; chart.axes[5].maximum = null; chart.axes[5].minimum = null;
    }
    chart.refresh();
};

let range: any = document.getElementById('range');
range.onclick = () => {
    chart.title = 'log axis range for verticalAxis1={10,10000,2},v.Axis2={8,2000,4}, v.Axis3={4,3000,3},v.Axis4={12,20000,1}';
    chart.primaryYAxis.interval = 2;
    chart.axes[1].interval = 4;
    chart.axes[3].interval = 3;
    chart.axes[5].interval = 1;
    chart.primaryYAxis.maximum = 10000;
    chart.axes[1].maximum = 2000;
    chart.axes[3].maximum = 3000;
    chart.axes[5].maximum = 20000;
    chart.primaryYAxis.minimum = 10;
    chart.axes[1].minimum = 8;
    chart.axes[3].minimum = 4;
    chart.axes[5].minimum = 12;
    chart.refresh();
};
