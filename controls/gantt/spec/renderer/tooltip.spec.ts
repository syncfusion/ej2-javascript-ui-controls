/**
 * Gantt base spec
 */
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport } from '../../src/index';
import { createElement, getValue } from '@syncfusion/ej2-base';
import { resourceData,resourceCollection,resourceViewData, scheduleModeData,scheduleModeData1, data, data1, data2, data3, data4 } from '../base/data-source.spec';
import { destroyGantt, triggerMouseEvent, createGantt } from '../base/gantt-util.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);

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
                dataSource: data,
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
                enableHtmlSanitizer:true,
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
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Start-Duration</td></tr><tr><td class = "e-gantt-tooltip-label">Start Date</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value"> 10/23/2017</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">10/26/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value"> 4 days</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td style="padding: 2px;">:</td><td>80</td></tr></tbody></table>');
        });
        
        it('Marker Tooltip', () => {
            let marker: HTMLElement = ganttObj.element.querySelector('#stripline0 > div') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td>10/18/2017</td></tr><tr><td>Event Marker 1</td></tr></tbody></table>');
        });
        it('Predecessor Tooltip', () => {
            const predecessor : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent1child3').childNodes[0] as HTMLElement;
            triggerMouseEvent(predecessor, 'mouseover', 10);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">From</td><td>:</td><td class = "e-gantt-tooltip-value">Start-Duration (1)</td></tr><tr><td class = "e-gantt-tooltip-label">To</td><td>:</td><td class = "e-gantt-tooltip-value">Duration-End (3)</td></tr><tr><td class = "e-gantt-tooltip-label">Task Link</td><td>:</td><td class = "e-gantt-tooltip-value"> Start-Start</td></tr><tr><td class = "e-gantt-tooltip-label">Lag</td><td>:</td><td class = "e-gantt-tooltip-value">0 days</td></tr></tbody></table>');
        });
        it('Timeline Tooltip', () => {
            let timeline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(2) > thead > tr > th:nth-child(7) > div') as HTMLElement;
            triggerMouseEvent(timeline, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr>10/21/2017</tr></tbody></table>');
        });
        it('Predecessor Tooltip', () => {
            ganttObj.disableHtmlEncode = false;
            const predecessor : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent1child3').childNodes[0] as HTMLElement;
            triggerMouseEvent(predecessor, 'mouseover', 10);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">From</td><td>:</td><td class = "e-gantt-tooltip-value">Start-Duration (1)</td></tr><tr><td class = "e-gantt-tooltip-label">To</td><td>:</td><td class = "e-gantt-tooltip-value">Duration-End (3)</td></tr><tr><td class = "e-gantt-tooltip-label">Task Link</td><td>:</td><td class = "e-gantt-tooltip-value"> Start-Start</td></tr><tr><td class = "e-gantt-tooltip-label">Lag</td><td>:</td><td class = "e-gantt-tooltip-value">0 days</td></tr></tbody></table>');
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
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
                dataSource: data,
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
                enableHtmlSanitizer:true,
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
        beforeEach((done: Function) => {
            setTimeout(done, 100);
        });
        it('Baseline Tooltip', () => {
            let baseline: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-baseline-bar') as HTMLElement;
            triggerMouseEvent(baseline, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Start-Duration</td></tr><tr><td class = "e-gantt-tooltip-label">Baseline Start Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/23/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Baseline End Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/26/2017</td></tr></tbody></table>');
        });
        it('Indicator Tooltip', () => {
            let indicator: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > label:nth-child(3)') as HTMLElement;
            triggerMouseEvent(indicator, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr>Follow up</tr></tbody></table>');
        });
        it('Milestone Tooltip', () => {
            let milestone: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
            triggerMouseEvent(milestone, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Milestone</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">10/27/2017</td></tr></tbody></table>');
        });
        it('Taskbar Tooltip Template', () => {
            ganttObj.tooltipSettings.taskbar = '#tooltip';
            ganttObj.dataBind();
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
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
                dataSource: data,
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
                enableHtmlSanitizer:true,
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
        it('DependencyLine Tooltip Template', () => {
            ganttObj.tooltipSettings.connectorLine = '#dLTooltip';
            ganttObj.dataBind();
            const predecessor : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent1child3').childNodes[0] as HTMLElement;
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
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">EndDate-alone</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">10/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td style="padding: 2px;">:</td><td>65</td></tr></tbody></table>');
        });
        it('Tooltip for unscheduled task', () => {
            let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-progressbar-inner-div.e-gantt-child-taskbar.e-gantt-unscheduled-taskbar') as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Duration-alone</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value"> 32 hours</td></tr><tr><td class = "e-gantt-tooltip-label">Progress</td><td style="padding: 2px;">:</td><td>65</td></tr></tbody></table>');
        });
        it('Marker tooltip without label', () => {
            let marker: HTMLElement = ganttObj.element.querySelector('#stripline1') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td>10/23/2017</td></tr><tr><td></td></tr></tbody></table>');
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
                enableHtmlSanitizer:true,
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
       it('Manual parent taskbar tooltip', () => {
            let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-gantt-manualparenttaskbar') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Parent Task 1</td></tr><tr><td class = "e-gantt-tooltip-label">Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/26/2017</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td>:</td><td class = "e-gantt-tooltip-value"> 5 days</td></tr></tbody></table>');
        }); 
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    })
});
describe('Toottip with html tag', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: scheduleModeData1,
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
            enableHtmlSanitizer: true,
            taskMode: 'Custom',
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            disableHtmlEncode: true,
        }, done);
    });

    it('taskbar tooltip tag', () => {
        let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-gantt-manualparenttaskbar') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
        expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">&lt;i&gt;Parent Task 1&lt;/i&gt;</td></tr><tr><td class = "e-gantt-tooltip-label">Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/26/2017</td></tr><tr><td class = "e-gantt-tooltip-label">End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr><tr><td class = "e-gantt-tooltip-label">Duration</td><td>:</td><td class = "e-gantt-tooltip-value"> 5 days</td></tr></tbody></table>');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
    describe('Customize Toottip with html tag for event marker', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: scheduleModeData1,
                allowSorting: true,
                eventMarkers: [
                    {
                        day: '03/10/2017',
                        cssClass: 'e-custom-event-marker',
                        label: 'Event Marker 1'
                    }
                ],
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
                beforeTooltipRender(args: any) {
                    if (args.args.target.classList.contains('e-event-markers')) {
                        args.content =
                          '<table class = "e-gantt-tooltiptable"><tbody><tr><td>StartDate</td></tr><tr><td>EndDate</td></tr></tbody></table>';
                      }
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                disableHtmlEncode: true,
            }, done);
        });
        it('event marker tooltip tag', () => {
            let marker: HTMLElement = ganttObj.element.querySelector('#stripline0 > div') as HTMLElement;
            triggerMouseEvent(marker, 'mouseover', 50);
            expect(ganttObj.tooltipModule.toolTipObj.content).toBe('<table class="e-gantt-tooltiptable"><tbody><tr><td>StartDate</td></tr><tr><td>EndDate</td></tr></tbody></table>');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    })
describe('Manual milestone tooltip', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data1 ,
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
            enableHtmlSanitizer:true,
            tooltipSettings : {
                showTooltip: true,
                taskbar: '<div>TaskID: ${TaskID}</div>',
                connectorLine: '<div>Offset : ${offsetString}</div>',
                editing: '<div>Duration : ${duration}</div>',
                baseline: '<div>Baseline StartDate : ${this.getFormatedDate(BaselineStartDate)}</div>'
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
   it('Manual milestone parent taskbar tooltip', () => {
        let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-manualparent-milestone') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
        ganttObj.tooltipModule.createTooltip();
    }); 
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
describe('Baseline milestone tooltip', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data2 ,
            allowSorting: true,
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
            renderBaseline: true,
            baselineColor: 'red',
            enableHtmlSanitizer:true,
            tooltipSettings : {
                showTooltip: true,
                taskbar: '<div>TaskID: ${TaskID}</div>',
                connectorLine: '<div>Offset : ${offsetString}</div>',
                editing: '<div>Duration : ${duration}</div>',
                baseline: '<div>Baseline StartDate : ${this.getFormatedDate(BaselineStartDate)}</div>'
            },
            taskMode: 'Custom',
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
        }, done);
    });
   it('baseline milestone  tooltip', () => {
        let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-baseline-gantt-milestone-container') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
    }); 
    it(' milestone  tooltip with enableHtmlSanitizer', () => {
        let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
    }); 
    it(' milestone  tooltip without startdate', () => {
        let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    }); 

})
describe('Autoscheduled taskbar', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data3 ,
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
            enableHtmlSanitizer:true,
            tooltipSettings : {
                showTooltip: true,
                taskbar: '<div>TaskID: ${TaskID}</div>',
                connectorLine: '<div>Offset : ${offsetString}</div>',
                editing: '<div>Duration : ${duration}</div>',
                baseline: '<div>Baseline StartDate : ${this.getFormatedDate(BaselineStartDate)}</div>'
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
   it('Autoscheduled taskbar', () => {
       let marker: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-parent-taskbar') as HTMLElement;
       let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar') as HTMLElement;
       triggerMouseEvent(marker, 'mouseover', 50);
       triggerMouseEvent(clickElement, 'mouseover', 50);
       let marker1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar ') as HTMLElement;
       let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
       triggerMouseEvent(marker1, 'mouseover', 50);
       triggerMouseEvent(taskbarElement, 'mouseover', 50);
    }); 
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
describe('Gantt toolbar action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data4 ,
                    resources: [
                        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
                        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
                    ],
                    viewType: 'ResourceView',
                    showOverAllocation: true,
                    enableContextMenu: true,
                    enableRtl:true,
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
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Name', width: 250 },
                        { field: 'work', headerText: 'Work' },
                        { field: 'Progress' },
                        { field: 'resourceGroup', headerText: 'Group' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' },'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',  'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
                   
                    labelSettings: {
                        rightLabel: 'resources',
                        taskLabel: 'Progress'
                    },
                    splitterSettings: {
                        columnIndex: 3
                    },
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false
                    },
                    tooltipSettings: {
                        showTooltip: true
                    },
                    readOnly: false,
                   //gridLines: "Both",
                   enableHtmlSanitizer:true,
                    allowRowDragAndDrop: true,
                    allowResizing: true,
                    allowFiltering: true,
                    allowSelection: true,
                    highlightWeekends: true,
                    treeColumnIndex: 1,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    projectStartDate: new Date('03/28/2019'),
                    projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Predecessor Tooltip', () => {
        const predecessor : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent2child4').childNodes[0] as HTMLElement;
        triggerMouseEvent(predecessor, 'mouseover', 10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Resource viewType parent tooltip', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            viewType: 'ResourceView',
            dataSource:resourceViewData,
            resources: resourceCollection,
            enableContextMenu: true,
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
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resourceGroup', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            splitterSettings: {
                columnIndex: 3
            },
            tooltipSettings: {
                showTooltip: true
            },
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '550px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });

    it('EJ2-844114-Hide parent taskbar tooltip while dragging', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector("#" + ganttObj.element.id + "GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div") as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', 150);
        triggerMouseEvent(dragElement, 'mousemove', 200);
        expect(ganttObj.element.querySelectorAll("#tooltip_44_content > div.e-tip-content").length).toBe(0)
        triggerMouseEvent(dragElement, 'mouseup', 220);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt toolbar action', () => {
    let ganttObj: Gantt;
    let data: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'isManual' : true,
            'Children': [
                {
                    'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'Children': [{
                        'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true
                    },
                    {
                        'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40',
                    }]
                },

            ]
        }]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                tooltipSettings: {
                    showTooltip: true
                },
            }, done);
    });
    it('taskbar Tooltip', () => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-parent-taskbar') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 50);
    });
    it('taskbar Tooltip for manual task', () => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-parent-taskbar') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 50);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt tooltip module', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
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
            indicators: 'Indicators',
            notes: 'notes'
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
            { field: 'notes', headerText: 'notes' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowPdfExport: true,
        allowSelection: false,
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: '${Progress}%'
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
    it('notes info tooltip', () => {
        let notes = document.getElementsByClassName('e-icons e-notes-info')[0] as HTMLElement;
        triggerMouseEvent(notes, 'mouseover', 1);
    });
    
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt tooltip module', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'isMilestone': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),            'isMilestone': true,
                    'EndDate': new Date('03/03/2017'), 'Progress': '40','BaselineStartDate': new Date('02/27/2017'), 'BaselineEndDate': new Date('02/27/2017') }
            ]
        },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        disableHtmlEncode: false,
        eventMarkers: [
            {
                day: '02/29/2017',
                cssClass: 'e-custom-event-marker',
                label: 'game'
            }
        ],
        renderBaseline: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            endDate: 'EndDate',
            dependency: 'Predecessor',
            child: 'Children',
            milestone: 'isMilestone',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            manual: 'isManual',
        },
        taskMode: 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
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
        allowFiltering: true,
        columns: [
            { field: 'TaskID', visible: true },
            { field: 'TaskName' },
            { field: 'isManual' },
            { field: 'StartDate' },
            { field: 'Duration' },
            { field: 'Progress' }
        ],
        validateManualTasksOnLinking: true,
        treeColumnIndex: 1,
        allowReordering: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
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
        gridLines: "Both",
        showColumnMenu: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
        }, done);
    });   
    it('baseline tooltip', () => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-baseline-gantt-milestone-container') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 50);
    });
    it('Marker Tooltip', () => {
        let marker: HTMLElement = ganttObj.element.querySelector('#stripline0 > div') as HTMLElement;
        triggerMouseEvent(marker, 'mouseover', 50);
        expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td>3/1/2017</td></tr><tr><td>game</td></tr></tbody></table>');
    });
    
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt tooltip module', () => {
    let ganttObj: Gantt;
    var taskModeData: any = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'isMilestone': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': null, 'StartDate': new Date('02/27/2017'),            'isMilestone': true,
                    'EndDate': new Date('03/03/2017'), 'Progress': '40','BaselineStartDate': new Date('02/27/2017'), 'BaselineEndDate': new Date('02/27/2017') }
            ]
        },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        renderBaseline: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            endDate: 'EndDate',
            dependency: 'Predecessor',
            child: 'Children',
            milestone: 'isMilestone',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            manual: 'isManual',
        },
        taskMode: 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
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
        allowFiltering: true,
        columns: [
            { field: 'TaskID', visible: true },
            { field: 'TaskName' },
            { field: 'isManual' },
            { field: 'StartDate' },
            { field: 'Duration' },
            { field: 'Progress' }
        ],
        validateManualTasksOnLinking: true,
        treeColumnIndex: 1,
        allowReordering: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
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
        gridLines: "Both",
        showColumnMenu: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
        }, done);
    });   
    it('baseline tooltip', () => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-baseline-gantt-milestone-container') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 50);
        expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">2/27/2017</td></tr></tbody></table>');
    });
    
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt tooltip module', () => {
    let ganttObj: Gantt;
    let taskModeData: any = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'isMilestone': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': null, 'StartDate': new Date('02/27/2017'),            'isMilestone': true,
                    'EndDate': new Date('03/03/2017'), 'Progress': '40','BaselineStartDate': new Date('02/27/2017'), 'BaselineEndDate': new Date('02/27/2017'),
                'Indicators': [
            {
                'date': '03/5/2017',
                'iconCls': 'fas fa-cat',
                'name': 'Custom String',
                'tooltip': null
            }
        ] }
            ]
        },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskModeData,
            allowSorting: true,
            allowUnscheduledTasks: true,
            enableContextMenu: true,
            height: '450px',
            allowSelection: true,
            highlightWeekends: true,
            renderBaseline: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                duration: 'Duration',
                progress: 'Progress',
                endDate: 'EndDate',
                dependency: 'Predecessor',
                child: 'Children',
                milestone: 'isMilestone',
                baselineStartDate: "BaselineStartDate",
                baselineEndDate: "BaselineEndDate",
                manual: 'isManual',
                indicators: 'Indicators'
            },
            taskMode: 'Custom',
            sortSettings: {
                columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowRowDragAndDrop: true,
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
            allowFiltering: true,
            columns: [
                { field: 'TaskID', visible: true },
                { field: 'TaskName' },
                { field: 'isManual' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' }
            ],
            validateManualTasksOnLinking: true,
            treeColumnIndex: 1,
            allowReordering: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
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
            gridLines: "Both",
            showColumnMenu: true,
            allowResizing: true,
            readOnly: false,
            taskbarHeight: 20,
            rowHeight: 40,
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('02/20/2017'),
            projectEndDate: new Date('03/30/2017'),
        }, done);
    });   
    it('baseline tooltip', () => {
        let taskbarElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-baseline-gantt-milestone-container') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 50);
    });
    it('Indicator Tooltip', () => {
        let indicator: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > label:nth-child(3)') as HTMLElement;
        triggerMouseEvent(indicator, 'mouseover', 50);
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt tooltip module', () => {
    let ganttObj: Gantt;
    let taskModeData: any = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('02/27/2017'),
            'Progress': '40',
            'Duration':'0',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskModeData,
            allowSorting: true,
            allowUnscheduledTasks: true,
            enableContextMenu: true,
            height: '450px',
            allowSelection: true,
            highlightWeekends: true,
            renderBaseline: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                duration: 'Duration',
                progress: 'Progress',
                endDate: 'EndDate',
                dependency: 'Predecessor',
                child: 'Children',
                milestone: 'isMilestone',
                baselineStartDate: "BaselineStartDate",
                baselineEndDate: "BaselineEndDate",
                manual: 'isManual',
                indicators: 'Indicators'
            },
            taskMode: 'Custom',
            sortSettings: {
                columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowRowDragAndDrop: true,
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
            allowFiltering: true,
            columns: [
                { field: 'TaskID', visible: true },
                { field: 'TaskName' },
                { field: 'isManual' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' }
            ],
            validateManualTasksOnLinking: true,
            treeColumnIndex: 1,
            allowReordering: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
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
            gridLines: "Both",
            showColumnMenu: true,
            allowResizing: true,
            readOnly: false,
            taskbarHeight: 20,
            rowHeight: 40,
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%'
            },
            projectStartDate: new Date('02/20/2017'),
            projectEndDate: new Date('03/30/2017'),
        }, done);
    });   
    it('manual parent tooltip', () => {
        let taskbarElement: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-manualparent-milestone') as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mouseover', 10);
        expect((ganttObj.tooltipModule.toolTipObj as any).content()).toBe('<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">Parent Task 1</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td><td class = "e-gantt-tooltip-value">2/27/2017</tr><tr><td class = "e-gantt-tooltip-label">SubTasks Start Date</td><td>:</td><td class = "e-gantt-tooltip-value"> 2/27/2017</td></tr><tr><td class = "e-gantt-tooltip-label">SubTasks End Date</td><td>:</td><td class = "e-gantt-tooltip-value">3/3/2017</td></tr></tbody></table>');
        ganttObj.tooltipModule['mouseMoveHandler'](taskbarElement as any);
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});