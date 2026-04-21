import { PdfAnnotationBorder, PdfPolyLineAnnotation, PdfPopupAnnotation, PdfRubberStampAnnotation, PdfTextMarkupAnnotation, PdfSquareAnnotation, PdfFreeTextAnnotation, PdfRadioButtonListItem, PdfListFieldItem } from "../src/pdf/core/annotations/annotation";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";
import { DataFormat, PdfAnnotationFlag, PdfRotationAngle, PdfRubberStampAnnotationIcon, PdfTextMarkupAnnotationType, PdfAnnotationIntent, PdfLineEndingStyle, PdfTextAlignment, PdfCrossReferenceType } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfTrueTypeFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat, PdfVerticalAlignment } from "../src/pdf/core/fonts/pdf-string-format";
import { PdfRadioButtonListField, PdfCheckBoxField, PdfComboBoxField } from "../src/pdf/core/form/field";
import { PdfBrush, PdfPen } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfPath } from "../src/pdf/core/graphics/pdf-path";
import { PdfTemplate } from "../src/pdf/core/graphics/pdf-template";
import { PdfAnnotationExportSettings, PdfFormFieldExportSettings, PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfTextBoxField } from "../src/pdf/core/form/field";
import { _XfdfDocument } from "../src/pdf/core/import-export/xfdf-document";
import { PdfForm } from "../src/pdf/core/form/form";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { _bytesToString, _decodeText, _decodeUtf16Bytes, _trimTailIfMatches, _updateBounds } from "../src/pdf/core/utils";
import { ttfArialBase64 } from "./font-input.spec";
import { crossReferenceTable, passwordInput } from "./inputs.spec";
import { _makeLocalDate, createNumberFormat, setMeasureDictionary } from "./test-utility.spec";
describe('Viewer Reported Issues', () => {
    it('1003272 XFDF AllowedInteractions Export Issue', () => {
        let document: PdfDocument = new PdfDocument();
        document.addPage();
        let polylineAnnotation = new PdfPolyLineAnnotation([{ x: 121.5, y: 747.75 }, { x: 181.5, y: 665.25 }, { x: 265.5, y: 730.5 }, { x: 186.75, y: 771 }, { x: 75, y: 114.75 }]);
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
        let lineBorder = new PdfAnnotationBorder();
        lineBorder.width = 1;
        lineBorder.style = 0;
        lineBorder.dash = [0];
        polylineAnnotation.border = lineBorder;
        polylineAnnotation.rotationAngle = 0;
        polylineAnnotation.beginLineStyle = 1;
        polylineAnnotation.endLineStyle = 1;
        polylineAnnotation.bounds = JSON.parse(
            `{"left":153,"top":27,"height":142,"width":201,"right":354,"bottom":169}`
        );
        polylineAnnotation.bounds.x = (polylineAnnotation.bounds as any).left;
        polylineAnnotation.bounds.y = (polylineAnnotation.bounds as any).top;
        polylineAnnotation.lineExtension = 40;
        let annotation = new PdfPopupAnnotation(null as any, { x: 293, y: 63, width: 242, height: 131 });
        annotation.state = 6;
        annotation.stateModel = 2;
        polylineAnnotation.reviewHistory.add(annotation);
        polylineAnnotation._dictionary.set(
            'IT',
            _PdfName.get('PolyLineDimension')
        );
        polylineAnnotation.flags = 4;
        let measureDetail = {
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
        let measureDictionary = new _PdfDictionary();
        measureDictionary.set('Type', 'Measure');
        measureDictionary.set('R', '1 in = 1 in');
        let xNumberFormat = createNumberFormat(measureDetail.x);
        measureDictionary.set('X', xNumberFormat);
        let dNumberFormat = createNumberFormat(
            JSON.parse(measureDetail.distance)
        );
        measureDictionary.set('D', dNumberFormat);
        let aNumberFormat = createNumberFormat(JSON.parse(measureDetail.area));
        measureDictionary.set('A', aNumberFormat);
        polylineAnnotation._dictionary.set(
            'Measure',
            setMeasureDictionary(measureDetail)
        );
        polylineAnnotation.setValues('AllowedInteractions', '["Move"]');
        polylineAnnotation.setValues('AnnotationSelectorSettings', '{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        polylineAnnotation.setAppearance(true);
        let page = document.getPage(0);
        page.annotations.add(polylineAnnotation);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.dataFormat = DataFormat.xfdf;
        let exportedData = document.exportAnnotations(settings);
        let xfdfData = _bytesToString(exportedData);
        expect(xfdfData.includes('AnnotationSelectorSettings')).toBeTruthy();
        expect(xfdfData.includes('AllowedInteractions')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        document.addPage();
        document._allowImportCustomData = true;
        document.importAnnotations(exportedData, DataFormat.xfdf);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0);
        let loadedAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
        expect(loadedAnnotation._dictionary.has('AnnotationSelectorSettings')).toBeTruthy();
        expect(loadedAnnotation._dictionary.has('AllowedInteractions')).toBeTruthy();
        expect(loadedAnnotation._dictionary.get('AnnotationSelectorSettings')).toEqual('{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        expect(loadedAnnotation._dictionary.get('AllowedInteractions')).toEqual('["Move"]');
        document.destroy();
    });
    it('1003272 JSON AllowedInteractions Export Issue', () => {
        let document: PdfDocument = new PdfDocument();
        document.addPage();
        let polylineAnnotation = new PdfPolyLineAnnotation([{ x: 121.5, y: 747.75 }, { x: 181.5, y: 665.25 }, { x: 265.5, y: 730.5 }, { x: 186.75, y: 771 }, { x: 75, y: 114.75 }]);
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
        let lineBorder = new PdfAnnotationBorder();
        lineBorder.width = 1;
        lineBorder.style = 0;
        lineBorder.dash = [0];
        polylineAnnotation.border = lineBorder;
        polylineAnnotation.rotationAngle = 0;
        polylineAnnotation.beginLineStyle = 1;
        polylineAnnotation.endLineStyle = 1;
        polylineAnnotation.bounds = JSON.parse(
            `{"left":153,"top":27,"height":142,"width":201,"right":354,"bottom":169}`
        );
        polylineAnnotation.bounds.x = (polylineAnnotation.bounds as any).left;
        polylineAnnotation.bounds.y = (polylineAnnotation.bounds as any).top;
        polylineAnnotation.lineExtension = 40;
        let annotation = new PdfPopupAnnotation(null as any, { x: 293, y: 63, width: 242, height: 131 });
        annotation.state = 6;
        annotation.stateModel = 2;
        polylineAnnotation.reviewHistory.add(annotation);
        polylineAnnotation._dictionary.set(
            'IT',
            _PdfName.get('PolyLineDimension')
        );
        polylineAnnotation.flags = 4;
        let measureDetail = {
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
        let measureDictionary = new _PdfDictionary();
        measureDictionary.set('Type', 'Measure');
        measureDictionary.set('R', '1 in = 1 in');
        let xNumberFormat = createNumberFormat(measureDetail.x);
        measureDictionary.set('X', xNumberFormat);
        let dNumberFormat = createNumberFormat(
            JSON.parse(measureDetail.distance)
        );
        measureDictionary.set('D', dNumberFormat);
        let aNumberFormat = createNumberFormat(JSON.parse(measureDetail.area));
        measureDictionary.set('A', aNumberFormat);
        polylineAnnotation._dictionary.set(
            'Measure',
            setMeasureDictionary(measureDetail)
        );
        polylineAnnotation.setValues('AllowedInteractions', '["Move"]');
        polylineAnnotation.setValues('AnnotationSelectorSettings', '{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        polylineAnnotation.setAppearance(true);
        let page = document.getPage(0);
        page.annotations.add(polylineAnnotation);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.dataFormat = DataFormat.json;
        let exportedData = document.exportAnnotations(settings);
        let xfdfData = _bytesToString(exportedData);
        expect(xfdfData.includes('AnnotationSelectorSettings')).toBeTruthy();
        expect(xfdfData.includes('AllowedInteractions')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        document.addPage();
        document._allowImportCustomData = true;
        document.importAnnotations(exportedData, DataFormat.json);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0);
        let loadedAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
        expect(loadedAnnotation._dictionary.has('AnnotationSelectorSettings')).toBeTruthy();
        expect(loadedAnnotation._dictionary.has('AllowedInteractions')).toBeTruthy();
        expect(loadedAnnotation._dictionary.get('AnnotationSelectorSettings')).toEqual('{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        expect(loadedAnnotation._dictionary.get('AllowedInteractions')).toEqual('["Move"]');
        document.destroy();
    });
    it('1003272 FDF AllowedInteractions Export Issue', () => {
        let document: PdfDocument = new PdfDocument();
        document.addPage();
        let polylineAnnotation = new PdfPolyLineAnnotation([{ x: 121.5, y: 747.75 }, { x: 181.5, y: 665.25 }, { x: 265.5, y: 730.5 }, { x: 186.75, y: 771 }, { x: 75, y: 114.75 }]);
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
        let lineBorder = new PdfAnnotationBorder();
        lineBorder.width = 1;
        lineBorder.style = 0;
        lineBorder.dash = [0];
        polylineAnnotation.border = lineBorder;
        polylineAnnotation.rotationAngle = 0;
        polylineAnnotation.beginLineStyle = 1;
        polylineAnnotation.endLineStyle = 1;
        polylineAnnotation.bounds = JSON.parse(
            `{"left":153,"top":27,"height":142,"width":201,"right":354,"bottom":169}`
        );
        polylineAnnotation.bounds.x = (polylineAnnotation.bounds as any).left;
        polylineAnnotation.bounds.y = (polylineAnnotation.bounds as any).top;
        polylineAnnotation.lineExtension = 40;
        let annotation = new PdfPopupAnnotation(null as any, { x: 293, y: 63, width: 242, height: 131 });
        annotation.state = 6;
        annotation.stateModel = 2;
        polylineAnnotation.reviewHistory.add(annotation);
        polylineAnnotation._dictionary.set(
            'IT',
            _PdfName.get('PolyLineDimension')
        );
        polylineAnnotation.flags = 4;
        let measureDetail = {
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
        let measureDictionary = new _PdfDictionary();
        measureDictionary.set('Type', 'Measure');
        measureDictionary.set('R', '1 in = 1 in');
        let xNumberFormat = createNumberFormat(measureDetail.x);
        measureDictionary.set('X', xNumberFormat);
        let dNumberFormat = createNumberFormat(
            JSON.parse(measureDetail.distance)
        );
        measureDictionary.set('D', dNumberFormat);
        let aNumberFormat = createNumberFormat(JSON.parse(measureDetail.area));
        measureDictionary.set('A', aNumberFormat);
        polylineAnnotation._dictionary.set(
            'Measure',
            setMeasureDictionary(measureDetail)
        );
        polylineAnnotation.setValues('AllowedInteractions', '["Move"]');
        polylineAnnotation.setValues('AnnotationSelectorSettings', '{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        polylineAnnotation.setAppearance(true);
        let page = document.getPage(0);
        page.annotations.add(polylineAnnotation);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.dataFormat = DataFormat.fdf;
        let exportedData = document.exportAnnotations(settings);
        let fdfData = _bytesToString(exportedData);
        expect(fdfData.includes('AnnotationSelectorSettings')).toBeTruthy();
        expect(fdfData.includes('AllowedInteractions')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        document.addPage();
        document._allowImportCustomData = true;
        document.importAnnotations(exportedData, DataFormat.fdf);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0);
        let loadedAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
        expect(loadedAnnotation._dictionary.has('AnnotationSelectorSettings')).toBeTruthy();
        expect(loadedAnnotation._dictionary.has('AllowedInteractions')).toBeTruthy();
        expect(loadedAnnotation._dictionary.get('AnnotationSelectorSettings')).toEqual('{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3,"resizerCursorType":null}');
        expect(loadedAnnotation._dictionary.get('AllowedInteractions')).toEqual('["Move"]');
        document.destroy();
    });
	it('1003547 - RubberStamp annotations Word Space Issue', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        let page: PdfPage = document.getPage(0) as PdfPage;
        const icons: PdfRubberStampAnnotationIcon[] = [
            PdfRubberStampAnnotationIcon.asIs,
            PdfRubberStampAnnotationIcon.forComment,
            PdfRubberStampAnnotationIcon.forPublicRelease,
            PdfRubberStampAnnotationIcon.notApproved,
            PdfRubberStampAnnotationIcon.notForPublicRelease,
            PdfRubberStampAnnotationIcon.topSecret,
            PdfRubberStampAnnotationIcon.informationOnly,
            PdfRubberStampAnnotationIcon.preliminaryResults,
        ];
        const marginX = 36;
        const marginY = 72;
        const columns = 3;
        const cellW = 160;
        const cellH = 48;
        const gapX = 18;
        const gapY = 18;
        let col = 0;
        let row = 0;
        for (let i: number = 0; i < icons.length; i++) {
            const icon = icons[i];
            const x = marginX + col * (cellW + gapX);
            const y = marginY + row * (cellH + gapY);
            const annot = new PdfRubberStampAnnotation({ x, y, width: cellW, height: cellH });
            annot.icon = icon;
            annot.setAppearance(true);
            page.annotations.add(annot);
            col++;
            if (col >= columns) {
                col = 0;
                row++;
            }
            const nextY = marginY + row * (cellH + gapY);
            const roughLimit = 720;
            if (nextY + cellH + marginY > roughLimit && i < icons.length - 1) {
                page = document.addPage() as PdfPage;
                col = 0;
                row = 0;
            }
        }
        const output = document.save();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0) as PdfPage;
        let loadedStamp = page.annotations.at(0);
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#AsIs');
        let appearance = loadedStamp._dictionary.get('AP').get('N')
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['2.03', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['74.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['75.657', '-1.000', '77.000', '-2.343', '77.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['77.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['77.000', '-25.657', '75.657', '-27.000', '74.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['11.380', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(AS IS)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(1);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#ForComment');
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.94', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['165.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['166.657', '-1.000', '168.000', '-2.343', '168.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['168.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['168.000', '-25.657', '166.657', '-27.000', '165.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['7.450', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(FOR COMMENT)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(2);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#ForPublicRelease');
        result = parser._readContent();
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.66', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['239.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['240.657', '-1.000', '242.000', '-2.343', '242.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['242.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['242.000', '-25.657', '240.657', '-27.000', '239.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['8.880', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(FOR PUBLIC RELEASE)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(3);
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#NotApproved');
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.84', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.592', '0.090', '0.059']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.984', '0.871', '0.867']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['185.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['186.657', '-1.000', '188.000', '-2.343', '188.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['188.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['188.000', '-25.657', '186.657', '-27.000', '185.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.592', '0.090', '0.059']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['12.990', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(NOT APPROVED)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(4);
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#NotForPublicRelease');
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.54', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['289.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['290.657', '-1.000', '292.000', '-2.343', '292.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['292.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['292.000', '-25.657', '290.657', '-27.000', '289.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['9.990', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(NOT FOR PUBLIC RELEASE)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(5);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#TopSecret');
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['1.07', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['145.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['146.657', '-1.000', '148.000', '-2.343', '148.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['148.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['148.000', '-25.657', '146.657', '-27.000', '145.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['9.100', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(TOP SECRET)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(6);
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#InformationOnly');
        appearance = loadedStamp._dictionary.get('AP').get('N');
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.68', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['229.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['230.657', '-1.000', '232.000', '-2.343', '232.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['232.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['232.000', '-25.657', '230.657', '-27.000', '229.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['13.890', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(INFORMATION ONLY)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(7);
        appearance = loadedStamp._dictionary.get('AP').get('N');
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect((loadedStamp._dictionary.getRaw('Name') as _PdfName).name).toEqual('#PreliminaryResults');
        expect(result.length).toBe(34);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '48.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.61', '.00', '.00', '1.71', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['259.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['260.657', '-1.000', '262.000', '-2.343', '262.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['262.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['262.000', '-25.657', '260.657', '-27.000', '259.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['11.660', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(PRELIMINARY RESULTS)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        document.destroy();
    });
	it('1004242 - RubberStamp annotations Padding Issue', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage() as PdfPage;
        const annot: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 20,
          y: 60,
          width: 200,
          height: 50,
        });
        annot.icon = PdfRubberStampAnnotationIcon.approved;
        annot.setAppearance(true);
        page.annotations.add(annot);
        const annot1: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 250,
          y: 60,
          width: 200,
          height: 50,
        });
        annot1.icon = PdfRubberStampAnnotationIcon.approved;
        annot1.setAppearance(true);
        annot1.flatten = true;
        page.annotations.add(annot1);
        const annot2: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 20,
          y: 150,
          width: 200,
          height: 50,
        });
        annot2.icon = PdfRubberStampAnnotationIcon.forComment;
        annot2.setAppearance(true);
        page.annotations.add(annot2);
        const annot3: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 250,
          y: 150,
          width: 200,
          height: 50,
        });
        annot3.icon = PdfRubberStampAnnotationIcon.forComment;
        annot3.setAppearance(true);
        annot3.flatten = true;
        page.annotations.add(annot3);
        const annot4: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 20,
          y: 300,
          width: 200,
          height: 50,
        });
        annot4.icon = PdfRubberStampAnnotationIcon.experimental;
        annot4.setAppearance(true);
        page.annotations.add(annot4);
        const annot5: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 250,
          y: 300,
          width: 200,
          height: 50,
        });
        annot5.icon = PdfRubberStampAnnotationIcon.experimental;
        annot5.setAppearance(true);
        annot5.flatten = true;
        page.annotations.add(annot5);
        const annot6: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 20,
          y: 450,
          width: 200,
          height: 50,
        });
        annot6.icon = PdfRubberStampAnnotationIcon.forPublicRelease;
        annot6.setAppearance(true);
        page.annotations.add(annot6);
        const annot7: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 250,
          y: 450,
          width: 200,
          height: 50,
        });
        annot7.icon = PdfRubberStampAnnotationIcon.forPublicRelease;
        annot7.setAppearance(true);
        annot7.flatten = true;
        page.annotations.add(annot7);
        const annot8: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 20,
          y: 650,
          width: 200,
          height: 50,
        });
        annot8.icon = PdfRubberStampAnnotationIcon.confidential;
        annot8.setAppearance(true);
        page.annotations.add(annot8);
        const annot9: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
          x: 250,
          y: 650,
          width: 200,
          height: 50,
        });
        annot9.icon = PdfRubberStampAnnotationIcon.confidential;
        annot9.setAppearance(true);
        annot9.flatten = true;
        page.annotations.add(annot9);
        const output = document.save();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0) as PdfPage;
        let loadedStamp = page.annotations.at(0);
        let appearance = loadedStamp._dictionary.get('AP').get('N')
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['1.54', '.00', '.00', '1.79', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.286', '0.431', '0.149']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.898', '0.933', '0.871']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual(['2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000']);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['125.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual(['126.657', '-1.000', '128.000', '-2.343', '128.000', '-4.000']);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['128.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual(['128.000', '-25.657', '126.657', '-27.000', '125.000', '-27.000']);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual(['3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000']);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.286', '0.431', '0.149']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '2.00', '-21.34']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['6.880', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(APPROVED)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(1);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['1.18', '.00', '.00', '1.79', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual([
            '2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000'
        ]);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['165.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual([
            '166.657', '-1.000', '168.000', '-2.343', '168.000', '-4.000'
        ]);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['168.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual([
            '168.000', '-25.657', '166.657', '-27.000', '165.000', '-27.000'
        ]);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual([
            '3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000'
        ]);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual([
            '1.00', '.00', '.00', '1.00', '2.00', '-21.34'
        ]);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['7.450', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(FOR COMMENT)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(2);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['1.11', '.00', '.00', '1.79', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual([
            '2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000'
        ]);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['175.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual([
            '176.657', '-1.000', '178.000', '-2.343', '178.000', '-4.000'
        ]);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['178.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual([
            '178.000', '-25.657', '176.657', '-27.000', '175.000', '-27.000'
        ]);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual([
            '3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000'
        ]);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual([
            '1.00', '.00', '.00', '1.00', '2.00', '-21.34'
        ]);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['9.660', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(EXPERIMENTAL)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(3);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['0.82', '.00', '.00', '1.79', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual([
            '2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000'
        ]);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['239.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual([
            '240.657', '-1.000', '242.000', '-2.343', '242.000', '-4.000'
        ]);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['242.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual([
            '242.000', '-25.657', '240.657', '-27.000', '239.000', '-27.000'
        ]);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual([
            '3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000'
        ]);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual([
            '1.00', '.00', '.00', '1.00', '2.00', '-21.34'
        ]);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['8.880', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(FOR PUBLIC RELEASE)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        loadedStamp = page.annotations.at(4);
        appearance = loadedStamp._dictionary.get('AP').get('N')
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands.length).toBe(0);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['1.18', '.00', '.00', '1.79', '.00', '.00']);
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('d');
        expect(result[5]._operands).toEqual(['[]', '0']);
        expect(result[6]._operator).toEqual('w');
        expect(result[6]._operands).toEqual(['1.000']);
        expect(result[7]._operator).toEqual('j');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('J');
        expect(result[8]._operands).toEqual(['0']);
        expect(result[9]._operator).toEqual('RG');
        expect(result[9]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.859', '0.890', '0.941']);
        expect(result[11]._operator).toEqual('m');
        expect(result[11]._operands).toEqual(['2.000', '-4.000']);
        expect(result[12]._operator).toEqual('c');
        expect(result[12]._operands).toEqual([
            '2.000', '-2.343', '3.343', '-1.000', '5.000', '-1.000'
        ]);
        expect(result[13]._operator).toEqual('l');
        expect(result[13]._operands).toEqual(['165.000', '-1.000']);
        expect(result[14]._operator).toEqual('c');
        expect(result[14]._operands).toEqual([
            '166.657', '-1.000', '168.000', '-2.343', '168.000', '-4.000'
        ]);
        expect(result[15]._operator).toEqual('l');
        expect(result[15]._operands).toEqual(['168.000', '-24.000']);
        expect(result[16]._operator).toEqual('c');
        expect(result[16]._operands).toEqual([
            '168.000', '-25.657', '166.657', '-27.000', '165.000', '-27.000'
        ]);
        expect(result[17]._operator).toEqual('l');
        expect(result[17]._operands).toEqual(['5.000', '-27.000']);
        expect(result[18]._operator).toEqual('c');
        expect(result[18]._operands).toEqual([
            '3.343', '-27.000', '2.000', '-25.657', '2.000', '-24.000'
        ]);
        expect(result[19]._operator).toEqual('h');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.094', '0.145', '0.392']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual([
            '1.00', '.00', '.00', '1.00', '2.00', '-21.34'
        ]);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(['8.560', '0.000']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(CONFIDENTIAL)']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['0.000', '-22.700']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        document.destroy();
    });
	it('1006029 - markup highlight coverage', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let page1 = document.addPage();
        let page2 = document.addPage();
        let page3 = document.addPage();
        let page4 = document.addPage();
        let annot1 = new PdfTextMarkupAnnotation('Markup', { x: 78.60, y: 194.15, width: 190.01, height: 53.50 });
        expect(annot1._getCropOrMediaBox()).toEqual([0, 0, 0, 0]);
        page4.annotations.add(annot1);
        page._pageDictionary.update('CropBox', [36, 36, 631.276, 877.89]);
        page1._pageDictionary.update('MediaBox', [36, 36, 631.276, -877.89]);
        page2._pageDictionary.update('CropBox', [36, 36, 631.276, 877.89]);
        page2._pageDictionary.update('MediaBox', [36, 36, 631.276, -877.89]);
        page.annotations.add(new PdfTextMarkupAnnotation('Markup', { x: 78.60, y: 194.15, width: 190.01, height: 53.50 }, {textMarkupType: PdfTextMarkupAnnotationType.highlight}));
        page1.annotations.add(new PdfTextMarkupAnnotation('Markup 1', { x: 78.60, y: 194.15, width: 190.01, height: 53.50 }, {textMarkupType: PdfTextMarkupAnnotationType.highlight}));
        page2.annotations.add(new PdfTextMarkupAnnotation('Markup 2', { x: 78.60, y: 194.15, width: 190.01, height: 53.50 }, {textMarkupType: PdfTextMarkupAnnotationType.highlight}));
        page3.annotations.add(new PdfTextMarkupAnnotation('Markup 3', { x: 78.60, y: 194.15, width: 190.01, height: 53.50 }, {textMarkupType: PdfTextMarkupAnnotationType.highlight}));
        let annot = page.annotations.at(0);
        let cropOrMediaBox = annot._getCropOrMediaBox();
        expect(cropOrMediaBox).toEqual([36, 36, 631.276, 877.89]);
        annot = page1.annotations.at(0);
        cropOrMediaBox = annot._getCropOrMediaBox();
        expect(cropOrMediaBox).toEqual([36, -877.89, 631.276, 36]);
        annot = page2.annotations.at(0);
        cropOrMediaBox = annot._getCropOrMediaBox();
        expect(cropOrMediaBox).toEqual([36, 36, 631.276, 877.89]);
        annot = page3.annotations.at(0);
        cropOrMediaBox = annot._getCropOrMediaBox();
        expect(cropOrMediaBox).toEqual([0, 0, 0, 0]);
        document.destroy();
    });
	it('1006069 - formats Asia/Tokyo (+09:00) correctly', () => {
        const d = _makeLocalDate({
            year: 2024, month: 10, day: 5,
            hours: 13, minutes: 45, seconds: 59,
            tzOffsetMinutes: 9 * 60, // +540
        });
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        let page: PdfPage = document.getPage(0) as PdfPage;
        let annot1: PdfSquareAnnotation = new PdfSquareAnnotation({
            x: 100,
            y: 100,
            width: 200,
            height: 30,
        });
        annot1.color = { r: 0, g: 0, b: 0 };
        annot1.text = 'Text';
        annot1.modifiedDate = d;
        annot1.setAppearance(true);
        page.annotations.add(annot1);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.exportAppearance = true;
        settings.dataFormat = DataFormat.xfdf;
        let xfdfexportedData = document.exportAnnotations(settings);
        let xfdfData = _bytesToString(xfdfexportedData);
        expect(xfdfData.includes("D:20241005134559+09'00'")).toBeTruthy();
        settings.dataFormat = DataFormat.json;
        let jsonexportedData = document.exportAnnotations(settings);
        let jsonData = _bytesToString(jsonexportedData);
        expect(jsonData.includes("D:20241005134559+09'00'")).toBeTruthy();
        settings.dataFormat = DataFormat.fdf;
        let fdfexportedData = document.exportAnnotations(settings);
        let fdfData = _bytesToString(fdfexportedData);
        expect(fdfData.includes("D:20241005134559+09'00'")).toBeTruthy();
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(xfdfexportedData, DataFormat.xfdf);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+09'00'");
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(jsonexportedData, DataFormat.json);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+09'00'");
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(fdfexportedData, DataFormat.fdf);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+09'00'");
        document.destroy();
    });
    it('1006069 - formats Asia/Kuala_Lumpur (+08:00) correctly', () => {
        const d = _makeLocalDate({
            year: 2024, month: 10, day: 5,
            hours: 13, minutes: 45, seconds: 59,
            tzOffsetMinutes: 8 * 60, // +480
        });
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        let page: PdfPage = document.getPage(0) as PdfPage;
        let annot1: PdfSquareAnnotation = new PdfSquareAnnotation({
            x: 100,
            y: 100,
            width: 200,
            height: 30,
        });
        annot1.color = { r: 0, g: 0, b: 0 };
        annot1.text = 'Text';
        annot1.modifiedDate = d;
        annot1.setAppearance(true);
        page.annotations.add(annot1);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.exportAppearance = true;
        settings.dataFormat = DataFormat.xfdf;
        let xfdfexportedData = document.exportAnnotations(settings);
        let xfdfData = _bytesToString(xfdfexportedData);
        expect(xfdfData.includes("D:20241005134559+08'00'")).toBeTruthy();
        settings.dataFormat = DataFormat.json;
        let jsonexportedData = document.exportAnnotations(settings);
        let jsonData = _bytesToString(jsonexportedData);
        expect(jsonData.includes("D:20241005134559+08'00'")).toBeTruthy();
        settings.dataFormat = DataFormat.fdf;
        let fdfexportedData = document.exportAnnotations(settings);
        let fdfData = _bytesToString(fdfexportedData);
        expect(fdfData.includes("D:20241005134559+08'00'")).toBeTruthy();
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(xfdfexportedData, DataFormat.xfdf);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+08'00'");
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(jsonexportedData, DataFormat.json);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+08'00'");
        document.destroy();
        document = new PdfDocument(crossReferenceTable);
        document.importAnnotations(fdfexportedData, DataFormat.fdf);
        page = document.getPage(0) as PdfPage;
        annot1 = page.annotations.at(0) as PdfSquareAnnotation;
        expect(annot1._dictionary.get('M')).toEqual("D:20241005134559+08'00'");
        document.destroy();
    });
	it('1006069 - _stringToDate and all timezones coverage', () => {
        const annot = new PdfSquareAnnotation({ x: 10, y: 10, width: 10, height: 10 });
        const _std = function (v: any) {
            return annot._stringToDate(v);
        };
        function expectUTC(d: any, y: any, m1: any, day: any, h: any, min: any, s: any) {
            if (typeof h === 'undefined') h = 0;
            if (typeof min === 'undefined') min = 0;
            if (typeof s === 'undefined') s = 0;
            expect(d.getUTCFullYear()).toBe(y);
            expect(d.getUTCMonth()).toBe(m1 - 1);
            expect(d.getUTCDate()).toBe(day);
            expect(d.getUTCHours()).toBe(h);
            expect(d.getUTCMinutes()).toBe(min);
            expect(d.getUTCSeconds()).toBe(s);
        }
        function expectLocal(d: any, y: any, m1: any, day: any, h: any, min: any, s: any) {
            if (typeof h === 'undefined') h = 0;
            if (typeof min === 'undefined') min = 0;
            if (typeof s === 'undefined') s = 0;
            expect(d.getFullYear()).toBe(y);
            expect(d.getMonth()).toBe(m1 - 1);
            expect(d.getDate()).toBe(day);
            expect(d.getHours()).toBe(h);
            expect(d.getMinutes()).toBe(min);
            expect(d.getSeconds()).toBe(s);
        }
        var d = _std(undefined);
        expect(isNaN(d.getTime())).toBe(true);
        var src = new Date('2024-10-05T12:34:56Z');
        d = _std(src);
        expect(d.getTime()).toBe(src.getTime());
        d = _std('10/05/2024 13:45:59');
        expectLocal(d, 2024, 10, 5, 13, 45, 59);
        d = _std('10/05/2024');
        expectLocal(d, 2024, 10, 5, 0, 0, 0);
        d = _std("D:20241005134559+09:00");
        expectUTC(d, 2024, 10, 5, 4, 45, 59);
        d = _std("D:20241005134559+09'00'");
        expectUTC(d, 2024, 10, 5, 4, 45, 59);
        d = _std('2024');
        expectLocal(d, 2024, 1, 1, 0, 0, 0);
        d = _std('202410');
        expectLocal(d, 2024, 10, 1, 0, 0, 0);
        d = _std('20241005');
        expectLocal(d, 2024, 10, 5, 0, 0, 0);
        d = _std('2024100513');
        expectLocal(d, 2024, 10, 5, 13, 0, 0);
        d = _std('202410051345');
        expectLocal(d, 2024, 10, 5, 13, 45, 0);
        d = _std('20241005134559');
        expectLocal(d, 2024, 10, 5, 13, 45, 59);
        d = _std('20241005000000Z');
        expectUTC(d, 2024, 10, 5, 0, 0, 0);
        d = _std('20241005000000z');
        expectUTC(d, 2024, 10, 5, 0, 0, 0);
        d = _std('20241005134559+09:00');
        expectUTC(d, 2024, 10, 5, 4, 45, 59);
        d = _std('20240102120000+0530');
        expectUTC(d, 2024, 1, 2, 6, 30, 0);
        d = _std('20240102120000+05');
        expectUTC(d, 2024, 1, 2, 7, 0, 0);
        d = _std('20240102120000-07');
        expectUTC(d, 2024, 1, 2, 19, 0, 0);
        d = _std('20240102120000-0230');
        expectUTC(d, 2024, 1, 2, 14, 30, 0);
        d = _std('20241005134559ABC');
        expectLocal(d, 2024, 10, 5, 13, 45, 59);
    });
    it('1005813 - Text Decode coverage', () => {
        expect(_trimTailIfMatches('', 'x')).toBe('');
        expect(_trimTailIfMatches('abc', '')).toBe('abc');
        expect(_trimTailIfMatches('a', 'abcd')).toBe('a');
        expect(_trimTailIfMatches('abcdef', 'xyz')).toBe('abcdef');
        expect(_trimTailIfMatches('abxd', 'acd')).toBe('abxd');
        expect(_trimTailIfMatches('abcdef', 'def')).toBe('abc');
        expect(_decodeUtf16Bytes(new Uint8Array([0x00, 0x41]), true)).toBe('A');
        expect(_decodeUtf16Bytes(new Uint8Array([0x41, 0x00]), false)).toBe('A');
        const nonString: any = 123;
        expect(_decodeText(nonString, false, false)).toBe(nonString);
        expect(_decodeText('hello', true, false)).toBe('hello');
        expect(_decodeText('hello', false, true)).toBe('hello');
        expect(_decodeText('A', false, false)).toBe('A');
        expect(_decodeText('hello', false, false)).toBe('hello');
        const BOM_BE = '\u00FE\u00FF';
        const BOM_LE = '\u00FF\u00FE';
        const be = (bytes: number[]) => BOM_BE + String.fromCharCode(...bytes);
        const le = (bytes: number[]) => BOM_LE + String.fromCharCode(...bytes);
        expect(_decodeText(BOM_BE, false, false)).toBe('');
        expect(_decodeText(BOM_LE, false, false)).toBe('');
        expect(_decodeText(be([0x41]), false, false)).toBe('A');
        expect(_decodeText(le([0x41]), false, false)).toBe('A');
        expect(_decodeText(be([0x00, 0x41, 0xFF, 0xFD]), false, false)).toBe('A');
        expect(_decodeText(le([0x41, 0x00, 0xFD, 0xFF]), false, false)).toBe('A');
        expect(_decodeText(be([0x00, 0x41, 0x00]), false, false)).toBe('A');
        expect(_decodeText(le([0x41, 0x00, 0x00]), false, false)).toBe('A');
        expect(_decodeText(be([0x01, 0x42]), false, false)).toBe('ł');
        expect(_decodeText(le([0x05, 0x01]), false, false)).toBe('ą');
        expect(_decodeText(be([0x06, 0x45, 0x06, 0x42, 0x06, 0x28, 0x06, 0x48, 0x06, 0x44]), false, false)).toBe('مقبول');
        expect(_decodeText(le([0x48, 0x00, 0x69, 0x00]), false, false)).toBe('Hi');
    });
    it('1007366 - FreeText Font Coverage', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let freeText: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 309.75, y: 170.475, width: 113.25, height: 61.5 });
        freeText.font = new PdfStandardFont(PdfFontFamily.courier, 12, PdfFontStyle.bold | PdfFontStyle.italic | PdfFontStyle.underline | PdfFontStyle.strikeout);
        freeText.text = 'FreeText Annotation';
        freeText.border.width = 1;
        freeText.name = 'e2fb2bf3-9b41-4269-448c-4ee8bbf33d11';
        freeText.textMarkUpColor = { r: 0, g: 0, b: 255 };
        freeText.setAppearance(true);
        page.annotations.add(freeText);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0) as PdfPage;
        freeText = page.annotations.at(0) as PdfFreeTextAnnotation;
        let font = freeText.font;
        expect(freeText._dictionary.has('RC')).toBeTruthy();
        expect(font.size).toEqual(12);
        expect((font as PdfStandardFont).fontFamily).toEqual(PdfFontFamily.courier);
        expect((font as PdfStandardFont).style).toEqual(PdfFontStyle.bold | PdfFontStyle.italic | PdfFontStyle.underline | PdfFontStyle.strikeout);
        expect(freeText.textMarkUpColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(freeText._getFontFamily(0)).toEqual('Helvetica');
        expect(freeText._getFontFamily(1)).toEqual('Courier');
        expect(freeText._getFontFamily(2)).toEqual('TimesRoman');
        expect(freeText._getFontFamily(3)).toEqual('Symbol');
        expect(freeText._getFontFamily(4)).toEqual('ZapfDingbats');
        expect(freeText._getFontFamily(5)).toEqual('Helvetica');
        expect(freeText._parseTextDecoration('underline', PdfFontStyle.regular)).toEqual(PdfFontStyle.underline);
        expect(freeText._parseFontStyle('normal', PdfFontStyle.regular)).toEqual(PdfFontStyle.regular);
        expect(freeText._parseFontStyle('normal', PdfFontStyle.regular)).toEqual(PdfFontStyle.regular);
        expect(freeText._parseFontStyle('regular', PdfFontStyle.regular)).toEqual(PdfFontStyle.regular);
        expect(freeText._parseFontStyle('underline', PdfFontStyle.regular)).toEqual(PdfFontStyle.regular | PdfFontStyle.underline);
        expect(freeText._parseFontStyle('underline', PdfFontStyle.regular)).toEqual(PdfFontStyle.underline);
        expect(freeText._parseFontStyle('strikeout', PdfFontStyle.regular)).toEqual(PdfFontStyle.strikeout);
        expect(freeText._parseFontStyle('strikeout', PdfFontStyle.bold)).toEqual(PdfFontStyle.bold | PdfFontStyle.strikeout);
        expect(freeText._parseFontStyle('italic', PdfFontStyle.regular)).toEqual(PdfFontStyle.italic);
        expect(freeText._parseFontStyle('italic', PdfFontStyle.underline)).toEqual(PdfFontStyle.underline | PdfFontStyle.italic);
        expect(freeText._parseFontStyle('bold', PdfFontStyle.regular)).toEqual(PdfFontStyle.bold);
        expect(freeText._parseFontStyle('bold', PdfFontStyle.italic)).toEqual(PdfFontStyle.bold | PdfFontStyle.italic);
        expect(freeText._parseFontStyle('bold italic', PdfFontStyle.regular)).toEqual(PdfFontStyle.bold | PdfFontStyle.italic);
        expect(freeText._parseFontStyle('underline bold', PdfFontStyle.regular)).toEqual(PdfFontStyle.underline | PdfFontStyle.bold);
        expect(freeText._parseFontStyle('italic underline strikeout', PdfFontStyle.regular)).toEqual(PdfFontStyle.italic | PdfFontStyle.underline | PdfFontStyle.strikeout);
        expect(freeText._parseFontStyle('bold italic underline strikeout', PdfFontStyle.regular)).toEqual(
            PdfFontStyle.bold |
            PdfFontStyle.italic |
            PdfFontStyle.underline |
            PdfFontStyle.strikeout
        );
        expect(freeText._getStyles(0)).toEqual(PdfFontStyle.regular);
        document.destroy();
    });
    it('1009268 - Unison selection set to true', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let form = document.form;
        document.form.fieldAutoNaming = false;
        let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        field.allowUnisonSelection = true;
        let first: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-20', {x: 0, y: 70, width: 20, height: 20}, page);
        let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('21-39', {x: 0, y: 100, width: 20,height: 20}, page);
        field.add(first);
        field.add(second);
        form.add(field);
        let field1: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        let first1: PdfRadioButtonListItem = new PdfRadioButtonListItem('21-39', {x: 40, y: 140, width: 20,height: 20}, page);
        let second1: PdfRadioButtonListItem = new PdfRadioButtonListItem('50-70', {x: 40, y: 170, width: 20, height: 20}, page);
        field1.add(first1);
        field1.add(second1);
        form.add(field1);
        let output = document.save();
        document.destroy();
        let loadedPdfDoc: PdfDocument = new PdfDocument(output);
        let lform = loadedPdfDoc.form;
        let lfield = lform.fieldAt(0) as PdfRadioButtonListField;
        let allow = lfield.allowUnisonSelection;
        expect(loadedPdfDoc.form.count).toEqual(1);
        expect(loadedPdfDoc.form.fieldAt(0).itemsCount).toEqual(4);
        expect(allow).toBe(true);
        let radioField = (loadedPdfDoc.form.fieldAt(0) as PdfRadioButtonListField);
        expect(radioField._dictionary.get('Ff')).toEqual(33587200);
        loadedPdfDoc.destroy();
    });
    it('1009268 - Unison selection set to false', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let form = document.form;
        document.form.fieldAutoNaming = false;
        let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        field.allowUnisonSelection = false;
        let first: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-20', {x: 0, y: 70, width: 20, height: 20}, page);
        let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('21-39', {x: 0, y: 100, width: 20,height: 20}, page);
        field.add(first);
        field.add(second);
        form.add(field);
        let field1: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        let first1: PdfRadioButtonListItem = new PdfRadioButtonListItem('21-39', {x: 40, y: 140, width: 20,height: 20}, page);
        let second1: PdfRadioButtonListItem = new PdfRadioButtonListItem('50-70', {x: 40, y: 170, width: 20, height: 20}, page);
        field1.add(first1);
        field1.add(second1);
        form.add(field1);
        let output = document.save();
        document.destroy();
        let loadedPdfDoc: PdfDocument = new PdfDocument(output);
        let lform = loadedPdfDoc.form;
        let lfield = lform.fieldAt(0) as PdfRadioButtonListField;
        let allow = lfield.allowUnisonSelection;
        expect(loadedPdfDoc.form.count).toEqual(1);
        expect(loadedPdfDoc.form.fieldAt(0).itemsCount).toEqual(4);
        expect(allow).toBe(false);
        let radioField = (loadedPdfDoc.form.fieldAt(0) as PdfRadioButtonListField);
        expect(radioField._dictionary.get('Ff')).toEqual(32768);
        loadedPdfDoc.destroy();
    });
    it('1008830 - Invalid password exception', () => {
        let document: PdfDocument = new PdfDocument(passwordInput, "vn,s(^%@#scCWW2421$%.0");
        expect(document).not.toBeUndefined();
        expect(document.pageCount).toEqual(1);
        document.destroy();
    });
	it('1009280 - Stamp Bounds Issue Coverage', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let annot: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({x: 40, y: 60, width: 80, height: 20});
		annot.icon = PdfRubberStampAnnotationIcon.approved;
        annot.setAppearance(true);
		page.annotations.add(annot);
        let updatedData = document.save();
        let expectedRect = annot._dictionary.get('Rect');
        expect(expectedRect).toEqual([80, 722, 160, 742]);
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0);
        annot = page.annotations.at(0) as PdfRubberStampAnnotation;
        page.annotations.remove(annot);
        let newAnnot = new PdfRubberStampAnnotation(annot.bounds);
        page.annotations.add(newAnnot);
        let actualRect = _updateBounds(newAnnot);
        expect(expectedRect).toEqual(actualRect);
        document.destroy();
    });
	it('1009218 - FreeText Creation Callout Coverage', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        let brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        let freeText0 = new PdfFreeTextAnnotation({ x: 80, y: 160, width: 100, height: 50 }, {
            textMarkUpColor: { r: 0, g: 128, b: 0 }, font: new PdfStandardFont(PdfFontFamily.helvetica, 7), text: 'Free Text with Callouts', borderColor: { r: 0, g: 0, b: 255 },
            border: new PdfAnnotationBorder({ width: 0.5 }), calloutLines: [{ x: 45, y: 220 }, { x: 60, y: 175 }, { x: 80, y: 175 }]
        });
        freeText0.flags = PdfAnnotationFlag.print;
        freeText0.rotationAngle = PdfRotationAngle.angle90;
        freeText0.color = { r: 255, g: 255, b: 0 };
        freeText0.setAppearance(true);
        page.graphics.drawString('Rotated FreeText Annotation', font, { x: 40, y: 130, width: 150, height: 30 }, brush);
        page.annotations.add(freeText0);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0) as PdfPage;
        let loadedFreeText = page.annotations.at(0) as PdfFreeTextAnnotation;
        let appearance = loadedFreeText._dictionary.get('AP').get('N');
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operator).toEqual('CS');
        expect(result[0]._operands).toEqual(['/DeviceRGB']);
        expect(result[1]._operator).toEqual('cs');
        expect(result[1]._operands).toEqual(['/DeviceRGB']);
        expect(result[2]._operator).toEqual('d');
        expect(result[2]._operands).toEqual(['[]', '0']);
        expect(result[3]._operator).toEqual('w');
        expect(result[3]._operands).toEqual(['0.500']);
        expect(result[4]._operator).toEqual('j');
        expect(result[4]._operands).toEqual(['0']);
        expect(result[5]._operator).toEqual('J');
        expect(result[5]._operands).toEqual(['0']);
        expect(result[6]._operator).toEqual('RG');
        expect(result[6]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[7]._operator).toEqual('m');
        expect(result[7]._operands).toEqual(['85.000', '582.000']);
        expect(result[8]._operator).toEqual('l');
        expect(result[8]._operands).toEqual(['100.000', '627.000']);
        expect(result[9]._operator).toEqual('l');
        expect(result[9]._operands).toEqual(['120.000', '627.000']);
        expect(result[10]._operator).toEqual('S');
        expect(result[10]._operands.length).toBe(0);
        expect(result[11]._operator).toEqual('q');
        expect(result[11]._operands.length).toBe(0);
        expect(result[12]._operator).toEqual('cm');
        expect(result[12]._operands).toEqual(['.00', '1.00', '-1.00', '.00', '.00', '.00']);
        expect(result[13]._operator).toEqual('d');
        expect(result[13]._operands).toEqual(['[]', '0']);
        expect(result[14]._operator).toEqual('w');
        expect(result[14]._operands).toEqual(['0.500']);
        expect(result[15]._operator).toEqual('j');
        expect(result[15]._operands).toEqual(['0']);
        expect(result[16]._operator).toEqual('J');
        expect(result[16]._operands).toEqual(['0']);
        expect(result[17]._operator).toEqual('RG');
        expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[18]._operator).toEqual('rg');
        expect(result[18]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[19]._operator).toEqual('re');
        expect(result[19]._operands).toEqual(['592.000', '-220.000', '50.000', '100.000']);
        expect(result[20]._operator).toEqual('B');
        expect(result[20]._operands.length).toBe(0);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands.length).toBe(0);
        expect(result[22]._operator).toEqual('rg');
        expect(result[22]._operands).toEqual(['0.000', '0.502', '0.000']);
        expect(result[23]._operator).toEqual('Tf');
        expect(result[23]._operands[1]).toEqual('7.000');
        expect(result[24]._operator).toEqual('Tr');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('Tc');
        expect(result[25]._operands).toEqual(['0.000']);
        expect(result[26]._operator).toEqual('Tw');
        expect(result[26]._operands).toEqual(['0.000']);
        expect(result[27]._operator).toEqual('Tz');
        expect(result[27]._operands).toEqual(['100.000']);
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '592.75', '-127.27']);
        expect(result[29]._operator).toEqual("'");
        expect(result[29]._operands).toEqual(['(Free Text with)']);
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '592.75', '-135.36']);
        expect(result[31]._operator).toEqual("'");
        expect(result[31]._operands).toEqual(['(Callouts)']);
        expect(result[32]._operator).toEqual('ET');
        expect(result[32]._operands.length).toBe(0);
        expect(result[33]._operator).toEqual('Q');
        expect(result[33]._operands.length).toBe(0);
        document.flatten = true;
        let updatedData1 = document.save();
        let resources = page._pageDictionary.get('Resources');
        let xObject = resources.get('XObject');
        xObject.forEach((key: string, value: any) => {
            let stream: any = xObject.get(key);
            let parser: _ContentParser = new _ContentParser(stream.getBytes());
            let result: _PdfRecord[] = parser._readContent();
            expect(result[0]._operator).toEqual('CS');
            expect(result[0]._operands).toEqual(['/DeviceRGB']);
            expect(result[1]._operator).toEqual('cs');
            expect(result[1]._operands).toEqual(['/DeviceRGB']);
            expect(result[2]._operator).toEqual('d');
            expect(result[2]._operands).toEqual(['[]', '0']);
            expect(result[3]._operator).toEqual('w');
            expect(result[3]._operands).toEqual(['0.500']);
            expect(result[4]._operator).toEqual('j');
            expect(result[4]._operands).toEqual(['0']);
            expect(result[5]._operator).toEqual('J');
            expect(result[5]._operands).toEqual(['0']);
            expect(result[6]._operator).toEqual('RG');
            expect(result[6]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[7]._operator).toEqual('m');
            expect(result[7]._operands).toEqual(['85.000', '582.000']);
            expect(result[8]._operator).toEqual('l');
            expect(result[8]._operands).toEqual(['100.000', '627.000']);
            expect(result[9]._operator).toEqual('l');
            expect(result[9]._operands).toEqual(['120.000', '627.000']);
            expect(result[10]._operator).toEqual('S');
            expect(result[10]._operands.length).toBe(0);
            expect(result[11]._operator).toEqual('q');
            expect(result[11]._operands.length).toBe(0);
            expect(result[12]._operator).toEqual('cm');
            expect(result[12]._operands).toEqual(['.00', '1.00', '-1.00', '.00', '.00', '.00']);
            expect(result[13]._operator).toEqual('d');
            expect(result[13]._operands).toEqual(['[]', '0']);
            expect(result[14]._operator).toEqual('w');
            expect(result[14]._operands).toEqual(['0.500']);
            expect(result[15]._operator).toEqual('j');
            expect(result[15]._operands).toEqual(['0']);
            expect(result[16]._operator).toEqual('J');
            expect(result[16]._operands).toEqual(['0']);
            expect(result[17]._operator).toEqual('RG');
            expect(result[17]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[18]._operator).toEqual('rg');
            expect(result[18]._operands).toEqual(['1.000', '1.000', '0.000']);
            expect(result[19]._operator).toEqual('re');
            expect(result[19]._operands).toEqual(['592.000', '-220.000', '50.000', '100.000']);
            expect(result[20]._operator).toEqual('B');
            expect(result[20]._operands.length).toBe(0);
            expect(result[21]._operator).toEqual('BT');
            expect(result[21]._operands.length).toBe(0);
            expect(result[22]._operator).toEqual('rg');
            expect(result[22]._operands).toEqual(['0.000', '0.502', '0.000']);
            expect(result[23]._operator).toEqual('Tf');
            expect(result[24]._operator).toEqual('Tr');
            expect(result[24]._operands).toEqual(['0']);
            expect(result[25]._operator).toEqual('Tc');
            expect(result[25]._operands).toEqual(['0.000']);
            expect(result[26]._operator).toEqual('Tw');
            expect(result[26]._operands).toEqual(['0.000']);
            expect(result[27]._operator).toEqual('Tz');
            expect(result[27]._operands).toEqual(['100.000']);
            expect(result[28]._operator).toEqual('Tm');
            expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '592.75', '-127.27']);
            expect(result[29]._operator).toEqual("'");
            expect(result[29]._operands).toEqual(['(Free Text with)']);
            expect(result[30]._operator).toEqual('Tm');
            expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '592.75', '-135.36']);
            expect(result[31]._operator).toEqual("'");
            expect(result[31]._operands).toEqual(['(Callouts)']);
            expect(result[32]._operator).toEqual('ET');
            expect(result[32]._operands.length).toBe(0);
            expect(result[33]._operator).toEqual('Q');
            expect(result[33]._operands.length).toBe(0);
        });
        document.destroy();
    });
    it('1009218 - FreeText Border Overlap Issue Flatten', () => {
        let document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        let freeText: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 309.75, y: 170.475, width: 113.25, height: 61.5 });
        freeText.borderColor = { r: 0, g: 0, b: 0 };
        freeText.author = 'Guest';
        freeText.lineEndingStyle = PdfLineEndingStyle.openArrow;
        freeText.annotationIntent = PdfAnnotationIntent.freeTextTypeWriter;
        freeText.font = new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
        freeText.subject = 'Text Box';
        freeText.text = 'anbuganesh bubu\nselect ksidd dkdkf f\ndfjdkfj lj l \n';
        freeText.border.width = 12;
        freeText.name = 'e2fb2bf3-9b41-4269-448c-4ee8bbf33d11';
        freeText.opacity = 1;
        freeText.textAlignment = PdfTextAlignment.left;
        freeText.textMarkUpColor = { r: 0, g: 0, b: 0 };
        freeText.flatten = true;
        freeText.setAppearance(true);
        page.annotations.add(freeText);
        let updatedData = document.save();
        let loadedPage = document.getPage(0) as PdfPage;
        let resources = loadedPage._pageDictionary.get('Resources');
        let xObject = resources.get('XObject');
        xObject.forEach((key: string, value: any) => {
            let stream: any = xObject.get(key);
            let parser: _ContentParser = new _ContentParser(stream._bytes);
            let result: _PdfRecord[] = parser._readContent();
            expect(result[0]._operator).toEqual('CS');
            expect(result[0]._operands).toEqual(['/DeviceRGB']);
            expect(result[1]._operator).toEqual('cs');
            expect(result[1]._operands).toEqual(['/DeviceRGB']);
            expect(result[2]._operator).toEqual('d');
            expect(result[2]._operands).toEqual(['[]', '0']);
            expect(result[3]._operator).toEqual('w');
            expect(result[3]._operands).toEqual(['12.000']);
            expect(result[4]._operator).toEqual('j');
            expect(result[4]._operands).toEqual(['0']);
            expect(result[5]._operator).toEqual('J');
            expect(result[5]._operands).toEqual(['0']);
            expect(result[6]._operator).toEqual('RG');
            expect(result[6]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(result[7]._operator).toEqual('re');
            expect(result[7]._operands).toEqual(['355.750', '576.025', '101.250', '49.500']);
            expect(result[8]._operator).toEqual('S');
            expect(result[8]._operands).toEqual([]);
            expect(result[9]._operator).toEqual('BT');
            expect(result[9]._operands).toEqual([]);
            expect(result[10]._operator).toEqual('rg');
            expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(result[11]._operator).toEqual('Tf');
            expect(result[12]._operator).toEqual('Tr');
            expect(result[12]._operands).toEqual(['0']);
            expect(result[13]._operator).toEqual('Tc');
            expect(result[13]._operands).toEqual(['0.000']);
            expect(result[14]._operator).toEqual('Tw');
            expect(result[14]._operands).toEqual(['0.000']);
            expect(result[15]._operator).toEqual('Tz');
            expect(result[15]._operands).toEqual(['100.000']);
            expect(result[16]._operator).toEqual('Tm');
            expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '373.75', '596.35']);
            expect(result[17]._operator).toEqual("'");
            expect(result[17]._operands).toEqual(['(anbuganes)']);
            expect(result[18]._operator).toEqual('ET');
            expect(result[18]._operands).toEqual([]);
        });
        document.destroy();
    });
	it('1012189 - Stamp Appearance Issue Coverage', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage() as PdfPage;
        let annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        });
        let rectangle = {
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        };
        let icon = 'Revised';
        let colors = { r: 25, g: 39, b: 96 };
        let textBrush = new PdfBrush(colors);
        let stampcolors = { r: 220, g: 227, b: 239 };
        let pens = new PdfPen(colors, 1);
        let stampBrush = new PdfBrush(stampcolors);
        annotation.author = 'مقبول';
        annotation.subject = 'Subject';
        annotation.flags = PdfAnnotationFlag.print;
        annotation.setValues('iconName', icon.toString());
        annotation.opacity = 1;
        page.annotations.add(annotation);
        let appearance: PdfTemplate = annotation.appearance.normal;
        let state = appearance.graphics.save();
        appearance.graphics.setTransparency(1);
        appearance.graphics.drawRoundedRectangle(
            {
                x: 0.5,
                y: 0.5,
                width: rectangle.width - 1,
                height: rectangle.height - 1,
            },
            10,
            pens,
            stampBrush
        );
        let text = 'By مقبول at 2/25/2026 4:36:34 PM';
        let stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.left;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        let stampFont = null;
        let detailsFont = null;
        let hasUniCode = false;
        let regex = /[\u0600-\u06FF]/;
        let flag = regex.test(text);
        if (flag) {
            hasUniCode = true;
        }
        if (hasUniCode) {
            stampFont = new PdfTrueTypeFont(
                ttfArialBase64,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfTrueTypeFont(
                ttfArialBase64,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        } else {
            stampFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        }
        let point1 = [0, 0];
        let point2 = [0, 0];
        let drawingPath = new PdfPath();
        point1 = [5, rectangle.height / 3];
        point2 = [5, rectangle.height - detailsFont.size * 3];
        drawingPath.addLine(
            { x: point1[0], y: point1[1] },
            { x: point2[0], y: point2[1] }
        );
        let stampTypeBounds = [
            drawingPath._points[0].x,
            drawingPath._points[0].y,
            0,
            0,
        ];
        let stampTypeBoundsVal = {
            x: stampTypeBounds[0],
            y: stampTypeBounds[1],
            width: stampTypeBounds[2],
            height: stampTypeBounds[3],
        };
        let stampTimeStampbounds = [
            drawingPath._points[1].x,
            drawingPath._points[1].y,
            rectangle.width + drawingPath._points[1].x,
            rectangle.height - drawingPath._points[1].y,
        ];
        let stampTimeStampboundsVal = {
            x: stampTimeStampbounds[0],
            y: stampTimeStampbounds[1],
            width: stampTimeStampbounds[2],
            height: stampTimeStampbounds[3],
        };
        appearance.graphics.drawString(
            icon.toUpperCase(),
            stampFont,
            stampTypeBoundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        appearance.graphics.drawString(
            text,
            detailsFont,
            stampTimeStampboundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        annotation._dictionary.set(
            'Name',
            _PdfName.get('#23D' + icon.split(' ').join(''))
        );
        appearance.graphics.restore(state);
        let updatedData = document.save();
        let updatedData1 = document.save();
        document.destroy();
        document = new PdfDocument(updatedData1);
        page = document.getPage(0) as PdfPage;
        let stampAnnotation = page.annotations.at(0) as PdfRubberStampAnnotation;
        let normalAppearance = stampAnnotation._dictionary.get('AP').get('N');
        let fontDictionary = normalAppearance.dictionary.get('Resources').get('Font');
        fontDictionary.forEach((key: string, value: any) => {
            let fontValue: any = fontDictionary.get(key);
            expect(fontValue).not.toBeNull();
        });
        document.destroy();
    });
	it('1012189 - Stamp Appearance Issue Coverage Flatten', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage() as PdfPage;
        let annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        });
        let rectangle = {
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        };
        let icon = 'Revised';
        let colors = { r: 25, g: 39, b: 96 };
        let textBrush = new PdfBrush(colors);
        let stampcolors = { r: 220, g: 227, b: 239 };
        let pens = new PdfPen(colors, 1);
        let stampBrush = new PdfBrush(stampcolors);
        annotation.author = 'مقبول';
        annotation.subject = 'Subject';
        annotation.flags = PdfAnnotationFlag.print;
        annotation.setValues('iconName', icon.toString());
        annotation.opacity = 1;
        page.annotations.add(annotation);
        let appearance: PdfTemplate = annotation.appearance.normal;
        let state = appearance.graphics.save();
        appearance.graphics.setTransparency(1);
        appearance.graphics.drawRoundedRectangle(
            {
                x: 0.5,
                y: 0.5,
                width: rectangle.width - 1,
                height: rectangle.height - 1,
            },
            10,
            pens,
            stampBrush
        );
        let text = 'By مقبول at 2/25/2026 4:36:34 PM';
        let stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.left;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        let stampFont = null;
        let detailsFont = null;
        let hasUniCode = false;
        let regex = /[\u0600-\u06FF]/;
        let flag = regex.test(text);
        if (flag) {
            hasUniCode = true;
        }
        if (hasUniCode) {
            stampFont = new PdfTrueTypeFont(
                ttfArialBase64,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfTrueTypeFont(
                ttfArialBase64,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        } else {
            stampFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        }
        let point1 = [0, 0];
        let point2 = [0, 0];
        let drawingPath = new PdfPath();
        point1 = [5, rectangle.height / 3];
        point2 = [5, rectangle.height - detailsFont.size * 3];
        drawingPath.addLine(
            { x: point1[0], y: point1[1] },
            { x: point2[0], y: point2[1] }
        );
        let stampTypeBounds = [
            drawingPath._points[0].x,
            drawingPath._points[0].y,
            0,
            0,
        ];
        let stampTypeBoundsVal = {
            x: stampTypeBounds[0],
            y: stampTypeBounds[1],
            width: stampTypeBounds[2],
            height: stampTypeBounds[3],
        };
        let stampTimeStampbounds = [
            drawingPath._points[1].x,
            drawingPath._points[1].y,
            rectangle.width + drawingPath._points[1].x,
            rectangle.height - drawingPath._points[1].y,
        ];
        let stampTimeStampboundsVal = {
            x: stampTimeStampbounds[0],
            y: stampTimeStampbounds[1],
            width: stampTimeStampbounds[2],
            height: stampTimeStampbounds[3],
        };
        appearance.graphics.drawString(
            icon.toUpperCase(),
            stampFont,
            stampTypeBoundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        appearance.graphics.drawString(
            text,
            detailsFont,
            stampTimeStampboundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        annotation._dictionary.set(
            'Name',
            _PdfName.get('#23D' + icon.split(' ').join(''))
        );
        appearance.graphics.restore(state);
        document.flatten = true;
        let updatedData = document.save();
        let updatedData1 = document.save();
        document.destroy();
        document = new PdfDocument(updatedData1);
        page = document.getPage(0) as PdfPage;
        let resources = page._pageDictionary.get('Resources');
        let xObject = resources.get('XObject');
        xObject.forEach((key: string, value: any) => {
            let stream: any = xObject.get(key);
            let fontDictionary = stream.dictionary.get('Resources').get('Font');
            fontDictionary.forEach((key: string, value: any) => {
                let fontValue: any = fontDictionary.get(key);
                expect(fontValue).not.toBeNull();
            });
        });
        document.destroy();
    });
	it('1012178 - Stamp with flatten', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        let page = document.getPage(0) as PdfPage;
        let annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        });
        let rectangle = {
            x: 100,
            y: 100,
            width: 200,
            height: 75,
        };
        let icon = 'Revised';
        let colors = { r: 25, g: 39, b: 96 };
        let textBrush = new PdfBrush(colors);
        let stampcolors = { r: 220, g: 227, b: 239 };
        let pens = new PdfPen(colors, 1);
        let stampBrush = new PdfBrush(stampcolors);
        annotation.author = 'مقبول';
        annotation.subject = 'Subject';
        annotation.flags = PdfAnnotationFlag.print;
        annotation.setValues('iconName', icon.toString());
        annotation.opacity = 1;
        page.annotations.add(annotation);
        let appearance: PdfTemplate = annotation.appearance.normal;
        let state = appearance.graphics.save();
        appearance.graphics.setTransparency(1);
        appearance.graphics.drawRoundedRectangle(
            {
                x: 0.5,
                y: 0.5,
                width: rectangle.width - 1,
                height: rectangle.height - 1,
            },
            10,
            pens,
            stampBrush
        );
        let text = 'By مقبول at 2/25/2026 4:36:34 PM';
        let stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.left;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        let stampFont = null;
        let detailsFont = null;
        let hasUniCode = false;
        let regex = /[\u0600-\u06FF]/;
        let flag = regex.test(text);
        if (flag) {
            hasUniCode = true;
        }
        if (hasUniCode) {
            stampFont = new PdfTrueTypeFont(
                ttfArialBase64,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfTrueTypeFont(
                ttfArialBase64,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        } else {
            stampFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                24,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
            detailsFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.bold | PdfFontStyle.italic
            );
        }
        let point1 = [0, 0];
        let point2 = [0, 0];
        let drawingPath = new PdfPath();
        point1 = [5, rectangle.height / 3];
        point2 = [5, rectangle.height - detailsFont.size * 3];
        drawingPath.addLine(
            { x: point1[0], y: point1[1] },
            { x: point2[0], y: point2[1] }
        );
        let stampTypeBounds = [
            drawingPath._points[0].x,
            drawingPath._points[0].y,
            0,
            0,
        ];
        let stampTypeBoundsVal = {
            x: stampTypeBounds[0],
            y: stampTypeBounds[1],
            width: stampTypeBounds[2],
            height: stampTypeBounds[3],
        };
        let stampTimeStampbounds = [
            drawingPath._points[1].x,
            drawingPath._points[1].y,
            rectangle.width + drawingPath._points[1].x,
            rectangle.height - drawingPath._points[1].y,
        ];
        let stampTimeStampboundsVal = {
            x: stampTimeStampbounds[0],
            y: stampTimeStampbounds[1],
            width: stampTimeStampbounds[2],
            height: stampTimeStampbounds[3],
        };
        appearance.graphics.drawString(
            icon.toUpperCase(),
            stampFont,
            stampTypeBoundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        appearance.graphics.drawString(
            text,
            detailsFont,
            stampTimeStampboundsVal,
            null as any,
            textBrush,
            stringFormat
        );
        annotation._dictionary.set(
            'Name',
            _PdfName.get('#23D' + icon.split(' ').join(''))
        );
        appearance.graphics.restore(state);
        document.fileStructure.isIncrementalUpdate = false;
        document.flatten = true;
        let updatedData1 = document.save();
        document.destroy();
        document = new PdfDocument(updatedData1);
        page = document.getPage(0) as PdfPage;
        let resources = page._pageDictionary.get('Resources');
        let xObject = resources.get('XObject');
        xObject.forEach((key: string, value: any) => {
            let stream: any = xObject.get(key);
            let fontDictionary = stream.dictionary.get('Resources').get('Font');
            fontDictionary.forEach((key: string, value: any) => {
                let fontValue: any = fontDictionary.get(key);
                let descendantFont = fontValue.getArray('DescendantFonts');
                let fontDescriptor = descendantFont[0].get('FontDescriptor');
                expect(fontDescriptor instanceof _PdfDictionary).toBeTruthy();
                let fontFile = fontDescriptor.get('FontFile2');
                expect(fontFile).toBeDefined();
                expect(fontValue).not.toBeNull();
            });
        });
        document.destroy();
    });
    it('1014896 - Checkbox export xfdf', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let field2: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2.exportValue = '1';
        field2.checked = true;
        form.add(field2);
        let field1: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1.exportValue = '1';
        form.add(field1);
        let field3: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3.exportValue = '2';
        form.add(field3);
        let field4: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4.exportValue = '2';
        form.add(field4);
        let field5: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5.exportValue = '1';
        form.add(field5);
        let field6: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6.exportValue = '1';
        field6.checked = true;
        form.add(field6);
        let field7: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7.exportValue = '2';
        form.add(field7);
        let field8: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8.exportValue = '2';
        form.add(field8);
        let output = document.save();
        let loadedGroupedCheckBox = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(loadedGroupedCheckBox.itemsCount).toEqual(4);
        let firstItem = loadedGroupedCheckBox.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        let secondItem = loadedGroupedCheckBox.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        let thirdItem = loadedGroupedCheckBox.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        let fourthItem = loadedGroupedCheckBox.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let loadedGroupedCheckBox1 = document.form.fieldAt(1) as PdfCheckBoxField;
        firstItem = loadedGroupedCheckBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = loadedGroupedCheckBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = loadedGroupedCheckBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = loadedGroupedCheckBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.xfdf;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('<?xml version="1.0" encoding="utf-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><f href="" /><fields><field name="CheckBox1"><value>1</value></field><field name="CheckBox2"><value>1</value></field></fields><ids original="" modified="" /></xfdf>')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        page = document.addPage(0);
        form = document.form;
        let field2_1 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2_1.exportValue = '1';
        form.add(field2_1);
        let field1_1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1_1.exportValue = '1';
        form.add(field1_1);
        let field3_1 = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3_1.exportValue = '2';
        form.add(field3_1);
        let field4_1 = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4_1.exportValue = '2';
        form.add(field4_1);
        let field5_1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5_1.exportValue = '1';
        form.add(field5_1);
        let field6_1 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6_1.exportValue = '1';
        form.add(field6_1);
        let field7_1 = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7_1.exportValue = '2';
        form.add(field7_1);
        let field8_1 = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8_1.exportValue = '2';
        form.add(field8_1);
        let field9 = new PdfCheckBoxField('CheckBox3', {x: 10, y: 90, width: 20, height: 20}, page);
        field9.exportValue = '3';
        form.add(field9);
        let field10 = new PdfCheckBoxField('CheckBox3', {x: 50, y: 90, width: 20, height: 20}, page);
        field10.exportValue = '3';
        form.add(field10);
        document.form.setDefaultAppearance(false);
        let save = document.save();
        document.destroy();
        document = new PdfDocument(save);
        document.importFormData(exportedData, DataFormat.xfdf);
        let importSave = document.save();
        let checkBox1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(checkBox1._dictionary.get('AS').name).toEqual('1');
        expect(checkBox1._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(checkBox2._dictionary.get('AS').name).toEqual('1');
        expect(checkBox2._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox2.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox2.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox2.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox2.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox3 = document.form.fieldAt(2) as PdfCheckBoxField;
        firstItem = checkBox3.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('Off');
        secondItem = checkBox3.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('Off');
        document.destroy();
    });
    it('1014896 - Checkbox export with only exportValue 2 checked xml', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let cb1_ev1_a = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        cb1_ev1_a.exportValue = '1';
        form.add(cb1_ev1_a);
        let cb1_ev1_b = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        cb1_ev1_b.exportValue = '1';
        form.add(cb1_ev1_b);
        let cb1_ev2_a = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        cb1_ev2_a.exportValue = '2';
        cb1_ev2_a.checked = true;
        form.add(cb1_ev2_a);
        let cb1_ev2_b = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        cb1_ev2_b.exportValue = '2';
        form.add(cb1_ev2_b);
        let cb2_ev1_a = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        cb2_ev1_a.exportValue = '1';
        form.add(cb2_ev1_a);
        let cb2_ev1_b = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        cb2_ev1_b.exportValue = '1';
        form.add(cb2_ev1_b);
        let cb2_ev2_a = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        cb2_ev2_a.exportValue = '2';
        cb2_ev2_a.checked = true;
        form.add(cb2_ev2_a);
        let cb2_ev2_b = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        cb2_ev2_b.exportValue = '2';
        form.add(cb2_ev2_b);
        let output = document.save();
        let groupedCB1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(groupedCB1.itemsCount).toEqual(4);
        let item1 = groupedCB1.itemAt(0);
        expect(item1._dictionary.get('AS').name).toEqual('Off');
        let item2 = groupedCB1.itemAt(1);
        expect(item2._dictionary.get('AS').name).toEqual('Off');
        let item3 = groupedCB1.itemAt(2);
        expect(item3._dictionary.get('AS').name).toEqual('2');
        expect(item3._dictionary.get('V').name).toEqual('2');
        let item4 = groupedCB1.itemAt(3);
        expect(item4._dictionary.get('AS').name).toEqual('2');
        let groupedCB2 = document.form.fieldAt(1) as PdfCheckBoxField;
        let cb2item1 = groupedCB2.itemAt(0);
        expect(cb2item1._dictionary.get('AS').name).toEqual('Off');
        let cb2item2 = groupedCB2.itemAt(1);
        expect(cb2item2._dictionary.get('AS').name).toEqual('Off');
        let cb2item3 = groupedCB2.itemAt(2);
        expect(cb2item3._dictionary.get('AS').name).toEqual('2');
        expect(cb2item3._dictionary.get('V').name).toEqual('2');
        let cb2item4 = groupedCB2.itemAt(3);
        expect(cb2item4._dictionary.get('AS').name).toEqual('2');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.xml;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('<?xml version="1.0" encoding="utf-8"?><fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/"><CheckBox1>2</CheckBox1><CheckBox2>2</CheckBox2></fields>')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        page = document.addPage(0);
        form = document.form;
        let imp_cb1_ev1_a = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev1_a.exportValue = '1';
        form.add(imp_cb1_ev1_a);
        let imp_cb1_ev1_b = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev1_b.exportValue = '1';
        form.add(imp_cb1_ev1_b);
        let imp_cb1_ev2_a = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev2_a.exportValue = '2';
        form.add(imp_cb1_ev2_a);
        let imp_cb1_ev2_b = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev2_b.exportValue = '2';
        form.add(imp_cb1_ev2_b);
        let imp_cb2_ev1_a = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev1_a.exportValue = '1';
        form.add(imp_cb2_ev1_a);
        let imp_cb2_ev1_b = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev1_b.exportValue = '1';
        form.add(imp_cb2_ev1_b);
        let imp_cb2_ev2_a = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev2_a.exportValue = '2';
        form.add(imp_cb2_ev2_a);
        let imp_cb2_ev2_b = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev2_b.exportValue = '2';
        form.add(imp_cb2_ev2_b);
        document.form.setDefaultAppearance(false);
        let save = document.save();
        document.destroy();
        document = new PdfDocument(save);
        document.importFormData(exportedData, DataFormat.xml);
        let importSave = document.save();
        let importCB1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(importCB1._dictionary.get('AS').name).toEqual('2');
        let impItem1 = importCB1.itemAt(0);
        expect(impItem1._dictionary.get('AS').name).toEqual('Off');
        let impItem2 = importCB1.itemAt(1);
        expect(impItem2._dictionary.get('AS').name).toEqual('Off');
        let impItem3 = importCB1.itemAt(2);
        expect(impItem3._dictionary.get('AS').name).toEqual('2');
        expect(impItem3._dictionary.get('V').name).toEqual('2');
        let impItem4 = importCB1.itemAt(3);
        expect(impItem4._dictionary.get('AS').name).toEqual('2');
        expect(impItem4._dictionary.get('V').name).toEqual('2');
        let importCB2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(importCB2._dictionary.get('AS').name).toEqual('2');
        expect(importCB2._dictionary.get('V').name).toEqual('2');
        let impCB2Item1 = importCB2.itemAt(0);
        expect(impCB2Item1._dictionary.get('AS').name).toEqual('Off');
        let impCB2Item2 = importCB2.itemAt(1);
        expect(impCB2Item2._dictionary.get('AS').name).toEqual('Off');
        let impCB2Item3 = importCB2.itemAt(2);
        expect(impCB2Item3._dictionary.get('AS').name).toEqual('2');
        expect(impCB2Item3._dictionary.get('V').name).toEqual('2');
        let impCB2Item4 = importCB2.itemAt(3);
        expect(impCB2Item4._dictionary.get('AS').name).toEqual('2');
        expect(impCB2Item4._dictionary.get('V').name).toEqual('2');
        document.destroy();
    });
    it('1014896 - Checkbox export with both exportValue 1 and 2 checked fdf', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let cb1_ev1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        cb1_ev1.exportValue = '1';
        form.add(cb1_ev1);
        let cb1_ev2 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        cb1_ev2.exportValue = '2';
        cb1_ev2.checked = true;
        form.add(cb1_ev2);
        let cb1_ev1_b = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        cb1_ev1_b.exportValue = '1';
        form.add(cb1_ev1_b);
        let cb1_ev2_b = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        cb1_ev2_b.exportValue = '2';
        form.add(cb1_ev2_b);
        let cb2_ev1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        cb2_ev1.exportValue = '1';
        cb2_ev1.checked = true;
        form.add(cb2_ev1);
        let cb2_ev2 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        cb2_ev2.exportValue = '2';
        form.add(cb2_ev2);
        let cb2_ev1_b = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        cb2_ev1_b.exportValue = '1';
        form.add(cb2_ev1_b);
        let cb2_ev2_b = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        cb2_ev2_b.exportValue = '2';
        form.add(cb2_ev2_b);
        let output = document.save();
        let groupedCB1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(groupedCB1.itemsCount).toEqual(4);
        let item1 = groupedCB1.itemAt(0);
        expect(item1._dictionary.get('AS').name).toEqual('Off');
        let item2 = groupedCB1.itemAt(1);
        expect(item2._dictionary.get('AS').name).toEqual('2');
        expect(item2._dictionary.get('V').name).toEqual('2');
        let item3 = groupedCB1.itemAt(2);
        expect(item3._dictionary.get('AS').name).toEqual('Off');
        let item4 = groupedCB1.itemAt(3);
        expect(item4._dictionary.get('AS').name).toEqual('2');
        expect(item4._dictionary.get('V').name).toEqual('2');
        let groupedCB2 = document.form.fieldAt(1) as PdfCheckBoxField;
        let g2item1 = groupedCB2.itemAt(0);
        expect(g2item1._dictionary.get('AS').name).toEqual('1');
        expect(g2item1._dictionary.get('V').name).toEqual('1');
        let g2item2 = groupedCB2.itemAt(1);
        expect(g2item2._dictionary.get('AS').name).toEqual('Off');
        let g2item3 = groupedCB2.itemAt(2);
        expect(g2item3._dictionary.get('AS').name).toEqual('1');
        expect(g2item3._dictionary.get('V').name).toEqual('1');
        let g2item4 = groupedCB2.itemAt(3);
        expect(g2item4._dictionary.get('AS').name).toEqual('Off');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.fdf;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('Fields[<</T(CheckBox1)/V/2>><</T(CheckBox2)/V/1>>]')).toBeTruthy();
        document.destroy();
        document = new PdfDocument();
        page = document.addPage(0);
        form = document.form;
        let imp_cb1_ev1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev1.exportValue = '1';
        form.add(imp_cb1_ev1);
        let imp_cb1_ev2 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev2.exportValue = '2';
        form.add(imp_cb1_ev2);
        let imp_cb1_ev1_b = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev1_b.exportValue = '1';
        form.add(imp_cb1_ev1_b);
        let imp_cb1_ev2_b = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        imp_cb1_ev2_b.exportValue = '2';
        form.add(imp_cb1_ev2_b);
        let imp_cb2_ev1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev1.exportValue = '1';
        form.add(imp_cb2_ev1);
        let imp_cb2_ev2 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev2.exportValue = '2';
        form.add(imp_cb2_ev2);
        let imp_cb2_ev1_b = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev1_b.exportValue = '1';
        form.add(imp_cb2_ev1_b);
        let imp_cb2_ev2_b = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        imp_cb2_ev2_b.exportValue = '2';
        form.add(imp_cb2_ev2_b);
        document.form.setDefaultAppearance(false);
        let save = document.save();
        document.destroy();
        document = new PdfDocument(save);
        document.importFormData(exportedData, DataFormat.fdf);
        let importSave = document.save();
        let importCB1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(importCB1.itemsCount).toEqual(4);
        expect(importCB1._dictionary.get('AS').name).toEqual('2');
        expect(importCB1._dictionary.get('V').name).toEqual('2');
        let importCB1_item0 = importCB1.itemAt(0);
        expect(importCB1_item0._dictionary.get('AS').name).toEqual('Off');
        let importCB1_item1 = importCB1.itemAt(1);
        expect(importCB1_item1._dictionary.get('AS').name).toEqual('2');
        expect(importCB1_item1._dictionary.get('V').name).toEqual('2');
        let importCB1_item2 = importCB1.itemAt(2);
        expect(importCB1_item2._dictionary.get('AS').name).toEqual('Off');
        let importCB1_item3 = importCB1.itemAt(3);
        expect(importCB1_item3._dictionary.get('AS').name).toEqual('2');
        expect(importCB1_item3._dictionary.get('V').name).toEqual('2');
        let importCB2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(importCB2.itemsCount).toEqual(4);
        expect(importCB2._dictionary.get('AS').name).toEqual('1');
        expect(importCB2._dictionary.get('V').name).toEqual('1');
        let importCB2_item0 = importCB2.itemAt(0);
        expect(importCB2_item0._dictionary.get('AS').name).toEqual('1');
        expect(importCB2_item0._dictionary.get('V').name).toEqual('1');
        let importCB2_item1 = importCB2.itemAt(1);
        expect(importCB2_item1._dictionary.get('AS').name).toEqual('Off');
        let importCB2_item2 = importCB2.itemAt(2);
        expect(importCB2_item2._dictionary.get('AS').name).toEqual('1');
        expect(importCB2_item2._dictionary.get('V').name).toEqual('1');
        let importCB2_item3 = importCB2.itemAt(3);
        expect(importCB2_item3._dictionary.get('AS').name).toEqual('Off');
        document.destroy();
    });
    it('1015816 - drawString with mixed special chars (backslash, newLine)', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage(0) as PdfPage;
        page.graphics.drawString('(Hello\rWorld\\\\\\\\\\Text)', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 50, y: 110, width: 400, height: 200 }, new PdfPen({ r: 0, g: 0, b: 0 }, 1));
        let save = document.save();
        let reloaded: PdfDocument = new PdfDocument(save);
        page = document.getPage(0) as PdfPage;
        let contents: any = page._pageDictionary.getArray('Contents');
        let parser: _ContentParser = new _ContentParser(contents[2]._bytes);
        let result: _PdfRecord[] = parser._readContent();
        expect(result[21]._operands).toEqual(['(\\(Hello)']);
        expect(result[23]._operands).toEqual(['(World\\\\\\\\\\\\\\\\\\\\Text\\))']);
        reloaded.destroy();
        document.destroy();
    });
    it('1017175 - crossReference._writeObject writes number correctly', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        const buffer: number[] = [];
        expect(document).toBeDefined();
        xref._writeObject(123, buffer);
        const out: string = String.fromCharCode.apply(null, buffer as any);
        expect(out.indexOf('123\n')).not.toEqual(-1);
        document.destroy();
    });
    it('1017175 - crossReference._writeObject writes ASCII string as literal', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        const buffer: number[] = [];
        xref._writeObject('HelloPDF', buffer);
        const out: string = String.fromCharCode.apply(null, buffer as any);
        expect(out.indexOf('(HelloPDF)\n')).not.toEqual(-1);
        document.destroy();
    });
    it('1017175 - crossReference._writeObject writes _PdfName with space replaced', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        const buffer: number[] = [];
        const name = _PdfName.get('A B');
        xref._writeObject(name, buffer);
        const out: string = String.fromCharCode.apply(null, buffer as any);
        expect(out.indexOf('/A#20B')).not.toEqual(-1);
        document.destroy();
    });
    it('1017175 - crossReference._writeObject handles arrays with references, nested arrays, names and unicode hex', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        const buffer: number[] = [];
        const ref = new _PdfReference(5, 0);
        const nestedName = _PdfName.get('Nested');
        const unicodeStr = 'hé';
        const arr: any[] = [ref, [nestedName, unicodeStr]];
        xref._writeObject(arr, buffer);
        const out: string = String.fromCharCode.apply(null, buffer as any);
        expect(out.indexOf('[ ')).not.toEqual(-1);
        expect(out.indexOf('5 0 R')).not.toEqual(-1);
        expect(out.indexOf('/Nested')).not.toEqual(-1);
        document.destroy();
    });
    it('1017175 - crossReference._writeObjectToBuffer returns early for empty array values', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        const buffer: number[] = [];
        const key = new _PdfReference(10, 0);
        const objectStreamCollection = new Map<any, any>();
        xref._writeObjectToBuffer(key, [], buffer, objectStreamCollection);
        expect(buffer.length).toEqual(0);
        document.destroy();
    });
    it('1017175 - crossReference._writeObjectToBuffer writes a _PdfName in table mode (writes obj header/footer)', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: any = document._crossReference;
        xref._indexes = [];
        document.fileStructure._crossReferenceType = PdfCrossReferenceType.table;
        const buffer: number[] = [];
        const key = new _PdfReference(11, 0);
        const val = _PdfName.get('TestName');
        const objectStreamCollection = new Map<any, any>();
        xref._writeObjectToBuffer(key, val, buffer, objectStreamCollection);
        const out: string = String.fromCharCode.apply(null, buffer as any);
        expect(out.indexOf('11 0 obj') !== -1).toBeTruthy();
        expect(out.indexOf('/TestName') !== -1).toBeTruthy();
        expect(out.indexOf('endobj') !== -1).toBeTruthy();
        document.fileStructure._crossReferenceType = PdfCrossReferenceType.stream;
        xref._writeObjectToBuffer(key, val, buffer, objectStreamCollection);
        expect(xref._objectStream._collection).toEqual([11, 1]);
        document.destroy();
    });
    it('1014896 - Combo box color issue', () => {
		const document: PdfDocument = new PdfDocument();
		const page: PdfPage = document.addPage();
		const combo: PdfComboBoxField = new PdfComboBoxField(page, 'Dropdown1', { x: 106.875, y: 43.92, width: 148.5, height: 18 });
		combo.addItem(new PdfListFieldItem('1', '1'));
		combo.addItem(new PdfListFieldItem('2', '2'));
		combo.addItem(new PdfListFieldItem('3', '3'));
		combo.selectedIndex = 0;
		combo.color = { r: 244, g: 67, b: 54 };
		document.form.add(combo);
		document.form.setDefaultAppearance(false);
		const updatedData = document.save();
		document.destroy();
		const loaded: PdfDocument = new PdfDocument(updatedData);
		const loadedCombo = loaded.form.fieldAt(0) as PdfComboBoxField;
		const ap = loadedCombo.itemAt(0)._dictionary.get('AP');
		const appearance = ap.get('N');
		const parser: _ContentParser = new _ContentParser(appearance.getBytes());
		const records: _PdfRecord[] = parser._readContent();
		const rgRecords: _PdfRecord[] = records.filter(r => r._operator === 'rg');
		expect(rgRecords.length).toBeGreaterThan(0);
		const expected = ['0.957', '0.263', '0.212'];
		if (rgRecords) {
			expect(rgRecords[1]._operands).toEqual(expected);
		}
		loaded.destroy();
	});
    it('1017319 - PdfField.name - multiple names reversed join', () => {
        const document = new PdfDocument();
        document.addPage();
        const page = document.getPage(0);
        const form = document.form;
        let parentDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        parentDictionary.set('T', 'Two');
        let parentRef = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(parentRef, parentDictionary);
        const field: any = new PdfTextBoxField(page, 'FirstName', { x: 10, y: 10, width: 100, height: 50 });
        expect(field.name).toEqual('FirstName');
        field._dictionary.set('Parent', parentRef);
        form.add(field);
        field._name = undefined;
        expect(field.name).toBe('Two.FirstName');
        document.destroy();
    });
    it('1017319 - _XfdfDocument._importFormNodes - stores value and full name', () => {
        const doc = new _XfdfDocument();
        const parent = document.createElement('field');
        parent.setAttribute('name', 'parent');
        const child = document.createElement('field');
        child.setAttribute('name', 'child');
        const leaf = document.createElement('field');
        leaf.setAttribute('name', 'leaf');
        const val = document.createElement('value');
        val.textContent = 'v1';
        leaf.appendChild(val);
        child.appendChild(leaf);
        parent.appendChild(child);
        doc._importFormNodes([parent]);
        const values = doc._fields.get('parent.child.leaf');
        expect(values).toBeDefined();
        expect(values!.length).toBe(1);
        expect(values![0]).toBe('v1');
        const leaf2 = document.createElement('field');
        leaf2.setAttribute('name', 'leaf');
        const vr = document.createElement('value-richtext');
        vr.innerHTML = '<body><p>t1</p><p>t2</p></body>';
        leaf2.appendChild(vr);
        child.appendChild(leaf2);
        doc._importFormNodes([parent]);
        const values2 = doc._fields.get('parent.child.leaf');
        expect(values2).toBeDefined();
        expect(values2!.length).toBeGreaterThan(0);
        expect(values2![0]).toBeDefined();
    });
    it('1014896 - Checkbox export xfdf import', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let field2: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2.exportValue = '1';
        field2.checked = true;
        form.add(field2);
        let field1: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1.exportValue = '1';
        form.add(field1);
        let field3: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3.exportValue = '2';
        form.add(field3);
        let field4: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4.exportValue = '2';
        form.add(field4);
        let field5: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5.exportValue = '1';
        form.add(field5);
        let field6: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6.exportValue = '1';
        field6.checked = true;
        form.add(field6);
        let field7: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7.exportValue = '2';
        form.add(field7);
        let field8: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8.exportValue = '2';
        form.add(field8);
        let output = document.save();
        let loadedGroupedCheckBox = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(loadedGroupedCheckBox.itemsCount).toEqual(4);
        let firstItem = loadedGroupedCheckBox.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        let secondItem = loadedGroupedCheckBox.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        let thirdItem = loadedGroupedCheckBox.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        let fourthItem = loadedGroupedCheckBox.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let loadedGroupedCheckBox1 = document.form.fieldAt(1) as PdfCheckBoxField;
        firstItem = loadedGroupedCheckBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = loadedGroupedCheckBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = loadedGroupedCheckBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = loadedGroupedCheckBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.xfdf;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('<?xml version="1.0" encoding="utf-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><f href="" /><fields><field name="CheckBox1"><value>1</value></field><field name="CheckBox2"><value>1</value></field></fields><ids original="" modified="" /></xfdf>')).toBeTruthy();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0);
        form = document.form;
        for(let j: number = form.count - 1; j >= 0; j--) {
            document.form.removeField(document.form.fieldAt(j));
        }
        let field2_1 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2_1.exportValue = '1';
        form.add(field2_1);
        let field1_1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1_1.exportValue = '1';
        form.add(field1_1);
        let field3_1 = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3_1.exportValue = '2';
        form.add(field3_1);
        let field4_1 = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4_1.exportValue = '2';
        form.add(field4_1);
        let field5_1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5_1.exportValue = '1';
        form.add(field5_1);
        let field6_1 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6_1.exportValue = '1';
        form.add(field6_1);
        let field7_1 = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7_1.exportValue = '2';
        form.add(field7_1);
        let field8_1 = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8_1.exportValue = '2';
        form.add(field8_1);
        let field9 = new PdfCheckBoxField('CheckBox3', {x: 10, y: 90, width: 20, height: 20}, page);
        field9.exportValue = '3';
        form.add(field9);
        let field10 = new PdfCheckBoxField('CheckBox3', {x: 50, y: 90, width: 20, height: 20}, page);
        field10.exportValue = '3';
        form.add(field10);
        document.form.setDefaultAppearance(false);
        document.importFormData(exportedData, DataFormat.xfdf);
        let importSave = document.save();
        let checkBox1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(checkBox1._dictionary.get('AS').name).toEqual('1');
        expect(checkBox1._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(checkBox2._dictionary.get('AS').name).toEqual('1');
        expect(checkBox2._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox2.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox2.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox2.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox2.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox3 = document.form.fieldAt(2) as PdfCheckBoxField;
        firstItem = checkBox3.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('Off');
        secondItem = checkBox3.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('Off');
        document.destroy();
    });
    it('1014896 - Checkbox export json import', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let field2: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2.exportValue = '1';
        field2.checked = true;
        form.add(field2);
        let field1: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1.exportValue = '1';
        form.add(field1);
        let field3: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3.exportValue = '2';
        form.add(field3);
        let field4: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4.exportValue = '2';
        form.add(field4);
        let field5: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5.exportValue = '1';
        form.add(field5);
        let field6: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6.exportValue = '1';
        field6.checked = true;
        form.add(field6);
        let field7: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7.exportValue = '2';
        form.add(field7);
        let field8: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8.exportValue = '2';
        form.add(field8);
        let output = document.save();
        let loadedGroupedCheckBox = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(loadedGroupedCheckBox.itemsCount).toEqual(4);
        let firstItem = loadedGroupedCheckBox.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        let secondItem = loadedGroupedCheckBox.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        let thirdItem = loadedGroupedCheckBox.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        let fourthItem = loadedGroupedCheckBox.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let loadedGroupedCheckBox1 = document.form.fieldAt(1) as PdfCheckBoxField;
        firstItem = loadedGroupedCheckBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = loadedGroupedCheckBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = loadedGroupedCheckBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = loadedGroupedCheckBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.json;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('{"CheckBox1":"1","CheckBox2":"1"}')).toBeTruthy();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0);
        form = document.form;
        for(let j: number = form.count - 1; j >= 0; j--) {
            document.form.removeField(document.form.fieldAt(j));
        }
        let field2_1 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2_1.exportValue = '1';
        form.add(field2_1);
        let field1_1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1_1.exportValue = '1';
        form.add(field1_1);
        let field3_1 = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3_1.exportValue = '2';
        form.add(field3_1);
        let field4_1 = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4_1.exportValue = '2';
        form.add(field4_1);
        let field5_1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5_1.exportValue = '1';
        form.add(field5_1);
        let field6_1 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6_1.exportValue = '1';
        form.add(field6_1);
        let field7_1 = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7_1.exportValue = '2';
        form.add(field7_1);
        let field8_1 = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8_1.exportValue = '2';
        form.add(field8_1);
        let field9 = new PdfCheckBoxField('CheckBox3', {x: 10, y: 90, width: 20, height: 20}, page);
        field9.exportValue = '3';
        form.add(field9);
        let field10 = new PdfCheckBoxField('CheckBox3', {x: 50, y: 90, width: 20, height: 20}, page);
        field10.exportValue = '3';
        form.add(field10);
        document.form.setDefaultAppearance(false);
        document.importFormData(exportedData, DataFormat.json);
        let importSave = document.save();
        let checkBox1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(checkBox1._dictionary.get('AS').name).toEqual('1');
        expect(checkBox1._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(checkBox2._dictionary.get('AS').name).toEqual('1');
        expect(checkBox2._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox2.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox2.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox2.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox2.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox3 = document.form.fieldAt(2) as PdfCheckBoxField;
        firstItem = checkBox3.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('Off');
        secondItem = checkBox3.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('Off');
        document.destroy();
    });
    it('1014896 - Checkbox export xml import', () => {
        let document: PdfDocument = new PdfDocument();
        let form: PdfForm = document.form;
        let page: PdfPage = document.addPage(0);
        let field2: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2.exportValue = '1';
        field2.checked = true;
        form.add(field2);
        let field1: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1.exportValue = '1';
        form.add(field1);
        let field3: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3.exportValue = '2';
        form.add(field3);
        let field4: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4.exportValue = '2';
        form.add(field4);
        let field5: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5.exportValue = '1';
        form.add(field5);
        let field6: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6.exportValue = '1';
        field6.checked = true;
        form.add(field6);
        let field7: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7.exportValue = '2';
        form.add(field7);
        let field8: PdfCheckBoxField = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8.exportValue = '2';
        form.add(field8);
        let output = document.save();
        let loadedGroupedCheckBox = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(loadedGroupedCheckBox.itemsCount).toEqual(4);
        let firstItem = loadedGroupedCheckBox.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        let secondItem = loadedGroupedCheckBox.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        let thirdItem = loadedGroupedCheckBox.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        let fourthItem = loadedGroupedCheckBox.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let loadedGroupedCheckBox1 = document.form.fieldAt(1) as PdfCheckBoxField;
        firstItem = loadedGroupedCheckBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = loadedGroupedCheckBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = loadedGroupedCheckBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = loadedGroupedCheckBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.xml;
        let exportedData = document.exportFormData(settings);
        let exportedString = _bytesToString(exportedData);
        expect(exportedString.includes('<?xml version="1.0" encoding="utf-8"?><fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/"><CheckBox1>1</CheckBox1><CheckBox2>1</CheckBox2></fields>')).toBeTruthy();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0);
        form = document.form;
        for(let j: number = form.count - 1; j >= 0; j--) {
            document.form.removeField(document.form.fieldAt(j));
        }
        let field2_1 = new PdfCheckBoxField('CheckBox1', {x: 50, y: 10, width: 20, height: 20}, page);
        field2_1.exportValue = '1';
        form.add(field2_1);
        let field1_1 = new PdfCheckBoxField('CheckBox1', {x: 10, y: 10, width: 20, height: 20}, page);
        field1_1.exportValue = '1';
        form.add(field1_1);
        let field3_1 = new PdfCheckBoxField('CheckBox1', {x: 90, y: 10, width: 20, height: 20}, page);
        field3_1.exportValue = '2';
        form.add(field3_1);
        let field4_1 = new PdfCheckBoxField('CheckBox1', {x: 120, y: 10, width: 20, height: 20}, page);
        field4_1.exportValue = '2';
        form.add(field4_1);
        let field5_1 = new PdfCheckBoxField('CheckBox2', {x: 10, y: 50, width: 20, height: 20}, page);
        field5_1.exportValue = '1';
        form.add(field5_1);
        let field6_1 = new PdfCheckBoxField('CheckBox2', {x: 50, y: 50, width: 20, height: 20}, page);
        field6_1.exportValue = '1';
        form.add(field6_1);
        let field7_1 = new PdfCheckBoxField('CheckBox2', {x: 90, y: 50, width: 20, height: 20}, page);
        field7_1.exportValue = '2';
        form.add(field7_1);
        let field8_1 = new PdfCheckBoxField('CheckBox2', {x: 120, y: 50, width: 20, height: 20}, page);
        field8_1.exportValue = '2';
        form.add(field8_1);
        let field9 = new PdfCheckBoxField('CheckBox3', {x: 10, y: 90, width: 20, height: 20}, page);
        field9.exportValue = '3';
        form.add(field9);
        let field10 = new PdfCheckBoxField('CheckBox3', {x: 50, y: 90, width: 20, height: 20}, page);
        field10.exportValue = '3';
        form.add(field10);
        document.form.setDefaultAppearance(false);
        document.importFormData(exportedData, DataFormat.xml);
        let importSave = document.save();
        let checkBox1 = document.form.fieldAt(0) as PdfCheckBoxField;
        expect(checkBox1._dictionary.get('AS').name).toEqual('1');
        expect(checkBox1._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox1.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox1.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox1.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox1.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox2 = document.form.fieldAt(1) as PdfCheckBoxField;
        expect(checkBox2._dictionary.get('AS').name).toEqual('1');
        expect(checkBox2._dictionary.get('V').name).toEqual('1');
        firstItem = checkBox2.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('1');
        expect(firstItem._dictionary.get('V').name).toEqual('1');
        secondItem = checkBox2.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('1');
        expect(secondItem._dictionary.get('V').name).toEqual('1');
        thirdItem = checkBox2.itemAt(2);
        expect(thirdItem._dictionary.get('AS').name).toEqual('Off');
        fourthItem = checkBox2.itemAt(3);
        expect(fourthItem._dictionary.get('AS').name).toEqual('Off');
        let checkBox3 = document.form.fieldAt(2) as PdfCheckBoxField;
        firstItem = checkBox3.itemAt(0);
        expect(firstItem._dictionary.get('AS').name).toEqual('Off');
        secondItem = checkBox3.itemAt(1);
        expect(secondItem._dictionary.get('AS').name).toEqual('Off');
        document.destroy();
    });
});