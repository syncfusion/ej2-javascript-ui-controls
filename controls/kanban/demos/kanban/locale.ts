import { Kanban, KanbanModel } from '../../src/kanban/index';
import { L10n, setCulture, enableRtl} from '@syncfusion/ej2-base';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

L10n.load({
    'de': {
        'kanban': {
            'items': 'Artikel',
            'min': 'Min',
            'max': 'Max'
        }
    },
    'ar': {
        'kanban': {
            'items': 'العناصر',
            'min': 'أنا',
            'max': 'ماكس'
        }
    },
    'zh': {
        'kanban': {
            'items': '项目',
            'min': '我',
            'max': '最高'
        }
    },
    'en-US': {
        'kanban': {
            'items': 'items',
            'min': 'Min',
            'max': 'Max'
        }
    }
});


/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    locale: 'de',
    columns: [
        { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, showItemCount: true, minCount: 15, maxCount: 20 },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showItemCount: true, maxCount: 15 },
        { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showItemCount: true },
        { headerText: 'Done', keyField: 'Close', allowToggle: true, showItemCount: true, minCount: 1, maxCount: 10 }
    ],
    swimlaneSettings: {
        keyField: 'Assignee'
    },
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#Kanban');

document.getElementById('cultures').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('cultures') as HTMLSelectElement;
    let value: string = ddl.value;
    enableRtl(value === 'ar');
    setCulture(value);
};
