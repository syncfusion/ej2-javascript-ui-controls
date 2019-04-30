/**
 * area series
 */
import { Chart, AreaSeries, Tooltip, DateTime, Crosshair, Legend, Zoom, ScrollBar } from '../../../src/chart/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(AreaSeries, DateTime, Tooltip, Crosshair, Legend, Zoom, ScrollBar);

export let trackData: Object[] = [
    { x: new Date(2000, 2, 11), y: 15, y1: 39, y2: 60, y3: 75, y4: 85 },
    { x: new Date(2000, 9, 14), y: 20, y1: 30, y2: 55, y3: 75, y4: 83 },
    { x: new Date(2001, 2, 11), y: 25, y1: 28, y2: 48, y3: 68, y4: 85 },
    { x: new Date(2001, 9, 16), y: 21, y1: 35, y2: 57, y3: 75, y4: 87 },
    { x: new Date(2002, 2, 7), y: 13, y1: 39, y2: 62, y3: 71, y4: 82 },
    { x: new Date(2002, 9, 7), y: 18, y1: 41, y2: 64, y3: 69, y4: 74 },
    { x: new Date(2003, 2, 11), y: 24, y1: 45, y2: 57, y3: 81, y4: 73 },
    { x: new Date(2003, 9, 14), y: 23, y1: 48, y2: 53, y3: 84, y4: 75 },
    { x: new Date(2004, 2, 6), y: 19, y1: 54, y2: 63, y3: 85, y4: 73 },
    { x: new Date(2004, 9, 6), y: 31, y1: 55, y2: 50, y3: 87, y4: 60 },
    { x: new Date(2005, 2, 11), y: 39, y1: 57, y2: 66, y3: 75, y4: 48 },
    { x: new Date(2005, 9, 11), y: 50, y1: 60, y2: 65, y3: 70, y4: 55 },
    { x: new Date(2006, 2, 11), y: 24, y1: 60, y2: 79, y3: 85, y4: 40 }
];         

let chart: Chart = new Chart({
        primaryXAxis: {
            valueType: 'DateTime',
        },
        series: [
            {
                dataSource: trackData, name: 'John', xName: 'x',
                marker: { visible: true },
                type: 'Area', width: 2,
                yName: 'y', animation: { enable: false }, fill: '#503ed5',
                opacity: 0.5,
                dashArray: '5,5',
                border: { width: 3, color: 'red'}
            }
        ],
        zoomSettings: { 
            enableSelectionZooming: true,
            mode: 'X',
            enableScrollbar: false
        },
        title: 'Average Sales per Person'
}, '#container');
let scroll: HTMLInputElement = document.getElementById('scroll') as HTMLInputElement;
scroll.onchange = () => {
    chart.zoomSettings.enableScrollbar = scroll.checked;
    chart.refresh();
};