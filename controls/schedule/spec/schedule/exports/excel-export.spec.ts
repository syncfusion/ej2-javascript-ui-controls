/**
 * Excel export spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda, ScheduleModel, ExcelExport, ExportOptions
} from '../../../src/schedule/index';
import { createSchedule, destroy } from '../util.spec';
import { timezoneData } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ExcelExport);

describe('excel export', () => {
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

    describe('Exports properties check', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let events: Object[] = [
                {
                    Id: 1,
                    Subject: 'Meteor Showers in 2018',
                    StartTime: new Date(2018, 1, 14, 13, 0),
                    EndTime: new Date(2018, 1, 14, 14, 30),
                    CategoryColor: '#ea7a57'
                }, {
                    Id: 2,
                    Subject: 'Milky Way as Melting pot',
                    StartTime: new Date(2018, 1, 15, 12, 0),
                    EndTime: new Date(2018, 1, 15, 14, 0),
                    CategoryColor: '#00bdae'
                }, {
                    Id: 3,
                    Subject: 'Mysteries of Bermuda Triangle',
                    StartTime: new Date(2018, 1, 15, 9, 30),
                    EndTime: new Date(2018, 1, 15, 11, 0),
                    CategoryColor: '#f57f17'
                }
            ];
            let dataBound: EmitType<Object> = () => { done(); };
            let options: ScheduleModel = {
                eventSettings: { dataSource: events },
                selectedDate: new Date(2018, 1, 15), dataBound: dataBound
            };

            schObj = createSchedule(options, timezoneData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('export check', (done: Function) => {
            schObj.exportToExcel({});
            setTimeout(() => done(), 50);
        });

        it('export check with filename', (done: Function) => {
            let exportValues: ExportOptions = { fileName: "hello" };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with fields', (done: Function) => {
            let exportValues: ExportOptions = { fields: ["Id", "Subject", "Location"] };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with data', (done: Function) => {
            let exportValues: ExportOptions = {
                customData: [{
                    Id: 1,
                    Subject: 'Explosion of Betelgeuse Star',
                    Location: 'Delhi',
                    StartTime: new Date(2018, 1, 11, 9, 30),
                    EndTime: new Date(2018, 1, 11, 11, 0),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
                    CategoryColor: '#1aaa55'
                }, {
                    Id: 2,
                    Subject: 'Thule Air Crash Report',
                    StartTime: new Date(2018, 1, 12, 12, 0),
                    EndTime: new Date(2018, 1, 12, 14, 0),
                    CategoryColor: '#357cd2'
                }]
            };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with format', (done: Function) => {
            let exportValues: ExportOptions = { exportType: 'xlsx' };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with ignore occurrences', (done: Function) => {
            let exportValues: ExportOptions = { includeOccurrences: true };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with data and ignore occurrences', (done: Function) => {
            let exportValues: ExportOptions = {
                customData: [{
                    Id: 1,
                    Subject: 'Explosion of Betelgeuse Star',
                    Location: 'Delhi',
                    StartTime: new Date(2018, 1, 11, 9, 30),
                    EndTime: new Date(2018, 1, 11, 11, 0),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
                    CategoryColor: '#1aaa55'
                }, {
                    Id: 2,
                    Subject: 'Thule Air Crash Report',
                    StartTime: new Date(2018, 1, 12, 12, 0),
                    EndTime: new Date(2018, 1, 12, 14, 0),
                    CategoryColor: '#357cd2'
                }],
                includeOccurrences: true
            };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('Excel schedule Check style', () => {
            (<any>schObj.excelExportModule).theme = {
                header: { bold: false, fontSize: 15 },
                caption: { bold: true, fontSize: 10 },
                record: { fontName: "TimesRoman", fontColor: "#FFFFFF", fontSize: 12 }
            }
            let style: any = (<any>schObj.excelExportModule).theme;
            expect(style.caption.bold).toBeTruthy();
            expect(style.caption.fontSize).toBe(10);
            expect(style.record.fontName).toBe("TimesRoman");
            expect(style.record.fontColor).toBe("#FFFFFF");
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