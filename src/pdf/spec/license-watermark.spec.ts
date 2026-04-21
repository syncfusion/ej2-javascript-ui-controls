import { PdfListFieldItem, PdfTextWebLinkAnnotation } from './../src/pdf/core/annotations/annotation';
import { _ContentParser, _PdfRecord } from './../src/pdf/core/content-parser';
import { _SignatureFlag, CryptographicStandard, DigestAlgorithm, PdfPageOrientation, PdfRotationAngle, PdfUnorderedListStyle } from './../src/pdf/core/enumerator';
import { PdfFont, PdfFontFamily, PdfFontStyle } from './../src/pdf/core/fonts/pdf-standard-font';
import { _PdfReader } from './../src/pdf/core/graphics/images/jbig2-image';
import { PdfBrush, PdfGraphics, PdfPen } from './../src/pdf/core/graphics/pdf-graphics';
import { PdfDocument, PdfMargins, PdfPageSettings } from './../src/pdf/core/pdf-document';
import { PdfDestination, PdfPage } from './../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './../src/pdf/core/pdf-primitives';
import { _PdfFlateStream } from './../src/pdf/core/flate-stream';
import { _PdfStream } from './../src/pdf/core/base-stream';
import { PdfStandardFont } from './../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat } from '../src/pdf/core/fonts/pdf-string-format';
import { _stringToBytes } from "./../src/pdf/core/utils";
import { PdfTextAlignment, PdfTextDirection } from "./../src/pdf/core/enumerator";
import { PdfTrueTypeFont } from "./../src/pdf/core/fonts/pdf-standard-font";
import { PdfOrderedList, PdfUnorderedList } from "./../src/pdf/core/list/pdf-list";
import { PdfListItem, PdfListItemCollection } from "./../src/pdf/core/list/pdf-list-item";
import { arabicBytes, hebrewBytes } from "./font-input.spec";
import { PdfPageImportOptions } from './../src/pdf/core/pdf-page-import-options';
import { creditCard, formPDF, PDfpfx, template, watermark } from './inputs.spec';
import { cover, logo } from "./image-input.spec";
import { PdfBitmap } from "./../src/pdf/core/graphics/images/pdf-bitmap";
import { PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfRadioButtonListField, PdfSignatureField, PdfTextBoxField } from './../src/pdf/core/form/field';
import { PdfForm } from '../src/pdf/core/form/form';
import { PdfSignature } from './../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { PdfBookmark, PdfBookmarkBase } from './../src/pdf/core/pdf-outline';
describe('1003529 - License validation', () => {
    it('default-sample-watermark', () => {
        function drawHeaderPoint(g: PdfGraphics, text: string, y: number, bulletFont: PdfFont, bodyFont: PdfFont, white: PdfBrush, violet: PdfBrush) {
            g.drawString('l', bulletFont, { x: 220, y: y, width: 100, height: 100 }, violet);
            g.drawString(text, bodyFont, { x: 240, y: y, width: 400, height: 100 }, white);
            return y + 15;
        }
        function drawBodyContent(g: PdfGraphics, text: string, y: number, bulletBodyFont: PdfFont, bodyContentFont: PdfFont, white: PdfBrush, violet: PdfBrush) {
            g.drawString('3', bulletBodyFont, { x: 35, y: y, width: 100, height: 100 }, violet);
            g.drawString(text, bodyContentFont, { x: 60, y: y, width: 500, height: 100 }, white);
            return y + 25;
        }
        let pdf: PdfDocument = new PdfDocument();
        let settings: PdfPageSettings = new PdfPageSettings({ margins: new PdfMargins(0) });
        let page: PdfPage = pdf.addPage(settings);
        let g: PdfGraphics = page.graphics;
        let gray: PdfBrush = new PdfBrush({ r: 64, g: 64, b: 64 });
        let black: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        let white: PdfBrush = new PdfBrush({ r: 255, g: 255, b: 255 });
        let violet: PdfBrush = new PdfBrush({ r: 255, g: 153, b: 255 });
        let redPen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        let violetPen: PdfPen = new PdfPen({ r: 148, g: 0, b: 211 }, 2);
        let greenPen: PdfPen = new PdfPen({ r: 0, g: 128, b: 0 }, 2);
        let bluePen: PdfPen = new PdfPen({ r: 0, g: 0, b: 255 }, 2);
        g.drawRectangle({ x: 0, y: 0, width: g.clientSize.width, height: g.clientSize.height }, gray);
        g.drawRectangle({ x: 0, y: 0, width: g.clientSize.width, height: 130 }, black);
        g.drawRectangle({ x: 0, y: 400, width: g.clientSize.width, height: g.clientSize.height - 450 }, white);
        let headerFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 35, PdfFontStyle.regular);
        g.drawString('Enterprise', headerFont, { x: 10, y: 20, width: 150, height: 200 }, violet);
        g.drawRectangle({ x: 10, y: 63, width: 140, height: 35 }, violet);
        let subHeadingFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.regular);
        g.drawString('Reporting Solutions', subHeadingFont, { x: 15, y: 70, width: 130, height: 200 }, black);
        let yPos: number = 30;
        // Header points
        let bodyFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 11, PdfFontStyle.regular);
        let bulletHeaderFont: PdfFont = pdf.embedFont(PdfFontFamily.zapfDingbats, 10, PdfFontStyle.regular);
        yPos = drawHeaderPoint(g, 'Develop cloud-ready reporting applications in as little as 20% of the time.', yPos, bulletHeaderFont, bodyFont, white, violet);
        yPos = drawHeaderPoint(g, 'Proven, reliable platform thousands of users over the past 10 years.', yPos, bulletHeaderFont, bodyFont, white, violet);
        yPos = drawHeaderPoint(g, 'Microsoft Excel, Word, Adobe PDF, RDL display and editing.', yPos, bulletHeaderFont, bodyFont, white, violet);
        yPos = drawHeaderPoint(g, 'Why start from scratch? Rely on our dependable solution frameworks', yPos, bulletHeaderFont, bodyFont, white, violet);
        // Body content
        yPos += 105;
        let bulletBodyFont: PdfFont = pdf.embedFont(PdfFontFamily.zapfDingbats, 16, PdfFontStyle.regular);
        let bodyContentFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 17, PdfFontStyle.regular);
        yPos = drawBodyContent(g, 'Deployment-ready framework tailored to your needs.', yPos, bulletBodyFont, bodyContentFont, white, violet);
        yPos = drawBodyContent(g, 'Our architects and developers have years of reporting experience.', yPos, bulletBodyFont, bodyContentFont, white, violet);
        yPos = drawBodyContent(g, 'Solutions available for web, desktop, and mobile applications.', yPos, bulletBodyFont, bodyContentFont, white, violet);
        yPos = drawBodyContent(g, 'Backed by our end-to-end product maintenance infrastructure.', yPos, bulletBodyFont, bodyContentFont, white, violet);
        yPos = drawBodyContent(g, 'The quickest path from concept to delivery.', yPos, bulletBodyFont, bodyContentFont, white, violet);
        let headerBulletsXposition: number = 45;
        yPos = 350;
        // Section 1: The Experts
        let titleFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 20, PdfFontStyle.regular);
        g.drawLine(redPen, { x: headerBulletsXposition, y: yPos + 92 }, { x: headerBulletsXposition, y: yPos + 145 });
        g.drawString('The Experts', titleFont, { x: headerBulletsXposition + 10, y: yPos + 90, width: 150, height: 200 }, black);
        g.drawLine(violetPen, { x: headerBulletsXposition + 280, y: yPos + 92 }, { x: headerBulletsXposition + 280, y: yPos + 145 });
        g.drawString('Accurate Estimates', titleFont, { x: headerBulletsXposition + 290, y: yPos + 90, width: 300, height: 200 }, black);
        g.drawString('A substantial number of .NET reporting applications use our frameworks', bodyFont, { x: headerBulletsXposition + 10, y: yPos + 115, width: 250, height: 200 }, black);
        g.drawString('Given our expertise, you can expect estimates to be accurate.', bodyFont, { x: headerBulletsXposition + 290, y: yPos + 115, width: 250, height: 200 }, black);
        // Section 2: Product Licensing
        yPos += 200;
        g.drawLine(greenPen, { x: headerBulletsXposition, y: yPos + 32 }, { x: headerBulletsXposition, y: yPos + 85 });
        g.drawString('Product Licensing', titleFont, { x: headerBulletsXposition + 10, y: yPos + 30, width: 250, height: 200 }, black);
        g.drawLine(bluePen, { x: headerBulletsXposition + 280, y: yPos + 32 }, { x: headerBulletsXposition + 280, y: yPos + 85 });
        g.drawString('About Syncfusion', titleFont, { x: headerBulletsXposition + 290, y: yPos + 30, width: 250, height: 200 }, black);
        g.drawString('Solution packages can be combined with product licensing for great cost savings.', bodyFont, { x: headerBulletsXposition + 10, y: yPos + 55, width: 250, height: 200 }, black);
        g.drawString('Syncfusion has more than 7,000 customers including large financial institutions and Fortune 100 companies.', bodyFont, { x: headerBulletsXposition + 290, y: yPos + 55, width: 250, height: 200 }, black);
        // Footer
        let footerFont: PdfFont = pdf.embedFont(PdfFontFamily.timesRoman, 8, PdfFontStyle.italic);
        g.drawString('All trademarks mentioned belong to their owners.', footerFont, { x: 10, y: g.clientSize.height - 30, width: 250, height: 200 }, white);
        let annot: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation(
            { x: g.clientSize.width - 100, y: g.clientSize.height - 30, width: 70, height: 10 },
            { r: 255, g: 255, b: 255 },
            { r: 0, g: 0, b: 0 },
            0,
            { text: 'www.syncfusion.com', font: footerFont, url: 'http://www.syncfusion.com' }
        );
        page.annotations.add(annot);
        pdf._addWatermarkText();
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        const timesRomanRegularRef: string = result[20]._operands[0];
        const zapfDingbatsRef: string = result[39]._operands[0];
        const helveticaRef = result[241]._operands[0];
        const timesRomanRegular: _PdfName = fontDictionary.get(timesRomanRegularRef.slice(1)).get('BaseFont');
        const zapfDingbats: _PdfName = fontDictionary.get(zapfDingbatsRef.slice(1)).get('BaseFont');
        const helvetica: _PdfName = fontDictionary.get(helveticaRef.slice(1)).get('BaseFont');
        //Font check
        expect(timesRomanRegular.name).toEqual('Times-Roman');
        expect(zapfDingbats.name).toEqual('ZapfDingbats');
        expect(helvetica.name).toEqual('Helvetica');
        //Watermark check
        expect(result[239]._operator).toEqual('BT');
        expect(result[239]._operands.length).toBe(0);
        expect(result[240]._operator).toEqual('rg');
        expect(result[240]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[241]._operator).toEqual('Tf');
        expect(result[241]._operands[1]).toEqual('14.000');
        expect(result[242]._operator).toEqual('Tm');
        expect(result[242]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[243]._operator).toEqual("'");
        expect(result[243]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[244]._operator).toEqual('Tm');
        expect(result[244]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[245]._operator).toEqual("'");
        expect(result[245]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[246]._operator).toEqual('ET');
        expect(result[246]._operands.length).toBe(0);
        expect(result[247]._operator).toEqual('BT');
        expect(result[247]._operands.length).toBe(0);
        expect(result[248]._operator).toEqual('rg');
        expect(result[248]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[249]._operator).toEqual('Tf');
        expect(result[250]._operator).toEqual('Tm');
        expect(result[250]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[251]._operator).toEqual("'");
        expect(result[251]._operands).toEqual(['(here)']);
        expect(result[252]._operator).toEqual('ET');
        expect(result[252]._operands.length).toBe(0);
        expect(result[253]._operator).toEqual('q');
        expect(result[253]._operands.length).toBe(0);
        expect(result[254]._operator).toEqual('q');
        expect(result[254]._operands.length).toBe(0);
        expect(result[255]._operator).toEqual('cm');
        expect(result[255]._operands).toEqual(['1.00', '.00', '.00', '1.00', '297.50', '-421.00']);
        expect(result[256]._operator).toEqual('gs');
        expect(result[257]._operator).toEqual('cm');
        expect(result[257]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[258]._operator).toEqual('BT');
        expect(result[258]._operands.length).toBe(0);
        expect(result[259]._operator).toEqual('rg');
        expect(result[259]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[260]._operator).toEqual('Tf');
        expect(result[261]._operator).toEqual('Tm');
        expect(result[261]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[262]._operator).toEqual("'");
        expect(result[262]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[263]._operator).toEqual('Td');
        expect(result[263]._operands).toEqual(['0.000', '141.442']);
        expect(result[264]._operator).toEqual('ET');
        expect(result[264]._operands.length).toBe(0);
        expect(result[265]._operator).toEqual('Q');
        expect(result[265]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('Hello World Sample', () => {
        // Create a new PDF document
        let pdf = new PdfDocument();
        // Add a new page
        let page = pdf.addPage();
        // Access graphics of the page
        let graphics = page.graphics;
        // Create a new PDF standard font
        let font = pdf.embedFont(PdfFontFamily.helvetica, 36, PdfFontStyle.regular);
        // Create a new black brush
        let brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        // Draw the text
        graphics.drawString('Hello World!!!', font, { x: 20, y: 20, width: graphics.clientSize.width - 20, height: 60 }, brush);
        // Save and download PDF
        pdf._addWatermarkText();
        const bytes = pdf.save();
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
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[21]._operands[1]).toEqual('14.000');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[23]._operator).toEqual("'");
        expect(result[23]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
        expect(result[24]._operator).toEqual('Tm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[25]._operator).toEqual("'");
        expect(result[25]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
        expect(result[26]._operator).toEqual('ET');
        expect(result[26]._operands.length).toBe(0);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands.length).toBe(0);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[29]._operands[1]).toEqual('14.000');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(here)']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('q');
        expect(result[33]._operands.length).toBe(0);
        expect(result[34]._operator).toEqual('q');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('cm');
        expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[36]._operator).toEqual('gs');
        expect(result[37]._operator).toEqual('cm');
        expect(result[37]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[38]._operator).toEqual('BT');
        expect(result[38]._operands.length).toBe(0);
        expect(result[39]._operator).toEqual('rg');
        expect(result[39]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[40]._operator).toEqual('Tf');
        expect(result[41]._operator).toEqual('Tm');
        expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[42]._operator).toEqual("'");
        expect(result[42]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[43]._operator).toEqual('Td');
        expect(result[43]._operands).toEqual(['0.000', '141.442']);
        expect(result[44]._operator).toEqual('ET');
        expect(result[44]._operands.length).toBe(0);
        expect(result[45]._operator).toEqual('Q');
        expect(result[45]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('RTL text', () => {
        const pdf: PdfDocument = new PdfDocument();
        const pageSettings = new PdfPageSettings({ margins: new PdfMargins(40) });
        const page: PdfPage = pdf.addPage(pageSettings);
        const g: PdfGraphics = page.graphics;
        // Brush and layout
        const brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const clientBounds = g.clientSize;
        // Define areas
        const rect = { x: 0, y: 0, width: clientBounds.width, height: clientBounds.height };
        const rect1 = { x: 0, y: 200, width: clientBounds.width, height: clientBounds.height - 200 };
        // Right-to-left string format with right alignment
        const format = new PdfStringFormat();
        format.textDirection = PdfTextDirection.rightToLeft;
        format.alignment = PdfTextAlignment.right;
        // Arabic text
        const arabicFont = new PdfTrueTypeFont(arabicBytes, 13);
        g.drawString(
            `سنبدأ بنظرة عامة مفاهيمية على مستند PDF بسيط. تم تصميم هذا الفصل ليكون توجيهًا مختصرًا قبل الغوص في مستند حقيقي وإنشاءه من البداية.
    يمكن تقسيم ملف PDF إلى أربعة أجزاء: الرأس والجسم والجدول الإسناد الترافقي والمقطورة. يضع الرأس الملف كملف PDF ، حيث يحدد النص المستند المرئي ، ويسرد جدول الإسناد الترافقي موقع كل شيء في الملف ، ويوفر المقطع الدعائي تعليمات حول كيفية بدء قراءة الملف.
    رأس الصفحة هو ببساطة رقم إصدار PDF وتسلسل عشوائي للبيانات الثنائية. البيانات الثنائية تمنع التطبيقات الساذجة من معالجة ملف PDF كملف نصي. سيؤدي ذلك إلى ملف تالف ، لأن ملف PDF يتكون عادةً من نص عادي وبيانات ثنائية (على سبيل المثال ، يمكن تضمين ملف خط ثنائي بشكل مباشر في ملف PDF).`,
            arabicFont,
            rect,
            brush,
            format
        );
        // Hebrew text
        const hebrewFont = new PdfTrueTypeFont(hebrewBytes, 13);
        g.drawString(
            `לאחר הכותרת והגוף מגיע טבלת הפניה המקושרת. הוא מתעדת את מיקום הבית של כל אובייקט בגוף הקובץ. זה מאפשר גישה אקראית של המסמך, ולכן בעת עיבוד דף, רק את האובייקטים הנדרשים עבור דף זה נקראים מתוך הקובץ. זה עושה מסמכי PDF הרבה יותר מהר מאשר קודמיו PostScript, אשר היה צריך לקרוא את כל הקובץ לפני עיבוד זה.`,
            hebrewFont,
            rect1,
            brush,
            format
        );
        // Save and clean up
        pdf._addWatermarkText()
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
        const arabicRef: string = result[11]._operands[0];
        let arabic: _PdfName = fontDictionary.get(arabicRef.slice(1)).get('BaseFont');
        let arabicName = arabic.name.split('+')[1];
        const hebrewRef: string = result[51]._operands[0];
        let hebrew: _PdfName = fontDictionary.get(hebrewRef.slice(1)).get('BaseFont');
        let hebrewName = hebrew.name.split('+')[1];
        expect(arabicName).toEqual('NotoNaskhArabic-Regular');
        expect(hebrewName).toEqual('NotoSansHebrew-Medium');
        expect(result[69]._operator).toEqual('BT');
        expect(result[69]._operands.length).toBe(0);
        expect(result[70]._operator).toEqual('rg');
        expect(result[70]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[71]._operator).toEqual('Tf');
        expect(result[71]._operands[1]).toEqual('14.000');
        expect(result[72]._operator).toEqual('Tm');
        expect(result[72]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[73]._operator).toEqual("'");
        expect(result[73]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
        expect(result[74]._operator).toEqual('Tm');
        expect(result[74]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[75]._operator).toEqual("'");
        expect(result[75]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
        expect(result[76]._operator).toEqual('ET');
        expect(result[76]._operands.length).toBe(0);
        expect(result[77]._operator).toEqual('BT');
        expect(result[77]._operands.length).toBe(0);
        expect(result[78]._operator).toEqual('rg');
        expect(result[78]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[79]._operator).toEqual('Tf');
        expect(result[79]._operands[1]).toEqual('14.000');
        expect(result[80]._operator).toEqual('Tm');
        expect(result[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
        expect(result[81]._operator).toEqual("'");
        expect(result[81]._operands).toEqual(['(here)']);
        expect(result[82]._operator).toEqual('ET');
        expect(result[82]._operands.length).toBe(0);
        expect(result[83]._operator).toEqual('q');
        expect(result[83]._operands.length).toBe(0);
        expect(result[84]._operator).toEqual('q');
        expect(result[84]._operands.length).toBe(0);
        expect(result[85]._operator).toEqual('cm');
        expect(result[85]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[86]._operator).toEqual('gs');
        expect(result[87]._operator).toEqual('cm');
        expect(result[87]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[88]._operator).toEqual('BT');
        expect(result[88]._operands.length).toBe(0);
        expect(result[89]._operator).toEqual('rg');
        expect(result[89]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[90]._operator).toEqual('Tf');
        expect(result[91]._operator).toEqual('Tm');
        expect(result[91]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[92]._operator).toEqual("'");
        expect(result[92]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[93]._operator).toEqual('Td');
        expect(result[93]._operands).toEqual(['0.000', '141.442']);
        expect(result[94]._operator).toEqual('ET');
        expect(result[94]._operands.length).toBe(0);
        expect(result[95]._operator).toEqual('Q');
        expect(result[95]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('Bullets And Lists', () => {
        let pdf = new PdfDocument();
        // Add a new page
        let page = pdf.addPage();
        // Embed fonts used for title, body, and lists
        let font1 = pdf.embedFont(PdfFontFamily.helvetica, 14, PdfFontStyle.bold);
        let font2 = pdf.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
        let font3 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.bold);
        let font4 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.italic);
        let font5 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.regular);
        // Draw the title and introductory paragraph explaining lists
        page.graphics.drawString('List Features', font1, { x: 225, y: 10, width: 300, height: 100 }, new PdfBrush({ r: 0, g: 0, b: 139 }));
        page.graphics.drawString('This sample demonstrates letious features of bullets and lists. A list can be ordered and Unordered. Essential PDF provides support for creating and formatting ordered and unordered lists.', font2, { x: 0, y: 50, width: page.graphics.clientSize.width, height: page.graphics.clientSize.height - 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        // Create a string format for list items with line spacing
        let format = new PdfStringFormat();
        format.lineSpacing = 10;
        // Create an unordered list with disk-style bullets
        const collection = new PdfListItemCollection(['List of Essential Studio products', 'IO products']);
        let list = new PdfUnorderedList(collection, { format: format, font: font3, style: PdfUnorderedListStyle.disk, indent: 10, textIndent: 10 });
        // Create ordered sublist for first item
        let subList = new PdfOrderedList(new PdfListItemCollection(), { brush: new PdfBrush({ r: 0, g: 0, b: 0 }), indent: 20, font: font4, format: format });
        let products = ['Tools', 'Grid', 'Chart', 'Edit', 'Diagram', 'XlsIO', 'Grouping', 'Calculate', 'PDF', 'HTMLUI', 'DocIO'];
        products.forEach(function (s) { subList.items.add(new PdfListItem('Essential ' + s)); });
        // Add the ordered sublist to the first main item
        list.items.at(0).subList = subList;
        // Create unordered sublist for second item
        const subSubListCollection = new PdfListItemCollection([
            'Essential PDF: It is a .NET library with the capability to produce Adobe PDF files. It features a full-fledged object model for the easy creation of PDF files from any .NET language. It does not use any external libraries and is built from scratch in C#. It can be used on the server side (ASP.NET or any other environment) or with Windows Forms applications. Essential PDF supports many features for creating a PDF document. Drawing Text, Images, Shapes, etc can be drawn easily in the PDF document.',
            'Essential DocIO: It is a .NET library that can read and write Microsoft Word files. It features a full-fledged object model similar to the Microsoft Office COM libraries. It does not use COM interop and is built from scratch in C#. It can be used on systems that do not have Microsoft Word installed. Here are some of the most common questions that arise regarding the usage and functionality of Essential DocIO.',
            'Essential XlsIO: It is a .NET library that can read and write Microsoft Excel files (BIFF 8 format). It features a full-fledged object model similar to the Microsoft Office COM libraries. It does not use COM interop and is built from scratch in C#. It can be used on systems that do not have Microsoft Excel installed, making it an excellent reporting engine for tabular data. ',
        ]);
        let SubsubList = new PdfUnorderedList(subSubListCollection, { brush: new PdfBrush({ r: 0, g: 0, b: 0 }), indent: 20, font: font5, format: format, style: PdfUnorderedListStyle.square });
        // Add the unordered sublist to the second main item
        list.items.at(1).subList = SubsubList;
        // Draw the list on the page
        list.draw(page, { x: 0, y: 130, width: page.graphics.clientSize.width, height: page.graphics.clientSize.height - 130 });
        // Save the document PDF
        pdf._addWatermarkText();
        const bytes = pdf.save();
        // Destory the document instance.
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Font level Check
        const resources: _PdfDictionary = parsedPage._pageDictionary.get('Resources');
        const fontDictionary: _PdfDictionary = resources.get('Font');
        const HelveticaRef: string = result[21]._operands[0];
        const Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        expect(Helvetica.name).toEqual('Helvetica');
        expect(result[231]._operator).toEqual('BT');
        expect(result[231]._operands.length).toBe(0);
        expect(result[232]._operator).toEqual('rg');
        expect(result[232]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[233]._operator).toEqual('Tf');
        expect(result[233]._operands[1]).toEqual('14.000');
        expect(result[234]._operator).toEqual('Tm');
        expect(result[234]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[235]._operator).toEqual("'");
        expect(result[235]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
        expect(result[236]._operator).toEqual('Tm');
        expect(result[236]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[237]._operator).toEqual("'");
        expect(result[237]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
        expect(result[238]._operator).toEqual('ET');
        expect(result[238]._operands.length).toBe(0);
        expect(result[239]._operator).toEqual('BT');
        expect(result[239]._operands.length).toBe(0);
        expect(result[240]._operator).toEqual('rg');
        expect(result[240]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[241]._operator).toEqual('Tf');
        expect(result[241]._operands[1]).toEqual('14.000');
        expect(result[242]._operator).toEqual('Tm');
        expect(result[242]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
        expect(result[243]._operator).toEqual("'");
        expect(result[243]._operands).toEqual(['(here)']);
        expect(result[244]._operator).toEqual('ET');
        expect(result[244]._operands.length).toBe(0);
        expect(result[245]._operator).toEqual('q');
        expect(result[245]._operands.length).toBe(0);
        expect(result[246]._operator).toEqual('q');
        expect(result[246]._operands.length).toBe(0);
        expect(result[247]._operator).toEqual('cm');
        expect(result[247]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[248]._operator).toEqual('gs');
        expect(result[249]._operator).toEqual('cm');
        expect(result[249]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[250]._operator).toEqual('BT');
        expect(result[250]._operands.length).toBe(0);
        expect(result[251]._operator).toEqual('rg');
        expect(result[251]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[252]._operator).toEqual('Tf');
        expect(result[253]._operator).toEqual('Tm');
        expect(result[253]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[254]._operator).toEqual("'");
        expect(result[254]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[255]._operator).toEqual('Td');
        expect(result[255]._operands).toEqual(['0.000', '141.442']);
        expect(result[256]._operator).toEqual('ET');
        expect(result[256]._operands.length).toBe(0);
        expect(result[257]._operator).toEqual('Q');
        expect(result[257]._operands.length).toBe(0);
        parsed.destroy();
    });
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
        doc1._addWatermarkText();
        const bytes = doc1.save();
        // Destroy the document instance
        doc1.destroy();
        doc2.destroy();
        const newDocument = new PdfDocument(bytes);
        expect(newDocument.pageCount).toEqual(doc1PageCount + doc2PageCount);
        const mb = newDocument.getPage(0).mediaBox;
        expect(mb).toEqual([0, 0, 595, 842]); // Standard A4
        const rotation = newDocument.getPage(0).rotation;
        expect(rotation).toEqual(PdfRotationAngle.angle0);
        const parsedPage: PdfPage = newDocument.getPage(0);
        expect(parsedPage).toBeDefined();
        const contents = parsedPage._pageDictionary.get('Contents');
        expect(contents).toBeDefined();
        let ref; let stream; let parser; let result;
        ref = contents[8];
        expect(ref).toBeDefined();
        stream = parsedPage._crossReference._fetch(ref);
        expect(stream).toBeDefined();
        parser = new _ContentParser(stream.getBytes());
        expect(parser).toBeDefined();
        result = parser._readContent();
        expect(result).toBeDefined();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('BT');
        expect(result[2]._operands.length).toBe(0);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('rg');
        expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('Tf');
        expect(result[7]._operator).toEqual('Tr');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('Tc');
        expect(result[8]._operands).toEqual(['0.000']);
        expect(result[9]._operator).toEqual('Tw');
        expect(result[9]._operands).toEqual(['0.000']);
        expect(result[10]._operator).toEqual('Tz');
        expect(result[10]._operands).toEqual(['100.000']);
        expect(result[11]._operator).toEqual('Tm');
        expect(result[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[12]._operator).toEqual("'");
        expect(result[12]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands.length).toBe(0);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands.length).toBe(0);
        expect(result[17]._operator).toEqual('rg');
        expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[18]._operator).toEqual('Tf');
        expect(result[19]._operator).toEqual('Tm');
        expect(result[19]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[20]._operator).toEqual("'");
        expect(result[20]._operands).toEqual(['(here)']);
        expect(result[21]._operator).toEqual('ET');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('q');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('q');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('cm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '297.50', '-421.00']);
        expect(result[25]._operator).toEqual('gs');
        expect(result[26]._operator).toEqual('cm');
        expect(result[26]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands.length).toBe(0);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[32]._operator).toEqual('Td');
        expect(result[32]._operands).toEqual(['0.000', '141.442']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands.length).toBe(0);
        expect(result[34]._operator).toEqual('Q');
        expect(result[34]._operands.length).toBe(0);
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
        pdf._addWatermarkText();
        const bytes = pdf.save();
        const parsed = new PdfDocument(bytes);
        const parsedPageOne: PdfPage = parsed.getPage(0);
        let parsedContents = parsedPageOne._pageDictionary.get('Contents');
        let parsedRef = parsedContents[3];
        let parsedStream = parsedPageOne._crossReference._fetch(parsedRef);
        let parserAfter: _ContentParser = new _ContentParser(parsedStream.getBytes());
        let result: _PdfRecord[] = parserAfter._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.25']);
        expect(result[2]._operator).toEqual('BT');
        expect(result[2]._operands.length).toBe(0);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('rg');
        expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('Tf');
        expect(result[7]._operator).toEqual('Tr');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('Tc');
        expect(result[8]._operands).toEqual(['0.000']);
        expect(result[9]._operator).toEqual('Tw');
        expect(result[9]._operands).toEqual(['0.000']);
        expect(result[10]._operator).toEqual('Tz');
        expect(result[10]._operands).toEqual(['100.000']);
        expect(result[11]._operator).toEqual('Tm');
        expect(result[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[12]._operator).toEqual("'");
        expect(result[12]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands.length).toBe(0);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands.length).toBe(0);
        expect(result[17]._operator).toEqual('rg');
        expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[18]._operator).toEqual('Tf');
        expect(result[19]._operator).toEqual('Tm');
        expect(result[19]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[20]._operator).toEqual("'");
        expect(result[20]._operands).toEqual(['(here)']);
        expect(result[21]._operator).toEqual('ET');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('q');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('q');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('cm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '298.13', '-421.13']);
        expect(result[25]._operator).toEqual('gs');
        expect(result[26]._operator).toEqual('cm');
        expect(result[26]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands.length).toBe(0);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[32]._operator).toEqual('Td');
        expect(result[32]._operands).toEqual(['0.000', '141.442']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands.length).toBe(0);
        expect(result[34]._operator).toEqual('Q');
        expect(result[34]._operands.length).toBe(0);
        pdf.destroy();
        parsed.destroy();
    });
    it('Watermark', () => {
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
        pdf._addWatermarkText();
        const bytes = pdf.save();
        // Destory the document
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        expect(pageCount).toEqual(parsed.pageCount);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[22]._operator).toEqual('Tr');
        expect(result[22]._operands).toEqual(['0']);
        expect(result[23]._operator).toEqual('Tc');
        expect(result[23]._operands).toEqual(['0.000']);
        expect(result[24]._operator).toEqual('Tw');
        expect(result[24]._operands).toEqual(['0.000']);
        expect(result[25]._operator).toEqual('Tz');
        expect(result[25]._operands).toEqual(['100.000']);
        expect(result[26]._operator).toEqual('Tm');
        expect(result[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[27]._operator).toEqual("'");
        expect(result[27]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[29]._operator).toEqual("'");
        expect(result[29]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[30]._operator).toEqual('ET');
        expect(result[30]._operands.length).toBe(0);
        expect(result[31]._operator).toEqual('BT');
        expect(result[31]._operands.length).toBe(0);
        expect(result[32]._operator).toEqual('rg');
        expect(result[32]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[33]._operator).toEqual('Tf');
        expect(result[34]._operator).toEqual('Tm');
        expect(result[34]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[35]._operator).toEqual("'");
        expect(result[35]._operands).toEqual(['(here)']);
        expect(result[36]._operator).toEqual('ET');
        expect(result[36]._operands.length).toBe(0);
        expect(result[37]._operator).toEqual('q');
        expect(result[37]._operands.length).toBe(0);
        expect(result[38]._operator).toEqual('q');
        expect(result[38]._operands.length).toBe(0);
        expect(result[39]._operator).toEqual('cm');
        expect(result[39]._operands).toEqual(['1.00', '.00', '.00', '1.00', '306.00', '-396.00']);
        expect(result[40]._operator).toEqual('gs');
        expect(result[41]._operator).toEqual('cm');
        expect(result[41]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[42]._operator).toEqual('BT');
        expect(result[42]._operands.length).toBe(0);
        expect(result[43]._operator).toEqual('rg');
        expect(result[43]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[44]._operator).toEqual('Tf');
        expect(result[45]._operator).toEqual('Tm');
        expect(result[45]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[46]._operator).toEqual("'");
        expect(result[46]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[47]._operator).toEqual('Td');
        expect(result[47]._operands).toEqual(['0.000', '141.442']);
        expect(result[48]._operator).toEqual('ET');
        expect(result[48]._operands.length).toBe(0);
        expect(result[49]._operator).toEqual('Q');
        expect(result[49]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('Job application', () => {
        const imageBytes = cover;
        // Create a new PdfDocument
        const pdfDoc: PdfDocument = new PdfDocument();
        // Define PdfPageSettings
        const setting: PdfPageSettings = new PdfPageSettings({
            orientation: PdfPageOrientation.landscape,
            margins: new PdfMargins(0),
            size: { width: 500, height: 310 }
        });
        // Add first page with the above settings
        const firstPage: PdfPage = pdfDoc.addPage(setting);
        // Get graphics for the page and draw the background image covering the full page
        const g: PdfGraphics = firstPage.graphics;
        const img = new PdfBitmap(imageBytes);
        g.drawImage(img, { x: 0, y: 0, width: setting.size.width, height: setting.size.height });
        //  Create embed font
        let pdfFont: PdfFont = pdfDoc.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
        const orange: PdfBrush = new PdfBrush({ r: 213, g: 123, b: 19 });
        // Define brush
        const labelBrush: PdfBrush = new PdfBrush({ r: 124, g: 143, b: 166 });
        const gray = { r: 128, g: 128, b: 128 };
        // Draw section title "General Information"
        g.drawString('General Information', pdfFont, { x: 25, y: 40, width: 150, height: 100 }, orange);
        // Draw section title "Education Grade"
        g.drawString('Education Grade', pdfFont, { x: 25, y: 190, width: 100, height: 100 }, orange);
        pdfFont = pdfDoc.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        let bounds = { x: 180, y: 65, width: 156, height: 15 };
        g.drawString('First Name:', pdfFont, { x: 25, y: 65, width: 100, height: 100 }, labelBrush);
        // Create "First Name" label and a PdfTextBoxField
        const firstName = new PdfTextBoxField(firstPage, 'FirstName', bounds);
        firstName.setAppearance(true);
        firstName.toolTip = 'First Name';
        firstName.font = pdfDoc.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        firstName.borderColor = gray;
        pdfDoc.form.add(firstName);
        g.drawString('Last Name:', pdfFont, { x: 25, y: 83, width: 100, height: 100 }, labelBrush);
        bounds = { x: bounds.x, y: bounds.y + 18, width: bounds.width, height: bounds.height };
        // Create "Last Name" label and PdfTextBoxField (same styling), add to form
        const lastName = new PdfTextBoxField(firstPage, 'LastName', bounds, { toolTip: 'Last Name', font: firstName.font, borderColor: gray });
        lastName.setAppearance(true);
        pdfDoc.form.add(lastName);
        g.drawString('Email:', pdfFont, { x: 25, y: 103, width: 100, height: 100 }, labelBrush);
        bounds = { x: bounds.x, y: bounds.y + 18, width: bounds.width, height: bounds.height };
        // Create "Email" label and PdfTextBoxField (same styling), add to form
        const email = new PdfTextBoxField(firstPage, 'Email', bounds, { toolTip: 'Email', font: firstName.font, borderColor: gray });
        email.setAppearance(true);
        pdfDoc.form.add(email);
        g.drawString('Business Phone:', pdfFont, { x: 25, y: 123, width: 100, height: 100 }, labelBrush);
        bounds = { x: bounds.x, y: bounds.y + 18, width: bounds.width, height: bounds.height };
        // Create "Business Phone" label and PdfTextBoxField (same styling), add to form
        const business = new PdfTextBoxField(firstPage, 'Business', bounds, { toolTip: 'Business phone', font: firstName.font, borderColor: gray });
        business.setAppearance(true);
        pdfDoc.form.add(business);
        g.drawString('Which position are\nyou applying for?', pdfFont, { x: 25, y: 143, width: 100, height: 100 }, labelBrush);
        bounds = { x: bounds.x, y: bounds.y + 24, width: bounds.width, height: bounds.height };
        const jobTitle = new PdfComboBoxField(firstPage, 'JobTitle', { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, { items: [], borderColor: gray, font: pdfFont, toolTip: 'Job Title' });
        jobTitle.setAppearance(true);
        jobTitle.addItem(new PdfListFieldItem('Development', 'development'));
        jobTitle.addItem(new PdfListFieldItem('Support', 'support'));
        jobTitle.addItem(new PdfListFieldItem('Documentation', 'documentation'));
        pdfDoc.form.add(jobTitle);
        g.drawString('Highest qualification', pdfFont, { x: 25, y: 217, width: 100, height: 100 }, labelBrush);
        const tinyFont: PdfFont = pdfDoc.embedFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
        let cbPos = { x: 25, y: 239, width: 10, height: 10 };
        let chb = new PdfCheckBoxField('Adegree', { x: cbPos.x, y: cbPos.y, width: cbPos.width, height: cbPos.height }, firstPage, { toolTip: 'Associate degree', borderColor: gray });
        chb.setAppearance(true);
        pdfDoc.form.add(chb);
        g.drawString('Associate degree', tinyFont, { x: cbPos.x + chb.bounds.height + 10, y: cbPos.y, width: 150, height: 100 }, labelBrush);
        cbPos = { x: cbPos.x + 90, y: cbPos.y, width: cbPos.width, height: cbPos.height };
        chb = new PdfCheckBoxField('Bdegree', { x: cbPos.x, y: cbPos.y, width: cbPos.width, height: cbPos.height }, firstPage, { borderColor: gray });
        chb.setAppearance(true);
        pdfDoc.form.add(chb);
        g.drawString('Bachelor degree', tinyFont, { x: cbPos.x + chb.bounds.height + 10, y: cbPos.y, width: 150, height: 100 }, labelBrush);

        cbPos = { x: cbPos.x + 90, y: cbPos.y, width: cbPos.width, height: cbPos.height };
        chb = new PdfCheckBoxField('College', { x: cbPos.x, y: cbPos.y, width: cbPos.width, height: cbPos.height }, firstPage, { toolTip: 'College', borderColor: gray });
        chb.setAppearance(true);
        pdfDoc.form.add(chb);
        g.drawString('College', tinyFont, { x: cbPos.x + chb.bounds.height + 10, y: cbPos.y, width: 100, height: 100 }, labelBrush);

        cbPos = { x: 25, y: cbPos.y + 20, width: cbPos.width, height: cbPos.height };
        chb = new PdfCheckBoxField('PG', { x: cbPos.x, y: cbPos.y, width: cbPos.width, height: cbPos.height }, firstPage, { borderColor: gray });
        chb.setAppearance(true);
        pdfDoc.form.add(chb);
        g.drawString('Post Graduate', tinyFont, { x: cbPos.x + chb.bounds.height + 10, y: cbPos.y, width: 150, height: 100 }, labelBrush);

        cbPos = { x: cbPos.x + 90, y: cbPos.y, width: cbPos.width, height: cbPos.height };
        chb = new PdfCheckBoxField('MBA', { x: cbPos.x, y: cbPos.y, width: cbPos.width, height: cbPos.height }, firstPage, { borderColor: gray });
        chb.setAppearance(true);
        pdfDoc.form.add(chb);
        g.drawString('MBA', tinyFont, { x: cbPos.x + chb.bounds.height + 10, y: cbPos.y, width: 100, height: 100 }, labelBrush);
        // Add second page with same settings and background image
        const secondPage: PdfPage = pdfDoc.addPage(setting);
        const g2: PdfGraphics = secondPage.graphics;
        g2.drawImage(img, { x: 0, y: 0, width: setting.size.width, height: setting.size.height });
        g2.drawString('Current position', pdfDoc.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.bold), { x: 25, y: 40, width: 100, height: 100 }, orange);
        // Add "I am not currently employed" checkbox (Cemp):
        let bounds2 = { x: 25, y: 65, width: 10, height: 10 };
        chb = new PdfCheckBoxField('Cemp', { x: bounds2.x, y: bounds2.y, width: bounds2.width, height: bounds2.height }, secondPage);
        chb.setAppearance(true);
        chb.font = pdfFont;
        chb.borderColor = gray;
        chb.border.width = 1;
        pdfDoc.form.add(chb);
        g2.drawString('I am not currently employed', pdfFont, { x: bounds2.x + chb.bounds.height + 10, y: bounds2.y, width: 200, height: 100 }, labelBrush);
        // Add "Job Title" label and PdfTextBoxField (Jtitle), add to form
        g2.drawString('Job Title', pdfFont, { x: 25, y: 85, width: 100, height: 100 }, labelBrush);
        const jobBounds = { x: 175, y: 85, width: 156, height: 15 };
        const font10 = pdfDoc.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        let jobTitle1 = new PdfTextBoxField(secondPage, 'Jtitle', jobBounds, { toolTip: 'Job title', font: font10, borderColor: gray });
        jobTitle1.setAppearance(true);
        pdfDoc.form.add(jobTitle1);
        // Add "Employer" label and PdfTextBoxField (Employer), add to form
        g2.drawString('Employer:', pdfFont, { x: 25, y: 103, width: 100, height: 100 }, labelBrush);
        let employer = new PdfTextBoxField(secondPage, 'Employer', { x: 175, y: 103, width: 156, height: 15 }, { toolTip: 'Employer', font: font10, borderColor: gray });
        employer.setAppearance(true);
        pdfDoc.form.add(employer);
        //  Add "Reason for leaving" label and PdfTextBoxField (Reason), add to form
        g2.drawString('Reason for leaving:', pdfFont, { x: 25, y: 123, width: 100, height: 100 }, labelBrush);
        let reason = new PdfTextBoxField(secondPage, 'Reason', { x: 175, y: 121, width: 156, height: 15 }, { toolTip: 'Reason for leaving', font: font10, borderColor: gray });
        reason.setAppearance(true);
        pdfDoc.form.add(reason);
        // Add "Total Annual salary" label and PdfTextBoxField (Asalary), add to form
        g2.drawString('Total Annual salary:', pdfFont, { x: 25, y: 143, width: 100, height: 100 }, labelBrush);
        let annualSalary = new PdfTextBoxField(secondPage, 'Asalary', { x: 175, y: 139, width: 156, height: 15 }, { toolTip: 'Annual salary', font: font10, borderColor: gray });
        annualSalary.setAppearance(true);
        pdfDoc.form.add(annualSalary);
        // Add "Duties" label and a multi-line PdfTextBoxField (Duties), add to form
        g2.drawString('Duties:', pdfFont, { x: 25, y: 168, width: 100, height: 100 }, labelBrush);
        let duties = new PdfTextBoxField(secondPage, 'Duties', { x: 25, y: 189, width: 156, height: 70 }, { toolTip: 'Duties', font: font10, borderColor: gray });
        duties.setAppearance(true);
        duties.multiLine = true;
        pdfDoc.form.add(duties);
        // Add "Employment type" label and a PdfComboBoxField (EmpType):
        g2.drawString('Employment type:', pdfFont, { x: 25, y: 268, width: 100, height: 100 }, labelBrush);
        const empType = new PdfComboBoxField(secondPage, 'EmpType', { x: 175, y: 263, width: 156, height: 20 });
        empType.setAppearance(true);
        empType.borderColor = gray;
        empType.font = pdfFont;
        empType.toolTip = 'Employment type';
        empType.addItem(new PdfListFieldItem('Full time', 'ft'));
        empType.addItem(new PdfListFieldItem('Part time', 'pt'));
        pdfDoc.form.add(empType);
        // Add third page with same settings and background image
        const thirdPage: PdfPage = pdfDoc.addPage(setting);
        const g3: PdfGraphics = thirdPage.graphics;
        g3.drawImage(img, { x: 0, y: 0, width: setting.size.width, height: setting.size.height });
        // Draw "Thank You" title and a message paragraph
        const bold12 = pdfDoc.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
        g3.drawString('Thank You', bold12, { x: 25, y: 80, width: 100, height: 100 }, orange);
        const regular10 = pdfDoc.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        g3.drawString('Thanks for taking the time to complete this form.\nWe will be in contact with you shortly.', regular10, { x: 25, y: 110, width: 250, height: 100 }, labelBrush);
        // Create a PdfButtonField 
        const submitBtn = new PdfButtonField(thirdPage, 'SubmitButton', { x: 25, y: 160, width: 100, height: 20 }, { text: 'Apply', backColor: { r: 181, g: 191, b: 203 }, borderColor: { r: 0, g: 0, b: 0 } });
        submitBtn.font = regular10;
        submitBtn.setAppearance(true);
        pdfDoc.form.add(submitBtn);
        // Save and download the document
        pdfDoc._addWatermarkText();
        const bytes = pdfDoc.save();
        // Destroy the document instance.
        pdfDoc.destroy();
        const parsed = new PdfDocument(bytes);
        let parsedPage: PdfPage = parsed.getPage(0);
        let contents = parsedPage._pageDictionary.get('Contents');
        let ref = contents[2];
        let stream = parsedPage._crossReference._fetch(ref);
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        //Font check
        let fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        let HelveticaBoldRef: string = result[15]._operands[0];
        let HelveticaBold: _PdfName = fontDictionary.get(HelveticaBoldRef.slice(1)).get('BaseFont');
        let HelveticaRef: string = result[31]._operands[0];
        let Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        //Content level check
        expect(result[97]._operator).toEqual('BT');
        expect(result[97]._operands.length).toBe(0);
        expect(result[98]._operator).toEqual('rg');
        expect(result[98]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[99]._operator).toEqual('Tf');
        expect(result[100]._operator).toEqual('Tm');
        expect(result[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[101]._operator).toEqual("'");
        expect(result[101]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered)']);
        expect(result[102]._operator).toEqual('Tm');
        expect(result[102]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[103]._operator).toEqual("'");
        expect(result[103]._operands).toEqual(['(the wrong key in your application. To obtain the valid key, Click)']);
        expect(result[104]._operator).toEqual('ET');
        expect(result[104]._operands.length).toBe(0);
        expect(result[105]._operator).toEqual('BT');
        expect(result[105]._operands.length).toBe(0);
        expect(result[106]._operator).toEqual('rg');
        expect(result[106]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[107]._operator).toEqual('Tf');
        expect(result[108]._operator).toEqual('Tm');
        expect(result[108]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-55.40']);
        expect(result[109]._operator).toEqual("'");
        expect(result[109]._operands).toEqual(['(here)']);
        expect(result[110]._operator).toEqual('ET');
        expect(result[110]._operands.length).toBe(0);
        expect(result[111]._operator).toEqual('q');
        expect(result[111]._operands.length).toBe(0);
        expect(result[112]._operator).toEqual('q');
        expect(result[112]._operands.length).toBe(0);
        expect(result[113]._operator).toEqual('cm');
        expect(result[113]._operands).toEqual(['1.00', '.00', '.00', '1.00', '250.00', '-155.00']);
        expect(result[114]._operator).toEqual('gs');
        expect(result[115]._operator).toEqual('cm');
        expect(result[115]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[116]._operator).toEqual('BT');
        expect(result[116]._operands.length).toBe(0);
        expect(result[117]._operator).toEqual('rg');
        expect(result[117]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[118]._operator).toEqual('Tf');
        expect(result[119]._operator).toEqual('Tm');
        expect(result[119]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[120]._operator).toEqual("'");
        expect(result[120]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[121]._operator).toEqual('Td');
        expect(result[121]._operands).toEqual(['0.000', '141.442']);
        expect(result[122]._operator).toEqual('ET');
        expect(result[122]._operands.length).toBe(0);
        expect(result[123]._operator).toEqual('Q');
        expect(result[123]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('Bookmarks', () => {
        function drawTitle(page: PdfPage, title: string, x: number, y: number, brush: PdfBrush) {
            const font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
            const bounds = { x: x, y: y, width: 500, height: 20 };
            page.graphics.drawString(title, font, bounds, brush);
        }
        const document = new PdfDocument();
        // Loop 3 times to add three pages representing Chapter 1, 2, and 3
        for (let i = 1; i <= 3; i++) {
            // For each iteration, add a new page to the document
            const page: PdfPage = document.addPage();
            // Compose the chapter title text (e.g., "Chapter 1")
            const chapterTitle = `Chapter ${i}`;
            // Draw the chapter title on the page at (10, 10) using a red brush
            drawTitle(page, chapterTitle, 10, 10, new PdfBrush({ r: 255, g: 0, b: 0 }));
            // Access the document's root bookmarks collection
            const bookmarks: PdfBookmarkBase = document.bookmarks;
            // Add a chapter-level bookmark with the chapter title
            const chapter: PdfBookmark = bookmarks.add(chapterTitle);
            // Set the chapter bookmark's destination to the chapter title position on the current page
            chapter.destination = new PdfDestination(page, { x: 10, y: 10 });
            // Color the chapter bookmark red
            chapter.color = { r: 255, g: 0, b: 0 };
            // Prepare section titles (e.g., "Section 1.1" and "Section 1.2")
            const sec1Title = `Section ${i}.1`;
            const sec2Title = `Section ${i}.2`;
            // Draw both section titles on the page at the specified coordinates using a green brush
            drawTitle(page, sec1Title, 30, 30, new PdfBrush({ r: 0, g: 255, b: 0 }));
            drawTitle(page, sec2Title, 30, 400, new PdfBrush({ r: 0, g: 255, b: 0 }));
            // Add a bookmark for Section 1 under the current chapter bookmark
            const section1: PdfBookmark = chapter.add(sec1Title);
            // Set the Section 1 bookmark destination to the section title position
            section1.destination = new PdfDestination(page, { x: 30, y: 30 });
            // Color the Section 1 bookmark dark green
            section1.color = { r: 0, g: 128, b: 0 };
            // Add a bookmark for Section 2 under the current chapter bookmark
            const section2: PdfBookmark = chapter.add(sec2Title);
            // Set the Section 2 bookmark destination to its title position
            section2.destination = new PdfDestination(page, { x: 30, y: 400 });
            // Color the Section 2 bookmark dark green
            section2.color = { r: 0, g: 128, b: 0 };
            // Define paragraph entries under Section 1 with their text and coordinates
            const subs1 = [
                { t: `Paragraph ${i}.1.1`, pt: { x: 50, y: 50 } },
                { t: `Paragraph ${i}.1.2`, pt: { x: 50, y: 150 } },
                { t: `Paragraph ${i}.1.3`, pt: { x: 50, y: 250 } }
            ];
            for (const s of subs1) {
                drawTitle(page, s.t, s.pt.x, s.pt.y, new PdfBrush({ r: 0, g: 0, b: 255 }));
                const b = section1.add(s.t);
                b.destination = new PdfDestination(page, s.pt);
                b.color = { r: 0, g: 0, b: 255 };
            }
            // Define paragraph entries under Section 2 with their text and coordinates
            const subs2 = [
                { t: `Paragraph ${i}.2.1`, pt: { x: 50, y: 420 } },
                { t: `Paragraph ${i}.2.2`, pt: { x: 50, y: 560 } },
                { t: `Paragraph ${i}.2.3`, pt: { x: 50, y: 680 } }
            ];
            for (const s of subs2) {
                drawTitle(page, s.t, s.pt.x, s.pt.y, new PdfBrush({ r: 0, g: 0, b: 255 }));
                const b = section2.add(s.t);
                b.destination = new PdfDestination(page, s.pt);
                b.color = { r: 0, g: 0, b: 255 };
            }
        }
        // Save and download PDF document
        document._addWatermarkText();
        const bytes = document.save();
        // Destory the document instance
        document.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        let parsedPage: PdfPage = parsed.getPage(0);
        // Outline level check
        let result: _PdfRecord[] = getRecords(parsedPage);
        expect(result[67]._operator).toEqual('BT');
        expect(result[67]._operands.length).toBe(0);
        expect(result[68]._operator).toEqual('rg');
        expect(result[68]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[69]._operator).toEqual('Tf');
        expect(result[70]._operator).toEqual('Tm');
        expect(result[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[71]._operator).toEqual("'");
        expect(result[71]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
        expect(result[72]._operator).toEqual('Tm');
        expect(result[72]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[73]._operator).toEqual("'");
        expect(result[73]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
        expect(result[74]._operator).toEqual('ET');
        expect(result[74]._operands.length).toBe(0);
        expect(result[75]._operator).toEqual('BT');
        expect(result[75]._operands.length).toBe(0);
        expect(result[76]._operator).toEqual('rg');
        expect(result[76]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[77]._operator).toEqual('Tf');
        expect(result[78]._operator).toEqual('Tm');
        expect(result[78]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
        expect(result[79]._operator).toEqual("'");
        expect(result[79]._operands).toEqual(['(here)']);
        expect(result[80]._operator).toEqual('ET');
        expect(result[80]._operands.length).toBe(0);
        expect(result[81]._operator).toEqual('q');
        expect(result[81]._operands.length).toBe(0);
        expect(result[82]._operator).toEqual('q');
        expect(result[82]._operands.length).toBe(0);
        expect(result[83]._operator).toEqual('cm');
        expect(result[83]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[84]._operator).toEqual('gs');
        expect(result[85]._operator).toEqual('cm');
        expect(result[85]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[86]._operator).toEqual('BT');
        expect(result[86]._operands.length).toBe(0);
        expect(result[87]._operator).toEqual('rg');
        expect(result[87]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[88]._operator).toEqual('Tf');
        expect(result[89]._operator).toEqual('Tm');
        expect(result[89]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[90]._operator).toEqual("'");
        expect(result[90]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[91]._operator).toEqual('Td');
        expect(result[91]._operands).toEqual(['0.000', '141.442']);
        expect(result[92]._operator).toEqual('ET');
        expect(result[92]._operands.length).toBe(0);
        expect(result[93]._operator).toEqual('Q');
        expect(result[93]._operands.length).toBe(0);
        function getRecords(parsedPage: PdfPage) {
            const contents = parsedPage._pageDictionary.get('Contents');
            const ref = contents[2];
            const stream = parsedPage._crossReference._fetch(ref);
            const parser: _ContentParser = new _ContentParser(stream.getBytes());
            return parser._readContent();
        }

        parsed.destroy();
    });
    it('Form Filling -With Flatten', () => {
        function getFormValues() {
            const name = 'Ragul';
            const gender = 'Male';
            const dob = '04/08/2003';
            const email = 'ragul.milton@example.com';
            const state = 'tamil nadu';
            const newsletter = true;
            return { name, gender, dob, email, state, newsletter }
        }
        function findByName(form: PdfForm, name: string) {
            for (let i = 0; i < form.count; i++) {
                const field = form.fieldAt(i);
                if (field && field.name === name) return field;
            }
            return undefined;
        }

        const pdfBytes = formPDF;
        // Read current form values from the page
        const values = getFormValues();
        // Create a PdfDocument from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Get the PdfForm
        const form = pdf.form;
        // Map and set each field if present, then set appearance
        const nameField = findByName(form, 'name') as PdfTextBoxField | undefined;
        if (nameField) {
            nameField.text = values.name;
            nameField.setAppearance(true);
        }
        const gender = findByName(form, 'gender') as PdfRadioButtonListField | undefined;
        if (gender) {
            switch (values.gender) {
                case 'Male': gender.selectedIndex = 0; break;
                case 'Other': gender.selectedIndex = 1; break;
                case 'Female': gender.selectedIndex = 2; break;
            }
            gender.setAppearance(true);
        }
        const dobField = findByName(form, 'dob') as PdfTextBoxField | undefined;
        if (dobField) {
            dobField.text = values.dob;
            dobField.setAppearance(true);
        }
        const emailField = findByName(form, 'email') as PdfTextBoxField | undefined;
        if (emailField) {
            emailField.text = values.email;
            emailField.setAppearance(true);
        }
        const stateField = findByName(form, 'state') as PdfComboBoxField | undefined;
        if (stateField) {
            for (let i = 0; i < stateField.itemsCount; i++) {
                const item = stateField.itemAt(i) as PdfListFieldItem | undefined;
                if (item && item.text === values.state) {
                    stateField.selectedIndex = i;
                    break;
                }
            }
            stateField.setAppearance(true);
        }
        const newsField = findByName(form, 'newsletter') as PdfCheckBoxField | undefined;
        if (newsField) {
            newsField.checked = values.newsletter;
            newsField.setAppearance(true);
        }
        pdf.flatten = true;
        pdf._addWatermarkText();
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Checking the values for the Check box field
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '841.89']);
        expect(result[2]._operator).toEqual('BT');
        expect(result[2]._operands.length).toBe(0);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('rg');
        expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('Tf');
        expect(result[7]._operator).toEqual('Tr');
        expect(result[7]._operands).toBeDefined();
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('Tc');
        expect(result[8]._operands).toEqual(['0.000']);
        expect(result[9]._operator).toEqual('Tw');
        expect(result[9]._operands).toEqual(['0.000']);
        expect(result[10]._operator).toEqual('Tz');
        expect(result[10]._operands).toEqual(['100.000']);
        expect(result[11]._operator).toEqual('Tm');
        expect(result[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[12]._operator).toEqual("'");
        expect(result[12]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands.length).toBe(0);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands.length).toBe(0);
        expect(result[17]._operator).toEqual('rg');
        expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[18]._operator).toEqual('Tf');
        expect(result[19]._operator).toEqual('Tm');
        expect(result[19]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[20]._operator).toEqual("'");
        expect(result[20]._operands).toEqual(['(here)']);
        expect(result[21]._operator).toEqual('ET');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('q');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('q');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('cm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '297.64', '-420.94']);
        expect(result[25]._operator).toEqual('gs');
        expect(result[26]._operator).toEqual('cm');
        expect(result[26]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands.length).toBe(0);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[32]._operator).toEqual('Td');
        expect(result[32]._operands).toEqual(['0.000', '141.442']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands.length).toBe(0);
        parsed.destroy();

    });
    it('Form Filling -Without Flatten', () => {
        function getFormValues() {
            const name = 'Jack';
            const gender = 'Female';
            const dob = '26/06/2004';
            const email = 'jack@example.com';
            const state = 'kerala';
            const newsletter = false;
            return { name, gender, dob, email, state, newsletter }
        }
        function findByName(form: PdfForm, name: string) {
            for (let i = 0; i < form.count; i++) {
                const field = form.fieldAt(i);
                if (field && field.name === name) return field;
            }
            return undefined;
        }
        const pdfBytes = formPDF;
        // Read current form values from the page
        const values = getFormValues();
        // Create a PdfDocument from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Get the PdfForm
        const form = pdf.form;
        // Map and set each field if present, then set appearance
        const nameField = findByName(form, 'name') as PdfTextBoxField | undefined;
        if (nameField) {
            nameField.text = values.name;
            nameField.setAppearance(true);
        }
        const gender = findByName(form, 'gender') as PdfRadioButtonListField | undefined;
        if (gender) {
            switch (values.gender) {
                case 'Male': gender.selectedIndex = 0; break;
                case 'Other': gender.selectedIndex = 1; break;
                case 'Female': gender.selectedIndex = 2; break;
            }
            gender.setAppearance(true);
        }
        const dobField = findByName(form, 'dob') as PdfTextBoxField | undefined;
        if (dobField) {
            dobField.text = values.dob;
            dobField.setAppearance(true);
        }
        const emailField = findByName(form, 'email') as PdfTextBoxField | undefined;
        if (emailField) {
            emailField.text = values.email;
            emailField.setAppearance(true);
        }
        const stateField = findByName(form, 'state') as PdfComboBoxField | undefined;
        if (stateField) {
            for (let i = 0; i < stateField.itemsCount; i++) {
                const item = stateField.itemAt(i) as PdfListFieldItem | undefined;
                if (item && item.text === values.state) {
                    stateField.selectedIndex = i;
                    break;
                }
            }
            stateField.setAppearance(true);
        }
        const newsField = findByName(form, 'newsletter') as PdfCheckBoxField | undefined;
        if (newsField) {
            newsField.checked = values.newsletter;
            newsField.setAppearance(true);
        }
        pdf._addWatermarkText();
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '841.89']);
        expect(result[2]._operator).toEqual('BT');
        expect(result[2]._operands.length).toBe(0);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('rg');
        expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('Tf');
        expect(result[7]._operator).toEqual('Tr');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('Tc');
        expect(result[8]._operands).toEqual(['0.000']);
        expect(result[9]._operator).toEqual('Tw');
        expect(result[9]._operands).toEqual(['0.000']);
        expect(result[10]._operator).toEqual('Tz');
        expect(result[10]._operands).toEqual(['100.000']);
        expect(result[11]._operator).toEqual('Tm');
        expect(result[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
        expect(result[12]._operator).toEqual("'");
        expect(result[12]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands.length).toBe(0);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands.length).toBe(0);
        expect(result[17]._operator).toEqual('rg');
        expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[18]._operator).toEqual('Tf');
        expect(result[19]._operator).toEqual('Tm');
        expect(result[19]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
        expect(result[20]._operator).toEqual("'");
        expect(result[20]._operands).toEqual(['(here)']);
        expect(result[21]._operator).toEqual('ET');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('q');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('q');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('cm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '297.64', '-420.94']);
        expect(result[25]._operator).toEqual('gs');
        expect(result[26]._operator).toEqual('cm');
        expect(result[26]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands.length).toBe(0);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[32]._operator).toEqual('Td');
        expect(result[32]._operands).toEqual(['0.000', '141.442']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('1003529 - rotate 90 register - without license', () => {
        let document: PdfDocument = new PdfDocument();
        let settings = new PdfPageSettings();
        settings.rotation = PdfRotationAngle.angle90;
        document.addPage(settings);
        document._addWatermarkText();
        const pageCount = document.pageCount;
        let output = document.save();
        document.destroy();
        const parsed = new PdfDocument(output);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
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
        expect(result[7]._operator).toEqual('q');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('cm');
        expect(result[8]._operands).toEqual(['.00', '1.00', '-1.00', '.00', '.00', '.00']);
        expect(result[9]._operator).toEqual('BT');
        expect(result[9]._operands.length).toBe(0);
        expect(result[10]._operator).toEqual('CS');
        expect(result[10]._operands).toEqual(['/DeviceRGB']);
        expect(result[11]._operator).toEqual('cs');
        expect(result[11]._operands).toEqual(['/DeviceRGB']);
        expect(result[12]._operator).toEqual('rg');
        expect(result[12]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[13]._operator).toEqual('Tf');
        expect(result[14]._operator).toEqual('Tr');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('Tc');
        expect(result[15]._operands).toEqual(['0.000']);
        expect(result[16]._operator).toEqual('Tw');
        expect(result[16]._operands).toEqual(['0.000']);
        expect(result[17]._operator).toEqual('Tz');
        expect(result[17]._operands).toEqual(['100.000']);
        expect(result[18]._operator).toEqual('Tm');
        expect(result[18]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-722.00', '-23.03']);
        expect(result[19]._operator).toEqual("'");
        expect(result[19]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To)']);
        expect(result[20]._operator).toEqual('Tm');
        expect(result[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-722.00', '-39.22']);
        expect(result[21]._operator).toEqual("'");
        expect(result[21]._operands).toEqual(['(obtain the valid key, Click)']);
        expect(result[22]._operator).toEqual('ET');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('BT');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('rg');
        expect(result[24]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[25]._operator).toEqual('Tf');
        expect(result[26]._operator).toEqual('Tm');
        expect(result[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-559.05', '-39.22']);
        expect(result[27]._operator).toEqual("'");
        expect(result[27]._operands).toEqual(['(here)']);
        expect(result[28]._operator).toEqual('ET');
        expect(result[28]._operands.length).toBe(0);
        expect(result[29]._operator).toEqual('Q');
        expect(result[29]._operands.length).toBe(0);
        expect(result[30]._operator).toEqual('q');
        expect(result[30]._operands.length).toBe(0);
        expect(result[31]._operator).toEqual('cm');
        expect(result[31]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[32]._operator).toEqual('gs');
        expect(result[33]._operator).toEqual('cm');
        expect(result[33]._operands).toEqual(['-0.71', '0.71', '-0.71', '-0.71', '.00', '.00']);
        expect(result[34]._operator).toEqual('BT');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('rg');
        expect(result[35]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[36]._operator).toEqual('Tf');
        expect(result[37]._operator).toEqual('Tr');
        expect(result[37]._operands).toEqual(['0']);
        expect(result[38]._operator).toEqual('Tc');
        expect(result[38]._operands).toEqual(['0.000']);
        expect(result[39]._operator).toEqual('Tw');
        expect(result[39]._operands).toEqual(['0.000']);
        expect(result[40]._operator).toEqual('Tz');
        expect(result[40]._operands).toEqual(['100.000']);
        expect(result[41]._operator).toEqual('Tm');
        expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[42]._operator).toEqual("'");
        expect(result[42]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[43]._operator).toEqual('Td');
        expect(result[43]._operands).toEqual(['0.000', '141.442']);
        expect(result[44]._operator).toEqual('ET');
        expect(result[44]._operands.length).toBe(0);
        expect(result[45]._operator).toEqual('Q');
        expect(result[45]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('1003529 - rotate 270 register - without license', () => {
        let document: PdfDocument = new PdfDocument();
        let settings = new PdfPageSettings();
        settings.rotation = PdfRotationAngle.angle270;
        document.addPage(settings);
        const pageCount = document.pageCount;
        document._addWatermarkText();
        let output = document.save();
        document.destroy();
        const parsed = new PdfDocument(output);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
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
        expect(result[7]._operator).toEqual('q');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('cm');
        expect(result[8]._operands).toEqual(['-0.00', '-1.00', '1.00', '-0.00', '.00', '.00']);
        expect(result[9]._operator).toEqual('BT');
        expect(result[9]._operands.length).toBe(0);
        expect(result[10]._operator).toEqual('CS');
        expect(result[10]._operands).toEqual(['/DeviceRGB']);
        expect(result[11]._operator).toEqual('cs');
        expect(result[11]._operands).toEqual(['/DeviceRGB']);
        expect(result[12]._operator).toEqual('rg');
        expect(result[12]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[13]._operator).toEqual('Tf');
        expect(result[14]._operator).toEqual('Tr');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('Tc');
        expect(result[15]._operands).toEqual(['0.000']);
        expect(result[16]._operator).toEqual('Tw');
        expect(result[16]._operands).toEqual(['0.000']);
        expect(result[17]._operator).toEqual('Tz');
        expect(result[17]._operands).toEqual(['100.000']);
        expect(result[18]._operator).toEqual('Tm');
        expect(result[18]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '491.97']);
        expect(result[19]._operator).toEqual("'");
        expect(result[19]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To)']);
        expect(result[20]._operator).toEqual('Tm');
        expect(result[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '475.78']);
        expect(result[21]._operator).toEqual("'");
        expect(result[21]._operands).toEqual(['(obtain the valid key, Click)']);
        expect(result[22]._operator).toEqual('ET');
        expect(result[22]._operands.length).toBe(0);
        expect(result[23]._operator).toEqual('BT');
        expect(result[23]._operands.length).toBe(0);
        expect(result[24]._operator).toEqual('rg');
        expect(result[24]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[25]._operator).toEqual('Tf');
        expect(result[26]._operator).toEqual('Tm');
        expect(result[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '202.95', '475.78']);
        expect(result[27]._operator).toEqual("'");
        expect(result[27]._operands).toEqual(['(here)']);
        expect(result[28]._operator).toEqual('ET');
        expect(result[28]._operands.length).toBe(0);
        expect(result[29]._operator).toEqual('Q');
        expect(result[29]._operands.length).toBe(0);
        expect(result[30]._operator).toEqual('q');
        expect(result[30]._operands.length).toBe(0);
        expect(result[31]._operator).toEqual('cm');
        expect(result[31]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
        expect(result[32]._operator).toEqual('gs');
        expect(result[33]._operator).toEqual('cm');
        expect(result[33]._operands).toEqual(['0.71', '-0.71', '0.71', '0.71', '.00', '.00']);
        expect(result[34]._operator).toEqual('BT');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('rg');
        expect(result[35]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[36]._operator).toEqual('Tf');
        expect(result[37]._operator).toEqual('Tr');
        expect(result[37]._operands).toEqual(['0']);
        expect(result[38]._operator).toEqual('Tc');
        expect(result[38]._operands).toEqual(['0.000']);
        expect(result[39]._operator).toEqual('Tw');
        expect(result[39]._operands).toEqual(['0.000']);
        expect(result[40]._operator).toEqual('Tz');
        expect(result[40]._operands).toEqual(['100.000']);
        expect(result[41]._operator).toEqual('Tm');
        expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
        expect(result[42]._operator).toEqual("'");
        expect(result[42]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
        expect(result[43]._operator).toEqual('Td');
        expect(result[43]._operands).toEqual(['0.000', '141.442']);
    });
});
describe('Security', () => {
    type SigCase = { title: string; cryptographicStandard: CryptographicStandard; digestAlgorithm: DigestAlgorithm; };
    const cases = [
        { title: 'Digital Signature - sha256 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha256 },
        { title: 'Digital Signature - ripemd160 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.ripemd160 },
        { title: 'Digital Signature - sha384 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha384 },
        { title: 'Digital Signature - sha1 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha1 },
        { title: 'Digital Signature - sha512 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha512 },
        { title: 'Digital Signature - sha256 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 },
        { title: 'Digital Signature - ripemd160 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.ripemd160 },
        { title: 'Digital Signature - sha384 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha384 },
        { title: 'Digital Signature - sha1 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha1 },
        { title: 'Digital Signature - sha512 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha512 }
    ];
    for (const tc of cases) {
        it(tc.title, () => {
            const pdf = new PdfDocument(template);
            expect(pdf).toBeDefined();
            const page = pdf.getPage(0);
            const sigX = 20;
            const sigY = 20;
            const sigW = 200;
            const sigH = 100;
            const signatureField = new PdfSignatureField(page, 'Signature', { x: sigX, y: sigY, width: sigW, height: sigH });
            const sigOptions = { cryptographicStandard: tc.cryptographicStandard, digestAlgorithm: tc.digestAlgorithm, contactInfo: 'johndoe@owned.us', locationInfo: 'Honolulu, Hawaii', reason: 'I am author of this document.' };
            const signature = PdfSignature.create(PDfpfx, 'password123', sigOptions);
            expect(signature).toBeDefined();
            signatureField.setSignature(signature);
            expect(signature._digestAlgorithm).toEqual(tc.digestAlgorithm);
            expect(signature._cryptographicStandard).toEqual(tc.cryptographicStandard);
            pdf.form.add(signatureField);
            if (logo) {
                const app = signatureField.getAppearance();
                const lx = 20;
                const ly = 20;
                const lw = 120;
                const lh = 50;
                const logoBmp = new PdfBitmap(logo);
                app.normal.graphics.drawImage(logoBmp, { x: lx, y: ly, width: lw, height: lh });
            }
            pdf._addWatermarkText();
            const bytes = pdf.save();
            pdf.destroy();
            const parsed = new PdfDocument(bytes);
            const parsedForm = parsed.form;
            const parsedSignatureField = parsedForm.fieldAt(parsedForm._fields.length - 1);
            const valueDictionary = parsedSignatureField._dictionary.get('V');
            const ByteRange = valueDictionary.get('ByteRange');
            expect(ByteRange).toBeDefined();
            expect(ByteRange.length).toEqual(4);
            expect(valueDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
            expect(valueDictionary.get('Location')).toEqual('Honolulu, Hawaii');
            expect(valueDictionary.get('Reason')).toEqual('I am author of this document.');
            expect(valueDictionary.get('Type').name).toEqual('Sig');
            expect(valueDictionary.get('Contents')).toBeDefined();
            const parsedPage: PdfPage = parsed.getPage(0);
            expect(parsedPage).toBeDefined();
            const contents = parsedPage._pageDictionary.get('Contents');
            expect(contents).toBeDefined();
            let ref; let stream; let parser; let result;
            ref = contents[8];
            expect(ref).toBeDefined();
            stream = parsedPage._crossReference._fetch(ref);
            expect(stream).toBeDefined();
            parser = new _ContentParser(stream.getBytes());
            expect(parser).toBeDefined();
            result = parser._readContent();
            expect(result[0]._operator).toEqual('q');
            expect(result[0]._operands.length).toBe(0);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
            expect(result[2]._operator).toEqual('BT');
            expect(result[2]._operands.length).toBe(0);
            expect(result[3]._operator).toEqual('CS');
            expect(result[3]._operands).toEqual(['/DeviceRGB']);
            expect(result[4]._operator).toEqual('cs');
            expect(result[4]._operands).toEqual(['/DeviceRGB']);
            expect(result[5]._operator).toEqual('rg');
            expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[6]._operator).toEqual('Tf');
            expect(result[7]._operator).toEqual('Tr');
            expect(result[7]._operands).toEqual(['0']);
            expect(result[8]._operator).toEqual('Tc');
            expect(result[8]._operands).toEqual(['0.000']);
            expect(result[9]._operator).toEqual('Tw');
            expect(result[9]._operands).toEqual(['0.000']);
            expect(result[10]._operator).toEqual('Tz');
            expect(result[10]._operands).toEqual(['100.000']);
            expect(result[11]._operator).toEqual('Tm');
            expect(result[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
            expect(result[12]._operator).toEqual("'");
            expect(result[12]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in)']);
            expect(result[13]._operator).toEqual('Tm');
            expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
            expect(result[14]._operator).toEqual("'");
            expect(result[14]._operands).toEqual(['(your application. To obtain the valid key, Click)']);
            expect(result[15]._operator).toEqual('ET');
            expect(result[15]._operands.length).toBe(0);
            expect(result[16]._operator).toEqual('BT');
            expect(result[16]._operands.length).toBe(0);
            expect(result[17]._operator).toEqual('rg');
            expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[18]._operator).toEqual('Tf');
            expect(result[19]._operator).toEqual('Tm');
            expect(result[19]._operands).toEqual(['1.00', '.00', '.00', '1.00', '329.00', '-39.22']);
            expect(result[20]._operator).toEqual("'");
            expect(result[20]._operands).toEqual(['(here)']);
            expect(result[21]._operator).toEqual('ET');
            expect(result[21]._operands.length).toBe(0);
            expect(result[22]._operator).toEqual('q');
            expect(result[22]._operands.length).toBe(0);
            expect(result[23]._operator).toEqual('q');
            expect(result[23]._operands.length).toBe(0);
            expect(result[24]._operator).toEqual('cm');
            expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '297.50', '-421.00']);
            expect(result[25]._operator).toEqual('gs');
            expect(result[26]._operator).toEqual('cm');
            expect(result[26]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
            expect(result[27]._operator).toEqual('BT');
            expect(result[27]._operands.length).toBe(0);
            expect(result[28]._operator).toEqual('rg');
            expect(result[28]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[29]._operator).toEqual('Tf');
            expect(result[30]._operator).toEqual('Tm');
            expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
            expect(result[31]._operator).toEqual("'");
            expect(result[31]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
            expect(result[32]._operator).toEqual('Td');
            expect(result[32]._operands).toEqual(['0.000', '141.442']);
            expect(result[33]._operator).toEqual('ET');
            expect(result[33]._operands.length).toBe(0);
            expect(result[34]._operator).toEqual('Q');
            expect(result[34]._operands.length).toBe(0);
            parsed.destroy();
        });
    }
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
        pdf._addWatermarkText();
        const bytes = pdf.save();
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
    type Case = { title: string; pageSizeName: string; orientation: PdfPageOrientation; margin?: number; };
    const cases: Case[] = [
        { title: 'Portrait (default margins)', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: undefined },
        { title: 'Landscape (no margin)', pageSizeName: 'Letter', orientation: PdfPageOrientation.landscape, margin: 0 },
        { title: 'Large-margin 40', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: 40 },
        { title: 'Small-margin 20', pageSizeName: 'Letter', orientation: PdfPageOrientation.portrait, margin: 20 },
        { title: 'A4 Portrait (default margins)', pageSizeName: 'A4', orientation: PdfPageOrientation.portrait, margin: undefined },
        { title: 'A4 Landscape (margin 30)', pageSizeName: 'A4', orientation: PdfPageOrientation.landscape, margin: 30 },
        { title: 'A5 Portrait (no margin)', pageSizeName: 'A5', orientation: PdfPageOrientation.portrait, margin: 0 },
        { title: 'Legal Landscape (default margins)', pageSizeName: 'Legal', orientation: PdfPageOrientation.landscape, margin: undefined },
    ];
    for (const tc of cases) {
        it(tc.title, () => {
            const { parsed, parsedPage, result, HelveticaRef, HelveticaName } = createAndParsePdf(tc);
            const rawSize = getPageSize(tc.pageSizeName);
            const pageW = tc.orientation === PdfPageOrientation.portrait ? rawSize.width : rawSize.height;
            const pageH = tc.orientation === PdfPageOrientation.portrait ? rawSize.height : rawSize.width;
            switch (tc.title) {
                case 'Portrait (default margins)': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '532.000', '-712.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '532.000', '-712.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '382.00', '-686.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[44]._operator).toEqual('q');
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.00', '-356.00']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    expect(result[52]._operator).toEqual('Tm');
                    expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[53]._operator).toEqual("'");
                    expect(result[53]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[54]._operator).toEqual('Td');
                    expect(result[54]._operands).toEqual(['0.000', '141.442']);
                    expect(result[55]._operator).toEqual('ET');
                    expect(result[56]._operator).toEqual('Q');
                    break;
                }
                case 'Landscape (no margin)': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '612.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['0.000', '0.000', '792.000', '-612.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '792.000', '-612.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '642.00', '-586.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[32]._operands[1]).toEqual('14.000');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '137.57', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('q');
                    expect(result[44]._operands.length).toBe(0);
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '396.00', '-306.00']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[49]._operands.length).toBe(0);
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    expect(result[52]._operator).toEqual('Tm');
                    expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[53]._operator).toEqual("'");
                    expect(result[53]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[54]._operator).toEqual('Td');
                    expect(result[54]._operands).toEqual(['0.000', '141.442']);
                    expect(result[55]._operator).toEqual('ET');
                    expect(result[55]._operands.length).toBe(0);
                    expect(result[56]._operator).toEqual('Q');
                    expect(result[56]._operands.length).toBe(0);
                    break;
                }
                case 'Large-margin 40': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '532.000', '-712.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '532.000', '-712.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '382.00', '-686.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('q');
                    expect(result[44]._operands.length).toBe(0);
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.00', '-356.00']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[49]._operands.length).toBe(0);
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    expect(result[52]._operator).toEqual('Tm');
                    expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[53]._operator).toEqual("'");
                    expect(result[53]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[54]._operator).toEqual('Td');
                    expect(result[54]._operands).toEqual(['0.000', '141.442']);
                    expect(result[55]._operator).toEqual('ET');
                    expect(result[55]._operands.length).toBe(0);
                    expect(result[56]._operator).toEqual('Q');
                    expect(result[56]._operands.length).toBe(0);
                    break;
                }
                case 'Small-margin 20': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['20.000', '-20.000', '572.000', '-752.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '20.00', '-20.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '572.000', '-752.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '422.00', '-726.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(in your application. To obtain the valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '343.79', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('q');
                    expect(result[44]._operands.length).toBe(0);
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '286.00', '-376.00']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[49]._operands.length).toBe(0);
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    expect(result[52]._operator).toEqual('Tm');
                    expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[53]._operator).toEqual("'");
                    expect(result[53]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[54]._operator).toEqual('Td');
                    expect(result[54]._operands).toEqual(['0.000', '141.442']);
                    expect(result[55]._operator).toEqual('ET');
                    expect(result[55]._operands.length).toBe(0);
                    expect(result[56]._operator).toEqual('Q');
                    expect(result[56]._operands.length).toBe(0);
                    break;
                }
                case 'A4 Portrait (default margins)': {
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
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '515.000', '-762.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '365.00', '-736.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(wrong key in your application. To obtain the valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.48', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('q');
                    expect(result[44]._operands.length).toBe(0);
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '257.50', '-381.00']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[49]._operands.length).toBe(0);
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    break;
                }
                case 'A4 Landscape (margin 30)': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '595.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['30.000', '-30.000', '782.000', '-535.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-30.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '782.000', '-535.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '632.00', '-509.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(valid key, Click)']);
                    expect(result[37]._operator).toEqual('ET');
                    expect(result[37]._operands.length).toBe(0);
                    expect(result[38]._operator).toEqual('BT');
                    expect(result[38]._operands.length).toBe(0);
                    expect(result[39]._operator).toEqual('rg');
                    expect(result[39]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[40]._operator).toEqual('Tf');
                    expect(result[41]._operator).toEqual('Tm');
                    expect(result[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '137.57', '-39.22']);
                    expect(result[42]._operator).toEqual("'");
                    expect(result[42]._operands).toEqual(['(here)']);
                    expect(result[43]._operator).toEqual('ET');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('q');
                    expect(result[44]._operands.length).toBe(0);
                    expect(result[45]._operator).toEqual('q');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '391.00', '-267.50']);
                    expect(result[47]._operator).toEqual('gs');
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[49]._operator).toEqual('BT');
                    expect(result[49]._operands.length).toBe(0);
                    expect(result[50]._operator).toEqual('rg');
                    expect(result[50]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[51]._operator).toEqual('Tf');
                    expect(result[52]._operator).toEqual('Tm');
                    expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[53]._operator).toEqual("'");
                    expect(result[53]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[54]._operator).toEqual('Td');
                    expect(result[54]._operands).toEqual(['0.000', '141.442']);
                    expect(result[55]._operator).toEqual('ET');
                    expect(result[55]._operands.length).toBe(0);
                    expect(result[56]._operator).toEqual('Q');
                    expect(result[56]._operands.length).toBe(0);
                    break;
                }
                case 'A5 Portrait (no margin)': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '595.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['0.000', '0.000', '420.000', '-595.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '420.000', '-595.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '270.00', '-569.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or)']);
                    expect(result[35]._operator).toEqual('Tm');
                    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[36]._operator).toEqual("'");
                    expect(result[36]._operands).toEqual(['(registered the wrong key in your application. To obtain)']);
                    expect(result[37]._operator).toEqual('Tm');
                    expect(result[37]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-55.40']);
                    expect(result[38]._operator).toEqual("'");
                    expect(result[38]._operands).toEqual(['(the valid key, Click)']);
                    expect(result[39]._operator).toEqual('ET');
                    expect(result[39]._operands.length).toBe(0);
                    expect(result[40]._operator).toEqual('BT');
                    expect(result[40]._operands.length).toBe(0);
                    expect(result[41]._operator).toEqual('rg');
                    expect(result[41]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[42]._operator).toEqual('Tf');
                    expect(result[43]._operator).toEqual('Tm');
                    expect(result[43]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.92', '-55.40']);
                    expect(result[44]._operator).toEqual("'");
                    expect(result[44]._operands).toEqual(['(here)']);
                    expect(result[45]._operator).toEqual('ET');
                    expect(result[45]._operands.length).toBe(0);
                    expect(result[46]._operator).toEqual('q');
                    expect(result[46]._operands.length).toBe(0);
                    expect(result[47]._operator).toEqual('q');
                    expect(result[47]._operands.length).toBe(0);
                    expect(result[48]._operator).toEqual('cm');
                    expect(result[48]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-297.50']);
                    expect(result[49]._operator).toEqual('gs');
                    expect(result[50]._operator).toEqual('cm');
                    expect(result[50]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[51]._operator).toEqual('BT');
                    expect(result[51]._operands.length).toBe(0);
                    expect(result[52]._operator).toEqual('rg');
                    expect(result[52]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[53]._operator).toEqual('Tf');
                    expect(result[54]._operator).toEqual('Tm');
                    expect(result[54]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[55]._operator).toEqual("'");
                    expect(result[55]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[56]._operator).toEqual('Td');
                    expect(result[56]._operands).toEqual(['0.000', '141.442']);
                    expect(result[57]._operator).toEqual('ET');
                    expect(result[57]._operands.length).toBe(0);
                    expect(result[58]._operator).toEqual('Q');
                    expect(result[58]._operands.length).toBe(0);
                    break;
                }
                case 'Legal Landscape (default margins)': {
                    expect(result[0]._operator).toEqual('q');
                    expect(result[0]._operands.length).toBe(0);
                    expect(result[1]._operator).toEqual('cm');
                    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '612.00']);
                    expect(result[2]._operator).toEqual('re');
                    expect(result[2]._operands).toEqual(['40.000', '-40.000', '928.000', '-532.000']);
                    expect(result[3]._operator).toEqual('h');
                    expect(result[3]._operands.length).toBe(0);
                    expect(result[4]._operator).toEqual('W');
                    expect(result[4]._operands.length).toBe(0);
                    expect(result[5]._operator).toEqual('n');
                    expect(result[5]._operands.length).toBe(0);
                    expect(result[6]._operator).toEqual('cm');
                    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
                    expect(result[7]._operator).toEqual('CS');
                    expect(result[7]._operands).toEqual(['/DeviceRGB']);
                    expect(result[8]._operator).toEqual('cs');
                    expect(result[8]._operands).toEqual(['/DeviceRGB']);
                    expect(result[9]._operator).toEqual('rg');
                    expect(result[9]._operands).toEqual(['0.565', '0.933', '0.565']);
                    expect(result[10]._operator).toEqual('re');
                    expect(result[10]._operands).toEqual(['0.000', '0.000', '928.000', '-532.000']);
                    expect(result[11]._operator).toEqual('f');
                    expect(result[11]._operands.length).toBe(0);
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
                    expect(result[19]._operands.length).toBe(0);
                    expect(result[20]._operator).toEqual('BT');
                    expect(result[20]._operands.length).toBe(0);
                    expect(result[21]._operator).toEqual('rg');
                    expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
                    expect(result[22]._operator).toEqual('Tf');
                    expect(result[23]._operator).toEqual('Tr');
                    expect(result[23]._operands).toEqual(['0']);
                    expect(result[24]._operator).toEqual('Tc');
                    expect(result[24]._operands).toEqual(['0.000']);
                    expect(result[25]._operator).toEqual('Tw');
                    expect(result[25]._operands).toEqual(['0.000']);
                    expect(result[26]._operator).toEqual('Tz');
                    expect(result[26]._operands).toEqual(['100.000']);
                    expect(result[27]._operator).toEqual('Tm');
                    expect(result[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '778.00', '-506.90']);
                    expect(result[28]._operator).toEqual("'");
                    expect(result[28]._operands).toEqual(['(Page 1 of 1)']);
                    expect(result[29]._operator).toEqual('ET');
                    expect(result[29]._operands.length).toBe(0);
                    expect(result[30]._operator).toEqual('BT');
                    expect(result[30]._operands.length).toBe(0);
                    expect(result[31]._operator).toEqual('rg');
                    expect(result[31]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[32]._operator).toEqual('Tf');
                    expect(result[33]._operator).toEqual('Tm');
                    expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-23.03']);
                    expect(result[34]._operator).toEqual("'");
                    expect(result[34]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the valid key, Click)']);
                    expect(result[35]._operator).toEqual('ET');
                    expect(result[35]._operands.length).toBe(0);
                    expect(result[36]._operator).toEqual('BT');
                    expect(result[36]._operands.length).toBe(0);
                    expect(result[37]._operator).toEqual('rg');
                    expect(result[37]._operands).toEqual(['0.000', '0.000', '1.000']);
                    expect(result[38]._operator).toEqual('Tf');
                    expect(result[39]._operator).toEqual('Tm');
                    expect(result[39]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-39.22']);
                    expect(result[40]._operator).toEqual("'");
                    expect(result[40]._operands).toEqual(['(here)']);
                    expect(result[41]._operator).toEqual('ET');
                    expect(result[41]._operands.length).toBe(0);
                    expect(result[42]._operator).toEqual('q');
                    expect(result[42]._operands.length).toBe(0);
                    expect(result[43]._operator).toEqual('q');
                    expect(result[43]._operands.length).toBe(0);
                    expect(result[44]._operator).toEqual('cm');
                    expect(result[44]._operands).toEqual(['1.00', '.00', '.00', '1.00', '464.00', '-266.00']);
                    expect(result[45]._operator).toEqual('gs');
                    expect(result[46]._operator).toEqual('cm');
                    expect(result[46]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
                    expect(result[47]._operator).toEqual('BT');
                    expect(result[47]._operands.length).toBe(0);
                    expect(result[48]._operator).toEqual('rg');
                    expect(result[48]._operands).toEqual(['1.000', '0.000', '0.000']);
                    expect(result[49]._operator).toEqual('Tf');
                    expect(result[50]._operator).toEqual('Tm');
                    expect(result[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-165.72', '-4.94']);
                    expect(result[51]._operator).toEqual("'");
                    expect(result[51]._operands).toEqual(['(Created with a trial version of Syncfusion PDF library.)']);
                    expect(result[52]._operator).toEqual('Td');
                    expect(result[52]._operands).toEqual(['0.000', '141.442']);
                    expect(result[53]._operator).toEqual('ET');
                    expect(result[53]._operands.length).toBe(0);
                    expect(result[54]._operator).toEqual('Q');
                    expect(result[54]._operands.length).toBe(0);
                    break;
                }
                default:
                    throw new Error(`Missing switch expectations for: ${tc.title}`);
            }
            parsed.destroy();
        });
    }
});