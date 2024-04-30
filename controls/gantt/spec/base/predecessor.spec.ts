/**
 * Gantt predecessor base spec
 */
import { createElement, remove, L10n } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../../src/index';
import { destroyGantt, createGantt, triggerMouseEvent } from './gantt-util.spec';
import { ContextMenuClickEventArgs} from './../../src/gantt/base/interface';
import { columnTemplateData, data15, editingData13, editingData14, editingData15, editingData16, editingData17, predData1, predData2, predData3, predData4, predData5, predData6, predData8 } from './data-source.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);

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
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Predecessor id without type - testing', (done : Function) => {
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
        it('Duration unit with hour - testing', (done : Function) => {
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
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });

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
        destroyGantt(ganttObj);
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
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
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
    let datasource = [
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
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyy')).toBe('2/2/2024');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('CR:880619-Timeline does not render properly while predecessor offset value in negative values', () => {
    let ganttObj: Gantt;
    let data = [
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
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe("01/21/2024");
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('CR:881509-L10n method locale not applied for dependency for days', () => {
    let ganttObj: Gantt;
    let data = [
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
        destroyGantt(ganttObj);
    });
});
