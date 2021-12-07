/**
 * Gantt chart-scroll spec
 */
import { Gantt } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerScrollEvent } from '../base/gantt-util.spec';
describe('Gantt chart-scroll support', () => {
    describe('Gantt chart-scroll action', () => {
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
                        dependency: 'Predecessor'
                    },
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

        it('Set scrollTop using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setScrollTop(300);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(300);
        });

        it('Set ChartScroll Width using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setWidth(400);
            expect(ganttObj.ganttChartModule.scrollElement.style.width).toBe('400px');
        });

        it('Set scroll left for scroll container using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setScrollLeft(500);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(500);
        });

        it('Chart scroll Function', () => {
            let chartscroll: HTMLElement = ganttObj.element.querySelector('.e-chart-scroll-container') as HTMLElement;
            triggerScrollEvent(chartscroll,500,700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(500);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(700);
        });

        it('Treegrid scroll Function', () => {
            let gridscroll: HTMLElement = ganttObj.treeGrid.element.querySelector('.e-content') as HTMLElement;
            triggerScrollEvent(gridscroll, 50);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(50);
        });

        it('Update Chart Scroll Value by public method', () => {
            ganttObj.updateChartScrollOffset(400,700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(400);
        });
    });
});