import { PdfAnnotationBorder, PdfPolyLineAnnotation, PdfPopupAnnotation, PdfRubberStampAnnotation, PdfTextMarkupAnnotation, PdfSquareAnnotation, PdfFreeTextAnnotation, PdfRadioButtonListItem } from "../src/pdf/core/annotations/annotation";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";
import { DataFormat, PdfRubberStampAnnotationIcon, PdfTextMarkupAnnotationType } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfRadioButtonListField } from "../src/pdf/core/form/field";
import { PdfAnnotationExportSettings, PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName } from "../src/pdf/core/pdf-primitives";
import { _bytesToString, _decodeText, _decodeUtf16Bytes, _trimTailIfMatches } from "../src/pdf/core/utils";
import { crossReferenceTable } from "./inputs.spec";
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
});