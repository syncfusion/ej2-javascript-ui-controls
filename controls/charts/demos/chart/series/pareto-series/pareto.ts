/**
 * area series
 */
import { Chart, AreaSeries, Tooltip, ParetoSeries, ColumnSeries, Category, Series, LineSeries, DataLabel,
     IPointRenderEventArgs, IAxisLabelRenderEventArgs } from '../../../../src/chart/index';
import '../../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(AreaSeries, Tooltip, ColumnSeries, ParetoSeries, Category, LineSeries, DataLabel);

let chartData: any[] = [
    { x: 1900, y: 4 }, { x: 1920, y: 3.0 }, { x: 1940, y: 3.8 },
    { x: 1960, y: 3.4 }, { x: 1980, y: 3.2 }, { x: 2000, y: 3.9 }
];
let pointRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
        if (args.point.index === 2) {
            args.fill = 'red';
            args.border.color = 'green';
            args.border.width = 2;
        }
};
let axisLabelRender: EmitType<IAxisLabelRenderEventArgs> = (args: IAxisLabelRenderEventArgs): void => {
    if (args.text === 'Weather') { 
       args.labelStyle.color = 'blue';
    }
};
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Defects',
        interval: 1,
        valueType: 'Category',
        majorGridLines: { width: 0 }, minorGridLines: { width: 0 },
        majorTickLines: { width: 0 }, minorTickLines: { width: 0 },
        lineStyle: { width: 0 },
    },
    //Initializing Primary Y Axis
    primaryYAxis:
    {
        title: 'Frequency',
        minimum: 0,
        maximum: 150,
        interval: 30,
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
            type: 'Pareto',
            dataSource: [
                { x: 'Traffic', y: 56 }, { x: 'Child Care', y: 44.8 },
                { x: 'Transport', y: 27.2 }, { x: 'Weather', y: 19.6 },
                { x: 'Emergency', y: 6.6 }
            ],
            xName: 'x', yName: 'y', name: 'Defect',
           width: 2,
            marker: {
                visible: true,
                width: 10,
                height: 10,
                shape: 'Diamond', dataLabel: { visible: true}
            }, fill: '#1cd9fd', animation: { enable: false }
        }
    ],
    pointRender: pointRender,
    axisLabelRender: axisLabelRender,
   title: 'Defect vs Frequency',
    legendSettings: { visible: false },
    
});
chart.appendTo('#container');
