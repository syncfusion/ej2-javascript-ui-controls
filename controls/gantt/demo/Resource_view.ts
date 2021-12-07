import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';

let resourcesData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];
 
let resourceCollection: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
];

let gantt: Gantt = new Gantt({
    dataSource: resourcesData,
    resources: resourceCollection,
    viewType: 'ResourceView',
    showOverAllocation: true,
    enableContextMenu: true,
    allowSorting: true,
    allowReordering: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        resourceInfo: 'resources',
        work: 'work',
        child: 'subtasks'
    },
    resourceFields: {
        id: 'resourceId',
        name: 'resourceName',
        unit: 'resourceUnit',
        group: 'resourceGroup'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', visible: false },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        { field: 'work', headerText: 'Work' },
        { field: 'Progress' },
        { field: 'resourceGroup', headerText: 'Group' },
        { field: 'StartDate' },
        { field: 'Duration' },
    ],
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' },'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',  'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
   
    toolbarClick: (args: ClickEventArgs) => {
        if (args.item.id === 'showhidebar') {
            gantt.showOverAllocation = gantt.showOverAllocation ? false : true;
        }
    },
    labelSettings: {
        rightLabel: 'resources',
        taskLabel: 'Progress'
    },
    splitterSettings: {
        columnIndex: 3
    },
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
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
    eventMarkers: [
        {
            day: '04/17/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/04/2019",
        to: "04/05/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    }],
    readOnly: false,
   //gridLines: "Both",
    allowRowDragAndDrop: true,
    allowResizing: true,
    allowFiltering: true,
    allowSelection: true,
    highlightWeekends: true,
    treeColumnIndex: 1,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    projectStartDate: new Date('03/28/2019'),
    projectEndDate: new Date('05/18/2019')
});

gantt.appendTo('#ganttContainer');

let addBtn: Button = new Button();
addBtn.appendTo('#addRow');
document.getElementById('addRow').addEventListener('click', () => 
{
    let record: Object = {
        TaskID: 10,
        TaskName: 'Identify Site',
        StartDate: new Date('04/02/2019'),
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
    StartDate: new Date('04/02/2019'),
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



