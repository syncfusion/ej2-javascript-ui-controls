import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../../src/schedule/index';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2017, 9, 5),
    workHours: { highlight: false }
});
scheduleObj.appendTo('#schedule');

document.getElementById('set-work-hour').onclick = () => {
    scheduleObj.setWorkHours(scheduleObj.activeView.renderDates, '04:00', '08:00');
    scheduleObj.setWorkHours(scheduleObj.activeView.renderDates, '12:00', '16:00');
}
document.getElementById('scroll-to-hour').onclick = () => {
    scheduleObj.scrollTo((document.getElementById('hour') as HTMLInputElement).value);
}
