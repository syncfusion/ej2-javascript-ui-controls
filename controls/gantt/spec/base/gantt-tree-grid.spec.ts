/**
 * Gantt base spec
 */
import { Gantt, ColumnMenu } from '../../src/index';
import { baselineData, filterdata } from './data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
describe('Gantt spec for  scroll', () => {
    Gantt.Inject(ColumnMenu);
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Scroll-Task-Date Testing', () => {
            ganttObj.ganttChartModule.scrollElement.scrollLeft = 100;
            ganttObj.scrollToDate('10/23/2017');
            expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(0);
        });
        it('Scroll-Task-ID Testing', () => {
            ganttObj.ganttChartModule.scrollElement.scrollLeft = 800;
            ganttObj.scrollToTask('3');
            //expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
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
            //expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(10);
        });
        it('Column menu click', () => {
            ganttObj.showColumnMenu = true;
            ganttObj.refresh();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol > div.e-gridheader.e-lib.e-droppable > div > table > thead > tr > th:nth-child(1) > div.e-icons.e-columnmenu') as HTMLElement;
            element.click();
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
                gridLines:'Both',
               projectStartDate: new Date('10/23/2017'),
               projectEndDate: new Date('12/23/2017')
            }, done);

        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('scrollToDate', () => {
            ganttObj.scrollToDate('12/03/2017');
            let scrollLeft: number = getValue('element.scrollLeft', ganttObj.ganttChartModule.scrollObject);
            let gridLeft: number = ganttObj.chartVerticalLineContainer.offsetLeft;
            //expect(scrollLeft === Math.abs(gridLeft)).toBe(true);
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
                  {
                    field: 'TaskName',
                    headerText: 'Task Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                  },
                  { field: 'StartDate', headerText: 'Start Date' },
                  { field: 'Duration', headerText: 'Duration', editType: 'numericedit',type:"number" },
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
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('column type', () => {
            expect(ganttObj.treeGridModule.treeGridColumns[2].type).toBe('number')

        });
    });
});
