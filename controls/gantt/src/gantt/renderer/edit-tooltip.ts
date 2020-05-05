import { Gantt } from '../base/gantt';
import { Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
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
                content: this.getTooltipText(),
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
        this.toolTipObj.isStringTemplate = true;
        this.toolTipObj.appendTo(this.parent.chartPane);
    }

    /**
     * To show/hide taskbar edit tooltip.
     * @return {void}
     * @private
     */
    public showHideTaskbarEditTooltip(bool: boolean): void {
        if (bool && this.parent.tooltipSettings.showTooltip) {
            this.createTooltip('Custom', false);
            this.parent.tooltipModule.toolTipObj.close();
            this.updateTooltip();
            if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointLeftDrag') {
                this.toolTipObj.open(
                    this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointLeft) as HTMLElement);
            } else if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.open(
                    this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointRight) as HTMLElement);
            } else {
                this.toolTipObj.open(this.taskbarEdit.taskBarEditElement as HTMLElement);
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
    public updateTooltip(): void {
        if (!isNullOrUndefined(this.toolTipObj)) {
            if (this.taskbarEdit.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskbarEdit.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.content = this.getTooltipText();
                this.toolTipObj.offsetY = -3;
            } else {
                this.toolTipObj.content = this.getTooltipText();
                this.toolTipObj.refresh(this.taskbarEdit.taskBarEditElement as HTMLElement);
                if (this.taskbarEdit.taskBarEditAction === 'LeftResizing') {
                    this.toolTipObj.offsetX = -this.taskbarEdit.taskBarEditRecord.ganttProperties.width;
                } else if (this.taskbarEdit.taskBarEditAction === 'RightResizing' ||
                 this.taskbarEdit.taskBarEditAction === 'ParentResizing') {
                    this.toolTipObj.offsetX = 0;
                } else if (this.taskbarEdit.taskBarEditAction === 'ProgressResizing') {
                    this.toolTipObj.offsetX = -(this.taskbarEdit.taskBarEditRecord.ganttProperties.width -
                        this.taskbarEdit.taskBarEditRecord.ganttProperties.progressWidth);
                } else if (this.taskbarEdit.taskBarEditAction === 'MilestoneDrag') {
                    this.toolTipObj.offsetX = -(this.parent.chartRowsModule.milestoneHeight / 2);
                } else if (this.taskbarEdit.taskBarEditRecord.ganttProperties.width > 5) {
                    this.toolTipObj.offsetX = -(this.taskbarEdit.taskBarEditRecord.ganttProperties.width +
                        this.taskbarEdit.taskBarEditRecord.ganttProperties.left -
                        this.taskbarEdit.tooltipPositionX);
                }
            }
        }
    }

    /**
     * To get updated tooltip text.
     * @return {void}
     * @private
     */
    private getTooltipText(): string | HTMLElement {
        let tooltipString: string | HTMLElement = '';
        let instance: Internationalization = this.parent.globalize;
        let editRecord: ITaskData = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        if (this.parent.tooltipSettings.editing) {
            let templateNode: NodeList = this.parent.tooltipModule.templateCompiler(
                this.parent.tooltipSettings.editing, this.parent, editRecord, 'TooltipEditingTemplate');
            tooltipString = (templateNode[0] as HTMLElement);
        } else {
            switch (this.taskbarEdit.taskBarEditAction) {
                case 'ProgressResizing':
                    tooltipString = this.parent.localeObj.getConstant('progress') + ' : ' + editRecord.progress;
                    break;
                case 'LeftResizing':
                    tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                    tooltipString += instance.formatDate(
                        editRecord.startDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
                    break;
                case 'RightResizing':
                case 'ParentResizing':
                    tooltipString = this.parent.localeObj.getConstant('endDate') + ' : ';
                    tooltipString += instance.formatDate(
                        editRecord.endDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
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
                    tooltipString = this.parent.connectorLineModule.tooltipTable as HTMLElement;
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