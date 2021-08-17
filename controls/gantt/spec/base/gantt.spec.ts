/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort, ColumnMenu, ITaskbarClickEventArgs, RecordDoubleClickEventArgs } from '../../src/index';
import { unscheduledData, projectResources, resourceGanttData, dragSelfReferenceData, selfReference, projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
import { getValue, setValue } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

Gantt.Inject(Edit, Selection, ContextMenu, Sort, Toolbar, Filter, DayMarkers, ColumnMenu);
describe('Gantt - Base', () => {

    describe('Gantt base module', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                allowSelection: true,
                dataSource: unscheduledData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Grid columns method testing', () => {
            ganttObj.getGridColumns();
            expect(ganttObj.treeGrid.getColumns().length).toBe(9);
         });
         it('Gantt columns method testing', () => {
             ganttObj.getGanttColumns();
             expect(ganttObj.ganttColumns.length).toBe(9);
         });
         it('Hide column method testing', () => {
             ganttObj.hideColumn('Duration','field');
             expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
         });
         it('Show column method testing', () => {
             ganttObj.showColumn('Duration','field');
             expect(ganttObj.element.querySelectorAll('.e-headercell')[4].classList.contains('e-hide')).toBe(false);
         });
        it('control class testing', () => {
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(true);
        });
        it('get component name testing', () => {
            expect(ganttObj.getModuleName()).toEqual('gantt');
        });
        it('record double click event testing on chart', () => {
            let element: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td') as HTMLElement;
            triggerMouseEvent(element, 'dblclick');
            ganttObj.recordDoubleClick = function (args: RecordDoubleClickEventArgs) {
                expect(args.rowIndex).toBe(0);
            };
        });
        it('record double click event testing on treegrid', () => {
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'dblclick');
            ganttObj.recordDoubleClick = function (args: RecordDoubleClickEventArgs) {
                expect(args.cellIndex).toBe(1);
            };
        });
        it('Testing onTaskbarClick event for parent task', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'click');
            ganttObj.onTaskbarClick = function (args: ITaskbarClickEventArgs) {
                expect(args.taskbarElement.classList.contains('e-gantt-parent-taskbar')).toBe(true);
            };
        });
        it('Testing onTaskbarClick event for child task', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'click');
            ganttObj.onTaskbarClick = function (args: ITaskbarClickEventArgs) {
                expect(args.taskbarElement.classList.contains('e-gantt-child-taskbar')).toBe(true);
            };
        });
        it('property change check', () => {
            ganttObj.allowSelection = false;
            expect(ganttObj.allowSelection).toEqual(false);
            ganttObj.allowFiltering = true;
            expect(ganttObj.allowFiltering).toEqual(true);
            ganttObj.workWeek = ["Sunday", "Monday", "Tuesday", "Wednesday"];
            ganttObj.dataBind();
            expect(ganttObj.nonWorkingDayIndex.length).toBe(3);
            ganttObj.toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel'];
            ganttObj.dataBind();
            expect(ganttObj.toolbarModule.toolbar.items.length).toBe(5);
            ganttObj.showColumnMenu = true;
            expect(ganttObj.showColumnMenu).toEqual(true);
            ganttObj.columnMenuItems = ['ColumnChooser','Filter'];
            expect(ganttObj.columnMenuItems.length).toBe(2);
            ganttObj.sortSettings= { columns: [{ field: 'TaskID', direction: 'Descending' }]};
            expect(ganttObj.sortSettings.columns.length).toBe(1);
            ganttObj.rowHeight = 60;
            expect(ganttObj.rowHeight).toBe(60);
            ganttObj.taskbarHeight = 50;
            expect(ganttObj.taskbarHeight).toBe(50);
            ganttObj.allowResizing = true;
            expect(ganttObj.allowResizing).toEqual(true);
            ganttObj.allowReordering = true;
            expect(ganttObj.allowReordering).toEqual(true);
            ganttObj.labelSettings = {leftLabel: 'TaskID'};
            ganttObj.dataBind();
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-left-label-container > div > span').textContent).toBe('2');
            ganttObj.renderBaseline = true;
            expect(ganttObj.renderBaseline).toEqual(true);
            ganttObj.baselineColor = 'red';
            ganttObj.dataBind();
            let ele: HTMLElement = document.getElementsByClassName('e-baseline-bar')[0] as HTMLElement;
            expect(ele.style.backgroundColor).toBe('red');
            ganttObj.resources = [
                { resourceId: 1, resourceName: 'Martin Tamer' },
                { resourceId: 2, resourceName: 'Rose Fuller' },
                { resourceId: 3, resourceName: 'Margaret Buchanan' }];
            ganttObj.resourceIDMapping = 'resourceId';
            expect(ganttObj.resourceIDMapping).toBe('resourceId');
            ganttObj.resourceNameMapping = 'resourceName';
            expect(ganttObj.resourceNameMapping).toBe('resourceName');
            ganttObj.includeWeekend = true;
            expect(ganttObj.includeWeekend).toEqual(true);
            ganttObj.dayWorkingTime = [{ from: 9, to: 18 }];
            ganttObj.dataBind();
            expect(ganttObj.dayWorkingTime[0].from).toBe(9);
            expect(ganttObj.dayWorkingTime[0].to).toBe(18);
            ganttObj.addDialogFields = [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' }
            ];
            expect(ganttObj.addDialogFields.length).toBe(2);
            ganttObj.editDialogFields =  [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' },
                { type: 'Notes' }
            ];
            expect(ganttObj.editDialogFields.length).toBe(4);
            ganttObj.width = 'auto';
            expect(ganttObj.width).toBe('auto');
            ganttObj.height = '450px';
            expect(ganttObj.height).toBe('450px');
            ganttObj.connectorLineBackground = 'red';
            expect(ganttObj.connectorLineBackground).toBe('red');
            ganttObj.connectorLineWidth = 15;
            expect(ganttObj.connectorLineWidth).toBe(15);
            ganttObj.treeColumnIndex = 2;
            expect(ganttObj.treeColumnIndex).toBe(2);
            ganttObj.projectStartDate = new Date('01/15/2017');
            expect(ganttObj.getFormatedDate(ganttObj.projectStartDate,'M/d/yyyy')).toBe('1/15/2017');
            ganttObj.projectEndDate = new Date('05/15/2017');
            expect(ganttObj.getFormatedDate(ganttObj.projectEndDate,'M/d/yyyy')).toBe('5/15/2017');
            ganttObj.enableContextMenu = true;
            expect(ganttObj.enableContextMenu).toEqual(true);
            ganttObj.contextMenuItems = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert'];
            expect(ganttObj.contextMenuItems.length).toBe(11);
            ganttObj.locale = 'fr-CH';
            expect(ganttObj.locale).toBe('fr-CH');
            ganttObj.enableRtl = true;
            expect(ganttObj.enableRtl).toEqual(true);
            ganttObj.selectionSettings = { mode:'Row', type:'Multiple' };
            ganttObj.selectedRowIndex = 4;
            ganttObj.columns = [
                { field: 'TaskID', width: '150' },
                { field: 'TaskName', width: '250' }
            ];
            expect(ganttObj.columns.length).toBe(2);
            ganttObj.dataSource = [
                {
                    TaskID: 1,
                    TaskName: 'Project Initiation',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                        { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
                        { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                    ]
                }];
        });
        it('check destroy method', () => {
            ganttObj.destroy();
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(false);
        });
        it('control class testing', () => {
            let htmlElement: HTMLElement = createElement('div', { id: 'GanttHtmlCheck' });
            ganttObj = new Gantt({
                allowSelection: true,
                dataBound: () => {
                    expect(htmlElement.classList.contains('e-gantt')).toEqual(true);
                }
            }, htmlElement);
        });
    });
    describe('Task Data Resource type', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: resourceGanttData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        resourceInfo: 'resources',
                        child: 'subtasks'
                    },
                    editSettings: {
                        allowEditing: true
                    },
                    resourceFields: {
                        id: 'ResourceId', //resource Id Mapping
                        name: 'ResourceName', //resource Name mapping
                        unit: 'ResourceUnit', //resource Unit mapping
                    },
                    resources: projectResources,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Resource task data type check', () => {
            expect(ganttObj_tree.currentViewData[1].taskData[ganttObj_tree.taskFields.resourceInfo][2]["custom"]).toBe("check");
            expect(typeof (ganttObj_tree.currentViewData[1].taskData[ganttObj_tree.taskFields.resourceInfo][1])).toBe("object");
        });
        it('type check after updated the task', () => {
            let data: object[] = [{ TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 0, resources: [{ ResourceId: 1, ResourceUnit: 50, customValue: 'check' }] }];
            ganttObj_tree.updateRecordByID(data[0]);
            expect(ganttObj_tree.currentViewData[1].taskData[ganttObj_tree.taskFields.resourceInfo][0]["custom"]).toBe("check");
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('Remote save adaptor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: new DataManager({
                        json: dragSelfReferenceData,
                        adaptor: new RemoteSaveAdaptor(),
                    }),
                    height: '450px',
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
                }, done);
        });
        it('On loading', () => {
            expect(ganttObj.currentViewData.length).toBe(11);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('CR issues', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceGanttData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        resourceInfo: 'resources',
                        child: 'subtasks',
                        segments:'segments'
                    },
                    editSettings: {
                        allowEditing: true
                    },
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('EJ2-48856-split task public method', () => {
            ganttObj.splitTask(5, new Date("04/03/2019"));
            ganttObj.splitTask(5, new Date("04/05/2019"));
            expect(ganttObj.currentViewData[4].taskData[ganttObj.taskFields.segments].length).toBe(3);
         });
        
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('CR issues', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: selfReference.slice(0, 3),
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        progress: 'Progress',
                        parentID: 'parentID'
                    },
                    editSettings: {
                        allowEditing: true
                    },
                    enableImmutableMode: true,
                    rowDataBound: function (args) {
                        // background is set only when mutableData is false
                        if(!(getValue('mutableData', ganttObj.treeGrid.grid.contentModule))) {
                            setValue('style.background', 'pink', args.row);
                        }
                    },
                    queryTaskbarInfo: function (args) {
                        // background is set only when mutableData is false
                        if(!(getValue('mutableData', ganttObj.treeGrid.grid.contentModule))) {
                            setValue('rowElement.style.background', 'pink', args);
                        }
                    },
                }, done);
        });
        it('EJ2-48738-Immutable - refresh data source', () => {
            setValue('mutableData', true, ganttObj.treeGrid.grid.contentModule)
            ganttObj.dataSource = selfReference.slice(0, 15);
            ganttObj.dataBound = function (args: any): void {
                expect(getValue('style.background', ganttObj.element.querySelectorAll('.e-row')[0])).toBe('pink');
                expect(getValue('style.background', ganttObj.element.querySelectorAll('.e-chart-row')[0])).toBe('pink');
            };
            ganttObj.dataBind();
        });
        
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
         describe('Empty datasource', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
                    allowResizing: true,
                    allowSorting: true,
                    enableContextMenu: true,
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
                    toolbarClick: (args: ClickEventArgs) => {
                        if (args.item.text === 'update') {
                            let projectData: any = []
                            ganttObj.dataSource = projectData; 
                        }
                    },
                }, done);
        });
        it('Set datasource to empty', () => {
            let update: HTMLElement = ganttObj.element.querySelector('#' + 'update') as HTMLElement;
            triggerMouseEvent(update, 'click');
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'refresh') {
                    expect(ganttObj.flatData.length).toBe(0);
                }
            };
        });
        
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
});
