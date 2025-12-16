import { ItemModel } from '@syncfusion/ej2-navigations';
import { OrganizeDetails } from '../organize-pdf';
import { enableDisableToolbarItems, enableToolbarItem, updateSelectAllCheckbox } from './organize-toolbar';
import { rearrangePages } from './organizepages-editor';
import { disableTileCopyButton, disableTileCopyRotateButton, disableTileDeleteButton, updateTempRotationDetail } from './tile-interaction';
import { updatePageDetail } from './organize-initialization';
import { deleteTempPage, insertRemovedPages, undoDeletedPage } from './organize-undoredoutils';
import { inputTextboxUpdate } from './organize-extract';

interface IActionOrganizeElements {
    action: string;
    UndoRedoTileActions: OrganizeDetails[];
    toolbarActions: OrganizeDetails[];
    selectedPagesIndexes: number[],
    dropIndex: number,
    isRightInsertion: boolean
}

/**
 * @param {OrganizeDetails[]} UndoRedoTileActions - Specifies the details of the action occured page
 * @param {string} actionString - Specifies the Name of the action
 * @param {OrganizeDetails[]} toolbarActions - Collection to store multiple action as single action
 * @param {number[]} selectedPageIndexes - Collection to store selected page index
 * @param {number} dropIndex - Specifies where the page should be dropped
 * @param {boolean} isRightInsertion - Used to check whether the page should be dropped at right
 * @returns {void}
 * @private
 */
export function addOrganizeAction(
    UndoRedoTileActions: OrganizeDetails[], actionString: string,
    toolbarActions: OrganizeDetails[], selectedPageIndexes: number[], dropIndex: number, isRightInsertion: boolean): void {
    const action: IActionOrganizeElements = {
        UndoRedoTileActions: UndoRedoTileActions, action: actionString, toolbarActions: toolbarActions,
        selectedPagesIndexes: selectedPageIndexes, dropIndex: dropIndex,
        isRightInsertion: isRightInsertion

    };
    this.undoOrganizeCollection.push(action);
    this.redoOrganizeCollection = [];
    updateUndoRedoButtons.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function updateUndoRedoButtons(): void {
    this.toolbar.items.forEach((item: ItemModel) => {
        if (item.id === this.pdfViewer.element.id + '_undo_organize_Pages') {
            enableToolbarItem.call(this, item.id, (this.undoOrganizeCollection.length > 0));
        }
        else if (item.id === this.pdfViewer.element.id + '_redo_organize_Pages') {
            enableToolbarItem.call(this, item.id, (this.redoOrganizeCollection.length > 0));
        }
    });
}

/**
 * @private
 * @returns { void }
 */
export function restorePagesBeforeZoom(): void {
    const undoCollectionLength: number = this.undoOrganizeCollection.length;
    if (undoCollectionLength > 0) {
        /* eslint-disable security/detect-object-injection */
        for (let index: number = undoCollectionLength - 1; index >= 0; index--) {
            const undoActionObject: IActionOrganizeElements = this.undoOrganizeCollection[index];
            undoActionHandler.call(this, undoActionObject);
        }
        /* eslint-enable security/detect-object-injection */
    }
}

/**
 * @private
 * @returns { void }
 */
export function restorePagesAfterZoom(): void {
    const undoCollectionLength: number = this.undoOrganizeCollection.length;
    if (undoCollectionLength > 0) {
        /* eslint-disable security/detect-object-injection */
        for (let index: number = 0; index < undoCollectionLength; index++) {
            const redoActionObject: IActionOrganizeElements = this.undoOrganizeCollection[index];
            redoActionHandler.call(this, redoActionObject);
        }
        /* eslint-enable security/detect-object-injection */
    }
}

/**
 * @private
 * @param {IActionOrganizeElements} undoActionObject - It's describe about undo action object.
 * @returns { void }
 */
export function undoActionHandler(undoActionObject: IActionOrganizeElements): void {
    if (undoActionObject) {
        const actionObject: IActionOrganizeElements = JSON.parse(JSON.stringify(undoActionObject));
        switch (actionObject.action) {
        case 'Insert Right':
        case 'Insert Left':
        case 'Import Pages':
        case 'Copy':
            removePage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex);
            break;
        case 'Rotate Right':
            rotateImage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex, -90);
            break;
        case 'Rotate Left':
            rotateImage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex, 90);
            break;
        case 'Delete':
            {
                const mainTileElement: HTMLElement =
                    this.tileAreaDiv.childNodes[parseInt(actionObject.UndoRedoTileActions[0].
                        currentPageIndex.toString(), 10)] as HTMLElement;
                if (actionObject.UndoRedoTileActions[0].isCopied) {
                    insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                            actionObject.UndoRedoTileActions[0].currentPageIndex,
                                            mainTileElement);
                    this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                         actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement,
                                         true, true, false);
                }
                else if (actionObject.UndoRedoTileActions[0].isInserted) {
                    insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                            actionObject.UndoRedoTileActions[0].currentPageIndex,
                                            mainTileElement);
                    this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                         actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement,
                                         true, true, true);
                }
                else if (actionObject.UndoRedoTileActions[0].isImportedDoc) {
                    insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                            actionObject.UndoRedoTileActions[0].currentPageIndex,
                                            mainTileElement);
                    this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                         actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement,
                                         true, true, false, true, actionObject.UndoRedoTileActions[0].documentName);
                }
                else if (!actionObject.UndoRedoTileActions[0].isCopied && !actionObject.UndoRedoTileActions[0].isInserted
                    && !actionObject.UndoRedoTileActions[0].isImportedDoc) {
                    undoDeletedPage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex,
                                         actionObject.UndoRedoTileActions[0].pageIndex,
                                         actionObject.UndoRedoTileActions[0].rotateAngle, mainTileElement);
                    this.tileImageRender(actionObject.UndoRedoTileActions[0].pageIndex, 0,
                                         actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement, true, true, false);
                }
                updatePageDetail.call(this);
            }
            break;
        case 'Move Pages':
        {
            const dropIndex: number = actionObject.dropIndex;
            const beforeDropIndex: { currentPageIndex: number, selectedIndexes: number[] }[] = [];
            const afterDropIndex: { currentPageIndex: number, selectedIndexes: number[] }[] = [];
            const processedIndexes: Set<number> = new Set();
            // Helper function to check if index is in range
            const isInRange: any = (start: number, end: number, value: number): boolean => value >= start && value <= end;

            // Collect all selected indexes
            for (let i: number = 0; i < actionObject.UndoRedoTileActions.length; i++) {
                const action: OrganizeDetails = actionObject.UndoRedoTileActions[parseInt(i.toString(), 10)];
                const selectedItem: OrganizeDetails = this.tempOrganizePagesCollection
                    .find((item: OrganizeDetails) => {
                        if (action.isCopied) {
                            return item.copiedPageIndex === action.copiedPageIndex && isInRange(
                                dropIndex - actionObject.selectedPagesIndexes.length,
                                dropIndex + actionObject.selectedPagesIndexes.length,
                                item.currentPageIndex
                            ) && !processedIndexes.has(item.currentPageIndex);
                        } else if (action.isInserted) {
                            return item.copiedPageIndex === action.copiedPageIndex && item.isInserted && isInRange(
                                dropIndex - actionObject.selectedPagesIndexes.length,
                                dropIndex + actionObject.selectedPagesIndexes.length,
                                item.currentPageIndex
                            ) && !processedIndexes.has(item.currentPageIndex);
                        }
                        else if (action.isImportedDoc) {
                            return item.copiedPageIndex === action.copiedPageIndex && item.isImportedDoc && isInRange(
                                dropIndex - actionObject.selectedPagesIndexes.length,
                                dropIndex + actionObject.selectedPagesIndexes.length,
                                item.currentPageIndex
                            ) && !processedIndexes.has(item.currentPageIndex);
                        } else {
                            return item.pageIndex === action.pageIndex;
                        }
                    });
                if (selectedItem) {
                    const selectedIndexes: number[] = [selectedItem.currentPageIndex];
                    processedIndexes.add(selectedItem.currentPageIndex);
                    if (dropIndex < action.currentPageIndex) {
                        afterDropIndex.push({ currentPageIndex: action.currentPageIndex, selectedIndexes: selectedIndexes });
                    } else {
                        beforeDropIndex.push({ currentPageIndex: action.currentPageIndex, selectedIndexes: selectedIndexes });
                    }
                }
            }
            // Sort and rearrange for beforeDropIndex
            if (beforeDropIndex.length > 0) {
                // Sort in descending order based on selectedIndexes and rearrange
                beforeDropIndex.sort((a: any, b: any) => a.currentPageIndex - b.currentPageIndex);
                for (let j: number = 0; j < beforeDropIndex.length; j++) {
                    // eslint-disable-next-line max-len
                    rearrangePages.call(this, beforeDropIndex[parseInt(j.toString(), 10)].selectedIndexes, beforeDropIndex[parseInt(j.toString(), 10)].currentPageIndex, beforeDropIndex[parseInt(j.toString(), 10)].currentPageIndex > beforeDropIndex[parseInt(j.toString(), 10)].selectedIndexes[0]);
                }
            }
            // Sort and rearrange for afterDropIndex
            if (afterDropIndex.length > 0) {
                // Sort in ascending order based on currentPageIndex and rearrange
                afterDropIndex.sort((a: any, b: any) => b.currentPageIndex - a.currentPageIndex);
                for (let j: number = 0; j < afterDropIndex.length; j++) {
                    rearrangePages.call(this, afterDropIndex[parseInt(j.toString(), 10)].selectedIndexes,
                                        afterDropIndex[parseInt(j.toString(), 10)].currentPageIndex,
                                        afterDropIndex[parseInt(j.toString(), 10)].currentPageIndex >
                        afterDropIndex[parseInt(j.toString(), 10)].selectedIndexes[0]);
                }
            }
            break;
        }
        case 'Toolbar Rotate Right':
            rotateImages.call(this, actionObject, -90);
            break;
        case 'Toolbar Rotate Left':
            rotateImages.call(this, actionObject, 90);
            break;
        case 'Toolbar Copy':
            if (actionObject.toolbarActions.length > 0) {
                for (let i: number = actionObject.toolbarActions.length - 1; i >= 0; i--) {
                    const mainTileElement: HTMLElement =
                        this.tileAreaDiv.childNodes[parseInt(actionObject.toolbarActions[parseInt(i.toString(), 10)].
                            currentPageIndex.toString(), 10)] as HTMLElement;
                    deleteTempPage.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex, mainTileElement);
                    this.tileAreaDiv.removeChild(mainTileElement);
                    updatePageDetail.call(this);
                }
            }
            disableTileDeleteButton.call(this);
            break;
        case 'Toolbar Delete':
            {
                if (actionObject.toolbarActions.length > 0) {
                    for (let i: number = 0; i < actionObject.toolbarActions.length; i++) {
                        const mainTileElement: HTMLElement =
                            this.tileAreaDiv.childNodes[parseInt(actionObject.toolbarActions[parseInt(i.toString(), 10)].
                                currentPageIndex.toString(), 10)] as HTMLElement;
                        if (actionObject.toolbarActions[parseInt(i.toString(), 10)].isCopied) {
                            insertRemovedPages.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)],
                                                    actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                    mainTileElement);
                            this.tileImageRender(actionObject.toolbarActions[parseInt(i.toString(), 10)].copiedPageIndex, 0,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                 mainTileElement, true, true, false);
                        }
                        else if (actionObject.toolbarActions[parseInt(i.toString(), 10)].isInserted) {
                            insertRemovedPages.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)],
                                                    actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                    mainTileElement);
                            this.tileImageRender(actionObject.toolbarActions[parseInt(i.toString(), 10)].copiedPageIndex, 0,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                 mainTileElement,
                                                 true, true, true);
                        }
                        else if (actionObject.toolbarActions[parseInt(i.toString(), 10)].isImportedDoc) {
                            insertRemovedPages.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)],
                                                    actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                    mainTileElement);
                            this.tileImageRender(actionObject.toolbarActions[parseInt(i.toString(), 10)].copiedPageIndex, 0,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                 mainTileElement, true, true, false, true,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].documentName);
                        }
                        else if (!actionObject.toolbarActions[parseInt(i.toString(), 10)].isCopied &&
                            !actionObject.toolbarActions[parseInt(i.toString(), 10)].isInserted &&
                            !actionObject.toolbarActions[parseInt(i.toString(), 10)].isImportedDoc) {
                            undoDeletedPage.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].pageIndex,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].rotateAngle, mainTileElement);
                            this.tileImageRender(actionObject.toolbarActions[parseInt(i.toString(), 10)].pageIndex, 0,
                                                 actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                 mainTileElement, true, true, false);
                        }
                        updatePageDetail.call(this);
                    }
                }
                disableTileDeleteButton.call(this);
            }
            break;
        }
    }
}

/**
 * @private
 * @param {IActionOrganizeElements} redoActionObject - It's describe about redo action object.
 * @returns { void }
 */
export function redoActionHandler(redoActionObject: IActionOrganizeElements): void {
    if (redoActionObject) {
        const actionObject: IActionOrganizeElements = JSON.parse(JSON.stringify(redoActionObject));
        switch (actionObject.action) {
        case 'Insert Right':
        case 'Insert Left':
            {
                const mainTileElement: HTMLElement =
                    this.tileAreaDiv.childNodes[parseInt(actionObject.UndoRedoTileActions[0].
                        currentPageIndex.toString(), 10)] as HTMLElement;
                insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                        actionObject.UndoRedoTileActions[0].currentPageIndex,
                                        mainTileElement);
                this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                     actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement, true, true, true);
                disableTileCopyButton.call(this);
                updatePageDetail.call(this);
            }
            break;
        case 'Rotate Right':
            rotateImage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex, 90);
            break;
        case 'Rotate Left':
            rotateImage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex, -90);
            break;
        case 'Copy':
            {
                const mainTileElement: HTMLElement =
                    this.tileAreaDiv.childNodes[parseInt(actionObject.UndoRedoTileActions[0].
                        currentPageIndex.toString(), 10)] as HTMLElement;
                insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                        actionObject.UndoRedoTileActions[0].currentPageIndex,
                                        mainTileElement);
                this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                     actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement, true, true, false);
                updatePageDetail.call(this);
            }
            break;
        case 'Import Pages':
            {
                const mainTileElement: HTMLElement =
                    this.tileAreaDiv.childNodes[parseInt(actionObject.UndoRedoTileActions[0].
                        currentPageIndex.toString(), 10)] as HTMLElement;
                insertRemovedPages.call(this, actionObject.UndoRedoTileActions[0],
                                        actionObject.UndoRedoTileActions[0].currentPageIndex,
                                        mainTileElement);
                this.tileImageRender(actionObject.UndoRedoTileActions[0].copiedPageIndex, 0,
                                     actionObject.UndoRedoTileActions[0].currentPageIndex, mainTileElement,
                                     true, true, false, true, actionObject.UndoRedoTileActions[0].documentName);
                disableTileCopyRotateButton.call(this);
                updatePageDetail.call(this);
            }
            break;
        case 'Delete':
            removePage.call(this, actionObject.UndoRedoTileActions[0].currentPageIndex);
            break;
        case 'Move Pages':
            rearrangePages.call(this, actionObject.selectedPagesIndexes, actionObject.dropIndex, actionObject.isRightInsertion);
            break;
        case 'Toolbar Rotate Right':
            rotateImages.call(this, actionObject, 90);
            break;
        case 'Toolbar Rotate Left':
            rotateImages.call(this, actionObject, -90);
            break;
        case 'Toolbar Copy':
            {
                if (actionObject.toolbarActions.length > 0) {
                    for (let i: number = 0; i < actionObject.toolbarActions.length; i++) {
                        const mainTileElement: HTMLElement =
                            this.tileAreaDiv.childNodes[parseInt(actionObject.toolbarActions[parseInt(i.toString(), 10)].
                                currentPageIndex.toString(), 10)] as HTMLElement;
                        insertRemovedPages.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)],
                                                actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                                mainTileElement);
                        this.tileImageRender(actionObject.toolbarActions[parseInt(i.toString(), 10)].copiedPageIndex, 0,
                                             actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                             mainTileElement, true, true, false);
                        updatePageDetail.call(this);
                    }
                }
                disableTileDeleteButton.call(this);
            }
            break;
        case 'Toolbar Delete':
            if (actionObject.toolbarActions.length > 0) {
                for (let i: number = actionObject.toolbarActions.length - 1; i >= 0; i--) {
                    const mainTileElement: HTMLElement =
                        this.tileAreaDiv.childNodes[parseInt(actionObject.toolbarActions[parseInt(i.toString(), 10)].
                            currentPageIndex.toString(), 10)] as HTMLElement;
                    deleteTempPage.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex, mainTileElement);
                    this.tileAreaDiv.removeChild(mainTileElement);
                    updatePageDetail.call(this);
                }
            }
            disableTileDeleteButton.call(this);
            break;
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function undo(): void {
    const undoActionObject: IActionOrganizeElements = this.undoOrganizeCollection.pop();
    undoActionHandler.call(this, undoActionObject);
    if (this.isExtractToolbarVisible) {
        inputTextboxUpdate.call(this);
    }
    this.redoOrganizeCollection.push(undoActionObject);
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
    updateUndoRedoButtons.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function redo(): void {
    const redoActionObject: IActionOrganizeElements = this.redoOrganizeCollection.pop();
    redoActionHandler.call(this, redoActionObject);
    if (this.isExtractToolbarVisible) {
        inputTextboxUpdate.call(this);
    }
    this.undoOrganizeCollection.push(redoActionObject);
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
    updateUndoRedoButtons.call(this);
}

/**
 * @private
 * @param {number} pageOrder - It's describe about page order.
 * @returns { void }
 */
export function removePage(pageOrder: number): void {
    const mainTileElement: HTMLElement = this.tileAreaDiv.childNodes[parseInt(pageOrder.toString(), 10)] as HTMLElement;
    deleteTempPage.call(this, pageOrder, mainTileElement);
    this.tileAreaDiv.removeChild(mainTileElement);
    updatePageDetail.call(this);
}

/**
 * @private
 * @param {IActionOrganizeElements} actionObject - It's describe about action object.
 * @param {number} rotationAngle - It's describe about page rotation angle.
 * @returns { void }
 */
export function rotateImages(actionObject: IActionOrganizeElements, rotationAngle: number): void {
    if (actionObject.toolbarActions.length > 0) {
        for (let i: number = 0; i < actionObject.toolbarActions.length; i++) {
            const mainTileElement: HTMLElement =
                this.tileAreaDiv.childNodes[parseInt(actionObject.toolbarActions[parseInt(i.toString(), 10)].
                    currentPageIndex.toString(), 10)] as HTMLElement;
            const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
            if (imageContainer) {
                let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                currentRotation = (currentRotation + rotationAngle + 360) % 360;
                imageContainer.style.transform = `rotate(${currentRotation}deg)`;
                updateTempRotationDetail.call(this, actionObject.toolbarActions[parseInt(i.toString(), 10)].currentPageIndex,
                                              rotationAngle);
            }
        }
    }
}

/**
 * @private
 * @param {number} currentPageIndex - It's describe about current page index.
 * @param {number} rotationAngle - It's describe about page rotation angle.
 * @returns { void }
 */
export function rotateImage(currentPageIndex: number, rotationAngle: number): void {
    const mainTileElement: HTMLElement = this.tileAreaDiv.childNodes[parseInt(currentPageIndex.toString(), 10)] as HTMLElement;
    const imageContainer: HTMLElement = mainTileElement.querySelector('.e-pv-organize-image') as HTMLElement;
    if (imageContainer) {
        let currentRotation: number = parseFloat(imageContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        currentRotation = (currentRotation + rotationAngle + 360) % 360;
        imageContainer.style.transform = `rotate(${currentRotation}deg)`;
        updateTempRotationDetail.call(this, currentPageIndex, rotationAngle);
    }
}
