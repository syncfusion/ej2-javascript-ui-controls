import { Schedule, Day, Week, WorkWeek, Month } from '../../src/schedule/index';
import { sampleData } from '../../spec/schedule/base/datasource.spec';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2018, 1, 15),
    workHours: {
        highlight: true,
        start: '11:00',
        end: '20:00'
    },
    views: ['Day', 'Week', 'WorkWeek', 'Month'],
    eventSettings: { dataSource: sampleData}
});
scheduleObj.appendTo('#schedule');
scheduleObj.scrollTo('09:00');