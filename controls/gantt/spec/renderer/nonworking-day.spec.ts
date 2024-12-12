/**
 * Gantt base spec
 */
import { Gantt, DayMarkers, Edit, Toolbar, ContextMenu, Sort, VirtualScroll, Selection } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData, projectData, weekenddata } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(DayMarkers, Edit, Toolbar, ContextMenu, Sort, VirtualScroll, Selection);

describe('Gantt spec for non -working-day', () => {
    describe('Gantt base module', () => {
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
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
                workWeek: ['Tuesday'],
                renderBaseline: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 2
                    },
                    timelineUnitSize: 60,
                    weekStartDay: 2
                },
                holidays: [{
                    from: '10/15/2017',
                    to: '10/20/2017',
                    label: 'public holiday',
                    cssClass: 'holiday'
                },
                {
                    from: '10/29/2017',
                    label: 'public holiday',
                },
                {
                    to: '11/05/2017',
                    label: 'public holiday',
                }],
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        it('Non-working-Day Testing', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "refresh") {
                    expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.nonworkingContainer}`)).toBe(null);
                    expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.holidayContainer}`)).toBe(null);
                }
            };
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.holidayElement}`)['style'].width).toBe('180px');
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.holidayElement}`).textContent).toBe('public holiday');
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.holidayElement}`).
                classList.contains('holiday')).toBe(true);
            let holidayObj: Array<Object> = [{
                from: '10/20/2017',
                to: '10/25/2017',
            }];
            ganttObj.holidays = holidayObj;
            ganttObj.dataBind();
            ganttObj.holidays = [];
            ganttObj.dataBind();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Empty holidays', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                holidays: [
                    {
                        from: new Date('04/04/2019'),
                        to: new Date('04/04/2019'),
                        label: 'Local Holiday'
                    }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                highlightWeekends: true,
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
        it('Non-working-Day Testing', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === 'refresh') {
                    expect(ganttObj.currentViewData.length).toBe(2);
                }
            };
            ganttObj.holidays = [];
            ganttObj.projectStartDate = new Date('03/20/2019');
            ganttObj.projectEndDate = new Date('07/10/2019');
            ganttObj.dataSource = [
                {
                    TaskID: 1,
                    TaskName: 'Product concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 2,
                            TaskName: 'Defining the product and its usage',
                            StartDate: new Date('04/02/2019'),
                            Duration: 3,
                            Progress: 30
                        }
                    ]
                }
            ];
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});
describe('874399 - weekend is not visible', function () {
    let ganttObj: Gantt;
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: weekenddata,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                notes: 'Notes',
                parentID: 'ParentId'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID' },
                { field: 'TaskName', width: 80 },
                { field: 'StartDate', width: 120 },
                { field: 'EndDate', width: 120 },
                { field: 'Duration', width: 90 },
                { field: 'TaskType', visible: false }
            ],
            enableTimelineVirtualization: true,
            sortSettings: {
                columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
            },
            splitterSettings: {
                columnIndex: 4
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
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
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('07/06/2024')
        }, done);
    });
    it('editing startdate', () => {
        ganttObj.dataBind();
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('03/04/2024');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        ganttObj.selectRow(0);
        expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].left).toBe('0px');
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});	