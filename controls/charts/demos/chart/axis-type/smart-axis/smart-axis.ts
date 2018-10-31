
/**
 * axis spec
 */
export let xyData = [{ x: 'United states of America', y: 100 }, { x: 'United Kingtom', y: 30 },
{ x: 'People Republic of China', y: 15 }, { x: 'Principality of Liechtenstein', y: 65 },
{ x: 'Democratic Republic of Congo', y: 10 }, { x: 'Bosnia and Herzegovina', y: 85 }];

import { Chart, Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine} from '../../../../src/chart/index';
import { Axis } from '../../../../src/chart/index';
Chart.Inject(Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine);

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', title: 'horizontalAxis1', majorGridLines: { width: 0},
        stripLines: [
            { start: 5, end: 6, visible: true, text: 'Category', color:'green', opacity: 0.2},
            { startFromAxis: true, size: 3, visible: true, text: 'strips', opacity: 0.4}
        ]
    },
    primaryYAxis: {
        title: 'verticalAxis1', majorGridLines: { width: 0},
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
        { columnIndex: 1, name: 'horizontalAxis2', title: 'horizontalAxis2', valueType: 'Category',
          labelPlacement: 'OnTicks', plotOffset: 10, majorGridLines: { width: 0} },
        { columnIndex: 1, name: 'verticalAxis2', title: 'verticalAxis2', opposedPosition: true, plotOffset: 10,
          majorGridLines: { width: 0} },
        { rowIndex: 1, name: 'horizontalAxis3', title: 'horizontalAxis3', opposedPosition: true, valueType: 'Category', plotOffset: 10,
          majorGridLines: { width: 0} },
        { rowIndex: 1, name: 'horizontalAxis5', title: 'horizontalAxis5', opposedPosition: true, valueType: 'Category', plotOffset: 10,
          majorGridLines: { width: 0} },
        { rowIndex: 1, name: 'verticalAxis3', title: 'verticalAxis3', minimum: 9, plotOffset: 10,
          majorGridLines: { width: 0} },
        { rowIndex: 1, columnIndex: 1, name: 'horizontalAxis4', title: 'horizontalAxis4', opposedPosition: true,
          majorGridLines: { width: 0}, valueType: 'Category', labelPlacement: 'OnTicks', plotOffset: 10 },
        { rowIndex: 1, columnIndex: 1, name: 'horizontalAxis6', title: 'horizontalAxis6', opposedPosition: true,
          majorGridLines: { width: 0}, valueType: 'Category', labelPlacement: 'OnTicks', plotOffset: 10 },
        { rowIndex: 1, columnIndex: 1, name: 'verticalAxis4', title: 'verticalAxis4', opposedPosition: true,
          majorGridLines: { width: 0}, plotOffset: 10 },
        { rowIndex: 0, span: 2, name: 'spanXAxis', title: 'spanXAxis', valueType: 'Category'},
        { rowIndex: 0, span: 2, name: 'spanYAxis', title: 'spanYAxis', maximumLabels: 10, majorGridLines: { width: 0}},
    ],
    series: [
        { dataSource: xyData, xName: 'x', yName: 'y', animation: { enable: false } },
        { dataSource: xyData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StepLine' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis2',
          type: 'Column', animation: { enable: false} },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis3', yAxisName: 'verticalAxis3',
          type: 'Area', animation: { enable: false} },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis4', yAxisName: 'verticalAxis4',
          type: 'Bubble', animation: { enable: false}},
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis5', yAxisName: 'verticalAxis3',
          type: 'Column', animation: { enable: false} },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'horizontalAxis6', yAxisName: 'verticalAxis4',
          type: 'Line', animation: { enable: false}},
        {
            dataSource: xyData, animation: { enable: false}, xAxisName: 'spanXAxis', yAxisName: 'spanYAxis',
            xName: 'x', yName: 'y'
        }
    ],
    title: 'smart axis',
    height: '800',
});
chart.appendTo('#container');

let xInversed: any = document.getElementById('xInversed');
xInversed.onclick = () => {
    chart.primaryXAxis.isInversed = xInversed.checked;
    for (let axis of chart.axes) {
        if ((<Axis>axis).orientation === 'Horizontal') {
            axis.isInversed = xInversed.checked;
        }
    }
    chart.refresh();
};

let yInversed: any = document.getElementById('yInversed');
yInversed.onclick = () => {
    chart.primaryYAxis.isInversed = yInversed.checked;
    for (let axis of chart.axes) {
        if ((<Axis>axis).orientation === 'Vertical') {
            axis.isInversed = yInversed.checked;
        }
    }
    chart.refresh();
};


let labelIntersect: any = document.getElementById('labelIntersect');
labelIntersect.onclick = () => {
    if (labelIntersect.checked) {
    chart.primaryXAxis.labelIntersectAction = 'Rotate45';
    chart.primaryXAxis.title = chart.primaryXAxis.title + '(Rotate45)';
    chart.axes[0].labelIntersectAction = 'Rotate90';
    chart.axes[0].title = chart.axes[0].title + '(Rotate90)';
    chart.axes[2].labelIntersectAction = 'Rotate45';
    chart.axes[2].labelRotation = 60;
    chart.axes[2].title = chart.axes[2].title + '(Rotation60AndRotate45)';
    chart.axes[3].labelIntersectAction = 'Trim';
    chart.axes[3].title = chart.axes[3].title + '(Trim)';
    chart.axes[5].labelIntersectAction = 'MultipleRows';
    chart.axes[5].title = chart.axes[5].title + '(MultipleRows)';
    chart.axes[6].labelIntersectAction = 'Wrap';
    chart.axes[6].title = chart.axes[6].title + '(Wrap)';
    } else {
        chart.primaryXAxis.labelIntersectAction = 'Hide';
        chart.primaryXAxis.title = chart.primaryXAxis.title.replace('(Rotate45)', '');
        chart.axes[0].title = chart.axes[0].title.replace('(Rotate90)', '');
        chart.axes[2].title = chart.axes[2].title.replace('(Rotation60AndRotate45)', '');
        chart.axes[2].labelRotation = 0;
        chart.axes[3].title = chart.axes[3].title.replace('(Trim)', '');
        chart.axes[5].title = chart.axes[5].title.replace('(MultipleRows)', '');
        chart.axes[6].title = chart.axes[6].title.replace('(Wrap)', '');
        chart.axes.forEach((axis: Axis) => {
            axis.labelIntersectAction = 'Hide';
        });
    }
    chart.title = 'labelIntersectActions for chart';
    chart.refresh();
};

let edgeLabel: any = document.getElementById('edgeLabel');
edgeLabel.onclick = () => {
    if (edgeLabel.checked) {
        chart.primaryXAxis.edgeLabelPlacement = 'Shift';
        chart.primaryXAxis.title = chart.primaryXAxis.title  + ('Shift');
        chart.primaryYAxis.edgeLabelPlacement = 'Shift';
        chart.primaryYAxis.title = chart.primaryYAxis.title  + ('Shift');
        chart.axes[0].edgeLabelPlacement = 'None';  /*Horizontal*/
        chart.axes[0].title = chart.axes[0].title + '(None)';
        chart.axes[1].edgeLabelPlacement =  'None'; //Vertical
        chart.axes[1].title = chart.axes[1].title + '(None)';
        chart.axes[2].edgeLabelPlacement = 'Hide'; //Horizontal
        chart.axes[2].title = chart.axes[2].title + '(Hide)';
        chart.axes[3].edgeLabelPlacement = 'Hide'; //Horizontal
        chart.axes[3].title = chart.axes[3].title + '(Hide)';
        chart.axes[4].edgeLabelPlacement = 'Hide'; //Vertical
        chart.axes[4].title = chart.axes[0].title + '(Hide)';
        chart.axes[5].edgeLabelPlacement = 'Shift'; //Horizontal
        chart.axes[5].title = chart.axes[5].title + '(Shift)';
        chart.axes[6].edgeLabelPlacement = 'None'; //Horizontal
        chart.axes[6].title = chart.axes[6].title + '(None)';
        chart.axes[7].edgeLabelPlacement = 'Hide'; //vertical
        chart.axes[7].title = chart.axes[7].title + '(Hide)';

    } else {
        chart.primaryXAxis.edgeLabelPlacement = 'Hide';
        chart.primaryYAxis.edgeLabelPlacement = 'Hide';
        chart.axes.forEach((axis: Axis) => {
            axis.edgeLabelPlacement = 'Hide';
        });

    }
    
    chart.refresh();
};
