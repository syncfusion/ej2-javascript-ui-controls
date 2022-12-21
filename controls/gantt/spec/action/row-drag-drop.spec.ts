/**
 * Gantt Drag and drop spec
 */
import { Gantt, Edit, Selection, IGanttData, RowDD, Filter, Toolbar, ColumnMenu} from '../../src/index';
import { dragSelfReferenceData, normalResourceData, resourceCollection, editingData, projectData,projectResources } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';

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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
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
          ganttObj.dataBind();
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
    beforeEach((done: Function) => {
        setTimeout(done, 1000);
    });
    it('Drag and drop', function () {
        ganttObj_self.reorderRows([3],0,'below')
        expect(ganttObj_self.dataSource[1].TaskID).toBe(4);
    });
});



