/**
 * Gantt sort spec
 */
import { Gantt,Selection, Sort,UndoRedo,Edit,Toolbar, RowDD,Filter, ContextMenu, ContextMenuClickEventArgs, ColumnMenu, DayMarkers, Reorder, Resize } from '../../src/index';
import { baselineData, filteredData, projectData, projectData1, resourceDataUndo, resourceResourcesUndo } from '../base/data-source.spec';
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
});
