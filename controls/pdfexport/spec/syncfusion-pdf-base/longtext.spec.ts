/**
 * spec document for Longtext.ts class
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

describe('PDFGrid_onepage',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=100;
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
        //document.save('PDFGrid_EJ2-11259_onepage.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_onepage.pdf');
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
describe('PDFGrid_longtext_innercell',()=>{
    it('PDFGrid_longtext_innercell_columnspan', (done) => {
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
                 
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
        
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="first row has 2 lines and second row has 3 lines";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
        childpdfGridRow2.cells.getCell(0).columnSpan = 2;
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_longtext_columnspan(after).pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_longtext_columnspan(after).pdf');
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
describe('PDFGrid_parent_character_wrap',()=>{
    it('PDFGrid_parent_character_wrap', (done) => {
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
                                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "0 0";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is "+ 4 +" "+ 4 +" nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is "+ 5 +" "+ 5;   
        pdfGridRow1.cells.getCell(0).value="abcdefghijklmnopqrstuvwxyz1234567890NestedgridImplementation";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_parent_character_wrap.pdf'); 
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_parent_character_wrap.pdf');
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
describe('PDFGrid_inner_character_wrap',()=>{
    it('PDFGrid_inner_character_wrap', (done) => {
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
                                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementationprocess";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "222523 4523532533532 52523235322352";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is "+ 4 +" "+ 4 +" nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is "+ 5 +" "+ 5;   
        pdfGridRow1.cells.getCell(0).value="nested table";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_inner_character_wrap.pdf'); 
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_inner_character_wrap.pdf');
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

describe('PDFGrid_LongText',()=>{
    it('PDFGrid_long_text', (done) => {
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
                                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;          
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "Inner";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is "+ 4 +" "+ 4 +" nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is "+ 5 +" "+ 5;   
        pdfGridRow1.cells.getCell(0).value="Nested Table";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_simple_long_text.pdf'); 
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_simple_long_text.pdf');
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

describe('PDFGrid_single_nestedgrid_longtext',()=>{
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
        childpdfGridRow1.cells.getCell(5).value = "Child Grid Cell 6 implementation";
        childpdfGridRow1.cells.getCell(6).value = "Child Grid Cell 7";
        childpdfGridRow1.cells.getCell(7).value = "Child Grid Cell 8";
        childpdfGridRow1.cells.getCell(8).value = "Child Grid Cell 9";
        childpdfGridRow1.cells.getCell(9).value = "Child Grid Cell 10";
    
        for (var i = 0; i <10; i++){
         childPdfGrid.columns.getColumn(i).width=51.5;  
        }    
        pdfGridRow1.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow2.cells.getCell(2).value=childPdfGrid;
        parentGrid.draw(page1, new PointF(0,0));
        //document.save('PDFGrid_EJ2-11259_Singlerow_Longtext_FixedWidth.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_Singlerow_Longtext_FixedWidth.pdf');
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
    });
    });
    
describe('PDFGrid_single_nestedgrid',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";     
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;     
        pdfGridRow1.cells.getCell(2).value="hello"; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_single_nestedgrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_single_nestedgrid.pdf');
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

describe('PDFGrid_extend_sample',()=>{
    it('PDFGrid_cell_extend', (done) => {
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
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "the Cell value is "+ j +" "+ i;
            }
        }                
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
                
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_Extend.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_Extend.pdf');
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

describe('PDFGrid_longtext_innercell',()=>{
    it('PDFGrid_Multiple_longtext_innercell', (done) => {
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
        //childpdfGridRow1.cells.getCell(2).rowSpan = 2; 
        //childpdfGridRow2.cells.getCell(0).columnSpan = 2; 
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
        
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="first row has 2 lines and second row has 3 lines";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_multiple_longtext_innercell.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_multiple_longtext_innercell.pdf');
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
describe('PDFGrid_longtext_innercell',()=>{
    it('PDFGrid_longtext_innercell_rowspan', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(4);      
        // add row     
         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                                                                      ;
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        //childpdfGridRow2.cells.getCell(0).columnSpan = 3;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
        pdfGridRow1.cells.getCell(0).columnSpan = 2;
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=" value are taken as column span height based on location file"; 
        pdfGridRow1.cells.getCell(2).value="value";
        pdfGridRow1.cells.getCell(3).value="grid value";      
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="first row has 2 lines and second row has 3 lines";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
        pdfGridRow3.cells.getCell(0).value="Nested Table";                
        pdfGridRow3.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(2).value="last";  
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_longtext_rowspan.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_longtext_rowspan.pdf');
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
describe('PDFGrid_longtext_innercell',()=>{
    it('PDFGrid_longtext_innercell_columnspan', (done) => {
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
        childpdfGridRow2.cells.getCell(0).columnSpan = 2;         
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";   
        
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="first row has 2 lines and second row has 3 lines";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_longtext_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_longtext_columnspan.pdf');
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
describe('PDFGrid_multilevel_rowspan',()=>{
    it('PDFGrid_rowspan', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(4);      
        // add row     
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
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;
        let childpdfGridRow3 :PdfGridRow;

        childpdfGridRow1 = childPdfGrid.rows.addRow();  
        childpdfGridRow2 = childPdfGrid.rows.addRow(); 
        childpdfGridRow3 = childPdfGrid.rows.addRow(); 

        childpdfGridRow1.cells.getCell(1).rowSpan=2;  
        childpdfGridRow2.cells.getCell(2).rowSpan=2;  

        childpdfGridRow1.cells.getCell(0).value = "one elemen";
        childpdfGridRow1.cells.getCell(1).value = "two";  
        childpdfGridRow1.cells.getCell(2).value = "three ele";  
        childpdfGridRow2.cells.getCell(0).value = "four";  
        childpdfGridRow2.cells.getCell(1).value = "five";  
        childpdfGridRow2.cells.getCell(2).value = "six";  
        childpdfGridRow3.cells.getCell(1).value = "seven"; 
             
        pdfGridRow1.cells.getCell(0).rowSpan=2;
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow2.cells.getCell(2).rowSpan=3;
        pdfGridRow4.cells.getCell(1).rowSpan=2;
        pdfGridRow6.cells.getCell(0).rowSpan=4;
        pdfGridRow6.cells.getCell(2).value=childPdfGrid; 
        pdfGridRow8.cells.getCell(1).rowSpan=3;
 
        //pdfGridRow3.cells.getCell(1).columnSpan = 2;         
     
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_multilevel_rowspan.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_multilevel_rowspan.pdf');
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
        //document.save('PDFGrid_EJ2-11259_single_grid_font.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_single_grid_font.pdf');
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
describe('PDFGrid_multiple_nestedgrid_in_row',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(2);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 2; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+ "row";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow1.cells.getCell(3).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_multiple_nestedgrid_in_row.pdf');
       document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_multiple_nestedgrid_in_row.pdf');
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


describe('PDFGrid_grid_width_change_outer',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(2).width=100;        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);  
        //childPdfGrid.columns.getColumn(0).width=30;             
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "the Cell value "+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_grid_width_change_outer.pdf');
        // destroy the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_grid_width_change_outer.pdf');
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
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
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
          
        //document.save('PDFGrid_EJ2-11259_Multiple_inner_grid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_Multiple_inner_grid.pdf');
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

describe('PDFGrid_nested_grid_greater',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(1).value="Testing";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,10));        
        //document.save('PDFGrid_EJ2-11259_nested_grid_greater.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_nested_grid_greater.pdf');
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
describe('PDFGrid_nested_grid_smaller',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_10212 implement nested grid Implement the basic algorithm";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));        
        //document.save('PDFGrid_EJ2-11259_nested_grid_smaller.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_nested_grid_smaller.pdf');
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
describe('PDFGrid_nested_grid_in_multiple_row',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="Grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_10212 implement nested grid Implement the basic algorithm";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));        
        //document.save('PDFGrid_EJ2-11259_nested_grid_Multiplerow.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_nested_grid_Multiplerow.pdf');
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
describe('PDFGrid_Default_height_outer',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).height= 100;
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.height = 150;
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_10212 implement nested grid Implement the basic algorithm";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_Default_height_outer.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_Default_height_outer.pdf');
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

describe('PDFGrid_Multiple_ParentGrid',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        let parentGrid2 : PdfGrid = new PdfGrid();
        parentGrid.columns.add(3);
        parentGrid2.columns.add(2);
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        let row1 : PdfGridRow = parentGrid2.rows.addRow();                 
        let row2 : PdfGridRow = parentGrid2.rows.addRow();  
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        let childPdfGrid2 : PdfGrid = new PdfGrid();        

        //Set the column and rows for child grid 2
        childPdfGrid2.columns.add(3);               
        let childpdfGridRow2 :PdfGridRow;
        for (var i = 0; i <3; i++)
        {
             childpdfGridRow2 = childPdfGrid2.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow2.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_10212 implement nested grid Implement the basic algorithm ";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;  
        row1.cells.getCell(1).value=childPdfGrid2;
        row1.cells.getCell(0).value="nested grid 2";
        row2.cells.getCell(0).value="parent2";
        //row2.cells.getCell(1).value=childPdfGrid2;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));   
        parentGrid2.draw(page1,new PointF(40,500));     
        //document.save('PDFGrid_EJ2-11259_Multiple_ParentGrid.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_Multiple_ParentGrid.pdf');
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
describe('PDFGrid_ParentGrid_points ',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();                                                

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_10212 implement nested grid Implement the basic algorithm";
        pdfGridRow3.cells.getCell(2).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));  
        parentGrid.draw(page2, new PointF(10,500));        
      
        //document.save('PDFGrid_EJ2-11259_ParentGrid_points.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_ParentGrid_points.pdf');
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

describe('PDFGrid_column_span',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                        
        
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);     

        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <6; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow1.cells.getCell(1).columnSpan = 3;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_column_span_grid.pdf'); 
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_column_span_grid.pdf');
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
describe(' PDFGrid_innerGrid_columnspan',()=>{
    it('PDFGrid_innerGrid_columnspan', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(2);
       // parentGrid.columns.getColumn(2).width=100;
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();  
        let childpdfGridRow2 =childPdfGrid.rows.addRow();  
        childpdfGridRow1.cells.getCell(1).columnSpan=2;        
        childpdfGridRow1.cells.getCell(0).value = "one";
        childpdfGridRow2.cells.getCell(2).value = "two";        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(1).value="inner grid";

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_innerGrid_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_innerGrid_columnspan.pdf');
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

describe('PDFGrid_rowspan',()=>{
    it('PDFGrid_rowspan', (done) => {
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
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }           
        pdfGridRow1.cells.getCell(0).rowSpan=2;
        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;        
        //pdfGridRow3.cells.getCell(1).columnSpan = 2;         
     
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_rowspan.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_rowspan.pdf');
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

describe(' PDFGrid_innerGrid_rowspan',()=>{
    it('PDFGrid_innerGrid_rowspan', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(2);
       // parentGrid.columns.getColumn(2).width=100;
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();  
        let childpdfGridRow2 =childPdfGrid.rows.addRow();  
        childpdfGridRow1.cells.getCell(1).rowSpan=2;        
        childpdfGridRow1.cells.getCell(0).value = "one thousand eight";
        childpdfGridRow2.cells.getCell(2).value = "two";        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(1).value="inner grid";

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-11259_innerGrid_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-11259_innerGrid_rowspan.pdf');
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
