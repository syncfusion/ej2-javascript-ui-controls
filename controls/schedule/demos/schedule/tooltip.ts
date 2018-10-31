import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';

/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    eventSettings: {
        enableTooltip: true,
        dataSource: defaultData
    }
});
scheduleObj.appendTo('#schedule');

document.getElementById('enableTooltip').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('enableTooltip') as HTMLInputElement;
    if (checkEle.checked) {
        scheduleObj.eventSettings.enableTooltip = true;
    } else {
        scheduleObj.eventSettings.enableTooltip = false;
    }
    scheduleObj.dataBind();
};

document.getElementById('enableTooltipTemplate').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('enableTooltipTemplate') as HTMLInputElement;
    if (checkEle.checked) {
        scheduleObj.eventSettings.tooltipTemplate = '#tooltipTemplate';
    } else {
        scheduleObj.eventSettings.tooltipTemplate = null;
    }
    scheduleObj.dataBind();
};