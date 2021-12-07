/**
 * spec document for Nested_grid.ts class
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

describe('PDFGrid_singlecell_extend',()=>{
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
         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                               
                                      
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
       
        //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;                
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).value = "implementation523523523532523523";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "222523 4523532533532 52523235322352";
        childpdfGridRow2.cells.getCell(0).value = "3 25252323 sdfsdgsgsg";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is "+ 4 +" "+ 4 +" nested grid";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is "+ 5 +" "+ 5;   
        pdfGridRow1.cells.getCell(0).value="122415326346tgsdgdsgsdgdsgsdgsgwegdvxzbds";
              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_extend_spilt.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_extend_spilt.pdf');
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

describe('PDFGrid_single_nestedgrid',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         

        // let childPdfGrid : PdfGrid = new PdfGrid();        

        // childPdfGrid.columns.add(3);               
        // let childpdfGridRow1 :PdfGridRow;
        // for (var i = 0; i <2; i++)
        // {
        //      childpdfGridRow1 = childPdfGrid.rows.addRow();           
        //     for (var j = 0; j < 3; j++)
        //     {
        //         childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
        //     }
        // }        
        pdfGridRow1.cells.getCell(0).value="nested grid";    
        pdfGridRow1.cells.getCell(1).value="second";     

        pdfGridRow1.cells.getCell(2).value="third";     

        pdfGridRow2.cells.getCell(0).value="four";     
        pdfGridRow2.cells.getCell(1).value="five";     
        pdfGridRow2.cells.getCell(2).value="six";     

        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_single_grid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_single_grid.pdf');
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
        //document.save('PDFGrid_EJ2-10212_single_nestedgrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_single_nestedgrid.pdf');
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

describe('PDFGrid_innergrid_width_change',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        //parentGrid.columns.getColumn(2).width=100;        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);  
        childPdfGrid.columns.getColumn(0).width=40;   
        childPdfGrid.columns.getColumn(1).width=60;                           
          
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
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value=childPdfGrid;
        pdfGridRow2.cells.getCell(2).value="third";
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_inner_2width_change.pdf');
        // destroy the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_inner_2width_change.pdf');
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

describe('PDFGrid_extend_longtext_wrap',()=>{
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
        // childpdfGridRow1 = childPdfGrid.rows.addRow();
        // childpdfGridRow2 = childPdfGrid.rows.addRow();      
        // childpdfGridRow1.cells.getCell(0).value = "implementation";
        // childpdfGridRow1.cells.getCell(1).value = "1 1";
        // childpdfGridRow1.cells.getCell(2).value = "2 2";
        // childpdfGridRow2.cells.getCell(0).value = "";
        // childpdfGridRow2.cells.getCell(1).value = "the Cell value is "+ 4 +" "+ 4 +" nested grid ";
        // childpdfGridRow2.cells.getCell(2).value = "the Cell value is "+ 5 +" "+ 5;   
        
        pdfGridRow1.cells.getCell(0).value="Nested Table";                
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value="last";
        pdfGridRow2.cells.getCell(0).value="implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
         
       
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_extend_longtext_wrap.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_extend_longtext_wrap.pdf');
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
    it('PDFGrid_Multi_longtext_innercell', (done) => {
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
        childpdfGridRow1.cells.getCell(2).value = "implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid implementation of long test support in multiple nested grid";
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
        //document.save('PDFGrid_EJ2-10212_multi_longtext_innergrid.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_multi_longtext_innergrid.pdf');
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
    it('PDFGrid_longtext_innercell_span', (done) => {
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
        //document.save('PDFGrid_EJ2-10212_longtext_bothspan.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_longtext_bothspan.pdf');
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

        childpdfGridRow1.cells.getCell(0).value = "one";
        childpdfGridRow1.cells.getCell(1).value = "two";  
        childpdfGridRow1.cells.getCell(2).value = "three";  
        childpdfGridRow2.cells.getCell(0).value = "four";  
        childpdfGridRow2.cells.getCell(1).value = "five";  
        childpdfGridRow2.cells.getCell(2).value = "six";  
        childpdfGridRow3.cells.getCell(1).value = "seven"; 

        // for (var i = 0; i <2; i++)
        // {
        //      childpdfGridRow1 = childPdfGrid.rows.addRow();           
        //     for (var j = 0; j < 3; j++)
        //     {
        //         childpdfGridRow1.cells.getCell(j).value = "Cell value are"+ j +" "+ i;
        //     }
        // }           
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
        //document.save('DFGrid_EJ2-10212_multilevel_rowspan.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_multilevel_rowspan.pdf');
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
        parentGrid.style.font=font;  
        childPdfGrid.style.font=font2;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('DFGrid_EJ2-10212_single_grid_font.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_single_grid_font.pdf');
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
                childpdfGridRow1.cells.getCell(j).value = "Cell"+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow1.cells.getCell(3).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_multiple_nestedgrid_in_row.pdf');
       document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_multiple_nestedgrid_in_row.pdf');
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
describe('PDFGrid_Empty_Rows ',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));  
                  
        //document.save('PDFGrid_EJ2-10212_Empty_Rows.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_Empty_Rows.pdf');
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



describe('PDFGrid_innergrid_width_change',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        //parentGrid.columns.getColumn(2).width=100;        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);  
        childPdfGrid.columns.getColumn(0).width=30;             
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
        //document.save('PDFGrid_EJ2-10212_inner_width_change.pdf');
        // destroy the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_inner_width_change.pdf');
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
describe('PDFGrid_parentgrid_width_change',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
        parentGrid.columns.getColumn(2).width=80;        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(4);  
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
        pdfGridRow2.cells.getCell(0).value=childPdfGrid; 
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_parentgrid_width_change.pdf');
        // destroy the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_parentgrid_width_change.pdf');
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

describe('PDFGrid_both_width_change',()=>{
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
        childPdfGrid.columns.getColumn(0).width=30;             
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
        //document.save('PDFGrid_EJ2-10212_both_width_change.pdf');
        // destroy the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_both_width_change.pdf');
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
          
        //document.save('PDFGrid_EJ2-10212_Multiple_inner_grid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_Multiple_inner_grid.pdf');
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
        //document.save('PDFGrid_EJ2-10212_nested_grid_greater.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_nested_grid_greater.pdf');
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
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2-1022 implement nested grid Implement the basic algorithm and calculations for nested grid";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));        
        //document.save('PDFGrid_EJ2-10212_nested_grid_smaller.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_nested_grid_smaller.pdf');
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
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_1012 implement nested grid Implement the basic algorithm and calculations for nested grid";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));        
        //document.save('PDFGrid_EJ2-10212_nested_grid_Multiplerow.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_nested_grid_Multiplerow.pdf');
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
describe('PDFGrid_Default_height_inner',()=>{
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
        let childpdfGridRow2 :PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).height=80;
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6";
        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        //pdfGridRow2.height = 150;
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_1012 implement nested grid Implement the basic algorithm and calculations for nested grid";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_Default_height_inner.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_Default_height_inner.pdf');
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
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_1212 implement nested grid Implement the basic algorithm and calculations for nested grid";
        pdfGridRow2.cells.getCell(2).value=childPdfGrid;  
        row1.cells.getCell(1).value=childPdfGrid2;
        row1.cells.getCell(0).value="nested grid 2";
        row2.cells.getCell(0).value="parent2";
        //row2.cells.getCell(1).value=childPdfGrid2;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));   
        parentGrid2.draw(page1,new PointF(40,500));     
        //document.save('PDFGrid_EJ2-10212_Multiple_ParentGrid.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_Multiple_ParentGrid.pdf');
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
        pdfGridRow2.cells.getCell(0).value="This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript, Branch name-- Ej2_1022 implement nested grid Implement the basic algorithm and calculations for nested grid";
        pdfGridRow3.cells.getCell(2).value=childPdfGrid;          
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,200));  
        parentGrid.draw(page2, new PointF(10,500));        
      
        //document.save('PDFGrid_EJ2-10212_ParentGrid_points.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_ParentGrid_points.pdf');
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


describe('PDFGrid_column_span_grid',()=>{
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
        for (var i = 0; i <2; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i;
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow1.cells.getCell(2).columnSpan = 2;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_column_span.pdf'); 
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_column_span.pdf');
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
       //document.save('PDFGrid_EJ2-10212_innerGrid_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_innerGrid_columnspan.pdf');
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
        //document.save('PDFGrid_EJ2-10212_rowspan.pdf');
         document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_rowspan.pdf');
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
        childpdfGridRow1.cells.getCell(0).value = "one";
        childpdfGridRow2.cells.getCell(2).value = "two";        
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;  
        pdfGridRow2.cells.getCell(1).value="inner grid";

        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-10212_innerGrid_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_innerGrid_rowspan.pdf');
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
describe('PDFGrid_Image',()=>{
    it('image and grid in same page', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();
        //add column
        parentGrid.columns.add(3);
        // add row     
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 7);
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 128, 0));
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        //Create a header and draw the image.
        let bounds1 : RectangleF = new RectangleF(0, 0, document.pages.getPageByIndex(0).getClientSize().width, 100);
        let header : PdfPageTemplateElement = new PdfPageTemplateElement(bounds1);
        //Draw the image in the header.
        header.graphics.drawImage(image, 0, 0, header.width, header.height);
        //Add the header at the top.
        document.template.top = header;
        page1.graphics.drawString('Hello world', font, null, brush, 10, 10, null);        

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
        pdfGridRow1.cells.getCell(0).value="nested grid";               
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;  
        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;  

        // drawing a grid
        parentGrid.draw(page1, new PointF(20,500));        
        //document.save('PDFGrid_EJ2-10212_Image.pdf');
          document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_Image.pdf');
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
    childpdfGridRow1.cells.getCell(5).value = "Child Grid Cell 6";
    childpdfGridRow1.cells.getCell(6).value = "Child Grid Cell 7";
    childpdfGridRow1.cells.getCell(7).value = "Child Grid Cell 8";
    childpdfGridRow1.cells.getCell(8).value = "Child Grid Cell 9";
    childpdfGridRow1.cells.getCell(9).value = "Child Grid Cell 10";

    // for (var i = 0; i <10; i++){
    //  childPdfGrid.columns.getColumn(i).width=51.5;  
    // }    
    pdfGridRow1.cells.getCell(0).value = childPdfGrid;
    //pdfGridRow2.cells.getCell(2).value=childPdfGrid;
    parentGrid.draw(page1, new PointF(0,0));
    //document.save('PDFGrid_EJ2-10212_single_row_longtext.pdf');
    document.save().then((xlBlob: { blobData: Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_single_row_longtext.pdf');
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
describe('PDFGrid_ParentGrid_points ',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page2 : PdfPage = document.pages.add();
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);           
         //Add header.
         parentGrid.headers.add(1);
         let pdfGridHeader : PdfGridRow  = parentGrid.headers.getHeader(0);
         pdfGridHeader.cells.getCell(0).value = "Employee ID";
         pdfGridHeader.cells.getCell(1).value = "Employee Name";
         pdfGridHeader.cells.getCell(2).value = "Salary";
         //Add rows.
         let pdfGridRow : PdfGridRow  = parentGrid.rows.addRow();
         pdfGridRow.cells.getCell(0).value = "E01";
         pdfGridRow.cells.getCell(1).value = "Clay";
         pdfGridRow.cells.getCell(2).value = "$10,000";
         //Draw the PdfGrid.
         
        parentGrid.draw(page2, new PointF(10,100));        
      
        //document.save('PDFGrid_EJ2-10212_ParentGrid_header.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-10212_ParentGrid_header.pdf');
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
