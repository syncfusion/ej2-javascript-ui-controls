import { _JsonDocument } from '../src/pdf/core/import-export/json-document';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfButtonField } from '../src/pdf/core/form/field';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfFreeTextAnnotation } from '../src/pdf/core/annotations/annotation';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { _PdfContentStream } from '../src/pdf/core/base-stream';
describe('JsonDocument survived mutation coverage', () => {
    it('constructor initializes export state and stores a valid file name', () => {
        // Arrange
        const fileName: string = 'annotations.json';
        // Act
        const jsonDocument: _JsonDocument = new _JsonDocument(fileName);
        // Assert
        expect(jsonDocument._isImport).toBeFalsy();
        expect(jsonDocument._isColorSpace).toBeFalsy();
        expect(jsonDocument._isDuplicate).toBeFalsy();
        expect(jsonDocument._isGroupingSupport).toBeFalsy();
        expect(jsonDocument._fileName).toBe(fileName);
    });
    it('constructor does not change the default file name when null is supplied', () => {
        // Arrange
        const fileName: string = null;
        // Act
        const jsonDocument: _JsonDocument = new _JsonDocument(fileName);
        // Assert
        expect(jsonDocument._fileName).toBe('');
        expect(jsonDocument._isImport).toBeFalsy();
        expect(jsonDocument._isDuplicate).toBeFalsy();
        expect(jsonDocument._isGroupingSupport).toBeFalsy();
    });
    it('constructor does not change the default file name when undefined is supplied', () => {
        // Arrange
        const fileName: string = undefined;
        // Act
        const jsonDocument: _JsonDocument = new _JsonDocument(fileName);
        // Assert
        expect(jsonDocument._fileName).toBe('');
        expect(jsonDocument._isImport).toBeFalsy();
        expect(jsonDocument._isDuplicate).toBeFalsy();
        expect(jsonDocument._isGroupingSupport).toBeFalsy();
    });
    it('exportAnnotations initializes annotation export context and returns annotation JSON', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const jsonDocument: _JsonDocument = new _JsonDocument('annotations.json');
        // Act
        const result: Uint8Array = jsonDocument._exportAnnotations(document);
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonDocument._document).toBe(document);
        expect(jsonDocument._crossReference).toBe(document._crossReference);
        expect(jsonDocument._isAnnotationExport).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        expect(jsonText).toBe('{"pdfAnnotation":{}}');
        expect(jsonDocument._jsonData.length).toBe(0);
    });
    it('exportFormFields sets form export state and writes an empty form object', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const jsonDocument: _JsonDocument = new _JsonDocument('fields.json');
        // Act
        const result: Uint8Array = jsonDocument._exportFormFields(document);
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonDocument._document).toBe(document);
        expect(jsonDocument._crossReference).toBe(document._crossReference);
        expect(jsonDocument._isAnnotationExport).toBeFalsy();
        expect(jsonDocument._exportEmptyFields).toBe(document.form.exportEmptyFields);
        expect(jsonText).toBe('{}');
        expect(jsonDocument._jsonData.length).toBe(0);
    });
    it('exportFormFields processes an existing PDF button field and returns form JSON', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'submitButton',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        field.toolTip = 'Submit form';
        document.form.add(field);
        const jsonDocument: _JsonDocument = new _JsonDocument('fields.json');
        // Act
        const result: Uint8Array = jsonDocument._exportFormFields(document);
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonDocument._isAnnotationExport).toBeFalsy();
        expect(result.length).toBe(2);
        expect(jsonText).toBe('{}');
        expect(jsonText.charAt(0)).toBe('{');
        expect(jsonText.charAt(jsonText.length - 1)).toBe('}');
        expect(jsonDocument._jsonData.length).toBe(0);
    });
    it('save returns the existing bytes and clears the internal JSON data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._jsonData = [65, 66, 67];
        // Act
        const firstResult: Uint8Array = jsonDocument._save();
        const secondResult: Uint8Array = jsonDocument._save();
        // Assert
        expect(firstResult).toEqual(new Uint8Array([65, 66, 67]));
        expect(new TextDecoder().decode(firstResult)).toBe('ABC');
        expect(secondResult).toEqual(new Uint8Array(0));
        expect(jsonDocument._jsonData).toEqual([]);
        expect(jsonDocument._jsonData.length).toBe(0);
    });
    it('writeFormFieldData writes escaped Unicode string values as valid JSON', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._table.clear();
        jsonDocument._jsonData = [];
        jsonDocument._table.set('display"name', 'தமிழ் "PDF"');
        // Act
        jsonDocument._writeFormFieldData();
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toBe('{"display\\"name":"தமிழ் \\"PDF\\""}');
        expect(JSON.parse(jsonText)['display"name']).toBe('தமிழ் "PDF"');
        expect(jsonDocument._jsonData.length).toBe(0);
    });
    it('writeFormFieldData writes a single element array as a scalar string', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._table.clear();
        jsonDocument._jsonData = [];
        jsonDocument._table.set('singleValue', ['தமிழ்']);
        // Act
        jsonDocument._writeFormFieldData();
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toBe('{"singleValue":"தமிழ்"}');
        expect(JSON.parse(jsonText).singleValue).toBe('தமிழ்');
        expect(jsonText).not.toContain('["தமிழ்"]');
    });
    it('writeFormFieldData writes multiple Unicode values with one comma between entries', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._table.clear();
        jsonDocument._jsonData = [];
        jsonDocument._table.set('languages', ['தமிழ்', 'हिन्दी']);
        // Act
        jsonDocument._writeFormFieldData();
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        const parsedResult: { languages: string[] } = JSON.parse(jsonText) as { languages: string[] };
        // Assert
        expect(jsonText).toBe('{"languages":["தமிழ்","हिन्दी"]}');
        expect(parsedResult.languages.length).toBe(2);
        expect(parsedResult.languages[0]).toBe('தமிழ்');
        expect(parsedResult.languages[1]).toBe('हिन्दी');
        expect(jsonText).not.toContain('"தமிழ்""हिन्दी"');
    });
    it('writeFormFieldData separates multiple fields with one comma', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        jsonDocument._table.clear();
        jsonDocument._jsonData = [];
        jsonDocument._table.set('first', 'one');
        jsonDocument._table.set('second', 'two');
        // Act
        jsonDocument._writeFormFieldData();
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toBe('{"first":"one","second":"two"}');
        expect(JSON.parse(jsonText).first).toBe('one');
        expect(JSON.parse(jsonText).second).toBe('two');
    });
    it('exportAnnotationData writes no page entry for a page without annotations', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toBe('{"pdfAnnotation":{}}');
        expect(jsonText).not.toContain('"0"');
        expect(jsonText).not.toContain('shapeAnnotation');
        expect(JSON.parse(jsonText).pdfAnnotation).toEqual({});
    });
    it('exportAnnotationData writes the page zero entry for a page containing an annotation', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 20, height: 20 }
        );
        annotation.text = 'First annotation';
        page.annotations.add(annotation);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        const parsedResult: {
            pdfAnnotation: { '0': { shapeAnnotation: { type: string }[] } }
        } = JSON.parse(jsonText);
        // Assert
        expect(jsonText).toContain('"0":{"shapeAnnotation":[');
        expect(parsedResult.pdfAnnotation['0'].shapeAnnotation.length).toBe(1);
        expect(parsedResult.pdfAnnotation['0'].shapeAnnotation[0].type).toBe('FreeText');
        expect(jsonText).not.toContain('"0":{"shapeAnnotation":[]}');
    });
    it('exportAnnotationData uses a space before the first annotated nonzero page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 15, y: 15, width: 25, height: 25 }
        );
        annotation.text = 'Second page annotation';
        secondPage.annotations.add(annotation);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toContain('"pdfAnnotation":{ "1":');
        expect(jsonText).not.toContain('"pdfAnnotation":{,"1":');
        expect(JSON.parse(jsonText).pdfAnnotation['1']).toBeDefined();
        expect(JSON.parse(jsonText).pdfAnnotation['0']).toBeUndefined();
    });
    it('exportAnnotationData separates two annotated pages with a comma', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const firstAnnotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 20, height: 20 }
        );
        const secondAnnotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 30, y: 30, width: 20, height: 20 }
        );
        firstAnnotation.text = 'First page';
        secondAnnotation.text = 'Second page';
        firstPage.annotations.add(firstAnnotation);
        secondPage.annotations.add(secondAnnotation);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        const parsedResult: {
            pdfAnnotation: {
                '0': { shapeAnnotation: { type: string }[] };
                '1': { shapeAnnotation: { type: string }[] };
            }
        } = JSON.parse(jsonText);
        // Assert
        expect(jsonText).toContain(']},"1":{"shapeAnnotation":[');
        expect(parsedResult.pdfAnnotation['0'].shapeAnnotation.length).toBe(1);
        expect(parsedResult.pdfAnnotation['1'].shapeAnnotation.length).toBe(1);
        expect(parsedResult.pdfAnnotation['0'].shapeAnnotation[0].type).toBe('FreeText');
        expect(parsedResult.pdfAnnotation['1'].shapeAnnotation[0].type).toBe('FreeText');
    });
    it('exportAnnotationData writes the page number by using the expected string encoding', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        for (let i: number = 0; i < 11; i++) {
            document.addPage();
        }
        const targetPage: PdfPage = document.getPage(10);
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 5, y: 5, width: 15, height: 15 }
        );
        annotation.text = 'Page ten annotation';
        targetPage.annotations.add(annotation);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        // Assert
        expect(jsonText).toContain('"10":{"shapeAnnotation":[');
        expect(JSON.parse(jsonText).pdfAnnotation['10']).toBeDefined();
        expect(JSON.parse(jsonText).pdfAnnotation['1']).toBeUndefined();
    });
    it('exportAnnotationData ignores a missing annotation returned by the collection', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 20, height: 20 }
        );
        page.annotations.add(annotation);
        const originalAt: (index: number) => PdfFreeTextAnnotation =
            page.annotations.at.bind(page.annotations);
        page.annotations.at = (_index: number): PdfFreeTextAnnotation => {
            return undefined;
        };
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._exportAnnotationData(document, document.pageCount);
        const result: Uint8Array = jsonDocument._save();
        const jsonText: string = new TextDecoder().decode(result);
        page.annotations.at = originalAt;
        // Assert
        expect(jsonText).toBe('{"pdfAnnotation":{ "0":{"shapeAnnotation":[]}}}');
        expect(JSON.parse(jsonText).pdfAnnotation['0'].shapeAnnotation).toEqual([]);
        expect(jsonDocument._table.size).toBe(0);
    });
});
describe('JsonDocument exportAnnotation survived mutation coverage', () => {
    it('exportAnnotation does not export when annotation type is undefined', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let writeCount: number = 0;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return undefined;
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            writeCount++;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(writeCount).toBe(0);
        expect(jsonDocument._table.size).toBe(0);
        expect(jsonDocument._table.has('type')).toBeFalsy();
        expect(jsonDocument._table.has('page')).toBeFalsy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('exportAnnotation does not export when annotation type is empty', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let writeCount: number = 0;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return '';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            writeCount++;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(writeCount).toBe(0);
        expect(jsonDocument._table.size).toBe(0);
        expect(jsonDocument._table.has('type')).toBeFalsy();
        expect(jsonDocument._table.has('page')).toBeFalsy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('exportAnnotation stores valid type and page index', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let receivedPageIndex: number = -1;
        let receivedHasAppearance: boolean = true;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            pageIndex: number,
            hasAppearance: boolean
        ): void => {
            receivedPageIndex = pageIndex;
            receivedHasAppearance = hasAppearance;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 4);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(jsonDocument._table.get('type')).toBe('FreeText');
        expect(jsonDocument._table.get('page')).toBe('4');
        expect(receivedPageIndex).toBe(4);
        expect(receivedHasAppearance).toBeFalsy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('exportAnnotation enables appearance export for Stamp type', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let receivedHasAppearance: boolean = false;
        let writeCount: number = 0;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'Stamp';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            hasAppearance: boolean
        ): void => {
            writeCount++;
            receivedHasAppearance = hasAppearance;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 1);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(writeCount).toBe(1);
        expect(receivedHasAppearance).toBeTruthy();
        expect(jsonDocument._table.get('type')).toBe('Stamp');
        expect(jsonDocument._table.get('page')).toBe('1');
    });
    it('exportAnnotation enables appearance export for Square type', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let receivedHasAppearance: boolean = false;
        let writeCount: number = 0;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'Square';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            hasAppearance: boolean
        ): void => {
            writeCount++;
            receivedHasAppearance = hasAppearance;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 2);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(writeCount).toBe(1);
        expect(receivedHasAppearance).toBeTruthy();
        expect(jsonDocument._table.get('type')).toBe('Square');
        expect(jsonDocument._table.get('page')).toBe('2');
    });
    it('exportAnnotation keeps appearance disabled for an unsupported switch type', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let receivedHasAppearance: boolean = true;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'Circle';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            hasAppearance: boolean
        ): void => {
            receivedHasAppearance = hasAppearance;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 3);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(receivedHasAppearance).toBeFalsy();
        expect(jsonDocument._table.get('type')).toBe('Circle');
        expect(jsonDocument._table.get('page')).toBe('3');
    });
    it('exportAnnotation keeps border style enabled when dictionary has only BE', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const annotationDictionary: _PdfDictionary = annotation._dictionary;
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary();
        borderEffectDictionary.update('S', _PdfName.get('C'));
        annotationDictionary.update('BE', borderEffectDictionary);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            return;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(annotationDictionary.has('BE')).toBeTruthy();
        expect(annotationDictionary.has('BS')).toBeFalsy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
        expect(jsonDocument._table.get('type')).toBe('FreeText');
        expect(jsonDocument._table.get('page')).toBe('0');
    });
    it('exportAnnotation keeps border style enabled when dictionary has only BS', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const annotationDictionary: _PdfDictionary = annotation._dictionary;
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary();
        borderStyleDictionary.update('S', _PdfName.get('D'));
        annotationDictionary.update('BS', borderStyleDictionary);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            return;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(annotationDictionary.has('BE')).toBeFalsy();
        expect(annotationDictionary.has('BS')).toBeTruthy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
        expect(jsonDocument._table.get('type')).toBe('FreeText');
        expect(jsonDocument._table.get('page')).toBe('0');
    });
    it('exportAnnotation keeps border style enabled when BE and BS exist without BE style', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const annotationDictionary: _PdfDictionary = annotation._dictionary;
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary();
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary();
        borderStyleDictionary.update('S', _PdfName.get('D'));
        annotationDictionary.update('BE', borderEffectDictionary);
        annotationDictionary.update('BS', borderStyleDictionary);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            return;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(annotationDictionary.has('BE')).toBeTruthy();
        expect(annotationDictionary.has('BS')).toBeTruthy();
        expect(borderEffectDictionary.has('S')).toBeFalsy();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('exportAnnotation skips border style when BE and BS exist with BE style', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const annotationDictionary: _PdfDictionary = annotation._dictionary;
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary();
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary();
        borderEffectDictionary.update('S', _PdfName.get('C'));
        borderStyleDictionary.update('S', _PdfName.get('D'));
        annotationDictionary.update('BE', borderEffectDictionary);
        annotationDictionary.update('BS', borderStyleDictionary);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        let receivedDictionary: _PdfDictionary;
        let receivedPageIndex: number = -1;
        let receivedHasAppearance: boolean = true;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            dictionary: _PdfDictionary,
            pageIndex: number,
            hasAppearance: boolean
        ): void => {
            receivedDictionary = dictionary;
            receivedPageIndex = pageIndex;
            receivedHasAppearance = hasAppearance;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 5);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(receivedDictionary).toBe(annotationDictionary);
        expect(receivedPageIndex).toBe(5);
        expect(receivedHasAppearance).toBeFalsy();
        expect(borderEffectDictionary.has('S')).toBeTruthy();
        expect(jsonDocument._skipBorderStyle).toBeTruthy();
        expect(jsonDocument._table.get('type')).toBe('FreeText');
        expect(jsonDocument._table.get('page')).toBe('5');
    });
    it('exportAnnotation keeps border style enabled when BE value is null', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const annotationDictionary: _PdfDictionary = annotation._dictionary;
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary();
        borderStyleDictionary.update('S', _PdfName.get('D'));
        annotationDictionary.update('BE', null);
        annotationDictionary.update('BS', borderStyleDictionary);
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            return;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(annotationDictionary.has('BE')).toBeTruthy();
        expect(annotationDictionary.has('BS')).toBeTruthy();
        expect(annotationDictionary.get('BE')).toBeNull();
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('exportAnnotation resets an existing skipBorderStyle value before processing', () => {
        // Arrange
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 10, y: 10, width: 100, height: 40 }
        );
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetAnnotationType:
            (dictionary: _PdfDictionary) => string =
            jsonDocument._getAnnotationType.bind(jsonDocument);
        const originalWriteDictionary:
            (dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean) => void =
            jsonDocument._writeDictionary.bind(jsonDocument);
        jsonDocument._skipBorderStyle = true;
        jsonDocument._getAnnotationType = (_dictionary: _PdfDictionary): string => {
            return 'FreeText';
        };
        jsonDocument._writeDictionary = (
            _dictionary: _PdfDictionary,
            _pageIndex: number,
            _hasAppearance: boolean
        ): void => {
            return;
        };
        // Act
        jsonDocument._exportAnnotation(annotation, 0);
        jsonDocument._getAnnotationType = originalGetAnnotationType;
        jsonDocument._writeDictionary = originalWriteDictionary;
        // Assert
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
        expect(jsonDocument._table.get('type')).toBe('FreeText');
        expect(jsonDocument._table.get('page')).toBe('0');
    });
});
describe('1038509 _writeDictionary survived mutants', () => {
    it('1038509 _writeDictionary skips border style S only for a Border dictionary', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const borderDictionary: _PdfDictionary = new _PdfDictionary();
        borderDictionary.update('Type', _PdfName.get('Border'));
        borderDictionary.update('S', _PdfName.get('D'));
        borderDictionary.update('W', 5);
        jsonDocument._skipBorderStyle = true;
        // Act
        jsonDocument._writeDictionary(borderDictionary, 0, false);
        // Assert
        expect(jsonDocument._table.has('style')).toBeFalsy();
        expect(jsonDocument._table.get('width')).toBe('5');
        expect(jsonDocument._skipBorderStyle).toBeTruthy();
    });
    it('1038509 _writeDictionary writes S when border style skipping is false', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const borderDictionary: _PdfDictionary = new _PdfDictionary();
        borderDictionary.update('Type', _PdfName.get('Border'));
        borderDictionary.update('S', _PdfName.get('D'));
        jsonDocument._skipBorderStyle = false;
        // Act
        jsonDocument._writeDictionary(borderDictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('style')).toBe('dash');
        expect(jsonDocument._skipBorderStyle).toBeFalsy();
    });
    it('1038509 _writeDictionary writes S for a non Border dictionary', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('S', _PdfName.get('C'));
        jsonDocument._skipBorderStyle = true;
        // Act
        jsonDocument._writeDictionary(annotationDictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('style')).toBe('cloudy');
        expect(jsonDocument._table.has('type')).toBeFalsy();
    });
    it('1038509 _writeDictionary excludes AP P Parent and Measure from ordinary attributes', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        appearanceDictionary.update('N', 'normal');
        measureDictionary.update('R', '1 cm = 1 cm');
        dictionary.update('AP', appearanceDictionary);
        dictionary.update('P', 'page');
        dictionary.update('Parent', 'parent');
        dictionary.update('Measure', measureDictionary);
        dictionary.update('NM', 'annotation-name');
        jsonDocument.exportAppearance = false;
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('name')).toBe('annotation-name');
        expect(jsonDocument._table.get('ratevalue')).toBe('1 cm = 1 cm');
        expect(jsonDocument._table.has('appearance')).toBeFalsy();
        expect(jsonDocument._table.has('P')).toBeFalsy();
        expect(jsonDocument._table.has('Parent')).toBeFalsy();
        expect(jsonDocument._table.has('Measure')).toBeFalsy();
        expect(jsonDocument._table.has('N')).toBeFalsy();
    });
    it('1038509 _writeDictionary includes AP when hasAppearance is true', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        appearanceDictionary.update('N', 'normal-appearance');
        dictionary.update('AP', appearanceDictionary);
        jsonDocument.exportAppearance = false;
        // Act
        jsonDocument._writeDictionary(dictionary, 0, true);
        // Assert
        const appearance: string = jsonDocument._table.get('appearance') as string;
        expect(appearance).toBeDefined();
        expect(appearance.length).toBeGreaterThan(0);
        expect(appearance).not.toBe('');
        expect(jsonDocument._table.get('N')).toBe('normal-appearance');
        expect(jsonDocument.exportAppearance).toBeFalsy();
    });
    it('1038509 _writeDictionary recursively writes BS and BE dictionaries', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary();
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary();
        borderStyleDictionary.update('W', 4);
        borderStyleDictionary.update('S', _PdfName.get('D'));
        borderEffectDictionary.update('I', 2);
        borderEffectDictionary.update('S', _PdfName.get('C'));
        dictionary.update('BS', borderStyleDictionary);
        dictionary.update('BE', borderEffectDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('width')).toBe('4');
        expect(jsonDocument._table.get('intensity')).toBe('2');
        expect(jsonDocument._table.get('style')).toBe('cloudy');
        expect(jsonDocument._table.has('BS')).toBeFalsy();
        expect(jsonDocument._table.has('BE')).toBeFalsy();
    });
    it('1038509 _writeDictionary writes inreplyto only from IRT NM', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const replyDictionary: _PdfDictionary = new _PdfDictionary();
        replyDictionary.update('NM', 'parent-annotation-name');
        replyDictionary.update('Subj', 'ignored-reply-subject');
        dictionary.update('IRT', replyDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('inreplyto')).toBe('parent-annotation-name');
        expect(jsonDocument._table.has('name')).toBeFalsy();
        expect(jsonDocument._table.has('subject')).toBeFalsy();
        expect(jsonDocument._table.has('IRT')).toBeFalsy();
    });
    it('1038509 _writeDictionary does not write inreplyto when IRT has no NM', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const replyDictionary: _PdfDictionary = new _PdfDictionary();
        replyDictionary.update('Subj', 'reply-subject');
        dictionary.update('IRT', replyDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.has('inreplyto')).toBeFalsy();
        expect(jsonDocument._table.has('subject')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeDictionary exports appearance through exportAppearance', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        appearanceDictionary.update('N', 'exported-appearance');
        dictionary.update('AP', appearanceDictionary);
        jsonDocument.exportAppearance = true;
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        const appearance: string = jsonDocument._table.get('appearance') as string;
        expect(appearance).toBeDefined();
        expect(appearance.length).toBeGreaterThan(0);
        expect(appearance).not.toBe('');
        expect(jsonDocument.exportAppearance).toBeTruthy();
    });
    it('1038509 _writeDictionary rejects an empty appearance result', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        const originalGetAppearanceString: (appearance: _PdfDictionary) => Uint8Array =
            jsonDocument._getAppearanceString;
        appearanceDictionary.update('N', 'normal');
        dictionary.update('AP', appearanceDictionary);
        jsonDocument.exportAppearance = true;
        jsonDocument._getAppearanceString = (_appearance: _PdfDictionary): Uint8Array => {
            return new Uint8Array(0);
        };
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.has('appearance')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
        jsonDocument._getAppearanceString = originalGetAppearanceString;
        expect(jsonDocument._getAppearanceString).toBe(originalGetAppearanceString);
    });
    it('1038509 _writeDictionary exports each sound metadata value directly', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const soundStream: _PdfContentStream = new _PdfContentStream([]);
        soundStream.dictionary.update('B', 16);
        soundStream.dictionary.update('C', 2);
        soundStream.dictionary.update('E', _PdfName.get('Signed'));
        soundStream.dictionary.update('R', 44100);
        soundStream.dictionary.update('Length', 0);
        dictionary.update('Sound', soundStream);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('bits')).toBe('16');
        expect(jsonDocument._table.get('channels')).toBe('2');
        expect(jsonDocument._table.get('encoding')).toBe('Signed');
        expect(jsonDocument._table.get('rate')).toBe('44100');
        expect(jsonDocument._table.has('MODE')).toBeFalsy();
        expect(jsonDocument._table.has('data')).toBeFalsy();
    });
    it('1038509 _writeDictionary exports nonempty sound bytes as raw hexadecimal data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const soundStream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetBytes: (length?: number) => Uint8Array = soundStream.getBytes;
        soundStream.dictionary.update('B', 8);
        soundStream.dictionary.update('C', 1);
        soundStream.dictionary.update('E', _PdfName.get('Signed'));
        soundStream.dictionary.update('R', 22050);
        soundStream.dictionary.update('Length', 4);
        soundStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        soundStream.getBytes = (_length?: number): Uint8Array => {
            return new Uint8Array([10, 20, 30, 255]);
        };
        dictionary.update('Sound', soundStream);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('bits')).toBe('8');
        expect(jsonDocument._table.get('channels')).toBe('1');
        expect(jsonDocument._table.get('rate')).toBe('22050');
        expect(jsonDocument._table.get('MODE')).toBe('raw');
        expect(jsonDocument._table.get('encoding')).toBe('hex');
        expect(jsonDocument._table.get('length')).toBe('4');
        expect(jsonDocument._table.get('filter')).toBe('FlateDecode');
        expect(jsonDocument._table.get('data')).toBe('0A141EFF');
        soundStream.getBytes = originalGetBytes;
        expect(soundStream.getBytes).toBe(originalGetBytes);
    });
    it('1038509 _writeDictionary does not export sound data for zero Length', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const soundStream: _PdfContentStream = new _PdfContentStream([]);
        soundStream.dictionary.update('B', 8);
        soundStream.dictionary.update('Length', 0);
        soundStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        dictionary.update('Sound', soundStream);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('bits')).toBe('8');
        expect(jsonDocument._table.has('MODE')).toBeFalsy();
        expect(jsonDocument._table.has('encoding')).toBeFalsy();
        expect(jsonDocument._table.has('length')).toBeFalsy();
        expect(jsonDocument._table.has('filter')).toBeFalsy();
        expect(jsonDocument._table.has('data')).toBeFalsy();
    });
    it('1038509 _writeDictionary gives Sound precedence over FS', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const soundStream: _PdfContentStream = new _PdfContentStream([]);
        const fileSpecificationDictionary: _PdfDictionary = new _PdfDictionary();
        const originalGetBytes: (length?: number) => Uint8Array = soundStream.getBytes;
        soundStream.dictionary.update('Length', 1);
        soundStream.getBytes = (_length?: number): Uint8Array => {
            return new Uint8Array([1]);
        };
        fileSpecificationDictionary.update('F', 'ignored-file.txt');
        dictionary.update('Sound', soundStream);
        dictionary.update('FS', fileSpecificationDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('MODE')).toBe('raw');
        expect(jsonDocument._table.get('encoding')).toBe('hex');
        expect(jsonDocument._table.get('length')).toBe('1');
        expect(jsonDocument._table.get('data')).toBe('01');
        expect(jsonDocument._table.has('file')).toBeFalsy();
        soundStream.getBytes = originalGetBytes;
        expect(soundStream.getBytes).toBe(originalGetBytes);
    });
    it('1038509 _writeDictionary exports file name without EF data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const fileSpecificationDictionary: _PdfDictionary = new _PdfDictionary();
        fileSpecificationDictionary.update('F', 'attachment.txt');
        dictionary.update('FS', fileSpecificationDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('file')).toBe('attachment.txt');
        expect(jsonDocument._table.has('MODE')).toBeFalsy();
        expect(jsonDocument._table.has('encoding')).toBeFalsy();
        expect(jsonDocument._table.has('data')).toBeFalsy();
    });
    it('1038509 _writeDictionary exports embedded file metadata and bytes', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const fileSpecificationDictionary: _PdfDictionary = new _PdfDictionary();
        const embeddedFileDictionary: _PdfDictionary = new _PdfDictionary();
        const parametersDictionary: _PdfDictionary = new _PdfDictionary();
        const fileStream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetBytes: (length?: number) => Uint8Array = fileStream.getBytes;
        parametersDictionary.update('CreationDate', 'D:20260101000000');
        parametersDictionary.update('ModificationDate', 'D:20260202000000');
        parametersDictionary.update('Size', 3);
        parametersDictionary.update('CheckSum', 'ABC');
        fileStream.dictionary.update('Params', parametersDictionary);
        fileStream.dictionary.update('Length', 3);
        fileStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        fileStream.getBytes = (_length?: number): Uint8Array => {
            return new Uint8Array([65, 66, 67]);
        };
        embeddedFileDictionary.update('F', fileStream);
        fileSpecificationDictionary.update('F', 'attachment.txt');
        fileSpecificationDictionary.update('EF', embeddedFileDictionary);
        dictionary.update('FS', fileSpecificationDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('file')).toBe('attachment.txt');
        expect(jsonDocument._table.get('creation')).toBe('D:20260101000000');
        expect(jsonDocument._table.get('modification')).toBe('D:20260202000000');
        expect(jsonDocument._table.get('size')).toBe('3');
        expect(jsonDocument._table.get('checksum')).toBe('414243');
        expect(jsonDocument._table.get('MODE')).toBe('raw');
        expect(jsonDocument._table.get('encoding')).toBe('hex');
        expect(jsonDocument._table.get('length')).toBe('3');
        expect(jsonDocument._table.get('filter')).toBe('FlateDecode');
        expect(jsonDocument._table.get('data')).toBe('414243');
        fileStream.getBytes = originalGetBytes;
        expect(fileStream.getBytes).toBe(originalGetBytes);
    });
    it('1038509 _writeDictionary exports embedded file bytes without Params', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const fileSpecificationDictionary: _PdfDictionary = new _PdfDictionary();
        const embeddedFileDictionary: _PdfDictionary = new _PdfDictionary();
        const fileStream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetBytes: (length?: number) => Uint8Array = fileStream.getBytes;
        fileStream.dictionary.update('Length', 2);
        fileStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        fileStream.getBytes = (_length?: number): Uint8Array => {
            return new Uint8Array([15, 16]);
        };
        embeddedFileDictionary.update('F', fileStream);
        fileSpecificationDictionary.update('F', 'data.bin');
        fileSpecificationDictionary.update('EF', embeddedFileDictionary);
        dictionary.update('FS', fileSpecificationDictionary);
        // Act
        jsonDocument._writeDictionary(dictionary, 0, false);
        // Assert
        expect(jsonDocument._table.get('file')).toBe('data.bin');
        expect(jsonDocument._table.has('creation')).toBeFalsy();
        expect(jsonDocument._table.has('modification')).toBeFalsy();
        expect(jsonDocument._table.has('size')).toBeFalsy();
        expect(jsonDocument._table.has('checksum')).toBeFalsy();
        expect(jsonDocument._table.get('MODE')).toBe('raw');
        expect(jsonDocument._table.get('encoding')).toBe('hex');
        expect(jsonDocument._table.get('length')).toBe('2');
        expect(jsonDocument._table.get('filter')).toBe('FlateDecode');
        expect(jsonDocument._table.get('data')).toBe('0F10');
        fileStream.getBytes = originalGetBytes;
        expect(fileStream.getBytes).toBe(originalGetBytes);
    });
});
describe('1038509 _writeColor and _writeAttribute survived mutants lines 290 to 400', () => {
    it('1038509 _writeColor writes numeric tag output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetColor: (primitive: number) => string = jsonDocument._getColor;
        jsonDocument._getColor = (_primitive: number): string => {
            return '';
        };
        // Act
        jsonDocument._writeColor(0.5, 'color', 'c');
        // Assert
        expect(jsonDocument._table.get('c')).toBe('0.5');
        expect(jsonDocument._table.has('color')).toBeFalsy();
        jsonDocument._getColor = originalGetColor;
        expect(jsonDocument._getColor).toBe(originalGetColor);
    });
    it('1038509 _writeColor does not write an empty numeric tag output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetValue: (primitive: number, isExport?: boolean) => string = jsonDocument._getValue;
        const originalGetColor: (primitive: number) => string = jsonDocument._getColor;
        jsonDocument._getValue = (_primitive: number, _isExport?: boolean): string => {
            return '';
        };
        jsonDocument._getColor = (_primitive: number): string => {
            return '';
        };
        // Act
        jsonDocument._writeColor(0.5, 'color', 'c');
        // Assert
        expect(jsonDocument._table.has('c')).toBeFalsy();
        expect(jsonDocument._table.has('color')).toBeFalsy();
        jsonDocument._getValue = originalGetValue;
        jsonDocument._getColor = originalGetColor;
        expect(jsonDocument._getValue).toBe(originalGetValue);
        expect(jsonDocument._getColor).toBe(originalGetColor);
    });
    it('1038509 _writeColor writes nonempty color output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetColor: (primitive: number[]) => string = jsonDocument._getColor;
        jsonDocument._getColor = (_primitive: number[]): string => {
            return '#FF0000';
        };
        // Act
        jsonDocument._writeColor([1, 0, 0], 'color');
        // Assert
        expect(jsonDocument._table.get('color')).toBe('#FF0000');
        expect(jsonDocument._table.has('c')).toBeFalsy();
        jsonDocument._getColor = originalGetColor;
        expect(jsonDocument._getColor).toBe(originalGetColor);
    });
    it('1038509 _writeColor does not write empty color output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const originalGetColor: (primitive: number[]) => string = jsonDocument._getColor;
        jsonDocument._getColor = (_primitive: number[]): string => {
            return '';
        };
        // Act
        jsonDocument._writeColor([1, 0, 0], 'color');
        // Assert
        expect(jsonDocument._table.has('color')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
        jsonDocument._getColor = originalGetColor;
        expect(jsonDocument._getColor).toBe(originalGetColor);
    });
    it('1038509 _writeAttributeString preserves case by default', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._writeAttributeString('replyType', 'Group');
        // Assert
        expect(jsonDocument._table.get('replyType')).toBe('Group');
        expect(jsonDocument._table.get('replyType')).not.toBe('group');
    });
    it('1038509 _writeAttributeString converts output to lowercase when requested', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        jsonDocument._writeAttributeString('replyType', 'Group', true);
        // Assert
        expect(jsonDocument._table.get('replyType')).toBe('group');
        expect(jsonDocument._table.get('replyType')).not.toBe('Group');
    });
    it('1038509 _writeAttribute writes default appearance only for nonempty DA', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('DA', '/F1 12 Tf');
        // Act
        jsonDocument._writeAttribute('DA', '/ignored 8 Tf', dictionary);
        // Assert
        expect(jsonDocument._table.get('defaultappearance')).toBe('/F1 12 Tf');
        expect(jsonDocument._table.has('DA')).toBeFalsy();
    });
    it('1038509 _writeAttribute does not write empty default appearance', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('DA', '');
        // Act
        jsonDocument._writeAttribute('DA', '/ignored 8 Tf', dictionary);
        // Assert
        expect(jsonDocument._table.has('defaultappearance')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes NM directly as name', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('NM', 'annotation-name', dictionary);
        // Assert
        expect(jsonDocument._table.get('name')).toBe('annotation-name');
        expect(jsonDocument._table.has('NM')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(1);
    });
    it('1038509 _writeAttribute preserves an existing title for T', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        jsonDocument._table.set('title', 'existing-title');
        // Act
        jsonDocument._writeAttribute('T', 'replacement-title', dictionary);
        // Assert
        expect(jsonDocument._table.get('title')).toBe('existing-title');
        expect(jsonDocument._table.get('title')).not.toBe('replacement-title');
        expect(jsonDocument._table.size).toBe(1);
    });
    it('1038509 _writeAttribute writes title when T has no existing title', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('T', 'annotation-title', dictionary);
        // Assert
        expect(jsonDocument._table.get('title')).toBe('annotation-title');
        expect(jsonDocument._table.has('T')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes Rect as exact JSON coordinates', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('Rect', [10, 20, 30, 40], dictionary);
        // Assert
        expect(jsonDocument._table.get('rect')).toBe('{"x":"10","y":"20","width":"30","height":"40"}');
        expect(jsonDocument._table.has('Rect')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes both LE array endpoints', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const lineEndings: _PdfName[] = [
            _PdfName.get('OpenArrow'),
            _PdfName.get('ClosedArrow')
        ];
        // Act
        jsonDocument._writeAttribute('LE', lineEndings, dictionary);
        // Assert
        expect(jsonDocument._table.get('head')).toBe('OpenArrow');
        expect(jsonDocument._table.get('tail')).toBe('ClosedArrow');
        expect(jsonDocument._table.size).toBe(2);
    });
    it('1038509 _writeAttribute does not write LE array with one endpoint', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const lineEndings: _PdfName[] = [_PdfName.get('OpenArrow')];
        // Act
        jsonDocument._writeAttribute('LE', lineEndings, dictionary);
        // Assert
        expect(jsonDocument._table.has('head')).toBeFalsy();
        expect(jsonDocument._table.has('tail')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes a single LE PdfName as head', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const lineEnding: _PdfName = _PdfName.get('Square');
        // Act
        jsonDocument._writeAttribute('LE', lineEnding, dictionary);
        // Assert
        expect(jsonDocument._table.get('head')).toBe('Square');
        expect(jsonDocument._table.has('tail')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(1);
    });
});
describe('1038509 _writeAttribute survived mutants lines 400 to 520', () => {
    it('1038509 _writeAttribute writes CA as opacity', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('CA', 0.75, dictionary);
        // Assert
        expect(jsonDocument._table.get('opacity')).toBe('0.75');
        expect(jsonDocument._table.has('CA')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes numeric F as flags', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('F', 4, dictionary);
        // Assert
        expect(jsonDocument._table.get('flags')).toBe('print');
        expect(jsonDocument._table.has('F')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(1);
    });
    it('1038509 _writeAttribute does not write nonnumeric F', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('F', '4', dictionary);
        // Assert
        expect(jsonDocument._table.has('flags')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes nonempty Contents from dictionary', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Contents', 'annotation contents');
        // Act
        jsonDocument._writeAttribute('Contents', 'ignored contents', dictionary);
        // Assert
        expect(jsonDocument._table.get('contents')).toBe('annotation contents');
        expect(jsonDocument._table.has('Contents')).toBeFalsy();
    });
    it('1038509 _writeAttribute does not write empty Contents', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Contents', '');
        // Act
        jsonDocument._writeAttribute('Contents', 'ignored contents', dictionary);
        // Assert
        expect(jsonDocument._table.has('contents')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes InkList output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('InkList', [[1, 2, 3, 4], [5, 6]]);
        // Act
        jsonDocument._writeAttribute('InkList', [[9, 10]], dictionary);
        // Assert
        expect(jsonDocument._table.get('inklist')).toBe('{"gesture":[[1,2,3,4],[5,6]]}');
        expect(jsonDocument._table.has('InkList')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes Vertices output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Vertices', [1, 2, 3, 4]);
        // Act
        jsonDocument._writeAttribute('Vertices', [9, 10], dictionary);
        // Assert
        expect(jsonDocument._table.get('vertices')).toBe('1,2;3,4');
        expect(jsonDocument._table.has('Vertices')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes DS as exact defaultStyle JSON', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('DS', ' font:Arial;color:red');
        // Act
        jsonDocument._writeAttribute('DS', 'ignored', dictionary);
        // Assert
        expect(jsonDocument._table.get('defaultStyle')).toBe('{"font":"Arial","color":"red"}');
        expect(jsonDocument._table.has('DS')).toBeFalsy();
    });
    it('1038509 _writeAttribute trims one leading space from DS property', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('DS', ' font-size:12pt');
        // Act
        jsonDocument._writeAttribute('DS', 'ignored', dictionary);
        // Assert
        expect(jsonDocument._table.get('defaultStyle')).toBe('{"font-size":"12pt"}');
        expect(jsonDocument._table.get('defaultStyle')).not.toContain(' font-size');
    });
    it('1038509 _writeAttribute writes AllowedInteractions as hexadecimal JSON', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('AllowedInteractions', 'Copy', dictionary);
        // Assert
        expect(jsonDocument._table.get('AllowedInteractions')).toBe('{"encoding":"hex","bytes":"436F7079"}');
        expect(jsonDocument._table.has('allowedinteractions')).toBeFalsy();
    });
    it('1038509 _writeAttribute does not write empty AllowedInteractions', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('AllowedInteractions', '', dictionary);
        // Assert
        expect(jsonDocument._table.has('AllowedInteractions')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes RC beginning from body element', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('RC', '<html><body>Rich text</body></html>');
        // Act
        jsonDocument._writeAttribute('RC', 'ignored', dictionary);
        // Assert
        expect(jsonDocument._table.get('contents-richtext')).toBe('<body>Rich text</body></html>');
        expect(jsonDocument._table.get('contents-richtext')).not.toContain('<html>');
    });
    it('1038509 _writeAttribute preserves RC when body begins at index zero', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('RC', '<body>Rich text</body>');
        // Act
        jsonDocument._writeAttribute('RC', 'ignored', dictionary);
        // Assert
        expect(jsonDocument._table.get('contents-richtext')).toBe('<body>Rich text</body>');
        expect(jsonDocument._table.has('RC')).toBeFalsy();
    });
    it('1038509 _writeAttribute does not write RC without body', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('RC', '<p>Rich text</p>');
        // Act
        jsonDocument._writeAttribute('RC', 'ignored', dictionary);
        // Assert
        expect(jsonDocument._table.has('contents-richtext')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute ignores structural keys', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const ignoredKeys: string[] = [
            'Type', 'Subtype', 'P', 'Parent', 'L', 'FS',
            'MeasurementTypes', 'GroupNesting', 'ITEx'
        ];
        // Act
        ignoredKeys.forEach((key: string) => {
            jsonDocument._writeAttribute(key, 'ignored-value', dictionary);
        });
        // Assert
        expect(jsonDocument._table.has('Type')).toBeFalsy();
        expect(jsonDocument._table.has('Subtype')).toBeFalsy();
        expect(jsonDocument._table.has('P')).toBeFalsy();
        expect(jsonDocument._table.has('Parent')).toBeFalsy();
        expect(jsonDocument._table.has('L')).toBeFalsy();
        expect(jsonDocument._table.has('FS')).toBeFalsy();
        expect(jsonDocument._table.has('MeasurementTypes')).toBeFalsy();
        expect(jsonDocument._table.has('GroupNesting')).toBeFalsy();
        expect(jsonDocument._table.has('ITEx')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeAttribute writes TextMarkupContent as hexadecimal text', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('TextMarkupContent', 'ABC', dictionary);
        // Assert
        expect(jsonDocument._table.get('TextMarkupContent')).toBe('414243');
        expect(jsonDocument._table.has('textmarkupcontent')).toBeFalsy();
    });
    it('1038509 _writeAttribute writes lowercase keys for direct attributes', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('Border', [1, 2, 3], dictionary);
        jsonDocument._writeAttribute('A', 'action', dictionary);
        jsonDocument._writeAttribute('R', 90, dictionary);
        jsonDocument._writeAttribute('X', 12, dictionary);
        jsonDocument._writeAttribute('ca', 0.5, dictionary);
        // Assert
        expect(jsonDocument._table.get('border')).toBe('1,2,3');
        expect(jsonDocument._table.get('a')).toBe('action');
        expect(jsonDocument._table.get('r')).toBe('90');
        expect(jsonDocument._table.get('x')).toBe('12');
        expect(jsonDocument._table.get('ca')).toBe('0.5');
        expect(jsonDocument._table.has('Border')).toBeFalsy();
        expect(jsonDocument._table.has('A')).toBeFalsy();
        expect(jsonDocument._table.has('R')).toBeFalsy();
        expect(jsonDocument._table.has('X')).toBeFalsy();
    });
    it('1038509 _writeAttribute preserves JSON object string in default branch', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const customJson: string = '{"name":"value"}';
        // Act
        jsonDocument._writeAttribute('CustomData', customJson, dictionary);
        // Assert
        expect(jsonDocument._table.get('CustomData')).toBe(customJson);
        expect(jsonDocument._table.get('CustomData')).not.toBe('');
    });
    it('1038509 _writeAttribute writes ordinary default branch value', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAttribute('CustomData', 'plain-value', dictionary);
        // Assert
        expect(jsonDocument._table.get('CustomData')).toBe('plain-value');
        expect(jsonDocument._table.size).toBe(1);
    });
});
describe('1038509 JSON export survived mutants lines 520 to 628', () => {
    it('1038509 _writeVertices writes exact even coordinate output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Vertices', [1, 2, 3, 4]);
        // Act
        jsonDocument._writeVertices(dictionary);
        // Assert
        expect(jsonDocument._table.get('vertices')).toBe('1,2;3,4');
        expect(jsonDocument._table.get('vertices')).not.toBe('1;2,3;4');
        expect(jsonDocument._table.size).toBe(1);
    });
    it('1038509 _writeVertices writes every coordinate once', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Vertices', [10, 20, 30, 40, 50, 60]);
        // Act
        jsonDocument._writeVertices(dictionary);
        // Assert
        expect(jsonDocument._table.get('vertices')).toBe('10,20;30,40;50,60');
        expect(jsonDocument._table.get('vertices')).not.toContain('60,60');
    });
    it('1038509 _writeVertices does not write odd coordinate output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Vertices', [1, 2, 3]);
        // Act
        jsonDocument._writeVertices(dictionary);
        // Assert
        expect(jsonDocument._table.has('vertices')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeVertices does not write empty coordinate output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Vertices', []);
        // Act
        jsonDocument._writeVertices(dictionary);
        // Assert
        expect(jsonDocument._table.has('vertices')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _writeInkList writes exact gesture JSON', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('InkList', [[1, 2, 3, 4], [5, 6]]);
        // Act
        jsonDocument._writeInkList(dictionary);
        // Assert
        expect(jsonDocument._table.get('inklist')).toBe('{"gesture":[[1,2,3,4],[5,6]]}');
        expect(jsonDocument._table.get('inklist')).not.toContain('Stryker was here');
        expect(jsonDocument._table.size).toBe(1);
    });
    it('1038509 _writeInkList writes one gesture without a separator', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('InkList', [[7, 8]]);
        // Act
        jsonDocument._writeInkList(dictionary);
        // Assert
        expect(jsonDocument._table.get('inklist')).toBe('{"gesture":[[7,8]]}');
        expect(jsonDocument._table.get('inklist')).not.toContain(',]');
    });
    it('1038509 _writeInkList does not write an empty list', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('InkList', []);
        // Act
        jsonDocument._writeInkList(dictionary);
        // Assert
        expect(jsonDocument._table.has('inklist')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _exportMeasureDictionary writes scalar measure values', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        measureDictionary.update('Type', _PdfName.get('Measure'));
        measureDictionary.update('R', '1 in = 2.54 cm');
        measureDictionary.update('SubType', 'RL');
        measureDictionary.update('TargetUnitConversion', 'cm');
        // Act
        jsonDocument._exportMeasureDictionary(measureDictionary);
        // Assert
        expect(jsonDocument._table.get('type1')).toBe('Measure');
        expect(jsonDocument._table.get('ratevalue')).toBe('1 in = 2.54 cm');
        expect(jsonDocument._table.get('SubType')).toBe('RL');
        expect(jsonDocument._table.get('TargetUnitConversion')).toBe('cm');
    });
    it('1038509 _exportMeasureDictionary writes all measure format arrays', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        const areaDictionary: _PdfDictionary = new _PdfDictionary();
        const distanceDictionary: _PdfDictionary = new _PdfDictionary();
        const xDictionary: _PdfDictionary = new _PdfDictionary();
        const tDictionary: _PdfDictionary = new _PdfDictionary();
        const vDictionary: _PdfDictionary = new _PdfDictionary();
        areaDictionary.update('U', 'sq cm');
        distanceDictionary.update('U', 'cm');
        xDictionary.update('U', 'x-unit');
        tDictionary.update('U', 't-unit');
        vDictionary.update('U', 'cu cm');
        measureDictionary.update('A', [areaDictionary]);
        measureDictionary.update('D', [distanceDictionary]);
        measureDictionary.update('X', [xDictionary]);
        measureDictionary.update('T', [tDictionary]);
        measureDictionary.update('V', [vDictionary]);
        // Act
        jsonDocument._exportMeasureDictionary(measureDictionary);
        // Assert
        expect(jsonDocument._table.get('area')).toBe('{"u":"sq cm"}');
        expect(jsonDocument._table.get('distance')).toBe('{"u":"cm"}');
        expect(jsonDocument._table.get('xformat')).toBe('{"u":"x-unit"}');
        expect(jsonDocument._table.get('tformat')).toBe('{"u":"t-unit"}');
        expect(jsonDocument._table.get('vformat')).toBe('{"u":"cu cm"}');
    });
    it('1038509 _exportMeasureDictionary ignores empty measure format arrays', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        measureDictionary.update('A', []);
        measureDictionary.update('D', []);
        measureDictionary.update('X', []);
        measureDictionary.update('T', []);
        measureDictionary.update('V', []);
        // Act
        jsonDocument._exportMeasureDictionary(measureDictionary);
        // Assert
        expect(jsonDocument._table.has('area')).toBeFalsy();
        expect(jsonDocument._table.has('distance')).toBeFalsy();
        expect(jsonDocument._table.has('xformat')).toBeFalsy();
        expect(jsonDocument._table.has('tformat')).toBeFalsy();
        expect(jsonDocument._table.has('vformat')).toBeFalsy();
        expect(jsonDocument._table.size).toBe(0);
    });
    it('1038509 _exportMeasureDictionary ignores an absent dictionary', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const measureDictionary: _PdfDictionary = null;
        // Act
        jsonDocument._exportMeasureDictionary(measureDictionary);
        // Assert
        expect(jsonDocument._table.size).toBe(0);
        expect(jsonDocument._table.has('type1')).toBeFalsy();
    });
    it('1038509 _exportMeasureFormatDetails writes every supported detail', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const detailsDictionary: _PdfDictionary = new _PdfDictionary();
        detailsDictionary.update('C', 2.54);
        detailsDictionary.update('F', _PdfName.get('D'));
        detailsDictionary.update('D', 100);
        detailsDictionary.update('RD', '1/8');
        detailsDictionary.update('U', 'cm');
        detailsDictionary.update('RT', 'ratio');
        detailsDictionary.update('SS', 'suffix');
        detailsDictionary.update('FD', 'fraction');
        // Act
        jsonDocument._exportMeasureFormatDetails('distance', detailsDictionary);
        // Assert
        expect(jsonDocument._table.get('distance')).toBe(
            '{"c":"2.54","f":"D","d":"100","rd":"1/8","u":"cm","rt":"ratio","ss":"suffix","fd":"fraction"}'
        );
    });
    it('1038509 _exportMeasureFormatDetails writes empty JSON for absent details', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const detailsDictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._exportMeasureFormatDetails('distance', detailsDictionary);
        // Assert
        expect(jsonDocument._table.get('distance')).toBe('{}');
        expect(jsonDocument._table.size).toBe(1);
    });
});
describe('1038509 JSON appearance survived mutants lines 628 to 777', () => {
    it('1038509 _getAppearanceString writes ap wrapper bytes', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        appearanceDictionary.update('N', _PdfName.get('Normal'));
        // Act
        const result: Uint8Array = jsonDocument._getAppearanceString(appearanceDictionary);
        const text: string = String.fromCharCode.apply(null, result as unknown as number[]);
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(text).toBe('{"ap":{"N":{"name":"Normal"}}}');
        expect(text).not.toBe('');
    });
    it('1038509 _writeAppearanceDictionary ignores empty dictionary', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeAppearanceDictionary(table, dictionary);
        // Assert
        expect(table.size).toBe(0);
        expect(table.has('N')).toBeFalsy();
    });
    it('1038509 _writeAppearanceDictionary filters structural keys', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('P', 'page');
        dictionary.update('Parent', 'parent');
        dictionary.update('Dest', 'destination');
        dictionary.update('OC', _PdfName.get('Layer'));
        dictionary.update('N', _PdfName.get('Normal'));
        // Act
        jsonDocument._writeAppearanceDictionary(table, dictionary);
        // Assert
        expect(table.get('N')).toBe('{"name":"Normal"}');
        expect(table.has('P')).toBeFalsy();
        expect(table.has('Parent')).toBeFalsy();
        expect(table.has('Dest')).toBeFalsy();
        expect(table.has('OC')).toBeFalsy();
        expect(table.size).toBe(1);
    });
    it('1038509 _writeAppearanceDictionary writes OC array', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('OC', [_PdfName.get('LayerOne'), _PdfName.get('LayerTwo')]);
        // Act
        jsonDocument._writeAppearanceDictionary(table, dictionary);
        // Assert
        expect(table.get('OC')).toBe('{"array":[{"name":"LayerOne"},{"name":"LayerTwo"}]}');
        expect(table.size).toBe(1);
    });
    it('1038509 _writeAppearanceDictionary skips AP during grouping', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('AP', _PdfName.get('Appearance'));
        dictionary.update('N', _PdfName.get('Normal'));
        jsonDocument._isGroupingSupport = true;
        // Act
        jsonDocument._writeAppearanceDictionary(table, dictionary);
        // Assert
        expect(table.has('AP')).toBeFalsy();
        expect(table.get('N')).toBe('{"name":"Normal"}');
        expect(jsonDocument._isGroupingSupport).toBeTruthy();
    });
    it('1038509 _writeAppearanceDictionary writes AP without grouping', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('AP', _PdfName.get('Appearance'));
        jsonDocument._isGroupingSupport = false;
        // Act
        jsonDocument._writeAppearanceDictionary(table, dictionary);
        // Assert
        expect(table.get('AP')).toBe('{"name":"Appearance"}');
        expect(jsonDocument._isGroupingSupport).toBeFalsy();
    });
    it('1038509 _writeObject writes PdfName output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const name: _PdfName = _PdfName.get('Normal');
        // Act
        jsonDocument._writeObject(table, name, null, 'N');
        // Assert
        expect(table.get('N')).toBe('{"name":"Normal"}');
        expect(name.name).toBe('Normal');
    });
    it('1038509 _writeObject writes ordinary array output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeObject(table, [1, 2.5, true], dictionary, 'Values');
        // Assert
        expect(table.get('Values')).toBe('{"array":[{"int":"1"},{"fixed":"2.5"},{"boolean":"true"}]}');
        expect(jsonDocument._isColorSpace).toBeFalsy();
    });
    it('1038509 _writeObject writes ColorSpace string array as hexadecimal', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._writeObject(table, ['RGB'], dictionary, 'ColorSpace');
        // Assert
        expect(table.get('ColorSpace')).toBe('{"array":[{"string":{"encoding":"hex","bytes":"524742"}}]}');
        expect(jsonDocument._isColorSpace).toBeFalsy();
    });
    it('1038509 _writeObject writes ordinary string without hexadecimal envelope', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, 'plain text', null, 'Text');
        // Assert
        expect(table.get('Text')).toBe('{"string":"plain text"}');
        expect(table.get('Text')).not.toContain('encoding');
    });
    it('1038509 _writeObject writes tab string as hexadecimal', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, 'A\tB', null, 'Text');
        // Assert
        expect(table.get('Text')).toBe('{"string":{"encoding":"hex","bytes":"415C7442"}}');
        expect(table.get('Text')).toContain('encoding');
    });
    it('1038509 _writeObject writes AllowedInteractions as hexadecimal', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, 'Copy', null, 'AllowedInteractions');
        // Assert
        expect(table.get('AllowedInteractions')).toBe('{"string":{"encoding":"hex","bytes":"436F7079"}}');
        expect(table.has('allowedinteractions')).toBeFalsy();
    });
    it('1038509 _writeObject writes integer and fixed outputs separately', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, 5, null, 'Integer');
        jsonDocument._writeObject(table, 5.5, null, 'Fixed');
        // Assert
        expect(table.get('Integer')).toBe('{"int":"5"}');
        expect(table.get('Fixed')).toBe('{"fixed":"5.5"}');
    });
    it('1038509 _writeObject writes both boolean outputs', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, true, null, 'Enabled');
        jsonDocument._writeObject(table, false, null, 'Disabled');
        // Assert
        expect(table.get('Enabled')).toBe('{"boolean":"true"}');
        expect(table.get('Disabled')).toBe('{"boolean":"false"}');
    });
    it('1038509 _writeObject writes nested dictionary output', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Name', _PdfName.get('Resource'));
        // Act
        jsonDocument._writeObject(table, dictionary, null, 'Resources');
        // Assert
        expect(table.get('Resources')).toBe('{"dict":{"Name":{"name":"Resource"}}}');
        expect(table.has('Name')).toBeFalsy();
    });
    it('1038509 _writeObject writes raw stream data and updates Length', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetString: (hex?: boolean) => string = stream.getString;
        stream.dictionary.update('Subtype', _PdfName.get('Form'));
        stream.getString = (_hex?: boolean): string => {
            return '414243';
        };
        // Act
        jsonDocument._writeObject(table, stream, null, 'Stream');
        // Assert
        const output: string = table.get('Stream');
        expect(output).toContain('"mode":"raw"');
        expect(output).toContain('"encoding":"hex"');
        expect(output).toContain('"bytes":"414243"');
        expect(stream.dictionary.has('Length')).toBeTruthy();
        stream.getString = originalGetString;
        expect(stream.getString).toBe(originalGetString);
    });
    it('1038509 _writeObject writes filtered stream without Type or supported Subtype', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetString: (hex?: boolean) => string = stream.getString;
        stream.dictionary.update('Type', _PdfName.get('Metadata'));
        stream.getString = (_hex?: boolean): string => {
            return 'metadata';
        };
        // Act
        jsonDocument._writeObject(table, stream, null, 'Stream');
        // Assert
        const output: string = table.get('Stream');
        expect(output).toContain('"mode":"filtered"');
        expect(output).toContain('"encoding":"ascii"');
        expect(output).toContain('"bytes":"metadata"');
        stream.getString = originalGetString;
        expect(stream.getString).toBe(originalGetString);
    });
    it('1038509 _writeObject omits bytes for empty stream data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const originalGetString: (hex?: boolean) => string = stream.getString;
        stream.dictionary.update('Type', _PdfName.get('Metadata'));
        stream.getString = (_hex?: boolean): string => {
            return '';
        };
        // Act
        jsonDocument._writeObject(table, stream, null, 'Stream');
        // Assert
        const output: string = table.get('Stream');
        expect(output).toContain('"mode":"filtered"');
        expect(output).toContain('"encoding":"ascii"');
        expect(output).not.toContain('"bytes"');
        expect(stream.dictionary.has('Length')).toBeFalsy();
        stream.getString = originalGetString;
        expect(stream.getString).toBe(originalGetString);
    });
    it('1038509 _writeObject resolves PdfReference through cross reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, _PdfName.get('Resolved'));
        jsonDocument._crossReference = document._crossReference;
        // Act
        jsonDocument._writeObject(table, reference, dictionary, 'Reference');
        // Assert
        expect(table.get('Reference')).toBe('{"name":"Resolved"}');
        expect(table.size).toBe(1);
        document.destroy();
    });
    it('1038509 _writeObject writes null and undefined outputs', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        // Act
        jsonDocument._writeObject(table, null, null, 'NullValue');
        jsonDocument._writeObject(table, undefined, null, 'UndefinedValue');
        // Assert
        expect(table.get('NullValue')).toBe('{"null":"null"}');
        expect(table.get('UndefinedValue')).toBe('{"null":"null"}');
        expect(table.size).toBe(2);
    });
});
function bytesFromText(value: string): Uint8Array {
    const bytes: number[] = [];
    for (let index: number = 0; index < value.length; index++) {
        bytes.push(value.charCodeAt(index));
    }
    return new Uint8Array(bytes);
}
describe('1038509 JSON survived mutants lines 778 to 883', () => {
    it('1038509 _writeTable writes an exact keyed table entry', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const array: Map<string, string>[] = [];
        // Act
        jsonDocument._writeTable('string', 'value', table, 'Name', array);
        // Assert
        expect(table.get('Name')).toBe('{"string":"value"}');
        expect(table.size).toBe(1);
        expect(array.length).toBe(0);
    });
    it('1038509 _writeTable pushes an exact array entry without a key', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const table: Map<string, string> = new Map<string, string>();
        const array: Map<string, string>[] = [];
        // Act
        jsonDocument._writeTable('int', '10', table, '', array);
        // Assert
        expect(table.size).toBe(0);
        expect(array.length).toBe(1);
        expect(array[0].get('int')).toBe('10');
        expect(array[0].size).toBe(1);
    });
    it('1038509 _writeArray writes every ordinary item in order', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const array: Map<string, string>[] = [];
        // Act
        jsonDocument._writeArray(array, [1, 'text', false], dictionary, false);
        // Assert
        expect(array.length).toBe(3);
        expect(array[0].get('int')).toBe('1');
        expect(array[1].get('string')).toBe('text');
        expect(array[2].get('boolean')).toBe('false');
        expect(jsonDocument._isColorSpace).toBeFalsy();
    });
    it('1038509 _writeArray enables color space only for string items', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const array: Map<string, string>[] = [];
        // Act
        jsonDocument._writeArray(array, [1, 'RGB'], dictionary, true);
        // Assert
        expect(array.length).toBe(2);
        expect(array[0].get('int')).toBe('1');
        expect(array[1].get('string')).toBe('{"encoding":"hex","bytes":"524742"}');
        expect(jsonDocument._isColorSpace).toBeTruthy();
    });
    it('1038509 _convertToJsonArray writes exact ordered JSON without trailing comma', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const first: Map<string, string> = new Map<string, string>();
        const second: Map<string, string> = new Map<string, string>();
        first.set('int', '1');
        second.set('string', 'text');
        // Act
        const result: string = jsonDocument._convertToJsonArray([first, second]);
        // Assert
        expect(result).toBe('[{"int":"1"},{"string":"text"}]');
        expect(result).not.toContain(',]');
    });
    it('1038509 _convertToJsonArray writes an exact empty array', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const array: Map<string, string>[] = [];
        // Act
        const result: string = jsonDocument._convertToJsonArray(array);
        // Assert
        expect(result).toBe('[]');
        expect(result.length).toBe(2);
    });
    it('1038509 _parseJson parses complete JSON and stores document context', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        const data: Uint8Array = bytesFromText('{"name":"value"}');
        // Act
        const result: { name: string } = jsonDocument._parseJson(document, data) as { name: string };
        // Assert
        expect(result.name).toBe('value');
        expect(jsonDocument._document).toBe(document);
        expect(jsonDocument._crossReference).toBe(document._crossReference);
        document.destroy();
    });
    it('1038509 _parseJson trims trailing incomplete content to the final brace', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        const data: Uint8Array = bytesFromText('{"name":"value"}incomplete');
        // Act
        const result: { name: string } = jsonDocument._parseJson(document, data) as { name: string };
        // Assert
        expect(result.name).toBe('value');
        expect(jsonDocument._document).toBe(document);
        document.destroy();
    });
    it('1038509 _importFormData imports scalar and array values then invokes import once', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        const data: Uint8Array = bytesFromText('{"Text":"one","Choice":["A","B"]}');
        const originalImportField: () => void = jsonDocument._importField;
        let importCount: number = 0;
        jsonDocument._importField = (): void => {
            importCount++;
        };
        // Act
        jsonDocument._importFormData(document, data);
        // Assert
        expect(jsonDocument._fields.get('Text')).toEqual(['one']);
        expect(jsonDocument._fields.get('Choice')).toEqual(['A', 'B']);
        expect(importCount).toBe(1);
        jsonDocument._importField = originalImportField;
        expect(jsonDocument._importField).toBe(originalImportField);
        document.destroy();
    });
    it('1038509 _importFormData does not invoke import for an empty JSON object', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        const data: Uint8Array = bytesFromText('{}');
        const originalImportField: () => void = jsonDocument._importField;
        let importCount: number = 0;
        jsonDocument._importField = (): void => {
            importCount++;
        };
        // Act
        jsonDocument._importFormData(document, data);
        // Assert
        expect(jsonDocument._fields.size).toBe(0);
        expect(importCount).toBe(0);
        jsonDocument._importField = originalImportField;
        expect(jsonDocument._importField).toBe(originalImportField);
        document.destroy();
    });
});
import { PdfAnnotation } from '../src/pdf/core/annotations/annotation';
function bytesFromJson(value: string): Uint8Array {
    const bytes: number[] = [];
    for (let index: number = 0; index < value.length; index++) {
        bytes.push(value.charCodeAt(index));
    }
    return new Uint8Array(bytes);
}
describe('1038509 _importAnnotations survived mutants lines 884 to 1025', () => {
    it('1038509 _importAnnotations imports a valid line annotation on page zero', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{' +
            '"type":"line","start":"10,20","end":"30,40",' +
            '"rect":{"x":"10","y":"20","width":"30","height":"40"},' +
            '"name":"line-name"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(1);
        const annotation: PdfAnnotation = document.getPage(0).annotations.at(0);
        expect(annotation._dictionary.get('Subtype').name).toBe('Line');
        expect(annotation._dictionary.getArray('L')).toEqual([10, 20, 30, 40]);
        expect(annotation._dictionary.get('NM')).toBe('line-name');
        expect(annotation._isImported).toBeTruthy();
        expect(jsonDocument._isImport).toBeTruthy();
        document.destroy();
    });
    it('1038509 _importAnnotations imports object shaped shapeAnnotation data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":{' +
            '"first":{"type":"text","rect":{"x":"1","y":"2","width":"3","height":"4"}}' +
            '}}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(1);
        const annotation: PdfAnnotation = document.getPage(0).annotations.at(0);
        expect(annotation._dictionary.get('Subtype').name).toBe('Text');
        expect(annotation._dictionary.getArray('Rect')).toEqual([1, 2, 3, 4]);
        document.destroy();
    });
    it('1038509 _importAnnotations imports annotations from each valid page key', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{' +
            '"0":{"shapeAnnotation":[{"type":"text"}]},' +
            '"1":{"shapeAnnotation":[{"type":"square"}]}' +
            '}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(1);
        expect(document.getPage(1).annotations.count).toBe(1);
        expect(document.getPage(0).annotations.at(0)._dictionary.get('Subtype').name).toBe('Text');
        expect(document.getPage(1).annotations.at(0)._dictionary.get('Subtype').name).toBe('Square');
        document.destroy();
    });
    it('1038509 _importAnnotations ignores a page index outside page count', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"1":{"shapeAnnotation":[{"type":"text"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
    it('1038509 _importAnnotations ignores an empty page annotation object', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson('{"pdfAnnotation":{"0":{}}}');
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(jsonDocument._isImport).toBeTruthy();
        document.destroy();
    });
    it('1038509 _importAnnotations ignores page data without shapeAnnotation', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"otherAnnotation":[{"type":"text"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(document.getPage(0)._pageDictionary.has('Annots')).toBeFalsy();
        document.destroy();
    });
    it('1038509 _importAnnotations ignores empty shapeAnnotation data', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":null}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(jsonDocument._groupHolders.length).toBe(0);
        document.destroy();
    });
    it('1038509 _importAnnotations ignores annotation without type', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{"name":"missing-type"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(document.getPage(0)._pageDictionary.has('Annots')).toBeFalsy();
        document.destroy();
    });
    it('1038509 _importAnnotations ignores unsupported annotation type', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{"type":"unsupported"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(0);
        expect(document.getPage(0)._pageDictionary.has('Annots')).toBeFalsy();
        document.destroy();
    });
    it('1038509 _importAnnotations maps line type using exact lowercase comparison', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{"type":"LINE"}]}}}'
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(document.getPage(0).annotations.count).toBe(1);
        expect(document.getPage(0).annotations.at(0)._dictionary.get('Subtype').name).toBe('Line');
        document.destroy();
    });
    it('1038509 _importAnnotations invokes group handling when NM exists', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{"type":"text","name":"group-name"}]}}}'
        );
        const originalAddReferenceToGroup:
            (reference: _PdfReference, dictionary: _PdfDictionary) => void =
            jsonDocument._addReferenceToGroup;
        let groupCallCount: number = 0;
        jsonDocument._addReferenceToGroup = (
            _reference: _PdfReference,
            _dictionary: _PdfDictionary
        ): void => {
            groupCallCount++;
        };
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(groupCallCount).toBe(1);
        expect(document.getPage(0).annotations.count).toBe(1);
        expect(document.getPage(0).annotations.at(0)._dictionary.get('NM')).toBe('group-name');
        jsonDocument._addReferenceToGroup = originalAddReferenceToGroup;
        expect(jsonDocument._addReferenceToGroup).toBe(originalAddReferenceToGroup);
        document.destroy();
    });
    it('1038509 _importAnnotations does not invoke group handling without NM or IRT', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = bytesFromJson(
            '{"pdfAnnotation":{"0":{"shapeAnnotation":[{"type":"text"}]}}}'
        );
        const originalAddReferenceToGroup:
            (reference: _PdfReference, dictionary: _PdfDictionary) => void =
            jsonDocument._addReferenceToGroup;
        let groupCallCount: number = 0;
        jsonDocument._addReferenceToGroup = (
            _reference: _PdfReference,
            _dictionary: _PdfDictionary
        ): void => {
            groupCallCount++;
        };
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(groupCallCount).toBe(0);
        expect(document.getPage(0).annotations.count).toBe(1);
        jsonDocument._addReferenceToGroup = originalAddReferenceToGroup;
        expect(jsonDocument._addReferenceToGroup).toBe(originalAddReferenceToGroup);
        document.destroy();
    });
    it('1038509 _importAnnotations resolves pending IRT group reference', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const holderDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        const data: Uint8Array =
            bytesFromJson('{"pdfAnnotation":{}}');
        holderDictionary.update('IRT', 'parent-name');
        jsonDocument._groupHolders = [holderDictionary];
        jsonDocument._groupReferences.set(
            'parent-name',
            reference
        );
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(holderDictionary.has('IRT')).toBeTruthy();
        expect(holderDictionary._map.IRT).toBe(reference);
        expect(holderDictionary._map.IRT)
            .not.toBe('parent-name');
        expect(jsonDocument._groupHolders.length).toBe(0);
        expect(jsonDocument._groupReferences.size).toBe(0);
        document.destroy();
    });
    it('1038509 _importAnnotations removes unresolved pending IRT value', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const holderDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        holderDictionary.update('IRT', 'missing-name');
        jsonDocument._groupHolders = [holderDictionary];
        const data: Uint8Array = bytesFromJson('{"pdfAnnotation":{}}');
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(holderDictionary.has('IRT')).toBeFalsy();
        expect(jsonDocument._groupHolders.length).toBe(0);
        expect(jsonDocument._groupReferences.size).toBe(0);
        document.destroy();
    });
    it('1038509 _importAnnotations leaves empty pending IRT unchanged before reset', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const holderDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        holderDictionary.update('IRT', '');
        jsonDocument._groupHolders = [holderDictionary];
        const data: Uint8Array = bytesFromJson('{"pdfAnnotation":{}}');
        // Act
        jsonDocument._importAnnotations(document, data);
        // Assert
        expect(holderDictionary.get('IRT')).toBe('');
        expect(holderDictionary.has('IRT')).toBeTruthy();
        expect(jsonDocument._groupHolders.length).toBe(0);
        document.destroy();
    });
});
function makeAnnotationDataHarness(subtype: string = 'Text'): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
    dictionary: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    dictionary.update('Subtype', _PdfName.get(subtype));
    return { jsonDocument, document, dictionary };
}
describe('1038509 _addAnnotationData survived mutants lines 1027 to 1220', () => {
    it('1038509 _addAnnotationData writes state state model and inreplyto', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {state: string; statemodel: string; inreplyto: string} = {
            state: 'Accepted',
            statemodel: 'Review',
            inreplyto: 'parent-name'
        };
        const annotationKeys: string[] = ['state', 'statemodel', 'inreplyto'];
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, annotationKeys);
        // Assert
        expect(harness.dictionary.get('State')).toBe('Accepted');
        expect(harness.dictionary.get('StateModel')).toBe('Review');
        expect(harness.dictionary.get('IRT')).toBe('parent-name');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes group reply type only for group', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {replytype: string} = { replytype: 'GROUP' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['replytype']);
        // Assert
        const replyType: _PdfName = harness.dictionary.get('RT');
        expect(replyType.name).toBe('Group');
        expect(harness.dictionary.has('ReplyType')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write non group reply type', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {replytype: string} = { replytype: 'reply' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['replytype']);
        // Assert
        expect(harness.dictionary.has('RT')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData combines start and end into exact line points', () => {
        // Arrange
        const harness = makeAnnotationDataHarness('Line');
        const annotation: {start: string; end: string} = {
            start: '10,20',
            end: '30,40'
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['start', 'end']);
        // Assert
        expect(harness.dictionary.getArray('L')).toEqual([10, 20, 30, 40]);
        expect(harness.dictionary.getArray('L').length).toBe(4);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes exact rectangle coordinates', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {rect: {x: string; y: string; width: string; height: string}} = {
            rect: { x: '1', y: '2', width: '30', height: '40' }
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['rect']);
        // Assert
        expect(harness.dictionary.getArray('Rect')).toEqual([1, 2, 30, 40]);
        expect(harness.dictionary.getArray('Rect').length).toBe(4);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes array color divided by 255', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {color: string} = { color: '#FF8000' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['color']);
        // Assert
        expect(harness.dictionary.getArray('C')).toEqual([1, 128 / 255, 0]);
        expect(harness.dictionary.getArray('C')[1]).not.toBe(128 * 255);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes object color divided by 255', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {color: string} = { color: '#4080FF' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['color']);
        // Assert
        expect(harness.dictionary.getArray('C')).toEqual([64 / 255, 128 / 255, 1]);
        expect(harness.dictionary.getArray('C').length).toBe(3);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes redact OC only for Redact subtype', () => {
        // Arrange
        const harness = makeAnnotationDataHarness('Redact');
        const annotation: {oc: string} = { oc: '#FF0080' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['oc']);
        // Assert
        expect(harness.dictionary.getArray('OC')).toEqual([1, 0, 128 / 255]);
        expect(harness.dictionary.getArray('OC')[2]).not.toBe(128 * 255);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write OC for non Redact subtype', () => {
        // Arrange
        const harness = makeAnnotationDataHarness('Text');
        const annotation: {oc: number[]} = { oc: [255, 0, 0] };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['oc']);
        // Assert
        expect(harness.dictionary.has('OC')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes AFC and interior color arrays', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {afc: string; 'interior-color': string} = {
            afc: '#FF8040',
            'interior-color': '#2040FF'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['afc', 'interior-color']
        );
        // Assert
        expect(harness.dictionary.getArray('AFC')).toEqual([1, 128 / 255, 64 / 255]);
        expect(harness.dictionary.getArray('IC')).toEqual([32 / 255, 64 / 255, 1]);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes date name subject and title keys', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {date: string; name: string; subject: string; title: string} = {
            date: 'D:20260813095200',
            name: 'annotation-name',
            subject: 'annotation-subject',
            title: 'annotation-title'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['date', 'name', 'subject', 'title']
        );
        // Assert
        expect(harness.dictionary.get('M')).toBe('D:20260813095200');
        expect(harness.dictionary.get('NM')).toBe('annotation-name');
        expect(harness.dictionary.get('Subj')).toBe('annotation-subject');
        expect(harness.dictionary.get('T')).toBe('annotation-title');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData creates URI action and caches reference', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {uri: string} = { uri: 'https://example.com' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['uri']);
        // Assert
        const actionReference: _PdfReference = harness.dictionary._map.A;
        const actionDictionary: _PdfDictionary = harness.document._crossReference._cacheMap.get(actionReference);
        expect(actionReference instanceof _PdfReference).toBeTruthy();
        expect(actionDictionary.get('Type').name).toBe('Action');
        expect(actionDictionary.get('S').name).toBe('URI');
        expect(actionDictionary.get('URI')).toBe('https://example.com');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes icon only for nonempty value', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {icon: string} = { icon: 'Comment' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['icon']);
        // Assert
        const icon: _PdfName = harness.dictionary.get('Name');
        expect(icon.name).toBe('Comment');
        expect(harness.dictionary.has('icon')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write empty icon', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {icon: string} = { icon: '' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['icon']);
        // Assert
        expect(harness.dictionary.has('Name')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes exact rotation number', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {rotation: string} = { rotation: '90.5' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['rotation']);
        // Assert
        expect(harness.dictionary.get('Rotate')).toBe(90.5);
        expect(harness.dictionary.has('rotation')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes IT and caption style names', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {it: string; 'caption-style': string} = {
            it: 'LineArrow',
            'caption-style': 'Top'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['it', 'caption-style']
        );
        // Assert
        expect(harness.dictionary.get('IT').name).toBe('LineArrow');
        expect(harness.dictionary.get('CP').name).toBe('Top');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes exact default style string', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {defaultstyle: {font: string; color: string}} = {
            defaultstyle: { font: 'Arial', color: 'red' }
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['defaultstyle']
        );
        // Assert
        expect(harness.dictionary.get('DS')).toBe('font:Arial;color:red');
        expect(harness.dictionary.get('DS')).not.toBe('font:Arial;color:red;');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write empty default style', () => {
        // Arrange
        const harness = makeAnnotationDataHarness();
        const annotation: {defaultstyle: {}} = { defaultstyle: {} };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['defaultstyle']
        );
        // Assert
        expect(harness.dictionary.has('DS')).toBeFalsy();
        harness.document.destroy();
    });
});
import { PdfAnnotationFlag } from '../src/pdf/core/enumerator';
function makeAnnotationImportHarness(subtype: string = 'Text'): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
    dictionary: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    dictionary.update('Subtype', _PdfName.get(subtype));
    return { jsonDocument, document, dictionary };
}
describe('1038509 JSON survived mutants lines 1228 to 1390', () => {
    it('1038509 _addAnnotationData combines multiple annotation flags', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {flags: string} = { flags: 'print,locked' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['flags']);
        // Assert
        const expectedFlags: PdfAnnotationFlag = PdfAnnotationFlag.print | PdfAnnotationFlag.locked;
        expect(harness.dictionary.get('F')).toBe(expectedFlags);
        expect(harness.dictionary.get('F')).not.toBe(PdfAnnotationFlag.print);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes the first annotation flag directly', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {flags: string} = { flags: 'print' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['flags']);
        // Assert
        expect(harness.dictionary.get('F')).toBe(PdfAnnotationFlag.print);
        expect(harness.dictionary.has('flags')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write nonstring flags', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {flags: number} = { flags: 4 };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['flags']);
        // Assert
        expect(harness.dictionary.has('F')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes repeat true and false values', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const trueAnnotation: {repeat: string} = { repeat: 'true' };
        const falseAnnotation: {repeat: string} = { repeat: 'false' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, trueAnnotation, ['repeat']);
        const trueResult: boolean = harness.dictionary.get('Repeat');
        harness.jsonDocument._addAnnotationData(harness.dictionary, falseAnnotation, ['repeat']);
        const falseResult: boolean = harness.dictionary.get('Repeat');
        // Assert
        expect(trueResult).toBeTruthy();
        expect(falseResult).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData replaces escaped carriage return in contents', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {contents: string} = { contents: 'first\\rsecond' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['contents']);
        // Assert
        expect(harness.dictionary.get('Contents')).toBe('first\rsecond');
        expect(harness.dictionary.get('Contents')).not.toBe('first\\rsecond');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes ordinary nonempty contents', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {contents: string} = { contents: 'annotation contents' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['contents']);
        // Assert
        expect(harness.dictionary.get('Contents')).toBe('annotation contents');
        expect(harness.dictionary.has('contents')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData does not write empty contents', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {contents: string} = { contents: '' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['contents']);
        // Assert
        expect(harness.dictionary.has('Contents')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes exact numeric Q value', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {q: string} = { q: '2' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['q']);
        // Assert
        expect(harness.dictionary.get('Q')).toBe(2);
        expect(harness.dictionary.get('Q')).not.toBe('2');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes exact ink gesture arrays', () => {
        // Arrange
        const harness = makeAnnotationImportHarness('Ink');
        const annotation: {inklist: {gesture: number[][]}} = {
            inklist: { gesture: [[1, 2, 3, 4], [5, 6]] }
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['inklist']);
        // Assert
        expect(harness.dictionary.getArray('InkList')).toEqual([[1, 2, 3, 4], [5, 6]]);
        expect(harness.dictionary.getArray('InkList').length).toBe(2);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData rejects inklist without gesture key', () => {
        // Arrange
        const harness = makeAnnotationImportHarness('Ink');
        const annotation: {inklist: {other: number[][]}} = {
            inklist: { other: [[1, 2]] }
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['inklist']);
        // Assert
        expect(harness.dictionary.has('InkList')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData rejects empty ink gesture array', () => {
        // Arrange
        const harness = makeAnnotationImportHarness('Ink');
        const annotation: {inklist: {gesture: number[][]}} = {
            inklist: { gesture: [] }
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['inklist']);
        // Assert
        expect(harness.dictionary.has('InkList')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData parses exact even vertices', () => {
        // Arrange
        const harness = makeAnnotationImportHarness('Polygon');
        const annotation: {vertices: string} = { vertices: '1,2;3,4;5,6' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['vertices']);
        // Assert
        expect(harness.dictionary.getArray('Vertices')).toEqual([1, 2, 3, 4, 5, 6]);
        expect(harness.dictionary.getArray('Vertices').length).toBe(6);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData rejects odd vertices', () => {
        // Arrange
        const harness = makeAnnotationImportHarness('Polygon');
        const annotation: {vertices: string} = { vertices: '1,2,3' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['vertices']);
        // Assert
        expect(harness.dictionary.has('Vertices')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData forwards appearance exactly once', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {appearance: string} = { appearance: 'appearance-data' };
        const originalAddAppearanceData: (dictionary: _PdfDictionary, value: string) => void =
            harness.jsonDocument._addAppearanceData;
        let callCount: number = 0;
        let receivedValue: string = '';
        harness.jsonDocument._addAppearanceData = (
            _dictionary: _PdfDictionary,
            value: string
        ): void => {
            callCount++;
            receivedValue = value;
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['appearance']);
        // Assert
        expect(callCount).toBe(1);
        expect(receivedValue).toBe('appearance-data');
        harness.jsonDocument._addAppearanceData = originalAddAppearanceData;
        expect(harness.jsonDocument._addAppearanceData).toBe(originalAddAppearanceData);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes plain AllowedInteractions string', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {allowedinteractions: string} = {
            allowedinteractions: 'Copy'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['allowedinteractions']
        );
        // Assert
        expect(harness.dictionary.get('AllowedInteractions')).toBe('Copy');
        expect(harness.dictionary.has('allowedinteractions')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData decodes hexadecimal AllowedInteractions object', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {
            allowedinteractions: {encoding: string; bytes: string};
        } = {
            allowedinteractions: {
                encoding: 'hex',
                bytes: '436F7079'
            }
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['allowedinteractions']
        );
        // Assert
        expect(harness.dictionary.get('AllowedInteractions')).toBe('Copy');
        expect(harness.dictionary.get('AllowedInteractions')).not.toBe('436F7079');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData rejects incomplete AllowedInteractions object', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        const annotation: {allowedinteractions: {encoding: string}} = {
            allowedinteractions: { encoding: 'hex' }
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['allowedinteractions']
        );
        // Assert
        expect(harness.dictionary.has('AllowedInteractions')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes custom string and object data when enabled', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        harness.document._allowImportCustomData = true;
        const annotation: {customText: string; customObject: {id: number}} = {
            customText: 'custom-value',
            customObject: { id: 10 }
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['customText', 'customObject']
        );
        // Assert
        expect(harness.dictionary.get('customText')).toBe('custom-value');
        expect(harness.dictionary.get('customObject')).toBe('{"id":10}');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData excludes type and page from custom data', () => {
        // Arrange
        const harness = makeAnnotationImportHarness();
        harness.document._allowImportCustomData = true;
        const annotation: {type: string; page: string} = {
            type: 'text',
            page: '0'
        };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['type', 'page']);
        // Assert
        expect(harness.dictionary.has('type')).toBeFalsy();
        expect(harness.dictionary.has('page')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addLinePoints appends exact comma separated values', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const linePoints: number[] = [];
        // Act
        jsonDocument._addLinePoints('10.5,20.25', linePoints);
        // Assert
        expect(linePoints).toEqual([10.5, 20.25]);
        expect(linePoints.length).toBe(2);
    });
    it('1038509 _addLinePoints ignores value without comma', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const linePoints: number[] = [];
        // Act
        jsonDocument._addLinePoints('10.5', linePoints);
        // Assert
        expect(linePoints.length).toBe(0);
        expect(linePoints).toEqual([]);
    });
    it('1038509 _addString writes only a nonempty value', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._addString(dictionary, 'Present', 'value');
        jsonDocument._addString(dictionary, 'Empty', '');
        // Assert
        expect(dictionary.get('Present')).toBe('value');
        expect(dictionary.has('Empty')).toBeFalsy();
        expect(dictionary.size).toBe(1);
    });
});
function makeMeasureHarness(): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
    dictionary: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    dictionary.update('Subtype', _PdfName.get('Text'));
    return { jsonDocument, document, dictionary };
}
describe('1038509 JSON survived mutants lines 1391 to 1547', () => {
    it('1038509 _addAnnotationData writes line ending pair', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {head: string; tail: string} = {
            head: 'OpenArrow',
            tail: 'ClosedArrow'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['head', 'tail']
        );
        // Assert
        const lineEndings: _PdfName[] = harness.dictionary.getArray('LE');
        expect(lineEndings.length).toBe(2);
        expect(lineEndings[0].name).toBe('OpenArrow');
        expect(lineEndings[1].name).toBe('ClosedArrow');
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes only head line ending', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {head: string} = { head: 'Square' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['head']);
        // Assert
        expect(harness.dictionary.get('LE')).toBe('Square');
        expect(harness.dictionary.has('tail')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData writes only tail line ending', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {tail: string} = { tail: 'Circle' };
        // Act
        harness.jsonDocument._addAnnotationData(harness.dictionary, annotation, ['tail']);
        // Assert
        expect(harness.dictionary.get('LE')).toBe('Circle');
        expect(harness.dictionary.has('head')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData creates border style reference', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {width: string; style: string; dashes: string} = {
            width: '2.5',
            style: 'dash',
            dashes: '3,4'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['width', 'style', 'dashes']
        );
        // Assert
        const reference: _PdfReference = harness.dictionary._map.BS;
        const borderDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(borderDictionary.get('Type').name).toBe('Border');
        expect(borderDictionary.get('W')).toBe(2.5);
        expect(borderDictionary.get('S').name).toBe('D');
        expect(borderDictionary.getArray('D')).toEqual([3, 4]);
        harness.document.destroy();
    });
    it('1038509 _addAnnotationData creates border effect reference', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {intensity: string; style: string} = {
            intensity: '2',
            style: 'cloudy'
        };
        // Act
        harness.jsonDocument._addAnnotationData(
            harness.dictionary,
            annotation,
            ['intensity', 'style']
        );
        // Assert
        const reference: _PdfReference = harness.dictionary._map.BE;
        const effectDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(effectDictionary.get('I')).toBe(2);
        expect(effectDictionary.get('S').name).toBe('C');
        harness.document.destroy();
    });
    it('1038509 _addBorderStyle ignores dashes without comma', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const effectDictionary: _PdfDictionary = new _PdfDictionary();
        const styleDictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._addBorderStyle(
            'dashes',
            '3',
            effectDictionary,
            styleDictionary
        );
        // Assert
        expect(styleDictionary.has('D')).toBeFalsy();
        expect(effectDictionary.size).toBe(0);
    });
    it('1038509 _parseFloatPoints returns exact numeric values', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        // Act
        const result: number[] = jsonDocument._parseFloatPoints('1.5,2.25,3');
        // Assert
        expect(result).toEqual([1.5, 2.25, 3]);
        expect(result.length).toBe(3);
    });
    it('1038509 _addFloatPoints writes nonempty values', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const points: number[] = [1, 2, 3, 4];
        // Act
        jsonDocument._addFloatPoints(dictionary, 'RD', points);
        // Assert
        expect(dictionary.getArray('RD')).toEqual([1, 2, 3, 4]);
        expect(dictionary.getArray('RD')).toBe(points);
    });
    it('1038509 _addFloatPoints rejects empty values', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        // Act
        jsonDocument._addFloatPoints(dictionary, 'RD', []);
        // Assert
        expect(dictionary.has('RD')).toBeFalsy();
        expect(dictionary.size).toBe(0);
    });
    it('1038509 _addMeasureDictionary creates exact measure reference', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {
            type1: string;
            ratevalue: string;
            subtype: string;
            targetunitconversion: string;
        } = {
            type1: 'Measure',
            ratevalue: '1 cm = 1 cm',
            subtype: 'RL',
            targetunitconversion: 'cm'
        };
        const annotationKeys: string[] = [
            'type1',
            'ratevalue',
            'subtype',
            'targetunitconversion'
        ];
        // Act
        harness.jsonDocument._addMeasureDictionary(
            harness.dictionary,
            annotation,
            annotationKeys
        );
        // Assert
        const reference: _PdfReference = harness.dictionary._map.Measure;
        const measureDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(measureDictionary.get('Type').name).toBe('Measure');
        expect(measureDictionary.get('R')).toBe('1 cm = 1 cm');
        expect(measureDictionary.get('Subtype')).toBe('RL');
        expect(measureDictionary.get('TargetUnitConversion')).toBe('cm');
        harness.document.destroy();
    });
    it('1038509 _addMeasureDictionary does not attach without type1', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {ratevalue: string} = { ratevalue: '1:1' };
        const originalCacheSize: number =
            harness.document._crossReference._cacheMap.size;
        // Act
        harness.jsonDocument._addMeasureDictionary(
            harness.dictionary,
            annotation,
            ['ratevalue']
        );
        // Assert
        expect(harness.dictionary.has('Measure')).toBeFalsy();
        expect(harness.document._crossReference._cacheMap.size)
            .toBe(originalCacheSize);
        harness.document.destroy();
    });
    it('1038509 _addMeasureDictionary writes every format array', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const annotation: {
            type1: string;
            area: {u: string};
            distance: {u: string};
            xformat: {u: string};
            tformat: {u: string};
            vformat: {u: string};
        } = {
            type1: 'Measure',
            area: { u: 'sq cm' },
            distance: { u: 'cm' },
            xformat: { u: 'x-unit' },
            tformat: { u: 't-unit' },
            vformat: { u: 'cu cm' }
        };
        const annotationKeys: string[] = [
            'type1', 'area', 'distance', 'xformat', 'tformat', 'vformat'
        ];
        // Act
        harness.jsonDocument._addMeasureDictionary(
            harness.dictionary,
            annotation,
            annotationKeys
        );
        // Assert
        const reference: _PdfReference = harness.dictionary._map.Measure;
        const measureDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(reference);
        expect(measureDictionary.getArray('A')[0].get('U')).toBe('sq cm');
        expect(measureDictionary.getArray('D')[0].get('U')).toBe('cm');
        expect(measureDictionary.getArray('X')[0].get('U')).toBe('x-unit');
        expect(measureDictionary.getArray('T')[0].get('U')).toBe('t-unit');
        expect(measureDictionary.getArray('V')[0].get('U')).toBe('cu cm');
        harness.document.destroy();
    });
    it('1038509 _readDictionaryElements writes every supported key', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const elements: {
            d: string;
            c: string;
            rt: string;
            rd: string;
            ss: string;
            u: string;
            f: string;
            fd: string;
            type: string;
        } = {
            d: '100',
            c: '2.54',
            rt: 'ratio',
            rd: '1/8',
            ss: 'suffix',
            u: 'cm',
            f: 'D',
            fd: 'fraction',
            type: 'NumberFormat'
        };
        // Act
        const dictionary: _PdfDictionary =
            harness.jsonDocument._readDictionaryElements(elements);
        // Assert
        expect(dictionary.get('D')).toBe(100);
        expect(dictionary.get('C')).toBe(2.54);
        expect(dictionary.get('RT')).toBe('ratio');
        expect(dictionary.get('RD')).toBe('1/8');
        expect(dictionary.get('SS')).toBe('suffix');
        expect(dictionary.get('U')).toBe('cm');
        expect(dictionary.get('F').name).toBe('D');
        expect(dictionary.get('FD')).toBe('fraction');
        expect(dictionary.get('Type').name).toBe('NumberFormat');
        harness.document.destroy();
    });
    it('1038509 _readDictionaryElements ignores empty values', () => {
        // Arrange
        const harness = makeMeasureHarness();
        const elements: {u: string; rt: string} = {
            u: '',
            rt: ''
        };
        // Act
        const dictionary: _PdfDictionary =
            harness.jsonDocument._readDictionaryElements(elements);
        // Assert
        expect(dictionary.has('U')).toBeFalsy();
        expect(dictionary.has('RT')).toBeFalsy();
        expect(dictionary.size).toBe(0);
        harness.document.destroy();
    });
});
function makeStreamHarness(subtype: string): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
    dictionary: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    dictionary.update('Subtype', _PdfName.get(subtype));
    return { jsonDocument, document, dictionary };
}
function encodeAppearance(value: string): string {
    let binary: string = '';
    for (let index: number = 0; index < value.length; index++) {
        binary += String.fromCharCode(value.charCodeAt(index));
    }
    return btoa(binary);
}
describe('1038509 JSON survived mutants lines 1547 to 1638', () => {
    it('1038509 _addStreamData creates sound stream with exact metadata', () => {
        // Arrange
        const harness = makeStreamHarness('Sound');
        const data: Map<string, string> = new Map<string, string>();
        data.set('bits', '16');
        data.set('rate', '44100');
        data.set('channels', '2');
        data.set('encoding', 'Signed');
        data.set('filter', 'FlateDecode');
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '0A141EFF');
        // Assert
        const reference: _PdfReference = harness.dictionary._map.Sound;
        const soundStream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(soundStream.dictionary.get('Type').name).toBe('Sound');
        expect(soundStream.dictionary.get('bits')).toBe(16);
        expect(soundStream.dictionary.get('rate')).toBe(44100);
        expect(soundStream.dictionary.get('channels')).toBe(2);
        expect(soundStream.dictionary.get('E').name).toBe('Signed');
        expect(soundStream.dictionary.get('Filter').name).toBe('FlateDecode');
        expect(soundStream.dictionary.objId)
            .toBe(reference.objectNumber + ' ' + reference.generationNumber);
        harness.document.destroy();
    });
    it('1038509 _addStreamData ignores empty sound metadata entries', () => {
        // Arrange
        const harness = makeStreamHarness('Sound');
        const data: Map<string, string> = new Map<string, string>();
        data.set('bits', '');
        data.set('', '44100');
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '01');
        // Assert
        const reference: _PdfReference = harness.dictionary._map.Sound;
        const soundStream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(reference);
        expect(soundStream.dictionary.has('bits')).toBeFalsy();
        expect(soundStream.dictionary.has('rate')).toBeFalsy();
        expect(soundStream.dictionary.get('Type').name).toBe('Sound');
        harness.document.destroy();
    });
    it('1038509 _addStreamData creates file attachment dictionaries', () => {
        // Arrange
        const harness = makeStreamHarness('FileAttachment');
        const data: Map<string, string> = new Map<string, string>();
        data.set('file', 'attachment.txt');
        data.set('size', '3');
        data.set('creation', 'D:20260101000000');
        data.set('modification', 'D:20260202000000');
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '414243');
        // Assert
        const fileReference: _PdfReference = harness.dictionary._map.FS;
        const fileDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(fileReference);
        const embeddedDictionary: _PdfDictionary = fileDictionary.get('EF');
        const streamReference: _PdfReference = embeddedDictionary._map.F;
        const fileStream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(streamReference);
        const parameters: _PdfDictionary = fileStream.dictionary.get('Params');
        expect(fileDictionary.get('Type').name).toBe('Filespec');
        expect(fileDictionary.get('F')).toBe('attachment.txt');
        expect(fileDictionary.get('UF')).toBe('attachment.txt');
        expect(parameters.get('Size')).toBe(3);
        expect(fileStream.dictionary.get('DL')).toBe(3);
        expect(parameters.get('CreationDate')).toBe('D:20260101000000');
        expect(parameters.get('ModificationDate')).toBe('D:20260202000000');
        expect(fileStream.dictionary.get('Filter').name).toBe('FlateDecode');
        harness.document.destroy();
    });
    it('1038509 _addStreamData keeps zero file size', () => {
        // Arrange
        const harness = makeStreamHarness('FileAttachment');
        const data: Map<string, string> = new Map<string, string>();
        data.set('size', '0');
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '');
        // Assert
        const fileReference: _PdfReference = harness.dictionary._map.FS;
        const fileDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(fileReference);
        const embeddedDictionary: _PdfDictionary = fileDictionary.get('EF');
        const streamReference: _PdfReference = embeddedDictionary._map.F;
        const fileStream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(streamReference);
        const parameters: _PdfDictionary = fileStream.dictionary.get('Params');
        expect(parameters.get('Size')).toBe(0);
        expect(fileStream.dictionary.get('DL')).toBe(0);
        harness.document.destroy();
    });
    it('1038509 _addStreamData ignores empty file metadata entries', () => {
        // Arrange
        const harness = makeStreamHarness('FileAttachment');
        const data: Map<string, string> = new Map<string, string>();
        data.set('file', '');
        data.set('creation', '');
        data.set('modification', '');
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '01');
        // Assert
        const fileReference: _PdfReference = harness.dictionary._map.FS;
        const fileDictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(fileReference);
        const embeddedDictionary: _PdfDictionary = fileDictionary.get('EF');
        const streamReference: _PdfReference = embeddedDictionary._map.F;
        const fileStream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(streamReference);
        const parameters: _PdfDictionary = fileStream.dictionary.get('Params');
        expect(fileDictionary.has('F')).toBeFalsy();
        expect(fileDictionary.has('UF')).toBeFalsy();
        expect(parameters.has('CreationDate')).toBeFalsy();
        expect(parameters.has('ModificationDate')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _addStreamData does nothing for unsupported subtype', () => {
        // Arrange
        const harness = makeStreamHarness('Text');
        const data: Map<string, string> = new Map<string, string>();
        const originalCacheSize: number =
            harness.document._crossReference._cacheMap.size;
        // Act
        harness.jsonDocument._addStreamData(harness.dictionary, data, '01');
        // Assert
        expect(harness.dictionary.has('Sound')).toBeFalsy();
        expect(harness.dictionary.has('FS')).toBeFalsy();
        expect(harness.document._crossReference._cacheMap.size)
            .toBe(originalCacheSize);
        harness.document.destroy();
    });
    it('1038509 _addAppearanceData writes exact AP dictionary', () => {
        // Arrange
        const harness = makeStreamHarness('Text');
        const appearance: string = encodeAppearance(
            '{"ap":{"N":{"name":"Normal"}}}'
        );
        // Act
        harness.jsonDocument._addAppearanceData(harness.dictionary, appearance);
        // Assert
        const appearanceDictionary: _PdfDictionary = harness.dictionary.get('AP');
        expect(appearanceDictionary instanceof _PdfDictionary).toBeTruthy();
        expect(appearanceDictionary.get('N').name).toBe('Normal');
        expect(appearanceDictionary.size).toBe(1);
        harness.document.destroy();
    });
    it('1038509 _addAppearanceData trims trailing incomplete content', () => {
        // Arrange
        const harness = makeStreamHarness('Text');
        const appearance: string = encodeAppearance(
            '{"ap":{"N":{"name":"Normal"}}}incomplete'
        );
        // Act
        harness.jsonDocument._addAppearanceData(harness.dictionary, appearance);
        // Assert
        const appearanceDictionary: _PdfDictionary = harness.dictionary.get('AP');
        expect(appearanceDictionary.get('N').name).toBe('Normal');
        expect(appearanceDictionary.size).toBe(1);
        harness.document.destroy();
    });
    it('1038509 _addAppearanceData does not write AP without ap key', () => {
        // Arrange
        const harness = makeStreamHarness('Text');
        const appearance: string = encodeAppearance(
            '{"other":{"N":{"name":"Normal"}}}'
        );
        // Act
        harness.jsonDocument._addAppearanceData(harness.dictionary, appearance);
        // Assert
        expect(harness.dictionary.has('AP')).toBeFalsy();
        expect(harness.dictionary.get('Subtype').name).toBe('Text');
        harness.document.destroy();
    });
    it('1038509 _addAppearanceData does not write AP for empty input', () => {
        // Arrange
        const harness = makeStreamHarness('Text');
        // Act
        harness.jsonDocument._addAppearanceData(harness.dictionary, '');
        // Assert
        expect(harness.dictionary.has('AP')).toBeFalsy();
        expect(harness.dictionary.size).toBe(1);
        harness.document.destroy();
    });
});
function makeAppearanceHarness(): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    return { jsonDocument, document };
}
describe('1038509 JSON survived mutants lines 1640 to 1747', () => {
    it('1038509 _parseAppearance writes name integer and fixed values', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const name: _PdfName = harness.jsonDocument._parseAppearance({ name: 'Normal' });
        const integer: number = harness.jsonDocument._parseAppearance({ int: '10' });
        const fixed: number = harness.jsonDocument._parseAppearance({ fixed: '2.5' });
        // Assert
        expect(name.name).toBe('Normal');
        expect(integer).toBe(10);
        expect(fixed).toBe(2.5);
        harness.document.destroy();
    });
    it('1038509 _parseAppearance writes direct and hexadecimal strings', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const direct: string = harness.jsonDocument._parseAppearance({ string: 'plain text' });
        const hexadecimal: string = harness.jsonDocument._parseAppearance({
            string: { encoding: 'hex', bytes: '414243' }
        });
        // Assert
        expect(direct).toBe('plain text');
        expect(hexadecimal).toBe('ABC');
        expect(hexadecimal).not.toBe('414243');
        harness.document.destroy();
    });
    it('1038509 _parseAppearance writes exact boolean values', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const trueValue: boolean = harness.jsonDocument._parseAppearance({ boolean: 'true' });
        const falseValue: boolean = harness.jsonDocument._parseAppearance({ boolean: 'false' });
        // Assert
        expect(trueValue).toBeTruthy();
        expect(falseValue).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseAppearance writes every array element in order', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const element: {array: object[]} = {
            array: [{ int: '1' }, { name: 'Two' }, { boolean: 'false' }]
        };
        // Act
        const result: unknown[] = harness.jsonDocument._parseAppearance(element);
        // Assert
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect((result[1] as _PdfName).name).toBe('Two');
        expect(result[2]).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseAppearance caches nonempty dictionary reference', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const originalCacheSize: number = harness.document._crossReference._cacheMap.size;
        // Act
        const reference: _PdfReference = harness.jsonDocument._parseAppearance({
            dict: { Name: { name: 'Resource' } }
        });
        // Assert
        const dictionary: _PdfDictionary =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(dictionary.get('Name').name).toBe('Resource');
        expect(harness.document._crossReference._cacheMap.size).toBe(originalCacheSize + 1);
        harness.document.destroy();
    });
    it('1038509 _parseAppearance returns empty dictionary for empty dict wrapper', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const originalCacheSize: number = harness.document._crossReference._cacheMap.size;
        // Act
        const result: _PdfDictionary = harness.jsonDocument._parseAppearance({ dict: {} });
        // Assert
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.size).toBe(0);
        expect(harness.document._crossReference._cacheMap.size).toBe(originalCacheSize);
        harness.document.destroy();
    });
    it('1038509 _parseAppearance caches stream reference', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const element: object = {
            stream: {
                Subtype: { name: 'Form' },
                data: { bytes: '4142' }
            }
        };
        // Act
        const reference: _PdfReference = harness.jsonDocument._parseAppearance(element);
        // Assert
        const stream: _PdfContentStream =
            harness.document._crossReference._cacheMap.get(reference);
        expect(reference instanceof _PdfReference).toBeTruthy();
        expect(stream.reference).toBe(reference);
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.objId)
            .toBe(reference.objectNumber + ' ' + reference.generationNumber);
        harness.document.destroy();
    });
    it('1038509 _parseAppearance decodes unicode data', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const result: string = harness.jsonDocument._parseAppearance({
            unicodeData: '00410042'
        });
        // Assert
        expect(result).toBe('\u0000A\u0000B');
        expect(result.length).toBe(4);
        harness.document.destroy();
    });
    it('1038509 _parseAppearance returns null for unsupported wrapper', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const result: unknown = harness.jsonDocument._parseAppearance({ unsupported: 'value' });
        // Assert
        expect(result).toBeNull();
        harness.document.destroy();
    });
    it('1038509 _parseDictionary writes names and skips data', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const element: object = {
            Name: { string: 'value' },
            Count: { int: '2' },
            data: { bytes: '4142' }
        };
        // Act
        const result: _PdfDictionary = harness.jsonDocument._parseDictionary(element);
        // Assert
        expect(result.get('Name')).toBe('value');
        expect(result.get('Count')).toBe(2);
        expect(result.has('data')).toBeFalsy();
        expect(result.size).toBe(2);
        harness.document.destroy();
    });
    it('1038509 _parseDictionary returns empty dictionary for absent element', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        // Act
        const result: _PdfDictionary = harness.jsonDocument._parseDictionary(null);
        // Assert
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.size).toBe(0);
        harness.document.destroy();
    });
    it('1038509 _parseStream creates stream from hexadecimal bytes', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const element: object = {
            Subtype: { name: 'Form' },
            data: { bytes: '414243' }
        };
        // Act
        const stream: _PdfContentStream = harness.jsonDocument._parseStream(element);
        // Assert
        expect(stream instanceof _PdfContentStream).toBeTruthy();
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.has('data')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseStream creates empty stream without bytes', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const element: object = {
            Subtype: { name: 'Form' },
            data: { encoding: 'hex' }
        };
        // Act
        const stream: _PdfContentStream = harness.jsonDocument._parseStream(element);
        // Assert
        expect(stream instanceof _PdfContentStream).toBeTruthy();
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.has('data')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseStream stores pending resources without cross reference', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const element: object = {
            Subtype: { name: 'Form' },
            data: { bytes: '41' }
        };
        // Act
        const stream: _PdfContentStream = jsonDocument._parseStream(element);
        // Assert
        expect(stream._pendingResources).toBe(JSON.stringify(element));
        expect(stream.dictionary.has('Subtype')).toBeFalsy();
    });
    it('1038509 _parseStreamElements loads pending resources', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const element: object = {
            data: { bytes: '41' },
            Subtype: { name: 'Form' },
            Length: { int: '1' },
            Filter: { name: 'FlateDecode' }
        };
        stream._pendingResources = JSON.stringify(element);
        // Act
        harness.jsonDocument._parseStreamElements(stream);
        // Assert
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.has('Length')).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements preserves image filter and disables compression', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream._isCompress = true;
        const element: object = {
            data: { bytes: '41' },
            Subtype: { name: 'Image' },
            Filter: { name: 'DCTDecode' },
            Length: { int: '1' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream._isCompress).toBeFalsy();
        expect(stream.dictionary.get('Subtype').name).toBe('Image');
        expect(stream.dictionary.get('Filter').name).toBe('DCTDecode');
        expect(stream.dictionary.has('Length')).toBeTruthy();
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements removes nonimage import filter', () => {
        // Arrange
        const harness = makeAppearanceHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        harness.jsonDocument._isImport = true;
        stream._isCompress = true;
        const element: object = {
            data: { bytes: '41' },
            Subtype: { name: 'Form' },
            Filter: { name: 'FlateDecode' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream._isCompress).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        harness.document.destroy();
    });
});
function makeStreamElementHarness(): {
    jsonDocument: _JsonDocument;
    document: PdfDocument;
} {
    const document: PdfDocument = new PdfDocument();
    const jsonDocument: _JsonDocument = new _JsonDocument();
    jsonDocument._document = document;
    jsonDocument._crossReference = document._crossReference;
    return { jsonDocument, document };
}
describe('1038509 JSON survived mutants lines 1748 to 1795', () => {
    it('1038509 _parseStreamElements loads pending resources only when element is undefined', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const pendingElement: object = {
            Subtype: { name: 'Form' },
            Length: { int: '1' },
            Filter: { name: 'FlateDecode' },
            data: { bytes: '41' }
        };
        stream._pendingResources = JSON.stringify(pendingElement);
        // Act
        harness.jsonDocument._parseStreamElements(stream);
        // Assert
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.has('Length')).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        expect(stream._pendingResources).toBe(JSON.stringify(pendingElement));
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements uses supplied element instead of pending resources', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const pendingElement: object = {
            Subtype: { name: 'Image' },
            Filter: { name: 'DCTDecode' },
            data: { bytes: '41' }
        };
        const suppliedElement: object = {
            Subtype: { name: 'Form' },
            Custom: { string: 'supplied' },
            data: { bytes: '42' }
        };
        stream._pendingResources = JSON.stringify(pendingElement);
        // Act
        harness.jsonDocument._parseStreamElements(stream, suppliedElement);
        // Assert
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        expect(stream.dictionary.get('Custom')).toBe('supplied');
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements leaves stream unchanged without element or pending resources', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const originalDictionary: _PdfDictionary = stream.dictionary;
        // Act
        harness.jsonDocument._parseStreamElements(stream);
        // Assert
        expect(stream.dictionary).toBe(originalDictionary);
        expect(stream.dictionary.size).toBe(0);
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements detects exact Image subtype', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream._isCompress = true;
        const element: object = {
            Subtype: { name: 'Image' },
            Filter: { name: 'DCTDecode' },
            Length: { int: '1' },
            data: { bytes: '41' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream._isCompress).toBeFalsy();
        expect(stream.dictionary.get('Subtype').name).toBe('Image');
        expect(stream.dictionary.get('Filter').name).toBe('DCTDecode');
        expect(stream.dictionary.get('Length')).toBe(1);
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements requires import and compression for nonimage branch', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        harness.jsonDocument._isImport = true;
        stream._isCompress = false;
        const element: object = {
            Subtype: { name: 'Form' },
            Filter: { name: 'FlateDecode' },
            Length: { int: '1' },
            data: { bytes: '41' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream._isCompress).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        expect(stream.dictionary.has('Length')).toBeFalsy();
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements removes nonimage import filter when compressed', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        harness.jsonDocument._isImport = true;
        stream._isCompress = true;
        const element: object = {
            Subtype: { name: 'Form' },
            Filter: { name: 'FlateDecode' },
            Length: { int: '1' },
            data: { bytes: '41' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream._isCompress).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        expect(stream.dictionary.get('Length')).toBe(1);
        expect(stream.dictionary.get('Subtype').name).toBe('Form');
        harness.document.destroy();
    });
    it('1038509 _parseStreamElements removes Length and Filter without subtype', () => {
        // Arrange
        const harness = makeStreamElementHarness();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const element: object = {
            Length: { int: '2' },
            Filter: { name: 'FlateDecode' },
            Custom: { string: 'value' },
            data: { bytes: '4142' }
        };
        // Act
        harness.jsonDocument._parseStreamElements(stream, element);
        // Assert
        expect(stream.dictionary.has('Subtype')).toBeFalsy();
        expect(stream.dictionary.has('Length')).toBeFalsy();
        expect(stream.dictionary.has('Filter')).toBeFalsy();
        expect(stream.dictionary.get('Custom')).toBe('value');
        harness.document.destroy();
    });
    it('1038509 _getValidString returns null directly', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const value: string = null;
        // Act
        const result: string = jsonDocument._getValidString(value);
        // Assert
        expect(result).toBeNull();
    });
    it('1038509 _getValidString escapes slash quote and whitespace characters', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const value: string = '\\"\n\r\t\b\f';
        // Act
        const result: string = jsonDocument._getValidString(value);
        // Assert
        expect(result).toBe('\\\\\\"\\n\\r\\t\\b\\f');
        expect(result).not.toBe(value);
    });
    it('1038509 _getValidString escapes control characters with four hexadecimal digits', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const value: string = String.fromCharCode(1) + String.fromCharCode(11) + String.fromCharCode(31) + String.fromCharCode(127);
        // Act
        const result: string = jsonDocument._getValidString(value);
        // Assert
        expect(result).toBe('\\u0001\\u000b\\u001f\\u007f');
        expect(result.length).toBe(24);
        expect(result).not.toContain(String.fromCharCode(1));
    });
    it('1038509 _getValidString preserves ordinary text', () => {
        // Arrange
        const jsonDocument: _JsonDocument = new _JsonDocument();
        const value: string = 'ordinary text 123';
        // Act
        const result: string = jsonDocument._getValidString(value);
        // Assert
        expect(result).toBe(value);
        expect(result.length).toBe(value.length);
    });
});
