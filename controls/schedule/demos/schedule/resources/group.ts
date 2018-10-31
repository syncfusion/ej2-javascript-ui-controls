import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda,
    MonthAgenda, ResourceDetails, TreeViewArgs, Resize, DragAndDrop
} from '../../../src/schedule/index';
import { resourceData } from '../../../spec/schedule/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule resources group sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, Resize, DragAndDrop);

(window as TemplateFunction).getResourceImage = (value: ResourceDetails | TreeViewArgs) => {
    let imgSrc: string;
    let resourceName: string = (window as TemplateFunction).getResourceName(value);
    switch (resourceName) {
        case 'Nancy':
        case 'Steven':
        case 'Michael':
            imgSrc = "<img src='../images/" + resourceName.toLocaleLowerCase() + ".png'/>";
            break;
        default:
            imgSrc = '';
    }
    return imgSrc;
};
(window as TemplateFunction).getResourceName = (value: ResourceDetails | TreeViewArgs) => {
    return ((value as ResourceDetails).resourceData) ?
        (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] : (value as TreeViewArgs).resourceName;
};
interface TemplateFunction extends Window {
    getResourceImage?: Function;
    getResourceName?: Function;
}

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 3, 1),
    resourceHeaderTemplate: '#restemplate',
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
    eventSettings: { dataSource: resourceData, resourceColorField: 'Rooms' }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
