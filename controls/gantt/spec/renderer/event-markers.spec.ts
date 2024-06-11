/**
 * Gantt base spec
 */
import { Gantt, Edit, CriticalPath, ContextMenu, ContextMenuClickEventArgs, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport, ITaskbarEditedEventArgs } from '../../src/index';
import { baselineData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
Gantt.Inject(Edit, CriticalPath, ContextMenu, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport);

describe('Gantt spec for Event-Marker', () => {
    describe('Gantt base module', () => {
        let ganttObj: Gantt;
        let style: string = 'style';
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
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                    cssClass: 'holidays'
                }],
                rowHeight: 40,
                taskbarHeight: 30,
                height: 500,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
                eventMarkers: [{ day: '10/30/2017', label: 'project start', cssClass: 'stripLine' }],
            }, done);
        });
        it('control class testing', () => {
            expect(ganttObj.element.querySelector('.e-event-markers-container').children[0][style].left).toBe('450px');
            expect(ganttObj.element.querySelector('.e-event-markers-container').children[0].children[0].textContent).toBe('project start');
            expect(ganttObj.element.querySelector('.e-event-markers-container').children[0].classList.contains('stripLine')).toEqual(true);
            let arrayobj: any = [{ day: '10/15/2017', label: 'welcome' }];
            ganttObj.eventMarkers = arrayobj;
            ganttObj.dataBind();
            ganttObj.eventMarkers = [];
            ganttObj.dataBind();
        });
        it('Holiday Testing ', () => {
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0][style].width).toBe('180px');
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0].children[0].textContent).toBe('public holiday');
        });
        it('Aria-label Testing ', () => {
            let arrayobj: any = [{ day: '10/30/2017', label: 'project start', cssClass: 'stripLine' }];
            ganttObj.eventMarkers = arrayobj;
            ganttObj.dataBind();
            expect(ganttObj.element.querySelector('.e-event-markers-container').children[0].getAttribute('aria-label').indexOf('Event markers 10/30/2017 project start') > -1).toBeTruthy();
            let arrayobj1: any = [{ day: new Date('10/30/2017'), label: 'project start', cssClass: 'stripLine' }];
            ganttObj.eventMarkers = arrayobj1;
            ganttObj.dataBind();
            expect(ganttObj.element.querySelector('.e-event-markers-container').children[0].getAttribute('aria-label').indexOf('Event markers 10/30/2017 project start') > -1).toBeTruthy();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt base module with RTL', () => {
        let ganttObj: Gantt;
        let style: string = 'style';
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
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                    cssClass: 'holidays'
                }],
                enableRtl: true,
                highlightWeekends: true,
                disableHtmlEncode: false,
                rowHeight: 40,
                taskbarHeight: 30,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
                eventMarkers: [{ day: '10/30/2017', label: 'project start', cssClass: 'stripLine' }],
            }, done);
        });
        it('Holiday Testing ', () => {
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0][style].width).toBe('180px');
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0].children[0].textContent).toBe('public holiday');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

    });
    describe('Gantt base module', () => {
        let ganttObj: Gantt;
        let style: string = 'style';
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
                enableHtmlSanitizer: false,
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
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                    cssClass: 'holidays'
                }],
                rowHeight: 40,
                taskbarHeight: 30,
                height: 500,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
                eventMarkers: [{ day: '10/30/2017', label: 'project start', cssClass: 'stripLine' }],
            }, done);
        });

        it('Holiday Testing ', () => {
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0][style].width).toBe('180px');
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0].children[0].textContent).toBe('public holiday');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt event marker as null', () => {
        let ganttObj: Gantt;
        let style: string = 'style';
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
                enableHtmlSanitizer: false,
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
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                    cssClass: 'holidays'
                }],
                rowHeight: 40,
                taskbarHeight: 30,
                height: 500,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
                eventMarkers: [{ day: null , label: 'project start', cssClass: 'stripLine' }],
            }, done);
        });

        it('Event Marker as null ', () => {
            expect(ganttObj.eventMarkerColloction.length).toBe(0);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});
