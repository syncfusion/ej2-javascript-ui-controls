/**
 * Gantt grid line spec
 */
import { Gantt } from '../../src/index';
import { defaultGanttData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
describe('Gantt grid line support', () => {
    describe('Gantt grid lines', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: defaultGanttData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                    },
                    projectStartDate: new Date('02/01/2018'),
                    projectEndDate: new Date('04/30/2018'),
                    gridLines: 'Both',
                    highlightWeekends: true,
                }, done);
        });
        it('Render TreeGrid part with Horizontal grid lines', () => {
            ganttObj.gridLines = 'Horizontal';
        });
        it('Render Chart part with Vertical grid lines 1', () => {
            ganttObj.gridLines = 'Vertical';
        });
        it('Render Chart part with Both grid lines 1', () => {
            ganttObj.gridLines = 'Both';
        });
        it('Render Chart part with no grid lines 1', () => {
            ganttObj.gridLines = 'None';
        });
        it('Render Chart part with Vertical grid lines 2', () => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Vertical';
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt grid lines', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: defaultGanttData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                    },
                    projectStartDate: new Date('02/01/2018'),
                    projectEndDate: new Date('04/30/2018'),
                    gridLines: 'Both',
                    highlightWeekends: true,
                }, done);
        });
        it('Render Chart part with Horizontal grid lines 1', () => {
            ganttObj.gridLines = 'Horizontal';
        });
        it('Render Chart part with Vertical grid lines 3', () => {
            ganttObj.gridLines = 'Vertical';
        });
        it('Render Chart part with Both grid lines 2', () => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Both';
        });
        it('Render Chart part with no grid lines 2', () => {
            ganttObj.gridLines = 'None';
        });
        it('Render Chart part with Both grid lines 3', () => {
            ganttObj.gridLines = 'Both';
        });
        it('Change chart header timeline', () => {
            ganttObj.timelineSettings = {
                bottomTier: {
                    unit: 'Day',
                    format: 'dd, MMM',
                    count: 2
                },
                topTier: {
                    unit: 'None',
                }
            }
        });
        it('Render Chart part with Vertical grid lines 4', () => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Vertical';
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Render Gantt with empty data source', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: '',
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                    },
                    projectStartDate: new Date('02/01/2018'),
                    projectEndDate: new Date('04/30/2018'),
                    gridLines: 'Both',
                    highlightWeekends: true,
                }, done);
        });
        it('Vertical gridlines are render even with empty data source', () => {
           ganttObj.gridLines = 'Both';
           ganttObj.chartVerticalLineContainer = null;
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});