import { _PdfDictionary } from '../pdf-primitives';
import { PdfEmbeddedFile } from './pdf-embedded-file';
/**
 * Represents a file specification used by a PDF action.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create an embedded file
 * let embeddedFile: PdfEmbeddedFile = new PdfEmbeddedFile(attachmentData);
 * // Create and configure a file specification
 * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.fdf');
 * fileSpecification.description = 'Form data';
 * fileSpecification.embeddedFile = embeddedFile;
 * // Create an import-data action
 * let action: PdfImportDataAction = new PdfImportDataAction(fileSpecification);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'ImportData', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfFileSpecification {
    /**
     * Stores the file specification dictionary.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Initializes a new instance of the `PdfFileSpecification` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.fdf');
     * // Create an import-data action
     * let action: PdfImportDataAction = new PdfImportDataAction(fileSpecification);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'ImportData', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} fileName The name of the file represented by the file specification.
     */
    public constructor(fileName: string) {
        this._dictionary = new _PdfDictionary();
        this.fileName = fileName;
    }
    /**
     * Creates a file specification from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The file specification dictionary.
     * @returns {PdfFileSpecification} The loaded file specification.
     */
    static _createFromDictionary(dictionary: _PdfDictionary): PdfFileSpecification {
        const specification: PdfFileSpecification =
            Object.create(PdfFileSpecification.prototype) as PdfFileSpecification;
        specification._dictionary = dictionary;
        return specification;
    }
    /**
     * Gets the file name represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Get the file specification and file name
     * let fileSpecification: PdfFileSpecification = action.fileSpecification;
     * let fileName: string = fileSpecification.fileName;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The file name represented by the file specification.
     */
    public get fileName(): string {
        return this._dictionary.get('F');
    }
    /**
     * Sets the file name represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Set the file name
     * action.fileSpecification.fileName = 'updated.fdf';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The file name to set in the file specification.
     */
    public set fileName(value: string) {
        this._dictionary.update('F', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the Unicode file name represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Get the Unicode file name
     * let unicodeFileName: string = action.fileSpecification.unicodeFileName;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The Unicode file name represented by the file specification.
     */
    public get unicodeFileName(): string {
        return this._dictionary.get('UF');
    }
    /**
     * Sets the Unicode file name represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Set the Unicode file name
     * action.fileSpecification.unicodeFileName = 'form-data.fdf';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The Unicode file name to set in the file specification.
     */
    public set unicodeFileName(value: string) {
        if (value) {
            this._dictionary.update('UF', value);
        } else {
            delete this._dictionary._map.UF;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets the description of the file represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Get the file description
     * let description: string = action.fileSpecification.description;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The description of the file.
     */
    public get description(): string {
        return this._dictionary.get('Desc');
    }
    /**
     * Sets the description of the file represented by the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Set the file description
     * action.fileSpecification.description = 'Form data';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The description to set for the file.
     */
    public set description(value: string) {
        if (value) {
            this._dictionary.update('Desc', value);
        } else {
            delete this._dictionary._map.Desc;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets the embedded file associated with the file specification.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = field.actions.mouseUp as PdfImportDataAction;
     * // Get the embedded file and its binary data
     * let embeddedFile: PdfEmbeddedFile = action.fileSpecification.embeddedFile;
     * let embeddedData: Uint8Array = embeddedFile.data;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfEmbeddedFile} The embedded file associated with the file specification.
     */
    public get embeddedFile(): PdfEmbeddedFile {
        const dictionary: _PdfDictionary = this._dictionary.get('EF');
        if (dictionary instanceof _PdfDictionary) {
            const value: any = dictionary.get('F'); // eslint-disable-line
            if (Array.isArray(value)) {
                return new PdfEmbeddedFile(new Uint8Array(value));
            }
        }
        return undefined;
    }
    /**
     * Sets the embedded file associated with the file specification.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create an embedded file
     * let embeddedFile: PdfEmbeddedFile = new PdfEmbeddedFile(attachmentData);
     * // Create a file specification and set the embedded file
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.fdf');
     * fileSpecification.embeddedFile = embeddedFile;
     * // Create an import-data action
     * let action: PdfImportDataAction = new PdfImportDataAction(fileSpecification);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'ImportData', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfEmbeddedFile} value The embedded file to associate with the file specification.
     */
    public set embeddedFile(value: PdfEmbeddedFile) {
        if (value && value.data) {
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.update('F', Array.from(value.data));
            this._dictionary.update('EF', dictionary);
        } else {
            delete this._dictionary._map.EF;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the file specification before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.fileName || this.fileName.trim() === '') {
            throw new Error(
                'PdfFileSpecification.fileName expected non-empty value.'
            );
        }
    }
}
