import { Gantt } from '../base/gantt';
import { isNullOrUndefined, createElement, remove, extend, EventHandler } from '@syncfusion/ej2-base';
import { ActionBeginArgs, IGanttData, ITaskData, IActionBeginEventArgs } from '../base/interface';
import * as cls from '../base/css-constants';
import { CalendarContext } from '../base/calendar-context';
import { EditTooltip } from '../renderer/edit-tooltip';

export class TaskbarEditDraw {

    private parent: Gantt;
    private isDrawing: boolean = false;
    private isMouseDragged: boolean = false;
    private isDrawCancel: boolean = false;
    private mouseDownX: number = 0;
    private mouseDownY: number = 0;
    private mouseMoveX: number = 0;
    private startRowIndex: number = -1;
    private startDate: Date = null;
    private endDate: Date = null;
    private startLeft: number = 0;
    private endLeft: number = 0;
    private previewTaskbar: HTMLElement = null;
    private previewContainer: HTMLElement = null;
    private scrollTimer: number = null;
    private scrollDirection: string | null = null;
    private editTooltip: EditTooltip = null;
    private dragMouseLeave: boolean = false;
    private readonly minDrawWidth: number = 1; // 1 day minimum
    private readonly dragThreshold: number = 3; // pixels

    constructor(ganttObj: Gantt) {
        this.parent = ganttObj;
        // Create a mock TaskbarEdit object for the tooltip
        const mockTaskbarEdit: any = {
            taskBarEditRecord: null,
            taskBarEditAction: 'ChildDrag',
            tooltipPositionX: 0
        };
        this.editTooltip = new EditTooltip(this.parent, mockTaskbarEdit);
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.on('chartMouseDown', this.mouseDownHandler, this);
        this.parent.on('chartMouseUp', this.mouseUpHandler, this);
        this.parent.on('chartMouseLeave', this.mouseLeaveHandler, this);
        this.parent.on('chartMouseMove', this.mouseMoveHandler, this);
        EventHandler.add(document.body, 'keydown', this.keyDownHandler, this);
    }

    private unWireEvents(): void {
        this.parent.off('chartMouseDown', this.mouseDownHandler);
        this.parent.off('chartMouseUp', this.mouseUpHandler);
        this.parent.off('chartMouseLeave', this.mouseLeaveHandler);
        this.parent.off('chartMouseMove', this.mouseMoveHandler);
        EventHandler.remove(document.body, 'keydown', this.keyDownHandler);
    }

    /**
     * Resolves the row index from the pointer's clientY by walking the
     * rendered chart rows.
     *
     * @param {boolean} clientY .
     * @returns {number} - Returns the corresponding row index.
     */
    private getRowIndexFromY(clientY: number): number {
        const rows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
        if (!rows || rows.length === 0) {
            return -1;
        } else {
            for (let i: number = 0; i < rows.length; i++) {
                const rect: DOMRect = rows[i as number].getBoundingClientRect() as DOMRect;
                if (clientY >= rect.top && clientY <= rect.bottom) {
                    const rowIndex: number = parseInt(
                        rows[i as number].getAttribute('aria-rowindex'), 10);
                    return (rowIndex - 1);
                }
            }
            return -1;
        }
    }

    /**
     * Gets the rendered chart row element for the specified absolute row index.
     *
     * @param {number} rowIndex - Defines the absolute row index.
     * @returns {HTMLElement} - Returns the matching row element, or `null` if not currently rendered.
     */
    private getDrawRowElement(rowIndex: number): HTMLElement {
        if (rowIndex < 0) {
            return null;
        } else if (!this.parent.enableVirtualization) {
            return this.parent.getRowByIndex(rowIndex) as HTMLElement;
        } else {
            const rows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
            for (let i: number = 0; i < rows.length; i++) {
                if (parseInt(rows[i as number].getAttribute('aria-rowindex'), 10) - 1 === rowIndex) {
                    return rows[i as number] as HTMLElement;
                }
            }
            return null;
        }
    }

    /**
     * Returns true if the row at `rowIndex` is a parent row (has child
     * records or treegrid expand icon). Drawing inside parents is
     * disallowed to preserve parent-child calculations.
     *
     * @param {number} rowIndex - Defines the row index.
     * @returns {boolean} - Returns `true` if the row at `rowIndex` is a parent row; otherwise, `false`.
     */
    private isParentRow(rowIndex: number): boolean {
        if (rowIndex < 0 || rowIndex >= this.parent.currentViewData.length) {
            return false;
        } else {
            const data: IGanttData = this.parent.currentViewData[rowIndex as number];
            if (data && data.hasChildRecords) {
                return true;
            } else {
                const tr: HTMLElement = this.getDrawRowElement(rowIndex);
                if (tr && tr.querySelector('.e-treegridexpand')) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    private isExistingTaskbarClicked(e: PointerEvent): boolean {
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            const action: string =
                this.parent.editModule.taskbarEditModule['getTaskBarAction'](e);

            return !!(action !== '');
        }
        return false;
    }
    private mouseDownHandler(e: PointerEvent): void {
        if (!this.parent.editSettings.allowTaskbarDraw
            || !this.parent.allowUnscheduledTasks
            || this.parent.readOnly
            || this.parent.isAdaptive
            || this.isDrawing) {
            return;
        }
        else {
            if (this.isExistingTaskbarClicked(e)) {
                return;
            }
            const rowIndex: number = this.getRowIndexFromY(e.clientY);
            if (rowIndex < 0) {
                return; // no row under the pointer
            }
            else {
                this.startRowIndex = rowIndex;
                const containerPos: { top: number, left: number } =
                    this.parent.getOffsetRect(
                        this.parent.ganttChartModule.chartBodyContainer as HTMLElement);
                const coord: { pageX: number, pageY: number } = this.getCoordinate(e);
                if (this.parent.enableRtl) {
                    this.mouseDownX = Math.abs(coord.pageX -
                        (containerPos.left +
                            Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left)));
                } else {
                    this.mouseDownX = (coord.pageX - containerPos.left) +
                        this.parent.ganttChartModule.scrollObject.previousScroll.left;
                }
                this.mouseDownY = (coord.pageY - containerPos.top) +
                    this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.isMouseDragged = false;
                this.dragMouseLeave = false;
                e.preventDefault();
            }
        }
    }

    private mouseMoveHandler(e: PointerEvent): void {
        if (this.startRowIndex < 0) {
            return;
        } else {
            const rowIndex: number = this.getRowIndexFromY(e.clientY);
            if (rowIndex >= 0 && rowIndex === this.startRowIndex) {
                const tr: HTMLElement = this.getDrawRowElement(rowIndex);
                if (tr) {
                    if (this.isParentRow(rowIndex)) {
                        tr.style.cursor = 'not-allowed'; // parent row
                    } else {
                        // Check if the row already has a rendered taskbar
                        const taskbarContainer: Element = tr.querySelector('.' + cls.traceChildTaskBar);
                        const milestoneContainer: Element = tr.querySelector('.' + cls.traceMilestone);
                        const milestoneParentContainer: Element = tr.querySelector('.' + cls.parentMilestone);
                        if (taskbarContainer || milestoneContainer || milestoneParentContainer) {
                            tr.style.cursor = 'not-allowed'; // taskbar already rendered
                        } else {
                            tr.style.cursor = ''; // eligible for drawing
                        }
                    }
                    if (tr.style.cursor === 'not-allowed') {
                        this.isDrawing = false;
                        return;
                    } else {
                        this.isDrawing = true;
                    }
                }
            } else {
                this.isDrawing = false;
                return;
            }
            this.dragMouseLeave = false;
            const tr: HTMLElement = this.getDrawRowElement(this.startRowIndex);
            if (tr) {
                tr.style.cursor = 'crosshair';
            }
            if (!this.isMouseDragged) {
                const deltaX: number = Math.abs(e.pageX - this.mouseDownX);
                if (deltaX < this.dragThreshold) {
                    return;
                }
                this.isMouseDragged = true;
                const rowData: IGanttData = this.parent.currentViewData[rowIndex as number];
                const eventArgs: ActionBeginArgs = {
                    rowData: rowData as IGanttData,
                    requestType: 'taskbarDraw',
                    cancel: false
                };
                // eslint-disable-next-line
                this.parent.trigger('actionBegin', eventArgs, this.handleActionBegin.bind(this));
            }
            if (!this.isDrawCancel) {
                const containerPos: { top: number, left: number } =
                    this.parent.getOffsetRect(
                        this.parent.ganttChartModule.chartBodyContainer as HTMLElement);
                const coord: { pageX: number, pageY: number } = this.getCoordinate(e);
                if (this.parent.enableRtl) {
                    this.mouseMoveX = Math.abs(coord.pageX -
                        (containerPos.left +
                            Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left)));
                } else {
                    this.mouseMoveX = (coord.pageX - containerPos.left) +
                        this.parent.ganttChartModule.scrollObject.previousScroll.left;
                }
                this.updateDrawPreview();
                this.handleAutoScroll(e);
            }
        }
    }
    private handleActionBegin(args: ActionBeginArgs): void {
        if (!args.cancel) {
            this.isDrawCancel = args.cancel;
            this.startDrawPreview();
        } else {
            this.isDrawCancel = args.cancel;
            this.cleanupPreview();
            this.stopScrollTimer();
            this.reset();
            return;
        }
    }
    private mouseUpHandler(e: PointerEvent): void {
        if (this.startRowIndex >= 0) {
            const tr: HTMLElement = this.getDrawRowElement(this.startRowIndex);
            if (tr) {
                tr.style.cursor = '';
            }
        }
        if (!this.isDrawing || this.dragMouseLeave) {
            this.cleanupPreview();
            this.stopScrollTimer();
            this.reset();
            return;
        } else {
            const startRow: number = this.startRowIndex;
            const startD: Date = this.startDate;
            const endD: Date = this.endDate;
            this.cleanupPreview();
            this.stopScrollTimer();
            const existingRecord: IGanttData = this.parent.flatData[startRow as number];
            const updatedRecord: Object = extend({}, {}, existingRecord.taskData, true) as Object;
            const startField: string = this.parent.taskFields.startDate;
            const durationField: string = this.parent.taskFields.duration;
            updatedRecord[startField as string] = startD;
            const calendarContext: CalendarContext = new CalendarContext(this.parent, this.parent.calendarSettings.projectCalendar);
            const duration: number = this.parent.dateValidationModule.getDuration(
                startD, endD, this.parent.durationUnit.toLocaleLowerCase(),
                true, false, undefined, calendarContext);
            updatedRecord[durationField as string] = duration;
            this.parent.editModule.updateRecordByID(updatedRecord);
            this.parent.selectionModule.selectRow(startRow);

            this.reset();
        }
    }

    private mouseLeaveHandler(e: PointerEvent): void {
        if (!this.isDrawing) {
            return;
        } else {
            this.dragMouseLeave = true;
            const tr: HTMLElement = this.getDrawRowElement(this.startRowIndex);
            if (tr) {
                tr.style.cursor = '';
            }
            this.stopScrollTimer();
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.isDrawing) {
            e.preventDefault();
            if (this.startRowIndex >= 0) {
                const tr: HTMLElement = this.getDrawRowElement(this.startRowIndex);
                if (tr) {
                    tr.style.cursor = '';
                }
            }
            this.cleanupPreview();
            this.stopScrollTimer();
            this.reset();
        }
    }

    private startDrawPreview(): void {
        const data: IGanttData  = this.parent.flatData[this.startRowIndex];
        const isManual: boolean = !isNullOrUndefined(this.parent.taskFields.manual) ? data[this.parent.taskFields.manual] : false;
        const taskbarHeight: number = !isNullOrUndefined(this.parent.taskbarHeight) ?
            this.parent.taskbarHeight : (this.parent.rowHeight * 0.62);
        const container: HTMLElement =
            this.parent.ganttChartModule.chartBodyContainer as HTMLElement;
        this.previewContainer = createElement('div', {
            className: cls.drawPreviewTaskbar,
            styles: 'position: absolute; pointer-events: none; z-index: 4;'
        }) as HTMLElement;
        this.previewTaskbar = createElement('div', {
            className: cls.taskBarMainContainer,
            styles: 'position: absolute; height: ' +
                taskbarHeight + 'px; top: 0;'
        }) as HTMLElement;
        const childTaskbarInner: HTMLElement = createElement('div', {
            className: (isManual ? cls.manualChildTaskBar : cls.traceChildTaskBar) + ' e-gantt-child-taskbar-inner-div',
            styles: 'height: 100%; width: 100%; position: relative;'
        }) as HTMLElement;
        this.previewTaskbar.appendChild(childTaskbarInner);
        const childProgressBar: HTMLElement = createElement('div', {
            className: (isManual ? cls.manualChildProgressBar : cls.traceChildProgressBar) + ' e-gantt-child-progressbar-inner-div',
            styles: 'height: 100%; width: 0%; position: absolute;'
        }) as HTMLElement;
        childTaskbarInner.appendChild(childProgressBar);

        this.previewContainer.appendChild(this.previewTaskbar);
        const rowsContainer: HTMLElement =
            container.querySelector('.' + cls.chartBodyContent) as HTMLElement;
        if (rowsContainer) {
            rowsContainer.appendChild(this.previewContainer);
        } else {
            container.appendChild(this.previewContainer);
        }
        if (this.parent.tooltipSettings.showTooltip && !isNullOrUndefined(this.editTooltip)) {
            this.editTooltip['taskbarEdit'].taskBarEditElement = this.previewTaskbar;
            this.editTooltip.showHideTaskbarEditTooltip(true, -1);
        }
    }

    private updateDrawPreview(): void {
        if (!this.previewTaskbar || !this.parent.editModule.taskbarEditModule) {
            return;
        }
        const isDraggingForward: boolean = this.mouseMoveX >= this.mouseDownX;
        const startX: number = isDraggingForward ? this.mouseDownX : this.mouseMoveX;
        const endX: number = isDraggingForward ? this.mouseMoveX : this.mouseDownX;
        const dateUtil: Function =
            this.parent.editModule.taskbarEditModule.getDateByLeft.bind(
                this.parent.editModule.taskbarEditModule);
        const actualStartLeft: number = startX;
        const actualEndLeft: number = endX;
        const width: number = actualEndLeft - actualStartLeft;
        const tr: HTMLElement = this.getDrawRowElement(this.startRowIndex);
        let rowTop: number = 0;
        if (tr) {
            rowTop = tr.offsetTop + ((this.parent.rowHeight - (this.parent.rowHeight * 0.62)) / 2);
        }
        if (this.parent.enableRtl) {
            this.previewTaskbar.style.right = actualStartLeft + 'px';
        } else {
            this.previewTaskbar.style.left = actualStartLeft + 'px';
        }
        this.previewTaskbar.style.width = width + 'px';
        this.previewTaskbar.style.top = rowTop + 'px';
        this.previewTaskbar.style.opacity = '0.75';
        const startTaskData: ITaskData = { startDate: dateUtil(actualStartLeft), left: actualStartLeft } as ITaskData;
        const startLeft: number =
            this.parent.editModule.taskbarEditModule.getRoundOffStartLeft(
                startTaskData, true);

        const finalWidth: number = actualEndLeft - startLeft;
        const finalStartDate: Date = dateUtil(startLeft) as Date;
        const finalEndDate: Date = dateUtil(actualEndLeft) as Date;
        this.startDate = finalStartDate;
        this.endDate = finalEndDate;
        this.startLeft = actualStartLeft;
        this.endLeft = actualEndLeft;
        if (this.parent.tooltipSettings.showTooltip) {
            const mockTaskRecord: IGanttData = {
                ganttProperties: {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    duration: this.computeDuration(this.startDate, this.endDate),
                    width: finalWidth,
                    left: startLeft
                }
            } as IGanttData;
            (this.editTooltip as any).taskbarEdit.taskBarEditRecord = mockTaskRecord;
            (this.editTooltip as any).taskbarEdit.taskBarEditAction = 'ChildDrag';
            const forward: boolean = this.parent.enableRtl ? !isDraggingForward : isDraggingForward;
            this.editTooltip['taskbarEdit'].tooltipPositionX = forward ? this.endLeft : this.startLeft;
            this.editTooltip.updateTooltip(-1);
        }
    }

    private cleanupPreview(): void {
        if (this.previewContainer && this.previewContainer.parentElement) {
            remove(this.previewContainer);
        }
        this.previewContainer = null;
        this.previewTaskbar = null;
        if (this.editTooltip) {
            this.editTooltip['taskbarEdit'].taskBarEditElement = null;
            this.editTooltip.showHideTaskbarEditTooltip(false, -1);
        } else {
            return;
        }
    }

    /**
     * Returns true if a draw is currently in progress.
     * Read by `TaskbarEdit.mouseDownHandler` to yield control.
     *
     * @returns {boolean} - Returns `true` if taskbar drawing is in progress; otherwise, `false`.
     */
    public getIsDrawing(): boolean {
        return this.isDrawing;
    }

    private reset(): void {
        this.isDrawing = false;
        this.isMouseDragged = false;
        this.dragMouseLeave = false;
        this.startRowIndex = -1;
        this.startDate = null;
        this.endDate = null;
        this.startLeft = 0;
        this.endLeft = 0;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.mouseMoveX = 0;
    }

    private handleAutoScroll(e: PointerEvent): void {
        const chart: HTMLElement =
            this.parent.ganttChartModule.chartElement as HTMLElement;
        const rect: DOMRect = chart.getBoundingClientRect() as DOMRect;
        const edge: number = 30; // px from edge to start auto-scroll

        let direction: string = null;

        if (e.clientX > rect.right - edge) {
            direction = 'right';
        } else if (e.clientX < rect.left + edge) {
            direction = 'left';
        }

        if (direction) {
            if (!this.scrollTimer || this.scrollDirection !== direction) {
                this.stopScrollTimer();
                this.startScrollTimer(direction);
            }
        } else {
            this.stopScrollTimer();
        }
    }
    private processAutoScroll(direction: string): void {
        if (!this.parent.ganttChartModule || !this.parent.ganttChartModule.scrollObject) {
            return;
        } else {
            if (direction === 'right') {
                this.parent.ganttChartModule.scrollObject.setScrollLeft(
                    this.parent.ganttChartModule.scrollObject.previousScroll.left + 1
                );

                if (this.parent.enableRtl) {
                    this.mouseMoveX = this.mouseMoveX - 1;
                } else {
                    this.mouseMoveX = this.mouseMoveX + 1;
                }
            } else {
                this.parent.ganttChartModule.scrollObject.setScrollLeft(
                    this.parent.ganttChartModule.scrollObject.previousScroll.left - 1
                );

                if (this.parent.enableRtl) {
                    this.mouseMoveX = this.mouseMoveX + 1;
                } else {
                    this.mouseMoveX = this.mouseMoveX - 1;
                }
            }

            this.updateDrawPreview();
        }
    }
    private startScrollTimer(direction: string): void {
        this.scrollDirection = direction;
        this.stopScrollTimer();
        this.scrollTimer = window.setInterval(() => { this.processAutoScroll(direction); }, 0);
    }

    private stopScrollTimer(): void {
        if (this.scrollTimer) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
        } else {
            return;
        }
    }

    private getCoordinate(e: PointerEvent | TouchEvent): { pageX: number, pageY: number } {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            const t: Touch = (e as TouchEvent).touches[0];
            return { pageX: t.pageX, pageY: t.pageY };
        } else {
            return { pageX: (e as PointerEvent).pageX, pageY: (e as PointerEvent).pageY };
        }
    }

    private computeDuration(start: Date, end: Date): number {
        if (!start || !end) {
            return 0;
        } else {
            const calendarContext: CalendarContext = new CalendarContext(this.parent, this.parent.calendarSettings.projectCalendar);
            return this.parent.dateValidationModule.getDuration(
                start, end, this.parent.durationUnit.toLocaleLowerCase(),
                true, false, undefined, calendarContext);
        }
    }

    public destroy(): void {
        this.unWireEvents();
        this.cleanupPreview();
        this.stopScrollTimer();
        this.reset();
        if (this.editTooltip) {
            this.editTooltip = null;
        }
    }
}
