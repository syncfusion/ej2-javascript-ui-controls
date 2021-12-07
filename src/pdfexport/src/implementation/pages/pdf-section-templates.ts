/**
 * PdfSectionTemplate.ts class for EJ2-PDF
 */
import { PdfDocumentTemplate } from './../document/pdf-document-template';
/**
 * Represents a `page template` for all the pages in the section.
 */
export class PdfSectionTemplate extends PdfDocumentTemplate {
    // Fields
    /**
     * `Left` settings.
     * @private
     */
    private leftValue : boolean;
    /**
     * `Top` settings.
     * @private
     */
    private topValue : boolean;
    /**
     * `Right` settings.
     * @private
     */
    private rightValue : boolean;
    /**
     * `Bottom` settings.
     * @private
     */
    private bottomValue : boolean;
    /**
     * `Other templates settings`.
     * @private
     */
    private stampValue : boolean;

    // Properties
    /**
     * Gets or sets value indicating whether parent `Left page template should be used or not`.
     * @private
     */
    public get applyDocumentLeftTemplate() : boolean {
        return this.leftValue;
    }
    public set applyDocumentLeftTemplate(value : boolean) {
        this.leftValue = value;
    }
    /**
     * Gets or sets value indicating whether parent `Top page template should be used or not`.
     * @private
     */
    public get applyDocumentTopTemplate() : boolean {
        return this.topValue;
    }
    public set applyDocumentTopTemplate(value : boolean) {
        this.topValue = value;
    }
    /**
     * Gets or sets value indicating whether parent `Right page template should be used or not`.
     * @private
     */
    public get applyDocumentRightTemplate() : boolean {
        return this.rightValue;
    }
    public set applyDocumentRightTemplate(value : boolean) {
        this.rightValue = value;
    }
    /**
     * Gets or sets value indicating whether parent `Bottom page template should be used or not`.
     * @private
     */
    public get applyDocumentBottomTemplate() : boolean {
        return this.bottomValue;
    }
    public set applyDocumentBottomTemplate(value : boolean) {
        this.bottomValue = value;
    }
    /**
     * Gets or sets value indicating whether the `stamp value` is true or not.
     * @private
     */
    public get applyDocumentStamps() : boolean {
        return this.stampValue;
    }
    public set applyDocumentStamps(value : boolean) {
        this.stampValue = value;
    }
    // Constructors
    /**
     * `Creates a new object`.
     * @private
     */
    public constructor() {
        super();
        this.leftValue = this.topValue = this.rightValue = this.bottomValue = this.stampValue = true;
    }
}