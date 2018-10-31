import { Schedule, Day, Week, WorkWeek, Month } from '../../src/schedule/index';
import { Internationalization } from '@syncfusion/ej2-base';
import { sampleData } from '../../spec/schedule/base/datasource.spec';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month);
let instance: Internationalization = new Internationalization();
(window as TemplateFunction).getDateHeaderText = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'MEd' });
};
(window as TemplateFunction).getCellText = (date: Date) => {
    let weekEnds: number[] = [0, 6];
    if (weekEnds.indexOf(date.getDay()) >= 0) {
        // tslint:disable-next-line:quotemark
        return "<img src='images/weekend.png' /><span class='caption'>Weekend</span>";
    }
    return '';
};
interface TemplateFunction extends Window {
    getDateHeaderText?: Function;
    getCellText?: Function;
}

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2018, 1, 15),
    dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>',
    cellTemplate: '#celltemplate',
    views: ['Day', 'Week', 'WorkWeek', 'Month'],
    eventSettings: { dataSource: sampleData}
});
scheduleObj.appendTo('#schedule');
