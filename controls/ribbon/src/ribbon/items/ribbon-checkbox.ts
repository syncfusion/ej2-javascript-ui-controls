import { getComponent, merge } from '@syncfusion/ej2-base';
import { ChangeEventArgs, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { itemProps, Ribbon, getItem, getItemElement, RIBBON_CONTROL, SPACE, RIBBON_POPUP_CONTROL } from '../base/index';
import { RibbonCheckBoxSettingsModel, RibbonItemModel } from '../models/index';

/**
 * Defines the items of Ribbon.
 */
export class RibbonCheckBox {
    private parent: Ribbon;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonCheckBox';
    }
    protected destroy(): void {
        this.parent = null;
    }
    /**
     * Creates the check box.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createCheckBox(item: RibbonItemModel, itemEle: HTMLElement): void {
        const inputEle: HTMLInputElement = this.parent.createElement('input', {
            id: item.id
        });
        itemEle.appendChild(inputEle);
        const checkBoxSettings: RibbonCheckBoxSettingsModel = item.checkBoxSettings;
        if (checkBoxSettings.htmlAttributes) {
            if (checkBoxSettings.htmlAttributes.id) {
                delete checkBoxSettings.htmlAttributes.id;
            }
        }
        new CheckBox({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            checked: checkBoxSettings.checked,
            cssClass: (RIBBON_CONTROL + SPACE + (checkBoxSettings.cssClass ? checkBoxSettings.cssClass : '')).trim(),
            label: checkBoxSettings.label,
            labelPosition: checkBoxSettings.labelPosition,
            disabled: item.disabled,
            created: checkBoxSettings.created,
            htmlAttributes: checkBoxSettings.htmlAttributes,
            change: (e: ChangeEventArgs) => {
                if (checkBoxSettings.change) { checkBoxSettings.change.call(this, e); }
            }
        }, inputEle);
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
        const inputEle: HTMLElement = itemEle.querySelector('#' + item.id);
        inputEle.setAttribute('data-control', item.type.toString());
        const checkBoxObj: CheckBox = getComponent(inputEle, CheckBox);
        checkBoxObj.cssClass = checkBoxObj.cssClass + SPACE + RIBBON_POPUP_CONTROL;
        checkBoxObj.dataBind();
        checkBoxObj.change = (e: ChangeEventArgs) => {
            if (item.checkBoxSettings.change) { item.checkBoxSettings.change.call(this, e); }
            if (overflowButton.element.classList.contains('e-active')) {
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
        const inputEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const checkBoxObj: CheckBox = getComponent(inputEle, CheckBox);
        let cssClass: string[] = checkBoxObj.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);
        checkBoxObj.cssClass = cssClass.join(SPACE);
        checkBoxObj.dataBind();
        checkBoxObj.change = (e: ChangeEventArgs) => {
            if (item.checkBoxSettings.change) { item.checkBoxSettings.change.call(this, e); }
        };
    }
    /**
     * Triggers the click action on the Checkbox.
     *
     * @param {string} controlId - Gets the control ID.
     * @returns {void}
     */
    public click(controlId: string): void {
        const inputEle: HTMLElement = getItemElement(this.parent, controlId);
        if (!inputEle) { return; }
        const checkBoxObj: CheckBox = getComponent(inputEle, CheckBox);
        if (!checkBoxObj.disabled) {
            checkBoxObj.click();
        }
    }
    /**
     * Updates the checkbox.
     *
     * @param {RibbonCheckBoxSettingsModel} prop - Gets the checkbox property.
     * @param {string} id - Gets the ID of checkbox.
     * @returns {void}
     */
    public updateCheckBox(prop: RibbonCheckBoxSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.checkBoxSettings, prop);
        const inputEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!inputEle) { return; }
        if (prop.cssClass) { prop.cssClass = (RIBBON_CONTROL + SPACE + prop.cssClass).trim(); }
        delete prop.change;
        const checkBoxObj: CheckBox = getComponent(inputEle, CheckBox);
        checkBoxObj.setProperties(prop);
    }
}
