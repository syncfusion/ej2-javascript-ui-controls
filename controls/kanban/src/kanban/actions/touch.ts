import { Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import * as cls from '../base/css-constant';
/**
 * kanban touch module
 */
export class KanbanTouch {
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
    }

    public destroy(): void {
        this.touchObj.destroy();
        this.tabHold = false;
        this.element = null;
    }

}
