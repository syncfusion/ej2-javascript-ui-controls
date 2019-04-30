/**
 * Test cases data source
 */
export let sampleData: Object[] = [
    {
        taskID: 1,
        taskName: 'Planning',
        startDate: new Date('02/03/2017'),
        endDate: new Date('02/07/2017'),
        progress: 100,
        duration: 5,
        priority: 'Normal',
        approved: false,
        isInExpandState: true,
        subtasks: [
            { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false },
            { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, approved: true },
            { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false },
            { taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'), endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true }
        ]
    },
    {
        taskID: 6,
        taskName: 'Design',
        startDate: new Date('02/10/2017'),
        endDate: new Date('02/14/2017'),
        duration: 3,
        progress: 86,
        priority: 'High',
        isInExpandState: false,
        approved: false,
        subtasks: [
            { taskID: 7, taskName: 'Software Specification', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 60, priority: 'Normal', approved: false },
            { taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 100, priority: 'Critical', approved: false },
            { taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
            { taskID: 10, taskName: 'Design Documentation', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
            { taskID: 11, taskName: 'Design complete', startDate: new Date('02/14/2017'), endDate: new Date('02/14/2017'), duration: 0, progress: 0, priority: 'Normal', approved: true }
        ]
    },
    {
        taskID: 12,
        taskName: 'Implementation Phase',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'Normal',
        approved: false,
        duration: 11,
        subtasks: [
            {
                taskID: 13,
                taskName: 'Phase 1',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/27/2017'),
                priority: 'High',
                approved: false,
                isInExpandState: false,
                duration: 11,
                subtasks: [{
                    taskID: 14,
                    taskName: 'Implementation Module 1',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'Normal',
                    duration: 11,
                    approved: false,
                    subtasks: [
                        { taskID: 15, taskName: 'Development Task 1', startDate: new Date('02/17/2017'), endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'High', approved: false },
                        { taskID: 16, taskName: 'Development Task 2', startDate: new Date('02/17/2017'), endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Low', approved: true },
                        { taskID: 17, taskName: 'Testing', startDate: new Date('02/20/2017'), endDate: new Date('02/21/2017'), duration: 2, progress: '0', priority: 'Normal', approved: true },
                        { taskID: 18, taskName: 'Bug fix', startDate: new Date('02/24/2017'), endDate: new Date('02/25/2017'), duration: 2, progress: '0', priority: 'Critical', approved: false },
                        { taskID: 19, taskName: 'Customer review meeting', startDate: new Date('02/26/2017'), endDate: new Date('02/27/2017'), duration: 2, progress: '0', priority: 'High', approved: false },
                        { taskID: 20, taskName: 'Phase 1 complete', startDate: new Date('02/27/2017'), endDate: new Date('02/27/2017'), duration: 0, priority: 'Low', approved: true }

                    ]
                }]
            },
            {
                taskID: 21,
                taskName: 'Phase 2',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/28/2017'),
                priority: 'High',
                approved: false,
                duration: 12,
                subtasks: [{
                    taskID: 22,
                    taskName: 'Implementation Module 2',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/28/2017'),
                    priority: 'Critical',
                    approved: false,
                    duration: 12,
                    subtasks: [
                        { taskID: 23, taskName: 'Development Task 1', startDate: new Date('02/17/2017'), endDate: new Date('02/20/2017'), duration: 4, progress: '50', priority: 'Normal', approved: true },
                        { taskID: 24, taskName: 'Development Task 2', startDate: new Date('02/17/2017'), endDate: new Date('02/20/2017'), duration: 4, progress: '50', priority: 'Critical', approved: true },
                        { taskID: 25, taskName: 'Testing', startDate: new Date('02/21/2017'), endDate: new Date('02/24/2017'), duration: 2, progress: '0', priority: 'High', approved: false },
                        { taskID: 26, taskName: 'Bug fix', startDate: new Date('02/25/2017'), endDate: new Date('02/26/2017'), duration: 2, progress: '0', priority: 'Low', approved: false },
                        { taskID: 27, taskName: 'Customer review meeting', startDate: new Date('02/27/2017'), endDate: new Date('02/28/2017'), duration: 2, progress: '0', priority: 'Critical', approved: true },
                        { taskID: 28, taskName: 'Phase 2 complete', startDate: new Date('02/28/2017'), endDate: new Date('02/28/2017'), duration: 0, priority: 'Normal', approved: false }

                    ]
                }]
            },

            {
                taskID: 29,
                taskName: 'Phase 3',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/27/2017'),
                priority: 'Normal',
                approved: false,
                duration: 11,
                subtasks: [{
                    taskID: 30,
                    taskName: 'Implementation Module 3',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 11,
                    subtasks: [
                        { taskID: 31, taskName: 'Development Task 1', startDate: new Date('02/17/2017'), endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Low', approved: true },
                        { taskID: 32, taskName: 'Development Task 2', startDate: new Date('02/17/2017'), endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Normal', approved: false },
                        { taskID: 33, taskName: 'Testing', startDate: new Date('02/20/2017'), endDate: new Date('02/21/2017'), duration: 2, progress: '0', priority: 'Critical', approved: true },
                        { taskID: 34, taskName: 'Bug fix', startDate: new Date('02/24/2017'), endDate: new Date('02/25/2017'), duration: 2, progress: '0', priority: 'High', approved: false },
                        { taskID: 35, taskName: 'Customer review meeting', startDate: new Date('02/26/2017'), endDate: new Date('02/27/2017'), duration: 2, progress: '0', priority: 'Normal', approved: true },
                        { taskID: 36, taskName: 'Phase 3 complete', startDate: new Date('02/27/2017'), endDate: new Date('02/27/2017'), duration: 0, priority: 'Critical', approved: false },
                    ]
                }]
            }
        ]
    }
];
    export let projectData: Object[] = [{
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40'
    },
    {
        'TaskID': 2,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40',
        'parentID': 1
    },
    {
        'TaskID': 3,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '30'
    },
    {
        'TaskID': 4,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '60',
        'parentID': 3
    },
    ];

    export let selfReferenceData: Object[] = [{
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40',
        'parentID': null
    },
    {
        'TaskID': 2,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40',
        'parentID': 1
    },
    {
        'TaskID': 3,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '30',
        'parentID': null
    },
    {
        'TaskID': 4,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '60',
        'parentID': 3
    },
    ];
    
     export let projectDatas: Object[] = [{
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40',
        'isParent': true
    },
    {
        'TaskID': 2,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '40',
        'parentID': 1
    },
    {
        'TaskID': 3,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '30',
        'isParent': true
    },
    {
        'TaskID': 4,
        'TaskName': 'Child Task 1',
        'StartDate': new Date('02/23/2014'),
        'EndDate': new Date('02/27/2014'),
        'Progress': '60',
        'parentID': 3
    },
    ];
    export let treeMappedData: Object[] = [
        {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false,
            'index': 0,
            'hasChildRecords': true,
            'expanded': true,
            'level': 0,
            'uniqueID': "Grid_data_0",
            'childRecords' : [
                {
                    'taskID': 2,
                    'taskName': 'Plan timeline',
                    'startDate': '2017-02-02T18:30:00.000Z',
                    'endDate': '2017-02-06T18:30:00.000Z',
                    'duration': 5,
                    'progress': 100,
                    'priority': 'Normal',
                    'approved': false,
                    'index': 1,
                    'parentIndex': 0,
                    'level': 1,
                    'uniqueID': "Grid_data_1",
                    'parentUniqueID' : "Grid_data_0",
                    parentItem: {
                        'taskID': 1,
                        'taskName': 'Planning',
                        'startDate': '2017-02-02T18:30:00.000Z',
                        'endDate': '2017-02-06T18:30:00.000Z',
                        'progress': 100,
                        'duration': 5,
                        'priority': 'Normal',
                        'approved': false,
                        'uniqueID': "Grid_data_0",
                        'index': 0
                    }
                },
                {
                    'taskID': 3,
                    'taskName': 'Plan budget',
                    'startDate': '2017-02-02T18:30:00.000Z',
                    'endDate': '2017-02-06T18:30:00.000Z',
                    'duration': 5,
                    'progress': 100,
                    'approved': true,
                    'index': 2,
                    'parentIndex': 0,
                    'level': 1,
                    'uniqueID': "Grid_data_2",
                    'parentUniqueID' : "Grid_data_0",
                    parentItem: {
                        'taskID': 1,
                        'taskName': 'Planning',
                        'startDate': '2017-02-02T18:30:00.000Z',
                        'endDate': '2017-02-06T18:30:00.000Z',
                        'progress': 100,
                        'duration': 5,
                        'priority': 'Normal',
                        'approved': false,
                        'uniqueID': "Grid_data_0",
                        'index': 0
                    }
                },
                {
                    'taskID': 4,
                    'taskName': 'Allocate resources',
                    'startDate': '2017-02-02T18:30:00.000Z',
                    'endDate': '2017-02-06T18:30:00.000Z',
                    'duration': 5,
                    'progress': 100,
                    'priority': 'Critical',
                    'approved': false,
                    'index': 3,
                    'parentIndex': 0,
                    'uniqueID': "Grid_data_3",
                    'parentUniqueID' : "Grid_data_0",
                    'level': 1,
                    parentItem: {
                        'taskID': 1,
                        'taskName': 'Planning',
                        'startDate': '2017-02-02T18:30:00.000Z',
                        'endDate': '2017-02-06T18:30:00.000Z',
                        'progress': 100,
                        'duration': 5,
                        'priority': 'Normal',
                        'approved': false,
                        'uniqueID': "Grid_data_0",
                        'index': 0
                    }
                },
                {
                    'taskID': 5,
                    'taskName': 'Planning complete',
                    'startDate': '2017-02-06T18:30:00.000Z',
                    'endDate': '2017-02-06T18:30:00.000Z',
                    'duration': 0,
                    'progress': 0,
                    'priority': 'Low',
                    'approved': true,
                    'index': 4,
                    'parentIndex': 0,
                    'level': 1,
                    'uniqueID': "Grid_data_4",
                    'parentUniqueID' : "Grid_data_0",
                    parentItem: {
                        'taskID': 1,
                        'taskName': 'Planning',
                        'startDate': '2017-02-02T18:30:00.000Z',
                        'endDate': '2017-02-06T18:30:00.000Z',
                        'progress': 100,
                        'duration': 5,
                        'priority': 'Normal',
                        'approved': false,
                        'uniqueID': "Grid_data_0",
                        'index': 0
                    }
                }
            ]
        },
    {
        'taskID': 2,
        'taskName': 'Plan timeline',
        'startDate': '2017-02-02T18:30:00.000Z',
        'endDate': '2017-02-06T18:30:00.000Z',
        'duration': 5,
        'progress': 100,
        'priority': 'Normal',
        'approved': false,
        'index': 1,
        'parentIndex': 0,
        'level': 1,
        'uniqueID': "Grid_data_1",
        'parentUniqueID' : "Grid_data_0",
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false,
            'uniqueID': "Grid_data_0",
            'index': 0
        }
    },
    {
        'taskID': 3,
        'taskName': 'Plan budget',
        'startDate': '2017-02-02T18:30:00.000Z',
        'endDate': '2017-02-06T18:30:00.000Z',
        'duration': 5,
        'progress': 100,
        'approved': true,
        'index': 2,
        'parentIndex': 0,
        'level': 1,
        'uniqueID': "Grid_data_2",
        'parentUniqueID' : "Grid_data_0",
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false,
            'uniqueID': "Grid_data_0",
            'index': 0
        }
    },
    {
        'taskID': 4,
        'taskName': 'Allocate resources',
        'startDate': '2017-02-02T18:30:00.000Z',
        'endDate': '2017-02-06T18:30:00.000Z',
        'duration': 5,
        'progress': 100,
        'priority': 'Critical',
        'approved': false,
        'index': 3,
        'parentIndex': 0,
        'level': 1,
        'uniqueID': "Grid_data_3",
        'parentUniqueID' : "Grid_data_0",
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false,
            'uniqueID': "Grid_data_0",
            'index': 0
        }
    },
    {
        'taskID': 5,
        'taskName': 'Planning complete',
        'startDate': '2017-02-06T18:30:00.000Z',
        'endDate': '2017-02-06T18:30:00.000Z',
        'duration': 0,
        'progress': 0,
        'priority': 'Low',
        'approved': true,
        'index': 4,
        'parentIndex': 0,
        'level': 1,
        'uniqueID': "Grid_data_4",
        'parentUniqueID' : "Grid_data_0",
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false,
            'uniqueID': "Grid_data_0",
            'index': 0
        }
    }
    ];
export var multiLevelSelfRef = [{
    'TaskID': 1,
    'TaskName': 'Parent Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40'
},
{
    'TaskID': 2,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40',
    'parentID': 1
},
{
    'TaskID': 3,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 2
},
{
    'TaskID': 33,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 2
},
{
    'TaskID': 4,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 3
},
{
    'TaskID': 44,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 4
},
{
    'TaskID': 444,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 4
},
{
    'TaskID': 5,
    'TaskName': 'Parent Task 5',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40'
},
{
    'TaskID': 6,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40',
    'parentID': 5
},
{
    'TaskID': 7,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 6
},
{
    'TaskID': 8,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 7
},

{
    'TaskID': 9,
    'TaskName': 'Child Task 9',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 8
}
];

export var multiLevelSelfRef1 = [{
    'TaskID': 1,
    'TaskName': 'Parent Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40'
},
{
    'TaskID': 2,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40',
    'parentID': 1
},
{
    'TaskID': 3,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 2
},
{
    'TaskID': 33,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 2
},
{
    'TaskID': 4,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 3
},
{
    'TaskID': 44,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 4
},
{
    'TaskID': 444,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 4
},
{
    'TaskID': 5,
    'TaskName': 'Parent Task 5',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40'
},
{
    'TaskID': 6,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '40',
    'parentID': 5
},
{
    'TaskID': 7,
    'TaskName': 'Parent Task 2',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '30',
    'parentID': 6
},
{
    'TaskID': 8,
    'TaskName': 'Child Task 1',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 4
},

{
    'TaskID': 9,
    'TaskName': 'Child Task 9',
    'StartDate': new Date('02/23/2014'),
    'EndDate': new Date('02/27/2014'),
    'Progress': '60',
    'parentID': 44
}
];

export let selfEditData: Object[] = [
    { 'TaskID': 1, 'TaskName': 'Parent Task 1', 'StartDate': new Date('02/23/2017'), 'EndDate': new Date('02/27/2017'), 'Progress': '40' },
    { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/23/2017'), 'EndDate': new Date('02/27/2017'), 'Progress': '40', 'parentID': 1 },
    { 'TaskID': 22, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/23/2017'), 'EndDate': new Date('02/27/2017'), 'Progress': '40', 'parentID': 2 },
    { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/23/2017'), 'EndDate': new Date('02/27/2017'), 'Progress': '40', 'parentID': 1 },
    { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/23/2017'), 'EndDate': new Date('02/27/2017'), 'Duration': 5, 'Progress': '40', 'parentID': 1 },
    { 'TaskID': 5, 'TaskName': 'Parent Task 2', 'StartDate': new Date('03/14/2017'), 'EndDate': new Date('03/18/2017'), 'Progress': '40' },
    { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/02/2017'), 'EndDate': new Date('03/06/2017'), 'Progress': '40', 'parentID': 5 },
    { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/02/2017'), 'EndDate': new Date('03/06/2017'), 'Progress': '40', 'parentID': 5 },
    { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/02/2017'), 'EndDate': new Date('03/06/2017'), 'Progress': '40', 'parentID': 5 },
    { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/02/2017'), 'EndDate': new Date('03/06/2017'), 'Progress': '40', 'parentID': 5 },
    { 'TaskID': 10, 'TaskName': 'Parent Task 3', 'StartDate': new Date('03/09/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40' },
    { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/9/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40', 'parentID': 10 },
    { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/9/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40', 'parentID': 10 },
    { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/9/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40', 'parentID': 10 },
    { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/9/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40', 'parentID': 10 },
    { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/9/2017'), 'EndDate': new Date('03/13/2017'), 'Progress': '40', 'parentID': 10 }

];

export let newSampledata: Object[] = [
    {
        'TaskId': 1,
        'TaskName': 'Task 1',
        'StartDate': new Date('10/23/2017'),
        'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/28/2017'),
        'Duration': 10,
        'Progress': 70,
        'cusClass': 'cusclass',
        'Children': [
            {
                'resourceInfo': [1, 2], 'TaskId': 2, 'TaskName': 'Child task 1', 'cusClass': 'cusclass',
                'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
                'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80,
                'unit': 'minute'
            },
            {
                'resourceInfo': [2, 3], 'TaskId': 3, 'TaskName': 'Child task 2',
                'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                'BaselineEndDate': new Date('10/28/2017'), 'Duration': 5, 'Progress': 65, 'Predecessor': '2',
                'unit': 'hour'
            },
            {
                'TaskId': 4,
                'TaskName': 'Child task 3',
                'StartDate': new Date('10/25/2017'),
                'BaselineStartDate': new Date('10/26/2017'),
                'BaselineEndDate': new Date('10/28/2017'),
                'Duration': 6,
                'Progress': 77,
                'Children': [
                    {
                        'resourceInfo': [1,2,3], 'TaskId': 5, 'TaskName': 'Grand child task 1',
                        'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                        'BaselineEndDate': new Date('11/1/2017'), 'Duration': 5, 'Progress': 60,
                        'unit': 'minute',
                    },
                    {
                        'resourceInfo': [4,5], 'TaskId': 6, 'TaskName': 'Grand child task 2',
                        'StartDate': new Date('10/29/2017'), 'BaselineStartDate': new Date('10/29/2017'),
                        'BaselineEndDate': new Date('10/31/2017'), 'Duration': 6, 'Progress': 77, 'Predecessor': '5'
                    },
                    {
                        'resourceInfo': [5], 'TaskId': 7, 'TaskName': 'Grand child task 3',
                        'StartDate': new Date('10/25/2017'), 'BaselineStartDate': new Date('10/25/2017'),
                        'BaselineEndDate': new Date('10/25/2017'), 'Duration': 0, 'Progress': 0, 'Predecessor': '6'
                    }
                ]
            }
        ]
    },
    {
        'TaskId': 8,
        'TaskName': 'Task 1',
        'StartDate': new Date('10/23/2017'),
        'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/28/2017'),
        'Duration': 10,
        'Progress': 70,
        'cusClass': 'cusclass',
        'Children': [
            {
                'resourceInfo': [1], 'TaskId': 9, 'TaskName': 'Child task 1', 'cusClass': 'cusclass',
                'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
                'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80
            },
            {
                'resourceInfo': [2], 'TaskId': 10, 'TaskName': 'Child task 2',
                'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                'BaselineEndDate': new Date('10/28/2017'), 'Duration': 5, 'Progress': 65, 'Predecessor': '2'
            },
            {
                'TaskId': 11,
                'TaskName': 'Child task 3',
                'StartDate': new Date('10/25/2017'),
                'BaselineStartDate': new Date('10/26/2017'),
                'BaselineEndDate': new Date('10/28/2017'),
                'Duration': 6,
                'Progress': 77,
                'Children': [
                    {
                        'resourceInfo': [3], 'TaskId': 12, 'TaskName': 'Grand child task 1',
                        'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                        'BaselineEndDate': new Date('11/1/2017'), 'Duration': 5, 'Progress': 60
                    },
                    {
                        'resourceInfo': [4], 'TaskId': 13, 'TaskName': 'Grand child task 2',
                        'StartDate': new Date('10/29/2017'), 'BaselineStartDate': new Date('10/29/2017'),
                        'BaselineEndDate': new Date('10/31/2017'), 'Duration': 6, 'Progress': 77, 'Predecessor': '5'
                    },
                    {
                        'resourceInfo': [5], 'TaskId': 14, 'TaskName': 'Grand child task 3',
                        'StartDate': new Date('10/25/2017'), 'BaselineStartDate': new Date('10/25/2017'),
                        'BaselineEndDate': new Date('10/25/2017'), 'Duration': 0, 'Progress': 0, 'Predecessor': '6'
                    }
                ]
            }
        ]
    }
    ];
    export var emptyChildData: Object[] = [
    {
        "Name": "Test1", "Children": [{ "Name": "Test1a" }, { "Name": "Test1b" }]
   },
   {
       "Name": "Test2", "Children": [{ "Name": "Test2a" }, { "Name": "Test2b" }]
   },
   {
       "Name": "Test3", "Children": []
   }
];

export let zerothRecord: Object[] = [
    {
        taskID: 1,
        taskName: 'Planning',
        startDate: new Date('02/03/2017'),
        endDate: new Date('02/07/2017'),
        progress: 100,
        duration: 5,
        priority: 'Normal',
        approved: false,
    },
    {
        taskID: 6,
        taskName: 'Design',
        startDate: new Date('02/10/2017'),
        endDate: new Date('02/14/2017'),
        duration: 3,
        progress: 86,
        priority: 'High',
        isInExpandState: false,
        approved: false,
        subtasks: [
            { taskID: 7, taskName: 'Software Specification', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 60, priority: 'Normal', approved: false },
            { taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 100, priority: 'Critical', approved: false },
            { taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
            { taskID: 10, taskName: 'Design Documentation', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
            { taskID: 11, taskName: 'Design complete', startDate: new Date('02/14/2017'), endDate: new Date('02/14/2017'), duration: 0, progress: 0, priority: 'Normal', approved: true }
        ]
    }
];


export let allysonData =  
[  
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560",
     //"SetorId":null,
     "Nome":"Ambulatório",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"f2cdd91b-1458-4f2c-af6c-20c730af3311",
     //"SetorId":null,
     "Nome":"Ambulatório",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"f2cdd91b-1458-4f2c-af6c-20c730af3311",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560",
     "SetorId":"f20e2d6d-a123-416d-bdf1-7552e8bdc118",
     "Nome":"Ambulatório",
     ////"Sigla":null,
     ////"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"f20e2d6d-a123-416d-bdf1-7552e8bdc118",
     "AreaPaiId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"f2cdd91b-1458-4f2c-af6c-20c730af3311",
     "SetorId":"431a9ae1-4be0-4618-9c9f-051b9eb4b3ea",
     "Nome":"Ambulatório",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"431a9ae1-4be0-4618-9c9f-051b9eb4b3ea",
     "AreaPaiId":"f2cdd91b-1458-4f2c-af6c-20c730af3311"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     //"UnidadeId":null,
     //"DepartamentoId":null,
     //"SetorId":null,
     "Nome":"Associação Paulista Para O Desenvolvimento Da Medicina",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     //"UnidadeId":null,
     "AreaNivel":1,
     "AreaId":"c57e9690-3c91-432c-bb52-d87043620da4",
     //"AreaPaiId":null
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     "SetorId":"32d238e9-b4f7-45d9-ac02-fdbac1dc98c0",
     "Nome":"Broncoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"32d238e9-b4f7-45d9-ac02-fdbac1dc98c0",
     "AreaPaiId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     "SetorId":"03eb6e70-c47b-465f-96ca-35bc28acbd25",
     "Nome":"Broncoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"03eb6e70-c47b-465f-96ca-35bc28acbd25",
     "AreaPaiId":"a3df0392-4f89-46d5-9f6d-1c8defe106df"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"7885c729-ae6d-4fb4-857e-1b48fcb7a12d",
     //"SetorId":null,
     "Nome":"Centro Cirúrgico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"7885c729-ae6d-4fb4-857e-1b48fcb7a12d",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"77f2be6c-fba1-45cb-92ea-02e116fefaa5",
     //"SetorId":null,
     "Nome":"Centro Cirúrgico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"77f2be6c-fba1-45cb-92ea-02e116fefaa5",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"7885c729-ae6d-4fb4-857e-1b48fcb7a12d",
     "SetorId":"d7c59b86-e1f5-4cfc-b728-da389d13aa4c",
     "Nome":"Centro Cirúrgico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"d7c59b86-e1f5-4cfc-b728-da389d13aa4c",
     "AreaPaiId":"7885c729-ae6d-4fb4-857e-1b48fcb7a12d"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"77f2be6c-fba1-45cb-92ea-02e116fefaa5",
     "SetorId":"8aee138a-cd04-49c9-849e-1cd4b6797832",
     "Nome":"Centro Cirúrgico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"8aee138a-cd04-49c9-849e-1cd4b6797832",
     "AreaPaiId":"77f2be6c-fba1-45cb-92ea-02e116fefaa5"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"59ddde75-9ac8-409e-a030-0220227f37c6",
     //"SetorId":null,
     "Nome":"Centro Obstétrico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"59ddde75-9ac8-409e-a030-0220227f37c6",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436",
     //"SetorId":null,
     "Nome":"Centro Obstétrico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436",
     "SetorId":"2450e789-5e07-4133-82af-7fa4ef9c0805",
     "Nome":"Centro Obstétrico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"2450e789-5e07-4133-82af-7fa4ef9c0805",
     "AreaPaiId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"59ddde75-9ac8-409e-a030-0220227f37c6",
     "SetorId":"878209a0-a3e5-4fa9-abaf-b9f2c8b80f6a",
     "Nome":"Centro Obstétrico",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"878209a0-a3e5-4fa9-abaf-b9f2c8b80f6a",
     "AreaPaiId":"59ddde75-9ac8-409e-a030-0220227f37c6"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     "SetorId":"1bb00b31-d515-42af-9f0c-290d8f97b5b0",
     "Nome":"Colonoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"1bb00b31-d515-42af-9f0c-290d8f97b5b0",
     "AreaPaiId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     "SetorId":"c903e8b1-a536-4d4c-9796-cd642bdf7d86",
     "Nome":"Colonoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"c903e8b1-a536-4d4c-9796-cd642bdf7d86",
     "AreaPaiId":"a3df0392-4f89-46d5-9f6d-1c8defe106df"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9",
     "SetorId":"4da8d502-a8fe-419d-83af-25ace095971d",
     "Nome":"Emergência Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"4da8d502-a8fe-419d-83af-25ace095971d",
     "AreaPaiId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"7cef35a1-816d-4468-947c-c931c2247484",
     "SetorId":"3c2d99e2-a169-426a-8a82-56e3a623fc7f",
     "Nome":"Emergência Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"3c2d99e2-a169-426a-8a82-56e3a623fc7f",
     "AreaPaiId":"7cef35a1-816d-4468-947c-c931c2247484"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"7cef35a1-816d-4468-947c-c931c2247484",
     "SetorId":"275c1c9d-9201-475d-a78e-496717cb6b82",
     "Nome":"Emergência Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"275c1c9d-9201-475d-a78e-496717cb6b82",
     "AreaPaiId":"7cef35a1-816d-4468-947c-c931c2247484"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9",
     "SetorId":"ee539230-1eaf-4601-8871-8d1919491da8",
     "Nome":"Emergência Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"ee539230-1eaf-4601-8871-8d1919491da8",
     "AreaPaiId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     "SetorId":"4c035b24-68bd-4d57-9c5f-51b80e5914e7",
     "Nome":"Endoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"4c035b24-68bd-4d57-9c5f-51b80e5914e7",
     "AreaPaiId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     "SetorId":"7404bdad-94f7-4827-ac35-461446bd57ed",
     "Nome":"Endoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"7404bdad-94f7-4827-ac35-461446bd57ed",
     "AreaPaiId":"a3df0392-4f89-46d5-9f6d-1c8defe106df"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     //"SetorId":null,
     "Nome":"Ex. Endoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     //"SetorId":null,
     "Nome":"Ex. Endoscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     //"DepartamentoId":null,
     //"SetorId":null,
     "Nome":"Hospital De Testes",
     "Sigla":"HT",
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":2,
     "AreaId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "AreaPaiId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     //"DepartamentoId":null,
     //"SetorId":null,
     "Nome":"Hospital Municipal Pimentas Bonsucesso",
     "Sigla":"HMPB",
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":2,
     "AreaId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "AreaPaiId":"c57e9690-3c91-432c-bb52-d87043620da4"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     //"UnidadeId":null,
     //"DepartamentoId":null,
     //"SetorId":null,
     "Nome":"Instituto De Testes",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     //"UnidadeId":null,
     "AreaNivel":1,
     "AreaId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     //"AreaPaiId":null
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc",
     "SetorId":"2827e5bc-cc52-4573-bec5-50a5087ebcfe",
     "Nome":"Nasofriboscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"2827e5bc-cc52-4573-bec5-50a5087ebcfe",
     "AreaPaiId":"1f4cb163-ae4e-485f-96bb-d78566fc9ebc"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"a3df0392-4f89-46d5-9f6d-1c8defe106df",
     "SetorId":"f4b42a57-dfcf-47ef-808d-465ac5a72095",
     "Nome":"Nasofriboscopia",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"f4b42a57-dfcf-47ef-808d-465ac5a72095",
     "AreaPaiId":"a3df0392-4f89-46d5-9f6d-1c8defe106df"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"aa484023-cbdc-40fb-97a7-bfd1e6d02116",
     "Nome":"P.S Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"aa484023-cbdc-40fb-97a7-bfd1e6d02116",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"763d0b8b-2209-4653-b2fa-d252ef896ab5",
     "Nome":"P.S Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"763d0b8b-2209-4653-b2fa-d252ef896ab5",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"6d1562c8-2892-4a73-bb11-b4896e05bb6c",
     "Nome":"P.S Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"6d1562c8-2892-4a73-bb11-b4896e05bb6c",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"32e24822-6eb0-41ec-8c3c-ad467454466e",
     "Nome":"P.S Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"32e24822-6eb0-41ec-8c3c-ad467454466e",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"7cef35a1-816d-4468-947c-c931c2247484",
     //"SetorId":null,
     "Nome":"P.S. Emergência",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"7cef35a1-816d-4468-947c-c931c2247484",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9",
     //"SetorId":null,
     "Nome":"P.S. Emergência",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"e4b9a9c5-9f61-4320-a91f-245a16206bb9",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     //"SetorId":null,
     "Nome":"P.S. Geral",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     //"SetorId":null,
     "Nome":"P.S. Geral",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436",
     "SetorId":"369b22ec-d211-4e65-8a56-9ce028cb0a49",
     "Nome":"Pré - Parto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"369b22ec-d211-4e65-8a56-9ce028cb0a49",
     "AreaPaiId":"8fa02ff5-248c-43d4-adf0-8c0a62af8436"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"59ddde75-9ac8-409e-a030-0220227f37c6",
     "SetorId":"4644b8ce-9255-4a30-a153-5358e1cccc3e",
     "Nome":"Pré - Parto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"4644b8ce-9255-4a30-a153-5358e1cccc3e",
     "AreaPaiId":"59ddde75-9ac8-409e-a030-0220227f37c6"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"583caabe-2642-4f02-a60e-b0c0d9ab3c37",
     "Nome":"Sala Atendimento P.S G.O",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"583caabe-2642-4f02-a60e-b0c0d9ab3c37",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"670637e7-a852-471c-92d2-2799e224ab5b",
     "Nome":"Sala Atendimento P.S G.O",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"670637e7-a852-471c-92d2-2799e224ab5b",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560",
     "SetorId":"49000190-4aee-48df-9190-f0c7b24b06e2",
     "Nome":"Sala De Coleta",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"49000190-4aee-48df-9190-f0c7b24b06e2",
     "AreaPaiId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"f2cdd91b-1458-4f2c-af6c-20c730af3311",
     "SetorId":"98fb6288-8e21-46bf-be73-0d5118d32f7f",
     "Nome":"Sala De Coleta",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"98fb6288-8e21-46bf-be73-0d5118d32f7f",
     "AreaPaiId":"f2cdd91b-1458-4f2c-af6c-20c730af3311"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560",
     "SetorId":"49ee4703-3cc2-42e2-8ebb-57c0c6035ef7",
     "Nome":"Sala De Gesso",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"49ee4703-3cc2-42e2-8ebb-57c0c6035ef7",
     "AreaPaiId":"ee1b2f5e-02c6-41c6-8c4c-5c0ad547e560"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"f2cdd91b-1458-4f2c-af6c-20c730af3311",
     "SetorId":"8db25ff7-3402-4592-8896-a144fb67b6b3",
     "Nome":"Sala De Gesso",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"8db25ff7-3402-4592-8896-a144fb67b6b3",
     "AreaPaiId":"f2cdd91b-1458-4f2c-af6c-20c730af3311"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"89f4369e-eaf5-4a54-bad1-783de11c290b",
     "Nome":"Sala De Medicação Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"89f4369e-eaf5-4a54-bad1-783de11c290b",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"fb5df38f-c20d-4215-b33e-78d3584a9765",
     "Nome":"Sala De Medicação Adulto",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"fb5df38f-c20d-4215-b33e-78d3584a9765",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"fce8327f-371b-4d01-a261-c4f209787ee0",
     "Nome":"Sala De Medicação G.O",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"fce8327f-371b-4d01-a261-c4f209787ee0",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"2677e287-38a7-471b-88bf-7521f6afa12e",
     "Nome":"Sala De Medicação G.O",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"2677e287-38a7-471b-88bf-7521f6afa12e",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"ad64be56-a629-4b68-bedf-14d6d738ca44",
     "SetorId":"91606a88-13d9-412c-bac6-9456d2ff14b2",
     "Nome":"Sala De Medicação Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"91606a88-13d9-412c-bac6-9456d2ff14b2",
     "AreaPaiId":"ad64be56-a629-4b68-bedf-14d6d738ca44"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1",
     "SetorId":"bff47f31-965c-4d36-a2d8-4c72df1c45fc",
     "Nome":"Sala De Medicação Infantil",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"bff47f31-965c-4d36-a2d8-4c72df1c45fc",
     "AreaPaiId":"2c57c44c-2c87-4942-9e06-bedba2be1fe1"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"0edd8529-2ecc-4233-adf9-7260ee236b7e",
     //"SetorId":null,
     "Nome":"UI Clínica Cirúrgica",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"0edd8529-2ecc-4233-adf9-7260ee236b7e",
     "AreaPaiId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"caf2b560-6a65-48a3-91b8-7d7ad57acc3f",
     //"SetorId":null,
     "Nome":"UI Clínica Cirúrgica",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":3,
     "AreaId":"caf2b560-6a65-48a3-91b8-7d7ad57acc3f",
     "AreaPaiId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d"
  },
  {  
     "ChaveControladoraId":"f97dfd20-b1d9-45f9-92dc-63ebc9d07877",
     "InstituicaoId":"c57e9690-3c91-432c-bb52-d87043620da4",
     "UnidadeId":"9c68c95a-edd0-46ce-ada1-f39d12ffcb3d",
     "DepartamentoId":"caf2b560-6a65-48a3-91b8-7d7ad57acc3f",
     "SetorId":"02ef2820-90a9-42f7-bc41-73196f1555a0",
     "Nome":"UI Clínica Cirúrgica",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"02ef2820-90a9-42f7-bc41-73196f1555a0",
     "AreaPaiId":"caf2b560-6a65-48a3-91b8-7d7ad57acc3f"
  },
  {  
     "ChaveControladoraId":"b42ef866-e7b0-474b-bda1-d76e18eb4c19",
     "InstituicaoId":"b3bce592-eed4-41ae-b15e-24f11e5c8c0d",
     "UnidadeId":"b5f487d3-f0eb-4a3f-9d75-b86bd9858752",
     "DepartamentoId":"0edd8529-2ecc-4233-adf9-7260ee236b7e",
     "SetorId":"1ae700b2-1619-4d08-8c13-801d1ab18cb2",
     "Nome":"UI Clínica Cirúrgica",
     //"Sigla":null,
     //"Cor":null,
     "Status":true,
     "StatusPai":true,
     "AreaNivel":4,
     "AreaId":"1ae700b2-1619-4d08-8c13-801d1ab18cb2",
     "AreaPaiId":"0edd8529-2ecc-4233-adf9-7260ee236b7e"
  }
];


export var testdata = [
    {
      taskID: 1,
      taskName: 'Planning',
      startDate: new Date('02/03/2017'),
      endDate: new Date('02/07/2017'),
      progress: 100,
      duration: 5,
      collapsed: true,
      priority: 'Normal',
      level: 0,
      approved: false,
      subtasks: [
          { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false },
          { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, approved: true },
          { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false },
          { taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'), endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true }
      ]
    }
];
