import { enableRipple, addClass, removeClass, Internationalization } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, View, TimelineViews, TimelineMonth, ResourceDetails } from '../../../src/schedule/index';
import { DatePicker, TimePicker, ChangeEventArgs } from '@syncfusion/ej2-calendars';
import { timelineResourceData } from '../../../spec/schedule/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';

/**
 * schedule timeline views sample
 */
enableRipple(true);
Schedule.Inject(TimelineViews, TimelineMonth);

(window as TemplateFunction).getResourceName = (value: ResourceDetails) => {
    return value.resourceData[value.resource.textField];
};
(window as TemplateFunction).getResourceType = (value: ResourceDetails) => {
    let className: string = value.resourceData.ClassName as string;
    if (className === 'e-child-node') {
        return 'ChildNode';
    } else {
        return 'ParentNode';
    }
};
interface TemplateFunction extends Window {
    getResourceName?: Function;
    getResourceType?: Function;
}

let scheduleOptions: ScheduleModel = {
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 4, 1),
    currentView: 'TimelineWeek',
    views: [
        { option: 'TimelineDay' },
        { option: 'TimelineWeek' },
        { displayName: '2 Weeks', option: 'TimelineWeek', interval: 2 },
        { option: 'TimelineWorkWeek' },
        { option: 'TimelineMonth' },
        { displayName: '2 Months', option: 'TimelineMonth', interval: 2 }
    ],
    group: {
        byGroupID: false,
        headerTooltipTemplate: '#tooltipTemplate',
        resources: ['Halls', 'Rooms', 'Owners']
    },
    resources: [
        {
            field: 'HallId', title: 'Hall',
            name: 'Halls', allowMultiple: false,
            dataSource: [
                { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
            ],
            textField: 'HallText', idField: 'Id', colorField: 'HallColor'
        },
        {
            field: 'RoomId', title: 'Room',
            name: 'Rooms', allowMultiple: false,
            dataSource: [
                { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
            ],
            textField: 'RoomText', idField: 'Id', colorField: 'RoomColor', expandedField: 'Expand'
        },
        {
            field: 'OwnerId', title: 'Owner',
            name: 'Owners', allowMultiple: true,
            dataSource: [
                { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
            ],
            textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
        }
    ],
    eventSettings: {
        dataSource: timelineResourceData
    }
};

let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));

let currentDate: DatePicker = new DatePicker({
    value: new Date(),
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
        if (hrefValue.indexOf('../../css/') !== -1) {
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
    scheduleObj.refresh();
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
let instance: Internationalization = new Internationalization();
let start: TimePicker = new TimePicker({
    value: new Date(2000, 0, 1, 0),
    format: 'HH:mm',
    change: (args: ChangeEventArgs) => {
        scheduleObj.startHour = instance.formatDate(args.value, { skeleton: 'Hm' });
    }
});
start.appendTo('#starthour');

let end: TimePicker = new TimePicker({
    value: new Date(2000, 0, 1, 23, 59),
    format: 'HH:mm',
    change: (args: ChangeEventArgs) => {
        scheduleObj.endHour = instance.formatDate(args.value, { skeleton: 'Hm' });
    }
});
end.appendTo('#endhour');

let workstart: TimePicker = new TimePicker({
    value: new Date(2000, 0, 1, 9),
    format: 'HH:mm',
    change: (args: ChangeEventArgs) => {
        scheduleObj.workHours.start = instance.formatDate(args.value, { skeleton: 'Hm' });
    }
});
workstart.appendTo('#workstart');

let workend: TimePicker = new TimePicker({
    value: new Date(2000, 0, 1, 18),
    format: 'HH:mm',
    change: (args: ChangeEventArgs) => {
        scheduleObj.workHours.end = instance.formatDate(args.value, { skeleton: 'Hm' });
    }
});
workend.appendTo('#workend');

let workDaysDropDown: DropDownList = new DropDownList({
    popupWidth: 180,
    change: (args: DropDownChangeArgs) => {
        scheduleObj.workDays = args.value.toString().split(',').map(Number);
        scheduleObj.dataBind();
    }
});
workDaysDropDown.appendTo('#workdays');

let dayOfWeekDropDown: DropDownList = new DropDownList({
    change: (args: DropDownChangeArgs) => {
        scheduleObj.firstDayOfWeek = parseInt(<string>args.value, 10);
        scheduleObj.dataBind();
    }
});
dayOfWeekDropDown.appendTo('#dayofweek');

document.getElementById('weekend').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('weekend') as HTMLInputElement;
    if (ddl.checked) {
        scheduleObj.showWeekend = true;
    } else {
        scheduleObj.showWeekend = false;
    }
};

let minorSlot: DropDownList = new DropDownList({
    change: (args: DropDownChangeArgs) => {
        scheduleObj.timeScale.slotCount = parseInt(args.value as string, 10);
        scheduleObj.dataBind();
    }
});
minorSlot.appendTo('#slotCount');

let majorSlotCount: DropDownList = new DropDownList({
    change: (args: DropDownChangeArgs) => {
        scheduleObj.timeScale.interval = parseInt(args.value as string, 10);
        scheduleObj.dataBind();
    }
});
majorSlotCount.appendTo('#interval');

let timeScale: DropDownList = new DropDownList({
    change: (args: DropDownChangeArgs) => {
        scheduleObj.timeScale.enable = (args.value === 'enable') ? true : false;
        scheduleObj.dataBind();
    }
});
timeScale.appendTo('#timescale');
