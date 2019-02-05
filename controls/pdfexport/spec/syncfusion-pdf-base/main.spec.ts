/**
 * spec document for Main.ts class
 */
import { PdfDocument, PdfGraphics, PdfPage, PdfTextWebLink, PdfColor, SizeF, PdfLayoutBreakType, PdfLayoutType, PdfPen, PdfPaddings } from './../../src/index';
import { PdfGridLayoutFormat, PdfStringFormat, PdfFont, PdfStandardFont, PdfTextAlignment } from './../../src/index';
import { PdfGrid,  PdfSolidBrush, PdfNumberStyle,PdfGridRow } from './../../src/index';
import { PdfPageSize, PdfPageRotateAngle, RectangleF, PointF, PdfPageTemplateElement,PdfBorderOverlapStyle } from './../../src/index';
import { PdfHorizontalOverflowType, PdfPageOrientation, PdfFontFamily, PdfFontStyle, PdfPageNumberField, PdfBitmap } from './../../src/index';
import { PdfPageCountField } from './../../src/implementation/document/automatic-fields/page-count-field';
import { PdfCompositeField } from './../../src/implementation/document/automatic-fields/composite-field';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfTextElement, PdfLayoutResult } from './../../src/index';
import { Utils } from './utils.spec';

describe('Manual testing',()=>{
    it('-Cell Padding1', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);          
     
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,0,20,20); 
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(1).value="Nested Grid";  
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding1.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding2', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";  
        
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(20,20,20,20); 
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,20,20);        
        //Save the document

        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding2.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding3', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }
        childpdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";  
        
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(20,20,20,20); 
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,10,10);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding3.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding4', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
                        
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }   
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        childpdfGridRow1.cells.getCell(1).value = image;
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";          
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(25,25,25,25); 
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        pdfGridRow2.cells.getCell(0).value="Fixed length";     
        pdfGridRow2.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow2.cells.getCell(2).value="second row";
        pdfGridRow3.cells.getCell(0).columnSpan= 3;
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;
        pdfGridRow4.cells.getCell(0).value="Nested Grid";           
        pdfGridRow4.cells.getCell(1).value="First row";
        pdfGridRow4.cells.getCell(2).value="Essential JS2";
        pdfGridRow5.cells.getCell(0).value="second row";       
        pdfGridRow5.cells.getCell(1).value="Supported for fixed width"; 
        pdfGridRow5.cells.getCell(2).style.cellPadding = new PdfPaddings(25,25,25,25);    
        pdfGridRow5.cells.getCell(2).value=image;
        
        //Drawing a grid
        parentGrid.draw(page,20,20);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding4.pdf');
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
    });
});


describe('Manual testing',()=>{
    it('-Cell Padding5', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Right;
        parentGrid.columns.getColumn(0).format=format;
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
                        
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";          
        //pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(25,25,25,25); 
        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        pdfGridRow2.cells.getCell(0).value="Fixed length";     
        pdfGridRow2.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow2.cells.getCell(2).value="second row";
        pdfGridRow3.cells.getCell(0).columnSpan= 3;
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;
        //pdfGridRow3.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);
        pdfGridRow4.cells.getCell(0).value="Nested Grid";           
        pdfGridRow4.cells.getCell(1).value="First row";
        pdfGridRow4.cells.getCell(2).value="Essential JS2";
        //pdfGridRow5.cells.getCell(0).style.cellPadding = new PdfPaddings(25,0,0,0);
        pdfGridRow5.cells.getCell(0).value="Fixed length";     
        pdfGridRow5.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow5.cells.getCell(2).value="second row";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding5.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding5', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Right;
        parentGrid.columns.getColumn(0).format=format;
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
                        
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";          
        //pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(25,25,25,25); 
        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        pdfGridRow2.cells.getCell(0).value="Fixed length";     
        pdfGridRow2.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow2.cells.getCell(2).value="second row";
        pdfGridRow3.cells.getCell(0).columnSpan= 3;
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;
        pdfGridRow3.cells.getCell(0).style.cellPadding = new PdfPaddings(20,0,20,20);
        pdfGridRow4.cells.getCell(0).value="Nested Grid";           
        pdfGridRow4.cells.getCell(1).value="First row";
        pdfGridRow4.cells.getCell(2).value="Essential JS2";
        //pdfGridRow5.cells.getCell(0).style.cellPadding = new PdfPaddings(25,0,0,0);
        pdfGridRow5.cells.getCell(0).value="Fixed length";     
        pdfGridRow5.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow5.cells.getCell(2).value="second row";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding6.pdf');
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
    });
});

describe('Manual testing',()=>{
    it('-Cell Padding7', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        let format : PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.Right;
        parentGrid.columns.getColumn(0).format=format;
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
                        
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";          
        //pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(25,25,25,25); 
        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        pdfGridRow2.cells.getCell(0).value="Fixed length";     
        pdfGridRow2.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow2.cells.getCell(2).value="second row";
        pdfGridRow3.cells.getCell(0).columnSpan= 3;
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;
        pdfGridRow3.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);
        pdfGridRow4.cells.getCell(0).value="Nested Grid";           
        pdfGridRow4.cells.getCell(1).value="First row";
        pdfGridRow4.cells.getCell(2).value="Essential JS2";
        //pdfGridRow5.cells.getCell(0).style.cellPadding = new PdfPaddings(25,0,0,0);
        pdfGridRow5.cells.getCell(0).value="Fixed length";     
        pdfGridRow5.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow5.cells.getCell(2).value="second row";
        //Drawing a grid
        parentGrid.draw(page,20,20);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding7.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding8', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);          
     
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(0,20,20,20); 
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(1).value="Nested Grid";  
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding8.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding9', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);          
     
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(20,20,0,20); 
        pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(0).value="Nested Grid";  
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,10,10);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding9.pdf');
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
    });
});

describe('Manual testing',()=>{
    it('-Cell Padding10', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);          
     
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,0); 
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(1).value="Nested Grid";  
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,20,20);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding10.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('-Cell Padding11', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();   
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <1; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }

        }   
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(10,10,10,10);          
     
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(0,0,0,0); 
        pdfGridRow1.cells.getCell(0).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(1).value="Nested Grid";  
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding11.pdf');
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
    });
});

describe('Manual testing',()=>{
    it('-Cell Padding12', (done) => {
        let document : PdfDocument = new PdfDocument();
        //Add the Page 
        let page : PdfPage = document.pages.add();
        //Create a new PdfGrid.
        let parentGrid : PdfGrid = new PdfGrid();
        //Add three columns.
        parentGrid.columns.add(3);
        
        //Add rows to the PdfGrid.
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow(); 
                        
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow3 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow4 : PdfGridRow = parentGrid.rows.addRow();
        let pdfGridRow5 : PdfGridRow = parentGrid.rows.addRow();
        //Create a another PdfGrid.
        let childPdfGrid : PdfGrid = new PdfGrid();        
        //Add four columns to that child grid.
        childPdfGrid.columns.add(4);       
        let childpdfGridRow1 :PdfGridRow;
        for (var i = 0; i <5; i++)
        {
             childpdfGridRow1 = childPdfGrid.rows.addRow();           
            for (var j = 0; j < 4; j++)
            {
                childpdfGridRow1.cells.getCell(j).value = "Cell "+ j +" "+ i+" width";
            }
        }
        //pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,20,20);          
        pdfGridRow1.cells.getCell(0).value="Nested Grid";          
        pdfGridRow1.cells.getCell(0).style.cellPadding = new PdfPaddings(25,25,25,25); 
        //pdfGridRow1.cells.getCell(1).value=childPdfGrid;        
        pdfGridRow1.cells.getCell(2).value="Essential JS2";
        pdfGridRow2.cells.getCell(0).value="Fixed length";     
        pdfGridRow2.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow2.cells.getCell(2).value="second row";
        pdfGridRow3.cells.getCell(0).columnSpan= 3;
        pdfGridRow3.cells.getCell(0).value=childPdfGrid;
        pdfGridRow3.cells.getCell(0).style.cellPadding = new PdfPaddings(20,20,0,20);
        pdfGridRow4.cells.getCell(0).value="Nested Grid";           
        pdfGridRow4.cells.getCell(1).value="First row";
        pdfGridRow4.cells.getCell(2).value="Essential JS2";
        pdfGridRow5.cells.getCell(0).style.cellPadding = new PdfPaddings(25,20,0,0);
        pdfGridRow5.cells.getCell(0).value=childPdfGrid;     
        pdfGridRow5.cells.getCell(1).value="Supported for fixed width";          
        pdfGridRow5.cells.getCell(2).value="second row";
        //Drawing a grid
        parentGrid.draw(page,0,0);        
        //Save the document
       
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridCellPadding12.pdf');
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
    });
});

describe('Manual testing',()=>{
    it('-Cell Padding13', (done) => {
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
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding13.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding14', (done) => {
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
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);        
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
        parentGrid.style.cellPadding.all = 20;        
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,10));        
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding14.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding15', (done) => {
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
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 14);        
         parentGrid.style.textPen = new PdfPen(new PdfColor(255, 127, 80));
         parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(70, 130, 180));
         parentGrid.style.font = font;
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
        parentGrid.style.cellPadding.top = 20;
        parentGrid.style.cellPadding.right = 30;
        // drawing a grid
        parentGrid.draw(page1, new PointF(10,10));        
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding15.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding16', (done) => {
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
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(30,20,10,20);
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(118,209,208));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding16.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding17', (done) => {
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
        pdfGridRow1.cells.getCell(1).style.cellPadding = new PdfPaddings(0,20,0,20);
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(118,209,208));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding17.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding18', (done) => {
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
        childPdfGrid.style.cellPadding.all=10;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding18.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding19', (done) => {
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
        childPdfGrid.style.cellPadding.right=10;
        childPdfGrid.style.cellPadding.bottom =20;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding19.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding20', (done) => {
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
        childPdfGrid.style.cellPadding.right=10;
        childPdfGrid.style.cellPadding.bottom =20;
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding20.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding21', (done) => {
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
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding21.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding22', (done) => {
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
        childPdfGrid.style.cellPadding.bottom =20;    
        parentGrid.style.cellPadding.right=10;
        parentGrid.style.cellPadding.top=20;
        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding22.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding23', (done) => {
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
        childpdfGridRow1.cells.getCell(2).style.cellPadding = new PdfPaddings(10,20,5,0);    
        parentGrid.style.cellPadding.right=10;
        parentGrid.style.cellPadding.top=0;
        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding23.pdf');
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
describe('Manual testing',()=>{
    it('-Cell Padding24', (done) => {
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
        childPdfGrid.style.cellPadding.all = 0;    
        parentGrid.style.cellPadding.right=0;
        parentGrid.style.cellPadding.top=0;
        
        childPdfGrid.style.textPen = new PdfPen(new PdfColor(238, 243, 35));        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
      
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GridcellPadding24.pdf');
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
describe('Manual testing',()=>{
    it('-CreatePdf2 method calling', (done) => {
        let document1 : PdfDocument = new PdfDocument();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20, PdfFontStyle.Strikeout);
        for (let i : number = 0; i < 4; i++) {
            if (i == 0) {
                document1.pageSettings.size = PdfPageSize.a1;
                document1.pageSettings.orientation = PdfPageOrientation.Portrait;
                document1.pageSettings.rotate = PdfPageRotateAngle.RotateAngle0;
            } else if (i == 1) {
                document1.pageSettings.size = PdfPageSize.a2;
                document1.pageSettings.orientation = PdfPageOrientation.Landscape;
                document1.pageSettings.rotate = PdfPageRotateAngle.RotateAngle90;
            } else if (i == 2) {
                document1.pageSettings.size = PdfPageSize.a3;
                document1.pageSettings.orientation = PdfPageOrientation.Portrait;
                document1.pageSettings.rotate = PdfPageRotateAngle.RotateAngle180;
            } else {
                document1.pageSettings.size = PdfPageSize.a4;
                document1.pageSettings.orientation = PdfPageOrientation.Landscape;
                document1.pageSettings.rotate = PdfPageRotateAngle.RotateAngle0;
            }
            let page2 : PdfPage = document1.pages.add();
            let graphics2 : PdfGraphics = page2.graphics;
            graphics2.drawString("Testing :" + i, font, null, new PdfSolidBrush(new PdfColor(189, 183, 107)), 10, 20, null);
        }
        document1.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output2.pdf');
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
        //Dispose the document.
        document1.destroy();
    })
})

describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf3 method calling', (done) => {
        //Create a new document.
        let document : PdfDocument = new PdfDocument();
        document.pages.add();
        document.pages.add();
        document.pages.add();
        document.pages.add();
        //Create a new font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 128, 0));
        //Initialize an istanceof the new page number field with font.
        let pageNumber : PdfPageNumberField = new PdfPageNumberField(font, brush);
        //Page count field.
        let pageCount : PdfPageCountField = new PdfPageCountField(font);
        //Set number style as numeric for page number field.
        pageNumber.numberStyle = PdfNumberStyle.Numeric;
        let compositeField : PdfCompositeField = new PdfCompositeField(font, brush, "Page {0} of {1}", pageNumber, pageCount);
        compositeField.bounds = new RectangleF(0, 0, 500, 100);
        // Draw page number for each page in the pages array.
        for (let i : number = 0; i < document.pages.count; i++) {
            compositeField.draw(document.pages.getPageByIndex(i).graphics, new PointF(10, 20));
        }
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output3.pdf');
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
        //Dispose the document.
        document.destroy();
    })
})
describe('Main.ts -> Constructor initializing',()=>{
    it('-t1.CreatePdf4();)', (done) => {
        let document : PdfDocument = new PdfDocument();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let pageNumber : PdfPageNumberField = new PdfPageNumberField(font, new PdfSolidBrush(new PdfColor(127, 255, 212)));
        pageNumber.numberStyle = PdfNumberStyle.LowerLatin;
        for (let i : number = 0; i < 2; i++) {
            let page : PdfPage = document.pages.add();
            if (i == 0) {
                page.section.pageSettings.origin = new PointF(-10, -10);
            }
            pageNumber.draw(page.graphics);
        }
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output4.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf5 method calling', (done) => {
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
        //Add two columns
        pdfGrid.size.width =30;
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
        //document.save("output3.pdf");
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output5.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf6 method calling', (done) => {
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        let page3 : PdfPage = document.pages.add();
        let page4 : PdfPage = document.pages.add();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 7);
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 128, 0));
        let logo : string = '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABiAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8aQ+R+GKVjkAUwDFOPyNX60fmrJU5FPVcN+FV/PFOSUr1zTuTyjmXAP1zSE5r+nf4Q/8ABIv9nzxh8LPCl/J8L/AMNzf6PZzTvNocMokkaFCzE8HJJJ/wrrx/wRU+BMf+q+FPwqk4zi40WOLP4hGH61+VYfxNeKjKWFwU5qLs7Tpp/c5Jn2c+D3Tt7SvFXXaX6I/lYQbR+NP3gV/VRJ/wRn+CtiMt8A/hxcrjOYtJtG/Q4P6V+HH/AAUs/wCCN3xv+Bnxl+KfjXTfhBqmkfCSx1bUNTsLyyeCS0sNMErujFEkLxIseOGUYHGK+g4c4xeZ15UK2FnQ5Ve8+Wz1tZNN6nm5pw/LCU1UhUVS/wDLfTzdz4fbG2on6U0z5XvTC+RX2bkjwFFht96QgfWmlsUBs1kaakp4pZDkUmcmkduMVVyRoOKeDkd/xqOlzilcD+wz4BNj4D+C/wDsBWP/AKTpXqPh29ea1WJoJUVI1ZZTgpJkkYHOcjHcdCPfHlPwHkx8B/Bf/YCsf/SdK76w8MahJEl9p2uXdq8qrm2njW4tCRkfcOHXPGdrqOOnJz/KHAs75rXX91/+lI/bc3jbCwfmvyOv0+Zre6iCMVDSKCAeDk88V4l/wWD/AOUWfx//AOxG1T/0nevRrqfWrzZYzpLp7SPGy6np0kbiMiRDgpKpI3DI+6wxnkHFeJf8FcvDXiSz/wCCYnx2dvE8V1Zx+C9TaSGbS08yWP7NLlN6uuDymG28bOQc1+wYb+NH1X5nytf+HL0Z/I8eKYz/ADU9ulRY+av04+AFzmgcGjOKQHNAFgYFI5yaQEEUGmyLMGXbSU4/OfwprNtNSFmf2AfAmX/ixHgv/sBWP/pOlel6V4pbRLFI73T76G2jjVhdqgkhKkE5IUllx3yuOQc9cfAX/BI7/grX8Pf25vhTo3hKOVPDPxE8OabFa3egXcwLXqQxhTcWr8eahC5Zcb05yMYdvp/4I/trfCX43eMtV8MeDfijpX/CW6DfTaVqOhXFypuIbmGR4pAIJCHx5gOChwcCv5b4MyrFYPOsXSxcHGcVs+zlv6O2j2P2jM8ZRrYKjOjJNP8ARbHtOqeK7SbRJrm0ngu/slzHFKI5ATG4lUFW9CPQ814x/wAFcPFkd9/wSz+PMflyK0ngXUwOQR/x7tW98fvHmh/B/wCHd34x8ZpoGhaRpPkGTxAL1YbW3R5441EjPt2qxcDklc45zivAf+Civ7Wfwz+M3/BMf43ReE/HXhjxHJP4H1IINO1CO53H7M3AKEiv1rCwk6kZJaXR8viJxUJJvWzP5b15WjZRGcrS1+lnwD3GNFk/hQsZAp9BOKCiPdil3ZppXdQPlOKAHq2DSE5NJXR/CD4S+Ifj38VPD/gnwlp39reJ/FN9Fpul2X2iK3+1XEh2onmSssa5PdmAHc0A2krsyPCnizU/AviSx1nRdQvdJ1bTJ1ubS9tJmhntpVOVdHUgqwPQg1N4l8eax4t8eah4o1DULifX9Vv5NTur4NslkuZJDI8uVxhi5LcYwTxXZ/Gb9lHxX8BNE+3+IL/4czoLv7C9vofxE8Pa/eRS4YkPbWF7PMijYwLsgVTgEgsAfNWGRXJB0KsvbU7N7XXbe1/xOqcKtNezmmvJ/cfRGo/8FUPjz4j/AGYNe+D2vfEHVfE/gHxFBDBPY61tvpoFinjnj8q4kBmTDxL8u/bjI218+k5pg+alHynFb06cIfArXMalSUn7zuSJ0paarbVpwORWhi9wpGbFLSMuTQMg3ZNKDtNAiwaXZxU6mlkL5lfRf/BINs/8FUP2fP8AsetM/wDRwr5xNdl+zt8d9a/Zf+PPg/4jeHLbS7zXvBGrQaxYQalHJJaSzQtuVZVjdHKE9QrqfcUPYicOaDiuqf5Hp3/Cr/gr4o/az8MaN4a8V/EPxhJr/wAQ7fTda0/X/B1toFsLWa+EcwjubbVruR2+baP3cZwS25SAp+gvDfwj+A3jD/goD+0d4Gk+DMVj8PvgX4Z8b39hDaeKNUGr6xPprj7O89xJcPEuxkcRiOAAI4EouHXzG+X9Z/bA06XxRpfiDQPgb8JfBnibSdftvEUeqaTe+JJ5JZ4ZxP5bx3mr3EPlu4G4CMNj7rLVXw/+2r408PfG34wfECDTvDDa78a9N13S9che3nNpaxauzNcm2UTB0Zdx8su7gfxB6+RjgsbDCU6NO6lGnUXZc7hBQ9UmpWvqtz6qeLwk8XUrVLNSqU358inJzv5tON7b7Ho/hLTvh7oP7HetftFa38KPDOr3PiTxuvgPw14Fh1bWLfw3orQ2EV3dXs7/AG06jOzK6LHGL1FVnlZiyhIx7N+zH+yN8H/2m/j5+yb4uk8Dy+HvBfxp1fXfDvizwXbatfvZW95pFqjvNYXMsrXawTrNFJskuJGSRZF3lMKPkb4C/tS658CvhlrvgW78M+DPiJ8PvEtxDqF74Z8U29y1pFfw8RX1vPaT293bXCoXjLQzoHjdlkVxgDr9B/4KMeP/AAp+0V8NviDo2heCNEtPg9by2vg7wfZ2t0PD2jpMki3B2NcNcyyzPI0kk01w8rvt3OVRFXpq4fGqf7u+8ba6JKCUk+7crtb73umrHFGvhHT9617Svpq22+Vp9Ely3/wtfabPKPij4/0H4keKjd+GfBWmeBNGtI/scFjaX95fSXKo7bbi5luZpN1yylQ5hWGElMpDHkisGM4GKg0yzNpbENjczFzjpk1ZxzXvYOE4UYxqb219TzMZOnOvOVJWi27enQUjbSUZorpOJ7jEwwpdo9ahHJxR3pXNHFjzHg9aQxZpU6Ub6YXaGldlLGeaRjk06JctQNktLSZxSFwDQZWFZtppA+aRzk0gODQWPopN9KDmgl7lZPvj6Up/1lFFZmw9Pu0yiirIe4VJBRRTCWwk/wB/8KZRRQIkooooAKenSiigD//Z';
        let image : PdfBitmap = new PdfBitmap(logo);
        //Create a header and draw the image.
        let bounds1 : RectangleF = new RectangleF(0, 0, document.pages.getPageByIndex(0).getClientSize().width, 100);
        let header : PdfPageTemplateElement = new PdfPageTemplateElement(bounds1);
        //Draw the image in the header.
        header.graphics.drawImage(image, 0, 0, header.width, header.height);
        //Add the header at the top.
        document.template.top = header;
        page1.graphics.drawString('Hello world', font, null, brush, 10, 10, null);

        //Create a Page template that can be used as footer.
        // let bounds2 : RectangleF = new RectangleF({ x : 0, y : document.pages.getPageByIndex(0).getClientSize().height - 100}, {width : document.pages.getPageByIndex(0).getClientSize().width, height : 90});
        let footer : PdfPageTemplateElement = new PdfPageTemplateElement(bounds1);
        //Initialize an istanceof the new page number field with font.
        let pageNumber : PdfPageNumberField = new PdfPageNumberField(font, brush);
        //Page count field.
        let pageCount : PdfPageCountField = new PdfPageCountField(font);
        //Set number style as numeric for page number field.
        pageNumber.numberStyle = PdfNumberStyle.Numeric;
        let compositeField : PdfCompositeField = new PdfCompositeField(font, brush, "Page {0} of {1}", pageNumber, pageCount);
        compositeField.bounds = footer.bounds;
        compositeField.draw(footer.graphics, new PointF(470, 40));
        //Add the footer template at the bottom.
        document.template.bottom = footer;

        //save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output6.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf7 method calling', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        //save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output7.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf8 method calling', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let address1 : string = 'Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.';
        let address2 : string = 'Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.';
        let address3 : string = 'Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.';
        let address4 : string = 'Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.';
        let address5 : string = 'Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.';
        let element : PdfTextElement = new PdfTextElement(address1);
        element.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        element.brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Draw the text element.
        let clientSize : SizeF = page.graphics.clientSize;
        let result : PdfLayoutResult = element.drawText(page, 20, clientSize.height - 30);
        element = new PdfTextElement(address2);
        element.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        element.brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Draw the text element.
        clientSize = result.page.graphics.clientSize;
        result = element.drawText(result.page, new RectangleF(20, clientSize.height - 30, 300, 100));
        element = new PdfTextElement(address3);
        element.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        element.brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Draw the text element.
        clientSize = result.page.graphics.clientSize;
        result = element.drawText(result.page, new PointF(20, clientSize.height - 30));
        element = new PdfTextElement(address4);
        element.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        element.brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Draw the text element.
        clientSize = result.page.graphics.clientSize;
        result = element.drawText(result.page, new RectangleF(20, clientSize.height - 50, 300, 100));
        element = new PdfTextElement(address5);
        element.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        element.brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Draw the text element.
        clientSize = result.page.graphics.clientSize;
        result = element.drawText(result.page, new PointF(20, clientSize.height - 50));
        //save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output8.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf9 method calling', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page5 : PdfPage = document.pages.add();
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        textLink.url = "http://www.syncfusion.com";
        textLink.text = "Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.";
        textLink.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let result : PdfLayoutResult = textLink.draw(page5, new PointF(100, page5.graphics.clientSize.height - 30));
        let textLink2 : PdfTextWebLink = new PdfTextWebLink();
        textLink2.url = "http://www.syncfusion.com";
        textLink2.text = "Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.";
        textLink2.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        result = textLink2.draw(result.page, new RectangleF(50, result.page.graphics.clientSize.height - 30, 300, 100));
        let textLink3 : PdfTextWebLink = new PdfTextWebLink();
        textLink3.url = "http://www.syncfusion.com";
        textLink3.text = "Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States. Northwind Traders 67, rue des Cinquante Otages, Elgin, Unites States.";
        textLink3.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        result = textLink3.draw(result.page, new RectangleF(50, result.page.graphics.clientSize.height, 300, 100));
        //save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output9.pdf');
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
describe('Main.ts -> Constructor initializing',()=>{
    it('-CreatePdf11 method calling', (done) => {
        let document : PdfDocument = new PdfDocument();
        let style1 : PdfFontStyle = PdfFontStyle.Bold | PdfFontStyle.Italic | PdfFontStyle.Strikeout | PdfFontStyle.Underline;
        let font1 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10, style1);
        let titleBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(400, 0, 0));
        let format1 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Left);
        let format2 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        let format3 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let format4 : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        let page3 : PdfPage = document.pages.add();
        let page4 : PdfPage = document.pages.add();
        let page5 : PdfPage = document.pages.add();
        let page6 : PdfPage = document.pages.add();
        let page7 : PdfPage = document.pages.add();
        let page8 : PdfPage = document.pages.add();
        page1.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, format1);
        page2.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, format2);
        page3.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, format3);
        page4.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, format4);
        page5.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, 350, 40, format1);
        page6.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, 350, 40, format2);
        page7.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, 350, 40, format3);
        page8.graphics.drawString('Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.', font1, null, titleBrush, 100, 690, 350, 40, format4);
        //save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Output10.pdf');
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
describe('PdfDocument.save() method testing', () => {
    let streamWriter: StreamWriter;
    let fileReader: FileReader;
    let text: string;
    fileReader = new FileReader();
    fileReader.onload = (): void => {
        text = fileReader.result as string;
    }
    let document : PdfDocument = new PdfDocument();
    let page : PdfPage = document.pages.add();
    it ('empty page creation - testing', (done) => {
        document.save().then((pdfBlob: {blobData: Blob}) => {
            fileReader.readAsText(pdfBlob.blobData);
            setTimeout(function (): void {
                text = fileReader.result as string;
                expect(text.length).toEqual(516);
                done();
            }, 50);
        });
    });
});
describe('Manual testing',()=>{
    it('-RepeatHeader1', (done) => {
        let document : PdfDocument = new PdfDocument();
        let layoutPage : PdfPage = document.pages.add();
        let layoutGrid : PdfGrid = new PdfGrid();
        layoutGrid.repeatHeader = true;
        layoutGrid.columns.add(3);          
        //Add header.
        layoutGrid.headers.add(1);
    
        let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
        pdfGridHeader3.cells.getCell(0).value = 'ID';
        pdfGridHeader3.cells.getCell(1).value = 'Company name';
        pdfGridHeader3.cells.getCell(2).value = 'Salary';
        for (let i : number = 0; i < 200; i++) {
            let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = 'E-'+i;
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
            pdfGridRow1.cells.getCell(2).value = '$'+i+',000';
        }
        layoutGrid.draw(layoutPage, new PointF(10, 20));
        //document.save('RepeatHeader1.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader1.pdf');
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
    });    
});

describe('Manual testing',()=>{
    it('RepeatHeader2', (done) => {
        let document : PdfDocument = new PdfDocument();
        let layoutPage : PdfPage = document.pages.add();
        let layoutGrid : PdfGrid = new PdfGrid();
        layoutGrid.repeatHeader = true;
        layoutGrid.columns.add(3);
        //Add header.
        layoutGrid.headers.add(1);
        
        let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
        pdfGridHeader3.cells.getCell(0).value = 'ID';
        pdfGridHeader3.cells.getCell(1).value = 'Company name';
        pdfGridHeader3.cells.getCell(2).value = 'Salary';
        for (let i : number = 0; i < 200; i++) {
            let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = "image";
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
            pdfGridRow1.cells.getCell(2).value = '$15,000';
        }
        layoutGrid.style.backgroundBrush=new PdfSolidBrush(new PdfColor(40, 150, 30));        
        layoutGrid.draw(layoutPage, new PointF(10, 20));
        //document.save('RepeatHeader2.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader2.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('RepeatHeader3', (done) => {
        let document : PdfDocument = new PdfDocument();
        let layoutPage : PdfPage = document.pages.add();
        let layoutGrid : PdfGrid = new PdfGrid();
        layoutGrid.repeatHeader = true;
        layoutGrid.columns.add(3);
        let childgrid : PdfGrid = new PdfGrid();
        childgrid.columns.add(3);
        //layoutGrid.columns.getColumn(1).width=70;
        //Add header.
        layoutGrid.headers.add(1);  
        let parentGridRow1 : PdfGridRow = layoutGrid.rows.addRow();   
        let parentGridRow2 : PdfGridRow = layoutGrid.rows.addRow();       
        let parentGridRow3 : PdfGridRow = layoutGrid.rows.addRow(); 
        let parentGridRow4 : PdfGridRow = layoutGrid.rows.addRow(); 

        let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
        pdfGridHeader3.cells.getCell(0).value = 'ID';
        pdfGridHeader3.cells.getCell(1).value = 'Company name';
        pdfGridHeader3.cells.getCell(2).value = 'Salary';
        for (let i : number = 0; i < 30; i++) {
            let pdfGridRow1 : PdfGridRow = childgrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = "EJ-"+i;
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion';
            pdfGridRow1.cells.getCell(2).value = '$'+i+',000';
        }
        parentGridRow1.cells.getCell(0).value = childgrid;        
        parentGridRow2.cells.getCell(1).value =childgrid;        
        parentGridRow3.cells.getCell(2).value =childgrid;
        parentGridRow4.cells.getCell(1).value =childgrid;
        layoutGrid.draw(layoutPage, new PointF(10, 20));
        //document.save('RepeatHeader3.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader3.pdf');
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
    });
});
describe('Manual testing',()=>{
    it('RepeatHeader4', (done) => {
        let document : PdfDocument = new PdfDocument();
        let layoutPage : PdfPage = document.pages.add();
        let layoutGrid : PdfGrid = new PdfGrid();
        //layoutGrid.repeatHeader = true;
        layoutGrid.columns.add(3);
        //Add header.
        layoutGrid.headers.add(1);    
                  
        let pdfGridHeader3 : PdfGridRow = layoutGrid.headers.getHeader(0);
        pdfGridHeader3.cells.getCell(0).value = 'ID';
        pdfGridHeader3.cells.getCell(1).value = 'Company name';
        pdfGridHeader3.cells.getCell(2).value = 'Salary';
        
        for (let i : number = 0; i < 200; i++) {
            let pdfGridRow1 : PdfGridRow = layoutGrid.rows.addRow();
            pdfGridRow1.cells.getCell(0).value = "EJ-"+i;
            pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
            pdfGridRow1.cells.getCell(2).value = '$'+i+',000';
        }

        //layoutGrid.style.textPen=new PdfPen(new PdfColor(40, 150, 30));        
        layoutGrid.draw(layoutPage, new PointF(10, 20));
        //document.save('RepeatHeader4.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader4.pdf');
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
    });
});
describe('Manual Testing',()=>{
    it('RepeatHeader5', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
        parentGrid.allowRowBreakAcrossPages = true;
        parentGrid.repeatHeader = true;
        parentGrid.headers.add(1);
        let pdfGridHeader3 : PdfGridRow = parentGrid.headers.getHeader(0);
        pdfGridHeader3.cells.getCell(0).value = 'Value 1';
        pdfGridHeader3.cells.getCell(1).value = 'Value 2';
        pdfGridHeader3.cells.getCell(2).value = 'Value 3';      
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
        pdfGridRow8.cells.getCell(0).value = childPdfGrid1;
        pdfGridRow8.cells.getCell(1).value = "the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDF the Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDFComplete all the pending works in nested grid for PDFthe Cell value is Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF Complete all the pending works in nested grid for PDF";
        pdfGridRow9.cells.getCell(2).value = childPdfGrid;
        pdfGridRow10.cells.getCell(1).value = childPdfGrid1;
        pdfGridRow11.cells.getCell(0).value = childPdfGrid;
        pdfGridRow11.cells.getCell(2).value = childPdfGrid1;

        let layoutFormat : PdfGridLayoutFormat  = new PdfGridLayoutFormat();

        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.break = PdfLayoutBreakType.FitPage;

        // drawing a grid           
        parentGrid.draw(page1, new PointF(0,0),layoutFormat);        
        //document.save('RepeatHeader5.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader5.pdf');
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
describe('Manual Testing',()=>{
    it('RepeatHeader6', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
         parentGrid.allowRowBreakAcrossPages = true;
        // parentGrid.repeatHeader = true;
        // parentGrid.headers.add(1);
        // let pdfGridHeader3 : PdfGridRow = parentGrid.headers.getHeader(0);
        // pdfGridHeader3.cells.getCell(0).value = 'Value 1';
        // pdfGridHeader3.cells.getCell(1).value = 'Value 2';
        // pdfGridHeader3.cells.getCell(2).value = 'Value 3';  
      
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
        // childPdfGrid1.allowRowBreakAcrossPages = true;
        // childPdfGrid1.repeatHeader = true;
        // childPdfGrid1.headers.add(1);
        // let pdfchildGridHeader3 : PdfGridRow = childPdfGrid1.headers.getHeader(0);
        // pdfchildGridHeader3.cells.getCell(0).value = 'child 1';
        // pdfchildGridHeader3.cells.getCell(1).value = 'child 2';
        // pdfchildGridHeader3.cells.getCell(2).value = 'child 3';               
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
        //document.save('RepeatHeader6.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader6.pdf');
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

describe('Manual Testing',()=>{
    it('RepeatHeader7', (done) => {
         let document : PdfDocument = new PdfDocument();
        // add a page
        let page1 : PdfPage = document.pages.add();
        // create a PdfGrid
        let parentGrid : PdfGrid = new PdfGrid();        
        
        //add column        
        parentGrid.columns.add(3);
       
        parentGrid.allowRowBreakAcrossPages = true;
        
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
        childPdfGrid1.allowRowBreakAcrossPages = true;
        childPdfGrid1.repeatHeader = true;
        childPdfGrid1.headers.add(1);
        let pdfchildGridHeader3 : PdfGridRow = childPdfGrid1.headers.getHeader(0);
        pdfchildGridHeader3.cells.getCell(0).value = 'child 1';
        pdfchildGridHeader3.cells.getCell(1).value = 'child 2';
        pdfchildGridHeader3.cells.getCell(2).value = 'child 3';               
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

        parentGrid.style.textBrush = new PdfSolidBrush(new PdfColor(90, 50, 30));//---- brown
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
        //document.save('RepeatHeader7.pdf');  
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RepeatHeader7.pdf');
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
describe('Manual testing',()=>{
    it('paragraph indent', (done) => {
        let document : PdfDocument = new PdfDocument();
       
        let page1 : PdfPage = document.pages.add();
       
        let parentGrid : PdfGrid = new PdfGrid();
     
        parentGrid.columns.add(3);
    
        let pdfGridRow1 : PdfGridRow = parentGrid.rows.addRow();                 
        let pdfGridRow2 : PdfGridRow = parentGrid.rows.addRow();                         
        // let format : PdfStringFormat =new PdfStringFormat();
        // //format.alignment = PdfTextAlignment.Left;
        // //format.textDirection = PdfTextDirection.RightToLeft;
        // //format.rightToLeft = false;       
        // format.paragraphIndent = 100;
        pdfGridRow1.cells.getCell(0).value="nested grid";    
        pdfGridRow1.cells.getCell(1).value="second";     
        //pdfGridRow1.cells.getCell(1).stringFormat = format;
        pdfGridRow1.cells.getCell(0).style.stringFormat = new PdfStringFormat();
        pdfGridRow1.cells.getCell(0).style.stringFormat.paragraphIndent = 80;  
        pdfGridRow1.cells.getCell(2).value="third";     

        pdfGridRow2.cells.getCell(0).value="four";
       // pdfGridRow2.cells.getCell(0).style.stringFormat.paragraphIndent = 100;     
        pdfGridRow2.cells.getCell(1).value="five";     
        //pdfGridRow2.cells.getCell(1).stringFormat.paragraphIndent = 50;
        pdfGridRow2.cells.getCell(0).style.stringFormat = new PdfStringFormat();
        pdfGridRow2.cells.getCell(0).style.stringFormat.paragraphIndent = 40;   
        pdfGridRow2.cells.getCell(2).value="six";                          
        
        // drawing a grid
        parentGrid.draw(page1, new PointF(0,0));        
        //document.save('output13.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'output13.pdf');
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

