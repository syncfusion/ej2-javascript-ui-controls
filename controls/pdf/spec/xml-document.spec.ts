import { _XmlDocument } from '../src/pdf/core/import-export/xml-document';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfButtonField, PdfTextBoxField } from '../src/pdf/core/form/field';
import { PdfField } from '../src/pdf/core/form/field';
import { PdfForm } from '../src/pdf/core/form/form';
import { _XmlWriter } from '../src/pdf/core/import-export/xml-writer';
describe('_XmlDocument mutation coverage test scripts', () => {
    it('constructor stores valid file name', () => {
        // Arrange
        const fileName: string = 'FormData.xml';
        // Act
        const xmlDocument: _XmlDocument = new _XmlDocument(fileName);
        // Assert
        expect(xmlDocument._fileName).toBe(fileName);
        expect(xmlDocument._fileName).not.toBe('');
        expect(xmlDocument._fileName).toBeDefined();
    });
    it('_exportFormFields sets xml export properties before save', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const expectedResult: Uint8Array = new Uint8Array([1, 2, 3]);
        let saveCallCount: number = 0;
        const originalSave: () => Uint8Array = xmlDocument._save;
        xmlDocument._save = (): Uint8Array => {
            saveCallCount++;
            return expectedResult;
        };
        // Act
        const result: Uint8Array = xmlDocument._exportFormFields(document);
        // Assert
        expect(result).toBe(expectedResult);
        expect(saveCallCount).toBe(1);
        expect(xmlDocument._document).toBe(document);
        expect(xmlDocument._crossReference).toBe(document._crossReference);
        expect(xmlDocument._isAnnotationExport).toBe(false);
        expect(xmlDocument._format).toBe('XML');
        expect(xmlDocument._format).not.toBe('');
        expect(xmlDocument._key).toBeDefined();
        xmlDocument._save = originalSave;
        document.destroy();
    });
    it('_save writes specification root element and xfdf namespace', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._asPerSpecification = true;
        // Act
        const result: Uint8Array = xmlDocument._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText.indexOf('<fields')).not.toBe(-1);
        expect(xmlText.indexOf('<Fields')).toBe(-1);
        expect(xmlText.indexOf('xmlns:xfdf')).not.toBe(-1);
        expect(xmlText.indexOf('http://ns.adobe.com/xfdf-transition/')).not.toBe(-1);
        document.destroy();
    });
    it('_save skips export when form is null', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalForm: PdfForm = document.form;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let exportCallCount: number = 0;
        xmlDocument._document = document;
        xmlDocument._exportFormFieldData = (_field: PdfField): void => {
            exportCallCount++;
        };
        (document as any)._form = null;
        // Act
        const result: Uint8Array = xmlDocument._save();
        // Assert
        expect(result).toBeDefined();
        expect(exportCallCount).toBe(0);
        (document as any)._form = originalForm;
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
    it('_save skips export when form is undefined', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalForm: PdfForm = document.form;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let exportCallCount: number = 0;
        xmlDocument._document = document;
        xmlDocument._exportFormFieldData = (_field: PdfField): void => {
            exportCallCount++;
        };
        (document as any)._form = undefined;
        // Act
        const result: Uint8Array = xmlDocument._save();
        // Assert
        expect(result).toBeDefined();
        expect(exportCallCount).toBe(0);
        (document as any)._form = originalForm;
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
    it('_save skips null field returned from form', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const buttonField: PdfButtonField = new PdfButtonField(
            page,
            'Button1',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(buttonField);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        const originalFieldAt: (index: number) => PdfField = document.form.fieldAt;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let fieldAtCallCount: number = 0;
        let exportCallCount: number = 0;
        document.form.fieldAt = (_index: number): PdfField => {
            fieldAtCallCount++;
            return null as any;
        };
        xmlDocument._exportFormFieldData = (_field: PdfField): void => {
            exportCallCount++;
        };
        // Act
        xmlDocument._save();
        // Assert
        expect(fieldAtCallCount).toBe(1);
        expect(exportCallCount).toBe(0);
        document.form.fieldAt = originalFieldAt;
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
    it('_save skips undefined field returned from form', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const buttonField: PdfButtonField = new PdfButtonField(
            page,
            'Button1',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(buttonField);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        const originalFieldAt: (index: number) => PdfField = document.form.fieldAt;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let fieldAtCallCount: number = 0;
        let exportCallCount: number = 0;
        document.form.fieldAt = (_index: number): PdfField => {
            fieldAtCallCount++;
            return undefined as any;
        };
        xmlDocument._exportFormFieldData = (_field: PdfField): void => {
            exportCallCount++;
        };
        // Act
        xmlDocument._save();
        // Assert
        expect(fieldAtCallCount).toBe(1);
        expect(exportCallCount).toBe(0);
        document.form.fieldAt = originalFieldAt;
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
    it('_save exports valid field when export is true', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const buttonField: PdfButtonField = new PdfButtonField(
            page,
            'ExportButton',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        buttonField.export = true;
        document.form.add(buttonField);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let exportCallCount: number = 0;
        let exportedField: PdfField;
        xmlDocument._exportFormFieldData = (field: PdfField): void => {
            exportCallCount++;
            exportedField = field;
        };
        // Act
        const result: Uint8Array = xmlDocument._save();
        // Assert
        expect(result).toBeDefined();
        expect(exportCallCount).toBe(1);
        expect(exportedField).toBe(buttonField);
        expect(xmlDocument._exportEmptyFields).toBe(document.form.exportEmptyFields);
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
    it('_save skips field when export is false', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const buttonField: PdfButtonField = new PdfButtonField(
            page,
            'SkipButton',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        buttonField.export = false;
        document.form.add(buttonField);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        const originalExportMethod: (field: PdfField) => void =
            xmlDocument._exportFormFieldData;
        let exportCallCount: number = 0;
        xmlDocument._exportFormFieldData = (_field: PdfField): void => {
            exportCallCount++;
        };
        // Act
        const result: Uint8Array = xmlDocument._save();
        // Assert
        expect(result).toBeDefined();
        expect(exportCallCount).toBe(0);
        xmlDocument._exportFormFieldData = originalExportMethod;
        document.destroy();
    });
});
describe('_XmlDocument write and import mutation coverage test scripts', () => {
    it('_writeFormFieldData uses standard format when isAcrobat is omitted', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const writer: _XmlWriter = new _XmlWriter();
        xmlDocument._table.clear();
        xmlDocument._table.set('First Name', 'Alice');
        writer._writeStartDocument();
        writer._writeStartElement('Fields');
        // Act
        xmlDocument._writeFormFieldData(writer);
        const result: Uint8Array = writer._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText.indexOf('<Fields>')).not.toBe(-1);
        expect(xmlText.indexOf('<First_x0020_Name>')).not.toBe(-1);
        expect(xmlText.indexOf('Alice')).not.toBe(-1);
        expect(xmlText.indexOf('</First_x0020_Name>')).not.toBe(-1);
        expect(xmlText.indexOf('xfdf:original')).toBe(-1);
        expect(xmlText.indexOf('</Fields>')).not.toBe(-1);
        writer._destroy();
    });
    it('_writeFormFieldData writes original name and xfdf prefix in Acrobat format', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const writer: _XmlWriter = new _XmlWriter();
        xmlDocument._table.clear();
        xmlDocument._table.set('First Name', 'Alice');
        writer._writeStartDocument();
        writer._writeStartElement('fields');
        writer._writeAttributeString(
            'xfdf',
            'http://ns.adobe.com/xfdf-transition/',
            'xmlns',
            null
        );
        // Act
        xmlDocument._writeFormFieldData(writer, true);
        const result: Uint8Array = writer._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText.indexOf('<FirstName')).not.toBe(-1);
        expect(xmlText.indexOf('<First Name')).toBe(-1);
        expect(xmlText.indexOf('xfdf:original="First Name"')).not.toBe(-1);
        expect(xmlText.indexOf(' original="First Name"')).toBe(-1);
        expect(xmlText.indexOf('Alice')).not.toBe(-1);
        expect(xmlText.indexOf('</FirstName>')).not.toBe(-1);
        writer._destroy();
    });
    it('_writeFormFieldData does not write original attribute for Acrobat key without spaces', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const writer: _XmlWriter = new _XmlWriter();
        xmlDocument._table.clear();
        xmlDocument._table.set('FirstName', 'Alice');
        writer._writeStartDocument();
        writer._writeStartElement('fields');
        writer._writeAttributeString(
            'xfdf',
            'http://ns.adobe.com/xfdf-transition/',
            'xmlns',
            null
        );
        // Act
        xmlDocument._writeFormFieldData(writer, true);
        const result: Uint8Array = writer._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText.indexOf('<FirstName>')).not.toBe(-1);
        expect(xmlText.indexOf('Alice')).not.toBe(-1);
        expect(xmlText.indexOf('</FirstName>')).not.toBe(-1);
        expect(xmlText.indexOf('xfdf:original')).toBe(-1);
        expect(xmlText.indexOf(' original=')).toBe(-1);
        writer._destroy();
    });
    it('_parseFormData skips empty child collection and calls import field', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(root.childNodes.length).toBe(0);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData reads element tag name when attributes are empty', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><CustomerName>Alice</CustomerName></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(xmlDocument._table.size).toBe(1);
        expect(xmlDocument._table.has('CustomerName')).toBe(true);
        expect(xmlDocument._table.get('CustomerName')).toBe('Alice');
        expect(xmlDocument._table.has('Stryker was here!')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData ignores text and comment child nodes', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields>TextValue<!--CommentValue--><Name>Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(root.childNodes.length).toBe(3);
        expect(root.childNodes.item(0).nodeType).not.toBe(1);
        expect(root.childNodes.item(1).nodeType).not.toBe(1);
        expect(root.childNodes.item(2).nodeType).toBe(1);
        expect(xmlDocument._table.size).toBe(1);
        expect(xmlDocument._table.get('Name')).toBe('Alice');
        expect(xmlDocument._table.has('TextValue')).toBe(false);
        expect(xmlDocument._table.has('CommentValue')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData skips null child node returned by item', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name>Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const childNodes: NodeListOf<ChildNode> = root.childNodes;
        const originalItem: (index: number) => ChildNode = childNodes.item;
        const originalImportField: () => void = xmlDocument._importField;
        let itemCallCount: number = 0;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        (childNodes as any).item = (_index: number): ChildNode => {
            itemCallCount++;
            return null as any;
        };
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(itemCallCount).toBe(1);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        (childNodes as any).item = originalItem;
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData skips undefined child node returned by item', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name>Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const childNodes: NodeListOf<ChildNode> = root.childNodes;
        const originalItem: (index: number) => ChildNode = childNodes.item;
        const originalImportField: () => void = xmlDocument._importField;
        let itemCallCount: number = 0;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        (childNodes as any).item = (_index: number): ChildNode => {
            itemCallCount++;
            return undefined as any;
        };
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(itemCallCount).toBe(1);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        (childNodes as any).item = originalItem;
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData reads xfdf original attribute value', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">' +
            '<FirstName xfdf:original="First Name">Alice</FirstName>' +
            '</fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(xmlDocument._table.size).toBe(1);
        expect(xmlDocument._table.has('First Name')).toBe(true);
        expect(xmlDocument._table.get('First Name')).toBe('Alice');
        expect(xmlDocument._table.has('FirstName')).toBe(false);
        expect(xmlDocument._table.has('Stryker was here!')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData does not import element when first attribute is not xfdf original', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name title="Customer">Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(xmlDocument._table.size).toBe(0);
        expect(xmlDocument._table.has('Name')).toBe(false);
        expect(xmlDocument._table.has('Customer')).toBe(false);
        expect(xmlDocument._table.has('Stryker was here!')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData skips null attribute returned by item', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name title="Customer">Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const element: Element = root.childNodes.item(0) as Element;
        const attributes: NamedNodeMap = element.attributes;
        const originalItem: (index: number) => Attr = attributes.item;
        const originalImportField: () => void = xmlDocument._importField;
        let attributeCallCount: number = 0;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        (attributes as any).item = (_index: number): Attr => {
            attributeCallCount++;
            return null as any;
        };
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(attributeCallCount).toBe(1);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        (attributes as any).item = originalItem;
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData skips undefined attribute returned by item', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name title="Customer">Alice</Name></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const element: Element = root.childNodes.item(0) as Element;
        const attributes: NamedNodeMap = element.attributes;
        const originalItem: (index: number) => Attr = attributes.item;
        const originalImportField: () => void = xmlDocument._importField;
        let attributeCallCount: number = 0;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        (attributes as any).item = (_index: number): Attr => {
            attributeCallCount++;
            return undefined as any;
        };
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        expect(() => {
            xmlDocument._parseFormData(root);
        }).not.toThrow();
        // Assert
        expect(attributeCallCount).toBe(1);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        (attributes as any).item = originalItem;
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData skips xfdf original attribute with empty value', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">' +
            '<Name xfdf:original="">Alice</Name>' +
            '</fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(xmlDocument._table.size).toBe(0);
        expect(xmlDocument._table.has('')).toBe(false);
        expect(xmlDocument._table.has('Name')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    describe('_XmlDocument parse form data mutation coverage test scripts', () => {
        it('_parseFormData skips empty child collection', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<Fields></Fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(root.childNodes).toBeDefined();
            expect(root.childNodes.length).toBe(0);
            expect(xmlDocument._table.size).toBe(0);
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
        it('_parseFormData skips child collection containing only a text node', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<Fields>Plain text</Fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(root.childNodes).toBeDefined();
            expect(root.childNodes.length).toBe(1);
            expect(root.childNodes.item(0)).toBeDefined();
            expect(root.childNodes.item(0).nodeType).toBe(3);
            expect(xmlDocument._table.size).toBe(0);
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
        it('_parseFormData uses tag name when element has empty attributes collection', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<Fields><Name>Alice</Name></Fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const element: Element = root.childNodes.item(0) as Element;
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(element.attributes).toBeDefined();
            expect(element.attributes.length).toBe(0);
            expect(xmlDocument._table.size).toBe(1);
            expect(xmlDocument._table.has('Name')).toBe(true);
            expect(xmlDocument._table.get('Name')).toBe('Alice');
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
        it('_parseFormData skips element when first attribute is not xfdf original', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<Fields><Name title="Customer Name">Alice</Name></Fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const element: Element = root.childNodes.item(0) as Element;
            const attribute: Attr = element.attributes.item(0);
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(element.attributes).toBeDefined();
            expect(element.attributes.length).toBe(1);
            expect(attribute).toBeDefined();
            expect(attribute.name).toBe('title');
            expect(attribute.name).not.toBe('xfdf:original');
            expect(xmlDocument._table.size).toBe(0);
            expect(xmlDocument._table.has('Name')).toBe(false);
            expect(xmlDocument._table.has('Customer Name')).toBe(false);
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
        it('_parseFormData skips xfdf original attribute with empty value', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">' +
                '<Name xfdf:original="">Alice</Name>' +
                '</fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const element: Element = root.childNodes.item(0) as Element;
            const attribute: Attr = element.attributes.item(0);
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(attribute).toBeDefined();
            expect(attribute.name).toBe('xfdf:original');
            expect(attribute.value).toBe('');
            expect(xmlDocument._table.size).toBe(0);
            expect(xmlDocument._table.has('')).toBe(false);
            expect(xmlDocument._table.has('Name')).toBe(false);
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
        it('_parseFormData imports non-empty xfdf original attribute value', () => {
            // Arrange
            const xmlDocument: _XmlDocument = new _XmlDocument();
            const parsedDocument: Document = new DOMParser().parseFromString(
                '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">' +
                '<Name xfdf:original="Customer Name">Alice</Name>' +
                '</fields>',
                'text/xml'
            );
            const root: HTMLElement =
                parsedDocument.documentElement as unknown as HTMLElement;
            const element: Element = root.childNodes.item(0) as Element;
            const attribute: Attr = element.attributes.item(0);
            const originalImportField: () => void = xmlDocument._importField;
            let importCallCount: number = 0;
            xmlDocument._table.clear();
            xmlDocument._importField = (): void => {
                importCallCount++;
            };
            // Act
            xmlDocument._parseFormData(root);
            // Assert
            expect(attribute).toBeDefined();
            expect(attribute.name).toBe('xfdf:original');
            expect(attribute.value).toBe('Customer Name');
            expect(attribute.value.length).toBeGreaterThan(0);
            expect(xmlDocument._table.size).toBe(1);
            expect(xmlDocument._table.has('Customer Name')).toBe(true);
            expect(xmlDocument._table.get('Customer Name')).toBe('Alice');
            expect(xmlDocument._table.has('Name')).toBe(false);
            expect(importCallCount).toBe(1);
            xmlDocument._importField = originalImportField;
        });
    });
});
describe('1038509 _XmlDocument _importField mutation coverage', () => {
    it('1038509 _importField skips processing when form count is zero', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let importCallCount: number = 0;
        xmlDocument._table.set('Field1', 'Value1');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 0,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => null
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
    });
    it('1038509 _importField imports value and updates RV for valid field', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        const dictionary: any = {
            update: (key: string, value: string): void => {
                dictionary[key] = value;
            }
        };
        const field: any = {
            _dictionary: dictionary
        };
        let receivedField: PdfField;
        let receivedParameters: string[];
        xmlDocument._table.set('CustomerName', 'John');
        xmlDocument._importFieldData = (currentField: PdfField, parameters: string[]): void => {
            receivedField = currentField;
            receivedParameters = parameters;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (name: string): number => {
                    expect(name).toBe('CustomerName');
                    return 0;
                },
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(dictionary.RV).toBe('John');
        expect(receivedField).toBe(field);
        expect(receivedParameters.length).toBe(1);
        expect(receivedParameters[0]).toBe('John');
    });
    it('1038509 _importField resolves _x0020_ field names before lookup', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        const field: any = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    // no implementation required
                }
            }
        };
        let resolvedName: string = '';
        xmlDocument._table.set('Test_x0020_Field', 'Value');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            // no implementation required
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (name: string): number => {
                    resolvedName = name;
                    return 0;
                },
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(resolvedName).toBe('Test Field');
        expect(resolvedName.indexOf('_x0020_')).toBe(-1);
    });
    it('1038509 _importField does not update RV when value is empty string', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let updateCallCount: number = 0;
        const field: any = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    updateCallCount++;
                }
            }
        };
        let importCallCount: number = 0;
        xmlDocument._table.set('EmptyValueField', '');
        xmlDocument._importFieldData = (_field: PdfField, param: string[]): void => {
            importCallCount++;
            expect(param[0]).toBe('');
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(updateCallCount).toBe(0);
        expect(importCallCount).toBe(1);
    });
    it('1038509 _importField updates RV for whitespace value and preserves content', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let rvValue: string;
        const field: any = {
            _dictionary: {
                update: (_key: string, value: string): void => {
                    rvValue = value;
                }
            }
        };
        xmlDocument._table.set('WhitespaceField', ' ');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            // no implementation required
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(rvValue).toBe(' ');
    });
    it('1038509 _importField updates RV for Stryker string value', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let rvValue: string;
        const field: any = {
            _dictionary: {
                update: (_key: string, value: string): void => {
                    rvValue = value;
                }
            }
        };
        xmlDocument._table.set('MutationField', 'Stryker was here!');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            // no implementation required
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(rvValue).toBe('Stryker was here!');
    });
    it('1038509 _importField skips when field index is negative', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let importCallCount: number = 0;
        xmlDocument._table.set('UnknownField', 'Value');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => -1,
                fieldAt: (_index: number): any => null
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
    });
    it('1038509 _importField skips when index equals count boundary', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let fieldAtCallCount: number = 0;
        xmlDocument._table.set('BoundaryField', 'Value');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            fail('import should not occur');
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 1,
                fieldAt: (_index: number): any => {
                    fieldAtCallCount++;
                    return null;
                }
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(fieldAtCallCount).toBe(0);
    });
    it('1038509 _importField skips when field is undefined', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let importCallCount: number = 0;
        xmlDocument._table.set('UndefinedField', 'Value');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => undefined
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
    });
    it('1038509 _importField processes table value through has and get path', () => {
        // Arrange
        const xmlDocument: any = new _XmlDocument();
        let rvValue: string;
        const field: any = {
            _dictionary: {
                update: (_key: string, value: string): void => {
                    rvValue = value;
                }
            }
        };
        xmlDocument._table.set('LookupField', 'LookupValue');
        xmlDocument._importFieldData = (_field: PdfField, _param: string[]): void => {
            // no implementation required
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): any => field
            }
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(rvValue).toBe('LookupValue');
    });
});
describe('_XmlDocument remaining mutation coverage test scripts', () => {
    it('constructor does not assign file name when file name is undefined', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument(undefined);
        // Act
        const fileName: string = xmlDocument._fileName;
        // Assert
        expect(fileName).toBe('');
    });
    it('constructor does not assign file name when file name is null', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument(null as unknown as string);
        // Act
        const fileName: string = xmlDocument._fileName;
        // Assert
        expect(fileName).toBe('');
    });
    it('_save writes only standard Fields root when specification mode is false', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._asPerSpecification = false;
        // Act
        const result: Uint8Array = xmlDocument._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText).toContain('<Fields');
        expect(xmlText).not.toContain('<fields');
        expect(xmlText).not.toContain('xmlns:xfdf');
        expect(xmlText).not.toContain('http://ns.adobe.com/xfdf-transition/');
        expect(xmlText).toMatch(/<Fields\s*\/>|<Fields><\/Fields>/);
        document.destroy();
    });
    it('_save writes only specification fields root when specification mode is true', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._asPerSpecification = true;
        // Act
        const result: Uint8Array = xmlDocument._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText).toContain('<fields');
        expect(xmlText).toContain('xmlns:xfdf');
        expect(xmlText).toContain('http://ns.adobe.com/xfdf-transition/');
        expect(xmlText).not.toContain('<Fields');
        expect(xmlText).toMatch(/<fields[^>]*\/>|<fields[^>]*><\/fields>/);
        document.destroy();
    });
    it('_writeFormFieldData defaults undefined Acrobat argument to standard format', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const writer: _XmlWriter = new _XmlWriter();
        xmlDocument._table.clear();
        xmlDocument._table.set('Customer Name', 'Alice');
        writer._writeStartDocument();
        writer._writeStartElement('Fields');
        // Act
        xmlDocument._writeFormFieldData(writer, undefined);
        const result: Uint8Array = writer._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText).toContain('<Customer_x0020_Name>');
        expect(xmlText).toContain('</Customer_x0020_Name>');
        expect(xmlText).not.toContain('<CustomerName');
        expect(xmlText).not.toContain('xfdf:original');
        writer._destroy();
    });
    it('_writeFormFieldData preserves standard key without spaces', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const writer: _XmlWriter = new _XmlWriter();
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        writer._writeStartDocument();
        writer._writeStartElement('Fields');
        // Act
        xmlDocument._writeFormFieldData(writer, false);
        const result: Uint8Array = writer._save();
        let xmlText: string = '';
        for (let i: number = 0; i < result.length; i++) {
            xmlText += String.fromCharCode(result[i]);
        }
        // Assert
        expect(xmlText).toContain('<CustomerName>');
        expect(xmlText).toContain('</CustomerName>');
        expect(xmlText).not.toContain('Customer_x0020_Name');
        expect(xmlText).not.toContain('xfdf:original');
        writer._destroy();
    });
    it('_importFormData sets import state before parsing and resets it after parsing', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalParseFormData: (root: HTMLElement) => void =
            xmlDocument._parseFormData;
        let importStateDuringParsing: boolean;
        let parsedRootName: string = '';
        xmlDocument._parseFormData = (root: HTMLElement): void => {
            importStateDuringParsing = xmlDocument._xmlImport;
            parsedRootName = root.tagName;
        };
        const xmlText: string = '<Fields></Fields>';
        const data: Uint8Array = new Uint8Array(xmlText.length);
        for (let i: number = 0; i < xmlText.length; i++) {
            data[i] = xmlText.charCodeAt(i);
        }
        // Act
        xmlDocument._importFormData(document, data);
        // Assert
        expect(xmlDocument._document).toBe(document);
        expect(xmlDocument._crossReference).toBe(document._crossReference);
        expect(xmlDocument._isAnnotationExport).toBe(false);
        expect(importStateDuringParsing).toBe(true);
        expect(parsedRootName).toBe('Fields');
        expect(xmlDocument._xmlImport).toBe(false);
        xmlDocument._parseFormData = originalParseFormData;
        document.destroy();
    });
    it('_importFormData removes carriage return and line feed characters', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalCheckXml: (xmlDocument: Document) => void =
            xmlDocument._checkXml;
        const originalParseFormData: (root: HTMLElement) => void =
            xmlDocument._parseFormData;
        let parsedValue: string = '';
        xmlDocument._checkXml = (_parsedDocument: Document): void => {
            // No implementation required.
        };
        xmlDocument._parseFormData = (root: HTMLElement): void => {
            parsedValue = root.textContent;
        };
        const xmlText: string =
            '<Fields>\r\n<Name>Ali\nce</Name>\r<Value>One</Value></Fields>';
        const data: Uint8Array = new Uint8Array(xmlText.length);
        for (let i: number = 0; i < xmlText.length; i++) {
            data[i] = xmlText.charCodeAt(i);
        }
        // Act
        xmlDocument._importFormData(document, data);
        // Assert
        expect(parsedValue).toBe('AliceOne');
        expect(parsedValue).not.toContain('\r');
        expect(parsedValue).not.toContain('\n');
        expect(parsedValue).not.toContain('Stryker was here!');
        xmlDocument._checkXml = originalCheckXml;
        xmlDocument._parseFormData = originalParseFormData;
        document.destroy();
    });
    it('_importFormData removes non ASCII characters without replacement text', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalCheckXml: (xmlDocument: Document) => void =
            xmlDocument._checkXml;
        const originalParseFormData: (root: HTMLElement) => void =
            xmlDocument._parseFormData;
        let parsedValue: string = '';
        xmlDocument._checkXml = (_parsedDocument: Document): void => {
            // No implementation required.
        };
        xmlDocument._parseFormData = (root: HTMLElement): void => {
            parsedValue = root.textContent;
        };
        const xmlText: string = '<Fields><Name>A\u0001lice\u0080</Name></Fields>';
        const data: Uint8Array = new Uint8Array(xmlText.length);
        for (let i: number = 0; i < xmlText.length; i++) {
            data[i] = xmlText.charCodeAt(i);
        }
        // Act
        xmlDocument._importFormData(document, data);
        // Assert
        expect(parsedValue).toBe('Alice');
        expect(parsedValue).not.toContain('\u0001');
        expect(parsedValue).not.toContain('\u0080');
        expect(parsedValue).not.toContain('Stryker was here!');
        xmlDocument._checkXml = originalCheckXml;
        xmlDocument._parseFormData = originalParseFormData;
        document.destroy();
    });
    it('_parseFormData does not inspect an empty child collection', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(root.childNodes.length).toBe(0);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData ignores a non element child without accessing element members', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields>Plain text</Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(root.childNodes.length).toBe(1);
        expect(root.childNodes.item(0).nodeType).toBe(3);
        expect(xmlDocument._table.size).toBe(0);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData uses the element tag when there are no attributes', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><CustomerName>Alice</CustomerName></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const element: Element = root.childNodes.item(0) as Element;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(element.attributes.length).toBe(0);
        expect(xmlDocument._table.size).toBe(1);
        expect(xmlDocument._table.has('CustomerName')).toBe(true);
        expect(xmlDocument._table.get('CustomerName')).toBe('Alice');
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData rejects an attributed element without xfdf original', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><CustomerName title="Customer">Alice</CustomerName></Fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const element: Element = root.childNodes.item(0) as Element;
        const attribute: Attr = element.attributes.item(0);
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(attribute.name).toBe('title');
        expect(attribute.name).not.toBe('xfdf:original');
        expect(xmlDocument._table.size).toBe(0);
        expect(xmlDocument._table.has('CustomerName')).toBe(false);
        expect(xmlDocument._table.has('Customer')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_parseFormData does not store an empty xfdf original name', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">' +
            '<CustomerName xfdf:original="">Alice</CustomerName>' +
            '</fields>',
            'text/xml'
        );
        const root: HTMLElement =
            parsedDocument.documentElement as unknown as HTMLElement;
        const originalImportField: () => void = xmlDocument._importField;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._importField = (): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._parseFormData(root);
        // Assert
        expect(xmlDocument._table.size).toBe(0);
        expect(xmlDocument._table.has('')).toBe(false);
        expect(xmlDocument._table.has('CustomerName')).toBe(false);
        expect(importCallCount).toBe(1);
        xmlDocument._importField = originalImportField;
    });
    it('_importField does not enumerate table entries when form count is zero', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const originalForEach: (
            callbackfn: (value: string, key: string, map: Map<string, string>) => void
        ) => void = xmlDocument._table.forEach;
        let tableIterationCount: number = 0;
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._table.forEach = (
            _callbackfn: (
                value: string,
                key: string,
                map: Map<string, string>
            ) => void
        ): void => {
            tableIterationCount++;
        };
        xmlDocument._document = {
            form: {
                count: 0
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(tableIterationCount).toBe(0);
        xmlDocument._table.forEach = originalForEach;
    });
    it('_importField skips minus one index without requesting a field', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let fieldAtCallCount: number = 0;
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._table.set('UnknownField', 'Value');
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => -1,
                fieldAt: (_index: number): PdfField => {
                    fieldAtCallCount++;
                    return null as unknown as PdfField;
                }
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(fieldAtCallCount).toBe(0);
        expect(importCallCount).toBe(0);
    });
    it('_importField looks up an unencoded field name without changing it', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let requestedFieldName: string = '';
        let importCallCount: number = 0;
        const field: PdfField = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    // No implementation required.
                }
            }
        } as unknown as PdfField;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (name: string): number => {
                    requestedFieldName = name;
                    return 0;
                },
                fieldAt: (_index: number): PdfField => field
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(requestedFieldName).toBe('CustomerName');
        expect(requestedFieldName).not.toBe('');
        expect(requestedFieldName).not.toContain('_x0020_');
        expect(importCallCount).toBe(1);
    });
    it('_importField decodes every encoded space before field lookup', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let requestedFieldName: string = '';
        const field: PdfField = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    // No implementation required.
                }
            }
        } as unknown as PdfField;
        xmlDocument._table.clear();
        xmlDocument._table.set(
            'Customer_x0020_First_x0020_Name',
            'Alice'
        );
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            // No implementation required.
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (name: string): number => {
                    requestedFieldName = name;
                    return 0;
                },
                fieldAt: (_index: number): PdfField => field
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(requestedFieldName).toBe('Customer First Name');
        expect(requestedFieldName).not.toContain('_x0020_');
    });
    it('_importField processes field index zero', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let fieldAtIndex: number = -1;
        let importCallCount: number = 0;
        const field: PdfField = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    // No implementation required.
                }
            }
        } as unknown as PdfField;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._importFieldData = (
            importedField: PdfField,
            parameters: string[]
        ): void => {
            importCallCount++;
            expect(importedField).toBe(field);
            expect(parameters.length).toBe(1);
            expect(parameters[0]).toBe('Alice');
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (index: number): PdfField => {
                    fieldAtIndex = index;
                    return field;
                }
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(fieldAtIndex).toBe(0);
        expect(importCallCount).toBe(1);
    });
    it('_importField skips a null field', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): PdfField =>
                    null as unknown as PdfField
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
    });
    it('_importField skips an undefined field', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let importCallCount: number = 0;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            importCallCount++;
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): PdfField =>
                    undefined as unknown as PdfField
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
    });
    it('_importField does not update RV for an empty value', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let updateCallCount: number = 0;
        let importCallCount: number = 0;
        const field: PdfField = {
            _dictionary: {
                update: (_key: string, _value: string): void => {
                    updateCallCount++;
                }
            }
        } as unknown as PdfField;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', '');
        xmlDocument._importFieldData = (
            importedField: PdfField,
            parameters: string[]
        ): void => {
            importCallCount++;
            expect(importedField).toBe(field);
            expect(parameters.length).toBe(1);
            expect(parameters[0]).toBe('');
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): PdfField => field
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(updateCallCount).toBe(0);
        expect(importCallCount).toBe(1);
    });
    it('_importField updates RV once for a non-empty value', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        let updateCallCount: number = 0;
        let updatedKey: string = '';
        let updatedValue: string = '';
        const field: PdfField = {
            _dictionary: {
                update: (key: string, value: string): void => {
                    updateCallCount++;
                    updatedKey = key;
                    updatedValue = value;
                }
            }
        } as unknown as PdfField;
        xmlDocument._table.clear();
        xmlDocument._table.set('CustomerName', 'Alice');
        xmlDocument._importFieldData = (
            _field: PdfField,
            _parameters: string[]
        ): void => {
            // No implementation required.
        };
        xmlDocument._document = {
            form: {
                count: 1,
                _getFieldIndex: (_name: string): number => 0,
                fieldAt: (_index: number): PdfField => field
            }
        } as unknown as PdfDocument;
        // Act
        xmlDocument._importField();
        // Assert
        expect(updateCallCount).toBe(1);
        expect(updatedKey).toBe('RV');
        expect(updatedValue).toBe('Alice');
    });
    it('_checkXml does not throw when parser error is absent', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name>Alice</Name></Fields>',
            'text/xml'
        );
        // Act
        xmlDocument._checkXml(parsedDocument);
        // Assert
        expect(
            parsedDocument.getElementsByTagName('parsererror').length
        ).toBe(0);
    });
    it('_checkXml throws exact error when parser error is present', () => {
        // Arrange
        const xmlDocument: _XmlDocument = new _XmlDocument();
        const parsedDocument: Document = new DOMParser().parseFromString(
            '<Fields><Name></Fields>',
            'text/xml'
        );
        // Act
        const operation: () => void = (): void => {
            xmlDocument._checkXml(parsedDocument);
        };
        // Assert
        expect(
            parsedDocument.getElementsByTagName('parsererror').length
        ).toBeGreaterThan(0);
        expect(operation).toThrowError(Error, 'Invalid XML file.');
    });
});
describe('XmlDocument _importField mutation coverage', () => {
    it('_importField checks the current table key before retrieving its value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('CustomerName', 'Nisha');
        const fieldTable: Map<string, string> = xmlDocument._table;
        const originalHas: (key: string) => boolean = fieldTable.has;
        const originalImportFieldData:
        (fieldValue: PdfField, values: string[]) => void =
            xmlDocument._importFieldData;
        let hasCallCount: number = 0;
        let checkedKey: string = '';
        let importCallCount: number = 0;
        fieldTable.has = (key: string): boolean => {
            hasCallCount++;
            checkedKey = key;
            return originalHas.call(fieldTable, key);
        };
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: string[]
        ): void => {
            importCallCount++;
            expect(fieldValue).toBe(field);
            expect(values.length).toBe(1);
            expect(values[0]).toBe('Nisha');
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(hasCallCount).toBe(1);
        expect(checkedKey).toBe('CustomerName');
        expect(importCallCount).toBe(1);
        expect(field._dictionary.has('RV')).toBe(true);
        expect(field._dictionary.get('RV')).toBe('Nisha');
        fieldTable.has = originalHas;
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('_importField replaces encoded space when the marker starts at index one', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'A B',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('A_x0020_B', 'Encoded space value');
        const originalImportFieldData:
        (fieldValue: PdfField, values: string[]) => void =
            xmlDocument._importFieldData;
        let importedField: PdfField;
        let importedValue: string = '';
        let importCallCount: number = 0;
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: string[]
        ): void => {
            importCallCount++;
            importedField = fieldValue;
            importedValue = values[0];
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(1);
        expect(importedField).toBe(field);
        expect(importedValue).toBe('Encoded space value');
        expect(field._dictionary.has('RV')).toBe(true);
        expect(field._dictionary.get('RV')).toBe('Encoded space value');
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('_importField skips an empty field value returned by fieldAt', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('CustomerName', 'Nisha');
        const originalFieldAt:
        (index: number) => PdfField =
            document.form.fieldAt;
        const originalImportFieldData:
        (fieldValue: PdfField, values: string[]) => void =
            xmlDocument._importFieldData;
        let importCallCount: number = 0;
        document.form.fieldAt = (_index: number): PdfField => {
            return '' as unknown as PdfField;
        };
        xmlDocument._importFieldData = (
            _fieldValue: PdfField,
            _values: string[]
        ): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(0);
        document.form.fieldAt = originalFieldAt;
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('_importField does not update RV when the table value is null', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set(
            'CustomerName',
            null as unknown as string
        );
        const originalImportFieldData:
        (fieldValue: PdfField, values: string[]) => void =
            xmlDocument._importFieldData;
        let importedField: PdfField;
        let importedValue: string;
        let importCallCount: number = 0;
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: string[]
        ): void => {
            importCallCount++;
            importedField = fieldValue;
            importedValue = values[0];
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(field._dictionary.has('RV')).toBe(false);
        expect(importCallCount).toBe(1);
        expect(importedField).toBe(field);
        expect(importedValue).toBeNull();
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
});
describe('XmlDocument _importField mutation coverage', () => {
    it('1. _importField evaluates table has when table contains the current key', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('CustomerName', 'Nisha');
        const fieldTable: Map<any, any> = xmlDocument._table;
        const originalHas: (key: any) => boolean = fieldTable.has;
        const originalImportFieldData:
        (fieldValue: PdfField, values: Array<string>) => void =
            xmlDocument._importFieldData;
        let hasCallCount: number = 0;
        let checkedKey: string = '';
        let importCallCount: number = 0;
        fieldTable.has = (key: any): boolean => {
            hasCallCount++;
            checkedKey = key.toString();
            return originalHas.call(fieldTable, key);
        };
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: Array<string>
        ): void => {
            importCallCount++;
            expect(fieldValue).toBe(field);
            expect(values.length).toBe(1);
            expect(values[0]).toBe('Nisha');
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(hasCallCount).toBe(1);
        expect(checkedKey).toBe('CustomerName');
        expect(importCallCount).toBe(1);
        expect(field._dictionary.has('RV')).toBe(true);
        expect(field._dictionary.get('RV')).toBe('Nisha');
        fieldTable.has = originalHas;
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('2. _importField replaces encoded space when marker starts at index one', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'A B',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('A_x0020_B', 'Encoded space value');
        const originalImportFieldData:
        (fieldValue: PdfField, values: Array<string>) => void =
            xmlDocument._importFieldData;
        let importedField: PdfField;
        let importedValue: string = '';
        let importCallCount: number = 0;
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: Array<string>
        ): void => {
            importCallCount++;
            importedField = fieldValue;
            importedValue = values[0];
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(importCallCount).toBe(1);
        expect(importedField).toBe(field);
        expect(importedValue).toBe('Encoded space value');
        expect(field._dictionary.has('RV')).toBe(true);
        expect(field._dictionary.get('RV')).toBe('Encoded space value');
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('3. _importField skips empty string returned from fieldAt', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('CustomerName', 'Nisha');
        const originalFieldAt:
        (index: number) => PdfField =
            document.form.fieldAt;
        const originalImportFieldData:
        (fieldValue: PdfField, values: Array<string>) => void =
            xmlDocument._importFieldData;
        let fieldAtCallCount: number = 0;
        let importCallCount: number = 0;
        document.form.fieldAt = (_index: number): PdfField => {
            fieldAtCallCount++;
            return '' as any;
        };
        xmlDocument._importFieldData = (
            _fieldValue: PdfField,
            _values: Array<string>
        ): void => {
            importCallCount++;
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(fieldAtCallCount).toBe(1);
        expect(importCallCount).toBe(0);
        document.form.fieldAt = originalFieldAt;
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
    it('4. _importField does not update RV when table value is null', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            { x: 10, y: 10, width: 100, height: 20 }
        );
        document.form.add(field);
        const xmlDocument: _XmlDocument = new _XmlDocument();
        xmlDocument._document = document;
        xmlDocument._table.set('CustomerName', null as any);
        const originalImportFieldData:
        (fieldValue: PdfField, values: Array<string>) => void =
            xmlDocument._importFieldData;
        let importedField: PdfField;
        let importedValue: string;
        let importCallCount: number = 0;
        xmlDocument._importFieldData = (
            fieldValue: PdfField,
            values: Array<string>
        ): void => {
            importCallCount++;
            importedField = fieldValue;
            importedValue = values[0];
        };
        // Act
        xmlDocument._importField();
        // Assert
        expect(field._dictionary.has('RV')).toBe(false);
        expect(importCallCount).toBe(1);
        expect(importedField).toBe(field);
        expect(importedValue).toBeNull();
        xmlDocument._importFieldData = originalImportFieldData;
        document.destroy();
    });
});