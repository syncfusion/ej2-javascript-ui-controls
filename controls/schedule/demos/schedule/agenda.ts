import { Schedule } from '../../src/schedule/base/schedule';
import { View } from '../../src/schedule/base/type';
import { Day } from '../../src/schedule/renderer/day';
import { Week } from '../../src/schedule/renderer/week';
import { WorkWeek } from '../../src/schedule/renderer/work-week';
import { Month } from '../../src/schedule/renderer/month';
import { Agenda } from '../../src/schedule/renderer/agenda';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { generateObject } from '../../spec/schedule/base/datasource.spec';
import { Internationalization } from '@syncfusion/ej2-base';

/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

let instance: Internationalization = new Internationalization();
(window as TemplateFunction).getDateText = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'MMMd' });
};

(window as TemplateFunction).getDayText = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'E' });
};

(window as TemplateFunction).getDateTimeText = (value: Date) => {
    return instance.formatDate(value, { type: 'dateTime', skeleton: 'medium' });
};

interface TemplateFunction extends Window {
    getDateText?: Function;
    getDayText?: Function;
    getDateTimeText?: Function;
}

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2017, 10, 1),
    currentView: 'Agenda',
    views: [{ option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
    { option: 'Agenda', allowVirtualScrolling: true }],
    eventSettings: { dataSource: generateObject() }
});
scheduleObj.appendTo('#schedule');

let numericText: NumericTextBox = new NumericTextBox({
    value: 7,
    min: 0,
    format: 'n0',
    showSpinButton: false,
    change: () => {
        let nTb: HTMLSelectElement = document.getElementById('agendadayscount') as HTMLSelectElement;
        scheduleObj.agendaDaysCount = (nTb.value !== '') ? parseInt(nTb.value, 0) : 7;
        scheduleObj.dataBind();
    }
});
numericText.appendTo('#agendadayscount');

document.getElementById('scheduleview').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('scheduleview') as HTMLSelectElement;
    scheduleObj.currentView = <View>ddl.value;
    scheduleObj.dataBind();
};

document.getElementById('virtualscroll').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('virtualscroll') as HTMLSelectElement;
    let allowVS: boolean = (ddl.value === 'true') ? true : false;
    scheduleObj.views = [{ option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
    { option: 'Agenda', allowVirtualScrolling: allowVS }];
    scheduleObj.dataBind();
};

document.getElementById('enableRtl').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('enableRtl') as HTMLSelectElement;
    scheduleObj.enableRtl = (ddl.value === 'true') ? true : false;
    scheduleObj.dataBind();
};

document.getElementById('showhideemptydays').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('showhideemptydays') as HTMLSelectElement;
    scheduleObj.hideEmptyAgendaDays = (ddl.value === 'true') ? true : false;
    scheduleObj.dataBind();
};

document.getElementById('dateheadertemplate').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('dateheadertemplate') as HTMLSelectElement;
    scheduleObj.dateHeaderTemplate = (ddl.value === 'true') ? '#datetemplate' : null;
    scheduleObj.dataBind();
};

document.getElementById('appointmenttemplate').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('appointmenttemplate') as HTMLSelectElement;
    scheduleObj.eventSettings.template = (ddl.value === 'true') ? '#apptemplate' : null;
    scheduleObj.dataBind();
};