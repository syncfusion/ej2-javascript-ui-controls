import { Schedule, Resize, DragAndDrop, TimelineViews, TimelineMonth } from '../src/schedule/index';

Schedule.Inject(TimelineViews, TimelineMonth, Resize, DragAndDrop);

let scheduleObj: Schedule;

document.getElementById('render').addEventListener('click', renderSchedule);
document.getElementById('destroy').addEventListener('click', destorySchedule);

function renderSchedule(): void {
    scheduleObj = new Schedule({
        height: '550px',
        selectedDate: new Date(2018, 1, 15),
        currentView: 'TimelineMonth',
        views: ['TimelineDay', 'TimelineMonth'],
        eventSettings: {
            dataSource: [{
                Id: 1,
                Subject: 'Meeting',
                StartTime: new Date(2018, 1, 15, 10, 0),
                EndTime: new Date(2018, 1, 15, 12, 30)
            }]
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
