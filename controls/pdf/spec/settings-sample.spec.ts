import { _ContentParser, _PdfRecord } from "./../src/pdf/core/content-parser";
import { PdfPageOrientation, PdfRotationAngle } from "./../src/pdf/core/enumerator";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont } from "./../src/pdf/core/fonts/pdf-standard-font";
import { PdfBrush, PdfGraphics, PdfPen } from "./../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument, PdfMargins, PdfPageSettings } from "./../src/pdf/core/pdf-document";
import { PdfPage } from "./../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName } from "./../src/pdf/core/pdf-primitives";

describe('Settings', () => {
    it('Document', () => {
        // Create a new PDF document
        const pdf = new PdfDocument();
        // Set document information
        const now = new Date();
        pdf.setDocumentInformation({
            author: 'Syncfusion',
            creationDate: now,
            modificationDate: now,
            creator: 'Essential PDF',
            keywords: 'PDF',
            subject: 'Document information DEMO',
            title: 'Syncfusion JavaScript PDF Library Example',
            producer: 'Syncfusion PDF'
        });
        // Add a page and draw text
        const page = pdf.addPage();
        const g = page.graphics;
        const boldFont = pdf.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
        const regularFont = pdf.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        const black = new PdfBrush({ r: 0, g: 0, b: 0 });
        g.drawString('Document Properties', boldFont, { x: 10, y: 10, width: 520, height: 20 }, black);
        const formattedDate = now.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        let y = 50;
        const line = (text: string) => {
            g.drawString(text, regularFont, { x: 10, y, width: 520, height: 16 }, black);
            y += 20;
        };
        line('Title: Syncfusion JavaScript PDF Library Example');
        line('Author: Syncfusion');
        line('Subject: Document information DEMO');
        line('Keywords: PDF');
        line('Created: ' + formattedDate);
        line('Modified: ' + formattedDate);
        line('Application: Essential PDF');
        // Save and downlaod hte document
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Font check
        const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        const HelveticaRef: string = result[21]._operands[0];
        const Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        const HelveticaBoldRef: string = result[11]._operands[0];
        const HelveticaBold: _PdfName = fontDictionary.get(HelveticaBoldRef.slice(1)).get('BaseFont');
        expect(Helvetica.name).toEqual('Helvetica');
        expect(HelveticaBold.name).toEqual('Helvetica-Bold');
        //Content level check
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[11]._operands[0]).toEqual(HelveticaBoldRef);
        expect(result[11]._operands[1]).toEqual('12.000');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-21.54']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(Document Properties)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands.length).toBe(0);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[21]._operands[0]).toEqual(HelveticaRef);
        expect(result[21]._operands[1]).toEqual('10.000');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-59.31']);
        expect(result[23]._operator).toEqual("'");
        expect(result[23]._operands).toEqual(['(Title: Syncfusion JavaScript PDF Library Example)']);
        expect(result[24]._operator).toEqual('ET');
        expect(result[24]._operands.length).toBe(0);
        expect(result[25]._operator).toEqual('BT');
        expect(result[25]._operands.length).toBe(0);
        expect(result[26]._operator).toEqual('rg');
        expect(result[26]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[27]._operator).toEqual('Tf');
        expect(result[27]._operands[0]).toEqual(HelveticaRef);
        expect(result[27]._operands[1]).toEqual('10.000');
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-79.31']);
        expect(result[29]._operator).toEqual("'");
        expect(result[29]._operands).toEqual(['(Author: Syncfusion)']);
        expect(result[30]._operator).toEqual('ET');
        expect(result[30]._operands.length).toBe(0);
        expect(result[31]._operator).toEqual('BT');
        expect(result[31]._operands.length).toBe(0);
        expect(result[32]._operator).toEqual('rg');
        expect(result[32]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[33]._operator).toEqual('Tf');
        expect(result[33]._operands[0]).toEqual(HelveticaRef);
        expect(result[33]._operands[1]).toEqual('10.000');
        expect(result[34]._operator).toEqual('Tm');
        expect(result[34]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-99.31']);
        expect(result[35]._operator).toEqual("'");
        expect(result[35]._operands).toEqual(['(Subject: Document information DEMO)']);
        expect(result[36]._operator).toEqual('ET');
        expect(result[36]._operands.length).toBe(0);
        expect(result[37]._operator).toEqual('BT');
        expect(result[37]._operands.length).toBe(0);
        expect(result[38]._operator).toEqual('rg');
        expect(result[38]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[39]._operator).toEqual('Tf');
        expect(result[39]._operands[0]).toEqual(HelveticaRef);
        expect(result[39]._operands[1]).toEqual('10.000');
        expect(result[40]._operator).toEqual('Tm');
        expect(result[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-119.31']);
        expect(result[41]._operator).toEqual("'");
        expect(result[41]._operands).toEqual(['(Keywords: PDF)']);
        expect(result[42]._operator).toEqual('ET');
        expect(result[42]._operands.length).toBe(0);
        expect(result[43]._operator).toEqual('BT');
        expect(result[43]._operands.length).toBe(0);
        expect(result[44]._operator).toEqual('rg');
        expect(result[44]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[45]._operator).toEqual('Tf');
        expect(result[45]._operands[0]).toEqual(HelveticaRef);
        expect(result[45]._operands[1]).toEqual('10.000');
        expect(result[46]._operator).toEqual('Tm');
        expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-139.31']);
        expect(result[47]._operator).toEqual("'");
        expect(result[47]._operands).toEqual([`(Created: ${formattedDate})`]);
        expect(result[48]._operator).toEqual('ET');
        expect(result[48]._operands.length).toBe(0);
        expect(result[49]._operator).toEqual('BT');
        expect(result[49]._operands.length).toBe(0);
        expect(result[50]._operator).toEqual('rg');
        expect(result[50]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[51]._operator).toEqual('Tf');
        expect(result[51]._operands[0]).toEqual(HelveticaRef);
        expect(result[51]._operands[1]).toEqual('10.000');
        expect(result[52]._operator).toEqual('Tm');
        expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-159.31']);
        expect(result[53]._operator).toEqual("'");
        expect(result[53]._operands).toEqual([`(Modified: ${formattedDate})`]);
        expect(result[54]._operator).toEqual('ET');
        expect(result[54]._operands.length).toBe(0);
        expect(result[55]._operator).toEqual('BT');
        expect(result[55]._operands.length).toBe(0);
        expect(result[56]._operator).toEqual('rg');
        expect(result[56]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[57]._operator).toEqual('Tf');
        expect(result[57]._operands[0]).toEqual(HelveticaRef);
        expect(result[57]._operands[1]).toEqual('10.000');
        expect(result[58]._operator).toEqual('Tm');
        expect(result[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-179.31']);
        expect(result[59]._operator).toEqual("'");
        expect(result[59]._operands).toEqual(['(Application: Essential PDF)']);
        expect(result[60]._operator).toEqual('ET');
        expect(result[60]._operands.length).toBe(0);
        //Info Check
        const pdfDocumentInformation = parsed.getDocumentInformation();
        expect(pdfDocumentInformation.author).toEqual('Syncfusion');
        expect(pdfDocumentInformation.creator).toEqual('Essential PDF');
        expect(pdfDocumentInformation.keywords).toEqual('PDF');
        expect(pdfDocumentInformation.creationDate.getDate()).toEqual(now.getDate());
        expect(pdfDocumentInformation.modificationDate.getDate()).toEqual(now.getDate());
        expect(pdfDocumentInformation.subject).toEqual('Document information DEMO');
        expect(pdfDocumentInformation.title).toEqual('Syncfusion JavaScript PDF Library Example');
        expect(pdfDocumentInformation.producer).toEqual('Syncfusion PDF');
        parsed.destroy();
    });
    it('Layers', () => {
        const doc = new PdfDocument();
        // Create page settings
        let settings = new PdfPageSettings();
        settings.size = { width: 350, height: 300 };
        settings.margins = new PdfMargins(0);
        const page: PdfPage = doc.addPage(settings);
        // Heading
        const font = new PdfStandardFont(PdfFontFamily.helvetica, 16);
        const darkBlueBrush = new PdfBrush({ r: 0, g: 0, b: 139 });
        page.graphics.drawString('Layers', font, { x: 150, y: 10, width: 100, height: 100 }, darkBlueBrush);
        // ---------- Layer 1 ----------
        const layer1 = doc.layers.add('Layer1');
        const g1: PdfGraphics = layer1.createGraphics(page);
        g1.translateTransform({ x: 100, y: 60 });
        const rect = { x: 0, y: 0, width: 50, height: 50 };
        let pen = new PdfPen({ r: 255, g: 0, b: 0 }, 50);
        // drawArc using pen
        g1.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 0, g: 0, b: 255 }, 30);
        g1.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 255, g: 255, b: 0 }, 20);
        g1.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 0, g: 128, b: 0 }, 10);
        g1.drawArc(rect, 360, 360, pen);
        // ---------- Layer 2 ----------
        const layer2 = doc.layers.add('Layer2');
        const g2: PdfGraphics = layer2.createGraphics(page);
        g2.translateTransform({ x: 100, y: 180 });
        pen = new PdfPen({ r: 255, g: 0, b: 0 }, 50);
        g2.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 0, g: 0, b: 255 }, 30);
        g2.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 255, g: 255, b: 0 }, 20);
        g2.drawArc(rect, 360, 360, pen);
        pen = new PdfPen({ r: 0, g: 128, b: 0 }, 10);
        g2.drawArc(rect, 360, 360, pen);
        // ---------- Layer 3 ----------
        const layer3 = doc.layers.add('Layer3');
        const g3: PdfGraphics = layer3.createGraphics(page);
        g3.translateTransform({ x: 160, y: 120 });
        pen = new PdfPen({ r: 255, g: 0, b: 0 }, 50);
        g3.drawArc(rect, -60, 60, pen);
        pen = new PdfPen({ r: 0, g: 0, b: 255 }, 30);
        g3.drawArc(rect, -60, 60, pen);
        pen = new PdfPen({ r: 255, g: 255, b: 0 }, 20);
        g3.drawArc(rect, -60, 60, pen);
        pen = new PdfPen({ r: 0, g: 128, b: 0 }, 10);
        g3.drawArc(rect, -60, 60, pen);
        const bytes = doc.save();
        doc.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        let parsedPage: PdfPage = parsed.getPage(0);
        let contents = parsedPage._pageDictionary.get('Contents');
        const properties = parsedPage._pageDictionary.get('Resources').get('Properties');
        let ref = contents[5];
        let stream = parsedPage._crossReference._fetch(ref);
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '300.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['0.000', '0.000', '350.000', '-300.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[4]._operator).toEqual('W');
        expect(result[5]._operator).toEqual('n');
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.545']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '150.00', '-24.90']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(Layers)']);
        expect(result[18]._operator).toEqual('ET');
        ref = contents[9];
        stream = parsedPage._crossReference._fetch(ref);
        parser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        const oc2Ref = result[8]._operands[1];
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '300.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['0.000', '0.000', '350.000', '-300.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
        expect(result[7]._operator).toEqual('cm');
        expect(result[7]._operands).toEqual(['1.00', '.00', '.00', '1.00', '100.00', '-180.00']);
        expect(result[8]._operator).toEqual('BDC');
        expect(result[8]._operands[0]).toEqual('/OC');
        expect(result[8]._operands[1]).toEqual(oc2Ref);
        expect(result[9]._operator).toEqual('CS');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('cs');
        expect(result[10]._operands).toEqual(['/DeviceRGB']);
        expect(result[11]._operator).toEqual('d');
        expect(result[12]._operator).toEqual('w');
        expect(result[12]._operands).toEqual(['50.000']);
        expect(result[13]._operator).toEqual('j');
        expect(result[13]._operands).toEqual(['0']);
        expect(result[14]._operator).toEqual('J');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('RG');
        expect(result[15]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[16]._operator).toEqual('m');
        expect(result[16]._operands).toEqual(['50.000', '-25.000']);
        expect(result[17]._operator).toEqual('c');
        expect(result[17]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[19]._operator).toEqual('c');
        expect(result[19]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[20]._operator).toEqual('c');
        expect(result[20]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[21]._operator).toEqual('S');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('EMC');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('BDC');
        expect(result[23]._operands[0]).toEqual('/OC');
        expect(result[23]._operands[1]).toEqual(oc2Ref);
        expect(result[24]._operator).toEqual('d');
        expect(result[25]._operator).toEqual('w');
        expect(result[25]._operands).toEqual(['30.000']);
        expect(result[26]._operator).toEqual('j');
        expect(result[26]._operands).toEqual(['0']);
        expect(result[27]._operator).toEqual('J');
        expect(result[27]._operands).toEqual(['0']);
        expect(result[28]._operator).toEqual('RG');
        expect(result[28]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[29]._operator).toEqual('m');
        expect(result[29]._operands).toEqual(['50.000', '-25.000']);
        expect(result[30]._operator).toEqual('c');
        expect(result[30]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[31]._operator).toEqual('c');
        expect(result[31]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[32]._operator).toEqual('c');
        expect(result[32]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[33]._operator).toEqual('c');
        expect(result[33]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[34]._operator).toEqual('S');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('EMC');
        expect(result[35]._operands.length).toBe(0);
        expect(result[36]._operator).toEqual('BDC');
        expect(result[36]._operands[0]).toEqual('/OC');
        expect(result[36]._operands[1]).toEqual(oc2Ref);
        expect(result[37]._operator).toEqual('d');
        expect(result[38]._operator).toEqual('w');
        expect(result[38]._operands).toEqual(['20.000']);
        expect(result[39]._operator).toEqual('j');
        expect(result[39]._operands).toEqual(['0']);
        expect(result[40]._operator).toEqual('J');
        expect(result[40]._operands).toEqual(['0']);
        expect(result[41]._operator).toEqual('RG');
        expect(result[41]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[42]._operator).toEqual('m');
        expect(result[42]._operands).toEqual(['50.000', '-25.000']);
        expect(result[43]._operator).toEqual('c');
        expect(result[43]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[44]._operator).toEqual('c');
        expect(result[44]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[45]._operator).toEqual('c');
        expect(result[45]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[46]._operator).toEqual('c');
        expect(result[46]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[47]._operator).toEqual('S');
        expect(result[47]._operands.length).toBe(0);
        expect(result[48]._operator).toEqual('EMC');
        expect(result[48]._operands.length).toBe(0);
        expect(result[49]._operator).toEqual('BDC');
        expect(result[49]._operands[0]).toEqual('/OC');
        expect(result[49]._operands[1]).toEqual(oc2Ref);
        expect(result[50]._operator).toEqual('d');
        expect(result[51]._operator).toEqual('w');
        expect(result[51]._operands).toEqual(['10.000']);
        expect(result[52]._operator).toEqual('j');
        expect(result[52]._operands).toEqual(['0']);
        expect(result[53]._operator).toEqual('J');
        expect(result[53]._operands).toEqual(['0']);
        expect(result[54]._operator).toEqual('RG');
        expect(result[54]._operands).toEqual(['0.000', '0.502', '0.000']);
        expect(result[55]._operator).toEqual('m');
        expect(result[55]._operands).toEqual(['50.000', '-25.000']);
        expect(result[56]._operator).toEqual('c');
        expect(result[56]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[57]._operator).toEqual('c');
        expect(result[57]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[58]._operator).toEqual('c');
        expect(result[58]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[59]._operator).toEqual('c');
        expect(result[59]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[60]._operator).toEqual('S');
        expect(result[60]._operands.length).toBe(0);
        expect(result[61]._operator).toEqual('EMC');
        expect(result[61]._operands.length).toBe(0);
        ref = contents[7];
        stream = parsedPage._crossReference._fetch(ref);
        parser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        const oc1Ref = result[8]._operands[1];
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '300.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['0.000', '0.000', '350.000', '-300.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
        expect(result[7]._operator).toEqual('cm');
        expect(result[7]._operands).toEqual(['1.00', '.00', '.00', '1.00', '100.00', '-60.00']);
        expect(result[8]._operator).toEqual('BDC');
        expect(result[8]._operands[0]).toEqual('/OC');
        expect(result[8]._operands[1]).toEqual(oc1Ref);
        expect(result[9]._operator).toEqual('CS');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('cs');
        expect(result[10]._operands).toEqual(['/DeviceRGB']);
        expect(result[11]._operator).toEqual('d');
        expect(result[12]._operator).toEqual('w');
        expect(result[12]._operands).toEqual(['50.000']);
        expect(result[13]._operator).toEqual('j');
        expect(result[13]._operands).toEqual(['0']);
        expect(result[14]._operator).toEqual('J');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('RG');
        expect(result[15]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[16]._operator).toEqual('m');
        expect(result[16]._operands).toEqual(['50.000', '-25.000']);
        expect(result[17]._operator).toEqual('c');
        expect(result[17]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[19]._operator).toEqual('c');
        expect(result[19]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[20]._operator).toEqual('c');
        expect(result[20]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[21]._operator).toEqual('S');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('EMC');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('BDC');
        expect(result[23]._operands[0]).toEqual('/OC');
        expect(result[23]._operands[1]).toEqual(oc1Ref);
        expect(result[24]._operator).toEqual('d');
        expect(result[25]._operator).toEqual('w');
        expect(result[25]._operands).toEqual(['30.000']);
        expect(result[26]._operator).toEqual('j');
        expect(result[26]._operands).toEqual(['0']);
        expect(result[27]._operator).toEqual('J');
        expect(result[27]._operands).toEqual(['0']);
        expect(result[28]._operator).toEqual('RG');
        expect(result[28]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[29]._operator).toEqual('m');
        expect(result[29]._operands).toEqual(['50.000', '-25.000']);
        expect(result[30]._operator).toEqual('c');
        expect(result[30]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[31]._operator).toEqual('c');
        expect(result[31]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[32]._operator).toEqual('c');
        expect(result[32]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[33]._operator).toEqual('c');
        expect(result[33]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[34]._operator).toEqual('S');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('EMC');
        expect(result[35]._operands.length).toBe(0);
        expect(result[36]._operator).toEqual('BDC');
        expect(result[36]._operands[0]).toEqual('/OC');
        expect(result[36]._operands[1]).toEqual(oc1Ref);
        expect(result[37]._operator).toEqual('d');
        expect(result[38]._operator).toEqual('w');
        expect(result[38]._operands).toEqual(['20.000']);
        expect(result[39]._operator).toEqual('j');
        expect(result[39]._operands).toEqual(['0']);
        expect(result[40]._operator).toEqual('J');
        expect(result[40]._operands).toEqual(['0']);
        expect(result[41]._operator).toEqual('RG');
        expect(result[41]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[42]._operator).toEqual('m');
        expect(result[42]._operands).toEqual(['50.000', '-25.000']);
        expect(result[43]._operator).toEqual('c');
        expect(result[43]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[44]._operator).toEqual('c');
        expect(result[44]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[45]._operator).toEqual('c');
        expect(result[45]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[46]._operator).toEqual('c');
        expect(result[46]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[47]._operator).toEqual('S');
        expect(result[47]._operands.length).toBe(0);
        expect(result[48]._operator).toEqual('EMC');
        expect(result[48]._operands.length).toBe(0);
        expect(result[49]._operator).toEqual('BDC');
        expect(result[49]._operands[0]).toEqual('/OC');
        expect(result[49]._operands[1]).toEqual(oc1Ref);
        expect(result[50]._operator).toEqual('d');
        expect(result[51]._operator).toEqual('w');
        expect(result[51]._operands).toEqual(['10.000']);
        expect(result[52]._operator).toEqual('j');
        expect(result[52]._operands).toEqual(['0']);
        expect(result[53]._operator).toEqual('J');
        expect(result[53]._operands).toEqual(['0']);
        expect(result[54]._operator).toEqual('RG');
        expect(result[54]._operands).toEqual(['0.000', '0.502', '0.000']);
        expect(result[55]._operator).toEqual('m');
        expect(result[55]._operands).toEqual(['50.000', '-25.000']);
        expect(result[56]._operator).toEqual('c');
        expect(result[56]._operands).toEqual(['50.000', '-38.807', '38.807', '-50.000', '25.000', '-50.000']);
        expect(result[57]._operator).toEqual('c');
        expect(result[57]._operands).toEqual(['11.193', '-50.000', '0.000', '-38.807', '0.000', '-25.000']);
        expect(result[58]._operator).toEqual('c');
        expect(result[58]._operands).toEqual(['-0.000', '-11.193', '11.193', '-0.000', '25.000', '0.000']);
        expect(result[59]._operator).toEqual('c');
        expect(result[59]._operands).toEqual(['38.807', '0.000', '50.000', '-11.193', '50.000', '-25.000']);
        expect(result[60]._operator).toEqual('S');
        expect(result[60]._operands.length).toBe(0);
        expect(result[61]._operator).toEqual('EMC');
        expect(result[61]._operands.length).toBe(0);
        ref = contents[11];
        stream = parsedPage._crossReference._fetch(ref);
        parser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        const oc3Ref = result[8]._operands[1];
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '300.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['0.000', '0.000', '350.000', '-300.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
        expect(result[7]._operator).toEqual('cm');
        expect(result[7]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-120.00']);
        expect(result[8]._operator).toEqual('BDC');
        expect(result[8]._operands[0]).toEqual('/OC');
        expect(result[8]._operands[1]).toEqual(oc3Ref);
        expect(result[9]._operator).toEqual('CS');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('cs');
        expect(result[10]._operands).toEqual(['/DeviceRGB']);
        expect(result[11]._operator).toEqual('d');
        expect(result[12]._operator).toEqual('w');
        expect(result[12]._operands).toEqual(['50.000']);
        expect(result[13]._operator).toEqual('j');
        expect(result[13]._operands).toEqual(['0']);
        expect(result[14]._operator).toEqual('J');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('RG');
        expect(result[15]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[16]._operator).toEqual('m');
        expect(result[16]._operands).toEqual(['37.500', '-3.349']);
        expect(result[17]._operator).toEqual('c');
        expect(result[17]._operands).toEqual(['45.235', '-7.815', '50.000', '-16.068', '50.000', '-25.000']);
        expect(result[18]._operator).toEqual('S');
        expect(result[18]._operands.length).toBe(0);
        expect(result[19]._operator).toEqual('EMC');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('BDC');
        expect(result[20]._operands[0]).toEqual('/OC');
        expect(result[20]._operands[1]).toEqual(oc3Ref);
        expect(result[21]._operator).toEqual('d');
        expect(result[22]._operator).toEqual('w');
        expect(result[22]._operands).toEqual(['30.000']);
        expect(result[23]._operator).toEqual('j');
        expect(result[23]._operands).toEqual(['0']);
        expect(result[24]._operator).toEqual('J');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('RG');
        expect(result[25]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[26]._operator).toEqual('m');
        expect(result[26]._operands).toEqual(['37.500', '-3.349']);
        expect(result[27]._operator).toEqual('c');
        expect(result[27]._operands).toEqual(['45.235', '-7.815', '50.000', '-16.068', '50.000', '-25.000']);
        expect(result[28]._operator).toEqual('S');
        expect(result[28]._operands.length).toBe(0);
        expect(result[29]._operator).toEqual('EMC');
        expect(result[29]._operands.length).toBe(0);
        expect(result[30]._operator).toEqual('BDC');
        expect(result[30]._operands[0]).toEqual('/OC');
        expect(result[30]._operands[1]).toEqual(oc3Ref);
        expect(result[31]._operator).toEqual('d');
        expect(result[32]._operator).toEqual('w');
        expect(result[32]._operands).toEqual(['20.000']);
        expect(result[33]._operator).toEqual('j');
        expect(result[33]._operands).toEqual(['0']);
        expect(result[34]._operator).toEqual('J');
        expect(result[34]._operands).toEqual(['0']);
        expect(result[35]._operator).toEqual('RG');
        expect(result[35]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[36]._operator).toEqual('m');
        expect(result[36]._operands).toEqual(['37.500', '-3.349']);
        expect(result[37]._operator).toEqual('c');
        expect(result[37]._operands).toEqual(['45.235', '-7.815', '50.000', '-16.068', '50.000', '-25.000']);
        expect(result[38]._operator).toEqual('S');
        expect(result[38]._operands.length).toBe(0);
        expect(result[39]._operator).toEqual('EMC');
        expect(result[39]._operands.length).toBe(0);
        expect(result[40]._operator).toEqual('BDC');
        expect(result[40]._operands[0]).toEqual('/OC');
        expect(result[40]._operands[1]).toEqual(oc3Ref);
        expect(result[41]._operator).toEqual('d');
        expect(result[42]._operator).toEqual('w');
        expect(result[42]._operands).toEqual(['10.000']);
        expect(result[43]._operator).toEqual('j');
        expect(result[43]._operands).toEqual(['0']);
        expect(result[44]._operator).toEqual('J');
        expect(result[44]._operands).toEqual(['0']);
        expect(result[45]._operator).toEqual('RG');
        expect(result[45]._operands).toEqual(['0.000', '0.502', '0.000']);
        expect(result[46]._operator).toEqual('m');
        expect(result[46]._operands).toEqual(['37.500', '-3.349']);
        expect(result[47]._operator).toEqual('c');
        expect(result[47]._operands).toEqual(['45.235', '-7.815', '50.000', '-16.068', '50.000', '-25.000']);
        expect(result[48]._operator).toEqual('S');
        expect(result[48]._operands.length).toBe(0);
        expect(result[49]._operator).toEqual('EMC');
        expect(result[49]._operands.length).toBe(0);
        const oc1 = properties.get(oc1Ref.slice(1));
        const oc2 = properties.get(oc2Ref.slice(1));
        const oc3 = properties.get(oc3Ref.slice(1));
        expect(oc1._map.Name).toEqual('Layer1');
        expect(oc2._map.Name).toEqual('Layer2');
        expect(oc3._map.Name).toEqual('Layer3');
        expect(oc1._map.Type.name).toEqual("OCG")
        expect(oc2._map.Type.name).toEqual("OCG")
        expect(oc3._map.Type.name).toEqual("OCG")
    });
});
describe('PdfPageSettings - parameterized', () => {
    function getPageSize(name: string) {
        const PAGE_SIZES: Record<string, { width: number; height: number }> = {
            Letter: { width: 612, height: 792 },
            Legal: { width: 612, height: 1008 },
            A3: { width: 842, height: 1191 },
            A4: { width: 595, height: 842 },
            A5: { width: 420, height: 595 },
            B4: { width: 729, height: 1032 },
            B5: { width: 516, height: 729 }
        };
        return PAGE_SIZES[(name || '').trim()];
    }
    function createAndParsePdf(opts: { pageSizeName: string; orientation: PdfPageOrientation; margin?: number; }) {
        const settings = new PdfPageSettings();
        const size = getPageSize(opts.pageSizeName);
        settings.size = size;
        settings.orientation = opts.orientation;
        settings.rotation = PdfRotationAngle.angle0;
        settings.margins = opts.margin === undefined ? new PdfMargins() : new PdfMargins(opts.margin);
        const pdf = new PdfDocument();
        const pen = new PdfPen({ r: 0, g: 0, b: 0 }, 6);
        const lightGreenBrush = new PdfBrush({ r: 144, g: 238, b: 144 });
        const textBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const footerFont = pdf.embedFont(PdfFontFamily.helvetica, 16, PdfFontStyle.regular);
        const pageCount = 1;
        for (let i = 0; i < pageCount; i++) {
            const page = pdf.addPage(settings);
            const g = page.graphics;
            const client = g.clientSize;
            g.drawRectangle({ x: 0, y: 0, width: client.width, height: client.height }, lightGreenBrush);
            g.drawLine(pen, { x: 0, y: 100 }, { x: Math.min(300, client.width), y: 100 });
            const footerText = `Page ${i + 1} of ${pageCount}`;
            g.drawString(footerText, footerFont, { x: client.width - 150, y: client.height - 40, width: 140, height: 30 }, textBrush);
        }
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        const tfIndex = result.findIndex(r => r._operator === 'Tf');
        const HelveticaRef: string = result[tfIndex]._operands[0];
        const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        const Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        return { parsed, parsedPage, result, HelveticaRef, HelveticaName: Helvetica.name };
    }
    function expectCommon(result: _PdfRecord[], HelveticaName: string) {
        expect(HelveticaName).toEqual('Helvetica');
        expect(result[0]._operator).toEqual('q');
        expect(result[3]._operator).toEqual('h');
        expect(result[4]._operator).toEqual('W');
        expect(result[5]._operator).toEqual('n');
        expect(result[7]._operator).toEqual('CS');
        expect(result[7]._operands).toEqual(['/DeviceRGB']);
        expect(result[8]._operator).toEqual('cs');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('rg');
        expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
        expect(result[11]._operator).toEqual('f');
        expect(result[12]._operator).toEqual('d');
        expect(result[12]._operands).toEqual(['[]', '0']);
        expect(result[13]._operator).toEqual('w');
        expect(result[13]._operands).toEqual(['6.000']);
        expect(result[14]._operator).toEqual('j');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('J');
        expect(result[15]._operands).toEqual(['0']);
        expect(result[16]._operator).toEqual('RG');
        expect(result[16]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[17]._operator).toEqual('m');
        expect(result[17]._operands).toEqual(['0.000', '-100.000']);
        expect(result[18]._operator).toEqual('l');
        expect(result[18]._operands).toEqual(['300.000', '-100.000']);
        expect(result[19]._operator).toEqual('S');
        expect(result[20]._operator).toEqual('BT');
        expect(result[21]._operator).toEqual('rg');
        expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[22]._operator).toEqual('Tf');
        expect(result[22]._operands[1]).toEqual('16.000');
        expect(result[23]._operator).toEqual('Tr');
        expect(result[23]._operands).toEqual(['0']);
        expect(result[24]._operator).toEqual('Tc');
        expect(result[24]._operands).toEqual(['0.000']);
        expect(result[25]._operator).toEqual('Tw');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tz');
        expect(result[26]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual("'");
        expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
        expect(result[29]._operator).toEqual('ET');
    }
    type Case = { title: string; pageSizeName: string; orientation: PdfPageOrientation; margin?: number; };
    const cases: Case[] = [
        { title: 'Portrait (default margins)', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: undefined },
        { title: 'Landscape (no margin)', pageSizeName: 'Letter', orientation: PdfPageOrientation.landscape, margin: 0 },
        { title: 'Large => margin 40', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: 40 },
        { title: 'Small => margin 20', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: 20 },
        { title: 'A4 Portrait (default margins)', pageSizeName: 'A4', orientation: PdfPageOrientation.portrait, margin: undefined },
        { title: 'A4 Landscape (margin 30)', pageSizeName: 'A4', orientation: PdfPageOrientation.landscape, margin: 30 },
        { title: 'A5 Portrait (no margin)', pageSizeName: 'A5', orientation: PdfPageOrientation.portrait, margin: 0 },
        { title: 'Legal Landscape (default margins)', pageSizeName: 'Legal', orientation: PdfPageOrientation.landscape, margin: undefined },
        { title: 'B5 Landscape (margin 20)', pageSizeName: 'B5', orientation: PdfPageOrientation.landscape, margin: 20 },
        { title: 'A3 Portrait (margin 60)', pageSizeName: 'A3', orientation: PdfPageOrientation.portrait, margin: 60 }
    ];
    for (const tc of cases) {
        it(tc.title, () => {
            const { parsed, parsedPage, result, HelveticaRef, HelveticaName } = createAndParsePdf(tc);
            const rawSize = getPageSize(tc.pageSizeName);
            const pageW = tc.orientation === PdfPageOrientation.portrait ? rawSize.width : rawSize.height;
            const pageH = tc.orientation === PdfPageOrientation.portrait ? rawSize.height : rawSize.width;
            expect(parsedPage.mediaBox).toEqual([0, 0, pageW, pageH]);
            expectCommon(result, HelveticaName);
            expect(result[22]._operands[0]).toEqual(HelveticaRef);
            switch (tc.title) {
                case 'Portrait (default margins)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '532.000', '-712.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '532.000', '-712.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '382.00', '-686.90']);
                    break;
                }
                case 'Landscape (no margin)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '612.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['0.000', '0.000', '792.000', '-612.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '792.000', '-612.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '642.00', '-586.90']);
                    break;
                }
                case 'Large => margin 40': {
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '532.000', '-712.000']);
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '532.000', '-712.000']);
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '382.00', '-686.90']);
                    break;
                }
                case 'Small => margin 20': {
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['20.000', '-20.000', '572.000', '-752.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '20.00', '-20.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '572.000', '-752.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '422.00', '-726.90']);
                    break;
                }
                case 'A4 Portrait (default margins)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '515.000', '-762.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '365.00', '-736.90']);
                    break;
                }
                case 'A4 Landscape (margin 30)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '595.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['30.000', '-30.000', '782.000', '-535.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-30.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '782.000', '-535.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '632.00', '-509.90']);
                    break;
                }
                case 'A5 Portrait (no margin)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '595.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['0.000', '0.000', '420.000', '-595.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '420.000', '-595.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '270.00', '-569.90']);
                    break;
                }
                case 'Legal Landscape (default margins)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '612.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '928.000', '-532.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '928.000', '-532.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '778.00', '-506.90']);
                    break;
                }
                case 'B5 Landscape (margin 20)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '516.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['20.000', '-20.000', '689.000', '-476.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '20.00', '-20.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '689.000', '-476.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '539.00', '-450.90']);
                    break;
                }
                case 'A3 Portrait (margin 60)': {
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '1191.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['60.000', '-60.000', '722.000', '-1071.000']);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-60.00']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '722.000', '-1071.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '572.00', '-1045.90']);
                    break;
                }
                default:
                    throw new Error(`Missing switch expectations for: ${tc.title}`);
            }
            parsed.destroy();
        });
    }
});
