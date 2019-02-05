/**
 * spec document for PdfGridColumn.ts class
 */

import { PdfGridColumn, PdfGridColumnCollection } from "../../../../../src/index";
import { PdfGrid } from "../../../../../src/index";
import { PdfStringFormat, PdfTextAlignment, PdfGridRow } from "../../../../../src/index";

describe('PdfGridColumn.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let t1 : PdfGridColumn = new PdfGridColumn(grid);
        it('-width == 0', () => {
            expect(t1.width).toEqual(0);
        })
        it('-Set width', () => {
            t1.width = 2;
            expect(t1.width).toEqual(2);
        })
        it('-Set format', () => {
            let format : PdfStringFormat = new PdfStringFormat();
            format.alignment = PdfTextAlignment.Center;
            t1.format = format;
            expect(t1.format).not.toBeUndefined();
        })
        it('-columns.Add(1) & count == 3', () => {
            grid.columns.add(2);
            let row1 : PdfGridRow = grid.rows.addRow();
            row1.cells.getCell(0).value = 'testing1';
            row1.cells.getCell(1).value = 'testing2';
            grid.columns.add(1);
            expect(grid.columns.count).toEqual(3);
        })
    })
})

describe('PdfGridColumnCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let grid : PdfGrid = new PdfGrid();
        let t1 : PdfGridColumnCollection = new PdfGridColumnCollection(grid);
        it('-width == undefined', () => {
            expect(t1.width).toBeUndefined();
        })
        it('-Count == undefined', () => {
            expect(t1.count).toEqual(2);
        })
        it('-GetColumns == undefined', () => {
            expect(t1.columns).not.toBeUndefined();
        })
        t1.measureColumnsWidth();
        it('-this.MeasureColumnsWidth() method calling', () => {
            expect(t1.measureColumnsWidth).not.toBeUndefined();
        })
        t1.getDefaultWidths(3);
        it('-this.GetDefaultWidths(number) method calling', () => {
            expect(t1.getDefaultWidths(3)).not.toBeUndefined();
        })
        t1.add(2);
        it('-this.Add(number) method calling', () =>{
            expect(t1.add(2)).toBeUndefined();
        })
        it('-this.GetDefaultWidths(number) method calling after adding columns', () => {
            t1.getColumn(0).width = 10;
            expect(t1.getDefaultWidths(3)).not.toBeUndefined();
        })
        it('-t1.width != undefined & initially width != 0 ', () => {
            expect(t1.width).toBeUndefined();
        })
    })
})