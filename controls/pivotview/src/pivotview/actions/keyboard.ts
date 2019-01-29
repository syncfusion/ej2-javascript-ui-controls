import { KeyboardEvents, KeyboardEventArgs, closest, addClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import * as cls from '../../common/base/css-constant';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';

/**
 * PivotView Keyboard interaction
 */
/** @hidden */
export class KeyboardInteraction {
    private parent: PivotView;
    private keyConfigs: { [key: string]: string } = {
        tab: 'tab',
        enter: 'enter',
        shiftUp: 'shift+upArrow',
        shiftDown: 'shift+downArrow',
        shiftLeft: 'shift+leftArrow',
        shiftRight: 'shift+rightArrow',
        upArrow: 'upArrow',
        downArrow: 'downArrow',
        leftArrow: 'leftArrow',
        rightArrow: 'rightArrow',
        escape: 'escape'
    };
    private pivotViewKeyboardModule: KeyboardEvents;
    /**
     * Constructor
     */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.pivotViewKeyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'tab':
                this.processTab(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'shiftUp':
            case 'shiftDown':
            case 'shiftLeft':
            case 'shiftRight':
            case 'upArrow':
            case 'downArrow':
            case 'leftArrow':
            case 'rightArrow':
                this.processSelection(e);
                break;
            case 'escape':
                this.clearSelection();
                break;
        }
    }
    private getNextButton(target: HTMLElement): HTMLElement {
        let allPivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        let nextElement: HTMLElement = target;
        if (this.parent.grid.element.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            let len: number = allPivotButtons.length;
            for (let i: number = 0; i < len; i++) {
                if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    nextElement = allPivotButtons[i + 1] ? allPivotButtons[i + 1] : nextElement;
                    break;
                }
            }
        }
        return nextElement;
    }
    private processTab(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.PIVOT_BUTTON_CLASS)) {
            let gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            let nextButton: HTMLElement = this.getNextButton(target as HTMLElement);
            if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                gridFocus.currentInfo.skipAction = true;
                nextButton.focus();
            } else {
                gridFocus.focus();
                let element: HTMLElement = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
            e.preventDefault();
            return;
        } else if (!this.parent.showGroupingBar && this.parent.showFieldList) {
            if (target && closest(target, '.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
                let gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                gridFocus.focus();
                let element: HTMLElement = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
        } else if (!this.parent.showGroupingBar && !this.parent.showFieldList) {
            if (target && closest(target, '.' + cls.PIVOT_VIEW_CLASS)) {
                let gridElement: HTMLElement = closest(target, '.' + cls.PIVOT_VIEW_CLASS) as HTMLElement;
                let gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                let rows: HTMLElement[] = [].slice.call(gridElement.getElementsByTagName('tr')) as HTMLElement[];
                if (target.innerHTML === ((rows[rows.length - 1]).lastChild as HTMLElement).innerHTML) {
                    gridFocus.currentInfo.skipAction = true;
                } else {
                    gridFocus.focus();
                    let element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                }
            }
        }
    }
    private processEnter(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.GRID_CLASS)) {
            if (target.querySelector('.' + cls.ICON)) {
                (target.querySelector('.' + cls.ICON) as HTMLElement).click();
            } else if (target.classList.contains('e-valuescontent')) {
                target.dispatchEvent(new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                }));
            }
            e.preventDefault();
            return;
        }
    }
    private clearSelection(): void {
        let control: PivotView = this.parent as PivotView;
        /* tslint:disable */
        control.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR).forEach(function
            (ele: HTMLElement) {
            ele.classList.remove(cls.SELECTED_BGCOLOR, cls.CELL_SELECTED_BGCOLOR, cls.CELL_ACTIVE_BGCOLOR);
        });
        this.parent.renderModule.selected();
        /* tslint:enable */
    }
    private processSelection(e: KeyboardEventArgs): void {
        if (this.parent.gridSettings.allowSelection && this.parent.gridSettings.selectionSettings.mode !== 'Row') {
            let target: HTMLElement = e.target as HTMLElement;
            let control: PivotView = this.parent as PivotView;
            let colIndex: number = Number((e.target as HTMLElement).getAttribute('aria-colIndex'));
            let rowIndex: number = Number((e.target as HTMLElement).getAttribute('index'));
            let ele: HTMLElement;
            /* tslint:disable */
            if (target.nodeName === 'TH' || target.nodeName === 'TD') {
                if (e.action === 'shiftUp' || e.action === 'upArrow') {
                    ele = (rowIndex === 0 || colIndex === 0 || (target.nodeName !== 'TH' &&
                        control.renderModule.rowStartPos !== rowIndex)) ? null : this.getParentElement(control, ele, colIndex, rowIndex - 1);
                } else if (e.action === 'shiftDown' || e.action === 'downArrow') {
                    ele = control.element.querySelector('th[aria-colindex="' + colIndex + '"][index="' + (rowIndex + 1) + '"]');
                }
                else if (e.action === 'shiftLeft' || e.action === 'leftArrow') {
                    ele = (e.target as HTMLElement).previousSibling as HTMLElement;
                }
                else {
                    ele = (e.target as HTMLElement).nextSibling as HTMLElement;
                }
            }
            if (!isNullOrUndefined(ele)) {
                if (control.gridSettings.selectionSettings.mode === 'Both' ? !ele.classList.contains(cls.ROW_CELL_CLASS) : true) {
                    colIndex = Number(ele.getAttribute('aria-colindex'));
                    rowIndex = Number(ele.getAttribute('index'));
                    let colSpan: number = Number(ele.getAttribute('aria-colspan'));
                    control.clearSelection(ele, e, colIndex, rowIndex);
                    control.applyColumnSelection(e, ele, colIndex, colIndex + (colSpan > 0 ? (colSpan - 1) : 0), rowIndex);
                } else {
                    control.clearSelection(ele, e, colIndex, rowIndex);
                }
            } else {
                if (e.action === 'upArrow') {
                    ele = control.element.querySelector('[aria-colindex="' + colIndex + '"][index="' + (rowIndex - 1) + '"]');
                    rowIndex--;
                }
                else if (e.action === 'downArrow') {
                    ele = control.element.querySelector('[aria-colindex="' + colIndex + '"][index="' + (rowIndex + 1) + '"]');
                    rowIndex++;
                }
                if (!isNullOrUndefined(ele)) {
                    control.clearSelection(ele, e, colIndex, rowIndex);
                }
            }
        }
        /* tslint:enable */
    }
    private getParentElement(control: PivotView, ele: HTMLElement, colIndex: number, rowIndex: number): HTMLElement {
        while (!ele) {
            ele = control.element.querySelector('[aria-colindex="' + colIndex + '"][index="' + rowIndex + '"]');
            colIndex--;
        }
        return ele;
    }
    /**
     * To destroy the keyboard module. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        } else {
            return;
        }
    }
}