/**
 * Gantt column resize spec
 */
import { Gantt,UndoRedo, Resize,Edit,Toolbar, RowDD,Filter, ContextMenu, } from '../../src/index';
import { baselineData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ResizeArgs } from '@syncfusion/ej2-grids';
describe('Gantt column resize support', () => {
    describe('Gantt column resize action', () => {
        Gantt.Inject(Resize,UndoRedo,Edit,Toolbar, RowDD,Filter, ContextMenu,);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: baselineData,
                    allowResizing: true,
                    enableUndoRedo: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search','ZoomIn','ZoomOut'],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                        'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children'
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Perform Column resize', () => {
            ganttObj.resizeStart = (args: ResizeArgs) => {
                expect(args.column.field).toBe('TaskId');
                expect(args['name']).toBe('resizeStart');
            };
            ganttObj.resizing = (args: ResizeArgs) => {
                expect(args.column.field).toBe('TaskId');
                expect(args['name']).toBe('resizing');
            };
            ganttObj.resizeStop = (args: ResizeArgs) => {
                expect(args.column.field).toBe('TaskId');
                expect(args['name']).toBe('resizeStop');
            };
            ganttObj.dataBind();
            let resizeColumn: HTMLElement = ganttObj.element.getElementsByClassName('e-columnheader')[0].getElementsByClassName('e-rhandler e-rcursor')[0] as HTMLElement;
            triggerMouseEvent(resizeColumn, 'mousedown');
            triggerMouseEvent(resizeColumn, 'mousemove', 100);
            triggerMouseEvent(resizeColumn, 'mouseup');
            const args: any = {
                column: ganttObj.treeGrid.columns[0]
            };
            ganttObj.treeGrid.resizeStop(args);
            ganttObj.undo();
        });
    });
});