import { isNullOrUndefined } from '@syncfusion/ej2-base';

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
        let pdfBlob: Blob;
        this.pdfViewer.saveAsBlob().then((blob: Blob) => {
            pdfBlob = blob;
            this.pdfViewerBase.blobToBase64(pdfBlob).then((base64: string) => {
                if (!isNullOrUndefined(base64) && base64 !== '') {
                    const fileName: string = this.pdfViewer.fileName;
                    const downloadFileName: string = this.pdfViewer.downloadFileName;
                    const jsonDocumentId: string = this.pdfViewerBase.jsonDocumentId;
                    this.showOrganizeLoadingIndicator(false);
                    this.organizeDialog.hide();
                    this.undoOrganizeCollection = [];
                    this.redoOrganizeCollection = [];
                    this.pdfViewer.loadDocInternally(base64, null, false);
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                    this.pdfViewer.fileName = fileName;
                    if (!isNullOrUndefined(downloadFileName)) {
                        this.pdfViewer.downloadFileName = downloadFileName;
                    }
                    else {
                        this.pdfViewer.downloadFileName = fileName;
                    }
                    this.pdfViewerBase.jsonDocumentId = jsonDocumentId;
                    this.isOrganizeWindowOpen = false;
                    this.pdfViewer.isPageOrganizerOpen = false;
                }
            });
        });
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
    let pdfBlob: Blob;
    let canDownload: boolean = false;
    const temp: any = JSON.parse(JSON.stringify(this.organizePagesCollection));
    this.pdfViewer.saveAsBlob().then((blob: Blob) => {
        pdfBlob = blob;
        const conversionPromise: any = this.pdfViewerBase.clientSideRendering
            ? this.pdfViewerBase.blobToByteArray(pdfBlob)
            : this.pdfViewerBase.blobToBase64(pdfBlob);
        conversionPromise.then((result: any) => {
            if (!isNullOrUndefined(result) && result !== '') {
                canDownload = this.pdfViewer.firePageOrganizerSaveAsEventArgs(fileName, result);
                if (canDownload) {
                    this.pdfViewerBase.fileDownload(result, this.pdfViewerBase, true);
                    this.organizePagesCollection = JSON.parse(JSON.stringify(temp));
                }
            }
        });
    });
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
