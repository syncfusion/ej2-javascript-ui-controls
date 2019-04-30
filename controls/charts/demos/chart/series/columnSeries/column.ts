/**
 * area series
 */
import { Chart, ColumnSeries, StackingColumnSeries, Category, DataLabel, Legend } from '../../../../src/chart/index';
import { Tooltip, LabelPosition, IPointRenderEventArgs, ChartSeriesType } from '../../../../src/chart/index';
import { MouseEvents } from '../../../../spec/chart/base/events.spec';
import '../../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(ColumnSeries, Category, StackingColumnSeries, DataLabel, Legend, Tooltip);

let mouseEvents: MouseEvents = new MouseEvents();
let chartData: object[] = [
    { country: 'USA', gold: 50 },
    { country: 'China', gold: 40 },
    { country: 'Japan', gold: 70 },
    { country: 'Australia', gold: 60 },
    { country: 'France', gold: 50 },
    { country: 'Germany', gold: 40 },
    { country: 'Italy', gold: 40 },
    { country: 'Sweden', gold: 30 }
];

let silverData: object[] = [
    { country: 'USA', silver: 25 },
    { country: 'China', silver: 20 },
    { country: 'Japan', silver: 50 },
    { country: 'Australia', silver: 20 },
    { country: 'France', silver: 30 },
    { country: 'Germany', silver: 10 },
    { country: 'Italy', silver: 15 },
    { country: 'Sweden', silver: 20 }
];

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category',
        title: 'Countries'
    },
    primaryYAxis: {
        interval: 20, title: 'Medals'
    },
    series: [{
        dataSource: chartData,
        xName: 'country', yName: 'gold',
        name: 'Gold',
        // Series type as column series
        type: 'Column', animation: { enable: false }
    }],
    title: 'Olympic Medals'
}, '#container');

let seriesTypes: HTMLInputElement = document.getElementById('seriestypes') as HTMLInputElement;
seriesTypes.onchange = () => {
    chart.series[0].type = seriesTypes.value as ChartSeriesType;
    chart.refresh();
};

let datalabel: HTMLInputElement = document.getElementById('datalabel') as HTMLInputElement;
datalabel.onchange = () => {
    for (let series of chart.series) {
        series.marker.dataLabel.visible = datalabel.checked;
        chart.refresh();
    }
};

let labelposition: HTMLSelectElement = document.getElementById('labelposition') as HTMLSelectElement;
(labelposition as HTMLSelectElement).onchange = () => {
    for (let series of chart.series) {
        series.marker.dataLabel.position = labelposition.value as LabelPosition;
        chart.refresh();
    }
};

let tooltip: HTMLInputElement = document.getElementById('tooltip') as HTMLInputElement;
(tooltip as HTMLInputElement).onchange = () => {
    chart.tooltip.enable = tooltip.checked;
    chart.pointRender = (args: IPointRenderEventArgs) => {
        if (args.point.index === 2) {
            args.fill = 'red';
        }
    };
    chart.refresh();
    let x: number = chart.visibleSeries[0].points[1].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[0].points[1].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[0].points[1].regions[0].y +
        chart.visibleSeries[0].points[1].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};

let negative: Element = document.getElementById('negative');
(negative as HTMLInputElement).onchange = () => {
    chart.pointRender = null;
    chart.tooltip.header = '';
    chart.series[0].dataSource = [{ country: 'USA', gold: 50 },
    { country: 'China', gold: -40 },
    { country: 'Japan', gold: 70 },
    { country: 'Australia', gold: -100 },
    { country: 'France', gold: 50 },
    { country: 'Germany', gold: 40 },
    { country: 'Italy', gold: 40 },
    { country: 'Sweden', gold: 30 }];
    chart.refresh();
    let x: number = chart.visibleSeries[0].points[1].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[0].points[1].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[0].points[1].regions[0].y +
        chart.visibleSeries[0].points[1].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};

let cornerTooltip: Element = document.getElementById('cornertooltip');
(cornerTooltip as HTMLSelectElement).onchange = () => {
    let selectedValue: string = (cornerTooltip as HTMLSelectElement).value;
    chart.tooltip.header = null;
    chart.pointRender = null;
    chart.width = '300px';
    chart.height = '500px';
    chart.refresh();
    let index: number = 0;
    switch (selectedValue) {
        case 'Top':
            index = 2;
            break;
        case 'Right':
            index = 7;
            break;
        case 'Bottom':
            index = 3;
            break;
    }
    let x: number = chart.visibleSeries[0].points[index].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[0].points[index].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[0].points[index].regions[0].y +
        chart.visibleSeries[0].points[index].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};

let multiseries: Element = document.getElementById('multiseries');
(multiseries as HTMLInputElement).onchange = () => {
    let type: ChartSeriesType = seriesTypes.value as ChartSeriesType;
    chart.width = null;
    chart.height = null;
    chart.tooltip.enable = false;
    chart.primaryXAxis = {
        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
    };

    chart.primaryYAxis = {
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
    };
    //Initializing Chart Series
    chart.series = [
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Gold',
            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            animation: { enable: false },
            columnWidth: 0.5, fill: 'orange', cornerRadius: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 }
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Silver',
            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            animation: { enable: false },
            columnWidth: 0.5, fill: 'green', cornerRadius: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 }
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Bronze',
            dataSource: [{ x: 'USA', y: 38 }, { x: 'GBR', y: 17 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            animation: { enable: false },
            columnWidth: 0.5, fill: 'red', cornerRadius: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 }
        }];
    chart.refresh();
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

let tooltipWithoutHeader: Element = document.getElementById('withoutheader');
(tooltipWithoutHeader as HTMLInputElement).onchange = () => {
    chart.tooltip.header = '';
    chart.refresh();
    let x: number = chart.visibleSeries[1].points[1].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[1].points[1].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[1].points[1].regions[0].y +
        chart.visibleSeries[1].points[1].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};

let vertical: Element = document.getElementById('vertical');
(vertical as HTMLInputElement).onchange = () => {
    chart.isTransposed = (vertical as HTMLInputElement).checked;
    chart.tooltip.header = null;
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

let sidebyside: Element = document.getElementById('sidebysideposition');
(sidebyside as HTMLInputElement).onchange = () => {
    chart.enableSideBySidePlacement = !(sidebyside as HTMLInputElement).checked;
    chart.series[0].columnWidth = 0.75;
    chart.series[1].columnWidth = 0.4;
    chart.series[2].columnWidth = 0.25;
    chart.series[0].opacity = 0.75;
    chart.series[1].opacity = 0.75;
    chart.series[2].opacity = 0.75;
    chart.refresh();
};

let multipanel: Element = document.getElementById('multipanel');
(multipanel as HTMLInputElement).onchange = () => {
    let type: ChartSeriesType = seriesTypes.value as ChartSeriesType;
    chart.axes = [
        {
            name: 'topLeftX', rowIndex: 1, columnIndex: 0,
            valueType: 'Category'
        },
        { name: 'topLeftY', rowIndex: 1, columnIndex: 0 },
        { name: 'topRightX', rowIndex: 1, columnIndex: 1, valueType: 'Category' },
        { name: 'topRightY', rowIndex: 1, columnIndex: 1 },
        { name: 'bottomRightX', rowIndex: 0, columnIndex: 1, valueType: 'Category' },
        { name: 'bottomRightY', rowIndex: 0, columnIndex: 1 }
    ];
    chart.rows = [{ height: '50%' },
    { height: '50%' }];
    chart.columns = [{ width: '50%' },
    { width: '50%' }];
    chart.series = [
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Gold',
            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            animation: { enable: false }, columnWidth: 1
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Silver',
            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            animation: { enable: false }, columnWidth: 1
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Gold',
            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'topLeftX', yAxisName: 'topLeftY',
            animation: { enable: false }, columnWidth: 1
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Silver',
            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'topLeftX', yAxisName: 'topLeftY',
            animation: { enable: false }, columnWidth: 1
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Gold',
            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'topRightX', yAxisName: 'topRightY',
            animation: { enable: false }, columnSpacing: 0.25
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Silver',
            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'topRightX', yAxisName: 'topRightY',
            animation: { enable: false }, columnSpacing: 0.25
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Gold',
            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'bottomRightX', yAxisName: 'bottomRightY',
            animation: { enable: false }, columnSpacing: 0.25
        },
        {
            type: type, xName: 'x', width: 2, yName: 'y', name: 'Silver',
            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
            xAxisName: 'bottomRightX', yAxisName: 'bottomRightY',
            animation: { enable: false }, columnSpacing: 0.25
        }
    ];
    chart.tooltip.enable = true;
    chart.refresh();
    let x: number = chart.visibleSeries[5].points[1].regions[0].x + chart.element.offsetLeft +
        chart.visibleSeries[5].points[1].regions[0].width / 2 +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('x'));
    let y: number = chart.visibleSeries[5].points[1].regions[0].y +
        chart.visibleSeries[5].points[1].regions[0].height / 2 + chart.element.offsetTop +
        Number(document.getElementById('container_ChartAreaBorder').getAttribute('y'));
    mouseEvents.mousemovetEvent(chart.element, x, y);
};

let multiStackSeries: Element = document.getElementById('multistackseries');
(multiStackSeries as HTMLInputElement).onchange = () => {
    chart.width = null;
    chart.height = null;
    let type: ChartSeriesType = seriesTypes.value as ChartSeriesType;
    chart.series = [
        {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'UK', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        }, {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'Germany', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        }, {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'France', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }

        }, {
            dataSource: chartData, xName: 'country', yName: 'gold', type: type, name: 'Italy', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        },
        {
            dataSource: silverData, xName: 'country', yName: 'silver',
            stackingGroup: 'Group2', type: type, name: 'UK', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        }, {
            dataSource: silverData, xName: 'country', yName: 'silver',
            stackingGroup: 'Group2', type: type, name: 'Germany', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        }, {
            dataSource: silverData, xName: 'country', yName: 'silver',
            stackingGroup: 'Group2', type: type, name: 'France', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }

        }, {
            dataSource: silverData, xName: 'country', yName: 'silver',
            stackingGroup: 'Group2', type: type, name: 'Italy', animation: { enable: false },
            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
        }
    ];
    chart.refresh();
};

let singleStackSeries: Element = document.getElementById('singlestackseries');
(singleStackSeries as HTMLInputElement).onchange = () => {
    let type: ChartSeriesType = seriesTypes.value as ChartSeriesType;
    chart.series = [
        {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'UK', animation: { enable: false }
        }, {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'Germany', animation: { enable: false }
        }, {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'France', animation: { enable: false }

        }, {
            dataSource: chartData, xName: 'country', yName: 'gold',
            type: type, name: 'Italy', animation: { enable: false }
        }
    ];
    chart.refresh();
};

