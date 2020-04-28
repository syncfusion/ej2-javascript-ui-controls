/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [
    {
        rows: [
            {
                cells: [{ value: 'Employee Timesheet',
                style: { fontWeight: 'bold', fontSize: '14pt', textAlign: 'center', verticalAlign: 'middle' },
                colSpan: 5, rowSpan: 2 }]
            },
            {},
            {
                cells: [
                    { value: 'Employee Name:' },
                    { value: 'Guevera'}
                ]
            },
            {
                cells: [
                     { value: 'Department:'},
                     { value: 'Analytics'}
                 ]
            },
            {
                cells: [
                    { value: 'Manager:'},
                    { value: 'XYZ'}
                ]
            },
            {},
            {
                cells: [
                    { value: 'Date' },
                    { value: 'Day' },
                    { value: 'First In-Time' },
                    { value: 'Last Out-Time' },
                    { value: 'Hours Completed' },
                ]
            },
            {
                cells: [
                    { value: '11/21/2016' },
                    { value: 'Monday' },
                    { value: '8:00:01 AM' },
                    { value: '5:30:10 PM' },
                    { value: '8.00' }
                ]
            },
            {
                cells: [
                    { value: '11/22/2016' },
                    { value: 'Tuesday' },
                    { value: '7:00:52 AM' },
                    { value: '6:00:32 PM' },
                    { value: '9.00' }
                ]
            },
            {
                cells: [
                    { value: '11/23/2016' },
                    { value: 'Wednesday' },
                    { value: '9:00:22 AM' },
                    { value: '6:00:22 PM' },
                    { value: '7.00' }
                ]
            },
            {
                cells: [
                    { value: '11/24/2016' },
                    { value: 'Thursday' },
                    { value: '8:00:32 AM' },
                    { value: '6:00:11 PM' },
                    { value: '8.00' }
                ]
            },
            {
                cells: [
                    { value: '11/25/2016' },
                    { value: 'Friday' },
                    { value: '8:00:52 AM' },
                    { value: '7:00:33 PM' },
                    { value: '9.00' },
                ]
            }
        ],
        columns: [
            { width: 110 }, { width: 85 }, { width: 100 },
            { width: 100 }, { width: 120 }
        ]
    }
];

let spreadsheet: Spreadsheet = new Spreadsheet({ 
    sheets: sheet,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A7:E7');
        spreadsheet.addDataValidation({ type:'Date', operator: 'EqualTo', value1: '11/25/2016'}, 'A8:A12');
        spreadsheet.addDataValidation({ type: 'TextLength', operator: 'GreaterThan', value1: '3'}, 'B8:B12');
        spreadsheet.addDataValidation({ type: 'Time', operator: 'LessThan', value1: '8:30:00 AM'}, 'C8:C12');
        spreadsheet.addDataValidation({ type: 'Time', operator: 'GreaterThan', value1: '5:30:00 PM'}, 'D8:D12');
        spreadsheet.addDataValidation({ type: 'Decimal', operator: 'GreaterThanOrEqualTo', value1: '8.00'}, 'E8:E12');
        spreadsheet.addInvalidHighlight('A8:E12');

    }
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);