/**
 * Gantt data-source spec
 */
export let projectResources: Object[] = [
    { ResourceId: 1, ResourceName: 'Project Manager' },
    { ResourceId: 2, ResourceName: 'Software Analyst' },
    { ResourceId: 3, ResourceName: 'Developer' },
    { ResourceId: 4, ResourceName: 'Testing Engineer' }
];
export let dataSource1: Object[] = [
    {
        taskId: 1,
        taskName: "Project initiation",
        startDate: new Date('03/29/2019'),
        endDate: new Date('04/21/2019'),
    }, {
        taskId: 2,
        taskName: "Identify Site location",
        startDate: new Date('03/29/2019'),
        duration: "2",
        progress: 30,
        parentID: 1,
        predecessor: null
    }, {
        taskId: 3,
        taskName: "Perform soil test",
        startDate: new Date('03/29/2019'),
        duration: "4",
        parentID: 1
    }
];
export let cr884998 = [
    {
        taskId: 8,
        taskName: 'Adicionar 8',
        startDate: '2024-04-05',
        endDate: '2024-04-05T23:59:59.999Z',
        duration: 1,
        dependencies: '',
        taskIndex: 0,
        cost: 110,
        index: 0,
        wbs: '01',
    },
    {
        taskId: 6,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parts: [
            {
                left: 0,
                width: 165,
                duration: 3,
                endDate: '2024-04-10T20:00:00.000Z',
                startDate: '2024-04-08T11:00:00.000Z',
                segmentIndex: 0,
                showProgress: true,
                progressWidth: 0,
                offsetDuration: 0,
            },
            {
                left: 198,
                width: 66,
                duration: 2,
                endDate: '2024-04-15T20:00:00.000Z',
                startDate: '2024-04-12T11:00:00.000Z',
                segmentIndex: 1,
                showProgress: false,
                progressWidth: -1,
                offsetDuration: 1,
            },
        ],
        taskIndex: 1,
        cost: 0,
        index: 1,
        wbs: '02',
    },
    {
        taskId: 7,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 6,
        taskIndex: 2,
        cost: 0,
        index: 2,
        wbs: '02.01',
    },
    {
        taskId: 9,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 7,
        taskIndex: 3,
        cost: 12340,
        index: 3,
        wbs: '02.01.01',
    },
    {
        taskId: 10,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 6,
        taskIndex: 4,
        cost: 0,
        index: 4,
        wbs: '02.02',
    },
    {
        taskId: 11,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 10,
        taskIndex: 5,
        cost: 1000,
        index: 5,
        wbs: '02.02.01',
    },
    {
        taskId: 13,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 10,
        taskIndex: 6,
        cost: 1000,
        index: 6,
        wbs: '02.02.02',
    },
    {
        taskId: 12,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        parentId: 10,
        taskIndex: 7,
        cost: 700,
        index: 7,
        wbs: '02.02.03',
    },
    {
        taskId: 2,
        taskName: 'Adicionar 2',
        startDate: '2024-04-09',
        endDate: '2024-04-09T23:59:59.999Z',
        duration: 1,
        dependencies: '',
        taskIndex: 8,
        cost: 105,
        index: 8,
        wbs: '03',
    },
    {
        taskId: 4,
        taskName: 'Adicionar 4',
        startDate: '2024-04-05',
        endDate: '2024-04-05T23:59:59.999Z',
        duration: 1,
        dependencies: '',
        taskIndex: 9,
        cost: 120,
        index: 9,
        wbs: '04',
    },
    {
        taskId: 5,
        taskName: 'Adicionar 5',
        startDate: '2024-04-08',
        endDate: '2024-04-08T23:59:59.999Z',
        duration: 1,
        dependencies: '4FS',
        taskIndex: 10,
        index: 10,
        wbs: '05',
    },
];
export let splitTasksDataRelease: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '90'
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '75',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 4 },
                            { StartDate: new Date('02/08/2019'), Duration: 2 }
                          ]
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                        Duration: 0, Predecessor: '3FS,5FS'
                    },
                ]
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/25/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '60', Predecessor: '6FS', subtasks: [{
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                              ]
                        }]
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '100', Predecessor: '6FS',
                        Segments: [
                            { StartDate: new Date('02/25/2019'), Duration: 2 },
                            { StartDate: new Date('02/28/2019'), Duration: 3 }
                          ]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                        EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                        Duration: 0, Predecessor: '10FS'
                    }
                ]
            }
        ]
    }
];
export let splitTasksData3: object[] = [
    {
        id: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                id: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        id: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '60',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 2 , customID: 33},
                            { StartDate: new Date('02/05/2019'), Duration: 5 , customID: 44},
                            { StartDate: new Date('02/08/2019'), Duration: 3 , customID: 55}
                        ]
                    },
                ]
            },
        ]
    }
];
let releaseTempData: any[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        parentID: 0
    },
    {
        TaskID: 2,
        TaskName: 'Defining the product and its usage',
        StartDate: new Date('04/02/2019'),
        Duration: 3,
        Progress: 30,
        parentID: 1
    },
    {
        TaskID: 3,
        TaskName: 'Defining target audience',
        StartDate: new Date('04/02/2019'),
        parentID: 1,
        Duration: 3
    },
    {
        TaskID: 4,
        TaskName: 'Prepare product sketch and notes',
        StartDate: new Date('04/05/2019'),
        Duration: 2,
        parentID: 1,
        Progress: 30
    },
    {
        TaskID: 5,
        TaskName: 'Concept approval',
        StartDate: new Date('04/08/2019'),
        parentID: 0,
        Duration: 0
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 7,
        TaskName: 'Demand analysis',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        parentID: 6
    },
    {
        TaskID: 8,
        TaskName: 'Customer strength',
        StartDate: new Date('04/09/2019'),
        Duration: 4,
        parentID: 7,
        Progress: 30
    },
    {
        TaskID: 9,
        TaskName: 'Market opportunity analysis',
        StartDate: new Date('04/09/2019'),
        Duration: 4,
        parentID: 7
    },
    {
        TaskID: 10,
        TaskName: 'Competitor analysis',
        StartDate: new Date('04/15/2019'),
        Duration: 4,
        parentID: 6,
        Progress: 30
    },
    {
        TaskID: 11,
        TaskName: 'Product strength analsysis',
        StartDate: new Date('04/15/2019'),
        Duration: 4,
        parentID: 6
    },
    {
        TaskID: 12,
        TaskName: 'Research complete',
        StartDate: new Date('04/18/2019'),
        Duration: 0,
        parentID: 6
    },
    {
        TaskID: 13,
        TaskName: 'Product design and development',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 14,
        TaskName: 'Functionality design',
        StartDate: new Date('04/19/2019'),
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 15,
        TaskName: 'Quality design',
        StartDate: new Date('04/19/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 16,
        TaskName: 'Define reliability',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 13
    },
    {
        TaskID: 17,
        TaskName: 'Identifying raw materials',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        parentID: 13
    },
    {
        TaskID: 18,
        TaskName: 'Define cost plan',
        StartDate: new Date('04/04/2019'),
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 19,
        TaskName: 'Manufacturing cost',
        StartDate: new Date('04/26/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 18
    },
    {
        TaskID: 20,
        TaskName: 'Selling cost',
        StartDate: new Date('04/26/2019'),
        Duration: 2,
        parentID: 18
    },
    {
        TaskID: 21,
        TaskName: 'Development of the final design',
        StartDate: new Date('04/30/2019'),
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 22,
        TaskName: 'Defining dimensions and package volume',
        StartDate: new Date('04/30/2019'),
        Duration: 2,
        parentID: 21,
        Progress: 30
    },
    {
        TaskID: 23,
        TaskName: 'Develop design to meet industry standards',
        StartDate: new Date('05/02/2019'),
        Duration: 2,
        parentID: 21
    },
    {
        TaskID: 24,
        TaskName: 'Include all the details',
        StartDate: new Date('05/06/2019'),
        Duration: 3,
        parentID: 21
    },
    {
        TaskID: 25,
        TaskName: 'CAD computer-aided design',
        StartDate: new Date('05/09/2019'),
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 26,
        TaskName: 'CAM computer-aided manufacturing',
        StartDate: new Date('09/14/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 27,
        TaskName: 'Design complete',
        StartDate: new Date('05/16/2019'),
        Duration: 0,
        parentID: 13
    },
    {
        TaskID: 28,
        TaskName: 'Prototype testing',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 29,
        TaskName: 'Include feedback',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        parentID: 0
    },
    {
        TaskID: 30,
        TaskName: 'Manufacturing',
        StartDate: new Date('05/23/2019'),
        Duration: 5,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 31,
        TaskName: 'Assembling materials to finsihed goods',
        StartDate: new Date('05/30/2019'),
        Duration: 5,
        parentID: 0
    },
    {
        TaskID: 32,
        TaskName: 'Feedback and testing',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 33,
        TaskName: 'Internal testing and feedback',
        StartDate: new Date('06/06/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 45
    },
    {
        TaskID: 34,
        TaskName: 'Customer testing and feedback',
        StartDate: new Date('06/11/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 50
    },
    {
        TaskID: 35,
        TaskName: 'Final product development',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 36,
        TaskName: 'Important improvements',
        StartDate: new Date('06/14/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 37,
        TaskName: 'Address any unforeseen issues',
        StartDate: new Date('06/14/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 38,
        TaskName: 'Final product',
        StartDate: new Date('04/04/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 39,
        TaskName: 'Branding product',
        StartDate: new Date('06/20/2019'),
        Duration: 4,
        parentID: 38
    },
    {
        TaskID: 40,
        TaskName: 'Marketing and presales',
        StartDate: new Date('06/26/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 38
    }
];

export let releaseVirtualData: any[] = [];
let releaseprojId: number = 1;
for (let i: number = 0; i < 50; i++) {
    let x: number = releaseVirtualData.length + 1;
    let parent: any = {};
    /* tslint:disable:no-string-literal */
    parent['TaskID'] = x;
    parent['TaskName'] = 'Project' + (releaseprojId++);
    releaseVirtualData.push(parent);
    for (let j: number = 0; j < releaseTempData.length; j++) {
        let subtasks: any = {};
        /* tslint:disable:no-string-literal */
        subtasks['TaskID'] = releaseTempData[j].TaskID + x;
        subtasks['TaskName'] = releaseTempData[j].TaskName;
        subtasks['StartDate'] = releaseTempData[j].StartDate;
        subtasks['Duration'] = releaseTempData[j].Duration;
        subtasks['Progress'] = releaseTempData[j].Progress;
        subtasks['parentID'] = releaseTempData[j].parentID + x;
        subtasks["Predecessor"] = releaseTempData[j].TaskID + x -1;
        releaseVirtualData.push(subtasks);
    }
}
export let cR885322: Object[] = [
    {
        id: '62ed75125fb9p80015ae8ee7',
        TaskID: 'ITEM-01',
        taskId: 'ITEM-01',
        TaskName: '022',
        Duration: 1,
        Progress: 62,
        parent: null,
        subTasks: [
            {
                id: '62ed76455fb9e8q015ae94cf',
                TaskID: 'SUBITEM-1',
                TaskName: '134',
                Duration: 1,
                Progress: 48,
                parent: '62ed75125fb9p80015ae8ee7',
                subTasks: [
                    {
                        id: '62ed65f949y1860014766268',
                        TaskID: 'LASTITEM-1',
                        TaskName: '432111',
                        Duration: 1,
                        Progress: 48,
                        parent: '62ed76455fb9e8q015ae94cf',
                        subTasks: [],
                        rank: '4',
                        PlannedStartDate: '2022-06-06T15:00:00.000Z',
                        PlannedEndDate: '2022-12-30T01:00:00.000Z',
                        Indicators: [],
                    },
                ],
                rank: '3',
                PlannedStartDate: '2022-12-05T16:00:00.000Z',
                PlannedEndDate: '2022-12-30T01:00:00.000Z',
                Indicators: [],
                isExpand: true,
                null: null,
            },
        ],
        isExpand: true,
        rank: '0V',
        PlannedStartDate: '2022-12-05T16:00:00.000Z',
        PlannedEndDate: '2022-12-31T01:00:00.000Z',
        Indicators: [],
    },
    {
        id: '62ed75125fb9p80015ae8ee7',
        TaskID: 'ITEM-02',
        taskId: 'ITEM-02',
        TaskName: '022',
        Duration: 1,
        Progress: 62,
        parent: null,
        subTasks: [],
        isExpand: true,
        rank: '0V',
        PlannedStartDate: '2022-12-05T16:00:00.000Z',
        PlannedEndDate: '2022-12-31T01:00:00.000Z',
        Indicators: [],
    },
    {
        id: '62ed75415fb9e8999015ae8ffda',
        TaskID: 'ITEM-003',
        taskId: 'ITEM-003',
        TaskName: '123333',
        StartDate: null,
        EndDate: null,
        Duration: 1,
        Progress: 99,
        parent: null,
        subTasks: [],
        isExpand: true,
        rank: '1',
        PlannedStartDate: null,
        PlannedEndDate: null,
        Indicators: [],
    },
    {
        id: '42ed75415fb9e8999015ae8ffda',
        TaskID: 'ITEM-004',
        taskId: 'ITEM-004',
        TaskName: '123333',
        StartDate: null,
        EndDate: null,
        Duration: 1,
        Progress: 99,
        parent: null,
        subTasks: [],
        isExpand: true,
        rank: '1',
        PlannedStartDate: null,
        PlannedEndDate: null,
        Indicators: [],
    },
];

export let bug885565Holiday: object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Defining the product  and its usage',
                BaselineStartDate: new Date('04/02/2019'),
                BaselineEndDate: new Date('04/06/2019'),
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 30,
            },
            {
                TaskID: 3,
                TaskName: 'Defining target audience',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Indicators: [
                    {
                        date: '04/10/2019',
                        iconClass:
                            'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        name: 'Indicator title',
                        tooltip: 'tooltip',
                    },
                ],
            },
            {
                TaskID: 4,
                TaskName: 'Prepare product sketch and notes',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 30,
            },
        ],
    },
    {
        TaskID: 5,
        TaskName: 'Concept Approval',
        StartDate: new Date('04/02/2024'),
        Duration: 0,
    },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 8,
                        TaskName: 'Customer strength',
                        BaselineStartDate: new Date('04/08/2019'),
                        BaselineEndDate: new Date('04/12/2019'),
                        StartDate: new Date('04/04/2019'),
                        Duration: 4,
                        Predecessor: '5',
                        Progress: 30,
                    },
                    {
                        TaskID: 9,
                        TaskName: 'Market opportunity analysis',
                        StartDate: new Date('04/04/2019'),
                        Duration: 4,
                    },
                ],
            },
            {
                TaskID: 10,
                TaskName: 'Competitor Analysis',
                StartDate: new Date('04/04/2019'),
                Duration: 4,
                Progress: 30,
            },
            {
                TaskID: 11,
                TaskName: 'Product strength analysis',
                StartDate: new Date('04/04/2019'),
                Duration: 4,
                Predecessor: '9',
            },
            {
                TaskID: 12,
                TaskName: 'Research complete',
                StartDate: new Date('04/04/2019'),
                Duration: 0,
                Predecessor: '10',
            },
        ],
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 14,
                TaskName: 'Functionality design',
                StartDate: new Date('04/04/2019'),
                Duration: 7,
                Progress: 30,
            },
            {
                TaskID: 15,
                TaskName: 'Quality design',
                StartDate: new Date('04/04/2019'),
                Duration: 5,
            },
            {
                TaskID: 16,
                TaskName: 'Define Reliability',
                StartDate: new Date('04/04/2019'),
                Duration: 5,
                Progress: 30,
            },
            {
                TaskID: 17,
                TaskName: 'Identifying raw materials ',
                StartDate: new Date('04/04/2019'),
                Duration: 4,
            },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 19,
                        TaskName: 'Manufacturing cost',
                        StartDate: new Date('04/04/2019'),
                        Duration: 1,
                        Progress: 30,
                    },
                    {
                        TaskID: 20,
                        TaskName: 'Selling cost',
                        StartDate: new Date('04/04/2019'),
                        Duration: 1,
                    },
                ],
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 22,
                        TaskName: 'Defining dimensions and package volume',
                        StartDate: new Date('04/04/2019'),
                        Duration: 2,
                        Progress: 30,
                    },
                    {
                        TaskID: 23,
                        TaskName: 'Develop design to meet industry standards',
                        StartDate: new Date('04/04/2019'),
                        Duration: 3,
                    },
                    {
                        TaskID: 24,
                        TaskName: 'Include all the details',
                        StartDate: new Date('04/04/2019'),
                        Duration: 5,
                    },
                ],
            },
            {
                TaskID: 25,
                TaskName: 'CAD Computer-aided design',
                StartDate: new Date('04/04/2019'),
                Duration: 10,
                Progress: 30,
            },
            {
                TaskID: 26,
                TaskName: 'CAM Computer-aided manufacturing',
                StartDate: new Date('04/04/2019'),
                Duration: 10,
            },
        ],
    },
    {
        TaskID: 27,
        TaskName: 'Prototype Testing',
        StartDate: new Date('04/04/2019'),
        Duration: 12,
        Progress: 30,
    },
    {
        TaskID: 28,
        TaskName: 'Include feedback',
        StartDate: new Date('04/04/2019'),
        Duration: 5,
    },
    {
        TaskID: 29,
        TaskName: 'Manufacturing',
        StartDate: new Date('04/04/2019'),
        Duration: 9,
        Progress: 30,
    },
    {
        TaskID: 30,
        TaskName: 'Assembling materials to finished goods',
        StartDate: new Date('04/04/2019'),
        Duration: 12,
    },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 32,
                TaskName: 'Internal testing and feedback',
                StartDate: new Date('04/04/2019'),
                Duration: 5,
                Progress: 30,
            },
            {
                TaskID: 33,
                TaskName: 'Customer testing and feedback',
                StartDate: new Date('04/04/2019'),
                Duration: 7,
                Progress: 30,
            },
        ],
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 35,
                TaskName: 'Important improvements',
                StartDate: new Date('04/04/2019'),
                Duration: 2,
                Progress: 30,
            },
            {
                TaskID: 36,
                TaskName: 'Address any unforeseen issues',
                StartDate: new Date('04/04/2019'),
                Duration: 2,
                Progress: 30,
            },
        ],
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 38,
                TaskName: 'Branding product',
                StartDate: new Date('04/04/2019'),
                Duration: 5,
            },
            {
                TaskID: 39,
                TaskName: 'zzz',
                StartDate: new Date('04/04/2019'),
                Duration: 10,
                Progress: 30,
            },
        ],
    },
];
export let pdfData: Object[] = [
    {
        TaskID: 61,
        TaskName: 'Project initiation',
        StartDate: new Date('04/02/2024'),
        EndDate: new Date('04/21/2024'),
        subtasks: [],
    },
    {
        TaskID: 65,
        TaskName: 'Project estimation',
        StartDate: new Date('04/02/2024'),
        EndDate: new Date('04/21/2024'),
        subtasks: [],
    },
    {
        TaskID: 69,
        TaskName: 'Sign contract',
        StartDate: new Date('04/04/2024'),
        Duration: 1,
        Progress: 30,
        resources: [12],
        info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)',
        Indicators: [
            {
                date: '04/04/2024',
                name: 'Custom String',
                tooltip: 'Follow up',
            },
            {
                date: '04/07/2024',
                name: '<span style="color:red">String Template</span>',
            },
        ],
    },
];
export let mileStoneData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Defining the product  and its usage',
                BaselineStartDate: new Date('04/02/2019'),
                BaselineEndDate: new Date('04/04/2019'),
                StartDate: new Date('04/02/2024'),
                Duration: 3,
                Progress: 30,
            },
            {
                TaskID: 3,
                TaskName: 'Defining target audience',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Indicators: [
                    {
                        date: '04/10/2019',
                        iconClass: 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        name: 'Indicator title',
                        tooltip: 'tooltip',
                    },
                ],
            },
            {
                TaskID: 4,
                TaskName: 'Prepare product sketch and notes',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 30,
            },
        ],
    },
    {
        TaskID: 5,
        TaskName: 'Concept Approval',
        StartDate: new Date('04/02/2024'),
        Duration: 0,
    },
    {
        TaskID: 8,
        TaskName: 'Customer strength',
        BaselineStartDate: new Date('04/08/2019'),
        BaselineEndDate: new Date('04/12/2019'),
        StartDate: new Date('04/04/2019'),
        Duration: 4,
        Predecessor: '5',
        Progress: 30,
    },
]

export let newData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, 
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12,Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9 ,Progress: 30},
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 }
        ]
    }
];

export let taskMode: object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual' : true,
        'Children': [
             { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40' },
             { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/05/2017'),
        'EndDate': new Date('03/09/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
             { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40' },
             { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40', },
             { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
             'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
             'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
             { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40' },
             { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', },
             { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', },
             { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
             'EndDate': new Date('03/17/2017'), 'Progress': '40' }
        ]
    }
];

export let parentProgressData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Parent',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Child1', StartDate: new Date('04/02/2019'), Duration: 0.1, Progress: 100 },
            { TaskID: 3, TaskName: 'Child2', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 100},
            { TaskID: 4, TaskName: 'Child3', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 100 },
        ]
    },
];
export let customZoomingdata: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            {
                TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 2,
                Predecessor: '2', Progress: 30
            },
        ]
    },
    {
        TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
        Indicators: [
            {
                'date': new Date('04/10/2019'),
                'name': '#briefing',
                'title': 'Product concept breifing',
            }
        ]
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4,
                        Predecessor: '5', Progress: 30
                    },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5' }
                ]
            },
            {
                TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'), Duration: 4,
                Predecessor: '7, 8', Progress: 30
            },
            { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '9' },
            {
                TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 1, Predecessor: '10',
                Indicators: [
                    {
                        'date': new Date('04/20/2019'),
                        'name': '#meeting',
                        'title': '1st board of directors meeting',
                    }
                ]
            }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('06/21/2019'),
    }
];
export let customCrIssue: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Task 1',
        StartDate: new Date('04/02/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Task 2',
                StartDate: new Date('04/02/2019'),
                Duration: 2,
                Progress: 30,
            },
        ],
    },
    {
        TaskID: 3,
        TaskName: 'Task 3',
        StartDate: new Date('04/02/2019'),
        Predecessor: '2FS',
        subtasks: [
            {
                TaskID: 4,
                TaskName: 'Task 4',
                StartDate: new Date('04/02/2019'),
                Duration: 2,
                Progress: 30,
            },
        ]
    },
];
export let crData1:Object[]=[

    {
      id: '62ed75125fb9e80015ae8ee7',
      TaskID: 'ITEM-002',
      taskId: 'ITEM-002',
      TaskName: 'testttts',
      StartDate: '2021-10-30T15:00:00.000Z',
      EndDate: '2022-02-18T01:00:00.000Z',
      Duration: 2,
      Progress: 62,
      parent: null,
      subTasks: [
        {
          id: '62ed76455fb9e80015ae94cf',
          TaskID: 'SUBITEM-003',
          TaskName: '1234',
          StartDate: '2021-10-30T15:00:00.000Z',
          EndDate: '2024-02-18T01:00:00.000Z',
          Duration: 2,
          Progress: 48,
          parent: '62ed75125fb9e80015ae8ee7',
          subTasks: [
            {
              id: '62ed65f94971860014766268',
              TaskID: 'LASTITEM-007',
              TaskName: '432111',
              StartDate: '2021-10-30T15:00:00.000Z',
              EndDate: '2024-02-18T01:00:00.000Z',
              Duration: 2,
              Progress: 48,
              parent: '62ed76455fb9e80015ae94cf',
              subTasks: [],
              rank: '4',
              PlannedStartDate: '2022-06-06T15:00:00.000Z',
              PlannedEndDate: '2022-12-30T01:00:00.000Z',
              Indicators: [],
              null: null,
            },
            {
              id: '62ed65f94971860a14766268',
              TaskID: 'LASTITEM-020',
              TaskName: 'UnscheduledTasks',
              StartDate: null,
              EndDate: null,
              Duration: 1,
              Progress: 48,
              parent: '62ed76455fb9e80015ae94cf',
              subTasks: [],
              rank: '4',
              PlannedStartDate: '2022-06-06T15:00:00.000Z',
              PlannedEndDate: '2022-12-30T01:00:00.000Z',
              Indicators: [],
              null: null,
            },
          ],
          rank: '3',
          PlannedStartDate: '2022-12-05T16:00:00.000Z',
          PlannedEndDate: '2022-12-30T01:00:00.000Z',
          Indicators: [],
          isExpand: true,
          null: null,
        },
        {
          id: '62ed766a286e530014580ad4',
          TaskID: 'SUBITEM-004',
          TaskName: '3333333333',
          StartDate: '2021-11-10T16:00:00.000Z',
          EndDate: '2022-10-01T00:00:00.000Z',
          Duration: 5,
          Progress: 100,
          parent: '62ed75125fb9e80015ae8ee7',
          subTasks: [
            {
              id: '62ed66454971860014766314',
              TaskID: 'LASTITEM-009',
              TaskName: '6555',
              StartDate: '2021-11-10T16:00:00.000Z',
              EndDate: '2022-10-01T00:00:00.000Z',
              Duration: 5,
              Progress: 100,
              parent: '62ed766a286e530014580ad4',
              subTasks: [],
              rank: '6',
              PlannedStartDate: '2022-08-08T15:00:00.000Z',
              PlannedEndDate: '2022-08-15T21:00:00.000Z',
              Indicators: [],
              null: null,
            },
          ],
          rank: '5',
          PlannedStartDate: null,
          PlannedEndDate: null,
          Indicators: [],
          isExpand: true,
          null: null,
        },
        {
          id: '62ed7q6a286e530014580ad4',
          TaskID: 'SUBITEM-019',
          TaskName: 'UnscheduledTasks',
          StartDate: null,
          EndDate: null,
          Duration: 1,
          Progress: 100,
          parent: '62ed75125fb9e80015ae8ee7',
          subTasks: [],
          rank: '5',
          PlannedStartDate: null,
          PlannedEndDate: null,
          Indicators: [],
          isExpand: true,
          null: null,
        },
        {
          id: '62ed7q6a286e530014580ad4',
          TaskID: 'SUBITEM-014',
          TaskName: 'UnscheduledTasks 2',
          StartDate: null,
          EndDate: null,
          Duration: 1,
          Progress: 100,
          parent: '62ed75125fb9e80015ae8ee7',
          subTasks: [
            {
              id: '62ed7q6a28pe530014580ad4',
              TaskID: 'LASTITEM-014',
              TaskName: 'UnscheduledTasks 2',
              StartDate: null,
              EndDate: null,
              Duration: 1,
              Progress: 100,
              parent: '62ed7q6a286e530014580ad4',
              subTasks: [],
              rank: '5',
              PlannedStartDate: null,
              PlannedEndDate: null,
              Indicators: [],
              isExpand: true,
              null: null,
            },
          ],
          rank: '5',
          PlannedStartDate: null,
          PlannedEndDate: null,
          Indicators: [],
          isExpand: true,
          null: null,
        },
      ],
      isExpand: true,
      rank: '0V',
      PlannedStartDate: '2022-12-05T16:00:00.000Z',
      PlannedEndDate: '2022-12-31T01:00:00.000Z',
      Indicators: [],
    },
    {
      id: '62ed75415fb9e80015ae8ffd',
      TaskID: 'ITEM-003',
      taskId: 'ITEM-003',
      TaskName: '123333',
      StartDate: '2022-10-05T15:00:00.000Z',
      EndDate: '2023-07-09T00:00:00.000Z',
      Duration: 7,
      Progress: 99,
      parent: null,
      subTasks: [
        {
          id: '62ed769c286e530014580be4',
          TaskID: 'SUBITEM-005',
          TaskName: '7777',
          StartDate: '2022-10-05T15:00:00.000Z',
          EndDate: '2023-07-09T00:00:00.000Z',
          Duration: 7,
          Progress: 100,
          parent: '62ed75415fb9e80015ae8ffd',
          subTasks: [
            {
              id: '62ed6547d69fd60014db8bc9',
              TaskID: 'LASTITEM-006',
              TaskName: '4',
              StartDate: '2022-12-01T16:00:00.000Z',
              EndDate: '2022-12-02T01:00:00.000Z',
              Duration: 1,
              Progress: 100,
              parent: '62ed769c286e530014580be4',
              subTasks: [],
              rank: '19',
              PlannedStartDate: null,
              PlannedEndDate: null,
              Indicators: [],
              null: null,
            },
            {
              id: '62ed668a4971860014766400',
              TaskID: 'LASTITEM-011',
              TaskName: 'Task',
              StartDate: '2023-03-31T15:00:00.000Z',
              EndDate: '2023-07-09T00:00:00.000Z',
              Duration: 100,
              Progress: 100,
              parent: '62ed769c286e530014580be4',
              subTasks: [],
              rank: '16',
              PlannedStartDate: null,
              PlannedEndDate: null,
              Indicators: [],
              null: null,
            },
            {
              id: '62ed66a14971860014766455',
              TaskID: 'LASTITEM-012',
              TaskName: 'Test',
              StartDate: '2022-10-05T15:00:00.000Z',
              EndDate: '2023-01-09T01:00:00.000Z',
              Duration: 96,
              Progress: 100,
              parent: '62ed769c286e530014580be4',
              subTasks: [],
              rank: '17',
              PlannedStartDate: '2022-08-08T15:00:00.000Z',
              PlannedEndDate: '2022-08-15T21:00:00.000Z',
              Indicators: [],
              null: null,
            },
            {
              id: '62ed66c749718600147664ac',
              TaskID: 'LASTITEM-013',
              TaskName: 'Test 2',
              StartDate: '2023-02-19T16:00:00.000Z',
              EndDate: '2023-02-20T01:00:00.000Z',
              Duration: 1,
              Progress: 100,
              parent: '62ed769c286e530014580be4',
              subTasks: [],
              rank: '18',
              PlannedStartDate: null,
              PlannedEndDate: null,
              Indicators: [],
              null: null,
            },
          ],
          rank: '15',
          PlannedStartDate: null,
          PlannedEndDate: null,
          Indicators: [],
          isExpand: true,
          null: null,
        },
        {
          id: '62ed76be286e530014580c83',
          TaskID: 'SUBITEM-006',
          TaskName: '7777',
          StartDate: '2023-01-16T16:00:00.000Z',
          EndDate: '2023-01-17T01:00:00.000Z',
          Duration: 1,
          Progress: 0,
          parent: '62ed75415fb9e80015ae8ffd',
          subTasks: [],
          rank: '20',
          PlannedStartDate: null,
          PlannedEndDate: null,
          Indicators: [],
          null: null,
        },
      ],
      isExpand: true,
      rank: '1',
      PlannedStartDate: null,
      PlannedEndDate: null,
      Indicators: [
        {
          date: '10/18/2022',
          name: 'test 3',
          color: '#66b032',
          tooltip: '3',
          iconClass: 'e-icons e-icons lock',
          id: '058a35ec',
          taskId: '62ed75415fb9e80015ae8ffd',
        },
      ],
    },

  ]

  export let totalDurationData: Object[] = [
    {
        TaskID: 10847,
        TaskName: 'T010847: Purchase',
        StartDate: null,
        Duration: null,
        EndDate: null,
        ParentID: 10845,
        Predecessors: '',
        IsManual: false,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10848,
        TaskName: 'T010848: Setup Room',
        StartDate: null,
        Duration: null,
        EndDate: null,
        ParentID: 10845,
        Predecessors: '',
        IsManual: false,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10849,
        TaskName: 'T010849: Install',
        StartDate: null,
        Duration: null,
        EndDate: null,
        ParentID: 10845,
        Predecessors: '',
        IsManual: false,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10850,
        TaskName: 'T010850: Handover',
        StartDate: null,
        Duration: null,
        EndDate: null,
        ParentID: 10845,
        Predecessors: '',
        IsManual: false,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10851,
        TaskName: 'T010851: Add new Room to J28 Room List',
        StartDate: null,
        Duration: null,
        EndDate: null,
        ParentID: 10845,
        Predecessors: '',
        IsManual: false,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 1611,
        TaskName: 'T001611: Define appropriate conferencing tools',
        StartDate: '2020-11-24T15:25:42.000Z',
        Duration: 602.758483796296,
        EndDate: '2022-07-20T09:37:55.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 1603,
        TaskName: 'T001603: Conference facilities',
        StartDate: '2021-03-05T09:20:04.000Z',
        Duration: 1,
        EndDate: '2021-03-06T09:20:04.000Z',
        Predecessors: '',
        IsManual: true,
        Progress: 50,
        Status: 'started',
        CategoryID: 106,
        Resources: null,
    },
    {
        TaskID: 1614,
        TaskName: 'T001614: Audit conference setup - J28',
        StartDate: '2022-03-23T14:34:34.000Z',
        Duration: 0.000324074074074074,
        EndDate: '2022-03-23T14:35:02.000Z',
        ParentID: 1603,
        Predecessors: '1611FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 1612,
        TaskName: 'T001612: Audit conference setup Boscawen House',
        StartDate: '2022-03-24T10:04:14.000Z',
        Duration: 0.242152777777778,
        EndDate: '2022-03-24T15:52:56.000Z',
        ParentID: 1603,
        Predecessors: '1611FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 8827,
        TaskName: 'T008827: Define the Conferencing Standard',
        StartDate: '2022-06-14T14:01:03.000Z',
        Duration: 61.8201041666667,
        EndDate: '2022-08-15T09:42:00.000Z',
        ParentID: 1603,
        Predecessors: '1611FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8957,
        TaskName: 'T008957: Purchase',
        StartDate: '2022-08-01T08:40:00.000Z',
        Duration: 14,
        EndDate: '2022-08-15T08:40:00.000Z',
        ParentID: 8954,
        Predecessors: '8956FS',
        IsManual: true,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8954,
        TaskName: 'T008954: DID Paignton Boardroom Video Conferencing Setup',
        StartDate: '2022-08-01T09:42:55.000Z',
        Duration: 60,
        EndDate: '2022-09-30T09:42:55.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 50,
        Status: 'started',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 8955,
        TaskName: 'T008955: Review and Scope',
        StartDate: '2022-08-01T09:42:55.000Z',
        Duration: 0.0000462962962962963,
        EndDate: '2022-08-01T09:42:59.000Z',
        ParentID: 8954,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8956,
        TaskName: 'T008956: Quote',
        StartDate: '2022-08-01T09:44:12.000Z',
        Duration: 0.0000347222222222222,
        EndDate: '2022-08-01T09:44:15.000Z',
        ParentID: 8954,
        Predecessors: '8955FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8948,
        TaskName: 'T008948: Yealink Setup Guide (ICT)',
        StartDate: '2022-08-10T18:06:30.000Z',
        Duration: 0.000347222222222222,
        EndDate: '2022-08-10T18:07:00.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8542,
        TaskName: 'T008542: RHF Boardroom Video Conferencing Setup',
        StartDate: '2022-08-10T18:09:11.000Z',
        Duration: 21.8409953703704,
        EndDate: '2022-09-01T14:20:13.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 8543,
        TaskName: 'T008543: Gather quotes and Order Equipment',
        StartDate: '2022-08-10T18:09:11.000Z',
        Duration: 0.000324074074074074,
        EndDate: '2022-08-10T18:09:39.000Z',
        ParentID: 8542,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8959,
        TaskName: 'T008959: Installation',
        StartDate: '2022-08-10T18:10:03.000Z',
        Duration: 0.000428240740740741,
        EndDate: '2022-08-10T18:10:40.000Z',
        ParentID: 8542,
        Predecessors: '8543FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9183,
        TaskName: 'T009183: Design and Spec a "Huddle Space" Conference Setup',
        StartDate: '2022-08-11T13:17:56.000Z',
        Duration: 0.000509259259259259,
        EndDate: '2022-08-11T13:18:40.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9267,
        TaskName: 'T009267: Boardroom Video Conferencing Setup - CFL Liverton',
        StartDate: '2022-08-11T13:44:29.000Z',
        Duration: 20.3105671296296,
        EndDate: '2022-08-31T21:11:42.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 9268,
        TaskName: 'T009268: Handover',
        StartDate: '2022-08-11T13:44:29.000Z',
        Duration: 20.3104976851852,
        EndDate: '2022-08-31T21:11:36.000Z',
        ParentID: 9267,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 125,
        Resources: null,
    },
    {
        TaskID: 8958,
        TaskName: 'T008958: Handover',
        StartDate: '2022-08-14T23:00:00.000Z',
        Duration: 7,
        EndDate: '2022-08-21T23:00:00.000Z',
        ParentID: 8954,
        Predecessors: '8957FS',
        IsManual: true,
        Progress: 0,
        Status: 'not-started',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8949,
        TaskName: 'T008949: User Guides (End User)',
        StartDate: '2022-08-15T09:43:35.000Z',
        Duration: 0.0000347222222222222,
        EndDate: '2022-08-15T09:43:38.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9315,
        TaskName: 'T009315: GVH J28 Huddle Space Video Conferencing Setup',
        StartDate: '2022-08-18T14:21:50.000Z',
        Duration: 172.827905092593,
        EndDate: '2023-02-07T10:14:01.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 9316,
        TaskName: 'T009316: Review and Scope',
        StartDate: '2022-08-18T14:21:50.000Z',
        Duration: 0.0000231481481481481,
        EndDate: '2022-08-18T14:21:52.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9321,
        TaskName: 'T009321: J28 Boardroom Video Conferencing Setup',
        StartDate: '2022-08-18T14:33:27.000Z',
        Duration: 172.820243055556,
        EndDate: '2023-02-07T10:14:36.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 9322,
        TaskName: 'T009322: Review and Scope',
        StartDate: '2022-08-18T14:33:27.000Z',
        Duration: 0.0000347222222222222,
        EndDate: '2022-08-18T14:33:30.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 8960,
        TaskName: 'T008960: Handover',
        StartDate: '2022-09-01T14:20:01.000Z',
        Duration: 0.0000231481481481481,
        EndDate: '2022-09-01T14:20:03.000Z',
        ParentID: 8542,
        Predecessors: '8959FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9517,
        TaskName: 'T009517: GVH (BCH) Boardroom Video Conferencing Displays',
        StartDate: '2022-09-21T14:34:58.000Z',
        Duration: 123.885416666667,
        EndDate: '2023-01-23T11:49:58.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 9518,
        TaskName: 'T009518: Scope',
        StartDate: '2022-09-21T14:34:58.000Z',
        Duration: 0.0000347222222222222,
        EndDate: '2022-09-21T14:35:01.000Z',
        ParentID: 9517,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9519,
        TaskName: 'T009519: Quote',
        StartDate: '2022-09-21T14:35:58.000Z',
        Duration: 0.000219907407407407,
        EndDate: '2022-09-21T14:36:17.000Z',
        ParentID: 9517,
        Predecessors: '9518FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9520,
        TaskName: 'T009520: Order',
        StartDate: '2022-09-21T14:37:55.000Z',
        Duration: 123.882916666667,
        EndDate: '2023-01-23T11:49:19.000Z',
        ParentID: 9517,
        Predecessors: '9519FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9323,
        TaskName: 'T009323: Quote',
        StartDate: '2022-12-29T09:18:26.000Z',
        Duration: 8.07075231481481,
        EndDate: '2023-01-06T11:00:19.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9317,
        TaskName: 'T009317: Quote',
        StartDate: '2023-01-06T10:58:19.000Z',
        Duration: 0.000625,
        EndDate: '2023-01-06T10:59:13.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9318,
        TaskName: 'T009318: Purchase',
        StartDate: '2023-01-06T11:00:08.000Z',
        Duration: 5.92782407407407,
        EndDate: '2023-01-12T09:16:12.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9324,
        TaskName: 'T009324: Purchase',
        StartDate: '2023-01-06T11:00:36.000Z',
        Duration: 5.92813657407407,
        EndDate: '2023-01-12T09:17:07.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10606,
        TaskName: 'T010606: Setup Room',
        StartDate: '2023-01-13T15:06:14.000Z',
        Duration: 9.86025462962963,
        EndDate: '2023-01-23T11:45:00.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9325,
        TaskName: 'T009325: Install',
        StartDate: '2023-01-23T11:41:30.000Z',
        Duration: 14.9384027777778,
        EndDate: '2023-02-07T10:12:48.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9319,
        TaskName: 'T009319: Install',
        StartDate: '2023-01-23T11:42:32.000Z',
        Duration: 14.9372337962963,
        EndDate: '2023-02-07T10:12:09.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9666,
        TaskName: 'T009666: Installation',
        StartDate: '2023-01-23T11:49:33.000Z',
        Duration: 0.000231481481481481,
        EndDate: '2023-01-23T11:49:53.000Z',
        ParentID: 9517,
        Predecessors: '9520FS',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9326,
        TaskName: 'T009326: Handover',
        StartDate: '2023-01-30T16:11:41.000Z',
        Duration: 7.75125,
        EndDate: '2023-02-07T10:13:29.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 9320,
        TaskName: 'T009320: Handover',
        StartDate: '2023-01-30T16:11:42.000Z',
        Duration: 7.75135416666667,
        EndDate: '2023-02-07T10:13:39.000Z',
        ParentID: 9315,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10607,
        TaskName: 'T010607: Setup Room Account',
        StartDate: '2023-02-07T10:14:12.000Z',
        Duration: 0.000173611111111111,
        EndDate: '2023-02-07T10:14:27.000Z',
        ParentID: 9321,
        Predecessors: '',
        IsManual: true,
        Progress: 100,
        Status: 'finished',
        CategoryID: 103,
        Resources: null,
    },
    {
        TaskID: 10845,
        TaskName:
            'T010845: GVH J28 Upstairs Office (Matthews) Video Conferencing Setup',
        StartDate: '2023-02-07T15:43:43.000Z',
        Duration: 1,
        EndDate: '2023-02-08T15:43:43.000Z',
        ParentID: 1603,
        Predecessors: '',
        IsManual: true,
        Progress: 50,
        Status: 'started',
        CategoryID: 105,
        Resources: null,
    },
    {
        TaskID: 10846,
        TaskName: 'T010846: Quote',
        StartDate: '2023-02-07T15:43:43.000Z',
        Duration: 1,
        EndDate: '2023-02-08T15:43:43.000Z',
        ParentID: 10845,
        Predecessors: '',
        IsManual: true,
        Progress: 50,
        Status: 'started',
        CategoryID: 103,
        Resources: null,
    },
];

export let customSelfReferenceData: Object[] = [
    {
        'TaskID': 1, 'TaskName': 'Parent Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40'
    },
    {
        'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 2
    },
    {
        'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 5, 'TaskName': 'Parent Task 2', 'StartDate': new Date('03/14/2017'),
        'EndDate': new Date('03/18/2017'), 'Progress': '40', 'parentID': 4
    },
];
export let customCRData: Object[]  = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/01/2019'),
        Duration: 2
    },
    { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1fs-1" },
];
export let resourceviewData: object[]=[
    {
        oppgaveId: '6',
        oppgaveNavn: 'Task1',
        fraDato: '2023-01-02T07:00:00.000Z',
        tilDato: '2023-01-02T16:00:00.000Z',
        varighet: 1,
        resources: [
          {
            brukerId: 9,
            navn: 'John ',
            unit: 100,
          },
        ],
      },

      {
        oppgaveId: '7',
        oppgaveNavn: 'Task2',
        fraDato: '2023-01-03T07:00:00.000Z',
        tilDato: '2023-01-04T16:00:00.000Z',
        varighet: 2,
        resources: [
          {
            brukerId: 9,
            navn: 'John ',
            unit: 100,
          },
        ],
      },
];

export let crData: Object[] = [
    {
        startDate: '2022-08-12T00:00:00.000Z',
        estimatedCompletionDate: '2022-08-18T00:00:00.000Z',
        name: 'Product Concept',
        runningId: 9668,
        dependency: '9661FS',
        duration: 5,
        progress: 2,
        child: [
            {
                startDate: '2022-08-12T00:00:00.000Z',
                estimatedCompletionDate: '2022-08-13T00:00:00.000Z',
                name: 'Defining the product and its usage',
                runningId: 9672,
                duration: 0,
                progress: 0,
                child: [],
            },
            {
                startDate: '2022-08-13T00:00:00.000Z',
                estimatedCompletionDate: '2022-08-14T00:00:00.000Z',
                name: 'Defining target audience',
                runningId: 9673,
                dependency: '9672FS',
                duration: 0,
                progress: 0,
                child: [],
            },
            {
                actualStartDate: '2022-09-19T11:44:16.877Z',
                actualCompletionDate: '2022-09-19T11:46:52.436Z',
                startDate: '2022-08-14T00:00:00.000Z',
                estimatedCompletionDate: '2022-08-15T00:00:00.000Z',
                name: 'Prepare product sketch and notes',
                runningId: 9676,
                dependency: '9673FS',
                duration: 0,
                progress: 7,
                child: [],
            },
            {
                startDate: '2022-08-15T00:00:00.000Z',
                estimatedCompletionDate: '2022-08-16T00:00:00.000Z',
                name: 'Concept Approval',
                runningId: 9675,
                dependency: '9676FS',
                duration: 0,
                progress: 0,
                child: [],
            },
            {
                startDate: '2022-08-16T00:00:00.000Z',
                estimatedCompletionDate: '2022-08-18T00:00:00.000Z',
                name: 'Market Research',
                runningId: 9740,
                dependency: '9675FS',
                duration: 1,
                progress: 0,
                child: [],
            },
        ],
    }
];
export let autoDateCalculate: object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), EndDate: new Date('04/07/2019'), Duration: 6, Progress: 30,subtasks: [
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), EndDate: new Date('04/04/2019'), Duration: 3 },
            ] },
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
];
export let filterdata: object[]=[
    {
        TaskID: 1,
        TaskName: 'Launch and flight to lunar orbit',
        StartDate: new Date('07/16/1969'),
        EndDate: new Date('07/16/1969'),
        Duration: 0,
 }];

export let baselineDatas: Object[] = [
    {
      TaskId: 1,
      TaskName: 'Receive vehicle and create job card',
      BaselineStartDate: new Date('03/05/2018 10:00:00 AM'),
      BaselineEndDate: new Date('03/05/2018 10:00:00 AM'),
      StartDate: new Date('03/05/2018 10:00:00 AM'),
      EndDate: new Date('03/05/2018 10:00:00 AM'),
    },
    {
      TaskId: 2,
      TaskName: 'Allot mechanic and send vehicle to service bay',
      BaselineStartDate: new Date('03/05/2018 10:00:00 AM'),
      BaselineEndDate: new Date('03/05/2018 10:30:00 AM'),
      StartDate: new Date('03/05/2018 10:15:00 AM'),
      EndDate: new Date('03/05/2018 10:15:00 AM'),
    },
    {
      TaskId: 3,
      TaskName: 'Change the receive vehicle and create job cardengine oil',
      BaselineStartDate: new Date('03/05/2018 10:15:00 AM'),
      BaselineEndDate: new Date('03/05/2018 11:45:00 AM'),
      StartDate: new Date('03/05/2018 10:35:00 AM'),
      EndDate: new Date('03/05/2018 10:40:00 AM'),
    },
  ];
export let data : Object[]=[
    {
        'resourceInfo': [1], 'TaskId': 1, 'TaskName': 'Start-Duration', 'cusClass': 'cusclass',
        'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80,
        'Indicators': [
            {
                'date': '10/29/2017',
                'iconCls': 'fas fa-cat',
                'name': 'Custom String',
                'tooltip': 'Follow up'
            },
            {
                'date': '11/1/2017',
                'iconCls': 'fas fa-dragon',
                'name': '<span style="color:red">String Template</span>',
                'tooltip': 'Review results'
            }
        ]
    },
    {
        'resourceInfo': [2], 'TaskId': 2, 'TaskName': 'Start-End',
        'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1'
    },
    {
        'resourceInfo': [2], 'TaskId': 3, 'TaskName': 'Duration-End',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS'
    },
    {
        'resourceInfo': [2], 'TaskId': 4, 'TaskName': 'Duration-alone',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65,
    },
    {
        'resourceInfo': [2], 'TaskId': 5, 'TaskName': 'StartDate-alone',
        StartDate: new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Predecessor': '2'
    },
    {
        'resourceInfo': [2], 'TaskId': 6, 'TaskName': 'EndDate-alone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65
    },
    {
        'resourceInfo': [2], 'TaskId': 7, 'TaskName': 'Milestone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, Duration: 0
    },
]
export let data1: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('02/27/2017'),
        'Duration': 0,
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('02/27/2017'), 'Duration': 0, 'Progress': '40'
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('02/27/2017'), 'Progress': '40', 'Duration': 0, 'isManual': true
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('02/27/2017'), 'Duration': 0, 'Progress': '40',
            }
        ]
    }]
export let data2: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'), BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/01/2019'), Duration: 0, Predecessor: "2", Progress: 30,
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 0, Progress: 30 },
            {
                TaskID: 3, TaskName: 'Defining target audience', Duration: 0,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/01/2019'), Duration: 1, Predecessor: "2", Progress: 30 },
        ]
    }]
export let data3: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40'
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40',
            }
        ]
    }]
export let data4: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    }]
export let scheduleModeData1: Object[] = [
    {
        "TaskID": 1,
        "TaskName": "<i>Parent Task 1</i>",
        "StartDate": new Date("02/27/2017"),
        "EndDate": new Date("03/03/2017"),
        "Progress": "40",
        "isManual" : true,
        resources: [1],
        "Children": [
             { "TaskID": 2, resources: [2,3],"TaskName": "Child Task 1", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40" },
             { "TaskID": 3, "TaskName": "Child Task 2", "StartDate": new Date("02/26/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40","isManual": true },
             { "TaskID": 4, "TaskName": "Child Task 3", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Duration": 5, "Progress": "40", }
        ]
    },
    {
        "TaskID": 5,
        "TaskName": "Parent Task 2",
        "StartDate": new Date("03/05/2017"),
        "EndDate": new Date("03/09/2017"),
        "Progress": "40",
        "isManual": true,
        "Children": [
             { "TaskID": 6, "TaskName": "Child Task 1", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40" },
             { "TaskID": 7, "TaskName": "Child Task 2", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40", },
             { "TaskID": 8, "TaskName": "Child Task 3", "StartDate": new Date("02/28/2017"), "EndDate": new Date("03/05/2017"), "Progress": "40","isManual":true },
             { "TaskID": 9, "TaskName": "Child Task 4", "StartDate": new Date("03/04/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40","isManual":true }
        ]
    },
    {
        "TaskID": 10,
        "TaskName": "Parent Task 3",
        "StartDate": new Date("03/13/2017"),
        "EndDate": new Date("03/17/2017"),
        "Progress": "40",
        "Children": [
             { "TaskID": 11, "TaskName": "Child Task 1", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40" },
             { "TaskID": 12, "TaskName": "Child Task 2", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
             { "TaskID": 13, "TaskName": "Child Task 3", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
             { "TaskID": 14, "TaskName": "Child Task 4", "StartDate": new Date("03/12/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40","isManual":true },
             { "TaskID": 15, "TaskName": "Child Task 5", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", }
        ]
    }
];


export let filteredData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Launch and flight to lunar orbit',
        StartDate: new Date('07/16/1969'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Apollo 11 blasts off from launch pad', StartDate: new Date('07/16/1969 03:32:00 AM'),
                EndDate: new Date('07/16/1969 03:32:00 AM'), Duration: 0,
            },
            {
                TaskID: 3, TaskName: 'Entry to Earth’s orbit', StartDate: new Date('07/16/1969 03:32:00 AM'),
                EndDate: new Date('07/16/1969 03:44:00 AM'), Predecessor: '2FS'
            },
            {
                TaskID: 4, TaskName: 'Travelling in earth’s orbit', StartDate: new Date('07/16/1969 03:44:00 AM'),
                EndDate: new Date('07/16/1969 04:22:13 AM'), Predecessor: '3FS'
            },
            {
                TaskID: 5, TaskName: 'Trajectory change toward the Moon', StartDate: new Date('07/16/1969 04:22:13 AM'),
                EndDate: new Date('07/16/1969 04:52:00 AM'), Predecessor: '4FS'
            },
            {
                TaskID: 6, TaskName: 'Extraction maneuver performed', StartDate: new Date('07/16/1969 04:52:00 AM'),
                EndDate: new Date('07/16/1969 04:52:00 AM'), Predecessor: '5FS'
            },
            {
                TaskID: 7, TaskName: 'Travelling toward moon and entering into lunar orbit', StartDate: new Date('07/16/1969 04:52:00 AM'),
                EndDate: new Date('07/16/1969 04:21:50 PM'), Predecessor: '6FS'
            },
            {
                TaskID: 8, TaskName: 'Midcourse correction, sharpening the course and testing the engine',
                StartDate: new Date('07/16/1969 11:22:00 PM'), EndDate: new Date('07/17/1969 05:21:50 AM')
            },
            {
                TaskID: 9, TaskName: 'Reached half the distance spanning between earth and moon',
                StartDate: new Date('07/17/1969 05:22:00 AM'), EndDate: new Date('07/17/1969 08:00:50 PM')
            },
            {
                TaskID: 10, TaskName: 'Reached 3/4th distance spanning between earth and moon',
                StartDate: new Date('07/17/1969 8:02:00 PM'), EndDate: new Date('07/18/1969 04:21:50 PM')
            },
            {
                TaskID: 11, TaskName: 'Reached distance 45000 miles from moon',
                StartDate: new Date('07/18/1969 11:22:00 PM'), EndDate: new Date('07/19/1969 05:21:50 PM')
            },
        ]
    },
    {
        TaskID: 12,
        TaskName: 'Lunar descent',
        StartDate: new Date('07/19/1969 05:21:50 PM'),
        subtasks: [
            {
                TaskID: 13, TaskName: 'Lunar Orbiting (30 orbits)', StartDate: new Date('07/19/1969 05:21:50 PM'),
                EndDate: new Date('07/20/1969 12:52:00 AM'), Predecessor: '11FS'
            },
            {
                TaskID: 14, TaskName: 'Landing site identified', StartDate: new Date('07/20/1969 12:52:00 AM'),
                EndDate: new Date('07/20/1969 12:52:00 AM'), Predecessor: '13FS'
            },
            {
                TaskID: 15, TaskName: 'Eagle separated from Columbia.', StartDate: new Date('07/20/1969 05:44:00 PM'),
                EndDate: new Date('07/20/1969 05:44:00 PM')
            },
            {
                TaskID: 16, TaskName: 'Eagle’s decent to Moon', StartDate: new Date('07/20/1969 05:44:00 PM'),
                EndDate: new Date('07/20/1969 08:16:40 PM'), Predecessor: '15FS'
            }
        ]
    },
    {
        TaskID: 17,
        TaskName: 'Landing',
        StartDate: new Date('07/20/1969 08:17:40 PM'),
        subtasks: [
            {
                TaskID: 18, TaskName: 'Eagle’s touch down', StartDate: new Date('07/20/1969 08:17:40 PM'),
                EndDate: new Date('07/20/1969 08:17:40 PM')
            },
            {
                TaskID: 19, TaskName: 'Radio communication and Performing post landing checklist',
                StartDate: new Date('07/20/1969 08:17:40 PM'), EndDate: new Date('07/20/1969 11:43:00 PM'), Predecessor: '18FS'
            },
            {
                TaskID: 20, TaskName: 'Preparations for EVA (Extra Vehicular Activity)',
                StartDate: new Date('07/20/1969 11:43:00 PM'), EndDate: new Date('07/21/1969 02:39:33 AM'), Predecessor: '19FS'
            },
            {
                TaskID: 21, TaskName: 'Hatch open and climbing down the moon', StartDate: new Date('07/21/1969 02:39:33 AM'),
                EndDate: new Date('07/21/1969 02:56:15 AM'), Predecessor: '20FS'
            },
            {
                TaskID: 22, TaskName: 'Armstrong stepped down on the moon', StartDate: new Date('07/21/1969 02:56:15 AM'),
                EndDate: new Date('07/21/1969 03:11:00 AM'), Predecessor: '21FS'
            },
        ]
    },
    {
        TaskID: 23,
        TaskName: 'Lunar surface operations',
        StartDate: new Date('07/21/1969'),
        subtasks: [
            {
                TaskID: 24, TaskName: 'Soil sample collections', StartDate: new Date('07/21/1969 02:56:15 AM'),
                EndDate: new Date('07/21/1969 03:11:00 AM')
            },
            {
                TaskID: 25, TaskName: 'Aldrin joined Armstrong', StartDate: new Date('07/21/1969 03:11:00 AM'),
                EndDate: new Date('07/21/1969 03:41:00 AM'), Predecessor: '24FS'
            },
            {
                TaskID: 26, TaskName: 'Planted the Lunar Flag Assembly', StartDate: new Date('07/21/1969 03:41:00 AM'),
                EndDate: new Date('07/21/1969 03:46:00 AM'), Predecessor: '25FS'
            },
            {
                TaskID: 27, TaskName: 'President Richard Nixon’s telephone-radio transmission ',
                StartDate: new Date('07/21/1969 03:48:00 AM'), EndDate: new Date('07/21/1969 03:51:00 AM')
            },
            {
                TaskID: 28, TaskName: 'Collect rock samples, photos and other mission controls',
                StartDate: new Date('07/21/1969 03:52:00 AM'), EndDate: new Date('07/21/1969 04:50:00 AM')
            },
        ]
    },
    {
        TaskID: 29,
        TaskName: 'Lunar ascent',
        StartDate: new Date('07/21/1969'),
        subtasks: [
            {
                TaskID: 30, TaskName: 'Climbing the eagle to ascent', StartDate: new Date('07/21/1969 04:51:00 AM'),
                EndDate: new Date('07/21/1969 05:00:00 AM')
            },
            {
                TaskID: 31, TaskName: 'Hatch closing', StartDate: new Date('07/21/1969 05:01:00 AM'),
                EndDate: new Date('07/21/1969 05:01:00 AM'), Predecessor: '30FS'
            },
            {
                TaskID: 32, TaskName: 'Final housekeeping', StartDate: new Date('07/21/1969 05:02:00 AM'),
                EndDate: new Date('07/21/1969 08:00:00 AM')
            },
            {
                TaskID: 33, TaskName: 'Resting of astronauts', StartDate: new Date('07/21/1969 08:00:00 AM'),
                EndDate: new Date('07/21/1969 03:00:00 PM'), Predecessor: '32FS'
            },
            {
                TaskID: 34, TaskName: 'Preparation for lift off and Ascent engine started', StartDate: new Date('07/21/1969 03:00:00 PM'),
                EndDate: new Date('07/21/1969 05:54:00 PM'), Predecessor: '33FS'
            },
            {
                TaskID: 35, TaskName: 'Eagle lifted off', StartDate: new Date('07/21/1969 05:54:00 PM'),
                EndDate: new Date('07/21/1969 05:54:00 PM'), Predecessor: '34FS'
            },
            {
                TaskID: 36, TaskName: 'Eagle’s travel toward Columbia', StartDate: new Date('07/21/1969 05:54:00 PM'),
                EndDate: new Date('07/21/1969 09:23:00 PM'), Predecessor: '35FS'
            },
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Return',
        StartDate: new Date('07/21/1969 09:24:00 PM'),
        subtasks: [
            {
                TaskID: 38, TaskName: 'Eagle docked with Columbia', StartDate: new Date('07/21/1969 09:24:00 PM'),
                EndDate: new Date('07/21/1969 09:35:00 PM')
            },
            {
                TaskID: 39, TaskName: 'Eagle’s ascent stage jettisoned into lunar orbit', StartDate: new Date('07/21/1969 09:35:00 PM'),
                EndDate: new Date('07/21/1969 11:41:00 PM'), Predecessor: '38FS'
            },
        ]
    },
    {
        TaskID: 40,
        TaskName: 'Decent toward earth  and Splashdown',
        StartDate: new Date('07/21/1969'),
        subtasks: [
            {
                TaskID: 41, TaskName: 'Spacecraft reaches 1/4th distance spanning between moon and earth',
                StartDate: new Date('07/21/1969 11:50:00 PM'), EndDate: new Date('07/22/1969 04:40:00 PM')
            },
            {
                TaskID: 42, TaskName: 'Spacecraft travels to midway point of journey',
                StartDate: new Date('07/22/1969 04:40:00 PM'), EndDate: new Date('07/23/1969 04:00:00 PM'), Predecessor: '41FS'
            },
            {
                TaskID: 43, TaskName: 'Spacecraft travels to 3/4th point of journey', StartDate: new Date('07/23/1969 04:40:00 PM'),
                EndDate: new Date('07/24/1969 10:00:00 AM'), Predecessor: '42FS'
            },
            {
                TaskID: 44, TaskName: 'Crew prepares for splashdown', StartDate: new Date('07/24/1969 11:47:00 AM'),
                EndDate: new Date('07/24/1969 04:20:00 PM')
            },
            {
                TaskID: 45, TaskName: 'Command and service modules separates', StartDate: new Date('07/24/1969 04:20:00 PM'),
                EndDate: new Date('07/24/1969 04:35:00 PM'), Predecessor: '44FS'
            },
            {
                TaskID: 46, TaskName: 'Command module re-enters the Earth’s atmosphere', StartDate: new Date('07/24/1969 04:35:00 PM'),
                EndDate: new Date('07/24/1969 04:50:00 PM'), Predecessor: '45FS'
            },
            {
                TaskID: 47, TaskName: 'Spacecraft splashes near USS hornet', StartDate: new Date('07/24/1969 04:51:00 PM'),
                EndDate: new Date('07/24/1969 04:51:00 PM')
            },
        ]
    }
  ];
  let tempData: any[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        Duration:5,
        resources: [1 , 2 , 3] ,
        EndDate: new Date('04/21/2019'),
        parentID: 0
    },
    {
        TaskID: 2,
        TaskName: 'Defining the product and its usage',
        StartDate: new Date('04/02/2019'),
        Duration: 3,

        resources: [1 , 3 , 5] ,
        Progress: 30,
        parentID: 1
    },
    {
        TaskID: 3,
        TaskName: 'Defining target audience',
        StartDate: new Date('04/02/2019'),
        parentID: 1,
        resources: [1 , 3 , 5 , 6] ,
        Duration: 3
    },
    {
        TaskID: 4,
        TaskName: 'Prepare product sketch and notes',
        StartDate: new Date('04/05/2019'),
        Duration: 2,
        resources: [2 , 4 , 6] ,
        parentID: 1,
        Progress: 30
    },
    {
        TaskID: 5,
        TaskName: 'Concept approval',
        StartDate: new Date('04/08/2019'),
        parentID: 0,
        Duration: 0
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/09/2019'),
        Duration:8,
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 7,
        TaskName: 'Demand analysis',
        StartDate: new Date('04/09/2019'),
        Duration:4,
        resources: [2 , 3 ,  4 , 6] ,
        EndDate: new Date('04/21/2019'),
        parentID: 6
    },
    {
        TaskID: 8,
        TaskName: 'Customer strength',
        StartDate: new Date('04/09/2019'),
        Duration: 4,
        parentID: 7,
        Progress: 30
    },
    {
        TaskID: 9,
        TaskName: 'Market opportunity analysis',
        StartDate: new Date('04/09/2019'),
        resources: [2 , 4 , 6],
        Duration: 4,
        parentID: 7
    },
    {
        TaskID: 10,
        TaskName: 'Competitor analysis',
        StartDate: new Date('04/15/2019'),
        Duration: 4,
        resources: [1,2],
        parentID: 6,
        Progress: 30
    },
    {
        TaskID: 11,
        TaskName: 'Product strength analsysis',
        StartDate: new Date('04/15/2019'),
        resources: [2 , 4 , 6],
        Duration: 4,
        parentID: 6
    },
    {
        TaskID: 12,
        TaskName: 'Research complete',
        StartDate: new Date('04/18/2019'),
        Duration: 0,
        parentID: 6
    },
    {
        TaskID: 13,
        TaskName: 'Product design and development',
        Duration:109,
        StartDate: new Date('04/19/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 14,
        TaskName: 'Functionality design',
        StartDate: new Date('04/19/2019'),
        resources: [1 , 3 , 5 , 6] ,
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 15,
        TaskName: 'Quality design',
        StartDate: new Date('04/19/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 16,
        TaskName: 'Define reliability',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 13
    },
    {
        TaskID: 17,
        TaskName: 'Identifying raw materials',
        StartDate: new Date('04/24/2019'),
        Duration: 2,
        parentID: 13
    },
    {
        TaskID: 18,
        TaskName: 'Define cost plan',
        StartDate: new Date('04/26/2019'),
        Duration:2,
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 19,
        TaskName: 'Manufacturing cost',
        StartDate: new Date('04/26/2019'),
        Duration: 2,
        Progress: 30,
        parentID: 18
    },
    {
        TaskID: 20,
        TaskName: 'Selling cost',
        StartDate: new Date('04/26/2019'),
        resources: [2 , 3 , 5] ,
        Duration: 2,
        parentID: 18
    },
    {
        TaskID: 21,
        TaskName: 'Development of the final design',
        Duration:7,
        StartDate: new Date('04/30/2019'),
        parentID: 13,
        EndDate: new Date('04/21/2019')
    },
    {
        TaskID: 22,
        TaskName: 'Defining dimensions and package volume',
        StartDate: new Date('04/30/2019'),
        Duration: 2,
        parentID: 21,
        Progress: 30
    },
    {
        TaskID: 23,
        TaskName: 'Develop design to meet industry standards',
        StartDate: new Date('05/02/2019'),
        Duration: 2,
        parentID: 21
    },
    {
        TaskID: 24,
        TaskName: 'Include all the details',
        StartDate: new Date('05/06/2019'),
        Duration: 3,
        parentID: 21
    },
    {
        TaskID: 25,
        TaskName: 'CAD computer-aided design',
        StartDate: new Date('05/09/2019'),
        Duration: 3,
        parentID: 13,
        Progress: 30
    },
    {
        TaskID: 26,
        TaskName: 'CAM computer-aided manufacturing',
        StartDate: new Date('09/14/2019'),
        Duration: 3,
        parentID: 13
    },
    {
        TaskID: 27,
        TaskName: 'Design complete',
        StartDate: new Date('05/16/2019'),
        Duration: 0,
        parentID: 13
    },
    {
        TaskID: 28,
        TaskName: 'Prototype testing',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 29,
        TaskName: 'Include feedback',
        StartDate: new Date('05/17/2019'),
        Duration: 4,
        parentID: 0
    },
    {
        TaskID: 30,
        TaskName: 'Manufacturing',
        StartDate: new Date('05/23/2019'),
        Duration: 5,
        Progress: 30,
        parentID: 0
    },
    {
        TaskID: 31,
        TaskName: 'Assembling materials to finsihed goods',
        StartDate: new Date('05/30/2019'),
        Duration: 5,
        parentID: 0
    },
    {
        TaskID: 32,
        TaskName: 'Feedback and testing',
        StartDate: new Date('06/06/2019'),
        Duration: 6,
        parentID: 0,
        EndDate: new Date('06/13/2019'),
    },
    {
        TaskID: 33,
        TaskName: 'Internal testing and feedback',
        StartDate: new Date('06/06/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 45
    },
    {
        TaskID: 34,
        TaskName: 'Customer testing and feedback',
        StartDate: new Date('06/11/2019'),
        Duration: 3,
        parentID: 32,
        Progress: 50
    },
    {
        TaskID: 35,
        TaskName: 'Final product development',
        Duration:4,
        StartDate: new Date('06/14/2019'),
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 36,
        TaskName: 'Important improvements',
        StartDate: new Date('06/14/2019'),
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 37,
        TaskName: 'Address any unforeseen issues',
        StartDate: new Date('06/14/2019'),
        resources: [1 , 2 , 3 , 4 , 5] ,
        Duration: 4,
        Progress: 30,
        parentID: 35
    },
    {
        TaskID: 38,
        TaskName: 'Final product',
        StartDate: new Date('06/20/2019'),
        Duration:8,
        parentID: 0,
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 39,
        TaskName: 'Branding product',
        StartDate: new Date('06/20/2019'),
        Duration: 4,
        resources: [1 , 3 , 5 , 6] ,
        parentID: 38
    },
    {
        TaskID: 40,
        TaskName: 'Marketing and presales',
        StartDate: new Date('06/26/2019'),
        Duration: 4,
        resources: [1 , 3 , 5 , 6] ,
        Progress: 30,
        parentID: 38
    }
];
export let virtualData1: any[] = [];
let projId: number = 1;
for (let i: number = 0; i < 50; i++) {
    let x: number = virtualData1.length + 1;
    let parent: any = {};
    /* tslint:disable:no-string-literal */
    parent['TaskID'] = x;
    parent['TaskName'] = 'Project' + (projId++);
    parent['Duration'] = 122,
    parent['StartDate'] = new Date('4/2/2019'),
    virtualData1.push(parent);
    for (let j: number = 0; j < tempData.length; j++) {
        let subtasks: any = {};
        /* tslint:disable:no-string-literal */
        subtasks['TaskID'] = tempData[j].TaskID + x;
        subtasks['TaskName'] = tempData[j].TaskName;
        subtasks['StartDate'] = tempData[j].StartDate;
        subtasks['Duration'] = tempData[j].Duration;
        subtasks['Progress'] = tempData[j].Progress;
        subtasks['parentID'] = tempData[j].parentID + x;
        subtasks["resources"] = tempData[j].resources;
        subtasks["Predecessor"] = tempData[j].TaskID + x -1;
        virtualData1.push(subtasks);
    }
}
export let virtualData: Object[] = [];
let x: number = 0;
for (let i: number = 0; i < 50; i++) {
    let parent: Object = {};
    parent["TaskID"] = ++x;
    parent["TaskName"] = "Task " + x;
    parent["StartDate"] = new Date("01/09/2017");
    parent["EndDate"] = new Date("01/13/2017");
    parent["Duration"] = 5;
    parent["Status"] = Math.round(Math.random() * 100);
    let d: Object[] = [];
    for (let j: number = 1; j < 3; j++) {
        let child: Object = {};
        child["TaskID"] = ++x;
        child["TaskName"] = "Task " + x;
        child["StartDate"] = new Date("01/09/2017");
        child["EndDate"] = new Date("01/13/2017");
        child["Duration"] = 5;
        child["Status"] = Math.round(Math.random() * 100);
        let y: Object[] = [];
        for (let k: number = 1; k < 4; k++) {
            let c: Object  = {};
            c["TaskID"] = ++x;
            c["TaskName"] = "Task " + x;
            c["StartDate"] = new Date("01/09/2017");
            c["EndDate"] = new Date("01/13/2017");
            c["Duration"] = 5;
            c["Status"] = Math.round(Math.random() * 100);
            c["Predecessor"] = x - 1;
            y.push(c);
        }
        child["subtasks"] = y;
        d.push(child);
    }
    parent["subtasks"] = d;
    virtualData[i] = parent;
};

export let selfReference: Object[] = [
    {
        'TaskID': 1, 'TaskName': 'Parent Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40'
    },
    {
        'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 5, 'TaskName': 'Parent Task 2', 'StartDate': new Date('03/14/2017'),
        'EndDate': new Date('03/18/2017'), 'Progress': '40'
    },
    {
        'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 10, 'TaskName': 'Parent Task 3', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40'
    },
    {
        'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    }

];

export let indentOutdentData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    }
];

export let projectData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/06/2017'),
        EndDate: new Date('03/13/2017'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/06/2017'),
                EndDate: new Date('02/10/2017'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                        Duration: 7200, DurationUnit: 'min', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2017 05:00:00 AM'), EndDate: new Date('02/10/2017'),
                        Duration: 120, DurationUnit: 'hour', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/06/2017'), EndDate: new Date('02/13/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1], milestone: true
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/10/2017'), EndDate: new Date('02/10/2017'),
                        Duration: 0, Predecessor: '3FS,4FS,5FS'
                    },
                    {
                        TaskID: 51,
                        TaskName: 'Temp Parent',
                        StartDate: new Date('02/10/2017'),
                        EndDate: new Date('02/12/2017'),
                        subtasks: [
                            {
                                TaskID: 52, TaskName: 'Temp child', StartDate: null, EndDate: new Date('02/10/2017'),
                                Duration: 3, DurationUnit: 'day', Progress: '100', ResourceId: [1]
                            }
                        ]
                    }
                ]
                
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/13/2017'),
                EndDate: new Date('02/17/2017'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/13/2017'),
                        EndDate: new Date('02/15/2017 18:00:00 PM'),
                        Duration: 3, Progress: '60', Predecessor: '6FS', ResourceId: [2]
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/13/2017'), EndDate: new Date('02/15/2017'),
                        Duration: '3 days', Progress: '100', Predecessor: '6FS', ResourceId: [3]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/16/2017'), milestone: true,
                        EndDate: new Date('02/17/2017'), Duration: 2, Progress: '100', Predecessor: '9FS', ResourceId: [1]
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/17/2017'),
                        EndDate: new Date('02/17/2017'), Duration: 0, Predecessor: '10FS'
                    }
                ]
            },
            {
                TaskID: 12,
                TaskName: 'Implementation Phase',
                StartDate: new Date('02/23/2017'),
                EndDate: new Date('03/03/2017'),
                Expand: false,
                subtasks: [
                    {
                        TaskID: 13,
                        TaskName: 'Phase 1',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 14,
                            TaskName: 'Implementation Module 1',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 15, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 16, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 17, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '15FS,16FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 18, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('02/28/2017'), Duration: 2, Progress: '0', Predecessor: '17FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 19, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 2, Progress: '0', Predecessor: '18FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 20, TaskName: 'Phase 1 complete', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 0, Predecessor: '19FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 21,
                        TaskName: 'Phase 2',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/03/2017'),
                        subtasks: [{
                            TaskID: 22,
                            TaskName: 'Implementation Module 2',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/03/2017'),
                            subtasks: [
                                {
                                    TaskID: 23, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 24, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 25, TaskName: 'Testing', StartDate: new Date('02/24/2017'),
                                    EndDate: new Date('02/27/2017'), Duration: 2, Progress: '0', Predecessor: '23FS,24FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 26, TaskName: 'Bug fix', StartDate: new Date('02/28/2017'),
                                    EndDate: new Date('03/01/2017'), Duration: 2, Progress: '0', Predecessor: '25FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 27, TaskName: 'Customer review meeting', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '26FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 28, TaskName: 'Phase 2 complete', StartDate: new Date('03/03/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 0, Predecessor: '27FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 29,
                        TaskName: 'Phase 3',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 30,
                            TaskName: 'Implementation Module 3',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 31, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 32, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 33, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '31FS,32FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 34, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '33FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 35, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 2, Progress: '0', Predecessor: '34FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 36, TaskName: 'Phase 3 complete', StartDate: new Date('03/02/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 0, Predecessor: '35FS'
                                },

                            ]
                        }]
                    }
                ]
            },
            {
                TaskID: 37, TaskName: 'Integration', StartDate: new Date('03/06/2017'),
                EndDate: new Date('03/08/2017'), Duration: 3, Progress: '0', Predecessor: '20FS,28FS,36FS', ResourceId: [3]
            },
            {
                TaskID: 38, TaskName: 'Final Testing', StartDate: new Date('03/09/2017'),
                EndDate: new Date('03/10/2017'), Duration: 2, Progress: '0', Predecessor: '37FS', ResourceId: [4]
            },
            {
                TaskID: 39, TaskName: 'Final Delivery', StartDate: new Date('03/10/2017'),
                EndDate: new Date('03/10/2017'), Duration: 0, Predecessor: '38FS'
            }
        ]
    }
];

export let zoomingData: object[] = [ {
    TaskID: 1,
    TaskName: 'Project Initiation',
    StartDate: new Date('04/02/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        { TaskID: 2, TaskName: 'Identify Site location', BaselineStartDate: new Date('07/08/2019'),  BaselineEndDate: new Date('09/14/2019'), StartDate: new Date('04/08/2019'), Duration: 100, Progress: 50 },
        { TaskID: 3, TaskName: 'Perform Soil test', BaselineStartDate: new Date('03/04/2019'),Predecessor:'2FS', BaselineEndDate: new Date('04/19/2019'), StartDate: new Date('04/08/2019'), Duration: 100, Progress: 50 },
        { TaskID: 4, TaskName: 'Soil test approval', BaselineStartDate: new Date('03/09/2019'), Predecessor:'3SF', BaselineEndDate: new Date('04/21/2019'), StartDate: new Date('04/12/2019'), Duration: 10, Progress: 50 },
    ]
},];
export let exportData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, Bs: new Date('04/02/2019'),Be: new Date('04/08/2019'), TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 33, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 0 },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Predecessor:'322SS', Duration: 3, Progress: 30 },
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3222255FS + 2days" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "55555", Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "55555" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "", Progress: 30 },
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 1, Predecessor: "" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Predecessor:'14SF', Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Predecessor:'', Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Predecessor:'1766FF', Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'),Predecessor:'1966SS', Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12, Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 30 },
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, dd:'dd', TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5, Predecessor: '55555FF' },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 }
        ]
    }
];


export let projectData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/06/2017'),
        EndDate: new Date('03/13/2017'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/06/2017'),
                EndDate: new Date('02/10/2017'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2017 05:00:00 AM'), EndDate: new Date('02/10/2017'),
                        Duration: 2, Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/06/2017'), EndDate: new Date('02/13/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1], milestone: true
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/10/2017'), EndDate: new Date('02/10/2017'),
                        Duration: 0, Predecessor: '3FS,4FS,5FS'
                    },
                    {
                        TaskID: 51,
                        TaskName: 'Temp Parent',
                        StartDate: new Date('02/10/2017'),
                        EndDate: new Date('02/12/2017'),
                        subtasks: [
                            {
                                TaskID: 52, TaskName: 'Temp child', StartDate: null, EndDate: new Date('02/10/2017'),
                                Duration: 3, DurationUnit: 'day', Progress: '100', ResourceId: [1]
                            }
                        ]
                    }
                ]
                
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/13/2017'),
                EndDate: new Date('02/17/2017'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/13/2017'),
                        EndDate: new Date('02/15/2017 18:00:00 PM'),
                        Duration: 3, Progress: '60', Predecessor: '6FS', ResourceId: [2]
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/13/2017'), EndDate: new Date('02/15/2017'),
                        Duration: '3 days', Progress: '100', Predecessor: '6FS', ResourceId: [3]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/16/2017'), milestone: true,
                        EndDate: new Date('02/17/2017'), Duration: 2, Progress: '100', Predecessor: '9FS', ResourceId: [1]
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/17/2017'),
                        EndDate: new Date('02/17/2017'), Duration: 0, Predecessor: '10FS'
                    }
                ]
            },
            {
                TaskID: 12,
                TaskName: 'Implementation Phase',
                StartDate: new Date('02/23/2017'),
                EndDate: new Date('03/03/2017'),
                Expand: false,
                subtasks: [
                    {
                        TaskID: 13,
                        TaskName: 'Phase 1',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 14,
                            TaskName: 'Implementation Module 1',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 15, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 16, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 17, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '15FS,16FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 18, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('02/28/2017'), Duration: 2, Progress: '0', Predecessor: '17FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 19, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 2, Progress: '0', Predecessor: '18FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 20, TaskName: 'Phase 1 complete', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 0, Predecessor: '19FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 21,
                        TaskName: 'Phase 2',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/03/2017'),
                        subtasks: [{
                            TaskID: 22,
                            TaskName: 'Implementation Module 2',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/03/2017'),
                            subtasks: [
                                {
                                    TaskID: 23, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 24, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 25, TaskName: 'Testing', StartDate: new Date('02/24/2017'),
                                    EndDate: new Date('02/27/2017'), Duration: 2, Progress: '0', Predecessor: '23FS,24FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 26, TaskName: 'Bug fix', StartDate: new Date('02/28/2017'),
                                    EndDate: new Date('03/01/2017'), Duration: 2, Progress: '0', Predecessor: '25FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 27, TaskName: 'Customer review meeting', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '26FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 28, TaskName: 'Phase 2 complete', StartDate: new Date('03/03/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 0, Predecessor: '27FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 29,
                        TaskName: 'Phase 3',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 30,
                            TaskName: 'Implementation Module 3',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 31, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 32, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 33, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '31FS,32FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 34, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '33FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 35, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 2, Progress: '0', Predecessor: '34FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 36, TaskName: 'Phase 3 complete', StartDate: new Date('03/02/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 0, Predecessor: '35FS'
                                },

                            ]
                        }]
                    }
                ]
            },
            {
                TaskID: 37, TaskName: 'Integration', StartDate: new Date('03/06/2017'),
                EndDate: new Date('03/08/2017'), Duration: 3, Progress: '0', Predecessor: '20FS,28FS,36FS', ResourceId: [3]
            },
            {
                TaskID: 38, TaskName: 'Final Testing', StartDate: new Date('03/09/2017'),
                EndDate: new Date('03/10/2017'), Duration: 2, Progress: '0', Predecessor: '37FS', ResourceId: [4]
            },
            {
                TaskID: 39, TaskName: 'Final Delivery'
            }
        ]
    }
];

export let projectNewData2: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Receive vehicle and create job card',
        BaselineStartDate: new Date('03/05/2018 5:00:00 PM'),
        BaselineEndDate: new Date('03/05/2018 5:00:00 PM'),
        StartDate: new Date('03/05/2018 5:00:00 PM'),
        EndDate: new Date('03/05/2018 5:00:00 PM'),
        IsMilestone: true,
        Duration: 0,
      },
      {
        TaskID: 2,
        TaskName: 'Allot mechanic and send vehicle to service bay',
        BaselineStartDate: new Date('03/05/2018 10:00:00 AM'),
        BaselineEndDate: new Date('03/06/2018 10:15:00 AM'),
        StartDate: new Date('03/05/2018 10:15:00 AM'),
        EndDate: new Date('03/06/2018 10:20:00 AM'),
      }
    ];
    
export let unscheduledData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'BaselineStartDate': '02/27/2017',
        'BaselineEndDate': '03/06/2017',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                'Progress': '40', 'isManual': true, Duration: 4
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'EndDate': '03/03/2017', 'Progress': '40', Duration: 4, Predecessor: '4SS',
                'BaselineStartDate': new Date('02/25/2017 10:00 AM'), 'BaselineEndDate': new Date('03/06/2017 04:00 PM'),
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': '03/06/2017', 'EndDate': new Date('03/06/2017'),
                'Progress': '40', Duration: 0, 'BaselineStartDate': new Date('03/06/2017'), 'BaselineEndDate': new Date('03/10/2017'),
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': null, 'EndDate': new Date('03/10/2017'), 'Progress': '40', Duration: 4
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/06/2017'), 'EndDate': null,
                'Progress': '40', 'BaselineStartDate': new Date('03/05/2017 05:00:00 AM'),
                'BaselineEndDate': new Date('03/16/2017 18:00:00 PM'),
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/06/2017'), 'EndDate': new Date('03/10/2017'),
                'Progress': '40', 'isManual': true, Duration: 0
            }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
            {
                'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'), 'Progress': '40'
            },
            {
                'TaskID': 12, 'TaskName': 'Child Task 2', 'EndDate': '03/17/2017', 'Progress': '40'
            },
            {
                'TaskID': 13, 'TaskName': 'Child Task 3', 'Progress': '40', Duration: 4
            },
            {
                'TaskID': 14, 'TaskName': 'Child Task 4', 'Progress': '40', 'isManual': true, Duration: 0
            },
            {
                'TaskID': 15, 'TaskName': 'Child Task 5', 'Progress': '40',
            }
        ]
    }
];
export let resourceGanttData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Perform soil test', StartDate: new Date('04/02/2019'), Duration: 4,
                resources: [{ ResourceId: 2, ResourceUnit: 70 }, 3, { ResourceId: 1, ResourceUnit: 70, custom: 'check' }]
            },
            { TaskID: 3, resources: [1, 4], TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 4, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            { TaskID: 5, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 }
        ]
    }
];
export let unscheduledData2: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'BaselineStartDate': '02/27/2017',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'), 'BaselineStartDate': '02/27/2017',
                'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'StartDate': '03/03/2017', 'Progress': '40', Duration: 4, 'BaselineStartDate': '02/25/2017',
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'BaselineStartDate': '02/27/2017',
                'Progress': '40'
            }
        ]
    }
];
export let unscheduledData3: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'EndDate': new Date('02/27/2017'),
        'BaselineEndDate': '02/27/2017',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'EndDate': new Date('02/27/2017'), 'BaselineEndDate': '02/27/2017',
                'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'EndDate': '03/03/2017', 'Progress': '40', 'BaselineEndDate': '03/03/2017',
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'EndDate': new Date('02/27/2017'), 'BaselineEndDate': '02/27/2017',
                'Progress': '40'
            }
        ]
    }
];
export let unscheduledData4: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'Progress': '40'
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'Progress': '40'
            }
        ]
    }
];

export let zoomData: Object[] =[
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/12/2018'),
                'Progress': '40', 'Duration': '8minutes', 'DurationUnit':'minutes'
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/13/2018'),
                'Progress': '40', 'Duration': '8minutes', 'DurationUnit':'minute'
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/14/2018'),
                'Progress': '40', 'Duration': '8minutes', 'DurationUnit':'minute'
            }
        ]
    },
]

export let zoomData1: Object[] =[
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/12/2018'),
                'Progress': '40', 'Duration': 400
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/13/2018'),
                'Progress': '40', 'Duration': 4
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/14/2018'),
                'Progress': '40', 'Duration': 4
            }
        ]
    },
]
export let timezoneData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/07/2018 14:00'), 'EndDate': new Date('02/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/05/2018'), 'EndDate': new Date('02/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/06/2018'), 'EndDate': new Date('02/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 5',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 6', 'StartDate': new Date('03/04/2018'), 'EndDate': new Date('03/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 7', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 8', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 9', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 10, 'TaskName': 'Child Task 10', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    }
];
export let predecessorOffSetValidation: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
        ]
    }
];
export let defaultGanttData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/05/2018'), 'EndDate': new Date('02/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/06/2018'), 'EndDate': new Date('02/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 5',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 6', 'StartDate': new Date('03/04/2018'), 'EndDate': new Date('03/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 7', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 8', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 9', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 10, 'TaskName': 'Child Task 10', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    }];

export let baselineData: Object[] = [
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
                'resourceInfo': [1], 'TaskId': 2, 'TaskName': 'Child task 1', 'cusClass': 'cusclass',
                'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
                'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80
            },
            {
                'resourceInfo': [2, 4], 'TaskId': 3, 'TaskName': 'Child task 2',
                'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                'BaselineEndDate': new Date('10/24/2017'), 'Duration': 0, 'Progress': 65, 'Predecessor': '2'
            },
            {
                'TaskId': 4,
                'TaskName': 'Child task 3',
                'StartDate': new Date('10/25/2017'),
                'BaselineStartDate': new Date('10/26/2017'),
                'BaselineEndDate': new Date('10/28/2017'),
                'Duration': 6,
                'Progress': 77,
                'Expand': false,
                'Children': [
                    {
                        'resourceInfo': [3], 'TaskId': 5, 'TaskName': 'Grand child task 1',
                        'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                        'BaselineEndDate': new Date('11/1/2017'), 'Duration': 5, 'Progress': 60
                    },
                    {
                        'TaskId': 6, 'TaskName': 'Grand child task 2', 'Expand': false,
                        'StartDate': new Date('10/29/2017'), 'BaselineStartDate': new Date('10/29/2017'),
                        'BaselineEndDate': new Date('10/31/2017'), 'Duration': 6, 'Progress': 77, 'Predecessor': '5'
                    },
                    {
                        'resourceInfo': [], 'TaskId': 7, 'TaskName': 'Grand child task 3',
                        'StartDate': new Date('10/25/2017'), 'BaselineStartDate': new Date('10/25/2017'),
                        'BaselineEndDate': new Date('10/25/2017'), 'Duration': 0, 'Progress': 0, 'Predecessor': '6'
                    }, {
                        'TaskId': 4,
                        'TaskName': 'Child task 8',
                        'StartDate': new Date('10/25/2017'),
                        'BaselineStartDate': new Date('10/26/2017'),
                        'BaselineEndDate': new Date('10/28/2017'),
                        'Duration': 6,
                        'Progress': 77,
                        'Expand': true,
                        'Children': [
                            {
                                'resourceInfo': [3], 'TaskId': 9, 'TaskName': 'Grand child task 1',
                                'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                                'BaselineEndDate': new Date('11/1/2017'), 'Duration': 0, 'Progress': 60
                            }]
                    }
                ]
            }
        ]
    }
];

export let resourceData: Object[] = [
    { resourceId: 1, resourceName: 'Robert King' },
    { resourceId: 2, resourceName: 'Anne Dodsworth' },
    { resourceId: 3, resourceName: 'David William' },
    { resourceId: 4, resourceName: 'Nancy Davolio' },
    { resourceId: 5, resourceName: 'Janet Leverling' },
    { resourceId: 6, resourceName: 'Romey_Wilson' }
];

export let sampleData: Object[] = [
    {
        'resourceInfo': [1], 'TaskId': 1, 'TaskName': 'Start-Duration',
        'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80, 'Notes': 'testing1',
    },
    {
        'resourceInfo': [2], 'TaskId': 2, 'TaskName': 'Start-End',
        'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1', 'Notes': 'testing2'
    },
    {
        'resourceInfo': [2], 'TaskId': 3, 'TaskName': 'Duration-End',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS','Notes': 'testing3'
    },
    {
        'resourceInfo': [2], 'TaskId': 4, 'TaskName': 'Duration-alone',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Notes': '4'
    },
    {
        'resourceInfo': [2], 'TaskId': 5, 'TaskName': 'StartDate-alone',
        StartDate: new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Predecessor': '2', 'Notes': 'testing5'
    },
    {
        'resourceInfo': [2], 'TaskId': 6, 'TaskName': 'EndDate-alone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Notes': 'testing6'
    },
    {
        'resourceInfo': [2], 'TaskId': 7, 'TaskName': 'Milestone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, Duration: 0, 'Notes': 'testing7'
    },
];

export let cellEditData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Parent Task',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 1',
              BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), EstimatedWork: 40.45 }, 
            { TaskID: 3, TaskName: 'Child Task 2', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1], EstimatedWork: 20,cssClass: 'css', },
            { TaskID: 4, TaskName: 'Milestone Task', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "2", Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [4], EstimatedWork: 80  },
        ]
    },
    { TaskID: 5, TaskName: 'Unscheduled Start Task', StartDate: new Date('04/02/2019'), Notes: 'Notes 4',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3]  },
    { TaskID: 6, TaskName: 'Unscheduled End Task', EndDate: new Date('04/02/2019'), Notes: 'Notes 5',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), EstimatedWork: 55  },
    { TaskID: 7, TaskName: 'Unscheduled Duration Task', Duration: 5, Notes: 'Notes 6',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  },
];

export let dialogEditData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Parent Task',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 1',
              BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), EstimatedWork: 40 }, 
            { TaskID: 3, TaskName: 'Child Task 2', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1], EstimatedWork: 20 },
            { TaskID: 4, TaskName: 'Milestone Task', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "2", Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [4], EstimatedWork: 80  },
        ]
    },
    { TaskID: 5, TaskName: 'Unscheduled Start Task', StartDate: new Date('04/02/2019'), Notes: 'Notes 4',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3]  },
    { TaskID: 6, TaskName: 'Unscheduled End Task', EndDate: new Date('04/02/2019'), Notes: 'Notes 5',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019') , EstimatedWork: 55 },
    { TaskID: 7, TaskName: 'Unscheduled Duration Task', Duration: 5, Notes: 'Notes 6',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  },
];

export let crDialogEditData: object[] = [
    {
        taskId: 1,
        taskName: 'Grava',
        propertyModelActivityId: 2,
        actualStartDate: '2021-12-08T00:00:00',
        actualEndDate: '2024-04-01T00:00:00',
        basePlanStartDate: '23/12/2021 (IST)',
        basePlanEndDate: '12/10/2024 (IST)',
        revisionNo: 1,
        subTasks: [
            {
                taskId: 2,
                blockId: 1,
                parentId: 1,
                taskName: 'TOWER 10',
                startDate: '2021-12-23T00:00:00',
                endDate: '2024-09-12T00:00:00',
                propertyModelActivityId: 3,
                actualStartDate: '2021-12-08T00:00:00',
                actualEndDate: '2024-04-01T00:00:00',
                basePlanStartDate: '23/12/2021 (IST)',
                basePlanEndDate: '03/09/2024 (IST)',
                revisionNo: 1,
                subTasks: [
                    {
                        taskId: 3,
                        blockId: 1,
                        siteDrawingTypeId: 1,
                        parentId: 2,
                        taskName: 'Structural',
                        startDate: '2021-12-23T00:00:00',
                        endDate: '2024-09-12T00:00:00',
                        propertyModelActivityId: 4,
                        actualStartDate: '2021-12-08T00:00:00',
                        actualEndDate: '2024-04-01T00:00:00',
                        basePlanStartDate: '23/12/2021 (IST)',
                        basePlanEndDate: '03/09/2024 (IST)',
                        revisionNo: 1,
                        subTasks: [
                            {
                                taskId: 9,
                                blockId: 1,
                                floorId: 1,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-B07',
                                startDate: '2021-12-23T00:00:00',
                                endDate: '2022-04-16T00:00:00',
                                propertyModelActivityId: 10,

                                actualStartDate: '2021-12-08T00:00:00',
                                actualEndDate: '2022-08-17T00:00:00',


                                basePlanStartDate: '23/12/2021 (IST)',
                                basePlanEndDate: '16/04/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 15,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 10,
                                        modelActivityName: 'FDL Jump Lift and Service lift area',
                                        parentId: 9,
                                        taskName: 'FDL Jump Lift and Service lift area',
                                        startDate: '2021-12-23T00:00:00',
                                        endDate: '2021-12-23T00:00:00',
                                        propertyModelActivityId: 16,

                                        actualStartDate: '2021-12-08T00:00:00',
                                        actualEndDate: '2022-01-12T00:00:00',


                                        basePlanStartDate: '23/12/2021 (IST)',
                                        basePlanEndDate: '17/01/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '36 days',
                                        id: 5,
                                    },
                                    {
                                        taskId: 16,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 11,
                                        modelActivityName: 'FDL Isolated Footing',
                                        parentId: 9,
                                        taskName: 'FDL Isolated Footing',
                                        startDate: '2021-12-23T00:00:00',
                                        endDate: '2021-12-23T00:00:00',
                                        propertyModelActivityId: 17,

                                        actualStartDate: '2021-12-08T00:00:00',
                                        actualEndDate: '2021-02-10T00:00:00',


                                        basePlanStartDate: '23/12/2021 (IST)',
                                        basePlanEndDate: '23/12/2021 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '302 days',
                                        id: 6,
                                    },
                                    {
                                        taskId: 17,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 9,
                                        taskName: 'CIS walls casting',
                                        startDate: '2021-12-24T00:00:00',
                                        endDate: '2022-02-07T00:00:00',
                                        propertyModelActivityId: 18,

                                        actualStartDate: '2022-01-03T00:00:00',
                                        actualEndDate: '2022-03-19T00:00:00',


                                        basePlanStartDate: '24/12/2021 (IST)',
                                        basePlanEndDate: '07/02/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '76 days',
                                        id: 7,
                                    },
                                    {
                                        taskId: 18,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 12,
                                        modelActivityName: 'FDL Raft',
                                        parentId: 9,
                                        taskName: 'FDL Raft',
                                        startDate: '2021-12-29T00:00:00',
                                        endDate: '2022-02-10T00:00:00',
                                        propertyModelActivityId: 19,

                                        actualStartDate: '2021-12-08T00:00:00',
                                        actualEndDate: '2022-01-18T00:00:00',


                                        basePlanStartDate: '29/12/2021 (IST)',
                                        basePlanEndDate: '10/02/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '42 days',
                                        id: 8,
                                    },
                                    {
                                        taskId: 19,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 13,
                                        modelActivityName: 'FDL SubSoil Drainage & Grade Slab',
                                        parentId: 9,
                                        taskName: 'FDL SubSoil Drainage & Grade Slab',
                                        startDate: '2022-01-19T00:00:00',
                                        endDate: '2022-04-16T00:00:00',
                                        propertyModelActivityId: 20,

                                        actualStartDate: '2022-02-10T00:00:00',
                                        actualEndDate: '2022-08-17T00:00:00',


                                        basePlanStartDate: '19/01/2022 (IST)',
                                        basePlanEndDate: '16/04/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '189 days',
                                        id: 9,
                                    },
                                ],
                                actualDuration: '253 days',
                                id: 4,
                            },
                            {
                                taskId: 22,
                                blockId: 1,
                                floorId: 42,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-B06',
                                startDate: '2022-02-02T00:00:00',
                                endDate: '2022-05-16T00:00:00',
                                propertyModelActivityId: 23,

                                actualStartDate: '2022-02-17T00:00:00',
                                actualEndDate: '2022-05-31T00:00:00',


                                basePlanStartDate: '02/02/2022 (IST)',
                                basePlanEndDate: '16/05/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 30,
                                        blockId: 1,
                                        floorId: 42,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 22,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-02-02T00:00:00',
                                        endDate: '2022-04-15T00:00:00',
                                        propertyModelActivityId: 31,

                                        actualStartDate: '2022-03-09T00:00:00',
                                        actualEndDate: '2022-04-18T00:00:00',


                                        basePlanStartDate: '02/02/2022 (IST)',
                                        basePlanEndDate: '15/04/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '41 days',
                                        id: 11,
                                    },
                                    {
                                        taskId: 31,
                                        blockId: 1,
                                        floorId: 42,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 22,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-03-16T00:00:00',
                                        endDate: '2022-04-15T00:00:00',
                                        propertyModelActivityId: 32,

                                        actualStartDate: '2022-02-17T00:00:00',
                                        actualEndDate: '2022-04-18T00:00:00',


                                        basePlanStartDate: '16/03/2022 (IST)',
                                        basePlanEndDate: '15/04/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '61 days',
                                        id: 12,
                                    },
                                    {
                                        taskId: 32,
                                        blockId: 1,
                                        floorId: 42,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 22,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-03-29T00:00:00',
                                        endDate: '2022-05-11T00:00:00',
                                        propertyModelActivityId: 33,

                                        actualStartDate: '2022-03-11T00:00:00',
                                        actualEndDate: '2022-05-31T00:00:00',


                                        basePlanStartDate: '29/03/2022 (IST)',
                                        basePlanEndDate: '11/05/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '82 days',
                                        id: 13,
                                    },
                                    {
                                        taskId: 34,
                                        blockId: 1,
                                        floorId: 42,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 22,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-04-19T00:00:00',
                                        endDate: '2022-05-16T00:00:00',
                                        propertyModelActivityId: 35,

                                        actualStartDate: '2022-04-12T00:00:00',
                                        actualEndDate: '2022-04-28T00:00:00',


                                        basePlanStartDate: '19/04/2022 (IST)',
                                        basePlanEndDate: '16/05/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '17 days',
                                        id: 14,
                                    },
                                ],
                                actualDuration: '104 days',
                                id: 10,
                            },
                            {
                                taskId: 35,
                                blockId: 1,
                                floorId: 41,
                                siteDrawingTypeId: 1,
                                parentId: 3,
                                taskName: 'Level-B05',
                                startDate: '2022-05-02T00:00:00',
                                endDate: '2022-06-21T00:00:00',
                                propertyModelActivityId: 36,
                                actualStartDate: '2022-04-14T00:00:00',
                                actualEndDate: '2022-05-30T00:00:00',
                                basePlanStartDate: '02/05/2022 (IST)',
                                basePlanEndDate: '21/06/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 41,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 35,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-05-02T00:00:00',
                                        endDate: '2022-05-12T00:00:00',
                                        propertyModelActivityId: 42,
                                        predecessor: '',
                                        actualStartDate: '2022-04-14T00:00:00',
                                        actualEndDate: '2022-05-05T00:00:00',
                                        displayPredecessor: '',
                                        basePlanStartDate: '02/05/2022 (IST)',
                                        basePlanEndDate: '12/05/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '22 days',
                                        id: 16,
                                    },
                                    {
                                        taskId: 42,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 35,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-05-02T00:00:00',
                                        endDate: '2022-05-16T00:00:00',
                                        propertyModelActivityId: 43,
                                        predecessor: '',
                                        actualStartDate: '2022-04-19T00:00:00',
                                        actualEndDate: '2022-05-20T00:00:00',
                                        displayPredecessor: '',
                                        basePlanStartDate: '02/05/2022 (IST)',
                                        basePlanEndDate: '16/05/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '32 days',
                                        id: 17,
                                    },
                                    {
                                        taskId: 43,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 35,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-05-18T00:00:00',
                                        endDate: '2022-06-19T00:00:00',
                                        propertyModelActivityId: 44,
                                        predecessor: '34FS+1',
                                        actualStartDate: '2022-04-30T00:00:00',
                                        actualEndDate: '2022-05-18T00:00:00',
                                        displayPredecessor: '34FS+1 day',
                                        basePlanStartDate: '18/05/2022 (IST)',
                                        basePlanEndDate: '19/06/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '19 days',
                                        id: 18,
                                    },
                                    {
                                        taskId: 44,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 35,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-05-07T00:00:00',
                                        endDate: '2022-05-26T00:00:00',
                                        propertyModelActivityId: 45,
                                        predecessor: '',
                                        actualStartDate: '2022-04-22T00:00:00',
                                        actualEndDate: '2022-05-11T00:00:00',
                                        displayPredecessor: '',
                                        basePlanStartDate: '07/05/2022 (IST)',
                                        basePlanEndDate: '26/05/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '20 days',
                                        id: 19,
                                    },
                                    {
                                        taskId: 45,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 35,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-05-17T00:00:00',
                                        endDate: '2022-06-09T00:00:00',
                                        propertyModelActivityId: 46,
                                        predecessor: '44FS-10,41FS,42FS',
                                        actualStartDate: '2022-05-02T00:00:00',
                                        actualEndDate: '2022-05-30T00:00:00',
                                        displayPredecessor: '44FS-10 days,41FS,42FS',
                                        basePlanStartDate: '17/05/2022 (IST)',
                                        basePlanEndDate: '09/06/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '29 days',
                                        id: 20,
                                    },
                                    {
                                        taskId: 47,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 35,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-06-02T00:00:00',
                                        endDate: '2022-06-21T00:00:00',
                                        propertyModelActivityId: 48,
                                        predecessor: '45SS+16,43FF-10',
                                        actualStartDate: '2022-05-17T00:00:00',
                                        actualEndDate: '2022-05-25T00:00:00',
                                        displayPredecessor: '45SS+16 days,43FF-10 days',
                                        basePlanStartDate: '02/06/2022 (IST)',
                                        basePlanEndDate: '21/06/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '9 days',
                                        id: 21,
                                    },
                                ],
                                actualDuration: '47 days',
                                id: 15,
                            },
                            {
                                taskId: 48,
                                blockId: 1,
                                floorId: 40,
                                siteDrawingTypeId: 1,
                                parentId: 3,
                                taskName: 'Level-B04',
                                startDate: '2022-06-12T00:00:00',
                                endDate: '2022-07-21T00:00:00',
                                propertyModelActivityId: 49,
                                actualStartDate: '2022-05-22T00:00:00',
                                actualEndDate: '2022-09-17T00:00:00',
                                basePlanStartDate: '12/06/2022 (IST)',
                                basePlanEndDate: '21/07/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 54,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 48,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-06-12T00:00:00',
                                        endDate: '2022-06-24T00:00:00',
                                        propertyModelActivityId: 55,
                                        predecessor: '47SS+10',
                                        actualStartDate: '2022-05-23T00:00:00',
                                        actualEndDate: '2022-06-03T00:00:00',
                                        displayPredecessor: '47SS+10 days',
                                        basePlanStartDate: '12/06/2022 (IST)',
                                        basePlanEndDate: '24/06/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '12 days',
                                        id: 23,
                                    },
                                    {
                                        taskId: 55,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 48,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-06-12T00:00:00',
                                        endDate: '2022-06-26T00:00:00',
                                        propertyModelActivityId: 56,
                                        predecessor: '47SS+10',
                                        actualStartDate: '2022-05-23T00:00:00',
                                        actualEndDate: '2022-06-17T00:00:00',
                                        displayPredecessor: '47SS+10 days',
                                        basePlanStartDate: '12/06/2022 (IST)',
                                        basePlanEndDate: '26/06/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '26 days',
                                        id: 24,
                                    },
                                    {
                                        taskId: 56,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 48,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-06-13T00:00:00',
                                        endDate: '2022-07-05T00:00:00',
                                        propertyModelActivityId: 57,
                                        predecessor: '47SS+11',
                                        actualStartDate: '2022-06-02T00:00:00',
                                        actualEndDate: '2022-06-22T00:00:00',
                                        displayPredecessor: '47SS+11 days',
                                        basePlanStartDate: '13/06/2022 (IST)',
                                        basePlanEndDate: '05/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '21 days',
                                        id: 25,
                                    },
                                    {
                                        taskId: 57,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 48,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-06-14T00:00:00',
                                        endDate: '2022-07-03T00:00:00',
                                        propertyModelActivityId: 58,
                                        predecessor: '47SS+12',
                                        actualStartDate: '2022-05-22T00:00:00',
                                        actualEndDate: '2022-06-19T00:00:00',
                                        displayPredecessor: '47SS+12 days',
                                        basePlanStartDate: '14/06/2022 (IST)',
                                        basePlanEndDate: '03/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '29 days',
                                        id: 26,
                                    },
                                    {
                                        taskId: 58,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 48,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-06-19T00:00:00',
                                        endDate: '2022-07-12T00:00:00',
                                        propertyModelActivityId: 59,
                                        predecessor: '57FS-15',
                                        actualStartDate: '2022-05-24T00:00:00',
                                        actualEndDate: '2022-09-17T00:00:00',
                                        displayPredecessor: '57FS-15 days',
                                        basePlanStartDate: '19/06/2022 (IST)',
                                        basePlanEndDate: '12/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '117 days',
                                        id: 27,
                                    },
                                    {
                                        taskId: 60,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 48,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-07-02T00:00:00',
                                        endDate: '2022-07-21T00:00:00',
                                        propertyModelActivityId: 61,
                                        predecessor: '58SS+13,55FS,54FS',
                                        actualStartDate: '2022-06-12T00:00:00',
                                        actualEndDate: '2022-06-25T00:00:00',
                                        displayPredecessor: '58SS+13 days,55FS,54FS',
                                        basePlanStartDate: '02/07/2022 (IST)',
                                        basePlanEndDate: '21/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '14 days',
                                        id: 28,
                                    },
                                ],
                                actualDuration: '119 days',
                                id: 22,
                            },
                            {
                                taskId: 61,
                                blockId: 1,
                                floorId: 39,
                                siteDrawingTypeId: 1,
                                parentId: 3,
                                taskName: 'Level-B03',
                                startDate: '2022-07-10T00:00:00',
                                endDate: '2022-08-20T00:00:00',
                                propertyModelActivityId: 62,
                                actualStartDate: '2022-06-16T00:00:00',
                                actualEndDate: '2022-09-23T00:00:00',
                                basePlanStartDate: '10/07/2022 (IST)',
                                basePlanEndDate: '20/08/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 68,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 61,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-07-10T00:00:00',
                                        endDate: '2022-07-24T00:00:00',
                                        propertyModelActivityId: 69,
                                        predecessor: '60SS+8',
                                        actualStartDate: '2022-06-17T00:00:00',
                                        actualEndDate: '2022-07-26T00:00:00',
                                        displayPredecessor: '60SS+8 days',
                                        basePlanStartDate: '10/07/2022 (IST)',
                                        basePlanEndDate: '24/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '40 days',
                                        id: 30,
                                    },
                                    {
                                        taskId: 67,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 61,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-07-10T00:00:00',
                                        endDate: '2022-07-22T00:00:00',
                                        propertyModelActivityId: 68,
                                        predecessor: '60SS+8',
                                        actualStartDate: '2022-06-16T00:00:00',
                                        actualEndDate: '2022-06-30T00:00:00',
                                        displayPredecessor: '60SS+8 days',
                                        basePlanStartDate: '10/07/2022 (IST)',
                                        basePlanEndDate: '22/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '15 days',
                                        id: 31,
                                    },
                                    {
                                        taskId: 69,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 61,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-07-11T00:00:00',
                                        endDate: '2022-08-02T00:00:00',
                                        propertyModelActivityId: 70,
                                        predecessor: '60SS+9',
                                        actualStartDate: '2022-06-25T00:00:00',
                                        actualEndDate: '2022-07-18T00:00:00',
                                        displayPredecessor: '60SS+9 days',
                                        basePlanStartDate: '11/07/2022 (IST)',
                                        basePlanEndDate: '02/08/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '24 days',
                                        id: 32,
                                    },
                                    {
                                        taskId: 70,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 61,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-07-12T00:00:00',
                                        endDate: '2022-07-31T00:00:00',
                                        propertyModelActivityId: 71,
                                        predecessor: '60SS+10',
                                        actualStartDate: '2022-06-21T00:00:00',
                                        actualEndDate: '2022-07-11T00:00:00',
                                        displayPredecessor: '60SS+10 days',
                                        basePlanStartDate: '12/07/2022 (IST)',
                                        basePlanEndDate: '31/07/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '21 days',
                                        id: 33,
                                    },
                                    {
                                        taskId: 71,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 61,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-07-19T00:00:00',
                                        endDate: '2022-08-11T00:00:00',
                                        propertyModelActivityId: 72,
                                        predecessor: '70FS-13',
                                        actualStartDate: '2022-06-25T00:00:00',
                                        actualEndDate: '2022-09-23T00:00:00',
                                        displayPredecessor: '70FS-13 days',
                                        basePlanStartDate: '19/07/2022 (IST)',
                                        basePlanEndDate: '11/08/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '91 days',
                                        id: 34,
                                    },
                                    {
                                        taskId: 73,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 61,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-08-01T00:00:00',
                                        endDate: '2022-08-20T00:00:00',
                                        propertyModelActivityId: 74,
                                        predecessor: '71SS+13,67FS,68FS',
                                        actualStartDate: '2022-07-11T00:00:00',
                                        actualEndDate: '2022-07-22T00:00:00',
                                        displayPredecessor: '71SS+13 days,67FS,68FS',
                                        basePlanStartDate: '01/08/2022 (IST)',
                                        basePlanEndDate: '20/08/2022 (IST)',
                                        revisionNo: 1,
                                        actualDuration: '12 days',
                                        id: 35,
                                    },
                                ],
                                actualDuration: '100 days',
                                id: 29,
                            },
                            {
                                taskId: 74,
                                blockId: 1,
                                floorId: 38,
                                siteDrawingTypeId: 1,
                                parentId: 3,
                                taskName: 'Level-B02',
                                startDate: '2022-08-09T00:00:00',
                                endDate: '2022-09-20T00:00:00',
                                propertyModelActivityId: 75,
                                actualStartDate: '2022-07-15T00:00:00',
                                actualEndDate: '2022-08-18T00:00:00',
                                basePlanStartDate: '09/08/2022 (IST)',
                                basePlanEndDate: '20/09/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 80,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 74,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-08-09T00:00:00',
                                        endDate: '2022-08-21T00:00:00',
                                        propertyModelActivityId: 81,
                                        predecessor: '73SS+8',
                                        actualStartDate: '2022-07-16T00:00:00',
                                        actualEndDate: '2022-07-27T00:00:00',

                                        displayPredecessor: '73SS+8 days',
                                        basePlanStartDate: '09/08/2022 (IST)',
                                        basePlanEndDate: '21/08/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '12 days',
                                        id: 37,
                                    },
                                    {
                                        taskId: 81,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 74,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-08-09T00:00:00',
                                        endDate: '2022-08-23T00:00:00',
                                        propertyModelActivityId: 82,
                                        predecessor: '73SS+8',
                                        actualStartDate: '2022-07-15T00:00:00',
                                        actualEndDate: '2022-07-30T00:00:00',

                                        displayPredecessor: '73SS+8 days',
                                        basePlanStartDate: '09/08/2022 (IST)',
                                        basePlanEndDate: '23/08/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '16 days',
                                        id: 38,
                                    },
                                    {
                                        taskId: 82,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 74,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-08-10T00:00:00',
                                        endDate: '2022-09-01T00:00:00',
                                        propertyModelActivityId: 83,
                                        predecessor: '73SS+9',
                                        actualStartDate: '2022-07-26T00:00:00',
                                        actualEndDate: '2022-08-12T00:00:00',

                                        displayPredecessor: '73SS+9 days',
                                        basePlanStartDate: '10/08/2022 (IST)',
                                        basePlanEndDate: '01/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '18 days',
                                        id: 39,
                                    },
                                    {
                                        taskId: 83,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 74,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-08-11T00:00:00',
                                        endDate: '2022-08-30T00:00:00',
                                        propertyModelActivityId: 84,
                                        predecessor: '73SS+10',
                                        actualStartDate: '2022-07-19T00:00:00',
                                        actualEndDate: '2022-08-03T00:00:00',

                                        displayPredecessor: '73SS+10 days',
                                        basePlanStartDate: '11/08/2022 (IST)',
                                        basePlanEndDate: '30/08/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '16 days',
                                        id: 40,
                                    },
                                    {
                                        taskId: 84,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 74,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-08-19T00:00:00',
                                        endDate: '2022-09-11T00:00:00',
                                        propertyModelActivityId: 85,
                                        predecessor: '83FS-12',
                                        actualStartDate: '2022-07-23T00:00:00',
                                        actualEndDate: '2022-08-17T00:00:00',

                                        displayPredecessor: '83FS-12 days',
                                        basePlanStartDate: '19/08/2022 (IST)',
                                        basePlanEndDate: '11/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '26 days',
                                        id: 41,
                                    },
                                    {
                                        taskId: 86,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 74,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-09-01T00:00:00',
                                        endDate: '2022-09-20T00:00:00',
                                        propertyModelActivityId: 87,
                                        predecessor: '84SS+13,80FS,81FS',
                                        actualStartDate: '2022-08-05T00:00:00',
                                        actualEndDate: '2022-08-18T00:00:00',

                                        displayPredecessor: '84SS+13 days,80FS,81FS',
                                        basePlanStartDate: '01/09/2022 (IST)',
                                        basePlanEndDate: '20/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '14 days',
                                        id: 42,
                                    },
                                ],
                                actualDuration: '35 days',
                                id: 36,
                            },
                            {
                                taskId: 87,
                                blockId: 1,
                                floorId: 37,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-B01',
                                startDate: '2022-09-09T00:00:00',
                                endDate: '2022-10-20T00:00:00',
                                propertyModelActivityId: 88,

                                actualStartDate: '2022-08-08T00:00:00',
                                actualEndDate: '2022-09-23T00:00:00',


                                basePlanStartDate: '09/09/2022 (IST)',
                                basePlanEndDate: '20/10/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 93,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 87,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-09-09T00:00:00',
                                        endDate: '2022-09-21T00:00:00',
                                        propertyModelActivityId: 94,
                                        predecessor: '86SS+8',
                                        actualStartDate: '2022-08-08T00:00:00',
                                        actualEndDate: '2022-08-22T00:00:00',

                                        displayPredecessor: '86SS+8 days',
                                        basePlanStartDate: '09/09/2022 (IST)',
                                        basePlanEndDate: '21/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '15 days',
                                        id: 44,
                                    },
                                    {
                                        taskId: 94,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 87,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-09-09T00:00:00',
                                        endDate: '2022-09-23T00:00:00',
                                        propertyModelActivityId: 95,
                                        predecessor: '86SS+8',
                                        actualStartDate: '2022-08-09T00:00:00',
                                        actualEndDate: '2022-08-23T00:00:00',

                                        displayPredecessor: '86SS+8 days',
                                        basePlanStartDate: '09/09/2022 (IST)',
                                        basePlanEndDate: '23/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '15 days',
                                        id: 45,
                                    },
                                    {
                                        taskId: 95,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 87,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-09-10T00:00:00',
                                        endDate: '2022-10-02T00:00:00',
                                        propertyModelActivityId: 96,
                                        predecessor: '86SS+9',
                                        actualStartDate: '2022-08-16T00:00:00',
                                        actualEndDate: '2022-09-01T00:00:00',

                                        displayPredecessor: '86SS+9 days',
                                        basePlanStartDate: '10/09/2022 (IST)',
                                        basePlanEndDate: '02/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '17 days',
                                        id: 46,
                                    },
                                    {
                                        taskId: 96,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 87,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-09-11T00:00:00',
                                        endDate: '2022-09-30T00:00:00',
                                        propertyModelActivityId: 97,
                                        predecessor: '86SS+10',
                                        actualStartDate: '2022-08-12T00:00:00',
                                        actualEndDate: '2022-08-30T00:00:00',

                                        displayPredecessor: '86SS+10 days',
                                        basePlanStartDate: '11/09/2022 (IST)',
                                        basePlanEndDate: '30/09/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '19 days',
                                        id: 47,
                                    },
                                    {
                                        taskId: 97,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 87,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-09-19T00:00:00',
                                        endDate: '2022-10-12T00:00:00',
                                        propertyModelActivityId: 98,
                                        predecessor: '96FS-12',
                                        actualStartDate: '2022-08-17T00:00:00',
                                        actualEndDate: '2022-09-23T00:00:00',

                                        displayPredecessor: '96FS-12 days',
                                        basePlanStartDate: '19/09/2022 (IST)',
                                        basePlanEndDate: '12/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '38 days',
                                        id: 48,
                                    },
                                    {
                                        taskId: 99,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 87,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-10-02T00:00:00',
                                        endDate: '2022-10-20T00:00:00',
                                        propertyModelActivityId: 100,
                                        predecessor: '97SS+13,93FS,94FS',
                                        actualStartDate: '2022-08-29T00:00:00',
                                        actualEndDate: '2022-09-09T00:00:00',

                                        displayPredecessor: '97SS+13 days,93FS,94FS',
                                        basePlanStartDate: '02/10/2022 (IST)',
                                        basePlanEndDate: '20/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '12 days',
                                        id: 49,
                                    },
                                ],
                                actualDuration: '47 days',
                                id: 43,
                            },
                            {
                                taskId: 100,
                                blockId: 1,
                                floorId: 36,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-MZ',
                                startDate: '2022-10-10T00:00:00',
                                endDate: '2022-11-20T00:00:00',
                                propertyModelActivityId: 101,

                                actualStartDate: '2022-09-06T00:00:00',
                                actualEndDate: '2023-01-18T00:00:00',


                                basePlanStartDate: '10/10/2022 (IST)',
                                basePlanEndDate: '20/11/2022 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 108,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 100,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-10-11T00:00:00',
                                        endDate: '2022-10-25T00:00:00',
                                        propertyModelActivityId: 109,
                                        predecessor: '99SS+9',
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2022-09-26T00:00:00',

                                        displayPredecessor: '99SS+9 days',
                                        basePlanStartDate: '11/10/2022 (IST)',
                                        basePlanEndDate: '25/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '21 days',
                                        id: 51,
                                    },
                                    {
                                        taskId: 107,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 100,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-10-10T00:00:00',
                                        endDate: '2022-10-24T00:00:00',
                                        propertyModelActivityId: 108,
                                        predecessor: '99SS+8',
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2022-09-26T00:00:00',

                                        displayPredecessor: '99SS+8 days',
                                        basePlanStartDate: '10/10/2022 (IST)',
                                        basePlanEndDate: '24/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '21 days',
                                        id: 52,
                                    },
                                    {
                                        taskId: 106,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 100,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-10-10T00:00:00',
                                        endDate: '2022-10-22T00:00:00',
                                        propertyModelActivityId: 107,
                                        predecessor: '99SS+8',
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2022-09-14T00:00:00',

                                        displayPredecessor: '99SS+8 days',
                                        basePlanStartDate: '10/10/2022 (IST)',
                                        basePlanEndDate: '22/10/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '9 days',
                                        id: 53,
                                    },
                                    {
                                        taskId: 110,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 100,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-10-21T00:00:00',
                                        endDate: '2022-11-13T00:00:00',
                                        propertyModelActivityId: 111,
                                        predecessor: '108FS-5',
                                        actualStartDate: '2022-09-13T00:00:00',
                                        actualEndDate: '2023-01-18T00:00:00',

                                        displayPredecessor: '108FS-5 days',
                                        basePlanStartDate: '21/10/2022 (IST)',
                                        basePlanEndDate: '13/11/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '128 days',
                                        id: 54,
                                    },
                                    {
                                        taskId: 112,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 100,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-11-03T00:00:00',
                                        endDate: '2022-11-20T00:00:00',
                                        propertyModelActivityId: 113,
                                        predecessor: '110SS+13,106FS,107FS',
                                        actualStartDate: '2022-10-08T00:00:00',
                                        actualEndDate: '2022-10-21T00:00:00',

                                        displayPredecessor: '110SS+13 days,106FS,107FS',
                                        basePlanStartDate: '03/11/2022 (IST)',
                                        basePlanEndDate: '20/11/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '14 days',
                                        id: 55,
                                    },
                                ],
                                actualDuration: '135 days',
                                id: 50,
                            },
                            {
                                taskId: 113,
                                blockId: 1,
                                floorId: 35,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-LG',
                                startDate: '2022-11-11T00:00:00',
                                endDate: '2023-01-05T00:00:00',
                                propertyModelActivityId: 114,

                                actualStartDate: '2022-09-06T00:00:00',
                                actualEndDate: '2023-01-09T00:00:00',


                                basePlanStartDate: '11/11/2022 (IST)',
                                basePlanEndDate: '05/01/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 121,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 113,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-11-12T00:00:00',
                                        endDate: '2023-01-04T00:00:00',
                                        propertyModelActivityId: 122,
                                        predecessor: '112SS+9',
                                        actualStartDate: '2022-10-14T00:00:00',
                                        actualEndDate: '2022-11-11T00:00:00',

                                        displayPredecessor: '112SS+9 days',
                                        basePlanStartDate: '12/11/2022 (IST)',
                                        basePlanEndDate: '04/01/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '29 days',
                                        id: 57,
                                    },
                                    {
                                        taskId: 122,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 113,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-11-13T00:00:00',
                                        endDate: '2022-12-02T00:00:00',
                                        propertyModelActivityId: 123,
                                        predecessor: '112SS+10',
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2022-11-02T00:00:00',

                                        displayPredecessor: '112SS+10 days',
                                        basePlanStartDate: '13/11/2022 (IST)',
                                        basePlanEndDate: '02/12/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '58 days',
                                        id: 58,
                                    },
                                    {
                                        taskId: 120,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 113,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-11-11T00:00:00',
                                        endDate: '2022-12-20T00:00:00',
                                        propertyModelActivityId: 121,
                                        predecessor: '112SS+8',
                                        actualStartDate: '2022-09-10T00:00:00',
                                        actualEndDate: '2022-11-03T00:00:00',

                                        displayPredecessor: '112SS+8 days',
                                        basePlanStartDate: '11/11/2022 (IST)',
                                        basePlanEndDate: '20/12/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '55 days',
                                        id: 59,
                                    },
                                    {
                                        taskId: 119,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 113,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-11-11T00:00:00',
                                        endDate: '2022-11-23T00:00:00',
                                        propertyModelActivityId: 120,
                                        predecessor: '112SS+8',
                                        actualStartDate: '2022-09-21T00:00:00',
                                        actualEndDate: '2022-11-28T00:00:00',

                                        displayPredecessor: '112SS+8 days',
                                        basePlanStartDate: '11/11/2022 (IST)',
                                        basePlanEndDate: '23/11/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '69 days',
                                        id: 60,
                                    },
                                    {
                                        taskId: 123,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 113,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2022-11-21T00:00:00',
                                        endDate: '2022-12-10T00:00:00',
                                        propertyModelActivityId: 124,
                                        predecessor: '122FS-12',
                                        actualStartDate: '2022-10-07T00:00:00',
                                        actualEndDate: '2023-01-09T00:00:00',

                                        displayPredecessor: '122FS-12 days',
                                        basePlanStartDate: '21/11/2022 (IST)',
                                        basePlanEndDate: '10/12/2022 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '95 days',
                                        id: 61,
                                    },
                                    {
                                        taskId: 125,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 113,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2022-12-21T00:00:00',
                                        endDate: '2023-01-05T00:00:00',
                                        propertyModelActivityId: 126,
                                        predecessor: '123SS+8,119FS,120FS',
                                        actualStartDate: '2022-11-01T00:00:00',
                                        actualEndDate: '2022-11-15T00:00:00',

                                        displayPredecessor: '123SS+8 days,119FS,120FS',
                                        basePlanStartDate: '21/12/2022 (IST)',
                                        basePlanEndDate: '05/01/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '15 days',
                                        id: 62,
                                    },
                                ],
                                actualDuration: '126 days',
                                id: 56,
                            },
                            {
                                taskId: 126,
                                blockId: 1,
                                floorId: 34,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-UG',
                                startDate: '2022-12-27T00:00:00',
                                endDate: '2023-02-15T00:00:00',
                                propertyModelActivityId: 127,

                                actualStartDate: '2022-11-03T00:00:00',
                                actualEndDate: '2023-04-14T00:00:00',


                                basePlanStartDate: '27/12/2022 (IST)',
                                basePlanEndDate: '15/02/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 132,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 126,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2022-12-27T00:00:00',
                                        endDate: '2023-01-11T00:00:00',
                                        propertyModelActivityId: 133,
                                        predecessor: '125SS+6',
                                        actualStartDate: '2022-11-10T00:00:00',
                                        actualEndDate: '2022-12-27T00:00:00',

                                        displayPredecessor: '125SS+6 days',
                                        basePlanStartDate: '27/12/2022 (IST)',
                                        basePlanEndDate: '11/01/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '48 days',
                                        id: 64,
                                    },
                                    {
                                        taskId: 133,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 126,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2022-12-27T00:00:00',
                                        endDate: '2023-01-29T00:00:00',
                                        propertyModelActivityId: 134,
                                        predecessor: '125SS+6',
                                        actualStartDate: '2022-11-03T00:00:00',
                                        actualEndDate: '2022-12-22T00:00:00',

                                        displayPredecessor: '125SS+6 days',
                                        basePlanStartDate: '27/12/2022 (IST)',
                                        basePlanEndDate: '29/01/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '50 days',
                                        id: 65,
                                    },
                                    {
                                        taskId: 134,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 126,
                                        taskName: 'CIS walls casting',
                                        startDate: '2022-12-28T00:00:00',
                                        endDate: '2023-02-02T00:00:00',
                                        propertyModelActivityId: 135,
                                        predecessor: '125SS+7',
                                        actualStartDate: '2022-11-27T00:00:00',
                                        actualEndDate: '2022-12-21T00:00:00',

                                        displayPredecessor: '125SS+7 days',
                                        basePlanStartDate: '28/12/2022 (IST)',
                                        basePlanEndDate: '02/02/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '25 days',
                                        id: 66,
                                    },
                                    {
                                        taskId: 135,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 126,
                                        taskName: 'CIS Column casting',
                                        startDate: '2022-12-29T00:00:00',
                                        endDate: '2023-01-27T00:00:00',
                                        propertyModelActivityId: 136,
                                        predecessor: '125SS+8',
                                        actualStartDate: '2022-11-17T00:00:00',
                                        actualEndDate: '2022-12-20T00:00:00',

                                        displayPredecessor: '125SS+8 days',
                                        basePlanStartDate: '29/12/2022 (IST)',
                                        basePlanEndDate: '27/01/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '34 days',
                                        id: 67,
                                    },
                                    {
                                        taskId: 136,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 126,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-01-22T00:00:00',
                                        endDate: '2023-02-12T00:00:00',
                                        propertyModelActivityId: 137,
                                        predecessor: '135FS-12,134FS-12',
                                        actualStartDate: '2022-11-03T00:00:00',
                                        actualEndDate: '2023-04-14T00:00:00',

                                        displayPredecessor: '135FS-12 days,134FS-12 days',
                                        basePlanStartDate: '22/01/2023 (IST)',
                                        basePlanEndDate: '12/02/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '163 days',
                                        id: 68,
                                    },
                                    {
                                        taskId: 138,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 126,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-01-30T00:00:00',
                                        endDate: '2023-02-15T00:00:00',
                                        propertyModelActivityId: 139,
                                        predecessor: '136SS+8,132FS,133FS',
                                        actualStartDate: '2022-12-25T00:00:00',
                                        actualEndDate: '2023-01-06T00:00:00',

                                        displayPredecessor: '136SS+8 days,132FS,133FS',
                                        basePlanStartDate: '30/01/2023 (IST)',
                                        basePlanEndDate: '15/02/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '13 days',
                                        id: 69,
                                    },
                                ],
                                actualDuration: '163 days',
                                id: 63,
                            },
                            {
                                taskId: 139,
                                blockId: 1,
                                floorId: 33,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-01',
                                startDate: '2023-02-05T00:00:00',
                                endDate: '2023-03-30T00:00:00',
                                propertyModelActivityId: 140,

                                actualStartDate: '2022-12-28T00:00:00',
                                actualEndDate: '2023-04-13T00:00:00',


                                basePlanStartDate: '05/02/2023 (IST)',
                                basePlanEndDate: '30/03/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 147,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 139,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-02-06T00:00:00',
                                        endDate: '2023-02-28T00:00:00',
                                        propertyModelActivityId: 148,
                                        predecessor: '138SS+7',
                                        actualStartDate: '2023-01-15T00:00:00',
                                        actualEndDate: '2023-02-21T00:00:00',

                                        displayPredecessor: '138SS+7 days',
                                        basePlanStartDate: '06/02/2023 (IST)',
                                        basePlanEndDate: '28/02/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '38 days',
                                        id: 71,
                                    },
                                    {
                                        taskId: 148,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 139,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-02-07T00:00:00',
                                        endDate: '2023-02-26T00:00:00',
                                        propertyModelActivityId: 149,
                                        predecessor: '138SS+8',
                                        actualStartDate: '2023-01-05T00:00:00',
                                        actualEndDate: '2023-02-23T00:00:00',

                                        displayPredecessor: '138SS+8 days',
                                        basePlanStartDate: '07/02/2023 (IST)',
                                        basePlanEndDate: '26/02/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '50 days',
                                        id: 72,
                                    },
                                    {
                                        taskId: 145,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 139,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-02-05T00:00:00',
                                        endDate: '2023-03-11T00:00:00',
                                        propertyModelActivityId: 146,
                                        predecessor: '138SS+6',
                                        actualStartDate: '2022-12-28T00:00:00',
                                        actualEndDate: '2023-01-19T00:00:00',

                                        displayPredecessor: '138SS+6 days',
                                        basePlanStartDate: '05/02/2023 (IST)',
                                        basePlanEndDate: '11/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '23 days',
                                        id: 73,
                                    },
                                    {
                                        taskId: 146,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 139,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-02-05T00:00:00',
                                        endDate: '2023-03-11T00:00:00',
                                        propertyModelActivityId: 147,
                                        predecessor: '138SS+6',
                                        actualStartDate: '2022-12-31T00:00:00',
                                        actualEndDate: '2023-01-25T00:00:00',

                                        displayPredecessor: '138SS+6 days',
                                        basePlanStartDate: '05/02/2023 (IST)',
                                        basePlanEndDate: '11/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '26 days',
                                        id: 74,
                                    },
                                    {
                                        taskId: 149,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 139,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-02-21T00:00:00',
                                        endDate: '2023-03-16T00:00:00',
                                        propertyModelActivityId: 150,
                                        predecessor: '148FS-8,147FS-8',
                                        actualStartDate: '2023-01-18T00:00:00',
                                        actualEndDate: '2023-04-13T00:00:00',

                                        displayPredecessor: '148FS-8 days,147FS-8 days',
                                        basePlanStartDate: '21/02/2023 (IST)',
                                        basePlanEndDate: '16/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '86 days',
                                        id: 75,
                                    },
                                    {
                                        taskId: 151,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 139,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-03-12T00:00:00',
                                        endDate: '2023-03-30T00:00:00',
                                        propertyModelActivityId: 152,
                                        predecessor: '149SS+8,145FS,146FS',
                                        actualStartDate: '2023-02-04T00:00:00',
                                        actualEndDate: '2023-02-24T00:00:00',

                                        displayPredecessor: '149SS+8 days,145FS,146FS',
                                        basePlanStartDate: '12/03/2023 (IST)',
                                        basePlanEndDate: '30/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '21 days',
                                        id: 76,
                                    },
                                ],
                                actualDuration: '107 days',
                                id: 70,
                            },
                            {
                                taskId: 152,
                                blockId: 1,
                                floorId: 43,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-02',
                                startDate: '2023-03-18T00:00:00',
                                endDate: '2023-04-12T00:00:00',
                                propertyModelActivityId: 153,

                                actualStartDate: '2023-02-05T00:00:00',
                                actualEndDate: '2023-04-19T00:00:00',


                                basePlanStartDate: '18/03/2023 (IST)',
                                basePlanEndDate: '12/04/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 158,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 152,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-03-18T00:00:00',
                                        endDate: '2023-03-27T00:00:00',
                                        propertyModelActivityId: 159,
                                        predecessor: '151SS+6',
                                        actualStartDate: '2023-02-05T00:00:00',
                                        actualEndDate: '2023-03-27T00:00:00',

                                        displayPredecessor: '151SS+6 days',
                                        basePlanStartDate: '18/03/2023 (IST)',
                                        basePlanEndDate: '27/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '51 days',
                                        id: 78,
                                    },
                                    {
                                        taskId: 159,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 152,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-03-18T00:00:00',
                                        endDate: '2023-03-30T00:00:00',
                                        propertyModelActivityId: 160,
                                        predecessor: '151SS+6',
                                        actualStartDate: '2023-02-05T00:00:00',
                                        actualEndDate: '2023-03-17T00:00:00',

                                        displayPredecessor: '151SS+6 days',
                                        basePlanStartDate: '18/03/2023 (IST)',
                                        basePlanEndDate: '30/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '41 days',
                                        id: 79,
                                    },
                                    {
                                        taskId: 160,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 152,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-03-19T00:00:00',
                                        endDate: '2023-03-30T00:00:00',
                                        propertyModelActivityId: 161,
                                        predecessor: '151SS+7',
                                        actualStartDate: '2023-02-27T00:00:00',
                                        actualEndDate: '2023-03-14T00:00:00',

                                        displayPredecessor: '151SS+7 days',
                                        basePlanStartDate: '19/03/2023 (IST)',
                                        basePlanEndDate: '30/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '16 days',
                                        id: 80,
                                    },
                                    {
                                        taskId: 161,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 152,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-03-20T00:00:00',
                                        endDate: '2023-03-31T00:00:00',
                                        propertyModelActivityId: 162,
                                        predecessor: '151SS+8',
                                        actualStartDate: '2023-02-21T00:00:00',
                                        actualEndDate: '2023-03-13T00:00:00',

                                        displayPredecessor: '151SS+8 days',
                                        basePlanStartDate: '20/03/2023 (IST)',
                                        basePlanEndDate: '31/03/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '21 days',
                                        id: 81,
                                    },
                                    {
                                        taskId: 162,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 152,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-03-27T00:00:00',
                                        endDate: '2023-04-07T00:00:00',
                                        propertyModelActivityId: 163,
                                        predecessor: '160FS-5,161FS-5',
                                        actualStartDate: '2023-02-08T00:00:00',
                                        actualEndDate: '2023-04-19T00:00:00',

                                        displayPredecessor: '160FS-5 days,161FS-5 days',
                                        basePlanStartDate: '27/03/2023 (IST)',
                                        basePlanEndDate: '07/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '71 days',
                                        id: 82,
                                    },
                                    {
                                        taskId: 164,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 152,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-04-04T00:00:00',
                                        endDate: '2023-04-12T00:00:00',
                                        propertyModelActivityId: 165,
                                        predecessor: '162SS+8,158FS,159FS',
                                        actualStartDate: '2023-02-07T00:00:00',
                                        actualEndDate: '2023-03-20T00:00:00',

                                        displayPredecessor: '162SS+8 days,158FS,159FS',
                                        basePlanStartDate: '04/04/2023 (IST)',
                                        basePlanEndDate: '12/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '42 days',
                                        id: 83,
                                    },
                                ],
                                actualDuration: '74 days',
                                id: 77,
                            },
                            {
                                taskId: 165,
                                blockId: 1,
                                floorId: 31,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-03',
                                startDate: '2023-04-10T00:00:00',
                                endDate: '2023-04-25T00:00:00',
                                propertyModelActivityId: 166,

                                actualStartDate: '2023-03-09T00:00:00',
                                actualEndDate: '2023-05-13T00:00:00',


                                basePlanStartDate: '10/04/2023 (IST)',
                                basePlanEndDate: '25/04/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 171,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 165,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-04-10T00:00:00',
                                        endDate: '2023-04-14T00:00:00',
                                        propertyModelActivityId: 172,
                                        predecessor: '164SS+6',
                                        actualStartDate: '2023-03-11T00:00:00',
                                        actualEndDate: '2023-03-29T00:00:00',

                                        displayPredecessor: '164SS+6 days',
                                        basePlanStartDate: '10/04/2023 (IST)',
                                        basePlanEndDate: '14/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '19 days',
                                        id: 85,
                                    },
                                    {
                                        taskId: 172,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 165,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-04-10T00:00:00',
                                        endDate: '2023-04-14T00:00:00',
                                        propertyModelActivityId: 173,
                                        predecessor: '164SS+6',
                                        actualStartDate: '2023-03-09T00:00:00',
                                        actualEndDate: '2023-04-08T00:00:00',

                                        displayPredecessor: '164SS+6 days',
                                        basePlanStartDate: '10/04/2023 (IST)',
                                        basePlanEndDate: '14/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '31 days',
                                        id: 86,
                                    },
                                    {
                                        taskId: 174,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 165,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-04-10T00:00:00',
                                        endDate: '2023-04-14T00:00:00',
                                        propertyModelActivityId: 175,
                                        predecessor: '164SS+6',
                                        actualStartDate: '2023-03-15T00:00:00',
                                        actualEndDate: '2023-04-08T00:00:00',

                                        displayPredecessor: '164SS+6 days',
                                        basePlanStartDate: '10/04/2023 (IST)',
                                        basePlanEndDate: '14/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '25 days',
                                        id: 87,
                                    },
                                    {
                                        taskId: 173,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 165,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-04-11T00:00:00',
                                        endDate: '2023-04-15T00:00:00',
                                        propertyModelActivityId: 174,
                                        predecessor: '164SS+7',
                                        actualStartDate: '2023-04-01T00:00:00',
                                        actualEndDate: '2023-04-13T00:00:00',

                                        displayPredecessor: '164SS+7 days',
                                        basePlanStartDate: '11/04/2023 (IST)',
                                        basePlanEndDate: '15/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '13 days',
                                        id: 88,
                                    },
                                    {
                                        taskId: 175,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 165,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-04-14T00:00:00',
                                        endDate: '2023-04-21T00:00:00',
                                        propertyModelActivityId: 176,
                                        predecessor: '173SS+3,174SS+3',
                                        actualStartDate: '2023-03-15T00:00:00',
                                        actualEndDate: '2023-05-13T00:00:00',

                                        displayPredecessor: '173SS+3 days,174SS+3 days',
                                        basePlanStartDate: '14/04/2023 (IST)',
                                        basePlanEndDate: '21/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '60 days',
                                        id: 89,
                                    },
                                    {
                                        taskId: 177,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 165,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-04-19T00:00:00',
                                        endDate: '2023-04-25T00:00:00',
                                        propertyModelActivityId: 178,
                                        predecessor: '175SS+5,171FS,172FS',
                                        actualStartDate: '2023-04-07T00:00:00',
                                        actualEndDate: '2023-04-18T00:00:00',

                                        displayPredecessor: '175SS+5 days,171FS,172FS',
                                        basePlanStartDate: '19/04/2023 (IST)',
                                        basePlanEndDate: '25/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '12 days',
                                        id: 90,
                                    },
                                ],
                                actualDuration: '66 days',
                                id: 84,
                            },
                            {
                                taskId: 178,
                                blockId: 1,
                                floorId: 30,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-04',
                                startDate: '2023-04-24T00:00:00',
                                endDate: '2023-05-09T00:00:00',
                                propertyModelActivityId: 179,

                                actualStartDate: '2023-04-10T00:00:00',
                                actualEndDate: '2023-06-17T00:00:00',


                                basePlanStartDate: '24/04/2023 (IST)',
                                basePlanEndDate: '09/05/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 184,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 178,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-04-24T00:00:00',
                                        endDate: '2023-04-28T00:00:00',
                                        propertyModelActivityId: 185,
                                        predecessor: '177SS+5',
                                        actualStartDate: '2023-04-11T00:00:00',
                                        actualEndDate: '2023-04-18T00:00:00',

                                        displayPredecessor: '177SS+5 days',
                                        basePlanStartDate: '24/04/2023 (IST)',
                                        basePlanEndDate: '28/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '8 days',
                                        id: 92,
                                    },
                                    {
                                        taskId: 185,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 178,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-04-24T00:00:00',
                                        endDate: '2023-04-28T00:00:00',
                                        propertyModelActivityId: 186,
                                        predecessor: '177SS+5',
                                        actualStartDate: '2023-04-10T00:00:00',
                                        actualEndDate: '2023-05-01T00:00:00',

                                        displayPredecessor: '177SS+5 days',
                                        basePlanStartDate: '24/04/2023 (IST)',
                                        basePlanEndDate: '28/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '22 days',
                                        id: 93,
                                    },
                                    {
                                        taskId: 187,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 178,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-04-24T00:00:00',
                                        endDate: '2023-04-28T00:00:00',
                                        propertyModelActivityId: 188,
                                        predecessor: '177SS+5',
                                        actualStartDate: '2023-04-17T00:00:00',
                                        actualEndDate: '2023-04-25T00:00:00',

                                        displayPredecessor: '177SS+5 days',
                                        basePlanStartDate: '24/04/2023 (IST)',
                                        basePlanEndDate: '28/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '9 days',
                                        id: 94,
                                    },
                                    {
                                        taskId: 186,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 178,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-04-25T00:00:00',
                                        endDate: '2023-04-29T00:00:00',
                                        propertyModelActivityId: 187,
                                        predecessor: '177SS+6',
                                        actualStartDate: '2023-04-22T00:00:00',
                                        actualEndDate: '2023-05-06T00:00:00',

                                        displayPredecessor: '177SS+6 days',
                                        basePlanStartDate: '25/04/2023 (IST)',
                                        basePlanEndDate: '29/04/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '15 days',
                                        id: 95,
                                    },
                                    {
                                        taskId: 188,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 178,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-04-28T00:00:00',
                                        endDate: '2023-05-05T00:00:00',
                                        propertyModelActivityId: 189,
                                        predecessor: '186SS+3,187SS+3',
                                        actualStartDate: '2023-04-15T00:00:00',
                                        actualEndDate: '2023-06-17T00:00:00',

                                        displayPredecessor: '186SS+3 days,187SS+3 days',
                                        basePlanStartDate: '28/04/2023 (IST)',
                                        basePlanEndDate: '05/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '64 days',
                                        id: 96,
                                    },
                                    {
                                        taskId: 190,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 178,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-05-03T00:00:00',
                                        endDate: '2023-05-09T00:00:00',
                                        propertyModelActivityId: 191,
                                        predecessor: '188SS+5,184FS,185FS',
                                        actualStartDate: '2023-04-27T00:00:00',
                                        actualEndDate: '2023-05-08T00:00:00',

                                        displayPredecessor: '188SS+5 days,184FS,185FS',
                                        basePlanStartDate: '03/05/2023 (IST)',
                                        basePlanEndDate: '09/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '12 days',
                                        id: 97,
                                    },
                                ],
                                actualDuration: '69 days',
                                id: 91,
                            },
                            {
                                taskId: 191,
                                blockId: 1,
                                floorId: 29,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-05',
                                startDate: '2023-05-08T00:00:00',
                                endDate: '2023-05-23T00:00:00',
                                propertyModelActivityId: 192,

                                actualStartDate: '2023-04-27T00:00:00',
                                actualEndDate: '2023-06-17T00:00:00',


                                basePlanStartDate: '08/05/2023 (IST)',
                                basePlanEndDate: '23/05/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 199,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 191,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-05-09T00:00:00',
                                        endDate: '2023-05-20T00:00:00',
                                        propertyModelActivityId: 200,
                                        predecessor: '190SS+6',
                                        actualStartDate: '2023-04-27T00:00:00',
                                        actualEndDate: '2023-05-23T00:00:00',

                                        displayPredecessor: '190SS+6 days',
                                        basePlanStartDate: '09/05/2023 (IST)',
                                        basePlanEndDate: '20/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '27 days',
                                        id: 99,
                                    },
                                    {
                                        taskId: 197,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 191,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-05-08T00:00:00',
                                        endDate: '2023-05-12T00:00:00',
                                        propertyModelActivityId: 198,
                                        predecessor: '190SS+5',
                                        actualStartDate: '2023-04-29T00:00:00',
                                        actualEndDate: '2023-05-04T00:00:00',

                                        displayPredecessor: '190SS+5 days',
                                        basePlanStartDate: '08/05/2023 (IST)',
                                        basePlanEndDate: '12/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '6 days',
                                        id: 100,
                                    },
                                    {
                                        taskId: 198,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 191,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-05-08T00:00:00',
                                        endDate: '2023-05-12T00:00:00',
                                        propertyModelActivityId: 199,
                                        predecessor: '190SS+5',
                                        actualStartDate: '2023-04-30T00:00:00',
                                        actualEndDate: '2023-05-17T00:00:00',

                                        displayPredecessor: '190SS+5 days',
                                        basePlanStartDate: '08/05/2023 (IST)',
                                        basePlanEndDate: '12/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '18 days',
                                        id: 101,
                                    },
                                    {
                                        taskId: 200,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 191,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-05-08T00:00:00',
                                        endDate: '2023-05-12T00:00:00',
                                        propertyModelActivityId: 201,
                                        predecessor: '190SS+5',
                                        actualStartDate: '2023-05-03T00:00:00',
                                        actualEndDate: '2023-05-13T00:00:00',

                                        displayPredecessor: '190SS+5 days',
                                        basePlanStartDate: '08/05/2023 (IST)',
                                        basePlanEndDate: '12/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '11 days',
                                        id: 102,
                                    },
                                    {
                                        taskId: 201,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 191,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-05-12T00:00:00',
                                        endDate: '2023-05-19T00:00:00',
                                        propertyModelActivityId: 202,
                                        predecessor: '199SS+3,200SS+3',
                                        actualStartDate: '2023-05-02T00:00:00',
                                        actualEndDate: '2023-06-17T00:00:00',

                                        displayPredecessor: '199SS+3 days,200SS+3 days',
                                        basePlanStartDate: '12/05/2023 (IST)',
                                        basePlanEndDate: '19/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '47 days',
                                        id: 103,
                                    },
                                    {
                                        taskId: 203,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 191,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-05-17T00:00:00',
                                        endDate: '2023-05-23T00:00:00',
                                        propertyModelActivityId: 204,
                                        predecessor: '201SS+5,197FS,198FS',
                                        actualStartDate: '2023-05-15T00:00:00',
                                        actualEndDate: '2023-05-23T00:00:00',

                                        displayPredecessor: '201SS+5 days,197FS,198FS',
                                        basePlanStartDate: '17/05/2023 (IST)',
                                        basePlanEndDate: '23/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '9 days',
                                        id: 104,
                                    },
                                ],
                                actualDuration: '52 days',
                                id: 98,
                            },
                            {
                                taskId: 204,
                                blockId: 1,
                                floorId: 28,
                                siteDrawingTypeId: 1,




                                parentId: 3,
                                taskName: 'Level-06',
                                startDate: '2023-05-22T00:00:00',
                                endDate: '2023-06-06T00:00:00',
                                propertyModelActivityId: 205,

                                actualStartDate: '2023-05-17T00:00:00',
                                actualEndDate: '2023-07-01T00:00:00',


                                basePlanStartDate: '22/05/2023 (IST)',
                                basePlanEndDate: '06/06/2023 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 210,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 1,
                                        modelActivityName: 'Precast Column Erection',
                                        parentId: 204,
                                        taskName: 'Precast Column Erection',
                                        startDate: '2023-05-22T00:00:00',
                                        endDate: '2023-05-26T00:00:00',
                                        propertyModelActivityId: 211,
                                        predecessor: '203SS+5',
                                        actualStartDate: '2023-05-17T00:00:00',
                                        actualEndDate: '2023-05-30T00:00:00',

                                        displayPredecessor: '203SS+5 days',
                                        basePlanStartDate: '22/05/2023 (IST)',
                                        basePlanEndDate: '26/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '14 days',
                                        id: 106,
                                    },
                                    {
                                        taskId: 211,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 2,
                                        modelActivityName: 'Precast Walls Erection',
                                        parentId: 204,
                                        taskName: 'Precast Walls Erection',
                                        startDate: '2023-05-22T00:00:00',
                                        endDate: '2023-05-26T00:00:00',
                                        propertyModelActivityId: 212,
                                        predecessor: '203SS+5',
                                        actualStartDate: '2023-05-17T00:00:00',
                                        actualEndDate: '2023-06-01T00:00:00',

                                        displayPredecessor: '203SS+5 days',
                                        basePlanStartDate: '22/05/2023 (IST)',
                                        basePlanEndDate: '26/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '16 days',
                                        id: 107,
                                    },
                                    {
                                        taskId: 213,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 4,
                                        modelActivityName: 'CIS Column casting',
                                        parentId: 204,
                                        taskName: 'CIS Column casting',
                                        startDate: '2023-05-22T00:00:00',
                                        endDate: '2023-05-26T00:00:00',
                                        propertyModelActivityId: 214,
                                        predecessor: '203SS+5',
                                        actualStartDate: '2023-05-24T00:00:00',
                                        actualEndDate: '2023-05-28T00:00:00',

                                        displayPredecessor: '203SS+5 days',
                                        basePlanStartDate: '22/05/2023 (IST)',
                                        basePlanEndDate: '26/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '5 days',
                                        id: 108,
                                    },
                                    {
                                        taskId: 212,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 3,
                                        modelActivityName: 'CIS walls casting',
                                        parentId: 204,
                                        taskName: 'CIS walls casting',
                                        startDate: '2023-05-23T00:00:00',
                                        endDate: '2023-05-27T00:00:00',
                                        propertyModelActivityId: 213,
                                        predecessor: '203SS+6',
                                        actualStartDate: '2023-05-24T00:00:00',
                                        actualEndDate: '2023-06-01T00:00:00',

                                        displayPredecessor: '203SS+6 days',
                                        basePlanStartDate: '23/05/2023 (IST)',
                                        basePlanEndDate: '27/05/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '9 days',
                                        id: 109,
                                    },
                                    {
                                        taskId: 214,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 5,
                                        modelActivityName: 'Precast Beams & HCS/SS Erection',
                                        parentId: 204,
                                        taskName: 'Precast Beams & HCS/SS Erection',
                                        startDate: '2023-05-26T00:00:00',
                                        endDate: '2023-06-02T00:00:00',
                                        propertyModelActivityId: 215,
                                        predecessor: '212SS+3,213SS+3',
                                        actualStartDate: '2023-05-19T00:00:00',
                                        actualEndDate: '2023-07-01T00:00:00',

                                        displayPredecessor: '212SS+3 days,213SS+3 days',
                                        basePlanStartDate: '26/05/2023 (IST)',
                                        basePlanEndDate: '02/06/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '44 days',
                                        id: 110,
                                    },
                                    {
                                        taskId: 216,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,


                                        modelActivityId: 7,
                                        modelActivityName: 'Topping and Slab Casting',
                                        parentId: 204,
                                        taskName: 'Topping and Slab Casting',
                                        startDate: '2023-05-31T00:00:00',
                                        endDate: '2023-06-06T00:00:00',
                                        propertyModelActivityId: 217,
                                        predecessor: '214SS+5,210FS,211FS',
                                        actualStartDate: '2023-05-31T00:00:00',
                                        actualEndDate: '2023-06-07T00:00:00',

                                        displayPredecessor: '214SS+5 days,210FS,211FS',
                                        basePlanStartDate: '31/05/2023 (IST)',
                                        basePlanEndDate: '06/06/2023 (IST)',
                                        revisionNo: 1,

                                        actualDuration: '8 days',
                                        id: 111,
                                    },
                                ],
                                actualDuration: '46 days',
                                id: 105,
                            }
                        ],
                        actualDuration: '846 days',
                        id: 3,
                    }
                ],
                actualDuration: '846 days',
                id: 2,
            },
        ],
        actualDuration: '846 days',
        id: 1,
    },
];

export let resourcesData: Object[] = [
    { resourceId: 1, resourceName: 'Resource 1' },
    { resourceId: 2, resourceName: 'Resource 2' },
    { resourceId: 3, resourceName: 'Resource 3' },
    { resourceId: 4, resourceName: 'Resource 4' },
];

export let resourcesDatas: Object[] =
    [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
];
export let coverageData: Object[]=[{
    TaskID: 1,
    TaskName: 'Product Concept',
    StartDate: new Date('04/02/2019'),
    EndDate: new Date('04/21/2019'),
    isManual: false,
    subtasks: [
        { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 3, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
    ]
}];
export let resources: Object[] = [
    { resourceId: 1, resourceName: 'Resource 1' },
    { resourceId: 2, resourceName: 'Resource 2', resourceUnit: 80 },
    { resourceId: 3, resourceName: 'Resource 3', resourceUnit: 40 },
    { resourceId: 4, resourceName: 'Resource 4' },
];

export let scheduleModeData: Object[] = [
    {
        "TaskID": 1,
        "TaskName": "Parent Task 1",
        "StartDate": new Date("02/27/2017"),
        "EndDate": new Date("03/03/2017"),
        "Progress": "40",
        "isManual" : true,
        resources: [1],
        "Children": [
             { "TaskID": 2, resources: [2,3],"TaskName": "Child Task 1", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40" },
             { "TaskID": 3, "TaskName": "Child Task 2", "StartDate": new Date("02/26/2017"), "EndDate": new Date("03/03/2017"), "Progress": "40","isManual": true },
             { "TaskID": 4, "TaskName": "Child Task 3", "StartDate": new Date("02/27/2017"), "EndDate": new Date("03/03/2017"), "Duration": 5, "Progress": "40", }
        ]
    },
    {
        "TaskID": 5,
        "TaskName": "Parent Task 2",
        "StartDate": new Date("03/05/2017"),
        "EndDate": new Date("03/09/2017"),
        "Progress": "40",
        "isManual": true,
        "Children": [
             { "TaskID": 6, "TaskName": "Child Task 1", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40" },
             { "TaskID": 7, "TaskName": "Child Task 2", "StartDate": new Date("03/06/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40", },
             { "TaskID": 8, "TaskName": "Child Task 3", "StartDate": new Date("02/28/2017"), "EndDate": new Date("03/05/2017"), "Progress": "40","isManual":true },
             { "TaskID": 9, "TaskName": "Child Task 4", "StartDate": new Date("03/04/2017"), "EndDate": new Date("03/09/2017"), "Progress": "40","isManual":true }
        ]
    },
    {
        "TaskID": 10,
        "TaskName": "Parent Task 3",
        "StartDate": new Date("03/13/2017"),
        "EndDate": new Date("03/17/2017"),
        "Progress": "40",
        "Children": [
             { "TaskID": 11, "TaskName": "Child Task 1", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40" },
             { "TaskID": 12, "TaskName": "Child Task 2", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
             { "TaskID": 13, "TaskName": "Child Task 3", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", },
             { "TaskID": 14, "TaskName": "Child Task 4", "StartDate": new Date("03/12/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40","isManual":true },
             { "TaskID": 15, "TaskName": "Child Task 5", "StartDate": new Date("03/13/2017"), "EndDate": new Date("03/17/2017"), "Progress": "40", }
        ]
    }
];

export let customScheduleModeData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40' },
            { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true }
        ]
    }
];

export let resourceDataTaskType: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 2,
                Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [2, 3, 5], work: 96, type: 'FixedDuration'
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 1,
                work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 4, unit: 50 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/01/2019'), Duration: 3,
                work: 48, resources: [4, 8], type: 'FixedUnit'
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/01/2019'),
                Duration: 2, work: 60, resources: [12, { resourceId: 5, unit: 70 }]
            }
        ]
    },
    {
        TaskID: 9, TaskName: 'Sign contract', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }
];
export let resourceResources: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];
export let taskTypeData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30, },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, taskType: 'FixedDuration' },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", taskType: 'FixedDuration' }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9", taskType: 'FixedDuration' },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
];
export let taskTypeWorkData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, work: 5, Progress: 30, },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, taskType: 'FixedDuration' },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", taskType: 'FixedDuration' }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9", taskType: 'FixedDuration' },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10", work : 10 }
        ]
    },
];

export let resourceCollection = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
];

export let resourceViewData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];

export let normalResourceData = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];
export let multiTaskbarData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
                Duration: 5, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 50 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 40 }], Predecessor: '6FS-2', Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
                Duration: 4, resources: [{ resourceId: 2, resourceUnit: 75 }], Predecessor: '7FS-1', Progress: 30, work: 60,
            }
        ]
    },
    {
        TaskID: 9,
        TaskName: 'Site work',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 10, TaskName: 'Install temporary power service', StartDate: new Date('04/01/2019'), Duration: 14,
                Progress: 30, resources: [{ resourceId: 3, resourceUnit: 75 }]
            },
            {
                TaskID: 11, TaskName: 'Clear the building site', StartDate: new Date('04/08/2019'),
                Duration: 9, Progress: 30, Predecessor: '10FS-9', resources: [3]
            },
            {
                TaskID: 12, TaskName: 'Sign contract', StartDate: new Date('04/12/2019'),
                Duration: 5, resources: [3], Predecessor: '11FS-5'
            },
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Foundation',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 14, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 2, Progress: 30, resources: [4]
            },
            {
                TaskID: 15, TaskName: 'Dig footer', StartDate: new Date('04/04/2019'),
                Duration: 2, Predecessor: '14FS + 1', resources: [4]
            },
            {
                TaskID: 16, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 2,
                Progress: 30, Predecessor: 15, resources: [4]
            }
        ]
    },
    {
        TaskID: 17,
        TaskName: 'Framing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 18, TaskName: 'Add load-bearing structure', StartDate: new Date('04/03/2019'),
                Duration: 2, Progress: 30, resources: [5]
            },
            {
                TaskID: 19, TaskName: 'Natural gas utilities', StartDate: new Date('04/08/2019'),
                Duration: 4, Predecessor: '18', resources: [5]
            },
            {
                TaskID: 20, TaskName: 'Electrical utilities', StartDate: new Date('04/11/2019'),
                Duration: 2, Progress: 30, Predecessor: '19FS + 1', resources: [5]
            }
        ]
    }
];

export let multiResources = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true },
    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team', isExpand: false },
    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team', isExpand: false },
    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team', isExpand: true }
];
export let selfData: object[] = [
    {
        taskID: 1,
        taskName: 'Project Schedule',
        startDate: new Date('02/04/2019'),
        endDate: new Date('03/10/2019')
    },
    {
        taskID: 2,
        taskName: 'Planning',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        parentID: 1
    },
    {
        taskID: 3,
        taskName: 'Plan timeline',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '60',
        parentID: 2
    },
    {
        taskID: 4,
        taskName: 'Plan budget',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '90',
        parentID: 2
    },
    {
        taskID: 5,
        taskName: 'Allocate resources',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '75',
        parentID: 2
    },
    {
        taskID: 6,
        taskName: 'Planning complete',
        startDate: new Date('02/06/2019'),
        endDate: new Date('02/10/2019'),
        duration: 0,
        predecessor: '3FS,4FS,5FS',
        parentID: 2
    },
    {
        taskID: 7,
        taskName: 'Design',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/17/2019'),
        parentID: 1,
    },
    {
        taskID: 8,
        taskName: 'Software Specification',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '60',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: 9,
        taskName: 'Develop prototype',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '100',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: 10,
        taskName: 'Get approval from customer',
        startDate: new Date('02/16/2019'),
        endDate: new Date('02/17/2019'),
        duration: 2,
        progress: '100',
        predecessor: '9FS',
        parentID: 7,
    },
    {
        taskID: 11,
        taskName: 'Design complete',
        startDate: new Date('02/17/2019'),
        endDate: new Date('02/17/2019'),
        duration: 0,
        predecessor: '10FS',
        parentID: 7,
    }
];
export let resourceSelefReferenceData = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        resources: [{ resourceId: 1, resourceUnit: 50 }]
    },
    {
        TaskID: 2, parentId: 1, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
        Progress: 30, work: 10, resources: [{ resourceId: 2, resourceUnit: 50 }]
    },
    {
        TaskID: 3, parentId: 1, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
        resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
    },
    {
        TaskID: 4, parentId: 1, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
        resources: [{ resourceId: 3, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        resources: [{ resourceId: 2, resourceUnit: 40 }],
    },
    {
        TaskID: 6, parentId: 5, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
        Duration: 5, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 50 }], work: 30
    },
    {
        TaskID: 7, parentId: 5, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
        resources: [{ resourceId: 2, resourceUnit: 40 }], Predecessor: '6FS-2', Progress: 30, work: 40
    },
    {
        TaskID: 8, parentId: 5, TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
        Duration: 4, resources: [{ resourceId: 5, resourceUnit: 75 }], Predecessor: '7FS-1', Progress: 30, work: 60,
    }

];
export let dragSelfReferenceData: Object[] = [
    {
        taskID: 1,
        taskName: 'Project Schedule',
        startDate: new Date('02/04/2019'),
        endDate: new Date('03/10/2019')
    },
    {
        taskID: 2,
        taskName: 'Planning',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        parentID: 1
    },
    {
        taskID: 3,
        taskName: 'Plan timeline',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '60',
        parentID: 2
    },
    {
        taskID: 4,
        taskName: 'Plan budget',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '90',
        parentID: 2
    },
    {
        taskID: 5,
        taskName: 'Allocate resources',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '75',
        parentID: 2
    },
    {
        taskID: 6,
        taskName: 'Planning complete',
        startDate: new Date('02/06/2019'),
        endDate: new Date('02/10/2019'),
        duration: 0,
        predecessor: '3FS,4FS,5FS',
        parentID: 2
    },
    {
        taskID: 7,
        taskName: 'Design',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/17/2019'),
        parentID: 1,
    },
    {
        taskID: 8,
        taskName: 'Software Specification',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '60',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: 9,
        taskName: 'Develop prototype',
        startDate: new Date('02/13/2019'),
        endDate: new Date('02/15/2019'),
        duration: 3,
        progress: '100',
        predecessor: '6FS',
        parentID: 7,
    },
    {
        taskID: 10,
        taskName: 'Get approval from customer',
        startDate: new Date('02/16/2019'),
        endDate: new Date('02/17/2019'),
        duration: 2,
        progress: '100',
        predecessor: '9FS',
        parentID: 7,
    },
    {
        taskID: 11,
        taskName: 'Design complete',
        startDate: new Date('02/17/2019'),
        endDate: new Date('02/17/2019'),
        duration: 0,
        predecessor: '10FS',
        parentID: 7,
    }
];
export let virtualResourceData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Task 1',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Task 2', StartDate: new Date('03/29/2019'), Duration: 2,
                Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 3, TaskName: 'Task 3', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [2, 3, 5], work: 96
            },
            {
                TaskID: 4, TaskName: 'Task 4', StartDate: new Date('03/29/2019'), Duration: 1,
                work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Task 5', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Task 6', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 4, unit: 50 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'Task 7', StartDate: new Date('04/01/2019'), Duration: 3,
                work: 48, resources: [4, 8]
            },
            {
                TaskID: 8, TaskName: 'Task 8', StartDate: new Date('04/01/2019'),
                Duration: 2, work: 60, resources: [12, { resourceId: 5, unit: 70 }]
            }
        ]
    },
    {
        TaskID: 9, TaskName: 'Task 9', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    },
    {
        TaskID: 10, TaskName: 'Task 10', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    },
    {
        TaskID: 11,
        TaskName: 'Task 11',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 12, TaskName: 'Task 12', StartDate: new Date('03/29/2019'), Duration: 2,
                Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 13, TaskName: 'Task 13', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [2, 3, 5], work: 96
            },
            {
                TaskID: 14, TaskName: 'Task 14', StartDate: new Date('03/29/2019'), Duration: 1,
                work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30
            },
        ]
    },
    {
        TaskID: 15,
        TaskName: 'Task 15', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 16, TaskName: 'Task 16', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 4, unit: 50 }], work: 30
            },
            {
                TaskID: 17, TaskName: 'Task 17', StartDate: new Date('04/01/2019'), Duration: 3,
                work: 48, resources: [4, 8]
            },
            {
                TaskID: 18, TaskName: 'Task 18', StartDate: new Date('04/01/2019'),
                Duration: 2, work: 60, resources: [12, { resourceId: 5, unit: 70 }]
            }
        ]
    },
    {
        TaskID: 19, TaskName: 'Task 19', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    },
    {
        TaskID: 20, TaskName: 'Task 20', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    },
    {
        TaskID: 21,
        TaskName: 'Task 21',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 22, TaskName: 'Task 22', StartDate: new Date('03/29/2019'), Duration: 2,
                Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 23, TaskName: 'Task 23', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [2, 3, 5], work: 96
            },
            {
                TaskID: 24, TaskName: 'Task 24', StartDate: new Date('03/29/2019'), Duration: 1,
                work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30
            },
        ]
    },
    {
        TaskID: 25,
        TaskName: 'Task 25', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 26, TaskName: 'Task 26', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 4, unit: 50 }], work: 30
            },
            {
                TaskID: 27, TaskName: 'Task 27', StartDate: new Date('04/01/2019'), Duration: 3,
                work: 48, resources: [4, 8]
            },
            {
                TaskID: 28, TaskName: 'Task 28', StartDate: new Date('04/01/2019'),
                Duration: 2, work: 60, resources: [12, { resourceId: 5, unit: 70 }]
            }
        ]
    },
    {
        TaskID: 29, TaskName: 'Task 29', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }
];
export let editingResources= [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];
export let editingData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2019'), Duration: 0,
                Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction'
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2',
                resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                    'From an engineer or company specializing in soil testing'
            },
            { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3', Progress: 30 },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'),
                Duration: 3, Predecessor: '4', Progress: 30, resources: 4,
                info: 'Develop floor plans and obtain a materials list for estimations'
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'),
                Duration: 3, Predecessor: '6', resources: [4, 8], info: ''
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'),
                Duration: 0, Predecessor: '7', resources: [12, 5], info: ''
            }
        ]
    },
    {
        TaskID: 9, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 1,
        Predecessor: '8', Progress: 30, resources: [12],
        info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)'
    },
    {
        TaskID: 10,
        TaskName: 'Project approval and kick off',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        Duration: 0,
        Predecessor: '9'
    },
    {
        TaskID: 11,
        TaskName: 'Site work',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 12, TaskName: 'Clear the building site', StartDate: new Date('04/04/2019'),
                Duration: 2, Progress: 30, Predecessor: '9', resources: [6, 7],
                info: 'Clear the building site (demolition of existing home if necessary)'
            },
            {
                TaskID: 13, TaskName: 'Install temporary power service', StartDate: new Date('04/04/2019'),
                Duration: 2, Predecessor: '12', resources: [6, 7], info: ''
            },
        ]
    },
    {
        TaskID: 14,
        TaskName: 'Foundation',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 15, TaskName: 'Excavate for foundations', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '13', resources: [2, 8],
                info: 'Excavate the foundation and dig footers (Scope of work is dependent of foundation designed by engineer)'
            },
            {
                TaskID: 16, TaskName: 'Dig footer', StartDate: new Date('04/04/2019'),
                Duration: 2, Predecessor: '15FF', resources: [8], info: ''
            },
            {
                TaskID: 17, TaskName: 'Install plumbing grounds', StartDate: new Date('04/04/2019'), Duration: 4,
                Progress: 30, Predecessor: '15', resources: [9], info: ''
            },
            {
                TaskID: 18, TaskName: 'Pour a foundation and footer with concrete', StartDate: new Date('04/04/2019'),
                Duration: 1, Predecessor: '17', resources: [8, 9, 10], info: ''
            },
            {
                TaskID: 19, TaskName: 'Cure basement walls', StartDate: new Date('04/04/2019'), Duration: 4,
                Progress: 30, Predecessor: '18', resources: [10], info: ''
            },
        ]
    },
    {
        TaskID: 20,
        TaskName: 'Framing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 21, TaskName: 'Add load-bearing structure', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '19', resources: [4, 5],
                info: 'Build the main load-bearing structure out of thick pieces of wood and' +
                    'possibly metal I-beams for large spans with few supports'
            },
            {
                TaskID: 22, TaskName: 'Install floor joists', StartDate: new Date('04/04/2019'),
                Duration: 3, Predecessor: '21', resources: [2, 3], info: 'Add floor and ceiling joists and install subfloor panels'
            },
            {
                TaskID: 23, TaskName: 'Add ceiling joists', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '22SS', resources: [5], info: ''
            },
            {
                TaskID: 24, TaskName: 'Install subfloor panels', StartDate: new Date('04/04/2019'),
                Duration: 3, Predecessor: '23', resources: [8, 9]
            },
            {
                TaskID: 25, TaskName: 'Frame floor walls', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '24', resources: [10], info: ''
            },
            {
                TaskID: 26, TaskName: 'Frame floor decking', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '25SS', resources: [4, 8], info: ''
            },
        ]
    },
    {
        TaskID: 27,
        TaskName: 'Exterior finishing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 28, TaskName: 'Cover outer walls and roof in OSB', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '26', resources: [2, 8],
                info: 'Cover outer walls and roof in OSB or plywood and a water-resistive barrier'
            },
            {
                TaskID: 29, TaskName: 'Add water resistive barrier', StartDate: new Date('04/04/2019'),
                Duration: 3, Predecessor: '28', resources: [1, 10],
                info: 'Cover the walls with siding, typically vinyl, wood, or brick veneer but possibly stone or other materials'
            },
            {
                TaskID: 30, TaskName: 'Install roof shingles', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '29', resources: [8, 9], info: 'Install roof shingles or other covering for flat roof'
            },
            { TaskID: 31, TaskName: 'Install windows', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '29', resources: 7 },
        ]
    },
    {
        TaskID: 32,
        TaskName: 'Utilities',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 33, TaskName: 'Install internal plumbing', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '26', resources: [1, 10]
            },
            {
                TaskID: 34, TaskName: 'Install HVAC', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '33',
                resources: [4, 9], info: 'Add internal plumbing, HVAC, electrical, and natural gas utilities'
            },
            {
                TaskID: 35, TaskName: 'Electrical utilities', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '34'
            },
            {
                TaskID: 36, TaskName: 'Natural gas utilities', StartDate: new Date('04/04/2019'), Duration: 3,
                Predecessor: '35', resources: 11
            },
            {
                TaskID: 37, TaskName: 'Install bathroom fixtures', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '35', resources: [3, 7]
            },
        ],
        info: 'Building inspector visits if necessary to approve utilities and framing'
    },
    {
        TaskID: 38,
        TaskName: 'Interior finsihing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 39, TaskName: 'Install insulation', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '37', resources: [1, 8], info: 'Frame interior walls with wooden 2×4s'
            },
            {
                TaskID: 40, TaskName: 'Install  drywall panels', StartDate: new Date('04/04/2019'), Duration: 3,
                Predecessor: '39', resources: 5,
                info: 'Install insulation and interior drywall panels (cementboard for wet areas) and to complete walls and ceilings'
            },
            {
                TaskID: 41, TaskName: 'Spackle', StartDate: new Date('04/04/2019'), Duration: 3,
                Progress: 30, Predecessor: '40', resources: 10
            },
            {
                TaskID: 42, TaskName: 'Apply primer', StartDate: new Date('04/04/2019'), Duration: 3,
                Predecessor: '41', resources: [10, 11]
            },
            {
                TaskID: 43, TaskName: 'Paint wall and ceilings', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '42', resources: [2, 9]
            },
            {
                TaskID: 44, TaskName: 'Install modular kitchen', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '43', resources: [5, 7]
            },
        ]
    },
    {
        TaskID: 45,
        TaskName: 'Flooring',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 46, TaskName: 'Tile kitchen, bathroom and entry walls', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '44', resources: [4, 9, 3],
                info: 'Additional tiling on top of cementboard for wet areas, such as the bathroom and kitchen backsplash'
            },
            {
                TaskID: 47, TaskName: 'Tile floor', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '46SS',
                resources: [2, 8], info: 'Installation of final floor covering, such as floor tile, carpet, or wood flooring'
            },
        ]
    },
    {
        TaskID: 48,
        TaskName: 'Final Acceptance',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 49, TaskName: 'Final inspection', StartDate: new Date('04/04/2019'), Duration: 2,
                Progress: 30, Predecessor: '47', resources: 12, info: 'Ensure the contracted items'
            },
            {
                TaskID: 50, TaskName: 'Cleanup for occupancy', StartDate: new Date('04/04/2019'), Duration: 2,
                Predecessor: '49', resources: [1, 5], info: 'Installation of major appliances'
            },
            {
                TaskID: 51, TaskName: 'Property handover', StartDate: new Date('04/04/2019'), Duration: 0,
                Predecessor: '50', info: 'Ending the contract'
            },
        ]
    },
];
export let taskModeData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual' : true,
        'Children': [
             { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40' },
             { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
             'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
             { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
        ]
    }];
export let splitTasksData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '60',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 2 },
                            { StartDate: new Date('02/05/2019'), Duration: 5 },
                            { StartDate: new Date('02/08/2019'), Duration: 3 }
                        ]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '90'
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '75',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 4 },
                            { StartDate: new Date('02/08/2019'), Duration: 2 }
                        ]
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                        Duration: 0, Predecessor: '3FS,5FS'
                    },
                ]
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/25/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '60', Predecessor: '6FS'
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '100', Predecessor: '6FS',
                        Segments: [
                            { StartDate: new Date('02/25/2019'), Duration: 2 },
                            { StartDate: new Date('02/28/2019'), Duration: 3 }
                        ]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                        EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                        Duration: 0, Predecessor: '10FS'
                    }
                ]
            }
        ]
    }
];
export let splitTasksData2: object[] = [
    {
        id: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                id: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        id: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '60',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 2 },
                            { StartDate: new Date('02/05/2019'), Duration: 5 },
                            { StartDate: new Date('02/08/2019'), Duration: 3 }
                        ]
                    },
                    {
                        id: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '90'
                    },
                    {
                        id: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '75',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 4 },
                            { StartDate: new Date('02/08/2019'), Duration: 2 }
                        ]
                    },
                    {
                        id: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                        Duration: 0, Predecessor: '3FS,5FS'
                    },
                ]
            },
            {
                id: 7,
                TaskName: 'Design',
                StartDate: new Date('02/25/2019'),
                subtasks: [
                    {
                        id: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '60', Predecessor: '6FS'
                    },
                    {
                        id: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '100', Predecessor: '6FS',
                        Segments: [
                            { StartDate: new Date('02/25/2019'), Duration: 2 },
                            { StartDate: new Date('02/28/2019'), Duration: 3 }
                        ]
                    },
                    {
                        id: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                        EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                    },
                    {
                        id: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                        Duration: 0, Predecessor: '10FS'
                    }
                ]
            }
        ]
    }
];
export let stringTaskId: object[] = [
    {
        TaskID: "a1",
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: "b2", TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: "c3", TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            { TaskID: "d4", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "b2" ,Progress: 30},
        ]
    },
    { TaskID: "e5", TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "c3,d4" },
    {
        TaskID: "f6",
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: "g7",
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: "h8", TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "e5 SS",Progress: 30 },
                    { TaskID: "i9", TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "e5 FF" }
                ]
            },
            { TaskID: "j10", TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "g7,h8" ,Progress: 30},
        ]
    },
];
export let StringResourceData = [
    {
        TaskID: "1a",
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: "2b", TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: "a", resourceUnit: 50 }]
            },
            {
                TaskID: "3c", TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: "b", resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: "4d", TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: "a", resourceUnit: 75 }], Predecessor: "2b", Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: "5d",
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: "6d", TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: "b", resourceUnit: 70 }], Predecessor: '3c FS+2', work: 30
            },
        ]
    },
];
export let StringResourceCollection = [
    { resourceId: "a", resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
    { resourceId: "b", resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
];
export let StringMultiTaskbarData: Object[] = [
    {
        TaskID: "a1",
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: "b2", TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: "a1", resourceUnit: 50 }]
            },
            {
                TaskID: "c3", TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                resources: [{ resourceId: "a1", resourceUnit: 70 }], Predecessor: "b2", Progress: 30, work: 20
            },
            {
                TaskID: "d4", TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                resources: [{ resourceId: "a1", resourceUnit: 25 }], Predecessor: "c3", Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: "e5",
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: "f6", TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
                Duration: 5, Progress: 30, resources: [{ resourceId: "b2", resourceUnit: 50 }], work: 30
            },
            {
                TaskID: "g7", TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
                resources: [{ resourceId: "b2", resourceUnit: 40 }], Predecessor: 'f6 FS-2', Progress: 30, work: 40
            },
            {
                TaskID: "h8", TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
                Duration: 4, resources: [{ resourceId: "b2", resourceUnit: 75 }], Predecessor: 'g7 FS-1', Progress: 30, work: 60,
            }
        ]
    },
];
export let StringMultiResources = [
    { resourceId: "a1", resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
    { resourceId: "b2", resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true },
];
export let StringResourceSelefReferenceData = [
    {
        TaskID: "a1",
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        resources: [{ resourceId: "a1", resourceUnit: 50 }]
    },
    {
        TaskID: "b2", parentId: "a1", TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
        Progress: 30, work: 10, resources: [{ resourceId: "b2", resourceUnit: 50 }]
    },
    {
        TaskID: "c3", parentId: "a1", TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
        resources: [{ resourceId: "b2", resourceUnit: 70 }], Predecessor: "b2", Progress: 30, work: 20
    },
    {
        TaskID: "d4", parentId: "a1", TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
        resources: [{ resourceId: "b2", resourceUnit: 25 }], Predecessor: "c3", Progress: 30, work: 10,
    },
    {
        TaskID: "e5",
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        resources: [{ resourceId: "b2", resourceUnit: 40 }],
    },
    {
        TaskID: "f6", parentId: "e5", TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
        Duration: 5, Progress: 30, resources: [{ resourceId: "b2", resourceUnit: 50 }], work: 30
    },
    {
        TaskID: "g7", parentId: "e5", TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
        resources: [{ resourceId: "b2", resourceUnit: 40 }], Predecessor: 'f6 FS-2', Progress: 30, work: 40
    },
    {
        TaskID: "h8", parentId: "e5", TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
        Duration: 4, resources: [{ resourceId: "b2", resourceUnit: 75 }], Predecessor: 'g7 FS-1', Progress: 30, work: 60,
    }

];
export let StringCellEditData: object[] = [
    {
        TaskID: "a1",
        TaskName: 'Parent Task',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: "b2", TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 1',
              BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), EstimatedWork: 40.45 }, 
            { TaskID: "c3", TaskName: 'Child Task 2', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: ["c3", "a1"], EstimatedWork: 20 },
            { TaskID: "d4", TaskName: 'Milestone Task', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "b2", Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: ["d4"], EstimatedWork: 80  },
        ]
    },
    { TaskID: "e5", TaskName: 'Unscheduled Start Task', StartDate: new Date('04/02/2019'), Notes: 'Notes 4',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: ["c3"]  },
    { TaskID: "f6", TaskName: 'Unscheduled End Task', EndDate: new Date('04/02/2019'), Notes: 'Notes 5',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), EstimatedWork: 55  },
    { TaskID: "g7", TaskName: 'Unscheduled Duration Task', Duration: 5, Notes: 'Notes 6',
    BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: ["b2"]  },
];
export let StringResourcesData: Object[] = [
    { resourceId: "a1", resourceName: 'Resource 1' },
    { resourceId: "b2", resourceName: 'Resource 2' },
    { resourceId: "c3", resourceName: 'Resource 3' },
    { resourceId: "d4", resourceName: 'Resource 4' },
];
export let StringprojectData1: Object[] = [
    {
        TaskID: "a1",
        TaskName: 'Project Schedule',
        StartDate: new Date('02/06/2017'),
        EndDate: new Date('03/13/2017'),
        subtasks: [
            {
                TaskID: "b2",
                TaskName: 'Planning',
                StartDate: new Date('02/06/2017'),
                EndDate: new Date('02/10/2017'),
                subtasks: [
                    {
                        TaskID: "c3", TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: "d4", TaskName: 'Plan budget', StartDate: new Date('02/04/2017 05:00:00 AM'), EndDate: new Date('02/10/2017'),
                        Duration: 2, Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: "e5", TaskName: 'Allocate resources', StartDate: new Date('02/06/2017'), EndDate: new Date('02/13/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1], milestone: true
                    },
                    {
                        TaskID: "f6", TaskName: 'Planning complete', StartDate: new Date('02/10/2017'), EndDate: new Date('02/10/2017'),
                        Duration: 0, Predecessor: 'c3 FS,d4 FS,e5 FS'
                    },
                ]
                
            },
            {
                TaskID: "g7",
                TaskName: 'Design',
                StartDate: new Date('02/13/2017'),
                EndDate: new Date('02/17/2017'),
                subtasks: [
                    {
                        TaskID: "h8", TaskName: 'Software Specification', StartDate: new Date('02/13/2017'),
                        EndDate: new Date('02/15/2017 18:00:00 PM'),
                        Duration: 3, Progress: '60', Predecessor: 'f6 FS', ResourceId: [2]
                    },
                    {
                        TaskID: "i9", TaskName: 'Develop prototype', StartDate: new Date('02/13/2017'), EndDate: new Date('02/15/2017'),
                        Duration: '3 days', Progress: '100', Predecessor: 'f6 FS', ResourceId: [3]
                    },
                    {
                        TaskID: "j10", TaskName: 'Get approval from customer', StartDate: new Date('02/16/2017'), milestone: true,
                        EndDate: new Date('02/17/2017'), Duration: 2, Progress: '100', Predecessor: 'i9 FS', ResourceId: [1]
                    },
                    {
                        TaskID: "k11", TaskName: 'Design complete', StartDate: new Date('02/17/2017'),
                        EndDate: new Date('02/17/2017'), Duration: 0, Predecessor: 'j10 FS'
                    }
                ]
            },
        ]
    }
            
];
export let StringProjectResources: Object[] = [
    { ResourceId: "a1", ResourceName: 'Project Manager' },
    { ResourceId: "b2", ResourceName: 'Software Analyst' },
    { ResourceId: "c3", ResourceName: 'Developer' },
    { ResourceId: "d4", ResourceName: 'Testing Engineer' }
];

export let resourceAdd: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
                Duration: 5, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 50 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 40 }], Predecessor: '6FS-2', Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
                Duration: 4, resources: [{ resourceId: 2, resourceUnit: 75 }], Predecessor: '7FS-1', Progress: 30, work: 60,
            }
        ]
    },
    {
        TaskID: 9,
        TaskName: 'Site work',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 10, TaskName: 'Install temporary power service', StartDate: new Date('04/01/2019'), Duration: 14,
                Progress: 30, resources: [{ resourceId: 3, resourceUnit: 75 }]
            },
            {
                TaskID: 11, TaskName: 'Clear the building site', StartDate: new Date('04/08/2019'),
                Duration: 9, Progress: 30, Predecessor: '10FS-9', resources: [3]
            },
            {
                TaskID: 12, TaskName: 'Sign contract', StartDate: new Date('04/12/2019'),
                Duration: 5, resources: [3], Predecessor: '11FS-5'
            },
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Foundation',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 14, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 2, Progress: 30, resources: [4]
            },
            {
                TaskID: 15, TaskName: 'Dig footer', StartDate: new Date('04/04/2019'),
                Duration: 2, Predecessor: '14FS + 1', resources: [4]
            },
            {
                TaskID: 16, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 2,
                Progress: 30, Predecessor: 15, resources: [4]
            }
        ]
    },
];

export let resourcesAdded: object[] = [
    { resourceId: 1, resourceName: 'R1', resourceGroup: 'Planning Team', isExpand: false },
    { resourceId: 2, resourceName: 'R2', resourceGroup: 'Testing Team', isExpand: true },
    { resourceId: 3, resourceName: 'R3', resourceGroup: 'Approval Team', isExpand: false },
    { resourceId: 4, resourceName: 'R4', resourceGroup: 'Development Team', isExpand: false },
    { resourceId: 5, resourceName: 'R5', resourceGroup: 'Approval Team', isExpand: true }
];
export let image: string = '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';
export let adventProFont: string =
  'AAEAAAARAQAABAAQRFNJRwAAAAEAALa8AAAACEZGVE1fekHUAACnZAAAABxHREVGACgBwQAAp4AAAAAoR1BPU0UutbcAAKeoAAAO8EdTVUK49LjmAAC2mAAAACRPUy8yegjc7gAAAZgAAABgY21hcP/iHw8AAAhoAAADdmdhc3AAAAAQAACnXAAAAAhnbHlm1UxHIQAADyQAAIfEaGVhZPyoXpQAAAEcAAAANmhoZWEK6QfqAAABVAAAACRobXR4CMZdfQAAAfgAAAZwbG9jYWAAPVIAAAvoAAADOm1heHAB5QBRAAABeAAAACBuYW1lvYEfIwAAlugAAAbGcG9zdL7lSo8AAJ2wAAAJqXByZXBoBoyFAAAL4AAAAAcAAQAAAAIAg2XnRcRfDzz1AAsD6AAAAADK+KMLAAAAAMttdz//xP8lB14DvQAAAAgAAgAAAAAAAAABAAADxP8YAAAHfP/E/7kHXgABAAAAAAAAAAAAAAAAAAABnAABAAABnABOAAcAAAAAAAIAAAABAAEAAABAAAAAAAAAAAIBggEsAAUAAAKKAlgAAABLAooCWAAAAV4AMgD6AAACAAUGBAAAAgAEgAAArxAAIEoAAAAAAAAAAEFEQkUAAAAg+wQDxP8YAAADwgDoAAAAmwAAAAAB9QK8AAAAIAACAfQAAAHKAAABTQAAARYAAADWAE4BqgBzAmUAIgIcACICngAmAiIAIwCqAC4BFgBOARYATgFgABoBgQAiAKUAEQGaAC0AewARAaYAGgIlAD8A0gAaAZMAGgG6ABoB6gAaAboAGgHdABoBvgAaAdoAGgHdABoAawAaAJQAGgFpABoBdAAaAWkAGgGXABoCxwAaAg8ADAIiAE4BsgBCAkAATgHRAE4BvwBOAhkAQQJMAE4AxAAdALL//gHcAE8BuABOArYATgKKAE4CJQA/AiMATgIlAD8CNABOAjEAJQGSAAACNgBKAk8ATgMpAE4CSwAtAiwAPAImAB8BPwBOAeMATgE/AE4BkwBOAgIATADeAC4BygAlAeIATgF/ACQB2wBHAbIAIwEoAE4BwAAlAe0AQADVAE4Awv/6AbMAQwDLAE4C4QBOAfQAQAHHAC8B6gBOAcAAJQFNAD0BrwAkAPMALAG/ACQBqgASAr4AEgHhADoB3gAlAeAATgE0AE4AywBOATQATgICAE4A1gBOAbMATgHZAE4B0ABOAjAANQJMAE4A3gAEAyAAGQF+AE4B8gAqAZoALQMgABkBTgBOAZEATgG1AE4A3gAuAd0AJQKfAE4BmgBMAgIABAHUAE8CDwAMAg8ADAIPAAwCDwAMAg8ADAIPAAwDLgBOAbIAQgHRAE4B0QBOAdEATgHRAE4BGABTAVgATgHAAE4BFABOAoAATgKKAE4CJQA/AiUAPwIlAD8CJQA/AiUAPwGGAE4CFQBOAjYASgI2AEoCNgBKAjYASgIsADwB6gBOAgAATgHyAE4B8gBOAfIATgHyAE4B8gBOAfIATgMuAE4BfwAkAdkATgHZAE4B4gBOAcIAIwDnAE4A4wBRAJ//xACO/98B4gBOAeYATgHmAE4B5gBOAeYATgHmAE4BsABOAe8ATgHmAE4B5gBOAeYATgHmAE4CCABOAeoATgIIAE4CDwAMAfIATgIPAAwB8gBOApYATgH2ACUBsgBCAbMATgGyAEIB0wBOAbIAQgGzAE4BsgBCAbQATgJAAE4CYABOAkAATgIfAE4B0QBOAcIAIwHRAE4B2QBOAfsATgGyACMB0QBOAdkATgIZAEEB6wBOAhkAQQHqAE4CNgBKAeoATgIZAEEB6gBOAkwATgJDAB8CrQBOAiAATgHoAE4BuwBOAXYATgFKAE4BWwBOAQn/+gEYAE4AgQApAQT//gGTAE4B3ABPAb4AQwHiAE4BuABOARIAUQG4AE4A/wBOAb//3gDN/9oCVQBOAaYATgKKAE4B4gBOAooATgH0AEACigBOAeIATgKLAE4B9QBAAiUAPwHmAE4CJQA/AeYATgM2AE4DFwBOAjQATgFrAE4CNABOAVsAPQI0AE4BkwBOAjEAJQG8ADECMQAlAdkATgGvACQCMQAlAdkATgGSAAABCwAsAZIAAAFu/+sBkgAAAWcATgI2AEoB5gBOAjYASgHmAE4CNgBKAeYATgI2AEoB5gBOAjYASgHmAE4CNgBKAeIAJAIsADwCJgAfAeAATgImAB8B4ABOAiYAHwHgAE4CMQAlAa8AJAGTAC4BiwAuAVMALgA/AAQByv/+AX8ATAG7AE4Bxf/+AUYATgJqAE4CZgBOAsgATgGCAE4CigBOAs8ATgLRAE4A+wAPAhsADAIiAE4BvwBOAhEADAG/AE4CWABOAkAAUAIVAE4BKwBQAf4ATgIVAAwCtwBQ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ACAATgBhAG0AZQAgACIAQQBkAHYAZQBuAHQAIABQAHIAbwAiAEEAZAB2AGUAbgB0ACAAUAByAG8ATABpAGcAaAB0AEEAbgBkAHIAZQBhAHMASwBhAGwAcABhAGsAaQBkAGkAcwA6ACAAQQBkAHYAZQBuAHQAIABQAHIAbwAgAEwAaQBnAGgAdAA6ACAAMgAwADAAOABBAGQAdgBlAG4AdAAgAFAAcgBvACAATABpAGcAaAB0AFYAZQByAHMAaQBvAG4AIAAyAC4AMAAwADMAQQBkAHYAZQBuAHQAUAByAG8ALQBMAGkAZwBoAHQAQQBkAHYAZQBuAHQAIABQAHIAbwAgAFQAaABpAG4AIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABJAE4ARABFACAAQQBuAGQAcgBlAGEAcwAgAEsAYQBsAHAAYQBrAGkAZABpAHMALgBBAG4AZAByAGUAYQBzACAASwBhAGwAcABhAGsAaQBkAGkAcwB3AHcAdwAuAGkAbgBkAGUAcgBlAHMAdABpAG4AZwAuAGMAbwBtAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAbABpAGMAZQBuAHMAZQBkACAAdQBuAGQAZQByACAAdABoAGUAIABTAEkATAAgAE8AcABlAG4AIABGAG8AbgB0ACAATABpAGMAZQBuAHMAZQAsACAAVgBlAHIAcwBpAG8AbgAgADEALgAxAC4AIABUAGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGkAcwAgAGEAdgBhAGkAbABhAGIAbABlACAAdwBpAHQAaAAgAGEAIABGAEEAUQAgAGEAdAA6ACAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAGgAdAB0AHAAOgAvAC8AcwBjAHIAaQBwAHQAcwAuAHMAaQBsAC4AbwByAGcALwBPAEYATAAAAAIAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAABnAAAAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAowCEAIUAvQCWAIYAjgCLAJ0AqQECAIoA2gCDAJMAjQCXAIgA3gCqAKIArQDJAMcArgBiAGMAkABkAMsAZQDIAMoAzwDMAM0AzgDpAGYA0wDQANEArwBnAPAAkQDWANQA1QBoAOsA7QCJAGoAaQBrAG0AbABuAKAAbwBxAHAAcgBzAHUAdAB2AHcAeAB6AHkAewB9AHwAuAChAH8AfgCAAIEA7ADuALoBAwEEAQUBBgEHAQgA/QD+AQkBCgELAQwA/wEAAQ0BDgEPAQEBEAERARIBEwEUARUBFgEXARgBGQD4APkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnAPoA1wEoASkBKgErASwBLQEuAS8BMAExATIA4gDjATMBNAE1ATYBNwE4ATkBOgE7ATwBPQE+ALAAsQE/AUABQQFCAUMBRAFFAUYBRwFIAPwA5ADlAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaALsBWwFcAV0BXgDmAOcBXwFgANgA4QDbANwA3QDgANkA3wFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgCbAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAC2ALcAxAC0ALUAxQCHAKsAxgC+AL8AvAGlAIwAnwCoAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9B3VuaTAwQUQHQW1hY3JvbgdhbWFjcm9uBkFicmV2ZQZhYnJldmUHQW9nb25lawdhb2dvbmVrC0NjaXJjdW1mbGV4C2NjaXJjdW1mbGV4CkNkb3RhY2NlbnQKY2RvdGFjY2VudAZEY2Fyb24GZGNhcm9uBkRjcm9hdAdFbWFjcm9uB2VtYWNyb24KRWRvdGFjY2VudAplZG90YWNjZW50B0VvZ29uZWsHZW9nb25lawZFY2Fyb24GZWNhcm9uC0djaXJjdW1mbGV4C2djaXJjdW1mbGV4Ckdkb3RhY2NlbnQKZ2RvdGFjY2VudAxHY29tbWFhY2NlbnQMZ2NvbW1hYWNjZW50C0hjaXJjdW1mbGV4C2hjaXJjdW1mbGV4BEhiYXIEaGJhcgZJdGlsZGUGaXRpbGRlB0ltYWNyb24HaW1hY3JvbgdJb2dvbmVrB2lvZ29uZWsLSmNpcmN1bWZsZXgLamNpcmN1bWZsZXgMS2NvbW1hYWNjZW50DGtjb21tYWFjY2VudAxrZ3JlZW5sYW5kaWMGTGFjdXRlBmxhY3V0ZQxMY29tbWFhY2NlbnQMbGNvbW1hYWNjZW50BkxjYXJvbgZsY2Fyb24GTmFjdXRlBm5hY3V0ZQxOY29tbWFhY2NlbnQMbmNvbW1hYWNjZW50Bk5jYXJvbgZuY2Fyb24DRW5nA2VuZwdPbWFjcm9uB29tYWNyb24NT2h1bmdhcnVtbGF1dA1vaHVuZ2FydW1sYXV0BlJhY3V0ZQZyYWN1dGUMUmNvbW1hYWNjZW50DHJjb21tYWFjY2VudAZSY2Fyb24GcmNhcm9uBlNhY3V0ZQZzYWN1dGULU2NpcmN1bWZsZXgLc2NpcmN1bWZsZXgMVGNvbW1hYWNjZW50DHRjb21tYWFjY2VudAZUY2Fyb24GdGNhcm9uBFRiYXIEdGJhcgZVdGlsZGUGdXRpbGRlB1VtYWNyb24HdW1hY3JvbgZVYnJldmUGdWJyZXZlBVVyaW5nBXVyaW5nDVVodW5nYXJ1bWxhdXQNdWh1bmdhcnVtbGF1dAdVb2dvbmVrB3VvZ29uZWsGWmFjdXRlBnphY3V0ZQpaZG90YWNjZW50Cnpkb3RhY2NlbnQMU2NvbW1hYWNjZW50DHNjb21tYWFjY2VudA1kaWVyZXNpc3Rvbm9zCkFscGhhdG9ub3MMRXBzaWxvbnRvbm9zCEV0YXRvbm9zCUlvdGF0b25vcwxPbWljcm9udG9ub3MMVXBzaWxvbnRvbm9zCk9tZWdhdG9ub3MRaW90YWRpZXJlc2lzdG9ub3MFQWxwaGEEQmV0YQVHYW1tYQd1bmkwMzk0B0Vwc2lsb24EWmV0YQNFdGEFVGhldGEESW90YQVLYXBwYQZMYW1iZGECTXUCTnUCWGkHT21pY3JvbgJQaQNSaG8FU2ln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';

var indicatorImage = "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";

export let GanttData1: Object[]  = [
    {
        TaskID: 1,
        TaskName: 'Project Initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        Indicators: [
      
            {
                'date': '04/11/2019',
                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                'name': 'Indicator title',
                'base64':indicatorImage,
            }
        ],
        subtasks: [
            { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 90 },
            { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 40  },
            { TaskID: 4, Predecessor: '3FS', TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 10 },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project Estimation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/10/2019'),
        Indicators: [
      
            {
                'date': '04/13/2019',
                'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                'name': 'Indicator title',
                'base64':indicatorImage,
            }
        ],
        subtasks: [
            { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 85 },
            { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 15 },
            { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70 }
        ]
    },
];

export let exportData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12,Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9 ,Progress: 30},
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 }
        ]
    }
];

export let projectNewData: Object[] = [
    { TaskID: 1, TaskName: 'Project Initiation_1', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
    { TaskID: 2, TaskName: 'Identify Site location_1', StartDate: new Date('03/29/2019'), Duration: 6, Progress: 70, ParentId: 1 },
    { TaskID: 3, TaskName: 'Perform Soil test_1', StartDate: new Date('04/02/2019'), Duration: 7, Progress: 70, ParentId: 1 },
    { TaskID: 4, TaskName: 'Soil test approval_1', StartDate: new Date('04/02/2019'), Duration: 8, Progress: 70, Predecessor: '2', ParentId: 1 },
    { TaskID: 5, TaskName: 'Project Estimation_1', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
    { TaskID: 6, TaskName: 'Develop floor plan for estimation_1', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 70, ParentId: 5 },
    { TaskID: 7, TaskName: 'List materials_1', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70, ParentId: 5 },
    { TaskID: 8, TaskName: 'Estimation approval_1', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70, ParentId: 5 }
];
export let indentData: Object[] = [{
    TaskID: 1,
    TaskName: 'Product Concept',
    StartDate: new Date('04/02/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        {
            TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ]
        },
        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
    ]
}]
export let connectorLineFSDatasource: Object[] = [
    {
        'TaskId': 1, 'TaskName': 'FS',
        'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 2, 'TaskName': 'FS',
        'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 3, 'TaskName': 'FS',
        'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 4, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7'
    },
    {
        'TaskId': 5, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7+3'
    },
    {
        'TaskId': 6, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7-3'
    },
    {
        'TaskId': 7, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1,2,3-3,8,9,10-3'
    },
    {
        'TaskId': 8, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/23/2017'), 'Progress': 65
    },
    {
        'TaskId': 9, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/18/2017'), 'Progress': 65
    },
    {
        'TaskId': 10, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/26/2017'), 'Progress': 65
    },
    {
        'TaskId': 11, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7'
    },
    {
        'TaskId': 12, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7+3'
    },
    {
        'TaskId': 13, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7-3'
    },
    {
        'TaskId': 14, 'TaskName': 'FS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '23,16'
    }
];
export let connectorLineSSDatasource: Object[] = [
    {
        'TaskId': 1, 'TaskName': 'SS',
        'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 2, 'TaskName': 'SS',
        'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 3, 'TaskName': 'SS',
        'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 4, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS'
    },
    {
        'TaskId': 5, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS+3'
    },
    {
        'TaskId': 6, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS-3'
    },
    {
        'TaskId': 7, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS,2SS,3SS-3,8SS,9SS,10SS-3'
    },
    {
        'TaskId': 8, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/23/2017'), 'Progress': 65
    },
    {
        'TaskId': 9, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/18/2017'), 'Progress': 65
    },
    {
        'TaskId': 10, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/26/2017'), 'Progress': 65
    },
    {
        'TaskId': 11, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS'
    },
    {
        'TaskId': 12, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS+3'
    },
    {
        'TaskId': 13, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS-3'
    },
    {
        'TaskId': 14, 'TaskName': 'SS', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '14'
    }
];
export let connectorLineFFDatasource: Object[] = [
    {
        'TaskId': 1, 'TaskName': 'FF',
        'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 2, 'TaskName': 'FF',
        'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 3, 'TaskName': 'FF',
        'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 4, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF'
    },
    {
        'TaskId': 5, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF+3'
    },
    {
        'TaskId': 6, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF-3'
    },
    {
        'TaskId': 7, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1FF,2FF,3FF-3,8FF,9FF,10FF-3'
    },
    {
        'TaskId': 8, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/23/2017'), 'Progress': 65
    },
    {
        'TaskId': 9, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/18/2017'), 'Progress': 65
    },
    {
        'TaskId': 10, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/26/2017'), 'Progress': 65
    },
    {
        'TaskId': 11, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF'
    },
    {
        'TaskId': 12, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF+3'
    },
    {
        'TaskId': 13, 'TaskName': 'FF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF-3'
    },
    {
        'TaskId': 14, 'TaskName': 'FF', 'Predecessor': '7FF'
    }
];
export let connectorLineSFDatasource: Object[] = [
    {
        'TaskId': 1, 'TaskName': 'SF',
        'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 2, 'TaskName': 'SF',
        'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 3, 'TaskName': 'SF',
        'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
    },
    {
        'TaskId': 4, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF'
    },
    {
        'TaskId': 5, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF+3'
    },
    {
        'TaskId': 6, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF-3'
    },
    {
        'TaskId': 7, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SF,2SF,3SF-3,8SF,9SF,10SF-3'
    },
    {
        'TaskId': 8, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/23/2017'), 'Progress': 65
    },
    {
        'TaskId': 9, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/18/2017'), 'Progress': 65
    },
    {
        'TaskId': 10, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/26/2017'), 'Progress': 65
    },
    {
        'TaskId': 11, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF'
    },
    {
        'TaskId': 12, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF+3'
    },
    {
        'TaskId': 13, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF-3'
    },
    {
        'TaskId': 14, 'TaskName': 'SF', 'Duration': 1,
        'StartDate': new Date('10/25/2017'), 'Progress': 65
    }
];
export let predecessorData: Object[] = [
    {
        TaskId: 1,
        TaskName: "Planning",
        StartDate: new Date("10/06/2017"),
        EndDate: new Date("10/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskId: 2, TaskName: "Allocate resources 1",
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 3, TaskName: "Allocate resources 2", Predecessor: '2FS',
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 4, TaskName: "Allocate resources 3", Predecessor: '2FS,9FS',
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 5, TaskName: "Allocate resources 4", Predecessor: '2FS',
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            }
        ]
    }, {
        TaskId: 6,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskId: 7, TaskName: "Allocate resources 1",
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 8, TaskName: "Allocate resources 2", Predecessor: '4FS',
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 9, TaskName: "Allocate resources 3", Predecessor: '2FS',
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskId: 10, TaskName: "Allocate resources 4",
                EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            }
        ]
    }];
export  let projectNewData1: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        }
    ];
export let editingData1 : Object[]  = [
    {
        TaskID: 24,
        TaskName: '[OPERATOR CRISTIAN] OEM Cristian PROYECTO CRISTIAN 2 SW_NOSW',
        StartDate: '2024-02-09T05:00:00.000Z',
        Progress: 0,
        Duration: 1,
        subtasks: [
            {
                TaskID: 33,
                TaskName: 'Homologation_Process',
                StartDate: '2024-02-09T05:00:00.000Z',
                Duration: 1,
                Progress: 0,
                subtasks: [
                    {
                        TaskID: 113,
                        TaskName: 'Actividad 2',
                        StartDate: '2024-02-09T05:00:00.000Z',
                        Duration: 3,
                        Predecessor: '',
                        Progress: 0
                    },
                    {
                        TaskID: 114,
                        TaskName: 'Actividad 3',
                        StartDate: '2024-02-12T05:00:00.000Z',
                        Duration: 1,
                        Predecessor: '113FS',
                        Progress: 0,
                        subtasks: [
                            {
                                TaskID: 104,
                                TaskName: 'Test Case 4',
                                StartDate: '2024-02-12T05:00:00.000Z',
                                Duration: 1,
                                Progress: 0,
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
export let crValidateIssue: any[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, 
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12,Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9 ,Progress: 30},
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 }
        ]
    }
];
export let data5: Object[] =[{
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('03/29/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
        },
        {
            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
        },
        {
            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
        },
    ]
}];
export let data6: Object[]  = [{
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('03/29/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
        },
        {
            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
        },
        {
            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
        },
    ]
}];

export let data7: Object[] = [{
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('03/29/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
        },
        {
            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
        },
        {
            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 1, resourceUnit: 75 }], Progress: 30, work: 10,
        },
    ]
}];

export let criticalPathData: Object[] = [
    {
        taskID: 7,
        taskName: "Design",
        startDate: new Date("02/10/2017"),
        endDate: new Date("02/18/2017"),
        subtasks: [
            { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
            {
                taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                subtasks: [
                    { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                ]
            },
            { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30SF", resourceInfo: [1] },
            { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FF" },
            { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10SS" }
        ]
    }
];
export let taskModeData1: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40'
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40',
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/05/2017'),
        'EndDate': new Date('03/09/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40'
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40', 'Predecessor': '8FS'
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true, 'Predecessor': '9FF'
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true
            }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
            {
                'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40'
            },
            {
                'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '11SF'
            },
            {
                'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40',
            },
            {
                'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '13SS'
            },
            {
                'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40'
            }
        ]
    }
];
export let taskModeData2: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40'
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40',
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/05/2017'),
        'EndDate': new Date('03/09/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40'
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40', 'Predecessor': '8FS'
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true, 'Predecessor': '9FF'
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true
            }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
            {
                'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40'
            },
            {
                'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '11SF'
            },
            {
                'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40',
            },
            {
                'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40', 'Predecessor': '13SS'
            },
            {
                'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
                'EndDate': new Date('03/17/2017'), 'Progress': '40'
            }
        ]
    }
];
export let bwData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'New Task 1',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 59,
        Duration: 1,
    },
    {
        TaskID: 2,
        TaskName: 'New Task 2',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 45,
        Duration: 1,
        Predecessor: '1FS',
    },
];
export let criticalPathData1: Object[] = [
    {
        taskID: 7,
        taskName: "Design",
        startDate: new Date("02/10/2017"),
        endDate: new Date("02/18/2017"),
        subtasks: [
            { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
            {
                taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                subtasks: [
                    { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                ]
            },
            { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30FF", resourceInfo: [1] },
            { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3 },
            { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" }
        ]
    }
];
export  let criticalPathData2: Object[] = [
    {
        taskID: 7,
        taskName: "Design",
        startDate: new Date("02/10/2017"),
        endDate: new Date("02/18/2017"),
        subtasks: [
            { taskID: 8, taskName: "Software Specification", startDate: new Date("02/11/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "60", resourceInfo: [2] },
            {
                taskID: 9, taskName: "Develop prototype", startDate: new Date("02/10/2017"), endDate: new Date("02/12/2017"), duration: 3, progress: "40", resourceInfo: [3],
                subtasks: [
                    { taskID: 30, taskName: "Plan timeline", startDate: new Date("02/06/2017"), endDate: new Date("02/20/2017"), duration: 5, progress: "80", resourceInfo: [1] }
                ]
            },
            { taskID: 10, taskName: "Get approval from customer", startDate: new Date("02/15/2017"), endDate: new Date("02/18/2017"), duration: 5, progress: "50", predecessor: "30FF", resourceInfo: [1] },
            { taskID: 11, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3 },
            { taskID: 12, taskName: "Design complete", startDate: new Date("02/18/2017"), endDate: new Date("02/21/2017"), duration: 3, predecessor: "10FS" }
        ]
    }
];
export  let bwData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'New Task 1',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 59,
        Duration: 1,
    },
    {
        TaskID: 2,
        TaskName: 'New Task 2',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 45,
        Duration: 1,
        Predecessor: '1FS',
    },
];

export let bwData2: Object[] = [
    {
        TaskID: 1,
        TaskName: 'New Task 1',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 59,
        Duration: 1,
    },
    {
        TaskID: 2,
        TaskName: 'New Task 2',
        StartDate: new Date('05/22/2023'),
        EndDate: new Date('05/22/2023'),
        BaselineStartDate: new Date('05/22/2023'),
        BaselineEndDate: new Date('05/22/2023'),
        Progress: 45,
        Duration: 1,
        Predecessor: '1FS',
    },
];

export  let bwData3: Object[] = [
    {
        TaskID: 1,
        TaskName: 'New Task 1',
        StartDate: new Date('07/11/2023'),
        EndDate: new Date('07/11/2023'),
        Progress: 59,
        Duration: 1,
        Predecessor: '2FS',
    },
    {
        TaskID: 2,
        TaskName: 'New Task 2',
        StartDate: new Date('07/10/2023'),
        EndDate: new Date('07/10/2023'),
        Progress: 45,
        Duration: 1,
    },
    {
        TaskID: 3,
        TaskName: 'New Task 1',
        StartDate: new Date('07/12/2023'),
        EndDate: new Date('07/12/2023'),
        Progress: 59,
        Duration: 1,
        Predecessor: '1FS',
    },
    {
        TaskID: 4,
        TaskName: 'New Task 2',
        StartDate: new Date('07/13/2023'),
        EndDate: new Date('07/13/2023'),
        Progress: 45,
        Duration: 1,
        Predecessor: '3FS',
    },
];

export let bwData4: Object[] = [
    {
        TaskID: 1,
        TaskName: 'New Task 1',
        StartDate: new Date('07/11/2023'),
        EndDate: new Date('07/11/2023'),
        Progress: 59,
        Duration: 1,
        Predecessor: '2FS',
    },
    {
        TaskID: 2,
        TaskName: 'New Task 2',
        StartDate: new Date('07/10/2023'),
        EndDate: new Date('07/10/2023'),
        Progress: 45,
        Duration: 1,
    },
    {
        TaskID: 3,
        TaskName: 'New Task 1',
        StartDate: new Date('07/12/2023'),
        EndDate: new Date('07/12/2023'),
        Progress: 59,
        Duration: 1,
        Predecessor: '1FS',
    },
    {
        TaskID: 4,
        TaskName: 'New Task 2',
        StartDate: new Date('07/13/2023'),
        EndDate: new Date('07/13/2023'),
        Progress: 45,
        Duration: 1,
        Predecessor: '3FS',
    },
];
export let weekenddata: Object[] = [
    { TaskID: 1, TaskName: 'Project Initiation_1', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
    { TaskID: 2, TaskName: 'Identify Site location_1', StartDate: new Date('03/29/2019'), Duration: 6, Progress: 70, ParentId: 1 },
    { TaskID: 3, TaskName: 'Perform Soil test_1', StartDate: new Date('04/02/2019'), Duration: 7, Progress: 70, ParentId: 1 },
    { TaskID: 4, TaskName: 'Soil test approval_1', StartDate: new Date('04/02/2019'), Duration: 8, Progress: 70, Predecessor: '2', ParentId: 1 },
    { TaskID: 5, TaskName: 'Project Estimation_1', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
    { TaskID: 6, TaskName: 'Develop floor plan for estimation_1', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 70, ParentId: 5 },
    { TaskID: 7, TaskName: 'List materials_1', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70, ParentId: 5 },
    { TaskID: 8, TaskName: 'Estimation approval_1', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70, ParentId: 5 }
];
export let projectNewData9 = [
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
        {
          TaskID: 2,
          TaskName: 'Defining the product and its usage',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: false,
        },
        {
          TaskID: 3,
          TaskName: 'Defining target audience',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Milestone: false,
        },
        {
          TaskID: 4,
          TaskName: 'Prepare product sketch and notes',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: true,
        },
      ],
    },       
];
export let projectNewData10 = [
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
        {
          TaskID: 2,
          TaskName: 'Defining the product and its usage',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: false,
        },
        {
          TaskID: 3,
          TaskName: 'Defining target audience',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Milestone: false,
        },
        {
          TaskID: 4,
          TaskName: 'Prepare product sketch and notes',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: true,
        },
      ],
    },       
];
export let projectNewData11 = [
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
        {
          TaskID: 2,
          TaskName: 'Defining the product and its usage',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: false,
        },
        {
          TaskID: 3,
          TaskName: 'Defining target audience',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Milestone: false,
        },
        {
          TaskID: 4,
          TaskName: 'Prepare product sketch and notes',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/02/2019'),
          Progress: 30,
          Milestone: true,
        },
      ],
    },       
];
export let projectNewData12 =  [
    {
        TaskID: 1,
        TaskName: 'Receive vehicle and create job card',
        BaselineStartDate: new Date('03/05/2018 00:00:00 AM'),
        BaselineEndDate: new Date('03/03/2018 00:00:00 AM'),
        Duration: 1,
        StartDate: new Date('03/05/2018 00:00:00 AM'),
        EndDate: new Date('03/10/2018 00:00:00 AM'),
    },
]
export let selfData1 = [
    {
        taskID: 1,
        taskName: 'Project Schedule',
        startDate: new Date('02/04/2019'),
        endDate: new Date('03/10/2019'),
    },
    {
        taskID: 2,
        taskName: 'Planning',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        parentID: 1,
    },
    {
        taskID: 5,
        taskName: 'Allocate resources',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '75',
        parentID: 2,
    },
    {
        taskID: 6,
        taskName: 'Planning complete',
        startDate: new Date('02/06/2019 12:00:00 PM'),
        endDate: new Date('02/06/2019 12:00:00 PM'),
        baselineStart: new Date('02/06/2019 12:00:00 PM'),
        baselineEnd: new Date('02/06/2019 12:00:00 PM'),
        duration: 0,
        predecessor: '3FS,4FS,5FS',
        parentID: 2,
    },
];
export let splitTasksData1 = [
    {
        TaskID: 1,
        TaskName: 'Defining the product and its usage',
        StartDate: new Date('2019-02-04T21:28:41'),
        EndDate: new Date('2019-02-05T21:28:41'),
        Duration: 180,
        Progress: 47,
        Segments: [
            {
                StartDate: new Date('2019-02-04'),
                Duration: 90,
            },
            {
                StartDate: new Date('2019-02-05'),
                Duration: 90,
            },
        ],
    },
];
export let projectNewData13 = [{
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('03/29/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
        },
        {
            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
        },
        {
            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
        },
    ]
}]
export let columnTemplateData: Object[] = [
    {
        TaskID: 1,
        TaskName: "Project Schedule",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("03/10/2017"),
        taskColor: "#F2A4A7",
        progressColor: "#DE605C",
        Children: [
            {
                TaskID: 2,
                TaskName: "Planning",
                StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"),
                taskColor: "#79BDC9",
                progressColor: "#59AAB4",
                Children: [
                    {
                        TaskID: 3, TaskName: "Plan timeline", StartDate: new Date("02/06/2017"),
                        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "60", resourceId: [1]
                    },
                    {
                        TaskID: 4, TaskName: "Plan budget", StartDate: new Date("02/06/2017"),
                        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "90", resourceId: [5]
                    },
                    {
                        TaskID: 5, TaskName: "Allocate resources", StartDate: new Date("02/06/2017"),
                        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                        predObj: [{ 'from': 4, 'to': 5, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        resourceId: [6]
                    },
                    {
                        TaskID: 6, TaskName: "Planning complete", StartDate: new Date("02/06/2017"),
                        EndDate: new Date("02/10/2017"), Duration: 0,
                        predObj: [{ 'from': 3, 'to': 6, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false },
                        { 'from': 4, 'to': 6, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false },
                        { 'from': 5, 'to': 6, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "3FS,4FS,5FS", resourceId: [1]
                    }
                ]
            },
            {
                TaskID: 7,
                TaskName: "Design",
                StartDate: new Date("02/13/2017"),
                EndDate: new Date("02/17/2017"),
                taskColor: "#93b8a6",
                progressColor: "#7AA992",
                Children: [
                    {
                        TaskID: 8, TaskName: "Software Specification", StartDate: new Date("02/13/2017"),
                        EndDate: new Date("02/15/2017"), Duration: 3, Progress: "60",
                        predObj: [{ 'from': 6, 'to': 8, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "6FS", resourceId: [2]
                    },
                    {
                        TaskID: 9, TaskName: "Develop prototype", StartDate: new Date("02/13/2017"),
                        EndDate: new Date("02/15/2017"), Duration: 3, Progress: "100",
                        predObj: [{ 'from': 6, 'to': 9, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "6FS", resourceId: [3]
                    },
                    {
                        TaskID: 10, TaskName: "Get approval from customer", StartDate: new Date("02/16/2017"),
                        EndDate: new Date("02/17/2017"), Duration: 2, Progress: "100",
                        predObj: [{ 'from': 9, 'to': 10, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "9FS", resourceId: [1]
                    },
                    {
                        TaskID: 11, TaskName: "Design complete", StartDate: new Date("02/17/2017"),
                        EndDate: new Date("02/17/2017"), Duration: 0,
                        predObj: [{ 'from': 10, 'to': 11, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "10FS", resourceId: [2]
                    }
                ]
            },
            {
                TaskID: 12,
                TaskName: "Implementation",
                StartDate: new Date("02/20/2017"),
                EndDate: new Date("03/02/2017"),
                taskColor: "#FAC9CD",
                progressColor: "#F2928D",
                Children: [
                    {
                        TaskID: 13, TaskName: "Development Task 1", StartDate: new Date("02/20/2017"),
                        EndDate: new Date("02/22/2017"), Duration: 3, Progress: "50",
                        predObj: [{ 'from': 11, 'to': 13, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "11FS", resourceId: [3]
                    },
                    {
                        TaskID: 14, TaskName: "Development Task 2", StartDate: new Date("02/20/2017"),
                        EndDate: new Date("02/22/2017"), Duration: 3, Progress: "50",
                        predObj: [{ 'from': 11, 'to': 14, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "11FS", resourceId: [3]
                    },
                    {
                        TaskID: 15, TaskName: "Testing", StartDate: new Date("02/23/2017"),
                        EndDate: new Date("02/25/2017"), Duration: 2, Progress: "0",
                        predObj: [{ 'from': 13, 'to': 15, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false },
                        { 'from': 14, 'to': 15, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "13FS,14FS", resourceId: [4]
                    },
                    {
                        TaskID: 16, TaskName: "Bug fix", StartDate: new Date("02/27/2017"),
                        EndDate: new Date("02/28/2017"), Duration: 2, Progress: "0",
                        predObj: [{ 'from': 15, 'to': 16, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "15FS", resourceId: [3]
                    },
                    {
                        TaskID: 17, TaskName: "Customer review meeting", StartDate: new Date("03/01/2017"),
                        EndDate: new Date("03/02/2017"), Duration: 2, Progress: "0",
                        predObj: [{ 'from': 16, 'to': 17, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "16FS", resourceId: [1]
                    },
                    {
                        TaskID: 18, TaskName: "Implemenation complete", StartDate: new Date("03/02/2017"),
                        EndDate: new Date("03/02/2017"), Duration: 0,
                        predObj: [{ 'from': 17, 'to': 18, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                        Predecessor: "17FS", resourceId: [2]
                    }

                ]
            },
            {
                TaskID: 19, TaskName: "Integration", StartDate: new Date("03/03/2017"),
                EndDate: new Date("03/05/2017"), Duration: 2, Progress: "0",
                predObj: [{ 'from': 18, 'to': 19, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                Predecessor: "18FS", resourceId: [3]
            },
            {
                TaskID: 20, TaskName: "Final Testing", StartDate: new Date("03/06/2017"),
                EndDate: new Date("03/07/2017"), Duration: 2, Progress: "0",
                predObj: [{ 'from': 19, 'to': 20, 'predecessorsType': 'FS', 'offset': 1, 'isdrawn': false }],
                Predecessor: "19FS", resourceId: [4]
            },
            {
                TaskID: 21, TaskName: "Final Delivery", StartDate: new Date("03/07/2017"),
                EndDate: new Date("03/07/2017"), Duration: 0,
                predObj: [{ 'from': 20, 'to': 21, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                Predecessor: "20FS", resourceId: [1]
            }
        ]
    }
];
export let predData1: Object[] = [
    {
        TaskID: 1, TaskName: "Plan timeline", StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "60", resourceId: [1]
    },
    {
        TaskID: 2, TaskName: "Plan budget", StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "90", Predecessor: '1SS-2', resourceId: [5]
    },
    {
        TaskID: 3, TaskName: "Allocate resources", StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
        Predecessor: '1SF+1', resourceId: [6]
    },
    {
        TaskID: 4, TaskName: "Planning complete", StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"), Predecessor: '3FF+1', resourceId: [1]
    },
    {
        TaskID: 5, TaskName: "Task complete", StartDate: new Date("02/06/2017"),
        Duration: 0, Progress: "90", Predecessor: '4SS', resourceId: [5]
    }
];
export let predData2: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Plan timeline", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "60", resourceId: [1]
            },
            {
                TaskID: 3, TaskName: "Plan budget", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "90", resourceId: [5]
            },
            {
                TaskID: 4, TaskName: "Allocate resources", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                Predecessor: '1FS', resourceId: [6]
            }]
    }];
export let predData3: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Plan timeline", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "60", resourceId: [1]
            },
            {
                TaskID: 3, TaskName: "Plan budget", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "90", resourceId: [5]
            },
            {
                TaskID: 4, TaskName: "Allocate resources", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                Predecessor: [{ 'from': 1, 'to': 4, 'predecessorsType': 'FS', 'offset': 0, 'isdrawn': false }],
                resourceId: [6]
            }]
    }];
export let predData4: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Plan timeline", StartDate: new Date("02/06/2017"),
                Duration: 6, Progress: "60", resourceId: [1] // without end date
            },
            {
                TaskID: 3, TaskName: "Plan budget", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Progress: "90", Predecessor: '2', resourceId: [5] // without duration
            },
            {
                TaskID: 4, TaskName: "Allocate resources 1",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                Predecessor: '2,3', resourceId: [6] // without start date
            }
        ]
    }];
export let predData5: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Allocate resources 1",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 3, TaskName: "Allocate resources 2",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                Predecessor: '2f', resourceId: [6]
            }
        ]
    }];
export let predData6: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Allocate resources 1",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 3, TaskName: "Allocate resources 2",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75",
                Predecessor: '1011', resourceId: [6]
            },
            {
                TaskID: 7, TaskName: "Allocate resources 3", Progress: "75",
                resourceId: [6] // without start date, end date and duration
            },
        ]
    }];
export let predData7: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Allocate resources 1", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 3, TaskName: "Allocate resources 2", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 4, TaskName: "Allocate resources 3", Progress: "75", StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"), resourceId: [6]
            },
        ]
    }];
export let predData8: Object[] = [
    {
        TaskID: 1,
        TaskName: "Planning",
        StartDate: new Date("02/06/2017"),
        EndDate: new Date("02/10/2017"),
        taskColor: "#79BDC9",
        progressColor: "#59AAB4",
        Children: [
            {
                TaskID: 2, TaskName: "Allocate resources 1",
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 3, TaskName: "Allocate resources 2", Predecessor: '2FS+2.5',
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 4, TaskName: "Allocate resources 3", Predecessor: '2FS+2hour',
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            },
            {
                TaskID: 5, TaskName: "Allocate resources 4", Predecessor: '2FS+2minute',
                EndDate: new Date("02/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
            }
        ]
    }];
export let editingData13: Object[]  = [
        {
            TaskID: 1,
            TaskName: 'Parent 1',
            StartDate: new Date('07/01/2022'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Child 1',
                    StartDate: new Date('07/01/2022'),
                    EndDate: new Date('07/04/2022'),
                }
            ],
        },
        {
            TaskID: 5,
            TaskName: 'Parent 2',
            Predecessor: '1FS',
            subtasks: [
                {
                    TaskID: 6,
                    TaskName: 'Child 1',
                },
            ],
        },
    ];
export  let editingData14: Object[]  = [
        {
            TaskID: 1,
            TaskName: 'Parent 1',
            StartDate: new Date('07/01/2022'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Child 1',
                    StartDate: new Date('07/01/2022'),
                    EndDate: new Date('07/04/2022'),
                }
            ],
        },
        {
            TaskID: 5,
            TaskName: 'Parent 2',
            Predecessor: '1FS',
            subtasks: [
                {
                    TaskID: 6,
                    TaskName: 'Child 1',
                },
            ],
        },
    ];
export let data15: Object[]  = [
        {
          TaskID: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
          TaskName: 'Parent Task 1',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
        },
        {
          TaskID: '78A9F47B-580D-49BB-9DF1-311AF2BA678C',
          TaskName: 'Child Task 1.1',
          StartDate: new Date('04/02/2019'),
          Duration: 3,
          Progress: 30,
          ParentId: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
        },
        {
          TaskID: '1962C26C-6DE9-4636-83A6-93F030C6166B',
          TaskName: 'Child Task 1.2',
          StartDate: new Date('04/02/2019'),
          Duration: 3,
          ParentId: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
        },
        {
          TaskID: '35DBDA27-8A2E-43E2-99B8-C664484E6E5F',
          TaskName: 'Sub Child Task 1.2.1',
          StartDate: new Date('04/02/2019'),
          Duration: 2,
          Progress: 30,
          ParentId: '1962C26C-6DE9-4636-83A6-93F030C6166B',
        },
        {
          TaskID: 'D9851ABA-7794-4553-9491-4E35852C8542',
          TaskName: 'Sub Child Task 1.2.2',
          StartDate: new Date('04/02/2019'),
          Duration: 0,
          ParentId: '1962C26C-6DE9-4636-83A6-93F030C6166B',
        },
        {
          TaskID: 'D2BAF06C-8F30-416D-9958-DCE241B0D9C4',
          TaskName: 'Child Task 1.3',
          StartDate: new Date('04/04/2019'),
          Duration: 4,
          Progress: 30,
          Predecessor: '35DBDA27-8A2E-43E2-99B8-C664484E6E5FFS',
          ParentId: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
        },
        {
          TaskID: '4A22967A-E869-4DF0-AECD-F61BA1B1D3B0',
          TaskName: 'Child Task 1.4',
          StartDate: new Date('04/04/2019'),
          Duration: 4,
          Progress: 30,
          ParentId: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
        },
        {
          TaskID: '0FC2EDEC-04C5-4EAF-8186-CF0BE4C2D659',
          TaskName: 'Sub Child Task 1.4.1',
          StartDate: new Date('04/04/2019'),
          Duration: 4,
          Predecessor: '35DBDA27-8A2E-43E2-99B8-C664484E6E5FSS',
          ParentId: '4A22967A-E869-4DF0-AECD-F61BA1B1D3B0',
        },
        {
          TaskID: '1CB5D82F-26AF-4C8E-BFE1-5AB0A48CC0E7',
          TaskName: 'Child Task 1.5',
          StartDate: new Date('04/06/2019'),
          Duration: 4,
          Progress: 30,
          ParentId: '0AB8BA0D-9CB1-417E-966B-4EED940A905D',
        },
        {
          TaskID: '0D22F66C-FBA3-4BE1-801C-4D9F3A93381C',
          TaskName: 'Sub Child Task 1.5.1',
          StartDate: new Date('04/06/2019'),
          Duration: 4,
          ParentId: '1CB5D82F-26AF-4C8E-BFE1-5AB0A48CC0E7',
        },
      ];
export let editingData15: Object[]  = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2019'), Duration: 10,
                    Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction'
                },
                {
                    TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2FF',
                    resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                        'From an engineer or company specializing in soil testing'
                },
            ]
        }
    ];
    export let editingData16: Object[]   = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('11/02/2022'),
            EndDate: new Date('11/21/2022'),
          },
          {
            TaskID: 'A-2',
            TaskName: 'Identify site location',
            StartDate: new Date('11/02/2022'),
            Duration: 3,
            Progress: 30,
          },
          {
            TaskID: 3,
            TaskName: 'Perform Soil test',
            StartDate: new Date('11/02/2022'),
            Duration: 4,
            Predecessor: 'A-2FS',
          },
          {
            TaskID: 'A1',
            TaskName: 'Project Initiation',
            StartDate: new Date('2022-11-06'),
            EndDate: new Date('2022-11-20'),
          },
          {
            TaskID: 'A-3',
            TaskName: 'Identify Site location',
            StartDate: new Date('2022-11-16'),
            EndDate: new Date('2022-11-19'),
            progress: 50,
          },
          {
            TaskID: 'A3',
            TaskName: 'Apply for permits',
            StartDate: new Date('2022-11-19'),
            EndDate: new Date('2022-11-22'),
            Progress: 50,
            Predecessor: 'A-2SS'
          }
      ];
      export let editingData17: Object[]  = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
            ]
        },
    ];
 export let crData2: Object[] =   [
        {
          TaskID: 1,
          TaskName: "Project Initiation",
          StartDate: new Date("04/02/2019"),
          EndDate: new Date("04/21/2019"),
          subtasks: [
            {
              TaskID: 2,
              TaskName: "Identify Site location",
              StartDate: new Date("04/02/2019"),
              Duration: 6,
              resources: [{ resourceId: 1, resourceUnit: 50 }],
            },
          ],
        },
      ];
export let crData3: Object[] =[
    {
      TaskID: 1,
      TaskName: "Project Initiation",
      StartDate: new Date("04/02/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 2,
          TaskName: "Identify Site location",
          StartDate: new Date("04/02/2019"),
          Duration: 6,
          resources: [{ resourceId: 1, resourceUnit: 50 }],
        },
      ],
    },
  ];
  export let crData4: Object[] = [
    {
      TaskID: 1,
      TaskName: "Project Initiation",
      StartDate: new Date("04/02/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 2,
          TaskName: "Identify Site location",
          StartDate: new Date("04/02/2019"),
          Duration: 6,
          resources: [{ resourceId: 1, resourceUnit: 50 }],
        },
      ],
    },
  ];
  export  let multiTaskbarData1: Object[] = [
    {
      PlanningId: 'aa657d87-4b5f-4f4f-de0f-08daf5585765',
      ActivityId: 'd82b2a52-b461-4f87-162e-08da0b5543a2',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 AB TESTE',
      Label: 'AB TESTE',
      BackgroundColor: '#383c48',
      obs: '',
      LabelColor: '#4ce96d',
      WorkerContract: null,
      StartDate: '2023-01-23T00:00:00.000Z',
      EndDate: null,
      Duration: 12960,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 12960,
          StartDate: '2023-01-23T00:00:00.000Z',
          EndDate: '2023-02-01T00:00:00.000Z',
          Id: 'aa657d87-4b5f-4f4f-de0f-08daf5585765',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
    {
      PlanningId: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
      ActivityId: 'd987939b-06da-4461-88c4-08daf9444246',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 DuplicateFiles',
      Label: 'DuplicateFiles',
      BackgroundColor: null,
      obs: '',
      LabelColor: null,
      WorkerContract: null,
      StartDate: '2023-01-17T00:00:00.000Z',
      EndDate: null,
      Duration: 14399,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 14399,
          StartDate: '2023-01-17T00:00:00.000Z',
          EndDate: '2023-01-26T23:59:00.000Z',
          Id: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
    {
      PlanningId: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
      ActivityId: 'c58144c0-a966-4742-a79f-08db03876317',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 New Activity',
      Label: '🛠 New Activity',
      BackgroundColor: null,
      obs: '',
      LabelColor: null,
      WorkerContract: null,
      StartDate: '2023-01-31T00:00:00.000Z',
      EndDate: null,
      Duration: 8640,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 8640,
          StartDate: '2023-01-31T00:00:00.000Z',
          EndDate: '2023-02-06T00:00:00.000Z',
          Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
    {
      PlanningId: 'za36c7bd-52b2-490b-2f37-08db03884b34',
      ActivityId: 'z58144c0-a966-4742-a79f-08db03876317',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 New Activityz',
      Label: '🛠 New Activity',
      BackgroundColor: null,
      obs: '',
      LabelColor: null,
      WorkerContract: null,
      StartDate: '2023-01-31T00:00:00.000Z',
      EndDate: null,
      Duration: 8640,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 8640,
          StartDate: '2023-01-31T00:00:00.000Z',
          EndDate: '2023-02-06T00:00:00.000Z',
          Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
  ];

export  let multiTaskbarDataLess: Object[] = [
    {
      PlanningId: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
      ActivityId: 'd987939b-06da-4461-88c4-08daf9444246',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 DuplicateFiles',
      Label: 'DuplicateFiles',
      BackgroundColor: null,
      obs: '',
      LabelColor: null,
      WorkerContract: null,
      StartDate: '2023-01-17T00:00:00.000Z',
      EndDate: null,
      Duration: 14399,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 14399,
          StartDate: '2023-01-17T00:00:00.000Z',
          EndDate: '2023-01-26T23:59:00.000Z',
          Id: 'f7026179-a138-4b5f-bb7f-08daf944dae3',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
    {
      PlanningId: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
      ActivityId: 'c58144c0-a966-4742-a79f-08db03876317',
      TaskId: '00000000-0000-0000-0000-000000000000',
      Name: '🛠 New Activity',
      Label: '🛠 New Activity',
      BackgroundColor: null,
      obs: '',
      LabelColor: null,
      WorkerContract: null,
      StartDate: '2023-01-31T00:00:00.000Z',
      EndDate: null,
      Duration: 8640,
      ParentId: '00000000-0000-0000-0000-000000000000',
      IsPlanningTask: false,
      childs: [],
      SegmentsFields: [
        {
          Duration: 8640,
          StartDate: '2023-01-31T00:00:00.000Z',
          EndDate: '2023-02-06T00:00:00.000Z',
          Id: 'ca36c7bd-52b2-490b-2f37-08db03884b34',
          IdSerie: null,
          EnumPeriodRecord: 0,
        },
      ],
      Resources: [
        {
          ResourceId: '58d98a21-2e02-4b6e-9547-54b56f7b17a7',
          ResourceName: '🙂 rsantos@endiprev.com',
          ResourceGroup: null,
          Department: 'Information Technology',
          obs: '',
          isExpand: true,
          unit: 100,
        },
      ],
      EnumTypeRecords: 1,
      EnumStatusVacationTimeOff: 0,
    },
  ];
  export  let editData18: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];
export let sampleData1: object[] = [
    { TaskID: 11, TaskName: 'Parent' },
    {
      TaskID: 12,
      TaskName: 'Article #5678567',
      parentId: 11,
      StartDate: new Date('02/13/2023'),
      EndDate: new Date('02/28/2023'),
      Segments: [
        {
          StartDate: new Date('02/13/2023'),
          EndDate: new Date('02/18/2023'),
          projectName: 'Topology 2-1'
        },
        {
          StartDate: new Date('02/20/2023'),
          EndDate: new Date('02/28/2023'),
          projectName: 'Topology 2-2'
        }
      ]
    },
    { TaskID: 13, TaskName: 'Child of FIRST 2', parentId: 11 },
    { TaskID: 14, TaskName: 'Child of FIRST 3', parentId: 11 },
    { TaskID: 15, TaskName: 'NEXT' },
    { TaskID: 16, TaskName:'Child of NEXT 1', parentId: 15 },
    { TaskID: 17, TaskName: 'Child of NEXT 2', parentId: 15 },
    { TaskID: 14, TaskName: 'Child of FIRST 4', parentId: 11 },
    { TaskID: 16, TaskName: 'Child of NEXT 3', parentId: 15 }
      ];
export let projectNewData14: Object[] = [
        {
            Id: '7aa84bb0da79427390e16a683802e35c',
            Name: 'Project initiation',
        
            Subtasks: [
              {
                Id: 'a01d9aa633904ee4bd7206282b65268b',
                Name: 'Identify site location',
                CreateDate: '2019-04-01T23:00:00.000Z',
                Duration: 0,
                Progress: 0,
                resources: [1],
                info: 'Measure the total property area alloted for construction',
              },
              {
                Id: 'e68b6c03898d427f96687526969b888d',
                Name: 'Perform Soil test',
                CreateDate: '2019-04-01T23:00:00.000Z',
                EndDate: '2019-04-07T23:00:00.000Z',
                Dependency: '',
                Progress: 0,
                resources: [2, 3, 5],
                info:
                  'Obtain an engineered soil test of lot where construction is planned.' +
                  'From an engineer or company specializing in soil testing',
              },
              {
                Id: 'e68b6c03898d427f96687526969b888d',
                Name: 'Soil test approval',
                CreateDate: '2019-04-02T23:00:00.000Z',
                Dependency: '',
                Progress: 0,
              },
            ],
          },
        ];
export let projectNewData15: Object[] =  [
    {
        TaskID: 1,
        TaskName: "Identify Site location",
        StartDate: new Date("04/02/2019"),
        Duration: 4,
        resources: [{ resourceId: 1, resourceUnit: 50 }],
    },
    {
        TaskID: 2,
        TaskName: "Identify Soil",
        StartDate: new Date("04/02/2019"),
        Duration: 0,
        resources: [{ resourceId: 1, resourceUnit: 50 }],
    },
  ]
export  let projectNewData16: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
];
export  let projectNewData17: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/02/2019'),
        subtasks: []
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019')
    }
]
export let projectNewData18: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual' : true,
        'Children': [
             { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
             'EndDate': new Date('02/03/2017'), 'Progress': '40' },
            
        ]
    }
  
];
export let projectNewData19: Object[] = [
    {
      taskID: 5,
      taskName: 'Project estimation',
      startDate: new Date('04/02/2019'),
      endDate: new Date('04/21/2019'),
      BaselinestartDate: new Date('04/02/2019 10:45:00 AM'),
      BaselineendDate: new Date('04/15/2019 11:15:00 AM'),
    },
    {
      taskID: 6,
      taskName: 'Develop floor plan for estimation',
      startDate: new Date('04/04/2019'),
      duration: 3,
      predecessor: '3FS,4FS,7SS',
      Progress: 30,
      resources: 4,
      info: 'Develop floor plans and obtain a materials list for estimations',
      parentID: 5,
      BaselinestartDate: new Date('04/02/2019 11:15:00 AM'),
      BaselineendDate: new Date('04/12/2019 11:25:00 AM'),
    },
    {
      taskID: 7,
      taskName: 'List materials',
      startDate: new Date('04/04/2019'),
      duration: 3,
      resources: [4, 8],
      info: '',
      parentID: 5,
      BaselinestartDate: new Date('04/02/2019 11:00:00 AM'),
      BaselineendDate: new Date('04/18/2019 11:20:00 AM'),
    },
    {
      taskID: 8,
      taskName: 'Estimation approval',
      startDate: new Date('04/04/2019 08:00:00 AM'),
      duration: '40 minutes',
      predecessor: '',
      resources: [12, 5],
      info: '',
      parentID: 5,
      BaselinestartDate: new Date('04/02/2019 11:00:00 AM'),
      BaselineendDate: new Date('04/02/2019 11:30:00 AM'),
    },

    {
      taskID: 9,
      taskName: 'Sign contract',
      startDate: new Date('04/04/2019 08:00:00 AM'),
      duration: '100 minutes',
      predecessor: '8FS',
      Progress: 30,
      resources: [12],
      info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)',
      BaselinestartDate: new Date('04/02/2019 11:20:00 AM'),
      BaselineendDate: new Date('04/02/2019 11:40:00 AM'),
    },
    {
      taskID: 10,
      taskName: 'Project approval and kick off',
      startDate: new Date('04/04/2019 08:00:00 AM'),
      endDate: new Date('05/21/2019 08:40:00 AM'),
      duration: '40 minutes',
      predecessor: '',
      BaselinestartDate: new Date('04/02/2019 11:40:00 AM'),
      BaselineendDate: new Date('05/02/2019 12:00:00 PM'),
    },
  ];
  export let projectNewData20: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Task 2',
        StartDate: new Date('06/16/2023'),
        Duration: 72,
        DurationUnit: 'hour',
        EndDate: new Date('06/20/2023'),
    },
    {
        TaskID: 2,
        TaskName: 'Task 2',
        StartDate: new Date('06/16/2023'),
        Duration: 1800,
        DurationUnit: 'minutes',
        EndDate: new Date('06/20/2023'),
    }
  ];
export let splitData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('09/29/2019'),
        Segments: [
          {
            TaskName: 'Identify site location',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/01/2019'),
          },
          {
            TaskName: 'Perform soil test',
            StartDate: new Date('09/03/2019'),
            EndDate: new Date('09/29/2019'),
          },
        ],
      },
];

export let projectNewData21: Object[] = [{
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('03/29/2019'),
    EndDate: new Date('04/21/2019'),
    subtasks: [
        {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
        },
        {
            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
        },
        {
            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
        },
    ]
}];
export let taskModeData4: Object[]  = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'Progress': '40','Duration':0 ,'isManual': true},
            { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
        ]
    }
];
export let taskModeData5: Object[]  = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'Progress': '40','Duration':0 ,'isManual': true},
            { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
        ]
    },
    {
        'TaskID': 4,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'Children': [
            { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'Progress': '40','Duration':0 ,'isManual': true}
        ]
    }
];
export let projectNewData22: Object[]  = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('02/04/2019 08:30:00'),
        EndDate: new Date('02/04/2019 15:00:00')
    },
    {
        TaskID: 2,
        TaskName: 'Project estimation',
        StartDate: new Date('02/04/2019 08:30:00'),
        EndDate: new Date('02/04/2019 17:30:00')
    },
    {
        TaskID: 3,
        TaskName: 'Project estimation2',
        StartDate: new Date('02/04/2019 08:00:00'),
        EndDate: new Date('02/04/2019 16:30:00')
    }
  ];
  export let customZoomingLevels: any[] = [
    {
      level: 0,
      timelineUnitSize: 99,
      timelineViewMode: 'Year',
      bottomTier: {
        unit: 'Month',
        count: 3,
        formatter: (date: Date) => {
          const month = date.getMonth();
          if (month >= 0 && month <= 2) {
            return 'CQ1';
          } else if (month >= 3 && month <= 5) {
            return 'CQ2';
          } else if (month >= 6 && month <= 3) {
            return 'CQ3';
          } else {
            return 'CQ4';
          }
        },
      },
      topTier: {
        unit: 'Year',
        count: 1,
        formatter: (date: Date) => {
          return date.getFullYear().toString();
        },
      },
    },
    {
      level: 1,
      timelineUnitSize: 99,
      timelineViewMode: 'Year',
      bottomTier: {
        unit: 'Month',
        count: 1,
        formatter: (date: Date) => {
          // return date.toDateString().match(this.datePattern)[2];
        },
      },
      topTier: {
        unit: 'Month',
        count: 3,
        formatter: (date: Date) => {
          const month = date.getMonth();
          const year = date.getFullYear();
          if (month >= 0 && month <= 2) {
            return 'CQ1 ' + year;
          } else if (month >= 3 && month <= 5) {
            return 'CQ2 ' + year;
          } else if (month >= 6 && month <= 3) {
            return 'CQ3 ' + year;
          } else {
            return 'CQ4 ' + year;
          }
        },
      },
    },
    {
      level: 2,
      timelineUnitSize: 99,
      timelineViewMode: 'Month',
      bottomTier: {
        unit: 'Week',
        count: 1,
        formatter: (date: Date) => {
          //const match = date.toDateString().match(this.datePattern);
          // return `${match[2]} ${match[3]}`;
        },
      },
      topTier: {
        unit: 'Month',
        count: 1,
        formatter: (date: Date) => {
          // const match = date.toDateString().match(this.datePattern);
          //return `${match[2]}, ${match[4]}`;
        },
      },
    },
    {
      level: 3,
      topTier: {
        unit: 'Week',
        count: 1,
        formatter: (date: Date) => {
          // const match = date.toDateString().match(this.datePattern);
          // return `${match[2]} ${match[3]}, ${match[4]}`;
        },
      },
      bottomTier: {
        unit: 'Day',
        count: 1,
        formatter: (date: Date) => {
          // const match = date.toDateString().match(this.datePattern);
          //  return `${match[1]}`;
        },
      },
      timelineUnitSize: 99,
      timelineViewMode: 'Week',
      weekStartDay: 0,
      updateTimescaleView: true,
    },
  ];
  export let zoomingData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            {
                TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 2,
                Predecessor: '2', Progress: 30
            },
        ]
    },
    {
        TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
        Indicators: [
            {
                'date': new Date('04/10/2019'),
                'name': '#briefing',
                'title': 'Product concept breifing',
            }
        ]
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4,
                        Predecessor: '5', Progress: 30
                    },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5' }
                ]
            },
            {
                TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'), Duration: 4,
                Predecessor: '7, 8', Progress: 30
            },
            { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '9' },
            {
                TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 1, Predecessor: '10',
                Indicators: [
                    {
                        'date': new Date('04/20/2019'),
                        'name': '#meeting',
                        'title': '1st board of directors meeting',
                    }
                ]
            }
        ]
    }
]
export let customZoomingLevels1: any[] = [
    {
      level: 0,
      timelineUnitSize: 99,
      timelineViewMode: 'Year',
      bottomTier: {
        unit: 'Month',
        count: 3,
        formatter: (date: Date) => {
          const month = date.getMonth();
          if (month >= 0 && month <= 2) {
            return 'CQ1';
          } else if (month >= 3 && month <= 5) {
            return 'CQ2';
          } else if (month >= 6 && month <= 3) {
            return 'CQ3';
          } else {
            return 'CQ4';
          }
        },
      },
      topTier: {
        unit: 'Year',
        count: 1,
        formatter: (date: Date) => {
          return date.getFullYear().toString();
        },
      },
    },
    {
      level: 1,
      timelineUnitSize: 99,
      timelineViewMode: 'Year',
      bottomTier: {
        unit: 'Month',
        count: 1,
        formatter: (date: Date) => {
          // return date.toDateString().match(this.datePattern)[2];
        },
      },
      topTier: {
        unit: 'Month',
        count: 3,
        formatter: (date: Date) => {
          const month = date.getMonth();
          const year = date.getFullYear();
          if (month >= 0 && month <= 2) {
            return 'CQ1 ' + year;
          } else if (month >= 3 && month <= 5) {
            return 'CQ2 ' + year;
          } else if (month >= 6 && month <= 3) {
            return 'CQ3 ' + year;
          } else {
            return 'CQ4 ' + year;
          }
        },
      },
    }
  ];
  export let manualData: Object[] =  [
    {
        taskID: '100010-ABCDEFGH??!',
        taskName: 'Project Schedule',
        startDate: new Date('02/04/2019'),
        endDate: new Date('03/10/2019'),
    },
    {
        taskID: 'ABCDEFGH?!200001',
        taskName: 'Planning',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        parentID: '100010-ABCDEFGH??!',
    },
    {
        taskID: '3',
        taskName: 'Plan timeline',
        startDate: new Date('02/04/2019'),
        endDate: new Date('02/10/2019'),
        duration: 6,
        progress: '60',
        parentID: 'ABCDEFGH?!200001',
    },
];
export let tempData1: object[] = [
    {
      TaskID: 1,
      TaskName: 'Project Initiation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 2,
      TaskName: 'Identify Site location',
      StartDate: new Date('04/02/2019'),
      Duration: 4,
      Progress: 50,
    },
  ];
 export let tempData2: Object[] = [
    {
      TaskID: 1,
      TaskName: 'Project Initiation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 2,
      TaskName: 'Identify Site location',
      StartDate: new Date('04/02/2019'),
      Duration: 4,
      Progress: 50,
    },
    {
      TaskID: 3,
      TaskName: 'Perform Soil test',
      StartDate: new Date('04/02/2013'),
      Duration: 4,
      Progress: 50,
    },
    {
      TaskID: 4,
      TaskName: 'Soil test approval',
      StartDate: new Date('04/02/2017'),
      Duration: 4,
      Progress: 50,
    },
  ]; 
  export let zoomInData: Object[] =[
    {
      TaskID: 1,
      TaskName: 'New Task 1',
      StartDate: new Date('06/16/2023'),
      EndDate: new Date('06/16/2023'),
      Progress: 59,
      Duration: 1,
    },
    {
      TaskID: 2,
      TaskName: 'New Task 2',
      StartDate: new Date('05/22/2023'),
      EndDate: new Date('05/22/2023'),
      Progress: 45,
      Duration: 1,
      Predecessor: 1
    },
    {
      TaskID: 3,
      TaskName: 'New Task 3',
      StartDate: new Date('05/23/2023'),
      EndDate: new Date('05/23/2023'),
      Duration: 0,
    },
    {
      TaskID: 4,
      TaskName: 'New Task 4',
      StartDate: new Date('05/22/2023'),
      EndDate: new Date('05/22/2023'),
      Progress: 38,
      Duration: 1,
    },
    {
      TaskID: 5,
      TaskName: 'New Task 5',
      StartDate: new Date('05/22/2023'),
      EndDate: new Date('05/22/2023'),
      Progress: 68,
      Duration: 1,
      Predecessor: 4,
    },
    {
      TaskID: 6,
      TaskName: 'New Task 6',
      StartDate: new Date('05/22/2023'),
      EndDate: new Date('05/22/2023'),
      Progress: 57,
      Duration: 1,
      Predecessor: 5,
    },
    {
      TaskID: 7,
      TaskName: 'New Task 7',
      StartDate: new Date('05/22/2023'),
      EndDate: new Date('05/22/2023'),
      Progress: 0,
      Duration: 1,
    },
  ];
  export let tempData3: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Initiation',
        StartDate: new Date('04/02/2024'),
        EndDate: new Date('04/21/2024'),
    },
    {
        TaskID: 2,
        TaskName: 'Identify Site location',
        StartDate: new Date('04/02/2024'),
        Duration: 4,
        Progress: 50,
    },
  ];
 export let tempData4: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
    },
    {
        TaskID: 2,
        TaskName: 'Identify Site location',
        Duration: 4,
        Progress: 50,
    },
    {
        TaskID: 3,
        TaskName: 'Perform Soil test',
        StartDate: new Date('04/02/2019'),
        Duration: 4,
        Progress: 50,
    },
    {
        TaskID: 4,
        TaskName: 'Soil test approval',
        StartDate: new Date('04/02/2019'),
        Duration: 4,
        Progress: 50,
    },
  ]; 
  export let tempData5: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: '2019-04-02',
        EndDate: '2019-04-25',
        Segments: [
            {
              StartDate: '2019-04-02',
              EndDate: '2019-04-16'
            },
            {
              StartDate: '2019-04-17',
              EndDate: '2019-04-25'
            }
          ]
    }
];
export let tempData6: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: '2019-04-02',
        EndDate: '2019-04-25',
        Segments: [
            {
              StartDate: '2019-04-02',
              EndDate: '2019-04-16'
            },
            {
              StartDate: '2019-04-17',
              EndDate: '2019-04-25'
            }
          ]
    }
];
export let editingData18: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('01/01/2019'), Duration: 0,
                Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction'
            },
            {
                TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2',
                resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                    'From an engineer or company specializing in soil testing'
            },
            { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3', Progress: 30 },
        ]
    },
];
export let editingResources1: Object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];

export  let projectNewData23  : Object[]= [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2019'), Duration: 0,
                Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction'
            },
            {
                TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2',
                resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                    'From an engineer or company specializing in soil testing'
            },
            { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3', Progress: 30 },
        ]
    },
];
export let pdfData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    }]
    export let templateData: Object[] =   [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'),
                  Duration: 3, Progress: 30, resources: [2] },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'),
                  Duration: 3, resources: [3]},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'),
                  Duration: 2, Predecessor: '2', Progress: 30, resources: [4] }]
            },
            {
            TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4', resources: [1]
        },
        {
            TaskID: 6,
            TaskName: 'Market research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'),
                         Duration: 4, Predecessor: '5', Progress: 30, resources: [5] },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'),
                         Duration: 4, Predecessor: '5', resources: [6] }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'),
                  Duration: 4, Predecessor: '7, 8', Progress: 30, resources: [4] },
                { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'),
                  Duration: 4, Predecessor: '9', resources: [8] },
            ]
        }
    ]
export let projectResourcestemplate: Object[] = [
        { resourceId: 1, resourceName: 'Martin Tamer' },
        { resourceId: 2, resourceName: 'Rose Fuller' },
        { resourceId: 3, resourceName: 'Margaret Buchanan' },
        { resourceId: 4, resourceName: 'Fuller King' },
        { resourceId: 5, resourceName: 'Davolio Fuller' },
        { resourceId: 6, resourceName: 'Van Jack' },
        { resourceId: 7, resourceName: 'Fuller Buchanan' },
    ];
export let virtual1 : Object[] =  [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    }]
export let criticalData1 : Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            {
                TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 2,
                Predecessor: '2', Progress: 30
            },
        ]
    },
    {
        TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
        Indicators: [
            {
                'date': '04/10/2019',
                'name': 'Design Phase',
                'tooltip': 'Design phase completed',
                'iconClass': 'okIcon e-icons'
            }
        ],
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4,
                        Predecessor: '5', Progress: 30
                    },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5' }
                ]
            },
            {
                TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'), Duration: 4,
                Predecessor: '7, 8', Progress: 30
            },
            { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '9' },
            {
                TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: '10',
                Indicators: [
                    {
                        'date': '04/27/2019',
                        'name': 'Research completed',
                        'tooltip': 'Research completed',
                        'iconClass': 'description e-icons'
                    }
                ],
            }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product design and development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '12'
            },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '12' },
            { TaskID: 16, TaskName: 'Define reliability', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30, Predecessor: '15' },
            { TaskID: 17, TaskName: 'Identifying raw materials', StartDate: new Date('04/04/2019'), Duration: 2, Predecessor: '15' },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'),
                        Duration: 2, Progress: 30, Predecessor: '17'
                    },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 2, Predecessor: '17' }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'),
                        Duration: 2, Progress: 30, Predecessor: '19,20'
                    },
                    {
                        TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'),
                        Duration: 2, Predecessor: '22'
                    },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '23' }
                ]
            },
            {
                TaskID: 25, TaskName: 'CAD computer-aided design', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 30, Predecessor: '24'
            },
            { TaskID: 26, TaskName: 'CAM computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '25' },
            {
                TaskID: 27, TaskName: 'Design complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: '26',
            }

        ]
    },
    { TaskID: 28, TaskName: 'Prototype testing', StartDate: new Date('04/04/2019'), Duration: 4, Progress: 30, Predecessor: '27' },
    { TaskID: 29, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '28ss',  Indicators: [
        {
            'date': '05/24/2019',
            'name': 'Production phase',
            'tooltip': 'Production phase completed',
            'iconClass': 'okIcon e-icons'
        }
    ], },
    { TaskID: 30, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30, Predecessor: '28,29' },
    { TaskID: 31, TaskName: 'Assembling materials to finsihed goods', StartDate: new Date('04/04/2019'), Duration: 5, Predecessor: '30' },
    {
        TaskID: 32,
        TaskName: 'Feedback and testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 33, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 45, Predecessor: '31'
            },
            {
                TaskID: 34, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'),
                Duration: 3, Progress: 50, Predecessor: '33'
            }
        ]
    },
    {
        TaskID: 35,
        TaskName: 'Final product development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 36, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'),
                Duration: 4, Progress: 30, Predecessor: '34'
            },
            {
                TaskID: 37, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'),
                Duration: 4, Progress: 30, Predecessor: '36ss',
                Indicators: [
                    {
                        'date': '06/21/2019',
                        'name': 'Sales and marketing',
                        'tooltip': 'Sales and marketing',
                        'iconClass': 'description e-icons'
                    }
                ],
            }
        ]
    },
    {
        TaskID: 38,
        TaskName: 'Final product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 39, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '37' },
            {
                TaskID: 40, TaskName: 'Marketing and presales', StartDate: new Date('04/04/2019'),
                Duration: 4, Progress: 30, Predecessor: '39'
            }
        ]
    }
]
export let resourcesData1: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];

export let resourceCollection1: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
];

export let coulmntemplate: object[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        // EmailId:'abs@gmail.com',
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'),
              Duration: 3, Progress: 30, resources: [2],EmailId:'RoseFuller@gmail.com',resourcesImage:'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'},
          { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'),
              Duration: 2, Predecessor: '2', Progress: 30, resources: [2,4] ,EmailId:'FullerKing@gmail.com',resourcesImage:['/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAFBwQGCAMCCf/aAAgBAQAAAADfwhV0x/EZ4hW5npVo+hcTlnMn4TW6ofZUBIXDSIEnOzwAaDYEyICYV79vc+aEqNLsbBM//8QAGAEAAwEBAAAAAAAAAAAAAAAAAgQFAwD/2gAIAQIQAAAABNvRaHSpjAqO9hof/8QAGQEAAgMBAAAAAAAAAAAAAAAAAgUDBAYA/9oACAEDEAAAADbLIbutRIi2OdXdagD/xAAfEAACAwEBAQADAQAAAAAAAAAEBQIDBgEHABITFBX/2gAIAQEAAQgA+/0izrLKEuj9O81zxtwL2r3Pze87lUFwwDEEVrlQ21sL617X47th5VaUf2TSlZ/O0Z9IT468vpqspb+dtFYNhQ3jnpLfFP6lzAoQY4aY5acm+MyFJqOf5jlMu+12WWaxaJBjugEFv8cG+5kMlobU70irSIgntauc+rF0rHtsVpK5z9nZ/ihVc56fmiTmueaDmJMvJkTeVxnnCKIgcJUrma0oRaHRwYYYeO3h3mdIjxF3+fp6mRlA5dMxyHyyqbZuDVFcbTyFFuAVdpIlKz5lTBgxAU9aikV30OALtIDMbnQ9akbk12vEoL7YmE1i9xrWtZKdU6tYkvF7IVYHcNC4o35zmhjLJmCfqbZwqBJeqGzphcDs2mzjIsTN8WJ84Ak7K2H3/8QAMxAAAgEDAgMECQMFAAAAAAAAAQIDAAQREjETIVEFQWGhEBQjMkJicXKBBiIzUlOCkbH/2gAIAQEACT8ApE0IxWS9l5xKRuEHxnyrt687Wv4v5o4Q7oh8Fj0pX6PuY7HIBunjjDjqdCk12xItvOgkhZJDPbspH9D58iDUKw3D8opUJMEx6KTs3yn0SMqlOLeyqcFYicCNT1f/AJXsZryMxkxjBSHbC/dUS3XEjDSaSoYN/kRVndZikKSppJKMOoHcakkXseadI7mCbKhdZwZUB2K0gaKTGANwe4g9xFNqu7XHtP7sLe5J9e40My31zJL1IjU6EH4UUTxNFsR0KvIVxVnLPPGig5dIkzjnguQTiuxxi4bHtpAgBHzYNWcEc9rexJrt51nDRzciCQBUgaQ20RYg55ledbRl7ebG7RyKWH+mUVv6sgPhgUoYiWO3lDclVUbiqSfrUEMlyrH4QWOfOpFdopjmAxMMN0C489qgRtckMiRON3WQPjyonTFEqDPRRiubGWL8nVXJrS4coOsMx1ofMiow6HcVcvBLLMdMyAFlO/xCnLXnMLcNAMdNVScd7ePEkxULqZ+/C4A9GWjRXurnHcoBRB+Saj13MAKSxDeeA8yo+YbrUmt2HMEEafr4ipHkljYm4Qe+veGHUVLFpZsamWpGnyWSd1HvTIobC/aDtUrTTNgJbqhEruTyUCiGv7phJPjZcDCxj5UHok9WvH95gMxyfevXxFW4MWzNFIGR1+hwaaW2u5c8UJEBFkjGcMVw3iKs/Ubaxt7mOX1iZZuJLOysZMpgs37eg3ocW9fOudhjGdwg7h6P/8QAIREBAAIBBAEFAAAAAAAAAAAAAQIDAAQQETESBSJBYYH/2gAIAQIBAT8AnMhFk4a2Euph+ZXYWG2rOaX6yTxEDr5z015jMD2m0kB5yyLXKzkAVTND4RoiHart3llNdkGE48mRhGIeMToNv//EACIRAQACAQMEAwEAAAAAAAAAAAECAxEAEBIEBTFhFSEiNP/aAAgBAwEBPwCuuVs4wj5dfFTBzFUPGdXUyplxdu3/ANURQyOq6xCUs5cYdd7hwnUyRk7R5cjj510t5OqGP2kQfSa7k2T6qyUj6MB62FETVHU3U2RsrniXh96nZOaspLlV2//Z','/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAFBwgEBgkCA//aAAgBAQAAAAC/hQFOvYjnCinKzbmZbGH5zuQtL+rjE/fO5y7I93/rpMhES5qCgxOTPErmqDaDCzVpNoBsPfbf/8QAGgEAAQUBAAAAAAAAAAAAAAAAAAECAwQFBv/aAAgBAhAAAAAoWZjmNLVM6a2Pan//xAAXAQEBAQEAAAAAAAAAAAAAAAAABAUG/9oACAEDEAAAAGjNO7PFxm1FEH//xAA3EAACAgECBAMFBgQHAAAAAAABAgMEBQAGBxESQSExMhATUVKBCBQiYWKhFiNxkTNCU2RygrH/2gAIAQEAAT8A0chavSvWwcaFUYrJdlBMSkeYjA9Z/bW5b209pY98xvncBFf57UrKrP8ACOGL1H8gCdRcfOB8txaopTojeU5p8o9Uq+OuVUv7XzrLE4DIYpvvNduY+Vif2I1Vyk0NiPH5eBYLD+EUqEmCc/BSfJv0n2ZB5MjajwlZ2RCnvbkinkViJ5CMH5n/APNdNajV5L0Q14IyflREUeJ1vDP53jTu65l72QMOMWZ4MbW/yQwBuw+Yj1HW3OAEF1lntZ50iHNRGkHiSe/MtrbEF3ghuPEWkyktvbt2daeQRx4oH8EfkPk1PTr5CrLVtRBom5fkQR3B7EdjrD2Z1exibrdVury/mf6sLeiT+vY6wRV69rJv671mSX4n3anoRfoo1l6pv4rKUAwQ2ak8AY+QMiFef76x2VbacmNrvjnnmjAMiGRU5OW9IB8WOtucRXk2ra3FiMK9panISQGTpCv+ZAJ1ZvZjiJgbr28VBVimjjmj6RYVo2V/DwljQN3BI1Gysqup5hgCNZ2VcbZx2Z7Rl683LzaORSw/syjW3HUYHFfEVkB9m7sNitqby3LVzlFmkhlkmrFVKO6MSY+nXBvN0Zq+YoLQsixLKr9DxosBHkSCxAIXvrFTRzyDCrSjhnM6x9KgCFwT6l5dtIOlFX4Aa3uhG3bCjxYyxfU9WsEfu5v4lvBqlhygPeGY9aH9yPZ9rHEQ0M5tvOo/4sjVnqSoP9uQQw+kuuFMAd0DW4pK5J61lkYsOf8A28DrYaU23dFVqoohgWWdlTyDEcv7nnz9mShTIZGhiTzaNFe1Z5dlAKIPqTrK1bEU8GYx8ZezApSWIec8BPMqP1DzXXEn7Ue2dlT2sNisLfyGZi7TxmrWT+rP+JtY7c03GVty/wAVSKcnNcjsQyJ4CCLoEaJEOypy1tjgruGnuypiZcpXkSWMWVevZVHeH5mTnzGt75ylwWweJkw5jmzlu5FyD94IiGm+jenWy+NG1N60m+4CxHlo4laTGshMhZjyHQw8GBOsZTmrJNaukNftMJJyPJeyxj9KD2cReDu0OJNUnJVBDdH+Hai/C6nW2+AWe4ZbrOTe3VvYKeKSByT0ypzIKkL31tfZ+8It62tx5a37h6+T+/0pY5FKycj0CAgEkRmPw1ujg/n+Ke7XzuRvpTwcaJBVjRg0vuk8T/xJOtmcPtu7EpJVw9VRL0/zJ28XY+z/xAAiEQACAQMEAgMAAAAAAAAAAAABAgMABBEQEhNRISIFQYH/2gAIAQIBAT8AqW/hjk4y/t1ioJ0nTemtyA0pYREOjeT3XxjFufxhcg/ut5aMw5Ez7H6Gas7ZraHa4wzHcdVYjaOjmiSTk6f/xAAiEQACAQIGAwEAAAAAAAAAAAABAgMEEQAFEBITISJBUZH/2gAIAQMBAT8AxFltRJGsvH4H3fFTTvTPsf2LjWlBEChp1aNk8V+YzdVUwDddrH81y6t4xxkjpSLsbdYr6hamfehuoULr91//2Q==']}]
        }
];

export let resourceCollectiontemplate1: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
    ];
export let splitTasks :Object[] =   [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/04/2019'),
        EndDate: new Date('03/10/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/04/2019'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '60',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 2 }
                          ]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '90'
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                        Duration: 10, Progress: '75',
                        Segments: [
                            { StartDate: new Date('02/04/2019'), Duration: 4 },
                            { StartDate: new Date('02/08/2019'), Duration: 2 }
                          ]
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                        Duration: 0, Predecessor: '3FS,5FS'
                    },
                ]
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/25/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '60', Predecessor: '6FS'
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                        Duration: 5, Progress: '100', Predecessor: '6FS',
                        Segments: [
                            { StartDate: new Date('02/25/2019'), Duration: 2 },
                            { StartDate: new Date('02/28/2019'), Duration: 3 }
                          ]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                        EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                        Duration: 0, Predecessor: '10FS'
                    }
                ]
            }
        ]
    }
];
export let publicProperty : Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
  
];
export let dialogData1: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40' },
            { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
            { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
        ]
    }
];
export let headerFooter: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            {
                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
        ]
    }];
export let images: string = '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';
export let predcessor1 : Object[] =  [
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: [11,10] }
        ]
    },
  
];

export  let baselineData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1, Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12, Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 30 },
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 }
        ]
    }
];

export let connectorLineData : Object[] =   [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "3FS,5FS", Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,  },
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0 },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/15/2019'),Predecessor: "9FS", Duration: 4, Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4}
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Progress: 30 },
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4},
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0 }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30, Predecessor: "15SS,19SS" },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 0, Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Predecessor: "20SS", Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/24/2019'), Duration: 12, Progress: 30 ,Predecessor: "20SS"},
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 30 },
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'),Predecessor: "20SF", Duration: 5, Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Predecessor: "37SF", Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30 }
        ]
    }
];

export let rangeContainer: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Progress: 30, work: 10,
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('03/29/2019'), Duration: 12,
                resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
            },
            {
                TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                Duration: 4, Progress: 30, resources: [4]
            },
            {
                TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                Progress: 30, Predecessor: '9SS', resources: [3]
            },
            {
                TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                Duration: 3, resources: [2]
            },
            {
                TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                Duration: 4, Progress: 30, resources: [3]
            }
        ]
    },
    {
        TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
        Progress: 30,
    }
];
export let rangeContainerResource: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
    { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
    { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
    { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
    { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
];
export let weekEndData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, 
            Indicators: [
                {
                    'date': '04/10/2019',
                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                    'name': 'Indicator title',
                    'tooltip': 'tooltip'
                }
            ] 
        },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
        ]
    },
    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    {
        TaskID: 6,
        TaskName: 'Market Research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand Analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                ]
            },
            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
        ]
    },
    {
        TaskID: 13,
        TaskName: 'Product Design and Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 },
            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4 },
            {
                TaskID: 18,
                TaskName: 'Define cost plan',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1,Progress: 30 },
                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1 }
                ]
            },
            {
                TaskID: 21,
                TaskName: 'Development of the final design',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5 }
                ]
            },
            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 },
            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
        ]
    },
    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12,Progress: 30 },
    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5 },
    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9 ,Progress: 30},
    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12 },
    {
        TaskID: 31,
        TaskName: 'Feedback and Testing',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5,Progress: 30 },
            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7,Progress: 30 }
        ]
    },
    {
        TaskID: 34,
        TaskName: 'Product Development',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 },
            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2,Progress: 30 }
        ]
    },
    {
        TaskID: 37,
        TaskName: 'Final Product',
        StartDate: new Date('04/04/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10,Progress: 30 }
        ]
    }
];
export let resourceDataUndo: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 2,
                Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [2, 3, 5], work: 96
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 1,
                work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30
            },
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                Duration: 3, Progress: 30, resources: [{ resourceId: 4, unit: 50 }], work: 30
            },
            {
                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/01/2019'), Duration: 3,
                work: 48, resources: [4, 8]
            },
            {
                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/01/2019'),
                Duration: 2, work: 60, resources: [12, { resourceId: 5, unit: 70 }]
            }
        ]
    },
    {
        TaskID: 9, TaskName: 'Sign contract', StartDate: new Date('04/01/2019'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }
];
export let cellEditData1: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        SchedulingType: 'FixedDuration',
        Work: 5,
        Duration: 1,
    }
  ]
export let criticalData2: Object[] = [
    {
        taskId: 1,
        taskName: 'Test 1',
        startDate: '2024-04-15',
        endDate: '2024-04-19T23:59:59.999Z',
        duration: 2,
        dependencies: '',
    },
    {
        taskId: 2,
        taskName: 'Test 2',
        startDate: '2024-04-24',
        endDate: '2024-04-26T23:59:59.999Z',
        duration: 2,
        dependencies: '1FS-1 days',
    }
]
export let CR885011: Object[] = [
    {
        taskId: 1,
        taskName: 'Adicionar 6',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        dependencies: null,
        taskIndex: 0,
        cost: 0,
        baselineStartDate: null,
        baselineEndDate: null,
        index: 0,
        wbs: '01',
      },
      {
        taskId: 2,
        taskName: 'Adicionar 1',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        dependencies: null,
        taskIndex: 1,
        cost: 0,
        baselineStartDate: null,
        baselineEndDate: null,
        index: 1,
        wbs: '02',
      },
      {
        taskId: 3,
        taskName: 'Adicionar 2',
        startDate: '2024-04-08',
        endDate: '2024-04-12T23:59:59.999Z',
        duration: 5,
        dependencies: null,
        taskIndex: 2,
        cost: 0,
        baselineStartDate: null,
        baselineEndDate: null,
        index: 2,
        wbs: '03',
    }
];
export let CR886052: object[] = [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
            {
                TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 2,
                Predecessor: '2', Progress: 30
            },
        ]
    },
    {
        TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
        Indicators: [
            {
                'date': new Date('04/10/2019'),
                'name': 'Design Phase',
                'tooltip': 'Design phase completed',
                'iconClass': 'okIcon e-icons'
            },
            {
                'date': new Date('04/15/2019'),
                'name': 'Design change',
                'tooltip': 'Design phase load',
                'iconClass': 'okIcon e-icons'
            }
        ]
    },
    {
        TaskID: 6,
        TaskName: 'Market research',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 7,
                TaskName: 'Demand analysis',
                StartDate: new Date('04/04/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4,
                        Predecessor: '5', Progress: 30
                    },
                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5' }
                ]
            },
            {
                TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'), Duration: 4,
                Predecessor: '7, 8', Progress: 30
            },
            { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '9' },
            {
                TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: '10',
                Indicators: [
                    {
                        'date': new Date('04/27/2019'),
                        'name': 'Research completed',
                        'tooltip': 'Research completed',
                        'iconClass': 'description e-icons'
                    }
                ]
            }
        ]
    }
]
export let MT889303: Object[] = [
    { TaskID: 1, TaskName: 'Defining the product'},
    { TaskID: 2, TaskName: 'Defining the product  and its usage'}
];
export let MT887459 : Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
        ]
    }
]
export let resourceResourcesUndo: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];
export let milestoneTemplate: Object[]=  [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product and its usage',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'),
              Duration: 3, Progress: 30, resources: [2],EmailId:'RoseFuller@gmail.com',resourcesImage:'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'},
            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'),
              Duration: 3, resources: [3],EmailId:'MargaretBuchanan@gmail.com',resourcesImage: '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'},
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'),
              Duration: 2, Predecessor: '2', Progress: 30, resources: [4] ,EmailId:'FullerKing@gmail.com',resourcesImage:'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'}]
        },
        {
            TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4', resources: [1],EmailId:'MartinTamer@gmail.com',resourcesImage:'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'}]

export let treeData: Object[] = [
    {
        taskId: 43,
        propertyId: 1000,
        blockId: 1,
        floorId: 41,
        siteDrawingTypeId: 1,
        isTask: null,
        isMileStone: null,
        modelActivityId: 3,
        modelActivityName: 'CIS walls casting',
        parentId: 35,
        taskName: 'CIS walls casting',
        startDate: '2022-05-17T00:00:00',
        endDate: '2022-06-08T00:00:00',
        propertyModelActivityId: 44,
        predecessor: '22fs-10days,34',
        actualStartDate: '2022-04-30T00:00:00',
        actualEndDate: '2022-05-18T00:00:00',
        notes: null,
        displayPredecessor: '22fs-10days,34',
        basePlanStartDate: '17/05/2022 (IST)',
        basePlanEndDate: '08/06/2022 (IST)',
        revisionNo: null,
        subTasks: [],
        actualDuration: '19 days',
        id: 20,
    },
    {
        taskId: 22,
        propertyId: 1000,
        blockId: 1,
        floorId: 42,
        siteDrawingTypeId: 1,
        isTask: null,
        isMileStone: null,
        modelActivityId: null,
        modelActivityName: null,
        parentId: 3,
        taskName: 'Level-B06',
        startDate: null,
        endDate: null,
        propertyModelActivityId: 23,
        predecessor: null,
        actualStartDate: '2022-02-17T00:00:00',
        actualEndDate: '2022-05-31T00:00:00',
        notes: null,
        displayPredecessor: null,
        basePlanStartDate: '',
        basePlanEndDate: '',
        revisionNo: null,
        subTasks: [
            {
                taskId: 30,
                propertyId: 1000,
                blockId: 1,
                floorId: 42,
                siteDrawingTypeId: 1,
                isTask: null,
                isMileStone: null,
                modelActivityId: 3,
                modelActivityName: 'CIS walls casting',
                parentId: 22,
                taskName: 'CIS walls casting',
                startDate: '2022-02-02T00:00:00',
                endDate: '2022-04-15T00:00:00',
                propertyModelActivityId: 31,
                predecessor: null,
                actualStartDate: '2022-03-09T00:00:00',
                actualEndDate: '2022-04-18T00:00:00',
                notes: null,
                displayPredecessor: null,
                basePlanStartDate: '02/02/2022 (IST)',
                basePlanEndDate: '15/04/2022 (IST)',
                revisionNo: null,
                subTasks: [],
                actualDuration: '41 days',
                id: 11,
            },
            {
                taskId: 31,
                propertyId: 1000,
                blockId: 1,
                floorId: 42,
                siteDrawingTypeId: 1,
                isTask: null,
                isMileStone: null,
                modelActivityId: 4,
                modelActivityName: 'CIS Column casting',
                parentId: 22,
                taskName: 'CIS Column casting',
                startDate: '2022-03-16T00:00:00',
                endDate: '2022-04-15T00:00:00',
                propertyModelActivityId: 32,
                predecessor: null,
                actualStartDate: '2022-02-17T00:00:00',
                actualEndDate: '2022-04-18T00:00:00',
                notes: null,
                displayPredecessor: null,
                basePlanStartDate: '16/03/2022 (IST)',
                basePlanEndDate: '15/04/2022 (IST)',
                revisionNo: null,
                subTasks: [],
                actualDuration: '61 days',
                id: 12,
            },
            {
                taskId: 32,
                propertyId: 1000,
                blockId: 1,
                floorId: 42,
                siteDrawingTypeId: 1,
                isTask: null,
                isMileStone: null,
                modelActivityId: 5,
                modelActivityName: 'Precast Beams & HCS/SS Erection',
                parentId: 22,
                taskName: 'Precast Beams & HCS/SS Erection',
                startDate: '2022-03-29T00:00:00',
                endDate: '2022-05-11T00:00:00',
                propertyModelActivityId: 33,
                predecessor: null,
                actualStartDate: '2022-03-11T00:00:00',
                actualEndDate: '2022-05-31T00:00:00',
                notes: null,
                displayPredecessor: null,
                basePlanStartDate: '29/03/2022 (IST)',
                basePlanEndDate: '11/05/2022 (IST)',
                revisionNo: null,
                subTasks: [],
                actualDuration: '82 days',
                id: 13,
            },
            {
                taskId: 34,
                propertyId: 1000,
                blockId: 1,
                floorId: 42,
                siteDrawingTypeId: 1,
                isTask: null,
                isMileStone: null,
                modelActivityId: 7,
                modelActivityName: 'Topping and Slab Casting',
                parentId: 22,
                taskName: 'Topping and Slab Casting',
                startDate: '2022-04-19T00:00:00',
                endDate: '2022-05-16T00:00:00',
                propertyModelActivityId: 35,
                predecessor: null,
                actualStartDate: '2022-04-12T00:00:00',
                actualEndDate: '2022-04-28T00:00:00',
                notes: null,
                displayPredecessor: null,
                basePlanStartDate: '19/04/2022 (IST)',
                basePlanEndDate: '16/05/2022 (IST)',
                revisionNo: null,
                subTasks: [],
                actualDuration: '17 days',
                id: 14,
            },
        ],
        actualDuration: '104 days',
        id: 10,
    }
]
export let cR893051: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Product Concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            {
                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ]
            },
            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
        ]
    }
]
            
            
export let resourcesDatas1: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
            },
            {
                TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
            },
            {
                TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
            },
        ]
    }
];
                
export let resourceCollections1: object[] = [
    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'}
];

export let unscheduledData1: object[] = [
    {
        TaskId: 1, TaskName: 'Task 1', TaskType: '',child :[
            {
                TaskId: 2, TaskName: 'Task 2',  TaskType: ''
            },
        ]
    },
];
export let projectSplitTask: object[] =  [
    {
           TaskID: 1,
           TaskName: 'Project Initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
           subtasks: [
               { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50,
               Segments: [
                   { StartDate: new Date("04/02/2019"), Duration: 2 },
                   { StartDate: new Date("04/04/2019"), Duration: 2 }
                 ] },
               { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
               { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4 , Progress: 50 },
           ]
       },
       {
           TaskID: 5,
           TaskName: 'Project Estimation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
           subtasks: [
               { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
               { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
               { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
           ]
       }
];
export let datapdf : object[] = [
    {
      displayID: "MS-740602557",
      id: 1,
      name: "66",
      progress: "33.000000000",
      assignee: "",
      assigneeDisplay: "",
      status: "true",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693725"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Milestones\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Milestone",
      cssClass: "gantt-chart-milestone",
      pageContext: "D_ProjectMilestones_pa174191632809755pz.pxResults(1)",
      startDate: "2024-05-01T07:12:00.000Z",
      endDate: "2024-06-30T07:12:00.000Z",
    },
    {
      displayID: "MS-740686510",
      id: 2,
      name: "test",
      progress: "33.000000000",
      assignee: "",
      assigneeDisplay: "",
      status: "false",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693733"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Milestones\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Milestone",
      cssClass: "gantt-chart-milestone",
      pageContext: "D_ProjectMilestones_pa174191632809755pz.pxResults(2)",
      startDate: "2024-05-01T07:12:00.000Z",
      endDate: "2024-06-30T07:12:00.000Z",
    },
    {
      displayID: "MS-740602542",
      id: 3,
      name: "tr",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      status: "false",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693738"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Milestones\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Milestone",
      cssClass: "gantt-chart-milestone",
      pageContext: "D_ProjectMilestones_pa174191632809755pz.pxResults(3)",
      startDate: "2024-05-01T07:12:00.000Z",
      endDate: "2024-06-30T07:12:00.000Z",
    },
    {
      displayID: "DL-456",
      id: 4,
      name: "5656",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      status: "true",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693789"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Deliverables\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Deliverable",
      cssClass: "gantt-chart-deliverable",
      pageContext:
        "D_GetCharterDeliverablesByProject_pa174195541371649pz.pxResults(1)",
      parentID: 1,
      parentDisplayID: "MS-740602557",
    },
    {
      displayID: "DL-450",
      id: 5,
      name: "test",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      status: "false",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693793"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Deliverables\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Deliverable",
      cssClass: "gantt-chart-deliverable",
      pageContext:
        "D_GetCharterDeliverablesByProject_pa174195541371649pz.pxResults(2)",
      parentID: 2,
      parentDisplayID: "MS-740686510",
    },
    {
      displayID: "DL-451",
      id: 6,
      name: "test 2",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693796"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Deliverables\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Deliverable",
      cssClass: "gantt-chart-deliverable",
      pageContext:
        "D_GetCharterDeliverablesByProject_pa174195541371649pz.pxResults(3)",
      parentID: 2,
      parentDisplayID: "MS-740686510",
    },
    {
      displayID: "DL-391",
      id: 7,
      name: "ddd",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      status: "false",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693798"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Deliverables\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Deliverable",
      cssClass: "gantt-chart-deliverable",
      pageContext:
        "D_GetCharterDeliverablesByProject_pa174195541371649pz.pxResults(4)",
      parentID: 3,
      parentDisplayID: "MS-740602542",
    },
    {
      displayID: "DL-392",
      id: 8,
      name: "tr",
      progress: null,
      assignee: "",
      assigneeDisplay: "",
      status: "false",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION ADEO-TASKMANA-DATA HEADERSTATUS #20240522T072852.868 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="ADEO-TaskMana-Data" readonly="false" expandrl="" uniqueid="SID1718905693800"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'className\':\'ADEO-TaskMana-Data-Deliverables\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Not Completed</span></div></div></div></div></div>',
      Type: "Deliverable",
      cssClass: "gantt-chart-deliverable",
      pageContext:
        "D_GetCharterDeliverablesByProject_pa174195541371649pz.pxResults(5)",
      parentID: 3,
      parentDisplayID: "MS-740602542",
    },
    {
      displayID: "T-1335",
      id: 9,
      insKey: "WORK-COVER-TASK T-1335",
      name: "Task test 2",
      progress: "0",
      assignee: "Mohammed Rasheed<mruddin@ecouncil.ae>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905693821"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(1)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(1)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905693824"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="60e1050f-1d4d-49d7-be22-c0e61ace0634" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>        <link rel="stylesheet" type="text/css" href="webwb/py-avatar_11622621979.css!!.css"> <button tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" class="icons avatar name-m " style="width:30px;height:30px;" type="button" title="Mohammed Rasheed"> <svg viewBox="0 0 100 100" pointer-events="none" xmlns="http://www.w3.org/2000/svg" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(1)WithoutImage"> <circle cx="50" cy="50" r="50" fill="purple"></circle> <circle cx="15" cy="85" r="14" id="operatorWithoutImage" class="operatorWithoutImage awayoperatorstatus"></circle> <text x="50%" y="65%" transform="scale(1, 1)" text-anchor="middle" fill="white" font-size="42">MR</text> </svg> </button>    </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Mohammed Rasheed </a></div></div></div></div></div>',
      status: "In-Progress",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905693893"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(6)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-warn centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">In-Progress</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(1)",
      parentID: 5,
      parentDisplayID: "DL-450",
      startDate: "2024-05-17T08:40:00.000Z",
      endDate: "2024-05-18T08:40:00.000Z",
    },
    {
      displayID: "T-2045",
      id: 10,
      insKey: "WORK-COVER-TASK T-2045",
      name: "test",
      progress: "0",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905693917"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(2)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(2)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905693920"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="983d0632-164d-47eb-85f9-39ec35a93b13" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(2)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "Open",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905693967"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Open</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(2)",
      startDate: "2024-06-20T16:32:00.000Z",
      endDate: "2024-06-21T16:32:00.000Z",
    },
    {
      displayID: "T-1295",
      id: 11,
      insKey: "WORK-COVER-TASK T-1295",
      name: "TTT dd ssss asdas asd asda",
      progress: "100",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905693985"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(3)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(3)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905693989"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="72c927c8-1349-4b4d-b744-dc95e998836c" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(3)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694040"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(3)",
      parentID: 6,
      parentDisplayID: "DL-451",
      startDate: "2024-05-31T08:18:00.000Z",
      endDate: "2024-06-30T08:18:00.000Z",
      dependency: "12FF",
    },
    {
      displayID: "T-1353",
      id: 13,
      insKey: "WORK-COVER-TASK T-1353",
      name: "Task",
      progress: "0",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694088"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(4)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(4)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694092"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="164bfaad-a954-4a2d-9f6c-2dab39e85698" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(4)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "On-Hold",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694145"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(3)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-bad centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">On-Hold</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(4)",
      parentID: 5,
      parentDisplayID: "DL-450",
      startDate: "2024-05-20T10:04:00.000Z",
      endDate: "2024-05-21T10:04:00.000Z",
    },
    {
      displayID: "T-1299",
      id: 14,
      insKey: "WORK-COVER-TASK T-1299",
      name: "Parent Task",
      progress: "0",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694161"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(5)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(5)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694164"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="fab03d25-1d5c-41ae-b3b6-b1516d2f3722" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(5)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "In-Progress",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694210"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(6)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-warn centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">In-Progress</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(5)",
      startDate: "2024-05-09T09:09:00.000Z",
      endDate: "2024-05-23T09:08:00.000Z",
      dependency: "11FF,14FF,12FF",
    },
    {
      displayID: "T-1618",
      id: 15,
      insKey: "WORK-COVER-TASK T-1618",
      name: "test",
      progress: "0",
      assignee: "saravana<saravana>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694278"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(6)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(6)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694281"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="5109a531-e724-4156-b12d-125a64101199" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="saravana" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="saravana" alt="Show User Profile" src="../datacontent/Image/operatorimages/saravana.jpg?20240418T080500.990 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage awayoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(6)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> saravana </a></div></div></div></div></div>',
      status: "On-Hold",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694326"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(3)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-bad centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">On-Hold</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(6)",
      parentID: 9,
      parentDisplayID: "T-1335",
      startDate: "2024-06-04T07:08:00.000Z",
      endDate: "2024-06-05T07:08:00.000Z",
    },
    {
      displayID: "T-1327",
      id: 16,
      insKey: "WORK-COVER-TASK T-1327",
      name: "ss",
      progress: "0",
      assignee: "Mohammed Rasheed<mruddin@ecouncil.ae>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694343"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(7)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(7)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694345"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="24483c64-49a4-47ea-961d-de1995453cf8" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>        <link rel="stylesheet" type="text/css" href="webwb/py-avatar_11622621979.css!!.css"> <button tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" class="icons avatar name-m " style="width:30px;height:30px;" type="button" title="Mohammed Rasheed"> <svg viewBox="0 0 100 100" pointer-events="none" xmlns="http://www.w3.org/2000/svg" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(7)WithoutImage"> <circle cx="50" cy="50" r="50" fill="purple"></circle> <circle cx="15" cy="85" r="14" id="operatorWithoutImage" class="operatorWithoutImage awayoperatorstatus"></circle> <text x="50%" y="65%" transform="scale(1, 1)" text-anchor="middle" fill="white" font-size="42">MR</text> </svg> </button>    </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Mohammed Rasheed </a></div></div></div></div></div>',
      status: "Open",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694389"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Open</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(7)",
      parentID: 14,
      parentDisplayID: "T-1299",
      startDate: "2024-05-17T06:29:00.000Z",
      endDate: "2024-05-01T06:29:00.000Z",
    },
    {
      displayID: "T-1317",
      id: 17,
      insKey: "WORK-COVER-TASK T-1317",
      name: "sss",
      progress: "100",
      assignee: "saravana<saravana>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694406"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(8)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(8)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694410"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="b8d80006-f258-4603-9f83-17c6c85289ac" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="saravana" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="saravana" alt="Show User Profile" src="../datacontent/Image/operatorimages/saravana.jpg?20240418T080500.990 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage awayoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(8)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> saravana </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694467"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(8)",
      parentID: 11,
      parentDisplayID: "T-1295",
      startDate: "2024-05-15T12:00:00.000Z",
      endDate: "2024-05-16T12:00:00.000Z",
    },
    {
      displayID: "T-1349",
      id: 18,
      insKey: "WORK-COVER-TASK T-1349",
      name: "Task",
      progress: "0",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694486"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(9)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(9)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694490"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="4449c8d0-61fd-4559-ac7f-4b96f3d29133" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(9)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "In-Progress",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694541"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(6)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-warn centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">In-Progress</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(9)",
      parentID: 4,
      parentDisplayID: "DL-456",
      startDate: "2024-05-20T06:59:00.000Z",
      endDate: "2024-05-21T06:59:00.000Z",
      dependency: "19FF,16FF",
    },
    {
      displayID: "T-1302",
      id: 12,
      insKey: "WORK-COVER-TASK T-1302",
      name: "ss",
      progress: "0",
      assignee: "saravana<saravana>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694611"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(10)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(10)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694615"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="c9a3a0d9-f79f-444f-95cb-0911ec45a5c5" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="saravana" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="saravana" alt="Show User Profile" src="../datacontent/Image/operatorimages/saravana.jpg?20240418T080500.990 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage awayoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(10)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> saravana </a></div></div></div></div></div>',
      status: "On-Hold",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694658"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(3)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-bad centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">On-Hold</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(10)",
      parentID: 14,
      parentDisplayID: "T-1299",
      startDate: "2024-05-15T10:29:00.000Z",
      endDate: "2024-05-16T10:29:00.000Z",
    },
    {
      displayID: "T-1323",
      id: 19,
      insKey: "WORK-COVER-TASK T-1323",
      name: "asdasdas",
      progress: "0",
      assignee: "saravana<saravana>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694675"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(11)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(11)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694678"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="11f1ddf8-cfc0-4b0e-aae9-41039bf7dfb2" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="saravana" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="saravana" alt="Show User Profile" src="../datacontent/Image/operatorimages/saravana.jpg?20240418T080500.990 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage awayoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(11)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> saravana </a></div></div></div></div></div>',
      status: "Open",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694721"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Open</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(11)",
      parentID: 20,
      parentDisplayID: "T-1316",
      startDate: "2024-05-16T12:17:00.000Z",
      endDate: "2024-05-17T12:17:00.000Z",
    },
    {
      displayID: "T-1329",
      id: 21,
      insKey: "WORK-COVER-TASK T-1329",
      name: "Taskd d d",
      progress: "0",
      assignee: "Mohammed Rasheed<mruddin@ecouncil.ae>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694738"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(12)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(12)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694741"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="53c33743-7053-445a-8b98-a34aa9e0f1ae" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>        <link rel="stylesheet" type="text/css" href="webwb/py-avatar_11622621979.css!!.css"> <button tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" class="icons avatar name-m " style="width:30px;height:30px;" type="button" title="Mohammed Rasheed"> <svg viewBox="0 0 100 100" pointer-events="none" xmlns="http://www.w3.org/2000/svg" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(12)WithoutImage"> <circle cx="50" cy="50" r="50" fill="purple"></circle> <circle cx="15" cy="85" r="14" id="operatorWithoutImage" class="operatorWithoutImage awayoperatorstatus"></circle> <text x="50%" y="65%" transform="scale(1, 1)" text-anchor="middle" fill="white" font-size="42">MR</text> </svg> </button>    </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Mohammed Rasheed </a></div></div></div></div></div>',
      status: "In-Progress",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694784"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(6)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-warn centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">In-Progress</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(12)",
      parentID: 4,
      parentDisplayID: "DL-456",
      startDate: "2024-05-17T08:29:00.000Z",
      endDate: "2024-05-18T08:29:00.000Z",
      dependency: "20FF,22FF",
    },
    {
      displayID: "T-1420",
      id: 23,
      insKey: "WORK-COVER-TASK T-1420",
      name: "asda",
      progress: "0",
      assignee: "Mohammed Rasheed<mruddin@ecouncil.ae>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694854"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(13)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(13)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694858"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="c2300035-8de5-428d-9c64-8de6e73866d9" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>        <link rel="stylesheet" type="text/css" href="webwb/py-avatar_11622621979.css!!.css"> <button tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" class="icons avatar name-m " style="width:30px;height:30px;" type="button" title="Mohammed Rasheed"> <svg viewBox="0 0 100 100" pointer-events="none" xmlns="http://www.w3.org/2000/svg" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(13)WithoutImage"> <circle cx="50" cy="50" r="50" fill="purple"></circle> <circle cx="15" cy="85" r="14" id="operatorWithoutImage" class="operatorWithoutImage awayoperatorstatus"></circle> <text x="50%" y="65%" transform="scale(1, 1)" text-anchor="middle" fill="white" font-size="42">MR</text> </svg> </button>    </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Mohammed Rasheed </a></div></div></div></div></div>',
      status: "On-Hold",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694909"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(3)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-bad centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">On-Hold</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(13)",
      startDate: "2024-05-21T12:06:00.000Z",
      endDate: "2024-05-22T12:06:00.000Z",
    },
    {
      displayID: "T-1351",
      id: 24,
      insKey: "WORK-COVER-TASK T-1351",
      name: "Task",
      progress: "100",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694927"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(14)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(14)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905694931"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="90374200-727e-4180-9d36-c896502fb487" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(14)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694975"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(14)",
      startDate: "2024-05-20T07:02:00.000Z",
      endDate: "2024-05-21T07:02:00.000Z",
    },
    {
      displayID: "T-1324",
      id: 22,
      insKey: "WORK-COVER-TASK T-1324",
      name: "asdasdasd",
      progress: "100",
      assignee: "saravana<saravana>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905694999"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(15)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(15)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905695002"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="06667fd3-a50e-4e77-8e1b-938aff5e1972" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="saravana" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="saravana" alt="Show User Profile" src="../datacontent/Image/operatorimages/saravana.jpg?20240418T080500.990 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage awayoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(15)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> saravana </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695048"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(15)",
      parentID: 20,
      parentDisplayID: "T-1316",
      startDate: "2024-05-16T12:17:00.000Z",
      endDate: "2024-05-17T12:17:00.000Z",
    },
    {
      displayID: "T-1325",
      id: 25,
      insKey: "WORK-COVER-TASK T-1325",
      name: "dddd",
      progress: "100",
      assignee: "Mohammed Rasheed<mruddin@ecouncil.ae>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695072"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(16)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(16)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905695075"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="5cd30e5a-703a-4c47-9f1d-3402fea9b7e0" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>        <link rel="stylesheet" type="text/css" href="webwb/py-avatar_11622621979.css!!.css"> <button tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" class="icons avatar name-m " style="width:30px;height:30px;" type="button" title="Mohammed Rasheed"> <svg viewBox="0 0 100 100" pointer-events="none" xmlns="http://www.w3.org/2000/svg" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(16)WithoutImage"> <circle cx="50" cy="50" r="50" fill="purple"></circle> <circle cx="15" cy="85" r="14" id="operatorWithoutImage" class="operatorWithoutImage awayoperatorstatus"></circle> <text x="50%" y="65%" transform="scale(1, 1)" text-anchor="middle" fill="white" font-size="42">MR</text> </svg> </button>    </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Mohammed Rasheed </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695125"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(16)",
      parentID: 20,
      parentDisplayID: "T-1316",
      startDate: "2024-05-16T12:18:00.000Z",
      endDate: "2024-05-17T12:18:00.000Z",
    },
    {
      displayID: "T-1354",
      id: 26,
      insKey: "WORK-COVER-TASK T-1354",
      name: "Space 12",
      progress: "100",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695150"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(17)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(17)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905695153"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="524ca3db-ff7f-45ec-8d78-a56d4c93847d" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(17)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "Resolved-Completed",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695208"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(4)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-good centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Completed</span></div></div></div></div></div>',
      Type: "Task",
      cssClass: "gantt-chart-task",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(17)",
      parentID: 4,
      parentDisplayID: "DL-456",
      startDate: "2024-05-21T10:11:00.000Z",
      endDate: "2024-05-21T10:10:00.000Z",
    },
    {
      displayID: "T-1316",
      id: 20,
      insKey: "WORK-COVER-TASK T-1316",
      name: "Subtask 1",
      progress: "0",
      assignee: "Arjun Avvaru<arjun>",
      assigneeDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'OperatorNameIconGanttChart\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK OPERATORNAMEICONGANTTCHART #20240522T070030.947 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="OperatorNameIconGanttChart" data-node-id="OperatorNameIconGanttChart" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695223"><div class="layout layout-none has-action "><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  pointer has-action layout-content-inline_middle content-inline_middle flex-nowrap" data-click="[[&quot;runDataTransform&quot;, [&quot;SetSelectedOperatorGanttChart&quot;, &quot;=&quot;, &quot;D_GetAllTasksEditable_pa174195602257549pz.pxResults(18)&quot;,&quot;:event&quot;]],[&quot;processAction&quot;, [&quot;OperatorMiniProfile&quot;,&quot;overlay&quot;,&quot;:event&quot;,&quot;&quot;,&quot;Rule-HTML-Section&quot;,&quot;&quot;,&quot;pzModalTemplate&quot;,&quot;%7B%22mobile%22%3A%7B%22reveal%22%3A%7B%22effect%22%3A%22anim-null%22%7D%2C%22isCustomDismiss%22%3A%22true%22%2C%22dismiss%22%3A%7B%22effect%22%3A%22anim-null%22%7D%7D%7D&quot;,&quot;true&quot;,&quot;Work-Cover-Task&quot;,&quot;Work-Cover-Task&quot;,&quot;false&quot;,&quot;false&quot;,&quot;&quot;,&quot;&quot;]]]"><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxOperatorImage\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-left-spacing remove-right-spacing    padding-r-0_5x dataValueWrite flex flex-row " string_type="field" reserve_space="false">   <link rel="stylesheet" type="text/css" href="webwb/pyoperatorpresencecolors_12077391659.css!!.css">   <div id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(18)"> <div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'pzOperatorPresence\',\'insKey\':\'RULE-HTML-SECTION @BASECLASS PZOPERATORPRESENCE #20180713T134456.561 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="pzOperatorPresence" data-node-id="pzOperatorPresence" version="1" objclass="Rule-HTML-Section" pyclassname="@baseclass" readonly="false" expandrl="" uniqueid="SID1718905695226"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-subscription-id="0987bfcd-8aaf-4b3a-b815-8512bb2118a7" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-default " data-message="[[&quot;runScript&quot;, [&quot;OperatorPresenceCallback(event)&quot;]]]"></div></div></div></div> </div>      <div class="operatorWithImageParentDiv"> <img tabindex="-1" data-ctl="non-auto" data-test-id="px-opr-image-ctrl" data-name="Arjun Avvaru" class="custom_UserImage operatorImage" style="width:30px;height:30px;" title="Arjun Avvaru" alt="Show User Profile" src="../datacontent/Image/operatorimages/arjun.png?20240612T151304.508 GMT" onerror="this.onerror=null;this.src=\'./desktopimages/pzdefaultUserPic.png\';this.style.backgroundColor=\'white\';"> <div class="operatorWithImage activeoperatorstatus" id="D_GetAllTasksEditable_pa174195602257549pz.pxResults(18)WithImage"></div> </div>   </div><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'OperatorNameLink\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(2)\'}" class="content-item content-field item-2 remove-left-spacing remove-right-spacing   dataValueRead flex flex-row " string_type="field" reserve_space="false"> <a> Arjun Avvaru </a></div></div></div></div></div>',
      status: "Open",
      statusDisplay:
        '<div data-ui-meta="{\'type\':\'Section\',\'ruleName\':\'HeaderStatus\',\'insKey\':\'RULE-HTML-SECTION WORK-COVER-TASK HEADERSTATUS #20240423T105918.368 GMT\',\'sectionType\':\'standard\'}" class="sectionDivStyle  " style="" id="RULE_KEY" node_type="MAIN_RULE" node_name="HeaderStatus" data-node-id="HeaderStatus" version="1" objclass="Rule-HTML-Section" pyclassname="Work-Cover-Task" readonly="false" expandrl="" uniqueid="SID1718905695273"><div class="layout layout-none"><div section_index="1" class=" layout-body clearfix"><div bsimplelayout="true" data-ui-meta="{\'type\':\'Layout\',\'subType\':\'DYNAMICLAYOUT\',\'pgRef\':\'.pySections(1)\'}" class="flex  content  layout-content-inline_middle content-inline_middle "><div style="" data-ui-meta="{\'type\':\'Cell\',\'subType\':\'pxDisplayText\',\'clipboardPath\':\'.pyStatusWork\',\'className\':\'Work-Cover-Task\',\'pgRef\':\'.pySections(1).pySectionBody(1).pyTable.pyRows(1).pyCells(1)\'}" class="content-item content-field item-1 remove-all-spacing   badge-bg-old centered dataValueRead flex flex-row " string_type="field" reserve_space="false"><span data-test-id="2016083016191602341167946" class="badge_text">Open</span></div></div></div></div></div>',
      Type: "Subtask",
      cssClass: "gantt-chart-subtask",
      pageContext: "D_GetAllTasksEditable_pa174195602257549pz.pxResults(18)",
      parentID: 14,
      parentDisplayID: "T-1299",
      startDate: "2024-05-15T11:37:00.000Z",
      endDate: "2024-05-16T11:37:00.000Z",
      dependency: "14FF,20FF",
    },
  ];
