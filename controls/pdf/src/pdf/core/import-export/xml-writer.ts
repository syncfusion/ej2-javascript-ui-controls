import { _stringToBytes } from './../utils';
export type _XmlWriteState = 'Initial' | 'StartDocument' | 'EndDocument' | 'StartElement' | 'EndElement' | 'ElementContent';
export type _NamespaceKind = 'Written' | 'NeedToWrite' | 'Implied' | 'Special';
/**
 * Provides XML writing functionality for generating well formed XML documents with support for
 * namespaces, elements, attributes, and text content.
 *
 * @private
 */
export class _XmlWriter {
    /**
     * Internal text buffer that accumulates XML before flushing to bytes.
     *
     * @private
     * @type {string}
     */
    _bufferText: string;
    /**
     * Internal byte buffer containing the serialized XML document.
     *
     * @private
     * @type {Uint8Array}
     */
    _buffer: Uint8Array;
    /**
     * Current writer state used to validate write operations.
     *
     * @private
     * @type {_XmlWriteState}
     */
    _currentState: _XmlWriteState;
    /**
     * Stack of namespace records used while writing elements and attributes.
     *
     * @private
     * @type {_Namespace[]}
     */
    _namespaceStack: _Namespace[];
    /**
     * Stack of open XML elements.
     *
     * @private
     * @type {_XmlElement[]}
     */
    _elementStack: _XmlElement[];
    /**
     * Position marker used for compact empty element detection.
     *
     * @private
     * @type {number}
     */
    _position: number = 0;
    /**
     * Currently collected attributes for the active element.
     *
     * @private
     * @type {_XmlAttribute[]}
     */
    _attributeStack: _XmlAttribute[];
    /**
     * Flag to skip writing namespace declarations (appearance mode).
     *
     * @private
     * @type {boolean}
     */
    _skipNamespace: boolean;
    /**
     * Gets the serialized XML buffer containing all written content.
     *
     * @private
     * @returns {Uint8Array} The complete XML document as a byte array.
     */
    get buffer(): Uint8Array {
        this._flush();
        return this._buffer;
    }
    /**
     * Initializes a new instance of the _XmlWriter class with optional appearance mode.
     *
     * @private
     * @param {boolean} [isAppearance=false] Whether to initialize in appearance mode, skipping namespace handling.
     * @returns {void}
     */
    constructor(isAppearance: boolean = false) {
        this._bufferText = '';
        this._buffer = new Uint8Array(0);
        this._namespaceStack = [];
        this._elementStack = [];
        if (!isAppearance) {
            this._currentState = 'Initial';
            this._namespaceStack.push(new _Namespace());
            this._elementStack.push(new _XmlElement());
            this._namespaceStack[0]._set('xmlns', 'http://www.w3.org/2000/xmlns/', 'Special');
            this._namespaceStack.push(new _Namespace());
            this._namespaceStack[1]._set('xml', 'http://www.w3.org/XML/1998/namespace', 'Special');
            this._namespaceStack.push(new _Namespace());
            this._namespaceStack[2]._set('', '', 'Implied');
            this._elementStack[0]._set('', '', '', this._namespaceStack.length - 1);
        } else {
            this._currentState = 'StartDocument';
            this._skipNamespace = true;
        }
        this._attributeStack = [];
    }
    /**
     * Writes the XML document declaration to the output buffer.
     *
     * @private
     * @param {boolean} [standalone] Optional flag indicating if the document is standalone.
     * @returns {void}
     * @throws {Error} Throws an error if called in an invalid state or if the buffer is undefined.
     */
    _writeStartDocument(standalone?: boolean): void {
        if (this._currentState !== 'Initial' || typeof this._buffer === 'undefined') {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        this._currentState = 'StartDocument';
        this._rawText('<?xml version="1.0" encoding="utf-8');
        if (typeof standalone !== 'undefined' && standalone !== null) {
            this._rawText('" standalone="');
            this._rawText(standalone ? 'yes' : 'no');
        }
        this._rawText('"?>');
    }
    /**
     * Writes the start tag of an XML element with optional prefix and namespace.
     *
     * @private
     * @param {string} localName The local name of the element to write.
     * @param {string} [prefix] Optional namespace prefix for the element.
     * @param {string} [namespace] Optional namespace URI for the element.
     * @returns {void}
     * @throws {Error} Throws an error if localName is invalid, undefined, null, or empty.
     */
    _writeStartElement(localName: string, prefix?: string, namespace?: string): void {
        if (typeof this._buffer === 'undefined') {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        if (typeof localName === 'undefined' || localName === null || localName.length === 0) {
            throw new Error('ArgumentException: localName cannot be undefined, null or empty');
        }
        this._checkName(localName);
        if (this._currentState === 'Initial') {
            this._writeStartDocument();
        }
        if (this._currentState === 'StartElement') {
            this._startElementContent();
        }
        this._currentState = 'StartElement';
        if (typeof prefix === 'undefined' || prefix === null) {
            if (typeof namespace !== 'undefined' && namespace !== null) {
                prefix = this._lookupPrefix(namespace);
            }
            if (typeof prefix === 'undefined' || prefix === null) {
                prefix = '';
            }
        } else if (prefix.length > 0) {
            if (typeof namespace === 'undefined' || namespace === null) {
                namespace = this._lookupNamespace(prefix);
            }
            if (typeof namespace === 'undefined' || namespace === null || (typeof namespace !== 'undefined' && namespace.length === 0)) {
                throw new Error('ArgumentException: Cannot use a prefix with an empty namespace');
            }
        }
        if (typeof namespace === 'undefined' || namespace === null) {
            namespace = this._lookupNamespace(prefix);
        }
        this._writeStartElementInternal(prefix, localName, namespace);
    }
    /**
     * Writes the end tag of the current XML element and closes it.
     *
     * @private
     * @returns {void}
     */
    _writeEndElement(): void {
        if (this._currentState === 'StartElement') {
            this._startElementContent();
            this._currentState = 'ElementContent';
        } else if (this._currentState === 'ElementContent') {
            this._currentState = 'ElementContent';
        }
        this._currentState = 'EndElement';
        const top: number = this._elementStack.length - 1;
        this._writeEndElementInternal(this._elementStack[<number>top]._prefix,
                                      this._elementStack[<number>top]._localName);
        this._namespaceStack.splice(this._elementStack[<number>top]._previousTop + 1);
        this._elementStack.splice(top);
        // if (this._bufferText.length > 10240) {
        //     this._flush();
        // }
    }
    /**
     * Writes an XML element with text content in a single operation.
     *
     * @private
     * @param {string} localName The local name of the element.
     * @param {string} value The text content of the element.
     * @param {string} [prefix] Optional namespace prefix for the element.
     * @param {string} [namespace] Optional namespace URI for the element.
     * @returns {void}
     */
    _writeElementString(localName: string, value: string, prefix?: string, namespace?: string): void {
        this._writeStartElement(localName, prefix, namespace);
        if (typeof value !== 'undefined' && value !== null && value.length !== 0) {
            this._writeString(value);
        }
        this._writeEndElement();
    }
    /**
     * Writes an XML attribute with the specified name and value.
     *
     * @private
     * @param {string} localName The local name of the attribute.
     * @param {string} value The value of the attribute.
     * @param {string} [prefix] Optional namespace prefix for the attribute.
     * @param {string} [namespace] Optional namespace URI for the attribute.
     * @returns {void}
     */
    _writeAttributeString(localName: string, value: string, prefix?: string, namespace?: string): void {
        this._writeStartAttribute(localName, value, prefix, namespace);
        this._writeStringInternal(value, true);
        this._writeEndAttribute();
    }
    /**
     * Writes text content to the current XML element.
     *
     * @private
     * @param {string} text The text content to write.
     * @returns {void}
     */
    _writeString(text: string): void {
        this._writeInternal(text, false);
    }
    /**
     * Writes raw XML text without escaping special characters.
     *
     * @private
     * @param {string} text The raw XML text to write.
     * @returns {void}
     */
    _writeRaw(text: string): void {
        this._writeInternal(text, true);
    }
    /**
     * Writes text to the current XML element with optional raw string mode.
     *
     * @private
     * @param {string} text The text to write.
     * @param {boolean} isRawString Whether to write as raw text without escaping special characters.
     * @returns {void}
     * @throws {Error} Throws an error if called in an invalid state.
     */
    _writeInternal(text: string, isRawString: boolean): void {
        if (text !== null && typeof text !== 'undefined') {
            if (this._currentState !== 'StartElement' && this._currentState !== 'ElementContent') {
                throw new Error('InvalidOperationException: Wrong Token');
            }
            if (this._currentState === 'StartElement') {
                this._startElementContent();
            }
            this._currentState = 'ElementContent';
            if (isRawString) {
                this._rawText(text);
            } else {
                this._writeStringInternal(text, false);
            }
        }
    }
    /**
     * Saves the XML document and returns the complete serialized byte array.
     *
     * @private
     * @returns {Uint8Array} The complete XML document as a byte array.
     */
    _save(): Uint8Array {
        while (this._elementStack.length - 1 > 0) {
            this._writeEndElement();
        }
        if (this._bufferText !== '') {
            this._flush();
        }
        return this._buffer;
    }
    /**
     * Destroys the XML writer and cleans up all internal resources.
     *
     * @private
     * @returns {void}
     */
    _destroy(): void {
        this._buffer = undefined;
        for (let i: number = 0; i < this._namespaceStack.length; i++) {
            this._namespaceStack[<number>i]._destroy();
        }
        this._namespaceStack = [];
        for (let i: number = 0; i < this._elementStack.length; i++) {
            this._elementStack[<number>i]._destroy();
        }
        this._elementStack = [];
        this._bufferText = '';
        this._position = 0;
    }
    /**
     * Flushes the internal text buffer to the byte array buffer.
     *
     * @private
     * @returns {void}
     */
    _flush(): void {
        if (this._buffer && this._bufferText && this._bufferText !== '') {
            if (this._buffer.length > 0) {
                const buffer: Array<number> = new Array<number>(this._bufferText.length);
                for (let i: number = 0; i < this._bufferText.length; i++) {
                    buffer[<number>i] = this._bufferText.charCodeAt(i) & 0xff;
                }
                const array: Uint8Array = new Uint8Array(this._buffer.length + buffer.length);
                array.set(this._buffer);
                array.set(buffer, this._buffer.length);
                this._buffer = array;
            } else {
                this._buffer = _stringToBytes(this._bufferText) as Uint8Array;
            }
            this._bufferText = '';
        }
    }
    /**
     * Writes the start of an XML attribute with validation.
     *
     * @private
     * @param {string} localName The local name of the attribute.
     * @param {string} value The value of the attribute.
     * @param {string} prefix The namespace prefix for the attribute.
     * @param {string} namespace The namespace URI for the attribute.
     * @returns {void}
     * @throws {Error} Throws an error if the localName is invalid or if not in the correct state.
     */
    _writeStartAttribute(localName: string, value: string, prefix: string, namespace: string): void {
        if (typeof localName === 'undefined' || localName === null || localName.length === 0) {
            if (prefix === 'xmlns') {
                localName = 'xmlns';
                prefix = '';
            } else {
                throw new Error('ArgumentException: localName cannot be undefined, null or empty');
            }
        }
        if (this._currentState !== 'StartElement') {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        this._checkName(localName);
        this._writeStartAttributePrefixAndNameSpace(localName, value, prefix, namespace);
    }
    /**
     * Writes the start of an XML attribute with prefix and namespace resolution.
     *
     * @private
     * @param {string} localName The local name of the attribute.
     * @param {string} value The value of the attribute.
     * @param {string} [prefix] Optional namespace prefix for the attribute.
     * @param {string} [namespace] Optional namespace URI for the attribute.
     * @returns {void}
     */
    _writeStartAttributePrefixAndNameSpace(localName: string, value: string, prefix?: string, namespace?: string): void {
        if (typeof prefix === 'undefined' || prefix === null) {
            if (typeof namespace !== 'undefined' && namespace !== null) {
                if (!(localName === 'xmlns' && namespace === 'http://www.w3.org/2000/xmlns/')) {
                    prefix = this._lookupPrefix(namespace);
                }
            }
            if (typeof prefix === 'undefined' || prefix === null) {
                prefix = '';
            }
        }
        if (typeof namespace === 'undefined' || namespace === null) {
            if (typeof prefix !== 'undefined' && prefix !== null && prefix.length > 0) {
                namespace = this._lookupNamespace(prefix);
            }
            if (typeof namespace === 'undefined' || namespace === null) {
                namespace = '';
            }
        }
        this._writeStartAttributeSpecialAttribute(prefix, localName, namespace, value);
    }
    /**
     * Writes the start of an XML attribute with special attribute handling.
     *
     * @private
     * @param {string} prefix The namespace prefix for the attribute.
     * @param {string} localName The local name of the attribute.
     * @param {string} namespace The namespace URI for the attribute.
     * @param {string} value The value of the attribute.
     * @returns {void}
     * @throws {Error} Throws an error for invalid namespace declarations or special attributes.
     */
    _writeStartAttributeSpecialAttribute(prefix: string, localName: string, namespace: string, value: string): void {
        if (prefix.length === 0) {
            if (localName[0] === 'x' && localName === 'xmlns') {
                this._skipPushAndWrite(prefix, localName, namespace);
                this._pushNamespaceExplicit('', value);
                return;
            } else if (namespace.length > 0) {
                prefix = this._lookupPrefix(namespace);
            }
        } else {
            if (prefix[0] === 'x') {
                if (prefix === 'xmlns') {
                    this._skipPushAndWrite(prefix, localName, namespace);
                    this._pushNamespaceExplicit(localName, value);
                    return;
                } else if (prefix === 'xml') {
                    if (localName === 'space' || localName === 'lang') {
                        this._skipPushAndWrite(prefix, localName, namespace);
                        return;
                    }
                }
            }
            if (namespace.length === 0) {
                prefix = '';
            }
        }
        if (typeof prefix !== 'undefined' && prefix !== null && prefix.length !== 0) {
            this._pushNamespaceImplicit(prefix, namespace);
        }
        this._skipPushAndWrite(prefix, localName, namespace);
    }
    /**
     * Writes the end of an XML attribute.
     *
     * @private
     * @returns {void}
     */
    _writeEndAttribute(): void {
        this._currentState = 'StartElement';
        this._bufferText += '"';
    }
    /**
     * Internally writes the start tag of an XML element and manages namespace stack.
     *
     * @private
     * @param {string} prefix The namespace prefix for the element.
     * @param {string} localName The local name of the element.
     * @param {string} namespace The namespace URI for the element.
     * @returns {void}
     */
    _writeStartElementInternal(prefix: string, localName: string, namespace: string): void {
        this._bufferText += '<';
        if (prefix.length > 0) {
            this._rawText(prefix);
            this._bufferText += ':';
        }
        this._rawText(localName);
        const top: number = this._elementStack.length;
        this._elementStack.push(new _XmlElement());
        this._elementStack[<number>top]._set(prefix, localName, namespace, this._namespaceStack.length - 1);
        this._pushNamespaceImplicit(prefix, namespace);
        for (let i: number = 0; i < this._attributeStack.length; i++) {
            this._attributeStack[<number>i]._destroy();
        }
        this._attributeStack = [];
    }
    /**
     * Internally writes the end tag of an XML element.
     *
     * @private
     * @param {string} prefix The namespace prefix of the element being closed.
     * @param {string} localName The local name of the element being closed.
     * @returns {void}
     */
    _writeEndElementInternal(prefix: string, localName: string): void {
        if (this._position !== this._bufferText.length + 1) {
            this._bufferText += '</';
            if (typeof prefix !== 'undefined' && prefix !== null && prefix.length !== 0) {
                this._rawText(prefix);
                this._bufferText += ':';
            }
            this._rawText(localName);
            this._bufferText += '>';
        } else {
            this._bufferText = this._bufferText.substring(0, this._bufferText.length - 1);
            this._bufferText += ' />';
        }
    }
    /**
     * Internally writes the start of an XML attribute.
     *
     * @private
     * @param {string} prefix The namespace prefix for the attribute.
     * @param {string} localName The local name of the attribute.
     * @returns {void}
     */
    _writeStartAttributeInternal(prefix: string, localName: string): void {
        this._bufferText += ' ';
        if (typeof prefix !== 'undefined' && prefix !== null && prefix.length > 0) {
            this._rawText(prefix);
            this._bufferText += ':';
        }
        this._rawText(localName);
        this._bufferText += '="';
    }
    /**
     * Writes an XML namespace declaration.
     *
     * @private
     * @param {string} prefix The namespace prefix to declare.
     * @param {string} namespaceUri The namespace URI for the declaration.
     * @returns {void}
     */
    _writeNamespaceDeclaration(prefix: string, namespaceUri: string): void {
        if (!this._skipNamespace) {
            this._writeStartNamespaceDeclaration(prefix);
            this._writeStringInternal(namespaceUri, true);
            this._bufferText += '"';
        }
    }
    /**
     * Writes the start of an XML namespace declaration.
     *
     * @private
     * @param {string} prefix The namespace prefix to declare.
     * @returns {void}
     */
    _writeStartNamespaceDeclaration(prefix: string): void {
        if (typeof prefix === 'undefined' || prefix === null || prefix.length === 0) {
            this._rawText(' xmlns="');
        } else {
            this._rawText(' xmlns:');
            this._rawText(prefix);
            this._bufferText += '=';
            this._bufferText += '"';
        }
    }
    /**
     * Internally writes text with proper XML character escaping.
     *
     * @private
     * @param {string} text The text to write.
     * @param {boolean} inAttributeValue Whether the text is being written as an attribute value.
     * @returns {void}
     */
    _writeStringInternal(text: string, inAttributeValue: boolean): void {
        if (typeof text === 'undefined' || text === null) {
            text = '';
        }
        text = text.replace(/\&/g, '&amp;'); // eslint-disable-line
        text = text.replace(/\</g, '&lt;'); // eslint-disable-line
        text = text.replace(/\>/g, '&gt;'); // eslint-disable-line
        text = text.replace(/\u0000/g, ''); // eslint-disable-line
        if (inAttributeValue) {
            text = text.replace(/\"/g, '&quot;'); // eslint-disable-line
        }
        this._bufferText += text;
        if (!inAttributeValue) {
            this._position = 0;
        }
    }
    /**
     * Internally handles the start of element content and writes pending namespace declarations.
     *
     * @private
     * @returns {void}
     */
    _startElementContent(): void {
        const start: number = this._elementStack[this._elementStack.length - 1]._previousTop;
        for (let i: number = this._namespaceStack.length - 1; i > start; i--) {
            if (this._namespaceStack[<number>i]._kind === 'NeedToWrite') {
                this._writeNamespaceDeclaration(this._namespaceStack[<number>i]._prefix,
                                                this._namespaceStack[<number>i]._namespaceUri);
            }
        }
        this._bufferText += '>';
        this._position = this._bufferText.length + 1;
    }
    /**
     * Writes raw text directly to the buffer without any processing.
     *
     * @private
     * @param {string} text The raw text to write.
     * @returns {void}
     */
    _rawText(text: string): void {
        this._bufferText += text;
    }
    /**
     * Adds a namespace entry to the internal namespace stack.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @param {_NamespaceKind} kind The classification of the namespace entry.
     * @returns {void}
     */
    _addNamespace(prefix: string, ns: string, kind: _NamespaceKind): void {
        const top: number = this._namespaceStack.length;
        this._namespaceStack.push(new _Namespace());
        this._namespaceStack[<number>top]._set(prefix, ns, kind);
    }
    /**
     * Looks up the prefix associated with a namespace URI.
     *
     * @private
     * @param {string} namespace The namespace URI to find a prefix for.
     * @returns {string} The prefix if found, otherwise undefined.
     */
    _lookupPrefix(namespace: string): string {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[<number>i]._namespaceUri === namespace) {
                return this._namespaceStack[<number>i]._prefix;
            }
        }
        return undefined;
    }
    /**
     * Looks up the namespace URI associated with a prefix.
     *
     * @private
     * @param {string} prefix The prefix to look up.
     * @returns {string} The namespace URI if found, otherwise undefined.
     */
    _lookupNamespace(prefix: string): string {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[<number>i]._prefix === prefix) {
                return this._namespaceStack[<number>i]._namespaceUri;
            }
        }
        return undefined;
    }
    /**
     * Looks up the index of a namespace entry in the namespace stack.
     *
     * @private
     * @param {string} prefix The namespace prefix to find.
     * @returns {number} The index of the namespace in the stack or -1 when not found.
     */
    _lookupNamespaceIndex(prefix: string): number {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[<number>i]._prefix === prefix) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Pushes an implicit namespace declaration to the stack, validating conflicts.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @returns {void}
     * @throws {Error} When invalid namespace configurations are detected.
     */
    _pushNamespaceImplicit(prefix: string, ns: string): void {
        let kind: _NamespaceKind;
        const existingNsIndex: number = this._lookupNamespaceIndex(prefix);
        let isValid: boolean = true;
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this._elementStack[this._elementStack.length - 1]._previousTop) {
                if (this._namespaceStack[<number>existingNsIndex]._namespaceUri !== ns) {
                    throw new Error('XmlException namespace Uri needs to be the same as the one that is already declared');
                }
                isValid = false;
            } else {
                if (this._namespaceStack[<number>existingNsIndex]._kind === 'Special') {
                    if (prefix === 'xml') {
                        if (ns !== this._namespaceStack[<number>existingNsIndex]._namespaceUri) {
                            throw new Error('InvalidArgumentException: Xml String');
                        } else {
                            kind = 'Implied';
                        }
                    } else {
                        throw new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.');
                    }
                } else {
                    kind = (this._namespaceStack[<number>existingNsIndex]._namespaceUri === ns) ?
                        'Implied' :
                        'NeedToWrite';
                }
            }
        } else {
            if ((ns === 'http://www.w3.org/XML/1998/namespace' && prefix !== 'xml') ||
                (ns === 'http://www.w3.org/2000/xmlns/' && prefix !== 'xmlns')) {
                throw new Error('InvalidArgumentException');
            }
            kind = 'NeedToWrite';
        }
        if (isValid) {
            this._addNamespace(prefix, ns, kind);
        }
    }
    /**
     * Pushes an explicit namespace declaration to the stack.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @returns {void}
     */
    _pushNamespaceExplicit(prefix: string, ns: string): void {
        const existingNsIndex: number = this._lookupNamespaceIndex(prefix);
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this._elementStack[this._elementStack.length - 1]._previousTop) {
                this._namespaceStack[<number>existingNsIndex]._kind = 'Written';
                return;
            }
        }
        this._addNamespace(prefix, ns, 'Written');
        return;
    }
    /**
     * Adds an attribute record to the current attribute stack and checks for duplicates.
     *
     * @private
     * @param {string} prefix The attribute namespace prefix.
     * @param {string} localName The attribute local name.
     * @param {string} namespaceName The attribute namespace URI.
     * @returns {void}
     * @throws {Error} When a duplicate attribute name is detected.
     */
    _addAttribute(prefix: string, localName: string, namespaceName: string): void {
        const top: number = this._attributeStack.length;
        this._attributeStack.push(new _XmlAttribute());
        this._attributeStack[<number>top]._set(prefix, localName, namespaceName);
        for (let i: number = 0; i < top; i++) {
            if (this._attributeStack[<number>i]._isDuplicate(prefix, localName, namespaceName)) {
                throw new Error('XmlException: duplicate attribute name');
            }
        }
    }
    /**
     * Adds attribute metadata and writes its start without pushing a namespace entry.
     *
     * @private
     * @param {string} prefix The attribute prefix.
     * @param {string} localName The attribute local name.
     * @param {string} namespace The attribute namespace URI.
     * @returns {void}
     */
    _skipPushAndWrite(prefix: string, localName: string, namespace: string): void {
        this._addAttribute(prefix, localName, namespace);
        this._writeStartAttributeInternal(prefix, localName);
    }
    /**
     * Validates an XML name for invalid characters and throws on failure.
     *
     * @private
     * @param {string} text The name to validate.
     * @returns {void}
     * @throws {Error} When the name contains invalid characters.
     */
    _checkName(text: string): void {
        const format: RegExp = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/; // eslint-disable-line
        if (format.test(text)) {
            throw new Error('InvalidArgumentException: invalid name character');
        }
    }
}
/**
 * Represents an internal namespace entry used by the XML writer.
 *
 * @private
 */
export class _Namespace {
    /**
     * Namespace prefix.
     *
     * @private
     * @type {string}
     */
    _prefix: string;
    /**
     * Namespace URI.
     *
     * @private
     * @type {string}
     */
    _namespaceUri: string;
    /**
     * Classification of the namespace entry.
     *
     * @private
     * @type {_NamespaceKind}
     */
    _kind: _NamespaceKind;
    /**
     * Sets namespace properties.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} namespaceUri The namespace URI.
     * @param {_NamespaceKind} kind The namespace kind.
     * @returns {void}
     */
    _set(prefix: string, namespaceUri: string, kind: _NamespaceKind): void {
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._kind = kind;
    }
    /**
     * Destroys the namespace entry and clears references.
     *
     * @private
     * @returns {void}
     */
    _destroy(): void {
        this._prefix = undefined;
        this._namespaceUri = undefined;
        this._kind = undefined;
    }
}
/**
 * Represents an internal XML element frame used while writing nested elements.
 *
 * @private
 */
export class _XmlElement {
    /**
     * Previous top index of the namespace stack at the time the element was opened.
     *
     * @private
     * @type {number}
     */
    _previousTop: number;
    /**
     * The element's namespace prefix.
     *
     * @private
     * @type {string}
     */
    _prefix: string;
    /**
     * The element's local name.
     *
     * @private
     * @type {string}
     */
    _localName: string;
    /**
     * The element's namespace URI.
     *
     * @private
     * @type {string}
     */
    _namespaceUri: string;
    /**
     * Sets properties for the element frame.
     *
     * @private
     * @param {string} prefix Element prefix.
     * @param {string} localName Element local name.
     * @param {string} namespaceUri Element namespace URI.
     * @param {number} previousTop Previous namespace stack top index.
     * @returns {void}
     */
    _set(prefix: string, localName: string, namespaceUri: string, previousTop: number): void {
        this._previousTop = previousTop;
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._localName = localName;
    }
    /**
     * Destroys the element frame and clears references.
     *
     * @private
     * @returns {void}
     */
    _destroy(): void {
        this._previousTop = undefined;
        this._prefix = undefined;
        this._localName = undefined;
        this._namespaceUri = undefined;
    }
}
/**
 * Represents an internal XML attribute record.
 *
 * @private
 */
export class _XmlAttribute {
    /**
     * The attribute namespace prefix.
     *
     * @private
     * @type {string}
     */
    _prefix: string;
    /**
     * The attribute namespace URI.
     *
     * @private
     * @type {string}
     */
    _namespaceUri: string;
    /**
     * The attribute local name.
     *
     * @private
     * @type {string}
     */
    _localName: string;
    /**
     * Sets attribute properties.
     *
     * @private
     * @param {string} prefix The attribute prefix.
     * @param {string} localName The attribute local name.
     * @param {string} namespaceUri The attribute namespace URI.
     * @returns {void}
     */
    _set(prefix: string, localName: string, namespaceUri: string): void {
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._localName = localName;
    }
    /**
     * Checks whether this attribute would be a duplicate of another attribute.
     *
     * @private
     * @param {string} prefix Prefix to compare.
     * @param {string} localName Local name to compare.
     * @param {string} namespaceUri Namespace URI to compare.
     * @returns {boolean} True if duplicate; otherwise false.
     */
    _isDuplicate(prefix: string, localName: string, namespaceUri: string): boolean {
        return ((this._localName === localName) && ((this._prefix === prefix) || (this._namespaceUri === namespaceUri)));
    }
    /**
     * Destroys the attribute record and clears references.
     *
     * @private
     * @returns {void}
     */
    _destroy(): void {
        this._prefix = undefined;
        this._namespaceUri = undefined;
        this._localName = undefined;
    }
}
