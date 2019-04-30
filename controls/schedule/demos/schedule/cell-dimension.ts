import { Schedule, Day, Week, WorkWeek, Month, DragAndDrop, Resize } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';

/**
 * schedule cell width and height sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, DragAndDrop, Resize);
let scheduleObj: Schedule = new Schedule({
    cssClass: 'schedule-cell-dimension',
    width: '100%',
    height: '500px',
    views: ['Day', 'Week', 'WorkWeek', 'Month'],
    selectedDate: new Date(2017, 10, 1),
    eventSettings: {
        dataSource: defaultData
    }
});
scheduleObj.appendTo('#schedule');
