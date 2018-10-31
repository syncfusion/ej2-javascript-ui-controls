import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, ActionEventArgs
} from '../../../src/schedule/index';
import { generateResourceData, generateEventData, addResourceField } from '../../../spec/schedule/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule resources group performance sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth);

let hallData: Object[] = generateResourceData(1, 10, 'Hall ');
let roomData: Object[] = generateResourceData(1, 20, 'Room ', true, 1, 10);
let ownerData: Object[] = generateResourceData(1, 100, 'Owner ', true, 1, 20);

let eventData: Object[] = generateEventData(new Date(2018, 2, 1), new Date(2018, 3, 30), 1000);
addResourceField(eventData, 'HallId', 1, 10);
addResourceField(eventData, 'RoomId', 1, 20, 'HallId', 1, 10, roomData);
addResourceField(eventData, 'OwnerId', 1, 100, 'RoomId', 1, 20, ownerData);

// tslint:disable:no-console
console.time('init');
let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 3, 1),
    group: {
        resources: ['Halls', 'Rooms', 'Owners']
    },
    views: ['Day', 'Week', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineMonth'],
    resources: [
        {
            field: 'HallId', title: 'Hall',
            name: 'Halls', allowMultiple: false,
            dataSource: hallData
        }, {
            field: 'RoomId', title: 'Room',
            name: 'Rooms', allowMultiple: false,
            dataSource: roomData
        }, {
            field: 'OwnerId', title: 'Owner',
            name: 'Owners', allowMultiple: true,
            dataSource: ownerData
        }
    ],
    eventSettings: { dataSource: eventData },
    actionBegin: (e: ActionEventArgs) => {
        if (e.requestType === 'dateNavigate' || e.requestType === 'viewNavigate') {
            console.time('init');
            console.time('navigate');
        }
    },
    actionComplete: (e: ActionEventArgs) => {
        if (e.requestType === 'dateNavigate' || e.requestType === 'viewNavigate') {
            console.timeEnd('navigate');
        }
    },
    dataBinding: () => {
        console.time('events render');
    },
    dataBound: () => {
        console.timeEnd('events render');
        console.timeEnd('init');
    }
};
let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
