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
        { headerText: 'Backlog', keyField: 'Open' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Testing', keyField: 'Testing' },
        { headerText: 'Done', keyField: 'Close' }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id'
    },
    enableTooltip: true
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');

document.getElementById('enableTooltip').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('enableTooltip') as HTMLInputElement;
    kanbanObj.enableTooltip = checkEle.checked;
    kanbanObj.dataBind();
};

document.getElementById('enableTooltipTemplate').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('enableTooltipTemplate') as HTMLInputElement;
    kanbanObj.tooltipTemplate = checkEle.checked ? '#tooltipTemp' : null;
    kanbanObj.dataBind();
};
