/**
 * spec document for Fixed_width.ts class
 */
import { PdfDocument, PdfGraphics, PdfPage, PdfTextWebLink, PdfColor, SizeF, PdfLayoutFormat, PdfSection } from './../../src/index';
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
import { Utils } from './utils.spec';

describe('PDFGrid_longtext_innercell',()=>{
    it('PDFGrid_longtext_innercell_rowspan', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                                                                     ;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 nested grid value";   
        
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="first row has 2 lines and second row has 3 lines";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_longtext_rowspan.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_longtext_rowspan.pdf');
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
        // destroy the document
        document.destroy(); 
    })
})
describe('PDFGrid_Both_1_to_1(parent_rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=50;
         //parentGrid.columns.getColumn(2).width=300;
         parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
         childPdfGrid.columns.getColumn(2).width=50;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();           
               
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
        pdfGridRow2.cells.getCell(0).rowSpan = 2;  
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_2to2(first)parent_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_2to2(first)parent_rowspan.pdf');
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

describe('PDFGrid_multiplegrid',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=200;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();          
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
         childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }   
        let childPdfGrid2 : PdfGrid = new PdfGrid();        

        childPdfGrid2.columns.add(3); 
        childPdfGrid2.columns.getColumn(0).width=70;
        let childpdfGridRow12 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow12 = childPdfGrid2.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow12.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }      
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(2).value=childPdfGrid2;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_multiplegrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_multiplegrid.pdf');
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

describe('PDFGrid_onepage',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=200;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();                     
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow6 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow7 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow8 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow9 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow10 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow12 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow13 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow14 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow15 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow16 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow17 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow18 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow19 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow20 : PdfGridRow = parentGrid.rows.addRow();         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
         childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;        
        pdfGridRow3.cells.getCell(1).value=childPdfGrid;
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_onepage(long).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_onepage(long).pdf');
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
describe('PDFGrid_singlechild(point)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
         parentGrid.columns.getColumn(0).width=180;
         parentGrid.columns.getColumn(1).width=220;
        parentGrid.columns.getColumn(2).width=250;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
         childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(100,200));        
        //document.save('PDFGrid_EJ2-11297_singlechild(points).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlechild(points).pdf');
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
describe('PDFGrid_inner_characterwrap',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=70;
        parentGrid.columns.getColumn(1).width=130;
        parentGrid.columns.getColumn(2).width=60;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        
        childpdfGridRow1.cells.getCell(0).value= "fixed width changes";
        childpdfGridRow1.cells.getCell(1).value= "RowImplementation";
        childpdfGridRow1.cells.getCell(2).value= "Nested grid";
        childpdfGridRow2.cells.getCell(0).value= "cell value";
        childpdfGridRow2.cells.getCell(1).value= "changes123";
        childpdfGridRow2.cells.getCell(2).value= "columns to changes";             
        pdfGridRow1.cells.getCell(0).value="nested grid"; 
             
        pdfGridRow1.cells.getCell(0).value="Fixed width Implementation in nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Nested grid"; 
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_inner_characterwrap.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_inner_characterwrap.pdf');
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
describe('PDFGrid_outer_characterwrap',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=70;
        parentGrid.columns.getColumn(1).width=130;
        parentGrid.columns.getColumn(2).width=60;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        
        childpdfGridRow1.cells.getCell(0).value= "fixed width changes";
        childpdfGridRow1.cells.getCell(1).value= "RowImplementation";
        childpdfGridRow1.cells.getCell(2).value= "Nested grid";
        childpdfGridRow2.cells.getCell(0).value= "cell value";
        childpdfGridRow2.cells.getCell(1).value= "changes123";
        childpdfGridRow2.cells.getCell(2).value= "columns to changes";             
        pdfGridRow1.cells.getCell(0).value="nested grid"; 
             
        pdfGridRow1.cells.getCell(0).value="Fixed width Implementation in nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="RowImplementationColumnImplementationCellImplementation123456789"; 
        pdfGridRow2.cells.getCell(2).value="Nested grid"; 
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_outer_characterwrap.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_outer_characterwrap.pdf');
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
describe('PDFGrid_both3in2(Fc)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=50;
        parentGrid.columns.getColumn(1).width=120;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        
        childpdfGridRow1.cells.getCell(0).value= "fixed width changes";
        childpdfGridRow1.cells.getCell(1).value= "RowImplementation";
        childpdfGridRow1.cells.getCell(2).value= "Nested grid";
        childpdfGridRow2.cells.getCell(0).value= "cell value";
        childpdfGridRow2.cells.getCell(1).value= "changes123";
        childpdfGridRow2.cells.getCell(2).value= "columns to changes";             
        pdfGridRow1.cells.getCell(0).value="nested grid"; 
        // for (var i = 0; i <2; i++)
        // {
        //      childpdfGridRow1 = childPdfGrid.rows.addRow();           
        //     for (var j = 0; j < 3; j++)
        //     {
        //         childpdfGridRow1.cells.getCell(j).value = " Row Implementation ";
        //     }
        // }        
        pdfGridRow1.cells.getCell(0).value="Fixed width Implementation in nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Nested grid"; 
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_both3in2(Fc).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_both3in2(Fc).pdf');
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

describe('PDFGrid_Maximumcolumns',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document.pages.add();
    
        let parentGrid : PdfGrid = new PdfGrid();
        parentGrid.columns.add(2);
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let childPdfGrid : PdfGrid = new PdfGrid();
        childPdfGrid.columns.add(10);
        let childpdfGridRow1 :PdfGridRow = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "Child Grid Cell 1 are equal";
        childpdfGridRow1.cells.getCell(1).value = "Child Grid Cell 2";
        childpdfGridRow1.cells.getCell(2).value = "Child Grid Cell 3";
        childpdfGridRow1.cells.getCell(3).value = "Child Grid Cell 4";
        childpdfGridRow1.cells.getCell(4).value = "Child Grid Cell 5";
        childpdfGridRow1.cells.getCell(5).value = "Child Grid Cell 6 implementation";
        childpdfGridRow1.cells.getCell(6).value = "Child Grid Cell 7";
        childpdfGridRow1.cells.getCell(7).value = "Child Grid Cell 8";
        childpdfGridRow1.cells.getCell(8).value = "Child Grid Cell 9";
        childpdfGridRow1.cells.getCell(9).value = "Child Grid Cell 10";
    
        // for (var i = 0; i <10; i++){
        //  childPdfGrid.columns.getColumn(i).width=40;  
        // }    
        pdfGridRow1.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow2.cells.getCell(2).value=childPdfGrid;
        parentGrid.draw(page1, new PointF(0,0));
        //document.save('PDFGrid_EJ2-11297_nestedgrid(Maximumcolumns).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_nestedgrid(Maximumcolumns).pdf');
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
describe('PDFGrid_Both_2_to_1_last(rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        //parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=100;
         parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(2).width=60;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=60;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;      
        let childpdfGridRow3 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow(); 
        childpdfGridRow3 = childPdfGrid.rows.addRow();           
        childpdfGridRow2.cells.getCell(2).rowSpan = 2;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
            
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value= childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_2to1(last)rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_2to1(last)rowspan.pdf');
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
describe('PDFGrid_Both_1_to_1(center_rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        //parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=300;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(1).width=60;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=60;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();           
        childpdfGridRow1.cells.getCell(0).rowSpan = 2;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
            
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_1to1(center)rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_1to1(center)rowspan.pdf');
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
describe('PDFGrid_1_to_1(below20)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);        

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        parentGrid.columns.getColumn(1).width = 80;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        
        childPdfGrid.columns.getColumn(2).width = 20;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        
        childpdfGridRow1.cells.getCell(0).value= "Row";
        childpdfGridRow1.cells.getCell(1).value= "RowImplementation";
        childpdfGridRow1.cells.getCell(2).value= "Nested grid";
        childpdfGridRow2.cells.getCell(0).value= "1 1";
        childpdfGridRow2.cells.getCell(1).value= "changes123";
        childpdfGridRow2.cells.getCell(2).value= "columns 2 changes";             
        pdfGridRow1.cells.getCell(0).value="nested grid";             
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_1to1(below20).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_1to1(below20).pdf');
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
describe('PDFGrid_0_to_1(rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        //parentGrid.columns.getColumn(0).width=50;
         //parentGrid.columns.getColumn(2).width=300;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(0).width=60;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=60;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();           
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
            
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_0to1(first)rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_0to1(first)rowspan.pdf');
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
describe('PDFGrid_nestedgrid_longtext(default)',()=>{
    it("single-long-row", (done) => {
        let document : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document.pages.add();
    
        let parentGrid : PdfGrid = new PdfGrid();
        parentGrid.columns.add(1);
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let childPdfGrid : PdfGrid = new PdfGrid();
        childPdfGrid.columns.add(10);
        let childpdfGridRow1 :PdfGridRow = childPdfGrid.rows.addRow();
        //let childpdfGridRow2 :PdfGridRow = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "Child Grid Cell 1 are equal";
        childpdfGridRow1.cells.getCell(1).value = "Fixed width";
        childpdfGridRow1.cells.getCell(2).value = "Child Grid Cell 3";
        childpdfGridRow1.cells.getCell(3).value = "Child Grid Cell 4";
        childpdfGridRow1.cells.getCell(4).value = "Child Grid Cell 5";
        childpdfGridRow1.cells.getCell(5).value = "Child Grid Cell 6 implementation";
        childpdfGridRow1.cells.getCell(6).value = "Child Grid Cell 7";
        childpdfGridRow1.cells.getCell(7).value = "Row Implementation";
        childpdfGridRow1.cells.getCell(8).value = "Child Grid Cell 9";
        childpdfGridRow1.cells.getCell(9).value = "Child Grid Cell 10";
    
        for (var i = 0; i <10; i++){
         childPdfGrid.columns.getColumn(i).width = 40;  
        }    
        pdfGridRow1.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow2.cells.getCell(2).value=childPdfGrid;
        parentGrid.draw(page1, new PointF(0,0));
        //document.save('PDFGrid_EJ2-11297_nestedgrid_longtext(default).pdf'); 
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_nestedgrid_longtext(default).pdf');
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
describe('PDFGrid_single_grid_font',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        let font2 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);

        let childPdfGrid : PdfGrid = new PdfGrid();        
        parentGrid.style.font=font;  
        childPdfGrid.style.font=font2;
        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(1).width=40;               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "cell word";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";     
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_single_grid_font.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_single_grid_font.pdf');
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
describe('PDFGrid_nestedgrid_longtext(middle)',()=>{
        it("single-long-row", (done) => {
            let document : PdfDocument = new PdfDocument();
            let page1 : PdfPage = document.pages.add();
        
            let parentGrid : PdfGrid = new PdfGrid();
            parentGrid.columns.add(1);
            let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();
            let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
            let childPdfGrid : PdfGrid = new PdfGrid();
            childPdfGrid.columns.add(10);
            let childpdfGridRow1 :PdfGridRow = childPdfGrid.rows.addRow();
            childpdfGridRow1.cells.getCell(0).value = "Child Grid Cell 1 are equal";
            childpdfGridRow1.cells.getCell(1).value = "Child Grid Cell 2";
            childpdfGridRow1.cells.getCell(2).value = "Child Grid Cell 3";
            childpdfGridRow1.cells.getCell(3).value = "Child Grid Cell 4";
            childpdfGridRow1.cells.getCell(4).value = "Child Grid Cell 5";
            childpdfGridRow1.cells.getCell(5).value = "Child Grid Cell 6";
            childpdfGridRow1.cells.getCell(6).value = "Child Grid Cell 7";
            childpdfGridRow1.cells.getCell(7).value = "Child Grid Cell 8";
            childpdfGridRow1.cells.getCell(8).value = "Child Grid Cell 9";
            childpdfGridRow1.cells.getCell(9).value = "Child Grid Cell 10";
            childPdfGrid.columns.getColumn(5).width=20.55;
            // for (var i = 0; i <10; i++){
            //  childPdfGrid.columns.getColumn(i).width=51.5;  
            // }    
            pdfGridRow1.cells.getCell(0).value = childPdfGrid;
            //pdfGridRow2.cells.getCell(2).value=childPdfGrid;
            parentGrid.draw(page1, new PointF(0,0));
            //document.save('PDFGrid_EJ2-11297_nestedgrid_longtext(middle).pdf');
            document.save().then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_nestedgrid_longtext(middle).pdf');
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
describe('PDFGrid_Multiple_inner_grid(inner)',()=>{
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
        parentGrid.columns.getColumn(1).width = 100;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        childPdfGrid.columns.getColumn(2).width = 20;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value =  j +" "+ i;
            }
        }        
        
        let childPdfGrid2 : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid2.columns.add(2);               
        let childpdfGridRow12 :PdfGridRow;
        childPdfGrid2.columns.getColumn(0).width = 10;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow12 = childPdfGrid2.rows.addRow();           
            for (var j = 0; j < 2; j++)
            {
                childpdfGridRow12.cells.getCell(j).value = " "+  j ;
            }
        }    
        let childPdfGrid3 : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid3.columns.add(2);               
        let childpdfGridRow13 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow13 = childPdfGrid3.rows.addRow();           
            for (var j = 0; j < 2; j++)
            {
                childpdfGridRow13.cells.getCell(j).value =" "+ j ;
            }
        }    
        // drawing a grid
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;  
                    
        pdfGridRow1.cells.getCell(2).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript";  
        pdfGridRow2.cells.getCell(1).value=childPdfGrid;
        pdfGridRow3.cells.getCell(2).value=" Nested Grid";
        childpdfGridRow1.cells.getCell(1).value=childPdfGrid2;
        childpdfGridRow12.cells.getCell(0).value=childPdfGrid3;
        parentGrid.draw(page1, new PointF(0,0));      
          
        //document.save('PDFGrid_EJ2-11297_Multiple_grid(inner).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_Multiple_grid(inner).pdf');
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
        // destroy the document
        document.destroy(); 
                            
    })
})
describe('PDFGrid_1_to_1(below20)Columnspan',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);        

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                        
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow6 : PdfGridRow = parentGrid.rows.addRow(); 
        parentGrid.columns.getColumn(1).width = 80;
        let childPdfGrid : PdfGrid = new PdfGrid();        
        pdfGridRow5.cells.getCell(1).columnSpan = 2;
        childPdfGrid.columns.add(3); 
        
        childPdfGrid.columns.getColumn(2).width = 40;
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).columnSpan = 2;
        
        childpdfGridRow1.cells.getCell(0).value= "Row";
        childpdfGridRow1.cells.getCell(1).value= "RowImplementation";
        childpdfGridRow1.cells.getCell(2).value= "Nested grid";
        childpdfGridRow2.cells.getCell(0).value= "1 1";
        childpdfGridRow2.cells.getCell(1).value= "changes123";
        childpdfGridRow2.cells.getCell(2).value= "columns 2 changes";             
        pdfGridRow1.cells.getCell(0).value="nested grid";             
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow3.cells.getCell(1).value="hello"; 
        pdfGridRow4.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_1to1(below20)Columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_1to1(below20)Columnspan.pdf');
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
describe('PDFGrid_Multiple_inner_grid',()=>{
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
        parentGrid.columns.getColumn(1).width = 100;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        childPdfGrid.columns.getColumn(2).width = 20;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value =  j +" "+ i;
            }
        }        
        
        let childPdfGrid2 : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid2.columns.add(2);               
        let childpdfGridRow12 :PdfGridRow;
        
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow12 = childPdfGrid2.rows.addRow();           
            for (var j = 0; j < 2; j++)
            {
                childpdfGridRow12.cells.getCell(j).value = " "+  j ;
            }
        }    
        let childPdfGrid3 : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid3.columns.add(2);               
        let childpdfGridRow13 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow13 = childPdfGrid3.rows.addRow();           
            for (var j = 0; j < 2; j++)
            {
                childpdfGridRow13.cells.getCell(j).value =" "+ j ;
            }
        }    
        // drawing a grid
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;  
                    
        pdfGridRow1.cells.getCell(2).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript";  
        pdfGridRow2.cells.getCell(1).value=childPdfGrid;
        pdfGridRow3.cells.getCell(2).value=" Nested Grid";
        childpdfGridRow1.cells.getCell(1).value=childPdfGrid2;
        childpdfGridRow12.cells.getCell(0).value=childPdfGrid3;
        parentGrid.draw(page1, new PointF(0,0));      
          
        //document.save('PDFGrid_EJ2-11297_Multiple_grid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_Multiple_grid.pdf');
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
        // destroy the document
        document.destroy(); 
                            
    })
})
describe('PDFGrid_both1in2(first&last)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
         //parentGrid.columns.getColumn(0).width=100;
         parentGrid.columns.getColumn(1).width=200;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(1).width=90;              
        //childPdfGrid.columns.getColumn(1).width=60;

        childPdfGrid.columns.getColumn(2).width=70;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+ " width value";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_both1in2(first&last).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_both1in2(first&last).pdf');
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
describe('PDFGrid_both2in1(first)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=60;
         parentGrid.columns.getColumn(1).width=160;
         parentGrid.columns.getColumn(0).width=30;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(0).width=70;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width vlaue for 3rd column"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_both2in1(first).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_both2in1(first).pdf');
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
describe('PDFGrid_simple_grid',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_simplegrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_simplegrid.pdf');
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
describe('PDFGrid_both_2in2(last)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=180;
         parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
         childPdfGrid.columns.getColumn(1).width=50;
         childPdfGrid.columns.getColumn(2).width=100;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_both_2in2(last).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_both_2in2(last).pdf');
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
describe('PDFGrid_1_to_1(center)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        //parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
         //childPdfGrid.columns.getColumn(2).width=60;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_1to1(center).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_1to1(center).pdf');
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
describe('PDFGrid_Both_1_to_1(first)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        //parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(0).width=60;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=60;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_1to1(first).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_1to1(first).pdf');
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
describe('PDFGrid_singlechild(center)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=30;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singlechild(center).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlechild(center).pdf');
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
describe('PDFGrid_singlechild(first)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
         childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singlechild(first).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlechild(first).pdf');
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
describe('PDFGrid_singlechild',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
         childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singlechild(last).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlechild(last).pdf');
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
describe('PDFGrid_nestedchild(Extra)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=50;
        parentGrid.columns.getColumn(1).width=120;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=70;              
         childPdfGrid.columns.getColumn(1).width=60;
         childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_nestedchild(extra).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_nestedchild(extra).pdf');
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
describe('PDFGrid_Nested_parentonly',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=50;
        parentGrid.columns.getColumn(1).width=120;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_Nested_parentonly.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_Nested_parentonly.pdf');
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
describe('PDFGrid_Both',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(0).width=50;
        parentGrid.columns.getColumn(1).width=120;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_BothGrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_BothGrid.pdf');
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
describe('PDFGrid_Nested-childonly',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
        // parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_Nestedchildonly.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_Nestedchildonly.pdf');
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
describe('PDFGrid_singleparent(center)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        // parentGrid.columns.getColumn(0).width=50;
         parentGrid.columns.getColumn(1).width=120;
        // parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
        // childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singleparent(center).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singleparent(center).pdf');
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
describe('PDFGrid_singlegrid_parent_rowheight',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        parentGrid.columns.getColumn(0).width=100;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();     
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();   
        //pdfGridRow1.grid.size.width=100;
        pdfGridRow5.cells.getCell(0).height=100;                                       
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value="Fixed width";    
        pdfGridRow2.cells.getCell(2).value="single word";  
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="childPdfGrid"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singlegrid_parent_rowheight.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlegrid_parent_rowheight.pdf');
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
describe('PDFGrid_singlegrid_parent_width',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        parentGrid.columns.getColumn(0).width=100;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();     
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();                                  
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value="Fixed width";    
        pdfGridRow2.cells.getCell(2).value="single word";  
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="childPdfGrid"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_singlegrid_parent_width.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_singlegrid_parent_width.pdf');
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
describe('PDFGrid_nestedgrid_parent_width',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        
        parentGrid.columns.getColumn(1).width=100;
        parentGrid.columns.getColumn(2).width=50;

        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
           
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow2.cells.getCell(1).value="hello"; 
        pdfGridRow2.cells.getCell(2).value="Fixed width"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11297_nestedgrid_parent_width.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11297_nestedgrid_parent_width.pdf');
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
