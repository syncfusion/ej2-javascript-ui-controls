import { OrganizeDetails, PageOrganizer, PdfPageRotateAngle } from '../organize-pdf';
import { createElement, Browser, isNullOrUndefined, Draggable, DragEventArgs, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { enableDisableToolbarItems, updateSelectAllCheckbox } from './organize-toolbar';
import { disableTileCopyButton, disableTileDeleteButton } from './tile-interaction';
import { getNextSubIndex, getRotatedAngle, processRotation } from './organize-math-utils';
import { clonedCollection } from './organize-undoredoutils';
import { updatePageNumber, updateTotalPageCount } from './organize-initialization';
import { inputTextboxUpdate } from './organize-extract';

/**
 * @private
 * @param {PdfPageRotateAngle} pageRotateAngle - It's describe about page rotation.
 * @returns { void }
 */
export function rotateAllPages(pageRotateAngle: PdfPageRotateAngle): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        const rotateAngle: PdfPageRotateAngle = pageRotateAngle as PdfPageRotateAngle;
        // Get the total page count
        const totalPages: number = this.pdfViewer.pageCount;
        // Generate an array of page indexes
        const pageIndexes: number[] = Array.from({ length: totalPages }, (_: any, index: number) => index);
        processRotation.call(this, pageIndexes, rotateAngle);
    }
}

/**
 * @private
 * @returns { void }
 */
export function movePages(): void {
    // eslint-disable-next-line
    const proxy: PageOrganizer = this;
    const draggableElement: HTMLElement = this.imageContainer;
    this.dragObj = new Draggable(draggableElement, {
        dragArea: this.tileAreaDiv,
        isDragScroll: true,
        enableTapHold: true,
        tapHoldThreshold: Browser.isDevice ? 50 : 750,
        helper: (e: { sender: MouseEvent & TouchEvent, element: HTMLElement }) => {
            if (this.pdfViewer.pageOrganizerSettings.canRearrange) {
                // Return a clone or another element as the drag avatar
                const cloneTargetEle: HTMLElement = e.element.querySelector('.e-pv-organize-image, .e-pv-organize-import-image-wrapper');
                const clone: HTMLElement = cloneTargetEle.cloneNode(true) as HTMLElement;
                clone.style.width = cloneTargetEle.clientWidth + 'px';
                clone.style.height = cloneTargetEle.clientHeight + 'px';
                this.virtualEle = createElement('div', { className: 'e-pv-virtual-image-container' });
                this.virtualEle.appendChild(clone);
                this.tileAreaWrapper.appendChild(this.virtualEle);
                return this.virtualEle;
            }
            return null;
        },
        drag: (e: DragEventArgs) => {
            e.event.preventDefault();
            if (proxy.pdfViewer.pageOrganizerSettings.canRearrange) {
                proxy.autoScroll(e);
                proxy.addSelectionRingStyle();
                const mainTileElement: HTMLElement = !isNullOrUndefined(e.target) && e.target instanceof Element ? (e.target.closest('.e-pv-organize-anchor-node') as HTMLElement) : null;
                if (!isNullOrUndefined(mainTileElement)) {
                    const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
                    proxy.dragHoveredIndex = pageOrder;
                    const tileRect: DOMRect = mainTileElement.getBoundingClientRect() as DOMRect;
                    let outerBorder: HTMLElement = document.querySelector('.e-pv-organize-outer-border');
                    // If the outerBorder does not exist's, creating it
                    if (isNullOrUndefined(outerBorder)) {
                        outerBorder = createElement('div', { className: 'e-pv-organize-outer-border' });
                        proxy.tileAreaWrapper.appendChild(outerBorder);
                    }
                    outerBorder.style.display = 'block';
                    const isHoveredOnSelected: boolean = proxy.isHoveredOnSelectedPages(proxy.selectedPageIndexes,
                                                                                        proxy.dragHoveredIndex);
                    if (isHoveredOnSelected && !isNullOrUndefined(e.target) && (e.target.classList.contains('e-pv-organize-image') || e.target.classList.contains('e-pv-organize-import-image-wrapper') || e.target.classList.contains('e-pv-image-container'))) {
                        outerBorder.classList.add('e-pv-selected');
                        outerBorder.classList.remove('e-pv-not-selected');
                    } else if (!isNullOrUndefined(e.target) && (e.target.classList.contains('e-pv-organize-image') || e.target.classList.contains('e-pv-organize-import-image-wrapper') || e.target.classList.contains('e-pv-image-container'))) {
                        outerBorder.classList.add('e-pv-not-selected');
                        outerBorder.classList.remove('e-pv-selected');
                    }
                    proxy.handlePageMove(e, tileRect, proxy.gapBetweenDivs, outerBorder);
                }
            }
        },
        dragStart: (e: DragEventArgs) => {
            proxy.selectedPageIndexes = [];
            if (proxy.pdfViewer.pageOrganizerSettings.canRearrange) {
                if ((e.element.parentElement.querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement).checked) {
                    const checkedElements: any = proxy.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
                    for (let i: number = 0; i < checkedElements.length; i++) {
                        proxy.selectedPageIndexes.push(parseInt(checkedElements[parseInt(i.toString(), 10)].getAttribute('data-page-order'), 10));
                        checkedElements[parseInt(i.toString(), 10)].classList.add('e-pv-organize-tile-draggedEle');
                        const imageElement: any = checkedElements[parseInt(i.toString(), 10)].querySelector('.e-pv-organize-image, .e-pv-organize-import-image-wrapper');
                        if (imageElement) {
                            imageElement.classList.add('e-pv-organize-tile-draggedEle');
                        }
                    }
                }
                else {
                    const anchorElement: any = e.element.closest('.e-pv-organize-anchor-node');
                    if (anchorElement) {
                        proxy.selectedPageIndexes.push(parseInt(anchorElement.getAttribute('data-page-order'), 10));
                        anchorElement.classList.add('e-pv-organize-tile-draggedEle');
                        const imageElement: any = anchorElement.querySelector('.e-pv-organize-image, .e-pv-organize-import-image-wrapper');
                        if (imageElement) {
                            imageElement.classList.add('e-pv-organize-tile-draggedEle');
                        }
                    }
                }
                const notification: any = createElement('span', {
                    className: 'e-badge e-badge-primary e-badge-overlap e-badge-notification',
                    innerHTML: '' + this.selectedPageIndexes.length
                });
                notification.classList.add('e-pv-notification');
                proxy.virtualEle.append(notification);
                proxy.addSelectionRingStyle();
            }
        },
        dragStop: (e: DragEventArgs) => {
            const clearDraggedElements: any = () => {
                proxy.virtualEle.parentNode.removeChild(proxy.virtualEle);
                const draggedElements: any = proxy.tileAreaDiv.querySelectorAll('.e-pv-organize-tile-draggedEle');
                draggedElements.forEach((element: any) => {
                    element.classList.remove('e-pv-organize-tile-draggedEle');
                });
                const outerBorder: HTMLElement = document.querySelector('.e-pv-organize-outer-border');
                if (!isNullOrUndefined(outerBorder)) {
                    outerBorder.classList.remove('e-pv-selected', 'e-pv-not-selected');
                    proxy.selectedPageIndexes = [];
                }
            };
            if (proxy.autoScrollInterval !== null) {
                clearInterval(proxy.autoScrollInterval);
                proxy.autoScrollInterval = null;
            }
            proxy.removeSelectionRingStyle();
            if (e.target instanceof Element && e.target.classList) {
                if (e.target == null || !(e.target.classList.contains('e-pv-organize-image') || e.target.classList.contains('e-pv-organize-import-image-wrapper') || e.target.classList.contains('e-pv-image-container'))) {
                    clearDraggedElements();
                }
            }
            else {
                clearDraggedElements();
            }
        }
    });
    const droppableElement: HTMLElement = this.thumbnail;
    this.dropObj = new Droppable(droppableElement, {
        drop: (e: DropEventArgs) => {
            if (proxy.autoScrollInterval !== null) {
                clearInterval(proxy.autoScrollInterval);
                proxy.autoScrollInterval = null;
            }
            proxy.removeSelectionRingStyle();
            const outerBorder: any = document.querySelector('.e-pv-organize-outer-border');
            // Remove the element from the DOM
            if (outerBorder) {
                outerBorder.classList.remove('e-pv-selected', 'e-pv-not-selected');
                outerBorder.parentNode.removeChild(outerBorder);
            }
            if (proxy.virtualEle && proxy.virtualEle.parentNode) {
                proxy.virtualEle.parentNode.removeChild(proxy.virtualEle);
                proxy.virtualEle = null;
            }
            proxy.pageDragDrop(e);
            const draggedElements: any = proxy.tileAreaDiv.querySelectorAll('.e-pv-organize-tile-draggedEle');
            draggedElements.forEach((element: any) => {
                element.classList.remove('e-pv-organize-tile-draggedEle');
            });
            proxy.selectedPageIndexes = [];
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        over: function (e: DropEventArgs): void {
        },
        out: function (e: DropEventArgs): void {
            const outerBorder: HTMLElement = document.querySelector('.e-pv-organize-outer-border');
            if (!isNullOrUndefined(outerBorder)) {
                outerBorder.classList.remove('e-pv-selected', 'e-pv-not-selected');
            }
        }
    });
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function insertRightButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canInsert) {
        const insertRightButton: HTMLElement = event.currentTarget as HTMLElement;
        const buttonId: string = insertRightButton.id.split('_insert_page_')[insertRightButton.id.split('_insert_page_').length - 1];
        const mainTileElement: HTMLElement = insertRightButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const buttonIdlist: string[] = buttonId.split('_');
        let subIndex: number = 0;
        let buttonIndex: number = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 1).toString(), 10)], 10);
        if (buttonIdlist.length > 1) {
            buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 2).toString(), 10)], 10);
        }
        subIndex = getNextSubIndex.call(this, mainTileElement.parentElement, buttonIndex);
        insertTempPage.call(this, pageOrder, false, mainTileElement);
        this.tileImageRender(buttonIndex, subIndex, pageOrder + 1, mainTileElement, true, false, true);
        updateTotalPageCount.call(this);
        updatePageNumber.call(this);
        if (this.isExtractToolbarVisible) {
            inputTextboxUpdate.call(this);
        }
        disableTileDeleteButton.call(this);
        disableTileCopyButton.call(this);
        updateSelectAllCheckbox.call(this);
        enableDisableToolbarItems.call(this);
        const clonedCollections: OrganizeDetails[] = [];
        clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === (pageOrder + 1); })));
        this.addOrganizeAction(clonedCollections, 'Insert Right', [], [], null, false);
    }
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function insertLeftButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canInsert) {
        const insetLeftButton: HTMLElement = event.currentTarget as HTMLElement;
        const buttonId: string = insetLeftButton.id.split('_insert_page_')[insetLeftButton.id.split('_insert_page_').length - 1];
        const mainTileElement: HTMLElement = insetLeftButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const buttonIdlist: string[] = buttonId.split('_');
        let subIndex: number = 0;
        let buttonIndex: number = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 1).toString(), 10)], 10);
        if (buttonIdlist.length > 1) {
            buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 2).toString(), 10)], 10);
        }
        subIndex = getNextSubIndex.call(this, mainTileElement.parentElement, buttonIndex);
        insertTempPage.call(this, pageOrder, true, mainTileElement);
        this.tileImageRender(buttonIndex, subIndex, pageOrder, mainTileElement, true, true, true);
        updateTotalPageCount.call(this);
        updatePageNumber.call(this);
        if (this.isExtractToolbarVisible) {
            inputTextboxUpdate.call(this);
        }
        disableTileDeleteButton.call(this);
        disableTileCopyButton.call(this);
        updateSelectAllCheckbox.call(this);
        enableDisableToolbarItems.call(this);
        const clonedCollections: OrganizeDetails[] = [];
        clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
        this.addOrganizeAction(clonedCollections, 'Insert Left', [], [], null, false);
    }
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function copyButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canCopy) {
        const copyButton: HTMLElement = event.currentTarget as HTMLElement;
        const buttonId: string = copyButton.id.split('_copy_page_')[copyButton.id.split('_copy_page_').length - 1];
        const mainTileElement: HTMLElement = copyButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const buttonIdlist: string[] = buttonId.split('_');
        let subIndex: number = 0;
        let buttonIndex: number = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 1).toString(), 10)], 10);
        if (buttonIdlist.length > 1) {
            buttonIndex = parseInt(buttonIdlist[parseInt((buttonIdlist.length - 2).toString(), 10)], 10);
        }
        subIndex = getNextSubIndex.call(this, mainTileElement.parentElement, buttonIndex);
        copyPage.call(this, pageOrder, mainTileElement);
        this.tileImageRender(buttonIndex, subIndex, pageOrder + 1, mainTileElement, true, false, false);
        updateTotalPageCount.call(this);
        updatePageNumber.call(this);
        if (this.isExtractToolbarVisible) {
            inputTextboxUpdate.call(this);
        }
        disableTileDeleteButton.call(this);
        const clonedCollections: OrganizeDetails[] = [];
        clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === (pageOrder + 1); })));
        this.addOrganizeAction(clonedCollections, 'Copy', [], [], null, false);
    }
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function deleteButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canDelete) {
        const deleteButton: HTMLElement = event.currentTarget as HTMLElement;
        const mainTileElement: HTMLElement = deleteButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const clonedCollections: OrganizeDetails[] = [];
        clonedCollections.push(clonedCollection(this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
        this.addOrganizeAction(clonedCollections, 'Delete', [], [], null, false);
        this.deletePageElement(mainTileElement);
        if (this.extractPagesInput) {
            this.extractPagesInput.value = '';
        }
        const extractBtn: HTMLButtonElement = document.getElementsByClassName('e-pv-extractbtn')[0] as HTMLButtonElement;
        if (extractBtn) {
            extractBtn.disabled = true;
        }
    }
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);

}

/**
 * @private
 * @param {number} currentPageIndex - It's describe about current page index.
 * @param {HTMLElement} tileDiv - It's describe about tile div.
 * @returns { void }
 */
export function copyPage(currentPageIndex: number, tileDiv: HTMLElement): void {
    if (this.pdfViewer.pageOrganizerSettings.canCopy) {
        const index: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => {
            return item.currentPageIndex === currentPageIndex;
        });
        let pageIndex: number;
        let pageSize: any;
        if (index !== -1) {
            pageIndex = this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex;
            pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageSize));
            if (pageIndex !== -1) {
                // eslint-disable-next-line
                if (!isNullOrUndefined(pageSize.rotation) && (getRotatedAngle.call(this, pageSize.rotation.toString()) == 90 ||
                    getRotatedAngle.call(this, pageSize.rotation.toString()) === 270)) {
                    const swapWidth: any = pageSize.width;
                    pageSize.width = pageSize.height;
                    pageSize.height = swapWidth;
                }
            }

            if (pageIndex === -1 && this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isCopied) {
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.slice(0, index + 1).
                    concat([new OrganizeDetails(currentPageIndex + 1, -1,
                                                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].copiedPageIndex,
                                                false, false, true, false, false, false,
                                                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].
                                                    rotateAngle, pageSize, false, null, null, null)],
                           this.tempOrganizePagesCollection.slice(index + 1));
            }
            else {
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.slice(0, index + 1).
                    concat([new OrganizeDetails(currentPageIndex + 1, -1, pageIndex,
                                                false, false, true, false, false, false,
                                                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].
                                                    rotateAngle, pageSize, false, null, null, null)],
                           this.tempOrganizePagesCollection.slice(index + 1));
            }
            this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].istargetCopied = true;
            this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                if (mapIndex > index + 1 && item.currentPageIndex != null) {
                    item.currentPageIndex = item.currentPageIndex + 1;
                }
                return item;
            });
            while (!isNullOrUndefined(tileDiv.nextElementSibling)) {
                const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
                let nextTileIndex: number = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
                nextTileIndex = nextTileIndex + 1;
                nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
                tileDiv = nextTileDiv;
            }
        }
    }
}

/**
 * @private
 * @param {number} currentPageIndex - It's describe about current page index.
 * @param {boolean} isBefore - It's describe about temp page insert position.
 * @param {HTMLElement} tileDiv - It's describe about tile div.
 * @returns { void }
 */
export function insertTempPage(currentPageIndex: number, isBefore: boolean, tileDiv: HTMLElement): void {
    if (this.pdfViewer.pageOrganizerSettings.canInsert) {
        const index: number =
            this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
        let beforeIndex: number;
        if (currentPageIndex !== 0) {
            beforeIndex =
                this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex - 1);
        }
        else {
            beforeIndex = index;
        }
        let pageIndex: number;
        let pageSize: any;
        if (isBefore) {
            pageIndex = this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].pageIndex;
            if (index - 1 >= 0 && !this.tempOrganizePagesCollection[parseInt((index - 1).toString(), 10)].isInserted) {
                this.tempOrganizePagesCollection[parseInt((index - 1).toString(), 10)].hasEmptyPageAfter = true;
            }
            if (index <= this.tempOrganizePagesCollection.length - 1 &&
                !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isInserted) {
                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].hasEmptyPageBefore = true;
            }
            pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].pageSize));
            if (pageIndex !== -1) {
                if (!isNullOrUndefined(pageSize.rotation) &&
                    (getRotatedAngle.call(this, pageSize.rotation.toString()) === 90 ||
                        getRotatedAngle.call(this, pageSize.rotation.toString()) === 270)) {
                    const swapWidth: any = pageSize.width;
                    pageSize.width = pageSize.height;
                    pageSize.height = swapWidth;
                }
            }
            this.tempOrganizePagesCollection = [...this.tempOrganizePagesCollection.slice(0, index),
                new OrganizeDetails(currentPageIndex, -1,
                                    this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex,
                                    true, false, false, false, false, false,
                                    this.tempOrganizePagesCollection[parseInt(beforeIndex.toString(), 10)].rotateAngle,
                                    pageSize, false, null, null, null),
                ...this.tempOrganizePagesCollection.slice(index)];
            this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                if ((mapIndex !== index && item.currentPageIndex >= currentPageIndex) && item.currentPageIndex != null) {
                    item.currentPageIndex = item.currentPageIndex + 1;
                }
                return item;
            });
            tileDiv.setAttribute('data-page-order', (currentPageIndex + 1).toString());
        }
        else {
            pageIndex = this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex;
            if (index >= 0 && !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isInserted) {
                this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].hasEmptyPageAfter = true;
            }
            if (index + 1 <= this.tempOrganizePagesCollection.length - 1 &&
                !this.tempOrganizePagesCollection[parseInt((index + 1).toString(), 10)].isInserted) {
                this.tempOrganizePagesCollection[parseInt((index + 1).toString(), 10)].hasEmptyPageBefore = true;
            }
            pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageSize));
            if (pageIndex !== -1) {
                if (!isNullOrUndefined(pageSize.rotation) &&
                    (getRotatedAngle.call(this, pageSize.rotation.toString()) === 90 ||
                        getRotatedAngle.call(this, pageSize.rotation.toString()) === 270)) {
                    const swapWidth: any = pageSize.width;
                    pageSize.width = pageSize.height;
                    pageSize.height = swapWidth;
                }
            }
            this.tempOrganizePagesCollection = [...this.tempOrganizePagesCollection.slice(0, index + 1),
                new OrganizeDetails(currentPageIndex + 1, -1,
                                    this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex, true, false,
                                    false, false, false, false,
                                    this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].rotateAngle,
                                    pageSize, false, null, null, null),
                ...this.tempOrganizePagesCollection.slice(index + 1)];
            this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                if ((mapIndex !== index + 1 && item.currentPageIndex >= currentPageIndex + 1) && item.currentPageIndex != null) {
                    item.currentPageIndex = item.currentPageIndex + 1;
                }
                return item;
            });
        }
        while (!isNullOrUndefined(tileDiv.nextElementSibling)) {
            const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
            let nextTileIndex: number = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
            nextTileIndex = nextTileIndex + 1;
            nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
            tileDiv = nextTileDiv;
        }
    }
}
