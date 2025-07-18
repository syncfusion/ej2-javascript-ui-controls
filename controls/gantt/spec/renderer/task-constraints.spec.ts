/**
  * Gantt base spec
  */
import { Gantt, DayMarkers , Selection, Edit} from '../../src/index';
import { constraintsData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
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
            expect(ganttObj.dateValidationModule.getDateByConstraint(ganttObj.flatData[15].ganttProperties, new Date('05/28/2025')).toDateString()).toBe('Mon Mar 25 2019');
            expect(ganttObj.dateValidationModule.getDateByConstraint(ganttObj.flatData[16].ganttProperties, new Date('05/28/2025')).toDateString()).toBe('Mon May 27 2019');
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