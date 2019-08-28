
import { Gantt, Selection } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { RowSelectingEventArgs } from '@syncfusion/ej2-grids';
Gantt.Inject(Selection);

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
            let cell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(cell, 'click', 10, 10);
            triggerMouseEvent(cell, 'click', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Deselect row', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            triggerMouseEvent(row, 'mouseup', 10, 10, false, true);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(0);
        });
        it('Select rows by clicking on chart side', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-left-label-container') as HTMLElement;
            let row1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(row, 'mouseup', 10, 10);
            triggerMouseEvent(row1, 'mouseup', 30, 30);
            expect(ganttObj.selectionModule.getSelectedRowIndexes()[0]).toBe(4);
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
});