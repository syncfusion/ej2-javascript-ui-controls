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
       { headerText: 'Backlog', keyField: 'Open', template: '#headtemplate' },
        { headerText: 'In Progress', keyField: 'InProgress', template: '#headtemplate' },
        { headerText: 'Testing', keyField: 'Testing', template: '#headtemplate' },
        { headerText: 'Done', keyField: 'Close', template: '#headtemplate' }
    ],
    swimlaneSettings: {
        keyField: 'Assignee',
        template: '#swimlaneTemplate',
        showItemCount: false
    },
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
