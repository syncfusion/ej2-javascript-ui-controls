import { Schedule, Day, Week, WorkWeek, Resize, DragAndDrop } from '../src/schedule/index';
import { scheduleData } from './datasource';

Schedule.Inject(Day, Week, WorkWeek, Resize, DragAndDrop);

let scheduleObj: Schedule;

document.getElementById('render').addEventListener('click', renderSchedule);
document.getElementById('destroy').addEventListener('click', destorySchedule);

function renderSchedule(): void {
    scheduleObj = new Schedule({
        height: '550px',
        selectedDate: new Date(2021, 0, 12),
        currentView: 'Week',
        views: ['Day', 'Week', 'WorkWeek'],
        eventSettings: {
            dataSource: scheduleData
        }
    });
    scheduleObj.appendTo('#schedule');
}

function destorySchedule(): void {
    if (scheduleObj) {
        scheduleObj.destroy();
        scheduleObj = null;
    }
}
