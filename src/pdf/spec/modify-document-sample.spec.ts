import { _ContentParser, _PdfRecord } from "./../src/pdf/core/content-parser";
import { PdfRotationAngle } from "./../src/pdf/core/enumerator";
import { PdfFontFamily, PdfFontStyle } from "./../src/pdf/core/fonts/pdf-standard-font";
import { PdfBitmap } from "./../src/pdf/core/graphics/images/pdf-bitmap";
import { PdfBrush } from "./../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "./../src/pdf/core/pdf-document";
import { PdfPage } from "./../src/pdf/core/pdf-page";
import { PdfPageImportOptions } from "./../src/pdf/core/pdf-page-import-options";
import { jpgBytes, pngBytes } from "./image-input.spec";
import { creditCard, template, watermark } from "./inputs.spec";

describe('Modify Documents', () => {
    it('Merge Documents', () => {
        const pdfBytes = template;
        // Create two PdfDocument instances (doc1 and doc2) from the same source bytes
        const doc1 = new PdfDocument(pdfBytes);
        const doc2 = new PdfDocument(pdfBytes);
        // Read the "OptimizeResources" checkbox state from the DOM (default to true if missing)
        const optimize = false;
        const options = new PdfPageImportOptions({ optimizeResources: optimize });
        const doc1PageCount = doc1.pageCount;
        const doc2PageCount = doc2.pageCount;
        //Import all pages from doc2 into doc1 using importPageRange
        doc1.importPageRange(doc2, 0, doc2.pageCount - 1, options);
        expect(doc1.getPage(0).mediaBox).toEqual([0, 0, 595, 842]);
        expect(doc2.getPage(0).mediaBox).toEqual([0, 0, 595, 842]);
        //Save and download the document
        const bytes = doc1.save();
        // Destroy the document instance
        doc1.destroy();
        doc2.destroy();
        const newDocument = new PdfDocument(bytes);
        expect(newDocument.pageCount).toEqual(doc1PageCount + doc2PageCount);
        for (let i = 0; i < newDocument.pageCount; i++) {
            const mb = newDocument.getPage(i).mediaBox;
            expect(mb).toEqual([0, 0, 595, 842]); // Standard A4
            const rotation = newDocument.getPage(i).rotation;
            expect(rotation).toEqual(PdfRotationAngle.angle0);
            const parsedPage: PdfPage = newDocument.getPage(i);
            expect(parsedPage).toBeDefined();
            const contents = parsedPage._pageDictionary.get('Contents');
            expect(contents).toBeDefined();
            let ref; let stream; let parser; let result;
            if (i <= 4) {
                ref = contents[3];
                expect(ref).toBeDefined();
                stream = parsedPage._crossReference._fetch(ref);
                expect(stream).toBeDefined();
                parser = new _ContentParser(stream.getBytes());
                expect(parser).toBeDefined();
                result = parser._readContent();
                expect(result).toBeDefined();
            } else {
                ref = contents[2];
                expect(ref).toBeDefined();
                stream = parsedPage._crossReference._fetch(ref);
                expect(stream).toBeDefined();
                parser = new _ContentParser(stream.getBytes());
                expect(parser).toBeDefined();
                result = parser._readContent();
                expect(result).toBeDefined();
                let xobjectRef = result[9]._operands;
                let xobject = parsedPage._pageDictionary.get('Resources').get('XObject');
                stream = xobject.get(xobjectRef[0].slice(1));
                expect(stream).toBeDefined();
                parser = new _ContentParser(stream.getBytes());
                expect(parser).toBeDefined();
                result = parser._readContent();
                expect(result).toBeDefined();
            }
            switch (i) {
                case 0:
                    expect(result[87]._operator).toEqual('Tw');
                    expect(result[87]._operands).toEqual(['1.87']);
                    expect(result[88]._operator).toEqual("'");
                    expect(result[88]._operands).toEqual(['(We\'ll begin with a conceptual overview of a simple PDF document. This chapter is)']);
                    expect(result[89]._operator).toEqual('Tm');
                    expect(result[89]._operands).toEqual(['1', '0', '0', '1', '20', '-479.49']);
                    expect(result[90]._operator).toEqual('Tw');
                    expect(result[90]._operands).toEqual(['0.88']);
                    expect(result[91]._operator).toEqual("'");
                    expect(result[91]._operands).toEqual(['(designed to be a brief orientation before diving in and creating a real document from)']);
                    expect(result[92]._operator).toEqual('Tm');
                    expect(result[92]._operands).toEqual(['1', '0', '0', '1', '20', '-494.52']);
                    expect(result[93]._operator).toEqual('Tw');
                    expect(result[93]._operands).toEqual(['0']);
                    expect(result[94]._operator).toEqual("'");
                    expect(result[94]._operands).toEqual(['(scratch.)']);
                    expect(result[95]._operator).toEqual('Tm');
                    expect(result[95]._operands).toEqual(['1', '0', '0', '1', '20', '-509.54']);
                    expect(result[96]._operator).toEqual('Tw');
                    expect(result[96]._operands).toEqual(['0.98']);
                    expect(result[97]._operator).toEqual("'");
                    expect(result[97]._operands).toEqual(['(A PDF file can be divided into four parts: a header, body, cross-reference table, and)']);
                    break;
                case 1:
                    expect(result[15]._operator).toEqual('Tf');
                    expect(result[15]._operands[1]).toEqual('13.00');
                    expect(result[16]._operator).toEqual('Tr');
                    expect(result[16]._operands).toEqual(['0']);
                    expect(result[17]._operator).toEqual('Tc');
                    expect(result[17]._operands).toEqual(['0']);
                    expect(result[18]._operator).toEqual('Tw');
                    expect(result[18]._operands).toEqual(['0']);
                    expect(result[19]._operator).toEqual('Tz');
                    expect(result[19]._operands).toEqual(['100']);
                    expect(result[20]._operator).toEqual('Tm');
                    expect(result[20]._operands).toEqual(['1', '0', '0', '1', '20', '-632.10']);
                    expect(result[21]._operator).toEqual('Tw');
                    expect(result[21]._operands).toEqual(['0']);
                    expect(result[22]._operator).toEqual("'");
                    expect(result[22]._operands).toEqual(['(Every PDF file must have these four components.)']);
                    break;
                case 2:
                    expect(result[45]._operator).toEqual("'");
                    expect(result[45]._operands).toEqual(['(The body of a PDF contains the entire visible document. The minimum elements)']);
                    expect(result[46]._operator).toEqual('Tm');
                    expect(result[46]._operands).toEqual(['1', '0', '0', '1', '20', '-210.08']);
                    expect(result[47]._operator).toEqual('Tw');
                    expect(result[47]._operands).toEqual(['0']);
                    expect(result[48]._operator).toEqual("'");
                    expect(result[48]._operands).toEqual(['(required in a valid PDF body are:)']);
                    expect(result[49]._operator).toEqual('Tm');
                    expect(result[49]._operands).toEqual(['1', '0', '0', '1', '20', '-225.11']);
                    expect(result[50]._operator).toEqual('Tm');
                    expect(result[50]._operands).toEqual(['1', '0', '0', '1', '20', '-240.14']);
                    expect(result[51]._operator).toEqual('Tw');
                    expect(result[51]._operands).toEqual(['0']);
                    expect(result[52]._operator).toEqual("'");
                    expect(result[52]._operands).toEqual(['(1. A page tree)']);
                    expect(result[53]._operator).toEqual('Tm');
                    expect(result[53]._operands).toEqual(['1', '0', '0', '1', '20', '-255.17']);
                    expect(result[54]._operator).toEqual('Tw');
                    expect(result[54]._operands).toEqual(['0']);
                    expect(result[55]._operator).toEqual("'");
                    expect(result[55]._operands).toEqual(['(2. Pages)']);
                    expect(result[56]._operator).toEqual('Tm');
                    expect(result[56]._operands).toEqual(['1', '0', '0', '1', '20', '-270.19']);
                    expect(result[57]._operator).toEqual('Tw');
                    expect(result[57]._operands).toEqual(['0']);
                    expect(result[58]._operator).toEqual("'");
                    expect(result[58]._operands).toEqual(['(3. Resources)']);
                    expect(result[59]._operator).toEqual('Tm');
                    expect(result[59]._operands).toEqual(['1', '0', '0', '1', '20', '-285.22']);
                    expect(result[60]._operator).toEqual('Tw');
                    expect(result[60]._operands).toEqual(['0']);
                    expect(result[61]._operator).toEqual("'");
                    expect(result[61]._operands).toEqual(['(4. Content)']);
                    expect(result[62]._operator).toEqual('Tm');
                    expect(result[62]._operands).toEqual(['1', '0', '0', '1', '20', '-300.25']);
                    expect(result[63]._operator).toEqual('Tw');
                    expect(result[63]._operands).toEqual(['0']);
                    expect(result[64]._operator).toEqual("'");
                    expect(result[64]._operands).toEqual(['(5. The catalog)']);
                    expect(result[65]._operator).toEqual('Tm');
                    expect(result[65]._operands).toEqual(['1', '0', '0', '1', '20', '-315.28']);
                    break;
                case 4:
                    expect(result[22]._operator).toEqual("'");
                    expect(result[22]._operands).toEqual(['(2. The location of the cross-reference table.)']);
                    expect(result[23]._operator).toEqual('Tm');
                    expect(result[23]._operands).toEqual(['1', '0', '0', '1', '20', '-57.19']);
                    expect(result[24]._operator).toEqual('Tw');
                    expect(result[24]._operands).toEqual(['0']);
                    expect(result[25]._operator).toEqual("'");
                    expect(result[25]._operands).toEqual(['(3. The size of the cross-reference table.)']);
                    expect(result[26]._operator).toEqual('Tm');
                    expect(result[26]._operands).toEqual(['1', '0', '0', '1', '20', '-72.22']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1', '0', '0', '1', '20', '-87.24']);
                    expect(result[28]._operator).toEqual('Tw');
                    expect(result[28]._operands).toEqual(['2.07']);
                    expect(result[29]._operator).toEqual("'");
                    expect(result[29]._operands).toEqual(['(Since a trailer is all you need to begin processing a document, PDFs are typically)']);
                    expect(result[30]._operator).toEqual('Tm');
                    expect(result[30]._operands).toEqual(['1', '0', '0', '1', '20', '-102.27']);
                    expect(result[31]._operator).toEqual('Tw');
                    expect(result[31]._operands).toEqual(['0.19']);
                    expect(result[32]._operator).toEqual("'");
                    expect(result[32]._operands).toEqual(['(read back-to-front: first, the end of the file is found, and then you read backwards until)']);
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1', '0', '0', '1', '20', '-117.30']);
                    expect(result[34]._operator).toEqual('Tw');
                    expect(result[34]._operands).toEqual(['0.10']);
                    expect(result[35]._operator).toEqual("'");
                    expect(result[35]._operands).toEqual(['(you arrive at the beginning of the trailer. After that, you should have all the information)']);
                    expect(result[36]._operator).toEqual('Tm');
                    expect(result[36]._operands).toEqual(['1', '0', '0', '1', '20', '-132.33']);
                    expect(result[37]._operator).toEqual('Tw');
                    expect(result[37]._operands).toEqual(['0']);
                    expect(result[38]._operator).toEqual("'");
                    expect(result[38]._operands).toEqual(['(you need to load any page in the PDF.)']);
                    break;
                case 5:
                    expect(result[26]._operator).toEqual('Tm');
                    expect(result[26]._operands).toEqual(['1', '0', '0', '1', '20', '-84.85']);
                    expect(result[27]._operator).toEqual('Tw');
                    expect(result[27]._operands).toEqual(['3.59']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Adobe Systems Incorporated\'s Portable Document Format \\(PDF\\) is the de facto)']);
                    break;
                case 6:
                    expect(result[23]._operator).toEqual('Tz');
                    expect(result[23]._operands).toEqual(['100']);
                    expect(result[24]._operator).toEqual('Tm');
                    expect(result[24]._operands).toEqual(['1', '0', '0', '1', '20', '-632.10']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0']);
                    expect(result[26]._operator).toEqual("'");
                    expect(result[26]._operands).toEqual(['(Every PDF file must have these four components.)']);
                    break;
                case 7:
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(The header is simply a PDF version number and an arbitrary sequence of binary data.)']);
                    expect(result[29]._operator).toEqual('Tm');
                    expect(result[29]._operands).toEqual(['1', '0', '0', '1', '20', '-83.55']);
                    expect(result[30]._operator).toEqual('Tw');
                    expect(result[30]._operands).toEqual(['1.50']);
                    expect(result[31]._operator).toEqual("'");
                    expect(result[31]._operands).toEqual(['(The binary data prevents naïve applications from processing the PDF as a text file.)']);
                    expect(result[32]._operator).toEqual('Tm');
                    expect(result[32]._operands).toEqual(['1', '0', '0', '1', '20', '-98.58']);
                    expect(result[33]._operator).toEqual('Tw');
                    expect(result[33]._operands).toEqual(['1.11']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(This would result in a corrupted file, since a PDF typically consists of both plain text)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1', '0', '0', '1', '20', '-113.61']);
                    break;
                default:
                    break;
            }
        }
        newDocument.destroy();
    });
    it('Rearrange pages', () => {
        const pdfBytes = creditCard;
        // Create a PdfDocument instance from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Reorder pages using pdf.reorderPages with the new order [2, 0, 1]
        expect(pdf.pageCount).toBe(3);
        const pageOne: PdfPage = pdf.getPage(0);
        const pageTwo: PdfPage = pdf.getPage(1);
        const pageThree: PdfPage = pdf.getPage(2);
        pdf.reorderPages([2, 0, 1]);
        // Save and download the document
        const bytes = pdf.save();
        const parsed = new PdfDocument(bytes);
        const parsedPageOne: PdfPage = parsed.getPage(0);
        let parsedContents = parsedPageOne._pageDictionary.get('Contents');
        let contents = pageThree._pageDictionary.get('Contents');
        let ref = contents[0];
        let parsedRef = parsedContents[0];
        let parsedStream = parsedPageOne._crossReference._fetch(parsedRef);
        let stream = pageThree._crossReference._fetch(ref);
        let parserBefore: _ContentParser = new _ContentParser(stream.getBytes());
        let parserAfter: _ContentParser = new _ContentParser(parsedStream.getBytes());
        let resultBefore: _PdfRecord[] = parserBefore._readContent();
        let resultAfter: _PdfRecord[] = parserAfter._readContent();
        expect(resultAfter).toEqual(resultBefore);
        for (let i = 0; i < resultBefore.length; i++) {
            expect(resultBefore[i]).toEqual(resultAfter[i]);
        }
        //Check the page two
        const parsedPageTwo: PdfPage = parsed.getPage(1);
        parsedContents = parsedPageTwo._pageDictionary.get('Contents');
        contents = pageOne._pageDictionary.get('Contents');
        ref = contents[0];
        parsedRef = parsedContents[0];
        parsedStream = parsedPageTwo._crossReference._fetch(parsedRef);
        stream = pageOne._crossReference._fetch(ref);
        parserBefore = new _ContentParser(stream.getBytes());
        parserAfter = new _ContentParser(parsedStream.getBytes());
        resultBefore = parserBefore._readContent();
        resultAfter = parserAfter._readContent();
        expect(resultAfter).toEqual(resultBefore);
        for (let i = 0; i < resultBefore.length; i++) {
            expect(resultBefore[i]).toEqual(resultAfter[i]);
        }
        //check the page three contents
        const parsedPageThree: PdfPage = parsed.getPage(2);
        parsedContents = parsedPageThree._pageDictionary.get('Contents');
        contents = pageTwo._pageDictionary.get('Contents');
        ref = contents[0];
        parsedRef = parsedContents[0];
        parsedStream = parsedPageThree._crossReference._fetch(parsedRef);
        stream = pageTwo._crossReference._fetch(ref);
        parserBefore = new _ContentParser(stream.getBytes());
        parserAfter = new _ContentParser(parsedStream.getBytes());
        resultBefore = parserBefore._readContent();
        resultAfter = parserAfter._readContent();
        expect(resultAfter).toEqual(resultBefore);
        //content level check
        for (let i = 0; i < resultBefore.length; i++) {
            expect(resultBefore[i]).toEqual(resultAfter[i]);
        }
        // Destroy the document instance.
        pdf.destroy();
        parsed.destroy();
    });
    it('Watermark - Without Image', () => {
        const pdfBytes = watermark;
        // Load the existing PDF
        const pdf = new PdfDocument(pdfBytes);
        // Setup watermark text font and size that fits into a max width
        const maxWidth = 600;
        let stampText = 'Created using Syncfusion PDF library';
        let transparency = 0.25;
        let font = pdf.embedFont(PdfFontFamily.helvetica, 36, PdfFontStyle.regular);
        let textSize = font.measureString(stampText);
        while (textSize.width > maxWidth && font.size > 6) {
            font = pdf.embedFont(PdfFontFamily.helvetica, font.size - 1, PdfFontStyle.regular);
            textSize = font.measureString(stampText);
        }
        const pageCount = pdf.pageCount || 0;
        // Draw text watermark
        if (stampText && stampText.trim()) {
            for (let i = 0; i < pageCount; i++) {
                const page = pdf.getPage(i);
                const g = page.graphics;
                g.save();
                g.setTransparency(transparency);
                const width = g.clientSize.width;
                const height = g.clientSize.height;
                g.translateTransform({ x: width / 2, y: height / 2 });
                g.rotateTransform(-45);
                const brush = new PdfBrush({ r: 255, g: 0, b: 0 });
                g.drawString(
                    stampText,
                    font,
                    { x: -(textSize.width / 2), y: -(textSize.height / 2), width, height },
                    brush
                );
                g.restore();
            }
        }
        // Save and download
        const bytes = pdf.save();
        // Destory the document
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        expect(pageCount).toEqual(parsed.pageCount);
        for (let index = 0; index < pageCount; index++) {
            const parsedPage: PdfPage = parsed.getPage(0);
            const contents = parsedPage._pageDictionary.get('Contents');
            const ref = contents[3];
            const stream = parsedPage._crossReference._fetch(ref);
            let parser: _ContentParser = new _ContentParser(stream.getBytes());
            let result: _PdfRecord[] = parser._readContent();
            expect(result[0]._operator).toEqual('q');
            expect(result[0]._operands).toEqual([]);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
            expect(result[2]._operator).toEqual('q');
            expect(result[2]._operands).toEqual([]);
            expect(result[3]._operator).toEqual('gs');
            expect(result[4]._operator).toEqual('cm');
            expect(result[4]._operands).toEqual(['1.00', '.00', '.00', '1.00', '306.00', '-396.00']);
            expect(result[5]._operator).toEqual('cm');
            expect(result[5]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
            expect(result[6]._operator).toEqual('BT');
            expect(result[6]._operands).toEqual([]);
            expect(result[7]._operator).toEqual('CS');
            expect(result[7]._operands).toEqual(['/DeviceRGB']);
            expect(result[8]._operator).toEqual('cs');
            expect(result[8]._operands).toEqual(['/DeviceRGB']);
            expect(result[9]._operator).toEqual('rg');
            expect(result[9]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[10]._operator).toEqual('Tf');
            expect(result[10]._operands[1]).toEqual('35.000');
            expect(result[11]._operator).toEqual('Tr');
            expect(result[11]._operands).toEqual(['0']);
            expect(result[12]._operator).toEqual('Tc');
            expect(result[12]._operands).toEqual(['0.000']);
            expect(result[13]._operator).toEqual('Tw');
            expect(result[13]._operands).toEqual(['0.000']);
            expect(result[14]._operator).toEqual('Tz');
            expect(result[14]._operands).toEqual(['100.000']);
            expect(result[15]._operator).toEqual('Tm');
            expect(result[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-291.76', '-12.36']);
            expect(result[16]._operator).toEqual("'");
            expect(result[16]._operands).toEqual(['(Created using Syncfusion PDF library)']);
            expect(result[17]._operator).toEqual('ET');
            expect(result[17]._operands).toEqual([]);
            expect(result[18]._operator).toEqual('Q');
            expect(result[18]._operands).toEqual([]);
        }
        parsed.destroy();
    });
    it('Watermark - With Image', () => {
        const pdfBytes = watermark;
        // Load the existing PDF
        const pdf = new PdfDocument(pdfBytes);
        // Setup watermark text font and size that fits into a max width
        const maxWidth = 600;
        let stampText = 'Created using Syncfusion PDF library';
        let transparency = 0.25;
        let font = pdf.embedFont(PdfFontFamily.helvetica, 36, PdfFontStyle.regular);
        let textSize = font.measureString(stampText);
        while (textSize.width > maxWidth && font.size > 6) {
            font = pdf.embedFont(PdfFontFamily.helvetica, font.size - 1, PdfFontStyle.regular);
            textSize = font.measureString(stampText);
        }
        const pageCount = pdf.pageCount || 0;
        // Draw text watermark
        if (stampText && stampText.trim()) {
            for (let i = 0; i < pageCount; i++) {
                const page = pdf.getPage(i);
                const g = page.graphics;
                g.save();
                g.setTransparency(transparency);
                const width = g.clientSize.width;
                const height = g.clientSize.height;
                g.translateTransform({ x: width / 2, y: height / 2 });
                g.rotateTransform(-45);
                const brush = new PdfBrush({ r: 255, g: 0, b: 0 });
                g.drawString(
                    stampText,
                    font,
                    { x: -(textSize.width / 2), y: -(textSize.height / 2), width, height },
                    brush
                );
                g.restore();
            }
        }
        // Draw image watermark
        if (pngBytes) {
            const bmp = new PdfBitmap(pngBytes);
            for (let i = 0; i < pageCount; i++) {
                const page = pdf.getPage(i);
                const g = page.graphics;
                g.setTransparency(transparency);
                const width = g.clientSize.width;
                const height = g.clientSize.height;
                g.drawImage(bmp, { x: 0, y: 0, width, height });
            }
        }
        // Save and download
        const bytes = pdf.save();
        // Destory the document
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        expect(pageCount).toEqual(parsed.pageCount);
        for (let index = 0; index < pageCount; index++) {
            const parsedPage: PdfPage = parsed.getPage(0);
            const contents = parsedPage._pageDictionary.get('Contents');
            const ref = contents[3];
            const stream = parsedPage._crossReference._fetch(ref);
            let parser: _ContentParser = new _ContentParser(stream.getBytes());
            let result: _PdfRecord[] = parser._readContent();
            const EXT_GSTATE_1 = result[19]._operands;
            const XOBJECT_REF = result[22]._operands;
            const xobject = parsedPage._pageDictionary.get('Resources').get('XObject');
            const image = xobject.get(XOBJECT_REF[0].slice(1));
            expect(image.dictionary.get('Length')).toEqual(120774);
            expect(image.dictionary.get('Subtype').name).toEqual('Image');
            expect(image.dictionary.get('Width')).toEqual(566);
            expect(image.dictionary.get('Height')).toEqual(848);
            expect(result[0]._operator).toEqual('q');
            expect(result[0]._operands).toEqual([]);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
            expect(result[2]._operator).toEqual('q');
            expect(result[2]._operands).toEqual([]);
            expect(result[3]._operator).toEqual('gs');
            expect(result[3]._operands).toEqual(EXT_GSTATE_1);
            expect(result[4]._operator).toEqual('cm');
            expect(result[4]._operands).toEqual(['1.00', '.00', '.00', '1.00', '306.00', '-396.00']);
            expect(result[5]._operator).toEqual('cm');
            expect(result[5]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
            expect(result[6]._operator).toEqual('BT');
            expect(result[6]._operands).toEqual([]);
            expect(result[7]._operator).toEqual('CS');
            expect(result[7]._operands).toEqual(['/DeviceRGB']);
            expect(result[8]._operator).toEqual('cs');
            expect(result[8]._operands).toEqual(['/DeviceRGB']);
            expect(result[9]._operator).toEqual('rg');
            expect(result[9]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[10]._operator).toEqual('Tf');
            expect(result[10]._operands[1]).toEqual('35.000');
            expect(result[11]._operator).toEqual('Tr');
            expect(result[11]._operands).toEqual(['0']);
            expect(result[12]._operator).toEqual('Tc');
            expect(result[12]._operands).toEqual(['0.000']);
            expect(result[13]._operator).toEqual('Tw');
            expect(result[13]._operands).toEqual(['0.000']);
            expect(result[14]._operator).toEqual('Tz');
            expect(result[14]._operands).toEqual(['100.000']);
            expect(result[15]._operator).toEqual('Tm');
            expect(result[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-291.76', '-12.36']);
            expect(result[16]._operator).toEqual("'");
            expect(result[16]._operands).toEqual(['(Created using Syncfusion PDF library)']);
            expect(result[17]._operator).toEqual('ET');
            expect(result[17]._operands).toEqual([]);
            expect(result[18]._operator).toEqual('Q');
            expect(result[18]._operands).toEqual([]);
            expect(result[19]._operator).toEqual('gs');
            expect(result[19]._operands).toEqual(EXT_GSTATE_1);
            expect(result[20]._operator).toEqual('q');
            expect(result[20]._operands).toEqual([]);
            expect(result[21]._operator).toEqual('cm');
            expect(result[21]._operands).toEqual(['612.00', '.00', '.00', '792.00', '.00', '-792.00']);
            expect(result[22]._operator).toEqual('Do');
            expect(result[22]._operands).toEqual(XOBJECT_REF);
            expect(result[23]._operator).toEqual('Q');
            expect(result[23]._operands).toEqual([]);
        }
        parsed.destroy();
    });
});
describe('Split PDF - parameterized', () => {
    type Case = { title: string; fileChecked: boolean; fixedSize: boolean; range?: [number, number]; fileCount?: number; pagesPerFile?: number; };
    const cases: Case[] = [
        { title: 'Split PDF - fixed range [1,2]', fileChecked: false, fixedSize: false, range: [1, 2] },
        { title: 'Split PDF - file count 2', fileChecked: true, fixedSize: false, fileCount: 2 },
        { title: 'Split PDF - fixed pages per file 2', fileChecked: false, fixedSize: true, pagesPerFile: 2 }
    ];
    for (const tc of cases) {
        it(tc.title, () => {
            const bytes = template;
            const source = new PdfDocument(bytes);
            const total = source.pageCount || 0;
            expect(total).toBeGreaterThan(0);
            const partsBytes: Uint8Array[] = [];
            (source as any).splitEvent = (_sender: unknown, args: { index: number; pdfData: Uint8Array }) => {
                const part = new PdfDocument(args.pdfData);
                const b = part.save();
                part.destroy();
                partsBytes[args.index] = b;
            };
            let expectedRanges: Array<[number, number]> = [];
            if (tc.fixedSize) {
                const per = Math.max(1, tc.pagesPerFile || 1);
                expectedRanges = buildRangesForFixedNumber(total, per);
                source.splitByFixedNumber(per);
            } else if (tc.fileChecked) {
                const n = Math.max(1, tc.fileCount || 2);
                expectedRanges = buildRangesForFileCount(total, n);
                source.splitByPageRanges(expectedRanges);
            } else {
                const r = tc.range || [0, 0];
                if (total <= r[1]) { source.destroy(); throw new Error(`Template needs at least ${r[1] + 1} pages`); }
                expectedRanges = [[r[0], r[1]]];
                source.splitByPageRanges(expectedRanges);
            }
            expect(partsBytes.length).toEqual(expectedRanges.length);
            const saved = source.save();
            source.destroy();
            const reloaded = new PdfDocument(saved);
            try {
                for (let partIndex = 0; partIndex < expectedRanges.length; partIndex++) {
                    const [start, end] = expectedRanges[partIndex];
                    const parsedPart = new PdfDocument(partsBytes[partIndex]);
                    try {
                        expect(parsedPart.pageCount).toEqual(end - start + 1);
                        for (let p = 0; p < parsedPart.pageCount; p++) {
                            const srcPageIndex = start + p;
                            const beforeOps = getOperators(reloaded, srcPageIndex);
                            const afterOps = getOperators(parsedPart, p);
                            expect(afterOps.length).toEqual(beforeOps.length);
                            for (let i = 0; i < beforeOps.length; i++) {
                                expect(afterOps[i]).toEqual(beforeOps[i]);
                            }
                        }
                    } finally {
                        parsedPart.destroy();
                    }
                }
            } finally {
                reloaded.destroy();
            }
        });
    }
    function buildRangesForFileCount(totalPages: number, numberOfFiles: number): Array<[number, number]> {
        const ranges: Array<[number, number]> = [];
        const per = Math.ceil(totalPages / Math.max(1, numberOfFiles));
        let start = 0;
        while (start < totalPages) {
            const end = Math.min(start + per - 1, totalPages - 1);
            ranges.push([start, end]);
            start = end + 1;
        }
        return ranges;
    }
    function buildRangesForFixedNumber(totalPages: number, per: number): Array<[number, number]> {
        const ranges: Array<[number, number]> = [];
        let start = 0;
        while (start < totalPages) {
            const end = Math.min(start + per - 1, totalPages - 1);
            ranges.push([start, end]);
            start = end + 1;
        }
        return ranges;
    }
    function getOperators(doc: PdfDocument, pageIndex: number): string[] {
        const page = doc.getPage(pageIndex) as any;
        const contents = page._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = page._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const records: _PdfRecord[] = parser._readContent();
        return records.map(r => r._operator);
    }
});