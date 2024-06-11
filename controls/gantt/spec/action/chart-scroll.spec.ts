/**
 * Gantt chart-scroll spec
 */
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../../src/index';
import { projectData1, virtualData, exportData1, projectNewData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerScrollEvent } from '../base/gantt-util.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt chart-scroll support', () => {
    describe('Gantt chart-scroll action', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: exportData1,
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
                    gridLines: 'Vertical',
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Set scrollTop using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setScrollTop(300);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(300);
        });

        it('Set ChartScroll Width using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setWidth(400);
            expect(ganttObj.ganttChartModule.scrollElement.style.width).toBe('400px');
        });

        it('Set scroll left for scroll container using public method', () => {
            ganttObj.ganttChartModule.scrollObject.setScrollLeft(500);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(500);
        });

        it('Chart scroll Function', () => {
            let chartscroll: HTMLElement = ganttObj.element.querySelector('.e-chart-scroll-container') as HTMLElement;
            triggerScrollEvent(chartscroll, 500, 700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(500);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(700);
        });

        it('Treegrid scroll Function', () => {
            let gridscroll: HTMLElement = ganttObj.treeGrid.element.querySelector('.e-content') as HTMLElement;
            triggerScrollEvent(gridscroll, 50);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(50);
        });

        it('Update Chart Scroll Value by public method', () => {
            ganttObj.updateChartScrollOffset(400, 700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollTop).toBe(700);
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(400);
        });
    });
});
describe('Gantt chart-scroll action in resource view', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
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
                    }],
                resources: [{ resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' }],
                viewType: 'ResourceView',
                showOverAllocation: true,
                allowTaskbarOverlap: false,
                enableRtl: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
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
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                eventMarkers: [
                    {
                        day: '04/17/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                }],
                readOnly: false,
                allowRowDragAndDrop: true,
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('Set scrollTop using public method in resource view', () => {
        ganttObj.ganttChartModule.scrollObject.setScrollTop(300);
    });
    it('Chart scroll Function', () => {
        let chartscroll: HTMLElement = ganttObj.element.querySelector('.e-chart-scroll-container') as HTMLElement;
        triggerScrollEvent(chartscroll, 500, 700);
    });
});