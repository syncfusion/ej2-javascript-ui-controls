import { Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Annotation, PdfViewer, PdfViewerBase, TileRenderingSettingsModel } from '../index';
import { getDiagramElement, PointModel, Rect } from '@syncfusion/ej2-drawings';

/**
 * Magnification module
 */
export class Magnification {
    /**
     * @private
     */
    public zoomFactor: number = 1;
    /**
     * @private
     */
    public previousZoomFactor: number = 1;
    private scrollWidth: number = 25;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private zoomLevel: number;
    private higherZoomLevel: number;
    private lowerZoomLevel: number;
    private zoomPercentages: number[] = [10, 25, 50, 75, 100, 125, 150, 200, 400];
    private isNotPredefinedZoom: boolean = false;
    private pinchStep: number = 0;
    private reRenderPageNumber: number = 0;
    private magnifyPageRerenderTimer: any = null;
    private rerenderOnScrollTimer: any = null;
    private rerenderInterval: any = null;
    private previousTouchDifference: number;
    private touchCenterX: number = 0;
    private touchCenterY: number = 0;
    private mouseCenterX: number = 0;
    private mouseCenterY: number = 0;
    private pageRerenderCount: number = 0;
    private imageObjects: HTMLImageElement[] = [];
    private topValue: number = 0;
    private isTapToFitZoom: boolean = false;
    private isCanvasCreated: boolean = false;
    /**
     * @private
     */
    public isWaitingPopupUpdated: boolean = false;
    /**
     * @private
     */
    public isInitialCustomZoomValues: boolean = true;
    /**
     * @private
     */
    public fitType: string = null;
    /**
     * @private
     */
    public isInitialLoading: boolean;
    /**
     * @private
     */
    public isPinchZoomed: boolean = false;
    /**
     * @private
     */
    public isPagePinchZoomed: boolean = false;
    /**
     * @private
     */
    public isRerenderCanvasCreated: boolean = false;
    /**
     * @private
     */
    public isMagnified: boolean = false;
    /**
     * @private
     */
    public isPagesZoomed: boolean = false;
    /**
     * @private
     */
    public isPinchScrolled: boolean = false;
    /**
     * @private
     */
    public isAutoZoom: boolean = false;
    /**
     * @private
     */
    public isDoubleTapZoom: boolean = false;
    /**
     * @private
     */
    public isFormFieldPageZoomed: boolean = false;
    private isWebkitMobile: boolean = false;
    private isFitToPageMode: boolean = true;
    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdf viewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewer base
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.zoomLevel = 2;
    }

    /**
     * Zoom the PDF document to the given zoom value
     *
     * @param  {number} zoomValue - Specifies the Zoom Value for magnify the PDF document
     * @returns {void}
     */
    public zoomTo(zoomValue: number): void {
        let MaximumZoomPercentage: number = 400;
        let MinmumZoomPercentage: number = 10;
        let minZoom: number = this.pdfViewer.minZoom;
        let maxZoom: number = this.pdfViewer.maxZoom;
        if (minZoom != null && maxZoom != null && minZoom > maxZoom) {
            const tempZoomValue: number = maxZoom;
            maxZoom = minZoom;
            minZoom = tempZoomValue;
        }
        if (minZoom != null || maxZoom != null) {
            if (minZoom != null && minZoom !== undefined) {
                MinmumZoomPercentage = minZoom;
            }
            if (maxZoom != null && maxZoom !== undefined) {
                MaximumZoomPercentage = maxZoom;
            }
        } else {
            MaximumZoomPercentage = 400;
            MinmumZoomPercentage = 10;
        }
        if (zoomValue < MinmumZoomPercentage) {
            zoomValue = MinmumZoomPercentage;
        } else if (zoomValue > MaximumZoomPercentage) {
            zoomValue = MaximumZoomPercentage;
        }
        this.fitType = null;
        this.isNotPredefinedZoom = false;
        if (this.isAutoZoom && this.isInitialLoading) {
            this.pdfViewerBase.onWindowResize();
        } else {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
        }
        this.isInitialLoading = false;
    }

    /**
     * Magnifies the page to the next value in the zoom drop down list.
     *
     * @returns {void}
     */
    public zoomIn(): void {
        if (this.fitType || this.isNotPredefinedZoom) {
            if (!isNullOrUndefined(this.lowerZoomLevel)) {
                this.zoomLevel = this.lowerZoomLevel;
            }
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.pdfViewer.minZoom != null || this.pdfViewer.maxZoom != null) {
            const zoomLength: number = this.pdfViewerBase.customZoomValues.length;
            let zoomLevel: number = this.zoomLevel;
            if (zoomLevel >= zoomLength) {
                zoomLevel = zoomLength;
            } else {
                zoomLevel++;
            }
            this.zoomLevel = zoomLevel;
        } else {
            if (this.zoomLevel >= 8) {
                this.zoomLevel = 8;
            } else {
                this.zoomLevel++;
            }
        }
        this.isAutoZoom = false;
        if (this.pdfViewer.minZoom != null || this.pdfViewer.maxZoom != null) {
            this.onZoomChanged(this.pdfViewerBase.customZoomValues[this.zoomLevel]);
        } else {
            this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
        }
    }

    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     *
     * @returns {void}
     */
    public zoomOut(): void {
        if (this.fitType || this.isNotPredefinedZoom) {
            if (!isNullOrUndefined(this.higherZoomLevel)) {
                this.zoomLevel = this.higherZoomLevel;
            }
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel <= 0) {
            this.zoomLevel = 0;
        } else {
            this.zoomLevel--;
        }
        this.isAutoZoom = false;
        if (this.pdfViewer.minZoom != null || this.pdfViewer.maxZoom != null) {
            this.onZoomChanged(this.pdfViewerBase.customZoomValues[this.zoomLevel]);
        } else {
            this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
        }
    }

    /**
     * Scales the page to fit the page width to the width of the container in the control.
     *
     * @returns {void}
     */
    public fitToWidth(): void {
        this.isAutoZoom = false;
        const zoomValue: number = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }

    /**
     * @private
     * @returns {void}
     */
    public fitToAuto(): void {
        this.isAutoZoom = true;
        const zoomValue: number = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }

    /**
     * Scales the page to fit the page in the container in the control.
     *
     * @returns {void}
     */
    public fitToPage(): void {
        const zoomValue: number = this.calculateFitZoomFactor('fitToPage');
        if (zoomValue !== null) {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                if (this.pdfViewerBase.isWebkitMobile) {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
                } else {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
                }
            } else {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
            }
            if (this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1]) {
                this.pdfViewerBase.viewerContainer.scrollTop =
                this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top * this.zoomFactor;
            }
        }
    }

    /**
     * Returns zoom factor for the fit zooms.
     *
     * @param {string} type -It describes about the type
     * @returns {number} - number
     */
    private calculateFitZoomFactor(type: string): number {
        let viewerWidth: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().width;
        let viewerHeight: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().height;
        if (viewerWidth === 0 && viewerHeight === 0) {
            viewerWidth = parseFloat(this.pdfViewer.width.toString());
            viewerHeight = parseFloat(this.pdfViewer.height.toString());
        }
        if (isNaN(viewerHeight) || isNaN(viewerWidth)) {
            return null;
        }
        this.fitType = type;
        if (this.fitType === 'fitToWidth') {
            let scaleX: number = ((viewerWidth - this.scrollWidth) / this.pdfViewerBase.highestWidth);
            if (this.isAutoZoom) {
                this.fitType = null;
                scaleX = Math.min(1, scaleX);
                if (scaleX === 1) {
                    this.zoomLevel = 2;
                }
            }
            return parseInt((scaleX * 100).toString(), 10);
        } else {
            this.isFitToPageMode = true;
            const pageLeft: number = 10;
            const scaleX: number = ((viewerWidth - this.scrollWidth - pageLeft) / this.pdfViewerBase.highestWidth);
            let scaleY: number = 0;
            if (this.pdfViewerBase.pageSize && this.pdfViewerBase.pageSize.length === 1 &&
                !isNullOrUndefined(this.pdfViewerBase.pageSize[0].top) && !this.isPinchZoomed) {
                scaleY = (viewerHeight - this.pdfViewerBase.pageSize[0].top) / this.pdfViewerBase.highestHeight;
            }
            else {
                scaleY = (viewerHeight / this.pdfViewerBase.highestHeight);
            }
            if (scaleY > scaleX) {
                scaleY = scaleX;
                this.isFitToPageMode = false;
            }
            return parseInt((scaleY * 100).toString(), 10);
        }
    }

    /**
     * Initiating cursor based zoom.
     *
     * @param {number} pointX - It describes about the pointX
     * @param {number} pointY - It describes about the pointY
     * @param {number} zoomValue - It describes about the zoom value
     * @private
     * @returns {void}
     */
    public initiateMouseZoom(pointX: number, pointY: number, zoomValue: number): void {
        const pointInViewer: any = this.positionInViewer(pointX, pointY);
        this.mouseCenterX = pointInViewer.x;
        this.mouseCenterY = pointInViewer.y;
        this.zoomTo(zoomValue);
    }

    /**
     * Performs pinch in operation
     *
     * @returns {void}
     */
    private pinchIn(): void {
        this.fitType = null;
        let temporaryZoomFactor: number = this.zoomFactor - this.pinchStep;
        if (temporaryZoomFactor < 4 && temporaryZoomFactor > 2) {
            temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        }
        if (temporaryZoomFactor <= 1.5) {
            temporaryZoomFactor = this.zoomFactor - (this.pinchStep / 1.5);
        }
        if (this.pdfViewer.minZoom != null && temporaryZoomFactor < this.pdfViewer.minZoom / 100) {
            temporaryZoomFactor = this.pdfViewer.minZoom / 100;
        } else if (temporaryZoomFactor < 0.25) {
            temporaryZoomFactor = 0.25;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
        this.isTapToFitZoom = true;
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && (this.zoomFactor * 100) === 50) {
            const zoomValue: number = this.calculateFitZoomFactor('fitToWidth');
            this.fitType = null;
            if (zoomValue <= 50) {
                this.fitToWidth();
            }
        }
    }

    /**
     * Performs pinch out operation
     *
     * @returns {void}
     */
    private pinchOut(): void {
        this.fitType = null;
        let temporaryZoomFactor: number = this.zoomFactor + this.pinchStep;
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer.maxZoom != null && temporaryZoomFactor > this.pdfViewer.maxZoom / 100) {
                temporaryZoomFactor = this.pdfViewer.maxZoom / 100;
            } else if (temporaryZoomFactor > 4) {
                temporaryZoomFactor = 4;
            }
        } else {
            if (temporaryZoomFactor > 2) {
                temporaryZoomFactor = temporaryZoomFactor - this.pinchStep;
            }
            if (this.pdfViewer.maxZoom != null && temporaryZoomFactor > this.pdfViewer.maxZoom / 100) {
                temporaryZoomFactor = this.pdfViewer.maxZoom / 100;
            } else if (temporaryZoomFactor > 4) {
                temporaryZoomFactor = 4;
            }
        }
        this.isTapToFitZoom = true;
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    }

    /**
     * returns zoom level for the zoom factor.
     *
     * @param {number} zoomFactor - It describes about the zoom factor
     * @returns {number} - number
     */
    private getZoomLevel(zoomFactor: number): number {
        if (this.pdfViewer.minZoom != null || this.pdfViewer.maxZoom != null) {
            let min: number = 0;
            const customZoomValues: number[] = this.pdfViewerBase.customZoomValues;
            let max: number = customZoomValues.length - 1;
            while (min <= max) {
                const mid: number = Math.floor((min + max) / 2);
                if (customZoomValues[parseInt(mid.toString(), 10)] === zoomFactor) {
                    return mid;
                } else if (customZoomValues[parseInt(mid.toString(), 10)] < zoomFactor) {
                    min = mid + 1;
                } else {
                    max = mid - 1;
                }
            }
            this.higherZoomLevel = min;
            this.lowerZoomLevel = max;
            return max;
        } else {
            let min: number = 0;
            let max: number = this.zoomPercentages.length - 1;
            while ((min <= max) && !(min === 0 && max === 0)) {
                const mid: number = Math.round((min + max) / 2);
                if (this.zoomPercentages[parseInt(mid.toString(), 10)] <= zoomFactor) {
                    min = mid + 1;
                } else if (this.zoomPercentages[parseInt(mid.toString(), 10)] >= zoomFactor) {
                    max = mid - 1;
                }
            }
            this.higherZoomLevel = min;
            this.lowerZoomLevel = max;
            return max;
        }
    }

    /**
     * @private
     * @returns {boolean} - boolean
     */
    public checkZoomFactor(): boolean {
        return this.zoomPercentages.indexOf(this.zoomFactor * 100) > -1;
    }

    /**
     * Executes when the zoom or pinch operation is performed
     *
     * @param {number} zoomValue - It describes about the zoom value
     * @returns {void}
     */
    private onZoomChanged(zoomValue: number): void {
        if (this.isInitialCustomZoomValues) {
            this.pdfViewerBase.getCustomZoomValues();
        }
        if (zoomValue) {
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.closePopupMenu();
            }
            this.previousZoomFactor = this.zoomFactor;
            this.zoomLevel = this.getZoomLevel(zoomValue);
            this.zoomFactor = this.getZoomFactor(zoomValue);
            if (this.zoomFactor <= 0.25) {
                this.pdfViewerBase.isMinimumZoom = true;
            } else {
                this.pdfViewerBase.isMinimumZoom = false;
            }
            if (!isNullOrUndefined(this.pdfViewerBase.viewerContainer)) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    if (this.pdfViewerBase.isWebkitMobile) {
                        this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
                    } else {
                        this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
                    }
                } else {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
                }
            }
            if (this.pdfViewerBase.pageCount > 0) {
                if ((this.previousZoomFactor !== this.zoomFactor) || this.pdfViewerBase.isInitialPageMode) {
                    if (!this.isPinchZoomed) {
                        this.magnifyPages();
                    } else {
                        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                            this.pdfViewerBase.mobilePageNoContainer.style.left = (this.pdfViewer.element.clientWidth / 2) - (parseFloat(this.pdfViewerBase.mobilePageNoContainer.style.width) / 2) + 'px';
                        }
                        this.responsivePages();
                    }
                }
                if (!isBlazor()) {
                    if (this.pdfViewer.toolbarModule) {
                        this.pdfViewer.toolbarModule.updateZoomButtons();
                    }
                }
                if (!this.isInitialLoading) {
                    if (this.previousZoomFactor !== this.zoomFactor) {
                        this.pdfViewerBase.isSkipZoomValue = true;
                        this.pdfViewer.zoomValue = parseInt((this.zoomFactor * 100).toString(), 10);
                        this.pdfViewer.fireZoomChange();
                    }
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateZoomPercentage(this.zoomFactor);
            }
            if (!this.isInitialLoading) {
                if (this.previousZoomFactor !== this.zoomFactor) {
                    this.pdfViewerBase.isSkipZoomValue = true;
                    this.pdfViewer.zoomValue = parseInt((this.zoomFactor * 100).toString(), 10);
                    this.pdfViewer.fireZoomChange();
                }
            }
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.isPinchZoomed) {
                const zoomPercentage: string = parseInt((this.zoomFactor * 100).toString(), 10) + '%';
                this.pdfViewerBase.navigationPane.createTooltipMobile(zoomPercentage);
            }
        }
    }

    /**
     * @param {number} clientX - It describes about the clientX
     * @param {number} clientY - It describes about the clientY
     * @private
     * @returns {void}
     */
    public setTouchPoints(clientX: number, clientY: number): void {
        const pointInViewer: any = this.positionInViewer(clientX, clientY);
        this.touchCenterX = pointInViewer.x;
        this.touchCenterY = pointInViewer.y;
    }

    /**
     * @param {number} pointX1 - It describes about the pointX1
     * @param {number} pointY1 - It describes about the pointY1
     * @param {number} pointX2 - It describes about the pointX2
     * @param {number} pointY2 - It describes about the pointY2
     * @private
     * @returns {void}
     */
    public initiatePinchMove(pointX1: number, pointY1: number, pointX2: number, pointY2: number): void {
        this.isPinchScrolled = false;
        this.isMagnified = false;
        this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        const pointInViewer: any = this.positionInViewer((pointX1 + pointX2) / 2, (pointY1 + pointY2) / 2);
        this.touchCenterX = pointInViewer.x;
        this.touchCenterY = pointInViewer.y;
        this.zoomOverPages(pointX1, pointY1, pointX2, pointY2);
    }

    private magnifyPages(): void {
        this.clearRerenderTimer();
        const pageDivElements: any = document.querySelectorAll('.e-pv-page-div');
        const startPageElement: number = pageDivElements[0].id.split('_pageDiv_')[1];
        const endPageElement: number = pageDivElements[pageDivElements.length - 1].id.split('_pageDiv_')[1];
        if (!isNullOrUndefined(this.pdfViewer.annotationModule)) {
            for (let i: number = 0; i < this.pdfViewerBase.renderedPagesList.length; i++) {
                this.pdfViewer.annotation.clearAnnotationCanvas(this.pdfViewerBase.renderedPagesList[parseInt(i.toString(), 10)]);
            }
        }
        if ((this.previousZoomFactor !== this.zoomFactor) || this.pdfViewerBase.isInitialPageMode) {
            for (let i: number = startPageElement; i <= endPageElement; i++) {
                this.pdfViewerBase.showPageLoadingIndicator(i, false);
            }
        }
        if (this.zoomFactor >= 1) {
            for (let i: number = startPageElement; i <= endPageElement; i++) {
                this.pdfViewerBase.showPageLoadingIndicator(i, true);
            }
        }
        this.isWaitingPopupUpdated = true;
        if (!this.isPagesZoomed) {
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        }
        if (!this.pdfViewerBase.documentLoaded && !this.pdfViewerBase.isInitialPageMode) {
            this.isPagesZoomed = true;
        }
        const scrollValue: number = this.pdfViewerBase.viewerContainer.scrollTop;
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(false, true);
        }
        if (this.pdfViewer.formDesignerModule && !this.pdfViewerBase.documentLoaded && !this.pdfViewerBase.isDocumentLoaded) {
            this.isFormFieldPageZoomed = true;
        }
        if (!this.isInitialLoading) {
            this.isMagnified = true;
        }
        this.updatePageLocation();
        this.resizeCanvas(this.reRenderPageNumber);
        if (this.zoomFactor < 1) {
            for (let i: number = startPageElement; i <= endPageElement; i++) {
                this.pdfViewerBase.showPageLoadingIndicator(i, true);
            }
        }
        this.calculateScrollValuesOnMouse(scrollValue);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.resizeTouchElements();
        }
        const annotModule: Annotation = this.pdfViewer.annotationModule;
        if (annotModule && annotModule.textMarkupAnnotationModule) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateCurrentResizerPosition();
        }
        if (this.pdfViewerBase.pageSize.length > 0) {
            this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.getPageHeight(this.pdfViewerBase.pageSize.length - 1) + 'px';
            // eslint-disable-next-line
            const proxy: any = this;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            if (!this.pdfViewerBase.documentLoaded) {
                this.designNewCanvas(this.pdfViewerBase.currentPageNumber);
                this.magnifyPageRerenderTimer = setTimeout(
                    () => {
                        proxy.rerenderMagnifiedPages();
                        this.pdfViewerBase.showPageLoadingIndicator(this.pdfViewerBase.currentPageNumber - 1, false);
                    }, 800);
            }
        }
        this.isFormFieldPageZoomed = false;
    }

    private updatePageLocation(): void {
        this.topValue = 0;
        for (let i: number = 1; i < this.pdfViewerBase.pageSize.length; i++) {
            this.topValue += (this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height + this.pdfViewerBase.pageGap) *
            this.zoomFactor;
        }
        let limit: number;
        if (this.pdfViewer.initialRenderPages > 10) {
            limit = this.pdfViewer.initialRenderPages <= this.pdfViewerBase.pageCount ? this.pdfViewer.initialRenderPages :
                this.pdfViewerBase.pageCount;
        } else {
            limit = this.pdfViewerBase.pageCount < 10 ? this.pdfViewerBase.pageCount : 10;
        }
        for (let i: number = 0; i < limit; i++) {
            this.updatePageContainer(i, this.pdfViewerBase.getPageWidth(i), this.pdfViewerBase.getPageHeight(i),
                                     this.pdfViewerBase.getPageTop(i), true);
        }
    }

    private updatePageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number, isReRender?: true): void {
        const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        if (pageDiv) {
            pageDiv.style.width = pageWidth + 'px';
            pageDiv.style.height = pageHeight + 'px';
            const textLayerDiv: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (textLayerDiv) {
                textLayerDiv.style.width = pageWidth + 'px';
                textLayerDiv.style.height = pageHeight + 'px';
            }
            pageDiv.style.width = pageWidth + 'px';
            pageDiv.style.height = pageHeight + 'px';
            if (this.pdfViewer.enableRtl) {
                pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(pageNumber) + 'px';
            } else {
                pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(pageNumber) + 'px';
            }
            pageDiv.style.top = topValue + 'px';
            this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            this.pdfViewerBase.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, 'block');
        }
    }

    private clearRerenderTimer(): void {
        clearTimeout(this.rerenderOnScrollTimer);
        clearTimeout(this.magnifyPageRerenderTimer);
        this.clearIntervalTimer();
        this.isPinchScrolled = false;
    }

    /**
     * @private
     * @returns {void}
     */
    public clearIntervalTimer(): void {
        clearInterval(this.rerenderInterval);
        this.rerenderInterval = null;
        this.clearRendering();
        const oldCanvases: NodeListOf<Element> = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_oldCanvas_"]');
        for (let i: number = 0; i < oldCanvases.length; i++) {
            const pageNumber: number = parseInt(oldCanvases[parseInt(i.toString(), 10)].id.split('_oldCanvas_')[1], 10);
            const pageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                oldCanvases[parseInt(i.toString(), 10)].id = pageCanvas.id;
                pageCanvas.parentElement.removeChild(pageCanvas);
            } else {
                oldCanvases[parseInt(i.toString(), 10)].id = this.pdfViewer.element.id + '_pageCanvas_' + pageNumber;
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(i);
            }
        }
        this.isRerenderCanvasCreated = false;
    }

    /**
     * @param {HTMLImageElement} image - It describes about the image
     * @private
     * @returns {void}
     */
    public pushImageObjects(image: HTMLImageElement): void {
        if (!isNullOrUndefined(this.imageObjects)) {
            if (this.imageObjects) {
                this.imageObjects.push(image);
            }
        }
    }

    private clearRendering(): void {
        if (this.imageObjects) {
            for (let j: number = 0; j < this.imageObjects.length; j++) {
                if (this.imageObjects[parseInt(j.toString(), 10)]) {
                    this.imageObjects[parseInt(j.toString(), 10)].onload = null;
                    this.imageObjects[parseInt(j.toString(), 10)].onerror = null;
                }
            }
            this.imageObjects = [];
        }
    }

    private rerenderMagnifiedPages(): void {
        if ((this.pdfViewerBase.isInitialLoaded || this.pdfViewerBase.isDocumentLoaded) && !this.pdfViewerBase.isInitialPageMode) {
            this.renderInSeparateThread(this.reRenderPageNumber);
            this.isPagesZoomed = false;
        } else if (this.pdfViewerBase.isInitialPageMode) {
            this.pageRerenderCount = 0;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.isMagnified = false;
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.pdfViewerBase.isInitialPageMode = false;
            this.isRerenderCanvasCreated = false;
        }
    }

    private renderInSeparateThread(pageNumber: number): void {
        this.pageRerenderCount = 0;
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        this.isMagnified = false;
        this.pdfViewerBase.pageViewScrollChanged(this.pdfViewerBase.currentPageNumber);
        // eslint-disable-next-line
        const proxy: any = this;
        this.rerenderInterval = setInterval(
            () => {
                this.initiateRerender(proxy);
            }, 1);
    }

    private responsivePages(): void {
        this.isPagesZoomed = true;
        this.clearRerenderTimer();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewerBase.clearAllTextSearchOccurrences();
        }
        const scrollValue: number = this.pdfViewerBase.viewerContainer.scrollTop;
        this.isAutoZoom = false;
        this.updatePageLocation();
        this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.pageSize[this.pdfViewerBase.pageSize.length - 1].height * this.zoomFactor + 'px';
        this.resizeCanvas(this.pdfViewerBase.currentPageNumber);
        if (this.pdfViewerBase.textLayer && this.pdfViewer.formDesignerModule) {
            this.pdfViewerBase.textLayer.clearTextLayers(true);
        }
        if (this.isPinchZoomed) {
            this.calculateScrollValues(scrollValue);
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formDesignerModule) {
            // eslint-disable-next-line
            const proxy: any = this;
            if (!this.pdfViewerBase.documentLoaded) {
                this.magnifyPageRerenderTimer = setTimeout(
                    () => {
                        proxy.rerenderMagnifiedPages();
                    }, 800);
            }
        }
    }

    private calculateScrollValues(scrollValue: number): void {
        const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        const currentPageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
        if (currentPageCanvas) {
            let pointInViewer: any;
            const currentPageBounds: DOMRect = currentPageCanvas.getBoundingClientRect() as DOMRect;
            if (this.pdfViewer.enableRtl && !this.isDoubleTapZoom) {
                pointInViewer = this.positionInViewer(currentPageBounds.right, currentPageBounds.top);
            }
            else {
                pointInViewer = this.positionInViewer(currentPageBounds.left, currentPageBounds.top);
            }
            const currentPageBoundsLeft: any = pointInViewer.x;
            const currentPageBoundsTop: any = pointInViewer.y;
            // update scroll top for the viewer container based on pinch zoom factor
            const previousPageTop: number = (currentPageBoundsTop) * this.previousZoomFactor;
            const canvasPreviousY: number = scrollValue + this.touchCenterY;
            const canvasCurrentY: number = (currentPageBoundsTop) * this.zoomFactor + ((canvasPreviousY - previousPageTop) < 0 ?
                canvasPreviousY - previousPageTop : (canvasPreviousY - previousPageTop) * (this.zoomFactor / this.previousZoomFactor));
            const pageGapValue: number = this.zoomFactor - this.previousZoomFactor > 0 ? - this.pdfViewerBase.pageGap *
            (this.zoomFactor / this.previousZoomFactor) : this.pdfViewerBase.pageGap * (this.previousZoomFactor / this.zoomFactor);
            this.pdfViewerBase.viewerContainer.scrollTop = canvasCurrentY - this.touchCenterY + pageGapValue /
            this.pdfViewerBase.zoomInterval;
            // update scroll left for the viewer container based on pinch zoom factor
            const previousWidthFactor: number = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
            const scaleCorrectionFactor: number = this.zoomFactor / previousWidthFactor - 1;
            const scrollX: number = this.touchCenterX - currentPageBoundsLeft;
            if (this.pdfViewerBase.isMixedSizeDocument && (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) >
            this.pdfViewerBase.viewerContainer.clientWidth) {
                this.pdfViewerBase.viewerContainer.scrollLeft = (this.pdfViewerBase.pageContainer.offsetWidth -
                    this.pdfViewerBase.viewerContainer.clientWidth) / 2;
            } else {
                this.pdfViewerBase.viewerContainer.scrollLeft += scrollX * scaleCorrectionFactor;
            }
        }
    }

    private calculateScrollValuesOnMouse(scrollValue: number): void {
        const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        const currentPageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
        if (currentPageCanvas) {
            let pointInViewer: any;
            const currentPageBounds: DOMRect = currentPageCanvas.getBoundingClientRect() as DOMRect;
            if (this.pdfViewer.enableRtl) {
                pointInViewer = this.positionInViewer(currentPageBounds.right, currentPageBounds.top);
            }
            else {
                pointInViewer = this.positionInViewer(currentPageBounds.left, currentPageBounds.top);
            }
            const currentPageBoundsLeft: any = pointInViewer.x;
            const currentPageBoundsTop: any = pointInViewer.y;
            // update scroll top for the viewer container based on mouse zoom factor
            const previousPageTop: number = (currentPageBoundsTop) * this.previousZoomFactor;
            const canvasPreviousY: number = scrollValue + this.mouseCenterY;
            const canvasCurrentY: number = (currentPageBoundsTop) * this.zoomFactor + ((canvasPreviousY - previousPageTop) *
            (this.zoomFactor / this.previousZoomFactor));
            let pageGapValue: number = this.pdfViewerBase.pageGap * (this.zoomFactor / this.previousZoomFactor);
            if (this.pdfViewerBase.isTouchPad && !this.pdfViewerBase.isMacSafari) {
                pageGapValue = pageGapValue / this.pdfViewerBase.zoomInterval;
            }
            if (canvasCurrentY === 0) {
                pageGapValue = 0;
            }
            this.pdfViewerBase.viewerContainer.scrollTop = canvasCurrentY - this.mouseCenterY + pageGapValue;
            // update scroll left for the viewer container based on mouse zoom factor
            const previousWidthFactor: number = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
            const scaleCorrectionFactor: number = this.zoomFactor / previousWidthFactor - 1;
            const scrollX: number = this.mouseCenterX - currentPageBoundsLeft;
            if (this.pdfViewerBase.isMixedSizeDocument && (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) >
            this.pdfViewerBase.viewerContainer.clientWidth) {
                this.pdfViewerBase.viewerContainer.scrollLeft = (this.pdfViewerBase.pageContainer.offsetWidth -
                    this.pdfViewerBase.viewerContainer.clientWidth) / 2;
            } else {
                const pageContainer: HTMLElement = document.getElementById(this.pdfViewerBase.pageContainer.id);
                if (pageContainer && pageContainer.children && pageContainer.children[0].clientWidth >
                    this.pdfViewer.viewerBase.viewerContainer.clientWidth) {
                    this.pdfViewerBase.viewerContainer.scrollLeft += scrollX * scaleCorrectionFactor;
                }
                else {
                    this.pdfViewerBase.viewerContainer.scrollLeft = (this.pdfViewerBase.pageContainer.offsetWidth -
                        this.pdfViewerBase.viewerContainer.clientWidth) / 2;
                }
            }
        }
    }

    private rerenderOnScroll(): void {
        this.isPinchZoomed = false;
        if (this.isPinchScrolled) {
            this.rerenderOnScrollTimer = null;
            this.isPinchScrolled = false;
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            const pageDivs: NodeList = document.querySelectorAll('img[id*="' + this.pdfViewer.element.id + '_pageCanvas_"]');
            const viewPortWidth: number = 816;
            for (let i: number = 0; i < pageDivs.length; i++) {
                const pageNumber: number = parseInt((pageDivs[parseInt(i.toString(), 10)] as HTMLElement).id.split('_pageCanvas_')[1], 10);
                const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].width;
                if ((viewPortWidth < pageWidth) && this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    if (this.pdfViewer.restrictZoomRequest) {
                        (pageDivs[parseInt(i.toString(), 10)] as HTMLImageElement).style.width = pageWidth * this.pdfViewerBase.getZoomFactor() + 'px';
                        (pageDivs[parseInt(i.toString(), 10)] as HTMLImageElement).style.height = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height * this.pdfViewerBase.getZoomFactor() + 'px';
                    } else {
                        (pageDivs[parseInt(i.toString(), 10)] as HTMLImageElement).style.width = pageWidth * this.pdfViewerBase.getZoomFactor() + 'px';
                        (pageDivs[parseInt(i.toString(), 10)] as HTMLImageElement).style.height = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height * this.pdfViewerBase.getZoomFactor() + 'px';
                    }

                }
            }
            if (this.pdfViewerBase.textLayer) {
                const textLayers: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
                for (let i: number = 0; i < textLayers.length; i++) {
                    (textLayers[parseInt(i.toString(), 10)] as HTMLElement).style.display = 'none';
                }
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                const annotationLayers: NodeList = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_annotationCanvas_"]');
                for (let j: number = 0; j < annotationLayers.length; j++) {
                    const pageNumber: string = (annotationLayers[parseInt(j.toString(), 10)] as HTMLElement).id.split('_annotationCanvas_')[1];
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(parseInt(pageNumber, 10));
                }
            }
            if (Browser.isDevice) {
                if (this.pdfViewer.formDesignerModule) {
                    const pageNumber: number = this.pdfViewer.currentPageNumber;
                    const fomrFieldCollection: any =
                    this.pdfViewer.formFieldCollection.filter(function (data: any): boolean { return data.pageNumber ===
                        pageNumber; });
                    for (let i: number = 0; i < fomrFieldCollection.length; i++) {
                        document.querySelectorAll('[id^=' + fomrFieldCollection[parseInt(i.toString(), 10)].id + ']').forEach(function (formField: Element): string { return (formField as any).style.display = 'none'; });
                    }
                } else {
                    document.querySelectorAll('[id^="pdfViewerinput_"]').forEach(function (formField: Element): string { return formField.parentElement.style.display = 'none'; });
                }
            }
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.isPagePinchZoomed = false;
            this.rerenderOnScrollTimer = setTimeout(
                () => {
                    this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
                }, 300);
            if (this.pdfViewerBase.textLayer) {
                const textLayers: any = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
                for (let i: number = 0; i < textLayers.length; i++) {
                    textLayers[parseInt(i.toString(), 10)].style.display = 'block';
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public pinchMoveScroll(): void {
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
        }
        if (this.isPagesZoomed || (!this.isRerenderCanvasCreated && this.isPagePinchZoomed)) {
            this.clearRendering();
            this.isPagesZoomed = false;
            clearTimeout(this.magnifyPageRerenderTimer);
            this.isPinchScrolled = true;
            this.isFormFieldPageZoomed = true;
            this.rerenderOnScrollTimer = setTimeout(() => {
                this.rerenderOnScroll();
            }, 100);
        }
    }

    private initiateRerender(proxy: any): void {
        let isReRender: boolean = false;
        if (this.previousZoomFactor < 0.4 || this.pdfViewerBase.isMinimumZoom) {
            isReRender = true;
        }
        if (((proxy.pageRerenderCount === proxy.pdfViewerBase.reRenderedCount) || isReRender) &&
         proxy.pageRerenderCount !== 0 && proxy.pdfViewerBase.reRenderedCount !== 0) {
            proxy.reRenderAfterPinch(this.reRenderPageNumber);
            proxy.isFormFieldPageZoomed = false;
        }
    }

    private reRenderAfterPinch(currentPageIndex: number): void {
        this.pageRerenderCount = 0;
        let lowerPageValue: number = currentPageIndex - 3;
        let higherPageValue: number = currentPageIndex + 1;
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = currentPageIndex - 4;
            higherPageValue = currentPageIndex + 4;
        }
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + i);
            const oldCanvas: HTMLElement = this.pdfViewerBase.getElement('_oldCanvas_' + i);
            if (oldCanvas) {
                oldCanvas.onload = null;
                oldCanvas.onerror = null;
                oldCanvas.parentNode.removeChild(oldCanvas);
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(i);
            } else if (this.pdfViewer.formDesignerModule) {
                this.rerenderAnnotations(i);
                this.pdfViewer.renderDrawing(undefined, currentPageIndex);
            }
            if (pageDiv) {
                pageDiv.style.visibility = 'visible';
            }
        }
        this.isRerenderCanvasCreated = false;
        this.isPagePinchZoomed = false;
        if (this.pdfViewerBase.reRenderedCount !== 0) {
            this.pdfViewerBase.reRenderedCount = 0;
            this.pageRerenderCount = 0;
            clearInterval(this.rerenderInterval);
            this.rerenderInterval = null;
        }
        this.imageObjects = [];
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public rerenderAnnotations(pageNumber: number): void {
        const oldCanvasCollection: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_old_annotationCanvas_' + pageNumber);
        for (let i: number = 0; i < oldCanvasCollection.length; i++) {
            if (oldCanvasCollection[parseInt(i.toString(), 10)]) {
                oldCanvasCollection[parseInt(i.toString(), 10)].parentElement.removeChild(oldCanvasCollection[parseInt(i.toString(), 10)]);
            }
        }
        // Styles need to be applied to both canvases. The 'blendAnnotationsIntoCanvas' is used for highlight annotations.
        ['_annotationCanvas_', '_blendAnnotationsIntoCanvas_'].forEach((id: string) => {
            const canvas: HTMLElement = this.pdfViewerBase.getElement(`${id}${pageNumber}`);
            if (!isNullOrUndefined(canvas)) {
                canvas.style.setProperty('display', 'block');
            }
        });
    }

    /**
     * @param {number} currentPageIndex - It describes about the current page index
     * @private
     * @returns {void}
     */
    public designNewCanvas(currentPageIndex: number): void {
        if (this.pdfViewerBase.textLayer) {
            this.pdfViewerBase.textLayer.clearTextLayers();
        }
        let lowerPageValue: number = currentPageIndex - 3;
        let higherPageValue: number = currentPageIndex + 1; // jshint ignore:line
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = currentPageIndex - 4;
            higherPageValue = currentPageIndex + 4;
        }
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            if (this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)]) {
                const canvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                const width: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width * this.zoomFactor;
                const height: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height * this.zoomFactor;
                if (canvas && !this.pdfViewer.restrictZoomRequest) {
                    this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), width, height, i, 'none');
                } else if (!this.pdfViewer.restrictZoomRequest) {
                    this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), width, height, i, 'none');
                }
            }
        }
        this.isRerenderCanvasCreated = true;
        this.isCanvasCreated = true;
    }

    /**
     * @private
     * @returns {void}
     */
    public pageRerenderOnMouseWheel(): void {
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
            if (!this.isCanvasCreated) {
                clearTimeout(this.magnifyPageRerenderTimer);
                this.isCanvasCreated = false;
            }
            if (!this.isPinchScrolled) {
                this.isPinchScrolled = true;
                this.rerenderOnScrollTimer = setTimeout(() => {
                    this.rerenderOnScroll();
                }, 100);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public renderCountIncrement(): void {
        if (this.isRerenderCanvasCreated) {
            this.pageRerenderCount++;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public rerenderCountIncrement(): void {
        if (this.pageRerenderCount > 0) {
            this.pdfViewerBase.reRenderedCount++;
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public resizeCanvas(pageNumber: number): void {
        const annotationModule: any = this.pdfViewer.annotationModule;
        if (annotationModule && annotationModule.inkAnnotationModule && annotationModule.inkAnnotationModule.outputString !== '') {
            annotationModule.inkAnnotationModule.inkPathDataCollection.push({ pathData:
                annotationModule.inkAnnotationModule.outputString, zoomFactor:
                annotationModule.inkAnnotationModule.inkAnnotationInitialZoom });
            annotationModule.inkAnnotationModule.outputString = '';
        }
        if (annotationModule && annotationModule.freeTextAnnotationModule) {
            const currentPosition: any = { x: annotationModule.freeTextAnnotationModule.currentPosition[0],
                y: annotationModule.freeTextAnnotationModule.currentPosition[1],
                width: annotationModule.freeTextAnnotationModule.currentPosition[2],
                height: annotationModule.freeTextAnnotationModule.currentPosition[3] };
            annotationModule.freeTextAnnotationModule.addInputInZoom(currentPosition);
        }
        let lowerPageValue: number = pageNumber - 3;
        let higherPageValue: number = pageNumber + 3;
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = pageNumber - 4;
            higherPageValue = pageNumber + 4;
        }
        if (this.pdfViewer.initialRenderPages > this.pdfViewerBase.pageRenderCount) {
            lowerPageValue = 0;
            higherPageValue = (higherPageValue < this.pdfViewer.initialRenderPages) ?
                (this.pdfViewer.initialRenderPages <= this.pdfViewerBase.pageCount) ?
                    this.pdfViewer.initialRenderPages : this.pdfViewerBase.pageCount :
                (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        } else {
            lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
            higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        }
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + i);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + i);
            if (pageDiv) {
                if ((lowerPageValue <= i) && (i <= higherPageValue)) {
                    let isSelectionAvailable: boolean = false;
                    if (this.pdfViewer.textSelectionModule) {
                        isSelectionAvailable = this.pdfViewer.textSelectionModule.isSelectionAvailableOnScroll(i);
                    }
                    if (this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)] != null) {
                        const width: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width * this.zoomFactor;
                        const height: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height * this.zoomFactor;
                        pageDiv.style.width = width + 'px';
                        pageDiv.style.height = height + 'px';
                        pageDiv.style.top = ((this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].top) * this.zoomFactor) + 'px';
                        if (this.pdfViewer.enableRtl) {
                            pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        } else {
                            pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        const canvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                        if (canvas) {
                            canvas.style.width = (width) + 'px';
                            canvas.style.height = height + 'px';
                            if (this.pdfViewer.annotation) {
                                this.pdfViewer.annotationModule.resizeAnnotations(width, height, i);
                            } else if (this.pdfViewer.formDesignerModule) {
                                this.pdfViewer.formDesignerModule.resizeAnnotations(width, height, i);
                            }
                        }
                        let zoomFactor: number = this.pdfViewerBase.retrieveCurrentZoomFactor();
                        const tileCount: number = this.pdfViewerBase.getTileCount(this.pdfViewerBase.
                            pageSize[parseInt(i.toString(), 10)].width, this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height);
                        let noTileX: number;
                        let noTileY: number;
                        noTileX = noTileY = tileCount;
                        const tileSettings: TileRenderingSettingsModel = this.pdfViewer.tileRenderingSettings;
                        if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
                            if ((1200 < this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width ||
                            this.pdfViewerBase.getZoomFactor() > 2)) {
                                noTileX = tileSettings.x;
                                noTileY = tileSettings.y;
                            }
                        }
                        const tileRequestCount: number = noTileX * noTileY;
                        if (tileRequestCount === 1) {
                            let storedData: any;
                            if (this.pdfViewerBase.clientSideRendering) {
                                storedData = this.pdfViewerBase.getWindowSessionStorage(i, zoomFactor) ?
                                    this.pdfViewerBase.getWindowSessionStorage(i, zoomFactor) : this.pdfViewerBase.getPinchZoomPage(i);
                            } else {
                                storedData = this.pdfViewerBase.getLinkInformation(i) ?
                                    this.pdfViewerBase.getLinkInformation(i) : this.pdfViewerBase.getWindowSessionStorage(i, zoomFactor);
                            }
                            if (storedData) {
                                storedData = this.pdfViewerBase.clientSideRendering && typeof storedData === 'object' ? storedData : JSON.parse(storedData);
                                const imageData: string = storedData['image'];
                                if (imageData) {
                                    (canvas as HTMLImageElement).src = imageData;
                                    canvas.style.display = 'block';
                                    const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + this.pdfViewer.element.id + '_tileimg_' + i + '_"]');
                                    const pageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + i);
                                    for (let k: number = 0; k < oldCanvases.length; k++) {
                                        const tileImgId: string[] = oldCanvases[parseInt(k.toString(), 10)].id.split('_');
                                        if (parseFloat(tileImgId[tileImgId.length - 3]) !== this.pdfViewerBase.getZoomFactor()){
                                            (oldCanvases[parseInt(k.toString(), 10)] as HTMLImageElement).onload = null;
                                            (oldCanvases[parseInt(k.toString(), 10)] as HTMLImageElement).onerror = null;
                                            pageCanvas.removeChild(oldCanvases[parseInt(k.toString(), 10)]);
                                        }
                                    }
                                    const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + this.pdfViewer.element.id + '_oldCanvas"]');
                                    for (let j: number = 0; j < oldPageDiv.length; j++) {
                                        (oldPageDiv[parseInt(j.toString(), 10)] as HTMLImageElement).onload = null;
                                        (oldPageDiv[parseInt(j.toString(), 10)] as HTMLImageElement).onerror = null;
                                        pageDiv.removeChild(oldPageDiv[parseInt(j.toString(), 10)]);
                                    }
                                }
                                this.pdfViewerBase.isReRenderRequired = false;
                            } else {
                                this.pdfViewerBase.isReRenderRequired = true;
                            }
                        } else {
                            const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + this.pdfViewer.element.id + '_tileimg_' + i + '_"]');
                            for (let l: number = 0; l < oldCanvases.length; l++) {
                                const tileImgId: string[] = oldCanvases[parseInt(l.toString(), 10)].id.split('_');
                                const tileX: number = parseFloat(tileImgId[tileImgId.length - 2]);
                                const tileY: number = parseFloat(tileImgId[tileImgId.length - 1]);
                                const tileData: any = this.pdfViewerBase.clientSideRendering ?
                                    JSON.parse(this.pdfViewerBase.getStoredTileImageDetails(i, tileX, tileY, zoomFactor)) :
                                    JSON.parse(this.pdfViewerBase.getWindowSessionStorageTile(i, tileX, tileY, zoomFactor));
                                if (tileData && tileData.zoomFactor) {
                                    zoomFactor = tileData.zoomFactor;
                                }
                                if (parseFloat(tileImgId[tileImgId.length - 4]) === i) {
                                    canvas.style.display = 'none';
                                    const node: Node = oldCanvases[parseInt(l.toString(), 10)];
                                    // Make sure it's really an Element
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        let dataScaleFactor: number = 1.5;
                                        if (!isNullOrUndefined(tileData)) {
                                            dataScaleFactor = (!isNullOrUndefined(tileData.scaleFactor)) ? tileData.scaleFactor : 1.5;
                                        }
                                        const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width;
                                        const serverImageWidth: number = pageWidth * zoomFactor * dataScaleFactor;
                                        const serverImageHeight: number = this.pdfViewerBase.
                                            pageSize[parseInt(i.toString(), 10)].height * zoomFactor * dataScaleFactor;
                                        const tilewidth: number = serverImageWidth / noTileX;
                                        const tileHeight: number = serverImageHeight / noTileY;
                                        const originalWidth: number = tilewidth;
                                        const originalLeft: number = parseFloat(tileImgId[tileImgId.length - 2]) * tilewidth;
                                        const originalTop: number = parseFloat(tileImgId[tileImgId.length - 1]) * tileHeight;
                                        (node as any).width = (((originalWidth * this.pdfViewerBase.getZoomFactor()) / zoomFactor) /
                                        dataScaleFactor);
                                        (node as any).style.width = (((originalWidth * this.pdfViewerBase.getZoomFactor()) / zoomFactor) / dataScaleFactor) + 'px';
                                        (node as HTMLElement).style.left = (((originalLeft * this.pdfViewerBase.getZoomFactor()) / zoomFactor) / dataScaleFactor) + 'px';
                                        (node as HTMLElement).style.top = (((originalTop * this.pdfViewerBase.getZoomFactor()) / zoomFactor) / dataScaleFactor) + 'px';
                                        (node as HTMLElement).id = this.pdfViewer.element.id + '_tileimg_' + i + '_' + this.pdfViewerBase.getZoomFactor() + '_' + tileX + '_' + tileY;
                                        if (tileData) {
                                            const imageData: string = tileData['image'];
                                            if (imageData) {
                                                (node as HTMLImageElement).src = imageData;
                                            }
                                            this.pdfViewerBase.isReRenderRequired = false;
                                        } else {
                                            this.pdfViewerBase.isReRenderRequired = true;
                                        }
                                    }
                                }
                            }
                            if (oldCanvases.length === 0) {
                                this.pdfViewerBase.isReRenderRequired = true;
                            }
                        }
                        if (textLayer) {
                            textLayer.style.width = width + 'px';
                            textLayer.style.height = height + 'px';
                            if (this.pdfViewer.textSelectionModule) {
                                if (this.isPinchZoomed) {
                                    textLayer.style.display = 'none';
                                } else if (this.isMagnified) {
                                    const lowerValue: number = ((pageNumber - 2) === 0) ? 0 : (pageNumber - 2);
                                    const higherValue: number = ((pageNumber) === (this.pdfViewerBase.pageCount)) ?
                                        (this.pdfViewerBase.pageCount - 1) : (pageNumber + 1);
                                    if ((lowerValue <= i) && (i <= higherValue) && ((this.pdfViewer.textSelectionModule.isTextSelection &&
                                        isSelectionAvailable) || this.pdfViewerBase.textLayer.getTextSearchStatus() ||
                                        this.pdfViewerBase.isInitialPageMode)) {
                                        this.pdfViewerBase.textLayer.resizeTextContentsOnZoom(i);
                                        if (this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) {
                                            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
                                        }
                                    }
                                }
                            }
                            this.pdfViewerBase.applyElementStyles(textLayer, i);
                        }
                        const adornerSvg: HTMLElement = getDiagramElement(this.pdfViewer.element.id + '_textLayer_' + i);
                        if (adornerSvg) {
                            const adonerLayer: HTMLElement = getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdorner_svg');
                            if (adonerLayer) {
                                adonerLayer.style.width = width + 'px';
                                adonerLayer.style.height = height + 'px';
                            }
                            const diagramAdornerLayer: HTMLElement =
                                getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdornerLayer');
                            if (diagramAdornerLayer) {
                                diagramAdornerLayer.style.width = width + 'px';
                                diagramAdornerLayer.style.height = height + 'px';
                            }
                            adornerSvg.style.width = width + 'px';
                            adornerSvg.style.height = height + 'px';
                            this.pdfViewer.renderSelector(i, this.pdfViewer.annotationSelectorSettings);
                            this.pdfViewerBase.applyElementStyles(diagramAdornerLayer, i);
                        }
                    }
                }
            }
        }
    }

    private zoomOverPages(pointX1: number, pointY1: number, pointX2: number, pointY2: number): void {
        const currentDifference: number = Math.sqrt(Math.pow((pointX1 - pointX2), 2) + Math.pow((pointY1 - pointY2), 2));
        if (this.previousTouchDifference > -1) {
            if (currentDifference > this.previousTouchDifference) {
                this.pinchStep = this.getPinchStep(currentDifference, this.previousTouchDifference);
                this.pinchOut();
            } else if (currentDifference < this.previousTouchDifference) {
                this.pinchStep = this.getPinchStep(this.previousTouchDifference, currentDifference);
                this.pinchIn();
            }
        }
        this.previousTouchDifference = currentDifference;
    }

    /**
     * @private
     * @returns {void}
     */
    public pinchMoveEnd(): void {
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.previousTouchDifference = -1;
        if (this.isPinchZoomed) {
            this.isPinchScrolled = false;
            this.isPagePinchZoomed = true;
            this.pinchMoveScroll();
        }
        this.isFormFieldPageZoomed = false;
    }

    /**
     * @param {WheelEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public fitPageScrollMouseWheel(event: WheelEvent): void {
        if (this.fitType === 'fitToPage') {
            this.isMagnified = false;
            event.preventDefault();
            if (event.deltaY > 0) {
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            } else {
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
        }
    }

    /**
     * @param {KeyboardEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public magnifyBehaviorKeyDown(event: KeyboardEvent): void {
        const isMac: boolean = /ipad|iphone|ipod|mac/.test(navigator.userAgent.toLowerCase()) ? true : false;
        const isCommandKey: boolean = isMac ? event.metaKey : false;
        const keyCode: number = this.pdfViewerBase.getLegacyKeyCode(event);
        if (event.ctrlKey || isCommandKey) {
            if (event.code === 'Equal') {
                event.preventDefault();
                this.zoomIn();
            }
        }
        if (event.ctrlKey || isCommandKey) {
            if (event.code === 'Minus') {
                event.preventDefault();
                this.zoomOut();
            }
        }
        switch (keyCode) {
        case 37: // left arrow
            if (event.ctrlKey || isCommandKey) {
                event.preventDefault();
                this.pdfViewerBase.updateScrollTop(0);
            }
            else if (this.focusOnViewerContainer() && this.formElementcheck(event) ){
                event.preventDefault();
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            break;
        case 38: // up arrow
        case 33: // page up
            if (event.ctrlKey || isCommandKey) {
                event.preventDefault();
                this.pdfViewerBase.updateScrollTop(0);
            }
            else if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                event.preventDefault();
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            break;
        case 39: // right arrow
            if (event.ctrlKey || isCommandKey) {
                event.preventDefault();
                this.pdfViewerBase.updateScrollTop(this.pdfViewerBase.pageCount - 1);
            }
            else if (this.focusOnViewerContainer() && this.formElementcheck(event) ){
                event.preventDefault();
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            break;
        case 40: // down arrow
        case 34: // page down
            if (event.ctrlKey || isCommandKey) {
                event.preventDefault();
                this.pdfViewerBase.updateScrollTop(this.pdfViewerBase.pageCount - 1);
            }
            else if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                event.preventDefault();
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            break;
        case 48: // zero key
            if ((event.ctrlKey || isCommandKey) && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                this.fitToPage();
            }
            break;
        case 49: // one key
            if ((event.ctrlKey || isCommandKey) && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                this.zoomTo(100);
            }
            break;
        default:
            break;
        }
    }
    private formElementcheck(event: KeyboardEvent ): boolean {
        const target: HTMLElement = event.target as HTMLElement;
        return (target.offsetParent && target.offsetParent.classList.length > 0 && !target.offsetParent.classList.contains('foreign-object'));
    }
    private focusOnViewerContainer(): boolean{
        const activeElement: Element = document.activeElement;
        const viewerContainer: HTMLElement = document.querySelector('.e-pv-viewer-container');
        return viewerContainer.contains(activeElement);
    }
    private upwardScrollFitPage(currentPageIndex: number): void {
        if (currentPageIndex > 0) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1));
            if (pageDiv) {
                pageDiv.style.visibility = 'visible';
                this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex - 1].top * this.zoomFactor;
                if (this.isFitToPageMode) {
                    const division: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex));
                    if (division) {
                        division.style.visibility = 'hidden';
                    }
                }
            }
        }
    }

    /**
     * @param {number} currentPageIndex - It describes about the current page index
     * @private
     * @returns {void}
     */
    public updatePagesForFitPage(currentPageIndex: number): void {
        if (this.fitType === 'fitToPage') {
            if (this.isFitToPageMode) {
                if (currentPageIndex > 0 && this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1))) {
                    this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'hidden';
                }
                if ((currentPageIndex < (this.pdfViewerBase.pageCount - 1)) && this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1))) {
                    this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'hidden';
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public onDoubleTapMagnification(): void {
        if (this.pdfViewer.toolbarModule && isBlazor()) {
            this.pdfViewer.toolbarModule.showToolbar(true);
        }
        const scrollValue: number = this.pdfViewerBase.viewerContainer.scrollTop;
        if (!this.pdfViewer.selectedItems.annotations[0]) {
            this.isDoubleTapZoom = true;
            if (!this.isTapToFitZoom) {
                if (this.zoomFactor < 2) {
                    this.zoomTo(200);
                } else {
                    this.fitToWidth();
                }
            } else {
                this.fitToWidth();
            }
            this.calculateScrollValues(scrollValue);
            this.isTapToFitZoom = !this.isTapToFitZoom;
            setTimeout(() => { this.isMagnified = false; }, 500);
            this.isDoubleTapZoom = false;
        } else {
            if (isBlazor()) {
                if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    const elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    this.pdfViewer.annotation.freeTextAnnotationModule.
                        addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
            }
        }
    }

    private downwardScrollFitPage(currentPageIndex: number): void {
        if (currentPageIndex !== (this.pdfViewerBase.pageCount - 1)) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1));
            if (pageDiv) {
                pageDiv.style.visibility = 'visible';
            }
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex + 1].top * this.zoomFactor;
            if (this.isFitToPageMode) {
                const division1: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex));
                const division2: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 2));
                if (currentPageIndex + 1 === (this.pdfViewerBase.pageCount - 1)) {
                    if (division1) {
                        division1.style.visibility = 'hidden';
                    }
                } else {
                    if (division2) {
                        division2.style.visibility = 'hidden';
                    }
                }
            }
        }
    }

    private getMagnifiedValue(value: number): number {
        return (value / this.previousZoomFactor) * this.zoomFactor;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.imageObjects = undefined;
    }

    /**
     * returns zoom factor when the zoom percent is passed.
     *
     * @param {number} zoomValue - It describes about the zoom value
     * @returns {number} - number
     */
    private getZoomFactor(zoomValue: number): number {
        return zoomValue / 100;
    }
    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'Magnification';
    }

    /**
     * Returns the pinch step value.
     *
     * @param {number} higherValue - It describes about the higher value
     * @param {number} lowerValue - It describes about the lower value
     * @returns {number} - number
     */
    private getPinchStep(higherValue: number, lowerValue: number): number {
        const defaultPinchStep: number = 0.02; // Default pinch step value.
        const higherPinchStep: number = 1; // higher pinch step value.
        let pinchstep: number = (higherValue - lowerValue) / 100;
        if (pinchstep < defaultPinchStep) {
            pinchstep = defaultPinchStep;
        } else if (pinchstep > higherPinchStep) {
            pinchstep = 0.1; // set the pinch step as 0.1 if the pinch reaches the higher pinch step value.
        }
        return pinchstep;
    }

    /**
     * @private
     * @param {Rect} zoomRect - Specifies the region in client coordinates that is to be brought to view.
     * @returns {void}
     */
    public zoomToRect(zoomRect: Rect): void {
        let desiredScaleFactor: number;
        const pdfViewerBase: PdfViewerBase = this.pdfViewerBase;
        const viewerContainer: any = pdfViewerBase.viewerContainer;
        const pdfViewer: PdfViewer = this.pdfViewer;
        if (zoomRect.width > 0 && zoomRect.height > 0) {
            const location: any = { x: zoomRect.x, y: zoomRect.y };
            const pageNumber: number = pdfViewer.getPageNumberFromClientPoint(location);
            if (pageNumber > 0) {
                const desiredHorizontalScale: number = viewerContainer.getBoundingClientRect().width / zoomRect.width;
                const desiredVerticalScale: number = viewerContainer.getBoundingClientRect().height / zoomRect.height;
                if (desiredHorizontalScale < desiredVerticalScale) {
                    desiredScaleFactor = desiredHorizontalScale;
                } else {
                    desiredScaleFactor = desiredVerticalScale;
                }
                let zoomValue: number = 100; // default zoom value
                const zoomPercentage: number = pdfViewerBase.getZoomFactor() * 100;
                zoomValue = zoomPercentage * desiredScaleFactor;
                const prevScrollTop: number = viewerContainer.scrollTop;
                const prevScrollLeft: number = viewerContainer.scrollLeft;
                // Zoom to desired zoom value.
                this.zoomTo(zoomValue);
                viewerContainer.scrollTop = prevScrollTop;
                viewerContainer.scrollLeft = prevScrollLeft;
                const zoomFactor: number = pdfViewerBase.getZoomFactor();
                let pagepoint: any = { x: zoomRect.x, y: zoomRect.y };
                // Convert the client point to page point.
                pagepoint = pdfViewer.convertClientPointToPagePoint(pagepoint, pageNumber);
                pdfViewerBase.updateScrollTop(pageNumber - 1);
                // To adjust the container to the left position.
                viewerContainer.scrollLeft = (pagepoint.x - prevScrollLeft) * zoomFactor;
                // To adjust the container to the top position.
                viewerContainer.scrollTop = ((pagepoint.y + pdfViewerBase.pageSize[pageNumber - 1].top) - prevScrollTop) * zoomFactor;
            }
        }
    }

    /**
     * Returns Point value respect to Main container.
     *
     * @param {number} pointX - It describes about the pointX
     * @param {number} pointY - It describes about the pointY
     * @returns {any} - any
     */
    private positionInViewer(pointX: number, pointY: number): any {
        const mainRect: any = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        return { x: pointX - mainRect.left, y: pointY - mainRect.top };
    }
}
