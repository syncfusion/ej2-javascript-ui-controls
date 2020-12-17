import { KeyboardEvents, KeyboardEventArgs, closest, removeClass, addClass } from '@syncfusion/ej2-base';
import * as cls from './constants';
import { SfPivotView } from '../pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';

/**
 * Keyboard interaction
 */
export class CommonKeyboardInteraction {

    public parent: SfPivotView | SfPivotFieldList;
    public keyboardModule: KeyboardEvents;
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
    /**
     * Constructor
     */
    constructor(parent: SfPivotView | SfPivotFieldList) {
        this.parent = parent;
        this.parent.parentElement.tabIndex = this.parent.parentElement.tabIndex === -1 ? 0 : this.parent.parentElement.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.parentElement, {
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
        let allPivotButtons: HTMLElement[] = [].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
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
            e.preventDefault();
            return;
        }
    }
    private processFilterNodeSelection(e: KeyboardEventArgs): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.SELECT_ALL_CLASS) && e.keyCode === 40) {
            /* tslint:disable-next-line:max-line-length */
            let memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_OUTER_DIV_CLASS).querySelector('.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree && memberEditorTree.querySelector('li')) {
                let firstLi: HTMLElement = memberEditorTree.querySelector('li');
                if (memberEditorTree.querySelector('li#_active')) {
                    removeClass([memberEditorTree.querySelector('li#_active')], [cls.HOVER, cls.NODE_FOCUS]);
                    memberEditorTree.querySelector('li#_active').removeAttribute('id');
                }
                firstLi.setAttribute('id', '_active');
                addClass([firstLi], [cls.HOVER, cls.NODE_FOCUS]);
                memberEditorTree.focus();
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) && e.keyCode === 38) {
            let memberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_CONTAINER_CLASS) as HTMLElement;
            if (memberEditorTree.querySelector('li#_active.' + cls.HOVER + '.' + cls.NODE_FOCUS) && memberEditorTree.querySelector('li') &&
                memberEditorTree.querySelector('li').classList.contains(cls.PREV_ACTIVE_NODE) &&
                memberEditorTree.querySelector('li') === memberEditorTree.querySelector('li#_active.' + cls.HOVER + '.' + cls.NODE_FOCUS)) {
                removeClass(memberEditorTree.querySelectorAll('li.' + cls.PREV_ACTIVE_NODE), cls.PREV_ACTIVE_NODE);
                /* tslint:disable-next-line:max-line-length */
                let allMemberEditorTree: HTMLElement = closest(target, '.' + cls.EDITOR_TREE_OUTER_DIV_CLASS).querySelector('.' + cls.SELECT_ALL_CLASS) as HTMLElement;
                if (allMemberEditorTree && allMemberEditorTree.querySelector('li')) {
                    let firstLi: HTMLElement = allMemberEditorTree.querySelector('li');
                    firstLi.setAttribute('id', '_active');
                    addClass([firstLi], [cls.HOVER, cls.NODE_FOCUS]);
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
    private processClose(e: KeyboardEventArgs): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.' + cls.POPUP + '.' + cls.POPUP_OPEN)) {
            /* tslint:disable */
            let dialogInstance: any = (closest(target, '.' + cls.POPUP + '.' + cls.POPUP_OPEN) as any)['blazor__instance'];
            /* tslint:enable */
            let pivot: CommonKeyboardInteraction = this;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                let fieldName: string = dialogInstance.element.getAttribute('data-fieldName');
                dialogInstance.dotNetRef.invokeMethodAsync('CloseDialog', {
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    code: e.code,
                    key: e.key,
                    location: e.location,
                    repeat: e.repeat,
                    shiftKey: e.shiftKey,
                    metaKey: e.metaKey,
                    type: e.type
                }).then(() => {
                    if (pivot.parent.parentElement) {
                        /* tslint:disable-next-line:max-line-length */
                        let pivotButtons: HTMLElement[] = [].slice.call(pivot.parent.parentElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                        for (let item of pivotButtons) {
                            if (item.getAttribute('data-uid') === fieldName) {
                                item.focus();
                                break;
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                });
            }
        }
    }

    public destroy(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        } else {
            return;
        }
    }
}