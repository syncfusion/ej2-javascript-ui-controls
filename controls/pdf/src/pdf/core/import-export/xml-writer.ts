import { _stringToBytes } from './../utils';
export type _XmlWriteState = 'Initial' | 'StartDocument' | 'EndDocument' | 'StartElement' | 'EndElement' | 'ElementContent';
export type _NamespaceKind = 'Written' | 'NeedToWrite' | 'Implied' | 'Special';
export class _XmlWriter {
    _bufferText: string;
    _buffer: Uint8Array;
    _currentState: _XmlWriteState;
    _namespaceStack: _Namespace[];
    _elementStack: _XmlElement[];
    _position: number = 0;
    _attributeStack: _XmlAttribute[];
    _skipNamespace: boolean;
    get buffer(): Uint8Array {
        this._flush();
        return this._buffer;
    }
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
    _writeEndElement(): void {
        if (this._currentState === 'StartElement') {
            this._startElementContent();
            this._currentState = 'ElementContent';
        } else if (this._currentState === 'ElementContent') {
            this._currentState = 'ElementContent';
        }
        this._currentState = 'EndElement';
        const top: number = this._elementStack.length - 1;
        this._writeEndElementInternal(this._elementStack[Number.parseInt(top.toString(), 10)]._prefix,
                                      this._elementStack[Number.parseInt(top.toString(), 10)]._localName);
        this._namespaceStack.splice(this._elementStack[Number.parseInt(top.toString(), 10)]._previousTop + 1);
        this._elementStack.splice(top);
        // if (this._bufferText.length > 10240) {
        //     this._flush();
        // }
    }
    _writeElementString(localName: string, value: string, prefix?: string, namespace?: string): void {
        this._writeStartElement(localName, prefix, namespace);
        if (typeof value !== 'undefined' && value !== null && value.length !== 0) {
            this._writeString(value);
        }
        this._writeEndElement();
    }
    _writeAttributeString(localName: string, value: string, prefix?: string, namespace?: string): void {
        this._writeStartAttribute(localName, value, prefix, namespace);
        this._writeStringInternal(value, true);
        this._writeEndAttribute();
    }
    _writeString(text: string): void {
        this._writeInternal(text, false);
    }
    _writeRaw(text: string): void {
        this._writeInternal(text, true);
    }
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
    _save(): Uint8Array {
        while (this._elementStack.length - 1 > 0) {
            this._writeEndElement();
        }
        if (this._bufferText !== '') {
            this._flush();
        }
        return this._buffer;
    }
    _destroy(): void {
        this._buffer = undefined;
        for (let i: number = 0; i < this._namespaceStack.length; i++) {
            this._namespaceStack[Number.parseInt(i.toString(), 10)]._destroy();
        }
        this._namespaceStack = [];
        for (let i: number = 0; i < this._elementStack.length; i++) {
            this._elementStack[Number.parseInt(i.toString(), 10)]._destroy();
        }
        this._elementStack = [];
        this._bufferText = '';
        this._position = 0;
    }
    _flush(): void {
        if (this._buffer && this._bufferText && this._bufferText !== '') {
            if (this._buffer.length > 0) {
                const buffer: Array<number> = new Array<number>(this._bufferText.length);
                for (let i: number = 0; i < this._bufferText.length; i++) {
                    buffer[Number.parseInt(i.toString(), 10)] = this._bufferText.charCodeAt(i) & 0xff;
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
    _writeEndAttribute(): void {
        this._currentState = 'StartElement';
        this._bufferText += '"';
    }
    _writeStartElementInternal(prefix: string, localName: string, namespace: string): void {
        this._bufferText += '<';
        if (prefix.length > 0) {
            this._rawText(prefix);
            this._bufferText += ':';
        }
        this._rawText(localName);
        const top: number = this._elementStack.length;
        this._elementStack.push(new _XmlElement());
        this._elementStack[Number.parseInt(top.toString(), 10)]._set(prefix, localName, namespace, this._namespaceStack.length - 1);
        this._pushNamespaceImplicit(prefix, namespace);
        for (let i: number = 0; i < this._attributeStack.length; i++) {
            this._attributeStack[Number.parseInt(i.toString(), 10)]._destroy();
        }
        this._attributeStack = [];
    }
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
    _writeStartAttributeInternal(prefix: string, localName: string): void {
        this._bufferText += ' ';
        if (typeof prefix !== 'undefined' && prefix !== null && prefix.length > 0) {
            this._rawText(prefix);
            this._bufferText += ':';
        }
        this._rawText(localName);
        this._bufferText += '="';
    }
    _writeNamespaceDeclaration(prefix: string, namespaceUri: string): void {
        if (!this._skipNamespace) {
            this._writeStartNamespaceDeclaration(prefix);
            this._writeStringInternal(namespaceUri, true);
            this._bufferText += '"';
        }
    }
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
    _writeStringInternal(text: string, inAttributeValue: boolean): void {
        if (typeof text === 'undefined' || text === null) {
            text = '';
        }
        text = text.replace(/\&/g, '&amp;'); // eslint-disable-line
        text = text.replace(/\</g, '&lt;'); // eslint-disable-line
        text = text.replace(/\>/g, '&gt;'); // eslint-disable-line
        if (inAttributeValue) {
            text = text.replace(/\"/g, '&quot;'); // eslint-disable-line
        }
        this._bufferText += text;
        if (!inAttributeValue) {
            this._position = 0;
        }
    }
    _startElementContent(): void {
        const start: number = this._elementStack[this._elementStack.length - 1]._previousTop;
        for (let i: number = this._namespaceStack.length - 1; i > start; i--) {
            if (this._namespaceStack[Number.parseInt(i.toString(), 10)]._kind === 'NeedToWrite') {
                this._writeNamespaceDeclaration(this._namespaceStack[Number.parseInt(i.toString(), 10)]._prefix,
                                                this._namespaceStack[Number.parseInt(i.toString(), 10)]._namespaceUri);
            }
        }
        this._bufferText += '>';
        this._position = this._bufferText.length + 1;
    }
    _rawText(text: string): void {
        this._bufferText += text;
    }
    _addNamespace(prefix: string, ns: string, kind: _NamespaceKind): void {
        const top: number = this._namespaceStack.length;
        this._namespaceStack.push(new _Namespace());
        this._namespaceStack[Number.parseInt(top.toString(), 10)]._set(prefix, ns, kind);
    }
    _lookupPrefix(namespace: string): string {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[Number.parseInt(i.toString(), 10)]._namespaceUri === namespace) {
                return this._namespaceStack[Number.parseInt(i.toString(), 10)]._prefix;
            }
        }
        return undefined;
    }
    _lookupNamespace(prefix: string): string {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[Number.parseInt(i.toString(), 10)]._prefix === prefix) {
                return this._namespaceStack[Number.parseInt(i.toString(), 10)]._namespaceUri;
            }
        }
        return undefined;
    }
    _lookupNamespaceIndex(prefix: string): number {
        for (let i: number = this._namespaceStack.length - 1; i >= 0; i--) {
            if (this._namespaceStack[Number.parseInt(i.toString(), 10)]._prefix === prefix) {
                return i;
            }
        }
        return -1;
    }
    _pushNamespaceImplicit(prefix: string, ns: string): void {
        let kind: _NamespaceKind;
        const existingNsIndex: number = this._lookupNamespaceIndex(prefix);
        let isValid: boolean = true;
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this._elementStack[this._elementStack.length - 1]._previousTop) {
                if (this._namespaceStack[Number.parseInt(existingNsIndex.toString(), 10)]._namespaceUri !== ns) {
                    throw new Error('XmlException namespace Uri needs to be the same as the one that is already declared');
                }
                isValid = false;
            } else {
                if (this._namespaceStack[Number.parseInt(existingNsIndex.toString(), 10)]._kind === 'Special') {
                    if (prefix === 'xml') {
                        if (ns !== this._namespaceStack[Number.parseInt(existingNsIndex.toString(), 10)]._namespaceUri) {
                            throw new Error('InvalidArgumentException: Xml String');
                        } else {
                            kind = 'Implied';
                        }
                    } else {
                        throw new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.');
                    }
                } else {
                    kind = (this._namespaceStack[Number.parseInt(existingNsIndex.toString(), 10)]._namespaceUri === ns) ?
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
    _pushNamespaceExplicit(prefix: string, ns: string): void {
        const existingNsIndex: number = this._lookupNamespaceIndex(prefix);
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this._elementStack[this._elementStack.length - 1]._previousTop) {
                this._namespaceStack[Number.parseInt(existingNsIndex.toString(), 10)]._kind = 'Written';
                return;
            }
        }
        this._addNamespace(prefix, ns, 'Written');
        return;
    }
    _addAttribute(prefix: string, localName: string, namespaceName: string): void {
        const top: number = this._attributeStack.length;
        this._attributeStack.push(new _XmlAttribute());
        this._attributeStack[Number.parseInt(top.toString(), 10)]._set(prefix, localName, namespaceName);
        for (let i: number = 0; i < top; i++) {
            if (this._attributeStack[Number.parseInt(i.toString(), 10)]._isDuplicate(prefix, localName, namespaceName)) {
                throw new Error('XmlException: duplicate attribute name');
            }
        }
    }
    _skipPushAndWrite(prefix: string, localName: string, namespace: string): void {
        this._addAttribute(prefix, localName, namespace);
        this._writeStartAttributeInternal(prefix, localName);
    }
    _checkName(text: string): void {
        const format: RegExp = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/; // eslint-disable-line
        if (format.test(text)) {
            throw new Error('InvalidArgumentException: invalid name character');
        }
    }
}
export class _Namespace {
    _prefix: string;
    _namespaceUri: string;
    _kind: _NamespaceKind;
    _set(prefix: string, namespaceUri: string, kind: _NamespaceKind): void {
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._kind = kind;
    }
    _destroy(): void {
        this._prefix = undefined;
        this._namespaceUri = undefined;
        this._kind = undefined;
    }
}
export class _XmlElement {
    _previousTop: number;
    _prefix: string;
    _localName: string;
    _namespaceUri: string;
    _set(prefix: string, localName: string, namespaceUri: string, previousTop: number): void {
        this._previousTop = previousTop;
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._localName = localName;
    }
    _destroy(): void {
        this._previousTop = undefined;
        this._prefix = undefined;
        this._localName = undefined;
        this._namespaceUri = undefined;
    }
}
export class _XmlAttribute {
    _prefix: string;
    _namespaceUri: string;
    _localName: string;
    _set(prefix: string, localName: string, namespaceUri: string): void {
        this._prefix = prefix;
        this._namespaceUri = namespaceUri;
        this._localName = localName;
    }
    _isDuplicate(prefix: string, localName: string, namespaceUri: string): boolean {
        return ((this._localName === localName) && ((this._prefix === prefix) || (this._namespaceUri === namespaceUri)));
    }
    _destroy(): void {
        this._prefix = undefined;
        this._namespaceUri = undefined;
        this._localName = undefined;
    }
}
