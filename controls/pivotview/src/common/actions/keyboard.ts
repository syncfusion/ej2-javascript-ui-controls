import { KeyboardEvents, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { EJ2Instance } from '@syncfusion/ej2-navigations';

/**
 * Keyboard interaction
 */
/** @hidden */
export class CommonKeyboardInteraction {
    private parent: PivotCommon;
    private keyConfigs: { [key: string]: string } = {
        shiftF: 'shift+F',
        shiftS: 'shift+S',
        shiftE: 'shift+E',
        delete: 'delete',
        enter: 'enter',
        escape: 'escape'
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
            case 'shiftE':
                this.processEdit(e);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'escape':
                this.processClose(e);
                break;
        }
    }
    private processEnter(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) &&
            closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
            (target.querySelector('.' + cls.AXISFIELD_ICON_CLASS) as HTMLElement).click();
            (closest(target, '.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement).focus();
            e.preventDefault();
            return;
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
    private processEdit(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.CALC_EDIT)) {
            (target.querySelector('.' + cls.CALC_EDIT) as HTMLElement).click();
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
    private processClose(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.e-popup.e-popup-open')) {
            let dialogInstance: Dialog = ((<HTMLElement>closest(target, '.e-popup.e-popup-open')) as EJ2Instance).ej2_instances[0] as Dialog;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                dialogInstance.hide();
                e.preventDefault();
                return;
            }
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