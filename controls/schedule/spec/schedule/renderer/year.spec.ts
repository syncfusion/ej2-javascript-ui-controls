/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule Week view spec
 */
import { Schedule, ScheduleModel, Year, TimelineYear } from '../../../src/schedule/index';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Year, TimelineYear);

describe('Schedule year view', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                views: [
                    { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                selectedDate: new Date(2021, 1, 24)
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-year-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-year');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(504);
        });

        it('check header elements', () => {
            expect(schObj.element.querySelectorAll('.e-month-calendar').length).toEqual(12);
            expect((schObj.element.querySelectorAll('.e-header')[0] as HTMLElement).innerHTML)
                .toEqual('<div class="e-day e-title">January</div>');
            expect(schObj.element.querySelectorAll('.e-week-header').length).toEqual(12);
        });

        it('work cells', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('role')).toEqual('gridcell');
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('aria-selected')).toEqual('false');
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('data-date')).toEqual(new Date(2020, 11, 27).getTime().toString());
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].innerHTML).toEqual('<span class="e-day" title="Sunday, December 27, 2020">27</span>');
        });

        it('check week number', () => {
            schObj.showWeekNumber = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number').length).toEqual(72);
            expect(schObj.element.querySelectorAll('.e-week-number')[0].getAttribute('role')).toEqual('gridcell');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].getAttribute('title')).toEqual('Week 1');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toEqual('1');
        });

        it('cell click', () => {
            (schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement).click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.firstElementChild.classList.contains('e-more-event-popup')).toBeTruthy();
            expect(schObj.element.querySelector('.e-more-event-popup').firstElementChild.classList.contains('e-more-event-header')).toBeTruthy();
            const moreEventHeader: HTMLElement = schObj.element.querySelector('.e-more-event-header');
            expect(moreEventHeader.firstElementChild.classList.contains('e-more-event-close')).toBeTruthy();
            expect(moreEventHeader.firstElementChild.innerHTML).toEqual('<span class="e-btn-icon e-icons e-close-icon"></span>');
            expect(moreEventHeader.lastElementChild.classList.contains('e-more-event-date-header')).toBeTruthy();
            const moreDateHeader: HTMLElement = schObj.element.querySelector('.e-more-event-date-header');
            expect(moreDateHeader.firstElementChild.classList.contains('e-header-day')).toBeTruthy();
            expect(moreDateHeader.firstElementChild.innerHTML).toEqual('Sun');
            expect(moreDateHeader.lastElementChild.classList.contains('e-header-date')).toBeTruthy();
            expect(moreDateHeader.lastElementChild.innerHTML).toEqual('27');
            expect(moreDateHeader.lastElementChild.getAttribute('tabindex')).toEqual('0');
            expect(moreDateHeader.lastElementChild.getAttribute('data-date')).toEqual(new Date(2020, 11, 27).getTime().toString());
        });

    });

    describe('Resource and normal Header Template in timeline year view', () => {
        let schObj: Schedule;
        const resTemplate: string = '<div class="tWrap"><div class="rText" style="background:pink">${getResourceName(data)}</div></div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2018, 3, 1),
                firstMonthOfYear: 4,
                resourceHeaderTemplate: resTemplate,
                dayHeaderTemplate: '<div class="date-text">${data.day}</div>',
                monthHeaderTemplate: '<div class="date-text">${(data.date).getMonth()}</div>',
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('HorizontalView template checking', () => {
            expect(schObj.firstMonthOfYear).toEqual(4);
            expect(schObj.element.querySelector('.e-date-header-wrap .e-resource-cells').innerHTML).toBe('<div class="tWrap"><div class="rText" style="background:pink">ROOM 1</div></div>');
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toBe('May 2018 - Apr 2019');
            expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<div class="date-text">4</div>');
            expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<div class="date-text">3</div>');
            const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
            verticalViewBtn.click();
        });
        it('VerticalView template checking', () => {
            expect(schObj.firstMonthOfYear).toEqual(4);
            expect(schObj.element.querySelector('.e-header-cells').innerHTML).toBe('<div class="date-text">4</div>');
            expect(schObj.element.querySelectorAll('.e-header-cells')[11].innerHTML).toBe('<div class="date-text">3</div>');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[0].innerHTML).toBe('<div class="tWrap"><div class="rText" style="background:pink">ROOM 1</div></div>');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[1].innerHTML).toBe('<div class="tWrap"><div class="rText" style="background:pink">ROOM 2</div></div>');
        });

        describe('Resource and normal Header without Template in timeline year view', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const model: ScheduleModel = {
                    width: '100%', height: '550px',
                    selectedDate: new Date(2018, 3, 1),
                    firstMonthOfYear: 4,
                    views: [
                        { option: 'TimelineYear', displayName: 'Horizontal Year' },
                        { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                    ],
                    group: { resources: ['Rooms'] },
                    resources: [{
                        field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }]
                };
                schObj = util.createSchedule(model, [], done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });

            it('Horizontal without template checking', () => {
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>May</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>April</span>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[1].innerHTML).toBe('<div class="e-text-ellipsis">ROOM 1</div>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[2].innerHTML).toBe('<div class="e-text-ellipsis">ROOM 2</div>');
                const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
                verticalViewBtn.click();
            });
            it('Vertical without template checking', () => {
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-resource-cells')[1].innerHTML).toBe('<div class="e-resource-text" style="margin-left: 0px;">ROOM 2</div>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[0].innerHTML).toBe('<div class="e-resource-text" style="margin-left: 0px;">ROOM 1</div>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[0].innerHTML).toBe('<span>May</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[11].innerHTML).toBe('<span>April</span>');
            });
        });

        describe('with Template without Resource functionalities', () => {
            let schObj: Schedule;
            beforeAll(() => {
                const model: ScheduleModel = {
                    firstMonthOfYear: 4,
                    dayHeaderTemplate: '<div class="date-text">${(data).day}</div>',
                    monthHeaderTemplate: '<div class="date-text">${(data.date).getMonth()}</div>',
                    views: [
                        { option: 'TimelineYear', displayName: 'Horizontal Year' },
                        { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                    ],
                    selectedDate: new Date(2021, 1, 24)
                };
                schObj = util.createSchedule(model, []);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('Horizontal view functionalities checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<div class="date-text">4</div>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<div class="date-text">3</div>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<div class="date-text">Sunday</div>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[2].innerHTML).toBe('<div class="date-text">Monday</div>');
                const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
                verticalViewBtn.click();
            });
            it('Vertical view functionalities checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-header-cells')[12].innerHTML).toBe('<div class="date-text">3</div>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<div class="date-text">4</div>');
                expect(schObj.element.querySelectorAll('.e-month-header')[1].innerHTML).toBe('<div class="date-text">Monday</div>');
                expect(schObj.element.querySelectorAll('.e-month-header')[2].innerHTML).toBe('<div class="date-text">Tuesday</div>');

            });
        });

        describe('without Template without Resource functionalities', () => {
            let schObj: Schedule;
            beforeAll(() => {
                const model: ScheduleModel = {
                    firstMonthOfYear: 4,
                    views: [
                        { option: 'TimelineYear', displayName: 'Horizontal Year', isSelected: true },
                        { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' },
                        { option: 'Year' }
                    ],
                    selectedDate: new Date(2021, 1, 24)
                };
                schObj = util.createSchedule(model, []);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('Horizontal view functionalities checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<span>Sun</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[2].innerHTML).toBe('<span>Mon</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>May</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>April</span>');
                schObj.firstMonthOfYear = 5;
            });
            it('Horizontal setMode change checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<span>Sun</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[2].innerHTML).toBe('<span>Mon</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>June</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>May</span>');
                const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
                verticalViewBtn.click();
            });
            it('Vertical view functionalities checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<span>June</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[12].innerHTML).toBe('<span>May</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>Sun</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[1].innerHTML).toBe('<span>Mon</span>');
                const yearViewBtn: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-views.e-year');
                yearViewBtn.click();
            });
            it('Year layout rendering', () => {
                expect(schObj.element.querySelectorAll('.e-day.e-title')[0].innerHTML).toBe('June');
                expect(schObj.element.querySelectorAll('.e-day.e-title')[6].innerHTML).toBe('December');
                expect(schObj.element.querySelectorAll('.e-day.e-title')[11].innerHTML).toBe('May');
            });
        });
    });

    describe('EJ2-49947 - scheduler more popup is not updated when deleting the event in year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Test event-1',
                StartTime: new Date(2017, 1, 2, 8),
                EndTime: new Date(2017, 1, 2, 9)
            }, {
                Id: 2,
                Subject: 'Test event-2',
                StartTime: new Date(2017, 1, 1, 8),
                EndTime: new Date(2017, 1, 1, 13)
            }, {
                Id: 3,
                Subject: 'Test event-3',
                StartTime: new Date(2017, 1, 2, 12),
                EndTime: new Date(2017, 1, 2, 13)
            }, {
                Id: 4,
                Subject: 'Test event-4',
                StartTime: new Date(2017, 1, 3, 8),
                EndTime: new Date(2017, 1, 3, 10)
            }, {
                Id: 5,
                Subject: 'Test event-5',
                StartTime: new Date(2017, 1, 3, 11),
                EndTime: new Date(2017, 1, 3, 13)
            }];    
            const model: ScheduleModel = {
                views: [
                    { option: 'Year' },
                ],
                selectedDate: new Date(2017, 10, 2),
            };
            schObj = util.createSchedule(model, yearData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        
        it('Checking the more popup event list after deleting an event', (done: DoneFn) => {
            schObj.dataBound = () => {
                const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper');
                expect(morePopup.querySelectorAll('.e-appointment').length).toEqual(1);
                expect(schObj.eventsData.length).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(7);
                done();
            };
            (<HTMLElement>schObj.element.querySelectorAll('.e-work-cells')[46]).click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(morePopup.firstElementChild.classList.contains('e-more-event-popup')).toBeTruthy();
            expect(morePopup.querySelectorAll('.e-appointment').length).toEqual(2);
            (<HTMLElement>morePopup.querySelector('.e-appointment')).click()
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
