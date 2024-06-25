
import { Gantt, Selection, Toolbar } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { RowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { getValue } from  '@syncfusion/ej2-base';
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
});
