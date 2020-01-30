/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries, ChartModel, DateTimeCategory, StackingColumnSeries
} from '../../../src/index';
Chart.Inject(Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries, DateTimeCategory, StackingColumnSeries);

let legendChartModel: ChartModel = {
 
    primaryXAxis: {  isInversed: true,  interval: 1, valueType: 'Category' },

    primaryYAxis: { title: 'Revenue in Millions', labelFormat: '{value}M', isInversed : true },

    axes: [
        { name: 'secondXAxis', title: 'secondXAxis', valueType: 'Category', opposedPosition: true },
        { name: 'secondYAxis', title: 'secondYAxis', opposedPosition: true }
    ],

    series: [
        {
            xName: 'x', width: 2, yName: 'y', name: 'Product A',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        },
        {
            xName: 'x', width: 2, yName: 'y', name: 'Product B', xAxisName: 'secondXAxis', yAxisName: 'secondYAxis',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        },
        {
            xName: 'x', width: 2, yName: 'y', name: 'Product C', xAxisName: 'secondXAxis', yAxisName: 'secondYAxis',
            dataSource: [{ x: 2000, y: 2 }, { x: 2001, y: -2.3 },  { x: 2002, y: 0 }, { x: 2003, y: 3.4 }],
        }
    ],
    tooltip: { enable: true }, title: 'LegendClick-Axis hide three series',

};
let legendChart: Chart = new Chart(legendChartModel);
legendChart.appendTo('#legendChart');

let legendChartTwoSeries: Chart = new Chart(legendChartModel);
legendChartTwoSeries.series.pop();
legendChartTwoSeries.title = 'LegendClick-Axis hide two series';
legendChartTwoSeries.appendTo('#legendChartSeries');

// document.getElementById('xAxis').addEventListener('click', (e: Event) => {
//     legendChart.primaryXAxis.visible = (e.srcElement as HTMLInputElement).checked;
//     legendChart.dataBind();
// });
// document.getElementById('yAxis').addEventListener('click', (e: Event) => {
//     legendChart.primaryYAxis.visible = (e.srcElement as HTMLInputElement).checked;
//     legendChart.dataBind();
// });

let axisHiddenChart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'DateTimeCategory',
    },
    dataSource: [
        { date: new Date(2020, 0, 22), value1: 10, value2: 10, value3: 11, value4: 8},
        { date: new Date(2020, 0, 23), value1: 12, value2: 12, value3: 24, value4: 10},
        { date: new Date(2020, 0, 24), value1: 20, value2: 15, value3: 21, value4: 21}
    ],
    axes: [
        {
            visible: false,  minimum: 0,  maximum: 100, name: 'secondAxis'
        }
    ],
    series: [
        { xName: 'date', yName: 'value1', type: 'StackingColumn', name: 'Tariff1'},
        { xName: 'date', yName: 'value2', type: 'StackingColumn', name: 'Tariff2'},
        { xName: 'date', yName: 'value3', name: 'Comparison', yAxisName: 'secondAxis'},
        { xName: 'date', yName: 'value4', name: 'Comparison2', yAxisName: 'secondAxis'}
    ]
}, '#legendDefaultAxisHidden')