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
        'level': 0
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
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false
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
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false
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
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false
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
        parentItem: {
            'taskID': 1,
            'taskName': 'Planning',
            'startDate': '2017-02-02T18:30:00.000Z',
            'endDate': '2017-02-06T18:30:00.000Z',
            'progress': 100,
            'duration': 5,
            'priority': 'Normal',
            'approved': false
        }
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