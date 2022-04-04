import { createElement, isNullOrUndefined, isObject, remove } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { IGanttData, ITaskData, IConnectorLineObject, IPredecessor } from '../base/interface';
import { isScheduledTask } from '../base/utils';

/**
 * To render the connector line in Gantt
 */
export class ConnectorLine {
    private parent: Gantt;
    public dependencyViewContainer: HTMLElement;
    private lineColor: string;
    private lineStroke: number;
    public tooltipTable: HTMLElement;
    /**
     * @hidden
     */
    public expandedRecords: IGanttData[];
    constructor(ganttObj?: Gantt) {
        this.expandedRecords = [];
        this.parent = ganttObj;
        this.dependencyViewContainer =
            createElement('div', { className: cls.dependencyViewContainer });
        this.initPublicProp();
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
            const rowHeight: number = this.parent.ganttChartModule.getChartRows()[0] &&
                this.parent.ganttChartModule.getChartRows()[0].getBoundingClientRect().height;
            connectorObj.rowHeight = rowHeight && !isNaN(rowHeight) ? rowHeight : this.parent.rowHeight;
            connectorObj.type = predecessor.type;
            const parentId: string = this.parent.viewType === 'ResourceView' ? parentGanttRecord.taskId : parentGanttRecord.rowUniqueID;
            const childId: string = this.parent.viewType === 'ResourceView' ? childGanttRecord.taskId : childGanttRecord.rowUniqueID;
            connectorObj.connectorLineId = 'parent' + parentId + 'child' + childId;
            connectorObj.milestoneParent = parentGanttRecord.isMilestone ? true : false;
            connectorObj.milestoneChild = childGanttRecord.isMilestone ? true : false;
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
        const ariaConnector : IConnectorLineObject[] = [];
        for (let index: number = 0; index < connectorLinesCollection.length; index++) {
            connectorLine = connectorLine + this.getConnectorLineTemplate(connectorLinesCollection[index]);
            ariaConnector.push(connectorLinesCollection[index]);
        }
        this.dependencyViewContainer.innerHTML = connectorLine;
        const childNodes: NodeList = this.parent.connectorLineModule.dependencyViewContainer.childNodes;
        for (let i: number = 0; i < childNodes.length; i++) {
            const innerChild: NodeList = childNodes[i].childNodes;
            for (let j: number = 0; j < innerChild.length; j++) {
                const ariaString: string = 'Connector Line ' + this.parent.connectorLineModule.generateAriaLabel(ariaConnector[i]);
                (<HTMLElement>innerChild[j]).setAttribute('aria-label', ariaString);
            }
        }
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.dependencyViewContainer);
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
        return (data.parentIndex * data.rowHeight) > (data.childIndex * data.rowHeight) ?
            ((data.parentIndex * data.rowHeight) - (data.childIndex * data.rowHeight)) :
            ((data.childIndex * data.rowHeight) - (data.parentIndex * data.rowHeight));
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
        let isMilestoneValue = 0;
        if(this.parent.renderBaseline){
            isMilestoneValue = (data.milestoneParent && data.milestoneChild) ? 0 : data.milestoneParent ? -5: data.milestoneChild ? 5 : 0;
        }
        const heightValue: number = isVirtual ? connectorLine.height : (height + isMilestoneValue);
        if (this.getParentPosition(data)) {
            connectorContainer = '<div id="ConnectorLine' + data.connectorLineId + '" style="background-color:black">';
            let div: string = '<div class="' + cls.connectorLineContainer +
                '" tabindex="-1" style="';
            const eLine: string = '<div class="' + cls.connectorLine + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            const rightArrow: string = '<div class="' + cls.connectorLineRightArrow + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            const leftArrow: string = '<div class="' + cls.connectorLineLeftArrow + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            const duplicateStingOne: string = leftArrow + (isMilestone ? 'left:0px;' : '') +
                this.getBorderStyles('right', 10) +
                'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            const duplicateStingTwo: string = this.getBorderStyles('left', 10) +
                'top:' + (-6) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            const duplicateStingThree: string = this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>' + eLine +
                'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';
            const duplicateStingFour: string = leftArrow + 'left:' +
                (((data.childLeft + data.childWidth) - (data.parentLeft)) + 10) + 'px;' +
                this.getBorderStyles('right', 10);
            const duplicateStingFive: string = 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;' +
                this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

            if (this.getParentPosition(data) === 'FSType1') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType1">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? -1 : 0) + 'px;width:' + (isMilestoneParent ?
                    ((((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10) + 1) :
                    (((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + ((data.childLeft - (data.parentLeft + data.parentWidth + 10)) - 10) + 'px;' +
                    'width:0px;' + this.getBorderStyles('right', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + ((data.childLeft - (data.parentLeft + data.parentWidth + 10)) - 10) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }


            if (this.getParentPosition(data) === 'FSType2') {
                div = div + 'left:' + data.parentLeft + 'px;top:' + (isVirtual ? connectorLine.top : ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType2">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? data.parentWidth - 1 : data.parentWidth) + 'px;width:' +
                    (isMilestoneParent ? 11 : 10) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth + 10 - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'width:0px;' +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 20)) + 'px;' +
                    'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:0px;' +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;top:' + (-6 - this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType3">';

                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) + 'px;' +
                    'top:' + (-6) + 'px;width:0;height:0;position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'width:' + this.lineStroke + 'px;' + this.getBorderStyles(
                    'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke + 1)) +
                    'position:relative;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + (30 - this.lineStroke)) +
                    'px;width:0px;' + 'height:' + (this.getconnectorLineGap(data) - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;' +
                    'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:' + (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + (18 - this.lineStroke)) + 'px;width:' + (12 + this.lineStroke) + 'px;' : 'left:' +
                    (((data.parentLeft + data.parentWidth) - data.childLeft) + 20) + 'px;width:10px;') +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FSType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType4">';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth) - 20) +
                    'px;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;left:' +
                    (data.childLeft - (data.parentLeft + data.parentWidth) - 20) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (isMilestoneParent ? ((data.childLeft - (data.parentLeft + data.parentWidth + 20) + 1) + this.lineStroke) :
                        ((data.childLeft - (data.parentLeft + data.parentWidth + 20)) + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType4">';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - data.parentLeft) + 'px;' + duplicateStingTwo;

                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:' +
                    (data.childLeft - data.parentLeft) + 'px;' + duplicateStingThree;

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType3">';

                div = div + rightArrow;
                div = div + 'left:10px;' + duplicateStingTwo;

                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:10px;' + duplicateStingThree;

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType2') {
                div = div + 'left:' + setInnerElementLeftSSType2 + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType2">';

                div = div + eLine;
                div = div + 'width:' + (setInnerChildWidthSSType2 + 1) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;' +
                    'height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType1') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType1">';

                div = div + eLine;
                div = div + 'width:' + (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType1') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType1">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) : ((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth))) + 'px;' +
                    'width:' + (isMilestoneParent ? (21 + this.lineStroke) : (20 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) -
                (data.childLeft + data.childWidth)) + 20) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? 4 : 10) + 'px;width:' + (isMilestone ?
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (16 + this.lineStroke)) :
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + (isMilestone ? 'left:0px;' : '') + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType2') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType2">';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'width:' +
                    (isMilestoneParent ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) +
                        (21 + this.lineStroke)) : (((data.childLeft + data.childWidth) -
                            (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 20) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 4) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 10)) + 'px;' +
                    'width:' + (isMilestone ? (16 + this.lineStroke) : (10 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + 'left:' + ((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType3">';

                div = div + duplicateStingOne;

                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' +
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 16)) :
                    ('left:10px;width:' + (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)) + 10))) + 'px;top:' + (-(6 + (5 + this.lineStroke) +
                            (this.lineStroke / 2))) + 'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 20) +
                    'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:' + (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) + 'px;width:21') : ('left:' + ((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)) + 'px;width:20')) +
                    'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType4">';

                div = div + leftArrow;
                div = div + ('left:' + ((data.childLeft + data.childWidth) -
                (data.parentLeft + data.parentWidth))) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 4) +
                    'px;width:' + (16 + this.lineStroke)) : ('left:' + (((data.childLeft + data.childWidth) -
                        (data.parentLeft + data.parentWidth)) + 10) + 'px;width:' + (10 + this.lineStroke))) +
                    'px;' + duplicateStingFive;

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 20) + 'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:-1px;width:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + (21 + this.lineStroke))) : ('width:' + (((data.childLeft + data.childWidth) -
                        (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke)))) + 'px;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;width:1px;' +
                    'height:' + heightValue + 'px;position:absolute" data-connectortype="SFType4">';

                div = div + duplicateStingFour + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? ((((data.childLeft + data.childWidth) - (data.parentLeft)) + (14 + this.lineStroke)) +
                    'px;width:16') : ((((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' +
                        (10 + this.lineStroke))) + 'px;' + duplicateStingFive;

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) + 'px;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - (this.lineStroke - 1))) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:11px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType3">';

                div = div + duplicateStingOne;

                div = div + eLine;
                div = div + (isMilestone ? 'left:4px;width:' + (16 + this.lineStroke) : 'left:10px;width:' +
                    (10 + this.lineStroke)) + 'px;top:' + (-(13 + ((this.lineStroke - 1) * 2) - 1)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    ((data.parentLeft - (data.childLeft + data.childWidth + 20)) + this.lineStroke) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType1') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType1">';

                div = div + eLine;
                div = div + 'width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft)) + 15) + 'px;width:' + (15 + this.lineStroke)) : ('left:' +
                        (((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + duplicateStingFour + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType2') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' + (isVirtual ? connectorLine.top :
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1) - isMilestoneValue)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType2">';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' + (((data.parentLeft) - (data.childLeft + data.childWidth))
                    - (14 - this.lineStroke))) : ('left:10px;width:' + (((data.parentLeft) -
                        (data.childLeft + data.childWidth)) - (20 - this.lineStroke)))) +
                    'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + 'left:0px;' + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            connectorContainer += div;
            connectorContainer += '</div>';
        }
        return connectorContainer;
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
        let innerTd: string = '<tr  id="fromPredecessor"><td >' + this.parent.localeObj.getConstant('from') + '</td><td> ';
        innerTd = innerTd + fromTaskName + ' </td><td> ' + this.parent.localeObj.getConstant(fromPredecessorText) + ' </td> </tr>';
        innerTd = innerTd + '<tr id="toPredecessor"><td>' + this.parent.localeObj.getConstant('to') + '</td><td> ' + toTaskName;
        innerTd = innerTd + ' </td><td> ' + this.parent.localeObj.getConstant(toPredecessorText) + ' </td></tr></tbody><table>';
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
                const uniqueId: string = keys[i];
                data = records[uniqueId] as IGanttData;
            } else {
                data = records[i];
            }

            const predecessors: IPredecessor[] = data.ganttProperties && data.ganttProperties.predecessor;
            if (predecessors && predecessors.length > 0) {
                for (let pre: number = 0; pre < predecessors.length; pre++) {
                    const lineId: string = 'parent' + predecessors[pre].from + 'child' + predecessors[pre].to;
                    this.removeConnectorLineById(lineId);
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
