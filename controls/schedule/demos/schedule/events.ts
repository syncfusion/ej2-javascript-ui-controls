import { Schedule, Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Agenda, MonthAgenda } from '../../src/schedule/index';
import { sampleData } from '../../spec/schedule/base/datasource.spec';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2018, 1, 15),
    firstDayOfWeek: 1,
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda', 'TimelineDay',
        'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
    eventSettings: { dataSource: sampleData},
    cellClick: OnCellClick,
    cellDoubleClick: OnCellDoubleClick,
    select: Onselect,
    navigating: OnNavigating,
    eventClick: OnEventClick,
    popupOpen: OnPopupOpen,
    created: OnCreate,
    actionBegin: OnActionBegin,
    actionComplete: OnActionComplete,
    actionFailure: OnActionFailure,
    destroyed: onDestroyed
});
scheduleObj.appendTo('#schedule');

let btn: Button = new Button();
btn.appendTo('#clear');
document.getElementById('clear').onclick = () => {
    document.getElementById('EventLog').innerHTML = '';
};

function OnCellDoubleClick(): void {
    appendElement('SChedule <b>Cell Double Click</b> event called<hr>');
}
function OnCellClick(): void {
    appendElement('Schedule <b>Cell Click</b> event called<hr>');
}
function OnNavigating(): void {
    appendElement('Schedule <b>Navigating</b> event called<hr>');
}
function OnEventClick(): void {
    appendElement('Schedule <b>Event Click</b> event called<hr>');
}
function OnPopupOpen(): void {
    appendElement('Schedule <b>Popup Open</b> event called<hr>');
}
function Onselect(): void {
    appendElement('Schedule <b>select</b> event called<hr>');
}
function OnCreate(): void {
    appendElement('Schedule <b>created</b> event called<hr>');
}
function OnActionBegin(): void {
    appendElement('Schedule <b>actionBegin</b> event called<hr>');
}
function OnActionComplete(): void {
    appendElement('Schedule <b>actionComplete</b> event called<hr>');
}
function OnActionFailure(): void {
    appendElement('Schedule <b>actionComplete</b> event called<hr>');
}
function onDestroyed(): void {
    appendElement('Schedule <b>destroyed</b> event called<hr>');
}
function appendElement(html: string): void {
    let span: HTMLElement = document.createElement('span');
    span.innerHTML = html;
    let log: HTMLElement = document.getElementById('EventLog');
    log.insertBefore(span, log.firstChild);
}