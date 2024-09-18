/**
 * Gantt Drag and drop spec
 */
import { Gantt, Edit, Selection, IGanttData, RowDD, Filter, Toolbar, ColumnMenu, CriticalPath, UndoRedo} from '../../src/index';
import { dragSelfReferenceData, normalResourceData, resourceCollection, editingData, projectData,projectResources, dubnormalResourceData, dubmilnormalResourceData, selfReferenceResource, selfReferenceResourceView } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';

function mouseMoveFunction(eventType: any, clientX: any, clientY:any) {
    var event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: clientY
    });
    document.dispatchEvent(event); // Dispatch the event on the document or window
}
Gantt.Inject(Edit, Selection, RowDD, CriticalPath,UndoRedo);
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
       it('Drag and drop parent record to another parent record', function () {
            ganttObj_self.reorderRows([1], 6, 'child');
            expect(parseInt(ganttObj_self.flatData[6].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[6][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[1].index).toBe(1);
            expect(ganttObj_self.flatData[6].taskData[ganttObj_self.taskFields.parentID]).toBe(7);
        });
        it('Drag and drop child to child above', function () {
            ganttObj_self.reorderRows([2], 4, 'above');
            expect(parseInt(ganttObj_self.flatData[3].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[3][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[3].taskData[ganttObj_self.taskFields.parentID]).toBe(7);   
        });
        it('Drag and drop child to child below', function () {
            ganttObj_self.reorderRows([3], 4, 'below');
            expect(parseInt(ganttObj_self.flatData[4].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.flatData[4][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.flatData[4].taskData[ganttObj_self.taskFields.parentID]).toBe(7);
        });    
    });
    describe('Incorrect index value', () => {
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
        it('Drag and drop child to child below', function () {
            expect(ganttObj_self.flatData[3].index).toBe(3);
            ganttObj_self.reorderRows([3], 4, 'below');
            expect(ganttObj_self.flatData[4].index).toBe(4);
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
       it('Expand/collapse', function ()  {
           ganttObj_self.collapseByID(5);
           ganttObj_self.reorderRows([4],2, 'child');
           ganttObj_self.expandByID(5);
           let chartRow: HTMLElement = document.querySelector('#' + ganttObj_self.element.id + 'GanttTaskTableBody > tr:nth-child(5)') as HTMLElement;
           expect(chartRow.style.display).toBe('table-row');
        });    
    });
       describe('Drag and drop', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: projectData,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency:'Predecessor',
                        child: 'subtasks'
                    },
                allowRowDragAndDrop: true,
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
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
       it('Drag and drop after Expand/Collapse', function ()  {
           ganttObj_self.collapseByID(6);
           ganttObj_self.reorderRows([4],3, 'child');
           ganttObj_self.actionComplete = (args: any): void => {
            if (args.requestType === 'rowDropped') {
                expect(ganttObj_self.currentViewData[7].parentItem.index).toBe(5);
            }
        };      
        });    
    });
        describe('Childrecords update', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: projectData,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency:'Predecessor',
                        child: 'subtasks'
                    },
                allowRowDragAndDrop: true,
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
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
       it('Update childrecords in parent item', function ()  {
           ganttObj_self.collapseByID(6);
           ganttObj_self.reorderRows([4],3, 'child');
           ganttObj_self.actionComplete = (args: any): void => {
            if (args.requestType === 'rowDropped') {
                expect(ganttObj_self.currentViewData[7].parentItem.index).toBe(5);
            }
        };      
        });
      });
    describe('RowData customization in immutable mode', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: projectData,
                    allowSorting: true,
                    allowReordering: true,
                    enableContextMenu: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        indicators: 'Indicators'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'CustomColumn', headerText: 'CustomColumn' }
                    ],
                    sortSettings: {
                        columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                    },
                    toolbar: ['Indent', 'Outdent'],
                    rowDataBound: function (args) {
                        if ((args.data).childRecords.length > 0) {
                            args.row.classList.add('summary-class');
                        }
                        else {
                            args.row.classList.remove('summary-class');
                        }
                    },
                    actionComplete: function (args) {
                        expect(ganttObj_self.treeGrid.getRows()[2].classList.contains('summary-class')).toBe(true);
                    },
                    allowSelection: true,
                    enableImmutableMode: true,
                    allowRowDragAndDrop: true,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
        it('Perform indent', function () {
            ganttObj_self.selectRow(3);
            let indentRecord: HTMLElement = ganttObj_self.element.querySelector('#' + ganttObj_self.element.id + '_indent') as HTMLElement;
            triggerMouseEvent(indentRecord, 'click');
        });
    });
      describe('RowDrag and drop without subtasks', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource:  [{"TaskID":1,"TaskName":"New Task 1","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":2,"TaskName":"New Task 2","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":3,"TaskName":"New Task 3","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":4,"TaskName":"New Task 4","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null}],
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
        allowRowDragAndDrop: true,
        height: '450px',
        columns: [
            { field: 'TaskID', headerText: 'ID', width: 80 },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'StartDate' },
            { field: 'EndDate' },
            { field: 'Duration' },
            { field: 'Progress' },
            { field: 'Predecessor', headerText: 'Dependency' }
        ],
        labelSettings: {
            leftLabel: 'TaskName'
        },
        selectionSettings: {
            type: 'Multiple'
        },
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('07/06/2019'),
        splitterSettings: {
            columnIndex: 3
        },
        }, done);
        });
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
        it('Drag and drop', function () {
            ganttObj_self.reorderRows([3],0,'below')
            expect(ganttObj_self.dataSource[1].TaskID).toBe(4);
        });
    });
    describe('Drag And drop for below position', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData,
                    allowFiltering: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                        resourceInfo: 'ResourceId',
                    },
                    resourceNameMapping: 'ResourceName',
                    resourceIDMapping: 'ResourceId',
                    resources: projectResources,
                     allowRowDragAndDrop: true,
                     allowSorting: true,
                     enableContextMenu: true,
                     enableImmutableMode: true,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'ResourceId', headerText: 'Resources' },
                        { field: 'TaskName', headerText: 'Task Name' },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration' },
                        { field: 'Predecessor', headerText: 'Predecessor' },
                        { field: 'Progress', headerText: 'Progress' },
                    ],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Drag and drop', function () {
           ganttObj.actionComplete = (args: any): void => {
              if (args.requestType === 'rowDropped') {
                expect(ganttObj.dataSource[0].subtasks[0].subtasks.length).toBe(6);
              }
           };
          ganttObj.reorderRows([10], 3, 'below');
       });
    });
    describe('Update datasource after indent and outdent', () => {
        let ganttObj: Gantt;
        let editingData = [
            {
              TaskID: 1,
              TaskName: 'Project initiation',
              StartDate: new Date('04/02/2019'),
              EndDate: new Date('04/04/2019'),
            },
            {
              TaskID: 2,
              TaskName: 'Identify site location',
              StartDate: new Date('04/02/2019'),
              Duration: 4,
              Progress: 30,
              resources: [1],
              info: 'Measure the total property area alloted for construction',
            },
            {
                TaskID: 3,
                TaskName: 'Identify site location',
                StartDate: new Date('04/02/2019'),
                Duration: 4,
                Progress: 30,
                resources: [1],
                info: 'Measure the total property area alloted for construction',
              },
          ];

        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
                    allowSorting: true,
                    allowReordering: true,
                    enableContextMenu: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
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
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor', headerText: 'Predecessor' }
                    ],
                    sortSettings: {
                        columns: [{ field: 'TaskID', direction: 'Ascending' },
                            { field: 'TaskName', direction: 'Ascending' }]
                    },
                    toolbar: ['Indent','Outdent'],
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
                    searchSettings: { fields: ['TaskName', 'Duration']
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
       it('Perform indent and outdent', function () {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'outdented') {
                  expect(ganttObj.dataSource[0].subtasks.length).toBe(2);
                }
             };
           ganttObj.dataBind();
           ganttObj.indent();
           ganttObj.selectRow(2);
           ganttObj.indent();
           ganttObj.selectRow(2);
           ganttObj.indent();
           ganttObj.selectRow(2);
           ganttObj.outdent()
       });
    });
});
describe('Gantt filter after drag and drop', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu,RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData,
                allowFiltering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                    resourceInfo: 'ResourceId',
                },
                resourceNameMapping: 'ResourceName',
                resourceIDMapping: 'ResourceId',
                resources: projectResources,
                 allowRowDragAndDrop: true,
                 allowSorting: true,
                 enableContextMenu: true,
                 enableImmutableMode: true,
                splitterSettings: {
                    columnIndex: 7,
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'ResourceId', headerText: 'Resources' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress', headerText: 'Progress' },
                ],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

  // it('TaskID FilterMenu Click Function', () => {
  //      let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
  //      triggerMouseEvent(filterMenuIcon, 'click');
  //      let input: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('.e-numerictextbox'));
  //      if (input) {
  //          ganttObj.dataBound = () => {
  //              expect(ganttObj.currentViewData.length).toBe(1);
  //              ganttObj.dataBound = null;
  //              ganttObj.dataBind();                    
  //          }
  //          ganttObj.dataBind();
  //          let inputValue: any = (document.getElementsByClassName('e-numerictextbox')[0] as any).ej2_instances[0];
  //          inputValue.value = 1;
  //          inputValue.dataBind();
  //          let filterButton: HTMLElement = document.body.querySelector('.e-flmenu-okbtn') as HTMLElement;
  //          triggerMouseEvent(filterButton, 'click');
  //      }
//
  //      ganttObj.collapseByID(6);
  //      ganttObj.reorderRows([4],3, 'child');
  //      ganttObj.actionComplete = (args: any): void => {
  //       if (args.requestType === 'rowDropped') {
  //           expect(ganttObj.currentViewData[7].parentItem.index).toBe(5);
  //        }
  //   };
  //  });


 
});
describe('RowDrag and drop and enableVirtualization', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource:  [{"TaskID":1,"TaskName":"New Task 1","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":2,"TaskName":"New Task 2","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":3,"TaskName":"New Task 3","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null},{"TaskID":4,"TaskName":"New Task 4","StartDate":"2022-07-04T13:00:00.000Z","EndDate":"2022-07-04T22:00:00.000Z","Duration":1,"Progress":0,"Predecessor":"","resources":[],"info":null}],
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
    allowRowDragAndDrop: true,
    height: '450px',
    columns: [
        { field: 'TaskID', headerText: 'ID', width: 80 },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
        { field: 'Progress' },
        { field: 'Predecessor', headerText: 'Dependency' }
    ],
    labelSettings: {
        leftLabel: 'TaskName'
    },
    selectionSettings: {
        type: 'Multiple'
    },
    enableVirtualization:true,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('07/06/2019'),
    splitterSettings: {
        columnIndex: 3
    },
    }, done);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    it('Drag and drop', function () {
        ganttObj_self.reorderRows([3],0,'below')
        expect(ganttObj_self.dataSource[1].TaskID).toBe(4);
    });
});
describe('Outdent Record to be in first Index of modified records', () => {
    let ganttObj_self: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,
                    subtasks: [{
                        TaskID: 3, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,
                        subtasks: [{
                            TaskID: 4, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,
                            subtasks: [{
                                TaskID: 5, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,
                            }]
                        }]
                    }]
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
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
                    dependency: 'Predecessor',
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
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Indent','Outdent'],
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
                projectEndDate: new Date('05/30/2019')
    }, done);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    it('Perform outdent', function () {
       ganttObj_self.actionComplete= (args) : void => {
        if(args.requestType == 'outdented') {
            expect(args.modifiedRecords[0].TaskID).toBe(5);
            expect(args.modifiedRecords.length).toBe(5);
        }
       }
       ganttObj_self.dataBind();
       ganttObj_self.selectRow(4);
       ganttObj_self.outdent();
    });
});
describe('Drag drop records for critical path', () => {
    let ganttObj_self: Gantt;
    let bwData = [
        {
          TaskID: '01',
          TaskName: 'New Task 1',
          StartDate: new Date('07/11/2023'),
          EndDate: new Date('07/11/2023'),
          Progress: 59,
          Duration: 1,
          Predecessor: '02FS',
        },
        {
          TaskID: '02',
          TaskName: 'New Task 2',
          StartDate: new Date('07/10/2023'),
          EndDate: new Date('07/10/2023'),
          Progress: 45,
          Duration: 1,
        },
        {
          TaskID: '03',
          TaskName: 'New Task 1',
          StartDate: new Date('07/12/2023'),
          EndDate: new Date('07/12/2023'),
          Progress: 59,
          Duration: 1,
          Predecessor: '01FS',
        },
        {
          TaskID: '04',
          TaskName: 'New Task 2',
          StartDate: new Date('07/13/2023'),
          EndDate: new Date('07/13/2023'),
          Progress: 45,
          Duration: 1,
          Predecessor: '03FS',
        },
      ];
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: bwData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableCriticalPath: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            parentID: 'parentID',
            baselineStartDate: 'BaselineStartDate',
            baselineEndDate: 'BaselineEndDate'
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
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],

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
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        allowUnscheduledTasks: true
    }, done);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    it('Drag drop to child position', function () {
        ganttObj_self.actionComplete= (args) : void => {
        if(args.requestType == 'refresh') {
            expect(ganttObj_self.criticalPathModule.criticalTasks.length).toBe(3);
        }
       }
        ganttObj_self.reorderRows([1],3,'child');
    });
});
describe('Check datasource position after Drag drop in resource view', () => {
    let ganttObj_self: Gantt;
    let multiTaskbarData = [
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
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
                },
            ]
        },
        {
            TaskID: 5,
            TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
                    Duration: 5, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 50 }], work: 30
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 40 }], Predecessor: '6FS-2', Progress: 30, work: 40
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
                    Duration: 4, resources: [{ resourceId: 2, resourceUnit: 75 }], Predecessor: '7FS-1', Progress: 30, work: 60,
                }
            ]
        },
        {
            TaskID: 9,
            TaskName: 'Site work',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 10, TaskName: 'Install temporary power service', StartDate: new Date('04/01/2019'), Duration: 14,
                    Progress: 30, resources: [{ resourceId: 3, resourceUnit: 75 }]
                },
                {
                    TaskID: 11, TaskName: 'Clear the building site', StartDate: new Date('04/08/2019'),
                    Duration: 9, Progress: 30, Predecessor: '10FS-9', resources: [3]
                },
                {
                    TaskID: 12, TaskName: 'Sign contract', StartDate: new Date('04/12/2019'),
                    Duration: 5, resources: [3], Predecessor: '11FS-5'
                },
            ]
        },
        {
            TaskID: 13,
            TaskName: 'Foundation',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 14, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                    Duration: 2, Progress: 30, resources: [4]
                },
                {
                    TaskID: 15, TaskName: 'Dig footer', StartDate: new Date('04/04/2019'),
                    Duration: 2, Predecessor: '14FS + 1', resources: [4]
                },
                {
                    TaskID: 16, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 2,
                    Progress: 30, Predecessor: 15, resources: [4]
                }
            ]
        },
        {
            TaskID: 17,
            TaskName: 'Framing',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 18, TaskName: 'Add load-bearing structure', StartDate: new Date('04/03/2019'),
                    Duration: 2, Progress: 30, resources: [5]
                },
                {
                    TaskID: 19, TaskName: 'Natural gas utilities', StartDate: new Date('04/08/2019'),
                    Duration: 4, Predecessor: '18', resources: [5]
                },
                {
                    TaskID: 20, TaskName: 'Electrical utilities', StartDate: new Date('04/11/2019'),
                    Duration: 2, Progress: 30, Predecessor: '19FS + 1', resources: [5]
                }
            ]
        }
    ];
    let resources = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team', isExpand: false },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team', isExpand: false },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team', isExpand: true }
    ];
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: multiTaskbarData,
                resources: resources,
                allowRowDragAndDrop: true,
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    work: 'work',
                    expandState: 'isExpand',
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                labelSettings: {
                    taskLabel: 'TaskName'
                },
                splitterSettings: {
                    columnIndex: 2
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                allowTaskbarDragAndDrop: true,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
    }, done);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    it('Check datasource position', function () {
        ganttObj_self.actionComplete= (args) : void => {
        if(args.requestType == 'save') {
            expect(ganttObj_self.dataSource['subtasks'][2].TaskID).toBe(4);
        }
       }
        ganttObj_self.reorderRows([3],6,'below');
    });
});
describe('Predecessor not updated after row drag drop', () => {
    let ganttObj_self: Gantt;
    var resourcesData = [
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
    var resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team', isExpand: false },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team', isExpand: false },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team', isExpand: true }
    ];
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: resourcesData,
        allowTaskbarDragAndDrop: true,
        allowRowDragAndDrop: true,
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
            { field: 'TaskID', width: 80 },
            { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
            { field: 'StartDate' },
            { field: 'EndDate' },
            { field: 'Duration' },
            { field: 'Progress' },
            { field: 'Predecessor' }
        ],
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        enableContextMenu: true,
        allowSelection: true,
        height: '450px',
        treeColumnIndex: 1,
        highlightWeekends: true,
        splitterSettings: {
            position: "35%"
        },
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('01/30/2019'),
        projectEndDate: new Date('03/04/2019'),
        enableVirtualization: true
    }, done);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    it('reorder rows', function () {
        ganttObj_self.actionComplete = (args): void => {
            if (args.requestType == 'save') {
                expect(ganttObj_self.currentViewData[4].ganttProperties.predecessor.length).toBe(3);
            }
        }
        ganttObj_self.dataBind();
        ganttObj_self.reorderRows([2], 5, 'child');
    });
});
describe('row drag and drop in resource view', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
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
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 1000);
    });
    it('Drag and drop in resource view', function () {
        ganttObj_self.dataBind();
        ganttObj_self.reorderRows([1], 6, 'child');
    });
});
describe('Triggering Row drag and drop event', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                loadingIndicator: { indicatorType: 'Shimmer' },
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
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Position', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[3] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove', 28, 137)
        triggerMouseEvent(dragElement,'mouseup', 28, 137);
        expect(ganttObj_self.flatData.length).toBe(13)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Triggering Row drag and drop event spinner', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                loadingIndicator: { indicatorType: 'Spinner' },
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
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Position spinner', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[3] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove', 28, 137)
        triggerMouseEvent(dragElement,'mouseup', 28, 137);
        expect(ganttObj_self.flatData.length).toBe(13);
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Triggering Row drag and drop event with undo redo', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Position after undo redo', function () {
        ganttObj_self.reorderRows([1], 6, 'child')
        let undoButton:HTMLElement = document.querySelector('.e-toolbar-item[title="Undo"]').querySelector('button') as HTMLElement;
        triggerMouseEvent(undoButton,'click');
        ganttObj_self.reorderRows([1], 6, 'child')
        expect(ganttObj_self.flatData[5].hasChildRecords).toBe(true)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Triggering Row drag and drop above event with undo redo', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Above Position after undo redo', function () {
        ganttObj_self.reorderRows([1], 6, 'above')
        expect(ganttObj_self.flatData[5].index).toBe(5)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Triggering Row drag and drop below event with undo redo', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Below Position after undo redo', function () {
        ganttObj_self.reorderRows([1], 6, 'below')
        expect(ganttObj_self.flatData[6].index).toBe(6)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Multiple resource drag and drop', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking multiple resource taskbar position', function () {
        ganttObj_self.reorderRows([1], 15, 'below')
        expect(ganttObj_self.flatData[15].index).toBe(15)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging record with child record', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking index after dragging parent task', function () {
        ganttObj_self.reorderRows([4], 1, 'below')
        expect(ganttObj_self.flatData[2].level).toBe(1)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging task to unassigned task', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking after deletion of record', function () {
        ganttObj_self.reorderRows([1], 18, 'below')
        expect(ganttObj_self.flatData.length).toBe(18)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Moving record to the duplicate task', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking the task id if it moved', function () {
        ganttObj_self.reorderRows([1],6, 'below')
        expect(parseInt(ganttObj_self.flatData[1].ganttProperties.taskId)).toBe(2)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Moving level 0 record', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking the level after moving', function () {
        ganttObj_self.reorderRows([0],4, 'below')
        expect(ganttObj_self.flatData[2].level).toBe(1)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Moving level 0 record to next parent', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking the taskId after moving below parent', function () {
        ganttObj_self.reorderRows([0],3, 'below')
        expect(parseInt(ganttObj_self.flatData[5].ganttProperties.taskId)).toBe(1)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Moving task bar as child to milestone', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubmilnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    milestone:'isMilestone',
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking if it milestone', function () {
        ganttObj_self.reorderRows([1],5, 'child')
        expect(ganttObj_self.flatData[4].ganttProperties.isMilestone).toBe(false)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Move taskbar above', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: dubmilnormalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    milestone:'isMilestone',
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
                toolbar: [ 'Undo', 'Redo'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking for Id after moving', function () {
        ganttObj_self.reorderRows([8],0, 'above')
        expect(parseInt(ganttObj_self.flatData[0].ganttProperties.taskId)).toBe(9)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging parentId data with resource view', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
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
    it('Checking taskbar taskId after dragging in resource view', function () {
        ganttObj_self.reorderRows([4],0, 'child');
        expect(parseInt(ganttObj_self.flatData[3].ganttProperties.taskId)).toBe(7)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging parent parentId data with resource view', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
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
    it('Checking parent level after dragging in resource view', function () {
        ganttObj_self.reorderRows([3],0, 'child')
        expect(ganttObj_self.flatData[3].level).toBe(1)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging parent parentId data with resource view Above', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                toolbar: [ 'Undo', 'Redo'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType:'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],
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
    it('Checking parent index after dragging in resource view', function () {
        ganttObj_self.reorderRows([4],0, 'above')
        expect(parseInt(ganttObj_self.flatData[0].ganttProperties.taskId)).toBe(7)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging parent parentId data with resource view Above level 1', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                toolbar: [ 'Undo', 'Redo'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType:'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],
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
    it('Checking parent index after dragging in resource view level 1', function () {
        ganttObj_self.reorderRows([4],1, 'above')
        expect(parseInt(ganttObj_self.flatData[1].ganttProperties.taskId)).toBe(7)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging record as child', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                toolbar: [ 'Undo', 'Redo'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType:'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],
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
    it('Incorrect drag possition', function () {
        ganttObj_self.reorderRows([4],1, 'child')
        expect(ganttObj_self.flatData[2].level).toBe(2)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Adding error element', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                toolbar: [ 'Undo', 'Redo'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType:'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],
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
    it('Checking for error element', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[4] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove',20,1000)
        ganttObj_self.rowDragAndDropModule['addErrorElem']()
        expect(document.querySelector('.e-errorelem') != null).toBe(true)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Removing error element', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: selfReferenceResourceView,
                height: '450px',
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                toolbar: [ 'Undo', 'Redo'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType:'ResourceView',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    resourceInfo: 'resources'
                },
                enableUndoRedo: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: selfReferenceResource,
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],
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
    it('Checking for error element', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[4] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove',20,1000)
        ganttObj_self.rowDragAndDropModule['removeErrorElem']()
        expect(document.querySelector('.e-errorelem') === null).toBe(true)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Dragging parentId data below', () => {
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
    it('Checking taskbar taskId after dragging', function () {
        ganttObj_self.reorderRows([2], 6, 'below');
        expect(parseInt(ganttObj_self.flatData[10].ganttProperties.taskId)).toBe(3)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Read only and Resource View', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
                showOverAllocation: true,
                viewType:"ResourceView",
                readOnly:true,
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
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking index of taskbar', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[0] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove', 27, 77)
        triggerMouseEvent(dragElement,'mouseup', 27, 77);
        expect(ganttObj_self.currentViewData[0].index).toBe(0)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});
describe('Triggering Row drag and drop event in resource view', () => {
    let ganttObj_self: Gantt;
    beforeAll((done: Function) => {
        ganttObj_self = createGantt(
            {
                dataSource: normalResourceData,
                resources: resourceCollection,
                allowRowDragAndDrop: true,
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
                viewType:"ResourceView",
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
                gridLines:'Both',
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Position in resource view', function () {
        let dragElement: HTMLElement = document.getElementsByClassName('e-icon-rowdragicon')[4] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, (dragElement.offsetTop + 500));
        mouseMoveFunction('mousemove', 48, 301)
        triggerMouseEvent(dragElement,'mouseup', 48, 301);
        expect(ganttObj_self.currentViewData[4].level).toBe(1)
    });
    afterAll(() => {
        if (ganttObj_self) {
            destroyGantt(ganttObj_self);
        }
    });
});

