/**
 * Gantt base spec
 */
import { Gantt, Edit, CriticalPath, ContextMenu, ContextMenuClickEventArgs, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport, ITaskbarEditedEventArgs } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { multiTaskbarData, projectData1, resources, normalResourceData, resourceCollection, criticalPathData, taskModeData1, taskModeData2, criticalPathData1, criticalPathData2, bwData1, bwData2, bwData3, bwData4 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
Gantt.Inject(Edit, CriticalPath, ContextMenu, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport);
describe('Gantt spec for critical path', () => {
    describe('critical path rendering', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'update', id: 'update' }],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Initial rendering critical path ', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
            expect(ganttObj.flatData[16].isCritical).toBe(false);
            expect(ganttObj.flatData[17].isCritical).toBe(false);
        });
        it('Drag and Drop', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'refresh') {
                    expect(ganttObj.flatData[33].isCritical).toBe(false);
                }
            };
            ganttObj.reorderRows([27], 35, 'child');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Right resizing taskbar', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'update', id: 'update' }],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Right Resizing', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(41) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Progress Resizing', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'ProgressResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -10, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Delete dependency', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save') {
                    expect(ganttObj.flatData[18].isCritical).toBe(false);
                }
            };
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(20) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e = {
                item: ganttObj.contextMenuModule.contextMenu.items[5].items[0],
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
        it('Add record child', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'refresh') {
                    expect(ganttObj.flatData[40].isCritical).toBe(true);
                    expect(ganttObj.flatData[38].isCritical).toBe(false);
                }
            };
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(39)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        it('Right Resizing SF', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 150, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right Resizing FF', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                    expect(ganttObj.flatData[4].isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 600, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right Resizing SS', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                    expect(ganttObj.flatData[4].isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 700, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF with diff duration units', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Duration units with hour and minute', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for diff taskmode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskModeData1,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Manual',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                    // columnIndex: 4
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),

            }, done);
        });
        it('Custom taskmode', () => {
            expect(ganttObj.flatData[10].isCritical).toBe(false);
            expect(ganttObj.flatData[11].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(true);
            expect(ganttObj.flatData[13].isCritical).toBe(true);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for SF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 85, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for SS', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 440, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for FS', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'LeftResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 680, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('taskbar resize for diff taskmode', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskModeData2,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Manual',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                    // columnIndex: 4
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),

            }, done);
        });
        it('Custom taskmode', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 420, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering FS and FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData1,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(true);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering FS and FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData2,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(true);
        });
        it('Editing start date column without predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate') as any).ej2_instances[0];
            input.value = new Date('02/22/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Editing start date column with predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate') as any).ej2_instances[0];
            input.value = new Date('02/16/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view with predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskType: 'FixedWork',
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
                enableCriticalPath: true,
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view without predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskType: 'FixedWork',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
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
                enableCriticalPath: true,
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['ZoomToFit', 'CriticalPath'],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Initial rendering critical path ', () => {
            ganttObj.fitToProject();
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);
            let criticalpath: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_critical-path') as HTMLElement;
            triggerMouseEvent(criticalpath, 'click');
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view without predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskType: 'FixedWork',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
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
                enableCriticalPath: true,
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Critical path rendering for resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
                enableCriticalPath: true,
                enableMultiTaskbar: true,
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
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resources', headerText: 'Group' },
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
            }, done);
        });
        it('Multitaskbar Resource view', () => {
            expect(ganttObj.currentViewData[15].ganttProperties.isCritical).toBe(true);
        });
        it('Multitaskbar Resource view', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.currentViewData[1].ganttProperties.isCritical).toBe(true);
                    expect(ganttObj.currentViewData[2].ganttProperties.isCritical).toBe(true);
                }
            };
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let input: any = (ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as any).ej2_instances[0];
            input.value = '16 days';
            input.dataBind();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Critical path rendering for resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
                enableCriticalPath: true,
                enableMultiTaskbar: true,
                collapseAllParentTasks: true,
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
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resources', headerText: 'Group' },
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
            }, done);
        });
        it('Multitaskbar Resource view', () => {
            expect(ganttObj.currentViewData[15].ganttProperties.isCritical).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});

describe('clone taskbar Right resizing taskbar', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectData1,
            allowSelection: true,
            allowResizing: true,
            allowSorting: true,
            enableContextMenu: true,
            enableCriticalPath: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                { text: 'update', id: 'update' }],
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
        }, done);
    });
    it('Right Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                expect(args.data.isCritical).toBe(true);
            }
        }
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(41) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(!isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(!isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Progress Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'ProgressResizing') {
                expect(args.data.isCritical).toBe(false);
            }
        }
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -10, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(!isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(!isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('critical path rendering with empty datasource', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
            allowSelection: true,
            allowResizing: true,
            allowSorting: true,
            enableContextMenu: true,
            enableCriticalPath: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['ZoomToFit', 'CriticalPath'],
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
        }, done);
    });
    it('critical path with datasource ', () => {
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly when the baseline is changed dynamically', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData1,
            allowSorting: true,
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
            splitterSettings: {
                columnIndex: 2,
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'CriticalPath',],
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
                taskLabel: 'Progress',
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.renderBaseline = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly when the baseline is changed dynamically', () => {
    let ganttObj: Gantt;


    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData2,
            allowSorting: true,
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
            splitterSettings: {
                columnIndex: 2,
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'CriticalPath',],
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
                taskLabel: 'Progress',
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.renderBaseline = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly issue', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData3,
            allowSorting: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan', 'CriticalPath'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            enableCriticalPath: false,
            allowRowDragAndDrop: true,
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
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Index is not updated', () => {

    let ganttObj: Gantt;
  
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData4,
            allowSorting: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan', 'CriticalPath'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            enableCriticalPath: false,
            allowRowDragAndDrop: true,
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
        }, done);
    });
    it('check index', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType = 'delete') {
                ganttObj.flatData[1].index = 1;
            }
        }
        let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        triggerMouseEvent(deleteToolbar, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
