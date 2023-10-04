/**
//  * spec document for PdfGridCell.ts class
//  */

import { PdfStringFormat, PdfDocument, PdfPage, PdfGraphics, RectangleF } from "../../../../../src/index";
import { PdfGrid } from "../../../../../src/index";
import { PdfGridCell, PdfGridCellCollection } from "../../../../../src/index";
import { PdfGridRow } from "../../../../../src/index";
import { PdfGridCellStyle } from "../../../../../src/index";
import { PdfStandardFont, PdfFontFamily, PdfBorders, PdfSolidBrush, PointF } from "../../../../../src/index";
import { PdfPaddings, PdfPen, PdfColor, PdfDashStyle, PdfFont, SizeF, PdfTextAlignment } from "../../../../../src/index";

describe('PdfGridCell.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let gridRow : PdfGridRow = new PdfGridRow(grid);
        let t1 : PdfGridCell = new PdfGridCell();
        let t2 : PdfGridCell = new PdfGridCell(gridRow);
        let t3 : PdfGridCell = new PdfGridCell(gridRow);
        it('-RemainingString == undefined', () => {
            expect(t1.remainingString).toBeUndefined();
        })
        it('-Set RemainingString', () => {
            t1.remainingString = 'grid';
            expect(t1.remainingString).toEqual('grid');
        })
        it('-stringFormat != undefined', () => {
            expect(t1.stringFormat).not.toBeUndefined();
        })
        it('-Set stringFormat', () => {
            let value : PdfStringFormat = new PdfStringFormat();
            t1.stringFormat = value;
            expect(t1.stringFormat).not.toBeUndefined();
        })
        it('-row == undefined', () => {
            expect(t1.row).toBeUndefined();
        })
        it('-Set row', () => {
            t1.row = gridRow;
            expect(t1.row).not.toBeUndefined();
        })
        it('-value == undefined', () => {
            expect(t1.value).toBeUndefined();
        })
        it('-Set value', () => {
            t1.value = 1;
            expect(t1.value).toEqual(1);
        })
        it('-rowSpan == 1', () => {
            expect(t1.rowSpan).toEqual(1);
        })
        it('-Set rowSpan == 3', () => {
            t1.rowSpan = 3;
            expect(t1.rowSpan).toEqual(3);
        })
        it('-Set rowSpan == -1', () => {
            expect(function (): void {t1.rowSpan = -1; }).toThrowError();
        })

        it('-style != undefined', () => {
            expect(t1.style).not.toBeUndefined();
        })
        it('-Set style', () => {
            let value : PdfGridCellStyle = new PdfGridCellStyle();
            t1.style = value;
            expect(t1.style).not.toBeUndefined();
        })
        // it('-height == undefined', () => {
        //     expect(t1.height).toBeUndefined();
        // })
        it('-Set height', () => {
            t1.height = 50;
            expect(t1.height).toEqual(50);
        })
        it('-columnSpan == 1', () => {
            expect(t1.columnSpan).toEqual(1);
        })
        it('-Set columnSpan == 3', () => {
            t1.columnSpan = 3;
            expect(t1.columnSpan).toEqual(3);
        })
        it('-Set columnSpan == -1', () => {
            expect(function (): void {t1.columnSpan = -1;}).toThrowError();
        })
        it('-width == 5.52', () => {
            expect(t1.width).not.toBeNull();
        })
        it('-Set width', () => {
            t1.width = 1;
            expect(t1.width).toEqual(1);
        })
        it('-isRowMergeStart == true', () => {
            t1.isRowMergeStart = true;
            expect(t1.isRowMergeStart).not.toBeNull();
        })
        it('-isCellMergeStart == true', () => {
            t1.isCellMergeStart = true;
            expect(t1.isCellMergeStart).not.toBeNull();
        })
        it('-isRowMergeContinue == true', () => {
            t1.isRowMergeContinue = true;
            expect(t1.isRowMergeContinue).not.toBeNull();
        })
        it('-isCellMergeContinue == true', () => {
            t1.isCellMergeContinue = true;
            expect(t1.isCellMergeContinue).not.toBeNull();
        })

        let document : PdfDocument = new PdfDocument()
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(50, 50));
        t2.drawCellBackground(graphics, rect);
        t2.drawCellBorders(graphics, rect);

        t2.style.cellPadding = new PdfPaddings(2, 3, 4, 5);
        t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
        // t2.rowSpan = 2;
        t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
        t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
        
        let border : PdfBorders = new PdfBorders();
        let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 255), 10);
        pen.dashStyle = PdfDashStyle.Dot;
        border.all = pen;
        t2.style.borders = border;
        t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)));
        
        t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 500), new SizeF(50, 600)));

        it('Grid.style.font != null && GetTextFont() calling', () => {
            let document : PdfDocument = new PdfDocument();
            let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
            let page : PdfPage = document.pages.add();
            let grid : PdfGrid = new PdfGrid();
            grid.columns.add(3);
            //Add header.
            grid.headers.add(1);
            let pdfGridHeader3 : PdfGridRow = grid.headers.getHeader(0);
            pdfGridHeader3.cells.getCell(0).value = 'ID';
            pdfGridHeader3.cells.getCell(0).style.font = font;
            pdfGridHeader3.cells.getCell(0).style.textBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
            pdfGridHeader3.cells.getCell(0).style.textPen = new PdfPen(new PdfColor(127, 255, 212));
            pdfGridHeader3.cells.getCell(0).style.backgroundBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
            pdfGridHeader3.cells.getCell(0).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Center);
            pdfGridHeader3.cells.getCell(1).value = 'Company name';
            pdfGridHeader3.cells.getCell(2).value = 'Salary';
            for (let i : number = 0; i < 50; i++) {
                let pdfGridRow1 : PdfGridRow = grid.rows.addRow();
                pdfGridRow1.cells.getCell(0).value = 'E-1';
                pdfGridRow1.cells.getCell(0).style.font = font;
                pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(3, 4, 5, 6);
                pdfGridRow1.cells.getCell(0).style.textBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
                pdfGridRow1.cells.getCell(0).style.textPen = new PdfPen(new PdfColor(127, 255, 212));
                pdfGridRow1.cells.getCell(0).style.backgroundBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
                pdfGridRow1.cells.getCell(0).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Center);
                pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
                pdfGridRow1.cells.getCell(2).value = '$15,000';
            }
            let bounds : RectangleF = new RectangleF(10, 10, 100, 200);
            grid.rows.getRow(0).cells.getCell(0).draw(page.graphics, bounds, true);

            // it('MeasureHeight() with Padding', () => {
            expect(function (): void {grid.rows.getRow(0).cells.getCell(0).measureHeight();}).not.toThrowError();
            // })
            // it('t3.style.borders = null - testing', () => {
            //     t3.style.borders = null;
            expect(function (): void {t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 500), new SizeF(50, 600)));}).not.toThrowError();
            // })
        })
    });
});
//         let t3 : PdfGridCell = new PdfGridCell(gridRow);
//         it('-RemainingString == undefined', () => {
//             expect(t1.remainingString).toBeUndefined();
//         })
//         it('-Set RemainingString', () => {
//             t1.remainingString = 'grid';
//             expect(t1.remainingString).toEqual('grid');
//         })
//         it('-stringFormat != undefined', () => {
//             expect(t1.stringFormat).not.toBeUndefined();
//         })
//         it('-Set stringFormat', () => {
//             let value : PdfStringFormat = new PdfStringFormat();
//             t1.stringFormat = value;
//             expect(t1.stringFormat).not.toBeUndefined();
//         })
//         it('-row == undefined', () => {
//             expect(t1.row).toBeUndefined();
//         })
//         it('-Set row', () => {
//             t1.row = gridRow;
//             expect(t1.row).not.toBeUndefined();
//         })
//         it('-value == undefined', () => {
//             expect(t1.value).toBeUndefined();
//         })
//         it('-Set value', () => {
//             t1.value = 1;
//             expect(t1.value).toEqual(1);
//         })
//         it('-rowSpan == 1', () => {
//             expect(t1.rowSpan).toEqual(1);
//         })
//         it('-Set rowSpan == 3', () => {
//             t1.rowSpan = 3;
//             expect(t1.rowSpan).toEqual(3);
//         })
//         it('-Set rowSpan == -1', () => {
//             expect(function (): void {t1.rowSpan = -1; }).toThrowError();
//         })
//         it('-style != undefined', () => {
//             expect(t1.style).not.toBeUndefined();
//         })
//         it('-Set style', () => {
//             let value : PdfGridCellStyle = new PdfGridCellStyle();
//             t1.style = value;
//             expect(t1.style).not.toBeUndefined();
//         })
//         // it('-height == undefined', () => {
//         //     expect(t1.height).toBeUndefined();
//         // })
//         it('-Set height', () => {
//             t1.height = 50;
//             expect(t1.height).toEqual(50);
//         })
//         it('-columnSpan == 1', () => {
//             expect(t1.columnSpan).toEqual(1);
//         })
//         it('-Set columnSpan == 3', () => {
//             t1.columnSpan = 3;
//             expect(t1.columnSpan).toEqual(3);
//         })
//         it('-Set columnSpan == -1', () => {
//             expect(function (): void {t1.columnSpan = -1;}).toThrowError();
//         })
//         it('-width == 5.52', () => {
//             expect(t1.width).not.toBeNull();
//         })
//         it('-Set width', () => {
//             t1.width = 1;
//             expect(t1.width).toEqual(1);
//         })
//         it('-isRowMergeContinue == true', () => {
//             t1.isRowMergeContinue = true;
//             expect(t1.isRowMergeContinue).not.toBeNull();
//         })
//         it('-isCellMergeContinue == true', () => {
//             t1.isCellMergeContinue = true;
//             expect(t1.isCellMergeContinue).not.toBeNull();
//         })
//         let document : PdfDocument = new PdfDocument()
//         let page : PdfPage = document.pages.add();
//         let graphics : PdfGraphics = page.graphics;
//         let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(50, 50));
//         t2.drawCellBackground(graphics, rect);
//         t2.drawCellBorders(graphics, rect);

//         t2.style.cellPadding = new PdfPaddings(2, 3, 4, 5);
//         t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
//         t2.rowSpan = 2;
//         t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
//         t2.draw(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)), true);
        
//         let border : PdfBorders = new PdfBorders();
//         let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 255), 10);
//         pen.dashStyle = PdfDashStyle.Dot;
//         border.all = pen;
//         t2.style.borders = border;
//         t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 10), new SizeF(50, 50)));
        
//         t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 500), new SizeF(50, 600)));

//         it('Grid.style.font != null && GetTextFont() calling', () => {
//             let document : PdfDocument = new PdfDocument();
//             let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
//             let page : PdfPage = document.pages.add();
//             let grid : PdfGrid = new PdfGrid();
//             grid.columns.add(3);
//             //Add header.
//             grid.headers.add(1);
//             let pdfGridHeader3 : PdfGridRow = grid.headers.getHeader(0);
//             pdfGridHeader3.cells.getCell(0).value = 'ID';
//             pdfGridHeader3.cells.getCell(0).style.font = font;
//             pdfGridHeader3.cells.getCell(0).style.textBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
//             pdfGridHeader3.cells.getCell(0).style.textPen = new PdfPen(new PdfColor(127, 255, 212));
//             pdfGridHeader3.cells.getCell(0).style.backgroundBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
//             pdfGridHeader3.cells.getCell(0).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Center);
//             pdfGridHeader3.cells.getCell(1).value = 'Company name';
//             pdfGridHeader3.cells.getCell(2).value = 'Salary';
//             for (let i : number = 0; i < 50; i++) {
//                 let pdfGridRow1 : PdfGridRow = grid.rows.addRow();
//                 pdfGridRow1.cells.getCell(0).value = 'E-1';
//                 pdfGridRow1.cells.getCell(0).style.font = font;
//                 pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(3, 4, 5, 6);
//                 pdfGridRow1.cells.getCell(0).style.textBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
//                 pdfGridRow1.cells.getCell(0).style.textPen = new PdfPen(new PdfColor(127, 255, 212));
//                 pdfGridRow1.cells.getCell(0).style.backgroundBrush = new PdfSolidBrush(new PdfColor(127, 255, 212));
//                 pdfGridRow1.cells.getCell(0).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Center);
//                 pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
//                 pdfGridRow1.cells.getCell(2).value = '$15,000';
//             }
//             let bounds : RectangleF = new RectangleF(10, 10, 100, 200);
//             grid.rows.getRow(0).cells.getCell(0).draw(page.graphics, bounds, true);

//             it('MeasureHeight() with Padding', () => {
//                 expect(function (): void {grid.rows.getRow(0).cells.getCell(0).measureHeight();}).not.toThrowError();
//             })
//             it('t3.style.borders = null - testing', () => {
//                 t3.style.borders = null;
//                 expect(function (): void {t2.drawCellBorders(page.graphics, new RectangleF(new PointF(10, 500), new SizeF(50, 600)));}).toThrowError();
//             })
//         })
//     })
// })

describe('PdfGridCellCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let gridRow : PdfGridRow = new PdfGridRow(grid);
        let t1 : PdfGridCellCollection = new PdfGridCellCollection(gridRow);
        it('-count == 2', () => {
            expect(t1.count).toEqual(2);
        })
        let gridCell : PdfGridCell = new PdfGridCell();
        t1.add();
        it('-this.Add() method calling', () => {
            expect(t1.add()).toBeUndefined();
        })
        t1.add(gridCell);
        it('-this.Add(PdfGridCell) method calling', () => {
            expect(t1.add(gridCell)).toBeUndefined();
        })
        t1.indexOf(gridCell);
        it('-this.IndexOf(PdfGridCell) method calling', () => {
            expect(t1.indexOf(gridCell)).not.toBeUndefined();
        });
        it('-this.getCell(number) method calling', () => {
            expect(function (): void {t1.getCell(-1); }).toThrowError();
        })
    })
})