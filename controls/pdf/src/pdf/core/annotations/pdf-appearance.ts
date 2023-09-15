import { _PdfCrossReference } from './../pdf-cross-reference';
import { _PdfDictionary } from './../pdf-primitives';
import { PdfTemplate } from './../graphics/pdf-template';
import { PdfAnnotation } from './annotation';
/**
 * `PdfAppearance` class represents the appearance of the annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new rubber stamp annotation
 * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
 * // Get the appearance of the annotation
 * let appearance: PdfAppearance = annotation.appearance;
 * // Create new image object by using JPEG image data as Base64 string format
 * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
 * // Draw the image as the custom appearance for the annotation
 * appearance.normal.graphics.drawImage(image, 0, 0, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAppearance {
    _annotations: PdfAnnotation;
    _bounds: number[];
    private _crossReference: _PdfCrossReference;
    private _templateNormal: PdfTemplate;
    private  _dictionary: _PdfDictionary = new _PdfDictionary();
    /**
     * Initializes a new instance of the `PdfAppearance` class.
     *
     * @param {PdfAnnotation} annot - The annotation.
     * @param {number[]} bounds - The bounds.
     * @private
     */
    constructor(annot: PdfAnnotation, bounds: number[]) {
        this._annotations = annot;
        this._crossReference = annot._crossReference;
        if (typeof bounds !== 'undefined') {
            this._bounds = bounds;
        }
        this._initialize();
    }
    /**
     * Get the normal appearance of the annotation.
     *
     * @returns {PdfTemplate} Returns the normal appearance of the annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Get the appearance of the annotation
     * let appearance: PdfAppearance = annotation.appearance;
     * // Access the normal template of the appearance
     * let template: PdfTemplate = appearance.normal;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * template.graphics.drawImage(image, 0, 0, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get normal(): PdfTemplate {
        if (!this._templateNormal && this._dictionary.has('AP')) {
            this._templateNormal = this._dictionary.get('N');
        }
        return this._templateNormal;
    }
    /**
     * Set the normal appearance of the annotation.
     *
     * @param {PdfTemplate} value The normal appearance of the annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Get the appearance of the annotation
     * let appearance: PdfAppearance = annotation.appearance;
     * // Access the normal template of the appearance
     * let template: PdfTemplate = appearance.normal;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * template.graphics.drawImage(image, 0, 0, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Add a new rubber stamp annotation to the page
     * const annotation2: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 200, 100, 50);
     * // Set the normal appearance of the annotation
     * annotation2.appearance.normal = annotation.appearance.normal;
     * // Add annotation to the page
     * page.annotations.add(annotation2);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set normal(value: PdfTemplate) {
        if (value) {
            this._templateNormal = value;
            this._dictionary.set('N', this._templateNormal);
        }
    }
    _initialize(): void {
        this.normal = new PdfTemplate(this._bounds, this._crossReference);
    }
}
