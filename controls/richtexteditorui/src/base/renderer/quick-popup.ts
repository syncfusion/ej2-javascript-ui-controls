import { Popup } from '@syncfusion/ej2-popups';
import { getUniqueID } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../../richtexteditor-ui/richtexteditor-ui';
import { QuickToolbarType } from './base-quick-toolbar';
import * as classes from '../classes';
import * as events from '../../common/constant';

export class QuickPopupRenderer {
    private parent: RichTextEditorUI;
    private type: QuickToolbarType;
    private popupElement: HTMLElement;
    private popup: Popup
    constructor(parent: RichTextEditorUI) {
        this.parent = parent;
    }

    public renderPopup(type: QuickToolbarType): Popup {
        this.type = type;
        const baseClass: string  = classes.CLS_QUICK_POP;
        const baseId: string = '_Quick_Popup';
        const popupId: string = getUniqueID(this.parent.element.id + '_' + type + baseId);
        this.popupElement = this.parent.createElement('div', { className: baseClass  + ' ' + classes.CLS_RTE_ELEMENTS});
        this.popupElement.setAttribute('aria-owns', this.parent.element.id);
        this.popupElement.id = popupId;
        const tip: HTMLElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TBAR_TIP_POINTER});
        this.popupElement.appendChild(tip);
        this.popup = this.createPopup(this.popupElement);
        return this.popup;
    }

    private quickToolbarOpen(): void {
        const args: QuickToolbarEventArgs | Popup = this.popup;
        this.parent.trigger(events.quickToolbarOpen, args);
    }

    private createPopup(element: HTMLElement): Popup {
        const popup: Popup = new Popup(element, {
            viewPortElement: this.parent.quickToolbarSettings.appendToBody ? null
                : this.parent.inputElement,
            zIndex: this.parent.quickToolbarSettings.appendToBody ? null : 9,
            collision: { X: 'fit', Y: 'flip' },
            position: { X: 'left', Y: 'top' },
            actionOnScroll: 'none',
            open: this.quickToolbarOpen.bind(this)
        });
        return popup;
    }
}

/**
 * Provides detailed information about the QuickToolbar event in the editor.
 */
export interface QuickToolbarEventArgs {
    /**
     * Defines the instance of the current popup element
     *
     * @deprecated
     */
    popup?: Popup
    /**
     * Returns the HTMLElement associated with the dialog in the quick toolbar.
     */
    element: HTMLElement
    /**
     * Specify the name identifier of the event within the quick toolbar.
     */
    name?: string
}
