import { Touch, EventHandler, TapEventArgs, remove, addClass, createElement, closest } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { Kanban } from '../base/kanban';
import { EJ2Instance } from '../base/interface';
import * as cls from '../base/css-constant';
/**
 * kanban touch module
 */
export class KanbanTouch {
    public mobilePopup: Popup;
    private element: HTMLElement;
    private parent: Kanban;
    private touchObj: Touch;
    public tabHold: boolean;
    /**
     * Constructor for touch module
     */
    constructor(parent: Kanban) {
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
            this.parent.actionModule.cardSelection(target, true, false);
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
                innerHTML: `<div class="${cls.POPUP_HEADER_CLASS}"><button class="${cls.CLOSE_CLASS}"></button></div>` +
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
            let closeIcon: HTMLButtonElement = this.mobilePopup.element.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
            let buttonObj: Button = new Button({
                cssClass: 'e-flat e-round e-small',
                enableRtl: this.parent.enableRtl,
                iconCss: cls.ICON_CLASS + ' ' + cls.CLOSE_ICON_CLASS
            });
            buttonObj.appendTo(closeIcon);
            buttonObj.isStringTemplate = true;
            EventHandler.add(closeIcon, 'click', this.closeClick, this);
        }
    }

    private getPopupContent(): string {
        let popupContent: string;
        let selectedCards: HTMLElement[] = this.parent.getSelectedCards();
        if (selectedCards.length > 1) {
            popupContent = '(' + selectedCards.length + ') ' + this.parent.localeObj.getConstant('cardsSelected');
        } else if (selectedCards.length === 1) {
            popupContent = ' ' + this.parent.getCardDetails(selectedCards[0])[this.parent.cardSettings.headerField];
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

    private closeClick(): void {
        this.parent.touchModule.mobilePopup.hide();
    }

    private popupClose(): void {
        this.popupDestroy();
    }

    private popupDestroy(): void {
        if (this.mobilePopup && this.mobilePopup.element) {
            let instance: Button = (this.mobilePopup.element.querySelector('.e-control.e-btn') as EJ2Instance).ej2_instances[0] as Button;
            if (instance) {
                instance.destroy();
            }
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
