import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Resize, VirtualScroll, Reorder, Sort, RowDD, ContextMenu, ExcelExport, PdfExport} from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Resize, VirtualScroll, Reorder, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { getValue } from  '@syncfusion/ej2-base';
let tempData: any[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        parentID: 0
    },
    {
        TaskID: 2,
        TaskName: 'Defining the product and its usage',
        StartDate: new Date('04/02/2019'),
        Duration: 3,
        Progress: 30,
        parentID: 1
    },
    {
        TaskID: 3,
        TaskName: 'Defining target audience',
        StartDate: new Date('04/02/2019'),
        parentID: 1,
        Duration: 3
    },
    {
        TaskID: 4,
        TaskName: 'Prepare product sketch and notes',
        StartDate: new Date('04/05/2019'),
        Duration: 2,
        parentID: 1,
        Progress: 30
    },
    {
        TaskID: 5,
        TaskName: 'Concept approval',
        StartDate: new Date('04/08/2019'),
        parentID: 0,
        Duration: 0
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 7,
        TaskName: 'Demand analysis',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        parentID: 6
    },
    {
        TaskID: 8,
        TaskName: 'Customer strength',
        StartDate: new Date('04/09/2019'),
        Duration: 4,
        parentID: 7,
        Progress: 30
    },
    {
        TaskID: 9,
        TaskName: 'Market opportunity analysis',
        StartDate: new Date('04/09/2019'),
        Duration: 4,
        parentID: 7
    },
    {
        TaskID: 10,
        TaskName: 'Competitor analysis',
        StartDate: new Date('04/15/2019'),
        Duration: 4,
        parentID: 6,
        Progress: 30
    },
    {
        TaskID: 11,
        TaskName: 'Product strength analsysis',
        StartDate: new Date('04/15/2019'),
        Duration: 4,
        parentID: 6
    },
    {
        TaskID: 12,
        TaskName: 'Research complete',
        StartDate: new Date('04/18/2019'),
        Duration: 0,
        parentID: 6
    },
    {
        TaskID: 13,
        TaskName: 'Product design and development',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 14,
        TaskName: 'Functionality design',
        StartDate: new Date('04/19/2019'),
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 15,
        TaskName: 'Quality design',
        StartDate: new Date('04/19/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 16,
        TaskName: 'Define reliability',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 13
    },
    {
        TaskID: 17,
        TaskName: 'Identifying raw materials',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        parentID: 13
    },
    {
        TaskID: 18,
        TaskName: 'Define cost plan',
        StartDate: new Date('04/04/2019'),
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 19,
        TaskName: 'Manufacturing cost',
        StartDate: new Date('04/26/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 18
    },
    {
        TaskID: 20,
        TaskName: 'Selling cost',
        StartDate: new Date('04/26/2019'),
        Duration: 2,
        parentID: 18
    },
    {
        TaskID: 21,
        TaskName: 'Development of the final design',
        StartDate: new Date('04/30/2019'),
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 22,
        TaskName: 'Defining dimensions and package volume',
        StartDate: new Date('04/30/2019'),
        Duration: 2,
        parentID: 21,
        Progress: 30
    },
    {
        TaskID: 23,
        TaskName: 'Develop design to meet industry standards',
        StartDate: new Date('05/02/2019'),
        Duration: 2,
        parentID: 21
    },
    {
        TaskID: 24,
        TaskName: 'Include all the details',
        StartDate: new Date('05/06/2019'),
        Duration: 3,
        parentID: 21
    },
    {
        TaskID: 25,
        TaskName: 'CAD computer-aided design',
        StartDate: new Date('05/09/2019'),
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 26,
        TaskName: 'CAM computer-aided manufacturing',
        StartDate: new Date('09/14/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 27,
        TaskName: 'Design complete',
        StartDate: new Date('05/16/2019'),
        Duration: 0,
        parentID: 13
    },
    {
        TaskID: 28,
        TaskName: 'Prototype testing',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 29,
        TaskName: 'Include feedback',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        parentID: 0
    },
    {
        TaskID: 30,
        TaskName: 'Manufacturing',
        StartDate: new Date('05/23/2019'),
        Duration: 5,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 31,
        TaskName: 'Assembling materials to finsihed goods',
        StartDate: new Date('05/30/2019'),
        Duration: 5,
        parentID: 0
    },
    {
        TaskID: 32,
        TaskName: 'Feedback and testing',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 33,
        TaskName: 'Internal testing and feedback',
        StartDate: new Date('06/06/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 45
    },
    {
        TaskID: 34,
        TaskName: 'Customer testing and feedback',
        StartDate: new Date('06/11/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 50
    },
    {
        TaskID: 35,
        TaskName: 'Final product development',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 36,
        TaskName: 'Important improvements',
        StartDate: new Date('06/14/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 37,
        TaskName: 'Address any unforeseen issues',
        StartDate: new Date('06/14/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 38,
        TaskName: 'Final product',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 39,
        TaskName: 'Branding product',
        StartDate: new Date('06/20/2019'),
        Duration: 4,
        parentID: 38
    },
    {
        TaskID: 40,
        TaskName: 'Marketing and presales',
        StartDate: new Date('06/26/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 38
    }
];

let virtualData: any[] = [];
let projId: number = 1;
for (let i: number = 0; i < 50; i++) {
    let x: number = virtualData.length + 1;
    let parent: any = {};
    /* tslint:disable:no-string-literal */
    parent['TaskID'] = x;
    parent['TaskName'] = 'Project' + (projId++);
    virtualData.push(parent);
    for (let j: number = 0; j < tempData.length; j++) {
        let subtasks: any = {};
        /* tslint:disable:no-string-literal */
        subtasks['TaskID'] = tempData[j].TaskID + x;
        subtasks['TaskName'] = tempData[j].TaskName;
        subtasks['StartDate'] = tempData[j].StartDate;
        subtasks['Duration'] = tempData[j].Duration;
        subtasks['Progress'] = tempData[j].Progress;
        subtasks['parentID'] = tempData[j].parentID + x;
        virtualData.push(subtasks);
    }
}

let gantt: Gantt = new Gantt({
    dataSource: virtualData,
        treeColumnIndex: 1,
        allowSorting: true,
        showOverAllocation: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            parentID: 'parentID'
        },
        enableVirtualization: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        allowReordering: true,
        enableContextMenu: true,
        columns: [
            { field: 'TaskID' },
            { field: 'TaskName' },
            { field: 'StartDate' },
            { field: 'Duration' },
            { field: 'Progress' },
        ],
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Indent', 'Outdent', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
    
    toolbarClick: (args: ClickEventArgs) => {
        if (args.item.id === 'showhidebar') {
            gantt.showOverAllocation = gantt.showOverAllocation ? false : true;
        }
        else if (args.item.id === 'ganttContainer_excelexport') {
            gantt.excelExport();
        } else if (args.item.id === 'ganttContainer_csvexport') {
            gantt.csvExport();
        } else if (args.item.id === 'ganttContainer_pdfexport') {
            gantt.pdfExport();
        }
    },
    allowExcelExport: true,
    allowPdfExport: true,
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    allowSelection: true,
    allowRowDragAndDrop: true,
    highlightWeekends: true,
    allowFiltering: true,
    gridLines: 'Both',
    height: '550px',
    labelSettings: {
        rightLabel: 'resources',
        taskLabel: 'Progress'
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
    allowResizing: true,
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
    },
    taskbarHeight: 20,
    rowHeight: 40,
    splitterSettings: {
        columnIndex: 3
    },
});

gantt.appendTo('#ganttContainer'); 

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