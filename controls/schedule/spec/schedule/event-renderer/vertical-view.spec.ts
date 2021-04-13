/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Vertical view appointment rendering spec
 */
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, EventRenderedArgs, EJ2Instance, ScheduleModel } from '../../../src/schedule/index';
import * as events from '../../../src/schedule/base/constant';
import { defaultData, resourceData, resourceGroupData, testBlockData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Vertical View Event Render Module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Vertical view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = dayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(720);
        });

        it('Refreshing rendered events', () => {
            schObj.notify(events.dataReady, {});
            const elements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(elements.length).toBeGreaterThan(0);
        });

        it('Checking next week appointment element', (done: DoneFn) => {
            schObj.dataBound = () => {
                const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(dayWrapper[0].childElementCount).toBeGreaterThanOrEqual(0);
                done();
            };
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('View based events rendering checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                const elements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(elements.length).toBeGreaterThan(0);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });
    });

    describe('Events with string date', () => {
        let schObj: Schedule;
        const eventsDatas: Record<string, any>[] = [
            // eslint-disable-next-line no-useless-escape
            { StartTime: '\/Date(1518321600000)\/', EndTime: '\/Date(1518327000000)\/' },
            { StartTime: '2018-02-11T11:00:00', EndTime: '2018-02-11T13:00:00' },
            { StartTime: '2018-02-12 11:00:00', EndTime: '2018-02-12 13:00:00' }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2018, 1, 11) };
            schObj = util.createSchedule(model, eventsDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });
    });

    describe('Keyboard interactions with appointments', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeEach((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2), currentView: 'Month' };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('shiftUp arrow key', (done: DoneFn) => {
            const eventCount: number = schObj.eventsData.length;
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(eventCount + 1);
                done();
            };
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            const targetEvent: HTMLElement = appointment.slice(-1)[0];
            targetEvent.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetEvent;
            keyModule.keyActionHandler({
                action: 'shiftUpArrow', shiftKey: true,
                target: targetEvent, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            keyModule.keyActionHandler({
                action: 'enter', target: document.activeElement,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList).toContain('e-popup-open');
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') as HTMLInputElement).value = 'shiftUpArrow Testing';
            keyModule.keyActionHandler({
                action: 'enter', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });

        it('shiftDown arrow key', (done: DoneFn) => {
            const eventCount: number = schObj.eventsData.length;
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(eventCount + 1);
                done();
            };
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            const targetEvent: HTMLElement = appointment.slice(-1)[0];
            targetEvent.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetEvent;
            keyModule.keyActionHandler({
                action: 'shiftDownArrow', shiftKey: true,
                target: targetEvent, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            keyModule.keyActionHandler({
                action: 'enter', target: document.activeElement,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList).toContain('e-popup-open');
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') as HTMLInputElement).value = 'shiftDownArrow Testing';
            keyModule.keyActionHandler({
                action: 'enter', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });
    });

    describe('time scale property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'WorkWeek', height: '550px', width: '500px',
                timeScale: { enable: false }, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('TIme scale disable mode events rendering', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(14);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(5);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(0);
        });
    });

    describe('EventRendered appointment disable mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'WorkWeek', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6),
                eventRendered: (args: EventRenderedArgs) => args.cancel = true
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Elements in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
        });
    });

    describe('Vertical view appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Schedule vertical view appointment template checking', () => {
        let schObj: Schedule;
        const eventTemplate: string = '<div>Subject: ${Subject}</div><div>StartTime: ${StartTime.toLocaleString()}</div>' +
            '<div>EndTime: ${EndTime.toLocaleString()</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: eventTemplate }
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Checking vertical view appointment click actions', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment click action', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            const appointment: Element[] = [].slice.call(dayWrapper[0].querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0] as HTMLElement, 'click');
            expect(appointment[0].classList.contains('e-appointment-border')).toEqual(true);
            util.triggerMouseEvent(document.body, 'mousedown');
            const appointment1: Element[] = [].slice.call(dayWrapper[0].querySelectorAll('.e-appointment'));
            expect(appointment1[0].classList.contains('e-appointment-border')).toEqual(false);
        });
    });

    describe('Checking vertical view appointment with start and end hour', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', startHour: '09:00', endHour: '18:00', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = dayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(72);
        });
    });

    describe('Vertical view all-day row appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[2].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[2].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Vertical view all-day row appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[2].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Checking vertical view all-day row appointment click actions', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment click action', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            const appointment: Element[] = [].slice.call(allDayWrapper[2].querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0] as HTMLElement, 'click');
            expect(appointment[0].classList.contains('e-appointment-border')).toEqual(true);
            util.triggerMouseEvent(document.body, 'mousedown');
            const appointment1: Element[] = [].slice.call(allDayWrapper[2].querySelectorAll('.e-appointment'));
            expect(appointment1[0].classList.contains('e-appointment-border')).toEqual(false);
        });
    });

    describe('Checking vertical view all-day row appointment with work days', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'WorkWeek',
                workDays: [1, 3, 4, 5], selectedDate: new Date(2017, 10, 7)
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[1].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[1].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Checking vertical view all-day row appointment with showWeekend', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', showWeekend: false, selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Vertical view all-day row appointment expand/collapse rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
        });
    });

    describe('Vertical view all-day row appointment expand/collapse rendering in RTL mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
        });
    });

    describe('Vertical view all-day row appointment expand/collapse icon click', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment row expand', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-expand')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(true);
        });
        it('Checking appointment collapse', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-collapse')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(false);
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
        });
    });

    describe('Vertical view resource grouping appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBeGreaterThan(0);
        });

        it('Public method isSlotAvailable checking with resource', () => {
            const startDate: Date = new Date(2018, 3, 1, 10, 30);
            const endDate: Date = new Date(2018, 3, 1, 12, 0);
            const resourceIndex: number = 1;
            expect(schObj.isSlotAvailable(startDate, endDate, resourceIndex)).toEqual(false);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[427] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(9);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const recObj: RecurrenceEditor = (dialogElement.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(9);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });

    describe('Vertical view resource grouping appointment rendering byDate', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appElement.length).toBeGreaterThan(0);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[427] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(9);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const recObj: RecurrenceEditor = (dialogElement.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(9);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });

        it('CRUD multiple event delete actions checking', (done: DoneFn) => {
            const data: Record<string, any>[] = [resourceData[0], resourceData[3]];
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            expect(schObj.eventsData.length).toEqual(9);
            schObj.deleteEvent(data);
        });
    });

    xdescribe('Vertical view resource grouping appointment rendering allowGroupEdit', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appElement.length).toBeGreaterThan(0);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(19);
                expect(schObj.eventsData[18].Subject).toEqual('Add title');
                expect(schObj.eventsData[18].Location).toEqual(undefined);
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(3);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[430] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(18);
            const dialogElement: Element = schObj.eventWindow.dialogObject.element;
            const endTimeObj: DateTimePicker = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTimeObj.value = new Date(2018, 3, 4, 11, 30);
            endTimeObj.dataBind();
            const resourceElements: NodeListOf<Element> = dialogElement.querySelectorAll('.e-multiselect.e-control');
            const roomObj: MultiSelect = (resourceElements[0] as EJ2Instance).ej2_instances[0] as MultiSelect;
            roomObj.value = [1, 2];
            roomObj.dataBind();
            const ownerObj: MultiSelect = (resourceElements[1] as EJ2Instance).ej2_instances[0] as MultiSelect;
            ownerObj.value = [1, 2, 3];
            ownerObj.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(19);
                expect(schObj.eventsData[18].Subject).toEqual('Testing');
                expect(schObj.eventsData[18].Location).toEqual('Paris');
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(3);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_19"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(19);
            const dialogElement: Element = schObj.eventWindow.dialogObject.element;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Testing';
            (dialogElement.querySelector('.e-location') as HTMLInputElement).value = 'Paris';
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(18);
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(0);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_19"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(19);
            (schObj.eventWindow.dialogObject.element.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLInputElement).click();
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });

    describe('schedule`s (start/end)Hour and appointment`s (end/start)Time is same', () => {
        let schObj: Schedule;
        const eventsDatas: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event-1',
            StartTime: new Date(2017, 10, 2, 8),
            EndTime: new Date(2017, 10, 2, 9)
        }, {
            Id: 2,
            Subject: 'Test event-2',
            StartTime: new Date(2017, 10, 1, 8),
            EndTime: new Date(2017, 10, 1, 13)
        }, {
            Id: 3,
            Subject: 'Test event-3',
            StartTime: new Date(2017, 10, 2, 12),
            EndTime: new Date(2017, 10, 2, 13)
        }, {
            Id: 4,
            Subject: 'Test event-4',
            StartTime: new Date(2017, 10, 3, 8),
            EndTime: new Date(2017, 10, 3, 10)
        }, {
            Id: 5,
            Subject: 'Test event-5',
            StartTime: new Date(2017, 10, 3, 11),
            EndTime: new Date(2017, 10, 3, 13)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2), startHour: '08:00', endHour: '13:00' };
            schObj = util.createSchedule(model, eventsDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking appointment presents after change start and endHour', () => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(3);
                const app1: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]') as HTMLElement;
                expect(app1.querySelectorAll('.e-indicator').length).toEqual(2);
                expect(app1.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(true);
                expect(app1.querySelectorAll('.e-indicator')[1].classList.contains('e-down-icon')).toBe(true);
                const app2: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_4"]') as HTMLElement;
                expect(app2.querySelectorAll('.e-indicator').length).toEqual(1);
                expect(app2.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(true);
                expect(app2.querySelectorAll('.e-indicator')[0].classList.contains('e-down-icon')).toBe(false);
                const app3: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_5"]') as HTMLElement;
                expect(app3.querySelectorAll('.e-indicator').length).toEqual(1);
                expect(app3.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(false);
                expect(app3.querySelectorAll('.e-indicator')[0].classList.contains('e-down-icon')).toBe(true);
            };
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(5);
            schObj.startHour = '09:00';
            schObj.endHour = '12:00';
            schObj.dataBind();
        });
    });

    describe('checking appointment with start and endTime 12.00 AM in same date', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event',
            StartTime: new Date(2017, 10, 2, 0),
            EndTime: new Date(2017, 10, 2, 0)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
        });
    });

    describe('EJ2-11284 Events start and end on same time', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event',
            StartTime: new Date(2017, 10, 2, 10),
            EndTime: new Date(2017, 10, 2, 10)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
        });
    });

    describe('EJ2-12691 - Yearly recurrence appointments are not displaying properly', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Yearly Recurrence Event',
            StartTime: new Date(2022, 11, 4, 10),
            EndTime: new Date(2022, 11, 4, 11, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=YEARLY;BYDAY=SU;BYSETPOS=1;BYMONTH=12;INTERVAL=1'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2022, 11, 5) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('current year(2022) appointment element checking in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
        });

        it('next year(2023) appointment element checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2023, 11, 5);
            schObj.dataBind();
        });

        it('other year(2025) appointment element checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2025, 11, 10);
            schObj.dataBind();
        });
    });

    describe('EJ2-47668 - Issue in rendering of scheduler event height based on the DST timezone', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: "Meeting",
            StartTime: new Date(2021, 2, 27, 11, 0),
            EndTime: new Date(2021, 2, 28, 7, 0)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', firstDayOfWeek: 1, selectedDate: new Date(2021, 2, 25) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking dst event height', () => {
            const eventNormalElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventNormalElementList.length).toEqual(2);
            expect((eventNormalElementList[0] as HTMLElement).style.height).toBe('936px');
            expect((eventNormalElementList[1] as HTMLElement).style.height).toBe('504px');
        });
    });

    describe('Schedule week view appointment template checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Week', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: '<span>${Subject}</span>' }
            };
            schObj = util.createSchedule(model, testBlockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventBlockedElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-block-appointment'));
            expect(eventBlockedElementList.length).toEqual(1);
            const eventNormalElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventNormalElementList.length).toEqual(5);
        });
    });

    describe('allowInline property', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'Week', views: [
                    { option: 'Week' },
                    { option: 'TimelineWeek' },
                    { option: 'Month' }
                ], height: '550px', width: '500px',
                allowInline: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking allowInline property', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(24);
                expect((eventElementList[6].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing')
                expect(eventElementList[6].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[126] as HTMLElement
            workCell.click();
            expect(schObj.element.querySelector('.e-inline-appointment').classList.contains('e-inline-appointment')).toBeTruthy();
            let inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';         
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });

        });

        it('Checking allowInline allDay event', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect((eventElementList[0].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('week')
                expect(eventElementList[0].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            (schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement).click()
            expect(schObj.element.querySelector('.e-inline-appointment').classList.contains('e-inline-appointment')).toBeTruthy();
            let inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'week';         
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('Checking allowInline event in timeline week view', (done: Function) => {
            schObj.dataBound = () => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(26);
                expect((eventElementList[2].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('timeline')
                expect(eventElementList[2].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement).click()
            expect(schObj.element.querySelector('.e-inline-appointment').classList.contains('e-inline-appointment')).toBeTruthy();
            let inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'timeline';         
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
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
