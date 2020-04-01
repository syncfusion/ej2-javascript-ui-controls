import { KeyboardEvents, KeyboardEventArgs, closest, addClass, removeClass } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { EJ2Instance } from '@syncfusion/ej2-navigations';
import { PivotView } from '../../pivotview';

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
        downArrow: 'downArrow'
    };
    private keyboardModule: KeyboardEvents;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;
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
            case 'upArrow':
            case 'downArrow':
                this.processFilterNodeSelection(e);
                break;
        }
    }
    private getButtonElement(target: HTMLElement): HTMLElement {
        let allPivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        for (let i: number = 0, len: number = allPivotButtons.length; i < len; i++) {
            if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                return allPivotButtons[i];
            }
        }
        return target;
    }
    private processEnter(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
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
        let target: HTMLElement = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.SORT_CLASS) &&
            !closest(target, '.' + cls.VALUE_AXIS_CLASS) && !closest(target, '.' + cls.AXIS_FILTER_CLASS)) {
            (target.querySelector('.' + cls.SORT_CLASS) as HTMLElement).click();
            this.getButtonElement(target).focus();
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
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.FILTER_COMMON_CLASS) &&
            !closest(target, '.' + cls.VALUE_AXIS_CLASS)) {
            (target.querySelector('.' + cls.FILTER_COMMON_CLASS) as HTMLElement).click();
            if (this.parent && this.parent.control && this.parent.moduleName === 'pivotview' &&
                (this.parent.control as PivotView).grid && (this.parent.control as PivotView).showGroupingBar &&
                (this.parent.control as PivotView).groupingBarModule && closest(target, '.' + cls.GROUP_ROW_CLASS) &&
                this.parent.filterDialog && this.parent.filterDialog.dialogPopUp &&
                !this.parent.filterDialog.dialogPopUp.isDestroyed && this.parent.filterDialog.dialogPopUp.element) {
                let dialogElement: HTMLElement = this.parent.filterDialog.dialogPopUp.element;
                let isExcelFilter: boolean = this.parent.filterDialog.allowExcelLikeFilter;
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
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.SELECT_ALL_CLASS) && e.keyCode === 40) {
            /* tslint:disable-next-line:max-line-length */
            let memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_WRAPPER_CLASS).querySelector('.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree && memberEditorTree.querySelector('li')) {
                let firstLi: HTMLElement = memberEditorTree.querySelector('li');
                if (memberEditorTree.querySelector('li#_active')) {
                    removeClass([memberEditorTree.querySelector('li#_active')], ['e-hover', 'e-node-focus']);
                    memberEditorTree.querySelector('li#_active').removeAttribute('id');
                }
                firstLi.setAttribute('id', '_active');
                addClass([firstLi], ['e-hover', 'e-node-focus']);
                memberEditorTree.focus();
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) && e.keyCode === 38) {
            let memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree.querySelector('li#_active.e-hover.e-node-focus') && memberEditorTree.querySelector('li') &&
                memberEditorTree.querySelector('li').classList.contains('e-prev-active-node') &&
                memberEditorTree.querySelector('li') === memberEditorTree.querySelector('li#_active.e-hover.e-node-focus')) {
                removeClass(memberEditorTree.querySelectorAll('li.e-prev-active-node'), 'e-prev-active-node');
                /* tslint:disable-next-line:max-line-length */
                let allMemberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_WRAPPER_CLASS).querySelector('.' + cls.SELECT_ALL_CLASS) as HTMLElement;
                if (allMemberEditorTree && allMemberEditorTree.querySelector('li')) {
                    let firstLi: HTMLElement = allMemberEditorTree.querySelector('li');
                    firstLi.setAttribute('id', '_active');
                    addClass([firstLi], ['e-hover', 'e-node-focus']);
                    allMemberEditorTree.focus();
                    e.preventDefault();
                    return;
                }
            }
        }
    }
    private processDelete(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS) && target.querySelector('.' + cls.REMOVE_CLASS)) {
            (target.querySelector('.' + cls.REMOVE_CLASS) as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }
    private processClose(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.e-popup.e-popup-open')) {
            /* tslint:disable-next-line:max-line-length */
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