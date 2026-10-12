import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * @private
 * Helper function to restore organize state and metadata
 * @param {any} context - The context object
 * @param {string} fileName - The file name
 * @param {string} downloadFileName - The download file name
 * @param {string} jsonDocumentId - The JSON document ID
 * @returns {void}
 */
function restoreOrganizeState(context: any, fileName: string, downloadFileName: string, jsonDocumentId: string): void {
    context.showOrganizeLoadingIndicator(false);
    context.organizeDialog.hide();
    context.undoOrganizeCollection = [];
    context.redoOrganizeCollection = [];
    context.pdfViewer.fileName = fileName;
    if (!isNullOrUndefined(downloadFileName)) {
        context.pdfViewer.downloadFileName = downloadFileName;
    } else {
        context.pdfViewer.downloadFileName = fileName;
    }
    context.pdfViewerBase.jsonDocumentId = jsonDocumentId;
    context.isOrganizeWindowOpen = false;
    context.pdfViewer.isPageOrganizerOpen = false;
}

/**
 * @private
 * Helper function to handle save-as download
 * @param {any} context - The context object
 * @param {string} fileName - The file name
 * @param {any} data - The PDF data
 * @param {any} temp - Temporary organize pages collection
 * @returns {void}
 */
function handleSaveAsDownload(context: any, fileName: string, data: any, temp: any): void {
    const canDownload: boolean = context.pdfViewer.firePageOrganizerSaveAsEventArgs(fileName, data);
    if (canDownload) {
        context.pdfViewerBase.fileDownload(data, context.pdfViewerBase, true);
        context.organizePagesCollection = JSON.parse(JSON.stringify(temp));
    }
}

/**
 * @private
 * @returns { void }
 */
export function onSaveClicked(): void {
    this.isSkipRevert = true;
    this.showOrganizeLoadingIndicator(true);
    if ((JSON.stringify(this.tempOrganizePagesCollection) !== JSON.stringify(this.organizePagesCollection)) ||
        this.isDocumentModified) {
        this.updateOrganizePageCollection();
        this.totalCheckedCount = 0;
        this.isDocumentModified = true;
        const fileName: string = this.pdfViewer.fileName;
        const downloadFileName: string = this.pdfViewer.downloadFileName;
        const jsonDocumentId: string = this.pdfViewerBase.jsonDocumentId;
        if (this.pdfViewerBase.clientSideRendering) {
            this.pdfViewerBase.isOrganizePageSaveAction = true;
            this.pdfViewer.saveAsBlob().then((data: any) => {
                this.pdfViewerBase.isOrganizePageSaveAction = false;
                if (!isNullOrUndefined(data) && data.length > 0) {
                    restoreOrganizeState(this, fileName, downloadFileName, jsonDocumentId);
                    this.pdfViewer.loadDocInternally(data, null, false);
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                }
            }).catch((error: any) => {
                this.pdfViewerBase.isOrganizePageSaveAction = false;
                this.showOrganizeLoadingIndicator(false);
                console.error('Error saving organized PDF:', error);
            });
        } else {
            let pdfBlob: Blob;
            this.pdfViewer.saveAsBlob().then((blob: Blob) => {
                pdfBlob = blob;
                this.pdfViewerBase.blobToBase64(pdfBlob).then((base64: string) => {
                    if (!isNullOrUndefined(base64) && base64 !== '') {
                        restoreOrganizeState(this, fileName, downloadFileName, jsonDocumentId);
                        this.pdfViewer.loadDocInternally(base64, null, false);
                        this.pdfViewerBase.updateDocumentEditedProperty(true);
                    }
                });
            });
        }
    }
    else {
        this.showOrganizeLoadingIndicator(false);
        this.organizeDialog.hide();
        this.undoOrganizeCollection = [];
        this.redoOrganizeCollection = [];
        this.isOrganizeWindowOpen = false;
        this.pdfViewer.isPageOrganizerOpen = false;
    }
}

/**
 * @private
 * @returns { void }
 */
export function onSaveasClicked(): void {
    if (JSON.stringify(this.tempOrganizePagesCollection) !== JSON.stringify(this.organizePagesCollection)) {
        this.updateOrganizePageActions();
    }
    const fileName: string = this.pdfViewer.fileName;
    const temp: any = JSON.parse(JSON.stringify(this.organizePagesCollection));
    if (this.pdfViewerBase.clientSideRendering) {
        this.pdfViewerBase.isOrganizePageSaveAction = true;
        this.pdfViewer.saveAsBlob().then((data: any) => {
            this.pdfViewerBase.isOrganizePageSaveAction = false;
            if (!isNullOrUndefined(data) && data.length > 0) {
                handleSaveAsDownload(this, fileName, data, temp);
            }
        }).catch((error: any) => {
            this.pdfViewerBase.isOrganizePageSaveAction = false;
            console.error('Error saving organized PDF as file:', error);
        });
    } else {
        let pdfBlob: Blob;
        this.pdfViewer.saveAsBlob().then((blob: Blob) => {
            pdfBlob = blob;
            this.pdfViewerBase.blobToBase64(pdfBlob).then((base64: string) => {
                if (!isNullOrUndefined(base64) && base64 !== '') {
                    handleSaveAsDownload(this, fileName, base64, temp);
                }
            });
        });
    }
}

/**
 * @private
 * @returns { void }
 */
export function updateOrganizePageActions(): void {
    this.updateOrganizePageCollection();
    this.totalCheckedCount = 0;
    this.isDocumentModified = true;
    this.pdfViewerBase.updateDocumentEditedProperty(true);
}
