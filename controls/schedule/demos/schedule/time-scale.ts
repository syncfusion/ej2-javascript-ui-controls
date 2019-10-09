import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';
import { Internationalization } from '@syncfusion/ej2-base';

/**
 * schedule sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);
let instance: Internationalization = new Internationalization();
(window as TemplateFunction).majorSlotTemplate = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'hm' });
};
(window as TemplateFunction).minorSlotTemplate = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'ms' }).replace(':00', '');
};
interface TemplateFunction extends Window {
    majorSlotTemplate?: Function;
    minorSlotTemplate?: Function;
}
let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    views: ['Day', 'Week', 'WorkWeek'],
    timeScale: {
        enable: true,
        interval: 60,
        slotCount: 6
    },
    eventSettings: { dataSource: defaultData }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

document.getElementById('slotCount').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('slotCount') as HTMLSelectElement;
    scheduleObj.timeScale.slotCount = parseInt(ddl.value, 10);
    scheduleObj.dataBind();
};

document.getElementById('interval').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('interval') as HTMLSelectElement;
    scheduleObj.timeScale.interval = parseInt(ddl.value, 10);
    scheduleObj.dataBind();
};

document.getElementById('timescale').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('timescale') as HTMLSelectElement;
    scheduleObj.timeScale.enable = (ddl.value === 'enable') ? true : false;
    scheduleObj.dataBind();
};

document.getElementById('template').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('template') as HTMLSelectElement;
    scheduleObj.timeScale.majorSlotTemplate = (ddl.value === 'enable') ? '#majorSlotTemplate' : null;
    scheduleObj.timeScale.minorSlotTemplate = (ddl.value === 'enable') ? '#minorSlotTemplate' : null;
    scheduleObj.dataBind();
};
