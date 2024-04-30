/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort, ColumnMenu, ITaskbarClickEventArgs, RecordDoubleClickEventArgs } from '../../src/index';
import { unscheduledData, projectResources, resourceGanttData, dragSelfReferenceData, selfReference, projectData1,baselineDatas, projectNewData2, totalDurationData, filterdata, projectNewData9, projectNewData10, projectNewData11, projectNewData12, selfData1, splitTasksData1, projectNewData13 } from '../base/data-source.spec';
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
    });
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
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
        it('Testing onTaskbarClick event for child task', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'click');
            ganttObj.onTaskbarClick = function (args: ITaskbarClickEventArgs) {
                expect(args.taskbarElement.classList.contains('e-gantt-child-taskbar')).toBe(true);
            };
        });
        it('check destroy method', () => {
            ganttObj.destroy();
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(false);
        });
        // it('control class testing', () => {
        //     let htmlElement: HTMLElement = createElement('div', { id: 'GanttHtmlCheck' });
        //     ganttObj = new Gantt({
        //         allowSelection: true,
        //         dataBound: () => {
        //             expect(htmlElement.classList.contains('e-gantt')).toEqual(true);
        //         }
        //     }, htmlElement);
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    // });
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
            let ele: HTMLElement = ganttObj.element.getElementsByClassName('e-baseline-bar')[0] as HTMLElement;
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
            if(ganttObj_tree){
                destroyGantt(ganttObj_tree);
            }
        });
    });
    describe('Render gantt with parentID property', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: totalDurationData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        parentID: 'ParentID',
                        manual: 'IsManual',
                        resourceInfo: 'Resources',
                    },
                    editSettings: {
                        allowEditing: true
                    },
                }, done);
        });
        it('EJ2-69723-render gantt with parentID prop', () => {
            expect(ganttObj.currentViewData.length > 0).toBe(true);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
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
            if(ganttObj){
                destroyGantt(ganttObj);
            }
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
            if(ganttObj){
                destroyGantt(ganttObj);
            }
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
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('EJ2-48738-Immutable - refresh data source', (done: Function) => {
            setValue('mutableData', true, ganttObj.treeGrid.grid.contentModule)
            ganttObj.dataSource = selfReference.slice(0, 15);
            ganttObj.dataBound = function (args: any): void {
                // expect(getValue('style.background', ganttObj.element.querySelectorAll('.e-row')[0])).toBe('pink');
                expect(getValue('style.background', ganttObj.element.querySelectorAll('.e-chart-row')[0])).toBe('pink');
                done();
            };
            ganttObj.dataBind();
        });  
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Set datasource to empty', (done: Function) => {
            let update: HTMLElement = ganttObj.element.querySelector('#' + 'update') as HTMLElement;
            triggerMouseEvent(update, 'click');
            ganttObj.actionComplete = function (args: any): void {
                if(args.requestType === 'refresh') {
                    expect(ganttObj.flatData.length).toBe(0);
                    done();
                }
            };
        });
        
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        
    });
     describe('Rendering milestone based on milestone mapping', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData9,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        child: 'subtasks',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        milestone: 'Milestone',                       
                    },                   
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    dayWorkingTime : [{
                        from: 0,
                        to: 24
                    }],                    
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
                        taskLabel: 'Progress'
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },                      
                        { field: 'Duration', width: '100' },                     
                    ],
                    height: '550px',                 
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Render milestone', () => {
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(1);
            expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(0);
        });
        
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('CollapseAll tasks', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData10,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        child: 'subtasks',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        milestone: 'Milestone',                       
                    },                   
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    dayWorkingTime : [{
                        from: 0,
                        to: 24
                    }],                    
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
                        taskLabel: 'Progress'
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },                      
                        { field: 'Duration', width: '100' },                     
                    ],
                    height: 'auto',                 
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('CollapseAll tasks in auto height', () => {
            let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
            triggerMouseEvent(collapseallToolbar, 'click');
            //expect(ganttObj.ganttChartModule.chartElement.offsetHeight).toBe(115);
        });    
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Self reference data', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: selfReference,
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
                    }
                }, done);
        });
        it('Add record invalid parent id', () => {
            var record = [{
                taskID: 10,
                taskName: 'Identify Site location',
                StartDate: new Date('02/05/2019'),
                duration: 3,
                Progress: 50,
                parentID: 1
            }];
            ganttObj.dataSource = record;
            ganttObj.dataBound = (args: any): void => {
                expect(ganttObj.currentViewData.length).toEqual(0);
            };
            ganttObj.dataBind();
        });
        
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('showandhide', () => {
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
     
         it('Hide column', () => {
             ganttObj.hideColumn('Duration','field');
             expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
         });
         it('Show column', () => {
            ganttObj.showColumn('Duration','field');
             expect(ganttObj.element.querySelectorAll('.e-headercell')[4].classList.contains('e-hide')).toBe(false);
         });
         afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });  
    });
     describe('render data with null duration and start date', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: null, Duration: null, Progress: 30 },
                    ],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                    },
                    editSettings: {
                        allowEditing: true
                    }
                }, done);
        });
        it('Check duration', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(1);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
});
    describe('CollapseAll tasks', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData11,
                    allowSorting: true,
                    collapseAllParentTasks: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        child: 'subtasks',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        milestone: 'Milestone',                       
                    },                   
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    dayWorkingTime : [{
                        from: 0,
                        to: 24
                    }],                    
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
                        taskLabel: 'Progress'
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Task Name', width: '180' },                      
                        { field: 'Duration', width: '100' },                     
                    ],
                    height: 'auto',                 
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('CollapseAll tasks in auto height', () => {
            expect(ganttObj.treeGrid.enableCollapseAll).toBe(true);
        });
        
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
     describe('ExpandAtlevel after collapsing records', () => {
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
                }, done);
        });
        it('Expand record using method', () => {
           ganttObj.collapseAll();
           ganttObj.expandAtLevel(1);
           expect(ganttObj.ganttChartModule.getChartRows()[1]['style'].display).toBe('table-row');
        });
        
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
     });
});
describe('milestone render as taskbar ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineDatas,
                renderBaseline: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
                columns: [
                    { field: 'TaskId', visible: false },
                    { field: 'TaskName', headerText: 'Service Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'BaselineStartDate', headerText: 'Planned start time' },
                    { field: 'BaselineEndDate', headerText: 'Planned end time' },
                    { field: 'StartDate', headerText: 'Start time' },
                    { field: 'EndDate', headerText: 'End time' },
                ],
                treeColumnIndex: 1,
                allowSelection: true,
                includeWeekend: true,
                timelineSettings: {
                    timelineUnitSize: 65,
                    topTier: {
                        unit: 'None',
                    },
                    bottomTier: {
                        unit: 'Minutes',
                        count: 15,
                        format: 'hh:mm a'
                    },
                },
                tooltipSettings: {
                    taskbar: '#tooltip',
                },
                durationUnit: 'Minute',
                dateFormat: 'hh:mm a',
                height: '450px',
                dayWorkingTime: [{ from: 0, to: 24 }],
                projectStartDate: new Date('03/05/2018 09:30:00 AM'),
                projectEndDate: new Date('03/05/2018 07:00:00 PM')

            }, done);
    });
    it('milestone renders  duration', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(0);
        expect(ganttObj.currentViewData[0].ganttProperties.startDate.toDateString()).toBe("Mon Mar 05 2018")
        expect(ganttObj.currentViewData[0].ganttProperties.endDate.toDateString()).toBe("Mon Mar 05 2018")
        expect(ganttObj.currentViewData[0].ganttProperties.baselineStartDate.toDateString()).toBe("Mon Mar 05 2018")
        expect(ganttObj.currentViewData[0].ganttProperties.baselineEndDate.toDateString()).toBe("Mon Mar 05 2018")
        expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
    describe('milestone render', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData2,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        progress: 'Progress',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                        child: 'subtasks',
                        duration: 'Duration',
                    },
                    columns:[ 
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Service Name', width: '250' },
                    { field: 'BaselineStartDate', headerText: 'Planned start time' },
                    { field: 'BaselineEndDate', headerText: 'Planned end time' },
                    { field: 'StartDate', headerText: 'Start time' },
                    { field: 'EndDate', headerText: 'End time' }],
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar:['ZoomIn', 'ZoomOut', 'ZoomToFit'],
                    allowSelection: true,
                    gridLines: "Both",
                    showColumnMenu: false,
                    highlightWeekends: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Day',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Hour',
                            format:"hh:mm"
                        }
                    },
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: 'Progress'
                    },
                    height: '600px',
                    allowUnscheduledTasks: true,
                    projectStartDate:  new Date('03/04/2018 09:30:00 AM'),
                    projectEndDate: new Date('03/07/2018 7:00:00 PM'),
                    renderBaseline:true,
                   dayWorkingTime:[{from:8,to:17}],
                   includeWeekend:true,
                   durationUnit:"Minute",
                   dateFormat:"hh:mm a",
                   baselineColor:"green"
    
                }, done);
        });
        it('milestone renders  duration', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(0);
        });
        it('milestone renders  startdate', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.startDate.toDateString()).toBe("Mon Mar 05 2018")
        });
        it('milestone renders  enddate', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.endDate.toDateString()).toBe("Mon Mar 05 2018")
        })
        it('milestone renders baselineStartdate', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.baselineStartDate.toDateString()).toBe("Mon Mar 05 2018")
        })
        it('milestone renders baselineendtdate', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.baselineEndDate.toDateString()).toBe("Mon Mar 05 2018")
        })
        it('milestone renders ismilestone', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
        })
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe( 'update task fields and the data source',()=>{
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [
                        {
                            TaskID: 1,
                            TaskName: 'Receive vehicle and create job card',
                            BaselineStartDate: new Date('03/05/2018 00:00:00 AM'),
                            BaselineEndDate: new Date('03/03/2018 00:00:00 AM'),
                            Duration: 1,
                            StartDate: new Date('03/05/2018 00:00:00 AM'),
                            EndDate: new Date('03/10/2018 00:00:00 AM'),
                        },
                    ],
                    allowSorting: true,
                    allowReordering: true,
                    enableContextMenu: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
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
                    durationUnit: 'Day',
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                }, done);
            })
            it('update task fields', () => {
                ganttObj.taskFields={
                    id: 'id',
                    name: '01GGVQD5H2R7GP0TQ515WB4YBB',
                    startDate: '01GGVQD5H2FGQF927YK7T6FM0V',
                    child: 'subtasks',
                    progress: '01GGVQD5H21F43NAWPYGY7HNTB',
                    duration: '01GGVQD5H25KW37QDTSCDD0MCC',
                    baselineStartDate:null,
                    baselineEndDate:null
                }
                expect(ganttObj.currentViewData.length).toBe(1);
            });
            afterAll(() => {
                if(ganttObj){
                    destroyGantt(ganttObj);
                }
            });
        });
    describe('Baseline render', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData12,
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
                    ],
                    durationUnit: 'Day',
                    toolbar: [],
                    timelineSettings: {
                        timelineUnitSize: 65,
                        topTier: {
                            unit: 'Month',
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1,
                        },
                    },
                    readOnly: false,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/01/2018 00:00:00 AM'),
                    projectEndDate: new Date('03/25/2018 00:00:00 PM'),

                }, done);
        });
        it('End Date greater than start date', () => {
            expect(ganttObj.currentViewData[0].ganttProperties.baselineEndDate.getDate()).toBe(5);
            expect(ganttObj.toolbarModule).toBe(undefined);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
describe('Milestone Baseline render', () => {
         let ganttObj: Gantt;
         beforeAll((done: Function) => {
             ganttObj = createGantt(
                 {
                     dataSource: selfData1,
                     allowSorting: true,
                     allowReordering: true,
                     enableContextMenu: true,
                     taskFields: {
                         id: 'taskID',
                         name: 'taskName',
                         startDate: 'startDate',
                         endDate: 'endDate',
                         duration: 'duration',
                         progress: 'progress',
                         dependency: 'predecessor',
                         parentID: 'parentID',
                         baselineStartDate: 'baselineStart',
                         baselineEndDate: 'baselineEnd',
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
                         { field: 'taskID', width: 80 },
                         { field: 'taskName', width: 250 },
                         { field: 'startDate' },
                         { field: 'endDate' },
                         { field: 'duration' },
                         { field: 'predecessor' },
                         { field: 'progress' },
                     ],
                     timelineSettings: {
                         topTier: {
                             format: 'MMM dd, yyyy',
                             unit: 'Week',
                         },
                         bottomTier: {
                             unit: 'Day',
                         },
                     },
                     taskbarHeight: 20,
                     height: '550px',
                     allowUnscheduledTasks: true,
                     projectStartDate: new Date('01/28/2019'),
                     projectEndDate: new Date('03/10/201'),

                 }, done);
         });
         it('Render baseline as milestone', () => {
             expect(ganttObj.currentViewData[3].ganttProperties.baselineEndDate.getDate()).toBe(6);
         });
         afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
     });
     describe('CR-Issue-EJ2-854909-Columns does not update while changing columns values by Gantt instance', () => {        
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: filterdata,
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  endDate: 'EndDate',
                  duration: 'Duration',
                },
                columns: [
                  { field: 'TaskID', visible: false },
                  {
                    field: 'TaskName',
                    headerText: 'Task Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                  },
                  { field: 'StartDate', headerText: 'Start Date' },
                  { field: 'Duration', headerText: 'Duration', editType: 'numericedit', type:"number" },
                  { field: 'EndDate', headerText: 'End Date' },
                ],
                treeColumnIndex: 0,
                toolbar: ['Search'],
                allowFiltering: true,
                includeWeekend: true,
                height: '450px',
                splitterSettings: {
                  columnIndex: 3,
                },
                labelSettings: {
                  rightLabel: 'TaskName',
                },
                projectStartDate: new Date('07/15/1969'),
                projectEndDate: new Date('07/25/1969'),
            }, done);

        });
        it('columns length', () => {
            ganttObj.columns = [
                { field: 'TaskName' }
            ];
            expect(ganttObj.columns.length).toBe(1);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
     describe('Split tasks progress value', () => {
         let ganttObj: Gantt;
         beforeAll((done: Function) => {
             ganttObj = createGantt({
                 dataSource: splitTasksData1,
                 taskFields: {
                     id: 'TaskID',
                     name: 'TaskName',
                     startDate: 'StartDate',
                     endDate: 'EndDate',
                     duration: 'Duration',
                     progress: 'Progress',
                     dependency: 'Predecessor',
                     child: 'subtasks',
                     segments: 'Segments',
                     durationUnit: 'durationUnit',
                 },
                 editSettings: {
                     allowAdding: true,
                     allowEditing: true,
                     allowDeleting: true,
                     allowTaskbarEditing: true,
                     showDeleteConfirmDialog: true,
                 },
                 columns: [
                     { field: 'TaskID', width: 80 },
                     {
                         field: 'TaskName',
                         headerText: 'Job Name',
                         width: '250',
                         clipMode: 'EllipsisWithTooltip',
                     },
                     { field: 'StartDate' },
                     { field: 'EndDate' },
                     { field: 'Duration' },
                     { field: 'Progress' },
                     { field: 'Predecessor' },
                 ],
                 durationUnit: 'Minute',
                 dayWorkingTime: [
                     {
                         from: 0,
                         to: 24,
                     },
                 ],
                 toolbar: [
                     'Add',
                     'Edit',
                     'Update',
                     'Delete',
                     'Cancel',
                     'ExpandAll',
                     'CollapseAll',
                 ],
                 enableContextMenu: true,
                 allowSelection: true,
                 height: '450px',
                 treeColumnIndex: 1,
                 highlightWeekends: true,
                 splitterSettings: {
                     position: '35%',
                 },
                 projectEndDate: new Date('2019-02-14'),
                 projectStartDate: new Date('2019-02-04'),
                 labelSettings: {
                     leftLabel: 'TaskName',
                     taskLabel: '${Progress}%',
                 },
                 timezone: 'Europe/Rome',
                 timelineSettings: {
                     timelineUnitSize: 40,
                     showTooltip: true,
                     timelineViewMode: 'Day',
                     topTier: {
                         unit: 'Day',
                         format: 'E, d MMMM',
                         count: 1,
                     },
                     bottomTier: {
                         unit: 'Hour',
                         count: 1,
                     },
                     weekStartDay: 1,
                     weekendBackground: 'rgba(0,0,0,0.1)',
                     updateTimescaleView: false,
                 },
             }, done);

         });
         it('check progress value', () => {
             expect(ganttObj.currentViewData[0].ganttProperties.segments[0].progressWidth).toBe(56.4);
             expect(ganttObj.currentViewData[0].ganttProperties.segments[1].progressWidth).toBe(-1);
         });
         afterAll(() => {
             if (ganttObj) {
                 destroyGantt(ganttObj);
             }
         });
     });
     describe('Work is mapped ', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [],
                taskType: 'FixedDuration',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    work:'Work',
                    segments: 'Segments',
                    durationUnit: 'durationUnit',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    {
                        field: 'TaskName',
                        headerText: 'Job Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' },
                ],
                enableContextMenu: true,
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                splitterSettings: {
                    position: '35%',
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%',
                },
            }, done);

        });
        it ('check tasktype value', () => {
            expect(ganttObj.taskType).toBe('FixedDuration');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('add record to resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData13,
                   resources: [ { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
                   { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                   { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' }],
                   viewType: 'ResourceView',
                   showOverAllocation: true,
                   enableContextMenu: true,
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
                   toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                   { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' },'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',  'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
    
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
                   height: '550px',
                   projectStartDate: new Date('03/28/2019'),
                   projectEndDate: new Date('05/18/2019')
    
                }, done);
        });
        it('Add record - Below', () => {
            ganttObj.addRecord({ TaskID: 5, TaskName: 'NewTask', StartDate: new Date('03/29/2019'), Duration: 4, },'Below'); 
        });
        it('Add record - Above', () => {
            ganttObj.addRecord({ TaskID: 6, TaskName: 'NewTask1' },'Above'); 
         });
         it('Add record as child', function () {
            ganttObj.addRecord({ TaskID: 7, TaskName: 'NewTask2' },'Child'); 
        });
        it('Add record at top', function () {
            ganttObj.addRecord({ TaskID: 8, TaskName: 'NewTask3' },'Top'); 
        });
        it('Add record at Bottom', function () {
            ganttObj.addRecord({ TaskID: 9, TaskName: 'NewTask4' },'Bottom'); 
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
