import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { OrganizeDetails } from '../organize-pdf';

/**
 * @private
 * @param {number} currentPageIndex - It's describe about current page index.
 * @param {HTMLElement} tileDiv - It's describe about tile div.
 * @returns { void }
 */
export function deleteTempPage(currentPageIndex: number, tileDiv: HTMLElement): void {
    if (this.pdfViewer.pageOrganizerSettings.canDelete &&
        (this.tempOrganizePagesCollection.filter((item: OrganizeDetails) => item.isDeleted === false).length > 0)) {
        const index: number =
            this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => item.currentPageIndex === currentPageIndex);
        const delCurrentIndex: number = this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].currentPageIndex;
        if (index !== -1 && !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isInserted &&
            !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isCopied &&
            !this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isImportedDoc) {
            this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].isDeleted = true;
            this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].currentPageIndex = null;
        }
        else {
            this.tempOrganizePagesCollection.splice(index, 1);
        }
        this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails) => {
            if (delCurrentIndex < item.currentPageIndex && !item.isDeleted) {
                item.currentPageIndex = item.currentPageIndex - 1;
            }
            return item;
        });

        while (!isNullOrUndefined(tileDiv.nextElementSibling)) {
            const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
            let nextTileIndex: number = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
            nextTileIndex = nextTileIndex - 1;
            nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
            tileDiv = nextTileDiv;
        }
    }
}

/**
 * @private
 * @param {number} deletedPageIndex - It's describe about delete page index.
 * @param {number} pageIndex - It's describe about current page index.
 * @param {number} rotateAngle - It's describe about page rotation angle.
 * @param {HTMLElement} tileDiv - It's describe about tile div.
 * @returns { void }
 */
export function undoDeletedPage(deletedPageIndex: number, pageIndex: number, rotateAngle: number, tileDiv: HTMLElement): void {
    if (this.tempOrganizePagesCollection.some((item: OrganizeDetails) => item.isDeleted)) {
        const deletedItem: OrganizeDetails = this.tempOrganizePagesCollection.find((item: OrganizeDetails) =>
            item.currentPageIndex === null && item.isDeleted && item.pageIndex !== -1 && item.pageIndex === pageIndex &&
            item.copiedPageIndex === null);
        if (deletedItem) {
            deletedItem.currentPageIndex = deletedPageIndex;
            deletedItem.rotateAngle = rotateAngle;
        }
    }
    this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails) => {
        if (item.currentPageIndex >= deletedPageIndex && !item.isDeleted) {
            item.currentPageIndex += 1;
        }
        else if (item.currentPageIndex === deletedPageIndex && item.isDeleted) {
            item.isDeleted = false;
        }
        return item;
    });
    this.tempOrganizePagesCollection.sort(function (a: any, b: any): any {
        return a.currentPageIndex - b.currentPageIndex;
    });
    if (tileDiv) {
        tileDiv.setAttribute('data-page-order', (deletedPageIndex + 1).toString());
    }
    while (tileDiv && !isNullOrUndefined(tileDiv.nextElementSibling)) {
        const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
        let nextTileIndex: number = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
        nextTileIndex += 1;
        nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
        tileDiv = nextTileDiv;
    }
}

/**
 * @private
 * @param {OrganizeDetails} toolbarActions - It's describe about toolbar actions.
 * @param {number}currentPageIndex - It's describe about current page index.
 * @param {HTMLElement} tileDiv - It's describe about tile div.
 * @returns { void }
 */
export function insertRemovedPages(toolbarActions: OrganizeDetails, currentPageIndex: number, tileDiv: HTMLElement): void {
    let deleteCount: number = 0;
    const index: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => {
        return item.currentPageIndex === currentPageIndex;
    });
    if (index !== -1) {
        for (let i: number = 0; i < index; i++) {
            if (this.tempOrganizePagesCollection[parseInt(i.toString(), 10)].isDeleted) {
                deleteCount++;
            }
        }
    }
    else {
        for (let i: number = 0; i < currentPageIndex; i++) {
            if (this.tempOrganizePagesCollection[parseInt(i.toString(), 10)].isDeleted) {
                deleteCount++;
            }
        }
    }
    this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.slice(0, currentPageIndex + deleteCount).
        concat(toolbarActions,
               this.tempOrganizePagesCollection.slice(currentPageIndex + deleteCount));
    this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
        if (mapIndex > currentPageIndex + deleteCount && !item.isDeleted) {
            item.currentPageIndex += 1;
        }
        return item;
    });
    if (tileDiv) {
        tileDiv.setAttribute('data-page-order', (currentPageIndex + 1).toString());
    }
    while (tileDiv && !isNullOrUndefined(tileDiv.nextElementSibling)) {
        const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
        let nextTileIndex: number = parseInt(nextTileDiv.getAttribute('data-page-order'), 10);
        nextTileIndex = nextTileIndex + 1;
        nextTileDiv.setAttribute('data-page-order', nextTileIndex.toString());
        tileDiv = nextTileDiv;
    }
}

/**
 * @private
 * @param {OrganizeDetails} tempCollecion - It's describe about organize page actions temp collection.
 * @returns { OrganizeDetails } - It's describe about organize page cloned collection.
 */
export function clonedCollection(tempCollecion: OrganizeDetails): OrganizeDetails {
    const clonedCollection: OrganizeDetails = JSON.parse(JSON.stringify(tempCollecion));
    return clonedCollection;
}
