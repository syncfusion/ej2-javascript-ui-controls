import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, Resize, DragAndDrop, TimelineViews, TimelineMonth
} from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Resize, DragAndDrop);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    allowInline: true,
    currentView: 'Week',
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
    eventSettings: { dataSource: defaultData }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
