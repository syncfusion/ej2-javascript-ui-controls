import { getComponent, merge } from '@syncfusion/ej2-base';
import { ComboBox, FieldSettingsModel, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { RibbonComboBoxSettingsModel, RibbonItemModel } from '../models/index';
import { itemProps, getItem, Ribbon, getItemElement, RIBBON_CONTROL, SPACE, RIBBON_POPUP_CONTROL } from '../base/index';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the items of Ribbon.
 */
export class RibbonComboBox {
    private parent: Ribbon;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonComboBox';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates the combobox.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createComboBox(item: RibbonItemModel, itemEle: HTMLElement): void {
        const inputEle: HTMLInputElement = this.parent.createElement('input', {
            id: item.id
        });
        itemEle.appendChild(inputEle);
        const comboBoxSettings: RibbonComboBoxSettingsModel = item.comboBoxSettings;
        let htmlAttr: { [key: string]: string } = {};
        if (comboBoxSettings.htmlAttributes) {
            htmlAttr = { ...comboBoxSettings.htmlAttributes };
            if (htmlAttr.id) {
                delete htmlAttr.id;
            }
        }
        new ComboBox({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            allowCustom: false,
            floatLabelType: 'Never',
            ignoreAccent: true,
            ignoreCase: true,
            allowFiltering: comboBoxSettings.allowFiltering,
            autofill: comboBoxSettings.autofill,
            cssClass: (RIBBON_CONTROL + SPACE + (comboBoxSettings.cssClass ? comboBoxSettings.cssClass : '')).trim(),
            dataSource: comboBoxSettings.dataSource,
            enabled: !item.disabled,
            fields: comboBoxSettings.fields,
            filterType: comboBoxSettings.filterType,
            footerTemplate: comboBoxSettings.footerTemplate as string | Function,
            groupTemplate: comboBoxSettings.groupTemplate as string | Function,
            headerTemplate: comboBoxSettings.headerTemplate as string | Function,
            index: comboBoxSettings.index,
            itemTemplate: comboBoxSettings.itemTemplate as string | Function,
            noRecordsTemplate: comboBoxSettings.noRecordsTemplate as string | Function,
            placeholder: comboBoxSettings.placeholder,
            popupHeight: comboBoxSettings.popupHeight,
            popupWidth: comboBoxSettings.popupWidth,
            showClearButton: comboBoxSettings.showClearButton,
            sortOrder: comboBoxSettings.sortOrder,
            text: comboBoxSettings.text,
            value: comboBoxSettings.value,
            width: comboBoxSettings.width,
            beforeOpen: comboBoxSettings.beforeOpen,
            open: comboBoxSettings.open,
            htmlAttributes: htmlAttr,
            close: (e: PopupEventArgs) => {
                if (comboBoxSettings.close) { comboBoxSettings.close.call(this, e); }
            },
            filtering: comboBoxSettings.filtering,
            change: comboBoxSettings.change,
            select: comboBoxSettings.select,
            created: comboBoxSettings.created
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
        const comboBoxSettings: RibbonComboBoxSettingsModel = item.comboBoxSettings;
        if (comboBoxSettings.label && this.parent.activeLayout === 'Simplified') {
            const label: HTMLElement = this.parent.createElement('div', {
                className: 'e-ribbon-combobox-label',
                id: item.id + '_label',
                innerHTML: comboBoxSettings.label
            });
            itemEle.insertBefore(label, itemEle.firstChild);
        }
        const inputEle: HTMLElement = itemEle.querySelector('#' + item.id);
        inputEle.setAttribute('data-control', item.type.toString());
        const comboBoxObj: ComboBox = getComponent(inputEle, ComboBox);
        comboBoxObj.setProperties({ cssClass: comboBoxObj.cssClass + SPACE + RIBBON_POPUP_CONTROL });
        comboBoxObj.close = (e: PopupEventArgs) => {
            const target: HTMLElement = (e.event as MouseEvent) ? (e.event as MouseEvent).target as HTMLElement : null;
            if (item.comboBoxSettings.close) { item.comboBoxSettings.close.call(this, e); }
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
        const comboBoxSettings: RibbonComboBoxSettingsModel = item.comboBoxSettings;
        if (comboBoxSettings.label) {
            const label: HTMLElement = itemEle.querySelector('#' + item.id + '_label');
            if (label) {
                label.remove();
            }
        }
        const inputEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const comboBoxObj: ComboBox = getComponent(inputEle, ComboBox);
        let cssClass: string[] = comboBoxObj.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);
        comboBoxObj.setProperties({ cssClass: cssClass.join(SPACE) });
        comboBoxObj.close = (e: PopupEventArgs) => {
            if (item.comboBoxSettings.close) { item.comboBoxSettings.close.call(this, e); }
        };
    }
    private getComboBoxObj(controlId: string): ComboBox {
        const inputEle: HTMLElement = getItemElement(this.parent, controlId);
        return inputEle ? getComponent(inputEle, ComboBox) : null;
    }
    /**
     * To filter the data from given data source by using query
     *
     * @param  {string } controlId - set the id of the control in which methods needs to be called.
     * @param  {Object[] } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}
     */
    public filter(
        controlId: string,
        dataSource: { [key: string]: Object }[] | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.getComboBoxObj(controlId).filter(dataSource, query, fields);
    }
    /**
     * To open/close DropDownButton popup based on current state of the combobox.
     *
     * @param {string} controlId - Gets the id of the control.
     * @returns {void}
     */
    public hidePopup(controlId: string): void {
        const comboBoxObj: ComboBox = this.getComboBoxObj(controlId);
        if (!comboBoxObj) { return; }
        comboBoxObj.hidePopup();
    }
    /**
     * To open/close DropDownButton popup based on current state of the combobox.
     *
     * @param {string} controlId - Gets the id of the control.
     * @returns {void}
     */
    public showPopup(controlId: string): void {
        const comboBoxObj: ComboBox = this.getComboBoxObj(controlId);
        if (!comboBoxObj) { return; }
        comboBoxObj.showPopup();
    }
    /**
     * Updates the combobox properties.
     *
     * @param {RibbonComboBoxSettingsModel} prop - Gets the combobox property.
     * @param {string} id - Gets the ID of combobox.
     * @returns {void}
     */
    public updateComboBox(prop: RibbonComboBoxSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.comboBoxSettings, prop);
        const inputEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!inputEle) { return; }
        if (prop.cssClass) { prop.cssClass = (RIBBON_CONTROL + SPACE + prop.cssClass).trim(); }
        delete prop.close;
        const comboBoxObj: ComboBox = getComponent(inputEle, ComboBox);
        comboBoxObj.setProperties(prop);
    }
}
