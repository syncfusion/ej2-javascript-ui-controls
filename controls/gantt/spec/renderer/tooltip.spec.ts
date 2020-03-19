/**
 * Gantt base spec
 */
import { Gantt } from '../../src/index';
import { createElement, getValue } from '@syncfusion/ej2-base';
import { resourceData, scheduleModeData } from '../base/data-source.spec';
import { destroyGantt, triggerMouseEvent, createGantt } from '../base/gantt-util.spec';

describe('Gantt spec for tooltip', () => {
    describe('Gantt tooltip module', () => {
        let ganttObj: Gantt;
        let ele: HTMLElement;
        let tooltip: Element = createElement('div', { id: 'tooltip', styles: 'visibility:hidden' });
        tooltip.innerHTML = '<div>StartDate : ${this.getFormatedDate(StartDate)}</div>';
        document.body.appendChild(tooltip);
        let dLTooltip: Element = createElement('div', { id: 'dLTooltip', styles: 'visibility:hidden' });
        dLTooltip.innerHTML = '<div>Offset : ${offsetString}</div>';
        document.body.appendChild(dLTooltip);
        let bLTooltip: Element = createElement('div', { id: 'bLTooltip', styles: 'visibility:hidden' });
        bLTooltip.innerHTML = '<div>Baseline StartDate : ${this.getFormatedDate(BaselineStartDate)}</div>';
        document.body.appendChild(bLTooltip);

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        'resourceInfo': [1], 'TaskId': 1, 'TaskName': 'Start-Duration', 'cusClass': 'cusclass',
                        'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
                        'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80,
                        'Indicators': [
                            {
                                'date': '10/29/2017',
                                'iconCls': 'fas fa-cat',
                                'name': 'Custom String',
                                'tooltip': 'Follow up'
                            },
                            {
                                'date': '11/1/2017',
                                'iconCls': 'fas fa-dragon',
                                'name': '<span style="color:red">String Template</span>',
                                'tooltip': 'Review results'
                            }
                        ]
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 2, 'TaskName': 'Start-End',
                        'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1'
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 3, 'TaskName': 'Duration-End',
                        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
                        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS'
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 4, 'TaskName': 'Duration-alone',
                        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
                        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65,
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 5, 'TaskName': 'StartDate-alone',
                        StartDate: new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Predecessor': '2'
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 6, 'TaskName': 'EndDate-alone',
                        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65
                    },
                    {
                        'resourceInfo': [2], 'TaskId': 7, 'TaskName': 'Milestone',
                        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, Duration: 0
                    },
                ],
                allowSorting: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children',
                    cssClass: 'cusClass',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    resourceInfo: 'resourceInfo',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                    timelineUnitSize: 40
                },
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowTaskbarEditing: true
                },
                allowUnscheduledTasks: true,
                highlightWeekends: true,
                labelSettings: {
                    taskLabel: 'Progress'
                },
                rowHeight: 30,
                taskbarHeight: 20,
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                resourceIDMapping: 'resourceId',
                resourceNameMapping: 'resourceName',
                resources: resourceData,
                holidays: [
                    {
                        from: '10/16/2017',
                        cssClass: 'e-custom-holiday',
                        label: 'Local Holiday'
                    },
                    {
                        from: '10/19/2017',
                        to: '10/20/2017',
                        label: ' Public holiday',
                        cssClass: 'e-custom-holiday'
                    }
                ],
                eventMarkers: [
                    {
                        day: '10/18/2017',
                        cssClass: 'e-custom-event-marker',
                        label: 'Event Marker 1'
                    }, {
                        day: '10/23/2017',
                        cssClass: 'e-custom-event-marker'
                    }
                ],
            }, done);
        });   
        it('Taskbar Tooltip', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Start-Duration</td></tr><tr><td class = "e-gantt-tooltip-label">Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 10/23/2017</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/26/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td>:</td><td class = "e-gantt-tooltip-value"> 4 days</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td>:</td><td>80</td></tr></tbody></table>');
        });
        
        it('Marker Tooltip', () => {
            let marker: HTMLElement = ganttObj.element.querySelector('#stripline0 > div') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td>10/18/2017</td></tr><tr><td>Event Marker 1</td></tr></tbody></table>');
        });
        it('Predecessor Tooltip', () => {
            let predecessor: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent1child3 > div > div.e-connector-line-right-arrow') as HTMLElement;
            triggerMouseEvent(predecessor, 'mouseover', 10);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">From</td><td>:</td><td class = "e-gantt-tooltip-value">Start-Duration (1)</td></tr><tr><td class = "e-gantt-tooltip-label">To</td><td>:</td><td class = "e-gantt-tooltip-value">Duration-End (3)</td></tr><tr><td class = "e-gantt-tooltip-label">Task Link</td><td>:</td><td class = "e-gantt-tooltip-value"> Start-Start</td></tr><tr><td class = "e-gantt-tooltip-label">Lag</td><td>:</td><td class = "e-gantt-tooltip-value">0 days</td></tr></tbody></table>');
        });
        it('Timeline Tooltip', () => {
            let timeline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(2) > thead > tr > th:nth-child(7) > div') as HTMLElement;
            triggerMouseEvent(timeline, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr>10/21/2017</tr></tbody></table>');
        });
        it('Baseline Tooltip', () => {
            let baseline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-baseline-bar') as HTMLElement;
            triggerMouseEvent(baseline, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Start-Duration</td></tr><tr><td class = "e-gantt-tooltip-label">Baseline Start Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/23/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Baseline End Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/26/2017</td></tr></tbody></table>');
        });
        it('Indicator Tooltip', () => {
            let indicator: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > label:nth-child(3)') as HTMLElement;
            triggerMouseEvent(indicator, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr>Follow up</tr></tbody></table>');
        });
        it('Milestone Tooltip', () => {
            let milestone: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
            triggerMouseEvent(milestone, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Milestone</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/27/2017</tr></tbody></table>');
        });
        it('Taskbar Tooltip Template', () => {
            ganttObj.tooltipSettings.taskbar = '#tooltip';
            ganttObj.dataBind();
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj.content as HTMLElement).textContent).toBe('StartDate : 10/23/2017');
        });
        it('DependencyLine Tooltip Template', () => {
            ganttObj.tooltipSettings.connectorLine = '#dLTooltip';
            ganttObj.dataBind();
            let predecessor: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent1child3 > div > div.e-connector-line-right-arrow') as HTMLElement;
            triggerMouseEvent(predecessor, 'mouseover', 10);
            expect((ganttObj.tooltipModule.toolTipObj.content as HTMLElement).textContent).toBe('Offset : 0 days');
        });
        it('Baseline Tooltip Template', () => {
            ganttObj.tooltipSettings.baseline = '#bLTooltip';
            ganttObj.dataBind();
            let baseline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-baseline-bar') as HTMLElement;
            triggerMouseEvent(baseline, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj.content as HTMLElement).textContent).toBe('Baseline StartDate : 10/23/2017');
        });
        it('Taskbar Editing Tooltip', () => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 150);
            triggerMouseEvent(dragElement, 'mousemove', 200);
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
            expect(getValue('isHidden', ganttObj.tooltipModule.toolTipObj)).toBe(true);
            triggerMouseEvent(dragElement, 'mouseup', 220);
        });
        it('showTooltip-false', () => {
            ganttObj.tooltipSettings.showTooltip = false;
            ganttObj.dataBind();
            let milestone: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
            triggerMouseEvent(milestone, 'mouseover', 50);
            expect(getValue('isHidden', ganttObj.tooltipModule.toolTipObj)).toBe(true);
        });
        it('Timeline Tooltip set as false', () => {
            ganttObj.timelineSettings.showTooltip = false;
            ganttObj.dataBind();
            let timeline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(2) > thead > tr > th:nth-child(7) > div') as HTMLElement;
            triggerMouseEvent(timeline, 'mouseover', 50);
            expect(getValue('isHidden', ganttObj.tooltipModule.toolTipObj)).toBe(true);
        });
        it('Tooltip for unscheduled task', () => {
            ganttObj.tooltipSettings.showTooltip = true;
            ganttObj.tooltipSettings.taskbar = '';
            ganttObj.dataBind();
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-progressbar-inner-div.e-gantt-child-taskbar.e-gantt-unscheduled-taskbar-right') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 0);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">EndDate-alone</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td>:</td><td>65</td></tr></tbody></table>');
        });
        it('Tooltip for unscheduled task', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-progressbar-inner-div.e-gantt-child-taskbar.e-gantt-unscheduled-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Duration-alone</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td>:</td><td class = "e-gantt-tooltip-value"> 32 hours</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td>:</td><td>65</td></tr></tbody></table>');
        });
        it('Marker tooltip without label', () => {
            let marker: HTMLElement = ganttObj.element.querySelector('#stripline1') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td>10/23/2017</td></tr><tr><td></td></tr></tbody></table>');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Schedule mode', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: scheduleModeData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
       it('Manual parent taskbar tooltip', () => {
            let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-gantt-manualparenttaskbar') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Parent Task 1</td></tr><tr><td class = "e-gantt-tooltip-label">Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/26/2017</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td>:</td><td class = "e-gantt-tooltip-value"> 5 days</td></tr></tbody></table>');
        }); 
    })
});
