/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule Week view spec
 */
import { createElement, L10n } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Year, TimelineYear, CellClickEventArgs } from '../../../src/schedule/index';
import * as util from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';

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
                .toEqual('<div class="e-day e-title">January 2021</div>');
            expect(schObj.element.querySelectorAll('.e-week-header').length).toEqual(12);
        });

        it('work cells', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('data-date')).toEqual(new Date(2020, 11, 27).getTime().toString());
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].innerHTML).toEqual('<span class="e-day" title="Sunday, December 27, 2020" aria-disabled="true">27</span>');
        });

        it('check week number', () => {
            schObj.showWeekNumber = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number').length).toEqual(72);
            expect(schObj.element.querySelectorAll('.e-week-number')[0].getAttribute('title')).toEqual('Week 1');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toEqual('1');
        });

        it('cell click', () => {
            (schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)')[0] as HTMLElement).click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.firstElementChild.classList.contains('e-more-event-popup')).toBeTruthy();
            expect(schObj.element.querySelector('.e-more-event-popup').firstElementChild.classList.contains('e-more-event-header')).toBeTruthy();
            const moreEventHeader: HTMLElement = schObj.element.querySelector('.e-more-event-header');
            expect(moreEventHeader.firstElementChild.classList.contains('e-more-event-close')).toBeTruthy();
            expect(moreEventHeader.firstElementChild.innerHTML).toEqual('<span class="e-btn-icon e-icons e-close-icon"></span>');
            expect(moreEventHeader.lastElementChild.classList.contains('e-more-event-date-header')).toBeTruthy();
            const moreDateHeader: HTMLElement = schObj.element.querySelector('.e-more-event-date-header');
            expect(moreDateHeader.firstElementChild.classList.contains('e-header-day')).toBeTruthy();
            expect(moreDateHeader.firstElementChild.innerHTML).toEqual('Fri');
            expect(moreDateHeader.lastElementChild.classList.contains('e-header-date')).toBeTruthy();
            expect(moreDateHeader.lastElementChild.innerHTML).toEqual('1');
            expect(moreDateHeader.lastElementChild.getAttribute('tabindex')).toEqual('0');
            expect(moreDateHeader.lastElementChild.getAttribute('data-date')).toEqual(new Date(2021, 0, 1).getTime().toString());
        });

        it('checking content rows', () => {
            expect(schObj.activeView.getContentRows().length).toEqual(0);
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
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>May 2018</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>April 2019</span>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[1].innerHTML).toBe('<div class="e-text-ellipsis">ROOM 1</div>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[2].innerHTML).toBe('<div class="e-text-ellipsis">ROOM 2</div>');
                const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
                verticalViewBtn.click();
            });
            it('Vertical without template checking', () => {
                expect(schObj.firstMonthOfYear).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-resource-cells')[1].innerHTML).toBe('<div class="e-resource-text" style="margin-left: 0px;">ROOM 2</div>');
                expect(schObj.element.querySelectorAll('.e-resource-cells')[0].innerHTML).toBe('<div class="e-resource-text" style="margin-left: 0px;">ROOM 1</div>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[0].innerHTML).toBe('<span>May 2018</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[11].innerHTML).toBe('<span>April 2019</span>');
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
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>May 2021</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>April 2022</span>');
                schObj.firstMonthOfYear = 5;
            });
            it('Horizontal setMode change checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<span>Sun</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[2].innerHTML).toBe('<span>Mon</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>June 2021</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[11].innerHTML).toBe('<span>May 2022</span>');
                const verticalViewBtn: HTMLElement = (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement);
                verticalViewBtn.click();
            });
            it('Vertical view functionalities checking', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
                expect(schObj.firstMonthOfYear).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].innerHTML).toBe('<span>June 2021</span>');
                expect(schObj.element.querySelectorAll('.e-header-cells')[12].innerHTML).toBe('<span>May 2022</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[0].innerHTML).toBe('<span>Sun</span>');
                expect(schObj.element.querySelectorAll('.e-month-header')[1].innerHTML).toBe('<span>Mon</span>');
                const yearViewBtn: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-views.e-year');
                yearViewBtn.click();
            });
            it('Year layout rendering', () => {
                expect(schObj.element.querySelectorAll('.e-day.e-title')[0].innerHTML).toBe('June 2021');
                expect(schObj.element.querySelectorAll('.e-day.e-title')[6].innerHTML).toBe('December 2021');
                expect(schObj.element.querySelectorAll('.e-day.e-title')[11].innerHTML).toBe('May 2022');
            });
        });
    });

    describe('checking template supports in year', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2022, 1, 1),
                dayHeaderTemplate: '<div class="date-text">${(data.date).getDay()}</div>',
                monthHeaderTemplate: '<div class="date-text">${(data.date).getMonth()}</div>',
                cellTemplate: '<div class="date-text">${(data.date).getDate()}</div>',
                cellHeaderTemplate: '<div class="date-text">${(data.date).getDate()}</div>',
                dateRangeTemplate: '<div class="date-text">${(data.startDate).getDate()}-${(data.endDate).getDate()}</div>',
                views: [
                    { option: 'Year' }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('All templates checking', () => {
            expect(schObj.element.querySelectorAll('.e-day.e-title')[0]['innerHTML']).toBe('<div class="date-text">0</div>');
            expect(schObj.element.querySelectorAll('.e-week-header')[0]['innerHTML'])
                .toBe('<tr><th><div class="date-text">0</div></th><th><div class="date-text">1</div></th><th><div class="date-text">2</div></th><th><div class="date-text">3</div></th><th><div class="date-text">4</div></th><th><div class="date-text">5</div></th><th><div class="date-text">6</div></th></tr>');
            expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[0]['innerHTML']).toBe('<div class="date-text">26</div><div class="date-text">26</div>');
            expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6]['innerHTML']).toBe('<div class="date-text">1</div><div class="date-text">1</div>');
            expect(schObj.element.querySelectorAll('.e-tbar-btn-text')[0]['innerHTML']).toBe('<div class="date-text">1-31</div>');
        });
        it('remove daterange', () => {
            expect(schObj.element.querySelector('.e-toolbar-left').children.length).toEqual(3);
            schObj.element.querySelector('.e-date-range').remove();
            expect(schObj.element.querySelector('.e-toolbar-left').children.length).toEqual(2);
        });
    });

    describe('Client side events', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('events call confirmation', () => {
            const clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            const dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
            const model: ScheduleModel = {
                cellClick: clickFn,
                cellDoubleClick: dblClickFn,
                views: [
                    { option: 'Year' }
                ],
                selectedDate: new Date(2022, 5, 18)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
        });

        it('cell click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                views: [
                    { option: 'Year' }
                ],
                selectedDate: new Date(2022, 5, 18)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2022, 0, 2).getTime());
            expect(cellEndTime).toEqual(new Date(2022, 0, 3).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                views: [
                    { option: 'Year' }
                ], selectedDate: new Date(2022, 5, 18)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.classList).not.toContain('e-selected-cell');
            workCell.click();
            expect(workCell.classList).not.toContain('e-selected-cell');
        });

        it('cell double click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                views: [
                    { option: 'Year' }
                ],
                selectedDate: new Date(2022, 5, 18)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2022, 0, 2).getTime());
            expect(cellEndTime).toEqual(new Date(2022, 0, 3).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                views: [
                    { option: 'Year' }
                ],
                selectedDate: new Date(2022, 5, 18)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
        });

    });

    describe('EJ2-51013 - Year view Resources with group by date', () => {
        let schObj: Schedule;
        beforeEach((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Categories']
                },
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Timeline Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Timeline Year', orientation: 'Vertical' }
                ],
                resources: [
                    {
                        field: 'TaskId',
                        title: 'Category',
                        name: 'Categories',
                        allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, color: '#df5286' },
                            { text: 'Steven', id: 2, color: '#7fa900' },
                            { text: 'Robert', id: 3, color: '#ea7a57' },
                            { text: 'Smith', id: 4, color: '#5978ee' },
                            { text: 'Micheal', id: 5, color: '#df5286' }
                        ],
                        textField: 'text',
                        idField: 'id',
                        colorField: 'color'
                    }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('Checking ByDate for horizontal timeline year view', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-timeline-year-view');
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(1);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-cells').length).toBe(60);
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-days').length).toBe(60);
        });
        it('Checking ByDate for vertical timeline year view', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-timeline-year')[1] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-timeline-year-view');
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(1);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap .e-resource-cells').length).toBe(5);
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-cells').length).toBe(60);
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-days').length).toBe(60);
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
                    { option: 'Year' }
                ],
                selectedDate: new Date(2017, 10, 2)
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
            (<HTMLElement>morePopup.querySelector('.e-appointment')).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
    });

    describe('EJ2CORE-692 - Year view week number title test case', () => {
        let schObj: Schedule;
        L10n.load({
            'vi': {
                'schedule': {
                    'week': 'Tuần'
                }
            }
        });
        beforeEach((): void => {
            schObj = undefined;
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('vietnamese test case', () => {
            util.loadCultureFiles('vi');
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), locale: 'vi', views: ['Year'], showWeekNumber: true }, '#Schedule');
            const weekNoElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-year-view .e-week-number');
            expect(weekNoElements[0].getAttribute('title')).toEqual('Tuần 1');
            expect(weekNoElements[5].getAttribute('title')).toEqual('Tuần 6');
        });
    });

    describe('EJ2-45830 - Display multi-month event as single event in vertical year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Test event-1',
                StartTime: new Date(2023, 1, 2, 8),
                EndTime: new Date(2023, 3, 2, 9),
                TaskId: 1
            }, {
                Id: 2,
                Subject: 'Test event-2',
                StartTime: new Date(2023, 0, 1, 8),
                EndTime: new Date(2023, 5, 1, 13),
                TaskId: 2
            }, {
                Id: 3,
                Subject: 'Test event-3',
                StartTime: new Date(2023, 1, 1, 8),
                EndTime: new Date(2023, 2, 1, 13),
                TaskId: 2
            }, {
                Id: 4,
                Subject: 'Test event-4',
                StartTime: new Date(2023, 1, 2, 12),
                EndTime: new Date(2023, 1, 2, 13),
                TaskId: 2
            }, {
                Id: 5,
                Subject: 'Test event-5',
                StartTime: new Date(2023, 1, 1, 8),
                EndTime: new Date(2023, 2, 1, 13),
                TaskId: 2
            }, {
                Id: 6,
                Subject: 'Test event-6',
                StartTime: new Date(2023, 1, 2, 12),
                EndTime: new Date(2023, 1, 2, 13),
                TaskId: 2
            }];
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2023, 3, 1),
                group: {
                    resources: ['Categories']
                },
                views: [
                    { option: 'TimelineYear', displayName: 'Vertical Timeline Year', orientation: 'Vertical' }
                ],
                resources: [
                    {
                        field: 'TaskId',
                        title: 'Category',
                        name: 'Categories',
                        allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, color: '#df5286' },
                            { text: 'Steven', id: 2, color: '#7fa900' },
                            { text: 'Robert', id: 3, color: '#ea7a57' },
                            { text: 'Smith', id: 4, color: '#5978ee' },
                            { text: 'Micheal', id: 5, color: '#df5286' }
                        ],
                        textField: 'text',
                        idField: 'id',
                        colorField: 'color'
                    }
                ]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking the multi month events displaying as single event', () => {
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-vertical');
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
            const editedEvent: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            expect(editedEvent.offsetWidth).toEqual(300);
        });

        it('Checking more events', () => {
            const moreIndicator: HTMLElement = document.querySelector('.e-more-indicator');
            util.triggerMouseEvent(moreIndicator, 'click');
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(morePopup.querySelectorAll('.e-appointment').length).toEqual(5);
            expect(schObj.eventsData.length).toEqual(6);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });

        it('After changing first month of the year', (done: DoneFn) => {
            schObj.dataBound = () => {
                schObj.dataBound = () => {
                    expect(schObj.firstMonthOfYear).toEqual(1);
                    expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                    done();
                };
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(addedEvent.offsetWidth).toEqual(100);
                expect(addedEvent.offsetHeight).toEqual(22);
                expect(addedEvent.firstElementChild.classList.contains('e-left-icon')).toBeTruthy();
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                schObj.firstMonthOfYear = 1;
                schObj.dataBind();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2022, 11, 1);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2023, 0, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('After changing number of months', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.firstMonthOfYear).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
                const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                expect(appointment.firstElementChild.classList.contains('e-left-icon')).toBeTruthy();
                expect(appointment.children[2].classList.contains('e-right-icon')).toBeTruthy();
                done();
            };
            schObj.monthsCount = 4;
            schObj.dataBind();
        });
    });

    describe('EJ2-57740 - Checking the scroll position maintenance in Timeline year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2020, 4, 20),
                views: [{ option: 'TimelineYear' }],
                group: {
                    byGroupID: false,
                    resources: ['Owners']
                },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('After the initial rendering', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            const monthWrap: HTMLElement = schObj.element.querySelector('.' + cls.MONTH_HEADER_WRAPPER);
            expect(contentWrap.scrollTop).toEqual(0);
            expect(contentWrap.scrollLeft).toEqual(0);
            expect(monthWrap.scrollTop).toEqual(0);
        });

        it('Change the scroll position', (done: DoneFn) => {
            schObj.dataBound = () => done();
            const contentWrap: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            util.triggerScrollEvent(contentWrap, 120, 140);
            schObj.showWeekend = false;
            schObj.dataBind();
        });
        it('Ensure the changed position', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            const monthArea: HTMLElement = schObj.element.querySelector('.' + cls.MONTH_HEADER_WRAPPER);
            expect(contentArea.scrollTop).toEqual(120);
            expect(contentArea.scrollLeft).toEqual(140);
            expect(monthArea.scrollTop).toEqual(120);
        });
    });

    describe('checking getCurrentViewDates', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: [
                    { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                selectedDate: new Date(2023, 1, 24)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking getCurrentViewDates for year view', () => {
            expect(schObj.getCurrentViewDates().length).toEqual(365);
        });

        it('Checking getCurrentViewDates for timeline year view', () => {
            schObj.currentView = 'TimelineYear';
            schObj.dataBind();
            expect(schObj.getCurrentViewDates().length).toEqual(365);
        });
    });

    describe('Checking week header names', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: [
                    { option: 'Year', isSelected: true },
                ],
                selectedDate: new Date(2023, 1, 24)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking headers for year view', () => {
            let Element: HTMLElement = document.querySelectorAll(".e-month-calendar")[10] as HTMLElement;
            expect(Element.querySelector(".e-title").innerHTML).toEqual('November 2023');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[0].innerHTML).toEqual('S');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[1].innerHTML).toEqual('M');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[2].innerHTML).toEqual('T');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[3].innerHTML).toEqual('W');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[4].innerHTML).toEqual('T');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[5].innerHTML).toEqual('F');
            expect(Element.querySelector(".e-week-header").querySelectorAll('.e-content.e-month > table > thead > tr > th')[6].innerHTML).toEqual('S');
        });
    });
    
    describe('Checking aria-label with resource group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '555px',
                selectedDate: new Date(2020, 0, 1),
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Year'},
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical', isSelected: true }
                ],
                group: {
                    resources: ['Projects', 'Categories']
                },
                resources: [
                    {
                        field: 'ProjectId', title: 'Choose Project', name: 'Projects',
                        dataSource: [
                            { text: 'PROJECT 1', id: 1 },
                            { text: 'PROJECT 2', id: 2 },
                            { text: 'PROJECT 3', id: 3 }
                        ],
                        textField: 'text', idField: 'id'
                    }, {
                        field: 'TaskId', title: 'Category',
                        name: 'Categories', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1 },
                            { text: 'Steven', id: 2, groupId: 2},
                            { text: 'Robert', id: 3, groupId: 3 },
                            { text: 'Smith', id: 4, groupId: 1},
                            { text: 'Micheal', id: 5, groupId: 2 },
                            { text: 'Root', id: 6, groupId: 3 }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId'
                    }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking aria-label in vertical orientation', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('aria-label')).toEqual('Wednesday, January 1, 2020 at 12:00:00 AM GMT Ends At Saturday, February 1, 2020 at 12:00:00 AM GMT');
        });
        it('Checking aria-label in horizontal orientation', () => {
            (schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[0] as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('aria-label')).toEqual('Wednesday, January 1, 2020 at 12:00:00 AM GMT Ends At Saturday, February 1, 2020 at 12:00:00 AM GMT');
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
