/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Excel export spec
 */
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    MonthAgenda, ScheduleModel, ExcelExport, ExportOptions, ExportFieldInfo,
    ExcelExportEventArgs
} from '../../../src/schedule/index';
import { createSchedule, destroy } from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ExcelExport);

describe('excel export', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Exports properties check', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [{
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
            }];
            const options: ScheduleModel = { selectedDate: new Date(2018, 1, 15) };
            schObj = createSchedule(options, events, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('export check', (done: DoneFn) => {
            schObj.exportToExcel({});
            setTimeout(() => done(), 50);
        });

        it('export check with filename', (done: DoneFn) => {
            const exportValues: ExportOptions = { fileName: 'hello' };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with fields', (done: DoneFn) => {
            const exportValues: ExportOptions = { fields: ['Id', 'Subject', 'Location'] };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with data', (done: DoneFn) => {
            const exportValues: ExportOptions = {
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

        it('export check with format', (done: DoneFn) => {
            const exportValues: ExportOptions = { exportType: 'xlsx' };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with ignore occurrences', (done: DoneFn) => {
            const exportValues: ExportOptions = { includeOccurrences: true };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with data and ignore occurrences', (done: DoneFn) => {
            const exportValues: ExportOptions = {
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
                record: { fontName: 'TimesRoman', fontColor: '#FFFFFF', fontSize: 12 }
            };
            const style: any = (<any>schObj.excelExportModule).theme;
            expect(style.caption.bold).toBeTruthy();
            expect(style.caption.fontSize).toBe(10);
            expect(style.record.fontName).toBe('TimesRoman');
            expect(style.record.fontColor).toBe('#FFFFFF');
        });

        it('Excel schedule Check Custom Column', (done: DoneFn) => {
            const customFields: ExportFieldInfo[] = [
                { name: 'Subject', text: 'Summary' },
                { name: 'StartTime', text: 'First Date' },
                { name: 'EndTime', text: 'Last Date' },
                { name: 'Location', text: 'Place' },
                { name: 'OwnerId', text: 'Owners' }
            ];
            const exportValues: ExportOptions = { fieldsInfo: customFields };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });

        it('export check with csv separator', (done: DoneFn) => {
            const exportValues: ExportOptions = { exportType: 'csv', separator: ';' };
            schObj.exportToExcel(exportValues);
            setTimeout(() => done(), 50);
        });
    });

    describe('Before Excel Exports customizationn check', () => {
        let schObj: Schedule;
        let capturedArgs: any;
    
        beforeAll((done: DoneFn) => {
            const events: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Meteor Showers in 2018',
                    StartTime: new Date(2018, 1, 14, 13, 0),
                    EndTime: new Date(2018, 1, 14, 14, 30),
                    CategoryColor: '#ea7a57',
                },
                {
                    Id: 2,
                    Subject: 'Milky Way as Melting pot',
                    StartTime: new Date(2018, 1, 15, 12, 0),
                    EndTime: new Date(2018, 1, 15, 14, 0),
                    CategoryColor: '#00bdae',
                },
                {
                    Id: 3,
                    Subject: 'Mysteries of Bermuda Triangle',
                    StartTime: new Date(2018, 1, 15, 9, 30),
                    EndTime: new Date(2018, 1, 15, 11, 0),
                    CategoryColor: '#f57f17',
                },
            ];
    
            const options: ScheduleModel = {
                selectedDate: new Date(2018, 1, 15),
                excelExport: (args: ExcelExportEventArgs) => {
                    const worksheet = args.worksheets[0];
                    worksheet.rows.unshift({
                        index: 1,
                        cells: [
                            {
                                index: 1,
                                value: 'Sales Report',
                                style: {
                                    bold: true,
                                    fontSize: 18,
                                    hAlign: 'Center',
                                    fill: { color: '#1E90FF' },
                                    color: '#FFFFFF',
                                },
                                colSpan: worksheet.columns.length,
                            },
                        ],
                    });
    
                    worksheet.rows.unshift({
                        index: 2,
                        cells: [
                            {
                                index: 1,
                                value: 'Generated on: ' + new Date().toLocaleDateString(),
                                style: {
                                    italic: true,
                                    fontSize: 12,
                                    hAlign: 'Left',
                                    fill: { color: '#D3D3D3' },
                                },
                                colSpan: worksheet.columns.length,
                            },
                        ],
                    });
                    worksheet.rows.forEach((row: any, idx: number) => {
                        row.index = idx + 1;
                    });
                    capturedArgs = args;
                },
            };
    
            schObj = createSchedule(options, events, done);
        });
    
        afterAll(() => {
            destroy(schObj);
        });
    
        it('should verify Excel customizations in beforeExcelExport', (done: DoneFn) => {
            const exportFields: ExportFieldInfo[] = [
                { name: 'Id', text: 'Id' },
                { name: 'Subject', text: 'Summary' },
                { name: 'StartTime', text: 'Start Date' },
                { name: 'EndTime', text: 'End Date' },
                { name: 'Location', text: 'Place' }
            ];
            const exportValues: ExportOptions = { fieldsInfo: exportFields };
            schObj.exportToExcel(exportValues);
            expect(capturedArgs).toBeDefined();
            const worksheet = capturedArgs.worksheets[0];
            expect(worksheet.rows[1].cells[0].value).toBe('Sales Report');
            expect(worksheet.rows[1].cells[0].style.fontSize).toBe(18);
            expect(worksheet.rows[1].cells[0].style.hAlign).toBe('Center');
            expect(worksheet.rows[1].cells[0].style.fill.color).toBe('#1E90FF');
            expect(worksheet.rows[1].cells[0].style.color).toBe('#FFFFFF');
            expect(worksheet.rows[0].cells[0].value).toContain('Generated on:');
            expect(worksheet.rows[0].cells[0].style.fontSize).toBe(12);
            expect(worksheet.rows[0].cells[0].style.hAlign).toBe('Left');
            expect(worksheet.rows[0].cells[0].style.fill.color).toBe('#D3D3D3');
            done();
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
