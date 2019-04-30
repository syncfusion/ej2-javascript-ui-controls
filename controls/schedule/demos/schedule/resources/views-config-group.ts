import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../../src/schedule/index';
import { resourceData } from '../../../spec/schedule/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule view specific group option sample
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
                { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
            ],
            textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
        }, {
            field: 'OwnerId', title: 'Owner',
            name: 'Owners', allowMultiple: true,
            dataSource: [
                { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
            ],
            textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
        }
    ],
    views: [
        { option: 'Day', group: { byGroupID: false, resources: ['Rooms', 'Owners'] } },
        { option: 'Week', group: { resources: ['Rooms', 'Owners'] } },
        { option: 'WorkWeek', group: { byDate: true, resources: ['Owners'] } },
        { option: 'Month' },
        { option: 'Agenda', group: { resources: ['Rooms', 'Owners'] } },
        { option: 'MonthAgenda' }],
    eventSettings: { dataSource: resourceData }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
