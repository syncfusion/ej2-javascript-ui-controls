import { isNullOrUndefined, createElement, extend, addClass, remove, removeClass, closest, merge } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { parentsUntil } from '../base/utils';
import {
    IGanttData, ITaskData, ITaskbarEditedEventArgs, IActionBeginEventArgs, IDependencyEventArgs, MousePoint, IPredecessor, ITaskSegment
} from '../base/interface';
import { DateProcessor } from '../base/date-processor';
import * as cls from '../base/css-constants';
import { EditTooltip } from '../renderer/edit-tooltip';
import { CriticalPath } from './critical-path';

/**
 * File for handling taskbar editing operation in Gantt.
 */
export class TaskbarEdit extends DateProcessor {
    protected parent: Gantt;
    public taskBarEditElement: HTMLElement;
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
    private elementOffsetLeft: number = 0;
    private elementOffsetTop: number = 0;
    private elementOffsetWidth: number = 0;
    private elementOffsetHeight: number = 0;
    public segmentIndex: number = -1;
    private targetElement: Element;
    public currentItemTop: number = 0;
    public currentItemPrevTop: number = 0;
    public topValue: number = 0;
    public draggedRecordMarginTop: number = 0;
    public dragMoveY: number;
    private realTaskbarElement :Element;
    private cloneTaskbarElement : HTMLElement ;
    private taskbarElement:HTMLElement;
    private taskbarResizer :HTMLElement;
    private currentIndex :string;
    private currentData :IGanttData;
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
     *
     * @returns {void} .
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
            'autoLeft', 'autoDuration', 'autoStartDate', 'autoEndDate', 'autoWidth', 'segments'];
        this.tapPointOnFocus = false;
        this.touchEdit = false;
    }

    private mouseDownHandler(e: PointerEvent): void {
        if (this.parent.editSettings.allowTaskbarEditing && !this.parent.readOnly) {
            this.canDrag = false;
            if (this.taskBarEditElement) {
                const targetElement: Element = this.getElementByPosition(e);
                const element: Element = parentsUntil(targetElement, cls.taskBarMainContainer);
                if ((element && element.innerHTML === this.taskBarEditElement.innerHTML ||  this.taskBarEditElement.classList.contains("e-segmented-taskbar")||this.taskBarEditElement.classList.contains("collpse-parent-border"))) {
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
        if (!this.parent.editSettings.allowTaskbarEditing) {
            return;
        }
        const targetElement: Element = this.getElementByPosition(e);
        const element: Element = parentsUntil(targetElement, cls.taskBarMainContainer);
        if (this.parent.selectionModule && this.parent.selectionModule.enableSelectMultiTouch) {
            if (this.tapPointOnFocus) {
                this.updateTaskBarEditElement(e);
            }
            return;
        }
        if (this.tapPointOnFocus && !isNullOrUndefined(this.taskBarEditElement) && element && element.innerHTML !== this.taskBarEditElement.innerHTML) {
            this.connectorSecondRecord = this.parent.ganttChartModule.getRecordByTaskBar(element);
            this.connectorSecondAction = 'ConnectorPointLeftDrag';
            this.connectorSecondElement = element;
            this.fromPredecessorText = 'Finish';
            if (this.validateConnectorPoint()) {
                this.taskBarEditingAction(e, true);
            }
            this.showHideActivePredecessors(false);
            this.initPublicProp();
        } else if (targetElement.classList.contains(cls.connectorPointLeftHover)) {
            this.canDrag = false;
            this.multipleSelectionEnabled();
            this.showHideTaskBarEditingElements(targetElement, this.taskBarEditElement);
            this.tapPointOnFocus = true;
            this.taskBarEditAction = 'ConnectorPointLeftDrag';
            this.connectorSecondRecord = this.taskBarEditRecord;
            this.taskBarEditingAction(e, false);
        }
        else if (targetElement.classList.contains(cls.connectorPointRightHover)) {
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
        const ganttProp: ITaskData = this.taskBarEditRecord.ganttProperties;
        const predecessors: IPredecessor[] = ganttProp.predecessor;
        const id: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId : ganttProp.rowUniqueID;
        if (predecessors) {
            for (let i: number = 0; i < predecessors.length; i++) {
                const predecessor: IPredecessor = predecessors[i as number];
                if (id.toString() === predecessor.from || id.toString() === predecessor.to) {
                    this.applyActiveColor(predecessor.from, predecessor.to, show);
                }
            }
        }
        const chartContent: Element = this.parent.ganttChartModule.chartBodyContainer;
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
        const taskId: string = this.parent.viewType === 'ProjectView' ? this.taskBarEditRecord.ganttProperties.taskId.toString() :
            this.taskBarEditRecord.ganttProperties.rowUniqueID.toString();
        const ganttRecord: IGanttData = (taskId === from) ? this.parent.connectorLineModule.getRecordByID(to) :
            this.parent.connectorLineModule.getRecordByID(from);
        const $tr: Element = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(ganttRecord)];
        if (!isNullOrUndefined($tr)) {
            const $taskbar: Element = $tr.querySelector('.' + cls.taskBarMainContainer);
            const $connectorElement: Element = this.parent.element.querySelector('#ConnectorLineparent' + from + 'child' + to);
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

    private validateConnectorPoint(): boolean {
        const parentRecord: ITaskData = this.taskBarEditRecord.ganttProperties;
        const childRecord: ITaskData = this.connectorSecondRecord.ganttProperties;
        let isValid: boolean = true;
        const parentId: string = this.parent.viewType === 'ResourceView' ? parentRecord.taskId : parentRecord.rowUniqueID;
        const childId: string = this.parent.viewType === 'ResourceView' ? childRecord.taskId : childRecord.rowUniqueID;
        if (this.connectorSecondRecord.hasChildRecords) {
            isValid = false;
        } else if (childRecord.predecessor) {
            for (let i: number = 0; i < childRecord.predecessor.length; i++) {
                const predecessor: IPredecessor = childRecord.predecessor[i as number];
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
    // eslint-disable-next-line
    private mouseLeaveHandler(e: PointerEvent): void {
        if (this.taskBarEditAction === "ChildDrag" ||this.taskBarEditAction === "ParentDrag" || this.taskBarEditAction === "ProgressResizing" || this.taskBarEditAction === "LeftResizing" || this.taskBarEditAction === "RightResizing") {
            this.dragMouseLeave = false;
        }
        else {
            this.dragMouseLeave = true;
        }
    }

    /**
     * To update taskbar edited elements on mouse down action.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    public updateTaskBarEditElement(e: PointerEvent): void {
        const target: Element = this.getElementByPosition(e);
        let element: Element;
        if (target.classList.contains(cls.manualParentRightResizer) || target.classList.contains(cls.manualParentMainContainer)
            || target.classList.contains(cls.manualParentTaskBar)) {
            element = parentsUntil(target, cls.manualParentMainContainer);
        } else if (target.classList.contains(cls.manualParentMilestone)) {
            element = parentsUntil(target, cls.manualParentMilestone);
        } else {
            element = parentsUntil(target, cls.taskBarMainContainer);
            if (!isNullOrUndefined(element) && !target.classList.contains('e-connectorpoint-left') &&
                !target.classList.contains('e-connectorpoint-right')) {
                const currentRecord: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                if (!isNullOrUndefined(currentRecord.ganttProperties.segments) && currentRecord.ganttProperties.segments.length > 0) {
                    element = parentsUntil(target, cls.childTaskBarInnerDiv);
                }
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing && element) {
            this.showHideTaskBarEditingElements(element, this.editElement);
            this.editElement = element;
            this.realTaskbarElement = this.editElement;
            const index: string = this.editElement.getAttribute('data-segment-index');
            if (!isNullOrUndefined(index)) {
                this.segmentIndex = Number(index);
            } else {
                this.segmentIndex = -1;
            }
            this.taskBarEditRecord = this.parent.ganttChartModule.getRecordByTaskBar(this.editElement);
            if (e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'click') {
                this.taskBarEditAction = this.getTaskBarAction(e);
                const index: string = this.editElement.getAttribute('data-segment-index')
                const currentRecord: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                const ganttprop: ITaskData = currentRecord.ganttProperties
                const parentleft: number = this.editElement.parentElement.offsetLeft
                this.currentData = currentRecord;
                const resizeElement = createElement(
                    'div', { styles: 'height:100%;border-style:dashed;border-bottom:none;border-top:none;border-width:1px;position:absolute;z-index:10000' });
                addClass([resizeElement as HTMLElement], 'e-taskbar-resize-div');
                (resizeElement as HTMLElement).style.setProperty("width", ganttprop.width + "px");
                const currentindex: string = this.editElement.getAttribute('data-segment-index');
                (resizeElement as HTMLElement).style.setProperty("left", ((!isNullOrUndefined(ganttprop.segments) ? parentleft + ganttprop.segments[Number(currentindex)].left + "px" : (ganttprop.left) + "px")));
                const resizeTable = this.parent.createElement('table');
                const resizetableBody = this.parent.createElement("tbody");
                resizetableBody.appendChild(resizeElement)
                resizeTable.appendChild(resizetableBody);
                var Check = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
                let createTable: Element = null;
                if ((this.taskBarEditAction === 'ChildDrag' || this.taskBarEditAction === 'LeftResizing') && !isNullOrUndefined(index) && !isNullOrUndefined(index) ? Number(index) === 0 : false) {
                    var cloneTaskBar = this.editElement.parentElement.cloneNode(true);
                } else {
                    var cloneTaskBar = this.editElement.cloneNode(true);
                }

                if (!Check) {
                    addClass([cloneTaskBar as HTMLElement], 'e-clone-taskbar');
                    (cloneTaskBar as HTMLElement).style.setProperty("position", "absolute");
                    (cloneTaskBar as HTMLElement).style.setProperty("top", 0 + "px");
                    createTable = this.parent.createElement('table');
                    const tableBody = this.parent.createElement("tbody");
                    tableBody.appendChild(cloneTaskBar);
                    createTable.appendChild(tableBody);
                }
                if ((this.taskBarEditAction === 'ChildDrag' || this.taskBarEditAction === 'LeftResizing') && !isNullOrUndefined(index) && !isNullOrUndefined(index) ? Number(index) === 0 : false) {

                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        (cloneTaskBar as Element).getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    this.cloneTaskbarElement = segmentedTasks[Number(index)]
                }
                else {

                    this.cloneTaskbarElement = (cloneTaskBar as HTMLElement)
                }
                this.taskBarEditElement = this.cloneTaskbarElement;
               (this.taskbarElement as any) = createTable;
               (this.taskbarResizer as any) = resizeTable;
                this.currentIndex = index
                this.roundOffDuration = true;          
                if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') &&
                    isNullOrUndefined(this.parent.taskFields.dependency)) {
                    this.taskBarEditAction = null;
                }
                this.updateMouseDownProperties(e);
                if (this.parent.viewType === 'ResourceView') {
                    if (this.taskBarEditRecord.level === 0) {
                        return;
                    } else if (this.parent.enableMultiTaskbar) {
                        const parentRecord: IGanttData = this.parent.getTaskByUniqueID(this.taskBarEditRecord.parentItem.uniqueID);
                        if (!isNullOrUndefined(parentRecord) && !parentRecord.expanded) {
                            this.prevZIndex = (this.taskBarEditElement).style.zIndex;
                            (this.taskBarEditElement).style.zIndex = '1000';
                            if (this.taskBarEditElement.querySelector('.e-gantt-child-taskbar')) {
                               addClass([this.taskBarEditElement.querySelector('.e-gantt-child-taskbar')], 'e-collapsed-taskbar-drag');
                            }
                        }
                    }
                }
            }
        } else {
            if (this.parent.isAdaptive) {
                if (this.taskBarEditElement) {
                    this.showHideTaskBarEditingElements(element, this.editElement);
                }
                this.initPublicProp();
            } else {
                this.showHideTaskBarEditingElements(element, this.editElement);
            }
        }
    }

    /**
     * To show/hide taskbar editing elements.
     *
     * @param {Element} element .
     * @param {Element} secondElement .
     * @param {boolean} fadeConnectorLine .
     * @returns {void} .
     * @private
     */
    public showHideTaskBarEditingElements(element: Element, secondElement: Element, fadeConnectorLine?: boolean): void {
        secondElement = secondElement ? secondElement : this.editElement;
        let isShowProgressResizer: boolean = this.parent.taskFields.progress ? true : false;
        let isShowConnectorPoints: boolean = true;
        if (this.parent.readOnly) {
            return;
        }
        if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar && element) {
            const record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
            const parentRecord: IGanttData = this.parent.getParentTask(record.parentItem);
            if (!isNullOrUndefined(parentRecord)) {
                if (!parentRecord.expanded) {
                    isShowProgressResizer = false;
                    isShowConnectorPoints = false;
                }
            }
        }
        if (element) {
            if (element.querySelector('.' + cls.taskBarLeftResizer)) {
                addClass([element.querySelector('.' + cls.taskBarLeftResizer)], [cls.leftResizeGripper]);
                addClass([element.querySelector('.' + cls.taskBarRightResizer)], [cls.rightResizeGripper]);
                if (isShowProgressResizer) {
                    const progressElement = element.querySelector('.' + cls.childProgressResizer) as HTMLElement;
                    if (!isNullOrUndefined(progressElement)) {
                        addClass([progressElement], [cls.progressResizeGripper]);
                        progressElement.style.top = '3px';
                    }
                }
            } else if (this.parent.isAdaptive && isShowProgressResizer) {
                const record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(element);
                if (record.hasChildRecords) {
                    addClass([element], [cls.activeParentTask]);
                }
            }
            addClass(
                this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + cls.connectorLineContainer), [cls.connectorLineZIndex]);
            if (!isNullOrUndefined(this.parent.taskFields.dependency)
                && (element.querySelector('.' + cls.connectorPointLeft)
                    || element.parentElement.querySelector('.' + cls.connectorPointLeft))
                && isShowConnectorPoints) {
                const connectorElement: Element = !isNullOrUndefined(element.querySelector('.' + cls.connectorPointLeft)) ?
                    element : element.parentElement;
                if(! isNullOrUndefined(connectorElement.querySelector('.' + cls.connectorPointLeft))){
                addClass(
                    [connectorElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);}
                    if(!isNullOrUndefined(connectorElement.querySelector('.' + cls.connectorPointRight))){
                addClass(
                    [connectorElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
                }
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
                const connectorElement: Element = !isNullOrUndefined(secondElement.querySelector('.' + cls.connectorPointLeft)) ?
                    secondElement : secondElement.parentElement;
                removeClass(
                    [connectorElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointLeftHover]);
                removeClass(
                    [connectorElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointRightHover]);
            } else if (this.parent.isAdaptive) {
                const record: IGanttData = this.parent.ganttChartModule.getRecordByTaskBar(secondElement);
                if (record && record.hasChildRecords) {
                    removeClass([secondElement], [cls.activeParentTask]);
                }
            }
            this.editElement = null;
        }
    }

    /**
     * To get taskbar edit actions.
     *
     * @param {PointerEvent} e .
     * @returns {string} .
     * @private
     */
    private getTaskBarAction(e: PointerEvent): string {
        const mouseDownElement: Element = this.getElementByPosition(e);
        const data: IGanttData = this.taskBarEditRecord;
        let action: string = '';
        if (mouseDownElement.classList.contains(cls.taskBarLeftResizer)) {
            action = 'LeftResizing';
        } else if (mouseDownElement.classList.contains(cls.taskBarRightResizer)) {
            action = 'RightResizing';
        } else if ((mouseDownElement.classList.contains(cls.childProgressResizer) ||
            closest(mouseDownElement, '.' + cls.childProgressResizer)) && (this.parent.taskFields.progress)) {
            action = 'ProgressResizing';
        } else if (mouseDownElement.classList.contains(cls.connectorPointLeft)) {
            action = 'ConnectorPointLeftDrag';
        } else if (mouseDownElement.classList.contains(cls.connectorPointRight)) {
            action = 'ConnectorPointRightDrag';
        } else if (mouseDownElement.classList.contains(cls.manualParentRightResizer)) {
            action = 'ParentResizing';
        } else if (mouseDownElement.classList.contains(cls.manualParentTaskBar) ||
            mouseDownElement.classList.contains(cls.manualParentMainContainer) ||
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
     *
     * @param {PointerEvent} event .
     * @returns {void} .
     * @private
     */
    private updateMouseDownProperties(event: PointerEvent): void {
        const e: MousePoint = this.getCoordinate(event);
        const parentWithZoomStyle = this.parent.element.closest('[style*="zoom"]') as HTMLElement;
        if (parentWithZoomStyle) {
            const zoom1: number = parseFloat((getComputedStyle(parentWithZoomStyle) as any).zoom);
            e.pageX = e.pageX / zoom1;
            e.pageY = e.pageY / zoom1;
        }
        if (e.pageX || e.pageY) {
            const containerPosition: { top: number, left: number } =
                this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
            if (this.parent.enableRtl) {
                this.mouseDownX = Math.abs(e.pageX - (containerPosition.left +
                    Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left)));
            }
            else {
                this.mouseDownX = (e.pageX - containerPosition.left) +
                    this.parent.ganttChartModule.scrollObject.previousScroll.left;
            }
            this.tooltipPositionX = this.mouseDownX;
            this.mouseDownY = this.dragMoveY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        if (this.parent.viewType == "ResourceView" && this.parent.allowTaskbarDragAndDrop) {
            let toolbarHeight: number = 0;
            if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
                toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
            }
            this.topValue = this.parent.getOffsetRect(event.target as HTMLElement).top - this.parent.getOffsetRect(this.parent.element).top -
                            parseInt((closest(event.target as Element, '.e-taskbar-main-container'))['style'].marginTop) -
                            this.parent.element.getElementsByClassName('e-timeline-header-container')[0]['offsetHeight'] -
                            toolbarHeight + document.getElementsByClassName('e-chart-scroll-container e-content')[0].scrollTop;
            this.currentItemPrevTop = this.currentItemTop = this.topValue;
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
            const item: ITaskData = this.taskBarEditRecord.ganttProperties;
            this.previousItem = this.parent.timelineModule.extendFunction(item, this.previousItemProperty) as ITaskData;
            if (this.taskBarEditAction !== 'ConnectorPointLeftDrag' &&
                this.taskBarEditAction !== 'ConnectorPointRightDrag' &&
                !(this.parent.viewType == 'ResourceView' && this.taskBarEditAction == 'ParentDrag')) {
                this.editTooltip.showHideTaskbarEditTooltip(true, this.segmentIndex);
            }
            this.taskBarEditElement.setAttribute('aria-grabbed', 'true');
        }
    }
    /**
     * To handle mouse move action in chart
     *
     * @param {PointerEvent} event .
     * @returns {void} .
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
        const containerPosition: { top: number, left: number } =
            this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        const e: MousePoint = this.getCoordinate(event);
        if (this.parent.enableRtl) {
            this.mouseMoveX = Math.abs(e.pageX - (containerPosition.left +
                Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left)));
        }
        else {
            this.mouseMoveX = e.pageX - containerPosition.left +
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
        }
        this.mouseMoveY = e.pageY - containerPosition.top +
            this.parent.ganttChartModule.scrollObject.previousScroll.top;
        this.dragMouseLeave = false;
        this.isMouseDragCheck();
        if (this.isMouseDragged && this.taskBarEditAction) {
            event.preventDefault();
            if (!isNullOrUndefined(this.taskbarElement) && !isNullOrUndefined(this.editElement) && (this.taskBarEditAction !== "ConnectorPointRightDrag" && this.taskBarEditAction !== "ConnectorPointLeftDrag") && !(this.parent.viewType === 'ResourceView' && this.currentData.hasChildRecords)) {
                var currentElement = this.editElement.parentElement
                currentElement.style.setProperty("position", "absolute");
                if ((this.taskBarEditAction === 'ChildDrag' || this.taskBarEditAction === 'LeftResizing') && !isNullOrUndefined(this.currentIndex) && !isNullOrUndefined(this.currentIndex) ? Number(this.currentIndex) === 0 : false) {
                   (this.taskbarElement.childNodes[0].childNodes[0] as HTMLLIElement).style.setProperty("top", currentElement.parentElement.offsetTop + "px");
                    currentElement.parentElement.appendChild(this.taskbarElement)
                } else {
                    currentElement.appendChild(this.taskbarElement)
                }
                if(this.taskBarEditAction!=='ProgressResizing'){
                const rootElement = this.parent.ganttChartModule.chartBodyContainer.querySelectorAll(".e-chart-rows-container")
                rootElement[0].appendChild(this.taskbarResizer)
                }
            }
            const args: IActionBeginEventArgs = {
                cancel: false,
                requestType: 'taskbarediting',
                taskBarEditAction: this.taskBarEditAction,
                data: this.taskBarEditRecord
            };
            if (this.segmentIndex !== -1) {
                args.requestType = 'mergeSegment'
            }
            this.parent.trigger('actionBegin', args, (arg: IActionBeginEventArgs) => {
                if (args.taskBarEditAction === "ConnectorPointRightDrag" || args.taskBarEditAction === "ConnectorPointLeftDrag"
                || args.taskBarEditAction === "LeftResizing" || args.taskBarEditAction === "RightResizing"
                || args.taskBarEditAction === "ProgressResizing" || args.taskBarEditAction === "ChildDrag" || args.taskBarEditAction === "ParentDrag" || args.taskBarEditAction === "MilestoneDrag" || args.taskBarEditAction === "ManualParentDrag") {
                    this.parent.showIndicator = false;
                }
                if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" && this.parent.showIndicator) {
                    this.parent.showMaskRow();
                } else if (this.parent.showIndicator) {
                    this.parent.showSpinner();
                }
                if (arg.cancel === false) {
                    this.taskBarEditingAction(event, false);
                }
            });
        } else if (!this.parent.isAdaptive && !this.taskBarEditAction) {
            this.updateTaskBarEditElement(event);
        }
    }
    /**
     * Method to update taskbar editing action on mous move.
     *
     * @param {PointerEvent} e .
     * @param {boolean} isMouseClick .
     * @returns {void} .
     * @private
     */
    public taskBarEditingAction(e: PointerEvent, isMouseClick: boolean): void {
        const args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
        const recordIndex: number = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
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
            args.segmentIndex = this.segmentIndex;
            this.roundOffDuration = args.roundOffDuration;
            this.targetElement = args.target = closest((e.target as Element), '.e-gantt-child-taskbar');
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
                    this.drawFalseLine();
            }
            if (this.parent.viewType == 'ResourceView' && this.parent.allowTaskbarDragAndDrop) {
                if (this.dragMoveY > this.mouseMoveY) {
                    this.mouseMoveY = this.dragMoveY - this.mouseMoveY;
                    this.currentItemTop = this.currentItemTop - this.mouseMoveY;
                } else {
                    this.mouseMoveY -= this.dragMoveY;
                    this.currentItemTop = this.currentItemTop + this.mouseMoveY;
                }
                const containerPosition: { top: number, left: number } = this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
                if(this.parent.isAdaptive || (e as any).touches) {
                    this.dragMoveY = (e as any).touches[0].pageY- containerPosition.top + this.parent.ganttChartModule.scrollObject.previousScroll.top;
  
                }else{
                    this.dragMoveY = e.pageY - containerPosition.top + this.parent.ganttChartModule.scrollObject.previousScroll.top;
                }
                this.topValue = this.currentItemTop;
                this.currentItemPrevTop = (this.currentItemPrevTop === 0 ||
                    this.topValue == this.currentItemTop) ? this.topValue :
                    this.currentItemPrevTop;
            }
            this.setItemPosition();
            this.updateEditedItem();
            this.editTooltip.updateTooltip(this.segmentIndex);
            if (isMouseClick) {
                this.taskBarEditedAction(e);
            }
            this.parent.trigger('taskbarEditing', args, (arg: ITaskbarEditedEventArgs) => {
                if (arg.cancel && this.taskBarEditRecord !== null) {
                    this.tapPointOnFocus = false;
                    merge(this.taskBarEditRecord.ganttProperties, arg.previousData);
                }

            });
        }

}

    /**
     * To update property while perform mouse move.
     *
     * @param {PointerEvent} event .
     * @returns {void} .
     * @private
     */
    private updateMouseMoveProperties(event: PointerEvent): void {
        const containerPosition: { top: number, left: number } =
            this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        const e: MousePoint = this.getCoordinate(event);
        const parentWithZoomStyle = this.parent.element.closest('[style*="zoom"]') as HTMLElement;
        if (parentWithZoomStyle) {
            const zoom1: number = parseFloat((getComputedStyle(parentWithZoomStyle) as any).zoom);
            e.pageX = e.pageX / zoom1;
            e.pageY = e.pageY / zoom1;
        }
        if (e.pageX || e.pageY) {
            if (this.parent.enableRtl) {
                this.mouseMoveX = Math.abs(e.pageX - (containerPosition.left +
                    Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left)));
            }
            else {
                this.mouseMoveX = e.pageX - containerPosition.left +
                    this.parent.ganttChartModule.scrollObject.previousScroll.left;
            }
            this.tooltipPositionX = this.mouseMoveX;
            this.mouseMoveY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        const isConnectorLineEdit: boolean = (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') ?
            true : false;
        if ((this.taskBarEditRecord.ganttProperties.width > 3 && !(this.taskBarEditAction === 'ProgressResizing' &&
            (this.taskBarEditRecord.ganttProperties.progress === 0 || this.taskBarEditRecord.ganttProperties.progress === 100))) ||
            isConnectorLineEdit) {
            let mouseX: number = 0;
            if (this.parent.enableRtl) {
                mouseX = Math.abs(Math.abs(this.mouseMoveX) - Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left) +
                    containerPosition.left);
            }
            else {
                mouseX = this.mouseMoveX - this.parent.ganttChartModule.scrollObject.previousScroll.left +
                    containerPosition.left;
            }
            const mouseY: number = this.mouseMoveY - this.parent.ganttChartModule.scrollObject.previousScroll.top +
                containerPosition.top;
            if ((mouseX + 20) >
                containerPosition.left + this.parent.ganttChartModule.chartBodyContainer.offsetWidth) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('right');
            } else if ((mouseX + 40) >
                containerPosition.left + this.parent.ganttChartModule.chartBodyContainer.offsetWidth && this.parent.enableRtl && this.parent.ganttChartModule.scrollObject.previousScroll.left == 0) {
                this.parent.ganttChartModule.scrollObject.previousScroll.left = -1;
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('right');
            } else if ((mouseX - 20) < containerPosition.left) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('left');
            } else if (((mouseY + 80) >
                containerPosition.top + this.parent.ganttChartModule.chartBodyContainer.offsetHeight)) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.startScrollTimer('bottom');
            } else if (((mouseY - 20) < containerPosition.top)) {
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
     *
     * @param {string} direction .
     * @returns {void} .
     * @private
     */
    public startScrollTimer(direction: string): void {
        this.stopScrollTimer();
        let leftSign: number = 0;
        this.scrollTimer = window.setInterval(
            () => {
                if (Math.sign(this.timerCount) == -1) {
                    leftSign = -1;
                    this.timerCount = Math.abs(this.timerCount);
                }
                if (direction === 'right') {
                    this.timerCount = (this.timerCount + 1) >= this.parent.timelineModule.totalTimelineWidth ?
                        this.parent.timelineModule.totalTimelineWidth : (this.timerCount + 1);
                }
                else if (direction === 'bottom') {
                    this.timerCount = this.timerCount + 1;
                }
                else {
                    this.timerCount = (this.timerCount - 1) < 0 ? 0 : (this.timerCount - 1);
                }
                if (direction === 'bottom' || direction === 'top') {
                    this.parent.ganttChartModule.scrollObject.setScrollTop(this.timerCount);
                } else {
                    this.parent.ganttChartModule.scrollObject.setScrollLeft(this.timerCount, leftSign);
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
     *
     * @returns {void} .
     * @private
     */
    public stopScrollTimer(): void {
        window.clearInterval(this.scrollTimer);
        this.scrollTimer = null;
    }

    /**
     * To update left and width while perform taskbar drag operation.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private enableDragging(e: PointerEvent): void {
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let differenceWidth: number = 0;
        if (this.taskBarEditElement.classList.contains('e-segmented-taskbar') &&
            !this.taskBarEditElement.classList.contains('e-segment-first')) {
            const segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
            const segment: ITaskSegment = segments[this.segmentIndex];
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
            const previousSegment: ITaskSegment = segments[this.segmentIndex - 1];
            const nextSegment: ITaskSegment = segments[this.segmentIndex + 1];
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
            const left: number = item.left < 0 ? 0 : (item.left + item.width) >= this.parent.timelineModule.totalTimelineWidth ?
                (this.parent.timelineModule.totalTimelineWidth - item.width) : item.left;
            this.parent.setRecordValue('left', left, item, true);
        }
    }

    /**
     * To update left and width while perform progress resize operation.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private performProgressResize(e: PointerEvent): void {
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
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
        const diff: number = item.width - item.progressWidth;
        if (diff <= 4) {
            this.progressBorderRadius = 4 - diff;
        } else {
            this.progressBorderRadius = 0;
        }
    }

    /**
     * To update left and width while perform taskbar left resize operation.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private enableLeftResizing(e: PointerEvent): void {
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
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
        const segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
        const segment: ITaskSegment = segments[this.segmentIndex];
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
                        const previousSegment: ITaskSegment = segments[this.segmentIndex - 1];
                        if ((item.left + segment.left) < (item.left + previousSegment.left + previousSegment.width)) {
                            const difference: number =
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
                        const segment: ITaskSegment = segments[i as number];
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
                        const segment: ITaskSegment = segments[i as number];
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
                        const singleDayDifference: number = (segment.width - differenceWidth) < this.parent.perDayWidth ?
                            this.parent.perDayWidth > segment.width ?
                                this.parent.perDayWidth - segment.width : segment.width - this.parent.perDayWidth : 0;
                        differenceWidth -= singleDayDifference;
                        if (this.segmentIndex === 0) {
                            this.parent.setRecordValue('width', item.width - differenceWidth, item, true);
                            this.parent.setRecordValue('left', item.left + differenceWidth, item, true);
                            segment.width = segment.width - differenceWidth;
                            for (let i: number = 1; i < item.segments.length; i++) {
                                const segment: ITaskSegment = segments[i as number];
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
     *
     * @param {PointerEvent} e .
     * @param {ITaskData} item .
     * @returns {void} .
     */
    private updateEditPosition(e: PointerEvent, item: ITaskData): void {
        this.updateIsMilestone(item);
        this.parent.setRecordValue(
            'progressWidth', this.parent.dataOperation.getProgressWidth(item.width, item.progress), item, true);
    }
    /**
     *  To update milestone property.
     *
     * @param {ITaskData} item .
     * @returns {void} .
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
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private enableRightResizing(e: PointerEvent): void {
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let differenceWidth: number = 0;
        if (this.taskBarEditElement.classList.contains('e-segmented-taskbar')) {
            const segments: ITaskSegment[] = this.taskBarEditRecord.ganttProperties.segments.map((e: ITaskSegment) => ({ ...e }));
            const segment: ITaskSegment = segments[this.segmentIndex];
            if (this.mouseDownX > this.mouseMoveX) {
                if (this.mouseMoveX > (item.left + segment.left) && (this.mouseDownX - this.mouseMoveX) > 3) {
                    differenceWidth = isNullOrUndefined(this.previousMouseMove) ?
                        (this.mouseDownX - this.mouseMoveX) : (this.previousMouseMove - this.mouseMoveX);
                    this.previousMouseMove = this.mouseMoveX;
                    segment.width = segment.width - differenceWidth;
                } else {
                    if (this.mouseMoveX < (item.left + segment.left)) {
                        var segmentWidth =(this.parent.timelineModule.isSingleTier &&
                        (this.parent.timelineModule.customTimelineSettings.bottomTier.unit === "Hour" ||
                          this.parent.timelineModule.customTimelineSettings.topTier.unit === "Hour" ||
                          this.parent.timelineModule.customTimelineSettings.bottomTier.unit === "Minutes" ||
                          this.parent.timelineModule.customTimelineSettings.topTier.unit === "Minutes") ) || 
                          (this.parent.timelineModule.customTimelineSettings.bottomTier.unit === "Hour" || 
                            this.parent.timelineModule.customTimelineSettings.bottomTier.unit === "Minutes") ? 
                          this.parent.timelineModule.customTimelineSettings.timelineUnitSize: 
                            this.parent.perDayWidth;
                        segment.width = segmentWidth; 
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
            const nextSegment: ITaskSegment = this.segmentIndex !== segments.length - 1 ? segments[this.segmentIndex + 1] : null;
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
     *
     * @returns {void} .
     * @private
     */
    private updateEditedItem(): void {
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
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
                    const tempEndDate: Date = this.getDateByLeft(left);
                    if (isNullOrUndefined(item.startDate)) {
                        startDate = this.parent.dateValidationModule.getValidStartDate(item);
                        this.parent.setRecordValue('startDate', startDate, item, true);
                    }
                    const tempdate: Date = isNullOrUndefined(item.startDate) ? startDate : item.startDate;
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
        const left: number = this.getRoundOffStartLeft(item, this.roundOffDuration);
        const projectStartDate: Date = this.getDateByLeft(left,item.isMilestone,item);
        let endDate: Date;
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
        const segment: ITaskSegment = item.segments[this.segmentIndex];
        const left: number = this.segmentIndex === 0 ? this.getRoundOffStartLeft(item, this.roundOffDuration) :
            this.getRoundOffStartLeft(segment, this.roundOffDuration);
        const projectStartDate: Date = this.segmentIndex === 0 ? this.getDateByLeft(left) : this.getDateByLeft(item.left + left);

        const startDate: Date = this.parent.dataOperation.checkStartDate(projectStartDate, item, false);
        const duration: number = this.parent.dataOperation.getDuration(
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
            const segmentOffsetDuration: number = this.parent.dataOperation.getDuration(
                item.segments[this.segmentIndex - 1].endDate, item.segments[this.segmentIndex].startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            segment.offsetDuration = segmentOffsetDuration;
        }
        this.parent.setRecordValue('segments', item.segments, item, true);
        this.parent.dataOperation.updateMappingData(this.taskBarEditRecord, 'segments');
    }
    private updateSplitRightResizing(item: ITaskData): void {
        const segment: ITaskSegment = item.segments[this.segmentIndex];
        const left: number = this.getRoundOffEndLeft(item, this.roundOffDuration);
        const tempEndDate: Date = this.getDateByLeft(left);
        const endDate: Date = this.parent.dataOperation.checkEndDate(tempEndDate, item, false);
        const duration: number = this.parent.dataOperation.getDuration(
            segment.startDate, endDate, item.durationUnit,
            item.isAutoSchedule, item.isMilestone);
        segment.endDate = new Date(endDate.getTime());
        segment.duration = duration;
        // update next segment offset duration
        if (!isNullOrUndefined(item.segments[this.segmentIndex + 1])) {
            const nextSegment: ITaskSegment = item.segments[this.segmentIndex + 1];
            const segmentOffset: number = this.parent.dataOperation.getDuration(
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
            const segment: ITaskSegment = segments[i as number];
            duration += segment.duration;
        }
        return duration;
    }

    private setSplitTaskDrag(item: ITaskData): void {
        const segment: ITaskSegment = item.segments[this.segmentIndex as number];
        const left: number = this.getRoundOffStartLeft(segment, this.roundOffDuration);
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
                item.segments[this.segmentIndex - 1].endDate, item.segments[this.segmentIndex as number].startDate, item.durationUnit,
                item.isAutoSchedule, item.isMilestone);
            if (segment.startDate.getDay() === 1 && offsetDuration === 0 && !this.parent.includeWeekend) {
                offsetDuration = 1;
            }
            segment.offsetDuration = offsetDuration;
        }
        //set next record  offset if present
        if (!isNullOrUndefined(item.segments[this.segmentIndex + 1])) {
            const nextSegment: ITaskSegment = item.segments[this.segmentIndex + 1];
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
     *
     * @param {ITaskData} ganttRecord .
     * @param {boolean} isRoundOff .
     * @returns {number} .
     * @private
     */
    private getRoundOffEndLeft(ganttRecord: ITaskData, isRoundOff: boolean): number {
        const tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let totalLeft: number = ganttRecord.width + ganttRecord.left;
        if (this.segmentIndex !== -1) {
            const segment: ITaskSegment = ganttRecord.segments[this.segmentIndex];
            totalLeft = totalLeft - ganttRecord.width + segment.width + segment.left;
        }
        let remainingContribution: number =
            (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainingLeft: number = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        const positionValue: number = remainingLeft / this.parent.perDayWidth;
        if (isRoundOff === undefined) {
            isRoundOff = false;
        }
        /*Rounding the decimal value for week-month-year schedule mode*/
        if (!isRoundOff) {
            if ((tierMode !== 'Hour' && tierMode !== 'Minutes')) {
                if (positionValue > 0.5) {
                    totalLeft = totalLeft - remainingLeft + this.parent.perDayWidth;
                } else if (positionValue < 0.5) {
                    totalLeft = (totalLeft - remainingLeft) + (this.parent.perDayWidth / 2);
                }
            }
        } else if (isRoundOff) {
            if (tierMode === 'Hour') {
                const inHour: number = (this.parent.perDayWidth / 24);
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Hour') / (1000 * 60 * 60)));
                remainingLeft = (this.parent.perDayWidth / 24) - ((this.parent.perDayWidth / 24) / remainingContribution);
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + inHour;
                }
            } else if (tierMode === 'Minutes') {
                const inMinutes: number = (this.parent.perDayWidth / (24 * 60));
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
     *
     * @param {ITaskData | ITaskSegment} ganttRecord .
     * @param {boolean} isRoundOff .
     * @returns {number} .
     * @private
     */
    public getRoundOffStartLeft(ganttRecord: ITaskData | ITaskSegment, isRoundOff: boolean): number {
        let left: number = isNullOrUndefined(ganttRecord as ITaskData) ? (ganttRecord as ITaskSegment).left
            : (ganttRecord as ITaskData).left;
        const tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let remainingContribution: number =
            (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left, isNullOrUndefined(ganttRecord as ITaskData) ? (ganttRecord as ITaskData).isMilestone : null, (ganttRecord as ITaskData)), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainDays: number = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        const remainDaysInDecimal: number = remainDays / this.parent.perDayWidth;
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
     *
     * @param {number} left .
     * @returns {Date} .
     * @private
     */
    public getDateByLeft(left: number,isMilestone?:boolean,property?:ITaskData): Date {
        let pStartDate: Date = new Date(this.parent.timelineModule.timelineStartDate.toString());
        const milliSecondsPerPixel: number = (24 * 60 * 60 * 1000) / this.parent.perDayWidth;
        pStartDate.setTime(pStartDate.getTime() + (left * milliSecondsPerPixel));
        /* To render the milestone in proper date while editing */
        if (isMilestone && !isNullOrUndefined(property.predecessorsName) && property.predecessorsName !== '') {
            pStartDate.setDate(pStartDate.getDate()-1);
            this.parent.dateValidationModule.setTime(this.parent.defaultEndTime,pStartDate);
            pStartDate = this.parent.dateValidationModule.checkStartDate(pStartDate,property,true)
        }
        const tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.topTier :
            this.parent.timelineModule.bottomTier;
        if (tierMode !== 'Hour' && tierMode !== 'Minutes') {
            if (this.parent.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && !this.parent.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() + (60 * 60 * 1000));
            } else if (!this.parent.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && this.parent.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() - (60 * 60 * 1000));
            }
        }
        return pStartDate;
    }

    /**
     * To set item position.
     *
     * @returns {void} .
     * @private
     */
    private setItemPosition(): void {
        if(!isNullOrUndefined(this.editElement)){
            var currentElement = this.editElement.parentElement
            if (this.parent.viewType == 'ResourceView' && this.parent.allowTaskbarDragAndDrop && this.taskBarEditAction === 'ChildDrag') {
                currentElement.style.position = null;
            }
            else {
                currentElement.style.setProperty("position", "absolute");
            }
        }
        const item: ITaskData = this.taskBarEditRecord.ganttProperties;
        let position: string = this.parent.enableRtl ? "right" : "left";
        const segment: ITaskSegment = !isNullOrUndefined(item.segments) ? item.segments[this.segmentIndex] : null;
        const width: number = this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone ?
            this.parent.chartRowsModule.milestoneHeight : item.width;
        let rightResizer: number = this.parent.isAdaptive ? (width - 2) : (width - 10);
        if (!isNullOrUndefined(segment)) {
            rightResizer = this.parent.isAdaptive ? (segment.width - 2) : (segment.width - 10);
        }
        this.taskBarEditElement.style.setProperty("opacity",'.75');
        const taskBarMainContainer: HTMLElement = (!this.taskBarEditElement.classList.contains(cls.taskBarMainContainer)) ? ((this.taskBarEditAction === 'ChildDrag' || this.taskBarEditAction === 'LeftResizing') && this.segmentIndex === 0 )?this.taskBarEditElement.parentElement  :  closest(this.taskBarEditElement, 'tr.' + cls.chartRow)
            .querySelector('.' + cls.taskBarMainContainer) : this.taskBarEditElement;
        const segmentedTaskBarContainer: boolean = this.taskBarEditElement.classList.contains('e-segmented-taskbar');
        const traceChildProgressBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceChildProgressBar);
        const traceChildTaskBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceChildTaskBar);
        const childProgressResizer: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.childProgressResizer);
        const taskBarRightResizer: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.taskBarRightResizer);
        const traceParentTaskBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceParentTaskBar);
        const traceParentProgressBar: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.traceParentProgressBar);
        const traceConnectorPointRight: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.rightConnectorPointOuterDiv);
        const segmentConnectorPointRight: HTMLElement =
            taskBarMainContainer.querySelector('.' + cls.rightConnectorPointOuterDiv);
        const manualParentTaskbar: HTMLElement = this.taskBarEditElement;
        const manualTaskbar: HTMLElement = this.taskBarEditElement.querySelector('.' + cls.manualParentTaskBar);
        const manualParentRight: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.manualParentRightResizer);
        const manualParentLeft: HTMLElement =
            this.taskBarEditElement.querySelector('.' + cls.manualParentLeftResizer);
            const resizeLine: HTMLElement = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div') 
        if (this.taskBarEditAction !== 'ConnectorPointRightDrag' &&
            this.taskBarEditAction !== 'ConnectorPointLeftDrag') {
            if (this.taskBarEditAction !== 'ParentResizing' && this.taskBarEditAction !== 'ManualParentDrag') {
                if (segmentedTaskBarContainer && !isNullOrUndefined(item.segments)
                    && (this.taskBarEditAction === 'RightResizing' || this.segmentIndex !== 0)) {
                     if(! isNullOrUndefined(resizeLine)){
                        resizeLine.style.width = (segment.width) + "px";
                        }
                    (this.taskBarEditElement as HTMLElement).style.width = (segment.width) + 'px';
                    if (this.parent.enableRtl) {
                        (this.taskBarEditElement as HTMLElement).style.right = (segment.left) + 'px';
                    }
                    else {
                        (this.taskBarEditElement as HTMLElement).style.left = (segment.left) + 'px';
                        if (!isNullOrUndefined(resizeLine)) {
                        resizeLine.style.left = (segment.left + this.editElement.parentElement.offsetLeft) + "px";
                        }
                    }
                }
                    taskBarMainContainer.style.setProperty(position, (item.left) + 'px');
                    taskBarMainContainer.style.width = (width) + 'px';
                if(segmentedTaskBarContainer && segmentConnectorPointRight){
                    segmentConnectorPointRight.style.left = (this.parent.isAdaptive ? (width + 10) : (width + 2)) + 'px';
                }
                if (this.parent.viewType === 'ResourceView' && this.parent.allowTaskbarDragAndDrop && this.parent.rowDragAndDropModule &&
                   (this.taskBarEditAction === 'ChildDrag' || this.taskBarEditAction === 'MilestoneDrag')) {
                    taskBarMainContainer.style.setProperty('top', (this.topValue) + 'px');
                    taskBarMainContainer.style.zIndex = '4';
                }      
                if (this.taskBarEditAction === 'LeftResizing' && this.segmentIndex === 0) {
                    this.taskBarEditElement.style.setProperty("opacity",'.75');
                    const parent: HTMLElement = this.taskBarEditElement.parentElement;
                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        parent.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    for (let i: number = 0; i < item.segments.length; i++) {
                        const segment: ITaskSegment = item.segments[i as number];
                        const segmentElement: HTMLElement = segmentedTasks[i as number] as HTMLElement;
                        (segmentElement as HTMLElement).style.width = (segment.width) + 'px';
                        if(i===0){
                            resizeLine.style.width = (segment.width) + "px";
                            resizeLine.style.left = (segment.left+item.left) + "px";
                        }
                        if (this.parent.enableRtl) {
                            (segmentElement as HTMLElement).style.right = (segment.left) + 'px';
                        }
                        else {
                            (segmentElement as HTMLElement).style.left = (segment.left) + 'px';
                        }
                    }
                }
                if (this.taskBarEditAction === 'ChildDrag' && this.segmentIndex === 0) {
                    resizeLine.style.width = (width) + "px";
                    resizeLine.style.left = (item.left) + "px";
                    taskBarMainContainer.style.setProperty("opacity",'.75');
                }
            }
            if (traceConnectorPointRight) {
                if (this.parent.enableRtl) {
                    traceConnectorPointRight.style.left = (this.parent.isAdaptive ? (width + 10) : (width - 2)) + 'px';
                }
                else {
                    traceConnectorPointRight.style.left = (this.parent.isAdaptive ? (width + 10) : (width + 2)) + 'px';
                }
            }
            if (this.taskBarEditAction === 'MilestoneDrag' || item.isMilestone) {
                taskBarMainContainer.style.setProperty(position, (item.left - (width / 2)) + 'px');
                resizeLine.style.left = (item.left - (width / 2)) + 'px';
                resizeLine.style.width = (width) + "px";
            } else if (this.taskBarEditAction === 'ProgressResizing') {
                if (this.segmentIndex === -1) {
                    traceChildTaskBar.style.setProperty(position, (item.left + item.progressWidth - 10) + 'px');
                    if (!isNullOrUndefined(traceChildProgressBar)) {
                        traceChildProgressBar.style.width = item.progressWidth + 'px';
                        traceChildProgressBar.style.borderBottomRightRadius = this.progressBorderRadius + 'px';
                        traceChildProgressBar.style.borderTopRightRadius = this.progressBorderRadius + 'px';
                        const width: number = this.parent.enableRtl ? item.progressWidth + 8 : item.progressWidth - 8;
                        childProgressResizer.style.setProperty(position, width + 'px');
                    }
                }
                else {
                    this.updateSegmentProgress(this.taskBarEditRecord.ganttProperties);
                    traceChildProgressBar.style.width = item.segments[this.segmentIndex as number].progressWidth + 'px';
                    traceChildProgressBar.style.borderBottomRightRadius = this.progressBorderRadius + 'px';
                    traceChildProgressBar.style.borderTopRightRadius = this.progressBorderRadius + 'px';
                    const width: number = this.parent.enableRtl ? item.segments[this.segmentIndex as number].progressWidth + 8 : item.segments[this.segmentIndex as number].progressWidth - 8;
                    childProgressResizer.style.setProperty(position, width + 'px');
                }
            } else if (this.taskBarEditAction === 'RightResizing' && !isNullOrUndefined(traceChildTaskBar)) {
                resizeLine.style.width = (width) + 'px';
                traceChildTaskBar.style.width = (width) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    taskBarRightResizer.style.setProperty(position, rightResizer + 'px');
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.setProperty(position, item.progressWidth - 10 + 'px');
                    }
                }
            } else if (this.taskBarEditAction === 'ParentDrag') {
                resizeLine.style.left = (item.left) + 'px';
                resizeLine.style.width = (width) + "px";
                resizeLine.style.width = (item.width) + 'px'
                if (!isNullOrUndefined(traceParentTaskBar)) {
                    traceParentTaskBar.style.width = (width) + 'px';
                    resizeLine.style.width = (item.width) + 'px'
                }
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    traceParentProgressBar.style.width = (item.progressWidth) + 'px';
                }
            } else if (this.taskBarEditAction === 'ParentResizing') {
                resizeLine.style.width = (item.width) + 'px';
                resizeLine.style.left = item.left + 'px';
                manualParentTaskbar.style.width = manualTaskbar.style.width = (item.width) + 'px';
                manualParentRight.style.setProperty(position, item.width - manualParentLeft.offsetLeft + 'px');
            } else if (this.taskBarEditAction === 'ManualParentDrag') {
                resizeLine.style.width = (item.width) + 'px';
                resizeLine.style.left = item.left + 'px';
                manualParentTaskbar.style.setProperty(position, item.left - item.autoLeft + 'px');
            } else {
                if (!isNullOrUndefined(traceChildTaskBar) && !segmentedTaskBarContainer) {
                    traceChildTaskBar.style.width = (item.width) + 'px';
                    traceChildTaskBar.style.left = (item.left) + 'px';
                    this.taskBarEditElement.style.width = (item.width) + 'px';
                    this.taskBarEditElement.style.left =(item.left)+"px";
                    resizeLine.style.left = (item.left) + 'px';
                    resizeLine.style.width = (item.width) + "px";
                }
                if (!isNullOrUndefined(traceChildProgressBar)) {
                    taskBarRightResizer.style.setProperty(position, rightResizer + 'px');
                    traceChildProgressBar.style.width = (item.progressWidth) + 'px';
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.setProperty(position, item.progressWidth - 10 + 'px');
                    }
                }
                if (segmentedTaskBarContainer) {
                    taskBarRightResizer.style.setProperty(position, rightResizer + 'px');
                    traceChildProgressBar.style.width = (segment.width) + 'px';
                    if (!isNullOrUndefined(childProgressResizer)) {
                        childProgressResizer.style.setProperty(position, segment.width - 10 + 'px');
                    }
                }
            }
        }
    }

    /**
     * To handle mouse up event in chart
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    public mouseUpHandler(e: PointerEvent): void {
        const mouseDragged: boolean = this.isMouseDragged;
        this.previousMouseMove = null;
        this.editTooltip.showHideTaskbarEditTooltip(false, this.segmentIndex);
        if (this.taskBarEditAction && this.isMouseDragged) {
            if ((!this.dragMouseLeave && this.taskBarEditedAction) || (this.parent.viewType === 'ResourceView' &&
                this.parent.allowTaskbarDragAndDrop)) {
                this.taskBarEditedAction(e);
                this.isMouseDragged = false;
            } else {
                this.parent.isOnEdit = false;
                this.cancelTaskbarEditActionInMouseLeave();
                if (this.parent.enableCriticalPath && this.parent.criticalPathModule) {
                    let criticalModule: CriticalPath = this.parent.criticalPathModule;
                    criticalModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection,
                        true, criticalModule.predecessorCollectionTaskIds);
                }
            }
        }
        if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar && !isNullOrUndefined(this.taskBarEditElement)) {
            if (!isNullOrUndefined(this.taskBarEditElement.querySelector('.e-gantt-child-taskbar'))) {
                if (this.taskBarEditElement.querySelector('.e-gantt-child-taskbar').classList.contains('e-collapsed-taskbar-drag')) {
                    removeClass([this.taskBarEditElement.querySelector('.e-gantt-child-taskbar')], 'e-collapsed-taskbar-drag');
                    this.taskBarEditElement.style.zIndex = this.prevZIndex;
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
     *
     * @param {PointerEvent} event .
     * @returns {void} .
     * @private
     */
    public taskBarEditedAction(event: PointerEvent): void {
        const args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
        const x1: number = this.mouseDownX;
        const y1: number = this.mouseDownY;
        const item: IGanttData = this.taskBarEditRecord;
        const recordIndex: number = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
        const x2: number = this.mouseMoveX;
        const e: MousePoint = this.getCoordinate(event);
        const resMouseY: number = e.pageY - this.parent.ganttChartModule.chartBodyContainer.offsetTop;
        if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') && !this.drawPredecessor) {
            this.dependencyCancel = true;
        }
        if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') && this.drawPredecessor && (!this.connectorSecondRecord.hasChildRecords || 
                    this.connectorSecondRecord.hasChildRecords && this.parent.allowParentDependency)) {
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
                    args.target = this.targetElement;
                    this.taskbarEditedArgs = args;
                    this.taskbarEdited(args);
                }
            }
        }
        this.parent['isProjectDateUpdated'] = false;
    }

    /**
     * To cancel the taskbar edt action.
     *
     * @returns {void} .
     * @private
     */
    public cancelTaskbarEditActionInMouseLeave(): void {
        this.parent.editModule.reUpdatePreviousRecords(true);
    }

    public updateSegmentProgress(taskData: ITaskData): void {
        const segments: ITaskSegment[] = taskData.segments;
        let fixedWidth: boolean = true;
        const totalTaskWidth: number = this.splitTasksDuration(segments) * this.parent.perDayWidth;
        let totalProgressWidth: number = this.parent.dataOperation.getProgressWidth(totalTaskWidth, taskData.progress);
        for (let i: number = 0; i < segments.length; i++) {
            const segment: ITaskSegment = segments[i as number];
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
     *
     * @param {ITaskbarEditedEventArgs} arg .
     * @returns {void} .
     * @private
     */
    public taskbarEdited(arg: ITaskbarEditedEventArgs): void {
        const args: ITaskbarEditedEventArgs = extend({}, arg);
        const ganttRecord: IGanttData = args.data;
        const taskData: ITaskData = ganttRecord.ganttProperties;
        const draggedRecIndex: number = this.parent.currentViewData.indexOf(ganttRecord);
        if ((args.taskBarEditAction === 'MilestoneDrag' || args.taskBarEditAction === 'ChildDrag') && this.parent.viewType === "ResourceView"
            && this.parent.allowTaskbarDragAndDrop && this.dragMoveY > 0) {
            if (this.parent.rowDragAndDropModule) {
                let flatRecordCol: IGanttData[] = this.parent.currentViewData;
                if (flatRecordCol[this.taskBarEditRecord.parentItem.index] && ((this.parent.editedRecords.indexOf(flatRecordCol[this.taskBarEditRecord.parentItem.index as number]) === -1))) {
                    this.parent.editedRecords.push(flatRecordCol[this.taskBarEditRecord.parentItem.index as number]);
                }
                let ganttrec: IGanttData;
                let resHeight: number = 0;
                let rowCount: number = 0;
                let childIndex: string;
                let droppedRecord: IGanttData[];
                let treeGridrows: number = this.parent.treeGrid.getRows().length;
                for (let i: number = 0; i < treeGridrows; i++) {
                    if (resHeight < this.dragMoveY && this.parent.getRowByIndex(i as number).style.display !== 'none') {
                        rowCount = i;
                        resHeight = resHeight + parseInt(this.parent.getRowByIndex(i as number).style.height);
                        if (!flatRecordCol[i as number].parentItem) {
                            ganttrec = flatRecordCol[i as number];
                        }
                        else {
                            ganttrec = this.parent.getRecordByID(flatRecordCol[i as number].parentItem.taskId);
                        }
                    }
                }
                let draggedRecordtaskbar: HTMLCollectionOf<Element> = this.parent.getRowByIndex(draggedRecIndex as number).getElementsByClassName('e-taskbar-main-container');
                let taskbarContainer: HTMLCollectionOf<Element> = this.parent.getRowByIndex(rowCount as number).getElementsByClassName('e-taskbar-main-container');
                for (let j: number = 0; j < taskbarContainer.length; j++) {
                    if (taskbarContainer[j as number]['offsetTop'] < this.dragMoveY && draggedRecordtaskbar[0].getAttribute('rowuniqueid') !==
                        taskbarContainer[j as number].getAttribute('rowuniqueid')) {
                        this.draggedRecordMarginTop = taskbarContainer[j as number]['style'].marginTop;
                        childIndex = taskbarContainer[j as number].getAttribute('rowuniqueid');
                    }
                }
                if (childIndex) {
                    droppedRecord = this.parent.currentViewData.filter((data: IGanttData) => {
                        if (data['rowUniqueID'] === childIndex) {
                            return data;
                        }
                        else {
                            return null
                        }
                    })
                }
                if (droppedRecord) {
                    const droppedRecordIndex: number = this.parent.currentViewData.indexOf(droppedRecord[0]);
                    let position: string = (droppedRecord[0].hasChildRecords || (!droppedRecord[0].parentItem &&
                        droppedRecord[0].childRecords.length == 0)) ? 'child' : 'below';
                    if (this.parent.rowDragAndDropModule) {
                        this.parent.rowDragAndDropModule.reorderRows([draggedRecIndex as number], droppedRecordIndex, position);
                    }
                    this.dragMoveY = 0;
                }
            }
            if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation) {
                this.parent.ganttChartModule.renderOverAllocationContainer();
            }
        }
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
            const segments: ITaskSegment[] = args.data.ganttProperties.segments;
            if (!isNullOrUndefined(segments) && segments.length > 0
                && ((this.taskBarEditAction === 'LeftResizing' && this.segmentIndex !== 0)
                    || (this.taskBarEditAction === 'ChildDrag' && this.segmentIndex !== 0)
                    || (this.taskBarEditAction === 'RightResizing'))) {
                const segment: ITaskSegment = segments[this.segmentIndex as number];
                const ganttProp: ITaskData = this.taskBarEditRecord.ganttProperties;
                const previousSegment: ITaskSegment = this.segmentIndex === 0 ? null
                    : segments[this.segmentIndex - 1];
                const nextSegment: ITaskSegment = this.segmentIndex === segments.length - 1 ? null
                    : segments[this.segmentIndex + 1];
                const sDate: Date = !isNullOrUndefined(nextSegment) ?
                    new Date(nextSegment.startDate.getTime()) : this.parent.cloneProjectEndDate;
                const eDate: Date = !isNullOrUndefined(previousSegment) ?
                    new Date(previousSegment.endDate.getTime()) : this.parent.cloneProjectStartDate;
                const cStartDate: Date = new Date(segment.startDate.getTime());
                const cEndDate: Date = new Date(segment.endDate.getTime());
                if (this.parent.timelineModule.topTier === 'Day' && this.parent.timelineModule.bottomTier === 'Hour') {
                    cStartDate.setHours(cStartDate.getHours() - 1);
                    cEndDate.setHours(cEndDate.getHours() + 1);
                }
                else {
                    sDate.setHours(0, 0, 0, 0);
                    eDate.setHours(0, 0, 0, 0);
                    cStartDate.setDate(cStartDate.getDate() - 1);
                    cEndDate.setDate(cEndDate.getDate() + 1);
                    cStartDate.setHours(0, 0, 0, 0);
                    cEndDate.setHours(0, 0, 0, 0);
                }
                if (cStartDate.getTime() <= eDate.getTime() && !isNullOrUndefined(previousSegment) && !isNullOrUndefined(segment)) {
                    const segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[] = [
                        { 'firstSegmentIndex': previousSegment.segmentIndex, 'secondSegmentIndex': segment.segmentIndex }
                    ];
                    this.parent.chartRowsModule.mergeTask(ganttProp.taskId, segmentIndexes);
                } else if (cEndDate.getTime() >= sDate.getTime() && this.segmentIndex !== segments.length - 1) {
                    const segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[] = [
                        { 'firstSegmentIndex': segment.segmentIndex, 'secondSegmentIndex': nextSegment.segmentIndex }
                    ];
                    this.parent.chartRowsModule.mergeTask(ganttProp.taskId, segmentIndexes);
                } else if (cEndDate.getTime() >= sDate.getTime()) {
                    segment.endDate.setDate(this.parent.cloneProjectEndDate.getDate() - 1);
                    segment.startDate = this.parent.dataOperation.getStartDate(
                        segment.endDate, segment.duration, ganttProp.durationUnit, ganttProp);
                    // eslint-disable-next-line
                    for (let i: number = segments.length - 2; i >= 0; i++) {
                        const segment: ITaskSegment = segments[i as number];
                        const eDate: Date = segment.endDate;
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
     *
     * @param {number} parentwidth .
     * @param {number} progresswidth .
     * @returns {number} .
     * @private
     */
    private getProgressPercent(parentwidth: number, progresswidth: number): number {
        return Math.ceil(((progresswidth / parentwidth) * 100));
    }

    /**
     * false line implementation.
     *
     * @returns {void} .
     * @private
     */
    private drawFalseLine(): void {

        const x1: number = this.mouseDownX;
        const y1: number = this.mouseDownY;
        const x2: number = this.mouseMoveX;
        const y2: number = this.mouseMoveY;
        const length: number = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        const angle: number = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const transform: string = 'rotate(' + (this.parent.enableRtl ? -angle : angle) + 'deg)';
        let left: number;
        let width: number = 0;
        if (!isNullOrUndefined(document.querySelectorAll(".e-chart-row")[0])) {
            width = (document.querySelectorAll(".e-chart-row")[0] as HTMLElement).offsetWidth;
        }
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            if (this.parent.enableRtl) {
                left = ((width - (this.elementOffsetLeft + (this.parent.chartRowsModule.connectorPointWidth / 2)))) -
                    Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left);
            }
            else {
                left = (this.elementOffsetLeft - (this.parent.chartRowsModule.connectorPointWidth / 2)) -
                    this.parent.ganttChartModule.scrollObject.previousScroll.left;
            }
        }
        if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            if (this.parent.enableRtl) {
                left = (width - (this.elementOffsetLeft + this.elementOffsetWidth +
                    (this.parent.chartRowsModule.connectorPointWidth / 2))) - Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left);
            }
            else {
                left = (this.elementOffsetLeft + this.elementOffsetWidth) +
                    (this.parent.chartRowsModule.connectorPointWidth / 2) - Math.abs(this.parent.ganttChartModule.scrollObject.previousScroll.left);
            }
        }
        const top: number = ((this.elementOffsetTop) + (this.elementOffsetHeight / 2) +
            this.parent.ganttChartModule.chartBodyContainer.offsetTop) - this.parent.ganttChartModule.scrollObject.previousScroll.top;

        this.removeFalseLine(false);

        this.falseLine = createElement('div', {
            className: cls.falseLine, id: 'ganttfalseline' + this.parent.element.id,
            styles: 'position: absolute;transform:' + transform + ';' +
                'border-top-width: 1px;border-top-style: dashed;z-index: 5;width:' + (length - 3) + 'px;' +
                'top:' + top + 'px;'
        });
        if (this.parent.enableRtl) {
            this.falseLine.style.left = 'auto';
            this.falseLine.style.right = left + 'px';
            this.falseLine.style.transformOrigin = '100% 0%';
        }
        else {
            this.falseLine.style.right = 'auto';
            this.falseLine.style.left = left + 'px';
            this.falseLine.style.transformOrigin = '0% 100%';
        }

        this.parent.ganttChartModule.chartBodyContainer.appendChild(this.falseLine);


    }
    /**
     *
     * @param {boolean} isRemoveConnectorPointDisplay .
     * @returns {void} .
     * @private
     */
    public removeFalseLine(isRemoveConnectorPointDisplay: boolean): void {
        if (this.falseLine) {
            remove(this.falseLine);
            this.falseLine = null;
            if (isRemoveConnectorPointDisplay) {
                this.elementOffsetLeft = 0;
                this.elementOffsetTop = 0;
                this.elementOffsetWidth = 0;
                this.elementOffsetHeight = 0;
                removeClass(
                    this.parent.ganttChartModule.scrollElement.querySelectorAll(
                        '.' + cls.connectorLineContainer),
                    [cls.connectorLineZIndex]);
            }
        }
    }
    /**
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    public updateConnectorLineSecondProperties(e: PointerEvent): void {
        const target: Element = this.getElementByPosition(e);
        const element: Element = parentsUntil(target, cls.taskBarMainContainer);
        const isBigger: Boolean = document.body.className.includes("e-bigger");
        this.connectorSecondAction = null;
        let scrollTop: number = 0;
        if (parentsUntil(target, cls.connectorPointLeft)) {
            this.connectorSecondAction = 'ConnectorPointLeftDrag';
            this.toPredecessorText = 'Start';
        } else if (parentsUntil(target, cls.connectorPointRight)) {
            this.connectorSecondAction = 'ConnectorPointRightDrag';
            this.toPredecessorText = 'Finish';
        } else {
            this.connectorSecondAction = null;
            this.toPredecessorText = null;
        }
        if (this.taskBarEditElement !== element && this.taskBarEditElement !== this.highlightedSecondElement) {
            if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                const top: number = this.parent.virtualScrollModule.getTopPosition();
                scrollTop = top;
            }
            if ((this.parent.virtualScrollModule && this.parent.enableVirtualization &&
                !this.elementOffsetLeft) || !this.parent.enableVirtualization) {
                if (!this.parent.allowParentDependency) {
                    this.elementOffsetLeft = (this.realTaskbarElement as HTMLElement).offsetLeft - ((isBigger) ? 10 : 0);
                    this.elementOffsetTop = (this.realTaskbarElement as HTMLElement).parentElement.offsetTop+(this.realTaskbarElement as HTMLElement).offsetHeight/3 + scrollTop;
                }
                else {
                    if (this.taskBarEditElement.children[0].classList.contains('e-manualparent-main-container')) {
                        this.elementOffsetLeft = (this.realTaskbarElement as HTMLElement).children[0]['offsetLeft'] +(this.realTaskbarElement as HTMLElement).offsetLeft - ((isBigger) ? 10 : 0);
                        this.elementOffsetTop = (((this.realTaskbarElement as HTMLElement).parentElement.offsetTop+(this.realTaskbarElement as HTMLElement).offsetHeight/3 - 5) + this.taskBarEditElement.children[0]['offsetTop']) + scrollTop;
                    }
                    else {
                        this.elementOffsetLeft = (this.realTaskbarElement as HTMLElement).offsetLeft - ((isBigger) ? 10 : 0);
                        this.elementOffsetTop = (this.realTaskbarElement as HTMLElement).parentElement.offsetTop+(this.realTaskbarElement as HTMLElement).offsetHeight/3 + scrollTop;
                    }
                }
                this.elementOffsetWidth = (this.realTaskbarElement as HTMLElement).offsetWidth + ((isBigger) ? 20 : 0);
                this.elementOffsetHeight =(this.realTaskbarElement as HTMLElement).offsetHeight;
            }
            this.showHideTaskBarEditingElements(element, this.highlightedSecondElement, true);
        }
        if (isNullOrUndefined(this.connectorSecondAction) && !isNullOrUndefined(this.connectorSecondElement) &&
                (!this.connectorSecondRecord.hasChildRecords || this.connectorSecondRecord.hasChildRecords &&
                this.parent.allowParentDependency)) {
            this.editTooltip.showHideTaskbarEditTooltip(false, this.segmentIndex);
            removeClass([this.connectorSecondElement.querySelector('.' + cls.connectorPointLeft)], [cls.connectorPointAllowBlock]);
            removeClass([this.connectorSecondElement.querySelector('.' + cls.connectorPointRight)], [cls.connectorPointAllowBlock]);
        }
        this.connectorSecondElement = this.connectorSecondAction ? element : null;
        this.highlightedSecondElement = element;
        this.connectorSecondRecord = isNullOrUndefined(this.connectorSecondElement) ?
            null : this.parent.ganttChartModule.getRecordByTaskBar(this.connectorSecondElement);
    }
    // eslint-disable-next-line
    private triggerDependencyEvent(e: PointerEvent, mouseUp?: boolean): void {
        const parentWithZoomStyle = this.parent.element.closest('[style*="zoom"]');
        let zoomedPageY: number;
        if (parentWithZoomStyle) {
            const zoom1: number = parseFloat((getComputedStyle(parentWithZoomStyle) as any).zoom);
            zoomedPageY = e.pageY / zoom1;
        }
        const fromItem: ITaskData = this.taskBarEditRecord.ganttProperties;
        const toItem: ITaskData = this.connectorSecondRecord ? this.connectorSecondRecord.ganttProperties : null;
        let predecessor: string;
        let currentTarget: string;
        const target: Element = this.getElementByPosition(e);
        const element: HTMLElement = target as HTMLElement;
        const uniqueId: string = this.parent.viewType === 'ResourceView' ? fromItem.taskId : fromItem.rowUniqueID;

        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            predecessor = uniqueId + (this.parent.enableRtl ? 'F' : 'S');
        }
        else if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            predecessor = uniqueId + (this.parent.enableRtl ? 'S' : 'F');
        }

        if (this.connectorSecondAction) {
            if (this.connectorSecondAction === 'ConnectorPointLeftDrag') {
                predecessor += this.parent.enableRtl ? 'F' : 'S';
                currentTarget = this.parent.enableRtl ? 'finish' : 'start';
            }
            else if (this.connectorSecondAction === 'ConnectorPointRightDrag') {
                predecessor += this.parent.enableRtl ? 'S' : 'F';
                currentTarget = this.parent.enableRtl ? 'start' : 'finish';
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
        const isValidLink: boolean =
            this.parent.connectorLineEditModule.validatePredecessorRelation(this.connectorSecondRecord, this.finalPredecessor);
        // eslint-disable-next-line
        const predecessorArray: IPredecessor[] = this.parent.predecessorModule.calculatePredecessor(predecessor, this.connectorSecondRecord);
        const args: IDependencyEventArgs = {} as IDependencyEventArgs;
        args.fromItem = fromItem;
        args.toItem = toItem;
        args.newPredecessorString = this.finalPredecessor;
        args.predecessor = predecessorArray && predecessorArray[0];
        args.isValidLink = isValidLink;
        args.requestType = 'ValidateDependency';
        this.parent.trigger('actionBegin', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" && args.requestType != "ValidateDependency" ) {
            this.parent.showMaskRow();
        } else if (args.requestType != "ValidateDependency") {
            this.parent.showSpinner();
        }
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
                const table: NodeList = this.parent.connectorLineModule.tooltipTable.querySelector('#toPredecessor').querySelectorAll('td');
                (table[1] as HTMLElement).innerText = toItem.taskName;
                (table[2] as HTMLElement).innerText = this.parent.localeObj.getConstant(currentTarget);
                const tooltipElement: HTMLElement = this.parent.connectorLineModule.tooltipTable.parentElement.parentElement;
                if (tooltipElement.offsetTop + tooltipElement.offsetHeight > zoomedPageY) {
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
        const coordinates: MousePoint = {};
        const e: PointerEvent = event as PointerEvent;
            coordinates.pageX = e.pageX;
            coordinates.pageY = e.pageY;
        if (event && event.type !== 'click') {
            const e: TouchEvent = event as TouchEvent;
            if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
                coordinates.pageX = e.changedTouches[0].pageX;
                coordinates.pageY = e.changedTouches[0].pageY;
            }
        }
        return coordinates;
    }

    // Get current target element by mouse position
    // window.pageXOffset && window.pageYOffset is used to find the accurate element position in IPad/IPhone
    private getElementByPosition(event: TouchEvent | PointerEvent): Element {
        if (!this.parent.isAdaptive) {
            return event.target as Element;
        } else {
            const e: MousePoint = this.getCoordinate(event);
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
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        this.stopScrollTimer();
        this.parent.editModule.taskbarEditModule = undefined;
    }
}
