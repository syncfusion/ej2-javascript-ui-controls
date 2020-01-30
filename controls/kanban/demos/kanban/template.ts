import { Kanban, KanbanModel } from '../../src/kanban/index';
import { generateKanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban template sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: generateKanbanData(500),
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open', template: '#headtemplate' },
        { headerText: 'In Progress', keyField: 'InProgress', template: '#headtemplate' },
        { headerText: 'Testing', keyField: 'Testing', template: '#headtemplate' },
        { headerText: 'Done', keyField: 'Close', template: '#headtemplate' }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
        template: '#cardtemplate'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
