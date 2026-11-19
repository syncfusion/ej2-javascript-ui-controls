import { createElement} from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase, SizeBase } from '../index';

/**
 * The 'AccessibilityTags' module helps to access the tagged layers in a PDF document for the users with disabilities.
 *
 * @param {TaggedElements[]} taggedTextResponse - taggedTextResponse
 * @returns {AccessibilityTags} - AccessibilityTags
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
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            taggedLayer = document.getElementById(this.pdfViewer.element.id + '_taggedLayer_' + pageIndex);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            if (textLayer){
                textLayer.setAttribute('aria-hidden', 'true');
            }
            if (!taggedLayer) {
                taggedLayer = createElement('div', { id: this.pdfViewer.element.id + '_taggedLayer_' + pageIndex, className: 'e-pv-tagged-layer e-pv-text-layer' });
            }
            taggedLayer.innerHTML = '';
            taggedLayer.style.width = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width * this.pdfViewerBase.getZoomFactor() + 'px';
            taggedLayer.style.height = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height * this.pdfViewerBase.getZoomFactor() + 'px';
            taggedLayer.style.pointerEvents = 'none';
            if (pageDiv) {
                pageDiv.appendChild(taggedLayer);
            }
        }
        return taggedLayer;
    }

    /**
     * @param {number} pageIndex - It describes about the page index value
     * @param {TaggedElements[]} taggedTextResponse - It describes about the tagged text response
     * @private
     * @returns {void}
     */
    public renderAccessibilityTags(pageIndex: number, taggedTextResponse: TaggedElements[]): void {
        const taggedLayer: HTMLElement = this.addTaggedLayer(pageIndex);
        for (let i: number = 0; i < taggedTextResponse.length; i++) {
            const textDiv: HTMLElement = createElement('div', { id: (this.pdfViewer as any).element.id + '_taggedText_' + pageIndex + '_' + parseInt(i.toString(), 10), className: 'e-pv-text', attrs: { 'tabindex': '-1' } });
            const bounds: RectBounds = taggedTextResponse[parseInt(i.toString(), 10)].Bounds;
            if (taggedTextResponse[parseInt(parseInt(i.toString(), 10).toString(), 10)].TagType === 'Paragraph' && taggedTextResponse[parseInt(i.toString(), 10)].ChildElements === null && taggedTextResponse[parseInt(i.toString(), 10)].Text.trim() === '') {
                continue;
            }
            else {
                textDiv.appendChild(this.createTag(taggedTextResponse[parseInt(i.toString(), 10)]));
            }
            textDiv.style.display = 'inline';
            this.setStyleToTaggedTextDiv(textDiv, bounds, taggedTextResponse[parseInt(i.toString(), 10)].FontSize,
                                         taggedTextResponse[parseInt(i.toString(), 10)].FontName,
                                         taggedTextResponse[parseInt(i.toString(), 10)].FontStyle);
            this.setTextElementProperties(textDiv);
            taggedLayer.appendChild(textDiv);
        }
    }

    private createTag: (taggedTextResponse: TaggedElements) => HTMLElement  = function(taggedTextResponse: TaggedElements): HTMLElement {
        const tagType: string = taggedTextResponse.TagType;
        const parentTagType: string = taggedTextResponse.ParentTagType;
        const text: string = taggedTextResponse.Text;
        const altText: string = taggedTextResponse.AltText;
        const bounds: RectBounds = taggedTextResponse.Bounds;
        const childTags: TaggedElements[] = taggedTextResponse.ChildElements;
        const textTag: HTMLElement = document.createElement(this.getTag(tagType));
        textTag.style.padding = '0px';
        textTag.style.margin = '0px';
        if (parentTagType !== 'Document' && parentTagType !== 'Part') {
            textTag.style.position = 'absolute';
        }
        if (bounds) {
            this.setStyleToTaggedTextDiv(textTag, bounds, taggedTextResponse.FontSize, taggedTextResponse.FontName,
                                         taggedTextResponse.FontStyle);
            this.setTextElementProperties(textTag);
        }
        if (text.trim() !== '') {
            textTag.innerText = text;
        }
        if (tagType === 'Image' || tagType === 'Figure') {
            if (altText && altText.trim() !== ''){
                (textTag as HTMLImageElement).alt = altText;
            }
            (textTag as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
        }
        if (childTags && childTags.length > 0) {
            childTags.forEach((element: TaggedElements) => {
                if (tagType === 'Table') {
                    if (element.ChildElements){
                        element.ChildElements.forEach((newelement: TaggedElements) => {
                            textTag.appendChild(this.createTag(newelement));
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
        case 'Paragraph':
            return 'p';
        case 'Figure':
            return 'img';
        case 'Article':
            return 'art';
        case 'Annotation':
            return 'annot';
        case 'BibliographyEntry':
            return 'bibentry';
        case 'BlockQuotation':
            return 'blockQuote';
        case 'Caption':
            return 'caption';
        case 'Code':
            return 'code';
        case 'Division':
            return 'div';
        case 'Document':
            return 'document';
        case 'Form':
            return 'form';
        case 'Formula':
            return 'formula';
        case 'Index':
            return 'index';
        case 'Heading':
            return 'h';
        case 'HeadingLevel1':
            return 'h1';
        case 'HeadingLevel2':
            return 'h2';
        case 'HeadingLevel3':
            return 'h3';
        case 'HeadingLevel4':
            return 'h4';
        case 'HeadingLevel5':
            return 'h5';
        case 'HeadingLevel6':
            return 'h6';
        case 'Label':
            return 'label';
        case 'Link':
            return 'a';
        case 'List':
            return 'ul';
        case 'ListItem':
            return 'li';
        case 'ListBody':
            return 'p';
        case 'Note':
            return 'note';
        case 'Part':
            return 'part';
        case 'Quotation':
            return 'quote';
        case 'Reference':
            return 'reference';
        case 'Section':
            return 'sect';
        case 'Span':
            return 'span';
        case 'Table':
            return 'table';
        case 'TableDataCell':
            return 'td';
        case 'TableHeader':
            return 'th';
        case 'TableOfContent':
            return 'toc';
        case 'TableOfContentItem':
            return 'toci';
        case 'TableRow':
            return 'tr';
        case 'Image':
            return 'img';
        default:
            return 'p';
        }
    }

    private setStyleToTaggedTextDiv(textDiv: HTMLElement, bounds: RectBounds, fontSize : number,
                                    fontName: string, fontStyle: string): void {
        const zoomFactor : number = this.pdfViewerBase.getZoomFactor();
        textDiv.style.left = this.pdfViewerBase.ConvertPointToPixel(bounds.X) * zoomFactor + 'px';
        textDiv.style.top = this.pdfViewerBase.ConvertPointToPixel(bounds.Y) * zoomFactor + 'px';
        textDiv.style.width = this.pdfViewerBase.ConvertPointToPixel(bounds.Width) * zoomFactor + 'px';
        const textHeight: number = this.pdfViewerBase.ConvertPointToPixel(bounds.Height) * zoomFactor;
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = this.pdfViewerBase.ConvertPointToPixel(fontSize) * zoomFactor + 'px';
        if (fontName && (fontName === 'Wingdings' || fontName === 'Symbol')){
            textDiv.style.fontFamily = 'Verdana';
        }
        else if (fontName){
            textDiv.style.fontFamily = fontName;
        }
        if (fontStyle){
            textDiv.style.fontWeight = fontStyle;
        }
        textDiv.style.color = 'transparent';
    }

    private setTextElementProperties(textDiv: HTMLElement): void {
        textDiv.style.transformOrigin = '0%';
    }
    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'AccessibilityTags';
    }
    /**
     * @private
     * @returns {string} - string
     */
    public destroy(): boolean {
        return true;
    }
}

/**
 *
 * @hidden
 * @private
 */
class TaggedElements {
    public Order: number;
    public TagType: string;
    public ParentTagType: string;
    public Text: string;
    public AltText: string;
    public FontSize: number;
    public FontName: string;
    public FontStyle: string;
    public PageNumber: number;
    public ChildElements: TaggedElements[];
    public Bounds: RectBounds;
}

/**
 *
 * @hidden
 * @private
 */
export class RectBounds {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
    public Location: {
        X: number;
        Y: number;
    };
    public Size: SizeBase;
    public Left: number;
    public Top: number;
    public Right: number;
    public Bottom: number;
    constructor(_X: number, _Y: number, _Width: number, _Height: number) {
        this.X = _X;
        this.Y = _Y;
        this.Width = _Width;
        this.Height = _Height;
        this.Location = {
            X: _X,
            Y: _Y
        };
        this.Size = {
            IsEmpty: false,
            Width: _Width,
            Height: _Height
        };
        this.Left = _X;
        this.Top = _Y;
        this.Right = _X + _Width;
        this.Bottom = _Y + _Height;
    }
}
