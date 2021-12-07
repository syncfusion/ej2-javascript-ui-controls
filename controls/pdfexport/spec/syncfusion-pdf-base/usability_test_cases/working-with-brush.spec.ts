/**
 * spec document for Main.ts class
 */
import { PdfDocument, PdfPage, PdfStandardFont,PdfColorSpace, PdfTrueTypeFont, PdfGraphics, SizeF, PdfDictionary} from './../../../src/index';
import { PdfSolidBrush, PdfColor, PdfFont,PointF, PdfFontFamily, PdfStringFormat , PdfSampledFunction} from './../../../src/index';
import { RectangleF, Rectangle,PdfPen, PdfGraphicsState, PdfFontStyle,PdfPath,GetResourceEventHandler, PdfTextAlignment, PdfColorBlend, PdfBlend, PdfFunction} from './../../../src/index';
import { PdfLinearGradientBrush } from '../../../src/implementation/graphics/brushes/pdf-linear-gradient-brush';
import { PdfLinearGradientMode, PdfExtend} from '../../../src/implementation/graphics/brushes/enum';
import { Utils } from './../utils.spec';
import { PdfTilingBrush } from '../../../src/implementation/graphics/brushes/pdf-tiling-brush';
import { PdfRadialGradientBrush } from '../../../src/implementation/graphics/brushes/pdf-radial-gradient-brush';
import { PdfBoolean } from '../../../src/implementation/primitives/pdf-boolean';

describe('UTC-01: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100), color1, color2);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_01.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_01.pdf');
            }
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

describe('UTC-02: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes2', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
         // set pen
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Create new PDF path.
      let path : PdfPath = new PdfPath();
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
    
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100),  color1, color2);
        graphics.drawPath(pen, brush1,path);
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_02.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_02.pdf');
            }
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


describe('UTC-03: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes3', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100), color1, color2);
        graphics.drawRectangle(pen,brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_03.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_03.pdf');
            }
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
describe('UTC-04: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100),  color1, color2);
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, brush1, 0, 0, null);
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_04.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_04.pdf');
            }
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
describe('UTC-05: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, PdfLinearGradientMode.Vertical);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_05.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_05.pdf');
            }
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
describe('UTC-06: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes6', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, 90);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_06.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_06.pdf');
            }
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
describe('UTC-07: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes7', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, 180);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_07.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_07.pdf');
            }
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

describe('UTC-08: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes8', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, 270);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_08.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_08.pdf');
            }
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
describe('UTC-09: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes9', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, 0);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_09.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_09.pdf');
            }
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


describe('UTC-10: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes10', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, 210);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38407_Linear_brush_10.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_10.pdf');
            }
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

describe('UTC-11: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes_11', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100),color1, color2);
        //Create PDF blend
         let blend : PdfBlend= new PdfBlend();
         //Set factors
         blend.factors = [1];
         //Set poistions
         blend.positions = [0];
         //Set blend to the brush.
         brush1.blend = blend; 
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
        //document.save('EJ2_38407_Linear_brush_11.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_11.pdf');
            }
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
describe('UTC-12: Working with Linear brushes', () => {
    it('-EJ2-38407 Drawing Linear gradient brushes_12', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100),color1, color2);
        let cblend: PdfColorBlend = new PdfColorBlend();
        // Set colors
        cblend.colors = [color1, color2];
        // Set poistions
        cblend.positions = [0,1];
        // Set internpolation colors to the brush.
        brush1.interpolationColors = cblend;
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
        //document.save('EJ2_38407_Linear_brush_12.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38407_Linear_brush_12.pdf');
            }
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

describe('PdfLinearGradientBrush.ts', () => {
    describe('Constructor initializing',()=> {
        
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new PointF(0, 0), new PointF(200, 100),color1, color2);
        brush1.extend = PdfExtend.Both;
        brush1.antiAlias = true;
        let bool : boolean = brush1.antiAlias;
        let rect : Rectangle = brush1.rectangle;
        let blend : PdfBlend= new PdfBlend(1);
        //Set factors
        blend.factors = [1];
        //Set poistions
        blend.positions = [0];
        //Set blend to the brush.
        brush1.blend = blend; 
        let b1 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, PdfLinearGradientMode.ForwardDiagonal);
        let b2 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, PdfLinearGradientMode.BackwardDiagonal);
        let b3 : PdfLinearGradientBrush = new PdfLinearGradientBrush(new Rectangle(0, 0,200, 100),color1, color2, PdfLinearGradientMode.Horizontal);
        
        //Create new PDF path.
        let ppath : PdfPath = new PdfPath();
        it('-PdfLinearGradientBrush() method calling)', () => {
            expect(function (): void {b1.blend = null; }).toThrowError();
        })
        it('-PdfLinearGradientBrush() linearColors calling)', () => {
            let startColor : PdfColor = new PdfColor(0,0,0);
            
            //Set linear colors.
            
            let colors : PdfColor[] = b1.linearColors;
            expect(function (): void {b1.linearColors = [ startColor ]; }).toThrowError();       
        })
        it('-PdfLinearGradientBrush() liner calling)', () => {
            expect(function (): void {b1.linearColors = null; }).toThrowError();        
        })
        it('-PdfLinearGradientBrush() blend calling)', () => {
            expect(function (): void {b1.blend = null; }).toThrowError();        
        })
        
        path.pen = pen;
 
    })
});

//PdfRadialGradientBrush
describe('UTC-01: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38408_radial_brush_01.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_01.pdf');
            }
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

describe('UTC-02: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes2', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
         // set pen
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Create new PDF path.
      let path : PdfPath = new PdfPath();
      //Add line path points.
      path.addLine(new PointF(10, 100), new PointF(10, 200));
      path.addLine(new PointF(100, 100), new PointF(100, 200));
      path.addLine(new PointF(100, 200), new PointF(55, 150));
    
      let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
      graphics.drawPath(pen, brush1,path);
        //Save the document.
       //document.save('EJ2_38408_radial_brush_02.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_02.pdf');
            }
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


describe('UTC-03: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes3', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        graphics.drawRectangle(pen,brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38408_radial_brush_03.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_03.pdf');
            }
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
describe('UTC-04: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, brush1, 0, 0, null);
        //Save the document.
       //document.save('EJ2_38408_radial_brush_04.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_04.pdf');
            }
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
describe('UTC-05: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes5', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
         // set the font
         let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
         // draw the text
         page1.graphics.drawString('Hello World Radial brush!!!', font, null, brush1, 0, 0, null); 
        //Save the document.
       //document.save('EJ2_38408_radial_brush_05.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_05.pdf');
            }
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
describe('UTC-06: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes6', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        graphics.drawRectangle( brush1, 100, 100, 200, 100);  
        //Save the document.
       //document.save('EJ2_38408_radial_brush_06.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_06.pdf');
            }
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

describe('UTC-7: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes_7', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        //Create PDF blend
         let blend : PdfBlend= new PdfBlend();
         //Set factors
         blend.factors = [1];
         //Set poistions
         blend.positions = [0];
         //Set blend to the brush.
         brush1.blend = blend; 
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38408_radial_brush_7.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_7.pdf');
            }
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
describe('UTC-08: Working with radial brushes', () => {
    it('-EJ2-38408 Drawing Radial gradient brushes_8', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        // set pen
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        let cblend: PdfColorBlend = new PdfColorBlend();
        // Set colors
        cblend.colors = [color1, color2];
        // Set poistions
        cblend.positions = [0,1];
        // Set internpolation colors to the brush.
        brush1.interpolationColors = cblend;
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38408_radial_brush_8.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38408_radial_brush_8.pdf');
            }
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
describe('PdfRadialGradientBrush.ts', () => {
    describe('Constructor initializing',()=> {
        // create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        // add a page to the document.
        let page1 : PdfPage = document.pages.add();
        let graphics :  PdfGraphics = page1.graphics;
        let color1 : PdfColor = new PdfColor(255, 123, 0);
        let color2 : PdfColor = new PdfColor(0, 255, 255);
        //Create new PDF path.
        let path : PdfPath = new PdfPath();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        let brush1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        brush1.extend = PdfExtend.Both;
        brush1.rectangle = new RectangleF ( 0, 0, 200, 100);
        let rect : RectangleF = brush1.rectangle;
        let blend : PdfBlend= new PdfBlend(1);
        //Set factors
        blend.factors = [1];
        //Set poistions
        blend.positions = [0];
        //Set blend to the brush.
        brush1.blend = blend; 
        let startColor : PdfColor = new PdfColor(0,0,0);
        let endColor : PdfColor= new PdfColor(0,255,0);
        //Clone the existing linear brush.
        let cBrush : PdfRadialGradientBrush  = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        //Set linear colors.
        cBrush.linearColors = [ startColor, endColor ];
        cBrush.stroking = true;
        let stroke : boolean = cBrush.stroking;
        let stroke1 : PdfBoolean = new PdfBoolean(true);
        
        //Draw rectangle.
        
        let resources : GetResourceEventHandler;
        let value : PdfColorSpace =  PdfColorSpace.GrayScale;
        //Create new PDF path.
        let b1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 0, new PointF(50, 50), 50, color1, color2);
        
        it('-PdfRadialGradientBrush() constructor calling)', () => {
            expect(function (): void { let b1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), -10, new PointF(50, 50), 50, color1, color2);
             }).toThrowError();      
       })
       it('-PdfRadialGradientBrush() constructor calling1 )', () => {
        expect(function (): void { let b1 : PdfRadialGradientBrush = new PdfRadialGradientBrush(new PointF(50, 50), 10, new PointF(50, 50), -50, color1, color2);
         }).toThrowError();      
       })
       it('-PdfRadialGradientBrush() method calling1 )', () => {
        expect(function (): void {b1.blend = null; }).toThrowError();
    })
    it('-PdfRadialGradientBrush() method calling2 )', () => {
        expect(function (): void {b1.interpolationColors = null; }).toThrowError();
    })
    it('-PdfRadialGradientBrush() linearColors calling)', () => {
        let startColor : PdfColor = new PdfColor(0,0,0);
        
        //Set linear colorss
        let colors : PdfColor[] = b1.linearColors;
        expect(function (): void {b1.linearColors = [ startColor ]; }).toThrowError();       
    })
    it('-PdfRadialGradientBrush() linear calling)', () => {
        expect(function (): void {b1.linearColors = null; }).toThrowError();        
    })
    it('-PdfRadialGradientBrush() blend calling)', () => {
        expect(function (): void {b1.blend = null; }).toThrowError();        
    })
        b1.rectangle = new RectangleF(0,0,350, 200);
 
    })
});
//PdfTilingBrush
describe('UTC-01: Working with Tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new Rectangle(0, 0, 11, 11));
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);  
        //Save the document.
       //document.save('EJ2_38409_Tiling_brush_01.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_01.pdf');
            }
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

describe('UTC-02: Working with Tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes2', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        document.colorSpace = PdfColorSpace.GrayScale;
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new Rectangle(0, 0, 11, 11), page1);
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100); 
        //Save the document.
       //document.save('EJ2_38409_Tiling_brush_02.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_02.pdf');
            }
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


describe('UTC-03: Working with tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes3', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new SizeF(11,11));
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);
        //Save the document.
       //document.save('EJ2_38409_Tiling_brush_03.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_03.pdf');
            }
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
describe('UTC-04: Working with tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes4', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        document.colorSpace = PdfColorSpace.GrayScale;
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new SizeF(11,11), page1);
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);
       //document.save('EJ2_38409_Tiling_brush_04.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_04.pdf');
            }
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
describe('UTC-05: Working with Tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes5', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new Rectangle(0, 0, 21, 21));
        brush1.graphics.drawRectangle(pen, 0, 0, 20, 20);
        let smallestCellBounds : Rectangle = brush1.rectangle;
        let smallestCellSize : SizeF= brush1.size;
        graphics.drawRectangle( brush1, 100, 100, 200, 100);  
        //Save the document.
       //document.save('EJ2_38409_Tiling_brush_05.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_05.pdf');
            }
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
describe('UTC-06: Working with Tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes6', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new SizeF(11,11));
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);
        let cBrush : PdfTilingBrush = brush1.clone() as PdfTilingBrush;
        /// //Draw rectangle.
        graphics.drawRectangle(cBrush, 0, 150, 100, 100);
        //Save the document.
       //document.save('EJ2_38409_Tiling_brush_06.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_06.pdf');
            }
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
describe('UTC-07: Working with tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes7', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        document.colorSpace = PdfColorSpace.GrayScale;
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new SizeF(11,11), page1);
        //Create new PDF path.
        let path : PdfPath = new PdfPath(brush1);
        //Add line path points.
        path.addLine(new PointF(10, 100), new PointF(10, 200));
        path.addLine(new PointF(100, 100), new PointF(100, 200));
        path.addLine(new PointF(100, 200), new PointF(55, 150));
        //Draw PDF path to page.
        path.draw(page1, new PointF(0, 0));
        //document.save('EJ2_38409_Tiling_brush_07.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_07.pdf');
            }
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
describe('UTC-08: Working with tiling brushes', () => {
    it('-EJ2-38409 Drawing Tiling brushes8', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        document.colorSpace = PdfColorSpace.Cmyk;
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();    
        let graphics :  PdfGraphics = page1.graphics;
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        // set pen
        let brush1 : PdfTilingBrush = new PdfTilingBrush(new SizeF(11,11), page1);
        brush1.graphics.drawRectangle(pen, 0, 0, 10, 10);
        graphics.drawRectangle( brush1, 0, 0, 200, 100);
        //document.save('EJ2_38409_Tiling_brush_08.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38409_Tiling_brush_08.pdf');
            }
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
describe('PdfTilingBrush.ts', () => {
    describe('Constructor initializing',()=> {
        let b1 : PdfTilingBrush = new PdfTilingBrush(new Rectangle(0, 0, 11, 11));
        b1.stroking = true;
        let stroke : boolean = b1.stroking;
        let resources : GetResourceEventHandler;
        let value : PdfColorSpace.Rgb;
        let value1 : PdfColor = new PdfColor(255, 0, 0);
        value1.c = 1;
        value1.m = 1;
        value1.y = 1;
        value1.k = 1;
        let Kvalue : number =  value1.k;
        let value2 : PdfColor = new PdfColor(255, 0, 0);
        value2.c = 0;
        value2.m = 0;
        value2.y = 0;
        value2.k = 0;
        let value3 : PdfColor = new PdfColor(255, 0, 0);
        value3.c = 2;
        value3.m = 2;
        value3.y = 2;
        value3.k = 2;
        let value4 : PdfColor = new PdfColor(255, 0, 0);
        value4.c = -2;
        value4.m = -2;
        value4.y = -2;
        value4.k = -2;
        let brush : PdfSolidBrush = null;
        it('-this.monitorChanges(PdfBrush, PdfStreamWriter,GetResourceEventHandler,boolean, PdfColorSpace) method calling', () => {
            expect(function (): void {b1.monitorChanges(null, null, resources, true, value); }).toThrowError();
        })
       
    })
});