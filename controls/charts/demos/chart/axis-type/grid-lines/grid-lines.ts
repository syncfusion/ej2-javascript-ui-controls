
/**
 * axis spec
 */
export let xyData = [{ x: 'United states of America', y: 100 }, { x: 'United Kingtom', y: 30 },
{ x: 'People Republic of China', y: 15 }, { x: 'Principality of Liechtenstein', y: 65 },
{ x: 'Democratic Republic of Congo', y: 10 }, { x: 'Bosnia and Herzegovina', y: 85 }];

import { Chart, Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine} from '../../../../src/chart/index';
import { Axis, IAxisLabelRenderEventArgs } from '../../../../src/chart/index';
Chart.Inject(Category, Logarithmic, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine);

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'horizontalAxis',
        majorGridLines: { width: 3, color: 'red', dashArray: '5,1', },
        majorTickLines: { height: 5, color:  'brown', },
        minorTicksPerInterval: 3,
        minorGridLines: { width: 1, color: 'violet', dashArray: '10,5', },
        minorTickLines: { height: 10, color:  'red', },
        desiredIntervals: 10,
        labelStyle: { size: '20', fontStyle: 'bold', fontWeight: '500', color: 'yellow'},
        lineStyle: { width: 2, dashArray: '4,3', color: 'red'},
        maximumLabels: 3,
        titleStyle: { size: '30', fontFamily: 'verdana', fontStyle:'bold', fontWeight: 'lighter', color: 'black'},
    },
    primaryYAxis: {
        title: 'verticalAxis1',
        majorGridLines: { width: 3, color: 'black', dashArray: '20,5', },
        majorTickLines: { height: 5, color:  'blue', },
        minorTicksPerInterval: 2,
        minorGridLines: { width: 1, color: 'green', dashArray: '10,5', },
        minorTickLines: { height: 10, color:  'pink', },
        desiredIntervals: 8,
        labelStyle: { size: '15', fontStyle: 'italic', fontWeight: '400', color: 'green'},
        lineStyle: { width: 3, dashArray: '10,5', color: 'blue'},
        titleStyle: { size: '25', fontFamily: 'verdana', fontStyle:'bold', fontWeight: 'lighter', color: 'blue'},
        maximumLabels: 2
    },
    height: '750',
    title: 'grid lines, ticklines, label style, linestyle customization',
    axisLabelRender: (args: IAxisLabelRenderEventArgs) => {
        if (args.axis.orientation === 'Horizontal') {
            args.axis.labelFormat = '${value}';
        }
    }
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