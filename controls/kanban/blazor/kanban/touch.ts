import { Touch, TapEventArgs, EventHandler, remove, closest, createElement, addClass } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { SfKanban } from './kanban';
import * as cls from './constant';
/**
 * kanban touch module
 */
export class KanbanTouch {
    public mobilePopup: Popup;
    private element: HTMLElement;
    private parent: SfKanban;
    private touchObj: Touch;
    public tabHold: boolean;
    /**
     * Constructor for touch module
     */
    constructor(parent: SfKanban) {
        this.parent = parent;
        this.tabHold = false;
    }

    public wireTouchEvents(): void {
        this.element = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        this.touchObj = new Touch(this.element, { tapHold: this.tapHoldHandler.bind(this) });
    }

    private tapHoldHandler(e: TapEventArgs): void {
        this.tabHold = true;
        let target: Element = closest((e.originalEvent.target as Element), '.' + cls.CARD_CLASS);
        if (target && this.parent.cardSettings.selectionType === 'Multiple') {
            if (!this.mobilePopup) {
                this.renderMobilePopup();
                this.mobilePopup.show();
            }
            this.updatePopupContent();
        }
    }

    private renderMobilePopup(): void {
        if (this.parent.cardSettings.selectionType === 'Multiple') {
            let mobilePopupWrapper: HTMLElement = createElement('div', {
                className: cls.POPUP_WRAPPER_CLASS + ' e-popup-close',
                innerHTML: `<div class="${cls.POPUP_HEADER_CLASS}"><button class="e-btn ${cls.CLOSE_CLASS} e-flat e-round e-small">` +
                `<span class="${cls.ICON_CLASS} ${cls.CLOSE_ICON_CLASS}"></span></button></div>` +
                    `<div class="${cls.POPUP_CONTENT_CLASS}"></div>`
            });
            document.body.appendChild(mobilePopupWrapper);
            addClass([mobilePopupWrapper], cls.DEVICE_CLASS);
            this.mobilePopup = new Popup(mobilePopupWrapper, {
                targetType: 'container',
                enableRtl: this.parent.enableRtl,
                hideAnimation: { name: 'ZoomOut' },
                showAnimation: { name: 'ZoomIn' },
                collision: { X: 'fit', Y: 'fit' },
                position: { X: 'left', Y: 'top' },
                viewPortElement: document.body,
                zIndex: 1004,
                close: this.popupClose.bind(this)
            });
            let closeIcon: HTMLElement = this.mobilePopup.element.querySelector('.' + cls.CLOSE_CLASS) as HTMLElement;
            EventHandler.add(closeIcon, 'click', this.closeClick, this);
        }
    }

    private closeClick(): void {
        this.mobilePopup.hide();
    }

    private popupClose(): void {
        this.popupDestroy();
    }

    private getPopupContent(): string {
        let popupContent: string;
        let selectedCards: HTMLElement[] = this.parent.getSelectedCards();
        if (selectedCards.length > 1) {
            popupContent = '(' + selectedCards.length + ') Cards Selected';
        } else if (selectedCards.length === 1) {
            popupContent = ' ' + selectedCards[0].getAttribute('data-id');
        }
        return popupContent;
    }

    public updatePopupContent(): void {
        if (!this.mobilePopup) { return; }
        let popupContent: string = this.getPopupContent();
        if (popupContent) {
            this.mobilePopup.element.querySelector('.' + cls.POPUP_CONTENT_CLASS).textContent = popupContent;
        } else {
            this.mobilePopup.hide();
        }
    }
    private popupDestroy(): void {
        if (this.mobilePopup && this.mobilePopup.element) {
            this.mobilePopup.destroy();
            remove(this.mobilePopup.element);
            this.mobilePopup = null;
        }
    }

    public unWireTouchEvents(): void {
        if (this.touchObj) {
            this.touchObj.destroy();
        }
        this.touchObj = null;
        this.element = null;
    }

    public destroy(): void {
        this.popupDestroy();
        this.unWireTouchEvents();
        this.tabHold = false;
    }
}
