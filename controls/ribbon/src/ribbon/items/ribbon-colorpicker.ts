import { EventHandler, getComponent, merge } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { itemProps, Ribbon, getItem, getItemElement, setCustomAttributes } from '../base/index';
import { RibbonItemModel, RibbonColorPickerSettingsModel } from '../models/index';
import { RIBBON_CONTROL, RIBBON_HOVER, RIBBON_POPUP_CONTROL, RIBBON_POPUP_OPEN, SPACE } from '../base/constant';
import { BeforeOpenCloseMenuEventArgs, DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the items of Ribbon.
 */
export class RibbonColorPicker {
    private parent: Ribbon

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonColorPicker';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates the colorpicker.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createColorPicker(item: RibbonItemModel, itemEle: HTMLElement): void {
        const inputEle: HTMLInputElement = this.parent.createElement('input', {
            id: item.id
        });
        itemEle.appendChild(inputEle);
        const colorPickerSettings: RibbonColorPickerSettingsModel = item.colorPickerSettings;
        const colorPicker: ColorPicker = new ColorPicker({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            columns: colorPickerSettings.columns,
            cssClass: (RIBBON_CONTROL + SPACE + (colorPickerSettings.cssClass ? colorPickerSettings.cssClass : '')).trim(),
            disabled: item.disabled,
            enableOpacity: colorPickerSettings.enableOpacity,
            mode: colorPickerSettings.mode,
            modeSwitcher: colorPickerSettings.modeSwitcher,
            noColor: colorPickerSettings.noColor,
            presetColors: colorPickerSettings.presetColors,
            showButtons: colorPickerSettings.showButtons,
            value: colorPickerSettings.value,
            beforeClose: () => {
                colorPicker.element.parentElement.classList.remove(RIBBON_POPUP_OPEN);
                if (colorPickerSettings.beforeClose) {
                    colorPickerSettings.beforeClose.call(this);
                }
            },
            beforeOpen: colorPickerSettings.beforeOpen,
            beforeTileRender: colorPickerSettings.beforeTileRender,
            created: colorPickerSettings.created,
            change: colorPickerSettings.change,
            open: () => {
                colorPicker.element.parentElement.classList.add(RIBBON_POPUP_OPEN);
                if (colorPickerSettings.open) {
                    colorPickerSettings.open.call(this);
                }
            },
            select: colorPickerSettings.select
        }, inputEle);
        if (colorPickerSettings.htmlAttributes) {
            setCustomAttributes(inputEle, colorPickerSettings.htmlAttributes);
        }
        const wrapper: HTMLElement = colorPicker.element.parentElement;
        EventHandler.add(wrapper, 'mouseenter', this.toggleWrapperHover.bind(this, wrapper, true), this);
        EventHandler.add(wrapper, 'mouseleave', this.toggleWrapperHover.bind(this, wrapper, false), this);
    }

    private toggleWrapperHover(wrapper: HTMLElement, isAdd: boolean): void {
        if (isAdd) {
            wrapper.classList.add(RIBBON_HOVER);
        } else {
            wrapper.classList.remove(RIBBON_HOVER);
        }
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
        let colorPickerSettings: RibbonColorPickerSettingsModel = item.colorPickerSettings;
        if (colorPickerSettings.label && this.parent.activeLayout === 'Simplified') {
            const label: HTMLElement = this.parent.createElement('div', {
                className: 'e-ribbon-colorpicker-label',
                id: item.id + '_label',
                innerHTML: colorPickerSettings.label
            });
            itemEle.insertBefore(label, itemEle.firstChild);
        }
        const colorPickerEle: HTMLElement = itemEle.querySelector('#' + item.id);
        colorPickerEle.setAttribute('data-control', item.type.toString());
        const colorPickerObj: ColorPicker = getComponent(colorPickerEle, ColorPicker);
        colorPickerObj.setProperties({ cssClass: colorPickerObj.cssClass + SPACE + RIBBON_POPUP_CONTROL });
        //Accessing the private property 'splitBtn' of ColorPicker component to get the colorpicker instance as there is no close event in colorpicker.
        const splitBtn: SplitButton = (colorPickerObj['splitBtn'] as SplitButton);
        let target: HTMLElement;
        colorPickerObj.beforeClose = (e: BeforeOpenCloseMenuEventArgs) => {
            target = e.event ? e.event.target as HTMLElement : null;
            colorPickerObj.element.parentElement.classList.remove(RIBBON_POPUP_OPEN);
            if (item.colorPickerSettings.beforeClose) {
                item.colorPickerSettings.beforeClose.call(this);
            }
        };
        splitBtn.close = () => {
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
        let colorPickerSettings: RibbonColorPickerSettingsModel = item.colorPickerSettings;
        if (colorPickerSettings.label) {
            const label: HTMLElement = itemEle.querySelector('#' + item.id + '_label');
            if (label) {
                label.remove();
            }
        }
        const colorPickerEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const colorPickerObj: ColorPicker = getComponent(colorPickerEle, ColorPicker);
        let cssClass: string[] = colorPickerObj.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);
        colorPickerObj.setProperties({ cssClass: cssClass.join(SPACE) });
        const splitBtn: SplitButton = (colorPickerObj['splitBtn'] as SplitButton);
        //Accessing the private property 'splitBtn' of ColorPicker component to get the colorpicker instance as there is no close event in colorpicker.
        splitBtn.close = null;
        colorPickerObj.beforeClose = () => {
            colorPickerObj.element.parentElement.classList.remove(RIBBON_POPUP_OPEN);
            if (item.colorPickerSettings.beforeClose) {
                item.colorPickerSettings.beforeClose.call(this);
            }
        };
    }

    private getColorPickerObj(controlId: string): ColorPicker {
        const inputEle: HTMLElement = getItemElement(this.parent, controlId);
        return inputEle ? getComponent(inputEle, ColorPicker) : null;
    }
    /**
     * Gets color value in specified type.
     *
     * @param {string} controlId -Gets the control ID.
     * @param {string} value - Specify the color value.
     * @param {string} type - Specify the type to which the specified color needs to be converted.
     * @returns {string} - Returns string.
     */
    public getValue(controlId: string, value?: string, type?: string): string {
        const colorPickerObj: ColorPicker = this.getColorPickerObj(controlId);
        return colorPickerObj ? colorPickerObj.getValue(value, type) : '';
    }
    /**
     * To show/hide ColorPicker popup based on current state of the SplitButton.
     *
     * @param {string} controlId - set the id of the control.
     * @returns {void} - Returns void.
     */
    public toggle(controlId: string): void {
        const colorPickerObj: ColorPicker = this.getColorPickerObj(controlId);
        if (!colorPickerObj) { return; }
        colorPickerObj.toggle();
    }
    /**
     * Updates the colorpicker properties.
     *
     * @param {RibbonColorPickerSettingsModel} prop - Gets the colorpicker property.
     * @param {string} id - Gets the ID of colorpicker.
     * @returns {void}
     */
    public updateColorPicker(prop: RibbonColorPickerSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.checkBoxSettings, prop);
        const inputEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!inputEle) { return; }
        if (prop.cssClass) { prop.cssClass = (RIBBON_CONTROL + SPACE + prop.cssClass).trim(); }
        delete prop.beforeClose;
        delete prop.open;
        const colorPickerObj: ColorPicker = getComponent(inputEle, ColorPicker);
        colorPickerObj.setProperties(prop);
    }

    /**
     * @param {HTMLElement} element - Gets the colorpicker element to be destroyed.
     * @returns {void}
     * @hidden
     */
    public unwireColorPickerEvents(element: HTMLElement): void {
        const colorPickerObj: ColorPicker = getComponent(element, ColorPicker);
        const wrapper: HTMLElement = colorPickerObj.element.parentElement;
        EventHandler.remove(wrapper, 'mouseenter', this.toggleWrapperHover);
        EventHandler.remove(wrapper, 'mouseleave', this.toggleWrapperHover);
    }
}
