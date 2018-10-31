/**
 * axis spec
 */

let data: any[] = [{ x: new Date(2017, 10, 12), y: 10 }, { x: new Date(2018, 10, 12), y: null },
{ x: new Date(2019, 10, 12), y: 20 }, { x: new Date(2020, 10, 12), y: 200 }];

let months: any[] = [{ x: new Date(2017, 11, 1), y: 10 }, { x: new Date(2017, 12, 1), y: 10 },
{ x: new Date(2018, 0, 1), y: 20 }, { x: new Date(2019, 1, 12), y: 200 }];

let days: any[] = [{ x: new Date(2017, 11, 1), y: 10.8 }, { x: new Date(2017, 11, 8), y: null },
{ x: new Date(2017, 11, 9), y: 10.67 }, { x: new Date(2017, 11, 10), y: 12 }];

let hours: any[] = [{ x: new Date(2017, 11, 1, 3), y: 100 }, { x: new Date(2017, 11, 1, 5), y: 90 },
{ x: new Date(2017, 11, 1, 7), y: null }, { x: new Date(2017, 11, 1, 9), y: 110 }];

let minutes: any[] = [{ x: new Date(2017, 11, 1, 3, 10), y: 12 }, { x: new Date(2017, 11, 1, 3, 20), y: 90 },
{ x: new Date(2017, 11, 1, 3, 40), y: 40 }, { x: new Date(2017, 11, 1, 3, 50), y: 90 }];

let minutes1: any[] = [{ x: new Date(2017, 11, 1, 3, 10), y: 23 }, { x: new Date(2017, 11, 1, 3, 20), y: null },
{ x: new Date(2017, 11, 1, 3, 40), y: 23 }, { x: new Date(2017, 11, 1, 3, 50), y: 84 }];

let minutes2: any[] = [{ x: new Date(2017, 11, 1, 3, 10), y: undefined }, { x: new Date(2017, 11, 1, 3, 20), y: 45 },
{ x: new Date(2017, 11, 1, 3, 40), y: 12 }, { x: new Date(2017, 11, 1, 3, 50), y: 75 }];

let seconds: any[] = [{ x: new Date(2017, 11, 1, 3, 10, 10), y: 100 }, { x: new Date(2017, 11, 1, 3, 10, 20), y: null },
{ x: new Date(2017, 11, 1, 3, 10, 40), y: 70 }, { x: new Date(2017, 11, 1, 3, 10, 50), y: 40 }];

let seconds1: any[] =  [{ x: new Date(2017, 11, 1, 3, 10, 10), y: 10 }, { x: new Date(2017, 11, 1, 3, 10, 20), y: 34 },
{ x: new Date(2017, 11, 1, 3, 10, 40), y: undefined }, { x: new Date(2017, 11, 1, 3, 10, 50), y: 30 }];

import { Chart, DateTime, LineSeries, StripLine, AreaSeries, StackingAreaSeries } from '../../../../src/chart/index';
import { Axis } from '../../../../src/chart/index';
Chart.Inject(DateTime, LineSeries, StripLine, AreaSeries, StackingAreaSeries);
let chart: Chart = new Chart({
    axes: [
        {
            valueType: 'DateTime', title: 'auto', name: 'auto', majorGridLines: { width: 0},
            stripLines: [
            { start: new Date(2017, 3, 4), end: new Date(2018, 2, 10), visible: true, color: 'skyblue', opacity: 0.6,
              horizontalAlignment: 'Middle', verticalAlignment: 'Middle' },
            { start: new Date(2018, 3, 10), end: new Date(2018, 10, 1), visible: true, text: 'StripLines', opacity: 0.5,
              horizontalAlignment: 'Middle', verticalAlignment: 'End' }]
        },
        { title: 'autoDouble', name: 'autoDouble', majorGridLines: { width: 0} },
        { valueType: 'DateTime', title: 'auto2', name: 'auto2', rowIndex: 1, opposedPosition: true, majorGridLines: { width: 0}, },
        {
            title: 'autoDouble2', name: 'autoDouble2', rowIndex: 1, plotOffset: 10, majorGridLines: { width: 0},
            stripLines: [
            { start: 10, size: 100, visible: true, opacity: 0.5, color: 'red', horizontalAlignment: 'End', verticalAlignment: 'Start' },
            { size: 5, startFromAxis: true, visible: true, opacity: 0.5, color: 'black', horizontalAlignment: 'End', verticalAlignment:'Middle' }]
        },
        { valueType: 'DateTime', title: 'years', name: 'years', rowIndex: 0, columnIndex: 1, majorGridLines: { width: 0}, },
        { title: 'yearsDouble', name: 'yearsDouble', rowIndex: 0, columnIndex: 1, plotOffset: 10, majorGridLines: { width: 0}, },
        { valueType: 'DateTime', title: 'months', name: 'months', rowIndex: 1, columnIndex: 1, opposedPosition: true,
          majorGridLines: { width: 0}, },
        { title: 'monthsDouble', name: 'monthsDouble', rowIndex: 1, columnIndex: 1, plotOffset: 10, majorGridLines: { width: 0}, },
        { valueType: 'DateTime', title: 'days', name: 'days', rowIndex: 0, columnIndex: 2, majorGridLines: { width: 0}, },
        { title: 'daysDouble', name: 'daysDouble', rowIndex: 0, columnIndex: 2, opposedPosition: true, majorGridLines: { width: 0}, },
        { valueType: 'DateTime', title: 'hours', name: 'hours', rowIndex: 1, columnIndex: 2, opposedPosition: true,
          majorGridLines: { width: 0}, },
        { title: 'hoursDouble', name: 'hoursDouble', rowIndex: 1, columnIndex: 2, opposedPosition: true, plotOffset: 10,
          majorGridLines: { width: 0}, },
        { valueType: 'DateTime', title: 'minutes', name: 'minutes', rowIndex: 0, columnIndex: 3, majorGridLines: { width: 0}, },
        { title: 'minutesDouble', name: 'minutesDouble', rowIndex: 0, columnIndex: 3, opposedPosition: true, majorGridLines: { width: 0}},
        { valueType: 'DateTime', title: 'seconds', name: 'seconds', rowIndex: 1, columnIndex: 3, opposedPosition: true,
          majorGridLines: { width: 0}, },
        { title: 'secondsDouble', name: 'secondsDouble', rowIndex: 1, columnIndex: 3, opposedPosition: true,
          plotOffset: 10, majorGridLines: { width: 0}, },
    ],
    rows: [
        { height: '50%', border: { color: 'violet', width: 1 } },
        { height: '50%', border: { color: 'yellow', width: 1 } },
    ],
    columns: [
        { width: '25%', border: { color: 'black', width: 1 } },
        { width: '25%', border: { color: 'red', width: 1 } },
        { width: '25%', border: { color: 'blue', width: 1 } },
        { width: '25%', border: { color: 'green', width: 1 } },
    ],
    series: [
        { dataSource: data, xName: 'x', yName: 'y', xAxisName: 'auto', yAxisName: 'autoDouble', name: '0',
          animation: { enable: false }, width: 2, dashArray: '10,5', marker: { visible: true}, emptyPointSettings: { mode: 'Average', fill: 'grey'}},
        { dataSource: data, xName: 'x', yName: 'y', xAxisName: 'auto2', yAxisName: 'autoDouble2', name: '1',
          animation: { enable: false },  width: 5, emptyPointSettings: { mode: 'Drop', fill: 'red'}, marker: { visible: true} },
        { dataSource: data, xName: 'x', yName: 'y', xAxisName: 'years', yAxisName: 'yearsDouble', name: '2',
          animation: { enable: false }, fill: 'orange', emptyPointSettings: { mode: 'Gap'}, marker: { visible: true} },
        { dataSource: months, xName: 'x', yName: 'y', xAxisName: 'months', yAxisName: 'monthsDouble', name: '3',
          animation: { enable: false }},
        { dataSource: days, xName: 'x', yName: 'y', xAxisName: 'days', yAxisName: 'daysDouble', name: '4', marker: { visible: true},
          animation: { enable: false }, emptyPointSettings: { mode: 'Average', fill:'blue'} , type: 'Area' },
        { dataSource: hours, xName: 'x', yName: 'y', xAxisName: 'hours', yAxisName: 'hoursDouble', name: '5',
          animation: { enable: false }, type: 'Area', border: { color: 'black', width: 2}, dashArray: '20,15',
          emptyPointSettings: { mode: 'Gap', fill: 'red'}
        },
        { dataSource: minutes, xName: 'x', yName: 'y', xAxisName: 'minutes', yAxisName: 'minutesDouble', name: '6', type:'StackingArea100',
          animation: { enable: false }, fill: 'red', opacity: 0.5, emptyPointSettings: { mode: 'Average', fill: 'pink'}, marker: { visible: true} },
        { dataSource: minutes1, xName: 'x', yName: 'y', xAxisName: 'minutes', yAxisName: 'minutesDouble', name: '7', type:'StackingArea100',
          animation: { enable: false }, fill: 'black', opacity: 0.5, emptyPointSettings: { mode: 'Drop', fill: 'blue'}, marker: { visible: true} },
        { dataSource: minutes2, xName: 'x', yName: 'y', xAxisName: 'minutes', yAxisName: 'minutesDouble', name: '8', type:'StackingArea100',
          animation: { enable: false }, fill: 'blue', opacity: 0.5, emptyPointSettings: { mode: 'Zero', fill: 'black'}, marker: { visible: true} },
        { dataSource: seconds, xName: 'x', yName: 'y', xAxisName: 'seconds', yAxisName: 'secondsDouble', name: '9', type: 'StackingArea',
          animation: { enable: false }, emptyPointSettings: { mode: 'Drop'}, marker: { visible: true}},
        { dataSource: seconds1, xName: 'x', yName: 'y', xAxisName: 'seconds', yAxisName: 'secondsDouble', name: '10', type: 'StackingArea',
          animation: { enable: false }, emptyPointSettings: { mode: 'Average', fill: 'blue'}, marker: { visible: true}},
    ],
    height: '800',
    title: 'chart dateTime double axiss'
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
let minimum: any = document.getElementById('minimum');
minimum.onclick = () => {
    if (minimum.checked) {
        chart.title ='minimum for autoDouble2 as 50 - auto2 as new Date(2016, 10, 3)';
        chart.axes[3].minimum = 50;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = new Date(2016, 10, 3);
        chart.axes[2].maximum = null;
        chart.axes[2].interval = null;
        chart.axes[2].labelIntersectAction = 'MultipleRows';
    } else {
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = null;
        chart.axes[2].interval = null;
    }
    chart.refresh();
};

let maximum: any = document.getElementById('maximum');
maximum.onclick = () => {
    if (maximum.checked) {
        chart.title = 'maximum for autoDouble2 as 400 - auto2 as new Date(2021, 10, 3)';
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = 400;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = new Date(2021, 10, 3);
        chart.axes[2].interval = null;
        chart.axes[2].labelIntersectAction = 'MultipleRows';
    } else {
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = null;
        chart.axes[2].interval = null;

    }
    chart.refresh();
};

let interval: any = document.getElementById('interval');
interval.onclick = () => {
    if (interval.checked) {
        chart.title ='minimum for autoDouble2 as 50 - auto2 as 2, intervalType as Months';
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = 50;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = null;
        chart.axes[2].interval = 2;
        chart.axes[2].intervalType = 'Months';
        chart.axes[2].labelIntersectAction = 'MultipleRows';
    } else {
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = null;
        chart.axes[2].interval = null;
    }
    chart.refresh();
};

let range: any = document.getElementById('range');
range.onclick = () => {
    if (interval.checked) {
        chart.title ='range for autoDouble2 as {0,200,40}- auto2 as { Date(2015, 10, 1), Date(2020, 10, 1)} intervalType as auto';
        chart.axes[3].minimum = 0;
        chart.axes[3].maximum = 200;
        chart.axes[3].interval = 40;
        chart.axes[2].minimum = new Date(2015, 10, 1);
        chart.axes[2].maximum = new Date(2020, 10, 1);
        chart.axes[2].interval = 2;
        chart.axes[2].labelIntersectAction = 'MultipleRows';
    } else {
        chart.axes[3].minimum = null;
        chart.axes[3].maximum = null;
        chart.axes[3].interval = null;
        chart.axes[2].minimum = null;
        chart.axes[2].maximum = null;
        chart.axes[2].interval = null;
    }
    chart.refresh();
};

let rangePadding: any = document.getElementById('rangePadding');
rangePadding.onclick = () => {
    let value = rangePadding.value;
    if (rangePadding.checked) {
        chart.title= 'rangePadding for double axis';
        chart.axes[1].rangePadding = 'None';
        chart.axes[3].rangePadding = 'Auto';
        chart.axes[5].rangePadding = 'Additional';
        chart.axes[7].rangePadding = 'Normal';
        chart.axes[9].rangePadding = 'Round';
        chart.axes[1].title = chart.axes[1].title + 'None';
        chart.axes[3].title = chart.axes[3].title + 'Auto';
        chart.axes[5].title = chart.axes[5].title + 'Additional';
        chart.axes[7].title = chart.axes[7].title + 'Normal';
        chart.axes[9].title = chart.axes[9].title + 'Round';
    } else {
        chart.axes[1].rangePadding = 'None';
        chart.axes[3].rangePadding = 'None';
        chart.axes[5].rangePadding = 'None';
        chart.axes[7].rangePadding = 'None';
        chart.axes[9].rangePadding = 'None';
        chart.axes[1].title = chart.axes[1].title.replace('None', '');
        chart.axes[3].title = chart.axes[3].title.replace('Auto', '');
        chart.axes[5].title = chart.axes[5].title.replace('Additional', '');
        chart.axes[7].title = chart.axes[7].title.replace('Normal', '');
        chart.axes[9].title = chart.axes[9].title.replace('Round', '');
    }
    chart.refresh();
};

let rangePaddingDate: any = document.getElementById('rangePadding_date');
rangePaddingDate.onchange = () => {
    let value = rangePaddingDate.value;
    chart.title = 'DateTime axis range padding as' + value;
    chart.axes.forEach((axis: Axis) => {
        if (axis.valueType === 'DateTime') {
            axis.rangePadding = value;
        }
    });
    chart.refresh();
};

let intervalType: any = document.getElementById('intervalType');
intervalType.onchange = () => {
    let value = intervalType.value;
    chart.axes[0].intervalType = value;
    chart.axes[2].intervalType = value;
    chart.refresh();
};

let labelFormatD: any = document.getElementById('labelFormatD');
labelFormatD.onclick = () => {
    if (labelFormatD.checked) {
        chart.axes[1].labelFormat = 'n1';
        chart.axes[3].labelFormat = 'p2';
        chart.axes[5].labelFormat = 'c3';
        chart.axes[7].labelFormat = '{value}K';
        chart.axes[9].labelFormat = 'n2';
        chart.axes[11].labelFormat = 'p2';
        chart.axes[13].labelFormat = 'c3';
        chart.axes[15].labelFormat = '{value}K';
    } else {
        chart.axes.forEach((axis: Axis) => {
            if (axis.valueType === 'Double') {
                axis.labelFormat = '';
            }
        });
    }
    chart.refresh();
};

let labelFormatDT: any = document.getElementById('labelFormatDT');
labelFormatDT.onclick = () => {
    if (labelFormatDT.checked) {
        chart.axes[0].skeleton = 'EEEE';
        chart.axes[2].skeleton = 'yMd';
        chart.axes[4].skeleton = 'MMM';
        chart.axes[6].skeleton = 'hm';
        chart.axes[8].skeleton = 'hms';
    } else {
        chart.axes.forEach((axis: Axis) => {
            if (axis.valueType === 'DateTime') {
                axis.skeleton = '';
            }
        });
    }
    chart.refresh();
};



