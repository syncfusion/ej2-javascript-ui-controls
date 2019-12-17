/**
 * Schedule calendar import spec
 */
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda, ScheduleModel, ICalendarImport
} from '../../../src/schedule/index';
import { createSchedule, destroy } from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ICalendarImport);

// tslint:disable-next-line:no-multiline-string
let iCalString: string = `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:vinithamurugan.m1995@gmail.com
X-WR-TIMEZONE:Asia/Kolkata
BEGIN:VTIMEZONE
TZID:Asia/Kolkata
X-LIC-LOCATION:Asia/Kolkata
BEGIN:STANDARD
TZOFFSETFROM:+0530
TZOFFSETTO:+0530
TZNAME:IST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190304T100000
DTEND;TZID=Asia/Kolkata:20190304T103000
RRULE:FREQ=DAILY;COUNT=6
EXDATE;TZID=Asia/Kolkata:20190305T100000
EXDATE;TZID=Asia/Kolkata:20190308T100000
DTSTAMP:20190207T043849Z
UID:66joh8n3euqcluq73h7lpn29pa@google.com
CREATED:20190206T054852Z
DESCRIPTION:
LAST-MODIFIED:20190206T055056Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:recedt
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190306T100000
DTEND;TZID=Asia/Kolkata:20190306T103000
DTSTAMP:20190207T043849Z
UID:66joh8n3euqcluq73h7lpn29pa@google.com
RECURRENCE-ID;TZID=Asia/Kolkata:20190306T100000
CREATED:20190206T054852Z
DESCRIPTION:
LAST-MODIFIED:20190206T055117Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:recedt -ed1
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190307T100000
DTEND;TZID=Asia/Kolkata:20190307T103000
DTSTAMP:20190207T043849Z
UID:66joh8n3euqcluq73h7lpn29pa@google.com
RECURRENCE-ID;TZID=Asia/Kolkata:20190307T100000
CREATED:20190206T054852Z
DESCRIPTION:
LAST-MODIFIED:20190206T055125Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:recedt-ed2
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
BEGIN:VEVENT
DTSTART;VALUE=DATE:20190204
DTEND;VALUE=DATE:20190205
DTSTAMP:20190207T043849Z
UID:5jc7gtd18ti8kkgbuldeped774@google.com
CREATED:20190207T042612Z
DESCRIPTION:Desceription added
LAST-MODIFIED:20190207T042612Z
LOCATION:Chennai
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Normal Event
TRANSP:TRANSPARENT
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190318T100000
DTEND;TZID=Asia/Kolkata:20190318T103000
RRULE:FREQ=DAILY;COUNT=4
DTSTAMP:20190207T043849Z
UID:1dhdogairrfta017e9k7hu6bua@google.com
CREATED:20190207T043603Z
DESCRIPTION:
LAST-MODIFIED:20190207T043603Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Occurence edit
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190319T100000
DTEND;TZID=Asia/Kolkata:20190319T103000
DTSTAMP:20190207T043849Z
UID:1dhdogairrfta017e9k7hu6bua@google.com
RECURRENCE-ID;TZID=Asia/Kolkata:20190319T100000
CREATED:20190207T043603Z
DESCRIPTION:
LAST-MODIFIED:20190207T043629Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:Occurence edit -1
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190415T100000
DTEND;TZID=Asia/Kolkata:20190415T103000
RRULE:FREQ=DAILY;COUNT=4
EXDATE;TZID=Asia/Kolkata:20190416T100000
DTSTAMP:20190207T043849Z
UID:0q8ucpabip1tc6lo4u1280ds9i@google.com
CREATED:20190207T043652Z
DESCRIPTION:
LAST-MODIFIED:20190207T043652Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:occurce delete
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190422T100000
DTEND;TZID=Asia/Kolkata:20190422T103000
RRULE:FREQ=DAILY;COUNT=5
EXDATE;TZID=Asia/Kolkata:20190424T100000
EXDATE;TZID=Asia/Kolkata:20190425T100000
DTSTAMP:20190207T043849Z
UID:66t3o2kt1b0e831hm1rumfak22@google.com
CREATED:20190207T043717Z
DESCRIPTION:
LAST-MODIFIED:20190207T043717Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:delete
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190325T100000
DTEND;TZID=Asia/Kolkata:20190325T103000
RRULE:FREQ=DAILY;COUNT=5
DTSTAMP:20190207T043849Z
UID:6e28l340rviicoa2dilhjogf4s@google.com
CREATED:20190207T043752Z
DESCRIPTION:
LAST-MODIFIED:20190207T043752Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:edited 2
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190326T100000
DTEND;TZID=Asia/Kolkata:20190326T103000
DTSTAMP:20190207T043849Z
UID:6e28l340rviicoa2dilhjogf4s@google.com
RECURRENCE-ID;TZID=Asia/Kolkata:20190326T100000
CREATED:20190207T043752Z
DESCRIPTION:
LAST-MODIFIED:20190207T043803Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:1
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190327T100000
DTEND;TZID=Asia/Kolkata:20190327T103000
DTSTAMP:20190207T043849Z
UID:6e28l340rviicoa2dilhjogf4s@google.com
RECURRENCE-ID;TZID=Asia/Kolkata:20190327T100000
CREATED:20190207T043752Z
DESCRIPTION:
LAST-MODIFIED:20190207T043810Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:2
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20190218T100000
DTEND;TZID=Asia/Kolkata:20190218T103000
RRULE:FREQ=DAILY;COUNT=4
DTSTAMP:20190207T043849Z
UID:5nnbh6laneb573b1oaq3ade5q4@google.com
CREATED:20190207T043525Z
DESCRIPTION:
LAST-MODIFIED:20190207T043822Z
LOCATION:full rec
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:Rec
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
BEGIN:VEVENT
DTSTART:20190207T043000Z
DTEND:20190207T050000Z
DTSTAMP:20190207T043849Z
UID:4hjime1te90lmgnivscv9bag20@google.com
CREATED:20190207T043841Z
DESCRIPTION:sfdfdfd
LAST-MODIFIED:20190207T043841Z
LOCATION:cdcd
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:noramla
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

describe('ICS calendar import', () => {
    beforeAll(() => {
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Import checking', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let events: Object[] = [{
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
            }];
            let options: ScheduleModel = { selectedDate: new Date(2017, 9, 19) };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with EJ2 scheduler exported file', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(16);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            let fileObj: File = new File([iCalString], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
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
