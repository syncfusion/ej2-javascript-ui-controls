/**
 * Scatter series
 */
import {
    Chart, LineSeries, BubbleSeries, ScatterSeries, DataLabel, DateTime, Tooltip, Crosshair, Legend, Selection, SplineSeries, WaterfallSeries, Category,
    IPointRenderEventArgs, StepLineSeries, AreaSeries, Zoom, SeriesModel
} from '../../../../src/chart/index';
import { MouseEvents } from '../../../../spec/chart/base/events.spec';
import { Series, Points } from '../../../../src/chart/series/chart-series';
import { LegendPosition, LabelPosition, LegendShape, SelectionMode } from '../../../../src/chart/utils/enum';
Chart.Inject(LineSeries, BubbleSeries, ScatterSeries, DataLabel, DateTime, Tooltip, Crosshair, Legend, Selection, SplineSeries, WaterfallSeries, Category, StepLineSeries, AreaSeries, Zoom);

let series1: Object[] = [];
let series2: Object[] = [];
let point1: Object;
let value: number = 80;
let value1: number = 70;
let i: number;
for (i = 1; i < 120; i++) {
    if (Math.random() > 0.5) {
        value += Math.random();
    } else {
        value -= Math.random();
    }
    value = value < 60 ? 60 : value > 90 ? 90 : value;
    point1 = { x: 120 + (i / 2), y: value.toFixed(1) };
    series1.push(point1);
}
for (i = 1; i < 120; i++) {
    if (Math.random() > 0.5) {
        value1 += Math.random();
    } else {
        value1 -= Math.random();
    }
    value1 = value1 < 60 ? 60 : value1 > 90 ? 90 : value1;
    point1 = { x: 120 + (i / 2), y: value1.toFixed(1) };
    series2.push(point1);
}
export let data: any[] = [
    { x: 1000, y: 2, size: 5000 }, { x: 2000, y: 89, size: 6000, }, { x: 3000, y: 3, size: -30000 }, { x: 4000, y: 15, size: 14000 },
    { x: 5000, y: 16, size: -30000 }, { x: 6000, y: 10, size: 13000 },
    { x: 7000, y: -60, size: 18000 }, { x: 8000, y: 90, size: 12000 }, { x: 9000, y: 23, size: 10000 }, { x: 10000, y: 41, size: 15000 }
];
export let dataText: any[] = [
    { x: 1000, y: 2, size: 5000 }, { x: 2000, y: 89, size: 6000, text: 'Australia is the greatest country' },
    { x: 3000, y: 3, size: -30000 }, { x: 4000, y: 15, size: 14000 },
    { x: 5000, y: 16, size: -30000, text: 'America is the greatest country' }, { x: 6000, y: 10, size: 13000 },
    { x: 7000, y: -60, size: 18000 }, { x: 8000, y: 21, size: 12000, text: 'Somalia is the greatest country' },
    { x: 9000, y: 22, size: 10000, text: 'Japan is the greatest country' }, { x: 10000, y: 41, size: 15000 }
];
export let data2: any[] = [
    { x: 80, y: 12, size: 50 }, { x: 81, y: 8, size: 6 }, { x: 82, y: 30, size: -3 }, { x: 83, y: 60, size: 14 },
    { x: 84, y: 25, size: -3 }, { x: 85, y: 34, size: 13 },
    { x: 86, y: -6, size: 18 }, { x: 87, y: 51, size: 12 }, { x: 88, y: 49, size: 1 }, { x: 89, y: 42, size: 15 }
];

export let Datedata: any[] = [
    { x: new Date(0, 0, 2000), y: 2, size: 5000 }, { x: new Date(0, 0, 2001), y: 89, size: 6000 },
    { x: new Date(0, 0, 2002), y: 3, size: -30000 }, { x: new Date(0, 0, 2003), y: 0, size: 14000 },
    { x: new Date(0, 0, 2004), y: 16, size: -30000 }, { x: new Date(0, 0, 2005), y: 0, size: 13000 },
    { x: new Date(0, 0, 2006), y: -60, size: 18000 }, { x: new Date(0, 0, 2007), y: 21, size: 12000 },
    { x: new Date(0, 0, 2008), y: 23, size: 10000 }, { x: new Date(0, 0, 2009), y: 41, size: 15000 }
];

export let categorySize: any[] = [
    { x: 'USA', y: 70, size: 0.01 }, { x: 'China', y: 60, size: 0.1 },
    { x: 'Japan', y: 60, size: 0.08 }, { x: 'Australia', y: 56, size: 0.15 },
    { x: 'France1', y: 45, size: 0.121 }, { x: 'Germany1', y: 30, size: -0.01 },
    { x: 'Italy', y: 35, size: 0.2 }, { x: 'Sweden', y: 25, size: 0.3 }];

export let logData: any[] = [
    { x: 1000, y: 2, size: 5000, }, { x: 2000, y: 89, size: 6000 }, { x: 3000, y: 3, size: 30000 }, { x: 4000, y: 0, size: 14000 },
    { x: 4100, y: 10, size: 14000 }, { x: 5000, y: 16, size: 30000 }, { x: 6000, y: 0, size: 13000 }, { x: 7000, y: 60, size: 18000 },
    { x: 8000, y: 21, size: 12000 }, { x: 9000, y: 23, size: 10000 }, { x: 10000, y: 41, size: 15000 }
];
let trigger: MouseEvents = new MouseEvents();
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Height (cm)',
        edgeLabelPlacement: 'Shift',
        labelFormat: '{value}cm'
    },
    primaryYAxis:
        {
            title: 'Weight (kg)',
            labelFormat: '{value}kg',
            rangePadding: 'None'
        },
    series: [
        {
            //Series type as scatter
            type: 'Scatter',
            dataSource: series1, xName: 'x', yName: 'y',
            name: 'Male', opacity: 0.7, animation: { enable: false },
            marker: {
                dataLabel: { visible: true, position: 'Auto' }
            },
        },
        {
            type: 'Scatter',
            dataSource: series2, xName: 'x', yName: 'y',
            name: 'Female', opacity: 0.7, animation: { enable: false },
            marker: {
                dataLabel: { visible: true, position: 'Auto' }
            },
        },
        {
            type: 'Bubble',
            dataSource: data2, xName: 'x', yName: 'y', size: 'size',
            minRadius: null, maxRadius: null,
            name: 'Female', opacity: 0.7, animation: { enable: false },
            marker: {
                dataLabel: { visible: true, position: 'Auto' }
            },
        }
    ],
    zoomSettings: {
        enableMouseWheelZooming: true,
        enablePinchZooming: true, enableSelectionZooming: true, mode: 'X'
    },
    selectionMode: 'None',
    crosshair: { enable: false },
    tooltip: { enable: false, shared: false },
    legendSettings: { visible: true },
    title: 'Height Vs Weight'
}, '#container');
document.getElementById('seriesTypes').onchange = () => {
    let type: any = document.getElementById('seriesTypes');
    chart.series[0].type = type.value;
    chart.series[1].type = type.value;
    chart.series[2].type = type.value;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('dataLabel').onchange = () => {
    let type: any = document.getElementById('dataLabel');
    chart.series[0].marker.dataLabel.visible = true;
    chart.series[0].marker.dataLabel.position = type.value;
    chart.series[1].marker.dataLabel.visible = true;
    chart.series[1].marker.dataLabel.position = type.value;
    chart.series[2].marker.dataLabel.visible = true;
    chart.series[2].marker.dataLabel.position = type.value;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('marker').onchange = () => {
    let element: any = document.getElementById('marker');
    chart.series[0].marker.visible = element.checked;
    chart.series[0].animation.enable = false;
    chart.series[1].marker.visible = element.checked;
    chart.series[1].animation.enable = false;
    chart.series[2].marker.visible = element.checked;
    chart.series[2].animation.enable = false;
    chart.legendSettings.visible = false;
    chart.refresh();
};
document.getElementById('maxradi').onchange = () => {
    let element: any = document.getElementById('maxradi');
    chart.series[2].maxRadius = element.value;
    chart.series[2].maxRadius = element.value;
    chart.legendSettings.visible = false;
    chart.refresh();
}
document.getElementById('minradi').onchange = () => {
    let element: any = document.getElementById('minradi');
    chart.series[2].minRadius = element.value;
    chart.series[2].maxRadius = element.value;
    chart.legendSettings.visible = false;
    chart.refresh();
}

document.getElementById('multipleSeries').onchange = () => {
    let element: any = document.getElementById('multipleSeries');
    if (element.checked) {
        chart.addSeries([{
            dataSource: series2, xName: 'x', yName: 'y', name: 'England', type: 'Line'
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
    chart.series[1].marker.visible = element.checked;
    chart.series[1].animation.enable = true;
    chart.series[2].marker.visible = element.checked;
    chart.series[2].animation.enable = true;
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

    chart.tooltip.header = chart.series[1].name;
    chart.tooltip.enable = element.checked;
    chart.series[1].marker.visible = element.checked;
    chart.series[1].animation.enable = true;
    chart.tooltip.header = chart.series[2].name;
    chart.tooltip.enable = element.checked;
    chart.series[2].marker.visible = element.checked;
    chart.series[2].animation.enable = true;
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
    
    chart.series[1].marker.visible = element.checked;
    chart.series[1].animation.enable = true;
    chart.series[2].marker.visible = element.checked;
    chart.series[2].animation.enable = true;
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
    chart.series[1].marker.visible = element.checked;
    chart.series[1].animation.enable = true;
    chart.series[2].marker.visible = element.checked;
    chart.series[2].animation.enable = true;
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
    chart.series[1].fill = 'red';
    chart.series[1].animation.enable = false; chart.series[2].fill = 'yellow';
    chart.series[2].animation.enable = false;
    chart.refresh();
};
document.getElementById('selection').onchange = () => {
    let element: any = document.getElementById('selection');
    if (element.checked) {
        chart.selectionMode = 'Point';
    }
    chart.series[0].marker.visible = element.checked;

    chart.series[1].marker.visible = element.checked;
    chart.series[2].marker.visible = element.checked;
    
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
    trigger.clickEvent(target);
    chart.series[0].animation.enable = false;
    chart.legendSettings.visible = false;
};
document.getElementById('negativeValues').onchange = () => {
    let element: any = document.getElementById('negativeValues');
    if (element.checked) {
        chart.series[0].dataSource = data;
        chart.primaryXAxis.valueType = 'Double';
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
