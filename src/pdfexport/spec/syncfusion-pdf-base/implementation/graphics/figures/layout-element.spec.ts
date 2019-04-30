/**
 * spec document for PdfLayoutElement.ts class
 */

import { PdfGrid } from "../../../../../src/implementation/structured-elements/grid/pdf-grid";
import { PdfDocument, PdfPage, PdfLayoutFormat, RectangleF, PointF, SizeF } from "../../../../../src/index";
import { PdfGridRow } from "../../../../../src/implementation/structured-elements/grid/pdf-grid-row";

describe('PdfLayoutElement.ts', () => {
    describe('Constructor initializing',()=>{
        let t1 : PdfGrid = new PdfGrid();
        let document : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document.pages.add();
        t1.columns.add(2);
        let pdfGridRow11 : PdfGridRow = t1.rows.addRow();
        pdfGridRow11.cells.getCell(0).value = 'ex';
        pdfGridRow11.cells.getCell(1).value = 'ex';
        t1.rows.addRow(pdfGridRow11);
        t1.drawHelper(page1, new PointF(10, 10));

        let t2 : PdfGrid = new PdfGrid();
        let page2 : PdfPage = document.pages.add();
        t2.columns.add(2);
        let pdfGridRow21 : PdfGridRow = t2.rows.addRow();
        pdfGridRow21.cells.getCell(0).value = 'ex';
        pdfGridRow21.cells.getCell(1).value = 'ex';
        t2.rows.addRow(pdfGridRow21);
        t2.drawHelper(page2, 10, 10);

        let t3 : PdfGrid = new PdfGrid();
        let page3 : PdfPage = document.pages.add();
        t3.columns.add(2);
        let pdfGridRow31 : PdfGridRow = t3.rows.addRow();
        pdfGridRow31.cells.getCell(0).value = 'ex';
        pdfGridRow31.cells.getCell(1).value = 'ex';
        t3.rows.addRow(pdfGridRow31);
        t3.drawHelper(page3, new RectangleF(10, 10, 400, 500));

        let t4 : PdfGrid = new PdfGrid();
        let page4 : PdfPage = document.pages.add();
        t4.columns.add(2);
        let pdfGridRow41 : PdfGridRow = t4.rows.addRow();
        pdfGridRow41.cells.getCell(0).value = 'ex';
        pdfGridRow41.cells.getCell(1).value = 'ex';
        t4.rows.addRow(pdfGridRow41);
        let format : PdfLayoutFormat = new PdfLayoutFormat();
        t4.drawHelper(page4, new PointF(10, 10), format);

        let t5 : PdfGrid = new PdfGrid();
        let page5 : PdfPage = document.pages.add();
        t5.columns.add(2);
        let pdfGridRow51 : PdfGridRow = t5.rows.addRow();
        pdfGridRow51.cells.getCell(0).value = 'ex';
        pdfGridRow51.cells.getCell(1).value = 'ex';
        t5.rows.addRow(pdfGridRow51);
        t5.drawHelper(page5, 10, 10, format);

        let t6 : PdfGrid = new PdfGrid();
        let page6 : PdfPage = document.pages.add();
        t6.columns.add(2);
        let pdfGridRow61 : PdfGridRow = t6.rows.addRow();
        pdfGridRow61.cells.getCell(0).value = 'ex';
        pdfGridRow61.cells.getCell(1).value = 'ex';
        t6.rows.addRow(pdfGridRow61);
        t6.drawHelper(page6, new RectangleF(10, 10, 400, 500), format);

        let t7 : PdfGrid = new PdfGrid();
        let page7 : PdfPage = document.pages.add();
        t7.columns.add(2);
        let pdfGridRow71 : PdfGridRow = t7.rows.addRow();
        pdfGridRow71.cells.getCell(0).value = 'ex';
        pdfGridRow71.cells.getCell(1).value = 'ex';
        t7.rows.addRow(pdfGridRow61);
        t7.drawHelper(page7, new RectangleF(10, 10, 400, 500), false);
    })
})