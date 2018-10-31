import {
    Chart, RangeColumnSeries, Category, DataLabel, Tooltip, Legend,  HiloSeries, Selection, Zoom,
    Crosshair
} from '../../../../src/chart/index';
import { LegendShape, SelectionMode, LabelPosition} from '..../../../src/chart/utils/enum';
Chart.Inject(RangeColumnSeries, Category, DataLabel, Tooltip, Legend,  HiloSeries, Selection, Zoom, Crosshair);

/**
 * RangeColumn series
 */

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
            type: 'Hilo', name: 'India', xName: 'x', high: 'high', low: 'low', yName: 'low',
            dataSource: [
                { x: 'Jan', low: 87, high: 200 }, { x: 'Feb', low: 45, high: 135 },
                { x: 'Mar', low: 19, high: 85 }, { x: 'Apr', low: 31, high: 108 },
                { x: 'May', low: 27, high: 80 }, { x: 'June', low: 84, high: 130 },
                { x: 'July', low: 77, high: 150 }, { x: 'Aug', low: 54, high: 125 },
                { x: 'Sep', low: 60, high: 155 }, { x: 'Oct', low: 60, high: 180 },
                { x: 'Nov', low: 88, high: 180 }, { x: 'Dec', low: 84, high: 230 }
            ],
            fill: 'red',
            marker: {
                // Data label for chart series
                dataLabel: {
                    visible: true, position: 'Outer'
                }
            },

        },
        {
            type: 'Hilo', name: 'USA', xName: 'x', high: 'high', low: 'low', yName: 'low',
            dataSource: [
                { x: 'Jan', low: 3, high: 220 }, { x: 'Feb', low: 18, high: 76 },
                { x: 'Mar', low: 50, high: 150 }, { x: 'Apr', low: 58, high: 130 },
                { x: 'May', low: 60, high: 190 }, { x: 'June', low: 64, high: 205 },
                { x: 'July', low: 50, high: 100 }, { x: 'Aug', low: 30, high: 76 },
                { x: 'Sep', low: 80, high: 170 }, { x: 'Oct', low: 40, high: 144 },
                { x: 'Nov', low: 70, high: 140 }, { x: 'Dec', low: 50, high: 177 }
            ],
            fill: 'blue',
            marker: {
                // Data label for chart series
                dataLabel: {
                    visible: true, position: 'Outer'
                }
            },
        }
    ],
    tooltip: {
        enable: true,
        format: '${point.x}<br>High : ${point.high}<br>Low : ${point.low}'
    },
    title: 'Maximum and Minimum Rainfall',
    legendSettings: {
        visible: true,
    }
});
chart.appendTo('#container');


