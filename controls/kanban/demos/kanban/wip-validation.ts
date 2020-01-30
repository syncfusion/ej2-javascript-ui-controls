import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData.slice(0, 20),
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, minCount: 5, maxCount: 10 },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 1, maxCount: 3 },
        { headerText: 'Testing', keyField: 'Testing', allowToggle: true, minCount: 1, maxCount: 5 },
        { headerText: 'Done', keyField: 'Close', allowToggle: true, minCount: 1, maxCount: 10 }
    ],
    constraintType: 'Column',
    swimlaneSettings: {
        keyField: 'Assignee',
        textField: 'AssigneeName'
    },
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
