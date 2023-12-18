/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Events base methods testing
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, Timezone, ScheduleModel, CallbackFunction, EventClickArgs } from '../../../src/schedule/index';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { resourceData } from '../base/datasource.spec';
import { EJ2Instance } from '../../../src/schedule/base/interface';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';

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
            expect(Math.floor(schObj.element.querySelector('.e-content-wrap').scrollTop)).toBe(1);
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-close') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toBe(3);
            expect(Math.floor(schObj.element.querySelector('.e-content-wrap').scrollTop)).toBe(1);
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

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
