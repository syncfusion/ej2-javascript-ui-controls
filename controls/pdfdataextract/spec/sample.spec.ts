import { _ContentParser, _PdfRecord, _PdfReference, PdfBitmap, PdfDocument, PdfPage } from '@syncfusion/ej2-pdf';
import { PdfRedactor } from './../src/pdf-data-extract/core/redaction/pdf-redactor';
import { PdfRedactionRegion } from './../src/pdf-data-extract/core/redaction/pdf-redaction-region';
import { PdfDataExtractor } from './../src/pdf-data-extract/core/pdf-data-extractor';
import { creditCard, image, template } from './inputs.spec';
import { PdfEmbeddedImage } from './../src/pdf-data-extract/core/image-extraction';
describe('Security', () => {
    it('Reduction', () => {
        //Credit care receipt
        let bytes = creditCard;
        const rects = [
            { x: 70, y: 120, width: 200, height: 80 },
            { x: 400, y: 150, width: 100, height: 30 }
        ];
        // Create a new PDF document
        const pdf = new PdfDocument(bytes);
        // Create redactor from the document
        const redactor = new PdfRedactor(pdf);
        // Build regions for page index 0
        const regions: PdfRedactionRegion[] = rects.map((r) => {
            const region = new PdfRedactionRegion(0, { x: r.x, y: r.y, width: r.width, height: r.height });
            // Black fill for redaction
            region.fillColor = { r: 0, g: 0, b: 0 };
            return region;
        });
        // Add redactor region
        redactor.add(regions);
        // Apply redaction
        redactor.redactSync();
        // Save the PDF
        const saveBytes = pdf.save();
        // Destory the document
        pdf.destroy();
        const parsed = new PdfDocument(saveBytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.25']);
        expect(result[2]._operator).toEqual('CS');
        expect(result[2]._operands).toEqual(['/DeviceRGB']);
        expect(result[3]._operator).toEqual('cs');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('rg');
        expect(result[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[5]._operator).toEqual('re');
        expect(result[5]._operands).toEqual(['70.000', '-120.000', '200.000', '-80.000']);
        expect(result[6]._operator).toEqual('f');
        expect(result[6]._operands).toEqual([]);
        expect(result[7]._operator).toEqual('rg');
        expect(result[7]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[8]._operator).toEqual('re');
        expect(result[8]._operands).toEqual(['400.000', '-150.000', '100.000', '-30.000']);
        expect(result[9]._operator).toEqual('f');
        expect(result[9]._operands).toEqual([]);
    });
});
describe('Import and Export', () => {
    it("Extract Text", () => {
        const normalize = (s: string) =>s.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
        const pdfBytes = template;
        const pdf = new PdfDocument(pdfBytes);
        const extractor = new PdfDataExtractor(pdf);
        const text1: string = extractor.extractText({
            startPageIndex: 0,
            endPageIndex: 4
        });
        pdf.destroy();
        expect(text1).toBeTruthy();
        expect(text1.length).toBeGreaterThan(500);
        const pages = text1.split(/PDF Succinctly\s*Page \d+ of 8/g);
        const cleanPages = pages.filter(p => p.trim().length > 0);
        expect(cleanPages.length).toBe(5); // text must produce 8 pages
        for (let i = 0; i < cleanPages.length; i++) {
            const pageNumber = i;
            const normalized = normalize(cleanPages[i]);
            switch (pageNumber) {
                case 0:
                    expect(normalized).toContain("Introduction");
                    expect(normalized).toContain("Portable Document Format (PDF)");
                    expect(normalized).toContain("The PDF Standard");
                    break;
                case 1:
                    expect(normalized).toContain("Every PDF file must have these four components.");
                    break;
                case 2:
                    expect(normalized).toContain(`Header\n\nThe header is simply a PDF version number and an arbitrary sequence of binary data.\nThe binary data prevents naïve applications from processing the PDF as a text file.\nThis would result in a corrupted file, since a PDF typically consists of both plain text\nand binary data (e.g., a binary font file can be directly embedded in a PDF).\n\nBody\n\nThe body of a PDF contains the entire visible document. The minimum elements\nrequired in a valid PDF body are:\n1. A page tree\n2. Pages\n3. Resources\n4. Content\n5. The catalog\nThe page tree serves as the root of the document. In the simplest case, it is just a list\nof the pages in the document. Each page is defined as an independent entity with\nmetadata (e.g., page dimensions) and a reference to its resources and content, which\nare defined separately. Together, the page tree and page objects create the "paper"\nthat composes the document.\nResources are objects that are required to render a page. For example, a single font\nis typically used across several pages, so storing the font information in an external\nresource is much more efficient. A content object defines the text and graphics that\nactually show up on the page. Together, content objects and resources define the\nappearance of an individual page.\nFinally, the document's catalog tells applications where to start reading the document.\nOften, this is just a pointer to the root page tree.`);
                    break;
                case 3:
                    expect(normalized).toContain("Cross-Reference Table\n\nAfter the header and the body comes the cross-reference table. It records the byte\nlocation of each object in the body of the file. This enables random-access of the\ndocument, so when rendering a page, only the objects required for that page are read\nfrom the file. This makes PDFs much faster than their PostScript predecessors, which\nhad to read in the entire file before processing it.\n\nTrailer\n\nFinally, we come to the last component of a PDF document. The trailer tells\napplications how to start reading the file. At minimum, it contains three things:");
                    break;
                case 4:
                    expect(normalized).toContain("1. A reference to the catalog which links to the root of the document.\n2. The location of the cross-reference table.\n3. The size of the cross-reference table.\nSince a trailer is all you need to begin processing a document, PDFs are typically\nread back-to-front: first, the end of the file is found, and then you read backwards until\nyou arrive at the beginning of the trailer. After that, you should have all the information\nyou need to load any page in the PDF.\n\nSummary\n\nTo conclude our overview, a PDF document has a header, a body, a cross-reference\ntable, and a trailer. The trailer serves as the entryway to the entire document, giving\nyou access to any object via the cross-reference table, and pointing you toward the\nroot of the document. The relationship between these elements is shown in the\nfollowing figure.");
                    break;
                default:
                    break;
            }
        }
    });
    it ('Image Extraction - 1', async() => {
        let loadocument: PdfDocument =  new PdfDocument(image);
        let extractor: PdfDataExtractor = new PdfDataExtractor(loadocument, canvasRenderCallback);
        let imageInfoCollection: PdfEmbeddedImage[] = await extractor.extractImages({ startPageIndex: 0, endPageIndex: loadocument.pageCount - 1});
        expect(imageInfoCollection[0].data.length).toEqual(87781);
        let doc: PdfDocument = new PdfDocument();
        for (let i: number = 0; i < imageInfoCollection.length; i++) {
            let imageInfo: PdfEmbeddedImage = imageInfoCollection[i];
            let page: PdfPage = doc.addPage();
            const image2 = new PdfBitmap(imageInfoCollection[i].data);
            let bounds = imageInfo.bounds;
            page.graphics.drawImage(image2, {x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height});
        }        
        let output = doc.save();
        let ldoc: PdfDocument = new PdfDocument(output);
        let ref: _PdfReference = new _PdfReference(8, 0);
        ref._isNew = false;
        let value = ldoc._crossReference._fetch(ref);
        ref = new _PdfReference(14, 0);
        let bytes = value.getBytes();
        expect(bytes.length).toEqual(87781)
        doc.destroy();
    });
    function canvasRenderCallback(): any {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        return { canvas: canvas, applicationPlatform: undefined};
    }
});