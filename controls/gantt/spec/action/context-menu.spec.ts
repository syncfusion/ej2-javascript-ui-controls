import { ContextMenuClickEventArgs } from './../../src/gantt/base/interface';
import { GanttModel } from './../../src/gantt/base/gantt-model.d';
import { Gantt, Edit, Selection, ContextMenu, Sort, Resize } from '../../src/index';
import { projectData1, scheduleModeData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
describe('Context-', () => {
    Gantt.Inject(Edit, Selection, ContextMenu, Sort, Resize);
    let ganttObj: Gantt;
    let menuItem: any = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
        'TaskInformation', 'Add', 'DeleteTask', 'DeleteDependency', 'Convert', 'Save', 'Cancel',
        { separator: true }, {
            separator: true,
            display: 'Header'
        },
        {
            text: 'Collapse Row',
            id: 'collapserow',
        },
        {
            text: 'Expand Row',
            id: 'expandrow',
            display: 'Content'
        },
        {
            text: 'Hide Column',
            id: 'hideColumn',
            display: 'Header'
        }
    ];
    let ganttModel: GanttModel = {
        dataSource: projectData1,
        allowSelection: true,
        allowResizing: true,
        allowSorting: true,
        enableContextMenu: true,
        contextMenuItems: menuItem,
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
        toolbar: ['Add', 'Edit', 'Delete'],
        projectStartDate: new Date('02/01/2017'),
        projectEndDate: new Date('12/30/2017'),
        rowHeight: 40,
        taskbarHeight: 30,
    };
    describe('header menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let taskName: HTMLElement = ganttObj.element.querySelectorAll('.e-headercell')[1] as HTMLElement;
            triggerMouseEvent(taskName, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
        it('Empty', function (done: Function) {
            expect(true).toBeTruthy();
            done();
        });
        it('Rendering', () => {
            let contextmenu: HTMLElement = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrol_cmenu');
            expect(contextmenu.style.display).toBe('block');
        });
        it('Sorting', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == 'sorting') {
                    expect(args.requestType).toEqual('sorting');
                }
            };
            ganttObj.dataBind();
            let sortID: string = 'treeGrid' + ganttObj.element.id + '_gridcontrol_cmenu_SortDescending';
            let sortElement: HTMLElement = document.getElementById(sortID);
            triggerMouseEvent(sortElement, 'click');
        });
        it('AutoFit', () => {
            let AutoFit: string = 'treeGrid' + ganttObj.element.id + '_gridcontrol_cmenu_AutoFit';
            let element: HTMLElement = document.getElementById(AutoFit);
            let hasClass: boolean = element.classList.contains('e-disabled');
            expect(hasClass).toBeFalsy();
        });
        it('Custom items', () => {
            let element: HTMLElement = document.getElementById('hideColumn');
            expect(element).toBeDefined();
        });
    });
    describe('Content menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
        it('Empty', (done: Function) => {
            expect(true).toBeTruthy();
            done();
        });
        it('Rendering', () => {
            let cmenuId: string = ganttObj.element.id + '_contextmenu';
            expect((ganttObj.contextMenuModule as any).element.id).toBe(cmenuId);
            let contextmenu: HTMLElement = document.getElementById(cmenuId);
         // expect(contextmenu.style.display).toBe('block');
        });
        it('Parent record', () => {
            let eventArgs = { target: ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement };
            let e = {
                event: eventArgs,
                items: ganttObj.contextMenuModule.contextMenu.items
            };
            (ganttObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((ganttObj.contextMenuModule as any).hideItems.length).toBe(8);
            expect((ganttObj.contextMenuModule as any).disableItems.length).toBe(0);
        });
        it('Add record - Below', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(42);
        });
        // it('Add record - Above', (done: Function) => {
        //     let e: ContextMenuClickEventArgs = {
        //         item: { id: ganttObj.element.id + '_contextMenu_Above' },
        //         element: null,
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     expect(ganttObj.currentViewData.length).toBe(43);
        //     done();
        // });
        // it('Convert to Milestone', (done: Function) => {
        //     (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[1];
        //     let e: ContextMenuClickEventArgs = {
        //         item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
        //         element: null,
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     expect(ganttObj.currentViewData[1].ganttProperties.isMilestone).toBeTruthy;
        //     expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
        //     done();
        // });
        // it('Add record - Milestone', () => {
        //     let e: ContextMenuClickEventArgs = {
        //         item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
        //         element: null,
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     expect(ganttObj.currentViewData.length).toBe(44);
        // });
        // it('Converting empty task to Milestone', (done: Function) => {
        //     (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[43];
        //     let e: ContextMenuClickEventArgs = {
        //         item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
        //         element: null,
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(44) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
        //     triggerMouseEvent(taskbarElement, 'mouseover', 50);
        //     expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Final Delivery</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">2/1/2017</td></tr></tbody></table>');
        //     done();
        // });
        // it('Task Information', () => {
        //     ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
        //         expect(args.item.text).toEqual('Task Information');
        //     }
        //     ganttObj.dataBind();
        //     let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
        //     triggerMouseEvent(taskInfo, 'click');
        //     let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancelRecord, 'click');
        // });
    });
    describe('Content menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
        // it('To Task', () => {
        //     let e: ContextMenuClickEventArgs = {
        //         item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
        //         element: null,
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     expect(ganttObj.currentViewData[7].ganttProperties.isMilestone).toBeFalsy;
        //     expect(ganttObj.currentViewData[7].ganttProperties.duration).toBe(1);
        // });
        // it('Delete Depedency', (done: Function) => {
        //     let e = {
        //         item: ganttObj.contextMenuModule.contextMenu.items[3].items[0],
        //     };
        //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //     expect(ganttObj.currentViewData[7].ganttProperties.predecessorsName).toEqual('4FS,5FS');
        //     done();
        // });
        it('Save & Cancel', (done: Function) => {
            let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)');
            triggerMouseEvent(record, 'dblclick');
            let e1: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Save' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e1);
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toEqual('Planning');
            triggerMouseEvent(record, 'dblclick');
            let e2: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Cancel' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e2);
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toEqual('Planning');
            done();
        });
        it('Delete Record', (done:Function) => {
            let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)');
            triggerMouseEvent(record, 'click');
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_DeleteTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            let ok: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog > div.e-footer-content > button');
            triggerMouseEvent(ok, 'click');
            expect(ganttObj.currentViewData.length).toBe(41);
            done();
        });
        it('Destroy', () => {
            ganttObj.contextMenuModule.destroy();
            let cmenuId: string = ganttObj.element.id + '_contextmenu';
            let contextmenu: HTMLElement = document.getElementById(cmenuId);
            expect(contextmenu).toBeNull();

        });
    });
    describe('Context menu - spec coverage -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Disable editing', () => {
            ganttObj.editSettings.allowEditing = false;
            ganttObj.editSettings.allowAdding = false;
            ganttObj.editSettings.allowDeleting = false;
            ganttObj.editModule.destroy();
            ganttObj.dataBind();
            let $tr: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-Child(5) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
            expect(taskInfo.classList.contains('e-disabled')).toEqual(true);
        });
    });
    describe('Schedule mode', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: scheduleModeData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                enableContextMenu: true,
                splitterSettings: {
                    columnIndex: 8
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
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
        it('Changing taskmode of a task to manual', (done: Function) => {
            expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(true);
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Manual' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(false);
        });
        it('Changing taskmode of a task to auto', (done: Function) => {
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/26/2017');
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Auto' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
        });
    });
});
