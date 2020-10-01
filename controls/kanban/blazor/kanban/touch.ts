import { Touch, TapEventArgs, remove, closest } from '@syncfusion/ej2-base';
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
        this.wireTouchEvents();
    }

    private wireTouchEvents(): void {
        this.element = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        this.touchObj = new Touch(this.element, { tapHold: this.tapHoldHandler.bind(this) });
    }

    private tapHoldHandler(e: TapEventArgs): void {
        this.tabHold = true;
        let target: Element = closest((e.originalEvent.target as Element), '.' + cls.CARD_CLASS);
    }

    private getPopupContent(): string {
        let popupContent: string;
        let selectedCards: HTMLElement[] = this.parent.getSelectedCards();
        if (selectedCards.length > 1) {
            popupContent = '(' + selectedCards.length + ') Cards Selected';
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

    private unWireTouchEvents(): void {
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
