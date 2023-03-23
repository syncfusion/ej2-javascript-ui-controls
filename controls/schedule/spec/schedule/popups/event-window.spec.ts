/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule event window spec
 */
import { Browser, EmitType, closest, remove, createElement } from '@syncfusion/ej2-base';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DateTimePicker, DatePicker } from '@syncfusion/ej2-calendars';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { AutoComplete, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Schedule, Week, ScheduleModel, EventRenderedArgs } from '../../../src/schedule/index';
import { RecurrenceEditor, RecurrenceEditorModel } from '../../../src/recurrence-editor/index';
import { EJ2Instance, PopupOpenEventArgs, ActionEventArgs } from '../../../src/schedule/base/interface';
import * as util from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { stringData, defaultData } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Week);

describe('Schedule event window initial load', () => {
    const appointments: Record<string, any>[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        Description: 'Enjoying Holiday in Paris'
    }, {
        Id: 2,
        StartTime: new Date(2017, 10, 1, 10, 0),
        EndTime: new Date(2017, 10, 1, 12, 30)
    }, {
        Id: 3,
        StartTime: new Date(2017, 10, 2),
        EndTime: new Date(2017, 10, 3),
        IsAllDay: true
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
    const resourceAppointments: Record<string, any>[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        RoomId: 1,
        OwnerId: [1, 3],
        Description: 'Enjoying Holiday in Paris'
    }];
    const resourceEvents: Record<string, any>[] = [{
        Id: 1,
        Subject: 'Holiday',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 10, 30),
        Location: 'Paris',
        CalendarId: 1,
        Description: 'Enjoying Holiday in Paris'
    }];

    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Schedule event window initial load with group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const repeatElement: MultiSelect =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[1].field) as EJ2Instance).ej2_instances[0] as MultiSelect;
            repeatElement.value = [2];
            repeatElement.dataBind();
            expect(schObj.eventsData.length).toEqual(1);
        });

        it('Save through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('Schedule event window with group without child', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                group: { resources: ['Project', 'Categories', 'Subcategories'] },
                resources: [
                    {
                        field: 'ProjectId',
                        title: 'Project',
                        name: 'Project', allowMultiple: false,
                        dataSource: [
                            { text: 'Department A', id: 1, color: '#cb6bb2' },
                            { text: 'Department B', id: 2, color: '#cb6bb2' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'CategoriesId',
                        title: 'Categories',
                        name: 'Categories', allowMultiple: true,
                        dataSource: [
                            { text: 'Instrument X', id: 1, groupId: 2, color: '#1aaa55' },
                            { text: 'Instrument Y', id: 2, groupId: 2, color: '#1aaa55' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    },
                    {
                        field: 'SubcategoriesId',
                        title: 'Subcategories',
                        name: 'Subcategories', allowMultiple: true,
                        dataSource: [
                            { text: 'Technician 1', id: 1, groupId: 1, color: '#7fa900' },
                            { text: 'Technician 2', id: 2, groupId: 1, color: '#7fa900' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }
                ]
            };
            schObj = util.createSchedule(model, resourceAppointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Multilevel change event checking', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[0].field) as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(repeatElement.value).toEqual(2);
            repeatElement.value = 1;
            repeatElement.dataBind();
            const categories: MultiSelect =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[1].field) as EJ2Instance).ej2_instances[0] as MultiSelect;
            expect(categories.value).toEqual([null]);
            const technician: MultiSelect =
                (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[2].field) as EJ2Instance).ej2_instances[0] as MultiSelect;
            expect(technician.value).toEqual(null);
        });
    });

    describe('Schedule event window initial load without group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
        it('Save through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
        it('Edit through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            const startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            startDate.element.parentElement.classList.add('e-input-focus');
            startDate.value = new Date('10/29/17 05:00 AM');
            startDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('Schedule event window initial load without group and with group edit enabled', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
        it('Save through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
        it('Edit through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                    ej2_instances[0] as DateTimePicker;
                expect(endDate.value).toEqual(new Date('10/29/17 05:30 AM'));
                const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            const startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            startDate.element.parentElement.classList.add('e-input-focus');
            startDate.value = new Date('10/29/17 05:00 AM');
            startDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('Schedule event window initial load', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Dialog elements rendering', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
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
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('End value change based on start value', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            const endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            util.triggerMouseEvent(endIcon, 'mousedown');
            const listItem: HTMLElement = document.querySelectorAll('.e-datetimepicker .e-list-item')[5] as HTMLElement;
            listItem.click();
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 2:30 AM');
            expect(endElement.value).toEqual('10/29/17 3:00 AM');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Invalid Start time or end time validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = null;
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect((schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-content') as HTMLElement).innerText)
                .toEqual('The entered date value is invalid.');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start time greater than end time validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).value = new Date(2017, 9, 28);
            ((endElement as EJ2Instance).ej2_instances[0] as DateTimePicker).dataBind();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect((schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-content') as HTMLElement).innerHTML)
                .toEqual('The selected end date occurs before the start date.');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start and End DateTime format change', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 12:00 AM');
            expect(endElement.value).toEqual('10/29/17 12:30 AM');
            const allDayElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            expect(startElement.value).toEqual('10/29/17');
            expect(endElement.value).toEqual('10/29/17');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Start and End DateTime format change - with date format value', () => {
            schObj.dateFormat = 'dd/MM/yyyy';
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = <HTMLInputElement>document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('29/10/2017 12:00 AM');
            expect(endElement.value).toEqual('29/10/2017 12:30 AM');
            const allDayElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            expect(startElement.value).toEqual('29/10/2017');
            expect(endElement.value).toEqual('29/10/2017');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Timezone display', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            timezoneElement.click();
            const timezoneDiv: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            timezoneElement.click();
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(false);
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Dialog value checking on cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('29/10/2017 12:00 AM');
            expect(endElement.value).toEqual('29/10/2017 12:30 AM');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Recurrence Appointment Validation', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            repeatInterval.value = 1;
            const until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('09/10/2017');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            endDate.value = new Date('10/31/2017');
            endOnElement.index = 0; endOnElement.dataBind();
            saveButton.click();
            okButton.click();
            endDate.value = new Date('11/05/2017');
            repeatElement.index = 2; repeatElement.dataBind();
            saveButton.click();
            okButton.click();
            endDate.value = new Date('10/30/2017');
            repeatElement.index = 3; repeatElement.dataBind();
            const monthDate: RadioButton =
                (dialogElement.querySelector('.e-radio-wrapper .e-radio') as EJ2Instance).ej2_instances[0] as RadioButton;
            monthDate.checked = true;
            const mDate: NumericTextBox =
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
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('EJ2-14149 - Repeat Every with null value', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 2; repeatElement.dataBind();
            repeatInterval.value = null;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Create Ocurrence for Validation', (done: DoneFn) => {
            schObj.dataBound = () => done();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            const count: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            count.value = 4;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });

        it('Edit Occurrence Validation', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_6"]')[3] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('10/31/2017 00:00');
            endDate.value = new Date('10/31/2017 00:30');
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
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
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
        });

        it('Reset recurrence field value checking on cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 3; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            const repeatCount: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatInterval.value = null; repeatInterval.dataBind();
            repeatCount.value = null; repeatCount.dataBind();
            repeatElement.index = 2; repeatElement.dataBind();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Dialog time value checking on allDay cell double click and uncheck allDay element', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            allDayElement.click();
            expect(startElement.value).toEqual('29/10/2017 9:00 AM');
            expect(endElement.value).toEqual('29/10/2017 9:30 AM');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Event window normal appointments value checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            const formElement: HTMLInputElement = dialogElement.querySelector('.' + cls.FORM_CLASS);
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            const locationElement: HTMLInputElement = dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            const descriptionElement: HTMLInputElement = dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(formElement.getAttribute('data-id')).toEqual('1');
            expect(subjectElement.value).toEqual('Holiday');
            expect(locationElement.value).toEqual('Paris');
            expect(descriptionElement.value).toEqual('Enjoying Holiday in Paris');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(startElement.value).toEqual('30/10/2017 10:00 AM');
            expect(endElement.value).toEqual('30/10/2017 10:30 AM');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Event window allday appointments value checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            const formElement: HTMLInputElement = dialogElement.querySelector('.' + cls.FORM_CLASS);
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            const locationElement: HTMLInputElement = dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            const descriptionElement: HTMLInputElement = dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(formElement.getAttribute('data-id')).toEqual('3');
            expect(subjectElement.value).toEqual('');
            expect(locationElement.value).toEqual('');
            expect(descriptionElement.value).toEqual('');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(startElement.value).toEqual('02/11/2017');
            expect(endElement.value).toEqual('02/11/2017');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });

        it('Time zone value checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const timezoneElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            const timezoneDiv: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(timezoneDiv.classList.contains('e-enable')).toEqual(true);
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            const timezoneDiv: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
            const timezoneContainer: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.e-time-zone-container');
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
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Time zone - search value', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startTZDropDown: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS);
            const keyEventArgs: any = { keyCode: 74, metaKey: false, preventDefault: (): void => { /** NO Code */ } };
            const listObj: any = (startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList;
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
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Save through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Edit through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
                expect(descriptionElement.value).toEqual('Product Demo');
                const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' +
                cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product Demo';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Delete through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            const deleteButton1: HTMLInputElement = <HTMLInputElement>document.querySelector('.e-quick-dialog-delete');
            deleteButton1.click();
        });

        it('Event double click and Delete occurrence through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            const recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            const appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            appointmentElement.click();
            (<HTMLElement>(<HTMLElement>schObj.quickPopup.quickPopup.content).querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            const appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Edit occurrence multi checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                const exDate: string = <string>dataObj[3].RecurrenceException;
                expect(exDate.split(',').length).toEqual(1);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-edit-icon') as HTMLElement;
            const appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Event double click and Delete series through window', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            const recurrenceEle: Element = schObj.element.querySelector('.e-recurrence-icon');
            const agendaElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(agendaElement, 'click');
            util.triggerMouseEvent(agendaElement, 'dblclick');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-series-event')).click();
            (<HTMLElement>schObj.eventWindow.dialogObject.element.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event double click and Edit series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const recurrenceEle: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            const appointmentElement: HTMLElement = closest(recurrenceEle, '.e-appointment') as HTMLElement;
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editEvent: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editEvent.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('11/05/2017 10:15');
            endDate.value = new Date('11/05/2017 14:45');
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            util.triggerMouseEvent(appointmentElement, 'click');
            util.triggerMouseEvent(appointmentElement, 'dblclick');
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-series-event') as HTMLElement;
            editButton.click();
            saveButton.click();
            okButton.click();
        });

        it('Event Click and Delete occurence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[3].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            const eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-occurrence-event')).click();
        });

        it('Event Click and Delete series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            (schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            const eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
        });

        it('Read only checking on event double click', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'click');
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement, 'dblclick');
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                expect((((<any>schObj.eventWindow).getInstance(cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)) as Button).disabled).toEqual(false);
                expect((((<any>schObj.eventWindow).getInstance(cls.DELETE_EVENT_CLASS)) as Button).disabled).toEqual(false);
                expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-open')).toEqual(false);
                expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-close')).toEqual(true);
                schObj.quickPopup.openDeleteAlert();
                expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-open')).toEqual(false);
                expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-close')).toEqual(true);
                done();
            };
            schObj.readonly = true;
            schObj.dataBind();
        });
    });

    describe('Schedule event window initial loading values', () => {
        let schObj: Schedule;
        const appData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2017, 10, 3, 0, 0),
            EndTime: new Date(2017, 10, 4, 10, 0),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Month', views: ['Month'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, appData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Event window appointments start and endTime value checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(false);
            expect(((allDayElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(startElement.value).toEqual('11/3/17');
            expect(endElement.value).toEqual('11/4/17');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });
    });

    describe('Recurrence Validation for event Id as string', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
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
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            const until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('09/10/2017');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            const okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Week validation', () => {
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            endDate.value = new Date('11/05/2017');
            repeatElement.index = 2; repeatElement.dataBind();
            endOnElement.index = 0;
            endOnElement.dataBind();
            saveButton.click();
            const okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Month validation', () => {
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            repeatElement.index = 3; repeatElement.dataBind();
            const monthDate: RadioButton =
                (dialogElement.querySelector('.e-radio-wrapper .e-radio') as EJ2Instance).ej2_instances[0] as RadioButton;
            monthDate.checked = true;
            endDate.value = new Date('11/30/2017');
            saveButton.click();
            const okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
        });

        it('Year Validation', () => {
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            repeatElement.index = 4; repeatElement.dataBind();
            endDate.value = new Date('10/30/2018');
            saveButton.click();
            const okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });

        it('Add new recurrence event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 2; endOnElement.dataBind();
            const count: NumericTextBox =
                (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            count.value = 4;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
        });
    });

    describe('Change start and end time duration through event window', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 12:00 AM');
            expect(endElement.value).toEqual('10/29/17 12:40 AM');
        });

        it('End value change based on start value', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startElement.parentElement.classList.add('e-input-focus');
            const endIcon: HTMLElement = dialogElement.querySelector('.e-time-icon');
            util.triggerMouseEvent(endIcon, 'mousedown');
            const listItem: HTMLElement = document.querySelectorAll('.e-datetimepicker .e-list-item')[3] as HTMLElement;
            listItem.click();
            const endElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/29/17 2:00 AM');
            expect(endElement.value).toEqual('10/29/17 2:40 AM');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Schedule event window mobile', () => {
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll(() => {
            Browser.userAgent = androidUserAgent;
        });
        afterAll(() => {
            Browser.userAgent = uA;
        });

        describe('work cells taphold', () => {
            let schObj: Schedule;
            beforeEach((done: DoneFn): void => {
                schObj = undefined;
                const model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, [], done);
            });
            afterEach((): void => {
                util.destroy(schObj);
            });

            it('dialog checking cell click and add event', () => {
                const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                const firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
                firstWorkCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const titleElement: HTMLElement = dialogElement.querySelector('.e-title-header') as HTMLElement;
                expect(titleElement.children.length).toEqual(3);
                const backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('Repeat status checking', () => {
                const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                const firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
                firstWorkCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const repeatElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' +
                    cls.EVENT_WINDOW_REPEAT_CLASS + ' input');
                repeatElement.click();
                expect(((repeatElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
                const backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });

            it('EJ2-63839 - openEditor with repeatType check', () => {
                schObj.openEditor(schObj.activeCellsData, 'Add', null, 1)
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const repeatElement: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' +
                    cls.EVENT_WINDOW_REPEAT_CLASS + ' input');
                expect(((repeatElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
                expect(((repeatElement as EJ2Instance).ej2_instances[0] as CheckBox).label).toEqual('Repeats every day(s)');
                const backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
        });

        describe('event taphold', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn): void => {
                const model: ScheduleModel = { height: '500px', width: '500px', selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, appointments, done);
            });
            afterAll((): void => {
                util.destroy(schObj);
            });

            it('dialog checking event tapHold', () => {
                const firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                (schObj.scheduleTouchModule as any).tapHoldHandler({ originalEvent: { target: firstEvent, type: 'touchstart' } });
                const eventPopup: HTMLElement = document.body.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                (eventPopup.querySelector('.e-edit-icon') as HTMLElement).click();
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement.querySelector('.e-title-text').innerHTML).toEqual('Edit Event');
                const backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
            it('dialog checking header cells tapHold', () => {
                const headerCell: HTMLElement = schObj.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS)[1] as HTMLElement;
                const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
                headerCell.click();
                (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
                expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const backIcon: HTMLElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
                backIcon.click();
            });
        });

        describe('event click - desktop', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn): void => {
                const model: ScheduleModel = { height: '800px', selectedDate: new Date(2017, 10, 1) };
                schObj = util.createSchedule(model, appointments, done);
            });
            afterAll((): void => {
                util.destroy(schObj);
            });

            it('dialog checking cell tabHold for desktop', () => {
                const firstEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                (schObj.scheduleTouchModule as any).tapHoldHandler({ originalEvent: { target: firstEvent, type: 'touchstart' } });
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                expect(dialogElement).toBeTruthy();
            });
        });
    });

    describe('Schedule custom editor window', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr><tr><td><div id="recurrenceEditor"></div>' +
                '</td></tr></tbody></table>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                    const recurrenceEditor: HTMLElement = args.element.querySelector('#recurrenceEditor') as HTMLElement;
                    if (!recurrenceEditor.classList.contains('e-recurrenceeditor')) {
                        const recurrenceObj: RecurrenceEditor = new RecurrenceEditor({
                            value: (<{ [key: string]: string }>args.data)['RecurrenceRule']
                        });
                        recurrenceObj.appendTo(recurrenceEditor);
                        schObj.setRecurrenceEditor(recurrenceObj);
                    }
                }
            };
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as Record<string, any>).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            const addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as Record<string, any>).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'edit';
            const addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelectorAll('#Subject').length).toEqual(1);
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelectorAll('#customDiv').length).toEqual(1);
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('EJ2-70482 - Schedule form validator instance count ', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const formElement: object[] = (<HTMLElement>dialogElement.querySelector('.e-schedule-form') as EJ2Instance).ej2_instances;
            expect(formElement.length).toEqual(1);
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[10] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[10] as HTMLElement, 'dblclick');
            const formElement1: object[] = (<HTMLElement>dialogElement.querySelector('.e-schedule-form') as EJ2Instance).ej2_instances;
            expect(formElement1.length).toEqual(1);
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);

        });
    });

    describe('Schedule custom editor template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr></tbody></table>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                }
            };
            const model: ScheduleModel = {
                editorTemplate: '#eventEditor', popupOpen: onPopupOpen, height: '500px',
                currentView: 'Month', views: ['Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('eventEditor'));
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as Record<string, any>).Subject).toEqual('add');
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            const addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            expect((schObj.quickPopup as any).getRecurrenceSummary()).toBe('');
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect((schObj.eventsData[0] as Record<string, any>).Subject).toEqual('edit');
                expect(schObj.eventsData.length).toEqual(1);
                schObj.quickPopup.quickDialog.destroy();
                remove(schObj.quickPopup.quickDialog.element);
                schObj.quickPopup.quickDialog.element = null;
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'edit';
            const addButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            addButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Schedule custom editor template with recurrence events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div>' +
                '<div class="form-check" id="RecurrenceEditor"></div></td></tr></tbody></table>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datepicker')) {
                        new DatePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                    const recurrenceEditor: HTMLElement = args.element.querySelector('#RecurrenceEditor');
                    if (!recurrenceEditor.classList.contains('e-recurrenceeditor')) {
                        const recurrObject: RecurrenceEditor = new RecurrenceEditor();
                        recurrObject.appendTo(recurrenceEditor);
                        (<any>schObj.eventWindow).recurrenceEditor = recurrObject;
                    }
                }
            };
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('#Subject') as HTMLInputElement).value = 'add';
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            const until: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            until.value = new Date('10/28/2017');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Appointment interval', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            const endElement: HTMLInputElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            expect(startElement.value).toEqual('10/4/17 12:00 AM');
            expect(endElement.value).toEqual('10/4/17 1:00 AM');
        });
    });

    describe('Editor changed window validation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Summary</td><td colspan="4"><input id="Subject" class="e-field e-input" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Status</td> <td colspan="4">' +
                '<input type="text" id="EventType" name="EventType" class="e-field" style="width: 100%" /> ' +
                '</td></tr><tr><td class="e-textlabel">From</td><td ' +
                'colspan="4"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td></tr><tr><td class="e-textlabel">To' +
                '</td><td colspan="4"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td class="e-textlabel">Reason</td><td colspan="4">' +
                '<textarea id="Description" class="e-field e-input" name="Description" rows="3" cols="50"' +
                'style="width: 100%; height: 60px !important; resize: vertical"></textarea></td></tr></tbody></table>';
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                    const statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
                    if (!statusElement.classList.contains('e-dropdownlist')) {
                        const dropDownListObject: DropDownList = new DropDownList({
                            placeholder: 'Choose status', value: statusElement.value,
                            dataSource: ['New', 'Requested', 'Confirmed']
                        });
                        dropDownListObject.appendTo(statusElement);
                    }
                    const validator: FormValidator = ((formElement as EJ2Instance).ej2_instances[0] as FormValidator);
                    validator.addRules('EventType', { required: true });
                    const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                }
            };

            const model: ScheduleModel = {
                editorTemplate: template, popupOpen: onPopupOpen, height: '500px',
                currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with save', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('This field is required.');
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });

        it('event window changed validation checking with save', () => {
            schObj.editorTemplate = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Summary</td><td colspan="4"><input id="Subject" class="e-field e-input" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Status</td> <td colspan="4">' +
                '<input type="text" id="EventType" name="EventType" class="e-field" style="width: 100%" /> ' +
                '</td></tr><tr><td class="e-textlabel">From</td><td ' +
                'colspan="4"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td></tr><tr><td class="e-textlabel">To' +
                '</td><td colspan="4"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td class="e-textlabel">Reason</td><td colspan="4">' +
                '<textarea id="Description" class="e-field e-input" name="Description" rows="3" cols="50"' +
                'style="width: 100%; height: 60px !important; resize: vertical"></textarea></td></tr></tbody></table>';
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('This field is required.');
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Editor changed window validation input feild', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5" id ="formId"><tbody>' +
                '<tr><td class="e-textlabel">Training Number</td> <td colspan="4"><input id="trainingNumber" class="e-field e-input" type="text" value="" ' +
                'name="trainingNumber" style="width: 100%" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/></td>' +
                '</tr><tr><td class="e-textlabel">Training name</td> <td colspan="4">' +
                ' <input id="Subject" class="e-field e-input" type="text" value="" name="Subject" style="width: 100%" placeholder="Enter the training Name" /> ' +
                '</td></tr><tr><td class="e-textlabel">Timing Session1 </td><td ' +
                'colspan="4"><input id="startTime" class="e-field" type="text" name="StartTime" /></td></tr><tr><td class="e-textlabel">Timing Session2' +
                '</td><td colspan="4"> <input id="session2" class="e-field" type="text" name="session2" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel">Timing Session3 </td><td colspan="4">' +
                '<input id="endTime" class="e-field" type="text" name="EndTime"  /></td></tr><tr><td class="e-textlabel" style="padding: 7px;">Duration</td>' +
                '<td colspan="4"><input id="duration" class="e-field e-input" type="text" value="" name="duration" style="width: 100%" placeholder="Add a duration" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel">Description</td><td colspan="4"><textarea id="Description" class="e-field e-input" name="Description" rows="3" cols="50" style="width: 100%; height: 60px !important; resize: vertical" placeholder="Add a description" ></textarea>' +
                '</td></tr><tr><td class="e-textlabel">Location</td><td colspan="4"><input id="location" class="e-field" type="text" value="" style="width: 100%" data-name="location" />' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 1px;">Employee Name</td><td colspan="4">' +
                '<input id="employee" class="e-field" type="text" value="" name="employee" data-name="employee" style="width: 100%"  placeholder= "Select a Employee name" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 7px;">Comment</td><td colspan="4">' +
                '<input id="comment" class="e-field e-input" type="text" value="" name="comment" style="width: 100%"placeholder="Add a comment" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 7px;">Skill</td><td colspan="4"><input id="skill" class="e-field e-input" type="text" value="" name="skill" style="width: 100%" placeholder="Add a skill" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 1px;">Approved by</td><td colspan="4">' +
                '<input id="approvedBy" class="e-field e-input" type="text" value="" name="approvedBy" style="width: 100%" placeholder="Enter a Approver" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td colspan="4"><input type="hidden" id="Stage" name="Stage" class="e-field  e-input" style="width: 100%" value="" readonly/>' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 1px;">Faculty</td><td colspan="4">' +
                '<input id="faculty" class="e-field" type="text" value="" name="faculty" data-name="faculty" style="width: 100%" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td> </tr><tr><td class="e-textlabel" style="padding: 1px;">EvaluationBy</td><td colspan="4">' +
                '<input id="evaluationBy" class="e-field e-input" type="text" value="" name="evaluationBy" style="width: 100%" placeholder="Enter a Name" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel" style="padding: 1px;">ApproverDetails</td><td colspan="4">' +
                ' <input id="approverDetails" class="e-field e-input" type="text" value="" name="approverDetails" style="width: 100%" placeholder="Add a details" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr></tbody></table>';
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const startElement: HTMLInputElement = args.element.querySelector('#startTime') as HTMLInputElement;
                    if (!startElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#endTime') as HTMLInputElement;
                    if (!endElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                    const sessionElement: HTMLInputElement = args.element.querySelector('#session2') as HTMLInputElement;
                    if (!sessionElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(sessionElement.value) || new Date() }, sessionElement);
                    }
                    const employeeElement: HTMLInputElement = args.element.querySelector('#employee') as HTMLInputElement;
                    if (!employeeElement.classList.contains('e-autocomplete')) {
                        const employeeObj: AutoComplete = new AutoComplete({
                            dataSource: ['Nancy', 'Steven', 'Laura', 'Robert', 'Margaret', 'Alice'],
                            placeholder: 'Select a Employee name'
                        });
                        employeeObj.appendTo(employeeElement);
                        // Setup the name attribute to the autocomplete input element for input focus out validation
                        employeeObj.element.setAttribute('name', 'employee');
                    }
                    const facultyElement: HTMLInputElement = args.element.querySelector('#faculty') as HTMLInputElement;
                    if (!facultyElement.classList.contains('e-autocomplete')) {
                        const facultyObj: AutoComplete = new AutoComplete({
                            dataSource: ['Nancy', 'Steven', 'Laura', 'Robert', 'Margaret', 'Alice'],
                            placeholder: 'Enter a Faculty'
                        });
                        facultyObj.appendTo(facultyElement);
                        facultyObj.element.setAttribute('name', 'faculty');
                    }
                    const locationElement: HTMLInputElement = args.element.querySelector('#location') as HTMLInputElement;
                    if (!locationElement.classList.contains('e-autocomplete')) {
                        const locationObj: AutoComplete = new AutoComplete({
                            dataSource: ['India', 'USA', 'California', 'Greenland', 'Newyork City', 'Bermuda'],
                            placeholder: 'Enter your location'
                        });
                        locationObj.appendTo(locationElement);
                        locationObj.element.setAttribute('name', 'location');
                    }
                    const stageElement: HTMLInputElement = args.element.querySelector('#Stage') as HTMLInputElement;
                    if (stageElement) {
                        stageElement.value = 'New';
                    }
                }
            };
            const model: ScheduleModel = {
                editorTemplate: template, popupOpen: onPopupOpen, height: '500px',
                currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with input Feild', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('#trainingNumber');
            subjectElement.focus();
            subjectElement.blur();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('This field is required');
            subjectElement.focus();
            subjectElement.value = '&';
            subjectElement.blur();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('Only & sign not allowed');
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('This field is required');
            cancelButton.click();
        });
    });

    describe('Editor window validation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
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
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.focus();
            subjectElement.blur();
            const locationElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            locationElement.focus();
            locationElement.blur();
            subjectElement.focus();
            subjectElement.value = 'Product Demo';
            subjectElement.blur();
            const descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.focus();
            descriptionElement.value = 'Product demo to the client';
            descriptionElement.blur();
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });
        it('Edit event validation checking after close icon click', () => {
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(appElements[2], 'dblclick');
            expect(schObj.quickPopup.quickDialog.element.classList.contains('e-popup-close')).toEqual(true);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(document.querySelector('.e-schedule-dialog .e-dlg-content .e-tooltip-wrap') as HTMLInputElement).toEqual(null);
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            expect(document.querySelector('.e-schedule-dialog .e-dlg-content .e-tooltip-wrap#Location_Error #Location-info').innerHTML).
                toEqual('This field is required.');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });

        it('save checking after clearing validation error', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            (((document.querySelector('.' + cls.FORM_CLASS) as EJ2Instance).ej2_instances[0] as FormValidator) as any).errorRules = [];
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Product demo';
            const locationElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.LOCATION_CLASS);
            locationElement.value = 'Office';
            const descriptionElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DESCRIPTION_CLASS);
            descriptionElement.value = 'Product demo to the client';
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('custom recurrence editor instance setting', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(false);
            const recObj: RecurrenceEditor = (schObj.eventWindow.dialogObject.element.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            expect(recObj.value).toBe('');
            schObj.setRecurrenceEditor(new RecurrenceEditor({ value: 'FREQ=DAILY;INTERVAL=1;COUNT=5' }));
            expect(recObj.value).toBe('');
            util.triggerMouseEvent(schObj.eventWindow.dialogObject.element.querySelector('.e-dlg-closeicon-btn'), 'click');
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(true);
        });

        it('open editor method manually testing for cell click action', () => {
            const cellData: Record<string, any> = schObj.getCellDetails(schObj.element.querySelectorAll('.e-work-cells').item(143));
            const eventData: Record<string, any> = { RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10' };
            (<Record<string, any>>cellData).RecurrenceRule = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            schObj.eventWindow.convertToEventData(<Record<string, any>>cellData, eventData);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(true);
            schObj.openEditor(eventData, 'Add', true);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(false);
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('Editor window - Recurrence Editor Mobile Interaction', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('dialog Interaction checking.', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            firstWorkCell.click();
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
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

    describe('event window destroy method testing', () => {
        let recObj: RecurrenceEditor;
        beforeEach(() => {
            recObj = undefined;
        });
        afterEach(() => {
            util.destroy(recObj);
        });

        it('recurrence editor control destroy checking', () => {
            const model: RecurrenceEditorModel = { value: 'FREQ=DAILY;INTERVAL=1;COUNT=5' };
            recObj = util.createRecurrenceEditor(model);
            expect(recObj.isDestroyed).toEqual(false);
            recObj.destroy();
            expect(recObj.isDestroyed).toEqual(true);
        });

        it('recurrence editor rendering', () => {
            util.loadCultureFiles('vi');
            const model: RecurrenceEditorModel = { value: 'FREQ=DAILY;INTERVAL=1;COUNT=5' };
            recObj = util.createRecurrenceEditor(model);
            expect(recObj.element.classList.contains('e-recurrenceeditor')).toEqual(true);
            expect(recObj.element.childElementCount).toBeGreaterThan(0);
            expect(recObj.getRuleSummary()).toEqual('every day(s), 5 time(s)');
            recObj.locale = 'vi';
            recObj.dataBind();
            recObj.destroy();
            expect(recObj.element.classList.contains('e-recurrenceeditor')).toEqual(false);
            expect(recObj.element.childElementCount).toEqual(0);
        });
    });

    describe('isSlotAvailable public method testing', () => {
        let schObj: Schedule;
        const eventDatas: Record<string, any>[] = [{
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
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 6, 1),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.data) {
                        const eventData: Record<string, any> = (args.data instanceof Array) ? args.data[0] : args.data;
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
            const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            const appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
        });

        it('event editing with overlapping', () => {
            schObj.dataBound = null;
            const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            const appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = new Date('7/4/18 01:00 PM');
            endDate.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('event editing without overlapping', (done: DoneFn) => {
            schObj.dataBound = () => {
                const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(appointment1.offsetTop).toEqual(720);
                expect(appointment1.offsetWidth).toEqual(53);
                expect(appointment1.offsetHeight).toEqual(144);
                const appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
                expect(appointment2.offsetTop).toEqual(864);
                expect(appointment2.offsetWidth).toEqual(53);
                expect(appointment2.offsetHeight).toEqual(180);
                done();
            };
            const appointment1: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(appointment1.offsetTop).toEqual(720);
            expect(appointment1.offsetWidth).toEqual(53);
            expect(appointment1.offsetHeight).toEqual(108);
            const appointment2: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(appointment2.offsetTop).toEqual(864);
            expect(appointment2.offsetWidth).toEqual(53);
            expect(appointment2.offsetHeight).toEqual(180);
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = new Date('7/4/18 12:00 PM');
            endDate.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });
    });

    describe('closeEditor public method testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking for cell double click event editor', () => {
            const workCellElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCellElements[0], 'click');
            util.triggerMouseEvent(workCellElements[0], 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('Checking for event double click event editor', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
            const editButton: HTMLElement = document.querySelectorAll('.e-edit')[0] as HTMLElement;
            util.triggerMouseEvent(editButton, 'click');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });
    });

    describe('Add Event With Editor Template', () => {
        let schObj: Schedule;
        let beginArgs: string;
        beforeAll((done: DoneFn) => {
            const template: string = '<div>Subject: ${Subject}</div>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const model: ScheduleModel = {
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
                    ],
                    textField: 'CalendarText', idField: 'CalendarId', colorField: 'calendarColor'
                }],
                actionBegin: (e: ActionEventArgs) => {
                    if (e.requestType === 'eventCreate') {
                        beginArgs = e.requestType;
                    }
                }
            };
            schObj = util.createSchedule(model, resourceEvents, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with save', (done: DoneFn) => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            setTimeout(() => {
                expect(beginArgs).not.toBeUndefined();
                expect(beginArgs).toEqual('eventCreate');
                done();
            }, 500);
        });
    });

    describe('Recurrence Validation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 3),
                enableRecurrenceValidation: false
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Wrong Pattern Alert', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            const endOnElement: DropDownList =
                (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            repeatElement.index = 1; repeatElement.dataBind();
            endOnElement.index = 1; endOnElement.dataBind();
            repeatInterval.value = 1;
            const untilDateElement: DatePicker =
                (dialogElement.querySelector('.e-end-on-date .e-datepicker') as EJ2Instance).ej2_instances[0] as DatePicker;
            untilDateElement.value = new Date('10/1/2017');
            untilDateElement.dataBind();
            schObj.dataBind();
            saveButton.click();
            const okButton: HTMLElement = document.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('Create Error Alert', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const startDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startDateElement.value = '11/19/17 11:00 AM';
            const endDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            endDateElement.value = '12/30/17 11:30 AM';
            const repeatElement: DropDownList =
                (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0] as DropDownList;
            const repeatInterval: NumericTextBox =
                (dialogElement.querySelector('.e-repeat-interval') as EJ2Instance).ej2_instances[0] as NumericTextBox;
            repeatElement.index = 3; repeatElement.dataBind();
            repeatInterval.value = 1;
            saveButton.click();
        });

        it('Edit Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Test';
            saveButton.click();
        });

        it('Series Alert', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                const subject: string = dataObj[4].Subject as string;
                expect(subject).toEqual('EditSeries');
                done();
            };
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[0] as HTMLElement, 'dblclick');
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-series-event')).click();
            subjectElement.value = 'EditSeries';
            saveButton.click();
        });

        it('Same Day Alert', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_5"]')[1] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const startDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS);
            startDateElement.value = '11/19/17 11:30 AM';
            const endDateElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS);
            endDateElement.value = '11/20/17 14:45 AM';
            saveButton.click();
        });
    });

    describe('All CRUD Action Properties as false', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: false, allowEditing: false, allowDeleting: false }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Ensure New Event Creation', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Ensure Edit Event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-quick-popup-wrapper .e-edit'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
        });

        it('Ensure Delete Event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-quick-popup-wrapper .e-delete'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
        });
    });

    describe('CRUD Actions with AllowAdding', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: true, allowEditing: false, allowDeleting: false }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Ensure New Event Creation', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Ensure Edit Event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('Ensure Delete Event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-quick-popup-wrapper .e-delete'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
        });
    });

    describe('CRUD Actions with AllowEditing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: false, allowEditing: true, allowDeleting: false }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Ensure New Event Creation', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-close')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
            expect(schObj.eventsData.length).toEqual(5);
        });

        it('Ensure Edit Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                const editedObj: { [key: string]: string } = schObj.eventsData[0] as { [key: string]: string };
                expect(editedObj.Subject).toEqual('Test');
                done();
            };
            expect(schObj.eventsData.length).toEqual(5);
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (eventDialog.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement).value = 'Test';
            util.triggerMouseEvent(eventDialog.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS), 'click');
        });

        it('Ensure Delete Event', () => {
            expect(schObj.eventsData.length).toEqual(5);
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            util.triggerMouseEvent(schObj.eventWindow.dialogObject.element.querySelector('.' + cls.DELETE_EVENT_CLASS), 'click');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect(schObj.eventsData.length).toEqual(5);
        });
    });

    describe('CRUD Actions with AllowDeleting', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: false, allowEditing: false, allowDeleting: true }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Ensure New Event Creation', () => {
            expect(schObj.eventsData.length).toEqual(5);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'dblclick');
            expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
        });

        it('Ensure Edit Event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.quickPopup.quickPopup.element.querySelector('.e-edit'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
        });

        it('Ensure Delete Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.quickPopup.quickPopup.element.querySelector('.e-delete'), 'click');
            util.triggerMouseEvent(schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete'), 'click');
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-open')).toEqual(false);
        });
    });

    describe('All CRUD Action Properties as true', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: true, allowEditing: true, allowDeleting: true }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Ensure New Event Creation', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                done();
            };
            expect(schObj.eventsData.length).toEqual(5);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells'), 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
        });

        it('Ensure Edit Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                const editedObj: { [key: string]: string } = schObj.eventsData[0] as { [key: string]: string };
                expect(editedObj.Subject).toEqual('Test');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = eventDialog.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Test';
            editButton.click();
        });

        it('Ensure Delete Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLElement = eventDialog.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLElement;
            deleteButton.click();
            const deleteButton1: HTMLInputElement = <HTMLInputElement>document.querySelector('.e-quick-dialog-delete');
            deleteButton1.click();
        });
    });

    describe('Argument checking while using editor template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<div>Subject: ${Subject}</div>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                editorTemplate: '#eventEditor',
                group: { resources: ['Calendars'] },
                resources: [{
                    field: 'CalendarId', name: 'Calendars', title: 'Calendars',
                    dataSource: [
                        { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
                        { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
                        { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
                        { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
                    ],
                    textField: 'CalendarText', idField: 'CalendarId', colorField: 'CalendarColor'
                }]
            };
            schObj = util.createSchedule(model, resourceEvents, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Editor popup type', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const data: Record<string, any> = args.data as Record<string, any>;
                    expect(data.startTime).toBeUndefined();
                    expect(data.endTime).toBeUndefined();
                    expect(data.isAllDay).toBeUndefined();
                    expect(+data.StartTime).toBe(+new Date('2017-10-29T00:00:00.000'));
                    expect(+data.EndTime).toBe(+new Date('2017-10-29T00:30:00.000'));
                    expect(data.IsAllDay).toBe(false);
                    expect(data.CalendarId).toEqual(1);
                    args.cancel = true;
                }
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
        });
    });

    describe('Editor window template with html5 validation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4">' +
                '<input id="Subject" class="e-field" type="text" value="" name="Subject" style="width: 100%" data-required-message="This field is required" required="" regex="^[a-zA-Z .()-_0-9]+$" data-regex-message="Only & sign not allowed"/>' +
                '</td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50"style="width: 100%; height: 60px !important; resize: vertical"></textarea>' +
                ' </td></tr><tr> <td class="e-textlabel">StartTime:</td> <td colspan="2"> <input id="StartTime" class="e-field" type="text" name="StartTime" />' +
                '</td><td class="e-textlabel">EndTime:</td><td colspan="2"> <input id="EndTime" class="e-field" type="text" name="EndTime" />' +
                '</td></tr><tr><td colspan="3"><div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label>' +
                '<input type="checkbox" class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr></tbody></table>';
            const onPopupOpen: EmitType<PopupOpenEventArgs> = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                    if (startElement && !startElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                    }
                    const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                    if (endElement && !endElement.classList.contains('e-datetimepicker')) {
                        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                    }
                }
            };

            const model: ScheduleModel = {
                editorTemplate: template, popupOpen: onPopupOpen, height: '500px',
                currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event window validation checking with save', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            saveButton.click();
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            expect((schObj.eventWindow.dialogObject.element.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('This field is required');
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.click();
        });
    });

    describe('EJ2-48253 - checking alert when drag and drop the occurrence event', () => {
        let schObj: Schedule;
        const eventData: Record<string, any> = {
            Id: 1,
            Subject: 'test event',
            StartTime: new Date(2017, 9, 30),
            EndTime: new Date(2017, 9, 30),
            IsAllDay: true,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        };
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', currentView: 'Month', selectedDate: new Date(2017, 10, 3) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('add event checking', (done: DoneFn) => {
            expect(schObj.eventsData.length).toEqual(0);
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.addEvent(eventData);
        });

        it('Checking occurrence and same day alert', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('11/4/2017');
            startDate.dataBind();
            endDate.value = new Date('11/4/2017');
            endDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            const okButton: HTMLElement = eventDialog.querySelector('.e-quick-alertok');
            okButton.click();
            startDate.value = new Date('10/31/2017');
            startDate.dataBind();
            endDate.value = new Date('10/31/2017');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[4] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[4] as HTMLElement, 'dblclick');
            editButton.click();
            startDate.value = new Date('10/29/2017');
            startDate.dataBind();
            endDate.value = new Date('10/29/2017');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            startDate.value = new Date('11/2/2017');
            startDate.dataBind();
            endDate.value = new Date('11/2/2017');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            okButton.click();
            cancelButton.click();
        });

        it('checking occurrence and same day alert of recurrence event', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[2] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[2] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('10/31/2017');
            startDate.dataBind();
            endDate.value = new Date('10/31/2017');
            endDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            const okButton: HTMLElement = eventDialog.querySelector('.e-quick-alertok');
            okButton.click();
            startDate.value = new Date('11/4/2017');
            startDate.dataBind();
            endDate.value = new Date('11/4/2017');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.eventsData.length).toEqual(1);
        });
    });

    describe('EJ2-51228- Delete following events through editor window', () => {
        let schObj: Schedule;
        const appointment: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Recurrence',
            StartTime: new Date(2019, 1, 4, 10),
            EndTime: new Date(2019, 1, 4, 11, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2019, 1, 5),
                eventSettings: { editFollowingEvents: true }
            };
            schObj = util.createSchedule(model, appointment, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Event Click and Edit following series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(([].slice.call(schObj.element.querySelectorAll('.e-appointment')) as HTMLElement[]).length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-appointment')[0].querySelector('.' + cls.SUBJECT_CLASS).innerHTML).toEqual('Testing');
                done();
            };
            expect(([].slice.call(schObj.element.querySelectorAll('.e-appointment')) as HTMLElement[]).length).toEqual(5);
            (schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-edit')).click();
            const eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-following-events')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('Recurrence');
            subjectElement.value = 'Testing';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Event Click and Delete following series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(([].slice.call(schObj.element.querySelectorAll('.e-appointment')) as HTMLElement[]).length).toEqual(2);
                done();
            };
            expect(([].slice.call(schObj.element.querySelectorAll('.e-appointment')) as HTMLElement[]).length).toEqual(5);
            (schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-edit')).click();
            const eventDialog: HTMLElement = document.body.querySelector('.e-quick-dialog') as HTMLElement;
            (<HTMLElement>eventDialog.querySelector('.e-quick-dialog-following-events')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            (<HTMLInputElement>document.querySelector('.e-quick-dialog-delete')).click();
        });
    });

    describe('EJ2-51055 - Prevent enter key submitting the form', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', allowKeyboardInteraction: false, selectedDate: new Date(2017, 10, 3) };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking prevent enter key in event window - save button', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.e-dialog' + '.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.focus();
            util.triggerKeyDownEvent(saveButton, 'Enter', 13);
            saveButton.click();
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(true);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(false);
        });

        it('Checking prevent enter key in event window - delete button', () => {
            const dialogElement: HTMLElement = document.querySelector('.e-dialog' + '.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.focus();
            util.triggerKeyDownEvent(deleteButton, 'Enter', 13);
            deleteButton.click();
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(true);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(false);
        });

        it('Checking prevent enter key in event window - cancel button', () => {
            const dialogElement: HTMLElement = document.querySelector('.e-dialog' + '.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const cancelButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement;
            cancelButton.focus();
            util.triggerKeyDownEvent(cancelButton, 'Enter', 13);
            cancelButton.click();
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(true);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(false);
        });

    });

    describe('To check timezone datasource loaded in the event window', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 10, 3),
                timezoneDataSource: [
                    { Value: 'Pacific/Niue', Text: 'Niue' },
                    { Value: 'Pacific/Pago_Pago', Text: 'Pago Pago' },
                    { Value: 'Pacific/Honolulu', Text: 'Hawaii Time' },
                    { Value: 'Pacific/Rarotonga', Text: 'Rarotonga' },
                    { Value: 'Pacific/Tahiti', Text: 'Tahiti' }
                ]
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('To Check if the given datasource loaded in the dropdown list', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
                expect(schObj.quickPopup.quickPopup.element).toBeTruthy();
                expect((schObj.quickPopup.quickPopup.element.querySelector('.' + cls.TIME_ZONE_CLASS) as HTMLElement).innerText)
                    .toEqual('Pacific/Rarotonga - Pacific/Rarotonga');
                (<HTMLElement>schObj.quickPopup.quickPopup.element.querySelector('.e-event-popup .e-close')).click();
                const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
                cancelButton.click();
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            timezoneElement.click();
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            const startTZDropDown: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS);
            const keyEventArgs: any = { keyCode: 74, metaKey: false, preventDefault: (): void => { /** NO Code */ } };
            expect((startTZDropDown as HTMLInputElement).value).toEqual(schObj.tzModule.getLocalTimezoneName());
            const listObj: any = (startTZDropDown as EJ2Instance).ej2_instances[0] as DropDownList;
            listObj.showPopup();
            listObj.filterInput.value = 'Ha';
            listObj.onInput();
            listObj.onFilterUp(keyEventArgs);
            let element: Element = [].slice.call(document.querySelectorAll('.e-dropdownbase .e-list-parent')).slice(-1)[0];
            expect(element.childNodes[0].textContent).toEqual('Hawaii Time');
            listObj.filterInput.value = '';
            listObj.onInput();
            listObj.onFilterUp(keyEventArgs);
            element = [].slice.call(document.querySelectorAll('.e-dropdownbase .e-list-parent')).slice(-1)[0];
            expect(element.childNodes.length).toEqual(6);
            listObj.onInput();
            listObj.onFilterUp(keyEventArgs);
            (element.children[3] as HTMLLIElement).click();
            const saveButton: HTMLElement = dialogElement.querySelector('.e-event-save') as HTMLElement;
            expect((startTZDropDown as HTMLInputElement).value).toEqual('Rarotonga');
            saveButton.click();
        });
    });

    describe('EJ2-56895-Editor window check box actions', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2017, 10, 3)
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('To Check all day and timezone check box actions', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const timezoneElement: HTMLElement = dialogElement.querySelector('.' + cls.TIME_ZONE_CLASS + ' input');
            timezoneElement.click();
            expect(((timezoneElement as EJ2Instance).ej2_instances[0] as CheckBox).checked).toEqual(true);
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS + '.e-enable')).toBeTruthy();
            timezoneElement.click();
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS + '.e-enable')).toBeFalsy();
            const allDayElement: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_ALL_DAY_CLASS + ' input');
            allDayElement.click();
            expect(dialogElement.querySelector('.e-time-zone-container.e-disable')).toBeTruthy();
            allDayElement.click();
            expect(dialogElement.querySelector('.e-time-zone-container.e-disable')).toBeFalsy();
            const closeButton: HTMLElement = dialogElement.querySelector('.e-dlg-closeicon-btn') as HTMLElement;
            closeButton.click();
            schObj.width = '400px';
            schObj.dataBind();
        });
        it ('EJ2-66573 - Editor window does not open when schedule is rendered with minimum width', () => {
            expect(schObj.element.style.width).toEqual('400px');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment-wrapper')[4].firstElementChild as HTMLElement, 'click', 300, 350);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment-wrapper')[4].firstElementChild as HTMLElement, 'dblclick', 300, 350);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS).firstElementChild as HTMLElement;
            expect(dialogElement).toBeTruthy();
            expect(dialogElement.classList.contains('e-popup-open')).toBeTruthy();
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toBeFalsy();
        });
    });

    describe('EJ2CORE-491-Edit block appointments using editor window', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2022, 1, 6),
                showQuickInfo: false,
                eventRendered: (args: EventRenderedArgs) => {
                    if (args.type === 'blockEvent') {
                        args.element.onclick = onBlockClick;
                    }
                },
                popupOpen: (args: PopupOpenEventArgs) => {
                    if (args.type === 'Editor') {
                        if (!args.element.querySelector('.custom-field-row')) {
                            const row: HTMLElement = createElement('div', { className: 'custom-field-row' });
                            const formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
                            formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                            const container: HTMLElement = createElement('div', { className: 'custom-field-container' });
                            const inputEle: HTMLElement = createElement('input', {
                                id: 'IsBlock', className: 'e-field e-is-block', attrs: { name: 'IsBlock' }
                            });
                            container.appendChild(inputEle);
                            row.appendChild(container);
                            const blockObj: CheckBox = new CheckBox({ label: 'is Block' });
                            blockObj.appendTo(inputEle);
                            inputEle.setAttribute('name', 'IsBlock');
                        }
                    }
                }
            };
            schObj = util.createSchedule(schOptions, defaultData, done);

            function onBlockClick(args: Event): void {
                const totalCount: Record<string, any>[] = schObj.getBlockEvents();
                let currentId: number;
                const target: HTMLElement = args.target as HTMLElement;
                if (target.classList.contains('e-block-appointment')) {
                    currentId = parseInt(target.getAttribute('data-id').split('_')[1], 10);
                } else {
                    currentId = parseInt(target.offsetParent.getAttribute('data-id').split('_')[1], 10);
                }
                const currentBlockData: Record<string, any>[] = [];
                for (let i: number = 0; i < totalCount.length; i++) {
                    if (totalCount[parseInt(i.toString(), 10)].Id === currentId) {
                        currentBlockData.push(totalCount[parseInt(i.toString(), 10)]);
                    }
                }
                schObj.openEditor(currentBlockData[0], 'Save');
            }
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Adding a block appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const blockData: Record<string, any> = schObj.blockData[0];
                expect(blockData.Subject).toEqual('Blocked range');
                expect(blockData.IsBlock).toBeTruthy();
                expect(blockData.RecurrenceRule).toEqual('FREQ=DAILY;INTERVAL=1;COUNT=2;');
                expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(2);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-is-block') as EJ2Instance).ej2_instances[0].checked = true;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Blocked range';
            (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0].value = 'daily';
            (dialogElement.querySelector('.e-end-on-element') as EJ2Instance).ej2_instances[0].value = 'count';
            (dialogElement.querySelector('.e-recurrence-count') as EJ2Instance).ej2_instances[0].value = 2;
            (dialogElement.querySelector('.e-event-save') as HTMLButtonElement).click();
        });
        it('editing a block appointment', (done: DoneFn) => {
            schObj.dataBound = () => {
                const blockData: Record<string, any> = schObj.blockData[0];
                expect(blockData.Subject).toEqual('Blocked range edited');
                expect(blockData.IsBlock).toBeTruthy();
                expect(blockData.RecurrenceRule).toEqual(null);
                expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-block-appointment') as HTMLElement, 'click');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Blocked range edited';
            (dialogElement.querySelector('.e-repeat-element') as EJ2Instance).ej2_instances[0].value = 'none';
            (dialogElement.querySelector('.e-event-save') as HTMLButtonElement).click();
        });
    });

    describe('EJ2-58120-openEditor method return incorrect end date testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2021, 0, 13)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('open editor method manually testing end time', () => {
            const cellData: Record<string, any> = {
                startTime: new Date(2021, 0, 13),
                endTime: new Date(2021, 0, 15),
                isAllDay: true
            };
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(false);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(true);
            schObj.openEditor(cellData, 'Add');
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(true);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(false);
            const startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_START_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_END_CLASS) as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            expect(startDate.value.getTime()).toEqual(new Date(2021, 0, 13).getTime());
            expect(endDate.value.getTime()).toEqual(new Date(2021, 0, 14).getTime());
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('EJ2-58120-openEditor method return incorrect end date testing for editor template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const template: string = '<table class="custom-event-editor" width="100%" cellpadding="5"><tbody>' +
                '<tr><td class="e-textlabel">Subject:</td><td colspan="4"><input id="Subject" class="e-field" type="text" value="" ' +
                'name="Subject" style="width: 100%"/></td></tr><tr><td class="e-textlabel">Description:</td><td colspan="4">' +
                '<textarea id="Description" class="e-field" name="Description" rows="3" cols="50" style="width:100%; ' +
                'height:60px!important;resize:vertical"></textarea></td></tr><tr><td class="e-textlabel">StartTime:</td><td ' +
                'colspan="2"><input id="StartTime" class="e-field" type="text" name="StartTime"/></td><td class="e-textlabel">EndTime:' +
                '</td><td colspan="2"><input id="EndTime" class="e-field" type="text" name="EndTime"/></td></tr><tr><td colspan="3">' +
                '<div class="form-check"><label class="form-check-label e-textlabel" for="AllDay">All Day</label><input type="checkbox"' +
                'class="form-check-input e-field" name="IsAllDay" id="AllDay"></div></td></tr></tbody></table>';
            const scriptEle: HTMLScriptElement = document.createElement('script');
            scriptEle.type = 'text/x-template';
            scriptEle.id = 'eventEditor';
            scriptEle.appendChild(document.createTextNode(template));
            document.getElementsByTagName('head')[0].appendChild(scriptEle);
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2021, 0, 13),
                popupOpen: (args: PopupOpenEventArgs) => {
                    if (schObj.editorTemplate && args.type === 'Editor') {
                        const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
                        if (startElement && !startElement.classList.contains('e-datepicker')) {
                            new DatePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                        }
                        const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
                        if (endElement && !endElement.classList.contains('e-datepicker')) {
                            new DatePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                        }
                    }
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('eventEditor'));
        });

        it('open editor method manually testing end time in editor template', () => {
            const cellData: Record<string, any> = {
                startTime: new Date(2021, 0, 13),
                endTime: new Date(2021, 0, 15),
                isAllDay: true
            };
            const dialogElement: HTMLElement = schObj.eventWindow.dialogObject.element as HTMLElement;
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(false);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(true);
            schObj.openEditor(cellData, 'Add');
            expect(dialogElement.classList.contains('e-popup-open')).toEqual(true);
            expect(dialogElement.classList.contains('e-popup-close')).toEqual(false);
            const startDate: DateTimePicker = (dialogElement.querySelector('#StartTime') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker = (dialogElement.querySelector('#EndTime') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            expect(startDate.value.getTime()).toEqual(new Date(2021, 0, 13).getTime());
            expect(endDate.value.getTime()).toEqual(new Date(2021, 0, 14).getTime());
            schObj.closeEditor();
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.eventWindow.dialogObject.element.classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('EJ2-67179 - checking possible alert cases', () => {
        let schObj: Schedule;
        const eventData: Record<string, any> = {
            Id: 1,
            Subject: 'test event',
            StartTime: new Date(2023, 0, 2, 23, 30),
            EndTime: new Date(2023, 0, 3, 0, 0),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        };
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2023, 0, 1) };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('add event checking', (done: DoneFn) => {
            expect(schObj.eventsData.length).toEqual(0);
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            schObj.addEvent(eventData);
        });

        it('Checking possible alert case for edit first occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                expect(schObj.element.querySelector('[data-id="Appointment_2"] .e-subject').innerHTML).toEqual('Edited');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('1/6/23 10:00 PM');
            startDate.dataBind();
            endDate.value = new Date('1/6/23 11:00 PM');
            endDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            const okButton: HTMLElement = eventDialog.querySelector('.e-quick-alertok');
            okButton.click();
            startDate.value = new Date('1/1/23 11:00 PM');
            startDate.dataBind();
            endDate.value = new Date('1/3/23 11:50 PM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            startDate.value = new Date('1/3/23 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('1/3/23 11:30 AM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            okButton.click();
            startDate.value = new Date('1/1/23 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('1/1/23 11:30 PM');
            endDate.dataBind();
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Edited';
            saveButton.click();
        });

        it('Checking possible alert case for edit mid occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                expect(schObj.element.querySelectorAll('[data-id="Appointment_3"] .e-subject')[0].innerHTML).toEqual('Edited Mid Occurrence');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[1] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('12/30/22 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('12/30/22 11:30 AM');
            endDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            const okButton: HTMLElement = eventDialog.querySelector('.e-quick-alertok');
            okButton.click();
            startDate.value = new Date('1/7/23 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('1/7/23 11:30 AM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            startDate.value = new Date('1/4/23 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('1/5/23 11:50 PM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            startDate.value = new Date('1/3/23 11:00 PM');
            startDate.dataBind();
            endDate.value = new Date('1/4/23 11:00 AM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            okButton.click();
            startDate.value = new Date('1/5/23 11:00 PM');
            startDate.dataBind();
            endDate.value = new Date('1/5/23 11:30 PM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            okButton.click();
            startDate.value = new Date('1/4/23 10:00 PM');
            startDate.dataBind();
            endDate.value = new Date('1/5/23 11:30 AM');
            endDate.dataBind();
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Edited Mid Occurrence';
            saveButton.click();
        });

        it('Checking possible alert case for edit last occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                expect(schObj.element.querySelector('[data-id="Appointment_4"] .e-subject').innerHTML).toEqual('Edited Last Occurrence');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[2] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[2] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('1/5/23 11:30 PM');
            startDate.dataBind();
            endDate.value = new Date('1/6/23 11:30 AM');
            endDate.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Two occurrences of the same event cannot occur on the same day.');
            const okButton: HTMLElement = eventDialog.querySelector('.e-quick-alertok');
            okButton.click();
            startDate.value = new Date('12/30/22 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('12/30/22 11:30 AM');
            endDate.dataBind();
            saveButton.click();
            expect(eventDialog.querySelector('.e-dlg-content').innerHTML).
                toEqual('Cannot reschedule an occurrence of the recurring appointment if it skips over a later occurrence of the same appointment.');
            okButton.click();
            startDate.value = new Date('1/7/23 11:30 AM');
            startDate.dataBind();
            endDate.value = new Date('1/7/23 11:30 PM');
            endDate.dataBind();
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Edited Last Occurrence';
            saveButton.click();
        });

        it('Checking edit start date of mid occurence, if that date not having occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(5);
                expect(schObj.element.querySelector('[data-id="Appointment_5"] .e-subject').innerHTML).toEqual('Start date edited for mid occurrence');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[1] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('[data-id="Appointment_1"]')[1] as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker =
                (dialogElement.querySelector('.e-start.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const endDate: DateTimePicker =
                (dialogElement.querySelector('.e-end.e-datetimepicker') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            startDate.value = new Date('1/6/23 11:00 AM');
            startDate.dataBind();
            endDate.value = new Date('1/6/23 11:30 AM');
            endDate.dataBind();
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Start date edited for mid occurrence';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Checking occurrence title edit', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(6);
                expect(schObj.element.querySelector('[data-id="Appointment_6"] .e-subject').innerHTML).toEqual('Edited');
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const eventDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            const editButton: HTMLElement = eventDialog.querySelector('.e-quick-dialog-occurrence-event') as HTMLElement;
            editButton.click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Edited';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('EJ2-68537 - Schedule action events checking for resources with allowMultiple property set as true', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Burning Man',
            StartTime: '2023-02-09T09:30:00.000Z',
            EndTime: '2023-02-09T11:30:00.000Z',
            ProjectId: 1
        }
        ];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2023, 1, 9),
                group: {
                    resources: ['Projects']
                },
                resources: [
                    {
                        field: 'ProjectId',
                        title: 'Choose Project',
                        name: 'Projects',
                        dataSource: [
                            { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
                            { text: 'PROJECT 2', id: 2, color: '#56ca85' },
                            { text: 'PROJECT 3', id: 3, color: '#df5286' },
                            { text: 'PROJECT 4', id: 4, color: '#df5286' }
                        ],
                        textField: 'text',
                        idField: 'id',
                        colorField: 'color',
                        allowMultiple: true
                    }
                ]
            };
            schObj = util.createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('addedRecords, and changedRecords resource id values checking', (done: DoneFn) => {
            schObj.actionComplete = (args: ActionEventArgs) => {
                if (args.addedRecords && args.addedRecords.length > 0) {
                    expect((args.addedRecords[0] as any).ProjectId).toEqual(4);
                    expect((args.addedRecords[1] as any).ProjectId).toEqual(2);
                }
                if (args.changedRecords && args.changedRecords.length > 0) {
                    expect((args.changedRecords[0] as any).ProjectId).toEqual(1);
                }
                done();
            };
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            const resourceElement: MultiSelect =
            (dialogElement.querySelector('.e-' + schObj.resourceBase.resourceCollection[0].field) as EJ2Instance).ej2_instances[0] as MultiSelect;
            resourceElement.value = [1, 2, 4];
            resourceElement.dataBind();
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            subjectElement.value = 'Test';
            saveButton.click();
        });
    });

    describe('EJ2-69821- Add event check while customizing the recurrence editor repeat type options in the Schedule editor', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2023, 1, 5),
                popupOpen: (args: PopupOpenEventArgs) => {
                    if (args.type === 'Editor') {
                        (schObj.eventWindow as any).recurrenceEditor.frequencies = ['none', 'daily', 'weekly'];
                    }
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Save through event window checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
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
