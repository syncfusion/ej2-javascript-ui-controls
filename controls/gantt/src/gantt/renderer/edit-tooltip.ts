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
     * @return {void}
     * @private
     */
    public createTooltip(opensOn: string, mouseTrail: boolean, target?: string): void {
        this.toolTipObj = new Tooltip(
            {
                opensOn: opensOn,
                position: 'TopRight',
                mouseTrail: mouseTrail,
                cssClass: cls.ganttTooltip,
                target: target ? target : null,
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }
            }
        );
        this.toolTipObj.beforeRender = (args: TooltipEventArgs) => {
            let argsData: BeforeTooltipRenderEventArgs = {
                data: this.taskbarEdit.taskBarEditRecord,
                args: args,
                content: this.toolTipObj.content
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
     * @param args 
     */
    private updateTooltipPosition(args: TooltipEventArgs): void {
        let containerPosition: { top: number, left: number } = this.parent.getOffsetRect(this.parent.chartPane);
        let leftEnd: number = containerPosition.left + this.parent.chartPane.offsetWidth;
        let tooltipPositionX: number = args.element.offsetLeft;
        if (leftEnd < (tooltipPositionX + args.element.offsetWidth)) {
            tooltipPositionX += leftEnd - (tooltipPositionX + args.element.offsetWidth);
        }
        args.element.style.left = tooltipPositionX + 'px';
    }
    /**
     * To show/hide taskbar edit tooltip.
     * @return {void}
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
     * @return {void}
     * @private
     */
    public updateTooltip(segmentIndex: number): void {
        let ganttProp: ITaskData = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        let taskWidth: number = segmentIndex === -1 ? ganttProp.width :
            ganttProp.segments[segmentIndex].width;

        let progressWidth: number = segmentIndex === -1 ? ganttProp.progressWidth :
            ganttProp.segments[segmentIndex].progressWidth;

        let left: number = segmentIndex === -1 ? ganttProp.left : ganttProp.left + ganttProp.segments[segmentIndex].left;

        if (!isNullOrUndefined(this.toolTipObj)) {
            if (this.taskbarEdit.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskbarEdit.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.offsetY = -3;
            } else {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.refresh(this.taskbarEdit.taskBarEditElement);
                if (this.taskbarEdit.taskBarEditAction === 'LeftResizing') {
                    this.toolTipObj.offsetX = -taskWidth;
                } else if (this.taskbarEdit.taskBarEditAction === 'RightResizing' ||
                    this.taskbarEdit.taskBarEditAction === 'ParentResizing') {
                    this.toolTipObj.offsetX = 0;
                } else if (this.taskbarEdit.taskBarEditAction === 'ProgressResizing') {
                    this.toolTipObj.offsetX = -(taskWidth - progressWidth);
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
     * @return {void}
     * @private
     */
    private getTooltipText(segmentIndex: number): string | HTMLElement {
        let tooltipString: string | HTMLElement = '';
        let instance: Internationalization = this.parent.globalize;
        let editRecord: ITaskData = this.taskbarEdit.taskBarEditRecord.ganttProperties as ITaskData;
        if (!isNullOrUndefined(editRecord.segments) && editRecord.segments.length > 0 && segmentIndex !== -1
            && this.taskbarEdit.taskBarEditAction !== 'ProgressResizing') {
            editRecord = editRecord.segments[segmentIndex];
        }
        if (this.parent.tooltipSettings.editing) {
            let templateNode: NodeList = this.parent.tooltipModule.templateCompiler(
                this.parent.tooltipSettings.editing, this.parent, editRecord, 'TooltipEditingTemplate');
            if (getValue('tooltipEle', this.toolTipObj)) {
                this.parent.renderTemplates();
            }
            tooltipString = (templateNode[0] as HTMLElement);
        } else {
            switch (this.taskbarEdit.taskBarEditAction) {
                case 'ProgressResizing':
                    tooltipString = this.parent.localeObj.getConstant('progress') + ' : ' + (editRecord as ITaskData).progress;
                    break;
                case 'LeftResizing':
                    tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                    tooltipString += instance.formatDate(
                        editRecord.startDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, (editRecord as ITaskData).durationUnit);
                    break;
                case 'RightResizing':
                case 'ParentResizing':
                    tooltipString = this.parent.localeObj.getConstant('endDate') + ' : ';
                    tooltipString += instance.formatDate(
                        editRecord.endDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, (editRecord as ITaskData).durationUnit);
                    break;
                case 'ChildDrag':
                case 'ParentDrag':
                case 'MilestoneDrag':
                case 'ManualParentDrag':
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.startDate)) {
                        tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                        tooltipString += instance.formatDate(
                            editRecord.startDate,
                            { format: this.parent.getDateFormat() });
                    }
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.endDate)) {
                        tooltipString += tooltipString === '' ? '' : '<br/>';
                        tooltipString += this.parent.localeObj.getConstant('endDate') + ' : ' + instance.formatDate(
                            editRecord.endDate,
                            { format: this.parent.getDateFormat() });
                    }
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