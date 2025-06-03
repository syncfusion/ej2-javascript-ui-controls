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
    private taskLineValue: number = 0;
    private x1: number;
    private x2: number;
    private x3: number;
    private x4: number;
    private y1: number;
    private y2: number;
    private y3: number;
    private y4: number;
    private point1: number;
    private point2: number;
    private parent: Gantt;
    public dependencyViewContainer: HTMLElement;
    private lineColor: string;
    private lineStroke: number;
    public tooltipTable: HTMLElement;
    public renderer: SvgRenderer;
    private connectorId: string;
    private parentRowIndexHeight: number;
    private childRowIndexHeight: number;
    private lastRowIndexHeight: number;
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
            createElement('div', {
                className: cls.dependencyViewContainer
            });
        Object.assign(this.dependencyViewContainer.style, {
            width: '100%',
            height: '100%',
            zIndex: 2,
            position: 'absolute',
            pointerEvents: 'none'
        });
        this.renderer = new SvgRenderer(this.parent.element.id);
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
            (this.parent.chartRowsModule.milestoneMarginTop + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            (this.parent.chartRowsModule.taskBarMarginTop + (this.parent.chartRowsModule.taskBarHeight / 2))) + 1;
    }

    /**
     * To connector line object collection.
     *
     * @param {IGanttData} parentGanttData .
     * @param {IGanttData} childGanttData .
     * @param {IPredecessor}  predecessor .
     * @param {number} rowHeight .
     * @returns {void}
     * @private
     */
    public createConnectorLineObject(parentGanttData: IGanttData, childGanttData: IGanttData, predecessor: IPredecessor,
                                     rowHeight: number = 0):
        IConnectorLineObject {
        const connectorObj: IConnectorLineObject = {} as IConnectorLineObject;
        let updatedRecords: IGanttData[];
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
                this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) {
            updatedRecords = this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData'];
        }
        else {
            updatedRecords = this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport ?
                this.parent.flatData : this.expandedRecords;
        }
        let parentIndex: number;
        let childIndex: number;
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
                this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) {
            const parentData: IGanttData = this.parent.flatData.filter((data: IGanttData) => {
                return data.ganttProperties.taskId.toString() === parentGanttData.ganttProperties.taskId.toString();
            })[0];
            const childData: IGanttData = this.parent.flatData.filter((data: IGanttData) => {
                return data.ganttProperties.taskId.toString() === childGanttData.ganttProperties.taskId.toString();
            })[0];
            parentIndex = parentData.index;
            childIndex = childData.index;
        } else {
            parentIndex = updatedRecords.indexOf(parentGanttData);
            childIndex = updatedRecords.indexOf(childGanttData);
        }
        const parentGanttRecord: ITaskData = parentGanttData.ganttProperties;
        const childGanttRecord: ITaskData = childGanttData.ganttProperties;
        let currentData: IGanttData[];
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
                this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) {
            currentData = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
                this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData'] : this.parent.getExpandedRecords(this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData']);
        }
        else {
            currentData = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
                this.parent.currentViewData : this.parent.expandedRecords;
        }
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
            if (rowHeight === 0){
                const chartRows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
                connectorObj.rowHeight = !isNullOrUndefined(chartRows) && chartRows[0] && (chartRows[0] as HTMLElement).offsetHeight;
            }
            else
            {
                connectorObj.rowHeight = rowHeight;
            }
            connectorObj.type = predecessor.type;
            const parentId: string = this.parent.viewType === 'ResourceView' ? parentGanttRecord.taskId : parentGanttRecord.rowUniqueID;
            const childId: string = this.parent.viewType === 'ResourceView' ? childGanttRecord.taskId : childGanttRecord.rowUniqueID;
            connectorObj.connectorLineId = 'parent' + parentId + 'child' + childId;
            connectorObj.milestoneParent = parentGanttRecord.isMilestone ? true : false;
            connectorObj.milestoneChild = childGanttRecord.isMilestone ? true : false;
            connectorObj.parentEndPoint = connectorObj.parentLeft + connectorObj.parentWidth;
            connectorObj.childEndPoint = connectorObj.childLeft + connectorObj.childWidth;
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
        let connectorLine: Element;
        const ariaConnector: IConnectorLineObject[] = [];
        this.svgObject.innerHTML = '';
        for (let index: number = 0; index < connectorLinesCollection.length; index++) {
            connectorLine = this.getConnectorLineTemplate(connectorLinesCollection[index as number]);
            this.svgObject.appendChild(connectorLine);
            ariaConnector.push(connectorLinesCollection[index as number]);
        }
        const childNodes: NodeList = this.parent.connectorLineModule.svgObject.childNodes;
        for (let i: number = 0; i < childNodes.length; i++) {
            const innerChild: NodeList = childNodes[i as number].childNodes;
            for (let j: number = 0; j < innerChild.length; j++) {
                const ariaString: string = 'Connector Line ' + this.parent.connectorLineModule.generateAriaLabel(ariaConnector[i as number]);
                (<HTMLElement>innerChild[j as number]).setAttribute('aria-label', ariaString);
                (<HTMLElement>innerChild[j as number]).setAttribute('role', 'img');
            }
        }
        this.parent.ganttChartModule.chartBodyContent.insertBefore(this.dependencyViewContainer,
                                                                   this.parent.ganttChartModule.chartBodyContent.lastChild);
        this.dependencyViewContainer.appendChild(this.svgObject);
        for (let i: number = 0; i < this.svgObject.children.length; i++) {
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
                }
                if (data.type === 'FS') {
                    return 'FSType2';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'SF') {
                    return 'SFType1';
                }
            } else if ((data.parentLeft) < data.childLeft) {

                if (data.type === 'FS') {
                    return 'FSType2';
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
                if (((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth))) {
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
    private getHeightValue(): number {
        if (this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
            return (this.parentRowIndexHeight) > (this.childRowIndexHeight) ?
                ((this.parentRowIndexHeight) - (this.childRowIndexHeight)) :
                ((this.childRowIndexHeight) - (this.parentRowIndexHeight));
        }
        else {
            return (this.parentRowIndexHeight) > (this.childRowIndexHeight) ?
                ((this.parentRowIndexHeight) - (this.childRowIndexHeight)) :
                ((this.childRowIndexHeight) - (this.parentRowIndexHeight));
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

    // private getBorderStyles(cssType: string, unit: number): string {
    //     const borderWidth: string = 'border-' + cssType + '-width:' + unit + 'px;';
    //     const borderStyle: string = 'border-' + cssType + '-style:solid;';
    //     const borderColor: string = !isNullOrUndefined(this.lineColor) ? 'border-' + cssType + '-color:' + this.lineColor + ';' : '';
    //     return (borderWidth + borderStyle + borderColor);
    // }
    private calculateAdjustments(rowHeight: number, isMilestone: boolean, type: string): Object {
        const taskbarHeightValue: number = this.parent.renderBaseline ? 0.45 : ((!isNullOrUndefined(document.body.className) && document.body.className.includes('e-bigger')) ? 0.7 : 0.62);
        const defaultTaskbarHeight: number = Math.floor(this.parent.rowHeight * taskbarHeightValue);
        if (((isNullOrUndefined(this.parent.taskbarHeight) && rowHeight <= 36) || (!isNullOrUndefined(this.parent.taskbarHeight) &&
            this.parent.taskbarHeight <= defaultTaskbarHeight)) || !isMilestone) {
            return {
                adjustY1: 0,  // Corresponds to +1
                adjustX: 0,   // Corresponds to -6
                adjustY2: 0,   // Corresponds to +1
                adjustZ: 0
            };
        } else {
            // Calculate adjustments dynamically for rowHeight greater than 36
            const divisorY1: number = ((type === 'FSType2' || type === 'FSType3' || type === 'FSType4' || type === 'SSType1' || type === 'SSType2' || type === 'SSType4' || type === 'SFType2')) ? 12 : 24;
            const adjustY1: number = (rowHeight - 36) / divisorY1;
            const adjustX: number = -(rowHeight - 36) / 4;
            const adjustZ: number = -2 * (rowHeight - 36) / 24;
            if (rowHeight <= 36) {
                return {
                    adjustY1: 0,
                    adjustX: 0,
                    adjustY2: 0,
                    adjustZ: 0
                };
            }
            return {
                adjustY1: adjustY1,
                adjustX: adjustX,
                adjustZ: adjustZ
            };
        }
    }

    private shouldAdjustForBaseline(data: any, type: string): number {
        if (!this.parent.renderBaseline || !(data.milestoneParent || data.milestoneChild) ||
            (data.milestoneParent && data.milestoneChild)) {
            return 0;
        }
        switch (type) {
        case 'FSType1':
        case 'FSType2':
            if (data.milestoneParent) {
                return -this.parent.chartRowsModule.milestoneMarginTop / 2;
            }
            else {
                return this.parent.chartRowsModule.taskBarMarginTop;
            }
        case 'FSType3':
        case 'FFType2':
        case 'SFType2':
        case 'SSType2':
            if (data.milestoneParent) {
                return this.parent.chartRowsModule.milestoneMarginTop / 2;
            }
            else {
                return -this.parent.chartRowsModule.taskBarMarginTop;
            }
        case 'FSType4':
        case 'FFType3':
        case 'SFType4':
        case 'FFType4':
        case 'SFType3':
        case 'SFType1':
            if (data.milestoneParent) {
                return -this.parent.chartRowsModule.milestoneMarginTop / 2;
            }
            else {
                return this.parent.chartRowsModule.taskBarMarginTop;
            }
        case 'SSType3':
        case 'SSType4':
            if (data.milestoneParent) {
                return -this.parent.chartRowsModule.taskBarMarginTop;
            }
            else {
                return this.parent.chartRowsModule.taskBarMarginTop;
            }
        case 'SSType1':
        case 'FFType1':
            if (data.milestoneParent) {
                return this.parent.chartRowsModule.taskBarMarginTop;
            }
            else {
                return -this.parent.chartRowsModule.milestoneMarginTop / 2;
            }
        default:
            return 0;
        }
    }

    // Method to fetch the row element height from top row to the parent row index, child row index , last row index
    private updateParentChildRowsHeight(data: IConnectorLineObject): void {
        const lastRowIndex: number = this.parent.currentViewData.length - 1;
        const rowElements: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
        this.parentRowIndexHeight =  data.parentIndexInCurrentView * data.rowHeight;
        this.childRowIndexHeight =  data.childIndexInCurrentView * data.rowHeight;
        this.lastRowIndexHeight = lastRowIndex * data.rowHeight;
        let totalDisplayedRows: number = 0;
        if (!this.parent.allowTaskbarOverlap && this.parent.enableMultiTaskbar) {
            this.parentRowIndexHeight = this.childRowIndexHeight = this.lastRowIndexHeight = 0;
            for (let i: number = 0; i < lastRowIndex; i++) {
                const rowElement: HTMLElement = rowElements[i as number] as HTMLElement;
                if (rowElement && rowElement.style.display !== 'none') {
                    if (totalDisplayedRows < data.parentIndexInCurrentView) {
                        this.parentRowIndexHeight += rowElements[i as number]['offsetHeight'];
                    }
                    if (totalDisplayedRows < data.childIndexInCurrentView) {
                        this.childRowIndexHeight += rowElements[i as number]['offsetHeight'];
                    }
                    this.lastRowIndexHeight += rowElements[i as number]['offsetHeight'];
                    totalDisplayedRows++;
                }
            }
        }
    }

    /**
     * To get connector line template.
     *
     * @param {IConnectorLineObject} data .
     * @returns {void}
     * @private
     */
    public getConnectorLineTemplate(data: IConnectorLineObject): Element {
        const setInnerChildWidthSSType2: number = this.getInnerChildWidthSSType2(data);
        const setInnerElementWidthSSType2: number = this.getInnerElementWidthSSType2(data);
        const setInnerElementLeftSSType2: number = this.getInnerElementLeftSSType2(data);
        this.updateParentChildRowsHeight(data);
        const height: number = this.getHeightValue();
        const isMilestone: boolean = data.milestoneChild ? true : false;
        const connectorLine: { top: number, height: number } = this.getPosition(data, this.getParentPosition(data), height);
        const rowPosition: { top: number, height: number } = this.getPosition(data, this.getParentPosition(data), height);
        let rowPositionHeight: number = rowPosition.top;
        let isMilestoneValue: number = 0;
        if (this.parent.renderBaseline) {
            const modifiedValue: number = (this.parent.rowHeight / 36) * 5;
            isMilestoneValue = (data.milestoneParent && data.milestoneChild) ? 0 : data.milestoneParent ? -modifiedValue :
                data.milestoneChild ? modifiedValue : 0;
        }
        const heightValue: number = connectorLine.height;
        let borderTopWidth: number = 0;
        let addTop: number = 0;
        let parentOverlapTopValue: number = 0;
        let childOverlapTopValue: number = 0;
        let count: number = 0;
        if (this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                if (this.parent.getRowByIndex(i as number).style.display !== 'none') {
                    if (count < data.parentIndex) {
                        count++;
                        parentOverlapTopValue = parentOverlapTopValue + this.parent.getRowByIndex(i as number).offsetHeight;
                    }
                }
            }
            count = 0;
            for (let j: number = 0; j < this.parent.currentViewData.length; j++) {
                if (this.parent.getRowByIndex(j as number).style.display !== 'none') {
                    if (count < data.childIndex) {
                        count++;
                        childOverlapTopValue = childOverlapTopValue + this.parent.getRowByIndex(j as number).offsetHeight;
                    }
                }
            }
        }
        if (this.parent.currentViewData[data.parentIndex] && this.parent.currentViewData[data.childIndex] &&
            this.parent.allowParentDependency) {
            const fromRecordIsParent: boolean = this.parent.currentViewData[data.parentIndex].hasChildRecords;
            const toRecordIsParent: boolean = this.parent.currentViewData[data.childIndex].hasChildRecords;
            const fromRecordIsManual: boolean = this.parent.currentViewData[data.parentIndex].ganttProperties.isAutoSchedule;
            const toRecordIsManual: boolean = this.parent.currentViewData[data.childIndex].ganttProperties.isAutoSchedule;
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
                        addTop = -11;
                        borderTopWidth = 12;
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
                    else if (data.parentIndex < data.childIndex) {
                        if (data.type === 'SS' || data.type === 'FF') {
                            addTop = -10;
                        }
                    }
                }
                else {
                    if (data.parentIndex < data.childIndex && fromRecordIsManual && !toRecordIsManual) {
                        addTop = 0;
                        borderTopWidth = -11;
                    }
                    else if (data.childIndex < data.parentIndex && !fromRecordIsManual && toRecordIsManual) {
                        addTop = 0;
                        borderTopWidth = -11;
                    }
                }
                rowPositionHeight += addTop;
            }
        }
        const predType: string = this.getParentPosition(data);
        if (predType) {
            // Create the group element
            const type: string = this.getParentPosition(data);
            const rowHeight1: number = this.parent.rowHeight;
            const adjustments: Object = this.calculateAdjustments(rowHeight1, isMilestone, type);
            this.transform = this.parent.enableRtl ? `translate(${(this.parent.enableTimelineVirtualization ? this.parent.timelineModule.wholeTimelineWidth : this.parent.timelineModule.totalTimelineWidth)}, 0) scale(-1, 1)` : '';
            this.connectorId = 'ConnectorLine' + data.connectorLineId;
            this.groupObject = this.renderer.createGroup({
                id: this.connectorId,
                transform: this.transform,
                style: 'pointer-events: stroke',
                class: cls.connectorLineContainer
            });
            //  Create the path element for the connector line
            this.connectorPath = this.renderer.drawPath({
                class: cls.connectorLineSVG,
                d: this.connectorLinePath,
                fill: 'transparent',
                'stroke-width': this.lineStroke
            });
            // Create the path element for the arrow
            this.arrowlinePath = this.renderer.drawPath({
                d: this.arrowPath,
                class: cls.connectorLineArrow
            });
            const outlineColor: string = (this.lineColor) && !(this.parent.enableCriticalPath) ? this.lineColor : '';
            (this.connectorPath as HTMLElement).style.stroke = outlineColor;
            (this.arrowlinePath as HTMLElement).style.fill = outlineColor;
            // Append the path element to the group element
            this.groupObject.appendChild(this.connectorPath);
            this.groupObject.appendChild(this.arrowlinePath);
            const adjustedValue: number = this.shouldAdjustForBaseline(data, predType);
            if (predType === 'FSType1') {
                this.taskLineValue = data.milestoneChild ? 1 : 0;
                this.x1 = data.parentEndPoint + (data.milestoneParent ? -1 : (data.milestoneChild ? -1 : 0));
                this.x2 = data.milestoneParent ?
                    ((((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10) + 1) :
                    (((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10);
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke;
                this.connectorLinePath = 'M ' + this.x1 + ' ' + (this.y1 - adjustedValue) + ' L ' + ((this.x1 + this.x2) + adjustments['adjustZ']) + ' ' + (this.y1 - adjustedValue) + ' L ' + ((this.x1 + this.x2) + adjustments['adjustZ']) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x2 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1']);
                this.arrowPath = 'M ' + ((this.x1 + this.x2 + 20) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x2 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x2 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 + 4) + adjustments['adjustY1']) + ' Z';
            }
            if (predType === 'FSType2') {
                this.x1 = data.parentLeft;
                this.x2 = data.parentWidth + (data.milestoneParent ? -1 : 0);
                this.x3 = this.x2 + (data.milestoneParent ? 11 : 10);
                this.x4 = data.parentWidth - ((data.parentEndPoint - data.childLeft) + 20);
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + borderTopWidth - this.getconnectorLineGap(data) - this.lineStroke;
                this.y3 = this.getconnectorLineGap(data);
                this.y4 = (!this.parent.allowTaskbarOverlap ? childOverlapTopValue :
                    (this.y1 + this.y2 - ((this.y1 + this.y2) % data.rowHeight)));
                this.connectorLinePath = 'M ' + (this.x1 + this.x2) + ' ' + (this.y1 - adjustedValue) + ' ' + ' L ' + (this.x1 + this.x3) + ' ' + (this.y1 - adjustedValue) + ' L ' + (this.x1 + this.x3) + ' ' + this.y4 +
                    ' L ' + ((this.x1 + this.x4) + adjustments['adjustZ']) + ' ' + this.y4 + ' L ' + ((this.x1 + this.x4) + adjustments['adjustZ']) + ' ' + ((this.y1 + this.y2 + this.y3) + adjustments['adjustY1']) + ' L ' + ((this.x1 + this.x4 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 + this.y3) + adjustments['adjustY1']);
                this.arrowPath = 'M ' + ((this.x1 + this.x4 + 20) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 + this.y3) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x4 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 + this.y3 - (4 + this.lineStroke)) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x4 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + this.y2 + this.y3 + 4 + this.lineStroke) + adjustments['adjustY1']) + ' Z';
            }

            if (predType === 'FSType3') {
                this.taskLineValue = data.milestoneChild ? 1 : 0;
                this.point1 = rowPositionHeight;
                this.x1 = (data.childLeft + (data.milestoneChild ? -1 : 0) + (data.milestoneParent ? 1 : 0)) - 20;
                this.x2 = (data.parentEndPoint - data.childLeft) + 30;
                this.y1 = this.point1;
                this.y2 = this.point1 + heightValue + borderTopWidth - this.getconnectorLineGap(data) - this.lineStroke +
                    this.taskLineValue;
                this.y3 = this.getconnectorLineGap(data);
                this.y4 = this.y2 - (this.y2 % data.rowHeight);
                this.connectorLinePath = 'M ' + (this.x1 + 12) + ' ' + ((this.y1 - adjustedValue) + adjustments['adjustY1']) + ' L ' + this.x1 + ' ' + ((this.y1 - adjustedValue) + adjustments['adjustY1']) + ' L ' + this.x1 + ' ' + this.y4 +
                    ' L ' + (this.x1 + this.x2) + ' ' + this.y4 + ' L ' + (this.x1 + this.x2) + ' ' + (this.y2 + this.y3) + ' L ' + (this.x1 + this.x2 - 12) + ' ' + (this.y2 + this.y3);
                this.arrowPath = 'M ' + ((this.x1 + 20) + adjustments['adjustX']) + ' ' + ((this.y1 - adjustedValue) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 - (4 + this.lineStroke) - adjustedValue) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + 4 + this.lineStroke - adjustedValue) + adjustments['adjustY1']) + ' Z';
            }

            if (predType === 'FSType4') {
                this.point1 = rowPositionHeight;
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.parentEndPoint + (data.milestoneChild ? -1 : 0) + (data.milestoneParent ? 1 : 0);
                this.x2 = data.childLeft - data.parentEndPoint - 20;
                this.y1 = this.point1 + (data.milestoneChild ? -1 : 0);
                this.y2 = this.point1 + heightValue + borderTopWidth - this.lineStroke + 1 + this.taskLineValue;
                this.connectorLinePath = 'M ' + (this.x1 + this.x2 + 12) + ' ' + ((this.y1) + adjustments['adjustY1']) + ' L ' + (this.x1 + this.x2) + ' ' + ((this.y1) + adjustments['adjustY1']) + ' L ' + (this.x1 + this.x2) + ' ' + (this.y2 - adjustedValue) +
                    ' L ' + this.x1 + ' ' + (this.y2 - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1 + this.x2 + 20) + adjustments['adjustX']) + ' ' + ((this.y1) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x2 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 - (4 + this.lineStroke)) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x2 + 12) + adjustments['adjustX']) + ' ' + ((this.y1 + 4 + this.lineStroke) + adjustments['adjustY1']) + ' Z';
            }

            if (predType === 'SSType4') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 2 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.point1 = heightValue + this.taskLineValue + borderTopWidth;
                this.x1 = data.parentLeft - 10;
                this.x2 = data.childLeft - data.parentLeft;
                this.y1 = rowPositionHeight;
                this.y2 = this.y1 + this.point1;
                this.connectorLinePath = 'M ' + ((this.x1 + this.x2) + adjustedX) + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y1) +
                    ' L ' + this.x1 + ' ' + (this.y2 - adjustedValue) + ' L ' + (this.x1 + 10) + ' ' + (this.y2 - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1 + this.x2 + 8) + adjustedX) + ' ' + (this.y1) +
                    ' L ' + ((this.x1 + this.x2) + adjustedX) + ' ' + (this.y1 - (4 + this.lineStroke)) +
                    ' L ' + ((this.x1 + this.x2) + adjustedX) + ' ' + (this.y1 + 4 + this.lineStroke) + ' Z';
            }

            if (predType === 'SSType3') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue + borderTopWidth - (this.lineStroke - 1);
                this.x1 = data.childLeft - 20;
                this.y1 = rowPositionHeight;
                this.x2 = data.parentLeft - data.childLeft + 21;
                this.y2 = this.y1 + this.point1;
                this.connectorLinePath = 'M ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y1) +
                    ' L ' + this.x1 + ' ' + (this.y2 - adjustedValue) + ' L ' + (this.x1 + this.x2) + ' ' + (this.y2 - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1 + 20) + adjustments['adjustX']) + ' ' + (this.y1) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + (this.y1 - (4 + this.lineStroke)) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + (this.y1 + 4 + this.lineStroke) + ' Z';
            }

            if (predType === 'SSType2') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 2 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke;
                this.x1 = setInnerElementLeftSSType2;
                this.x2 = setInnerChildWidthSSType2 + 1;
                this.y1 = rowPositionHeight;
                this.y2 = this.y1 + this.point1;
                this.connectorLinePath = 'M ' + (this.x1 + this.x2) + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + setInnerElementWidthSSType2) + adjustedX) + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1 + setInnerElementWidthSSType2 + 8) + adjustedX) + ' ' + ((this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + setInnerElementWidthSSType2) + adjustedX) + ' ' + ((this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + setInnerElementWidthSSType2) + adjustedX) + ' ' + ((this.y2 + 4 + this.lineStroke) + adjustments['adjustY1'] - adjustedValue) + ' Z';
            }

            if (predType === 'SSType1') {
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke;
                this.x1 = data.childLeft - 20;
                this.x2 = data.parentLeft - data.childLeft + 21;
                this.y1 = rowPositionHeight;
                this.y2 = this.y1 + this.point1;
                this.connectorLinePath = 'M ' + (this.x1 + this.x2) + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y1) + ' L ' + this.x1 + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1 + 20) + adjustments['adjustX']) + ' ' + ((this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + ((this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 12) + adjustments['adjustX']) + ' ' + ((this.y2 + 4 + this.lineStroke) + adjustments['adjustY1'] - adjustedValue) + ' Z';
            }

            if (predType === 'FFType1') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? 1 : 0);
                this.x1 = data.childEndPoint;
                this.x2 = data.parentEndPoint + (data.milestoneParent ? -1 : 0);
                this.x3 = data.milestoneParent ? 22 : 21;
                this.x4 = data.milestoneChild ? 4 : 8;
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke + 1;
                this.connectorLinePath = 'M ' + this.x2 + ' ' + (this.y1) + ' L ' + (this.x2 + this.x3) + ' ' + (this.y1) + ' L ' + (this.x2 + this.x3) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + (this.x1 + this.x4) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue);
                this.arrowPath = 'M ' + ((this.x1) + adjustedX) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + ((this.y1 + this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + ((this.y1 + this.y2 + 4 + this.lineStroke) + adjustments['adjustY1'] - adjustedValue) + ' Z';
            }

            if (predType === 'FFType2') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? 1 : 0);
                this.x1 = data.parentEndPoint;
                this.x2 = data.childEndPoint + (data.milestoneParent ? 22 : 21);
                this.x3 = data.childEndPoint + (data.milestoneChild ? 9 : 8);
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke + 1;
                const arrowX: number = this.parent.renderBaseline ? 0 : adjustedX;
                this.connectorLinePath = 'M ' + this.x1 + ' ' + (this.y1) + ' L ' + this.x2 + ' ' + (this.y1) + ' L ' + this.x2 + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + this.x3 + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue);
                this.arrowPath = 'M ' + ((this.x3 - 8) + arrowX) + ' ' + ((this.y1 + this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + (this.x3 + arrowX) + ' ' + ((this.y1 + this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + (this.x3 + arrowX) + ' ' + ((this.y1 + this.y2 + 4 + this.lineStroke) + adjustments['adjustY1'] - adjustedValue) + ' Z';
            }

            if (predType === 'FFType3') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.childEndPoint;
                this.x2 = this.x1 + (data.milestoneChild ? 4 : 8);
                this.x3 = data.parentEndPoint - data.childEndPoint + (data.milestoneChild ? 16 : 10);
                this.x4 = data.parentEndPoint + (data.milestoneParent ? - 1 : 0);
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke + 1;
                this.connectorLinePath = 'M ' + this.x2 + ' ' + (this.y1) + ' L ' + (this.x2 + this.x3) + ' ' + (this.y1) + ' L ' + (this.x2 + this.x3) + ' ' + (this.y1 + this.y2 - adjustedValue) +
                    ' L ' + this.x4 + ' ' + (this.y1 + this.y2 - adjustedValue);
                this.arrowPath = 'M ' + (this.x1 + adjustedX) + ' ' + (this.y1) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + (this.y1 - (4 + this.lineStroke)) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + (this.y1 + 4 + this.lineStroke) + ' Z';
            }
            if (predType === 'FFType4') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.parentEndPoint;
                this.x2 = data.childEndPoint + (data.milestoneChild ? 7 : 8);
                this.x3 = this.x2 + (data.milestoneChild ? 12 : 11);
                this.y1 = rowPositionHeight;
                this.y2 = heightValue + this.taskLineValue + borderTopWidth - this.lineStroke + 1;
                const arrowX: number = this.parent.renderBaseline ? 0 : adjustedX;
                this.connectorLinePath = 'M ' + this.x2 + ' ' + (this.y1) + ' L ' + this.x3 + ' ' + (this.y1) + ' L ' + this.x3 + ' ' + (this.y1 + this.y2 - adjustedValue) +
                    ' L ' + this.x1 + ' ' + (this.y1 + this.y2 - adjustedValue);
                this.arrowPath = 'M ' + ((this.x2 - 8) + arrowX) + ' ' + (this.y1) +
                    ' L ' + (this.x2 + arrowX) + ' ' + (this.y1 - (4 + this.lineStroke)) +
                    ' L ' + (this.x2 + arrowX) + ' ' + (this.y1 + 4 + this.lineStroke) + ' Z';
            }
            if (predType === 'SFType4') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : (data.milestoneChild ? -1 : 0);
                this.point1 = (this.taskLineValue + heightValue + borderTopWidth - this.getconnectorLineGap(data) - (this.lineStroke - 1));
                this.point2 = rowPositionHeight;
                this.x1 = data.parentLeft - 10;
                this.x2 = this.x1 + ((data.childEndPoint - data.parentLeft) + 18);
                this.x3 = this.x2 + (data.milestoneChild ? 16 : 11);
                this.y1 = this.point2;
                this.y2 = this.y1 + this.point1;
                this.y3 = this.getconnectorLineGap(data);
                this.y4 = this.y2 - (this.y2 % data.rowHeight);
                const arrowX: number = this.parent.renderBaseline ? 0 : adjustedX;
                this.connectorLinePath = 'M ' + this.x2 + ' ' + ((this.y1) - adjustments['adjustY1']) + ' L ' + this.x3 + ' ' + ((this.y1) - adjustments['adjustY1']) + ' L ' + this.x3 + ' ' + this.y4 + ' L ' + this.x1 + ' ' + this.y4 +
                    ' L ' + this.x1 + ' ' + ((this.y2 + this.y3) - adjustedValue) + ' L ' + (this.x1 + 11) + ' ' + ((this.y2 + this.y3) - adjustedValue);
                this.arrowPath = 'M ' + ((this.x2 - 8) + arrowX) + ' ' + ((this.y1) - adjustments['adjustY1']) +
                    ' L ' + (this.x2 + arrowX) + ' ' + ((this.y1 - (4 + this.lineStroke)) - adjustments['adjustY1']) +
                    ' L ' + (this.x2 + arrowX) + ' ' + ((this.y1 + 4 + this.lineStroke) - adjustments['adjustY1']) + ' Z';
            }
            if (predType === 'SFType3') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.point1 = (data.parentLeft - (data.childEndPoint + (data.milestoneParent ? 23 : 20))) + 1;
                this.point2 = rowPositionHeight;
                this.x1 = data.childEndPoint;
                this.x2 = this.x1 + (data.milestoneChild ? 9 : 8);
                this.x3 = this.x2 + (data.milestoneChild ? 17 : 11);
                this.y1 = this.point2;
                this.y2 = this.y1 + heightValue + borderTopWidth - (this.lineStroke - 1) + this.taskLineValue;
                this.connectorLinePath = 'M ' + this.x2 + ' ' + (this.y1) + ' L ' + this.x3 + ' ' + (this.y1) +
                    ' L ' + this.x3 + ' ' + (this.y2 - adjustedValue) + ' L ' + (this.x3 + this.point1) + ' ' + (this.y2 - adjustedValue);
                this.arrowPath = 'M ' + ((this.x2 - 8) + adjustedX) + ' ' + (this.y1) +
                    ' L ' + (this.x2 + adjustedX) + ' ' + (this.y1 - (4 + this.lineStroke)) +
                    ' L ' + (this.x2 + adjustedX) + ' ' + (this.y1 + 4 + this.lineStroke) + ' Z';
            }
            if (predType === 'SFType1') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : data.milestoneChild ? 1 : 0;
                this.point1 = heightValue + borderTopWidth - this.getconnectorLineGap(data) + this.taskLineValue - this.lineStroke;
                this.point2 = this.getconnectorLineGap(data);
                this.x1 = data.parentLeft - 10;
                this.y1 = rowPositionHeight;
                this.x2 = (data.childEndPoint - data.parentLeft) + 31;
                this.y2 = this.y1 + this.point1;
                this.x3 = (data.childEndPoint - data.parentLeft) + 18;
                this.y3 = this.y2 - (this.y2 % data.rowHeight);
                const arrowX: number = this.parent.renderBaseline ? 0 : adjustedX;
                this.connectorLinePath = 'M ' + (this.x1 + 11) + ' ' + (this.y1 - adjustedValue) + ' L ' + this.x1 + ' ' + (this.y1 - adjustedValue) + ' L ' + this.x1 + ' ' + this.y3 +
                    ' L ' + (this.x1 + this.x2) + ' ' + this.y3 + ' L ' + (this.x1 + this.x2) + ' ' + ((this.y2 + this.point2) + adjustments['adjustY1']) + ' L ' + (this.x1 + this.x3) + ' ' + ((this.y2 + this.point2) + adjustments['adjustY1']);
                this.arrowPath = 'M ' + ((this.x1 + this.x3 - 8) + arrowX) + ' ' + ((this.y2 + this.point2) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x3) + arrowX) + ' ' + ((this.y2 + this.point2 - (4 + this.lineStroke)) + adjustments['adjustY1']) +
                    ' L ' + ((this.x1 + this.x3) + arrowX) + ' ' + ((this.y2 + this.point2 + 4 + this.lineStroke) + adjustments['adjustY1']) + ' Z';
            }
            if (predType === 'SFType2') {
                const adjustedX: number = adjustments['adjustX'] !== 0 ? adjustments['adjustX'] + 11 : adjustments['adjustX'];
                this.taskLineValue = this.parent.renderBaseline ? this.taskLineValue : 0;
                this.x1 = data.childEndPoint;
                this.y1 = rowPositionHeight;
                this.x2 = (data.parentLeft - data.childEndPoint);
                this.y2 = this.y1 + heightValue + this.taskLineValue + borderTopWidth - this.lineStroke;
                this.connectorLinePath = 'M ' + (this.x1 + this.x2 + 1) + ' ' + (this.y1) + ' L ' + (this.x1 + this.x2 - 10) + ' ' + (this.y1) +
                    ' L ' + (this.x1 + this.x2 - 10) + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue) + ' L ' + (this.x1 + 8) + ' ' + (this.y2 + adjustments['adjustY1'] - adjustedValue);
                this.arrowPath = 'M ' + (this.x1 + adjustedX) + ' ' + ((this.y2) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + ((this.y2 - (4 + this.lineStroke)) + adjustments['adjustY1'] - adjustedValue) +
                    ' L ' + ((this.x1 + 8) + adjustedX) + ' ' + ((this.y2 + 4 + this.lineStroke) + adjustments['adjustY1'] - adjustedValue) + ' Z';
            }
            this.connectorPath.setAttribute('d', this.connectorLinePath);
            this.arrowlinePath.setAttribute('d', this.arrowPath);
        }
        return this.groupObject;
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
        const isMilestoneParent: boolean = data.milestoneParent ? true : false;
        const isMilestone: boolean = data.milestoneChild ? true : false;
        const midPointParent: number = this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1);
        const midPoint: number = this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1);
        const isParentIndex: boolean = data.parentIndexInCurrentView !== -1;
        const isChildIndex: boolean = data.childIndexInCurrentView !== -1;
        if (type === 'SSType1' || type === 'SSType2' || type === 'FFType1' || type === 'FFType2' || type === 'SFType2') {
            topPosition = isParentIndex ? (this.parentRowIndexHeight) + midPointParent : 0;
            lineHeight = (isParentIndex && isChildIndex) ? heightValue : isChildIndex ?
                (this.childRowIndexHeight) + midPointParent : (this.lastRowIndexHeight) + midPointParent;
        } else if (type === 'SSType3' || type === 'SSType4' || type === 'FSType4' || type === 'FFType3' ||
            type === 'FFType4' || type === 'SFType4' || type === 'SFType3') {
            topPosition = isChildIndex ? (this.childRowIndexHeight) + midPoint : 0;
            lineHeight = (isParentIndex && isChildIndex) ? heightValue : isParentIndex ?
                (this.parentRowIndexHeight) + midPoint :
                (this.lastRowIndexHeight) + midPoint;
        } else if (type === 'FSType3') {
            topPosition = isChildIndex ? (this.childRowIndexHeight) + midPointParent : 0;
            lineHeight = (isParentIndex && isChildIndex) ? heightValue : isParentIndex ?
                (this.parentRowIndexHeight) + midPoint :
                (this.lastRowIndexHeight) + midPointParent;
        } else if (type === 'SFType1' || type === 'FSType1' || type === 'FSType2') {
            topPosition = isParentIndex ? (this.parentRowIndexHeight) + midPoint : 0;
            lineHeight = (isParentIndex && isChildIndex) ? heightValue : isChildIndex ?
                (this.childRowIndexHeight) + midPoint :
                (this.lastRowIndexHeight) + midPoint;
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
        fromTaskName: string, fromPredecessorText: string, toTaskName?: string, toPredecessorText?: string): Element {
        const tbody: HTMLTableSectionElement = document.createElement('tbody');
        const createRow: (id: string, label: string, taskName: string, predecessorText: string) => HTMLTableRowElement =
            (id: string, label: string, taskName: string, predecessorText: string) => {
                const tr: HTMLTableRowElement = document.createElement('tr');
                tr.id = id;
                const td1: HTMLTableCellElement = document.createElement('td');
                td1.style.padding = '2px';
                td1.textContent = this.parent.localeObj.getConstant(label);
                const td2: HTMLTableCellElement = document.createElement('td');
                td2.textContent = taskName;
                const td3: HTMLTableCellElement = document.createElement('td');
                td3.style.padding = '2px';
                td3.textContent = this.parent.localeObj.getConstant(predecessorText);
                tr.append(td1, td2, td3);
                return tr;
            };
        tbody.appendChild(
            createRow('fromPredecessor', 'from', fromTaskName, fromPredecessorText)
        );
        tbody.appendChild(
            createRow('toPredecessor', 'to', toTaskName || '', toPredecessorText || '')
        );
        return tbody;
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
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
                this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
                    this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) {
            const a: IGanttData = this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData'].filter((data: IGanttData) => {
                return data.ganttProperties.taskId.toString() === id.toString();
            })[0];
            return a;
        }
        else if (this.parent.viewType === 'ResourceView')
        {
            return this.parent.flatData[this.parent.getTaskIds().indexOf('T' + id.toString())];
        }
        else
        {
            return this.parent.getRecordByID(id);
        }
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
        const element: Element = this.parent.connectorLineModule.dependencyViewContainer.querySelector('#ConnectorLine' + id.replace(/([.])/g, '\\$1'));
        if (!isNullOrUndefined(element)) {
            remove(element);
        }
    }

}
