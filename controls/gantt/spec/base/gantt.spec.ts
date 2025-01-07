/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort, ColumnMenu, ITaskbarClickEventArgs, RecordDoubleClickEventArgs,ExcelExport ,PdfExport ,Reorder, Resize, CriticalPath, VirtualScroll} from '../../src/index';
import { unscheduledData, projectResources, resourceGanttData, dragSelfReferenceData, selfReference, projectData1,baselineDatas, projectNewData2, totalDurationData, filterdata, projectNewData9, projectNewData10, projectNewData11, projectNewData12, selfData1, splitTasksData1, projectNewData13, publicProperty, cellEditData, resourcesData, cr884998,treeData,invalidPrdcessor, dataSource2, dataSource1, cR893051, undoDataSource, editingData3,editingResources3, exportData1} from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
import { getValue, setValue } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Edit, Selection, ContextMenu, Sort, Toolbar, Filter, DayMarkers, ColumnMenu, ExcelExport , PdfExport, Reorder, Resize,CriticalPath, VirtualScroll);
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
        expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
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
    it('Set datasource to empty', (done: Function) => {
        let update: HTMLElement = ganttObj.element.querySelector('#' + 'update') as HTMLElement;
        triggerMouseEvent(update, 'click');
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'refresh') {
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
        expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
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
        ganttObj.UpdateOffsetOnTaskbarEdit = null;
        ganttObj.dataBind();
        expect(ganttObj.UpdateOffsetOnTaskbarEdit).toBe(null);
        ganttObj.UpdateOffsetOnTaskbarEdit = undefined;
        ganttObj.dataBind();
        expect(ganttObj.UpdateOffsetOnTaskbarEdit).toBe(undefined);
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
                // projectStartDate={projectStartDate}
                // projectEndDate={projectEndDate}
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
    it('Changing DataSource', (done:Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "refresh") {
                expect(ganttObj.flatData.length).toBe(2);
                done();
            }
        };
        ganttObj.dataSource = dataSource2
    });
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
        expect(value).toBe(2025);
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