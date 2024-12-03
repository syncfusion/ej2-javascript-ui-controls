/**
 * PdfSingleValueField.ts class for EJ2-PDF
 */
import { PdfAutomaticField } from './automatic-field';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { TemporaryDictionary } from './../../collections/object-object-pair/dictionary';
import { PdfTemplateValuePair } from './pdf-template-value-pair';
import { PdfDocumentBase } from './../pdf-document-base';
import { PdfDocument } from './../pdf-document';
import { PdfPage } from './../../pages/pdf-page';
import { PointF, SizeF} from './../../drawing/pdf-drawing';
import { PdfTemplate } from './../../graphics/figures/pdf-template';
/**
 * Represents automatic field which has the same value in the whole document.
 */
export abstract class PdfSingleValueField extends PdfAutomaticField {
    // Fields
    /* tslint:disable */
    private list : TemporaryDictionary<PdfDocumentBase, PdfTemplateValuePair> = new TemporaryDictionary<PdfDocumentBase, PdfTemplateValuePair>();
    /* tslint:enable */
    private painterGraphics : PdfGraphics[] = [];
    // Constructors
    public constructor() {
        super();
    }
    public performDraw(graphics : PdfGraphics, location : PointF, scalingX : number, scalingY : number) : void {
        super.performDrawHelper(graphics, location, scalingX, scalingY);
        let page : PdfPage = this.getPageFromGraphics(graphics);
        let document : PdfDocument = page.document;
        let textValue : string = this.getValue(graphics);
        /* tslint:disable */
        if (this.list.containsKey(document)) {
            let pair : PdfTemplateValuePair = this.list.getValue(document) as PdfTemplateValuePair;
            let drawLocation : PointF = new PointF(location.x + this.location.x, location.y + this.location.y);
            graphics.drawPdfTemplate(pair.template, drawLocation, new SizeF(pair.template.width * scalingX, pair.template.height * scalingY));
            this.painterGraphics.push(graphics);
        } else {
            let size : SizeF = this.getSize();
            let template : PdfTemplate = new PdfTemplate(size);
            this.list.setValue(document, new PdfTemplateValuePair(template, textValue));
            template.graphics.drawString(textValue, this.getFont(), this.pen, this.getBrush(), 0, 0, size.width, size.height, this.stringFormat);
            let drawLocation : PointF = new PointF(location.x + this.location.x, location.y + this.location.y);
            graphics.drawPdfTemplate(template, drawLocation, new SizeF(template.width * scalingX, template.height * scalingY));
            this.painterGraphics.push(graphics);
        }
        /* tslint:enable */
    }
}