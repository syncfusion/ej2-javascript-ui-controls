/**
 * spec document for PdfGrid.ts class
 */
import { PdfStandardFont, PdfWordWrapType, PdfSolidBrush } from "../../../../../src/index";
import { PdfDocument, PdfPage, PdfLayoutFormat, PdfGraphics, PdfLayoutResult } from "../../../../../src/index";
import { PdfGrid  } from "../../../../../src/index";
import { PdfGridStyle, PdfGridCellStyle } from "../../../../../src/index";
import { PdfGridRow } from "../../../../../src/index";
import { PdfPen, PdfColor, PdfStringFormat, PdfLayoutParams } from "../../../../../src/index";
import { RectangleF, PointF, SizeF, PdfBitmap } from '../../../../../src/index';

describe('PdfGrid.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfGrid = new PdfGrid();
        it('-repeatHeader == false', () => {
            expect(t1.repeatHeader).toBeFalsy();
        })
        it('-Set repeatHeader', () => {
            t1.repeatHeader = false;
            expect(t1.repeatHeader).toBeFalsy();
        })
        it('-allowRowBreakAcrossPages == true', () => {
            expect(t1.allowRowBreakAcrossPages).toBeTruthy();
        })
        it('-Set allowRowBreakAcrossPages', () => {
            t1.allowRowBreakAcrossPages = false;
            expect(t1.allowRowBreakAcrossPages).toBeFalsy();
        })
        it('-columns == undefined', () => {
            expect(t1.columns).not.toBeUndefined();
        })
        it('-rows == undefined', () => {
            expect(t1.rows).not.toBeUndefined();
        })
        it('-headers == undefined', () => {
            expect(t1.headers).not.toBeUndefined();
        })
        it('-initialWidth == undefined', () => {
            expect(t1.initialWidth).toBeUndefined();
        })
        it('-Set initialWidth', () => {
            t1.initialWidth = 3;
            expect(t1.initialWidth).toEqual(3);
        })
        it('-style != undefined', () => {
            expect(t1.style).not.toBeUndefined();
        })
        t1.style = null;
        it('-Set style', () => {
            let value : PdfGridStyle = new PdfGridStyle();
            t1.style = value;
            expect(t1.style).not.toBeUndefined();
        })
        it('-IsPageWidth == false', () => {
            expect(t1.isPageWidth).toBeFalsy();
        })
        it('-Set IsPageWidth', () => {
            t1.isPageWidth = false;
            expect(t1.isPageWidth).toBeFalsy();
        })
        it('-IsChildGrid == false', () => {
            expect(t1.isChildGrid).toBeFalsy();
        })
        it('-Set IsChildGrid', () => {
            t1.isChildGrid = false;
            expect(t1.isChildGrid).toBeFalsy();
        })
        it('-Size != undefined', () => {
            t1.columns.add(2);
            t1.headers.add(2);
            let header1 : PdfGridRow = t1.headers.getHeader(0);
            header1.cells.getCell(0).value = 'one';
            header1.cells.getCell(1).value = 'two';
            let header2 : PdfGridRow = t1.headers.getHeader(1);
            header2.cells.getCell(0).value = 'one';
            header2.cells.getCell(1).value = 'two';
            let pdfGridRow1 : PdfGridRow = t1.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'three';
            pdfGridRow1.cells.getCell(1).value = 'four';
            t1.size = new SizeF(0, 0);
            expect(t1.size).not.toBeUndefined();
            expect(t1.size).not.toBeUndefined();
        })

        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let bounds : RectangleF = new RectangleF(new PointF(0, 0), new SizeF(50, 50));
        // t1.DrawTable(page, bounds);
        // t1.MeasureColumnsWidth();
        // t1.MeasureColumnsWidth(bounds);
            
        // document.PageSettings.Margins.All = 40;
        // let page1 : PdfPage = document.pages.add();
        // let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Courier, 10);
        // //Create a new PDF document.
        let pdfGrid : PdfGrid = new PdfGrid();
        // pdfGrid.beginCellDraw = this.table_BeginCellDraw;
        // pdfGrid.endCellDraw = this.table_EndCellDraw;
        // pdfGrid.beginCellDraw = this.table_BeginCellDraw;
        // pdfGrid.endCellDraw = this.table_EndCellDraw;
        // //Add three columns.
        pdfGrid.columns.add(3);
        pdfGrid.columns.getColumn(1).width = 10;
        pdfGrid.allowRowBreakAcrossPages = true;
        // //Add header.
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = 'ID';
        pdfGridHeader.cells.getCell(1).value = 'Employee';
        pdfGridHeader.cells.getCell(2).value = 'Salary';
        // //Add rows.
        for (let i : number = 0 ; i < 20; i++) {
            let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).style.borders.all = new PdfPen(new PdfColor(0, 128, 0), 5);
            pdfGridRow1.cells.getCell(0).value = 'E' + (i + 1);
            pdfGridRow1.cells.getCell(1).value = 'Clay Hero';
            pdfGridRow1.cells.getCell(2).value = '$15,000';
        }

        //PdfWordWrapType = none
        let page2 : PdfPage = document.pages.add();
        let pdfGrid1 : PdfGrid = new PdfGrid();
        //Add three columns.
        pdfGrid1.columns.add(5);
        //Add header.
        pdfGrid1.headers.add(1);
        let pdfGridHeader1 : PdfGridRow = pdfGrid1.headers.getHeader(0);
        pdfGridHeader1.cells.getCell(0).value = 'ID';
        pdfGridHeader1.cells.getCell(1).value = 'Company name';
        pdfGridHeader1.cells.getCell(2).value = 'Employee';
        pdfGridHeader1.cells.getCell(3).value = 'Salary';
        pdfGridHeader1.cells.getCell(4).value = 'Company address';
        //Add rows.
        for (let i : number = 0 ; i < 10; i++) {
            let pdfGridRow1 : PdfGridRow = pdfGrid1.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'E' + (i + 1);
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
            if (i % 3 == 0) {
                pdfGridRow1.cells.getCell(2).value = 'Clay Hero';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            } else if (i % 3 == 1) {
                pdfGridRow1.cells.getCell(2).value = 'John';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            } else {
                pdfGridRow1.cells.getCell(2).value = 'David';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            }
            let logo : string = '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';
            let image : PdfBitmap = new PdfBitmap(logo);
            image.size = new SizeF(100, 200);
            if (i == 2) {
                pdfGridRow1.cells.getCell(3).value = image;
            }
            pdfGridRow1.cells.getCell(4).value = 'Eymard Complex, AJ217, 4th Avenue, Anna Nagar, Chennai -40.';
            let stringFormat : PdfStringFormat = new PdfStringFormat();
            stringFormat.wordWrap = PdfWordWrapType.None;
            pdfGridRow1.cells.getCell(4).style.stringFormat = stringFormat;
        }
        pdfGrid1.draw(page2, new PointF(10, 10));

        //PdfWordWrapType = none
        let page3 : PdfPage = document.pages.add();
        let pdfGrid2: PdfGrid = new PdfGrid();
        //Add three columns.
        pdfGrid2.columns.add(5);
        //Add header.
        pdfGrid2.headers.add(1);
        let pdfGridHeader2 : PdfGridRow = pdfGrid2.headers.getHeader(0);
        pdfGridHeader2.cells.getCell(0).value = 'ID';
        pdfGridHeader2.cells.getCell(1).value = 'Company name';
        pdfGridHeader2.cells.getCell(2).value = 'Employee';
        pdfGridHeader2.cells.getCell(3).value = 'Salary';
        pdfGridHeader2.cells.getCell(4).value = 'Company address';
        //Add rows.
        for (let i : number = 0 ; i < 10; i++) {
            let pdfGridRow1 : PdfGridRow = pdfGrid2.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'E' + (i + 1);
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
            if (i % 3 == 0) {
                pdfGridRow1.cells.getCell(2).value = 'Clay Hero';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            } else if (i % 3 == 1) {
                pdfGridRow1.cells.getCell(2).value = 'John';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            } else {
                pdfGridRow1.cells.getCell(2).value = 'David';
                pdfGridRow1.cells.getCell(3).value = '$15,000';
            }
            pdfGridRow1.cells.getCell(4).value = 'Eymard Complex, AJ217, 4th Avenue, Anna Nagar, Chennai -40.';
            let stringFormat : PdfStringFormat = new PdfStringFormat();
            stringFormat.wordWrap = PdfWordWrapType.Character;
            pdfGridRow1.cells.getCell(4).style.stringFormat = stringFormat;
        }
        pdfGrid2.draw(page3, new PointF(10, 10));

        let grid6 : PdfGrid = new PdfGrid();
        grid6.columns.add(1);
        grid6.headers.add(1);
        let pdfGridHeader6 : PdfGridRow = grid6.headers.getHeader(0);
        pdfGridHeader6.cells.getCell(0).value = 'ID';
        let row6 : PdfGridRow = grid6.rows.addRow();
        row6.cells.getCell(0).value = "hello";
        grid6.style.allowHorizontalOverflow = true;
        grid6.draw(page2, new PointF(10, 10));

        let layoutDocument : PdfDocument = new PdfDocument();
        it('LayoutInternal with param.page = null', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            expect(function (): void {layoutGrid.draw(null, new PointF(10, 20));}).toThrowError();
        })
        let layoutPage : PdfPage = layoutDocument.pages.add();
        it('LayoutInternal with rows.count == 0 && headers.count != 0', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            layoutGrid.columns.add(1);
            layoutGrid.headers.add(1);
            let pdfGridHeader : PdfGridRow = layoutGrid.headers.getHeader(0);
            pdfGridHeader.cells.getCell(0).value = 'ID';
            // it('rows-count == 0 in LayoutInternal calling', () => {
            expect(layoutGrid.rows.count).toEqual(0);
            // })
            expect(function (): void {layoutGrid.draw(layoutPage, new PointF(10, 20));}).not.toThrowError();
        })
        it('LayoutInternal with rows.count == 0 && headers.count == 0', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            layoutGrid.columns.add(1);
            // it('rows-count == 0 in LayoutInternal calling', () => {
            expect(layoutGrid.rows.count).toEqual(0);
            // })
            expect(function (): void {layoutGrid.draw(layoutPage, new PointF(10, 20));}).toThrowError();
        })
        it('LayoutInternal with Layout.Format != null & Format.UsePageinateBounds == true', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            layoutGrid.columns.add(3);
            //Add header.
            layoutGrid.headers.add(1);
            let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
            pdfGridHeader3.cells.getCell(0).value = 'ID';
            pdfGridHeader3.cells.getCell(1).value = 'Employee';
            pdfGridHeader3.cells.getCell(2).value = 'Salary';
            let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'E-1';
            pdfGridRow1.cells.getCell(1).value = 'Clay Hero';
            pdfGridRow1.cells.getCell(2).value = '$15,000';
            // it('rows-count == 1 in LayoutInternal calling', () => {
            expect(layoutGrid.rows.count).toEqual(1);
            // })
            let layoutFormat : PdfLayoutFormat = new PdfLayoutFormat();
            // it('layoutFormat.PaginateBounds = new RectangleF(new PointF(10, 10), new SizeF(100, 200)) -> not throw Error', () => {
            //     layoutFormat.PaginateBounds = new RectangleF(new PointF(10, 10), new SizeF(100, 200));
            //     expect(layoutFormat.UsePaginateBounds).toEqual(true);
            //     expect(function (): void {layoutGrid.Draw(layoutPage, new RectangleF(new PointF(10, 10), new SizeF(100, 200)), layoutFormat);}).not.toThrowError();
            // })
            // it('layoutFormat.PaginateBounds = new RectangleF(new PointF(10, 10), new SizeF(100, 0)) -> not throw Error', () => {
            //     layoutFormat.PaginateBounds = new RectangleF(new PointF(10, 10), new SizeF(100, 0));
            //     expect(function (): void {layoutGrid.Draw(layoutPage, new PointF(10, 20), layoutFormat);}).not.toThrowError();
            // })
        })
        /*it('MeasureColumnsWidth() && headers.count == 0', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            layoutGrid.style.allowHorizontalOverflow = false;
            layoutGrid.columns.add(3);
            let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'E-1';
            pdfGridRow1.cells.getCell(1).value = 'Clay Hero';
            pdfGridRow1.cells.getCell(2).value = '$15,000';
            // it('headers-count == 0 in LayoutInternal calling', () => {
            expect(layoutGrid.headers.count).toEqual(0);
            // })
            expect(function (): void {layoutGrid.measureColumnsWidth();}).toThrowError();
        })*/
        it('repeatHeader == true', () => {
            let layoutGrid : PdfGrid = new PdfGrid();
            layoutGrid.repeatHeader = true;
            layoutGrid.columns.add(3);
            //Add header.
            layoutGrid.headers.add(1);
            let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
            pdfGridHeader3.cells.getCell(0).value = 'ID';
            pdfGridHeader3.cells.getCell(1).value = 'Company name';
            pdfGridHeader3.cells.getCell(2).value = 'Salary';
            for (let i : number = 0; i < 50; i++) {
                let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
                pdfGridRow1.cells.getCell(0).value = 'E-1';
                pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
                pdfGridRow1.cells.getCell(2).value = '$15,000';
            }
            layoutGrid.draw(layoutPage, new PointF(10, 20));
        })
        it('draw overload -testing', () => {
            let t1 : PdfGrid = new PdfGrid();
            let document : PdfDocument = new PdfDocument();
            let page1 : PdfPage = document.pages.add();
            t1.columns.add(2);
            let pdfGridRow11 : PdfGridRow = t1.rows.addRow();
            pdfGridRow11.cells.getCell(0).value = 'ex';
            pdfGridRow11.cells.getCell(1).value = 'ex';
            t1.rows.addRow(pdfGridRow11);
            t1.draw(page1, new PointF(10, 10));

            let t2 : PdfGrid = new PdfGrid();
            let page2 : PdfPage = document.pages.add();
            t2.columns.add(2);
            let pdfGridRow21 : PdfGridRow = t2.rows.addRow();
            pdfGridRow21.cells.getCell(0).value = 'ex';
            pdfGridRow21.cells.getCell(1).value = 'ex';
            t2.rows.addRow(pdfGridRow21);
            t2.draw(page2, 10, 10);

            let t3 : PdfGrid = new PdfGrid();
            let page3 : PdfPage = document.pages.add();
            t3.columns.add(2);
            let pdfGridRow31 : PdfGridRow = t3.rows.addRow();
            pdfGridRow31.cells.getCell(0).value = 'ex';
            pdfGridRow31.cells.getCell(1).value = 'ex';
            t3.rows.addRow(pdfGridRow31);
            t3.draw(page3, new RectangleF(10, 10, 400, 500));

            let t4 : PdfGrid = new PdfGrid();
            let page4 : PdfPage = document.pages.add();
            t4.columns.add(2);
            let pdfGridRow41 : PdfGridRow = t4.rows.addRow();
            pdfGridRow41.cells.getCell(0).value = 'ex';
            pdfGridRow41.cells.getCell(1).value = 'ex';
            t4.rows.addRow(pdfGridRow41);
            let format : PdfLayoutFormat = new PdfLayoutFormat();
            t4.draw(page4, new PointF(10, 10), format);

            let t5 : PdfGrid = new PdfGrid();
            let page5 : PdfPage = document.pages.add();
            t5.columns.add(2);
            let pdfGridRow51 : PdfGridRow = t5.rows.addRow();
            pdfGridRow51.cells.getCell(0).value = 'ex';
            pdfGridRow51.cells.getCell(1).value = 'ex';
            t5.rows.addRow(pdfGridRow51);
            t5.draw(page5, 10, 10, format);

            let t6 : PdfGrid = new PdfGrid();
            let page6 : PdfPage = document.pages.add();
            t6.columns.add(2);
            let pdfGridRow61 : PdfGridRow = t6.rows.addRow();
            pdfGridRow61.cells.getCell(0).value = 'ex';
            pdfGridRow61.cells.getCell(1).value = 'ex';
            t6.rows.addRow(pdfGridRow61);
            t6.draw(page6, new RectangleF(10, 10, 400, 500), format);

            let t7 : PdfGrid = new PdfGrid();
            let page7 : PdfPage = document.pages.add();
            t7.columns.add(2);
            let pdfGridRow71 : PdfGridRow = t7.rows.addRow();
            pdfGridRow71.cells.getCell(0).value = 'ex';
            pdfGridRow71.cells.getCell(1).value = 'ex';
            t7.rows.addRow(pdfGridRow61);
            t7.draw(page7, new RectangleF(10, 10, 400, 500), false);
        })
    })
})

