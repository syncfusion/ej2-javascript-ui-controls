import { PdfDocument, PdfPage, PdfGraphicsState , PdfColor} from './../../../src/index';
import { RectangleF, PointF, PdfPen } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-01: line drawing', () => {
    it('-line drawing', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create a new page
        let page1 : PdfPage = document.pages.add();

        // draw the line
        page1.graphics.drawLine(new PdfPen(new PdfColor(0, 0, 255)), new PointF(10, 20), new PointF(100, 200));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_shapes_01.pdf');
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
describe('UTC-02: rectangle drawing', () => {
    it('-rectangle drawing', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create a new page
        let page1 : PdfPage = document.pages.add();
        // create pen for draw line
        let pen : PdfPen = new PdfPen(new PdfColor(238, 130, 238), 2);

        // draw line
        page1.graphics.drawRectangle(pen, 10, 10, 50, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_shapes_02.pdf');
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
describe('UTC-03: rectangle with rotation', () => {
    it('-rectangle with rotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create a new page
        let page1 : PdfPage = document.pages.add();
        // create pen
        let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));

        // draw the text before RotateTransformation
        page1.graphics.drawRectangle(pen, 10, 10, 50, 100);
        // set RotateTransform with 25 degree of angle
        page1.graphics.rotateTransform(25);
        // draw the text after RotateTransformation
        page1.graphics.drawRectangle(pen, 200, -80, 50, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_shapes_03.pdf');
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
describe('UTC-04: rectangle with clipping', () => {
    it('-rectangle with clipping', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create a new page
        let page1 : PdfPage = document.pages.add();
        // create black brush
        let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));

        // draw the text before clipping
        page1.graphics.drawRectangle(pen, 10, 10, 50, 100);
        // set clipping with rectangle bounds
        page1.graphics.setClip(new RectangleF(100, 10, 40, 50));
        // draw the text after clipping
        page1.graphics.drawRectangle(pen, 100, 1, 50, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_shapes_04.pdf');
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
describe('UTC-05: rectangle with graphics state', () => {
    it('-rectangle with graphics state', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create a new page
        let page1 : PdfPage = document.pages.add();
        // create pen
        let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawRectangle(pen, 10, 10, 50, 100);

        // save the graphics state
        let state1 : PdfGraphicsState = page1.graphics.save();
        // set clipping with rectangle bounds
        page1.graphics.scaleTransform(1.5, 2);
        // draw the text after clipping
        page1.graphics.drawRectangle(pen, 100, 10, 50, 100);
        // restore the graphics state
        page1.graphics.restore(state1);

        // draw the text
        page1.graphics.drawRectangle(pen, 300, 10, 50, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_shapes_05.pdf');
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