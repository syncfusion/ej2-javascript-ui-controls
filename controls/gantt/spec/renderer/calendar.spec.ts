/**
  * Gantt base spec
  */
import { Gantt, DayMarkers , Selection, Edit, PdfExport} from '../../src/index';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Calendar Setting', () => {
    describe('Checking the rendering of taskbar on load time', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Defining the product and its usage',
                                StartDate: new Date('03/31/2019'),
                                Duration: 3,
                                Progress: 30
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Defining target audience',
                                StartDate: new Date('04/05/2019'),
                                Duration: 3,
                                calendar: "task-calendar-1"
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Prepare product sketch and notes',
                                StartDate: new Date('04/10/2019'),
                                Duration: 3,
                                Progress: 30,
                                calendar: "task-calendar-1"
                            },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                calendarSettings: {
                    projectCalendar: {
                        workingTime: [
                            { from: 9, to: 13 },
                            { from: 14, to: 18 }
                        ],
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                            }
                        ],
                        exceptions: [
                            {
                                from: '03/31/2019',
                                to: '03/31/2019',
                                label: 'Extended Work Day'
                            },
                        ]
                    },
                    taskCalendars: [
                        {
                            calendarId: 'task-calendar-1',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Task-Specific Holiday',
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task-Specific Holiday2',
                                }

                            ],
                            exceptions: [
                                {
                                    from: '04/01/2019',
                                    to: '04/01/2019',
                                    label: 'Task Deadline Extension'
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task Deadline Extension2',
                                }
                            ]
                        }
                    ]
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Initial load ', () => {
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('3/31/2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Getting calendar using getCalendarById method', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Defining the product and its usage',
                                StartDate: new Date('03/31/2019'),
                                Duration: 3,
                                Progress: 30
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Defining target audience',
                                StartDate: new Date('04/05/2019'),
                                Duration: 3,
                                calendar: "task-calendar-1"
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Prepare product sketch and notes',
                                StartDate: new Date('04/10/2019'),
                                Duration: 3,
                                Progress: 30,
                                calendar: "task-calendar-1"
                            },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                calendarSettings: {
                    projectCalendar: {
                        workingTime: [
                            { from: 9, to: 13 },
                            { from: 14, to: 18 }
                        ],
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                            }
                        ],
                        exceptions: [
                            {
                                from: '03/31/2019',
                                to: '03/31/2019',
                                label: 'Extended Work Day'
                            },
                        ]
                    },
                    taskCalendars: [
                        {
                            calendarId: 'task-calendar-1',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Task-Specific Holiday',
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task-Specific Holiday2',
                                }

                            ],
                            exceptions: [
                                {
                                    from: '04/01/2019',
                                    to: '04/01/2019',
                                    label: 'Task Deadline Extension'
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task Deadline Extension2',
                                }
                            ]
                        }
                    ]
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Checking returned calendar', () => {
            expect(ganttObj.calendarModule.getCalendarById("invalid-calendar")['propName']).toBe('projectCalendar');
            expect(ganttObj.calendarModule.getCalendarById("task-calendar-1")['propName']).toBe('taskCalendars');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('coverage for getIndexByTaskBar method', () => {
        Gantt.Inject(DayMarkers, Selection, Edit, PdfExport);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 2,
                        TaskName: 'Defining the product and its usage',
                        StartDate: new Date('03/31/2019'),
                        Duration: 3,
                        Progress: 30
                    },
                    {
                        TaskID: 3,
                        TaskName: 'Defining target audience',
                        StartDate: new Date('04/05/2019'),
                        Duration: 3
                    },
                ],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Checking returned index', () => {
            ganttObj.pdfExportModule.helper.exportProps = {
                fitToWidthSettings: {
                    isFitToWidth: true,
                }
            }
            ganttObj.pdfExportModule.isPdfExport  = true;
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Testing ticket 66970 console error on dialog', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('03/29/2019'), Duration: 4, Progress: 30, calendar: 'planning-team-calendar' },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 6, calendar: 'testing'
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    },
                    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4", calendar: 'planning-team-calendar' },
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
                                calendar: 'testing-team-calendar',
                                subtasks: [
                                    { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30, calendar: 'planning-team-calendar' },
                                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                                ]
                            },
                            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30, calendar: 'testing-team-calendar' },
                            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9", calendar: 'planning-team-calendar' },
                            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date', editType: 'datetimepickeredit', format: 'M/d/yyyy hh:mm a' },
                    { field: 'EndDate', headerText: 'End Date', editType: 'datetimepickeredit', format: 'M/d/yyyy hh:mm a' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' },
                ],
                calendarSettings: {
                    projectCalendar: {
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                                cssClass: 'holiday-good-friday',
                            }
                        ],
                    },
                    taskCalendars: [
                        {
                            calendarId: 'planning-team-calendar',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/11/2019',
                                    label: 'Planning Team Meeting',
                                    cssClass: 'holiday-planning',
                                }
                            ],
                            exceptions: [
                                {
                                    from: '03/30/2019',
                                    to: '03/31/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        },
                        {
                            calendarId: 'testing',
                            exceptions: [
                                {
                                    from: '04/06/2019',
                                    to: '04/07/2019',
                                    label: 'Maintenance Window',
                                },
                                {
                                    from: '04/04/2019',
                                    to: '04/05/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        }
                    ]
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                highlightWeekends: true,
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
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(5);
        });
        it('Checking for empty start date', () => {
            expect(document.getElementById(ganttObj.element.id + 'StartDate')['value'] != "").toBe(true);
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Testing ticket 67120 placing the taskbar on project calendar holidays', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('03/29/2019'), Duration: 4, Progress: 30, calendar: 'planning-team-calendar' },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' },
                ],
                calendarSettings: {
                    projectCalendar: {
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                                cssClass: 'holiday-good-friday',
                            }
                        ],
                    },
                    taskCalendars: [
                        {
                            calendarId: 'planning-team-calendar',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Planning Team Meeting',
                                    cssClass: 'holiday-planning',
                                }
                            ],
                            exceptions: [
                                {
                                    from: '03/30/2019',
                                    to: '03/31/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        },
                        {
                            calendarId: 'testing',
                            exceptions: [
                                {
                                    from: '04/06/2019',
                                    to: '04/07/2019',
                                    label: 'Maintenance Window',
                                },
                                {
                                    from: '04/04/2019',
                                    to: '04/05/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        }
                    ]
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                gridLines: "Both",
                highlightWeekends: true,
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
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Checking startdate after cell editing', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
            input.value = new Date('04/05/2019');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/5/2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Testing ticket 67324 placing the default calendar taskbar on weekend', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('03/29/2019'), Duration: 4, Progress: 30, calendar: 'planning-team-calendar' },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 6, calendar: 'testing'
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' },
                ],
                calendarSettings: {
                    projectCalendar: {
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                                cssClass: 'holiday-good-friday',
                            }
                        ],
                    },
                    taskCalendars: [
                        {
                            calendarId: 'planning-team-calendar',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Planning Team Meeting',
                                    cssClass: 'holiday-planning',
                                }
                            ],
                            exceptions: [
                                {
                                    from: '03/30/2019',
                                    to: '03/31/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        },
                        {
                            calendarId: 'testing',
                            exceptions: [
                                {
                                    from: '04/06/2019',
                                    to: '04/07/2019',
                                    label: 'Maintenance Window',
                                },
                                {
                                    from: '04/04/2019',
                                    to: '04/05/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        }
                    ]
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                includeWeekend: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                gridLines: "Both",
                highlightWeekends: true,
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
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Checking startdate after cell editing', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
            input.value = new Date('04/06/2019');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[3].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/6/2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Editing EndDate to place on weekend-68426', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date', editType: 'datetimepickeredit', format: 'M/d/yyyy hh:mm a' },
                    { field: 'EndDate', headerText: 'End Date', editType: 'datetimepickeredit', format: 'M/d/yyyy hh:mm a' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' },
                ],
                calendarSettings: {
                    projectCalendar: {
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                                cssClass: 'holiday-good-friday',
                            }
                        ],
                    },
                    taskCalendars: [
                        {
                            calendarId: 'planning-team-calendar',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Planning Team Meeting',
                                    cssClass: 'holiday-planning',
                                }
                            ],
                            exceptions: [
                                {
                                    from: '03/30/2019',
                                    to: '03/31/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        },
                        {
                            calendarId: 'testing',
                            exceptions: [
                                {
                                    from: '04/06/2019',
                                    to: '04/07/2019',
                                    label: 'Maintenance Window',
                                },
                                {
                                    from: '04/04/2019',
                                    to: '04/05/2019',
                                    label: 'Maintenance Window',
                                },
                            ]
                        }
                    ]
                },
                allowSelection: true,
                selectedRowIndex: 1,
                includeWeekend: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(4);
        });
        it('Checking date after saving', () => {
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/13/2019');
            ED.dataBind();
            let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/13/2019');
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Changing exception dynamically coverage', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Defining the product and its usage',
                                StartDate: new Date('03/31/2019'),
                                Duration: 3,
                                Progress: 30
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Defining target audience',
                                StartDate: new Date('04/05/2019'),
                                Duration: 3,
                                calendar: "task-calendar-1"
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Prepare product sketch and notes',
                                StartDate: new Date('04/10/2019'),
                                Duration: 3,
                                Progress: 30,
                                calendar: "task-calendar-1"
                            },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                calendarSettings: {
                    projectCalendar: {
                        workingTime: [
                            { from: 9, to: 13 },
                            { from: 14, to: 18 }
                        ],
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                            }
                        ],
                        exceptions: [
                            {
                                from: '03/31/2019',
                                to: '03/31/2019',
                                label: 'Extended Work Day'
                            },
                        ]
                    },
                    taskCalendars: [
                        {
                            calendarId: 'task-calendar-1',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Task-Specific Holiday',
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task-Specific Holiday2',
                                }

                            ],
                            exceptions: [
                                {
                                    from: '04/01/2019',
                                    to: '04/01/2019',
                                    label: 'Task Deadline Extension'
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task Deadline Extension2',
                                }
                            ]
                        }
                    ]
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Changing exception ', (done: Function) => {
            ganttObj.calendarSettings.projectCalendar.exceptions = [];
            ganttObj.dataBound = () => {
                expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
                done();
            };
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Changing holiday dynamically coverage', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Defining the product and its usage',
                                StartDate: new Date('03/31/2019'),
                                Duration: 3,
                                Progress: 30
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Defining target audience',
                                StartDate: new Date('04/05/2019'),
                                Duration: 3,
                                calendar: "task-calendar-1"
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Prepare product sketch and notes',
                                StartDate: new Date('04/10/2019'),
                                Duration: 3,
                                Progress: 30,
                                calendar: "task-calendar-1"
                            },
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    calendarId: 'calendar'
                },
                calendarSettings: {
                    projectCalendar: {
                        workingTime: [
                            { from: 9, to: 13 },
                            { from: 14, to: 18 }
                        ],
                        holidays: [
                            {
                                from: '04/05/2019',
                                to: '04/05/2019',
                                label: 'Good Friday',
                            }
                        ],
                        exceptions: [
                            {
                                from: '03/31/2019',
                                to: '03/31/2019',
                                label: 'Extended Work Day'
                            },
                        ]
                    },
                    taskCalendars: [
                        {
                            calendarId: 'task-calendar-1',
                            holidays: [
                                {
                                    from: '04/10/2019',
                                    to: '04/10/2019',
                                    label: 'Task-Specific Holiday',
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task-Specific Holiday2',
                                }

                            ],
                            exceptions: [
                                {
                                    from: '04/01/2019',
                                    to: '04/01/2019',
                                    label: 'Task Deadline Extension'
                                },
                                {
                                    from: '04/17/2019',
                                    to: '04/17/2019',
                                    label: 'Task Deadline Extension2',
                                }
                            ]
                        }
                    ]
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
        });
        it('Changing holiday ', (done: Function) => {
            ganttObj.calendarSettings.projectCalendar.holidays = [];
            ganttObj.dataBound = () => {
                expect(ganttObj.calendarModule.holidays.length === 0).toBe(true);
                done();
            };
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
});