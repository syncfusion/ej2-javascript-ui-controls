import { enableRipple } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month,
    Agenda, MonthAgenda, Resize, DragAndDrop, TimelineViews, TimelineMonth
} from '../../src/schedule/index';
import { DatePicker } from '@syncfusion/ej2-calendars';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
enableRipple(true);
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Resize, DragAndDrop);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    minDate: new Date(2017, 9, 17),
    selectedDate: new Date(2017, 9, 18),
    maxDate: new Date(2017, 9, 19),
    eventSettings: {
        dataSource: [{
            Id: 1,
            Subject: 'Event-1',
            StartTime: new Date(2017, 9, 16, 23),
            EndTime: new Date(2017, 9, 17, 10),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Event-2',
            StartTime: new Date(2017, 9, 16, 10),
            EndTime: new Date(2017, 9, 16, 11),
            IsAllDay: false
        }, {
            Id: 3,
            Subject: 'Event-3',
            StartTime: new Date(2017, 9, 18, 10),
            EndTime: new Date(2017, 9, 20, 11),
            IsAllDay: true
        }, {
            Id: 4,
            Subject: 'Event-4',
            StartTime: new Date(2017, 9, 19, 10),
            EndTime: new Date(2017, 9, 19, 11),
            IsAllDay: false
        }, {
            Id: 5,
            Subject: 'Event-5',
            StartTime: new Date(2017, 9, 19, 10),
            EndTime: new Date(2017, 9, 20, 1),
            IsAllDay: false
        }, {
            Id: 6,
            Subject: 'Event-6',
            StartTime: new Date(2017, 9, 20, 10),
            EndTime: new Date(2017, 9, 20, 11),
            IsAllDay: false
        }]
    },
    currentView: 'Month',
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda',
        'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

let min: DatePicker = new DatePicker({
    value: new Date(2019, 6, 3),
    showClearButton: false
});
min.appendTo('#minDate');

let max: DatePicker = new DatePicker({
    value: new Date(2019, 6, 5),
    showClearButton: false
});
max.appendTo('#maxDate');

document.getElementById('submit').onclick = () => {
    let start: HTMLInputElement = document.getElementById('minDate') as HTMLInputElement;
    let end: HTMLInputElement = document.getElementById('maxDate') as HTMLInputElement;
    scheduleObj.minDate = new Date(start.value);
    scheduleObj.maxDate = new Date(end.value);
    scheduleObj.dataBind();
};