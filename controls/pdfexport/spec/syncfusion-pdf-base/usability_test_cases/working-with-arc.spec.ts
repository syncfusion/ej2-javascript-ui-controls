/**
 * spec document for Main.ts class
 */
import { PdfDocument, PdfPage, PdfStandardFont, PdfTrueTypeFont, PdfGrid } from './../../../src/index';
import { PdfSolidBrush, PdfColor, PdfFont, PdfFontFamily, PdfStringFormat } from './../../../src/index';
import { RectangleF, PdfPen, PdfGraphicsState, PdfFontStyle, PdfTextAlignment,PdfPath, PointF,PdfArc, PdfFillMode, PdfLayoutBreakType, PdfLayoutType, PdfLayoutFormat } from './../../../src/index';
import { Utils } from './../utils.spec';
import { PdfShapeElement } from '../../../src/implementation/graphics/figures/base/pdf-shape-element';
import { ShapeLayouter } from '../../../src/implementation/graphics/figures/base/shape-layouter';

describe('UTC-01: Drawing Arc', () => {
    it('-EJ2-38403 Drawing arc1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();   
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(bounds, 0, 180);
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        //document.save('EJ2_38403_draw_arc1.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc1.pdf');
            }
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

describe('UTC-02: Drawing arc', () => {
    it('-EJ2-38403 Drawing arc2', (done) => {
     // create a new PDF document.
     let document : PdfDocument = new PdfDocument();
     // add a page to the document.
     let page1 : PdfPage = document.pages.add();

    //Create new instance of PdfArc.
    let arc : PdfArc = new PdfArc(200,100, 0, 180);
    // draw the arc
    arc.draw(page1, new PointF(50, 50));
      // save the document.
      //document.save('EJ2_38403_draw_arc2.pdf');
      document.save().then((xlBlob: { blobData: Blob }) => {
        if (Utils.isDownloadEnabled) {
            Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc2.pdf');
        }
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

describe('UTC-03: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc3', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(pen, 200, 100, 0, 180);
        
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38403_draw_arc3.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc3.pdf');
            }
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


describe('UTC-04: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc4', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
      
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(0,0,200,100, 0, 180);
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38403_draw_arc4.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc4.pdf');
            }
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
describe('UTC-05: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc5', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(pen, 0, 0, 200, 100, 0, 180);
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38403_draw_arc5.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc5.pdf');
            }
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
describe('UTC-06: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc6', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
      
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(pen, bounds, 0, 180);
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38403_draw_arc6.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc6.pdf');
            }
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
describe('UTC-07: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc7', (done) => {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
      
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc()
        arc.bounds = bounds;
        arc.pen = pen;
        arc.startAngle = 0;
        arc.sweepAngle = 180;
        //Draw the arc to PDF page.
        arc.draw(page1, new PointF(0, 0));
        
        // save the document.
        //document.save('EJ2_38403_draw_arc7.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc7.pdf');
            }
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

describe('UTC-08: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc8', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
         let arc : PdfArc = new PdfArc(bounds, 0, 180);
        //Draw PDF path to page.
        arc.draw(page1, 10, 10);
        // save the document.
        //document.save('EJ2_38403_draw_arc8.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc8.pdf');
            }
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
describe('UTC-09: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc9', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
       
        let rect : RectangleF = new RectangleF(20, 30, 300, 100);
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
         let arc : PdfArc = new PdfArc(bounds, 0, 180);
        //Draw PDF path to page.
        arc.draw(page1, rect);
        // save the document.
        //document.save('EJ2_38403_draw_arc9.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc9.pdf');
            }
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
describe('UTC-10: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc10', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(bounds, 0, 180);
        let rect : RectangleF = new RectangleF(0, 0, 300, 100);
        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
        //Draw PDF path to page.
        arc.draw(page1, rect, layoutFormat);
        // save the document.
        //document.save('EJ2_38403_draw_arc10.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc10.pdf');
            }
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
describe('UTC-11: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Arc11', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(bounds, 0, 180);
        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
    
        //Draw PDF path to page.
        arc.draw(page1, 10, 30, layoutFormat);
        // save the document.
        //document.save('EJ2_38403_draw_arc11.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc11.pdf');
            }
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
describe('UTC-12: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Acr12 ', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        //Arc bounds.
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new instance of PdfArc.
        let arc : PdfArc = new PdfArc(bounds, 0, 180);

        let layoutFormat : PdfLayoutFormat  = new PdfLayoutFormat();
        layoutFormat.break = PdfLayoutBreakType.FitElement;
        layoutFormat.layout = PdfLayoutType.Paginate;
        layoutFormat.paginateBounds = new RectangleF(0, 0, 500, 350);
        
        //Draw PDF path to page.
        arc.draw(page1, new PointF(10, 30), layoutFormat);
        // save the document.
        //document.save('EJ2_38403_draw_arc12.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc12.pdf');
            }
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
describe('UTC-13: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Acr13 ', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set pen
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // draw the path
        page1.graphics.drawArc(pen, 10, 10, 100, 200, 90, 270);
        // save the document.
        //document.save('EJ2_38403_draw_arc13.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc13.pdf');
            }
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
describe('UTC-14: Drawing Arc', () => {
    it('-EJ2-38403 Drawing Acr14 ', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        let bounds : RectangleF = new RectangleF(10, 10, 100, 200);
        // set pen
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // draw the path
        page1.graphics.drawArc(pen, bounds, 90, 270);
        // save the document.
        //document.save('EJ2_38403_draw_arc14.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38403_draw_arc14.pdf');
            }
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
describe('PdfArc.ts', () => {
    describe('Constructor initializing',()=> {
        
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();

        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let bounds : RectangleF = new RectangleF(0, 0, 200, 100);
        //Create new PDF Arc.
        let arc : PdfArc = new PdfArc(pen, bounds, 0, 180);
        let arc1 : PdfArc = new PdfArc();
        arc1.x = 0;
        arc1.y = 0;
        arc1.width = 200;
        arc1.height = 100;
        arc1.startAngle = 0;
        arc1.sweepAngle = 180;
        let arc2 : PdfArc = new PdfArc(pen, 0, 0, 200, 100, 0, 180);
        let x: number = arc2.x;
        let y : number = arc2.y;
        let width : number = arc2.width;
        let height : number = arc2.height;
        it('-AddArc() method graphics helper calling)', () => {
             expect(function (): void {arc.drawGraphicsHelper(null,  new PointF(0,0)); }).toThrowError();
        })
        it('-AddArc() Draw  internal calling)', () => {
            expect(function (): void {arc.drawInternal(null); }).toThrowError();        
        }) 
    })
})
