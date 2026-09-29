import { _XmlReader } from '../src/pdf/core/xmp/xml-reader';
import { PdfXmpMetadata } from '../src/pdf/core/xmp/pdf-xmp-metadata';
function createPacket(description: string): string {
    return '<?xpacket begin=""?>' +
        '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        description +
        '</rdf:RDF>' +
        '</x:xmpmeta>' +
        '<?xpacket end="w"?>';
}
function toBytes(value: string): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(value.length);
    for (let i: number = 0; i < value.length; i++) {
        bytes[i] = value.charCodeAt(i);
    }
    return bytes;
}
describe('_XmlReader mutation coverage lines 7 to 212', () => {
    it('load parses byte data and returns metadata from one RDF description', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Producer>Syncfusion PDF</pdf:Producer>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        // Act
        reader._load(toBytes(xml));
        const metadata: PdfXmpMetadata = reader._parseXmp();
        // Assert
        expect(metadata).toBeDefined();
        expect((metadata.pdfSchema as any).producer).toBe('Syncfusion PDF');
    });
    it('load rejects invalid XML with the parser error text', () => {
        // Arrange
        const malformedXml: string = '<?xpacket begin=""?>' +
            '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
            '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<rdf:Description></rdf:RDF>' +
            '</x:xmpmeta><?xpacket end="w"?>';
        const reader: _XmlReader = new _XmlReader();
        // Act
        const action: () => void = (): void => reader._load(malformedXml);
        // Assert
        expect(action).toThrowError(/Invalid XMP XML:/);
    });
    it('parseXmp processes each RDF description instead of only the first description', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Producer>First Producer</pdf:Producer>' +
            '</rdf:Description>' +
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Keywords>second-keyword</pdf:Keywords>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        // Assert
        expect((metadata.pdfSchema as any).producer).toBe('First Producer');
        expect((metadata.pdfSchema as any).keywords).toBe('second-keyword');
    });
    it('parseBasic assigns every populated scalar date and array property', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/">' +
            '<xmp:CreatorTool>Creator Tool</xmp:CreatorTool>' +
            '<xmp:Label>Approved</xmp:Label>' +
            '<xmp:Nickname>Document One</xmp:Nickname>' +
            '<xmp:BaseURL>https://example.test/base</xmp:BaseURL>' +
            '<xmp:CreateDate>2026-01-02T03:04:05Z</xmp:CreateDate>' +
            '<xmp:ModifyDate>2026-02-03T04:05:06Z</xmp:ModifyDate>' +
            '<xmp:MetadataDate>2026-03-04T05:06:07Z</xmp:MetadataDate>' +
            '<xmp:Advisory><rdf:Bag><rdf:li>advice-one</rdf:li></rdf:Bag></xmp:Advisory>' +
            '<xmp:Identifier><rdf:Bag><rdf:li>id-one</rdf:li></rdf:Bag></xmp:Identifier>' +
            '<xmp:Rating><rdf:Bag><rdf:li>4.5</rdf:li></rdf:Bag></xmp:Rating>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        const schema: any = metadata.basicSchema;
        // Assert
        expect(schema.creatorTool).toBe('Creator Tool');
        expect(schema.label).toBe('Approved');
        expect(schema.nickname).toBe('Document One');
        expect(schema.baseUrl).toBe('https://example.test/base');
        expect(schema.createDate.getTime()).toBe(new Date('2026-01-02T03:04:05Z').getTime());
        expect(schema.modifyDate.getTime()).toBe(new Date('2026-02-03T04:05:06Z').getTime());
        expect(schema.metadataDate.getTime()).toBe(new Date('2026-03-04T05:06:07Z').getTime());
        expect(schema.advisory.length).toBe(1);
        expect(schema.advisory[0]).toBe('advice-one');
        expect(schema.identifier.length).toBe(1);
        expect(schema.identifier[0]).toBe('id-one');
        expect(schema.rating.length).toBe(1);
        expect(schema.rating[0]).toBe(4.5);
    });
    it('parseBasic does not assign empty values or empty arrays', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/">' +
            '<xmp:CreatorTool>   </xmp:CreatorTool>' +
            '<xmp:Advisory><rdf:Bag></rdf:Bag></xmp:Advisory>' +
            '<xmp:Identifier><rdf:Bag></rdf:Bag></xmp:Identifier>' +
            '<xmp:Rating><rdf:Bag></rdf:Bag></xmp:Rating>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        const schema: any = metadata.basicSchema;
        // Assert
        expect(schema.creatorTool).toBeUndefined();
        expect(schema.advisory).toBeUndefined();
        expect(schema.identifier).toBeUndefined();
        expect(schema.rating).toBeUndefined();
    });
    it('parseDublinCore assigns all populated arrays language maps and scalar values', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">' +
            '<dc:contributor><rdf:Bag><rdf:li>Contributor One</rdf:li></rdf:Bag></dc:contributor>' +
            '<dc:creator><rdf:Seq><rdf:li>Creator One</rdf:li></rdf:Seq></dc:creator>' +
            '<dc:date><rdf:Seq><rdf:li>2026-01-01</rdf:li></rdf:Seq></dc:date>' +
            '<dc:publisher><rdf:Bag><rdf:li>Publisher One</rdf:li></rdf:Bag></dc:publisher>' +
            '<dc:relation><rdf:Bag><rdf:li>Relation One</rdf:li></rdf:Bag></dc:relation>' +
            '<dc:subject><rdf:Bag><rdf:li>Subject One</rdf:li></rdf:Bag></dc:subject>' +
            '<dc:type><rdf:Bag><rdf:li>Document</rdf:li></rdf:Bag></dc:type>' +
            '<dc:title><rdf:Alt><rdf:li xml:lang="x-default">Main Title</rdf:li></rdf:Alt></dc:title>' +
            '<dc:description><rdf:Alt><rdf:li xml:lang="en-US">Description</rdf:li></rdf:Alt></dc:description>' +
            '<dc:rights><rdf:Alt><rdf:li xml:lang="en-US">Copyright</rdf:li></rdf:Alt></dc:rights>' +
            '<dc:coverage>Global</dc:coverage>' +
            '<dc:identifier>dc-id</dc:identifier>' +
            '<dc:source>Source One</dc:source>' +
            '<dc:format>application/pdf</dc:format>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        const schema: any = metadata.dublinCoreSchema;
        // Assert
        expect(schema.contributor[0]).toBe('Contributor One');
        expect(schema.creator[0]).toBe('Creator One');
        expect(schema.date[0]).toBe('2026-01-01');
        expect(schema.publisher[0]).toBe('Publisher One');
        expect(schema.relation[0]).toBe('Relation One');
        expect(schema.subject[0]).toBe('Subject One');
        expect(schema.type[0]).toBe('Document');
        expect(schema.title['x-default']).toBe('Main Title');
        expect(schema.description['en-US']).toBe('Description');
        expect(schema.rights['en-US']).toBe('Copyright');
        expect(schema.coverage).toBe('Global');
        expect(schema.identifier).toBe('dc-id');
        expect(schema.source).toBe('Source One');
        expect(schema.format).toBe('application/pdf');
    });
    it('parseDublinCore does not assign empty arrays language maps or scalar values', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">' +
            '<dc:contributor><rdf:Bag></rdf:Bag></dc:contributor>' +
            '<dc:creator><rdf:Seq></rdf:Seq></dc:creator>' +
            '<dc:date><rdf:Seq></rdf:Seq></dc:date>' +
            '<dc:publisher><rdf:Bag></rdf:Bag></dc:publisher>' +
            '<dc:relation><rdf:Bag></rdf:Bag></dc:relation>' +
            '<dc:subject><rdf:Bag></rdf:Bag></dc:subject>' +
            '<dc:type><rdf:Bag></rdf:Bag></dc:type>' +
            '<dc:title><rdf:Alt></rdf:Alt></dc:title>' +
            '<dc:description><rdf:Alt></rdf:Alt></dc:description>' +
            '<dc:rights><rdf:Alt></rdf:Alt></dc:rights>' +
            '<dc:coverage> </dc:coverage>' +
            '<dc:identifier> </dc:identifier>' +
            '<dc:source> </dc:source>' +
            '<dc:format> </dc:format>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        const schema: any = metadata.dublinCoreSchema;
        // Assert
        expect(schema.contributor).toBeUndefined();
        expect(schema.creator).toBeUndefined();
        expect(schema.date).toBeUndefined();
        expect(schema.publisher).toBeUndefined();
        expect(schema.relation).toBeUndefined();
        expect(schema.subject).toBeUndefined();
        expect(schema.type).toBeUndefined();
        expect(schema.title).toBeUndefined();
        expect(schema.description).toBeUndefined();
        expect(schema.rights).toBeUndefined();
        expect(schema.coverage).toBeUndefined();
        expect(schema.identifier).toBeUndefined();
        expect(schema.source).toBeUndefined();
        expect(schema.format).toBeUndefined();
    });
    it('parsePdf assigns only populated PDF schema values', () => {
        // Arrange
        const xml: string = createPacket(
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Keywords>pdf,test</pdf:Keywords>' +
            '<pdf:Producer>Producer One</pdf:Producer>' +
            '<pdf:PDFVersion>2.0</pdf:PDFVersion>' +
            '</rdf:Description>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(xml);
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        const schema: any = metadata.pdfSchema;
        // Assert
        expect(schema.keywords).toBe('pdf,test');
        expect(schema.producer).toBe('Producer One');
        expect(schema.pdfVersion).toBe('2.0');
    });
});
function parseMetadata(description: string): PdfXmpMetadata {
    const reader: _XmlReader = new _XmlReader();
    reader._load(createPacket(description));
    return reader._parseXmp();
}
function createBasicDescription(content: string): string {
    return '<rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/">' +
        content +
        '</rdf:Description>';
}
describe('_XmlReader mutation coverage lines 7 to 138 every survivor', () => {
    function createPacket(descriptions: string): string {
        return '<?xpacket begin=""?>' +
            '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
            '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            descriptions +
            '</rdf:RDF>' +
            '</x:xmpmeta>' +
            '<?xpacket end="w"?>';
    }
    it('mutant 351 parseXmp enters the description loop when a description exists', () => {
        // Arrange
        const description: string =
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Producer>Producer One</pdf:Producer>' +
            '</rdf:Description>';
        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        // Assert
        expect((metadata.pdfSchema as any).producer).toBe('Producer One');
    });
    it('mutant 353 parseXmp advances to the second description', () => {
        // Arrange
        const descriptions: string =
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Producer>Producer One</pdf:Producer>' +
            '</rdf:Description>' +
            '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
            '<pdf:Keywords>second-value</pdf:Keywords>' +
            '</rdf:Description>';
        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(descriptions));
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        // Assert
        expect((metadata.pdfSchema as any).producer).toBe('Producer One');
        expect((metadata.pdfSchema as any).keywords).toBe('second-value');
    });
    it('mutant 354 parseXmp executes the description loop body', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Label>Loop Body Label</xmp:Label>'
        );
        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        // Act
        const metadata: PdfXmpMetadata = reader._parseXmp();
        // Assert
        expect((metadata.basicSchema as any).label).toBe('Loop Body Label');
    });
    it('mutant 372 validate uses parser error text when text is present', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const invalidDocument: Document = new DOMParser().parseFromString(
            '<root><invalid></root>',
            'application/xml'
        );
        const parserError: Element = invalidDocument.querySelector('parsererror');
        const expectedText: string = parserError.textContent as string;
        // Act
        const action: () => void = (): void => (reader as any)._validate(invalidDocument);
        // Assert
        expect(expectedText.length).toBeGreaterThan(0);
        expect(action).toThrowError('Invalid XMP XML: ' + expectedText);
    });
    it('mutant 373 validate does not throw for a valid XML document', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const validDocument: Document = new DOMParser().parseFromString(
            '<root><value>valid</value></root>',
            'application/xml'
        );
        // Act
        (reader as any)._validate(validDocument);
        // Assert
        expect(validDocument.querySelector('parsererror')).toBeNull();
        expect(validDocument.documentElement.localName).toBe('root');
    });
    it('mutant 374 validate does not replace populated parser text with the fallback', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const invalidDocument: Document = new DOMParser().parseFromString(
            '<root><invalid></root>',
            'application/xml'
        );
        const parserError: Element = invalidDocument.querySelector('parsererror');
        const parserText: string = parserError.textContent as string;
        // Act
        const action: () => void = (): void => (reader as any)._validate(invalidDocument);
        // Assert
        expect(parserText).not.toBe('Unknown parse error');
        expect(action).toThrowError('Invalid XMP XML: ' + parserText);
    });
    it('mutant 428 parseBasic assigns CreatorTool only when populated', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:CreatorTool>Creator Tool</xmp:CreatorTool>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).creatorTool).toBe('Creator Tool');
    });
    it('mutant 432 parseBasic assigns Label only when populated', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Label>Approved</xmp:Label>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).label).toBe('Approved');
    });
    it('mutant 436 parseBasic assigns Nickname only when populated', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Nickname>Document One</xmp:Nickname>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).nickname).toBe('Document One');
    });
    it('mutant 440 parseBasic assigns BaseURL only when populated', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:BaseURL>https://example.test/base</xmp:BaseURL>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).baseUrl).toBe('https://example.test/base');
    });
    it('mutant 444 parseBasic assigns CreateDate only when valid', () => {
        // Arrange
        const dateText: string = '2026-01-02T03:04:05Z';
        const description: string = createBasicDescription(
            '<xmp:CreateDate>' + dateText + '</xmp:CreateDate>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).createDate.getTime()).toBe(new Date(dateText).getTime());
    });
    it('mutant 448 parseBasic assigns ModifyDate only when valid', () => {
        // Arrange
        const dateText: string = '2026-02-03T04:05:06Z';
        const description: string = createBasicDescription(
            '<xmp:ModifyDate>' + dateText + '</xmp:ModifyDate>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).modifyDate.getTime()).toBe(new Date(dateText).getTime());
    });
    it('mutant 452 parseBasic assigns MetadataDate only when valid', () => {
        // Arrange
        const dateText: string = '2026-03-04T05:06:07Z';
        const description: string = createBasicDescription(
            '<xmp:MetadataDate>' + dateText + '</xmp:MetadataDate>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).metadataDate.getTime()).toBe(new Date(dateText).getTime());
    });
    it('mutant 456 parseBasic assigns a populated Advisory array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Advisory><rdf:Bag><rdf:li>advice-one</rdf:li></rdf:Bag></xmp:Advisory>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const advisory: string[] = (metadata.basicSchema as any).advisory;
        // Assert
        expect(advisory.length).toBe(1);
        expect(advisory[0]).toBe('advice-one');
    });
    it('mutant 458 parseBasic does not assign an empty Advisory array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Advisory><rdf:Bag></rdf:Bag></xmp:Advisory>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).advisory).toBeUndefined();
    });
    it('mutant 462 parseBasic assigns a populated Identifier array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Identifier><rdf:Bag><rdf:li>identifier-one</rdf:li></rdf:Bag></xmp:Identifier>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const identifier: string[] = (metadata.basicSchema as any).identifier;
        // Assert
        expect(identifier.length).toBe(1);
        expect(identifier[0]).toBe('identifier-one');
    });
    it('mutant 464 parseBasic does not assign an empty Identifier array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Identifier><rdf:Bag></rdf:Bag></xmp:Identifier>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).identifier).toBeUndefined();
    });
    it('mutant 474 parseBasic assigns and converts a populated Rating array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Rating><rdf:Bag><rdf:li>4.5</rdf:li></rdf:Bag></xmp:Rating>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const rating: number[] = (metadata.basicSchema as any).rating;
        // Assert
        expect(rating.length).toBe(1);
        expect(rating[0]).toBe(4.5);
    });
    it('mutant 476 parseBasic does not assign an empty Rating array', () => {
        // Arrange
        const description: string = createBasicDescription(
            '<xmp:Rating><rdf:Bag></rdf:Bag></xmp:Rating>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.basicSchema as any).rating).toBeUndefined();
    });
});
function createDublinCoreDescription(content: string): string {
    return '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        content +
        '</rdf:Description>';
}
function createPdfDescription(content: string): string {
    return '<rdf:Description xmlns:pdf="http://ns.adobe.com/pdf/1.3/">' +
        content +
        '</rdf:Description>';
}
describe('_XmlReader mutation coverage lines 138 to 213 every survivor', () => {
    function parseMetadata(description: string): PdfXmpMetadata {
        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        return reader._parseXmp();
    }
    function createPacket(description: string): string {
        return '<?xpacket begin=""?>' +
            '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
            '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            description +
            '</rdf:RDF>' +
            '</x:xmpmeta>' +
            '<?xpacket end="w"?>';
    }
    it('mutant 482 parseDublinCore assigns a populated Contributor array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:contributor><rdf:Bag><rdf:li>Contributor One</rdf:li></rdf:Bag></dc:contributor>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const contributor: string[] = (metadata.dublinCoreSchema as any).contributor;
        // Assert
        expect(contributor.length).toBe(1);
        expect(contributor[0]).toBe('Contributor One');
    });
    it('mutant 484 parseDublinCore does not assign an empty Contributor array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:contributor><rdf:Bag></rdf:Bag></dc:contributor>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).contributor).toBeUndefined();
    });
    it('mutant 487 parseDublinCore preserves the Creator tag name', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:creator><rdf:Seq><rdf:li>Creator One</rdf:li></rdf:Seq></dc:creator>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const creator: string[] = (metadata.dublinCoreSchema as any).creator;
        // Assert
        expect(creator.length).toBe(1);
        expect(creator[0]).toBe('Creator One');
    });
    it('mutant 488 parseDublinCore assigns a populated Creator array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:creator><rdf:Seq><rdf:li>Creator Two</rdf:li></rdf:Seq></dc:creator>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const creator: string[] = (metadata.dublinCoreSchema as any).creator;
        // Assert
        expect(creator.length).toBe(1);
        expect(creator[0]).toBe('Creator Two');
    });
    it('mutant 490 parseDublinCore does not assign an empty Creator array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:creator><rdf:Seq></rdf:Seq></dc:creator>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).creator).toBeUndefined();
    });
    it('mutant 494 parseDublinCore assigns a populated Date array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:date><rdf:Seq><rdf:li>2026-01-01</rdf:li></rdf:Seq></dc:date>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const date: string[] = (metadata.dublinCoreSchema as any).date;
        // Assert
        expect(date.length).toBe(1);
        expect(date[0]).toBe('2026-01-01');
    });
    it('mutant 496 parseDublinCore does not assign an empty Date array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:date><rdf:Seq></rdf:Seq></dc:date>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).date).toBeUndefined();
    });
    it('mutant 500 parseDublinCore assigns a populated Publisher array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:publisher><rdf:Bag><rdf:li>Publisher One</rdf:li></rdf:Bag></dc:publisher>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const publisher: string[] = (metadata.dublinCoreSchema as any).publisher;
        // Assert
        expect(publisher.length).toBe(1);
        expect(publisher[0]).toBe('Publisher One');
    });
    it('mutant 502 parseDublinCore does not assign an empty Publisher array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:publisher><rdf:Bag></rdf:Bag></dc:publisher>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).publisher).toBeUndefined();
    });
    it('mutant 506 parseDublinCore assigns a populated Relation array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:relation><rdf:Bag><rdf:li>Relation One</rdf:li></rdf:Bag></dc:relation>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const relation: string[] = (metadata.dublinCoreSchema as any).relation;
        // Assert
        expect(relation.length).toBe(1);
        expect(relation[0]).toBe('Relation One');
    });
    it('mutant 508 parseDublinCore does not assign an empty Relation array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:relation><rdf:Bag></rdf:Bag></dc:relation>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).relation).toBeUndefined();
    });
    it('mutant 512 parseDublinCore assigns a populated Subject array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:subject><rdf:Bag><rdf:li>Subject One</rdf:li></rdf:Bag></dc:subject>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const subject: string[] = (metadata.dublinCoreSchema as any).subject;
        // Assert
        expect(subject.length).toBe(1);
        expect(subject[0]).toBe('Subject One');
    });
    it('mutant 514 parseDublinCore does not assign an empty Subject array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:subject><rdf:Bag></rdf:Bag></dc:subject>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).subject).toBeUndefined();
    });
    it('mutant 518 parseDublinCore assigns a populated Type array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:type><rdf:Bag><rdf:li>Document</rdf:li></rdf:Bag></dc:type>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const type: string[] = (metadata.dublinCoreSchema as any).type;
        // Assert
        expect(type.length).toBe(1);
        expect(type[0]).toBe('Document');
    });
    it('mutant 520 parseDublinCore does not assign an empty Type array', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:type><rdf:Bag></rdf:Bag></dc:type>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).type).toBeUndefined();
    });
    it('mutant 524 parseDublinCore assigns a populated Title language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:title><rdf:Alt><rdf:li xml:lang="x-default">Main Title</rdf:li></rdf:Alt></dc:title>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const title: any = (metadata.dublinCoreSchema as any).title;
        // Assert
        expect(title['x-default']).toBe('Main Title');
    });
    it('mutant 526 parseDublinCore does not assign an empty Title language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:title><rdf:Alt></rdf:Alt></dc:title>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).title).toBeUndefined();
    });
    it('mutant 530 parseDublinCore assigns a populated Description language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:description><rdf:Alt><rdf:li xml:lang="en-US">Description One</rdf:li></rdf:Alt></dc:description>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const languageDescription: any = (metadata.dublinCoreSchema as any).description;
        // Assert
        expect(languageDescription['en-US']).toBe('Description One');
    });
    it('mutant 532 parseDublinCore does not assign an empty Description language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:description><rdf:Alt></rdf:Alt></dc:description>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).description).toBeUndefined();
    });
    it('mutant 536 parseDublinCore assigns a populated Rights language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:rights><rdf:Alt><rdf:li xml:lang="en-US">Copyright One</rdf:li></rdf:Alt></dc:rights>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const rights: any = (metadata.dublinCoreSchema as any).rights;
        // Assert
        expect(rights['en-US']).toBe('Copyright One');
    });
    it('mutant 538 parseDublinCore does not assign an empty Rights language map', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:rights><rdf:Alt></rdf:Alt></dc:rights>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).rights).toBeUndefined();
    });
    it('mutant 542 parseDublinCore assigns Coverage only when populated', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:coverage>Global</dc:coverage>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).coverage).toBe('Global');
    });
    it('mutant 546 parseDublinCore assigns Identifier only when populated', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:identifier>dc-identifier</dc:identifier>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).identifier).toBe('dc-identifier');
    });
    it('mutant 550 parseDublinCore assigns Source only when populated', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:source>Source One</dc:source>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).source).toBe('Source One');
    });
    it('mutant 554 parseDublinCore assigns Format only when populated', () => {
        // Arrange
        const description: string = createDublinCoreDescription(
            '<dc:format>application/pdf</dc:format>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.dublinCoreSchema as any).format).toBe('application/pdf');
    });
    it('mutant 559 parsePdf assigns Keywords only when populated', () => {
        // Arrange
        const description: string = createPdfDescription(
            '<pdf:Keywords>pdf,test</pdf:Keywords>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.pdfSchema as any).keywords).toBe('pdf,test');
    });
    it('mutant 563 parsePdf assigns Producer only when populated', () => {
        // Arrange
        const description: string = createPdfDescription(
            '<pdf:Producer>Producer One</pdf:Producer>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.pdfSchema as any).producer).toBe('Producer One');
    });
    it('mutant 567 parsePdf assigns PDFVersion only when populated', () => {
        // Arrange
        const description: string = createPdfDescription(
            '<pdf:PDFVersion>2.0</pdf:PDFVersion>'
        );
        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        // Assert
        expect((metadata.pdfSchema as any).pdfVersion).toBe('2.0');
    });
});


function createPagedTextDescription(content: string): string {
    return '<rdf:Description xmlns:xmpTPg="http://ns.adobe.com/xap/1.0/t/pg/">' +
        content +
        '</rdf:Description>';
}

function createRightsDescription(content: string): string {
    return '<rdf:Description xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">' +
        content +
        '</rdf:Description>';
}

function createJobTicketDescription(content: string): string {
    return '<rdf:Description xmlns:xmpBJ="http://ns.adobe.com/xap/1.0/bj/">' +
        content +
        '</rdf:Description>';
}

function createDescriptionElement(xml: string): Element {
    const documentValue: Document = new DOMParser().parseFromString(xml, 'application/xml');
    return documentValue.documentElement;
}

describe('_XmlReader mutation coverage lines 213 to 308 every survivor', () => {
    
function createPacket(description: string): string {
    return '<?xpacket begin=""?>' +
        '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        description +
        '</rdf:RDF>' +
        '</x:xmpmeta>' +
        '<?xpacket end="w"?>';
}

function parseMetadata(description: string): PdfXmpMetadata {
    const reader: _XmlReader = new _XmlReader();
    reader._load(createPacket(description));
    return reader._parseXmp();
}
    it('mutant 591 parsePagedText assigns the MaxPageSize unit when populated', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:MaxPageSize><rdf:Description>' +
            '<xmpTPg:w>612</xmpTPg:w><xmpTPg:h>792</xmpTPg:h>' +
            '<xmpTPg:unit>points</xmpTPg:unit>' +
            '</rdf:Description></xmpTPg:MaxPageSize>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const maxPageSize: any = (metadata.pagedTextSchema as any).maxPageSize;

        // Assert
        expect(maxPageSize.width).toBe(612);
        expect(maxPageSize.height).toBe(792);
        expect(maxPageSize.unit).toBe('points');
    });

    it('mutant 595 parsePagedText assigns a populated Fonts array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:Fonts><rdf:Bag><rdf:li>Arial</rdf:li></rdf:Bag></xmpTPg:Fonts>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const fonts: string[] = (metadata.pagedTextSchema as any).fonts;

        // Assert
        expect(fonts.length).toBe(1);
        expect(fonts[0]).toBe('Arial');
    });

    it('mutant 597 parsePagedText does not assign an empty Fonts array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:Fonts><rdf:Bag></rdf:Bag></xmpTPg:Fonts>'
        );

        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        (reader as any)._xmp = new PdfXmpMetadata();
        const originalFonts: string[] = ['Existing Font'];
        ((reader as any)._xmp.pagedTextSchema as any).fonts = originalFonts;
        const rdfRoot: Element = (reader as any)._getRdfRoot();
        const node: Element = rdfRoot.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'Description'
        ).item(0);

        // Act
        (reader as any)._parsePagedText(node);
        const currentFonts: string[] = ((reader as any)._xmp.pagedTextSchema as any).fonts;

        // Assert
        expect(currentFonts).toBe(originalFonts);
        expect(currentFonts.length).toBe(1);
        expect(currentFonts[0]).toBe('Existing Font');
    });

    it('mutant 601 parsePagedText assigns a populated PlateNames array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:PlateNames><rdf:Bag><rdf:li>Black</rdf:li></rdf:Bag></xmpTPg:PlateNames>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const plateNames: string[] = (metadata.pagedTextSchema as any).plateNames;

        // Assert
        expect(plateNames.length).toBe(1);
        expect(plateNames[0]).toBe('Black');
    });

    it('mutant 603 parsePagedText does not assign an empty PlateNames array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:PlateNames><rdf:Bag></rdf:Bag></xmpTPg:PlateNames>'
        );

        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        (reader as any)._xmp = new PdfXmpMetadata();
        const originalPlateNames: string[] = ['Existing Plate'];
        ((reader as any)._xmp.pagedTextSchema as any).plateNames = originalPlateNames;
        const rdfRoot: Element = (reader as any)._getRdfRoot();
        const node: Element = rdfRoot.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'Description'
        ).item(0);

        // Act
        (reader as any)._parsePagedText(node);
        const currentPlateNames: string[] = ((reader as any)._xmp.pagedTextSchema as any).plateNames;

        // Assert
        expect(currentPlateNames).toBe(originalPlateNames);
        expect(currentPlateNames.length).toBe(1);
        expect(currentPlateNames[0]).toBe('Existing Plate');
    });

    it('mutant 607 parsePagedText assigns a populated Colorants array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:Colorants><rdf:Bag><rdf:li>Cyan</rdf:li></rdf:Bag></xmpTPg:Colorants>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const colorants: string[] = (metadata.pagedTextSchema as any).colorants;

        // Assert
        expect(colorants.length).toBe(1);
        expect(colorants[0]).toBe('Cyan');
    });

    it('mutant 609 parsePagedText does not assign an empty Colorants array', () => {
        // Arrange
        const description: string = createPagedTextDescription(
            '<xmpTPg:Colorants><rdf:Bag></rdf:Bag></xmpTPg:Colorants>'
        );

        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        (reader as any)._xmp = new PdfXmpMetadata();
        const originalColorants: string[] = ['Existing Colorant'];
        ((reader as any)._xmp.pagedTextSchema as any).colorants = originalColorants;
        const rdfRoot: Element = (reader as any)._getRdfRoot();
        const node: Element = rdfRoot.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'Description'
        ).item(0);

        // Act
        (reader as any)._parsePagedText(node);
        const currentColorants: string[] = ((reader as any)._xmp.pagedTextSchema as any).colorants;

        // Assert
        expect(currentColorants).toBe(originalColorants);
        expect(currentColorants.length).toBe(1);
        expect(currentColorants[0]).toBe('Existing Colorant');
    });

    it('mutant 614 parseRights assigns Certificate only when populated', () => {
        // Arrange
        const description: string = createRightsDescription(
            '<xmpRights:Certificate>https://example.test/certificate</xmpRights:Certificate>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);

        // Assert
        expect((metadata.rightsManagementSchema as any).certificateUrl)
            .toBe('https://example.test/certificate');
    });

    it('mutant 618 parseRights assigns WebStatement only when populated', () => {
        // Arrange
        const description: string = createRightsDescription(
            '<xmpRights:WebStatement>https://example.test/rights</xmpRights:WebStatement>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);

        // Assert
        expect((metadata.rightsManagementSchema as any).webStatement)
            .toBe('https://example.test/rights');
    });

    it('mutant 622 parseRights assigns the Marked boolean output', () => {
        // Arrange
        const description: string = createRightsDescription(
            '<xmpRights:Marked>False</xmpRights:Marked>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);

        // Assert
        expect((metadata.rightsManagementSchema as any).isMarked).toBeFalsy();
    });

    it('mutant 630 parseRights assigns a populated Owner array', () => {
        // Arrange
        const description: string = createRightsDescription(
            '<xmpRights:Owner><rdf:Bag><rdf:li>Owner One</rdf:li></rdf:Bag></xmpRights:Owner>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const owners: string[] = (metadata.rightsManagementSchema as any).owners;

        // Assert
        expect(owners.length).toBe(1);
        expect(owners[0]).toBe('Owner One');
    });

    it('mutant 632 parseRights does not assign an empty Owner array', () => {
        // Arrange
        const description: string = createRightsDescription(
            '<xmpRights:Owner><rdf:Bag></rdf:Bag></xmpRights:Owner>'
        );

        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        (reader as any)._xmp = new PdfXmpMetadata();
        const originalOwners: string[] = ['Existing Owner'];
        ((reader as any)._xmp.rightsManagementSchema as any).owners = originalOwners;
        const rdfRoot: Element = (reader as any)._getRdfRoot();
        const node: Element = rdfRoot.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'Description'
        ).item(0);

        // Act
        (reader as any)._parseRights(node);
        const currentOwners: string[] = ((reader as any)._xmp.rightsManagementSchema as any).owners;

        // Assert
        expect(currentOwners).toBe(originalOwners);
        expect(currentOwners.length).toBe(1);
        expect(currentOwners[0]).toBe('Existing Owner');
    });

    it('mutant 644 parseJobTicket assigns a populated JobRef array', () => {
        // Arrange
        const description: string = createJobTicketDescription(
            '<xmpBJ:JobRef><rdf:Bag><rdf:li>Job One</rdf:li></rdf:Bag></xmpBJ:JobRef>'
        );

        // Act
        const metadata: PdfXmpMetadata = parseMetadata(description);
        const jobRef: string[] = (metadata.basicJobTicketSchema as any).jobRef;

        // Assert
        expect(jobRef.length).toBe(1);
        expect(jobRef[0]).toBe('Job One');
    });

    it('mutant 646 parseJobTicket does not assign an empty JobRef array', () => {
        // Arrange
        const description: string = createJobTicketDescription(
            '<xmpBJ:JobRef><rdf:Bag></rdf:Bag></xmpBJ:JobRef>'
        );

        const reader: _XmlReader = new _XmlReader();
        reader._load(createPacket(description));
        (reader as any)._xmp = new PdfXmpMetadata();
        const originalJobRef: string[] = ['Existing Job'];
        ((reader as any)._xmp.basicJobTicketSchema as any).jobRef = originalJobRef;
        const rdfRoot: Element = (reader as any)._getRdfRoot();
        const node: Element = rdfRoot.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'Description'
        ).item(0);

        // Act
        (reader as any)._parseJobTicket(node);
        const currentJobRef: string[] = ((reader as any)._xmp.basicJobTicketSchema as any).jobRef;

        // Assert
        expect(currentJobRef).toBe(originalJobRef);
        expect(currentJobRef.length).toBe(1);
        expect(currentJobRef[0]).toBe('Existing Job');
    });

    it('mutant 656 parseInternalCustom accepts a child with the matching prefix', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/">' +
            '<pdfx:Company>Syncfusion</pdfx:Company></rdf:Description>'
        );

        // Act
        (reader as any)._parseInternalCustom('pdfx', 'http://ns.adobe.com/pdfx/1.3/', node);
        const customSchema: any = ((reader as any)._xmp as any)._customSchema;

        // Assert
        expect(customSchema.customData.size).toBe(1);
        expect(customSchema.customData.get('Company')).toBe('Syncfusion');
    });

    it('mutant 664 parseInternalCustom preserves the custom property key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/">' +
            '<pdfx:DocumentID>ID-100</pdfx:DocumentID></rdf:Description>'
        );

        // Act
        (reader as any)._parseInternalCustom('pdfx', 'http://ns.adobe.com/pdfx/1.3/', node);
        const customSchema: any = ((reader as any)._xmp as any)._customSchema;

        // Assert
        expect(customSchema.customData.has('DocumentID')).toBeTruthy();
        expect(customSchema.customData.has('')).toBeFalsy();
    });

    it('mutant 665 parseInternalCustom removes only the actual prefix from the key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/">' +
            '<pdfx:VersionID>Version One</pdfx:VersionID></rdf:Description>'
        );

        // Act
        (reader as any)._parseInternalCustom('pdfx', 'http://ns.adobe.com/pdfx/1.3/', node);
        const customSchema: any = ((reader as any)._xmp as any)._customSchema;

        // Assert
        expect(customSchema.customData.get('VersionID')).toBe('Version One');
        expect(customSchema.customData.has('pdfx:VersionID')).toBeFalsy();
    });

    it('mutant 670 parseInternalCustom stores a nonempty schema on the metadata object', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        (reader as any)._xmp = metadata;
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/">' +
            '<pdfx:Property>Value</pdfx:Property></rdf:Description>'
        );

        // Act
        (reader as any)._parseInternalCustom('pdfx', 'http://ns.adobe.com/pdfx/1.3/', node);

        // Assert
        expect((metadata as any)._customSchema).toBeDefined();
        expect((metadata as any)._customSchema.customData.size).toBe(1);
    });

    it('mutant 672 parseInternalCustom does not store an empty schema', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        (reader as any)._xmp = metadata;
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/"></rdf:Description>'
        );

        // Act
        (reader as any)._parseInternalCustom('pdfx', 'http://ns.adobe.com/pdfx/1.3/', node);

        // Assert
        expect((metadata as any)._customSchema).toBeUndefined();
    });

    it('mutant 677 parseCustom enters the child iteration loop', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Name>Alpha</custom:Name></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Name') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(1);
        expect(recordedKeys[0]).toBe('Name');
    });

    it('mutant 679 parseCustom stops after all children have been processed', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:One>1</custom:One><custom:Two>2</custom:Two>' +
            '</rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'One' || key === 'Two') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(2);
        expect(recordedKeys[0]).toBe('One');
        expect(recordedKeys[1]).toBe('Two');
    });

    it('mutant 681 parseCustom executes the loop body for each custom child', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Code>C-1</custom:Code></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        let customSetCount: number = 0;
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Code') {
                customSetCount++;
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(customSetCount).toBe(1);
    });

    it('mutant 682 parseCustom accepts a child whose prefix exactly matches', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Exact>Matched</custom:Exact></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedValues: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Exact') {
                recordedValues.push(value as string);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedValues.length).toBe(1);
        expect(recordedValues[0]).toBe('Matched');
    });

    it('mutant 683 parseCustom ignores a child whose prefix does not match', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test" xmlns:other="urn:other:test">' +
            '<other:Ignored>Value</other:Ignored></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        let ignoredSetCount: number = 0;
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Ignored') {
                ignoredSetCount++;
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(ignoredSetCount).toBe(0);
    });

    it('mutant 684 parseCustom accepts prefix equality without requiring both alternatives', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:OnlyPrefix>Value</custom:OnlyPrefix></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        let matchingSetCount: number = 0;
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'OnlyPrefix') {
                matchingSetCount++;
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(matchingSetCount).toBe(1);
    });

    it('mutant 685 parseCustom does not reject an exact prefix match', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Accepted>Yes</custom:Accepted></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Accepted') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(1);
        expect(recordedKeys[0]).toBe('Accepted');
    });

    it('mutant 686 parseCustom uses prefix equality rather than inequality', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test" xmlns:other="urn:other:test">' +
            '<custom:Included>One</custom:Included><other:Excluded>Two</other:Excluded>' +
            '</rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Included' || key === 'Excluded') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(1);
        expect(recordedKeys[0]).toBe('Included');
    });

    it('mutant 689 parseCustom executes the matching-child block', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Block>Executed</custom:Block></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        let blockSetCount: number = 0;
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Block') {
                blockSetCount++;
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(blockSetCount).toBe(1);
    });

    it('mutant 690 parseCustom preserves the extracted property key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:PropertyKey>Value</custom:PropertyKey></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'PropertyKey' || key === '') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(1);
        expect(recordedKeys[0]).toBe('PropertyKey');
    });

    it('mutant 691 parseCustom removes the real prefix text from the property key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Version>One</custom:Version></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedKeys: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Version' || key === 'custom:Version') {
                recordedKeys.push(key);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedKeys.length).toBe(1);
        expect(recordedKeys[0]).toBe('Version');
    });

    it('mutant 694 parseCustom uses text content instead of replacing it with an empty value', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        (reader as any)._xmp = new PdfXmpMetadata();
        const node: Element = createDescriptionElement(
            '<rdf:Description xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:custom="urn:custom:test"><custom:Text>Preserved Value</custom:Text></rdf:Description>'
        );
        const originalSet: (key: any, value: any) => Map<any, any> = Map.prototype.set;
        const recordedValues: string[] = [];
        Map.prototype.set = function(key: any, value: any): Map<any, any> {
            if (key === 'Text') {
                recordedValues.push(value as string);
            }
            return originalSet.call(this, key, value);
        };

        // Act
        (reader as any)._parseCustom('custom', 'urn:custom:test', node);
        Map.prototype.set = originalSet;

        // Assert
        expect(recordedValues.length).toBe(1);
        expect(recordedValues[0]).toBe('Preserved Value');
    });
});
import { PdfXmpLangArray, PdfXmpThumbnail } from '../src/pdf/core/pdf-type';

function createElement(xml: string): Element {
    const documentValue: Document = new DOMParser().parseFromString(xml, 'application/xml');
    return documentValue.documentElement;
}

function getValue(reader: _XmlReader, node: Element, tag: string): string {
    return (reader as any)._getValue(node, tag);
}

function getDate(reader: _XmlReader, node: Element, tag: string): Date {
    return (reader as any)._getDate(node, tag);
}

function getArray(reader: _XmlReader, node: Element, tag: string): string[] {
    return (reader as any)._getArray(node, tag);
}

function getLangArray(reader: _XmlReader, node: Element, tag: string): PdfXmpLangArray {
    return (reader as any)._getLangArray(node, tag);
}

function getThumbnails(reader: _XmlReader, node: Element, tag: string): PdfXmpThumbnail[] {
    return (reader as any)._getThumbnails(node, tag);
}

function createLangNode(language: string, text: string): Element {
    return createElement(
        '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<title><rdf:Alt><rdf:li xml:lang="' + language + '">' + text + '</rdf:li></rdf:Alt></title>' +
        '</root>'
    );
}

function createThumbnailNode(content: string): Element {
    return createElement(
        '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<Thumbnails><rdf:Bag><rdf:li>' + content + '</rdf:li></rdf:Bag></Thumbnails>' +
        '</root>'
    );
}

describe('_XmlReader mutation coverage lines 308 to 441 every survivor', () => {
    it('mutant 700 getValue trims child text content', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement('<root><Value>  trimmed value  </Value></root>');

        // Act
        const value: string = getValue(reader, node, 'Value');

        // Assert
        expect(value).toBe('trimmed value');
    });

    it('mutant 702 getValue returns the populated child value', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement('<root Value="attribute value"><Value>child value</Value></root>');

        // Act
        const value: string = getValue(reader, node, 'Value');

        // Assert
        expect(value).toBe('child value');
        expect(value).not.toBe('attribute value');
    });

    it('mutant 719 getDate does not create a date when the value is missing', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement('<root></root>');

        // Act
        const value: Date = getDate(reader, node, 'CreateDate');

        // Assert
        expect(value).toBeUndefined();
    });

    it('mutant 723 getDate does not return an invalid date', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement('<root><CreateDate>invalid-date</CreateDate></root>');

        // Act
        const value: Date = getDate(reader, node, 'CreateDate');

        // Assert
        expect(value).toBeUndefined();
    });

    it('mutant 745 getArray ignores an empty list item', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement(
            '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<Values><rdf:Bag><rdf:li></rdf:li></rdf:Bag></Values></root>'
        );

        // Act
        const values: string[] = getArray(reader, node, 'Values');

        // Assert
        expect(values.length).toBe(0);
    });

    it('mutant 748 getArray trims list item text', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement(
            '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<Values><rdf:Bag><rdf:li>  first value  </rdf:li></rdf:Bag></Values></root>'
        );

        // Act
        const values: string[] = getArray(reader, node, 'Values');

        // Assert
        expect(values.length).toBe(1);
        expect(values[0]).toBe('first value');
    });

    it('mutant 764 getLangArray ignores a list item without a language', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement(
            '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<title><rdf:Alt><rdf:li>Text</rdf:li></rdf:Alt></title></root>'
        );

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any)['']).toBeUndefined();
    });

    it('mutant 766 getLangArray rejects the prototype language key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('prototype', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).prototype).toBeUndefined();
    });

    it('mutant 767 getLangArray rejects the constructor language key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('constructor', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).constructor).toBe(Object);
    });

    it('mutant 768 getLangArray does not add the constructor language value', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('constructor', 'changed constructor');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).constructor).not.toBe('changed constructor');
    });

    it('mutant 769 getLangArray rejects the proto language key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('__proto__', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).__proto__).toBe(Object.prototype);
    });

    it('mutant 770 getLangArray does not mutate the object prototype', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('__proto__', 'prototype mutation');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).__proto__).toBe(Object.prototype);
        expect((values as any).__proto__).not.toBe('prototype mutation');
    });

    it('mutant 771 getLangArray requires a language value', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement(
            '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<title><rdf:Alt><rdf:li>language missing</rdf:li></rdf:Alt></title></root>'
        );

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any)['']).toBeUndefined();
    });

    it('mutant 772 getLangArray requires both language and text', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('en-US', '');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any)['en-US']).toBeUndefined();
    });

    it('mutant 773 getLangArray rejects proto even when text is populated', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('__proto__', 'blocked text');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).__proto__).toBe(Object.prototype);
    });

    it('mutant 775 getLangArray compares the complete proto key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('__proto__', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).__proto__).not.toBe('blocked');
    });

    it('mutant 776 getLangArray rejects constructor after earlier conditions pass', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('constructor', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).constructor).toBe(Object);
    });

    it('mutant 778 getLangArray compares the complete constructor key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('constructor', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).constructor).not.toBe('blocked');
    });

    it('mutant 779 getLangArray rejects prototype after earlier conditions pass', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('prototype', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).prototype).toBeUndefined();
    });

    it('mutant 781 getLangArray compares the complete prototype key', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('prototype', 'blocked');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any).prototype).not.toBe('blocked');
    });

    it('mutant 783 getLangArray trims the stored language text', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createLangNode('en-US', '  localized text  ');

        // Act
        const values: PdfXmpLangArray = getLangArray(reader, node, 'title');

        // Assert
        expect((values as any)['en-US']).toBe('localized text');
    });

    it('mutant 790 getThumbnails requires an RDF Bag container', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement(
            '<root xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
            '<Thumbnails><rdf:Seq><rdf:li><width>10</width><height>20</height>' +
            '<format>JPEG</format><image>data</image></rdf:li></rdf:Seq></Thumbnails></root>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 802 getThumbnails falls back from lowercase width to uppercase Width', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<Width>120</Width><height>80</height><format>JPEG</format><image>image-data</image>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(1);
        expect(thumbnails[0].width).toBe(120);
    });

    it('mutant 807 getThumbnails falls back from lowercase height to uppercase Height', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<width>120</width><Height>80</Height><format>JPEG</format><image>image-data</image>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(1);
        expect(thumbnails[0].height).toBe(80);
    });

    it('mutant 812 getThumbnails falls back from lowercase format to uppercase Format', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<width>120</width><height>80</height><Format>PNG</Format><image>image-data</image>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(1);
        expect(thumbnails[0].format).toBe('PNG');
    });

    it('mutant 817 getThumbnails falls back from lowercase image to uppercase Image', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<width>120</width><height>80</height><format>JPEG</format><Image>upper-image</Image>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(1);
        expect(thumbnails[0].image).toBe('upper-image');
    });

    it('mutant 821 getThumbnails rejects an item without an image', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<width>120</width><height>80</height><format>JPEG</format>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 822 getThumbnails does not create a thumbnail without required values', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode('<width>120</width>');

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 823 getThumbnails rejects an item without format and image', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode('<width>120</width><height>80</height>');

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 824 getThumbnails rejects an item without height format and image', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode('<width>120</width>');

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 825 getThumbnails requires both width and height', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createThumbnailNode(
            '<width>120</width><format>JPEG</format><image>image-data</image>'
        );

        // Act
        const thumbnails: PdfXmpThumbnail[] = getThumbnails(reader, node, 'Thumbnails');

        // Assert
        expect(thumbnails.length).toBe(0);
    });

    it('mutant 844 findDirectChild skips a nonmatching child and returns the matching child', () => {
        // Arrange
        const reader: _XmlReader = new _XmlReader();
        const node: Element = createElement('<root><First>one</First><Target>two</Target></root>');

        // Act
        const result: Element = (reader as any)._findDirectChild(node, 'Target');

        // Assert
        expect(result).toBe(node.children.item(1) as Element);
        expect(result.localName).toBe('Target');
        expect(result.textContent).toBe('two');
    });
});
