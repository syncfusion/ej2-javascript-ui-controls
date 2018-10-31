/**
 * area series
 */
import { Chart, ColumnSeries, Tooltip, Category, Crosshair, Legend, Selection, SelectionMode } from '../../../src/chart/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(ColumnSeries, Category, Tooltip, Crosshair, Legend, Selection);

export let selectionData: any[] = [
    { country: "USA", gold: 50, silver: 70, bronze: 45 },
    { country: "China", gold: 40, silver: 60, bronze: 55 },
    { country: "Japan", gold: 70, silver: 60, bronze: 50 },
    { country: "Australia", gold: 60, silver: 56, bronze: 40 },
    { country: "France", gold: 50, silver: 45, bronze: 35 },
    { country: "Germany", gold: 40, silver: 30, bronze: 22 },
    { country: "Italy", gold: 40, silver: 35, bronze: 37 },
    { country: "Sweden", gold: 30, silver: 25, bronze: 27 }
];

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category',
    },
    series:[{
        dataSource: selectionData,
        xName: 'country', yName: 'gold',
        name: 'Gold', type: 'Column', animation: { enable: false},
        fill:'#8bb844'
    }, {
        dataSource: selectionData,
        xName: 'country', yName: 'silver',
        name: 'Silver', type: 'Column', animation: { enable: false},
        fill:'#9444b8'
    }, {
        dataSource: selectionData,
        xName: 'country', yName: 'bronze',
        name: 'Bronze', type: 'Column', animation: { enable: false},
        fill:'#d12b5e'
    }],
    selectionMode: 'Point',
    legendSettings: { visible: true, toggleVisibility: false },
    title: 'Olympic Medals'
}, '#container');

let selectiontype: HTMLSelectElement = document.getElementById('selectiontype') as HTMLSelectElement;
selectiontype.onchange = () => {
 chart.selectionMode = <SelectionMode>selectiontype.value;
};
let multi: HTMLInputElement = document.getElementById('multi') as HTMLInputElement;
multi.onchange = () => {
   chart.isMultiSelect = multi.checked;
    chart.refresh();
};