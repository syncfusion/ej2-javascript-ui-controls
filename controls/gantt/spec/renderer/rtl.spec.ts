/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, ContextMenu, Sort, ColumnMenu, RowDD, ITaskbarEditedEventArgs, TimelineSettingsModel, ContextMenuClickEventArgs, Reorder, Resize, VirtualScroll, ExcelExport, PdfExport } from '../../src/index';
import { projectResources, projectData1, projectData, baselineData, normalResourceData, resourceCollection, StringResourceSelefReferenceData, StringMultiResources, splitTasksData, predcessor1, rangeContainer, rangeContainerResource } from '../base/data-source.spec';
import { createGantt, destroyGantt, getKeyUpObj, triggerMouseEvent } from '../base/gantt-util.spec';
import * as cls from '../../src/gantt/base/css-constants';
Gantt.Inject(Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, ContextMenu, Sort, ColumnMenu, RowDD, Reorder, Resize, VirtualScroll, ExcelExport, PdfExport);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt - Render with Enable RTL', () => {

    describe('Edit Duration of new task', function () {
        let ganttObj: Gantt;
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: [],
                allowSorting: true,
                enableRtl: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
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
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
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
                timelineSettings: {
                    timelineViewMode: 'Week',
                    topTier: {
                        format: 'MMM',
                        unit: 'Week',
                    },
                    bottomTier: {
                        unit: 'Day',
                        format: 'dd',
                    },
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('07/22/2022'),
                projectEndDate: new Date('08/28/2022')
            }, done);
        });
        it('Edit duration of new task', () => {
            ganttObj.fitToProject();
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == 'add') {
                    expect(args.data.EndDate.getDate() - args.data.StartDate.getDate()).toBe(1);
                }
            };
            ganttObj.openAddDialog();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('07/20/2022');
            let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            name.value = '2 days';
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt toolbar action', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
                    enableRtl: true,
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
                        segments: 'Segments'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan', 'Custom', { text: 'Quick Filter', tooltipText: 'Quick Filter', id: 'toolbarfilter' },],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        it('Check all toolbar rendered properly', () => {
            let toolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar') as HTMLElement;
            expect(toolbar.getElementsByClassName('e-toolbar-item').length).toBe(15);
        });

        it('Ensuring proper toolbar display', () => {
            ganttObj.toolbar = ["Add", "Cancel", "CollapseAll", "Delete", "Edit", "ExpandAll", "NextTimeSpan", "PrevTimeSpan", "Search", "Update", "ZoomIn", "ZoomOut", "ZoomToFit"];
            ganttObj.dataBind();
            expect(expect(ganttObj.element.getElementsByClassName('e-hidden').length).toBe(4));
        });

        it('Add handler function', () => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
            let startDate: HTMLInputElement = (<HTMLInputElement>document.querySelector('#' + ganttObj.element.id + 'StartDate'));
            if (startDate) {
                let StartDateInput: any = (document.getElementById(ganttObj.element.id + 'StartDate') as any).ej2_instances[0];
                StartDateInput.value = new Date('02/06/2017');
            }
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
            triggerMouseEvent(save, 'click');
            expect(ganttObj.flatData.length).toBe(42);
        });

        it('Previous Timespan handler function', () => {
            let previoustimespanToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_prevtimespan') as HTMLElement;
            triggerMouseEvent(previoustimespanToolbar, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe('01/29/2017');
        });

        it('Next Timespan handler function', () => {
            let nexttimespanToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_nexttimespan') as HTMLElement;
            triggerMouseEvent(nexttimespanToolbar, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'MM/dd/yyyy')).toBe('12/31/2017');
        });

        it('ExpandAll handler function', () => {
            let expandallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_expandall') as HTMLElement;
            triggerMouseEvent(expandallToolbar, 'click');
            expect(ganttObj.flatData[1].expanded).toBe(true);
            ganttObj.selectionModule.clearSelection();
        });

        it('Check Zoom Out action', () => {
            let zoomOut: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomout') as HTMLElement;
            triggerMouseEvent(zoomOut, 'click');
            expect(ganttObj.timelineModule.customTimelineSettings.timelineUnitSize).toBe(99);
            expect(ganttObj.currentZoomingLevel.level).toBe(10);

        });

        it('Check Zoom In action', () => {
            let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
            triggerMouseEvent(zoomIn, 'click');
            expect(ganttObj.timelineModule.customTimelineSettings.timelineUnitSize).toBe(33);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('Day');
            expect(ganttObj.currentZoomingLevel.level).toBe(11);
            ganttObj.fitToProject();

        });

        it('Enable toolbar on row selection', () => {
            ganttObj.selectionModule.selectRow(4);
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar').getElementsByClassName('e-hidden').length).toBe(2);
            ganttObj.selectionModule.clearSelection();
        });

        it('Disable toolbar on row deselection', () => {
            ganttObj.selectionModule.clearSelection();
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar').getElementsByClassName('e-hidden').length).toBe(4);
        });

        it('On celledit handler function', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar').getElementsByClassName('e-hidden').length).toBe(3);
            ganttObj.selectionModule.clearSelection();
        });

        it('On celleditsaved handler function', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let taskValue: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName'));
            taskValue.value = 'Update TaskName';
            let updateToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_update') as HTMLElement;
            triggerMouseEvent(updateToolbar, 'click');
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar').getElementsByClassName('e-hidden').length).toBe(4);
            ganttObj.selectionModule.clearSelection();
        });

        it('Search Icon handler function', () => {
            let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
            searchbar.value = '';
            let searchIcon: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbutton') as HTMLElement;
            triggerMouseEvent(searchIcon, 'click');
            expect(ganttObj.currentViewData.length).toBe(42);
            ganttObj.clearFiltering();
        });

        it('Search Enter handler function', () => {
            let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
            searchbar.value = 'hai';
            (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar')).focus();
            (ganttObj.toolbarModule as any).keyUpHandler(getKeyUpObj(13, searchbar));
            expect(ganttObj.searchSettings.key).toBe('hai');
        });
        it('Destroy method', () => {
            ganttObj.toolbarModule.destroy();
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Drag And drop for below position', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData,
                    allowFiltering: true,
                    enableRtl: true,
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
        it('Drag and drop', function () {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'rowDropped') {
                    expect(ganttObj.dataSource[0].subtasks[0].subtasks.length).toBe(6);
                }
            };
            ganttObj.reorderRows([10], 3, 'below');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Weekend rendering', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
                workWeek: ['Tuesday'],
                highlightWeekends: true,
                renderBaseline: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 2
                    },
                    timelineUnitSize: 60,
                    weekStartDay: 2
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        it('Weekend Testing ', () => {
                expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].width).toBe('30px');
                expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].height).toBe('100%');
                ganttObj.holidays = [];
                ganttObj.highlightWeekends = false;
                ganttObj.dataBind();
                expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.nonworkingContainer}`)).toBe(null);
                expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekendContainer}`)).toBe(null);
        });
        it('Weekend Testing hour Bottom tier weekend highlight', () => {
            let timelineObject: TimelineSettingsModel = {
                topTier: {
                    unit: 'Day',
                },
                bottomTier: {
                    unit: 'Hour',
                    count: 12
                },
            };
            ganttObj.timelineSettings = timelineObject;
            ganttObj.dataBind();
            let timelineHeaders = ganttObj.ganttChartModule.chartTimelineContainer.querySelectorAll('tr');
            expect(timelineHeaders[1].querySelectorAll(`.${cls.weekendHeaderCell}`).length).toBe(78);
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
            ganttObj = createGantt({
                dataSource: StringResourceSelefReferenceData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
                enableRtl: true,
                enableMultiTaskbar: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    parentID: 'parentId',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    expandState: 'isExpand',
                    work: 'work',
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
                    allowTaskbarEditing: true
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')

            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });

        it('Add resources using add dialog', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    // expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
                    // expect(ganttObj.currentViewData[1].parentItem).toBeDefined();
                    // expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(2);
                }
            };
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
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
            ganttObj = createGantt({
                dataSource: StringResourceSelefReferenceData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
                enableRtl: true,
                enableMultiTaskbar: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    parentID: 'parentId',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    expandState: 'isExpand',
                    work: 'work',
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
                    allowTaskbarEditing: true
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')

            }, done);
        });
        // beforeEach((done) => {
        //     setTimeout(done, 100);
        //     ganttObj.openAddDialog();
        // });

        it('Adding task under unassigned task', () => {
            ganttObj.openAddDialog();
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
            expect(ganttObj.currentViewData[9].ganttProperties.resourceNames).toBe('');
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
            ganttObj = createGantt({
                dataSource: StringResourceSelefReferenceData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
                enableRtl: true,
                enableMultiTaskbar: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    parentID: 'parentId',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    expandState: 'isExpand',
                    work: 'work',
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
                    allowTaskbarEditing: true
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')

            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });
        it('Right resizing the added record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'RightResizing') {
                    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'MM/dd/yyyy')).toEqual('04/05/2019');
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(1);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Left resizing the added record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'LeftResizing') {
                    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'MM/dd/yyyy')).toEqual('04/05/2019');
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(1);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Taskbar drag action', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'ChildDrag') {
                    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'MM/dd/yyyy')).toEqual('04/03/2019');
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Deleting the record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.selectRow(2);
            let deleteRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    
    describe('Context menu -', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
                    enableRtl: true,
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
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('01/28/2019'),
                    projectEndDate: new Date('03/10/2019')
                }, done);
        });
        it('split task - margin left for parent div', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "splitTaskbar") {
                    args.splitDate = ganttObj.dateValidationModule.setTime(ganttObj.defaultEndTime, args.splitDate);
                }
            };
            let ganttElement: HTMLElement = document.querySelector('#' + ganttObj.element.id) as HTMLElement;
            ganttElement.style.marginLeft = '350px';
            ganttObj.splitTask(4, new Date('02/04/2019'));
            let segment: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar > div') as HTMLElement;
            triggerMouseEvent(segment, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_SplitTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[4].ganttProperties.segments.length).toBe(2);
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
            ganttObj = createGantt({
                dataSource: StringResourceSelefReferenceData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
                enableRtl: true,
                enableMultiTaskbar: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    parentID: 'parentId',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    expandState: 'isExpand',
                    work: 'work',
                },
                taskType: 'FixedDuration',
                 allowSorting: true,
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
                    allowTaskbarEditing: true
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
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')

            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });
        it('Adding New task', () => {
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            // expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(16);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('predecessor collection as object', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: predcessor1,
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
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSelection: true,
                    allowRowDragAndDrop: true,
                    connectorLineBackground:'blue',
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
                    enableTimelineVirtualization : true,
                    enableVirtualization : true,
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
        // beforeEach((done: Function) => {
        //     setTimeout(done, 100);
        // });
        it('predecessor validation as object', () => {
            expect(ganttObj.currentViewData[6].ganttProperties.predecessorsName).toBe("11FS,10FS");
            expect(ganttObj.connectorLineBackground).toBe('blue');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('updating spliter position as grid', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                enableRtl : true,
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
        it('updating spliter position', () => {
            let splitterView = ganttObj.splitterSettings.view;
            splitterView = 'Grid';
            ganttObj.setSplitterPosition(splitterView, 'view');
            expect(ganttObj.splitterSettings.view).toBe('Grid');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('updating spliter position as chart', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                enableRtl : true,
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
        it('updating spliter position', () => {
            let splitterView = ganttObj.splitterSettings.view;
            splitterView = 'Chart';
            ganttObj.setSplitterPosition(splitterView, 'view');
            expect(ganttObj.splitterSettings.view).toBe('Chart');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('range container in rtl', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: rangeContainer,
                enableRtl : true,
                resources: rangeContainerResource,
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
                        day: '04/17/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                
                }],
                readOnly: false,
               //gridLines: "Both",
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
        it('range container in rtl', () => {
            // expect((document.querySelectorAll('.e-chart-rows-container')[0].lastChild as Element).classList.contains('e-rangecontainer')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});
