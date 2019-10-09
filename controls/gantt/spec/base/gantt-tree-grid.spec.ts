/**
 * Gantt base spec
 */
import { Gantt, ColumnMenu } from '../../src/index';
import { baselineData } from './data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
describe('Gantt spec for  scroll', () => {
    Gantt.Inject(ColumnMenu);
    describe('Gantt base module', () => {        
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                autoFocusTasks: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
                renderBaseline: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day'
                    },
                    timelineUnitSize: 60,
                    weekStartDay: 1
                }
            }, done);

        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Scroll-Task-Date Testing', () => {
            ganttObj.ganttChartModule.scrollElement.scrollLeft = 100;
            ganttObj.scrollToDate('10/23/2017');
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(0);
        });
        it('Scroll-Task-ID Testing', () => {
            ganttObj.ganttChartModule.scrollElement.scrollLeft = 800;
            ganttObj.scrollToTask('3');
            //expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
        });
        it('gantt-Chart-Click Testing', () => {
            let element: HTMLElement = ganttObj.element.querySelector('.e-grid .e-content tbody tr td') as HTMLElement;
            ganttObj.ganttChartModule.scrollElement.scrollLeft = 300;
            element.click();
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(0);
            ganttObj.scrollToDate('1/03/2019');
        });
        it('Scroll-Task Testing', () => {
            let element: HTMLElement = ganttObj.treeGridPane.querySelectorAll('.e-table')[1]['rows'][2].cells[0] as HTMLElement;
            element.click();
            //expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
        });
        it('Column menu click', () => {
            ganttObj.showColumnMenu = true;
            ganttObj.refresh();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol > div.e-gridheader.e-lib.e-droppable > div > table > thead > tr > th:nth-child(1) > div.e-icons.e-columnmenu') as HTMLElement;
            element.click();
         });
    });

});