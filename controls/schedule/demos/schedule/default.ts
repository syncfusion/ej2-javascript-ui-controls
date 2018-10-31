import { enableRipple, addClass, removeClass } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month,
    Agenda, MonthAgenda, View, Resize, DragAndDrop
} from '../../src/schedule/index';
import { DatePicker, ChangeEventArgs } from '@syncfusion/ej2-calendars';
import { defaultData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule sample
 */
enableRipple(true);
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, Resize, DragAndDrop);

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    currentView: 'Week',
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
    eventSettings: {
        dataSource: defaultData,
        fields: {
            subject: { title: 'Name', name: 'Subject' },
            location: { title: 'Country Name', name: 'Location' },
            description: { title: 'Summary', name: 'Description' },
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' },
            startTimezone: { title: 'Origin', name: 'StartTimezone' },
            endTimezone: { title: 'Destination', name: 'EndTimezone' }
        }
    }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

let currentDate: DatePicker = new DatePicker({
    value: new Date(),
    showClearButton: false,
    change: (args: ChangeEventArgs) => {
        scheduleObj.selectedDate = args.value;
        scheduleObj.dataBind();
    }
});
currentDate.appendTo('#scheduledate');

document.getElementById('scheduleview').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('scheduleview') as HTMLSelectElement;
    scheduleObj.currentView = <View>ddl.value;
    scheduleObj.dataBind();
};

document.getElementById('themechange').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('themechange') as HTMLSelectElement;
    let links: HTMLElement[] = [].slice.call(document.getElementsByTagName('link'));
    for (let link of links) {
        let hrefValue: string = link.getAttribute('href');
        if (hrefValue.indexOf('../css/') !== -1) {
            let currentTheme: string = hrefValue.indexOf('material') !== -1 ? 'material' :
                hrefValue.indexOf('fabric') !== -1 ? 'fabric' :
                    hrefValue.indexOf('bootstrap') !== -1 ? 'bootstrap' : 'highcontrast';
            link.setAttribute('href', hrefValue.replace(currentTheme, ddl.value));
        }
    }
};

document.getElementById('biggerclass').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('biggerclass') as HTMLInputElement;
    if (ddl.checked) {
        addClass([document.body], 'e-bigger');
    } else {
        removeClass([document.body], 'e-bigger');
    }
};

document.getElementById('headerbar').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('headerbar') as HTMLInputElement;
    if (ddl.checked) {
        scheduleObj.showHeaderBar = true;
    } else {
        scheduleObj.showHeaderBar = false;
    }
    scheduleObj.dataBind();
};
