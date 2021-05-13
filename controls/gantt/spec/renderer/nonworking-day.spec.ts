/**
 * Gantt base spec
 */
import { Gantt, DayMarkers } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
describe('Gantt spec for non -working-day', () => {
    describe('Gantt base module', () => {
        Gantt.Inject(DayMarkers);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
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
                workWeek: ['Tuesday'],
                renderBaseline: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 2
                    },
                    timelineUnitSize: 60,
                    weekStartDay: 2
                },
                holidays: [{
                    from: '10/15/2017',
                    to: '10/20/2017',
                    label: 'public holiday',
                    cssClass: 'holiday'
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                }],
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Non-working-Day Testing', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "refresh") {
                    expect(ganttObj.ganttChartModule.chartBodyContainer.querySelector(`.${cls.nonworkingContainer}`)).toBe(null);
                    expect(ganttObj.ganttChartModule.chartBodyContainer.querySelector(`.${cls.holidayContainer}`)).toBe(null); 
                }
            };
            ganttObj.dataBind();
            expect(ganttObj.ganttChartModule.chartBodyContainer.querySelector(`.${cls.holidayElement}`)['style'].width).toBe('180px');
            expect(ganttObj.ganttChartModule.chartBodyContainer.querySelector(`.${cls.holidayElement}`).textContent).toBe('public holiday');
            expect(ganttObj.ganttChartModule.chartBodyContainer.querySelector(`.${cls.holidayElement}`).
                classList.contains('holiday')).toBe(true);
            let holidayObj: Array<Object> = [{
                from: '10/20/2017',
                to: '10/25/2017',
            }];
            ganttObj.holidays = holidayObj;
            ganttObj.dataBind();
            ganttObj.holidays = [];
            ganttObj.dataBind();
           });
    });
});