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
    public linkAnnotation: number[];
    /**
     * @private
     */
    public linkPage: number[];
    /**
     * @private
     */
    public annotationY: number[];
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
            this.linkAnnotation = data.linkAnnotation;
            this.linkPage = data.linkPage;
            this.annotationY = data.annotationLocation;
            if (hyperlinks && hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (this.linkAnnotation && this.linkAnnotation.length > 0 && this.linkPage.length > 0) {
                this.renderDocumentLink(this.linkAnnotation, this.linkPage, this.annotationY, pageIndex);
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

    private renderWebLink(hyperlinks: string[], hyperlinksBounds: number[], pageIndex: number): void {
        // eslint-disable-next-line
        const proxy: LinkAnnotation = this;
        let isHyperlinkClicked : boolean = false;
        for (let i: number = 0; i < hyperlinks.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'weblinkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
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
                const isCancel: boolean = await proxy.pdfViewer.fireHyperlinkClick(href, aTag);
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

    private renderDocumentLink(linkAnnotation: number[], linkPage: number[], annotationY: number[], pageIndex: number): void {
        // eslint-disable-next-line
        const proxy: LinkAnnotation = this;
        for (let i: number = 0; i < linkAnnotation.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'linkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
            const rect: any = linkAnnotation[parseInt(i.toString(), 10)];
            aTag = this.setHyperlinkProperties(aTag, rect, pageIndex);
            aTag.setAttribute('href', 'javascript:void(0)');
            const linkPageNum : number = linkPage[parseInt(i.toString(), 10)];
            if (!isNullOrUndefined(linkPageNum) &&  linkPageNum >= 0) {
                const destPageHeight: number = (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height);
                let destLocation: number;
                let scrollValue: number;
                const pageSize: any = this.pdfViewerBase.pageSize[parseInt(linkPageNum.toString(), 10)];
                if (pageSize) {
                    if (!isNullOrUndefined(annotationY) && annotationY.length !== 0) {
                        destLocation = (annotationY[parseInt(i.toString(), 10)]);
                        scrollValue = pageSize.top * this.pdfViewerBase.getZoomFactor() +
                         ((destPageHeight - destLocation) * this.pdfViewerBase.getZoomFactor());
                    } else {
                        scrollValue = pageSize.top * this.pdfViewerBase.getZoomFactor();
                    }
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.setAttribute('aria-label', scrollValue.toString());
                }
                else if ((isNullOrUndefined(pageSize) && linkPageNum > this.pdfViewerBase.pageSize.length)){
                    aTag.dataset.annotationY = JSON.stringify(annotationY);
                    aTag.dataset.pageIndex = JSON.stringify(linkPageNum);
                    aTag.dataset.index = JSON.stringify(i);
                }
                aTag.onclick = () => {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {
                        if (!aTag.name) {
                            if (aTag.dataset.pageIndex) {
                                const pageSize: ISize = proxy.pdfViewerBase.pageSize[JSON.parse(aTag.dataset.pageIndex)];
                                const annotationVal: number[] = JSON.parse(aTag.dataset.annotationY);
                                const index: number = JSON.parse(aTag.dataset.index);
                                const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                                if (annotationVal && annotationVal.length > 0) {
                                    destLocation = (annotationY[parseInt(index.toString(), 10)]);
                                    scrollValue = pageSize.top * zoomFactor +
                                        ((destPageHeight - destLocation) * zoomFactor);
                                }
                                else {
                                    scrollValue = pageSize.top * zoomFactor;
                                }
                            }
                            aTag.name = scrollValue.toString();
                            aTag.setAttribute('aria-label', scrollValue.toString());
                        }
                        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name, 10);
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

    private setHyperlinkProperties(aTag: HTMLAnchorElement, rect: any, pageIndex: number): HTMLAnchorElement {
        aTag.className = 'e-pv-hyperlink';
        aTag.style.background = 'transparent';
        aTag.style.position = 'absolute';
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
        this.linkAnnotation = null;
        this.linkPage = null;
        this.annotationY = null;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'LinkAnnotation';
    }
}
