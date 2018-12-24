/**
 * spec document for Pagination.ts class
 */
import { PdfDocument, PdfGraphics, PdfPage, PdfTextWebLink, PdfColor, SizeF, PdfLayoutFormat, PdfSection, PdfBrush, PdfWordWrapType } from './../../src/index';
import {  PdfStringFormat } from './../../src/index';
import { PdfGrid, PdfGridCellStyle } from './../../src/index';
import { PdfGridRow, PdfPen, PdfDocumentLinkAnnotation, PdfSolidBrush, PdfNumberStyle, PdfVerticalAlignment } from './../../src/index';
import { PdfDestination, PdfFont, PdfStandardFont, PdfDestinationMode, PdfDashStyle, PdfTextAlignment } from './../../src/index';
import { PdfBorders, PdfPageSize, PdfPageRotateAngle, RectangleF, PointF, PdfBorderOverlapStyle, PdfPageTemplateElement } from './../../src/index';
import { PdfHorizontalOverflowType, PdfPageOrientation, PdfFontFamily, PdfFontStyle, PdfPageNumberField, PdfBitmap,PdfTrueTypeFont ,PdfTextDirection} from './../../src/index';
import { PdfPageCountField } from './../../src/implementation/document/automatic-fields/page-count-field';
import { PdfCompositeField } from './../../src/implementation/document/automatic-fields/composite-field';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfTextElement, PdfLayoutResult } from './../../src/index';
import { PdfGridStyle } from './../../src/implementation/structured-elements/grid/styles/style';
import { PdfGridLayoutFormat } from './../../src/implementation/structured-elements/grid/layout/grid-layouter';
import { PdfLayoutBreakType, PdfLayoutType} from './../../src/implementation/graphics/figures/enum';
import { StringTokenizer} from './../../src/implementation/graphics/fonts/string-tokenizer';
import { Utils } from './utils.spec';

describe('PDFGrid_styles_SimpleFitPage',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
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
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

    
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage.pdf');
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
describe('PDFGrid_styles_GridFitPage',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(1).value = childPdfGrid1;
        //pdfGridRow8.cells.getCell(2).value = "childPdfGrid1";
        //pdfGridRow8.cells.getCell(2).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_GridFitpage.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_GridFitpage.pdf');
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
describe('PDFGrid_styles_TextFitPage',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        //pdfGridRow8.cells.getCell(1).value = childPdfGrid1;
        //pdfGridRow8.cells.getCell(2).value = "childPdfGrid1";
        pdfGridRow8.cells.getCell(0).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_TextFitpage.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_TextFitpage.pdf');
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
describe('PDFGrid_styles_BothFitPage',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
        //pdfGridRow8.cells.getCell(0).value = "childPdfGrid1";
        pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_BothFitpage.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_BothFitpage.pdf');
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

describe('PDFGrid_styles_SimpleFitelement',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        //parentGrid.allowRowBreakAcrossPages = true;
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
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

    
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitelement.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitelement.pdf');
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
describe('PDFGrid_styles_GridFitElement',()=>{
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
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;              
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();    
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test support in multiple nested grid";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "FitElement sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = childPdfGrid;
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(0).value = childPdfGrid;
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid;
        pdfGridRow11.cells.getCell(2).value = childPdfGrid;
        pdfGridRow12.cells.getCell(1).value = childPdfGrid;
        pdfGridRow13.cells.getCell(2).value = childPdfGrid;
        pdfGridRow14.cells.getCell(1).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.break = PdfLayoutBreakType.FitElement;

        layoutFormat.layout = PdfLayoutType.Paginate;
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_Grid_fitelement.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_Grid_fitelement.pdf');
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
describe('PDFGrid_styles_BothFitelement',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        //parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implement of long";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(0).value = childPdfGrid;
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid;

        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_Bothfitelement.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_Bothfitelement.pdf');
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
describe('PDFGrid_styles_Fitelement_padding',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        //parentGrid.allowRowBreakAcrossPages = true;
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
          
        
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid.columns.add(3);               
       let childpdfGridRow1 :PdfGridRow;
       let childpdfGridRow2 : PdfGridRow;
       let childpdfGridRow3 : PdfGridRow; 
       let childpdfGridRow4 : PdfGridRow;     
       childpdfGridRow1 = childPdfGrid.rows.addRow();
       childpdfGridRow2 = childPdfGrid.rows.addRow();
       childpdfGridRow3 = childPdfGrid.rows.addRow();
       childpdfGridRow4 = childPdfGrid.rows.addRow();
       childpdfGridRow1.cells.getCell(0).value = "implementation";
       childpdfGridRow1.cells.getCell(1).value = "1 1";
       childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow2.cells.getCell(0).value = "Test cases";
       childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

       childpdfGridRow4.cells.getCell(0).value = "cell spacing";
       childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow4.cells.getCell(2).value = "ascii value";
       
       //add another child 
       let childPdfGrid1 : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid1.columns.add(3);               
       let childpdfGridRow11 :PdfGridRow;
       let childpdfGridRow21 : PdfGridRow;
       let childpdfGridRow31 : PdfGridRow; 
       let childpdfGridRow41 : PdfGridRow;     
       childpdfGridRow11 = childPdfGrid1.rows.addRow();
       childpdfGridRow21 = childPdfGrid1.rows.addRow();
       childpdfGridRow31 = childPdfGrid1.rows.addRow();
       childpdfGridRow41 = childPdfGrid1.rows.addRow();
       childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
       childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
       childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
       childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow31.cells.getCell(2).value = "sample check";

       childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
       childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
       pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
       pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
       pdfGridRow1.cells.getCell(2).value=childPdfGrid;
       
       //pdfGridRow2.cells.getCell(1).value="second";
       
       pdfGridRow2.cells.getCell(1).value="second";
       pdfGridRow2.cells.getCell(2).value="third";
       pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

       childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

       //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
       pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
       pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow4.cells.getCell(0).value = childPdfGrid;
       //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
       pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
       pdfGridRow7.cells.getCell(2).value = childPdfGrid;
       pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
       //pdfGridRow8.cells.getCell(0).value = "childPdfGrid1";
       pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
       pdfGridRow9.cells.getCell(2).value = childPdfGrid;
       pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow11.cells.getCell(0).value = childPdfGrid;
       pdfGridRow12.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow13.cells.getCell(0).value = childPdfGrid;
       pdfGridRow14.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow15.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        parentGrid.style.cellPadding.all =10;
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12752_FitElement_padding.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_FitElement_padding.pdf');
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
describe('PDFGrid_styles_Fitelement_spacing',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        //parentGrid.allowRowBreakAcrossPages = true;
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
          
        
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid.columns.add(3);               
       let childpdfGridRow1 :PdfGridRow;
       let childpdfGridRow2 : PdfGridRow;
       let childpdfGridRow3 : PdfGridRow; 
       let childpdfGridRow4 : PdfGridRow;     
       childpdfGridRow1 = childPdfGrid.rows.addRow();
       childpdfGridRow2 = childPdfGrid.rows.addRow();
       childpdfGridRow3 = childPdfGrid.rows.addRow();
       childpdfGridRow4 = childPdfGrid.rows.addRow();
       childpdfGridRow1.cells.getCell(0).value = "implementation";
       childpdfGridRow1.cells.getCell(1).value = "1 1";
       childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow2.cells.getCell(0).value = "Test cases";
       childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

       childpdfGridRow4.cells.getCell(0).value = "cell spacing";
       childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow4.cells.getCell(2).value = "ascii value";
       
       //add another child 
       let childPdfGrid1 : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid1.columns.add(3);               
       let childpdfGridRow11 :PdfGridRow;
       let childpdfGridRow21 : PdfGridRow;
       let childpdfGridRow31 : PdfGridRow; 
       let childpdfGridRow41 : PdfGridRow;     
       childpdfGridRow11 = childPdfGrid1.rows.addRow();
       childpdfGridRow21 = childPdfGrid1.rows.addRow();
       childpdfGridRow31 = childPdfGrid1.rows.addRow();
       childpdfGridRow41 = childPdfGrid1.rows.addRow();
       childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
       childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
       childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
       childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow31.cells.getCell(2).value = "sample check";

       childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
       childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
       pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
       pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
       pdfGridRow1.cells.getCell(2).value=childPdfGrid;
       
       //pdfGridRow2.cells.getCell(1).value="second";
       
       pdfGridRow2.cells.getCell(1).value="second";
       pdfGridRow2.cells.getCell(2).value="third";
       pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

       childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

       //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
       pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
       pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow4.cells.getCell(0).value = childPdfGrid;
       //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
       pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
       pdfGridRow7.cells.getCell(2).value = childPdfGrid;
       pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
       //pdfGridRow8.cells.getCell(0).value = "childPdfGrid1";
       pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
       pdfGridRow9.cells.getCell(2).value = childPdfGrid;
       pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow11.cells.getCell(0).value = childPdfGrid;
       pdfGridRow12.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow13.cells.getCell(0).value = childPdfGrid;
       pdfGridRow14.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow15.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        childPdfGrid1.style.cellSpacing = 10;
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12752_FitElement_spacing.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_FitElement_spacing.pdf');
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
describe('PDFGrid_styles_Fitelement_NoAllow',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = false;
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
          
        
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid.columns.add(3);               
       let childpdfGridRow1 :PdfGridRow;
       let childpdfGridRow2 : PdfGridRow;
       let childpdfGridRow3 : PdfGridRow; 
       let childpdfGridRow4 : PdfGridRow;     
       childpdfGridRow1 = childPdfGrid.rows.addRow();
       childpdfGridRow2 = childPdfGrid.rows.addRow();
       childpdfGridRow3 = childPdfGrid.rows.addRow();
       childpdfGridRow4 = childPdfGrid.rows.addRow();
       childpdfGridRow1.cells.getCell(0).value = "implementation";
       childpdfGridRow1.cells.getCell(1).value = "1 1";
       childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow2.cells.getCell(0).value = "Test cases";
       childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

       childpdfGridRow4.cells.getCell(0).value = "cell spacing";
       childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow4.cells.getCell(2).value = "ascii value";
       
       //add another child 
       let childPdfGrid1 : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid1.columns.add(3);               
       let childpdfGridRow11 :PdfGridRow;
       let childpdfGridRow21 : PdfGridRow;
       let childpdfGridRow31 : PdfGridRow; 
       let childpdfGridRow41 : PdfGridRow;     
       childpdfGridRow11 = childPdfGrid1.rows.addRow();
       childpdfGridRow21 = childPdfGrid1.rows.addRow();
       childpdfGridRow31 = childPdfGrid1.rows.addRow();
       childpdfGridRow41 = childPdfGrid1.rows.addRow();
       childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
       childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
       childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
       childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow31.cells.getCell(2).value = "sample check";

       childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
       childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
       pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
       pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
       pdfGridRow1.cells.getCell(2).value=childPdfGrid;
       
       //pdfGridRow2.cells.getCell(1).value="second";
       
       pdfGridRow2.cells.getCell(1).value="second";
       pdfGridRow2.cells.getCell(2).value="third";
       pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

       childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

       //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
       pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
       pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow4.cells.getCell(0).value = childPdfGrid;
       //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
       pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
       pdfGridRow7.cells.getCell(2).value = childPdfGrid;
       pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
       //pdfGridRow8.cells.getCell(0).value = "childPdfGrid1";
       pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
       pdfGridRow9.cells.getCell(2).value = childPdfGrid;
       pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow11.cells.getCell(0).value = childPdfGrid;
       pdfGridRow12.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow13.cells.getCell(0).value = childPdfGrid;
       pdfGridRow14.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow15.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;        
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('PDFGrid_EJ2-12752_FitPage_test2.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_FitPage_test2.pdf');
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
describe('PDFGrid_styles_SimpleFitTocolumn_overflow2',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let MainGrid2 : PdfGrid = new PdfGrid();        
        
        //add column        
        MainGrid2.columns.add(1);
        //MainGrid2.allowRowBreakAcrossPages = true;
        let MainGridRow11 : PdfGridRow = MainGrid2.rows.addRow(); 
        let MainGridRow12 : PdfGridRow = MainGrid2.rows.addRow(); 
        let MainGridRow13 : PdfGridRow = MainGrid2.rows.addRow(); 
        let parentGrid : PdfGrid = new PdfGrid();                
        //add column        
        parentGrid.columns.add(3);
        
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
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            MainGridRow12.cells.getCell(0).value=parentGrid;

        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitColumnsToPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        MainGrid2.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitcolumn_overflow2.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitcolumn_overflow2.pdf');
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

describe('PDFGrid_styles_GridFitPage_columnspan',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).columnSpan=2;
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow8.cells.getCell(2).value = "childPdfGrid1";
        //pdfGridRow8.cells.getCell(2).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_GridFitpage_columnspan.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_GridFitpage_columnspan.pdf');
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
describe('PDFGrid_styles_GridFitPage_child_Noallow',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        //parentGrid.allowRowBreakAcrossPages = false;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        let childpdfGridRow5 : PdfGridRow;
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow5= childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        childpdfGridRow5.cells.getCell(0).value = "cell value 5 0";
        childpdfGridRow5.cells.getCell(1).value = "child grid with 1 5 row";               
        childpdfGridRow5.cells.getCell(2).value = " grid value";
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
        pdfGridRow8.cells.getCell(1).value = childPdfGrid;
        pdfGridRow8.cells.getCell(2).value = "childPdfGrid1";
        //pdfGridRow8.cells.getCell(2).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_GridFitpage_Noallow.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_GridFitpage_Noallow.pdf');
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
describe('PDFGrid_styles_BothFitPage',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        //pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
        //pdfGridRow8.cells.getCell(0).value = "childPdfGrid1";
        pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_Fitpage.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_Fitpage.pdf');
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


describe('PDFGrid_styles_GridFitPage_multiplegrid',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        //parentGrid.style.allowHorizontalOverflow = true;
        //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
         let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        // add nested grid
        let childPdfGrid : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid.columns.add(3);               
        let childpdfGridRow1 :PdfGridRow;
        let childpdfGridRow2 : PdfGridRow;
        let childpdfGridRow3 : PdfGridRow; 
        let childpdfGridRow4 : PdfGridRow;     
        childpdfGridRow1 = childPdfGrid.rows.addRow();
        childpdfGridRow2 = childPdfGrid.rows.addRow();
        childpdfGridRow3 = childPdfGrid.rows.addRow();
        childpdfGridRow4 = childPdfGrid.rows.addRow();
        childpdfGridRow1.cells.getCell(0).value = "implementation";
        childpdfGridRow1.cells.getCell(1).value = "1 1";
        childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow2.cells.getCell(0).value = "Test cases";
        childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

        childpdfGridRow4.cells.getCell(0).value = "cell spacing";
        childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow4.cells.getCell(2).value = "ascii value";
        
        //add another child 
        let childPdfGrid1 : PdfGrid = new PdfGrid();        
         //Set the column and rows for child grid
        childPdfGrid1.columns.add(3);               
        let childpdfGridRow11 :PdfGridRow;
        let childpdfGridRow21 : PdfGridRow;
        let childpdfGridRow31 : PdfGridRow; 
        let childpdfGridRow41 : PdfGridRow;     
        childpdfGridRow11 = childPdfGrid1.rows.addRow();
        childpdfGridRow21 = childPdfGrid1.rows.addRow();
        childpdfGridRow31 = childPdfGrid1.rows.addRow();
        childpdfGridRow41 = childPdfGrid1.rows.addRow();
        //childpdfGridRow11.cells.getCell(0).columnSpan=2;
        childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
        childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
        childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
        
        childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
        childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
        childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
        
        childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
        childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
        childpdfGridRow31.cells.getCell(2).value = "sample check";

        childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
        childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
        childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
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
        childpdfGridRow21.cells.getCell(2).value=childPdfGrid2;
        //childpdfGridRow41.cells.getCell(1).value=childPdfGrid2;
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
        pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
        pdfGridRow1.cells.getCell(2).value=childPdfGrid;
        
        //pdfGridRow2.cells.getCell(1).value="second";
        
        pdfGridRow2.cells.getCell(1).value="second";
        pdfGridRow2.cells.getCell(2).value="third";
        pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

        childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

        //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
        pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
        pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow4.cells.getCell(0).value = childPdfGrid;
        //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
        pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
        pdfGridRow7.cells.getCell(2).value = childPdfGrid;
        pdfGridRow8.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow8.cells.getCell(2).value = "childPdfGrid1";
        //pdfGridRow8.cells.getCell(2).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        // childPdfGrid2.LayoutFormat.break=PdfLayoutBreakType.FitPage;
        // childPdfGrid2.LayoutFormat.layout =PdfLayoutType.Paginate;
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_GridFitpage_mutiplegrid.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_GridFitpage_Multiplegrid.pdf');
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

describe('PDFGrid_styles_SimpleFitPage_overflow1',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
        parentGrid.allowRowBreakAcrossPages = true;
        let ParentGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let childGrid : PdfGrid = new PdfGrid();                
        //add column        
        childGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow6 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow7 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow8 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow9 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow10 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow11 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow12 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow13 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow14 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow15 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow16 : PdfGridRow = childGrid.rows.addRow();        
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            ParentGridRow2.cells.getCell(0).value=childGrid;
            ParentGridRow2.cells.getCell(2).value=" Tested Value";
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_overflow1_with text.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_overflow.pdf');
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

/**** 
describe('PDFGrid_styles_AllGridFitPage',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       // add a page
       let page1 : PdfPage = document.pages.add();
       // create a PdfGrid
       let parentGrid : PdfGrid = new PdfGrid();        
       
       //add column        
       parentGrid.columns.add(3);
      
       parentGrid.allowRowBreakAcrossPages = true;
       //parentGrid.style.allowHorizontalOverflow = true;
       //parentGrid.style.horizontalOverflowType= PdfHorizontalOverflowType.NextPage;    
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
        let pdfGridRow11 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow12 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow13 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow14 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow15 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow16 : PdfGridRow = parentGrid.rows.addRow();
       // add nested grid
       let childPdfGrid : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid.columns.add(3);               
       let childpdfGridRow1 :PdfGridRow;
       let childpdfGridRow2 : PdfGridRow;
       let childpdfGridRow3 : PdfGridRow; 
       let childpdfGridRow4 : PdfGridRow;     
       childpdfGridRow1 = childPdfGrid.rows.addRow();
       childpdfGridRow2 = childPdfGrid.rows.addRow();
       childpdfGridRow3 = childPdfGrid.rows.addRow();
       childpdfGridRow4 = childPdfGrid.rows.addRow();
       childpdfGridRow1.cells.getCell(0).value = "implementation";
       childpdfGridRow1.cells.getCell(1).value = "1 1";
       childpdfGridRow1.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow2.cells.getCell(0).value = "Test cases";
       childpdfGridRow2.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow2.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow3.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow3.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow3.cells.getCell(2).value = "@@%%&&$$";

       childpdfGridRow4.cells.getCell(0).value = "cell spacing";
       childpdfGridRow4.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow4.cells.getCell(2).value = "ascii value";
       
       //add another child 
       let childPdfGrid1 : PdfGrid = new PdfGrid();        
        //Set the column and rows for child grid
       childPdfGrid1.columns.add(3);               
       let childpdfGridRow11 :PdfGridRow;
       let childpdfGridRow21 : PdfGridRow;
       let childpdfGridRow31 : PdfGridRow; 
       let childpdfGridRow41 : PdfGridRow;     
       childpdfGridRow11 = childPdfGrid1.rows.addRow();
       childpdfGridRow21 = childPdfGrid1.rows.addRow();
       childpdfGridRow31 = childPdfGrid1.rows.addRow();
       childpdfGridRow41 = childPdfGrid1.rows.addRow();
       childpdfGridRow11.cells.getCell(0).value = "cell value 0 0";
       childpdfGridRow11.cells.getCell(1).value = "cell value 1 1";
       childpdfGridRow11.cells.getCell(2).value = "the cell value is 2 2 ";
       
       childpdfGridRow21.cells.getCell(0).value = "cell value 0 1";
       childpdfGridRow21.cells.getCell(1).value = "the Cell value is 4 4 nested grid";               
       childpdfGridRow21.cells.getCell(2).value = "the Cell value is 5 5";       
       
       childpdfGridRow31.cells.getCell(0).value = "#123 implementation of long test";
       childpdfGridRow31.cells.getCell(1).value = "the Cell value is 1 1";               
       childpdfGridRow31.cells.getCell(2).value = "sample check";

       childpdfGridRow41.cells.getCell(0).value = "cell value 4 1";
       childpdfGridRow41.cells.getCell(1).value = "Fitpage sample document";               
       childpdfGridRow41.cells.getCell(2).value = "cell value 4 3";
       pdfGridRow1.cells.getCell(0).value=childPdfGrid;              
       pdfGridRow1.cells.getCell(1).value=childPdfGrid; 
       pdfGridRow1.cells.getCell(2).value=childPdfGrid;
       
       //pdfGridRow2.cells.getCell(1).value="second";
       
       pdfGridRow2.cells.getCell(1).value="second";
       pdfGridRow2.cells.getCell(2).value="third";
       pdfGridRow3.cells.getCell(0).value="implementation of long test support in multiple nested grid";

       childPdfGrid.style.textBrush = new PdfSolidBrush(new PdfColor(40, 150, 30));//-----green

       //parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
       pdfGridRow2.cells.getCell(0).value = childPdfGrid; 
       pdfGridRow3.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow4.cells.getCell(0).value = childPdfGrid;
       //pdfGridRow5.cells.getCell(2).value = childPdfGrid;
       pdfGridRow6.cells.getCell(1).value = "This is the example sample for pdf nested grid support in EJ2 pdf -library using typescript. it has not appears the cell height values";
       pdfGridRow7.cells.getCell(2).value = childPdfGrid;
       pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
       pdfGridRow8.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow8.cells.getCell(2).value = childPdfGrid1;
       
       pdfGridRow9.cells.getCell(2).value = childPdfGrid;
       pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow11.cells.getCell(0).value = childPdfGrid;
       pdfGridRow12.cells.getCell(1).value = childPdfGrid;
       pdfGridRow12.cells.getCell(2).value = childPdfGrid1;
       pdfGridRow13.cells.getCell(0).value = childPdfGrid;
       pdfGridRow13.cells.getCell(2).value = childPdfGrid1;
       pdfGridRow14.cells.getCell(1).value = childPdfGrid1;
       pdfGridRow15.cells.getCell(0).value = childPdfGrid;
       //pdfGridRow13.cells.getCell(2).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
       let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

       layoutFormat.layout = PdfLayoutType.Paginate;
       layoutFormat.break = PdfLayoutBreakType.FitPage;

       // drawing a grid           
       parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
       //document.save('PDFGrid_EJ2-12752_ALLGridFitpage.pdf');  
       document.save().then((xlBlob: { blobData: Blob }) => {
           if (Utils.isDownloadEnabled) {
               Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_ALLGridFitpage.pdf');
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

describe('PDFGrid_styles_SimpleFitPage_overflow2',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
        parentGrid.allowRowBreakAcrossPages = true;
        let ParentGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        //let ParentGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let childGrid : PdfGrid = new PdfGrid();                
        //add column        
        childGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow6 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow7 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow8 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow9 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow10 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow11 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow12 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow13 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow14 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow15 : PdfGridRow = childGrid.rows.addRow(); 
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            //ParentGridRow2.cells.getCell(0).value=childGrid;
            ParentGridRow2.cells.getCell(1).value=childGrid;
            //ParentGridRow3.cells.getCell(2).value=childGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_overflow2.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_overflow1.pdf');
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

describe('PDFGrid_styles_SimpleFitPage_overflow3',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
        parentGrid.allowRowBreakAcrossPages = true;
        let ParentGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let childGrid : PdfGrid = new PdfGrid();                
        //add column        
        childGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow6 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow7 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow8 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow9 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow10 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow11 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow12 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow13 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow14 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow15 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow16 : PdfGridRow = childGrid.rows.addRow();        
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            //ParentGridRow2.cells.getCell(0).value=childGrid;
            //ParentGridRow2.cells.getCell(1).value=childGrid;
            ParentGridRow2.cells.getCell(2).value=childGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_overflow3.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_overflow1.pdf');
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

describe('PDFGrid_styles_SimpleFitPage_overflow',()=>{
    it('PDFGrid', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
        parentGrid.allowRowBreakAcrossPages = true;
        let ParentGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow2 : PdfGridRow = parentGrid.rows.addRow(); 
        let ParentGridRow3 : PdfGridRow = parentGrid.rows.addRow(); 
        let childGrid : PdfGrid = new PdfGrid();                
        //add column        
        childGrid.columns.add(3);
        
        let pdfGridRow1 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow2 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow3 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow4 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow5 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow6 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow7 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow8 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow9 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow10 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow11 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow12 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow13 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow14 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow15 : PdfGridRow = childGrid.rows.addRow(); 
        let pdfGridRow16 : PdfGridRow = childGrid.rows.addRow();        
        
            pdfGridRow1.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow1.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow1.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow2.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow2.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow2.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow3.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow3.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow4.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow4.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow5.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow5.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow6.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow6.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow7.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow7.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";

            pdfGridRow8.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow8.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow8.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow9.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow9.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow10.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow10.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow11.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow11.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow12.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow12.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow13.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow13.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow14.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";               
            pdfGridRow14.cells.getCell(1).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow15.cells.getCell(0).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            pdfGridRow16.cells.getCell(2).value="the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF";
            ParentGridRow2.cells.getCell(0).value=childGrid;
            ParentGridRow2.cells.getCell(1).value=childGrid;
            ParentGridRow2.cells.getCell(2).value=childGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_overflowAll.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_overflow1.pdf');
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
////////////////////////removed
*******/

describe('PDFGrid_styles_SimpleFitPage_Testcase1',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        
        parentGrid.columns.add(1);
        parentGrid.allowRowBreakAcrossPages = true;
        let pdfGridRow1 : PdfGridRow ;               
        //let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        for (var i = 0; i <10; i++)
        {
             pdfGridRow1 = parentGrid.rows.addRow();           
            
        }  
        let childPdfGrid : PdfGrid = new PdfGrid();        

        childPdfGrid.columns.add(10);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <20; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 10; j++)
            {
                childPdfGrid.rows.getRow(i).cells.getCell(j).value = "child grid sample testcase value is "+ i +" "+ j;
            }
        }        
        //pdfGridRow1.cells.getCell(0).value="Sample testcase";
        parentGrid.rows.getRow(1).cells.getCell(0).value = childPdfGrid;
        parentGrid.rows.getRow(2).cells.getCell(0).value = childPdfGrid;
        parentGrid.rows.getRow(4).cells.getCell(0).value = childPdfGrid;
        parentGrid.rows.getRow(9).cells.getCell(0).value = childPdfGrid;
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_testcase1.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_testcase1.pdf');
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
describe('PDFGrid_styles_SimpleFitPage_Testcase3',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        
        parentGrid.columns.add(10);
        parentGrid.allowRowBreakAcrossPages = true;
        let pdfGridRow1 : PdfGridRow ;               
        //let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        for (var i = 0; i <100; i++)
        {
             pdfGridRow1 = parentGrid.rows.addRow();           
            
        }  
        // let childPdfGrid : PdfGrid = new PdfGrid();        

        // childPdfGrid.columns.add(10);               
        // let childpdfGridRow1 :PdfGridRow;
        // for (var i = 0; i <100; i++)
        // {
        //      childpdfGridRow1 = childPdfGrid.rows.addRow();           
        //     for (var j = 0; j < 10; j++)
        //     {
        //         childpdfGridRow1.cells.getCell(j).value = "child grid Cell value is "+ j +" "+ i;
        //     }
        // }        
        //pdfGridRow1.cells.getCell(0).value="Sample testcase";
        parentGrid.rows.getRow(50).cells.getCell(5).value ="Sample testcase";               
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_testcase3.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_testcase3.pdf');
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
describe('PDFGrid_styles_SimpleFitPage_Testcase2',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        
        parentGrid.columns.add(10);
        parentGrid.allowRowBreakAcrossPages = true;
         let pdfGridRow1 : PdfGridRow ;                 
        // let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
              
        for (var i = 0; i <100; i++)
        {
             pdfGridRow1 = parentGrid.rows.addRow();           
            for (var j = 0; j < 1; j++)
            {
                parentGrid.rows.getRow(i).cells.getCell(j).columnSpan=10;
            }
        }  
        parentGrid.rows.getRow(0).cells.getCell(0).rowSpan=100;
        let childPdfGrid : PdfGrid = new PdfGrid();  
        childPdfGrid.columns.add(10);               
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <100; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 10; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "child grid Cell Sample testcase value is "+ j +" "+ i;
            }
        }        
        //pdfGridRow1.cells.getCell(0).value="Sample testcase";
        parentGrid.rows.getRow(0).cells.getCell(0).value = childPdfGrid;               
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_testcase2.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_testcase2.pdf');
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

describe('PDFGrid_styles_SimpleFitPage_Test3',()=>{
    it('PDFGrid', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
        
        parentGrid.columns.add(10);
        parentGrid.allowRowBreakAcrossPages = true;
        let pdfGridRow1 : PdfGridRow ;               
        //let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                 
        for (var i = 0; i <100; i++)
        {
             pdfGridRow1 = parentGrid.rows.addRow();           
            
        }  
        // let childPdfGrid : PdfGrid = new PdfGrid();        

        // childPdfGrid.columns.add(10);               
        // let childpdfGridRow1 :PdfGridRow;
        // for (var i = 0; i <100; i++)
        // {
        //      childpdfGridRow1 = childPdfGrid.rows.addRow();           
        //     for (var j = 0; j < 10; j++)
        //     {
        //         childpdfGridRow1.cells.getCell(j).value = "child grid Cell value is "+ j +" "+ i;
        //     }
        // }        
        //pdfGridRow1.cells.getCell(0).value="Sample testcase";
        for (var i = 0; i <100; i++)
        {
             //childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 10; j++)
            {
                parentGrid.rows.getRow(i).cells.getCell(j).value = "child grid Cell value is "+ j +" "+ i + "fitpage support";
            }
        } 
        //parentGrid.rows.getRow(50).cells.getCell(5).value ="Sample testcases";               
        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitPage;
        layoutFormat.layout = PdfLayoutType.Paginate;
        
        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('PDFGrid_EJ2-12752_simple_fitpage_test.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PDFGrid_EJ2-12752_simple_fitpage_test.pdf');
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
