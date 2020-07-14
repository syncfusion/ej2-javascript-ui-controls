/**
 * Gantt Drag and drop spec
 */
import { Gantt, Edit, Selection, IGanttData, RowDD } from '../../src/index';
import { dragSelfReferenceData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';

Gantt.Inject(Edit, Selection, RowDD);
describe('Gantt Drag and Drop support', () => {
    describe('SelfReference data binding', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: dragSelfReferenceData,
                    height: '450px',
                    allowRowDragAndDrop: true,
                    highlightWeekends: true,
                    allowSelection: true,
                    treeColumnIndex: 1,
                    taskFields: {
                        id: 'taskID',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        duration: 'duration',
                        progress: 'progress',
                        dependency: 'predecessor',
                        parentID: 'parentID'
                    },
                    columns: [
                        { field: 'taskID', width: 60 },
                        { field: 'taskName', width: 250 },
                        { field: 'startDate' },
                        { field: 'endDate' },
                        { field: 'duration' },
                        { field: 'predecessor' },
                        { field: 'progress' },
                    ],
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true
                    },
                    labelSettings: {
                        leftLabel: 'taskName'
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    projectStartDate: new Date('01/28/2019'),
                    projectEndDate: new Date('03/10/2019')
                }, done);
        });
        afterAll(() => {
            if (ganttObj_self) {
                destroyGantt(ganttObj_self);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        it('Drag and drop parent record to another parent record', () => {
            ganttObj_self.reorderRows([1], 6, 'child');
            expect(parseInt(ganttObj_self.currentViewData[6].ganttProperties.parentId)).toBe(7);
            expect(ganttObj_self.currentViewData[6][ganttObj_self.taskFields.parentID]).toBe(7);
            expect(ganttObj_self.currentViewData[6].taskData[ganttObj_self.taskFields.parentID]).toBe(7);
        });
    });
});
