import { KeyboardEventArgs, append, getComponent, remove, formatUnit, isNullOrUndefined, setValue } from '@syncfusion/ej2-base';
import { GalleryHoverEventArgs, GalleryItemEventArgs, GalleryPopupEventArgs, GallerySelectEventArgs, GalleryBeforeSelectEventArgs, getItem, getTemplateFunction, itemProps, Ribbon, setCustomAttributes } from '../base/index';
import { RibbonGalleryItemModel, RibbonGallerySettingsModel, RibbonItemModel } from '../models/index';
import { BeforeOpenCloseMenuEventArgs, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import * as constants from '../base/constant';
import { Popup } from '@syncfusion/ej2-popups';

/**
 * Defines the items of Ribbon.
 */
export class RibbonGallery {
    private parent: Ribbon;
    private count: number = 0;
    private isAdded: boolean = false;
    private galleryItemsIndex: number = 0;
    private registeredTemplate: Object = {};

    constructor(parent: Ribbon) {
        this.parent = parent;
        const ref: string = 'viewContainerRef';
        setValue('registeredTemplate', this.registeredTemplate, this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(ref, (this.parent as any)[`${ref}`], this);
    }
    protected getModuleName(): string {
        return 'ribbonGallery';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates gallery.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public createGallery(item: RibbonItemModel, itemEle: HTMLElement): void {
        const gallerySettings: RibbonGallerySettingsModel = item.gallerySettings;
        this.renderGalleryItems(gallerySettings, false, item.id, itemEle);
        const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
            id: item.id + '_popupButton',
            className: 'e-ribbon-gallery-button e-icons e-drop-icon'
        });
        buttonEle.setAttribute('aria-label', 'gallerydropdownbutton');
        itemEle.appendChild(buttonEle);
        this.createPopup(item, buttonEle);
        buttonEle.onclick = (args: Event) => {
            const popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            if (popupEle) {
                const popup: Popup = getComponent(popupEle, Popup);
                if (popupEle.classList.contains('e-popup-close')) { this.showPopup(popup, popupEle, args, gallerySettings, item.id); }
                else { this.hidePopup(popup, popupEle, args, gallerySettings, item.id); }
            }
        };
        document.onclick = (args: Event) => {
            const popupEle: NodeListOf<Element> = document.querySelectorAll('.e-ribbon-gallery-popup.e-popup-open');
            let popupID: string;
            let itemProp: itemProps;
            for (let i: number = 0; i < popupEle.length; i++) {
                const popup: Popup = getComponent(popupEle[parseInt(i.toString(), 10)] as HTMLElement, Popup);
                if ((args.target as HTMLElement).classList.contains('e-ribbon-gallery-button')) {
                    popupID = ((popupEle[parseInt(i.toString(), 10)] as HTMLElement).id).replace(/_galleryPopup/g, '');
                    if (((args.target as HTMLElement).id).replace(/_popupButton/g, '') !== popupID) {
                        itemProp = getItem(this.parent.tabs, popupID);
                        this.hidePopup(popup, popupEle[parseInt(i.toString(), 10)] as HTMLElement, args,
                                       itemProp.item.gallerySettings, popupID);
                        break;
                    }
                }
                else {
                    popupID = ((popupEle[parseInt(i.toString(), 10)] as HTMLElement).id).replace(/_galleryPopup/g, '');
                    itemProp = getItem(this.parent.tabs, popupID);
                    this.hidePopup(popup, popupEle[parseInt(i.toString(), 10)] as HTMLElement, args,
                                   itemProp.item.gallerySettings, popupID);
                    break;
                }
            }
        };
    }

    private renderGalleryItems(gallerySettings: RibbonGallerySettingsModel, isPopup: boolean, id: string, itemEle: HTMLElement): void {
        let galleryContainerEle: HTMLElement;
        let galleryEle: HTMLElement;
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        if (itemProp && itemProp.group) {
            itemProp.group.isCollapsible = false;
        }
        const galleryWrapper: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-gallery-wrapper',
            id: id + '_galleryWrapper'
        });
        if (!isPopup) {
            itemEle.appendChild(galleryWrapper);
        }
        for (let i: number = 0; i < gallerySettings.groups.length; i++) {
            let isHeightDefined: boolean = false;
            galleryContainerEle = this.parent.createElement('ol', {
                className: 'e-ribbon-gallery-container',
                id: id + '_galleryContainer' + i
            });
            if (gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight && gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight !== 'auto') {
                isHeightDefined = true;
            }
            if (gallerySettings.groups[parseInt(i.toString(), 10)].cssClass) {
                galleryContainerEle.classList.add(gallerySettings.groups[parseInt(i.toString(), 10)].cssClass);
            }
            for (let j: number = 0; j < gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                galleryEle = this.parent.createElement('li', {
                    className: 'e-ribbon-gallery-item',
                    id: (isPopup ? 'popup_' : '') + galleryContainerEle.id + '_gallery' + j,
                    attrs: { 'tabindex': '0' }
                });
                const itemEventArgs: GalleryItemEventArgs = { name: 'beforeItemRender', item: gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)] };
                if (gallerySettings.beforeItemRender) {
                    gallerySettings.beforeItemRender.call(this, itemEventArgs);
                }
                galleryContainerEle.appendChild(galleryEle);
                if (gallerySettings.selectedItemIndex && gallerySettings.selectedItemIndex === this.count) {
                    galleryEle.classList.add('e-ribbon-gallery-selected');
                }
                else {
                    if (!gallerySettings.selectedItemIndex && this.count === 0) {
                        galleryEle.classList.add('e-ribbon-gallery-selected');
                        gallerySettings.selectedItemIndex = this.count;
                    }
                }
                this.count = this.count + 1;
                galleryEle.onclick = (e: Event) => {
                    this.setActiveState(e.currentTarget as HTMLElement, gallerySettings, id, true, e, isPopup);
                };
                galleryEle.onkeydown = (e: Event) => {
                    if ((e as KeyboardEventArgs).key === 'Enter' || (e as KeyboardEventArgs).key === ' ') {
                        this.setActiveState(e.currentTarget as HTMLElement, gallerySettings, id, true, e, isPopup);
                    }
                };
                galleryEle.onmouseover = (e: Event) => {
                    const hoverEventArgs: GalleryHoverEventArgs = { event: e, name: 'itemHover', item: gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)] };
                    if (gallerySettings.itemHover) {
                        gallerySettings.itemHover.call(this, hoverEventArgs);
                    }
                };
                if (gallerySettings.groups[parseInt(i.toString(), 10)].itemWidth && gallerySettings.groups[parseInt(i.toString(), 10)].itemWidth !== 'auto') {
                    galleryEle.style.width = gallerySettings.groups[parseInt(i.toString(), 10)].itemWidth + 'px';
                }
                if (gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight && gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight !== 'auto') {
                    galleryEle.style.height = gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight + 'px';
                    if (this.parent.activeLayout !== 'Simplified' && !isPopup) {
                        galleryContainerEle.style.flexFlow = 'wrap';
                    }
                }
                if ((!gallerySettings.template && !gallerySettings.popupTemplate) ||
                ((gallerySettings.template && !gallerySettings.popupTemplate) && isPopup) ||
                ((gallerySettings.popupTemplate && !gallerySettings.template) && !isPopup)) {
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].htmlAttributes) {
                        setCustomAttributes(galleryEle, gallerySettings.groups[parseInt(i.toString(), 10)]
                            .items[parseInt(j.toString(), 10)].htmlAttributes);
                    }
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].iconCss) {
                        const iconEle: HTMLElement = this.parent.createElement('span', {
                            className: 'e-ribbon-gallery-icons' + ' ' + gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].iconCss
                        });
                        galleryEle.appendChild(iconEle);
                        if (this.parent.activeLayout === 'Simplified' && !isPopup) {
                            iconEle.classList.add('e-hidden');
                        }
                    }
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].content) {
                        galleryEle.appendChild(this.parent.createElement('span', {
                            innerHTML: gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].content,
                            className: 'e-ribbon-gallery-text'
                        }));
                    }
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].disabled) {
                        galleryEle.classList.add('e-disabled');
                    }
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].cssClass) {
                        galleryEle.classList.add(
                            gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].cssClass);
                    }
                }
                if (gallerySettings.template && !isPopup) {
                    this.createGalleryTemplate(galleryEle, gallerySettings, id,
                                               gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)]);
                }
                if (gallerySettings.popupTemplate && isPopup) {
                    this.createGalleryPopupTemplate(galleryEle, gallerySettings, id,
                                                    gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)]);
                }
                if ((!isPopup && !isHeightDefined && (gallerySettings.itemCount === this.count))) {
                    galleryWrapper.appendChild(galleryContainerEle);
                    this.isAdded = true;
                    break;
                }
            }
            if (this.isAdded && !isPopup) {
                break;
            }
            if (!isPopup) { galleryWrapper.appendChild(galleryContainerEle); }
            else { itemEle.appendChild(galleryContainerEle); }
            if (isPopup && gallerySettings.groups[parseInt(i.toString(), 10)].header) {
                const headerEle: HTMLElement = (this.parent.createElement('div', {
                    className: 'e-ribbon-gallery-header',
                    innerHTML: gallerySettings.groups[parseInt(i.toString(), 10)].header
                }));
                itemEle.insertBefore(headerEle, galleryContainerEle);
            }
        }
        this.count = 0;
        this.isAdded = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.parent as any).isReact) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.parent as any).portals = (this.parent as any).portals.concat((this as any)['portals']);
            this.parent['renderReactTemplates']();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any)['portals'] = undefined;
        }
    }

    private setWrapperWidth(itemCount: number, galleryWrapper: HTMLElement,
                            gallerySettings: RibbonGallerySettingsModel, itemID: string): void {
        let count: number = 1;
        let itemsWidth: number = 0;
        let isWidthApplied: boolean = false;
        for (let i: number = 0; i < gallerySettings.groups.length; i++) {
            for (let j: number = 0; j < gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                if (itemCount >= count) {
                    const galleryItemEle: HTMLElement = galleryWrapper.querySelector('#' + itemID + '_galleryContainer' + i + '_gallery' + j);
                    if (galleryItemEle) {
                        itemsWidth += galleryItemEle.offsetWidth;
                        const itemStyles: CSSStyleDeclaration = window.getComputedStyle(galleryItemEle);
                        if (itemStyles) {
                            const paddingWidth: number = parseFloat(itemStyles.paddingLeft) + parseFloat(itemStyles.paddingRight);
                            if (!(isNullOrUndefined(paddingWidth))) {
                                itemsWidth += paddingWidth;
                            }
                            const marginWidth: number = parseFloat(itemStyles.marginLeft) + parseFloat(itemStyles.marginRight);
                            if (!(isNullOrUndefined(marginWidth))) {
                                itemsWidth += marginWidth;
                            }
                        }
                    }
                }
                else {
                    isWidthApplied = true;
                    break;
                }
                count++;
            }
            if (isWidthApplied) {
                break;
            }
        }
        if (itemsWidth > 0) {
            galleryWrapper.style.width = itemsWidth + 'px'; }
    }

    private setWrapperStyle(popup: Popup, popupContainerItems: NodeListOf<Element>): void {
        if (popup.width !== 'auto') {
            popupContainerItems.forEach((ele: HTMLElement) => {
                ele.style.flexFlow = 'wrap';
            });
        }
    }

    /**
     * Checks the gallery items height.
     *
     * @param {HTMLElement} activeContent - Gets the current active content.
     * @returns {void}
     * @hidden
     */
    public checkAvailableHeight(activeContent: HTMLElement): void {
        const galleryWrapperItems: NodeListOf<Element> = activeContent.querySelectorAll('.e-ribbon-gallery-wrapper');
        for (let n: number = 0; n < galleryWrapperItems.length; n++) {
            let count: number = 0;
            let simplifiedItemsCount: number = 0;
            let isHeight: boolean = false;
            const galleryWrapper: HTMLElement = galleryWrapperItems[parseInt(n.toString(), 10)] as HTMLElement;
            const itemID: string = galleryWrapper.id.replace(/_galleryWrapper/g, '');
            let galleryWrapperHeight: number = galleryWrapper.offsetHeight;
            const itemProp: itemProps = getItem(this.parent.tabs, itemID);
            if (itemProp) {
                this.setWrapperWidth(itemProp.item.gallerySettings.itemCount, galleryWrapper, itemProp.item.gallerySettings, itemID);
                for (let i: number = 0; i < itemProp.item.gallerySettings.groups.length; i++) {
                    for (let j: number = 0; j < itemProp.item.gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                        const galleryItemEle: HTMLElement = galleryWrapper.querySelector('#' + itemID + '_galleryContainer' + i + '_gallery' + j);
                        if (galleryItemEle) {
                            if (this.parent.activeLayout === 'Classic') {
                                if (galleryItemEle.classList.contains('e-hidden')) {
                                    galleryItemEle.classList.remove('e-hidden');
                                }
                                if (!isHeight) {
                                    let itemsValues: number = 0;
                                    const itemStyles: CSSStyleDeclaration = window.getComputedStyle(galleryItemEle);
                                    if (itemStyles) {
                                        const marginWidth: number = parseFloat(itemStyles.marginTop) + parseFloat(itemStyles.marginBottom);
                                        if (!(isNullOrUndefined(marginWidth))) {
                                            itemsValues += marginWidth;
                                        }
                                    }
                                    count++;
                                    if (itemProp.item.gallerySettings.itemCount === count) {
                                        count = 0;
                                        if (galleryWrapperHeight >= (galleryItemEle.offsetHeight + itemsValues)) {
                                            galleryWrapperHeight -= (galleryItemEle.offsetHeight + itemsValues);
                                        }
                                        else {
                                            isHeight = true;
                                            galleryItemEle.remove();
                                        }
                                    }
                                    else if (galleryWrapperHeight < (galleryItemEle.offsetHeight + itemsValues)) {
                                        isHeight = true;
                                        galleryItemEle.remove();
                                    }
                                }
                                else {
                                    galleryItemEle.remove();
                                }
                            }
                            else {
                                simplifiedItemsCount++;
                                if (simplifiedItemsCount > itemProp.item.gallerySettings.itemCount) {
                                    galleryItemEle.classList.add('e-hidden');
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Checks the popup collision.
     *
     * @param {Popup} popup - Gets the popup.
     * @param {HTMLElement} popupEle - Gets the popup element.
     * @param {number} offsetValue - Gets the offset value of gallery popup button.
     * @returns {void}
     * @hidden
     */
    public checkCollision(popup: Popup, popupEle: HTMLElement, offsetValue: number = 0): void {
        let paddingWidth: number = 0;
        let marginWidth: number = 0;
        if (popupEle) {
            const windowWidth: number = window.innerWidth;
            let screenWidth: number = offsetValue === 0 ? windowWidth : Math.abs(windowWidth - (windowWidth - offsetValue));
            const paddingStyles: CSSStyleDeclaration = window.getComputedStyle(popupEle);
            if (paddingStyles) {
                paddingWidth = parseFloat(paddingStyles.paddingLeft) + parseFloat(paddingStyles.paddingRight);
                if (!(isNullOrUndefined(paddingWidth))) {
                    screenWidth = screenWidth - paddingWidth; }
            }
            const popupContainerItems: NodeListOf<Element> = popupEle.querySelectorAll('.e-ribbon-gallery-container');
            this.setWrapperStyle(popup, popupContainerItems);
            let isCollideOccurs: boolean = false;
            for (let i: number = 0; i < popupContainerItems.length; i++) {
                let itemsWidth: number = 0;
                for (let j: number = 0; j < (popupContainerItems[parseInt(i.toString(), 10)] as HTMLElement).querySelectorAll('.e-ribbon-gallery-item').length; j++) {
                    const popupItemStyles: CSSStyleDeclaration = window.getComputedStyle(popupContainerItems[parseInt(i.toString(), 10)].querySelectorAll('.e-ribbon-gallery-item')[parseInt(j.toString(), 10)] as HTMLElement);
                    if (popupItemStyles) {
                        marginWidth = parseFloat(popupItemStyles.marginLeft) + parseFloat(popupItemStyles.marginRight);
                        if (!(isNullOrUndefined(marginWidth))) {
                            itemsWidth += marginWidth; }
                    }
                    itemsWidth += Math.round(parseFloat(popupItemStyles.width));
                    if (((screenWidth <= itemsWidth) && popup.width === 'auto') || ((popup.width !== 'auto') && (screenWidth <= parseInt(popup.width.toString(), 10)) && (screenWidth <= itemsWidth)) ) {
                        popupEle.style.width = ((itemsWidth + Math.abs(paddingWidth - marginWidth)) - Math.round(parseFloat(popupItemStyles.width))) + 'px';
                        isCollideOccurs = true;
                        break;
                    }
                }
                if (isCollideOccurs) {
                    popupContainerItems.forEach((ele: HTMLElement) => {
                        ele.style.flexFlow = 'wrap';
                    });
                    if (popup.height === 'auto') {
                        this.setGalleryPopupHeight(popupEle, parseFloat(paddingStyles.height), parseFloat(paddingStyles.top));
                    }
                    break;
                }
            }
            if (!isCollideOccurs) {
                if (popup.width === 'auto') {
                    popupContainerItems.forEach((ele: HTMLElement) => {
                        ele.style.flexFlow = 'nowrap';
                    });
                    popupEle.style.width = 'auto';
                }
                else {
                    popupEle.style.width = (popup.width).toString();
                }
                if (popup.height === 'auto') {
                    this.setGalleryPopupHeight(popupEle, parseFloat(paddingStyles.height), parseFloat(paddingStyles.top));
                }
            }
        }
    }

    private setGalleryPopupHeight(popupEle: HTMLElement, popupHeight: number, popupTop: number): void {
        if (window.innerHeight < popupHeight || window.innerHeight < Math.round(popupHeight + popupTop)) {
            popupEle.style.height = (window.innerHeight - popupTop) + 'px';
        }
        else {
            popupEle.style.height = 'auto';
        }
    }

    private createPopup(item: RibbonItemModel, buttonEle: HTMLElement): void {
        const popupContainer: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-popup-container',
            id: item.id + '_popupContainer'
        });
        this.renderGalleryItems(item.gallerySettings, true, item.id, popupContainer);
        const gallerypopupElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-gallery-popup',
            id: item.id + '_galleryPopup'
        });
        document.body.append(gallerypopupElement);
        const galleryPopup: Popup = new Popup(gallerypopupElement, {
            relateTo: buttonEle,
            content: popupContainer,
            collision: { X: 'fit', Y: 'flip' },
            actionOnScroll: 'hide',
            targetType: 'relative',
            position: {  X: 'left', Y: 'bottom' },
            enableRtl: this.parent.enableRtl,
            width: item.gallerySettings.popupWidth,
            height: item.gallerySettings.popupHeight
        });
        galleryPopup.hide();
    }

    /**
     * Updates gallery in mode switching.
     *
     * @param {string} activeLayout - Gets the current active layout.
     * @param {string} itemID - Gets the ribbon item id.
     * @returns {void}
     * @hidden
     */
    public switchGalleryItems(activeLayout: string, itemID: string): void {
        const itemEle: HTMLElement = this.parent.element.querySelector('#' + itemID + constants.CONTAINER_ID);
        const itemProp: itemProps = getItem(this.parent.tabs, itemID);
        if (itemEle) {
            const galleryIcons: NodeListOf<Element> = itemEle.querySelectorAll('.e-ribbon-gallery-icons');
            const galleryContainer: NodeListOf<Element> = itemEle.querySelectorAll('.e-ribbon-gallery-container');
            if (galleryIcons.length) {
                for (let i: number = 0; i < galleryIcons.length; i++) {
                    if (activeLayout === 'Simplified') { galleryIcons[parseInt(i.toString(), 10)].classList.add('e-hidden'); }
                    else { galleryIcons[parseInt(i.toString(), 10)].classList.remove('e-hidden'); }
                }
            }
            if (galleryContainer.length && itemProp) {
                for (let n: number = 0; n < itemProp.item.gallerySettings.groups.length; n++) {
                    for (let i: number = 0; i < galleryContainer.length; i++) {
                        if (itemProp.item.gallerySettings.groups[parseInt(n.toString(), 10)].itemHeight && itemProp.item.gallerySettings.groups[parseInt(n.toString(), 10)].itemHeight !== 'auto') {
                            if (itemID + '_galleryContainer' + n === (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).id) {
                                if (activeLayout === 'Simplified') { (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).style.flexFlow = 'nowrap'; }
                                else { (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).style.flexFlow = 'wrap'; }
                            }
                        }
                    }
                }
            }
            const activeContent: HTMLElement = this.parent.tabObj.element.querySelector('#' + this.parent.tabs[this.parent.selectedTab].id + constants.CONTENT_ID);
            if (activeContent) {
                this.checkAvailableHeight(activeContent);
            }
        }
    }

    /**
     * Adds the additional event handlers as the item moved into overflow popup.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public addOverFlowEvents(item: RibbonItemModel, itemEle: HTMLElement ): void {
        if (itemEle.closest('.e-ribbon-overflow-target')) {
            const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
                id: item.id
            });
            itemEle.appendChild(buttonEle);
            if (itemEle.querySelector('.e-ribbon-gallery-wrapper').classList.contains('e-disabled')) {
                buttonEle.classList.add('e-disabled');
            }
            itemEle.querySelector('.e-ribbon-gallery-wrapper').classList.add('e-hidden');
            itemEle.querySelectorAll('.e-ribbon-gallery-container').forEach((ele: HTMLElement) => {
                ele.classList.add('e-hidden');
            });
            const popupButton: HTMLElement = itemEle.querySelector('#' + item.id + '_popupButton');
            if (popupButton) {
                popupButton.classList.add('e-hidden'); }
            const itemProp: itemProps = getItem(this.parent.tabs, item.id);
            let iconCss: string = itemProp && itemProp.group.groupIconCss ? itemProp.group.groupIconCss : '';
            const content: string = itemProp && itemProp.group.header ? itemProp.group.header : '';
            if (!iconCss) {
                for (let i: number = 0; i < item.gallerySettings.groups.length; i++) {
                    for (let j: number = 0; j < item.gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                        if (item.gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].iconCss) {
                            iconCss = item.gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].iconCss;
                            break;
                        }
                    }
                    if (iconCss) {
                        break;
                    }
                }
            }
            const popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            const popup: Popup = getComponent(popupEle, Popup);
            const popupContainerEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup .e-ribbon-popup-container');
            const dropdown: DropDownButton = new DropDownButton({
                iconCss: iconCss,
                content: content,
                target: popupContainerEle,
                enableRtl: this.parent.enableRtl,
                cssClass: 'e-ribbon-gallery-dropdown',
                disabled: item.disabled,
                open: () => {
                    const popupContainerItems: NodeListOf<Element> = popupContainerEle.querySelectorAll('.e-ribbon-gallery-container');
                    this.setWrapperStyle(popup, popupContainerItems);
                    this.setFoucsToFirstItem(popupContainerEle, true, item.id);
                },
                beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                    const isCancelled: boolean = this.popupEvents(args.event, item.gallerySettings, 'popupClose', false);
                    if (isCancelled) { args.cancel = true; }
                }
            }, buttonEle);
            if (popup.width !== 'auto') {
                dropdown.dropDown.width = formatUnit(popup.width);
            }
            if (popup.height !== 'auto') {
                dropdown.dropDown.height = formatUnit(popup.height);
                dropdown.dropDown.element.style.height = (popup.height).toString();
            }
        }
    }

    /**
     * Removes the additional event handlers as the item moved into overflow popup.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {HTMLElement} itemEle - Gets the ribbon item element.
     * @returns {void}
     * @hidden
     */
    public removeOverFlowEvents(item: RibbonItemModel, itemEle: HTMLElement): void {
        const popupButton: HTMLElement = itemEle.querySelector('#' + item.id + '_popupButton');
        if (popupButton) { popupButton.classList.remove('e-hidden'); }
        itemEle.querySelector('.e-ribbon-gallery-wrapper').classList.remove('e-hidden');
        itemEle.querySelectorAll('.e-ribbon-gallery-container').forEach((ele: HTMLElement) => {
            ele.classList.remove('e-hidden');
        });
        const galleryDDBEle: HTMLButtonElement = document.querySelector('#' + item.id);
        if (galleryDDBEle) {
            const popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            const dropdown: DropDownButton = getComponent(galleryDDBEle, DropDownButton);
            popupEle.appendChild((dropdown.target as HTMLElement));
            dropdown.destroy();
            remove(galleryDDBEle);
        }
    }

    private setActiveState(galleryEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, itemID: string,
                           isInteracted: boolean, event: Event, isPopup: boolean): void {
        let previousItem: RibbonGalleryItemModel;
        let currentItem: RibbonGalleryItemModel;
        const itemEle: HTMLElement = document.querySelector('#' + itemID + constants.CONTAINER_ID);
        let selctedGalleryItem: Array<Element> = Array.prototype.slice.call(itemEle.querySelectorAll('.e-ribbon-gallery-selected'));
        const popupEle: HTMLElement = document.querySelector('#' + itemID + '_popupContainer');
        const popupGalleryItem: Array<Element> = Array.prototype.slice.call(popupEle.querySelectorAll('.e-ribbon-gallery-selected'));
        if (popupGalleryItem.length) {
            selctedGalleryItem = selctedGalleryItem.concat(popupGalleryItem);
        }
        for (let i: number = 0; i < gallerySettings.groups.length; i++) {
            for (let j: number = 0; j < gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                if (selctedGalleryItem[0].id === itemID + '_galleryContainer' + i + '_gallery' + j) {
                    previousItem = gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)];
                }
                if (galleryEle.id === (isPopup ? 'popup_' : '') + itemID + '_galleryContainer' + i + '_gallery' + j) {
                    currentItem = gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)];
                }
            }
        }
        const galleryItem: HTMLElement = document.getElementById(galleryEle.id);
        let galleryItemPopup: HTMLElement;
        const selectingEventArgs: GalleryBeforeSelectEventArgs = { cancel: false, name: 'beforeSelect', previousItem: previousItem, currentItem: currentItem, isInteracted: isInteracted, event: event};
        if (gallerySettings.beforeSelect) {
            gallerySettings.beforeSelect.call(this, selectingEventArgs);
        }
        if (selectingEventArgs.cancel) {
            return;
        }
        else {
            for (let i: number = 0; i < selctedGalleryItem.length; i++) {
                selctedGalleryItem[parseInt(i.toString(), 10)].classList.remove('e-ribbon-gallery-selected');
            }
            if (!galleryItem.id.startsWith('popup_')) {
                galleryItemPopup = document.getElementById('popup_' + galleryEle.id);
            } else if (document.getElementById(galleryItem.id.slice(6))) {
                galleryItemPopup = document.getElementById(galleryItem.id.slice(6));
            }
            if (galleryItemPopup) {
                galleryItemPopup.classList.add('e-ribbon-gallery-selected');
            }
            galleryItem.classList.add('e-ribbon-gallery-selected');
            const selectedEventArgs: GallerySelectEventArgs = { previousItem: previousItem, currentItem: currentItem, name: 'select', isInteracted: isInteracted, event: event };
            const galleryPopupItems: NodeListOf<Element> = document.querySelectorAll('#' + itemID + '_popupContainer .e-ribbon-gallery-item');
            for (let i: number = 0; i < galleryPopupItems.length; i++) {
                if (galleryPopupItems[parseInt(i.toString(), 10)].id === galleryEle.id) {
                    gallerySettings.selectedItemIndex = i;
                    break;
                }
            }
            if (gallerySettings.select) {
                gallerySettings.select.call(this, selectedEventArgs);
            }
        }
    }

    private popupEvents(args: Event, gallerySettings: RibbonGallerySettingsModel, name: string, isOpen: boolean): boolean {
        const popupEventArgs: GalleryPopupEventArgs = { cancel: false, event: args, name: name };
        if (isOpen && gallerySettings.popupOpen) {
            gallerySettings.popupOpen.call(this, popupEventArgs);
        }
        else if (!isOpen && gallerySettings.popupClose) {
            gallerySettings.popupClose.call(this, popupEventArgs);
        }
        if (popupEventArgs.cancel) { return true; }
        return false;
    }

    private showPopup(popup: Popup, popupEle: HTMLElement, args: Event, gallerySettings: RibbonGallerySettingsModel, itemID: string): void {
        const isCancelled: boolean = this.popupEvents(args, gallerySettings, 'popupOpen', true);
        if (isCancelled) { return; }
        popup.show();
        this.checkCollision(popup, popupEle);
        const buttonEle: HTMLElement = document.querySelector('#' + itemID + '_popupButton');
        buttonEle.classList.add('e-gallery-button-active');
        const buttonPosition: ClientRect = buttonEle.getBoundingClientRect();
        if (popupEle.offsetWidth > buttonPosition.left) {
            this.checkCollision(popup, popupEle, buttonPosition.left);
        }
        const offsetX: number = Math.abs((popupEle.offsetWidth - buttonPosition.left)) + buttonEle.offsetWidth;
        popupEle.style.left = offsetX + 'px';
        popupEle.style.top = popupEle.getBoundingClientRect().top + 2 + 'px';
        this.setFoucsToFirstItem(popupEle, false, itemID, popup, gallerySettings);
    }

    private hidePopup(popup: Popup, popupEle: HTMLElement, args: Event, gallerySettings: RibbonGallerySettingsModel, itemID: string): void {
        const isCancelled: boolean = this.popupEvents(args, gallerySettings, 'popupClose', false);
        if (isCancelled) { return; }
        popup.hide();
        const buttonEle: HTMLElement = document.querySelector('#' + itemID + '_popupButton');
        buttonEle.classList.remove('e-gallery-button-active');
    }

    /**
     * Shows a specific gallery popup in the ribbon.
     *
     * @param {string} id - Gets the ribbon item id.
     * @returns {void}
     */
    public showGalleryPopup(id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        const popupEle: HTMLElement = document.querySelector('#' + id + '_galleryPopup');
        const popup: Popup = getComponent(popupEle, Popup);
        this.showPopup(popup, popupEle, null, itemProp.item.gallerySettings, id);
    }

    /**
     * Hides a specific gallery popup in the ribbon.
     *
     * @param {string} id - Gets the ribbon item id.
     * @returns {void}
     */
    public hideGalleryPopup(id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        const popupEle: HTMLElement = document.querySelector('#' + id + '_galleryPopup');
        const popup: Popup = getComponent(popupEle, Popup);
        this.hidePopup(popup, popupEle, null, itemProp.item.gallerySettings, id);
    }

    private setFoucsToFirstItem(popupEle: HTMLElement, isDropdown: boolean, itemID: string, popup?: Popup,
                                gallerySettings?: RibbonGallerySettingsModel): void {
        (popupEle.querySelectorAll('.e-ribbon-gallery-item')[0] as HTMLElement).focus();
        this.galleryItemsIndex = 0;
        popupEle.onkeydown = (e: KeyboardEventArgs) => {
            this.handleGalleryPopupNavigation(e, popupEle, isDropdown, itemID, popup, gallerySettings);
        };
    }

    private handleGalleryPopupNavigation(e: KeyboardEventArgs, popupEle: HTMLElement, isDropdown: boolean,
                                         itemID: string, popup?: Popup, gallerySettings?: RibbonGallerySettingsModel): void {
        const galleryPopupEle: NodeListOf<Element> = popupEle.querySelectorAll('.e-ribbon-gallery-item');
        if (galleryPopupEle) {
            if (e.key === 'Home') {
                this.galleryItemsIndex = 0;
                (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
            }
            else if (e.key === 'End') {
                this.galleryItemsIndex = galleryPopupEle.length - 1;
                (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
            }
            else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                this.galleryItemsIndex++;
                if (this.galleryItemsIndex !== galleryPopupEle.length) {
                    if (galleryPopupEle && (galleryPopupEle[this.galleryItemsIndex])) {
                        (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
                    }
                }
                else {
                    this.galleryItemsIndex = 0;
                    (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
                }
            }
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (this.galleryItemsIndex !== 0) {
                    this.galleryItemsIndex--;
                    if (galleryPopupEle && (galleryPopupEle[this.galleryItemsIndex])) {
                        (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
                    }
                }
                else {
                    this.galleryItemsIndex = galleryPopupEle.length - 1;
                    (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).focus();
                }
            }
            else if ((e.key === 'Enter' || e.code === 'Space') || (e.key === 'Escape' && !isDropdown)) {
                this.hidePopup(popup, popupEle, e, gallerySettings, itemID);
            }
        }
    }

    private createGalleryTemplate(galleryItemEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, id: string,
                                  items: RibbonGalleryItemModel): void {
        galleryItemEle.classList.add('e-ribbon-gallery-template');
        const templateName: string = 'ribbon' + id + 'galleryTemplate';
        this.parent['clearTemplate']([templateName]);
        const templateFunction: Function = getTemplateFunction(gallerySettings.template);
        if (items.disabled) {
            galleryItemEle.classList.add('e-disabled');
        }
        if (items.cssClass) {
            galleryItemEle.classList.add(items.cssClass);
        }
        append(templateFunction({ items: items }, this, templateName, (id + 'galleryTemplate'), this.parent.isStringTemplate, null, null, this.parent), galleryItemEle);
    }

    private createGalleryPopupTemplate(galleryItemEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, id: string,
                                       items: RibbonGalleryItemModel): void {
        galleryItemEle.classList.add('e-ribbon-gallery-popup-template');
        const templateName: string = 'ribbon' + id + 'galleryPopupTemplate';
        this.parent['clearTemplate']([templateName]);
        const templateFunction: Function = getTemplateFunction(gallerySettings.popupTemplate);
        if (items.disabled) {
            galleryItemEle.classList.add('e-disabled');
        }
        if (items.cssClass) {
            galleryItemEle.classList.add(items.cssClass);
        }
        append(templateFunction({ items: items }, this, templateName, (id + 'galleryPopupTemplate'), this.parent.isStringTemplate, null, null, this.parent), galleryItemEle);
    }
}
