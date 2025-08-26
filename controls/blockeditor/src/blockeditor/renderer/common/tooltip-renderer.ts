import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { BlockEditor } from '../../base/index';
import { ITooltipRenderOptions } from '../../base/interface';

/**
 * `Tooltip renderer` module is used to render Tooltip in BlockEditor.
 *
 * @hidden
 */
export class TooltipRenderer {
    protected editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders tooltip in BlockEditor.
     *
     * @param {ITooltipRenderOptions} args - specifies  the arguments.
     * @returns {Tooltip} - returns the Tooltip object.
     * @hidden
     */
    public renderTooltip(args?: ITooltipRenderOptions): Tooltip {
        let element: string | HTMLElement = args.element;
        if (typeof element == 'string') {
            element = document.querySelector(element) as HTMLElement;
        }
        const tooltipOptions: Record<string, any> = {
            target: args.target,
            position: args.position === 'RightCenter' ? (this.editor.enableRtl ? 'LeftCenter' : 'RightCenter') : args.position,
            showTipPointer: args.showTipPointer,
            windowCollision: args.windowCollision,
            cssClass: args.cssClass,
            beforeRender: args.beforeRender
        };
        if (args.content) {
            tooltipOptions.content = args.content;
        }

        const tooltipObj: Tooltip = new Tooltip(tooltipOptions, element);
        return tooltipObj;
    }

    destroyTooltip(tooltip: Tooltip): void {
        if (tooltip) {
            tooltip.destroy();
        }
    }
}
