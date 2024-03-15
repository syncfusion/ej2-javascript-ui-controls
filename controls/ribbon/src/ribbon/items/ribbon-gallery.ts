import { EventHandler, KeyboardEventArgs, append, getComponent, remove, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { GalleryHoverEventArgs, GalleryItemEventArgs, GalleryPopupEventArgs, GallerySelectEventArgs, GalleryBeforeSelectEventArgs, getItem, getTemplateFunction, itemProps, Ribbon, setCustomAttributes, getGroup } from '../base/index';
import { RibbonGalleryItem, RibbonGalleryItemModel, RibbonGallerySettingsModel, RibbonItemModel } from '../models/index';
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

    constructor(parent: Ribbon) {
        this.parent = parent;
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
            id: item.id +'_popupButton',
            className: 'e-ribbon-gallery-button e-icons e-drop-icon'
        });
        itemEle.appendChild(buttonEle);
        this.createPopup(item, buttonEle);
        buttonEle.onclick = (args: Event) => {
            let popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            if (popupEle) {
                let popup: Popup = getComponent(popupEle, Popup);
                popupEle.classList.contains('e-popup-close') ? this.showPopup(popup, popupEle, args, gallerySettings, item.id) : this.hidePopup(popup, popupEle, args, gallerySettings, item.id);
            }
        };
        document.onclick = (args: Event) => {
            let popupEle: NodeListOf<Element> = document.querySelectorAll('.e-ribbon-gallery-popup.e-popup-open');
            let popupID: string;
            let itemProp: itemProps;
            for (let i: number = 0; i < popupEle.length; i++) {
                let popup: Popup = getComponent(popupEle[parseInt(i.toString(), 10)] as HTMLElement, Popup);
                if ((args.target as HTMLElement).classList.contains('e-ribbon-gallery-button')) {
                    popupID = ((popupEle[parseInt(i.toString(), 10)] as HTMLElement).id).replace(/_galleryPopup/g, '')
                    if (((args.target as HTMLElement).id).replace(/_popupButton/g, '') !== popupID) {
                        itemProp = getItem(this.parent.tabs, popupID)
                        this.hidePopup(popup, popupEle[parseInt(i.toString(), 10)] as HTMLElement, args, itemProp.item.gallerySettings, popupID);
                        break;
                    }
                }
                else {
                    popupID = ((popupEle[parseInt(i.toString(), 10)] as HTMLElement).id).replace(/_galleryPopup/g, '')
                    itemProp = getItem(this.parent.tabs, popupID)
                    this.hidePopup(popup, popupEle[parseInt(i.toString(), 10)] as HTMLElement, args, itemProp.item.gallerySettings, popupID);
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
        let galleryWrapper: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-gallery-wrapper',
            id: id + '_galleryWrapper'
        });
        if (!isPopup) {
            itemEle.appendChild(galleryWrapper)
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
                    id: galleryContainerEle.id + '_gallery' + j,
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
                    this.setActiveState(e.currentTarget as HTMLElement, gallerySettings, id, true, e);
                };
                galleryEle.onkeydown = (e: Event) => {
                    if ((e as KeyboardEventArgs).key === 'Enter' || (e as KeyboardEventArgs).key === ' ') {
                        this.setActiveState(e.currentTarget as HTMLElement, gallerySettings, id, true, e);
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
                    galleryEle.style.paddingTop = '0px';
                    galleryEle.style.paddingBottom = '0px';
                    if (this.parent.activeLayout !== 'Simplified' && !isPopup) {
                        galleryContainerEle.style.flexFlow = 'wrap';
                    }
                }
                if ((!gallerySettings.template && !gallerySettings.popupTemplate) || ((gallerySettings.template && !gallerySettings.popupTemplate) && isPopup) || ((gallerySettings.popupTemplate && !gallerySettings.template) && !isPopup)) {
                    if (gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].htmlAttributes) {
                        setCustomAttributes(galleryEle, gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].htmlAttributes);
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
                        galleryEle.classList.add(gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)].cssClass);
                    }
                }
                if (gallerySettings.template && !isPopup) {
                    this.createGalleryTemplate(galleryEle, gallerySettings, id, gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)]);
                }
                if (gallerySettings.popupTemplate && isPopup) {
                    this.createGalleryPopupTemplate(galleryEle, gallerySettings, id, gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)]);
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
            !isPopup ? galleryWrapper.appendChild(galleryContainerEle) : itemEle.appendChild(galleryContainerEle);
            if (isPopup && gallerySettings.groups[parseInt(i.toString(), 10)].header) {
                let headerEle: HTMLElement = (this.parent.createElement('div', {
                    className: 'e-ribbon-gallery-header',
                    innerHTML: gallerySettings.groups[parseInt(i.toString(), 10)].header
                }));
                itemEle.insertBefore(headerEle, galleryContainerEle);
            }
        }
        this.count = 0;
        this.isAdded = false;
    }

    private setWrapperWidth(itemCount: number, galleryWrapper: HTMLElement, gallerySettings: RibbonGallerySettingsModel, itemID: string): void {
        let count: number = 1;
        let itemsWidth: number = 0;
        let isWidthApplied: boolean = false;
        for (let i: number = 0; i < gallerySettings.groups.length; i++) {
            for (let j: number = 0; j < gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                if (gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight && gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight !== 'auto') {
                    if (itemCount >= count) {
                        let galleryItemEle: HTMLElement = galleryWrapper.querySelector('#' + itemID + '_galleryContainer' + i + '_gallery' + j);
                        if (galleryItemEle) {
                            itemsWidth += galleryItemEle.offsetWidth;
                            let itemStyles = window.getComputedStyle(galleryItemEle);
                            if (itemStyles) {
                                let paddingWidth: number = parseFloat(itemStyles.paddingLeft) + parseFloat(itemStyles.paddingRight);
                                if (!(isNullOrUndefined(paddingWidth)))
                                    itemsWidth += paddingWidth;
                                let marginWidth: number = parseFloat(itemStyles.marginLeft) + parseFloat(itemStyles.marginRight);
                                if (!(isNullOrUndefined(marginWidth)))
                                    itemsWidth += marginWidth;
                            }
                        }
                    }
                    else {
                        isWidthApplied = true;
                        break;
                    }
                    count++;
                }
            }
            if (isWidthApplied) {
                break;
            }
        }
        if (itemsWidth > 0)
            galleryWrapper.style.width = itemsWidth + 'px';
    }

    /**
     * Checks the gallery items height.
     *
     * @param {number} selectedTab - Gets the current selected tab.
     * @param {HTMLElement} activeContent - Gets the current active content.
     * @returns {void}
     * @hidden
     */
    public checkAvailableHeight(selectedTab: number, activeContent: HTMLElement): void {
        let galleryWrapperItems: NodeListOf<Element> = activeContent.querySelectorAll('.e-ribbon-gallery-wrapper');
        for (let n: number = 0; n < galleryWrapperItems.length; n++) {
            let isHeight: boolean = false;
            let itemsCount: number = 0;
            let galleryWrapper: HTMLElement = galleryWrapperItems[parseInt(n.toString(), 10)] as HTMLElement;
            let galleryWrapperHeight: number = galleryWrapper.offsetHeight;
            let itemID: string = galleryWrapper.id.replace(/_galleryWrapper/g, '');
            const itemProp: itemProps = getItem(this.parent.tabs, itemID);
            if (itemProp) {
                this.setWrapperWidth(itemProp.item.gallerySettings.itemCount, galleryWrapper, itemProp.item.gallerySettings, itemID);
                for (let i: number = 0; i < itemProp.item.gallerySettings.groups.length; i++) {
                    if (itemProp.item.gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight && itemProp.item.gallerySettings.groups[parseInt(i.toString(), 10)].itemHeight !== 'auto') {
                        for (let j: number = 0; j < itemProp.item.gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                            let galleryItemEle: HTMLElement = galleryWrapper.querySelector('#' + itemID + '_galleryContainer' + i + '_gallery' + j);
                            if (galleryItemEle) {
                                itemsCount++;
                                if (!isHeight) {
                                    if (itemsCount === 1) {
                                        let itemsValues: number = 0;
                                        let itemStyles = window.getComputedStyle(galleryItemEle);
                                        if (itemStyles) {
                                            let paddingWidth: number = parseFloat(itemStyles.paddingTop) + parseFloat(itemStyles.paddingBottom);
                                            if (!(isNullOrUndefined(paddingWidth)))
                                                itemsValues += paddingWidth
                                            let marginWidth: number = parseFloat(itemStyles.marginTop) + parseFloat(itemStyles.marginBottom);
                                            if (!(isNullOrUndefined(marginWidth)))
                                                itemsValues += marginWidth;
                                        }
                                        if (galleryWrapperHeight > (galleryItemEle.offsetHeight + itemsValues)) {
                                            galleryWrapperHeight -= (galleryItemEle.offsetHeight + itemsValues);
                                        }
                                        else {
                                            isHeight = true;
                                            galleryItemEle.remove();
                                        }
                                    }
                                    if (itemsCount === itemProp.item.gallerySettings.itemCount) {
                                        itemsCount = 0;
                                    }
                                }
                                else {
                                    galleryItemEle.remove();
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private checkCollision(popup: Popup, popupEle: HTMLElement): void {
        let paddingWidth: number = 0;
        let marginWidth: number = 0;
        if (popupEle) {
            let screenWidth = window.innerWidth;
            let paddingStyles = window.getComputedStyle(popupEle);
            if (paddingStyles) {
                paddingWidth = parseFloat(paddingStyles.paddingLeft) + parseFloat(paddingStyles.paddingRight);
                if (!(isNullOrUndefined(paddingWidth)))
                    screenWidth = screenWidth - paddingWidth;
            }
            let popupContainerItems: NodeListOf<Element> = popupEle.querySelectorAll('.e-ribbon-gallery-container');
            if (popup.width !== 'auto') {
                popupContainerItems.forEach((ele: HTMLElement) => {
                    ele.style.flexFlow = 'wrap';
                });
            }
            let isCollideOccurs: boolean = false;
            for (let i: number = 0; i < popupContainerItems.length; i++) {
                let itemsWidth: number = 0;
                for (let j: number = 0; j < (popupContainerItems[parseInt(i.toString(), 10)] as HTMLElement).querySelectorAll('.e-ribbon-gallery-item').length; j++) {
                    let marginStyles = window.getComputedStyle(popupContainerItems[parseInt(i.toString(), 10)].querySelectorAll('.e-ribbon-gallery-item')[parseInt(j.toString(), 10)] as HTMLElement);
                    if (marginStyles) {
                        marginWidth = parseFloat(marginStyles.marginLeft) + parseFloat(marginStyles.marginRight);
                        if (!(isNullOrUndefined(marginWidth)))
                            itemsWidth += marginWidth;
                    }
                    itemsWidth += (popupContainerItems[parseInt(i.toString(), 10)].querySelectorAll('.e-ribbon-gallery-item')[parseInt(j.toString(), 10)] as HTMLElement).offsetWidth;
                    if (((screenWidth <= itemsWidth) && popup.width === 'auto') || ((popup.width !== 'auto') && (screenWidth <= parseInt(popup.width.toString(), 10)) && (screenWidth <= itemsWidth)) ) {
                        popupEle.style.width = ((itemsWidth + Math.abs(paddingWidth - marginWidth)) - (popupContainerItems[parseInt(i.toString(), 10)].querySelectorAll('.e-ribbon-gallery-item')[parseInt(j.toString(), 10)] as HTMLElement).offsetWidth) + 'px';
                        isCollideOccurs = true;
                        break;
                    }
                }
                if (isCollideOccurs) {
                    popupContainerItems.forEach((ele: HTMLElement) => {
                        ele.style.flexFlow = 'wrap';
                    });
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
            }
        }
    }

    private createPopup(item: RibbonItemModel, buttonEle: HTMLElement): void {
        let popupContainer: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-popup-container',
            id: item.id + '_popupContainer'
        });
        this.renderGalleryItems(item.gallerySettings, true, item.id, popupContainer);
        const gallerypopupElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-ribbon-gallery-popup',
            id: item.id +'_galleryPopup'
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
        let itemEle: HTMLElement = this.parent.element.querySelector('#' + itemID + constants.CONTAINER_ID);
        let count: number = 0;
        const itemProp: itemProps = getItem(this.parent.tabs, itemID);
        if (itemEle) {
            let galleryWrapper: HTMLElement = itemEle.querySelector('.e-ribbon-gallery-wrapper');
            let galleryIcons: NodeListOf<Element> = itemEle.querySelectorAll('.e-ribbon-gallery-icons');
            let galleryContainer: NodeListOf<Element> = itemEle.querySelectorAll('.e-ribbon-gallery-container');
            if (galleryIcons.length) {
                for (let i: number = 0; i < galleryIcons.length; i++) {
                    activeLayout === 'Simplified' ? galleryIcons[parseInt(i.toString(), 10)].classList.add('e-hidden') : galleryIcons[parseInt(i.toString(), 10)].classList.remove('e-hidden');
                }
            }
            if (galleryContainer.length && itemProp) {
                for (let n: number = 0; n < itemProp.item.gallerySettings.groups.length; n++) {
                    for (let i: number = 0; i < galleryContainer.length; i++) {
                        if (itemProp.item.gallerySettings.groups[parseInt(n.toString(), 10)].itemHeight && itemProp.item.gallerySettings.groups[parseInt(n.toString(), 10)].itemHeight !== 'auto') {
                            if (itemID + '_galleryContainer' + n === (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).id){
                                activeLayout === 'Simplified' ? (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).style.flexFlow = 'nowrap' : (galleryContainer[parseInt(i.toString(), 10)] as HTMLElement).style.flexFlow = 'wrap';
                            }
                        }
                    }
                }
            }
            if (galleryWrapper) {
                for (let n: number = 0; n < itemProp.item.gallerySettings.groups.length; n++) {
                    for (let i: number = 0; i < itemProp.item.gallerySettings.groups[parseInt(n.toString(), 10)].items.length; i++) {
                        count++;
                        if (count > itemProp.item.gallerySettings.itemCount) {
                            let galleryItemEle: HTMLElement = galleryWrapper.querySelector('#' + itemID + '_galleryContainer' + n + '_gallery' + i);
                            if (galleryItemEle) {
                                activeLayout === 'Simplified' ? galleryItemEle.classList.add('e-hidden') : galleryItemEle.classList.remove('e-hidden');
                            }
                        }
                    }
                }
            }
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
        if (itemEle.closest('.e-ribbon-overflow-target')) {
            const buttonEle: HTMLButtonElement = this.parent.createElement('button', {
                id: item.id,
            });
            itemEle.appendChild(buttonEle);
            itemEle.querySelector('.e-ribbon-gallery-wrapper').classList.add('e-hidden');
            itemEle.querySelectorAll('.e-ribbon-gallery-container').forEach((ele: HTMLElement) => {
                ele.classList.add('e-hidden');
            });
            let popupButton: HTMLElement = itemEle.querySelector('#' + item.id + '_popupButton');
            if (popupButton)
                popupButton.classList.add('e-hidden');
            const itemProp: itemProps = getItem(this.parent.tabs, item.id);
            let iconCss: string = itemProp && itemProp.group.groupIconCss ? itemProp.group.groupIconCss : '';
            let content: string = itemProp && itemProp.group.header ? itemProp.group.header : '';
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
            let popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            let popup: Popup = getComponent(popupEle, Popup);
            let popupContainerEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup .e-ribbon-popup-container');
            const dropdown = new DropDownButton({
                iconCss: iconCss,
                content: content,
                target: popupContainerEle,
                enableRtl: this.parent.enableRtl,
                cssClass: 'e-ribbon-gallery-dropdown',
                disabled: item.disabled,
                open: () => {
                    this.setFoucsToFirstItem(popupContainerEle, true, item.id);
                    this.checkCollision(dropdown.dropDown, dropdown.dropDown.element);
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
        let popupButton: HTMLElement = itemEle.querySelector('#' + item.id + '_popupButton');
        if (popupButton) { popupButton.classList.remove('e-hidden'); }
        itemEle.querySelector('.e-ribbon-gallery-wrapper').classList.remove('e-hidden');
        itemEle.querySelectorAll('.e-ribbon-gallery-container').forEach((ele: HTMLElement) => {
            ele.classList.remove('e-hidden');
        });
        const galleryDDBEle: HTMLButtonElement = document.querySelector('#' + item.id);
        if (galleryDDBEle) {
            let popupEle: HTMLElement = document.querySelector('#' + item.id + '_galleryPopup');
            const dropdown: DropDownButton = getComponent(galleryDDBEle, DropDownButton);
            popupEle.appendChild((dropdown.target as HTMLElement));
            dropdown.destroy();
            remove(galleryDDBEle);
        }
    }

    private setActiveState(galleryEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, itemID: string, isInteracted: boolean, event: Event): void {
        let previousItem: RibbonGalleryItemModel;
        let currentItem: RibbonGalleryItemModel;
        let itemEle: HTMLElement = document.querySelector('#' + itemID + constants.CONTAINER_ID);
        let selctedGalleryItem: Array<Element> = Array.prototype.slice.call(itemEle.querySelectorAll('.e-ribbon-gallery-selected'));
        let popupEle: HTMLElement = document.querySelector('#' + itemID + '_popupContainer');
        let popupGalleryItem: Array<Element> = Array.prototype.slice.call(popupEle.querySelectorAll('.e-ribbon-gallery-selected'));
        if (popupGalleryItem.length) {
            selctedGalleryItem = selctedGalleryItem.concat(popupGalleryItem);
        }
        for (let i: number = 0; i < gallerySettings.groups.length; i++) {
            for (let j: number = 0; j < gallerySettings.groups[parseInt(i.toString(), 10)].items.length; j++) {
                if (selctedGalleryItem[0].id === itemID + '_galleryContainer' + i + '_gallery' + j) {
                    previousItem = gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)];
                }
                if (galleryEle.id === itemID + '_galleryContainer' + i + '_gallery' + j) {
                    currentItem = gallerySettings.groups[parseInt(i.toString(), 10)].items[parseInt(j.toString(), 10)];
                }
            }
        }
        let galleryItem: NodeListOf<Element> = document.querySelectorAll('#' + galleryEle.id);
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
            for (let i: number = 0; i < galleryItem.length; i++) {
                galleryItem[parseInt(i.toString(), 10)].classList.add('e-ribbon-gallery-selected');
            }
            const selectedEventArgs: GallerySelectEventArgs = { previousItem: previousItem, currentItem: currentItem, name: 'select', isInteracted: isInteracted, event: event };
            let galleryPopupItems: NodeListOf<Element> = document.querySelectorAll('#' + itemID + '_popupContainer .e-ribbon-gallery-item');
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
        const popupEventArgs: GalleryPopupEventArgs = { cancel: false ,event: args, name: name };
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
        let popupEle: HTMLElement = document.querySelector('#' + id + '_galleryPopup');
        let popup: Popup = getComponent(popupEle, Popup);
        this.showPopup(popup, popupEle, null, itemProp.item.gallerySettings, id)
    }

    /**
     * Hides a specific gallery popup in the ribbon.
     *
     * @param {string} id - Gets the ribbon item id.
     * @returns {void}
     */
    public hideGalleryPopup(id: string): void {
        const itemProp: itemProps = getItem(this.parent.tabs, id);
        let popupEle: HTMLElement = document.querySelector('#' + id + '_galleryPopup');
        let popup: Popup = getComponent(popupEle, Popup);
        this.hidePopup(popup, popupEle, null, itemProp.item.gallerySettings, id);
    }

    private setFoucsToFirstItem(popupEle: HTMLElement, isDropdown: boolean, itemID: string, popup?: Popup, gallerySettings?: RibbonGallerySettingsModel): void {
        (popupEle.querySelectorAll('.e-ribbon-gallery-item')[0] as HTMLElement).focus();
        this.galleryItemsIndex = 0;
        popupEle.onkeydown = (e: KeyboardEventArgs) => {
            this.handleGalleryPopupNavigation(e, popupEle, isDropdown, itemID, popup, gallerySettings);
        }
    }

    private handleGalleryPopupNavigation(e: KeyboardEventArgs, popupEle: HTMLElement, isDropdown: boolean, itemID: string, popup?: Popup, gallerySettings?: RibbonGallerySettingsModel): void {
        let galleryPopupEle: NodeListOf<Element> = popupEle.querySelectorAll('.e-ribbon-gallery-item');
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
            else if (e.key === 'Enter' || e.code === 'Space') {
                (galleryPopupEle[this.galleryItemsIndex] as HTMLElement).click();
            }
            else if (e.key === 'Escape' && !isDropdown) {
                this.hidePopup(popup, popupEle, e, gallerySettings, itemID);
            }
        }
    }

    private createGalleryTemplate(galleryItemEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, id: string, items: RibbonGalleryItemModel): void {
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
        append(templateFunction({ items: items }, this, templateName, (id + 'galleryTemplate'), this.parent.isStringTemplate), galleryItemEle);
        this.parent['renderReactTemplates']();
    }

    private createGalleryPopupTemplate(galleryItemEle: HTMLElement, gallerySettings: RibbonGallerySettingsModel, id: string, items: RibbonGalleryItemModel): void {
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
        append(templateFunction({ items: items }, this, templateName, (id + 'galleryPopupTemplate'), this.parent.isStringTemplate), galleryItemEle);
        this.parent['renderReactTemplates']();
    }
}