/**
 * Gantt column reorder spec
 */
import { Gantt, Reorder } from '../../src/index';
import { baselineData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ColumnDragEventArgs } from '@syncfusion/ej2-grids';
Gantt.Inject(Reorder);
describe('Gantt column reorder support', () => {
    describe('Gantt column reorder action', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: baselineData,
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children'
                    },
                    allowReordering: true,
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Column reorder - Public method', () => {
            expect(ganttObj.treeGrid.getColumns()[1].field).toBe('TaskName');
            expect(ganttObj.treeGrid.getColumns()[3].field).toBe('EndDate');
            ganttObj.reorderColumns('TaskName', 'EndDate');
            expect(ganttObj.treeGrid.getColumns()[1].field).toBe('StartDate');
            expect(ganttObj.treeGrid.getColumns()[3].field).toBe('TaskName');
        });
        it('Perform Column reorder', () => {
            ganttObj.columnDragStart = (args: ColumnDragEventArgs) => {
                expect(args.column.field).toBe('StartDate');
                expect(args['name']).toBe('columnDragStart');
            };
            ganttObj.columnDrag = (args: ColumnDragEventArgs) => {
                expect(args.column.field).toBe('StartDate');
                expect(args['name']).toBe('columnDrag');
            };
            ganttObj.columnDrop = (args: ColumnDragEventArgs) => {
                expect(args.column.field).toBe('StartDate');
                expect(args['name']).toBe('columnDrop');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector(
                '#treeGrid' + ganttObj.element.id + '_gridcontrol > div.e-gridheader.e-lib.e-droppable > div > table > thead > tr > th:nth-child(2)') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 10);
            triggerMouseEvent(dragElement, 'mousemove', 200, 10);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.treeGrid.getColumns()[1].field).toBe('StartDate');
            expect(ganttObj.treeGrid.getColumns()[3].field).toBe('TaskName');
        });
    });
});
