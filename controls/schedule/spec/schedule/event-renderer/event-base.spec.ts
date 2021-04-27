/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Events base methods testing
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, Timezone, ScheduleModel, CallbackFunction } from '../../../src/schedule/index';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
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
        it('Checking event filled full height of the cell in the Month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                const headerHeight: number = 25;
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - headerHeight);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
        it('Checking event filled full height of the cell in the Timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Checking fill and enable Rtl properties is set to true on timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight);
                done();
            };
            schObj.enableRtl = true;
            schObj.dataBind();
        });
        it('Checking fill and enable Rtl properties is set to true on month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const cellElement: HTMLElement = (schObj.element.querySelector('.e-work-cells') as HTMLElement);
                const eventElement: HTMLElement = (schObj.element.querySelector('.e-appointment') as HTMLElement);
                const headerHeight: number = 25;
                expect(eventElement.offsetHeight).toEqual(cellElement.offsetHeight - headerHeight);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
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
        it('Checking evnet filled full height of the cell in the Timeline month view', (done: DoneFn) => {
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
            inputObj = createElement('input',  { className: 'e-input-element' });
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
        it ('To maintain outside element focus on resize', () => {
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

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
