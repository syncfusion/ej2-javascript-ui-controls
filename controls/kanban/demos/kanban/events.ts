import { Kanban, KanbanModel, CardRenderedEventArgs, CardClickEventArgs, QueryCellInfoEventArgs } from '../../src/kanban/index';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    height: 500,
    columns: [
        { headerText: 'To Do', keyField: 'Open', allowToggle: true },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
        { headerText: 'Done', keyField: 'Close', allowToggle: true }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
    },
    swimlaneSettings: {
        keyField: 'Assignee'
    },
    created: OnCreate,
    actionBegin: OnActionBegin,
    actionComplete: OnActionComplete,
    actionFailure: OnActionFailure,
    dataBinding: OnDataBinding,
    dataBound: OnDataBound,
    cardRendered: OnCardRendered,
    queryCellInfo: onQueryCellInfo,
    cardClick: OnCardClick,
    cardDoubleClick: OnCardDoubleClick,
    dragStart: OnDragStart,
    drag: OnDrag,
    dragStop: OnDragStop

};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#Kanban');
document.getElementById('clear').onclick = () => {
    document.getElementById('EventLog').innerHTML = '';
};
function OnCreate(): void {
    appendElement('Kanban <b>Load</b> event called<hr>');
}
function OnActionBegin(): void {
    appendElement('Kanban <b>Action Begin</b> event called<hr>');
}
function OnActionComplete(): void {
    appendElement('Kanban <b>Action Complete</b> event called<hr>');
}
function OnActionFailure(): void {
    appendElement('Kanban <b>Action Failure</b> event called<hr>');
}
function OnDataBinding(): void {
    appendElement('Kanban <b>Data Binding</b> event called<hr>');
}
function OnDataBound(): void {
    appendElement('Kanban <b>Data Bound</b> event called<hr>');
}
function OnCardRendered(args: CardRenderedEventArgs): void {
    appendElement('Kanban Card ' + (args.data as { [key: string]: Object }).Id + ' - Rendered event called<hr>');
}
function onQueryCellInfo(args: QueryCellInfoEventArgs): void {
    appendElement('Kanban <b>Column Rendered</b> event called<hr>');
}
function OnCardClick(args: CardClickEventArgs): void {
    appendElement('Kanban <b>Card ' + (args.data as { [key: string]: Object }).Id + ' Click</b> event called<hr>');
}
function OnCardDoubleClick(args: CardClickEventArgs): void {
    appendElement('Kanban <b>Card ' + (args.data as { [key: string]: Object }).Id + ' Double Click</b> event called<hr>');
}
function OnDragStart(): void {
    appendElement('Kanban <b>Drag Start</b> event called<hr>');
}
function OnDrag(): void {
    appendElement('Kanban <b>Drag</b> event called<hr>');
}
function OnDragStop(): void {
    appendElement('Kanban <b>Drag Stop</b> event called<hr>');
}
function appendElement(html: string): void {
    let span: HTMLElement = document.createElement('span');
    span.innerHTML = html;
    let log: HTMLElement = document.getElementById('EventLog');
    log.insertBefore(span, log.firstChild);
}
