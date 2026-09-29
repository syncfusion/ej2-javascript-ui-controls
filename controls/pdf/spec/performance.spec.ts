import { PdfAnnotationIntent, PdfAttachmentIcon, PdfBorderEffectStyle, PdfLineEndingStyle, PdfLineIntent, PdfRotationAngle, PdfRubberStampAnnotationIcon, PdfTextAlignment, PdfTextDirection, PdfTextMarkupAnnotationType } from "../src/pdf/core/enumerator";
import { PdfInteractiveBorder, PdfLineAnnotation, PdfListFieldItem} from '../src/pdf/core/annotations/annotation';
import { PdfAnnotationFlag, PdfBorderStyle, PdfLineCaptionType } from '../src/pdf/core/enumerator';
import { PdfAngleMeasurementAnnotation, PdfAttachmentAnnotation, PdfCircleAnnotation, PdfDocumentLinkAnnotation, PdfEllipseAnnotation, PdfFileLinkAnnotation, PdfFreeTextAnnotation, PdfInkAnnotation, PdfPolygonAnnotation, PdfPolyLineAnnotation, PdfPopupAnnotation, PdfRectangleAnnotation, PdfRedactionAnnotation, PdfRubberStampAnnotation, PdfSquareAnnotation, PdfTextMarkupAnnotation, PdfTextWebLinkAnnotation, PdfUriAnnotation, PdfWatermarkAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfStringFormat, PdfVerticalAlignment } from "../src/pdf/core/fonts/pdf-string-format";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfTrueTypeFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfComboBoxField } from "../src/pdf/core/form";
import { PdfBrush } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument, PdfDocumentSplitEventArgs } from "../src/pdf/core/pdf-document";
import { PdfDestination, PdfPage } from "../src/pdf/core/pdf-page";
//import { arialFont, base64string, input, pdf_Succinctly } from "./inputs1.spec";
import { annotations, input, pdfSuccinctly } from "./inputs.spec";
import { ttfArialBase64 } from "./font-input.spec";
import { natureImageBase64 } from "./image-input.spec";

describe('Performance', () => {
    it('Performance_drawString_standardfont', () => {
        try {
            const document = new PdfDocument();
            const page = document.addPage();
            const font = new PdfStandardFont(PdfFontFamily.helvetica, 24, PdfFontStyle.regular);
            const format = new PdfStringFormat();
            format.alignment = PdfTextAlignment.right;
            format.textDirection = PdfTextDirection.rightToLeft;
            const brush = new PdfBrush({ r: 0, g: 0, b: 255 });
            const iterations = 1000;
            const start = performance.now();
            for (let i = 0; i < iterations; i++) {
                page.graphics.drawString(
                    'Hello World',
                    font,
                    { x: 10, y: 120, width: 300, height: 200 },
                    brush,
                    format
                );
            }
            const end = performance.now();
            const resultText = end - start;
            expect(resultText).toBeLessThanOrEqual(150);
            document.destroy();
        } catch (err) {
            throw new Error('standard Font Test Failed: ${err instanceof Error ? err.message : err}');
        }
    });

    it('Performance_drawString_TTF_RTL', () => {
        try {
            const document = new PdfDocument();
            const page = document.addPage();
            const fontStart = performance.now();
            const font = new PdfTrueTypeFont(ttfArialBase64, 10);
            const fontCreationTime = performance.now() - fontStart;
            const format = new PdfStringFormat();
            format.alignment = PdfTextAlignment.right;
            format.textDirection = PdfTextDirection.rightToLeft;
            const brush = new PdfBrush({ r: 0, g: 0, b: 255 });
            const iterations = 1000;
            const start = performance.now();
            for (let i = 0; i < iterations; i++) {
                page.graphics.drawString('Hello World مرحبا بالعالم', font, { x: 10, y: 120, width: 300, height: 200 }, brush, format);
            }
            const end = performance.now();
            const resultText = end - start;
            expect(resultText).toBeLessThanOrEqual(3500);
            document.destroy();
        } catch (err) {
            throw new Error(`TTF Font Test Failed: ${err instanceof Error ? err.message : err}`);
        }
    });
    it('All annotation creation - All Properties', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();        
        const perf: any[] = [];
        let overallTotal = 0;
        const measure = (name: string, fn: () => void) => {
            const iterations = 10;
            const t0 = Date.now();
            for (let i = 0; i < iterations; i++) {
                fn();
            }
            const t1 = Date.now();
            const total = t1 - t0;
            overallTotal += total;
            expect(overallTotal).toBeLessThanOrEqual(90)    
        };
        measure('PdfLineAnnotation', () => {
            let lineAnnot: PdfLineAnnotation = new PdfLineAnnotation({ x: 80, y: 420 }, { x: 150, y: 420 });
            lineAnnot.author = 'Syncfusion';
            lineAnnot.bounds = { x: 100, y: 200, width: 150, height: 250 };
            lineAnnot.border.width = 4;
            lineAnnot.border.hRadius = 10;
            lineAnnot.border.vRadius = 15;
            lineAnnot.border.style = PdfBorderStyle.beveled;
            lineAnnot.caption.cap = true;
            lineAnnot.caption.type = PdfLineCaptionType.top;
            lineAnnot.caption.offset = { x: 1, y: 1 };
            lineAnnot.color = { r: 100, g: 255, b: 100 };
            lineAnnot.flags = PdfAnnotationFlag.print;
            lineAnnot.innerColor = { r: 200, g: 100, b: 100 };
            lineAnnot.leaderExt = 1;
            lineAnnot.leaderLine = 5;
            lineAnnot.lineEndingStyle.begin = PdfLineEndingStyle.circle;
            lineAnnot.lineEndingStyle.end = PdfLineEndingStyle.openArrow;
            lineAnnot.lineIntent = PdfLineIntent.lineDimension;
            lineAnnot.name = 'Line Annotation';
            lineAnnot.opacity = 0.5;
            lineAnnot.subject = 'Annotation';
            lineAnnot.text = 'Line Annotation Test';
            lineAnnot.setAppearance(true);
            page.annotations.add(lineAnnot);
        });
        measure('PdfRectangleAnnotation', () => {
            let annot: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 0, y: 0, width: 200, height: 100 });
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.border.dash = [1, 1];
            annot.borderEffect.style = PdfBorderEffectStyle.cloudy;
            annot.borderEffect.intensity = 2;
            annot.bounds = { x: 100, y: 200, width: 100, height: 200 };
            annot.color = { r: 255, g: 0, b: 255 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Rectangle Annotation';
            annot.opacity = 0.7;
            annot.subject = 'Annotation';
            annot.text = 'Rectangle';
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfCircleAnnotation', () => {
            let annot: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 50, y: 100, width: 100, height: 100 });
            annot.author = 'Syncfusion';
            annot.border.style = PdfBorderStyle.dashed;
            annot.border.width = 2;
            annot.border.dash = [1, 1];
            annot.bounds = { x: 100, y: 100, width: 100, height: 100 };
            annot.color = { r: 255, g: 0, b: 255 };
            annot.flags = PdfAnnotationFlag.print;
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Circle Annotation';
            annot.opacity = 0.7;
            annot.subject = 'Annotation';
            annot.text = 'Circle';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfSquareAnnotation', () => {
            let annot: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 10, y: 100, width: 100, height: 100 });
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.border.dash = [1, 1];
            annot.bounds = { x: 100, y: 100, width: 100, height: 100 };
            annot.color = { r: 255, g: 0, b: 255 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.flags = PdfAnnotationFlag.print;
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.name = 'Square Annotation';
            annot.opacity = 0.7;
            annot.subject = 'Annotation';
            annot.text = 'Square';
            annot.borderEffect.intensity = 2;
            annot.borderEffect.style = PdfBorderEffectStyle.cloudy;
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfEllipseAnnotation', () => {
            let annot: PdfEllipseAnnotation = new PdfEllipseAnnotation({ x: 0, y: 0, width: 100, height: 200 });
            annot.author = 'Syncfusion';
            annot.border.style = PdfBorderStyle.dashed;
            annot.border.width = 2;
            annot.border.dash = [1, 1];
            annot.flags = PdfAnnotationFlag.print;
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.bounds = { x: 0, y: 0, width: 100, height: 200 };
            annot.color = { r: 255, g: 0, b: 255 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Ellipse Annotation';
            annot.opacity = 0.7;
            annot.subject = 'Annotation';
            annot.text = 'Ellipse';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfPolygonAnnotation', () => {
            let annot: PdfPolygonAnnotation = new PdfPolygonAnnotation([{ x: 100, y: 300 }, { x: 150, y: 200 }, { x: 300, y: 200 }]);
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.border.style = PdfBorderStyle.dashed;
            annot.border.dash = [1, 1];
            annot.bounds = { x: 100, y: 150, width: 200, height: 100 };
            annot.color = { r: 255, g: 255, b: 0 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Poly Annot';
            annot.opacity = 0.5;
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.subject = 'Annotation';
            annot.text = 'Polygon';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfPolyLineAnnotation', () => {
            let annot: PdfPolyLineAnnotation = new PdfPolyLineAnnotation([{ x: 80, y: 520 }, { x: 150, y: 520 }]);
            annot.author = 'Syncfusion';
            annot.beginLineStyle = PdfLineEndingStyle.circle;
            annot.border.width = 2;
            annot.border.style = PdfBorderStyle.beveled;
            annot.border.dash = [1, 1];
            annot.bounds = { x: 0, y: 0, width: 300, height: 400 };
            annot.color = { r: 0, g: 255, b: 255 };
            annot.endLineStyle = PdfLineEndingStyle.openArrow;
            annot.innerColor = { r: 255, g: 255, b: 255 };
            annot.name = 'PolyLine Annotation';
            annot.opacity = 0.5;
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.subject = 'Annotation';
            annot.text = 'PolyLine';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfInkAnnotation', () => {
            let annot: PdfInkAnnotation = new PdfInkAnnotation({ x: 0, y: 0, width: 300, height: 400 }, [{ x: 40, y: 300 }, { x: 60, y: 100 }]);
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.border.hRadius = 15;
            annot.border.vRadius = 15;
            annot.border.dash = [1, 2];
            annot.border.style = PdfBorderStyle.beveled;
            annot.color = { r: 0, g: 100, b: 100 };
            annot.innerColor = { r: 0, g: 255, b: 255 };
            annot.name = 'Ink Annotation';
            annot.rotationAngle = PdfRotationAngle.angle0;
            annot.subject = 'Annotation';
            annot.text = 'Ink';
            annot.opacity = 0.5;
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfTextMarkupAnnotation', () => {
            let annot: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Text Markup', { x: 50, y: 50, width: 100, height: 100 });
            annot.author = 'Syncfusion';
            annot.flags = PdfAnnotationFlag.noZoom;
            annot.border.width = 3;
            annot.bounds = { x: 150, y: 250, width: 200, height: 300 };
            annot.color = { r: 200, g: 200, b: 200 };
            annot.innerColor = { r: 255, g: 255, b: 0 };
            annot.name = 'TextMarkup';
            annot.opacity = 0.56;
            annot.subject = 'Annotation';
            annot.text = 'TextMarkup Annotation';
            annot.textMarkupType = PdfTextMarkupAnnotationType.squiggly;
            annot.textMarkUpColor = { r: 255, g: 255, b: 255 };
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfPopupAnnotation', () => {
            let annot: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', { x: 10, y: 40, width: 30, height: 30 });
            annot.flags = PdfAnnotationFlag.noRotate;
            annot.author = 'Syncfusion';
            annot.bounds = { x: 100, y: 150, width: 200, height: 250 };
            annot.color = { r: 50, g: 50, b: 60 };
            annot.name = 'Popup Annotation';
            annot.open = true;
            annot.opacity = 0.6;
            annot.subject = 'Annotation';
            annot.text = 'Popup';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfAttachmentAnnotation', () => {
            let annot: PdfAttachmentAnnotation = new PdfAttachmentAnnotation({ x: 300, y: 200, width: 30, height: 30 }, 'Nature.jpg', natureImageBase64);
            annot.icon = PdfAttachmentIcon.pushPin;
            annot.author = 'Syncfusion';
            annot.bounds = { x: 100, y: 150, width: 200, height: 100 };
            annot.color = { r: 255, g: 255, b: 0 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Attachment Annot';
            annot.opacity = 0.5;
            annot.subject = 'Annotation';
            annot.text = 'Attachment';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfFileLinkAnnotation', () => {
            let annot: PdfFileLinkAnnotation = new PdfFileLinkAnnotation({ x: 10, y: 40, width: 30, height: 30 }, 'D:/filelink.png');
            annot.action = 'app.alert("You are looking at Java script action of PDF ")';
            annot.flags = PdfAnnotationFlag.noZoom;
            annot.author = 'Syncfusion';
            annot.bounds = { x: 100, y: 150, width: 200, height: 200 };
            annot.color = { r: 255, g: 0, b: 255 };
            annot.innerColor = { r: 90, g: 100, b: 150 };
            annot.name = 'FileLink Annotation';
            annot.opacity = 0.45;
            annot.subject = 'Annotation';
            annot.text = 'FileLink creation';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfUriAnnotation', () => {
            let annot: PdfUriAnnotation = new PdfUriAnnotation({ x: 100, y: 150, width: 200, height: 100 }, 'http://www.google.com');
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.bounds = { x: 100, y: 150, width: 200, height: 100 };
            annot.color = { r: 255, g: 255, b: 0 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.name = 'Uri Annot';
            annot.opacity = 0.5;
            annot.subject = 'Annotation';
            annot.text = 'Uri';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfTextWebLinkAnnotation', () => {
            const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
            const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
            let text: string = 'Syncfusion Site';
            let size = font.measureString(text, { width: 0, height: 0 }, format, 0, 0);
            let annot: any = new PdfTextWebLinkAnnotation({ x: 50, y: 40, width: size.width, height: size.height }, { r: 0, g: 0, b: 0 }, { r: 165, g: 42, b: 42 }, 1, { text: text, font: font, url: 'http://www.syncfusion.com' });
            annot.author = 'Syncfusion';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfDocumentLinkAnnotation', () => {
            const page2 = document.getPage(0);
            let annot: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation({ x: 100, y: 150, width: 40, height: 60 });
            annot.destination = new PdfDestination(page2);
            annot.destination.location = { x: 10, y: 0 };
            annot.destination.zoom = 5;
            annot.author = 'Syncfusion';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfRedactionAnnotation', () => {
            let annot: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 100, y: 120, width: 100, height: 100 });
            annot.flags = PdfAnnotationFlag.readOnly;
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.border.style = PdfBorderStyle.underline;
            annot.border.dash = [1, 1];
            annot.borderColor = { r: 255, g: 0, b: 255 };
            annot.color = { r: 0, g: 0, b: 255 };
            annot.name = 'Redaction';
            annot.opacity = 0.9;
            annot.overlayText = 'Redact';
            annot.repeatText = true;
            annot.subject = 'Annotation';
            annot.text = 'Test';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfRubberStampAnnotation', () => {
            let annot: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({ x: 40, y: 60, width: 80, height: 20 });
            annot.author = 'Syncfusion';
            annot.flags = PdfAnnotationFlag.print;
            annot.border.width = 5;
            annot.icon = PdfRubberStampAnnotationIcon.completed;
            annot.name = 'Rubber Annotation';
            annot.opacity = 0.5;
            annot.text = 'rubber';
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfFreeTextAnnotation', () => {
            let annot: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 50, y: 100, width: 100, height: 50 });
            annot.annotationIntent = PdfAnnotationIntent.freeTextTypeWriter;
            annot.flags = PdfAnnotationFlag.print;
            annot.author = 'Syncfusion';
            annot.borderColor = { r: 255, g: 255, b: 0 };
            annot.border.width = 3;
            annot.calloutLines = [{ x: 100, y: 450 }, { x: 100, y: 200 }, { x: 100, y: 150 }];
            annot.font = new PdfStandardFont(PdfFontFamily.helvetica, 7);
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfWatermarkAnnotation', () => {
            let annot: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Water Mark', { x: 50, y: 50, width: 100, height: 100 });
            annot.author = 'Syncfusion';
            annot.flags = PdfAnnotationFlag.print;
            annot.color = { r: 0, g: 0, b: 0 };
            annot.setAppearance(true);
            page.annotations.add(annot);
        });

        measure('PdfAngleMeasurementAnnotation', () => {
            let annot: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation({ x: 100, y: 700 }, { x: 150, y: 650 }, { x: 100, y: 600 });
            annot.author = 'Syncfusion';
            annot.border.width = 2;
            annot.color = { r: 255, g: 255, b: 255 };
            annot.innerColor = { r: 0, g: 0, b: 255 };
            annot.setAppearance(true);
            page.annotations.add(annot);
        });
        document.destroy();
    });
    it ('Annotation parsing - Performance', () => {
        const pdfDocument: PdfDocument = new PdfDocument(annotations); // ensure 'annotations' is a valid PDF input
        pdfDocument.flatten = true;
        const start = performance.now();
        let output = pdfDocument.save();
        const end = performance.now();
        const total = end - start;
        expect(total).toBeLessThanOrEqual(100)    
        pdfDocument.destroy();
    })
    it ('import page - Performance', () => {
        const documentSrc: PdfDocument = new PdfDocument(pdfSuccinctly);
        const pdfDocument: PdfDocument = new PdfDocument(input);
        const start = performance.now();
        pdfDocument.importPageRange(documentSrc, 0, 10);
        const end = performance.now();
        const total = end - start;
        expect(total).toBeLessThanOrEqual(1500);
        documentSrc.destroy();
        pdfDocument.destroy();
    });
    it('1025718 - split pdf performance', () => {        
        let document: PdfDocument = new PdfDocument(pdfSuccinctly);     
        document.splitEvent = DocumentSplitEvent;
        function DocumentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
            const newDocument: PdfDocument = new PdfDocument(args.pdfData);
            let updatedData = newDocument.save();
            newDocument.destroy();
        }
        const overallStart = performance.now();
        document.splitByFixedNumber(20);
        const overallEnd = performance.now();
        const totalTime = overallEnd - overallStart;
        expect(totalTime).toBeLessThanOrEqual(20000);
        document.destroy();
    });
});