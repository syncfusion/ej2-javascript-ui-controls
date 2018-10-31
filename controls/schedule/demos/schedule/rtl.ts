import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2017, 10, 1),
    eventSettings: { dataSource: defaultData },
    enableRtl: true
});
scheduleObj.appendTo('#schedule');
