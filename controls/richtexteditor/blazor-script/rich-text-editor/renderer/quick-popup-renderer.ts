import { Popup } from '../../../popups/src'; /*externalscript*/
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { QuickToolbarType } from '../../editor-scripts/common/types';
import { createElement } from '../../../base'; /*externalscript*/
import * as classes from '../classes';
/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 */
export class QuickPopupRenderer {
    protected parent: SfRichTextEditor;
    private type: QuickToolbarType;
    private popupElement: HTMLElement;
    private popup: Popup

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
    }

    public renderPopup(type: QuickToolbarType, popupElement: HTMLElement): Popup {
        this.type = type;
        this.popupElement = popupElement;
        const tip: HTMLElement = createElement('div', { className: classes.CLS_QUICK_TBAR_TIP_POINTER});
        this.popupElement.prepend(tip);
        this.popup = this.createPopup(this.type, this.popupElement);
        return this.popup;
    }

    private quickToolbarOpen(): void {
        if (this.parent.quickTbOpenedEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('QuickToolbarOpenEvent', this.popup.element.classList.toString(), this.type);
        }
    }

    private createPopup(type: QuickToolbarType, element: HTMLElement): Popup {
        let popup: Popup;
        switch (type) {
        case 'Inline':
        case 'Text':
        case 'Link':
        case 'Audio':
            popup = new Popup(element, {
                viewPortElement: this.parent.iframeSettings.enable ? null
                    : this.parent.getEditPanel() as HTMLElement,
                zIndex: 9,
                collision: { X: 'fit', Y: 'flip' },
                position: { X: 'left', Y: 'top' },
                actionOnScroll: 'none',
                open: this.quickToolbarOpen.bind(this)
            });
            break;
        case 'Video':
        case 'Image':
        case 'Table':
            popup = new Popup(element, {
                viewPortElement: this.parent.iframeSettings.enable ? null
                    : this.parent.getEditPanel() as HTMLElement,
                zIndex: 9,
                collision: { X: 'fit', Y: 'flip' },
                position: { X: 'left', Y: 'top' },
                actionOnScroll: 'none',
                open: this.quickToolbarOpen.bind(this)
            });
            break;
        }
        return popup;
    }
}
