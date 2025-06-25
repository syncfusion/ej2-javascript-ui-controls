import { ClickEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { BlockEditor, IToolbarRenderOptions } from '../../base/index';
import { events } from '../../base/constant';

export class ToolbarRenderer {

    private editor: BlockEditor;
    private element: HTMLElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    renderToolbar(args: IToolbarRenderOptions): Toolbar {
        this.element = typeof args.element === 'string'
            ? this.editor.element.querySelector(args.element)
            : args.element;
        return new Toolbar({
            items: args.items,
            width: args.width,
            overflowMode: args.overflowMode,
            enablePersistence: args.enablePersistence,
            enableRtl: args.enableRtl,
            clicked: this.handleInlineToolbarItemClick.bind(this),
            created: this.handleInlineToolbarCreated.bind(this)
        }, this.element);
    }

    private handleInlineToolbarCreated(args: Event): void {
        this.editor.notify(events.inlineToolbarCreated, args);
    }

    private handleInlineToolbarItemClick(args: ClickEventArgs): void {
        this.editor.notify(events.inlineToolbarItemClick, args);
    }
}
