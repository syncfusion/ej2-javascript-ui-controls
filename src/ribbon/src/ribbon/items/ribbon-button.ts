import { getComponent, merge } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { getItem, getItemElement, itemProps, Ribbon, RibbonItemSize, setCustomAttributes } from '../base/index';
import { ITEM_VERTICAL_CENTER, RIBBON_CONTROL, RIBBON_POPUP_CONTROL, SPACE } from '../base/constant';
import { RibbonButtonSettingsModel, RibbonItemModel } from '../models/index';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the items of Ribbon.
 */
export class RibbonButton {
    private parent: Ribbon;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonButton';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates button.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createButton(item: RibbonItemModel, itemEle: HTMLElement): void {
        const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
            id: item.id
        });
        itemEle.appendChild(buttonEle);
        const btnSettings: RibbonButtonSettingsModel = item.buttonSettings;
        new Button({
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left',
            iconCss: btnSettings.iconCss,
            disabled: item.disabled,
            cssClass: (ITEM_VERTICAL_CENTER + SPACE + RIBBON_CONTROL + SPACE + (btnSettings.cssClass ? btnSettings.cssClass : '')).trim(),
            content: item.activeSize === RibbonItemSize.Small ? '' : btnSettings.content,
            isPrimary: btnSettings.isPrimary,
            isToggle: btnSettings.isToggle,
            created: btnSettings.created
        }, buttonEle);
        if (btnSettings.htmlAttributes) {
            if (btnSettings.htmlAttributes.id) {
                delete btnSettings.htmlAttributes.id;
            }
            setCustomAttributes(buttonEle, btnSettings.htmlAttributes);
        }
        buttonEle.onclick = (e: Event) => {
            if (btnSettings.clicked) { btnSettings.clicked.call(this, e); }
        };
        if (btnSettings.content) {
            buttonEle.setAttribute('aria-label', btnSettings.content);
        }
        else {
            buttonEle.setAttribute('aria-label', 'button');
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
        const buttonEle: HTMLElement = itemEle.querySelector('#' + item.id);
        buttonEle.setAttribute('data-control', item.type.toString());
        const buttonObj: Button = getComponent(buttonEle, Button);
        buttonObj.setProperties({ cssClass: buttonObj.cssClass + SPACE + RIBBON_POPUP_CONTROL });
        buttonEle.onclick = (e: Event) => {
            if (item.buttonSettings.clicked) { item.buttonSettings.clicked.call(this, e); }
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
        const buttonEle: HTMLElement = itemEle.querySelector('#' + item.id);
        const buttonObj: Button = getComponent(buttonEle, Button);
        let cssClass: string[] = buttonObj.cssClass.split(SPACE);
        cssClass = cssClass.filter((value: string) => value !== RIBBON_POPUP_CONTROL);
        buttonObj.setProperties({ cssClass: cssClass.join(SPACE) });
        buttonEle.onclick = (e: Event) => {
            if (item.buttonSettings.clicked) { item.buttonSettings.clicked.call(this, e); }
        };
    }

    /**
     * Triggers the click action on the button.
     *
     * @param {string} controlId - Gets the control ID.
     * @returns {void}
     */
    public click(controlId: string): void {
        const buttonEle: HTMLElement = getItemElement(this.parent, controlId);
        if (!buttonEle) { return; }
        const buttonObj: Button = getComponent(buttonEle, Button);
        if (!buttonObj.disabled) {
            buttonObj.click();
        }
    }
    /**
     * Updates the button properties.
     *
     * @param {RibbonButtonSettingsModel} prop - Gets the button property.
     * @param {string} id - Gets the ID of button item.
     * @returns {void}
     */
    public updateButton(prop: RibbonButtonSettingsModel, id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (!itemProp) { return; }
        merge(itemProp.item.buttonSettings, prop);
        const buttonEle: HTMLElement = getItemElement(this.parent, id, itemProp);
        if (!buttonEle) { return; }
        const buttonObj: Button = getComponent(buttonEle, Button);
        if (prop.isToggle) { buttonEle.classList.add('e-active'); }
        if (prop.cssClass) { prop.cssClass = (ITEM_VERTICAL_CENTER + SPACE + RIBBON_CONTROL + SPACE + prop.cssClass).trim(); }
        if (prop.content) {
            prop.content = itemProp.item.activeSize === RibbonItemSize.Small ? '' : prop.content;
            buttonEle.setAttribute('aria-label', prop.content);
        }
        delete prop.clicked;
        buttonObj.setProperties(prop);
    }
    /**
     * Updates the button size.
     *
     * @param {HTMLElement} element - Gets the button element.
     * @param {RibbonItemModel} item - Gets the ribbon item.
     * @returns {void}
     * @hidden
     */
    public updateButtonSize(element: HTMLElement, item: RibbonItemModel): void {
        const buttonObj: Button = getComponent(element, Button);
        buttonObj.setProperties({
            iconPosition: item.activeSize === RibbonItemSize.Large ? 'Top' : 'Left',
            content: item.activeSize === RibbonItemSize.Small ? '' : item.buttonSettings.content
        });
    }
}
