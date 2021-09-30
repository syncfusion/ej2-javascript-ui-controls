import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';
let selfData: object[] = [
    {
        taskID: '1',
        taskName: 'Project Schedule',
        startDate: new Date('02/04/2019'),
        endDate: new Date('03/10/2019')
    },
    {
        taskID: '2',
        taskName: 'Planning',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        parentID: 1
    },
    {
        taskID: '3',
        taskName: 'Plan timeline',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '60',
        parentID: 2
    },
    {
        taskID: '4',
        taskName: 'Plan budget',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '90',
        parentID: 2
    },
    {
        taskID: '5',
        taskName: 'Allocate resources',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '75',
        parentID: 2
    },
    {
        taskID: '6',
        taskName: 'Planning complete',
        startDate: new Date('02/06/2019'),
        endDate: new Date('02/10/2019'),
        duration: 0,
        predecessor: '3FS,4FS,5FS',
        parentID: 2
    },
    {
        taskID: '7',
        taskName: 'Design',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/17/2019'),
        parentID: 1,
    },
    {
        taskID: '8',
        taskName: 'Software Specification',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '60',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: '9',
        taskName: 'Develop prototype',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '100',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: '10',
        taskName: 'Get approval from customer',
        startDate: new Date('02/16/2019'),
        endDate: new Date('02/17/2019'),
        duration: 2,
        progress: '100',
        predecessor: '9FS',
        parentID: 7,
    },
    {
        taskID: '11',
        taskName: 'Design complete',
        startDate: new Date('02/17/2019'),
        endDate: new Date('02/17/2019'),
        duration: 0,
        predecessor: '10FS',
        parentID: 7,
    }
];

let gantt: Gantt = new Gantt({
    dataSource: selfData,
            height: '450px',
            highlightWeekends: true,
            allowSelection: true,
            treeColumnIndex: 1,
         //   allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            taskFields: {
                id: 'taskID',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                progress: 'progress',
                dependency: 'predecessor',
                parentID: 'parentID'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
                { field: 'predecessor' },
                { field: 'progress' },
            ],
            sortSettings: {
                columns: [{ field: 'taskID', direction: 'Ascending' }, 
                { field: 'taskName', direction: 'Ascending' }]
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
            selectedRowIndex: 1,
            splitterSettings: {
                position: "50%",
               // columnIndex: 4
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Single',
                enableToggle: true
            },
            tooltipSettings: {
                showTooltip: true
            },
            filterSettings: {
                type: 'Menu'
            },
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
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
            eventMarkers: [
                {
                    day: '02/22/2019',
                    cssClass: 'e-custom-event-marker',
                    label: 'Project approval and kick-off'
                }
            ],
            holidays: [{
                from: "02/27/2019",
                to: "02/28/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            
            },
            {
                from: "01/30/2019",
                to: "01/30/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            
            }],
            searchSettings:
             { fields: ['taskName', 'duration'] 
            },
            labelSettings: {
                leftLabel: 'taskID',
                rightLabel: 'Task Name: ${taskData.taskName}',
                taskLabel: '${progress}%'
            },
            allowResizing: true,
            readOnly: false,
            taskbarHeight: 20,
            rowHeight: 40,
            allowUnscheduledTasks: true,
          //  connectorLineBackground: "red",
          //  connectorLineWidth: 3,
            projectStartDate: new Date('01/28/2019'),
            projectEndDate: new Date('03/10/2019')
});

gantt.appendTo('#ganttContainer');

let addBtn: Button = new Button();
addBtn.appendTo('#addRow');
document.getElementById('addRow').addEventListener('click', () => 
{
    let record: Object = {
        taskID: 10,
        taskName: 'Identify Site location',
        StartDate: new Date('02/05/2019'),
        duration: 3,
        Progress: 50
    };
    gantt.editModule.addRecord(record, 'Below', 2);
});

let updateBtn: Button = new Button();
updateBtn.appendTo('#updateRecord');
document.getElementById('updateRecord').addEventListener('click', () => 
{
  let data: Object = {
    taskID: 3,
    taskName: 'Updated by index value',
    StartDate: new Date('02/05/2019'),
    duration: 4,
    progress: 50
  };
 gantt.updateRecordByID(data);
});

let delBtn: Button = new Button();
delBtn.appendTo('#deleteRecord');
document.getElementById('deleteRecord').addEventListener('click', () =>
{
 gantt.editModule.deleteRecord(getValue('taskID', gantt.selectionModule.getSelectedRecords()[0]));
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
gantt.reorderColumns('taskName', 'progress');
});

let show: Button = new Button();
show.appendTo('#show');
let hide: Button = new Button();
hide.appendTo('#hide');
document.getElementById('show').addEventListener('click', () => {
   gantt.showColumn(['taskName', 'duration']);
});
document.getElementById('hide').addEventListener('click', () => {
   gantt.hideColumn(['taskName', 'duration']);
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
gantt.sortModule.sortColumn('taskName', "Descending", false)
});

let clrBtn1: Button = new Button();
clrBtn1.appendTo('#clearSorting');
document.getElementById('clearSorting').addEventListener('click', () => {
gantt.clearSorting();
});

let filterBtn: Button = new Button();
filterBtn.appendTo('#filter');
document.getElementById('filter').addEventListener('click', () => {
gantt.filterByColumn('taskName', 'startswith', 'Iden');
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



