/**
 * PdfCompositeField.ts class for EJ2-PDF
 */
import { PdfMultipleValueField } from './multiple-value-field';
import { PdfAutomaticField } from './automatic-field';
import { PdfFont } from './../../graphics/fonts/pdf-font';
import { PdfBrush } from './../../graphics/brushes/pdf-brush';
import { PdfGraphics } from './../../graphics/pdf-graphics';
/**
 * Represents class which can concatenate multiple automatic fields into single string.
 */
export class PdfCompositeField extends PdfMultipleValueField {
    // Fields
    /**
     * Stores the array of automatic fields.
     * @private
     */
    private internalAutomaticFields : PdfAutomaticField[] = null;
    /**
     * Stores the text value of the field.
     * @private
     */
    private internalText : string = '';
    // Constructor
    /**
     * Initialize a new instance of `PdfCompositeField` class.
     * @param font Font of the field.
     * @param brush Color of the field.
     * @param text Content of the field.
     * @param list List of the automatic fields in specific order based on the text content.
     */
    public constructor(font : PdfFont, brush : PdfBrush, text : string, ...list : PdfAutomaticField[]) {
        super();
        this.font = font;
        this.brush = brush;
        this.text = text;
        this.automaticFields = list;
    }
    // Properties
    /**
     * Gets and sets the content of the field.
     * @public
     */
    public get text() : string {
        return this.internalText;
    }
    public set text(value : string) {
        this.internalText = value;
    }
    /**
     * Gets and sets the list of the field to drawn.
     * @public
     */
    public get automaticFields() : PdfAutomaticField[] {
        return this.internalAutomaticFields;
    }
    public set automaticFields(value : PdfAutomaticField[]) {
        this.internalAutomaticFields = value;
    }
    // Implementation
    /**
     * Return the actual value generated from the list of automatic fields.
     * @public
     */
    public getValue(graphics : PdfGraphics) : string {
        let values : string[] = [];
        let text : string = this.text.toString();
        if (typeof this.automaticFields !== 'undefined' && this.automaticFields != null && this.automaticFields.length > 0) {
            for (let i : number = 0; i < this.automaticFields.length; i++) {
                let automaticField : PdfAutomaticField = this.automaticFields[i];
                text = text.replace('{' + i + '}', automaticField.getValue(graphics));
            }
        }
        return text;
    }
}