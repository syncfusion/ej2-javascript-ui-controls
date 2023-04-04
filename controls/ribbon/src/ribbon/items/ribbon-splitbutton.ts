import { EventHandler, getComponent, merge } from '@syncfusion/ej2-base';
import { BeforeOpenCloseMenuEventArgs, ClickEventArgs, DropDownButton, ItemModel, OpenCloseMenuEventArgs, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { Button } from '@syncfusion/ej2-buttons';
import { getItem, Ribbon, itemProps, getItemElement, RibbonItemSize } from '../base/index';
import { ITEM_VERTICAL_CENTER, RIBBON_CONTROL, RIBBON_HOVER, RIBBON_POPUP_CONTROL, RIBBON_POPUP_OPEN, SPACE, VERTICAL_DDB } from '../base/constant';
import { RibbonSplitButtonSettingsModel, RibbonItemModel } from '../models/index';

/**
 * Defines the items of Ribbon.
 */
export class RibbonSplitButton {
    private parent: Ribbon

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonSplitButton';
    }
    protected destroy(): void {
        this.parent = null;
    }
    /**
     * Creates SplitButton.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createSplitButton(item: RibbonItemModel, itemEle: HTMLElement): void {
        const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
            id: item.id
        });
        itemEle.appendChild(buttonEle);
        const splitButtonSettings: RibbonSplitButtonSettingsModel = item.splitButtonSettings;
        const cssClass: string = (ITEM_VERTICAL_CENTER + SPACE + RIBBON_CONTROL + SPACE + (splitButtonSettings.cssClass ?
            splitButtonSettings.cssClass : '')).trim();
        const splitbutton: SplitButton = new SplitButton({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left',
            closeActionEvents: splitButtonSettings.closeActionEvents,
            cssClass: cssClass + ((item.activeSize === RibbonItemSize.Large) ? (SPACE + VERTICAL_DDB) : ''),
            disabled: item.disabled,
            iconCss: splitButtonSettings.iconCss,
            items: splitButtonSettings.items,
            target: splitButtonSettings.target,
            beforeClose: (e: BeforeOpenCloseMenuEventArgs) => {
                if (splitButtonSettings.beforeClose) { splitButtonSettings.beforeClose.call(this, e); }
            },
            beforeItemRender: splitButtonSettings.beforeItemRender,
            beforeOpen: splitButtonSettings.beforeOpen,
            close: () => {
                (splitbutton['wrapper'] as HTMLElement).classList.remove(RIBBON_POPUP_OPEN);
                if (splitButtonSettings.close) {
                    splitButtonSettings.close.call(this);
                }
            },
            created: splitButtonSettings.created,
            open: () => {
                (splitbutton['wrapper'] as HTMLElement).classList.add(RIBBON_POPUP_OPEN);
                if (splitButtonSettings.open) {
                    splitButtonSettings.open.call(this);
                }
            },
            select: splitButtonSettings.select,
            click: (e: ClickEventArgs) => {
                if (splitButtonSettings.click) { splitButtonSettings.click.call(this, e); }
            }
        }, buttonEle);
        this.setContent(item, splitbutton);
        const wrapper: HTMLElement = splitbutton['wrapper'] as HTMLElement;
        EventHandler.add(wrapper, 'mouseenter', () => { wrapper.classList.add(RIBBON_HOVER); }, this);
        EventHandler.add(wrapper, 'mouseleave', () => { wrapper.classList.remove(RIBBON_HOVER); }, this);
    }

    /**
     * Adds the additional event handlers as the item moved into overflow popup.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @param {DropDownButton} overflowButton - Gets the overflow button.
     * @returns {void}
     * @hidden
     */
    public addOverFlowEvents(item: RibbonItemModel, itemEle: HTMLElement, overflowButton: DropDownButton): void {
        const splitButtonEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const splitbutton: SplitButton = getComponent(splitButtonEle, SplitButton);
        splitbutton.cssClass = splitbutton.cssClass + SPACE + RIBBON_POPUP_CONTROL;
        splitbutton.dataBind();
        let target: HTMLElement;
        splitbutton.beforeClose = (e: BeforeOpenCloseMenuEventArgs) => {
            if (item.splitButtonSettings.beforeClose) { item.splitButtonSettings.beforeClose.call(this, e); }
            target = e.event ? e.event.target as HTMLElement : null;
        };
        splitbutton.click = (e: ClickEventArgs) => {
            if (item.splitButtonSettings.click) { item.splitButtonSettings.click.call(this, e); }
            overflowButton.toggle();
        };
        splitbutton.close = (e: OpenCloseMenuEventArgs) => {
            if (item.splitButtonSettings.close) { item.splitButtonSettings.close.call(this, e); }
            (splitbutton['wrapper'] as HTMLElement).classList.remove(RIBBON_POPUP_OPEN);
            if (target && !target.closest('.e-ribbon-group-overflow-ddb')) {
                overflowButton.toggle();
            }
        };
    }
    /**
     * Removes the additional event handlers as the item moved from overflow popup.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public removeOverFlowEvents(item: RibbonItemModel, itemEle: HTMLElement): void {
        const splitButtonEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const splitbutton: SplitButton = getComponent(splitButtonEle, SplitButton);
        let cssClass: string[] = splitbutton.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);
        splitbutton.cssClass = cssClass.join(SPACE);
        splitbutton.dataBind();
        splitbutton.beforeClose = (e: BeforeOpenCloseMenuEventArgs) => {
            if (item.splitButtonSettings.beforeClose) { item.splitButtonSettings.beforeClose.call(this, e); }
        };
        splitbutton.click = (e: ClickEventArgs) => {
            if (item.splitButtonSettings.click) { item.splitButtonSettings.click.call(this, e); }
        };
        splitbutton.close = (e: OpenCloseMenuEventArgs) => {
            if (item.splitButtonSettings.close) { item.splitButtonSettings.close.call(this, e); }
            (splitbutton['wrapper'] as HTMLElement).classList.remove(RIBBON_POPUP_OPEN);
        };
    }

    private setContent(item: RibbonItemModel, control: SplitButton): void {
        (control['primaryBtnObj'] as Button).setProperties({ content: (item.activeSize === RibbonItemSize.Medium) ? item.splitButtonSettings.content : '' });
        (control['secondaryBtnObj'] as DropDownButton).setProperties({ content: (item.activeSize === RibbonItemSize.Large) ? item.splitButtonSettings.content : '' });
    }

    private getSplitButtonObj(controlId: string): SplitButton {
        const splitButtonEle: HTMLElement = getItemElement(this.parent, controlId);
        return getComponent(splitButtonEle, SplitButton);
    }
    /**
     * Adds a new item to the menu. By default, new item appends to
     * the list as the last item, but you can insert based on the text parameter.
     *
     * @param {string} controlId - Gets the control ID.
     * @param {ItemModel[]} Items - Gets the SplitButton items.
     * @param {string} text - Gets the text of the splitbutton item where the new item needs to be inserted.
     * @returns {void}
     */
    public addItems(controlId: string, Items: ItemModel[], text?: string): void {
        this.getSplitButtonObj(controlId).addItems(Items, text);
    }
    /**
     * Removes the items from the menu.
     *
     * @param {string} controlId - Gets the control ID.
     * @param {string[]} Items -
     * @param {string} isUniqueId -
     * @returns {void}
     */
    public removeItems(controlId: string, Items: string[], isUniqueId?: boolean): void {
        this.getSplitButtonObj(controlId).removeItems(Items, isUniqueId);
    }
    /**
     * To open/close SplitButton popup based on current state of the SplitButton.
     *
     * @param {string} controlId - Gets the control ID.
     * @returns {void}
     */
    public toggle(controlId: string): void {
        this.getSplitButtonObj(controlId).toggle();
    }
    /**
     * Updates the splitbutton.
     *
     * @param {RibbonSplitButtonSettingsModel} prop - Gets the splitbutton property.
     * @param {string} id - Gets the ID of dropdown.
     * @returns {void}
     */
    public updateSplitButton(prop: RibbonSplitButtonSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.splitButtonSettings, prop);
        const btnEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!btnEle) { return; }
        const control: SplitButton = getComponent(btnEle, SplitButton);
        if (prop.cssClass) {
            prop.cssClass = (RIBBON_CONTROL + SPACE + ITEM_VERTICAL_CENTER + SPACE + prop.cssClass).trim();
            prop.cssClass = itemProp.item.activeSize === RibbonItemSize.Large ?
                (VERTICAL_DDB + SPACE + prop.cssClass).trim() : prop.cssClass;
            control.cssClass = prop.cssClass;
        }
        delete prop.open;
        delete prop.click;
        delete prop.close;
        delete prop.beforeClose;
        control.setProperties(prop);
        if (prop.content) { this.setContent(itemProp.item, control); }
    }
    /**
     * Updated SplitButton size
     *
     * @param {HTMLElement} element - Gets the splibutton element.
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @returns {void}
     * @hidden
     */
    public updateSplitButtonSize(element: HTMLElement, item: RibbonItemModel): void {
        const control: SplitButton = getComponent(element, SplitButton);
        let cssClass: string[] = control.cssClass.split(SPACE);
        if (item.activeSize === RibbonItemSize.Large) {
            cssClass.push(VERTICAL_DDB);
        } else {
            cssClass = cssClass.filter((value: string) => value !== VERTICAL_DDB);
        }
        control.cssClass = cssClass.join(SPACE);
        control.setProperties({ iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left' });
        this.setContent(item, control);
    }
}
