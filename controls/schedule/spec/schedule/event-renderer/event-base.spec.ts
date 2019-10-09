/**
 * Events base methods testing
 */
import { Schedule, Day, Week, WorkWeek, Month, Agenda, Timezone, ScheduleModel } from '../../../src/schedule/index';
import { EventBase } from '../../../src/schedule/event-renderer/event-base';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import * as util from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Event Base Module', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('split event by day method testing', () => {
        let schObj: Schedule;
        let eventBase: EventBase;
        beforeAll(() => {
            schObj = util.createSchedule({}, []);
            eventBase = new EventBase(schObj);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Event on same day', () => {
            let event: { [key: string]: Object } = { 'StartTime': new Date(2017, 11, 1, 4), 'EndTime': new Date(2017, 11, 1, 8) };
            let spannedEvents: Object[] = eventBase.splitEventByDay(event);
            expect(spannedEvents.length).toEqual(1);
        });
        it('Event on multiple day', () => {
            let event: { [key: string]: Object } = { 'StartTime': new Date(2017, 11, 1, 4), 'EndTime': new Date(2017, 11, 4, 8) };
            let spannedEvents: Object[] = eventBase.splitEventByDay(event);
            expect(spannedEvents.length).toEqual(4);
        });
    });

    describe('checking spanned recurrence appointment', () => {
        let schObj: Schedule;
        let eventData: Object[] = [{
            Id: 1,
            StartTime: new Date(2018, 7, 7, 23),
            EndTime: new Date(2018, 7, 8, 16),
            RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;UNTIL=20180905T070000Z;'
        }];
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '550px', selectedDate: new Date(2018, 7, 7) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('spanned recurrence appointments with offsetTop', (done: Function) => {
            schObj.dataBound = () => {
                let app2: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
                expect(app2.length).toEqual(14);
                expect(app2[0].offsetTop).toEqual(0);
                done();
            };
            let app1: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 05 - 11, 2018');
            expect(app1.length).toEqual(9);
            expect(app1[0].offsetTop).toEqual(1656);
            (schObj.element.querySelector('.e-schedule-toolbar .e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 12 - 18, 2018');
        });
    });

    describe('Schedule Timezone testing', () => {
        let schObj: Schedule;
        let timezone: Timezone = new Timezone();
        let eventData: Object[] = [{
            Id: 1,
            Subject: 'Testing',
            StartTime: timezone.removeLocalOffset(new Date(2018, 5, 14, 15, 0)),
            EndTime: timezone.removeLocalOffset(new Date(2018, 5, 14, 17, 0))
        }];
        let initialStartDate: Date = new Date((eventData[0] as { [key: string]: Object }).StartTime + '');
        beforeAll((done: Function) => {
            let model: ScheduleModel = { selectedDate: new Date(2018, 5, 14) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Set timezone to Schedule', () => {
            schObj.timezone = 'America/New_York';
            schObj.dataBind();
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 11, 0).getTime());
        });
        it('Convert timezone', () => {
            schObj.timezone = 'Asia/Kolkata';
            schObj.dataBind();
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 20, 30).getTime());
        });
        it('Remove timezone to Schedule', () => {
            schObj.timezone = null;
            schObj.dataBind();
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect((event.StartTime as Date).getTime()).toEqual(initialStartDate.getTime());
        });
    });

    describe('checking recurrence appointment', () => {
        let schObj: Schedule;
        let eventData: Object[] = [{
            Id: 1,
            StartTime: new Date(2018, 9, 11, 0),
            EndTime: new Date(2018, 9, 12, 0),
            RecurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;'
        }];
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
        it('spanned recurrence appointments with offsetTop', (done: Function) => {
            schObj.dataBound = () => {
                let app2: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
                expect(app2.length).toEqual(126);
                done();
            };
            let app1: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
            expect(app1.length).toEqual(115);
            (schObj.element.querySelector('.e-schedule-toolbar .e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('February - May 2019');
        });
    });

    describe('Resources with allow multiplegroup as true', () => {
        let schObj: Schedule;
        let getResourceIndex: Function = (element: HTMLElement) => parseInt(element.getAttribute('data-group-index'), 10);
        let eventData: Object[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2018, 3, 1, 10, 0),
            EndTime: new Date(2018, 3, 1, 12, 30),
            IsAllDay: false,
            RoomId: [1, 2],
            OwnerId: [1, 2, 3]
        }];
        beforeAll((done: Function) => {
            let options: ScheduleModel = { height: '550px', width: '100%', selectedDate: new Date(2018, 3, 1) };
            schObj = util.createGroupSchedule(2, options, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Allow multiple true', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(3);
            let resourceIndex: number = getResourceIndex(eventElementList[0]);
            expect(resourceIndex).toEqual(0);
            resourceIndex = getResourceIndex(eventElementList[1]);
            expect(resourceIndex).toEqual(1);
            resourceIndex = getResourceIndex(eventElementList[2]);
            expect(resourceIndex).toEqual(2);
        });

        it('Allow multiple false for 1st resource', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
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

        it('Resource data source with 2 digits with allow multiple true', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                let resourceIndex: number = getResourceIndex(eventElementList[0]);
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

        it('Resource data source with 2 digits with allow multiple false', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                let resourceIndex: number = getResourceIndex(eventElementList[0]);
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
                OwnerId: [1, 2, 12],
            }];
            schObj.dataBind();
        });
        it('Resource data source with 2 digits with single resource', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                let resourceIndex: number = getResourceIndex(eventElementList[0]);
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
                RoomId: 12,
            }];
            schObj.dataBind();
        });
        it('Resource data source with 2 digits with single resource and allow multiple true', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(1);
                let resourceIndex: number = getResourceIndex(eventElementList[0]);
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
                RoomId: [12],
            }];
            schObj.dataBind();
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
