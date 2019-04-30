/**
 * spec document for PdfGridStyleBase.ts class
 */
import { PdfBrush, PdfSolidBrush, PdfFontFamily, PdfColor, PdfPen, PdfStandardFont, PdfStringFormat } from "../../../../../../src/index";
import { PdfBorderOverlapStyle, PdfGridRow, PdfDocument, PdfFont, PdfPage, PointF } from "../../../../../../src/index";
import { PdfGridStyle, PdfGridCellStyle, PdfGridRowStyle } from "../../../../../../src/index";
import { PdfPaddings, PdfBorders, PdfGrid } from "../../../../../../src/index";

describe('PdfGridStyleBase.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfGridStyle = new PdfGridStyle();
        it('-BackgroundBrush == undefined', () => {
            expect(t1.backgroundBrush).toBeUndefined();
        })
        it('-Set BackgroundBrush', () => {
            let color : PdfColor = new PdfColor();
            let value : PdfBrush = new PdfSolidBrush(color);
            t1.backgroundBrush = value;
            expect(t1.backgroundBrush).not.toBeUndefined();
        })
        it('-textBrush == undefined', () => {
            expect(t1.textBrush).toBeUndefined();
        })
        it('-Set textBrush', () => {
            let color : PdfColor = new PdfColor();
            let value : PdfBrush = new PdfSolidBrush(color);
            t1.textBrush = value;
            expect(t1.textBrush).not.toBeUndefined();
        })
        it('-TextPen == undefined', () => {
            expect(t1.textPen).toBeUndefined();
        })
        it('-Set TextPen', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
            t1.textPen = value;
            expect(t1.textPen).not.toBeUndefined();
        })
        it('-Font == undefined', () => {
            expect(t1.font).toBeUndefined();
        })
        it('-Set Font', () => {
            let value : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Courier, 10);
            t1.font = value;
            expect(t1.font).not.toBeUndefined();
        })
    })
})

describe('PdfGridStyle.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfGridStyle = new PdfGridStyle();
        it('-CellSpacing != undefined', () => {
            expect(t1.cellSpacing).not.toBeUndefined();
        })
        it('-Set CellSpacing', () => {
            t1.cellSpacing = 5;
            expect(t1.cellSpacing).toEqual(5);
        })
        it('-HorizontalOverflowType != undefined', () => {
            expect(t1.horizontalOverflowType).not.toBeUndefined();
        })
        // it('-Set HorizontalOverflowType', () => {
        //     let value : PdfHorizontalOverflowType.LastPage;
        //     t1.HorizontalOverflowType = value;
        //     expect(t1.HorizontalOverflowType).toBeUndefined();
        // })
        it('-AllowHorizontalOverflow == false', () => {
            expect(t1.allowHorizontalOverflow).toBeFalsy();
        })
        it('-Set AllowHorizontalOverflow', () => {
            t1.allowHorizontalOverflow = true;
            expect(t1.allowHorizontalOverflow).toBeTruthy();
        })
        it('-cellPadding != undefined', () => {
            expect(t1.cellPadding).not.toBeUndefined();
        })
        it('-set cellPadding.All == 4', () => {
            t1.cellPadding = new PdfPaddings();
            t1.cellPadding.all = 4;
            expect(t1.cellPadding.all).toBeUndefined();
        })
        it('-BorderOverlapStyle != undefined', () => {
            expect(t1.borderOverlapStyle).not.toBeUndefined();
        })
        it('-Set BorderOverlapStyle', () => {
            let value : PdfBorderOverlapStyle.Overlap;
            t1.borderOverlapStyle = value;
            expect(t1.borderOverlapStyle).toBeUndefined();
        })
        let t2 : PdfGridStyle = new PdfGridStyle();
        t2.cellPadding = undefined;
        t2.cellPadding = new PdfPaddings();
    })
})

describe('PdfGridCellStyle.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfGridCellStyle = new PdfGridCellStyle();
        it('-StringFormat == undefined', () => {
            expect(t1.stringFormat).toBeUndefined();
        })
        it('-Set StringFormat', () => {
            let value : PdfStringFormat = new PdfStringFormat();
            t1.stringFormat = value;
            expect(t1.stringFormat).not.toBeUndefined();
        })
        it('-Borders != undefined', () => {
            expect(t1.borders).not.toBeUndefined();
        })
        it('-Set Borders', () => {
            let value : PdfBorders = new PdfBorders();
            t1.borders = value;
            expect(t1.borders).not.toBeUndefined();
        })
        it('-cellPadding == undefined ', () => {
            expect(t1.cellPadding).toBeUndefined();
        })
        it('-Set cellPadding', () => {
            let value : PdfPaddings = new PdfPaddings();
            t1.cellPadding = value;
            t1.cellPadding = value;
            expect(t1.cellPadding).not.toBeUndefined();
        })
    })
})
describe('PdfGridRowStyle.ts', () => {
    describe('Constructor initializing',()=> {
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let grid : PdfGrid =new PdfGrid();
        grid.columns.add(3);
        grid.headers.add(1);
        let header : PdfGridRow= grid.headers.getHeader(0);
        header.cells.getCell(0).value="Employee ID";
        header.cells.getCell(1).value="Employee Name";
        header.cells.getCell(2).value="Salary";
        
        let gridRow1 : PdfGridRow = grid.rows.addRow();
        gridRow1.cells.getCell(0).value="E01";
        gridRow1.cells.getCell(1).value="clay";
        gridRow1.cells.getCell(2).value="$10,000";
        let rowStyle1 : PdfGridRowStyle = new PdfGridRowStyle();
        rowStyle1.setTextPen(new PdfPen(new PdfColor(255,0,0)));
        rowStyle1.setTextBrush(new PdfSolidBrush(new PdfColor(0,128,0)));
        rowStyle1.setFont(font);
        rowStyle1.setBorder(new PdfBorders());
        rowStyle1.border.all = new PdfPen(new PdfColor(255,0,0));
        rowStyle1.setBackgroundBrush(new PdfSolidBrush(new PdfColor(25,240,0)));
        gridRow1.style = rowStyle1;
        
        let gridRow2 : PdfGridRow = grid.rows.addRow();
        gridRow2.cells.getCell(0).value="E02";
        gridRow2.cells.getCell(1).value="John";
        gridRow2.cells.getCell(2).value="$20,000";
        gridRow2.style.setTextPen(new PdfPen(new PdfColor(255,0,0)));
        gridRow2.style.setTextBrush(new PdfSolidBrush(new PdfColor(0,128,0)));
        gridRow2.style.setFont(font);
        let border : PdfBorders = new PdfBorders();
        border.all = new PdfPen(new PdfColor(255,0,0));
        gridRow2.style.setBorder(border);
        gridRow2.style.setBackgroundBrush(new PdfSolidBrush(new PdfColor(25,240,0)));
        
        let gridRow3 : PdfGridRow = grid.rows.addRow();
        gridRow3.cells.getCell(0).value="E02";
        gridRow3.cells.getCell(1).value="John";
        gridRow3.cells.getCell(2).value="$20,000";
        let rowStyle3 : PdfGridRowStyle = new PdfGridRowStyle();
        gridRow3.style = rowStyle3;
        
        grid.draw(page,new PointF(0,0));
        it('row 1 - Applying font using row style class', () => {
            expect(grid.rows.getRow(0).cells.getCell(0).style.font).toEqual(font);
        })
        it('row 1 - Applying text brush using row style class', () => {
            let brush : PdfBrush = new PdfSolidBrush(new PdfColor(0,128,0));
            expect(grid.rows.getRow(0).cells.getCell(1).style.textBrush).toEqual(brush);
        })
        it('row 1 - Applying text pen using row style class', () => {
            let pen : PdfPen = new PdfPen(new PdfColor(255,0,0));
            expect(grid.rows.getRow(0).cells.getCell(2).style.textPen).toEqual(pen);
        })
        it('row 1 - Applying background brush using row style class', () => {
            let brush : PdfBrush = new PdfSolidBrush(new PdfColor(25,240,0));
            expect(grid.rows.getRow(0).cells.getCell(1).style.backgroundBrush).toEqual(brush);
        })
        it('row 1 - Applying border using row style class', () => {
            expect(grid.rows.getRow(0).cells.getCell(2).style.borders).toEqual(border);
        })
        it('row 2 - Applying font using row style class', () => {
            expect(grid.rows.getRow(1).cells.getCell(0).style.font).toEqual(font);
        })
        it('row 2 - Applying text brush using row style class', () => {
            let brush : PdfBrush = new PdfSolidBrush(new PdfColor(0,128,0));
            expect(grid.rows.getRow(1).cells.getCell(1).style.textBrush).toEqual(brush);
        })
        it('row 2 - Applying text pen using row style class', () => {
            let pen : PdfPen = new PdfPen(new PdfColor(255,0,0));
            expect(grid.rows.getRow(1).cells.getCell(2).style.textPen).toEqual(pen);
        })
        it('row 2 - Applying background brush using row style class', () => {
            let brush : PdfBrush = new PdfSolidBrush(new PdfColor(25,240,0));
            expect(grid.rows.getRow(1).cells.getCell(1).style.backgroundBrush).toEqual(brush);
        })
        it('row 2 - Applying border using row style class', () => {
            expect(grid.rows.getRow(1).cells.getCell(2).style.borders).toEqual(border);
        })
    })
})