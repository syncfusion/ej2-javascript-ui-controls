import { EventHandler, isNullOrUndefined, detach, formatUnit, getValue, addClass, select, closest } from '@syncfusion/ej2-base';
import { FileManager } from '../base';
import { ListBase } from '@syncfusion/ej2-lists';
import { createElement, selectAll, } from '@syncfusion/ej2-base';
import * as CLS from '../base/classes';
import { LargeIconsView } from '../layout';

export class Virtualization {
    constructor(instance: FileManager) {
        this.filemanagerInstance = instance;
        this.largeIconInstance = instance.largeiconsviewModule;
    }

     // eslint-disable-next-line
     private filemanagerInstance: FileManager;
     private largeIconInstance: LargeIconsView;
     private rowItemCount: number;
     private listElements: HTMLElement;
     private items: Object[];
     private itemList: HTMLElement[];
     private scrollPosition: number;
     private totalHeight: number;
     private listItemHeight: number;
     private topElementHeight: number;
     private bottomElementHeight: number;
     private renderedCount: number;
     private lastRowCount: number;
     private topElement: HTMLElement;
     private bottomElement: HTMLElement;
     private listDiff: number;
     private largeIconsViewItemsCount : number = 40;

    // Update the scroller height based on the items count.
    public setUlElementHeight(): void {
        this.rowItemCount = this.ValidateItemCount(Object.keys(this.largeIconInstance.allItems).length);
        this.lastRowCount = (this.largeIconInstance.allItems.length - this.largeIconsViewItemsCount) % this.rowItemCount ? 
                (this.largeIconInstance.allItems.length - this.largeIconsViewItemsCount) % this.rowItemCount : this.rowItemCount;
        this.topElement = this.filemanagerInstance.createElement('div');
        this.largeIconInstance.element.firstElementChild.insertBefore(this.topElement, this.largeIconInstance.element.firstElementChild.firstChild);
        this.bottomElement = this.filemanagerInstance.createElement('div');
        this.largeIconInstance.element.firstElementChild.insertBefore(this.bottomElement, null);
        const marginValue: number = parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-top')) + 
            parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-bottom'));
        this.listItemHeight = this.largeIconInstance.itemList[0].getBoundingClientRect().height + marginValue;
        this.totalHeight = (Object.keys(this.largeIconInstance.allItems).length / this.rowItemCount) * this.listItemHeight;
        this.topElement.style.height = 0 + 'px';
        this.bottomElement.style.height = this.totalHeight + 'px';
        this.topElementHeight = 0;
        this.bottomElementHeight = this.totalHeight;
        this.listDiff = 0;
        this.renderedCount = this.largeIconsViewItemsCount;
    }

    // Calculated the maximum number of items can be rendered in each row.
    private ValidateItemCount(dataSourceLength: number): number {
        const width: number = parseFloat(formatUnit(this.largeIconInstance.element.firstElementChild.clientWidth));
        const marginValue: number = parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-right')) + 
              parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-left'));
        let itemCount: number = Math.floor(width / (this.largeIconInstance.itemList[0].offsetWidth + marginValue));
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    }

    // Bind the scroll event for large icons view ul element.
    public wireScrollEvent(destroy: boolean): void {
        if (!destroy) {
            EventHandler.add(this.largeIconInstance.element.firstElementChild, 'scroll', this.onVirtualUiScroll, this);
        } else {
            EventHandler.remove(this.largeIconInstance.element.firstElementChild, 'scroll', this.onVirtualUiScroll);
        }
    }

    // Update the top and bottom element height and update the scroll position.
    private onVirtualUiScroll(e: Event): void {
        let startingHeight: number =  0;
        this.scrollPosition = isNullOrUndefined(this.scrollPosition) ? 0 : this.scrollPosition;
        const scroll: number = this.getscrollerHeight(startingHeight);
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        [this.topElementHeight, this.bottomElementHeight] = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0];
        if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
            this.topElement.style.height = this.topElementHeight + 'px';
            this.bottomElement.style.height = this.bottomElementHeight + 'px';
            // checked whether the scrolling is upward/downward
            if (scroll > this.scrollPosition) {
                const listDiff: number = Math.round(((this.topElementHeight / this.listItemHeight) - this.listDiff));
                this.onNormalScroll(listDiff, true);
            } else {
                const listDiff: number = Math.round((this.listDiff - (this.topElementHeight / this.listItemHeight)));
                this.onNormalScroll(listDiff, false);
            }
        }
        this.listDiff = Math.round(this.topElementHeight / this.listItemHeight);
        this.scrollPosition = scroll;
        this.largeIconInstance.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.largeIconInstance.element));
        this.largeIconInstance.items = this.largeIconInstance.allItems.slice(this.renderedCount - 
            this.largeIconsViewItemsCount, this.renderedCount);
    }

    // Calculated the scroller height.
    private getscrollerHeight(startingHeight: number): number {
        return ((this.largeIconInstance.element.firstElementChild.scrollTop - startingHeight) <= 0) ? 0 :
            (this.largeIconInstance.element.firstElementChild.scrollTop - startingHeight);
    }

    // Update the UI based on the scrolled position.
    private onNormalScroll(listDiff: number, isScrollingDown: boolean): void {
        for (let i: number = 0; i < listDiff; i++) {
            this.updateUI(isScrollingDown);
        }
        this.updateSelection();
    }

    // Updating the items in large icons view dynamically.
    private updateUI(isScrollingDown: boolean): void {
        if (isScrollingDown) {
            this.items = this.largeIconInstance.allItems.slice(this.renderedCount, this.renderedCount + this.rowItemCount);
            if (this.items.length > 0) {
                this.listElements = ListBase.createListFromJson(createElement, <{ [key: string]: Object; }[]>this.items, this.largeIconInstance.listObj);
                this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.listElements));
                this.itemList.forEach(liEle => {
                    this.largeIconInstance.element.firstElementChild.insertBefore(liEle, this.bottomElement);
                });
                this.renderedCount = (this.largeIconInstance.allItems.length >= this.renderedCount + this.rowItemCount) ?
                    this.renderedCount + this.rowItemCount : this.renderedCount + this.lastRowCount;
                for(let i = 0; i < this.rowItemCount; i++) {
                    detach(this.topElement.nextElementSibling);
                }
            }
        }
        else {
            let lastItemIndex: number;
            let isAllRendered: boolean;
            if (this.renderedCount == this.largeIconInstance.allItems.length) {
                lastItemIndex = this.renderedCount - (this.largeIconsViewItemsCount - this.rowItemCount + this.lastRowCount);
                this.renderedCount = ((this.renderedCount - this.lastRowCount) < this.largeIconsViewItemsCount) ? 
                this.largeIconsViewItemsCount: (this.renderedCount - this.lastRowCount);
                isAllRendered = true;
            } else {
                lastItemIndex = this.renderedCount - this.largeIconsViewItemsCount;
                this.renderedCount = ((this.renderedCount - this.rowItemCount) < this.largeIconsViewItemsCount) ? 
                this.largeIconsViewItemsCount: (this.renderedCount - this.rowItemCount);
            }
            let startItemIndex: number = (lastItemIndex - this.rowItemCount > 0) ? lastItemIndex - this.rowItemCount : 0;
            this.items = this.largeIconInstance.allItems.slice(startItemIndex, lastItemIndex);
            if (this.items.length > 0) {
                this.listElements = ListBase.createListFromJson(createElement, <{ [key: string]: Object; }[]>this.items, this.largeIconInstance.listObj);
                this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.listElements));
                for (let len: number = this.itemList.length; len > 0; len--) {
                    this.largeIconInstance.element.firstElementChild.insertBefore(this.itemList[len - 1], this.topElement.nextElementSibling);
                }
                for (var i = 0; i < ((isAllRendered) ? this.lastRowCount : this.rowItemCount); i++) {
                    detach(this.bottomElement.previousElementSibling);
                }
            }
        }
    }

    // Update the selected item state.
    private updateSelection(): void {
        for (let i: number = 0; i < this.filemanagerInstance.selectedItems.length; i++) {
            for (let j: number = 0; j < this.items.length; j++){
                if(this.filemanagerInstance.selectedItems[i] == getValue('name', this.items[j])) {
                    this.updateCheckState(this.itemList[j]);
                }
            }
        }
    }

    // Update the check state for items.
    private updateCheckState(liItem: Element): void {
        if (this.filemanagerInstance.allowMultiSelection) {
            addClass([liItem], [CLS.ACTIVE]);
            liItem.setAttribute('aria-selected', 'true');
            const checkEle: Element = select('.' + CLS.FRAME, liItem);
            if (!checkEle.classList.contains(CLS.CHECK)) {
                addClass([checkEle], CLS.CHECK);
                closest(checkEle, '.' + CLS.CB_WRAP).setAttribute('aria-checked', 'true');
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the module name.
     * @private
     */
    private getModuleName(): string {
        return 'virtualization';
    }

    public destroy(): void {
        if (this.filemanagerInstance.isDestroyed) { return; }
        if (!isNullOrUndefined(this.largeIconInstance.element.firstElementChild)) {
            this.wireScrollEvent(true);
        }
    }
}
