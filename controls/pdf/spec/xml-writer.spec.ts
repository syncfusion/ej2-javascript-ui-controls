import { _Namespace, _NamespaceKind, _XmlAttribute, _XmlElement, _XmlWriter } from '../src/pdf/core/import-export/xml-writer';
function getXmlText(writer: _XmlWriter): string {
    return String.fromCharCode.apply(null, Array.from(writer.buffer));
}
function getSavedXmlText(writer: _XmlWriter): string {
    return String.fromCharCode.apply(null, Array.from(writer._save()));
}
describe('XmlWriter mutation survivor coverage', () => {
    describe('constructor and buffer', () => {
        it('initializes the normal writer with predefined namespace and element frames', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const namespaceCount: number = writer._namespaceStack.length;
            const elementCount: number = writer._elementStack.length;
            // Assert
            expect(writer._currentState).toBe('Initial');
            expect(writer._bufferText).toBe('');
            expect(writer._buffer.length).toBe(0);
            expect(namespaceCount).toBe(3);
            expect(elementCount).toBe(1);
            expect(writer._namespaceStack[0]._prefix).toBe('xmlns');
            expect(writer._namespaceStack[0]._namespaceUri).toBe('http://www.w3.org/2000/xmlns/');
            expect(writer._namespaceStack[0]._kind).toBe('Special');
            expect(writer._namespaceStack[1]._prefix).toBe('xml');
            expect(writer._namespaceStack[1]._namespaceUri).toBe('http://www.w3.org/XML/1998/namespace');
            expect(writer._namespaceStack[1]._kind).toBe('Special');
            expect(writer._namespaceStack[2]._prefix).toBe('');
            expect(writer._namespaceStack[2]._namespaceUri).toBe('');
            expect(writer._namespaceStack[2]._kind).toBe('Implied');
            expect(writer._elementStack[0]._previousTop).toBe(2);
            expect(writer._attributeStack.length).toBe(0);
        });
        it('initializes appearance writer without predefined namespace frames', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(true);
            // Act
            const namespaceCount: number = writer._namespaceStack.length;
            // Assert
            expect(writer._currentState).toBe('StartDocument');
            expect(writer._skipNamespace).toBeTruthy();
            expect(namespaceCount).toBe(0);
            expect(writer._elementStack.length).toBe(0);
            expect(writer._attributeStack.length).toBe(0);
        });
        it('flushes pending text when buffer getter is read', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._bufferText = 'ABC';
            // Act
            const buffer: Uint8Array = writer.buffer;
            // Assert
            expect(Array.from(buffer)).toEqual([65, 66, 67]);
            expect(writer._bufferText).toBe('');
        });
    });
    describe('_writeStartDocument', () => {
        it('writes the declaration and changes state', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            writer._writeStartDocument(false);
            // Assert
            expect(writer._currentState).toBe('StartDocument');
            expect(writer._bufferText).toContain('<?xml');
            expect(writer._bufferText).toContain('version="1.0"');
            expect(writer._bufferText).toContain('encoding="utf-8"');
            expect(writer._bufferText).toContain('standalone="no"');
        });
        it('writes standalone yes only for true', () => {
            // Arrange
            const trueWriter: _XmlWriter = new _XmlWriter(false);
            const undefinedWriter: _XmlWriter = new _XmlWriter(false);
            // Act
            trueWriter._writeStartDocument(true);
            undefinedWriter._writeStartDocument();
            // Assert
            expect(trueWriter._bufferText).toContain('standalone="yes"');
            expect(undefinedWriter._bufferText).not.toContain('standalone=');
        });
        it('throws the exact error outside Initial state', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._currentState = 'StartDocument';
            // Act
            const action: () => void = (): void => writer._writeStartDocument();
            // Assert
            expect(action).toThrowError('InvalidOperationException: Wrong Token');
        });
        it('throws when the byte buffer is undefined', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._buffer = undefined;
            // Act
            const action: () => void = (): void => writer._writeStartDocument();
            // Assert
            expect(action).toThrowError('InvalidOperationException: Wrong Token');
        });
    });
    describe('_writeStartElement and _writeEndElement', () => {
        it('rejects undefined null and empty local names with the exact error', () => {
            // Arrange
            const undefinedWriter: _XmlWriter = new _XmlWriter(false);
            const nullWriter: _XmlWriter = new _XmlWriter(false);
            const emptyWriter: _XmlWriter = new _XmlWriter(false);
            // Act
            const undefinedAction: () => void = (): void => undefinedWriter._writeStartElement(undefined as unknown as string);
            const nullAction: () => void = (): void => nullWriter._writeStartElement(null as unknown as string);
            const emptyAction: () => void = (): void => emptyWriter._writeStartElement('');
            // Assert
            expect(undefinedAction).toThrowError('ArgumentException: localName cannot be undefined, null or empty');
            expect(nullAction).toThrowError('ArgumentException: localName cannot be undefined, null or empty');
            expect(emptyAction).toThrowError('ArgumentException: localName cannot be undefined, null or empty');
        });
        it('starts the document automatically from Initial and writes an unprefixed element', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            writer._writeStartElement('root');
            // Assert
            expect(writer._currentState).toBe('StartElement');
            expect(writer._bufferText).toContain('<?xml');
            expect(writer._bufferText).toContain('<root');
            expect(writer._elementStack.length).toBe(2);
            expect(writer._elementStack[1]._localName).toBe('root');
            expect(writer._elementStack[1]._prefix).toBe('');
        });
        it('closes pending parent content before starting a child', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('parent');
            // Act
            writer._writeStartElement('child');
            // Assert
            expect(writer._bufferText).toContain('<parent><child');
            expect(writer._elementStack.length).toBe(3);
        });
        it('writes a prefixed element and its namespace declaration', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            writer._writeStartElement('node', 'p', 'urn:test');
            writer._writeEndElement();
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('<p:node');
            expect(xml).toContain('xmlns:p="urn:test"');
            expect(xml).toContain('/>');
        });
        it('rejects a nonempty prefix with undefined null and empty namespace', () => {
            // Arrange
            const undefinedWriter: _XmlWriter = new _XmlWriter(false);
            const nullWriter: _XmlWriter = new _XmlWriter(false);
            const emptyWriter: _XmlWriter = new _XmlWriter(false);
            // Act
            const undefinedAction: () => void = (): void => undefinedWriter._writeStartElement('node', 'p', undefined);
            const nullAction: () => void = (): void => nullWriter._writeStartElement('node', 'p', null as unknown as string);
            const emptyAction: () => void = (): void => emptyWriter._writeStartElement('node', 'p', '');
            // Assert
            expect(undefinedAction).toThrowError('ArgumentException: Cannot use a prefix with an empty namespace');
            expect(nullAction).toThrowError('ArgumentException: Cannot use a prefix with an empty namespace');
            expect(emptyAction).toThrowError('ArgumentException: Cannot use a prefix with an empty namespace');
        });
        it('uses a compact empty-element ending for an element without content', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('empty');
            // Act
            writer._writeEndElement();
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('<empty />');
            expect(xml).not.toContain('</empty>');
            expect(writer._currentState).toBe('EndElement');
        });
        it('writes a full closing tag for element content and restores stack sizes', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            writer._writeString('value');
            // Act
            writer._writeEndElement();
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('<root>value</root>');
            expect(writer._elementStack.length).toBe(1);
            expect(writer._namespaceStack.length).toBe(3);
        });
    });
    describe('element and text writing', () => {
        it('writes nonempty element-string content', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            writer._writeElementString('node', 'value');
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('<node>value</node>');
        });
        it('does not write content for undefined null or empty element-string values', () => {
            // Arrange
            const undefinedWriter: _XmlWriter = new _XmlWriter(false);
            const nullWriter: _XmlWriter = new _XmlWriter(false);
            const emptyWriter: _XmlWriter = new _XmlWriter(false);
            // Act
            undefinedWriter._writeElementString('a', undefined as unknown as string);
            nullWriter._writeElementString('b', null as unknown as string);
            emptyWriter._writeElementString('c', '');
            // Assert
            expect(getSavedXmlText(undefinedWriter)).toContain('<a />');
            expect(getSavedXmlText(nullWriter)).toContain('<b />');
            expect(getSavedXmlText(emptyWriter)).toContain('<c />');
        });
        it('escapes normal text and preserves raw text', () => {
            // Arrange
            const escapedWriter: _XmlWriter = new _XmlWriter(false);
            const rawWriter: _XmlWriter = new _XmlWriter(false);
            escapedWriter._writeStartElement('root');
            rawWriter._writeStartElement('root');
            // Act
            escapedWriter._writeString('<tag>&"text"</tag>');
            rawWriter._writeRaw('<tag>&"text"</tag>');
            escapedWriter._writeEndElement();
            rawWriter._writeEndElement();
            // Assert
            expect(getSavedXmlText(escapedWriter)).toContain('&lt;tag&gt;&amp;"text"&lt;/tag&gt;');
            expect(getSavedXmlText(rawWriter)).toContain('<tag>&"text"</tag>');
        });
        it('does nothing for null and undefined text', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            const before: string = writer._bufferText;
            // Act
            writer._writeInternal(null as unknown as string, false);
            writer._writeInternal(undefined as unknown as string, false);
            // Assert
            expect(writer._bufferText).toBe(before);
            expect(writer._currentState).toBe('StartElement');
        });
        it('throws for text in an invalid writer state', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const action: () => void = (): void => writer._writeString('value');
            // Assert
            expect(action).toThrowError('InvalidOperationException: Wrong Token');
        });
        it('transitions StartElement to ElementContent when text is written', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            writer._writeString('value');
            // Assert
            expect(writer._currentState).toBe('ElementContent');
            expect(writer._bufferText).toContain('<root>value');
        });
    });
    describe('_save, _flush and _destroy', () => {
        it('closes every open element before saving', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('outer');
            writer._writeStartElement('inner');
            writer._writeString('value');
            // Act
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('<outer><inner>value</inner></outer>');
            expect(writer._elementStack.length).toBe(1);
            expect(writer._bufferText).toBe('');
        });
        it('appends a second flush to the existing byte buffer', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._bufferText = 'AB';
            writer._flush();
            writer._bufferText = 'CD';
            // Act
            writer._flush();
            // Assert
            expect(Array.from(writer._buffer)).toEqual([65, 66, 67, 68]);
            expect(writer._bufferText).toBe('');
        });
        it('does not flush when buffer text is empty', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._buffer = new Uint8Array([10]);
            writer._bufferText = '';
            // Act
            writer._flush();
            // Assert
            expect(Array.from(writer._buffer)).toEqual([10]);
            expect(writer._bufferText).toBe('');
        });
        it('destroys namespace and element records and clears writer state', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            const namespace: _Namespace = writer._namespaceStack[0];
            const element: _XmlElement = writer._elementStack[0];
            writer._bufferText = 'value';
            writer._position = 7;
            // Act
            writer._destroy();
            // Assert
            expect(writer._buffer).toBeUndefined();
            expect(writer._namespaceStack).toEqual([]);
            expect(writer._elementStack).toEqual([]);
            expect(writer._bufferText).toBe('');
            expect(writer._position).toBe(0);
            expect(namespace._prefix).toBeUndefined();
            expect(namespace._namespaceUri).toBeUndefined();
            expect(namespace._kind).toBeUndefined();
            expect(element._prefix).toBeUndefined();
            expect(element._localName).toBeUndefined();
            expect(element._namespaceUri).toBeUndefined();
            expect(element._previousTop).toBeUndefined();
        });
    });
    describe('attribute writing', () => {
        it('writes an ordinary attribute with escaped value', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            writer._writeAttributeString('name', 'A&B"C', '', '');
            writer._writeEndElement();
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain(' name="A&amp;B&quot;C"');
            expect(writer._currentState).toBe('EndElement');
        });
        it('rejects an empty local name unless prefix is xmlns', () => {
            // Arrange
            const invalidWriter: _XmlWriter = new _XmlWriter(false);
            const namespaceWriter: _XmlWriter = new _XmlWriter(false);
            invalidWriter._writeStartElement('root');
            namespaceWriter._writeStartElement('root');
            // Act
            const invalidAction: () => void = (): void => invalidWriter._writeStartAttribute('', 'value', '', '');
            namespaceWriter._writeStartAttribute('', 'urn:test', 'xmlns', 'http://www.w3.org/2000/xmlns/');
            namespaceWriter._writeStringInternal('urn:test', true);
            namespaceWriter._writeEndAttribute();
            // Assert
            expect(invalidAction).toThrowError('ArgumentException: localName cannot be undefined, null or empty');
            expect(namespaceWriter._bufferText).toContain(' xmlns="urn:test"');
        });
        it('rejects attribute writing outside StartElement state', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const action: () => void = (): void => writer._writeStartAttribute('name', 'value', '', '');
            // Assert
            expect(action).toThrowError('InvalidOperationException: Wrong Token');
        });
        it('writes explicit default and prefixed namespace declarations', () => {
            // Arrange
            const defaultWriter: _XmlWriter = new _XmlWriter(false);
            const prefixedWriter: _XmlWriter = new _XmlWriter(false);
            defaultWriter._writeStartElement('root');
            prefixedWriter._writeStartElement('root');
            // Act
            defaultWriter._writeAttributeString('xmlns', 'urn:default', '', 'http://www.w3.org/2000/xmlns/');
            prefixedWriter._writeAttributeString('p', 'urn:p', 'xmlns', 'http://www.w3.org/2000/xmlns/');
            defaultWriter._writeEndElement();
            prefixedWriter._writeEndElement();
            // Assert
            expect(getSavedXmlText(defaultWriter)).toContain('xmlns="urn:default"');
            expect(getSavedXmlText(prefixedWriter)).toContain('xmlns:p="urn:p"');
        });
        it('writes xml space and xml lang without creating an implicit namespace', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            const namespaceCount: number = writer._namespaceStack.length;
            // Act
            writer._writeAttributeString('space', 'preserve', 'xml', 'http://www.w3.org/XML/1998/namespace');
            writer._writeAttributeString('lang', 'en', 'xml', 'http://www.w3.org/XML/1998/namespace');
            writer._writeEndElement();
            const xml: string = getSavedXmlText(writer);
            // Assert
            expect(xml).toContain('xml:space="preserve"');
            expect(xml).toContain('xml:lang="en"');
            expect(writer._namespaceStack.length).toBe(namespaceCount - 1);
        });
        it('removes a prefix when its namespace is empty', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            writer._writeStartAttributeSpecialAttribute('p', 'name', '', 'value');
            writer._writeStringInternal('value', true);
            writer._writeEndAttribute();
            // Assert
            expect(writer._bufferText).toContain(' name="value"');
            expect(writer._bufferText).not.toContain('p:name');
        });
        it('detects duplicate attributes by local name and prefix or namespace', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            writer._writeAttributeString('name', 'one', 'p', 'urn:p');
            // Act
            const samePrefixAction: () => void = (): void => writer._writeAttributeString('name', 'two', 'p', 'urn:other');
            const sameNamespaceAction: () => void = (): void => writer._writeAttributeString('name', 'two', 'q', 'urn:p');
            // Assert
            expect(samePrefixAction).toThrowError('XmlException namespace Uri needs to be the same as the one that is already declared');
            expect(sameNamespaceAction).toThrowError('XmlException: duplicate attribute name');
        });
    });
    describe('namespace lookup', () => {
        it('finds the index-zero predefined xmlns namespace', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const prefix: string = writer._lookupPrefix('http://www.w3.org/2000/xmlns/');
            const namespace: string = writer._lookupNamespace('xmlns');
            const index: number = writer._lookupNamespaceIndex('xmlns');
            // Assert
            expect(prefix).toBe('xmlns');
            expect(namespace).toBe('http://www.w3.org/2000/xmlns/');
            expect(index).toBe(0);
        });
        it('returns undefined and minus one when namespace data is absent', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const prefix: string = writer._lookupPrefix('urn:missing');
            const namespace: string = writer._lookupNamespace('missing');
            const index: number = writer._lookupNamespaceIndex('missing');
            // Assert
            expect(prefix).toBeUndefined();
            expect(namespace).toBeUndefined();
            expect(index).toBe(-1);
        });
    });
    describe('implicit namespace behavior', () => {
        it('adds a new namespace as NeedToWrite and emits it in element content', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            writer._pushNamespaceImplicit('p', 'urn:p');
            const added: _Namespace = writer._namespaceStack[writer._namespaceStack.length - 1];
            writer._startElementContent();
            // Assert
            expect(added._prefix).toBe('p');
            expect(added._namespaceUri).toBe('urn:p');
            expect(added._kind).toBe('NeedToWrite');
            expect(writer._bufferText).toContain('xmlns:p="urn:p"');
        });
        it('marks a matching inherited namespace as Implied', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root', 'p', 'urn:p');
            writer._startElementContent();
            writer._writeStartElement('child');
            // Act
            writer._pushNamespaceImplicit('p', 'urn:p');
            const added: _Namespace = writer._namespaceStack[writer._namespaceStack.length - 1];
            // Assert
            expect(added._kind).toBe('Implied');
            expect(added._namespaceUri).toBe('urn:p');
        });
        it('throws for conflicting namespace in the active element frame', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            writer._pushNamespaceImplicit('p', 'urn:one');
            // Act
            const action: () => void = (): void => writer._pushNamespaceImplicit('p', 'urn:two');
            // Assert
            expect(action).toThrowError('XmlException namespace Uri needs to be the same as the one that is already declared');
        });
        it('accepts only the predefined xml prefix for the XML namespace', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            const invalidAction: () => void = (): void => writer._pushNamespaceImplicit('p', 'http://www.w3.org/XML/1998/namespace');
            writer._pushNamespaceImplicit('xml', 'http://www.w3.org/XML/1998/namespace');
            const added: _Namespace = writer._namespaceStack[writer._namespaceStack.length - 1];
            // Assert
            expect(invalidAction).toThrowError('InvalidArgumentException');
            expect(added._prefix).toBe('xml');
            expect(added._kind).toBe('Implied');
        });
        it('rejects the reserved xmlns prefix for a different namespace', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            // Act
            const action: () => void = (): void => writer._pushNamespaceImplicit('xmlns', 'urn:wrong');
            // Assert
            expect(action).toThrowError('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.');
        });
    });
    describe('explicit namespace behavior', () => {
        it('adds an absent explicit namespace as Written', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            writer._pushNamespaceExplicit('p', 'urn:p');
            const added: _Namespace = writer._namespaceStack[writer._namespaceStack.length - 1];
            // Assert
            expect(added._prefix).toBe('p');
            expect(added._namespaceUri).toBe('urn:p');
            expect(added._kind).toBe('Written');
        });
        it('changes an active matching namespace to Written without adding another record', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            writer._writeStartElement('root');
            writer._pushNamespaceImplicit('p', 'urn:p');
            const before: number = writer._namespaceStack.length;
            // Act
            writer._pushNamespaceExplicit('p', 'urn:p');
            const index: number = writer._lookupNamespaceIndex('p');
            // Assert
            expect(writer._namespaceStack.length).toBe(before);
            expect(writer._namespaceStack[index]._kind).toBe('Written');
        });
    });
    describe('record classes', () => {
        it('sets and destroys a Namespace record', () => {
            // Arrange
            const namespace: _Namespace = new _Namespace();
            // Act
            namespace._set('p', 'urn:p', 'Written');
            // Assert
            expect(namespace._prefix).toBe('p');
            expect(namespace._namespaceUri).toBe('urn:p');
            expect(namespace._kind).toBe('Written');
            // Act
            namespace._destroy();
            // Assert
            expect(namespace._prefix).toBeUndefined();
            expect(namespace._namespaceUri).toBeUndefined();
            expect(namespace._kind).toBeUndefined();
        });
        it('sets and destroys an XmlElement record', () => {
            // Arrange
            const element: _XmlElement = new _XmlElement();
            // Act
            element._set('p', 'node', 'urn:p', 3);
            // Assert
            expect(element._prefix).toBe('p');
            expect(element._localName).toBe('node');
            expect(element._namespaceUri).toBe('urn:p');
            expect(element._previousTop).toBe(3);
            // Act
            element._destroy();
            // Assert
            expect(element._prefix).toBeUndefined();
            expect(element._localName).toBeUndefined();
            expect(element._namespaceUri).toBeUndefined();
            expect(element._previousTop).toBeUndefined();
        });
        it('distinguishes every XmlAttribute duplicate combination', () => {
            // Arrange
            const attribute: _XmlAttribute = new _XmlAttribute();
            attribute._set('p', 'name', 'urn:p');
            // Act
            const exactDuplicate: boolean = attribute._isDuplicate('p', 'name', 'urn:p');
            const matchingPrefix: boolean = attribute._isDuplicate('p', 'name', 'urn:other');
            const matchingNamespace: boolean = attribute._isDuplicate('q', 'name', 'urn:p');
            const differentIdentity: boolean = attribute._isDuplicate('q', 'name', 'urn:q');
            const differentLocalName: boolean = attribute._isDuplicate('p', 'other', 'urn:p');
            // Assert
            expect(exactDuplicate).toBeTruthy();
            expect(matchingPrefix).toBeTruthy();
            expect(matchingNamespace).toBeTruthy();
            expect(differentIdentity).toBeFalsy();
            expect(differentLocalName).toBeFalsy();
        });
        it('destroys an XmlAttribute record', () => {
            // Arrange
            const attribute: _XmlAttribute = new _XmlAttribute();
            attribute._set('p', 'name', 'urn:p');
            // Act
            attribute._destroy();
            // Assert
            expect(attribute._prefix).toBeUndefined();
            expect(attribute._localName).toBeUndefined();
            expect(attribute._namespaceUri).toBeUndefined();
        });
    });
    describe('name validation', () => {
        it('accepts a valid XML name', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            // Act
            const action: () => void = (): void => writer._checkName('valid-name.value');
            // Assert
            expect(action).not.toThrow();
        });
        it('rejects every configured invalid name-character family', () => {
            // Arrange
            const writer: _XmlWriter = new _XmlWriter(false);
            const invalidNames: string[] = ['a b', 'a@b', 'a#b', 'a$b', 'a%b', 'a^b', 'a&b', 'a(b', 'a)b', 'a+b', 'a=b', 'a[b', 'a]b', 'a;b', "a'b", 'a"b', 'a\\b', 'a|b', 'a,b', 'a<b', 'a>b', 'a/b', 'a?b'];
            // Act
            const results: boolean[] = [];
            for (let i: number = 0; i < invalidNames.length; i++) {
                const action: () => void = (): void => writer._checkName(invalidNames[i]);
                expect(action).toThrowError('InvalidArgumentException: invalid name character');
                results.push(true);
            }
            // Assert
            expect(results.length).toBe(23);
        });
    });
});
describe('_XmlWriter mutation coverage', () => {
    it('constructor initializes standard XML namespace state when appearance mode is omitted', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const currentState: string = writer._currentState;
        const namespaceCount: number = writer._namespaceStack.length;
        const elementCount: number = writer._elementStack.length;
        // Assert
        expect(currentState).toBe('Initial');
        expect(namespaceCount).toBe(3);
        expect(elementCount).toBe(1);
        expect(writer._namespaceStack[0]._prefix).toBe('xmlns');
        expect(writer._namespaceStack[0]._namespaceUri).toBe('http://www.w3.org/2000/xmlns/');
        expect(writer._namespaceStack[0]._kind).toBe('Special');
        expect(writer._namespaceStack[1]._prefix).toBe('xml');
        expect(writer._namespaceStack[1]._namespaceUri).toBe('http://www.w3.org/XML/1998/namespace');
        expect(writer._namespaceStack[1]._kind).toBe('Special');
        expect(writer._namespaceStack[2]._prefix).toBe('');
        expect(writer._namespaceStack[2]._namespaceUri).toBe('');
        expect(writer._namespaceStack[2]._kind).toBe('Implied');
        expect(writer._elementStack[0]._prefix).toBe('');
        expect(writer._elementStack[0]._localName).toBe('');
        expect(writer._elementStack[0]._namespaceUri).toBe('');
        expect(writer._elementStack[0]._previousTop).toBe(2);
        expect(writer._attributeStack.length).toBe(0);
    });
    it('constructor initializes appearance mode without namespace records', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter(true);
        // Act
        const currentState: string = writer._currentState;
        const skipNamespace: boolean = writer._skipNamespace;
        // Assert
        expect(currentState).toBe('StartDocument');
        expect(skipNamespace).toBeTruthy();
        expect(writer._namespaceStack.length).toBe(0);
        expect(writer._elementStack.length).toBe(0);
        expect(writer._attributeStack.length).toBe(0);
    });
    it('writeStartDocument writes declaration without standalone attribute when omitted', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeStartDocument();
        // Assert
        expect(writer._currentState).toBe('StartDocument');
        expect(writer._bufferText).toBe('<?xml version="1.0" encoding="utf-8"?>');
        expect(writer._bufferText.indexOf('standalone')).toBe(-1);
    });
    it('writeStartDocument writes yes when standalone is true', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeStartDocument(true);
        // Assert
        expect(writer._currentState).toBe('StartDocument');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8" standalone="yes"?>'
        );
    });
    it('writeStartDocument writes no when standalone is false', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeStartDocument(false);
        // Assert
        expect(writer._currentState).toBe('StartDocument');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8" standalone="no"?>'
        );
    });
    it('writeStartDocument throws exact error when writer state is invalid', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._currentState = 'StartDocument';
        // Act
        const operation: () => void = (): void => {
            writer._writeStartDocument();
        };
        // Assert
        expect(operation).toThrowError('InvalidOperationException: Wrong Token');
        expect(writer._bufferText).toBe('');
    });
    it('writeStartDocument throws exact error after writer is destroyed', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._destroy();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartDocument();
        };
        // Assert
        expect(operation).toThrowError('InvalidOperationException: Wrong Token');
        expect(writer._bufferText).toBe('');
    });
    it('writeStartElement throws exact error after writer is destroyed', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._destroy();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartElement('root');
        };
        // Assert
        expect(operation).toThrowError('InvalidOperationException: Wrong Token');
        expect(writer._bufferText).toBe('');
    });
    it('writeStartElement rejects an empty local name', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartElement('');
        };
        // Assert
        expect(operation).toThrowError(
            'ArgumentException: localName cannot be undefined, null or empty'
        );
        expect(writer._currentState).toBe('Initial');
    });
    it('writeStartElement automatically writes declaration and unprefixed element', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeStartElement('root');
        // Assert
        expect(writer._currentState).toBe('StartElement');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root'
        );
        expect(writer._elementStack.length).toBe(2);
        expect(writer._elementStack[1]._prefix).toBe('');
        expect(writer._elementStack[1]._localName).toBe('root');
        expect(writer._elementStack[1]._namespaceUri).toBe('');
    });
    it('writeStartElement resolves prefix from a known namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:books', 'Written');
        // Act
        writer._writeStartElement('book', undefined, 'urn:books');
        // Assert
        expect(writer._currentState).toBe('StartElement');
        expect(writer._elementStack[1]._prefix).toBe('books');
        expect(writer._elementStack[1]._namespaceUri).toBe('urn:books');
        expect(writer._bufferText).toContain('<books:book');
    });
    it('writeStartElement resolves namespace from a known nonempty prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:books', 'Written');
        // Act
        writer._writeStartElement('book', 'books');
        // Assert
        expect(writer._currentState).toBe('StartElement');
        expect(writer._elementStack[1]._prefix).toBe('books');
        expect(writer._elementStack[1]._namespaceUri).toBe('urn:books');
        expect(writer._bufferText).toContain('<books:book');
    });
    it('writeStartElement rejects a prefix with an unresolved namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartElement('book', 'books');
        };
        // Assert
        expect(operation).toThrowError(
            'ArgumentException: Cannot use a prefix with an empty namespace'
        );
        expect(writer._elementStack.length).toBe(1);
    });
    it('writeStartElement rejects a prefix with an explicitly empty namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartElement('book', 'books', '');
        };
        // Assert
        expect(operation).toThrowError(
            'ArgumentException: Cannot use a prefix with an empty namespace'
        );
        expect(writer._elementStack.length).toBe(1);
    });
    it('writeStartElement closes pending parent start content before nested element', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('parent');
        // Act
        writer._writeStartElement('child');
        // Assert
        expect(writer._currentState).toBe('StartElement');
        expect(writer._elementStack.length).toBe(3);
        expect(writer._elementStack[2]._localName).toBe('child');
        expect(writer._bufferText).toContain('<parent><child');
    });
    it('writeEndElement converts an empty start element into compact empty element syntax', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeEndElement();
        // Assert
        expect(writer._currentState).toBe('EndElement');
        expect(writer._elementStack.length).toBe(1);
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root />'
        );
    });
    it('writeEndElement writes matching closing tag after element text', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        writer._writeString('value');
        // Act
        writer._writeEndElement();
        // Assert
        expect(writer._currentState).toBe('EndElement');
        expect(writer._elementStack.length).toBe(1);
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root>value</root>'
        );
    });
    it('writeEndElement preserves ElementContent state branch before closing', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        writer._writeString('content');
        // Act
        writer._writeEndElement();
        // Assert
        expect(writer._currentState).toBe('EndElement');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root>content</root>'
        );
        expect(writer._elementStack.length).toBe(1);
    });
    it('writeElementString omits text for empty value', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeElementString('root', '');
        // Assert
        expect(writer._currentState).toBe('EndElement');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root />'
        );
    });
    it('writeElementString writes and escapes nonempty text', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._writeElementString('root', 'A&B<C>D');
        // Assert
        expect(writer._currentState).toBe('EndElement');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<root>A&amp;B&lt;C&gt;D</root>'
        );
    });
    it('writeInternal throws exact error when text is written before an element', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._writeString('value');
        };
        // Assert
        expect(operation).toThrowError('InvalidOperationException: Wrong Token');
        expect(writer._bufferText).toBe('');
        expect(writer._currentState).toBe('Initial');
    });
    it('writeString starts element content and escapes XML characters', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeString('&<>');
        // Assert
        expect(writer._currentState).toBe('ElementContent');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root>&amp;&lt;&gt;'
        );
        expect(writer._position).toBe(0);
    });
    it('writeRaw starts element content without escaping XML characters', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeRaw('<child/>');
        // Assert
        expect(writer._currentState).toBe('ElementContent');
        expect(writer._bufferText).toBe(
            '<?xml version="1.0" encoding="utf-8"?><root><child/>'
        );
        expect(writer._bufferText).not.toContain('&lt;child/&gt;');
    });
    it('save closes all nested elements and returns serialized bytes', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('parent');
        writer._writeStartElement('child');
        writer._writeString('value');
        // Act
        const result: Uint8Array = writer._save();
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(writer._elementStack.length).toBe(1);
        expect(writer._bufferText).toBe('');
    });
    it('buffer getter flushes pending text and returns the internal byte buffer', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = 'ABC';
        // Act
        const result: Uint8Array = writer.buffer;
        // Assert
        expect(result.length).toBe(3);
        expect(result[0]).toBe(65);
        expect(result[1]).toBe(66);
        expect(result[2]).toBe(67);
        expect(result).toBe(writer._buffer);
        expect(writer._bufferText).toBe('');
    });
    it('flush creates a new byte buffer when the existing buffer is empty', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = 'ABC';
        // Act
        writer._flush();
        // Assert
        expect(writer._buffer.length).toBe(3);
        expect(writer._buffer[0]).toBe(65);
        expect(writer._buffer[1]).toBe(66);
        expect(writer._buffer[2]).toBe(67);
        expect(writer._bufferText).toBe('');
    });
    it('flush appends text bytes when the existing buffer has content', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._buffer = new Uint8Array([65, 66]);
        writer._bufferText = 'CD';
        // Act
        writer._flush();
        // Assert
        expect(writer._buffer.length).toBe(4);
        expect(writer._buffer[0]).toBe(65);
        expect(writer._buffer[1]).toBe(66);
        expect(writer._buffer[2]).toBe(67);
        expect(writer._buffer[3]).toBe(68);
        expect(writer._bufferText).toBe('');
    });
    it('flush does not modify the buffer when text is empty', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        const originalBuffer: Uint8Array = new Uint8Array([10, 20]);
        writer._buffer = originalBuffer;
        writer._bufferText = '';
        // Act
        writer._flush();
        // Assert
        expect(writer._buffer).toBe(originalBuffer);
        expect(writer._buffer.length).toBe(2);
        expect(writer._bufferText).toBe('');
    });
    it('destroy clears writer resources and primitive state', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = 'content';
        writer._position = 25;
        // Act
        writer._destroy();
        // Assert
        expect(writer._buffer).toBeUndefined();
        expect(writer._namespaceStack.length).toBe(0);
        expect(writer._elementStack.length).toBe(0);
        expect(writer._bufferText).toBe('');
        expect(writer._position).toBe(0);
    });
    it('writeStartAttribute rejects an empty normal attribute name', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        const operation: () => void = (): void => {
            writer._writeStartAttribute('', 'value', '', '');
        };
        // Assert
        expect(operation).toThrowError(
            'ArgumentException: localName cannot be undefined, null or empty'
        );
        expect(writer._attributeStack.length).toBe(0);
    });
    it('writeStartAttribute converts empty xmlns local name to default declaration', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeStartAttribute('', 'urn:default', 'xmlns', '');
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('');
        expect(writer._attributeStack[0]._localName).toBe('xmlns');
        expect(writer._bufferText).toContain(' xmlns="');
    });
    it('writeStartAttribute throws exact error outside StartElement state', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._writeStartAttribute('id', '1', '', '');
        };
        // Assert
        expect(operation).toThrowError('InvalidOperationException: Wrong Token');
        expect(writer._attributeStack.length).toBe(0);
    });
    it('writeAttributeString writes an ordinary unprefixed attribute', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeAttributeString('id', 'A&B');
        // Assert
        expect(writer._currentState).toBe('StartElement');
        expect(writer._bufferText).toContain(' id="A&amp;B"');
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._localName).toBe('id');
    });
    it('writeAttributeString resolves prefix from the supplied namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        writer._addNamespace('books', 'urn:books', 'Written');
        // Act
        writer._writeAttributeString('id', '1', undefined, 'urn:books');
        // Assert
        expect(writer._bufferText).toContain(' books:id="1"');
        expect(writer._attributeStack[0]._prefix).toBe('books');
        expect(writer._attributeStack[0]._namespaceUri).toBe('urn:books');
    });
    it('writeAttributeString resolves namespace from a nonempty prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        writer._addNamespace('books', 'urn:books', 'Written');
        // Act
        writer._writeAttributeString('id', '1', 'books');
        // Assert
        expect(writer._bufferText).toContain(' books:id="1"');
        expect(writer._attributeStack[0]._prefix).toBe('books');
        expect(writer._attributeStack[0]._namespaceUri).toBe('urn:books');
    });
    it('writeStartAttributeSpecialAttribute marks the active default namespace as written', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        const namespaceCount: number = writer._namespaceStack.length;
        const activeNamespaceIndex: number = writer._lookupNamespaceIndex('');
        // Act
        writer._writeStartAttributeSpecialAttribute(
            '',
            'xmlns',
            'http://www.w3.org/2000/xmlns/',
            'urn:default'
        );
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('');
        expect(writer._attributeStack[0]._localName).toBe('xmlns');
        expect(writer._attributeStack[0]._namespaceUri).toBe(
            'http://www.w3.org/2000/xmlns/'
        );
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._namespaceStack[activeNamespaceIndex]._prefix).toBe('');
        expect(writer._namespaceStack[activeNamespaceIndex]._namespaceUri).toBe('');
        expect(writer._namespaceStack[activeNamespaceIndex]._kind).toBe('Written');
        expect(writer._bufferText).toContain(' xmlns="');
    });
    it('writeStartAttributeSpecialAttribute writes a prefixed xmlns declaration', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeStartAttributeSpecialAttribute(
            'xmlns',
            'books',
            'http://www.w3.org/2000/xmlns/',
            'urn:books'
        );
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('xmlns');
        expect(writer._attributeStack[0]._localName).toBe('books');
        expect(writer._namespaceStack[writer._namespaceStack.length - 1]._prefix).toBe('books');
        expect(writer._namespaceStack[writer._namespaceStack.length - 1]._namespaceUri).toBe(
            'urn:books'
        );
        expect(writer._namespaceStack[writer._namespaceStack.length - 1]._kind).toBe('Written');
        expect(writer._bufferText).toContain(' xmlns:books="');
    });
    it('writeStartAttributeSpecialAttribute handles xml space without implicit namespace push', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        const namespaceCount: number = writer._namespaceStack.length;
        // Act
        writer._writeStartAttributeSpecialAttribute(
            'xml',
            'space',
            'http://www.w3.org/XML/1998/namespace',
            'preserve'
        );
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('xml');
        expect(writer._attributeStack[0]._localName).toBe('space');
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._bufferText).toContain(' xml:space="');
    });
    it('writeStartAttributeSpecialAttribute handles xml lang without implicit namespace push', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        const namespaceCount: number = writer._namespaceStack.length;
        // Act
        writer._writeStartAttributeSpecialAttribute(
            'xml',
            'lang',
            'http://www.w3.org/XML/1998/namespace',
            'en'
        );
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('xml');
        expect(writer._attributeStack[0]._localName).toBe('lang');
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._bufferText).toContain(' xml:lang="');
    });
    it('writeStartAttributeSpecialAttribute removes prefix for an empty namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeStartAttributeSpecialAttribute('books', 'id', '', '1');
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('');
        expect(writer._attributeStack[0]._namespaceUri).toBe('');
        expect(writer._bufferText).toContain(' id="');
        expect(writer._bufferText).not.toContain(' books:id="');
    });
    it('writeStartAttributeSpecialAttribute pushes a nonempty implicit namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root');
        // Act
        writer._writeStartAttributeSpecialAttribute('books', 'id', 'urn:books', '1');
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('books');
        expect(writer._namespaceStack[writer._namespaceStack.length - 1]._prefix).toBe('books');
        expect(writer._namespaceStack[writer._namespaceStack.length - 1]._namespaceUri).toBe(
            'urn:books'
        );
        expect(writer._bufferText).toContain(' books:id="');
    });
    it('writeStartElementInternal destroys and clears existing attribute records', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('old', 'id', 'urn:old');
        writer._attributeStack.push(attribute);
        writer._currentState = 'StartDocument';
        // Act
        writer._writeStartElementInternal('', 'root', '');
        // Assert
        expect(writer._attributeStack.length).toBe(0);
        expect(attribute._prefix).toBeUndefined();
        expect(attribute._localName).toBeUndefined();
        expect(attribute._namespaceUri).toBeUndefined();
        expect(writer._elementStack[writer._elementStack.length - 1]._localName).toBe('root');
    });
    it('writeEndElementInternal writes a prefixed closing tag for nonempty content', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '<books:item>value';
        writer._position = 0;
        // Act
        writer._writeEndElementInternal('books', 'item');
        // Assert
        expect(writer._bufferText).toBe('<books:item>value</books:item>');
    });
    it('writeEndElementInternal omits prefix separator for an empty prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '<item>value';
        writer._position = 0;
        // Act
        writer._writeEndElementInternal('', 'item');
        // Assert
        expect(writer._bufferText).toBe('<item>value</item>');
        expect(writer._bufferText).not.toContain('</:item>');
    });
    it('writeNamespaceDeclaration escapes namespace URI in attribute mode', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '';
        // Act
        writer._writeNamespaceDeclaration('books', 'urn:"books"&catalog');
        // Assert
        expect(writer._bufferText).toBe(
            ' xmlns:books="urn:&quot;books&quot;&amp;catalog"'
        );
    });
    it('writeNamespaceDeclaration skips output in appearance mode', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter(true);
        writer._bufferText = 'original';
        // Act
        writer._writeNamespaceDeclaration('books', 'urn:books');
        // Assert
        expect(writer._bufferText).toBe('original');
    });
    it('writeStartNamespaceDeclaration writes default namespace syntax for empty prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '';
        // Act
        writer._writeStartNamespaceDeclaration('');
        // Assert
        expect(writer._bufferText).toBe(' xmlns="');
    });
    it('writeStartNamespaceDeclaration writes prefixed namespace syntax', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '';
        // Act
        writer._writeStartNamespaceDeclaration('books');
        // Assert
        expect(writer._bufferText).toBe(' xmlns:books="');
    });
    it('writeStringInternal converts undefined text to an empty string', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = 'prefix';
        // Act
        writer._writeStringInternal(undefined, false);
        // Assert
        expect(writer._bufferText).toBe('prefix');
        expect(writer._position).toBe(0);
    });
    it('writeStringInternal escapes ampersand less-than greater-than and null characters', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._bufferText = '';
        writer._position = 15;
        // Act
        writer._writeStringInternal('A&B<C>D\u0000E', false);
        // Assert
        expect(writer._bufferText).toBe('A&amp;B&lt;C&gt;DE');
        expect(writer._bufferText.indexOf('\u0000')).toBe(-1);
        expect(writer._position).toBe(0);
    });
    it('writeStringInternal escapes quotations only in attribute values', () => {
        // Arrange
        const attributeWriter: _XmlWriter = new _XmlWriter();
        const textWriter: _XmlWriter = new _XmlWriter();
        // Act
        attributeWriter._writeStringInternal('"quoted"', true);
        textWriter._writeStringInternal('"quoted"', false);
        // Assert
        expect(attributeWriter._bufferText).toBe('&quot;quoted&quot;');
        expect(textWriter._bufferText).toBe('"quoted"');
    });
    it('writeStringInternal preserves position while writing an attribute value', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._position = 25;
        // Act
        writer._writeStringInternal('value', true);
        // Assert
        expect(writer._bufferText).toBe('value');
        expect(writer._position).toBe(25);
    });
    it('startElementContent writes pending namespace declarations and position', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root', 'books', 'urn:books');
        const textLengthBeforeContent: number = writer._bufferText.length;
        // Act
        writer._startElementContent();
        // Assert
        expect(writer._bufferText.length).toBeGreaterThan(textLengthBeforeContent);
        expect(writer._bufferText).toContain(' xmlns:books="urn:books"');
        expect(writer._bufferText.charAt(writer._bufferText.length - 1)).toBe('>');
        expect(writer._position).toBe(writer._bufferText.length + 1);
    });
    it('lookupPrefix returns the nearest matching namespace prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('first', 'urn:value', 'Written');
        writer._addNamespace('nearest', 'urn:value', 'Written');
        // Act
        const result: string = writer._lookupPrefix('urn:value');
        // Assert
        expect(result).toBe('nearest');
    });
    it('lookupPrefix returns undefined when namespace does not exist', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const result: string = writer._lookupPrefix('urn:missing');
        // Assert
        expect(result).toBeUndefined();
    });
    it('lookupNamespace returns the nearest matching namespace URI', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:first', 'Written');
        writer._addNamespace('books', 'urn:nearest', 'Written');
        // Act
        const result: string = writer._lookupNamespace('books');
        // Assert
        expect(result).toBe('urn:nearest');
    });
    it('lookupNamespaceIndex returns the nearest matching index', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:first', 'Written');
        writer._addNamespace('books', 'urn:nearest', 'Written');
        const expectedIndex: number = writer._namespaceStack.length - 1;
        // Act
        const result: number = writer._lookupNamespaceIndex('books');
        // Assert
        expect(result).toBe(expectedIndex);
        expect(result).toBeGreaterThan(-1);
    });
    it('lookupNamespaceIndex returns minus one when prefix is absent', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const result: number = writer._lookupNamespaceIndex('missing');
        // Assert
        expect(result).toBe(-1);
    });
    it('pushNamespaceImplicit adds NeedToWrite for a new ordinary namespace', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceImplicit('books', 'urn:books');
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('books');
        expect(writer._namespaceStack[previousLength]._namespaceUri).toBe('urn:books');
        expect(writer._namespaceStack[previousLength]._kind).toBe('NeedToWrite');
    });
    it('pushNamespaceImplicit rejects XML namespace with a non-xml prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._pushNamespaceImplicit(
                'invalid',
                'http://www.w3.org/XML/1998/namespace'
            );
        };
        // Assert
        expect(operation).toThrowError('InvalidArgumentException');
        expect(writer._lookupNamespaceIndex('invalid')).toBe(-1);
    });
    it('pushNamespaceImplicit rejects xmlns namespace with a non-xmlns prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._pushNamespaceImplicit(
                'invalid',
                'http://www.w3.org/2000/xmlns/'
            );
        };
        // Assert
        expect(operation).toThrowError('InvalidArgumentException');
        expect(writer._lookupNamespaceIndex('invalid')).toBe(-1);
    });
    it('pushNamespaceImplicit marks the standard xml namespace as Implied', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceImplicit(
            'xml',
            'http://www.w3.org/XML/1998/namespace'
        );
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('xml');
        expect(writer._namespaceStack[previousLength]._kind).toBe('Implied');
    });
    it('pushNamespaceImplicit rejects a changed URI for the reserved xml prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._pushNamespaceImplicit('xml', 'urn:invalid');
        };
        // Assert
        expect(operation).toThrowError('InvalidArgumentException: Xml String');
        expect(writer._lookupNamespace('xml')).toBe(
            'http://www.w3.org/XML/1998/namespace'
        );
    });
    it('pushNamespaceImplicit rejects use of reserved xmlns prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._pushNamespaceImplicit(
                'xmlns',
                'http://www.w3.org/2000/xmlns/'
            );
        };
        // Assert
        expect(operation).toThrowError(
            'InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.'
        );
    });
    it('pushNamespaceImplicit does not add duplicate declaration in the active element', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root', 'books', 'urn:books');
        const namespaceCount: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceImplicit('books', 'urn:books');
        // Assert
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._lookupNamespace('books')).toBe('urn:books');
    });
    it('pushNamespaceImplicit rejects a conflicting declaration in the active element', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root', 'books', 'urn:books');
        const namespaceCount: number = writer._namespaceStack.length;
        // Act
        const operation: () => void = (): void => {
            writer._pushNamespaceImplicit('books', 'urn:changed');
        };
        // Assert
        expect(operation).toThrowError(
            'XmlException namespace Uri needs to be the same as the one that is already declared'
        );
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._lookupNamespace('books')).toBe('urn:books');
    });
    it('pushNamespaceImplicit adds Implied when an outer declaration has the same URI', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:books', 'Written');
        writer._writeStartElement('root');
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceImplicit('books', 'urn:books');
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('books');
        expect(writer._namespaceStack[previousLength]._namespaceUri).toBe('urn:books');
        expect(writer._namespaceStack[previousLength]._kind).toBe('Implied');
    });
    it('pushNamespaceImplicit adds NeedToWrite when an outer declaration has a different URI', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:old', 'Written');
        writer._writeStartElement('root');
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceImplicit('books', 'urn:new');
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('books');
        expect(writer._namespaceStack[previousLength]._namespaceUri).toBe('urn:new');
        expect(writer._namespaceStack[previousLength]._kind).toBe('NeedToWrite');
    });
    it('pushNamespaceExplicit updates active namespace kind to Written without adding a record', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartElement('root', 'books', 'urn:books');
        const existingIndex: number = writer._lookupNamespaceIndex('books');
        const namespaceCount: number = writer._namespaceStack.length;
        writer._namespaceStack[existingIndex]._kind = 'NeedToWrite';
        // Act
        writer._pushNamespaceExplicit('books', 'urn:books');
        // Assert
        expect(writer._namespaceStack.length).toBe(namespaceCount);
        expect(writer._namespaceStack[existingIndex]._kind).toBe('Written');
    });
    it('pushNamespaceExplicit adds a record when matching prefix belongs to an outer scope', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addNamespace('books', 'urn:outer', 'Written');
        writer._writeStartElement('root');
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceExplicit('books', 'urn:inner');
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('books');
        expect(writer._namespaceStack[previousLength]._namespaceUri).toBe('urn:inner');
        expect(writer._namespaceStack[previousLength]._kind).toBe('Written');
    });
    it('pushNamespaceExplicit adds a record when prefix does not exist', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        const previousLength: number = writer._namespaceStack.length;
        // Act
        writer._pushNamespaceExplicit('books', 'urn:books');
        // Assert
        expect(writer._namespaceStack.length).toBe(previousLength + 1);
        expect(writer._namespaceStack[previousLength]._prefix).toBe('books');
        expect(writer._namespaceStack[previousLength]._namespaceUri).toBe('urn:books');
        expect(writer._namespaceStack[previousLength]._kind).toBe('Written');
    });
    it('addAttribute stores a unique attribute', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        writer._addAttribute('books', 'id', 'urn:books');
        // Assert
        expect(writer._attributeStack.length).toBe(1);
        expect(writer._attributeStack[0]._prefix).toBe('books');
        expect(writer._attributeStack[0]._localName).toBe('id');
        expect(writer._attributeStack[0]._namespaceUri).toBe('urn:books');
    });
    it('addAttribute rejects an exact duplicate attribute', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addAttribute('books', 'id', 'urn:books');
        // Act
        const operation: () => void = (): void => {
            writer._addAttribute('books', 'id', 'urn:books');
        };
        // Assert
        expect(operation).toThrowError('XmlException: duplicate attribute name');
    });
    it('addAttribute rejects same local name and namespace with another prefix', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addAttribute('first', 'id', 'urn:books');
        // Act
        const operation: () => void = (): void => {
            writer._addAttribute('second', 'id', 'urn:books');
        };
        // Assert
        expect(operation).toThrowError('XmlException: duplicate attribute name');
    });
    it('addAttribute permits the same local name in different namespaces', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        writer._addAttribute('first', 'id', 'urn:first');
        // Act
        writer._addAttribute('second', 'id', 'urn:second');
        // Assert
        expect(writer._attributeStack.length).toBe(2);
        expect(writer._attributeStack[0]._namespaceUri).toBe('urn:first');
        expect(writer._attributeStack[1]._namespaceUri).toBe('urn:second');
    });
    it('checkName accepts a valid XML name', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._checkName('valid_name-1');
        };
        // Assert
        expect(operation).not.toThrow();
    });
    it('checkName rejects a name containing an invalid character', () => {
        // Arrange
        const writer: _XmlWriter = new _XmlWriter();
        // Act
        const operation: () => void = (): void => {
            writer._checkName('invalid name');
        };
        // Assert
        expect(operation).toThrowError(
            'InvalidArgumentException: invalid name character'
        );
    });
});
describe('_Namespace mutation coverage', () => {
    it('set assigns all namespace properties', () => {
        // Arrange
        const namespace: _Namespace = new _Namespace();
        const kind: _NamespaceKind = 'NeedToWrite';
        // Act
        namespace._set('books', 'urn:books', kind);
        // Assert
        expect(namespace._prefix).toBe('books');
        expect(namespace._namespaceUri).toBe('urn:books');
        expect(namespace._kind).toBe('NeedToWrite');
    });
    it('destroy clears all namespace properties', () => {
        // Arrange
        const namespace: _Namespace = new _Namespace();
        namespace._set('books', 'urn:books', 'Written');
        // Act
        namespace._destroy();
        // Assert
        expect(namespace._prefix).toBeUndefined();
        expect(namespace._namespaceUri).toBeUndefined();
        expect(namespace._kind).toBeUndefined();
    });
});
describe('_XmlElement mutation coverage', () => {
    it('set assigns all element properties', () => {
        // Arrange
        const element: _XmlElement = new _XmlElement();
        // Act
        element._set('books', 'book', 'urn:books', 3);
        // Assert
        expect(element._previousTop).toBe(3);
        expect(element._prefix).toBe('books');
        expect(element._localName).toBe('book');
        expect(element._namespaceUri).toBe('urn:books');
    });
    it('destroy clears all element properties', () => {
        // Arrange
        const element: _XmlElement = new _XmlElement();
        element._set('books', 'book', 'urn:books', 3);
        // Act
        element._destroy();
        // Assert
        expect(element._previousTop).toBeUndefined();
        expect(element._prefix).toBeUndefined();
        expect(element._localName).toBeUndefined();
        expect(element._namespaceUri).toBeUndefined();
    });
});
describe('_XmlAttribute mutation coverage', () => {
    it('set assigns all attribute properties', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        // Act
        attribute._set('books', 'id', 'urn:books');
        // Assert
        expect(attribute._prefix).toBe('books');
        expect(attribute._localName).toBe('id');
        expect(attribute._namespaceUri).toBe('urn:books');
    });
    it('isDuplicate returns true for same local name and prefix', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('books', 'id', 'urn:books');
        // Act
        const result: boolean = attribute._isDuplicate(
            'books',
            'id',
            'urn:different'
        );
        // Assert
        expect(result).toBeTruthy();
    });
    it('isDuplicate returns true for same local name and namespace', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('books', 'id', 'urn:books');
        // Act
        const result: boolean = attribute._isDuplicate(
            'catalog',
            'id',
            'urn:books'
        );
        // Assert
        expect(result).toBeTruthy();
    });
    it('isDuplicate returns false for a different local name', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('books', 'id', 'urn:books');
        // Act
        const result: boolean = attribute._isDuplicate(
            'books',
            'name',
            'urn:books'
        );
        // Assert
        expect(result).toBeFalsy();
    });
    it('isDuplicate returns false when prefix and namespace are both different', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('books', 'id', 'urn:books');
        // Act
        const result: boolean = attribute._isDuplicate(
            'catalog',
            'id',
            'urn:catalog'
        );
        // Assert
        expect(result).toBeFalsy();
    });
    it('destroy clears all attribute properties', () => {
        // Arrange
        const attribute: _XmlAttribute = new _XmlAttribute();
        attribute._set('books', 'id', 'urn:books');
        // Act
        attribute._destroy();
        // Assert
        expect(attribute._prefix).toBeUndefined();
        expect(attribute._localName).toBeUndefined();
        expect(attribute._namespaceUri).toBeUndefined();
    });
});