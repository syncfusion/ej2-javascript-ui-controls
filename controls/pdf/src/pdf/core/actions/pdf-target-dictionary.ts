import { PdfTargetRelation } from '../enumerator';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents a target used to locate an embedded PDF document or annotation.
 *
 * ```typescript
 * // Create an embedded PDF document
 * let embeddedDocument: PdfDocument = new PdfDocument();
 * embeddedDocument.addPage();
 * let embeddedData: Uint8Array = embeddedDocument.save();
 * embeddedDocument.destroy();
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * document.attachments.add(new PdfAttachment(embeddedData, 'embedded.pdf'));
 * // Create the embedded PDF destination and target
 * let destination: PdfRemoteDestination = new PdfRemoteDestination();
 * destination.pageNumber = 0;
 * destination.mode = PdfDestinationMode.fitToPage;
 * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
 * // Create an embedded GoTo action
 * let action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(destination, undefined, target);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'EmbeddedGoTo', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfTargetDictionary {
    /**
     * Stores the target dictionary.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Initializes a new instance of the `PdfTargetDictionary` class.
     *
     * ```typescript
     * // Create an embedded PDF document
     * let embeddedDocument: PdfDocument = new PdfDocument();
     * embeddedDocument.addPage();
     * let embeddedData: Uint8Array = embeddedDocument.save();
     * embeddedDocument.destroy();
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * document.attachments.add(new PdfAttachment(embeddedData, 'embedded.pdf'));
     * // Create the embedded PDF destination and target
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 0;
     * destination.mode = PdfDestinationMode.fitToPage;
     * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
     * // Create an embedded GoTo action
     * let action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(destination, undefined, target);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'EmbeddedGoTo', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfTargetRelation} relation The relationship between the current document and the target.
     * @param {string} name The name used to locate the target document.
     */
    public constructor(relation: PdfTargetRelation, name: string) {
        this._dictionary = new _PdfDictionary();
        this.relation = relation;
        this.name = name;
    }
    /**
     * Gets the relationship between the current document and the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action and target relationship
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * let relation: PdfTargetRelation = action.target.relation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfTargetRelation} The relationship between the current document and the target.
     */
    public get relation(): PdfTargetRelation {
        const value: unknown = this._dictionary.get('R');
        if (value instanceof _PdfName && value.name === 'P') {
            return PdfTargetRelation.Parent;
        }
        return PdfTargetRelation.Child;
    }
    /**
     * Sets the relationship between the current document and the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Set the target relationship
     * action.target.relation = PdfTargetRelation.Child;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfTargetRelation} value The relationship between the current document and the target.
     */
    public set relation(value: PdfTargetRelation) {
        const name: string = value === PdfTargetRelation.Parent ? 'P' : 'C';
        this._dictionary.update('R', new _PdfName(name));
        this._dictionary._updated = true;
    }
    /**
     * Gets the name used to locate the target document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action and target name
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * let name: string = action.target.name;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The name used to locate the target document.
     */
    public get name(): string {
        return this._dictionary.get('N');
    }
    /**
     * Sets the name used to locate the target document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Set the target name
     * action.target.name = 'updated.pdf';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The name used to locate the target document.
     */
    public set name(value: string) {
        this._dictionary.update('N', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the zero-based page number associated with the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action and target page number
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * let pageNumber: number = action.target.pageNumber;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The zero-based page number associated with the target.
     */
    public get pageNumber(): number {
        return this._dictionary.get('P');
    }
    /**
     * Sets the zero-based page number associated with the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Set the target page number
     * action.target.pageNumber = 0;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The zero-based page number to associate with the target.
     */
    public set pageNumber(value: number) {
        this._dictionary.update('P', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the zero-based annotation index associated with the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action and target annotation index
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * let annotationIndex: number = action.target.annotationIndex;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The zero-based annotation index associated with the target.
     */
    public get annotationIndex(): number {
        return this._dictionary.get('A');
    }
    /**
     * Sets the zero-based annotation index associated with the target.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Set the target annotation index
     * action.target.annotationIndex = 0;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The zero-based annotation index to associate with the target.
     */
    public set annotationIndex(value: number) {
        this._dictionary.update('A', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the nested target used to locate an embedded document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action and nested target
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * let target: PdfTargetDictionary = action.target.target;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfTargetDictionary} The nested target used to locate an embedded document.
     */
    public get target(): PdfTargetDictionary {
        const dictionary: _PdfDictionary = this._dictionary.get('T') as _PdfDictionary;
        if (dictionary instanceof _PdfDictionary) {
            return PdfTargetDictionary._createFromDictionary(dictionary);
        }
        return undefined;
    }
    /**
     * Sets the nested target used to locate an embedded document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the embedded GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Create and set a nested target
     * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'child.pdf');
     * action.target.target = target;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfTargetDictionary} value The nested target used to locate an embedded document.
     */
    public set target(value: PdfTargetDictionary) {
        if (value) {
            this._dictionary.update('T', value._dictionary);
        } else {
            delete this._dictionary._map.T;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the target dictionary before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (this.relation === PdfTargetRelation.Child && (!this.name || this.name.trim() === '')) {
            throw new Error(
                'PdfTargetDictionary.name expected non-empty value for child relation.'
            );
        }
        if (this.target === this) {
            throw new Error(
                'PdfTargetDictionary cyclic target reference detected.'
            );
        }
        if (this.target) {
            this.target._validate();
        }
    }
    /**
     * Creates a target dictionary from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The target dictionary to load.
     * @returns {PdfTargetDictionary} The loaded target dictionary.
     */
    static _createFromDictionary(dictionary: _PdfDictionary): PdfTargetDictionary {
        const target: PdfTargetDictionary =
            Object.create(PdfTargetDictionary.prototype) as PdfTargetDictionary;
        target._dictionary = dictionary;
        return target;
    }
}
