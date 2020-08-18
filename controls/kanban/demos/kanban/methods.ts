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
        { headerText: 'Backlog', keyField: 'Open', showAddButton: true },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Testing', keyField: 'Testing', showAddButton: true },
        { headerText: 'Done', keyField: 'Close' }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
document.getElementById('addSingleCard').onclick = (e: Event): void => {
    let curData: Object = {
        Id: 111, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 111'
    };
    kanbanObj.addCard(curData);
};
document.getElementById('addMultipleCards').onclick = (e: Event): void => {
    let curData: Object[] = [{
        Id: 112, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 112'
    }, {Id: 113, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 113'}];
    kanbanObj.addCard(curData);
};
document.getElementById('updateSingleCard').onclick = (e: Event): void => {
    let curData: Object = {
        Id: 2, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 2'
    };
    kanbanObj.updateCard(curData);
};
document.getElementById('updateMultipleCards').onclick = (e: Event): void => {
    let curData: Object[] = [{
        Id: 1, Status: 'InProgress', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 1'
    }, {Id: 3, Status: 'InProgress', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 3'}];
    kanbanObj.updateCard(curData);
};
document.getElementById('deleteCardIdNumber').onclick = (e: Event): void => {
    kanbanObj.deleteCard(13);
};
document.getElementById('deleteSingleCard').onclick = (e: Event): void => {
    let curData: object = {
        'Id': 9,
        'Status': 'Testing',
        'Summary': 'Fix the issues reported in Safari browser.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'Fix,Safari',
        'Estimate': 1.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 2
    };
    kanbanObj.deleteCard(curData);
};
document.getElementById('deleteMultipleCards').onclick = (e: Event): void => {
    let curData: object[] = [
        {
            'Id': 6,
            'Status': 'Close',
            'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
            'Type': 'Others',
            'Priority': 'Low',
            'Tags': 'Meeting',
            'Estimate': 2,
            'Assignee': 'Michael Suyama',
            'RankId': 1
        },
        {
            'Id': 8,
            'Status': 'Close',
            'Summary': 'Login page validation',
            'Type': 'Story',
            'Priority': 'Release Breaker',
            'Tags': 'Validation,Fix',
            'Estimate': 2.5,
            'Assignee': 'Laura Callahan',
            'RankId': 2
        }
    ];
    kanbanObj.deleteCard(curData);
};
document.getElementById('openAddDialog').onclick = (e: Event): void => {
    let curData: object = {
        Id: 1111, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: ''
    };
    kanbanObj.openDialog('Add', curData);
};

document.getElementById('openEditDialog').onclick = (e: Event): void => {
    let curData: object = {
        'Id': 12,
        'Status': 'Testing',
        'Summary': 'Check Login page validation.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Testing',
        'Estimate': 0.5,
        'Assignee': 'Michael Suyama',
        'RankId': 3
    };
    kanbanObj.openDialog('Edit', curData);
};