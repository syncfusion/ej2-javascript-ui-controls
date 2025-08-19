
import { Gantt, Selection, Toolbar } from '../../src/index';
import { projectData1, resourceResources, resourcesDatas, MT897135, splitTasksData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { RowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { getValue } from  '@syncfusion/ej2-base';
import { ganttChart } from '../../src/gantt/base/css-constants';
Gantt.Inject(Selection, Toolbar);

describe('Gantt Selection support', () => {
    describe('Gantt selection', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Both',
                        type: 'Single'
                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Select rows by range when the selection type is single', () => {
            ganttObj.selectionModule.selectRowsByRange(6, 3);
            expect((ganttObj.selectionModule.getSelectedRows().length)).toBe(1);
        });
        it('Select rows by range when the selection type is multiple', () => {
            ganttObj.selectionSettings.type = 'Multiple';
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRowsByRange(3, 6);
            expect(ganttObj.selectionModule.getSelectedRows().length).toBe(4);
        });
        it('Select Multiple Rows and Clear the selection by the public mthod', () => {
            ganttObj.selectionModule.selectRows([3, 4]);
            ganttObj.selectionModule.clearSelection();
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Select a single cell', () => {
            ganttObj.selectionModule.selectCell({ cellIndex: 1, rowIndex: 1 });
            expect(ganttObj.selectionModule.getSelectedRowCellIndexes()[0].rowIndex).toBe(1);
        });
        it('DeSelect a row by clicking on treegrid side', () => {
            ganttObj.selectionSettings.enableToggle = true;
            ganttObj.dataBind();
            let cell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(cell, 'click', 10, 10);
            triggerMouseEvent(cell, 'click', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Deselect row', () => {
            ganttObj.selectionSettings.enableToggle = true;
            ganttObj.dataBind();
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
    });
    describe('Gantt selection', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Both',
                        type: 'Single'
                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Select rows by clicking on chart side', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            let row1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10);
            triggerMouseEvent(row1, 'mouseup', 30, 30);
            expect(ganttObj.selectionModule.getSelectedRowIndexes()[0]).toBe(4);
        });
        it('Ensuring Selection After cell editing', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.rowSelecting = null;
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let taskValue: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName'));
            taskValue.value = 'Update TaskName';
            let updateToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_update') as HTMLElement;
            triggerMouseEvent(updateToolbar, 'click');
            expect((ganttObj.selectionModule.getSelectedRows().length)).toBe(1);
        });
        it('Select a row when the toggle selection disabled', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.selectionSettings.enableToggle = false;
            ganttObj.selectionSettings.type = 'Single';
            ganttObj.selectionSettings.mode = 'Row';
            ganttObj.dataBind();
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(1);
        });
        it('Select a row when the toggle selection enabled', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.selectionSettings.enableToggle = true;
            ganttObj.dataBind();
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Select a cell when the toggle selection enabled', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.selectionSettings.mode = 'Cell';
            ganttObj.dataBind();
            let cell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-Child(2)') as HTMLElement;
            triggerMouseEvent(cell, 'click', 10, 10);
            triggerMouseEvent(cell, 'click', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRowCellIndexes().length).toBe(0);
        });
        it('Select a cell when the toggle selection disabled', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.selectionSettings.enableToggle = false;
            ganttObj.dataBind();
            let cell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-Child(2)') as HTMLElement;
            triggerMouseEvent(cell, 'click', 10, 10);
            triggerMouseEvent(cell, 'click', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRowCellIndexes().length).toBe(1);
        });
        it('Enabling persist selection', () => {
            ganttObj.selectionSettings.persistSelection = true;
            ganttObj.dataBind();
            let cell: HTMLElement;
            cell = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(cell, 'mouseup', 10, 10, true);
            cell = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(cell, 'mouseup', 10, 10, true);
        });
        it('Cancel the selection while selecting multiple rows', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.rowSelecting = (args: RowSelectingEventArgs) => {
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRows([3, 4]);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Cancel the selection while selecting a single row', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.rowSelecting = (args: RowSelectingEventArgs) => {
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRow(8);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
    });
    describe('Clear Gantt selection after deleting last row', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single'
                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Cancel the selection after deleting last row of Gantt', () => {
            ganttObj.selectionModule.clearSelection();
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "refresh") {
                    expect(ganttObj.selectedRowIndex).toBe(-1);
                }
            };
            ganttObj.selectRow(38, false);
            expect(ganttObj.selectedRowIndex).toBe(38);
            ganttObj.editModule.deleteRecord(getValue('TaskID', ganttObj.selectionModule.getSelectedRecords()[0]));
        });
    });
        describe('Check row selection after virtual scrolling', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
       // it('check selected row index', () => {
         //   ganttObj.selectionModule.selectRow(3);
          //  ganttObj.ganttChartModule.scrollObject.setScrollTop(500);
          //  expect(ganttObj.selectedRowIndex).toBe(3);
        // });
    });
    describe('Gantt selection by select cell method', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    load: function () {
                        this.isAdaptive = true;
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    cellSelecting: function (args: any) {
                        if (args.data.TaskID == 4 && args.cellIndex.cellIndex == 1) {
                            args.cancel = true;
                        }
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Cell',
                        type: 'Multiple',
                        enableToggle: true
                    }

                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Select the cell using selectcell method', () => {
            const rowCellIndexes = [
                { rowIndex: 1, cellIndexes: [2, 4] }
            ];
            ganttObj.selectionModule.selectCells(rowCellIndexes);
            ganttObj.selectionModule.getCellSelectedRecords();
        });

    });
    describe('Triggering mouse click event for label', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: resourcesDatas,
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
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                    allowSelection: true,
                    gridLines: 'Both',
                    height: '450px',
                    treeColumnIndex: 1,
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName'
                    },
                    resources: resourceResources,
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
                    editDialogFields: [
                        { type: 'General', headerText: 'General' },
                        { type: 'Dependency' },
                        { type: 'Resources' },
                        { type: 'Notes' },
                    ],
                    splitterSettings: {
                        position: "35%"
                    },
                }, done);
        });
        it('Selecting Label', () => {
            let element: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-label')[2] as HTMLElement;
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
        });
        it('Checking flatdata length', () => {
            expect(ganttObj.flatData.length).toBe(4)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Opening edit dialog using mouse event', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    dataBound: function () {
                        this.isAdaptive = true;
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple',
                        enableToggle: true
                    }

                }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 200);
        });
        it('Selecting row', () => {
            ganttObj.isAdaptive = true
            let element: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-task-label')[2] as HTMLElement;
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        it('Opening edit dialog', () => {
            let element = ganttObj.chartPane.querySelector('.e-ganttpopup') as HTMLElement
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        it('Checking for edit dialog', () => {
            expect(document.getElementById('ganttContainer_dialog') === null).toBe(true)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Checking For Selection, after delete', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false
                    }

                }, done);
        });
        it('deleting Row', () => {
            ganttObj.selectionModule.selectRow(3);
            let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteToolbar, 'click');
            let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog').getElementsByClassName('e-primary')[0] as HTMLElement;
            triggerMouseEvent(okElement, 'click');
            expect(ganttObj.selectedRowIndex).toBe(3);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt selection removal from treegrid side', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Both',
                        type: 'Single'
                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('DeSelect a row by clicking on treegrid side', () => {
            ganttObj.selectionSettings.enableToggle = true;
            ganttObj.selectionSettings.persistSelection = true;
            ganttObj.dataBind();
            let cell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(cell, 'click', 10, 10);
            triggerMouseEvent(cell, 'click', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
    });
    describe('Gantt selection removal from treegrid side', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectedRowIndex: 2,
                    selectionSettings: {
                        mode: 'Both',
                        type: 'Single',
                        enableToggle: true,
                        persistSelection: true
                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Add a row with persist selection', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "add") {
                    expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(1);
                }
            };
            ganttObj.dataBind();
            let data: Object = {
                TaskID: 55, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                Duration: 5, Progress: '100'
            }
            ganttObj.addRecord(data);
        });
        it('Add a row with persist selection true', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "add") {
                    expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
                }
            };
            ganttObj.dataBind();
            let data: Object = {
                TaskID: 56, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                Duration: 5, Progress: '100'
            }
            ganttObj.addRecord(data);
        });
    });
    describe('Hiding pop up using mouse event', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    dataBound: function () {
                        this.isAdaptive = true;
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple',
                        enableToggle: true
                    }

                }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 200);
        });
        it('Selecting row', () => {
            ganttObj.isAdaptive = true
            let element: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-task-label')[2] as HTMLElement;
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        it('Opening edit dialog', () => {
            let element = ganttObj.chartPane.querySelector('.e-ganttpopup') as HTMLElement
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        it('Closing edit dialog', () => {
            let element = ganttObj.chartPane.querySelector('.e-ganttpopup') as HTMLElement
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt selection Row', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    dataBound: function () {
                        this.isAdaptive = true;
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple',
                        enableToggle: true
                    }

                }, done);
        });
        it('Selecting row', () => {
            ganttObj.isAdaptive = true
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'mousedown');
            triggerMouseEvent(element, 'mouseup');
            triggerMouseEvent(element, 'click');
        });
        it('Checking selected row index', () => {
            expect(ganttObj.selectedRowIndex).toBe(3)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Checking For Selection Change', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    selectedRowIndex:1,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false
                    }

                }, done);
        });
        it('Selecting Row', (done: Function) => {
            ganttObj.rowSelected = (args: any): void => {
                if (args.rowIndex === 3) {
                    expect(true).toBe(true);
                    done();
                }
            };
            ganttObj.selectedRowIndex = 3;
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('MT-897135:Row & Cell selection does not continue for virtual data when using the keyboard up/down', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        let oldRowIndex: number;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: MT897135,
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
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false
                    },
                    allowSelection: true,
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1500);
            ganttObj.selectionModule.selectRow(19);
            oldRowIndex = ganttObj.selectedRowIndex;
        });
        it('upArrow shortcut testing while virtual mode', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex -1).toBe(18);
        });
        it('downArrow shortcut testing while virtual mode', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex +1).toBe(20);
        });
    });
    describe('Selection issue after collpasing', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    enableVirtualization: true,
                    selectedRowIndex: 1,
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
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('selection after collpasing', () => {
            ((ganttObj.treeGrid.getRows()[1] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
            ((ganttObj.treeGrid.getRows()[1] as HTMLTableRowElement).getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
            let element: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(1);
        });
    });
    describe('Selection without editmoudle', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    enableVirtualization: true,
                    selectedRowIndex: 1,
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
                    allowSelection: true,
                    allowSorting: true,
                    allowFiltering: true,
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('selection without editmoudle', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            let row1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10);
            triggerMouseEvent(row1, 'mouseup', 30, 30);
            expect(ganttObj.selectionModule.getSelectedRowIndexes()[0]).toBe(4);
        });
    });
    describe('Selection with persist selectin and without toggle', () => {
        let ganttObj: Gantt;
        let projectNewData = [
            { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false,
                        persistSelection: true,
                    }
                }, done);
        });
        it('selection without toggle', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10);
            triggerMouseEvent(row, 'mouseup', 10, 10);
            expect(ganttObj.ganttChartModule.getChartRows()[0].classList.contains('e-active')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('MT:918141-After sorting and deleting a task, selection is moved to last row', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                allowSorting: true,
                sortSettings: { columns: [{ field: 'TaskID', direction: 'Descending' }] },
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
                    allowTaskbarEditing: true
                },
                columns: [
                    { field: 'TaskID', width: 100 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                splitterSettings: {
                    position: "50%",
                },
                allowFiltering: true,
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
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('deleting Row after descending sort action', () => {
            // CurrentViewData length before row delete action
            expect(ganttObj.currentViewData.length).toBe(11);
            ganttObj.selectionModule.selectRow(3);
            let args: any = { action: 'delete', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(ganttObj.selectedRowIndex).toBe(3);
            // CurrentViewData length after row delete action
            expect(ganttObj.currentViewData.length).toBe(10);
        });
    });
});
