import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth,
    Resize, DragAndDrop, MonthAgenda, CalendarType
} from '../../src/schedule/index';
import { Ajax, L10n, loadCldr, setCulture, enableRtl } from '@syncfusion/ej2-base';
import { sampleData } from '../../spec/schedule/base/datasource.spec';
import { Calendar, Islamic } from '@syncfusion/ej2-calendars';

/**
 * Schedule locale sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Agenda, MonthAgenda, Resize, DragAndDrop);
Calendar.Inject(Islamic);
function loadCultureFiles(name: string, base: boolean = false): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json', 'ca-islamic.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('../../spec/cldr-data/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('../../spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
loadCultureFiles('', true);
loadCultureFiles('ar');
loadCultureFiles('de');
// loadCultureFiles('en');
loadCultureFiles('fr-CH');
loadCultureFiles('zh');

// To load locale texts
let localeTexts: string;
let ajax: Ajax = new Ajax('locale.json', 'GET', false);
ajax.onSuccess = (value: string) => {
    localeTexts = value;
};
ajax.send();
L10n.load(JSON.parse(<string>localeTexts));

setCulture('de');
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 1, 12),
    views: [
        { option: 'Day' },
        { option: 'TimelineDay' },
        { option: 'Week' },
        { option: 'TimelineWeek' },
        { option: 'Month' },
        { option: 'TimelineMonth' },
        { option: 'Agenda' },
        { option: 'MonthAgenda' }
    ],
    eventSettings: { dataSource: sampleData }
});
scheduleObj.appendTo('#schedule');

document.getElementById('cultures').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('cultures') as HTMLSelectElement;
    let value: string = ddl.value;
    enableRtl(value === 'ar');
    setCulture(value);
};

document.getElementById('calendarMode').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('calendarMode') as HTMLSelectElement;
    scheduleObj.calendarMode = ddl.value as CalendarType;
    scheduleObj.dataBind();
};