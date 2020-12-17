import { SfPivotView } from './sf-pivotview-fn';
import * as cls from '../common/constants';
import { formatUnit, removeClass, addClass } from '@syncfusion/ej2-base';

/**
 * Module for Toolbar
 */
export class Toolbar {
    public parent: SfPivotView;

    constructor(parent: SfPivotView) {
        this.parent = parent;
        this.parent.toolbarModule = this;
    }

    public renderToolbar(): void {
        if (this.parent.element.querySelector('.' + cls.GRID_TOOLBAR)) {
            this.updateItemElements(this.parent.element.querySelector('.' + cls.GRID_TOOLBAR));
        }
    }

    private updateItemElements(toolbarElement: HTMLElement): void {
        for (let element of [].slice.call(toolbarElement.querySelectorAll('.' + cls.TOOLBAR_ITEM))) {
            if (element.querySelector('button')) {
                if (!(element as HTMLElement).classList.contains(cls.OVERLAY)) {
                    element.querySelector('button').setAttribute('tabindex', '0');
                }
            } else if (element.querySelector('.' + cls.MENU + '.' + cls.MENU_PARENT)) {
                element.querySelector('.' + cls.MENU + '.' + cls.MENU_PARENT).setAttribute('tabindex', '-1');
                if (!(element as HTMLElement).classList.contains(cls.OVERLAY) &&
                    element.querySelector('.' + cls.MENU_ITEM_CLASS + '.' + cls.MENU_CARET_ICON)) {
                    element.querySelector('.' + cls.MENU_ITEM_CLASS + '.' + cls.MENU_CARET_ICON).setAttribute('tabindex', '0');
                }
            }
        }
    }

    public focusToolBar(): void {
        /* tslint:disable-next-line:max-line-length */
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.FOCUSED_CLASS), cls.FOCUSED_CLASS);
        /* tslint:disable-next-line:max-line-length */
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.SELECTED_CLASS), cls.SELECTED_CLASS);
        if (document.querySelector('.' + cls.TOOLBAR_ITEMS)) {
            addClass([document.querySelector('.' + cls.TOOLBAR_ITEMS)], cls.FOCUSED_CLASS);
        }
    }

    public selectInputRange(element: HTMLElement): void {
        if (element.querySelector('.' + cls.GRID_REPORT_INPUT)) {
            let input: HTMLInputElement = element.querySelector('.' + cls.GRID_REPORT_INPUT + ' input');
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }

    public copyMdxQuery(element: HTMLElement): void {
        if (element.querySelector('.' + cls.MDX_QUERY_CONTENT)) {
            let textArea: HTMLTextAreaElement = element.querySelector('.' + cls.MDX_QUERY_CONTENT);
            try {
                textArea.select();
                document.execCommand('copy');
            } catch (error) {
                window.alert('Oops, unable to copy');
            }
            return;
        }
    }
}