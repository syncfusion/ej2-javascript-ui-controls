/**
 * Gantt chart-scroll spec
 */
import { doesImplementInterface } from '@syncfusion/ej2-grids';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, IGanttData } from './../src/index';
import { projectData1, virtualData, exportData1, projectNewData } from './base/data-source.spec';
import { createGantt, destroyGantt, triggerScrollEvent } from './base/gantt-util.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('end date edting in dialog edit for Unscheduled Tasks', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    {field: 'TaskId', width: 75 },
                    {field: 'TaskName', width: 80 },
                    {field: 'StartDate', width: 120},
                    {field: 'EndDate', width: 120 },
                    {field: 'Duration', width: 90 },
                    {field: 'TaskType', visible: false}
                ],
                splitterSettings: {
                    columnIndex: 4
                },
                toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' },'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
                allowSelection: true,
                gridLines: "Both",
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
            }, done);
    });
    it('end date edting in dialog edit for Unscheduled Tasks', () => {
        let data: object = {
            Duration: null,
              StartDate: null,
              EndDate: null,
              TaskType: ''
       };
        ganttObj.addRecord(data);
        let ganttdata: IGanttData = ganttObj.getRecordByID('1');
        ganttObj.editModule.dialogModule.validateScheduleValuesByCurrentField('EndDate', '3/5/2025', ganttdata);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'M/d/yyyy h:mm:ss')).toBe('3/5/2025 5:00:00');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});