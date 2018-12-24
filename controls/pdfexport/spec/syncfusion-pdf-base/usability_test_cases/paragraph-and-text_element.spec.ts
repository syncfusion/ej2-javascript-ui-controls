import { PdfDocument, PdfPage, PdfStandardFont, PdfFontFamily, PdfGraphicsState, PdfGridRowStyle } from './../../../src/index';
import { PdfSolidBrush, PdfColor, PdfFont, PdfPageOrientation, PdfBitmap, PdfGrid, PdfGridRow } from './../../../src/index';
import { PointF, SizeF, RectangleF, PdfPageRotateAngle, PdfGraphics, PdfGridCellStyle, PdfPen, PdfGridCell, PdfGridBeginCellDrawEventArgs, PdfSection, PdfGridLayoutResult, PdfTextWebLink, PdfDocumentLinkAnnotation, PdfDestination, PdfStringFormat, PdfTextAlignment, PdfTextElement, PdfLayoutResult } from './../../../src/index';
import { PdfHorizontalOverflowType, PdfVerticalAlignment, PdfSubSuperScript } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-09: Paragraph with PointF(100, page1.graphics.clientSize.height - 50) : Left Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, page1.graphics.clientSize.height - 50, null);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_09.pdf');
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
        // document.save('utc_working_with_text_09.pdf');
    })
});
describe('UTC-10: Paragraph with PointF(100, page1.graphics.clientSize.height - 50) : Right Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, page1.graphics.clientSize.height - 50, format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_10.pdf');
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
        // document.save('utc_working_with_text_10.pdf');
    })
});
describe('UTC-11: Paragraph with PointF(100, page1.graphics.clientSize.height - 50) : Center Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, (page1.graphics.clientSize.height - 50), format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_11.pdf');
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
        // document.save('utc_working_with_text_11.pdf');
    })
});
describe('UTC-12: Paragraph with PointF(100, page1.graphics.clientSize.height - 50) : Justify Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, (page1.graphics.clientSize.height - 50), format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_12.pdf');
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
        // document.save('utc_working_with_text_12.pdf');
    })
});
describe('UTC-13: Paragraph with Rectangle bounds : Left Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Left);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, page1.graphics.clientSize.height - 50, page1.graphics.clientSize.width - 150, 200, format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_13.pdf');
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
        // document.save('utc_working_with_text_13.pdf');
    })
});
describe('UTC-14: Paragraph with Rectangle bounds : Right Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, page1.graphics.clientSize.height - 50, page1.graphics.clientSize.width - 150, 200, format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_14.pdf');
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
        // document.save('utc_working_with_text_14.pdf');
    })
});
describe('UTC-15: Paragraph with Rectangle bounds : Center Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null ,blackBrush, 100, page1.graphics.clientSize.height - 50, page1.graphics.clientSize.width - 150, 200, format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_15.pdf');
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
        // document.save('utc_working_with_text_15.pdf');
    })
});
describe('UTC-16: Paragraph with Rectangle bounds : Justify Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        let input : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        page1.graphics.drawString(input, font, null, blackBrush, 100, page1.graphics.clientSize.height - 50, page1.graphics.clientSize.width - 150, 200, format);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_16.pdf');
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
        // document.save('utc_working_with_text_16.pdf');
    })
});
describe('UTC-17: Text Element : Left Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Left);
        let input1 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        let input2 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        let element : PdfTextElement = new PdfTextElement(input1);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        let result : PdfLayoutResult = element.drawText(page1, new PointF(100, page1.getClientSize().height - 30));
        element = new PdfTextElement(input2);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        result = element.drawText(result.page, new RectangleF(100, page1.getClientSize().height - 30, 200, page1.getClientSize().height));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_17.pdf');
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
        // document.save('utc_working_with_text_17.pdf');
    })
});
describe('UTC-18: Text Element : Right Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Right);
        let input1 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        let input2 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        let element : PdfTextElement = new PdfTextElement(input1);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        let result : PdfLayoutResult = element.drawText(page1, new PointF(100, page1.getClientSize().height - 30));
        element = new PdfTextElement(input2);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        result = element.drawText(result.page, new RectangleF(100, page1.getClientSize().height - 30, 200, page1.getClientSize().height));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_18.pdf');
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
        // document.save('utc_working_with_text_18.pdf');
    })
});
describe('UTC-19: Text Element : Center Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let input1 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        let input2 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        let element : PdfTextElement = new PdfTextElement(input1);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        let result : PdfLayoutResult = element.drawText(page1, new PointF(100, page1.getClientSize().height - 30));
        element = new PdfTextElement(input2);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        result = element.drawText(result.page, new RectangleF(100, page1.getClientSize().height - 30, 200, page1.getClientSize().height));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_19.pdf');
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
        // document.save('utc_working_with_text_19.pdf');
    })
});
describe('UTC-20: Text Element : Justify Alignment', () => {
    it('-Web Link Annotation', (done) => {
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add pages to the document.
        let page1 : PdfPage = document.pages.add();
        // set the font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Justify);
        let input1 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        let input2 : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        // draw the text.
        let element : PdfTextElement = new PdfTextElement(input1);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        let result : PdfLayoutResult = element.drawText(page1, new PointF(100, page1.getClientSize().height - 30));
        element = new PdfTextElement(input2);
        element.stringFormat = format;
        element.font = font;
        element.brush = blackBrush;
        result = element.drawText(result.page, new RectangleF(100, page1.getClientSize().height - 30, 200, page1.getClientSize().height));
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_text_20.pdf');
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
        // document.save('utc_working_with_text_20.pdf');
    })
});

// describe('UTC-23: horizontal overflow - NextPage', () => {
//     //Create a new PDF document.
//     let document : PdfDocument = new PdfDocument();
//     let page : PdfPage = document.pages.add();
//     let grid : PdfGrid = new PdfGrid();
//     //Set AllowHorizontalOverflow for NextPage,LastPage Properties
//     grid.style.allowHorizontalOverflow = true;
//     //Set HorizontalOverflowType as NextPage
//     grid.style.horizontalOverflowType = PdfHorizontalOverflowType.NextPage;
//     //Add 12 columns.
//     grid.columns.add(12);
//     //Add headers.
//     grid.headers.add(1);
//     let tempPdfGridHeader : PdfGridRow = grid.headers.getHeader(0);
//     tempPdfGridHeader.cells.getCell(0).value = "Employee ID 1";
//     tempPdfGridHeader.cells.getCell(1).value = "Employee Name";
//     tempPdfGridHeader.cells.getCell(2).value = "Salary";
//     tempPdfGridHeader.cells.getCell(3).value = "Employee ID 2";
//     tempPdfGridHeader.cells.getCell(4).value = "Employee Name";
//     tempPdfGridHeader.cells.getCell(5).value = "Salary";
//     tempPdfGridHeader.cells.getCell(6).value = "Employee ID 1";
//     tempPdfGridHeader.cells.getCell(7).value = "Employee Name";
//     tempPdfGridHeader.cells.getCell(8).value = "Salary";
//     tempPdfGridHeader.cells.getCell(9).value = "Employee ID 2";
//     tempPdfGridHeader.cells.getCell(10).value = "Employee Name";
//     tempPdfGridHeader.cells.getCell(11).value = "Salary";
//     //Add rows.
//     for (let i : number = 0; i < 60 ; i++) {
//         let pdfGridRow1 : PdfGridRow = grid.rows.addRow();
//         pdfGridRow1.cells.getCell(0).value = "E" + i + "- 1";
//         pdfGridRow1.cells.getCell(1).value = "Clay";
//         pdfGridRow1.cells.getCell(2).value = "$15,000";
//         pdfGridRow1.cells.getCell(3).value = "E" + i + "- 2";
//         pdfGridRow1.cells.getCell(4).value = "David";
//         pdfGridRow1.cells.getCell(5).value = "$16,000";
//         pdfGridRow1.cells.getCell(6).value = "E" + i + "- 3";
//         pdfGridRow1.cells.getCell(7).value = "Clay";
//         pdfGridRow1.cells.getCell(8).value = "$15,000";
//         pdfGridRow1.cells.getCell(9).value = "E" + i + "- 4";
//         pdfGridRow1.cells.getCell(10).value = "David";
//         pdfGridRow1.cells.getCell(11).value = "$16,000";
//     }
//     //Drawing a grid.
//     grid.draw(page, new PointF(0, 10));
//     // save the PDF
//     document.save('utc_text_23.pdf');
// });