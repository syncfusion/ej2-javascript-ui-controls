import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { BlockEditor } from '../../base/index';
import { IPopupRenderOptions } from '../../base/interface';

/**
 * `Popup renderer` module is used to render popup in BlockEditor.
 *
 * @hidden
 */
export class PopupRenderer {
    protected parent: BlockEditor;

    constructor(parent?: BlockEditor) {
        this.parent = parent;
    }

    /**
     * Renders popup in BlockEditor.
     *
     * @param {IPopupRenderOptions} args - specifies  the arguments.
     * @returns {Popup} - returns the popup object.
     * @hidden
     */
    public renderPopup(args?: IPopupRenderOptions): Popup {
        let element: string | HTMLElement = args.element;
        if (typeof element == 'string') {
            element = document.querySelector(element) as HTMLElement;
        }
        const popupObj: Popup = new Popup(element, {
            targetType: 'relative',
            relateTo: this.parent.element,
            content: args.content,
            collision: { X: 'fit', Y: 'fit' },
            actionOnScroll: 'hide',
            showAnimation: {
                name: 'FadeIn'
            },
            width: args.width,
            height: args.height
        });
        popupObj.hide();

        return popupObj;
    }

    adjustPopupPositionRelativeToTarget(target: HTMLElement | Range, popup: Popup | Dialog): void {
        const targetRect: DOMRect | ClientRect = target.getBoundingClientRect();
        const popupRect: DOMRect | ClientRect = popup.element.getBoundingClientRect();
        const isInlineTbar: boolean = popup.element.classList.contains('e-blockeditor-inline-toolbar-popup');
        const viewportWidth: number = window.innerWidth;
        const viewportHeight: number = window.innerHeight;
        let adjustedX: number = targetRect.left + window.scrollX;
        let adjustedY: number = targetRect.top + window.scrollY + (isInlineTbar ? -50 : 30);

        if (popupRect.left < 0) {
            adjustedX = 0;
        }
        if (popupRect.right > viewportWidth) {
            adjustedX = viewportWidth - popupRect.width;
            adjustedX = Math.max(adjustedX, 0);
        }
        if (popupRect.top < 0) {
            adjustedY = 0;
        }
        if (popupRect.bottom > viewportHeight) {
            adjustedY = viewportHeight - popupRect.height;
            adjustedY = Math.max(adjustedY, 0);
        }
        popup.position.X = adjustedX;
        popup.position.Y = adjustedY;
        popup.dataBind();
    }

    destroyPopup(popup: Popup): void {
        if (popup) {
            popup.destroy();
            popup.element.remove();
        }
    }
}
