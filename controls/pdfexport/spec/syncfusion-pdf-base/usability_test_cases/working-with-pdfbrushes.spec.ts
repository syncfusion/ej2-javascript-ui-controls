/**
 * spec document for Main.ts class
 */
import { PdfDocument, PdfPage, PdfStandardFont, PdfTrueTypeFont, PdfGraphics } from './../../../src/index';
import { PdfSolidBrush, PdfColor, PdfFont,PointF, PdfFontFamily, PdfStringFormat } from './../../../src/index';
import { RectangleF, PdfPen, PdfGraphicsState, PdfFontStyle, PdfTextAlignment, PdfBrush, Dictionary} from './../../../src/index';
import { Utils } from './../utils.spec';
import { PdfBrushes} from './../../../src/implementation/graphics/brushes/pdf-brushes';
import { KnownColor} from './../../../src/implementation/graphics/brushes/enum';
describe('UTC-01: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes1', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        let page3 : PdfPage = document.pages.add();
        let page4 : PdfPage = document.pages.add();
        let page5 : PdfPage = document.pages.add();
        //Draw rectangle page1 
        page1.graphics.drawRectangle(PdfBrushes.AliceBlue, 0, 0, 200, 50);
        page1.graphics.drawRectangle(PdfBrushes.AntiqueWhite, 0, 150, 200, 50);
        page1.graphics.drawRectangle(PdfBrushes.Aqua, 0, 300, 200, 50);
        page1.graphics.drawRectangle(PdfBrushes.Aquamarine, 0, 450, 200 , 50);
        //Draw rectangele page2
        page2.graphics.drawRectangle(PdfBrushes.Azure, 0, 0, 200, 50);
        page2.graphics.drawRectangle(PdfBrushes.Beige, 0, 150, 200, 50);
        page2.graphics.drawRectangle(PdfBrushes.Bisque, 0, 300, 200, 50);
        page2.graphics.drawRectangle(PdfBrushes.Black, 0, 450, 200 , 50);
        //Draw rectangele page3
        page3.graphics.drawRectangle(PdfBrushes.BlanchedAlmond, 0, 0, 200, 50);
        page3.graphics.drawRectangle(PdfBrushes.Blue, 0, 150, 200, 50);
        page3.graphics.drawRectangle(PdfBrushes.BlueViolet, 0, 300, 200, 50);
        page3.graphics.drawRectangle(PdfBrushes.Brown, 0, 450, 200 , 50);
        //Draw rectangele page4
        page4.graphics.drawRectangle(PdfBrushes.BurlyWood, 0, 0, 200, 50);
        page4.graphics.drawRectangle(PdfBrushes.CadetBlue, 0, 150, 200, 50);
        page4.graphics.drawRectangle(PdfBrushes.Chartreuse, 0, 300, 200, 50);
        page4.graphics.drawRectangle(PdfBrushes.Chocolate, 0, 450, 200 , 50);
        //Draw rectangele page5
        page5.graphics.drawRectangle(PdfBrushes.Coral, 0, 0, 200, 50);
        page5.graphics.drawRectangle(PdfBrushes.CornflowerBlue, 0, 150, 200, 50);
        page5.graphics.drawRectangle(PdfBrushes.Cornsilk, 0, 300, 200, 50);
        page5.graphics.drawRectangle(PdfBrushes.Crimson, 0, 450, 200 , 50);
        //Save the document.
        //document.save('EJ2_38410_Drawing_with_brushes_1.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_1.pdf');
            }
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
describe('UTC-02: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes2', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.Cyan, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.DarkBlue, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.DarkCyan, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.DarkGoldenrod, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.DarkGray, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.DarkGreen, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.DarkKhaki, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.DarkMagenta, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.DarkOliveGreen, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.DarkOrange, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.DarkOrchid, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.DarkRed, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.DarkSalmon, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.DarkSeaGreen, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.DarkSlateBlue, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.DarkSlateGray, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.DarkTurquoise, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.DarkViolet, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.DeepPink, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.DeepSkyBlue, 0, 450, 200 , 50);
         //Save the document. 
        //document.save('EJ2_38410_Drawing_with_brushes_2.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_2.pdf');
            }
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

describe('UTC-03: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes3', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.DimGray, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.DodgerBlue, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.Firebrick, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.FloralWhite, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.ForestGreen, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.Fuchsia, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.Gainsboro, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.GhostWhite, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.Gold, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Goldenrod, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Gray, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Green, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.GreenYellow, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Honeydew, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.HotPink, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.IndianRed, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.Indigo, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Ivory, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Khaki, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Lavender, 0, 450, 200 , 50);
         //Save the document. 
        //document.save('EJ2_38410_Drawing_with_brushes_3.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_3.pdf');
            }
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

describe('UTC-04: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes4', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.LavenderBlush, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.LawnGreen, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.LemonChiffon, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.LightBlue, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.LightCoral, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.LightCyan, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.LightGoldenrodYellow, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.LightGray, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.LightGreen, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.LightPink, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.LightSalmon, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.LightSeaGreen, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.LightSkyBlue, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.LightSlateGray, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.LightSteelBlue, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.LightYellow, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.Lime, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.LimeGreen, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Linen, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Magenta, 0, 450, 200 , 50);
         //Save the document.
 
        //document.save('EJ2_38410_Drawing_with_brushes_4.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_4.pdf');
            }
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

describe('UTC-05: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes5', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.Maroon, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.MediumAquamarine, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.MediumBlue, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.MediumOrchid, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.MediumPurple, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.MediumSeaGreen, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.MediumSlateBlue, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.MediumSpringGreen, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.MediumTurquoise, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.MediumVioletRed, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.MidnightBlue, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.MintCream, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.MistyRose, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Moccasin, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.NavajoWhite, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Navy, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.OldLace, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Olive, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.OliveDrab, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Orange, 0, 450, 200 , 50);
         //Save the document.
 
        //document.save('EJ2_38410_Drawing_with_brushes_5.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_5.pdf');
            }
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

describe('UTC-06: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes6', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.OrangeRed, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.Orchid, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.PaleGoldenrod, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.PaleGreen, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.PaleTurquoise, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.PaleVioletRed, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.PapayaWhip, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.PeachPuff, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.Peru, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Pink, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Plum, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.PowderBlue, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.Purple, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Red, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.RosyBrown, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.RoyalBlue, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.SaddleBrown, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Salmon, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.SandyBrown, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.SeaGreen, 0, 450, 200 , 50);
         //Save the document.

        //document.save('EJ2_38410_Drawing_with_brushes_6.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_6.pdf');
            }
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

describe('UTC-07: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes7', (done) => {
         // create a new PDF document
         let document : PdfDocument = new PdfDocument();
         // add pages to the document.
         let page1 : PdfPage = document.pages.add();
         let page2 : PdfPage = document.pages.add();
         let page3 : PdfPage = document.pages.add();
         let page4 : PdfPage = document.pages.add();
         let page5 : PdfPage = document.pages.add();
         //Draw rectangle page1 
         page1.graphics.drawRectangle(PdfBrushes.SeaShell, 0, 0, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.Sienna, 0, 150, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.Silver, 0, 300, 200, 50);
         page1.graphics.drawRectangle(PdfBrushes.SkyBlue, 0, 450, 200 , 50);
         //Draw rectangele page2
         page2.graphics.drawRectangle(PdfBrushes.SlateBlue, 0, 0, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.SlateGray, 0, 150, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.Snow, 0, 300, 200, 50);
         page2.graphics.drawRectangle(PdfBrushes.SpringGreen, 0, 450, 200 , 50);
         //Draw rectangele page3
         page3.graphics.drawRectangle(PdfBrushes.SteelBlue, 0, 0, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Tan, 0, 150, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Teal, 0, 300, 200, 50);
         page3.graphics.drawRectangle(PdfBrushes.Thistle, 0, 450, 200 , 50);
         //Draw rectangele page4
         page4.graphics.drawRectangle(PdfBrushes.Tomato, 0, 0, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Transparent, 0, 150, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Turquoise, 0, 300, 200, 50);
         page4.graphics.drawRectangle(PdfBrushes.Violet, 0, 450, 200 , 50);
         //Draw rectangele page5
         page5.graphics.drawRectangle(PdfBrushes.Wheat, 0, 0, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.White, 0, 150, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.WhiteSmoke, 0, 300, 200, 50);
         page5.graphics.drawRectangle(PdfBrushes.Yellow, 0, 450, 200 , 50);
         page5.graphics.drawRectangle(PdfBrushes.YellowGreen, 0, 550, 200 , 50);
         //Save the document. 
        //document.save('EJ2_38410_Drawing_with_brushes_7.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_7.pdf');
            }
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
describe('UTC-08: Working with PdfBrushes', () => {
    it('-EJ2-38410 Drawing PdfBrushes8', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
        //Draw rectangle page1 
        page1.graphics.drawRectangle(pen,PdfBrushes.Transparent, 0, 0, 200, 50);
        
        //Save the document.
        //document.save('EJ2_38410_Drawing_with_brushes_8.pdf');
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2_38410_Drawing_with_brushes_8.pdf');
            }
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
describe('PdfBrushes.ts', () => {
    describe('Constructor initializing',()=> {
        let brushes : PdfBrushes = new PdfBrushes();
        let brush : PdfBrush = PdfBrushes.AliceBlue;
         
        brush = PdfBrushes.AntiqueWhite;
         
        brush = PdfBrushes.Aqua;
         
        brush = PdfBrushes.Aquamarine;
               
        brush = PdfBrushes.Azure;
         
        brush = PdfBrushes.Beige;
         
        brush = PdfBrushes.Bisque;
         
        brush = PdfBrushes.Black;
         
        brush = PdfBrushes.BlanchedAlmond;
        
        brush = PdfBrushes.Blue;
     
        brush = PdfBrushes.BlueViolet;
       
        brush = PdfBrushes.Brown;
         
        brush = PdfBrushes.BurlyWood;

        brush = PdfBrushes.CadetBlue;

        brush = PdfBrushes.Chartreuse;

        brush = PdfBrushes.Chocolate;
        
        brush = PdfBrushes.Coral;
     
        brush = PdfBrushes.CornflowerBlue;

        brush = PdfBrushes.Cornsilk;
    
        brush = PdfBrushes.Crimson;

               
         brush = PdfBrushes.Cyan;

         brush = PdfBrushes.DarkBlue;

         brush = PdfBrushes.DarkCyan;

         brush = PdfBrushes.DarkGoldenrod;

          
         brush = PdfBrushes.DarkGray;

         brush = PdfBrushes.DarkGreen;

         brush = PdfBrushes.DarkKhaki;
 
         brush = PdfBrushes.DarkMagenta;
    
          
         brush = PdfBrushes.DarkOliveGreen;
      
         brush = PdfBrushes.DarkOrange;
         
         brush = PdfBrushes.DarkOrchid;
         
         brush = PdfBrushes.DarkRed;

 
         brush = PdfBrushes.DarkSalmon;
 
         brush = PdfBrushes.DarkSeaGreen;

         brush = PdfBrushes.DarkSlateBlue;
     
         brush = PdfBrushes.DarkSlateGray;
      
          
         brush = PdfBrushes.DarkTurquoise
        
         brush = PdfBrushes.DarkViolet

         brush = PdfBrushes.DeepPink;

         brush = PdfBrushes.DeepSkyBlue;

         
         brush   = PdfBrushes.DimGray;
          
         brush = PdfBrushes.DodgerBlue;
       
         brush = PdfBrushes.Firebrick;
      
         brush = PdfBrushes.FloralWhite;
          
         brush = PdfBrushes.ForestGreen;

         brush = PdfBrushes.Fuchsia;
 
         brush = PdfBrushes.Gainsboro;

         brush = PdfBrushes.GhostWhite;
          
         brush = PdfBrushes.Gold;
 
         brush = PdfBrushes.Goldenrod;

         brush = PdfBrushes.Gray;

         brush = PdfBrushes.Green;
     
         brush = PdfBrushes.GreenYellow;

         brush = PdfBrushes.Honeydew;

         brush = PdfBrushes.HotPink;

         brush = PdfBrushes.IndianRed;
          
         brush = PdfBrushes.Indigo;
         brush = PdfBrushes.Ivory;
         brush = PdfBrushes.Khaki;
         brush = PdfBrushes.Lavender;
    
         brush = PdfBrushes.LavenderBlush;
          
         brush = PdfBrushes.LawnGreen;
         brush = PdfBrushes.LemonChiffon;
         brush = PdfBrushes.LightBlue;
          
         brush = PdfBrushes.LightCoral;
         brush = PdfBrushes.LightCyan;
         brush = PdfBrushes.LightGoldenrodYellow;
         brush = PdfBrushes.LightGray;
          
         brush = PdfBrushes.LightGreen;
         brush = PdfBrushes.LightPink;
         brush = PdfBrushes.LightSalmon;
         brush = PdfBrushes.LightSeaGreen;
          
         brush = PdfBrushes.LightSkyBlue;
         brush = PdfBrushes.LightSlateGray;
         brush = PdfBrushes.LightSteelBlue;
         brush = PdfBrushes.LightYellow;
          
         brush = PdfBrushes.Lime;
         brush = PdfBrushes.LimeGreen;
         brush = PdfBrushes.Linen;
         brush = PdfBrushes.Magenta;
        
         brush  = PdfBrushes.Maroon;
         brush = PdfBrushes.MediumAquamarine;
         brush = PdfBrushes.MediumBlue;
         brush = PdfBrushes.MediumOrchid;
          
         brush = PdfBrushes.MediumPurple;
         brush = PdfBrushes.MediumSeaGreen;
         brush = PdfBrushes.MediumSlateBlue;
         brush = PdfBrushes.MediumSpringGreen;
          
         brush = PdfBrushes.MediumTurquoise;
         brush = PdfBrushes.MediumVioletRed;
         brush = PdfBrushes.MidnightBlue;
          
         brush = PdfBrushes.MintCream;
        
         brush = PdfBrushes.MistyRose;
          
         brush = PdfBrushes.Moccasin;
         brush = PdfBrushes.NavajoWhite;
         brush = PdfBrushes.Navy;
          
         brush = PdfBrushes.OldLace;
         brush = PdfBrushes.Olive;
         brush = PdfBrushes.OliveDrab;
         brush = PdfBrushes.Orange;
         brush  = PdfBrushes.OrangeRed;
         brush = PdfBrushes.Orchid;
         brush = PdfBrushes.PaleGoldenrod;
         brush = PdfBrushes.PaleGreen;
         brush = PdfBrushes.PaleTurquoise;
         brush = PdfBrushes.PaleVioletRed;
         brush = PdfBrushes.PapayaWhip;
         brush = PdfBrushes.PeachPuff;
         brush = PdfBrushes.Peru;
         brush = PdfBrushes.Pink;
         brush = PdfBrushes.Plum;
         brush = PdfBrushes.PowderBlue;
         brush = PdfBrushes.Purple;
         brush = PdfBrushes.Red;
         brush = PdfBrushes.RosyBrown;
         brush = PdfBrushes.RoyalBlue;
         brush = PdfBrushes.SaddleBrown;
         brush = PdfBrushes.Salmon;
         brush = PdfBrushes.SandyBrown;
         brush = PdfBrushes.SeaGreen;
         brush = PdfBrushes.SeaShell;
         brush = PdfBrushes.Sienna;
         brush = PdfBrushes.Silver;
         brush = PdfBrushes.SkyBlue;
         brush = PdfBrushes.SlateBlue;
         brush = PdfBrushes.SlateGray;
         brush = PdfBrushes.Snow;
         brush = PdfBrushes.SpringGreen;
         brush = PdfBrushes.SteelBlue;
         brush = PdfBrushes.Tan;
         brush = PdfBrushes.Teal;
         brush = PdfBrushes.Thistle;
         brush = PdfBrushes.Tomato;
         brush = PdfBrushes.Transparent;
         brush = PdfBrushes.Turquoise;
         brush = PdfBrushes.Violet;
         brush = PdfBrushes.Wheat;
         brush = PdfBrushes.White;
         brush = PdfBrushes.WhiteSmoke;
         brush = PdfBrushes.Yellow;
         brush = PdfBrushes.YellowGreen;
       
    })
})