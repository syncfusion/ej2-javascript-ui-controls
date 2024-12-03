/**
 * spec document for Styles.ts class
 */
import { PdfDocument, PdfGraphics, PdfPage, PdfTextWebLink, PdfColor, SizeF, PdfLayoutFormat, PdfSection, PdfBrush, PdfWordWrapType } from './../../src/index';
import {  PdfStringFormat } from './../../src/index';
import { PdfGrid, PdfGridCellStyle } from './../../src/index';
import { PdfGridRow, PdfPen, PdfDocumentLinkAnnotation, PdfSolidBrush, PdfNumberStyle, PdfVerticalAlignment } from './../../src/index';
import { PdfDestination, PdfFont, PdfStandardFont, PdfDestinationMode, PdfDashStyle, PdfTextAlignment } from './../../src/index';
import { PdfBorders, PdfPageSize, PdfPageRotateAngle, RectangleF, PointF, PdfBorderOverlapStyle, PdfPageTemplateElement } from './../../src/index';
import { PdfHorizontalOverflowType, PdfPageOrientation, PdfFontFamily, PdfFontStyle, PdfPageNumberField, PdfBitmap } from './../../src/index';
import { PdfPageCountField } from './../../src/implementation/document/automatic-fields/page-count-field';
import { PdfCompositeField } from './../../src/implementation/document/automatic-fields/composite-field';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfTextElement, PdfLayoutResult } from './../../src/index';
import { PdfGridStyle } from './../../src/implementation/structured-elements/grid/styles/style';
import { PdfGridLayoutFormat } from './../../src/implementation/structured-elements/grid/layout/grid-layouter';
import { PdfLayoutBreakType, PdfLayoutType} from './../../src/implementation/graphics/figures/enum';
import { Utils } from './utils.spec';

describe('PDFGrid_styles_backgroundBrush',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "low";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        //pdfGridRow1.cells.getCell(1).style.textPen=new PdfPen(new PdfColor(255,0,0));
        parentGrid.style.backgroundBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        childPdfGrid.style.backgroundBrush=new PdfSolidBrush(new PdfColor(90, 50, 30));

        //parentGrid.style.textBrush=new PdfSolidBrush(new PdfColor(90, 50, 30));
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12155_backgroundBrush.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_backgroundBrush.pdf');
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
})
describe('PDFGrid_styles_textPen',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "low";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow1.cells.getCell(1).style.textPen=new PdfPen(new PdfColor(255,0,0));
        childpdfGridRow2.cells.getCell(1).style.textPen=new PdfPen(new PdfColor(238,243,35));
        //parentGrid.style.backgroundBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        parentGrid.style.textBrush=new PdfSolidBrush(new PdfColor(90, 50, 30));
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_textPen.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_textPen.pdf');
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
})
describe('PDFGrid_styles_textBrush',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "low";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow1.cells.getCell(1).style.textPen=new PdfPen(new PdfColor(255,0,0));
        parentGrid.style.backgroundBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        parentGrid.style.textBrush=new PdfSolidBrush(new PdfColor(90, 50, 30));
        childPdfGrid.style.textBrush=new PdfSolidBrush(new PdfColor(238,243,35));
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_textBrush.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_textBrush.pdf');
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
})
describe('PDFGrid_styles_textfont',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                                  
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 16);
         let font1 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "hello world";
        childpdfGridRow2.cells.getCell(1).value = "grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";        
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;

        // childPdfGrid.style.cellPadding.all = 10;
        // childPdfGrid.style.cellSpacing = 5;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(70, 130, 180));
        childPdfGrid.style.backgroundBrush = new PdfSolidBrush(new PdfColor(238,243,35));
        childPdfGrid.style.font = font;
        parentGrid.style.font = font1;
        //childPdfGrid.style.borderOverlapStyle = PdfBorderOverlapStyle.Inside;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_textFont.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_textFont.pdf');
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
})

describe('PDFGrid_styles_cellPadding',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);
         //parentGrid.style.cellPadding.all = 10;
         //parentGrid.style.cellSpacing = 10;
         parentGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
         parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(70, 130, 180));
         parentGrid.style.font = font;
         parentGrid.style.borderOverlapStyle = PdfBorderOverlapStyle.Inside;   
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(0).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        parentGrid.style.cellPadding.bottom = 10;
        parentGrid.style.cellPadding.right = 20;
        parentGrid.style.cellPadding.left = 30;
        parentGrid.style.cellPadding.top = 40;
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_cellPadding.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellPadding.pdf');
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
})
describe('PDFGrid_styles_childcellPaddingAll',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow3.cells.getCell(1).value="second";
        pdfGridRow3.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        childPdfGrid.style.cellPadding.all=10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(118,209,208));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_childcellPaddingAll.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_childcellPaddingAll.pdf');
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
})
describe('PDFGrid_styles_parentcellPaddingAll',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         //let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow3.cells.getCell(1).value="second";
        pdfGridRow3.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        //childPdfGrid.style.cellPadding.all=20;
        parentGrid.style.cellPadding.all=10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_parentcellPaddingAll.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_parentcellPaddingAll.pdf');
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
})
describe('PDFGrid_styles_bothcellPaddingAll',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow3.cells.getCell(1).value="second";
        pdfGridRow3.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        childPdfGrid.style.cellPadding.all=20;
        parentGrid.style.cellPadding.all=10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_bothcellPaddingAll.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_bothcellPaddingAll.pdf');
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
})
describe('PDFGrid_styles_cellSpacing_parent',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "hello world";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        //childPdfGrid.style.cellPadding.all=10;
        //childPdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
        //childPdfGrid.style.cellSpacing=10;
        parentGrid.style.cellSpacing = 10;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_cellSpacing_parent.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellSpacing_parent.pdf');
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
})
describe('PDFGrid_styles_cellSpacing_inner',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();        
                          
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "hello world";    
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        //pdfGridRow2.cells.getCell(2).value = image;
        pdfGridRow2.cells.getCell(2).value="third";
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        childPdfGrid.style.cellSpacing = 10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(40,150,30));
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(80, 100, 60));

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_cellSpacing_inner.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellSpacing_inner.pdf');
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
})
describe('PDFGrid_styles_cellSpacing_both',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();        
                          
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "hello world";    
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        //pdfGridRow2.cells.getCell(2).value = image;
        pdfGridRow2.cells.getCell(2).value="third";
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        parentGrid.style.cellSpacing = 10 
        childPdfGrid.style.cellSpacing = 10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(40,150,30));
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(80, 100, 60));

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_cellSpacing_both.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellSpacing_both.pdf');
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
})
describe('PDFGrid_styles_cellSpacing&Padding',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "342 grid";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow3.cells.getCell(1).value="second";
        pdfGridRow3.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        parentGrid.style.cellSpacing = 15;
        childPdfGrid.style.cellPadding.all = 15;        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_cellSpacing&Padding.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellSpacing&Padding.pdf');
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
})
describe('PDFGrid_styles_cellPadding&Spacing',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
           
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";   
        pdfGridRow1.cells.getCell(0).value="Style support";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow3.cells.getCell(1).value="second";
        pdfGridRow3.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));
        parentGrid.style.cellPadding.all = 10;
        childPdfGrid.style.cellSpacing = 10;        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
     //document.save('PDFGrid_EJ2-12155_cellPadding&Spacing.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_cellPadding&Spacing.pdf');
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
})

describe('PDFGrid_styles_Wordwrap',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Create new PDF string format instance.
        let format : PdfStringFormat = new PdfStringFormat();
        format.wordWrap = PdfWordWrapType.Word;
        //Set string format to grid cell.
        cellStyle.stringFormat = format;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";                       

        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        childPdfGrid.style.cellPadding.all = 10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));
        parentGrid.style.textPen = new PdfPen(new PdfColor(40,150,30));
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        pdfGridRow2.cells.getCell(0).style = cellStyle;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
     //document.save('PDFGrid_EJ2-12155_WordWrap.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_WordWrap.pdf');
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
})

describe('PDFGrid_styles_CharacterWrap',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Create new PDF string format instance.
        let format : PdfStringFormat = new PdfStringFormat();
        format.wordWrap = PdfWordWrapType.Character;
        //Set string format to grid cell.
        cellStyle.stringFormat = format;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";                       

        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        childPdfGrid.style.cellPadding.all = 10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));
        parentGrid.style.textPen = new PdfPen(new PdfColor(40,150,30));
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        pdfGridRow2.cells.getCell(0).style = cellStyle;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_CharacterWrap.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_CharacterWrap.pdf');
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
})
describe('PDFGrid_styles_wordonlyWrap',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Create new PDF string format instance.
        let format : PdfStringFormat = new PdfStringFormat();
        format.wordWrap = PdfWordWrapType.WordOnly;
        //Set string format to grid cell.
        cellStyle.stringFormat = format;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";                       

        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        childPdfGrid.style.cellPadding.all = 10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));
        parentGrid.style.textPen = new PdfPen(new PdfColor(40,150,30));
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        pdfGridRow2.cells.getCell(0).style = cellStyle;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_wordonlyWrap.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_wordonlyWrap.pdf');
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
})

describe('PDFGrid_styles_all',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let logo : string = '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';
         let image : PdfBitmap = new PdfBitmap(logo);
         image.size = new SizeF(170,200);
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
         let font1 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = image;
        childpdfGridRow2.cells.getCell(1).value = "the cell value is 4 4";
        childpdfGridRow2.cells.getCell(2).value = "the cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(70, 130, 180));
        childPdfGrid.style.backgroundBrush = new PdfSolidBrush(new PdfColor(40,150,30));
        childPdfGrid.style.font = font;
        parentGrid.style.font = font1;        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_Allstyle.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_Allstyle.pdf');
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
})
describe('PDFGrid_styles_Image',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let logo : string = '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';
         let image : PdfBitmap = new PdfBitmap(logo);                          
         
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 3 Row Implementation";
        childpdfGridRow2.cells.getCell(1).value = image;
        //childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value = image;
        //pdfGridRow2.cells.getCell(2).value="third";
        //childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40,150, 30));
        // childPdfGrid.style.cellSpacing=10;
        // childPdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
        // childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_Image.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_Image.pdf');
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
})

describe('PDFGrid_styles_imagesize',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let logo : string = '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABiAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8aQ+R+GKVjkAUwDFOPyNX60fmrJU5FPVcN+FV/PFOSUr1zTuTyjmXAP1zSE5r+nf4Q/8ABIv9nzxh8LPCl/J8L/AMNzf6PZzTvNocMokkaFCzE8HJJJ/wrrx/wRU+BMf+q+FPwqk4zi40WOLP4hGH61+VYfxNeKjKWFwU5qLs7Tpp/c5Jn2c+D3Tt7SvFXXaX6I/lYQbR+NP3gV/VRJ/wRn+CtiMt8A/hxcrjOYtJtG/Q4P6V+HH/AAUs/wCCN3xv+Bnxl+KfjXTfhBqmkfCSx1bUNTsLyyeCS0sNMErujFEkLxIseOGUYHGK+g4c4xeZ15UK2FnQ5Ve8+Wz1tZNN6nm5pw/LCU1UhUVS/wDLfTzdz4fbG2on6U0z5XvTC+RX2bkjwFFht96QgfWmlsUBs1kaakp4pZDkUmcmkduMVVyRoOKeDkd/xqOlzilcD+wz4BNj4D+C/wDsBWP/AKTpXqPh29ea1WJoJUVI1ZZTgpJkkYHOcjHcdCPfHlPwHkx8B/Bf/YCsf/SdK76w8MahJEl9p2uXdq8qrm2njW4tCRkfcOHXPGdrqOOnJz/KHAs75rXX91/+lI/bc3jbCwfmvyOv0+Zre6iCMVDSKCAeDk88V4l/wWD/AOUWfx//AOxG1T/0nevRrqfWrzZYzpLp7SPGy6np0kbiMiRDgpKpI3DI+6wxnkHFeJf8FcvDXiSz/wCCYnx2dvE8V1Zx+C9TaSGbS08yWP7NLlN6uuDymG28bOQc1+wYb+NH1X5nytf+HL0Z/I8eKYz/ADU9ulRY+av04+AFzmgcGjOKQHNAFgYFI5yaQEEUGmyLMGXbSU4/OfwprNtNSFmf2AfAmX/ixHgv/sBWP/pOlel6V4pbRLFI73T76G2jjVhdqgkhKkE5IUllx3yuOQc9cfAX/BI7/grX8Pf25vhTo3hKOVPDPxE8OabFa3egXcwLXqQxhTcWr8eahC5Zcb05yMYdvp/4I/trfCX43eMtV8MeDfijpX/CW6DfTaVqOhXFypuIbmGR4pAIJCHx5gOChwcCv5b4MyrFYPOsXSxcHGcVs+zlv6O2j2P2jM8ZRrYKjOjJNP8ARbHtOqeK7SbRJrm0ngu/slzHFKI5ATG4lUFW9CPQ814x/wAFcPFkd9/wSz+PMflyK0ngXUwOQR/x7tW98fvHmh/B/wCHd34x8ZpoGhaRpPkGTxAL1YbW3R5441EjPt2qxcDklc45zivAf+Civ7Wfwz+M3/BMf43ReE/HXhjxHJP4H1IINO1CO53H7M3AKEiv1rCwk6kZJaXR8viJxUJJvWzP5b15WjZRGcrS1+lnwD3GNFk/hQsZAp9BOKCiPdil3ZppXdQPlOKAHq2DSE5NJXR/CD4S+Ifj38VPD/gnwlp39reJ/FN9Fpul2X2iK3+1XEh2onmSssa5PdmAHc0A2krsyPCnizU/AviSx1nRdQvdJ1bTJ1ubS9tJmhntpVOVdHUgqwPQg1N4l8eax4t8eah4o1DULifX9Vv5NTur4NslkuZJDI8uVxhi5LcYwTxXZ/Gb9lHxX8BNE+3+IL/4czoLv7C9vofxE8Pa/eRS4YkPbWF7PMijYwLsgVTgEgsAfNWGRXJB0KsvbU7N7XXbe1/xOqcKtNezmmvJ/cfRGo/8FUPjz4j/AGYNe+D2vfEHVfE/gHxFBDBPY61tvpoFinjnj8q4kBmTDxL8u/bjI218+k5pg+alHynFb06cIfArXMalSUn7zuSJ0paarbVpwORWhi9wpGbFLSMuTQMg3ZNKDtNAiwaXZxU6mlkL5lfRf/BINs/8FUP2fP8AsetM/wDRwr5xNdl+zt8d9a/Zf+PPg/4jeHLbS7zXvBGrQaxYQalHJJaSzQtuVZVjdHKE9QrqfcUPYicOaDiuqf5Hp3/Cr/gr4o/az8MaN4a8V/EPxhJr/wAQ7fTda0/X/B1toFsLWa+EcwjubbVruR2+baP3cZwS25SAp+gvDfwj+A3jD/goD+0d4Gk+DMVj8PvgX4Z8b39hDaeKNUGr6xPprj7O89xJcPEuxkcRiOAAI4EouHXzG+X9Z/bA06XxRpfiDQPgb8JfBnibSdftvEUeqaTe+JJ5JZ4ZxP5bx3mr3EPlu4G4CMNj7rLVXw/+2r408PfG34wfECDTvDDa78a9N13S9che3nNpaxauzNcm2UTB0Zdx8su7gfxB6+RjgsbDCU6NO6lGnUXZc7hBQ9UmpWvqtz6qeLwk8XUrVLNSqU358inJzv5tON7b7Ho/hLTvh7oP7HetftFa38KPDOr3PiTxuvgPw14Fh1bWLfw3orQ2EV3dXs7/AG06jOzK6LHGL1FVnlZiyhIx7N+zH+yN8H/2m/j5+yb4uk8Dy+HvBfxp1fXfDvizwXbatfvZW95pFqjvNYXMsrXawTrNFJskuJGSRZF3lMKPkb4C/tS658CvhlrvgW78M+DPiJ8PvEtxDqF74Z8U29y1pFfw8RX1vPaT293bXCoXjLQzoHjdlkVxgDr9B/4KMeP/AAp+0V8NviDo2heCNEtPg9by2vg7wfZ2t0PD2jpMki3B2NcNcyyzPI0kk01w8rvt3OVRFXpq4fGqf7u+8ba6JKCUk+7crtb73umrHFGvhHT9617Svpq22+Vp9Ely3/wtfabPKPij4/0H4keKjd+GfBWmeBNGtI/scFjaX95fSXKo7bbi5luZpN1yylQ5hWGElMpDHkisGM4GKg0yzNpbENjczFzjpk1ZxzXvYOE4UYxqb219TzMZOnOvOVJWi27enQUjbSUZorpOJ7jEwwpdo9ahHJxR3pXNHFjzHg9aQxZpU6Ub6YXaGldlLGeaRjk06JctQNktLSZxSFwDQZWFZtppA+aRzk0gODQWPopN9KDmgl7lZPvj6Up/1lFFZmw9Pu0yiirIe4VJBRRTCWwk/wB/8KZRRQIkooooAKenSiigD//Z';
         let image : PdfBitmap = new PdfBitmap(logo);
         image.size = new SizeF(170,200);                          
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 ";
        childpdfGridRow2.cells.getCell(1).value = image;
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="first";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value = image;
        pdfGridRow2.cells.getCell(2).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        childpdfGridRow2.cells.getCell(2).style.backgroundBrush=new PdfSolidBrush(new PdfColor(238,243,35));

        // childPdfGrid.style.cellSpacing=10;
        // childPdfGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
        // childpdfGridRow2.cells.getCell(2).style.textBrush=new PdfSolidBrush(new PdfColor(40, 140, 30));

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_imageSize.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_imageSize.pdf');
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
})

describe('PDFGrid_styles_backgroundImage_parentCell',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let logo : string = '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';
         let image : PdfBitmap = new PdfBitmap(logo);         
                          
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        //childpdfGridRow2.cells.getCell(1).value = image;
        //childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        //pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(1).style.backgroundImage = image;
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow2.cells.getCell(1).style.textBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));
        pdfGridRow2.cells.getCell(0).style.backgroundBrush=new PdfSolidBrush(new PdfColor(238,243,35));

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_backgroundImage_parentCell.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_backgroundImage_parentCell.pdf');
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
})

describe('PDFGrid_styles_backgroundImage_childCell',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         let logo : string = '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';
         let image : PdfBitmap = new PdfBitmap(logo);        
                          
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).style.backgroundImage= image;
        childpdfGridRow1.cells.getCell(2).value= "bgImage";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        //childpdfGridRow2.cells.getCell(1).value = image;
        //childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        //pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(1).style.backgroundImage= image;
        pdfGridRow2.cells.getCell(1).value="second image";
        pdfGridRow2.cells.getCell(2).value="third";
        childPdfGrid.style.textBrush=new PdfSolidBrush(new PdfColor(232,123,45));
        parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40,150,30));
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_backgroundImage_childCell.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_backgroundImage_childCell.pdf');
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
})
describe('PDFGrid_styles_BackgroundImageSize',()=>{
        it('PDFGrid', (done) => {
             let document : PdfDocument = new PdfDocument();
            // add a page
            let page1 : PdfPage = document.pages.add();
            // create a PdfGrid
            let parentGrid : PdfGrid = new PdfGrid();
            //add column
            parentGrid.columns.add(3);      
            // add row     
             let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
             let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
             let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
             let logo : string = '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';
             let image : PdfBitmap = new PdfBitmap(logo);
             image.size = new SizeF(100,200);
                          
            // add nested grid
            let childPdfGrid : PdfGrid = new PdfGrid();        
           
            //Set the column and rows for child grid
            childPdfGrid.columns.add(3);               
            let childpdfGridRow1 :PdfGridRow;
            let childpdfGridRow2 : PdfGridRow;                
            childpdfGridRow1 = childPdfGrid.rows.addRow();
            childpdfGridRow2 = childPdfGrid.rows.addRow();      
            childpdfGridRow1.cells.getCell(0).value = "implementation";
            childpdfGridRow1.cells.getCell(1).value = "1 1";
            childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
            childpdfGridRow2.cells.getCell(0).value = "3";
            childpdfGridRow2.cells.getCell(1).style.backgroundImage = image;
            childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
            childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
            
            pdfGridRow1.cells.getCell(0).value="Style support";              
            pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
            pdfGridRow1.cells.getCell(2).value="last";
            
            pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
            //pdfGridRow2.cells.getCell(1).value="second";
            
            pdfGridRow2.cells.getCell(1).value="second";
            pdfGridRow2.cells.getCell(2).value="third";
            parentGrid.style.backgroundBrush = new PdfSolidBrush(new PdfColor(238,243,30));
            pdfGridRow2.cells.getCell(2).style.backgroundImage = image; 
            // drawing a grid           
            parentGrid.draw(page1, new PointF(0,0));        
          //document.save('PDFGrid_EJ2-12155_BackgroundImageSize.pdf');  
            document.save().then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_BackgroundImageSize.pdf');
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
})
describe('PDFGrid_styles_borders',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        image.size = new SizeF(100,200);
        let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Set borders.
        let borders : PdfBorders  = new PdfBorders();
        borders.all = new PdfPen(new PdfColor(238,243,35));//---yellow
        cellStyle.borders = borders;
        //Set background image.
        cellStyle.backgroundImage = image;
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();   
                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();

        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow1.cells.getCell(2).style = cellStyle;
        childpdfGridRow2.cells.getCell(0).value = "hello world";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";       
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";

        
        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));
        //childPdfGrid.style.textPen= new PdfPen(new PdfColor(90, 50, 30));
        pdfGridRow2.cells.getCell(2).style = cellStyle;         
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_borders.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_borders.pdf');
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
})
describe('PDFGrid_styles_TextAlignment',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        image.size = new SizeF(170,200);
        let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Create new PDF string format instance.
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Justify;
        //Set string format to grid cell.
        cellStyle.stringFormat = format;
        //Set borders.
        let borders : PdfBorders  = new PdfBorders();
        borders.all = new PdfPen(new PdfColor(234,224,35));
        cellStyle.borders = borders;
        //Set background image.
        cellStyle.backgroundImage = image;
        //cellStyle.backgroundImage = new PdfBitmap("F://syncfusion.jpg");
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
         //let logo : string = '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';
        //  let image : PdfBitmap = new PdfBitmap("F://syncfusion.jpg");
        //  image.size = new SizeF(170,200);
                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow1.cells.getCell(2).style = cellStyle;
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).style = cellStyle; 
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
      //document.save('PDFGrid_EJ2-12155_textJustify.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_textJustify.pdf');
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
})
describe('PDFGrid_styles_Textalign_Right',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);        
        let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        //Create new PDF string format instance.
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Right;
        //Set string format to grid cell.
        cellStyle.stringFormat = format;
        //Set borders.
        let borders : PdfBorders  = new PdfBorders();
        borders.all = new PdfPen(new PdfColor(234,224,35));
        cellStyle.borders = borders;        
        //Set background image.
        cellStyle.backgroundImage = image;
        //cellStyle.backgroundImage = new PdfBitmap("F://syncfusion.jpg");
        //add column
        
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();      
                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        childpdfGridRow1.cells.getCell(2).style = cellStyle;
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        childpdfGridRow2.cells.getCell(1).style = cellStyle;
        
        pdfGridRow1.cells.getCell(0).value="Style support";              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).style = cellStyle; 
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12155_textRight.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12155_textRight.pdf');
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
})
