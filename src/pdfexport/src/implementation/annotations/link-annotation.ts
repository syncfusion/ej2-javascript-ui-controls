import { PdfAnnotation } from './annotation';
import { RectangleF } from './../drawing/pdf-drawing';
import { PdfName } from './../primitives/pdf-name';
/**
 * `PdfLinkAnnotation` class represents the ink annotation class.
 * @private
 */
export abstract class PdfLinkAnnotation extends PdfAnnotation {
    // Constructors
    /**
     * Initializes new instance of `PdfLineAnnotation` class with specified points.
     * @private
     */
    public constructor()
    /**
     * Initializes new instance of `PdfLineAnnotation` class with set of points and annotation text.
     * @private
     */
    public constructor(rectangle : RectangleF)
    public constructor(rectangle ?: RectangleF) {
        super(rectangle);
    }
    // Implementation
    /**
     * `Initializes` annotation object.
     * @private
     */
    protected initialize() : void {
        super.initialize();
        this.dictionary.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.link));
    }
}