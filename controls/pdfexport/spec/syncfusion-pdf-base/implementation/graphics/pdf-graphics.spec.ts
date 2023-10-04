import { PdfStringLayoutResult, PdfPageBase, PdfDocument, PdfTextAlignment, PdfVerticalAlignment } from "../../../../src/index";
import { PdfFontFamily, PdfStringFormat, PdfFont, PdfPen, PdfSolidBrush, PdfStringLayouter } from "../../../../src/index";
import { PdfGraphics, PdfFontStyle, PdfColor, GetResourceEventHandler, PdfStream, PdfGraphicsState } from "../../../../src/index";
import { PdfBrush, PdfStandardFont, PdfBitmap, PdfHorizontalOverflowType, RectangleF } from "../../../../src/index";
import { PdfStreamWriter, PdfTransformationMatrix, PdfPageLayer, PdfString, PdfDestinationMode } from "../../../../src/index";
import { PdfTextWebLink, PdfDocumentLinkAnnotation, PdfDestination, PdfWordWrapType } from "../../../../src/index";
import { PdfGrid, PdfGridRow, PdfBorderOverlapStyle, PdfGridRowStyle, PdfImage, PdfPage } from "../../../../src/index";
import { PdfTemplate, PdfSubSuperScript, SizeF, PointF } from "../../../../src/index";
describe('PdfGraphics.ts - constructor initializing',()=>{
    let page : PdfPage = new PdfPage();
    let stream : PdfStream = new PdfStream();
    let size : SizeF = new SizeF();
    let streamWriter : PdfStreamWriter = new PdfStreamWriter(stream);
    let writer : GetResourceEventHandler = new GetResourceEventHandler(page);
    let t1 : PdfGraphics = new PdfGraphics(size, writer, streamWriter); 
    it('-Size != undefined', () => {
        expect(t1.size).not.toBeUndefined();
    })
    it('-MediaBoxUpperRightBound != undefined', () => {
        expect(t1.mediaBoxUpperRightBound).not.toBeUndefined();
    })
    it('-Set MediaBoxUpperRightBound', () => {
        t1.mediaBoxUpperRightBound = null;
        expect(t1.mediaBoxUpperRightBound).toBeNull();
    })
    it('-ClientSize != undefined', () => {
        expect(t1.clientSize).not.toBeUndefined();
    })
    it('-ColorSpace != undefined', () => {
        expect(t1.colorSpace).not.toBeUndefined();
    })
    it('-Set ColorSpace', () => {
        t1.colorSpace = null;
        expect(t1.colorSpace).toBeNull();
    })
    it('-StreamWriter != undefined', () => {
        expect(t1.streamWriter).not.toBeUndefined();
    })
    it('-Matrix != undefined', () => {
        expect(t1.matrix).not.toBeUndefined();
    })
    it('-Layer != undefined', () => {
        expect(t1.layer).toBeUndefined();
    })
    it('-this.InitializeCoordinates() method calling', () => {
        expect(t1.mediaBoxUpperRightBound).not.toBeUndefined();
        let bound : number;
        // t1.translateTransform(0, PdfGraphics.UpdateY(bound));
        expect(t1.translateTransform).not.toBeUndefined();
    })
    // afterAll( () => {
        let document : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document.pages.add();
        let font1 : PdfStandardFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 8);
        font1.style = PdfFontStyle.Bold;
        let font2 : PdfStandardFont = new PdfStandardFont(font1, 8, PdfFontStyle.Bold);
        let g1 : PdfGraphics = page1.graphics;
        let stringFormat : PdfStringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.Center;
        stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
        let stringFormat1 : PdfStringFormat = new PdfStringFormat();
        stringFormat1.alignment = PdfTextAlignment.Right;
        stringFormat1.lineAlignment = PdfVerticalAlignment.Bottom;
        stringFormat1.wordSpacing = 1;
        stringFormat1.lineSpacing = 1;
        g1.isEmfTextScaled = false;
        g1.isBaselineFormat = false;
        g1.drawString('String', font1, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 5, null);
        g1.drawString('String', font2, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 10, stringFormat);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 30, null);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 35, stringFormat);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 50, null);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 55, stringFormat);
        g1.drawString('String', font1, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 75, 50, 50, null);
        g1.drawString('String', font1, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 70, 50, 50, stringFormat);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 80, 50, 50, null);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 85, 50, 50, stringFormat);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 115, 50, 50, stringFormat);
        g1.drawLine(new PdfPen(new PdfColor(0, 0, 0)), new PointF(250, 30), new PointF(420, 30));
        g1.drawRectangle(new PdfPen(new PdfColor(0, 0, 0)), 250, 100, 410, 210);
        g1.drawRectangle(new PdfSolidBrush(new PdfColor(0, 0, 0)), 250, 110, 390, 190);
        g1.drawRectangle(null, null, 10, 10, 20, 20);
        g1.drawRectangle(new PdfPen(new PdfColor(), 10), new PdfSolidBrush(new PdfColor()), 200, 50, 50, 50);
        g1.drawString('String', font1, new PdfPen(new PdfColor(0, 0, 0)), null, 10, 85, -1, 50, stringFormat);

        let page2 : PdfPage = document.pages.add();
        let g2 : PdfGraphics = page2.graphics;
        g2.setClip(new RectangleF(80, 500, 100, 15));
        g2.drawString('Syncfusion', new PdfStandardFont(PdfFontFamily.TimesRoman, 20), null, new PdfSolidBrush(new PdfColor(0, 128, 0)), 80, 500, null);
        stringFormat.horizontalScalingFactor = 50;
        stringFormat1.horizontalScalingFactor = 40;
    it('-GetLineBounds(0,new PdfStringLayoutResult(), font1, new RectangleF(), stringFormat).x) == 0', () => {
        expect(g1.getLineBounds(0,new PdfStringLayoutResult(), font1, new RectangleF(), stringFormat).x).toEqual(0);
    })
    let resoucers : GetResourceEventHandler;
    let t2 : PdfStreamWriter = new PdfStreamWriter(stream);
    it('-this.constructor(SizeF, GetResourceEventHandler, PdfStreamWriter)', () => {
        expect(function (): void {t1 = new PdfGraphics(size, resoucers, null); }).toThrowError();
    })
    it('-this.constructor(SizeF, GetResourceEventHandler, PdfStreamWriter)', () => {
        expect(function (): void {t1 = new PdfGraphics(size, null, t2); }).toThrowError();
    })
    let rect : RectangleF = new RectangleF();
    let result : PdfStringLayoutResult = new PdfStringLayoutResult();
    //Underline text
    let font3 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20, PdfFontStyle.Underline);
    g1.drawString('String', font3, new PdfPen(new PdfColor(0, 0, 0)), new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 65, stringFormat);
    //Strikeout text
    let font4 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20, PdfFontStyle.Strikeout);
    g1.drawString('String', font4, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 65, stringFormat);
    //set haswordspacing property
    stringFormat.wordSpacing = 3;
    g1.drawString('String testing', font3, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 65, stringFormat);

    let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
    //DrawImage overloads
    let page3 : PdfPage = document.pages.add();
    let graphics3 : PdfGraphics = page3.graphics;
    let encodedString : string = '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';
    let image : PdfImage = new PdfBitmap(encodedString);

    //Transformations
    let page4 : PdfPage = document.pages.add();
    let graphics4 : PdfGraphics = page4.graphics;
    graphics4.save();
    graphics4.drawString("Transparency in PdfGraphics", font, null, new PdfSolidBrush(new PdfColor(0, 0, 0)), 10, 10, null);
    graphics4.setTransparency(0.5);
    graphics4.drawRectangle(new PdfPen(new PdfColor(0, 0, 255)), 10, 50, 30, 30);
    graphics4.restore();
    graphics4.save();
    graphics4.setTransparency(0.5, 0.3);
    graphics4.drawRectangle(new PdfSolidBrush(new PdfColor(0, 0, 255)), 10, 85, 30, 30);
    graphics4.restore();
    graphics4.save();
    graphics4.setTransparency(0.5);
    graphics4.drawRectangle(new PdfPen(new PdfColor(255, 0, 0)), new PdfSolidBrush(new PdfColor(0, 0, 255)), 10, 120, 30, 30);
    graphics4.restore();
    
    let page_4 : PdfPage = document.pages.add();
    let graphics_4 : PdfGraphics = page_4.graphics;
    graphics_4.drawLine(new PdfPen(new PdfColor(0, 128, 0)), new PointF(10, 10), new PointF(50, 50));
    let state1 : PdfGraphicsState = graphics_4.save();
    graphics_4.translateTransform(50, 0);
    graphics_4.drawLine(new PdfPen(new PdfColor(0, 128, 0)), new PointF(10, 10), new PointF(50, 50));
    graphics_4.restore(state1);
    state1 = graphics_4.save();
    graphics_4.scaleTransform(2, 2);
    graphics_4.drawLine(new PdfPen(new PdfColor(0, 128, 0)), new PointF(10, 100), new PointF(50, 150));
    graphics_4.restore(state1);
    state1 = graphics_4.save();
    graphics_4.drawLine(new PdfPen(new PdfColor(0, 128, 0)), new PointF(10, 100), new PointF(50, 150));
    graphics_4.drawRectangle(new PdfPen(new PdfColor(0, 0, 255)), 100, 250, 50, 50);
    graphics_4.rotateTransform(10);
    graphics_4.drawRectangle(new PdfPen(new PdfColor(0, 0, 255)), 100, 250, 50, 50);
    graphics_4.restore(state1);
    state1 = graphics_4.save();
    graphics_4.drawRectangle(new PdfPen(new PdfColor(0, 0, 255)), 160, 250, 50, 50);

    graphics_4.setClip(new RectangleF(80, 400, 100, 100));
    graphics_4.drawImage(image, 100, 380);
    graphics_4.restore();
    graphics_4.setClip(new RectangleF(80, 500, 100, 15));

    let page6 : PdfPage = document.pages.add();
    //PdfGrid overloads
    let pdfGrid : PdfGrid = new PdfGrid();
    pdfGrid.style.cellPadding.all = 10;
    pdfGrid.style.cellSpacing = 5;
    pdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
    pdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(70, 130, 180));
    pdfGrid.style.backgroundBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
    pdfGrid.style.font = font;
    pdfGrid.style.borderOverlapStyle = PdfBorderOverlapStyle.Inside;
    pdfGrid.style.allowHorizontalOverflow = true;
    pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.LastPage;
    pdfGrid.columns.add(12);
    pdfGrid.headers.add(1);
    let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
    pdfGridHeader.cells.getCell(0).value = "Employee ID 1";
    pdfGridHeader.cells.getCell(1).value = "Employee Name";
    pdfGridHeader.cells.getCell(2).value = "Salary";
    pdfGridHeader.cells.getCell(3).value = "Employee ID 2";
    pdfGridHeader.cells.getCell(4).value = "Employee Name";
    pdfGridHeader.cells.getCell(5).value = "Salary";
    pdfGridHeader.cells.getCell(6).value = "Employee ID 3";
    pdfGridHeader.cells.getCell(7).value = "Employee Name";
    pdfGridHeader.cells.getCell(8).value = "Salary";
    pdfGridHeader.cells.getCell(9).value = "Employee ID 4";
    pdfGridHeader.cells.getCell(10).value = "Employee Name";
    pdfGridHeader.cells.getCell(11).value = "Salary";
    for (let i : number = 0; i < 20 ; i++) {
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E" + i + "- 1";
        pdfGridRow1.cells.getCell(1).value = "Clay";
        pdfGridRow1.cells.getCell(2).value = "$15,000";
        pdfGridRow1.cells.getCell(3).value = "E" + i + "- 2";
        pdfGridRow1.cells.getCell(4).value = "David";
        pdfGridRow1.cells.getCell(5).value = "$16,000";
        pdfGridRow1.cells.getCell(6).value = "E" + i + "- 3";
        pdfGridRow1.cells.getCell(7).value = "Sam";
        pdfGridRow1.cells.getCell(8).value = "$17,000";
        pdfGridRow1.cells.getCell(9).value = "E" + i + "- 4";
        pdfGridRow1.cells.getCell(10).value = "Joy";
        pdfGridRow1.cells.getCell(11).value = "$18,000";
    }
    let pdfGridRowStyle : PdfGridRowStyle = new PdfGridRowStyle();
    pdfGridRowStyle.setBackgroundBrush(new PdfSolidBrush(new PdfColor(255, 255, 224)));
    pdfGridRowStyle.setFont(new PdfStandardFont(PdfFontFamily.Courier, 30));
    pdfGridRowStyle.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 255)));
    pdfGridRowStyle.setTextPen(new PdfPen(new PdfColor(221, 160, 221)));
    pdfGrid.rows.getRow(2).height = 50;
    pdfGrid.rows.getRow(0).style = pdfGridRowStyle;
    let gridFormat1 : PdfStringFormat = new PdfStringFormat();
    gridFormat1.alignment = PdfTextAlignment.Center;
    let gridFormat2 : PdfStringFormat = new PdfStringFormat();
    gridFormat2.alignment = PdfTextAlignment.Justify;
    pdfGrid.columns.getColumn(0).format = gridFormat1;
    pdfGrid.columns.getColumn(1).format = gridFormat2;
    //Draw the PdfGrid.
    pdfGrid.draw(page6, new RectangleF(0, 0, page4.graphics.clientSize.width, page4.graphics.clientSize.height));
    // Page Number Field - test case
    it('-graphics4.drawPdfTemplate(null, new PointF(0, 0))', () => {
        expect(function (): void {graphics4.drawPdfTemplate(null, new PointF(0, 0)) }).toThrowError();
    })
    it('-graphics4.drawPdfTemplate(null, new PointF(0, 0), new SizeF(10, 20))', () => {
        expect(function (): void {graphics4.drawPdfTemplate(null, new PointF(0, 0), new SizeF(10, 20)); }).toThrowError();
    })
    it('-graphics4.drawPdfTemplate(null, new PointF(0, 0), new SizeF(10, 20))', () => {
        expect(function (): void {graphics4.drawPdfTemplate(new PdfTemplate(), new PointF(0, 0), new SizeF(10, 20)); }).toThrowError();
    })
    it('-graphics4.drawPdfTemplate(null, new PointF(0, 0)', () => {
        expect(function (): void {graphics4.drawPdfTemplate(new PdfTemplate(), new PointF(0, 0)); }).toThrowError();
    })

    //Draw paragraph text
    let document1 : PdfDocument = new PdfDocument();
    let page7 : PdfPage = document1.pages.add();
    let graphics5 : PdfGraphics = page7.graphics;
    stringFormat.wordWrap = PdfWordWrapType.Word;
    graphics5.drawString('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati', font, null, new PdfSolidBrush(new PdfColor(100,0,0)), 0, 0, stringFormat);
    graphics5.drawString('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati', font, null, new PdfSolidBrush(new PdfColor(100,0,0)), 0, 0, graphics5.clientSize.width, graphics5.clientSize.height, stringFormat);
    stringFormat.wordWrap = PdfWordWrapType.Character;
    graphics5.drawString('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati', font, null, new PdfSolidBrush(new PdfColor(100,0,0)), 0, 0, graphics5.clientSize.width, graphics5.clientSize.height, stringFormat);

    // create a new PDF document
    let document5 : PdfDocument = new PdfDocument();
    // add pages to the document.
    let page8 : PdfPage = document5.pages.add();
    // set the font.
    let font11 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
    let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
    let bluePen : PdfPen = new PdfPen(new PdfColor(0, 0, 126));
    let format2 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify, PdfVerticalAlignment.Bottom);
    format2.wordSpacing = 3;
    let format3 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center, PdfVerticalAlignment.Middle);
    format3.subSuperScript = PdfSubSuperScript.SubScript;
    let format4 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center, PdfVerticalAlignment.Middle);
    format4.lineSpacing = 5;
    // draw the text.
    page8.graphics.drawString('Hello World!!!', font11, bluePen, blackBrush, 20, 150, 400, 50, format2);
    page8.graphics.drawString('Hello World!!!', font11, bluePen, blackBrush, 20, 200, 400, 50, format3);
    page8.graphics.drawString('Hello World!!!', font11, bluePen, blackBrush, 20, 250, 400, 50, format4);
});
describe('PdfGraphicsState.ts', () => {
    describe('constructor initializing',()=>{
        let t1 : PdfGraphicsState = new PdfGraphicsState();
        it('-t1.graphics == undefined', () => {
            expect(t1.graphics).toBeUndefined();
        })
    })
})

