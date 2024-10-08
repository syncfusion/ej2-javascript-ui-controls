/**
 * Gantt delete spec
 */
import { Gantt, IActionBeginEventArgs, IGanttData, Edit, Toolbar, Selection } from '../../src/index';
import { projectData1, CR900218 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
import { doesImplementInterface } from '@syncfusion/ej2-grids';
describe('Gantt delete support', () => {
    describe('Gantt delete action', () => {
        Gantt.Inject(Edit, Toolbar, Selection);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
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
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    actionBegin: (args: IActionBeginEventArgs) => {

                    }
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Delete a record that has parent & child links', () => {
            ganttObj.editModule.deleteRecord(6);
            expect(getValue('TaskID', ganttObj.flatData[5])).toBe(51);
        });
        it('Delete a child record which has no siblings', () => {
            ganttObj.editModule.deleteRecord(52);
            expect(getValue('TaskID', ganttObj.flatData[6])).toBe(7);
        });
        it('Delete a parent record - parameter: object type', () => {
            let task1: IGanttData = ganttObj.getRecordByID("2");
            ganttObj.editModule.deleteRecord(task1);
            expect(getValue('TaskID', ganttObj.flatData[1])).toBe(7);
        });
        it('Delete a parent record with grand child - parameter: array type', () => {
            ganttObj.editModule.deleteRecord([13]);
            expect(getValue('TaskID', ganttObj.flatData[7])).toBe(21);
        });
        it('Deleting through selected items', () => {
            let task1: IGanttData = ganttObj.getRecordByID("32");
            let task2: IGanttData = ganttObj.getRecordByID("30");
            let records: IGanttData[] = [task1, task2, task1];
            ganttObj.editModule.deleteRecord(records);
            expect(getValue('TaskID', ganttObj.flatData[ganttObj.flatData.length - 3])).toBe(37);
        });
        it('Select a row and delete through toolbar', (done: Function) => {
            ganttObj.dataSource = JSON.parse(JSON.stringify(projectData1));
            ganttObj.dataBound = () => {
                ganttObj.selectionModule.selectRow(ganttObj.flatData.length - 2);
                let deleteElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
                triggerMouseEvent(deleteElement, 'click');
                // Click cancel button
                let cancelElement: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_deleteConfirmDialog div.e-footer-content button')[1] as HTMLElement;
                triggerMouseEvent(cancelElement, 'click');
                triggerMouseEvent(deleteElement, 'click');
                // Click OK button
                let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog div.e-footer-content button') as HTMLElement;
                triggerMouseEvent(okElement, 'click');
                expect(getValue('TaskID', ganttObj.flatData[ganttObj.flatData.length - 1])).toBe(39);
                done();
            }
            ganttObj.refresh();
        }, 1000);
        it('Select a cell in a row and delete through toolbar', () => {
            ganttObj.selectionSettings.mode = 'Cell';
            ganttObj.dataBind();
            let rowElement: NodeListOf<Element> = ganttObj.element.querySelectorAll('#' + 'treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr') as NodeListOf<Element>;
            let td: HTMLElement = rowElement[3].children[1] as HTMLElement;
            triggerMouseEvent(td, 'click');
            let deleteElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteElement, 'click');
            // Click OK button
            let okElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_deleteConfirmDialog div.e-footer-content button') as HTMLElement;
            triggerMouseEvent(okElement, 'click');
            expect(getValue('TaskID', ganttObj.flatData[ganttObj.flatData.length - 1])).toBe(39);
        });
        // it('args cancel true in actionBegin event', (done: Function) => {
        //     ganttObj.dataSource = JSON.parse(JSON.stringify(projectData1));
        //     ganttObj.actionBegin = (args: IActionBeginEventArgs) => {
        //         if (args.requestType === 'beforeDelete') {
        //             args.cancel = true;
        //         }
        //     };
        //     ganttObj.dataBound = () => {
        //         ganttObj.editModule.deleteRecord(39);
        //         expect(getValue('TaskID', ganttObj.flatData[ganttObj.flatData.length - 1])).toBe(39);
        //         done();
        //     };
        //     ganttObj.refresh();
        // }, 1000);
    });
    
    describe('Selection maintaining after Gantt delete action', () => {
        Gantt.Inject(Edit, Toolbar, Selection);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
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
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true
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
        it('Delete a record', () => {
            ganttObj.editModule.deleteRecord(6);
            expect(getValue('TaskID', ganttObj.flatData[5])).toBe(51);
            expect(ganttObj.selectedRowIndex).toBe(5);
        });
    });
    describe('CR900218-Updating datasource and selected row index', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [],
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    },
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple',
                        enableToggle: true,
                    },
                    selectedRowIndex: 1, 
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
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
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Changing DataSource', (done: Function) => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.selectedRowIndex).toBe(2);
                done();
            };
            ganttObj.dataSource = CR900218;
            ganttObj.selectedRowIndex = 2;
        });
    });
});