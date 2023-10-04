/**
 * spec document for PdfGridRow.ts class
 */

import { PdfGrid } from "../../../../../src/index";
import { PdfGridRow, PdfGridRowCollection, PdfGridHeaderCollection } from "../../../../../src/index";
import { PdfGridRowStyle, PdfFont, PdfFontFamily, PdfStandardFont } from "../../../../../src/index";
import { PdfDocument, PdfPage, PdfHorizontalOverflowType, RectangleF } from '../../../../../src/index';

describe('PdfGridRow.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let t1 : PdfGridRow = new PdfGridRow(grid);
        it('-rowSpanExists == false', () => {
            expect(t1.rowSpanExists).toBeFalsy();
        })
        it('-Set rowSpanExists', () => {
            t1.rowSpanExists = true;
            expect(t1.rowSpanExists).toBeTruthy();
        })
        it('-cells != undefined', () => {
            expect(t1.cells).not.toBeUndefined();
        })
        it('-grid != undefined', () => {
            expect(t1.grid).not.toBeUndefined();
        })
        it('-Set grid', () => {
            t1.grid = grid;
            expect(t1.grid).not.toBeUndefined();
        })
        it('-style != undefined', () => {
            expect(t1.style).not.toBeUndefined();
        })
        it('-Set style', () => {
            let value : PdfGridRowStyle = new PdfGridRowStyle();
            t1.style = value;
            expect(t1.style).not.toBeUndefined();
        })
        it('-rowBreakHeight != undefined', () => {
            expect(t1.rowBreakHeight).not.toBeUndefined();
        })
        it('-Set rowBreakHeight', () => {
            t1.rowBreakHeight = 5;
            expect(t1.rowBreakHeight).toEqual(5);
        })
        it('-height != undefined', () => {
            let testGrid : PdfGrid = new PdfGrid();
            testGrid.columns.add(3);
            testGrid.headers.add(1);
            let pdfGridHeader3 : PdfGridRow = testGrid.headers.getHeader(0);
            pdfGridHeader3.cells.getCell(0).value = 'ID';
            pdfGridHeader3.cells.getCell(1).value = 'Company name';
            pdfGridHeader3.cells.getCell(2).value = 'Salary';
            for (let i : number = 0; i < 50; i++) {
                let pdfGridRow1 : PdfGridRow = testGrid.rows.addRow();
                pdfGridRow1.cells.getCell(0).value = 'E-1';
                pdfGridRow1.cells.getCell(0).rowSpan = 3;
                pdfGridRow1.cells.getCell(0).rowSpanRemainingHeight = 3;
                pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
                pdfGridRow1.cells.getCell(2).value = '$15,000';
            }
            expect(testGrid.rows.getRow(0).height).not.toBeUndefined();
        })
        it('-Set height', () => {
            t1.height = 20;
            expect(t1.height).toEqual(20);
        })
        it('-columnSpanExists == false', () => {
            expect(t1.columnSpanExists).toBeFalsy();
        })
        it('-Set columnSpanExists', () => {
            t1.columnSpanExists = true;
            expect(t1.columnSpanExists).toBeTruthy();
        })
        it('-rowMergeComplete == true', () => {
            expect(t1.rowMergeComplete).toBeTruthy();
        })
        it('-Set rowMergeComplete', () => {
            t1.rowMergeComplete = true;
            expect(t1.rowMergeComplete).toBeTruthy();
        })
        it('-rowIndex == -1', () => {
            expect(t1.rowIndex).toEqual(-1);
        })
        /* tslint:disable */
        let document : PdfDocument = new PdfDocument();
        let tempPage : PdfPage = document.pages.add();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Courier, 30);
        //PdfGrid Implementation
        let tempPdfGrid : PdfGrid = new PdfGrid();
        //Set AllowHorizontalOverflow for NextPage,LastPage Properties
        tempPdfGrid.style.allowHorizontalOverflow = true;
        //Set HorizontalOverflowType as NextPage
        tempPdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        //Add 12 columns.
        tempPdfGrid.columns.add(12);
        //Add rows.
        for (let i : number = 0; i < 60 ; i++) {
            let pdfGridRow1 : PdfGridRow = tempPdfGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = "E" + i + "- 1";
            pdfGridRow1.cells.getCell(1).value = "Clay";
            pdfGridRow1.cells.getCell(2).value = "$15,000";
            pdfGridRow1.cells.getCell(2).style.font = font;
            pdfGridRow1.cells.getCell(3).value = "E" + i + "- 2";
            pdfGridRow1.cells.getCell(4).value = "David";
            pdfGridRow1.cells.getCell(5).value = "$16,000";
            pdfGridRow1.cells.getCell(5).style.font = font;
            pdfGridRow1.cells.getCell(6).value = "E" + i + "- 3";
            pdfGridRow1.cells.getCell(7).value = "Sam";
            pdfGridRow1.cells.getCell(8).value = "$17,000";
            pdfGridRow1.cells.getCell(8).style.font = font;
            pdfGridRow1.cells.getCell(9).value = "E" + i + "- 4";
            pdfGridRow1.cells.getCell(10).value = "Joy";
            pdfGridRow1.cells.getCell(11).value = "$18,000";
        }
        //Draw the PdfGrid.
        tempPdfGrid.draw(tempPage, new RectangleF(0, 0, tempPage.graphics.clientSize.width, tempPage.graphics.clientSize.height));
        /* tslint:enable */
    })
})

describe('PdfGridRowCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let t1 : PdfGridRowCollection = new PdfGridRowCollection(grid);
        it('-count == 1', () => {
            expect(t1.count).toEqual(1);
        })
        t1.addRow();
        it('-this.AddRow() method calling', () => {
            expect(t1.addRow()).not.toBeUndefined();
        })
    })
})

describe('PdfGridHeaderCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let t1 : PdfGridHeaderCollection = new PdfGridHeaderCollection(grid);
        it('-count == 4', () => {
            expect(t1.count).toEqual(4);
        })
        t1.getHeader(5);
        it('-this.GetHeader(number) method calling', () => {
            expect(t1.getHeader(5)).toBeUndefined();
        })
        let row : PdfGridRow = new PdfGridRow(grid);
        t1.add(3);
        it('-this.Add(number) method calling', () => {
            expect(t1.add(3)).not.toBeUndefined();
        })
        t1.add(row);
        it('-this.Add(PdfGridRow) method calling', () => {
            expect(t1.add(row)).toBeUndefined();
        })
    })
})