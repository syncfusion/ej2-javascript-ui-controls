import { isNullOrUndefined, createElement, extend, addClass, remove, removeClass, closest, merge } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { parentsUntil } from '../base/utils';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, IDependencyEventArgs, MousePoint, IPredecessor } from '../base/interface';
import * as cls from '../base/css-constants';
import { EditTooltip } from '../renderer/edit-tooltip';

/**
 * File for handling taskbar editing operation in Gantt.
 */
export class TaskbarEdit {
    protected parent: Gantt;
    public taskBarEditElement: Element;
    public taskBarEditRecord: IGanttData;
    public taskBarEditAction: string;
    public roundOffDuration: boolean;

    private mouseDownX: number;
    private mouseDownY: number;
    public mouseMoveX: number;
    public mouseMoveY: number;
    public previousItem: ITaskData;
    public previousItemProperty: string[];
    public taskbarEditedArgs: ITaskbarEditedEventArgs;
    private progressBorderRadius: number;
    private scrollTimer: number;
    public timerCount: number;
    public dragMouseLeave: boolean;
    public tooltipPositionX: number;
    public isMouseDragged: boolean = false;
    private falseLine: HTMLElement;
    public connectorSecondElement: Element;
    public connectorSecondRecord: IGanttData;
    public connectorSecondAction: string;
    public fromPredecessorText: string;
    public toPredecessorText: string;
    public finalPredecessor: string;
    public dependencyCancel: boolean = false;
    public drawPredecessor: boolean;
    private highlightedSecondElement: Element;
    private editTooltip: EditTooltip;
    private canDrag: boolean;
    /** @private */
    public tapPointOnFocus: boolean;
    private editElement: Element = null;
    public touchEdit: boolean;

    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.initPublicProp();
        this.wireEvents();
        this.editTooltip = new EditTooltip(this.parent, this);
    }

    private wireEvents(): void {
        this.parent.on('chartMouseDown', this.mouseDownHandler, this);
        this.parent.on('chartMouseUp', this.mouseUpHandler, this);
        this.parent.on('chartMouseLeave', this.mouseLeaveHandler, this);
        this.parent.on('chartMouseMove', this.mouseMoveAction, this);
        this.parent.on('chartMouseClick', this.mouseClickHandler, this);
    }

    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    private initPublicProp(): void {
        this.taskBarEditElement = null;
        this.taskBarEditRecord = null;
        this.taskBarEditAction = null;
        this.connectorSecondElement = null;
        this.connectorSecondRecord = null;
        this.connectorSecondAction = null;
        this.highlightedSecondElement = null;
        this.fromPredecessorText = null;
        this.toPredecessorText = null;
        this.finalPredecessor = null;
        this.drawPredecessor = false;
        this.roundOffDuration = true;
        this.dragMouseLeave = false;
        this.isMouseDragged = false;
        this.previousItemProperty = ['left', 'progress', 'duration', 'isMilestone', 'startDate', 'endDate', 'width', 'progressWidth',
        'autoLeft', 'autoDuration', 'autoStartDate', 'autoEndDate', 'autoWidth'];
        this.tapPointOnFocus = false;
        this.touchEdit = false;
    }

    private mouseDownHandler(e: PointerEvent): void {
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.canDrag = false;
            if (this.parent.isAdaptive && this.taskBarEditElement) {
                let targetElement: Element = this.getElementByPosition(e);
                let element: Element = parentsUntil(targetElement as Element, cls.taskBarMainContainer);
                if (element && element.innerHTML === this.taskBarEditElement.innerHTML &&
                    !(targetElement.classList.contains(cls.connectorPointLeft) ||
                        targetElement.classList.contains(cls.connectorPointRight)) &&
                    !this.tapPointOnFocus) {
                    this.updateTaskBarEditElement(e);
                    this.canDrag = true;
                    e.preventDefault();
                }
            } else if (!this.parent.isAdaptive) {
                this.updateTaskBarEditElement(e);
            }
        }
    }

    private mouseClickHandler(e: PointerEvent): void {
        let targetElement: Element = this.getElementByPosition(e);
        let element: Element = parentsUntil(targetElement as Element, cls.taskBarMainContainer);
        if (this.parent.selectionModule && this.parent.selectionModule.enableSelectMultiTouch) {
            if (this.tapPointOnFocus) {
                this.updateTaskBarEditElement(e);
            }
            return;
        }
        if (this.tapPointOnFocus && element && element.innerHTML !== this.taskBarEditElement.innerHTML) {
            this.connectorSecondRecord = this.parent.ganttChartModule.getRecordByTaskBar(element);
            this.connectorSecondAction = 'ConnectorPointLeftDrag';
            this.connectorSecondElement = element;
            this.fromPredecessorText = 'Finish';
            if (this.validateConnectorPoint()) {
                this.taskBarEditingAction(e, true);
            }
            this.showHideActivePredecessors(false);
            this.initPublicProp();
        } else if (targetElement.classList.contains(cls.connectorPointLeftHover) ||
            targetElement.classList.contains(cls.connectorPointRightHover)) {
            this.canDrag = false;
            this.multipleSelectionEnabled();
            this.showHideTaskBarEditingElements(targetElement, this.taskBarEditElement);
            this.tapPointOnFocus = true;
            this.taskBarEditAction = 'ConnectorPointRightDrag';
            this.connectorSecondRecord = this.taskBarEditRecord;
            this.taskBarEditingAction(e, false);
        } else {
            if (this.tapPointOnFocus) {
                this.showHideActivePredecessors(false);
                this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
            }
            this.updateTaskBarEditElement(e);
        }
    }

    private showHideActivePredecessors(show: boolean): void {
        let ganttProp: ITaskData = this.taskBarEditRecord.ganttProperties;
        let predecessors: IPredecessor[] = ganttProp.predecessor;
        if (predecessors) {
            for (let i: number = 0; i < predecessors.length; i++) {
                let predecessor: IPredecessor = predecessors[i];
                if (ganttProp.rowUniqueID.toString() === predecessor.from) {
                    this.applyActiveColor(predecessor.from, predecessor.to, show);
                } else if (ganttProp.rowUniqueID.toString() === predecessor.to) {
                    this.applyActiveColor(predecessor.from, predecessor.to, show);
                }
            }
        }
        let chartContent: Element = this.parent.ganttChartModule.chartBodyContainer;
        if (show) {
            addClass([this.taskBarEditElement], [cls.activeChildTask]);
            addClass([chartContent], [cls.touchMode]);
        } else {
            removeClass([this.taskBarEditElement], [cls.activeChildTask]);
            removeClass([chartContent], [cls.touchMode]);
        }
        this.touchEdit = show;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    private applyActiveColor(from: string, to: string, enable?: boolean): void {
        let taskId: string = this.taskBarEditRecord.ganttProperties.rowUniqueID.toString();
        let ganttRecord: IGanttData = (taskId === from) ? this.parent.getRecordByID(to) :
            this.parent.getRecordByID(from);
        let $tr: Element = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(ganttRecord)];
        if (!isNullOrUndefined($tr)) {
            let $taskbar: Element = $tr.querySelector('.' + cls.taskBarMainContainer);
            let $connectorElement: Element = this.parent.element.querySelector('#ConnectorLineparent' + from + 'child' + to);
            if (enable) {
                addClass([$taskbar], [cls.activeConnectedTask]);
                if ($connectorElement) {
                    addClass([$connectorElement], [cls.activeConnectedTask]);
                }
            } else {
                removeClass([$taskbar], [cls.activeConnectedTask]);
                if ($connectorElement) {
                    removeClass([$connectorElement], [cls.activeConnectedTask]);
                }
            }
        }
    }

    private validateConnectorPoint(): Boolean {
        let parentRecord: ITaskData = this.taskBarEditRecord.ganttProperties;
        let childRecord: ITaskData = this.connectorSecondRecord.ganttProperties;
        let isValid: boolean = true;
        if (this.connectorSecondRecord.hasChildRecords) {
            isValid = false;
        } else if (childRecord.predecessor) {
            for (let i: number = 0; i < childRecord.predecessor.length; i++) {
                let predecessor: IPredecessor = childRecord.predecessor[i];
                if (predecessor.from === parentRecord.rowUniqueID.toString() &&
                    predecessor.to === childRecord.rowUniqueID.toString()) {
                    this.parent.connectorLineEditModule.childRecord = this.connectorSecondRecord;
                    this.parent.connectorLineEditModule.predecessorIndex = i;
                    this.parent.connectorLineEditModule.renderPredecessorDeleteConfirmDialog();
                    isValid = false;
                    break;
                } else if (predecessor.from === childRecord.rowUniqueID.toString() &&
                    predecessor.to === parentRecord.rowUniqueID.toString()) {
                    this.parent.connectorLineEditModule.childRecord = this.taskBarEditRecord;
                    this.parent.connectorLineEditModule.predecessorIndex = i;
                    this.parent.connectorLineEditModule.renderPredecessorDeleteConfirmDialog();
                    isValid = false;
                    break;
                }
            }
        }
        return isValid;
    }

    private mouseLeaveHandler(e: PointerEvent): void {
        this.dragMouseLeave = true;
    }

    /**
     * To update taskbar edited elements on mouse down action.
     * @return {void}
     * @private
     */
    public updateTaskBarEditElement(e: PointerEvent): void {
        let target: Element = this.getElementByPosition(e);
        let element: Element;
        if (target.classList.contains(cls.manualParentRightResizer) || target.classList.contains(cls.manualParentMainContainer)
            || target.classList.contains(cls.manualParentTaskBar)) {
            element = parentsUntil(target, cls.manualParentMainContainer);
        } else if (target.classList.contains(cls.manualParentMilestoneTop) || target.classList.contains(cls.manualParentMilestoneBottom)
            || target.classList.contains(cls.manualParentMilestone)) {
            element = parentsUntil(target, cls.manualParentMilestone);
        } else {
            element = parentsUntil(target, cls.taskBarMainContainer);
        }
        if (this.parent.editSettings.allowTaskbarEditing && element) {
            this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
            this.editElement = element;
            this.taskBarEditElement = element;
            this.taskBarEditRecord = this.parent.ganttChartModule.getRecordByTaskBar(this.taskBarEditElement);
            if (e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'click') {
                this.roundOffDuration = true;
                this.taskBarEditAction = this.getTaskBarAction(e);
                if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') &&
                    isNullOrUndefined(this.parent.taskFields.dependency)) {
                    this.taskBarEditAction = null;
                }
                this.updateMouseDownProperties(e);
            }
        } else {
            if (this.parent.isAdaptive) {
                if (this.taskBarEditElement) {
                    this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
                }
                this.initPublicProp();
            } else {
                this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
            }
        }
    }

    /**
     * To show/hide taskbar editing elements.
     * @return {void}
     * @private
     */
    public showHideTaskBarEditingElements(element: Element, secondElement: Element, fadeConnectorLine?: boolean): void {
        secondElement = secondElement ? secondElement : this.editElement;
        if (element) {
            if (element.querySelector('.' + cls.taskBarLeftResizer)) {
                addClass([element.querySelector('.' + cls.taskBarLeftResizer)], [cls.leftResizeGripper]);
                addClass([element.querySelector('.' + cls.taskBarRightResizer)], [cls.rightResizeGripper]);
                addClass([element.querySelector('.' + cls.childProgressResizer)], [cls.progressResizeGripper]);
            } else if (this.parent.isAdaptive) {
                let record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                if (record.hasChildRecords) {
                    addClass([element], [cls.activeParentTask]);
                }
            }
            addClass(
                this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + cls.connectorLineContainer), [cls.connectorLineZIndex]);
            if (!isNullOrUndefined(this.parent.taskFields.dependency)
                && element.querySelector('.' + cls.connectorPointLeft)) {
                addClass(
                    [element.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);
                addClass(
                    [element.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
            }
        } else if (!fadeConnectorLine) {
            removeClass(
                this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + cls.connectorLineContainer), [cls.connectorLineZIndex]);
        }
        if (secondElement && element !== secondElement) {
            if (secondElement.querySelector('.' + cls.taskBarLeftResizer)) {
                removeClass([secondElement.querySelector('.' + cls.taskBarLeftResizer)], [cls.leftResizeGripper]);
                removeClass([secondElement.querySelector('.' + cls.taskBarRightResizer)], [cls.rightResizeGripper]);
                if (secondElement.querySelector('.' + cls.childProgressResizer)) {
                    removeClass([secondElement.querySelector('.' + cls.childProgressResizer)], [cls.progressResizeGripper]);
                }
            }
            if (!isNullOrUndefined(this.parent.taskFields.dependency)
                && secondElement.querySelector('.' + cls.connectorPointLeft)) {
                removeClass(
                    [secondElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);
                removeClass(
                    [secondElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
            } else if (this.parent.isAdaptive) {
                let record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(secondElement);
                if (record && record.hasChildRecords) {
                    removeClass([secondElement], [cls.activeParentTask]);
                }
            }
            this.editElement = null;
        }
    }

    /**
     * To get taskbar edit actions.
     * @return {string}
     * @private
     */
    private getTaskBarAction(e: PointerEvent): string {
        let mouseDownElement: Element = this.getElementByPosition(e);
        let data: IGanttData = this.taskBarEditRecord;
        let action: string = '';
        if (mouseDownElement.classList.contains(cls.taskBarLeftResizer)) {
            action = 'LeftResizing';
        } else if (mouseDownElement.classList.contains(cls.taskBarRightResizer)) {
            action = 'RightResizing';
        } else if (mouseDownElement.classList.contains(cls.childProgressResizer) ||
            closest(mouseDownElement, '.' + cls.childProgressResizer)) {
            action = 'ProgressResizing';
        } else if (mouseDownElement.classList.contains(cls.connectorPointLeft)) {
            action = 'ConnectorPointLeftDrag';
        } else if (mouseDownElement.classList.contains(cls.connectorPointRight)) {
            action = 'ConnectorPointRightDrag';
        } else if (mouseDownElement.classList.contains(cls.manualParentRightResizer)) {
            action = 'ParentResizing';
        } else if (mouseDownElement.classList.contains(cls.manualParentTaskBar) ||
            mouseDownElement.classList.contains(cls.manualParentMainContainer) ||
            mouseDownElement.classList.contains(cls.manualParentMilestone) ||
            mouseDownElement.classList.contains(cls.manualParentMilestoneTop) ||
            mouseDownElement.classList.contains(cls.manualParentMilestoneBottom) ||
            mouseDownElement.classList.contains(cls.manualParentMilestone)
        ) {
            action = 'ManualParentDrag';
        } else if (data) {
            action = data.hasChildRecords ? this.parent.taskMode === 'Auto' ? 'ParentDrag' : ''
            : data.ganttProperties.isMilestone ? 'MilestoneDrag' : 'ChildDrag';
        }
        return action;
    }

    /**
     * To update property while perform mouse down.
     * @return {void}
     * @private
     */
    private updateMouseDownProperties(event: PointerEvent): void {
        let e: MousePoint = this.getCoordinate(event);
        if (e.pageX || e.pageY) {
            let containerPosition: { top: number, left: number } =
                this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
            this.mouseDownX = (e.pageX - containerPosition.left) +
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
            this.tooltipPositionX = this.mouseDownX;
            this.mouseDownY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') {
            this.fromPredecessorText = this.taskBarEditAction === 'ConnectorPointLeftDrag' ? 'start' : 'finish';
            this.parent.connectorLineModule.tooltipTable.innerHTML = this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(
                this.taskBarEditRecord.ganttProperties.taskName,
                this.fromPredecessorText, '', ''
            );
        }
    }
    private isMouseDragCheck(): void {
        if (!this.isMouseDragged && this.taskBarEditAction && ((this.mouseDownX !== this.mouseMoveX) &&
            ((this.mouseDownX + 3) < this.mouseMoveX || (this.mouseDownX - 3) > this.mouseMoveX)
            || (this.mouseDownY !== this.mouseMoveY) &&
            ((this.mouseDownY + 3) < this.mouseMoveY || (this.mouseDownY - 3) > this.mouseMoveY))) {
            this.isMouseDragged = true;
            this.parent.initiateEditAction(true);
            let item: ITaskData = this.taskBarEditRecord.ganttProperties;
            this.previousItem = this.parent.timelineModule.extendFunction(item, this.previousItemProperty) as ITaskData;
            if (this.taskBarEditAction !== 'ConnectorPointLeftDrag' &&
                this.taskBarEditAction !== 'ConnectorPointRightDrag') {
                this.editTooltip.showHideTaskbarEditTooltip(true);
            }
            this.taskBarEditElement.setAttribute('aria-grabbed', 'true');
        }
    }
    /**
     * To handle mouse move action in chart
     * @param e 
     * @private
     */
    public mouseMoveAction(event: PointerEvent): void {
        if (this.parent.isAdaptive) {
            if (!this.canDrag) {
                return;
            } else {
                this.multipleSelectionEnabled();
            }
        }
        let containerPosition: { top: number, left: number } =
            this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        let e: MousePoint = this.getCoordinate(event);
        this.mouseMoveX = e.pageX - containerPosition.left +
            this.parent.ganttChartModule.scrollObject.previousScroll.left;
        this.mouseMoveY = e.pageY - containerPosition.top +
            this.parent.ganttChartModule.scrollObject.previousScroll.top;
        this.dragMouseLeave = false;
        this.isMouseDragCheck();
        if (this.isMouseDragged && this.taskBarEditAction) {
            this.taskBarEditingAction(event, false);
        } else if (!this.parent.isAdaptive && !this.taskBarEditAction) {
            this.updateTaskBarEditElement(event);
        }
    }
    /**
     * Method to update taskbar editing action on mous move.
     * @return {Boolean}
     * @private
     */
    public taskBarEditingAction(e: PointerEvent, isMouseClick: boolean): void {
        let args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
        let recordIndex: number = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
        if (this.taskBarEditRecord !== null) {
            args.editingFields = this.taskBarEditRecord.ganttProperties;
            args.data = this.taskBarEditRecord;
            if (this.parent.viewType === 'ResourceView' && args.data.level === 0) {
                return;
            }
            args.recordIndex = recordIndex;
            args.taskBarEditAction = this.taskBarEditAction;
            args.roundOffDuration = this.roundOffDuration;
            args.cancel = false;
            args.previousData = this.previousItem;
            this.roundOffDuration = args.roundOffDuration;
            this.updateMouseMoveProperties(e);
            if (this.taskBarEditAction === 'ProgressResizing') {
                this.performProgressResize(e);
            } else if (this.taskBarEditAction === 'LeftResizing') {
                this.enableLeftResizing(e);
            } else if (this.taskBarEditAction === 'RightResizing' || this.taskBarEditAction === 'ParentResizing') {
                this.enableRightResizing(e);
            } else if (this.taskBarEditAction === 'ParentDrag' || this.taskBarEditAction === 'ChildDrag' ||
                this.taskBarEditAction === 'MilestoneDrag' || this.taskBarEditAction === 'ManualParentDrag') {
                this.enableDragging(e);
            } else if (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.updateConnectorLineSecondProperties(e);
                this.triggerDependencyEvent(e);
                if (!this.parent.isAdaptive) {
                    this.drawFalseLine();
                }
            }
            this.setItemPosition();
            this.updateEditedItem();
            this.editTooltip.updateTooltip();
            if (isMouseClick) {
                this.taskBarEditedAction(e);
            }
            this.parent.trigger('taskbarEditing', args, (args: ITaskbarEditedEventArgs) => {
                if (args.cancel && this.taskBarEditRecord !== null) {
                    this.tapPointOnFocus = false;
                    merge(this.taskBarEditRecord.ganttProperties, args.previousData);
                }

            });
        }
    }

    /**
     * To update property while perform mouse move.
     * @return {void}
     * @private
     */
    private updateMouseMoveProperties(event: PointerEvent): void {
        let containerPosition: { top: number, left: number } =
            this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        let e: MousePoint = this.getCoordinate(event);
        if (e.pageX || e.pageY) {
            this.mouseMoveX = e.pageX - containerPosition.left +
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
            this.tooltipPositionX = this.mouseMoveX;
            this.mouseMoveY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        let isConnectorLineEdit: boolean = (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') ?
            true : false;
        if ((this.taskBarEditRecord.ganttProperties.width > 3 && !((this.taskBarEditAction === 'ProgressResizing' &&
            (this.taskBarEditRecord.ganttProperties.progress === 0 || this.taskBarEditRecord.ganttProperties.progress === 100)))) ||
            isConnectorLineEdit) {
            let mouseX: number = this.mouseMoveX - this.parent.ganttChartModule.scrollObject.previousScroll.left +
                containerPosition.left;
            let mouseY: number = this.mouseMoveY - this.parent.ganttChartModule.scrollObject.previousScroll.top +
                containerPosition.top;
            if ((mouseX + 20) >
                containerPosition.left + this.parent.ganttChartModule.chartBodyContainer.offsetWidth) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('right');
            } else if ((mouseX - 20) < containerPosition.left) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('left');
            } else if (isConnectorLineEdit && ((mouseY + 20) >
                containerPosition.top + this.parent.ganttChartModule.chartBodyContainer.offsetHeight)) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.startScrollTimer('bottom');
            } else if (isConnectorLineEdit && ((mouseY - 20) < containerPosition.top)) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.startScrollTimer('top');
            } else {
                this.stopScrollTimer();
            }
        } else {
            this.stopScrollTimer();
        }
    }

    /**
     * To start the scroll timer.
     * @return {void}
     * @private
     */
    public startScrollTimer(direction: string): void {
        this.stopScrollTimer();
        this.scrollTimer = window.setInterval(
            () => {
                if (direction === 'right' || direction === 'bottom') {
                    this.timerCount = (this.timerCount + 1) >= this.parent.timelineModule.totalTimelineWidth ?
                        this.parent.timelineModule.totalTimelineWidth : (this.timerCount + 1);
                } else {
                    this.timerCount = (this.timerCount - 1) < 0 ? 0 : (this.timerCount - 1);
                }
                if (direction === 'bottom' || direction === 'top') {
                    this.parent.ganttChartModule.scrollObject.setScrollTop(this.timerCount);
                } else {
                    this.parent.ganttChartModule.scrollObject.setScrollLeft(this.timerCount);
                }
                if (this.taskBarEditAction === 'ConnectorPointLeftDrag'
                    || this.taskBarEditAction === 'ConnectorPointRightDrag') {
                    this.drawFalseLine();
                }
            },
            0);
    }

    /**
     * To stop the scroll timer.
     * @return {void}
     * @private
     */
    public stopScrollTimer(): void {
        window.clearInterval(this.scrollTimer);
        this.scrollTimer = null;
    }

    /**
     * To update left and width while perform taskbar drag operation.
     * @return {void}
     * @private
     */
    private enableDragging(e: PointerEvent): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth: number = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            diffrenceWidth = this.mouseDownX - this.mouseMoveX;
            if (diffrenceWidth > 0) {
                this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
            }
        } else {
            diffrenceWidth = this.mouseMoveX - this.mouseDownX;
            this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
        }
        let left: number = item.left < 0 ? 0 : (item.left + item.width) >= this.parent.timelineModule.totalTimelineWidth ?
            (this.parent.timelineModule.totalTimelineWidth - item.width) : item.left;
        this.parent.setRecordValue('left', left, item, true);
    }

    /**
     * To update left and width while perform progress resize operation.
     * @return {void}
     * @private
     */
    private performProgressResize(e: PointerEvent): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth: number = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX > item.left &&
                (this.mouseMoveX < (item.left + item.width)) && item.left > 0) {
                diffrenceWidth = this.mouseMoveX - item.left;
                this.parent.setRecordValue('progressWidth', diffrenceWidth, item, true);
            } else {
                if (this.mouseMoveX >= (item.left + item.width)) {
                    this.parent.setRecordValue('progressWidth', item.width, item, true);
                } else {
                    this.parent.setRecordValue('progressWidth', 0, item, true);
                }
            }
        } else {
            if (this.mouseMoveX > item.left &&
                (this.mouseMoveX < (item.left + item.width))) {
                diffrenceWidth = this.mouseMoveX - item.left;
                this.parent.setRecordValue('progressWidth', diffrenceWidth, item, true);
            } else {
                if (this.mouseMoveX <= item.left) {
                    this.parent.setRecordValue('progressWidth', 0, item, true);
                } else {
                    this.parent.setRecordValue('progressWidth', item.width, item, true);
                }
            }
        }
        let widthValue: number = item.progressWidth > item.width ?
            item.width : item.progressWidth;
        widthValue = item.progressWidth < 0 ? 0 : item.progressWidth;
        this.parent.setRecordValue('progressWidth', widthValue, item, true);
        let diff: number = item.width - item.progressWidth;
        if (diff <= 4) {
            this.progressBorderRadius = 4 - diff;
        } else {
            this.progressBorderRadius = 0;
        }
    }

    /**
     * To update left and width while perform taskbar left resize operation.
     * @return {void}
     * @private
     */
    private enableLeftResizing(e: PointerEvent): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth: number = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX < (item.left + item.width)) {
                diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                if (item.left > 0) {
                    this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', this.previousItem.width + diffrenceWidth, item, true);
                }
            } else {
                if (this.mouseMoveX > (item.left + item.width)) {
                    diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                    this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', 3, item, true);
                }
            }
        } else {
            if (this.mouseMoveX < (item.left + item.width)) {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                if ((item.left) < (item.left + item.width) &&
                    ((this.previousItem.left + diffrenceWidth) <= (this.previousItem.left + this.previousItem.width))) {
                    this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', this.previousItem.width - diffrenceWidth, item, true);
                }
            } else {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
                this.parent.setRecordValue('width', 3, item, true);
            }
        }
        this.updateEditPosition(e, item);
        this.parent.setRecordValue(
            'left', (this.previousItem.left + this.previousItem.width - item.width), item, true);
    }
    /**
     * Update mouse position and edited item value
     * @param e 
     * @param item 
     */
    private updateEditPosition(e: PointerEvent, item: ITaskData): void {
        this.updateIsMilestone(item);
        this.parent.setRecordValue(
            'progressWidth', this.parent.dataOperation.getProgressWidth(item.width, item.progress), item, true);
    }
    /**
     *  To update milestone property.
     * @return {void}
     * @private
     */
    private updateIsMilestone(item: ITaskData): void {
        if (item.width <= 3) {
            this.parent.setRecordValue('width', 3, item, true);
            this.parent.setRecordValue('isMilestone', true, item, true);
        } else {
            this.parent.setRecordValue('width', item.width, item, true);
            this.parent.setRecordValue('isMilestone', false, item, true);
        }
    }

    /**
     * To update left and width while perform taskbar right resize operation.
     * @return {void}
     * @private
     */
    private enableRightResizing(e: PointerEvent): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth: number = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX > item.left && (this.mouseDownX - this.mouseMoveX) > 3) {
                diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                this.parent.setRecordValue('width', this.previousItem.width - diffrenceWidth, item, true);
            } else {
                if (this.mouseMoveX < item.left) {
                    this.parent.setRecordValue('width', 3, item, true);
                }
            }
        } else {
            if (this.mouseMoveX > item.left) {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                this.parent.setRecordValue('width', this.previousItem.width + diffrenceWidth, item, true);
            }
        }
        this.updateEditPosition(e, item);
    }


    /**
     * To updated startDate and endDate while perform taskbar edit operation.
     * @return {void}
     * @private
     */
    private updateEditedItem(): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let left: number;
        let projectStartDate: Date;
        let endDate: Date;
        let startDate: Date;
        switch (this.taskBarEditAction) {
            case 'ProgressResizing':
                this.parent.setRecordValue(
                    'progress',
                    this.getProgressPercent(item.width, item.progressWidth),
                    item,
                    true);
                break;
            case 'LeftResizing':
                left = this.getRoundOffStartLeft(item, this.roundOffDuration);
                projectStartDate = this.getDateByLeft(left);
                if (isNullOrUndefined(item.endDate)) {
                    endDate = this.parent.dateValidationModule.getValidEndDate(item);
                    this.parent.setRecordValue('endDate', endDate, item, true);
                }
                startDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null);
                this.parent.setRecordValue('startDate', new Date(startDate.getTime()), item, true);
                if (this.parent.dateValidationModule.compareDates(item.startDate, item.endDate) === 0
                    && isNullOrUndefined(item.isMilestone) && item.isMilestone === false && item.duration === 0) {
                    this.parent.setRecordValue('duration', 1, item, true);
                }
                if (item.isMilestone) {
                    this.parent.setRecordValue('endDate', new Date(startDate.getTime()), item, true);
                }
                this.parent.dateValidationModule.calculateDuration(this.taskBarEditRecord);
                this.parent.editModule.updateResourceRelatedFields(this.taskBarEditRecord, 'duration');
                break;
            case 'RightResizing':
            case 'ParentResizing':
                left = this.getRoundOffEndLeft(item, this.roundOffDuration);
                let tempEndDate: Date = this.getDateByLeft(left);
                if (isNullOrUndefined(item.startDate)) {
                    startDate = this.parent.dateValidationModule.getValidStartDate(item);
                    this.parent.setRecordValue('startDate', startDate, item, true);
                }
                let tempdate: Date = isNullOrUndefined(item.startDate) ? startDate : item.startDate;
                endDate = item.isMilestone ? tempdate :
                this.parent.dateValidationModule.checkEndDate(tempEndDate, this.taskBarEditRecord.ganttProperties);
                this.parent.setRecordValue('endDate', new Date(endDate.getTime()), item, true);
                this.parent.dateValidationModule.calculateDuration(this.taskBarEditRecord);
                this.parent.editModule.updateResourceRelatedFields(this.taskBarEditRecord, 'duration');
                break;
            case 'ParentDrag':
            case 'ChildDrag':
            case 'MilestoneDrag':
            case 'ManualParentDrag':
                left = this.getRoundOffStartLeft(item, this.roundOffDuration);
                projectStartDate = this.getDateByLeft(left);
                if (!isNullOrUndefined(item.endDate) && isNullOrUndefined(item.startDate)) {
                    endDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null);
                    endDate = this.parent.dateValidationModule.checkEndDate(endDate, this.taskBarEditRecord.ganttProperties);
                    this.parent.setRecordValue('endDate', endDate, item, true);
                } else {
                    this.parent.setRecordValue(
                        'startDate',
                        this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null),
                        item,
                        true);
                    if (!isNullOrUndefined(item.duration)) {
                        this.parent.dateValidationModule.calculateEndDate(this.taskBarEditRecord);
                    }
                }
                break;
        }
    }

    /**
     * To get roundoff enddate.
     * @return {number}
     * @private
     */
    private getRoundOffEndLeft(ganttRecord: ITaskData, isRoundOff: boolean): number {
        let tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let totalLeft: number = ganttRecord.width + ganttRecord.left;
        let remainingContribution: number =
            (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainingLeft: number = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        let positionValue: number = remainingLeft / this.parent.perDayWidth;
        if (isRoundOff === undefined) {
            isRoundOff = false;
        }
        /*Rounding the decimal value for week-month-year schedule mode*/
        if (!isRoundOff) {
            if ((tierMode !== 'Hour' && tierMode !== 'Minutes')) {
                if (positionValue === 0) {
                    totalLeft = totalLeft;
                } else if (positionValue > 0.5) {
                    totalLeft = totalLeft - remainingLeft + this.parent.perDayWidth;
                } else if (positionValue < 0.5) {
                    totalLeft = (totalLeft - remainingLeft) + (this.parent.perDayWidth / 2);
                }
            }
        } else if (isRoundOff) {
            if (tierMode === 'Hour') {
                let inHour: number = (this.parent.perDayWidth / 24);
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Hour') / (1000 * 60 * 60)));
                remainingLeft = (this.parent.perDayWidth / 24) - ((this.parent.perDayWidth / 24) / remainingContribution);
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + inHour;
                }
            } else if (tierMode === 'Minutes') {
                let inMinutes: number = (this.parent.perDayWidth / (24 * 60));
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Minutes') / (1000 * 60)));
                remainingLeft = (this.parent.perDayWidth / (24 * 60)) - ((this.parent.perDayWidth / (24 * 60)) / remainingContribution);
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + inMinutes;
                }
            } else {
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + this.parent.perDayWidth;
                }
            }
        }
        return totalLeft;
    }

    /**
     * To get roundoff startdate.
     * @return {number}
     * @private
     */
    public getRoundOffStartLeft(ganttRecord: ITaskData, isRoundOff: Boolean): number {
        let left: number = ganttRecord.left;
        let tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let remainingContribution: number =
            (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainDays: number = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        let remainDaysInDecimal: number = remainDays / this.parent.perDayWidth;
        if (isRoundOff === undefined) {
            isRoundOff = false;
        }
        /*Rounding the decimal value for week-month-year schedule mode*/
        if (!isRoundOff) {
            if ((tierMode !== 'Hour' && tierMode !== 'Minutes')) {
                if (remainDaysInDecimal <= 0.5) {
                    left = left - remainDays;
                } else if (remainDaysInDecimal > 0.5) {
                    left = (left - remainDays) + this.parent.perDayWidth / 2;
                }
            }
        } else if (isRoundOff) {
            if (tierMode === 'Hour') {
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Hour') / (1000 * 60 * 60)));
                remainDays = (this.parent.perDayWidth / 24) - ((this.parent.perDayWidth / 24) / remainingContribution);
                left = left - remainDays;
            } else if (tierMode === 'Minutes') {
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Minutes') / (1000 * 60)));
                remainDays = (this.parent.perDayWidth / (24 * 60)) - ((this.parent.perDayWidth / (24 * 60)) / remainingContribution);
                left = left - remainDays;
            } else {
                left = left - remainDays;
            }
        }
        return left;
    }

    /**
     * To get date by left value.
     * @return {Date}
     * @private
     */
    public getDateByLeft(left: number): Date {
        let pStartDate: Date = new Date(this.parent.timelineModule.timelineStartDate.toString());
        let milliSecondsPerPixel: number = (24 * 60 * 60 * 1000) / this.parent.perDayWidth;
        pStartDate.setTime(pStartDate.getTime() + (left * milliSecondsPerPixel));
        let tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.topTier :
            this.parent.timelineModule.bottomTier;
        if (tierMode !== 'Hour' && tierMode !== 'Minutes') {
            if (this.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && !this.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() + (60 * 60 * 1000));
            } else if (!this.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && this.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() - (60 * 60 * 1000));
            }
        }
        return pStartDate;
    }

    /**
     * To get timezone offset.
     * @return {number}
     * @private
     */
    private getDefaultTZOffset(): number {
        let janMonth: Date = new Date(new Date().getFullYear(), 0, 1);
        let julMonth: Date = new Date(new Date().getFullYear(), 6, 1); //Because there is no reagions DST inbetwwen this range
        return Math.max(janMonth.getTimezoneOffset(), julMonth.getTimezoneOffset());
    }

    /**
     * To check whether the date is in DST.
     * @return {boolean}
     * @private
     */
    private isInDst(date: Date): boolean {
        return date.getTimezoneOffset() < this.getDefaultTZOffset();
    }

    /**
     * To set item position.
     * @return {void}
     * @private
     */
    private setItemPosition(): void {
        let item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let width: number = this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone ?
            this.parent.chartRowsModule.milestoneHeight : item.width;
        let rightResizer: number = this.parent.isAdaptive ? (width - 2) : (width - 10);
        let taskBarMainContainer: HTMLElement = closest(this.taskBarEditElement, 'tr.' + cls.chartRow)
            .querySelector('.' + cls.taskBarMainContainer) as HTMLElement;
        let leftLabelContainer: HTMLElement = closest(this.taskBarEditElement, 'tr.' + cls.chartRow)
            .querySelector('.' + cls.leftLabelContainer) as HTMLElement;
        let rightLabelContainer: HTMLElement = closest(this.taskBarEditElement, 'tr.' + cls.chartRow)
            .querySelector('.' + cls.rightLabelContainer) as HTMLElement;
        let traceChildProgressBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceChildProgressBar) as HTMLElement;
        let traceChildTaskBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceChildTaskBar) as HTMLElement;
        let childProgressResizer: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.childProgressResizer) as HTMLElement;
        let taskBarRightResizer: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.taskBarRightResizer) as HTMLElement;
        let traceParentTaskBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceParentTaskBar) as HTMLElement;
        let traceParentProgressBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceParentProgressBar) as HTMLElement;
        let traceConnectorPointRight: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.rightConnectorPointOuterDiv) as HTMLElement;
        let manualParentTaskbar: HTMLElement = this.taskBarEditElement as HTMLElement;
        let manualTaskbar: HTMLElement = this.taskBarEditElement.querySelector('.' + cls.manualParentTaskBar) as HTMLElement;
        let manualParentRight: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.manualParentRightResizer) as HTMLElement;
        let manualParentLeft: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.manualParentLeftResizer) as HTMLElement;
        if (this.taskBarEditAction !== 'ConnectorPointRightDrag' &&
            this.taskBarEditAction !== 'ConnectorPointLeftDrag') {
            if (this.taskBarEditAction !== 'ParentResizing' && this.taskBarEditAction !== 'ManualParentDrag') {
                taskBarMainContainer.style.width = (width) + 'px';
                taskBarMainContainer.style.left = (item.left) + 'px';
                leftLabelContainer.style.width = (item.left) + 'px';
                rightLabelContainer.style.left = (item.left + width) + 'px';
            }
            if (traceConnectorPointRight) {
                traceConnectorPointRight.style.left = (this.parent.isAdaptive ? (width + 10) : (width + 2)) + 'px';
            }
            if (this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone) {
                taskBarMainContainer.style.left = (item.left - (width / 2)) + 'px';
                leftLabelContainer.style.width = (item.left - (width / 2)) + 'px';
                rightLabelContainer.style.left = (item.left + (width / 2)) + 'px';
            } else if (this.taskBarEditAction === 'ProgressResizing') {
                traceChildTaskBar.style.left = (item.left + item.progressWidth - 10) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceChildProgressBar.style.width = item.progressWidth + 'px';
                    traceChildProgressBar.style.borderBottomRightRadius = this.progressBorderRadius + 'px';
                    traceChildProgressBar.style.borderTopRightRadius = this.progressBorderRadius + 'px';
                    childProgressResizer.style.left = item.progressWidth - 8 + 'px';
                }
            } else if (this.taskBarEditAction === 'RightResizing') {
                traceChildTaskBar.style.width = (width) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    taskBarRightResizer.style.left = rightResizer + 'px';
                    childProgressResizer.style.left = (item.progressWidth - 10) + 'px';
                }
            } else if (this.taskBarEditAction === 'ParentDrag') {
                if (!isNullOrUndefined(traceParentTaskBar)) {
                    traceParentTaskBar.style.width = (width) + 'px';
                }
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceParentProgressBar.style.width = (item.progressWidth) + 'px';
                }
            } else if (this.taskBarEditAction === 'ParentResizing') {
                manualParentTaskbar.style.width = manualTaskbar.style.width = (item.width) + 'px';
                manualParentRight.style.left = (item.width - manualParentLeft.offsetLeft) + 'px';
            } else if (this.taskBarEditAction === 'ManualParentDrag') {
                manualParentTaskbar.style.left = (item.left - item.autoLeft) + 'px';
            } else {
                traceChildTaskBar.style.width = (width) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    taskBarRightResizer.style.left = rightResizer + 'px';
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    childProgressResizer.style.left = item.progressWidth - 10 + 'px';
                }
            }
        }
    }

    /**
     * To handle mouse up event in chart
     * @param e 
     * @private
     */
    public mouseUpHandler(e: PointerEvent): void {
        let mouseDragged: boolean = this.isMouseDragged;
        this.editTooltip.showHideTaskbarEditTooltip(false);
        if (this.taskBarEditAction && this.isMouseDragged) {
            if (!this.dragMouseLeave && this.taskBarEditedAction) {
                this.taskBarEditedAction(e);
                this.isMouseDragged = false;
            } else {
                this.cancelTaskbarEditActionInMouseLeave();
            }
        }
        if (!this.parent.isAdaptive || mouseDragged) {
            this.initPublicProp();
        }
        this.stopScrollTimer();
    }
    /**
     * To perform taskbar edit operation.
     * @return {void}
     * @private
     */
    public taskBarEditedAction(event: PointerEvent): void {
        let args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
        let x1: number = this.mouseDownX;
        let y1: number = this.mouseDownY;
        let row: Element;
        let item: IGanttData = this.taskBarEditRecord;
        let recordIndex: number = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
        let x2: number;
        let y2: number;
        let resMouseY: number;
        let e: MousePoint = this.getCoordinate(event);
        x2 = this.mouseMoveX;
        y2 = this.mouseMoveY;
        resMouseY = e.pageY - this.parent.ganttChartModule.chartBodyContainer.offsetTop;
        if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') && !this.drawPredecessor) {
            this.dependencyCancel = true;
        }
        if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') && this.drawPredecessor) {
            this.parent.connectorLineEditModule.updatePredecessor(this.connectorSecondRecord, this.finalPredecessor);
        } else {
            if (x1 !== x2 || (Math.abs(y1 - resMouseY) >= (this.parent.rowHeight - this.parent.taskbarHeight) / 2)) {
                if (item !== null) {
                    args.editingFields = item.ganttProperties;
                    args.data = item;
                    args.recordIndex = recordIndex;
                    args.previousData = this.previousItem;
                    args.taskBarEditAction = this.taskBarEditAction;
                    args.action = 'TaskbarEditing';
                    args.roundOffDuration = this.roundOffDuration;
                    this.taskbarEditedArgs = args;
                    this.taskbarEdited(args);
                }
            }
        }
    }

    /**
     * To cancel the taskbar edt action.
     * @return {void}
     * @private
     */
    public cancelTaskbarEditActionInMouseLeave(): void {
        this.parent.editModule.reUpdatePreviousRecords(true);
    }

    /**
     * To trigger taskbar edited event.
     * @return {void}
     * @private
     */
    public taskbarEdited(arg: ITaskbarEditedEventArgs): void {
        let args: ITaskbarEditedEventArgs = extend({}, arg);
        let ganttRecord: IGanttData = args.data;
        let taskData: ITaskData = ganttRecord.ganttProperties;
        if (args.taskBarEditAction === 'ProgressResizing') {
            if (args.previousData.progress !== taskData.progress) {
                this.parent.setRecordValue(
                    'progress',
                    this.getProgressPercent(taskData.width, taskData.progressWidth),
                    taskData,
                    true);
                if (ganttRecord.parentItem) {
                    this.parent.editModule.updateParentProgress(ganttRecord.parentItem);
                }
            }
        } else {
            this.parent.dataOperation.updateWidthLeft(args.data);
        }
        this.parent.dataOperation.updateTaskData(ganttRecord);
        if (this.parent.viewType === 'ResourceView') {
            this.parent.editModule.updateRsourceRecords(args);
        } else {
            this.parent.editModule.initiateUpdateAction(args);
        }
    }

    /**
     * To get progress in percentage.
     * @return {number}
     * @private
     */
    private getProgressPercent(parentwidth: number, progresswidth: number): number {
        return Math.ceil(((progresswidth / parentwidth) * 100));
    }

    /**
     * false line implementation.
     * @return {void}
     * @private
     */
    private drawFalseLine(): void {

        let x1: number = this.mouseDownX;
        let y1: number = this.mouseDownY;
        let x2: number = this.mouseMoveX;
        let y2: number = this.mouseMoveY;
        let length: number = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        let angle: number = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        let transform: string = 'rotate(' + angle + 'deg)';
        let left: number;
        let top: number;
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            left = ((this.taskBarEditElement as HTMLElement).offsetLeft - (this.parent.chartRowsModule.connectorPointWidth / 2)) -
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
        }
        if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            left = ((this.taskBarEditElement as HTMLElement).offsetLeft + (this.taskBarEditElement as HTMLElement).offsetWidth) +
                (this.parent.chartRowsModule.connectorPointWidth / 2) - this.parent.ganttChartModule.scrollObject.previousScroll.left;
        }
        top = (((this.taskBarEditElement as HTMLElement).offsetTop) + ((this.taskBarEditElement as HTMLElement).offsetHeight / 2) +
            this.parent.ganttChartModule.chartBodyContainer.offsetTop) - this.parent.ganttChartModule.scrollObject.previousScroll.top;

        this.removeFalseLine(false);

        this.falseLine = createElement('div', {
            className: cls.falseLine, id: 'ganttfalseline' + this.parent.element.id,
            styles: 'transform-origin: 0% 100%;right: auto;position: absolute;transform:' + transform + ';' +
                'border-top-width: 1px;border-top-style: dashed;z-index: 5;width:' + (length - 3) + 'px;' +
                'left:' + left + 'px;top:' + top + 'px;'
        });

        this.parent.ganttChartModule.chartBodyContainer.appendChild(this.falseLine);


    }
    /**
     * 
     * @param isRemoveConnectorPointDisplay 
     * @private
     */
    public removeFalseLine(isRemoveConnectorPointDisplay: boolean): void {
        if (this.falseLine) {
            remove(this.falseLine);
            this.falseLine = null;
            if (isRemoveConnectorPointDisplay) {
                removeClass(
                    this.parent.ganttChartModule.scrollElement.querySelectorAll(
                        '.' + cls.connectorLineContainer),
                    [cls.connectorLineZIndex]);
            }
        }
    }
    /**
     * 
     * @param e 
     * @private
     */
    public updateConnectorLineSecondProperties(e: PointerEvent): void {
        let target: Element = this.getElementByPosition(e);
        let element: Element = parentsUntil(target, cls.taskBarMainContainer);
        this.connectorSecondAction = null;
        if (parentsUntil(target as Element, cls.connectorPointLeft)) {
            this.connectorSecondAction = 'ConnectorPointLeftDrag';
            this.toPredecessorText = 'Start';
        } else if (parentsUntil(target as Element, cls.connectorPointRight)) {
            this.connectorSecondAction = 'ConnectorPointRightDrag';
            this.toPredecessorText = 'Finish';
        } else {
            this.connectorSecondAction = null;
            this.toPredecessorText = null;
        }
        if (this.taskBarEditElement !== element && this.taskBarEditElement !== this.highlightedSecondElement) {
            this.showHideTaskBarEditingElements(element, this.highlightedSecondElement, true);
        }
        if (isNullOrUndefined(this.connectorSecondAction) && !isNullOrUndefined(this.connectorSecondElement)) {
            this.editTooltip.showHideTaskbarEditTooltip(false);
            removeClass([this.connectorSecondElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointAllowBlock]);
            removeClass([this.connectorSecondElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointAllowBlock]);
        }
        this.connectorSecondElement = this.connectorSecondAction ? element : null;
        this.highlightedSecondElement = element;
        this.connectorSecondRecord = isNullOrUndefined(this.connectorSecondElement) ?
            null : this.parent.ganttChartModule.getRecordByTaskBar(this.connectorSecondElement);
    }

    private triggerDependencyEvent(e: PointerEvent, mouseUp?: boolean): void {
        let fromItem: ITaskData = this.taskBarEditRecord.ganttProperties;
        let toItem: ITaskData = this.connectorSecondRecord ? this.connectorSecondRecord.ganttProperties : null;
        let predecessor: string;
        let currentTarget: string;
        let target: Element = this.getElementByPosition(e);
        let element: HTMLElement = target as HTMLElement;

        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            predecessor = fromItem.rowUniqueID + 'S';
        } else if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            predecessor = fromItem.rowUniqueID + 'F';
        }

        if (this.connectorSecondAction) {
            if (this.connectorSecondAction === 'ConnectorPointLeftDrag') {
                predecessor += 'S';
                currentTarget = 'Start';
            } else if (this.connectorSecondAction === 'ConnectorPointRightDrag') {
                predecessor += 'F';
                currentTarget = 'Finish';
            }
        }

        if (isNullOrUndefined(toItem)) {
            this.drawPredecessor = false;
            return;
        }
        if (toItem.predecessorsName) {
            this.finalPredecessor = toItem.predecessorsName + ',' + predecessor;
        } else {
            this.finalPredecessor = predecessor;
        }
        let isValidLink: boolean =
            this.parent.connectorLineEditModule.validatePredecessorRelation(this.connectorSecondRecord, this.finalPredecessor);
        let predecessorArray: IPredecessor[] = this.parent.predecessorModule.calculatePredecessor(predecessor, this.connectorSecondRecord);
        let args: IDependencyEventArgs = {} as IDependencyEventArgs;
        args.fromItem = fromItem;
        args.toItem = toItem;
        args.newPredecessorString = this.finalPredecessor;
        args.predecessor = predecessorArray && predecessorArray[0];
        args.isValidLink = isValidLink;
        args.requestType = 'ValidateDependency';
        this.parent.trigger('actionBegin', args);
        args.isValidLink = !isValidLink && args.isValidLink ? false : args.isValidLink;
        if (args.isValidLink) {
            if (!this.editTooltip.toolTipObj && !this.parent.isAdaptive) {
                this.editTooltip.showHideTaskbarEditTooltip(true);
            }
            if (this.editTooltip.toolTipObj) {
                this.parent.connectorLineModule.tooltipTable.innerHTML = this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(
                    this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName,
                    this.parent.editModule.taskbarEditModule.fromPredecessorText, '', ''
                );
                let table: NodeList = this.parent.connectorLineModule.tooltipTable.querySelector('#toPredecessor').querySelectorAll('td');
                (table[1] as HTMLElement).innerText = toItem.taskName;
                (table[2] as HTMLElement).innerText = currentTarget;
            }
            this.drawPredecessor = true;
        } else {
            if (this.parent.isAdaptive) {
                if (target.classList.contains(cls.connectorPointLeft) ||
                    target.classList.contains(cls.connectorPointRight)) {
                    this.showHideActivePredecessors(true);
                }
            } else {
                addClass([element], [cls.connectorPointAllowBlock]);
            }
            this.drawPredecessor = false;
        }
    }

    // Get XY coordinates for touch and non-touch device
    private getCoordinate(event: TouchEvent | PointerEvent): MousePoint {
        let coordinates: MousePoint = {};
        if (this.parent.isAdaptive && event && event.type !== 'click') {
            let e: TouchEvent = event as TouchEvent;
            if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
                coordinates.pageX = e.changedTouches[0].pageX;
                coordinates.pageY = e.changedTouches[0].pageY;
            }
        } else if (event) {
            let e: PointerEvent = event as PointerEvent;
            coordinates.pageX = e.pageX;
            coordinates.pageY = e.pageY;
        }
        return coordinates;
    }

    // Get current target element by mouse position
    // window.pageXOffset && window.pageYOffset is used to find the accurate element position in IPad/IPhone
    private getElementByPosition(event: TouchEvent | PointerEvent): Element {
        if (!this.parent.isAdaptive) {
            return event.target as Element;
        } else {
            let e: MousePoint = this.getCoordinate(event);
            return document.elementFromPoint((e.pageX - window.pageXOffset), (e.pageY - window.pageYOffset));
        }

    }

    private multipleSelectionEnabled(): void {
        if (this.parent.selectionModule &&
            this.parent.selectionSettings.mode !== 'Cell'
            && this.parent.selectionSettings.type === 'Multiple') {
            this.parent.selectionModule.hidePopUp();
        }
    }

    private unWireEvents(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('chartMouseDown', this.mouseDownHandler);
        this.parent.off('chartMouseUp', this.mouseUpHandler);
        this.parent.off('chartMouseLeave', this.mouseLeaveHandler);
        this.parent.off('chartMouseMove', this.mouseMoveAction);
        this.parent.off('chartMouseClick', this.mouseClickHandler);
    }
    /**
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        this.stopScrollTimer();
        this.parent.editModule.taskbarEditModule = undefined;
    }
}