/**
 * Gantt base spec
 */
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../../src/index';
import { baselineData, filterdata } from './data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: baselineData,
            autoFocusTasks: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            renderBaseline: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day'
                },
                timelineUnitSize: 60,
                weekStartDay: 1
            }
        }, done);

    });
    it('Scroll-Task-Date Testing', () => {
        ganttObj.ganttChartModule.scrollElement.scrollLeft = 100;
        ganttObj.scrollToDate('10/23/2017');
        expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(0);
    });
    it('Scroll-Task-ID Testing', () => {
        ganttObj.ganttChartModule.scrollElement.scrollLeft = 800;
        ganttObj.scrollToTask('3');
        expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
    });
    it('gantt-Chart-Click Testing', () => {
        let element: HTMLElement = ganttObj.element.querySelector('.e-grid .e-content tbody tr td') as HTMLElement;
        ganttObj.ganttChartModule.scrollElement.scrollLeft = 300;
        element.click();
        expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(0);
        ganttObj.scrollToDate('1/03/2019');
    });
    it('Scroll-Task Testing', () => {
        let element: HTMLElement = ganttObj.treeGridPane.querySelectorAll('.e-table')[1]['rows'][2].cells[0] as HTMLElement;
        element.click();
        expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-Issue-EJ2-49364-', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: baselineData,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            gridLines: 'Both',
            projectStartDate: new Date('10/23/2017'),
            projectEndDate: new Date('12/23/2017')
        }, done);

    });
    it('scrollToDate', () => {
        ganttObj.scrollToDate('12/03/2017');
        let scrollLeft: number = getValue('element.scrollLeft', ganttObj.ganttChartModule.scrollObject);
        let gridLeft: number = ganttObj.chartVerticalLineContainer.offsetLeft;
        // expect(scrollLeft === Math.abs(gridLeft)).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-Issue-EJ2-EJ2-65261', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: filterdata,
            dateFormat: 'MM/dd/yyyy',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks',
            },
            columns: [
                { field: 'TaskID', visible: false },
                {
                    field: 'TaskName',
                    headerText: 'Task Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'Duration', headerText: 'Duration', editType: 'numericedit', type: "number" },
                { field: 'EndDate', headerText: 'End Date' },
                { field: 'Predecessor', headerText: 'Predecessor' },
            ],
            treeColumnIndex: 0,
            toolbar: ['Search'],
            allowFiltering: true,
            includeWeekend: true,
            height: '450px',
            timelineSettings: {
                timelineUnitSize: 60,
                topTier: {
                    format: 'MMM dd, yyyy',
                    unit: 'Day',
                },
                bottomTier: {
                    unit: 'Hour',
                    format: 'h.mm a',
                },
            },
            splitterSettings: {
                columnIndex: 3,
            },
            durationUnit: 'Day',
            dayWorkingTime: [{ from: 1, to: 24 }],
            labelSettings: {
                rightLabel: 'TaskName',
            },
            projectStartDate: new Date('07/15/1969 01:00:00 AM'),
            projectEndDate: new Date('07/25/1969'),

        }, done);

    });
    it('column type', () => {
        expect(ganttObj.treeGridModule.treeGridColumns[3].type).toBe('number')
    });
    it('column type', () => {
        let args = [];
        args[0] = "sample";
        ganttObj['portals'] = [];
        ganttObj.treeGridModule['renderReactTemplate'](args);
        expect(ganttObj.treeGridModule.treeGridColumns[3].type).toBe('number')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Coverage issue changeDelocale', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: filterdata,
            dateFormat: 'MM/dd/yyyy',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks',
            },
            columns: [
                { field: 'TaskID', visible: false },
                {
                    field: 'TaskName',
                    headerText: 'Task Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate', headerText: 'Start Date' },
                { field: 'Duration', headerText: 'Duration', editType: 'numericedit', type: "number" },
                { field: 'EndDate', headerText: 'End Date' },
                { field: 'Predecessor', headerText: 'Predecessor' },
            ],
            treeColumnIndex: 0,
            toolbar: ['Search'],
            allowFiltering: true,
            includeWeekend: true,
            height: '450px',
            timelineSettings: {
                timelineUnitSize: 60,
                topTier: {
                    format: 'MMM dd, yyyy',
                    unit: 'Day',
                },
                bottomTier: {
                    unit: 'Hour',
                    format: 'h.mm a',
                },
            },
            splitterSettings: {
                columnIndex: 3,
            },
            durationUnit: 'Day',
            dayWorkingTime: [{ from: 1, to: 24 }],
            labelSettings: {
                rightLabel: 'TaskName',
            },
            projectStartDate: new Date('07/15/1969 01:00:00 AM'),
            projectEndDate: new Date('07/25/1969'),

        }, done);
    });
    it('changeDelocale ', () => {
        const dependencyString = 'Finish to FinishFF,Task 1,Finish to StartFS,Task 2,Start to StartSS,Start to FinishSF,Task 3';
        ganttObj.treeGridModule.changeDelocale(dependencyString);
        expect(ganttObj.flatData.length).toBe(1)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Unscheduled task rendering with duration alone', () => {
    let ganttObj: Gantt;
    let editingData = [
        {
          TaskID: 1,
          TaskName: 'Product concept',
          StartDate: new Date('04/02/2024'),
          EndDate: new Date('04/21/2024'),
          subtasks: [
            {
              TaskID: 2,
              TaskName: 'Defining the product and its usage',
              Duration: 3,
              Progress: 30,
            },
            {
              TaskID: 3,
              TaskName: 'Defining target audience',
              Duration: 3,
            },
            {
                TaskID: 4,
                TaskName: 'Prepare product sketch and notes',
                StartDate: new Date('04/02/2024'),
                Duration: 2,
                Predecessor: '2',
                Progress: 30,
              },
          ],
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: editingData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration:'Duration',
            progress: 'Progress',
            child: 'subtasks',
            notes: 'info',
            resourceInfo: 'resources',
            manual: 'isManual',
        },
        renderBaseline: true,
        baselineColor: 'red',
        editSettings: {
             allowEditing: true,
            allowTaskbarEditing: true,
        },
        columns: [
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        allowUnscheduledTasks: true
        }, done);
    });
    it('parent dates update', () => {
        expect(ganttObj.flatData[0].ganttProperties.endDate.getDate()).toBe(4);
    });
    it('check max limit value', () => {
        expect(ganttObj.treeGridModule['maxLimits']('minute')).toBe(24000);
        expect(ganttObj.treeGridModule['maxLimits']('hour')).toBe(1440000);
        expect(ganttObj.treeGridModule['maxLimits']('min')).toBe(1000);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: baselineData,
            autoFocusTasks: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            renderBaseline: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day'
                },
                timelineUnitSize: 60,
                weekStartDay: 1
            }
        }, done);

    });
    it('Column menu click', () => {
        ganttObj.showColumnMenu = true;
        ganttObj.refresh();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol > div.e-gridheader.e-lib.e-droppable > div > table > thead > tr > th:nth-child(1) > div.e-headercell-container > div.e-icons.e-columnmenu') as HTMLElement;
        element.click();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
