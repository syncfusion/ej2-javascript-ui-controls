import { PdfDocument, PdfPage, PdfGrid, PdfPen } from './../../../src/index';
import { PdfGridRow, PointF, PdfGridCellStyle } from './../../../src/index';
import { PdfColor, PdfSolidBrush, PdfGridCell, PdfBitmap } from './../../../src/index';
import { PdfGridRowStyle, PdfStandardFont, PdfFontFamily } from './../../../src/index';
import { PdfStringFormat, PdfTextAlignment, PdfGridLayoutResult } from './../../../src/index';
import { PdfFont, PdfPageTemplateElement, PdfLayoutResult, PdfGridLayoutFormat } from './../../../src/index';
import { PdfFontStyle, PdfHorizontalOverflowType, PdfTextWebLink, PdfGridStyle } from './../../../src/index';
import { PdfPaddings, PdfBorders, RectangleF, PdfLayoutType, PdfLayoutBreakType, PdfVerticalAlignment } from './../../../src/index';
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
    });

    it('EJ2_51070_Coverage - 1', (done) => {
        //Create a new PDF document
        let pdfDocument: PdfDocument = new PdfDocument();
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let pdfGrid: PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(5);
        // add header
        pdfGrid.headers.add(1);
        //Set values to the grid
        let pdfGridHeader: PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "Material";
        pdfGridHeader.cells.getCell(1).value = "Batch No";
        pdfGridHeader.cells.getCell(2).value = "Manufactured Product";
        pdfGridHeader.cells.getCell(3).value = "Ordered Quantity";
        pdfGridHeader.cells.getCell(4).value = "UoM";
        let row1: PdfGridRow = pdfGrid.rows.addRow();
        let logo: string = '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABiAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8aQ+R+GKVjkAUwDFOPyNX60fmrJU5FPVcN+FV/PFOSUr1zTuTyjmXAP1zSE5r+nf4Q/8ABIv9nzxh8LPCl/J8L/AMNzf6PZzTvNocMokkaFCzE8HJJJ/wrrx/wRU+BMf+q+FPwqk4zi40WOLP4hGH61+VYfxNeKjKWFwU5qLs7Tpp/c5Jn2c+D3Tt7SvFXXaX6I/lYQbR+NP3gV/VRJ/wRn+CtiMt8A/hxcrjOYtJtG/Q4P6V+HH/AAUs/wCCN3xv+Bnxl+KfjXTfhBqmkfCSx1bUNTsLyyeCS0sNMErujFEkLxIseOGUYHGK+g4c4xeZ15UK2FnQ5Ve8+Wz1tZNN6nm5pw/LCU1UhUVS/wDLfTzdz4fbG2on6U0z5XvTC+RX2bkjwFFht96QgfWmlsUBs1kaakp4pZDkUmcmkduMVVyRoOKeDkd/xqOlzilcD+wz4BNj4D+C/wDsBWP/AKTpXqPh29ea1WJoJUVI1ZZTgpJkkYHOcjHcdCPfHlPwHkx8B/Bf/YCsf/SdK76w8MahJEl9p2uXdq8qrm2njW4tCRkfcOHXPGdrqOOnJz/KHAs75rXX91/+lI/bc3jbCwfmvyOv0+Zre6iCMVDSKCAeDk88V4l/wWD/AOUWfx//AOxG1T/0nevRrqfWrzZYzpLp7SPGy6np0kbiMiRDgpKpI3DI+6wxnkHFeJf8FcvDXiSz/wCCYnx2dvE8V1Zx+C9TaSGbS08yWP7NLlN6uuDymG28bOQc1+wYb+NH1X5nytf+HL0Z/I8eKYz/ADU9ulRY+av04+AFzmgcGjOKQHNAFgYFI5yaQEEUGmyLMGXbSU4/OfwprNtNSFmf2AfAmX/ixHgv/sBWP/pOlel6V4pbRLFI73T76G2jjVhdqgkhKkE5IUllx3yuOQc9cfAX/BI7/grX8Pf25vhTo3hKOVPDPxE8OabFa3egXcwLXqQxhTcWr8eahC5Zcb05yMYdvp/4I/trfCX43eMtV8MeDfijpX/CW6DfTaVqOhXFypuIbmGR4pAIJCHx5gOChwcCv5b4MyrFYPOsXSxcHGcVs+zlv6O2j2P2jM8ZRrYKjOjJNP8ARbHtOqeK7SbRJrm0ngu/slzHFKI5ATG4lUFW9CPQ814x/wAFcPFkd9/wSz+PMflyK0ngXUwOQR/x7tW98fvHmh/B/wCHd34x8ZpoGhaRpPkGTxAL1YbW3R5441EjPt2qxcDklc45zivAf+Civ7Wfwz+M3/BMf43ReE/HXhjxHJP4H1IINO1CO53H7M3AKEiv1rCwk6kZJaXR8viJxUJJvWzP5b15WjZRGcrS1+lnwD3GNFk/hQsZAp9BOKCiPdil3ZppXdQPlOKAHq2DSE5NJXR/CD4S+Ifj38VPD/gnwlp39reJ/FN9Fpul2X2iK3+1XEh2onmSssa5PdmAHc0A2krsyPCnizU/AviSx1nRdQvdJ1bTJ1ubS9tJmhntpVOVdHUgqwPQg1N4l8eax4t8eah4o1DULifX9Vv5NTur4NslkuZJDI8uVxhi5LcYwTxXZ/Gb9lHxX8BNE+3+IL/4czoLv7C9vofxE8Pa/eRS4YkPbWF7PMijYwLsgVTgEgsAfNWGRXJB0KsvbU7N7XXbe1/xOqcKtNezmmvJ/cfRGo/8FUPjz4j/AGYNe+D2vfEHVfE/gHxFBDBPY61tvpoFinjnj8q4kBmTDxL8u/bjI218+k5pg+alHynFb06cIfArXMalSUn7zuSJ0paarbVpwORWhi9wpGbFLSMuTQMg3ZNKDtNAiwaXZxU6mlkL5lfRf/BINs/8FUP2fP8AsetM/wDRwr5xNdl+zt8d9a/Zf+PPg/4jeHLbS7zXvBGrQaxYQalHJJaSzQtuVZVjdHKE9QrqfcUPYicOaDiuqf5Hp3/Cr/gr4o/az8MaN4a8V/EPxhJr/wAQ7fTda0/X/B1toFsLWa+EcwjubbVruR2+baP3cZwS25SAp+gvDfwj+A3jD/goD+0d4Gk+DMVj8PvgX4Z8b39hDaeKNUGr6xPprj7O89xJcPEuxkcRiOAAI4EouHXzG+X9Z/bA06XxRpfiDQPgb8JfBnibSdftvEUeqaTe+JJ5JZ4ZxP5bx3mr3EPlu4G4CMNj7rLVXw/+2r408PfG34wfECDTvDDa78a9N13S9che3nNpaxauzNcm2UTB0Zdx8su7gfxB6+RjgsbDCU6NO6lGnUXZc7hBQ9UmpWvqtz6qeLwk8XUrVLNSqU358inJzv5tON7b7Ho/hLTvh7oP7HetftFa38KPDOr3PiTxuvgPw14Fh1bWLfw3orQ2EV3dXs7/AG06jOzK6LHGL1FVnlZiyhIx7N+zH+yN8H/2m/j5+yb4uk8Dy+HvBfxp1fXfDvizwXbatfvZW95pFqjvNYXMsrXawTrNFJskuJGSRZF3lMKPkb4C/tS658CvhlrvgW78M+DPiJ8PvEtxDqF74Z8U29y1pFfw8RX1vPaT293bXCoXjLQzoHjdlkVxgDr9B/4KMeP/AAp+0V8NviDo2heCNEtPg9by2vg7wfZ2t0PD2jpMki3B2NcNcyyzPI0kk01w8rvt3OVRFXpq4fGqf7u+8ba6JKCUk+7crtb73umrHFGvhHT9617Svpq22+Vp9Ely3/wtfabPKPij4/0H4keKjd+GfBWmeBNGtI/scFjaX95fSXKo7bbi5luZpN1yylQ5hWGElMpDHkisGM4GKg0yzNpbENjczFzjpk1ZxzXvYOE4UYxqb219TzMZOnOvOVJWi27enQUjbSUZorpOJ7jEwwpdo9ahHJxR3pXNHFjzHg9aQxZpU6Ub6YXaGldlLGeaRjk06JctQNktLSZxSFwDQZWFZtppA+aRzk0gODQWPopN9KDmgl7lZPvj6Up/1lFFZmw9Pu0yiirIe4VJBRRTCWwk/wB/8KZRRQIkooooAKenSiigD//Z';
        let image: PdfBitmap = new PdfBitmap(logo);
        row1.style = new PdfGridRowStyle();
        row1.style.setBackgroundImage(image);
        row1.cells.getCell(0).drawCellBackground(page.graphics, new RectangleF(0, 0, 200, 100));
        row1.cells.getCell(0).value = "Material";
        row1.cells.getCell(1).value = "Batch No";
        row1.cells.getCell(2).value = "Manufactured Product";
        row1.cells.getCell(3).value = "Ordered Quantity";
        row1.cells.getCell(4).value = "UoM";
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51070_Coverage_1.pdf');
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
        pdfDocument.destroy();
    });
    it('EJ2_51070_Coverage - 2', (done) => {
        //Create a new PDF document
        let pdfDocument: PdfDocument = new PdfDocument();
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let pdfGrid: PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(5);
        // add header
        pdfGrid.headers.add(1);
        //Set values to the grid
        let pdfGridHeader: PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "Material";
        pdfGridHeader.cells.getCell(1).value = "Batch No";
        pdfGridHeader.cells.getCell(2).value = "Manufactured Product";
        pdfGridHeader.cells.getCell(3).value = "Ordered Quantity";
        pdfGridHeader.cells.getCell(4).value = "UoM";
        let row1: PdfGridRow = pdfGrid.rows.addRow();
        let logo: string = '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';
        let image: PdfBitmap = new PdfBitmap(logo);
        pdfGrid.style = new PdfGridStyle();
        pdfGrid.style.backgroundImage = image;
        row1.cells.getCell(0).drawCellBackground(page.graphics, new RectangleF(0, 0, 200, 100));
        row1.cells.getCell(0).value = "Material";
        row1.cells.getCell(1).value = "Batch No";
        row1.cells.getCell(2).value = "Manufactured Product";
        row1.cells.getCell(3).value = "Ordered Quantity";
        row1.cells.getCell(4).value = "UoM";
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51070_Coverage_2.pdf');
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
        pdfDocument.destroy();
    });

    it('EJ2_51070_Coverage - 3', (done) => {
        //Create a new PDF document
        let pdfDocument: PdfDocument = new PdfDocument();
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let pdfGrid: PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(5);
        // add header
        pdfGrid.headers.add(1);
        //Set values to the grid
        let pdfGridHeader: PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "Material";
        pdfGridHeader.cells.getCell(1).value = "Batch No";
        pdfGridHeader.cells.getCell(2).value = "Manufactured Product";
        pdfGridHeader.cells.getCell(3).value = "Ordered Quantity";
        pdfGridHeader.cells.getCell(4).value = "UoM";
        let row1: PdfGridRow = pdfGrid.rows.addRow();
        row1.cells.getCell(0).value = "Material";
        row1.cells.getCell(1).value = "Batch No";
        row1.cells.getCell(2).value = "Manufactured Product";
        row1.cells.getCell(3).value = "Ordered Quantity";
        let cellStyle: PdfGridCellStyle = new PdfGridCellStyle();
        cellStyle.cellPadding = new PdfPaddings(0, 0, 0, 0);
        row1.cells.getCell(4).style = cellStyle;

        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51070_Coverage_3.pdf');
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
        pdfDocument.destroy();
    });
    it('EJ2_51070_LineBreakIssue', (done) => {
        //Create a new PDF document
        let pdfDocument: PdfDocument = new PdfDocument();
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let pdfGrid: PdfGrid = new PdfGrid();
        // add two columns
        pdfGrid.columns.add(5);
        // add header
        pdfGrid.headers.add(1);
        //Set values to the grid
        let pdfGridHeader: PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = "Material";
        pdfGridHeader.cells.getCell(1).value = "Batch No";
        pdfGridHeader.cells.getCell(2).value = "Manufactured Product";
        pdfGridHeader.cells.getCell(3).value = "Ordered Quantity";
        pdfGridHeader.cells.getCell(4).value = "UoM";
        let row1: PdfGridRow = pdfGrid.rows.addRow();
        row1.cells.getCell(0).value = `import json


          <BLOCKQUOTE>valuePeople_H_S = __People_H_S__</BLOCKQUOTE>
          valueEnvt_Impact = __Envt_Impact__
          valueProduction_Impact = __Production_Impact__
          valueFinancial_Impact = __Financial_Impact__
          valueCompliance_Law_Obligations = __Compliance_Law_Obligations__
          valueReputation = __Reputation__

          def People_H_S():
          if valuePeople_H_S == None: <br>
          varnegative = -100000000 #<- assuming this value will never going to enter as input
          return varnegative
              else:<br>
              value1 =  valuePeople_H_S
              return value1

          def Envt_Impact():
              if valueEnvt_Impact == None: 
                  varnegative = -100000000
                  return varnegative
              else:
                  value2 =  valueEnvt_Impact
                  return value2

          def Production_Impact():
              if valueProduction_Impact == None: 
                  varnegative = -100000000
                  return varnegative
              else:
                  value3 =  valueProduction_Impact
                  return value3

          def Financial_Impact():
              if valueFinancial_Impact == None: 
                  varnegative = -100000000
                  return varnegative
              else:
                  value4 =  valueFinancial_Impact
                  return value4   


          def Compliance_Law_Obligations():
              if valueCompliance_Law_Obligations == None: 
                  varnegative = -100000000
                  return varnegative
              else:
                  value5 =  valueCompliance_Law_Obligations
                  return value5

          def Reputation():

              if valueReputation == None: 
                  varnegative = -100000000
                  return varnegative
              else:
                  value6 =  valueReputation
                  return value6


          def firstcondition():

           if valuePeople_H_S == None and valueEnvt_Impact == None and valueProduction_Impact == None and valueFinancial_Impact == None and valueCompliance_Law_Obligations == None and valueReputation == None:
               varerr = 'ERROR'
               return varerr
           else:
                varmax = max(People_H_S(),Envt_Impact(),
                             Production_Impact(),Financial_Impact(),
                             Compliance_Law_Obligations(),
                             Reputation())
                return varmax

          def finaloutput():

              if firstcondition() == 'ERROR':
                  return 'ERROR'
              else:
                  return firstcondition()

          varans = finaloutput()    
          json.dumps(varans)`;
        // drawing a grid
        pdfGrid.draw(page, new PointF(0, 0));
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51070_LineBreakIssue.pdf');
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
        pdfDocument.destroy();
    });
    it('EJ2_50946_GridIssue', (done) => {
        let pdfDocument: PdfDocument = new PdfDocument();
        pdfDocument.pageSettings.size = { height: 842, width: 595 };
        pdfDocument.pageSettings.orientation = 1;
        let hfont = new PdfStandardFont(2, 13); // font style for headers
        // create black brush
        let brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let bounds = new RectangleF(0, 0, 515, 50);
        let header = new PdfPageTemplateElement(bounds);
        header.graphics.drawString(
            'Header Text',
            hfont,
            null,
            brush,
            0,
            0,
            100,
            50,
            null
        );
        //Add the header at the top.
        pdfDocument.template.top = header;
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let grid: PdfGrid = new PdfGrid();
        grid.columns.add(9);
        grid.headers.add(2);
        let header_0: PdfGridRow = grid.headers.getHeader(0);
        header_0.cells.getCell(0).value = "Order ID";
        header_0.cells.getCell(0).style.font = hfont;
        header_0.cells.getCell(0).rowSpan = 2;
        header_0.cells.getCell(1).value = "Order Details";
        header_0.cells.getCell(1).style.font = hfont;
        header_0.cells.getCell(1).columnSpan = 3;
        header_0.cells.getCell(4).value = "Verified";
        header_0.cells.getCell(4).style.font = hfont;
        header_0.cells.getCell(4).rowSpan = 2;
        header_0.cells.getCell(5).value = "Shipped Details";
        header_0.cells.getCell(5).style.font = hfont;
        header_0.cells.getCell(5).columnSpan = 4;
        let header_1: PdfGridRow = grid.headers.getHeader(1);
        header_1.cells.getCell(1).value = "Customer ID";
        header_1.cells.getCell(1).style.font = hfont;
        header_1.cells.getCell(2).value = "Employee ID";
        header_1.cells.getCell(2).style.font = hfont;
        header_1.cells.getCell(3).value = "Freight";
        header_1.cells.getCell(3).style.font = hfont;
        header_1.cells.getCell(5).value = "ShipName";
        header_1.cells.getCell(5).style.font = hfont;
        header_1.cells.getCell(6).value = "Ship City";
        header_1.cells.getCell(6).style.font = hfont;
        header_1.cells.getCell(7).value = "Ship Country";
        header_1.cells.getCell(7).style.font = hfont;
        header_1.cells.getCell(8).value = "Ship Address";
        header_1.cells.getCell(8).style.font = hfont;
        let row_0: PdfGridRow = grid.rows.addRow();
        row_0.cells.getCell(0).value = "10001";
        row_0.cells.getCell(1).value = "ALFKI";
        row_0.cells.getCell(2).value = "1";
        row_0.cells.getCell(3).value = "2.3";
        row_0.cells.getCell(4).value = "false";
        row_0.cells.getCell(5).value = "Simons bistro";
        row_0.cells.getCell(6).value = "Berlin";
        row_0.cells.getCell(7).value = "Denmark";
        row_0.cells.getCell(8).value = "Kirchgasse 6";
        let row_1: PdfGridRow = grid.rows.addRow();
        row_1.cells.getCell(0).value = "10001";
        row_1.cells.getCell(1).value = "ALFKI";
        row_1.cells.getCell(2).value = "2";
        row_1.cells.getCell(3).value = "3.3";
        row_1.cells.getCell(4).value = "true";
        row_1.cells.getCell(5).value = "Queen Cozinha";
        row_1.cells.getCell(6).value = "Madrid";
        row_1.cells.getCell(7).value = "Brazil";
        row_1.cells.getCell(8).value = "Avda. Azteca 123";
        let row_2: PdfGridRow = grid.rows.addRow();
        row_2.cells.getCell(0).value = "10003";
        row_2.cells.getCell(1).value = "ANTON";
        row_2.cells.getCell(2).value = "3";
        row_2.cells.getCell(3).value = "4.3";
        row_2.cells.getCell(4).value = "true";
        row_2.cells.getCell(5).value = "Frankenversand";
        row_2.cells.getCell(6).value = "Cholchester";
        row_2.cells.getCell(7).value = "Germany";
        row_2.cells.getCell(8).value = "Carrera 52 con Ave. Bolívar #65-98 Llano Largo";
        let row_3: PdfGridRow = grid.rows.addRow();
        row_3.cells.getCell(0).value = "10004";
        row_3.cells.getCell(1).value = "BLONP";
        row_3.cells.getCell(2).value = "4";
        row_3.cells.getCell(3).value = "5.3";
        row_3.cells.getCell(4).value = "false";
        row_3.cells.getCell(5).value = "Ernst Handel";
        row_3.cells.getCell(6).value = "Marseille";
        row_3.cells.getCell(7).value = "Austria";
        row_3.cells.getCell(8).value = "Magazinweg 7";
        let row_4: PdfGridRow = grid.rows.addRow();
        row_4.cells.getCell(0).value = "10005";
        row_4.cells.getCell(1).value = "BLONP";
        row_4.cells.getCell(2).value = "5";
        row_4.cells.getCell(3).value = "6.3";
        row_4.cells.getCell(4).value = "true";
        row_4.cells.getCell(5).value = "Hanari Carnes";
        row_4.cells.getCell(6).value = "Tsawassen";
        row_4.cells.getCell(7).value = "Switzerland";
        row_4.cells.getCell(8).value = "1029 - 12th Ave. S.";
        let row_5: PdfGridRow = grid.rows.addRow();
        row_5.cells.getCell(0).value = "10006";
        row_5.cells.getCell(1).value = "ALFKI";
        row_5.cells.getCell(2).value = "1";
        row_5.cells.getCell(3).value = "4.6";
        row_5.cells.getCell(4).value = "false";
        row_5.cells.getCell(5).value = "Simons bistro";
        row_5.cells.getCell(6).value = "Berlin";
        row_5.cells.getCell(7).value = "Denmark";
        row_5.cells.getCell(8).value = "Kirchgasse 6";
        let row_6: PdfGridRow = grid.rows.addRow();
        row_6.cells.getCell(0).value = "10006";
        row_6.cells.getCell(1).value = "ALFKI";
        row_6.cells.getCell(2).value = "2";
        row_6.cells.getCell(3).value = "6.6";
        row_6.cells.getCell(4).value = "true";
        row_6.cells.getCell(5).value = "Queen Cozinha";
        row_6.cells.getCell(6).value = "Madrid";
        row_6.cells.getCell(7).value = "Brazil";
        row_6.cells.getCell(8).value = "Avda. Azteca 123";
        let row_7: PdfGridRow = grid.rows.addRow();
        row_7.cells.getCell(0).value = "10008";
        row_7.cells.getCell(1).value = "ANTON";
        row_7.cells.getCell(2).value = "3";
        row_7.cells.getCell(3).value = "8.6";
        row_7.cells.getCell(4).value = "true";
        row_7.cells.getCell(5).value = "Frankenversand";
        row_7.cells.getCell(6).value = "Cholchester";
        row_7.cells.getCell(7).value = "Germany";
        row_7.cells.getCell(8).value = "Carrera 52 con Ave. Bolívar #65-98 Llano Largo";
        let row_8: PdfGridRow = grid.rows.addRow();
        row_8.cells.getCell(0).value = "10009";
        row_8.cells.getCell(1).value = "BLONP";
        row_8.cells.getCell(2).value = "4";
        row_8.cells.getCell(3).value = "10.6";
        row_8.cells.getCell(4).value = "false";
        row_8.cells.getCell(5).value = "Ernst Handel";
        row_8.cells.getCell(6).value = "Marseille";
        row_8.cells.getCell(7).value = "Austria";
        row_8.cells.getCell(8).value = "Magazinweg 7";
        let row_9: PdfGridRow = grid.rows.addRow();
        row_9.cells.getCell(0).value = "10010";
        row_9.cells.getCell(1).value = "BLONP";
        row_9.cells.getCell(2).value = "5";
        row_9.cells.getCell(3).value = "12.6";
        row_9.cells.getCell(4).value = "true";
        row_9.cells.getCell(5).value = "Hanari Carnes";
        row_9.cells.getCell(6).value = "Tsawassen";
        row_9.cells.getCell(7).value = "Switzerland";
        row_9.cells.getCell(8).value = "1029 - 12th Ave. S.";
        let row_10: PdfGridRow = grid.rows.addRow();
        row_10.cells.getCell(0).value = "10011";
        row_10.cells.getCell(1).value = "ALFKI";
        row_10.cells.getCell(2).value = "1";
        row_10.cells.getCell(3).value = "6.8999999999999995";
        row_10.cells.getCell(4).value = "false";
        row_10.cells.getCell(5).value = "Simons bistro";
        row_10.cells.getCell(6).value = "Berlin";
        row_10.cells.getCell(7).value = "Denmark";
        row_10.cells.getCell(8).value = "Kirchgasse 6";
        let row_11: PdfGridRow = grid.rows.addRow();
        row_11.cells.getCell(0).value = "10011";
        row_11.cells.getCell(1).value = "ALFKI";
        row_11.cells.getCell(2).value = "2";
        row_11.cells.getCell(3).value = "9.899999999999999";
        row_11.cells.getCell(4).value = "true";
        row_11.cells.getCell(5).value = "Queen Cozinha";
        row_11.cells.getCell(6).value = "Madrid";
        row_11.cells.getCell(7).value = "Brazil";
        row_11.cells.getCell(8).value = "Avda. Azteca 123";
        let row_12: PdfGridRow = grid.rows.addRow();
        row_12.cells.getCell(0).value = "10013";
        row_12.cells.getCell(1).value = "ANTON";
        row_12.cells.getCell(2).value = "3";
        row_12.cells.getCell(3).value = "12.899999999999999";
        row_12.cells.getCell(4).value = "true";
        row_12.cells.getCell(5).value = "Frankenversand";
        row_12.cells.getCell(6).value = "Cholchester";
        row_12.cells.getCell(7).value = "Germany";
        row_12.cells.getCell(8).value = "Carrera 52 con Ave. Bolívar #65-98 Llano Largo";
        let row_13: PdfGridRow = grid.rows.addRow();
        row_13.cells.getCell(0).value = "10014";
        row_13.cells.getCell(1).value = "BLONP";
        row_13.cells.getCell(2).value = "4";
        row_13.cells.getCell(3).value = "15.899999999999999";
        row_13.cells.getCell(4).value = "false";
        row_13.cells.getCell(5).value = "Ernst Handel";
        row_13.cells.getCell(6).value = "Marseille";
        row_13.cells.getCell(7).value = "Austria";
        row_13.cells.getCell(8).value = "Magazinweg 7";
        let row_14: PdfGridRow = grid.rows.addRow();
        row_14.cells.getCell(0).value = "10015";
        row_14.cells.getCell(1).value = "BLONP";
        row_14.cells.getCell(2).value = "5";
        row_14.cells.getCell(3).value = "18.9";
        row_14.cells.getCell(4).value = "true";
        row_14.cells.getCell(5).value = "Hanari Carnes";
        row_14.cells.getCell(6).value = "Tsawassen";
        row_14.cells.getCell(7).value = "Switzerland";
        row_14.cells.getCell(8).value = "1029 - 12th Ave. S.";
        let aggregateRow_0: PdfGridRow = grid.rows.addRow();
        aggregateRow_0.cells.getCell(0).value = "Sum: 150117";
        aggregateRow_0.cells.getCell(1).value = "";
        aggregateRow_0.cells.getCell(2).value = "Sum: 45";
        aggregateRow_0.cells.getCell(3).value = "Sum: $129.00";
        aggregateRow_0.cells.getCell(4).value = "";
        aggregateRow_0.cells.getCell(5).value = "";
        aggregateRow_0.cells.getCell(6).value = "";
        aggregateRow_0.cells.getCell(7).value = "";
        aggregateRow_0.cells.getCell(8).value = "";
        let aggregateRow_1: PdfGridRow = grid.rows.addRow();
        aggregateRow_1.cells.getCell(0).value = "";
        aggregateRow_1.cells.getCell(1).value = "";
        aggregateRow_1.cells.getCell(2).value = "";
        aggregateRow_1.cells.getCell(3).value = "Average: $8.60";
        aggregateRow_1.cells.getCell(4).value = "";
        aggregateRow_1.cells.getCell(5).value = "";
        aggregateRow_1.cells.getCell(6).value = "";
        aggregateRow_1.cells.getCell(7).value = "";
        aggregateRow_1.cells.getCell(8).value = "";
        let result: PdfLayoutResult = grid.draw(page, 0, 0);
        let grid2: PdfGrid = new PdfGrid();
        grid2.columns.add(4);
        grid2.headers.add(2);
        let grid2header_0: PdfGridRow = grid2.headers.getHeader(0);
        grid2header_0.cells.getCell(0).value = "Unit Details";
        grid2header_0.cells.getCell(0).style.font = hfont;
        grid2header_0.cells.getCell(0).columnSpan = 4;
        let grid2header_1: PdfGridRow = grid2.headers.getHeader(1);
        grid2header_1.cells.getCell(0).value = "Unit ID";
        grid2header_1.cells.getCell(0).style.font = hfont;
        grid2header_1.cells.getCell(1).value = "Employee ID";
        grid2header_1.cells.getCell(1).style.font = hfont;
        grid2header_1.cells.getCell(2).value = "Nmae";
        grid2header_1.cells.getCell(2).style.font = hfont;
        grid2header_1.cells.getCell(3).value = "Ship Address";
        grid2header_1.cells.getCell(3).style.font = hfont;
        let format2: PdfGridLayoutFormat = new PdfGridLayoutFormat();
        format2.layout = PdfLayoutType.Paginate;
        format2.break = PdfLayoutBreakType.FitPage;
        result = grid2.draw(result.page, 0, result.bounds.y + result.bounds.height + 30, format2);
        let grid3: PdfGrid = new PdfGrid();
        grid3.columns.add(3);
        grid3.headers.add(2);
        let grid3Header_0: PdfGridRow = grid3.headers.getHeader(0);
        grid3Header_0.cells.getCell(0).value = "Details";
        grid3Header_0.cells.getCell(0).style.font = hfont;
        grid3Header_0.cells.getCell(0).columnSpan = 3;
        let grid3Header_1: PdfGridRow = grid3.headers.getHeader(1);
        grid3Header_1.cells.getCell(0).value = "ID";
        grid3Header_1.cells.getCell(0).style.font = hfont;
        grid3Header_1.cells.getCell(1).value = "Employee ID";
        grid3Header_1.cells.getCell(1).style.font = hfont;
        grid3Header_1.cells.getCell(2).value = "E-Nmae";
        grid3Header_1.cells.getCell(2).style.font = hfont;
        let format3: PdfGridLayoutFormat = new PdfGridLayoutFormat();
        format3.layout = PdfLayoutType.Paginate;
        format3.break = PdfLayoutBreakType.FitPage;
        result = grid3.draw(result.page, 0, result.bounds.y + result.bounds.height + 30, format3);
        let grid4: PdfGrid = new PdfGrid();
        grid4.columns.add(3);
        grid4.headers.add(2);
        let grid4Header_0: PdfGridRow = grid4.headers.getHeader(0);
        grid4Header_0.cells.getCell(0).value = "Order Details";
        grid4Header_0.cells.getCell(0).style.font = hfont;
        grid4Header_0.cells.getCell(0).columnSpan = 3;
        let grid4Header_1: PdfGridRow = grid4.headers.getHeader(1);
        grid4Header_1.cells.getCell(0).value = "Order ID";
        grid4Header_1.cells.getCell(0).style.font = hfont;
        grid4Header_1.cells.getCell(1).value = "Customer ID";
        grid4Header_1.cells.getCell(1).style.font = hfont;
        grid4Header_1.cells.getCell(2).value = "Ship City";
        grid4Header_1.cells.getCell(2).style.font = hfont;
        let grid4Row_0: PdfGridRow = grid4.rows.addRow();
        grid4Row_0.cells.getCell(0).value = "20001";
        grid4Row_0.cells.getCell(1).value = "PALFKI";
        grid4Row_0.cells.getCell(2).value = "Berlin";
        let grid4Row_1: PdfGridRow = grid4.rows.addRow();
        grid4Row_1.cells.getCell(0).value = "20002";
        grid4Row_1.cells.getCell(1).value = "OANATR";
        grid4Row_1.cells.getCell(2).value = "Madrid";
        let grid4Row_2: PdfGridRow = grid4.rows.addRow();
        grid4Row_2.cells.getCell(0).value = "20003";
        grid4Row_2.cells.getCell(1).value = "IANTON";
        grid4Row_2.cells.getCell(2).value = "Cholchester";
        let grid4Row_3: PdfGridRow = grid4.rows.addRow();
        grid4Row_3.cells.getCell(0).value = "20004";
        grid4Row_3.cells.getCell(1).value = "UBLONP";
        grid4Row_3.cells.getCell(2).value = "Marseille";
        let grid4Row_4: PdfGridRow = grid4.rows.addRow();
        grid4Row_4.cells.getCell(0).value = "20005";
        grid4Row_4.cells.getCell(1).value = "MBOLID";
        grid4Row_4.cells.getCell(2).value = "Tsawassen";
        let format4: PdfGridLayoutFormat = new PdfGridLayoutFormat();
        format4.layout = PdfLayoutType.Paginate;
        format4.break = PdfLayoutBreakType.FitPage;
        result = grid4.draw(result.page, 0, result.bounds.y + result.bounds.height + 30, format4);
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_50946_GridIssue.pdf');
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
        pdfDocument.destroy();
    });
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

describe('Customer reported issues', () => {
    it('EJ2_51790_PaginationBoundsIssue', (done) => {
        let pdfDocument: PdfDocument = new PdfDocument();
        let page: PdfPage = pdfDocument.pages.add();
        // create a PdfGrid
        let grid: PdfGrid = new PdfGrid();
        grid.columns.add(4);
        grid.headers.add(1);
        grid.repeatHeader = false;
        let gridHeader: PdfGridRow = grid.headers.getHeader(0);
        gridHeader.cells.getCell(0).value = 'Order ID';
        gridHeader.cells.getCell(1).value = 'Product Name';
        gridHeader.cells.getCell(2).value = 'Quantity';
        gridHeader.cells.getCell(3).value = 'Ship city';
        for (let i: number = 0; i < 150; i++) {
            let row: PdfGridRow = grid.rows.addRow();
            row.cells.getCell(0).value = i.toString();
            row.cells.getCell(1).value = 'ALFKI';
            row.cells.getCell(2).value = '1';
            row.cells.getCell(3).value = 'Denmark';
        }
        let format: PdfGridLayoutFormat = new PdfGridLayoutFormat();
        format.layout = PdfLayoutType.Paginate;
        format.break = PdfLayoutBreakType.FitElement;
        format.paginateBounds = new RectangleF(0, 30, page.graphics.clientSize.width, page.graphics.clientSize.height - 30);
        let result: PdfLayoutResult = grid.draw(page, new RectangleF(0, 50, page.graphics.clientSize.width, page.graphics.clientSize.height - 50), format);
        // create header font
        let hfont1 = new PdfStandardFont(2, 20);
        let hfont2 = new PdfStandardFont(2, 15);
        // create back brush
        let backBrush1 = new PdfSolidBrush(new PdfColor(245, 245, 245));
        let backBrush2 = new PdfSolidBrush(new PdfColor(255, 182, 193));
        // create black brush for header text
        let hBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // create string format for alignment
        let hStringFormat = new PdfStringFormat(PdfTextAlignment.Center, PdfVerticalAlignment.Middle);
        // draw first page header
        page.graphics.drawRectangle(backBrush1, 0, 0, 515, 50);
        page.graphics.drawString('First page header', hfont1, null, hBrush, 0, 0, 515, 50, hStringFormat);
        // iterate pages to add custom header
        for (let i: number = 1; i < pdfDocument.pages.count; i++) {
            let headerPage: PdfPage = pdfDocument.pages.getPageByIndex(i);
            // draw all other page header
            headerPage.graphics.drawRectangle(backBrush2, 0, 0, 515, 25);
            headerPage.graphics.drawString('Other page header', hfont2, null, hBrush, 0, 0, 515, 25, hStringFormat);
        }
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51790_PaginationBoundsIssue.pdf');
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
        pdfDocument.destroy();
    });
    it('EJ2_51938_LineBreakIssue', (done) => {
        let pdfDocument: PdfDocument = new PdfDocument();
        pdfDocument.pageSettings.size = { height: 842, width: 595 };
        pdfDocument.pageSettings.orientation = 1;
        let hfont = new PdfStandardFont(2, 13); // font style for headers
        // create black brush
        let brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let bounds = new RectangleF(0, 0, 515, 50);
        let header = new PdfPageTemplateElement(bounds);
        header.graphics.drawString(
            'Header Text',
            hfont,
            null,
            brush,
            0,
            0,
            100,
            50,
            null
        );
        //Add the header at the top.
        pdfDocument.template.top = header;
        let page: PdfPage = pdfDocument.pages.add();
        let grid4: PdfGrid = new PdfGrid();
        grid4.columns.add(3);
        grid4.headers.add(2);
        let grid4Header_0: PdfGridRow = grid4.headers.getHeader(0);
        grid4Header_0.cells.getCell(0).value = 'Order Details';
        grid4Header_0.cells.getCell(0).style.font = hfont;
        grid4Header_0.cells.getCell(0).columnSpan = 3;
        let grid4Header_1: PdfGridRow = grid4.headers.getHeader(1);
        grid4Header_1.cells.getCell(0).value = 'Order ID';
        grid4Header_1.cells.getCell(0).style.font = hfont;
        grid4Header_1.cells.getCell(1).value = 'Customer ID';
        grid4Header_1.cells.getCell(1).style.font = hfont;
        grid4Header_1.cells.getCell(2).value = 'Ship City';
        grid4Header_1.cells.getCell(2).style.font = hfont;
        let grid4Row_0: PdfGridRow = grid4.rows.addRow();
        grid4Row_0.cells.getCell(0).value = '20001';
        grid4Row_0.cells.getCell(1).value = 'PALFKI';
        grid4Row_0.cells.getCell(2).value = 'Berlin';
        let grid4Row_1: PdfGridRow = grid4.rows.addRow();
        grid4Row_1.cells.getCell(0).value = '20002';
        grid4Row_1.cells.getCell(1).value = 'OANATR';
        grid4Row_1.cells.getCell(2).value = 'Madrid';
        let grid4Row_2: PdfGridRow = grid4.rows.addRow();
        grid4Row_2.cells.getCell(0).value = '20003';
        grid4Row_2.cells.getCell(1).value = 'IANTON';
        grid4Row_2.cells.getCell(2).value = 'Cholchester';
        let grid4Row_3: PdfGridRow = grid4.rows.addRow();
        grid4Row_3.cells.getCell(0).value = '20004';
        grid4Row_3.cells.getCell(1).value = 'UBLONP';
        grid4Row_3.cells.getCell(2).value = 'Marseille';
        let grid4Row_4: PdfGridRow = grid4.rows.addRow();
        grid4Row_4.cells.getCell(0).value = '20005';
        grid4Row_4.cells.getCell(1).value = 'MBOLID';
        grid4Row_4.cells.getCell(2).value = 'Tsawassen';
        let format4: PdfGridLayoutFormat = new PdfGridLayoutFormat();
        format4.layout = PdfLayoutType.Paginate;
        format4.break = PdfLayoutBreakType.FitPage;
        let result: PdfLayoutResult = grid4.draw(
            page,
            0,
            425.5,
            format4
        );
        //Save the document.
        pdfDocument.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_51938_LineBreakIssue.pdf');
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
        pdfDocument.destroy();
    });
});
