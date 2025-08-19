import { Popup } from '@syncfusion/ej2-popups';
import { IRichTextEditor, QuickToolbarEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { getUniqueID } from '@syncfusion/ej2-base';
import { QuickToolbarType } from '../../common/types';
import * as classes from '../base/classes';

export class QuickPopupRenderer {
    private parent: IRichTextEditor;
    private type: QuickToolbarType;
    private popupElement: HTMLElement;
    private popup: Popup
    constructor(parent: IRichTextEditor) {
        this.parent = parent;
    }

    public renderPopup(type: QuickToolbarType): Popup {
        this.type = type;
        const baseClass: string  = this.type === 'Inline' ? classes.CLS_QUICK_POP + ' ' + classes.CLS_INLINE_POP : classes.CLS_QUICK_POP;
        const baseId: string = this.type === 'Inline' ? '_Inline_Quick_Popup' : '_Quick_Popup';
        const popupId: string = getUniqueID(this.parent.getID() + '_' + type + baseId);
        this.popupElement = this.parent.createElement('div', { className: baseClass  + ' ' + classes.CLS_RTE_ELEMENTS});
        this.popupElement.setAttribute('aria-owns', this.parent.getID());
        this.popupElement.id = popupId;
        const tip: HTMLElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TBAR_TIP_POINTER});
        this.popupElement.appendChild(tip);
        this.popup = this.createPopup(this.type, this.popupElement);
        return this.popup;
    }

    private quickToolbarOpen(): void {
        const args: QuickToolbarEventArgs | Popup = this.popup;
        this.parent.trigger(events.quickToolbarOpen, args);
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
                    : this.parent.contentModule.getEditPanel() as HTMLElement,
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
                    : this.parent.contentModule.getEditPanel() as HTMLElement,
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
