import { Schedule, Day } from '../../../src/schedule/index';
import { defaultData } from '../../../spec/schedule/base/datasource.spec';
/**
 * schedule sample
 */

Schedule.Inject(Day );
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    workDays: [1, 3, 4, 5],
    views: ['Day'],
    eventSettings: {dataSource: defaultData}
});
scheduleObj.appendTo('#schedule');