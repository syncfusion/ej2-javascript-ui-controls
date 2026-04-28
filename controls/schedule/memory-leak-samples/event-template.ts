import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../src/schedule/index';
import { webinarData } from './datasource';
import { Internationalization } from '@syncfusion/ej2-base';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
 
let instance: Internationalization = new Internationalization();
let scheduleObj: Schedule;

document.getElementById('render').addEventListener('click', renderSchedule);
document.getElementById('destroy').addEventListener('click', destorySchedule);

(window as TemplateFunction).getTimeString = (value: Date) => {
return instance.formatDate(value, { skeleton: 'hm' });
};

interface TemplateFunction extends Window {
    getTimeString?: Function;
}

function renderSchedule(): void {
    scheduleObj = new Schedule({
        width: '100%',
        height: '500px',
        readonly: true,
        selectedDate: new Date(2018, 1, 15),
        eventSettings: {
            dataSource: webinarData,
            template: '#apptemplate'
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
