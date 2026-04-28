/**
 * PdfAutomaticField.ts class for EJ2-PDF
 */
import { PdfAutomaticField } from  './automatic-field';
import { TemporaryDictionary } from './../../collections/object-object-pair/dictionary';
import { PdfTemplateValuePair } from './pdf-template-value-pair';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { SizeF, PointF } from './../../drawing/pdf-drawing';
import { PdfTemplate } from './../../graphics/figures/pdf-template';
/**
 * Represents automatic field which has the same value within the `PdfGraphics`.
 */
export abstract class PdfMultipleValueField extends PdfAutomaticField {
    //  Fields
    /**
     * Stores the instance of dictionary values of `graphics and template value pair`.
     * @private
     */
    private list : TemporaryDictionary<PdfGraphics, PdfTemplateValuePair> = new TemporaryDictionary<PdfGraphics, PdfTemplateValuePair>();
    public constructor() {
        super();
    }
    // Implementation
    /* tslint:disable */
    public performDraw(graphics : PdfGraphics, location : PointF, scalingX : number, scalingY : number) : void {
        super.performDrawHelper(graphics, location, scalingX, scalingY);
        let value : string = this.getValue(graphics);
        let template : PdfTemplate = new PdfTemplate(this.getSize());
        this.list.setValue(graphics, new PdfTemplateValuePair(template, value));
        let g : PdfGraphics = template.graphics;
        let size : SizeF = this.getSize();
        template.graphics.drawString(value, this.getFont(), this.pen, this.getBrush(), 0, 0, size.width, size.height, this.stringFormat);
        let drawLocation : PointF = new PointF(location.x + this.location.x, location.y + this.location.y);
        graphics.drawPdfTemplate(template, drawLocation, new SizeF(template.width * scalingX, template.height * scalingY));
    }
    /* tslint:enable */
}