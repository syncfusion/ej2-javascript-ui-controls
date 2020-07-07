import { enableRipple } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Year, TimelineYear } from '../../src/schedule/index';
import { yearDataGenerator } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
enableRipple(true);
Schedule.Inject(Year, TimelineYear);

let scheduleOptions: ScheduleModel = {
    width: '100%', height: '555px',
    selectedDate: new Date(2020, 0, 1),
    views: [
        { option: 'Year', isSelected: true },
        { option: 'TimelineYear', displayName: 'Horizontal Year' },
        { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
    ],
    group: {
        resources: ['Projects', 'Categories']
    },
    resources: [
        {
            field: 'ProjectId', title: 'Choose Project', name: 'Projects',
            dataSource: [
                { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
                { text: 'PROJECT 2', id: 2, color: '#56ca85' },
                { text: 'PROJECT 3', id: 3, color: '#df5286' }
            ],
            textField: 'text', idField: 'id', colorField: 'color'
        }, {
            field: 'TaskId', title: 'Category',
            name: 'Categories', allowMultiple: true,
            dataSource: [
                { text: 'Nancy', id: 1, groupId: 1, color: '#df5286' },
                { text: 'Steven', id: 2, groupId: 2, color: '#7fa900' },
                { text: 'Robert', id: 3, groupId: 3, color: '#ea7a57' },
                { text: 'Smith', id: 4, groupId: 1, color: '#5978ee' },
                { text: 'Micheal', id: 5, groupId: 2, color: '#df5286' },
                { text: 'Root', id: 6, groupId: 3, color: '#00bdae' }
            ],
            textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
        }
    ],
    eventSettings: { dataSource: yearDataGenerator(250) }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions);
scheduleObj.appendTo(document.getElementById('schedule'));

document.getElementById('autorowheight').onchange = () => {
    scheduleObj.rowAutoHeight = (document.getElementById('autorowheight') as HTMLSelectElement).value === 'true';
    scheduleObj.dataBind();
};

document.getElementById('resource_grouping').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('resource_grouping') as HTMLSelectElement;
    scheduleObj.group.resources = ddl.value === 'true' ? ['Projects', 'Categories'] : [];
    scheduleObj.dataBind();
};
