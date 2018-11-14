import { createElement } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
/**
 * Module to render Pivot button
 */
/** @hidden */
export class PivotContextMenu {
    public parent: PivotView | PivotFieldList;
    /** @hidden */
    public menuObj: ContextMenu;
    /** @hidden */
    public fieldElement: HTMLElement;

    /** Constructor for render module */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.parent.contextMenuModule = this;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.renderContextMenu();
    }
    private renderContextMenu(): void {
        let menuItems: MenuItemModel[] = [
            { text: this.parent.localeObj.getConstant('addToFilter'), id: 'Context_Filters' },
            { text: this.parent.localeObj.getConstant('addToRow'), id: 'Context_Rows' },
            { text: this.parent.localeObj.getConstant('addToColumn'), id: 'Context_Columns' },
            { text: this.parent.localeObj.getConstant('addToValue'), id: 'Context_Values' }];
        let menuOptions: ContextMenuModel = {
            cssClass: cls.PIVOT_CONTEXT_MENU_CLASS,
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.onBeforeMenuOpen.bind(this),
            select: this.onSelectContextMenu.bind(this)
        };
        this.parent.element.appendChild(createElement('ul', {
            id: this.parent.element.id + '_PivotContextMenu'
        }));
        this.menuObj = new ContextMenu(menuOptions);
        this.menuObj.appendTo('#' + this.parent.element.id + '_PivotContextMenu');
    }
    private onBeforeMenuOpen(args: MenuEventArgs): void {
        let items: HTMLLIElement[] = [].slice.call(args.element.querySelectorAll('li'));
        let fieldType: SummaryTypes =
            this.fieldElement.querySelector('.' + cls.PIVOT_BUTTON_CONTENT_CLASS).getAttribute('data-type') as SummaryTypes;
        removeClass(items, cls.MENU_DISABLE);
        if (fieldType === 'CalculatedField') {
            for (let item of items) {
                if (item.textContent !== this.parent.localeObj.getConstant('addToValue')) {
                    addClass([item], cls.MENU_DISABLE);
                }
            }
        }
    }
    private onSelectContextMenu(menu: MenuEventArgs): void {
        if (menu.element.textContent !== null) {
            let fieldName: string = this.fieldElement.getAttribute('data-uid');
            let dropClass: string = menu.item.id.replace('Context_', '').toLowerCase();
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, dropClass, -1);
            this.parent.updateDataSource(true);
            this.fieldElement = undefined;
        }
    }

    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        if (!this.parent.isDestroyed) { return; }
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        } else {
            return;
        }

    }
}