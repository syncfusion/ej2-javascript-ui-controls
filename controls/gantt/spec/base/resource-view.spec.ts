/**
 * Gantt resource view spec
 */
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, VirtualScroll } from '../../src/index';
import { resourceCollection, resourceSelefReferenceData, resourcesData, normalResourceData, multiTaskbarData, multiResources,
     virtualResourceData, editingResources, resourceAdd, resourcesAdded } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
Gantt.Inject(Edit, Selection, Toolbar, Filter, DayMarkers, VirtualScroll);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
let ganttModel: Object = {
    dataSource: normalResourceData,
    resources: resourceCollection,
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
};
describe('Gantt - Resource view', () => {
    describe('Resource Normal view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 2;
        });
        it('Add resources using add dialog', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEditDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox3: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            triggerMouseEvent(resourceCheckbox3, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Adding task under unassigned task', () => {
            expect(ganttObj.currentViewData[3].ganttProperties.sharedTaskUniqueIds.length).toBe(3);
            expect(ganttObj.currentViewData[4].childRecords.length).toBe(4);
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Left resizing the added record', () => {
            expect(ganttObj.flatData[19].childRecords.length).toBe(2);
            expect(ganttObj.flatData[21].parentItem).toBeDefined();
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'LeftResizing') {
                    expect(ganttObj.currentViewData[8].ganttProperties.startDate).toEqual(ganttObj.currentViewData[3].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon')[0] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right resizing the added record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'RightResizing') {
                    expect(ganttObj.currentViewData[8].ganttProperties.startDate).toEqual(ganttObj.currentViewData[3].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[8].ganttProperties.endDate).toEqual(ganttObj.currentViewData[3].ganttProperties.endDate);
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Taskbar drag action', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'ChildDrag') {
                    expect(ganttObj.currentViewData[8].ganttProperties.startDate).toEqual(ganttObj.currentViewData[3].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[8].ganttProperties.endDate).toEqual(ganttObj.currentViewData[3].ganttProperties.endDate);
                    expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Editing task name', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.taskName).toBe('TaskName updated');
            expect(ganttObj.currentViewData[8].ganttProperties.taskName).toBe('TaskName updated');
        });
        it('Editing resource column', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(resource, 'dblclick');
            let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
            if (ddlElement) {
                let input: any = ddlElement.ej2_instances[0];
                input.value = [1];
                input.dataBind();
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                //checking work values for task after adding resource
                expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 1');
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
                expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/17/2019');
                expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(32);
            }
        });
    });   

    describe("Task label in resource view", () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourceAdd,
                    resources: resourcesAdded,
                    viewType: 'ResourceView',
                    enableMultiTaskbar: true,
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
                },
                done
            );
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            ganttObj.openEditDialog(6);
            setTimeout(done, 1000);
            let tab: any = document.querySelectorAll('#e-item-Gantt_0_Tab_2 > div > div')[0];
            triggerMouseEvent(tab, 'click');
        });


        it("EJ2-832988-Task label correctly render as same in grid and chart", () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEditDialog") {
                   args.dialogModel.animationSettings = { 'effect': 'none' };
               }
            };
            ganttObj.dataBind();
            let checkbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let checkbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let checkbox3: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(4) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(checkbox1, 'click');
            triggerMouseEvent(checkbox2, 'click');
            triggerMouseEvent(checkbox3, 'click');
            triggerMouseEvent(saveRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === 'save') {
                    expect(document.querySelectorAll('.e-treecell')[9].innerHTML).toBe(document.querySelectorAll('.e-task-label')[14].innerHTML);
                    expect(document.querySelectorAll('.e-treecell')[10].innerHTML).toBe(document.querySelectorAll('.e-task-label')[15].innerHTML);
                    expect(document.querySelectorAll('.e-treecell')[11].innerHTML).toBe(document.querySelectorAll('.e-task-label')[16].innerHTML);
               }
           };
        });
    });

    describe('OverAllocation container', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: multiResources,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    expandState: 'isExpand',
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        it('Property binding for showOverAllocation', () => {
            ganttObj.showOverAllocation = true;
            expect(ganttObj.showOverAllocation).toEqual(true);
        });
        it('taskbar resizing - editing cancel', () => {
            expect(ganttObj.currentViewData[4].ganttProperties.workTimelineRanges.length).toBe(2);
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/01/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('taskbar resizing cancel - record in collapsed state', () => {
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {

                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/29/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div.e-collapse-parent > div:nth-child(1)') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('taskbar drag action - parent record in collapsed state', () => {
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = false;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/03/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div.e-collapse-parent > div:nth-child(1)') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
});

describe('Resoure editing using Edit dialog', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: multiTaskbarData,
            resources: multiResources,
            enableMultiTaskbar: true,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                expandState: 'isExpand',
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
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 1000);
        ganttObj.editModule.dialogModule.openEditDialog(ganttObj.currentViewData[5]);
        let tabElement: HTMLElement = <EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab');
        if (tabElement) {
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        }
    });
    it('Adding resource to existing task', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(args.data.ganttProperties.sharedTaskUniqueIds.length).toBe(4);
                expect(args.data.ganttProperties.resourceInfo.length).toBe(4);
                expect(ganttObj.currentViewData[0].childRecords.length).toBe(4);
            }
        };
        ganttObj.dataBind();
        let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox3: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox4: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(4) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(resourceCheckbox1, 'click')
        triggerMouseEvent(resourceCheckbox2, 'click')
        triggerMouseEvent(resourceCheckbox3, 'click')
        triggerMouseEvent(resourceCheckbox4, 'click')
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');

    });
});
describe('Self reference data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: resourceSelefReferenceData,
            resources: multiResources,
            viewType: 'ResourceView',
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done) => {
        setTimeout(done, 1000);
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
                expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
                expect(ganttObj.currentViewData[1].parentItem).toBeDefined();
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox3: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(resourceCheckbox1, 'click')
        triggerMouseEvent(resourceCheckbox2, 'click')
        triggerMouseEvent(resourceCheckbox3, 'click')
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
    });
    it('Adding task under unassigned task', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.sharedTaskUniqueIds.length).toBe(3);
        expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
    });
    it('Left resizing the added record', () => {
        expect(ganttObj.flatData[14].childRecords.length).toBe(1);
        expect(ganttObj.flatData[15].parentItem).toBeDefined();
        let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        triggerMouseEvent(cancelRecord, 'click');
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'LeftResizing') {
                expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[7].ganttProperties.startDate);
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Right resizing the added record', () => {
        let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        triggerMouseEvent(cancelRecord, 'click');
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'RightResizing') {
                expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[7].ganttProperties.startDate);
                expect(ganttObj.currentViewData[1].ganttProperties.endDate).toEqual(ganttObj.currentViewData[7].ganttProperties.endDate);
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Taskbar drag action', () => {
        let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        triggerMouseEvent(cancelRecord, 'click');
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'ChildDrag') {
                expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[7].ganttProperties.startDate);
                expect(ganttObj.currentViewData[1].ganttProperties.endDate).toEqual(ganttObj.currentViewData[7].ganttProperties.endDate);
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Editing task name', () => {
        let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        triggerMouseEvent(cancelRecord, 'click');
        ganttObj.dataBind();
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[7].ganttProperties.taskName).toBe('TaskName updated');
        expect(ganttObj.currentViewData[10].ganttProperties.taskName).toBe('TaskName updated');
    });
    it('Deleting the record', () => {
        ganttObj.selectRow(1);
        let deleteRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        triggerMouseEvent(deleteRecord, 'click');
    });
    it('Adding reord using method', () => {
        ganttObj.selectRow(1);
        let deleteRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        triggerMouseEvent(deleteRecord, 'click');
    });
    it('Adding New task', () => {
        let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(resourceCheckbox1, 'click')
        triggerMouseEvent(resourceCheckbox2, 'click')
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
    });
  });
  describe("CR issues", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
          dataSource: [
            {
              TaskID: 1,
              TaskName: "Project Initiation",
              StartDate: new Date("04/02/2019"),
              EndDate: new Date("04/21/2019"),
              subtasks: [
                {
                  TaskID: 2,
                  TaskName: "Identify Site location",
                  StartDate: new Date("04/02/2019"),
                  Duration: 6,
                  resources: [{ resourceId: 1, resourceUnit: 50 }],
                },
              ],
            },
          ],
          resources: [
            { resourceId: 1, resourceName: "Martin Tamer" },
            { resourceId: 2, resourceName: "Rose Fuller" },
            { resourceId: 3, resourceName: "Margaret Buchanan" },
          ],
          viewType: "ResourceView",
          enableMultiTaskbar: true,
          taskFields: {
            id: "TaskID",
            name: "TaskName",
            startDate: "StartDate",
            endDate: "EndDate",
            child: "subtasks",
            duration: "Duration",
            progress: "Progress",
            resourceInfo: "resources",
           },
           resourceFields: {
            id: "resourceId",
            name: "resourceName",
            unit: "resourceUnit",
          },
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
          },
          addDialogFields: [
              { type: 'Resources' }
          ],
          toolbar: [ "Add", "Edit", "Update", "Delete", "Cancel", "ExpandAll", "CollapseAll"],
          height: "450px",
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        setTimeout(done, 1500);
        ganttObj.openAddDialog();
    });
  
    it("EJ2-48512-Add resources using add dialog", (done: Function) => {
      ganttObj.actionComplete = (args: any): void => {
        if (args.requestType === 'refresh') {
            ganttObj.viewType = 'ProjectView';
            ganttObj.dataBind();
          }
      };
      ganttObj.dataBound = (args: any): void => {
        if (ganttObj.viewType == 'ProjectView') {
            expect(ganttObj.currentViewData.length).toEqual(3);
        }
      };
      ganttObj.dataBind();
      setTimeout(done, 1500);
      let resourceCheckbox1: HTMLElement = document.querySelector("#" +
          ganttObj.element.id + "ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck") as HTMLElement;
      triggerMouseEvent(resourceCheckbox1, "click");
      let saveButton: HTMLElement = document.querySelector("#" + ganttObj.element.id +
          "_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat") as HTMLElement;
      triggerMouseEvent(saveButton, "click");
    });
});
  describe("CR issues", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
          dataSource: [
            {
              TaskID: 1,
              TaskName: "Project Initiation",
              StartDate: new Date("04/02/2019"),
              EndDate: new Date("04/21/2019"),
              subtasks: [
                {
                  TaskID: 2,
                  TaskName: "Identify Site location",
                  StartDate: new Date("04/02/2019"),
                  Duration: 6,
                  resources: [{ resourceId: 1, resourceUnit: 50 }],
                },
              ],
            },
          ],
          resources: [
            { resourceId: 1, resourceName: "Martin Tamer" },
            { resourceId: 2, resourceName: "Rose Fuller" },
            { resourceId: 3, resourceName: "Margaret Buchanan" },
          ],
          viewType: "ResourceView",
          enableMultiTaskbar: true,
          taskFields: {
            id: "TaskID",
            name: "TaskName",
            startDate: "StartDate",
            endDate: "EndDate",
            child: "subtasks",
            duration: "Duration",
            progress: "Progress",
            resourceInfo: "resources",
           },
           resourceFields: {
            id: "resourceId",
            name: "resourceName",
            unit: "resourceUnit",
          },
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
          },
          addDialogFields: [
              { type: 'Resources' }
          ],
          toolbar: [ "Add", "Edit", "Update", "Delete", "Cancel", "ExpandAll", "CollapseAll"],
          height: "450px",
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        ganttObj.viewType = 'ProjectView';
        setTimeout(done, 1500);
    });
    it("EJ2-48512-Issue on editing when view type changed", () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        ganttObj.treeGrid.saveCell();
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
      });    
  });
  describe("CR issues", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
          dataSource: [
            {
              TaskID: 1,
              TaskName: "Project Initiation",
              StartDate: new Date("04/02/2019"),
              EndDate: new Date("04/21/2019"),
              subtasks: [
                {
                  TaskID: 2,
                  TaskName: "Identify Site location",
                  StartDate: new Date("04/02/2019"),
                  Duration: 6,
                  resources: [{ resourceId: 1, resourceUnit: 50 }],
                },
              ],
            },
          ],
          resources: [
            { resourceId: 1, resourceName: "Martin Tamer" },
            { resourceId: 2, resourceName: "Rose Fuller" },
            { resourceId: 3, resourceName: "Margaret Buchanan" },
          ],
          viewType: "ResourceView",
          enableMultiTaskbar: true,
          taskFields: {
            id: "TaskID",
            name: "TaskName",
            startDate: "StartDate",
            endDate: "EndDate",
            child: "subtasks",
            duration: "Duration",
            progress: "Progress",
            resourceInfo: "resources",
           },
           resourceFields: {
            id: "resourceId",
            name: "resourceName",
            unit: "resourceUnit",
          },
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
          },
          addDialogFields: [
              { type: 'Resources' }
          ],
          toolbar: [ "Add", "Edit", "Update", "Delete", "Cancel", "ExpandAll", "CollapseAll"],
          height: "450px",
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        ganttObj.viewType = 'ProjectView';
        setTimeout(done, 1500);
    });
  
    it("dynamically changes project to resource view", (done) => {
       
        ganttObj.selectionModule.selectRows([1]);
        let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        triggerMouseEvent(deleteToolbar, 'click');
        let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog').getElementsByClassName('e-primary')[0] as HTMLElement;
        triggerMouseEvent(okElement, 'click');
        ganttObj.openEditDialog(1);
        setTimeout(done, 1500);      
        let resource: HTMLElement = document.querySelector('#e-item-' + ganttObj.element.id + '_Tab_1') as HTMLElement;
        triggerMouseEvent(resource, 'click');
        let resourceCheckbox1: HTMLElement = document.querySelector("#" +
            ganttObj.element.id + "ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck") as HTMLElement;
        triggerMouseEvent(resourceCheckbox1, "click");
        let saveButton: HTMLElement = document.querySelector("#" + ganttObj.element.id + "_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat") as HTMLElement;
        triggerMouseEvent(saveButton, "click");
        expect(ganttObj.currentViewData[0].ganttProperties.taskName).toBe("Project Initiation"); 
    });
  });
  describe("Virtualization in resource view", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
            dataSource: virtualResourceData,
            resources: editingResources,
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
            enableVirtualization: true,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            height:'450px'
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        setTimeout(done, 1000);
    });
  

    it("EJ2-49641-Ensuring over-allocation lines are rendered only for current view records", () => {
        expect(ganttObj.element.getElementsByClassName('e-rangecontainer')[0].children.length).toBe(5);
      });
  });
  
       describe("Add record using method", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
            dataSource: resourcesData,
            resources: resourceCollection,
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
              { field: 'Duration' }
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
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        setTimeout(done, 1000);
    });
  
    it("Add record", () => {
        let record: Object = {
            TaskID: 10,
            TaskName: 'Identify Site',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 50
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);
        expect(ganttObj.flatData.length).toBe(12);
    });
  });
 describe("CR issues", () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
            dataSource: multiTaskbarData,
            resources: multiResources,
            enableMultiTaskbar: true,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                expandState: 'isExpand',
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
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    beforeEach((done) => {
        setTimeout(done, 1500);
    });

    it("Left resizing the added record", () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'LeftResizing') {

                expect(ganttObj.currentViewData[4].ganttProperties.startDate).toEqual(ganttObj.currentViewData[5].ganttProperties.startDate);
                expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo.length).toBe(1);
                expect(ganttObj.currentViewData[5].ganttProperties.sharedTaskUniqueIds.length).toBe(1);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-collapse-parent > div:nth-child(3) > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
      });
    it('Right resizing the added record', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'RightResizing') {
                expect(ganttObj.currentViewData[4].ganttProperties.startDate).toEqual(ganttObj.currentViewData[5].ganttProperties.startDate);
                expect(ganttObj.currentViewData[4].ganttProperties.endDate).toEqual(ganttObj.currentViewData[7].ganttProperties.endDate);
                expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo.length).toBe(1);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-collapse-parent > div:nth-child(3) > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Taskbar drag action', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save' && args.taskBarEditAction === 'ChildDrag') {
                expect(ganttObj.currentViewData[4].ganttProperties.startDate).toEqual(ganttObj.currentViewData[5].ganttProperties.startDate);
                expect(ganttObj.currentViewData[4].ganttProperties.endDate).toEqual(ganttObj.currentViewData[7].ganttProperties.endDate);
                expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo.length).toBe(1);
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-collapse-parent > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
  });
      describe('Update end date using recource unit', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
        resources: resourceCollection,
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
    it('update resource unit', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(ganttObj.getFormatedDate(args.data.EndDate, 'M/dd/yyyy')).toBe('4/02/2019');
            }
        };
        ganttObj.dataBind();
        let data: Object = {
            TaskID: 3,
            TaskName: 'Updated by index value',
            resources: [
                {
                    resourceId: 2,
                    resourceName: 'Rose Fuller',
                    resourceUnit: 100,
                },
            ],
        };
        ganttObj.updateRecordByID(data);
    });
});
describe('Resource view with persistence', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
            resources: resourceCollection,
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
            enablePersistence: true,
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
    it('Enabled Persistence', () => {
       expect(ganttObj.currentViewData.length).toBe(13);
    });
});
   describe('Delete parent record in resource view', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
        resources: resourceCollection,
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
    it('delete parent record', () => {
        ganttObj.actionBegin = function (arg: any): void {
            if (arg.requestType == "beforeDelete") {
                expect(arg.data.length).toBe(3);  
            }
        };
        ganttObj.actionComplete = (arg: any): void => {
            if (arg.requestType == "delete") {
                expect(arg.data.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        let preventDefault: Function = new Function();
        ganttObj.selectionModule.selectRow(0);
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
    });
    });
     describe('Add record in resource view without child mapping', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [],
            resources: resourceCollection,
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
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 2;
        });
        it('Add new record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[0].taskData['Children'].length).toBe(1);
                }
            };
            ganttObj.dataBind();
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
    });
     describe('Check unassingned task dates resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
            resources: resourceCollection,
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
        it('delete Resource assigned record', () => {
            ganttObj.actionComplete = (arg: any): void => {
                if (arg.requestType == "delete") {
                    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[15].ganttProperties.startDate, 'M/dd/yyyy')).toBe('3/29/2019');
                    expect(ganttObj.currentViewData[17].ganttProperties.resourceInfo).toBe(null);
                }
            };
            ganttObj.dataBind();
            ganttObj.deleteRecord(2);
        });
    });
     describe('update tasklabel by updating datasource', () => {
        let ganttObj: Gantt;
        let multiTaskbarData: Object[] = [
            {
              PlanningId: 'aa657d87-4b5f-4f4f-de0f-08daf5585765',
              ActivityId: 'd82b2a52-b461-4f87-162e-08da0b5543a2',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 AB TESTE',
              Label: 'AB TESTE',
              BackgroundColor: '#383c48',
              obs: '',
              LabelColor: '#4ce96d',
              WorkerContract: null,
              StartDate: '2023-01-23T00:00:00.000Z',
              EndDate: null,
              Duration: 12960,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 12960,
                  StartDate: '2023-01-23T00:00:00.000Z',
                  EndDate: '2023-02-01T00:00:00.000Z',
                  Id: 'aa657d87-4b5f-4f4f-de0f-08daf5585765',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
            {
              PlanningId: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
              ActivityId: 'd987939b-06da-4461-88c4-08daf9444246',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 DuplicateFiles',
              Label: 'DuplicateFiles',
              BackgroundColor: null,
              obs: '',
              LabelColor: null,
              WorkerContract: null,
              StartDate: '2023-01-17T00:00:00.000Z',
              EndDate: null,
              Duration: 14399,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 14399,
                  StartDate: '2023-01-17T00:00:00.000Z',
                  EndDate: '2023-01-26T23:59:00.000Z',
                  Id: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
            {
              PlanningId: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
              ActivityId: 'c58144c0-a966-4742-a79f-08db03876317',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 New Activity',
              Label: '🛠 New Activity',
              BackgroundColor: null,
              obs: '',
              LabelColor: null,
              WorkerContract: null,
              StartDate: '2023-01-31T00:00:00.000Z',
              EndDate: null,
              Duration: 8640,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 8640,
                  StartDate: '2023-01-31T00:00:00.000Z',
                  EndDate: '2023-02-06T00:00:00.000Z',
                  Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
            {
              PlanningId: 'za36c7bd-52b2-490b-2f37-08db03884b34',
              ActivityId: 'z58144c0-a966-4742-a79f-08db03876317',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 New Activityz',
              Label: '🛠 New Activity',
              BackgroundColor: null,
              obs: '',
              LabelColor: null,
              WorkerContract: null,
              StartDate: '2023-01-31T00:00:00.000Z',
              EndDate: null,
              Duration: 8640,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 8640,
                  StartDate: '2023-01-31T00:00:00.000Z',
                  EndDate: '2023-02-06T00:00:00.000Z',
                  Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
          ];

          let multiTaskbarDataLess: Object[] = [
            {
              PlanningId: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
              ActivityId: 'd987939b-06da-4461-88c4-08daf9444246',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 DuplicateFiles',
              Label: 'DuplicateFiles',
              BackgroundColor: null,
              obs: '',
              LabelColor: null,
              WorkerContract: null,
              StartDate: '2023-01-17T00:00:00.000Z',
              EndDate: null,
              Duration: 14399,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 14399,
                  StartDate: '2023-01-17T00:00:00.000Z',
                  EndDate: '2023-01-26T23:59:00.000Z',
                  Id: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
            {
              PlanningId: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
              ActivityId: 'c58144c0-a966-4742-a79f-08db03876317',
              TaskId: '00000000-0000-0000-0000-000000000000',
              Name: '🛠 New Activity',
              Label: '🛠 New Activity',
              BackgroundColor: null,
              obs: '',
              LabelColor: null,
              WorkerContract: null,
              StartDate: '2023-01-31T00:00:00.000Z',
              EndDate: null,
              Duration: 8640,
              ParentId: '00000000-0000-0000-0000-000000000000',
              IsPlanningTask: false,
              childs: [],
              SegmentsFields: [
                {
                  Duration: 8640,
                  StartDate: '2023-01-31T00:00:00.000Z',
                  EndDate: '2023-02-06T00:00:00.000Z',
                  Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
                  IdSerie: null,
                  EnumPeriodRecord: 0,
                },
              ],
              Resources: [
                {
                  ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
                  ResourceName: '🙂 rsantos@endiprev.com',
                  ResourceGroup: null,
                  Department: 'Information Technology',
                  obs: '',
                  isExpand: true,
                  unit: 100,
                },
              ],
              EnumTypeRecords: 1,
              EnumStatusVacationTimeOff: 0,
            },
          ];

          let resources: object[] = [
            {
              ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
              ResourceName: '🙂 rsantos@endiprev.com',
              Department: 'Information Technology',
              obs: '',
              isExpand: true,
            },
          ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                showOverAllocation: true,
                allowReordering: true,
                allowSorting: true,
                allowResizing: true,
                collapseAllParentTasks: true,
                highlightWeekends: true,
                durationUnit: 'Minute',
                treeColumnIndex: 0,
                gridLines: 'Both',
                renderBaseline: false,
                allowExcelExport: true,           
                taskFields: {
                  id: 'PlanningId',
                  name: 'Name',
                  startDate: 'StartDate',
                  endDate: 'EndDate',
                  duration: 'Duration',
                  child: 'subelements',
                  segmentId: 'Id',
                  segments: 'SegmentsFields',
                  resourceInfo: 'Resources',
                },
                resourceFields: {
                  id: 'ResourceId',
                  name: 'ResourceName',
                },

                editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  allowTaskbarEditing: true,
                  showDeleteConfirmDialog: true,
                },
                columns: [
                  { field: 'Name', visible: true },
                  { field: 'StartDate', headerText: 'StartDate' },
                  { field: 'EndDate' },
                  { field: 'Duration', headerText: 'Group' },
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
                labelSettings: {
                  taskLabel: 'Name',
                },
                splitterSettings: {
                  columnIndex: 2,
                },
                actionBegin(args) {
                    if (args.requestType == 'beforeOpenAddDialog') {
                        args.cancel = true;
                        ganttObj.clearFiltering();
                        ganttObj.showSpinner();
                        ganttObj.dataSource = multiTaskbarDataLess;
                        ganttObj.projectStartDate = new Date('01/03/2023');
                        ganttObj.projectEndDate = new Date('02/29/2023');
                        ganttObj.resources = resources;
                    }
                },
                allowSelection: true,
                height: '450px',
                projectStartDate: new Date('01/03/2023'),
                projectEndDate: new Date('02/29/2023'),
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it ('update tasklabel by updating datasource', () => {
            ganttObj.actionComplete = (arg: any): void => {
                if (arg.requestType == "refresh") {
                    expect(ganttObj.getRowByIndex(1).getElementsByClassName('e-task-label')[0].innerHTML).toBe('🛠 DuplicateFiles');
                }
            };
            ganttObj.dataBind();
            ganttObj.openAddDialog();
        });
    });
    describe('Change resources and datasource simultaneously', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: multiResources,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    expandState: 'isExpand',
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Change datasource', () => {
            ganttObj.dataBound = (args: any) => {
                expect(ganttObj.currentViewData.length).toBe(12);
            };
            ganttObj.dataBind();
            let multiTaskbarData = [
                {
                    TaskID: 1,
                    TaskName: 'Project initiation',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 2,
                            TaskName: 'Identify site location',
                            StartDate: new Date('03/29/2019'),
                            Duration: 3,
                            Progress: 30,
                            work: 10,
                            resources: [{ resourceId: 1, resourceUnit: 50 }],
                        },
                        {
                            TaskID: 3,
                            TaskName: 'Perform soil test',
                            StartDate: new Date('04/03/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 70 }],
                            Predecessor: 2,
                            Progress: 30,
                            work: 20,
                        },
                        {
                            TaskID: 4,
                            TaskName: 'Soil test approval',
                            StartDate: new Date('04/09/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 25 }],
                            Predecessor: 3,
                            Progress: 30,
                            work: 10,
                        },
                    ],
                },
                {
                    TaskID: 5,
                    TaskName: 'Project estimation',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 6,
                            TaskName: 'Develop floor plan for estimation',
                            StartDate: new Date('04/01/2019'),
                            Duration: 5,
                            Progress: 30,
                            resources: [{ resourceId: 2, resourceUnit: 50 }],
                            work: 30,
                        },
                        {
                            TaskID: 7,
                            TaskName: 'List materials',
                            StartDate: new Date('04/04/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 2, resourceUnit: 40 }],
                            Predecessor: '6FS-2',
                            Progress: 30,
                            work: 40,
                        },
                        {
                            TaskID: 8,
                            TaskName: 'Estimation approval',
                            StartDate: new Date('04/09/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 2, resourceUnit: 75 }],
                            Predecessor: '7FS-1',
                            Progress: 30,
                            work: 60,
                        },
                    ],
                },
                {
                    TaskID: 9,
                    TaskName: 'Site work',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 10,
                            TaskName: 'Install temporary power service',
                            StartDate: new Date('04/01/2019'),
                            Duration: 14,
                            Progress: 30,
                            resources: [{ resourceId: 3, resourceUnit: 75 }],
                        },
                        {
                            TaskID: 11,
                            TaskName: 'Clear the building site',
                            StartDate: new Date('04/08/2019'),
                            Duration: 9,
                            Progress: 30,
                            Predecessor: '10FS-9',
                            resources: [3],
                        },
                        {
                            TaskID: 12,
                            TaskName: 'Sign contract',
                            StartDate: new Date('04/12/2019'),
                            Duration: 5,
                            resources: [3],
                            Predecessor: '11FS-5',
                        },
                    ],
                }
            ];
            let resources = [
                {
                    resourceId: 1,
                    resourceName: 'Martin Tamer',
                    resourceGroup: 'Planning Team',
                    isExpand: false,
                },
                {
                    resourceId: 2,
                    resourceName: 'Rose Fuller',
                    resourceGroup: 'Testing Team',
                    isExpand: true,
                },
                {
                    resourceId: 3,
                    resourceName: 'Margaret Buchanan',
                    resourceGroup: 'Approval Team',
                    isExpand: false,
                }
            ];
            ganttObj.resources = resources;
            ganttObj.dataSource = multiTaskbarData;
        });
    });
     describe('Incorrect duration for parent task in hour mode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
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
                durationUnit: 'Hour',
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
                enablePersistence: true,
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
        it('check duration value for parent task', () => {
           expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(7);
        });
    });
});
describe('Change resources and datasource simultaneously', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: multiResources,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    expandState: 'isExpand',
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Change datasource', () => {
            ganttObj.dataBound = (args: any) => {
                expect(ganttObj.currentViewData.length).toBe(12);
            };
            ganttObj.dataBind();
            let multiTaskbarData = [
                {
                    TaskID: 1,
                    TaskName: 'Project initiation',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 2,
                            TaskName: 'Identify site location',
                            StartDate: new Date('03/29/2019'),
                            Duration: 3,
                            Progress: 30,
                            work: 10,
                            resources: [{ resourceId: 1, resourceUnit: 50 }],
                        },
                        {
                            TaskID: 3,
                            TaskName: 'Perform soil test',
                            StartDate: new Date('04/03/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 70 }],
                            Predecessor: 2,
                            Progress: 30,
                            work: 20,
                        },
                        {
                            TaskID: 4,
                            TaskName: 'Soil test approval',
                            StartDate: new Date('04/09/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 25 }],
                            Predecessor: 3,
                            Progress: 30,
                            work: 10,
                        },
                    ],
                },
                {
                    TaskID: 5,
                    TaskName: 'Project estimation',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 6,
                            TaskName: 'Develop floor plan for estimation',
                            StartDate: new Date('04/01/2019'),
                            Duration: 5,
                            Progress: 30,
                            resources: [{ resourceId: 2, resourceUnit: 50 }],
                            work: 30,
                        },
                        {
                            TaskID: 7,
                            TaskName: 'List materials',
                            StartDate: new Date('04/04/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 2, resourceUnit: 40 }],
                            Predecessor: '6FS-2',
                            Progress: 30,
                            work: 40,
                        },
                        {
                            TaskID: 8,
                            TaskName: 'Estimation approval',
                            StartDate: new Date('04/09/2019'),
                            Duration: 4,
                            resources: [{ resourceId: 2, resourceUnit: 75 }],
                            Predecessor: '7FS-1',
                            Progress: 30,
                            work: 60,
                        },
                    ],
                },
                {
                    TaskID: 9,
                    TaskName: 'Site work',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 10,
                            TaskName: 'Install temporary power service',
                            StartDate: new Date('04/01/2019'),
                            Duration: 14,
                            Progress: 30,
                            resources: [{ resourceId: 3, resourceUnit: 75 }],
                        },
                        {
                            TaskID: 11,
                            TaskName: 'Clear the building site',
                            StartDate: new Date('04/08/2019'),
                            Duration: 9,
                            Progress: 30,
                            Predecessor: '10FS-9',
                            resources: [3],
                        },
                        {
                            TaskID: 12,
                            TaskName: 'Sign contract',
                            StartDate: new Date('04/12/2019'),
                            Duration: 5,
                            resources: [3],
                            Predecessor: '11FS-5',
                        },
                    ],
                }
            ];
            let resources = [
                {
                    resourceId: 1,
                    resourceName: 'Martin Tamer',
                    resourceGroup: 'Planning Team',
                    isExpand: false,
                },
                {
                    resourceId: 2,
                    resourceName: 'Rose Fuller',
                    resourceGroup: 'Testing Team',
                    isExpand: true,
                },
                {
                    resourceId: 3,
                    resourceName: 'Margaret Buchanan',
                    resourceGroup: 'Approval Team',
                    isExpand: false,
                }
            ];
            ganttObj.resources = resources;
            ganttObj.dataSource = multiTaskbarData;
        });
    });
describe('Incorrect duration for parent task in hour mode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
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
                durationUnit: 'Hour',
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
                enablePersistence: true,
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
        it('check duration value for parent task', () => {
           expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(7);
        });
    });
    describe('EJ-826577-ResourceView without child mapping property', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
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
                    {
                        TaskID: 5,
                        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
                            },
                            {
                                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
                            },
                            {
                                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
                            },
                            {
                                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                                Duration: 4, Progress: 30, resources: [4]
                            },
                            {
                                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                                Progress: 30, Predecessor: '9SS', resources: [3]
                            },
                            {
                                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                                Duration: 3, resources: [2]
                            },
                            {
                                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                                Duration: 4, Progress: 30, resources: [3]
                            }
                        ]
                    },
                    {
                        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
                        Progress: 30,
                    }
                ],
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
                    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
                    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
                    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
                ],
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    expandState: 'isExpand',
                    resourceInfo: 'resources',
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        it('without child map property in Resource view', () => {
        if(ganttObj.taskFields.child === null){
            expect(ganttObj.currentViewData[6].ganttProperties.taskName).toBe('Unassigned Task'); 
        }
        });
        it('check currentViewData length', () => {
            expect(ganttObj.currentViewData.length).toBe(10);
        });
    });
describe('Render multitaskbar with virtualization', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: multiResources,
                enableVirtualization: true,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    expandState: 'isExpand',
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Multitaskbar with virtualization', () => {
           expect((ganttObj.chartRowsModule.ganttChartTableBody.childNodes[0] as Element).getElementsByClassName('e-taskbar-main-container').length).toBe(3);
        });
    });
let sampleData: object[] = [
        { TaskID: 11, TaskName: 'Parent' },
        {
          TaskID: 12,
          TaskName: 'Article #5678567',
          parentId: 11,
          StartDate: new Date('02/13/2023'),
          EndDate: new Date('02/28/2023'),
          Segments: [
            {
              StartDate: new Date('02/13/2023'),
              EndDate: new Date('02/18/2023'),
              projectName: 'Topology 2-1'
            },
            {
              StartDate: new Date('02/20/2023'),
              EndDate: new Date('02/28/2023'),
              projectName: 'Topology 2-2'
            }
          ]
        },
        { TaskID: 13, TaskName: 'Child of FIRST 2', parentId: 11 },
        { TaskID: 14, TaskName: 'Child of FIRST 3', parentId: 11 },
        { TaskID: 15, TaskName: 'NEXT' },
        { TaskID: 16, TaskName:'Child of NEXT 1', parentId: 15 },
        { TaskID: 17, TaskName: 'Child of NEXT 2', parentId: 15 },
        { TaskID: 14, TaskName: 'Child of FIRST 4', parentId: 11 },
        { TaskID: 16, TaskName: 'Child of NEXT 3', parentId: 15 }
          ];
describe('Bug-829910-Incorrect render of segments', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource:sampleData ,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentId',
                segments: 'Segments',
            },
            splitterSettings: {
                columnIndex: 3
            },
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
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
                { field: 'StartDate' },
                { field: 'Progress' },
                { field: 'Duration' },
            ],
            includeWeekend: true,
            gridLines: 'Both',
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px',
            projectStartDate: new Date('01/28/2023'),
            projectEndDate: new Date('05/18/2023')
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
    it('Checking that the segments start and end date values are appropriately rendered', () => {

    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.segments[0].startDate,'M/dd/yyyy')).toEqual('2/13/2023');
    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.segments[0].endDate,'M/dd/yyyy')).toEqual('2/18/2023');
    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.segments[1].startDate,'M/dd/yyyy')).toEqual('2/20/2023');
    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.segments[1].endDate,'M/dd/yyyy')).toEqual('2/28/2023');
    });
});
