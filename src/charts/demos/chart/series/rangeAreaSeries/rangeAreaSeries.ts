/**
 * Range area series
 */
import { Chart, RangeAreaSeries, Category, DateTime, Legend, DataLabel,  Tooltip, Zoom, Crosshair, Selection } from '../../../../src/chart/index';
Chart.Inject(RangeAreaSeries, Category, DateTime, Legend, DataLabel,  Tooltip, Zoom, Crosshair, Selection);

let series1: Object[] = [];
let value: number = 70;
let point1: Object;

for (let i: number = 1; i < 70; i++) {
    if (Math.random() > .5) {
        value += Math.random();
    } else {
        value -= Math.random();
    }
    point1 = { x: new Date(1930 + i, 5, i), high: value, low: value - 14 };
    series1.push(point1);
}
let data: any[] = [
    { x: 'Jan', low: 0.7, high: 6.1 }, { x: 'Feb', low: 1.3, high: 6.3 }, { x: 'Mar', low: 1.9, high: 8.5 },
    { x: 'Apr', low: 3.1, high: 10.8 }, { x: 'May', low: 5.7, high: 14.40 }, { x: 'Jun', low: 8.4, high: 16.90 },
    { x: 'Jul', low: 10.6, high: 19.20 }, { x: 'Aug', low: 10.5,high: 18.9 }, { x: 'Sep', low: 8.5, high: 16.1 },
    { x: 'Oct', low: 6.0, high: 12.5 }, { x: 'Nov', low: 1.5, high: 6.9  }, { x: 'Dec', low: 5.1, high: 12.1 }
];
let chart: Chart = new Chart({

    primaryXAxis: {
        title: 'Month',
        valueType: 'Category',
        edgeLabelPlacement: 'Shift',
    },

    primaryYAxis:
    {
        title: 'Temperature(Celsius)'
    },

    tooltip: { enable: true },

    legendSettings: { visible: true },

    zoomSettings:
    {
        enableMouseWheelZooming: true,
        enablePinchZooming: true,
        enableSelectionZooming: true,
        mode: 'XY'

    },

    series: [
        {
            type: 'RangeArea',
            name: 'India',
            dataSource: data,
            xName: 'x', high: 'high', low: 'low', opacity: 0.5,
            fill: '#69D2E7', border: { color: 'blueviolet', width: 1 },
            marker: {
                visible: true,
                height: 10, width: 10,
                shape: 'Pentagon', border: { color: 'red', width: 2 },
                dataLabel: { visible: true, position: 'Outer' }
            },
            animation: {
                enable: false,
            }
        },
    ],
    isTransposed: true,
    title: 'Maximum and Minimum Temperature',
    height: '600px',
}, '#container');
