import { Schedule, Day, Week, WorkWeek } from '../../src/schedule/index';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    views: [{ option: 'Day', startHour: '10:00', endHour: '18:00', isSelected: true },
    { option: 'Week' }, { option: 'WorkWeek' }]
});
scheduleObj.appendTo('#schedule');
