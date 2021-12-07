import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';
let taskModeData: object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual' : true,
        'Children': [
             { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40' },
             { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/05/2017'),
        'EndDate': new Date('03/09/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
             { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40' },
             { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40', },
             { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
             'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
             { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40' },
             { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', },
             { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', },
             { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40' }
        ]
    }
];

let gantt: Gantt = new Gantt({
    dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            endDate: 'EndDate',
            dependency: 'Predecessor',
            child: 'Children',
            manual: 'isManual',
        },
        taskMode : 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' }, 
            { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
        'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
        toolbarClick: (args?: ClickEventArgs) => {
            if (args.item.id === 'ganttContainer_excelexport') {
                gantt.excelExport();
            } else if (args.item.id === 'ganttContainer_csvexport') {
                gantt.csvExport();
            } else if (args.item.id === 'ganttContainer_pdfexport') {
                gantt.pdfExport();
            }
        },
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
           // columnIndex: 4
        },
        selectionSettings: {
            mode: 'Row',
            type: 'Single',
            enableToggle: false
        },
        tooltipSettings: {
            showTooltip: true
        },
        allowFiltering: true,
        columns: [
            { field: 'TaskID', visible: true},
            {field: 'TaskName'},
            { field: 'isManual'},
            {field: 'StartDate'},
            {field: 'Duration'},
            {field: 'Progress'}
        ],
        validateManualTasksOnLinking: true,
        treeColumnIndex: 1,
        allowReordering: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        timelineSettings: {
            showTooltip: true,
            topTier: {
                unit: 'Week',
                format: 'dd/MM/yyyy'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        gridLines: "Both",
        showColumnMenu: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
});

gantt.appendTo('#ganttContainer'); 

let addBtn: Button = new Button();
addBtn.appendTo('#addRow');
document.getElementById('addRow').addEventListener('click', () => 
{
    let record: Object = {
        TaskID: 10,
        TaskName: 'Identify Site location',
        StartDate: new Date('03/02/2019'),
        Duration: 3,
        Progress: 50
    };
    gantt.editModule.addRecord(record, 'Below', 2);
});

let updateBtn: Button = new Button();
updateBtn.appendTo('#updateRecord');
document.getElementById('updateRecord').addEventListener('click', () => 
{
  let data: Object = {
    TaskID: 3,
    TaskName: 'Updated by index value',
    StartDate: new Date('02/24/2019'),
    Duration: 4,
    Progress: 50
  };
 gantt.updateRecordByID(data);
});

let delBtn: Button = new Button();
delBtn.appendTo('#deleteRecord');
document.getElementById('deleteRecord').addEventListener('click', () =>
{
 gantt.editModule.deleteRecord(getValue('TaskID', gantt.selectionModule.getSelectedRecords()[0]));
});

let ind: Button = new Button();
ind.appendTo('#indent');
let out: Button = new Button();
out.appendTo('#outdent');
document.getElementById('indent').addEventListener('click', () => {
   gantt.indent();
});
document.getElementById('outdent').addEventListener('click', () => {
   gantt.outdent();
});

let reorderMultipleCols: Button = new Button();
reorderMultipleCols.appendTo('#reorderMultipleCols');
document.getElementById('reorderMultipleCols').addEventListener('click', () => {
gantt.reorderColumns('TaskName', 'Progress');
});

let show: Button = new Button();
show.appendTo('#show');
let hide: Button = new Button();
hide.appendTo('#hide');
document.getElementById('show').addEventListener('click', () => {
   gantt.showColumn(['TaskName', 'Duration']);
});
document.getElementById('hide').addEventListener('click', () => {
   gantt.hideColumn(['TaskName', 'Duration']);
});

let selectBtn: Button = new Button();
selectBtn.appendTo('#selectRow');
document.getElementById('selectRow').addEventListener('click', () => {
gantt.selectionModule.selectRow(2); 
});

let selBtn: Button = new Button();
selBtn.appendTo('#selectRows');
document.getElementById('selectRows').addEventListener('click', () => {
gantt.selectionModule.selectRows([1, 2, 3]); 
});

let cellBtn: Button = new Button();
cellBtn.appendTo('#selectCell');
document.getElementById('selectCell').addEventListener('click', () => {
gantt.selectionModule.selectCell({ cellIndex: 1, rowIndex: 1 });
});

let clrBtn: Button = new Button();
clrBtn.appendTo('#clearSelection');
document.getElementById('clearSelection').addEventListener('click', () => {
gantt.clearSelection(); 
});

let sortBtn: Button = new Button();
sortBtn.appendTo('#sortColumn');
document.getElementById('sortColumn').addEventListener('click', () => {
gantt.sortModule.sortColumn('TaskName', "Descending", false)
});

let clrBtn1: Button = new Button();
clrBtn1.appendTo('#clearSorting');
document.getElementById('clearSorting').addEventListener('click', () => {
gantt.clearSorting();
});

let filterBtn: Button = new Button();
filterBtn.appendTo('#filter');
document.getElementById('filter').addEventListener('click', () => {
gantt.filterByColumn('TaskName', 'startswith', 'Iden');
});

let filterBtn1: Button = new Button();
filterBtn1.appendTo('#clearFilter');
document.getElementById('clearFilter').addEventListener('click', () => {
gantt.clearFiltering();
});    

let searchBtn: Button = new Button();
searchBtn.appendTo('#search');
document.getElementById('search').addEventListener('click', () => {
let searchText: string = (<HTMLInputElement>document.getElementsByClassName('searchtext')[0]).value;
gantt.search(searchText);
});

let clearBtn: Button = new Button();
clearBtn.appendTo('#clear');
document.getElementById('clear').addEventListener('click', () => {
gantt.searchSettings.key='';
});

let emptyBtn: Button = new Button();
emptyBtn.appendTo('#empty');
document.getElementById('empty').addEventListener('click', () => {
gantt.dataSource = [];
});