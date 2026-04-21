import { Schedule, Day, Week, Month, TimelineViews } from '../src/schedule/index';

Schedule.Inject(Day, Week, Month, TimelineViews);
(window as TemplateFunction).getMonthCellText = (date: Date) => {
    if (date.getMonth() === 10 && date.getDate() === 23) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
    } else if (date.getMonth() === 11 && date.getDate() === 9) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/get-together.svg" />';
    } else if (date.getMonth() === 11 && date.getDate() === 13) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
    } else if (date.getMonth() === 11 && date.getDate() === 22) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/thanksgiving-day.svg" />';
    } else if (date.getMonth() === 11 && date.getDate() === 24) {
        return '<img src="https://ej2.syncfusion.com/demos/src/schedule/images/christmas-eve.svg" />';
    } else if (date.getMonth() === 11 && date.getDate() === 25) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/christmas.svg" />';
    } else if (date.getMonth() === 0 && date.getDate() === 1) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg" />';
    } else if (date.getMonth() === 0 && date.getDate() === 14) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
    }
    return '';
};
(window as TemplateFunction).getWorkCellText = (date: Date) => {
    let weekEnds: number[] = [0, 6];
    if (weekEnds.indexOf(date.getDay()) >= 0) {
        return "<img src='https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg' />";
    }
    return '';
};

interface TemplateFunction extends Window {
    getWorkCellText?: Function;
    getMonthCellText?: Function;
}

let scheduleObj: Schedule;

document.getElementById('render').addEventListener('click', renderSchedule);
document.getElementById('destroy').addEventListener('click', destorySchedule);

function renderSchedule(): void {
    scheduleObj = new Schedule({
        width: '100%',
        height: '550px',
        views: ['Day', 'Week', 'TimelineWeek', 'Month'],
        cssClass: 'schedule-cell-template',
        cellTemplate: '${if(type === "workCells")}<div class="templatewrap">${getWorkCellText(data.date)}</div>' +
            '${/if}${if(type === "monthCells")}<div class="templatewrap">${getMonthCellText(data.date)}</div>${/if}',
        selectedDate: new Date(2017, 11, 16)
    });
    scheduleObj.appendTo('#schedule');
}

function destorySchedule(): void {
    if (scheduleObj) {
        scheduleObj.destroy();
        scheduleObj = null;
    }
}
