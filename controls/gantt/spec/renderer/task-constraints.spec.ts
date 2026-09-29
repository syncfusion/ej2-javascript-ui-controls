/**
  * Gantt base spec
  */
import { Gantt, DayMarkers , Selection, Edit} from '../../src/index';
import { constraintsData, dialogEditDataSB, projectNewData, MT1014886 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Task constraints', () => {
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Initial load ', () => {
            expect(ganttObj.flatData[0]['ConstraintType']).toBe(0);
            expect(ganttObj.flatData[0]['ConstraintDate']).toBe(null);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Testing getDateByConstraint by constraint', () => {
            // expect(ganttObj.dateValidationModule.getDateByConstraint(ganttObj.flatData[15].ganttProperties, new Date('05/28/2025')).toDateString()).toBe('Mon Mar 25 2019');
            // expect(ganttObj.dateValidationModule.getDateByConstraint(ganttObj.flatData[16].ganttProperties, new Date('05/28/2025')).toDateString()).toBe('Mon May 27 2019');
            expect(ganttObj.dateValidationModule.getDateByConstraint(ganttObj.flatData[17].ganttProperties, new Date('05/28/2025')).toDateString()).toBe('Wed Apr 17 2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Cell Edit Constraint Date', () => {
            let constraintDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(18) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(constraintDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolConstraintDate') as any).ej2_instances[0];
            input.value = new Date('04/15/2019');
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[17].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/15/2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 300);
        });
        it('Taskbar Drag Constraint Popup', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.constraintType !== 2).toBe(true)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 300);
        });
        it('Remove Dependency', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor.length === 0).toBe(true)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_RemoveDependency')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 300);
        });
        it('Cancel Action', () => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_CancelChange')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
            expect(ganttObj.flatData[2].ganttProperties.predecessor.length > 0).toBe(true);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Align date with constraint function', () => {
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintDate = new Date();
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 3;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 4;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[17];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 5;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[1];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 5;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintDate = new Date();
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 6;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'] (null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[1];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 7;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[17];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 7;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[18];
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 0;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[1];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 0;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[18];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 1;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 5;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 7;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[1];
            ganttObj.editModule.dialogModule['editedRecord'].ganttProperties.constraintType = 1;
            ganttObj.editModule.dialogModule['alignDateWithConstraint'](null, null, null, null);
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(1);
        });
        it('Opening edit dialog with constraint', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            expect(ganttObj.flatData[0].ganttProperties.constraintDate).toBe(null)
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Cell editing Constraint type', () => {
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(element, 'dblclick');
            let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
            if (constraintType) {
                let inputObj: any = constraintType.ej2_instances[0];
                inputObj.value = 4;
                inputObj.dataBind();
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
            }
            expect(ganttObj.flatData[0].ganttProperties.constraintDate != null).toBe(true);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        dateFormat: 'MMM dd, y, hh:mm a',
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType', headerText: 'ConstraintType', width:250, editType: 'dropdownedit'},
        {field: 'ConstraintDate', headerText: 'ConstraintDate', width:250},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Rendering Column with header text', () => {
            expect((ganttObj.columns[2] as any)['headerText']).toBe('ConstraintType');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        dateFormat: 'MMM dd, y, hh:mm a',
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType', headerText: 'ConstraintType', width:250, editType: 'dropdownedit'},
        {field: 'ConstraintDate', headerText: 'ConstraintDate', width:250, editType: 'datepickeredit'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Rendering Column with header text Constraint Date', () => {
            expect((ganttObj.columns[3] as any)['headerText']).toBe('ConstraintDate');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Coverage of Change Locale', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType', headerText: 'ConstraintType', width:250, editType: 'dropdownedit'},
        {field: 'ConstraintDate', headerText: 'ConstraintDate', width:250, editType: 'datepickeredit'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Covering Change locale function', () => {
            const data = [
                { ganttProperties: { predecessorsName: "1FS,2FF,3SS,4SF" } }, // multiple with commas
                { ganttProperties: { predecessorsName: "5FS,6FS" } },         // two FS
                { ganttProperties: { predecessorsName: "7SF" } },             // single no comma
                { ganttProperties: { predecessorsName: null } },              // null case
                { ganttProperties: { predecessorsName: "8SS,9FF" } }          // SS and FF
            ];
            ganttObj.treeGridModule.changeLocale(data);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType', headerText: 'ConstraintType', width:250, editType: 'dropdownedit'},
        {field: 'ConstraintDate', headerText: 'ConstraintDate', width:250, editType: 'datepickeredit'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('As soon as possible to Must Start On', () => {
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(19) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(element, 'dblclick');
            let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
            if (constraintType) {
                let inputObj: any = constraintType.ej2_instances[0];
                inputObj.value = 2;
                inputObj.dataBind();
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
            }
            expect(ganttObj.flatData[18].ganttProperties.constraintDate != null).toBe(true);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        editDialogFields: [
            { type: 'Advanced', fields: ['ConstraintType'] },
        ],
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Field in constraint', () => {
            expect(ganttObj.flatData.length).toBe(19)
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {
            field: 'ConstraintType',
            headerText: 'Constraint Type',
            valueAccessor: function (field, data, column) {
                // Assuming data.ConstraintType contains enum-like values
                var constraintMap = {
                    'StartNoEarlierThan': 'Start No Earlier Than',
                    'FinishNoEarlierThan': 'Finish No Earlier Than',
                    'MustStartOn': 'Must Start On',
                    'MustFinishOn': 'Must Finish On',
                    'AsSoonAsPossible': 'As Soon As Possible',
                    'AsLateAsPossible': 'As Late As Possible'
                };
                return '';
            }
        },
        {
            field: 'ConstraintDate',
            headerText: 'Constraint Date',
            format: { type: 'date', format: 'MM/dd/yyyy' },
            editType: 'datepickeredit',
            edit: {
                params: {
                    renderDayCell: function (args) {
                        // Disable weekends (Sunday = 0, Saturday = 6)
                        if (args.date.getDay() === 0 || args.date.getDay() === 6) {
                            args.isDisabled = true;
                        }
                    }
                }
            }
        },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Edit Params in constraint', () => {
            expect(ganttObj.flatData.length).toBe(19)
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Dialog error element', () => {
            var mockElem = document.createElement('div');
            mockElem.className = 'tooltip-container';
            var tipContent = document.createElement('div');
            tipContent.className = 'e-tip-content';
            tipContent.innerText = 'Old error text';

            mockElem.appendChild(tipContent);
            document.body.appendChild(mockElem);
            ganttObj.editModule.dialogModule['getElemTable'] = function (inputElement) {
                return mockElem;
            };
            var inputElement = document.createElement('input');
            inputElement.id = "dummyInput";

            var error = document.createElement('span');
            error.innerText = "New validation error";
            var columnName = "dummy";
            ganttObj.editModule.dialogModule['valErrorPlacement'](inputElement, error, columnName);
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('align date with constraint with element', () => {
            ganttObj.editModule.dialogModule['editedRecord'] = ganttObj.flatData[2];
            var constraintDate = {
                ej2_instances: [{
                    value: new Date('2025-06-10T08:00:00')
                }]
            };
            var constraintType = {
                ej2_instances: [{
                    value: 2
                }]
            };
            var startDateElement = {
                ej2_instances: [{
                    value: new Date('2025-06-09T08:00:00')
                }]
            };
            var endDateElement = {
                ej2_instances: [{
                    value: new Date('2025-06-15T17:00:00')
                }]
            };
            ganttObj.editModule.dialogModule['alignDateWithConstraint']((constraintDate as any), (constraintType as any), (startDateElement as any), (endDateElement as any));
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(3);
        });
        it('Open must start on dialog', () => {
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        editDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        addDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(3);
        });
        it('Open must start on dialog with field', () => {
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        editDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        addDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openAddDialog();
        });
        it('Add dialog with field', () => {
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.flatData.length > 0).toBe(true);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        editDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        addDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Covering setConstraintDateBasedOnType', () => {
            var startDate = new Date('2023-01-01');
            var endDate = new Date('2023-12-31');
            var constraintDateElement: any = { value: null };
            [
                2, // MustStartOn
                4, // StartNoEarlierThan
                5  // StartNoLaterThan
            ].forEach(function (type) {
                constraintDateElement.value = null;
                ganttObj.editModule.dialogModule['setConstraintDateBasedOnType'](
                    undefined, type, constraintDateElement, startDate, endDate
                );
            });
            [
                3, // MustFinishOn
                6, // FinishNoEarlierThan
                7  // FinishNoLaterThan
            ].forEach(function (type) {
                constraintDateElement.value = null;
                ganttObj.editModule.dialogModule['setConstraintDateBasedOnType'](
                    undefined, type, constraintDateElement, startDate, endDate
                );
            });
            [
                0, // AsSoonAsPossible
                1  // AsLateAsPossible
            ].forEach(function (type) {
                constraintDateElement.value = 'unchanged';
                ganttObj.editModule.dialogModule['setConstraintDateBasedOnType'](
                    undefined, type, constraintDateElement, startDate, endDate
                );
            });
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        editDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        addDialogFields: [
            { type: 'General', headerText: 'General', fields: ['TaskID', 'TaskName', 'isParent'] },
            { type: 'Advanced' }
        ],
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Covering updateConstraintDate', () => {
            ganttObj.editModule.dialogModule['updateConstraintDate'](ganttObj.flatData[9].ganttProperties, ganttObj.flatData[9]);
            ganttObj.editModule.dialogModule['updateConstraintDate'](ganttObj.flatData[12].ganttProperties, ganttObj.flatData[12]);
            expect(ganttObj.flatData.length).toBe(19);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    constraintType: 'ConstraintType',
                    constraintDate: 'ConstraintDate',
                    child: 'subtasks',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
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
                columns: [
                { field: 'TaskID' },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                {field : 'ConstraintType'},
                {field: 'ConstraintDate'},
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                 { field: 'Progress' },
            ],
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
                searchSettings: { fields: ['TaskName', 'Duration']
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 300);
        });
        it('Coverage for getConstraintDateElement', () => {
            ganttObj.openEditDialog(2);
            ganttObj.editModule.dialogModule['getConstraintDateElement'](ganttObj.element.id, ganttObj.taskFields.constraintDate, ganttObj.taskFields);
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            expect(ganttObj.editModule.dialogModule['getConstraintDateElement'](ganttObj.element.id,'tempcolumn',ganttObj.taskFields)).toBe(null);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    constraintType: 'ConstraintType',
                    constraintDate: 'ConstraintDate',
                    child: 'subtasks',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
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
                columns: [
                { field: 'TaskID' },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                {field : 'ConstraintType'},
                {field: 'ConstraintDate'},
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                 { field: 'Progress' },
            ],
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
                searchSettings: { fields: ['TaskName', 'Duration']
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 300);
        });
        it('Coverage for getmatchprefix', () => {
            const preData = { name: "Project-Phase1-Task3" };
            const idArray = ["Project-Phase1"];
            const preData1 = { name: "Alpha-Beta-Gamma" };
            const idArray1 = ["X", "Y-Z", "Omega"];
            expect(ganttObj.editModule.dialogModule['getMatchingPrefix'](preData, idArray)[0]).toBe('Project-Phase1');
            expect(ganttObj.editModule.dialogModule['getMatchingPrefix'](preData1, idArray1).length).toBe(0);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
});
    describe('Constraints Rendering', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: constraintsData,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
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
        columns: [
        { field: 'TaskID' },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        {field : 'ConstraintType'},
        {field: 'ConstraintDate'},
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
         { field: 'Progress' },
    ],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        // it('Opening edit dialog with constraint', () => {
        //     let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancelRecord, 'click');
        //     expect(ganttObj.flatData[0].ganttProperties.constraintDate).toBe(null)
        // });
        beforeEach((done: Function) => {
            ganttObj.openEditDialog(1);
            setTimeout(done, 500);
        });
        it('edit start date cell', () => {
            let StartDate: any = document.querySelector('#' + ganttObj.element.id + 'ConstraintType') as HTMLInputElement;
            if (StartDate) {
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ConstraintType')).ej2_instances[0];
                SD.value = new Date('03/22/2019');
                SD.dataBind();
                let save: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
                triggerMouseEvent(save, 'click');
            }
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
describe('CR-974396', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Project initiation',
                    StartDate: new Date('04/02/2024'),
                    EndDate: new Date('04/21/2024'),
                    subtasks: [
                        {
                            TaskID: 2,
                            TaskName: 'Identify site location',
                            StartDate: new Date('04/02/2024'),
                            Duration: 0,
                            Progress: 30,
                        },
                        {
                            TaskID: 3,
                            TaskName: 'Perform Soil test',
                            StartDate: new Date('04/02/2024'),
                            Duration: 4,
                            Predecessor: '2',
                        },
                        {
                            TaskID: 4,
                            TaskName: 'Soil test approval',
                            StartDate: new Date('04/02/2024'),
                            Duration: 0,
                            Predecessor: '3',
                            Progress: 30,
                        },
                    ],
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                notes: 'info',
                resourceInfo: 'resources',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
            },
            columns: [
                { field: 'TaskID', width: 80 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                    validationRules: {
                        required: true,
                        minLength: [
                            5,
                            'Task name should have a minimum length of 5 characters',
                        ],
                    },
                },
                { field: 'StartDate' },
                {
                    field: 'EndDate',
                },
                { field: 'Duration', validationRules: { required: true } },
                {
                    field: 'Progress',
                    validationRules: { required: true, min: 0, max: 100 },
                },
                { field: 'Predecessor' },
            ],
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1,
                },
            },
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'resources',
            },
            treeColumnIndex: 1,
            height: "450px",
            allowSelection: true,
            dateFormat: "MMM dd, y",
            projectStartDate: new Date('03/25/2024'),
            projectEndDate: new Date('07/28/2024'),
            highlightWeekends: true,
            gridLines: "Both",
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
                'Indent',
                'Outdent',
            ],
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
            },
            resources: [
                { resourceId: 1, resourceName: 'Martin Tamer' },
                { resourceId: 2, resourceName: 'Rose Fuller' },
                { resourceId: 3, resourceName: 'Margaret Buchanan' },
                { resourceId: 4, resourceName: 'Fuller King' },
                { resourceId: 5, resourceName: 'Davolio Fuller' },
                { resourceId: 6, resourceName: 'Van Jack' },
                { resourceId: 7, resourceName: 'Fuller Buchanan' },
                { resourceId: 8, resourceName: 'Jack Davolio' },
                { resourceId: 9, resourceName: 'Tamer Vinet' },
                { resourceId: 10, resourceName: 'Vinet Fuller' },
                { resourceId: 11, resourceName: 'Bergs Anton' },
                { resourceId: 12, resourceName: 'Construction Supervisor' }
            ],
            updateOffsetOnTaskbarEdit: true
        }, done);
    });
    it('edit duration and reverting', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '10 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let duration1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration1, 'dblclick');
        let input1: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input1.value = '0 days';
        let element1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element1, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/02/2024')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dialog editing constraint pop-up', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: dialogEditDataSB,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks',
                progress: 'Progress',
                segments: 'Segments',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                resourceInfo: 'Resources',
                manual: 'isManual',
                work: 'Work',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                mode: 'Dialog'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
            },
            resources: [
                { resourceId: 1, resourceName: 'Martin Tamer', role: 'UI Designer' },
                { resourceId: 2, resourceName: 'Rose Fuller', role: 'Business Analyst' },
                { resourceId: 3, resourceName: 'Margaret Buchanan', role: 'Tech Lead' },
                { resourceId: 4, resourceName: 'Fuller King', role: 'Frontend Dev' },
                { resourceId: 5, resourceName: 'Davolio Fuller', role: 'Full-Stack Dev' },
                { resourceId: 6, resourceName: 'Van Jack', role: 'Backend Dev' },
                { resourceId: 7, resourceName: 'Jack Davolio', role: 'QA Engineer' },
                { resourceId: 8, resourceName: 'Construction Supervisor', role: 'DB Engineer' }
            ],
            columns: [
                { field: 'TaskID', headerText: 'Task ID', width: 130 },
                { field: 'TaskName', headerText: 'Task Name', width: 200 },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'Duration', headerText: 'Duration' },
                { field: 'ConstraintType', width: 173 },
                { field: 'ConstraintDate', width: 176 },
                { field: 'isManual', width: 150 },
                { field: 'Work' },
            ],
            treeColumnIndex: 1,
            showColumnMenu: true,
            toolbar: ['Add', 'Edit', 'Delete', 'ExpandAll', 'CollapseAll'],
            taskMode: 'Custom',
            allowSelection: true,
            splitterSettings: {
                position: "50%"
            },
            gridLines: "Both",
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
                    day: new Date('07/11/2025'),
                    label: 'Project approval and kick-off'
                }
            ],
            labelSettings: {
                rightLabel: 'TaskName'
            },
            allowResizing: true,
            taskbarHeight: 25,
            rowHeight: 46,
            height: '650px',
            projectStartDate: new Date('03/30/2025'),
            projectEndDate: new Date('08/07/2025')
        }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 300);
        ganttObj.openEditDialog(8);
    });
    it('Opening dialog for coverage', () => {
        let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
        if (durationField) {
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            textObj.value = '2 days';
            textObj.dataBind();
        }
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        let okButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(okButton, 'click');
        expect(ganttObj.flatData[8].ganttProperties.constraintType).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Spinner loading issue cr-976884', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            height: "450px",
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: "Planning and Permits",
                    StartDate: new Date("04/02/2025"),
                    EndDate: new Date("04/10/2025"),
                    Duration: 7,
                    Progress: 100,
                    ConstraintType: 0
                },
                {
                    TaskID: 2,
                    TaskName: "Site Evaluation",
                    StartDate: new Date("04/02/2025"),
                    EndDate: new Date("04/04/2025"),
                    Duration: 2,
                    Progress: 100,
                    ParentID: 1,
                    ConstraintType: 4,
                    ConstraintDate: new Date("04/02/2025")
                },
                {
                    TaskID: 3,
                    TaskName: "Obtain Permits",
                    StartDate: new Date("04/07/2025"),
                    EndDate: new Date("04/09/2025"),
                    Duration: 3,
                    Progress: 100,
                    ParentID: 1,
                    Predecessor: "2FS+2days",
                    ConstraintType: 2,
                    ConstraintDate: new Date("04/07/2025")
                },
                {
                    TaskID: 4,
                    TaskName: "Finalize Planning",
                    StartDate: new Date("04/10/2025"),
                    EndDate: new Date("04/11/2025"),
                    Duration: 2,
                    Progress: 100,
                    ParentID: 1,
                    Predecessor: "3FS",
                    ConstraintType: 6,
                    ConstraintDate: new Date("04/11/2025")
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
                resourceInfo: 'resources'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Job Name', width: '200', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'ConstraintType' },
                { field: 'ConstraintDate' },
                { field: 'Predecessor' },
                { field: 'Progress' }
            ],
            treeColumnIndex: 1,
            timelineSettings: {
                topTier: { unit: 'Week', format: 'MMM dd, y' },
                bottomTier: { unit: 'Day' }
            },
            projectStartDate: new Date('03/25/2025'),
            projectEndDate: new Date('09/01/2025')
        }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 300);
    });
    it('Changing Duration', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '4 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.flatData[2].ganttProperties.duration).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Coverage for connectorline-edit', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Planning and Permits',
                    StartDate: new Date('04/02/2025'),
                    EndDate: new Date('04/10/2025'),
                    Duration: 7,
                    Progress: 100,
                    ConstraintType: 0,
                },
                {
                    TaskID: 2,
                    TaskName: 'Site Evaluation',
                    StartDate: new Date('04/02/2025'),
                    EndDate: new Date('04/04/2025'),
                    Duration: 2,
                    Progress: 100,
                    ParentID: 1,
                    ConstraintType: 4,
                    ConstraintDate: new Date('04/02/2025'),
                },
                {
                    TaskID: 3,
                    TaskName: 'Obtain Permits',
                    StartDate: new Date('04/07/2025'),
                    EndDate: new Date('04/09/2025'),
                    Duration: 3,
                    Progress: 100,
                    ParentID: 1,
                    Predecessor: '2FS+2days',
                    ConstraintType: 5,
                    ConstraintDate: new Date('04/14/2025'),
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                }
            },
            eventMarkers: [
                {
                    day: new Date('03/25/2025'),
                    label: 'Project StartDate'
                }, {
                    day: new Date('08/31/2025'),
                    label: 'Project EndDate'
                }
            ],
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Job Name', width: '200', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'ConstraintType', width: '180' },
                { field: 'ConstraintDate' },
                { field: 'EndDate' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: '#rightLabel',
            },
            splitterSettings: {
                columnIndex: 4
            },
            projectStartDate: new Date('03/25/2025'),
            projectEndDate: new Date('09/01/2025')
        }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 300);
    });
    it('Covering constraint violation method', () => {
        let constraintDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(constraintDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolConstraintDate') as any).ej2_instances[0];
        input.value = new Date('04/01/2025');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let okButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(okButton, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/8/2025');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Improve Coverage for cell-edit', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Planning and Permits',
                    StartDate: new Date('04/02/2025'),
                    EndDate: new Date('04/10/2025'),
                    Duration: 7,
                    Progress: 100,
                    ConstraintType: 5,
                },
                {
                    TaskID: 2,
                    TaskName: 'Site Evaluation',
                    StartDate: new Date('04/02/2025'),
                    EndDate: new Date('04/04/2025'),
                    Duration: 2,
                    Progress: 100,
                    ParentID: 1,
                    ConstraintType: 6,
                    ConstraintDate: new Date('04/02/2025'),
                },
                {
                    TaskID: 3,
                    TaskName: 'Obtain Permits',
                    StartDate: new Date('04/07/2025'),
                    EndDate: new Date('04/09/2025'),
                    Duration: 3,
                    Progress: 100,
                    ParentID: 1,
                    Predecessor: '2FS+2days',
                    ConstraintType: 7,
                    ConstraintDate: new Date('04/14/2025'),
                },
                {
                    TaskID: 4,
                    TaskName: 'Obtain Permits',
                    StartDate: new Date('04/07/2025'),
                    EndDate: new Date('04/09/2025'),
                    Duration: 3,
                    Progress: 100,
                    ParentID: 1,
                    Predecessor: '2FS+2days',
                    ConstraintType: 3,
                    ConstraintDate: new Date('04/14/2025'),
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                // startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                constraintType: 'ConstraintType',
                // constraintDate: 'ConstraintDate',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                }
            },
            eventMarkers: [
                {
                    day: new Date('03/25/2025'),
                    label: 'Project StartDate'
                }, {
                    day: new Date('08/31/2025'),
                    label: 'Project EndDate'
                }
            ],
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Job Name', width: '200', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'ConstraintType', width: '180' },
                { field: 'ConstraintDate' },
                { field: 'EndDate' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: '#rightLabel',
            },
            splitterSettings: {
                columnIndex: 4
            },
            projectStartDate: new Date('03/25/2025'),
            projectEndDate: new Date('09/01/2025')
        }, done);
    });
    it('Cell editing Constraint type', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
        if (constraintType) {
            let inputObj: any = constraintType.ej2_instances[0];
            inputObj.value = 6;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
    });
    it('Cell editing Constraint type', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
        if (constraintType) {
            let inputObj: any = constraintType.ej2_instances[0];
            inputObj.value = 3;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
    });
    it('Cell editing Constraint type', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
        if (constraintType) {
            let inputObj: any = constraintType.ej2_instances[0];
            inputObj.value = 7;
            inputObj.dataBind();
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Cell edit - cover specific uncovered branches', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('04/01/2019'), Duration: 3, Predecessor: '2', ConstraintType: 0, ConstraintDate: null },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('03/28/2019'), Duration: 2 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [
                { field: 'TaskID' },
                { field: 'TaskName' },
                { field: 'ConstraintType' },
                { field: 'ConstraintDate' },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' }
            ],
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });

    it('ConstraintEdited - predecessorDate branch via cell edit', () => {
        // dblclick constraint date cell for row 1 (task with predecessor) to invoke constraintEdited flow
        const constraintDateCell = ganttObj.element.querySelector(
            '#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)'
        ) as HTMLElement;
        triggerMouseEvent(constraintDateCell, 'dblclick');
        const editorInstance: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolConstraintDate') as any)
            && (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolConstraintDate') as any).ej2_instances
            && (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolConstraintDate') as any).ej2_instances[0];
        if (editorInstance) {
            // set a date to force validation path that computes predecessor date
            editorInstance.value = new Date('04/10/2019');
           editorInstance.dataBind();
        }
        // click elsewhere to commit cell edit (no async done callback; just drive code paths)
        const commitTarget = ganttObj.element.querySelector(
            '#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ) as HTMLElement;
        triggerMouseEvent(commitTarget, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering constraint -getDateByConstraint default case', () => {
        let ganttData = ganttObj.currentViewData[1];
        let startDate = ganttData.ganttProperties.startDate;
        ganttObj.dataOperation.getDateByConstraint(ganttData, startDate);
    });
    it('Covering getDateByConstraint for AsLateAsPossible project end fallback', () => {
        const ganttData: any = ganttObj.currentViewData[0];
        ganttData.ganttProperties.constraintType = 1; // AsLateAsPossible
        ganttData.ganttProperties.constraintDate = new Date('05/01/2019');
        const result: Date = ganttObj.dataOperation.getDateByConstraint(
            ganttData,
            new Date('04/02/2019'),
            true
        );
        expect(result).not.toBeNull();
        expect(result.getTime()).toBe(
            ganttObj.dataOperation.getStartDate(
                ganttObj.dataOperation.checkEndDate(new Date(ganttObj.projectEndDate)),
                ganttData.ganttProperties.duration,
                ganttData.ganttProperties.durationUnit,
                ganttData.ganttProperties
            ).getTime()
        );
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
            height: '650px',
            highlightWeekends: true,
            weekWorkingTime: [
                { dayOfWeek: 'Monday', timeRange: [{ from: 10, to: 18 }] },
                { dayOfWeek: 'Tuesday', timeRange: [{ from: 10, to: 18 }] }
            ],
            treeColumnIndex: 1,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 3
            }
        }, done);
    });
    it('Covering checkEndDate method', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 2, Progress: 30 }
            ],
            height: '650px',
            highlightWeekends: true,
            weekWorkingTime: [
                { dayOfWeek: 'Monday', timeRange: [{ from: 10, to: 12 }, { from: 14, to: 18 }] },
                { dayOfWeek: 'Tuesday', timeRange: [{ from: 10, to: 18 }] }
            ],
            treeColumnIndex: 1,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 3
            },
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
        }, done);
    });
    it('Covering checkEndDate method weekworktime', () => {
        // line 351 not covers.
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Covering calculateSecondDuration when startDate is not aligned and duration has fraction', () => {
        const ganttData: any = ganttObj.currentViewData[0];
        const startDate: Date = new Date(2019, 3, 1, 14, 0, 0);
        const result: Date = ganttObj.dataOperation.getEndDate(startDate, 1.5, 'Day', ganttData.ganttProperties, false);
        expect(result.getTime()).toBe(new Date(2019, 3, 2, 17, 0, 0).getTime());
    });
    it('Covering calculateSecondDuration when startDate is aligned and duration has fraction', () => {
        const ganttData: any = ganttObj.currentViewData[0];
        const startDate: Date = new Date(2019, 3, 1, 10, 0, 0);
        const result: Date = ganttObj.dataOperation.getEndDate(startDate, 1.5, 'Day', ganttData.ganttProperties, false);
        expect(result.getTime()).toBe(new Date(2019, 3, 2, 14, 0, 0).getTime());
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 30 },
            ],
            height: '650px',
            highlightWeekends: true,
            weekWorkingTime: [
                { dayOfWeek: 'Monday', timeRange: [{ from: 10, to: 18 }] },
                { dayOfWeek: 'Tuesday', timeRange: [{ from: 10, to: 18 }] }
            ],
            treeColumnIndex: 1,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit'],
            labelSettings: {
                leftLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 3
            },
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
        }, done);
    });
    it('Covering checkBaselineStartDate method weekworktime', () => {
        let date: Date = new Date('04/02/2026 10:00:00');
        let ganttProp = ganttObj.currentViewData[0].ganttProperties;
        ganttObj.dataOperation.checkBaselineStartDate(date, ganttProp);
    });
    it('Covering checkBaselineStartDate when date hour is after dayEndTime', () => {
        const date: Date = new Date(2019, 3, 1, 19, 0, 0);
        const ganttProp: any = ganttObj.currentViewData[0].ganttProperties;
        ganttProp.isAutoSchedule = true;
        ganttProp.endDate = new Date(2019, 3, 1, 18, 0, 0);
        const updatedDate: Date = ganttObj.dataOperation.checkBaselineStartDate(date, ganttProp);
        expect(updatedDate.getTime()).toBe(new Date(2019, 3, 2, 10, 0, 0).getTime());
    });
    it('Covering checkBaselineStartDate when date is between split working ranges', () => {
        const date: Date = new Date(2019, 3, 1, 12, 30, 0);
        const ganttProp: any = ganttObj.currentViewData[0].ganttProperties;
        const updatedDate: Date = ganttObj.dataOperation.checkBaselineStartDate(date, ganttProp);
        expect(updatedDate.getTime()).toBe(new Date(2019, 3, 1, 13, 0, 0).getTime());
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Defining the product  and its usage', Work: 1, BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                baselineStartDate: "BaselineStartDate",
                baselineEndDate: "BaselineEndDate",
                baselineDuration: "BaselineDuration",
                child: 'subtasks',
                work: 'Work'
            },
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'BaselineDuration', headerText: 'BaselineDuration',
                    edit: {
                        params: {
                            decimals: 2,
                        }
                    }
                },
                { field: 'Work', headerText: 'Work'}
            ],
            renderBaseline: true,
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering getWorkString, calculateDuration method code', () => {
        let ganttProp = ganttObj.currentViewData[0].ganttProperties;
        let nonWork = ganttObj.dataOperation['getNonworkingTime'](ganttProp.startDate, ganttProp.endDate, ganttProp.isAutoSchedule, ganttProp.calendarContext, false, false);
        ganttObj.dataOperation.getValidStartDate(ganttObj.currentViewData[0].ganttProperties, true, false);
        ganttObj.dataOperation.getValidEndDate(ganttObj.currentViewData[0].ganttProperties, true, false);
        ganttObj.dataOperation.calculateStartDate(ganttObj.currentViewData[0], true);
        ganttObj.openEditDialog(1);
        let baselineEnddateField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'BaselineEndDate')).ej2_instances[0];
        baselineEnddateField.value = '04/02/2019';
        baselineEnddateField.dataBind();
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Defining the product  and its usage', Work: 1, StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                work: 'Work'
            },
            workUnit: 'Day',
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'Work', headerText: 'Work'}
            ],
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering getWorkString method for day work unit case', () => {
        expect(ganttObj.currentViewData.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Defining the product  and its usage', Work: 4, StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                work: 'Work'
            },
            workUnit: 'Day',
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'Work', headerText: 'Work'}
            ],
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering getWorkString method for day work unit- plural case', () => {
        expect(ganttObj.currentViewData.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: MT1014886,
            taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            constraintType: 'ConstraintType',
            constraintDate: 'ConstraintDate',
            child: 'subtasks'
        },
        editSettings: {
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
        allowSelection: true,
        gridLines: "Both",
        showColumnMenu: false,
        highlightWeekends: true,
        timelineSettings: {
            topTier: {
                unit: 'Week',
                format: 'dd/MM/yyyy'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        columns: [
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'ConstraintType'}
        ],
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: 'Progress'
        },
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering startdate edit with constraint type-0', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
        input.value = new Date('04/08/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        ganttObj.dataOperation['updateSoonAsPossibleParent'](ganttObj.currentViewData[3].parentItem);
        ganttObj.dataOperation['updateSoonAsPossibleParent'](null);
    });
    it('Covering startdate edit with constraint type-1 for child task', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
        if (constraintType) {
            let inputObj: any = constraintType.ej2_instances[0];
            inputObj.value = 1;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for date-processor', () => {
    Gantt.Inject(DayMarkers, Selection, Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: MT1014886,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'ConstraintType'}
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Covering startdate edit with constraint type-1 for without parent task', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let constraintType: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolConstraintType') as HTMLElement;
        if (constraintType) {
            let inputObj: any = constraintType.ej2_instances[0];
            inputObj.value = 1;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
        ganttObj.dataOperation.calculateProjectDatesForValidatedTasks();
        ganttObj.projectStartDate = '04/01/2019';
        ganttObj.projectEndDate = '07/01/2019';
        // After project dates in string:
        ganttObj.dataOperation.calculateProjectDatesForValidatedTasks(); 
        // Flatdata length 0 case:
        ganttObj.projectStartDate = undefined;
        ganttObj.projectEndDate = undefined;
        ganttObj.dataOperation.dataArray = [];
        ganttObj.dataOperation.calculateProjectDatesForValidatedTasks();
        ganttObj.enablePersistence = true;
        ganttObj.isLoad = true;
        ganttObj.cloneProjectStartDate = undefined;
        ganttObj.dataOperation.calculateProjectDates();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});