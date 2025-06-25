/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort, ColumnMenu, ITaskbarClickEventArgs, RecordDoubleClickEventArgs,ExcelExport ,PdfExport ,Reorder, Resize, CriticalPath, VirtualScroll} from '../src/index';
import { unscheduledData, projectResources, resourceGanttData, dragSelfReferenceData, selfReference, projectData1,baselineDatas, projectNewData2, totalDurationData, filterdata, projectNewData9, projectNewData10, projectNewData11, projectNewData12, selfData1, splitTasksData1, projectNewData13, publicProperty, cellEditData, resourcesData, cr884998,treeData,invalidPrdcessor, dataSource2, dataSource1, cR893051, undoDataSource, editingData3,editingResources3, exportData1,resourceCollection10,projectNewDatas1, cr940492} from './base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './base/gantt-util.spec';
import { getValue, setValue } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Edit, Selection, ContextMenu, Sort, Toolbar, Filter, DayMarkers, ColumnMenu, ExcelExport , PdfExport, Reorder, Resize,CriticalPath, VirtualScroll);

describe('gantt task creation with duration unit and work mapping in taskfields', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('2025-02-19T08:00:00'), EndDate: new Date('2025-02-19T15:46:38'),
            //Duration:5.5,
            Progress: '60',
            DurationUnit: "hour",
            Segments: [
                { StartDate: new Date('2025-02-19T08:00:00'), EndDate: new Date('2025-02-19T14:00:00') },
                { StartDate: new Date('2025-02-19T14:30:00'), EndDate: new Date('2025-02-19T15:46:38') },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                work: 'Work',
                segments: 'Segments',
                durationUnit: "DurationUnit",
            },
            treeColumnIndex:1,
            enableContextMenu: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            dayWorkingTime : [
                {from: 0,
                to: 24 }
            ],

            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                { field: 'StartDate',  },
                { field: 'EndDate',},
                { field: 'Duration'}, 
                { field: 'Progress' }
            ],

            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            allowSelection: true,
            splitterSettings: {
                position: "50%",
            },
            gridLines: "Both",
            highlightWeekends: true,
            timelineSettings : {
                showTooltip: true,
                topTier: {
                    unit: 'Day',
                    format: 'dd MMM'
                },
                bottomTier: {
                    unit: 'Hour',
                    format: 'HH'
                },
                timelineViewMode:'Day'
            },
            allowUnscheduledTasks: true,
        }, done);
    });
    it('gantt task creation with duration unit and work mapping', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'M/dd/yyyy h:mm:ss')).toBe('2/19/2025 3:46:38');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

