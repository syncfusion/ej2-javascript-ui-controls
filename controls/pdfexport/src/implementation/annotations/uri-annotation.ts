/**
 * PdfUriAnnotation.ts class for EJ2-PDF
 */
import { PdfAction } from './../actions/action';
import { RectangleF } from './../drawing/pdf-drawing';
import { PdfActionLinkAnnotation } from './action-link-annotation';
import { PdfName } from './../primitives/pdf-name';
import { PdfUriAction } from './../actions/uri-action';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
/**
 * `PdfUriAnnotation` class represents the Uri annotation.
 * @private
 */
export class PdfUriAnnotation extends PdfActionLinkAnnotation {
    // Fields
    /**
     * Internal variable to store `acton` for the annotation.
     * @private
     */
    private pdfUriAction : PdfUriAction;
    /**
     * Get `action` of the annotation.
     * @private
     */
    public get uriAction() : PdfUriAction {
        if (typeof this.pdfUriAction === 'undefined') {
            this.pdfUriAction = new PdfUriAction();
        }
        return this.pdfUriAction;
    }

    // Properties
    /**
     * Gets or sets the `Uri` address.
     * @private
     */
    public get uri() : string {
        return this.uriAction.uri;
    }
    public set uri(value : string) {
        if (this.uriAction.uri !== value) {
            this.uriAction.uri = value;
        }
    }
    /**
     * Gets or sets the `action`.
     * @private
     */
    public get action() : PdfAction {
        return this.getSetAction() as PdfAction;
    }
    public set action(value : PdfAction) {
        this.getSetAction(value);
        this.uriAction.next = value;
    }

    // Constructors
    /**
     * Initializes a new instance of the `PdfUriAnnotation` class with specified bounds.
     * @private
     */
    public constructor(rectangle : RectangleF)
    /**
     * Initializes a new instance of the `PdfUriAnnotation` class with specified bounds and URI.
     * @private
     */
    public constructor(rectangle : RectangleF, uri : string)
    public constructor(rectangle : RectangleF, uri ?: string) {
        super(rectangle);
        if (typeof uri !== 'undefined') {
            this.uri = uri;
        }
    }

    // Implementation
    /**
     * `Initializes` annotation object.
     * @private
     */
    protected initialize() : void {
        super.initialize();
        this.dictionary.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.link));
        let tempPrimitive : IPdfPrimitive = this.uriAction.element;
        this.dictionary.items.setValue(this.dictionaryProperties.a, this.uriAction.element);
    }
}