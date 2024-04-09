import { createElement} from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';

/**
 * The 'AccessibilityTags' module helps to access the tagged layers in a PDF document for the users with disabilities.
 */
export class AccessibilityTags {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;

    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    private addTaggedLayer(pageIndex: number): HTMLElement {
        let taggedLayer: HTMLElement;
        if (this.pdfViewer.enableAccessibilityTags && this.pdfViewerBase.isTaggedPdf) {
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            taggedLayer = document.getElementById(this.pdfViewer.element.id + '_taggedLayer_' + pageIndex);
            let textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            if(textLayer){
                textLayer.setAttribute('aria-hidden', 'true');
            }
            if (!taggedLayer) {
                taggedLayer = createElement('div', { id: this.pdfViewer.element.id + '_taggedLayer_' + pageIndex, className: 'e-pv-tagged-layer e-pv-text-layer' });
            }
            taggedLayer.innerHTML = "";
            taggedLayer.style.width = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width * this.pdfViewerBase.getZoomFactor() + 'px';
            taggedLayer.style.height = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height * this.pdfViewerBase.getZoomFactor() + 'px';
            taggedLayer.style.pointerEvents = "none";
            if (pageDiv) {
                pageDiv.appendChild(taggedLayer);
            }
        }
        return taggedLayer;
    }

    /**
     * @param pageIndex
     * @private
     */
    public renderAccessibilityTags(pageIndex: number, taggedTextResponse: any): void {
        let taggedLayer: HTMLElement = this.addTaggedLayer(pageIndex);
        for (let i = 0; i < taggedTextResponse.length; i++) {
            var textDiv: HTMLElement = createElement('div', { id: (this.pdfViewer as any).element.id + '_taggedText_' + pageIndex + '_' + parseInt(i.toString(), 10), className: 'e-pv-text', attrs: { 'tabindex': '-1' } });
            let bounds = taggedTextResponse[parseInt(i.toString(), 10)].Bounds;
            if (taggedTextResponse[parseInt(parseInt(i.toString(), 10).toString(), 10)].TagType === "Paragraph" && taggedTextResponse[parseInt(i.toString(), 10)].ChildElements === null && taggedTextResponse[parseInt(i.toString(), 10)].Text.trim() === "") {
                continue;
            }
            else {
                textDiv.appendChild(this.createTag(taggedTextResponse[parseInt(i.toString(), 10)]));
            }
            textDiv.style.display = "inline";
             // eslint-disable-next-line max-len
            this.setStyleToTaggedTextDiv(textDiv, bounds, taggedTextResponse[parseInt(i.toString(), 10)].FontSize, taggedTextResponse[parseInt(i.toString(), 10)].FontName, taggedTextResponse[parseInt(i.toString(), 10)].FontStyle);
            this.setTextElementProperties(textDiv);
            taggedLayer.appendChild(textDiv);
        }
    }

    private createTag = function (taggedTextResponse: any): any {
        let tagType: string = taggedTextResponse.TagType;
        let parentTagType: string = taggedTextResponse.ParentTagType
        let text: string = taggedTextResponse.Text;
        let altText: string = taggedTextResponse.AltText;
        let bounds: any = taggedTextResponse.Bounds;
        let childTags: any = taggedTextResponse.ChildElements;
        let textTag: any = document.createElement(this.getTag(tagType));
        textTag.style = "padding:0px;margin:0px";
        if (parentTagType != "Document" && parentTagType != "Part") {
            textTag.style.position = 'absolute';
        }
        if (bounds) {
            this.setStyleToTaggedTextDiv(textTag, bounds, taggedTextResponse.FontSize, taggedTextResponse.FontName, taggedTextResponse.FontStyle);
            this.setTextElementProperties(textTag);
        }
        if (text.trim() != "") {
            textTag.innerText = text;
        }
        if (tagType === "Image" || tagType === "Figure") {
            if(altText && altText.trim() !== ""){
                textTag.alt = altText;
            }
            textTag.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
        }
        if (childTags && childTags.length > 0) {
            childTags.forEach((element: any) => {
                if (tagType === "Table") {
                    if(element.ChildElements){
                        element.ChildElements.forEach((newelement: any) => {
                            textTag.appendChild(this.createTag(newelement))
                        });
                    }
                }
                else {
                    textTag.appendChild(this.createTag(element));
                }
            });
        }
        return textTag;
    }

    private getTag(tagType: string): string {
        switch (tagType) {
            case "Paragraph":
                return "p";
            case "Figure":
                return "img";
            case "Article":
                return "art";
            case "Annotation":
                return "annot";
            case "BibliographyEntry":
                return "bibentry";
            case "BlockQuotation":
                return "blockQuote";
            case "Caption":
                return "caption";
            case "Code":
                return "code";
            case "Division":
                return "div";
            case "Document":
                return "document";
            case "Form":
                return "form";
            case "Formula":
                return "formula";
            case "Index":
                return "index";
            case "Heading":
                return "h";
            case "HeadingLevel1":
                return "h1";
            case "HeadingLevel2":
                return "h2";
            case "HeadingLevel3":
                return "h3";
            case "HeadingLevel4":
                return "h4";
            case "HeadingLevel5":
                return "h5";
            case "HeadingLevel6":
                return "h6";
            case "Label":
                return "label";
            case "Link":
                return "a";
            case "List":
                return "ul";
            case "ListItem":
                return "li";
            case "ListBody":
                return "p";
            case "Note":
                return "note";
            case "Part":
                return "part";
            case "Quotation":
                return "quote";
            case "Reference":
                return "reference";
            case "Section":
                return "sect";
            case "Span":
                return "span";
            case "Table":
                return "table";
            case "TableDataCell":
                return "td";
            case "TableHeader":
                return "th";
            case "TableOfContent":
                return "toc";
            case "TableOfContentItem":
                return "toci";
            case "TableRow":
                return "tr";
            case "Image":
                return "img";
            default:
                return "p";
        }
    }

    private setStyleToTaggedTextDiv(textDiv: any, bounds: any, fontSize :number, fontName:string, fontStyle:string): void {
        let zoomFactor : number = this.pdfViewerBase.getZoomFactor();
        textDiv.style.left = this.pdfViewerBase.ConvertPointToPixel(bounds.X) * zoomFactor + 'px';
        textDiv.style.top = this.pdfViewerBase.ConvertPointToPixel(bounds.Y) * zoomFactor + 'px';
        textDiv.style.width = this.pdfViewerBase.ConvertPointToPixel(bounds.Width) * zoomFactor + 'px';
        var textHeight = this.pdfViewerBase.ConvertPointToPixel(bounds.Height) * zoomFactor;
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = this.pdfViewerBase.ConvertPointToPixel(fontSize) * zoomFactor + 'px';
        if(fontName && (fontName === "Wingdings" || fontName === "Symbol")){
            textDiv.style.fontFamily = "Verdana";
        }
        else if(fontName){
            textDiv.style.fontFamily = fontName;
        }
        if(fontStyle){
            textDiv.style.fontWeight = fontStyle;
        }
        textDiv.style.color = 'transparent';
    }

    private setTextElementProperties(textDiv: HTMLElement): void {
        textDiv.style.transformOrigin = '0%';
    }
    /**
     * @private
    */
   public getModuleName(): string {
       return 'AccessibilityTags';
    }
    /**
     * @private
     */
    public destroy(): boolean {
        return true;
    }
}