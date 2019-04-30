import {
    Chart, RangeColumnSeries, Category, DataLabel, Tooltip, Legend, HiloSeries, Selection, Zoom, ChartSeriesType, CandleSeries,
    Crosshair, RangeAreaSeries, Series
} from '../../../../src/chart/index';
import { LegendShape, SelectionMode, LabelPosition } from '..../../../src/chart/utils/enum';
import { HiloOpenCloseSeries } from '../../../../src/index';
import { MouseEvents } from '../../../../spec/chart/base/events.spec';
Chart.Inject(RangeColumnSeries, HiloOpenCloseSeries, Category, DataLabel, Tooltip, Legend, HiloSeries, Selection, Zoom, Crosshair, CandleSeries, RangeAreaSeries);

/**
 * RangeColumn series
 */
let trigger: MouseEvents = new MouseEvents();
let mouseEvents: MouseEvents = new MouseEvents();
let chart: Chart = new Chart({

    //Initializing Primary X Axis
    primaryXAxis: {
        valueType: 'Category',
        title: 'Months'
    },

    //Initializing Primary Y Axis
    primaryYAxis: {
        labelFormat: '{value}mm',
        edgeLabelPlacement: 'Shift',
        title: 'Rainfall',
    },
    //Initializing Chart Series
    series: [
        {
            type: 'RangeColumn', name: 'India', xName: 'x', high: 'high', low: 'low', yName: 'low', close: 'close', open: 'open',
            dataSource: [
                { x: 'Jan', low: 87, high: 200, open: 100, close: 114 }, { x: 'Feb', low: 45, high: 135, open: 55, close: 53 },
                { x: 'Mar', low: 19, high: 85, open: 50, close: 30 }, { x: 'Apr', low: 31, high: 108, open: 37, close: 59 },
                { x: 'May', low: 27, high: 80, open: 33, close: 43 }, { x: 'June', low: 84, high: 130, open: 99, close: 91 },
                { x: 'July', low: 77, high: 150, open: 84, close: 94 }, { x: 'Aug', low: 54, high: 125, open: 65, close: 77 },
                { x: 'Sep', low: 60, high: 155, open: 73, close: 67 }, { x: 'Oct', low: 60, high: 180, open: 70, close: 81 },
                { x: 'Nov', low: 88, high: 180, open: 95, close: 120 }, { x: 'Dec', low: 84, high: 230, open: 105, close: 93 }
            ],
            fill: 'red',
            animation: { enable: false },
            marker: {
                // Data label for chart series
                dataLabel: {
                    visible: false
                }
            },

        },
        {
            type: 'RangeColumn', name: 'USA', xName: 'x', high: 'high', low: 'low', yName: 'low', close: 'close', open: 'open',
            dataSource: [
                { x: 'Jan', low: 3, high: 220, open: 50, close: 15 }, { x: 'Feb', low: 18, high: 76, open: 32, close: 25 },
                { x: 'Mar', low: 50, high: 150, open: 70, close: 64 }, { x: 'Apr', low: 58, high: 130, open: 98, close: 100 },
                { x: 'May', low: 60, high: 190, open: 80, close: 135 }, { x: 'June', low: 64, high: 205, open: 78, close: 125 },
                { x: 'July', low: 50, high: 100, open: 65, close: 61 }, { x: 'Aug', low: 30, high: 76, open: 43, close: 52 },
                { x: 'Sep', low: 80, high: 170, open: 100, close: 93 }, { x: 'Oct', low: 40, high: 144, open: 80, close: 72 },
                { x: 'Nov', low: 70, high: 140, open: 88, close: 78 }, { x: 'Dec', low: 50, high: 177, open: 63, close: 76 }
            ],
            fill: 'blue',
            animation: { enable: false },
            marker: {
                // Data label for chart series
                dataLabel: {
                    visible: false
                }
            },
        }
    ],
    tooltip: {
        enable: true
    },
    title: 'Maximum and Minimum Rainfall',
    legendSettings: {
        visible: false,
    }
});
chart.appendTo('#container');
document.getElementById("SelectSeriesType").onchange = () => {
    let element: HTMLSelectElement = <HTMLSelectElement>(document.getElementById('SelectSeriesType'));
    chart.series[0].type = <ChartSeriesType>element.value;
    chart.series[1].type = <ChartSeriesType>element.value;
    chart.refresh();
};
document.getElementById("datalabel").onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('datalabel'));
    chart.series[0].marker.dataLabel.visible = element.checked;
    chart.series[1].marker.dataLabel.visible = element.checked;
    let datalabelclass: any = document.getElementById('datalabelclass');
    datalabelclass.style.display = element.checked ? '' : 'none';
    chart.refresh();
};
document.getElementById("datalabelposition").onchange = () => {
    let element: HTMLSelectElement = <HTMLSelectElement>(document.getElementById('datalabelposition'));
    chart.series[0].marker.dataLabel.position = <LabelPosition>element.value;
    chart.series[1].marker.dataLabel.position = <LabelPosition>element.value;
    chart.refresh();
};
document.getElementById("marker").onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('marker'));
    chart.series[0].marker.visible = element.checked;
    chart.series[1].marker.visible = element.checked;
    chart.refresh();
};
document.getElementById("xinversed").onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('xinversed'));
    chart.primaryXAxis.isInversed = element.checked;
    chart.refresh();
};
document.getElementById("yinversed").onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('yinversed'));
    chart.primaryYAxis.isInversed = element.checked;
    chart.refresh();
};
document.getElementById("transposed").onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('transposed'));
    chart.isTransposed = element.checked;
    chart.refresh();
};
document.getElementById('tooltip').onchange = () => {
    let element: any = document.getElementById('tooltip');
    chart.tooltip.enable = element.checked;
    chart.tooltip.header = '';
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
    let series: Series = <Series>chart.series[0];
    let x: number = chart.visibleSeries[0].points[2].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[0].points[2].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[0].points[2].regions[0].y +
        chart.visibleSeries[0].points[2].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);

};
let sharedtooltip: Element = document.getElementById('sharedtooltip');
(sharedtooltip as HTMLInputElement).onchange = () => {
    chart.tooltip.enable = true;
    chart.tooltip.shared = true;
    chart.refresh();
    let x: number = chart.visibleSeries[1].points[1].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[1].points[1].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[1].points[1].regions[0].y +
        chart.visibleSeries[1].points[1].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};
document.getElementById('crosshair').onchange = () => {
    let element: any = document.getElementById('crosshair');
    chart.tooltip.enable = element.checked;
    chart.tooltip.shared = element.checked;
    chart.crosshair.enable = element.checked;
    chart.refresh();
    let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
    let series: Series = <Series>chart.series[0];
    let x: number = chart.visibleSeries[0].points[2].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[0].points[2].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[0].points[2].regions[0].y +
        chart.visibleSeries[0].points[2].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};
document.getElementById('selection').onchange = () => {
    let element: any = document.getElementById('selection');
    if (element.checked) {
        chart.selectionMode = 'Point';
        chart.selectedDataIndexes = [{ series: 0, point: 2 }];
    } else {
        chart.selectionMode = 'None';
    }
    chart.refresh();
};
