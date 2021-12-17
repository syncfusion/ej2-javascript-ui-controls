/**
 * Gantt Drag and drop spec
 */
import { Gantt, Edit, Selection, IGanttData, RowDD } from '../../src/index';
import { dragSelfReferenceData, normalResourceData, resourceCollection, editingData } from '../base/data-source.spec';
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
       it('Drag and drop parent record to another parent record', function () {
            ganttObj_self.dataBind();
            ganttObj_self.reorderRows([1], 6, 'child');
            expect(parseInt(ganttObj_self.flatData[6].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[6][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[1].index).toBe(1);
            expect(ganttObj_self.flatData[6].taskData[ganttObj_self.taskFields.parentID]).toBe(7);
        });
        it('Drag and drop child to child above', function () {
            ganttObj_self.dataBind();
            ganttObj_self.reorderRows([2], 4, 'above');
            expect(parseInt(ganttObj_self.flatData[3].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[3][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[3].taskData[ganttObj_self.taskFields.parentID]).toBe(7);   
        });
        it('Drag and drop child to child below', function () {
            ganttObj_self.dataBind();
            ganttObj_self.reorderRows([3], 4, 'below');
            expect(parseInt(ganttObj_self.flatData[4].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[4][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[4].taskData[ganttObj_self.taskFields.parentID]).toBe(7);
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
    
     describe('Drag Drop for child position with segments', () => {
        let splitTasksData: object[] = [
            {
                TaskID: 1,
                TaskName: "Project Schedule",
                StartDate: new Date("02/04/2019"),
                EndDate: new Date("03/10/2019"),
                subtasks: [
                    {
                        TaskID: 2,
                        TaskName: "Planning",
                        StartDate: new Date("02/04/2019"),
                        subtasks: [
                            {
                                TaskID: 3,
                                TaskName: "Plan timeline",
                                StartDate: new Date("02/04/2019"),
                                EndDate: new Date("02/10/2019"),
                                Duration: 10,
                                Progress: "60",
                                Segments: [
                                    { StartDate: new Date("02/04/2019"), Duration: 2 },
                                    { StartDate: new Date("02/05/2019"), Duration: 5 },
                                    { StartDate: new Date("02/08/2019"), Duration: 3 }
                                ]
                            },
                            {
                                TaskID: 4,
                                TaskName: "Plan budget",
                                StartDate: new Date("02/04/2019"),
                                EndDate: new Date("02/10/2019"),
                                Duration: 10,
                                Progress: "90"
                            },
                            {
                                TaskID: 5,
                                TaskName: "Allocate resources",
                                StartDate: new Date("02/04/2019"),
                                EndDate: new Date("02/10/2019"),
                                Duration: 10,
                                Progress: "75",
                                Segments: [
                                    { StartDate: new Date("02/04/2019"), Duration: 4 },
                                    { StartDate: new Date("02/08/2019"), Duration: 2 }
                                ]
                            },
                            {
                                TaskID: 6,
                                TaskName: "Planning complete",
                                StartDate: new Date("02/21/2019"),
                                EndDate: new Date("02/21/2019"),
                                Duration: 0,
                                Predecessor: "3FS,5FS"
                            }
                        ]
                    },
                    {
                        TaskID: 7,
                        TaskName: "Design",
                        StartDate: new Date("02/25/2019"),
                        subtasks: [
                            {
                                TaskID: 8,
                                TaskName: "Software Specification",
                                StartDate: new Date("02/25/2019"),
                                EndDate: new Date("03/02/2019"),
                                Duration: 5,
                                Progress: "60",
                                Predecessor: "6FS"
                            },
                            {
                                TaskID: 9,
                                TaskName: "Develop prototype",
                                StartDate: new Date("02/25/2019"),
                                EndDate: new Date("03/02/2019"),
                                Duration: 5,
                                Progress: "100",
                                Predecessor: "6FS",
                                Segments: [
                                    { StartDate: new Date("02/25/2019"), Duration: 2 },
                                    { StartDate: new Date("02/28/2019"), Duration: 3 }
                                ]
                            },
                            {
                                TaskID: 10,
                                TaskName: "Get approval from customer",
                                StartDate: new Date("02/25/2019"),
                                EndDate: new Date("03/01/2019"),
                                Duration: 4,
                                Progress: "100",
                                Predecessor: "9FS"
                            },
                            {
                                TaskID: 11,
                                TaskName: "Design complete",
                                StartDate: new Date("02/25/2019"),
                                EndDate: new Date("02/25/2019"),
                                Duration: 0,
                                Predecessor: "10FS"
                            }
                        ]
                    }
                ]
            }
        ];
        let ganttObj_resource: Gantt;
        beforeAll((done: Function) => {
            ganttObj_resource = createGantt(
                {
                    dataSource: splitTasksData,
                    allowSorting: true,
                    enableContextMenu: true,
                    allowUnscheduledTasks: false,
                    allowRowDragAndDrop: true,
                    height: "450px",
                    taskFields: {
                        id: "TaskID",
                        name: "TaskName",
                        startDate: "StartDate",
                        endDate: "EndDate",
                        duration: "Duration",
                        progress: "Progress",
                        dependency: "Predecessor",
                        child: "subtasks",
                        segments: "Segments"
                    },
                    labelSettings: {
                        leftLabel: "TaskName"
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    projectStartDate: new Date("01/30/2019"),
                    projectEndDate: new Date("04/10/2019")
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
        it('Drag and drop', () => {
            ganttObj_resource.reorderRows([2], 8, 'child');
            setTimeout(() => {
                expect(ganttObj_resource.currentViewData[8].ganttProperties.segments).toBe(null || undefined);
            }, 100);
        });
    });
    describe('Drag and drop', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: editingData,
                    height: '450px',
                    highlightWeekends: true,
                    allowSelection: true,
                    treeColumnIndex: 1,
                    taskFields: {
                      id: 'TaskID',
                      name: 'TaskName',
                      startDate: 'StartDate',
                      endDate: 'EndDate',
                      progress: 'Progress',
                      duration: 'Duration',
                      dependency: 'Predecessor',
                      child: 'subtasks',
                      notes: 'Notes',
                      expandState: 'isExpand'
                    },
                    editSettings: {
                      allowAdding: true,
                      allowEditing: true,
                      allowDeleting: true,
                      allowTaskbarEditing: true,
                      showDeleteConfirmDialog: true
                    },
                  
                    allowSorting: true,
                    allowRowDragAndDrop: true,
                    enableContextMenu: true,
                    enableImmutableMode: true,
                    splitterSettings: {
                      columnIndex: 2
                    }
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
       it('Expand/collapse', function ()  {
           ganttObj_self.collapseByID(5);
           ganttObj_self.reorderRows([4],2, 'child');
           ganttObj_self.expandByID(5);
           let chartRow: HTMLElement = document.querySelector('#' + ganttObj_self.element.id + 'GanttTaskTableBody > tr:nth-child(5)') as HTMLElement;
           expect(chartRow.style.display).toBe('table-row');
        });    
    }); 
});
