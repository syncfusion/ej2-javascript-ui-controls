import { PdfDocumentAuthorField } from "../src/pdf/core/graphics/automatic-fields/document-author-field";
import { PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfDocumentInformation } from "../src/pdf/core/pdf-document-information";
import { PdfPage } from "../src/pdf/core/pdf-page";
describe('PdfDocumentAuthorField _getValue page validation', () => {
    it('returns document author when page and document information are available', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const documentInformation: PdfDocumentInformation = {
            author: 'Syncfusion'
        };
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();

        document.setDocumentInformation(documentInformation);

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('Syncfusion');
        expect(value.length).toBe(10);

        document.destroy();
    });

    it('returns empty value when graphics has no associated page', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();
        const originalGetPageFromGraphics:
            (graphics: PdfGraphics) => PdfPage =
            authorField._getPageFromGraphics;

        authorField._getPageFromGraphics =
            (_graphics: PdfGraphics): PdfPage => undefined as any;

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('');
        expect(value.length).toBe(0);

        authorField._getPageFromGraphics = originalGetPageFromGraphics;
        document.destroy();
    });

    it('returns empty value when page cross reference is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();
        const originalCrossReference: any = page._crossReference;

        (page as any)._crossReference = undefined;

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('');
        expect(value.length).toBe(0);

        (page as any)._crossReference = originalCrossReference;
        document.destroy();
    });

    it('returns empty value when cross reference document is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();
        const originalDocument: PdfDocument =
            page._crossReference._document;

        page._crossReference._document = undefined as any;

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('');
        expect(value.length).toBe(0);

        page._crossReference._document = originalDocument;
        document.destroy();
    });

    it('returns empty value when document author is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('');
        expect(value.length).toBe(0);

        document.destroy();
    });

    it('returns empty value when document author is empty', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const documentInformation: PdfDocumentInformation = {
            author: ''
        };
        const authorField: PdfDocumentAuthorField =
            new PdfDocumentAuthorField();

        document.setDocumentInformation(documentInformation);

        const value: string = authorField._getValue(graphics);

        expect(value).toBe('');
        expect(value.length).toBe(0);

        document.destroy();
    });
});