import { enableRipple } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, TimelineViews, TimelineMonth, Resize, DragAndDrop, TimelineYear, Week, Day, WorkWeek, Month, Agenda, MonthAgenda, ActionEventArgs } from '../../../src/schedule/index';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule timeline views virtual scrolling samplez
 */
enableRipple(true);
let start: number;
let end: number;
var laystart = +new Date();  // log start timestamp
let dragstart1: any = null;
let resizestart1: any =null;
let addDelete: any = null;
Schedule.Inject(TimelineViews, TimelineMonth, Resize, DragAndDrop, TimelineYear, Week, Day, WorkWeek, Month, Agenda, MonthAgenda);
let ownerData: Object[] = generateResourceData(1, 10, 'Resource');
let eventData: Object[] = generateStaticEvents();
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
    dragStart:() => {
        resizestart1 = null;
        dragstart1 = null;
        dragstart1 = Date.now();
    },
    resizeStart:() =>  {
        dragstart1 = null;
        resizestart1 = null;
        resizestart1 = Date.now();
    },
    actionBegin: (args: ActionEventArgs) => {
        if(args.requestType == 'eventCreate' || args.requestType =='eventRemove'){
            addDelete = null;
            addDelete = Date.now();
        }
    },
    dataBinding: () => {
        var diff = layend - laystart;
        document.getElementById('layouttime').innerText = 'layout rendering time : ' + diff + 'ms';
        start = Date.now();
    },
    dataBound: () => {
        if (addDelete !== null) {
            var addDeleteend = Date.now();
            var addDeletediff = addDeleteend - addDelete;
            document.getElementById('addDeleteTime').innerText = 'Add or Delete rendering time : ' + addDeletediff + 'ms';
        }
        if (dragstart1 !== null) {
            var dragend = Date.now();
            var dragdiff = dragend - dragstart1;
            document.getElementById('dragtime').innerText = 'Drag event rendering time : ' + dragdiff + 'ms';
        }
        if (resizestart1 !== null) {
            var resizeend = Date.now();
            var resizediff = resizeend - resizestart1;
            document.getElementById('resizetime').innerText = 'resize event rendering time : ' + resizediff + 'ms';
        }
        end = Date.now();
        document.getElementById('time').innerText = 'Event rendering time : ' + (end - start) + 'ms';
        var layend = +new Date();
        var diff = layend - laystart;
        document.getElementById('layouteventtime').innerText = 'layout + event rendering time : ' + diff + 'ms';
    }
};

new Schedule(scheduleOptions, document.getElementById('schedule'));
var layend = +new Date();  // log end timestamp
var diff = layend - laystart;
document.getElementById('layouttime').innerText = 'layout rendering time : ' + diff + 'ms';
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
    for (var i = 0; i < 1; i++) {
        var startDate = start;
        var count = 1;
        for (var i_1 = 0; i_1 < 300; i_1++) {
            if (count >= 10) {
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
