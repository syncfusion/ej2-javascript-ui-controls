import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IOrganizePageAction } from '../organize-pdf';
import { OrganizeDetails, OrganizePageActionType } from '../../base/pdfviewer-utlis';

/**
 * Builds the `IOrganizePageAction` for a single `OrganizeDetails` snapshot entry.
 *
 * Priority of detected actions (first match wins): rearrange → delete → insert →
 * import → copy → rotate. Returns `null` for passthroughs with no user-visible change.
 * The caller preserves the iteration order when appending to the action log.
 *
 * @param {OrganizeDetails} sourcePage - The snapshot entry from `tempOrganizePagesCollection`.
 * @returns {IOrganizePageAction | null} The action, or `null` if the entry is a passthrough.
 * @private
 */
function buildActionFromSnapshot(sourcePage: any): IOrganizePageAction | null {
    if (!sourcePage) {
        return null;
    }
    // Re-arrange detection: trust the `isRearranged` flag from `rearrangePages`; index comparison shifts on insert/delete.
    if (sourcePage.isRearranged) {
        // Action: page was dragged to a new position by the user.
        return {
            action: OrganizePageActionType.rearrange,
            originalPageIndex: sourcePage.pageIndex,
            targetIndex: sourcePage.currentPageIndex,
            rotateAngle: sourcePage.rotateAngle
        };
    }
    if (sourcePage.isDeleted) {
        // Action: page was marked for removal from the document.
        return {
            action: OrganizePageActionType.delete,
            originalPageIndex: sourcePage.pageIndex,
            targetIndex: sourcePage.currentPageIndex
        };
    }
    if (sourcePage.isInserted) {
        // Action: a new blank page was inserted at `targetIndex`.
        return {
            action: OrganizePageActionType.insert,
            originalPageIndex: -1,
            targetIndex: sourcePage.currentPageIndex,
            rotateAngle: sourcePage.rotateAngle,
            pageSize: sourcePage.pageSize
        };
    }
    if (sourcePage.isImportedDoc) {
        // Action: a page was imported from an external document.
        return {
            action: OrganizePageActionType.importPages,
            originalPageIndex: -1,
            targetIndex: sourcePage.currentPageIndex,
            rotateAngle: sourcePage.rotateAngle,
            documentName: sourcePage.documentName,
            documentData: sourcePage.documentData,
            password: sourcePage.password
        };
    }
    if (sourcePage.isCopied) {
        // Action: an existing page was duplicated at `targetIndex`.
        return {
            action: OrganizePageActionType.copy,
            originalPageIndex: sourcePage.pageIndex,
            targetIndex: sourcePage.currentPageIndex,
            sourceOriginalPageIndex: sourcePage.copiedPageIndex,
            rotateAngle: sourcePage.rotateAngle,
            pageSize: sourcePage.pageSize
        };
    }
    if (sourcePage.rotateAngle && sourcePage.pageIndex !== null && sourcePage.pageIndex !== undefined && sourcePage.pageIndex >= 0) {
        // Action: page rotation was changed (falls through when no other modification flag is set).
        return {
            action: OrganizePageActionType.rotate,
            originalPageIndex: sourcePage.pageIndex,
            targetIndex: sourcePage.currentPageIndex,
            rotateAngle: sourcePage.rotateAngle
        };
    }
    // No user-visible modification detected: passthrough entry.
    return null;
}

/**
 * Collects the modified-only action log from the organizer's temp snapshot.
 *
 * Iterates `context.tempOrganizePagesCollection` and emits one `IOrganizePageAction`
 * per entry that represents a user-visible modification, as determined by
 * {@link buildActionFromSnapshot}. Pure passthroughs (no delete, insert, import,
 * copy, rearrange, or rotation change) are skipped, so the resulting log is
 * *modified-only* by construction. For a 1000-page document with five edits, the
 * log has five entries instead of one per source page.
 *
 * @param {{ tempOrganizePagesCollection: OrganizeDetails[] }} context - The organizer context.
 * @returns {IOrganizePageAction[]} The action log, in replay order.
 * @private
 */
function collectActions(context: any): IOrganizePageAction[] {
    const actions: IOrganizePageAction[] = [];
    if (context && context.tempOrganizePagesCollection) {
        // Walk the temp snapshot in order, appending only real actions (passthroughs dropped).
        for (let i: number = 0; i < context.tempOrganizePagesCollection.length; i++) {
            const action: IOrganizePageAction = buildActionFromSnapshot(
                context.tempOrganizePagesCollection[parseInt(i.toString(), 10)]);
            if (action) {
                actions.push(action);
            }
        }
    }
    return actions;
}

/**
 * Refreshes the organizer's action log from the current temp snapshot.
 *
 * Re-runs {@link collectActions} and assigns the result to
 * `context.tempOrganizePageActionsCollection`. The one-shot `isRearranged` flag
 * is cleared on every entry so that the same drag is not re-emitted on a
 * subsequent save within the same session. The legacy `organizePagesCollection`
 * is preserved unchanged for the existing server-side endpoint.
 *
 * @param {{ tempOrganizePagesCollection: OrganizeDetails[], tempOrganizePageActionsCollection: IOrganizePageAction[] }} context - The organizer context.
 * @returns {void}
 * @private
 */
function buildOrganizePageActions(context: any): void {
    // Rebuild the modified-only log from the current temp snapshot; the apply path reconstructs the full `OrganizeDetails[]` from it.
    const actions: IOrganizePageAction[] = collectActions(context);
    if (context && context.tempOrganizePagesCollection) {
        // Clear the one-shot `isRearranged` flag so the same drag is not re-emitted on a subsequent save.
        for (let j: number = 0; j < context.tempOrganizePagesCollection.length; j++) {
            const item: OrganizeDetails = context.tempOrganizePagesCollection[parseInt(j.toString(), 10)];
            if (item && item.isRearranged) {
                item.isRearranged = false;
            }
        }
    }
    context.tempOrganizePageActionsCollection = actions;
}

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
        buildOrganizePageActions(this);
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
                    if (this.pdfViewer && typeof(this.pdfViewer.firePageOrganizerSavedEventArgs) === 'function') {
                        const organizePageActions: string = JSON.stringify(this.tempOrganizePageActionsCollection);
                        this.pdfViewer.firePageOrganizerSavedEventArgs(fileName, data, organizePageActions);
                    }
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
