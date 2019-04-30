import { PdfDocument, PdfPage ,PdfColor, PdfFont, PdfStandardFont} from './../../../src/index';
import { PointF, PdfFontFamily, PdfSolidBrush, PdfPageOrientation } from './../../../src/index';
import { PdfPageRotateAngle, PdfPageSize, SizeF } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-01: adding multiple pages', () => {
    it('-adding multiple pages', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));

        // add a new page to the document
        let page1 : PdfPage = document.pages.add();
        // draw the text in the first page
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);

        // add a new page to the document
        let page2 : PdfPage = document.pages.add();
        // draw the text in the second page
        page2.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_01.pdf');
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
describe('UTC-02: page margins', () => {
    it('-page margins', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // set the page margins
        document.pageSettings.margins.right = 50;
        // set the custom page margins
        document.pageSettings.margins.left = 10;

        // add a page to the document
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello world', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_02.pdf');
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
describe('UTC-03: page orientation', () => {
    it('-page orientation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // change the page orientation to landscape
        document.pageSettings.orientation = PdfPageOrientation.Landscape;

        // add pages to the document
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_03.pdf');
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
describe('UTC-04: page rotation', () => {
    it('-page rotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // apply 90 degree rotation on the page
        document.pageSettings.rotate = PdfPageRotateAngle.RotateAngle90;

        // create a new page
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_04.pdf');
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
describe('UTC-05: page size', () => {
    it('-page size', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // set the page size
        document.pageSettings.size = PdfPageSize.a3;

        // add pages to the document
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_05.pdf');
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
describe('UTC-06: custom page size', () => {
    it('-custom page size', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // set the page size
        document.pageSettings.size = new SizeF(200, 300);

        // add pages to the document
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_06.pdf');
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
describe('UTC-07: Adding empty pages', () => {
    it('-Adding empty pages', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // set the page size
        document.pageSettings.size = new SizeF(200, 300);

        // add pages to the document
        let page1 : PdfPage = document.pages.add();
        // set the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        // create black brush
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text
        page1.graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        // add pages to the document
        let page2 : PdfPage = document.pages.add();
        // draw the text
        page1.graphics.getNextPage().graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        // draw the text
        page2.graphics.getNextPage().graphics.drawString('Hello World!!!', font, null, blackBrush, 0, 0, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_07.pdf');
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
describe('UTC-08: getNextPage method overloads', () => {
    it('-getNextPage method overloads', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();

        // set the page size
        document.pageSettings.size = new SizeF(200, 300);

        // add pages to the document
        let page1 : PdfPage = document.pages.add();
        // add pages to the document
        let page2 : PdfPage = document.pages.add();
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_pages_08.pdf');
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