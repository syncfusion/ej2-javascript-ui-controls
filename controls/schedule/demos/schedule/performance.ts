import { Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda } from '../../src/schedule/index';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule default performance analysis sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);

let start: number;
let end: number;

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    currentView: 'Week',
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
    eventSettings: { dataSource: generateStaticEvents(6) },
    dataBinding: () => { start = Date.now(); },
    dataBound: () => {
        end = Date.now();
        document.getElementById('time').innerText = 'Events rendering time : ' + (end - start) + 'ms';
    }
});
scheduleObj.appendTo('#schedule');

function generateStaticEvents(overlapCount: number): Object[] {
    let data: Object[] = [];
    let names: string[] = [
        'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
        'Farewell Celebration', 'Wedding Aniversary', 'Alaska: The Last Frontier', 'Deadest Catch', 'Sports Day',
        'MoonShiners', 'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice',
        'Rugby Match', 'Guitar Class', 'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
    ];
    let start: Date = new Date(2017, 9, 29);
    let id: number = 1;
    for (let i: number = 0; i < overlapCount; i++) {
        let startDate: Date = start;
        for (let i: number = 0; i < 7 * 48; i++) {
            let endDate: Date = new Date(startDate.getTime() + (60000 * 30));
            let nCount: number = Math.floor(Math.random() * names.length);
            data.push({
                Id: id,
                Subject: names[nCount],
                StartTime: startDate,
                EndTime: endDate
            });
            startDate = new Date(startDate.getTime() + (60000 * 30));
            id++;
        }
        start = new Date(start.getTime() + (60000 * 10));
    }
    return data;
}

function generateEvents(): Object[] {
    let data: Object[] = [];
    let start: Date = new Date(2017, 9, 29);
    for (let i: number = 0; i < 8000; i++) {
        data.push({
            Id: i + 1,
            Subject: (i + 1).toString(),
            StartTime: new Date(start.getTime() + ((i) * (1000 * 60))),
            EndTime: new Date(start.getTime() + (((i) + 30) * (1000 * 60)))
        });
    }
    return data;
}
