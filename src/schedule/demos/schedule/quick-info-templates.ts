import { Schedule, Day, Week, WorkWeek, Month } from '../../src/schedule/index';
import { resourceData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule editor template sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month);

(window as TemplateFunction).getResourceName = (value: { [key: string]: Object }) => {
    let resourceNames: string[] = ['nancy', 'steven', 'michael'];
    return resourceNames[(value.OwnerId as number) - 1];
};
interface TemplateFunction extends Window {
    getResourceName?: Function;
}

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 3, 1),
    quickInfoTemplates: {
        header: '#headerTemplate',
        content: '#contentTemplate',
        footer: '#footerTemplate'
    },
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
});
scheduleObj.appendTo('#schedule');

document.getElementById('hT').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('hT') as HTMLInputElement;
    scheduleObj.quickInfoTemplates.header = ddl.checked ? '#headerTemplate' : '';
    scheduleObj.dataBind();
};

document.getElementById('cT').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('cT') as HTMLInputElement;
    scheduleObj.quickInfoTemplates.content = ddl.checked ? '#contentTemplate' : '';
    scheduleObj.dataBind();
};

document.getElementById('fT').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('fT') as HTMLInputElement;
    scheduleObj.quickInfoTemplates.footer = ddl.checked ? '#footerTemplate' : '';
    scheduleObj.dataBind();
};