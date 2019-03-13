/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Gantt } from '../../src/index';
import { unscheduledData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
describe('Gantt - Base', () => {

    describe('Gantt base module', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                allowSelection: true,
                dataSource: unscheduledData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('control class testing', () => {
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(true);
        });
        it('get component name testing', () => {
            expect(ganttObj.getModuleName()).toEqual('gantt');
        });
        it('property change check', () => {
            ganttObj.allowSelection = false;
            expect(ganttObj.allowSelection).toEqual(false);
        });
        it('check destroy method', () => {
            ganttObj.destroy();
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(false);
        });
        it('control class testing', () => {
            let htmlElement: HTMLElement = createElement('div', { id: 'GanttHtmlCheck' });
            ganttObj = new Gantt({
                allowSelection: true,
                dataBound: () => {
                    expect(htmlElement.classList.contains('e-gantt')).toEqual(true);
                }
            }, htmlElement);
        });
    });
});
