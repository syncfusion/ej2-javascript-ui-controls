import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter } from '../src/index';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter);
let projectNewData: Object[] = [
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

let gantt: Gantt = new Gantt({
    dataSource: projectNewData,
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

    editSettings: {
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
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
});

gantt.appendTo('#ganttContainer');