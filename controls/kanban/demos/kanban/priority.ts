import { Kanban  } from '../../src/kanban/index';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

    let kanbanObj: Kanban = new Kanban({ //Initialize Kanban control
        dataSource: kanbanData,
        keyField: 'Status',
        columns: [
            { headerText: 'To Do', keyField: 'Open' },
            { headerText: 'In Progress', keyField: 'InProgress' },
            { headerText: 'Testing', keyField: 'Testing' },
            { headerText: 'Done', keyField: 'Close' }
        ],
        cardSettings: {
            contentField: 'RankId',
            headerField: 'Id',
            priority: 'RankId',
			selectionType: 'Multiple'
        },
        swimlaneSettings: {
            keyField: 'Assignee',
            allowDragAndDrop: true
        }
     });
    kanbanObj.appendTo('#Kanban');      //Render initialized Kanban control
    

