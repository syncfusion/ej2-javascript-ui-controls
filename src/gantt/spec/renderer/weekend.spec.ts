/**
 * Gantt base spec
 */
import { Gantt, DayMarkers } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
describe('Gantt spec for weekend', () => {
    describe('Weekend rendering', () => {
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
                highlightWeekends: true,
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
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Weekend Testing ', () => {
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].width).toBe('30px');
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].height).toBe('100%');
            ganttObj.holidays = [];
            ganttObj.highlightWeekends = false;
            ganttObj.dataBind();
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.nonworkingContainer}`)).toBe(null);
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekendContainer}`)).toBe(null);
        });
    });
});