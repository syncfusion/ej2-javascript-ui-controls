import { _PdfDictionary, _PdfName } from './../pdf-primitives';
import { _PdfBaseStream, _PdfContentStream } from './../base-stream';
import { PdfGraphics } from './pdf-graphics';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { _toRectangle } from './../utils';
import { _JsonDocument } from './../import-export/json-document';
/**
 * `PdfTemplate` class represents the template of the PDF.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new rubber stamp annotation
 * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
 * // Get the normal appearance of the annotation
 * let normalAppearance: PdfTemplate = annotation.appearance.normal;
 * // Create new image object by using JPEG image data as Base64 string format
 * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
 * // Draw the image as the custom appearance for the annotation
 * normalAppearance.graphics.drawImage(image, 0, 0, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfTemplate {
    _content: any; // eslint-disable-line
    _size: number[];
    _writeTransformation: boolean;
    _isReadOnly: boolean;
    _isAnnotationTemplate: boolean;
    _needScale: boolean;
    _g: PdfGraphics;
    _crossReference: _PdfCrossReference;
    _isExported: boolean = false;
    _isResourceExport : boolean = false;
    _appearance: string;
    _pendingResources: string;
    _templateOriginalSize: number[];
    /**
     * Initializes a new instance of the `PdfTemplate` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfTemplate` class.
     *
     * @param {_PdfBaseStream} appearance - The appearance stream.
     * @param {_PdfCrossReference} crossReference - The cross reference object.
     * @private
     */
    constructor(appearance: _PdfBaseStream, crossReference: _PdfCrossReference)
    /**
     * Initializes a new instance of the `PdfTemplate` class.
     *
     * @param {number[]} bounds - The bounds.
     * @param {_PdfCrossReference} crossReference - The cross reference object.
     * @private
     */
    constructor(bounds: number[], crossReference: _PdfCrossReference)
    constructor(value?: number[] | _PdfBaseStream, crossReference?: _PdfCrossReference) {
        this._crossReference = crossReference;
        if (value instanceof _PdfBaseStream) {
            this._content = value;
            if (!this._content.dictionary.has('Type') || !this._content.dictionary.has('Subtype')) {
                this._initialize();
            }
            const bounds: number[] = this._content.dictionary.getArray('BBox');
            if (bounds && bounds.length > 3) {
                const rect: { x: number, y: number, width: number, height: number } = _toRectangle(bounds);
                this._size = [rect.width, rect.height];
                this._templateOriginalSize = this._size;
            }
            this._isReadOnly = true;
        } else {
            if (typeof value !== 'undefined') {
                this._size = [value[2], value[3]];
                this._content = new _PdfContentStream([]);
                this._content.dictionary._crossReference = this._crossReference;
                this._initialize();
                this._content.dictionary.set('BBox', [value[0], value[1], value[0] + value[2], value[1] + value[3]]);
            } else {
                this._isReadOnly = true;
            }
        }
        this._writeTransformation = true;
    }
    /**
     * Get the graphics of the PDF template. (Read only)
     *
     * @returns {PdfGraphics} The graphics object of the PDF template.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Access the graphics of the normal appearance
     * let graphics: PdfGraphics = annotation.appearance.normal.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * graphics.drawImage(image, 0, 0, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get graphics(): PdfGraphics {
        if (this._isReadOnly) {
            return null;
        }
        if (typeof this._g === 'undefined') {
            this._g = new PdfGraphics(this._size, this._content, this._crossReference, this);
            if (this._writeTransformation) {
                this._g._initializeCoordinates();
            }
            this._g._isTemplateGraphics = true;
        }
        return this._g;
    }
    /**
     * Get the size of the PDF template. (Read only)
     *
     * @returns {number[]} Template width and height as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Access the normal template of the appearance
     * let template: PdfTemplate = appearance.normal;
     * // Get the width and height of the PDF template as number array.
     * let size: number[] = template.size;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * template.graphics.drawImage(image, 0, 0, size[0], size[1]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): number[] {
        return this._size;
    }
    /**
     * Get the original size of the PDF template. (Read only)
     *
     * Remarks: The `_originalSize` property is internal and provides access to the original dimensions of the PDF template.
     *
     * @returns {number[]} Template original width and height as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Access the normal template of the appearance
     * let template: PdfTemplate = appearance.normal;
     * // Get the width and height of the PDF template as number array
     * let size: number[] = template._originalSize;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * template.graphics.drawImage(image, 0, 0, size[0], size[1]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get _originalSize(): number[] {
        return this._templateOriginalSize;
    }
    _initialize(): void {
        this._content.dictionary.set('Type', _PdfName.get('XObject'));
        this._content.dictionary.set('Subtype', _PdfName.get('Form'));
    }
    _exportStream(dictionary: _PdfDictionary, crossReference: _PdfCrossReference): void {
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._crossReference = crossReference;
        jsonDocument._isAnnotationExport = true;
        const resourceTable: Map<string, string> = new Map<string, string>();
        jsonDocument._writeObject(resourceTable, dictionary.get('N'), dictionary, 'normal');
        this._appearance = jsonDocument._convertToJson(resourceTable);
        jsonDocument._dispose();
    }
    _importStream(hasCrossReference: boolean, isResourceExport?: boolean): void {
        const jsonDocument: _JsonDocument = new _JsonDocument();
        if (hasCrossReference) {
            jsonDocument._crossReference = this._crossReference;
        }
        const json: any = JSON.parse(this._appearance); // eslint-disable-line    
        if (json) {
            const entryKey = isResourceExport ? 'resources' : 'normal'; // eslint-disable-line
            const entry = json[entryKey]; // eslint-disable-line    
            if (entry) {
                if (isResourceExport) {
                    const resourceDictionary: _PdfDictionary = jsonDocument._parseDictionary(entry['dict']);
                    if (hasCrossReference) {
                        this._content.dictionary.update('Resources', resourceDictionary);
                    }
                } else {
                    this._content = jsonDocument._parseStream(entry['stream']);
                    if (hasCrossReference) {
                        this._content.dictionary._crossReference = this._crossReference;
                        this._content.dictionary._updated = true;
                    }
                }
            }
        }
        jsonDocument._dispose();
    }
    _updatePendingResource(crossReference: _PdfCrossReference): void {
        if (this._content._pendingResources && this._content._pendingResources !== '') {
            const jsonDocument: _JsonDocument = new _JsonDocument();
            jsonDocument._crossReference = crossReference;
            jsonDocument._parseStreamElements(this._content);
            this._content._pendingResources = '';
            jsonDocument._dispose();
        }
    }
}
