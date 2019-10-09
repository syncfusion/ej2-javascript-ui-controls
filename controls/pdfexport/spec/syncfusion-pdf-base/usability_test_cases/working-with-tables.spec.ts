import { PdfDocument, PdfPage, PdfGrid, PdfPen } from './../../../src/index';
import { PdfGridRow, PointF, PdfGridCellStyle } from './../../../src/index';
import { PdfColor, PdfSolidBrush, PdfGridCell } from './../../../src/index';
import { PdfGridRowStyle, PdfStandardFont, PdfFontFamily } from './../../../src/index';
import { PdfStringFormat, PdfTextAlignment, PdfGridLayoutResult } from './../../../src/index';
import { PdfFont } from './../../../src/index';
import { PdfFontStyle, PdfHorizontalOverflowType, PdfTextWebLink } from './../../../src/index';
import  { PdfPaddings, PdfBorders } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-01: creating a simple table', () => {
    it('-creating a simple table', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(2);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "ID";
        pdfGridHeader.cells.getCell(1).value = "Employee";
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqE1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqE1qqqqqqqqqqqqqqqqqqasfasdf";
        pdfGridRow1.cells.getCell(1).value = "Clay";
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = "E2";
        pdfGridRow2.cells.getCell(1).value = "ABCD E1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqE1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqE1qqqqqqqqqqqqqqqqqqasfasdf";
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_01.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-02: cell customization', () => {
    it('-cell customization', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create the page
        let pdfPage : PdfPage = document.pages.add();
        // create the parent grid
        let parentPdfGrid : PdfGrid = new PdfGrid();
        // add the rows
        let row1 : PdfGridRow = parentPdfGrid.rows.addRow();
        let row2 : PdfGridRow = parentPdfGrid.rows.addRow();
        // add the columns
        parentPdfGrid.columns.add(3);

        // set the value to the specific cell.
        parentPdfGrid.rows.getRow(0).cells.getCell(0).value = 'Sam sam sam';
        parentPdfGrid.rows.getRow(0).cells.getCell(1).value = 'John john john';
        parentPdfGrid.rows.getRow(0).cells.getCell(2).value = 'Dav dav dav';
        parentPdfGrid.rows.getRow(1).cells.getCell(0).value = 'Ray ray ray';
        parentPdfGrid.rows.getRow(1).cells.getCell(1).value = 'Clay clay clay';
        parentPdfGrid.rows.getRow(1).cells.getCell(2).value = 'Peter peter peter';

        // specify the style for the PdfGridCell.
        let pdfGridCellStyle1 : PdfGridCellStyle = new PdfGridCellStyle();
        pdfGridCellStyle1.backgroundBrush = new PdfSolidBrush(new PdfColor(255, 255, 224));
        pdfGridCellStyle1.stringFormat = new PdfStringFormat(PdfTextAlignment.Left);
        let pdfGridCell1 : PdfGridCell = parentPdfGrid.rows.getRow(0).cells.getCell(0);
        pdfGridCell1.style = pdfGridCellStyle1;

        let pdfGridCellStyle2 : PdfGridCellStyle = new PdfGridCellStyle();
        pdfGridCellStyle2.textPen = new PdfPen(new PdfColor(0, 0, 153));
        pdfGridCellStyle2.stringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        let pdfGridCell2 : PdfGridCell = parentPdfGrid.rows.getRow(0).cells.getCell(1);
        pdfGridCell2.style = pdfGridCellStyle2;

        let pdfGridCellStyle3 : PdfGridCellStyle = new PdfGridCellStyle();
        pdfGridCellStyle3.stringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let pdfGridCell3 : PdfGridCell = parentPdfGrid.rows.getRow(0).cells.getCell(2);
        pdfGridCell3.style = pdfGridCellStyle3;

        let pdfGridCellStyle4 : PdfGridCellStyle = new PdfGridCellStyle();
        pdfGridCellStyle4.stringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        let pdfGridCell4 : PdfGridCell = parentPdfGrid.rows.getRow(1).cells.getCell(0);
        pdfGridCell4.style = pdfGridCellStyle4;

        // draw the PdfGrid
        parentPdfGrid.draw(pdfPage, new PointF(0, 0));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_02.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-03: row customization', () => {
    it('-row customization', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create the page
        let pdfPage : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(2);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = 'ID';
        pdfGridHeader.cells.getCell(1).value = 'Employee';
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = 'E1';
        pdfGridRow1.cells.getCell(1).value = 'Peter Clay';
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = 'E2';
        pdfGridRow2.cells.getCell(1).value = 'Peter Parker';
        let pdfGridRow3 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow3.cells.getCell(0).value = 'E3';
        pdfGridRow3.cells.getCell(1).value = 'Sam Milton';

        // add Grid Row Style
        let pdfGridRowStyle : PdfGridRowStyle = new PdfGridRowStyle();
        pdfGridRowStyle.setBackgroundBrush(new PdfSolidBrush(new PdfColor(255, 255, 224)));
        pdfGridRowStyle.setFont(new PdfStandardFont(PdfFontFamily.Courier, 30));
        pdfGridRowStyle.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 255)));
        pdfGridRowStyle.setTextPen(new PdfPen(new PdfColor(255, 192, 203)));
        pdfGrid.rows.getRow(2).height = 50;
        pdfGrid.rows.getRow(0).style = pdfGridRowStyle;

        // draw the PdfGrid
        pdfGrid.draw(pdfPage, new PointF(0, 0));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_03.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-04: column customization', () => {
    it('-column customization', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        let pdfPage : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(2);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = 'ID';
        pdfGridHeader.cells.getCell(1).value = 'Employee';
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = 'E1';
        pdfGridRow1.cells.getCell(1).value = 'Peter Clay';
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = 'E2';
        pdfGridRow2.cells.getCell(1).value = 'Peter Parker';
        let pdfGridRow3 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow3.cells.getCell(0).value = 'E3';
        pdfGridRow3.cells.getCell(1).value = 'Sam Milton';

        // add Grid Column Customization
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Center;
        let format2 : PdfStringFormat = new PdfStringFormat();
        format2.alignment = PdfTextAlignment.Justify;
        pdfGrid.columns.getColumn(0).format = format;
        pdfGrid.columns.getColumn(1).format = format2;

        // draw the PdfGrid
        pdfGrid.draw(pdfPage, new PointF(0, 0));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_04.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-06: draw tables one after another', () => {
    it('-draw tables one after another', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
        // create black brush
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // create a PdfGrid
        let pdfGrid1 : PdfGrid = new PdfGrid();
        // add five columns
            pdfGrid1.columns.add(5);
        // add rows
        for (let i : number = 0; i < 5 ; i++ ) {
            let pdfGridRow : PdfGridRow = pdfGrid1.rows.addRow();
            pdfGridRow.cells.getCell(0).value = "A" + i;
            pdfGridRow.cells.getCell(1).value = "Clay";
            pdfGridRow.cells.getCell(2).value = "$15,000";
            pdfGridRow.cells.getCell(3).value = "B" + i;
            pdfGridRow.cells.getCell(4).value = "David";
        }
        // drawing a grid
        let gridResult : PdfGridLayoutResult = pdfGrid1.draw(page, new PointF(0, 0));
        // create a PdfGrid
        let pdfGrid2 : PdfGrid = new PdfGrid();
        // add five columns
        pdfGrid2.columns.add(5);
        // add rows
        for(let i : number = 0; i < 5 ; i++ ) {
            let pdfGridRow : PdfGridRow = pdfGrid2.rows.addRow();
            pdfGridRow.cells.getCell(0).value = "C" + i;
            pdfGridRow.cells.getCell(1).value = "Ray";
            pdfGridRow.cells.getCell(2).value = "$10,000";
            pdfGridRow.cells.getCell(3).value = "D" + i;
            pdfGridRow.cells.getCell(4).value = "John";
        }
        // drawing a grid based on PdfGridLayoutResult value
        gridResult = pdfGrid2.draw(gridResult.page, new PointF(0, gridResult.bounds.height + 30));
        // draw the text based on PdfGridLayoutResult value of the second table
        gridResult.page.graphics.drawString('Drawing the text based on PdfGridLayoutResult value of the second table.', font, null, brush, 0, (gridResult.bounds.y + gridResult.bounds.height + 30), null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_06.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-07: draw grid with hyperlinks', () => {
    it('-draw grid with hyperlinks', (done) => {
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();
        //Font for text web link.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20, PdfFontStyle.Underline);
        //Create a PdfGrid.
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        //Add two columns.
        pdfGrid.columns.add(2);
        //Add header.
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = 'ID';
        pdfGridHeader.cells.getCell(1).value = 'John John Testing testing';
        //Add rows.
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = 'E1';
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        textLink.url = "http://www.syncfusion.com";
        textLink.text = "Syncfusion .Net components and controls";
        textLink.font = font;
        textLink.brush = new PdfSolidBrush(new PdfColor(0, 0, 255));
        pdfGridRow1.cells.getCell(1).value = textLink;
        //Drawing a grid.
        pdfGrid.draw(page1, new PointF(0, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_07.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-08: Simple table with padding', () => {
    it('-Simple table with padding', (done) => {
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // apply cell padding
        pdfGrid.style.cellPadding = new PdfPaddings(2, 4, 6, 8);
        // add two columns
        pdfGrid.columns.add(2);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "ID";
        pdfGridHeader.cells.getCell(1).value = "Employee";
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E1";
        pdfGridRow1.cells.getCell(1).value = "Clay";
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = "E2";
        pdfGridRow2.cells.getCell(1).value = "Thomas";
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_08.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-09: Simple table with spacing', () => {
    it('-Simple table with spacing', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // apply cell padding
        pdfGrid.style.cellSpacing = 3;
        // add two columns
        pdfGrid.columns.add(2);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "ID";
        pdfGridHeader.cells.getCell(1).value = "Employee";
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E1";
        pdfGridRow1.cells.getCell(1).value = "Clay";
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = "E2";
        pdfGridRow2.cells.getCell(1).value = "Thomas";
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_09.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-10: Horizontal overflow - with LastPage', () => {
    it('-Horizontal overflow - with LastPage', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.LastPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader.cells.getCell(0).value = "Order ID";
        pdfGridHeader.cells.getCell(1).value = "Freight";
        pdfGridHeader.cells.getCell(2).value = "Ship Country";
        pdfGridHeader.cells.getCell(3).value = "Order Date";
        pdfGridHeader.cells.getCell(4).value = "Order Date Time";
        pdfGridHeader.cells.getCell(5).value = "Verified";
        pdfGridHeader.cells.getCell(6).value = "Verified";
        
        // add rows        
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            row.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8));
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        for (let i : number = 0; i < pdfGrid.columns.count; i++) {
            if (i == 0 || i == 5 || i == 6) {
                pdfGrid.columns.getColumn(i).width = (90 * 0.75);
            } else {
                pdfGrid.columns.getColumn(i).width = (150 * 0.75);
            }
        }

        // column - text alignment
        pdfGrid.columns.getColumn(0).format = new PdfStringFormat(PdfTextAlignment.Center);
        pdfGrid.columns.getColumn(1).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(2).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(3).format = new PdfStringFormat(PdfTextAlignment.Justify);
        pdfGrid.columns.getColumn(4).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(5).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(6).format = new PdfStringFormat(PdfTextAlignment.Left);

        // drawing a grid
        pdfGrid.draw(page1, new PointF(20, 20));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_10.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-11: Horizontal overflow - with NextPage', () => {
    it('-Horizontal overflow - with NextPage', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader.cells.getCell(0).value = "Order ID";
        pdfGridHeader.cells.getCell(1).value = "Freight";
        pdfGridHeader.cells.getCell(2).value = "Ship Country";
        pdfGridHeader.cells.getCell(3).value = "Order Date";
        pdfGridHeader.cells.getCell(4).value = "Order Date Time";
        pdfGridHeader.cells.getCell(5).value = "Verified";
        pdfGridHeader.cells.getCell(6).value = "Verified";
        
        // add rows        
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            row.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8));
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        for (let i : number = 0; i < pdfGrid.columns.count; i++) {
            if (i == 0 || i == 5 || i == 6) {
                pdfGrid.columns.getColumn(i).width = (90 * 0.75);
            } else {
                pdfGrid.columns.getColumn(i).width = (150 * 0.75);
            }
        }

        // column - text alignment
        pdfGrid.columns.getColumn(0).format = new PdfStringFormat(PdfTextAlignment.Center);
        pdfGrid.columns.getColumn(1).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(2).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(3).format = new PdfStringFormat(PdfTextAlignment.Justify);
        pdfGrid.columns.getColumn(4).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(5).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(6).format = new PdfStringFormat(PdfTextAlignment.Left);

        // drawing a grid
        pdfGrid.draw(page1, new PointF(20, 20));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_11.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-12 - Column Span', () => {
    it('-Column Span', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(4);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        let borders : PdfBorders = new PdfBorders();
        borders.all = new PdfPen(new PdfColor(128, 0, 0), 2);
        pdfGridHeader1.cells.getCell(0).style.borders = borders;
        pdfGridHeader1.cells.getCell(0).columnSpan = 3;
        pdfGridHeader1.cells.getCell(0).value = "ID";
        pdfGridHeader1.cells.getCell(3).value = "Employee";
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E1";
        pdfGridRow1.cells.getCell(1).value = "Clay";
        pdfGridRow1.cells.getCell(2).value = "E1";
        pdfGridRow1.cells.getCell(3).value = "Clay";
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = "E2";
        pdfGridRow2.cells.getCell(1).value = "Thomas";
        pdfGridRow2.cells.getCell(2).value = "E2";
        pdfGridRow2.cells.getCell(3).value = "Thomas";
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_12.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-13: Column Span with horizontal overflow', () => {
    it('-Column Span with horizontal overflow', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(2);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader1.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader1.cells.getCell(0).value = "Order ID";
        pdfGridHeader1.cells.getCell(1).value = "Freight";
        pdfGridHeader1.cells.getCell(1).columnSpan = 2;
        pdfGridHeader1.cells.getCell(3).value = "Order Date";
        pdfGridHeader1.cells.getCell(3).columnSpan = 2;
        pdfGridHeader1.cells.getCell(5).value = "Verified";
        pdfGridHeader1.cells.getCell(6).value = "Verified";
        let pdfGridHeader2 : PdfGridRow = pdfGrid.headers.getHeader(1);
        pdfGridHeader2.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader2.cells.getCell(0).value = "Order ID";
        pdfGridHeader2.cells.getCell(0).columnSpan = 3;
        pdfGridHeader2.cells.getCell(3).value = "Order Date";
        pdfGridHeader2.cells.getCell(3).columnSpan = 2;
        pdfGridHeader2.cells.getCell(5).value = "Verified";
        pdfGridHeader2.cells.getCell(6).value = "Verified";

        // add rows        
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true'],
                                    ['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            row.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8));
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        for (let i : number = 0; i < pdfGrid.columns.count; i++) {
            if (i == 0 || i == 5 || i == 6) {
                pdfGrid.columns.getColumn(i).width = (90 * 0.75);
            } else {
                pdfGrid.columns.getColumn(i).width = (150 * 0.75);
            }
        }

        // column - text alignment
        pdfGrid.columns.getColumn(0).format = new PdfStringFormat(PdfTextAlignment.Center);
        pdfGrid.columns.getColumn(1).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(2).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(3).format = new PdfStringFormat(PdfTextAlignment.Justify);
        pdfGrid.columns.getColumn(4).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(5).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(6).format = new PdfStringFormat(PdfTextAlignment.Left);

        // drawing a grid
        pdfGrid.draw(page1, new PointF(20, 20));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_13.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-14: Row Span', () => {
    it('-Row Span', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(3);
        // add header
        pdfGrid.headers.add(2);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        let borders : PdfBorders = new PdfBorders();
        borders.all = new PdfPen(new PdfColor(128, 0, 0), 2);
        pdfGridHeader1.cells.getCell(0).style.borders = borders;
        pdfGridHeader1.cells.getCell(0).rowSpan = 2;
        pdfGridHeader1.cells.getCell(0).value = "ID";
        pdfGridHeader1.cells.getCell(1).value = "Employee1";
        pdfGridHeader1.cells.getCell(2).value = "Employee2";
        let pdfGridHeader2 : PdfGridRow = pdfGrid.headers.getHeader(1);
        pdfGridHeader2.cells.getCell(0).value = "ID";
        pdfGridHeader2.cells.getCell(1).value = "Employee1";
        pdfGridHeader2.cells.getCell(2).value = "Employee2";
        // add rows
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = "E1";
        pdfGridRow1.cells.getCell(1).value = "Clay-1";
        pdfGridRow1.cells.getCell(2).value = "Thomas-1";
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = "E2";
        pdfGridRow2.cells.getCell(1).value = "Clay-2";
        pdfGridRow2.cells.getCell(2).value = "Thomas-1";
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_14.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-15: Row Span with horizontal overflow', () => {
    it('-Row Span with horizontal overflow', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();

        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(2);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader1.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader1.cells.getCell(0).value = "Order ID";
        pdfGridHeader1.cells.getCell(0).rowSpan = 2;
        pdfGridHeader1.cells.getCell(1).value = "Freight";
        pdfGridHeader1.cells.getCell(1).columnSpan = 2;
        pdfGridHeader1.cells.getCell(3).value = "Order Date";
        pdfGridHeader1.cells.getCell(3).rowSpan = 2;
        pdfGridHeader1.cells.getCell(3).columnSpan = 2;
        pdfGridHeader1.cells.getCell(5).value = "Verified";
        pdfGridHeader1.cells.getCell(5).rowSpan = 2;
        pdfGridHeader1.cells.getCell(5).columnSpan = 2;
        pdfGridHeader1.cells.getCell(6).value = "Verified";
        let pdfGridHeader2 : PdfGridRow = pdfGrid.headers.getHeader(1);
        pdfGridHeader2.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8, PdfFontStyle.Bold));
        pdfGridHeader2.cells.getCell(0).value = "Order ID";
        pdfGridHeader2.cells.getCell(1).value = "Freight";
        pdfGridHeader2.cells.getCell(2).value = "Ship Country";
        pdfGridHeader2.cells.getCell(3).value = "Order Date";
        pdfGridHeader2.cells.getCell(4).value = "Order Date Time";
        pdfGridHeader2.cells.getCell(5).value = "Verified";
        pdfGridHeader2.cells.getCell(6).value = "Verified";

        // add rows        
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false'],
                                    ['10250', '$65.83', 'Brazil', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10251', '$41.34', 'France', 'Mon, Jul 8', '00:00:00', 'true', 'true'],
                                    ['10252', '$51.30', 'Belgium', 'Tue, Jul 9', '00:00:00', 'true', 'true'],
                                    ['10253', '$58.17', 'Brazil', 'Wed, Jul 10', '00:00:00', 'true', 'true'],
                                    ['10254', '$22.98', 'Switzerland', 'Thu, Jul 11', '00:00:00', 'false', 'false'],
                                    ['10255', '$148.33', 'Switzerland', 'Fri, Jul 12', '00:00:00', 'true'],
                                    ['10256', '$13.97', 'Brazil', 'Mon, Jul 15', '00:00:00', 'false', 'false'],
                                    ['10257', '$81.91', 'Venezuela', 'Tue, Jul 16', '00:00:00', 'true', 'true'],
                                    ['10258', '$140.51', 'Austria', 'Wed, Jul 17', '00:00:00', 'true', 'true'],
                                    ['10259', '$3.25', 'Mexico', 'Thu, Jul 18', '00:00:00', 'false', 'false'],
                                    ['10260', '$55.09', 'Germany', 'Fri, Jul 19', '00:00:00', 'true', 'true'],
                                    ['10261', '$3.05', 'Brazil', 'Fri, Jul 19', '00:00:00', 'false', 'false'],
                                    ['10262', '$48.29', 'USA', 'Mon, Jul 22', '00:00:00', 'true', 'true']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            row.style.setFont(new PdfStandardFont(PdfFontFamily.Helvetica, 8));
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        for (let i : number = 0; i < pdfGrid.columns.count; i++) {
            if (i == 0 || i == 5 || i == 6) {
                pdfGrid.columns.getColumn(i).width = (90 * 0.75);
            } else {
                pdfGrid.columns.getColumn(i).width = (150 * 0.75);
            }
        }

        // column - text alignment
        pdfGrid.columns.getColumn(0).format = new PdfStringFormat(PdfTextAlignment.Center);
        pdfGrid.columns.getColumn(1).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(2).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(3).format = new PdfStringFormat(PdfTextAlignment.Justify);
        pdfGrid.columns.getColumn(4).format = new PdfStringFormat(PdfTextAlignment.Right);
        pdfGrid.columns.getColumn(5).format = new PdfStringFormat(PdfTextAlignment.Left);
        pdfGrid.columns.getColumn(6).format = new PdfStringFormat(PdfTextAlignment.Left);

        // drawing a grid
        pdfGrid.draw(page1, new PointF(20, 20));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_15.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-16: Drawing ) and ( ', () => {
    it('-Drawing ) and ( ', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let grid : PdfGrid = new PdfGrid();
        grid.columns.add(5);
        grid.headers.add(1);
        let header : PdfGridRow = grid.headers.getHeader(0);
        header.cells.getCell(0).value = "one";
        header.cells.getCell(1).value = "two";
        header.cells.getCell(2).value = "three";
        header.cells.getCell(3).value = "four";
        header.cells.getCell(4).value = "five";
        let row : PdfGridRow = grid.rows.addRow();
        row.cells.getCell(0).value = "Thu Jul 04 1996 00:00:00 GMT+0530 (India Standard Time)";
        row.cells.getCell(1).value = "Thu Jul 04 1996 00:00:00 GMT+0530 )India Standard Time(";
        row.cells.getCell(2).value = "Thu Jul 04 1996 00:00:00 GMT+0530 ( India Standard Time )";
        row.cells.getCell(3).value = "Thu Jul 04 1996 00:00:00 GMT+0530 ) India Standard Time (";
        row.cells.getCell(4).value = "Thu Jul 04 1996 00:00:00 GMT+0530 ()India Standard Time)(";
        grid.draw(page, 10, 10);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_16.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-17: Stacked header - height calculation with row span - 1', () => {
    it('-Stacked header - height calculation with row span - 1', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(2);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader1.cells.getCell(0).value = "";
        pdfGridHeader1.cells.getCell(1).value = "Freight - 1";
        pdfGridHeader1.cells.getCell(1).rowSpan = 2;
        pdfGridHeader1.cells.getCell(2).value = "Freight - 2";
        pdfGridHeader1.cells.getCell(2).rowSpan = 2;
        pdfGridHeader1.cells.getCell(3).value = "Order Date - 1";
        pdfGridHeader1.cells.getCell(3).rowSpan = 2;
        pdfGridHeader1.cells.getCell(3).columnSpan = 2;
        pdfGridHeader1.cells.getCell(5).value = "Verified";
        pdfGridHeader1.cells.getCell(5).rowSpan = 2;
        pdfGridHeader1.cells.getCell(6).value = "Verified";
        pdfGridHeader1.cells.getCell(6).rowSpan = 2;
        let pdfGridHeader2 : PdfGridRow = pdfGrid.headers.getHeader(1);
        pdfGridHeader2.cells.getCell(0).value = "";
        pdfGridHeader2.cells.getCell(1).value = "";
        pdfGridHeader2.cells.getCell(2).value = "";
        pdfGridHeader2.cells.getCell(3).value = "";
        pdfGridHeader2.cells.getCell(4).value = "";
        pdfGridHeader2.cells.getCell(5).value = "";
        pdfGridHeader2.cells.getCell(6).value = "";
        // add rows
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_17.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-18: Stacked header - height calculation with row span - 2', () => {
    it('-Stacked header - height calculation with row span - 2', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.style.allowHorizontalOverflow = true;
        pdfGrid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
        // add two columns
        pdfGrid.columns.add(7);
        // add header
        pdfGrid.headers.add(2);
        let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader1.cells.getCell(0).value = "";
        pdfGridHeader1.cells.getCell(1).value = "Freight - 1";
        pdfGridHeader1.cells.getCell(1).rowSpan = 2;
        pdfGridHeader1.cells.getCell(2).value = "Freight - 2";
        pdfGridHeader1.cells.getCell(2).rowSpan = 2;
        pdfGridHeader1.cells.getCell(3).value = "Order Date - 1";
        pdfGridHeader1.cells.getCell(3).rowSpan = 2;
        pdfGridHeader1.cells.getCell(3).columnSpan = 2;
        pdfGridHeader1.cells.getCell(5).value = "Verified";
        pdfGridHeader1.cells.getCell(5).rowSpan = 2;
        pdfGridHeader1.cells.getCell(6).value = "Verified";
        pdfGridHeader1.cells.getCell(6).rowSpan = 2;
        let pdfGridHeader2 : PdfGridRow = pdfGrid.headers.getHeader(1);
        pdfGridHeader2.cells.getCell(0).value = "hello";
        pdfGridHeader2.cells.getCell(1).value = "";
        pdfGridHeader2.cells.getCell(2).value = "";
        pdfGridHeader2.cells.getCell(3).value = "";
        pdfGridHeader2.cells.getCell(4).value = "";
        pdfGridHeader2.cells.getCell(5).value = "";
        pdfGridHeader2.cells.getCell(6).value = "";
        // add rows
        let input : string[][] = [['10248', '$32.38', 'France', 'Thu, Jul 4', '00:00:00', 'true', 'true'],
                                    ['10249', '$11.61', 'Germany', 'Fri, Jul 5', '00:00:00', 'false', 'false']];
        for (let i : number = 0; i < input.length; i++) {
            let row : PdfGridRow = pdfGrid.rows.addRow();
            for (let j : number = 0; j < input[i].length; j++) {
                row.cells.getCell(j).value = input[i][j] as string;
            }
        }
        // drawing a grid
        pdfGrid.draw(page1, new PointF(10, 10));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_grid_18.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});