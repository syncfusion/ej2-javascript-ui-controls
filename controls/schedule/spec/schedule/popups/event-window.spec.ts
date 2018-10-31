/**
 * Schedule event window spec 
 */
import { createElement, Browser, remove, EmitType, closest } from '@syncfusion/ej2-base';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DateTimePicker, DatePicker } from '@syncfusion/ej2-calendars';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Schedule, Week } from '../../../src/schedule/index';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import { EJ2Instance, PopupOpenEventArgs, ActionEventArgs } from '../../../src/schedule/base/interface';
import { triggerMouseEvent, loadCultureFiles, disableScheduleAnimation } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { stringData } from '../base/datasource.spec';

Schedule.Inject(Week);
describe('Schedule event window initial load', () => {
    let appointments: Object[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        Description: 'Enjoying Holiday in Paris'
    }, {
        Id: 2,
        StartTime: new Date(2017, 10, 1, 10, 0),
        EndTime: new Date(2017, 10, 1, 12, 30),
    }, {
        Id: 3,
        StartTime: new Date(2017, 10, 2),
        EndTime: new Date(2017, 10, 3),
        IsAllDay: true,
    }, {
        Id: 4,
        StartTime: new Date(2017, 10, 4, 10, 0),
        EndTime: new Date(2017, 10, 4, 10, 30),
        IsAllDay: false,
        StartTimezone: 'Asia/Kolkata',
        EndTimezone: 'Asia/Kolkata'
    }, {
        Id: 5,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 3, 10, 15),
        EndTime: new Date(2017, 10, 3, 14, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        IsAllDay: false
    }];
    let resourceAppointments: Object[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        RoomId: 1,
        OwnerId: [1, 3],
        Description: 'Enjoying Holiday in Paris'
    }];

    describe('Schedule event window initial load with group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: resourceAppointments },
                group: {
                    resources: ['Country', 'Rooms', 'Owners']
                },
                resources: [{
                    field: 'CountryId',
                    name: 'Country',
                    dataSource: [{ Text: 'Contry 1', Id: 1, GroupID: 1, Color: '#ffaa00' },
                    { Text: 'Contry 2', Id: 2, GroupID: 2, Color: '#f8a398' }]
                }, {
                    field: 'RoomId',
                    name: 'Rooms',
                    dataSource: [{ Text: 'Room 1', Id: 1, GroupID: 1, Color: '#ffaa00' },
                    { Text: 'Room 2', Id: 2, GroupID: 1, Color: '#f8a398' }],
                    allowMultiple: true
                }, {
                    field: 'OwnerId',
                    name: 'Owners',
                    dataSource: [{ Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                    { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                    { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }],
                    allowMultiple: true
                }],
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Event Object split checking', () => {
            disableScheduleAnimation(schObj);
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Multilevel change event checking', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let repeatElement: MultiSelect =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[1].field) as
                    EJ2Instance).ej2_instances[0] as MultiSelect;
            repeatElement.value = [2];
            repeatElement.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Save through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });
    });
    describe('Schedule event window initial load without group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: resourceAppointments },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner',
                    name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }
                ],
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Event Object split checking', () => {
            disableScheduleAnimation(schObj);
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(2);
        });
        it('Save through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });
        it('Edit through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            let startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            startDate.element.parentElement.classList.add('e-input-focus');
            startDate.value = new Date('10/29/17 05:00 AM');
            startDate.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });
    });
    describe('Schedule event window initial load without group and with group edit enabled', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: resourceAppointments },
                group: {
                    allowGroupEdit: true
                },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner',
                    name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }
                ],
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Event Object split checking', () => {
            disableScheduleAnimation(schObj);
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(4);
        });
        it('Save through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });
        it('Edit through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            let startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            startDate.element.parentElement.classList.add('e-input-focus');
            startDate.value = new Date('10/29/17 05:00 AM');
            startDate.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });
    });
    describe('Schedule event window initial load', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: appointments },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Dialog elements rendering', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('New Event');
            expect(dialogElement.querySelector('.e-subject-container label').innerHTML).toEqual('Title');
            expect(dialogElement.querySelector('.e-location-container label').innerHTML).toEqual('Location');
            expect(dialogElement.querySelector('.e-start-container label').innerHTML).toEqual('Start');
            expect(dialogElement.querySelector('.e-end-container label').innerHTML).toEqual('End');
            expect(dialogElement.querySelector('.e-start-time-zone-container label').innerHTML).toEqual('Start Timezone');
            expect(dialogElement.querySelector('.e-end-time-zone-container label').innerHTML).toEqual('End Timezone');
            expect(dialogElement.querySelector('.e-description-container label').innerHTML).toEqual('Description');
            expect(dialogElement.querySelector('.e-all-day-container .e-label').innerHTML).toEqual('All day');
            expect(dialogElement.querySelector('.e-time-zone-container .e-label').innerHTML).toEqual('Timezone');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('End value change based on start value', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            let endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            triggerMouseEvent(endIcon, 'mousedown');
            let listItem: HTMLElement = document.querySelectorAll('.e-datetimepicker .e-list-item')[5] as HTMLElement;
            listItem.click();
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 2:30 AM');
            expect(endElement.value).toEqual('10/29/17 3:00 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Invalid Start time or end time validation', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = null;
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect((schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-content') as HTMLElement).innerText)
                .toEqual('The entered date value is invalid.');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start time greater than end time validation', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = new Date(2017, 9, 28);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect((schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-content') as HTMLElement).innerHTML)
                .toEqual('The selected end date occurs before the start date.');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start and End DateTime format change', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 12:00 AM');
            expect(endElement.value).toEqual('10/29/17 12:30 AM');
            let allDayElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            expect(startElement.value).toEqual('10/29/17');
            expect(endElement.value).toEqual('10/29/17');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start and End DateTime format change - with date format value', () => {
            schObj.dateFormat = 'dd/MM/yyyy';
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = <HTMLInputElement>document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('29/10/2017 12:00 AM');
            expect(endElement.value).toEqual('29/10/2017 12:30 AM');
            let allDayElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            expect(startElement.value).toEqual('29/10/2017');
            expect(endElement.value).toEqual('29/10/2017');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Timezone display', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            timezoneElement.click();
            let timezoneDiv: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            timezoneElement.click();
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Dialog value checking on cell double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('29/10/2017 12:00 AM');
            expect(endElement.value).toEqual('29/10/2017 12:30 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Recurrence Appointment Validation', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            repeatInterval.value = 1;
            let until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('09/10/2017');
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            endDate.value = new Date('10/30/2017');
            endOnElement.index = 0; endOnElement.dataBind();
            saveButton.click();
            okButton.click();
            endDate.value = new Date('11/05/2017');
            repeatElement.index = 2; repeatElement.dataBind();
            saveButton.click();
            okButton.click();
            endDate.value = new Date('10/30/2017');
            repeatElement.index = 3; repeatElement.dataBind();
            let monthDate: RadioButton =
                (dialogElement.querySelector('.e-radio-wrapper .e-radio') as EJ2Instance).ej2_instances[0] as RadioButton;
            monthDate.checked = true;
            let mDate: NumericTextBox =
                (dialogElement.querySelector('.e-month-day') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            mDate.value = 30;
            endDate.value = new Date('11/30/2017');
            saveButton.click();
            okButton.click();
            okButton.click();
            endDate.value = new Date('12/03/2017');
            monthDate.checked = false;
            saveButton.click();
            okButton.click();
            repeatElement.index = 4; repeatElement.dataBind();
            endDate.value = new Date('10/30/2018');
            saveButton.click();
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('EJ2-14149 - Repeat Every with null value', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 2; repeatElement.dataBind();
            repeatInterval.value = null;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Create Ocurrence for Validation', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => done();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            let count: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            count.value = 4;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            schObj.dataBound = dataBound;
        });

        it('Edit Occurrence Validation', (done: Function) => {
            triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-edit-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('10/31/2017 00:00');
            endDate.value = new Date('10/31/2017 00:30');
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[2] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[2] as HTMLElement, 'dblclick');
            editButton.click();
            startDate.value = new Date('11/01/2017 00:00');
            endDate.value = new Date('11/01/2017 00:30');
            saveButton.click();
            okButton.click();
            cancelButton.click();
            (schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-edit-series')).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('Reset recurrence field value checking on cell double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 3; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            let repeatCount: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatInterval.value = null; repeatInterval.dataBind();
            repeatCount.value = null; repeatCount.dataBind();
            repeatElement.index = 2; repeatElement.dataBind();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Dialog time value checking on allDay cell double click and uncheck allDay element', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            allDayElement.click();
            expect(startElement.value).toEqual('29/10/2017 9:00 AM');
            expect(endElement.value).toEqual('29/10/2017 9:30 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Event window normal appointments value checking', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            let formElement: HTMLInputElement = dialogElement.querySelector('.' + cls.FORM_CLASS);
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            let locationElement: HTMLInputElement = dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            let descriptionElement: HTMLInputElement = dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            let allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            let timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(formElement.getAttribute('data-id')).toEqual('1');
            expect(subjectElement.value).toEqual('Holiday');
            expect(locationElement.value).toEqual('Paris');
            expect(descriptionElement.value).toEqual('Enjoying Holiday in Paris');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(startElement.value).toEqual('30/10/2017 10:00 AM');
            expect(endElement.value).toEqual('30/10/2017 10:30 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Event window allday appointments value checking', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            let formElement: HTMLInputElement = dialogElement.querySelector('.' + cls.FORM_CLASS);
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            let locationElement: HTMLInputElement = dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            let descriptionElement: HTMLInputElement = dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            let allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            let timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(formElement.getAttribute('data-id')).toEqual('3');
            expect(subjectElement.value).toEqual('');
            expect(locationElement.value).toEqual('');
            expect(descriptionElement.value).toEqual('');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(startElement.value).toEqual('02/11/2017');
            expect(endElement.value).toEqual('02/11/2017');
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });

        it('Time zone value checking', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            let timezoneDiv: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            cancelButton.click();
        });

        it('Event window timezone value checking depends upon allday appointment', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            let timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            let timezoneDiv: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            let timezoneContainer: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.e-time-zone-container');
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneContainer.classList.contains('e-disable')).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            allDayElement.click();
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            timezoneElement.click();
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            allDayElement.click();
            expect(timezoneContainer.classList.contains('e-disable')).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            allDayElement.click();
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Time zone - search value', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startTZDropDown: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS);
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                metaKey: false
            };
            let listObj: any = (startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList;
            listObj.showPopup();
            listObj.filterInput.value = 'Maw';
            listObj.onInput();
            listObj.onFilterUp(keyEventArgs);
            let element: Element = document.querySelector('.e-dropdownbase .e-list-parent');
            expect(element.childNodes[0].textContent).toEqual('(UTC+05:00) Mawson');
            listObj.filterInput.value = '';
            listObj.onInput();
            listObj.onFilterUp(keyEventArgs);
            element = document.querySelector('.e-dropdownbase .e-list-parent');
            expect(element.childNodes.length > 1).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Save through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });

        it('Edit through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' +
                cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            schObj.dataBound = dataBound;
        });

        it('Delete through event window checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
            deleteButton.click();
            let deleteButton1: HTMLInputElement = <HTMLInputElement>document.querySelector('.e-quick-dialog-delete');
            deleteButton1.click();
            schObj.dataBound = dataBound;
        });

        it('Event double click and Delete occurrence through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.dataBind();
            let recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            appointmentElement.click();
            (<HTMLElement>(<HTMLElement>schObj.quickPopup.quickPopup.content).querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit occurrence', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            triggerMouseEvent(appointmentElement, 'click');
            triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-edit-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Edit occurrence multi checking', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(6);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-edit-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            triggerMouseEvent(appointmentElement, 'click');
            triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-edit-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Delete series through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = true; };
            schObj.dataBind();
            let recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            let agendaElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            triggerMouseEvent(agendaElement, 'click');
            triggerMouseEvent(agendaElement, 'dblclick');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-edit-series')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit series', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            schObj.dataBound = dataBound;
            schObj.actionBegin = (args: ActionEventArgs) => { args.cancel = false; };
            schObj.dataBind();
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            triggerMouseEvent(appointmentElement, 'click');
            triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editEvent: HTMLElement = eventDialog.querySelector('.e-quick-dialog-edit-event') as HTMLElement;
            editEvent.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('11/05/2017 10:15');
            endDate.value = new Date('11/05/2017 14:45');
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            triggerMouseEvent(appointmentElement, 'dblclick');
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-edit-series') as HTMLElement;
            editButton.click();
            saveButton.click();
            okButton.click();
        });

        it('Event Click and Delete occurence', (done: Function) => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            let eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-edit-event')).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('Event Click and Delete series', (done: Function) => {
            (schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            let eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-edit-series')).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('Read only checking on event double click', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'click');
                triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'dblclick');
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let saveButton: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
                let deleteButton: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
                expect(((saveButton as EJ2Instance).ej2_instances[0] as Button).disabled).toEqual(true);
                expect(((deleteButton as EJ2Instance).ej2_instances[0] as Button).disabled).toEqual(true);
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            schObj.dataBound = dataBound;
            schObj.readonly = true;
            schObj.dataBind();
        });
    });

    describe('Recurrence Validation for event Id as string', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: stringData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Before start checking', () => {
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('Day validation', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            let until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('09/10/2017');
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            let okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Week validation', () => {
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            endDate.value = new Date('11/05/2017');
            repeatElement.index = 2; repeatElement.dataBind();
            endOnElement.index = 0;
            endOnElement.dataBind();
            saveButton.click();
            let okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Month validation', () => {
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            repeatElement.index = 3; repeatElement.dataBind();
            let monthDate: RadioButton =
                (dialogElement.querySelector('.e-radio-wrapper .e-radio') as EJ2Instance).ej2_instances[0] as RadioButton;
            monthDate.checked = true;
            endDate.value = new Date('11/30/2017');
            saveButton.click();
            let okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Year Validation', () => {
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            repeatElement.index = 4; repeatElement.dataBind();
            endDate.value = new Date('10/30/2018');
            saveButton.click();
            let okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Add new recurrence event', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            let count: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            count.value = 4;
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            schObj.dataBound = dataBound;
        });
    });

    describe('Change start and end time duration through event window', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                popupOpen: (args: PopupOpenEventArgs) => {
                    args.duration = 40;
                },
                eventSettings: { dataSource: appointments },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Default render', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 12:00 AM');
            expect(endElement.value).toEqual('10/29/17 12:40 AM');
        });

        it('End value change based on start value', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            let endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            triggerMouseEvent(endIcon, 'mousedown');
            let listItem: HTMLElement = document.querySelectorAll('.e-datetimepicker .e-list-item')[3] as HTMLElement;
            listItem.click();
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 2:00 AM');
            expect(endElement.value).toEqual('10/29/17 2:40 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Schedule event window mobile', () => {
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll(() => {
            Browser.userAgent = androidUserAgent;
        });
        afterAll(() => {
            Browser.userAgent = uA;
        });

        describe('work cells taphold', () => {
            let schObj: Schedule;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            beforeEach((): void => {
                schObj = undefined;
                document.body.appendChild(elem);
            });
            afterEach((): void => {
                if (schObj) {
                    schObj.destroy();
                }
                remove(document.querySelector('#Schedule'));;
            });

            it('dialog checking cell tapHold', () => {
                schObj = new Schedule({
                    height: '500px', currentView: 'Week', views: ['Week'],
                    selectedDate: new Date(2017, 10, 1)
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstWorkCell;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let titleElement: HTMLElement = dialogElement.querySelector('.e-title-header') as HTMLElement;
                let timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' +
                    cls.TIME_ZONE_CLASS + ' input');
                timezoneElement.click();
                let timezoneDiv: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' +
                    cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
                expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
                expect(titleElement.children.length).toEqual(3);
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('dialog checking cell tapHold - rtl', () => {
                schObj = new Schedule({
                    height: '500px', currentView: 'Week', views: ['Week'], enableRtl: true,
                    selectedDate: new Date(2017, 10, 1)
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstWorkCell;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let titleElement: HTMLElement = dialogElement.querySelector('.e-title-header') as HTMLElement;
                expect(titleElement.children.length).toEqual(3);
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('Repeat status checking', () => {
                schObj = new Schedule({
                    height: '500px', currentView: 'Week', views: ['Week'],
                    selectedDate: new Date(2017, 10, 1)
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstWorkCell;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let repeatElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' +
                    cls.EVENT_WINDOW_REPEAT_CLASS + ' input');
                repeatElement.click();
                expect(((repeatElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
        });

        describe('event taphold', () => {
            let schObj: Schedule;
            beforeAll((done: Function): void => {
                schObj = undefined;
                let elem: HTMLElement = createElement('div', { id: 'Schedule' });
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                schObj = new Schedule({
                    height: '500px',
                    width: '500px',
                    selectedDate: new Date(2017, 10, 1),
                    eventSettings: {
                        dataSource: appointments
                    },
                    dataBound: dataBound
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
            });
            afterAll((): void => {
                if (schObj) {
                    schObj.destroy();
                }
                remove(document.querySelector('#Schedule'));;
            });

            it('dialog checking event tapHold', () => {
                let firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstEvent;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                let eventPopup: HTMLElement = document.body.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                (eventPopup.querySelector('.e-edit-icon') as HTMLElement).click();
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement.querySelector('.e-title-text').innerHTML).toEqual('Edit Event');
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('dialog checking header tapHold', () => {
                let firstEvent: HTMLElement = schObj.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS) as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstEvent;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('dialog checking header cells tapHold', () => {
                let headerCell: HTMLElement = schObj.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS)[1] as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = headerCell;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
        });

        describe('event click - desktop', () => {
            let schObj: Schedule;
            beforeAll((done: Function): void => {
                schObj = undefined;
                let elem: HTMLElement = createElement('div', { id: 'Schedule' });
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                schObj = new Schedule({
                    height: '800px',
                    selectedDate: new Date(2017, 10, 1),
                    eventSettings: {
                        dataSource: appointments
                    },
                    dataBound: dataBound
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
            });
            afterAll((): void => {
                if (schObj) {
                    schObj.destroy();
                }
                remove(document.querySelector('#Schedule'));
            });

            it('dialog checking cell tabHold for desktop', () => {
                let firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstEvent;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement).toBeTruthy();
            });
        });
    });

    describe('Schedule custom editor window', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr></tbody></table>';
            let scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            let onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                }
            };
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                editorTemplate: '#eventEditor',
                popupOpen: onPopupOpen,
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('eventEditor').remove();
            remove(elem);
        });

        it('cancel event window', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('add event', (done: Function) => {
            let dataBound: (args: Object) => void = () => {
                expect((schObj.eventsData[0] as any).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: Function) => {
            let dataBound: (args: Object) => void = () => {
                expect((schObj.eventsData[0] as any).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'edit';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('editorTemplate set model to empty content', () => {
            schObj.popupOpen = null;
            schObj.editorTemplate = null;
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelectorAll('#Subject').length).toEqual(0);
            expect(dialogElement.querySelectorAll('.' + cls.SUBJECT_CLASS).length).toEqual(1);
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('editorTemplate set model to change content', () => {
            schObj.editorTemplate = '<div id="customDiv">Some content in dialog</div>';
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelectorAll('#customDiv').length).toEqual(1);
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Schedule custom editor template', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr></tbody></table>';
            let scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            let onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                }
            };
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                editorTemplate: '#eventEditor',
                popupOpen: onPopupOpen,
                height: '500px', currentView: 'Month', views: ['Month'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('eventEditor').remove();
            remove(elem);
        });

        it('add event', (done: Function) => {
            let dataBound: (args: Object) => void = () => {
                expect((schObj.eventsData[0] as any).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: Function) => {
            let dataBound: (args: Object) => void = () => {
                expect((schObj.eventsData[0] as any).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'edit';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Schedule custom editor template with recurrence events', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div>' +
                '<div class="form-check" id="RecurrenceEditor"></div></td></tr></tbody></table>';
            let scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            let onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                    let recurrenceEditor: HTMLElement = args.element.querySelector('#RecurrenceEditor');
                    if (!recurrenceEditor.classList.contains('e-recurrenceeditor')) {
                        let recurrObject: RecurrenceEditor = new RecurrenceEditor();
                        recurrObject.appendTo(recurrenceEditor);
                        let obj = (((document.querySelector('#Schedule') as EJ2Instance).ej2_instances[0] as Schedule) as any);
                        obj.eventWindow.recurrenceEditor = recurrObject;
                    }
                }
            };


            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                editorTemplate: '#eventEditor',
                popupOpen: onPopupOpen,
                height: '500px', currentView: 'Month', views: ['Month'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('eventEditor').remove();
            remove(elem);
        });

        it('Validation while add event', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            let until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('10/28/2017');
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Appointment interval', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 9, 5),
                popupOpen: (args: PopupOpenEventArgs) => {
                    args.duration = 60;
                },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('cell double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/4/17 12:00 AM');
            expect(endElement.value).toEqual('10/4/17 1:00 AM');
        });
    });


    describe('Editor window validation', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    dataSource: appointments,
                    fields: {
                        subject: { name: 'Subject', validation: { required: true } },
                        location: { name: 'Location', validation: { required: true } },
                        description: { name: 'Description', validation: { required: true } }
                    }
                },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('event window validation checking with save', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.focus();
            subjectElement.blur();
            let locationElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            locationElement.focus();
            locationElement.blur();
            subjectElement.focus();
            subjectElement.value = 'Product Demo';
            subjectElement.blur();
            let descriptionElement:
                HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.focus();
            descriptionElement.value = 'Product demo to the client';
            descriptionElement.blur();
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });
        it('save checking after clearing validation error', (done: Function) => {
            let dataBound: (args: Object) => void = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            (((document.querySelector('.' + cls.FORM_CLASS) as EJ2Instance)
                .ej2_instances[0] as FormValidator) as any).errorRules = [];
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Product demo';
            let locationElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            locationElement.value = 'Office';
            let descriptionElement:
                HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product demo to the client';
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            schObj.dataBound = dataBound;
        });
    });

    describe('Editor window - mobile', () => {
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll(() => {
            Browser.userAgent = androidUserAgent;
        });
        afterAll(() => {
            Browser.userAgent = uA;
        });

        describe('Recurrence Editor Mobile Interaction', () => {
            let schObj: Schedule;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            beforeEach((): void => {
                schObj = undefined;
                document.body.appendChild(elem);
            });
            afterEach((): void => {
                if (schObj) {
                    schObj.destroy();
                }
                remove(document.querySelector('#Schedule'));
            });

            it('dialog Interaction checking.', () => {
                schObj = new Schedule({
                    height: '500px', currentView: 'Week', views: ['Week'],
                    selectedDate: new Date(2017, 10, 1)
                });
                schObj.appendTo(elem);
                disableScheduleAnimation(schObj);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                let e: any = {}; e.originalEvent = {};
                e.originalEvent.target = firstWorkCell;
                e.originalEvent.type = 'touchstart';
                (schObj.scheduleTouchModule as any).tapHoldHandler(e);
                (<any>schObj).eventWindow.repeatStatus.element.parentElement.click();
                (<any>schObj).eventWindow.onRepeatChange(true);
                (<any>schObj).eventWindow.repeatOpenDialog();
                expect((<any>schObj).eventWindow.recurrenceEditor.getRecurrenceRule()).toBe('');
                (<any>schObj).eventWindow.recurrenceEditor.setProperties({ selectedType: 1 });
                (<any>schObj).eventWindow.repeatSaveDialog();
                expect((<any>schObj).eventWindow.recurrenceEditor.getRecurrenceRule()).toBe('FREQ=DAILY;INTERVAL=1;');
                (<any>schObj).eventWindow.loadRecurrenceEditor();
                (<any>schObj).eventWindow.repeatOpenDialog();
                (<any>schObj).eventWindow.recurrenceEditor.setProperties({ selectedType: 2 });
                expect((<any>schObj).eventWindow.recurrenceEditor.getRecurrenceRule()).toBe('FREQ=WEEKLY;BYDAY=SU;INTERVAL=1;');
                (<any>schObj).eventWindow.repeatCancelDialog();
                expect((<any>schObj).eventWindow.recurrenceEditor.getRecurrenceRule()).toBe('FREQ=DAILY;INTERVAL=1;');
                (<any>schObj).eventWindow.repeatStatus.element.parentElement.click();
                (<any>schObj).eventWindow.recurrenceEditor.setProperties({ selectedType: 0 });
                (<any>schObj).eventWindow.repeatSaveDialog();
                (<any>schObj).eventWindow.repeatOpenDialog();
                (<any>schObj).eventWindow.repeatTempRule = '';
                (<any>schObj).eventWindow.repeatCancelDialog();
            });
        });
    });

    describe('event window destroy method testing', () => {
        let controlObj: Schedule | RecurrenceEditor;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeEach(() => {
            document.body.appendChild(elem);
        });
        afterEach(() => {
            if (controlObj) {
                controlObj.destroy();
            }
            remove(elem);
        });

        it('recurrence editor control destroy checking', (done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            controlObj = new Schedule({ height: '500px', selectedDate: new Date(2017, 10, 1), dataBound: dataBound });
            controlObj.appendTo(elem);
            let recObj: HTMLElement = controlObj.eventWindow.dialogObject.element.querySelector('.e-recurrenceeditor') as HTMLElement;
            let instance: RecurrenceEditor = (recObj as EJ2Instance).ej2_instances[0] as RecurrenceEditor;
            expect(instance.isDestroyed).toEqual(false);
            instance.destroy();
            expect(instance.isDestroyed).toEqual(true);
        });

        it('recurrence editor rendering', () => {
            loadCultureFiles('vi');
            controlObj = new RecurrenceEditor({ value: 'FREQ=DAILY;INTERVAL=1;COUNT=5', locale: 'vi' });
            controlObj.appendTo(elem);
            expect(elem.classList.contains('e-recurrenceeditor')).toEqual(true);
            expect(elem.childElementCount).toBeGreaterThan(0);
            expect(controlObj.getRuleSummary()).toEqual('every day(s), 5 time(s)');
            controlObj.destroy();
            expect(elem.classList.contains('e-recurrenceeditor')).toEqual(false);
            expect(elem.childElementCount).toEqual(0);
            controlObj = null;
        });
    });

    describe('isSlotAvailable public method testing', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '500px', height: '500px',
                selectedDate: new Date(2018, 6, 1),
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Conference',
                        StartTime: new Date(2018, 6, 4, 10, 0),
                        EndTime: new Date(2018, 6, 4, 11, 30),
                        IsAllDay: false
                    }, {
                        Id: 2,
                        Subject: 'Meeting',
                        StartTime: new Date(2018, 6, 4, 12, 0),
                        EndTime: new Date(2018, 6, 4, 14, 30),
                        IsAllDay: false
                    }]
                },
                actionBegin: (args: ActionEventArgs) => {
                    if (args.data) {
                        let eventData: { [key: string]: Object } = ((<{ [key: string]: Object }>args.data)[0] ||
                            args.data) as { [key: string]: Object };
                        args.cancel = !schObj.isSlotAvailable(eventData.StartTime as Date, eventData.EndTime as Date);
                    }
                },
                dataBound: () => done()
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
            let appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            let appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
        });

        it('event editing with overlapping', () => {
            schObj.dataBound = null;
            let appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            let appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = new Date('7/4/18 01:00 PM');
            endDate.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('event editing without overlapping', (done: Function) => {
            schObj.dataBound = () => {
                let appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(appointment1.offsetTop).toEqual(720);
                expect(appointment1.offsetWidth).toEqual(53);
                expect(appointment1.offsetHeight).toEqual(144);
                let appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                expect(appointment2.offsetTop).toEqual(864);
                expect(appointment2.offsetWidth).toEqual(53);
                expect(appointment2.offsetHeight).toEqual(180);
                done();
            };
            let appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            let appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = new Date('7/4/18 12:00 PM');
            endDate.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });
    });
});
