import { _PdfStream } from './../base-stream';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { _dateToString, _decode, _relationshipToString, _resolveEmbeddedFileStreamRef, _stringToDate, _stringToRelationship } from './../utils';
import { PdfAttachmentRelationship } from './../enumerator';
import { _decodeEmbeddedStream } from './../utils';
/**
 * Represents a document-level attachment embedded in a PDF document.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first attachment
 * let attachment: PdfAttachment = document.attachments.getItem(0);
 * // Retrieve decoded attachment bytes
 * let bytes: Uint8Array = attachment.data;
 * // Get the attachment's zero-based index
 * let index: number = attachment.index;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAttachment {
    /**
     * Internal field to handle the attachment collection
     *
     * @private
     */
    private _owner: { _attachments: PdfAttachmentCollection } = null;
    /**
     * Internal field to handle the attachment data
     *
     * @private
     */
    private _cachedData: Uint8Array = null;
    /**
     * Internal field to handle the attachment reference
     *
     * @private
     */
    _embeddedFileRef: _PdfEmbeddedFileRef = null;
    /**
     * Internal field to handle the attachment index
     *
     * @private
     */
    _index: number = -1;
    /**
     * Internal field for the attachment file name (used as both the EmbeddedFiles name-tree key and the display name).
     *
     * @private
     */
    _fileName: string = '';
    /**
     * Internal field for the attachment description.
     *
     * @private
     */
    _description: string = '';
    /**
     * Internal field for the attachment MIME type.
     *
     * @private
     */
    _mimeType: string = '';
    /**
     * Internal field for the attachment creation date.
     *
     * @private
     */
    _creationDate: Date;
    /**
     * Internal field for the attachment modification date.
     *
     * @private
     */
    _modificationDate: Date;
    /**
     * Internal field for the attachment relationship.
     *
     * @private
     */
    _relationship: PdfAttachmentRelationship = PdfAttachmentRelationship.Unspecified;

    /**
     * Initializes a new instance of the `PdfAttachment` class with attachment data.
     *
     * @param {Uint8Array} data The attachment data.
     * @param {string} name The attachment file name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Add the attachment to the document
     * let index: number = document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: Uint8Array, name: string)
    /**
     * Initializes a new instance of the `PdfAttachment` class with attachment data.
     *
     * @param {string} data The base64-encoded attachment data.
     * @param {string} name The attachment file name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Add the attachment to the document
     * let index: number = document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: string, name: string)
    /**
     * Initializes a new instance of the `PdfAttachment` class with attachment data and options.
     *
     * @param {Uint8Array} data The binary data to embed as an attachment.
     * @param {string} name The file name of the attachment.
     * @param {{mimeType?: string, description?: string, creationDate?: Date, modificationDate?: Date, relationship?: PdfAttachmentRelationship}} options The optional attachment properties.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment with options
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt', {
     *     mimeType: 'text/plain',
     *     description: 'A plain text file',
     *     creationDate: new Date(),
     *     modificationDate: new Date(),
     *     relationship: PdfAttachmentRelationship.Data
     * });
     * // Add the attachment to the document
     * let index: number = document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: Uint8Array, name: string, options: {mimeType?: string, description?: string,
        creationDate?: Date, modificationDate?: Date, relationship?: PdfAttachmentRelationship})
    /**
     * Initializes a new instance of the `PdfAttachment` class with attachment data and options.
     *
     * @param {string} data The attachment data as base64 string.
     * @param {string} name The file name of the attachment.
     * @param {{mimeType?: string, description?: string, creationDate?: Date, modificationDate?: Date, relationship?: PdfAttachmentRelationship}} options The optional attachment properties.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment with options
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt', {
     *     mimeType: 'text/plain',
     *     description: 'A plain text file',
     *     creationDate: new Date(),
     *     modificationDate: new Date(),
     *     relationship: PdfAttachmentRelationship.Data
     * });
     * // Add the attachment to the document
     * let index: number = document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: string, name: string, options: {mimeType?: string, description?: string,
        creationDate?: Date, modificationDate?: Date, relationship?: PdfAttachmentRelationship})
    constructor(data?: Uint8Array | string, name?: string, options?: {mimeType?: string,
        description?: string, creationDate?: Date, modificationDate?: Date, relationship?: PdfAttachmentRelationship}) {
        if (options !== null && typeof options === 'object') {
            if (typeof options.mimeType === 'string') {
                this._mimeType = options.mimeType;
            }
            if (typeof options.description === 'string') {
                this._description = options.description;
            }
            if (options.creationDate instanceof Date) {
                this._creationDate = options.creationDate;
            }
            if (options.modificationDate instanceof Date) {
                this._modificationDate = options.modificationDate;
            }
            if (typeof options.relationship !== 'undefined' && options.relationship !== null) {
                this._relationship = options.relationship;
            }
        }
        if (name !== null && typeof name === 'string') {
            this._fileName = name;
            const attachmentData: Uint8Array = (typeof data === 'string') ? _decode(data) as Uint8Array : data as Uint8Array;
            this._embeddedFileRef = new _NamedEmbeddedFileRef(name, attachmentData);
        }
    }
    /**
     * Gets a defensive copy of the fully decoded attachment data.
     *
     * @returns {Uint8Array} The decoded attachment data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Retrieve decoded attachment bytes
     * let bytes: Uint8Array = attachment.data;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get data(): Uint8Array {
        if (this._owner === null) {
            throw new Error('Cannot read data from a detached attachment.');
        }
        if (this._embeddedFileRef === null) {
            throw new Error('Attachment stream reference is missing or corrupt.');
        }
        if (this._cachedData === null) {
            this._cachedData = this._decodeData();
        }
        return new Uint8Array(this._cachedData);
    }
    /**
     * Gets the current zero-based index of this attachment in the owning document.
     *
     * @returns {number} The current attachment index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get its index
     * let index: number = attachment.index;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get index(): number {
        if (this._owner === null) {
            throw new Error('Cannot read index from a detached attachment.');
        }
        return this._index;
    }
    /**
     * Gets the file name of the attachment.
     *
     * @returns {string} The file name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the file name
     * let fileName: string = attachment.fileName;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fileName(): string {
        return this._fileName;
    }
    /**
     * Sets the file name of the attachment.
     *
     * @param {string} value The file name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the file name
     * attachment.fileName = 'renamed.txt';
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fileName(value: string) {
        this._fileName = value;
    }
    /**
     * Gets the description of the attachment.
     *
     * @returns {string} The description.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the description
     * let description: string = attachment.description;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get description(): string {
        return this._description;
    }
    /**
     * Sets the description of the attachment.
     *
     * @param {string} value The description.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the description
     * attachment.description = 'A plain text file';
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set description(value: string) {
        this._description = value;
    }
    /**
     * Gets the MIME type of the attachment.
     *
     * @returns {string} The MIME type string (e.g. `"text/plain"`).
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the MIME type
     * let mimeType: string = attachment.mimeType;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mimeType(): string {
        return this._mimeType;
    }
    /**
     * Sets the MIME type of the attachment.
     *
     * @param {string} value The MIME type string (e.g. `"text/plain"`).
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the MIME type
     * attachment.mimeType = 'text/plain';
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set mimeType(value: string) {
        this._mimeType = value;
    }
    /**
     * Gets the creation date of the attachment.
     *
     * @returns {Date} The creation date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the creation date
     * let creationDate: Date = attachment.creationDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get creationDate(): Date {
        return this._creationDate;
    }
    /**
     * Sets the creation date of the attachment.
     *
     * @param {Date} value The creation date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the creation date
     * attachment.creationDate = new Date();
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set creationDate(value: Date) {
        this._creationDate = value;
    }
    /**
     * Gets the modification date of the attachment.
     *
     * @returns {Date} The modification date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the modification date
     * let modificationDate: Date = attachment.modificationDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get modificationDate(): Date {
        return this._modificationDate;
    }
    /**
     * Sets the modification date of the attachment.
     *
     * @param {Date} value The modification date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the modification date
     * attachment.modificationDate = new Date();
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set modificationDate(value: Date) {
        this._modificationDate = value;
    }
    /**
     * Gets the relationship of the attachment to the document content.
     *
     * @returns {PdfAttachmentRelationship} The relationship value.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first attachment
     * let attachment: PdfAttachment = document.attachments.getItem(0);
     * // Get the relationship
     * let relationship: PdfAttachmentRelationship = attachment.relationship;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get relationship(): PdfAttachmentRelationship {
        return this._relationship;
    }
    /**
     * Sets the relationship of the attachment to the document content.
     *
     * @param {PdfAttachmentRelationship} value The relationship value.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new attachment
     * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
     * // Set the relationship
     * attachment.relationship = PdfAttachmentRelationship.Data;
     * // Add the attachment to the document
     * document.attachments.add(attachment);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set relationship(value: PdfAttachmentRelationship) {
        this._relationship = value;
    }
    /**
     * Initializes ownership and stream reference for a parsed or added attachment.
     *
     * @param {{ _attachments: PdfAttachmentCollection }} owner The owner document attachment collection host.
     * @param {PdfAttachmentCollection} owner._attachments The attachment collection managed by the owner.
     * @param {_PdfEmbeddedFileRef} embeddedFileRef The embedded-file reference.
     * @param {number} index The zero-based attachment index.
     * @returns {void} Nothing.
     */
    _initialize(
        owner: { _attachments: PdfAttachmentCollection },
        embeddedFileRef: _PdfEmbeddedFileRef,
        index: number
    ): void {
        this._owner = owner;
        this._embeddedFileRef = embeddedFileRef;
        this._index = index;
        this._cachedData = null;
    }
    /**
     * Parses attachment metadata (fileName, description, mimeType, creationDate, modificationDate, relationship)
     * from a file-specification dictionary and its embedded-file stream dictionary.
     *
     * @param {_PdfDictionary} fileSpecDict The file-specification dictionary object.
     * @param {_PdfCrossReference} xref The cross-reference used to resolve object references.
     * @returns {void} Nothing.
     * @private
     */
    _parseMetadata(fileSpecDict: _PdfDictionary, xref: _PdfCrossReference): void {
        if (!fileSpecDict) {
            return;
        }
        if (fileSpecDict.has('UF')) {
            const uf: any = fileSpecDict.get('UF'); // eslint-disable-line
            if (typeof uf === 'string') {
                this._fileName = uf;
            }
        } else if (fileSpecDict.has('F')) {
            const f: any = fileSpecDict.get('F'); // eslint-disable-line
            if (typeof f === 'string') {
                this._fileName = f;
            }
        }
        if (fileSpecDict.has('Desc')) {
            const desc: any = fileSpecDict.get('Desc'); // eslint-disable-line
            if (typeof desc === 'string') {
                this._description = desc;
            }
        }
        if (fileSpecDict.has('AFRelationship')) {
            const rel: any = fileSpecDict.get('AFRelationship'); // eslint-disable-line
            const relName: string = (rel instanceof _PdfName) ? rel.name : (typeof rel === 'string' ? rel : '');
            this._relationship = _stringToRelationship(relName);
        }
        if (fileSpecDict.has('EF')) {
            const efDict: _PdfDictionary = fileSpecDict.get('EF');
            if (efDict) {
                let streamRef: any = efDict.getRaw('UF') || efDict.getRaw('F'); // eslint-disable-line
                if (streamRef instanceof _PdfReference) {
                    const embStream: any = xref._fetch(streamRef); // eslint-disable-line
                    if (embStream) {
                        const streamDict: _PdfDictionary = embStream.dictionary || (embStream instanceof _PdfDictionary ? embStream : null);
                        if (streamDict) {
                            if (streamDict.has('Subtype')) {
                                const subtype: any = streamDict.get('Subtype'); // eslint-disable-line
                                const subtypeStr: string = (subtype instanceof _PdfName) ? subtype.name : (typeof subtype === 'string' ? subtype : '');
                                if (subtypeStr) {
                                    this._mimeType = subtypeStr.replace(/#2[Ff]/g, '/');
                                }
                            }
                            if (streamDict.has('Params')) {
                                const params: _PdfDictionary = streamDict.get('Params');
                                if (params) {
                                    if (params.has('CreationDate')) {
                                        const cd: any = params.get('CreationDate'); // eslint-disable-line
                                        if (typeof cd === 'string') {
                                            this._creationDate = _stringToDate(cd);
                                        }
                                    }
                                    if (params.has('ModDate')) {
                                        const md: any = params.get('ModDate'); // eslint-disable-line
                                        if (typeof md === 'string') {
                                            this._modificationDate = _stringToDate(md);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * Detaches this attachment from its owning collection.
     *
     * @returns {void} Nothing.
     * @private
     */
    _detach(): void {
        this._owner = null;
        this._embeddedFileRef = null;
        this._cachedData = null;
    }
    /**
     * Decodes the attachment payload from the embedded-file reference.
     *
     * @returns {Uint8Array} The decoded attachment bytes.
     * @private
     */
    _decodeData(): Uint8Array {
        if (this._embeddedFileRef === null) {
            throw new Error('Attachment stream reference is missing or corrupt.');
        }
        return this._embeddedFileRef._getDecodedBytes();
    }
}
/**
 * Internal interface representing a decoded embedded-file reference.
 *
 * @private
 */
export interface _PdfEmbeddedFileRef {
    _getDecodedBytes(): Uint8Array;
}
/**
 * Internal embedded-file reference that wraps a fetched PDF stream and decodes it lazily.
 *
 * @private
 */
class _EmbeddedFileStreamRef implements _PdfEmbeddedFileRef {
    private _crossReference: _PdfCrossReference;
    private _streamRef: _PdfReference;
    constructor(crossReference: _PdfCrossReference, streamRef: _PdfReference) {
        this._crossReference = crossReference;
        this._streamRef = streamRef;
    }
    /**
     * Retrieves and decodes the embedded file data from the referenced PDF stream.
     *
     * @private
     * @returns {Uint8Array} The decoded embedded file bytes.
     */
    _getDecodedBytes(): Uint8Array {
        const stream: any = this._crossReference._fetch(this._streamRef); // eslint-disable-line
        if (!stream) {
            throw new Error('Embedded file stream is missing.');
        }
        return _decodeEmbeddedStream(stream);
    }
}
/**
 * Represents the collection of attachments embedded in a PDF document.
 * ```typescript
 * // Load an existing PDF document.
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the attachments embedded in the document.
 * let attachments: PdfAttachmentCollection = document.attachments;
 * // Get the attachment count.
 * let count: number = attachments.count;
 * // Get attachment data from the document attachment collection.
 * let attachmentData: Uint8Array = attachments.getItem(0).data;
 * // Add a new attachment to the PDF document and get its index.
 * let index: number = attachments.add(new PdfAttachment(attachmentData, 'input.txt'));
 * // Add an attachment at a specified index.
 * attachments.add(new PdfAttachment(attachmentData, 'inserted.txt'), 0);
 * // Save and destroy the document.
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfAttachmentCollection {
    /**
     * Ordered list of live attachment wrappers.
     *
     * @private
     */
    _attachmentList: PdfAttachment[] = [];
    /**
     * Attachment names parallel to _attachmentList for duplicate detection.
     *
     * @private
     */
    private _names: string[] = [];
    private _crossReference: _PdfCrossReference;
    private _parsed: boolean = false;
    /**
     * Initializes a new instance of the `PdfAttachmentCollection` class.
     *
     * @param {_PdfCrossReference} crossReference The cross-reference of the owning document.
     * @private
     */
    constructor(crossReference: _PdfCrossReference) {
        this._crossReference = crossReference;
    }
    /**
     * Lazily parses the catalog EmbeddedFiles name tree if not already done.
     *
     * @returns {void} Nothing.
     * @private
     */
    private _ensureParsed(): void {
        if (this._parsed) {
            return;
        }
        this._parsed = true;
        if (!this._crossReference._document) {
            return;
        }
        const catalog: _PdfDictionary = this._crossReference._document._catalog._catalogDictionary;
        if (!catalog || !catalog.has('Names')) {
            return;
        }
        const namesDictionary: _PdfDictionary = catalog.get('Names');
        if (!namesDictionary || !namesDictionary.has('EmbeddedFiles')) {
            return;
        }
        let embeddedFiles: any = namesDictionary.getRaw('EmbeddedFiles'); // eslint-disable-line
        if (embeddedFiles instanceof _PdfReference) {
            embeddedFiles = this._crossReference._fetch(embeddedFiles);
        }
        if (!embeddedFiles || !(embeddedFiles instanceof _PdfDictionary)) {
            return;
        }
        const pairs: [string, _PdfReference][] = [];
        this._collectNameTreePairs(embeddedFiles, pairs, new Set<string>(), 0);
        pairs.sort((a: [string, _PdfReference], b: [string, _PdfReference]) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
        let listIndex: number = 0;
        for (let i: number = 0; i < pairs.length; i++) {
            const pairName: string = pairs[<number>i][0];
            const fileRef: _PdfReference = pairs[<number>i][1];
            const fileSpecDict: any = this._crossReference._fetch(fileRef); // eslint-disable-line
            const streamRef: _PdfReference = _resolveEmbeddedFileStreamRef(fileSpecDict);
            if (!streamRef) {
                continue;
            }
            const embeddedFileRef: _PdfEmbeddedFileRef = new _EmbeddedFileStreamRef(this._crossReference, streamRef);
            const attachment: PdfAttachment = new (PdfAttachment as any)(); // eslint-disable-line
            attachment._initialize({ _attachments: this }, embeddedFileRef, listIndex);
            attachment._fileName = pairName;
            attachment._parseMetadata(fileSpecDict, this._crossReference);
            this._attachmentList.push(attachment);
            this._names.push(pairName);
            listIndex++;
        }
    }
    /**
     * Recursively collects name/reference pairs from an EmbeddedFiles name tree node.
     *
     * @param {_PdfDictionary} node The current name-tree node.
     * @param {[string, _PdfReference][]} pairs Accumulated pairs.
     * @param {Set<string>} visited Visited object IDs to detect cycles.
     * @param {number} depth Current recursion depth guard.
     * @returns {void} Nothing.
     * @private
     */
    private _collectNameTreePairs(node: _PdfDictionary, pairs: [string, _PdfReference][], visited: Set<string>, depth: number): void {
        if (depth > 50) {
            return;
        }
        if (!node) {
            return;
        }
        const nodeId: string = node.objId ? node.objId : '';
        if (nodeId && visited.has(nodeId)) {
            return;
        }
        if (nodeId) {
            visited.add(nodeId);
        }
        if (node.has('Names')) {
            let elements: any = node.getRaw('Names'); // eslint-disable-line
            if (elements instanceof _PdfReference) {
                elements = this._crossReference._fetch(elements);
            }
            if (Array.isArray(elements)) {
                for (let i: number = 1; i < elements.length; i = i + 2) {
                    const name: any = elements[i - 1]; // eslint-disable-line
                    const ref: any = elements[<number>i]; // eslint-disable-line
                    if (typeof name === 'string' && ref instanceof _PdfReference) {
                        pairs.push([name, ref]);
                    }
                }
            }
        }
        if (node.has('Kids')) {
            const kidsRaw: any = node.getRaw('Kids'); // eslint-disable-line
            let kids: any[]; // eslint-disable-line
            if (kidsRaw instanceof _PdfReference) {
                kids = this._crossReference._fetch(kidsRaw);
            } else {
                kids = kidsRaw;
            }
            if (Array.isArray(kids)) {
                for (const kid of kids) {
                    let kidDict: _PdfDictionary;
                    if (kid instanceof _PdfReference) {
                        kidDict = this._crossReference._fetch(kid);
                    } else {
                        kidDict = kid;
                    }
                    if (kidDict instanceof _PdfDictionary) {
                        this._collectNameTreePairs(kidDict, pairs, visited, depth + 1);
                    }
                }
            }
        }
    }
    /**
     * Gets the number of document-level file attachments.
     *
     * @returns {number} The number of attachments embedded in the document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Get the attachment count
     * let count: number = attachments.count;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        this._ensureParsed();
        return this._attachmentList.length;
    }
    /**
     * Returns the attachment at the specified zero-based index.
     *
     * @param {number} index The zero-based index of the attachment to retrieve.
     * @returns {PdfAttachment} The attachment at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Get the first attachment
     * let attachment: PdfAttachment = attachments.getItem(0);
     * // Get the attachment bytes
     * let bytes: Uint8Array = attachment.data;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public getItem(index: number): PdfAttachment {
        this._ensureParsed();
        if (!Number.isInteger(index) || index < 0 || index >= this._attachmentList.length) {
            throw new Error(`Attachment index ${index} is out of range.`);
        }
        return this._attachmentList[<number>index];
    }
    /**
     * Returns whether the specified attachment belongs to this document.
     *
     * @param {PdfAttachment} attachment The attachment instance to check.
     * @returns {boolean} `true` when the attachment is present; otherwise, `false`.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Check whether the first attachment belongs to the document
     * let exists: boolean = attachments.has(attachments.getItem(0));
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public has(attachment: PdfAttachment): boolean {
        this._ensureParsed();
        for (let i: number = 0; i < this._attachmentList.length; i++) {
            if (this._attachmentList[<number>i] === attachment) {
                return true;
            }
        }
        return false;
    }
    /**
     * Adds an attachment to the PDF document.
     *
     * @param {PdfAttachment} attachment The attachment to add.
     * @returns {number} The zero-based index of the added attachment.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Add a new attachment to the PDF document and get its index
     * let index: number = attachments.add(new PdfAttachment(attachmentData, 'input.txt'));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public add(attachment: PdfAttachment): number;
    /**
     * Adds an attachment to the PDF document at the specified index.
     *
     * @param {PdfAttachment} attachment The attachment to add.
     * @param {number} index The zero-based insertion index.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Add an attachment at index 0
     * attachments.add(new PdfAttachment(attachmentData, 'inserted.txt'), 0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public add(attachment: PdfAttachment, index: number): void;
    public add(attachment: PdfAttachment, index?: number): number | void {
        this._ensureParsed();
        if (!attachment) {
            throw new Error('Attachment cannot be null or undefined.');
        }
        const name: string = attachment._fileName;
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('Attachment file name must be a non-empty string.');
        }
        if (name.indexOf('\0') !== -1) {
            throw new Error('Attachment name must not contain null characters.');
        }
        if (attachment._embeddedFileRef === null) {
            throw new Error('Attachment data is missing.');
        }
        const count: number = this._attachmentList.length;
        let insertAt: number;
        if (typeof index === 'undefined') {
            insertAt = count;
        } else {
            if (
                !Number.isInteger(index) ||
                !Number.isFinite(index) ||
                index < 0 ||
                index > count
            ) {
                throw new Error(
                    `Insertion index ${index} is out of range.`
                );
            }
            insertAt = index;
        }
        attachment._initialize(
            { _attachments: this },
            attachment._embeddedFileRef,
            insertAt
        );
        this._attachmentList.splice(insertAt, 0, attachment);
        this._names.splice(insertAt, 0, name);
        for (let i: number = insertAt + 1; i < this._attachmentList.length; i++) {
            this._attachmentList[<number>i]._index = i;
        }
        return typeof index === 'undefined' ? insertAt : undefined;
    }
    /**
     * Removes the attachment at the specified zero-based index.
     *
     * @param {number} index The zero-based index of the attachment to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Remove the first attachment
     * attachments.removeAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public removeAt(index: number): void {
        this._removeByIndex(index);
    }
    /**
     * Removes the specified attachment instance from the document.
     *
     * @param {PdfAttachment} attachment The attachment instance to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Remove the first attachment
     * attachments.remove(attachments.getItem(0));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public remove(attachment: PdfAttachment): void {
        this._removeByInstance(attachment);
    }
    /**
     * Removes the attachment at the specified index.
     *
     * @param {number} index Zero-based index.
     * @returns {void} Nothing.
     * @private
     */
    private _removeByIndex(index: number): void {
        this._ensureParsed();
        if (!Number.isInteger(index) || index < 0 || index >= this._attachmentList.length) {
            throw new Error(`Attachment index ${index} is out of range.`);
        }
        const removed: PdfAttachment = this._attachmentList[<number>index];
        this._attachmentList.splice(index, 1);
        this._names.splice(index, 1);
        removed._detach();
        for (let i: number = index; i < this._attachmentList.length; i++) {
            this._attachmentList[<number>i]._index = i;
        }
    }
    /**
     * Removes the specified attachment instance.
     *
     * @param {PdfAttachment} attachment The attachment to remove.
     * @returns {void} Nothing.
     * @private
     */
    private _removeByInstance(attachment: PdfAttachment): void {
        this._ensureParsed();
        const index: number = this._attachmentList.indexOf(attachment);
        if (index === -1) {
            throw new Error('The specified attachment does not belong to this document.');
        }
        this._attachmentList.splice(index, 1);
        this._names.splice(index, 1);
        attachment._detach();
        for (let i: number = index; i < this._attachmentList.length; i++) {
            this._attachmentList[<number>i]._index = i;
        }
    }
    /**
     * Removes all document-level file attachments and clears the embedded-files name tree.
     *
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the attachments embedded in the document
     * let attachments: PdfAttachmentCollection = document.attachments;
     * // Remove all attachments
     * attachments.clear();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public clear(): void {
        this._ensureParsed();
        const toDetach: PdfAttachment[] = this._attachmentList.slice();
        this._attachmentList = [];
        this._names = [];
        for (const a of toDetach) {
            a._detach();
        }
        if (!this._crossReference._document) {
            return;
        }
        const catalog: _PdfDictionary = this._crossReference._document._catalog._catalogDictionary;
        if (!catalog || !catalog.has('Names')) {
            return;
        }
        const namesDictionary: _PdfDictionary = catalog.get('Names');
        if (!namesDictionary) {
            return;
        }
        if (namesDictionary.has('EmbeddedFiles')) {
            delete (namesDictionary as any)._map['EmbeddedFiles']; // eslint-disable-line
            namesDictionary._updated = true;
            catalog._updated = true;
        }
    }
    /**
     * Serializes all in-memory attachments into the PDF object graph ready for save.
     *
     * @returns {void} Nothing.
     * @private
     */
    _serialize(): void {
        this._ensureParsed();
        if (this._attachmentList.length === 0) {
            return;
        }
        const xref: _PdfCrossReference = this._crossReference;
        const catalog: _PdfDictionary = xref._document._catalog._catalogDictionary;
        let namesDictionary: _PdfDictionary;
        if (catalog.has('Names')) {
            namesDictionary = catalog.get('Names');
        } else {
            namesDictionary = new _PdfDictionary(xref);
            xref._allowCatalog = true;
            const namesDictRef: _PdfReference = xref._getNextReference();
            xref._cacheMap.set(namesDictRef, namesDictionary);
            catalog.update('Names', namesDictRef);
            namesDictionary._updated = true;
        }
        const tuples: [string, _PdfReference, PdfAttachment][] = [];
        for (const attachment of this._attachmentList) {
            const name: string = attachment._fileName;
            const rawBytes: Uint8Array = attachment._decodeData();
            const fileStream: _PdfStream = new _PdfStream(rawBytes);
            const fileDictionary: _PdfDictionary = new _PdfDictionary(xref);
            fileDictionary.update('Type', _PdfName.get('EmbeddedFile'));
            if (attachment._mimeType) {
                const encodedMime: string = attachment._mimeType.replace('/', '#2F');
                fileDictionary.update('Subtype', _PdfName.get(encodedMime));
            }
            const paramsDictionary: _PdfDictionary = new _PdfDictionary(xref);
            paramsDictionary.update('Size', rawBytes.length);
            if (attachment._creationDate) {
                paramsDictionary.update('CreationDate', _dateToString(attachment._creationDate));
            }
            if (attachment._modificationDate) {
                paramsDictionary.update('ModDate', _dateToString(attachment._modificationDate));
            }
            paramsDictionary._updated = true;
            fileDictionary.update('Params', paramsDictionary);
            fileStream.dictionary = fileDictionary;
            fileDictionary._updated = true;
            const streamRef: _PdfReference = xref._getNextReference();
            xref._cacheMap.set(streamRef, fileStream);
            const efDictionary: _PdfDictionary = new _PdfDictionary(xref);
            efDictionary.update('F', streamRef);
            efDictionary._updated = true;
            const fileSpecDictionary: _PdfDictionary = new _PdfDictionary(xref);
            fileSpecDictionary.update('Type', _PdfName.get('Filespec'));
            fileSpecDictionary.update('F', name);
            fileSpecDictionary.update('UF', name);
            fileSpecDictionary.update('EF', efDictionary);
            if (attachment._description) {
                fileSpecDictionary.update('Desc', attachment._description);
            }
            if (attachment._relationship !== PdfAttachmentRelationship.Unspecified) {
                fileSpecDictionary.update('AFRelationship', _PdfName.get(_relationshipToString(attachment._relationship)));
            }
            fileSpecDictionary._updated = true;
            const fileSpecRef: _PdfReference = xref._getNextReference();
            xref._cacheMap.set(fileSpecRef, fileSpecDictionary);
            const embeddedStreamRef: _EmbeddedFileStreamRef = new _EmbeddedFileStreamRef(xref, streamRef);
            attachment._embeddedFileRef = embeddedStreamRef;
            tuples.push([name, fileSpecRef, attachment]);
        }
        if (tuples.length === 0) {
            return;
        }
        tuples.sort((a: [string, _PdfReference, PdfAttachment], b: [string, _PdfReference, PdfAttachment]) =>
            a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
        );
        const sortedPairs: any[] = []; // eslint-disable-line
        for (const tuple of tuples) {
            sortedPairs.push(tuple[0], tuple[1]);
        }
        const efNamesDictionary: _PdfDictionary = new _PdfDictionary(xref);
        efNamesDictionary.update('Names', sortedPairs);
        efNamesDictionary._updated = true;
        const embeddedFilesRef: _PdfReference = xref._getNextReference();
        xref._cacheMap.set(
            embeddedFilesRef,
            efNamesDictionary
        );
        namesDictionary.update(
            'EmbeddedFiles',
            embeddedFilesRef
        );
        namesDictionary._updated = true;
        catalog._updated = true;
    }
}
/**
 * In-memory named embedded-file reference for newly added attachments before serialization.
 *
 * @private
 */
export class _NamedEmbeddedFileRef implements _PdfEmbeddedFileRef {
    _name: string;
    _rawBytes: Uint8Array;
    constructor(name: string, rawBytes: Uint8Array) {
        this._name = name;
        this._rawBytes = rawBytes;
    }
    /**
     * Returns a defensive copy of the in-memory embedded file bytes.
     *
     * @private
     * @returns {Uint8Array} The decoded embedded file bytes.
     */
    _getDecodedBytes(): Uint8Array {
        return new Uint8Array(this._rawBytes);
    }
}
