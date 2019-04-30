/**
 * Schedule calendar export spec
 */
import { EmitType, extend } from '@syncfusion/ej2-base';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda, ScheduleModel, ICalendarExport
} from '../../../src/schedule/index';
import { createSchedule, createGroupSchedule, destroy } from '../util.spec';
import { timezoneData, readonlyEventsData, blockData } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ICalendarExport);

describe('ICS calendar export', () => {
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

    describe('Export checking', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let events: Object[] = [
                {
                    Id: 10,
                    Subject: 'recurrence event',
                    StartTime: new Date(2017, 9, 19, 10, 0),
                    EndTime: new Date(2017, 9, 19, 11, 0),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
                }, {
                    Id: 11,
                    StartTime: new Date(2017, 9, 19, 11, 0),
                    EndTime: new Date(2017, 9, 19, 12, 30)
                }, {
                    Id: 12,
                    Subject: 'event 2',
                    StartTime: new Date(2017, 9, 20, 11, 0),
                    EndTime: new Date(2017, 9, 20, 12, 30)
                }
            ];
            let dataBound: EmitType<Object> = () => { done(); };
            let options: ScheduleModel = {
                eventSettings: { dataSource: events },
                selectedDate: new Date(2017, 9, 19), dataBound: dataBound
            };

            schObj = createSchedule(options, timezoneData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('test edit occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(4);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('recurrence event');
                expect(dataObj[3].Id).toEqual(20);
                expect(dataObj[3].RecurrenceID).toEqual(10);
                expect(dataObj[3].Subject).toEqual('2nd occurrence edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            schObj.currentAction = 'EditOccurrence';
            let data: { [key: string]: Object } = extend({}, schObj.eventsProcessed[2], null, true) as { [key: string]: Object };
            data.Subject = '2nd occurrence edited';
            data.Id = 20;
            schObj.saveEvent(data, schObj.currentAction);
        });

        it('Export checking for edited occurrence', (done) => {
            schObj.exportToICalendar('icsFile');
            setTimeout(() => done(), 50);
        });

        it('test recurrence appointment delete occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            let occurence: { [key: string]: Object } = extend({}, schObj.eventsProcessed[0], null, true) as { [key: string]: Object };
            schObj.currentAction = 'DeleteOccurrence';
            schObj.deleteEvent(occurence, schObj.currentAction);
        });

        it('test recurrence appointment delete occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            let occurence: { [key: string]: Object } = extend({}, schObj.eventsProcessed[3], null, true) as { [key: string]: Object };
            schObj.currentAction = 'DeleteOccurrence';
            schObj.deleteEvent(occurence, schObj.currentAction);
        });

        it('Event export checking', (done) => {
            schObj.exportToICalendar('icsFile');
            setTimeout(() => done(), 50);
        });
    });

    describe('Custom field', () => {
        let schObj: Schedule;
        let data: Object[] = [{
            Id: 1,
            Subject: 'Events - Within a day',
            StartTime: new Date(2018, 4, 1, 10, 0),
            EndTime: new Date(2018, 4, 1, 12, 30),
            IsAllDay: false,
            FId: 1,
            HallId: 1,
            RoomId: 1,
            OwnerId: 1
        }, {
            Id: 2,
            Subject: 'Spanned Event - Less than 24',
            StartTime: new Date(2018, 3, 30, 18, 0),
            EndTime: new Date(2018, 4, 1, 10, 30),
            IsAllDay: false,
            FId: 2,
            HallId: 2,
            RoomId: 2,
            OwnerId: 2
        }];
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '550px', width: '50%',
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createGroupSchedule(1, options, data, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Export checking', (done) => {
            (schObj.eventsData[0] as { [key: string]: Object }).RoomId = undefined;
            schObj.exportToICalendar();
            setTimeout(() => done(), 50);
        });
    });

    describe('Custom field', () => {
        let schObj: Schedule;
        let data: Object[] = [{
            Id: 1,
            Subject: 'Events - Within a day',
            StartTime: new Date(2018, 4, 1, 10, 0),
            EndTime: new Date(2018, 4, 1, 12, 30),
            IsAllDay: false,
            FId: 1,
            HallId: 1,
            RoomId: 1,
            OwnerId: 1
        }, {
            Id: 2,
            Subject: 'Spanned Event - Less than 24',
            StartTime: new Date(2018, 3, 30, 18, 0),
            EndTime: new Date(2018, 4, 1, 10, 30),
            IsAllDay: false,
            FId: 2,
            HallId: 2,
            RoomId: 2,
            OwnerId: 2
        }];
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '550px', width: '50%',
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createGroupSchedule(1, options, data, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Export checking', (done) => {
            (schObj.eventsData[0] as { [key: string]: Object }).RoomId = undefined;
            schObj.exportToICalendar();
            setTimeout(() => done(), 50);
        });
    });

    describe('ICS Export Checing for Readonly events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '550px', width: '50%',
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createGroupSchedule(1, options, readonlyEventsData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Export checking for Readonly events', (done) => {
            schObj.exportToICalendar('ReadOnlyEvents');
            setTimeout(() => done(), 50);
        });
    });

    describe('ICS Export Checing for Blocked events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '550px', width: '50%',
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createGroupSchedule(1, options, blockData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Export checking for Blocked events', (done) => {
            schObj.exportToICalendar('Blocked');
            setTimeout(() => done(), 50);
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
