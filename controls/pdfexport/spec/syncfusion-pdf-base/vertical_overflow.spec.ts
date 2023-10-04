/**
 * spec document for VerticalOverflow.ts class
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

describe('PDFGrid_vertical_overflow',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);        
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  

        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);         
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow4.cells.getCell(2).value="sample pdf";
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow9.cells.getCell(3).value="vertical overflow";
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_overflow.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_overflow.pdf');
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
describe('PDFGrid_Vertical_overflow(fixedWidth)',()=>{
    it('PDFGrid fixed width', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=140;
        parentGrid.columns.getColumn(1).width=125;
        parentGrid.columns.getColumn(2).width=130;
        parentGrid.columns.getColumn(3).width=120;
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();    
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_FixedWidth.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_FixedWidth.pdf');
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
describe('PDFGrid_simple(columnspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
         
        //pdfGridRow1.cells.getCell(2).rowSpan = 3;
        pdfGridRow1.cells.getCell(2).columnSpan = 2;                 
        pdfGridRow3.cells.getCell(2).columnSpan = 2; 

       
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(0).columnSpan = 2;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2 value";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "thechanges val";        
        
        pdfGridRow1.cells.getCell(0).value="nested grid";          
        pdfGridRow1.cells.getCell(2).value="implementation process";
        pdfGridRow1.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow2.cells.getCell(1).value="value";
        pdfGridRow2.cells.getCell(3).value=childPdfGrid;
        pdfGridRow3.cells.getCell(1).value=childPdfGrid;        

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_columnspan.pdf');
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
describe('PDFGrid_Vertical_overflow(Bothspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
      
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();
        
        pdfGridRow2.cells.getCell(0).rowSpan=5;
        pdfGridRow6.cells.getCell(1).columnSpan = 2; 
        pdfGridRow13.cells.getCell(3).rowSpan = 4; 
        pdfGridRow17.cells.getCell(2).columnSpan = 2; 
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(0).columnSpan=2;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2 value";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "thechanges val";        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_bothspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_bothspan.pdf');
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
describe('PDFGrid_Vertical_overflow(rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        //let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 128, 0));
        parentGrid.columns.add(4);        
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        pdfGridRow2.cells.getCell(3).rowSpan=3;
        pdfGridRow4.cells.getCell(0).rowSpan=4;
        // pdfGridRow10.cells.getCell(2).rowSpan = 4; 
        // pdfGridRow17.cells.getCell(1).rowSpan =5;
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        
        
        childPdfGrid.columns.add(3); 
        //childPdfGrid.style.backgroundBrush=brush;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
        pdfGridRow16.cells.getCell(1).value=childPdfGrid;      
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow20.cells.getCell(3).value=childPdfGrid;
        pdfGridRow21.cells.getCell(3).value=childPdfGrid;
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow23.cells.getCell(3).value=childPdfGrid;
        pdfGridRow24.cells.getCell(0).value=childPdfGrid;
        pdfGridRow25.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_rowspan.pdf');
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
describe('PDFGrid_Vertical_overflow(fixedW_columnspan)',()=>{
    it('PDFGrid fixed width', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=140;
        parentGrid.columns.getColumn(1).width=125;
        parentGrid.columns.getColumn(2).width=130;
        parentGrid.columns.getColumn(3).width=120;
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        pdfGridRow3.cells.getCell(0).columnSpan = 3;
        pdfGridRow8.cells.getCell(2).columnSpan = 2; 
        pdfGridRow12.cells.getCell(1).columnSpan = 2;                 
        pdfGridRow17.cells.getCell(0).columnSpan = 2; 
        pdfGridRow22.cells.getCell(2).columnSpan = 2; 
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
         //childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_FixedWidth_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_FixedWidth_columnspan.pdf');
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
describe('PDFGrid_Vertical_overflow(FixedW_rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        parentGrid.columns.getColumn(0).width=140;
        parentGrid.columns.getColumn(1).width=125;
        parentGrid.columns.getColumn(2).width=130;
        parentGrid.columns.getColumn(3).width=120;
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        pdfGridRow2.cells.getCell(3).rowSpan = 3;
        pdfGridRow4.cells.getCell(0).rowSpan = 4;
        pdfGridRow13.cells.getCell(2).rowSpan = 4; 
        pdfGridRow17.cells.getCell(1).rowSpan = 5;
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        // childPdfGrid.columns.getColumn(0).width=30;              
         //childPdfGrid.columns.getColumn(1).width=50;
        // childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_FixedWidth_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_FixedWidth_rowspan.pdf');
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
describe('PDFGrid_simple(rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow(); 
        pdfGridRow1.cells.getCell(1).rowSpan = 4;
        pdfGridRow1.cells.getCell(3).rowSpan = 3;
        pdfGridRow2.cells.getCell(2).rowSpan = 2;  
        pdfGridRow3.cells.getCell(0).rowSpan = 2;               
        //pdfGridRow3.cells.getCell(2).columnSpan = 2; 

       
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3);         
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(0).columnSpan = 3;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2 value";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "thechanges val";        
        
        pdfGridRow1.cells.getCell(0).value="nested grid";
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;          
        pdfGridRow1.cells.getCell(2).value="implementation process";
        pdfGridRow1.cells.getCell(3).value=childPdfGrid;
        pdfGridRow2.cells.getCell(0).value=childPdfGrid; 
        pdfGridRow2.cells.getCell(1).value="value";        
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;        
        pdfGridRow4.cells.getCell(2).value="test";   
        //pdfGridRow5.cells.getCell(2).value=childPdfGrid;   
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_rowspan.pdf');
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
describe('PDFGrid_simple(bothspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
         
        pdfGridRow1.cells.getCell(1).rowSpan = 3;
        pdfGridRow2.cells.getCell(2).columnSpan = 2;
        pdfGridRow2.cells.getCell(0).rowSpan =2;                 
        pdfGridRow3.cells.getCell(2).columnSpan = 2;                 
       
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(0).columnSpan = 3;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2 value";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "thechanges val";        
        
        pdfGridRow1.cells.getCell(0).value="nested grid";          
        pdfGridRow1.cells.getCell(2).value="implementation process";
        pdfGridRow1.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow2.cells.getCell(1).value="value";
        pdfGridRow2.cells.getCell(3).value=childPdfGrid;
        pdfGridRow3.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid; 

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_bothspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_bothspan.pdf');
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
describe('PDFGrid_singlecell(bothspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
        
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
         
        //pdfGridRow1.cells.getCell(1).rowSpan = 3;
        pdfGridRow2.cells.getCell(1).columnSpan = 3;
        pdfGridRow2.cells.getCell(1).rowSpan = 2;                 
        //pdfGridRow3.cells.getCell(2).columnSpan = 2;                        
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(2).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(0).columnSpan = 3;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2 value";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";
        childpdfGridRow2.cells.getCell(2).value = "thechanges val";        
        
        pdfGridRow1.cells.getCell(0).value="nested grid";          
        pdfGridRow1.cells.getCell(2).value="implementation process";
        pdfGridRow1.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow2.cells.getCell(1).value="value";
        pdfGridRow2.cells.getCell(3).value=childPdfGrid;
        pdfGridRow3.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid; 
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_singlecell_bothspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_singlecell_bothspan.pdf');
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
describe('PDFGrid_Vertical_overflow(columnspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);
       
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        //pdfGridRow13.cells.getCell(2).rowSpan = 4; 
        pdfGridRow3.cells.getCell(0).columnSpan = 3;
        pdfGridRow8.cells.getCell(2).columnSpan = 2; 
        pdfGridRow12.cells.getCell(1).columnSpan = 2;                 
        pdfGridRow17.cells.getCell(0).columnSpan = 2; 
        pdfGridRow22.cells.getCell(2).columnSpan = 2; 
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
       
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(1).columnSpan=2;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 values are small ";        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Columnspan.pdf');
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
describe('PDFGrid_Vertical_overflow(Inner_fixedWidth)',()=>{
    it('PDFGrid fixed width', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);       
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Inner_FixedWidth.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Inner_FixedWidth.pdf');
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
describe('PDFGrid_Vertical_overflow(inner_fixedW_columnspan)',()=>{
    it('PDFGrid fixed width', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);        
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        pdfGridRow3.cells.getCell(0).columnSpan = 3;
        pdfGridRow8.cells.getCell(2).columnSpan = 2; 
        pdfGridRow12.cells.getCell(1).columnSpan = 2;                 
        pdfGridRow17.cells.getCell(0).columnSpan = 2; 
        pdfGridRow22.cells.getCell(2).columnSpan = 2; 
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=30;              
        childPdfGrid.columns.getColumn(1).width=50;
        childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Inner_FixedWidth_columnspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Inner_FixedWidth_columnspan.pdf');
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
describe('PDFGrid_Vertical_overflow(inner_FixedW_rowspan)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(4);        
        
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        pdfGridRow2.cells.getCell(3).rowSpan = 3;
        pdfGridRow4.cells.getCell(0).rowSpan = 4;
        pdfGridRow13.cells.getCell(2).rowSpan = 4; 
        pdfGridRow17.cells.getCell(1).rowSpan = 5;
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
        childPdfGrid.columns.getColumn(0).width=40;              
         childPdfGrid.columns.getColumn(1).width=50;
        childPdfGrid.columns.getColumn(2).width=40;
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <4; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 3; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;

        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Inner_FixedWidth_rowspan.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Inner_FixedWidth_rowspan.pdf');
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
// describe('PDFGrid_Vertical_overflow(span_merge)',()=>{
//     it('PDFGrid', (done) => {
//         let document : PdfDocument = new PdfDocument();
       
//         let page1 : PdfPage = document.pages.add();
       
//         let parentGrid : PdfGrid = new PdfGrid();
     
//         parentGrid.columns.add(4);
       
//         let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
//         let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();                     
//         let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow6 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow7 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow8 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow9 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow10 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow12 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow13 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow14 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow15 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow16 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow17 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow18 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow19 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow20 : PdfGridRow = parentGrid.rows.addRow();   
//         let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
//         let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
//         let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
//         let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
//         let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
//         let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
//         let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
//         //pdfGridRow13.cells.getCell(2).rowSpan = 4; 
//         pdfGridRow3.cells.getCell(0).columnSpan = 3;
//         pdfGridRow8.cells.getCell(2).columnSpan = 2; 
//         pdfGridRow12.cells.getCell(1).columnSpan = 2;                 
//         pdfGridRow17.cells.getCell(0).columnSpan = 2; 
//         pdfGridRow22.cells.getCell(2).columnSpan = 2; 
//         //pdfGridRow1.cells.getCell(1).width=50;
//         let childPdfGrid : PdfGrid = new PdfGrid();        

//         childPdfGrid.columns.add(3); 
               
//         let childpdfGridRow1 :PdfGridRow;
//         let childpdfGridRow2 :PdfGridRow;            
//         childpdfGridRow1 = childPdfGrid.rows.addRow();
//         childpdfGridRow2 = childPdfGrid.rows.addRow();      
//         childpdfGridRow1.cells.getCell(0).rowSpan = 2;  
//         childpdfGridRow2.cells.getCell(0).columnSpan= 3;       
//         childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
//         childpdfGridRow1.cells.getCell(1).value = "1 1";
//         childpdfGridRow1.cells.getCell(2).value = "2 2";
//         childpdfGridRow2.cells.getCell(0).value = "3 3";
//         childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
//         childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 values are small ";        
//         pdfGridRow1.cells.getCell(0).value="nested grid";  
        
//         pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
//         pdfGridRow3.cells.getCell(3).value=childPdfGrid;
//         pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
//         pdfGridRow7.cells.getCell(2).value=childPdfGrid;
//         pdfGridRow10.cells.getCell(1).value=childPdfGrid;
//         pdfGridRow12.cells.getCell(2).value=childPdfGrid;
//         pdfGridRow13.cells.getCell(3).value=childPdfGrid;
//         pdfGridRow14.cells.getCell(1).value=childPdfGrid;
//         pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
//         pdfGridRow17.cells.getCell(2).value=" Implementation process";
//         pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
//         pdfGridRow18.cells.getCell(3).value=childPdfGrid;
//         pdfGridRow19.cells.getCell(0).value=" process";
//         pdfGridRow22.cells.getCell(2).value=childPdfGrid;
//         pdfGridRow24.cells.getCell(3).value=childPdfGrid;
//         pdfGridRow26.cells.getCell(1).value=childPdfGrid;
        
//         // drawing a grid
//         parentGrid.draw(page1, new PointF(0,0));        
//         //document.save("PDFGrid_simple.pdf");
//         document.save().then((xlBlob: { blobData: Blob }) => {
//             if (Utils.isDownloadEnabled) {
//                 Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_span_merge.pdf');
//             }
//             let reader: FileReader = new FileReader();
//             reader.readAsArrayBuffer(xlBlob.blobData);
//             reader.onload = (): void => {
//                 if (reader.readyState == 2) { // DONE == 2
//                     expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
//                     done();
//                 }
//             }
//         });
//         document.destroy();             
//     })
// })
describe('PDFGrid_Vertical_overflow(outerfont)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);

        let parentGrid : PdfGrid = new PdfGrid();
        
        parentGrid.columns.add(4);
       
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
        //pdfGridRow13.cells.getCell(2).rowSpan = 4; 
        pdfGridRow3.cells.getCell(0).columnSpan = 3;
        pdfGridRow8.cells.getCell(2).columnSpan = 2; 
        pdfGridRow12.cells.getCell(1).columnSpan = 2;                 
        pdfGridRow17.cells.getCell(0).columnSpan = 2; 
        pdfGridRow22.cells.getCell(2).columnSpan = 2; 
        //pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
       
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(1).columnSpan=2;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 values are small ";        
        pdfGridRow1.cells.getCell(0).value="nested grid";  
        
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;
        parentGrid.style.font=font;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Outerfont.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Outerfont.pdf');
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
describe('PDFGrid_Vertical_overflow(innerfont)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        parentGrid.columns.add(4);
       
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
               
        ///pdfGridRow1.cells.getCell(1).width=50;
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
       
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();      
        childpdfGridRow1.cells.getCell(0).rowSpan = 2;  
        childpdfGridRow2.cells.getCell(1).columnSpan=2;       
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = "3 3";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 values are small ";        
        

        pdfGridRow1.cells.getCell(0).value="nested grid";          
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;
          
        childPdfGrid.style.font=font;
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_innerfont.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_innerfont.pdf');
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
describe('PDFGrid_Vertical_overflow(multiplegrid)',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        parentGrid.columns.add(4);
       
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
        let pdfGridRow21 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow22 : PdfGridRow = parentGrid.rows.addRow();        
        let pdfGridRow23 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow24 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow25 : PdfGridRow = parentGrid.rows.addRow();  
        let pdfGridRow26 : PdfGridRow = parentGrid.rows.addRow(); 
        let pdfGridRow27 : PdfGridRow = parentGrid.rows.addRow();  
               
        ///pdfGridRow1.cells.getCell(1).width=50;
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
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(3); 
       
        
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 :PdfGridRow;            
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();                     
        childpdfGridRow1.cells.getCell(0).value = "the value is 0 0 points are equal then point 5";
        childpdfGridRow1.cells.getCell(1).value = childPdfGrid2;
        childpdfGridRow1.cells.getCell(2).value = "2 2";
        childpdfGridRow2.cells.getCell(0).value = childPdfGrid2;
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 ";
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 6 values are small ";        
        
        
        pdfGridRow1.cells.getCell(0).value="nested grid";          
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow3.cells.getCell(3).value=childPdfGrid;
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;    
        pdfGridRow7.cells.getCell(2).value=childPdfGrid;
        pdfGridRow10.cells.getCell(1).value=childPdfGrid;
        pdfGridRow12.cells.getCell(2).value=childPdfGrid;
        pdfGridRow13.cells.getCell(3).value=childPdfGrid;
        pdfGridRow14.cells.getCell(1).value=childPdfGrid;
        pdfGridRow15.cells.getCell(3).value=childPdfGrid;
                
        pdfGridRow17.cells.getCell(2).value=" Implementation process";
        pdfGridRow17.cells.getCell(3).value=childPdfGrid; 
        pdfGridRow18.cells.getCell(3).value=childPdfGrid;
        pdfGridRow19.cells.getCell(0).value=" process";
        pdfGridRow22.cells.getCell(2).value=childPdfGrid;
        pdfGridRow24.cells.getCell(3).value=childPdfGrid;
        pdfGridRow26.cells.getCell(1).value=childPdfGrid;
                  
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12153_vertical_Multigrid.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12153_vertical_Multigrid.pdf');
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
