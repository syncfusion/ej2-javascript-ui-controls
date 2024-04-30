/**
 * Custom binding spec
 */
import { Gantt, Edit, Toolbar, Selection, Filter } from '../../src/index';
import { selfReference } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
Gantt.Inject(Edit, Toolbar, Selection, Filter);
describe('Gantt custom binding', () => {
    describe('Gantt custom binding', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: { result: selfReference, count: 15 },
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        parentID: 'parentID'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: false
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan'],
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Add record', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.flatData.length).toBe(16);
               }
               done();
            };
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
            triggerMouseEvent(save, 'click');           
        });
        it('Update record', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Task');
                }
                done();
            };
            ganttObj.updateRecordByID({TaskID: 2, TaskName: 'Updated Task'});
        });

        it('Delete record', (done: Function) => {
            ganttObj.selectionModule.selectRow(10);
            let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteToolbar, 'click');
            let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog').getElementsByClassName('e-primary')[0] as HTMLElement;
            triggerMouseEvent(okElement, 'click');
            expect(ganttObj.flatData.length).toBe(10);
            ganttObj.selectionModule.clearSelection();
            done()
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt custom binding', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: { result: selfReference, count: 15 },
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        parentID: 'parentID'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: false
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan'],
                }, done);
        });
        it('Data loading', () => {
            expect(ganttObj.flatData.length).toBe(15);
        });
        it('Expand record', () => {
            let expandallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_expandall') as HTMLElement;
            triggerMouseEvent(expandallToolbar, 'click');
            expect(ganttObj.flatData[1].expanded).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});
