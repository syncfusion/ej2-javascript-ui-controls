import { RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../../src/schedule/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { resourceData } from '../../../spec/schedule/base/datasource.spec';

/**
 * schedule resources sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 3, 1),
    resources: [
        {
            field: 'RoomId', title: 'Room',
            name: 'Rooms', allowMultiple: false,
            dataSource: [
                { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' }
            ],
            textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
        }, {
            field: 'OwnerId',
            title: 'Owner',
            name: 'Owners',
            allowMultiple: true,
            dataSource: [
                { text: 'Nancy', id: 1, groupId: 1, color: '#f8a398' },
                { text: 'Steven', id: 2, groupId: 2, color: '#56ca85' },
                { text: 'Michael', id: 3, groupId: 1, color: '#51a0ed' }
            ],
            textField: 'text', idField: 'id', colorField: 'color', groupIDField: 'groupId'
        }
    ],
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
    eventSettings: { dataSource: resourceData, resourceColorField: 'Rooms' }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

let radioButton: RadioButton = new RadioButton({ label: 'Room', name: 'resColor', value: 'Rooms', checked: true, change: onRadioChange });
radioButton.appendTo('#radio1');

radioButton = new RadioButton({ label: 'Owner', name: 'resColor', value: 'Owners', change: onRadioChange });
radioButton.appendTo('#radio2');

function onRadioChange(args: ChangeArgs): void {
    scheduleObj.eventSettings.resourceColorField = args.value;
    scheduleObj.dataBind();
}