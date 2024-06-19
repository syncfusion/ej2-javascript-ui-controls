/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Month view appointment rendering spec
 */
import { closest, Browser, Internationalization } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, TimelineMonth, Agenda, MoreEventsClickArgs,
    CallbackFunction, EventRenderedArgs, EJ2Instance
} from '../../../src/schedule/index';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { triggerMouseEvent } from '../util.spec';
import { testData, moreIndicatorData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, TimelineMonth, Agenda);

describe('Month Event Render Module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Schedule Month view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('EJ2-54280 Scroll position goes back to the normal in the TimelineMonth, while dragging/resizing an event', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { views: ['TimelineMonth'], rowAutoHeight: true, width: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('right resizing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(138);
                expect(schObj.element.querySelector('.e-content-wrap').scrollLeft).toEqual(0);
                done();
            };
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 0;
            const resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(68);
            const resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Mobile view', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                views: [{ option: 'Day', readonly: true }, { option: 'Week' }, { option: 'WorkWeek', readonly: true }, { option: 'Month' }],
                currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6),
                moreEventsClick: (args: MoreEventsClickArgs) => args.isPopupOpen = false
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('More event click testing and read only for add icon testing', () => {
            expect((schObj.element.querySelector('.e-icon-add') as HTMLElement).offsetHeight).toEqual(25);
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            expect((schObj.element.querySelector('.e-icon-add') as HTMLElement).offsetHeight).toEqual(0);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
    });

    describe('Schedule Hide week end in Month view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px',
                showWeekend: false, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(2);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(schObj.getWorkCellElements().length).toEqual(25);
        });

        it('elements in DOM - setmodel checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(35);
                done();
            };
            schObj.showWeekend = true;
            schObj.dataBind();
        });
    });

    describe('Schedule month view appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px',
                enableRtl: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('Schedule month view appointment template checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6),
                eventSettings: { template: '<span>${Subject}</span>' }
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
                .toEqual('<span>Spanned - Greater than 24 hour</span><div class="e-indicator e-icons e-right-icon"></div>');
        });
        it('change event template through setmodel', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(9);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(2);
                expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
                    .toEqual('<span class="event-template">Spanned - Greater than 24 hour</span>' +
                        '<div class="e-indicator e-icons e-right-icon"></div>');
                done();
            };
            schObj.eventSettings.template = '<span class="event-template">${Subject}</span>';
            schObj.dataBind();
        });
    });

    describe('EJ2-11284 Events start and end on same time', () => {
        let schObj: Schedule;
        const eventDatas: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 2, 10),
            Location: 'Chennai',
            EndTime: new Date(2017, 10, 2, 10)
        }, {
            Id: 2,
            Subject: 'Recurrence event',
            StartTime: new Date(2017, 10, 3, 10),
            EndTime: new Date(2017, 10, 3, 10),
            Location: 'Madurai',
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { currentView: 'Month', height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(6);
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[0].getAttribute('aria-label'))
                .toEqual('Normal event Begin From Thursday, November 2, 2017 at 10:00:00 AM GMT Ends At Thursday, November 2, 2017 at 10:00:00 AM GMT Location Chennai');
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[1].getAttribute('aria-label'))
                .toEqual('Recurrence event Begin From Friday, November 3, 2017 at 10:00:00 AM GMT Ends At Friday, November 3, 2017 at 10:00:00 AM GMT Location Madurai Recurring Event');
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[2].getAttribute('aria-label'))
                .toEqual('Recurrence event Begin From Saturday, November 4, 2017 at 10:00:00 AM GMT Ends At Saturday, November 4, 2017 at 10:00:00 AM GMT Location Madurai Recurring Event');
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[3].getAttribute('aria-label'))
                .toEqual('Recurrence event Begin From Sunday, November 5, 2017 at 10:00:00 AM GMT Ends At Sunday, November 5, 2017 at 10:00:00 AM GMT Location Madurai Recurring Event');
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[4].getAttribute('aria-label'))
                .toEqual('Recurrence event Begin From Monday, November 6, 2017 at 10:00:00 AM GMT Ends At Monday, November 6, 2017 at 10:00:00 AM GMT Location Madurai Recurring Event');
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment')[5].getAttribute('aria-label'))
                .toEqual('Recurrence event Begin From Tuesday, November 7, 2017 at 10:00:00 AM GMT Ends At Tuesday, November 7, 2017 at 10:00:00 AM GMT Location Madurai Recurring Event');
        });
    });

    describe('Start and end time in event template', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 2, 10),
            EndTime: new Date(2017, 10, 2, 11)
        }];
        beforeAll((done: DoneFn) => {
            const instance: Internationalization = new Internationalization();
            (window as TemplateFunction).getTimeString = (value: Date) => instance.formatDate(value, { skeleton: 'hm' });
            interface TemplateFunction extends Window {
                getTimeString?: CallbackFunction;
            }
            const model: ScheduleModel = {
                currentView: 'Month', height: '550px', selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: '<div class="time">${getTimeString(data.StartTime)}</div>' }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('check event start time in template', () => {
            expect(schObj.element.querySelector('.e-appointment .time').innerHTML).toEqual('10:00 AM');
        });
    });

    describe('Month view layout checking when enable both showWeekNumber and rowAutoHeight properties on same time', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month', height: '550px', width: '500px',
                showWeekNumber: true, rowAutoHeight: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking week number cell and work cell height ', () => {
            expect((schObj.element.querySelector('.e-week-number') as HTMLElement).style.height).toEqual('110px');
            expect((schObj.element.querySelector('.e-content-wrap table tr td:first-child') as HTMLElement).style.height).toEqual('110px');
        });
    });

    describe('EJ2-52001 - Month view cell height checking when height is auto and both showWeekNumber and rowAutoHeight properties enabled on same time', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 8, 10),
            EndTime: new Date(2017, 10, 8, 10)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month', height: 'auto', width: '100%',
                showWeekNumber: true, rowAutoHeight: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, sampleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking work-cells height when height is auto', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.element.querySelector('.e-week-number') as HTMLElement).style.height).toEqual('70px');
                expect((schObj.element.querySelector('.e-content-wrap table tr td:first-child') as HTMLElement).style.height).toEqual('70px');
                expect(schObj.eventsData.length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            expect((schObj.element.querySelector('.e-week-number') as HTMLElement).style.height).toEqual('70px');
            expect((schObj.element.querySelector('.e-content-wrap table tr td:first-child') as HTMLElement).style.height).toEqual('70px');
            expect(schObj.eventsData.length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
            schObj.refreshEvents();
        });
    });

    describe('EJ2-56503 - Month view event rendered arguments checking', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 8, 10),
            EndTime: new Date(2017, 10, 8, 12)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: ['Month'],
                height: 'auto', width: '100%',
                selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, sampleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking event rendered event args', (done: DoneFn) => {
            schObj.eventRendered = (args: EventRenderedArgs) => {
                expect((args.data[schObj.eventFields.startTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 10).getTime());
                expect((args.data[schObj.eventFields.endTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 12).getTime());
                done();
            };
            schObj.refreshEvents();
        });
    });

    describe('EJ2-57751 - Month view more indicator count is wrong', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                views: ['Month'],
                selectedDate: new Date(2021, 1, 15)
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking more indicator count values', () => {
            const moreIndicators: NodeListOf<Element> = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toEqual(6);
            expect(moreIndicators[0].textContent).toEqual('+2 more');
            expect(moreIndicators[0].getAttribute('role')).toEqual('button');
            expect(moreIndicators[0].getAttribute('aria-label')).toEqual('2 More Events');
            expect(moreIndicators[1].textContent).toEqual('+3 more');
            expect(moreIndicators[2].textContent).toEqual('+3 more');
            expect(moreIndicators[3].textContent).toEqual('+3 more');
            expect(moreIndicators[4].textContent).toEqual('+3 more');
            expect(moreIndicators[4].getAttribute('aria-label')).toEqual('3 More Events');
            expect(moreIndicators[5].textContent).toEqual('+2 more');
        });
        it('Adding resources', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.resources = [{
                field: 'GroupId', title: 'Owner', name: 'Owners',
                dataSource: [
                    { GroupText: 'Group A', GroupId: 1, GroupColor: '#1aaa55' },
                    { GroupText: 'Group B', GroupId: 2, GroupColor: '#357cd2' }
                ],
                textField: 'GroupText', idField: 'GroupId', colorField: 'GroupColor'
            }];
            schObj.group = { resources: ['Owners'] };
            schObj.dataBind();
        });
        it('Checking more indicator count in resource case', () => {
            const moreIndicators: NodeListOf<Element> = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toEqual(9);
            expect(moreIndicators[0].textContent).toEqual('+1 more');
            expect(moreIndicators[1].textContent).toEqual('+1 more');
            expect(moreIndicators[2].textContent).toEqual('+1 more');
            expect(moreIndicators[3].textContent).toEqual('+3 more');
            expect(moreIndicators[4].textContent).toEqual('+4 more');
            expect(moreIndicators[5].textContent).toEqual('+4 more');
            expect(moreIndicators[6].textContent).toEqual('+3 more');
            expect(moreIndicators[7].textContent).toEqual('+3 more');
            expect(moreIndicators[8].textContent).toEqual('+2 more');
        });
        it('Adding new appointment', (done: Function) => {
            schObj.dataBound = () => done();
            const data: Record<string, any>[] = [{
                Id: 8,
                Subject: 'id 8',
                StartTime: new Date(2021, 1, 8, 0, 0),
                EndTime: new Date(2021, 1, 20, 0, 0),
                IsAllDay: true,
                GroupId: 2
            }];
            schObj.addEvent(data);
            schObj.dataBind();
        });
        it('Checking more indicator count in after CRUD action', () => {
            const moreIndicators: NodeListOf<Element> = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toEqual(9);
            expect(moreIndicators[0].textContent).toEqual('+2 more');
            expect(moreIndicators[1].textContent).toEqual('+2 more');
            expect(moreIndicators[2].textContent).toEqual('+2 more');
            expect(moreIndicators[3].textContent).toEqual('+4 more');
            expect(moreIndicators[4].textContent).toEqual('+5 more');
            expect(moreIndicators[5].textContent).toEqual('+5 more');
            expect(moreIndicators[6].textContent).toEqual('+4 more');
            expect(moreIndicators[7].textContent).toEqual('+4 more');
            expect(moreIndicators[8].textContent).toEqual('+2 more');
        });
    });

    describe('EJ2-57751 - Month view more indicator count is wrong checking in maximum appointment height mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                views: ['Month'],
                selectedDate: new Date(2021, 1, 15),
                eventSettings: {
                    enableMaxHeight: true,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Enable enableMaxHeight and enableIndicator properties more indicator count', () => {
            const moreIndicators: NodeListOf<Element> = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toEqual(9);
            expect(moreIndicators[0].textContent).toEqual('+1 more');
            expect(moreIndicators[1].textContent).toEqual('+1 more');
            expect(moreIndicators[2].textContent).toEqual('+1 more');
            expect(moreIndicators[3].textContent).toEqual('+3 more');
            expect(moreIndicators[4].textContent).toEqual('+4 more');
            expect(moreIndicators[5].textContent).toEqual('+4 more');
            expect(moreIndicators[6].textContent).toEqual('+3 more');
            expect(moreIndicators[7].textContent).toEqual('+3 more');
            expect(moreIndicators[8].textContent).toEqual('+2 more');
        });
    });

    describe('EJ2-58442 - The occurrences are not creating properly if we cleared the until date and set again', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                views: ['Month'],
                selectedDate: new Date(2022, 2, 6)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Check the recurrence event occurrences count', async (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData[0].RecurrenceRule).toEqual('FREQ=WEEKLY;BYDAY=MO,TU;INTERVAL=1;UNTIL=20220308T000000Z;');
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            const workCell: HTMLTableCellElement = schObj.element.querySelector('[data-date="1646611200000"]');
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            const editor: HTMLElement = document.querySelector('.e-schedule-dialog.e-popup-open');
            util.triggerMouseEvent(editor.querySelector('.e-all-day.e-field') as HTMLElement, 'click');
            const repeatElement: DropDownList =
                (editor.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 2; repeatElement.dataBind();
            const endOnElement: DropDownList =
                (editor.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            endOnElement.index = 1; endOnElement.dataBind();
            const recEditor: RecurrenceEditor =
                (editor.querySelector('.e-recurrenceeditor') as EJ2Instance).ej2_instances[0] as RecurrenceEditor;
            expect(recEditor.getRecurrenceRule()).toEqual('FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;UNTIL=20220506T090000Z;');
            util.triggerMouseEvent(editor.querySelector('.e-end-on-date .e-clear-icon'), 'mousedown');
            const dp: DatePicker = (editor.querySelector('.e-until-date') as EJ2Instance).ej2_instances[0] as DatePicker;
            dp.value = new Date(2022, 2, 1);
            async function openUntil(done: DoneFn): Promise<void> {
                util.triggerMouseEvent(editor.querySelector('.e-end-on-date .e-date-icon'), 'mousedown');
                done();
            }
            await openUntil(done);
            util.triggerMouseEvent(document.querySelectorAll('.e-calendar .e-cell')[9] as HTMLElement, 'click');
            util.triggerMouseEvent(editor.querySelector('.e-days [data-index="2"]') as HTMLElement, 'click');
            expect(recEditor.getRecurrenceRule()).toEqual('FREQ=WEEKLY;BYDAY=MO,TU;INTERVAL=1;UNTIL=20220308T000000Z;');
            util.triggerMouseEvent(editor.querySelector('.e-event-save') as HTMLElement, 'click');
        });
    });

    describe('Schedule Month view with maxEventsPerRow property when the row have enough height', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                currentView: 'Month',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'Month', maxEventsPerRow: 2 }]
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('elements in DOM based on maxEventsPerRow', () => {
            const appointmentList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(2);
            (schObj.element.querySelectorAll('.e-more-indicator')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            const moreEvent: HTMLElement = (schObj.element.querySelector('.e-more-popup-wrapper').querySelector('.e-more-appointment-wrapper'));
            const moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            (schObj.element.querySelector('.e-close-icon') as HTMLElement).click();
        });

        it('elements in DOM with rowAutoHeight enabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(4);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();

        });
    });

    describe('Schedule Month view with maxEventsPerRow property when the row does not have enough height', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                currentView: 'Month',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'Month', maxEventsPerRow: 3 }]
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('elements in DOM based on maxEventsPerRow', () => {
            const appointmentList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(3);
            (schObj.element.querySelectorAll('.e-more-indicator')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            const moreEvent: HTMLElement = (schObj.element.querySelector('.e-more-popup-wrapper').querySelector('.e-more-appointment-wrapper'));
            const moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            (schObj.element.querySelector('.e-close-icon') as HTMLElement).click();
            const heightValue: string = (schObj.element.querySelector('.e-content-table tr td') as HTMLElement).style.height;
            expect(heightValue).toEqual('110px');
        });

        it('elements in DOM with rowAutoHeight enabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(4);
                const heightValue: string = (schObj.element.querySelector('.e-content-table tr td') as HTMLElement).style.height;
                expect(heightValue).toEqual('100.6px');
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
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
