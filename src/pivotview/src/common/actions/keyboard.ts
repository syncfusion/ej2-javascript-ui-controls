import { KeyboardEvents, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';

/**
 * Keyboard interaction
 */
/** @hidden */
export class CommonKeyboardInteraction {
    private parent: PivotCommon;
    private keyConfigs: { [key: string]: string } = {
        shiftF: 'shift+F',
        shiftS: 'shift+S',
        delete: 'delete'
    };
    private keyboardModule: KeyboardEvents;
    /**
     * Constructor
     */
    constructor(parent: PivotCommon) {
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'shiftF':
                this.processFilter(e);
                break;
            case 'shiftS':
                this.processSort(e);
                break;
            case 'delete':
                this.processDelete(e);
                break;
        }
    }
    private processSort(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) &&
            !closest(target, '.' + cls.VALUE_AXIS_CLASS) && !closest(target, '.' + cls.AXIS_FILTER_CLASS)) {
            (target.querySelector('.' + cls.SORT_CLASS) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    private processFilter(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && !closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
            (target.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    private processDelete(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS)) {
            (target.querySelector('.' + cls.REMOVE_CLASS) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    /**
     * To destroy the keyboard module. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        } else {
            return;
        }
    }
}