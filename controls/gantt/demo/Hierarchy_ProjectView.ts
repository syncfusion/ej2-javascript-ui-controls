import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';
let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ] 
            },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        },
        {
            TaskID: 13,
            TaskName: 'Product Design and Development',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 },
                { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
                { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
                { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
                {
                    TaskID: 18,
                    TaskName: 'Define cost plan',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Progress: 30 },
                        { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                    ]
                },
                {
                    TaskID: 21,
                    TaskName: 'Development of the final design',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                        { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                        { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                    ]
                },
                { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 },
                { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
            ]
        },
        { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12,Progress: 30 },
        { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
        { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9 ,Progress: 30},
        { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
        {
            TaskID: 31,
            TaskName: 'Feedback and Testing',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
                { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 }
            ]
        },
        {
            TaskID: 34,
            TaskName: 'Product Development',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 }
            ]
        },
        {
            TaskID: 37,
            TaskName: 'Final Product',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
                { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 }
            ]
        }
    ];

let gantt: Gantt = new Gantt({
    dataSource: projectNewData,
    allowSorting: true,
    allowReordering: true,
    enableContextMenu: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
        child: 'subtasks',
        indicators: 'Indicators'
    },
    renderBaseline: true,
    baselineColor: 'red',
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', headerText: 'Task ID' },
        { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
        { field: 'Duration', headerText: 'Duration', allowEditing: false },
        { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
        { field: 'CustomColumn', headerText: 'CustomColumn' }
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
    allowUnscheduledTasks: true,
  //  connectorLineBackground: "red",
  //  connectorLineWidth: 3,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
});

gantt.appendTo('#ganttContainer');

let addBtn: Button = new Button();
addBtn.appendTo('#addRow');
document.getElementById('addRow').addEventListener('click', () => 
{
    let record: Object = {
        TaskID: 10,
        TaskName: 'Identify Site location',
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