/**
 * Schedule data module
 */
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, ScheduleModel, View } from '../../../src/schedule/index';
import { defaultData, timezoneData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Data module', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Locale data testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
            schObj = util.createSchedule(model, defaultData, done);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Remote data testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify({ d: defaultData, __count: 15 }), {
                    status: 200
                })
            ));
            const dataManager: DataManager = new DataManager({ url: 'api/Schedule/Events/' });
            const model: ScheduleModel = { eventSettings: { query: new Query().take(5) } };
            schObj = util.createSchedule(model, dataManager, done);
        });

        it('Events data generated testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBe(0);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('actionFailure testing', () => {
        const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let schObj: Schedule;
        beforeAll(() => {
            const dataManager: DataManager = new DataManager({ url: 'api/Schedule/Events/' });
            const model: ScheduleModel = { actionFailure: actionFailedFunction };
            schObj = util.createSchedule(model, dataManager);
        });
        beforeEach((done: DoneFn) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 404,
                headers: { 'Content-type': 'application/json' },
                statusText: 'Page not found'
            }));
            done();
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Timezone in schedule testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { timezone: 'America/New_York' };
            schObj = util.createSchedule(model, defaultData, done);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        afterAll(() => {
            util.destroy(schObj);
        });
    });

    describe('Timezone in local data testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            schObj = util.createSchedule({}, timezoneData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });
    });

    describe('Timezone in schedule and local data testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 16), timezone: 'America/New_York' };
            schObj = util.createSchedule(model, timezoneData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Generate query testing', () => {
            expect(schObj.dataModule.generateQuery() instanceof Query).toBe(true);
        });

        it('edit schedule timezone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('edit starttimezone alone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('edit endtimezone alone event testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('Resource header template refresh', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 0, 4),
                height: '500px',
                width: '800px',
                currentView: 'TimelineDay',
                views: [
                    { option: 'TimelineDay', allowVirtualScrolling: true },
                    { option: 'TimelineWeek', allowVirtualScrolling: true },
                    { option: 'Month', allowVirtualScrolling: true }
                ],
                group: {
                    resources: ['Owners'],
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 4, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 5, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 6, GroupID: 1, Color: '#7499e1' }
                        ]
                    }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
    
        afterAll(() => {
            util.destroy(schObj);
        });
    
        it('should call the renderCell method on refresh', (done: DoneFn) => {
            const renderCellSpy = jasmine.createSpy('renderCell');
            schObj.appendTo('#Schedule');
            schObj.addEventListener('renderCell', renderCellSpy);
            schObj.refreshTemplates('resourceHeaderTemplate');
        
            setTimeout(() => {
                expect(renderCellSpy).toHaveBeenCalled();
                schObj.removeEventListener('renderCell', renderCellSpy);
                done();
            }, 100);
        });
    });

    describe('refreshTemplate checking', () => {
        let schObj: Schedule;
        const dateHeaderTemplate: string = '<span>~${getDateHeaderText(data.date)}~</span>';

        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2020, 0, 4),
                width: '800px',
                group: { resources: ['Owners'] },
                resources: [
                    {
                        field: 'OwnerId', name: 'Owners',
                        dataSource: [
                            { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 4, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 5, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 6, GroupID: 1, Color: '#7499e1' }
                        ]
                    }
                ],
                dateHeaderTemplate: dateHeaderTemplate,
                timeScale: { enable: true, interval: 360, slotCount: 2 },
                views: [
                    { option: 'TimelineDay', interval: 3 },
                    { option: 'Month' },
                ],
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('refresh templates testing after scrolling in TimelineDay view', (done: DoneFn) => {
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 292;
            schObj.refreshTemplates('dateHeaderTemplate');
            expect(schObj.element.querySelector('.e-date-header-wrap').scrollLeft).toEqual(schObj.element.querySelector('.e-content-wrap').scrollLeft);
            schObj.currentView = 'Month';
            schObj.dataBind();
            done();
        });

        it('refresh templates testing after scrolling in Month view', (done: DoneFn) => {
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 292;
            schObj.refreshTemplates('dateHeaderTemplate');
            expect(schObj.element.querySelector('.e-date-header-wrap').scrollLeft).toEqual(schObj.element.querySelector('.e-content-wrap').scrollLeft);
            done();
        });
    });

    describe('refreshTemplates checking on virtual scrolling', () => {
        let schObj: Schedule;
        const resourceHeaderTemplate: string = '<span>ResourceHeaderTemplate</span>';

        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2020, 0, 4),
                width: '800px',
                height: '500px',
                group: { resources: ['Owners'] },
                resources: [
                    {
                        field: 'OwnerId', name: 'Owners',
                        dataSource: [
                            { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 4, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 5, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 6, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 7, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 8, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 9, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 10, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 11, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 12, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 13, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 14, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 15, GroupID: 1, Color: '#7499e1' },
                            { Text: 'Nancy', Id: 16, GroupID: 1, Color: '#ffaa00' },
                            { Text: 'Steven', Id: 17, GroupID: 2, Color: '#f8a398' },
                            { Text: 'Michael', Id: 18, GroupID: 1, Color: '#7499e1' }
                        ]
                    }
                ],
                resourceHeaderTemplate: resourceHeaderTemplate,
                views: [
                    { option: 'TimelineDay' },
                ],
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('refresh templates of resourceHeader testing after scrolling in Timeline views', (done: DoneFn) => {
            schObj.element.querySelector('.e-content-wrap').scrollTop = 700;
            schObj.refreshTemplates('resourceHeaderTemplate');
            expect(schObj.element.querySelector('.e-resource-column-wrap').scrollTop).toEqual(schObj.element.querySelector('.e-content-wrap').scrollTop);
            done();
        });
    });

    describe('Schedule Date Range Calendar Week Number Testing', function () {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Testing',
            StartTime: new Date(2023, 0, 1, 9, 0),
            EndTime: new Date(2023, 0, 1, 10, 30)
        }];
        beforeAll(function (done: DoneFn) {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                showWeekNumber: true,
                selectedDate: new Date(2023, 0, 1),
                currentView: 'Week',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'Year', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                eventSettings: { dataSource: eventData }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(function () {
            util.destroy(schObj);
        });
        function testWeekNumberInView(view: View) {
            it(`Checking week number in date range calendar popup for ${view} view`, function (done: DoneFn) {
                schObj.currentView = view;
                schObj.dataBind();
                const dateRangeElement: HTMLElement = schObj.element.querySelector('.e-date-range') as HTMLElement;
                util.triggerMouseEvent(dateRangeElement, 'click');
                const popupWrapper: HTMLElement | null = document.querySelector('.e-header-calendar');
                const weekNumberElements: NodeListOf<Element> = popupWrapper.querySelectorAll('.e-cell.e-week-number');
                if (view === 'Month' || view === 'Year' || view === 'TimelineMonth') {
                    expect(popupWrapper).not.toBeNull();
                    expect(weekNumberElements.length).toBe(0);
                } else {
                    expect(popupWrapper).not.toBeNull();
                    expect(weekNumberElements.length).toBeGreaterThan(0);
                    expect(weekNumberElements[1].innerHTML.trim()).toBe('<span>1</span>');
                }
                util.triggerMouseEvent(dateRangeElement, 'click');
                done();
            });
        }
        testWeekNumberInView('Day');
        testWeekNumberInView('Week');
        testWeekNumberInView('Month');
        testWeekNumberInView('Agenda');
        testWeekNumberInView('Year');
        testWeekNumberInView('TimelineDay');
        testWeekNumberInView('TimelineWeek');
        testWeekNumberInView('TimelineWorkWeek');
        testWeekNumberInView('TimelineMonth');
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
