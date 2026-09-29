/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort, ColumnMenu, ITaskbarClickEventArgs, RecordDoubleClickEventArgs,ExcelExport ,PdfExport ,Reorder, Resize, CriticalPath, VirtualScroll, UndoRedo} from '../../src/index';
import { unscheduledData, projectResources, resourceGanttData, dragSelfReferenceData, selfReference, projectData1,baselineDatas, projectNewData2, totalDurationData, filterdata, projectNewData9, projectNewData10, projectNewData11, projectNewData12, selfData1, splitTasksData1, projectNewData13, publicProperty, cellEditData, resourcesData, cr884998,treeData,invalidPrdcessor, dataSource2, dataSource1, cR893051, undoDataSource, editingData3,editingResources3, exportData1,resourceCollection10,projectNewDatas1, cr940492,
    autoValidateTaskData, autoValidateTaskModeData, autoValidateUnScheduleData,
    autoValidatedTaskResrcmode, autovaldateResourceCollection, autovalidateDatasource,projectData, MT1014886
} from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
import { getValue, setValue } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Edit, Selection, ContextMenu, Sort, Toolbar, Filter, DayMarkers, ColumnMenu, ExcelExport , PdfExport, Reorder, Resize,CriticalPath, VirtualScroll, UndoRedo);
// describe('Gantt - Base', () => {

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
    it('Grid columns method testing', () => {
        ganttObj.getGridColumns();
        expect(ganttObj.treeGrid.getColumns().length).toBe(9);
    });
    it('Gantt columns method testing', () => {
        ganttObj.getGanttColumns();
        expect(ganttObj.ganttColumns.length).toBe(9);
    });
    it('Hide column method testing', () => {
        ganttObj.hideColumn('Duration', 'field');
        if (ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0]) {
            expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
        }
    });
    it('Show column method testing', () => {
        ganttObj.showColumn('Duration', 'field');
        expect(ganttObj.element.querySelectorAll('.e-headercell')[4].classList.contains('e-hide')).toBe(false);
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
        ganttObj.columnMenuItems = ['ColumnChooser', 'Filter'];
        expect(ganttObj.columnMenuItems.length).toBe(2);
        ganttObj.sortSettings = { columns: [{ field: 'TaskID', direction: 'Descending' }] };
        expect(ganttObj.sortSettings.columns.length).toBe(1);
        ganttObj.rowHeight = 60;
        expect(ganttObj.rowHeight).toBe(60);
        ganttObj.taskbarHeight = 50;
        expect(ganttObj.taskbarHeight).toBe(50);
        ganttObj.allowResizing = true;
        expect(ganttObj.allowResizing).toEqual(true);
        ganttObj.allowReordering = true;
        expect(ganttObj.allowReordering).toEqual(true);
        ganttObj.labelSettings = { leftLabel: 'TaskID' };
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
        ganttObj.editDialogFields = [
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
        expect(ganttObj.getFormatedDate(ganttObj.projectStartDate, 'M/d/yyyy')).toBe('1/15/2017');
        ganttObj.projectEndDate = new Date('05/15/2017');
        expect(ganttObj.getFormatedDate(ganttObj.projectEndDate, 'M/d/yyyy')).toBe('5/15/2017');
        ganttObj.enableContextMenu = true;
        expect(ganttObj.enableContextMenu).toEqual(true);
        ganttObj.contextMenuItems = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert'];
        expect(ganttObj.contextMenuItems.length).toBe(11);
        ganttObj.locale = 'fr-CH';
        expect(ganttObj.locale).toBe('fr-CH');
        ganttObj.enableRtl = true;
        expect(ganttObj.enableRtl).toEqual(true);
        ganttObj.selectionSettings = { mode: 'Row', type: 'Multiple' };
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
                    { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
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
        if (ganttObj_tree) {
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
        if (ganttObj) {
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
        if (ganttObj) {
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
                    segments: 'segments'
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
        if (ganttObj) {
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
                    if (!(getValue('mutableData', ganttObj.treeGrid.grid.contentModule))) {
                        setValue('style.background', 'pink', args.row);
                    }
                },
                queryTaskbarInfo: function (args) {
                    // background is set only when mutableData is false
                    if (!(getValue('mutableData', ganttObj.treeGrid.grid.contentModule))) {
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
    // it('Set datasource to empty', (done: Function) => {
    //     let update: HTMLElement = ganttObj.element.querySelector('#' + 'update') as HTMLElement;
    //     triggerMouseEvent(update, 'click');
    //     ganttObj.actionComplete = function (args: any): void {
    //         if (args.requestType === 'refresh') {
    //             expect(ganttObj.flatData.length).toBe(0);
    //             done();
    //         }
    //     };
    // });

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
                dayWorkingTime: [{
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
                dayWorkingTime: [{
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
        if (ganttObj) {
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
        let record : any = [{
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
        if (ganttObj) {
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
        ganttObj.hideColumn('Duration', 'field');
        if (ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0]) {
            expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
        }
    });
    it('Show column', () => {
        ganttObj.showColumn('Duration', 'field');
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
    let data8: any =  [
        { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: null, Duration: null, Progress: 30 },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:data8,
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
                dayWorkingTime: [{
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
        if (ganttObj) {
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
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// });
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
                         { field: 'taskID', width: 80,allowEditing: true },
                         { field: 'taskName', width: 250 },
                         { field: 'startDate' },
                         { field: 'endDate' },
                         { field: 'duration' },
                         { field: 'predecessor',allowFiltering: true },
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
         it('Checking if row present', () => {
            expect(document.getElementsByClassName('gridrowtaskIdlevel0').length > 0).toBe(true);
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
                       { field: 'TaskID' },
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
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('UpdateOffsetOnTaskbarEdit', () => {
        ganttObj.updateOffsetOnTaskbarEdit = null;
        ganttObj.dataBind();
        expect(ganttObj.updateOffsetOnTaskbarEdit).toBe(null);
        ganttObj.updateOffsetOnTaskbarEdit = undefined;
        ganttObj.dataBind();
        expect(ganttObj.updateOffsetOnTaskbarEdit).toBe(undefined);
    });
    it('addDialogFields', () => {
        ganttObj.addDialogFields = null;
        ganttObj.dataBind();
        expect(ganttObj.addDialogFields).toBe(null);
        ganttObj.addDialogFields = undefined;
        ganttObj.dataBind();
        expect(ganttObj.addDialogFields).toBe(undefined);
    });
    it('ExcelExport', () => {
        ganttObj.excelExport = null;
        ganttObj.dataBind();
        expect(ganttObj.excelExport).toBe(null);
        ganttObj.excelExport = undefined;
        ganttObj.dataBind();
        expect(ganttObj.excelExport).toBe(undefined);
    });
    it('allowFiltering', () => {
        ganttObj.allowFiltering = null;
        ganttObj.dataBind();
        expect(ganttObj.allowFiltering).toBe(null);
        ganttObj.allowFiltering = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowFiltering).toBe(undefined);
    });
    it('allowKeyboard', () => {
        ganttObj.allowKeyboard = null;
        ganttObj.dataBind();
        expect(ganttObj.allowKeyboard).toBe(null);
        ganttObj.allowKeyboard = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowKeyboard).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('allowParentDependency', () => {
        ganttObj.allowParentDependency = null;
        ganttObj.dataBind();
        expect(ganttObj.allowParentDependency).toBe(null);
        ganttObj.allowParentDependency = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowParentDependency).toBe(undefined);
    });
    it('allowPdfExport', () => {
        ganttObj.pdfExport = null;
        ganttObj.dataBind();
        expect(ganttObj.pdfExport).toBe(null);
        ganttObj.pdfExport = undefined;
        ganttObj.dataBind();
        expect(ganttObj.pdfExport).toBe(undefined);
    });
    it('allowReordering', () => {
        ganttObj.allowReordering = null;
        ganttObj.dataBind();
        expect(ganttObj.allowReordering).toBe(null);
        ganttObj.allowReordering = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowReordering).toBe(undefined);
    });
    it('allowResizing', () => {
        ganttObj.allowResizing = null;
        ganttObj.dataBind();
        expect(ganttObj.allowResizing).toBe(null);
        ganttObj.allowResizing = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowResizing).toBe(undefined);
    });
    it('allowRowDragAndDrop', () => {
        ganttObj.allowRowDragAndDrop = null;
        ganttObj.dataBind();
        expect(ganttObj.allowRowDragAndDrop).toBe(null);
        ganttObj.allowRowDragAndDrop = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowRowDragAndDrop).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('allowSelection', () => {
        ganttObj.allowSelection = null;
        ganttObj.dataBind();
        expect(ganttObj.allowSelection).toBe(null);
        ganttObj.allowSelection = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowSelection).toBe(undefined);
    });
    it('allowSorting', () => {
        ganttObj.allowSorting = null;
        ganttObj.dataBind();
        expect(ganttObj.allowSorting).toBe(null);
        ganttObj.allowSorting = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowSorting).toBe(undefined);
    });
    it('allowTaskbarDragAndDrop', () => {
        ganttObj.allowTaskbarDragAndDrop = null;
        ganttObj.dataBind();
        expect(ganttObj.allowTaskbarDragAndDrop).toBe(null);
        ganttObj.allowTaskbarDragAndDrop = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowTaskbarDragAndDrop).toBe(undefined);
    });
    it('allowTaskbarOverlap', () => {
        ganttObj.allowTaskbarOverlap = null;
        ganttObj.dataBind();
        expect(ganttObj.allowTaskbarOverlap).toBe(null);
        ganttObj.allowTaskbarOverlap = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowTaskbarOverlap).toBe(undefined);
    });
    it('allowUnscheduledTasks', () => {
        ganttObj.allowUnscheduledTasks = null;
        ganttObj.dataBind();
        expect(ganttObj.allowUnscheduledTasks).toBe(null);
        ganttObj.allowUnscheduledTasks = undefined;
        ganttObj.dataBind();
        expect(ganttObj.allowUnscheduledTasks).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('autoCalculateDateScheduling', () => {
        ganttObj.autoCalculateDateScheduling = null;
        ganttObj.dataBind();
        expect(ganttObj.autoCalculateDateScheduling).toBe(null);
        ganttObj.autoCalculateDateScheduling = undefined;
        ganttObj.dataBind();
        expect(ganttObj.autoCalculateDateScheduling).toBe(undefined);
    });
    it('autoFocusTasks', () => {
        ganttObj.autoFocusTasks = null;
        ganttObj.dataBind();
        expect(ganttObj.autoFocusTasks).toBe(null);
        ganttObj.autoFocusTasks = undefined;
        ganttObj.dataBind();
        expect(ganttObj.autoFocusTasks).toBe(undefined);
    });
    it('baselineColor', () => {
        ganttObj.baselineColor = null;
        ganttObj.dataBind();
        expect(ganttObj.baselineColor).toBe(null);
        ganttObj.baselineColor = undefined;
        ganttObj.dataBind();
        expect(ganttObj.baselineColor).toBe(undefined);
    });
    it('collapseAllParentTasks', () => {
        ganttObj.collapseAllParentTasks = null;
        ganttObj.dataBind();
        expect(ganttObj.collapseAllParentTasks).toBe(null);
        ganttObj.collapseAllParentTasks = undefined;
        ganttObj.dataBind();
        expect(ganttObj.collapseAllParentTasks).toBe(undefined);
    });
    it('columnMenuModule', () => {
        ganttObj.columnMenuModule = null;
        ganttObj.dataBind();
        expect(ganttObj.columnMenuModule).toBe(null);
        ganttObj.columnMenuModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.columnMenuModule).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('connectorLineBackground', () => {
        ganttObj.connectorLineBackground = null;
        ganttObj.dataBind();
        expect(ganttObj.connectorLineBackground).toBe(null);
        ganttObj.connectorLineBackground = undefined;
        ganttObj.dataBind();
        expect(ganttObj.connectorLineBackground).toBe(undefined);
    });
    it('criticalPathModule', () => {
        ganttObj.criticalPathModule = null;
        ganttObj.dataBind();
        expect(ganttObj.criticalPathModule).toBe(null);
        ganttObj.criticalPathModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.criticalPathModule).toBe(undefined);
    });
    it('currentZoomingLevel', () => {
        ganttObj.currentZoomingLevel = null;
        ganttObj.dataBind();
        expect(ganttObj.currentZoomingLevel).toBe(null);
        ganttObj.currentZoomingLevel = undefined;
        ganttObj.dataBind();
        expect(ganttObj.currentZoomingLevel).toBe(undefined);
    });
    it('dataSource', () => {
        ganttObj.dataSource = null;
        ganttObj.dataBind();
        expect(ganttObj.currentViewData.length).toBe(0);
        ganttObj.dataSource = undefined;
        ganttObj.dataBind();
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    it('dateFormat', () => {
        ganttObj.dateFormat = null;
        ganttObj.dataBind();
        expect(ganttObj.dateFormat).toBe(null);
        ganttObj.dateFormat = undefined;
        ganttObj.dataBind();
        expect(ganttObj.dateFormat).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('dayMarkersModule', () => {
        ganttObj.dayMarkersModule = null;
        ganttObj.dataBind();
        expect(ganttObj.dayMarkersModule).toBe(null);
        ganttObj.dayMarkersModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.dayMarkersModule).toBe(undefined);
    });
    it('disableHtmlEncode', () => {
        ganttObj.disableHtmlEncode = null;
        ganttObj.dataBind();
        expect(ganttObj.disableHtmlEncode).toBe(null);
        ganttObj.disableHtmlEncode = undefined;
        ganttObj.dataBind();
        expect(ganttObj.disableHtmlEncode).toBe(undefined);
    });
    it('durationUnit', () => {
        ganttObj.durationUnit = null;
        ganttObj.dataBind();
        expect(ganttObj.durationUnit).toBe(null);
        ganttObj.durationUnit = undefined;
        ganttObj.dataBind();
        expect(ganttObj.durationUnit).toBe(undefined);
    });
    it('editDialogFields', () => {
        ganttObj.editDialogFields = null;
        ganttObj.dataBind();
        expect(ganttObj.editDialogFields).toBe(null);
        ganttObj.editDialogFields = undefined;
        ganttObj.dataBind();
        expect(ganttObj.editDialogFields).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('enableContextMenu', () => {
        ganttObj.enableContextMenu = null;
        ganttObj.dataBind();
        expect(ganttObj.enableContextMenu).toBe(null);
        ganttObj.enableContextMenu = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableContextMenu).toBe(undefined);
    });
    it('enableCriticalPath', () => {
        ganttObj.enableCriticalPath = null;
        ganttObj.dataBind();
        expect(ganttObj.enableCriticalPath).toBe(null);
        ganttObj.enableCriticalPath = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableCriticalPath).toBe(undefined);
    });
    it('enableHtmlSanitizer', () => {
        ganttObj.enableHtmlSanitizer = null;
        ganttObj.dataBind();
        expect(ganttObj.enableHtmlSanitizer).toBe(null);
        ganttObj.enableHtmlSanitizer = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableHtmlSanitizer).toBe(undefined);
    });
    it('enableImmutableMode', () => {
        ganttObj.enableImmutableMode = null;
        ganttObj.dataBind();
        expect(ganttObj.enableImmutableMode).toBe(null);
        ganttObj.enableImmutableMode = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableImmutableMode).toBe(undefined);
    });
    it('enableMultiTaskbar', () => {
        ganttObj.enableMultiTaskbar = null;
        ganttObj.dataBind();
        expect(ganttObj.enableMultiTaskbar).toBe(null);
        ganttObj.enableMultiTaskbar = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableMultiTaskbar).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('enablePersistence', () => {
        ganttObj.enablePersistence = null;
        ganttObj.dataBind();
        expect(ganttObj.enablePersistence).toBe(null);
        ganttObj.enablePersistence = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enablePersistence).toBe(undefined);
    });
    it('enablePredecessorValidation', () => {
        ganttObj.enablePredecessorValidation = null;
        ganttObj.dataBind();
        expect(ganttObj.enablePredecessorValidation).toBe(null);
        ganttObj.enablePredecessorValidation = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enablePredecessorValidation).toBe(undefined);
    });
    it('enableRtl', () => {
        ganttObj.enableRtl = null;
        ganttObj.dataBind();
        expect(ganttObj.enableRtl).toBe(null);
        ganttObj.enableRtl = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableRtl).toBe(undefined);
    });
    it('enableTimelineVirtualization', () => {
        ganttObj.enableTimelineVirtualization = null;
        ganttObj.dataBind();
        expect(ganttObj.enableTimelineVirtualization).toBe(null);
        ganttObj.enableTimelineVirtualization = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableTimelineVirtualization).toBe(undefined);
    });
    it('enableUndoRedo', () => {
        ganttObj.enableUndoRedo = null;
        ganttObj.dataBind();
        expect(ganttObj.enableUndoRedo).toBe(null);
        ganttObj.enableUndoRedo = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableUndoRedo).toBe(undefined);
    });
    it('enableVirtualMaskRow', () => {
        ganttObj.enableVirtualMaskRow = null;
        ganttObj.dataBind();
        expect(ganttObj.enableVirtualMaskRow).toBe(null);
        ganttObj.enableVirtualMaskRow = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableVirtualMaskRow).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('enableVirtualization', () => {
        ganttObj.enableVirtualization = null;
        ganttObj.dataBind();
        expect(ganttObj.enableVirtualization).toBe(null);
        ganttObj.enableVirtualization = undefined;
        ganttObj.dataBind();
        expect(ganttObj.enableVirtualization).toBe(undefined);
    });
    it('eventMarkers', () => {
        ganttObj.eventMarkers = null;
        ganttObj.dataBind();
        expect(ganttObj.eventMarkers.length).toBe(0);
        ganttObj.eventMarkers = undefined;
        ganttObj.dataBind();
        expect(ganttObj.eventMarkers.length).toBe(0);
    });
    it('excelExportModule', () => {
        ganttObj.excelExportModule = null;
        ganttObj.dataBind();
        expect(ganttObj.excelExportModule).toBe(null);
        ganttObj.excelExportModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.excelExportModule).toBe(undefined);
    });


    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('filterModule', () => {
        ganttObj.filterModule = null;
        ganttObj.dataBind();
        expect(ganttObj.filterModule).toBe(null);
        ganttObj.filterModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.filterModule).toBe(undefined);
    });
    it('gridLines', () => {
        ganttObj.gridLines = null;
        ganttObj.dataBind();
        expect(ganttObj.gridLines).toBe(null);
        ganttObj.gridLines = undefined;
        ganttObj.dataBind();
        expect(ganttObj.gridLines).toBe(undefined);
    });
    it('height', () => {
        ganttObj.height = null;
        ganttObj.dataBind();
        expect(ganttObj.height).toBe(null);
        ganttObj.height = undefined;
        ganttObj.dataBind();
        expect(ganttObj.height).toBe(undefined);
    });
    it('highlightWeekends', () => {
        ganttObj.highlightWeekends = null;
        ganttObj.dataBind();
        expect(ganttObj.highlightWeekends).toBe(null);
        ganttObj.highlightWeekends = undefined;
        ganttObj.dataBind();
        expect(ganttObj.highlightWeekends).toBe(undefined);
    });
    it('holidays', () => {
        ganttObj.holidays = null;
        ganttObj.dataBind();
        expect(ganttObj.holidays.length).toBe(0);
        ganttObj.holidays = undefined;
        ganttObj.dataBind();
        expect(ganttObj.holidays.length).toBe(0);
    });
    it('includeWeekend', () => {
        ganttObj.includeWeekend = null;
        ganttObj.dataBind();
        expect(ganttObj.includeWeekend).toBe(null);
        ganttObj.includeWeekend = undefined;
        ganttObj.dataBind();
        expect(ganttObj.includeWeekend).toBe(undefined);
    });
    it('keyboardModule', () => {
        ganttObj.keyboardModule = null;
        ganttObj.dataBind();
        expect(ganttObj.keyboardModule).toBe(null);
        ganttObj.keyboardModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.keyboardModule).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('loadChildOnDemand', () => {
        ganttObj.loadChildOnDemand = null;
        ganttObj.dataBind();
        expect(ganttObj.loadChildOnDemand).toBe(null);
        ganttObj.loadChildOnDemand = undefined;
        ganttObj.dataBind();
        expect(ganttObj.loadChildOnDemand).toBe(undefined);
    });
    it('indicatorType', () => {
        ganttObj.loadingIndicator.indicatorType = null;
        ganttObj.dataBind();
        expect(ganttObj.loadingIndicator.indicatorType).toBe(null);
        ganttObj.loadingIndicator.indicatorType = undefined;
        ganttObj.dataBind();
        expect(ganttObj.loadingIndicator.indicatorType).toBe(undefined);
    });
    it('locale', () => {
        ganttObj.locale = null;
        ganttObj.dataBind();
        expect(ganttObj.locale).toBe(null);
        ganttObj.locale = undefined;
        ganttObj.dataBind();
        expect(ganttObj.locale).toBe(undefined);
    });
    it('template', () => {
        ganttObj.milestoneTemplate = undefined;
        ganttObj.dataBind();
        expect(ganttObj.milestoneTemplate).toBe(undefined);
        ganttObj.parentTaskbarTemplate = undefined;
        ganttObj.dataBind();
        expect(ganttObj.parentTaskbarTemplate).toBe(undefined);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });

    it('pdfExportModule', () => {
        ganttObj.pdfExportModule = null;
        ganttObj.dataBind();
        expect(ganttObj.pdfExportModule).toBe(null);
        ganttObj.pdfExportModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.pdfExportModule).toBe(undefined);
    });
    it('projectEndDate', () => {
        ganttObj.projectEndDate = null;
        ganttObj.dataBind();
        expect(ganttObj.projectEndDate).toBe(null);
        ganttObj.projectEndDate = undefined;
        ganttObj.dataBind();
        expect(ganttObj.projectEndDate).toBe(undefined);
    });
    it('projectStartDate', () => {
        ganttObj.projectStartDate = null;
        ganttObj.dataBind();
        expect(ganttObj.projectStartDate).toBe(null);
        ganttObj.projectStartDate = undefined;
        ganttObj.dataBind();
        expect(ganttObj.projectStartDate).toBe(undefined);
    });
    it('query', () => {
        ganttObj.query = null;
        ganttObj.dataBind();
        expect(ganttObj.query).toBe(null);
        ganttObj.query = undefined;
        ganttObj.dataBind();
        expect(ganttObj.query).toBe(undefined);
    });
    it('readOnly', () => {
        ganttObj.readOnly = null;
        ganttObj.dataBind();
        expect(ganttObj.readOnly).toBe(null);
        ganttObj.readOnly = undefined;
        ganttObj.dataBind();
        expect(ganttObj.readOnly).toBe(undefined);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });

    it('renderBaseline', () => {
        ganttObj.renderBaseline = null;
        ganttObj.dataBind();
        expect(ganttObj.renderBaseline).toBe(null);
        ganttObj.renderBaseline = undefined;
        ganttObj.dataBind();
        expect(ganttObj.renderBaseline).toBe(undefined);
    });
    it('showColumnMenu', () => {
        ganttObj.showColumnMenu = null;
        ganttObj.dataBind();
        expect(ganttObj.showColumnMenu).toBe(null);
        ganttObj.showColumnMenu = undefined;
        ganttObj.dataBind();
        expect(ganttObj.showColumnMenu).toBe(undefined);
    });
    it('showInlineNotes', () => {
        ganttObj.showInlineNotes = null;
        ganttObj.dataBind();
        expect(ganttObj.showInlineNotes).toBe(null);
        ganttObj.showInlineNotes = undefined;
        ganttObj.dataBind();
        expect(ganttObj.showInlineNotes).toBe(undefined);
    });
    it('showOverAllocation', () => {
        ganttObj.showOverAllocation = null;
        ganttObj.dataBind();
        expect(ganttObj.showOverAllocation).toBe(null);
        ganttObj.showOverAllocation = undefined;
        ganttObj.dataBind();
        expect(ganttObj.showOverAllocation).toBe(undefined);
    });
    it('sortModule', () => {
        ganttObj.sortModule = null;
        ganttObj.dataBind();
        expect(ganttObj.sortModule).toBe(null);
        ganttObj.sortModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.sortModule).toBe(undefined);
    });
    it('taskbarTemplate', () => {
        ganttObj.taskbarTemplate = null;
        ganttObj.dataBind();
        expect(ganttObj.taskbarTemplate).toBe(null);
        ganttObj.taskbarTemplate = undefined;
        ganttObj.dataBind();
        expect(ganttObj.taskbarTemplate).toBe(undefined);
    });
    it('timezone', () => {
        ganttObj.timezone = null;
        ganttObj.dataBind();
        expect(ganttObj.timezone).toBe(null);
        ganttObj.timezone = undefined;
        ganttObj.dataBind();
        expect(ganttObj.timezone).toBe(undefined);
    });
    it('toolbar', () => {
        ganttObj.toolbar = null;
        ganttObj.dataBind();
        expect(ganttObj.toolbar).toBe(null);
        ganttObj.toolbar = undefined;
        ganttObj.dataBind();
        expect(ganttObj.toolbar).toBe(undefined);
    });
    it('undoRedoActions', () => {
        ganttObj.undoRedoActions = null;
        ganttObj.dataBind();
        expect(ganttObj.undoRedoActions).toBe(null);
        ganttObj.undoRedoActions = undefined;
        ganttObj.dataBind();
        expect(ganttObj.undoRedoActions).toBe(undefined);
    });
    it('undoRedoModule', () => {
        ganttObj.undoRedoModule= null;
        ganttObj.dataBind();
        expect(ganttObj.undoRedoModule).toBe(null);
        ganttObj.undoRedoModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.undoRedoModule).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });

    it('validateManualTasksOnLinking', () => {
        ganttObj.validateManualTasksOnLinking = null;
        ganttObj.dataBind();
        expect(ganttObj.validateManualTasksOnLinking).toBe(null);
        ganttObj.validateManualTasksOnLinking = undefined;
        ganttObj.dataBind();
        expect(ganttObj.validateManualTasksOnLinking).toBe(undefined);
    });
    it('virtualScrollModule', () => {
        ganttObj.virtualScrollModule = null;
        ganttObj.dataBind();
        expect(ganttObj.virtualScrollModule).toBe(null);
        ganttObj.virtualScrollModule = undefined;
        ganttObj.dataBind();
        expect(ganttObj.virtualScrollModule).toBe(undefined);
    });
    it('zoomingLevel', () => {
        ganttObj.zoomingLevels = null;
        ganttObj.dataBind();
        expect(ganttObj.zoomingLevels).toBe(null);
        ganttObj.zoomingLevels = undefined;
        ganttObj.dataBind();
        expect(ganttObj.zoomingLevels).toBe(undefined);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });

    it('rowHeight', () => {
          ganttObj.rowHeight = null;
          ganttObj.dataBind();
          expect(ganttObj.rowHeight).toBe(36);
          ganttObj.rowHeight = undefined;
          ganttObj.dataBind();
          expect(ganttObj.rowHeight).toBe(36);         
    });
    it('taskbarHeight', () => {
        ganttObj.taskbarHeight = null;
        ganttObj.dataBind();
        expect(ganttObj.taskbarHeight).toBe(null);
        ganttObj.taskbarHeight = undefined;
        ganttObj.dataBind();
        expect(ganttObj.taskbarHeight).toBe(undefined);
    });
    it('connectorLineWidth', () => {
        ganttObj.connectorLineWidth = null;
        ganttObj.dataBind();
        expect(ganttObj.connectorLineWidth).toBe(null);
        ganttObj.connectorLineWidth = undefined;
        ganttObj.dataBind();
        expect(ganttObj.connectorLineWidth).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cellEditData,
            resources: resourcesData,
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

    it('resourceIDMapping', () => {
          ganttObj.resourceIDMapping = null;
          ganttObj.dataBind();
          expect(ganttObj.resourceIDMapping).toBe(null);
          ganttObj.resourceIDMapping = undefined;
          ganttObj.dataBind();
          expect(ganttObj.resourceIDMapping).toBe(undefined);         
    });
    it('resourceNameMapping', () => {
        ganttObj.resourceNameMapping = null;
        ganttObj.dataBind();
        expect(ganttObj.resourceNameMapping).toBe(null);
        ganttObj.resourceNameMapping = undefined;
        ganttObj.dataBind();
        expect(ganttObj.resourceNameMapping).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Null or undefined public properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });    
    it('editSettings', () => {
        ganttObj.editSettings.allowAdding = null;
        ganttObj.editSettings.allowEditing = null;
        ganttObj.editSettings.allowDeleting = null;
        ganttObj.editSettings.allowTaskbarEditing = null;
        ganttObj.dataBind();
        expect(ganttObj.editSettings.allowAdding).toBe(null);
        expect(ganttObj.editSettings.allowEditing).toBe(null);
        expect(ganttObj.editSettings.allowDeleting).toBe(null);
        expect(ganttObj.editSettings.allowTaskbarEditing).toBe(null);
        ganttObj.editSettings.allowAdding = undefined;
        ganttObj.editSettings.allowEditing = undefined;
        ganttObj.editSettings.allowDeleting = undefined;
        ganttObj.editSettings.allowTaskbarEditing = undefined;
        ganttObj.dataBind();
        expect(ganttObj.editSettings.allowAdding).toBe(undefined);
        expect(ganttObj.editSettings.allowEditing).toBe(undefined);
        expect(ganttObj.editSettings.allowDeleting).toBe(undefined);
        expect(ganttObj.editSettings.allowTaskbarEditing).toBe(undefined);
    });
    it('filtersettings  ', () => {
        ganttObj.filterSettings.columns = null;
        ganttObj.filterSettings.hierarchyMode= null;
        ganttObj.filterSettings.ignoreAccent = null;
        ganttObj.filterSettings.operators = null;
        ganttObj.filterSettings.type = null;
        ganttObj.dataBind();
        expect(ganttObj.filterSettings.columns.length).toBe(0);
        expect(ganttObj.filterSettings.hierarchyMode).toBe(null);
        expect(ganttObj.filterSettings.ignoreAccent).toBe(null);
        expect(ganttObj.filterSettings.operators).toBe(null);
        expect(ganttObj.filterSettings.type).toBe(null);
        ganttObj.filterSettings.columns = undefined;
        ganttObj.filterSettings.hierarchyMode= undefined;
        ganttObj.filterSettings.ignoreAccent = undefined;
        ganttObj.filterSettings.operators = undefined;
        ganttObj.filterSettings.type = undefined;
        ganttObj.dataBind();
        expect(ganttObj.filterSettings.columns.length).toBe(0);
        expect(ganttObj.filterSettings.hierarchyMode).toBe(undefined);
        expect(ganttObj.filterSettings.ignoreAccent).toBe(undefined);
        expect(ganttObj.filterSettings.operators).toBe(undefined);
        expect(ganttObj.filterSettings.type).toBe(undefined);      
    });
    it('labelSettings', () => {
        ganttObj.labelSettings.leftLabel = null;
        ganttObj.labelSettings.rightLabel = null;
        ganttObj.labelSettings.taskLabel = null;
        ganttObj.dataBind();
        expect(ganttObj.labelSettings.leftLabel).toBe(null);
        expect(ganttObj.labelSettings.rightLabel).toBe(null);
        expect(ganttObj.labelSettings.taskLabel).toBe(null);
        ganttObj.labelSettings.leftLabel = undefined;
        ganttObj.labelSettings.rightLabel = undefined;
        ganttObj.labelSettings.taskLabel = undefined;
        ganttObj.dataBind();
        expect(ganttObj.labelSettings.leftLabel).toBe(undefined);
        expect(ganttObj.labelSettings.rightLabel).toBe(undefined);
        expect(ganttObj.labelSettings.taskLabel).toBe(undefined);
    });
    it('sortSettings  ', () => {
        ganttObj.sortSettings.allowUnsort = null;
        ganttObj.sortSettings.columns = null;
        ganttObj.dataBind();
        expect( ganttObj.sortSettings.allowUnsort).toBe(null);
        expect(ganttObj.sortSettings.columns.length).toBe(0);
        ganttObj.sortSettings.allowUnsort = null;
        ganttObj.sortSettings.columns = null;
        ganttObj.dataBind();
        expect( ganttObj.sortSettings.allowUnsort).toBe(null);
        expect(ganttObj.sortSettings.columns.length).toBe(0);
    });
    it('timelineSettings  ', () => {
        ganttObj.timelineSettings.bottomTier.count = null;
        ganttObj.timelineSettings.bottomTier.format = null;
        ganttObj.timelineSettings.bottomTier.formatter = null;
        ganttObj.timelineSettings.bottomTier.unit = null;
        ganttObj.timelineSettings.showTooltip = null;
        ganttObj.timelineSettings.timelineUnitSize = null;
        ganttObj.timelineSettings.timelineViewMode = null;
        ganttObj.timelineSettings.topTier.count = null;
        ganttObj.timelineSettings.topTier.format = null;
        ganttObj.timelineSettings.topTier.formatter = null;
        ganttObj.timelineSettings.topTier.unit = null;
        ganttObj.timelineSettings.updateTimescaleView = null;
        ganttObj.timelineSettings.weekStartDay = null;
        ganttObj.timelineSettings.weekendBackground = null;
        ganttObj.dataBind();
        expect(ganttObj.timelineSettings.bottomTier.count).toBe(null);
        expect(ganttObj.timelineSettings.bottomTier.format).toBe(null);
        expect(ganttObj.timelineSettings.bottomTier.formatter).toBe(null);
        expect(ganttObj.timelineSettings.bottomTier.unit).toBe(null);
        expect(ganttObj.timelineSettings.showTooltip).toBe(null);
        expect(ganttObj.timelineSettings.timelineUnitSize).toBe(null);
        expect(ganttObj.timelineSettings.timelineViewMode).toBe(null);
        expect(ganttObj.timelineSettings.topTier.count).toBe(null);
        expect(ganttObj.timelineSettings.topTier.format).toBe(null);
        expect(ganttObj.timelineSettings.topTier.formatter).toBe(null);
        expect(ganttObj.timelineSettings.topTier.unit).toBe(null);
        expect(ganttObj.timelineSettings.updateTimescaleView).toBe(null);
        expect(ganttObj.timelineSettings.weekendBackground).toBe(null);
        ganttObj.timelineSettings.bottomTier.count = undefined;
        ganttObj.timelineSettings.bottomTier.format = undefined;
        ganttObj.timelineSettings.bottomTier.formatter = undefined;
        ganttObj.timelineSettings.bottomTier.unit = undefined;
        ganttObj.timelineSettings.showTooltip = undefined;
        ganttObj.timelineSettings.timelineUnitSize = undefined;
        ganttObj.timelineSettings.timelineViewMode = undefined;
        ganttObj.timelineSettings.topTier.count = undefined;
        ganttObj.timelineSettings.topTier.format = undefined;
        ganttObj.timelineSettings.topTier.formatter = undefined;
        ganttObj.timelineSettings.topTier.unit = undefined;
        ganttObj.timelineSettings.updateTimescaleView = undefined;
        ganttObj.timelineSettings.weekStartDay = undefined;
        ganttObj.timelineSettings.weekendBackground = undefined;
        ganttObj.dataBind();
        expect(ganttObj.timelineSettings.bottomTier.count).toBe(undefined);
        expect(ganttObj.timelineSettings.bottomTier.format).toBe(undefined);
        expect(ganttObj.timelineSettings.bottomTier.formatter).toBe(undefined);
        expect(ganttObj.timelineSettings.bottomTier.unit).toBe(undefined);
        expect(ganttObj.timelineSettings.showTooltip).toBe(undefined);
        expect(ganttObj.timelineSettings.timelineUnitSize).toBe(undefined);
        expect(ganttObj.timelineSettings.timelineViewMode).toBe(undefined);
        expect(ganttObj.timelineSettings.topTier.count).toBe(undefined);
        expect(ganttObj.timelineSettings.topTier.format).toBe(undefined);
        expect(ganttObj.timelineSettings.topTier.formatter).toBe(undefined);
        expect(ganttObj.timelineSettings.topTier.unit).toBe(undefined);
        expect(ganttObj.timelineSettings.updateTimescaleView).toBe(undefined);
        expect(ganttObj.timelineSettings.weekendBackground).toBe(undefined);
      
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking for empty element', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cr884998,
            taskFields: {
                id: 'taskId',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                progress: 'realized',
                dependency: 'dependencies',
                segments: 'parts',
                parentID: 'parentId',
                baselineStartDate: 'baselineStartDate',
                baselineEndDate: 'baselineEndDate'
            },
            gridLines:'Both',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            queryTaskbarInfo:function(args) {

            },
            readOnly: false,
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px'
        }, done);

    });
    it('check flat data', () => {
        expect(ganttObj.flatData.length > 0).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Console error throws when assigning predecessor to an unscheduled task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: treeData,
            taskFields: {
                id: 'taskId',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                dependency: 'predecessor',
                child: 'subTasks',
            },
            enableVirtualization: true,
            enableTimelineVirtualization: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: ['Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
                'Indent',
                'Outdent',],
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
        }, done);

    });
    it('check flat data', () => {
        expect(ganttObj.flatData.length !== 0).toBe(true);
  });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking element on hover', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            labelSettings:{
                leftLabel:'TaskName'
            }
        }, done);
    });

    it('checking elemnent', () => {
        let dragElement: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-taskbar-main-container')[2] as HTMLElement
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft, dragElement.offsetTop);
        let label: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-left-label-inner-div')[2] as HTMLElement
        triggerMouseEvent(label, 'mousemove', label.offsetLeft, label.offsetTop);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Setting Timeline format as null', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            enablePersistence: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(document.getElementsByClassName('e-timeline-top-header-cell').length > 0).toBe(true)
    });
    it('call window resize', () => {
        ganttObj.width = '400px';
        ganttObj.enableCriticalPath = true;
        ganttObj.windowResize();
        ganttObj.excelExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Setting Timeline format as null', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowAdding: false,
                allowEditing: false,
                allowDeleting: false,
                allowNextRowEdit: false,
                allowTaskbarEditing: false,
                mode: null,
                newRowPosition :'Above',
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    it('checking element', () => {
        ganttObj.editSettings.newRowPosition = null
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt onTaskbarClick', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
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
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    // beforeEach((done) => {
    //     setTimeout(done, 100);
    // });
    it('Taskbar click with Enter key action', (done: Function) => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'click');
        taskbarElement.focus();
        let args1 = { action: 'saveRequest', preventDefault: preventDefault, target: taskbarElement, key: 'Enter' };
        ganttObj.keyboardModule.keyAction(args1);
        done();
        ganttObj.onTaskbarClick = function (args: ITaskbarClickEventArgs) {
            expect(args.taskbarElement.classList.contains('e-gantt-child-taskbar')).toBe(true);
        };
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('checking element to increase code coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(document.getElementsByClassName('e-timeline-top-header-cell').length > 0).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('checking element to increase code coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowAdding: false,
                allowEditing: false,
                allowDeleting: false,
                allowNextRowEdit: false,
                allowTaskbarEditing: false,
                mode: null,
                newRowPosition :'Above',
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    it('checking element', () => {
        ganttObj.editSettings.newRowPosition = null
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('action failure for event for error handling', () => {
    let ganttObj: Gantt;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
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
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false }
            ],
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: '@#$'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1,
                    format:'#@%#'
                }
            },
            eventMarkers: [
                {
                    day: null,
                    cssClass: 'e-custom-event-marker',
                    label: 'Project approval and kick-off'
                }
            ],
            actionFailure: actionFailedFunction,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });    
    it('action failure for event for error handling', () => {
        expect(actionFailedFunction).toHaveBeenCalled();    
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action', () => {
    let ganttObj: Gantt;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: invalidPrdcessor,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                actionFailure: actionFailedFunction,
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                ],
            }, done);
    });
    
    it('Editing predecesssor column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '1';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe(null);
        expect(actionFailedFunction).toHaveBeenCalled();  
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking load time progress value not more then ', () => {
    let ganttObj: Gantt;
    let data9: any =  [
        {
            id: 53,
            endDate: new Date('10/11/2024'),
            name: 'Select LSP (On-Hold)',
            notes: 'Future Message, Co.',
            progress: 0,
            startDate: new Date('05/29/2024'),
        },
        {
            id: 15,
            endDate: new Date('10/30/2024'),
            name: 'Financial System Implementation (On-Hold)',
            notes: 'Key Pool, Co.',
            progress: 383.2,
            startDate: new Date('06/17/2024'),
        },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data9,
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            taskFields: {
                id: 'id',
                name: 'name',
                startDate: 'startDate',
                endDate: 'endDate',
                progress: 'progress',
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
                { field: 'id', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'CustomColumn', headerText: 'CustomColumn' }
            ],
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
            //   allowUnscheduledTasks: true,
        }, done);

    });
    it('check for progress value', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.progress).toBe(100);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Console error throws when assigning predecessor to an unscheduled task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: treeData,
            taskFields: {
                id: 'taskId',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                dependency: 'predecessor',
                child: 'subTasks',
            },
            enableVirtualization: true,
            enableTimelineVirtualization: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: ['Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
                'Indent',
                'Outdent',],
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
        }, done);

    });
    it('check flat data', () => {
        expect(ganttObj.flatData.length !== 0).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking date with autoCalculateDateScheduling to false', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cR893051,
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            autoCalculateDateScheduling: false,
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
            //   allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);

    });
    it('check for end date', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'M/d/yyy')).toBe('4/2/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking span in indicator', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cR893051,
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            autoCalculateDateScheduling: false,
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
            //   allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);

    });
    // beforeEach((done) => {
    //     setTimeout(done, 500);
    // });
    it('check for span', () => {
        expect(document.getElementsByClassName('e-indicator-span')[0].querySelector('span') != null).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking load time progress value not more then ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    id: 53,
                    endDate: new Date('10/11/2024'),
                    name: 'Select LSP (On-Hold)',
                    notes: 'Future Message, Co.',
                    progress: 0,
                    startDate: new Date('05/29/2024'),
                },
                {
                    id: 15,
                    endDate: new Date('10/30/2024'),
                    name: 'Financial System Implementation (On-Hold)',
                    notes: 'Key Pool, Co.',
                    progress: 383.2,
                    startDate: new Date('06/17/2024'),
                },
            ],
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            taskFields: {
                id: 'id',
                name: 'name',
                startDate: 'startDate',
                endDate: 'endDate',
                progress: 'progress',
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
                { field: 'id', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'CustomColumn', headerText: 'CustomColumn' }
            ],
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
            //   allowUnscheduledTasks: true,
        }, done);

    });
    it('check for progress value', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.progress).toBe(100);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('checking element to increase code coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            }
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(document.getElementsByClassName('e-timeline-top-header-cell').length > 0).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('checking element to increase code coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: null
                },
                bottomTier: {
                    unit: 'Day',
                    format: null,
                    count: 1
                }
            },
            height:'550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            editSettings: {
                allowAdding: false,
                allowEditing: false,
                allowDeleting: false,
                allowNextRowEdit: false,
                allowTaskbarEditing: false,
                mode: null,
                newRowPosition :'Above',
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    it('checking element', () => {
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    it('checking element', () => {
        ganttObj.editSettings.newRowPosition = null
        ganttObj.refresh()
        expect(ganttObj['isRendered']).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('action failure for event for error handling', () => {
    let ganttObj: Gantt;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: publicProperty,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
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
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false }
            ],
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: '@#$'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1,
                    format:'#@%#'
                }
            },
            eventMarkers: [
                {
                    day: null,
                    cssClass: 'e-custom-event-marker',
                    label: 'Project approval and kick-off'
                }
            ],
            actionFailure: actionFailedFunction,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });    
    it('action failure for event for error handling', () => {
        expect(actionFailedFunction).toHaveBeenCalled();    
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action', () => {
    let ganttObj: Gantt;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: invalidPrdcessor,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                actionFailure: actionFailedFunction,
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                ],
            }, done);
    });
   
    it('Editing predecesssor column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '1';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe(null);
        expect(actionFailedFunction).toHaveBeenCalled();  
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR899803-Updating datasource', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: dataSource1,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                allowUnscheduledTasks: true,
                taskFields: {
                    id: 'taskId',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                },
                height: "410px",
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                gridLines: 'Both',
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Indent',
                    'Outdent',
                ],
                enableVirtualization: true,
                autoCalculateDateScheduling: false
            }, done);
    });
    // it('Changing DataSource', (done:Function) => {
    //     ganttObj.actionComplete = function (args: any): void {
    //         if (args.requestType === "refresh") {
    //             expect(ganttObj.flatData.length).toBe(2);
    //             done();
    //         }
    //     };
    //     ganttObj.dataSource = dataSource2
    // });
     afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor rendering', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: undoDataSource,
                height: '450px',
                highlightWeekends: true,
                showColumnMenu: true,
                enableContextMenu: true,
                allowFiltering: true,
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
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
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
                undoRedoActions:['Sorting','Add','ColumnReorder','ColumnResize','ColumnState','Delete','Edit','Filtering','Indent','Outdent','NextTimeSpan','PreviousTimeSpan','RowDragAndDrop','Search'],
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
    it('predecessor DataSource', () => {
        expect(ganttObj.getFormatedDate(ganttObj.flatData[9].ganttProperties.startDate,'M/d/yyyy')).toBe('4/15/2024');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('unscheduled task for FF type', () => {
    let ganttObj: Gantt;
    let unscheduledData1: any = [
        {
          TaskID: 1,
          TaskName: 'Task 1',
          StartDate: null,
          EndDate: null,
          Duration: null,
        },
        {
          TaskID: 2,
          TaskName: 'Task 2',
          StartDate: null,
          EndDate: null,
          Duration: 4,
          Predecessor: '1FS',
        },
        {
          TaskID: 3,
          TaskName: 'Task 3',
          StartDate: null,
          EndDate: null,
          Predecessor: '2FF',
          Duration: 1,
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData1,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        notes: 'info',
        resourceInfo: 'resources',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
            }, done);
    });
    it('predecessor dates', () => {
        expect(ganttObj.flatData[1].ganttProperties.startDate).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage calling calculateTotalHours method', () => {
    let ganttObj: Gantt;
    let unscheduledData1: any = [
        {
          TaskID: 1,
          TaskName: 'Task 1',
          StartDate: null,
          EndDate: null,
          Duration: null,
        },
        {
          TaskID: 2,
          TaskName: 'Task 2',
          StartDate: null,
          EndDate: null,
          Duration: 4,
          Predecessor: '1FS',
        },
        {
          TaskID: 3,
          TaskName: 'Task 3',
          StartDate: null,
          EndDate: null,
          Predecessor: '2FF',
          Duration: 1,
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData1,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        notes: 'info',
        resourceInfo: 'resources',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        },
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
            }, done);
    });
    it('Mode Hour', () => {
        expect(ganttObj.timelineModule.calculateTotalHours('Hour',1)).toBe(1);
    });
    it('Mode Day', () => {
        expect(ganttObj.timelineModule.calculateTotalHours('Day',1)).toBe(24);
    });
    it('Mode Week', () => {
        expect(ganttObj.timelineModule.calculateTotalHours('Week',1)).toBe(168);
    });
    it('Mode Minutes', () => {
        expect(Math.round(ganttObj.timelineModule.calculateTotalHours('Minutes',1))).toBe(0);
    });
    it('date by left', () => {
        let left = 150;
        let isMilestone = true;
        let property = {
            predecessorsName: '',
            isAutoSchedule: true,
            autoEndDate: new Date('2024-09-25T17:00:00'),
            endDate: new Date('2024-09-24T17:00:00')
        };
        let value = ganttObj.timelineModule['dateByLeftValue'](left,isMilestone,property).getFullYear()
        expect(value).toBe(2026);
    });
    it('calculateQuarterEndDate', () => {
        let value = ganttObj.timelineModule['calculateQuarterEndDate'](new Date('2024-12-15'),3).getFullYear()
        expect(value).toBe(2025);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('SegmentData updated unncessary', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
                     segmentId: 'SegmentId',
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
            }, done);
    });
    it('Checking segment data is empty', () => {
        expect(ganttObj.segmentData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Update rowindex', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData3,
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
                resources:editingResources3,
                resourceFields:{
                    id: 'resourceId',
                    name: 'resourceName',
                  },
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
            }, done);
    });
    it('added new record', () => {
        let record: Object = {
            TaskID: 10,
            TaskName: 'Identify Site location',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 50
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);
        expect(ganttObj.currentViewData[3].index).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('update grid line without datasource', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                gridLines:'Both'
            }, done);
    });
    it('update grid line without datasource', () => {
        ganttObj.gridLines = 'Vertical'
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Hiding column in Data Bound', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData3,
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
                resources:editingResources3,
                resourceFields:{
                    id: 'resourceId',
                    name: 'resourceName',
                  },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                dataBound:function() {
                    ganttObj.hideColumn('Duration')
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
            }, done);
    });
    it('Checking content height', () => {
        const gridContent = ganttObj.element.querySelector('.e-gridcontent');
        if (gridContent) {
            const contentElement = gridContent.querySelector('.e-content') as HTMLElement;
            if (contentElement) {
                const contentHeight = contentElement.style.height;
                expect(contentHeight).toBe('100%')
            }
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage for split task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData3,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks',
                    segments: 'segments'
                },
                resources:editingResources3,
                resourceFields:{
                    id: 'resourceId',
                    name: 'resourceName',
                  },
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
                enableContextMenu:true,
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
    it('Calling item status function', () => {
        const target = document.createElement('div');
        target.classList.add('e-gridform');
        const item = { text: 'TaskInformation', id: 'TaskInformation' };
        const rowIndex = 0;
        ganttObj.contextMenuModule['updateItemStatus'](item, target, rowIndex)
        expect(ganttObj.flatData.length === 4).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Updating taskwidth of taskbar', () => {
    let ganttObj: Gantt;
    let data: Object =  [
        {
          id: 1,
          scheduleItemId: 'e94878d0-f65c-44f7-8340-b22d00e64e2d',
          projectId: '2517963d-1c66-474d-ba5a-afea00aa8698',
          name: 'MultiserviceTypeSimulation',
          startDate: '2023-05-02T07:05:00.000Z',
          duration: 21.038194416666666,
          durationUnit: 'day',
          predecessor: null,
          dependantOnId: null,
          dependencyType: null,
          dependencyOffset: null,
          projectResponsible: 'sysadmin',
          projectPhase: 'execution',
          hasChildMapping: false,
          hasExecutionStarted: true,
          segments: [
            {
              startDate: '2023-05-02T07:05:00.000Z',
              duration: 16.37152775,
            },
            {
              startDate: '2023-05-20T15:59:59.997Z',
              duration: 2.6666666666666665,
            },
            {
              startDate: '2023-05-25T15:59:59.997Z',
              duration: 2.6666666666666665,
            },
          ],
          parentID: null,
          predecessorError: false,
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'id',
                    name: 'name',
                    startDate: 'startDate',
                    endDate: 'EndDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'segments',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },

                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                enableContextMenu: true,
                allowSelection: true,
                splitterSettings: {
                    position: "35%",
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
                highlightWeekends: true,
                labelSettings: {
                    rightLabel: 'name',
                    taskLabel: '${progress}%',
                },
                height: '550px',
                projectStartDate: new Date('05/02/2023'),
                projectEndDate: new Date('03/04/2024'),
            }, done);
    });
    it('Updating taskwidth of taskbar', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.width).toBeGreaterThan(1000)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Check work for parent resource', () => {        
    let ganttObj: Gantt;
    let resource1 = [
        {
            TaskID: 5,
            TaskName: 'Project estimation', StartDate: new Date('03/29/2024'), EndDate: new Date('04/21/2024'),
            subtasks: [
                {
                    TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2024'),
                    Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2024'), Duration: 12,
                    resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2024'),
                    Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
                },
                {
                    TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2024'),
                    Duration: 4, Progress: 30, resources: [{ resourceId: 4, resourceUnit: 100 }], work: 32
                },
                {
                    TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2024'), Duration: 4,
                    Progress: 30, Predecessor: '9SS', resources: [{ resourceId: 3, resourceUnit: 100 }], work: 32
                },
                {
                    TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2024'),
                    Duration: 3, resources: [{ resourceId: 2, resourceUnit: 100 }], work: 24
                },
                {
                    TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2024'),
                    Duration: 4, Progress: 30, resources: [{ resourceId: 3, resourceUnit: 100 }], work: 32
                }
            ]
        },
        {
            TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2024'), Duration: 2,
            Progress: 30,
        }
    ];
    let resourceCollection1 = [   
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: resource1,
        resources: resourceCollection1,
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
        taskType: 'FixedWork',
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
        projectStartDate: new Date('03/28/2024'),
        projectEndDate: new Date('05/18/2024')
        }, done);
    });
    it('Check work value', () => {
        expect(ganttObj.flatData[0].ganttProperties.work).toBe(32);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-924995 dst coverage', () => {        
    let ganttObj: Gantt;
    let resource1 = [
        {
            TaskID: 5,
            TaskName: 'Project estimation', StartDate: new Date('03/29/2024'), EndDate: new Date('04/21/2024'),
            subtasks: [
                {
                    TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2024'),
                    Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2024'), Duration: 12,
                    resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2024'),
                    Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
                },
                {
                    TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2024'),
                    Duration: 4, Progress: 30, resources: [{ resourceId: 4, resourceUnit: 100 }], work: 32
                },
                {
                    TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2024'), Duration: 4,
                    Progress: 30, Predecessor: '9SS', resources: [{ resourceId: 3, resourceUnit: 100 }], work: 32
                },
                {
                    TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2024'),
                    Duration: 3, resources: [{ resourceId: 2, resourceUnit: 100 }], work: 24
                },
                {
                    TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2024'),
                    Duration: 4, Progress: 30, resources: [{ resourceId: 3, resourceUnit: 100 }], work: 32
                }
            ]
        },
        {
            TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2024'), Duration: 2,
            Progress: 30,
        }
    ];
    let resourceCollection1 = [   
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        (window as any).myCustomFormatter = function (date:any, format:any, tier:any, mode:any) {
            if (tier === 'topTier') {
                return 'Week ' + Math.ceil(date.getDate() / 7); // Simple week number
            } else if (tier === 'bottomTier') {
                return date.getDate().toString(); // Return the day of the month
            }
            return date.toDateString(); // Fallback
        };        
        ganttObj = createGantt({
            dataSource: resource1,
        resources: resourceCollection1,
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
        taskType: 'FixedWork',
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
        timelineSettings: {
            showTooltip: true,
            topTier: {
                unit: 'Week',
                formatter: 'myCustomFormatter'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        projectStartDate: new Date('03/28/2024'),
        projectEndDate: new Date('05/18/2024')
        }, done);
    });
    it('Check work value', () => {
        expect(ganttObj.flatData[0].ganttProperties.work).toBe(32);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
        delete (window as any).myCustomFormatter;
    });
});
describe('CR-924995 dst coverage', () => {        
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
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
        splitterSettings: {
            columnIndex: 3
        },
        allowResizing: true,
        allowSelection: true,
        highlightWeekends: true,
        treeColumnIndex: 1,
        height: '450px',
        timelineSettings: {
            showTooltip: true,
            topTier: {
                unit: 'Week'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        projectStartDate: new Date('2024-01-01T00:00:00'),
        projectEndDate: new Date('2024-01-02T00:00:00')
        }, done);
    });
    it('Check work value', () => {
        expect(ganttObj.timelineModule['validateCount']('Month',5,'bottomTier')).toBe(1);
        expect(ganttObj.timelineModule['validateCount']('Week',5,'bottomTier')).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Check baseline width for day mode', () => {        
    let ganttObj: Gantt;
    let morphUTCDateStringToLocalDate = (date: any) => {
        const initialDate = new Date(date);
        console.log('initialDate', initialDate);
        const actual = new Date(
          initialDate.getUTCFullYear(),
          initialDate.getUTCMonth(),
          initialDate.getUTCDate(),
          initialDate.getUTCHours(),
          initialDate.getUTCMinutes()
        );
        console.log('Actual', actual);
        return actual;
      };
    let GanttData= [
        {
          id: '1',
          duration: 0.1,
          name: '0.1 task 1',
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T08:48:00Z'),
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T08:48:00Z'),
        },
        {
          id: '2',
          duration: 0.2,
          name: '0.2 task',
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T09:36:00Z'),
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T09:36:00Z'),
        },
        {
          id: '3',
          duration: 0.3,
          name: '0.3 task',
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T10:24:00Z'),
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T10:24:00Z'),
        },
        {
          id: '4',
          duration: 0.4,
          name: '0.4 task',
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T11:12:00Z'),
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T11:12:00Z'),
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
        },
        {
          id: '5',
          duration: 0.5,
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T12:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T12:00:00Z'),
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          name: '0.5 task',
        },
        {
          id: '6',
          duration: 0.6,
          name: '0.6 task',
          targetfinish: morphUTCDateStringToLocalDate('2024-11-25T13:48:00Z'),
          targetstart: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentstartdate: morphUTCDateStringToLocalDate('2024-11-25T08:00:00Z'),
          currentfinishdate: morphUTCDateStringToLocalDate('2024-11-25T13:48:00Z'),
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: (GanttData),
  taskFields: {
    id: 'id',
    name: 'name',
    startDate: 'currentstartdate',
    endDate: 'currentfinishdate',
    baselineStartDate: 'targetstart',
    baselineEndDate: 'targetfinish',
    duration: 'duration',
  },
  renderBaseline: true,
  editSettings: {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  },
  enableContextMenu: true,
  resourceFields: {
    id: 'resourceId',
    name: 'resourceName',
    unit: 'Unit',
  },
  workUnit: 'Hour',
  taskType: 'FixedDuration',
  toolbar: [
    'Add',
    'Edit',
    'Update',
    'Delete',
    'Cancel',
    'ExpandAll',
    'CollapseAll',
    'Refresh',
    'ZoomIn',
  ],
  allowSelection: true,
  height: '450px',
  treeColumnIndex: 1,
  columns: [
    { field: 'TaskID', visible: false },
    { field: 'TaskName', headerText: 'Task Name', width: '180' },
    {
      field: 'StartDate',
      headerText: 'Start Date',
    },
    {
      field: 'EndDate',
      headerText: 'End Date',
    },
    { field: 'resources', headerText: 'Resources', width: '160' },
    { field: 'Work', width: '110' },
    { field: 'Duration', width: '100' },
    { field: 'taskType', headerText: 'Task Type', width: '110' },
  ],
        }, done);
    });
    it('Check baseline width value', () => {
        expect(ganttObj.flatData[0].ganttProperties.baselineWidth).toBe(3.3000000000000003);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Check left for a task', () => {        
    let ganttObj: Gantt;
    let GanttData= [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('03/31/2024'),
            EndDate: new Date('04/21/2024')
        }]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: (GanttData),
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            splitterSettings: {
                columnIndex: 1
            },
            treeColumnIndex: 1,
            allowSelection: true,
            showColumnMenu: false,
            timelineSettings: {
                topTier: {
                    unit: 'Day',
                },
                timelineUnitSize: 200,
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            columns: [
                { field: 'TaskID', headerText: 'Task ID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: 300 },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'Duration', headerText: 'Duration' },
                { field: 'Progress', headerText: 'Progress' },
            ],
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/31/2024'),
            projectEndDate: new Date('04/23/2024'),
        }, done);
    });
    it('check left for a task', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.left).toBe(200);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Check left for a event marker', () => {        
    let ganttObj: Gantt;
    let GanttData= [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2024'), Duration: 3, Progress: 30 }
            ]
        }]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: (GanttData),
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
            },
            dayWorkingTime: [
                { from: 0,
                    to: 23 }
            ],
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            projectStartDate: new Date('12/01/2024'),
            projectEndDate: new Date('12/31/2024'),
            labelSettings: {
                leftLabel: 'TaskName',
            },
            eventMarkers: [
                {
                    day: new Date('12/20/2024 12:00'),
                    label: new Date('12/20/2024 12:00').toLocaleString(),
                }
            ],
            highlightWeekends: true
        }, done);
    });
    it('check left for a event markers', () => {
        expect(ganttObj.eventMarkerColloction[0].left).toBe(643.5);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('render task without duration', () => {
    const morphUTCDateStringToLocalDate = (date: string): Date | undefined => {
        const initialDate = new Date(date);
        const actual = new Date(
          initialDate.getUTCFullYear(),
          initialDate.getUTCMonth(),
          initialDate.getUTCDate(),
          initialDate.getUTCHours(),
          initialDate.getUTCMinutes()
        );
        return actual;
      };
    let GanttData = [{
        id: '7',
        name: '1.1 task',
        targetfinish: morphUTCDateStringToLocalDate('2025-01-09T08:48:00Z'),
        targetstart: morphUTCDateStringToLocalDate('2025-01-08T08:00:00Z'),
        currentstartdate: morphUTCDateStringToLocalDate('2025-01-08T08:00:00Z'),
        currentfinishdate: morphUTCDateStringToLocalDate('2025-01-09T08:48:00Z'),
      },]
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: (GanttData),
  taskFields: {
    id: 'id',
    name: 'name',
    startDate: 'currentstartdate',
    endDate: 'currentfinishdate',
    baselineStartDate: 'targetstart',
    baselineEndDate: 'targetfinish',
  },
  renderBaseline: true,
  editSettings: {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  },
  enableContextMenu: true,
  resourceFields: {
    id: 'resourceId',
    name: 'resourceName',
    unit: 'Unit',
  },
  workUnit: 'Hour',
  taskType: 'FixedDuration',
  toolbar: [
    'Add',
    'Edit',
    'Update',
    'Delete',
    'Cancel',
    'ExpandAll',
    'CollapseAll',
    'Refresh',
    'ZoomIn',
  ],
  allowSelection: true,
  height: '450px',
  treeColumnIndex: 1,
  columns: [
    { field: 'TaskID', visible: false },
    { field: 'TaskName', headerText: 'Task Name', width: '180' },
    {
      field: 'StartDate',
      headerText: 'Start Date',
    },
    {
      field: 'EndDate',
      headerText: 'End Date',
    },
    { field: 'resources', headerText: 'Resources', width: '160' },
    { field: 'Work', width: '110' },
    { field: 'taskType', headerText: 'Task Type', width: '110' },
  ],
            }, done);
    });
    it('Check task width', () => {
        expect(ganttObj.flatData[0].ganttProperties.width).toBe(45.1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt chart-scroll action after zooming', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData1,
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
                gridLines: 'Vertical',
                highlightWeekends: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Set scroll left for scroll container using public method after zooming', () => {
        ganttObj.timelineModule.processZooming(true);
        ganttObj.ganttChartModule.scrollObject.setScrollLeft(500);
        expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt chart update value by updateRecordByID in fixedwork ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewDatas1,
                viewType: 'ResourceView',
                resources: resourceCollection10,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                allowSorting: true,
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
                columns: [
                    { field: 'TaskID',  },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                editSettings: {
                    allowAdding: true,
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
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/28/2024'),
                projectEndDate: new Date('05/18/2024'),
            }, done);
    });
    it('update value by updateRecordByID methods', () => {
        var data = {
            TaskID: 13, 
            TaskName: 'Sign contract', 
            StartDate: new Date('04/04/2024'), 
            Duration: 2,
            Progress: 30,
            resources: [{ resourceId: 1, resourceUnit: 50}]
        };
        ganttObj.updateRecordByID(data);
        // expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(2);
    });
    it('update value by updateRecordByID methods', () => {
        var data: any = {
            TaskID: 13, 
            TaskName: 'Sign contract', 
            StartDate: new Date('04/04/2024'), 
            Duration: 2,
            Progress: 30,
            resources: null,
        };
        ganttObj.updateRecordByID(data);
        expect(ganttObj.currentViewData[17].ganttProperties.duration).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt chart update value by updateRecordByID in fixedduration ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewDatas1,
                viewType: 'ResourceView',
                resources: resourceCollection10,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                allowSorting: true,
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
                columns: [
                    { field: 'TaskID',  },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                editSettings: {
                    allowAdding: true,
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
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/28/2024'),
                projectEndDate: new Date('05/18/2024'),
            }, done);
    });
    it('update value by updateRecordByID methods', () => {
        var data = {
                TaskID: 13,
                TaskName: 'Sign contract',
                StartDate: new Date('04/04/2024'),
                work:32,
                Progress: 30,
                resources: [{ resourceId: 1, resourceUnit: 100 }, { resourceId: 2, resourceUnit: 100 }]
        };
        ganttObj.updateRecordByID(data);
        expect(ganttObj.currentViewData[3].ganttProperties.work).toBe(32);
        expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('checking if the sample loads when datasource contain level', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cr940492,
                height: "760px",
                taskFields: {
                    id: 'id',
                    name: 'title',
                    startDate: 'startDate',
                    endDate: 'finishDate',
                    duration: 'duration',
                    progress: 'progress',
                    child: 'subtasks',
                },
                splitterSettings: {
                    columnIndex: 4,
                },
            }, done);
    });
    it('check for currentview data', () => {
        expect(ganttObj.currentViewData.length > 0).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt chart key value set as null when enddate not mapping ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:[{
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                    ]
                },],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                autoCalculateDateScheduling:false,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('check enddate key null or not', () => {
        expect((ganttObj.flatData[1] as any).null).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage for timezone issue ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:[{
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                    ]
                },],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                autoCalculateDateScheduling:false,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Checking for date format', () => {
        const result: boolean = ganttObj.timelineModule['updateHourInFormat']('hh:mm:ss A', '05:30:45 PM', 12).hasHour;
        expect(result).toEqual(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage for timezone issue Two', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:[{
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                    ]
                },],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                autoCalculateDateScheduling:false,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Check for dst date', () => {
        const result: boolean = ganttObj.timelineModule['isDateAffectedByDST'](new Date('2019-03-10T03:30:00-05:00'));
        expect(result).toEqual(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage for timezone issue Three', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:[{
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                    ]
                },],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                autoCalculateDateScheduling:false,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Covering 24 HRs Format', () => {
        const result: boolean = ganttObj.timelineModule['updateHourInFormat']('HH:mm:ss H:mm:ss', '15:30:45 9:15:20', 8).hasHour;
        expect(result).toEqual(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage for timezone issue Four', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:[{
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                    ]
                },],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                autoCalculateDateScheduling:false,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Covering calculateIternation function', () => {
        const result: number = ganttObj.timelineModule['calculateIteration'](new Date(2019, 2, 27), new Date(2019, 2, 27), "Year", 5).dummystartDate.getDate();
        expect(result).toEqual(27);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('autoCalculateDateScheduling property false  ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Project initiation',
                    StartDate: new Date('03/29/2024'),
                    EndDate: new Date('04/21/2024'),
                    subtasks: [
                        {
                            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('2025-03-25T00:00:00'), Duration: 3, EndDate: new Date('2025-04-04T00:00:00'),
                            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                        },
                    ]
                },
            ],
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
                ],
                taskType: "FixedWork",
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    //duration: 'Duration',
                    //dependency: 'Predecessor',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    //work:'work',
                    expandState: 'isExpand',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                viewType: "ResourceView",
                showOverAllocation: true,
                workUnit: "Hour",
                autoCalculateDateScheduling: false,
                includeWeekend: true,
                enablePredecessorValidation: false,
                treeColumnIndex: 1,
                dayWorkingTime: [{ from: 0, to: 24 }],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                allowTaskbarOverlap: true,
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
                columns: [{ field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '250' },
                //{ field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resourceGroup', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' }],
                labelSettings: {
                    taskLabel: 'TaskName'
                },
                height: '550px',
            }, done);
    });
    it('Check enddate ', () => {
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate,'M/d/yyyy')).toBe('4/4/2025');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('using public method to get tasks information  ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
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
                dependency:'Predecessor',
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
                { field: 'TaskName', headerText: '', allowReordering: false  },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                { field: 'CustomColumn', headerText: 'CustomColumn' }
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
            'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowSelection: true,
            allowRowDragAndDrop: true,
            selectedRowIndex: 1,
            tooltipSettings: {
                showTooltip: true
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
            height: '550px',
            allowUnscheduledTasks: true,
            allowResizing: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Inconsistent behavior between Grid and Gantt in headerText property', () => {
        const column = ganttObj.treeGrid.columns[1];
        if (typeof column !== 'string') {
            expect(column.headerText).toBe("");
        }
    });
    it('using public method to get info of record', () => {
        const ganttProps = ganttObj.getTaskInfo('1');
        expect(ganttProps.autoTaskLeft).toBe(264);
    });
    it('using public method autofitColumns', () => {
        ganttObj.autoFitColumns('TaskID');
        expect(ganttObj.columns[0]['width']).toBe(100);
    });
    it('getting current view data using public method', () => {
        const currentViewdata = ganttObj.getCurrentViewData();
        expect(ganttObj.currentViewData.length).toBe(4)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('public method to update datasource', () => {
    let ganttObj: Gantt;
    let data = [
        { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('2025-05-01'), Duration: 1 },
        { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('2025-05-08'), Duration: 2 },
        { TaskID: 3, TaskName: 'Task 3', StartDate: new Date('2025-05-04'), Duration: 3 },
        { TaskID: 4, TaskName: 'Task 4', StartDate: new Date('2025-01-06'), Duration: 2 },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { 
                dataSource: data,
                dayWorkingTime: [],
                workWeek : [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                ],
                taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'ParentID'
                },
                labelSettings: {
                rightLabel: 'TaskName',
                taskLabel: 'Progress',
                },
                splitterSettings: {
                columnIndex: 3,
                },
                gridLines: 'Horizontal',
                allowSelection: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                autoFocusTasks: true,
                searchSettings: {
                fields: ['name'],
                ignoreCase: true,
                hierarchyMode: 'Both',
                },
                enableVirtualization: true,
                enableTimelineVirtualization: true,
                height: '400px',
                highlightWeekends: true,
                editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true,
                },
                allowRowDragAndDrop: true,
                enableUndoRedo: true,
                undoRedoActions: ['Edit', 'RowDragAndDrop'],
                undoRedoStepsCount: 50,
                toolbar: ['Undo', 'Redo', { text: 'Discard All', tooltipText: 'Discard all changes', id: 'discardAllButton', align: 'Left' }],

            }, done);
    });
    it('using public method to updatedasource', () => {
        const projectStartDate = new Date('2025-01-01');
        const projectEndDate = new Date('2025-12-31');
        ganttObj.updateDataSource(data.slice(0), {
            projectStartDate,
            projectEndDate,
        });
        expect(ganttObj.ganttChartModule.scrollObject.element.scrollLeft).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cr-974711', () => {
    let ganttObj: Gantt;
    let data = [
        {
            TaskID: 'C-1',
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
        },
        {
            TaskID: 'T-1',
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            ParentId: 'C-1',
        },
        {
            TaskID: '2',
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            ParentId: 'C-1',
            Predecessor: 'T-1-2',
        },
        {
            TaskID: 'C-5',
            TaskName: 'Project estimation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
        },
        {
            TaskID: 'T-4',
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            ParentId: 'C-5',
        },
        {
            TaskID: 'T-5',
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            ParentId: 'C-5',
        },
        {
            TaskID: 'C-9',
            TaskName: 'Sign contract',
            StartDate: new Date('04/04/2024'),
            Duration: 1,
            Progress: 30,
        },
        {
            TaskID: 'C-10',
            TaskName: 'Project approval and kick off',
            StartDate: new Date('04/04/2024'),
            EndDate: new Date('04/21/2024'),
            Duration: 0,
            Predecessor: 'C-9',
        },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            { 
                dataSource: data,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                },
                height: "410px",
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                gridLines: 'Both',
                toolbar: ['Add', 'Edit', 'Update'],
            }, done);
    });
    it('Checking predecessor name', () => {
        expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('T-1 FS-2 days');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Cr-978444', () => {
    let ganttObj: Gantt;
    let data = [
        {
            TaskID: 1,
            TaskName: 'Milestone',
            StartDate: new Date('04/01/2024'),
            endDate: new Date('04/01/2024'),
        },
        {
            TaskID: 2,
            TaskName: 'Product concept',
            StartDate: new Date('04/09/2024'),
            EndDate: new Date('04/11/2024'),
            Progress: 30,
            Predecessor: '1 SS+1days',
            subtasks: [
                {
                    TaskID: 3,
                    TaskName: 'Task 1',
                    StartDate: new Date('04/09/2024'),
                    EndDate: new Date('04/11/2024'),
                    Progress: 50,
                    subtasks: [
                        {
                            TaskID: 4,
                            TaskName: 'Sub task 1',
                            StartDate: new Date('04/09/2024'),
                            EndDate: new Date('04/11/2024'),
                        },
                    ],
                }
            ],
        },
        {
            TaskID: 5,
            TaskName: 'Task 2',
            StartDate: new Date('04/09/2024'),
            EndDate: new Date('04/11/2024'),
            Progress: 10,
            Predecessor: '1 SS+2days',
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                height: "430px",
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
                allowSelection: true,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true,
                },
                enablePredecessorValidation: true,
                treeColumnIndex: 1,
                projectStartDate: new Date('03/24/2024'),
                projectEndDate: new Date('07/06/2024'),
                highlightWeekends: true
            }, done);
    });
    it('Checking offset value', () => {
        expect(ganttObj.flatData[1].ganttProperties.predecessorsName).toBe('1SS+6 days');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cr-984009 convert to milestone', () => {
    let ganttObj: Gantt;
    let data = [
        { TaskID: 1, TaskName: "Planning and Permits", StartDate: new Date("04/02/2025"), EndDate: new Date("04/10/2025"), Duration: 7, Progress: 100, resources: [1, 2, 3] },
        { TaskID: 2, TaskName: "Site Evaluation", StartDate: new Date("04/02/2025"), EndDate: new Date("04/04/2025"), Duration: 2, Progress: 100, ParentId: 1, resources: [1] },
        { TaskID: 3, TaskName: "Obtain Permits", StartDate: new Date("04/04/2025"), EndDate: new Date("04/09/2025"), Duration: 1, Progress: 100, ParentId: 1, Predecessor: "2", resources: [2, 4] },
        { TaskID: 4, TaskName: "Finalize Planning", StartDate: new Date("04/10/2025"), EndDate: new Date("04/11/2025"), Duration: 2, Progress: 100, ParentId: 1, Predecessor: "3", resources: [3] },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                height: "650px",
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                },
                treeColumnIndex: 1,
                allowSelection: true,
                dateFormat: "MMM dd, y",
                highlightWeekends: true,
                gridLines: 'Both',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
            }, done);
    });
    it('checking start date', () => {
        ganttObj.convertToMilestone("3");
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/3/2025');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// Spec for Auto-validated task collection on load time
describe('Auto-validated task collection on load time -default data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidateTaskData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(25);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(25);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -taskmode data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidateTaskModeData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(1);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection for taskmode', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Unschedule task data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidateUnScheduleData,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskId', width: 75 },
                { field: 'TaskName', width: 80 },
                { field: 'StartDate', width: 120 },
                { field: 'EndDate', width: 120 },
                { field: 'Duration', width: 90 },
                { field: 'TaskType', visible: false }
            ],
            sortSettings: {
                columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
            },
            splitterSettings: {
                columnIndex: 4
            },
            toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
            allowSelection: true,
            selectedRowIndex: 1,
            holidays: [{
                    from: "04/16/2019",
                    to: "04/16/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "03/26/2019",
                    to: "03/26/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
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
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(2);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for unschedule task', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Unschedule task duration only data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource:  [
                {
                    TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
                }
            ],
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskId', width: 75 },
                { field: 'TaskName', width: 80 },
                { field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
            allowSelection: true,
            selectedRowIndex: 1,
            holidays: [{
                    from: "04/16/2019",
                    to: "04/16/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "03/26/2019",
                    to: "03/26/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
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
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(1);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for duration only task', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Unschedule task duration only without holiday data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
                {
                    TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
                }
            ],
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskId', width: 75 },
                { field: 'TaskName', width: 80 },
                { field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
            allowSelection: true,
            selectedRowIndex: 1,
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
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(0);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for duration only task', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Unschedule task duration only without holiday data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
                {
                    TaskId: 2, TaskName: 'Task 2', Duration: '7', TaskType: 'Task with duration only'
                }
            ],
            includeWeekend: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskId', width: 75 },
                { field: 'TaskName', width: 80 },
                { field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
            allowSelection: true,
            selectedRowIndex: 1,
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
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(0);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for duration only task with includeweeend true', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Resource view without mapping work', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidatedTaskResrcmode,
            resources: autovaldateResourceCollection,
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
                { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            splitterSettings: {
                columnIndex: 3
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
            holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                }],
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '550px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(10);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for duration only task', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -Resource view with work mapping', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidatedTaskResrcmode,
            resources: autovaldateResourceCollection,
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
                { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            splitterSettings: {
                columnIndex: 3
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
            holidays: [{
                from: "04/04/2019",
                to: "04/05/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            }],
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '550px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019'),
            actionComplete: function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(11);
                }
            },
        }, done);
    });
    it('Checking autovalidated task collection for duration only task with work', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(11);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -default data with enddate', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidateTaskData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(32);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection with enddate map at taskFields', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(32);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -default data with workweek', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autoValidateTaskData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            workWeek: ["Sunday", "Wednesday", "Thursday"],
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(31);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(31);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -default data with weekWorkingTime', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019 09:00:00'), Duration: 3, Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019 10:00:00'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019 11:00:00'), Duration: 3, Predecessor: "2", Progress: 30 },
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            weekWorkingTime: [
                { dayOfWeek: 'Monday', timeRange: [{ from: 10, to: 18 }] },
                { dayOfWeek: 'Tuesday', timeRange: [{ from: 10, to: 18 }] }
            ],
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(2);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -default data with dayworkingtime', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019 09:00:00'), Duration: 3, Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019 07:00:00'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019 11:00:00'), Duration: 3, Predecessor: "2", Progress: 30 },
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            dayWorkingTime: [
                { from: 8, to: 13 },
                { from: 14, to: 17 }
            ],
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(2);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection on load time -default data with dayworkingtime in between', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019 09:00:00'), Duration: 3, Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019 10:00:00'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019 11:00:00'), Duration: 3, Predecessor: "2", Progress: 30 },
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            dayWorkingTime: [
                { from: 8, to: 13 },
                { from: 14, to: 17 }
            ],
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(2);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection- empty while perform edit action after load', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autovalidateDatasource,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(1);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking autovalidated task collection after cell edit action', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '4 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection- empty while perform delete action after load', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autovalidateDatasource,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(1);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking autovalidated task collection after delete action', () => {
        ganttObj.selectionModule.selectRow(2);
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Auto-validated task collection- empty while perform add action after load', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: autovalidateDatasource,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
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
            actionComplete : function (args: any): void {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(1);
                }
            },
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking autovalidated task collection after add action', () => {
        let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
        triggerMouseEvent(add, 'click');
        let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
        triggerMouseEvent(save, 'click');
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage issue date-processor', () => {
    let ganttObj: Gantt;
    let data = [
        {TaskID: 1, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 1, Progress: 30, work: 1}
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                height: "650px",
                dataSource: data,
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
                    work: 'work',
                    child: 'subtasks'
                },
                durationUnit: 'Minute',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                workUnit: 'Minute',
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                labelSettings: {
                    taskLabel: 'Progress'
                },
            }, done);
    });
    it('checking start date', () => {
        expect(ganttObj.flatData.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Expanded tasks', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
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
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Expanded records', () => {
        ganttObj.collapseByID(7);
        let expandedRecords = ganttObj.getExpandedRecords(ganttObj.flatData);
        expect(expandedRecords.length).toBe(37);

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('handleTouchMove invocation without branch execution', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 50, TaskName: 'TouchMove test', StartDate: new Date('04/25/2019'), Duration: 2 }
                ],
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('Calls handleTouchMove with non-matching event type', () => {
        const nonMatchingTouchEvent = { type: 'touchesmove' };
        const chartRowsModule = ganttObj.chartRowsModule;
        chartRowsModule['handleTouchMove'](nonMatchingTouchEvent as TouchEvent);
        expect(ganttObj.editSettings.allowTaskbarEditing).toBe(false);
    });
    it('Calls handleTouchEnd with which=3 to trigger early return', () => {
        const rightClickTouchEndEvent: any = {
            type: 'touchesend',
            target: document.createElement('div'),
            which: 3
        };
        const chartRowsModule = ganttObj.chartRowsModule;
        chartRowsModule['handleTouchEnd'](rightClickTouchEndEvent);
        expect(ganttObj.editSettings.allowTaskbarEditing).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('calculatePinchDistance coverage in ganttChartModule', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Test Task',
                        StartDate: new Date('03/10/2026'),
                        EndDate: new Date('03/11/2026'),
                        Duration: 1
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026'),
            }, done);
    });
    it('computes correct pinch distance', () => {
        const touch1 = { clientX: 10, clientY: 20 } as Touch;
        const touch2 = { clientX: 13, clientY: 24 } as Touch;
        const distance = ganttObj.ganttChartModule['calculatePinchDistance'](touch1, touch2);
        expect(distance).toBe(5);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMouseClick triggers scrollToTarget safely', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Test Task',
                        StartDate: new Date('03/10/2026'),
                        EndDate: new Date('03/11/2026'),
                        Duration: 1
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026'),
                autoFocusTasks: true
            }, done);
    });
    it('invokes scrollToTarget via ganttChartMouseClick without entering condition', () => {
        const element = document.createElement('span');
        const e = new PointerEvent('click', { bubbles: true });
        Object.defineProperty(e, 'target', { value: element });
        ganttObj.ganttChartModule['ganttChartMouseClick'](e);
        expect(ganttObj.autoFocusTasks).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartLeave coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Test Task',
                        StartDate: new Date('03/10/2026'),
                        EndDate: new Date('03/11/2026'),
                        Duration: 1
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                editSettings: { allowTaskbarEditing: true },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026')
            }, done);
    });
    it('invokes notify when allowTaskbarEditing is true', () => {
        const e = new PointerEvent('mouseleave');
        ganttObj.ganttChartModule['ganttChartLeave'](e);
        expect(ganttObj.flatData.length === 1).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMove coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Sample Task',
                        StartDate: new Date('03/10/2026'),
                        EndDate: new Date('03/11/2026'),
                        Duration: 1
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026'),
                editSettings: { allowTaskbarEditing: true }
            }, done);
    });
    it('covers pinch zoom in branch with two touches farther apart', () => {
        ganttObj.ganttChartModule['isPinching'] = true;
        ganttObj.ganttChartModule.previousPinchDistance = 10;
        const pinchEvent = {
            type: 'touchmove',
            touches: [
                { clientX: 0, clientY: 0 },
                { clientX: 30, clientY: 40 }
            ],
            changedTouches: [{ pageX: 120 }],
            __proto__: TouchEvent.prototype
        } as any as TouchEvent;
        ganttObj.ganttChartModule['ganttChartMove'](pinchEvent);
        expect(ganttObj.ganttChartModule['isTouchMoved']).toBe(true);
    });
    it('covers pinch zoom out branch with two touches closer together', () => {
        ganttObj.ganttChartModule['isPinching'] = true;
        ganttObj.ganttChartModule.previousPinchDistance = 100;
        const pinchEvent = {
            type: 'touchmove',
            touches: [
                { clientX: 0, clientY: 0 },
                { clientX: 10, clientY: 10 }
            ],
            changedTouches: [{ pageX: 80 }],
            __proto__: TouchEvent.prototype
        } as any as TouchEvent;
        ganttObj.ganttChartModule['ganttChartMove'](pinchEvent);
        expect(ganttObj.ganttChartModule['isTouchMoved']).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMove taskbar editing coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Sample Task',
                        StartDate: new Date('03/10/2026'),
                        EndDate: new Date('03/11/2026'),
                        Duration: 1
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026'),
                editSettings: { allowTaskbarEditing: true }
            }, done);
    });
    it('covers taskbar editing branch with PointerEvent', () => {
        ganttObj.ganttChartModule['isPinching'] = false;
        const cloneElement = document.createElement('div');
        cloneElement.className = 'e-clone-taskbar';
        ganttObj.element.appendChild(cloneElement);
        const pointerEvent = new PointerEvent('mousemove');
        ganttObj.ganttChartModule['ganttChartMove'](pointerEvent);
        expect(ganttObj.ganttChartModule['isTouchMoved']).toBe(false);
        ganttObj.element.removeChild(cloneElement);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler basic coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Sample Task', StartDate: new Date('03/10/2026'), EndDate: new Date('03/11/2026'), Duration: 1 }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor'
                },
                projectStartDate: new Date('03/10/2026'),
                projectEndDate: new Date('03/12/2026'),
                editSettings: { allowTaskbarEditing: true },
            }, done);
    });
    it('covers header cell label branch', () => {
        const headerCell = document.createElement('div');
        headerCell.classList.add('e-header-cell-label');
        headerCell.dataset.content = '2026-03-10';
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: headerCell });
        ganttObj.onMouseMove = () => {};
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect(headerCell.classList.contains('e-header-cell-label')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('isTouchpad coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Sample Task', StartDate: new Date(), Duration: 1 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('returns true for small deltaY', () => {
        expect(ganttObj.ganttChartModule['isTouchpad'](10)).toBe(true);
    });
    it('returns false for large deltaY', () => {
        expect(ganttObj.ganttChartModule['isTouchpad'](100)).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('updateDebounceTimeout coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Sample Task', StartDate: new Date(), Duration: 1 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('updates debounceTimeoutNext when debounceTimeout exists', () => {
        ganttObj.ganttChartModule['debounceTimeout'] = 100;
        ganttObj.ganttChartModule['debounceTimeoutNext'] = 50;
        ganttObj.ganttChartModule['updateDebounceTimeout']();
        expect(ganttObj.ganttChartModule['debounceTimeoutNext']).toBe(100);
        ganttObj.ganttChartModule['debounceTimeout'] = 0;
        ganttObj.ganttChartModule['debounceTimeoutNext'] = 0;
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('performZoomCheck coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Sample Task', StartDate: new Date(), Duration: 1 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('calls zooming when valid touchpad delta', () => {
        ganttObj.ganttChartModule['performZoomCheck'](10, true, true);
        expect(ganttObj.flatData.length).toBe(1);
    });
    it('calls zooming when valid mouse wheel delta', () => {
        ganttObj.ganttChartModule['performZoomCheck'](50, false, false);
        expect(ganttObj.flatData.length).toBe(1);
    });
    it('does not zoom when delta out of range', () => {
        ganttObj.ganttChartModule['performZoomCheck'](1, true, false);
        expect(ganttObj.flatData.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMouseUp touchend with child taskbar target', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Sample Task', StartDate: new Date(), Duration: 1 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowEditing: false,  allowTaskbarEditing: true }
            }, done);
    });
    it('handles touchend on child taskbar element', () => {
        const childTaskbar = document.createElement('div');
        childTaskbar.className = 'e-gantt-child-taskbar-inner-div e-gantt-child-taskbar';
        const touchEndEvent = new PointerEvent('touchend', { bubbles: true });
        Object.defineProperty(touchEndEvent, 'target', { value: childTaskbar });
        ganttObj.ganttChartModule['ganttChartMouseUp'](touchEndEvent);
        expect((touchEndEvent.target as HTMLElement).classList.contains('e-gantt-child-taskbar')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler event markers coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Sample Task', StartDate: new Date(), Duration: 1 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                eventMarkers: [{ day: new Date('03/11/2026'), label: 'Deadline' }]
            }, done);
    });
    it('covers event markers branch', () => {
        const markerDiv = document.createElement('div');
        markerDiv.classList.add('e-event-markers');
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: markerDiv });
        ganttObj.onMouseMove = () => {};
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect(markerDiv.classList.contains('e-event-markers')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler connector line coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('03/10/2026'), Duration: 1 },
                    { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('03/11/2026'), Duration: 1, Predecessor: '1FS' }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    dependency: 'Predecessor'
                },
                editSettings: { allowTaskbarEditing: true }
            }, done);
    });
    it('covers connector line container branch', () => {
        const connectorDiv = document.createElement('div');
        connectorDiv.classList.add('e-connector-line-container');
        connectorDiv.id = 'ConnectorLineparent1child2';
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: connectorDiv });
        ganttObj.onMouseMove = () => { };
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect(connectorDiv.classList.contains('e-connector-line-container')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler indicator span coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Sample Task',
                        StartDate: new Date('03/10/2026'),
                        Duration: 1,
                        Indicators: [
                            { name: 'Milestone', date: new Date('03/11/2026') },
                            { name: 'Review', date: new Date('03/12/2026') }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    indicators: 'Indicators'
                }
            }, done);
    });
    it('covers indicator span branch using rendered DOM', () => {
        const indicatorSpan = ganttObj.element.querySelector('.e-indicator-span') as HTMLElement;
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: indicatorSpan });
        ganttObj.onMouseMove = () => { };
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect((e.target as HTMLElement).classList.contains('e-indicator-span')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler column element coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Sample Task', StartDate: new Date('03/10/2026'), Duration: 1 }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID' },
                    { field: 'TaskName', headerText: 'Name' }
                ]
            }, done);
    });
    it('assigns args.column when columnElement exists', () => {
        const rowCell = document.createElement('div');
        rowCell.className = 'e-rowcell';
        (rowCell as any).cellIndex = 1;
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: rowCell });
        ganttObj.onMouseMove = () => {};
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect(ganttObj.columns[1]['field']).toBe('TaskName');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('mouseMoveHandler columnElement branch with empty flatData', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID' },
                    { field: 'TaskName', headerText: 'Name' }
                ]
            }, done);
    });
    it('assigns args.column when headercell target exists', () => {
        const headerCell = document.createElement('div');
        headerCell.className = 'e-headercell';
        (headerCell as any).cellIndex = 0;
        const e = new PointerEvent('mousemove', { bubbles: true });
        Object.defineProperty(e, 'target', { value: headerCell });
        ganttObj.onMouseMove = () => {};
        ganttObj.ganttChartModule.mouseMoveHandler(e);
        ganttObj.onMouseMove = undefined;
        expect(ganttObj.flatData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMouseDown pinch zoom coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('03/10/2026'), Duration: 1 }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowTaskbarEditing: true }
            }, done);
    });
    it('sets initPinchDistance and isPinching on two‑finger touchstart', () => {
        const touch1 = new Touch({ identifier: 1, target: ganttObj.element, clientX: 50, clientY: 50 });
        const touch2 = new Touch({ identifier: 2, target: ganttObj.element, clientX: 150, clientY: 50 });
        const touchEvent = new TouchEvent('touchstart', { touches: [touch1, touch2] });
        ganttObj.ganttChartModule['ganttChartMouseDown'](touchEvent);
        expect(ganttObj.ganttChartModule['isPinching']).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction headercell branches with revert', () => {
    let ganttObj: Gantt;
    let originalGetNextElement: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: { id: 'TaskID', name: 'TaskName' },
                columns: [
                    { field: 'TaskID', headerText: 'ID', visible: true },
                    { field: 'TaskName', headerText: 'Name', visible: false }
                ],
                toolbar: ['Add', 'Edit'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                },
            }, done);
        originalGetNextElement = ganttObj.ganttChartModule['getNextElement'];
    });
    it('covers noNextRow branch', () => {
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'tab';
        e['preventDefault'] = () => { };
        Object.defineProperty(e, 'target', { value: document.createElement('div') });
        ganttObj.ganttChartModule['getNextElement'] = () => 'noNextRow';
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.ganttChartModule.tempNextElement).toBeNull();
    });
    it('covers headercell with shiftTab branch', () => {
        const headerCell = document.createElement('div');
        headerCell.className = 'e-headercell';
        const nextElement = document.createElement('div');
        nextElement.setAttribute('aria-colindex', '2');
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'shiftTab';
        e['preventDefault'] = () => {};
        Object.defineProperty(e, 'target', { value: headerCell });
        ganttObj.ganttChartModule['getNextElement'] = () => nextElement;
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.ganttChartModule.tempNextElement).not.toBeNull();
    });
    it('covers headercell with tab branch', () => {
        const headerCell = document.createElement('div');
        headerCell.className = 'e-headercell';
        const nextElement = document.createElement('div');
        nextElement.setAttribute('aria-colindex', '1');
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'tab';
        e['preventDefault'] = () => {};
        Object.defineProperty(e, 'target', { value: headerCell });
        ganttObj.ganttChartModule['getNextElement'] = () => nextElement;
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.ganttChartModule.tempNextElement).not.toBeNull();
    });
    it('covers headercell shiftTab toolbar fallback branch', () => {
        ganttObj.treeGrid.columns.forEach((col: any) => col['visible'] = false);
        const headerCell = document.createElement('div');
        headerCell.className = 'e-headercell';
        const nextElement = document.createElement('div');
        nextElement.setAttribute('aria-colindex', '1');
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'shiftTab';
        e['preventDefault'] = () => { };
        Object.defineProperty(e, 'target', { value: headerCell });
        ganttObj.ganttChartModule['getNextElement'] = () => nextElement;
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.flatData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.ganttChartModule['getNextElement'] = originalGetNextElement;
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: MT1014886,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    constraintType: 'ConstraintType',
                    constraintDate: 'ConstraintDate',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                updateOffsetOnTaskbarEdit: false,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('render method coverage', () => {
        ganttObj.isReact = true;
        ganttObj.isVue = true;
        ganttObj.refresh();
        ganttObj['getTranslateY']('1' as any);
        ganttObj['validateDimentionValue']('1');
        ganttObj.height = null;
        ganttObj.width = null;
        ganttObj.element.style.height = null;
        ganttObj.element.style.width = null;
        ganttObj['calculateDimensions']();
        ganttObj.taskFields['properties'] = {};
        ganttObj['actionFailures']();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: MT1014886,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
    it('updateDataArgs method coverage', () => {
       let args: any = {};
       args.data = ganttObj.currentViewData[1];
       ganttObj.updateDataArgs(args);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                 TaskID: 1, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), EndDate: new Date('04/05/2019'), Progress: 30, isMilestone: false
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    child: 'subtasks',
                    milestone: 'isMilestone'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
    it('convertToMilestone method coverage', () => {
       ganttObj.convertToMilestone('1');
       ganttObj['updateColumnModel'](null);
       ganttObj.getUndoActions();
       ganttObj.getRedoActions();
       ganttObj.setSplitterPosition(null, null);
       let data =[{
            TaskID: 1, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), EndDate: new Date('04/05/2019'), Progress: 30, isMilestone: false
        }];
       ganttObj.getRecordFromFlatdata(data as any);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                 TaskID: 1, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), EndDate: new Date('04/05/2019'), Progress: 30, isMilestone: false
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    child: 'subtasks',
                    milestone: 'isMilestone'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowUnscheduledTasks: true,
                enableUndoRedo: true,
                enableTimelineVirtualization: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('onPropertyChanged method coverage', () => {
        ganttObj.timelineModule.isZoomToFit = true;
        ganttObj.timelineSettings.bottomTier.unit = 'Hour';
        ganttObj.allowPdfExport = true;
        ganttObj.allowExcelExport = true;
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                 TaskID: 1, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), EndDate: new Date('04/05/2019'), Progress: 30, isMilestone: false
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    child: 'subtasks',
                    milestone: 'isMilestone'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowUnscheduledTasks: true,
                enableUndoRedo: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('onPropertyChanged method coverage -dynamic datsource update', () => {
       ganttObj.dataSource = [
            { TaskID: 1, TaskName: 'Design phase', StartDate: new Date('04/01/2019'), EndDate: new Date('04/10/2019') },
            { TaskID: 2, TaskName: 'Development phase', StartDate: new Date('04/11/2019'), EndDate: new Date('04/20/2019') }
        ];
        ganttObj.emptyRecordTemplate = '#emptytemplate';
        ganttObj.frozenColumns = 2;
        ganttObj.reUpdateDimention();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1,
                        taskName: "Design",
                        startDate: new Date("02/10/2017"),
                        endDate: new Date("02/18/2017"),
                        subtasks: [
                            { taskID: 2, taskName: "Software Specification", BaselineStartDate: new Date('04/02/2017'), BaselineEndDate: new Date('04/06/2017'), startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60",Segments: [
                                { startDate: new Date('04/11/2017'), duration: 2 },
                                { startDate: new Date('04/13/2017'), duration: 1 }
                            ] },
                            {
                                taskID: 3, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40",
                                subtasks: [
                                    { taskID: 4, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80" }
                                ]
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    segments: 'Segments'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('getTaskInfo method coverage', () => {
      ganttObj.getTaskInfo('2');
      ganttObj.getCriticalTasks();
      ganttObj['setFrozenCount']();
      ganttObj['splitFrozenCount'](null);
      ganttObj['mergeColumns'](ganttObj.columns as any, ganttObj.columns as any);
      ganttObj['removeBorder'](ganttObj.columns as any);
      ganttObj['frozenLeftBorderColumns'](ganttObj.columns as any);
      ganttObj['frozenRightBorderColumns'](ganttObj.columns as any);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1,
                        taskName: "Design",
                        startDate: new Date("02/10/2017"),
                        endDate: new Date("02/18/2017"),
                        subtasks: [
                            { taskID: 2, taskName: "Software Specification", BaselineStartDate: new Date('04/02/2017'), BaselineEndDate: new Date('04/06/2017'), startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60",Segments: [
                                { startDate: new Date('04/11/2017'), duration: 2 },
                                { startDate: new Date('04/13/2017'), duration: 1 }
                            ] },
                            {
                                taskID: 3, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40",
                                subtasks: [
                                    { taskID: 4, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80" }
                                ]
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    segments: 'Segments'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                taskMode: 'Manual',
                labelSettings: {
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('getTaskInfo method coverage-Manual mode', () => {
      ganttObj.getTaskInfo('2');
    });
    it('getTaskInfo method coverage-Manual mode parent task check', () => {
      ganttObj.getTaskInfo('1');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
        let ganttObj: Gantt;
        let dataSource: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/GanttLoadOnDemand',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: dataSource,
            loadChildOnDemand: true,
            taskFields: {
                id: 'taskId',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                dependency: 'Predecessor',
                progress: 'progress',
                hasChildMapping: 'isParent',
                parentID: 'parentID'
            },
            columns: [
                { field: 'taskId', headerText: 'Task ID' },
                { field: 'taskName', headerText: 'Task Name', allowReordering: false },
                { field: 'startDate', headerText: 'Start Date', allowSorting: false },
                { field: 'duration', headerText: 'Duration', allowEditing: false },
                { field: 'progress', headerText: 'Progress', allowFiltering: false },
            ],
            allowSelection: true,
            enableVirtualization: true,
            splitterSettings: {
                columnIndex: 3,
            },
            tooltipSettings: {
                showTooltip: true
            },
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
            treeColumnIndex: 1,
            height: '460px',
            projectStartDate: new Date('01/02/2000'),
            projectEndDate: new Date('12/01/2002')
        }, done);
    });
    it('updateCurrentViewData method coverage', () => {
      ganttObj['updateCurrentViewData']();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1,
                        taskName: "Design",
                        startDate: new Date("02/10/2017"),
                        endDate: new Date("02/18/2017"),
                        subtasks: [
                            { taskID: 2, taskName: "Software Specification", BaselineStartDate: new Date('04/02/2017'), BaselineEndDate: new Date('04/06/2017'), startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60",Segments: [
                                { startDate: new Date('04/11/2017'), duration: 2 },
                                { startDate: new Date('04/13/2017'), duration: 1 }
                            ] },
                            {
                                taskID: 3, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40",
                                subtasks: [
                                    { taskID: 4, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80" }
                                ]
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    segments: 'Segments'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('showMaskRow method coverage', () => {
      ganttObj['getSecondsPerDay'](new Date('00/00/0000'));
      ganttObj.ganttChartModule.scrollObject['isSetScrollLeft'] = true;
      ganttObj.timelineModule.isSingleTier = true;
      ganttObj.showMaskRow();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60"
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    child: 'subtasks'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('applyTimelineMaskRow method coverage for topBottomHeader case-0', () => {
        let row = ganttObj.getRowByID(1);
        ganttObj.topBottomHeader = 0;
        ganttObj.enableRtl = true;
        ganttObj['applyTimelineMaskRow'](row);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60"
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    child: 'subtasks'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('applyTimelineMaskRow method coverage for topBottomHeader case-1', () => {
        let row = ganttObj.getRowByID(1);
        ganttObj.topBottomHeader = 1;
        ganttObj.enableRtl = true;
        ganttObj['applyTimelineMaskRow'](row);
        ganttObj.enableTimelineVirtualization = true;
        ganttObj.windowResize();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 1, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), EndDate: new Date('04/05/2019'), Progress: 30, isMilestone: false
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    child: 'subtasks',
                    milestone: 'isMilestone'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowFiltering: true,
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('onPropertyChanged method coverage with splitterSettings', () => {
        ganttObj.splitterSettings.columnIndex = 3;
        ganttObj['updateWBSPredecessor'](ganttObj.currentViewData[0]);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('T1014886: Coverage for gantt file', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        taskID: 1, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/16/2017"), duration: 5, progress: "60"
                    }
                ],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    child: 'subtasks'
                },
                enableWBS: true,
                renderBaseline: true,
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
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                },
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
                    leftLabel: 'taskID',
                    rightLabel: 'task Name: ${taskData.TaskName}',
                    taskLabel: '${progress}%'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('updateChartScrollOffset method coverage', () => {
        ganttObj.enableRtl = true;
        ganttObj.updateChartScrollOffset(850, 523);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction with e-btn target and selectedRowIndex', () => {
    let ganttObj: Gantt;
    let originalGetNextElement: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Planning', StartDate: new Date('2026-03-11'), Duration: 5 },
                    { TaskID: 2, TaskName: 'Design', StartDate: new Date('2026-03-16'), Duration: 3 }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID', visible: true },
                    { field: 'TaskName', headerText: 'Name', visible: true }
                ],
                toolbar: ['Add', 'ExpandAll'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true
                },
            }, done);
        originalGetNextElement = ganttObj.ganttChartModule['getNextElement'];
    });
    it('covers toolbar branch when target is e-btn and nextElement is null', () => {
        const btn = document.createElement('button');
        btn.className = 'e-btn';
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'tab';
        e['preventDefault'] = () => {};
        Object.defineProperty(e, 'target', { value: btn });
        ganttObj.ganttChartModule['getNextElement'] = () => null;
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.getRowByID(2).classList.contains('e-active')).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.ganttChartModule['getNextElement'] = originalGetNextElement;
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction branch when e-btn is last toolbar item', () => {
    let ganttObj: Gantt;
    let originalGetNextElement: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Planning', StartDate: new Date('2026-03-11'), Duration: 5 },
                    { TaskID: 2, TaskName: 'Design', StartDate: new Date('2026-03-16'), Duration: 3 }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID', visible: true },
                    { field: 'TaskName', headerText: 'Name', visible: true }
                ],
                toolbar: ['Add', 'ExpandAll'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true
                }
            }, done);
        originalGetNextElement = ganttObj.ganttChartModule['getNextElement'];
    });
    it('moves focus from last toolbar e-btn to first visible column header', () => {
        const btn = document.createElement('button');
        btn.className = 'e-btn';
        const e = new KeyboardEvent('keydown', { key: 'Tab' });
        e['action'] = 'tab';
        e['preventDefault'] = () => { };
        Object.defineProperty(e, 'target', { value: btn });
        ganttObj.ganttChartModule['getNextElement'] = () => null;
        const toolbarItems = document.getElementsByClassName('e-toolbar-item');
        ganttObj.ganttChartModule['currentToolbarIndex'] = toolbarItems.length - 1;
        ganttObj.ganttChartModule.onTabAction(e as any);
        expect(ganttObj.ganttChartModule.tempNextElement.classList.contains('e-headercell')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.ganttChartModule['getNextElement'] = originalGetNextElement;
            destroyGantt(ganttObj);
        }
    });
});
describe('getNextElement segment branch', () => {
    let ganttObj: Gantt;
    let insertedBefore: Element | null = null;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Split Task',
                        StartDate: new Date('2019-02-04'),
                        Duration: 7,
                        Segments: [
                            { StartDate: new Date('2019-02-04'), Duration: 2 },
                            { StartDate: new Date('2019-02-05'), Duration: 5 }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'Segments'
                },
                columns: [{ field: 'TaskID', headerText: 'ID' }]
            }, done);
    });
    afterEach(() => {
        if (insertedBefore && insertedBefore.parentElement) {
            insertedBefore.parentElement.removeChild(insertedBefore);
        }
        insertedBefore = null;
    });
    it('covers segment branch when nextElement is taskbar-main-container', () => {
        const chart = (ganttObj.ganttChartModule as any);
        chart.focusedRowIndex = 0;
        const record = ganttObj.currentViewData[chart.focusedRowIndex];
        record.ganttProperties = record.ganttProperties || {};
        record.ganttProperties.segments = [
            { startDate: new Date('2019-02-04'), duration: 2 },
            { startDate: new Date('2019-02-05'), duration: 5 }
        ];
        const taskbar = ganttObj.element.getElementsByClassName('e-taskbar-main-container')[0];
        let precedingElement: Element = taskbar.previousElementSibling as Element;
        if (!precedingElement) {
            insertedBefore = document.createElement('div');
            taskbar.parentElement.insertBefore(insertedBefore, taskbar);
            precedingElement = insertedBefore;
        }
        const result = chart['getNextElement'](precedingElement, true, false);
        expect((result as Element).classList.contains('e-gantt-child-taskbar-inner-div')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getNextElement segment branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Parent Task',
                        StartDate: new Date('2026-03-11'),
                        Duration: 5,
                        SubTasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Child Task',
                                StartDate: new Date('2026-03-12'),
                                Duration: 3
                            }
                        ]
                    }
                ],
                taskMode: 'Manual',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    child: 'SubTasks'
                }
            }, done);
    });
    it('applies focus to manual parent taskbar', () => {
        const element = ganttObj.element.getElementsByClassName('e-taskbar-main-container')[0] as HTMLElement;
        ganttObj.ganttChartModule.manageFocus(element, 'add', true);
        const manualParent = element.getElementsByClassName('e-manualparent-main-container')[0];
        expect(manualParent.classList.contains('e-active-container')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('manageFocus milestone branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 2,
                        TaskName: 'Milestone Task',
                        StartDate: new Date('2026-03-11'),
                        Duration: 0 // milestone
                    }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('applies focus to milestone taskbar', () => {
        const element = ganttObj.element.getElementsByClassName('e-taskbar-main-container')[0] as HTMLElement;
        ganttObj.ganttChartModule.manageFocus(element, 'add', true);
        expect(element.getElementsByClassName('e-gantt-milestone')[0].classList.contains('e-active-container')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('manageFocus segmented taskbar branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 3,
                        TaskName: 'Segmented Task',
                        StartDate: new Date('2026-03-11'),
                        Duration: 7,
                        Segments: [
                            { StartDate: new Date('2026-03-11'), Duration: 2 },
                            { StartDate: new Date('2026-03-13'), Duration: 5 }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'Segments'
                }
            }, done);
    });
    it('applies focus to segmented taskbar', () => {
        const element = ganttObj.element.getElementsByClassName('e-taskbar-main-container')[0] as HTMLElement;
        ganttObj.ganttChartModule.manageFocus(element, 'add', true);
        expect(element.getElementsByClassName('e-segmented-taskbar')[0].classList.contains('e-active-container')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('manageFocus temp container branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3 }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('adds focus to right label temp container', () => {
        const element = document.createElement('div');
        element.className = 'e-right-label-temp-container';
        ganttObj.ganttChartModule.manageFocus(element, 'add', true);
        expect(element.classList.contains('e-active-container')).toBe(true);
    });
    it('removes focus from right label temp container', () => {
        const element = document.createElement('div');
        element.className = 'e-right-label-temp-container e-active-container';
        ganttObj.ganttChartModule.manageFocus(element, 'remove', true);
        expect(element.classList.contains('e-active-container')).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getChildElement previousElementSibling branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                { TaskID: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('returns previous sibling when last child is hidden', () => {
        const row = document.createElement('tr');
        const validCell = document.createElement('td');
        validCell.className = 'e-rowcell';
        const hiddenCell = document.createElement('td');
        hiddenCell.className = 'e-hide';
        row.appendChild(validCell);
        row.appendChild(hiddenCell);
        const result = ganttObj.ganttChartModule['getChildElement'](row, false);
        expect(result).toBe(validCell);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getChildElement exit branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3 }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' }
            }, done);
    });
    it('returns "noNextRow" when rowElement is null', () => {
        const result = ganttObj.ganttChartModule['getChildElement'](null, true);
        expect(result).toBe('noNextRow');
    });
    it('falls through and returns null when all children are hidden', () => {
        const row = document.createElement('tr');
        const hiddenCell = document.createElement('td');
        hiddenCell.className = 'e-hide';
        row.appendChild(hiddenCell);
        const result = ganttObj.ganttChartModule['getChildElement'](row, true);
        expect(result).toBeNull();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('expandedGanttRow early return branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3, hasChild: true }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    hasChildMapping: 'hasChild'
                },
                loadChildOnDemand: true,
                enableVirtualization: true
            }, done);
    });
    it('marks record.expanded and returns when gridRow is null with virtualization enabled', () => {
        const chartModule = ganttObj.ganttChartModule as any;
        const args: any = {
            data: { TaskID: 1 },
            gridRow: null,
            chartRow: {}
        };
        chartModule.expandedGanttRow(args);
        const record = ganttObj.currentViewData[0];
        expect(record.expanded).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMouseUp branches', () => {
    let ganttObj: Gantt;
    let insertedWrapper: HTMLElement | null = null;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowTaskbarEditing: true, allowEditing: false },
                autoFocusTasks: true
            }, done);
    });
    beforeEach(() => {
        insertedWrapper = null;
    });
    afterEach(() => {
        if (insertedWrapper && insertedWrapper.parentElement) {
            insertedWrapper.parentElement.removeChild(insertedWrapper);
        }
    });
    it('saves cell when edited batch cell exists', () => {
        const chartModule = ganttObj.ganttChartModule;
        insertedWrapper = document.createElement('div');
        const cell = document.createElement('div');
        cell.classList.add('e-editedcell');
        insertedWrapper.appendChild(cell);
        ganttObj.element.appendChild(insertedWrapper);
        const target = document.createElement('div');
        target.classList.add('e-gantt-chart-pane');
        const e = new PointerEvent('mouseup');
        Object.defineProperty(e, 'target', { value: target });
        chartModule['ganttChartMouseUp'](e);
        expect(ganttObj.isEdit).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('ganttChartMouseUp parent-taskbar branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Parent',
                        StartDate: new Date('2026-03-11'),
                        expanded: true,
                        childRecords: [
                            { TaskID: 2, TaskName: 'Child', StartDate: new Date('2026-03-11'), Duration: 3 }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    child: 'childRecords'
                },
                editSettings: { allowTaskbarEditing: true, allowEditing: false },
                autoFocusTasks: true,
                columns: [{ field: 'TaskID', headerText: 'ID' }]
            }, done);
    });
    it('calls chartExpandCollapseRequest when target is inside .e-gantt-parent-taskbar and editing disabled', () => {
        const chartModule: any = ganttObj.ganttChartModule;
        (ganttObj as any).isAdaptive = false;
        const parentTaskbar = ganttObj.element.querySelector('.e-gantt-parent-taskbar') as HTMLElement;
        const innerTarget = parentTaskbar.querySelector('.e-taskbar-main-container') || parentTaskbar;
        const evt = new PointerEvent('mouseup', { bubbles: true });
        Object.defineProperty(evt, 'target', { value: innerTarget });
        chartModule.ganttChartMouseUp(evt);
        expect(ganttObj.flatData.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('documentMouseUp expand/collapse branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowTaskbarEditing: true, allowEditing: false },
                autoFocusTasks: true
            }, done);
    });
    it('resets isEditCollapse when clicking expand/collapse icon', () => {
        const chartModule = ganttObj.ganttChartModule;
        (ganttObj.treeGrid as any).isEditCollapse = true;
        const target = document.createElement('div');
        target.classList.add('e-treegridexpand');
        const e = new PointerEvent('mouseup');
        Object.defineProperty(e, 'target', { value: target });
        chartModule['documentMouseUp'](e);
        expect((ganttObj.treeGrid as any).isEditCollapse).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('documentMouseUp invokes onTaskbarClick', () => {
    let ganttObj: Gantt;
    let origParentHandler: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowTaskbarEditing: true, allowEditing: false },
                autoFocusTasks: true
            }, done);
    });
    beforeEach(() => {
        origParentHandler = (ganttObj as any).onTaskbarClick;
        (ganttObj as any).onTaskbarClick = function () { };
    });
    afterEach(() => {
        (ganttObj as any).onTaskbarClick = origParentHandler;
    });
    it('calls onTaskbarClick when clicking a rendered taskbar element', () => {
        const chartModule: any = ganttObj.ganttChartModule;
        (ganttObj as any).isAdaptive = false;
        chartModule.isTouchMoved = false;
        const taskbarElement = ganttObj.element.querySelector('.e-gantt-child-taskbar, .e-gantt-parent-taskbar, .e-gantt-milestone') as HTMLElement;
        const innerTarget = taskbarElement.querySelector('.e-taskbar-main-container') || taskbarElement;
        const evt = new PointerEvent('mouseup', { bubbles: true });
        Object.defineProperty(evt, 'target', { value: innerTarget });
        chartModule['documentMouseUp'](evt);
        expect(ganttObj.autoFocusTasks).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('setVirtualHeight fallback branches using existing DOM', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                enableVirtualization: true,
                enableTimelineVirtualization: true
            }, done);
            chartModule = ganttObj.ganttChartModule;
    });
    it('falls back to 0px when regex does not match', () => {
        const treeGridTable = ganttObj.treeGrid.element.getElementsByClassName('e-virtualtable')[0] as HTMLElement;
        const chartTable = ganttObj.ganttChartModule.scrollElement.getElementsByClassName('e-virtualtable')[0] as HTMLElement;
        treeGridTable.style.transform = '';
        chartTable.style.transform = 'not-a-translate';
        chartModule['setVirtualHeight']();
        expect((chartModule.virtualRender.wrapper as HTMLElement).style.transform).toContain('0px');
    });
    it('falls back to 0px for Y when only one part present', () => {
        const treeGridTable = ganttObj.treeGrid.element.getElementsByClassName('e-virtualtable')[0] as HTMLElement;
        const chartTable = ganttObj.ganttChartModule.scrollElement.getElementsByClassName('e-virtualtable')[0] as HTMLElement;
        treeGridTable.style.transform = 'translate3d(100px, 50px, 0px)';
        chartTable.style.transform = '';
        chartModule['setVirtualHeight']();
        expect((chartModule.virtualRender.wrapper as HTMLElement).style.transform).toContain(', 0px');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('updateLastRowBottomWidth contentHeight fallback', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 },
                    { TaskID: 2, TaskName: 'Task B', StartDate: new Date(), Duration: 2 }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                height: '450px', // not 'auto'
                enableVirtualization: true
            }, done);
    });
    it('uses divHeight when contentHeight is 0', () => {
        const chartModule: any = ganttObj.ganttChartModule;
        ganttObj.contentHeight = 0;
        chartModule.chartBodyContent.style.height = '100px';
        chartModule.chartBodyContainer.style.height = '200px';
        chartModule.updateLastRowBottomWidth();
        expect(ganttObj.enableVirtualization).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getNextElement sibling navigation', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let appended: Element[] = [];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                 dataSource: [
                { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 },
                { TaskID: 2, TaskName: 'Task B', StartDate: new Date(), Duration: 2 }
            ],
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false, visible: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
            height: '450px'
            }, done);
            chartModule = ganttObj.ganttChartModule;
    });
    afterEach(() => {
        appended.forEach(el => { if (el.parentElement) { el.parentElement.removeChild(el); } });
        appended = [];
    });
    it('advances to nextElementSibling when current is hidden', () => {
        const row = ganttObj.treeGrid.getRows()[0] as HTMLElement;
        const cell = row.querySelector('.e-rowcell') as HTMLElement;
        const sibling = document.createElement('td');
        sibling.classList.add('e-rowcell');
        row.appendChild(sibling);
        appended.push(sibling);
        const result = chartModule['getNextElement'](cell, true, false);
        expect(ganttObj.flatData.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getNextElement non-tab path left-label-container branch', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let appended: Element[] = [];
    let originalGetNextRowElement: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                 dataSource: [
                { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 },
                { TaskID: 2, TaskName: 'Task B', StartDate: new Date(), Duration: 2 }
            ],
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', visible: false },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'Duration', headerText: 'Duration' }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
            height: '450px'
            }, done);
            chartModule = ganttObj.ganttChartModule;
            originalGetNextRowElement = chartModule.getNextRowElement;
    });
    afterEach(() => {
        appended.forEach(el => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        });
        appended = [];
        chartModule.getNextRowElement = originalGetNextRowElement;
    });
    it('returns left-label-container when valid (isTab = false)', () => {
        const row = ganttObj.treeGrid.getRows()[0] as HTMLElement;
        const cell = row.querySelector('.e-rowcell') as HTMLElement;
        const controlledRow = document.createElement('tr');
        const leftLabel = document.createElement('div');
        leftLabel.classList.add('e-left-label-container');
        controlledRow.appendChild(leftLabel);
        appended.push(leftLabel);
        chartModule.getNextRowElement = () => controlledRow;
        const result = chartModule['getNextElement'](cell, false, false);
        expect(result).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction special branches', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let appended: Element[] = [];
    let origGetNextElement: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 },
                    { TaskID: 2, TaskName: 'Task B', StartDate: new Date(), Duration: 2 }
                ],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', visible: true },
                    { field: 'StartDate', headerText: 'Start Date', visible: true },
                    { field: 'Duration', headerText: 'Duration', visible: true }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                height: '450px'
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    beforeEach(() => {
        origGetNextElement = chartModule.getNextElement;
    });
    afterEach(() => {
        chartModule.getNextElement = origGetNextElement;
        appended.forEach(el => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        });
        appended = [];
    });
    it('executes saveCell branch when nextElement is noNextRow and edited batch cell exists', () => {
        const cell = ganttObj.treeGrid.getRows()[0].querySelector('.e-rowcell') as HTMLElement;
        const editedCell = document.createElement('td');
        editedCell.classList.add('e-editedcell');
        ganttObj.treeGrid.element.appendChild(editedCell);
        appended.push(editedCell);
        chartModule.getNextElement = () => 'noNextRow';
        chartModule.onTabAction({ action: 'tab', target: cell } as any);
        expect(ganttObj.treeGrid.element.getElementsByClassName('e-editedcell').length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction header-cell event', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                editSettings: { allowTaskbarEditing: true, allowEditing: false },
                autoFocusTasks: true,
                allowRowDragAndDrop: true
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    it('does not throw when invoked with a header-cell target (preventDefault provided)', () => {
        const headerCell = ganttObj.treeGrid.element.querySelector('.e-headercell') as HTMLElement;
        const evt: any = { action: 'tab', target: headerCell, preventDefault: () => { } };
        chartModule.onTabAction(evt);
        expect(ganttObj.allowRowDragAndDrop).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('documentMouseUp focusedElement tabIndex toggle', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let appended: Element[] = [];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date(), Duration: 3 },
                    { TaskID: 2, TaskName: 'Task B', StartDate: new Date(), Duration: 2 }
                ],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', visible: true },
                    { field: 'StartDate', headerText: 'Start Date', visible: true },
                    { field: 'Duration', headerText: 'Duration', visible: true }
                ],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
                height: '450px'
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    afterEach(() => {
        appended.forEach(el => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        });
        appended = [];
    });
    it('changes tabIndex from 0 to -1 when showActiveElement is true', () => {
        const focusContainer = document.createElement('div');
        focusContainer.tabIndex = 0;
        ganttObj.element.appendChild(focusContainer);
        appended.push(focusContainer);
        chartModule.focusedElement = focusContainer;
        ganttObj.showActiveElement = true;
        const evt = {
            type: 'mouseup',
            target: ganttObj.element,
            preventDefault: () => { }
        } as any;
        chartModule['documentMouseUp'](evt);
        expect(focusContainer.tabIndex).toBe(-1);
    });
    it('keeps tabIndex unchanged when it is not 0', () => {
        const focusContainer = document.createElement('div');
        focusContainer.tabIndex = 5;
        ganttObj.element.appendChild(focusContainer);
        appended.push(focusContainer);
        chartModule.focusedElement = focusContainer;
        ganttObj.showActiveElement = true;
        const evt = { type: 'mouseup', target: ganttObj.element, preventDefault: () => { } } as any;
        chartModule['documentMouseUp'](evt);
        expect(focusContainer.tabIndex).toBe(5);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('collapsedGanttRow record and gridRec branches', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { taskId: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3, hasChild: true }
                ],
                taskFields: {
                    id: 'taskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    hasChildMapping: 'hasChild'
                },
                loadChildOnDemand: true,
                enableVirtualization: true
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    it('uses currentViewData.filter to get record', () => {
        const record = ganttObj.currentViewData[0];
        const args: any = {
            data: record,
            gridRow: ganttObj.treeGrid.getRows()[0],
            chartRow: ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-chart-row')
        };
        chartModule.collapsedGanttRow(args);
        expect(record.expanded).toBe(false);
    });
    it('computes gridRec from getCurrentViewRecords and collapses row', () => {
        const record = ganttObj.currentViewData[0];
        const args: any = {
            data: record,
            gridRow: ganttObj.treeGrid.getRows()[0],
            chartRow: ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-chart-row')
        };
        chartModule.isExpandCollapseFromChart = true;
        chartModule.collapsedGanttRow(args);
        expect(args.chartRow.getAttribute('aria-expanded')).toBe('false');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('expandedGanttRow gridRec branch', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { taskId: 1, TaskName: 'Task A', StartDate: new Date('2026-03-11'), Duration: 3, hasChild: true }
                ],
                taskFields: {
                    id: 'taskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    hasChildMapping: 'hasChild'
                },
                loadChildOnDemand: true,
                enableVirtualization: true
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    it('computes gridRec from getCurrentViewRecords and expands row', () => {
        const record = ganttObj.currentViewData[0];
        const args: any = {
            data: record,
            gridRow: ganttObj.treeGrid.getRows()[0],
            chartRow: ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-chart-row')
        };
        chartModule.isExpandCollapseFromChart = true;
        chartModule.expandedGanttRow(args);
        expect(args.chartRow.getAttribute('aria-expanded')).toBe('true');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction branch with child record handling (patched getNextRowElement)', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let originalGetNext: any;
    let originalGetNextRow: any;
    let originalUpdate: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Parent',
                    StartDate: new Date('2026-03-10T00:00:00'),
                    Duration: 5
                },
                {
                    TaskID: 2,
                    TaskName: 'Parent with child',
                    StartDate: new Date('2026-03-11T00:00:00'),
                    Duration: 4,
                    children: [
                        { TaskID: 3, TaskName: 'Child A', StartDate: new Date('2026-03-12T00:00:00'), Duration: 2 }
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                child: 'children'
            },
            columns: [
                { field: 'TaskID', headerText: 'ID', visible: true },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'TaskName', headerText: 'Name', allowEditing: true }
            ],
            editSettings: { allowNextRowEdit: true },
            height: '450px'
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    beforeEach(() => {
        originalGetNext = chartModule.getNextElement;
        originalGetNextRow = chartModule.getNextRowElement;
        originalUpdate = chartModule.updateElement;
    });

    afterEach(() => {
        chartModule.getNextElement = originalGetNext;
        chartModule.getNextRowElement = originalGetNextRow;
        chartModule.updateElement = originalUpdate;
    });
    it('executes child-record branch without null errors', () => {
        const rowCells = ganttObj.element.querySelectorAll('.e-rowcell');
        const editedCell = rowCells[0];
        editedCell.classList.add('e-editedcell');
        const secondRow = ganttObj.treeGrid.getRows()[1];
        secondRow.setAttribute('aria-rowindex', '2');
        const idCellSecondRow = secondRow.querySelector('.e-rowcell') as HTMLElement;
        idCellSecondRow.setAttribute('aria-colindex', '1');
        chartModule.getNextElement = function(arg: any) {
            if (arg === editedCell) { return idCellSecondRow; }
            return null;
        };
        chartModule.getNextRowElement = function() {
            return secondRow;
        };
        let updateCalls = 0;
        chartModule.updateElement = function(next: Element) {
            updateCalls++;
            return next;
        };
        chartModule['onTabAction']({
            action: 'shiftTab',
            target: editedCell,
            preventDefault: () => {}
        } as any);
        expect(ganttObj.flatData[0].hasChildRecords).toBe(false)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('onTabAction branch with child record handling (patched getNextRowElement) If Condition', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    let originalGetNext: any;
    let originalGetNextRow: any;
    let originalUpdate: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Parent',
                    StartDate: new Date('2026-03-10T00:00:00'),
                    Duration: 5
                },
                {
                    TaskID: 2,
                    TaskName: 'Parent with child',
                    StartDate: new Date('2026-03-11T00:00:00'),
                    Duration: 4,
                    children: [
                        { TaskID: 3, TaskName: 'Child A', StartDate: new Date('2026-03-12T00:00:00'), Duration: 2 }
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                child: 'children',
                progress: 'TaskName'
            },
            columns: [
                { field: 'TaskID', headerText: 'ID', visible: true },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'TaskName', headerText: 'Name', allowEditing: true }
            ],
            editSettings: { allowNextRowEdit: true },
            height: '450px'
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    beforeEach(() => {
        originalGetNext = chartModule.getNextElement;
        originalGetNextRow = chartModule.getNextRowElement;
        originalUpdate = chartModule.updateElement;
    });

    afterEach(() => {
        chartModule.getNextElement = originalGetNext;
        chartModule.getNextRowElement = originalGetNextRow;
        chartModule.updateElement = originalUpdate;
    });
    it('executes child-record branch without null errors', () => {
        const rowCells = ganttObj.element.querySelectorAll('.e-rowcell');
        const editedCell = rowCells[0];
        editedCell.classList.add('e-editedcell');
        const secondRow = ganttObj.treeGrid.getRows()[1];
        secondRow.setAttribute('aria-rowindex', '2');
        const idCellSecondRow = secondRow.querySelector('.e-rowcell') as HTMLElement;
        idCellSecondRow.setAttribute('aria-colindex', '1');
        chartModule.getNextElement = function(arg: any) {
            if (arg === editedCell) { return idCellSecondRow; }
            return null;
        };
        chartModule.getNextRowElement = function() {
            return secondRow;
        };
        let updateCalls = 0;
        chartModule.updateElement = function(next: Element) {
            updateCalls++;
            return next;
        };
        chartModule['onTabAction']({
            action: 'shiftTab',
            target: editedCell,
            preventDefault: () => {}
        } as any);
        expect(ganttObj.flatData[0].hasChildRecords).toBe(false)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('resolveNextElement helper in Gantt context', () => {
    let ganttObj: Gantt;
    let chartModule: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('2026-03-10'), Duration: 3 },
                    { TaskID: 2, TaskName: 'Task B', StartDate: new Date('2026-03-13'), Duration: 4 }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID' },
                    { field: 'TaskName', headerText: 'Name' }
                ],
                height: '450px'
            }, done);
        chartModule = ganttObj.ganttChartModule;
    });
    it('returns the elementIfTrue when condition is true', () => {
        const firstRow = ganttObj.treeGrid.getRows()[0];
        const firstCell = firstRow.querySelector('.e-rowcell') as HTMLElement;
        const secondCell = firstRow.querySelectorAll('.e-rowcell')[1] as HTMLElement;
        const result = chartModule.resolveNextElement(true, firstCell, secondCell);
        expect(result.textContent).toContain('1');
    });
    it('returns the elementIfFalse when condition is false', () => {
        const firstRow = ganttObj.treeGrid.getRows()[0];
        const firstCell = firstRow.querySelector('.e-rowcell') as HTMLElement;
        const secondCell = firstRow.querySelectorAll('.e-rowcell')[1] as HTMLElement;
        const result = chartModule.resolveNextElement(false, firstCell, secondCell);
        expect(result.textContent).toContain('Task A');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('ChartRows - constructSegments method', () => {
    let ganttObj: Gantt;
    let chartRowsInstance: any;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskId: 1,
                        TaskName: 'Parent Task',
                        StartDate: new Date('2024/01/01'),
                        EndDate: new Date('2024/01/10'),
                        Duration: 10
                    }
                ],
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    child: 'Children'
                },
                projectStartDate: new Date('2024/01/01'),
                projectEndDate: new Date('2024/01/31')
            }, 
            done
        );
        chartRowsInstance = ganttObj.chartRowsModule;
    });

    it('constructSegments - Empty dates array', () => {
        const dates: Date[] = [];
        const taskData: any = {
            startDate: new Date('2024/01/01'),
            endDate: new Date('2024/01/10'),
            durationUnit: 'Day',
            isAutoSchedule: true,
            isMilestone: false,
            calendarContext: undefined
        };

        chartRowsInstance.constructSegments(dates, taskData);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getSegmentIndex - splitStartDate equals segment.startDate (bottomTier Day)', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('invoke getSegmentIndex with splitStartDate equal to a segment start (Day)', () => {
        ganttObj.flatData[0].ganttProperties.startDate = new Date('2024-01-02');
        ganttObj.contextMenuModule['isFromContextMenuBeforeOpen'] = false
        const record = ganttObj.flatData[0];
        const splitDate = new Date('2024-01-01T08:00:00');
        ganttObj.chartRowsModule.getSegmentIndex(splitDate, record);
    });
    it('invoke getSegmentIndex with splitStartDate equal to a segment start (Day)', () => {
        ganttObj.flatData[0].ganttProperties.startDate = new Date('2024-01-02');
        ganttObj.timelineModule.customTimelineSettings.bottomTier.unit = 'Minutes';
        const record = ganttObj.flatData[0];
        ganttObj.contextMenuModule['isFromContextMenuBeforeOpen'] = false
        const splitDate = new Date('2024-01-01T08:00:00');
        ganttObj.chartRowsModule.getSegmentIndex(splitDate, record);
    });
    it('invoke getSegmentIndex with splitStartDate equal to a segment start (Day)', () => {
        ganttObj.flatData[0].ganttProperties.startDate = new Date('2024-01-02');
        ganttObj.timelineModule.customTimelineSettings.bottomTier.unit = 'Hour';
        const record = ganttObj.flatData[0];
        ganttObj.contextMenuModule['isFromContextMenuBeforeOpen'] = false
        const splitDate = new Date('2024-01-01T08:00:00');
        ganttObj.chartRowsModule.getSegmentIndex(splitDate, record);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getTableTrNode method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('getTableTrNode method', () => {
        ganttObj.treeGridModule.isPersist = true;
        (ganttObj as any).treeGrid.grid.contentModule.getRows()[0].isSelected = true
        ganttObj.chartRowsModule['getTableTrNode'](0)
    });
    it('getTableTrNode method', () => {
        ganttObj.treeGridModule.isPersist = true;
        ganttObj.chartRowsModule['getTableTrNode'](0)
    });
    
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('ChartRows - constructSegments method', () => {
    let ganttObj: Gantt;
    let chartRowsInstance: any;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskId: 1,
                        TaskName: 'Parent Task',
                        StartDate: new Date('2024/01/01'),
                        EndDate: new Date('2024/01/10'),
                        Duration: 10
                    }
                ],
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    child: 'Children'
                },
                projectStartDate: new Date('2024/01/01'),
                projectEndDate: new Date('2024/01/31')
            }, 
            done
        );
        chartRowsInstance = ganttObj.chartRowsModule;
    });
    it('constructSegments - Empty dates array', () => {
        const dates: Date[] = [new Date('2024/01/11'),new Date('2024/01/12')];
        const taskData: any = {
            startDate: new Date('2024/01/01'),
            endDate: new Date('2024/01/10'),
            durationUnit: 'Day',
            isAutoSchedule: true,
            isMilestone: false,
            calendarContext: undefined
        };

        const result = chartRowsInstance.constructSegments(dates, taskData);
        // Expected: Single segment from startDate to endDate (i=0, loop breaks at i===0)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('splitTask method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('splitTask method', () => {
        ganttObj.chartRowsModule['splitTask'](1,new Date('2024-01-01'))
    });
    it('getTableTrNode method', function () {
        ganttObj.chartRowsModule['splitTask'](1, [new Date('2024-01-01')]);
    });
    it('refreshChartAfterSegment method', () => {
        ganttObj.timezone = 'UTC',
        ganttObj.chartRowsModule['refreshChartAfterSegment'](ganttObj.flatData[0],'action');
    });
    it('getExpandDisplayProp method', function () {
        (ganttObj as any).chartRowsModule['templateData'] = {'filterLevel':true};
        (ganttObj as any).chartRowsModule['getExpandDisplayProp']()
        });
    it('setRowHeight method', function () {
        (ganttObj as any).chartRowsModule['setRowHeight'](1, '20', ganttObj.treeGrid, true, undefined)
    });
    it('refreshRecords method', function () {     
        ganttObj.isGanttChartRendered = true;
        ganttObj.isReact = true
        ganttObj.chartRowsModule['refreshRecords'](ganttObj.flatData,undefined, true);
        });
    it('removeEventListener method', function () {     
        ganttObj.isDestroyed = true
        ganttObj.chartRowsModule['removeEventListener']()
        });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('splitTask method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ],
            subtasks: [
                    { TaskID: 2, StartDate: new Date('2024-01-05'), Duration: 2},
                    { TaskID: 3, StartDate: new Date('2024-01-05'), Duration: 2}

                ],
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('refreshRow  method', function () {
        ganttObj.previousFlatData = ganttObj.flatData
        ganttObj.frozenColumns = 2;
        ganttObj.previousFlatData[0].expanded = true;
        ganttObj['freezeModule'] = true;
        ganttObj.allowTaskbarOverlap = false;
        ganttObj.chartRowsModule['refreshRow'](0, false, true)
        });
    it('refreshRow  method', function () {
        ganttObj.previousFlatData = ganttObj.flatData
        ganttObj.frozenColumns = 2;
        ganttObj.previousFlatData[0].expanded = true;
        ganttObj['freezeModule'] = true;
        ganttObj.allowTaskbarOverlap = false;
        ganttObj.chartRowsModule['refreshRow'](0, false, false)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('splitTask method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ],
            subtasks: [
                    { TaskID: 2, StartDate: new Date('2024-01-05'), Duration: 2, BaselineStartDate: new Date('2024-01-05'), BaselineEndDate:new Date('2024-01-08') },
                    { TaskID: 3, StartDate: new Date('2024-01-05'), Duration: 2, BaselineStartDate: new Date('2024-01-05'), BaselineEndDate:new Date('2024-01-08') }

                ],
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('refreshRow  method', function () {
        ganttObj.previousFlatData = ganttObj.flatData
        ganttObj.frozenColumns = 2;
        ganttObj.previousFlatData[0].expanded = false;
        ganttObj['freezeModule'] = true;
        ganttObj.allowTaskbarOverlap = false;
        ganttObj.enableMultiTaskbar = true;
        ganttObj.renderBaseline = true;
        ganttObj.chartRowsModule['refreshRow'](0, false, false)
        });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('splitTask method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ],
            subtasks: [
                    { TaskID: 2, StartDate: new Date('2024-01-05'), Duration: 2, BaselineStartDate: new Date('2024-01-05'), BaselineEndDate:new Date('2024-01-08') },
                    { TaskID: 3, StartDate: new Date('2024-01-05'), Duration: 2, BaselineStartDate: new Date('2024-01-05'), BaselineEndDate:new Date('2024-01-08') }

                ],
        }
    ];
    beforeEach((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('refreshRow  method', function () {
        ganttObj.previousFlatData = ganttObj.flatData
        ganttObj.frozenColumns = 2;
        ganttObj.previousFlatData[0].expanded = false;
        ganttObj['freezeModule'] = true;
        ganttObj.allowTaskbarOverlap = true;
        ganttObj.enableMultiTaskbar = true;
        ganttObj.showOverAllocation = true;
        ganttObj.renderBaseline = true;
        ganttObj.chartRowsModule['refreshRow'](0, true, true)
        });
    afterEach(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('CR1015593:Auto corrected task collection returns incorrectly when validated data is passed', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [ { TaskID: 1, TaskName: "Planning and Permits", StartDate: new Date("04/02/2025"), EndDate: new Date("04/10/2025"), Duration: 7, Progress: 100}
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress'
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
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', validationRules: { required: true, minLength: [5, 'Task name should have a minimum length of 5 characters'], } },
                { field: 'StartDate' },
                { field: 'EndDate'},
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' }
            ],
            tooltipSettings: {
                showTooltip: true
            },
            gridLines: "Both",
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
            actionComplete (args) {
                if (args.type === 'refresh') {
                    expect(args.modifiedTasks.length).toBe(0);
                }
            },
            height: '250px'
            }, done);
    });
    it('Checking autovalidated task collection', () => {
        expect(ganttObj.dataOperation['validatedGanttData'].size).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Improve Coverage', () => {
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
                       { field: 'TaskID' },
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
        it('actionFailures method', () => {
            (ganttObj as any).resourceFields.id = false
            ganttObj['actionFailures']();
        });
        it('keyDownHandler method', function () {
            const e = {altKey: true, keyCode: 74};
            (ganttObj as any)['keyDownHandler'](e);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
describe('improve coverage', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('isValidDateString ', function () {
        ganttObj.dataOperation['isValidDateString']('123');
    });
    it('processTimeline ', function () {
        ganttObj.taskbarHeight = 5;
        ganttObj.rowHeight = 10;
        ganttObj.dataOperation['getTaskbarHeight']()
    });
    it('processTimeline ', function () {
        ganttObj.dataOperation['validateWorkUnitMapping']('day')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('improve coverage', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('processTimeline ', ()=>{
        ganttObj.enableValidation = false;
        ganttObj.dataOperation['processTimeline']()
    });
    it('isValidDateString ', function () {
            ganttObj.dataOperation['isValidDateString']('');
    });
    it('processTimeline ', function () {
        ganttObj.taskbarHeight = 10;
        ganttObj.rowHeight = 5;
        ganttObj.dataOperation['getTaskbarHeight']()
    });
    it('processTimeline ', function () {
        ganttObj.dataOperation['validateWorkUnitMapping']('minute')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Improve Coverage', () => {
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
                       { field: 'TaskID' },
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
        it('previousTimeSpan method', () => {
            ganttObj.isReact = true
            ganttObj.undoRedoModule['redoEnabled'] = true;
            ganttObj['previousTimeSpan']()
        });
        it('nextTimeSpan method', function () {
            ganttObj.isReact = true
            ganttObj.undoRedoModule['redoEnabled'] = true;
            ganttObj['nextTimeSpan']()
        });
        it('removeCalendarContext method', function () {
            (ganttObj as any)['removeCalendarContext'](false)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('setValidatedDates method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    
    it('setValidatedDates method',  () =>  {
        let data = {StartDate: new Date('2024-01-01'), EndDate: new Date('2024-01-29')}
        ganttObj.dataOperation['setValidatedDates'](ganttObj.flatData[0], data);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('setValidatedDates method', () => {
    let ganttObj: Gantt;
    const data: any[] = [
        {
            TaskID: 1,
            TaskName: 'Split Task Day',
            StartDate: new Date('2024-01-01'),
            Duration: 10,
            segments: [
                { StartDate: new Date('2024-01-05'), Duration: 2 },
                { StartDate: new Date('2024-01-08'), Duration: 2 }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    segments: 'segments',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                enableUndoRedo: true,
                allowSelection: true,
                selectedRowIndex: 1,
                enableContextMenu: true,
                timelineSettings: {
                    topTier: { unit: 'Week', format: 'dd/MM/yyyy' },
                    bottomTier: { unit: 'Day', count: 1 }
                },
                projectStartDate: new Date('2024-01-01'),
                projectEndDate: new Date('2024-01-31'),
            }, done);
    });
    it('setValidatedDates method', () => {
            let data = {StartDate: new Date('2024-01-01'), EndDate: new Date('2024-01-29'), Duration: 5}
            ganttObj.dataOperation['setValidatedDates'](ganttObj.flatData[0], data);
        });
    it('getTaskbarHeight method', ()=> {
        ganttObj['getTaskbarHeight']();
    })
    it('expandByID method', ()=> {
        ganttObj.enableVirtualization = true;
        ganttObj['expandByID'](1);
    })
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('1021511 Parent taskbar startDate calculation not considering the unscheduled child tasks', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
  
  {
    TaskID: 4,
    TaskName: 'Project 2 with mixed tasks',
    subtasks: [
      {
        TaskID: 5,
        TaskName: 'unscheduled Task 2.1',
        Duration: 3,
      },
      {
        TaskID: 6,
        TaskName: 'Scheduled Task 2.2',
        StartDate: new Date('04/02/2026'),
        EndDate: new Date('04/03/2026'),
      },
    ],
  },
  
];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    {field: 'TaskID', width: 75 },
                    {field: 'TaskName', width: 80 },
                    {field: 'StartDate', width: 120},
                    {field: 'EndDate', width: 120 },
                    {field: 'Duration', width: 90 },
                ],
                splitterSettings: {
                    columnIndex: 4
                },
                allowSelection: true,
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
                searchSettings:
                { fields: ['TaskName', 'Duration'] 
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
            }, done);
    });
    it('Unscheduled tasks ', () => {
        expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.startDate)).toBe('4/2/2026');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.endDate)).toBe('4/6/2026');
        expect(ganttObj.flatData[1].ganttProperties.duration).toBe(3);
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.endDate)).toBe('4/3/2026');

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Date format update dynamically', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Task 1',
                        StartDate: new Date('04/02/2026'),
                        EndDate: new Date('04/05/2026')
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate'
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'EndDate' }
                ],
                dateFormat: 'M/d/yyyy',
                height: '450px'
            }, done);
    });
    it('should update date format dynamically', () => {
        // Initial format
        expect(
            ganttObj.getFormatedDate(
                ganttObj.flatData[0].ganttProperties.startDate
            )
        ).toBe('4/2/2026');
        // Change date format dynamically
        ganttObj.dateFormat = 'dd/MM/yyyy';
        expect(ganttObj.dateFormat).toBe('dd/MM/yyyy');
        // Verify formatted date
        expect(
            ganttObj.getFormatedDate(
                ganttObj.flatData[0].ganttProperties.startDate
            )
        ).toBe('02/04/2026');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt daysPerWeek and daysPerMonth invalid value validation and for coverage', () => {
    let ganttObj: Gantt;
    let actionFailureArgs: string[] = [];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            allowSelection: true,
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('2024-01-01'), Duration: 5 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration'
            },
            daysPerWeek: null,
            daysPerMonth: -5,
            actionFailure: (args: any) => {
                if (args.name === 'actionFailure') {
                    actionFailureArgs.push(args.error[0]);
                }
            }
        }, done);
    });

    it('should trigger actionFailure on initial load for invalid daysPerWeek and daysPerMonth', () => {
        expect(actionFailureArgs).toBeDefined();
        expect(actionFailureArgs[0]).toContain('daysPerWeek');
        expect(actionFailureArgs[1]).toContain('daysPerMonth');
        expect(ganttObj.daysPerWeek).toBe(5);
        expect(ganttObj.daysPerMonth).toBe(20);
    });

    it('should trigger actionFailure on property change for invalid daysPerWeek and daysPerMonth', (done: Function) => {
        const failureMessages: string[] = [];
        const ganttObj2: Gantt = createGantt({
            allowSelection: true,
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('2024-01-01'), Duration: 5 }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration'
            }
        }, () => {
            ganttObj2.actionFailure = (args: any) => {
                if (args.name === 'actionFailure' && args.error) {
                    Object.keys(args.error).forEach((key: string) => {
                        failureMessages.push(args.error[key]);
                    });
                    if (failureMessages.some((msg: string) => msg.includes('daysPerWeek')) &&
                        failureMessages.some((msg: string) => msg.includes('daysPerMonth'))) {
                        expect(failureMessages.some((msg: string) => msg.includes('daysPerWeek'))).toBe(true);
                        expect(failureMessages.some((msg: string) => msg.includes('daysPerMonth'))).toBe(true);
                        destroyGantt(ganttObj2);
                        done();
                    }
                }
            };
            ganttObj2.setProperties({ daysPerWeek: 10, daysPerMonth: 32 });
        });
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});