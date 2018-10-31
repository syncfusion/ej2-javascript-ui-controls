/**
 * area series
 */
import { Chart, SplineSeries, Category, Crosshair } from '../../../../src/chart/index';
Chart.Inject(SplineSeries, Category, Crosshair);

let chartData: any[] = [
    { x: 'Jan', y: -1 }, { x: 'Feb', y: -1 }, { x: 'Mar', y: 2 },
    { x: 'Apr', y: 8 }, { x: 'May', y: 13 }, { x: 'Jun', y: 18 },
    { x: 'Jul', y: 21 }, { x: 'Aug', y: 20 }, { x: 'Sep', y: 16 },
    { x: 'Oct', y: 10 }, { x: 'Nov', y: 4 }, { x: 'Dec', y: 0 }
];
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Month',
        valueType: 'Category',
        crosshairTooltip: { enable: false },
        labelPosition: 'Outside',
    },
    primaryYAxis: {
        minimum: -5, maximum: 35, interval: 5,
        title: 'Temperature in Celsius',
        labelFormat: '{value}C',
        crosshairTooltip: { enable: false },
        labelPosition: 'Outside'
    },
    series:[{
        dataSource: chartData, width:2,
        xName: 'x', yName: 'y',
        name: 'London',
        type: 'Spline', animation: { enable: false},
        fill:'#0450C2',
        marker: { visible: true}
    }],
    crosshair: { enable: true },
    title: 'Climate Graph-2012'
}, '#container');
let tool: HTMLInputElement = document.getElementById('tool') as HTMLInputElement;
tool.onchange = () => {
    chart.primaryXAxis.crosshairTooltip.enable = tool.checked;
    chart.primaryYAxis.crosshairTooltip.enable = tool.checked;
    chart.refresh();
};
let pos: HTMLInputElement = document.getElementById('pos') as HTMLInputElement;
pos.onchange = () => {
    chart.primaryXAxis.labelPosition = 'Inside';
    chart.primaryYAxis.labelPosition = 'Inside';
    chart.refresh();
};
let custom: HTMLInputElement = document.getElementById('custom') as HTMLInputElement;
custom.onchange = () => {
    chart.primaryXAxis.labelPosition = 'Outside';
    chart.primaryYAxis.labelPosition = 'Outside';
    chart.primaryXAxis.crosshairTooltip.fill = '#c94375';
    chart.primaryYAxis.crosshairTooltip.fill = '#c94375';
    chart.crosshair.lineType = 'Both';
    chart.crosshair.line.color = '#8776fc';
    chart. series[0].dashArray = '5,5';
    chart.series[0].fill = 'green';
    chart.series[0].width = 8;
    chart.refresh();
};
let oppo: HTMLInputElement = document.getElementById('oppo') as HTMLInputElement;
oppo.onchange = () => {
    chart.primaryXAxis.labelPosition = 'Inside';
    chart.primaryYAxis.labelPosition = 'Inside';
    chart.primaryXAxis.opposedPosition = oppo.checked;
    chart.primaryYAxis.opposedPosition = oppo.checked;
    chart.series[0].fill = '#9743c9';
    chart.primaryXAxis.crosshairTooltip.fill = '';
    chart.primaryYAxis.crosshairTooltip.fill = '';
    chart.crosshair.lineType = 'Both';
    chart.crosshair.line.color = '';
    chart. series[0].dashArray = '';
    chart.series[0].width = 2;
    chart.refresh();
};

