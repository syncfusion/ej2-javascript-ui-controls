/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, PolarSeries, RadarSeries, Category, AreaSeries, LineSeries, Selection, IPointEventArgs
} from '../../../src/index';
Chart.Inject(Tooltip, Legend, PolarSeries, Category, AreaSeries, RadarSeries, LineSeries, Selection);

let polar: Chart = new Chart({
 
    primaryXAxis: {  isInversed: true,  interval: 1, valueType: 'Category' },

    primaryYAxis: { title: 'Revenue in Millions', labelFormat: '{value}M', isInversed : true }, 

    series: [
        {
            type: 'Polar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product A',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        },
        {
            type: 'Polar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product A',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        }
    ],
    tooltip: { enable: true }, title: 'Average Sales (Inversed Polar)',

});
polar.appendTo('#polarLabel');
let polarXEle: any = document.getElementById('polarX');
polarXEle.onclick = () => {
    polar.primaryXAxis.isInversed = polarXEle.checked;
    polar.dataBind();
}

let polarYEle: any = document.getElementById('polarY');
polarYEle.onclick = () => {
    polar.primaryYAxis.isInversed = polarYEle.checked;
    polar.dataBind();
}

let polarOnTick: any = document.getElementById('polarOnTicks');
polarOnTick.onclick = () => {
    polar.primaryXAxis.labelPlacement  = polarOnTick.checked ? 'OnTicks' : 'BetweenTicks';
    polar.refresh();
}


let radar: Chart = new Chart({
 
    primaryXAxis: {  valueType: 'Category', labelPlacement: 'OnTicks', interval: 1, isInversed: true },

    primaryYAxis: { title: 'Revenue in Millions', labelFormat: '{value}M', isInversed: true },

    series: [
        {
            type: 'Radar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product A',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        },
        {
            type: 'Radar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product B',
            dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 },  { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
        }
    ],
    tooltip: { enable: true }, title: 'Average Sales (Inversed Radar)',

});
radar.appendTo('#radarLabel');

let radarXEle: any = document.getElementById('radarX');
radarXEle.onclick = () => {
    radar.primaryXAxis.isInversed = radarXEle.checked;
    radar.dataBind();
}

let radarYEle: any = document.getElementById('radarY');
radarYEle.onclick = () => {
    radar.primaryYAxis.isInversed = radarYEle.checked;
    radar.dataBind();
}


/**
 * Polar Chart Selection and marker for Line Series
 */

export let data1: object[] = [
    { x: 'Jan', y: -7.1 },
    { x: 'Feb', y: -3.7 },
    { x: 'Mar', y: 0.8 },
    { x: 'Apr', y: 6.3 },
    { x: 'May', y: 13.3 },
    { x: 'Jun', y: 18.0 },
    { x: 'Jul', y: 19.8 },
    { x: 'Aug', y: 18.1 },
    { x: 'Sep', y: 13.1 },
    { x: 'Oct', y: 4.1 },
    { x: 'Nov', y: -3.8 },
    { x: 'Dec', y: -6.8 },
];
export let data2: object[] = [
    { x: 'Jan', y: -17.4 },
    { x: 'Feb', y: -15.6 },
    { x: 'Mar', y: -12.3 },
    { x: 'Apr', y: -5.3 },
    { x: 'May', y: 1.0 },
    { x: 'Jun', y: 6.9 },
    { x: 'Jul', y: 9.4 },
    { x: 'Aug', y: 7.6 },
    { x: 'Sep', y: 2.6 },
    { x: 'Oct', y: -4.9 },
    { x: 'Nov', y: -13.4 },
    { x: 'Dec', y: -16.4 },
];
let polarSelectionChart: Chart = new Chart({
    primaryXAxis: { valueType: 'Category'},
    series: [
        { dataSource: [{x:"Algeria",y:0.0},{x:"Argentina",y:3.0},{x:"Armenia",y:1.0},{x:"Australia",y:8.0},{x:"Austria",y:0.0}], xName: 'x', yName: 'y', marker: { visible: true }, name: 'TempC', type: 'Polar' },
        //{ dataSource: data2, xName: 'x', yName: 'y', marker: { visible: true }, name: 'TempF', type: 'Polar' },
    ],
    legendSettings: { visible: true },
    selectionMode: 'Point',
    title: 'Marker click on YAxis line issue',
    pointClick: (value: IPointEventArgs) => {
        //console.log(value.point.x + ':' + value.point.y);
    }
});
polarSelectionChart.appendTo('#polarMarker');
