import { ContextMenuClickEventArgs, IGanttData, ITaskData, ContextMenuOpenEventArgs} from './../../src/gantt/base/interface';
import { GanttModel } from './../../src/gantt/base/gantt-model.d';
import { Gantt, Edit, Selection, ContextMenu, Sort, Resize, RowDD, ContextMenuItem} from '../../src/index';
import { projectData1, scheduleModeData, selfReference, splitTasksData, selfData, editingData} from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
let contextMenuItems: (string | ContextMenuItemModel)[] = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
        'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert',
        { text: 'Collapse the Row', target: '.e-content', id: 'collapserow' } as ContextMenuItemModel,
        { text: 'Expand the Row', target: '.e-content', id: 'expandrow' } as ContextMenuItemModel,
        { text: 'Hide Column', target: '.e-gridheader', id: 'hidecols' } as ContextMenuItemModel,
    ];
interface EJ2Instance extends HTMLElement {
     ej2_instances: Object[];
 }
describe('Context-', () => {
    Gantt.Inject(Edit, Selection, ContextMenu, RowDD, Sort, Resize);
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
    let selfGanttModel: GanttModel = {
        dataSource: selfReference,
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
            parentID: 'parentID',
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
    describe('Content menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(selfGanttModel, done);
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
        it('indent record', () => {
            ganttObj.selectionModule.selectRow(8);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(16);
            let indent: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Indent' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
            expect((ganttObj.flatData[10] as IGanttData).taskData[ganttObj.taskFields.id]).toBe(10);
        });
    });
    describe('Indent and adding record -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(selfGanttModel, done);
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
        it('indent record', () => {
            ganttObj.selectionModule.selectRow(8);
            let indent: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Indent' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect((ganttObj.flatData[8] as IGanttData).childRecords.length).toBe(1);
        });
    });
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
        // it('Add record - Above', () => {
        //      let e: ContextMenuClickEventArgs = {
        //          item: { id: ganttObj.element.id + '_contextMenu_Above' },
        //          element: null,
        //      };
        //      (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //      expect(ganttObj.currentViewData.length).toBe(44);
        //  });
        
        //  it('Convert to Milestone', () => {
        //      (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[6];
        //      let e: ContextMenuClickEventArgs = {
        //          item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
        //          element: null,
        //      };
        //      (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //      expect(ganttObj.currentViewData[6].ganttProperties.isMilestone).toBeTruthy;
        //      expect(ganttObj.currentViewData[6].ganttProperties.duration).toBe(0);
        //  });
      
        //  it('Converting empty task to Milestone', (done: Function) => {
        //      (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[43];
        //      let e: ContextMenuClickEventArgs = {
        //          item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
        //          element: null,
        //      };
        //      (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        //      let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(44) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
        //      triggerMouseEvent(taskbarElement, 'mouseover', 50);
        //      expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Final Delivery</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">2/1/2017</td></tr></tbody></table>');
        //      done();
        //  });
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
        it('Add record - Milestone', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(43);
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
        it('Task Information', () => {       
             ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                 expect(args.item.text).toEqual('Task Information');
             }
             ganttObj.dataBind();
             let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
             triggerMouseEvent(taskInfo, 'click');
             let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
             triggerMouseEvent(cancelRecord, 'click');
         });
    });
     describe('Content menu -', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
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
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
          it('To Task', () => {
              let e: ContextMenuClickEventArgs = {
                  item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
                  element: null,
              };
              (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
              expect(ganttObj.currentViewData[7].ganttProperties.isMilestone).toBeFalsy;
              expect(ganttObj.currentViewData[7].ganttProperties.duration).toBe(1);
          });
          it('Delete Depedency', (done: Function) => {
              let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
              triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
              let e = {
                  item: ganttObj.contextMenuModule.contextMenu.items[3].items[0],
              };
              (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
              expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toEqual('4FS,5FS');
              done();
          });
         it('Save & Cancel', (done: Function) => {
            let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)');
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
            expect(ganttObj.currentViewData.length).toBe(40);
            done();
        });
        it('Add record Without rowposition and empty data', () => {
            let data:object = { TaskID: 67,
                TaskName: 'New task',
                Duration: 3,
                Progress: 80,
            };
            ganttObj.editModule.addRecord(data,'Top',0);
            expect(ganttObj.dataSource['length']).toBe(2);
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
    
     describe('Modifying segments using custom context menu', () => {
        let ganttObj: Gantt;
        let contextMenuItems: (string | ItemModel)[] = [
            { text: 'Delete Resource', target: '.e-content', id: 'deleterow' } as ItemModel];
        let editingResources = [
            { resourceId: 1, resourceName: 'Martin Tamer' },
            { resourceId: 2, resourceName: 'Rose Fuller' },
            { resourceId: 3, resourceName: 'Margaret Buchanan' },
            { resourceId: 4, resourceName: 'Fuller King' },
            { resourceId: 5, resourceName: 'Davolio Fuller' },
            { resourceId: 6, resourceName: 'Van Jack' },
            { resourceId: 7, resourceName: 'Fuller Buchanan' },
            { resourceId: 8, resourceName: 'Jack Davolio' },
            { resourceId: 9, resourceName: 'Tamer Vinet' },
            { resourceId: 10, resourceName: 'Vinet Fuller' },
            { resourceId: 11, resourceName: 'Bergs Anton' },
            { resourceId: 12, resourceName: 'Construction Supervisor' }
        ];
        let editingData: Object[] = [
            {
                TaskID: 1,
                TaskName: 'Project Initiation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50,
                        Segments: [
                            { StartDate: new Date("04/02/2019"), Duration: 2 },
                            { StartDate: new Date("04/04/2019"), Duration: 2 }
                        ],
                        resources: [{ resourceId: 1, resourceUnit: 50 }]
                    },
                    { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, resources: [{ resourceId: 2, resourceUnit: 70 }] },
                    { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, resources: [{ resourceId: 3, resourceUnit: 25 }, { resourceId: 1, resourceUnit: 75 }] },
                ]
            }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
                    resources: editingResources,
                    contextMenuItems: contextMenuItems as ContextMenuItem[],
                    enableContextMenu: true,
                    viewType: 'ResourceView',
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName'
                    },
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
                        segments: 'Segments',
                        resourceInfo: 'resources',
                    },
                    labelSettings: {
                        taskLabel: 'resources'
                    },
                    allowSelection: true,
                    gridLines: "Both",
                    height: "450px",
                    treeColumnIndex: 1
                }, done);
        });
        it('Custom context menu', () => {
            ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                var record = args.rowData;
                let data: any = {
                    Duration: record.taskData['Duration'],
                    EndDate: record.taskData['EndDate'],
                    Progress: record.taskData['Progress'],
                    StartDate: record.taskData['StartDate'],
                    TaskID: record.taskData['TaskID'],
                    TaskName: record.taskData['TaskName'],
                    resources: [],
                    Segments: []
                };
                ganttObj.updateRecordByID(data);
                expect(ganttObj.currentViewData[16]['Segments'].length).toBe(0);
                expect(ganttObj.currentViewData[16].ganttProperties.segments).toBe(null);
            }
            ganttObj.dataBind();
            ganttObj.contextMenuModule['rowData'] = ganttObj.currentViewData[1];
            let taskInfo: HTMLElement = document.getElementById('deleterow');
            triggerMouseEvent(taskInfo, 'click');
        });

        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('Content menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Project Schedule',
                        StartDate: new Date('02/06/2017'),
                        EndDate: new Date('03/13/2017'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Planning',
                                StartDate: new Date('02/06/2017'),
                                EndDate: new Date('02/10/2017'),
                            },
                            {
                                TaskID: 3, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                                Duration: 5, Progress: '100', ResourceId: [1]
                            }
                        ]
                }],
                allowSelection: true,
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
                    allowAdding: true
                },
                toolbar: ['Add', 'Edit', 'Delete'],
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
      
         it('Adding record in immutable mode', () => {
            ganttObj.enableImmutableMode = true;
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            ganttObj.selectRow(2);
            let milestone: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(milestone);
            expect(ganttObj.currentViewData[4]['TaskID']).toBe(5);
        });
    });
      describe('Context menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
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
                    columns: [
                        { field: 'TaskID', width: 60 },
                        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                        { field: 'StartDate' },
                        { field: 'EndDate' },
                        { field: 'Duration' },
                        { field: 'Progress' },
                        { field: 'Predecessor' }
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    splitterSettings: {
                        columnIndex: 2
                    },
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: '${Progress}%'
                    },
                    projectStartDate: new Date('01/30/2019'),
                    projectEndDate: new Date('03/04/2019')
                }, done);
        });
        it('Convert  to milestone', () => {
            (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[2];
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isMilestone).toBeTruthy;
        });
        it('merge Task', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Right' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4]['EndDate'], 'MM/dd/yyyy')).toBe('02/15/2019');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('Context menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
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
                    timelineSettings: {
                        timelineViewMode: 'Year',
                        timelineUnitSize: 500
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', width: 60 },
                        {
                            field: 'TaskName',
                            headerText: 'Job Name',
                            width: '250',
                            clipMode: 'EllipsisWithTooltip'
                        },
                        { field: 'StartDate' },
                        { field: 'EndDate' },
                        { field: 'Duration' },
                        { field: 'Progress' },
                        { field: 'Predecessor' }
                    ],
                    toolbar: [
                        'Add',
                        'Edit',
                        'Update',
                        'Delete',
                        'Cancel',
                        'ExpandAll',
                        'CollapseAll'
                    ],
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    splitterSettings: {
                        columnIndex: 2
                    },
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: '${Progress}%'
                    }
                }, done);
        });
        it('Add record for splittask- Below', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[3].ganttProperties.segments[0].width).not.toBe(0);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
    });
         describe('Schedule mode Custom', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: splitTasksData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    child: 'subtasks',
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
                }
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
        it('Changing Custom taskmode of a task to manual', (done: Function) => {
            expect(ganttObj.currentViewData[2].ganttProperties.isAutoSchedule).toBe(true);
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            expect(document.getElementsByClassName('e-editedbatchcell').length).toBe(1);
            setTimeout(done, 500);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Manual' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isAutoSchedule).toBe(false);
        });
    });
    
     describe('Content menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
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
                    allowAdding: true
                },
                enableContextMenu: true,
                allowRowDragAndDrop: true,
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 500);
        });
      
         it('Drag and drop after adding record as child Position', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            ganttObj.reorderRows([3], 4, 'child');
            setTimeout(() => {
                expect(ganttObj.flatData[4]['TaskID']).toBe(42);
            }, 100);
        });
    });
    
      describe('Content menu -', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
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
            }, done);
        });
          it('To milestone', () => {
            let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)');
            record.innerText = null;
            (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[2];
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isMilestone).toBeTruthy;
          });
          afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('Context_Menu - Unscheduled_Task', () => {
        let ganttObj: Gantt;
        let contextMenuItems: (string | ItemModel)[] = [
            'AutoFitAll','AutoFit','TaskInformation','DeleteTask','Save','Cancel','SortAscending','SortDescending','Add',
            'DeleteDependency','Convert','Indent','Outdent',
            {
              text: 'Collapse the Row',target: '.e-content',id: 'collapserow'
            } as ItemModel,
            { text: 'Expand the Row', target: '.e-content', id: 'expandrow' } as ItemModel
          ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: selfData,
                height: '450px',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID'
                },
                allowUnscheduledTasks: true,
                columns: [
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
                { field: 'predecessor' },
                { field: 'progress' }
            ],
            allowSorting: true,
            allowRowDragAndDrop: true,
            editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              allowTaskbarEditing: true,
              showDeleteConfirmDialog: true
            },
            enableContextMenu: true,
            labelSettings: {
              leftLabel: 'taskName'
            },
            projectStartDate: new Date('01/28/2019'),
            projectEndDate: new Date('03/10/2019')
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
        it('unscheduled task', () => {
            expect(ganttObj.element.getElementsByClassName('e-taskbar-main-container')[3].children[1].classList.contains('e-gantt-unscheduled-taskbar')).toBe(true);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextmenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isMilestone).toBeTruthy;
        });
        it('disable prevTimespan when adding child for unscheduledTasks', function () {
            expect(ganttObj.element.getElementsByClassName('e-timeline-top-header-cell')[0].getAttribute('aria-label').indexOf('Timeline cell 1/28/2019') > -1).toBeTruthy();
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextmenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.element.getElementsByClassName('e-timeline-top-header-cell')[0].getAttribute('aria-label').indexOf('Timeline cell 1/28/2019') > -1).toBeTruthy();
        });
    });
    describe('Context Menu - selection false', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: editingData,
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  endDate: 'EndDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  dependency: 'Predecessor'
                },
                editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  allowTaskbarEditing: true,
                  showDeleteConfirmDialog: true
                },
                splitterSettings: {
                  columnIndex: 2
                },
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                contextMenuItems: menuItem,
                toolbar: ['Add','Edit','Update','Delete','Cancel','ExpandAll','CollapseAll'],
                allowSelection: false
            },done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Hide indent and outdent when selection is set to false', () => {
            expect(ganttObj.selectionModule).toBe(undefined);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
    });
    describe('Hide Context Menu Items', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: editingData,
                allowSorting: true,
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
                editSettings : {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                contextMenuItems: [{ id: 'testMenuItem' }  as ItemModel, 'DeleteDependency'] as ContextMenuItem[],
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                projectStartDate : new Date('03/25/2019'),
                projectEndDate : new Date('07/28/2019'),
                contextMenuClick(args?: ContextMenuClickEventArgs): void {},
                contextMenuOpen(args?: ContextMenuOpenEventArgs): void {
                let record: IGanttData = args.rowData;
                if (args.type !== 'Header') {
                  let testItem = args.items.find(
                    (menuItem) => menuItem.id === 'testMenuItem'
                  );
                  testItem.text = 'Test';
                  testItem.items = [{}];
                  let menuObj : any = (<EJ2Instance>document.getElementById(ganttObj.element.id +'_contextmenu')).ej2_instances[0] as ContextMenu; 
                  menuObj.dataBind();
                  menuObj.enableItems([testItem.text], false, false);
                }
              }
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
        it('disable Items', () => {
            let selectRow: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent(selectRow, 'contextmenu', 0, 0, false, false, 2);
            let menu: HTMLElement = document.getElementById('testMenuItem') as HTMLElement;
            expect(menu.classList.contains('e-disabled')).toBe(true);
        });
    });
    describe('Context menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
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
                    toolbar: ['Add','Edit','Update','Delete','Cancel','ExpandAll','CollapseAll'],
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
            let ganttElement: HTMLElement = document.querySelector('#'+ ganttObj.element.id) as HTMLElement;
            ganttElement.style.marginLeft = '350px';
            ganttObj.splitTask(4, new Date('02/04/2019'));
            let segment : HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar > div') as HTMLElement;
            triggerMouseEvent(segment, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_SplitTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[3].ganttProperties.segments.length).toBe(2);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
    });
    describe('Custom context menu items', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
        allowDeleting: true
    },
    enableContextMenu: true,
    allowSorting: true,
    allowResizing: true,
    contextMenuItems: contextMenuItems as ContextMenuItem[],
    contextMenuClick: (args?: ContextMenuClickEventArgs) => {
      
        let record = args.rowData;
        if (args.item.id === 'collapserow') {
            ganttObj.collapseByID(Number(record.ganttProperties.taskId));
        }
        if (args.item.id === 'expandrow') {
            ganttObj.expandByID(Number(record.ganttProperties.taskId));
        }
        if (args.item.id === 'hidecols') {
            ganttObj.hideColumn(args.column.headerText);
        }
    },
    contextMenuOpen: (args?: ContextMenuOpenEventArgs) => {
        args.disableItems = [
            'Task Information',
            'Delete Task',
            'Add',
            'Delete Dependency',
            'Convert',
            'Indent',
            'Outdent',
            'Collapse the Row',
      
          ];
        let record = args.rowData;
        if (args.type !== 'Header') {
            if (!record.hasChildRecords) {
                args.hideItems.push('Collapse the Row');
                args.hideItems.push('Expand the Row');
            } else {
                if(record.expanded){
                    args.hideItems.push("Expand the Row");
                } else {
                    args.hideItems.push("Collapse the Row");
                }
            }
        }
    }
    }, done);
        });
       afterAll(() => {
            destroyGantt(ganttObj);
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
    });
});
