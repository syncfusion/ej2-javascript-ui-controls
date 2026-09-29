import { PdfAnnotation, PdfAnnotationBorder, PdfEllipseAnnotation, PdfPolyLineAnnotation, PdfPopupAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfButtonField, PdfField, PdfTextBoxField } from '../src/pdf/core/form/field';
import { PdfForm } from '../src/pdf/core/form/form';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';
import { PdfDocument, PdfMargins, PdfPageSettings } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { attachment, button, circle, comboBox_TTF, fields, formDesigner, freeText, ink, line, lineInput, pdfListBoxField_TextAlignment_Left, polygon, popup, rectangle, rectangle55 } from '../spec/appearance-input.spec';
import { PdfAnnotationFlag, PdfBorderStyle, PdfRotationAngle } from '../src/pdf/core/enumerator';
import { _isNullOrUndefined } from '../src/pdf/core/utils';

describe('Support for retrieving appearance data', () => {
    it('1042761 - Polyline Preservation issue', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        var linePoints = [{ x: 121.5, y: 747.75 }, { x: 181.5, y: 665.25 }, { x: 265.5, y: 730.5 }, { x: 186.75, y: 771.75 }, { x: 114.75, y: 747.75 }];
        var polylineAnnotation = new PdfPolyLineAnnotation(linePoints);
        polylineAnnotation.author = 'Guest';
        polylineAnnotation.text = '5.79 in';
        polylineAnnotation._dictionary.set(
            'NM',
            'daeb3a93-ecd4-42b2-6f2f-ad7102e48bbd'
        );
        polylineAnnotation.subject = 'Perimeter calculation';
        polylineAnnotation.color = { r: 255, g: 0, b: 0 };
        polylineAnnotation._dictionary.update('FillOpacity', 0);
        polylineAnnotation.opacity = 1;
        var lineBorder = new PdfAnnotationBorder();
        lineBorder.width = 1;
        lineBorder.style = 0;
        lineBorder.dash = [0];
        polylineAnnotation.border = lineBorder;
        polylineAnnotation.rotationAngle = 0;
        polylineAnnotation.beginLineStyle = 1;
        polylineAnnotation.endLineStyle = 1;
        var dateValue = new Date(Date.parse('2025-12-01T11:49:10.000Z'));
        polylineAnnotation.modifiedDate = dateValue;
        polylineAnnotation.bounds = JSON.parse(`{"left":153,"top":27,"height":142,"width":201,"right":354,"bottom":169}`);
        polylineAnnotation.bounds.x = (polylineAnnotation.bounds as any).left;
        polylineAnnotation.bounds.y = (polylineAnnotation.bounds as any).top;
        polylineAnnotation.lineExtension = 40;
        var annotation = new PdfPopupAnnotation(null as any, { x: 293, y: 63, width: 242, height: 131 });
        annotation.state = 6;
        annotation.stateModel = 2;
        polylineAnnotation.reviewHistory.add(annotation);
        polylineAnnotation._dictionary.set(
            'IT',
            _PdfName.get('PolyLineDimension')
        );
        polylineAnnotation.flags = 4;
        var measureDetail = {
            area: '[{"unit":"sq in","fractionalType":"D","conversionFactor":1,"denominator":100,"formatDenominator":false}]',
            distance:
                '[{"unit":"in","fractionalType":"D","conversionFactor":1,"denominator":100,"formatDenominator":false}]',
            ratio: '1 in = 1 in',
            x: [
                {
                    conversionFactor: 0.013888888888888888,
                    denominator: 100,
                    formatDenominator: false,
                    fractionalType: 'D',
                    unit: 'in',
                },
            ],
        };
        var measureDictionary = new _PdfDictionary();
        measureDictionary.set('Type', 'Measure');
        measureDictionary.set('R', '1 in = 1 in');
        var xNumberFormat = createNumberFormat(measureDetail.x);
        measureDictionary.set('X', xNumberFormat);
        var dNumberFormat = createNumberFormat(
            JSON.parse(measureDetail.distance)
        );
        measureDictionary.set('D', dNumberFormat);
        var aNumberFormat = createNumberFormat(JSON.parse(measureDetail.area));
        measureDictionary.set('A', aNumberFormat);
        polylineAnnotation._dictionary.set('Measure', setMeasureDictionary(measureDetail));
        polylineAnnotation.setValues('AllowedInteractions', '["None"]');
        polylineAnnotation.setAppearance(true);
        polylineAnnotation.reviewHistory.add(annotation);
        polylineAnnotation.setAppearance(true);
        page.annotations.add(polylineAnnotation);
        let update = document.save();
        document.destroy();
        let ldoc: PdfDocument = new PdfDocument(update);
        const pdfPage: PdfPage = ldoc.getPage(0) as PdfPage;
        const annot: PdfAnnotation = pdfPage.annotations.at(0) as PdfAnnotation;
        const template: PdfTemplate = annot.createTemplate();
        const appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(878);
        expect(template.size.width).toEqual(152.75);
        expect(template.size.height).toEqual(108.5);
        let newDocument = new PdfDocument();
        let pageSettings = new PdfPageSettings();
        pageSettings.margins = new PdfMargins(0);
        pageSettings.rotation = 0;
        pageSettings.size = template.size;
        let newpage = newDocument.addPage();
        newpage.graphics.drawTemplate(template, {x:0, y: 0, width: template.size.width, height: template.size.height});
        let output = newDocument.save();
        newDocument.destroy();
    });
    it('1042761 - square annotation', () => {
        const document: PdfDocument = new PdfDocument(rectangle55)
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 0 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 0 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 0 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 0 && i == 8) {
                        expect(bytesLength).toEqual(398);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 0 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 0 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 1 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 1 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 1 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 8) {
                        expect(bytesLength).toEqual(398);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 1 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 1 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 2 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 2 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 2 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 8) {
                        expect(bytesLength).toEqual(398);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(173.60250000000002);
                    } else if (pageIndex == 2 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 2 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - polygon annotation', () => {
        const document: PdfDocument = new PdfDocument(polygon);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - attachment annotation', () => {
        const document: PdfDocument = new PdfDocument(attachment)
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(836);
                        expect(template.size.width).toEqual(14);
                        expect(template.size.height).toEqual(20);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(516);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(836);
                        expect(template.size.width).toEqual(14);
                        expect(template.size.height).toEqual(20);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(516);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(836);
                        expect(template.size.width).toEqual(14);
                        expect(template.size.height).toEqual(20);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(516);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    }   else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    }     
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - circle annotation', () => {
        const document: PdfDocument = new PdfDocument(circle)
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - freetext annotation', () => {
        const document: PdfDocument = new PdfDocument(freeText);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(588);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(512);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(588);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(512);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(588);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(512);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    }                    
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - Ink annotation', () => {
        const document: PdfDocument = new PdfDocument(ink);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(502);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(502);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(502);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    }                    
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - Line annotation', () => {
        const document: PdfDocument = new PdfDocument(line);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(1096);
                        expect(template.size.width).toEqual(168);
                        expect(template.size.height).toEqual(18);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(1096);
                        expect(template.size.width).toEqual(168);
                        expect(template.size.height).toEqual(18);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(1096);
                        expect(template.size.width).toEqual(168);
                        expect(template.size.height).toEqual(18);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 5) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - LineInput annotation', () => {
        const document: PdfDocument = new PdfDocument(lineInput);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(52);
                        expect(template.size.width).toEqual(161);
                        expect(template.size.height).toEqual(11);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(322);
                        expect(template.size.width).toEqual(161);
                        expect(template.size.height).toEqual(20);                        
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);                        
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - Recangle annotation', () => {
        const document: PdfDocument = new PdfDocument(rectangle);
        const outputDocument: PdfDocument = new PdfDocument();
        let content: string = '';
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;
                    if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 0 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 0 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 0 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 0 && i == 8) {
                        expect(bytesLength).toEqual(310);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 0 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 0 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 1 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 1 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 1 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 1 && i == 8) {
                        expect(bytesLength).toEqual(310);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 1 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 1 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(1724);
                        expect(template.size.width).toEqual(119.998261);
                        expect(template.size.height).toEqual(99.998546);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(62);
                        expect(template.size.width).toEqual(101);
                        expect(template.size.height).toEqual(51);
                    } else if (pageIndex == 2 && i == 5) {
                        expect(bytesLength).toEqual(142);
                        expect(template.size.width).toEqual(116.62079999999999);
                        expect(template.size.height).toEqual(56.18299999999999);
                    } else if (pageIndex == 2 && i == 6) {
                        expect(bytesLength).toEqual(138);
                        expect(template.size.width).toEqual(116.62);
                        expect(template.size.height).toEqual(51.452);
                    } else if (pageIndex == 2 && i == 7) {
                        expect(bytesLength).toEqual(12248);
                        expect(template.size.width).toEqual(163.5);
                        expect(template.size.height).toEqual(49.5);
                    } else if (pageIndex == 2 && i == 8) {
                        expect(bytesLength).toEqual(310);
                        expect(template.size.width).toEqual(50);
                        expect(template.size.height).toEqual(111.6025);
                    } else if (pageIndex == 2 && i == 9) {
                        expect(bytesLength).toEqual(724);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 10) {
                        expect(bytesLength).toEqual(504);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(350);
                    } else if (pageIndex == 2 && i == 11) {
                        expect(bytesLength).toEqual(306);
                        expect(template.size.width).toEqual(150);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 12) {
                        expect(bytesLength).toEqual(318);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(50);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        outputDocument.destroy();
        document.destroy();
    });
    it('1042761 - popup annotation', () => {
        const document: PdfDocument = new PdfDocument(popup);
        let content: string = '';
        const outputDocument: PdfDocument = new PdfDocument();
        for (let pageIndex: number = 0; pageIndex < document.pageCount; pageIndex++) {
            const page: PdfPage = document.getPage(pageIndex) as PdfPage;
            for (let i: number = 0; i < page.annotations.count; i++) {
                const annotation: PdfAnnotation = page.annotations.at(i) as PdfAnnotation;
                const template: PdfTemplate = annotation.createTemplate();
                if (template) {
                    const appearance: any = JSON.parse(template._appearance);
                    const bytesLength: number = appearance.normal.stream.data.bytes.length;                    
					if (pageIndex == 0 && i == 0) {
                        expect(bytesLength).toEqual(958);
                        expect(template.size.width).toEqual(30);
                        expect(template.size.height).toEqual(30);
                    } else if (pageIndex == 0 && i == 1) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 0 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 0 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 1 && i == 0) {
                        expect(bytesLength).toEqual(958);
                        expect(template.size.width).toEqual(30);
                        expect(template.size.height).toEqual(30);
                    } else if (pageIndex == 1 && i == 1) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 1 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 1 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    } else if (pageIndex == 2 && i == 0) {
                        expect(bytesLength).toEqual(958);
                        expect(template.size.width).toEqual(30);
                        expect(template.size.height).toEqual(30);
                    } else if (pageIndex == 2 && i == 1) {
                        expect(bytesLength).toEqual(506);
                        expect(template.size.width).toEqual(70);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 2) {
                        expect(bytesLength).toEqual(324);
                        expect(template.size.width).toEqual(100);
                        expect(template.size.height).toEqual(100);
                    } else if (pageIndex == 2 && i == 3) {
                        expect(bytesLength).toEqual(4802);
                        expect(template.size.width).toEqual(81.67499999);
                        expect(template.size.height).toEqual(93.64999999999998);
                    } else if (pageIndex == 2 && i == 4) {
                        expect(bytesLength).toEqual(400);
                        expect(template.size.width).toEqual(108.263);
                        expect(template.size.height).toEqual(48.35);
                    }
                    const newPage: PdfPage = outputDocument.addPage();
                    newPage.graphics.drawTemplate(template, {
                        x: 0,
                        y: 0,
                        width: template.size.width,
                        height: template.size.height
                    });
                }
            }
        }
        document.destroy();
    });
    it('1042761- Ellipse annotation creation check', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let annot: PdfEllipseAnnotation = new PdfEllipseAnnotation({x: 0, y: 0, width: 100, height: 200});
        annot.author = 'Syncfusion';
        annot.border.style = PdfBorderStyle.dashed;
        annot.border.width = 2;
        annot.border.dash = [1, 1];
        annot.flags = PdfAnnotationFlag.print;
        annot.rotationAngle = PdfRotationAngle.angle0;
        annot.bounds = { x: 0, y: 0, width: 100, height: 200 };
        annot.color = {r: 255, g: 0, b: 255};
        annot.innerColor = {r: 0, g: 0, b: 255};
        annot.name = 'Ellipse Annotation';
        annot.opacity = 0.7;
        annot.subject = 'Annotation';
        annot.text = 'Ellipse';
        annot.setAppearance(true);
        page.annotations.add(annot);
        let data = document.save();
        let ldoc: PdfDocument = new PdfDocument(data);
        const pdfPage: PdfPage = ldoc.getPage(0) as PdfPage;
        const annotation: PdfAnnotation = pdfPage.annotations.at(0) as PdfAnnotation;
        const template: PdfTemplate = annotation.createTemplate(); 
        const appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(886);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(200);
    });
});
describe('Support for retrieving appearance data 1', () => {
    it('1042761 - Signature and TextBox field', () => {
        let document: PdfDocument = new PdfDocument(formDesigner);
        let form = document.form;
        let newDocument = new PdfDocument();
        let pageSettings = new PdfPageSettings();
        pageSettings.margins = new PdfMargins(0);
        let loadedField: PdfField = form.fieldAt(16);
        let templates: PdfTemplate[] = loadedField.createTemplate();
        let template: PdfTemplate = templates[0];
        let appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(452);
        expect(template.size.width).toEqual(150);
        expect(template.size.height).toEqual(32.25);
        pageSettings.size = template.size;
        let newpage = newDocument.addPage();
        newpage.graphics.drawTemplate(template, {x:0, y: 0, width: template.size.width, height: template.size.height});
        loadedField = form.fieldAt(0);
        templates = loadedField.createTemplate();
        template = templates[0];
        appearance = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(546);
        expect(template.size.width).toEqual(112.5);
        expect(template.size.height).toEqual(18);
        pageSettings.size = template.size;
        newpage.graphics.drawTemplate(template, {x:0, y: 0, width: template.size.width, height: template.size.height});
        loadedField = form.fieldAt(1);
        templates = loadedField.createTemplate();
        template = templates[0];
        appearance = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(546);
        expect(template.size.width).toEqual(112.5);
        expect(template.size.height).toEqual(18);
    });
    it('1042761 - Get button field Appearance', () => {
        let document: PdfDocument = new PdfDocument(button);
        let field2: PdfField = document.form.fieldAt(0) as PdfField;
        let templates: PdfTemplate[] = field2.createTemplate();
        let template: PdfTemplate = templates[0];
        const appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(76);
        expect(template.size.width).toEqual(150);
        expect(template.size.height).toEqual(75);
        document.destroy();
    });
    it('1042761 - Get combobox field Appearance', () => {
        let document: PdfDocument = new PdfDocument(comboBox_TTF);
        let field2: PdfField = document.form.fieldAt(0) as PdfField;
        let templates: PdfTemplate[] = field2.createTemplate();
        let template: PdfTemplate = templates[0];
        const appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(798);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(20);
        document.destroy();
    });
    it('1042761 - Get Box field Appearance', () => {
        let document: PdfDocument = new PdfDocument(pdfListBoxField_TextAlignment_Left);
        let field2: PdfField = document.form.fieldAt(0) as PdfField;
        let templates: PdfTemplate[] = field2.createTemplate();
        let template: PdfTemplate = templates[0];
        const appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(542);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(50);
        document.destroy();
    });
    it('1042761 - Radio Button & checkBox Field', () => {
        let document: PdfDocument = new PdfDocument(fields);
        let form = document.form;
        let newDocument = new PdfDocument();
        let pageSettings = new PdfPageSettings();
        pageSettings.margins = new PdfMargins(0);
        let loadedField: PdfField = form.fieldAt(3);
        let templates: PdfTemplate[] = loadedField.createTemplate();
        let template: PdfTemplate = templates[0];
        let appearance: any = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(1644);
        expect(template.size.width).toEqual(13.5);
        expect(template.size.height).toEqual(13.5);
        template = templates[1];
        appearance = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(1212);
        expect(template.size.width).toEqual(13.5);
        expect(template.size.height).toEqual(13.5);
        pageSettings.size = templates[0].size;
        let newpage = newDocument.addPage();
        newpage.graphics.drawTemplate(templates[0], {x:0, y: 0, width: templates[0].size.width, height: templates[0].size.height});
        newpage.graphics.drawTemplate(templates[1], {x:100, y: 100, width: templates[1].size.width, height: templates[1].size.height});
        const expectedValues: { [key: number]: { bytes: number, width: number, height: number } } = {
            9:  { bytes: 514, width: 15, height: 15 },
            10: { bytes: 864, width: 15, height: 15 },
            11: { bytes: 864, width: 15, height: 15 },
            12: { bytes: 864, width: 15, height: 15 },
            13: { bytes: 864, width: 15, height: 15 },
        };
        const indicesToAssert: number[] = [9, 10, 11, 12, 13];
        for (const index of indicesToAssert) {
            let loadedField2: PdfField = form.fieldAt(index);
            templates = loadedField2.createTemplate();
            template = templates[0];
            appearance = JSON.parse(template._appearance);
            const expected = expectedValues[index];
            expect(appearance.normal.stream.data.bytes.length).toEqual(expected.bytes);
            expect(template.size.width).toEqual(expected.width);
            expect(template.size.height).toEqual(expected.height);
        }
    });
    it('1042761 - Add multiple text box field', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page = document.addPage();
        let field: PdfTextBoxField = new PdfTextBoxField(page, 'FirstName', {x: 10, y: 10, width: 100, height: 50});
        field.setAppearance(true);
        form.add(field);
        let field1: PdfTextBoxField = new PdfTextBoxField(page, 'FirstName', {x: 100, y: 70, width: 100, height: 50});
        field1.setAppearance(true);
        form.add(field1);
        let field2: PdfTextBoxField = new PdfTextBoxField(page, 'FirstName', {x: 100, y: 140, width: 100, height: 50});
        field2.setAppearance(true);
        form.add(field2);
        let data = document.save();
        document.destroy();
        let ldoc: PdfDocument = new PdfDocument(data);
        let field5 = ldoc.form.fieldAt(0);
        let templates: PdfTemplate[] = field5.createTemplate();
        let template: PdfTemplate = templates[0];
        let appearance: any = JSON.parse(template._appearance);
        template = templates[1];
        expect(appearance.normal.stream.data.bytes.length).toEqual(520);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(50);
        appearance = JSON.parse(template._appearance);
        template= templates[2];
        expect(appearance.normal.stream.data.bytes.length).toEqual(520);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(50);
        appearance = JSON.parse(template._appearance);
        expect(appearance.normal.stream.data.bytes.length).toEqual(520);
        expect(template.size.width).toEqual(100);
        expect(template.size.height).toEqual(50);
    });
});
export function createNumberFormat(numberFormatList: any) {
	var numberFormats: any[] = [];
	if (
		!_isNullOrUndefined(numberFormatList) ||
		numberFormatList.length === 0
	) {
		return undefined;
	}
	for (var index = 0; index < numberFormatList.length; index++) {
		var numberFormatDictionary: _PdfDictionary = new _PdfDictionary();
		var numberFormat = numberFormatList[parseInt(index.toString(), 10)];
		numberFormatDictionary.set('Type', 'NumberFormat');
		numberFormatDictionary.set('U', numberFormat.unit);
		numberFormatDictionary.set('F', numberFormat.fractionalType);
		numberFormatDictionary.set('D', numberFormat.denominator);
		numberFormatDictionary.set('C', numberFormat.conversionFactor);
		numberFormatDictionary.set('FD', numberFormat.formatDenominator);
		numberFormats.push(numberFormatDictionary);
	}
	return numberFormats;
}
export function setMeasureDictionary(measureDetail: any): _PdfDictionary {
	const measureDictionary: _PdfDictionary = new _PdfDictionary();
	measureDictionary.set('Type', 'Measure');
	measureDictionary.set('R', measureDetail.ratio);
	if (_isNullOrUndefined(measureDetail.x)) {
		const xNumberFormat: _PdfDictionary[] = createNumberFormat(measureDetail.x) as any;
		measureDictionary.set('X', xNumberFormat);
	}
	if (_isNullOrUndefined(measureDetail.distance)) {
		const dNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.distance)) as any;
		measureDictionary.set('D', dNumberFormat);
	}
	if (_isNullOrUndefined(measureDetail.area)) {
		const aNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.area)) as any;
		measureDictionary.set('A', aNumberFormat);
	}
	if (_isNullOrUndefined(measureDetail.angle)) {
		const tNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.angle)) as any;
		measureDictionary.set('T', tNumberFormat);
	}
	if (_isNullOrUndefined(measureDetail.volume)) {
		const vNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.volume)) as any;
		measureDictionary.set('V', vNumberFormat);
	}
	return measureDictionary;
}