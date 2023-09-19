import { KeyboardEvents, KeyboardEventArgs, closest, addClass, removeClass, getInstance } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotView } from '../../pivotview/base/pivotview';

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
        escape: 'escape',
        upArrow: 'upArrow',
        downArrow: 'downArrow',
        altJ: 'alt+J'
    };
    private keyboardModule: KeyboardEvents;
    private timeOutObj: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    /**
     * Constructor
     *
     * @param {PivotCommon} parent - It contains the parent data
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
        case 'upArrow':
        case 'downArrow':
            this.processFilterNodeSelection(e);
            break;
        case 'altJ':
            this.processComponentFocus(e);
        }
    }
    private processComponentFocus(e: Event): void {
        if (this.parent.element) {
            this.parent.element.focus();
            e.stopPropagation();
            e.preventDefault();
            return;
        }
    }
    private getButtonElement(target: HTMLElement): HTMLElement {
        const allPivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        for (let i: number = 0, len: number = allPivotButtons.length; i < len; i++) {
            if (allPivotButtons[i as number].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                return allPivotButtons[i as number];
            }
        }
        return target;
    }
    private processEnter(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS)) {
            if (target.querySelector('.' + cls.AXISFIELD_ICON_CLASS) && closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
                (target.querySelector('.' + cls.AXISFIELD_ICON_CLASS) as HTMLElement).click();
            } else if (target.querySelector('.' + cls.CALC_EDIT)) {
                (target.querySelector('.' + cls.CALC_EDIT) as HTMLElement).click();
            } else if (target.querySelector('.' + cls.SORT_CLASS) &&
                !closest(target, '.' + cls.VALUE_AXIS_CLASS) && !closest(target, '.' + cls.AXIS_FILTER_CLASS)) {
                (target.querySelector('.' + cls.SORT_CLASS) as HTMLElement).click();
                this.getButtonElement(target).focus();
            } else if (target.querySelector('.' + cls.FILTER_COMMON_CLASS) && !closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
                (target.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement).click();
            }
            e.preventDefault();
            return;
        }
    }
    private processSort(e: Event): void {
        const target: HTMLElement = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.SORT_CLASS) &&
            !closest(target, '.' + cls.VALUE_AXIS_CLASS) && !closest(target, '.' + cls.AXIS_FILTER_CLASS)) {
            (target.querySelector('.' + cls.SORT_CLASS) as HTMLElement).click();
            this.getButtonElement(target).focus();
            e.preventDefault();
            return;
        }
    }
    private processEdit(e: Event): void {
        const target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.CALC_EDIT)) {
            (target.querySelector('.' + cls.CALC_EDIT) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    private processFilter(e: Event): void {
        const target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.FILTER_COMMON_CLASS) &&
            !closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
            (target.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement).click();
            if (this.parent && this.parent.control && this.parent.moduleName === 'pivotview' &&
                (this.parent.control as PivotView).grid && (this.parent.control as PivotView).showGroupingBar &&
                (this.parent.control as PivotView).groupingBarModule && closest(target, '.' + cls.GROUP_ROW_CLASS) &&
                this.parent.filterDialog && this.parent.filterDialog.dialogPopUp &&
                !this.parent.filterDialog.dialogPopUp.isDestroyed && this.parent.filterDialog.dialogPopUp.element) {
                const dialogElement: HTMLElement = this.parent.filterDialog.dialogPopUp.element;
                const isExcelFilter: boolean = this.parent.filterDialog.allowExcelLikeFilter;
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(() => {
                    if (dialogElement && dialogElement.classList.contains('e-popup-open')) {
                        if (isExcelFilter && dialogElement.querySelector('.e-dlg-closeicon-btn')) {
                            (dialogElement.querySelector('.e-dlg-closeicon-btn') as HTMLElement).focus();
                        } else if (dialogElement.querySelector('input')) {
                            (dialogElement.querySelector('input') as HTMLElement).focus();
                        }
                    }
                });
            }
            e.preventDefault();
            return;
        }
    }
    private processFilterNodeSelection(e: KeyboardEventArgs): void {
        const target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.SELECT_ALL_CLASS) && e.keyCode === 40) {
            const memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_WRAPPER_CLASS).querySelector('.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree && memberEditorTree.querySelector('li')) {
                const firstLi: HTMLElement = memberEditorTree.querySelector('li');
                if (memberEditorTree.querySelector('li#_active')) {
                    removeClass([memberEditorTree.querySelector('li#_active')], ['e-node-focus']);
                    memberEditorTree.querySelector('li#_active').removeAttribute('id');
                }
                firstLi.setAttribute('id', '_active');
                addClass([firstLi], ['e-node-focus']);
                firstLi.focus();
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) && e.keyCode === 38) {
            const memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree.querySelector('li#_active.e-node-focus') && memberEditorTree.querySelector('li') &&
                memberEditorTree.querySelector('li').classList.contains('e-prev-active-node') &&
                memberEditorTree.querySelector('li') === memberEditorTree.querySelector('li#_active.e-node-focus')) {
                removeClass(memberEditorTree.querySelectorAll('li.e-prev-active-node'), 'e-prev-active-node');
                const allMemberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_WRAPPER_CLASS).querySelector('.' + cls.SELECT_ALL_CLASS) as HTMLElement;
                if (allMemberEditorTree && allMemberEditorTree.querySelector('li')) {
                    const firstLi: HTMLElement = allMemberEditorTree.querySelector('li');
                    firstLi.setAttribute('id', '_active');
                    addClass([firstLi], ['e-node-focus']);
                    firstLi.focus();
                    e.preventDefault();
                    return;
                }
            }
        } else if (target && target.id === this.parent.parentID + '_inputbox') {
            if (e.action === 'upArrow') {
                (target.parentElement.querySelector('.e-spin-up') as HTMLElement).click();
            } else if (e.action === 'downArrow') {
                (target.parentElement.querySelector('.e-spin-down') as HTMLElement).click();
            }
        }
    }
    private processDelete(e: Event): void {
        const target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.REMOVE_CLASS)) {
            (target.querySelector('.' + cls.REMOVE_CLASS) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    private processClose(e: Event): void {
        const target: Element = e.target as Element;
        if (target && closest(target, '.e-popup.e-popup-open')) {
            const dialogInstance: Dialog = getInstance(<HTMLElement>closest(target, '.e-popup.e-popup-open'), Dialog) as Dialog;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                const button: string = dialogInstance.element.getAttribute('data-fieldName');
                dialogInstance.hide();
                if (this.parent.element) {
                    const pivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-pivot-button'));
                    for (const item of pivotButtons) {
                        if (item.getAttribute('data-uid') === button) {
                            item.focus();
                            break;
                        }
                    }
                }
                e.preventDefault();
                return;
            }
        }
    }

    /**
     * To destroy the keyboard module.
     *
     * @returns {void}
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
