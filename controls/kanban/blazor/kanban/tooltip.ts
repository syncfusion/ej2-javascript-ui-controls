import { addClass } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { SfKanban } from './kanban';
import * as cls from './constant';

/**
 * Tooltip for Kanban board
 */
export class KanbanTooltip {
    private parent: SfKanban;
    public tooltipObj: Tooltip;
    constructor(parent: SfKanban) {
        this.parent = parent;
        this.renderTooltip();
    }

    private renderTooltip(): void {
        this.tooltipObj = new Tooltip({
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
        if (this.parent.dragAndDropModule.isDragging) {
            args.cancel = true;
            return;
        }
        let tooltipContent: HTMLElement | string;
            tooltipContent = `<div class="e-card-header-caption">${args.target.innerText}</div>`;
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    }

    public destroy(): void {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    }

}
