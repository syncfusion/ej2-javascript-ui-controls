import { PdfAnnotationBorder, PdfPolyLineAnnotation, PdfPopupAnnotation, PdfRubberStampAnnotation } from "../src/pdf/core/annotations/annotation";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";
import { DataFormat, PdfRubberStampAnnotationIcon } from "../src/pdf/core/enumerator";
import { PdfAnnotationExportSettings, PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName } from "../src/pdf/core/pdf-primitives";
import { _bytesToString } from "../src/pdf/core/utils";
import { crossReferenceTable } from "./inputs.spec";
import { createNumberFormat, setMeasureDictionary } from "./test-utility.spec";
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
});