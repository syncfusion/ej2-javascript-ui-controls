import { ContextMenuClickEventArgs } from './../../src/gantt/base/interface';
import { GanttModel } from './../../src/gantt/base/gantt-model.d';
import { Gantt, Edit, Selection, ContextMenu, Sort } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
describe('Context-', () => {
    Gantt.Inject(Edit, Selection, ContextMenu, Sort);
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
            allowTaskbarEditing: true
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
        it('Rendering', () => {
            let cmenuId: string = ganttObj.element.id + '_contextmenu';
            expect((ganttObj.contextMenuModule as any).element.id).toBe(cmenuId);
            let contextmenu: HTMLElement = document.getElementById(cmenuId);
            expect(contextmenu.style.display).toBe('block');
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
        it('Add record', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(42);
        });
        it('Convert to Milestone', () => {
            (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[2];
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isMilestone).toBeTruthy;
            expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(0);
        });
        it('Task Information', () => {
            ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                expect(args.item.text).toEqual('Task Information');
            }
            ganttObj.dataBind();
            let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
            triggerMouseEvent(taskInfo, 'click');
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
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
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
        it('To Task', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[5].ganttProperties.isMilestone).toBeFalsy;
            expect(ganttObj.currentViewData[5].ganttProperties.duration).toBe(1);
        });
        it('Delete Depedency', () => {
            let e = {
                item: ganttObj.contextMenuModule.contextMenu.items[3].items[0],
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toEqual('4FS,5FS');
        });
        it('Destroy', () => {
            ganttObj.contextMenuModule.destroy();
            let cmenuId: string = ganttObj.element.id + '_contextmenu';
            let contextmenu: HTMLElement = document.getElementById(cmenuId);
            expect(contextmenu).toBeNull();

        });
    });
});
