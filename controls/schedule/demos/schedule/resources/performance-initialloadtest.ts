import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, ActionEventArgs
} from '../../../src/schedule/index';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule resources group performance sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth);

let ownerData: Object[] = generateResourceData(1, 50, 'Resource');
let eventData: Object[] = generateStaticEvents();


// tslint:disable:no-console
console.time('init');
let scheduleOptions: ScheduleModel = {
    height: '550px', width: '100%',
    currentView: 'TimelineMonth',
    views: [
        { option: 'Day' },
        { option: 'Week' },
        { option: 'WorkWeek' },
        { option: 'Month' },
        { displayName: 'Agenda', option: 'Agenda' },
        { option: 'TimelineDay' },
        { option: 'TimelineWeek' },
        { option: 'TimelineWorkWeek' },
        { option: 'TimelineMonth' },
    ],
    group: {
        byGroupID: false,
        resources: ['Owners']
    },
    resources: [
        {
            field: 'OwnerId', title: 'Owner',
            name: 'Owners', allowMultiple: true,
            dataSource: ownerData,
            textField: 'Text', idField: 'Id', colorField: 'Color'
        }
    ],
    selectedDate: new Date(2017, 9, 29),
    eventSettings: { dataSource: eventData },
    actionBegin: (e: ActionEventArgs) => {
        if (e.requestType === 'dateNavigate' || e.requestType === 'viewNavigate') {
            console.time('init');
            console.time('navigate');
        }
    },
    actionComplete: (e: ActionEventArgs) => {
        if (e.requestType === 'dateNavigate' || e.requestType === 'viewNavigate') {
            console.timeEnd('navigate');
        }
    },
    dataBinding: () => {
        console.time('events render');
    },
    dataBound: () => {
        console.timeEnd('events render');
        console.timeEnd('init');
    }
};
let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('schedule'));
function generateStaticEvents() {
    var data = [];
    var names = [
        'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
        'Farewell Celebration', 'Wedding Aniversary', 'Alaska: The Last Frontier', 'Deadest Catch', 'Sports Day',
        'MoonShiners', 'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice',
        'Rugby Match', 'Guitar Class', 'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
    ];
    var start = new Date(2017, 9, 22);
    var id = 1;
    for (var i = 0; i < 5; i++) {
        var startDate = start;
        var count = 1;
        for (var i_1 = 0; i_1 < 300; i_1++) {
            if (count >= 50) {
                count = 1;
            }
            var endDate = new Date(startDate.getTime() + (60000 * 30));
            var nCount = Math.floor(Math.random() * names.length);
            data.push({
                Id: id,
                Subject: names[nCount],
                StartTime: startDate,
                EndTime: endDate,
                OwnerId: count++
            });
            startDate = new Date(startDate.getTime() + (60000 * 30));
            id++;
        }
        start = new Date(start.getTime() + (60000 * 10));
    }
    return data;
}

function generateResourceData(startId: number, endId: number, text: string): Object[] {
    let data: { [key: string]: Object }[] = [];
    let colors: string[] = [
        '#ff8787', '#9775fa', '#748ffc', '#3bc9db', '#69db7c',
        '#fdd835', '#748ffc', '#9775fa', '#df5286', '#7fa900',
        '#fec200', '#5978ee', '#00bdae', '#ea80fc'
    ];
    for (let a: number = startId; a <= endId; a++) {
        let n: number = Math.floor(Math.random() * colors.length);
        data.push({
            Id: a,
            Text: text + ' ' + a,
            Color: colors[n]
        });
    }
    return data;
}
