import { Schedule, Day, MonthAgenda } from '../../src/schedule/index';
/**
 * schedule sample
 */

Schedule.Inject(Day, MonthAgenda);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '100%',
    currentView: 'Day',
    views: ['Day', 'MonthAgenda']
});
scheduleObj.appendTo('#schedule');
