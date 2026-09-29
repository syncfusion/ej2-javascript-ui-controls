/**
 * Represents the custom metadata for a PDF document.
 * Provides methods to manage key-value metadata pairs.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the document properties
 * let documentProperties: PdfDocumentProperties = document.getDocumentInformation(false);
 * // Gets the custom metadata
 * let custom: PdfCustomMetadata = documentProperties.customMetadata;
 * // Sets custom value
 * custom.set('key','value');
 * // Sets the document Information
 * document.setDocumentInformation(documentProperties);
 * // Saves the document
 * document.save();
 * ```
 */
export class PdfCustomMetadata {
    /**
     * Stores custom metadata properties.
     *
     * @private
     *
     */
    _customData: Map<string, string> = new Map<string, string>();
    private _standardKeys: Set<string> = new Set<string>(['title', 'author',  'subject', 'keywords', 'creator', 'producer', 'language', 'creationDate', 'modificationDate']);
    /**
     * Sets a key to the custom data map.
     *
     * @param {string} key The metadata key.
     * @param {string} value The metadata value.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document informations
     * let documentProperties: PdfDocumentProperties = document.getDocumentInformation(false);
     * // Gets the custom metadata from document information
     * let custom: PdfCustomMetadata= documentProperties.customMetadata;
     * // Sets a custom metadata value
     * custom.set('key','value');
     * // Sets the document Information
     * document.setDocumentInformation(documentProperties);
     * // Saves the document
     * document.save();
     * ```
     */
    set(key: string, value: string): void {
        if (typeof key === 'undefined' || key === null || typeof value === 'undefined' || value === null) {
            throw new Error('Key and value should not be null');
        }
        if (key === '' || value === '') {
            throw new Error('Key and value should not be empty');
        }
        if (this._standardKeys.has(key.toLowerCase())) {
            throw new Error('The Custom key cannot be a standard property');
        }
        this._customData.set(key, value);
    }
    /**
     * Gets a key from the custom data map.
     *
     * @param {string} key The key to get.
     * @returns {string} value The value of the key.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document informations
     * let documentProperties: PdfDocumentProperties = document.getDocumentInformation(false);
     * // Gets the custom metadata from document information
     * let custom:PdfCustomMetadata = documentProperties.customMetadata;
     * // Gets a custom metadata value
     * let value: string = custom.get('key');
     * // Saves the document
     * document.save();
     * ```
     */
    get(key: string): string  {
        if (typeof key === 'undefined' || key === null) {
            throw new Error('Key value should not be null');
        }
        return this._customData.get(key);
    }
    /**
     * Checks whether a key exists in the custom data map.
     *
     * @param {string} key The key to check.
     * @returns {boolean} True if the key exists; otherwise false.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document informations
     * let documentProperties: PdfDocumentProperties = document.getDocumentInformation(false);
     * // Gets the custom metadata from document information
     * let custom:PdfCustomMetadata = documentProperties.customMetadata;
     * // Check the key is present in the custom metadata
     * let exists: boolean = custom.has('key');
     * // Saves the document
     * document.save();
     * ```
     */
    has(key: string): boolean {
        if (typeof key === 'undefined' || key === null) {
            throw new Error('Key value should not be null');
        }
        return this._customData.has(key);
    }
    /**
     * Removes a key from the custom data map.
     *
     * @param {string} key The key to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * // Access the document informations
     * let documentProperties: PdfDocumentProperties = document.getDocumentInformation(false);
     * // Gets the custom metadata from document information
     * let custom:PdfCustomMetadata = documentProperties.customMetadata;
     * // Removes the key from the custom metadata
     * custom.remove('key');
     * // Sets the document Information
     * document.setDocumentInformation(documentProperties);
     * // Saves the document
     * document.save();
     * ```
     */
    remove(key: string): void {
        if (typeof key === 'undefined' || key === null) {
            throw new Error('Key value should not be null');
        }
        this._customData.delete(key);
    }
}
