import { createElement, isNullOrUndefined, isObject, remove } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { IGanttData, ITaskData, IConnectorLineObject, IPredecessor } from '../base/interface';
import { isScheduledTask } from '../base/utils';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * To render the connector line in Gantt
 */
export class ConnectorLine {
    private transform: string = '';
    private connectorLinePath: string = '';
    private arrowPath: string = '';
    private taskLineValue: number;
    private x1: number;
    private x2: number;
    private x3: number;
    private x4: number;
    private y1: number;
    private y2: number;
    private y3: number;
    private y4: number;
    private manualParent:number;
    private manualChild:number;
    private point1: number;
    private point2: number;
    private parent: Gantt;
    public dependencyViewContainer: HTMLElement;
    private lineColor: string;
    private lineStroke: number;
    public tooltipTable: HTMLElement;
    public renderer: SvgRenderer;
    private connectorId:string;
    /**
     * @hidden
     */
    public expandedRecords: IGanttData[];
    public svgObject: Element;
    private connectorPath: Element;
    private arrowlinePath: Element;
    private groupObject: Element;
    constructor(ganttObj?: Gantt) {
        this.expandedRecords = [];
        this.parent = ganttObj;
        this.dependencyViewContainer =
            createElement('div', { className: cls.dependencyViewContainer,
             });
        Object.assign(this.dependencyViewContainer.style, {
            width: "100%",
            height: "100%",
            zIndex: 2,
            position: "absolute",
            pointerEvents: "none"
        });
        this.renderer=new SvgRenderer(this.parent.element.id)
        this.initPublicProp();
        this.svgObject = this.renderer.createSvg({
            id: this.parent.element.id + '_svg'
        });
        this.svgObject.setAttribute('height', '100%');
        this.svgObject.setAttribute('width', '100%');
    }

    /**
     * To get connector line gap.
     *
     * @param {IConnectorLineObject} data .
     * @returns {number} .
     * @private
     */
    private getconnectorLineGap(data: IConnectorLineObject): number {
        let width: number = 0;
        width = (data.milestoneChild ?
            ((this.parent.chartRowsModule.milestoneMarginTop / 2) + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            ((this.parent.chartRowsModule.taskBarMarginTop / 2) + (this.parent.chartRowsModule.taskBarHeight / 2)));
        return width;
    }

    /**
     * To initialize the public property.
     *
     * @returns {void}
     * @private
     */
    public initPublicProp(): void {
        this.lineColor = this.parent.connectorLineBackground;
        this.lineStroke = (this.parent.connectorLineWidth) > 4 ? 4 : this.parent.connectorLineWidth;
        this.createConnectorLineTooltipTable();
    }

    private getTaskbarMidpoint(isMilestone: boolean): number {
        return Math.floor(isMilestone ?
            (this.parent.chartRowsModule.milestoneMarginTop + (this.parent.chartRowsModule.milestoneHeight / 2)) + 1 :
            (this.parent.chartRowsModule.taskBarMarginTop + (this.parent.chartRowsModule.taskBarHeight / 2))) + 1;
    }

    /**
     * To connector line object collection.
     *
     * @param {IGanttData} parentGanttData .
     * @param {IGanttData} childGanttData .
     * @param {IPredecessor}  predecessor .
     * @returns {void}
     * @private
     */
    public createConnectorLineObject(parentGanttData: IGanttData, childGanttData: IGanttData, predecessor: IPredecessor):
        IConnectorLineObject {
        const connectorObj: IConnectorLineObject = {} as IConnectorLineObject;
        const updatedRecords: IGanttData[] = this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport ?
            this.parent.flatData : this.expandedRecords;
        const parentIndex: number = updatedRecords.indexOf(parentGanttData);
        const childIndex: number = updatedRecords.indexOf(childGanttData);
        const parentGanttRecord: ITaskData = parentGanttData.ganttProperties;
        const childGanttRecord: ITaskData = childGanttData.ganttProperties;
        const currentData: IGanttData[] = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            this.parent.currentViewData : this.parent.getExpandedRecords(this.parent.currentViewData);
        connectorObj.parentIndexInCurrentView = currentData.indexOf(parentGanttData);
        connectorObj.childIndexInCurrentView = currentData.indexOf(childGanttData);
        const isVirtualScroll: boolean = this.parent.virtualScrollModule && this.parent.enableVirtualization;
        if ((!isVirtualScroll && (connectorObj.parentIndexInCurrentView === -1 || connectorObj.childIndexInCurrentView === -1)) ||
            connectorObj.parentIndexInCurrentView === -1 && connectorObj.childIndexInCurrentView === -1) {
            return null;
        } else {
            connectorObj.parentLeft = parentGanttRecord.isMilestone ?
                parentGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : parentGanttRecord.left;
            connectorObj.childLeft = childGanttRecord.isMilestone ?
                childGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : childGanttRecord.left;
            connectorObj.parentWidth = parentGanttRecord.width === 0 || parentGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : parentGanttRecord.width;
            connectorObj.childWidth = childGanttRecord.width === 0 || childGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : childGanttRecord.width;
            connectorObj.parentIndex = parentIndex;
            connectorObj.childIndex = childIndex;
            const rowHeight: number = !isNullOrUndefined(this.parent.ganttChartModule.getChartRows()) && this.parent.ganttChartModule.getChartRows()[0] &&
                this.parent.ganttChartModule.getChartRows()[0].getBoundingClientRect().height;
            connectorObj.rowHeight = rowHeight && !isNaN(rowHeight) ? rowHeight : this.parent.rowHeight;
            connectorObj.type = predecessor.type;
            const parentId: string = this.parent.viewType === 'ResourceView' ? parentGanttRecord.taskId : parentGanttRecord.rowUniqueID;
            const childId: string = this.parent.viewType === 'ResourceView' ? childGanttRecord.taskId : childGanttRecord.rowUniqueID;
            connectorObj.connectorLineId = 'parent' + parentId + 'child' + childId;
            connectorObj.milestoneParent = parentGanttRecord.isMilestone ? true : false;
            connectorObj.milestoneChild = childGanttRecord.isMilestone ? true : false;
            connectorObj.isManualParent = (!(this.parent.flatData[parentIndex as number].ganttProperties.isAutoSchedule) && this.parent.flatData[parentIndex as number].hasChildRecords);
            connectorObj.isManualChild = (!(this.parent.flatData[childIndex as number].ganttProperties.isAutoSchedule) && this.parent.flatData[childIndex  as number].hasChildRecords);
            connectorObj.parentEndPoint= connectorObj.parentLeft + connectorObj.parentWidth;
            connectorObj.childEndPoint= connectorObj.childLeft + connectorObj.childWidth;
            if (isNullOrUndefined(isScheduledTask(parentGanttRecord)) || isNullOrUndefined(isScheduledTask(childGanttRecord))) {
                return null;
            } else {
                return connectorObj;
            }
        }
    }

    /**
     * To render connector line.
     *
     * @param {IConnectorLineObject} connectorLinesCollection .
     * @returns {void}
     * @private
     */
    public renderConnectorLines(connectorLinesCollection: IConnectorLineObject[]): void {
        let connectorLine: string = '';
        const ariaConnector: IConnectorLineObject[] = [];
        for (let index: number = 0; index < connectorLinesCollection.length; index++) {
            connectorLine = connectorLine + this.getConnectorLineTemplate(connectorLinesCollection[index as number]);
            ariaConnector.push(connectorLinesCollection[index as number]);
        }
        this.svgObject.innerHTML = connectorLine;
        const childNodes: NodeList = this.parent.connectorLineModule.svgObject.childNodes;
        for (let i: number = 0; i < childNodes.length; i++) {
            const innerChild: NodeList = childNodes[i as number].childNodes;
            for (let j: number = 0; j < innerChild.length; j++) {
                const ariaString: string = 'Connector Line ' + this.parent.connectorLineModule.generateAriaLabel(ariaConnector[i as number]);
                (<HTMLElement>innerChild[j as number]).setAttribute('aria-label', ariaString);
            }
        }
        this.parent.ganttChartModule.chartBodyContent.insertBefore(this.dependencyViewContainer, this.parent.ganttChartModule.chartBodyContent.lastChild);
            this.dependencyViewContainer.appendChild(this.svgObject);
        for (let i: number = 0; i<this.svgObject.children.length ; i++) {
            (<HTMLElement>this.svgObject.children[i as number].children[0]).setAttribute('tabindex', '-1');
        }
    }

    /**
     * To get parent position.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    private getParentPosition(data: IConnectorLineObject): string {
        if (data.parentIndex < data.childIndex) {
            if (data.type === 'FF') {
                if ((data.childLeft + data.childWidth) >= (data.parentLeft + data.parentWidth)) {
                    return 'FFType2';
                } else {
                    return 'FFType1';
                }
            } else if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth + 25))) {
                if (data.type === 'FS') {
                    return 'FSType1';
                }
                if (data.type === 'SF') {
                    return 'SFType1';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'FF') {
                    return 'FFType2';
                }
            } else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if (data.parentLeft > (data.childLeft + data.childWidth + 25)) {
                    if (data.type === 'SF') {
                        return 'SFType2';
                    }
                }
                if (data.parentLeft > data.childLeft) {
                    if (data.type === 'SS') {
                        return 'SSType1';
                    }
                    if (data.type === 'SF') {
                        return 'SFType1';
                    }
                    if (data.type === 'FF') {
                        return 'FFType1';
                    }
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType2';
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType2';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'FF') {
                    return 'FFType1';
                } else if (data.type === 'SF') {
                    return 'SFType1';
                }
            } else if ((data.parentLeft) < data.childLeft) {

                if (data.type === 'FS') {
                    return 'FSType2';
                } else if (data.type === 'FF') {
                    return 'FFType2';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'SF') {
                    return 'SFType1';
                }
            }
        } else if (data.parentIndex > data.childIndex) {
            if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth))) {
                if (data.type === 'FS') {
                    if (30 >= (data.childLeft - (data.milestoneParent ?
                        (data.parentLeft + data.parentWidth + 4) : (data.parentLeft + data.parentWidth)))) {
                        return 'FSType3';
                    } else {
                        return 'FSType4';
                    }
                }
                if (data.parentLeft < data.childLeft || ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth))) {
                    if (data.type === 'SS') {
                        return 'SSType4';
                    }
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                    // eslint-disable-next-line
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                }
            } else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if ((data.childLeft + data.childWidth) <= (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType3';
                    }
                    if (data.type === 'SF') {
                        if ((data.childLeft + data.childWidth + 25) < (data.parentLeft)) {
                            return 'SFType3';
                        } else {
                            return 'SFType4';
                        }
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        } else {
                            return 'SSType4';
                        }
                    }
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        } else {
                            return 'SSType4';
                        }
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType3';
                }
            } else if (data.parentLeft < data.childLeft) {
                if (data.type === 'FS') {
                    return 'FSType3';
                }
                if (data.type === 'SS') {
                    return 'SSType4';
                }
                if (data.type === 'FF') {
                    return 'FFType4';
                }
                if (data.type === 'SF') {
                    return 'SFType4';
                }
            }
        }
        return null;
    }

    /**
     * To get line height.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    private getHeightValue(data: IConnectorLineObject): number {
        if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
            return (data.parentIndex * this.parent.rowHeight) > (data.childIndex * this.parent.rowHeight) ?
            ((data.parentIndex * this.parent.rowHeight) - (data.childIndex * this.parent.rowHeight)) :
            ((data.childIndex * this.parent.rowHeight) - (data.parentIndex * this.parent.rowHeight));
        }
        else {
            return (data.parentIndex * data.rowHeight) > (data.childIndex * data.rowHeight) ?
            ((data.parentIndex * data.rowHeight) - (data.childIndex * data.rowHeight)) :
            ((data.childIndex * data.rowHeight) - (data.parentIndex * data.rowHeight));
        }
    }

    /**
     * To get sstype2 inner element width.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    private getInnerElementWidthSSType2(data: IConnectorLineObject): number {
        if (data.parentLeft === data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }

    /**
     * To get sstype2 inner element left.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    private getInnerElementLeftSSType2(data: IConnectorLineObject): number {
        if (data.parentLeft === data.childLeft) {
            return (data.parentLeft - 20);
        }
        return (data.parentLeft - 10);
    }

    /**
     * To get sstype2 inner child element width.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    private getInnerChildWidthSSType2(data: IConnectorLineObject): number {
        if ((data.parentLeft + data.parentWidth) < data.childLeft) {
            return 10;
        }
        if (data.parentLeft === data.childLeft) {
            return 20;
        }
        if ((data.parentLeft + data.parentWidth) >= data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }

    private getBorderStyles(cssType: string, unit: number): string {
        const borderWidth: string = 'border-' + cssType + '-width:' + unit + 'px;';
        const borderStyle: string = 'border-' + cssType + '-style:solid;';
        const borderColor: string = !isNullOrUndefined(this.lineColor) ? 'border-' + cssType + '-color:' + this.lineColor + ';' : '';
        return (borderWidth + borderStyle + borderColor);
    }

    /**
     * To get connector line template.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    public getConnectorLineTemplate(data: IConnectorLineObject): string {
        const setInnerChildWidthSSType2: number = this.getInnerChildWidthSSType2(data);
        const setInnerElementWidthSSType2: number = this.getInnerElementWidthSSType2(data);
        const setInnerElementLeftSSType2: number = this.getInnerElementLeftSSType2(data);
        const height: number = this.getHeightValue(data);
        const isMilestoneParent: boolean = data.milestoneParent ? true : false;
        const isMilestone: boolean = data.milestoneChild ? true : false;
        let connectorContainer: string = '';
        const isVirtual: boolean = this.parent.virtualScrollModule && this.parent.enableVirtualization;
        const connectorLine: { top: number, height: number } = this.getPosition(data, this.getParentPosition(data), height);
        const rowPosition: { top: number, height: number } = this.getPosition(data, this.getParentPosition(data), height);
        let rowPositionHeight: number = rowPosition.top;
        let isMilestoneValue = 0;
        if (this.parent.renderBaseline) {
            isMilestoneValue = (data.milestoneParent && data.milestoneChild) ? 0 : data.milestoneParent ? -5 : data.milestoneChild ? 5 : 0;
        }
        let heightValue: number = isVirtual ? connectorLine.height : (height + isMilestoneValue);
        let borderTopWidth: number = 0;
        let addTop: number = 0;
        let parentOverlapTopValue: number = 0;
        let childOverlapTopValue: number = 0;
        let count: number = 0;
        if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                if (this.parent.getRowByIndex(i as number).style.display != 'none') {
                    if (count < data.parentIndex) {
                        count++;
                        parentOverlapTopValue = parentOverlapTopValue + this.parent.getRowByIndex(i as number).offsetHeight;
                    }
                }
            }
            count = 0;
            for (let j: number = 0; j < this.parent.currentViewData.length; j++) {
                if (this.parent.getRowByIndex(j as number).style.display != 'none') {
                    if (count < data.childIndex) {
                        count++;
                        childOverlapTopValue = childOverlapTopValue + this.parent.getRowByIndex(j as number).offsetHeight;
                    }
                }
            }
            heightValue = Math.abs(parentOverlapTopValue - childOverlapTopValue);
        }
        if (this.parent.currentViewData[data.parentIndex] && this.parent.currentViewData[data.childIndex] && this.parent.allowParentDependency) {
            let fromRecordIsParent: boolean = this.parent.currentViewData[data.parentIndex].hasChildRecords;
            let toRecordIsParent: boolean = this.parent.currentViewData[data.childIndex].hasChildRecords;
            let fromRecordIsManual: boolean = this.parent.currentViewData[data.parentIndex].ganttProperties.isAutoSchedule;
            let toRecordIsManual: boolean = this.parent.currentViewData[data.childIndex].ganttProperties.isAutoSchedule;
            let isValid: boolean = true;
            if (((fromRecordIsParent && fromRecordIsManual) && !toRecordIsParent) || ((toRecordIsParent && toRecordIsManual) &&
                !fromRecordIsParent) || (fromRecordIsParent && fromRecordIsManual && toRecordIsManual && toRecordIsParent)
                || (!fromRecordIsParent && !toRecordIsParent)) {
                isValid = false;
            }
            if (isValid) {
                if (((fromRecordIsParent && !fromRecordIsManual) && (toRecordIsParent && !toRecordIsManual))) {
                    addTop = -11;
                }
                else if (!((fromRecordIsParent && !fromRecordIsManual) && (toRecordIsParent && !toRecordIsManual))) {
                    if (data.childIndex > data.parentIndex) {
                        if (!fromRecordIsParent && toRecordIsParent) {
                            borderTopWidth = -11;
                        }
                        else {
                            borderTopWidth = 11;
                            addTop = -11;
                        }
                    }
                    else {
                        if ((fromRecordIsParent && !toRecordIsParent)) {
                            borderTopWidth = -11;
                        }
                        else {
                            borderTopWidth = 11;
                            addTop = -11;
                        }
                    }
                }
                  if (this.parent.currentViewData[data.parentIndex].ganttProperties.isMilestone) {
                if (data.parentIndex > data.childIndex) {
            
                    addTop = -5;
                    borderTopWidth = 10;
                }
                else if (data.type === 'SS' || data.type === 'FF') {
                    addTop = -5;
                }
            }
            else if (this.parent.currentViewData[data.childIndex].ganttProperties.isMilestone) {
                if (data.parentIndex > data.childIndex) {
                    addTop = 5;
                    borderTopWidth = -10;
                }
                else if (data.type === 'SS' || data.type === 'FF') {
                    addTop = 5;
                }
            }
            }
          
        }
        if (this.getParentPosition(data)) {
            // Create the group element
            this.transform = this.parent.enableRtl ? `translate(${this.parent.timelineModule.totalTimelineWidth}, 0) scale(-1, 1)` : '';
            this.connectorId = "ConnectorLine" + data.connectorLineId;
            this.groupObject = this.renderer.createGroup({
                id: this.connectorId,
                transform: this.transform,
                style: 'pointer-events: stroke',
                class: cls.connectorLineContainer,
            });
            //  Create the path element for the connector line
            this.connectorPath = this.renderer.drawPath({
                class: cls.connectorLineSVG,
                d: this.connectorLinePath,
                fill: 'transparent',
                "stroke-width": 1,
            });
            // Create the path element for the arrow
            this.arrowlinePath = this.renderer.drawPath({
                d: this.arrowPath,
                class: cls.connectorLineArrow
            });
            // Append the path element to the group element
            this.groupObject.appendChild(this.connectorPath);
            this.groupObject.appendChild(this.arrowlinePath);

            if (this.getParentPosition(data) === 'FSType1') {
                this.taskLineValue = data.milestoneChild ? 1 : 0;
                this.x1 = data.parentEndPoint + (data.milestoneParent ? -1 : (data.milestoneChild ? -1 : 0));
                this.x2 = data.milestoneParent ? ((((data.childLeft - (data.parentEndPoint + 10)) + 1) - 10) + 1) : (((data.childLeft - (data.parentEndPoint + 10))) - 10);
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue + this.taskLineValue;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x2) + " " + (this.y1 + this.y2) +
                    " L " + (this.x1 + this.x2 + 11) + " " + (this.y1 + this.y2);
                this.arrowPath = "M " + (this.x1 + this.x2 + 18) + " " + (this.y1 + this.y2 + this.manualChild) +
                    " L " + (this.x1 + this.x2 + 11) + " " + (this.y1 + this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + this.x2 + 11) + " " + (this.y1 + this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";

            }
            if (this.getParentPosition(data) === 'FSType2') {
                this.taskLineValue = data.milestoneChild ? 1 : 0;
                this.x1 = data.parentLeft + (data.milestoneChild ? -1 : 0);
                this.x2 = data.parentWidth + (data.milestoneParent ? 1 : 0);
                this.x3 = this.x2 + (data.milestoneParent ? 11 : 10);
                this.x4 = data.parentWidth - ((data.parentEndPoint - data.childLeft) + 20);
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue - this.getconnectorLineGap(data) + this.taskLineValue;
                this.y3 = this.getconnectorLineGap(data);
                this.y4 = this.y1 + this.y2 - ((this.y1 + this.y2) % data.rowHeight);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " " + " L " + (this.x1 + this.x3) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x3) + " " + this.y4 +
                    " L " + (this.x1 + this.x4) + " " + this.y4 + " L " + (this.x1 + this.x4) + " " + (this.y1 + this.y2 + this.y3) + " L " + (this.x1 + this.x4 + 11) + " " + (this.y1 + this.y2 + this.y3);
                this.arrowPath = "M " + (this.x1 + this.x4 + 18) + " " + (this.y1 + this.y2 + this.y3 + this.manualChild) +
                    " L " + (this.x1 + this.x4 + 11) + " " + (this.y1 + this.y2 + this.y3 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + this.x4 + 11) + " " + (this.y1 + this.y2 + this.y3 + 4 + this.lineStroke + this.manualChild) + " Z";

            }

            if (this.getParentPosition(data) === 'FSType3') {
                this.taskLineValue = data.milestoneChild ? 1 : 0;
                this.point1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild));
                this.x1 = (data.childLeft + (data.milestoneChild ? -1 : 0) + (data.milestoneParent ? 1 : 0)) - 20;
                this.x2 = (data.parentEndPoint - data.childLeft) + 30;
                this.y1 = this.point1 + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.point1 + heightValue - this.getconnectorLineGap(data) + this.taskLineValue + (this.parent.renderBaseline ? (data.milestoneChild ? -10 : 0) : 0);
                this.y3 = this.getconnectorLineGap(data) + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.y4 = this.y2 - (this.y2 % data.rowHeight);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + 12) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + this.y4 +
                    " L " + (this.x1 + this.x2) + " " + this.y4 + " L " + (this.x1 + this.x2) + " " + (this.y2 + this.y3) + " L " + (this.x1 + this.x2 - 12) + " " + (this.y2 + this.y3);
                this.arrowPath = "M " + (this.x1 + 18) + " " + (this.y1 + this.manualChild) +
                    " L " + (this.x1 + 11) + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 11) + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";

            }

            if (this.getParentPosition(data) === 'FSType4') {
                this.point1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild));
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.parentEndPoint + (data.milestoneChild ? -1 : 0) + (data.milestoneParent ? 1 : 0);
                this.x2 = data.childLeft - data.parentEndPoint - 20;
                this.y1 = this.point1 + (data.milestoneChild ? 1 : 0) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.point1 + heightValue + this.taskLineValue + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2 + 11) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x2) + " " + this.y2 +
                    " L " + this.x1 + " " + this.y2;
                this.arrowPath = "M " + (this.x1 + this.x2 + 18) + " " + (this.y1 + this.manualChild) +
                    " L " + (this.x1 + this.x2 + 11) + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + this.x2 + 11) + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";

            }

            if (this.getParentPosition(data) === 'SSType4') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.point1 = heightValue + this.taskLineValue;
                this.point2 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild));
                this.x1 = data.parentLeft - 8;
                this.x2 = data.childLeft - data.parentLeft;
                this.y1 = this.point2 + (data.milestoneChild ? 1 : 0) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.y1 + this.point1 + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) +
                    " L " + this.x1 + " " + this.y2 + " L " + (this.x1 + 10) + " " + this.y2;
                this.arrowPath = "M " + (this.x1 + this.x2 + 8) + " " + (this.y1 + this.manualChild) +
                    " L " + (this.x1 + this.x2) + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + this.x2) + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SSType3') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue;
                this.x1 = data.childLeft - 20;
                this.y1 = (data.milestoneChild ? 1 : 0) + ((this.parent.enableVirtualization ? rowPositionHeight : (!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild))) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.x2 = data.parentLeft - data.childLeft + 21;
                this.y2 = this.y1 + this.point1 + (this.parent.renderBaseline ? (data.milestoneChild ? -11 : data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + 12) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) +
                    " L " + this.x1 + " " + this.y2 + " L " + (this.x1 + this.x2) + " " + this.y2;
                this.arrowPath = "M " + (this.x1 + 20) + " " + (this.y1 + this.manualChild) +
                    " L " + (this.x1 + 12) + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 12) + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SSType2') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue;
                this.x1 = setInnerElementLeftSSType2;
                this.x2 = setInnerChildWidthSSType2 + 1;
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.y1 + this.point1;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + this.y2 +
                    " L " + (this.x1 + setInnerElementWidthSSType2) + " " + this.y2;
                this.arrowPath = "M " + (this.x1 + setInnerElementWidthSSType2 + 8) + " " + (this.y2 + this.manualChild) +
                    " L " + (this.x1 + setInnerElementWidthSSType2) + " " + (this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + setInnerElementWidthSSType2) + " " + (this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SSType1') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue;
                this.x1 = data.childLeft - 20;
                this.x2 = data.parentLeft - data.childLeft + 21;
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.y1 + this.point1;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + this.y2 +
                    " L " + (this.x1 + 12) + " " + this.y2;
                this.arrowPath = "M " + (this.x1 + 20) + " " + (this.y2 + this.manualChild) +
                    " L " + (this.x1 + 12) + " " + (this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 12) + " " + (this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'FFType1') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? 1 : 0);
                this.x1 = data.childEndPoint;
                this.x2 = data.parentEndPoint + (data.milestoneParent ? -1 : 0);
                this.x3 = data.milestoneParent ? 22 : 21;
                this.x4 = data.milestoneChild ? 4 : 8;
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue + this.taskLineValue;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x2 + this.x3) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x2 + this.x3) + " " + (this.y1 + this.y2) +
                    " L " + (this.x1 + this.x4) + " " + (this.y1 + this.y2);
                this.arrowPath = "M " + this.x1 + " " + (this.y1 + this.y2 + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y1 + this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y1 + this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'FFType2') {

                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? 1 : 0);
                this.x1 = data.parentEndPoint;
                this.x2 = data.childEndPoint + (data.milestoneParent ? 22 : 21);
                this.x3 = data.childEndPoint + (data.milestoneChild ? 9 : 8);
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue + this.taskLineValue;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x2 + " " + (this.y1 + this.y2) +
                    " L " + this.x3 + " " + (this.y1 + this.y2);
                this.arrowPath = "M " + (this.x3 - 8) + " " + (this.y1 + this.y2 + this.manualChild) +
                    " L " + this.x3 + " " + (this.y1 + this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + this.x3 + " " + (this.y1 + this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'FFType3') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.childEndPoint;
                this.x2 = this.x1 + (data.milestoneChild ? 4 : 8);
                this.x3 = data.parentEndPoint - data.childEndPoint + (data.milestoneChild ? 16 : 10);
                this.x4 = data.parentEndPoint + (data.milestoneParent ? - 1 : 0);
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue + this.taskLineValue + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x2 + this.x3) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x2 + this.x3) + " " + (this.y1 + this.y2) +
                    " L " + this.x4 + " " + (this.y1 + this.y2);
                this.arrowPath = "M " + this.x1 + " " + (this.y1 + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'FFType4') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.parentEndPoint;
                this.x2 = data.childEndPoint + (data.milestoneChild ? 7 : 8);
                this.x3 = this.x2 + (data.milestoneChild ? 12 : 11);
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild)) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = heightValue + this.taskLineValue + + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x3 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x3 + " " + (this.y1 + this.y2) +
                    " L " + this.x1 + " " + (this.y1 + this.y2);
                this.arrowPath = "M " + (this.x2 - 8) + " " + (this.y1 + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SFType4') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? -1 : 0);
                this.point1 = heightValue - this.getconnectorLineGap(data) + this.taskLineValue;
                this.point2 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild));
                this.x1 = data.parentLeft - 10;
                this.x2 = this.x1 + ((data.childEndPoint - data.parentLeft) + 18);
                this.x3 = this.x2 + (data.milestoneChild ? 16 : 11);
                this.y1 = this.point2 + (data.milestoneChild ? 1 : 0) + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.y1 + this.point1 + (this.parent.renderBaseline ? (data.milestoneChild ? -11 : 0) : 0);
                this.y3 = this.getconnectorLineGap(data) + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.y4 = this.y2 - (this.y2 % data.rowHeight);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x3 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x3 + " " + this.y4 + " L " + this.x1 + " " + this.y4 +
                    " L " + this.x1 + " " + (this.y2 + this.y3) + " L " + (this.x1 + 11) + " " + (this.y2 + this.y3);
                this.arrowPath = "M " + (this.x2 - 8) + " " + (this.y1 + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SFType3') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.point1 = (data.parentLeft - (data.childEndPoint + (data.milestoneParent ? 25 : 20))) + 1 + (this.parent.renderBaseline ? (data.milestoneParent ? 5 : 0) : 0);
                this.point2 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.childIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneChild));
                this.x1 = data.childEndPoint;
                this.x2 = this.x1 + (data.milestoneChild ? 9 : 8);
                this.x3 = this.x2 + (data.milestoneChild ? 17 : 11);
                this.y1 = this.point2 + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.y2 = this.y1 + heightValue + this.taskLineValue + (this.parent.renderBaseline ? (data.milestoneParent ? 10 : 0) : 0);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + this.x2 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x3 + " " + (this.y1 + this.manualParent + this.manualChild) +
                    " L " + this.x3 + " " + this.y2 + " L " + (this.x3 + this.point1) + " " + this.y2;
                this.arrowPath = "M " + (this.x2 - 8) + " " + (this.y1 + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + this.x2 + " " + (this.y1 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SFType1') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue - this.getconnectorLineGap(data) + this.taskLineValue;
                this.point2 = this.getconnectorLineGap(data);
                this.x1 = data.parentLeft - 10;
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.x2 = (data.childEndPoint - data.parentLeft) + 31;
                this.y2 = this.y1 + this.point1;
                this.x3 = (data.childEndPoint - data.parentLeft) + 18;
                this.y3 = this.y2 - (this.y2 % data.rowHeight);
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + 11) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + this.x1 + " " + this.y3 +
                    " L " + (this.x1 + this.x2) + " " + this.y3 + " L " + (this.x1 + this.x2) + " " + (this.y2 + this.point2) + " L " + (this.x1 + this.x3) + " " + (this.y2 + this.point2);
                this.arrowPath = "M " + (this.x1 + this.x3 - 8) + " " + (this.y2 + this.point2 + this.manualChild) +
                    " L " + (this.x1 + this.x3) + " " + (this.y2 + this.point2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + this.x3) + " " + (this.y2 + this.point2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }

            if (this.getParentPosition(data) === 'SFType2') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.childEndPoint;
                this.y1 = this.parent.enableVirtualization ? rowPositionHeight : ((!this.parent.allowTaskbarOverlap ? parentOverlapTopValue : (data.parentIndex * data.rowHeight)) + this.getTaskbarMidpoint(data.milestoneParent)) + + ((data.isManualParent && data.isManualChild) ? -10 : 0);
                this.x2 = (data.parentLeft - data.childEndPoint);
                this.y2 = this.y1 + heightValue + this.taskLineValue;
                this.manualParent = (data.isManualParent && !data.isManualChild ? -10 : 0);
                this.manualChild = (data.isManualChild && !data.isManualParent ? -10 : 0);

                this.connectorLinePath = "M " + (this.x1 + this.x2 + 1) + " " + (this.y1 + this.manualParent + this.manualChild) + " L " + (this.x1 + this.x2 - 10) + " " + (this.y1 + this.manualParent + this.manualChild) +
                    " L " + (this.x1 + this.x2 - 10) + " " + this.y2 + " L " + (this.x1 + 8) + " " + this.y2;
                this.arrowPath = "M " + this.x1 + " " + (this.y2 + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y2 - (4 + this.lineStroke) + this.manualChild) +
                    " L " + (this.x1 + 8) + " " + (this.y2 + 4 + this.lineStroke + this.manualChild) + " Z";
            }
            this.connectorPath.setAttribute("d", this.connectorLinePath);
            this.arrowlinePath.setAttribute("d", this.arrowPath);
        }

        return this.groupObject.outerHTML;
    }
    /**
     * @param {IConnectorLineObject} data .
     * @param {string} type .
     * @param {number} heightValue .
     * @returns {number} .
     * @private
     */
    private getPosition(data: IConnectorLineObject, type: string, heightValue: number): { top: number, height: number } {
        let topPosition: number = 0; let lineHeight: number = 0;
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            const isMilestoneParent: boolean = data.milestoneParent ? true : false;
            const isMilestone: boolean = data.milestoneChild ? true : false;
            const midPointParent: number = this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1);
            const midPoint: number = this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1);
            const isParentIndex: boolean = data.parentIndexInCurrentView !== -1;
            const isChildIndex: boolean = data.childIndexInCurrentView !== -1;
            const lastRowIndex: number = this.parent.currentViewData.length - 1;
            if (type === 'SSType1' || type === 'SSType2' || type === 'FFType1' || type === 'FFType2' || type === 'SFType2') {
                topPosition = isParentIndex ? (data.parentIndexInCurrentView * data.rowHeight) + midPointParent : 0;
                lineHeight = (isParentIndex && isChildIndex) ? heightValue : isChildIndex ?
                    (data.childIndexInCurrentView * data.rowHeight) + midPointParent : (lastRowIndex * data.rowHeight) + midPointParent;
            } else if (type === 'SSType3' || type === 'SSType4' || type === 'FSType4' || type === 'FFType3' ||
                type === 'FFType4' || type === 'SFType4' || type === 'SFType3') {
                topPosition = isChildIndex ? (data.childIndexInCurrentView * data.rowHeight) + midPoint : 0;
                lineHeight = (isParentIndex && isChildIndex) ? heightValue : isParentIndex ?
                    (data.parentIndexInCurrentView * data.rowHeight) + midPoint :
                    (lastRowIndex * data.rowHeight) + midPoint;
            } else if (type === 'FSType3') {
                topPosition = isChildIndex ? (data.childIndexInCurrentView * data.rowHeight) + midPointParent : 0;
                lineHeight = (isParentIndex && isChildIndex) ? heightValue : isParentIndex ?
                    (data.parentIndexInCurrentView * data.rowHeight) + midPoint :
                    (lastRowIndex * data.rowHeight) + midPointParent;
            } else if (type === 'SFType1' || type === 'FSType1' || type === 'FSType2') {
                topPosition = isParentIndex ? (data.parentIndexInCurrentView * data.rowHeight) + midPoint : 0;
                lineHeight = (isParentIndex && isChildIndex) ? heightValue : isChildIndex ?
                    (data.childIndexInCurrentView * data.rowHeight) + midPoint :
                    (lastRowIndex * data.rowHeight) + midPoint;
            }
        }
        return { top: topPosition, height: lineHeight };
    }
    /**
     * @returns {void} .
     * @private
     */
    public createConnectorLineTooltipTable(): void {
        this.tooltipTable = createElement(
            'table', { className: '.e-tooltiptable', styles: 'margin-top:0px', attrs: { 'cellspacing': '2px', 'cellpadding': '2px' } });
        const tooltipBody: HTMLElement = createElement('tbody');
        tooltipBody.innerHTML = '';
        this.tooltipTable.appendChild(tooltipBody);
    }
    /**
     * @param {string} fromTaskName .
     * @param {string} fromPredecessorText .
     * @param {string} toTaskName .
     * @param {string} toPredecessorText .
     * @returns {string} .
     * @private
     */
    public getConnectorLineTooltipInnerTd(
        fromTaskName: string, fromPredecessorText: string, toTaskName?: string, toPredecessorText?: string): string {
        let innerTd: string = '<tr  id="fromPredecessor"><td style="padding: 4px;">' + this.parent.localeObj.getConstant('from') + '</td><td> ';
        innerTd = innerTd + fromTaskName + ' </td><td style="padding: 2px;"> ' + this.parent.localeObj.getConstant(fromPredecessorText) + ' </td> </tr>';
        innerTd = innerTd + '<tr id="toPredecessor"><td style="padding: 4px;">' + this.parent.localeObj.getConstant('to') + '</td><td> ' + toTaskName;
        innerTd = innerTd + ' </td><td style="padding: 2px;"> ' + this.parent.localeObj.getConstant(toPredecessorText) + ' </td></tr></tbody><table>';
        return innerTd;
    }
    /**
     * Generate aria-label for connectorline
     *
     * @param {IConnectorLineObject} data .
     * @returns {string} .
     * @private
     */
    public generateAriaLabel(data: IConnectorLineObject): string {
        const type: string = data.type;
        const updatedRecords: IGanttData[] = this.expandedRecords;
        const fromName: string = updatedRecords[data.parentIndex].ganttProperties.taskName;
        const toName: string = updatedRecords[data.childIndex].ganttProperties.taskName;
        const start: string = this.parent.localeObj.getConstant('start');
        const finish: string = this.parent.localeObj.getConstant('finish');
        let value: string = '';
        if (type === 'FS') {
            value = fromName + ' ' + finish + ' to ' + toName + ' ' + start;
        } else if (type === 'FF') {
            value = fromName + ' ' + finish + ' to ' + toName + ' ' + finish;
        } else if (type === 'SS') {
            value = fromName + ' ' + start + ' to ' + toName + ' ' + start;
        } else {
            value = fromName + ' ' + start + ' to ' + toName + ' ' + finish;
        }
        return value;
    }
    /**
     * To get the record based on the predecessor value
     *
     * @param {string} id .
     * @returns {IGanttData} .
     * @private
     */
    public getRecordByID(id: string): IGanttData {
        if (isNullOrUndefined(id)) {
            return null;
        }
        return this.parent.viewType === 'ResourceView' ? this.parent.flatData[this.parent.getTaskIds().indexOf('T' + id.toString())] :
            this.parent.flatData[this.parent.ids.indexOf(id.toString())];
    }
    /**
     * Method to remove connector line from DOM
     *
     * @param {IGanttData[] | object} records .
     * @returns {void} .
     * @private
     */
    public removePreviousConnectorLines(records: IGanttData[] | object): void {
        let isObjectType: boolean;
        if (isObject(records) === true) {
            isObjectType = true;
        } else {
            isObjectType = false;
        }
        const length: number = isObjectType ? Object.keys(records).length : (records as IGanttData[]).length;
        const keys: string[] = Object.keys(records);
        for (let i: number = 0; i < length; i++) {
            let data: IGanttData;
            if (isObjectType) {
                const uniqueId: string = keys[i as number];
                data = records[uniqueId as string] as IGanttData;
            } else {
                data = records[i as number];
            }

            const predecessors: IPredecessor[] = data.ganttProperties && data.ganttProperties.predecessor;
            if (predecessors && predecessors.length > 0) {
                for (let pre: number = 0; pre < predecessors.length; pre++) {
                    const lineId: string = 'parent' + predecessors[pre as number].from + 'child' + predecessors[pre as number].to;
                    this.removeConnectorLineById(lineId as string);
                }
            }
        }
    }
    /**
     * @param {string} id .
     * @returns {void} .
     * @private
     */
    public removeConnectorLineById(id: string): void {
        const element: Element = this.parent.connectorLineModule.dependencyViewContainer.querySelector('#ConnectorLine' + id);
        if (!isNullOrUndefined(element)) {
            remove(element);
        }
    }

}
