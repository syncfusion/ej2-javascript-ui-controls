import { Schedule, Week } from '../../../src/schedule/index';
import { defaultData } from '../../../spec/schedule/base/datasource.spec';
/**
 * schedule sample
 */

Schedule.Inject(Week );
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    workDays: [1, 3, 4, 5],
    views: ['Week'],
    eventSettings: {dataSource: defaultData}
});
scheduleObj.appendTo('#schedule');