/**
 * Gantt base spec
 */
 import { Gantt, Edit,CriticalPath, ContextMenu, ContextMenuClickEventArgs, RowDD } from '../../src/index';
 import * as cls from '../../src/gantt/base/css-constants';
 import { multiTaskbarData, projectData1, resources, normalResourceData, resourceCollection } from '../base/data-source.spec';
 import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
 describe('Gantt spec for critical path', () => {
     describe('critical path rendering', () => {
         Gantt.Inject(CriticalPath, RowDD);
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
         afterAll(() => {
             destroyGantt(ganttObj);
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
             ganttObj.dataBind();
             ganttObj.reorderRows([27], 35, 'child');
         });
     });
     describe('Right resizing taskbar', () => {
         Gantt.Inject(CriticalPath, Edit, ContextMenu);
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Right Resizing', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                     expect(args.data.isCritical).toBe(true);
                 }
             };
             ganttObj.dataBind();
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
             ganttObj.dataBind();
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
             ganttObj.dataBind();
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
             ganttObj.dataBind();
             let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(39)') as HTMLElement;
             triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
             let e: ContextMenuClickEventArgs = {
                 item: { id: ganttObj.element.id + '_contextMenu_Child' },
                 element: null,
             };
             (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
         });
     });
     describe('critical path rendering for FF and SF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SF", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
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
             ganttObj.dataBind();
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
             ganttObj.dataBind();
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
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 700, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('critical path rendering for FF and SF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SF+2d", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF+2d" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS+2d" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Initial rendering critical path for SF ang FF', () => {
             expect(ganttObj.flatData[1].isCritical).toBe(true);
             expect(ganttObj.flatData[3].isCritical).toBe(false);
             expect(ganttObj.flatData[4].isCritical).toBe(false);
             expect(ganttObj.flatData[5].isCritical).toBe(false);
         });
     });
     describe('critical path rendering for FF and SF with diff duration units', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", DurationUnit: 'hour', startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", DurationUnit: 'minute', startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", DurationUnit: 'day', startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SF+2d", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", DurationUnit: 'hour', startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF+2d" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS+2d" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Duration units with hour and minute', () => {
             expect(ganttObj.flatData[1].isCritical).toBe(true);
             expect(ganttObj.flatData[3].isCritical).toBe(false);
             expect(ganttObj.flatData[4].isCritical).toBe(false);
             expect(ganttObj.flatData[5].isCritical).toBe(false);
         });
     });
     describe('critical path rendering for diff taskmode', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let taskModeData: Object[] = [
             {
                 'TaskID': 1,
                 'TaskName': 'Parent Task 1',
                 'StartDate': new Date('02/27/2017'),
                 'EndDate': new Date('03/03/2017'),
                 'Progress': '40',
                 'isManual': true,
                 'Children': [
                     { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                         'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                     { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                         'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                     { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                         'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
                 ]
             },
             {
                 'TaskID': 5,
                 'TaskName': 'Parent Task 2',
                 'StartDate': new Date('03/05/2017'),
                 'EndDate': new Date('03/09/2017'),
                 'Progress': '40',
                 'isManual': true,
                 'Children': [
                     { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                     { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40','Predecessor': '8FS'},
                     { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                         'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true,'Predecessor': '9FF' },
                     { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
                 ]
             },
             {
                 'TaskID': 10,
                 'TaskName': 'Parent Task 3',
                 'StartDate': new Date('03/13/2017'),
                 'EndDate': new Date('03/17/2017'),
                 'Progress': '40',
                 'Children': [
                     { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40'},
                     { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor':'11SF'},
                     { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', },
                     { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '13SS' },
                     { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40' }
                 ]
             }
         ];
         beforeAll((done: Function) => {
             ganttObj = createGantt({
                 dataSource: taskModeData,
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
                 taskMode : 'Manual',
                 sortSettings: {
                     columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                     { field: 'TaskName', direction: 'Ascending' }]
                 },
                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                 'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],         
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
                     { field: 'TaskID', visible: true},
                     {field: 'TaskName'},
                     { field: 'isManual'},
                     {field: 'StartDate'},
                     {field: 'Duration'},
                     {field: 'Progress'}
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Custom taskmode', () => {
             expect(ganttObj.flatData[10].isCritical).toBe(false);
             expect(ganttObj.flatData[11].isCritical).toBe(false);
             expect(ganttObj.flatData[12].isCritical).toBe(true);
             expect(ganttObj.flatData[13].isCritical).toBe(true);
         });
     });
     describe('critical path rendering with offset value for SF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SF", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SF" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SF" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Critical path after resizing with offset value', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                     expect(args.data.isCritical).toBe(false);
                 }
             };
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 85, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('critical path rendering with offset value for SS', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SS", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Critical path after resizing with offset value', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                     expect(args.data.isCritical).toBe(false);
                 }
             };
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 440, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('critical path rendering with offset value for FF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30FF", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Critical path after resizing with offset value', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                     expect(args.data.isCritical).toBe(false);
                 }
             };
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 80, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('critical path rendering with offset value for FS', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30FS", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Critical path after resizing with offset value', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'LeftResizing') {
                     expect(args.data.isCritical).toBe(true);
                 }
             };
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 680, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('taskbar resize for diff taskmode', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let taskModeData: Object[] = [
             {
                 'TaskID': 1,
                 'TaskName': 'Parent Task 1',
                 'StartDate': new Date('02/27/2017'),
                 'EndDate': new Date('03/03/2017'),
                 'Progress': '40',
                 'isManual': true,
                 'Children': [
                     { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                         'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                     { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                         'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                     { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                         'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
                 ]
             },
             {
                 'TaskID': 5,
                 'TaskName': 'Parent Task 2',
                 'StartDate': new Date('03/05/2017'),
                 'EndDate': new Date('03/09/2017'),
                 'Progress': '40',
                 'isManual': true,
                 'Children': [
                     { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                     { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40','Predecessor': '8FS'},
                     { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                         'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true,'Predecessor': '9FF' },
                     { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                         'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
                 ]
             },
             {
                 'TaskID': 10,
                 'TaskName': 'Parent Task 3',
                 'StartDate': new Date('03/13/2017'),
                 'EndDate': new Date('03/17/2017'),
                 'Progress': '40',
                 'Children': [
                     { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40'},
                     { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor':'11SF'},
                     { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', },
                     { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '13SS' },
                     { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
                         'EndDate': new Date('03/17/2017'), 'Progress': '40' }
                 ]
             }
         ];
         beforeAll((done: Function) => {
             ganttObj = createGantt({
                 dataSource: taskModeData,
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
                 taskMode : 'Manual',
                 sortSettings: {
                     columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                     { field: 'TaskName', direction: 'Ascending' }]
                 },
                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                 'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],         
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
                     { field: 'TaskID', visible: true},
                     {field: 'TaskName'},
                     { field: 'isManual'},
                     {field: 'StartDate'},
                     {field: 'Duration'},
                     {field: 'Progress'}
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Custom taskmode', () => {
             ganttObj.actionComplete = (args) => {
                 if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                     expect(args.data.isCritical).toBe(false);
                 }
             };
             ganttObj.dataBind();
             let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
             triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
             triggerMouseEvent(dragElement, 'mousemove', 420, 0);
             triggerMouseEvent(dragElement, 'mouseup');
         });
     });
     describe('critical path rendering FS and FF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50",predecessor: "30FF", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3 },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Initial rendering critical path for SF ang FF', () => {
             expect(ganttObj.flatData[5].isCritical).toBe(true);
         });
     });
      describe('critical path rendering FS and FF', () => {
         Gantt.Inject(CriticalPath);
         let ganttObj: Gantt;
         let criticalPathData: Object[] = [
             {
                 taskID: 7,
                 taskName: "Design",
                 startDate: new Date("02/10/2017"),
                 endDate: new Date("02/18/2017"),
                 subtasks: [
                     { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
                     {
                         taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                         subtasks: [
                             { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                         ]
                     },
                     { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50",predecessor: "30FF", resourceInfo: [1] },
                     { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3 },
                     { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" }
                 ]
             }
         ];
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
         afterAll(() => {
             destroyGantt(ganttObj);
         });
         it('Initial rendering critical path for SF ang FF', () => {
             expect(ganttObj.flatData[5].isCritical).toBe(true);
         });
         it('Editing start date column without predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            ganttObj.dataBind();
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate')as any).ej2_instances[0];
            input.value = new Date('02/22/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Editing start date column with predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            ganttObj.dataBind();
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate')as any).ej2_instances[0];
            input.value = new Date('02/16/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
     });
     describe('resource view with predecessor', () => {
        Gantt.Inject(CriticalPath);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
    });
    describe('resource view without predecessor', () => {
        Gantt.Inject(CriticalPath);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
    });
  describe('critical path rendering', () => {
        Gantt.Inject(CriticalPath, RowDD);
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Initial rendering critical path ', () => {
            ganttObj.dataBind();
            ganttObj.fitToProject();
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);
            let criticalpath: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_critical-path') as HTMLElement;
            triggerMouseEvent(criticalpath, 'click');
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);     
        });
    });
  describe('resource view without predecessor', () => {
        Gantt.Inject(CriticalPath);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
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
            viewType:'ResourceView',
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
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
            ganttObj.dataBind();
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let input: any = (ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration')as any).ej2_instances[0];
            input.value = '16 days';
            input.dataBind();
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
            viewType:'ResourceView',
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        it('Multitaskbar Resource view', () => {
           expect(ganttObj.currentViewData[15].ganttProperties.isCritical).toBe(true);
        });
    });
 });

 describe('clone taskbar Right resizing taskbar', () => {
    Gantt.Inject(CriticalPath, Edit, ContextMenu);
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
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    it('Right Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                expect(args.data.isCritical).toBe(true);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(41) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Progress Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'ProgressResizing') {
                expect(args.data.isCritical).toBe(false);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -10, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    
});
describe('critical path rendering with empty datasource', () => {
        Gantt.Inject(CriticalPath, RowDD);
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('critical path with datasource ', () => {
            expect(ganttObj.currentViewData.length).toBe(0);    
        });
    });
    describe('Critical path is not working properly when the baseline is changed dynamically', () => {
        Gantt.Inject(CriticalPath, RowDD);
        let ganttObj: Gantt;
        let bwData: Object[] = [
            {
              TaskID: 1,
              TaskName: 'New Task 1',
              StartDate: new Date('05/22/2023'),
              EndDate: new Date('05/22/2023'),
              BaselineStartDate: new Date('05/22/2023'),
              BaselineEndDate: new Date('05/22/2023'),
              Progress: 59,
              Duration: 1,
            },
            {
              TaskID: 2,
              TaskName: 'New Task 2',
              StartDate: new Date('05/22/2023'),
              EndDate: new Date('05/22/2023'),
              BaselineStartDate: new Date('05/22/2023'),
              BaselineEndDate: new Date('05/22/2023'),
              Progress: 45,
              Duration: 1,
              Predecessor: '1FS',
            },
          ];
    
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: bwData,
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('check critical path class', () => {
            ganttObj.enableCriticalPath=true;
            ganttObj.renderBaseline=true;
            ganttObj.dataBind();
            expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(2);
        });
    });
describe('Critical path is not working properly issue', () => {
        Gantt.Inject(CriticalPath, RowDD);
        let ganttObj: Gantt;
        let bwData: Object[] = [
            {
                TaskID: 1,
                TaskName: 'New Task 1',
                StartDate: new Date('07/11/2023'),
                EndDate: new Date('07/11/2023'),
                Progress: 59,
                Duration: 1,
                Predecessor: '2FS',
              },
              {
                TaskID: 2,
                TaskName: 'New Task 2',
                StartDate: new Date('07/10/2023'),
                EndDate: new Date('07/10/2023'),
                Progress: 45,
                Duration: 1,
              },
              {
                TaskID: 3,
                TaskName: 'New Task 1',
                StartDate: new Date('07/12/2023'),
                EndDate: new Date('07/12/2023'),
                Progress: 59,
                Duration: 1,
                Predecessor: '1FS',
              },
              {
                TaskID: 4,
                TaskName: 'New Task 2',
                StartDate: new Date('07/13/2023'),
                EndDate: new Date('07/13/2023'),
                Progress: 45,
                Duration: 1,
                Predecessor: '3FS',
              },
          ];

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: bwData,
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
                toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan', 'CriticalPath'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                enableCriticalPath:false,
                allowRowDragAndDrop:true,
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('check critical path class', () => {
            ganttObj.enableCriticalPath=true;
            ganttObj.dataBind();
            expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(4);
        });
    });
