import { KeyboardEvents, KeyboardEventArgs, closest, addClass } from '@syncfusion/ej2-base';
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
        if (target && closest(target, '.' + cls.GRID_CLASS) && target.querySelector('.' + cls.ICON)) {
            (target.querySelector('.' + cls.ICON) as HTMLElement).click();
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
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        } else {
            return;
        }
    }
}