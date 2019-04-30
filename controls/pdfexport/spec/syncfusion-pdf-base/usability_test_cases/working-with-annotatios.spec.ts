import { PdfTextWebLink, PdfFontFamily, PointF, PdfGridRow, PdfColor } from './../../../src/index';
import { PdfPage, PdfDocument, PdfFont, PdfStandardFont, PdfSolidBrush } from './../../../src/index';
import { RectangleF, PdfDocumentLinkAnnotation, PdfDestination, PdfPen } from './../../../src/index';
import { SizeF, PdfStringFormat, PdfTextAlignment } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-01: Web Link Annotation', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);

        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Syncfusion .Net components and controls';
        // set the font
        textLink.font = font;
        textLink.brush = new PdfSolidBrush(new PdfColor(128, 128, 0));
        textLink.pen = new PdfPen(new PdfColor(128, 0, 128));
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, 40));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_01.pdf');
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
describe('UTC-02: Document Link Annotation', () => {
    it('-Document Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create new pages
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        // create a new rectangle
        let bounds : RectangleF = new RectangleF(10, 200, 300, 25);

        // create a new document link annotation
        let documentLinkAnnotation : PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(bounds);
        // set the annotation text
        documentLinkAnnotation.text = 'Document link annotation';
        // set the destination
        documentLinkAnnotation.destination = new PdfDestination(page2);
        // set the documentlink annotation location
        documentLinkAnnotation.destination.location = new PointF(10, 0);
        // set the document annotation zoom level
        documentLinkAnnotation.destination.zoom = 2;
        // add this annotation to a new page
        page1.annotations.add(documentLinkAnnotation);

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_02.pdf');
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
describe('UTC-03: Web Link Annotation with paragraph content - PointF', () => {
    it('-Web Link Annotation with paragraph content - PointF', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);

        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, 40));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_03.pdf');
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
describe('UTC-04: Web Link Annotation with paragraph content - PointF - Right', () => {
    it('-Web Link Annotation with paragraph content - PointF - Right', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_04.pdf');
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
describe('UTC-05: Web Link Annotation with paragraph content - PointF - Center', () => {
    it('-Web Link Annotation with paragraph content - PointF - Center', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_05.pdf');
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
describe('UTC-06: Web Link Annotation with paragraph content - PointF - Justify', () => {
    it('-Web Link Annotation with paragraph content - PointF - Justify', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_06.pdf');
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
describe('UTC-07: Web Link Annotation with paragraph content - RectangleF', () => {
    it('-Web Link Annotation with paragraph content - RectangleF', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, 40, 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_07.pdf');
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
describe('UTC-08: Web Link Annotation with paragraph content - RectangleF - Right', () => {
    it('-Web Link Annotation with paragraph content - RectangleF - Right', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, 40, 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_08.pdf');
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
describe('UTC-09: Web Link Annotation with paragraph content - RectangleF - Center', () => {
    it('-Web Link Annotation with paragraph content - RectangleF - Center', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, 40, 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_09.pdf');
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
describe('UTC-10: Web Link Annotation with paragraph content - RectangleF - Jystify', () => {
    it('-Web Link Annotation with paragraph content - RectangleF - Jystify', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, 40, 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_10.pdf');
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
describe('UTC-11: Web Link Annotation with paragraph content & pagination - PointF', () => {
    it('-Web Link Annotation with paragraph content & pagination - PointF', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);

        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, page.graphics.clientSize.height - 40));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_11.pdf');
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
describe('UTC-12: Web Link Annotation with paragraph content & pagination - PointF - Right', () => {
    it('-Web Link Annotation with paragraph content & pagination - PointF - Right', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, page.graphics.clientSize.height - 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_12.pdf');
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
describe('UTC-13: Web Link Annotation with paragraph content & pagination - PointF - Center', () => {
    it('-Web Link Annotation with paragraph content & pagination - PointF - Center', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, page.graphics.clientSize.height - 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_13.pdf');
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
describe('UTC-14: Web Link Annotation with paragraph content & pagination - PointF - Justify', () => {
    it('-Web Link Annotation with paragraph content & pagination - PointF - Justify', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new PointF(10, page.graphics.clientSize.height - 40));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_14.pdf');
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
describe('UTC-15: Web Link Annotation with paragraph content & pagination - RectangleF', () => {
    it('-Web Link Annotation with paragraph content & pagination - RectangleF', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, (page.graphics.clientSize.height - 40), 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_15.pdf');
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
describe('UTC-16: Web Link Annotation with paragraph content & pagination - RectangleF - Right', () => {
    it('-Web Link Annotation with paragraph content & pagination - RectangleF - Right', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, (page.graphics.clientSize.height - 40), 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_16.pdf');
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
describe('UTC-17: Web Link Annotation with paragraph content & pagination - RectangleF - Center', () => {
    it('-Web Link Annotation with paragraph content & pagination - RectangleF - Center', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, (page.graphics.clientSize.height - 40), 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_17.pdf');
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
describe('UTC-18: Web Link Annotation with paragraph content & pagination - RectangleF - Jystify', () => {
    it('-Web Link Annotation with paragraph content & pagination - RectangleF - Jystify', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, (page.graphics.clientSize.height - 40), 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_18.pdf');
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
describe('UTC-19: Web Link Annotation with single line content - RectangleF', () => {
    it('-Web Link Annotation with single line content - RectangleF', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page : PdfPage = document.pages.add();
        // create the font
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        // set right alignment
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        // create the Text Web Link
        let textLink : PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = 'http://www.syncfusion.com';
        // set the link text
        textLink.text = 'Syncfusion';
        // set the font
        textLink.font = font;
        textLink.stringFormat = format;
        // draw the hyperlink in PDF page
        textLink.draw(page, new RectangleF(10, 40, 300, 50));

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_19.pdf');
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
describe('UTC-20: Document Link Annotation - Paragraph', () => {
    it('-Document Link Annotation - Paragraph', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // create new pages
        let page1 : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        // create a new rectangle
        let bounds : RectangleF = new RectangleF(10, 200, 300, 25);

        // create a new document link annotation
        let documentLinkAnnotation : PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(bounds);
        // set the annotation text
        documentLinkAnnotation.text = 'Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et. Lorem ipsum dolor sit amet, duis meis vis an, his maluisset efficiantur ad, ad debet essent vituperatoribus est. Doming assueverit te usu, nam sonet adipisci pericula an. Everti perfecto vis an. Id vim accommodare philosophia necessitatibus, cibo autem mel et.';
        // set the destination
        documentLinkAnnotation.destination = new PdfDestination(page2);
        // set the documentlink annotation location
        documentLinkAnnotation.destination.location = new PointF(10, 0);
        // set the document annotation zoom level
        documentLinkAnnotation.destination.zoom = 2;
        // add this annotation to a new page
        page1.annotations.add(documentLinkAnnotation);

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_annotations_20.pdf');
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