import { ResizeArgs } from '@syncfusion/ej2-grids';
import { Gantt, Selection, Filter, Toolbar, Edit, ColumnMenu, Reorder, Resize, Freeze, Sort, RowDD, ContextMenu, UndoRedo } from '../../src/index';
import { newData, cellEditData, dialogEditData, baselineData, normalResourceData, resourceCollection, projectData1, StringResourceSelefReferenceData, StringMultiResources  } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';

Gantt.Inject(Selection, Toolbar, UndoRedo, Edit, Filter, Reorder, Resize, ColumnMenu, Sort, RowDD, ContextMenu, Freeze);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Render Frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: newData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'End Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                ],
                frozenColumns: 2,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('onpropertychange columns', function () {
        expect(ganttObj['getFrozenColumnsCount']()).toBe(2);
    });
});

describe('Render Frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: newData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name',  freeze: 'Right' },
                    { field: 'StartDate', headerText: 'Start Date', freeze: 'Fixed' },
                    { field: 'Duration', headerText: 'Duration', freeze: 'Right' },
                    { field: 'Progress', headerText: 'Progress', }, 
                ],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('checking freezed columns count', function () {
        expect(ganttObj.treeGrid.getFrozenRightColumnsCount()).toBe(2);
        expect(ganttObj.treeGrid.getFrozenRightColumns()[0].field).toBe('TaskName');
        expect(ganttObj.treeGrid.getFrozenRightColumns()[1].field).toBe('Duration');
    });
});

describe('Render Frozen columns using isFrozen', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: newData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name',  isFrozen: true },
                    { field: 'StartDate', headerText: 'Start Date', isFrozen: true },
                    { field: 'Duration', headerText: 'Duration', isFrozen: true },
                    { field: 'Progress', headerText: 'Progress', }, 
                ],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('checking freezed columns count', function () {
        expect(ganttObj['getFrozenColumnsCount']()).toBe(3);
    });
});

describe('Cell editing for frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cellEditData,
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
                frozenColumns: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                ],
                splitterSettings: {
                    columnIndex: 6
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName',  width: 100 },
                    { field: 'StartDate', width: 100 },
                    { field: 'EndDate', width: 100 },
                    { field: 'Duration', width: 100, freeze: 'Fixed' },
                    { field: 'Predecessor', width: 100},
                    { field: 'Progress', width: 100 },
                ],
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('checking freezed columns after cell edit', function () {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        expect(ganttObj.treeGrid.getCellFromIndex(1,4).classList.contains('e-freezerightborder')).toBe(true);
        expect(ganttObj.treeGrid.getCellFromIndex(1,4).classList.contains('e-freezeleftborder')).toBe(true);
    });
});

describe('Dialog editing for frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: dialogEditData,
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
                   frozenColumns: 3,
                   projectStartDate: new Date('03/25/2019'),
                   projectEndDate: new Date('05/30/2019'),
                   renderBaseline: true,
                   editSettings: {
                       allowAdding: true,
                       allowEditing: true,
                       allowDeleting: true,
                       mode: 'Dialog'
                   },
                   editDialogFields: [
                       { type: 'General' },
                       { type: 'Dependency' },
                   ],
                   addDialogFields: [
                       { type: 'General' },
                       { type: 'Dependency' }
                   ],
                   columns: [
                       { field: 'TaskID', width: 60 },
                       { field: 'TaskName', width: 100 },
                       { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                       { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                       { field: 'Duration', width: 100, isFrozen: true },
                       { field: 'Predecessor', width: 100 },
                       { field: 'Progress', width: 100 },
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 500);
        ganttObj.openEditDialog(4);
    });
    it('Record update with duration', () => {
        let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
        if (durationField) {
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            textObj.value = '5 days';
            textObj.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/5/2019');
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/11/2019');
            let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        }
    });
});

describe('Gantt column reorder action for Frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children'
                },
                splitterSettings: {
                    columnIndex: 5
                },
                frozenColumns: 3,
                allowReordering: true,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Column reorder - Public method', () => {
        ganttObj.reorderColumns('TaskName', 'EndDate');
        expect(ganttObj.treeGrid.getFrozenLeftColumns()[0].field).toBe('TaskId')
        expect(ganttObj.treeGrid.getFrozenLeftColumns()[1].field).toBe('StartDate')
        expect(ganttObj.treeGrid.getFrozenLeftColumns()[2].field).toBe('EndDate')

    });
});

describe('Gantt column resize action for freezed columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                allowResizing: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomIn','ZoomOut'],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children'
                },
                frozenColumns: 2,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Perform Column resize', () => {
        ganttObj.resizeStart = (args: ResizeArgs) => {
            expect(args.column.field).toBe('TaskId');
            expect(args['name']).toBe('resizeStart');
        };
        ganttObj.resizing = (args: ResizeArgs) => {
            expect(args.column.field).toBe('TaskId');
            expect(args['name']).toBe('resizing');
        };
        ganttObj.resizeStop = (args: ResizeArgs) => {
            expect(args.column.field).toBe('TaskId');
            expect(args['name']).toBe('resizeStop');
        };
        ganttObj.dataBind();
        let resizeColumn: HTMLElement = ganttObj.element.getElementsByClassName('e-columnheader')[0].getElementsByClassName('e-rhandler e-rcursor')[0] as HTMLElement;
        triggerMouseEvent(resizeColumn, 'mousedown');
        triggerMouseEvent(resizeColumn, 'mousemove', 100);
        triggerMouseEvent(resizeColumn, 'mouseup');
        const args: any = {
            column: ganttObj.treeGrid.columns[0]
        };
        ganttObj.treeGrid.resizeStop(args);
        ganttObj.undo();
    });
});

let ganttModel: Object = {
    dataSource: normalResourceData,
    resources: resourceCollection,
    viewType: 'ResourceView',
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
    taskType: 'FixedWork',
    resourceFields: {
        id: 'resourceId',
        name: 'resourceName',
        unit: 'resourceUnit',
        group: 'resourceGroup'
    },
    showOverAllocation: true,
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', visible: false },
        { field: 'TaskName', headerText: 'Name', width: 250, freeze: 'Left' },
        { field: 'work', headerText: 'Work', freeze: 'Fixed' },
        { field: 'Progress' },
        { field: 'resources', headerText: 'Group', isFrozen: true },
        { field: 'StartDate' },
        { field: 'Duration' },
    ],
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
    splitterSettings: { columnIndex: 3 },
    labelSettings: {
        rightLabel: 'resources',
        taskLabel: 'Progress'
    },
    allowResizing: true,
    allowSelection: true,
    highlightWeekends: true,
    treeColumnIndex: 1,
    height: '450px',
    projectStartDate: new Date('03/28/2019'),
    projectEndDate: new Date('05/18/2019')
};
describe('Resource Normal view frozen columns', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(ganttModel, done);
    });
    it('Editing task name', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(1)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.taskName).toBe('TaskName updated');
    });
    it('Editing resource column', () => {
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value = [1];
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            //checking work values for task after adding resource
            expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 1');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/17/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(32);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt undo redo action for Show Hide', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                enableUndoRedo: true,
                allowSorting: true,
                allowFiltering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                frozenColumns: 3,
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                toolbar: ['Undo', 'Redo'],
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Hideing column', () => {
        ganttObj.hideColumn(ganttObj.treeGrid.getColumnByField('TaskName').headerText)
        expect(ganttObj['getFrozenColumnsCount']()).toBe(3)
    });
    it('Checking data after undo Show Hide', () => {
        let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
        triggerMouseEvent(undo, 'click');
        expect(ganttObj.columnByField['TaskName'].visible).toBeUndefined()
        expect(ganttObj['getFrozenColumnsCount']()).toBe(3)
    });
    it('Checking data after redo Show Hide', (done:Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "columnstate") {
                expect(args.columns[0].visible).toBe(false)
                done()
            }
        };
        ganttObj.redo()
        expect(ganttObj['getFrozenColumnsCount']()).toBe(3)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});