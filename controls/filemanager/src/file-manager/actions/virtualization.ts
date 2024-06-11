import { EventHandler, isNullOrUndefined, detach, formatUnit } from '@syncfusion/ej2-base';
import { FileManager } from '../base';
import { ListBase } from '@syncfusion/ej2-lists';
import { createElement, selectAll } from '@syncfusion/ej2-base';
import * as CLS from '../base/classes';
import { LargeIconsView } from '../layout';

export class Virtualization {
    constructor(instance: FileManager) {
        this.filemanagerInstance = instance;
        this.largeIconInstance = instance.largeiconsviewModule;
    }

    // The file manager component instance
    private filemanagerInstance: FileManager;
    // The LargeIconsView module
    private largeIconInstance: LargeIconsView;
    // The number of items that can be rendered in the viewport
    private itemCount: number;
    // The number of items that can be rendered per row
    private rowItemCount: number;
    // The rendered items
    private items: Object[];
    // The rendered items element
    private itemList: HTMLElement[];
    // The current scroll position of the view
    private scrollPosition: number;
    // The total height for rendering all items
    private totalHeight: number;
    // The height of each list item
    private listItemHeight: number;
    // The height of the top virtual element
    private topElementHeight: number;
    // The height of the bottom virtual element
    private bottomElementHeight: number;
    // The number of rendered items
    private renderedCount: number;
    // The last row's items
    private lastRowCount: number;
    // The top div element
    private topElement: HTMLElement;
    // The bottom div element
    private bottomElement: HTMLElement;
    // The number of rows scrolled
    private listDiff: number;


    /**
     * Sets up UI virtualization for the large icon view.
     *
     * @returns {void}
     */
    public setUIVirtualization(): void {
        // Get the current view data source
        const currentViewItems: { [key: string]: object; }[] = this.largeIconInstance.items as { [key: string]: object; }[];
        // Get the first item in the data source
        const firstItem: { [key: string]: object }[] = currentViewItems.slice(0, 1);
        // Create a list element from the first item in the data source
        const listElements: HTMLElement = ListBase.createListFromJson(createElement, firstItem, this.largeIconInstance.listObj);
        // Get the list items from the list element
        this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, listElements));
        // Append the list element to the large icon element
        this.largeIconInstance.element.appendChild(listElements);
        if (this.itemList.length !== 0 && this.largeIconInstance.element.querySelector('.' + CLS.EMPTY)) {
            this.largeIconInstance.element.removeChild(this.largeIconInstance.element.querySelector('.' + CLS.EMPTY));
        }
        // Get the total number of items
        this.itemCount = this.getItemCount(Object.keys(this.largeIconInstance.allItems).length);
        // Remove the first child element from the large icon element
        this.largeIconInstance.element.firstChild.remove();
        // Set the items for the large icon view to the current view data source, limited to the number of items to display
        this.largeIconInstance.items = currentViewItems.slice(0, this.itemCount);
    }

    /**
     * Sets the height of the top and bottom elements that are used for virtualization.
     * These elements are used to give the appearance of an infinitely scrolling list.
     *
     * @returns {void}
     */
    public setUlElementHeight(): void {
        // Calculate the number of items in the last row
        this.lastRowCount = (this.largeIconInstance.allItems.length - this.itemCount) % this.rowItemCount ?
            (this.largeIconInstance.allItems.length - this.itemCount) % this.rowItemCount : this.rowItemCount;
        // Create top and bottom elements
        this.topElement = this.filemanagerInstance.createElement('div');
        this.topElement.classList.add('e-virtual-top');
        this.largeIconInstance.element.firstElementChild.insertBefore(
            this.topElement, this.largeIconInstance.element.firstElementChild.firstChild);
        this.bottomElement = this.filemanagerInstance.createElement('div');
        this.bottomElement.classList.add('e-virtual-bottom');
        this.largeIconInstance.element.firstElementChild.insertBefore(this.bottomElement, null);
        // Get the margin value for list items
        const marginValue: number = parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-top'), 10) +
            parseInt(window.getComputedStyle(this.largeIconInstance.itemList[0]).getPropertyValue('margin-bottom'), 10);
        // Calculate the height of a single list item
        this.listItemHeight = this.largeIconInstance.itemList[0].getBoundingClientRect().height + marginValue;
        // Calculate the total height of the list
        this.totalHeight = (Object.keys(this.largeIconInstance.allItems).length / this.rowItemCount) * this.listItemHeight;
        // Set the initial height of the top and bottom elements
        this.topElement.style.height = 0 + 'px';
        this.bottomElement.style.height = this.totalHeight + 'px';
        // Initialize the top and bottom element heights
        this.topElementHeight = 0;
        this.bottomElementHeight = this.totalHeight;
        // Initialize the list difference variable
        this.listDiff = 0;
        // Set the initial rendered count
        this.renderedCount = this.itemCount;
    }

    /**
     * Calculates the number of items to display in the list based on the available width and height.
     *
     * @param {number} dataSourceLength The length of the data source.
     * @returns {number} The number of items to display.
     */
    private getItemCount(dataSourceLength: number): number {
        // Get the margin values for list items
        const widthMargin: number = parseInt(window.getComputedStyle(this.itemList[0]).getPropertyValue('margin-right'), 10) +
            parseInt(window.getComputedStyle(this.itemList[0]).getPropertyValue('margin-left'), 10);
        // Calculate the number of items that can fit in a single row
        this.rowItemCount =
        Math.floor(parseFloat(formatUnit(this.largeIconInstance.element.firstElementChild.clientWidth)) /
        (this.itemList[0].offsetWidth + widthMargin));
        // Calculate the number of items that can fit in the available height
        let itemCount: number =
        this.rowItemCount *
        (Math.round(parseFloat(formatUnit(this.largeIconInstance.element.clientHeight)) / this.itemList[0].offsetHeight));
        // If the calculated item count is greater than the data source length, set the item count to the data source length
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    }

    /**
     * Wires or un wires the scroll event for the list element.
     *
     * @param {boolean} destroy - Set `true` to unwire the scroll event.
     * @returns {void}
     */
    public wireScrollEvent(destroy: boolean): void {
        if (!destroy) {
            // Wire the scroll event
            EventHandler.add(this.largeIconInstance.element.firstElementChild, 'scroll', this.onVirtualUiScroll, this);
        } else {
            // Unwire the scroll event
            EventHandler.remove(this.largeIconInstance.element.firstElementChild, 'scroll', this.onVirtualUiScroll);
        }
    }

    /**
     * Handles the scroll event for the list element.
     * This method updates the top and bottom elements and the displayed items based on the scroll position.
     *
     * @returns {void}
     * @private
     */
    private onVirtualUiScroll(): void {
        // Set the starting height to 0
        const startingHeight: number =  0;
        // Get the current scroll position
        this.scrollPosition = isNullOrUndefined(this.scrollPosition) ? 0 : this.scrollPosition;
        const scroll: number = this.getscrollerHeight(startingHeight);
        // Calculate the height of the top element
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        // Calculate the height of the bottom element
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        // If the scroll position is less than or equal to the total height, set the top and bottom element heights.
        // Otherwise, set the top element height to the total height and the bottom element height to 0.
        [this.topElementHeight, this.bottomElementHeight] = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0];
        // If the top element height has changed, update the top and bottom element heights and re-render the items.
        if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
            this.topElement.style.height = this.topElementHeight + 'px';
            this.bottomElement.style.height = this.bottomElementHeight + 'px';
            // Check whether the scroll direction is upward or downward
            if (scroll > this.scrollPosition) {
                // Scrolling is upward
                const listDiff: number = Math.round(((this.topElementHeight / this.listItemHeight) - this.listDiff));
                this.onNormalScroll(listDiff, true);
            } else {
                // Scrolling is downward
                const listDiff: number = Math.round((this.listDiff - (this.topElementHeight / this.listItemHeight)));
                this.onNormalScroll(listDiff, false);
            }
        }
        // Update the list difference and scroll position variables
        this.listDiff = Math.round(this.topElementHeight / this.listItemHeight);
        this.scrollPosition = scroll;
        // Update the list of items and the items property of the largeIconInstance
        this.largeIconInstance.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, this.largeIconInstance.element));
        this.itemCount = this.itemCount !== this.largeIconInstance.itemList.length ? this.largeIconInstance.itemList.length : this.itemCount;
        this.largeIconInstance.items = this.largeIconInstance.allItems.slice(this.renderedCount -
            this.itemCount, this.renderedCount);
    }

    /**
     * Calculates the current scroll position of the list element.
     *
     * @param {number} startingHeight The starting height from which to calculate the scroll position.
     * @returns {number} The current scroll position.
     * @private
     */
    private getscrollerHeight(startingHeight: number): number {
        // If the scroll position is less than or equal to the starting height, return 0.
        // Otherwise, return the scroll position minus the starting height.
        return ((this.largeIconInstance.element.firstElementChild.scrollTop - startingHeight) <= 0) ? 0 :
            (this.largeIconInstance.element.firstElementChild.scrollTop - startingHeight);
    }

    /**
     * This method updates the displayed items and the selection based on the scroll direction.
     *
     * @param {number} listDiff The number of rows to update.
     * @param {boolean} isScrollingDown If set to true, the scroll direction is downward.
     * @returns {void}
     * @private
     */
    private onNormalScroll(listDiff: number, isScrollingDown: boolean): void {
        // Update the displayed items
        for (let i: number = 0; i < listDiff; i++) {
            this.updateUI(isScrollingDown);
        }
    }

    /**
     * Updates the items in the large icons view.
     *
     * @param {boolean} isScrollingDown - If set to true, the scroll direction is downward.
     * @returns {void}
     * @private
     */
    private updateUI(isScrollingDown: boolean): void {
        if (isScrollingDown) {
            // Get the next batch of items to be displayed
            this.items = this.largeIconInstance.allItems.slice(this.renderedCount, this.renderedCount + this.rowItemCount);
            // If there are items to be displayed, create list elements for them and append them to the list
            if (this.items.length > 0) {
                const listElements: HTMLElement = ListBase.createListFromJson(
                    createElement, <{ [key: string]: Object; }[]>this.items, this.largeIconInstance.listObj
                );
                this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, listElements));
                this.itemList.forEach((liEle: HTMLElement) => {
                    this.largeIconInstance.element.firstElementChild.insertBefore(liEle, this.bottomElement);
                });
                // Update the rendered count variable
                this.renderedCount = (this.largeIconInstance.allItems.length >= this.renderedCount + this.rowItemCount) ?
                    this.renderedCount + this.rowItemCount : this.renderedCount + this.lastRowCount;
                // Remove the first batch of items from the list
                for (let i: number = 0; i < this.rowItemCount; i++) {
                    detach(this.topElement.nextElementSibling);
                }
            }
        } else {
            // Scrolling up
            let lastItemIndex: number;
            let isAllRendered: boolean;
            if (this.renderedCount === this.largeIconInstance.allItems.length) {
                // Set lastItemIndex to the last item in the last row
                lastItemIndex = this.renderedCount - (this.itemCount - this.rowItemCount + this.lastRowCount);
                // Set renderedCount to the total number of items that have been rendered, except for the items in the last row
                this.renderedCount = ((this.renderedCount - this.lastRowCount) < this.itemCount) ?
                    this.itemCount : (this.renderedCount - this.lastRowCount);
                // Set isAllRendered to true to indicate that all items have been rendered
                isAllRendered = true;
            } else {
                // Set lastItemIndex to the last item in the current row
                lastItemIndex = this.renderedCount - this.itemCount;
                // Set renderedCount to the total number of items that have been rendered, except for the items in the current row
                this.renderedCount = ((this.renderedCount - this.rowItemCount) < this.itemCount) ?
                    this.itemCount : (this.renderedCount - this.rowItemCount);
            }
            // Set startItemIndex to the first item in the current or previous row
            const startItemIndex: number = (lastItemIndex - this.rowItemCount > 0) ? lastItemIndex - this.rowItemCount : 0;
            // Set the items array to the items in the current or previous row
            this.items = this.largeIconInstance.allItems.slice(startItemIndex, lastItemIndex);
            if (this.items.length > 0) {
                // Create a list of elements from the items array
                const listElements: HTMLElement = ListBase.createListFromJson(
                    createElement, <{ [key: string]: Object; }[]>this.items, this.largeIconInstance.listObj
                );
                // Set the itemList array to the list items in the list elements
                this.itemList = Array.prototype.slice.call(selectAll('.' + CLS.LIST_ITEM, listElements));
                // Add the items to the beginning of the list
                for (let len: number = this.itemList.length; len > 0; len--) {
                    this.largeIconInstance.element.firstElementChild.insertBefore(
                        this.itemList[len - 1], this.topElement.nextElementSibling
                    );
                }
                // Remove the last row of items from the list
                for (let i: number = 0; i < ((isAllRendered) ? this.lastRowCount : this.rowItemCount); i++) {
                    detach(this.bottomElement.previousElementSibling);
                }
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

    /**
     * Destroys the component.
     *
     * @returns {void}
     */
    public destroy(): void {
        // If the file manager has already been destroyed, return immediately
        if (this.filemanagerInstance.isDestroyed) { return; }
        // If the large icon element has a child element, unwire the scroll event
        if (!isNullOrUndefined(this.largeIconInstance.element.firstElementChild)) {
            this.wireScrollEvent(true);
        }
    }
}
