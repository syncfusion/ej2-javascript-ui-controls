import { _TextGlyphMapper } from "../src/pdf-data-extract/core/redaction/text-glyph-mapper";
import { TextGlyph } from "../src/pdf-data-extract/core/text-structure";
import { PdfDocument, PdfPolyLineAnnotation, PdfPolygonAnnotation, PdfRedactionAnnotation, PdfAnnotationBorder, PdfBorderStyle, PdfLineEndingStyle, PdfStandardFont, PdfFontFamily, PdfTextAlignment } from '@syncfusion/ej2-pdf';
import { input } from "./inputs.spec";
import { PdfRedactor } from "../src/pdf-data-extract/core/redaction/pdf-redactor";
describe('Viewer Reported Issues', () => {
    it('1014602 - _getReplacedCharacter coverage', () => {
        let textGlyphMapper: _TextGlyphMapper = new _TextGlyphMapper();
        let textGlyph: TextGlyph = new TextGlyph();
        textGlyph._fontSize = 12;
        textGlyph._width = 0;
        textGlyph._charSpacing = 0;
        textGlyph._wordSpacing = 0;
        expect(textGlyphMapper._getReplacedCharacter([textGlyph])).toEqual(0);
    });
    it('1040265 - Polyline And Polygon Redact issue', () => {
        let document: PdfDocument = new PdfDocument(input);
        let page = document.getPage(0);
        const points = [
            { x: 449, y: 127 },
            { x: 446, y: 221 },
            { x: 446, y: 221 },
            { x: 512, y: 169 },
            { x: 512, y: 169 },
            { x: 430, y: 137 },
        ];
        const polylineAnnotation = new PdfPolyLineAnnotation(points);
        polylineAnnotation.author = 'Guest';
        polylineAnnotation.subject = 'Perimeter calculation';
        polylineAnnotation.text = '2.77 in';
        polylineAnnotation.color = {
            r: 255,
            g: 0,
            b: 0,
        };
        const border = new PdfAnnotationBorder();
        border.width = 1;
        border.style = PdfBorderStyle.solid;
        polylineAnnotation.border = border;
        polylineAnnotation.bounds = {
            x: 424,
            y: 127,
            width: 94,
            height: 94,
        };
        polylineAnnotation.opacity = 1;
        polylineAnnotation.beginLineStyle = PdfLineEndingStyle.openArrow;
        polylineAnnotation.endLineStyle = PdfLineEndingStyle.openArrow;
        polylineAnnotation.modifiedDate = new Date();
        polylineAnnotation.lineExtension = 40;
        polylineAnnotation._dictionary.set('NM', 'measure1');
        polylineAnnotation.setAppearance(true);
        page.annotations.add(polylineAnnotation);
        const polygonPoints = [
            { x: 249, y: 127 },
            { x: 246, y: 221 },
            { x: 246, y: 221 },
            { x: 312, y: 169 },
            { x: 312, y: 169 },
            { x: 230, y: 137 },
        ];
        const polygonAnnotation = new PdfPolygonAnnotation(polygonPoints);
        polygonAnnotation.bounds = {
            x: 249,
            y: 127,
            width: 94,
            height: 94,
        };
        polygonAnnotation.color = {r: 0, g: 0, b: 0};
        polygonAnnotation.setAppearance(true);
        page.annotations.add(polygonAnnotation);
        const redactAnnotation = new PdfRedactionAnnotation({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });
        redactAnnotation.bounds = {
            x: 153.75,
            y: 62.25,
            width: 374.25,
            height: 700.25,
        };
        redactAnnotation.author = 'Guest';
        redactAnnotation.subject = 'Redaction';
        redactAnnotation.opacity = 1;
        redactAnnotation.innerColor = {
            r: 0,
            g: 0,
            b: 0,
        };
        redactAnnotation.appearanceFillColor = {
            r: 255,
            g: 255,
            b: 255,
        };
        redactAnnotation.borderColor = {
            r: 255,
            g: 0,
            b: 0,
        };
        redactAnnotation.textColor = {
            r: 255,
            g: 0,
            b: 0,
        };
        redactAnnotation.overlayText = '';
        redactAnnotation.repeatText = false;
        redactAnnotation.font = new PdfStandardFont(PdfFontFamily.helvetica, 9);
        redactAnnotation.textAlignment = PdfTextAlignment.center;
        const rBorder = new PdfAnnotationBorder();
        rBorder.width = 1;
        rBorder.style = PdfBorderStyle.solid;
        redactAnnotation.border = border;
        redactAnnotation.setAppearance(true);
        page.annotations.add(redactAnnotation);
        let redactor: PdfRedactor = new PdfRedactor(document);
        redactor.redactSync();
        expect(page.annotations.count).toEqual(0);
        document.destroy();
    });
});