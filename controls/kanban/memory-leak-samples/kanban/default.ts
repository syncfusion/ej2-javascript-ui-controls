import { Kanban, KanbanModel } from '../../src/kanban/index';
import { generateKanbanData } from '../../spec/kanban/common/kanban-data.spec';

/**
 * kanban sample
 */
let kanbanObj: Kanban;

const kanbanOptions: KanbanModel = {
    dataSource: generateKanbanData(150),
    keyField: 'Status',
    columns: [
        { headerText: 'Open', keyField: 'Open', allowToggle: true, maxCount: 6 },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 2 },
        { headerText: 'In Review', keyField: 'Review', allowToggle: true, minCount: 2 },
        { headerText: 'Completed', keyField: 'Close', allowToggle: true, minCount: 2 }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
    },
    stackedHeaders: [
        { text: 'To Do', keyFields: 'Open' },
        { text: 'Development Phase', keyFields: 'InProgress, Review' },
        { text: 'Done', keyFields: 'Close' }
    ],
    swimlaneSettings: {
        keyField: 'Assignee',
        allowDragAndDrop: true
    }
};

function renderKanban(): void {
    if (!kanbanObj) {
        kanbanObj = new Kanban(kanbanOptions);
        kanbanObj.appendTo('#kanban');
    }
}

function destroyKanban(): void {
    if (kanbanObj) {
        kanbanObj.destroy();
        kanbanObj = null;
    }
}

document.getElementById('render').addEventListener('click', renderKanban);
document.getElementById('destroy').addEventListener('click', destroyKanban);
