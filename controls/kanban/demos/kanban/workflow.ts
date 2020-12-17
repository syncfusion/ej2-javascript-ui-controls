import { Kanban, KanbanModel } from '../../src/kanban/index';
import { generateKanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: generateKanbanData(),
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open', allowDrop: false, transitionColumns: ['InProgress','Testing'] },
        { headerText: 'In Progress', keyField: 'InProgress', transitionColumns: ['Review'] },
        { headerText: 'Testing', keyField: 'Testing', transitionColumns: ['Close'] },
        { headerText: 'Done', keyField: 'Review, Close', allowDrag: false }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
