/**
 * Gantt predecessor base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Gantt, DurationUnit, Selection, Toolbar, DayMarkers, Edit, Filter, ContextMenu } from '../../src/index';
import { destroyGantt, createGantt, triggerMouseEvent } from './gantt-util.spec';
import { ContextMenuClickEventArgs} from './../../src/gantt/base/interface';
let columnTemplateData: Object[] = [
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
let predData1: Object[] = [
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
let predData2: Object[] = [
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
let predData3: Object[] = [
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
let predData4: Object[] = [
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
let predData5: Object[] = [
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
let predData6: Object[] = [
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
let predData7: Object[] = [
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
let predData8: Object[] = [
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
describe('Gantt Predecessor Module', () => {

    describe('Gantt string predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done) => {
            ganttObj = createGantt(
                {
                    dataSource: columnTemplateData,
                    durationUnit: "Day",
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                        dependency: 'Predecessor'
                    },
                    projectStartDate: new Date('02/02/2017'),
                    projectEndDate: new Date('03/20/2018'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('control initialization with predecessor', () => {
            expect(ganttObj.taskFields.dependency).toBe('Predecessor');
        });
        it('Gantt object predecessor - testing', (done) => {
            ganttObj.taskFields.dependency = 'predObj';
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Predecessor type testing', (done) => {
            ganttObj.taskFields.dependency = 'Predecessor';
            ganttObj.dataSource = predData1;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Own parent as Predecessor (string) - testing', (done) => {
            ganttObj.dataSource = predData2;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Own parent as Predecessor (object) - testing', (done) => {
            ganttObj.dataSource = predData3;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Predecessor id without type - testing', (done) => {
            ganttObj.dataSource = predData4;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Invalid Predecessor type - testing', (done) => {
            ganttObj.dataSource = predData5;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Invalid Predecessor ID - not in datasource - testing', (done) => {
            ganttObj.dataSource = predData6;
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Duration unit with hour - testing', (done) => {
            ganttObj.dataSource = predData8;
            ganttObj.durationUnit = 'Hour';
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
        it('Duration unit with minute - testing', (done) => {
            ganttObj.dataSource = predData8;
            ganttObj.durationUnit = 'Minute';
            ganttObj.dataBound = () => {
                done();
            };
            ganttObj.refresh();
        });
    });
});
describe('Parent predecessor for unscheduled task', () => {
        let ganttObj: Gantt;
        let editingData = [
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
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
                    dateFormat: 'MMM dd, y',
                    allowUnscheduledTasks: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        notes: 'info',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                    allowSelection: true,
                    gridLines: 'Both',
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'MMM dd, y',
                        },
                        bottomTier: {
                            unit: 'Day',
                        },
                    },
                    columns: [
                        { field: 'TaskID', width: 80 },
                        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                        { field: 'Progress' },
                        { field: 'Predecessor' }
                    ],
                    eventMarkers: [
                        { day: '4/17/2019', label: 'Project approval and kick-off' },
                        { day: '5/3/2019', label: 'Foundation inspection' },
                        { day: '6/7/2019', label: 'Site manager inspection' },
                        { day: '7/16/2019', label: 'Property handover and sign-off' },
                    ],
                    labelSettings: {
                        leftLabel: 'TaskName',
                        rightLabel: 'resources'
                    },
                    editDialogFields: [
                        { type: 'General', headerText: 'General' },
                        { type: 'Dependency' },
                        { type: 'Resources' },
                        { type: 'Notes' },
                    ],
                    splitterSettings: {
                        columnIndex: 2
                    },
                }, done);
        });
        it('Render unscheduled task ', () => {
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyy')).toBe(null);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
 describe('Parent predecessor for unscheduled task', () => {
        let ganttObj: Gantt;
        let editingData = [
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
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
                    dateFormat: 'MMM dd, y',
                    allowUnscheduledTasks: true,
                    allowParentDependency: false,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        notes: 'info',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                    allowSelection: true,
                    gridLines: 'Both',
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'MMM dd, y',
                        },
                        bottomTier: {
                            unit: 'Day',
                        },
                    },
                    columns: [
                        { field: 'TaskID', width: 80 },
                        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                        { field: 'Progress' },
                        { field: 'Predecessor' }
                    ],
                    eventMarkers: [
                        { day: '4/17/2019', label: 'Project approval and kick-off' },
                        { day: '5/3/2019', label: 'Foundation inspection' },
                        { day: '6/7/2019', label: 'Site manager inspection' },
                        { day: '7/16/2019', label: 'Property handover and sign-off' },
                    ],
                    labelSettings: {
                        leftLabel: 'TaskName',
                        rightLabel: 'resources'
                    },
                    editDialogFields: [
                        { type: 'General', headerText: 'General' },
                        { type: 'Dependency' },
                        { type: 'Resources' },
                        { type: 'Notes' },
                    ],
                    splitterSettings: {
                        columnIndex: 2
                    },
                }, done);
        });
        it('dynamically change parent Predecessor API ', () => {
            expect(ganttObj.currentViewData[2]['Predecessor']).toBe(null);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
describe('Child Records rendered in incorrect dates', () => {
    let ganttObj: Gantt;
    let data = [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/06/2019'),
        },
        {
            TaskID: 2,
            TaskName: 'Identify Site location',
            StartDate: new Date('04/02/2019'),
            Duration: 4,
            Progress: 50,
            ParentId: 1,
        },
        {
            TaskID: 3,
            StartDate: new Date('04/08/2019'),
            TaskName: 'Project Estimation',
            Dependency: '1FS',
        },
        {
            TaskID: 4,
            TaskName: 'Develop floor plan for estimation',
            StartDate: new Date('04/08/2019'),
            Duration: 2,
            Progress: 50,
            ParentId: 3,
        },
        {
            TaskID: 5,
            TaskName: 'Develop floor plan for estimation',
            StartDate: new Date('04/12/2019'),
            Duration: 4,
            Progress: 50,
            ParentId: 3,
        },

    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Dependency',
                    parentID: 'ParentId',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
            }, done);
    });
    it('Child Record date', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/12/2019');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('GUID predecessor', () => {
    let ganttObj: Gantt;
    let data = [
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
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('07/06/2019'),
            }, done);
    });
    it('Check predecessor length', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(2);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Predecessor does not render propely for FF type', () => {
    let ganttObj: Gantt;
    let editingData = [
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
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/06/2019'),
            }, done);
    });
    it('FF type', () => {
        expect(document.getElementsByClassName('e-connector-line-arrow')[0].getAttribute('d')).toBe('M 595 420 L 587 415 L 587 424 Z');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Bug -855406 -Dependency line not render after adding child record ', () => {
    let ganttObj: Gantt;
    let editingData = [
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
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    allowAdding: true,
                },
                toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Check the parent predecessor to be present', () => {
        let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
        triggerMouseEvent(add, 'click');
        let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
        triggerMouseEvent(save, 'click');
        let add1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
        triggerMouseEvent(add1, 'click');
        let save1: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog').getElementsByClassName('e-primary')[0] as HTMLElement;
        triggerMouseEvent(save1, 'click');
        ganttObj.updatePredecessor(ganttObj.flatData[0].ganttProperties.taskId, '4FS');
        ganttObj.selectRow(0);
        let e: ContextMenuClickEventArgs = {
            item: { id: ganttObj.element.id + '_contextMenu_Child' },
            element: null,
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.currentViewData[0].ganttProperties.predecessor.length).toBe(1);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
