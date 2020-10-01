import { Popup } from '@syncfusion/ej2-popups';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';

/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 */
export class PopupRenderer {
    private popupObj: Popup;
    private targetType: string;
    protected parent: SfRichTextEditor;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
    }
    private quickToolbarOpen(): void {
        this.parent.dotNetRef.invokeMethodAsync('QuickToolbarOpenEvent', this.popupObj.element.classList.toString(), this.targetType);
    }
    public renderPopup(args: BaseQuickToolbar, type: string): void {
        this.targetType = type;
        args.popupObj = new Popup(args.element, {
            targetType: 'relative',
            relateTo: this.parent.element,
            open: this.quickToolbarOpen.bind(this)
        });
        this.popupObj = args.popupObj;
        args.popupObj.hide();
    }
}