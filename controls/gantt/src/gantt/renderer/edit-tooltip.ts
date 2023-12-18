import { Gantt } from '../base/gantt';
import { getValue, Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { BeforeTooltipRenderEventArgs, ITaskData } from '../base/interface';
import { TaskbarEdit } from '../actions/taskbar-edit';
import * as cls from '../base/css-constants';
/**
 * File for handling taskbar editing tooltip in Gantt.
 */
export class EditTooltip {
    public parent: Gantt;
    public toolTipObj: Tooltip;
    public taskbarTooltipContainer: HTMLElement;
    public taskbarTooltipDiv: HTMLElement;
    private taskbarEdit: TaskbarEdit;
    constructor(gantt: Gantt, taskbarEdit: TaskbarEdit) {
        this.parent = gantt;
        this.taskbarEdit = taskbarEdit;
    }

    /**
     * To create tooltip.
     *
     * @param {string} opensOn .
     * @param {boolean} mouseTrail .
     * @param {string} target .
     * @returns {void}
     * @private
     */
    public createTooltip(opensOn: string, mouseTrail: boolean, target?: string): void {
        this.toolTipObj = new Tooltip(
            {
                opensOn: opensOn,
                position: 'TopRight',
                enableRtl: this.parent.enableRtl,
                mouseTrail: mouseTrail,
                cssClass: cls.ganttTooltip,
                target: target ? target : null,
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }
            }
        );
        this.toolTipObj.beforeRender = (args: TooltipEventArgs) => {
            const argsData: BeforeTooltipRenderEventArgs = {
                data: this.taskbarEdit.taskBarEditRecord,
                args: args,
                content: this.toolTipObj.content as any
            };
            this.parent.trigger('beforeTooltipRender', argsData);
        };
        this.toolTipObj.afterOpen = (args: TooltipEventArgs) => {
            this.updateTooltipPosition(args);
        };
        this.toolTipObj.isStringTemplate = true;
        this.toolTipObj.appendTo(this.parent.chartPane);
    }

    /**
     * Method to update tooltip position
     *
     * @param {TooltipEventArgs} args .
     * @returns {void} .
     */
    private updateTooltipPosition(args: TooltipEventArgs): void {
        args.element.style.visibility = 'visible';
        const parentWithZoomStyle = this.parent.element.closest('[style*="zoom"]') as HTMLElement;
        if (isNullOrUndefined(parentWithZoomStyle)) {
            const containerPosition: { top: number, left: number } = this.parent.getOffsetRect(this.parent.chartPane);
            const leftEnd: number = containerPosition.left + this.parent.chartPane.offsetWidth;
            let tooltipPositionX: number = args.element.offsetLeft;
            if (leftEnd < (tooltipPositionX + args.element.offsetWidth)) {
                tooltipPositionX += leftEnd - (tooltipPositionX + args.element.offsetWidth);
            }
            args.element.style.left = tooltipPositionX + 'px';
            args.element.style.visibility = 'visible';
        }
    }
    /**
     * To show/hide taskbar edit tooltip.
     *
     * @param {boolean} bool .
     * @param {number} segmentIndex .
     * @returns {void}
     * @private
     */
    public showHideTaskbarEditTooltip(bool: boolean, segmentIndex: number): void {
        if (bool && this.parent.tooltipSettings.showTooltip) {
            this.createTooltip('Custom', false);
            this.parent.tooltipModule.toolTipObj.close();
            this.updateTooltip(segmentIndex);
            if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointLeftDrag') {
                this.toolTipObj.open(
                    this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointLeft));
            } else if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.open(
                    this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointRight));
            } else {
                this.toolTipObj.open(this.taskbarEdit.taskBarEditElement);
            }
        } else if (!isNullOrUndefined(this.toolTipObj)) {
            this.toolTipObj.destroy();
            this.toolTipObj = null;
        }
    }

    /**
     * To update tooltip content and position.
     *
     * @param {number} segmentIndex .
     * @returns {void} .
     * @private
     */
    public updateTooltip(segmentIndex: number): void {
        const ganttProp: ITaskData = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        const taskWidth: number = segmentIndex === -1 ? ganttProp.width :
            ganttProp.segments[segmentIndex as number].width;

        const progressWidth: number = segmentIndex === -1 ? ganttProp.progressWidth :
            ganttProp.segments[segmentIndex as number].progressWidth;

        const left: number = segmentIndex === -1 ? ganttProp.left : ganttProp.left + ganttProp.segments[segmentIndex as number].left;

        if (!isNullOrUndefined(this.toolTipObj)) {
            if (this.taskbarEdit.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskbarEdit.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.offsetY = -3;
            } else {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.refresh(this.taskbarEdit.taskBarEditElement);
                if (this.parent.enableRtl && this.toolTipObj['tooltipEle']) {
                    this.toolTipObj['tooltipEle'].style.left = this.parent.editModule.taskbarEditModule['tooltipValue']  + 10 + 'px';
                }
                if (this.taskbarEdit.taskBarEditAction === 'LeftResizing') {
                    if (this.parent.enableRtl) {
                        this.toolTipObj.offsetX = 0;
                    }
                    else {
                        this.toolTipObj.offsetX = -taskWidth;
                    }
                } else if (this.taskbarEdit.taskBarEditAction === 'RightResizing' ||
                    this.taskbarEdit.taskBarEditAction === 'ParentResizing') {
                        if (this.parent.enableRtl) {
                            this.toolTipObj.offsetX = -taskWidth;
                        }
                        else {
                            this.toolTipObj.offsetX = 0;
                        }
                } else if (this.taskbarEdit.taskBarEditAction === 'ProgressResizing') {
                    if (this.parent.enableRtl) {
                        this.toolTipObj.offsetX = -(progressWidth);
                    }
                    else {
                        this.toolTipObj.offsetX = -(taskWidth - progressWidth);
                    }
                } else if (this.taskbarEdit.taskBarEditAction === 'MilestoneDrag') {
                    this.toolTipObj.offsetX = -(this.parent.chartRowsModule.milestoneHeight / 2);
                } else if (taskWidth > 5) {
                    this.toolTipObj.offsetX = -(taskWidth + left - this.taskbarEdit.tooltipPositionX);
                }
            }
        }
    }

    /**
     * To get updated tooltip text.
     *
     * @param {number} segmentIndex .
     * @returns {void} .
     * @private
     */
    private getTooltipText(segmentIndex: number): string | HTMLElement {
        let tooltipString: string | HTMLElement = '';
        const instance: Internationalization = this.parent.globalize;
        let editRecord: ITaskData = this.taskbarEdit.taskBarEditRecord.ganttProperties as ITaskData;
        if (!isNullOrUndefined(editRecord.segments) && editRecord.segments.length > 0 && segmentIndex !== -1
            && this.taskbarEdit.taskBarEditAction !== 'ProgressResizing') {
            editRecord = editRecord.segments[segmentIndex as number];
        }
        if (this.parent.tooltipSettings.editing) {
            const templateNode: NodeList = this.parent.tooltipModule.templateCompiler(
                this.parent.tooltipSettings.editing, this.parent, this.taskbarEdit.taskBarEditRecord, 'TooltipEditingTemplate');
            if (getValue('tooltipEle', this.toolTipObj)) {
                this.parent.renderTemplates();
            }
            tooltipString = (templateNode[0] as HTMLElement);
        } else {
            let startDate: string;
            let endDate: string;
            let duration: string;
            if (!isNullOrUndefined(editRecord.startDate)) {
                startDate = '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('startDate') +
                    '</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">' +
                    instance.formatDate(editRecord.startDate, { format: this.parent.getDateFormat() }) + '</td></tr>';
            }
            if (!isNullOrUndefined(editRecord.endDate)) {
                endDate = '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('endDate') +
                    '</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">' +
                    instance.formatDate(editRecord.endDate, { format: this.parent.getDateFormat() }) + '</td></tr>';
            }
            if (!isNullOrUndefined(editRecord.duration)) {
                duration = '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('duration') +
                    '</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">' +
                    this.parent.getDurationString(editRecord.duration, (editRecord as ITaskData).durationUnit) + '</td></tr>';
            }
            switch (this.taskbarEdit.taskBarEditAction) {
            case 'ProgressResizing':
                const progress: string = '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('progress') +
                    '</td><td style="padding: 2px;">:</td><td class = "e-gantt-tooltip-value">' + (editRecord as ITaskData).progress + '</td></tr>';
                tooltipString =  '<table class = "e-gantt-tooltiptable"><tbody>' +
                    progress + '</tbody></table>';

                break;
            case 'LeftResizing':
                tooltipString =  '<table class = "e-gantt-tooltiptable"><tbody>' +
                startDate + duration + '</tbody></table>';
                break;
            case 'RightResizing':
            case 'ParentResizing':
                tooltipString =  '<table class = "e-gantt-tooltiptable"><tbody>' +
                    endDate + duration + '</tbody></table>';
                break;
            case 'ChildDrag':
            case 'ParentDrag':
            case 'MilestoneDrag':
            case 'ManualParentDrag':
                let sDate: string = ''; let eDate: string = '';
                if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.startDate)) {
                    sDate = startDate;
                }
                if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.endDate)) {
                    eDate = endDate;
                }
                tooltipString =  '<table class = "e-gantt-tooltiptable"><tbody>' + sDate + eDate + '</tbody></table>';
                break;
            case 'ConnectorPointLeftDrag':
            case 'ConnectorPointRightDrag':
                tooltipString = this.parent.connectorLineModule.tooltipTable;
                if (isNullOrUndefined(this.toolTipObj)) {
                    this.parent.connectorLineModule.tooltipTable.innerHTML =
                            this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(
                                this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName,
                                this.parent.editModule.taskbarEditModule.fromPredecessorText, '', ''
                            );
                }
                break;
            }
        }
        return tooltipString;
    }

}
