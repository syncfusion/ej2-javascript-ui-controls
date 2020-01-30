/**
 * Kanban dataSource
 */

export let kanbanData: Object[] = [
    {
        'Id': 1,
        'Status': 'Open',
        'Summary': 'Analyze the new requirements gathered from the customer.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Analyze,Customer',
        'Estimate': 3.5,
        'Assignee': 'Nancy Davloio',
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
        'Assignee': 'Michael Suyama',
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
        'Assignee': 'Margaret hamilt',
        'RankId': 3
    },
    {
        'Id': 11,
        'Status': 'Validate',
        'Summary': 'Validate the issues reported by the customer.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Validation,Fix',
        'Estimate': 1,
        'Assignee': 'Steven walker',
        'RankId': 1
    },
    {
        'Id': 12,
        'Status': 'Testing',
        'Summary': 'Check Login page validation.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Testing',
        'Estimate': 0.5,
        'Assignee': 'Michael Suyama',
        'RankId': 3
    },
    {
        'Id': 13,
        'Status': 'Open',
        'Summary': 'API improvements.',
        'Type': 'Improvement',
        'Priority': 'High',
        'Tags': 'Grid,API',
        'Estimate': 3.5,
        'Assignee': 'Robert King',
        'RankId': 3
    },
    {
        'Id': 14,
        'Status': 'InProgress',
        'Summary': 'Add responsive support to application',
        'Type': 'Epic',
        'Priority': 'Critical',
        'Tags': 'Responsive',
        'Estimate': 6,
        'Assignee': 'Laura Callahan',
        'RankId': 3
    },
    {
        'Id': 15,
        'Status': 'Open',
        'Summary': 'Show the retrieved data from the server in grid control.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Database,SQL',
        'Estimate': 5.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 4
    },
    {
        'Id': 16,
        'Status': 'InProgress',
        'Summary': 'Fix cannot open user’s default database SQL error.',
        'Priority': 'Critical',
        'Type': 'Bug',
        'Tags': 'Database,Sql2008',
        'Estimate': 2.5,
        'Assignee': 'Janet Leverling',
        'RankId': 4
    },
    {
        'Id': 17,
        'Status': 'Testing',
        'Summary': 'Fix the issues reported in data binding.',
        'Type': 'Story',
        'Priority': 'Normal',
        'Tags': 'Databinding',
        'Estimate': '3.5',
        'Assignee': 'Janet Leverling',
        'RankId': 4
    },
    {
        'Id': 18,
        'Status': 'Close',
        'Summary': 'Analyze SQL server 2008 connection.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Grid,Sql',
        'Estimate': 2,
        'Assignee': 'Andrew Fuller',
        'RankId': 4
    },
    {
        'Id': 19,
        'Status': 'Validate',
        'Summary': 'Validate databinding issues.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Validation',
        'Estimate': 1.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 1
    },
    {
        'Id': 20,
        'Status': 'Close',
        'Summary': 'Analyze grid control.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Analyze',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 5
    },
    {
        'Id': 21,
        'Status': 'Close',
        'Summary': 'Stored procedure for initial data binding of the grid.',
        'Type': 'Others',
        'Priority': 'Release Breaker',
        'Tags': 'Databinding',
        'Estimate': 1.5,
        'Assignee': 'Steven walker',
        'RankId': 6
    },
    {
        'Id': 22,
        'Status': 'Close',
        'Summary': 'Analyze stored procedures.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Procedures',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 7
    },
    {
        'Id': 23,
        'Status': 'Validate',
        'Summary': 'Validate editing issues.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Editing',
        'Estimate': 1,
        'Assignee': 'Nancy Davloio',
        'RankId': 1
    },
    {
        'Id': 24,
        'Status': 'Testing',
        'Summary': 'Test editing functionality.',
        'Type': 'Story',
        'Priority': 'Normal',
        'Tags': 'Editing,Test',
        'Estimate': 0.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 5
    },
    {
        'Id': 25,
        'Status': 'Open',
        'Summary': 'Enhance editing functionality.',
        'Type': 'Improvement',
        'Priority': 'Low',
        'Tags': 'Editing',
        'Estimate': 3.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 5
    },
    {
        'Id': 26,
        'Status': 'InProgress',
        'Summary': 'Improve the performance of the editing functionality.',
        'Type': 'Epic',
        'Priority': 'High',
        'Tags': 'Performance',
        'Estimate': 6,
        'Assignee': 'Nancy Davloio',
        'RankId': 5
    },
    {
        'Id': 27,
        'Status': 'Open',
        'Summary': 'Arrange web meeting with the customer to show editing demo.',
        'Type': 'Others',
        'Priority': 'High',
        'Tags': 'Meeting,Editing',
        'Estimate': 5.5,
        'Assignee': 'Steven walker',
        'RankId': 6
    },
    {
        'Id': 28,
        'Status': 'InProgress',
        'Summary': 'Fix editing issues reported in chrome',
        'Type': 'Bug',
        'Priority': 'Normal',
        'Tags': 'Editing,Customer',
        'Estimate': 2.5,
        'Assignee': 'Janet Leverling',
        'RankId': 6
    },
    {
        'Id': 29,
        'Status': 'Testing',
        'Summary': 'Fix the editing issues reported by the customer.',
        'Type': 'Bug',
        'Priority': 'Low',
        'Tags': 'Editing,Fix',
        'Estimate': '3.5',
        'Assignee': 'Janet Leverling',
        'RankId': 6
    },
    {
        'Id': 30,
        'Status': 'Close',
        'Summary': 'Arrange a web meeting with the customer to get editing requirements.',
        'Type': 'Others',
        'Priority': 'Critical',
        'Tags': 'Meeting,Editing',
        'Estimate': 2,
        'Assignee': 'Steven walker',
        'RankId': 8
    },
    {
        'Id': 31,
        'Status': 'Validate',
        'Summary': 'Validate editing requirements.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Validate,Editing',
        'Estimate': 1.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 1
    },
    {
        'Id': 32,
        'Status': 'Close',
        'Summary': 'Implement editing functionality.',
        'Type': 'Improvement',
        'Priority': 'Release Breaker',
        'Tags': 'Editing',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 9
    },
    {
        'Id': 33,
        'Status': 'Testing',
        'Summary': 'Fix editing issues reported in Firefox.',
        'Type': 'Bug',
        'Priority': 'Critical',
        'Tags': 'Editing,Fix',
        'Estimate': 1.5,
        'Assignee': 'Robert King',
        'RankId': 7
    },
    {
        'Id': 34,
        'Status': 'Close',
        'Summary': 'Test editing feature in the IE browser.',
        'Type': 'Story',
        'Priority': 'Normal',
        'Tags': 'Testing',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 10
    },
    {
        'Id': 35,
        'Status': 'Validate',
        'Summary': 'Validate new editing requirements.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Validation,Editing,Requirements',
        'Estimate': 1,
        'Assignee': 'Laura Callahan',
        'RankId': 1
    },
    {
        'Id': 36,
        'Status': 'Testing',
        'Summary': 'Check editing input validation.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Validation',
        'Estimate': 0.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 8
    },
    {
        'Id': 37,
        'Status': 'Close',
        'Summary': 'Add input validation for editing .',
        'Type': 'Story',
        'Priority': 'Normal',
        'Tags': 'Editing',
        'Estimate': 3.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 11
    },
    {
        'Id': 38,
        'Status': 'InProgress',
        'Summary': 'Improve filtering performance.',
        'Type': 'Improvement',
        'Priority': 'Normal',
        'Tags': 'Filtering,IE',
        'Estimate': 6,
        'Assignee': 'Nancy Davloio',
        'RankId': 7
    },
    {
        'Id': 39,
        'Status': 'Open',
        'Summary': 'Arrange a web meeting with the customer to get new filtering requirements.',
        'Type': 'Others',
        'Priority': 'Critical',
        'Tags': 'Meeting,Customer',
        'Estimate': 5.5,
        'Assignee': 'Michael Suyama',
        'RankId': 7
    },
    {
        'Id': 40,
        'Status': 'InProgress',
        'Summary': 'Fix filtering issues reported in the IE browser.',
        'Type': 'Bug',
        'Priority': 'low',
        'Tags': 'Fix,IE',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 8
    },
    {
        'Id': 41,
        'Status': 'Testing',
        'Summary': 'Fix filtering issues reported by the customer.',
        'Type': 'Bug',
        'Priority': 'Normal',
        'Tags': 'Filtering,Customer',
        'Estimate': '3.5',
        'Assignee': 'Robert King',
        'RankId': 9
    },
    {
        'Id': 42,
        'Status': 'Close',
        'Summary': 'Arrange a web meeting with the customer to show filtering demo.',
        'Type': 'Others',
        'Priority': 'Critical',
        'Tags': 'Meeting,Customer',
        'Estimate': 2,
        'Assignee': 'Andrew Fuller',
        'RankId': 12
    },
    {
        'Id': 43,
        'Status': 'Validate',
        'Summary': 'Validate filtering requirements.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Filtering,Safari',
        'Estimate': 1.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 1
    },
    {
        'Id': 44,
        'Status': 'Close',
        'Summary': 'Implement filtering feature.',
        'Type': 'Epic',
        'Priority': 'Normal',
        'Tags': 'Filtering',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 13
    },
    {
        'Id': 45,
        'Status': 'Testing',
        'Summary': 'Fix the filtering issues reported in Safari.',
        'Type': 'Bug',
        'Priority': 'High',
        'Tags': 'Filtering,Fix',
        'Estimate': 1.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 10
    },
    {
        'Id': 46,
        'Status': 'Close',
        'Summary': 'Test filtering in IE browsers.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Testing',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 14
    },
    {
        'Id': 47,
        'Status': 'Validate',
        'Summary': 'Validate filtering issues reported by the customer.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Filtering',
        'Estimate': 1,
        'Assignee': 'Nancy Davloio',
        'RankId': 1
    },
    {
        'Id': 48,
        'Status': 'Testing',
        'Summary': 'Check filtering validation.',
        'Type': 'Story',
        'Priority': 'Normal',
        'Tags': ' Validation',
        'Estimate': 0.5,
        'Assignee': 'Laura Callahan',
        'RankId': 11
    },
    {
        'Id': 49,
        'Status': 'Open',
        'Summary': 'Enhance filtering feature.',
        'Type': 'Epic',
        'Priority': 'Critical',
        'Tags': 'Improvement',
        'Estimate': 3.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 8
    },
    {
        'Id': 50,
        'Status': 'InProgress',
        'Summary': 'Improve the performance of the filtering functionality.',
        'Type': 'Improvement',
        'Priority': 'Critical',
        'Tags': 'Improvement',
        'Estimate': 6,
        'Assignee': 'Nancy Davloio',
        'RankId': 9
    },
    {
        'Id': 51,
        'Status': 'Open',
        'Summary': 'Web meeting with the customer to discuss charts.',
        'Type': 'Others',
        'Priority': 'Normal',
        'Tags': 'Meeting,Customer',
        'Estimate': 5.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 9
    },
    {
        'Id': 52,
        'Status': 'InProgress',
        'Summary': 'Fix chart rendering issue reported in the IE browser.',
        'Type': 'Bug',
        'Priority': 'Critical',
        'Tags': 'Fix,IE',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 10
    },
    {
        'Id': 53,
        'Status': 'Testing',
        'Summary': 'Fix chart issues reported by the customer.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'Chart',
        'Estimate': '3.5',
        'Assignee': 'Janet Leverling',
        'RankId': 12
    },
    {
        'Id': 54,
        'Status': 'Close',
        'Summary': 'Implement graphical representation of data using chart control.',
        'Type': 'Improvement',
        'Priority': 'Normal',
        'Tags': 'Chart',
        'Estimate': 2,
        'Assignee': 'Steven walker',
        'RankId': 15
    },
    {
        'Id': 55,
        'Status': 'Validate',
        'Summary': 'Validate data for charts.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Charts',
        'Estimate': 1.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 1
    },
    {
        'Id': 56,
        'Status': 'Close',
        'Summary': 'Web meeting with the customer to get chart requirements.',
        'Type': 'Others',
        'Priority': 'Low',
        'Tags': 'Meeting,Chart',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 16
    },
    {
        'Id': 57,
        'Status': 'Testing',
        'Summary': 'Fix chart issues reported in Firefox.',
        'Type': 'Bug',
        'Priority': 'High',
        'Tags': 'Fix,Firefox',
        'Estimate': 1.5,
        'Assignee': 'Laura Callahan',
        'RankId': 13
    },
    {
        'Id': 58,
        'Status': 'Close',
        'Summary': 'Stored procedure for grid editing feature.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Grid',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 17
    },
    {
        'Id': 59,
        'Status': 'Validate',
        'Summary': 'Validate chart issues reported by the customer.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Validation',
        'Estimate': 1,
        'Assignee': 'Michael Suyama',
        'RankId': 1
    },
    {
        'Id': 60,
        'Status': 'Testing',
        'Summary': 'Test data represention with charts.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'Testing,Chart',
        'Estimate': 0.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 14
    },
    {
        'Id': 61,
        'Status': 'Open',
        'Summary': 'Final Graphics/UI review for application.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'UI,Review',
        'Estimate': 3.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 10
    },
    {
        'Id': 62,
        'Status': 'InProgress',
        'Summary': 'Improve charts rendering time.',
        'Type': 'Improvement',
        'Priority': 'Low',
        'Tags': 'Testing,Phase2',
        'Estimate': 6,
        'Assignee': 'Laura Callahan',
        'RankId': 11
    },
    {
        'Id': 63,
        'Status': 'Open',
        'Summary': 'Add updated labels in the charts’ page.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Fix,Phase1',
        'Estimate': 5.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 11
    },
    {
        'Id': 64,
        'Status': 'Open',
        'Summary': 'Second phase testing.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Testing,Phase2',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 12
    },
    {
        'Id': 65,
        'Status': 'Testing',
        'Summary': 'Fix issues reported in the first phase.',
        'Type': 'Bug',
        'Priority': 'Release Breaker',
        'Tags': 'Fix,Phase1',
        'Estimate': '3.5',
        'Assignee': 'Robert King',
        'RankId': 15
    },
    {
        'Id': 66,
        'Status': 'Close',
        'Summary': 'Graphics/UI review for Editing page.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Review,Phase1',
        'Estimate': 2,
        'Assignee': 'Andrew Fuller',
        'RankId': 18
    },
    {
        'Id': 67,
        'Status': 'Validate',
        'Summary': 'Validate issues reported in the first phase.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Validation',
        'Estimate': 1.5,
        'Assignee': 'Michael Suyama',
        'RankId': 11
    },
    {
        'Id': 68,
        'Status': 'Close',
        'Summary': 'First phase testing.',
        'Type': 'Story',
        'Priority': 'Critical',
        'Tags': 'Testing,Phase1',
        'Estimate': 2.5,
        'Assignee': 'Margaret hamilt',
        'RankId': 19
    },
    {
        'Id': 69,
        'Status': 'Open',
        'Summary': 'Prepare test cases for all pages.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'TestCase',
        'Estimate': 1.5,
        'Assignee': 'Andrew Fuller',
        'RankId': 13
    },
    {
        'Id': 70,
        'Status': 'InProgress',
        'Summary': 'Prepare consolidated stored procedures.',
        'Type': 'Others',
        'Priority': 'High',
        'Tags': 'Grid',
        'Estimate': 5.5,
        'Assignee': 'Janet Leverling',
        'RankId': 12
    },
    {
        'Id': 71,
        'Status': 'Close',
        'Summary': 'Optimize code in the grid editing page.',
        'Type': 'Improvement',
        'Priority': 'Critical',
        'Tags': 'Optimization',
        'Estimate': 1,
        'Assignee': 'Nancy Davloio',
        'RankId': 20
    },
    {
        'Id': 72,
        'Status': 'InProgress',
        'Summary': 'Optimize code in the grid filtering page.',
        'Type': 'Story',
        'Priority': 'High',
        'Tags': 'Optimization',
        'Estimate': 0.5,
        'Assignee': 'Michael Suyama',
        'RankId': 13
    },
    {
        'Id': 73,
        'Status': 'Close',
        'Summary': 'Graphics/UI review for the charts’ page.',
        'Type': 'Story',
        'Priority': 'Low',
        'Tags': 'UI,Review',
        'Estimate': 5.5,
        'Assignee': 'Robert King',
        'RankId': 21
    },
    {
        'Id': 74,
        'Status': 'Open',
        'Summary': 'Optimize code in the charts’ page.',
        'Type': 'Improvement',
        'Priority': 'High',
        'Tags': 'Optimization',
        'Estimate': 7,
        'Assignee': 'Nancy Davloio',
        'RankId': 14
    },
    {
        'Id': 75,
        'Status': 'Close',
        'Summary': 'Check test cases.',
        'Type': 'Story',
        'Priority': 'Release Breaker',
        'Tags': 'Testing',
        'Estimate': 0.5,
        'Assignee': 'Nancy Davloio',
        'RankId': 22
    }
];

export function generateKanbanData(count: number = 100): Object[] {
    let kanbanData: Object[] = [];
    let names: string[] = [
        'Analyze the new requirements gathered from the customer', 'Improve application performance',
        'Arrange a web meeting with the customer to get new requirements', 'Fix the issues reported in the IE browser',
        'Fix the issues reported by the customer', 'Validate new requirements', 'API improvements',
        'Arrange a web meeting with the customer to get the login page requirements', 'Test the application in the IE browser',
        'Add responsive support to application'
    ];
    let assignee: string[] = ['Alice', 'Janet', 'Laura', 'Micheal', 'Milan', 'Nancy', 'Paul', 'Robert', 'Robson', 'Steven'];
    let keys: string[] = ['Open', 'InProgress', 'Review', 'Testing', 'Close'];
    let priority: string[] = ['Release Breaker', 'Ultra-Critical', 'Critical', 'High', 'Normal', 'Low'];
    let types: string[] = ['EPIC', 'Story', 'Bug', 'Improvement'];
    for (let a: number = 0, id: number = 0; a < count; a++) {
        kanbanData.push({
            Id: ++id,
            Summary: names[Math.floor(Math.random() * names.length)],
            Status: keys[Math.floor(Math.random() * keys.length)],
            Priority: priority[Math.floor(Math.random() * priority.length)],
            Type: types[Math.floor(Math.random() * types.length)],
            Assignee: assignee[Math.floor(Math.random() * assignee.length)],
            Estimate: parseFloat((Math.random() * (9 - 0)).toFixed(3).slice(0, -1))
        });
    }
    return kanbanData;
}
