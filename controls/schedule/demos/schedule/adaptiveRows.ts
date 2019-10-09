import { enableRipple } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, Month, TimelineMonth, TimelineViews,
    Resize, DragAndDrop
} from '../../src/schedule/index';
import { blockData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
enableRipple(true);
Schedule.Inject(Month, TimelineMonth, TimelineViews, Resize, DragAndDrop);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1), currentView: 'Month',
    views: ['Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
    rowAutoHeight: true,
    eventSettings: {
        dataSource: blockData,
        fields: {
            subject: { title: 'Name', name: 'Subject' },
            location: { title: 'Country Name', name: 'Location' },
            description: { title: 'Summary', name: 'Description' },
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' },
            startTimezone: { title: 'Origin', name: 'StartTimezone' },
            endTimezone: { title: 'Destination', name: 'EndTimezone' }
        }
    }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

document.getElementById('autofit').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('autofit') as HTMLInputElement;
    scheduleObj.rowAutoHeight = ddl.checked;
    scheduleObj.dataBind();
};
