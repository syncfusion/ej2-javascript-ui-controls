import { OrganizeDetails, PageOrganizer } from '../organize-pdf';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AjaxHandler } from '../../index';
import { enableDisableToolbarItems } from './organize-toolbar';
import { disableTileCopyRotateButton, disableTileDeleteButton } from './tile-interaction';
import { getNextSubIndex } from './organize-math-utils';
import { updatePageNumber, updateTotalPageCount } from './organize-initialization';
import { clonedCollection } from './organize-undoredoutils';

/**
 * @private
 * @param { any } args - It's describe about the imported document data.
 * @returns { void }
 */
export function importDocument(args: any): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        const upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.importedDocumentName = uploadedFile.name;
                const reader: FileReader = new FileReader();
                reader.readAsDataURL(uploadedFile);
                reader.onload = (e: any): void => {
                    const uploadedFileUrl: string = e.currentTarget.result;
                    proxy.loadImportDoc(uploadedFileUrl, null, false);
                    if (!isNullOrUndefined(proxy.importDocInputElement)) {
                        (proxy.importDocInputElement as any).value = '';
                    }
                };
            }
        }
    }
}

/**
 * @private
 * @param { string } documentData - It's describe about imported document base 64 or byte array data.
 * @param { string } password - It's describe about the imported document password.
 * @param { boolean } isPasswordCorrect - It's describe about the imported document password correct or not.
 * @returns { void }
 */
export function loadImportDoc(documentData: string, password: string, isPasswordCorrect: boolean): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        let proxy: PageOrganizer = null;
        // eslint-disable-next-line
        proxy = this;
        let isEncrypted: boolean = false;
        this.importedDocumentData = documentData;
        const documentId: string = this.pdfViewerBase.createGUID();
        const isbase64: boolean = documentData.includes('pdf;base64,');
        const base64DocumentData: string = documentData;
        documentData = this.pdfViewerBase.checkDocumentData(documentData, false);
        const jsonObject: any = this.pdfViewerBase.constructJsonObject(documentData, password, isbase64);
        if (this.pdfViewer.serverActionSettings) {
            this.pdfViewerBase.loadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.pdfViewerBase.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.validatePassword;
            this.pdfViewerBase.loadRequestHandler.responseType = 'json';
            this.pdfViewerBase.loadRequestHandler.mode = true;
            jsonObject['action'] = 'ValidatePassword';
            jsonObject['elementId'] = this.pdfViewer.element.id;
            jsonObject['isFileName'] = 'false';
            if (this.pdfViewerBase.clientSideRendering) {
                this.pdfViewerBase.getPdfByteArray(base64DocumentData).then((pdfbytearray: any) => {
                    let data: any = this.pdfViewer.pdfRendererModule.loadImportDocument(pdfbytearray, documentId, password, jsonObject);
                    if (data) {
                        if (typeof data !== 'object') {
                            try {
                                data = JSON.parse(data);
                            } catch (error) {
                                this.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                                data = null;
                            }
                        }
                        if (data) {
                            while (typeof data !== 'object') {
                                data = JSON.parse(data);
                                if (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10))) {
                                    data = parseInt(data, 10);
                                    break;
                                }
                            }
                            if (data.uniqueId === documentId || (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10)))) {
                                if (data === 4) {
                                    // 4 is error code for encrypted document.
                                    this.pdfViewerBase.isImportDoc = true;
                                    isEncrypted = true;
                                    this.pdfViewerBase.renderPasswordPopup(documentData, password, this.pdfViewerBase.isImportDoc);
                                } else if (data === 3) {
                                    // 3 is error code for corrupted document.
                                    this.pdfViewerBase.isImportDoc = true;
                                    this.pdfViewerBase.renderCorruptPopup(this.pdfViewerBase.isImportDoc);
                                }
                            }
                        }
                        if (isPasswordCorrect && data !== 4) {
                            this.pdfViewerBase.passwordDialogReset();
                            if (this.pdfViewerBase.passwordPopup) {
                                this.pdfViewerBase.passwordPopup.hide();
                            }
                        }
                        if ((!isEncrypted || (isPasswordCorrect && data !== 4)) && (data !== 3)) {
                            this.importDocuments(password, this.importedDocumentName, documentData);
                        }
                    }
                });
            }
            else {
                this.pdfViewerBase.loadRequestHandler.send(jsonObject);
                this.pdfViewerBase.loadRequestHandler.onSuccess = function (result: any): void {
                    let data: any = result.data;
                    if (data) {
                        if (typeof data !== 'object') {
                            try {
                                data = JSON.parse(data);
                            } catch (error) {
                                proxy.pdfViewerBase.onControlError(500, data, proxy.pdfViewer.serverActionSettings.load);
                                data = null;
                            }
                        }
                        if (data) {
                            while (typeof data !== 'object') {
                                data = JSON.parse(data);
                                if (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10))) {
                                    data = parseInt(data, 10);
                                    break;
                                }
                            }
                            if (data.uniqueId === documentId || (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10)))) {
                                if (data === 4) {
                                    // 4 is error code for encrypted document.
                                    proxy.pdfViewerBase.isImportDoc = true;
                                    isEncrypted = true;
                                    proxy.pdfViewerBase.renderPasswordPopup(documentData, password, proxy.pdfViewerBase.isImportDoc);
                                } else if (data === 3) {
                                    // 3 is error code for corrupted document.
                                    proxy.pdfViewerBase.isImportDoc = true;
                                    proxy.pdfViewerBase.renderCorruptPopup(proxy.pdfViewerBase.isImportDoc);
                                }
                            }
                        }
                        if (isPasswordCorrect && data !== 4) {
                            proxy.pdfViewerBase.passwordDialogReset();
                            if (proxy.pdfViewerBase.passwordPopup) {
                                proxy.pdfViewerBase.passwordPopup.hide();
                            }
                        }
                        if ((!isEncrypted || (isPasswordCorrect && data !== 4)) && (data !== 3)) {
                            proxy.importDocuments(password, proxy.importedDocumentName, documentData);
                        }
                    }
                };
            }
        }
    }
}

/**
 * @private
 * @param { string } password - It's describe about the imported document password.
 * @param { string } documentName - It's describe about the imported document name.
 * @param { string } documentData - It's describe about imported document base 64 or byte array data.
 * @returns { void }
 */
export function importDocuments(password: string, documentName: string, documentData: string): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        if (this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring').length === 1) {
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
                    importPage.call(this, pageOrder, mainTileElement, password, documentName, false, documentData);
                    this.tileImageRender(pageIndex, subIndex, pageOrder + 1, mainTileElement, true, false, false, true, documentName);
                    const clonedCollections: OrganizeDetails[] = [];
                    clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                        find((item: OrganizeDetails) => { return item.currentPageIndex === (pageOrder + 1); })));
                    this.addOrganizeAction(clonedCollections, 'Import Pages', [], [], null, false);
                }
            }
        }
        else {
            const mainTileElement: HTMLElement = proxy.tileAreaDiv.childNodes[0] as HTMLElement;
            const pageId: string = mainTileElement.id.split('anchor_page_')[mainTileElement.id.split('anchor_page_').length - 1];
            const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
            const pageIdlist: string[] = pageId.split('_');
            let subIndex: number = 0;
            let pageIndex: number = parseInt(pageIdlist[parseInt((pageIdlist.length - 1).toString(), 10)], 10);
            if (pageIdlist.length > 1) {
                pageIndex = parseInt(pageIdlist[parseInt((pageIdlist.length - 2).toString(), 10)], 10);
            }
            subIndex = getNextSubIndex.call(this, mainTileElement.parentElement, pageIndex);
            importPage.call(this, pageOrder, mainTileElement, password, documentName, true, documentData);
            this.tileImageRender(pageIndex, subIndex, pageOrder, mainTileElement, true, true, false, true, documentName);
            const clonedCollections: OrganizeDetails[] = [];
            clonedCollections.push(clonedCollection.call(this, this.tempOrganizePagesCollection.
                find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; })));
            this.addOrganizeAction(clonedCollections, 'Import Pages', [], [], null, false);
        }
        updatePageNumber.call(this);
        updateTotalPageCount.call(this);
        enableDisableToolbarItems.call(this);
        disableTileCopyRotateButton.call(this);
        disableTileDeleteButton.call(this);
    }
}

/**
 * @private
 * @param { number } currentPageIndex - Its describe about the current page index.
 * @param { HTMLElement } tileDiv - It's describe about the import document tile place.
 * @param { string } password - It's describe about the imported document password.
 * @param { string } documentName - It's describe about the imported document name.
 * @param { boolean } isBefore - It's describe about the import position before or not.
 * @param { string } documentData - It's describe about imported document base 64 or byte array data.
 * @returns { void }
 */
export function importPage(currentPageIndex: number, tileDiv: HTMLElement,
                           password: string, documentName: string, isBefore: boolean, documentData: string): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        const index: number = this.tempOrganizePagesCollection.findIndex((item: OrganizeDetails) => {
            return item.currentPageIndex === currentPageIndex;
        });
        let pageIndex: number;
        let pageSize: any;
        if (index !== -1) {
            pageIndex = this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageIndex;
            pageSize = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection[parseInt(index.toString(), 10)].pageSize));

            if (isBefore) {
                this.tempOrganizePagesCollection = [...this.tempOrganizePagesCollection.slice(0, index),
                    new OrganizeDetails(currentPageIndex, -1,
                                        pageIndex, false, false, false, false, false, false,
                                        0, pageSize, true, documentName, password, documentData),
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
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.slice(0, index + 1).
                    concat([new OrganizeDetails(currentPageIndex + 1, -1, pageIndex,
                                                false, false, false, false, false, false,
                                                0, pageSize, true, documentName, password, documentData)],
                           this.tempOrganizePagesCollection.slice(index + 1));
                this.tempOrganizePagesCollection = this.tempOrganizePagesCollection.map((item: OrganizeDetails, mapIndex: number) => {
                    if (mapIndex > index + 1 && item.currentPageIndex != null) {
                        item.currentPageIndex = item.currentPageIndex + 1;
                    }
                    return item;
                });
            }
            while (!isNullOrUndefined(tileDiv.nextElementSibling)) {
                const nextTileDiv: HTMLElement = tileDiv.nextElementSibling as HTMLElement;
                // eslint-disable-next-line @typescript-eslint/indent
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
 * @returns { void }
 */
export function bindImportDocEvent(): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        const importDocElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_import_pages');
        if (importDocElement) {
            this.importDocInputElement.click();
        }
    }
}
