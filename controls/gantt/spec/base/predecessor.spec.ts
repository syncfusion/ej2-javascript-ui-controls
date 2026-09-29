/**
 * Gantt predecessor base spec
 */
import { createElement, remove, L10n } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../../src/index';
import { destroyGantt, createGantt, triggerMouseEvent } from './gantt-util.spec';
import { ContextMenuClickEventArgs} from './../../src/gantt/base/interface';
import { columnTemplateData, data15, editingData13, editingData14, editingData15, editingData16, editingData17, predData1, predData2, predData3, predData4, predData5, predData6, predData8,resourceResourcesUndo,localizationData, CR927012, dataCollection, cr969720, editingResources, cr786381, projectNewDataTimezone, emptyDataSource,
    allTypeAllowedData, virtualData2, depSegmentData, revSegmentData, resourceCollection, depRstrcitResourcesData
 } from './data-source.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);


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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
    it('Predecessor id without type - testing', (done: Function) => {
        ganttObj.dataSource = predData4;
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Invalid Predecessor type - testing', (done: Function) => {
        ganttObj.dataSource = predData5;
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Invalid Predecessor ID - not in datasource - testing', (done: Function) => {
        ganttObj.dataSource = predData6;
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Duration unit with hour - testing', (done: Function) => {
        ganttObj.dataSource = predData8;
        ganttObj.durationUnit = 'Hour';
        ganttObj.dataBound = () => {
            done();
        };
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });

    it('Duration unit with minute - testing', (done : Function) => {
        ganttObj.dataSource = predData8;
        ganttObj.durationUnit = 'Minute';
        ganttObj.dataBound = () => {
            done();
        };
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

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
    it('control initialization with predecessor', () => {
        expect(ganttObj.taskFields.dependency).toBe('Predecessor');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
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
    it('Gantt object predecessor - testing', (done : Function) => {
        ganttObj.taskFields.dependency = 'predObj';
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Predecessor type testing', (done : Function) => {
        ganttObj.taskFields.dependency = 'Predecessor';
        ganttObj.dataSource = predData1;
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Own parent as Predecessor (string) - testing', (done : Function) => {
        ganttObj.dataSource = predData2;
        ganttObj.dataBound = () => {
            done();
        };
    });
    it('Own parent as Predecessor (object) - testing', (done : Function) => {
        ganttObj.dataSource = predData3;
        ganttObj.dataBound = () => {
            done();
        };
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
describe('Parent predecessor for unscheduled task', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData13,
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
 describe('Parent predecessor for unscheduled task', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData14,
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
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
describe('GUID predecessor', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data15,
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
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Bug -855406 -Dependency line not render after adding child record ', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData15,
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
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('AlphaID predecessor', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData16,
                allowSorting: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor'
        },
        editSettings: {
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
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
            }, done);
    });
    it('Check predecessor length', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor validation', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData17,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
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
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
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
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
    it('Check predecessor length', (done: Function) => {
        ganttObj.taskbarEdited = (args: any) => {
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/02/2019');
            done();
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -100, 0);
        triggerMouseEvent(dragElement, 'mouseup');        
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor validation', () => {
    let ganttObj: Gantt;
    let datasource : any = [
        {
          TaskID: 1,
          TaskName: 'Project Initiation',
          StartDate: new Date('2024-02-01'),
          subtasks: [
            {
              TaskID: 3,
              TaskName: 'Perform Soil test',
              StartDate: new Date('2024-02-01'),
              Duration: 4,
              Progress: 50,
              dependency: '2',
            },
          ],
        },
        {
          TaskID: 2,
          TaskName: 'Identify Site location',
          StartDate: new Date('2024-02-01'),
          Duration: 4,
          Progress: 50,
          dependency: '1',
        },
      ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'dependency',
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
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('Check date', () => {
        /// circular dependency so the taskbar was not moved
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyy')).toBe('2/7/2024');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:880619-Timeline does not render properly while predecessor offset value in negative value', () => {
    let ganttObj: Gantt;
    let data : any = [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('2024-02-01'),
            subtasks: [
              {
                TaskID: 2,
                TaskName: 'Identify Site location',
                StartDate: new Date('2024-02-01'),
                Duration: 4,
                Progress: 50,
              },
              {
                TaskID: 3,
                TaskName: 'Perform Soil test',
                StartDate: new Date('2024-02-01'),
                Duration: 4,
                Progress: 50,
                dependency: '7+2d',
              },
              {
                TaskID: 4,
                TaskName: 'Soil test approval',
                StartDate: new Date('2024-02-01'),
                Duration: 4,
                Progress: 50,
              },
            ],
          },
          {
            TaskID: 5,
            TaskName: 'Project Estimation',
            StartDate: new Date('2024-02-06'),
            subtasks: [
              {
                TaskID: 6,
                TaskName: 'Develop floor plan for estimation',
                StartDate: new Date('2024-02-06'),
                Duration: 3,
                Progress: 50,
              },
              {
                TaskID: 7,
                TaskName: 'List materials',
                StartDate: new Date('2024-02-06'),
                Duration: 3,
                Progress: 50,
              },
              {
                TaskID: 8,
                TaskName: 'Estimation approval',
                StartDate: new Date('2024-02-06'),
                Duration: 3,
                Progress: 50,
                dependency: '7SF-5 days',
              },
            ],
        }
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
        dataSource: data,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            child: 'subtasks',
            dependency: 'dependency'
        },
        editSettings: {
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
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
        height: '550px',
            }, done);
    });
    it('Checking timeline start date', () => {
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe("01/22/2024");
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:882497-updateOffsetOnTaskbarEdit property is not working properly', () => {
    let ganttObj: Gantt;
    let datasource : any = [
        {
          TaskID: 1,
          TaskName: 'Project Initiation',
          StartDate: new Date('2024-02-01'),
          subtasks: [
            {
              TaskID: 3,
              TaskName: 'Perform Soil test',
              StartDate: new Date('2024-02-01'),
              Duration: 4,
              Progress: 50,
              dependency: '2',
            },
          ],
        },
        {
          TaskID: 2,
          TaskName: 'Identify Site location',
          StartDate: new Date('2024-02-01'),
          Duration: 4,
          Progress: 50,
          dependency: '1',
        },
      ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'dependency',
                    child: 'subtasks'
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
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                gridLines: "Both",
                updateOffsetOnTaskbarEdit: false,
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
            }, done);
    });
    it('checking UpdateOffsetOnTaskbarEdit property value', () => {
        expect(ganttObj.updateOffsetOnTaskbarEdit).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Predecessor validation case is not properly handled', () => {
    let ganttObj: Gantt;
    let datasource : any = [
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
                    TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2FS,2SS',
                    resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                        'From an engineer or company specializing in soil testing'
                },
                { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Progress: 30 },
            ]
        },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                allowSorting: true,
                resources: resourceResourcesUndo,
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

                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
            }, done);
    });
    it('checking predecessorsName', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe('2SS');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('911342-predecessor validation for parent to parent', () => {
    let ganttObj: Gantt;
    let projectNewData : any = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 30 },
            ]
        },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "4", Progress: 30 },
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "10" },
            ]
        },
        { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "11" }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
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
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
        allowSelection: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
        },
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
    it('Check date', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(ganttObj.getFormatedDate(ganttObj.flatData[7].ganttProperties.startDate, 'M/d/yyy')).toBe('4/16/2019');
            }
        };
        let predecessor: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(predecessor, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '1FS';
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:881509-L10n method locale not applied for dependency for days', () => {
    let ganttObj: Gantt;
    let data : any = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 2,
                    Progress: 30,
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4, Predecessor: '2FS+3Days'
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 1, Progress: 30
                },
            ]
        }
    ];
    beforeAll((done: Function) => {
        L10n.load({
            'pt-BR': {
                gantt: {
                    emptyRecord: 'Sem registros para exibir',
                    segments: 'Partes',
                    id: 'ID',
                    name: 'Nome',
                    startDate: 'Data de início',
                    endDate: 'Data de fim',
                    duration: 'Duração',
                    progress: 'Progresso',
                    dependency: 'Dependência',
                    notes: 'Notas',
                    baselineStartDate: 'Data de início da linha de base',
                    baselineEndDate: 'Data de fim da linha de base',
                    type: 'Tipo',
                    offset: 'Offset',
                    resourceName: 'Nome do recurso',
                    resourceID: 'ID do recurso',
                    day: 'Dia',
                    hour: 'Hora',
                    minute: 'Minuto',
                    days: 'Dias',
                    hours: 'Horas',
                    minutes: 'Minutos',
                    generalTab: 'Aba geral',
                    customTab: 'Aba customizada',
                    writeNotes: 'Escrever notas',
                    addDialogTitle: 'Adicionar',
                    editDialogTitle: 'Editar',
                    add: 'Adicionar',
                    edit: 'Editar',
                    update: 'Atualizar',
                    delete: 'Deletar',
                    cancel: 'Cancelar',
                    search: 'Procurar',
                    task: 'Tarefa',
                    tasks: 'Tarefas',
                    zoomIn: '+ Zoom',
                    zoomOut: '- Zoom',
                    zoomToFit: 'Centralizar',
                    expandAll: 'Expandir todos',
                    collapseAll: 'Colapsar todos',
                    nextTimeSpan: '',
                    prevTimeSpan: '',
                    saveButton: 'Salvar',
                    taskBeforePredecessor_FS:
                        'Você moveu “{0}” para iniciar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FS:
                        'Você moveu “{0}” para iniciar após o fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SS:
                        'Você moveu “{0}” para iniciar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SS:
                        'Você moveu “{0}” para iniciar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_FF:
                        'Você moveu “{0}” para terminar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FF:
                        'Você moveu “{0}” para terminar após do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SF:
                        'Você moveu “{0}” para terminar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SF:
                        'Você moveu “{0}” para terminar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    okText: 'Ok',
                    confirmDelete: 'Você tem certeza que deseja deletar esse registro?',
                    from: 'de',
                    to: 'para',
                    taskLink: 'Relacionar tarefa',
                    lag: 'Atraso',
                    start: 'Começar',
                    finish: 'Finalizar',
                    enterValue: 'Entre Com o Valor',
                    taskInformation: 'Informação da Tarefa',
                    deleteTask: 'Deletar Tarefa',
                    deleteDependency: 'Deletar Dependência',
                    convert: 'Converter',
                    save: 'Salvar',
                    above: 'Acima',
                    below: 'Abaixo',
                    child: 'Filha',
                    milestone: 'Milestone',
                    toTask: 'Para Tarefa',
                    toMilestone: 'Para Milestone',
                    eventMarkers: 'Marcadores de Evento',
                    leftTaskLabel: 'Título da Tarefa a Esquerda',
                    rightTaskLabel: 'Título da Tarefa a Direita',
                    timelineCell: 'Célula da Timeline',
                    confirmPredecessorDelete: 'Você realmetne deseja remover a dependência?',
                    changeScheduleMode: 'Alterar Modo do Cronograma',
                    subTasksStartDate: 'Data de Início da Subtarefa',
                    subTasksEndDate: 'Data Final da Subtarefa',
                    scheduleStartDate: 'Data de Início do Cronograma',
                    scheduleEndDate: 'Data Final do Cronograma',
                    auto: 'Auto',
                    manual: 'Manual',
                    excelExport: 'Exportação de Excel',
                    csvExport: 'Exportação de CSV',
                    pdfExport: 'Exportação de PDF',
                    unit: 'Unidade',
                    work: 'Trabalho',
                    taskType: 'Tipo de tarefa',
                    unassignedTask: 'Tarefa não atribuída',
                    group: 'Grupo',
                },
                grid: {},
            },
        });
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                taskFields: {
                    id: "TaskID",
                    name: "TaskName",
                    startDate: "StartDate",
                    endDate: "EndDate",
                    duration: "Duration",
                    progress: "Progress",
                    dependency: "Predecessor",
                    child: "subtasks"
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                locale: 'pt-BR',
                allowUnscheduledTasks: true,
            }, done);
    });
    it('Checking the prdedecessor day locale format', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe("2FS+3 Dias");
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('provide support for dependency type localization', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        L10n.load({
            'pt-BR': {
                gantt: {
                    emptyRecord: 'Sem registros para exibir',
                    segments: 'Partes',
                    id: 'ID',
                    name: 'Nome',
                    startDate: 'Data de início',
                    endDate: 'Data de fim',
                    duration: 'Duração',
                    progress: 'Progresso',
                    dependency: 'Dependência',
                    notes: 'Notas',
                    baselineStartDate: 'Data de início da linha de base',
                    baselineEndDate: 'Data de fim da linha de base',
                    type: 'Tipo',
                    offset: 'Offset',
                    resourceName: 'Nome do recurso',
                    resourceID: 'ID do recurso',
                    day: 'Dia',
                    hour: 'Hora',
                    minute: 'Minuto',
                    days: 'Dias',
                    hours: 'Horas',
                    minutes: 'Minutos',
                    generalTab: 'Aba geral',
                    customTab: 'Aba customizada',
                    writeNotes: 'Escrever notas',
                    addDialogTitle: 'Adicionar',
                    editDialogTitle: 'Editar',
                    add: 'Adicionar',
                    edit: 'Editar',
                    update: 'Atualizar',
                    delete: 'Deletar',
                    cancel: 'Cancelar',
                    search: 'Procurar',
                    task: 'Tarefa',
                    tasks: 'Tarefas',
                    zoomIn: '+ Zoom',
                    zoomOut: '- Zoom',
                    zoomToFit: 'Centralizar',
                    expandAll: 'Expandir todos',
                    collapseAll: 'Colapsar todos',
                    nextTimeSpan: '',
                    prevTimeSpan: '',
                    saveButton: 'Salvar',
                    taskBeforePredecessor_FS:
                        'Você moveu “{0}” para iniciar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FS:
                        'Você moveu “{0}” para iniciar após o fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SS:
                        'Você moveu “{0}” para iniciar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SS:
                        'Você moveu “{0}” para iniciar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_FF:
                        'Você moveu “{0}” para terminar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FF:
                        'Você moveu “{0}” para terminar após do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SF:
                        'Você moveu “{0}” para terminar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SF:
                        'Você moveu “{0}” para terminar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    okText: 'Ok',
                    confirmDelete: 'Você tem certeza que deseja deletar esse registro?',
                    from: 'de',
                    to: 'para',
                    taskLink: 'Relacionar tarefa',
                    lag: 'Atraso',
                    start: 'Começar',
                    finish: 'Finalizar',
                    enterValue: 'Entre Com o Valor',
                    taskInformation: 'Informação da Tarefa',
                    deleteTask: 'Deletar Tarefa',
                    deleteDependency: 'Deletar Dependência',
                    convert: 'Converter',
                    save: 'Salvar',
                    above: 'Acima',
                    below: 'Abaixo',
                    child: 'Filha',
                    milestone: 'Milestone',
                    toTask: 'Para Tarefa',
                    toMilestone: 'Para Milestone',
                    eventMarkers: 'Marcadores de Evento',
                    leftTaskLabel: 'Título da Tarefa a Esquerda',
                    rightTaskLabel: 'Título da Tarefa a Direita',
                    timelineCell: 'Célula da Timeline',
                    confirmPredecessorDelete: 'Você realmetne deseja remover a dependência?',
                    changeScheduleMode: 'Alterar Modo do Cronograma',
                    subTasksStartDate: 'Data de Início da Subtarefa',
                    subTasksEndDate: 'Data Final da Subtarefa',
                    scheduleStartDate: 'Data de Início do Cronograma',
                    scheduleEndDate: 'Data Final do Cronograma',
                    auto: 'Auto',
                    manual: 'Manual',
                    excelExport: 'Exportação de Excel',
                    csvExport: 'Exportação de CSV',
                    pdfExport: 'Exportação de PDF',
                    unit: 'Unidade',
                    work: 'Trabalho',
                    taskType: 'Tipo de tarefa',
                    unassignedTask: 'Tarefa não atribuída',
                    group: 'Grupo',
                    FS: "fsi",
                    SS: "ssi",
                    FF: "ffi",
                    SF: "sfi"
                },
                datepicker: {
                    today: 'hoje',
                },
                grid: {
                    EmptyRecord: 'Não há registros a serem exibidos',
                    True: 'verdadeiro',
                    False: 'falso',
                    InvalidFilterMessage: 'Dados da filtragem inválidos',
                    GroupDropArea:
                        'Arraste um cabeçalho de coluna aqui para agrupar sua coluna',
                    UnGroup: 'Clique aqui para desagrupar',
                    GroupDisable: 'O agrupamento está desativado para esta coluna',
                    FilterbarTitle: 'célula da barra de filtro',
                    EmptyDataSourceError:
                        'O DataSource não deve estar vazio no carregamento inicial, pois as colunas são geradas a partir do dataSource no AutoGenerate Column Grid',
                    Add: 'Adicionar',
                    Edit: 'Editar',
                    Cancel: 'Cancelar',
                    Update: 'Atualizar',
                    Delete: 'Excluir',
                    Print: 'Imprimir',
                    Pdfexport: 'Exportar PDF',
                    Excelexport: 'Exportar Excel',
                    Wordexport: 'Exportar Word',
                    Csvexport: 'Exportar CSV',
                    Search: 'Buscar',
                    Columnchooser: 'Selecionar Colunas',
                    Save: 'Salvar ',
                    Item: 'item',
                    Items: 'itens',
                    EditOperationAlert: 'Nenhum registro selecionado para operação de edição',
                    DeleteOperationAlert:
                        'Nenhum registro selecionado para operação de exclusão',
                    SaveButton: 'Salvar ',
                    OKButton: 'OK',
                    CancelButton: 'Cancelar',
                    EditFormTitle: 'Editar registro',
                    AddFormTitle: 'Adicionar novo registro',
                    BatchSaveConfirm: 'Tem certeza de que deseja salvar as alterações?',
                    BatchSaveLostChanges:
                        'Alterações não salvas serão perdidas. Você tem certeza que quer continuar?',
                    ConfirmDelete: 'Tem certeza de que deseja excluir o registro?',
                    CancelEdit: 'Tem certeza de que deseja cancelar as alterações?',
                    ChooseColumns: 'Escolher colunas',
                    SearchColumns: 'Buscar colunas',
                    Matchs: 'Nenhuma correspondência encontrada',
                    FilterButton: 'Filtrar',
                    ClearButton: 'Limpar',
                    StartsWith: 'Começa com',
                    EndsWith: 'Termina com',
                    Contains: 'Contém',
                    Equal: 'Igual',
                    NotEqual: 'Diferente',
                    LessThan: 'Menor que',
                    LessThanOrEqual: 'Menor ou igual',
                    GreaterThan: 'Maior que',
                    GreaterThanOrEqual: 'Maior ou igual',
                    ChooseDate: 'Escolha uma data',
                    EnterValue: 'Digite o valor',
                    Copy: 'Copiar',
                    Group: 'Agrupar por esta coluna',
                    Ungroup: 'Desagrupar por esta coluna',
                    autoFitAll: 'Ajustar automaticamente a todas as colunas',
                    autoFit: 'Ajustar automaticamente a esta coluna',
                    Export: 'Exportar',
                    FirstPage: 'Primeira página',
                    LastPage: 'Última página',
                    PreviousPage: 'Página anterior',
                    NextPage: 'Próxima página',
                    SortAscending: 'Classificar em ordem ascendente',
                    SortDescending: 'Classificar em ordem decrescente',
                    EditRecord: 'Editar registro',
                    DeleteRecord: 'Apagar registro',
                    FilterMenu: 'Filtro',
                    SelectAll: 'Selecionar tudo',
                    Blanks: 'Espaços em branco',
                    FilterTrue: 'Verdadeiro',
                    FilterFalse: 'Falso',
                    NoResult: 'Nenhum resultado encontrada',
                    ClearFilter: 'Limpar filtro',
                    NumberFilter: 'Filtros numéricos',
                    TextFilter: 'Filtros de texto',
                    DateFilter: 'Filtros de data',
                    DateTimeFilter: 'Filtros DateTime',
                    MatchCase: 'Caso de compatibilidade',
                    Between: 'Entre',
                    CustomFilter: 'Filtro customizado',
                    CustomFilterPlaceHolder: 'Digite o valor',
                    CustomFilterDatePlaceHolder: 'Escolha uma data',
                    AND: 'E',
                    OR: 'OU',
                    ShowRowsWhere: 'Mostrar linhas onde:',
                    NotStartsWith: 'Não começa com',
                    Like: 'Como',
                    NotEndsWith: 'Não termina com',
                    NotContains: 'Não contém',
                    IsNull: 'Nula',
                    NotNull: 'Não nulo',
                    IsEmpty: 'Vazia',
                    IsNotEmpty: 'Não está vazio',
                    AddCurrentSelection: 'Adicionar seleção atual para filtrar',
                    UnGroupButton: 'Clique aqui para desagrupar',
                    AutoFitAll: 'Ajustar automaticamente todas as colunas',
                    AutoFit: 'Ajustar automaticamente esta coluna',
                    Clear: 'Clara',
                    FilterMenuDialogARIA: 'Caixa de diálogo do menu de filtro',
                    ExcelFilterDialogARIA: 'Caixa de diálogo de filtro do Excel',
                    DialogEditARIA: 'Caixa de diálogo Editar',
                    ColumnChooserDialogARIA: 'Seletor de coluna',
                    ColumnMenuDialogARIA: 'Caixa de diálogo do menu da coluna',
                    CustomFilterDialogARIA: 'Caixa de diálogo de filtro personalizado',
                    SortAtoZ: 'Ordenar de A a Z',
                    SortZtoA: 'Ordenar Z a A',
                    SortByOldest: 'Classificar por mais antigo',
                    SortByNewest: 'Classificar por mais recente',
                    SortSmallestToLargest: 'Classificar do menor para o maior',
                    SortLargestToSmallest: 'Classificar do maior para o menor',
                    Sort: 'Ordenar',
                    FilterDescription: 'Pressione Alt para baixo para abrir o menu de filtro',
                    SortDescription: 'Pressione Enter para classificar',
                    ColumnMenuDescription:
                        'Pressione Alt para baixo para abrir o menu de colunas',
                    GroupDescription: 'Pressione o espaço Ctrl para agrupar',
                    ColumnHeader: ' cabeçalho da coluna ',
                    TemplateCell: ' é célula modelo',
                    CommandColumnAria: 'é o cabeçalho da coluna da coluna de comando ',
                    DialogEdit: 'Editar caixa de diálogo',
                    ClipBoard: 'prancheta',
                    GroupButton: 'Botão de grupo',
                    UnGroupAria: 'botão desagrupar',
                    GroupSeperator: 'Separador para as colunas agrupadas',
                    UnGroupIcon: 'desagrupar a coluna agrupada ',
                    GroupedSortIcon: 'classificar a coluna agrupada ',
                    GroupedDrag: 'Arraste a coluna agrupada',
                    GroupCaption: ' é célula de legenda de grupo',
                    CheckBoxLabel: 'caixa de seleção',
                    Expanded: 'Expandida',
                    Collapsed: 'Desabou',
                    SelectAllCheckbox: 'Caixa de seleção Selecionar tudo',
                    SelectRow: 'Selecione a linha',
                },
            },
        });

        ganttObj = createGantt(
            {
                dataSource: localizationData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                locale: 'pt-BR',
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
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
                allowFiltering: true,
                filterSettings: {
                    type: "Menu",
                    hierarchyMode: "Both"
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('checking predecessorsName localization', () => {
        let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[4] as HTMLElement;
        triggerMouseEvent(filterMenuIcon, 'click');
        expect(ganttObj.element.querySelectorAll('.e-headercell')[4].getElementsByClassName('e-headertext')[0].textContent).toBe('Dependência');
        expect(ganttObj.treeGridModule.changeLocale(ganttObj.treeGrid.grid.dataSource).length).toBe(7);
        expect(ganttObj.treeGridModule.changeDelocale("10ffi")).toBe('10FF');
        expect(ganttObj.treeGridModule.changeDelocale("10fsi")).toBe('10FS');
        expect(ganttObj.treeGridModule.changeDelocale("10sfi")).toBe('10SF');
        expect(ganttObj.treeGridModule.changeDelocale("10ssi")).toBe('10SS');
        expect(ganttObj.treeGridModule.changeDelocale(null)).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('provide support for dependency type localization', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        L10n.load({
            'pt-BR': {
                gantt: {
                    emptyRecord: 'Sem registros para exibir',
                    segments: 'Partes',
                    id: 'ID',
                    name: 'Nome',
                    startDate: 'Data de início',
                    endDate: 'Data de fim',
                    duration: 'Duração',
                    progress: 'Progresso',
                    dependency: 'Dependência',
                    notes: 'Notas',
                    baselineStartDate: 'Data de início da linha de base',
                    baselineEndDate: 'Data de fim da linha de base',
                    type: 'Tipo',
                    offset: 'Offset',
                    resourceName: 'Nome do recurso',
                    resourceID: 'ID do recurso',
                    day: 'Dia',
                    hour: 'Hora',
                    minute: 'Minuto',
                    days: 'Dias',
                    hours: 'Horas',
                    minutes: 'Minutos',
                    generalTab: 'Aba geral',
                    customTab: 'Aba customizada',
                    writeNotes: 'Escrever notas',
                    addDialogTitle: 'Adicionar',
                    editDialogTitle: 'Editar',
                    add: 'Adicionar',
                    edit: 'Editar',
                    update: 'Atualizar',
                    delete: 'Deletar',
                    cancel: 'Cancelar',
                    search: 'Procurar',
                    task: 'Tarefa',
                    tasks: 'Tarefas',
                    zoomIn: '+ Zoom',
                    zoomOut: '- Zoom',
                    zoomToFit: 'Centralizar',
                    expandAll: 'Expandir todos',
                    collapseAll: 'Colapsar todos',
                    nextTimeSpan: '',
                    prevTimeSpan: '',
                    saveButton: 'Salvar',
                    taskBeforePredecessor_FS:
                        'Você moveu “{0}” para iniciar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FS:
                        'Você moveu “{0}” para iniciar após o fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SS:
                        'Você moveu “{0}” para iniciar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SS:
                        'Você moveu “{0}” para iniciar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_FF:
                        'Você moveu “{0}” para terminar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FF:
                        'Você moveu “{0}” para terminar após do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SF:
                        'Você moveu “{0}” para terminar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SF:
                        'Você moveu “{0}” para terminar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    okText: 'Ok',
                    confirmDelete: 'Você tem certeza que deseja deletar esse registro?',
                    from: 'de',
                    to: 'para',
                    taskLink: 'Relacionar tarefa',
                    lag: 'Atraso',
                    start: 'Começar',
                    finish: 'Finalizar',
                    enterValue: 'Entre Com o Valor',
                    taskInformation: 'Informação da Tarefa',
                    deleteTask: 'Deletar Tarefa',
                    deleteDependency: 'Deletar Dependência',
                    convert: 'Converter',
                    save: 'Salvar',
                    above: 'Acima',
                    below: 'Abaixo',
                    child: 'Filha',
                    milestone: 'Milestone',
                    toTask: 'Para Tarefa',
                    toMilestone: 'Para Milestone',
                    eventMarkers: 'Marcadores de Evento',
                    leftTaskLabel: 'Título da Tarefa a Esquerda',
                    rightTaskLabel: 'Título da Tarefa a Direita',
                    timelineCell: 'Célula da Timeline',
                    confirmPredecessorDelete: 'Você realmetne deseja remover a dependência?',
                    changeScheduleMode: 'Alterar Modo do Cronograma',
                    subTasksStartDate: 'Data de Início da Subtarefa',
                    subTasksEndDate: 'Data Final da Subtarefa',
                    scheduleStartDate: 'Data de Início do Cronograma',
                    scheduleEndDate: 'Data Final do Cronograma',
                    auto: 'Auto',
                    manual: 'Manual',
                    excelExport: 'Exportação de Excel',
                    csvExport: 'Exportação de CSV',
                    pdfExport: 'Exportação de PDF',
                    unit: 'Unidade',
                    work: 'Trabalho',
                    taskType: 'Tipo de tarefa',
                    unassignedTask: 'Tarefa não atribuída',
                    group: 'Grupo',
                    FS: "fsi",
                    SS: "ssi",
                    FF: "ffi",
                    SF: "sfi"
                },
                datepicker: {
                    today: 'hoje',
                },
                grid: {
                    EmptyRecord: 'Não há registros a serem exibidos',
                    True: 'verdadeiro',
                    False: 'falso',
                    InvalidFilterMessage: 'Dados da filtragem inválidos',
                    GroupDropArea:
                        'Arraste um cabeçalho de coluna aqui para agrupar sua coluna',
                    UnGroup: 'Clique aqui para desagrupar',
                    GroupDisable: 'O agrupamento está desativado para esta coluna',
                    FilterbarTitle: 'célula da barra de filtro',
                    EmptyDataSourceError:
                        'O DataSource não deve estar vazio no carregamento inicial, pois as colunas são geradas a partir do dataSource no AutoGenerate Column Grid',
                    Add: 'Adicionar',
                    Edit: 'Editar',
                    Cancel: 'Cancelar',
                    Update: 'Atualizar',
                    Delete: 'Excluir',
                    Print: 'Imprimir',
                    Pdfexport: 'Exportar PDF',
                    Excelexport: 'Exportar Excel',
                    Wordexport: 'Exportar Word',
                    Csvexport: 'Exportar CSV',
                    Search: 'Buscar',
                    Columnchooser: 'Selecionar Colunas',
                    Save: 'Salvar ',
                    Item: 'item',
                    Items: 'itens',
                    EditOperationAlert: 'Nenhum registro selecionado para operação de edição',
                    DeleteOperationAlert:
                        'Nenhum registro selecionado para operação de exclusão',
                    SaveButton: 'Salvar ',
                    OKButton: 'OK',
                    CancelButton: 'Cancelar',
                    EditFormTitle: 'Editar registro',
                    AddFormTitle: 'Adicionar novo registro',
                    BatchSaveConfirm: 'Tem certeza de que deseja salvar as alterações?',
                    BatchSaveLostChanges:
                        'Alterações não salvas serão perdidas. Você tem certeza que quer continuar?',
                    ConfirmDelete: 'Tem certeza de que deseja excluir o registro?',
                    CancelEdit: 'Tem certeza de que deseja cancelar as alterações?',
                    ChooseColumns: 'Escolher colunas',
                    SearchColumns: 'Buscar colunas',
                    Matchs: 'Nenhuma correspondência encontrada',
                    FilterButton: 'Filtrar',
                    ClearButton: 'Limpar',
                    StartsWith: 'Começa com',
                    EndsWith: 'Termina com',
                    Contains: 'Contém',
                    Equal: 'Igual',
                    NotEqual: 'Diferente',
                    LessThan: 'Menor que',
                    LessThanOrEqual: 'Menor ou igual',
                    GreaterThan: 'Maior que',
                    GreaterThanOrEqual: 'Maior ou igual',
                    ChooseDate: 'Escolha uma data',
                    EnterValue: 'Digite o valor',
                    Copy: 'Copiar',
                    Group: 'Agrupar por esta coluna',
                    Ungroup: 'Desagrupar por esta coluna',
                    autoFitAll: 'Ajustar automaticamente a todas as colunas',
                    autoFit: 'Ajustar automaticamente a esta coluna',
                    Export: 'Exportar',
                    FirstPage: 'Primeira página',
                    LastPage: 'Última página',
                    PreviousPage: 'Página anterior',
                    NextPage: 'Próxima página',
                    SortAscending: 'Classificar em ordem ascendente',
                    SortDescending: 'Classificar em ordem decrescente',
                    EditRecord: 'Editar registro',
                    DeleteRecord: 'Apagar registro',
                    FilterMenu: 'Filtro',
                    SelectAll: 'Selecionar tudo',
                    Blanks: 'Espaços em branco',
                    FilterTrue: 'Verdadeiro',
                    FilterFalse: 'Falso',
                    NoResult: 'Nenhum resultado encontrada',
                    ClearFilter: 'Limpar filtro',
                    NumberFilter: 'Filtros numéricos',
                    TextFilter: 'Filtros de texto',
                    DateFilter: 'Filtros de data',
                    DateTimeFilter: 'Filtros DateTime',
                    MatchCase: 'Caso de compatibilidade',
                    Between: 'Entre',
                    CustomFilter: 'Filtro customizado',
                    CustomFilterPlaceHolder: 'Digite o valor',
                    CustomFilterDatePlaceHolder: 'Escolha uma data',
                    AND: 'E',
                    OR: 'OU',
                    ShowRowsWhere: 'Mostrar linhas onde:',
                    NotStartsWith: 'Não começa com',
                    Like: 'Como',
                    NotEndsWith: 'Não termina com',
                    NotContains: 'Não contém',
                    IsNull: 'Nula',
                    NotNull: 'Não nulo',
                    IsEmpty: 'Vazia',
                    IsNotEmpty: 'Não está vazio',
                    AddCurrentSelection: 'Adicionar seleção atual para filtrar',
                    UnGroupButton: 'Clique aqui para desagrupar',
                    AutoFitAll: 'Ajustar automaticamente todas as colunas',
                    AutoFit: 'Ajustar automaticamente esta coluna',
                    Clear: 'Clara',
                    FilterMenuDialogARIA: 'Caixa de diálogo do menu de filtro',
                    ExcelFilterDialogARIA: 'Caixa de diálogo de filtro do Excel',
                    DialogEditARIA: 'Caixa de diálogo Editar',
                    ColumnChooserDialogARIA: 'Seletor de coluna',
                    ColumnMenuDialogARIA: 'Caixa de diálogo do menu da coluna',
                    CustomFilterDialogARIA: 'Caixa de diálogo de filtro personalizado',
                    SortAtoZ: 'Ordenar de A a Z',
                    SortZtoA: 'Ordenar Z a A',
                    SortByOldest: 'Classificar por mais antigo',
                    SortByNewest: 'Classificar por mais recente',
                    SortSmallestToLargest: 'Classificar do menor para o maior',
                    SortLargestToSmallest: 'Classificar do maior para o menor',
                    Sort: 'Ordenar',
                    FilterDescription: 'Pressione Alt para baixo para abrir o menu de filtro',
                    SortDescription: 'Pressione Enter para classificar',
                    ColumnMenuDescription:
                        'Pressione Alt para baixo para abrir o menu de colunas',
                    GroupDescription: 'Pressione o espaço Ctrl para agrupar',
                    ColumnHeader: ' cabeçalho da coluna ',
                    TemplateCell: ' é célula modelo',
                    CommandColumnAria: 'é o cabeçalho da coluna da coluna de comando ',
                    DialogEdit: 'Editar caixa de diálogo',
                    ClipBoard: 'prancheta',
                    GroupButton: 'Botão de grupo',
                    UnGroupAria: 'botão desagrupar',
                    GroupSeperator: 'Separador para as colunas agrupadas',
                    UnGroupIcon: 'desagrupar a coluna agrupada ',
                    GroupedSortIcon: 'classificar a coluna agrupada ',
                    GroupedDrag: 'Arraste a coluna agrupada',
                    GroupCaption: ' é célula de legenda de grupo',
                    CheckBoxLabel: 'caixa de seleção',
                    Expanded: 'Expandida',
                    Collapsed: 'Desabou',
                    SelectAllCheckbox: 'Caixa de seleção Selecionar tudo',
                    SelectRow: 'Selecione a linha',
                },
            },
        });
        ganttObj = createGantt(
            {
                dataSource: localizationData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                locale: 'pt-BR',
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
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
    it('checking predecessorsName localization', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        expect(taskName.innerText).toBe('2fsi');
        let taskName1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(5)') as HTMLElement;
        expect(taskName1.innerText).toBe('5ffi');
        let taskName2: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(9) > td:nth-child(5)') as HTMLElement;
        expect(taskName2.innerText).toBe('5ssi');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:927012-Issue in child-parent predecessor validation on initial render without editSettings mappings', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR927012,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                height: '550px',
            }, done);
    });
    it('Checking child to parent predecessor validation during load time without editSettings', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/17/2024');
        expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FS');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Parent predecessor validation without edit settings', () => {
    let ganttObj: Gantt;
    let editingData = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2024'),
            EndDate: new Date('04/21/2024'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2024'), Duration: 0,
                    Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction',
                    Predecessor: '1SS',
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2024'), Duration: 4, Predecessor: '2',
                            resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                                'From an engineer or company specializing in soil testing',
                            subtasks: [
                                { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2024'), Duration: 0, Predecessor: '3', Progress: 30,
                                subtasks: [
                                    {
                                        TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2024'),
                                        Duration: 3, Predecessor: '4', Progress: 30, resources: 4,
                                        info: 'Develop floor plans and obtain a materials list for estimations',
                                        subtasks: [
                                            {
                                                TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2024'),
                                                Duration: 3, Predecessor: '6', resources: [4, 8], info: ''
                                            },
                                            {
                                                TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2024'),
                                                Duration: 0, Predecessor: '7', resources: [12, 5], info: ''
                                            }
                                        ]
                                    }
                                ] 
                                },
                            ]
                        }
                    ]
                },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData,
                allowParentDependency: true,
                    dateFormat: 'MMM dd, y',
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

                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                    gridLines: 'Both',
                    height: '450px',
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
                    { field: 'TaskName',  },
                    { field: 'StartDate' },
                    { field: 'EndDate',  },
                    { field: 'Duration',  },
                    { field: 'Progress',  },
                    { field: 'Predecessor' }
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
                    projectStartDate: new Date('03/25/2024'),
                    projectEndDate: new Date('07/28/2024'),
                    splitterSettings: {
                        position: "35%"
                    }
            }, done);
    });
    it('Checking parent to parent predecessor validation during load time without editSettings', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt chart update value by updateRecordByID in Predecessor and taskname  ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: dataCollection,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks',

                },
                editSettings: {
                    allowAdding: true,
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
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('update value by updateRecordByID methods', () => {
        let data: object = { 
            TaskID: 1,
            TaskName: 'Updated by index value',
            StartDate: new Date('04/02/2024'),
            Duration: 0,
            Progress: 50,
            Predecessor: '100FS-100 days'
            };
        ganttObj.updateRecordByID(data);
        expect(ganttObj.currentViewData[0].ganttProperties.taskName).toBe('Updated by index value');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-969720', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cr969720,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                height: "600px",
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                gridLines: 'Both',
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Indent',
                    'Outdent',
                ],
                includeWeekend: false
            }, done);
    });
    it('Checking StartDate', () => {
        expect(ganttObj.getFormatedDate(ganttObj.flatData[4].ganttProperties.startDate,'M/d/yyyy')).toBe('4/8/2024');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});	describe('CR-786381', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cr786381,
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                    notes: 'info',
                    resourceInfo: 'resources'
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
                height: '650px',
                rowHeight: 46,
                enableHover: true,
                taskbarHeight: 25,
                treeColumnIndex: 1,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: editingResources,
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                projectStartDate: new Date('03/26/2025'),
                projectEndDate: new Date('09/01/2025'),
            }, done);
    });
    it('Cheching predecessor length', () => {
        expect(ganttObj.flatData[5].ganttProperties.predecessor.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-802590', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: "Planning and Permits", StartDate: new Date("12/01/2025"), Duration: 1, },
                    { TaskID: 2, TaskName: "Site Evaluation", StartDate: new Date("12/01/2025"), Duration: 1, ParentId: 1 },
                    { TaskID: 3, TaskName: "Obtain Permits", StartDate: new Date("12/02/2025"), Duration: 1, },
                    { TaskID: 4, TaskName: "Finalize Planning", StartDate: new Date("12/03/2025"), Duration: 1, },
                ],
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                enablePredecessorValidation: false,
                durationUnit: "Day",
                workUnit: "Day",
                taskType: "FixedDuration",
                taskMode: "Auto",
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    newRowPosition: "Below"
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                allowSelection: true,
                gridLines: 'Both',
                height: '650px',
                rowHeight: 46,
                enableHover: true,
                taskbarHeight: 25,
                treeColumnIndex: 1,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                timezone: "UTC",
                includeWeekend: true,
                actionBegin: function (args) {
                    if (args.requestType == "beforeOpenAddDialog") {
                    }
                },
                created: function () {
                    if (document.querySelector('.e-bigger')) {
                        ganttObj.rowHeight = 48;
                        ganttObj.taskbarHeight = 28;
                    }
                },
                resources: [
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
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                    { resourceId: 13, resourceName: 'Nancy Davolio' },
                    { resourceId: 14, resourceName: 'Anne Dodsworth' },
                ],
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
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', validationRules: { required: true, minLength: [5, 'Task name should have a minimum length of 5 characters'], } },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration', validationRules: { required: true } },
                    { field: 'Progress', validationRules: { required: true, min: 0, max: 100 } },
                    { field: 'Predecessor' }
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
            }, done);
    });
    it('Checking for startdate', (done: Function) => {
        var record = {
            TaskID: 10,
            TaskName: 'Identify Site location',
            StartDate: new Date("12/03/2025"),
            Duration: 3,
            Progress: 50,
            Predecessor: "4FS"
        };
        ganttObj.editModule.addRecord(record);
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType == "add") {
                expect(ganttObj.getFormatedDate( ganttObj.currentViewData[0].ganttProperties.startDate, 'hh:mm')).toBe('08:00');
            }
            done();
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Offest calculation on Load time', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewDataTimezone,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                allowSelection: true,
                gridLines: 'Both',
                height: '650px',
                rowHeight: 46,
                taskbarHeight: 25,
                treeColumnIndex: 1,
                highlightWeekends: true,
                autoUpdatePredecessorOffset: true,
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                },
                splitterSettings: {
                    columnIndex: 3
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                
                }],
            }, done);
    });
    it('Checking for offset', (done: Function) => {
        expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('3FS+3 days,4FS');
        done();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Offest calculation on dynamic change', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewDataTimezone,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                allowSelection: true,
                gridLines: 'Both',
                height: '650px',
                rowHeight: 46,
                taskbarHeight: 25,
                treeColumnIndex: 1,
                highlightWeekends: true,
                autoUpdatePredecessorOffset: true,
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                },
                splitterSettings: {
                    columnIndex: 3
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                
                }],
            }, done);
    });
    it('Changing includeWeekend true', (done: Function) => {
        ganttObj.includeWeekend = true;
        expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('3FS+3 days,4FS');
        expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FS');
        done();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt incorrect predecessor value', () => {
    let ganttObj: Gantt;
    let datasource : any = [
        { 
            TaskID: 1, 
            TaskName: 'Concept Approval', 
            StartDate: new Date('04/02/2019'), 
            Duration: 2, 
            Predecessor: "1" 
        }
    ]
    beforeAll((done) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID'},
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'End Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
            }, done);
    });
    it('Check predecessor is undefined', () => {
        expect(ganttObj.flatData[0].ganttProperties.predecessor).toBe(undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dynamically empty Gantt when parent predecessor pressent', () => {
    let ganttObj: Gantt;
    beforeAll((done) => {
        ganttObj = createGantt(
            {
                dataSource: emptyDataSource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
            }, done);
    });
    it('Check dynamically empty data source when parent predecessor present', () => {
        ganttObj.dataSource = [];
        expect((ganttObj.dataSource as Object[]).length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Improve coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done) => {
        ganttObj = createGantt(
            {
                dataSource: emptyDataSource,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
            }, done);
    });
        it('checkIsParent method', () => {
            ganttObj.predecessorModule['checkIsParent']('2'); 
                });
        it('getRootParent method', () => {
            
            const data: any = []
        ganttObj.predecessorModule['getRootParent'](data); 
        });
        it('getConstraintDate method', function () {
            (ganttObj as any).predecessorModule['getConstraintDate'](2,'', '', '');
        });
        it('getConstraintDate method', function () {
            (ganttObj as any).predecessorModule['getConstraintDate'](7,'', '', '');
        });
        it('getConstraintDate method', function () {
            (ganttObj as any).predecessorModule['getConstraintDate'](10,'', '', '');
        });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dependency.handleUndoRedoParentRecords - coverage tests', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: columnTemplateData,
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
            }, done);
    });

    it('invoke handleUndoRedoParentRecords when undoRedoModule and cellEditModule.isCellEdit are present', () => {
        // prepare undo collection with lastUndo present and cell edit active
        (ganttObj as any).undoRedoModule = { getUndoCollection: [{}, { some: 'last' }] };
        (ganttObj as any).editModule = { cellEditModule: { isCellEdit: true } };
        const parentRecords = [{ TaskID: 100 }];
        (ganttObj.predecessorModule as any)['handleUndoRedoParentRecords'](parentRecords);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('ensurePredecessorCollectionHelper coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: columnTemplateData,
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
                durationUnit: 'Day'
            }, done);
    });

    it('number predecessor - cover typeof number branch', () => {
        const ganttData: any = ganttObj.flatData[0];
        const ganttProp: any = {
            predecessorsName: 2,
            rowUniqueID: ganttData.ganttProperties.rowUniqueID
        };
        ganttObj.predecessorModule['ensurePredecessorCollectionHelper'](ganttData, ganttProp);
    });

    it('object predecessor - offset null (offsetUnits is null) branch', () => {
        ganttObj.durationUnit = 'Day';
        const ganttData: any = ganttObj.flatData[0];
        const ganttProp: any = {
            predecessorsName: [{ from: 2, type: 'FS', /* offset omitted => null */ }],
            rowUniqueID: ganttData.ganttProperties.rowUniqueID
        };
        ganttObj.predecessorModule['ensurePredecessorCollectionHelper'](ganttData, ganttProp);
    });

    it('object predecessor - offset as string branch', () => {
        const ganttData: any = ganttObj.flatData[0];
        const ganttProp: any = {
            predecessorsName: [{ from: 2, type: 'FS', offset: '3d' }],
            rowUniqueID: ganttData.ganttProperties.rowUniqueID
        };
        ganttObj.predecessorModule['ensurePredecessorCollectionHelper'](ganttData, ganttProp);
    });

    it('object predecessor - offset as number branch', () => {
        const ganttData: any = ganttObj.flatData[0];
        const ganttProp: any = {
            predecessorsName: [{ from: 2, type: 'FS', offset: 5 }],
            rowUniqueID: ganttData.ganttProperties.rowUniqueID
        };
        ganttObj.predecessorModule['ensurePredecessorCollectionHelper'](ganttData, ganttProp);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dependency.getRecord coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: columnTemplateData,
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
        }, done);
    });

    it('getRecord - branch when record is null (uses predecessor.to)', () => {
        (ganttObj as any).editModule = {
            taskbarEditModule: {
                previousIds: [10, 20, 30],
                previousFlatData: [{ TaskID: 10 }, { TaskID: 20 }, { TaskID: 30 }]
            }
        };
        const predecessor: any = { to: 20 };
        const result = (ganttObj.predecessorModule as any).getRecord({}, null, predecessor);
    });

    it('getRecord - branch when parentGanttRecord is null (uses predecessor.from)', () => {
        (ganttObj as any).editModule = {
            taskbarEditModule: {
                previousIds: ['A', 'B', 'C'],
                previousFlatData: [{ TaskID: 'A' }, { TaskID: 'B' }, { TaskID: 'C' }]
            }
        };
        const predecessor: any = { from: 'B' };
        const result = (ganttObj.predecessorModule as any).getRecord(null, {}, predecessor);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('generatePredecessorValue - direct invocation coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    dependency: 'Predecessor'
                },
            }, done);
    });

    it('day unit - plural and singular', () => {
        const depModule: any = (ganttObj as any).predecessorModule;
        // plural
        depModule.generatePredecessorValue({ offset: 3, offsetUnit: 'day' }, '1FS');
        // singular
        depModule.generatePredecessorValue({ offset: 1, offsetUnit: 'day' }, '1FS');
    });

    it('hour and minute units', () => {
        const depModule: any = (ganttObj as any).predecessorModule;
        depModule.generatePredecessorValue({ offset: 2, offsetUnit: 'hour' }, '1FS');
        depModule.generatePredecessorValue({ offset: 1, offsetUnit: 'hour' }, '1FS');
        depModule.generatePredecessorValue({ offset: 5, offsetUnit: 'minute' }, '1FS');
        depModule.generatePredecessorValue({ offset: 1, offsetUnit: 'minute' }, '1FS');
    });
    it('week and month units', () => {
        const depModule: any = (ganttObj as any).predecessorModule;
        depModule.generatePredecessorValue({ offset: 3, offsetUnit: 'week' }, '1FS');
        depModule.generatePredecessorValue({ offset: 1, offsetUnit: 'week' }, '1FS');
        depModule.generatePredecessorValue({ offset: 2, offsetUnit: 'month' }, '1FS');
        depModule.generatePredecessorValue({ offset: 1, offsetUnit: 'month' }, '1FS');
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('Dialog-edit offset duration unit handling', () => {
    let ganttObj: Gantt;
    let datasource: any = [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('04/02/2019'),
            Duration: 4,
            Progress: 50,
            child: 'subtasks',
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Identify Site location',
                    StartDate: new Date('04/02/2019'),
                    Duration: 2,
                    Progress: 50,
                    Predecessor: '1FS+5Days'
                }
            ]
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                durationUnit: 'Day',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' },
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                gridLines: 'Both',
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day'
                    }
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });

    it('Offset with numeric value when durationUnit is defined', () => {
        (ganttObj as any).predecessorModule['getOffsetDurationUnit'](undefined);
    });

    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Allow Dependency type improvement -All case restrict coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: [],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe('5FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement -No case restricted coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                allowedDependencyTypes: ['FS', 'SS','SF', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes empty[] -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].type).toBe('FF');
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe('5FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement -FS allowed coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                allowedDependencyTypes: ['FS', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes -FS -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].type).toBe('FF');
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe('5FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement -SF allowed coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                allowedDependencyTypes: ['SF', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes -SF -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].type).toBe('FF');
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe('5FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement -SS allowed coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                allowedDependencyTypes: ['SS'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes -SS -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].type).toBe('SS');
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement -FF allowed coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                allowedDependencyTypes: ['FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes -FF -initial load case', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].type).toBe('FF');
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe('5FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement-cell edit coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: ['FS', 'SS','SF', 'FF'],
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
                    { field: 'Predecessor', headerText: 'Predecessor'},
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false }
                ],
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                splitterSettings: {
                    columnIndex: 3
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -cell edit case', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '2FS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        //checking dependency values for task which have allowedDependencyTypes:
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.allowedDependencyTypes.length).toBe(4);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- toolbar add coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: ['FS', 'SS','SF', 'FF'],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search'
                ],
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
                    { field: 'Predecessor', headerText: 'Predecessor'},
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false }
                ],
                editDialogFields: [
                    { type: 'Dependency' }
                ],
                addDialogFields: [
                    { type: 'Dependency' }
                ],
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                splitterSettings: {
                    columnIndex: 3
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -toolbar add actn', () => {
        ganttObj.openAddDialog();
        let addIcon: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems').querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_add') as HTMLElement;
        triggerMouseEvent(addIcon, 'click');
        let inputElement: HTMLElement = document.getElementById(ganttObj.element.id + 'DependencyTabContainername') as HTMLElement;
        if (inputElement) {
            let input :any = (inputElement as any).ej2_instances[0];
            input.value = "3-Defining target audience";
            input.dataBind();
            let idInput: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainerid') as any).ej2_instances[0];
            idInput.value = "2";
            idInput.dataBind();
            let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
            triggerMouseEvent(toolbar, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        }
        //checking dependency values for task which have allowDependencyTypes:
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.allowedDependencyTypes.length).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- edit dialog case coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: ['FS', 'SS','SF', 'FF'],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search'
                ],
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
                    { field: 'Predecessor', headerText: 'Predecessor'},
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false }
                ],
                editDialogFields: [
                    { type: 'Dependency' }
                ],
                addDialogFields: [
                    { type: 'Dependency' }
                ],
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                splitterSettings: {
                    columnIndex: 3
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -edit dialog actn', () => {
        ganttObj.openEditDialog(3);
        let addIcon: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems').querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_add') as HTMLElement;
        triggerMouseEvent(addIcon, 'click');
        let inputElement: HTMLElement = document.getElementById(ganttObj.element.id + 'DependencyTabContainername') as HTMLElement;
        if (inputElement) {
            let input :any = (inputElement as any).ej2_instances[0];
            input.value = "3-Defining target audience";
            input.dataBind();
            let idInput: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainerid') as any).ej2_instances[0];
            idInput.value = "2";
            idInput.dataBind();
            let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
            triggerMouseEvent(toolbar, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        }
        //checking dependency values for task which have allowedDependencyTypes:
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.allowedDependencyTypes.length).toBe(4);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe('3FS');
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- addPredecessor method coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: ['FS'],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search'
                ],
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
                    { field: 'Predecessor', headerText: 'Predecessor'},
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false }
                ],
                editDialogFields: [
                    { type: 'Dependency' }
                ],
                addDialogFields: [
                    { type: 'Dependency' }
                ],
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                splitterSettings: {
                    columnIndex: 3
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -by update addPredecessor method actn', () => {
        ganttObj.addPredecessor(Number(ganttObj.flatData[1].ganttProperties.taskId), '4SS');
        //checking dependency values for task which have allowedDependencyTypes:
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.allowedDependencyTypes.length).toBe(1);
        expect(ganttObj.currentViewData[1]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- removePredecessor method coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: allTypeAllowedData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableContextMenu: true,
                allowedDependencyTypes: ['FS'],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search'
                ],
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
                    { field: 'Predecessor', headerText: 'Predecessor'},
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false }
                ],
                editDialogFields: [
                    { type: 'Dependency' }
                ],
                addDialogFields: [
                    { type: 'Dependency' }
                ],
                allowSelection: true,
                gridLines: "Both",
                highlightWeekends: true,
                splitterSettings: {
                    columnIndex: 3
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('With allowedDependencyTypes all types included -by update addPredecessor method actn', () => {
        ganttObj.removePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId));
        //checking dependency values for task which have allowedDependencyTypes:
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.allowedDependencyTypes.length).toBe(1);
        expect(ganttObj.currentViewData[2]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- addPredecessor method-Virtual mode coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtualData2,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'parentID'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                enableVirtualization: true,
                allowSelection: true,
                gridLines: 'Both',
                height: '550px',
                splitterSettings: {
                    columnIndex: 3
                },
                allowedDependencyTypes: ['FS']
            }, done);
    });
    it('check with addPredecessor/removePredecessor method -virtualmode', () => {
        ganttObj.addPredecessor(Number(ganttObj.flatData[30].ganttProperties.taskId), '32SS');
        //checking dependency values for task which have allowedDependencyTypes:
        expect(ganttObj.flatData[30].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.allowedDependencyTypes.length).toBe(1);
        expect(ganttObj.flatData[30]['Predecessor']).toBe('30FS');

        ganttObj.removePredecessor(Number(ganttObj.flatData[30].ganttProperties.taskId));
        expect(ganttObj.flatData[30].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.allowedDependencyTypes.length).toBe(1);
        expect(ganttObj.flatData[30]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- removePredecessor method-virtual mode-cell edit coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtualData2,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'parentID'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                enableVirtualization: true,
                allowSelection: true,
                gridLines: 'Both',
                height: '550px',
                splitterSettings: {
                    columnIndex: 3
                },
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'Predecessor', headerText: 'Predecessor'},
                ],
                allowedDependencyTypes: ['SS']
            }, done);
    });
    it('virtual mode-cell edit', () => {
        ganttObj.ganttChartModule.scrollObject.setScrollTop(560);
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(23) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '143SF';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(25) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.flatData[143].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.flatData[143]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
//Split task
describe('T1042999-Restrict Dependency type improvement- split task load coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['FS', 'SS'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Split-task initial load', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[5].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe("3FS,5FS");
        expect(ganttObj.currentViewData[6].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[6]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- split task-cell edit coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['FS', 'SS'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('split task -cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '3SF';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[4]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- split task load coverage -SF, FF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: revSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['SF', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Split-task initial load', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[5].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- split task-cell edit coverage- SF, FF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['SF', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('split task -cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '3SS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[4]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[3].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[3]['Predecessor']).toBe("3FF");
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- split task load coverage -SF, FF prevent', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: revSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['SF', 'FF'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Split-task cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '5FF';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[2]['Predecessor']).toBe("5FF");
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- split task-cell edit coverage- FS, SS prevent', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depSegmentData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                allowedDependencyTypes: ['FS', 'SS'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 90 },
                    { field: 'TaskName', headerText: 'Job Name', width: '140' },
                    { field: 'Predecessor' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "26%",
                },
                gridLines: "Both",
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('split task -cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '3SS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[5].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe("3SS");
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
//Resource view:
describe('T1042999-Restrict Dependency type improvement- resource view load coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['FS', 'SS'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Resource view initial load', () => {
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[4]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[5].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe(null);
        expect(ganttObj.currentViewData[13].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[13]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- resource view-cell edit coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['FS', 'SS'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('resource view-cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(9) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '11FF';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[8].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[8]['Predecessor']).toBe('9SS');
        expect(ganttObj.currentViewData[6].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[2]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- resource view load coverage -SF, FF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['SF', 'FF'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Resource view- initial load', () => {
        expect(ganttObj.currentViewData[6].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[6]['Predecessor']).toBe('6FF');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(1);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe("3FF");
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- resource view-cell edit coverage- SF, FF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['SF', 'FF'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('resource view-cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '2SS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[4].ganttProperties.predecessor.length).toBe(2);
        expect(ganttObj.currentViewData[4]['Predecessor']).toBe('6FF');
        expect(ganttObj.currentViewData[9].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[9]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement-Resource view load coverage -SF, FF prevent', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['SF', 'FF'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Resource view-load time', () => {
        expect(ganttObj.currentViewData[11].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[11]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('T1042999-Restrict Dependency type improvement- Resource view-cell edit coverage- FS, SS prevent', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: depRstrcitResourcesData,
                resources: resourceCollection,
                viewType: 'ResourceView',
                allowedDependencyTypes: ['FS', 'SS'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
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
                    { field: 'Predecessor', headerText: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: {
                    columnIndex: 3
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Resource view-cell edit', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(10) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '9SF';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[5].ganttProperties.predecessor.length).toBe(0);
        expect(ganttObj.currentViewData[5]['Predecessor']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            ganttObj.destroy();
        }
    });
});
describe('Predecessor offset vs durationUnit', () => {
        let ganttObj: Gantt;
        let ds: any[] = [
            {
                TaskID: 1,
                TaskName: 'Project Initiation',
                StartDate: new Date('04/14/2024'),
                EndDate: new Date('04/14/2024'),
                subtasks: [
                    {
                        TaskID: 2,
                        TaskName: 'Identify Site location',
                        StartDate: new Date('04/14/2024'),
                        Duration: 2,
                        Progress: 50
                    }
                ]
            },
            {
                TaskID: 3,
                TaskName: 'Project Estimation',
                StartDate: new Date('04/12/2024'),
                EndDate: new Date('04/12/2024')
            },
            {
                TaskID: 4,
                TaskName: 'Develop floor plan for estimation',
                StartDate: new Date('04/12/2024'),
                Duration: 3,
                Progress: 50,
                Predecessor: '1FS+2',
                ParentID: 3
            }
        ];

        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: ds,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        parentID: 'ParentID'
                    }
                },
                done
            );
        });

        it('Predecessor with days offset remains days when durationUnit changed to hours', () => {
            ganttObj.durationUnit = 'Hour';
            ganttObj.dataBind();
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe('1FS+2 days');
        });

        afterAll(() => {
            if (ganttObj) {
                ganttObj.destroy();
            }
        });
    });