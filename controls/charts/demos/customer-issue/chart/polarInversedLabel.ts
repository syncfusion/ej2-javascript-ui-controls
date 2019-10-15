/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, PolarSeries, RadarSeries, Category, AreaSeries
} from '../../../src/index';
Chart.Inject(Tooltip, Legend, PolarSeries, Category, AreaSeries, RadarSeries);

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

