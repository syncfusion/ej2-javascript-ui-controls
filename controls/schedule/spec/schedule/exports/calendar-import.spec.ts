/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule calendar import spec
 */
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda, ScheduleModel, ICalendarImport
} from '../../../src/schedule/index';
import { createSchedule, destroy } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ICalendarImport);

const iCalString: string = `BEGIN:VCALENDAR
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
CalendarId:3
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
CalendarId:1
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
CalendarId:3
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
CalendarId:1
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
CalendarId:2
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
CalendarId:1
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
CalendarId:2
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
CalendarId:1
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
CalendarId:2
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
CalendarId:3
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
CalendarId:3
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
CalendarId:2
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
CalendarId:1
DTSTART:20190207T043000Z
DTEND:20190207T050000Z
DTSTAMP:20190207T043849Z
UID:4hjime1te90lmgnivscv9bag20@google.com
CREATED:20190207T043841Z
DESCRIPTION:sfdfdfd
ISREADONLY:true
LAST-MODIFIED:20190207T043841Z
LOCATION:cdcd
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:noramla
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

const icalStr: string = `BEGIN:VCALENDAR
PRODID:-//Syncfusion Inc//Scheduler//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Calendar
X-WR-TIMEZONE:Asia/Calcutta
BEGIN:VEVENT
LOCATION:
SUMMARY:My_event
UID:dbddfb8a-db2a-9da5-c861-d2ba047894a7
RRULE:FREQ=WEEKLY;BYDAY=WE;INTERVAL=1;COUNT=5;
DTSTART;VALUE=DATE:20170201
DTEND;VALUE=DATE:20170202
DESCRIPTION:
ISREADONLY:false
END:VEVENT
BEGIN:VEVENT
LOCATION:
SUMMARY:testing
UID:db367cbd-3419-b48e-8906-1dbd63bb9ad9
DTSTART;VALUE=DATE:20170202
DTEND;VALUE=DATE:20170203
DESCRIPTION:
ISREADONLY:false
END:VEVENT
BEGIN:VEVENT
LOCATION:
SUMMARY:My_event_exception
UID:dbddfb8a-db2a-9da5-c861-d2ba047894a7
RECURRENCE-ID;TZID="Asia/Calcutta":20170208
RRULE:FREQ=WEEKLY;BYDAY=WE;INTERVAL=1;COUNT=5;
DTSTART;VALUE=DATE:20170208
DTEND;VALUE=DATE:20170209
DESCRIPTION:
ISREADONLY:false
END:VEVENT
END:VCALENDAR`;

const calString: string = `BEGIN:VCALENDAR
PRODID:-//Syncfusion Inc//Scheduler//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Calendar
X-WR-TIMEZONE:Asia/Calcutta
BEGIN:VEVENT
LOCATION:
SUMMARY:1
UID:1
RRULE:FREQ=DAILY;INTERVAL=1;COUNT=5;
EXDATE:20221017T093000
EXDATE:20221019T093000
DTSTART;TZID="Asia/Calcutta":20221017T093000
DTEND;TZID="Asia/Calcutta":20221017T100000
DESCRIPTION:
ISREADONLY:false
END:VEVENT
BEGIN:VEVENT
LOCATION:
SUMMARY:1
UID:1
RECURRENCE-ID;TZID="Asia/Calcutta":20221019T103000
RRULE:FREQ=DAILY;INTERVAL=1;COUNT=5;
DTSTART;TZID="Asia/Calcutta":20221019T103000
DTEND;TZID="Asia/Calcutta":20221019T110000
DESCRIPTION:
ISREADONLY:false
END:VEVENT
END:VCALENDAR`;

const iCalendarImportStr: string = `BEGIN:VCALENDAR
PRODID:-//zoom.us//iCalendar Event//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
CLASS:PUBLIC
BEGIN:VTIMEZONE
TZID:America/New_York
LAST-MODIFIED:20230407T050750Z
TZURL:https://www.tzurl.org/zoneinfo-outlook/America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZNAME:EDT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:EST
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:20230801T163218Z
DTSTART;TZID=America/New_York:20230801T130000
DTEND;TZID=America/New_York:20230801T140000
SUMMARY:Andrew Knackstedt's Zoom Meeting
UID:20230801T163218Z-000000@fe80:0:0:0:874:7bff:fe39:a3cdens5
TZID:America/New_York
DESCRIPTION:Hi there, \\n\\nAndrew Knackstedt is inviting you to a schedul
 ed Zoom meeting. \\n\\nJoin from PC\\, Mac\\, Linux\\, iOS or Android: https:
 //dynatrace.zoom.us/j/000000?pwd=000000M0pPUjB3dz09\n
     Password: 000000\\n\\nOr iPhone one-tap :\\n    US: +13017158592\\,\\,987
 34717848#  or +13052241968\\,\\,000000# \\nOr Telephone：\\n    Dial(for
  higher quality\\, dial a number based on your current location)：\\n      
   US: +1 301 715 8592  or +1 305 224 1968  or +1 309 205 3325  or +1 312
  626 6799  or +1 646 558 8656  or +1 646 931 3860  or +1 360 209 5623  o
 r +1 386 347 5053  or +1 507 473 4847  or +1 564 217 2000  or +1 669 444
  9171  or +1 669 900 6833  or +1 689 278 1000  or +1 719 359 4580  or +1
  253 205 0468  or +1 253 215 8782  or +1 346 248 7799  or 833 548 0276 (
 Toll Free) or 833 548 0282 (Toll Free) or 877 853 5247 (Toll Free) or 88
 8 788 0099 (Toll Free)\\n        Austria: +43 12 535 502  or +43 670 309 
 0165  or +43 72 011 5988  or +43 120 609 3072  or +43 12 535 501  or 0 8
 00 102 309 (Toll Free) or 0 800 104 430 (Toll Free) or 0 800 909 577 (To
 ll Free)\\n        Poland: +48 22 306 5342  or +48 22 307 3488  or +48 22
  398 7356  or 00 800 012 087 (Toll Free) or 00 800 112 5171 (Toll Free) 
 or 00 800 321 1464 (Toll Free)\\n        United Kingdom: +44 203 901 7895
   or +44 208 080 6591  or +44 208 080 6592  or +44 330 088 5830  or +44 
 131 460 1196  or +44 203 481 5237  or +44 203 481 5240  or 0 800 031 571
 7 (Toll Free) or 0 800 260 5801 (Toll Free) or 0 800 358 2817 (Toll Free
 ) or 0 800 456 1369 (Toll Free)\\n    Meeting ID: 987 3471 7848\\n    Inte
 rnational numbers available: https://dynatrace.zoom.us/u/aEgNo7tcH\\n\\nOr
  an Polycomm/Cisco/Tanberg (H.323/SIP) room system:\\n    H.323: \\n      
   162.255.37.11 (US West)\\n        162.255.36.11 (US East)\n        221.
 122.88.195 (China)\\n        115.114.131.7 (India Mumbai)\\n        115.11
 4.115.7 (India Hyderabad)\\n        213.19.144.110 (Amsterdam Netherlands
 )\\n        213.244.140.110 (Germany)\\n        103.122.166.55 (Australia 
 Sydney)\\n        103.122.167.55 (Australia Melbourne)\\n        209.9.211
 .110 (Hong Kong SAR)\\n        64.211.144.160 (Brazil)\\n        69.174.57
 .160 (Canada Toronto)\\n        65.39.152.160 (Canada Vancouver)\\n       
  207.226.132.110 (Japan Tokyo)\\n        149.137.24.110 (Japan Osaka)\\n  
   Meeting ID: 987 3471 7848\\n    Password: 000000\\n\\n    SIP: 9873471784
 8@zoomcrc.com\\n    Password: 000000\\n\\n
LOCATION:https://dynatrace.zoom.us/j/000000?pwd=000000
 M0pPUjB3dz09
BEGIN:VALARM
TRIGGER:-PT10M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR
`;

describe('ICS calendar import', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Import checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
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
            const options: ScheduleModel = { selectedDate: new Date(2017, 9, 19) };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with EJ2 scheduler exported file', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(16);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const fileObj: File = new File([iCalString], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
        });
    });

    describe('Import checking in description with multi lines', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [ {
                Id: 1,
                Subject: 'event 1',
                StartTime: new Date(2023, 7, 1, 11, 0),
                EndTime: new Date(2023, 7, 1, 12, 30)
            }, {
                Id: 2,
                Subject: 'event 2',
                StartTime: new Date(2023, 7, 1, 11, 0),
                EndTime: new Date(2023, 7, 1, 12, 30)
            }];
            const options: ScheduleModel = { selectedDate: new Date(2023, 7, 1) };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with description parsing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                expect(schObj.eventsData[2].Description).toEqual('Hi there, \n\nAndrew Knackstedt is inviting you to a scheduled Zoom meeting. \n\nJoin from PC, Mac, Linux, iOS or Android: https://dynatrace.zoom.us/j/000000?pwd=000000M0pPUjB3dz09    Password: 000000\n\nOr iPhone one-tap :\n    US: +13017158592,,98734717848#  or +13052241968,,000000# \nOr Telephone：\n    Dial(for higher quality, dial a number based on your current location)：\n        US: +1 301 715 8592  or +1 305 224 1968  or +1 309 205 3325  or +1 312 626 6799  or +1 646 558 8656  or +1 646 931 3860  or +1 360 209 5623  or +1 386 347 5053  or +1 507 473 4847  or +1 564 217 2000  or +1 669 444 9171  or +1 669 900 6833  or +1 689 278 1000  or +1 719 359 4580  or +1 253 205 0468  or +1 253 215 8782  or +1 346 248 7799  or 833 548 0276 (Toll Free) or 833 548 0282 (Toll Free) or 877 853 5247 (Toll Free) or 888 788 0099 (Toll Free)\n        Austria: +43 12 535 502  or +43 670 309 0165  or +43 72 011 5988  or +43 120 609 3072  or +43 12 535 501  or 0 800 102 309 (Toll Free) or 0 800 104 430 (Toll Free) or 0 800 909 577 (Toll Free)\n        Poland: +48 22 306 5342  or +48 22 307 3488  or +48 22 398 7356  or 00 800 012 087 (Toll Free) or 00 800 112 5171 (Toll Free) or 00 800 321 1464 (Toll Free)\n        United Kingdom: +44 203 901 7895  or +44 208 080 6591  or +44 208 080 6592  or +44 330 088 5830  or +44 131 460 1196  or +44 203 481 5237  or +44 203 481 5240  or 0 800 031 5717 (Toll Free) or 0 800 260 5801 (Toll Free) or 0 800 358 2817 (Toll Free) or 0 800 456 1369 (Toll Free)\n    Meeting ID: 987 3471 7848\n    International numbers available: https://dynatrace.zoom.us/u/aEgNo7tcH\n\nOr an Polycomm/Cisco/Tanberg (H.323/SIP) room system:\n    H.323: \n        162.255.37.11 (US West)\n        162.255.36.11 (US East)       221.122.88.195 (China)\n        115.114.131.7 (India Mumbai)\n        115.114.115.7 (India Hyderabad)\n        213.19.144.110 (Amsterdam Netherlands)\n        213.244.140.110 (Germany)\n        103.122.166.55 (Australia Sydney)\n        103.122.167.55 (Australia Melbourne)\n        209.9.211.110 (Hong Kong SAR)\n        64.211.144.160 (Brazil)\n        69.174.57.160 (Canada Toronto)\n        65.39.152.160 (Canada Vancouver)\n        207.226.132.110 (Japan Tokyo)\n        149.137.24.110 (Japan Osaka)\n    Meeting ID: 987 3471 7848\n    Password: 000000\n\n    SIP: 98734717848@zoomcrc.com\n    Password: 000000\n\n\r\nReminder');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const fileObj: File = new File([iCalendarImportStr], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
        });
    });

    describe('Import checking with resource', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
                Id: 10,
                Subject: 'recurrence event',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
                CalendarId: 1
            }, {
                Id: 11,
                StartTime: new Date(2017, 9, 19, 11, 0),
                EndTime: new Date(2017, 9, 19, 12, 30),
                CalendarId: 2
            }, {
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 20, 11, 0),
                EndTime: new Date(2017, 9, 20, 12, 30),
                CalendarId: 3
            }];
            const options: ScheduleModel = {
                width: '100%',
                height: 500,
                selectedDate: new Date(2019, 1, 15),
                group: { resources: ['Calendars'] },
                resources: [{
                    field: 'CalendarId', title: 'Calendars', name: 'Calendars', allowMultiple: true,
                    textField: 'CalendarText', idField: 'CalendarId', colorField: 'CalendarColor',
                    dataSource: [
                        { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
                        { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
                        { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
                        { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
                    ]
                }]
            };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with EJ2 scheduler exported file', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(16);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const fileObj: File = new File([iCalString], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
        });
    });

    describe('Import checking with readonly events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
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
            const options: ScheduleModel = { selectedDate: new Date(2017, 1, 7) };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with EJ2 scheduler exported file', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(16);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const fileObj: File = new File([iCalString], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
        });

        it('Import checking with readonly event', () => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(16);
                const events: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(events[1].classList).toContain('e-read-only');
                expect(events[1].getAttribute('aria-disabled')).toEqual('true');
            };
        });
    });

    describe('EJ2-51402 - Issue with importing recurrence events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
                Id: 10,
                Subject: 'recurrence event',
                StartTime: new Date(2017, 9, 19, 10, 0),
                EndTime: new Date(2017, 9, 19, 11, 0),
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
            }, {
                Id: 11,
                Subject: 'testing1',
                StartTime: new Date(2017, 1, 2),
                EndTime: new Date(2017, 1, 2),
                IsAllDay: true
            }, {
                Id: 12,
                Subject: 'event 2',
                StartTime: new Date(2017, 9, 20, 11, 0),
                EndTime: new Date(2017, 9, 20, 12, 30)
            }];
            const options: ScheduleModel = { selectedDate: new Date(2017, 1, 7), currentView: 'Month' };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Import checking with EJ2 scheduler exported file', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const fileObj: File = new File([icalStr], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
        });

        it('Import checking with readonly event', () => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-appointment')[1].querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('event');
            };
            (schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-edit')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('testing');
            subjectElement.value = 'event';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('EJ2-64169 - Update recurrence entire series after importing an recurrence event with recurrence exception', () => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment')[3].querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('My_event');
                expect(schObj.element.querySelectorAll('.e-recurrence-icon').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-recurrence-edit-icon').length).toEqual(0);
            };
            expect(typeof (schObj.eventsData[3].Id)).toEqual(typeof (schObj.eventsData[3].RecurrenceID));
            expect(schObj.element.querySelector('.e-appointment').querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('My_event');
            expect(schObj.element.querySelectorAll('.e-appointment')[3].querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('My_event_exception');
            expect(schObj.element.querySelectorAll('.e-recurrence-icon').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-recurrence-edit-icon').length).toEqual(1);
            (schObj.element.querySelectorAll('.e-appointment')[3] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-edit')).click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            (alertDialog.querySelector('.e-quick-dialog-series-event') as HTMLElement).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            (alertDialog.querySelector('.e-quick-alertok') as HTMLElement).click();
        });

        it('EJ2-64169 - Checking for Uid value in events data for imported appointments', () => {
            expect(schObj.eventsData.length).toEqual(5);
            expect(schObj.eventsData.filter((data: Record<string, any>) => !isNullOrUndefined(data.UID)).length).toBe(0);
        });
    });

    describe('EJ2-64169 - Import recurrence events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
                Id: 'b9c8baa1-90c6-4ccd-babb-3444d219601d',
                Subject: 'Meeting',
                StartTime: new Date(2022, 9, 17, 10, 0, 0),
                EndTime: new Date(2022, 9, 17, 11, 30, 0)
            }];
            const options: ScheduleModel = { selectedDate: new Date(2022, 9, 17), currentView: 'Week' };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('with string type events present in scheduler', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                expect(typeof(schObj.eventsData[2].Id)).toEqual('string');
                expect(typeof(schObj.eventsData[1].RecurrenceID)).toEqual('string');
                expect(schObj.eventsData[1].RecurrenceID).toEqual(schObj.eventsData[2].Id);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            expect(typeof(schObj.eventsData[0].Id)).toEqual('string');
            const fileObj: File = new File([calString], 'EJSchedule.ics', { lastModified: 0, type: 'text/calendar' });
            schObj.importICalendar(fileObj);
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
