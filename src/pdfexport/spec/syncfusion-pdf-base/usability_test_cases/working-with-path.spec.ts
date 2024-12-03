/**
 * spec document for Main.ts class
 */
import { PdfDocument, PdfPage, PdfStandardFont, PdfTrueTypeFont, PdfGrid } from './../../../src/index';
import { PdfSolidBrush, PdfColor, PdfFont, PdfFontFamily, PdfStringFormat } from './../../../src/index';
import { RectangleF, PdfPen, PdfGraphicsState, PdfFontStyle, PdfTextAlignment,PdfPath, PointF, PdfFillMode , PdfLayoutBreakType, PdfLayoutType, PdfLayoutFormat} from './../../../src/index';
import { Utils } from './../utils.spec';
import { PdfShapeElement } from '../../../src/implementation/graphics/figures/base/pdf-shape-element';
import { ShapeLayouter } from '../../../src/implementation/graphics/figures/base/shape-layouter';

describe('UTC-01: Drawing path', () => {
    it('-EJ2-38402 Drawing path1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, new PointF(0, 0));
        //document.save("EJ2_38402_draw_path1.pdf");
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path1.pdf');
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
});
describe('UTC-02: Drawing path', () => {
    it('-EJ2-38402 Drawing path2', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();

      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
      // set pen
      let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
      // set brush
      let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
      // draw the path
      page1.graphics.drawPath(pen, brush, path);
      // save the document.
      //document.save('EJ2_38402_draw_path2.pdf');
      document.save().then((xlBlob: { blobData: Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path2.pdf');
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
});
describe('UTC-03: Drawing path', () => {
    it('-EJ2-38402 Drawing path3', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
        let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1, 1, 1 ];
        //Create new PDF path.
        let path : PdfPath = new PdfPath(pathPoints, pathTypes);
        //Draw PDF path to page.
        path.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38402_EJ2_Path3.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path3.pdf');
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
});
describe('UTC-04: Drawing path', () => {
    it('-EJ2-38402 Drawing path4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set pen
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Create new PDF path.
        let path : PdfPath = new PdfPath(pen);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, new PointF(10, 10));
       // document.save("EJ2_38402_draw_path4.pdf");
        document.save().then((xlBlob: { blobData:Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path4.pdf');
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
});
describe('UTC-05: Drawing path', () => {
    it('-EJ2-38402 Drawing path5', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set brush
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        //Create new PDF path.
        let path : PdfPath = new PdfPath(brush);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, new PointF(0, 0));
        //document.save("EJ2_38402_draw_path5.pdf");
        document.save().then((xlBlob: { blobData:Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path5.pdf');
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
});
describe('UTC-06: Drawing path', () => {
    it('-EJ2-38402 Drawing path6', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      // set brush
      let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
      //Create new PDF path.
      let path : PdfPath = new PdfPath( brush, PdfFillMode.Alternate);
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
      //Draw PDF path to page.
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_draw_path6.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path6.pdf');
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
});
describe('UTC-07: Drawing path', () => {
    it('-EJ2-38402 Drawing path7', (done) => {
    // create a new PDF document.
    let document : PdfDocument = new PdfDocument();
    // add a page to the document.
    let page1 : PdfPage = document.pages.add();
    let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
    let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1, 1, 1 ];
    // set pen
    let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
    //Create new PDF path.
    let path : PdfPath = new PdfPath(pen, pathPoints, pathTypes);
    //Draw PDF path to page.
    path.draw(page1, new PointF(0, 0));
    
    // save the document.
   // document.save('EJ2_38402_draw_path7.pdf');
    document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path7.pdf');
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
});

describe('UTC-08: Drawing path', () => {
    it('-EJ2-38402 Drawing path8', (done) => {
      // create a new PDF document.
    let document : PdfDocument = new PdfDocument();
    // add a page to the document.
    let page1 : PdfPage = document.pages.add();
    let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
    let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1, 1, 1 ];
    // set brush
    let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
    //Create new PDF path.
    let path : PdfPath = new PdfPath(brush, PdfFillMode.Alternate, pathPoints, pathTypes);
    //Draw PDF path to page.
    path.draw(page1, new PointF(0, 0));
    // save the document.
    //document.save('EJ2_38402_EJ2_Path8.pdf');
    document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path8.pdf');
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
});

describe('UTC-09: Drawing path', () => {
    it('-EJ2-38402 Drawing path9', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
     // set pen
     let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
     // set brush
     let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
      //Create new PDF path.
      let path : PdfPath = new PdfPath(pen, brush, PdfFillMode.Alternate);
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
      
      //Draw PDF path to page.
      path.draw(page1, new PointF(0, 0));
      
      // save the document.
      //document.save('EJ2_38402_draw_path9.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path9.pdf');
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
});

describe('UTC-10: Drawing path', () => {
    it('-EJ2-38402 Drawing path10', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      //Set the path fill mode.
      path.fillMode = PdfFillMode.Winding;
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_EJ2_Path10.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path10.pdf');
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
});


describe('UTC-11: Drawing path', () => {
    it('-EJ2-38402 Drawing path11', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      //Set the path fill mode.
      path.fillMode = PdfFillMode.Winding;
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
      let pathPoints : PointF[] = path.pathPoints;
      //Get path point count.
      let count : number = path.pointCount;
      //Get last point
      let lastPoint : PointF = path.lastPoint;
       //Get last point.
      let  lastPoint1 : PointF = path.getLastPoint();
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_EJ2_Path11.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path11.pdf');
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
}); 

describe('UTC-12: Drawing path', () => {
    it('-EJ2-38402 Drawing path Arc', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      //Add arc.
      path.addArc(new RectangleF(0, 0, 100, 100), 0, -90);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_Draw_PathArc.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathArc.pdf');
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
}); 

describe('UTC-13: Drawing path', () => {
    it('-EJ2-38402 Drawing path Arc1', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      //Add arc.
      path.addArc(0, 0, 100, 100, 0, -90);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
    //  document.save('EJ2_38402_Draw_PathArc1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathArc1.pdf');
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
}); 

describe('UTC-14: Drawing path', () => {
    it('-EJ2-38402 Drawing path bezier', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        //Start figure.
        path.startFigure();
        //Add bezier.
        path.addBezier(new PointF(30, 30), new PointF(90, 0), new PointF(60, 90), new PointF(120, 30));
        //Close figure.
        path.closeFigure();

        path.draw(page1, new PointF(0, 0));
        // save the document.
        //document.save('EJ2_38402_Draw_PathBezier.pdf');
        document.save().then((xlBlob: { blobData:Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathBezier.pdf');
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
}); 

describe('UTC-15: Drawing path', () => {
    it('-EJ2-38402 Drawing path bezier1', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        //Start figure.
        path.startFigure();
        //Add bezier.
        path.addBezier(30, 30, 90, 0, 60, 90, 120, 30);
        //Close figure.
        path.closeFigure();

        path.draw(page1, new PointF(0, 0));
        // save the document.
        //document.save('EJ2_38402_Draw_PathBezier1.pdf');
        document.save().then((xlBlob: { blobData:Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathBezier1.pdf');
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
}); 

describe('UTC-16: Drawing path', () => {
    it('-EJ2-38402 Drawing path Ellipse', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      //Add ellipse.
      path.addEllipse(new RectangleF(0, 0, 200, 100));
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_PathEllipse.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathEllipse.pdf');
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
}); 

describe('UTC-17: Drawing path', () => {
    it('-EJ2-38402 Drawing path Ellipse1', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      //Add ellipse.
      path.addEllipse(0, 0, 200, 100);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_PathEllipse1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathEllipse1.pdf');
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
}); 

describe('UTC-18: Drawing path', () => {
    it('-EJ2-38402 Drawing path Lines1', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      //Add lines.
      path.addLine(10, 100, 10, 200);  
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_PathLine1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_PathLine1.pdf');
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
}); 
describe('UTC-19: Drawing path', () => {
    it('-EJ2-38402 Drawing Addpath', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
      let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1, 1, 1 ];
      //Create new PDF path.
      let ppath : PdfPath = new PdfPath(pathPoints, pathTypes);
      path.addPath(ppath);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_Draw_Addpath.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_Addpath.pdf');
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
}); 

describe('UTC-20: Drawing path', () => {
    it('-EJ2-38402 Drawing Addpath1', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
      let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1, 1, 1 ];
      
      path.addPath(pathPoints, pathTypes);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_Draw_Addpath1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_Addpath1.pdf');
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
}); 
describe('UTC-21: Drawing path', () => {
    it('-EJ2-38402 Drawing AddPie', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      path.addPie(new RectangleF(20, 20, 70, 70), -45, 90);   
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_AddPie.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_AddPie.pdf');
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
}); 

describe('UTC-22: Drawing path', () => {
    it('-EJ2-38402 Drawing AddPie', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      
      path.addPie(20, 20, 70, 70, -45, 90);  
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_AddPie1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_AddPie1.pdf');
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
}); 


describe('UTC-23: Drawing path', () => {
    it('-EJ2-38402 Drawing AddPolygon', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      
      let polygonPoints : PointF[]  = [new PointF(23, 20), new PointF(40, 10), new PointF(57, 20), new PointF(50, 40), new PointF(30, 40) ];
       //Add polygon.
      path.addPolygon(polygonPoints); 
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_Draw_AddPolygon.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_AddPolygon.pdf');
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
}); 
describe('UTC-24: Drawing path', () => {
    it('-EJ2-38402 Drawing AddRectangle', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();

      path.addRectangle(new RectangleF(0, 0, 200, 100));   
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
     // document.save('EJ2_38402_Draw_AddRectangle.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_AddRectangle.pdf');
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
}); 

describe('UTC-25: Drawing path', () => {
    it('-EJ2-38402 Drawing AddRectangle1', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();
      //Create new PDF path.
      let path : PdfPath = new PdfPath();
      
      path.addRectangle(0, 0, 200, 100);
      
      path.draw(page1, new PointF(0, 0));
      // save the document.
      //document.save('EJ2_38402_Draw_AddRectangle1.pdf');
      document.save().then((xlBlob: { blobData:Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_AddRectangle1.pdf');
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
}); 

describe('UTC-26: Drawing path', () => {
    it('-EJ2-38402 Drawing start figure', (done) => {
   // create a new PDF document.
   let document : PdfDocument = new PdfDocument();
   // add a page to the document.
   let page1 : PdfPage = document.pages.add();
   //Create new PDF path.
   let path : PdfPath = new PdfPath();
   //First Start figure.
   path.startFigure();
   //Add arc.
   path.addArc(10, 10, 50, 50, 0, 270);
   //Close figure.
   path.closeFigure();
   //Second Start figure.
   path.startFigure();
   //Add arc.
   path.addRectangle(10, 70, 50, 100);
   //Close figure.
   path.closeFigure();
   path.draw(page1, new PointF(0, 0));
   // save the document.
  // document.save('EJ2_38402_Draw_Path_startfigure.pdf');
   document.save().then((xlBlob: { blobData:Blob }) => {
    if (Utils.isDownloadEnabled) {
        Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_Path_startfigure.pdf');
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
}); 


describe('UTC-27: Drawing path', () => {
    it('-EJ2-38402 Drawing Close figure', (done) => {
   // create a new PDF document.
   let document : PdfDocument = new PdfDocument();
   // add a page to the document.
   let page1 : PdfPage = document.pages.add();
   //Create new PDF path.
   let path : PdfPath = new PdfPath();
   //First Start figure.
   path.startFigure();
   //Add arc.
   path.addArc(10, 10, 50, 50, 0, 270);  
   //Close figure.
   path.closeFigure();
   //Second Start figure.
   path.startFigure();
   //Add arc.
   path.addRectangle(10, 70, 50, 100);
   //Close figure.
   path.closeFigure();
   path.draw(page1, new PointF(0, 0));
   // save the document.
  // document.save('EJ2_38402_Draw_Path_Closefigure.pdf');
   document.save().then((xlBlob: { blobData:Blob }) => {
    if (Utils.isDownloadEnabled) {
        Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_Path_Closefigure.pdf');
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
}); 

describe('UTC-28: Drawing path', () => {
    it('-EJ2-38402 Drawing All Close figure', (done) => {
   // create a new PDF document.
   let document : PdfDocument = new PdfDocument();
   // add a page to the document.
   let page1 : PdfPage = document.pages.add();
   //Create new PDF path.
   let path : PdfPath = new PdfPath();
   //First Start figure.
   path.startFigure();
   path.addLine(new PointF(10, 100), new PointF(150, 100));
   path.addLine(new PointF(150, 100), new PointF(10, 200));
   path.startFigure();
   //Add arc.
   path.addArc(200, 200, 100, 100, 0, 90);
   path.startFigure(); 
   let point1 : PointF  = new PointF(300, 300);
    let point2 : PointF  = new PointF(400, 325);
    let point3 : PointF = new PointF(400, 375);
    let point4 : PointF = new PointF(300, 400);
    let points : PointF[] = [ point1, point2, point3, point4 ];
    path.addPolygon(points);
   //Close figure.
   path.closeAllFigures();
   //Second Start figure.
   path.startFigure();
   //Add arc.
   path.addRectangle(10, 70, 50, 100);
   //Close figure.
   path.closeFigure();
   path.draw(page1, new PointF(0, 0));
   // save the document.
   //document.save('EJ2_38402_Draw_Path_AllClosefigure.pdf');
   document.save().then((xlBlob: { blobData:Blob }) => {
    if (Utils.isDownloadEnabled) {
        Utils.download(xlBlob.blobData, 'EJ2_38402_Draw_Path_AllClosefigure.pdf');
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
}); 
describe('UTC-29: Drawing path', () => {
    it('-EJ2-38402 Drawing path public method', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, 10, 10);
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path_public.pdf');
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
});
describe('UTC-30: Drawing path', () => {
    it('-EJ2-38402 Drawing path public method1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let rect : RectangleF = new RectangleF(20, 30, 100, 100);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, rect);
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path_public1.pdf');
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
});
describe('UTC-31: Drawing path', () => {
    it('-EJ2-38402 Drawing path public method2', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let rect : RectangleF = new RectangleF(0, 0, 100, 100);
        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, rect, layoutFormat);
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path_public2.pdf');
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
});
describe('UTC-32: Drawing path', () => {
    it('-EJ2-38402 Drawing path public method3', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, 10, 30, layoutFormat);
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path_public3.pdf');
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
});
describe('UTC-33: Drawing path', () => {
    it('-EJ2-38402 Drawing path public method4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();

        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, new PointF(10, 30), layoutFormat);
        
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38402_draw_path_public4.pdf');
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
});
describe('PdfPath.ts', () => {
    describe('Constructor initializing',()=> {
        
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let pathPoints : PointF[] = [new PointF(0, 0), new PointF(100, 0), new PointF(100, 100), new PointF(0, 100), new PointF(0, 0), new PointF(100, 100), new PointF(0, 100), new PointF(100, 0) ];
        let pathTypes : number[] = [ 0, 1, 1, 129, 0, 1 ];
        //Create new PDF path.
        let ppath : PdfPath = new PdfPath();
        it('-AddPath() method calling)', () => {
             expect(function (): void {path.addPath(null, null); }).toThrowError();
        })

        it('-AddPath() method calling1)', () => {
            expect(function (): void {path.addPath(pathPoints, null); }).toThrowError();        
        })
        it('-AddPath() method calling2)', () => {
            expect(function (): void {path.addPath(pathPoints, pathTypes); }).toThrowError();        
        })
        it('-AddPath() Draw graphics internal calling)', () => {
            expect(function (): void {path.drawInternal(null); }).toThrowError();        
        })
        it('-AddPath() close figure calling)', () => {
            expect(function (): void {path.closeFigure(-1); }).toThrowError();        
        })
        path.pen = pen;
        path.brush = brush;
    })
});
