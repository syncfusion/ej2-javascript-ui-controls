/**
 * axis spec 
 */

import { Chart, Category, Logarithmic, DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
         CandleSeries, SplineSeries, Series, IAnnotationRenderEventArgs, Tooltip, ErrorBar, Alignment,
         IPointRenderEventArgs, RangeAreaSeries, DataLabel, ITextRenderEventArgs, ChartAnnotation  } from '../../../src/chart/index';
import { Axis } from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { Marker } from '../../../src/smithchart/series/marker';
Chart.Inject(Category, Logarithmic, LineSeries, DateTime, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
             CandleSeries, SplineSeries, RangeAreaSeries, DataLabel, ChartAnnotation, Tooltip, ErrorBar );

let chart: Chart = new Chart({
    primaryXAxis: {

        interval: 1,
        valueType: 'Category',
        majorGridLines: { width: 0 }, minorGridLines: { width: 0 },
        majorTickLines: { width: 0 }, minorTickLines: { width: 0 },
        lineStyle: { width: 0 },
    },
    primaryYAxis: {
        minimum: 0,
        maximum: 100,
        interval: 20,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 }, majorGridLines: { width: 1 },
        minorGridLines: { width: 1 }, minorTickLines: { width: 0 }
    },
    chartArea: {
        border: {
            width: 0
        }
    },
    series: [
        {
            dataSource: [{ x: "Monday", y: 70 }, { x: "Tuesday", y: 60 }, { x: "Wednesday", y: 40 }, { x: "Thursday", y: 40 },
            { x: "Friday", y: 70 }, { x: "Saturday", y: 50 }, { x: "Sunday", y: 45 }],
            type: 'Column', cornerRadius:{ bottomLeft: 10, bottomRight: 10, topLeft: 10, topRight: 10 },
            xName: 'x', yName: 'y', name: 'Defect', fill: "#4304d0",animation:{
            enable: false}

        },
        {
            dataSource: [{ x: "Monday", y: 80 }, { x: "Tuesday", y: 70 }, { x: "Wednesday", y: 50 }, { x: "Thursday", y: 60 },
            { x: "Friday", y: 60 }, { x: "Saturday", y: 80 }, { x: "Sunday", y: 65 }],
            type: 'Column',  cornerRadius:{ bottomLeft: 10, bottomRight: 10, topLeft: 10, topRight: 10 },
            xName: 'x', yName: 'y', name: 'Germany', fill: "#04d095",animation:{
            enable: false}
        },

    ],
    title: 'Efficiency of oil-fired power production',
    titleStyle: {
        fontFamily: "Segoe UI",
        fontStyle: 'bold',
        color: '#d0042b',
        size: '20px',
    },
    subTitle: "( in a week )",
    subTitleStyle: {
        fontFamily: "Segoe UI",
        fontStyle: 'normal',
        size: '15px',
        color: 'green',
    },
    legendSettings: { visible: true },
    tooltip: {
        enable: true,
    },

    height: '450',
    width: '800'
});
chart.appendTo('#container');
document.getElementById('titletext').onchange = () => {
    let label: HTMLSelectElement = <HTMLSelectElement>document.getElementById('titletext');
    chart.titleStyle.textAlignment = <Alignment>label.value;
    chart.refresh();
};

document.getElementById('subtitlealign').onchange = () => {
    let label: HTMLSelectElement = <HTMLSelectElement>document.getElementById('subtitlealign');
    chart.subTitleStyle.textAlignment = <Alignment>label.value;
    chart.refresh();
};
