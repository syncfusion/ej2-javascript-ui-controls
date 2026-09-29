/**
  * Gantt base spec
  */
import { Gantt, DayMarkers , Selection, Edit} from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { durationUnitSupportData, baselineData } from '../base/data-source.spec';
import { TimelineSettingsModel } from '../../src/gantt/models/timeline-settings-model';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
describe('Gantt spec for weekend', () => {
    describe('Weekend rendering', () => {
        Gantt.Inject(DayMarkers, Selection);
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
                highlightWeekends: true,
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
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        it('Weekend Testing ', () => {
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].width).toBe('30px');
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekend}`)['style'].height).toBe('100%');
            ganttObj.holidays = [];
            ganttObj.highlightWeekends = false;
            ganttObj.dataBind();
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.nonworkingContainer}`)).toBe(null);
            expect(ganttObj.ganttChartModule.chartBodyContent.querySelector(`.${cls.weekendContainer}`)).toBe(null);
        });
        it('Weekend Testing hour Bottom tier weekend highlight', () => {  
            let timelineObject: TimelineSettingsModel =  {
                topTier: {
                    unit: 'Day',
                },
                bottomTier: {
                    unit: 'Hour',
                    count: 12
                },
            };    
            ganttObj.timelineSettings = timelineObject;
            ganttObj.dataBind();            
            let timelineHeaders = ganttObj.ganttChartModule.chartTimelineContainer.querySelectorAll('tr');
            expect(timelineHeaders[1].querySelectorAll(`.${cls.weekendHeaderCell}`).length).toBe(78);
        });
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });
    describe('Weekend rendering', () => {
        Gantt.Inject(DayMarkers, Selection);
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
                highlightWeekends: false,
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
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('11/30/2017'),
            }, done);
        });
        it('Weekend Testing ', () => {
            ganttObj.highlightWeekends = true
            expect(ganttObj.highlightWeekends).toBe(true)
        })
        afterAll(() => {
           if(ganttObj){
               destroyGantt(ganttObj);
           }
       });
    });

    describe('Duration unit support for Week', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: durationUnitSupportData,
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
                editSettings: {
                    allowEditing: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' }, 
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                durationUnit: 'Week',
                projectStartDate: new Date('04/02/2019'),
                projectEndDate: new Date('04/21/2019'),
            }, done);
        });
        it('supports week duration unit', () => {
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/22/2019');
        });
        it('supports predecessor offset for week duration unit', () => {
            const predecessorCell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(predecessorCell, 'dblclick');
            const input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '2FS+1';
            const updateCell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(updateCell, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[3].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/30/2019');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    
    describe('Duration unit parsing and string coverage (merged)', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [{ TaskID: 1, TaskName: 'Task 1', StartDate: new Date('2024-01-01'), Duration: 1 }],
                taskFields: {
                    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration'
                }
            }, done);
        });

        it('getDurationValue should parse week and month aliases', () => {
            const r1: any = ganttObj.dataOperation.getDurationValue('2 wk');
            expect(r1.duration).toBe(2);
            expect(r1.durationUnit).toBe('week');

            const r2: any = ganttObj.dataOperation.getDurationValue('4 mon');
            expect(r2.duration).toBe(4);
            expect(r2.durationUnit).toBe('month');
        });

        it('getDurationValue should handle numeric input', () => {
            const r: any = ganttObj.dataOperation.getDurationValue(5);
            expect(r.duration).toBe(5);
            expect(r.durationUnit).toBeNull();
        });

        it('getDurationString should return singular and plural labels', () => {
            const s1: string = ganttObj.getDurationString(1, 'week');
            expect(s1.toLowerCase()).toBe('1 week');

            const s2: string = ganttObj.getDurationString(2, 'week');
            expect(s2.toLowerCase()).toBe('2 weeks');

            const s3: string = ganttObj.getDurationString(1, 'month');
            expect(s3.toLowerCase()).toBe('1 month');
        });

        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('Duration unit mapping from data (merged)', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            const data = [{ TaskID: 1, TaskName: 'Task A', StartDate: new Date('2024-01-01'), Duration: 3, DurationUnit: 'wk' }];
            ganttObj = createGantt({
                dataSource: data,
                taskFields: {
                    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', durationUnit: 'DurationUnit'
                }
            }, done);
        });

        it('should normalize duration unit aliases from data to canonical unit', () => {
            expect(ganttObj.flatData[0].ganttProperties.durationUnit).toBe('week');
        });

        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Duration unit mapping from datasource (two tasks)', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            const data = [
                { TaskID: 1, TaskName: 'Task W', StartDate: new Date('2024-01-01'), Duration: 2, DurationUnit: 'wk' },
                { TaskID: 2, TaskName: 'Task M', StartDate: new Date('2024-01-02'), Duration: 3, DurationUnit: 'mon' }
            ];
            ganttObj = createGantt({
                dataSource: data,
                taskFields: {
                    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', durationUnit: 'DurationUnit'
                }
            }, done);
        });

        it('maps wk -> week and mon -> month on load', () => {
            expect(ganttObj.flatData[0].ganttProperties.durationUnit).toBe('week');
            expect(ganttObj.flatData[1].ganttProperties.durationUnit).toBe('month');
        });

        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('getDurationInDay - Week and Month', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [{ TaskID: 1, TaskName: 'Task X', StartDate: new Date('2024-01-01') }],
                taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate' }
            }, done);
        });

        it('converts weeks to days using daysPerWeek', () => {
            ganttObj.daysPerWeek = 6;
            expect((ganttObj as any).dataOperation.getDurationInDay(2, 'week')).toBe(12);
        });

        it('converts months to days using daysPerMonth', () => {
            ganttObj.daysPerMonth = 30;
            expect((ganttObj as any).dataOperation.getDurationInDay(1, 'month')).toBe(30);
        });

        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Duration unit support for Month', () => {
        Gantt.Inject(DayMarkers, Selection, Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: durationUnitSupportData,
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
                editSettings: {
                    allowEditing: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress' }, 
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                durationUnit: 'Month',
                projectStartDate: new Date('04/02/2019'),
                projectEndDate: new Date('04/21/2019'),
            }, done);
        });
        it('supports month duration unit', () => {
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('6/24/2019');
        });
        it('supports predecessor offset for month duration unit', () => {
            const predecessorCell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(predecessorCell, 'dblclick');
            const input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '2FS+1';
            const updateCell: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(updateCell, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[3].ganttProperties.startDate, 'M/dd/yyyy')).toBe('7/23/2019');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('Dynamic durationUnit change', () => {
        it('updates end dates (week then month)', (done: Function) => {
            Gantt.Inject(DayMarkers, Selection, Edit);
            const ganttObj: Gantt = createGantt({
                dataSource: durationUnitSupportData,
                taskFields: {
                    id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate',
                    duration: 'Duration', progress: 'Progress', child: 'subtasks', dependency: 'Predecessor'
                },
                editSettings: { allowEditing: true },
                durationUnit: 'Day',
                projectStartDate: new Date('04/02/2019'),
                projectEndDate: new Date('04/21/2019')
            }, () => {
                // Immediately change to week and assert end date without dataBound/dataBind/timeouts
                ganttObj.durationUnit = 'Week';
                ganttObj.dataBind();
                expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/22/2019');

                // Change to month and assert end date synchronously
                ganttObj.durationUnit = 'Month';
                ganttObj.dataBind();
                expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('6/24/2019');

                destroyGantt(ganttObj);
                done();
            });
        });
    });
    
});
