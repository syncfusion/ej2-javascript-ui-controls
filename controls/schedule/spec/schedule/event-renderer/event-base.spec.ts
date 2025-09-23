/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Events base methods testing
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, Timezone, ScheduleModel, CallbackFunction, EventClickArgs, View } from '../../../src/schedule/index';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { dragResizeData, resourceData } from '../base/datasource.spec';
import { ActionEventArgs, EJ2Instance, PopupOpenEventArgs } from '../../../src/schedule/base/interface';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { triggerMouseEvent } from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Event Base Module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('split event by day method testing', () => {
        let schObj: Schedule;
        beforeAll(() => {
            schObj = util.createSchedule({}, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Event on same day', () => {
            const event: Record<string, any> = { 'StartTime': new Date(2017, 11, 1, 4), 'EndTime': new Date(2017, 11, 1, 8) };
            const spannedEvents: Record<string, any>[] = schObj.eventBase.splitEventByDay(event);
            expect(spannedEvents.length).toEqual(1);
        });
        it('Event on multiple day', () => {
            const event: Record<string, any> = { 'StartTime': new Date(2017, 11, 1, 4), 'EndTime': new Date(2017, 11, 4, 8) };
            const spannedEvents: Record<string, any>[] = schObj.eventBase.splitEventByDay(event);
            expect(spannedEvents.length).toEqual(4);
        });
    });

    describe('checking spanned recurrence appointment', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            StartTime: new Date(2018, 7, 7, 23),
            EndTime: new Date(2018, 7, 8, 16),
            RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;UNTIL=20180905T070000Z;'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2018, 7, 7) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('spanned recurrence appointments with offsetTop', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app2: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
                expect(app2.length).toEqual(14);
                expect(app2[0].offsetTop).toEqual(0);
                done();
            };
            const app1: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 05 - 11, 2018');
            expect(app1.length).toEqual(9);
            expect(app1[0].offsetTop).toEqual(1656);
            (schObj.element.querySelector('.e-schedule-toolbar .e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 12 - 18, 2018');
        });
    });

    describe('Schedule Timezone testing', () => {
        let schObj: Schedule;
        const timezone: Timezone = new Timezone();
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Testing',
            StartTime: timezone.removeLocalOffset(new Date(2018, 5, 14, 15, 0)),
            EndTime: timezone.removeLocalOffset(new Date(2018, 5, 14, 17, 0))
        }];
        const initialStartDate: Date = new Date(eventData[0].StartTime + '');
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2018, 5, 14) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Set timezone to Schedule', () => {
            schObj.timezone = 'America/New_York';
            schObj.dataBind();
            const event: Record<string, any> = schObj.eventsData[0];
            expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 11, 0).getTime());
        });
        it('Convert timezone', () => {
            schObj.timezone = 'Asia/Kolkata';
            schObj.dataBind();
            const event: Record<string, any> = schObj.eventsData[0];
            expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 20, 30).getTime());
        });
        it('Remove timezone to Schedule', () => {
            schObj.timezone = null;
            schObj.dataBind();
            const event: Record<string, any> = schObj.eventsData[0];
            expect((event.StartTime as Date).getTime()).toEqual(initialStartDate.getTime());
        });
    });

    describe('checking recurrence appointment', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            StartTime: new Date(2018, 9, 11, 0),
            EndTime: new Date(2018, 9, 12, 0),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', selectedDate: new Date(2018, 9, 1),
                views: [
                    { displayName: '3 Days', option: 'Day', interval: 3 },
                    { displayName: '2 Weeks', option: 'Week', interval: 2 },
                    { displayName: '4 Months', option: 'Month', isSelected: true, interval: 4 }
                ]
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('spanned recurrence appointments with offsetTop', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app2: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
                expect(app2.length).toEqual(126);
                done();
            };
            const app1: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
            expect(app1.length).toEqual(115);
            (schObj.element.querySelector('.e-schedule-toolbar .e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('February - May 2019');
        });
    });

    describe('Resources with allow multiplegroup as true', () => {
        let schObj: Schedule;
        const getResourceIndex: CallbackFunction = (element: HTMLElement) => parseInt(element.getAttribute('data-group-index'), 10);
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2018, 3, 1, 10, 0),
            EndTime: new Date(2018, 3, 1, 12, 30),
            IsAllDay: false,
            RoomId: [1, 2],
            OwnerId: [1, 2, 3]
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = { height: '550px', width: '100%', selectedDate: new Date(2018, 3, 1) };
            schObj = util.createGroupSchedule(2, options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Allow multiple true', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(3);
            let resourceIndex: number = getResourceIndex(eventElementList[0]);
            expect(resourceIndex).toEqual(0);
            resourceIndex = getResourceIndex(eventElementList[1]);
            expect(resourceIndex).toEqual(1);
            resourceIndex = getResourceIndex(eventElementList[2]);
            expect(resourceIndex).toEqual(2);
        });

        it('Allow multiple false for 1st resource', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(2);
                let resourceIndex: number = getResourceIndex(eventElementList[0]);
                expect(resourceIndex).toEqual(0);
                resourceIndex = getResourceIndex(eventElementList[1]);
                expect(resourceIndex).toEqual(1);
                done();
            };
            schObj.resources[0].allowMultiple = false;
            schObj.eventSettings.dataSource = [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: 1,
                OwnerId: [1, 2, 3]
            }];
            schObj.dataBind();
        });

        it('Resource data source with 2 digits with allow multiple true', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                const resourceIndex: number = getResourceIndex(eventElementList[0]);
                expect(resourceIndex).toEqual(2);
                done();
            };
            schObj.resources[0].allowMultiple = true;
            schObj.resources[0].dataSource = [
                { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                { RoomText: 'ROOM 12', Id: 12, RoomColor: '#cb6bb2' }
            ];
            schObj.resources[1].dataSource = [
                { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                { OwnerText: 'Michael', Id: 12, OwnerGroupId: 12, OwnerColor: '#7499e1' }
            ];
            schObj.eventSettings.dataSource = [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: [12],
                OwnerId: [1, 2, 12]
            }];
            schObj.dataBind();
        });

        it('Resource data source with 2 digits with allow multiple false', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                const resourceIndex: number = getResourceIndex(eventElementList[0]);
                expect(resourceIndex).toEqual(2);
                done();
            };
            schObj.resources[0].allowMultiple = false;
            schObj.eventSettings.dataSource = [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: 12,
                OwnerId: [1, 2, 12]
            }];
            schObj.dataBind();
        });
        it('Resource data source with 2 digits with single resource', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                const resourceIndex: number = getResourceIndex(eventElementList[0]);
                expect(resourceIndex).toEqual(2);
                done();
            };
            schObj.resources = [{
                field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                dataSource: [
                    { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                    { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                    { RoomText: 'ROOM 12', Id: 12, RoomColor: '#cb6bb2' }],
                textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
            }];
            schObj.eventSettings.dataSource = [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: 12
            }];
            schObj.dataBind();
        });
        it('Resource data source with 2 digits with single resource and allow multiple true', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                const resourceIndex: number = getResourceIndex(eventElementList[0]);
                expect(resourceIndex).toEqual(2);
                done();
            };
            schObj.resources[0].allowMultiple = true;
            schObj.eventSettings.dataSource = [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: [12]
            }];
            schObj.dataBind();
        });
    });

    describe('Checking events fill the full height of the cell', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            StartTime: new Date(2018, 8, 30, 0, 0),
            EndTime: new Date(2018, 8, 30, 0, 30),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;COUNT=6;'
        }, {
            Id: 2,
            StartTime: new Date(2018, 8, 30, 0, 0),
            EndTime: new Date(2018, 8, 30, 0, 30),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,SA;INTERVAL=1;COUNT=6;'
        }, {
            Id: 3,
            StartTime: new Date(2018, 9, 12),
            EndTime: new Date(2018, 9, 14)
        }, {
            Id: 4,
            StartTime: new Date(2018, 9, 24),
            EndTime: new Date(2018, 9, 30)
        }, {
            Id: 5,
            StartTime: new Date(2018, 9, 16),
            EndTime: new Date(2018, 9, 18)
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', selectedDate: new Date(2018, 9, 1),
                views: ['Week', 'Month', 'TimelineMonth'],
                currentView: 'Week',
                eventSettings: {
                    enableMaxHeight: true
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking event filled full height of the cell in the week view', () => {
            const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight);
        });
        it('Checking to month view', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('Checking event filled full height of the cell in the Month view', () => {
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            expect(eventElement.offsetHeight).toEqual(70);
        });
        it('Changing current view to Timeline month', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Checking event filled full height of the cell in the Timeline month view', () => {
            const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight);
        });
        it('Enable RTL', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.dataBind();
        });
        it('Checking fill and enable Rtl properties is set to true on timeline month view', () => {
            const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight);
        });
        it('Checking current view to month', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('Checking fill and enable Rtl properties is set to true on month view', () => {
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            expect(eventElement.offsetHeight).toEqual(70);
        });
    });

    describe('Checking custom sorting functionality', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Rank 1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 11, 30),
            IsAllDay: false,
            RankId: '1'
        }, {
            Id: 2,
            Subject: 'Rank 3',
            StartTime: new Date(2017, 9, 29, 10, 30),
            EndTime: new Date(2017, 9, 29, 12, 30),
            IsAllDay: false,
            RankId: '3'
        }, {
            Id: 3,
            Subject: 'Rank 6',
            StartTime: new Date(2017, 9, 29, 7, 0),
            EndTime: new Date(2017, 9, 29, 14, 30),
            IsAllDay: false,
            RankId: '6'
        }, {
            Id: 4,
            Subject: 'Rank 9',
            StartTime: new Date(2017, 9, 29, 11, 0),
            EndTime: new Date(2017, 9, 29, 15, 30),
            IsAllDay: false,
            RankId: '9'
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2017, 9, 29),
                views: ['Week', 'Month', 'TimelineDay', 'TimelineMonth'],
                currentView: 'Month',
                eventSettings: {
                    sortComparer: (args: any) => {
                        args.sort((a: any, b: any) => a.RankId.localeCompare(b.RankId, undefined, { numeric: true }));
                        return args;
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking event sorting by custom field in Month View', () => {
            const eventElement: Element = schObj.element.querySelector('.e-appointment');
            const expectedRankId: string = '1';
            const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
            expect(eventDetails.RankId).toEqual(expectedRankId);
        });
        it('Checking event sorting by custom field in Week View', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('.e-appointment');
                const expectedRankId: string = '1';
                const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
                expect(eventDetails.RankId).toEqual(expectedRankId);
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
        it('Checking event sorting by custom field in TimelineDay View', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('.e-appointment');
                const expectedRankId: string = '1';
                const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
                expect(eventDetails.RankId).toEqual(expectedRankId);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });
        it('Checking event sorting by custom field in TimelineMonth View', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('.e-appointment');
                const expectedRankId: string = '1';
                const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
                expect(eventDetails.RankId).toEqual(expectedRankId);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
    });

    describe('EJ2-68038 - Checking custom sorting functionality in ASPcore', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Rank 1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 11, 30),
            IsAllDay: false,
            RankId: '1'
        }, {
            Id: 2,
            Subject: 'Rank 3',
            StartTime: new Date(2017, 9, 29, 10, 30),
            EndTime: new Date(2017, 9, 29, 12, 30),
            IsAllDay: false,
            RankId: '3'
        }, {
            Id: 3,
            Subject: 'Rank 6',
            StartTime: new Date(2017, 9, 29, 7, 0),
            EndTime: new Date(2017, 9, 29, 14, 30),
            IsAllDay: false,
            RankId: '6'
        }, {
            Id: 4,
            Subject: 'Rank 9',
            StartTime: new Date(2017, 9, 29, 11, 0),
            EndTime: new Date(2017, 9, 29, 15, 30),
            IsAllDay: false,
            RankId: '9'
        }];
        beforeAll((done: DoneFn) => {
            const ComparerFn: string = 'sortComparer';
            (window as any).sortComparer = (args: any) => {
                args.sort((a: any, b: any) => a.RankId.localeCompare(b.RankId, undefined, { numeric: true }));
                return args;
            };
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2017, 9, 29),
                views: ['Week', 'Month', 'TimelineDay', 'TimelineMonth'],
                currentView: 'Week',
                eventSettings: {
                    sortComparer: ComparerFn as any
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking event sorting by custom field in Week View', () => {
            const eventElement: Element = schObj.element.querySelector('.e-appointment');
            const expectedRankId: string = '1';
            const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
            expect(eventDetails.RankId).toEqual(expectedRankId);
        });
    });

    describe('Checking events fill the full height with more indicator of the cell', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            StartTime: new Date(2018, 8, 30, 0, 0),
            EndTime: new Date(2018, 8, 30, 0, 30),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;COUNT=6;'
        }, {
            Id: 2,
            StartTime: new Date(2018, 8, 30, 0, 30),
            EndTime: new Date(2018, 8, 30, 1, 0),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;COUNT=6;'
        }, {
            Id: 3,
            StartTime: new Date(2018, 9, 12),
            EndTime: new Date(2018, 9, 14)
        }, {
            Id: 4,
            StartTime: new Date(2018, 9, 24),
            EndTime: new Date(2018, 9, 30)
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2018, 9, 1),
                views: ['Month', 'TimelineMonth'],
                currentView: 'Month',
                eventSettings: {
                    enableMaxHeight: true,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking event filled full height of the cell in the Month view', () => {
            const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
            const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
            const headerHeight: number = 25;
            expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - 19 - headerHeight);
        });
        it('Checking event filled full height of the cell in the Timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - 21);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Checking fill, indicator and enable Rtl properties is set to true on timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - 21);
                done();
            };
            schObj.enableRtl = true;
            schObj.dataBind();
        });
        it('Checking fill, indicator and enable Rtl properties is set to true on month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                const headerHeight: number = 25;
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - 19 - headerHeight);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
    });

    describe('checking focus on element outside schedule', () => {
        let schObj: Schedule;
        let keyModule: any;
        let inputObj: HTMLElement;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            StartTime: new Date(2018, 9, 1, 9, 0),
            EndTime: new Date(2018, 9, 1, 9, 30)
        }, {
            Id: 2,
            StartTime: new Date(2018, 9, 3, 10, 30),
            EndTime: new Date(2018, 9, 3, 12, 0)
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2018, 9, 1)
            };
            schObj = util.createSchedule(options, eventData, done);
            inputObj = createElement('input', { className: 'e-input-element' });
            document.body.appendChild(inputObj);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(inputObj);
        });
        it('To check outside element focus after focussing work cell', () => {
            const workCell: HTMLTableCellElement = schObj.element.querySelectorAll('.e-work-cells')[170] as HTMLTableCellElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            const inputEle: HTMLElement = document.querySelector('.e-input-element') as HTMLElement;
            inputEle.focus();
            expect(document.activeElement).toEqual(inputEle);
        });
        it('To maintain outside element focus on resize', () => {
            const workCell: HTMLTableCellElement = schObj.element.querySelectorAll('.e-work-cells')[170] as HTMLTableCellElement;
            workCell.click();
            const inputEle: HTMLElement = document.querySelector('.e-input-element') as HTMLElement;
            inputEle.focus();
            schObj.element.style.width = '80%';
            (schObj as any).onScheduleResize();
            expect(document.activeElement).toEqual(inputEle);
        });
        it('To check outside element focus after focussing appointment', () => {
            const appointmentEle: HTMLTableCellElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLTableCellElement;
            appointmentEle.click();
            keyModule.keyActionHandler({ action: 'escape' });
            const inputEle: HTMLElement = document.querySelector('.e-input-element') as HTMLElement;
            inputEle.focus();
            expect(document.activeElement).toEqual(inputEle);
        });
    });

    describe('checking Recurrence appointments', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test',
            StartTime: new Date(2022, 5, 14, 19, 0),
            EndTime: new Date(2022, 5, 18, 20, 0),
            RecurrenceRule: 'FREQ=WEEKLY;INTERVAL=1;'
        }];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2022, 5, 21)
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('CR issue - EJ2-60887 - To check appointment rendering in week view', () => {
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toBe(1);
            expect(app[0].querySelectorAll('.e-right-icon').length).toBe(0);
            expect(app[0].querySelectorAll('.e-left-icon').length).toBe(0);
            expect(app[0].querySelectorAll('.e-recurrence-icon').length).toBe(1);
            expect(app[0].classList).toContain('e-all-day-appointment');
            const occurrence: Record<string, any>[] = schObj.getEvents(null, null, true);
            expect(occurrence.length).toBe(7);
        });
        it('CR issue - EJ2-60887 - To check appointment rendering in Day view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(1);
                expect(app[0].querySelectorAll('.e-right-icon').length).toBe(1);
                expect(app[0].querySelectorAll('.e-left-icon').length).toBe(0);
                expect(app[0].querySelectorAll('.e-recurrence-icon').length).toBe(1);
                const occurrence: Record<string, any>[] = schObj.getEvents(null, null, true);
                expect(occurrence.length).toBe(6);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });
        it('CR issue - EJ2-60887 - To check for occurrence rendering in Day view on date navigate', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(1);
                expect(app[0].querySelectorAll('.e-right-icon').length).toBe(1);
                expect(app[0].querySelectorAll('.e-left-icon').length).toBe(1);
                expect(app[0].querySelectorAll('.e-recurrence-icon').length).toBe(1);
                const occurrence: Record<string, any>[] = schObj.getEvents(null, null, true);
                expect(occurrence.length).toBe(6);
                done();
            };
            schObj.selectedDate = new Date(2022, 5, 22);
            schObj.dataBind();
        });
    });

    describe('checking occurrences in dst time zone', () => {
        let schObj: Schedule;
        let eventData: Record<string, any>[] = [];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2022, 2, 20), timezone: 'UTC', currentView: 'Month'
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('CR issue - EJ2-60349 - To check occurrences in UTC timezone before dst date', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(11);
                expect(app[0].querySelector('.e-time').innerHTML).toEqual('2:00 AM');
                done();
            };
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toBe(0);
            eventData = [
                {
                    Id: 1,
                    Subject: 'Paris',
                    StartTime: new Date(2022, 2, 23, 2, 0),
                    EndTime: new Date(2022, 2, 23, 3, 0),
                    IsAllDay: false,
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;UNTIL=20221229T203000Z;',
                    StartTimezone: 'UTC',
                    EndTimezone: 'UTC'
                }
            ];
            schObj.addEvent(eventData);
        });
        it('CR issue - EJ2-60349 - To check occurrences after dst date in UTC timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(33);
                expect(app[32].querySelector('.e-time').innerHTML).toEqual('2:00 AM');
                done();
            };
            schObj.selectedDate = new Date(2022, 11, 30);
            schObj.dataBind();
        });
        it('CR issue - EJ2-60349 - To check occurrences after dst date in eastern timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(12);
                expect(app[0].querySelector('.e-time').innerHTML).toEqual('10:00 PM');
                done();
            };
            schObj.selectedDate = new Date(2022, 2, 20);
            schObj.timezone = 'America/New_York';
            schObj.dataBind();
        });
        it('CR issue - EJ2-60349 - To check occurrences before dst date in eastern timezone', (done: DoneFn) => {
            schObj.dataBound = () => {
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toBe(33);
                expect(app[32].querySelector('.e-time').innerHTML).toEqual('9:00 PM');
                done();
            };
            schObj.selectedDate = new Date(2022, 11, 30);
            schObj.dataBind();
        });
    });

    describe('Check appointment rendering with timezone', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Paris',
                StartTime: new Date(2022, 2, 23, 2, 0),
                EndTime: new Date(2022, 2, 23, 5, 0)
            }
        ];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2022, 2, 20), timezone: 'UTC', currentView: 'Week'
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('CR issue - EJ2-61857 - On Schedule property change', () => {
            schObj.dataBound = null;
            schObj.allowResizing = false;
            schObj.dataBind();
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toBe(1);
            expect(app[0].querySelector('.e-time').innerHTML).toEqual('2:00 AM - 5:00 AM');
        });
        it('CR issue - EJ2-61857 - On eventSettings property change', () => {
            schObj.dataBound = null;
            schObj.eventSettings.enableIndicator = true;
            schObj.dataBind();
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toBe(1);
            expect(app[0].querySelector('.e-time').innerHTML).toEqual('2:00 AM - 5:00 AM');
        });
        it('CR issue - EJ2-61857 - On refreshEvents method with local data refresh', () => {
            schObj.dataBound = null;
            schObj.refreshEvents(false);
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toBe(1);
            expect(app[0].querySelector('.e-time').innerHTML).toEqual('2:00 AM - 5:00 AM');
        });
    });

    describe('Check Agenda view appointment focus', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 10,
                Subject: 'Meeting',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                RoomId: [1, 2],
                OwnerId: [1, 2, 3]
            }, {
                Id: 11,
                Subject: 'Testing',
                StartTime: new Date(2018, 3, 2, 10, 0),
                EndTime: new Date(2018, 3, 2, 12, 30),
                IsAllDay: false,
                RoomId: [1, 2],
                OwnerId: [1, 2, 3]
            }
        ];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                currentView: 'Agenda',
                height: '550px',
                width: '100%',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: true,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ]
            };
            schObj = util.createSchedule(options, resourceData.concat(eventData), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check scrollbar after open/close quick popup', () => {
            const appEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            appEle[1].click();
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toBe(3);
            expect(Math.floor(schObj.element.querySelector('.e-content-wrap').scrollTop)).toBe(0);
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-close') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toBe(3);
            expect(Math.floor(schObj.element.querySelector('.e-content-wrap').scrollTop)).toBe(0);
        });
    });

    describe('ES-835930 - Checking the work cell Selection', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 11,
            Subject: 'Vacation',
            StartTime: new Date(2017, 9, 30, 13, 45),
            EndTime: new Date(2017, 9, 30, 15, 45),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            IsAllDay: false
        },
        {
            Id: 12,
            Subject: 'Meeting',
            StartTime: new Date(2017, 9, 30, 16, 30),
            EndTime: new Date(2017, 9, 30, 17, 30),
            IsAllDay: false
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 10, 1), timezone: 'America/New_York', width: '100%',
            height: '550px', };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the scroll position on occurrence Event save', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toEqual(648);
                done();
            };
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toEqual(648);
            util.triggerMouseEvent(app[2], 'click');
            util.triggerMouseEvent(app[2], 'dblclick');
            const quickDialog: HTMLElement = document.querySelector('.e-quick-dialog');
            (quickDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement).click();
            const dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog');
            const start = (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0];
            start.value = new Date(2017, 9, 31, 10, 30, 0);
            start.dataBind();
            const end = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0];
            end.value = new Date(2017, 9, 31, 12, 30, 0);
            end.dataBind();
            (dialogElement.querySelector('.e-event-save') as HTMLElement).click();
        });
        it('Checking the cell Selection on updating the event', (done: DoneFn) => {
            schObj.dataBound = () => {
                const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells.e-selected-cell');
                expect(workCell.getAttribute('data-date')).toBe('1509710400000');
                done();
            };
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(app[1], 'click');
            util.triggerMouseEvent(app[1], 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog');
            const start = (dialogElement.querySelector('.e-start') as EJ2Instance).ej2_instances[0];
            start.value = new Date(2017, 10, 3, 12, 0, 0);
            start.dataBind();
            const end = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0];
            end.value = new Date(2017, 10, 3, 13, 0, 0);
            end.dataBind();
            (dialogElement.querySelector('.e-event-save') as HTMLElement).click();
        });
        it('Checking the cell Selection on deleting the event', (done: DoneFn) => {
            schObj.dataBound = () => {
                const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells.e-selected-cell');
                expect(workCell.getAttribute('data-date')).toBe('1509710400000');
                done();
            };
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(app[5], 'click');
            util.triggerMouseEvent(app[5], 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog');
            (dialogElement.querySelector('.e-event-delete') as HTMLElement).click();
            const quickDialog: HTMLElement = document.querySelector('.e-quick-dialog');
            (quickDialog.querySelector('.e-quick-dialog-delete') as HTMLElement).click();
        });
    });

    describe('ES-843662 - Checking the Recurrence exception with timezone', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Customer',
            StartTime: "2023-08-14T19:00:00.000Z",
            EndTime: "2023-08-14T19:30:00.000Z",
            RecurrenceRule: "FREQ=DAILY;",
            RecurrenceException: "20230814T190000Z,"
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2023, 7, 18), timezone: 'America/New_York', width: '100%',
            height: '550px', };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the recurrence exception on initial loading', () => {
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toEqual(5);
            expect((app[0].querySelector('.e-time') as HTMLElement).innerText).toEqual('3:00 PM - 3:30 PM');
        });
    });

    describe('ES-847447 - Checking event double click event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting with customer',
            StartTime: new Date(2023, 7, 14, 9),
            EndTime: new Date(2023, 7, 14, 10)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 7, 18),
                height: '550px'
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the event double click args', () => {
            schObj.eventDoubleClick = (args: EventClickArgs) => {
                expect(args.cancel).toEqual(false);
                expect(args.element).not.toBeNull();
                expect(args.event).not.toBeNull();
                expect((args.event as Record<string, any>).Id).toEqual(1);
                expect((args.event as Record<string, any>).Subject).toEqual('Meeting with customer');
                expect(args.name).toEqual('eventDoubleClick');
                expect((args as Record<string, any>).originalEvent).not.toBeNull();
            }
            const app: HTMLElement = schObj.element.querySelector('.e-appointment');
            util.triggerMouseEvent(app, 'click');
            util.triggerMouseEvent(app, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.firstElementChild.classList.contains('e-popup-open')).toEqual(true);
            const closeIcon: HTMLElement = dialogElement.querySelector('.e-dlg-closeicon-btn') as HTMLElement;
            closeIcon.click();
        });
        it('Preventing opening of the editor window by setting up args.cancel value as true', () => {
            schObj.eventDoubleClick = (args: EventClickArgs) => {
                expect(args.cancel).toEqual(false);
                args.cancel = true;
                expect(args.cancel).toEqual(true);
            }
            const app: HTMLElement = schObj.element.querySelector('.e-appointment');
            util.triggerMouseEvent(app, 'click');
            util.triggerMouseEvent(app, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.firstElementChild.classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('ES-856542 - Checking all day event in different timezone', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Subject: '2023-12-02 all-day appointment',
            StartTime: '2023-12-02',
            EndTime: '2023-12-02',
            IsAllDay: true
        },
        {
            Subject: '2023-12-02 appointment',
            IsAllDay: false,
            StartTime: '2023-12-02T09:15:00+02:00',
            EndTime: '2023-12-02T15:15:00+02:00'
        }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 11, 2),
                height: '550px',
                timezone: 'Europe/Amsterdam'
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking all day appointment is properly rendered', () => {
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toEqual(2);
            expect(app[0].classList.contains('e-all-day-appointment')).toEqual(true);
            expect(app[1].classList.contains('e-all-day-appointment')).toEqual(false);
            const startDate: Date = new Date(schObj.eventsData[0].StartTime);
            const startYear: number = startDate.getFullYear();
            const startMonth: string = (startDate.getMonth() + 1) < 10 ? `0${startDate.getMonth() + 1}` : (startDate.getMonth() + 1).toString();
            const startDay: string = (startDate.getDate()) < 10 ? `0${startDate.getDate()}` : (startDate.getDate()).toString();
            const formattedStartDate: string = `${startYear}-${startMonth}-${startDay}`;
            expect(eventData[0].StartTime).toEqual(formattedStartDate);
            const endDate: Date = new Date(schObj.eventsData[0].EndTime);
            const endYear: number = endDate.getFullYear();
            const endMonth: string = (endDate.getMonth() + 1) < 10 ? `0${endDate.getMonth() + 1}` : (endDate.getMonth() + 1).toString();
            const endDay: string = (endDate.getDate()) < 10 ? `0${endDate.getDate()}` : (endDate.getDate()).toString();
            const formattedEndDate: string = `${endYear}-${endMonth}-${endDay}`;
            expect(eventData[0].EndTime).toEqual(formattedEndDate);
        });
    });

    describe('ES-870037 - Checking the appointments sorting and overflow', () => {
        let schObj: Schedule;
        const generateStaticEvents = (start: Date): Record<string, any>[] => {
            var data = [];
            var startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            var endDate = new Date(startDate.getTime() + (((1440 + 30) * (1000 * 60)) * 2));
            data.push({
                Id: 1,
                Subject: 'Event #' + 1,
                StartTime: startDate,
                EndTime: endDate,
                IsAllDay: false,
                ResourceId: 1,
                Type: 2
            });
            data.push({
                Id: 2,
                Subject: 'Event #' + 2,
                StartTime: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
                EndTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                IsAllDay: false,
                ResourceId: 1,
                Type: 1
            });
            data.push({
                Id: 3,
                Subject: 'Event #' + 3,
                StartTime: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
                EndTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                IsAllDay: false,
                ResourceId: 1,
                Type: 1
            });
            return data;
        }
        let ownerData = [{ Id: 1, Text: 'Nancy', Color: '#ffaa00' }, { Id: 2, Text: 'Steven', Color: '#f8a398' }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '500px',
                headerRows: [{ option: 'Date' }],
                currentView: 'TimelineWeek',
                views: [{ option: 'TimelineWeek' }],
                eventSettings: {
                    sortComparer: (evt) => evt.sort((a, b) => (a.Type == b.Type) ? a.StartTime.getTime() - b.StartTime.getTime() : a.Type > b.Type ? 1 : -1)
                },
                group: { byGroupID: false, resources: ['Resources'] },
                resources: [{
                    field: 'ResourceId', title: 'Resource', name: 'Resources', allowMultiple: true,
                    dataSource: ownerData, textField: 'Text', idField: 'Id', colorField: 'Color'
                }],
                rowAutoHeight: true,
                selectedDate: new Date(2024, 3, 2),
            };
            schObj = util.createSchedule(model, generateStaticEvents(new Date(2024, 3, 2)), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointments overlapping by checking top values', () => {
            const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(app.length).toEqual(3);
            expect(app[0].offsetTop).toEqual(2);
            expect(app[1].offsetTop).toEqual(42);
            expect(app[2].offsetTop).toEqual(82);
        });

        describe('ES-887496 - Checking property endhour not working by setting specific timeScale properties ', () => {
            let schObj: Schedule;
            const eventData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Explosion of Betelgeuse Star',
                Location: 'Space Centre USA',
                StartTime: new Date(2024, 1, 15, 5, 0),
                EndTime: new Date(2024, 1, 15, 18, 0),
                CategoryColor: '#1aaa55'
            },
            {
                Id: 2,
                Subject: 'event -2',
                Location: 'Space Centre USA',
                StartTime: new Date(2024, 1, 15, 11, 15),
                EndTime: new Date(2024, 1, 15, 13, 0),
                CategoryColor: '#1aaa55'
            },
            {
                Id: 3,
                Subject: 'event -3',
                Location: 'Space Centre USA',
                StartTime: new Date(2024, 1, 15, 12, 0),
                EndTime: new Date(2024, 1, 15, 13, 0),
                CategoryColor: '#1aaa55'
            },
            {
                Id: 4,
                Subject: 'event -4',
                Location: 'Space Centre USA',
                StartTime: new Date(2024, 1, 15, 12, 30),
                EndTime: new Date(2024, 1, 15, 13, 0),
                CategoryColor: '#1aaa55'
            }];
            beforeAll((done: DoneFn) => {
                const options: ScheduleModel = {
                    height: '550px', width: '500px', selectedDate: new Date(2024, 1, 15),
                    timeScale: { enable: true, interval: 1440, slotCount: 1 },
                    views: ['TimelineDay'],
                    startHour: '05:00',
                    endHour: '18:00'
                };
                schObj = util.createSchedule(options, eventData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('Check the StartHour and EndHour properties using and verify the full width of the events', () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement1: HTMLElement = (schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement);
                expect(eventElement1.offsetWidth).toEqual(cellElement.offsetWidth);
                expect(eventElement1.style.left).toEqual('0px');
                const eventElement2: HTMLElement = (schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement);
                expect(eventElement2.style.width).toEqual('67.0385px');
                expect(eventElement2.style.left).toEqual('239.423px');
                const eventElement3: HTMLElement = (schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement);
                expect(eventElement3.style.width).toEqual('38.3077px');
                expect(eventElement3.style.left).toEqual('268.154px');
                const eventElement4: HTMLElement = (schObj.element.querySelectorAll('.e-appointment')[3] as HTMLElement);
                expect(eventElement4.style.width).toEqual('19.1538px');
                expect(eventElement4.style.left).toEqual('287.308px');
                const eventElement2Left: number = parseInt(eventElement2.style.left, 10);
                const eventElement3Left: number = parseInt(eventElement3.style.left, 10);
                const eventElement4Left: number = parseInt(eventElement4.style.left, 10);
                expect((eventElement2Left - eventElement3Left) + parseInt(eventElement2.style.width, 10))
                    .toEqual(parseInt(eventElement3.style.width, 10));
                expect((eventElement3Left - eventElement4Left) + parseInt(eventElement3.style.width, 10))
                    .toEqual(parseInt(eventElement4.style.width, 10));
            });
        });
    });

    describe('ES-915440 - Checking recurring event with BDAY in timezone', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2018, 2, 2),
                height: '550px',
                timezone: 'Asia/Kolkata',
                currentView: 'Month'
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking recurring appointment with timezone is properly rendered', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                const app: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(app.length).toEqual(10);
                expect(schObj.eventsData[0].StartTime.toString()).toContain('Tue Feb 27 2018 08:30:00');
                expect(schObj.eventsData[0].EndTime.toString()).toContain('Tue Feb 27 2018 09:00:00');
                expect(schObj.eventsData[0].RecurrenceRule).toEqual('FREQ=WEEKLY;BYDAY=MO,FR;INTERVAL=1;COUNT=10;');
                expect(app[0].getAttribute('data-id')).toEqual('Appointment_1');
                expect(app[0].getAttribute('aria-label')).toContain('Begin From Tuesday, February 27, 2018 at 8:30:00 AM');
                expect(app[0].getAttribute('aria-label')).toContain('Ends At Tuesday, February 27, 2018 at 9:00:00 AM');
                expect(app[0].getAttribute('data-id')).toEqual('Appointment_1');
                expect(app[1].getAttribute('aria-label')).toContain('Begin From Saturday, March 3, 2018 at 8:30:00 AM');
                expect(app[1].getAttribute('aria-label')).toContain('Ends At Saturday, March 3, 2018 at 9:00:00 AM');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
            subjectElement.value = 'Recurring Event';
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            const timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            timezoneElement.click();
            const startTZDropDown: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS);
            ((startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList).value = 'America/Vancouver';
            ((startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList).dataBind();
            const startElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            ((startElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = new Date(2018, 1, 26, 19, 0);
            ((startElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = new Date(2018, 1, 26, 19, 30);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const repeatElement: HTMLElement = dialogElement.querySelector('.e-repeat-element');
            ((repeatElement as EJ2Instance).ej2_instances[0] as DropDownList).value = 'weekly';
            ((repeatElement as EJ2Instance).ej2_instances[0] as DropDownList).dataBind();
            (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0].value = 'count';
            const fridayButton: HTMLElement = dialogElement.querySelector('.e-days .e-btn[data-index="5"]');
            fridayButton.click();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });
    });

    describe('Checking the allowOverlap property in all views for normal events', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'OverlapEvent-1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 11, 30),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'NonOverlapEvent-1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 12, 30),
            IsAllDay: false
        }, {
            Id: 3,
            Subject: 'AllDayNonOverlap-1',
            StartTime: new Date(2017, 9, 30),
            EndTime: new Date(2017, 9, 31),
            IsAllDay: true
        }, {
            Id: 4,
            Subject: 'AlldayOverlapEvent-1',
            StartTime: new Date(2017, 9, 30, 11, 0),
            EndTime: new Date(2017, 9, 30, 11, 30),
            IsAllDay: false
        }, {
            Id: 5,
            Subject: 'NonOverlapEvent-3',
            StartTime: new Date(2017, 9, 31, 11, 0),
            EndTime: new Date(2017, 9, 31, 14, 0),
            IsAllDay: false
        }, {
            Id: 6,
            Subject: 'OverlapEvent-3',
            StartTime: new Date(2017, 9, 31, 9, 30),
            EndTime: new Date(2017, 9, 31, 11, 45),
            IsAllDay: false
        }];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                views: [
                    { option: 'Day', allowOverlap: false },
                    { option: 'Week', allowOverlap: false },
                    { option: 'WorkWeek', allowOverlap: false },
                    { option: 'Month', allowOverlap: false },
                    { option: 'TimelineDay', allowOverlap: false },
                    { option: 'TimelineWeek', allowOverlap: false },
                    { option: 'TimelineWorkWeek', allowOverlap: false },
                    { option: 'TimelineMonth', allowOverlap: false }
                ],
                height: '550px',
                width: '100%',
                selectedDate: new Date(2017, 9, 30),
                currentView: 'Week',
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking allowOverlap property in Day view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(1);
                expect(schObj.eventsProcessed.length).toBe(1);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in Week view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(3);
                expect(schObj.eventsProcessed.length).toBe(3);
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in WorkWeek view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(2);
                expect(schObj.eventsProcessed.length).toBe(2);
                done();
            };
            schObj.currentView = 'WorkWeek';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in Month view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(3);
                expect(schObj.eventsProcessed.length).toBe(3);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in TimelineDay view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(1);
                expect(schObj.eventsProcessed.length).toBe(1);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in TimelineWeek view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(3);
                expect(schObj.eventsProcessed.length).toBe(3);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in TimelineWorkWeek view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(2);
                expect(schObj.eventsProcessed.length).toBe(2);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('Checking allowOverlap property in TimelineMonth view', (done: Function) => {
            schObj.dataBound = () => {
                const appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                expect(appointmentElements.length).toBe(3);
                expect(schObj.eventsProcessed.length).toBe(3);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
    });

    describe('Checking the allowOverlap in intial load with resources in all Views', () => {
        let schObj: Schedule;
        const resourceData = [
            {
                Id: 1,
                Subject: 'Workflow Analysis',
                StartTime: new Date(2018, 3, 2, 9, 30),
                EndTime: new Date(2018, 3, 2, 12, 0),
                IsAllDay: false,
                OwnerId: 1,
                RoomId: 1
            }, {
                Id: 2,
                Subject: 'Requirement planning',
                StartTime: new Date(2018, 3, 2, 9, 0),
                EndTime: new Date(2018, 3, 2, 10, 0),
                IsAllDay: false,
                OwnerId: 2,
                RoomId: 1
            }, {
                Id: 3,
                Subject: 'Quality Analysis',
                StartTime: new Date(2018, 3, 2, 9, 30),
                EndTime: new Date(2018, 3, 2, 12, 0),
                IsAllDay: false,
                OwnerId: 2,
                RoomId: 1
            }, {
                Id: 4,
                Subject: 'Resource planning',
                StartTime: new Date(2018, 3, 2, 9, 30),
                EndTime: new Date(2018, 3, 2, 10, 30),
                IsAllDay: false,
                OwnerId: 1,
                RoomId: 1
            }, {
                Id: 5,
                Subject: 'Timeline estimation',
                StartTime: new Date(2018, 3, 3, 9, 0),
                EndTime: new Date(2018, 3, 3, 11, 30),
                IsAllDay: false,
                OwnerId: 3,
                RoomId: 2
            }, {
                Id: 6,
                Subject: 'Developers Meeting',
                StartTime: new Date(2018, 3, 3, 14, 0),
                EndTime: new Date(2018, 3, 3, 16, 45),
                IsAllDay: false,
                OwnerId: 3,
                RoomId: 2
            }, {
                Id: 7,
                Subject: 'Project Review',
                StartTime: new Date(2018, 3, 3, 9, 0),
                EndTime: new Date(2018, 3, 3, 11, 30),
                IsAllDay: false,
                OwnerId: 2,
                RoomId: 1
            }, {
                Id: 8,
                Subject: 'Manual testing',
                StartTime: new Date(2018, 3, 4, 9, 15),
                EndTime: new Date(2018, 3, 4, 11, 45),
                IsAllDay: false,
                OwnerId: 3,
                RoomId: 2
            }, {
                Id: 9,
                Subject: 'Project Preview',
                StartTime: new Date(2018, 3, 4, 9, 30),
                EndTime: new Date(2018, 3, 4, 12, 45),
                IsAllDay: false,
                OwnerId: 1,
                RoomId: 1
            }
        ];
        const scheduleOptions: ScheduleModel = {
            width: '100%',
            height: '550px',
            selectedDate: new Date(2018, 3, 4),
            views: [
                { option: 'Day', allowOverlap: false },
                { option: 'Week', allowOverlap: false },
                { option: 'WorkWeek', allowOverlap: false },
                { option: 'Month', allowOverlap: false },
                { option: 'TimelineDay', allowOverlap: false },
                { option: 'TimelineWeek', allowOverlap: false },
                { option: 'TimelineWorkWeek', allowOverlap: false },
                { option: 'TimelineMonth', allowOverlap: false }
            ],
            group: {
                resources: ['Rooms', 'Owners']
            },
            resources: [{
                field: 'RoomId', title: 'Room',
                name: 'Rooms', allowMultiple: false,
                dataSource: [
                    { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                    { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                ],
                textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
            }, {
                field: 'OwnerId', title: 'Owner',
                name: 'Owners', allowMultiple: true,
                dataSource: [
                    { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                    { OwnerText: 'Steven', Id: 2, OwnerGroupId: 1, OwnerColor: '#f8a398' },
                    { OwnerText: 'Michael', Id: 3, OwnerGroupId: 2, OwnerColor: '#7499e1' }
                ],
                textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
            }],
            eventSettings: { dataSource: resourceData }
        };
        beforeAll((done: DoneFn) => {
            schObj = util.createSchedule(scheduleOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        const testAllowOverlapForView = function (viewName: View) {
            it("Checking the allowOverlap property for the initial load with resources in " + viewName + " view", function (done) {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(function () {
                    if (!(viewName === 'Day' || viewName === 'TimelineDay')) {
                        var appointmentElements = schObj.element.querySelectorAll('.e-appointment');
                        expect(appointmentElements.length).toBeGreaterThan(0);
                        var apr2Events = schObj.eventsProcessed.filter(function (event) { return event.StartTime.getDate() === 2; });
                        expect(apr2Events.length).toBe(2);
                        expect(apr2Events[0].Subject).toBe('Requirement planning');
                        expect(apr2Events[1].Subject).toBe('Workflow Analysis');
                        var apr3Events = schObj.eventsProcessed.filter(function (event) { return event.StartTime.getDate() === 3; });
                        expect(apr3Events.length).toBe(3);
                        expect(apr3Events[0].Subject).toBe('Timeline estimation');
                        expect(apr3Events[1].Subject).toBe('Project Review');
                        expect(apr3Events[2].Subject).toBe('Developers Meeting');
                        var apr4Events = schObj.eventsProcessed.filter(function (event) { return event.StartTime.getDate() === 4; });
                        expect(apr4Events.length).toBe(2);
                        expect(apr4Events[0].Subject).toBe('Manual testing');
                        expect(apr4Events[1].Subject).toBe('Project Preview');
                    } else {
                        var apr4Events = schObj.eventsProcessed.filter(function (event) { return event.StartTime.getDate() === 4; });
                        expect(apr4Events.length).toBe(2);
                        expect(apr4Events[0].Subject).toBe('Manual testing');
                        expect(apr4Events[1].Subject).toBe('Project Preview');
                    }
                    done();
                }, 500);
            });
        };
        testAllowOverlapForView('Day');
        testAllowOverlapForView('Week');
        testAllowOverlapForView('WorkWeek');
        testAllowOverlapForView('Month');
        testAllowOverlapForView('TimelineDay');
        testAllowOverlapForView('TimelineWeek');
        testAllowOverlapForView('TimelineWorkWeek');
        testAllowOverlapForView('TimelineMonth');
    });

    describe('Appointment editing with overlap validation in different views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 10, 30)
            },
            {
                Id: 2,
                Subject: 'Appointment 2',
                StartTime: new Date(2023, 0, 2, 11, 0),
                EndTime: new Date(2023, 0, 2, 11, 30)
            }
        ];
        beforeEach((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: [
                    { option: 'Day', allowOverlap: false },
                    { option: 'Week', allowOverlap: false },
                    { option: 'WorkWeek', allowOverlap: false },
                    { option: 'Month', allowOverlap: false },
                    { option: 'TimelineDay', allowOverlap: false },
                    { option: 'TimelineWeek', allowOverlap: false },
                    { option: 'TimelineWorkWeek', allowOverlap: false },
                    { option: 'TimelineMonth', allowOverlap: false }
                ],
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Appointment 2');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        const testOverlapValidation = (viewName: View) => {
            it(`should show validation popup when editing appointment to cause overlap and keep editor open in ${viewName} view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(appointment1).toBeTruthy();
                    util.triggerMouseEvent(appointment1, 'click');
                    util.triggerMouseEvent(appointment1, 'dblclick');
                    setTimeout(() => {
                        const editorWindow: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                        expect(editorWindow).toBeTruthy();
                        const endTimeInput: HTMLInputElement = editorWindow.querySelector('.e-end') as HTMLInputElement;
                        const endTimePicker = (endTimeInput as any).ej2_instances[0];
                        endTimePicker.value = new Date(2023, 0, 2, 12, 0);
                        endTimePicker.dataBind();
                        const saveButton: HTMLElement = editorWindow.querySelector('.e-event-save') as HTMLElement;
                        saveButton.click();
                        setTimeout(() => {
                            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                            expect(alertDialog).toBeTruthy();
                            expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                            (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                            const editorWindowAfterAlert: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                            expect(editorWindowAfterAlert).toBeTruthy();
                            const cancelButton: HTMLElement = editorWindowAfterAlert.querySelector('.e-event-cancel') as HTMLElement;
                            cancelButton.click();
                            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                            expect((event.StartTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 0).getTime());
                            expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 30).getTime());
                            done();
                        }, 300);
                    }, 300);
                }, 300);
            });
        };
        testOverlapValidation('Day');
        testOverlapValidation('Week');
        testOverlapValidation('WorkWeek');
        testOverlapValidation('Month');
        testOverlapValidation('TimelineDay');
        testOverlapValidation('TimelineWeek');
        testOverlapValidation('TimelineWorkWeek');
        testOverlapValidation('TimelineMonth');
    });

    describe('Checking sortcomparer function for Overlap API', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Rank 1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 11, 30),
            IsAllDay: false,
            RankId: '1'
        }, {
            Id: 2,
            Subject: 'Rank 3',
            StartTime: new Date(2017, 9, 29, 10, 30),
            EndTime: new Date(2017, 9, 29, 12, 30),
            IsAllDay: false,
            RankId: '3'
        }, {
            Id: 3,
            Subject: 'Rank 6',
            StartTime: new Date(2017, 9, 29, 7, 0),
            EndTime: new Date(2017, 9, 29, 14, 30),
            IsAllDay: false,
            RankId: '6'
        }, {
            Id: 4,
            Subject: 'Rank 9',
            StartTime: new Date(2017, 9, 29, 11, 0),
            EndTime: new Date(2017, 9, 29, 15, 30),
            IsAllDay: false,
            RankId: '9'
        }];
        beforeAll((done: DoneFn) => {
            const ComparerFn: string = 'sortComparer';
            (window as any).sortComparer = (args: any) => {
                args.sort((a: any, b: any) => a.RankId.localeCompare(b.RankId, undefined, { numeric: true }));
                return args;
            };
            const options: ScheduleModel = {
                height: '550px', width: '100%', selectedDate: new Date(2017, 9, 29),
                views: ['Week', 'Month', 'TimelineDay', 'TimelineMonth'],
                currentView: 'Week',
                allowOverlap: false,
                eventSettings: {
                    sortComparer: ComparerFn as any
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Overlap API should sort events based on their RankId', () => {
            const eventElement: Element = schObj.element.querySelector('.e-appointment');
            const expectedRankId: string = '1';
            const eventDetails: Record<string, any> = schObj.getEventDetails(eventElement);
            expect(eventDetails.RankId).toEqual(expectedRankId);
            expect(schObj.eventsProcessed.length).toBe(1);
        });
    });

    describe('Checking the events are assign to args.promise in actionBegin for add event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 1),
                views: ['Week'],
                currentView: 'Week',
                allowOverlap: false,
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('OverlapEvent1');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('should handle add event with promise without overlap events', (done: DoneFn) => {
            const newEvent = {
                Id: 1,
                Subject: 'Test Event',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 11, 0)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventCreate') {
                    args.promise = Promise.resolve(true);
                }
            };
            schObj.addEvent(newEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                if (schObj.eventsData.length > 0) {
                    expect(schObj.eventsData[0].Subject).toBe('Test Event');
                }
                done();
            }, 100);
        });

        it('should handle add event with promise with overlap events', (done: DoneFn) => {
            const overlapEvent = {
                Id: 2,
                Subject: 'OverlapEvent1',
                StartTime: new Date(2023, 0, 2, 12, 0),
                EndTime: new Date(2023, 0, 2, 12, 30)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventCreate') {
                    args.promise = Promise.resolve(false);
                }
            };
            schObj.addEvent(overlapEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                if (schObj.eventsData.length > 0) {
                    expect(schObj.eventsData[0].Subject).toBe('Test Event');
                }
                done();
            }, 100);
        });

        it('should handle add event promise rejection', (done: DoneFn) => {
            const failureEvent = {
                Id: 3,
                Subject: 'Failed Event',
                StartTime: new Date(2023, 0, 3, 10, 0),
                EndTime: new Date(2023, 0, 3, 11, 0)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventCreate') {
                    args.promise = Promise.reject(new Error('Add event failed'));
                }
            };
            schObj.addEvent(failureEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                done();
            }, 100);
        });
    });

    describe('Checking the events are assign to args.promise in actionBegin for save event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Initial Event',
            StartTime: new Date(2023, 0, 2, 9, 0),
            EndTime: new Date(2023, 0, 2, 10, 0)
        }];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 1),
                views: ['Week'],
                currentView: 'Week',
                allowOverlap: false,
                eventSettings: { dataSource: eventData },
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('OverlapEvent1');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('should handle save event with promise without overlap', (done: DoneFn) => {
            const updatedEvent = {
                Id: 1,
                Subject: 'Updated Event',
                StartTime: new Date(2023, 0, 2, 11, 0),
                EndTime: new Date(2023, 0, 2, 12, 0)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventChange') {
                    args.promise = Promise.resolve(true);
                }
            };
            schObj.saveEvent(updatedEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                expect(schObj.eventsData[0].Subject).toBe('Updated Event');
                done();
            }, 100);
        });

        it('should handle save event with promise with overlap', (done: DoneFn) => {
            const overlapEvent = {
                Id: 1,
                Subject: 'OverlapEvent1',
                StartTime: new Date(2023, 0, 2, 9, 30),
                EndTime: new Date(2023, 0, 2, 10, 30)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventChange') {
                    args.promise = Promise.resolve(false);
                }
            };
            schObj.saveEvent(overlapEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                expect(schObj.eventsData[0].Subject).toBe('Updated Event');
                done();
            }, 100);
        });

        it('should handle save event promise rejection', (done: DoneFn) => {
            const failureEvent = {
                Id: 1,
                Subject: 'Failed Update',
                StartTime: new Date(2023, 0, 3, 10, 0),
                EndTime: new Date(2023, 0, 3, 11, 0)
            };
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventChange') {
                    args.promise = Promise.reject(new Error('Save event failed'));
                }
            };
            schObj.saveEvent(failureEvent);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                expect(schObj.eventsData[0].Subject).toBe('Updated Event');
                done();
            }, 100);
        });
    });

    describe('Checking the events are assign to args.promise in actionBegin for delete event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Event to Delete',
                StartTime: new Date(2023, 0, 2, 9, 0),
                EndTime: new Date(2023, 0, 2, 10, 0)
            },
            {
                Id: 2,
                Subject: 'Event to not Delete',
                StartTime: new Date(2023, 0, 2, 9, 0),
                EndTime: new Date(2023, 0, 2, 10, 0)
            }
        ];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 1),
                views: ['Week'],
                currentView: 'Week',
                eventSettings: { dataSource: eventData }
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('should handle delete event with promise allowing deletion', (done: DoneFn) => {
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventRemove') {
                    args.promise = Promise.resolve(true);
                }
            };
            schObj.deleteEvent(1);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                expect(schObj.eventsData[0].Subject).toBe('Event to not Delete');
                done();
            }, 100);
        });

        it('should handle delete event with promise preventing deletion', (done: DoneFn) => {
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventRemove') {
                    args.promise = Promise.resolve(false);
                }
            };
            schObj.deleteEvent(1);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(1);
                expect(schObj.eventsData[0].Subject).toBe('Event to not Delete');
                done();
            }, 100);
        });
    });

    describe('Checking the events are assign to args.promise  promise rejection delete event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Event to Delete',
                StartTime: new Date(2023, 0, 2, 9, 0),
                EndTime: new Date(2023, 0, 2, 10, 0)
            },
            {
                Id: 2,
                Subject: 'Event to not Delete',
                StartTime: new Date(2023, 0, 2, 9, 0),
                EndTime: new Date(2023, 0, 2, 10, 0)
            }
        ];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 1),
                views: ['Week'],
                currentView: 'Week',
                eventSettings: { dataSource: eventData }
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('should handle delete event promise rejection', (done: DoneFn) => {
            let actionFailureCalled = false;
            schObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'eventRemove') {
                    args.promise = Promise.reject(new Error('Delete event failed'));
                }
            };
            schObj.actionFailure = (args: { error: Error }) => {
                actionFailureCalled = true;
                expect(args.error.message).toBe('Delete event failed');
            };
            schObj.deleteEvent(1);
            setTimeout(() => {
                expect(schObj.eventsData.length).toBe(2);
                expect(schObj.eventsData[0].Subject).toBe('Event to Delete');
                expect(actionFailureCalled).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Appointment resizing with overlap validation in different views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 10, 30)
            },
            {
                Id: 2,
                Subject: 'Appointment 2',
                StartTime: new Date(2023, 0, 2, 11, 0),
                EndTime: new Date(2023, 0, 2, 11, 30)
            },
            {
                Id: 3,
                Subject: 'Appointment 3',
                StartTime: new Date(2023, 0, 3, 10, 0),
                EndTime: new Date(2023, 0, 3, 10, 30)
            }
        ];
        beforeEach((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: [
                    { option: 'Day', allowOverlap: false },
                    { option: 'Week', allowOverlap: false },
                    { option: 'WorkWeek', allowOverlap: false },
                    { option: 'Month', allowOverlap: false },
                    { option: 'TimelineDay', allowOverlap: false },
                    { option: 'TimelineWeek', allowOverlap: false },
                    { option: 'TimelineWorkWeek', allowOverlap: false },
                    { option: 'TimelineMonth', allowOverlap: false }
                ],
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Appointment 2');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        const testOverlapValidationForDayWeekWorkWeek = (viewName: View) => {
            it(`should not allow bottom resizing when it would cause overlap and show alert in Vertical view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(resizeElement).toBeTruthy();
                    const resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
                    expect(resizeHandler).toBeTruthy();
                    triggerMouseEvent(resizeHandler, 'mousedown');
                    triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
                    const cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
                    expect(cloneElement).toBeTruthy();
                    triggerMouseEvent(resizeHandler, 'mousemove', 0, 100);
                    triggerMouseEvent(resizeHandler, 'mouseup');
                    setTimeout(() => {
                        const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                        expect(alertDialog).toBeTruthy();
                        expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                        (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                        const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                        expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 30).getTime());
                        done();
                    }, 300);
                }, 300);
            });
        };
        const testOverlapValidationForMonth = (viewName: View) => {
            it(`should not allow right resizing when it would cause overlap and show alert in Month view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(resizeElement).toBeTruthy();
                    const resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
                    expect(resizeHandler).toBeTruthy();
                    util.triggerMouseEvent(resizeHandler, 'mousedown', 130, 120);
                    util.triggerMouseEvent(resizeHandler, 'mousemove', 200, 120);
                    util.triggerMouseEvent(resizeHandler, 'mouseup', 200, 120);
                    setTimeout(() => {
                        const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                        expect(alertDialog).toBeTruthy();
                        expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                        (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                        const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                        expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 30).getTime());
                        done();
                    }, 300);
                }, 300);
            });
        };
        const testOverlapValidationForTimeline = (viewName: View) => {
            it(`should not allow right resizing when it would cause overlap and show alert in Timeline view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(resizeElement).toBeTruthy();
                    const resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
                    expect(resizeHandler).toBeTruthy();
                    triggerMouseEvent(resizeHandler, 'mousedown', 130, 120);
                    triggerMouseEvent(resizeHandler, 'mousemove', 130, 120);
                    const cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
                    expect(cloneElement).toBeTruthy();
                    triggerMouseEvent(resizeHandler, 'mousemove', 200, 120);
                    triggerMouseEvent(resizeHandler, 'mouseup', 200, 120);
                    setTimeout(() => {
                        const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                        expect(alertDialog).toBeTruthy();
                        expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                        (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                        const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                        expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 30).getTime());
                        done();
                    }, 300);
                }, 300);
            });
        };

        testOverlapValidationForDayWeekWorkWeek('Day');
        testOverlapValidationForDayWeekWorkWeek('Week');
        testOverlapValidationForDayWeekWorkWeek('WorkWeek');
        testOverlapValidationForMonth('Month');
        testOverlapValidationForTimeline('TimelineDay');
        testOverlapValidationForTimeline('TimelineWeek');
        testOverlapValidationForTimeline('TimelineWorkWeek');
        testOverlapValidationForTimeline('TimelineMonth');
    });

    xdescribe('Appointment dragging with overlap validation in different views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 10, 30)
            },
            {
                Id: 2,
                Subject: 'Appointment 2',
                StartTime: new Date(2023, 0, 2, 11, 0),
                EndTime: new Date(2023, 0, 2, 11, 30)
            },
            {
                Id: 3,
                Subject: 'Appointment 2',
                StartTime: new Date(2023, 0, 4, 10, 0),
                EndTime: new Date(2023, 0, 4, 10, 30)
            }
        ];
        beforeEach((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: [
                    { option: 'Day', allowOverlap: false },
                    { option: 'Week', allowOverlap: false },
                    { option: 'WorkWeek', allowOverlap: false },
                    { option: 'Month', allowOverlap: false },
                    { option: 'TimelineDay', allowOverlap: false },
                    { option: 'TimelineWeek', allowOverlap: false },
                    { option: 'TimelineWorkWeek', allowOverlap: false },
                    { option: 'TimelineMonth', allowOverlap: false }
                ],
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Appointment 2');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        const testOverlapValidationInView = (viewName: View) => {
            it(`should not allow dragging when it would cause overlap and show alert in ${viewName} view`, (done: DoneFn) => {
                schObj.dataBound = (done: DoneFn) => {
                    let workCell: HTMLElement;
                    const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(dragElement).toBeTruthy();
                    let startX: number; let startY: number; let moveX: number; let moveY: number;
                    let targetCellIndex: number;
                    switch (viewName) {
                    case 'Day':
                        startX = 436;
                        startY = 132;
                        moveX = 435;
                        moveY = 205;
                        targetCellIndex = 20;
                        break;
                    case 'Week':
                        startX = 130;
                        startY = 224;
                        moveX = 130;
                        moveY = 234;
                        targetCellIndex = 171;
                        break;
                    case 'WorkWeek':
                        startX = 230;
                        startY = 224;
                        moveX = 230;
                        moveY = 234;
                        targetCellIndex = 7;
                        break;
                    case 'Month':
                        startX = 10;
                        startY = 10;
                        moveX = 100;
                        moveY = 50;
                        targetCellIndex = 3;
                        break;
                    case 'TimelineDay':
                    case 'TimelineWeek':
                    case 'TimelineWorkWeek':
                        startX = 63;
                        startY = 146;
                        moveX = 233;
                        moveY = 332;
                        targetCellIndex = 22;
                        break;
                    case 'TimelineMonth':
                        startX = 33;
                        startY = 146;
                        moveX = 153;
                        moveY = 332;
                        targetCellIndex = 22;
                        break;
                    }
                    triggerMouseEvent(dragElement, 'mousedown', startX, startY);
                    triggerMouseEvent(dragElement, 'mousemove', startX, startY + 5);
                    const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
                    expect(cloneElement).toBeTruthy();
                    if (viewName === 'WorkWeek') {
                        workCell = schObj.element.querySelectorAll('.e-work-cells.e-alternate-cells.e-work-hours').item(targetCellIndex) as HTMLElement;
                    } else {
                        workCell = schObj.element.querySelectorAll('.e-work-cells').item(targetCellIndex) as HTMLElement;
                    }
                    triggerMouseEvent(workCell, 'mousemove', moveX, moveY);
                    triggerMouseEvent(workCell, 'mousemove', moveX, moveY);
                    triggerMouseEvent(dragElement, 'mouseup');
                    expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                    const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                    expect(alertDialog).toBeTruthy();
                    expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                    (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                    const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                    expect((event.StartTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 0).getTime());
                    expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 30).getTime());
                    done();
                };
                schObj.currentView = viewName;
                schObj.dataBind();
                done();
            });
        };
        testOverlapValidationInView('Day');
        testOverlapValidationInView('Week');
        testOverlapValidationInView('WorkWeek');
        testOverlapValidationInView('Month');
        testOverlapValidationInView('TimelineDay');
        testOverlapValidationInView('TimelineWeek');
        testOverlapValidationInView('TimelineWorkWeek');
        testOverlapValidationInView('TimelineMonth');
    });

    describe('Checking recurrence creation with overlap validation in multiple views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Existing Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 11, 0)
            },
            {
                Id: 2,
                Subject: 'Existing Appointment 2',
                StartTime: new Date(2023, 0, 4, 10, 0),
                EndTime: new Date(2023, 0, 4, 11, 0)
            }
        ];
        const views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: views.map(view => ({ option: view, allowOverlap: false })),
                currentView: 'Week',
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Existing Appointment 2');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        const testOverlapValidationInView = (viewName: View) => {
            it(`should show validation popup when editing appointment to create recurrence that overlaps with existing appointment in ${viewName} view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(appointment1).toBeTruthy();
                    util.triggerMouseEvent(appointment1, 'click');
                    util.triggerMouseEvent(appointment1, 'dblclick');
                    setTimeout(() => {
                        const editorWindow: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                        expect(editorWindow).toBeTruthy();
                        const recurrenceElement: HTMLElement = editorWindow.querySelector('.e-repeat-element') as HTMLElement;
                        const recurrenceDropDown = (recurrenceElement as any).ej2_instances[0];
                        recurrenceDropDown.value = 'daily';
                        recurrenceDropDown.dataBind();
                        const endElement: HTMLElement = editorWindow.querySelector('.e-end-on-element') as HTMLElement;
                        const endDropDown = (endElement as any).ej2_instances[0];
                        endDropDown.value = 'count';
                        endDropDown.dataBind();
                        const countElement: HTMLInputElement = editorWindow.querySelector('.e-recurrence-count') as HTMLInputElement;
                        countElement.value = '2';
                        const saveButton: HTMLElement = editorWindow.querySelector('.e-event-save') as HTMLElement;
                        saveButton.click();
                        setTimeout(() => {
                            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                            expect(alertDialog).toBeTruthy();
                            expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                            (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                            const editorWindowAfterAlert: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                            expect(editorWindowAfterAlert).toBeTruthy();
                            const cancelButton: HTMLElement = editorWindowAfterAlert.querySelector('.e-event-cancel') as HTMLElement;
                            cancelButton.click();
                            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                            expect(event.RecurrenceRule).toBeUndefined();
                            expect((event.StartTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 0).getTime());
                            expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 11, 0).getTime());
                            done();
                        }, 300);
                    }, 300);
                }, 300);
            });
        };

        testOverlapValidationInView('Week');
        testOverlapValidationInView('WorkWeek');
        testOverlapValidationInView('Month');

        testOverlapValidationInView('TimelineWeek');
        testOverlapValidationInView('TimelineWorkWeek');
        testOverlapValidationInView('TimelineMonth');
    });

    describe('Checking recurrence editing with overlap validation in multiple views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Recurring Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            },
            {
                Id: 2,
                Subject: 'Recurring Appointment 2',
                StartTime: new Date(2023, 0, 2, 14, 0),
                EndTime: new Date(2023, 0, 2, 15, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }
        ];
        const views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: views.map(view => ({ option: view, allowOverlap: false })),
                currentView: 'Week'
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        const testOverlapValidationInView = (viewName: View) => {
            it(`should show validation popup when editing recurring appointment series to overlap with another recurring appointment in ${viewName} view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();

                setTimeout(() => {
                    const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(appointment1).toBeTruthy();
                    util.triggerMouseEvent(appointment1, 'click');

                    const quickPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                    expect(quickPopup).toBeTruthy();
                    const editElement: HTMLElement = quickPopup.querySelector('.e-edit') as HTMLElement;
                    util.triggerMouseEvent(editElement, 'click');

                    const quickDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                    expect(quickDialog).toBeTruthy();
                    const editSeriesButton: HTMLElement = quickDialog.querySelector('.e-quick-dialog-series-event') as HTMLElement;
                    util.triggerMouseEvent(editSeriesButton, 'click');

                    setTimeout(() => {
                        const editorWindow: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                        expect(editorWindow).toBeTruthy();
                        const startTimeInput: HTMLInputElement = editorWindow.querySelector('.e-start') as HTMLInputElement;
                        const startTimePicker = (startTimeInput as any).ej2_instances[0];
                        startTimePicker.value = new Date(2023, 0, 2, 13, 30);
                        startTimePicker.dataBind();
                        const endTimeInput: HTMLInputElement = editorWindow.querySelector('.e-end') as HTMLInputElement;
                        const endTimePicker = (endTimeInput as any).ej2_instances[0];
                        endTimePicker.value = new Date(2023, 0, 2, 14, 30);
                        endTimePicker.dataBind();
                        const saveButton: HTMLElement = editorWindow.querySelector('.e-event-save') as HTMLElement;
                        saveButton.click();

                        setTimeout(() => {
                            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                            expect(alertDialog).toBeTruthy();
                            expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                            const alertOkButton: HTMLElement = alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement;
                            alertOkButton.click();

                            const editorWindowAfterAlert: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
                            expect(editorWindowAfterAlert).toBeTruthy();
                            const cancelButton: HTMLElement = editorWindowAfterAlert.querySelector('.e-event-cancel') as HTMLElement;
                            cancelButton.click();

                            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                            expect(event.RecurrenceRule).toBe('FREQ=DAILY;INTERVAL=1;COUNT=5');
                            expect((event.StartTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 10, 0).getTime());
                            expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 11, 0).getTime());
                            done();
                        }, 300);
                    }, 300);
                }, 300);
            });
        };
        testOverlapValidationInView('Day');
        testOverlapValidationInView('Week');
        testOverlapValidationInView('WorkWeek');
        testOverlapValidationInView('Month');
        testOverlapValidationInView('TimelineDay');
        testOverlapValidationInView('TimelineWeek');
        testOverlapValidationInView('TimelineWorkWeek');
        testOverlapValidationInView('TimelineMonth');
    });

    describe('Resizing recurring appointment with overlap validation in multiple views', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Recurring Appointment 1',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            },
            {
                Id: 2,
                Subject: 'Recurring Appointment 2',
                StartTime: new Date(2023, 0, 2, 13, 0),
                EndTime: new Date(2023, 0, 2, 14, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }
        ];
        const views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: views.map(view => ({ option: view, allowOverlap: false })),
                currentView: 'Week',
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Recurring Appointment 2');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        const testResizeOverlapInView = (viewName: View) => {
            it(`should show validation popup when resizing recurring appointment to overlap in ${viewName} view`, (done: DoneFn) => {
                schObj.currentView = viewName;
                schObj.dataBind();
                setTimeout(() => {
                    const resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                    expect(resizeElement).toBeTruthy();
                    let resizeHandler: HTMLElement;
                    const horizontalResizeViews = ['Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
                    if (horizontalResizeViews.indexOf(viewName) !== -1) {
                        resizeHandler = resizeElement.querySelector('.e-right-handler') as HTMLElement;
                    } else {
                        resizeHandler = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
                    }
                    expect(resizeHandler).toBeTruthy();
                    if (viewName === 'Month') {
                        util.triggerMouseEvent(resizeHandler, 'mousedown', 130, 120);
                        util.triggerMouseEvent(resizeHandler, 'mousemove', 200, 120);
                        util.triggerMouseEvent(resizeHandler, 'mouseup', 200, 120);
                    } else {
                        triggerMouseEvent(resizeHandler, 'mousedown');
                        if (horizontalResizeViews.indexOf(viewName) !== -1) {
                            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
                            triggerMouseEvent(resizeHandler, 'mousemove', 200, 0);
                        } else {
                            triggerMouseEvent(resizeHandler, 'mousemove', 0, 100);
                            triggerMouseEvent(resizeHandler, 'mousemove', 0, 200);
                        }
                        const cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
                        expect(cloneElement).toBeTruthy();
                        triggerMouseEvent(resizeHandler, 'mouseup');
                    }
                    setTimeout(() => {
                        const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
                        expect(alertDialog).toBeTruthy();
                        expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                        (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                        const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                        expect(event.RecurrenceRule).toBe('FREQ=DAILY;INTERVAL=1;COUNT=5');
                        expect((event.EndTime as Date).getTime()).toEqual(new Date(2023, 0, 2, 11, 0).getTime());
                        done();
                    }, 300);
                }, 300);
            });
        };
        testResizeOverlapInView('Day');
        testResizeOverlapInView('Week');
        testResizeOverlapInView('WorkWeek');
        testResizeOverlapInView('Month');
        testResizeOverlapInView('TimelineDay');
        testResizeOverlapInView('TimelineWeek');
        testResizeOverlapInView('TimelineWorkWeek');
        testResizeOverlapInView('TimelineMonth');
    });

    describe('Checking the public method for open and close overlap', () => {
        let schObj: Schedule;
        const eventData = [{
            Id: 1,
            Subject: 'OverlapEvent-1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 11, 30),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'NonOverlapEvent-1',
            StartTime: new Date(2017, 9, 29, 10, 0),
            EndTime: new Date(2017, 9, 29, 12, 30),
            IsAllDay: false
        }];

        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                views: [
                    { option: 'Day', allowOverlap: false },
                    { option: 'Week', allowOverlap: false },
                    { option: 'WorkWeek', allowOverlap: false },
                    { option: 'Month', allowOverlap: false },
                    { option: 'TimelineDay', allowOverlap: false },
                    { option: 'TimelineWeek', allowOverlap: false },
                    { option: 'TimelineWorkWeek', allowOverlap: false },
                    { option: 'TimelineMonth', allowOverlap: false }
                ],
                height: '550px',
                width: '100%',
                selectedDate: new Date(2017, 9, 30),
                currentView: 'Week',
            };
            schObj = util.createSchedule(options, eventData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking the Open and close Overlap validation popup', (done: DoneFn) => {
            const overlapEvent = {
                Id: 1,
                Subject: 'OverlapEvent',
                StartTime: new Date(2017, 10, 23, 10, 0),
                EndTime: new Date(2017, 10, 23, 11, 30),
                IsAllDay: false
            };
            const args: PopupOpenEventArgs = {
                type: 'OverlapAlert',
                data: overlapEvent,
                overlapEvents: [],
                element: createElement('div'),
                cancel: false
            };
            schObj.openOverlapAlert(args);
            const alertDialog = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(alertDialog).toBeTruthy();
            expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
            setTimeout(() => {
                schObj.closeOverlapAlert();
                done();
            }, 2000);
        });
    });

    describe('Appointment adding with overlap validation and adjustment in different views', function () {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Existing Appointment',
                StartTime: new Date(2023, 0, 2, 10, 0),
                EndTime: new Date(2023, 0, 2, 11, 0)
            }
        ];
        const views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
        beforeEach((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '550px',
                width: '100%',
                selectedDate: new Date(2023, 0, 2),
                views: views.map(view => ({ option: view, allowOverlap: false })),
                popupOpen: function (args: PopupOpenEventArgs) {
                    if (args.type === 'OverlapAlert') {
                        expect(args.overlapEvents[0].Subject).toBe('Existing Appointment');
                    }
                }
            };
            schObj = util.createSchedule(options, eventData, done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        views.forEach(function (view) {
            it(`should show validation popup when adding overlapping appointment, allow adjustment, and save non-overlapping appointment in ${view} view`, function (done) {
                schObj.currentView = view;
                schObj.dataBind();
                setTimeout(() => {
                    const firstWorkCell = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                    expect(firstWorkCell).toBeTruthy();
                    util.triggerMouseEvent(firstWorkCell, 'dblclick');
                    const editorWindow = document.querySelector('.e-schedule-dialog') as HTMLElement;
                    expect(editorWindow).toBeTruthy();
                    const startTimeInput = editorWindow.querySelector('.e-start') as HTMLElement;
                    const startTimePicker = (startTimeInput as any).ej2_instances[0] as DateTimePicker;
                    startTimePicker.value = new Date(2023, 0, 2, 9, 0);
                    startTimePicker.dataBind();
                    const endTimeInput = editorWindow.querySelector('.e-end') as HTMLElement;
                    const endTimePicker = (endTimeInput as any).ej2_instances[0] as DateTimePicker;
                    endTimePicker.value = new Date(2023, 0, 2, 12, 0);
                    endTimePicker.dataBind();
                    const saveButton = editorWindow.querySelector('.e-event-save') as HTMLElement;
                    saveButton.click();
                    setTimeout(function () {
                        const alertDialog = document.querySelector('.e-quick-dialog') as HTMLElement;
                        expect(alertDialog).toBeTruthy();
                        expect(alertDialog.querySelector('.e-dlg-content').textContent).toContain('Events cannot be scheduled during the chosen time as it overlaps with another event.');
                        (alertDialog.querySelector('.e-quick-dialog-alert-btn') as HTMLElement).click();
                        const editorWindowAfterAlert = document.querySelector('.e-schedule-dialog') as HTMLElement;
                        expect(editorWindowAfterAlert).toBeTruthy();
                        const endTimeInputAfterAlert = editorWindowAfterAlert.querySelector('.e-end') as HTMLElement;
                        const endTimePickerAfterAlert = (endTimeInputAfterAlert as any).ej2_instances[0] as DateTimePicker;
                        endTimePickerAfterAlert.value = new Date(2023, 0, 2, 9, 30);
                        endTimePickerAfterAlert.dataBind();
                        const saveButtonAfterAlert = editorWindowAfterAlert.querySelector('.e-event-save') as HTMLElement;
                        saveButtonAfterAlert.click();
                        setTimeout(function () {
                            const newAppointment = schObj.eventsData.find((event: any) =>
                                event.StartTime.getTime() === new Date(2023, 0, 2, 9, 0).getTime() &&
                                event.EndTime.getTime() === new Date(2023, 0, 2, 9, 30).getTime()
                            );
                            expect(newAppointment).toBeTruthy();
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });
    });

    describe('Allow editing false with recurrence event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Recursive Event',
            StartTime: new Date(2023, 10, 15, 10, 0),
            EndTime: new Date(2023, 10, 15, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px',
                selectedDate: new Date(2023, 10, 15),
                eventSettings: {
                    allowEditing: false,
                }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Double clicking recurrence event should not open popup', () => {
            const appElement: HTMLElement = schObj.element.querySelector('.e-appointment');
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            const dialogElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS);
            expect(dialogElement.firstElementChild.classList.contains('e-popup-open')).toEqual(false);
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
