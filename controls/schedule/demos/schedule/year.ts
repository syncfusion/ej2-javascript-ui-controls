import { enableRipple } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, TimelineViews, TimelineYear } from '../../src/schedule/index';
import { yearDataGenerator } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
enableRipple(true);
Schedule.Inject(TimelineViews, TimelineYear);

let scheduleOptions: ScheduleModel = {
    width: '100%', height: '555px',
    selectedDate: new Date(2019, 0, 1),
    views: [
        { option: 'TimelineDay' },
        { option: 'TimelineYear', displayName: 'Horizontal Year', isSelected: true },
        { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
    ],
    eventSettings: { dataSource: yearDataGenerator(250) }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions);
scheduleObj.appendTo(document.getElementById('schedule'));
