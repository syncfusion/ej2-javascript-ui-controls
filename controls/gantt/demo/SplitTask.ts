import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';

let splitTasksData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '60',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 2 },
                            { StartDate: new Date('02/05/2019'), Duration: 5 },
                            { StartDate: new Date('02/08/2019'), Duration: 3 }
                          ]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '90'
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '75',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 4 },
                            { StartDate: new Date('02/08/2019'), Duration: 2 }
                          ]
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                        Duration: 0, Predecessor: '3FS,5FS'
                    },
                ]
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/25/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '60', Predecessor: '6FS'
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '100', Predecessor: '6FS',
                        Segments: [
                            { StartDate: new Date('02/25/2019'), Duration: 2 },
                            { StartDate: new Date('02/28/2019'), Duration: 3 }
                          ]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                        EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                        Duration: 0, Predecessor: '10FS'
                    }
                ]
            }
        ]
    }
];

let gantt: Gantt = new Gantt({
    dataSource: splitTasksData,
    allowSorting: true,
    allowReordering: true,
    enableContextMenu: true,
    enableVirtualization: false,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        segments: 'Segments'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
        { field: 'Progress' },
        { field: 'Predecessor' }
    ],
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
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
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
    filterSettings: {
        type: 'Menu'
    },
    allowFiltering: true,
    gridLines: "Both",
    showColumnMenu: true,
    highlightWeekends: true,
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
            day: '04/10/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/04/2019",
        to: "04/05/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    },
    {
        from: "04/12/2019",
        to: "04/12/2019",
        label: " Public holiday",
        cssClass: "e-custom-holiday"
    
    }],
    searchSettings:
     { fields: ['TaskName', 'Duration'] 
    },
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'Task Name: ${taskData.TaskName}',
        taskLabel: '${Progress}%'
    },
    allowResizing: true,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    projectStartDate: new Date('01/30/2019'),
    projectEndDate: new Date('03/04/2019')
});

gantt.appendTo('#ganttContainer'); 

let addBtn: Button = new Button();
addBtn.appendTo('#addRow');
document.getElementById('addRow').addEventListener('click', () => 
{
    let record: Object = {
        TaskID: 10,
        TaskName: 'Identify Site location',
        StartDate: new Date('02/02/2019'),
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
    StartDate: new Date('02/02/2019'),
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