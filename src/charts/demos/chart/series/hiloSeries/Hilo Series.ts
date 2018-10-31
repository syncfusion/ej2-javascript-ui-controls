import {
    Chart, Category, DataLabel, Tooltip, Legend, HiloSeries, Selection, Zoom,
    Crosshair
} from '../../../../src/chart/index';
Chart.Inject( Category, DataLabel, Tooltip, Legend, HiloSeries, Selection, Zoom, Crosshair);

/**
 * Hilo series
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
        minimum: 18,
        maximum: 32
    },
    //Initializing Chart Series
    series: [
        {
            type: 'Hilo', name: 'Annual', xName: 'x', high: 'high', low: 'low', yName: 'low',
            dataSource: [
                { x: '1965', low: 18.98, high: 29.16 }, { x: '1966', low: 19.31, high: 29.41 },
                { x: '1967', low: 19.08, high: 29.14 }, { x: '1968', low: 18.83, high: 29.07 },
                { x: '1969', low: 19.32, high: 29.61 }, { x: '1970', low: 19.16, high: 29.47 },
                { x: '1971', low: 18.77, high: 29.15 }, { x: '1972', low: 18.91, high: 29.31 },
                { x: '1973', low: 19.38, high: 29.44 }, { x: '1974', low: 18.76, high: 29.26 },
                { x: '1975', low: 18.62, high: 28.89 }, { x: '1976', low: 18.9, high: 29.27 },
                { x: '1977', low: 19.31, high: 29.41 }, { x: '1978', low: 19.25, high: 29.23 },
                { x: '1979', low: 19.55, high: 29.63 }, { x: '1980', low: 19.83, high: 29.58 },
                { x: '1981', low: 19.25, high: 29.32 }, { x: '1982', low: 19.21, high: 29.12 },
                { x: '1983', low: 19.14, high: 29.11 }, { x: '1984', low: 19.25, high: 29.28 },
                { x: '1985', low: 19.3, high: 29.61 }, { x: '1986', low: 19.09, high: 29.33 },
                { x: '1987', low: 19.42, high: 29.72 }, { x: '1988', low: 19.33, high: 29.75 },
                { x: '1989', low: 18.96, high: 29.18 }, { x: '1990', low: 19.24, high: 29.14 },
                { x: '1991', low: 19.29, high: 29.32 }, { x: '1992', low: 19.15, high: 29.23 },
                { x: '1993', low: 19.34, high: 29.55 }, { x: '1994', low: 19.48, high: 29.46 },
                { x: '1995', low: 20.39, high: 30.18 }, { x: '1996', low: 19.55, high: 29.58 },
                { x: '1997', low: 19.21, high: 29.05 }, { x: '1998', low: 19.84, high: 29.7 },
                { x: '1999', low: 19.53, high: 29.81 }, { x: '2000', low: 19.48, high: 29.75 },
                { x: '2001', low: 19.49, high: 29.99 }, { x: '2002', low: 19.78, high: 30.23 },
                { x: '2003', low: 19.7, high: 29.75 }, { x: '2004', low: 19.69, high: 29.79 },
                { x: '2005', low: 19.58, high: 29.6 }, { x: '2006', low: 20.07, high: 30.06 },
                { x: '2007', low: 19.69, high: 29.84 }, { x: '2008', low: 19.6, high: 29.64 },
                { x: '2009', low: 19.94, high: 30.03 }, { x: '2010', low: 20.15, high: 30.13 },
                { x: '2011', low: 19.58, high: 29.82 }, { x: '2012', low: 19.54, high: 29.81 },
                { x: '2013', low: 19.83, high: 29.81 }, { x: '2014', low: 19.77, high: 29.72 }
            ],
        },
    ],
    tooltip: {
        enable: true,
        format: '${point.x}<br>Max : ${point.high}<br>Min : ${point.low}'
    },
    title: 'Maximum and Minimum Rainfall',


});
chart.appendTo('#container');

