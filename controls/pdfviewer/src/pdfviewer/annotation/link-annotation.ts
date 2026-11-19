import { ISize, PdfViewer, PdfViewerBase } from '../index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LineTool, PolygonDrawingTool } from '../drawing/tools';
import { findObjectsUnderMouse } from '../drawing/action';

/**
 * The `LinkAnnotation` module is used to handle link annotation actions of PDF viewer.
 *
 * @hidden
 */
export class LinkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public linkAnnotations: number[];
    /**
     * @private
     */
    public linkPage: number[];
    /**
     * @private
     */
    public annotationY: number[];
    /**
     * @private
     */
    public annotationX: number[];
    /**
     * @private
     */
    public zoomValue: number[];
    /**
     * @param {PdfViewer} pdfViewer -It describes about the PdfViewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewerbase
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @param {any} data - It describes about the data
     * @param {number} pageIndex - It describes about the number
     * @private
     * @returns {void}
     */
    public renderHyperlinkContent(data: any, pageIndex: number): void {
        if (this.pdfViewer.enableHyperlink) {
            const hyperlinks: string[] = data.hyperlinks;
            const hyperlinksBounds: number[] = data.hyperlinkBounds;
            this.linkAnnotations = data.linkAnnotations || data.linkAnnotation;
            this.linkPage = data.linkPage;
            this.annotationY = data.annotationLocationY;
            this.annotationX = data.annotationLocationX;
            this.zoomValue = data.linkPageZoom;
            if (hyperlinks && hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (this.linkAnnotations && this.linkAnnotations.length > 0 && this.linkPage.length > 0) {
                this.renderDocumentLink(this.linkAnnotations, this.linkPage, this.annotationY, pageIndex, this.annotationX, this.zoomValue);
            }
        }
    }

    /**
     * @param {HTMLElement} eventTarget - It describes about the event target
     * @param {MouseEvent} evt - It describes about the event
     * @param {any} element - It describes about the element
     * @private
     * @returns {void}
     */
    public disableHyperlinkNavigationUnderObjects(eventTarget: HTMLElement, evt: MouseEvent | TouchEvent, element: any): void {
        const objects: any = findObjectsUnderMouse(element, element.pdfViewer, evt as MouseEvent);
        if (objects.length > 0) {
            if ((evt.target as any).classList.contains('e-pv-hyperlink')) {
                eventTarget.style.cursor = 'move';
                eventTarget.style.pointerEvents = 'none';
                eventTarget.title = '';
            }
        } else {
            const hyperlinkObjects: any = document.getElementsByClassName('e-pv-hyperlink');
            if (hyperlinkObjects && hyperlinkObjects.length > 0) {
                for (let i: number = 0; i < hyperlinkObjects.length; i++) {
                    if (hyperlinkObjects[parseInt(i.toString(), 10)].style.pointerEvents === 'none')
                    {hyperlinkObjects[parseInt(i.toString(), 10)].style.pointerEvents = 'all'; }
                    if (!hyperlinkObjects[parseInt(i.toString(), 10)].title)
                    {hyperlinkObjects[parseInt(i.toString(), 10)].title = hyperlinkObjects[parseInt(i.toString(), 10)].href; }
                }
            }
        }
    }

    /**
     * @param {string[]} hyperlinks - Array of hyperlink URLs
     * @param {number[]} hyperlinksBounds - Array of hyperlink bounds
     * @param {number} pageIndex - Page index
     * @param {string} idPrefix - idPrefix of link annotation
     * @private
     * @returns {void}
     */
    public renderWebLink(hyperlinks: string[], hyperlinksBounds: number[], pageIndex: number, idPrefix?: string): void {
        // eslint-disable-next-line
        const proxy: LinkAnnotation = this;
        let isHyperlinkClicked : boolean = false;
        const prefix: string = idPrefix ? idPrefix + '_' : '';
        for (let i: number = 0; i < hyperlinks.length; i++) {
            const linkId: string = prefix + 'weblinkdiv_' + i + '_' + pageIndex;
            // Check whether the link already exists
            const existingLink: HTMLElement | null = document.getElementById(linkId);
            if (existingLink) {
                continue;
            }
            let aTag: HTMLAnchorElement = createElement('a', { id: prefix + 'weblinkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
            const rect: any = hyperlinksBounds[parseInt(i.toString(), 10)];
            aTag = this.setHyperlinkProperties(aTag, rect, pageIndex);
            aTag.title = hyperlinks[parseInt(i.toString(), 10)];
            const href: string = hyperlinks[parseInt(i.toString(), 10)];
            if (href && href.split('http').length === 1) {
                aTag.setAttribute('href', 'http://' + href);
            } else {
                aTag.setAttribute('href', href);
            }
            aTag.onclick = async (e: any) => {
                if (isHyperlinkClicked) {
                    isHyperlinkClicked = false;
                    return true;
                }
                e.preventDefault();
                if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                    return false;
                }
                const isCancel: boolean = await proxy.pdfViewer.fireHyperlinkClick(aTag.href, aTag);
                if (isCancel && this.pdfViewer.selectedItems.annotations.length === 0 &&
                    this.pdfViewer.selectedItems.formFields.length === 0) {
                    if (this.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                        window.open(aTag.href, '_blank', 'scrollbars=yes,resizable=yes');
                    } else {
                        isHyperlinkClicked = true;
                        aTag.target = (this.pdfViewer.hyperlinkOpenState === 'CurrentTab') ? '_self' : '_blank';
                        aTag.click();
                    }
                }
                return isCancel;
            };
            aTag.onmouseover = () => {
                proxy.triggerHyperlinkEvent(aTag);
            };
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (!isNullOrUndefined(pageDiv)) {
                pageDiv.appendChild(aTag);
            }
        }
    }

    private triggerHyperlinkEvent(aTag: HTMLAnchorElement): boolean {
        if (this.pdfViewerBase.tool instanceof LineTool || this.pdfViewerBase.tool instanceof PolygonDrawingTool) {
            return false;
        } else {
            this.pdfViewer.fireHyperlinkHover(aTag);
            return true;
        }
    }


    /**
     * @param {number[]} linkAnnotation - Array of link annotations
     * @param {number[]} linkPage - Array of destination page numbers
     * @param {number[]} annotationY - Array of annotation Y coordinates
     * @param {number} pageIndex - Page index
     * @param {number[]} annotationX - Array of annotation X coordinates
     * @param {number[]} zoomValue - zoom value of link annotation
     * @param {string} idPrefix - idPrefix of link annotation
     * @private
     * @returns {void}
     */
    public renderDocumentLink(linkAnnotation: number[], linkPage: number[], annotationY: number[],
                              pageIndex: number, annotationX: number[], zoomValue: number[], idPrefix?: string): void {
        // eslint-disable-next-line
        const proxy: LinkAnnotation = this;
        const prefix: string = idPrefix ? idPrefix + '_' : '';
        for (let i: number = 0; i < linkAnnotation.length; i++) {
            const zoom: number = zoomValue && zoomValue[parseInt(i.toString(), 10)] ?
                zoomValue[parseInt(i.toString(), 10)] : this.pdfViewerBase.getZoomFactor();
            const linkId: string = prefix + 'linkdiv_' + i + '_' + pageIndex;
            // Check whether the link already exists
            const existingLink: HTMLElement | null = document.getElementById(linkId);
            if (existingLink) {
                continue;
            }
            let aTag: HTMLAnchorElement = createElement('a', { id: prefix + 'linkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
            const rect: any = linkAnnotation[parseInt(i.toString(), 10)];
            aTag = this.setHyperlinkProperties(aTag, rect, pageIndex);
            aTag.setAttribute('href', 'javascript:void(0)');
            const linkPageNum : number = linkPage[parseInt(i.toString(), 10)];
            if (!isNullOrUndefined(linkPageNum) &&  linkPageNum >= 0) {
                const pageSize: any = this.pdfViewerBase.pageSize[parseInt(linkPageNum.toString(), 10)];
                // Use destination page height (not source page) for correct coordinate conversion
                const destPageHeight: number = pageSize ? pageSize.height
                    : (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height);
                let destLocation: number;
                let destLocationX: number;
                let scrollValue: number;
                let scrollLeftValue: number = 0;
                if (pageSize) {
                    if (!isNullOrUndefined(annotationY) && annotationY.length !== 0) {
                        destLocation = (annotationY[parseInt(i.toString(), 10)]);
                        if (destLocation === 0) {
                            scrollValue = pageSize.top * zoom;
                        }
                        else {
                            scrollValue = pageSize.top * zoom +
                                ((destPageHeight - destLocation) * zoom);
                        }
                    } else {
                        scrollValue = pageSize.top * zoom;
                    }
                    if (!isNullOrUndefined(annotationX) &&
                        annotationX.length > i) {
                        destLocationX = annotationX[parseInt(i.toString(), 10)];
                        scrollLeftValue = destLocationX * zoom;
                    }
                }
                if (!isNullOrUndefined(scrollValue) && !isNaN(scrollValue)) {
                    aTag.name = scrollValue.toString();
                    aTag.dataset.scrollLeft = scrollLeftValue.toString();
                    aTag.dataset.zoomValue = zoom.toString();
                    aTag.setAttribute('aria-label', scrollValue.toString());
                }
                else if ((isNullOrUndefined(pageSize) && linkPageNum > this.pdfViewerBase.pageSize.length)){
                    aTag.dataset.annotationY = JSON.stringify(annotationY);
                    aTag.dataset.annotationX = JSON.stringify(annotationX);
                    aTag.dataset.pageIndex = JSON.stringify(linkPageNum);
                    aTag.dataset.index = JSON.stringify(i);
                    aTag.dataset.zoomValue = zoom.toString();
                }
                aTag.onclick = () => {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {
                        if (!aTag.name) {
                            if (aTag.dataset.pageIndex) {
                                const deferredPageSize: ISize = proxy.pdfViewerBase.pageSize[JSON.parse(aTag.dataset.pageIndex)];
                                const annotationVal: number[] = JSON.parse(aTag.dataset.annotationY);
                                const index: number = JSON.parse(aTag.dataset.index);
                                const zoomFactor: number = parseFloat(aTag.dataset.zoomValue) || zoom;
                                const deferredPageHeight: number = deferredPageSize ? deferredPageSize.height : destPageHeight;
                                if (annotationVal && annotationVal.length > 0) {
                                    destLocation = (annotationY[parseInt(index.toString(), 10)]);
                                    scrollValue = deferredPageSize.top * zoomFactor +
                                        ((deferredPageHeight - destLocation) * zoomFactor);
                                }
                                else {
                                    scrollValue = deferredPageSize.top * zoomFactor;
                                }
                            }
                            aTag.name = scrollValue.toString();
                            aTag.setAttribute('aria-label', scrollValue.toString());
                        }
                        // Apply the requested zoom level before navigating
                        const targetZoom: number = parseFloat(aTag.dataset.zoomValue) || zoom;
                        const currentZoom: number = proxy.pdfViewerBase.getZoomFactor();
                        if (proxy.pdfViewer.magnificationModule && targetZoom !== currentZoom) {
                            // zoomTo accepts percentage (e.g. 300 for 3x); values <= 4 are treated as factors
                            const zoomPercent: number = targetZoom > 4 ? currentZoom * 100 : targetZoom * 100;
                            proxy.pdfViewer.magnificationModule.zoomTo(zoomPercent);
                            // Recompute scroll position using the new zoom factor applied by the module
                            const appliedZoom: number = proxy.pdfViewerBase.getZoomFactor();
                            const destPS: any = proxy.pdfViewerBase.pageSize[parseInt(linkPageNum.toString(), 10)];
                            if (destPS) {
                                const recomputedY: number = !isNullOrUndefined(destLocation) && destLocation !== 0
                                    ? destPS.top * appliedZoom + ((destPS.height - destLocation) * appliedZoom)
                                    : destPS.top * appliedZoom;
                                const recomputedX: number = !isNullOrUndefined(destLocationX) ?
                                    destLocationX * appliedZoom : scrollLeftValue;
                                proxy.pdfViewerBase.viewerContainer.scrollTop = recomputedY;
                                proxy.pdfViewerBase.viewerContainer.scrollLeft = recomputedX;
                                return false;
                            }
                        }
                        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name, 10);
                        proxy.pdfViewerBase.viewerContainer.scrollLeft = parseFloat(aTag.dataset.scrollLeft || '0');
                        return false;
                    }
                };
                const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                if (!isNullOrUndefined(pageDiv)) {
                    pageDiv.appendChild(aTag);
                }
            }
        }
    }

    /**
     *
     * @param {number[]} linkBounds - Bounds {Left, Top, Width, Height} for the anchor.
     * @param {number} pageIndex - 0-based page index.
     * @param {string} [idPrefix] - Optional annotName prefix used to namespace ids.
     * @private
     * @returns {void}
     */
    public renderEmptyLink(linkBounds: number[], pageIndex: number, idPrefix?: string): void {
        const prefix: string = idPrefix ? idPrefix + '_' : '';
        const linkId: string = prefix + 'emptylinkdiv_0_' + pageIndex;
        const existingLink: HTMLElement | null = document.getElementById(linkId);
        if (existingLink) {
            return;
        }
        const aTag: HTMLAnchorElement = createElement('a', { id: linkId }) as HTMLAnchorElement;
        const rect: any = linkBounds;
        aTag.className = 'e-pv-hyperlink e-pv-hyperlink-empty';
        aTag.style.background = 'transparent';
        aTag.style.position = 'absolute';
        aTag.style.left = (rect.Left * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.top = (rect.Top * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.width = (rect.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
        const heightPx: number = (rect.Height < 0 ? -rect.Height : rect.Height) * this.pdfViewerBase.getZoomFactor();
        aTag.style.height = heightPx + 'px';
        if (rect.Height < 0) {
            aTag.style.top = ((rect.Top + rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        aTag.style.color = 'transparent';
        // Empty links do nothing on click — they are just hit-test targets.
        aTag.setAttribute('href', 'javascript:void(0)');
        aTag.onclick = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };
        this.pdfViewerBase.applyElementStyles(aTag, pageIndex);
        const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
        if (!isNullOrUndefined(pageDiv)) {
            pageDiv.appendChild(aTag);
        }
    }

    private setHyperlinkProperties(aTag: HTMLAnchorElement, rect: any, pageIndex: number): HTMLAnchorElement {
        aTag.className = 'e-pv-hyperlink';
        aTag.style.background = 'transparent';
        aTag.style.position = 'absolute';
        aTag.style.zIndex = '5';
        aTag.style.left = (rect.Left * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.top = (rect.Top * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.width = (rect.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
        if (rect.Height < 0) {
            aTag.style.height = (- rect.Height * this.pdfViewerBase.getZoomFactor()) + 'px';
            aTag.style.top = ((rect.Top + rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        } else {
            aTag.style.height = ((rect.Height < 0 ? - rect.Height : rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        aTag.style.color = 'transparent';
        this.pdfViewerBase.applyElementStyles(aTag, pageIndex);
        return aTag;
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isAdd - It describes about the isAdd
     * @private
     * @returns {void}
     */
    public modifyZindexForTextSelection(pageNumber: number, isAdd: boolean): void {
        if (this.pdfViewerBase.pageCount > 0) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                const pageChildNodes: NodeList = pageDiv.childNodes;
                for (let i: number = 0; i < pageChildNodes.length; i++) {
                    const childElement: HTMLElement = (pageChildNodes[parseInt(i.toString(), 10)] as HTMLElement);
                    if (childElement.tagName === 'A') {
                        if (isAdd) {
                            childElement.classList.add('e-pv-onselection');
                        } else {
                            childElement.classList.remove('e-pv-onselection');
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {HTMLElement} element - It describes about the element
     * @param {boolean} isAdd - It describes about the isAdd
     * @private
     * @returns {void}
     */
    public modifyZindexForHyperlink(element: HTMLElement, isAdd: boolean): void {
        if (isAdd) {
            element.classList.add('e-pv-onselection');
        } else {
            element.classList.remove('e-pv-onselection');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        for (let i: number = 0; i < this.pdfViewerBase.pageCount - 1; i++) {
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                const aElement: any = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (let index: number = aElement.length - 1; index >= 0; index--) {
                        aElement[parseInt(index.toString(), 10)].parentNode.removeChild(aElement[parseInt(index.toString(), 10)]);
                    }
                }
            }
        }
        this.linkAnnotations = null;
        this.linkPage = null;
        this.annotationY = null;
        this.annotationX = null;
        this.zoomValue = null;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'LinkAnnotation';
    }
}
