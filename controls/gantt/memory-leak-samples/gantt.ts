import { Gantt } from '../src/gantt/base/gantt';
import { Toolbar } from '../src/gantt/actions/toolbar';
import { Selection } from '../src/gantt/actions/selection';
import { ExcelExport } from '../src/gantt/actions/excel-export';
import { PdfExport } from '../src/gantt/actions/pdf-export';
import { DayMarkers } from '../src/gantt/actions/day-markers';
import { ContextMenu } from '../src/gantt/actions/context-menu';
import { Edit } from '../src/gantt/actions/edit';
import { RowDD } from '../src/gantt/actions/rowdragdrop';
import { Filter } from '../src/gantt/actions/filter';
import { Sort } from '../src/gantt/actions/sort';
import { VirtualScroll } from '../src/gantt/actions/virtual-scroll';
import { CriticalPath } from '../src/gantt/actions/critical-path';
import { UndoRedo } from '../src/gantt/actions/undo-redo';
import { Resize, Reorder } from '@syncfusion/ej2-treegrid';

Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Resize, VirtualScroll, UndoRedo, Reorder, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, CriticalPath);
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { virtualData } from "./data";

let gantt: Gantt;
let date1: number;
let date2: number;
let date3: number;
let flag: boolean = true;

document.getElementById('render').addEventListener('click', renderGantt);
document.getElementById('destroy').addEventListener('click', destoryGantt);

function renderGantt(): void {
    gantt = new Gantt({
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
            parentID: 'parentID',
            baselineStartDate: 'BaselineStartDate',
            baselineEndDate: 'BaselineEndDate',
            indicators: 'Indicators'
        },
        enableCriticalPath: true,
        enableVirtualization: true,
        enableTimelineVirtualization: true,
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
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        enableUndoRedo: true,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
       'Indent', 'Outdent', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport', 'Undo', 'Redo'],
        toolbarClick: (args: ClickEventArgs) => {
            if (args.item.id === 'Gantt_excelexport') {
                gantt.excelExport();
            } else if (args.item.id === 'Gantt_csvexport') {
                gantt.csvExport();
            } else if (args.item.id === 'Gantt_pdfexport') {
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
        selectedRowIndex:1,
        highlightWeekends: true,
        allowFiltering: true,
        gridLines: 'Both',
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
        height: '550px',
        searchSettings: {
            fields: ['TaskName', 'Duration'] 
        },
        labelSettings: {
            rightLabel: 'TaskName',
            taskLabel: 'Progress',
            leftLabel: 'TaskID'
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
        renderBaseline: true,
        baselineColor: 'red',
        allowResizing: true,
        taskbarHeight: 20,
        rowHeight: 40,
        readOnly: false,
        allowUnscheduledTasks: true,
        splitterSettings: {
            position: "50%"
        },
        created: function () {
            date1 = new Date().getTime();
        },
        actionBegin: function (args?: any) {
            if (args.requestType === 'sorting' || args.requestType === 'filtering' || args.requestType === 'searching' ||
                args.requestType === 'reorder') {
                date3 = new Date().getTime();
            }
        },
        actionComplete: function (args?: any) {
            if (args.requestType === 'sorting' || args.requestType === 'filtering' || args.requestType === 'searching'
                || args.requestType === 'reorder') {
                if (date3) {
                    const dateAction: number = new Date().getTime();
                    document.getElementById('performanceTime1').innerHTML = 'Action Time Taken: ' + (dateAction - date3) + 'ms';
                }
            }
        },
        dataBound: hide
    });
    
    gantt.appendTo('#Gantt'); 
}

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryGantt(): void {
    if (gantt) {
        document.getElementById('render').removeEventListener('click', renderGantt);
        document.getElementById('destroy').removeEventListener('click', destoryGantt);
 
        // Ensure Gantt instance is properly destroyed
        if (!gantt.isDestroyed) {
            gantt.destroy();
        }
 
        // Remove any lingering references
        gantt = null;
    }
    const ganttElement = document.getElementById('Gantt');
    if (ganttElement) {
        ganttElement.innerHTML = ''; // Clear inner elements
        ganttElement.remove(); // Remove from DOM
    }
}
