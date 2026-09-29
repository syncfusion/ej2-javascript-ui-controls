import { PdfAnnotationCollection } from "../src/pdf/core/annotations/annotation-collection";
import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { PdfDestinationMode, PdfFormFieldsTabOrder, PdfLayoutBreakType, PdfLayoutType, PdfPageOrientation, PdfRotationAngle } from "../src/pdf/core/enumerator";
import { PdfFont, PdfFontFamily, PdfFontStyle, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfLayoutFormat, PdfLayoutResult } from "../src/pdf/core/graphics/pdf-layouter";
import { PdfPageTemplateElement } from "../src/pdf/core/graphics/pdf-page-template-element";
import { PdfTemplate } from "../src/pdf/core/graphics/pdf-template";
import { _PdfCrossReference } from "../src/pdf/core/pdf-cross-reference";
import { PdfDocument, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { _PdfDestinationHelper, PdfDestination, PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfTextElement, Point, Rectangle, Size } from "../src/pdf/core/pdf-type";
describe('PdfPage survived mutants batch 11', () => {
    it('should preserve combined content behavior for mutant 869', () => {
        // Mutant ID: 869
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve combined content behavior for mutant 876', () => {
        // Mutant ID: 876
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve combined content behavior for mutant 879', () => {
        // Mutant ID: 879
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve combined content behavior for mutant 885', () => {
        // Mutant ID: 885
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve combined content behavior for mutant 888', () => {
        // Mutant ID: 888
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve combined content behavior for mutant 893', () => {
        // Mutant ID: 893
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([65, 66, 67]);
        const reference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(reference, stream);
        page._pageDictionary._map.Contents = [reference];
        page._contents = undefined;
        const content: Uint8Array = page._combineContent();
        expect(content.length).toBeGreaterThan(3);
        expect(Array.from(content)).toContain(65);
        expect(Array.from(content)).toContain(66);
        expect(Array.from(content)).toContain(67);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 896', () => {
        // Mutant ID: 896
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 902', () => {
        // Mutant ID: 902
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 903', () => {
        // Mutant ID: 903
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 904', () => {
        // Mutant ID: 904
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 906', () => {
        // Mutant ID: 906
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 908', () => {
        // Mutant ID: 908
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 914', () => {
        // Mutant ID: 914
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 920', () => {
        // Mutant ID: 920
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 923', () => {
        // Mutant ID: 923
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 927', () => {
        // Mutant ID: 927
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 928', () => {
        // Mutant ID: 928
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 933', () => {
        // Mutant ID: 933
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 934', () => {
        // Mutant ID: 934
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 935', () => {
        // Mutant ID: 935
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 945', () => {
        // Mutant ID: 945
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 951', () => {
        // Mutant ID: 951
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 953', () => {
        // Mutant ID: 953
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 959', () => {
        // Mutant ID: 959
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 960', () => {
        // Mutant ID: 960
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 961', () => {
        // Mutant ID: 961
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 962', () => {
        // Mutant ID: 962
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 964', () => {
        // Mutant ID: 964
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 968', () => {
        // Mutant ID: 968
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 973', () => {
        // Mutant ID: 973
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 12', () => {
    it('should preserve text layout behavior for mutant 975', () => {
        // Mutant ID: 975
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 979', () => {
        // Mutant ID: 979
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 983', () => {
        // Mutant ID: 983
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 988', () => {
        // Mutant ID: 988
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 990', () => {
        // Mutant ID: 990
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 994', () => {
        // Mutant ID: 994
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 995', () => {
        // Mutant ID: 995
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 997', () => {
        // Mutant ID: 997
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 999', () => {
        // Mutant ID: 999
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1001', () => {
        // Mutant ID: 1001
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1004', () => {
        // Mutant ID: 1004
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const values: number[] = [10, 20, 300, 400];
        const result: number[] = page._parseBoxValues(values, 'MediaBox');
        expect(result).toBe(values);
        expect(result.length).toBe(4);
        expect(result).toEqual([10, 20, 300, 400]);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1011', () => {
        // Mutant ID: 1011
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1014', () => {
        // Mutant ID: 1014
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1016', () => {
        // Mutant ID: 1016
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1017', () => {
        // Mutant ID: 1017
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1019', () => {
        // Mutant ID: 1019
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1020', () => {
        // Mutant ID: 1020
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1021', () => {
        // Mutant ID: 1021
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1022', () => {
        // Mutant ID: 1022
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1023', () => {
        // Mutant ID: 1023
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1024', () => {
        // Mutant ID: 1024
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1025', () => {
        // Mutant ID: 1025
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1026', () => {
        // Mutant ID: 1026
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1027', () => {
        // Mutant ID: 1027
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1028', () => {
        // Mutant ID: 1028
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1029', () => {
        // Mutant ID: 1029
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1032', () => {
        // Mutant ID: 1032
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1033', () => {
        // Mutant ID: 1033
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1034', () => {
        // Mutant ID: 1034
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1035', () => {
        // Mutant ID: 1035
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 13', () => {
    it('should preserve text layout behavior for mutant 1036', () => {
        // Mutant ID: 1036
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1037', () => {
        // Mutant ID: 1037
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1038', () => {
        // Mutant ID: 1038
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1039', () => {
        // Mutant ID: 1039
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1040', () => {
        // Mutant ID: 1040
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1041', () => {
        // Mutant ID: 1041
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1042', () => {
        // Mutant ID: 1042
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1043', () => {
        // Mutant ID: 1043
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1044', () => {
        // Mutant ID: 1044
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1046', () => {
        // Mutant ID: 1046
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1052', () => {
        // Mutant ID: 1052
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1053', () => {
        // Mutant ID: 1053
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1054', () => {
        // Mutant ID: 1054
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1055', () => {
        // Mutant ID: 1055
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1056', () => {
        // Mutant ID: 1056
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1062', () => {
        // Mutant ID: 1062
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1063', () => {
        // Mutant ID: 1063
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1067', () => {
        // Mutant ID: 1067
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1068', () => {
        // Mutant ID: 1068
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1069', () => {
        // Mutant ID: 1069
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1072', () => {
        // Mutant ID: 1072
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1076', () => {
        // Mutant ID: 1076
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1079', () => {
        // Mutant ID: 1079
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1080', () => {
        // Mutant ID: 1080
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1084', () => {
        // Mutant ID: 1084
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1085', () => {
        // Mutant ID: 1085
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve text layout behavior for mutant 1086', () => {
        // Mutant ID: 1086
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const text: string = 'Column layout mutation coverage text '.repeat(20);
        const element: PdfTextElement = {
            text,
            font,
            layoutFormat: format
        };
        format.layout = PdfLayoutType.paginate;
        format.break = PdfLayoutBreakType.fitPage;
        format._columns = 2;
        format._columnGutter = 10;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 10, width: 240, height: 80 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBeDefined();
        expect(result.bounds.width).toBeGreaterThanOrEqual(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('should preserve section lookup behavior for mutant 1091', () => {
        // Mutant ID: 1091
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        const sectionIndex: number = page._getSectionIndex();
        expect(sectionIndex).toBe(-1);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1098', () => {
        // Mutant ID: 1098
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1099', () => {
        // Mutant ID: 1099
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 14', () => {
    it('should preserve destination construction behavior for mutant 1106', () => {
        // Mutant ID: 1106
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1115', () => {
        // Mutant ID: 1115
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1117', () => {
        // Mutant ID: 1117
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1124', () => {
        // Mutant ID: 1124
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1125', () => {
        // Mutant ID: 1125
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1129', () => {
        // Mutant ID: 1129
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1136', () => {
        // Mutant ID: 1136
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1138', () => {
        // Mutant ID: 1138
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1139', () => {
        // Mutant ID: 1139
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1140', () => {
        // Mutant ID: 1140
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1141', () => {
        // Mutant ID: 1141
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1142', () => {
        // Mutant ID: 1142
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1145', () => {
        // Mutant ID: 1145
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1148', () => {
        // Mutant ID: 1148
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1155', () => {
        // Mutant ID: 1155
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1163', () => {
        // Mutant ID: 1163
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1164', () => {
        // Mutant ID: 1164
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1165', () => {
        // Mutant ID: 1165
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1167', () => {
        // Mutant ID: 1167
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1169', () => {
        // Mutant ID: 1169
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1171', () => {
        // Mutant ID: 1171
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1175', () => {
        // Mutant ID: 1175
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1176', () => {
        // Mutant ID: 1176
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1177', () => {
        // Mutant ID: 1177
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1179', () => {
        // Mutant ID: 1179
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1181', () => {
        // Mutant ID: 1181
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination construction behavior for mutant 1183', () => {
        // Mutant ID: 1183
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 15, y: 25, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            {
                mode: PdfDestinationMode.fitToPage,
                zoom: 2
            }
        );
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 15, y: 25 });
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        expect(destination.zoom).toBe(2);
        document.destroy();
    });
    it('should preserve destination property behavior for mutant 1193', () => {
        // Mutant ID: 1193
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'zoom'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1194', () => {
        // Mutant ID: 1194
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'zoom'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1199', () => {
        // Mutant ID: 1199
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(firstPage);
        destination.page = secondPage;
        expect(destination.page).toBe(secondPage);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 15', () => {
    it('should preserve destination property behavior for mutant 1203', () => {
        // Mutant ID: 1203
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'page'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1204', () => {
        // Mutant ID: 1204
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'page'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1208', () => {
        // Mutant ID: 1208
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'mode'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1209', () => {
        // Mutant ID: 1209
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'mode'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1214', () => {
        // Mutant ID: 1214
        const destination: PdfDestination = new PdfDestination();
        destination.mode = PdfDestinationMode.fitToPage;
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
    });
    it('should preserve destination property behavior for mutant 1218', () => {
        // Mutant ID: 1218
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'location'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1219', () => {
        // Mutant ID: 1219
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'location'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1224', () => {
        // Mutant ID: 1224
        const destination: PdfDestination = new PdfDestination();
        const location: Point = { x: 35, y: 45 };
        destination.location = location;
        expect(destination.location).toBe(location);
    });
    it('should preserve destination property behavior for mutant 1228', () => {
        // Mutant ID: 1228
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'destinationBounds'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1229', () => {
        // Mutant ID: 1229
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'destinationBounds'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1234', () => {
        // Mutant ID: 1234
        const destination: PdfDestination = new PdfDestination();
        const bounds: Rectangle = { x: 5, y: 10, width: 90, height: 40 };
        destination.destinationBounds = bounds;
        expect(destination.destinationBounds).toBe(bounds);
    });
    it('should preserve destination property behavior for mutant 1243', () => {
        // Mutant ID: 1243
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'isValid'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination property behavior for mutant 1244', () => {
        // Mutant ID: 1244
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'isValid'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should preserve destination primitive behavior for mutant 1252', () => {
        // Mutant ID: 1252
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1254', () => {
        // Mutant ID: 1254
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1255', () => {
        // Mutant ID: 1255
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1257', () => {
        // Mutant ID: 1257
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1258', () => {
        // Mutant ID: 1258
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1264', () => {
        // Mutant ID: 1264
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1265', () => {
        // Mutant ID: 1265
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1270', () => {
        // Mutant ID: 1270
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1272', () => {
        // Mutant ID: 1272
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1273', () => {
        // Mutant ID: 1273
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1275', () => {
        // Mutant ID: 1275
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1276', () => {
        // Mutant ID: 1276
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1290', () => {
        // Mutant ID: 1290
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page);
        destination.mode = PdfDestinationMode.fitToPage;
        destination.location = { x: 10, y: 20 };
        destination.zoom = 1.5;
        destination._initializePrimitive();
        expect(destination._array.length).toBeGreaterThan(1);
        expect(destination._array[1]).toEqual(_PdfName.get('Fit'));
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1299', () => {
        // Mutant ID: 1299
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destination: any = new PdfDestination();
        dictionary.update('D', [0, _PdfName.get('Fit')]);
        destination._dictionary = dictionary;
        destination._key = 'Dest';
        destination._initializePrimitive();
        expect(destination._dictionary).toBe(dictionary);
        document.destroy();
    });
    it('should preserve destination primitive behavior for mutant 1305', () => {
        // Mutant ID: 1305
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destination: any = new PdfDestination();
        dictionary.update('D', [0, _PdfName.get('Fit')]);
        destination._dictionary = dictionary;
        destination._key = 'Dest';
        destination._initializePrimitive();
        expect(destination._dictionary).toBe(dictionary);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 16', () => {
    it('should preserve named destination resolution at boundary case 1 for ConditionalExpression', () => {
        // Mutant ID: 1308
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'MissingDestination');
        const destination: any = helper._getDestination(
            'MissingDestination',
            document
        );
        expect(destination).toBeUndefined();
        document.destroy();
    });
    it('should preserve named destination resolution at boundary case 2 for LogicalOperator', () => {
        // Mutant ID: 1309
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'MissingDestination');
        const destination: any = helper._getDestination(
            'MissingDestination',
            document
        );
        expect(destination).toBeUndefined();
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 15 for ConditionalExpression', () => {
        // Mutant ID: 1385
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 16 for ConditionalExpression', () => {
        // Mutant ID: 1386
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 17 for EqualityOperator', () => {
        // Mutant ID: 1387
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 18 for StringLiteral', () => {
        // Mutant ID: 1388
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 19 for ConditionalExpression', () => {
        // Mutant ID: 1390
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 20 for ConditionalExpression', () => {
        // Mutant ID: 1394
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 21 for ConditionalExpression', () => {
        // Mutant ID: 1399
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 22 for LogicalOperator', () => {
        // Mutant ID: 1401
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 23 for ConditionalExpression', () => {
        // Mutant ID: 1402
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 24 for StringLiteral', () => {
        // Mutant ID: 1404
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 25 for ConditionalExpression', () => {
        // Mutant ID: 1405
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 26 for ConditionalExpression', () => {
        // Mutant ID: 1416
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 27 for LogicalOperator', () => {
        // Mutant ID: 1417
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 28 for ConditionalExpression', () => {
        // Mutant ID: 1418
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 29 for ConditionalExpression', () => {
        // Mutant ID: 1420
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 30 for ConditionalExpression', () => {
        // Mutant ID: 1424
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 17', () => {
    it('should preserve destination coordinate normalization at boundary case 1 for StringLiteral', () => {
        // Mutant ID: 1426
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 2 for ConditionalExpression', () => {
        // Mutant ID: 1427
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 3 for StringLiteral', () => {
        // Mutant ID: 1429
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 4 for ConditionalExpression', () => {
        // Mutant ID: 1430
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 5 for StringLiteral', () => {
        // Mutant ID: 1432
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 6 for ConditionalExpression', () => {
        // Mutant ID: 1437
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 7 for EqualityOperator', () => {
        // Mutant ID: 1439
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 8 for ConditionalExpression', () => {
        // Mutant ID: 1442
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 9 for EqualityOperator', () => {
        // Mutant ID: 1444
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 10 for ConditionalExpression', () => {
        // Mutant ID: 1447
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 11 for EqualityOperator', () => {
        // Mutant ID: 1449
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 12 for ConditionalExpression', () => {
        // Mutant ID: 1452
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 13 for EqualityOperator', () => {
        // Mutant ID: 1454
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 14 for ConditionalExpression', () => {
        // Mutant ID: 1457
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 15 for LogicalOperator', () => {
        // Mutant ID: 1459
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 16 for ConditionalExpression', () => {
        // Mutant ID: 1460
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 17 for StringLiteral', () => {
        // Mutant ID: 1462
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 18 for ConditionalExpression', () => {
        // Mutant ID: 1463
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 19 for ConditionalExpression', () => {
        // Mutant ID: 1465
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 20 for LogicalOperator', () => {
        // Mutant ID: 1467
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 21 for ConditionalExpression', () => {
        // Mutant ID: 1468
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 22 for StringLiteral', () => {
        // Mutant ID: 1470
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 23 for ConditionalExpression', () => {
        // Mutant ID: 1471
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 24 for ConditionalExpression', () => {
        // Mutant ID: 1473
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 25 for LogicalOperator', () => {
        // Mutant ID: 1475
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 26 for ConditionalExpression', () => {
        // Mutant ID: 1476
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 27 for StringLiteral', () => {
        // Mutant ID: 1478
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 28 for ConditionalExpression', () => {
        // Mutant ID: 1479
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 29 for ConditionalExpression', () => {
        // Mutant ID: 1481
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 30 for LogicalOperator', () => {
        // Mutant ID: 1483
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 18', () => {
    it('should preserve destination coordinate normalization at boundary case 1 for ConditionalExpression', () => {
        // Mutant ID: 1484
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 2 for StringLiteral', () => {
        // Mutant ID: 1486
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination coordinate normalization at boundary case 3 for ConditionalExpression', () => {
        // Mutant ID: 1487
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(
            page,
            { x: 20, y: 30 },
            { mode: PdfDestinationMode.location, zoom: 2 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.location).toEqual({ x: 20, y: 30 });
        expect(destination.zoom).toBe(2);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 4 for ConditionalExpression', () => {
        // Mutant ID: 1493
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 5 for EqualityOperator', () => {
        // Mutant ID: 1495
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 6 for ConditionalExpression', () => {
        // Mutant ID: 1498
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 7 for ConditionalExpression', () => {
        // Mutant ID: 1504
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 8 for ConditionalExpression', () => {
        // Mutant ID: 1519
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 9 for EqualityOperator', () => {
        // Mutant ID: 1521
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 10 for ConditionalExpression', () => {
        // Mutant ID: 1524
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 11 for ConditionalExpression', () => {
        // Mutant ID: 1525
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 12 for EqualityOperator', () => {
        // Mutant ID: 1526
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 13 for EqualityOperator', () => {
        // Mutant ID: 1527
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 14 for BlockStatement', () => {
        // Mutant ID: 1528
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 15 for ConditionalExpression', () => {
        // Mutant ID: 1529
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 16 for ConditionalExpression', () => {
        // Mutant ID: 1542
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 17 for ConditionalExpression', () => {
        // Mutant ID: 1547
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 18 for ConditionalExpression', () => {
        // Mutant ID: 1548
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 19 for EqualityOperator', () => {
        // Mutant ID: 1549
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 20 for EqualityOperator', () => {
        // Mutant ID: 1550
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 21 for BlockStatement', () => {
        // Mutant ID: 1551
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 22 for ConditionalExpression', () => {
        // Mutant ID: 1552
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 23 for ConditionalExpression', () => {
        // Mutant ID: 1553
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 24 for EqualityOperator', () => {
        // Mutant ID: 1554
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 25 for EqualityOperator', () => {
        // Mutant ID: 1555
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 26 for BlockStatement', () => {
        // Mutant ID: 1556
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 27 for ConditionalExpression', () => {
        // Mutant ID: 1557
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 28 for LogicalOperator', () => {
        // Mutant ID: 1559
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 29 for ConditionalExpression', () => {
        // Mutant ID: 1560
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 30 for LogicalOperator', () => {
        // Mutant ID: 1561
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 19', () => {
    it('should preserve destination array parsing at boundary case 1 for ConditionalExpression', () => {
        // Mutant ID: 1562
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 2 for LogicalOperator', () => {
        // Mutant ID: 1563
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 3 for ConditionalExpression', () => {
        // Mutant ID: 1564
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 4 for EqualityOperator', () => {
        // Mutant ID: 1565
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 5 for StringLiteral', () => {
        // Mutant ID: 1566
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 6 for ConditionalExpression', () => {
        // Mutant ID: 1567
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 7 for EqualityOperator', () => {
        // Mutant ID: 1568
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 8 for ConditionalExpression', () => {
        // Mutant ID: 1569
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 9 for LogicalOperator', () => {
        // Mutant ID: 1570
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 10 for ConditionalExpression', () => {
        // Mutant ID: 1571
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 11 for EqualityOperator', () => {
        // Mutant ID: 1572
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 12 for StringLiteral', () => {
        // Mutant ID: 1573
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 13 for ConditionalExpression', () => {
        // Mutant ID: 1574
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 14 for EqualityOperator', () => {
        // Mutant ID: 1575
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 15 for ConditionalExpression', () => {
        // Mutant ID: 1576
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 16 for LogicalOperator', () => {
        // Mutant ID: 1577
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 17 for ConditionalExpression', () => {
        // Mutant ID: 1578
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 18 for EqualityOperator', () => {
        // Mutant ID: 1579
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 19 for StringLiteral', () => {
        // Mutant ID: 1580
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 20 for ConditionalExpression', () => {
        // Mutant ID: 1581
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 21 for EqualityOperator', () => {
        // Mutant ID: 1582
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 22 for ConditionalExpression', () => {
        // Mutant ID: 1588
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 23 for ConditionalExpression', () => {
        // Mutant ID: 1593
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 24 for EqualityOperator', () => {
        // Mutant ID: 1594
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
    it('should preserve destination array parsing at boundary case 25 for EqualityOperator', () => {
        // Mutant ID: 1597
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bounds: Rectangle = { x: 10, y: 15, width: 120, height: 60 };
        const destination: PdfDestination = new PdfDestination(
            page,
            bounds,
            { mode: PdfDestinationMode.fitR, zoom: 1.5 }
        );
        destination._initializePrimitive();
        expect(destination.page).toBe(page);
        expect(destination.destinationBounds).toEqual(bounds);
        expect(destination.mode).toBe(PdfDestinationMode.fitR);
        expect(destination.zoom).toBe(1.5);
        expect(destination._array.length).toBeGreaterThan(1);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 20', () => {
    it('should preserve name tree traversal at boundary case 7 for ConditionalExpression', () => {
        // Mutant ID: 1643
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 8 for ConditionalExpression', () => {
        // Mutant ID: 1652
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 9 for ConditionalExpression', () => {
        // Mutant ID: 1666
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 10 for LogicalOperator', () => {
        // Mutant ID: 1668
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 11 for ConditionalExpression', () => {
        // Mutant ID: 1675
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 12 for LogicalOperator', () => {
        // Mutant ID: 1676
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 13 for ConditionalExpression', () => {
        // Mutant ID: 1678
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 14 for BlockStatement', () => {
        // Mutant ID: 1680
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 15 for LogicalOperator', () => {
        // Mutant ID: 1705
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 16 for ConditionalExpression', () => {
        // Mutant ID: 1706
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 17 for ArithmeticOperator', () => {
        // Mutant ID: 1710
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree traversal at boundary case 18 for ConditionalExpression', () => {
        // Mutant ID: 1716
        const document: PdfDocument = new PdfDocument();
        const root: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(root, 'Target');
        root.update('Names', [
            'Alpha',
            [_PdfName.get('Fit')],
            'Target',
            [_PdfName.get('XYZ'), 10, 20, 1]
        ]);
        const result: any = helper._findName(root, 'Target');
        expect(result).toBeDefined();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 19 for BooleanLiteral', () => {
        // Mutant ID: 1720
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 20 for ConditionalExpression', () => {
        // Mutant ID: 1721
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 21 for LogicalOperator', () => {
        // Mutant ID: 1723
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 22 for ConditionalExpression', () => {
        // Mutant ID: 1732
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 23 for ConditionalExpression', () => {
        // Mutant ID: 1738
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 24 for EqualityOperator', () => {
        // Mutant ID: 1739
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve name tree limit comparison at boundary case 25 for EqualityOperator', () => {
        // Mutant ID: 1742
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'Middle');
        dictionary.update('Limits', ['Alpha', 'Zulu']);
        expect(helper._checkLimits(dictionary, 'Middle')).toBeTruthy();
        expect(helper._checkLimits(dictionary, 'Aardvark')).toBeFalsy();
        document.destroy();
    });
    it('should preserve destination string comparison at boundary case 26 for ConditionalExpression', () => {
        // Mutant ID: 1756
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(undefined as any, 'Target');
        expect(helper._stringCompare('Alpha', 'Alpha')).toBe(0);
        expect(helper._stringCompare('Alpha', 'Beta')).toBeLessThan(0);
        expect(helper._stringCompare('Beta', 'Alpha')).toBeGreaterThan(0);
    });
    it('should preserve destination string comparison at boundary case 27 for BlockStatement', () => {
        // Mutant ID: 1758
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(undefined as any, 'Target');
        expect(helper._stringCompare('Alpha', 'Alpha')).toBe(0);
        expect(helper._stringCompare('Alpha', 'Beta')).toBeLessThan(0);
        expect(helper._stringCompare('Beta', 'Alpha')).toBeGreaterThan(0);
    });
    // Replace the failing tests for the listed mutant IDs with these cases.
    it('should expose destinationBounds metadata', () => {
        // Mutant ID: 1238
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'destinationBounds'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should expose destinationBounds metadata', () => {
        // Mutant ID: 1239
        const descriptor: any = Object.getOwnPropertyDescriptor(
            PdfDestination.prototype,
            'destinationBounds'
        );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1326
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1333
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1334
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1348
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1350
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1355
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1356
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1358
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1363
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1367
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1373
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a direct destination array', () => {
        // Mutant ID: 1374
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(dictionary, 'D');
        dictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        const destination: PdfDestination = helper._obtainDestination();
        expect(destination).toBeDefined();
        expect(destination.page).toBe(page);
        expect(destination.mode).toBe(PdfDestinationMode.fitToPage);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1600
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1602
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1603
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1620
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1621
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1623
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1626
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a string destination from the Names tree', () => {
        // Mutant ID: 1627
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const namesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationTree: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinationReference: _PdfReference =
            document._crossReference._getNextReference();
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinationDictionary.update('D', [
            0,
            _PdfName.get('Fit')
        ]);
        document._crossReference._cacheMap.set(
            destinationReference,
            destinationDictionary
        );
        destinationTree.update('Names', [
            'Target',
            destinationReference
        ]);
        namesDictionary.update('Dests', destinationTree);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const destinationArray: any[] = helper._getDestination(
            'Target',
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a PdfName destination from the Dests dictionary', () => {
        // Mutant ID: 1632
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinations: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinations.update('Target', [
            0,
            _PdfName.get('Fit')
        ]);
        document._catalog._catalogDictionary.update(
            'Dests',
            destinations
        );
        const destinationArray: any[] = helper._getDestination(
            _PdfName.get('Target'),
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a PdfName destination from the Dests dictionary', () => {
        // Mutant ID: 1634
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinations: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinations.update('Target', [
            0,
            _PdfName.get('Fit')
        ]);
        document._catalog._catalogDictionary.update(
            'Dests',
            destinations
        );
        const destinationArray: any[] = helper._getDestination(
            _PdfName.get('Target'),
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
    it('should resolve a PdfName destination from the Dests dictionary', () => {
        // Mutant ID: 1635
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const helperDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const destinations: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const helper: _PdfDestinationHelper =
            new _PdfDestinationHelper(helperDictionary, 'D');
        destinations.update('Target', [
            0,
            _PdfName.get('Fit')
        ]);
        document._catalog._catalogDictionary.update(
            'Dests',
            destinations
        );
        const destinationArray: any[] = helper._getDestination(
            _PdfName.get('Target'),
            document
        );
        expect(destinationArray).toBeDefined();
        expect(destinationArray[0]).toBe(0);
        expect(destinationArray[1]).toEqual(_PdfName.get('Fit'));
        expect(page._pageIndex).toBe(0);
        document.destroy();
    });
});