
import { isNullOrUndefined, Browser, getComponent } from '@syncfusion/ej2-base';
import { OrganizeDetails } from '../index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { enableDisableToolbarItems, updateSelectAllCheckbox } from './organize-toolbar';
import { setTileButtonEnableState } from './organize-thumbnail';
import { deleteTempPage } from './organize-undoredoutils';
import { updatePageNumber, updateTotalPageCount } from './organize-initialization';
import { formatPageRanges } from './organize-extract';

/**
 * @private
 * @param {number} startIndex - It's describe about a page start index.
 * @param {number} endIndex - It's describe about a page end index.
 * @returns { void }
 */
export function selectRange(startIndex: number, endIndex: number): void {
    const minIndex: number = Math.min(startIndex, endIndex);
    const maxIndex: number = Math.max(startIndex, endIndex);
    for (let i: number = minIndex; i <= maxIndex; i++) {
        const tile: HTMLElement = this.tileAreaDiv.children[parseInt(i.toString(), 10)] as HTMLElement;
        selectTile.call(this, tile);
    }
}

/**
 * @private
 * @param {HTMLElement} tile - It's describe about a select tile div.
 * @returns { void }
 */
export function selectTile(tile: HTMLElement): void {
    if (!isNullOrUndefined(tile)) {
        const checkbox: HTMLInputElement = tile.closest('.e-pv-organize-anchor-node').querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = true;
            setSelectionRingStyle.call(this, checkbox, tile);
        }
    }
}

/**
 * @private
 * @param {HTMLElement} tile - It's describe about a deselect tile div.
 * @returns { void }
 */
export function deselectTile(tile: HTMLElement): void {
    if (!isNullOrUndefined(tile)) {
        const checkbox: HTMLInputElement = tile.closest('.e-pv-organize-anchor-node').querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = false;
            setSelectionRingStyle.call(this, checkbox, tile);
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function clearSelection(): void {
    const selectedTiles: NodeListOf<Element> = document.querySelectorAll('.e-pv-organize-node-selection-ring');
    selectedTiles.forEach((tile: Element) => {
        const checkbox: HTMLInputElement = tile.closest('.e-pv-organize-anchor-node').querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
        checkbox.checked = false;
        setSelectionRingStyle.call(this, checkbox, tile as HTMLElement);
    });
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function selectAllTiles(): void {
    Array.from(this.tileAreaDiv.children).forEach((tile: Element) => {
        selectTile.call(this, tile as HTMLElement);
    });
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function disableTileDeleteButton(): void {
    if (this.tileAreaDiv.childElementCount === 1) {
        const mainTileElement: HTMLElement = this.tileAreaDiv.querySelector('.e-pv-organize-anchor-node') as HTMLElement;
        const deleteButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
        if (!isNullOrUndefined(deleteButton)) {
            deleteButton.setAttribute('disabled', 'disabled');
            deleteButton.firstElementChild.classList.add('e-disabled');
        }
    }
    else {
        for (let i: number = 0; i < this.tileAreaDiv.childElementCount; i++) {
            let mainTileElement: HTMLElement;
            if ((this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement).classList.contains('e-pv-organize-anchor-node')) {
                mainTileElement = this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
            }
            else {
                mainTileElement = (this.tileAreaDiv.childNodes[parseInt(i.toString(), 10)] as HTMLElement).querySelector('.e-pv-organize-anchor-node') as HTMLElement;
            }
            const deleteButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
            if (!isNullOrUndefined(deleteButton) && this.pdfViewer.pageOrganizerSettings.canDelete) {
                deleteButton.removeAttribute('disabled');
                deleteButton.firstElementChild.classList.remove('e-disabled');
            }
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function disableTileCopyRotateButton(): void {
    for (let i: number = 0; i < this.tempOrganizePagesCollection.length; i++) {
        const pageInfo: OrganizeDetails = this.tempOrganizePagesCollection[parseInt(i.toString(), 10)];
        if (pageInfo.isImportedDoc && !pageInfo.isDeleted && !pageInfo.currentPageIndex != null) {
            const mainTileElement: HTMLElement = this.tileAreaDiv.querySelector(`[data-page-order="${pageInfo.currentPageIndex.toString()}"]`);
            const rotateLeftButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-rotate-left-button') as HTMLButtonElement;
            const rotateRightButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-rotate-right-button') as HTMLButtonElement;
            const copyButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-copy-button') as HTMLButtonElement;
            if (!isNullOrUndefined(rotateLeftButton)) {
                rotateLeftButton.setAttribute('disabled', 'disabled');
                rotateLeftButton.firstElementChild.classList.add('e-disabled');
            }
            if (!isNullOrUndefined(rotateRightButton)) {
                rotateRightButton.setAttribute('disabled', 'disabled');
                rotateRightButton.firstElementChild.classList.add('e-disabled');
            }
            if (!isNullOrUndefined(copyButton)) {
                copyButton.setAttribute('disabled', 'disabled');
                copyButton.firstElementChild.classList.add('e-disabled');
            }
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function disableTileCopyButton(): void {
    for (let i: number = 0; i < this.tempOrganizePagesCollection.length; i++) {
        const pageInfo: OrganizeDetails = this.tempOrganizePagesCollection[parseInt(i.toString(), 10)];
        if (pageInfo.isInserted && !pageInfo.isDeleted && !pageInfo.currentPageIndex != null) {
            const mainTileElement: HTMLElement = this.tileAreaDiv.querySelector(`[data-page-order="${pageInfo.currentPageIndex.toString()}"]`);
            const copyButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-copy-button') as HTMLButtonElement;
            if (!isNullOrUndefined(copyButton)) {
                copyButton.setAttribute('disabled', 'disabled');
                copyButton.firstElementChild.classList.add('e-disabled');
            }
        }
    }
}

/**
 * @private
 * @param {any} args - It's describe about a event.
 * @returns { void }
 */
export function onSelectClick(args: any): void {
    const checkboxElement: HTMLInputElement = (event.currentTarget as HTMLElement).querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
    const pageElement: HTMLElement = checkboxElement.closest('.e-pv-organize-anchor-node') as HTMLElement;
    if (args.event.pointerType === 'mouse' || (!this.isTouchEvent && !(Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
        if (this.isClickedOnCheckBox && !isNullOrUndefined(checkboxElement) && !isNullOrUndefined(pageElement)) {
            if (pageElement) {
                setSelectionRingStyle.call(this, checkboxElement, pageElement);
            }
        }
        else if (!isNullOrUndefined(checkboxElement) && !isNullOrUndefined(pageElement)) {
            if (!(this.ctrlKey || this.shiftKey)) {
                const previouslySelectedTiles: NodeListOf<HTMLElement> = document.querySelectorAll('.e-pv-organize-node-selection-ring') as NodeListOf<HTMLElement>;
                if (previouslySelectedTiles.length > 0) {
                    for (let i: number = 0; i < previouslySelectedTiles.length; i++) {
                        const previousCheckbox: HTMLInputElement = previouslySelectedTiles[parseInt(i.toString(), 10)].closest('.e-pv-organize-anchor-node').querySelector('.e-pv-organize-tile-checkbox') as HTMLInputElement;
                        previousCheckbox.checked = false;
                        setSelectionRingStyle.call(this, previousCheckbox, previouslySelectedTiles[parseInt(i.toString(), 10)]);
                    }
                }
                if (!this.isClickedOnCheckBox) {
                    checkboxElement.checked = true;
                }
            }
            if (this.shiftKey) {
                checkboxElement.checked = true;
            }
            setSelectionRingStyle.call(this, checkboxElement, pageElement);
        }
    }
    else if (args.event.pointerType === 'touch' || this.isTouchEvent || (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
        if (!isNullOrUndefined(checkboxElement) && !isNullOrUndefined(pageElement)) {
            if (pageElement) {
                setSelectionRingStyle.call(this, checkboxElement, pageElement);
            }
            const buttonDiv: Element = pageElement.querySelector('.e-pv-organize-buttondiv');
            if (!isNullOrUndefined(buttonDiv) && buttonDiv.childElementCount > 1) {
                if (checkboxElement.checked) {
                    (buttonDiv as HTMLElement).style.display = 'flex';
                }
                else {
                    (buttonDiv as HTMLElement).style.display = 'none';
                }
                for (const button of Array.from(buttonDiv.children)) {
                    setTileButtonEnableState.call(this, button as HTMLElement);
                }
            }
        }
    }
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
    if (this.totalCheckedCount > 1) {
        for (let i: number = 0; i < pageElement.querySelector('.e-pv-organize-buttondiv').childElementCount; i++) {
            const id: string = pageElement.querySelector('.e-pv-organize-buttondiv').children[parseInt(i.toString(), 10)].id;
            if (id.split('_')[1] === 'insert') {
                (pageElement.querySelector('.e-pv-organize-buttondiv').children[parseInt(i.toString(), 10)] as HTMLElement).style.display = 'flex';
            }
            else {
                (pageElement.querySelector('.e-pv-organize-buttondiv').children[parseInt(i.toString(), 10)] as HTMLElement).style.display = 'none';
            }
        }
    }
}

/**
 * @private
 * @param {HTMLInputElement} checkbox - It's describe about a check box element.
 * @param {HTMLInputElement} anchornode - It's describe about a anchornode element.
 * @returns { void }
 */
export function setSelectionRingStyle(checkbox: HTMLInputElement, anchornode: HTMLElement): void {
    if (!checkbox.checked) {
        anchornode.classList.remove('e-pv-organize-node-selection-ring');
    } else {
        anchornode.classList.add('e-pv-organize-node-selection-ring');
    }
    const childrenArray: Element[] = Array.from(anchornode.children);
    for (const child of childrenArray) {
        const childArray: Element[] = Array.from(child.children);
        for (const subchild of childArray) {
            if (subchild.classList.contains('e-checkbox-wrapper')) {
                const id: any = ((subchild.getElementsByClassName('e-control e-checkbox e-lib')[0] as HTMLInputElement)).id;
                const cbObj: any = getComponent(document.getElementById(id), 'checkbox');
                if (checkbox.checked) {
                    (subchild as HTMLElement).style.display = 'block';
                    ((subchild as HTMLElement).children[0] as HTMLElement).style.display = 'block';
                    (cbObj as CheckBox).checked = true;
                }
                else {
                    (subchild as HTMLElement).style.display = 'none';
                    ((subchild as HTMLElement).children[0] as HTMLElement).style.display = 'none';
                    (cbObj as CheckBox).checked = false;
                    if (!isNullOrUndefined((subchild as HTMLElement).parentElement) && !isNullOrUndefined((subchild as HTMLElement).parentElement.lastElementChild) && (subchild as HTMLElement).parentElement.lastElementChild.classList.contains('e-pv-organize-buttondiv')) {
                        ((subchild as HTMLElement).parentElement.lastElementChild as HTMLElement).style.display = 'none';
                    }
                }
            }
        }
    }
    // If extract secondary toolbar is visible, sync the selected pages to the input box (only in client-side mode)
    if (this.pdfViewerBase && this.pdfViewerBase.clientSideRendering && this.isExtractToolbarVisible && this.extractPagesInput &&
        this.tileAreaDiv) {
        const selectedNodes: NodeListOf<Element> = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
        const selectedPages: number[] = [];
        selectedNodes.forEach((selectedElement: Element): void => {
            const mainTileElement: HTMLElement = (selectedElement as HTMLElement).closest('.e-pv-organize-anchor-node') as HTMLElement;
            if (mainTileElement) {
                const pageOrderAttr: string = mainTileElement.getAttribute('data-page-order');
                if (pageOrderAttr !== null) {
                    selectedPages.push(parseInt(pageOrderAttr, 10) + 1);
                }
            }
        });
        const formatted: string = formatPageRanges(selectedPages.join(','), this.tileAreaDiv.childElementCount);
        this.extractPagesInput.value = formatted;
        if (this.extractPagesInput.element) {
            this.extractPagesInput.element.value = formatted;
        }
        // Ensure Extract button enabled/disabled reflects current input value
        const createBtn: HTMLButtonElement = document.getElementsByClassName('e-pv-extractbtn')[0] as HTMLButtonElement;
        if (createBtn) {
            createBtn.disabled = (formatted.trim() === '');
        }
    }
}

/**
 * @private
 * @param {number} currentPageIndex - It's describe about a current page index.
 * @param {number} currentRotation - It's describe about a current page rotation.
 * @returns { void }
 */
export function updateTempRotationDetail(currentPageIndex: number, currentRotation: number): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        const tempIndex: number =
            this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
        if (tempIndex !== -1) {
            let rotateAngle: number = this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle +
                currentRotation;
            if (rotateAngle === -90) {
                rotateAngle = 0;
            }
            // If the pageIndex is found in the array
            this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle =
                Math.abs((this.tempOrganizePagesCollection[parseInt(tempIndex.toString(), 10)].rotateAngle +
                    currentRotation + 360) % 360);
        }
    }
    organizeWindowFocus.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function organizeWindowFocus(): void {
    const elementID: string = this.pdfViewer.element.id;
    document.getElementById(elementID + '_organize_window').focus();
}

/**
 * @private
 * @param {number[]} selectedPageIndexes - It's describe about a selected page indexes.
 * @param {number} hoveredIndex - It's describe about a hover page index.
 * @returns { void }
 */
export function isHoveredOnSelectedPages(selectedPageIndexes: number[], hoveredIndex: number): boolean {
    let isHoveredOnSelectedPageIndex: boolean = false;
    for (let i: number = 0; i < selectedPageIndexes.length; i++) {
        if (selectedPageIndexes[parseInt(i.toString(), 10)] === hoveredIndex) {
            isHoveredOnSelectedPageIndex = true;
            break;
        }
    }
    return isHoveredOnSelectedPageIndex;
}

/**
 * @private
 * @param {HTMLInputElement} mainTileElement - It's describe about a main tile element.
 * @returns { void }
 */
export function deletePageElement(mainTileElement: HTMLElement): void {
    if (this.pdfViewer.pageOrganizerSettings.canDelete && this.tileAreaDiv.childElementCount > 1) {
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        deleteTempPage.call(this, pageOrder, mainTileElement);
        const deleteButton: HTMLButtonElement = mainTileElement.querySelector('.e-pv-delete-button') as HTMLButtonElement;
        if (!isNullOrUndefined(deleteButton) && !isNullOrUndefined((deleteButton as any).ej2_instances) &&
            (deleteButton as any).ej2_instances.length > 0) {
            // We are destroying the button component to remove tooltip
            (deleteButton as any).ej2_instances[0].destroy();
        }
        this.tileAreaDiv.removeChild(mainTileElement);
        updateTotalPageCount.call(this);
        updatePageNumber.call(this);
        updateSelectAllCheckbox.call(this);
        disableTileDeleteButton.call(this);
    }
}

/**
 * @private
 * @returns { void }
 */
export function updateTileButtons(): void {
    if (!isNullOrUndefined(this.organizeDialog) && this.organizeDialog.visible) {
        const selectedTiles: Element[] = Array.from(this.organizeDialog.element.querySelectorAll('.e-pv-organize-node-selection-ring'));
        if (selectedTiles.length >= 1) {
            selectedTiles.forEach((tile: Element) => {
                const anchor: HTMLElement = tile as HTMLElement;
                const buttonDiv: HTMLElement = anchor.querySelector('.e-pv-organize-buttondiv') as HTMLElement;
                if (buttonDiv && (buttonDiv.style.display !== 'none')) {
                    const buttons: HTMLElement[] = Array.from(buttonDiv.children) as HTMLElement[];
                    buttons.forEach((button: HTMLElement) => setTileButtonEnableState.call(this, button));
                }
            });
        }
    }
}
