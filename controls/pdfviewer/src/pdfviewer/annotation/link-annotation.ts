/* eslint-disable */
import { PdfViewer, PdfViewerBase } from '../index';
import { createElement } from '@syncfusion/ej2-base';
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
     * @param pdfViewer
     * @param viewerBase
     * @param pdfViewer
     * @param viewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @param data
     * @param pageIndex
     * @param data
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
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
     * @private
     */
    public disableHyperlinkNavigationUnderObjects(eventTarget: HTMLElement, evt: MouseEvent | TouchEvent, element: any): void {
        let objects: any = findObjectsUnderMouse(element, element.pdfViewer, evt as MouseEvent);
        if (objects.length > 0) {
            if((evt.target as any).classList.contains('e-pv-hyperlink')) {
                eventTarget.style.cursor = 'move';
                eventTarget.style.pointerEvents = 'none';
                eventTarget.title = '';
            }
       } else {
           let hyperlinkObjects: any = document.getElementsByClassName('e-pv-hyperlink');
           if (hyperlinkObjects && hyperlinkObjects.length > 0) {
               for (let i: number = 0; i < hyperlinkObjects.length; i++) {
                   if (hyperlinkObjects[i].style.pointerEvents === 'none')
                        hyperlinkObjects[i].style.pointerEvents = 'all'; 
                   if (!hyperlinkObjects[i].title)
                        hyperlinkObjects[i].title = hyperlinkObjects[i].href;
               }
           }
       }
    }

    private renderWebLink(hyperlinks: string[], hyperlinksBounds: number[], pageIndex: number): void {
        const proxy: LinkAnnotation = this;
        let isHyperlinkClicked :boolean = false;
        for (let i: number = 0; i < hyperlinks.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'weblinkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
            // eslint-disable-next-line
            let rect: any = hyperlinksBounds[i];
            aTag = this.setHyperlinkProperties(aTag, rect, pageIndex);
            aTag.title = hyperlinks[i];
            if (hyperlinks[i] && hyperlinks[i].split('http').length === 1) {
                let hyperlinkText = "http://" + hyperlinks[i];
                aTag.setAttribute('href', hyperlinkText);
            } else {
                aTag.setAttribute('href', hyperlinks[i]);
            }
            if (this.pdfViewer.hyperlinkOpenState === 'CurrentTab') {
                aTag.target = '_self';
                aTag.onclick = async (e:any) => {  
                    if( !isHyperlinkClicked)   {
                        e.preventDefault();

                        if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                            return false;
                        } else {                        
                            let isCancel =  await proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                            if(isCancel){
                                isHyperlinkClicked=true;
                                aTag.click();
                            }
                            return isCancel;
                        }
                    }else{
                        isHyperlinkClicked= false;
                        return true;
                    }      
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            } else if (this.pdfViewer.hyperlinkOpenState === 'NewTab') {
                aTag.target = '_blank';
                aTag.onclick = async (e:any) => {  
                    if( !isHyperlinkClicked)   {
                        e.preventDefault();

                        if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                            return false;
                        } else {                        
                            let isCancel =  await proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                            if(isCancel){
                                isHyperlinkClicked=true;
                                aTag.click();
                            }
                            return isCancel;
                        }
                    }else{
                        isHyperlinkClicked= false;
                        return true;
                    }      
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            } else if (this.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                aTag.onclick = async (e:any) => { 
                    e.preventDefault();
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    } else {                        
                        let isCancel =  await proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        if(isCancel){
                            window.open(aTag.href, '_blank', 'scrollbars=yes,resizable=yes');
                        }
                        return false;
                    } 
                };
                aTag.onmouseover = () => {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            }
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
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
        const proxy: LinkAnnotation = this;
        for (let i: number = 0; i < linkAnnotation.length; i++) {
            let aTag: HTMLAnchorElement = createElement('a', { id: 'linkdiv_' + i + '_' + pageIndex }) as HTMLAnchorElement;
            // eslint-disable-next-line
            let rect: any = linkAnnotation[i];
            aTag = this.setHyperlinkProperties(aTag, rect, pageIndex);
            aTag.setAttribute('href', 'javascript:void(0)');
            if (linkPage[i] !== undefined && linkPage[i] >= 0) {
                const destPageHeight: number = (this.pdfViewerBase.pageSize[pageIndex].height);
                let destLocation: number;
                let scrollValue: number;
                let pageSize: any = this.pdfViewerBase.pageSize[linkPage[i]];
                if (pageSize) {
                    if (annotationY.length !== 0) {
                        destLocation = (annotationY[i]);
                        // eslint-disable-next-line max-len
                        scrollValue = pageSize.top * this.pdfViewerBase.getZoomFactor() + ((destPageHeight - destLocation) * this.pdfViewerBase.getZoomFactor());
                    } else {
                        // eslint-disable-next-line max-len
                        scrollValue = pageSize.top * this.pdfViewerBase.getZoomFactor();
                    }
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.setAttribute('aria-label', scrollValue.toString())
                    aTag.onclick = () => {
                        if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                            return false;
                        } else {
                            // eslint-disable-next-line radix
                            proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name);
                            return false;
                        }
                    };
                }
                const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                pageDiv.appendChild(aTag);
            }
        }
    }

    // eslint-disable-next-line
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
     * @param pageNumber
     * @param isAdd
     * @param pageNumber
     * @param isAdd
     * @private
     */
    public modifyZindexForTextSelection(pageNumber: number, isAdd: boolean): void {
        if (this.pdfViewerBase.pageCount > 0) {
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                const pageChildNodes: NodeList = pageDiv.childNodes;
                for (let i: number = 0; i < pageChildNodes.length; i++) {
                    const childElement: HTMLElement = (pageChildNodes[i] as HTMLElement);
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
     * @param element
     * @param isAdd
     * @param element
     * @param isAdd
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
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                // eslint-disable-next-line max-len
                const aElement: any = pageDiv.getElementsByTagName('a');
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
