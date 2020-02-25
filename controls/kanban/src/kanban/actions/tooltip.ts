import { createElement, append, closest, addClass } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { Kanban } from '../base';
import * as cls from '../base/css-constant';

/**
 * Tooltip for Kanban board
 */
export class KanbanTooltip {
    private parent: Kanban;
    private tooltipObj: Tooltip;

    constructor(parent: Kanban) {
        this.parent = parent;
        this.renderTooltip();
    }

    private renderTooltip(): void {
        this.tooltipObj = new Tooltip({
            cssClass: this.parent.cssClass + ' ' + cls.TOOLTIP_CLASS,
            enableRtl: this.parent.enableRtl,
            mouseTrail: !this.parent.isAdaptive,
            offsetY: 5,
            position: 'BottomCenter',
            showTipPointer: true,
            target: '.' + cls.TOOLTIP_TEXT_CLASS,
            beforeRender: this.onBeforeRender.bind(this)
        });
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    }

    private onBeforeRender(args: TooltipEventArgs): void {
        let tooltipContent: HTMLElement | string;
        if (this.parent.tooltipTemplate) {
            tooltipContent = createElement('div');
            let target: Element = closest(args.target, '.' + cls.CARD_CLASS);
            let data: { [key: string]: Object } = this.parent.getCardDetails(target);
            let tooltipTemplate: Element[] = this.parent.templateParser(this.parent.tooltipTemplate)(data);
            append(tooltipTemplate, tooltipContent);
        } else {
            tooltipContent = `<div class="e-card-header-caption">${args.target.innerText}</div>`;
        }
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    }

    public destroy(): void {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    }

}
