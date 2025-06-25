import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
import { TreeGrid } from '../src/treegrid/base/treegrid';
import { VirtualScroll } from "../src/treegrid/actions/virtual-scroll";
import { InfiniteScroll } from "../src/treegrid/actions/infinite-scroll";
import { Page } from '../src/treegrid/actions/page';
import { RowDD } from '../src/treegrid/actions/rowdragdrop';
import { Filter } from '../src/treegrid/actions/filter';
import { Sort } from '../src/treegrid/actions/sort';
import { Reorder } from '../src/treegrid/actions/reorder';
import { ColumnChooser } from '../src/treegrid/actions/column-chooser';
import { Selection } from '../src/treegrid/actions/selection';
import { Toolbar } from "../src/treegrid/actions/toolbar";
import { DetailRow } from '../src/treegrid/actions/detail-row';
import { Freeze } from "../src/treegrid/actions/freeze-column";
import { Edit } from '../src/treegrid/actions/edit';
import { ColumnMenu } from "../src/treegrid/actions/column-menu";
import { CommandColumn } from "../src/treegrid//actions/command-column";
import { PdfExport } from "../src/treegrid/actions/pdf-export";
import { ExcelExport } from "../src/treegrid/actions/excel-export";
import { Resize } from '../src/treegrid/actions/resize';
import { Aggregate } from "../src/treegrid/actions/summary";
import { ContextMenu } from "../src/treegrid/actions/context-menu";
import { virtualData, dataSource } from './data';

TreeGrid.Inject(VirtualScroll, InfiniteScroll, ContextMenu, Filter, Edit, Page, Reorder, Toolbar, DetailRow, Freeze, Sort, CommandColumn, Resize, Aggregate, ColumnChooser, RowDD, Selection, PdfExport, ColumnMenu, ExcelExport);

let treegrid: TreeGrid;
let date1: number;
let date2: number;
let date3: number;
let date4: number;
let date5: number;
let flag: boolean = true;

document.getElementById('render').addEventListener('click', renderTreeGrid);
document.getElementById('destroy').addEventListener('click', destoryTreeGrid);

function renderTreeGrid(): void {
    if (!virtualData.length) {
        dataSource();
    }
    treegrid = new TreeGrid(
        {
            dataSource: virtualData,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            enableVirtualization: true,
            enableVirtualMaskRow: true,
            height: 400,
            editSettings: { allowEditing: true, allowDeleting: true, mode: 'Row', newRowPosition: 'Top' },
            toolbar: [
            'Add',
            'Edit',
            'Delete',
            'Update',
            'Cancel',
            'Indent',
            'Outdent',
            'Print',
            'Search',
            'ColumnChooser',
            'ExcelExport',
            'PdfExport',
            'CsvExport'
            ],
            contextMenuItems: [
            'AutoFit',
            'AutoFitAll',
            'SortAscending',
            'SortDescending',
            'Edit',
            'Delete',
            'Save',
            'Cancel',
            'PdfExport',
            'ExcelExport',
            'CsvExport',
            'FirstPage',
            'PrevPage',
            'LastPage',
            'NextPage',
            'Indent',
            'Outdent'
            ],
            pageSettings: { pageSize: 100 },
            allowFiltering: true,
            allowSorting: true,
            allowRowDragAndDrop: true,
            frozenColumns: 2,
            showColumnChooser: true,
            showColumnMenu: true,
            autoCheckHierarchy: true,
            filterSettings: { type: 'Excel' },
            allowReordering: true,
            created: function () {
                date1 = new Date().getTime();
            },
            actionBegin: function (args?: any) {
                if (args.requestType === 'sorting' || args.requestType === 'filtering' || args.requestType === 'searching' ||
                    args.requestType === 'reorder' || args.requestType === 'paging') {
                    date3 = new Date().getTime();
                }
            },
            actionComplete: function (args?: any) {
                if (args.requestType === 'sorting' || args.requestType === 'filtering' || args.requestType === 'searching' ||
                    args.requestType === 'reorder' || args.requestType === 'paging') {
                    if (date3) {
                        const dateAction: number = new Date().getTime();
                        document.getElementById('performanceTime1').innerHTML = args.requestType + 'Time Taken: ' + (dateAction - date3) + 'ms';
                    }
                }
            },
            expanding: function () {
                date4 = new Date().getTime();
            },
            expanded: function () {
                if (date4) {
                    const dateAction: number = new Date().getTime();
                    document.getElementById('performanceTime1').innerHTML = 'Expand Time Taken: ' + (dateAction - date4) + 'ms';
                }
            },
            collapsing: function () {
                date5 = new Date().getTime();
            },
            collapsed: function () {
                if (date5) {
                    const dateAction: number = new Date().getTime();
                    document.getElementById('performanceTime1').innerHTML = 'Collapse Time Taken: ' + (dateAction - date5) + 'ms';
                }
            },
            columns: [
                { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, textAlign: 'Right', validationRules: { required: true, number: true }, width: 20 },
                { field: 'FIELD1', headerText: 'Player Name', editType: 'stringedit', showCheckbox: true, width: 50, validationRules: { required: true } },
                { field: 'FIELD2', headerText: 'Year', textAlign: 'Right', width: 40, editType: 'numericedit', validationRules: { number: true, min: 0 } },
                { field: 'FIELD3', headerText: 'Stint', textAlign: 'Right', width: 40, editType: 'numericedit', validationRules: { number: true, min: 0 }, edit: { params: { format: 'n' } } },
                { field: 'FIELD4', headerText: 'TMID', width: 50, textAlign: 'Right', template: '#This is column template' }
            ],
            dataBound: hide
        });
    treegrid.appendTo('#TreeGrid');
    treegrid.toolbarClick = (args?: any) => {
        if (args.item.id === treegrid.grid.element.id + '_excelexport') {
            treegrid.excelExport();
        } else if (args.item.id === treegrid.grid.element.id + '_pdfexport') {
            treegrid.pdfExport(); }
        else if (args.item.id === treegrid.grid.element.id + '_csvexport') {
            treegrid.csvExport();
        }
      };
}

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Initial Load Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryTreeGrid(): void {
    if (treegrid && !treegrid.isDestroyed) {
        treegrid.destroy();
        treegrid = null;
        flag = true;
        document.getElementById('performanceTime').innerHTML = 'Initial Load Time Taken: 0 ms';
        document.getElementById('performanceTime1').innerHTML = 'TreeGrid Action Taken Time: 0 ms';
    }
}