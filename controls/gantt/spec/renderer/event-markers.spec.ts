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
                eventMarkers: [{ day: '10/30/2017', label: 'project start', top:'5px', cssClass: 'stripLine' }],
            }, done);
        });

        it('Holiday Testing ', () => {
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0][style].width).toBe('180px');
            expect(ganttObj.element.querySelector('.e-holiday-container').children[0].children[0].textContent).toBe('public holiday');
            expect(ganttObj.element.querySelector('.e-event-markers.stripLine .e-span-label')['style'].top).toBe('5px');
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
    describe('CR:1023884-When timezone is specified, the EventMarker date is rendered at an incorrect position', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    { TaskID: 1, TaskName: "Product concept", StartDate: new Date("03/31/2025"), EndDate: new Date("04/08/2025") },
                    { TaskID: 2, TaskName: "Define the product usage", StartDate: new Date("03/31/2025"), EndDate: new Date("04/08/2025"), Duration: 1, Progress: 30, ParentId: 1 },
                ],
                height: '650px',
                rowHeight: 46,
                taskbarHeight: 25,
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId'
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'EEE MMM dd'
                    },
                    bottomTier: {
                        unit: 'Day',
                        format: ''
                    }
                },
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Predecessor' },
                    { field: 'Progress' },
                ],
                timezone: "America/Phoenix",
                eventMarkers: [
                    {
                        day: new Date("04/01/2025"),
                        label: "Product Concept Analysis"
                    },
                    {
                        day: new Date("04/07/2025"),
                        label: "Research Phase"
                    },
                    {
                        day: new Date("04/07/2025"),
                        label: "Demand Analysis",
                        top: '150px'
                    },
                ],
                labelSettings: {
                    leftLabel: 'TaskName'
                },
                projectStartDate: new Date('03/26/2025'),
                projectEndDate: new Date('07/20/2025')
            }, done);
        });
        it('Checking event marker rendered left value in UI', () => {
            expect(ganttObj.eventMarkerColloction.length).toBe(3);
            expect(ganttObj.eventMarkerColloction[0].left).toBe(198);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Event Marker Date Format Scenarios', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    { TaskID: 1, TaskName: "Task 1", StartDate: new Date("03/31/2025"), EndDate: new Date("04/08/2025") },
                ],
                height: '650px',
                rowHeight: 46,
                taskbarHeight: 25,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId'
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'EEE MMM dd'
                    },
                    bottomTier: {
                        unit: 'Day',
                        format: ''
                    }
                },
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Predecessor' },
                    { field: 'Progress' },
                ],
                labelSettings: {
                    leftLabel: 'TaskName'
                },
                projectStartDate: new Date('03/26/2025'),
                projectEndDate: new Date('07/20/2025')
            }, done);
        })
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Test ISO string format (YYYY-MM-DD)', () => {
            ganttObj.eventMarkers = [
                {
                    day: "2025-04-01",
                    label: "ISO String Format"
                }
            ];
            ganttObj.dataBind();
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
        it('should handle space-separated date and time', () => {
            ganttObj.eventMarkers = [
                {
                    day: "2025-04-01 14:30:00",
                    label: "ISO String Format"
                }
            ];
            ganttObj.dataBind();
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
        it('Test ISO Date object format (new Date("2025-04-01"))', () => {
            ganttObj.eventMarkers = [
                {
                    day: new Date("2025-04-01"),
                    label: "ISO Date Object Format"
                }
            ];
            ganttObj.dataBind();
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
         it('should return true for string input with : and non-zero hour', () => {
            const input = "2025-04-01T14:00:00";
            const result = (ganttObj as any).dayMarkersModule.eventMarkerRender.hasExplicitTime(input);
            expect(result).toBe(true);
        });
        it('Test ISO string with explicit time', () => {
            ganttObj.eventMarkers = [
                {
                    day: "2025-04-01T14:30:00",
                    label: "ISO String With Explicit Time"
                }
            ];
            ganttObj.dataBind();
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
        it('Test ISO string fomrat - normalizeToTimezone call', () => {
            let date: Date = new Date("2025-04-01");
            let input: string = "2025-04-01";
            (ganttObj as any).dayMarkersModule.eventMarkerRender.normalizeToTimezone(date, input);
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
        it('Test ISO object format - normalizeToTimezone call', () => {
            let date: Date = new Date("2025-04-01");
            let input: Date = new Date("2025-04-01");
            (ganttObj as any).dayMarkersModule.eventMarkerRender.normalizeToTimezone(date, input);
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
        it('should return true for ISO Object format with UTC midnight time', () => {
            const input = new Date("2025-04-01T00:00:00");
            const dateObj = new Date("2025-04-01T00:00:00");
            (ganttObj as any).dayMarkersModule.eventMarkerRender.isDateOnlyInput(input, dateObj);
            expect(ganttObj.eventMarkerColloction.length).toBe(1);
        });
    });
});
