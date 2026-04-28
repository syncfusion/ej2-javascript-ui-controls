import { KeyboardEvents, KeyboardEventArgs, closest, addClass, isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import * as cls from '../../common/base/css-constant';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';
import { PivotCellSelectedEventArgs } from '../../common/base/interface';
import { IAxisSet } from '../../base/engine';
import * as events from '../../common/base/constant';

/**
 * PivotView Keyboard interaction
 */
/** @hidden */
export class KeyboardInteraction {
    /** @hidden */
    public event: KeyboardEventArgs;
    private parent: PivotView;
    private keyConfigs: { [key: string]: string } = {
        tab: 'tab',
        shiftTab: 'shift+tab',
        enter: 'enter',
        shiftUp: 'shift+upArrow',
        shiftDown: 'shift+downArrow',
        shiftLeft: 'shift+leftArrow',
        shiftRight: 'shift+rightArrow',
        shiftEnter: 'shift+enter',
        ctrlEnter: 'ctrl+enter',
        upArrow: 'upArrow',
        downArrow: 'downArrow',
        leftArrow: 'leftArrow',
        rightArrow: 'rightArrow',
        escape: 'escape',
        ctrlShiftF: 'ctrl+shift+f'
    };
    private pivotViewKeyboardModule: KeyboardEvents;
    private timeOutObj: ReturnType<typeof setTimeout>;
    /**
     * Constructor.
     *
     * @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.event = undefined;
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
        case 'shiftTab':
            this.processShiftTab(e);
            break;
        case 'enter':
        case 'shiftEnter':
        case 'ctrlEnter':
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
        case 'ctrlShiftF':
            this.toggleFieldList(e);
            break;
        }
    }
    private getNextButton(target: HTMLElement): HTMLElement {
        const allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
        removeClass(allPivotButtons, 'e-btn-focused');
        if (this.parent.grid.element.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            const len: number = allPivotButtons.length;
            for (let i: number = 0; i < len; i++) {
                if (allPivotButtons[i as number].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    return (allPivotButtons[i + 1] ? allPivotButtons[i + 1] : target);
                }
            }
        }
        return target;
    }
    private getPrevButton(target: HTMLElement): HTMLElement {
        const allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
        removeClass(allPivotButtons, 'e-btn-focused');
        if (this.parent.grid.element.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            const len: number = allPivotButtons.length;
            for (let i: number = 0; i < len; i++) {
                if (allPivotButtons[i as number].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    return (allPivotButtons[i - 1] ? allPivotButtons[i - 1] : target);
                }
            }
        }
        return target;
    }
    private allpivotButtons(target: HTMLElement): HTMLElement[] {
        let buttons: HTMLElement[] = [];
        if (target && this.parent.showGroupingBar) {
            const columnFilterValueGroup: HTMLElement = closest(target, '.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement;
            const rowGroup: HTMLElement = closest(target, '.' + cls.GROUP_PIVOT_ROW) as HTMLElement;
            const chartGroup: HTMLElement = closest(target, '.' + cls.CHART_GROUPING_BAR_CLASS) as HTMLElement;
            const tableAxis: boolean = target.classList.contains(cls.ROWSHEADER);
            let chartAxis: boolean;
            let rowAxis: boolean;
            let columnFilterValueAxis: boolean;
            if (columnFilterValueGroup !== null) {
                rowAxis = columnFilterValueGroup.classList.contains(cls.GRID_GROUPING_BAR_CLASS);
            } else if (rowGroup !== null) {
                columnFilterValueAxis = rowGroup.classList.contains(cls.GROUP_PIVOT_ROW);
            } else if (chartGroup !== null) {
                chartAxis = chartGroup.classList.contains(cls.CHART_GROUPING_BAR_CLASS);
            }
            if (rowAxis || columnFilterValueAxis || tableAxis) {
                const groupingbarButton: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                const headerButton: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.GROUP_PIVOT_ROW).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                buttons = groupingbarButton.concat(headerButton);
            }
            else if (chartAxis) {
                buttons = [].slice.call(this.parent.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            }
        }
        return buttons;
    }
    private processTab(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && (closest(target, '.' + cls.PIVOT_BUTTON_CLASS) || target.classList.contains('e-group-row'))) {
            if (this.parent.grid) {
                const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                if (target.classList.contains('e-group-row') && target.querySelector('.e-btn-focused')) {
                    target = target.querySelector('.e-btn-focused');
                } else if (target.classList.contains('e-group-row')) {
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                    e.preventDefault();
                    return;
                }
                const nextButton: HTMLElement = this.getNextButton(target as HTMLElement);
                if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    if (this.parent.element.querySelector('.e-focused')) {
                        this.parent.element.querySelector('.e-focused').setAttribute('tabindex', '-1');
                        removeClass(this.parent.element.querySelectorAll('.e-focus'), 'e-focus');
                        removeClass(this.parent.element.querySelectorAll('.e-focused'), 'e-focused');
                        gridFocus.setFocusedElement(this.parent.element.querySelector('.e-headercell'));
                        this.parent.element.querySelector('.e-headercell').setAttribute('tabindex', '0');
                    } else {
                        gridFocus.currentInfo.skipAction = true;
                    }
                    addClass([nextButton], 'e-btn-focused');
                    nextButton.focus();
                } else {
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                }
                e.preventDefault();
                return;
            }
        } else if (!this.parent.showGroupingBar && this.parent.showFieldList &&
            target && closest(target, '.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
            if (this.parent.grid) {
                const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                gridFocus.focus();
                const element: HTMLElement = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
                e.preventDefault();
                return;
            }
        } else if (!this.parent.showGroupingBar && !this.parent.showFieldList &&
            target && closest(target, '.' + cls.PIVOT_VIEW_CLASS) && !closest(target, '.e-popup.e-popup-open')) {
            if (this.parent.grid) {
                const gridElement: HTMLElement = closest(target, '.' + cls.PIVOT_VIEW_CLASS) as HTMLElement;
                const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                const rows: HTMLElement[] = [].slice.call(gridElement.getElementsByTagName('tr')) as HTMLElement[];
                if (target.innerHTML === ((rows[rows.length - 1]).lastChild as HTMLElement).innerHTML) {
                    gridFocus.currentInfo.skipAction = true;
                } else {
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                    e.preventDefault();
                    return;
                }
            }
        } else if (target && closest(target, '.' + cls.GRID_TOOLBAR) && this.parent.toolbar && this.parent.toolbarModule) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(() => {
                removeClass(closest(target, '.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-focused'), 'e-focused');
                if (document.activeElement && document.activeElement.classList.contains('e-menu-item')) {
                    addClass([document.activeElement], 'e-focused');
                }
            });
        } else if (target.classList.contains('e-numerictextbox')) {
            const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            gridFocus.focus();
            const element: HTMLElement = gridFocus.getFocusedElement();
            removeClass([element], ['e-focused', 'e-focus']);
            element.setAttribute('tabindex', '0');
            e.preventDefault();
        }
    }
    private processShiftTab(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && (closest(target, '.' + cls.PIVOT_BUTTON_CLASS) || target.classList.contains('e-group-row'))) {
            if (this.parent.grid) {
                const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                if (target.classList.contains('e-group-row') && target.querySelector('.e-btn-focused')) {
                    target = target.querySelector('.e-btn-focused');
                } else if (target.classList.contains('e-group-row')) {
                    target = this.parent.element.querySelector('.e-btn-focused') ? this.parent.element.querySelector('.e-btn-focused') :
                        this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS);
                    const allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
                    if (allPivotButtons.length > 0 && allPivotButtons[allPivotButtons.length - 1]) {
                        gridFocus.currentInfo.skipAction = true;
                        allPivotButtons[allPivotButtons.length - 1].focus();
                        removeClass(allPivotButtons, 'e-btn-focused');
                        addClass([allPivotButtons[allPivotButtons.length - 1]], 'e-btn-focused');
                        e.preventDefault();
                        return;
                    }
                }
                const prevButton: HTMLElement = this.getPrevButton(target as HTMLElement);
                if (prevButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    gridFocus.currentInfo.skipAction = true;
                    prevButton.focus();
                    e.preventDefault();
                    return;
                }
            }
        } else if (target && this.parent.grid && (target.classList.contains('e-movablefirst') ||
            (target.classList.contains('e-rowsheader') && closest(target, 'tr').getAttribute('data-uid') ===
                this.parent.grid.element.querySelector('.e-frozencontent tr').getAttribute('data-uid')))) {
            const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            if (target.classList.contains('e-movablefirst')) {
                target = (this.parent.element.querySelector('.' + cls.GROUP_ROW_CLASS + ' .e-btn-focused')) ?
                    (this.parent.element.querySelector('.' + cls.GROUP_ROW_CLASS + ' .e-btn-focused')) :
                    (this.parent.element.querySelector('.' + cls.GROUP_ROW_CLASS));
                const element: HTMLElement = gridFocus.getFocusedElement();
                removeClass([element], ['e-focused', 'e-focus']);
            }
            const allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
            if (allPivotButtons.length > 0) {
                gridFocus.currentInfo.skipAction = true;
                setTimeout(() => {
                    allPivotButtons[allPivotButtons.length - 1].focus();
                });
                removeClass(allPivotButtons, 'e-btn-focused');
                addClass([allPivotButtons[allPivotButtons.length - 1]], 'e-btn-focused');
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.GRID_TOOLBAR) &&
            this.parent.toolbar && this.parent.toolbarModule) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(() => {
                removeClass(closest(target, '.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-focused'), 'e-focused');
                if (document.activeElement && document.activeElement.classList.contains('e-menu-item')) {
                    addClass([document.activeElement], 'e-focused');
                }
            });
        } else if (target.classList.contains('e-numerictextbox')) {
            const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            gridFocus.focus();
            const element: HTMLElement = gridFocus.getFocusedElement();
            removeClass([element], ['e-focused', 'e-focus']);
            element.setAttribute('tabindex', '0');
            e.preventDefault();
        }
    }
    private processEnter(e: KeyboardEventArgs): void {
        const target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.GRID_CLASS)) {
            const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            if (e.keyCode === 13 && !e.shiftKey && !e.ctrlKey) {
                if (target.querySelector('.' + cls.ICON)) {
                    this.event = e;
                    (target.querySelector('.' + cls.ICON) as HTMLElement).click();
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                } else if (target.classList.contains('e-valuescontent')) {
                    target.dispatchEvent(new MouseEvent('dblclick', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    }));
                    if (target.querySelector('.e-numerictextbox')) {
                        (target as HTMLElement).click();
                    }
                } else if (target.classList.contains('e-numerictextbox')) {
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    removeClass([element], ['e-focused', 'e-focus']);
                }
            } else if (e.keyCode === 13 && e.shiftKey && !e.ctrlKey) {
                if (this.parent.enableValueSorting) {
                    this.event = e;
                    (target as HTMLElement).click();
                    gridFocus.focus();
                    const element: HTMLElement = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                }
            } else if (e.keyCode === 13 && !e.shiftKey && e.ctrlKey) {
                if (this.parent.hyperlinkSettings && target.querySelector('a')) {
                    (target.querySelector('a') as HTMLElement).click();
                }
            }
            e.preventDefault();
            return;
        }
    }
    private clearSelection(): void {
        const control: PivotView = this.parent as PivotView;
        removeClass(control.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR), [cls.SELECTED_BGCOLOR, cls.CELL_SELECTED_BGCOLOR, cls.CELL_ACTIVE_BGCOLOR]);
        if (this.parent && this.parent.renderModule) {
            this.parent.renderModule.selected();
        }
    }
    private processSelection(e: KeyboardEventArgs): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (this.parent.grid && this.parent.gridSettings.allowSelection && this.parent.gridSettings.selectionSettings.mode !== 'Row' &&
            !target.classList.contains('e-numerictextbox')) {
            const control: PivotView = this.parent as PivotView;
            let colIndex: number = parseInt((e.target as HTMLElement).getAttribute('aria-colindex'), 10) - 1;
            let rowIndex: number = Number((e.target as HTMLElement).getAttribute('index'));
            let ele: HTMLElement;
            if (target.nodeName === 'TH' || target.nodeName === 'TD') {
                if (e.action === 'shiftUp' || e.action === 'upArrow') {
                    ele = (rowIndex === 0 || colIndex === 0 || (target.nodeName !== 'TH' &&
                        control.renderModule.rowStartPos !== rowIndex)) ? null
                        : this.getParentElement(control, ele, colIndex, rowIndex - 1);
                } else if (e.action === 'shiftDown' || e.action === 'downArrow') {
                    ele = control.element.querySelector('th[aria-colindex="' + (colIndex + 1) + '"][index="' + (rowIndex + 1) + '"]');
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
                    colIndex = parseInt(ele.getAttribute('aria-colindex'), 10) - 1;
                    rowIndex = Number(ele.getAttribute('index'));
                    const colSpan: number = Number(ele.getAttribute('aria-colspan'));
                    control.clearSelection(ele, e);
                    const selectArgs: PivotCellSelectedEventArgs = {
                        cancel: false,
                        isCellClick: true,
                        currentCell: ele,
                        data: control.pivotValues[rowIndex as number][colIndex as number] as IAxisSet
                    };
                    control.trigger(events.cellSelecting, selectArgs, (observedArgs: PivotCellSelectedEventArgs) => {
                        if (!observedArgs.cancel) {
                            control.applyColumnSelection(e, ele, colIndex, colIndex + (colSpan > 0 ? (colSpan - 1) : 0), rowIndex);
                        }
                    });
                } else {
                    control.clearSelection(ele, e);
                }
            } else {
                if (e.action === 'upArrow') {
                    ele = control.element.querySelector('[aria-colindex="' + (colIndex + 1) + '"][index="' + (rowIndex - 1) + '"]');
                    rowIndex--;
                }
                else if (e.action === 'downArrow') {
                    ele = control.element.querySelector('[aria-colindex="' + (colIndex + 1) + '"][index="' + (rowIndex + 1) + '"]');
                    rowIndex++;
                }
                if (!isNullOrUndefined(ele)) {
                    control.clearSelection(ele, e);
                }
            }
        }
        else if (target && (e.keyCode === 37 || e.keyCode === 38) &&
            this.parent && this.parent.showGroupingBar && this.parent.groupingBarModule && !target.classList.contains('e-numerictextbox')) {
            if (this.parent.grid && this.parent.element.querySelector('.e-frozenheader') && this.parent.element.querySelector('.e-frozenheader').querySelectorAll('.e-focus').length > 0) {
                removeClass(this.parent.element.querySelector('.e-frozenheader').querySelectorAll('.e-focus'), 'e-focus');
                removeClass(this.parent.element.querySelector('.e-frozenheader').querySelectorAll('.e-focused'), 'e-focused');
                this.parent.element.querySelector('.e-headercell').setAttribute('tabindex', '-1');
                const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
                gridFocus.setFocusedElement(target);
                addClass([target], ['e-focused', 'e-focus']);
                target.setAttribute('tabindex', '0');
                target.focus();
                e.preventDefault();
                return;
            }
        } else if (target.classList.contains('e-numerictextbox') && (e.action === 'rightArrow' || e.action === 'leftArrow')) {
            (target as HTMLElement).click();
        }
    }
    private getParentElement(control: PivotView, ele: HTMLElement, colIndex: number, rowIndex: number): HTMLElement {
        while (!ele) {
            ele = control.element.querySelector('[aria-colindex="' + (colIndex + 1) + '"][index="' + rowIndex + '"]');
            colIndex--;
        }
        return ele;
    }
    private toggleFieldList(e: Event): void {
        if (this.parent && !this.parent.isDestroyed && this.parent.showFieldList &&
            this.parent.pivotFieldListModule && !this.parent.pivotFieldListModule.isDestroyed &&
            this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
            if (!this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).classList.contains(cls.ICON_HIDDEN)) {
                (this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).click();
                e.preventDefault();
                return;
            } else if (this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).classList.contains(cls.ICON_HIDDEN) &&
                this.parent.pivotFieldListModule.dialogRenderer && this.parent.pivotFieldListModule.dialogRenderer.fieldListDialog &&
                !this.parent.pivotFieldListModule.dialogRenderer.fieldListDialog.isDestroyed) {
                this.parent.pivotFieldListModule.dialogRenderer.fieldListDialog.hide();
            }
        }
    }
    /**
     *
     * To destroy the keyboard module.
     *
     * @returns  {void}
     * @private
     */
    public destroy(): void {
        if (this.timeOutObj) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = null;
        }
        this.event = null;
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
            this.pivotViewKeyboardModule = null;
        } else {
            return;
        }
    }
}
