/**
 * Gantt Drag and drop spec
 */
import { Gantt, Edit, Selection, IGanttData, RowDD } from '../../src/index';
import { dragSelfReferenceData, normalResourceData, resourceCollection } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';

Gantt.Inject(Edit, Selection, RowDD);
describe('Gantt Drag and Drop support', () => {
    describe('SelfReference data binding', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: dragSelfReferenceData,
                    height: '450px',
                    allowRowDragAndDrop: true,
                    highlightWeekends: true,
                    allowSelection: true,
                    treeColumnIndex: 1,
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
                    columns: [
                        { field: 'taskID', width: 60 },
                        { field: 'taskName', width: 250 },
                        { field: 'startDate' },
                        { field: 'endDate' },
                        { field: 'duration' },
                        { field: 'predecessor' },
                        { field: 'progress' },
                    ],
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true
                    },
                    labelSettings: {
                        leftLabel: 'taskName'
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    projectStartDate: new Date('01/28/2019'),
                    projectEndDate: new Date('03/10/2019')
                }, done);
        });
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        it('Drag and drop parent record to another parent record', () => {
            ganttObj_self.reorderRows([1], 6, 'child');
            expect(parseInt(ganttObj_self.currentViewData[6].ganttProperties.parentId)).toBe(1);
            expect(ganttObj_self.currentViewData[6][ganttObj_self.taskFields.parentID]).toBe(1);
            expect(ganttObj_self.currentViewData[6].taskData[ganttObj_self.taskFields.parentID]).toBe(1);
        });
    });
    describe('Resource view data binding', () => {
        let ganttObj_resource: Gantt;
        beforeAll((done: Function) => {
            ganttObj_resource = createGantt(
                {
                    dataSource: normalResourceData,
                    resources: resourceCollection,
                    allowRowDragAndDrop: true,
                    viewType: 'ResourceView',
                    showOverAllocation: true,
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
                        { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }],
                    labelSettings: {
                        rightLabel: 'resources',
                        taskLabel: 'Progress'
                    },
                    splitterSettings: {
                        columnIndex: 3
                    },
                    allowResizing: true,
                    allowSelection: true,
                    highlightWeekends: true,
                    treeColumnIndex: 1,
                    height: '450px',
                    projectStartDate: new Date('03/28/2019'),
                    projectEndDate: new Date('05/18/2019')
                }, done);
        });
        afterAll(() => {
            if (ganttObj_resource) {
                destroyGantt(ganttObj_resource);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        // it('Drag and drop', () => {
        //     ganttObj_resource.reorderRows([1], 4, 'above');
        //     expect(parseInt(ganttObj_resource.flatData[3].parentItem.taskId)).toBe(2689);
        // });
    });
});
