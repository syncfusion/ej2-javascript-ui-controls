import { KeyboardEvents, KeyboardEventArgs, closest, addClass, removeClass } from '@syncfusion/ej2-base';
import * as cls from '../common/constants';
import { SfPivotView } from './sf-pivotview-fn';

/**
 * PivotView Keyboard interaction
 */
export class KeyboardInteraction {
    public event: KeyboardEventArgs;
    public parent: SfPivotView;
    private keyConfigs: { [key: string]: string } = {
        tab: 'tab',
        shiftTab: 'shift+tab',
        enter: 'enter',
        shiftEnter: 'shift+enter',
        ctrlEnter: 'ctrl+enter',
        ctrlShiftF: 'ctrl+shift+f'
    };
    private pivotViewKeyboardModule: KeyboardEvents;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;
    /**
     * Constructor
     */
    constructor(parent: SfPivotView) {
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
            case 'ctrlShiftF':
                this.toggleFieldList(e);
                break;
        }
    }
    private getAdjacentButton(target: HTMLElement, position: string): HTMLElement {
        let allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
        removeClass(allPivotButtons, cls.BUTTON_FOCUSED);
        if (this.parent.internalGrid &&
            this.parent.internalGrid.element.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            let len: number = allPivotButtons.length;
            for (let i: number = 0; i < len; i++) {
                if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    let adjacentButton: HTMLElement = position == 'next' ? allPivotButtons[i + 1] : allPivotButtons[i - 1];
                    return (adjacentButton ? adjacentButton : target);
                }
            }
        }
        return target;
    }
    private allpivotButtons(target: HTMLElement): HTMLElement[] {
        let pivotButtons: HTMLElement[] = [];
        if (this.parent.options.showGroupingBar) {
            let columnFilterValueGroup: HTMLElement = closest(target, '.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement;
            let rowGroup: HTMLElement = closest(target, '.' + cls.GROUP_PIVOT_ROW) as HTMLElement;
            let chartGroup: HTMLElement = closest(target, '.' + cls.CHART_GROUPING_BAR_CLASS) as HTMLElement;
            let tableAxis: Boolean = target.classList.contains(cls.ROWSHEADER);
            let chartAxis: Boolean;
            let rowAxis: Boolean;
            let columnFilterValueAxis: Boolean;
            if (columnFilterValueGroup !== null) {
                rowAxis = columnFilterValueGroup.classList.contains(cls.GRID_GROUPING_BAR_CLASS);
            } else if (rowGroup !== null) {
                columnFilterValueAxis = rowGroup.classList.contains(cls.GROUP_PIVOT_ROW);
            } else if (chartGroup !== null) {
                chartAxis = chartGroup.classList.contains(cls.CHART_GROUPING_BAR_CLASS);
            }
            if (rowAxis || columnFilterValueAxis || tableAxis) {
                /* tslint:disable */
                let groupingbarButton: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                let headerButton: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.GROUP_PIVOT_ROW).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                pivotButtons = groupingbarButton.concat(headerButton);
            } else if (chartAxis) {
                pivotButtons = [].slice.call(this.parent.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS).querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            }
            /* tslint:enable */
        }
        return pivotButtons;
    }
    private processTab(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && (closest(target, '.' + cls.PIVOT_BUTTON_CLASS) || target.classList.contains(cls.GROUP_ROW))) {
            if (this.parent.internalGrid) {
                if (target.classList.contains(cls.GROUP_ROW) && target.querySelector('.' + cls.BUTTON_FOCUSED)) {
                    target = target.querySelector('.' + cls.BUTTON_FOCUSED);
                }
                let nextButton: HTMLElement = this.getAdjacentButton(target as HTMLElement, 'next');
                if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    addClass([nextButton], cls.BUTTON_FOCUSED);
                    nextButton.focus();
                }
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.GRID_TOOLBAR) && this.parent.options.showToolbar) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(() => {
                let activeElement: HTMLElement = this.getAdjacentToolbarItem(document.activeElement as HTMLElement, 'next');
                /* tslint:disable-next-line:max-line-length */
                removeClass(closest(target, '.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.FOCUSED_CLASS), cls.FOCUSED_CLASS);
                if (activeElement && activeElement.classList.contains(cls.MENU_ITEM_CLASS)) {
                    addClass([activeElement], cls.FOCUSED_CLASS);
                }
            });
        }
    }

    private getAdjacentToolbarItem(activeElement: HTMLElement, position: string): HTMLElement {
        if (activeElement.classList.contains(cls.MENU_ITEM_CLASS) && activeElement.classList.contains(cls.FOCUSED_CLASS)) {
            let toolbarItem: HTMLElement = closest(activeElement, '.' + cls.TOOLBAR_ITEM) as HTMLElement;
            /* tslint:disable-next-line:max-line-length */
            let toolbarItems: HTMLElement[] = [].slice.call(closest(activeElement, '.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.TOOLBAR_ITEM + ':not(.' + cls.OVERLAY + ')'));
            if (position == 'next') {
                for (let i: number = 0; i < toolbarItems.length; i++) {
                    if (toolbarItem.id === toolbarItems[i].id) {
                        return this.getActiveElement(toolbarItems[i + 1]);
                    }
                }
            } else {
                for (let i: number = toolbarItems.length - 1; i > -1; i--) {
                    if (toolbarItem.id === toolbarItems[i].id) {
                        return this.getActiveElement(toolbarItems[i - 1]);
                    }
                }
            }
        }
        return activeElement;
    }

    private getActiveElement(item: HTMLElement): HTMLElement {
        if (item) {
            if (item.firstElementChild.tagName.toLowerCase() === 'button') {
                (item.firstElementChild as HTMLElement).focus();
                return item.firstElementChild as HTMLElement;
            } else if (item.querySelector('.' + cls.MENU_ITEM_CLASS)) {
                (item.querySelector('.' + cls.MENU_ITEM_CLASS) as HTMLElement).focus();
                return item.querySelector('.' + cls.MENU_ITEM_CLASS) as HTMLElement;
            }
        }
        return document.activeElement as HTMLElement;
    }

    private processShiftTab(e: Event): void {
        let target: Element = (e.target as HTMLElement);
        if (target && (closest(target, '.' + cls.PIVOT_BUTTON_CLASS) || target.classList.contains(cls.GROUP_ROW))) {
            if (this.parent.internalGrid) {
                if (target.classList.contains(cls.GROUP_ROW) && target.querySelector('.' + cls.BUTTON_FOCUSED)) {
                    target = target.querySelector('.' + cls.BUTTON_FOCUSED);
                } else if (target.classList.contains(cls.GROUP_ROW)) {
                    target = this.parent.element.querySelector('.' + cls.BUTTON_FOCUSED) ?
                        this.parent.element.querySelector('.' + cls.BUTTON_FOCUSED) :
                        this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS);
                    let allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
                    if (allPivotButtons.length > 0 && allPivotButtons[allPivotButtons.length - 1]) {
                        allPivotButtons[allPivotButtons.length - 1].focus();
                        removeClass(allPivotButtons, cls.BUTTON_FOCUSED);
                        addClass([allPivotButtons[allPivotButtons.length - 1]], cls.BUTTON_FOCUSED);
                        e.preventDefault();
                        return;
                    }
                }
                let prevButton: HTMLElement = this.getAdjacentButton(target as HTMLElement, 'previous');
                if (prevButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    prevButton.focus();
                    e.preventDefault();
                    return;
                }
            }
        } else if (target && this.parent.internalGrid && (target.classList.contains(cls.MOVABLE_FIRST) ||
            (target.classList.contains(cls.ROWSHEADER) && closest(target, 'tr').getAttribute('data-uid') ===
                this.parent.internalGrid.element.querySelector('.' + cls.FROZENCONTENT_DIV + ' tr').getAttribute('data-uid')))) {
            let allPivotButtons: HTMLElement[] = this.allpivotButtons(target as HTMLElement);
            if (allPivotButtons.length > 0) {
                setTimeout(() => {
                    allPivotButtons[allPivotButtons.length - 1].focus();
                });
                removeClass(allPivotButtons, cls.BUTTON_FOCUSED);
                addClass([allPivotButtons[allPivotButtons.length - 1]], cls.BUTTON_FOCUSED);
                e.preventDefault();
                return;
            }
        } else if (target && closest(target, '.' + cls.GRID_TOOLBAR) &&
            this.parent.options.showToolbar) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(() => {
                let activeElement: HTMLElement = this.getAdjacentToolbarItem(document.activeElement as HTMLElement, 'previous');
                /* tslint:disable-next-line:max-line-length */
                removeClass(closest(target, '.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.FOCUSED_CLASS), cls.FOCUSED_CLASS);
                if (activeElement && activeElement.classList.contains(cls.MENU_ITEM_CLASS)) {
                    addClass([activeElement], cls.FOCUSED_CLASS);
                }
            });
        }
    }
    private processEnter(e: KeyboardEventArgs): void {
        let target: Element = (e.target as HTMLElement);
        if (target && closest(target, '.' + cls.GRID_CLASS)) {
            if (e.keyCode === 13 && !e.shiftKey && !e.ctrlKey) {
                if (target.querySelector('.' + cls.ICON)) {
                    this.event = e;
                    (target.querySelector('.' + cls.ICON) as HTMLElement).click();
                } else if (target.classList.contains(cls.VALUESCONTENT)) {
                    target.dispatchEvent(new MouseEvent('dblclick', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    }));
                }
            } else if (e.keyCode === 13 && e.shiftKey && !e.ctrlKey) {
                if (this.parent.options.enableValueSorting) {
                    this.event = e;
                    (target as HTMLElement).click();
                }
            } else if (e.keyCode === 13 && !e.shiftKey && e.ctrlKey) {
                if (this.parent.options.hyperlinkSettings && target.querySelector('a')) {
                    (target.querySelector('a') as HTMLElement).click();
                }
            }
            e.preventDefault();
            return;
        }
    }
    private toggleFieldList(e: KeyboardEventArgs): void {
        /* tslint:disable */
        let pivot: SfPivotView = this.parent;
        let target: Element = (e.target as HTMLElement);
        if (pivot && pivot.options.showFieldList &&
            pivot.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
            if (!pivot.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).classList.contains(cls.ICON_HIDDEN)) {
                (pivot.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).click();
                e.preventDefault();
                return;
            } else if ((pivot.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).classList.contains(cls.ICON_HIDDEN) ||
                pivot.options.showToolbar) && target && closest(target, '.' + cls.PIVOT_VIEW_CLASS) && pivot.pivotFieldListModule &&
                pivot.pivotFieldListModule.parentElement && pivot.pivotFieldListModule.parentElement.classList.contains(cls.POPUP_OPEN)) {
                let dialogInstance: any = (pivot.pivotFieldListModule.parentElement as any)['blazor__instance'];
                if (dialogInstance && !dialogInstance.closeOnEscape) {
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
                    });
                }
            }
        }
        /* tslint:enable */
    }

    public destroy(): void {
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        } else {
            return;
        }
    }
}