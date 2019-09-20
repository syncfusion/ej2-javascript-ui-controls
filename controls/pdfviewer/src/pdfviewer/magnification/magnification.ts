import { Browser } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';
import { getDiagramElement } from '@syncfusion/ej2-drawings';

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
    private zoomPercentages: number[] = [50, 75, 100, 125, 150, 200, 400];
    private isNotPredefinedZoom: boolean = false;
    private pinchStep: number = 0.02;
    private reRenderPageNumber: number = 0;
    // tslint:disable-next-line
    private magnifyPageRerenderTimer: any = null;
    // tslint:disable-next-line
    private rerenderOnScrollTimer: any = null;
    // tslint:disable-next-line
    private rerenderInterval: any = null;
    private previousTouchDifference: number;
    private touchCenterX: number = 0;
    private touchCenterY: number = 0;
    private pageRerenderCount: number = 0;
    private imageObjects: HTMLImageElement[] = [];
    private topValue: number = 0;
    private isTapToFitZoom: boolean = false;
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
    private isWebkitMobile: boolean = false;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.zoomLevel = 2;
        // tslint:disable-next-line:max-line-length
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1);
    }

    /**
     * Zoom the PDF document to the given zoom value
     * @param  {number} zoomValue - Specifies the Zoom Value for magnify the PDF document
     * @returns void
     */
    public zoomTo(zoomValue: number): void {
        if (zoomValue < 50) {
            zoomValue = 50;
        } else if (zoomValue > 400) {
            zoomValue = 400;
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
     * @returns void
     */
    public zoomIn(): void {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.lowerZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel >= 6) {
            this.zoomLevel = 6;
        } else {
            this.zoomLevel++;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    }

    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     * @returns void
     */
    public zoomOut(): void {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.higherZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel <= 0) {
            this.zoomLevel = 0;
        } else {
            this.zoomLevel--;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    }

    /**
     * Scales the page to fit the page width to the width of the container in the control.
     * @returns void
     */
    public fitToWidth(): void {
        this.isAutoZoom = false;
        let zoomValue: number = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }

    /**
     * @private
     */
    public fitToAuto(): void {
        this.isAutoZoom = true;
        let zoomValue: number = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }

    /**
     * Scales the page to fit the page in the container in the control.
     * @param  {number} zoomValue - Defines the Zoom Value for fit the page in the Container
     * @returns void
     */
    public fitToPage(): void {
        let zoomValue: number = this.calculateFitZoomFactor('fitToPage');
        if (zoomValue !== null) {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
            if (Browser.isDevice) {
                if (this.isWebkitMobile) {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
                } else {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
                }
            } else {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top * this.zoomFactor;
        }
    }

    /**
     * Returns zoom factor for the fit zooms.
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
        let highestWidth: number = 0;
        let highestHeight: number = 0;
        this.fitType = type;
        if (this.fitType === 'fitToWidth') {
            let pageWidth: number = 0;
            for (let i: number = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageWidth = this.pdfViewerBase.pageSize[i].width;
                if (pageWidth > highestWidth) {
                    highestWidth = pageWidth;
                }
            }
            let scaleX: number = ((viewerWidth - this.scrollWidth) / highestWidth);
            if (this.isAutoZoom) {
                this.fitType = null;
                scaleX = Math.min(1, scaleX);
                if (scaleX === 1) {
                    this.zoomLevel = 2;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt((scaleX * 100).toString());
        } else {
            let pageHeight: number = 0;
            for (let i: number = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageHeight = this.pdfViewerBase.pageSize[i].height;
                if (pageHeight > highestHeight) {
                    highestHeight = pageHeight;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt(((viewerHeight / highestHeight) * 100).toString());
        }
    }

    /**
     * Performs pinch in operation
     */
    private pinchIn(): void {
        this.fitType = null;
        let temporaryZoomFactor: number = this.zoomFactor - this.pinchStep;
        if (temporaryZoomFactor < 4 && temporaryZoomFactor > 2) {
            temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        }
        if (temporaryZoomFactor < 0.5) {
            temporaryZoomFactor = 0.5;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    }

    /**
     * Performs pinch out operation
     */
    private pinchOut(): void {
        this.fitType = null;
        let temporaryZoomFactor: number = this.zoomFactor + this.pinchStep;
        if (temporaryZoomFactor > 2) {
            temporaryZoomFactor = temporaryZoomFactor + this.pinchStep;
        }
        if (temporaryZoomFactor > 4) {
            temporaryZoomFactor = 4;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    }

    /**
     * returns zoom level for the zoom factor.
     */
    private getZoomLevel(zoomFactor: number): number {
        let min: number = 0;
        let max: number = this.zoomPercentages.length - 1;
        while ((min <= max) && !(min === 0 && max === 0)) {
            let mid: number = Math.round((min + max) / 2);
            if (this.zoomPercentages[mid] <= zoomFactor) {
                min = mid + 1;
            } else if (this.zoomPercentages[mid] >= zoomFactor) {
                max = mid - 1;
            }
        }
        this.higherZoomLevel = min;
        this.lowerZoomLevel = max;
        return max;
    }
    /**
     * @private
     */
    public checkZoomFactor(): boolean {
        return this.zoomPercentages.indexOf(this.zoomFactor * 100) > -1;
    }

    /**
     * Executes when the zoom or pinch operation is performed
     */
    private onZoomChanged(zoomValue: number): void {
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.closePopupMenu();
        }
        this.previousZoomFactor = this.zoomFactor;
        this.zoomLevel = this.getZoomLevel(zoomValue);
        this.zoomFactor = this.getZoomFactor(zoomValue);
        if (Browser.isDevice) {
            if (this.isWebkitMobile) {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
            } else {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
            }
        } else {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
        }
        if (this.pdfViewerBase.pageCount > 0) {
            if ((this.previousZoomFactor !== this.zoomFactor) || this.isInitialLoading ) {
                if (!this.isPinchZoomed) {
                    this.magnifyPages();
                } else {
                    if (Browser.isDevice) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.mobilePageNoContainer.style.left = (this.pdfViewer.element.clientWidth / 2) - (parseFloat(this.pdfViewerBase.mobilePageNoContainer.style.width) / 2) + 'px';
                    }
                    this.responsivePages();
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateZoomButtons();
            }
            this.pdfViewer.fireZoomChange();
        }
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateZoomPercentage(this.zoomFactor);
        }
        if (Browser.isDevice && this.isPinchZoomed) {
            // tslint:disable-next-line:radix
            let zoomPercentage: string = parseInt((this.zoomFactor * 100).toString()) + '%';
            this.pdfViewerBase.navigationPane.createTooltipMobile(zoomPercentage);
        }
    }

    /**
     * @private
     */
    public setTouchPoints(clientX: number, clientY: number): void {
        this.touchCenterX = clientX;
        this.touchCenterY = clientY;
    }

    /**
     * @private
     */
    public initiatePinchMove(pointX1: number, pointY1: number, pointX2: number, pointY2: number): void {
        this.isPinchScrolled = false;
        this.isMagnified = false;
        this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        this.touchCenterX = (pointX1 + pointX2) / 2;
        this.touchCenterY = (pointY1 + pointY2) / 2;
        this.zoomOverPages(pointX1, pointY1, pointX2, pointY2);
    }

    private magnifyPages(): void {
        this.clearRerenderTimer();
        if (!this.isPagesZoomed) {
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        }
        this.isPagesZoomed = true;
        let scrollValue: number = this.getMagnifiedValue(this.pdfViewerBase.viewerContainer.scrollTop);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(false, true);
        }
        if (!this.isInitialLoading) {
            this.isMagnified = true;
        }
        this.updatePageLocation();
        this.resizeCanvas(this.reRenderPageNumber);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.resizeTouchElements();
        }
        if (this.pdfViewerBase.pageSize.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.getPageHeight(this.pdfViewerBase.pageSize.length - 1) + 'px';
            // tslint:disable-next-line 
            let proxy: any = this;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.pdfViewerBase.viewerContainer.scrollTop = scrollValue;
            this.magnifyPageRerenderTimer = setTimeout(
                () => { proxy.rerenderMagnifiedPages(); }, 800);
        }
    }

    private updatePageLocation(): void {
        this.topValue = 0;
        for (let i: number = 1; i < this.pdfViewerBase.pageSize.length; i++) {
            this.topValue += (this.pdfViewerBase.pageSize[i].height + this.pdfViewerBase.pageGap) * this.zoomFactor;
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
     */
    public clearIntervalTimer(): void {
        clearInterval(this.rerenderInterval);
        this.rerenderInterval = null;
        this.clearRendering();
        let oldCanvases: NodeListOf<Element> = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_oldCanvas_"]');
        for (let i: number = 0; i < oldCanvases.length; i++) {
            // tslint:disable-next-line
            let pageNumber: number = parseInt(oldCanvases[i].id.split('_oldCanvas_')[1]);
            let pageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                oldCanvases[i].id = pageCanvas.id;
                pageCanvas.parentElement.removeChild(pageCanvas);
            } else {
                oldCanvases[i].id = this.pdfViewer.element.id + '_pageCanvas_' + pageNumber;
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(i);
            }
        }
        this.isRerenderCanvasCreated = false;
    }

    /**
     * @private
     */
    public pushImageObjects(image: HTMLImageElement): void {
        this.imageObjects.push(image);
    }

    private clearRendering(): void {
        if (this.imageObjects) {
            for (let j: number = 0; j < this.imageObjects.length; j++) {
                if (this.imageObjects[j]) {
                    this.imageObjects[j].onload = null;
                }
            }
            this.imageObjects = [];
        }
    }

    private rerenderMagnifiedPages(): void {
        if (this.pdfViewerBase.isInitialLoaded || this.pdfViewerBase.isDocumentLoaded) {
            this.renderInSeparateThread(this.reRenderPageNumber);
            this.isPagesZoomed = false;
        }
    }

    private renderInSeparateThread(pageNumber: number): void {
        this.designNewCanvas(pageNumber);
        this.pageRerenderCount = 0;
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        this.isMagnified = false;
        this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
        // tslint:disable-next-line
        let proxy: any = this;
        this.rerenderInterval = setInterval(
            () => { this.initiateRerender(proxy); }, 1);
    }


    private responsivePages(): void {
        this.isPagesZoomed = true;
        this.clearRerenderTimer();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewer.textSearchModule.clearAllOccurrences();
        }
        let scrollValue: number = this.pdfViewerBase.viewerContainer.scrollTop;
        this.isAutoZoom = false;
        this.updatePageLocation();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.pageSize[this.pdfViewerBase.pageSize.length - 1].height * this.zoomFactor + 'px';
        this.resizeCanvas(this.pdfViewerBase.currentPageNumber);
        if (this.isPinchZoomed) {
            this.calculateScrollValues(scrollValue);
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    }

    private calculateScrollValues(scrollValue: number): void {
        let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        let currentPageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
        if (currentPageCanvas) {
            let currentPageBounds: ClientRect = currentPageCanvas.getBoundingClientRect();
            // update scroll top for the viewer container based on pinch zoom factor
            let previousPageTop: number = (currentPageBounds.top) * this.previousZoomFactor;
            let previousY: number = scrollValue + this.touchCenterY;
            // tslint:disable-next-line:max-line-length
            let currentY: number = (currentPageBounds.top) * this.zoomFactor + ((previousY - previousPageTop) < 0 ? previousY - previousPageTop : (previousY -
                // tslint:disable-next-line:max-line-length
                previousPageTop) * (this.zoomFactor / this.previousZoomFactor));
            this.pdfViewerBase.viewerContainer.scrollTop = currentY - this.touchCenterY;
            // update scroll left for the viewer container based on pinch zoom factor
            let prevValue: number = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
            let scaleCorrectionFactor: number = this.zoomFactor / prevValue - 1;
            let scrollX: number = this.touchCenterX - currentPageBounds.left;
            this.pdfViewerBase.viewerContainer.scrollLeft += scrollX * scaleCorrectionFactor;
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
            let pageDivs: NodeList = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_pageCanvas_"]');
            let viewportWidth: number = this.pdfViewer.element.clientWidth;
            for (let i: number = 0; i < pageDivs.length; i++) {
                // tslint:disable-next-line:radix
                let pageNumber: number = parseInt((pageDivs[i] as HTMLElement).id.split('_pageCanvas_')[1]);
                let pageWidth: number = this.pdfViewerBase.pageSize[pageNumber].width;
                if (viewportWidth < pageWidth) {
                    (pageDivs[i] as HTMLCanvasElement).width = pageWidth * this.pdfViewerBase.getZoomFactor();
                    // tslint:disable-next-line:max-line-length
                    (pageDivs[i] as HTMLCanvasElement).height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
                }
            }
            if (this.pdfViewerBase.textLayer) {
                let textLayers: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
                for (let i: number = 0; i < textLayers.length; i++) {
                    (textLayers[i] as HTMLElement).style.display = 'block';
                }
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                // tslint:disable-next-line:max-line-length
                let annotationLayers: NodeList = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_annotationCanvas_"]');
                for (let j: number = 0; j < annotationLayers.length; j++) {
                    let pageNumber: string = (annotationLayers[j] as HTMLElement).id.split('_annotationCanvas_')[1];
                    // tslint:disable-next-line:radix
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(parseInt(pageNumber));
                }
            }
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.isPagePinchZoomed = false;
            this.rerenderOnScrollTimer = setTimeout(
                () => { this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber); }, 300);
        }
    }

    /**
     * @private
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
            this.rerenderOnScrollTimer = setTimeout(() => { this.rerenderOnScroll(); }, 100);
        }
    }

    // tslint:disable-next-line
    private initiateRerender(proxy: any): void {
        if (proxy.pageRerenderCount === proxy.pdfViewerBase.reRenderedCount && proxy.pageRerenderCount !== 0 && proxy.pdfViewerBase.reRenderedCount !== 0) {
            proxy.reRenderAfterPinch(this.reRenderPageNumber);
        }
    }

    private reRenderAfterPinch(currentPageIndex: number): void {
        this.pageRerenderCount = 0;
        let lowerPageValue: number = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = currentPageIndex + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + i);
            let pageCanvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (pageCanvas) {
                pageCanvas.style.display = 'block';
            }
            let oldCanvas: HTMLElement = this.pdfViewerBase.getElement('_oldCanvas_' + i);
            if (oldCanvas) {
                oldCanvas.parentNode.removeChild(oldCanvas);
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(i);
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

    private designNewCanvas(currentPageIndex: number): void {
        if (this.pdfViewerBase.textLayer) {
            this.pdfViewerBase.textLayer.clearTextLayers();
        }
        let lowerPageValue: number = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = currentPageIndex + 1; // jshint ignore:line
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            let canvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (canvas) {
                canvas.id = this.pdfViewer.element.id + '_oldCanvas_' + i;
                canvas.style.backgroundColor = '#fff';
                if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                    let annotationCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + i);
                    annotationCanvas.id = this.pdfViewer.element.id + '_old_annotationCanvas_' + i;
                }
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i, 'none');
            }
        }
        this.isRerenderCanvasCreated = true;
    }

    /**
     * @private
     */
    public pageRerenderOnMouseWheel(): void {
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
            clearTimeout(this.magnifyPageRerenderTimer);
            if (!this.isPinchScrolled) {
                this.isPinchScrolled = true;
                this.rerenderOnScrollTimer = setTimeout(() => { this.rerenderOnScroll(); }, 100);
            }
        }
    }

    /**
     * @private
     */
    public renderCountIncrement(): void {
        if (this.isRerenderCanvasCreated) {
            this.pageRerenderCount++;
        }
    }

    /**
     * @private
     */
    public rerenderCountIncrement(): void {
        if (this.pageRerenderCount > 0) {
            this.pdfViewerBase.reRenderedCount++;
        }
    }

    private resizeCanvas(pageNumber: number): void {
        let lowerPageValue: number = pageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = pageNumber + 3;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + i);
            let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + i);
            if (pageDiv) {
                if ((lowerPageValue <= i) && (i <= higherPageValue)) {
                    let isSelectionAvailable: boolean = false;
                    if (this.pdfViewer.textSelectionModule) {
                        isSelectionAvailable = this.pdfViewer.textSelectionModule.isSelectionAvailableOnScroll(i);
                    }
                    if (this.pdfViewerBase.pageSize[i] != null) {
                        let width: number = this.pdfViewerBase.pageSize[i].width * this.zoomFactor;
                        let height: number = this.pdfViewerBase.pageSize[i].height * this.zoomFactor;
                        pageDiv.style.width = width + 'px';
                        pageDiv.style.height = height + 'px';
                        // tslint:disable-next-line:max-line-length
                        pageDiv.style.top = ((this.pdfViewerBase.pageSize[i].top) * this.zoomFactor) + 'px';
                        if (this.pdfViewer.enableRtl) {
                            pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        } else {
                            pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        let canvas: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                        if (canvas) {
                            canvas.style.width = width + 'px';
                            canvas.style.height = height + 'px';
                            if (this.pdfViewer.annotation) {
                                this.pdfViewer.annotationModule.resizeAnnotations(width, height, i);
                            }
                        }
                        if (textLayer) {
                            textLayer.style.width = width + 'px';
                            textLayer.style.height = height + 'px';
                            if (this.pdfViewer.textSelectionModule) {
                                if (this.isPinchZoomed) {
                                    textLayer.style.display = 'none';
                                } else if (this.isMagnified) {
                                    let lowerValue: number = ((pageNumber - 2) === 0) ? 0 : (pageNumber - 2);
                                    // tslint:disable-next-line:max-line-length
                                    let higherValue: number = ((pageNumber) === (this.pdfViewerBase.pageCount)) ? (this.pdfViewerBase.pageCount - 1) : pageNumber;
                                    if ((lowerValue <= i) && (i <= higherValue) && ((this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) || this.pdfViewerBase.textLayer.getTextSearchStatus())) {
                                        this.pdfViewerBase.textLayer.resizeTextContentsOnZoom(i);
                                        if (this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) {
                                            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
                                        }
                                    } else {
                                        textLayer.style.display = 'none';
                                    }
                                } else {
                                    textLayer.style.display = 'none';
                                }
                            }
                        }
                        let adornerSvg: HTMLElement = getDiagramElement(this.pdfViewer.element.id + '_textLayer_' + i);
                        if (adornerSvg) {
                            let adonerLayer: HTMLElement = getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdorner_svg');
                            if (adonerLayer) {
                                adonerLayer.style.width = width + 'px';
                                adonerLayer.style.height = height + 'px';
                            }
                            let diagramAdornerLayer: HTMLElement =
                                getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdornerLayer');
                            if (diagramAdornerLayer) {
                                diagramAdornerLayer.style.width = width + 'px';
                                diagramAdornerLayer.style.height = height + 'px';
                            }
                            adornerSvg.style.width = width + 'px';
                            adornerSvg.style.height = height + 'px';
                            this.pdfViewer.renderSelector(i);
                        }
                    }
                }
            }
        }
    }

    private zoomOverPages(pointX1: number, pointY1: number, pointX2: number, pointY2: number): void {
        // tslint:disable-next-line
        let currentDifference = Math.sqrt(Math.pow((pointX1 - pointX2), 2) + Math.pow((pointY1 - pointY2), 2));
        if (this.previousTouchDifference > -1) {
            if (currentDifference > this.previousTouchDifference) {
                this.pinchOut();
            } else if (currentDifference < this.previousTouchDifference) {
                this.pinchIn();
            }
        }
        this.previousTouchDifference = currentDifference;
    }

    /**
     * @private
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
    }

    /**
     * @private
     */
    public fitPageScrollMouseWheel(event: MouseWheelEvent): void {
        if (this.fitType === 'fitToPage') {
            this.isMagnified = false;
            event.preventDefault();
            if (event.wheelDelta > 0) {
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            } else {
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
        }
    }

    /**
     * @private
     */
    public magnifyBehaviorKeyDown(event: KeyboardEvent): void {
        let isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        let isCommandKey: boolean = isMac ? event.metaKey : false;
        switch (event.keyCode) {
            case 38: // up arrow
            case 37: // left arrow
            case 33: // page up
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 40: // down arrow
            case 39: // right arrow
            case 34: // page down
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 187: // equal key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomIn();
                }
                break;
            case 189: // minus key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomOut();
                }
                break;
            case 48: // zero key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.fitToPage();
                }
                break;
            case 49: // one key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.zoomTo(100);
                }
                break;
            default:
                break;
        }
    }

    private upwardScrollFitPage(currentPageIndex: number): void {
        if (currentPageIndex > 0) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex - 1].top * this.zoomFactor;
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
        }
    }

    /**
     * @private
     */
    public updatePagesForFitPage(currentPageIndex: number): void {
        if (this.fitType === 'fitToPage') {
            if (currentPageIndex > 0) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'hidden';
            }
            if (currentPageIndex < (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'hidden';
            }
        }
    }

    /**
     * @private
     */
    public onDoubleTapMagnification(): void {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.showToolbar(false);
        }
        let scrollValue: number = this.pdfViewerBase.viewerContainer.scrollTop;
        if (!this.isTapToFitZoom) {
            if (this.zoomFactor < 2) {
                this.zoomTo(200);
            } else {
                this.fitToWidth();
            }
        } else {
            this.zoomTo(this.previousZoomFactor * 100);
        }
        this.calculateScrollValues(scrollValue);
        this.isTapToFitZoom = !this.isTapToFitZoom;
    }

    private downwardScrollFitPage(currentPageIndex: number): void {
        if (currentPageIndex !== (this.pdfViewerBase.pageCount - 1)) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex + 1].top * this.zoomFactor;
            if (currentPageIndex + 1 === (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
            } else {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 2)).style.visibility = 'hidden';
            }
        }
    }

    private getMagnifiedValue(value: number): number {
        return (value / this.previousZoomFactor) * this.zoomFactor;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.imageObjects = undefined;
    }

    /**
     * returns zoom factor when the zoom percent is passed.
     */
    private getZoomFactor(zoomValue: number): number {
        return zoomValue / 100;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Magnification';
    }
}