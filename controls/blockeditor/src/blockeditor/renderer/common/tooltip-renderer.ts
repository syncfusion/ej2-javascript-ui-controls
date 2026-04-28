import { Tooltip } from '@syncfusion/ej2-popups';
import { BlockEditor } from '../../base/index';
import { ITooltipRenderOptions } from '../../../common/interface';

/**
 * `Tooltip renderer` module is used to render Tooltip in BlockEditor.
 *
 * @hidden
 */
export class TooltipRenderer {
    private editor: BlockEditor;

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
            beforeRender: args.beforeRender,
            locale: this.editor.locale,
            cssClass: (args.cssClass + (this.editor.cssClass ? (' ' + this.editor.cssClass) : '')),
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence,
            opensOn: 'Hover'
        };
        if (args.content) {
            tooltipOptions.content = args.content;
        }

        const tooltipObj: Tooltip = new Tooltip(tooltipOptions, element);
        return tooltipObj;
    }

    public destroyTooltip(tooltip: Tooltip): void {
        if (tooltip) {
            tooltip.destroy();
        }
    }
}
