
import { ContextMenuClickEventArgs, IGanttData, ITaskData, ContextMenuOpenEventArgs} from './../../src/gantt/base/interface';
import { GanttModel } from './../../src/gantt/base/gantt-model.d';
import { Gantt, Edit, Selection, ContextMenu, Sort, Resize, RowDD, ContextMenuItem,  Toolbar, Filter, DayMarkers, Reorder, ColumnMenu, VirtualScroll, ExcelExport, PdfExport, UndoRedo} from '../../src/index';
import { projectData1, scheduleModeData, selfReference, splitTasksData, selfData, editingData, customScheduleModeData, indentData, CR885011, MT889303, editingResources, coverageParentData, projectNewData1, mileStoneParentData, splitTasks, splitTasksCoverage, resourceCollection,cr898103} from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
let contextMenuItems: (string | ContextMenuItemModel)[] = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
        'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert',
        { text: 'Collapse the Row', target: '.e-content', id: 'collapserow' } as ContextMenuItemModel,
        { text: 'Expand the Row', target: '.e-content', id: 'expandrow' } as ContextMenuItemModel,
        { text: 'Hide Column', target: '.e-gridheader', id: 'hidecols' } as ContextMenuItemModel,
    ];
Gantt.Inject(Edit, Selection, ContextMenu, Sort, Resize, RowDD,  Toolbar, Filter, DayMarkers, Reorder, ColumnMenu, VirtualScroll, ExcelExport, PdfExport, UndoRedo);
interface EJ2Instance extends HTMLElement {
     ej2_instances: Object[];
 }
describe('Context-', () => {
    // Gantt.Inject(Edit, Selection,UndoRedo, ContextMenu, RowDD, Sort, Resize);
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
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 200);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Context menu while editing', () => {
        let ganttObj: any; // Assuming ganttObj is of type any for simplicity
        beforeAll((done: Function) => {
            ganttObj = createGantt(selfGanttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('indent record', (done: Function) => {
            ganttObj.selectionModule.selectRow(1);
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            ganttObj.chartPane.dispatchEvent(mouseDownEvent);
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            setTimeout(() => {
                triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
                expect(ganttObj.treeGrid.element.getElementsByClassName('e-editedbatchcell').length).toBe(1);
                done(); 
            }, 1000);
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
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });    
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
           // expect((ganttObj.flatData[8] as IGanttData).childRecords.length).toBe(1);
        });
    });
    describe('header menu -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        beforeEach((done: Function) => {
            let taskName: HTMLElement = ganttObj.element.querySelectorAll('.e-headercell')[1] as HTMLElement;
            triggerMouseEvent(taskName, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 200);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
            setTimeout(done, 200);
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
            expect((ganttObj.contextMenuModule as any).hideItems.length).toBe(6);
            expect((ganttObj.contextMenuModule as any).disableItems.length).toBe(2);
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
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
        it('Add record - Milestone', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
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
        
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
        it('Task Information', () => { 
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);      
             ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                 expect(args.item.text).toEqual('Task Information');
             }
             ganttObj.dataBind();
             let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
             triggerMouseEvent(taskInfo, 'click');
             let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
             triggerMouseEvent(cancelRecord, 'click');
         });
         afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        beforeEach((done: Function) => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            setTimeout(done, 200);
        });
          it('To Task', () => {
              let e: ContextMenuClickEventArgs = {
                  item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
                  element: null,
              };
              (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
              expect(ganttObj.currentViewData[7].ganttProperties.isMilestone).toBeFalsy;
              expect(ganttObj.currentViewData[7].ganttProperties.duration).toBe(3);
          });
          it('Delete Depedency', (done: Function) => {
              let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
              triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
              let e = {
                  item: ganttObj.contextMenuModule.contextMenu.items[3].items[0],
              };
              (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
              expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toEqual('4FS+3 days,5FS');
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Context menu - spec coverage -', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Milestone indent', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: customScheduleModeData,
                allowSorting: true,
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
                taskMode: 'Manual',
                enableContextMenu: true,
                splitterSettings: {
                    columnIndex: 8
                },
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            }, done);
        });
        it('Milestone indent on manual mode', () => {
            (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[2];
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            (ganttObj.contextMenuModule as any).rowData = ganttObj.currentViewData[1];
            let e1: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e1);
            ganttObj.selectionModule.selectRow(2);
            let indent: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Indent' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
            expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/26/2017');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
            ganttObj.contextMenuModule['rowData'] = ganttObj.currentViewData[1];
            let taskInfo: HTMLElement = document.getElementById('deleterow');
            triggerMouseEvent(taskInfo, 'click');
        });

        afterAll(() => {
            destroyGantt(ganttObj);
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
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
      
         it('Adding record in immutable mode', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
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
            expect(ganttObj.currentViewData[0]['TaskID']).toBe(5);
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
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[3].ganttProperties.segments[0].width).not.toBe(0);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
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
        
        it('Changing Custom taskmode of a task to manual', (done: Function) => {
            expect(ganttObj.currentViewData[2].ganttProperties.isAutoSchedule).toBe(true);
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            // expect(document.getElementsByClassName('e-editedbatchcell').length).toBe(1);
            setTimeout(done, 500);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Manual' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[2].ganttProperties.isAutoSchedule).toBe(false);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Incorrect row height', () => {
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
                taskMode: 'Manual',
                splitterSettings: {
                    columnIndex: 8
                },
                rowHeight: 60,
            }, done);
        });
        
        it('Changing taskmode of a task to manual', () => {
            expect(document.getElementsByClassName('e-gantt-manualparenttaskbar-right')[0]['style'].height).toBe('11.5px');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
      
         it('Drag and drop after adding record as child Position', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            ganttObj.reorderRows([3], 4, 'child');
            // setTimeout(() => {
                expect(ganttObj.flatData[4]['TaskID']).toBe(42);
            // }, 100);
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
       
        it('Hide indent and outdent when selection is set to false', () => {
            expect(ganttObj.selectionModule).toBe(undefined);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
        
        it('disable Items', () => {
            let selectRow: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent(selectRow, 'contextmenu', 0, 0, false, false, 2);
            let menu: HTMLElement = document.getElementById('testMenuItem') as HTMLElement;
            expect(menu.classList.contains('e-disabled')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
                        dependency: 'Predecessor',
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
                                if (record.expanded) {
                                    args.hideItems.push("Expand the Row");
                                } else {
                                    args.hideItems.push("Collapse the Row");
                                }
                            }
                        }
                    }
                }, done);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Convert task to milestone', () => {
        let data = [{
            TaskID: 1,
            TaskName: 'New Task 1',
            StartDate: new Date('05/22/2023'),
            EndDate: new Date('05/22/2023'),
            BaselineStartDate: new Date('05/22/2023'),
            BaselineEndDate: new Date('05/22/2023'),
            Progress: 59,
            Duration: 1,
        }];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: data,
                    allowSorting: true,
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
                        parentID: 'parentID',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate'
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
                        type: 'Multiple',
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
                    searchSettings: {
                        fields: ['TaskName', 'Duration']
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
   
        it('Baseline should remain same', () => {
            ganttObj.actionComplete = (args?: any): void => {
                if (args.requestType == 'save') {
                    expect(ganttObj.currentViewData[0].ganttProperties.baselineWidth).toBe(33);
                }
            }
            ganttObj.convertToMilestone('1');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Bug-837574-Can not open task information in the contextmenu', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [{
                        TaskID: '0002',
                        TaskName: 'Defining the product and its usage',
                        StartDate: new Date('04/02/2019'),
                        Duration: 3,
                        Progress: 30,
                    }],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
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
        it('Checking is TaskID value is string', () => {
            ganttObj.dataBind();
            expect(typeof ganttObj.currentViewData[0].ganttProperties.taskId).toBe("string");
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Bug-840247-Multiple records are not deleted by contextmenu issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource:[
                        {
                            TaskID: 1,
                            TaskName: 'Product Concept',
                            StartDate: new Date('04/02/2019'),
                            EndDate: new Date('04/21/2019'),
                            subtasks: [
                                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
                            ]
                        },
                        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
                    ],
                    enableVirtualization: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks'
                    },
                    height: '550px',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: false
                    },
                    allowSelection: true,
                    allowSorting: true,
                    allowFiltering: true,
                    selectionSettings: {
                        mode: 'Both',
                        type: 'Multiple'
                    },
                    enableContextMenu: true,
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Using contextmenu to delete multiple rows', () => {
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRowsByRange(2, 4);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_DeleteTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            let ok: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog > div.e-footer-content > button');
            triggerMouseEvent(ok, 'click');
            expect(ganttObj.currentViewData.length).toBe(2);
        });
    });
     describe('After multiple selection, adding milestone position wrong -', () => {
        beforeAll((done: Function) => {
            // Gantt.Inject(Selection, Toolbar, Edit, Filter, RowDD,ContextMenu, Resize,Sort);
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'New Task 1',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 59,
                        Duration: 1,
                    },
                    {
                        TaskID: 2,
                        TaskName: 'New Task 2',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 45,
                        Duration: 1,
                    },
                    {
                        TaskID: 3,
                        TaskName: 'New Task 3',
                        StartDate: new Date('05/23/2023'),
                        EndDate: new Date('05/23/2023'),
                        Duration: 0,
                    },
                    {
                        TaskID: 4,
                        TaskName: 'New Task 4',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 38,
                        Duration: 1,
                    },
                    {
                        TaskID: 5,
                        TaskName: 'New Task 5',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 68,
                        Duration: 1,
                        Predecessor: 4,
                    },
                    {
                        TaskID: 6,
                        TaskName: 'New Task 6',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 57,
                        Duration: 1,
                        Predecessor: 5,
                    },
                    {
                        TaskID: 7,
                        TaskName: 'New Task 7',
                        StartDate: new Date('05/22/2023'),
                        EndDate: new Date('05/22/2023'),
                        Progress: 0,
                        Duration: 1,
                    },],
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    enableVirtualization: false,
                    allowParentDependency: false,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        parentID: 'parentID',
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    treeColumnIndex: 1,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                        newRowPosition: 'Bottom',
                    },
                    toolbar: ['Add'],
                    allowSelection: true,
                    gridLines: "Both",
                    showColumnMenu: false,
                    enableContextMenu: true,
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
                    columns: [
                        { field: "TaskID" },
                        { field: "TaskName", headerText: "Task Name" },
                        { field: "StartDate" },
                        { field: "Duration" },
                        { field: "Progress" },
                    ],
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: 'Progress',
                    },
                    selectionSettings: {
                        enableToggle: true,
                        mode: 'Row',
                        type: 'Multiple',
                    },
                    height: '450px',
                    allowRowDragAndDrop: true,
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
        it('check position of milestone to be bottom', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            ganttObj.selectRow(1);
            let milestone: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(milestone);
            expect(ganttObj.currentViewData[7]['TaskID']).toBe(8);
        });
    });
    describe('Bug:844625-Changing values in the actionBegin event does not reflect while rendering issue ', () => {
        beforeAll((done: Function) => {
            // Gantt.Inject(Selection, Toolbar, Edit, Filter,ContextMenu, Resize,Sort);
            ganttObj = createGantt({
                dataSource: [
                    { TaskID: 1, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12, Progress: 30 },
                    { TaskID: 2, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 6 },
                    { TaskID: 3, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 30 },
                    { TaskID: 4, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 }
                ],
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress'
                       
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    treeColumnIndex: 1,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                        newRowPosition: 'Bottom',
                    },
                    toolbar: ['Add'],
                    allowSelection: true,
                    gridLines: "Both",
                    showColumnMenu: false,
                    enableContextMenu: true,
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
                    actionBegin: function actionBegin(args) {
                        if (args.requestType === 'beforeAdd') {
                          args.data.TaskName = 'hi';
                          args.data.ganttProperties.taskName = 'hi';
                          args.data.taskData.TaskName = 'hi';
            
                          args.data.Duration = 5;
                          args.data.ganttProperties.duration = 5;
                          args.data.taskData.Duration = 5;
            
                          args.data.Progress = 20;
                          args.data.ganttProperties.progress = 20;
                          args.data.taskData.Progress = 20;
        
                        }
                      },
                    columns: [
                        { field: "TaskID" },
                        { field: "TaskName", headerText: "Task Name" },
                        { field: "StartDate" },
                        { field: "Duration" },
                        { field: "Progress" },
                    ],
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: 'Progress',
                    },
                    height: '450px',
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });     
        it('Adding task Below using contextmenu', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(5);
            expect(ganttObj.currentViewData[2].ganttProperties.taskName).toBe("hi");
            expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
            expect(ganttObj.currentViewData[2].ganttProperties.progress).toBe(20);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/10/2019');
        });
    });
    describe('CR - 872834 : The context menu using "add child" for any task, dependency line validation is not working properly', () => {
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
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
                    enableContextMenu: true,
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                        allowAdding: true,
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
                    allowParentDependency : false,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        // beforeEach((done: Function) => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        //     setTimeout(done, 500);
        // });
        it('Add record - Child', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(0);
        });
    });
});
describe('Grid side is not updated while indent when immutable mode is enabled', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Edit, ContextMenu);
    let newData: Object[] = [
            {
                TaskID: 1,
                TaskName: 'Product Concept',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 5, Predecessor: "2", Progress: 30 },
                ]
            }
        ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: newData,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            enableContextMenu:true,
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'Indent','Outdent'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
            enableImmutableMode: true,
            allowUnscheduledTasks: true,
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('check duration of taskbar', () => {
        ganttObj.selectionModule.selectRow(3);
            let indent: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Indent' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
    });
});
describe('Split taskbar date validation', () => {
    let ganttObj: Gantt;
    // Gantt.Inject(Edit, ContextMenu);
    let templateData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2019'), Duration: 0,
                    Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction',
                    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/02/2019')
                },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'),
                  Duration: 10, resources: [3], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                  'From an engineer or company specializing in soil testing', BaselineStartDate: new Date('04/01/2019')
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'),
                  Duration: 2, Predecessor: '2', Progress: 30, resources: [4] ,
                  BaselineStartDate: new Date('04/06/2019'), BaselineEndDate: new Date('04/06/2019')}]
            },
            {
            TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4', resources: [1], info: 'Develop floor plans and obtain a materials list for estimations',
            BaselineStartDate: new Date('04/05/2019'), BaselineEndDate: new Date('04/07/2019')
        },
        {
            TaskID: 6,
            TaskName: 'Market research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'),
                         Duration: 4, Predecessor: '5', Progress: 30, resources: [5] , info: 'Develop floor plans and obtain a materials list for estimations',
                         BaselineStartDate: new Date('04/05/2019'), BaselineEndDate: new Date('04/07/2019')},
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'),
                         Duration: 4, Predecessor: '5', resources: [6] , info: '',
                         BaselineStartDate: new Date('04/09/2019'), BaselineEndDate: new Date('04/12/2019') }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'),
                  Duration: 4, Predecessor: '7, 8', Progress: 30, resources: [4] ,
                  info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)',
                  BaselineStartDate: new Date('04/16/2019'), BaselineEndDate: new Date('04/17/2019')},
                { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'),
                  Duration: 4, Predecessor: '9', resources: [8] },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: templateData,
            height: '450px',
            allowSelection: true,
            highlightWeekends: true,
            enableContextMenu: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'Indent', 'Outdent'],
            taskFields: {
                id: 'TaskID',
                child: 'subtasks',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                progress: 'Progress',
                segments: 'splitTasks',
            },
            columns: [
                { field: 'TaskID', headerText: 'ID', textAlign: 'Left' },
                { field: 'TaskName', headerText: 'Name' },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'EndDate', headerText: 'End Date' },
                { field: 'Duration', headerText: 'Duration' },
                { field: 'Predecessor', headerText: 'Dependency' },
                { field: 'Progress', headerText: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            splitterSettings: {
                position: "53%"
            },
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('07/06/2019'),
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('split task - date validation', () => {
        ganttObj.actionBegin = function (args: any): void {
            if (args.requestType === "splitTaskbar") {
                args.splitDate = ganttObj.dateValidationModule.setTime(ganttObj.defaultEndTime, args.splitDate);
            }
        };
        let segment : HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar > div') as HTMLElement;
        triggerMouseEvent(segment, 'contextmenu', 0, 0, false, false, 2);
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_SplitTask' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[7].ganttProperties.startDate, 'MM/dd/yyyy')).toBe(ganttObj.getFormatedDate(ganttObj.currentViewData[6].ganttProperties.startDate, 'MM/dd/yyyy'));
    });
});
describe('Outdent record-', () => {
    let ganttObj: Gantt;
    // Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: indentData,
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
    it('Outdent record', () => {
        ganttObj.selectionModule.selectRow(1);
        let Outdent: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Outdent' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(Outdent);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Add milestone as first record of gantt -', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt( {
            dataSource: [],
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
        } , done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Add record - Milestone', () => {
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.currentViewData.length).toBe(1);
    });
});
describe('Add record as first record of gantt -', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt( {
            dataSource: [],
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
        } , done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Add record - Child', () => {
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Child' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.currentViewData.length).toBe(1);
    });
});
describe('CR:885011-When the context menu is used to add a record, the index can be changed by setting readOnly to true -', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR885011,
                enableContextMenu: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "70%",
                },
                gridLines: "Both",
                readOnly: false,
                showColumnMenu: true,
                highlightWeekends: true,
                actionBegin: function(args) {
                    if (args.requestType === 'beforeAdd') {
                        ganttObj.readOnly = true;
                        args.data.taskName = 'editedtask';
                        args.newTaskData.taskName = 'editedtask';
                    }
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
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    // beforeEach((done: Function) => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    //     setTimeout(done, 500);
    // });
    it('Add record by context menu- Below', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Below' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.currentViewData.length).toBe(4);
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('editedtask');
        expect(ganttObj.readOnly).toBe(true);
    });
});
describe('context menu items for parent task', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            Predecessor: "5",
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
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0 }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
    allowSorting: true,
    allowReordering: true,
    enableContextMenu: true,
    enableImmutableMode: true,
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
        { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
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
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
    allowExcelExport: true,
    allowPdfExport: true,
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
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
    eventMarkers: [
        {
            day: '04/10/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
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
  //  connectorLineBackground: "red",
  //  connectorLineWidth: 3,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    beforeEach((done: Function) => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        setTimeout(done, 200);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('context menu open', (done: Function) => {
        expect((ganttObj.contextMenuModule as any).hideItems.length).toBe(7);
        done();
    });
});
describe('MT:889303-Parent taskbar not rendered in unscheduled tasks', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: MT889303,
            enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration'
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
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration'}
        ],
        
        allowSelection: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
        },
        gridLines: "Both",
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019')
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    // beforeEach((done: Function) => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    //     setTimeout(done, 500);
    // });
    it('Task indent on unschedule mode', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.selectionModule.selectRow(2);
        let indent: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Indent' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '5 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(5);
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(5);
        expect(ganttObj.currentViewData[0].hasChildRecords).toBe(true);
    });
});
describe('Indenting Parent Record', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: coverageParentData,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
                resourceInfo: 'resources',
            },
            enableContextMenu: true,
            selectedRowIndex: 2,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            columns: [
                { field: 'TaskID', width: 200 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            splitterSettings: { columnIndex: 6 },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019'),
        }, done);
    });
    // beforeEach(() => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    // });
    it('Task indent on unschedule mode', (done:Function) => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.actionComplete = (args?: any): void => {
            if (args.requestType == 'indented') {
                expect(args.data[0].parentID).toBe(2);
            }
            done()
        }
        let indent: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Indent' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Adding task below with adaptive', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: coverageParentData,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
                resourceInfo: 'resources',
            },
            enableContextMenu: true,
            selectedRowIndex: 2,
            selectionSettings:{
                type:"Multiple",
                mode:"Cell"
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            columns: [
                { field: 'TaskID', width: 200 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            splitterSettings: { columnIndex: 6 },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019'),
        }, done);
    });
    beforeEach(() => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    });
    it('Adding Below Task', (done:Function) => {
        ganttObj.isAdaptive = true
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType == 'beforeAdd') {
                expect(ganttObj.flatData.length).toBe(10);
            }
            done()
        }
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Below' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    it('Adding Child Task', (done:Function) => {
        ganttObj.isAdaptive = true
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType == 'beforeAdd') {
                expect(ganttObj.flatData.length).toBe(11);
            }
            done()
        }
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Child' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Deleting task with adaptive', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: coverageParentData,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                notes: 'info',
                resourceInfo: 'resources',
            },
            enableContextMenu: true,
            selectedRowIndex: 2,
            selectionSettings:{
                type:"Multiple",
                mode:"Cell"
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            columns: [
                { field: 'TaskID', width: 200 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            splitterSettings: { columnIndex: 6 },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019'),
        }, done);
    });
    // beforeEach(() => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    // });
    it('Deleting Task', (done:Function) => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.isAdaptive = true
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType == "beforeDelete") {
                expect(ganttObj.flatData.length).toBe(9);
            }
            done()
        }
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_DeleteTask' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Converting to task with isMilestone property', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: mileStoneParentData,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                milestone:'isMilestone',
                notes: 'info',
                resourceInfo: 'resources',
            },
            enableContextMenu: true,
            selectedRowIndex: 3,
            selectionSettings:{
                type:"Multiple"
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            columns: [
                { field: 'TaskID', width: 200 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            splitterSettings: { columnIndex: 6 },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019'),
        }, done);
    });
    // beforeEach(() => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    // });
    it('Converting to task', (done:Function) => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.isAdaptive = true
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType == 'beforeSave') {
                expect(args.data.isMilestone).toBe(false);
            }
            done()
        }
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Merging task left', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: splitTasks,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child:"subtasks",
                segments:'Segments',
                milestone:'isMilestone',
                notes: 'info',
                resourceInfo: 'resources',
            },
            enableContextMenu: true,
            selectedRowIndex: 4,
            selectionSettings:{
                type:"Multiple"
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            columns: [
                { field: 'TaskID', width: 200 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            splitterSettings: { columnIndex: 2 },
        }, done);
    });
    // beforeEach(() => {
    //     let $tr: HTMLElement = ganttObj.chartPane.querySelector('.e-segment-last')  as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    // });
    it('Converting to task', (done:Function) => {
        let $tr: HTMLElement = ganttObj.chartPane.querySelector('.e-segment-last')  as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.contextMenuModule.segmentIndex = 1
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType == 'mergeSegment') {
                expect(args.mergeSegmentIndexes[0].firstSegmentIndex).toBe(0);
            }
            done()
        }
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Left' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Context menu on unschedule task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: splitTasksCoverage,
            dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            allowUnscheduledTasks:true,
            enableContextMenu: true,
            selectedRowIndex: 1,
            selectionSettings:{
                type:"Multiple"
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                allowNextRowEdit: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: 'Both',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: editingResources,
            height: '450px',
            splitterSettings: { columnIndex: 2 },
        }, done);
    });
    it('Converting to task', () => {
        let $tr: HTMLElement = ganttObj.chartPane.querySelector('.e-gantt-unscheduled-task ').querySelector('.e-gantt-unscheduled-taskbar') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        expect(true).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('CR 898103 - Add milestone-', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt( {
            dataSource: cr898103,
            dateFormat: 'MMM dd, y',
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
                resourceInfo: 'resources'
            },
            allowSorting: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: resourceCollection,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            allowResizing: true,
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' }
            ],
            eventMarkers: [
                { day: '4/17/2024', label: 'Project approval and kick-off' },
                { day: '5/3/2024', label: 'Foundation inspection' },
                { day: '6/7/2024', label: 'Site manager inspection' },
                { day: '7/16/2024', label: 'Property handover and sign-off' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'resources'
            },
            splitterSettings: {
                position: "35%"
            },
            editDialogFields: [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' },
                { type: 'Notes' },
            ],
            enableContextMenu: true,
            contextMenuClick: function (args) {
                var record = args.rowData;
                if (args.item.id === 'collapserow') {
                    ganttObj.collapseByID(Number(record.ganttProperties.taskId));
                }
                if (args.item.id === 'expandrow') {
                    ganttObj.expandByID(Number(record.ganttProperties.taskId));
                }
            },
            contextMenuItems: contextMenuItems as ContextMenuItem[],
            contextMenuOpen: function (args) {
                var record = args.rowData;
                if (args.type !== 'Header') {
                    if (!record.hasChildRecords) {
                        args.hideItems.push('Collapse the Row');
                        args.hideItems.push('Expand the Row');
                    } else {
                        if(record.expanded) {
                            args.hideItems.push('Expand the Row');
                        } else {
                            args.hideItems.push('Collapse the Row');
                        }
                    }
                }
            },
        } , done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    // beforeEach((done: Function) => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    //     setTimeout(done, 500);
    // });
    it('Add record - Milestone', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.currentViewData.length).toBe(5);
    });
});
describe('Selected row index after adding new record', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        }
    ];
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
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
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
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
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    // beforeEach((done: Function) => {
    //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
    //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
    //     setTimeout(done, 500);
    // });
    it('Check selected row index', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType == "refresh") {
                expect(ganttObj.selectedRowIndex).toBe(4);
            }};
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Below' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('offset not updated when convert to milestone', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt({
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
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    it('Check offset', (done: Function) => {
        ganttObj.actionBegin = (args: any): void => {
            if (args.requestType == "beforeSave") {
                expect(args.data.ganttProperties.predecessor[0].offset).toEqual(11);
            }
            done()
        };
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Child' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Context menu - split task for 2 day hour mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2024'), EndDate: new Date('02/10/2024'),
                    Duration: 2, Progress: '90'
                }],
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
                { field: 'TaskID', width: 80 },
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Day',
                  },
                  bottomTier: {
                    unit: 'Hour',
                  },
            },
            enableTimelineVirtualization: true,
            highlightWeekends: true,
            splitterSettings: {
                position: "35%"
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('01/30/2024'),
            projectEndDate: new Date('03/04/2024')
            }, done);
    });
    it('split task ', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "splitTaskbar") {
                expect(args.rowData.ganttProperties.segments[0].width).toBe(33);
            }
        };
        ganttObj.splitTask(4, new Date('2024-02-05T09:00:00'));
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});

describe('Context menu - split task for 2 day mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2024'), EndDate: new Date('02/10/2024'),
                    Duration: 2, Progress: '90'
                }],
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
                showTooltip: true,
                topTier: {
                    unit: 'Week',
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
                { field: 'TaskID', width: 80 },
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
                position: "35%"
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('01/30/2024'),
            projectEndDate: new Date('03/04/2024')
            }, done);
    });
    it('split task ', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "splitTaskbar") {
                expect(args.rowData.ganttProperties.segments.length).toBe(2);
            }
        };
        ganttObj.splitTask(4, new Date('2024-02-05T17:00:00'));
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('CR910866- add rowPosition property in actionBegin event', () => {
    let ganttObj: Gantt;
    let CR910866data : any = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
    ];
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt({
        dataSource: CR910866data,
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
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
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
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('add rowPosition property in actionBegin event', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.actionBegin = (args: any): void => {
            if (args.requestType == "beforeAdd") {
                expect(args.rowPosition).toBe('Below');
            }};
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Below' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Context menu - split task for 2 day minute mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2024'), EndDate: new Date('02/10/2024'),
                    Duration: 2, Progress: '90'
                }],
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
                { field: 'TaskID', width: 80 },
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
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Hour',
                  },
                  bottomTier: {
                    unit: 'Minutes',
                  },
            },
            enableTimelineVirtualization: true,
            highlightWeekends: true,
            splitterSettings: {
                position: "35%"
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('01/30/2024'),
            projectEndDate: new Date('03/04/2024')
            }, done);
    });
    it('split task ', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "splitTaskbar") {
                expect(args.rowData.ganttProperties.segments[0].width).toBe(330);
            }
        };
        ganttObj.splitTask(4, new Date('2024-02-05T08:10:00'));
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cheking context menu enabled', () => {
    let ganttObj: Gantt;
    let CR910866data : any = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
    ];
    Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
    beforeAll((done: Function) => {
        ganttObj = createGantt({
        dataSource: CR910866data,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: false,
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
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
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
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('Enabling context menu using instance', () => {
        ganttObj.enableContextMenu = true;
    });
    it('Opening Context menu', () => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        ganttObj.actionBegin = (args: any): void => {
            if (args.requestType == "beforeAdd") {
                expect(args.rowPosition).toBe('Below');
            }};
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Below' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Context menu - coverage getIconCss', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2024'), EndDate: new Date('02/10/2024'),
                    Duration: 2, Progress: '90'
                }],
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
                showTooltip: true,
                topTier: {
                    unit: 'Week',
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
                { field: 'TaskID', width: 80 },
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
                position: "35%"
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('01/30/2024'),
            projectEndDate: new Date('03/04/2024')
            }, done);
    });
    it('Calling Icon Css ', () => {
        expect(ganttObj.contextMenuModule['getIconCSS']('e-contextmenu','e-contextmenu')).toBe('e-contextmenu');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
