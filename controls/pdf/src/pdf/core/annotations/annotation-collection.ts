import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfPage } from './../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _checkReview, _isNullOrUndefined } from './../utils';
import { PdfAnnotation, PdfLineAnnotation, PdfCircleAnnotation, PdfEllipseAnnotation, PdfAngleMeasurementAnnotation, PdfRectangleAnnotation, PdfSquareAnnotation, PdfPolyLineAnnotation, PdfPolygonAnnotation, PdfInkAnnotation, PdfPopupAnnotation, PdfAttachmentAnnotation, Pdf3DAnnotation, PdfFileLinkAnnotation, PdfWatermarkAnnotation, PdfRubberStampAnnotation, PdfSoundAnnotation, PdfFreeTextAnnotation, PdfRedactionAnnotation, PdfRichMediaAnnotation, PdfTextMarkupAnnotation, PdfDocumentLinkAnnotation, PdfTextWebLinkAnnotation, PdfUriAnnotation, PdfComment } from './annotation';
import { PdfAnnotationFlag } from './../enumerator';
/**
 * The class provides methods and properties to handle the collection of `PdfAnnotation`.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access annotation coolection from first page
 * let annotations: PdfAnnotationCollection = document.getPage(0).annotations;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationCollection {
    _annotations: Array<_PdfReference>;
    _comments: Array<PdfPopupAnnotation>;
    _parsedAnnotations: Map<number, PdfAnnotation>;
    _isExport: boolean = false;
    private _page: PdfPage;
    private _crossReference: _PdfCrossReference;
    /**
     * Represents a annotation collection.
     *
     * @private
     * @param {Array<_PdfReference>} array Annotation references.
     * @param {_PdfCrossReference} xref Cross reference object.
     * @param {PdfPage} page PDF page object.
     */
    constructor(array: Array<_PdfReference>, xref: _PdfCrossReference, page: PdfPage) {
        if (_isNullOrUndefined(array)) {
            this._annotations = array;
        } else {
            this._annotations = [];
        }
        this._page = page;
        this._crossReference = xref;
        this._parsedAnnotations = new Map<number, PdfAnnotation>();
        this._comments = [];
    }
    /**
     * Gets the annotation count (Read only).
     *
     * @returns {number} Number of annotations.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the annotation count
     * let count: number = page.annotations.count;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        return this._annotations.length;
    }
    /**
     * Gets the `PdfAnnotation` at the specified index.
     *
     * @param {number} index Field index.
     * @returns {PdfAnnotation} Annotation at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Access the annotation at index 0
     * let annotation: PdfAnnotation = page.annotations.at(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    at(index: number): PdfAnnotation {
        if (index < 0 || index >= this._annotations.length) {
            throw Error('Index out of range.');
        }
        if (!this._parsedAnnotations.has(index)) {
            let dictionary: _PdfReference | _PdfDictionary = this._annotations[<number>index];
            if (dictionary && dictionary instanceof _PdfReference) {
                dictionary = this._crossReference._fetch(dictionary);
            }
            if (dictionary && dictionary instanceof _PdfDictionary) {
                const annotation: PdfAnnotation = this._parseAnnotation(dictionary, index);
                if (annotation) {
                    annotation._ref = this._annotations[<number>index];
                    this._parsedAnnotations.set(index, annotation);
                }
            }
        }
        return this._parsedAnnotations.get(index);
    }
    /**
     * Add a new `PdfAnnotation` into the collection.
     *
     * @param {PdfAnnotation} annotation Annotation to add.
     * @returns {number} Annotation index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Add a new annotation into the collection
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(annotation: PdfAnnotation): number {
        if (typeof annotation === 'undefined' || annotation === null) {
            throw Error('annotation cannot be null or undefined');
        }
        if (annotation instanceof PdfPopupAnnotation && (annotation._isReview || annotation._isComment)) {
            if (annotation.bounds) {
                annotation.bounds.y = -annotation.bounds.y;
                annotation.bounds.height = -annotation.bounds.height;
            }
        }
        if (annotation._isLoaded) {
            throw Error('cannot add an existing annotation');
        }
        annotation._initialize(this._page);
        let reference: _PdfReference;
        if (typeof annotation._ref !== 'undefined' && annotation._ref._isNew) {
            reference = annotation._ref;
        } else {
            reference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, annotation._dictionary);
            annotation._ref = reference;
        }
        const index: number = this._annotations.length;
        this._annotations.push(reference);
        this._parsedAnnotations.set(index, annotation);
        let isAdded: boolean = false;
        if (this._page && this._page._pageDictionary.has('Annots')) {
            const collection: _PdfReference[] = this._page._pageDictionary.get('Annots');
            if (collection !== null && typeof collection !== 'undefined' && collection.indexOf(reference) === -1) {
                collection.push(reference);
                this._page._pageDictionary.set('Annots', collection);
                isAdded = true;
            }
        }
        if (!isAdded) {
            this._page._pageDictionary.set('Annots', this._annotations);
        }
        this._page._pageDictionary._updated = true;
        if (annotation && annotation instanceof PdfComment) {
            this._addCommentsAndReview(annotation, annotation._dictionary.get('F'));
        }
        this._updateCustomAppearanceResource(annotation);
        return index;
    }
    /**
     * Remove an annotation from the collection.
     *
     * @param {PdfAnnotation} annotation Annotation to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Access first annotation from the PDF page
     * let annotation: PdfAnnotation = page.annotations.at(0);
     * // Remove an annotation from the collection
     * page.annotations.remove(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(annotation: PdfAnnotation): void {
        if (annotation && annotation._ref) {
            const index: number = this._annotations.lastIndexOf(annotation._ref);
            if (index > -1) {
                this.removeAt(index);
            }
        }
    }
    /**
     * Remove an annotation from the collection at the specified index.
     *
     * @param {number} index Annotation index.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Remove an annotation from the collection
     * page.annotations.removeAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeAt(index: number): void {
        if (index < 0 || index >= this._annotations.length) {
            throw Error('Index out of range.');
        }
        const reference: _PdfReference = this._annotations[<number>index];
        if (reference && this._page) {
            const array: _PdfReference[] = this._page._getProperty('Annots');
            let parsedAnnotation: PdfAnnotation;
            if (this._parsedAnnotations.has(index)) {
                parsedAnnotation = this._parsedAnnotations.get(index) as PdfAnnotation;
            } else {
                const annotationDictionary: _PdfDictionary = this._crossReference._fetch(reference);
                parsedAnnotation = this._parseAnnotation(annotationDictionary);
                parsedAnnotation._ref = reference;
            }
            if (parsedAnnotation) {
                const comments: PdfPopupAnnotationCollection = (parsedAnnotation as PdfComment).comments;
                const reviewHistory: PdfPopupAnnotationCollection = (parsedAnnotation as PdfComment).reviewHistory;
                this._processAnnotations(comments, array);
                this._processAnnotations(reviewHistory, array);
                if (parsedAnnotation._dictionary && parsedAnnotation._dictionary.has('Popup')) {
                    const popupRef: _PdfReference = parsedAnnotation._dictionary.getRaw('Popup');
                    const popupIndex: number = (popupRef && popupRef instanceof _PdfReference) ? array.indexOf(popupRef) : -1;
                    if (popupIndex > -1) {
                        array.splice(popupIndex, 1);
                    }
                }
            }
            const actualIndex: number = array.indexOf(reference);
            if (actualIndex > -1) {
                array.splice(actualIndex, 1);
            }
            this._page._pageDictionary.set('Annots', array);
            this._page._pageDictionary._updated = true;
            if (this._annotations.indexOf(reference) > -1) {
                this._annotations.splice(index, 1);
            }
            if (this._parsedAnnotations.has(index)) {
                this._parsedAnnotations.delete(index);
                this._reorderParsedAnnotations(index);
            }
            const crossReference: _PdfCrossReference = this._page._crossReference;
            if (crossReference && crossReference._cacheMap.has(reference)) {
                crossReference._cacheMap.delete(reference);
            }
        }
    }
    _processReferences(references: _PdfReference[], array: _PdfReference[]): void {
        references.forEach((ref: _PdfReference): void => {
            if (ref && array.indexOf(ref) !== -1) {
                const index: number = array.indexOf(ref);
                array.splice(index, 1);
                const annotationsIndex: number = this._annotations.indexOf(ref);
                if (annotationsIndex > -1) {
                    this._annotations.splice(annotationsIndex, 1);
                }
                if (this._parsedAnnotations.has(index)) {
                    this._parsedAnnotations.delete(index);
                    this._reorderParsedAnnotations(index);
                }
                const crossReference: _PdfCrossReference = this._page._crossReference;
                if (crossReference && crossReference._cacheMap.has(ref)) {
                    crossReference._cacheMap.delete(ref);
                }
            }
        });
    }
    _processAnnotations(annotationCollection: PdfPopupAnnotationCollection, array: _PdfReference[]): void {
        if (annotationCollection && annotationCollection._collection.length > 0) {
            annotationCollection._collection.forEach((annotation: PdfPopupAnnotation): void => {
                const annotationReferences: _PdfReference[] = [annotation._ref];
                if (annotation.reviewHistory && annotation.reviewHistory._collection.length > 0) {
                    annotationReferences.push(
                        ...annotation.reviewHistory._collection.map(
                            (review: PdfPopupAnnotation): _PdfReference => review._ref
                        )
                    );
                }
                this._processReferences(annotationReferences, array);
            });
        }
    }
    _reorderParsedAnnotations(index: number): void {
        const result: Map<number, PdfAnnotation> = new Map<number, PdfAnnotation>();
        this._parsedAnnotations.forEach((value: PdfAnnotation, key: number) => {
            if (key > index) {
                result.set(key - 1, value);
            } else {
                result.set(key, value);
            }
        });
        this._parsedAnnotations = result;
    }
    _updateCustomAppearanceResource(annotation: PdfAnnotation): void {
        if (annotation && annotation instanceof PdfRubberStampAnnotation && typeof annotation._appearance !== 'undefined') {
            annotation._appearance.normal.graphics._processResources(annotation._crossReference);
        }
    }
    _addCommentsAndReview(annotation: PdfComment, flag: number): void {
        this._updateChildReference(annotation, annotation.comments, flag);
        this._updateChildReference(annotation, annotation.reviewHistory, flag);
    }
    _updateChildReference(annotation: PdfComment, collection: PdfPopupAnnotationCollection, flag: number): void {
        if (collection && collection.count > 0) {
            if (flag !== 30) {
                collection._collection.forEach((childAnnotation: PdfPopupAnnotation, i: number) => {
                    if (childAnnotation && !childAnnotation._dictionary.has('IRT')) {
                        if (i === 0 || !collection._isReview) {
                            childAnnotation._dictionary.update('IRT', annotation._ref);
                        } else {
                            childAnnotation._dictionary.update('IRT', collection._collection[i - 1]._ref);
                        }
                        if (collection._isReview) {
                            childAnnotation._isReview = true;
                        } else {
                            childAnnotation._isComment = true;
                        }
                        this.add(childAnnotation);
                    }
                });
            } else {
                throw new Error('Could not add comments/reviews to the review');
            }
        }
    }
    _getAnnotations(): void {
        if (this._parsedAnnotations.size === 0) {
            for (let i: number = 0; i < this._annotations.length; i++) {
                let dictionary: _PdfReference | _PdfDictionary = this._annotations[<number>i];
                if (dictionary && dictionary instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(dictionary);
                }
                if (dictionary && dictionary instanceof _PdfDictionary) {
                    const isPopupWithExternalParent: boolean = this._isPopupWithExternalParent(dictionary);
                    const annotation: PdfAnnotation = this._parseAnnotation(dictionary, i);
                    if (annotation) {
                        annotation._ref = this._annotations[<number>i];
                        this._parsedAnnotations.set(i, annotation);
                    } else if (isPopupWithExternalParent) {
                        i--;
                    }
                }
            }
        }
    }
    _isPopupWithExternalParent(dictionary: _PdfDictionary): boolean {
        if (dictionary && dictionary.has('Subtype')) {
            const key: _PdfName = dictionary.get('Subtype');
            if (key && key.name === 'Popup' && dictionary.has('Parent')) {
                return true;
            }
        }
        return false;
    }
    _parseAnnotation(dictionary: _PdfDictionary, index?: number): PdfAnnotation {
        let annot: PdfAnnotation;
        let hasParent: boolean = false;
        if (dictionary && dictionary.has('Subtype') && this._page !== null && typeof this._page !== 'undefined') {
            const key: _PdfName = dictionary.get('Subtype');
            const size: number[] = dictionary.get('Rect');
            if (key) {
                let link: _PdfDictionary;
                switch (key.name) {
                case 'Line':
                    annot = PdfLineAnnotation._load(this._page, dictionary);
                    break;
                case 'Circle':
                    if (dictionary.has('Measure')) {
                        annot = PdfCircleAnnotation._load(this._page, dictionary);
                    } else {
                        const width: number = size[2] - size[0];
                        const height: number = size[3] - size[1];
                        if (width === height) {
                            annot = PdfCircleAnnotation._load(this._page, dictionary);
                        } else {
                            annot = PdfEllipseAnnotation._load(this._page, dictionary);
                        }
                    }
                    break;
                case 'Square':
                    if (size && size.length >= 4 && size[2] === size[3]) {
                        annot = PdfSquareAnnotation._load(this._page, dictionary);
                    } else {
                        annot = PdfRectangleAnnotation._load(this._page, dictionary);
                    }
                    break;
                case 'Polygon':
                    annot = PdfPolygonAnnotation._load(this._page, dictionary);
                    break;
                case 'PolyLine':
                    if (dictionary.has('Measure') && dictionary.has('IT')) {
                        const type: _PdfName = dictionary.get('IT');
                        if (type && type.name === 'PolyLineAngle') {
                            annot = PdfAngleMeasurementAnnotation._load(this._page, dictionary);
                        }
                    }
                    if (!annot) {
                        annot = PdfPolyLineAnnotation._load(this._page, dictionary);
                    }
                    break;
                case 'Ink':
                    annot = PdfInkAnnotation._load(this._page, dictionary);
                    break;
                case 'Popup':
                    hasParent = this._isPopupWithExternalParent(dictionary);
                    if (typeof index === 'number' && hasParent) {
                        this._annotations.splice(index, 1);
                    } else {
                        annot = PdfPopupAnnotation._load(this._page, dictionary);
                    }
                    break;
                case 'Text':
                    annot = PdfPopupAnnotation._load(this._page, dictionary);
                    break;
                case 'Link':
                    if (dictionary.has('A')) {
                        link = dictionary.get('A');
                    }
                    if (link && link.has('S')) {
                        const type: string = link.get('S').name;
                        if (type) {
                            const isTextWebLink: boolean = this._hasValidBorder(dictionary.getArray('Border'));
                            if (type === 'URI') {
                                annot = isTextWebLink ?
                                    PdfTextWebLinkAnnotation._load(this._page, dictionary) :
                                    this._getLinkAnnotation(dictionary);
                            } else if (type === 'Launch') {
                                annot = PdfFileLinkAnnotation._load(this._page, dictionary);
                            } else if (type === 'GoToR') {
                                annot = this._getLinkAnnotation(dictionary);
                            } else if (type === 'GoTo') {
                                annot = PdfDocumentLinkAnnotation._load(this._page, dictionary);
                            }
                        }
                    }
                    else if (key.name === 'Link') {
                        annot = PdfDocumentLinkAnnotation._load(this._page, dictionary);
                    }
                    break;
                case 'FileAttachment':
                    annot = PdfAttachmentAnnotation._load(this._page, dictionary);
                    break;
                case '3D':
                    annot = Pdf3DAnnotation._load(this._page, dictionary);
                    break;
                case 'FreeText':
                    annot = PdfFreeTextAnnotation._load(this._page, dictionary);
                    break;
                case 'Redact':
                    annot = PdfRedactionAnnotation._load(this._page, dictionary);
                    break;
                case 'RichMedia':
                    annot = PdfRichMediaAnnotation._load(this._page, dictionary);
                    break;
                case 'Watermark':
                    annot = PdfWatermarkAnnotation._load(this._page, dictionary);
                    break;
                case 'Stamp':
                    annot = PdfRubberStampAnnotation._load(this._page, dictionary);
                    break;
                case 'Sound':
                    annot = PdfSoundAnnotation._load(this._page, dictionary);
                    break;
                case 'Caret':
                case 'Highlight':
                case 'Squiggly':
                case 'StrikeOut':
                case 'Underline':
                    annot = PdfTextMarkupAnnotation._load(this._page, dictionary);
                    break;
                }
            }
        }
        return annot;
    }
    _getLinkAnnotation(dictionary: _PdfDictionary): PdfFileLinkAnnotation | PdfUriAnnotation {
        let annot: PdfFileLinkAnnotation | PdfUriAnnotation;
        if (this._page) {
            if (dictionary && dictionary.has('A')) {
                const remote: _PdfDictionary = dictionary.get('A');
                if (remote && remote.has('S')) {
                    const link: _PdfName = remote.get('S');
                    if (link && link.name === 'GoToR' && remote.has('F')) {
                        annot = PdfFileLinkAnnotation._load(this._page, dictionary);
                    } else if (link && link.name === 'URI') {
                        annot = PdfUriAnnotation._load(this._page, dictionary);
                    }
                }
            } else {
                annot = PdfUriAnnotation._load(this._page, dictionary);
            }
        }
        return annot;
    }
    _hasValidBorder(border: number[]): boolean {
        if (typeof border === 'undefined' || border === null) {
            return false;
        }
        const isValid: boolean = !border.some((value: number) => {
            if (typeof value === 'undefined' || value === null) {
                return false;
            }
            return value > 0;
        });
        return isValid;
    }
    _doPostProcess(isFlatten: boolean): void {
        let index: number = 0;
        while (index < this.count) {
            const annotation: PdfAnnotation = this.at(index);
            if (annotation) {
                const flattenValue: boolean = annotation.flatten || isFlatten;
                annotation._isExport = this._isExport;
                if (flattenValue && this._annotations.lastIndexOf(annotation._ref) === -1) {
                    index++;
                }
                annotation._doPostProcess(flattenValue);
                if (!flattenValue) {
                    index++;
                }
            } else {
                index++;
            }
        }
    }
    _reArrange(ref: _PdfReference, tabIndex: number, index: number): _PdfReference[] {
        if (this._annotations) {
            if (tabIndex > this._annotations.length) {
                tabIndex = 0;
            }
            if (index >= this._annotations.length) {
                index = this._annotations.indexOf(ref);
            }
            const annotationDictionary: _PdfDictionary = this._crossReference.
                _fetch(this._annotations[<number>index]);
            if (annotationDictionary && annotationDictionary.has('Parent')) {
                const parentReference: _PdfReference = annotationDictionary.getRaw('Parent');
                if ((parentReference && parentReference === ref) || ref ===
                    this._annotations[<number>index]) {
                    const temp: _PdfReference = this._annotations[<number>index];
                    this._annotations[<number>index] = this._annotations[<number>tabIndex];
                    this._annotations[<number>tabIndex] = temp;
                }
            }
        }
        return this._annotations;
    }
    _clear(): void {
        this._annotations = [];
        this._parsedAnnotations = new Map<number, PdfAnnotation>();
        this._comments = [];
    }
}
/**
 * Represents the collection of `PdfPopupAnnotation`
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access annotation collection from first page
 * let annotations: PdfRectangleAnnotation = document.getPage(0).annotations;
 * // Gets the comments of annotation
 * let comments: PdfPopupAnnotationCollection = annotation.comments;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPopupAnnotationCollection {
    _isReview: boolean;
    _annotation: PdfAnnotation;
    _parentDictionary: _PdfDictionary;
    _collection: PdfPopupAnnotation[] = [];
    _page: PdfPage;
    _lastParentReference: _PdfReference;
    /**
     * Initializes a new instance of the `PdfPopupAnnotationCollection` class
     *
     * @private
     * @param {PdfAnnotation} annotation Annotation reference
     * @param {boolean} isReview Boolean flag to set review
     */
    constructor(annotation: PdfAnnotation, isReview: boolean) {
        if (annotation) {
            this._annotation = annotation;
        }
        this._isReview = isReview;
        if (annotation && this._annotation._isLoaded || annotation._page) {
            this._page = annotation._page;
            this._parentDictionary = annotation._dictionary;
            if (this._annotation._isLoaded) {
                this._parseCommentsOrReview();
            }
        }
    }
    /**
     * Gets the annotation count (Read only).
     *
     * @private
     * @returns {number} Number of annotations
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access annotation collection from first page
     * let annotations: PdfRectangleAnnotation = document.getPage(0).annotations;
     * // Gets the comments of annotation
     * let comments: PdfPopupAnnotationCollection = annotation.comments;
     * // Gets the count of comments
     * let count: number = comments.count;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        return this._collection.length;
    }
    /**
     * Gets the popup annotation at the specified index.
     *
     * @private
     * @param {number} index Index of the annotation
     * @returns {number} Annotation at the specified index
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access annotation collection from first page
     * let annotations: PdfRectangleAnnotation = document.getPage(0).annotations;
     * // Gets the comments of annotation
     * let comments: PdfPopupAnnotationCollection = annotation.comments;
     * // Gets the first comment
     * let comment: PdfPopupAnnotation = comments.at(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    at(index: number): PdfPopupAnnotation {
        if (index < 0 || index >= this._collection.length) {
            throw Error('Index out of range.');
        }
        return this._collection[<number>index];
    }
    /**
     * Add a new popup annotation into the collection
     *
     * @param {PdfPopupAnnotation} annotation Annotation to add
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new popup annotation
     * const popupAnnotation: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', 10, 40, 30, 30);
     * popupAnnotation.author = 'Syncfusion';
     * // Add a new popup annotation into the collection
     * annotation.comments.add(popupAnnotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(annotation: PdfPopupAnnotation): void {
        if (this._annotation._dictionary.get('F') === 30) {
            throw new Error('Could not add comments/reviews to the review');
        }
        annotation._dictionary.update('F', ((this._annotation.flags === PdfAnnotationFlag.locked) ? 128 : (this._isReview ? 30 : 28)));
        if (this._annotation && (this._annotation._isLoaded || (this._page && this._annotation._ref))) {
            this._page.annotations.add(annotation);
            const length: number = this._collection.length;
            if (length === 0 || !this._isReview) {
                annotation._dictionary.update('IRT', this._annotation._ref);
            } else {
                annotation._dictionary.update('IRT', this._collection[<number>(length - 1)]._ref);
            }
            if (this._isReview) {
                annotation._isReview = true;
            } else {
                annotation._isComment = true;
            }
        }
        this._collection.push(annotation);
    }
    /**
     * Remove an annotation from the collection
     *
     * @param {PdfPopupAnnotation} annotation Annotation to remove
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access annotation collection from first page
     * let annotations: PdfRectangleAnnotation = document.getPage(0).annotations;
     * // Gets the comments of annotation
     * let comments: PdfPopupAnnotationCollection = annotation.comments;
     * // Gets the first comment
     * let comment: PdfPopupAnnotation = comments.at(0);
     * // Remove the comment
     * comments.remove(comment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(annotation: PdfPopupAnnotation): void {
        const index: number = this._collection.indexOf(annotation);
        if (index > -1) {
            this.removeAt(index);
        }
    }
    /**
     * Remove an annotation from the collection at the specified index
     *
     * @param {number} index Annotation index to remove
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access annotation collection from first page
     * let annotations: PdfRectangleAnnotation = document.getPage(0).annotations;
     * // Gets the comments of annotation
     * let comments: PdfPopupAnnotationCollection = annotation.comments;
     * // Remove the first comment
     * comments.removeAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeAt(index: number): void {
        if (index > -1 && index < this._collection.length) {
            const annotation: PdfPopupAnnotation = this._collection[<number>index];
            if (this._isReview && index < this._collection.length - 1) {
                const nextAnnotation: PdfPopupAnnotation = this._collection[<number>(index + 1)];
                const previous: _PdfReference = annotation._dictionary._get('IRT');
                nextAnnotation._dictionary.set('IRT', previous);
                nextAnnotation._dictionary._updated = true;
            }
            this._collection.splice(index, 1);
            this._page.annotations.remove(annotation);
        } else {
            throw new Error('Index out of range.');
        }
    }
    _parseCommentsOrReview(): void {
        if (this._isReview) {
            this._parseReview();
        } else {
            this._parseComments();
        }
    }
    _parseReview(): void {
        let collection: PdfAnnotationCollection;
        if (this._page) {
            collection = this._page.annotations;
        }
        const map: Map<_PdfReference, PdfAnnotation> = new Map<_PdfReference, PdfAnnotation>();
        map.set(this._annotation._ref, this._annotation);
        if (collection && collection._comments && collection._comments.length > 0) {
            const remaining: PdfPopupAnnotation[] = [];
            collection._comments.forEach((annotation: PdfPopupAnnotation) => {
                const reference: _PdfReference = annotation._dictionary._get('IRT') as _PdfReference;
                if (annotation._isReview && reference && map.has(reference)) {
                    this._collection.push(annotation);
                    map.set(annotation._ref, annotation);
                } else {
                    remaining.push(annotation);
                }
            });
            if (remaining.length > 0) {
                collection._comments = remaining;
            } else {
                collection._comments = [];
            }
        } else if (collection) {
            const count: number = collection.count;
            for (let i: number = 0; i < count; i++) {
                const annotation: PdfAnnotation = collection.at(i);
                if (annotation && annotation instanceof PdfPopupAnnotation) {
                    const dictionary: _PdfDictionary = annotation._dictionary;
                    if (annotation._dictionary.has('IRT')) {
                        const reference: _PdfReference = dictionary._get('IRT') as _PdfReference;
                        if (annotation._isReview && reference && map.has(reference)) {
                            this._collection.push(annotation);
                            map.set(annotation._ref, annotation);
                        } else {
                            collection._comments.push(annotation);
                        }
                    }
                }
            }
        }
        map.clear();
    }
    _parseComments(): void {
        let collection: PdfAnnotationCollection;
        if (this._page) {
            collection = this._page.annotations;
        }
        if (collection && collection._comments && collection._comments.length > 0) {
            const remaining: PdfPopupAnnotation[] = [];
            collection._comments.forEach((annotation: PdfPopupAnnotation) => {
                const dictionary: _PdfDictionary = annotation._dictionary;
                const isReview: boolean = _checkReview(dictionary);
                const reference: _PdfReference = dictionary._get('IRT') as _PdfReference;
                if (reference && reference === this._annotation._ref && !isReview) {
                    this._collection.push(annotation);
                } else {
                    remaining.push(annotation);
                }
            });
            if (remaining.length > 0) {
                collection._comments = remaining;
            } else {
                collection._comments = [];
            }
        } else if (collection) {
            const count: number = collection.count;
            for (let i: number = 0; i < count; i++) {
                const annotation: PdfAnnotation = collection.at(i);
                if (annotation && annotation instanceof PdfPopupAnnotation) {
                    const dictionary: _PdfDictionary = annotation._dictionary;
                    if (annotation._dictionary.has('IRT')) {
                        const isReview: boolean = _checkReview(dictionary);
                        const reference: _PdfReference = dictionary._get('IRT') as _PdfReference;
                        if (reference && reference === this._annotation._ref && !isReview) {
                            this._collection.push(annotation);
                        } else {
                            collection._comments.push(annotation);
                        }
                    }
                }
            }
        }
    }
}
