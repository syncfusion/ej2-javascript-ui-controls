/**
 * Schedule event window spec 
 */
import { Browser, EmitType, closest, remove } from '@syncfusion/ej2-base';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DateTimePicker, DatePicker } from '@syncfusion/ej2-calendars';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Schedule, Week, ScheduleModel } from '../../../src/schedule/index';
import { RecurrenceEditor, RecurrenceEditorModel } from '../../../src/recurrence-editor/index';
import { EJ2Instance, PopupOpenEventArgs, ActionEventArgs } from '../../../src/schedule/base/interface';
import * as util from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { stringData, defaultData } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

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
    let resourceEvents: Object[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        CalendarId: 1,
        Description: 'Enjoying Holiday in Paris'
    }];


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

    describe('Schedule event window initial load with group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                group: { resources: ['Country', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'CountryId', name: 'Country',
                    dataSource: [
                        { Text: 'Contry 1', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Contry 2', Id: 2, GroupID: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'RoomId', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { Text: 'Room 1', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, GroupID: 1, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }]
            };
            schObj = util.createSchedule(model, resourceAppointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Event Object split checking', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Multilevel change event checking', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let repeatElement: MultiSelect =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[1].field) as
                    EJ2Instance).ej2_instances[0] as MultiSelect;
            repeatElement.value = [2];
            repeatElement.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Save through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('Schedule event window initial load without group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
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
                }],
            };
            schObj = util.createSchedule(model, resourceAppointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Event Object split checking', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(1);
        });
        it('Save through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
        it('Edit through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
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
        });
    });

    describe('Schedule event window initial load without group and with group edit enabled', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                group: { allowGroupEdit: true },
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
            schObj = util.createSchedule(model, resourceAppointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Event Object split checking', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(1);
        });
        it('Save through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
        it('Edit through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
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
        });
    });

    describe('Schedule event window initial load', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Dialog elements rendering', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            let endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            util.triggerMouseEvent(endIcon, 'mousedown');
            let listItem: HTMLElement = document.querySelectorAll('.e-datetimepicker .e-list-item')[5] as HTMLElement;
            listItem.click();
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 2:30 AM');
            expect(endElement.value).toEqual('10/29/17 3:00 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Invalid Start time or end time validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('29/10/2017 12:00 AM');
            expect(endElement.value).toEqual('29/10/2017 12:30 AM');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Recurrence Appointment Validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            schObj.dataBound = () => done();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
        });

        it('Edit Occurrence Validation', (done: Function) => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[2] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[2] as HTMLElement, 'dblclick');
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
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
        });

        it('Reset recurrence field value checking on cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            let timezoneDiv: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            cancelButton.click();
        });

        it('Event window timezone value checking depends upon allday appointment', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startTZDropDown: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS);
            // tslint:disable:no-any
            let keyEventArgs: any = { keyCode: 74, metaKey: false, preventDefault: (): void => { /** NO Code */ } };
            let listObj: any = (startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList;
            // tslint:enable:no-any
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
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Edit through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' +
                cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Delete through event window checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
            deleteButton.click();
            let deleteButton1: HTMLInputElement = <HTMLInputElement>document.querySelector('.e-quick-dialog-delete');
            deleteButton1.click();
        });

        it('Event double click and Delete occurrence through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.dataBind();
            let recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            appointmentElement.click();
            (<HTMLElement>(<HTMLElement>schObj.quickPopup.quickPopup.content).querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit occurrence', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Edit occurrence multi checking', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-edit-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Delete series through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            schObj.dataBind();
            let recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            let agendaElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(agendaElement, 'click');
            util.triggerMouseEvent(agendaElement, 'dblclick');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-series-event')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit series', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            schObj.dataBind();
            let recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            let appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editEvent: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
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
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-series-event') as HTMLElement;
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
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-occurrence-event')).click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
        });

        it('Event Click and Delete series', (done: Function) => {
            (schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            let eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
        });

        it('Read only checking on event double click', (done: Function) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'dblclick');
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let saveButton: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
                let deleteButton: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
                expect(((saveButton as EJ2Instance).ej2_instances[0] as Button).disabled).toBeUndefined();
                expect(((deleteButton as EJ2Instance).ej2_instances[0] as Button).disabled).toBeUndefined();
                let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            schObj.readonly = true;
            schObj.dataBind();
        });
    });

    describe('Schedule event window initial loading values', () => {
        let schObj: Schedule;
        let appData: Object[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2017, 10, 3, 0, 0),
            EndTime: new Date(2017, 10, 4, 10, 0),
            IsAllDay: true
        }];
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '500px', currentView: 'Month', views: ['Month'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, appData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Event window appointments start and endTime value checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            let allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            let timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(startElement.value).toEqual('11/3/17');
            expect(endElement.value).toEqual('11/4/17');
            let saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });
    });

    describe('Recurrence Validation for event Id as string', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, stringData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before start checking', () => {
            expect(schObj.eventsData.length).toEqual(4);
        });

        it('Day validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
        });
    });

    describe('Change start and end time duration through event window', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                popupOpen: (args: PopupOpenEventArgs) => args.duration = 40
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Default render', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 12:00 AM');
            expect(endElement.value).toEqual('10/29/17 12:40 AM');
        });

        it('End value change based on start value', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            let endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            util.triggerMouseEvent(endIcon, 'mousedown');
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
            beforeEach((done: Function): void => {
                schObj = undefined;
                let model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, [], done);
            });
            afterEach((): void => {
                util.destroy(schObj);
            });

            it('dialog checking cell click and add event', () => {
                let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                let firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
                firstWorkCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let titleElement: HTMLElement = dialogElement.querySelector('.e-title-header') as HTMLElement;
                expect(titleElement.children.length).toEqual(3);
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('Repeat status checking', () => {
                let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                let firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
                firstWorkCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
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
                let model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, appointments, done);
            });
            afterAll((): void => {
                util.destroy(schObj);
            });

            it('dialog checking event tapHold', () => {
                let firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                // tslint:disable-next-line:no-any
                (schObj.scheduleTouchModule as any).tapHoldHandler({ originalEvent: { target: firstEvent, type: 'touchstart' } });
                let eventPopup: HTMLElement = document.body.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                (eventPopup.querySelector('.e-edit-icon') as HTMLElement).click();
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement.querySelector('.e-title-text').innerHTML).toEqual('This Event');
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
            it('dialog checking header cells tapHold', () => {
                let headerCell: HTMLElement = schObj.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS)[1] as HTMLElement;
                let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                headerCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
                expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                let backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
        });

        describe('event click - desktop', () => {
            let schObj: Schedule;
            beforeAll((done: Function): void => {
                let model: ScheduleModel = { height: '800px', selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, appointments, done);
            });
            afterAll((): void => {
                util.destroy(schObj);
            });

            it('dialog checking cell tabHold for desktop', () => {
                let firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                // tslint:disable-next-line:no-any
                (schObj.scheduleTouchModule as any).tapHoldHandler({ originalEvent: { target: firstEvent, type: 'touchstart' } });
                let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement).toBeTruthy();
            });
        });
    });

    describe('Schedule custom editor window', () => {
        let schObj: Schedule;
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
            let model: ScheduleModel = {
                editorTemplate: '#eventEditor', popupOpen: onPopupOpen, height: '500px',
                currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('eventEditor'));
        });

        it('cancel event window', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('add event', (done: Function) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as { [key: string]: Object }).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: Function) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as { [key: string]: Object }).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelectorAll('#customDiv').length).toEqual(1);
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Schedule custom editor template', () => {
        let schObj: Schedule;
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
            let model: ScheduleModel = {
                editorTemplate: '#eventEditor', popupOpen: onPopupOpen, height: '500px',
                currentView: 'Month', views: ['Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('eventEditor'));
        });

        it('add event', (done: Function) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as { [key: string]: Object }).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: Function) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as { [key: string]: Object }).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'edit';
            let addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Schedule custom editor template with recurrence events', () => {
        let schObj: Schedule;
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
                        // tslint:disable-next-line:no-any
                        (<any>schObj.eventWindow).recurrenceEditor = recurrObject;
                    }
                }
            };
            let model: ScheduleModel = {
                editorTemplate: '#eventEditor', popupOpen: onPopupOpen, height: '500px',
                currentView: 'Month', views: ['Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('eventEditor'));
        });

        it('Validation while add event', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 9, 5),
                popupOpen: (args: PopupOpenEventArgs) => args.duration = 60
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            let endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/4/17 12:00 AM');
            expect(endElement.value).toEqual('10/4/17 1:00 AM');
        });
    });

    describe('Editor window validation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    fields: {
                        subject: { name: 'Subject', validation: { required: true } },
                        location: { name: 'Location', validation: { required: true } },
                        description: { name: 'Description', validation: { required: true } }
                    }
                }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with save', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.focus();
            descriptionElement.value = 'Product demo to the client';
            descriptionElement.blur();
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });
        it('Edit event validation checking after close icon click', () => {
            let appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(appElements[2], 'dblclick');
            expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-close')).toEqual(true);
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(document.querySelector('.e-schedule-dialog .e-dlg-content .e-tooltip-wrap') as HTMLInputElement).toEqual(null);
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            expect(document.querySelector('.e-schedule-dialog .e-dlg-content .e-tooltip-wrap#Location_Error #Location-info').innerHTML).
                toEqual('This field is required.');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });

        it('save checking after clearing validation error', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            // tslint:disable-next-line:no-any
            (((document.querySelector('.' + cls.FORM_CLASS) as EJ2Instance).ej2_instances[0] as FormValidator) as any).errorRules = [];
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Product demo';
            let locationElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            locationElement.value = 'Office';
            let descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product demo to the client';
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });
    });

    describe('Editor window - Recurrence Editor Mobile Interaction', () => {
        let schObj: Schedule;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('dialog Interaction checking.', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            firstWorkCell.click();
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
            // tslint:disable:no-any
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
            // tslint:enable:no-any
        });
    });

    describe('event window destroy method testing', () => {
        let recObj: Schedule | RecurrenceEditor;
        beforeEach(() => {
            recObj = undefined;
        });

        it('recurrence editor control destroy checking', () => {
            let model: RecurrenceEditorModel = { value: 'FREQ=DAILY;INTERVAL=1;COUNT=5' };
            recObj = util.createRecurrenceEditor(model);
            expect(recObj.isDestroyed).toEqual(false);
            recObj.destroy();
            expect(recObj.isDestroyed).toEqual(true);
            remove(recObj.element);
        });

        it('recurrence editor rendering', () => {
            util.loadCultureFiles('vi');
            let model: RecurrenceEditorModel = { value: 'FREQ=DAILY;INTERVAL=1;COUNT=5' };
            recObj = util.createRecurrenceEditor(model);
            expect(recObj.element.classList.contains('e-recurrenceeditor')).toEqual(true);
            expect(recObj.element.childElementCount).toBeGreaterThan(0);
            expect(recObj.getRuleSummary()).toEqual('every day(s), 5 time(s)');
            recObj.locale = 'vi';
            recObj.dataBind();
            recObj.destroy();
            expect(recObj.element.classList.contains('e-recurrenceeditor')).toEqual(false);
            expect(recObj.element.childElementCount).toEqual(0);
            remove(recObj.element);
        });
    });

    describe('isSlotAvailable public method testing', () => {
        let schObj: Schedule;
        let eventDatas: Object[] = [{
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
        }];
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 6, 1),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.data) {
                        let eventData: { [key: string]: Object } = (args.data instanceof Array) ? args.data[0] : args.data;
                        args.cancel = !schObj.isSlotAvailable(eventData.StartTime as Date, eventData.EndTime as Date);
                    }
                }
            };
            schObj = util.createSchedule(model, eventDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
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
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = new Date('7/4/18 12:00 PM');
            endDate.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });
    });

    describe('closeEditor public method testing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking for cell double click event editor', () => {
            let workCellElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCellElements[0], 'click');
            util.triggerMouseEvent(workCellElements[0], 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('Checking for event double click event editor', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
            let editButton: HTMLElement = document.querySelectorAll('.e-edit')[0] as HTMLElement;
            util.triggerMouseEvent(editButton, 'click');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Add Event With Editor Template', () => {
        let schObj: Schedule;
        let beginArgs: string;
        beforeAll((done: Function) => {
            let template: string = '<div>Subject: ${Subject}</div>';
            let scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                editorTemplate: '#eventEditor',
                group: { resources: ['Calendars'] },
                resources: [{
                    field: 'CalendarId', name: 'Calendars',
                    dataSource: [
                        { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
                        { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
                        { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
                        { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
                    ]
                }],
                actionBegin: (e: ActionEventArgs) => {
                    if (e.requestType === 'eventCreate') {
                        beginArgs = e.requestType;
                    }
                },
            };
            schObj = util.createSchedule(model, resourceEvents, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with save', (done: Function) => {
            schObj.dataBound = () => {
                expect(beginArgs).not.toBeUndefined();
                expect(beginArgs).toEqual('eventCreate');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });
    });
    
    describe('Recurrence Validation', () => {
        let schObj: Schedule;
        let beginArgs: string;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 3),
                enableRecurrenceValidation: false
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Wrong Pattern Alert', (done: Function) => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            let endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            let untilDateElement: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            untilDateElement.value = new Date('10/1/2017');
            untilDateElement.dataBind();
            schObj.dataBind();
            saveButton.click();
            let okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
            done();
        });

        it('Create Error Alert', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let startDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startDateElement.value = '11/19/17 11:00 AM'
            let endDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            endDateElement.value = '12/30/17 11:30 AM'
            let repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            let repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 3; repeatElement.dataBind();
            repeatInterval.value = 1;
            saveButton.click();
        });

        it('Edit Event', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Test';
            saveButton.click();
        });

        it('Series Alert', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                let dataObj: { [key: string]: Object }[] = schObj.eventsData as { [key: string]: Object }[];
                let subject: String = dataObj[4].Subject as string;
                expect(subject).toEqual('EditSeries');
                done();
            };
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'dblclick');
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
            subjectElement.value = 'EditSeries';
            saveButton.click();
        });

        it('Same Day Alert', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[1] as HTMLElement, 'dblclick');
            let eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            let editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            let startDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startDateElement.value = '11/19/17 11:30 AM'
            let endDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            endDateElement.value = '11/20/17 14:45 AM'
            saveButton.click();
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
