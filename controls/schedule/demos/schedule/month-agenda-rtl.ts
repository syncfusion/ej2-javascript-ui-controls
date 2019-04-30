import { Schedule, Day, MonthAgenda } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';
/**
 * schedule month agenda sample
 */

Schedule.Inject(Day, MonthAgenda);

(window as TemplateFunction).getImages = (value: Date) => {
    switch (value.getDay()) {
        case 0:
            return '<img src="images/cake.png"/>';
        case 1:
            return '<img src="images/basketball.png"/>';
        case 2:
            return '<img src="images/rugby.png"/>';
        case 3:
            return '<img src="images/guitar.png"/>';
        case 4:
            return '<img src="images/music.png"/>';
        case 5:
            return '<img src="images/doctor.png"/>';
        case 6:
            return '<img src="images/beach.png"/>';
        default:
            return null;
    }
};

interface TemplateFunction extends Window {
    getImages?: Function;
}

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
	enableRtl:true,
    currentView: 'MonthAgenda',
    selectedDate: new Date(2017, 10, 15),
    views: ['Day', 'MonthAgenda'],
    eventSettings: { dataSource: defaultData }
});
scheduleObj.appendTo('#schedule');

document.getElementById('enableRtl').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('enableRtl') as HTMLSelectElement;
    scheduleObj.enableRtl = (ddl.value === 'true') ? true : false;
    scheduleObj.dataBind();
};

document.getElementById('appointmenttemplate').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('appointmenttemplate') as HTMLSelectElement;
    scheduleObj.eventSettings.template = (ddl.value === 'true') ? '#apptemplate' : null;
    scheduleObj.dataBind();
};