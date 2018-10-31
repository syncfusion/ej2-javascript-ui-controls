import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../../src/schedule/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { resourceData } from '../../../spec/schedule/base/datasource.spec';

/**
 * schedule resources group sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 3, 1),
    group: {
        byDate: true,
        resources: ['Rooms', 'Owners']
    },
    resources: [
        {
            field: 'RoomId',
            title: 'Room',
            name: 'Rooms', allowMultiple: false,
            dataSource: [
                { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                { text: 'ROOM 2', id: 2, color: '#56ca85' }
            ],
            textField: 'text', idField: 'id', colorField: 'color'
        }, {
            field: 'OwnerId',
            title: 'Owner',
            name: 'Owners', allowMultiple: true,
            dataSource: [
                { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                { text: 'Steven', id: 2, groupId: 2, color: '#f8a398' },
                { text: 'Michael', id: 3, groupId: 1, color: '#7499e1' }
            ],
            textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
        }],
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
    eventSettings: { dataSource: resourceData }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
