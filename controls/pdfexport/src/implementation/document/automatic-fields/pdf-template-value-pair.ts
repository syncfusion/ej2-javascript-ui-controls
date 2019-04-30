/**
 * PdfTemplateValuePair.ts class for EJ2-PDF
 * @private
 */
import { PdfTemplate } from './../../graphics/figures/pdf-template';
/**
 * Represent class to store information about `template and value pairs`.
 * @private
 */
export class PdfTemplateValuePair {
    // Fields
    /**
     * Internal variable to store template.
     * @default null
     * @private
     */
    private pdfTemplate : PdfTemplate = null;
    /**
     * Intenal variable to store value.
     * @private
     */
    private content : string = '';

    // Constructors
    /**
     * Initializes a new instance of the 'PdfTemplateValuePair' class.
     * @private
     */
    public constructor()
    public constructor(template : PdfTemplate, value : string)
    public constructor(template ?: PdfTemplate, value ?: string) {
        if (typeof template === 'undefined') {
            //
        } else {
            this.template = template;
            this.value = value;
        }
    }
    // Properties
    /**
     * Gets or sets the template.
     * @private
     */
    public get template() : PdfTemplate {
        return this.pdfTemplate;
    }
    public set template(value : PdfTemplate) {
        this.pdfTemplate = value;
    }
    /**
     * Gets or sets the value.
     * @private
     */
    public get value() : string {
        return this.content;
    }
    public set value(value : string) {
        this.content = value;
    }
}