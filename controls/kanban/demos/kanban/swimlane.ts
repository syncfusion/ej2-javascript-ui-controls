import { Kanban, KanbanModel } from '../../src/kanban/index';
import { ChangeEventArgs, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';
import { SortDirection } from '../../src/kanban/base/type';
import '../../node_modules/es6-promise/dist/es6-promise';
/**
 * kanban sample
 */
let kanbanData: Object[] = [
    {
        'Id': 1,
        'Status': 'Open',
        'Summary': 'Analyze the new requirements gathered from the customer.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Analyze,Customer',
        'Estimate': 3.5,
        'Assignee': 'Andrew Fuller',
        'AssigneeName': 'Andrew',
        'RankId': 1
    },
    {
        'Id': 2,
        'Status': 'InProgress',
        'Summary': 'Improve application performance',
        'Type': 'Improvement',
        'Priority': 'Normal',
        'Tags': 'Improvement',
        'Estimate': 6,
        'Assignee': 'Andrew Fuller',
        'AssigneeName': 'Andrew',
        'RankId': 1
    },
    {
        'Id': 3,
        'Status': 'Open',
        'Summary': 'Arrange a web meeting with the customer to get new requirements.',
        'Type': 'Others',
        'Priority': 'Critical',
        'Tags': 'Meeting',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'AssigneeName': 'Janet',
        'RankId': 2
    },
    {
        'Id': 4,
        'Status': 'InProgress',
        'Summary': 'Fix the issues reported in the IE browser.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'IE',
        'Estimate': 2.5,
        'Assignee': 'Janet Leverling',
        'AssigneeName': 'Janet',
        'RankId': 2
    },
    {
        'Id': 5,
        'Status': 'Testing',
        'Summary': 'Fix the issues reported by the customer.',
        'Type': 'Bug',
        'Priority': 'Low',
        'Tags': 'Customer',
        'Estimate': '3.5',
        'Assignee': 'Steven walker',
        'AssigneeName': 'Steven',
        'RankId': 1
    },
    {
        'Id': 6,
        'Status': 'Close',
        'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
        'Type': 'Others',
        'Priority': 'Low',
        'Tags': 'Meeting',
        'Estimate': 2,
        'Assignee': 'Andrew Fuller',
        'AssigneeName': 'Andrew',
        'RankId': 1
    },
    {
        'Id': 7,
        'Status': 'Validate',
        'Summary': 'Validate new requirements',
        'Type': 'Improvement',
        'Priority': 'Low',
        'Tags': 'Validation',
        'Estimate': 1.5,
        'Assignee': 'Robert King',
        'AssigneeName': 'Robert',
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
        'Assignee': 'Janet Leverling',
        'AssigneeName': 'Janet',
        'RankId': 2
    },
    {
        'Id': 9,
        'Status': 'Testing',
        'Summary': 'Fix the issues reported in Safari browser.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'Fix,Safari',
        'Estimate': 1.5,
        'Assignee': 'Nancy Davloio',
        'AssigneeName': 'Nancy',
        'RankId': 2
    },
    {
        'Id': 10,
        'Status': 'Close',
        'Summary': 'Test the application in the IE browser.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Testing,IE',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'AssigneeName': 'Janet',
        'RankId': 3
    }];

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open, Review' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Done', keyField: 'Close' }
    ],
    swimlaneSettings: {
        keyField: 'Assignee',
        textField: 'AssigneeName'
    },
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
new CheckBox({ checked: false, change: onChange }, '#acrossDragAndDrop');
new CheckBox({ checked: false, change: onChange }, '#emptyRow');
new CheckBox({ checked: true, change: onChange }, '#itemCount');
//Initialize DropDownList control
let sortOrder: DropDownList = new DropDownList({
    width: '100%',
    change: changeSortOrder
});
//Render initialized DropDownList control
sortOrder.appendTo('#sort');
function onChange(args: ChangeEventArgs): void {
    let value: string = this.element.id;
    switch (value) {
        case 'acrossDragAndDrop':
            kanbanObj.swimlaneSettings.allowDragAndDrop = args.checked;
            break;
        case 'emptyRow':
            kanbanObj.swimlaneSettings.showEmptyRow = args.checked;
            break;
        case 'itemCount':
            kanbanObj.swimlaneSettings.showItemCount = args.checked;
            break;
        default:
            break;
    }
}
function changeSortOrder(args: DropDownChangeArgs): void {
    let sortDirection: SortDirection = args.itemData.value as SortDirection;
    kanbanObj.swimlaneSettings.sortDirection = sortDirection;
}