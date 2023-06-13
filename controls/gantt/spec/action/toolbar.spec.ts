/**
 * Gantt toolbar spec
 */
import { Gantt, Edit, Toolbar, Selection, Filter, ZoomTimelineSettings } from '../../src/index';
import { projectData1, projectData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
describe('Gantt toolbar support', () => {
    describe('Gantt toolbar action', () => {
        Gantt.Inject(Edit, Toolbar, Selection, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
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
                    toolbar: ['ZoomIn','ZoomOut','ZoomToFit','Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan', 'Custom', { text: 'Quick Filter', tooltipText: 'Quick Filter', id: 'toolbarfilter' },],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Check all toolbar rendered properly', () => {
            let toolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar') as HTMLElement;
            expect(toolbar.getElementsByClassName('e-toolbar-item').length).toBe(15);
        });

        it('Ensuring proper toolbar display', () => {
            ganttObj.toolbar = ["Add", "Cancel", "CollapseAll", "Delete", "Edit", "ExpandAll", "NextTimeSpan", "PrevTimeSpan", "Search" ,"Update","ZoomIn","ZoomOut","ZoomToFit"];
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

        // it('Delete handler function', () => {
        //     ganttObj.selectionModule.selectRow(2);
        //     let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        //     triggerMouseEvent(deleteToolbar, 'click');
        //     let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog').getElementsByClassName('e-primary')[0] as HTMLElement;
        //     triggerMouseEvent(okElement, 'click');
        //     expect(ganttObj.flatData.length).toBe(41);
        //     ganttObj.selectionModule.clearSelection();
        // });

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

        it('Edit handler function', () => {
            ganttObj.selectionModule.selectRow(2);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(1);
            let editToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_edit') as HTMLElement;
            triggerMouseEvent(editToolbar, 'click');
            let progress: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + 'Progress'));
            if (progress) {
                let progressInput: any = (document.getElementById(ganttObj.element.id + 'Progress') as any).ej2_instances[0];
                progressInput.value = 80;
                let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
                triggerMouseEvent(save, 'click');
                // expect(getValue('Progress', ganttObj.flatData[2])).toBe(80);
            }
            ganttObj.selectionModule.clearSelection();
        });

        // it('CollapseAll handler function', () => {
        //     let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        //     triggerMouseEvent(collapseallToolbar, 'click');
        //     expect(ganttObj.flatData[1].expanded).toBe(false);
        //     ganttObj.selectionModule.clearSelection();
        // });

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

        // it('Cancel handler function', () => {
        //     let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent(taskName, 'dblclick');
        //     let taskValue: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName'));
        //     if (taskValue) {
        //         taskValue.value = 'Cancel TaskName';
        //         let cancelToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_cancel') as HTMLElement;
        //         triggerMouseEvent(cancelToolbar, 'mousedown');
        //         expect(getValue('TaskName', ganttObj.flatData[3])).toBe('Plan budget');
        //         ganttObj.selectionModule.clearSelection();
        //     }
        // });

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

        // it('Enable toolbar using public method', () => {
        //     ganttObj.toolbarModule.enableItems(['toolbarfilter'], false);
        //     expect(ganttObj.element.getElementsByClassName('e-toolbar-item e-overlay')[0].textContent).toBe('Quick Filter');
        // });

        // it('Cancel toolbar', (done: Function) => {
        //     let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        //     triggerMouseEvent(taskName, 'dblclick');
        //     let cancelToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_cancel') as HTMLElement;
        //     triggerMouseEvent(cancelToolbar, 'click');
        //     ganttObj.dataBound = () => {
        //         done();
        //     }
        //     ganttObj.refresh();
        // });

        it('SearchKey and SearchValue', (done: Function) => {
            ganttObj.isAdaptive = true;
            ganttObj.dataBind();
            ganttObj.searchSettings.key = '';
            let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
            searchbar.value = 'check';
            let searchButton: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbutton') as HTMLElement;
            triggerMouseEvent(searchButton, 'click');
            ganttObj.dataBound = () => {
                expect(ganttObj.searchSettings.key).toBe('check');
                done();
            }
            ganttObj.refresh();
        });

        it('Selection Mode Cell', (done: Function) => {
            ganttObj.selectionSettings.mode = 'Cell';
            ganttObj.selectionModule.selectCell({ cellIndex: 1, rowIndex: 1 });
            ganttObj.dataBound = () => {
                let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
                triggerMouseEvent(deleteToolbar, 'click');
                let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog').getElementsByClassName('e-primary')[0] as HTMLElement;
                triggerMouseEvent(okElement, 'click');
                done();
            }
            ganttObj.refresh();
        });

        it('Disable adding ', (done: Function) => {
            ganttObj.editSettings.allowAdding = false;
            ganttObj.dataBound = () => {
                expect(ganttObj.editSettings.allowAdding).toBe(false);
                done();
            }
            ganttObj.refresh();
        });

        it('Disable SelectionModule ', (done: Function) => {
            ganttObj.allowSelection = false;
            ganttObj.dataBind();
            expect(ganttObj.allowSelection).toBe(false);
            done();
        });

        it('Disable EditModule ', (done: Function) => {
            ganttObj.editSettings.allowEditing = false;
            ganttObj.editSettings.allowAdding = false;
            ganttObj.editSettings.allowDeleting = false;
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            expect(ganttObj.editSettings.allowAdding).toBe(false);
            expect(ganttObj.editSettings.allowEditing).toBe(false);
            expect(ganttObj.editSettings.allowDeleting).toBe(false);
            expect(ganttObj.editSettings.allowTaskbarEditing).toBe(false);
            done();
        });

        it('Toolbar null value check', (done: Function) => {
            ganttObj.toolbar = null;
            ganttObj.dataBound = () => {
                expect(ganttObj.toolbar).toBe(null);
                done();
            }
            ganttObj.refresh();
        });

        it('Toolbar Object', (done: Function) => {
            ganttObj.toolbar = [{ text: 'Add', tooltipText: 'Add task' }];
            ganttObj.dataBound = () => {
                expect(ganttObj.toolbar.length).toBe(1);
                done();
            }
            ganttObj.refresh();
        });
        it('CR-EJ2-46731: Maintaining additional fields in segments on zooming action', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'AfterZoomIn') {
                    expect(getValue('Segments[0].Custom', ganttObj.flatData[0].taskData)).toBe("Test");
                }
            };
            ganttObj.toolbar = ['ZoomIn', 'ZoomOut'];
            ganttObj.dataSource = [{
                TaskID: 1, TaskName: 'Plan timeline', StartDate: new Date('02/04/2017'), EndDate: new Date('02/10/2017'),
                Duration: 10, Progress: '60',
                Segments: [
                    { StartDate: new Date('02/04/2017'), Duration: 2, Custom: 'Test' },
                    { StartDate: new Date('02/05/2017'), Duration: 5, Custom: 'Test' },
                    { StartDate: new Date('02/08/2017'), Duration: 3, Custom: 'Test'  }
                  ]
            }];
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
            let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
            triggerMouseEvent(zoomIn, 'click');
        });
        it('Destroy method', () => {
            ganttObj.toolbarModule.destroy();
        });
    });
    describe('Zoomin action and zoomtofit action', () => {
        Gantt.Inject(Edit, Toolbar, Selection, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Check Zoom In action', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'AfterZoomToProject') {
                    expect(args.requestType).toBe('AfterZoomToProject');
                }
            };
            let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
            triggerMouseEvent(zoomIn, 'click');
            let zoomToFit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomtofit') as HTMLElement;
            triggerMouseEvent(zoomToFit, 'click');
        });
    });
     describe('Gantt toolbar action', () => {
        Gantt.Inject(Edit, Toolbar, Selection, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
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
                    toolbar: ['ZoomIn','ZoomOut','ZoomToFit','Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan', 'Custom', { text: 'Quick Filter', tooltipText: 'Quick Filter', id: 'toolbarfilter' },],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Update handler function', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let taskValue: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName'));
            if(taskValue) {
            taskValue.value = 'Update TaskName';
            let updateToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_update') as HTMLElement;
            triggerMouseEvent(updateToolbar, 'click');
            expect(getValue('TaskName', ganttObj.flatData[4])).toBe('Update TaskName');
            ganttObj.selectionModule.clearSelection();
            }
        });
        it('Destroy method', () => {
            ganttObj.toolbarModule.destroy();
        });
    });
    describe('Do indent in immutable mode ', () => {
        let ganttObj: Gantt;
        let editingData: Object[] = [
            {
              TaskID: 1,
              TaskName: 'Project initiation',
              StartDate: new Date('04/02/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 2,
                  TaskName: 'Identify site location',
                  StartDate: new Date('04/02/2019'),
                  Duration: 0,
                  Progress: 30,
                  resources: [1],
                  info: 'Measure the total property area alloted for construction',
                },
                {
                  TaskID: 3,
                  TaskName: 'Perform soil test',
                  StartDate: new Date('04/02/2019'),
                  Duration: 4,
                  Predecessor: '2',
                  resources: [2, 3, 5],
                  info:
                    'Obtain an engineered soil test of lot where construction is planned.' +
                    'From an engineer or company specializing in soil testing',
                },
                {
                  TaskID: 4,
                  TaskName: 'Soil test approval',
                  StartDate: new Date('04/02/2019'),
                  Duration: 0,
                  Predecessor: '3',
                  Progress: 30,
                },
              ],
            },
            {
              TaskID: 5,
              TaskName: 'Project estimation',
              StartDate: new Date('04/02/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 6,
                  TaskName: 'Develop floor plan for estimation',
                  StartDate: new Date('04/04/2019'),
                  Duration: 3,
                  Predecessor: '4',
                  Progress: 30,
                  resources: 4,
                  info: 'Develop floor plans and obtain a materials list for estimations',
                },
              ],
            },
          ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: editingData,
                dateFormat: 'MMM dd, y',
                enableImmutableMode: true,
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
                  showDeleteConfirmDialog: true,
                },
                toolbar: ['Indent', 'Outdent'],
                allowSelection: true,
                gridLines: 'Both',
                height: '450px',
                treeColumnIndex: 0,
                resourceFields: {
                  id: 'resourceId',
                  name: 'resourceName',
                },
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
                columns: [
                  { field: 'TaskID' },
                  {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                  },
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                  { field: 'Predecessor' },
                ],
                eventMarkers: [
                  { day: '4/17/2019', label: 'Project approval and kick-off' },
                  { day: '5/3/2019', label: 'Foundation inspection' },
                  { day: '6/7/2019', label: 'Site manager inspection' },
                  { day: '7/16/2019', label: 'Property handover and sign-off' },
                ],
                labelSettings: {
                  leftLabel: 'TaskName',
                  rightLabel: 'resources',
                },
                editDialogFields: [
                  { type: 'General', headerText: 'General' },
                  { type: 'Dependency' },
                  { type: 'Resources' },
                  { type: 'Notes' },
                ],
                splitterSettings: {
                  columnIndex: 2,
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
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
        it('Indent for children', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === "indented") {
                    expect(ganttObj.treeGrid.getRows()[5].getElementsByClassName('e-icons').length).toBe(4);
                }
            };
            ganttObj.selectRow(4);
            let indent: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_indent') as HTMLElement;
            triggerMouseEvent(indent, 'click');
        });
    });
    describe('Custom Zooming levels ', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                toolbar: [ 'ZoomIn', 'ZoomOut', 'ZoomToFit'],
                load: (args?: any) => {
                    let gantt: any=(document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];
                    const zoomingLevels: any = gantt.getZoomingLevels();
                    const zoomOutLimit: number = 4;
                    const zoomInLimit: number = 14;
                    gantt.zoomingLevels = zoomingLevels.slice(
                        zoomOutLimit,
                        zoomInLimit
                    );
                },
                actionComplete: (args?: any) => {
                    if(args.requestType == "AfterZoomOut") {
                        expect(args.timeline.level).toBe(14);
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
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
        it('Zoom out', () => {
            let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
            triggerMouseEvent(zoomIn, 'click');
            expect(ganttObj.timelineModule.topTier == 'Week');
        });
    });
    describe('Custom Zooming levels ', () => {
        let customZoomingLevels: ZoomTimelineSettings[] = [
            {
              topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
              bottomTier: { unit: 'Week', format: 'dd', count: 1 },
              timelineUnitSize: 33,
              level: 0,
              timelineViewMode: 'Month',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
            {
              topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
              bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 },
              timelineUnitSize: 66,
              level: 1,
              timelineViewMode: 'Month',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
            {
              topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
              bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 },
              timelineUnitSize: 99,
              level: 2,
              timelineViewMode: 'Month',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
            {
              topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
              bottomTier: { unit: 'None' },
              timelineUnitSize: 33,
              level: 3,
              timelineViewMode: 'Week',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
            {
              topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
              bottomTier: { unit: 'None' },
              timelineUnitSize: 66,
              level: 4,
              timelineViewMode: 'Week',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
            {
              topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
              bottomTier: { unit: 'None' },
              timelineUnitSize: 99,
              level: 5,
              timelineViewMode: 'Week',
              weekStartDay: 0,
              updateTimescaleView: true,
              weekendBackground: null,
              showTooltip: true,
            },
          ];
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                toolbar: [ 'ZoomIn', 'ZoomOut', 'ZoomToFit'],
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
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('04/28/2019'),
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Zoom out', () => {
            ganttObj.zoomingLevels = customZoomingLevels;
            let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
            triggerMouseEvent(zoomIn, 'click');
            triggerMouseEvent(zoomIn, 'click');
            triggerMouseEvent(zoomIn, 'click');
            triggerMouseEvent(zoomIn, 'click');
            triggerMouseEvent(zoomIn, 'click');
            expect(document.getElementsByClassName('e-toolbar-item e-overlay')[0].firstElementChild['ariaDisabled']).toBe("true");
        });
    });
    describe('Perform outdent in immutable mode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: true  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                enableImmutableMode: true,
                toolbar: ['Indent','Outdent'],
                height: '550px',
                allowUnscheduledTasks: true,
                actionComplete: (args?: any) => {
                    if(args.requestType == "refresh") {
                        expect(ganttObj.currentViewData[17].level).toBe(3);
                    }
                },
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
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
        it('Outdent performed', () => {
            ganttObj.selectRow(15);
            let outdent: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_outdent') as HTMLElement;
            triggerMouseEvent(outdent, 'click');
        });
    });
    describe('Zoom To Fit - ', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''},
                    {TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'},
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
                toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit'],
                allowSelection: true,
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
                splitterSettings:{
                    columnIndex: 3
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/29/2019'),
                projectEndDate: new Date('05/30/2019')
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
        it('Unscheduled Task', () => {
            let zoomToFit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomtofit') as HTMLElement;
            triggerMouseEvent(zoomToFit, 'click');
            let date1 = ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy');
            triggerMouseEvent(zoomToFit, 'click');
            let date2 = ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy');
            expect(date1).toBe(date2);
        });
    });
     describe('Disable indent outdent', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''},
                    {TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'},
                ],
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                },
                toolbar: ['Indent','Outdent'],
                allowSelection: true,
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
                splitterSettings:{
                    columnIndex: 3
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/29/2019'),
                projectEndDate: new Date('05/30/2019')
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
        it('editsettings not mapped', () => {
            ganttObj.selectRow(1);
            let toolbarItems: number = document.getElementsByClassName('e-toolbar-item e-hidden').length;
            expect(toolbarItems).toBe(2);
        });
    });
    describe('Add new record ', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [],
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    baselineStartDate: 'baselineStartDate',
                    baselineEndDate: 'baselineEndDate',
                },
                toolbar: ['Add', 'Edit', 'Delete'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                  },
                renderBaseline: true,
                timezone: 'UTC',
                height: '450px',
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
        it('Add record in UTC', () => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
            let StartDateInput: any = (document.getElementById(ganttObj.element.id + 'startDate') as any).ej2_instances[0];
            StartDateInput.value = new Date('6/28/2022');
            let EndDateInput: any = (document.getElementById(ganttObj.element.id + 'endDate') as any).ej2_instances[0];
            EndDateInput.value = new Date('6/28/2022');
            let duration: any = (document.getElementById(ganttObj.element.id + 'duration') as any).ej2_instances[0];
            duration.value = '0 day';
            let BaselineStartDateInput: any = (document.getElementById(ganttObj.element.id + 'baselineStartDate') as any).ej2_instances[0];
            BaselineStartDateInput.value = new Date('6/28/2022');
            let BaselineEndDateInput: any = (document.getElementById(ganttObj.element.id + 'baselineEndDate') as any).ej2_instances[0];
            BaselineEndDateInput.value = new Date('6/28/2022');
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
            triggerMouseEvent(save, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('06/28/2022 08:00');
        });
    });
    describe('Gantt toolbar action', () => {
        Gantt.Inject(Edit, Toolbar, Selection, Filter);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSelection: true,
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
                    toolbar: ['ZoomIn','ZoomOut','ZoomToFit','Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan', 'Custom', { text: 'Quick Filter', tooltipText: 'Quick Filter', id: 'toolbarfilter' },],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Select search value and delete', () => {
            ganttObj.selectionModule.selectRow(2);
            ganttObj.isAdaptive = true;
            ganttObj.dataBind();
            ganttObj.searchSettings.key = '';
            let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
            searchbar.value = 'check';
            searchbar.focus();
            searchbar.select();
            let args: any = { action: 'delete',target:searchbar};
            ganttObj.keyboardModule.keyAction(args);
            expect (ganttObj.currentViewData.length).toBe(41)
        });
    });
});
describe('Custom Zooming levels zoomout ', () => {
    let customZoomingLevels: ZoomTimelineSettings[] = [
        {
          topTier: { unit: 'Year', format: 'yyyy', count: 1 },
          bottomTier: {
            unit: 'Month',
            // @ts-ignore
            formatter: (date: Date) => {
              //debugger;
              const month = date.getMonth();
              if (month >= 0 && month <= 5) {
                return 'H1';
              } else {
                return 'H2';
              }
            },
            count: 6,
          },
          timelineUnitSize: 33,
          level: 0,
          timelineViewMode: 'Year',
          weekStartDay: 0,
          updateTimescaleView: true,
          weekendBackground: undefined,
          showTooltip: true,
        },
        {
          topTier: {
            unit: 'Month',
            count: 3,
            // @ts-ignore
            formatter: (date: Date) => {
              const month = date.getMonth();
              if (month >= 0 && month <= 2) {
                return 'Q1';
              } else if (month >= 3 && month <= 5) {
                return 'Q2';
              } else if (month >= 6 && month <= 8) {
                return 'Q3';
              } else {
                return 'Q4';
              }
            },
          },
          bottomTier: {
            unit: 'Month',
            format: 'MMM',
          },
          timelineUnitSize: 33,
          level: 1,
          timelineViewMode: 'Year',
          weekStartDay: 0,
          updateTimescaleView: true,
          weekendBackground: undefined,
          showTooltip: true,
        },
      ];;
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectData,
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
            dataBound:()=>{
                if (ganttObj!.zoomingLevels.length > 24) {
                    ganttObj!.zoomingLevels = customZoomingLevels;
                    ganttObj!.fitToProject();
                    console.log('@sp: use customZoomingLevels and call fitToProject()');
                  }
               },
            toolbar: [ 'ZoomIn', 'ZoomOut', 'ZoomToFit'],
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
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('04/28/2019'),
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
    it('Zoom in to zoom out ', () => {
        let zoomIn: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement;
        triggerMouseEvent(zoomIn, 'click');
        expect((ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomin') as HTMLElement).attributes[5].value).toBe("false");
    });
});
