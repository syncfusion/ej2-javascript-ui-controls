import { Popup } from '@syncfusion/ej2-popups';
import { CLS_QUICK_POP } from '../base/classes';
import { IRenderer, IRichTextEditor, QuickToolbarEventArgs } from '../base/interface';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { isBlazor } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 * @hidden
 * @deprecated
 */
export class PopupRenderer implements IRenderer {
    private popupObj: Popup;
    private popupPanel: Element;
    protected parent: IRichTextEditor;

    /**
     * Constructor for popup renderer module
     */
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
    }

    private quickToolbarOpen(): void {
        let args: QuickToolbarEventArgs | Popup = isBlazor() ? { element: this.popupObj.element } : this.popupObj;
        this.parent.trigger(events.quickToolbarOpen, args);
    }

    /**
     * renderPopup method
     * @hidden
     * @deprecated  
     */
    public renderPopup(args: BaseQuickToolbar): void {
        this.setPanel(args.element);
        this.renderPanel();
        args.popupObj = new Popup(args.element, {
            targetType: 'relative',
            relateTo: this.parent.element,
            open: this.quickToolbarOpen.bind(this)
        });
        this.popupObj = args.popupObj;
        args.popupObj.hide();
    }

    /**
     * The function is used to add popup class in Quick Toolbar
     * @hidden
     * @deprecated
     */
    public renderPanel(): void {
        this.getPanel().classList.add(CLS_QUICK_POP);
    }

    /**
     * Get the popup element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    public getPanel(): Element {
        return this.popupPanel;
    }

    /**
     * Set the popup element of RichTextEditor
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    public setPanel(panel: Element): void {
        this.popupPanel = panel;
    }
}