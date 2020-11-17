import { isNullOrUndefined, createElement, extend, addClass, remove, removeClass, closest, merge } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { parentsUntil } from '../base/utils';
import {
    IGanttData, ITaskData, ITaskbarEditedEventArgs, IDependencyEventArgs, MousePoint, IPredecessor, ITaskSegment
} from '../base/interface';
import { DateProcessor } from '../base/date-processor';
import * as cls from '../base/css-constants';
import { EditTooltip } from '../renderer/edit-tooltip';

/**
 * File for handling taskbar editing operation in Gantt.
 */
export class TaskbarEdit extends DateProcessor {
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
    private prevZIndex: string;
    private previousMouseMove: number;
    public segmentIndex: number = -1;

    constructor(ganttObj?: Gantt) {
        super(ganttObj);
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
        if (this.parent.editSettings.allowTaskbarEditing && !this.parent.readOnly) {
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
        let id: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId : ganttProp.rowUniqueID;
        if (predecessors) {
            for (let i: number = 0; i < predecessors.length; i++) {
                let predecessor: IPredecessor = predecessors[i];
                if (id.toString() === predecessor.from) {
                    this.applyActiveColor(predecessor.from, predecessor.to, show);
                } else if (id.toString() === predecessor.to) {
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
        let taskId: string = this.parent.viewType === 'ProjectView' ? this.taskBarEditRecord.ganttProperties.taskId.toString() :
            this.taskBarEditRecord.ganttProperties.rowUniqueID.toString();
        let ganttRecord: IGanttData = (taskId === from) ? this.parent.connectorLineModule.getRecordByID(to) :
            this.parent.connectorLineModule.getRecordByID(from);
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
        let parentId: string = this.parent.viewType === 'ResourceView' ? parentRecord.taskId : parentRecord.rowUniqueID;
        let childId: string = this.parent.viewType === 'ResourceView' ? childRecord.taskId : childRecord.rowUniqueID;
        if (this.connectorSecondRecord.hasChildRecords) {
            isValid = false;
        } else if (childRecord.predecessor) {
            for (let i: number = 0; i < childRecord.predecessor.length; i++) {
                let predecessor: IPredecessor = childRecord.predecessor[i];
                if (predecessor.from === parentId.toString() &&
                    predecessor.to === childId.toString()) {
                    this.parent.connectorLineEditModule.childRecord = this.connectorSecondRecord;
                    this.parent.connectorLineEditModule.predecessorIndex = i;
                    this.parent.connectorLineEditModule.renderPredecessorDeleteConfirmDialog();
                    isValid = false;
                    break;
                } else if (predecessor.from === childId.toString() &&
                    predecessor.to === parentId.toString()) {
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
            if (!isNullOrUndefined(element) && !target.classList.contains('e-connectorpoint-left') &&
                !target.classList.contains('e-connectorpoint-right')) {
                let currentRecord: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                if (!isNullOrUndefined(currentRecord.ganttProperties.segments) && currentRecord.ganttProperties.segments.length > 0) {
                    element = parentsUntil(target, cls.childTaskBarInnerDiv);
                }
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing && element) {
            this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
            this.editElement = element;
            this.taskBarEditElement = element;
            let index: string = this.taskBarEditElement.getAttribute('data-segment-index');
            if (!isNullOrUndefined(index)) {
                this.segmentIndex = Number(index);
            } else {
                this.segmentIndex = -1;
            }
            this.taskBarEditRecord = this.parent.ganttChartModule.getRecordByTaskBar(this.taskBarEditElement);
            if (e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'click') {
                this.roundOffDuration = true;
                this.taskBarEditAction = this.getTaskBarAction(e);
                if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') &&
                    isNullOrUndefined(this.parent.taskFields.dependency)) {
                    this.taskBarEditAction = null;
                }
                this.updateMouseDownProperties(e);
                if (this.parent.viewType === 'ResourceView') {
                    if (this.taskBarEditRecord.level === 0) {
                        return;
                    } else if (this.parent.enableMultiTaskbar) {
                        let parentRecord: IGanttData = this.parent.getTaskByUniqueID(this.taskBarEditRecord.parentItem.uniqueID);
                        if (!isNullOrUndefined(parentRecord) && !parentRecord.expanded) {
                            this.prevZIndex = (this.taskBarEditElement as HTMLElement).style.zIndex;
                            (this.taskBarEditElement as HTMLElement).style.zIndex = '1000';
                            addClass([this.taskBarEditElement.querySelector('.e-gantt-child-taskbar')], 'e-collapsed-taskbar-drag');
                        }
                    }
                }
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
        let isShowProgressResizer: boolean = true;
        if (this.parent.readOnly) {
            return;
        }
        if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar && element) {
            let record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
            let parentRecord: IGanttData = this.parent.getParentTask(record.parentItem);
            if (!isNullOrUndefined(parentRecord)) {
                if (!parentRecord.expanded) {
                    isShowProgressResizer = false;
                }
            }
        }
        if (element) {
            if (element.querySelector('.' + cls.taskBarLeftResizer)) {
                addClass([element.querySelector('.' + cls.taskBarLeftResizer)], [cls.leftResizeGripper]);
                addClass([element.querySelector('.' + cls.taskBarRightResizer)], [cls.rightResizeGripper]);
                if (isShowProgressResizer) {
                    let progresElement: boolean = !isNullOrUndefined(element.querySelector('.' + cls.childProgressResizer)) ? true : false;
                    if (progresElement) {
                        addClass([element.querySelector('.' + cls.childProgressResizer)], [cls.progressResizeGripper]);
                    }
                }
            } else if (this.parent.isAdaptive && isShowProgressResizer) {
                let record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                if (record.hasChildRecords) {
                    addClass([element], [cls.activeParentTask]);
                }
            }
            if (isShowProgressResizer) {
                /* tslint:disable-next-line */
                addClass(
                    this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + cls.connectorLineContainer), [cls.connectorLineZIndex]);
            }
            if (!isNullOrUndefined(this.parent.taskFields.dependency)
                && (element.querySelector('.' + cls.connectorPointLeft)
                    || element.parentElement.querySelector('.' + cls.connectorPointLeft))
                && isShowProgressResizer) {
                let connectorElement: Element = !isNullOrUndefined(element.querySelector('.' + cls.connectorPointLeft)) ?
                    element : element.parentElement;

                addClass(
                    [connectorElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);
                addClass(
                    [connectorElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
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
                && (secondElement.querySelector('.' + cls.connectorPointLeft)
                    || secondElement.parentElement.querySelector('.' + cls.connectorPointLeft))) {
                let connectorElement: Element = !isNullOrUndefined(secondElement.querySelector('.' + cls.connectorPointLeft)) ?
                    secondElement : secondElement.parentElement;
                removeClass(
                    [connectorElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);
                removeClass(
                    [connectorElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
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
                this.editTooltip.showHideTaskbarEditTooltip(true, this.segmentIndex);
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
            this.editTooltip.updateTooltip(this.segmentIndex);
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
        let differenceWidth: number = 0;
        if (this.taskBarEditElement.classList.contains('e-segmented-taskbar') &&
            !this.taskBarEditElement.classList.contains('e-segment-first')) {
            let segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
            let segment: ITaskSegment = segments[this.segmentIndex];
            if (this.mouseDownX > this.mouseMoveX) {
                differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                    (this.mouseDownX - this.mouseMoveX) : (this.previousMouseMove - this.mouseMoveX);
                this.previousMouseMove = this.mouseMoveX;
                segment.left = segment.left - differenceWidth;
            } else {
                differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                    (this.mouseMoveX - this.mouseDownX) : (this.mouseMoveX - this.previousMouseMove);
                this.previousMouseMove = this.mouseMoveX;
                segment.left = segment.left + differenceWidth;
            }
            let previousSegment: ITaskSegment = segments[this.segmentIndex - 1];
            let nextSegment: ITaskSegment = segments[this.segmentIndex + 1];
            let left: number;
            if (this.taskBarEditElement.classList.contains('e-segment-inprogress')) {
                left = segment.left < (previousSegment.left + previousSegment.width) ? (previousSegment.left + previousSegment.width) :
                    ((segment.width + segment.left) > (nextSegment.left)) ? nextSegment.left - segment.width : segment.left;
            } else {
                left = segment.left < (previousSegment.left + previousSegment.width) ? (previousSegment.left + previousSegment.width) :
                    (item.left + segment.width + segment.left) >= this.parent.timelineModule.totalTimelineWidth ?
                        (this.parent.timelineModule.totalTimelineWidth - segment.width) : segment.left;
            }
            segment.left = left;
            this.parent.setRecordValue('segments', segments, item, true);
            this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
        } else {
            if (this.mouseDownX > this.mouseMoveX) {
                differenceWidth = this.mouseDownX - this.mouseMoveX;
                if (differenceWidth > 0) {
                    this.parent.setRecordValue('left', this.previousItem.left - differenceWidth, item, true);
                }
            } else {
                differenceWidth = this.mouseMoveX - this.mouseDownX;
                this.parent.setRecordValue('left', this.previousItem.left + differenceWidth, item, true);
            }
            let left: number = item.left < 0 ? 0 : (item.left + item.width) >= this.parent.timelineModule.totalTimelineWidth ?
                (this.parent.timelineModule.totalTimelineWidth - item.width) : item.left;
            this.parent.setRecordValue('left', left, item, true);
        }
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
        let differenceWidth: number = 0;
        if (this.taskBarEditElement.classList.contains('e-segmented-taskbar')) {
            this.enableSplitTaskLeftResize(item);
        } else {
            if (this.mouseDownX > this.mouseMoveX) {
                if (this.mouseMoveX < (item.left + item.width)) {
                    differenceWidth = this.mouseDownX - this.mouseMoveX;
                    if (item.left > 0) {
                        this.parent.setRecordValue('left', this.previousItem.left - differenceWidth, item, true);
                        this.parent.setRecordValue('width', this.previousItem.width + differenceWidth, item, true);
                    }
                } else {
                    if (this.mouseMoveX > (item.left + item.width)) {
                        differenceWidth = this.mouseDownX - this.mouseMoveX;
                        this.parent.setRecordValue('left', this.previousItem.left - differenceWidth, item, true);
                        this.parent.setRecordValue('width', 3, item, true);
                    }
                }
            } else {
                if (this.mouseMoveX < (item.left + item.width)) {
                    differenceWidth = this.mouseMoveX - this.mouseDownX;
                    if ((item.left) < (item.left + item.width) &&
                        ((this.previousItem.left + differenceWidth) <= (this.previousItem.left + this.previousItem.width))) {
                        this.parent.setRecordValue('left', this.previousItem.left + differenceWidth, item, true);
                        this.parent.setRecordValue('width', this.previousItem.width - differenceWidth, item, true);
                    }
                } else {
                    differenceWidth = this.mouseMoveX - this.mouseDownX;
                    this.parent.setRecordValue('left', this.previousItem.left + differenceWidth, item, true);
                    this.parent.setRecordValue('width', 3, item, true);
                }
            }
            this.updateEditPosition(e, item);
            this.parent.setRecordValue(
                'left', (this.previousItem.left + this.previousItem.width - item.width), item, true);
        }
    }
    private enableSplitTaskLeftResize(item: ITaskData): void {
        let segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
        let segment: ITaskSegment = segments[this.segmentIndex];
        let differenceWidth: number = 0;
        //when decrease the left and increase the width
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX < (item.left + segment.width + segment.left)) {
                differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                    (this.mouseDownX - this.mouseMoveX) : (this.previousMouseMove - this.mouseMoveX);
                this.previousMouseMove = this.mouseMoveX;
                // when resize other than 0th segment
                if (segment.left > 0) {
                    segment.left = segment.left - differenceWidth;
                    segment.width = segment.width + differenceWidth;
                    if (this.segmentIndex !== 0) {
                        let previousSegment: ITaskSegment = segments[this.segmentIndex - 1];
                        if ((item.left + segment.left) < (item.left + previousSegment.left + previousSegment.width)) {
                            let left: number = item.left + previousSegment.left + previousSegment.width;
                            let difference: number =
                                (item.left + previousSegment.left + previousSegment.width) - (item.left + segment.left);
                            segment.width -= difference;
                            segment.left = segment.left + difference;
                        }
                    }
                } else if (segment.left <= 0 && this.segmentIndex === 0) {
                    this.parent.setRecordValue('left', item.left - differenceWidth, item, true);
                    this.parent.setRecordValue('width', item.width + differenceWidth, item, true);
                    segment.width = segment.width + differenceWidth;
                    for (let i: number = 1; i < item.segments.length; i++) {
                        let segment: ITaskSegment = segments[i];
                        segment.left = segment.left + differenceWidth;
                    }
                }
            } else {
                if (this.mouseMoveX > (item.left + segment.width + segment.left)) {
                    differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                        (this.mouseDownX - this.mouseMoveX) : (this.previousMouseMove - this.mouseMoveX);
                    this.previousMouseMove = this.mouseMoveX;
                    segment.left = segment.left - differenceWidth;
                    segment.width = this.parent.perDayWidth;
                }
            }
        } else {
            // when increase left value and decrease width of segment
            if (this.mouseMoveX < (item.left + segment.width + segment.left - this.parent.perDayWidth)) {
                differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                    (this.mouseMoveX - this.mouseDownX) : (this.mouseMoveX - this.previousMouseMove);
                this.previousMouseMove = this.mouseMoveX;
                // when decrease the first segment width
                if (this.segmentIndex === 0 && segment.left <= 0) {
                    this.parent.setRecordValue('left', item.left + differenceWidth, item, true);
                    this.parent.setRecordValue('width', item.width - differenceWidth, item, true);
                    segment.width = segment.width - differenceWidth;
                    for (let i: number = 1; i < item.segments.length; i++) {
                        let segment: ITaskSegment = segments[i];
                        segment.left = segment.left - differenceWidth;
                    }
                    // when decrease remaining segments
                } else if ((segment.left) < (segment.left + segment.width) &&
                    ((segment.left + differenceWidth) <= (segment.left + segment.width))) {
                    segment.left = segment.left + differenceWidth;
                    segment.width = segment.width - differenceWidth;
                }
                // when mouse move goes beyond one day width of task bar.
            } else {
                if (this.mouseMoveX < (item.left + segment.left + segment.width)) {
                    if (segment.width > this.parent.perDayWidth) {
                        differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                            (this.mouseMoveX - this.mouseDownX) : (this.mouseMoveX - this.previousMouseMove);
                        this.previousMouseMove = this.mouseMoveX;
                        let singleDayDifference: number = (segment.width - differenceWidth) < this.parent.perDayWidth ?
                            this.parent.perDayWidth > segment.width ?
                                this.parent.perDayWidth - segment.width : segment.width - this.parent.perDayWidth : 0;
                        differenceWidth -= singleDayDifference;
                        if (this.segmentIndex === 0) {
                            this.parent.setRecordValue('width', item.width - differenceWidth, item, true);
                            this.parent.setRecordValue('left', item.left + differenceWidth, item, true);
                            for (let i: number = 1; i < item.segments.length; i++) {
                                let segment: ITaskSegment = segments[i];
                                segment.left = segment.left - differenceWidth;
                            }
                        } else {
                            segment.left = segment.left + differenceWidth;
                            segment.width = segment.width - differenceWidth;
                        }
                    }
                }
            }
        }
        this.parent.setRecordValue('segments', segments, item, true);
        this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
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
        let differenceWidth: number = 0;
        if (this.taskBarEditElement.classList.contains('e-segmented-taskbar')) {
            let segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
            let segment: ITaskSegment = segments[this.segmentIndex];
            if (this.mouseDownX > this.mouseMoveX) {
                if (this.mouseMoveX > (item.left + segment.left) && (this.mouseDownX - this.mouseMoveX) > 3) {
                    differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                        (this.mouseDownX - this.mouseMoveX) : (this.previousMouseMove - this.mouseMoveX);
                    this.previousMouseMove = this.mouseMoveX;
                    segment.width = segment.width - differenceWidth;
                } else {
                    if (this.mouseMoveX < (item.left + segment.left)) {
                        segment.width = this.parent.perDayWidth;
                    }
                }
            } else {
                if (this.mouseMoveX > segment.left) {
                    differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                        (this.mouseMoveX - this.mouseDownX) : (this.mouseMoveX - this.previousMouseMove);
                    this.previousMouseMove = this.mouseMoveX;
                    segment.width = segment.width + differenceWidth;
                }
            }
            let width: number;
            let nextSegment: ITaskSegment = this.segmentIndex !== segments.length - 1 ? segments[this.segmentIndex + 1] : null;
            if (!isNullOrUndefined(nextSegment)) {
                if (!this.taskBarEditElement.classList.contains('e-segment-last')) {
                    width = (segment.left + segment.width) > nextSegment.left ? (nextSegment.left - segment.left) : segment.width;
                }
                segment.width = width;
            }
            if (this.segmentIndex === item.segments.length - 1) {
                if (this.segmentIndex === 0) {
                    this.parent.setRecordValue('width', segment.width, item, true);
                }
            }
            this.parent.setRecordValue('segments', segments, item, true);
            this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
        } else {
            if (this.mouseDownX > this.mouseMoveX) {
                if (this.mouseMoveX > item.left && (this.mouseDownX - this.mouseMoveX) > 3) {
                    differenceWidth = this.mouseDownX - this.mouseMoveX;
                    this.parent.setRecordValue('width', this.previousItem.width - differenceWidth, item, true);
                } else {
                    if (this.mouseMoveX < item.left) {
                        this.parent.setRecordValue('width', 3, item, true);
                    }
                }
            } else {
                if (this.mouseMoveX > item.left) {
                    differenceWidth = this.mouseMoveX - this.mouseDownX;
                    this.parent.setRecordValue('width', this.previousItem.width + differenceWidth, item, true);
                }
            }
            this.updateEditPosition(e, item);
        }
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
                if (this.segmentIndex === -1) {
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
                } else {
                    this.updateSplitLeftResize(item);
                }

                break;
            case 'RightResizing':
            case 'ParentResizing':
                if (this.segmentIndex === -1) {
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
                } else {
                    this.updateSplitRightResizing(item);
                }
                break;
            case 'ParentDrag':
            case 'ChildDrag':
            case 'MilestoneDrag':
            case 'ManualParentDrag':
                if (this.segmentIndex === -1 || this.segmentIndex === 0) {
                    this.updateChildDrag(item);
                } else {
                    this.setSplitTaskDrag(item);
                }
                break;
        }
    }
    private updateChildDrag(item: ITaskData): void {
        let left: number;
        let projectStartDate: Date;
        let endDate: Date;
        let startDate: Date;
        left = this.getRoundOffStartLeft(item, this.roundOffDuration);
        projectStartDate = this.getDateByLeft(left);
        if (this.segmentIndex === 0) {
            this.parent.setRecordValue(
                'startDate',
                this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null),
                item,
                true);
            item.segments[0].startDate = projectStartDate;
            item.segments[0].endDate = this.parent.dataOperation.getEndDate(
                item.segments[0].startDate, item.segments[0].duration, item.durationUnit, item, false);
            this.parent.setRecordValue('segments', item.segments, item, true);
            this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
            this.parent.chartRowsModule.incrementSegments(item.segments, 0, this.taskBarEditRecord);
            this.parent.setRecordValue(
                'endDate',
                item.segments[item.segments.length - 1].endDate,
                item,
                true);
        } else {
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
        }
    }
    private updateSplitLeftResize(item: ITaskData): void {
        let segment: ITaskSegment = item.segments[this.segmentIndex];
        let left: number = this.segmentIndex === 0 ? this.getRoundOffStartLeft(item, this.roundOffDuration) :
            this.getRoundOffStartLeft(segment, this.roundOffDuration);
        let projectStartDate: Date = this.segmentIndex === 0 ? this.getDateByLeft(left) : this.getDateByLeft(item.left + left);

        let startDate: Date = this.parent.dataOperation.checkStartDate(projectStartDate, item, false);
        let duration: number = this.parent.dataOperation.getDuration(
            startDate, segment.endDate, item.durationUnit,
            item.isAutoSchedule, item.isMilestone);

        segment.startDate = new Date(startDate.getTime());
        segment.duration = duration;
        this.parent.setRecordValue('duration', this.sumOfDuration(item.segments), item, true);
        if (this.segmentIndex === 0) {
            this.parent.setRecordValue('startDate', segment.startDate, item, true);
        }
        this.parent.editModule.updateResourceRelatedFields(this.taskBarEditRecord, 'duration');

        if (!isNullOrUndefined(item.segments[this.segmentIndex - 1])) {
            let segmentOffsetDuration: number = this.parent.dataOperation.getDuration(
                item.segments[this.segmentIndex - 1].endDate, item.segments[this.segmentIndex].startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            segment.offsetDuration = segmentOffsetDuration;
        }
        this.parent.setRecordValue('segments', item.segments, item, true);
        this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
    }
    private updateSplitRightResizing(item: ITaskData): void {
        let segment: ITaskSegment = item.segments[this.segmentIndex];
        let left: number = this.getRoundOffEndLeft(item, this.roundOffDuration);
        let tempEndDate: Date = this.getDateByLeft(left);
        let endDate: Date = this.parent.dataOperation.checkEndDate(tempEndDate, item, false);
        let duration: number = this.parent.dataOperation.getDuration(
            segment.startDate, endDate, item.durationUnit,
            item.isAutoSchedule, item.isMilestone);
        segment.endDate = new Date(endDate.getTime());
        segment.duration = duration;
        // update next segment offset duration
        if (!isNullOrUndefined(item.segments[this.segmentIndex + 1])) {
            let nextSegment: ITaskSegment = item.segments[this.segmentIndex + 1];
            let segmentOffset: number = this.parent.dataOperation.getDuration(
                item.segments[this.segmentIndex].endDate, nextSegment.startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            segment.offsetDuration = segmentOffset;
        }
        this.parent.setRecordValue('segments', item.segments, item, true);
        this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
        this.parent.setRecordValue('duration', this.sumOfDuration(item.segments), item, true);
        this.parent.setRecordValue(
            'endDate',
            item.segments[item.segments.length - 1].endDate,
            item,
            true);
        this.parent.editModule.updateResourceRelatedFields(this.taskBarEditRecord, 'duration');
    }
    public sumOfDuration(segments: ITaskSegment[]): number {
        let duration: number = 0;
        for (let i: number = 0; i < segments.length; i++) {
            let segment: ITaskSegment = segments[i];
            duration += segment.duration;
        }
        return duration;
    }

    private setSplitTaskDrag(item: ITaskData): void {
        let segment: ITaskSegment = item.segments[this.segmentIndex];
        let left: number = this.getRoundOffStartLeft(segment, this.roundOffDuration);
        let projectStartDate: Date = this.getDateByLeft(item.left + left);
        projectStartDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null);
        segment.startDate = projectStartDate;
        segment.endDate = this.parent.dataOperation.getEndDate(
            segment.startDate, segment.duration, item.durationUnit, item, false
        );
        segment.duration = this.parent.dataOperation.getDuration(
            segment.startDate, segment.endDate, item.durationUnit, item.isAutoSchedule, item.isMilestone
        );
        this.parent.setRecordValue('duration', this.sumOfDuration(item.segments), item, true);
        this.parent.setRecordValue(
            'endDate',
            item.segments[item.segments.length - 1].endDate,
            item,
            true);
        if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
            this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'endDate');
        }

        //set offset if previous record present
        if (!isNullOrUndefined(item.segments[this.segmentIndex - 1])) {
            let offsetDuration: number = this.parent.dataOperation.getDuration(
                item.segments[this.segmentIndex - 1].endDate, item.segments[this.segmentIndex].startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            if (segment.startDate.getDay() === 1 && offsetDuration === 0 && !this.parent.includeWeekend) {
                offsetDuration = 1;
            }
            segment.offsetDuration = offsetDuration;
        }
        //set next record  offset if present
        if (!isNullOrUndefined(item.segments[this.segmentIndex + 1])) {
            let nextSegment: ITaskSegment = item.segments[this.segmentIndex + 1];
            let offsetDuration: number = this.parent.dataOperation.getDuration(
                item.segments[this.segmentIndex].endDate, nextSegment.startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            if (nextSegment.startDate.getDay() === 1 && offsetDuration === 0 && !this.parent.includeWeekend) {
                offsetDuration = 1;
            }
            nextSegment.offsetDuration = offsetDuration;
        }
        this.parent.setRecordValue('segments', item.segments, item, true);
        this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
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
        if (this.segmentIndex !== -1) {
            let segment: ITaskSegment = ganttRecord.segments[this.segmentIndex];
            totalLeft = totalLeft - ganttRecord.width + segment.width + segment.left;
        }
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
    public getRoundOffStartLeft(ganttRecord: ITaskData | ITaskSegment, isRoundOff: Boolean): number {
        let left: number = isNullOrUndefined(ganttRecord as ITaskData) ? (ganttRecord as ITaskSegment).left
            : (ganttRecord as ITaskData).left;
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
        let segment: ITaskSegment = !isNullOrUndefined(item.segments) ? item.segments[this.segmentIndex] : null;
        let width: number = this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone ?
            this.parent.chartRowsModule.milestoneHeight : item.width;
        let rightResizer: number = this.parent.isAdaptive ? (width - 2) : (width - 10);
        if (!isNullOrUndefined(segment)) {
            rightResizer = this.parent.isAdaptive ? (segment.width - 2) : (segment.width - 10);
        }
        /* tslint:disable-next-line */
        let taskBarMainContainer: HTMLElement = (!this.taskBarEditElement.classList.contains(cls.taskBarMainContainer)) ? closest(this.taskBarEditElement, 'tr.' + cls.chartRow)
            .querySelector('.' + cls.taskBarMainContainer) as HTMLElement : this.taskBarEditElement as HTMLElement;
        let segmentedTaskBarContainer: boolean = this.taskBarEditElement.classList.contains('e-segmented-taskbar');
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
                if (segmentedTaskBarContainer && !isNullOrUndefined(item.segments)
                    && (this.taskBarEditAction === 'RightResizing' || this.segmentIndex !== 0)) {

                    (this.taskBarEditElement as HTMLElement).style.width = (segment.width) + 'px';
                    (this.taskBarEditElement as HTMLElement).style.left = (segment.left) + 'px';
                }
                taskBarMainContainer.style.width = (width) + 'px';
                taskBarMainContainer.style.left = (item.left) + 'px';
                leftLabelContainer.style.width = (item.left) + 'px';
                if (this.taskBarEditAction === 'LeftResizing' && this.segmentIndex === 0) {
                    let parent: HTMLElement = this.taskBarEditElement.parentElement;
                    let segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        parent.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    for (let i: number = 0; i < item.segments.length; i++) {
                        let segment: ITaskSegment = item.segments[i];
                        let segmentElement: HTMLElement = segmentedTasks[i] as HTMLElement;
                        (segmentElement as HTMLElement).style.width = (segment.width) + 'px';
                        (segmentElement as HTMLElement).style.left = (segment.left) + 'px';
                    }
                }

                if (!isNullOrUndefined(rightLabelContainer)) {
                    rightLabelContainer.style.left = (item.left + width) + 'px';
                }
            }
            if (traceConnectorPointRight) {
                traceConnectorPointRight.style.left = (this.parent.isAdaptive ? (width + 10) : (width + 2)) + 'px';
            }
            if (this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone) {
                taskBarMainContainer.style.left = (item.left - (width / 2)) + 'px';
                leftLabelContainer.style.width = (item.left - (width / 2)) + 'px';
                if (!isNullOrUndefined(rightLabelContainer)) {
                    rightLabelContainer.style.left = (item.left + (width / 2)) + 'px';
                }
            } else if (this.taskBarEditAction === 'ProgressResizing') {
                if (this.segmentIndex === -1) {
                    traceChildTaskBar.style.left = (item.left + item.progressWidth - 10) + 'px';
                    if (!isNullOrUndefined(traceChildProgressBar)) {
                        traceChildProgressBar.style.width = item.progressWidth + 'px';
                        traceChildProgressBar.style.borderBottomRightRadius = this.progressBorderRadius + 'px';
                        traceChildProgressBar.style.borderTopRightRadius = this.progressBorderRadius + 'px';
                        childProgressResizer.style.left = item.progressWidth - 8 + 'px';
                    }
                }
            } else if (this.taskBarEditAction === 'RightResizing' && !isNullOrUndefined(traceChildTaskBar)) {
                traceChildTaskBar.style.width = (width) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    taskBarRightResizer.style.left = rightResizer + 'px';
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.left = (item.progressWidth - 10) + 'px';
                    }
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
                if (!isNullOrUndefined(traceChildTaskBar) && !segmentedTaskBarContainer) {
                    traceChildTaskBar.style.width = (width) + 'px';
                }
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    taskBarRightResizer.style.left = rightResizer + 'px';
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.left = item.progressWidth - 10 + 'px';
                    }
                }
                if (segmentedTaskBarContainer) {
                    taskBarRightResizer.style.left = rightResizer + 'px';
                    traceChildProgressBar.style.width = (segment.progressWidth) + 'px';
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.left = segment.progressWidth - 10 + 'px';
                    }
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
        this.previousMouseMove = null;
        this.editTooltip.showHideTaskbarEditTooltip(false, this.segmentIndex);
        if (this.taskBarEditAction && this.isMouseDragged) {
            if (!this.dragMouseLeave && this.taskBarEditedAction) {
                this.taskBarEditedAction(e);
                this.isMouseDragged = false;
            } else {
                this.cancelTaskbarEditActionInMouseLeave();
            }
        }
        if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar && !isNullOrUndefined(this.taskBarEditElement)) {
            if (!isNullOrUndefined(this.taskBarEditElement.querySelector('.e-gantt-child-taskbar'))) {
                if (this.taskBarEditElement.querySelector('.e-gantt-child-taskbar').classList.contains('e-collapsed-taskbar-drag')) {
                    removeClass([this.taskBarEditElement.querySelector('.e-gantt-child-taskbar')], 'e-collapsed-taskbar-drag');
                    (this.taskBarEditElement as HTMLElement).style.zIndex = this.prevZIndex;
                    this.prevZIndex = '';
                }
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

    public updateSegmentProgress(taskData: ITaskData): void {
        let segments: ITaskSegment[] = taskData.segments;
        let fixedWidth: boolean = true;
        let totalTaskWidth: number = this.splitTasksDuration(segments) * this.parent.perDayWidth;
        let totalProgressWidth: number = this.parent.dataOperation.getProgressWidth(totalTaskWidth, taskData.progress);
        for (let i: number = 0; i < segments.length; i++) {
            let segment: ITaskSegment = segments[i];
            delete segment.progressWidth;
            if (totalProgressWidth > 0 && totalProgressWidth > segment.width) {
                totalProgressWidth = totalProgressWidth - segment.width;
                segment.progressWidth = segment.width;
                segment.showProgress = false;
            } else if (fixedWidth) {
                segment.progressWidth = totalProgressWidth;
                segment.showProgress = true;
                totalProgressWidth = totalProgressWidth - segment.width;
                fixedWidth = false;
            }
        }
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
                if (!isNullOrUndefined(taskData.segments)) {
                    this.updateSegmentProgress(taskData);
                }
            }
        } else {
            let segments: ITaskSegment[] = args.data.ganttProperties.segments;
            if (!isNullOrUndefined(segments) && segments.length > 0
                && ((this.taskBarEditAction === 'LeftResizing' && this.segmentIndex !== 0)
                    || (this.taskBarEditAction === 'ChildDrag' && this.segmentIndex !== 0)
                    || (this.taskBarEditAction === 'RightResizing'))) {
                let segment: ITaskSegment = segments[this.segmentIndex];
                let ganttProp: ITaskData = this.taskBarEditRecord.ganttProperties;
                let length: number = segments.length;
                let previousSegment: ITaskSegment = this.segmentIndex === 0 ? null
                    : segments[this.segmentIndex - 1];
                let nextSegment: ITaskSegment = this.segmentIndex === segments.length - 1 ? null
                    : segments[this.segmentIndex + 1];
                let sDate: Date = !isNullOrUndefined(nextSegment) ?
                    new Date(nextSegment.startDate.getTime()) : this.parent.cloneProjectEndDate;
                let eDate: Date = !isNullOrUndefined(previousSegment) ?
                    new Date(previousSegment.endDate.getTime()) : this.parent.cloneProjectStartDate;
                sDate.setHours(0, 0, 0, 0); eDate.setHours(0, 0, 0, 0);
                let cStartDate: Date = new Date(segment.startDate.getTime());
                let cEndDate: Date = new Date(segment.endDate.getTime());
                cStartDate.setDate(cStartDate.getDate() - 1); cEndDate.setDate(cEndDate.getDate() + 1);
                cStartDate.setHours(0, 0, 0, 0); cEndDate.setHours(0, 0, 0, 0);
                if (cStartDate.getTime() <= eDate.getTime()) {
                    let segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[] = [
                        { 'firstSegmentIndex': previousSegment.segmentIndex, 'secondSegmentIndex': segment.segmentIndex }
                    ];
                    this.parent.chartRowsModule.mergeTask
                        (ganttProp.taskId, segmentIndexes);
                } else if (cEndDate.getTime() >= sDate.getTime() && this.segmentIndex !== segments.length - 1) {
                    let segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[] = [
                        { 'firstSegmentIndex': segment.segmentIndex, 'secondSegmentIndex': nextSegment.segmentIndex }
                    ];
                    this.parent.chartRowsModule.mergeTask
                        (ganttProp.taskId, segmentIndexes);
                } else if (cEndDate.getTime() >= sDate.getTime()) {
                    segment.endDate.setDate(this.parent.cloneProjectEndDate.getDate() - 1);
                    segment.startDate = this.parent.dataOperation.getStartDate(
                        segment.endDate, segment.duration, ganttProp.durationUnit, ganttProp);
                    for (let i: number = segments.length - 2; i >= 0; i++) {
                        let segment: ITaskSegment = segments[i];
                        let eDate: Date = segment.endDate;
                        eDate.setDate(eDate.getDate() - segment.offsetDuration);
                        segment.endDate = eDate;
                        segment.startDate = this.parent.dataOperation.getStartDate(
                            segment.endDate, segment.duration, ganttProp.durationUnit, ganttProp);
                    }
                }
            }
            this.parent.dataOperation.updateWidthLeft(args.data);
        }
        this.parent.dataOperation.updateTaskData(ganttRecord);
        this.parent.editModule.initiateUpdateAction(args);
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
            this.editTooltip.showHideTaskbarEditTooltip(false, this.segmentIndex);
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
        let uniqueId: string = this.parent.viewType === 'ResourceView' ? fromItem.taskId : fromItem.rowUniqueID;

        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            predecessor = uniqueId + 'S';
        } else if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            predecessor = uniqueId + 'F';
        }

        if (this.connectorSecondAction) {
            if (this.connectorSecondAction === 'ConnectorPointLeftDrag') {
                predecessor += 'S';
                currentTarget = 'start';
            } else if (this.connectorSecondAction === 'ConnectorPointRightDrag') {
                predecessor += 'F';
                currentTarget = 'finish';
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
                this.editTooltip.showHideTaskbarEditTooltip(true, this.segmentIndex);
            }
            if (this.editTooltip.toolTipObj) {
                this.parent.connectorLineModule.tooltipTable.innerHTML = this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(
                    this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName,
                    this.parent.editModule.taskbarEditModule.fromPredecessorText, '', ''
                );
                let table: NodeList = this.parent.connectorLineModule.tooltipTable.querySelector('#toPredecessor').querySelectorAll('td');
                (table[1] as HTMLElement).innerText = toItem.taskName;
                (table[2] as HTMLElement).innerText = this.parent.localeObj.getConstant(currentTarget);
                let tooltipElement: HTMLElement = this.parent.connectorLineModule.tooltipTable.parentElement.parentElement;
                if (tooltipElement.offsetTop + tooltipElement.offsetHeight > e.pageY) {
                    tooltipElement.style.top = (e.pageY - tooltipElement.offsetHeight - 20) + 'px';
                }
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