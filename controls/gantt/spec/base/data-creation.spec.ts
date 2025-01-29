import { Gantt, IGanttData, Edit, Selection, DayMarkers, CriticalPath } from '../../src/index';
import {
    unscheduledData, selfReference, projectData, projectResources, unscheduledData2,
    unscheduledData3, unscheduledData4
} from './data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
import { DataManager } from '@syncfusion/ej2-data';
Gantt.Inject(Edit, Selection, DayMarkers, CriticalPath)
/**
 * 
 */
describe('Data-Binding', () => {
    describe('Hierarchy data binding', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: unscheduledData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    renderBaseline: true,
                    allowUnscheduledTasks: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        },
                        timelineUnitSize: 60
                    },
                }, done
            );
        });
        it('Allow Unscheduled tasks - type 1', () => {
            let flatData: Object[] = ganttObj.flatData;
            expect(flatData.length).toBe(15);
        });
        it('Allow Unscheduled tasks - type 2', () => {
            ganttObj.dataSource = unscheduledData2;
            ganttObj.dataBind();
            let flatData: Object[] = ganttObj.flatData;
            expect(flatData.length).toBe(4);
        });
        it('Allow Unscheduled tasks - type 3', () => {
            ganttObj.dataSource = unscheduledData3;
            ganttObj.dataBind();
            let flatData: Object[] = ganttObj.flatData;
            expect(flatData.length).toBe(4);
        });
        it('Allow Unscheduled tasks - type 4', () => {
            ganttObj.dataSource = unscheduledData4;
            ganttObj.dataBind();
            let flatData: Object[] = ganttObj.flatData;
            expect(flatData.length).toBe(4);
        });
        it('Rendering with empty dataSource', () => {
            ganttObj.dataSource = [];
            ganttObj.projectStartDate = '03/01/2017';
            ganttObj.projectEndDate = '03/30/2017';
            ganttObj.dataBind();
            let flatData: IGanttData[] = ganttObj.flatData;
            expect(flatData.length).toBe(0);
        });
        it('Scheduled tasks Only', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataSource = unscheduledData;
            ganttObj.eventMarkers = [
                { day: '03/10/2017', label: 'project start', cssClass: 'stripLine' }
            ];
            ganttObj.holidays = [
                { from: '02/24/2017', to: '02/25/2017', label: 'Holiday 1' },
                { from: new Date('03/30/2017'), to: new Date('04/01/2017'), label: 'Holiday 2' },
                { from: '04/02/2017', label: 'Holiday 3' }
            ];
            ganttObj.projectStartDate = null;
            ganttObj.projectEndDate = null;
            ganttObj.dataBind();
            let flatData: IGanttData[] = ganttObj.flatData;
            expect(flatData.length).toBe(15);
        });
        // it('Rendering with DataManager', (done: Function) => {
        //     ganttObj.allowUnscheduledTasks = false;
        //     ganttObj.dataSource = new DataManager(unscheduledData);
        //     ganttObj.dataBind();
        //     ganttObj.dataBound = () => {
        //         let flatData: IGanttData[] = ganttObj.flatData;
        //         expect(flatData.length).toBe(15);
        //         done();
        //     };
        // });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

    });
    describe('SelfReference data binding', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        parentID: 'ParentID'
                    },
                    includeWeekend: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        },
                        timelineUnitSize: 60
                    },
                    projectStartDate: '02/25/2017',
                    projectEndDate: '03/20/2017'
                }, done
            );
        });
        it('Rendering with empty DataSource', () => {
            let flatData: Object[] = ganttObj_self.flatData;
            expect(flatData.length).toBe(0);
        });
        it('flat record length', () => {
            ganttObj_self.dataSource = selfReference;
            ganttObj_self.dataBind();
            let flatData: Object[] = ganttObj_self.flatData;
            expect(flatData.length).toBe(15);
        });
        afterAll(() => {
            if(ganttObj_self){
                destroyGantt(ganttObj_self);
            }
        });
    });
    describe('SelfReference data binding', () => {
        let ganttObj_self: Gantt;
        beforeAll((done: Function) => {
            ganttObj_self = createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        parentID: 'ParentID'
                    },
                    includeWeekend: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        },
                        timelineUnitSize: 60
                    },
                    projectStartDate: '02/25/2017',
                    projectEndDate: '03/20/2017'
                }, done
            );
        });
        // beforeEach(function (done) {
        //     setTimeout(done, 100);
        // });
        it('Rendering with DataManager', (done: Function) => {
            ganttObj_self.dataSource = new DataManager(selfReference);
            ganttObj_self.dataBind();
            ganttObj_self.dataBound = () => {
                let flatData: IGanttData[] = ganttObj_self.flatData;
                expect(flatData.length).toBe(15);
                done();
            };
        });
        afterAll(() => {
            if(ganttObj_self){
                destroyGantt(ganttObj_self);
            }
        });
    })
    describe('Hierarchy data with resources', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: projectData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        milestone: 'milestone',
                        expandState: 'Expand',
                        resourceInfo: 'ResourceId'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    includeWeekend: true,
                    collapseAllParentTasks: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        },
                        timelineUnitSize: 60
                    },
                    holidays: [
                        { from: '02/24/2017', to: '02/25/2017', label: 'Holiday 1' },
                        { from: new Date('02/28/2017'), to: new Date('02/30/2017'), label: 'Holiday 2' },
                        { from: '03/02/2017', label: 'Holiday 3' },
                        { to: '03/06/2017', label: 'Holiday 4' },
                        { from: new Date('03/04/2017'), to: new Date('03/07/2017'), label: 'Holiday 5' }
                    ],
                    resourceIDMapping: 'ResourceId',
                    resourceNameMapping: 'ResourceName',
                    resources: projectResources,
                    projectStartDate: '02/25/2017',
                    projectEndDate: '03/20/2017'
                }, done);
        });
        it('flat record length', () => {
            let flatData: Object[] = ganttObj_tree.flatData;
            expect(flatData.length).toBe(41);
        });
        afterAll(() => {
            if(ganttObj_tree){
                destroyGantt(ganttObj_tree);
            }
        });
    });
});
describe('Rendering for unscheduled tasks', () => {
    let ganttObj: Gantt;
    let projectNewData = [
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
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableCriticalPath: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
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
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        allowSelection: false,
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
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
    it('unscheduled task', () => {
        expect(ganttObj.currentViewData.length).toBe(4);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
