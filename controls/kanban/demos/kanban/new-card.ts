import { Kanban, KanbanModel } from '../../src/kanban/index';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */
let kanbanData: Object[] = [
    {
        'Id': 1,
        'Title': 'Task 1',
        'Status': 'Open',
        'Summary': 'Analyze the new requirements gathered from the customer.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Analyze,Customer',
        'Estimate': 3.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 1,
        'Color': '#ee4e75',
        'ClassName': 'e-story, e-low, e-nancy'
    },
    {
        'Id': 2,
        'Title': 'Task 2',
        'Status': 'InProgress',
        'Summary': 'Improve application performance',
        'Type': 'Improvement',
        'Priority': 'Normal',
        'Tags': 'Improvement',
        'Estimate': 6,
        'Assignee': 'Andrew Fuller',
        'RankId': 1,
        'Color': '#57b94c',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Andrew%20Fuller.png',
        'ClassName': 'e-improvement, e-normal, e-andrew'
    },
    {
        'Id': 3,
        'Title': 'Task 3',
        'Status': 'Open',
        'Summary': 'Arrange a web meeting with the customer to get new requirements.',
        'Type': 'Others',
        'Priority': 'Critical',
        'Tags': 'Meeting',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 2,
        'Color': '#5187c6',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Janet%20Leverling.png',
        'ClassName': 'e-others, e-critical, e-janet'
    },
    {
        'Id': 4,
        'Title': 'Task 4',
        'Status': 'InProgress',
        'Summary': 'Fix the issues reported in the IE browser.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'IE',
        'Estimate': 2.5,
        'Assignee': 'Janet Leverling',
        'RankId': 2,
        'Color': '#ee4e75',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Janet%20Leverling.png',
        'ClassName': 'e-bug, e-release, e-janet'
    },
    {
        'Id': 5,
        'Title': 'Task 5',
        'Status': 'Testing',
        'Summary': 'Fix the issues reported by the customer.',
        'Type': 'Bug',
        'Priority': 'Low',
        'Tags': 'Customer',
        'Estimate': '3.5',
        'Assignee': 'Steven walker',
        'RankId': 1,
        'Color': '#ee4e75',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Steven%20walker.png',
        'ClassName': 'e-bug, e-low, e-steven'
    },
    {
        'Id': 6,
        'Title': 'Task 6',
        'Status': 'Close',
        'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
        'Type': 'Others',
        'Priority': 'Low',
        'Tags': 'Meeting',
        'Estimate': 2,
        'Assignee': 'Michael Suyama',
        'RankId': 1,
        'Color': '#5187c6',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Michael%20Suyama.png',
        'ClassName': 'e-others, e-low, e-michael'
    },
    {
        'Id': 7,
        'Title': 'Task 7',
        'Status': 'Validate',
        'Summary': 'Validate new requirements',
        'Type': 'Improvement',
        'Priority': 'Low',
        'Tags': 'Validation',
        'Estimate': 1.5,
        'Assignee': 'Robert King',
        'RankId': 1,
        'Color': '#57b94c',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Robert%20King.png',
        'ClassName': 'e-improvement, e-low, e-robert'
    },
    {
        'Id': 8,
        'Title': 'Task 8',
        'Status': 'Close',
        'Summary': 'Login page validation',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Validation,Fix',
        'Estimate': 2.5,
        'Assignee': 'Laura Callahan',
        'RankId': 2,
        'Color': '#ee4e75',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Laura%20Callahan.png',
        'ClassName': 'e-story, e-release, e-laura'
    },
    {
        'Id': 9,
        'Title': 'Task 9',
        'Status': 'Testing',
        'Summary': 'Fix the issues reported in Safari browser.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'Fix,Safari',
        'Estimate': 1.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 2,
        'Color': '#ee4e75',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Laura%20Callahan.png',
        'ClassName': 'e-bug, e-release, e-nancy'
    },
    {
        'Id': 10,
        'Title': 'Task 10',
        'Status': 'Close',
        'Summary': 'Test the application in the IE browser.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Testing,IE',
        'Estimate': 5.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 3,
        'Color': '#ee4e75',
        'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Laura%20Callahan.png',
        'ClassName': 'e-story, e-low, e-laura'
    }];
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
        headerField: 'Title',
        tagsField: 'Tags',
        grabberField: 'Color',
        footerCssField: 'ClassName'
    },
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
