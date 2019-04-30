/**
 * Waterfall series
 */
import {
    Chart, LineSeries, DataLabel, DateTime, Tooltip, Crosshair, Legend, Selection, SplineSeries, WaterfallSeries, Category,
    IPointRenderEventArgs, StepLineSeries, AreaSeries, Zoom, SeriesModel
} from '../../../../src/chart/index';
import { MouseEvents } from '../../../../spec/chart/base/events.spec';
import { Series, Points } from '../../../../src/chart/series/chart-series';
import { LegendPosition, LabelPosition, LegendShape, SelectionMode } from '../../../../src/chart/utils/enum';
Chart.Inject(LineSeries, DataLabel, DateTime, Tooltip, Crosshair, Legend, Selection, SplineSeries, WaterfallSeries, Category, StepLineSeries, AreaSeries, Zoom);
let chartData: any[] = [
    { x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -427 },
    { x: 'Research', y: -588 }, { x: 'Development', y: -688 },
    { x: 'other Revenue', y: 1030 }, { x: 'Administrative', y: -780 },
    { x: 'Other expense', y: -361 }, { x: 'Income tax', y: -695 },
    { x: 'Employee Salary', y: -1030 }, { x: 'Transport', y: -500 },
    { x: 'Product Sale', y: 2000 }, { x: 'Tax', y: -300 }
];
let chartData2: object[] = [
    { x: new Date(2005, 0, 1), y: 4711 }, { x: new Date(2006, 0, 1), y: -427 },
    { x: new Date(2007, 0, 1), y: -588 }, { x: new Date(2008, 0, 1), y: -688 },
    { x: new Date(2009, 0, 1), y: 1030 }, { x: new Date(2010, 0, 1), y: -780 }, { x: new Date(2011, 0, 1), y: -361 },
    { x: new Date(2012, 0, 1), y: -695 }
];

let trigger: MouseEvents = new MouseEvents();
let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category',
        labelIntersectAction: 'Rotate45'
    },
    primaryYAxis: {
      //  minimum: 0, maximum: 5000, interval: 500,
        labelFormat: '${value}M'
    },

    series: [{
        dataSource: chartData, width: 2,
        xName: 'x', yName: 'y', intermediateSumIndexes: [5, 8], sumIndexes: [10],
        name: 'USA',
        // Series type as StepLine
        type: 'Waterfall', animation: { enable: true },
        marker: {
            dataLabel: { visible: true, position: 'Auto' }
        },

    }],
    zoomSettings: {
        enableMouseWheelZooming: true,
        enablePinchZooming: true, enableSelectionZooming: true, mode: 'X'
    },
    selectionMode:'None',
    crosshair: { enable: false },
    tooltip: { enable: false, shared: false },
    title: 'Company Revenue and Profit',
    legendSettings: { visible: true },

}, '#container');
document.getElementById('seriesTypes').onchange = () => {
    let type: any = document.getElementById('seriesTypes');
    chart.series[0].type = type.value;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('dataLabel').onchange = () => {
    let type: any = document.getElementById('dataLabel');
    chart.series[0].marker.dataLabel.visible = true;
    chart.series[0].marker.dataLabel.position = type.value;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('connColor').onchange = () => {
    let type: any = document.getElementById('connColor');
    chart.series[0].connector.color = type.value;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('connWidth').onchange = () => {
        let value: number = Number((document.getElementById('connWidth') as HTMLInputElement).value);
        chart.series[0].connector.width = value;
        chart.refresh();
};
// document.getElementById('connDashArray').onchange = () => {
//     let type: any = document.getElementById('connDashArray');
//     chart.series[0].connector.dashArray = '3';
//     chart.legendSettings.visible = false;
//     chart.refresh();
// };
document.getElementById('intermediatesumIndexes').onchange = () => {
    let type: any = document.getElementById('intermediatesumIndexes');
    chart.series[0].intermediateSumIndexes = [5];
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('sumIndex').onchange = () => {
    let type: any = document.getElementById('sumIndex');
    chart.series[0].sumIndexes = [7];
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('marker').onchange = () => {
    let element: any = document.getElementById('marker');
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = false;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('multipleSeries').onchange = () => {
    let element: any = document.getElementById('multipleSeries');
    if (element.checked) {
        chart.addSeries([{
            dataSource: chartData2, xName: 'x', yName: 'y', name: 'England', type: 'Line'
        }]);
    }
    let type: any = document.getElementById('dataLabel');
    chart.series[1].marker.dataLabel.visible = true;
    chart.series[1].marker.dataLabel.position = type.value;
    chart.series[1].marker.visible = element.checked;
    chart.series[0].width = 5;
    chart.series[0].dashArray = '5';
    chart.legendSettings.visible = false;
    chart.series[1].animation.enable = false;
    chart.refresh();
};
document.getElementById('toolTip').onchange = () => {
    let element: any = document.getElementById('toolTip');
    chart.tooltip.enable = element.checked;
    chart.tooltip.header = '';
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = true;
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
    let series: Series = <Series>chart.series[0];
    let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
    let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
    let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
    trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

};
document.getElementById('tipPosition').onchange = () => {
    let type: any = document.getElementById('tipPosition');
    let element: any = document.getElementById('toolTip');
    chart.tooltip.header = chart.series[0].name;
    chart.tooltip.enable = element.checked;
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = true;
    chart.refresh();
    if (type.value === 'Top') {
        let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
        let series: Series = <Series>chart.series[0];
        let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
        let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
        let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
        trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    } else if (type.value === 'Left') {
        let target: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
        let series: Series = <Series>chart.series[0];
        let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
        let y: number = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
        let x: number = series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
        trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    } else if (type.value === 'Right') {
        let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
        let series: Series = <Series>chart.series[0];
        let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
        let y: number = series.points[6].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
        let x: number = series.points[6].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
        trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    } else {
        let target: HTMLElement = document.getElementById('container_Series_0_Point_4_Symbol');
        let series: Series = <Series>chart.series[0];
        let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
        let y: number = series.points[4].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
        let x: number = series.points[4].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
        trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    }
    chart.legendSettings.visible = false;
};
document.getElementById('trackBall').onchange = () => {
    let element: any = document.getElementById('trackBall');
    chart.tooltip.enable = element.checked;
    chart.tooltip.shared = element.checked;
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = true;
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_4_Symbol');
    let series: Series = <Series>chart.series[0];
    let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
    let y: number = series.points[4].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
    let x: number = series.points[4].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
    trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    chart.series[0].animation.enable = true;
    chart.legendSettings.visible = false;
};
document.getElementById('crossHair').onchange = () => {
    let element: any = document.getElementById('crossHair');
    chart.tooltip.enable = element.checked;
    chart.tooltip.shared = element.checked;
    chart.crosshair.enable = element.checked;
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = false;
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
    let series: Series = <Series>chart.series[0];
    let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
    let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
    let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
    trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
    chart.series[0].animation.enable = false;
    chart.legendSettings.visible = false;
};
document.getElementById('vertical').onchange = () => {
    let element: any = document.getElementById('vertical');
    chart.isTransposed = element.checked;
    chart.legendSettings.visible = false;
    chart.series[0].fill = 'blue';
    chart.series[0].animation.enable = false;
    chart.refresh();
};
document.getElementById('selection').onchange = () => {
    let element: any = document.getElementById('selection');
    if (element.checked) {
        chart.selectionMode = 'Point';
    }
    chart.series[0].marker.visible = element.checked;
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
    trigger.clickEvent(target);
    chart.series[0].animation.enable = false;
    chart.legendSettings.visible = false;
};
document.getElementById('negativeValues').onchange = () => {
    let element: any = document.getElementById('negativeValues');
    if (element.checked) {
        chart.series[0].dataSource = chartData2;
        chart.primaryXAxis.valueType = 'DateTime';        
    }
    chart.series[0].animation.enable = false;
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
    let series: Series = <Series>chart.series[0];
    let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
    let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop - 2;
    let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft + 5;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('pointRender').onchange = () => {
    let element: any = document.getElementById('pointRender');
    chart.series[0].marker.height = 10;
    chart.series[0].marker.width = 10;
    if (element.checked) {
        chart.pointRender = (args: IPointRenderEventArgs) => {
            if (args.point.index === 2) {
                args.fill = 'red';
                args.border.width = 3;
                args.border.color = 'blue';
            }

        };
    }
    chart.series[0].animation.enable = false;
    chart.legendSettings.visible = false;
    chart.refresh();
};
