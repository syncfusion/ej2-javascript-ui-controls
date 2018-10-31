/**
 * axis spec 
 */

export let hilo2 = [ { x: 'Jan', open: 120, high: 160, low: 100, close: 140 },
    { x: 'Feb', open: 150, high: 190, low: 130, close: 170 },
    { x: 'Mar', open: 130, high: 170, low: 110, close: 150 },
    { x: 'Apr', open: 160, high: 180, low: 120, close: 140 },
    { x: 'May', open: 150, high: 170, low: 110, close: 130 }];

import { Chart, Category, Logarithmic, DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
         CandleSeries, SplineSeries, Series, IAnnotationRenderEventArgs, Tooltip, ErrorBar,
         IPointRenderEventArgs, RangeAreaSeries, DataLabel, ITextRenderEventArgs, ChartAnnotation  } from '../../../src/chart/index';
import { Axis } from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { Marker } from '../../../src/smithchart/series/marker';
Chart.Inject(Category, Logarithmic, LineSeries, DateTime, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
             CandleSeries, SplineSeries, RangeAreaSeries, DataLabel, ChartAnnotation, Tooltip, ErrorBar );

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category', majorGridLines: { width: 0 },
    },
    primaryYAxis: {
         majorGridLines: { width: 0 },
         minimum: 60, maximum: 200, interval: 20,
    },
    series: [
        { dataSource: hilo2, xName: 'x', yName: 'high', animation: { enable: false }, type: 'Spline',
        marker: { visible: true, shape:'Diamond', height: 15, width: 15, fill:'#0450C2'},  fill:'#0450C2' },
        { dataSource: hilo2, xName: 'x', yName: 'low', animation: { enable: false }, type: 'Spline',
        marker: { visible: true, shape:'Diamond', height: 15, width: 15, fill:'#EE7715'}, fill:'#EE7715' },
    ],
    tooltip: {enable: true, template:'', shared: false},
    title: 'Chart With Tooltip',
    titleStyle: { color: 'red', fontStyle: 'bold', fontWeight: '400' }
});
chart.appendTo('#container');
let group: HTMLInputElement = document.getElementById('group') as HTMLInputElement;
group.onchange = () => {
    chart.tooltip.shared = group.checked;
    chart.series[0].name = "Series1";
    chart.series[1].name = "Series2";
    chart.refresh();
};
let name: HTMLInputElement = document.getElementById('name') as HTMLInputElement;
name.onchange = () => {
    chart.series[0].name = "Temperature High";
    chart.series[1].name = "Temperature Low";
    chart.refresh();
};
let header: HTMLInputElement = document.getElementById('header') as HTMLInputElement;
header.onchange = () => {
    chart.tooltip.header = "Temperature Variation";
    chart.tooltip.textStyle.color ="red";
    chart.tooltip.textStyle.fontWeight="Bold";
    chart.tooltip.textStyle.fontStyle ='Italic';
    chart.refresh();
};
let template: HTMLInputElement = document.getElementById('template') as HTMLInputElement;
template.onchange = () => {
    chart.tooltip.template = "#Female-Material";
    chart.refresh();
};
let iserror: HTMLInputElement = document.getElementById('iserror') as HTMLInputElement;
iserror.onchange = () => {
    chart.series[0].errorBar.visible = iserror.checked;
    chart.series[1].errorBar.visible = iserror.checked;
    chart.series[0].errorBar.verticalError = 5;
    chart.series[1].errorBar.verticalError = 5;
    chart.tooltip.template = '';
    chart.tooltip.textStyle.color ='';
    chart.tooltip.textStyle.fontWeight='';
    chart.tooltip.textStyle.fontStyle ='';
    chart.refresh();
};