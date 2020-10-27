/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, DataSourceChangedEventArgs } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { defaultData as dataSource, filterData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 130
    },
    {
        width: 92
    },
    {
        width: 96
    }
];

let sheet: SheetModel[] = [{
    name: 'Price Details',
    ranges: [{
        dataSource: dataSource,
        startCell: 'A1'
    },{
        dataSource: dataSource,
        startCell: 'A15'
    }],
    rowCount: 200,
    columns: columns,
    rows: [{ index: 3, cells: [{ wrap: true }] }]
},
{
    ranges: [{
        dataSource: filterData
    }],
},
];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Price Details') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        }
    },
    dataSourceChanged: (args: DataSourceChangedEventArgs) => {
        console.log(args);
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
});

spreadsheet.appendTo('#spreadsheet');

document.getElementById('changeSecondSheetData').addEventListener('click', ()=>{
    spreadsheet.sheets[1].ranges[0].dataSource = dataSource;
});

document.getElementById('changedata').addEventListener('click', ()=>{
    spreadsheet.sheets[0].ranges[0].dataSource = filterData;
});
document.getElementById('changedata3').addEventListener('click', ()=>{
    spreadsheet.sheets[0].ranges[0].dataSource = dataSource;
});

document.getElementById('changedata2').addEventListener('click', ()=>{
    spreadsheet.sheets[0].ranges[1].dataSource = filterData;
});

document.getElementById('addrange').addEventListener('click', ()=>{
    var ranges = spreadsheet.sheets[0].ranges;
    ranges.push({ dataSource: dataSource, startCell: 'M2' });
    spreadsheet.sheets[0].ranges = ranges;
});


