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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Render TreeGrid part with Horizontal grid lines', (done:Function) => {
            ganttObj.gridLines = 'Horizontal';
            done();
        });
        it('Render Chart part with Vertical grid lines 1', (done:Function) => {
            ganttObj.gridLines = 'Vertical';
            done();
        });
        it('Render Chart part with Both grid lines 1', (done:Function) => {
            ganttObj.gridLines = 'Both';
            done();
        });
        it('Render Chart part with no grid lines 1', (done:Function) => {
            ganttObj.gridLines = 'None';
            done();
        });
        it('Render Chart part with Vertical grid lines 2', (done:Function) => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Vertical';
            done();
        });
        it('Render Chart part with Horizontal grid lines 1', (done:Function) => {
            ganttObj.gridLines = 'Horizontal';
            done();
        });
        it('Render Chart part with Vertical grid lines 3', (done:Function) => {
            ganttObj.gridLines = 'Vertical';
            done();
        });
        it('Render Chart part with Both grid lines 2', (done:Function) => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Both';
            done();
        });
        it('Render Chart part with no grid lines 2', (done:Function) => {
            ganttObj.gridLines = 'None';
            done();
        });
        it('Render Chart part with Both grid lines 3', (done:Function) => {
            ganttObj.gridLines = 'Both';
            done();
        });
        it('Change chart header timeline', (done: Function) => {
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
            done();
        });
        it('Render Chart part with Vertical grid lines 4', (done:Function) => {
            ganttObj.chartVerticalLineContainer = null;
            ganttObj.gridLines = 'Vertical';
            done();
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Vertical gridlines are render even with empty data source', (done:Function) => {
           ganttObj.gridLines = 'Both';
           ganttObj.chartVerticalLineContainer = null;
           done();
        });
    });

});