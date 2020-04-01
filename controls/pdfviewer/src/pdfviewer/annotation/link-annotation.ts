import { PdfViewer, PdfViewerBase } from '../index';
import { createElement } from '@syncfusion/ej2-base';
import { LineTool, PolygonDrawingTool } from '../../diagram/tools';

/**
 * The `LinkAnnotation` module is used to handle link annotation actions of PDF viewer.
 * @hidden
 */
export class LinkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @private
     */
    // tslint:disable-next-line    
    public renderHyperlinkContent(data: any, pageIndex: number): void {
        if (this.pdfViewer.enableHyperlink) {
            let hyperlinks: string[] = data.hyperlinks;
            let hyperlinksBounds: number[] = data.hyperlinkBounds;
            let linkAnnotation: number[] = data.linkAnnotation;
            let linkPage: number[] = data.linkPage;
            let annotationY: number[] = data.annotationLocation;
            if (hyperlinks && hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (linkAnnotation && linkAnnotation.length > 0 && linkPage.length > 0) {
                this.renderDocumentLink(linkAnnotation, linkPage, annotationY, pageIndex);
            }
        }
    }

    private renderWebLink(hyperlinks: string[], hyperlinksBounds: number[], pageIndex: number): void {
        let proxy: LinkAnnotation = this;
        for (let i: number = 0; i < hyperlinks.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'weblinkdiv_' + i }) as HTMLAnchorElement;
            // tslint:disable-next-line
            let rect: any = hyperlinksBounds[i];
            aTag = this.setHyperlinkProperties(aTag, rect);
            aTag.title = hyperlinks[i];
            aTag.setAttribute('href', hyperlinks[i]);
            if (this.pdfViewer.hyperlinkOpenState === 'CurrentTab') {
                aTag.target = '_self';
                aTag.onclick = () => {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        return true;
                    }
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            } else if (this.pdfViewer.hyperlinkOpenState === 'NewTab') {
                aTag.target = '_blank';
                aTag.onclick = () => {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        return true;
                    }
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            } else if (this.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                aTag.onclick = () => {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        window.open(hyperlinks[i], '_blank', 'scrollbars=yes,resizable=yes');
                        return false;
                    }
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            }
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
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
        let proxy: LinkAnnotation = this;
        for (let i: number = 0; i < linkAnnotation.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'linkdiv_' + i }) as HTMLAnchorElement;
            // tslint:disable-next-line
            let rect: any = linkAnnotation[i];
            aTag = this.setHyperlinkProperties(aTag, rect);
            aTag.setAttribute('href', 'javascript:void(0)');
            if (linkPage[i] !== undefined && linkPage[i] > 0) {
                let destPageHeight: number = (this.pdfViewerBase.pageSize[pageIndex].height);
                let destLocation: number;
                let scrollValue: number;
                if (annotationY.length !== 0) {
                    destLocation = (annotationY[i]);
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this.pdfViewerBase.pageSize[linkPage[i]].top * this.pdfViewerBase.getZoomFactor() + ((destPageHeight - destLocation) * this.pdfViewerBase.getZoomFactor());
                } else {
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this.pdfViewerBase.pageSize[linkPage[i]].top * this.pdfViewerBase.getZoomFactor();
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.onclick = () => {
                        if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                            return false;
                        } else {
                            // tslint:disable-next-line:radix
                            proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name);
                            return false;
                        }
                    };
                }
                let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                pageDiv.appendChild(aTag);
            }
        }
    }

    // tslint:disable-next-line
    private setHyperlinkProperties(aTag: HTMLAnchorElement, rect: any): HTMLAnchorElement {
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
        return aTag;
    }

    /**
     * @private
     */
    public modifyZindexForTextSelection(pageNumber: number, isAdd: boolean): void {
        if (this.pdfViewerBase.pageCount > 0) {
            let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                let pageChildNodes: NodeList = pageDiv.childNodes;
                for (let i: number = 0; i < pageChildNodes.length; i++) {
                    let childElement: HTMLElement = (pageChildNodes[i] as HTMLElement);
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
     * @private
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
     */
    public destroy(): void {
        for (let i: number = 0; i < this.pdfViewerBase.pageCount - 1; i++) {
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                let aElement: NodeListOf<HTMLAnchorElement> = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (let index: number = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'LinkAnnotation';
    }
}
