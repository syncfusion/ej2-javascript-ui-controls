import { remove, append, Component, EventHandler, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Menu, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BackStageMenu, BackStageMenuModel, BackstageItemClickArgs, BackstageItemModel } from '../models/index';
import { commonProperties, getIndex, Ribbon, ribbonTooltipData } from '../base/index';
import { getTemplateFunction, isTooltipPresent } from '../base/utils';
import * as constants from '../base/constant';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';

/**
 * Defines the items of Ribbon.
 */
export class RibbonBackstage extends Component<HTMLElement> {
    private parent: Ribbon;
    private backstageButton: Button;
    private popupEle: Popup;
    private menuCtrl: Menu;
    private footerMenuCtrl: Menu;
    private backstageButtonEle: HTMLButtonElement;
    private closeBtn: Button
    private popupHTMLElement: HTMLElement;
    private backstageContentEle: HTMLElement;
    private ulMenuElem: HTMLUListElement;
    private isBackButtonClicked: boolean;
    private menuWrapper: HTMLElement;
    private contentItem: BackstageItemModel;
    private backstageTempEle: HTMLElement;
    private itemsWrapperEle: HTMLElement;

    constructor(parent: Ribbon) {
        super();
        this.parent = parent;
    }

    /**
    * @private
    * @returns {void}
    */
    protected render(): void {
        // render code
    }

    /**
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        // pre render code
    }

    protected getPersistData(): string {
        return '';
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    protected onPropertyChanged(): void {
        // onProperty changes code
    }

    protected getModuleName(): string {
        return 'ribbonBackstage';
    }

    protected destroy(): void {
        if (this.backstageButton) {
            this.destroyDDB();
        }
        this.parent = null;
    }

    /**
     * Creates Backstage Menu
     *
     * @param {BackStageMenuModel} backStageOptions - Gets the property of backstage.
     * @returns {void}
     * @hidden
     */
    public createBackStage(backStageOptions: BackStageMenuModel): void {
        if (!backStageOptions.visible) {
            return;
        }
        this.backstageButtonEle = this.parent.createElement('button', {
            id: this.parent.element.id + constants.RIBBON_BACKSTAGE_MENU_ID
        });
        const tabEle: HTMLElement = this.parent.tabObj.element;
        const toolbarEle: HTMLElement = tabEle.querySelector('.e-toolbar');
        tabEle.insertBefore(this.backstageButtonEle, toolbarEle);
        this.backstageButton = new Button({
            content: backStageOptions.text,
            enableRtl: this.parent.enableRtl,
            cssClass: constants.RIBBON_BACKSTAGE,
            created: () => {
                tabEle.style.setProperty(constants.RIBBON_FILE_MENU_WIDTH, this.backstageButtonEle.offsetWidth + 'px');
            }
        }, this.backstageButtonEle);
        this.createBackStagePopup(backStageOptions);
        if (this.parent.backStageMenu.template) {
            this.createBackStageTemplate(this.parent.backStageMenu.template);
        } else {
            let footerItemCount: number = 0;
            let itemCount: number = 0;
            for (let i: number = 0; i < backStageOptions.items.length; i++) {
                const item: BackstageItemModel = backStageOptions.items[parseInt(i.toString(), 10)];
                if (item.isFooter) { footerItemCount++; }
                else { itemCount++; }
            }
            if (itemCount > 0) { this.createBackstageMenu(backStageOptions, false); }
            if (footerItemCount > 0) { this.createBackstageMenu(backStageOptions, true); }
            if (this.menuCtrl) { this.checkMenuItems(this.menuCtrl.items); }
            if (this.footerMenuCtrl) { this.checkMenuItems(this.footerMenuCtrl.items); }
        }
        this.backstageButtonEle.onclick = (e): void => {
            e.stopPropagation();
            this.showBackstage();
            this.popupHTMLElement.classList.add(constants.RIBBON_BACKSTAGE_OPEN);
            const menuItem: HTMLElement = this.menuWrapper.querySelector('.e-menu-item.e-selected');
            if (menuItem) { menuItem.classList.remove('e-selected'); }
            for (let i: number = 0; i < backStageOptions.items.length; i++) {
                const item: BackstageItemModel = backStageOptions.items[parseInt(i.toString(), 10)];
                if (!item.isFooter && this.menuCtrl.items[0].text === item.text) {
                    const firstMenuEle: HTMLElement = this.popupHTMLElement.querySelector('#' + this.menuCtrl.items[0].id);
                    if (firstMenuEle) {
                        firstMenuEle.classList.add('e-selected');
                        firstMenuEle.focus();
                    }
                    this.createBackStageContent(this.menuCtrl.items[0].id, item.content);
                    break;
                }
                else { continue; }
            }
        };
        this.parent.tabObj.refreshActiveTabBorder();
        this.addBackStageMenuTooltip(backStageOptions);
        EventHandler.add(document, 'click', this.onClickEvent, this);
    }

    private onClickEvent(e: MouseEvent): void {
        const targetEle: HTMLElement = e.target as HTMLElement;
        if (this.popupHTMLElement.contains(targetEle)) { return; }
        else { this.hideBackstage(); }
    }

    private addBackStageMenuTooltip(backStageOptions: BackStageMenuModel): void {
        if (isTooltipPresent(backStageOptions.ribbonTooltipSettings)) {
            this.backstageButtonEle.classList.add(constants.RIBBON_TOOLTIP_TARGET);
            this.parent.tooltipData.push({ id: this.backstageButtonEle.id, data: backStageOptions.ribbonTooltipSettings });
        }
    }

    private checkMenuItems(backStageItems: BackstageItemModel[]): void {
        for (let i: number = 0; i < backStageItems.length; i++) {
            const item: BackstageItemModel = backStageItems[parseInt(i.toString(), 10)];
            if (!item.iconCss) {
                const menuItemEle: HTMLElement = this.popupHTMLElement.querySelector('#' + item.id);
                menuItemEle.classList.add(constants.RIBBON_BACKSTAGE_TEXT_MENU);
            }
        }
    }

    private createBackStagePopup(backStageOptions: BackStageMenuModel): void {
        this.popupHTMLElement = this.parent.createElement('div', {
            id: this.parent.element.id + constants.RIBBON_BACKSTAGE_POPUP_ID,
            className: constants.RIBBON_BACKSTAGE_POPUP
        });
        let targetEle: HTMLElement;
        if (backStageOptions.target) {
            targetEle = backStageOptions.target instanceof HTMLElement ? backStageOptions.target : document.querySelector(backStageOptions.target);
            targetEle.appendChild(this.popupHTMLElement);
        }
        else {
            this.parent.element.appendChild(this.popupHTMLElement);
        }
        this.popupEle = new Popup(this.popupHTMLElement as HTMLElement, {
            height: backStageOptions.height,
            width: backStageOptions.width,
            relateTo: backStageOptions.target || this.parent.element,
            enableRtl: this.parent.enableRtl
        });
        if(this.parent.enableRtl) { this.updatePopupPositionOnRtl(this.parent.enableRtl); }
        this.popupHTMLElement.onkeydown = (e: KeyboardEventArgs) => { if (e.code === 'Escape') { this.hideBackstage(); } };
        this.hideBackstage();
    }

    private updatePopupPositionOnRtl (enableRtl: boolean): void {
        const popupStyle = this.popupHTMLElement.style;
        if (enableRtl) {
            popupStyle.right = popupStyle.left;
            popupStyle.left = 'unset'
        }
        else {
            popupStyle.left = popupStyle.right;
            popupStyle.right = 'unset'
        }
    }

    private createBackstageMenu(menuOptions: BackStageMenuModel, isFooter: boolean): void {
        const wrapperEle: HTMLElement = this.popupHTMLElement.querySelector('#' + this.parent.element.id + '_wrapper');
        if (!wrapperEle) {
            this.menuWrapper = this.parent.createElement('div', {
                id: this.parent.element.id + '_wrapper',
                className: constants.RIBBON_BACKSTAGE_MENU_WRAPPER
            });
            this.popupHTMLElement.appendChild(this.menuWrapper);
        }
        if (menuOptions.backButton.visible && !isFooter) {
            const closeBtnEle: HTMLButtonElement = this.parent.createElement('button', {
                id: this.parent.element.id + '_close',
                className: 'e-ribbon-close-btn'
            });
            this.closeBtn = new Button({
                content: menuOptions.backButton.text,
                iconCss: menuOptions.backButton.iconCss ? menuOptions.backButton.iconCss: constants.BACKSTAGE_CLOSE_ICON,
                enableRtl: this.parent.enableRtl
            }, closeBtnEle);
            this.menuWrapper.append(closeBtnEle);
            closeBtnEle.onclick = (): void => {
                this.popupHTMLElement.classList.remove(constants.RIBBON_BACKSTAGE_OPEN);
                this.hideBackstage();
                this.isBackButtonClicked = true;
            };
        }
        const itemsWrapperEle: HTMLElement = this.popupHTMLElement.querySelector('#' + this.parent.element.id + '_itemswrapper');
        if (!itemsWrapperEle) {
            this.itemsWrapperEle = this.parent.createElement('div', {
                id: this.parent.element.id + '_itemswrapper',
                className: constants.RIBBON_BACKSTAGE_ITEMS_WRAPPER
            });
            this.menuWrapper.append(this.itemsWrapperEle);
        }
        let ulFooterElem: HTMLUListElement;
        if (isFooter) {
            ulFooterElem = this.parent.createElement('ul', {
                id: this.parent.element.id + constants.RIBBON_FOOTER_MENU_LIST
            });
            this.itemsWrapperEle.appendChild(ulFooterElem);
        }
        else {
            this.ulMenuElem = this.parent.createElement('ul', {
                id: this.parent.element.id + constants.RIBBON_MENU_LIST
            });
            this.itemsWrapperEle.appendChild(this.ulMenuElem);
        }
        if (!isFooter) {
            this.menuCtrl = new Menu({
                orientation: 'Vertical',
                enableRtl: this.parent.enableRtl,
                cssClass: constants.RIBBON_BACKSTAGE_MENU,
                items: this.cloneMenuItem(menuOptions.items),
                select: this.menuSelect.bind(this, menuOptions)
            }, this.ulMenuElem);
        }
        else {
            this.footerMenuCtrl = new Menu({
                orientation: 'Vertical',
                enableRtl: this.parent.enableRtl,
                cssClass: constants.RIBBON_BACKSTAGE_MENU,
                items: this.cloneFooterMenuItem(menuOptions.items),
                select: this.menuSelect.bind(this, menuOptions)
            }, ulFooterElem);
        }
    }

    private cloneMenuItem(items: BackstageItemModel[]): BackstageItemModel[] {
        const itemsList: BackstageItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const item: BackstageItemModel = items[parseInt(i.toString(), 10)];
            if (item.isFooter) { continue; }
            else {
                itemsList.push({
                    id: item.id,
                    iconCss: item.iconCss,
                    separator: item.separator,
                    text: item.text
                });
            }
        }
        return itemsList;
    }

    private cloneFooterMenuItem(items: BackstageItemModel[]): BackstageItemModel[] {
        const itemsList: BackstageItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const item: BackstageItemModel = items[parseInt(i.toString(), 10)];
            if (!item.isFooter) { continue; }
            else {
                itemsList.push({
                    id: item.id,
                    iconCss: item.iconCss,
                    separator: item.separator,
                    text: item.text
                });
            }
        }
        return itemsList;
    }

    private createBackStageContent(itemId: string | Object, content: string | Function): string | Function {
        const templateName: string = 'backstageContent';
        this.clearTemplate([templateName]);
        if (!this.backstageContentEle) {
            this.backstageContentEle = this.parent.createElement('div', {
                id: itemId + constants.CONTENT_ID,
                className: constants.RIBBON_BACKSTAGE_CONTENT
            });
        }
        else {
            this.backstageContentEle.innerHTML = '';
            this.backstageContentEle.id = itemId + constants.CONTENT_ID;
        }
        const templateFunction: Function = getTemplateFunction(content);
        append(templateFunction({}, this, templateName, 'backstageContent', this.parent.isStringTemplate), this.backstageContentEle);
        if (content) {
            this.popupHTMLElement.append(this.backstageContentEle);
        }
        this.renderReactTemplates();
        return templateFunction;
    }

    private createBackStageTemplate(template: string | Function): string | Function {
        const templateName: string = 'backstageTemplate';
        this.clearTemplate([templateName]);
        this.backstageTempEle = this.parent.createElement('div', {
            id: this.parent.element.id + constants.RIBBON_BACKSTAGE_MENU_ID + '_template',
            className: constants.RIBBON_BACKSTAGE_TEMPLATE
        });
        const templateFunction: Function = getTemplateFunction(template);
        append(templateFunction({}, this, templateName, 'backstageTemplate', this.parent.isStringTemplate), this.backstageTempEle);
        this.popupHTMLElement.append(this.backstageTempEle);
        this.renderReactTemplates();
        return templateFunction;
    }

    private menuSelect(menuOptions: BackStageMenuModel, args: MenuEventArgs): void {
        for (let i: number = 0; i < menuOptions.items.length; i++) {
            const item: BackstageItemModel = menuOptions.items[parseInt(i.toString(), 10)];
            if (item.text === args.item.text) {
                this.contentItem = item;
                break;
            }
        }
        this.createBackStageContent(args.item.id, this.contentItem.content);
        const eventArgs: BackstageItemClickArgs = { cancel: false, target: args.element, item: this.contentItem, isBackButton: this.isBackButtonClicked };
        if (this.contentItem.backStageItemClick) { this.contentItem.backStageItemClick.call(this, eventArgs); }
        if (eventArgs.cancel) { return; }
    }

    /**
     * setRtl
     *
     * @param {commonProperties} commonProp - Get the common property of ribbon.
     * @returns {void}
     * @hidden
     */
    public setCommonProperties(commonProp: commonProperties): void {
        if (this.backstageButton) {
            this.backstageButton.setProperties(commonProp);
            if (this.popupEle) {
                this.popupEle.setProperties(commonProp);
                if (this.popupHTMLElement) this.updatePopupPositionOnRtl(commonProp.enableRtl);
                if (this.menuCtrl) {
                    this.menuCtrl.setProperties(commonProp);
                    if (this.closeBtn) {
                        this.closeBtn.setProperties(commonProp);
                    }
                }
                if (this.footerMenuCtrl) {
                    this.footerMenuCtrl.setProperties(commonProp);
                }
            }
        }
    }

    /**
     * Update Backstage menu
     *
     * @param {BackStageMenuModel} backStageOptions - Gets the property of backstage menu.
     * @returns {void}
     * @hidden
     */
    public updateBackStageMenu(backStageOptions: BackStageMenuModel): void {
        if (backStageOptions.visible) {
            if (this.backstageButton) {
                if (backStageOptions.text) {
                    this.backstageButton.setProperties({
                        content: backStageOptions.text
                    });
                    this.parent.tabObj.element.style.setProperty(constants.RIBBON_FILE_MENU_WIDTH, this.backstageButtonEle.offsetWidth + 'px');
                }
                if (this.popupEle) {
                    this.popupEle.setProperties({
                        height: backStageOptions.height,
                        width: backStageOptions.width,
                        target: backStageOptions.target || this.parent.element,
                    });
                }
                if (backStageOptions.template) {
                    if (this.backstageTempEle) {
                        remove(this.backstageTempEle);
                        this.backstageTempEle = null;
                    }
                    this.createBackStageTemplate(backStageOptions.template);
                }
                else {
                    if (this.menuCtrl) {
                        this.menuCtrl.setProperties({
                            items: this.cloneMenuItem(backStageOptions.items)
                        });
                    }
                    if (this.footerMenuCtrl) {
                        this.footerMenuCtrl.setProperties({
                            items: this.cloneFooterMenuItem(backStageOptions.items)
                        });
                    }
                    else {
                        let footerItemCount: number = 0;
                        let itemCount: number = 0;
                        for (let i: number = 0; i < backStageOptions.items.length; i++) {
                            const item: BackstageItemModel = backStageOptions.items[parseInt(i.toString(), 10)];
                            if (item.isFooter) { footerItemCount++; }
                            else { itemCount++; }
                        }
                        if (itemCount > 0) { this.createBackstageMenu(backStageOptions, false); }
                        if (footerItemCount > 0) { this.createBackstageMenu(backStageOptions, true); }
                    }
                }
                this.removeBackstageMenuTooltip();
                this.addBackStageMenuTooltip(backStageOptions);
            }
            else {
                this.createBackStage(backStageOptions);
            }
        }
        else if (this.backstageButton) {
            this.destroyDDB();
        }
        this.parent.tabObj.refreshActiveTabBorder();
    }

    private destroyMenu(): void {
        if (this.menuCtrl) {
            this.menuCtrl.destroy();
            this.menuCtrl = null;
        }
    }

    private destroyDDB(): void {
        this.removeBackstageMenuTooltip();
        const tabEle: HTMLElement = this.parent.tabObj.element;
        tabEle.style.removeProperty(constants.RIBBON_FILE_MENU_WIDTH);
        this.destroyMenu();
        this.backstageButton.destroy();
        this.backstageButton = null;
        remove(this.backstageButtonEle);
        this.backstageButtonEle = null;
        EventHandler.remove(document, 'click', this.onClickEvent);
    }

    private removeBackstageMenuTooltip(): void {
        const index: number = getIndex(this.parent.tooltipData, (e: ribbonTooltipData) => { return e.id === this.backstageButtonEle.id; });
        if (index !== -1) {
            this.backstageButtonEle.classList.remove(constants.RIBBON_TOOLTIP_TARGET);
            this.parent.tooltipData.splice(index, 1);
        }
    }

    /**
     * Add items to Backstage Menu.
     *
     * @param {BackstageItemModel[]} items - Gets the items to be added.
     * @param {string} target - Gets the target item to add the items.
     * @param {boolean} isAfter - Gets the boolean value to add the items after or before the target item.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public addBackstageItems(items: BackstageItemModel[], target: string, isAfter: boolean, isUniqueId?: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            const item: BackstageItemModel = items[parseInt(i.toString(), 10)];
            if (item.isFooter) {
                isAfter ? this.footerMenuCtrl.insertAfter(items, target, isUniqueId) : this.footerMenuCtrl.insertBefore(items, target, isUniqueId);
            }
            else {
                isAfter ? this.menuCtrl.insertAfter(items, target, isUniqueId) : this.menuCtrl.insertBefore(items, target, isUniqueId);
            }
        }
        const backstageItems = ([] as BackStageMenuModel[]).concat(this.menuCtrl.items, this.footerMenuCtrl.items);
        const backStageOptions: BackStageMenuModel = this.parent.backStageMenu;
        for (let i: number = 0; i < backStageOptions.items.length; i++) {
            const item: BackstageItemModel = backStageOptions.items[parseInt(i.toString(), 10)];
            for (let i: number = 0; i < backstageItems.length; i++) {
                const item1: BackstageItemModel = backstageItems[parseInt(i.toString(), 10)];
                if (item.text === item1.text) {
                    item1.content = item.content;
                    break;
                }
            }
        }
        (this.parent.backStageMenu as BackStageMenu).setProperties({ items: backstageItems }, true);
    }

    /**
     * Remove items from Backstage Menu.
     *
     * @param {string[]} items - Gets the items to be removed.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public removeBackstageItems(items: string[], isUniqueId?: boolean): void {
        this.menuCtrl.removeItems(items, isUniqueId);
        this.footerMenuCtrl.removeItems(items, isUniqueId);
        const backstageItems = ([] as BackStageMenuModel[]).concat(this.menuCtrl.items, this.footerMenuCtrl.items);
        (this.parent.backStageMenu as BackStageMenu).setProperties({ items: backstageItems }, true);
    }

    /**
     * Renders the backstage dynamically.
     *
     * @returns {void}
     */
    public showBackstage(): void {
        this.popupEle.show();
    }

    /**
     * Hides the backstage dynamically.
     *
     * @returns {void}
     */
    public hideBackstage(): void {
        if (this.popupEle.element.classList.contains(constants.RIBBON_BACKSTAGE_OPEN)) {
            this.popupEle.element.classList.remove(constants.RIBBON_BACKSTAGE_OPEN);
        }
        this.popupEle.hide();
    }
}
