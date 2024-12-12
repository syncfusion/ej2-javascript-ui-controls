/**
 * Gantt sort spec
 */
import { Gantt,Selection, Sort,UndoRedo,Edit,Toolbar, RowDD,Filter, ContextMenu, ContextMenuClickEventArgs, ColumnMenu, DayMarkers, Reorder, Resize, CriticalPath } from '../../src/index';
import { baselineData, cellEditData, filteredData, projectData, projectData1, projectData2, projectData3, projectData4, resourceDataUndo, resourceResourcesUndo, resourcesData, sbSampleResource, sbSampleResourceData, undoredo907807,multipleResourcesData  } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ResizeArgs } from '@syncfusion/ej2-grids';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt undoredo support', () => {
    describe('Gantt undo redo action for new record', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Undo action for Add new record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'delete') {
                    expect(ganttObj.flatData.length).toBe(41);
                }
            };
            ganttObj.addRecord();
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
        it('Redo actin for add record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'add') {
                    expect(ganttObj.flatData.length).toBe(42);
                }
            };
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_redo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
    });
    describe('Gantt undo redo action for indent Outdent', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar , Selection);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete','Indent','Outdent'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Undo action for indent', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'outdented') {
                    expect(ganttObj.flatData[2].hasChildRecords).toBe(false);
                }
            };
            ganttObj.selectRow(3);
            ganttObj.indent();
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
        it('Redo action for indent', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'indented') {
                    expect(args.dropIndex).toBe(2);
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for row drag drop', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                    {
                        TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                        Indicators: [
                            {
                                'date': '04/10/2019',
                                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                'name': 'Indicator title',
                                'tooltip': 'tooltip'
                            }
                        ]
                    },
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('row drag drop', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'rowDropped') {
                    expect(parseInt(ganttObj.flatData[1].ganttProperties.taskId)).toBe(3);
                }
            };
            ganttObj.reorderRows([1], 3, 'child');
        });
        it('Undo action for row drag drop', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'rowDropped') {
                    expect(parseInt(ganttObj.flatData[1].ganttProperties.taskId)).toBe(2);
                }
            };
            ganttObj.undo()
        });
    });
    describe('Gantt undo redo action for taskbar editing', () => {
        Gantt.Inject(Sort,Selection, UndoRedo, Edit, Toolbar, RowDD,Filter, ContextMenu, ColumnMenu, Selection);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                    {
                        TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                        Indicators: [
                            {
                                'date': '04/10/2019',
                                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                'name': 'Indicator title',
                                'tooltip': 'tooltip'
                            }
                        ]
                    },
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
                    renderBaseline: true,
                    baselineColor: 'red',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'CustomColumn', headerText: 'CustomColumn' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomIn','ZoomOut'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('progress resize', () => {
            ganttObj.taskbarEdited = (args: any) => {
                expect(args.data.ganttProperties.progress).toBe(0);
                expect(args.taskBarEditAction).toBe('ProgressResizing');
                expect(args.editingFields.progress).toBe(0);
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 0, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Undo action for progress resize', () => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.flatData[1].ganttProperties.progress).toBe(30);
            };
            ganttObj.undo()
        });
        it('Zooming actions', () => {
            ganttObj.zoomIn();
        });
        it('Undo action for zoomin', () => {
            ganttObj.undo();
            setTimeout(() => {
                expect(ganttObj.currentZoomingLevel.level).toBe(11);
            }, 100);
        });
        it('Timespan action', () => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe('6/2/2019');
            }
            ganttObj.nextTimeSpan();
        });
        it('undo action for Timespan action', () => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe('5/30/2019');
            }
            ganttObj.undo();
        });
        it('delete action', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType == 'delete') {
                    expect(ganttObj.currentViewData.length).toBe(1);
                }
            }
            ganttObj.deleteRecord(1);
        });
        it('undo action for delete action', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType == 'add') {
                    expect(ganttObj.currentViewData.length).toBe(5);
                }            }
            ganttObj.undo();
        });
    });
    describe('Gantt undo redo action for context menu', () => {
        Gantt.Inject(Selection,Sort, UndoRedo, Edit, Toolbar, RowDD, ContextMenu);
        let ganttObj: Gantt;
        let splitTasksData: object[] = [
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
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                        segments: 'Segments'
                    },
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Merge segment action', () => {
            ganttObj.mergeTask(3,[{ 'firstSegmentIndex': 0, 'secondSegmentIndex': 1 }]);
            expect(ganttObj.flatData[2].ganttProperties.segments.length).toBe(2);
        });
        it('undo Merge segment', () => {
            ganttObj.undo();
            expect(ganttObj.flatData[2].ganttProperties.segments.length).toBe(3);
        });
        it('convert to milestone action', () => {
            ganttObj.convertToMilestone('4');
            expect(ganttObj.flatData[3].ganttProperties.isMilestone).toBe(true);
        });
        it('undo convert to milestone', () => {
            ganttObj.undo();
            expect(ganttObj.flatData[3].ganttProperties.isMilestone).toBe(false);
        });
    });
    describe('cell edit for undo redo module', () => {
        Gantt.Inject(Selection,Sort, UndoRedo, Edit, Toolbar, RowDD, ContextMenu);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
            
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableMultiTaskbar: true,
        enableUndoRedo: true,
        undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
        allowTaskbarOverlap: true,
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
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
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
        it('edit dependency column', () => {
            let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(dependency, 'dblclick');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FS');
        });
    });
    describe('cell edit for undo redo module', () => {
        Gantt.Inject(Selection, Sort, UndoRedo, Edit, Toolbar, RowDD, ContextMenu);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
            
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableMultiTaskbar: true,
        enableUndoRedo: true,
        undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
        allowTaskbarOverlap: true,
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
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
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
        it('edit dependency column', () => {
            let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(dependency, 'dblclick');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FS');
        });
    });
    describe('Edit action undefined in undoRedoActions', () => {
        Gantt.Inject(Selection, Sort, UndoRedo, Edit, Toolbar, RowDD, ContextMenu);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },

        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableMultiTaskbar: true,
        enableUndoRedo: true,
        undoRedoActions: ['Sorting', 'Add'],
        allowTaskbarOverlap: true,
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
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
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
        it('convert to milestone', (done: Function) => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.getUndoActions.length).toBe(0);
            };
            ganttObj.convertToMilestone('2');
            done()
        });
    });
    describe('Gantt Searching', () => {
        Gantt.Inject(Selection,Filter, Toolbar, UndoRedo,);
        let ganttObj: Gantt;
        let data : Object[]=  [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource:data,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                    },
                    enableUndoRedo: true,
                    undoRedoActions: ['Filtering', 'Search'],
                    columns: [
                        { field: 'TaskID', visible: false },
                        {
                            field: 'TaskName',
                            headerText: 'Task Name',
                            width: '250',
                            clipMode: 'EllipsisWithTooltip',
                        },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration' },
                        { field: 'EndDate', headerText: 'End Date' },
                        { field: 'Predecessor', headerText: 'Predecessor' },
                    ],
                    searchSettings: {
                        hierarchyMode: 'Both',
                    },
                    toolbar: ['Search','Undo','Redo'],
                    allowFiltering: true
                }, done);
        });
        it('searching Taskname', (done : Function) => {
            ganttObj.search('Defining');
            ganttObj.actionComplete = function (args) {
                if (args.requestType == 'searching') {
                    expect(ganttObj.currentViewData.length).toBe(3);
                }
                done();
            };
            ganttObj.undo();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt Sorting', () => {
        Gantt.Inject(Selection, Toolbar,UndoRedo, DayMarkers, Sort );
        let ganttObj: Gantt;
        let data : Object[]=  [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource:data,
                    height: '450px',
                    enableUndoRedo: true,
                    allowSorting: true,
                    undoRedoActions: ['Sorting'],
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
                      columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name' },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration'},
                        { field: 'Progress', headerText: 'Progress' }
                    ],
                    toolbar: [
                    'Undo', 'Redo'],
                    treeColumnIndex: 1,
                    labelSettings: {
                        leftLabel: 'TaskName'
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Gantt sorting', (done: Function) => {
            ganttObj.sortColumn('TaskID','Descending',true);
            ganttObj.actionComplete = function (args) {
                if (args.requestType === 'sorting') {
                    expect(ganttObj.currentViewData.length).toBe(5);
                }
                ganttObj.undo(); 
                ganttObj.redo();
                done();
            };
           
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt Column Reorder', () => {
        Gantt.Inject(Filter, Toolbar, UndoRedo,Reorder, RowDD, Resize, Selection);
        let ganttObj: Gantt;
        let data: Object[] = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                    {
                        TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                        Indicators: [
                            {
                                'date': '04/10/2019',
                                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                'name': 'Indicator title',
                                'tooltip': 'tooltip'
                            }
                        ]
                    },
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: data,
                    allowReordering: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                    },
                    enableUndoRedo: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    searchSettings: {
                        hierarchyMode: 'Both',
                    },
                    toolbar: ['Search', 'Undo', 'Redo'],
                    allowFiltering: true,
                }, done);
        });
        it('column reorder', (done: Function) => {
            ganttObj.reorderColumns('TaskName', 'EndDate');
            ganttObj.actionComplete = function (args) {
                if (args.requestType === 'reorder') {
                    expect(ganttObj.treeGrid.getColumns()[3].field).toBe('TaskName');
                }
                ganttObj.undo();
                ganttObj.redo()
            };
            done();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for add', () => {
        Gantt.Inject(Selection,Sort,Filter, UndoRedo, Edit, Toolbar, RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                { dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType:'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Undo action for Add new record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'delete') {
                    expect(ganttObj.flatData.length).toBe(25);
                }
            };
            ganttObj.addRecord();
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
            ganttObj.redo();
        });
    });
    describe('Gantt undo redo action for zoom in', () => {
        Gantt.Inject(Selection,Sort, UndoRedo, Edit, Toolbar, RowDD,Filter);
        let ganttObj: Gantt;
        var projectNewData = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                    {
                        TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                        Indicators: [
                            {
                                'date': '04/10/2019',
                                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                'name': 'Indicator title',
                                'tooltip': 'tooltip'
                            }
                        ]
                    },
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ]
            },
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
                    allowSorting: true,
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
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'CustomColumn', headerText: 'CustomColumn' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomIn','ZoomOut'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Zooming actions', () => {
            ganttObj.zoomIn();
            ganttObj.undo();
            setTimeout(function () {
                expect(ganttObj.currentZoomingLevel.level).toBe(12);
            }, 100);
            ganttObj.redo();
        });
       
    });
    describe('Gantt column resize action', () => {
        Gantt.Inject(Resize,UndoRedo,Edit,Toolbar, RowDD,Filter, ContextMenu,Selection);
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
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelector('.e-headercell').classList.contains('e-resized')).toBe(true);
            ganttObj.undo();
            ganttObj.redo();
        });
    }); 
    describe('cell edit for undo redo module', () => {
        Gantt.Inject(Selection,Sort, UndoRedo, Edit, Toolbar, RowDD, ContextMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    enableUndoRedo: true,
                    undoRedoActions: [
                        'Sorting',
                        'Add',
                        'ColumnReorder',
                        'ColumnResize',
                        'ColumnState',
                        'Delete',
                        'Edit',
                        'Filtering',
                        'Indent',
                        'Outdent',
                        'NextTimeSpan',
                        'PreviousTimeSpan',
                        'RowDragAndDrop',
                        'Search',
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Undo', 'Redo'],
                    splitterSettings: {
                        position: "50%",
                        // columnIndex: 4
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
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/28/2019'),
                    projectEndDate: new Date('07/28/2019'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('edit taskname column', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
            ganttObj.undo();
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('Identify site location');
        });
    });
    describe('Gantt undo redo action for Filtering', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar ,Filter, Selection);
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar: ['Undo', 'Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 200);
        });
        it('Before Filtering Column', function () {
            expect(ganttObj.flatData.length > 0).toBe(true)
        });
        it('Filtering Column', () => {
            ganttObj.filterByColumn('TaskID','Equal',1)
        });
        it('Checking data after undo filtering', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'refresh') {
                    expect(ganttObj.currentViewData.length > 1).toBe(true);
                    done()
                }
            };
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
        it('Checking data after redo filtering', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === "filtering") {
                    expect(args.rows.length).toBe(1);
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for Searching', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar ,Filter, Selection);
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar: ['Undo', 'Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 200);
        });
        it('Search action', () => {
            ganttObj.search("Planning")
        });
        it('Checking data after undo Searching', (done:Function) => {
            ganttObj.actionComplete = function (args) {
                if (args.requestType === "searching" && args.searchString === "") {
                    expect(args.rows.length).toBe(41);
                    done();
                }
            };
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
        it('Checking data after redo Searching', (done:Function) => {
            ganttObj.actionComplete = function (args) {
                if (args.requestType === "searching" && args.searchString === "Planning") {
                    expect(args.rows.length).toBe(3);
                    done();
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for Show Hide', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar ,Filter, Selection);
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar: ['Undo', 'Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Hideing column', () => {
            ganttObj.hideColumn(ganttObj.treeGrid.getColumnByField('TaskName').headerText)
        });
        it('Checking data after undo Show Hide', () => {
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
            expect(ganttObj.columnByField['TaskName'].visible).toBeUndefined()
        });
        it('Checking data after redo Show Hide', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "columnstate") {
                    expect(args.columns[0].visible).toBe(false)
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for Row Drag and drop', () => {
        Gantt.Inject(Selection, Sort, Filter, UndoRedo, Edit, Toolbar, RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Undo action for Row drag no child record', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'save') {
                    expect(parseInt(ganttObj.flatData[5].ganttProperties.taskId)).toBe(3);
                    done()
                }
            };
            ganttObj.reorderRows([3],1,'child')
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for Zoom to fit', () => {
        Gantt.Inject(Selection, Sort, Filter, UndoRedo, Edit, Toolbar, RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomToFit'],
                    toolbar: ['Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Undo action for Zoom to fit', () => {
            ganttObj.fitToProject()
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
            expect(ganttObj.timelineSettings.topTier.unit).toBe('Week')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt undo redo action for Multiple Sorting', () => {
        Gantt.Inject(Selection, Sort, Filter, UndoRedo, Edit, Toolbar, RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomToFit'],
                    toolbar: ['Undo', 'Redo'],
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
            setTimeout(done, 200);
        });
        it('Sorting TaskId column', () => {
            ganttObj.sortColumn('TaskID','Ascending')
        });
        it('Sorting taskname column', () => {
            ganttObj.sortColumn('TaskName','Ascending',true)
        });
        it('Undo action for Multiple sorting', () => {
            let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
            triggerMouseEvent(undo, 'click');
            expect(ganttObj.flatData[0].ganttProperties.taskName).toBe('Martin Tamer')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt redo action for delete record record', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Undo action for delete record record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'add') {
                    expect(args.modifiedRecords.length).toBe(2);
                }
            };
            ganttObj.deleteRecord(3)
            ganttObj.undo()
        });
        it('Redo action for delete record record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'delete') {
                    expect(args.modifiedRecords.length).toBe(39);
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Removing undo redo module', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Removing undo redo module', () => {
            ganttObj.enableUndoRedo = false
        });
        it('Checking for undo redo module', () => {
            expect(ganttObj.undoRedoModule === undefined).toBe(true)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Triggering Findposition method', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Before Triggering findPosition event', () => {
            expect(ganttObj.flatData.length).toBe(41)
        });
        it('Triggering findPosition event', () => {
            let data = []
            data.push(ganttObj.flatData[3])
            let record = ganttObj.flatData[4]
            record['deletedIndexes'] = [ganttObj.flatData[4]]
            ganttObj.undoRedoModule['findPosition'](data,record,'deletedIndexes')
            expect(ganttObj.flatData.length).toBe(41)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Triggering Findposition method with resources', () => {
        Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings:{
                        allowAdding: true,
                        allowEditing:true,
                        allowDeleting: true
                    },
                    enableUndoRedo: true,
                    undoRedoActions:['Add','Edit','Delete'],
                    allowSorting: true,
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
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    toolbar:['Undo','Redo'],
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Before Triggering findPosition event', () => {
            expect(ganttObj.flatData.length).toBe(41)
        });
        it('Triggering findPosition event', () => {
            ganttObj.editModule.dialogModule.ganttResources = [{resourceGroup: "Planning Team" ,resourceId: 1,resourceName: "Martin Tamer",resourceUnit: 50}]
            ganttObj.resourceFields.id = 'resourceId'
            let data = []
            data.push(ganttObj.flatData[3])
            let record = ganttObj.flatData[4]
            record['deletedIndexes'] = [ganttObj.flatData[4]]
            ganttObj.undoRedoModule['findPosition'](data,record,'deletedIndexes')
            expect(ganttObj.flatData.length).toBe(41)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and drop with child and parent item', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData2,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('row drag drop', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'rowDropped') {
                    expect(ganttObj.flatData[3].level).toBe(2);
                    done()
                }
            };
            ganttObj.reorderRows([3],2,'child')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and drop with child and one parent item', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData3,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('row drag drop with only one parent item', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'rowDropped') {
                    expect(ganttObj.flatData[3].level).toBe(2);
                    done()
                }
            };
            ganttObj.reorderRows([3],2,'child')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and drop with level one parent', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData4,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Checking level after drag and drop', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'rowDropped') {
                    expect(ganttObj.flatData[4].level).toBe(3);
                    done()
                }
            };
            ganttObj.reorderRows([1],4,'child')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Next time span and redo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData3,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Next time span', () => {
            ganttObj.nextTimeSpan()
        });
        it('Undo Action Next time span', () => {
            ganttObj.undo()
        });
        it('Redo Action Next time span', () => {
            ganttObj.redo()
            expect(ganttObj.flatData.length).toBe(5)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and Drop with redo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData3,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Row Drag and Drop', () => {
            ganttObj.reorderRows([1],4,'child')
        });
        it('Undo Action Row Drag and Drop', () => {
            ganttObj.undo()
        });
        it('Redo Action Row Drag and Drop', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "rowDropped") {
                    expect(ganttObj.flatData[4].level).toBe(4)
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Cell edit and redo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData3,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('cell edit action', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Undo Action cell edit action', () => {
            ganttObj.undo()
        });
        it('Redo Action cell edit action', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.flatData[1]['TaskName']).toBe('TaskName updated')
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Delete Resource task and redo action', () => {
        Gantt.Inject(Sort, Selection, UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID'},
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Delete Resource task', () => {
            ganttObj.deleteRecord(ganttObj.flatData[0])
        });
        it('Undo Action Delete Resource task', () => {
            ganttObj.undo()
        });
        it('Redo Action Delete Resource task', (done: Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "delete") {
                    expect(ganttObj.flatData.length).toBe(25)
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Cell edit in resourceview and undo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Cell edit in resourceview', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Undo Action Cell edit in resourceview', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.flatData[1]['TaskName']).toBe('Identify site location')
                    done()
                }
            };
            ganttObj.undo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and drop in resource view and redo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Row Drag and drop', () => {
            ganttObj.reorderRows([1],3,'above')
        });
        it('Undo Action Row Drag and drop', () => {
            ganttObj.undo()
        });
        it('Redo Action Row Drag and drop', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "rowDropped") {
                    expect(args.dropIndex).toBe(3)
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Cell edit in resourceview and redo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Cell edit in resourceview', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Undo Action Cell edit in resourceview', () => {
            ganttObj.undo()
        });
        it('Redo Action Cell edit in resourceview', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.flatData[1]['TaskName']).toBe('TaskName updated')
                    done()
                }
            };
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Stack two undo action', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    undoRedoStepsCount:1,
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Stacking two undo action', () => {
            let data = {
                TaskID: 3,
                TaskName: 'Updated by index value',
                StartDate: new Date('04/02/2019'),
                Duration: 4,
                Progress: 50
            };
            ganttObj.updateRecordByID(data);
        });
        it('Checking for updated record', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.flatData[3]['TaskName']).toBe('Updated by index value')
                    done()
                }
            }
            let data = {
                TaskID: 3,
                TaskName: 'Updated by index value',
                StartDate: new Date('04/02/2019'),
                Duration: 4,
                Progress: 50
            };
            ganttObj.updateRecordByID(data);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row drag and drop multiple record in project view', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSorting: true,
                    allowReordering: true,
                    allowTaskbarDragAndDrop: true,
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
                    enableUndoRedo: true,
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
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
        it('Mutiple row drag and drop action', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "rowDropped") {
                    expect(ganttObj.flatData[7].level).toBe(2)
                    done()
                }
            };
            ganttObj.reorderRows([2,3],9,'above')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Drag and Drop multiple record in resource view', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Multiple row drag and drop', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "rowDropped") {
                    expect(ganttObj.flatData[5].level).toBe(1)
                    done()
                }
            }
            ganttObj.reorderRows([7,8],1,'above')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Delete parent with multiple child resource view', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Checking flat data after delete', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "delete") {
                    expect(ganttObj.flatData.length).toBe(24)
                    done()
                }
            }
            ganttObj.deleteRecord(ganttObj.flatData[6])
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Row Drag and Drop parent record resource view', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Row Drag and Drop parent record', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "rowDropped") {
                    expect(ganttObj.flatData[1].level).toBe(1)
                    done()
                }
            }
            ganttObj.reorderRows([0,2],5,'above')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Deleting unassigned task', () => {
        Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceDataUndo,
                    resources: resourceResourcesUndo,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        work: 'work',
                        type: 'taskType',
                        resourceInfo: 'resources'
                    },
                    taskType: 'FixedWork',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'unit'
                    },
                    allowSorting: true,
                    viewType: 'ResourceView',
                    enableUndoRedo: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                    },
                    columns: [
                        { field: 'TaskID' },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },
                        { field: 'resources', headerText: 'Resources', width: '160' },
                        { field: 'work', width: '110' },
                        { field: 'Duration', width: '100' },
                        { field: 'taskType', headerText: 'Task Type', width: '110' }
                    ],
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Making task unassigned', () => {
            ganttObj.deleteRecord(ganttObj.flatData[0])
        });
        it('Deleting unassigned task', () => {
            ganttObj.deleteRecord(ganttObj.flatData[23])
        });
        it('Undo Action', () => {
            ganttObj.undo()
        });
        it('Redo Action', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "delete") {
                    expect(args.data[0].TaskID).toBe(2)
                    done()
                }
            }
            ganttObj.redo()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    // describe('Deleting Resource using dialog', () => {
    //     Gantt.Inject(Sort, Selection,UndoRedo, Edit, Toolbar, RowDD, Filter,DayMarkers);
    //     let ganttObj: Gantt;
    //     beforeAll((done: Function) => {
    //         ganttObj = createGantt(
    //             {
    //                 dataSource:sbSampleResourceData,
    //                 resources:sbSampleResource,
    //                 viewType: 'ResourceView',
    //                 showOverAllocation: true,
    //                 taskFields: {
    //                     id: 'TaskID',
    //                     name: 'TaskName',
    //                     startDate: 'StartDate',
    //                     endDate: 'EndDate',
    //                     duration: 'Duration',
    //                     progress: 'Progress',
    //                     dependency: 'Predecessor',
    //                     resourceInfo: 'resources',
    //                     work: 'work',
    //                     child: 'subtasks'
    //                 },
    //                 taskType: 'FixedWork',
    //                 resourceFields: {
    //                     id: 'resourceId',
    //                     name: 'resourceName',
    //                     unit: 'resourceUnit',
    //                     group: 'resourceGroup'
    //                 },
    //                 editSettings: {
    //                     allowAdding: true,
    //                     allowEditing: true,
    //                     allowDeleting: true,
    //                     allowTaskbarEditing: true,
    //                     showDeleteConfirmDialog: true
    //                 },
    //                 columns: [
    //                     { field: 'TaskID', visible: false },
    //                     { field: 'TaskName', headerText: 'Name', width: 250 },
    //                     { field: 'work', headerText: 'Work' },
    //                     { field: 'Progress' },
    //                     { field: 'resourceGroup', headerText: 'Group' },
    //                     { field: 'StartDate' },
    //                     { field: 'Duration' },
    //                 ],
    //                 labelSettings: {
    //                     rightLabel: 'resources',
    //                     taskLabel: 'Progress'
    //                 },
    //                 splitterSettings: {
    //                     columnIndex: 3
    //                 },
    //                 enableUndoRedo: true,
    //                 allowResizing: true,
    //                 allowSelection: true,
    //                 highlightWeekends: true,
    //                 treeColumnIndex: 1,
    //                 height: '450px',
    //                 projectStartDate: new Date('03/28/2024'),
    //                 projectEndDate: new Date('05/18/2024'),
    //                 undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
    //                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
    //                     'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
    //             }, done);
    //     });
    //     it('Opening Dialog', function () {
    //         ganttObj.openEditDialog(1);
    //         let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
    //         resourceTab.selectedItem = 2;
    //     });
    //     it('Deleting resources', (done:Function) => {
    //         ganttObj.actionComplete = function (args: any): void {
    //             if (args.requestType === "save") {
    //                 expect(args.data.ganttProperties.resourceInfo.length).toBe(0)
    //                 done()
    //             }
    //         };
    //         let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-check') as HTMLElement;
    //         if (checkbox) {
    //             triggerMouseEvent(checkbox, 'click');
    //             let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
    //             triggerMouseEvent(saveRecord, 'click');
    //         }
    //     });
    //     afterAll(() => {
    //         if (ganttObj) {
    //             destroyGantt(ganttObj);
    //         }
    //     });
    // });
    
});
describe('Gantt undo redo action for zooming', () => {
    Gantt.Inject(Selection,Sort,Filter, UndoRedo, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resourceDataUndo,
                resources: resourceResourcesUndo,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                    resourceInfo: 'resources'
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                viewType:'ResourceView',
                enableUndoRedo: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator:{
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                zoomingLevels : [

                    {
                        topTier: {
                            unit: 'Month',
                            format: 'MMM, yyyy',
                            count: 1,
                        },
                        bottomTier: {
                            unit: 'Month',
                            format: 'dd MMM',
                            count: 1,
                        }, timelineUnitSize: 99,
                        level: 1,
                        timelineViewMode: 'Month',
                    },
                    {
                        topTier: {
                            unit: 'Year',
                            format: 'MMM dd, yyyy',
                            count: 1,
                        },
                        bottomTier: {
                            unit: 'Month',
                            format: 'd',
                            count: 1,
                        }, timelineUnitSize: 33,
                        level: 2,
                        timelineViewMode: 'Month',
                    },
                ],
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
    it('Undo action for zoom action', () => {
        ganttObj.fitToProject();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe('2/26/2019');
    });
});
describe('time span for year mode', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let resource: Object[] = [{
        TaskID: 10, TaskName: 'Sign contract', StartDate: new Date('04/01/2024'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator:{
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                        unit: 'Year',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Month',
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
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('time span for year mode', () => {
        ganttObj.previousTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/1/2019");
    });
});
describe('time span for month mode', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let resource: Object[] = [{
        TaskID: 10, TaskName: 'Sign contract', StartDate: new Date('04/01/2024'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator:{
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                        unit: 'Month',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Week',
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
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('time span for month mode', () => {
        ganttObj.previousTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("3/1/2019");
    });
    it('time span for month mode', () => {
        ganttObj.nextTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe("6/1/2019");
    });
});
describe('time span for day mode', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let resource: Object[] = [{
        TaskID: 10, TaskName: 'Sign contract', StartDate: new Date('04/01/2024'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator:{
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                        unit: 'Day',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Hour',
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
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('time span for day mode', () => {
        ganttObj.previousTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("3/24/2019");
    });
    it('time span for day mode', () => {
        ganttObj.nextTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe("5/31/2019");
    });
});
describe('time span for day mode', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let resource: Object[] = [{
        TaskID: 10, TaskName: 'Sign contract', StartDate: new Date('04/01/2024'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator:{
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
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
                        unit: 'Hour',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Minutes',
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
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('03/30/2019'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('time span for hour mode', () => {
        ganttObj.previousTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("3/24/2019");
    });
    it('time span for hour mode', () => {
        ganttObj.nextTimeSpan();
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe("3/30/2019");
    });
});


describe('delete record for child position', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
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
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('delete record', () => {
        ganttObj.deleteRecord(4);
    });
    it('Undo action for deleted record', () => {
        expect(ganttObj.getUndoActions().length).toBe(1);
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(0);
    });
});

describe('delete record for below position', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
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
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('delete record', () => {
        ganttObj.deleteRecord(3);
    });
    it('Undo action for deleted record', () => {
        expect(ganttObj.getUndoActions().length).toBe(1);
        ganttObj.undo();
    });
});

describe('Cell edit for predecessor column', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
                }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('add predecessor for parent record', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '6FS';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
    });
    it('Undo action for parent predecessor record', () => {
        ganttObj.undoRedoModule['getUndoCollection'][ganttObj.undoRedoModule['getUndoCollection'].length - 1]['connectedRecords'] = [ganttObj.flatData[5]];
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(0);
    });
});

describe('Column reorder', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
                }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Column reorder', () => {
        ganttObj.reorderColumns('TaskName', 'Duration');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
    });
    it('Undo action for column reorder', () => {
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(0);
    });
    it('redo action for column reorder', () => {
        ganttObj.redo();
        expect(ganttObj.getUndoActions().length).toBe(1);
    });
});
describe('Column reorder', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
                }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('perform zoom to  fit', () => {
        ganttObj.fitToProject();
        expect(ganttObj.getUndoActions.length).toBe(0);
    });
    it('Undo action for zoom to fit', () => {
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(0);
    });
    it('redo action for zoom to fit', () => {
        ganttObj.redo();
        expect(ganttObj.getUndoActions().length).toBe(1);
    });
});
describe('sort columns', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
                }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableUndoRedo: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                allowTaskbarDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: false
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Delete', 'Update', 'Undo', 'Redo'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('clear sort', () => {
        ganttObj.clearSorting();
        expect(ganttObj.getUndoActions.length).toBe(0);
    });
    it('Undo action for sorted columns', () => {
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(1);
    });
    it('redo action for sorting', () => {
        ganttObj.redo();
        expect(ganttObj.getUndoActions().length).toBe(2);
    });
});

describe('Dialog editing - Resource Tab for single record', () => {
    let ganttObj: Gantt;
    let resourcesData = [
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
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
    ];
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
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
                toolbar: ['Add', 'Undo', 'Redo'],
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
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
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    ganttObj.openAddDialog();
        let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
        tab.selectedItem = 2;
    });
    it('Resource tab editing', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(ganttObj.flatData.length).toBe(15);
            }
        };
        let checkbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        if (checkbox1) {
            triggerMouseEvent(checkbox1, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        }
    });
    it('undo action for Resource tab editing', () => {
        ganttObj.undo();
    });
    it('redo action Resource tab editing', () => {
        ganttObj.redo();
    });
});

describe('Dialog editing - Resource Tab for multiple records', () => {
    let ganttObj: Gantt;
    let resourcesData = [
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
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
    ];
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
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
                    { field: 'work', headerText: 'Work',visible: false },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
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
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    ganttObj.openAddDialog();
        let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
        tab.selectedItem = 2;
    });
    it('Resource tab editing', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(ganttObj.flatData.length).toBe(15);
            }
        };
        let checkbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let checkbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        if (checkbox1) {
            triggerMouseEvent(checkbox1, 'click');
            triggerMouseEvent(checkbox2, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        }
    });
    it('undo action for Resource tab editing', () => {
        ganttObj.undo();
    });
    it('redo action Resource tab editing', () => {
        ganttObj.redo();
    });
});

describe('show/hide columns', () => {
    let ganttObj: Gantt;
    let resourcesData = [
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
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
    ];
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
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
                    { field: 'work', headerText: 'Work',visible: false },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
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
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    it('Show column for hided column', () => {
        ganttObj.showColumn('Work');
        expect(ganttObj.ganttColumns[2].visible).toBe(false);
    });
    it('undo action shown column', () => {
        ganttObj.undo();
        expect(ganttObj.getUndoActions().length).toBe(0);
    });
    it('redo action hided column', () => {
        ganttObj.redo();
        expect(ganttObj.getRedoActions().length).toBe(0);
    });
});

describe('show/hide columns', () => {
    Gantt.Inject(UndoRedo,CriticalPath,Selection,Edit,Toolbar)
    let ganttObj: Gantt;
    let resourcesData = [
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
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
    ];
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: resourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                enableCriticalPath: true,
                allowSorting: true,
                allowReordering: true,
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
                    { field: 'work', headerText: 'Work',visible: false },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
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
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    it('Show column for hided column', () => {
        ganttObj.clearRedoCollection();
        ganttObj.clearUndoCollection();
        ganttObj['showCriticalPath'](true);
        ganttObj.clearSelection();
    });
});

describe('Gantt Edit action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cellEditData,
                viewType:'ResourceView',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    notes: 'Notes',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    resourceInfo: 'Resource',
                    dependency: 'Predecessor',
                    indicators: 'Indicators',
                    child: 'subtasks',
                    cssClass: 'cssClass',
                },
                enableUndoRedo: true,
                resourceIDMapping: 'resourceId',
                resourceNameMapping: 'resourceName',
                resources: resourcesData,
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
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                splitterSettings: {
                    columnIndex: 9
                },
                allowSelection: true,
                allowUnscheduledTasks: true,
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                    { field: 'Progress', width: 100 },
                    { field: 'BaselineStartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Resource', width: 100 },
                    { field: 'Notes', width: 100 },
                    { field: 'Customcol', headerText: 'Custom Column', editType: 'datepickeredit', width: 100 }
                ],
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('Add record to child position', () => {
        ganttObj.previousTimeSpan();
        let data: object[] = [{ TaskID: 9, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
        BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]}];
        ganttObj.addRecord(data[0],'Child',0);
        expect(ganttObj.flatData.length).toBe(13);
    });
});
describe('Gantt undo redo action for Multiple Sorting', () => {
    Gantt.Inject(Selection, Sort, Filter, UndoRedo, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourceDataUndo,
                resources: resourceResourcesUndo,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                    resourceInfo: 'resources'
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                viewType: 'ResourceView',
                enableUndoRedo: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomToFit'],
                toolbar: ['Undo', 'Redo'],
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
        setTimeout(done, 200);
    });
    it('Sorting taskname column', () => {
        ganttObj.sortColumn('TaskName','Ascending',true);
    });
    it('Undo action for Multiple sorting', () => {
        ganttObj.undo();
    });
    it('redo action for Multiple sorting', () => {
        ganttObj.redo();
        expect(ganttObj.getRedoActions().length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt redo action for delete parent record', () => {
    Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings:{
                    allowAdding: true,
                    allowEditing:true,
                    allowDeleting: true
                },
                enableUndoRedo: true,
                undoRedoActions:['Add','Edit','Delete'],
                allowSorting: true,
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
                //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                toolbar:['Undo','Redo'],
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Undo action for delete record record', () => {
        ganttObj.deleteRecord(ganttObj.flatData[1])
        ganttObj.undo();
    });
    it('Redo action for delete record record', () => {
        ganttObj.actionComplete = function (args: any): void {
            if(args.requestType === 'delete') {
                expect(ganttObj.flatData.length).toBe(34);
            }
        };
        ganttObj.redo()
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR907807- Gantt redo action for delete records', () => {
    Gantt.Inject(Sort,UndoRedo,Edit,Toolbar, Selection );
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: undoredo907807,
                height: '450px',
                highlightWeekends: true,
                showColumnMenu: true,
                enableContextMenu: true,
                allowFiltering: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowResizing: true,
                allowReordering: true,
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
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID', width: 100 },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor', headerText: 'Dependency' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Undo', 'Redo'],
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                treeColumnIndex: 1,
                labelSettings: {
                    leftLabel: 'TaskName'
                },
                splitterSettings: {
                    columnIndex: 2
                },
                projectStartDate: new Date('03/24/2024'),
                projectEndDate: new Date('07/06/2024')
            }, done);
    });
    it('delete record', () => {
        ganttObj.deleteRecord(4);
        ganttObj.deleteRecord(3);
        ganttObj.deleteRecord(2);
        ganttObj.deleteRecord(1);
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Multiple resource delete', () => {
    Gantt.Inject(Sort, UndoRedo, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: multipleResourcesData,
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
                    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
                    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
                    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
                ],
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                enableUndoRedo: true,
                allowReordering: true,
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
                selectedRowIndex: 3,
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
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                toolbar: ['Undo', 'Redo', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('delete multiple records', () => {
        ganttObj.deleteRecord(ganttObj.flatData[3]);
        expect(ganttObj.flatData.length === 18).toBe(true);
    });
    it('Undo the action', () => {
        ganttObj.undo();
        expect(ganttObj.flatData.length === 20).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});