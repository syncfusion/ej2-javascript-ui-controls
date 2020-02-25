import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
        { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
        { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
    ],
    swimlaneSettings: {
        showEmptyRow: false,
        allowDragAndDrop: true,
        keyField: 'Assignee',
        textField: 'AssigneeName'
    },
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id',
        selectionType: 'Multiple'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
document.addEventListener('keydown', myFunction);
//Control focus key
function myFunction(e: any): void {
    if (e.altKey && e.keyCode === 74) { // j- key code.
        document.getElementById('kanban').focus();
    }
}