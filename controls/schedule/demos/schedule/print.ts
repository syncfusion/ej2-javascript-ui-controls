import { Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, Print, ActionEventArgs, ToolbarActionArgs,
    TimelineViews, TimelineMonth } from '../../src/schedule/index';
import { Browser } from '@syncfusion/ej2-base';
import { ItemModel, DisplayMode } from '@syncfusion/ej2-navigations';
import { sampleData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * Schedule header customization sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Print);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: 500,
    selectedDate: new Date(2018, 1, 15),
    views: [
        { option: 'Day' },
        { option: 'Week'},
        { option: 'WorkWeek'},
        { option: 'Month', interval: 4 },
        { option: 'Agenda'}
    ],
    eventSettings: { dataSource: sampleData}
});
scheduleObj.appendTo('#schedule');

(document.getElementById('printSchedule') as HTMLElement).onclick = () => {
    scheduleObj.print();
};