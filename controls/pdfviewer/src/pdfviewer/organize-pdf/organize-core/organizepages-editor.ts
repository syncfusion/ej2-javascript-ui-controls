import { OrganizeDetails, PageOrganizer } from '../organize-pdf';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { enableDisableToolbarItems, updateSelectAllCheckbox } from './organize-toolbar';
import { disableTileDeleteButton, updateTempRotationDetail } from './tile-interaction';
import { getNextSubIndex } from './organize-math-utils';
import { clonedCollection } from './organize-undoredoutils';
import { updatePageNumber, updateTotalPageCount } from './organize-initialization';
import { copyPage } from './organize-utils';
import { inputTextboxUpdate } from './organize-extract';

/**
 * @private
 * @param {any} event - It's describe about event.
 * @returns { void }
 */
export function pageDragDrop(event: any): void {
    const mainTileElement: HTMLElement = event.target.closest('.e-pv-organize-anchor-node') as HTMLElement;
    const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
    this.dragEndIndex = pageOrder;
    movePDFpages.call(this, this.selectedPageIndexes, this.dragEndIndex, this.isRightInsertion);
}

/**
 * @private
 * @param {number[]} selectedPagesIndexes - It's describe about selected pages indexes.
 * @param {number} dropIndex - It's describe about droped pages index.
 * @param {boolean} isRightInsertion - It's describe about insert page right side or not.
 * @returns { void }
 */
export function movePDFpages(selectedPagesIndexes: number[], dropIndex: number, isRightInsertion: boolean): void {
    // Checking if the dropIndex is equal to any of the selected pages indexes
    let isDropIndexSelected: boolean = false;
    for (const index of selectedPagesIndexes) {
        if (index === dropIndex) {
            isDropIndexSelected = true;
            break;
        }
    }
    // If the dropIndex is one of the selected pages, return early
    if (isDropIndexSelected) {
        return;
    }
    const clonedCollections: OrganizeDetails[] = [];
    for (let i: number = 0; i < this.selectedPageIndexes.length; i++) {
        clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => {
                return item.currentPageIndex ===
                    this.selectedPageIndexes[parseInt(i.toString(), 10)];
            })));
    }
    const cloneSelectedIndexes: number[] = [];
    cloneSelectedIndexes.push(...this.selectedPageIndexes);
    this.addOrganizeAction(clonedCollections, 'Move Pages', [], cloneSelectedIndexes, this.dragEndIndex, this.isRightInsertion);
    rearrangePages.call(this, selectedPagesIndexes, dropIndex, isRightInsertion);
}

/**
 * @private
 * @param {number[]} selectedPagesIndexes - It's describe about selected pages indexes.
 * @param {number} dropIndex - It's describe about droped pages index.
 * @param {boolean} isRightInsertion - It's describe about insert page right side or not.
 * @returns { void }
 */
export function rearrangePages(selectedPagesIndexes: number[], dropIndex: number, isRightInsertion: boolean): void {
    // eslint-disable-next-line
    const proxy: any = this;
    this.tempOrganizePagesCollection =
        updateCollection.call(this, this.tempOrganizePagesCollection, selectedPagesIndexes, dropIndex, isRightInsertion);
    const pages: any = Array.from(this.tileAreaDiv.children);
    selectedPagesIndexes.sort((a: number, b: number): number => a - b);
    const draggedElements: any = selectedPagesIndexes.map((index: number) => pages[parseInt(index.toString(), 10)]);
    let adjustedDropIndex: number = isRightInsertion ? dropIndex + 1 : dropIndex;
    draggedElements.forEach((element: any) => {
        pages.splice(adjustedDropIndex, 0, element);
        adjustedDropIndex += 1;
    });
    for (let i: number = 0; i < selectedPagesIndexes.length; i++) {
        if (selectedPagesIndexes[parseInt(i.toString(), 10)] >= dropIndex) {
            selectedPagesIndexes[parseInt(i.toString(), 10)] += draggedElements.length;
        }
    }
    selectedPagesIndexes.sort((a: number, b: number): number => b - a).forEach((index: number) => {
        pages.splice(index, 1);
    });
    this.tileAreaDiv.innerHTML = '';
    pages.forEach((page: any, index: number) => {
        proxy.tileAreaDiv.appendChild(page);
        page.setAttribute('data-page-order', index.toString());
    });
    updatePageNumber.call(this);
}

/**
 * @private
 * @param {OrganizeDetails[]} collection - It's describe about organize page action collection.
 * @param {number[]} selectedIndexes - It's describe about selected pages indexes.
 * @param {number} dropIndex - It's describe about droped pages index.
 * @param {boolean} isRightInsertion - It's describe about insert page right side or not.
 * @returns { OrganizeDetails[] } - It's describe about organize page updated collection.
 */
export function updateCollection(collection: OrganizeDetails[], selectedIndexes: number[],
                                 dropIndex: number, isRightInsertion: boolean): OrganizeDetails[] {
    const collectionCopy: OrganizeDetails[] = [];
    let index: number = 0;
    const isAlreadyAdded: OrganizeDetails[] = [];
    selectedIndexes.sort();
    dropIndex = isRightInsertion ? dropIndex + 1 : dropIndex;
    let selectedIndexesUnderDropIndexCount: number = 0;
    selectedIndexes.forEach((index: number) => {
        if (index < dropIndex) {
            selectedIndexesUnderDropIndexCount++;
        }
    });
    const sortedCollection: OrganizeDetails[] = collection.sort((a: any, b: any) => this.sorting(a['currentPageIndex'], b['currentPageIndex']));
    const nullCurrentPageIndexCount: number = sortedCollection.filter((item: OrganizeDetails) => item.currentPageIndex === null).length;
    sortedCollection.forEach(function (item: OrganizeDetails): void {
        if (item.currentPageIndex === null) {
            collectionCopy.push({ ...item });
        }
    });
    //Updated currentPageIndex for the pages before drop index
    for (let i: number = 0; i < sortedCollection.length; i++) {
        // checking the given Currentpageindex exists in the selected indexes
        let isCurrentPageIndexInSelectedIndexes: boolean = false;
        for (let j: number = 0; j < selectedIndexes.length; j++) {
            if (sortedCollection[parseInt(i.toString(), 10)].currentPageIndex === selectedIndexes[parseInt(j.toString(), 10)]) {
                isCurrentPageIndexInSelectedIndexes = true;
                break;
            }
        }
        if (index === dropIndex - selectedIndexesUnderDropIndexCount) {
            break;
        }
        if (!isCurrentPageIndexInSelectedIndexes &&
            !containsPageDetails(sortedCollection[parseInt(i.toString(), 10)], isAlreadyAdded)) {
            if (!isNullOrUndefined(sortedCollection[parseInt(i.toString(), 10)].currentPageIndex)) {
                collectionCopy.push({ ...sortedCollection[parseInt(i.toString(), 10)] });
                isAlreadyAdded.push(sortedCollection[parseInt(i.toString(), 10)]);
                collectionCopy[collectionCopy.length - 1].currentPageIndex = index;
                index = index + 1;
            }
        }
    }
    //Updated currentPageIndex for the selected pages in the drop index
    for (let i: number = 0; i < sortedCollection.length; i++) {
        let isCurrentPageIndexInSelectedIndexes: boolean = false;
        for (let j: number = 0; j < selectedIndexes.length; j++) {
            if (sortedCollection[parseInt(i.toString(), 10)].currentPageIndex === selectedIndexes[parseInt(j.toString(), 10)]) {
                isCurrentPageIndexInSelectedIndexes = true;
                break;
            }
        }
        if (isCurrentPageIndexInSelectedIndexes &&
            !containsPageDetails(sortedCollection[parseInt(i.toString(), 10)], isAlreadyAdded)) {
            collectionCopy.push({ ...sortedCollection[parseInt(i.toString(), 10)] });
            isAlreadyAdded.push(sortedCollection[parseInt(i.toString(), 10)]);
            collectionCopy[collectionCopy.length - 1].currentPageIndex = index;
            index = index + 1;
        }
    }
    //Updated currentPageIndex for the pages after drop index
    for (let i: number = nullCurrentPageIndexCount; i < sortedCollection.length; i++) {
        // checking the given Currentpageindex exists in the selected indexes
        let isCurrentPageIndexInSelectedIndexes: boolean = false;
        for (let j: number = 0; j < selectedIndexes.length; j++) {
            if (sortedCollection[parseInt(i.toString(), 10)].currentPageIndex === selectedIndexes[parseInt(j.toString(), 10)]) {
                isCurrentPageIndexInSelectedIndexes = true;
                break;
            }
        }
        if (!isCurrentPageIndexInSelectedIndexes &&
            !containsPageDetails(sortedCollection[parseInt(i.toString(), 10)], isAlreadyAdded)) {
            collectionCopy.push({ ...sortedCollection[parseInt(i.toString(), 10)] });
            isAlreadyAdded.push(sortedCollection[parseInt(i.toString(), 10)]);
            collectionCopy[collectionCopy.length - 1].currentPageIndex = index;
            index = index + 1;
        }
    }
    return collectionCopy;
}

/**
 * @private
 * @param {OrganizeDetails} value - It's describe about organize page details.
 * @param {OrganizeDetails[]} array - It's describe about selected pages indexes.
 * @returns { void }
 */
export function containsPageDetails(value: OrganizeDetails, array: OrganizeDetails[]): boolean {
    let pageIndexFound: boolean = false;
    let currentPageIndexFound: boolean = false;
    for (let i: number = 0; i < array.length; i++) {
        if (array[parseInt(i.toString(), 10)].pageIndex === value.pageIndex) {
            pageIndexFound = true;
        }
        if (array[parseInt(i.toString(), 10)].currentPageIndex === value.currentPageIndex) {
            currentPageIndexFound = true;
        }
    }
    return pageIndexFound && currentPageIndexFound;
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function rotateButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        const rotateButton: HTMLElement = event.currentTarget as HTMLElement;
        const mainTileElement: HTMLElement = rotateButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        if (imageContainer) {
            // Get the current rotation angle of the image container (if any)
            let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
            // Calculate the new rotation angle (add 90 degrees)
            currentRotation += 90;
            // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
            if (currentRotation >= 360) {
                currentRotation = 0;
            }
            // Apply the rotation to the image container
            imageContainer.style.transform = `rotate(${currentRotation}deg)`;
            // Update the rotation value in the pageDetails collection
            updateTempRotationDetail.call(this, pageOrder, 90);
            const clonedCollections: OrganizeDetails[] = [];
            clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
            this.addOrganizeAction(clonedCollections, 'Rotate Right', [], [], null, false);
        }
    }
}

/**
 * @private
 * @param {MouseEvent} event - It's describe about event.
 * @returns { void }
 */
export function rotateLeftButtonClick(event: MouseEvent): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        const rotateButton: HTMLElement = event.currentTarget as HTMLElement;
        const mainTileElement: HTMLElement = rotateButton.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        if (imageContainer) {
            // Get the current rotation angle of the image container (if any)
            let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
            // Calculate the new rotation angle (add 90 degrees)
            currentRotation -= 90;
            // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
            if (currentRotation >= 360) {
                currentRotation = 0;
            }
            if (currentRotation === -90) {
                currentRotation = 270;
            }
            // Apply the rotation to the image container
            imageContainer.style.transform = `rotate(${currentRotation}deg)`;
            // Update the rotation value in the pageDetails collection
            updateTempRotationDetail.call(this, pageOrder, -90);
            const clonedCollections: OrganizeDetails[] = [];
            clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
            this.addOrganizeAction(clonedCollections, 'Rotate Left', [], [], null, false);
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function onToolbarRightButtonClick(): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
            const mainTileElement: any = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)];
            // Type assertion to HTMLElement
            if (mainTileElement instanceof HTMLElement && mainTileElement.classList.contains('e-pv-organize-node-selection-ring')) {
                const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
                const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
                if (imageContainer) {
                    // Get the current rotation angle of the image container (if any)
                    let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                    // Calculate the new rotation angle (add 90 degrees)
                    currentRotation += 90;
                    // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                    if (currentRotation >= 360) {
                        currentRotation = 0;
                    }
                    // Apply the rotation to the image container
                    imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                    // Update the rotation value in the pageDetails collection
                    updateTempRotationDetail.call(this, pageOrder, 90);
                    this.toolbarUndoRedoCollection.
                        push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                            find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
                }
            }
        }
        this.addOrganizeAction(null, 'Toolbar Rotate Right', this.toolbarUndoRedoCollection, [], null, false);
        this.toolbarUndoRedoCollection = [];
    }
}

/**
 * @private
 * @returns { void }
 */
export function onToolbarLeftButtonClick(): void {
    // eslint-disable-next-line
    const proxy: PageOrganizer = this;
    for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
        const mainTileElement: any = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)];
        // Type assertion to HTMLElement
        if (mainTileElement instanceof HTMLElement && mainTileElement.classList.contains('e-pv-organize-node-selection-ring')) {
            const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
            const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            if (imageContainer) {
                // Get the current rotation angle of the image container (if any)
                let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                // Calculate the new rotation angle (add 90 degrees)
                currentRotation -= 90;
                // Ensure that the rotation stays within the desired range (0, 90, 180, 270, 360)
                if (currentRotation >= 360) {
                    currentRotation = 0;
                }
                if (currentRotation === -90) {
                    currentRotation = 270;
                }
                // Apply the rotation to the image container
                imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                // Update the rotation value in the pageDetails collection
                updateTempRotationDetail.call(this, pageOrder, -90);
                this.toolbarUndoRedoCollection.
                    push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                        find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
            }
        }
    }
    this.addOrganizeAction(null, 'Toolbar Rotate Left', this.toolbarUndoRedoCollection, [], null, false);
    this.toolbarUndoRedoCollection = [];
}

/**
 * @private
 * @returns { void }
 */
export function onToolbarCopyButtonClick(): void {
    if (this.pdfViewer.pageOrganizerSettings.canCopy) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        for (let i: number = 0; i < proxy.tileAreaDiv.childElementCount; i++) {
            const mainTileElement: HTMLElement = proxy.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
            if (mainTileElement instanceof HTMLElement && mainTileElement.classList.contains('e-pv-organize-node-selection-ring')) {
                const pageId: string = mainTileElement.id.split('anchor_page_')[mainTileElement.id.split('anchor_page_').length - 1];
                const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
                const pageIdlist: string[] = pageId.split('_');
                let subIndex: number = 0;
                let pageIndex: number = parseInt(pageIdlist[parseInt((pageIdlist.length - 1).toString(), 10)], 10);
                if (pageIdlist.length > 1) {
                    pageIndex = parseInt(pageIdlist[parseInt((pageIdlist.length - 2).toString(), 10)], 10);
                }
                subIndex = getNextSubIndex.call(this, mainTileElement.parentElement, pageIndex);
                copyPage.call(this, pageOrder, mainTileElement);
                this.tileImageRender(pageIndex, subIndex, pageOrder + 1, mainTileElement, true, false, false);
                updatePageNumber.call(this);
                this.toolbarUndoRedoCollection.
                    push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                        find((item: OrganizeDetails) => { return item.currentPageIndex === (pageOrder + 1); })));
            }
        }
        updateTotalPageCount.call(this);
        if (this.isExtractToolbarVisible) {
            inputTextboxUpdate.call(this);
        }
        disableTileDeleteButton.call(this);
        updateSelectAllCheckbox.call(this);
        enableDisableToolbarItems.call(this);
        this.addOrganizeAction(null, 'Toolbar Copy', this.toolbarUndoRedoCollection, [], null, false);
        this.toolbarUndoRedoCollection = [];
    }
}

/**
 * @private
 * @returns { void }
 */
export function onToolbarDeleteButtonClick(): void {
    if (this.pdfViewer.pageOrganizerSettings.canDelete) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        const selectedNodes: NodeListOf<Element> = proxy.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
        selectedNodes.forEach((selectedElements: HTMLElement) => {
            const mainTileElement: HTMLElement = selectedElements.closest('.e-pv-organize-anchor-node') as HTMLElement;
            const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            this.toolbarUndoRedoCollection.
                push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                    find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
        });
        selectedNodes.forEach((selectedElement: HTMLElement) => {
            const mainTileElement: HTMLElement = selectedElement.closest('.e-pv-organize-anchor-node') as HTMLElement;
            proxy.deletePageElement(mainTileElement);
        });
    }
    // If extract toolbar is visible, clear its input and disable the footer extract button
    if (this.isExtractToolbarVisible) {
        if (this.extractPagesInput) {
            this.extractPagesInput.value = '';
        }
        const extractBtn: HTMLButtonElement = document.getElementsByClassName('e-pv-extractbtn')[0] as HTMLButtonElement;
        if (extractBtn) {
            extractBtn.disabled = true;
        }
    }
    enableDisableToolbarItems.call(this);
    this.addOrganizeAction(null, 'Toolbar Delete', this.toolbarUndoRedoCollection, [], null, false);
    this.toolbarUndoRedoCollection = [];
}
