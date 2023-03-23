import { closest, getComponent, isNullOrUndefined, merge, remove } from '@syncfusion/ej2-base';
import { BeforeOpenCloseMenuEventArgs, DropDownButton, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Tooltip } from '@syncfusion/ej2-popups';
import { getItem, Ribbon, itemProps, getItemElement, RibbonItemSize, createTooltip } from '../base/index';
import { RibbonDropDownSettingsModel, RibbonItemModel } from '../models/index';
import { DROPDOWN_ID, ITEM_VERTICAL_CENTER, OVERFLOW_ID, RIBBON_CONTROL, RIBBON_GROUP_OVERFLOW_DDB, RIBBON_POPUP_CONTROL, SPACE, VERTICAL_DDB } from '../base/constant';


/**
 * Defines the items of Ribbon.
 */
export class RibbonDropDown {
    private parent: Ribbon

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonDropDown';
    }
    protected destroy(): void {
        this.parent = null;
    }
    /**
     * Creates DropDown.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createDropDown(item: RibbonItemModel, itemEle: HTMLElement): void {
        const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
            id: item.id
        });
        itemEle.appendChild(buttonEle);
        const dropDownSettings: RibbonDropDownSettingsModel = item.dropDownSettings;
        const cssClass: string = (ITEM_VERTICAL_CENTER + SPACE + RIBBON_CONTROL + SPACE + (dropDownSettings.cssClass ?
            dropDownSettings.cssClass : '')).trim();
        new DropDownButton({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left',
            closeActionEvents: dropDownSettings.closeActionEvents,
            content: item.activeSize === RibbonItemSize.Small ? '' : dropDownSettings.content,
            cssClass: cssClass + ((item.activeSize === RibbonItemSize.Large) ? (SPACE + VERTICAL_DDB) : ''),
            disabled: item.disabled,
            iconCss: dropDownSettings.iconCss,
            items: dropDownSettings.items,
            target: dropDownSettings.target,
            beforeClose: dropDownSettings.beforeClose,
            beforeItemRender: dropDownSettings.beforeItemRender,
            beforeOpen: dropDownSettings.beforeOpen,
            close: (e: OpenCloseMenuEventArgs) => {  
                if (dropDownSettings.close) { dropDownSettings.close.call(this, e); }
            },
            created: dropDownSettings.created,
            open: dropDownSettings.open,
            select: dropDownSettings.select
        }, buttonEle);
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
        const dropdownElement: HTMLElement = itemEle.querySelector('#' + item.id);
        const dropdown: DropDownButton = getComponent(dropdownElement, DropDownButton);
        dropdown.cssClass = dropdown.cssClass + SPACE + RIBBON_POPUP_CONTROL;
        dropdown.dataBind();
        dropdown.close = (e: OpenCloseMenuEventArgs) => {  
            if (item.dropDownSettings.close) { item.dropDownSettings.close.call(this, e); }
            overflowButton.toggle();
        };
    }
    /**
     * Removes the additional event handlers as the item moved from overflow popup.
     * 
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @param {DropDownButton} overflowButton - Gets the overflow button.
     * @returns {void}
     * @hidden
     */
    public removeOverFlowEvents(item: RibbonItemModel, itemEle: HTMLElement): void {
        const dropdownElement: HTMLElement = itemEle.querySelector('#' + item.id);
        const dropdown: DropDownButton = getComponent(dropdownElement, DropDownButton);
        let cssClass: string[] = dropdown.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);      
        dropdown.cssClass = cssClass.join(SPACE);
        dropdown.dataBind();
        dropdown.close = (e: OpenCloseMenuEventArgs) => {  
            if (item.dropDownSettings.close) { item.dropDownSettings.close.call(this, e); }
        };
    }
    /**
     * Creates Overflow DropDown.
     *
     * @param {string} id - Gets the ID of the dropdown item.
     * @param {string} name - Gets the name of the dropdown item.
     * @param {string} iconCss - Gets the icon of the dropdown item.
     * @param {HTMLElement} groupEle - Gets the overflow group element.
     * @param {HTMLElement} overflowEle - Gets the overflow element.
     * @returns {void}
     * @hidden
     */
    public createOverFlowDropDown(id: string, name: string, iconCss: string, groupEle: HTMLElement, overflowEle: HTMLElement): DropDownButton {
        const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
            id: id + OVERFLOW_ID + DROPDOWN_ID
        });
        overflowEle.appendChild(buttonEle);
        const dropdown: DropDownButton = new DropDownButton({
            iconCss: iconCss,
            target: groupEle,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            cssClass: VERTICAL_DDB + SPACE + RIBBON_GROUP_OVERFLOW_DDB,
            iconPosition: 'Top',
            content: name,
            beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
              args.cancel = !isNullOrUndefined(args.event && closest(args.event.target as HTMLElement, '.' + RIBBON_POPUP_CONTROL));
            }
        }, buttonEle);
        createTooltip(groupEle, this.parent);
        return dropdown;
    }
    /**
     * Removes Overflow DropDown.
     *
     * @param {HTMLElement} dropdownElement - Gets the ribbon DropDown element.
     * @returns {void}
     * @hidden
     */
    public removeOverFlowDropDown(dropdownElement: HTMLElement): void {
        const dropdown: DropDownButton = getComponent(dropdownElement, DropDownButton);
        const tooltip: Tooltip = getComponent(dropdown.target as HTMLElement, Tooltip);
        tooltip.destroy();
        dropdownElement.parentElement.parentElement.insertBefore(dropdown.target as HTMLElement, dropdownElement.parentElement);
        dropdown.destroy();
        remove(dropdownElement);
    }

    /**
     * Gets DropDown item element.
     *
     * @param {HTMLElement} dropdownElement - Gets the ribbon DropDown element.
     * @param {string} id - Gets the ID of ribbon DropDown element.
     * @returns {HTMLElement} - Returns the DropDown item element.
     * @hidden
     */
    public getDDBItemElement(dropdownElement: HTMLElement, id: string): HTMLElement {
        const dropdown: DropDownButton = getComponent(dropdownElement, DropDownButton);
        const dropDownPopup: HTMLElement = dropdown.dropDown.element;
        return dropDownPopup.querySelector('#' + id);
    }

    /**
     * Gets Overflow DropDown Popup.
     *
     * @param {itemProps} itemProp - Gets the property of ribbon item.
     * @param {HTMLElement} contentEle - Gets the content element.
     * @returns {HTMLElement} - Returns the Overflow DropDown Popup.
     * @hidden
     */
    public getOverflowDropDownPopup(itemProp: itemProps, contentEle: HTMLElement): HTMLElement {
        const dropdownElement: HTMLElement = contentEle.querySelector('#' + this.parent.tabs[itemProp.tabIndex].groups[itemProp.groupIndex].id + OVERFLOW_ID + DROPDOWN_ID);
        const dropdown: DropDownButton = getComponent(dropdownElement, DropDownButton);
        return dropdown.dropDown.element;
    }

    private getDropDownObj(controlId: string): DropDownButton {
        const dropDownEle: HTMLElement = getItemElement(this.parent, controlId);
        return dropDownEle ? getComponent(dropDownEle, DropDownButton) : null;
    }
    /**
     * Adds a new item to the menu. By default, new item appends to
     * the list as the last item, but you can insert based on the text parameter.
     *
     * @param {string} controlId - Gets the control ID.
     * @param {ItemModel[]} Items - Gets the DropDown items.
     * @param {string} text - Gets the text of the dropdown item where the new item needs to be inserted.
     * @returns {void}
     */
    public addItems(controlId: string, Items: ItemModel[], text?: string): void {
        this.getDropDownObj(controlId).addItems(Items, text);
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
        this.getDropDownObj(controlId).removeItems(Items, isUniqueId);
    }
    /**
     * To open/close DropDownButton popup based on current state of the DropDownButton.
     *
     * @param {string} controlId - Gets the control ID.
     * @returns {void}
     */
    public toggle(controlId: string): void {
        this.getDropDownObj(controlId).toggle();
    }
    /**
     * Updates the dropdown.
     *
     * @param {RibbonDropDownSettingsModel} prop - Gets the dropdown property.
     * @param {string} id - Gets the ID of dropdown.
     * @returns {void}
     */
    public updateDropDown(prop: RibbonDropDownSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.dropDownSettings, prop);
        const btnEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!btnEle) { return; }
        const control: DropDownButton = getComponent(btnEle, DropDownButton);
        if (prop.cssClass) {
            prop.cssClass = (RIBBON_CONTROL + SPACE + ITEM_VERTICAL_CENTER + SPACE + prop.cssClass).trim();
            prop.cssClass = itemProp.item.activeSize === RibbonItemSize.Large ?
                (VERTICAL_DDB + SPACE + prop.cssClass).trim() : prop.cssClass;
            control.cssClass = prop.cssClass;
        }
        delete prop.close;
        if (prop.content) { prop.content = itemProp.item.activeSize === RibbonItemSize.Small ? '' : prop.content; }
        control.setProperties(prop);
    }
    /**
     * Updated DropDown size
     *
     * @param {HTMLElement} element - Gets the dropdown element.
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @returns {void}
     * @hidden
     */
    public updateDropDownSize(element: HTMLElement, item: RibbonItemModel): void {
        const control: DropDownButton = getComponent(element, DropDownButton);
        let cssClass: string[] = control.cssClass.split(SPACE);
        if (item.activeSize === RibbonItemSize.Large) {
            cssClass.push(VERTICAL_DDB);
        } else {
            cssClass = cssClass.filter((value: string) => value !== VERTICAL_DDB);
        }
        control.cssClass = cssClass.join(SPACE);
        control.setProperties({ iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left' });
        control.setProperties({ content: item.activeSize === RibbonItemSize.Small ? '' : item.dropDownSettings.content });
    }
}
