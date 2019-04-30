import { enableRipple } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, TimelineViews, TimelineMonth, Resize, DragAndDrop } from '../../../src/schedule/index';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule timeline views virtual scrolling sample
 */
enableRipple(true);
Schedule.Inject(TimelineViews, TimelineMonth, Resize, DragAndDrop);
let ownerData: Object[] = generateResourceData(1, 300, 'Resource');
let eventData: Object[] = generateStaticEvents(new Date(2018, 4, 1), 300, 4);
let scheduleOptions: ScheduleModel = {
    height: '550px', width: '100%',
    currentView: 'TimelineMonth',
    views: [
        { option: 'TimelineDay' },
        { option: 'TimelineWeek', allowVirtualScrolling: true },
        { option: 'TimelineMonth', allowVirtualScrolling: true }
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
    selectedDate: new Date(2018, 4, 1),
    eventSettings: { dataSource: eventData }
};

new Schedule(scheduleOptions, document.getElementById('schedule'));

function generateStaticEvents(start: Date, resCount: number, overlapCount: number): Object[] {
    let data: Object[] = [];
    let id: number = 1;
    for (let i: number = 0; i < resCount; i++) {
        let randomCollection: number[] = [];
        let random: number = 0;
        for (let j: number = 0; j < overlapCount; j++) {
            random = Math.floor(Math.random() * (15));
            random = (random === 0) ? 1 : random;
            if (randomCollection.indexOf(random) !== -1) {
                random += (Math.max.apply(null, randomCollection) + 10);
            }
            randomCollection.push(random);
            let startDate: Date = new Date(start.getFullYear(), start.getMonth(), random);
            startDate = new Date(startDate.getTime() + (((random % 10) * 10) * (1000 * 60)));
            let endDate: Date = new Date(startDate.getTime() + (30 * (1000 * 60)));
            data.push({
                Id: id,
                Subject: 'Event #' + id,
                StartTime: startDate,
                EndTime: endDate,
                IsAllDay: (id % 10) ? false : true,
                OwnerId: i + 1
            });
            id++;
        }
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
