import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Resize, DragAndDrop
} from '../../../src/schedule/index';
import { blockData } from '../../../spec/schedule/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule resources block events sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Resize, DragAndDrop);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineWeek', 'TimelineMonth'],
    group: {
        resources: ['Rooms', 'Owners']
    },
    resources: [
        {
            field: 'RoomId', title: 'Room',
            name: 'Rooms', allowMultiple: false,
            dataSource: [
                { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
            ],
            textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
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
    eventSettings: { dataSource: blockData, resourceColorField: 'Rooms' }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
