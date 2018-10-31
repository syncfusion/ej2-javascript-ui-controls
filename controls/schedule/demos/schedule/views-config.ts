import { Schedule, Day, Week, WorkWeek, Month } from '../../src/schedule/index';
import { Internationalization } from '@syncfusion/ej2-base';
/**
 * schedule sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month);
let instance: Internationalization = new Internationalization();
(window as TemplateFunction).minorSlotTemplate = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'ms' }).replace(':00', '');
};
(window as TemplateFunction).majorSlotTemplate = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'hm' });
};
interface TemplateFunction extends Window {
    minorSlotTemplate?: Function;
    majorSlotTemplate?: Function;
}

Schedule.Inject(Day, Week, WorkWeek, Month);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    views: [
        { option: 'Day' },
        { displayName: '5 Days', option: 'Day', isSelected: true, interval: 5 },
        { option: 'Week', timeScale: { enable: true, slotCount: 6 } },
        { displayName: '2 Weeks', option: 'Week', interval: 2 },
        { option: 'WorkWeek' },
        { displayName: '3 Work Weeks', option: 'WorkWeek', interval: 3 },
        { option: 'Month' },
        { displayName: '4 Months', option: 'Month', interval: 4 }
    ]
});
scheduleObj.appendTo('#schedule');
