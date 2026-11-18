import { PageOrganizer } from '../organize-pdf';
import { isNullOrUndefined, Browser  } from '@syncfusion/ej2-base';
import { TaskPriorityLevel } from '../../base/pdfviewer-utlis';
import { AjaxHandler } from '../../index';
import { isOrganizeDialogRendered } from './organize-initialization';
import { setThumbnailImage } from './slider-zoomaction';
import { restorePagesAfterZoom, restorePagesBeforeZoom } from './organize-undoredo';

/**
 * @private
 * @returns { void }
 */
export function createRequestForPreview(): any {
    // eslint-disable-next-line
    const proxy: PageOrganizer = this;
    const isIE: boolean = !!(document as any).documentMode;
    if (!isIE) {
        return new Promise<any>(
            function (renderPreviewImage: any, reject: any): any {
                proxy.requestPreviewCreation(proxy);
            });
    } else {
        this.requestPreviewCreation(proxy);
        return null;
    }
}

/**
 * @private
 * @param { PageOrganizer } proxy - It's describe about page organizer module.
 * @returns { void }
 */
export function requestPreviewCreation(proxy: PageOrganizer): void {
    // Removed the condition to skip multiple request for thumbnail image.
    const startIndex: number = this.lastRequestedPageIndex;
    const endIndex: number = (startIndex + this.previewLimit) >= this.pdfViewer.pageCount ?
        this.pdfViewer.pageCount : (startIndex + this.previewLimit);
    let digitalSignaturePresent: boolean = false;
    for (let i: number = startIndex; i < endIndex; i++) {
        if (proxy.pdfViewerBase.digitalSignaturePresent(i)) {
            digitalSignaturePresent = true;
        }
    }
    let digitalSignatureList: string = '';
    if (digitalSignaturePresent) {
        digitalSignatureList = proxy.pdfViewerBase.digitalSignaturePages.toString();
    }
    const jsonObject: object = { startPage: startIndex.toString(), endPage: endIndex.toString(), sizeX: '99.7', sizeY: '141', hashId: proxy.pdfViewerBase.hashId, action: 'RenderThumbnailImages', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId, digitalSignaturePresent: digitalSignaturePresent, digitalSignaturePageList: digitalSignatureList };
    if (this.pdfViewerBase.jsonDocumentId) {
        (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
    }
    if (!this.pdfViewerBase.clientSideRendering) {
        const imageSize: number = this.previouslyRequestedImageZoom;
        (jsonObject as any).imageSize = imageSize;
        (jsonObject as any).initialLoad = this.isInitialLoading;
        this.previewRequestHandler = new AjaxHandler(this.pdfViewer);
        this.previewRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail;
        this.previewRequestHandler.responseType = 'json';
        if (endIndex > 0 && !isNullOrUndefined(proxy.pdfViewerBase.hashId) && !this.isAllImagesReceived) {
            this.previewRequestHandler.send(jsonObject);
        }
        this.previewRequestHandler.onSuccess = function (result: any): void {
            const data: any = result.data;
            const redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
            if (!redirect) {
                proxy.updatePreviewCollection(data);
            }
        };
        this.previewRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                  proxy.pdfViewer.serverActionSettings.renderThumbnail);
        };
        this.previewRequestHandler.onError = function (result: any): void {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                  proxy.pdfViewer.serverActionSettings.renderThumbnail);
        };
    } else {
        const start: number = 0;
        const limit: number = this.pdfViewer.pageCount;
        const jsonObject: object = {
            documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId,
            elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId
        };
        const isTextNeed: boolean = proxy.pdfViewer.textSearch ? true : false;
        const initialLoad: boolean = this.isInitialLoading;
        const imageSize: number = proxy.getImageZoomValue(true);
        for (let pageIndex: number = start; pageIndex < limit; pageIndex++) {
            /* eslint-disable security/detect-object-injection */
            if (!isNullOrUndefined(this.dataDetails[pageIndex] &&
                this.dataDetails[pageIndex].imageSize === imageSize)) {
                continue;
            }
            /* eslint-enable security/detect-object-injection */
            this.pdfViewerBase.pdfViewerRunner.addTask({
                startIndex: start,
                endIndex: limit,
                pageIndex: pageIndex,
                message: 'renderPreviewTileImage',
                isTextNeed: isTextNeed,
                jsonObject: jsonObject,
                isRenderText: isTextNeed,
                requestType: isTextNeed ? 'pdfTextSearchRequest' : '',
                imageSize: imageSize,
                initialLoad: initialLoad
            }, TaskPriorityLevel.Medium);
        }
    }
}

/**
 * @private
 * @param { any } data - It's describe about update the preview collection.
 * @returns { void }
 */
export function updatePreviewCollection(data: any): void {
    if (data) {
        // eslint-disable-next-line
        const proxy: PageOrganizer = this;
        if (typeof data !== 'object') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                proxy.pdfViewerBase.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderThumbnail);
                data = null;
            }
        }
        if (data && data.uniqueId === proxy.pdfViewerBase.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderThumbnail, data);
            this.getData(data, proxy.pdfViewerBase.clientSideRendering);
        }
    }
}

/**
 * @private
 * @param { any } event - It's describe about update the preview collection.
 * @returns { void }
 */
export function previewOnMessage(event: any): void {
    if (event.data.message === 'renderPreviewTileImage') {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const { value, width, height, pageIndex, startIndex, endIndex, imageSize } = event.data;
        canvas.width = width;
        canvas.height = height;
        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
        const imageData: ImageData = canvasContext.createImageData(width, height);
        imageData.data.set(value);
        canvasContext.putImageData(imageData, 0, 0);
        const imageUrl: string = canvas.toDataURL();
        this.pdfViewerBase.releaseCanvas(canvas);
        const data: any = ({
            thumbnailImage: imageUrl,
            startPage: startIndex,
            endPage: endIndex,
            uniqueId: this.pdfViewerBase.documentId,
            pageIndex: pageIndex,
            imageSize: imageSize
        });
        this.updatePreviewCollection(data);
    }
}

/**
 * @param {any} data - It describes about the data
 * @param {boolean} isClientRender - It describes about the isClientRender
 * @private
 * @returns {void}
 */
export function getData(data: any, isClientRender: boolean): void {
    if (!this.dataDetails) {
        this.dataDetails = [];
    }
    if (data.imageSize !== this.previouslyRequestedImageZoom) {
        return;
    }
    if (this.dataDetails.length === this.pdfViewer.pageCount) {
        return;
    }
    if (isClientRender) {
        this.dataDetails.push({ pageId: data.pageIndex, image: data.thumbnailImage, imageSize: data.imageSize });
    }
    else {
        const startPage: number = data.startPage;
        const endPage: number = data.endPage;
        for (let i: number = startPage; i < endPage; i++) {
            const thumbnailImage: any = data.thumbnailImage[parseInt(i.toString(), 10)];
            const pageId: number = i;
            this.dataDetails.push({ pageId: pageId, image: thumbnailImage, imageSize: data.imageSize });
        }
    }
    this.dataDetails.sort((a: { pageId: number }, b: { pageId: number }) => a.pageId - b.pageId);
    if (this.dataDetails.length === this.pdfViewer.pageCount) {
        if (!isNullOrUndefined(this.pdfViewerBase.navigationPane)) {
            this.pdfViewerBase.navigationPane.enableOrganizeButton(true);
        }
        if (!isNullOrUndefined(this.pdfViewer.toolbar)) {
            this.pdfViewer.toolbar.enableToolbarItem(['OrganizePagesTool'], true);
        }
        if (this.isInitialLoading && this.pdfViewer.isPageOrganizerOpen) {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.createOrganizeWindow();
            }
            else {
                this.createOrganizeWindowForMobile();
            }
        }
        if (this.isPageZoomChanged) {
            if (this.isOrganizeWindowOpen || isOrganizeDialogRendered.call(this)) {
                restorePagesBeforeZoom.call(this);
                setThumbnailImage.call(this);
                restorePagesAfterZoom.call(this);
            }
            if (this.isOrganizeWindowOpen) {
                this.showOrganizeLoadingIndicator(false);
            }
            this.isPageZoomChanged = false;
            this.currentImageZoom = this.getImageZoomValue();
            if (this.previousImageZoom !== this.currentImageZoom) {
                this.pdfViewer.firePageOrganizerZoomChanged(this.previousImageZoom, this.currentImageZoom);
            }
        }
        this.isAllImagesReceived = true;
        this.isInitialLoading = false;
        this.lastRequestedPageIndex = 0;
    }
    else {
        if (!this.pdfViewerBase.clientSideRendering) {
            if (!this.isInitialLoading || (Browser.isDevice && !this.pdfViewer.enableDesktopMode) ||
                (this.isInitialLoading && (!this.pdfViewer.enableThumbnail || isNullOrUndefined(this.pdfViewer.thumbnailViewModule)))) {
                this.lastRequestedPageIndex = parseInt(data.endPage, 10);
                const isIE: boolean = !!(document as any).documentMode;
                if (!isIE) {
                    Promise.all([this.createRequestForPreview()]);
                } else {
                    this.createRequestForPreview();
                }
            }
        }
    }
}
