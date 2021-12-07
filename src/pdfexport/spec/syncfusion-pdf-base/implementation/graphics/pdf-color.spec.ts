/**
 * spec document for PdfColor.ts class
 */
import { PdfColorSpace, PdfDocument, PdfGraphics, PdfPage, PdfStandardFont, PdfFontFamily, PdfColor, PdfSolidBrush, PdfGraphicsState } from "../../../../src/index";
import { Utils } from '../../utils.spec';

describe('PdfColor.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfColor = new PdfColor(240, 250, 250, 100);
        it('-Set gray >1', () => {
            t1.gray = 50;
            expect(t1.gray).toEqual(1);
        })
        it('-Set gray <1', () => {
            t1.gray = -5;
            expect(t1.gray).toEqual(0);
        })
        it('-Set gray == 0', () => {
            t1.gray = 0;
            expect(t1.gray).toEqual(0);
        })
        it('-Set a >=0', () => {
            t1.a = 50;
            expect(t1.a).toEqual(50);
        })
        it('-Set a <0', () => {
            t1.a = -5;
            expect(t1.a).toEqual(0);
        })
        it('-ToString(PdfColorSpace.Cmyk, false) != Undefined', () => {
            expect(t1.toString(PdfColorSpace.Cmyk, false)).not.toBeUndefined();
        })

        let t2 : PdfColor = new PdfColor(t1);
        it('-Check empty PdfColor overload', () => {
            expect(t2.isEmpty).toEqual(false);
        })

        let emptyColor : PdfColor;
        let t3 : PdfColor = new PdfColor(emptyColor);
        it('-Check empty - overload emptyColor', () => {
            expect(t3.isEmpty).toEqual(true);
        })

        let t4 : PdfColor = new PdfColor();
        it('-Check empty - overload', () => {
            expect(t4.isEmpty).toEqual(true);
        })
        
        let emptyNumber : number;
        let t5 : PdfColor = new PdfColor(emptyNumber, 100, 100);
        it('-Check empty - emptyNumber overload', () => {
            expect(t5.isEmpty).toEqual(true);
        })
        let t6 : PdfColor = new PdfColor(100, emptyNumber, 100);
        it('-Check empty - emptyNumber overload', () => {
            expect(t6.isEmpty).toEqual(true);
        })
        let t7 : PdfColor = new PdfColor(100, 100, emptyNumber);
        it('-Check empty - emptyNumber overload', () => {
            expect(t7.isEmpty).toEqual(true);
        })
        let t8 : PdfColor = new PdfColor(100, 100, 100);
        it('-Check number, number, number - overload', () => {
            expect(t8.isEmpty).toEqual(false);
        })

        let t9 : PdfColor = new PdfColor(emptyNumber, 100, 100, 100);
        it('-Check undefined, number, number, number - overload', () => {
            expect(t9.isEmpty).toEqual(false);
        })
        let t10 : PdfColor = new PdfColor(100, emptyNumber, 100, 100);
        it('-Check empty - emptyNumber overload', () => {
            expect(t10.isEmpty).toEqual(true);
        })
        let t11 : PdfColor = new PdfColor(100, 100, emptyNumber, 100);
        it('-Check empty - emptyNumber overload', () => {
            expect(t11.isEmpty).toEqual(true);
        })
        let t12 : PdfColor = new PdfColor(100, 100, 100, emptyNumber);
        it('-Check number, number, number, undefined - overload', () => {
            expect(t12.isEmpty).toEqual(false);
        })
        let t13 : PdfColor = new PdfColor(100, 100, 100, 100);
        it('-Check number, number, number, number - overload', () => {
            expect(t13.isEmpty).toEqual(false);
        })
    })
})
describe('Manual testing',()=>{
    it('-Empty color with graphic state', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let emptyColor : PdfColor = new PdfColor();
        let emptyBrush : PdfSolidBrush = new PdfSolidBrush(emptyColor);
        graphics.drawRectangle(emptyBrush, 10, 50, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 10, null);
        let state : PdfGraphicsState = graphics.save();
        let redColor : PdfColor = new PdfColor(255, 0, 0);
        let redBrush : PdfSolidBrush = new PdfSolidBrush(redColor);
        graphics.drawRectangle(redBrush, 10, 150, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, redBrush, 10, 100, null);
        graphics.drawRectangle(emptyBrush, 10, 250, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 200, null);
        graphics.restore(state);
        graphics.drawRectangle(emptyBrush, 10, 350, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 300, null);
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EmptyColorWithGraphicState.pdf');
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
    it('-Empty color', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let emptyColor : PdfColor = new PdfColor();
        let emptyBrush : PdfSolidBrush = new PdfSolidBrush(emptyColor);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 10, null);
        graphics.drawRectangle(emptyBrush, 10, 10, 100, 20);
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EmptyColor.pdf');
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
    it('-Red With Empty Color', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let redColor : PdfColor = new PdfColor(255, 0, 0);
        let redBrush : PdfSolidBrush = new PdfSolidBrush(redColor);
        let emptyColor : PdfColor = new PdfColor();
        let emptyBrush : PdfSolidBrush = new PdfSolidBrush(emptyColor);
        graphics.drawRectangle(redBrush, 10, 50, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 10, null);
        graphics.drawRectangle(emptyBrush, 10, 150, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 100, 10, null);
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RedWithEmptyColor.pdf');
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
    it('-Empty color - multiple page', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let emptyColor : PdfColor = new PdfColor();
        let emptyBrush : PdfSolidBrush = new PdfSolidBrush(emptyColor);
        graphics.drawRectangle(emptyBrush, 10, 50, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 10, null);
        let state : PdfGraphicsState = graphics.save();
        let redColor : PdfColor = new PdfColor(255, 0, 0);
        let redBrush : PdfSolidBrush = new PdfSolidBrush(redColor);
        graphics.drawRectangle(redBrush, 10, 150, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, redBrush, 10, 100, null);
        graphics.drawRectangle(emptyBrush, 10, 250, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 200, null);
        graphics.restore(state);
        graphics.drawRectangle(emptyBrush, 10, 350, 100, 20);
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 300, null);
        let secondPage : PdfPage = document.pages.add();
        secondPage.graphics.drawRectangle(emptyBrush, 10, 50, 100, 20);
        secondPage.graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 10, null);
        let graphicsState : PdfGraphicsState = secondPage.graphics.save();
        secondPage.graphics.drawRectangle(redBrush, 10, 150, 100, 20);
        secondPage.graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, redBrush, 10, 100, null);
        secondPage.graphics.drawRectangle(emptyBrush, 10, 250, 100, 20);
        secondPage.graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 200, null);
        secondPage.graphics.restore(graphicsState);
        secondPage.graphics.drawRectangle(emptyBrush, 10, 350, 100, 20);
        secondPage.graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, emptyBrush, 10, 300, null);
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EmptyColorWithMultiplePage.pdf');
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
    it('-Overload test', (done) => {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let emptyNumber : number;
        let emptyPdfColor : PdfColor;
        let emptyColor : PdfColor = new PdfColor(200, emptyNumber, emptyNumber);
        let emptyBrush : PdfSolidBrush = new PdfSolidBrush(emptyColor);
        let redColor : PdfColor = new PdfColor(255, 0, 0);
        let redBrush : PdfSolidBrush = new PdfSolidBrush(redColor);
        //empty constructor
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor()), 10, 10, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor()), 10, 50, 100, 20);
        //PdfColor is undefined
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(emptyPdfColor)), 210, 10, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(emptyPdfColor)), 210, 50, 100, 20);
        //undefined-number-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(emptyNumber, 255, 255)), 10, 100, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(emptyNumber, 255, 255)), 10, 150, 100, 20);
        //number-undefined-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, emptyNumber, 255)), 10, 200, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, emptyNumber, 255)), 10, 250, 100, 20);
        //number-number-undefined
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, 255, emptyNumber)), 10, 300, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, 255, emptyNumber)), 10, 350, 100, 20);
        //number-number-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, 0, 0)), 10, 400, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, 0, 0)), 10, 450, 100, 20);
        //undefined-number-number-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(emptyNumber, 255, 0, 255)), 210, 100, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(emptyNumber, 255, 0, 255)), 210, 150, 100, 20);
        //number-undefined-number-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, emptyNumber, 255, 255)), 210, 200, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, emptyNumber, 255, 255)), 210, 250, 100, 20);
        //number-number-undefined-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, 255, emptyNumber, 255)), 210, 300, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, 255, emptyNumber, 255)), 210, 350, 100, 20);
        //number-number-number-undefined
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(255, 255, 0, emptyNumber)), 210, 400, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(255, 255, 0, emptyNumber)), 210, 450, 100, 20);
        //number-number-number-number
        graphics.drawString("Hello world", new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, new PdfSolidBrush(new PdfColor(0.5, 0, 255, 255)), 210, 500, null);
        graphics.drawRectangle(new PdfSolidBrush(new PdfColor(0.5, 0, 255, 255)), 210, 550, 100, 20);
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PdfColorOverloadTest.pdf');
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