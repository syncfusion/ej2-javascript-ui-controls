import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { PivotView } from '../src/pivotview/base/pivotview';
import { VirtualScroll } from '../src/pivotview/actions/virtualscroll';
import { FieldList } from '../src/common/actions/field-list';
import { GroupingBar } from '../src/common/grouping-bar/grouping-bar';
import { Toolbar } from '../src/common/popups/toolbar';
import { PDFExport } from '../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../src/pivotview/actions/excel-export';
import { DrillThrough } from '../src/pivotview/actions/drill-through';
import { CalculatedField } from '../src/common/calculatedfield/calculated-field';
import { PivotChart } from '../src/pivotchart/index';
import { ConditionalFormatting } from '../src/common/conditionalformatting/conditional-formatting';
import { IDataSet } from '../src/base/engine';

import { pivot_dataset } from './data';
import '../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(VirtualScroll, FieldList, GroupingBar, Toolbar, PDFExport, ExcelExport, DrillThrough, CalculatedField, PivotChart, ConditionalFormatting);

let pivotView: PivotView;
let date1: number;
let date2: number;
let date3: number;
let flag: boolean = true;

document.getElementById('render').addEventListener('click', renderPivot);
document.getElementById('destroy').addEventListener('click', destoryPivot);

function renderPivot(): void {
    pivotView = new PivotView({
        dataSourceSettings: {
            dataSource: pivot_dataset as IDataSet[],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            formatSettings: [
                { name: 'international_students', format: 'N0' },
                { name: 'faculty_count', format: 'N0' }
            ],
        },
        enableVirtualization: true,
        showGroupingBar: true,
        showFieldList: true,
        showToolbar: true,
        toolbar: ['Grid', 'Chart', 'Export', 'Formatting', 'FieldList'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowDrillThrough: true,
        allowCalculatedField: true,
        allowConditionalFormatting: true,
        width: '100%',
        height: 600,
        actionBegin: function (args?: any) {
            if (args.requestType === 'sorting') {
                date3 = new Date().getTime();
            }

        },
        actionComplete: function (args?: any) {
            if (args.requestType === 'sorting') {
                if (date3) {
                    const dateAction: number = new Date().getTime();
                    document.getElementById('performanceTime1').innerHTML = 'Action Time Taken: ' + (dateAction - date3) + 'ms';
                }
            }
        },
        dataBound: hide
    });
    pivotView.appendTo('#PivotView');
}

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryPivot(): void {
    if (pivotView && !pivotView.isDestroyed) {
        pivotView.destroy();
    }
}