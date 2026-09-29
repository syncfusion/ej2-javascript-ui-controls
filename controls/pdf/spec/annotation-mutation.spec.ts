import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfAnnotation, PdfAnnotationBorder, PdfBorderEffect, PdfCircleAnnotation, PdfEllipseAnnotation, PdfSquareAnnotation } from "../src/pdf/core/annotations/annotation";
import { _PdfAnnotationType, PdfBorderEffectStyle, PdfCircleMeasurementType, PdfMeasurementUnit } from "../src/pdf/core/enumerator";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfColor, Rectangle } from "../src/pdf/core/pdf-type";
import { _PdfUnitConvertor } from "../src/pdf/core/graphics/pdf-graphics";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";
import { _PdfBaseStream, _PdfContentStream } from "../src/pdf/core/base-stream";
import { PdfTemplate } from "../src/pdf/core/graphics/pdf-template";
import { PdfFont, PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
describe('1041665 - PdfCircleAnnotation constructor mutation coverage', () => {
    it('1041665 - Should initialize measurement unit and type', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.radius } });
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        expect(annotation.measureType).toEqual(PdfCircleMeasurementType.radius);
    });
    it('1041665 - Should initialize measurement type', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 50 }, { innerColor: { r: 255, g: 0, b: 0 }, measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius } }
            );
        expect(annotation.innerColor).toEqual({ r: 255, g: 0, b: 0 });
        expect(annotation._dictionary.get('IC')).toEqual([1, 0, 0]);
        expect(annotation.measure).toBeTruthy();
        expect(annotation._measureType).toEqual(1);
        expect(annotation._unit).toEqual(4);
    });
    it('1041665 - Should initialize border property', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 2;
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { border });
        expect(annotation.border).toBeDefined();
        expect(annotation.border.width).toEqual(2);
    });
    it('1041665 - Should initialize opacity property', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { opacity: 0.75 });
        expect(annotation.opacity).toEqual(0.75);
    });
    it('1041665 - Should initialize inner color property', (): void => {
        const innerColor: PdfColor = { r: 0, g: 255, b: 0 };
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { innerColor });
        expect(annotation.innerColor.r).toEqual(0);
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation.innerColor.b).toEqual(0);
    });
    it('1041665 - Should initialize color property', (): void => {
        const color: PdfColor = { r: 255, g: 0, b: 0 };
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { color });
        expect(annotation.color.r).toEqual(255);
        expect(annotation.color.g).toEqual(0);
        expect(annotation.color.b).toEqual(0);
    });
    it('1041665 - Should initialize subject property', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { subject: 'Circle Subject' });
        expect(annotation.subject).toEqual('Circle Subject');
    });
    it('1041665 - Should initialize author property', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { author: 'Syncfusion' });
        expect(annotation.author).toEqual('Syncfusion');
    });
    it('1041665 - Should initialize text property', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 50 }, { text: 'Circle Text' });
        expect(annotation.text).toEqual('Circle Text');
    });
    it('1041665 - Should initialize circle annotation with only bounds', (): void => {
        const bounds: Rectangle = { x: 10, y: 20, width: 100, height: 50 };
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(bounds);
        expect(annotation).toBeDefined();
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(100);
        expect(annotation.bounds.height).toEqual(50);
        expect(annotation._dictionary.get('Type')).toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype')).toEqual(_PdfName.get('Circle'));
        expect(annotation._type).toEqual(_PdfAnnotationType.circleAnnotation);
    });
    it('1041665 - 1041665 - Should initialize all constructor properties', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 2;
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 10, y: 20, width: 150, height: 120 },
            {
                text: 'Circle Text',
                author: 'Syncfusion',
                subject: 'Circle Subject',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                opacity: 0.5,
                border,
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            }
        );
        expect(annotation.text).toEqual('Circle Text');
        expect(annotation.author).toEqual('Syncfusion');
        expect(annotation.subject).toEqual('Circle Subject');
        expect(annotation.color.r).toEqual(255);
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation.opacity).toEqual(0.5);
        expect(annotation.border.width).toEqual(2);
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toEqual(PdfMeasurementUnit.centimeter);
        expect(annotation.measureType).toEqual(PdfCircleMeasurementType.diameter);
        expect(annotation._dictionary.get('Type')).toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype')).toEqual(_PdfName.get('Circle'));
    });
    it('1041665 - Should return updated measurement unit when text is modified', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 50 }
            );
        annotation['_isTextUpdated'] = true;
        annotation['_unit'] = PdfMeasurementUnit.inch;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        annotation['_isTextUpdated'] = false;
    });
    it('1041665 - Should cover circle annotation loaded and flatten branches', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 40, y: 50, width: 120, height: 120 }, { text: 'Measured Circle', color: { r: 100, g: 120, b: 140 }, innerColor: { r: 200, g: 210, b: 220 }, opacity: 0.6, measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } });
        measuredCircle.flattenPopups = true;
        page.annotations.add(measuredCircle);
        const radiusCircle: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 200, y: 50, width: 100, height: 100 }, { text: 'Radius Circle', color: { r: 20, g: 40, b: 60 }, innerColor: { r: 80, g: 90, b: 100 }, opacity: 0.75, measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.radius } });
        page.annotations.add(radiusCircle);
        const savedData: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedData);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedMeasuredCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const loadedRadiusCircle: PdfCircleAnnotation = loadedPage.annotations.at(1) as PdfCircleAnnotation;
        loadedMeasuredCircle['_isLoaded'] = true;
        loadedMeasuredCircle['_setAppearance'] = true;
        loadedMeasuredCircle.flattenPopups = true;
        loadedMeasuredCircle._doPostProcess(true);
        expect(loadedMeasuredCircle.measure).toBeTruthy();
        expect(loadedMeasuredCircle._dictionary.has('Measure')).toBeTruthy();
        expect(loadedMeasuredCircle._dictionary.has('AP')).toBeTruthy();
        loadedRadiusCircle['_isLoaded'] = true;
        loadedRadiusCircle['_setAppearance'] = false;
        loadedRadiusCircle.flattenPopups = true;
        loadedRadiusCircle._doPostProcess(true);
        expect(loadedRadiusCircle.measure).toBeTruthy();
        expect(loadedRadiusCircle._dictionary.has('AP')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should set measure to true when value is truthy and annotation is not loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.inch } }
            );
        annotation['_isLoaded'] = false;
        annotation.measure = true;
        expect(annotation.measure).toBeTruthy();
    });
    it('1041665 - Should not set measure when annotation is already loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 100 });
        annotation['_isLoaded'] = true;
        annotation['_measure'] = false;
        annotation.measure = true;
        expect(annotation.measure).toBeFalsy();
    });
    it('1041665 - Should return cached unit when _isTextUpdated is true', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 100 });
        annotation['_isTextUpdated'] = true;
        annotation['_unit'] = PdfMeasurementUnit.inch;
        const resultUnit: PdfMeasurementUnit = annotation.unit;
        expect(resultUnit).toEqual(PdfMeasurementUnit.inch);
        annotation['_isTextUpdated'] = false;
    });
    it('1041665 - Should not return cached unit when _isTextUpdated is false and _unit is undefined', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({ x: 0, y: 0, width: 100, height: 100 });
        annotation['_isTextUpdated'] = false;
        annotation['_unit'] = undefined as any;
        const resultUnit: PdfMeasurementUnit = annotation.unit;
        expect(resultUnit).toEqual(PdfMeasurementUnit.centimeter);
    });
    it('1041665 - Should load unit from Contents dictionary string on loaded annotation', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 200, height: 200 },
                {
                    measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.radius }
                }
            );
        page.annotations.add(circleAnnotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_isTextUpdated'] = false;
        const loadedUnit: PdfMeasurementUnit = loadedCircle.unit;
        expect(loadedUnit).toBeDefined();
        expect(loadedCircle._dictionary.has('Contents')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should not set unit when annotation is loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter } }
            );
        annotation['_isLoaded'] = true;
        const previousUnit: PdfMeasurementUnit = annotation['_unit'];
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation['_unit']).toEqual(previousUnit);
    });
    it('1041665 - Should set unit when measure is true and annotation is not loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter } }
            );
        annotation['_isLoaded'] = false;
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
    });
    it('1041665 - Should not set measureType when annotation is loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { type: PdfCircleMeasurementType.diameter } }
            );
        annotation['_isLoaded'] = true;
        annotation.measureType = PdfCircleMeasurementType.radius;
        expect(annotation['_measureType']).toEqual(PdfCircleMeasurementType.diameter);
    });
    it('1041665 - Should set measureType when measure is true and annotation is not loaded', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { type: PdfCircleMeasurementType.diameter } }
            );
        annotation['_isLoaded'] = false;
        annotation.measureType = PdfCircleMeasurementType.radius;
        expect(annotation.measureType).toEqual(PdfCircleMeasurementType.radius);
    });
    it('1041665 - Should determine measureType as radius from loaded Contents string', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 200, height: 200 },
                { measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.radius } }
            );
        page.annotations.add(circleAnnotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const resolvedMeasureType: PdfCircleMeasurementType = loadedCircle.measureType;
        expect(resolvedMeasureType).toBeDefined();
        expect(loadedCircle._dictionary.has('Contents')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should use existing BS border width when BS key is in dictionary', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 20, y: 20, width: 80, height: 80 },
                {
                    color: { r: 0, g: 128, b: 255 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(circleAnnotation);
        circleAnnotation._doPostProcess(false);
        expect(circleAnnotation._dictionary.has('AP')).toBeTruthy();
    });
    it('1041665 - Should set transparent color and create BS dictionary when BS not in dictionary', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation['_isTransparentColor']).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover _postProcess when measure is set and appearance is created', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 30, y: 30, width: 150, height: 150 },
                {
                    text: 'Area Text',
                    color: { r: 255, g: 128, b: 0 },
                    innerColor: { r: 100, g: 200, b: 50 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(measuredCircle);
        measuredCircle._doPostProcess(false);
        expect(measuredCircle._dictionary.has('AP')).toBeTruthy();
        expect(measuredCircle._dictionary.has('Measure')).toBeTruthy();
        expect(measuredCircle._dictionary.has('Contents')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover _postProcess when no measure and setAppearance triggers circle appearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const plainCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 60, height: 60 },
                { color: { r: 10, g: 20, b: 30 } }
            );
        plainCircle['_setAppearance'] = true;
        page.annotations.add(plainCircle);
        plainCircle._doPostProcess(false);
        expect(plainCircle._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover _doPostProcess loaded path with customTemplate size greater than zero', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 120, height: 120 },
                {
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(measuredCircle);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = true;
        loadedCircle._doPostProcess(false);
        expect(loadedCircle._dictionary.has('AP')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover _doPostProcess loaded flatten path with AP and appearance stream', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 50, y: 50, width: 100, height: 100 },
                {
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(measuredCircle);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = false;
        loadedCircle['_appearanceTemplate'] = undefined as any;
        loadedCircle._doPostProcess(true);
        expect(loadedCircle._dictionary.has('AP')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover flattenPopups path in _doPostProcess when isFlatten is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        circleAnnotation.flattenPopups = true;
        page.annotations.add(circleAnnotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle.flattenPopups = true;
        loadedCircle['_setAppearance'] = true;
        loadedCircle._doPostProcess(true);
        expect(loadedCircle).toBeDefined();
        expect(loadedCircle._dictionary.has('Measure')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover flattenPopups non-loaded path when isFlatten is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { color: { r: 0, g: 0, b: 0 } }
            );
        circleAnnotation.flattenPopups = true;
        page.annotations.add(circleAnnotation);
        circleAnnotation['_isLoaded'] = false;
        circleAnnotation.flattenPopups = true;
        circleAnnotation._doPostProcess(true);
        expect(circleAnnotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover _doPostProcess setAppearance path that updates AP reference', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 50, g: 100, b: 150 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(circleAnnotation);
        circleAnnotation._doPostProcess(false);
        expect(circleAnnotation._dictionary.has('AP')).toBeTruthy();
        expect(circleAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover _createCircleMeasureAppearance with diameter type and no inner color', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(diameterCircle);
        diameterCircle._doPostProcess(false);
        expect(diameterCircle._dictionary.has('AP')).toBeTruthy();
        expect(diameterCircle._dictionary.has('Contents')).toBeTruthy();
        expect(diameterCircle['_measureType']).toEqual(PdfCircleMeasurementType.diameter);
        document.destroy();
    });
    it('1041665 - Should cover _createCircleMeasureAppearance with radius type and inner color', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const radiusCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 },
                {
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius }
                }
            );
        page.annotations.add(radiusCircle);
        radiusCircle._doPostProcess(false);
        expect(radiusCircle._dictionary.has('AP')).toBeTruthy();
        expect(radiusCircle._dictionary.has('Contents')).toBeTruthy();
        expect(radiusCircle['_measureType']).toEqual(PdfCircleMeasurementType.radius);
        document.destroy();
    });
    it('1041665 - Should cover _createCircleMeasureAppearance with text content set', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationWithText: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 5, y: 5, width: 120, height: 120 },
                {
                    text: 'Annotation Label',
                    color: { r: 100, g: 100, b: 100 },
                    measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotationWithText);
        annotationWithText._doPostProcess(false);
        expect(annotationWithText._dictionary.has('Contents')).toBeTruthy();
        expect(annotationWithText._dictionary.has('DS')).toBeTruthy();
        expect(annotationWithText._dictionary.has('Measure')).toBeTruthy();
        const contentsValue: string = annotationWithText._dictionary.get('Contents');
        expect(contentsValue.indexOf('Annotation Label')).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should cover _createCircleMeasureAppearance when text is empty and only area is stored', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationNoText: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotationNoText);
        annotationNoText._doPostProcess(false);
        expect(annotationNoText._dictionary.has('Contents')).toBeTruthy();
        const contentsValue: string = annotationNoText._dictionary.get('Contents');
        expect(contentsValue).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover _createCircleMeasureAppearance when _isFlatten is true and AP already set', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(measuredCircle);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = true;
        loadedCircle._doPostProcess(true);
        expect(loadedCircle._dictionary.has('AP')).toBeTruthy();
        expect(loadedCircle._dictionary.has('Measure')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover _convertToUnit when measureType is diameter and doubles the radius', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 200, height: 200 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(diameterCircle);
        diameterCircle._doPostProcess(false);
        const contentsValue: string = diameterCircle._dictionary.get('Contents');
        expect(contentsValue).toBeDefined();
        expect(diameterCircle['_measureType']).toEqual(PdfCircleMeasurementType.diameter);
        document.destroy();
    });
    it('1041665 - Should cover _convertToUnit when measureType is radius and does not double', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const radiusCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 200, height: 200 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius }
                }
            );
        page.annotations.add(radiusCircle);
        radiusCircle._doPostProcess(false);
        const contentsValue: string = radiusCircle._dictionary.get('Contents');
        expect(contentsValue).toBeDefined();
        expect(radiusCircle['_measureType']).toEqual(PdfCircleMeasurementType.radius);
        document.destroy();
    });
    it('1041665 - Should verify DS string is built with font name and color on _createCircleMeasureAppearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const styledCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 128, g: 64, b: 32 },
                    measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(styledCircle);
        styledCircle._doPostProcess(false);
        const dsValue: string = styledCircle._dictionary.get('DS');
        expect(dsValue).toBeDefined();
        expect(dsValue.indexOf('font:')).toBeGreaterThanOrEqual(0);
        expect(dsValue.indexOf('color:')).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should cover _doPostProcess non-loaded setAppearance path that reuses existing AP', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 80, height: 80 },
                {
                    color: { r: 200, g: 200, b: 200 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(circleAnnotation);
        circleAnnotation._doPostProcess(false);
        const firstApPresent: boolean = circleAnnotation._dictionary.has('AP');
        circleAnnotation['_setAppearance'] = true;
        circleAnnotation._doPostProcess(false);
        expect(firstApPresent).toBeTruthy();
        expect(circleAnnotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover measureType getter that loads radius type from Contents on loaded circle', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const radiusCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.radius } }
            );
        page.annotations.add(radiusCircle);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const resolvedType: PdfCircleMeasurementType = loadedCircle.measureType;
        expect(resolvedType).toBeDefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover measureType getter diameter branch from Contents on loaded circle', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterCircle: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 200, height: 200 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        page.annotations.add(diameterCircle);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const resolvedType: PdfCircleMeasurementType = loadedCircle.measureType;
        expect(resolvedType).toEqual(PdfCircleMeasurementType.diameter);
        loadedDocument.destroy();
    });
    it('1041665 - Should cover _doPostProcess when loaded with no setAppearance and no flatten', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circleAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        page.annotations.add(circleAnnotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = false;
        loadedCircle['_appearanceTemplate'] = undefined as any;
        loadedCircle._doPostProcess(false);
        expect(loadedCircle).toBeDefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should not change measure when value is false (catches if(value)→if(true) mutation)', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.inch } }
            );
        annotation['_isLoaded'] = false;
        annotation['_measure'] = true;
        annotation.measure = false;
        expect(annotation['_measure']).toBeTruthy();
    });
    it('1041665 - Should not change unit when _measure is false (catches if(_measure)→if(true) mutation)', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        annotation['_isLoaded'] = false;
        annotation['_measure'] = false;
        annotation['_unit'] = PdfMeasurementUnit.centimeter;
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation['_unit']).toEqual(PdfMeasurementUnit.centimeter);
    });
    it('1041665 - Should not change measureType when _measure is false (catches if(_measure)→if(true) mutation)', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        annotation['_isLoaded'] = false;
        annotation['_measure'] = false;
        annotation['_measureType'] = PdfCircleMeasurementType.radius;
        annotation.measureType = PdfCircleMeasurementType.diameter;
        expect(annotation['_measureType']).toEqual(PdfCircleMeasurementType.radius);
    });
    it('1041665 - Should not set unit when value is undefined (catches typeof value !== "" mutation)', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter } }
            );
        annotation['_isLoaded'] = false;
        const previousUnit: PdfMeasurementUnit = annotation['_unit'];
        annotation.unit = undefined as any;
        expect(annotation['_unit']).toEqual(previousUnit);
    });
    it('1041665 - Should not set measureType when value is undefined (catches typeof value !== "" mutation)', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { type: PdfCircleMeasurementType.diameter } }
            );
        annotation['_isLoaded'] = false;
        annotation['_measure'] = true;
        const previousType: PdfCircleMeasurementType = annotation['_measureType'];
        annotation.measureType = undefined as any;
        expect(annotation['_measureType']).toEqual(previousType);
    });
    it('1041665 - Should create BS dictionary when not present in _postProcess (catches else{} mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { color: { r: 0, g: 0, b: 0 } }
            );
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not create appearance when no measure no setAppearance no flatten no customTemplate (catches size>=0 size<=0 mutations)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = false;
        annotation['_measure'] = false;
        annotation._doPostProcess(false);
        expect(annotation['_appearanceTemplate']).toBeFalsy();
        document.destroy();
    });
    it('1041665 - Should create appearance when isFlatten true and no AP and no setAppearance (catches if(_setAppearance||(false)||...) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = false;
        annotation['_measure'] = false;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create AP when AP has AP and hasAP with has("") mutation (catches _dictionary.has("") mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { color: { r: 0, g: 0, b: 255 } }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = false;
        annotation._doPostProcess(false);
        annotation['_setAppearance'] = true;
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should set appearance _updated true when AP dict newly created (catches _updated=false mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 50, g: 100, b: 150 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = true;
        annotation._doPostProcess(false);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        expect(loadedCircle._dictionary.has('AP')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should not flatten popups when flattenPopups is true but isFlatten is false (catches ||isFlatten mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation['_setAppearance'] = true;
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not flatten popups when flattenPopups is false and isFlatten is true (catches if(true&&isFlatten) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(true);
        expect(annotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should return doubled value for diameter vs radius in _convertToUnit (catches if(true) mutation in _convertToUnit)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        const radiusAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius } }
            );
        page.annotations.add(diameterAnnotation);
        page.annotations.add(radiusAnnotation);
        const diameterValue: number = (diameterAnnotation as any)._convertToUnit();
        const radiusValue: number = (radiusAnnotation as any)._convertToUnit();
        expect(diameterValue).toBeCloseTo(radiusValue * 2, 5);
        document.destroy();
    });
    it('1041665 - Should write AP Measure Contents DS to dictionary when _isFlatten is false and not loaded (catches AP/Measure/Contents/DS string mutations)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 120, height: 120 },
                {
                    text: 'MeasureText',
                    color: { r: 200, g: 100, b: 50 },
                    measure: { unit: PdfMeasurementUnit.inch, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        expect(annotation._dictionary.has('Contents')).toBeTruthy();
        expect(annotation._dictionary.has('DS')).toBeTruthy();
        expect(annotation._dictionary.has('Subtype')).toBeTruthy();
        const contents: string = annotation._dictionary.get('Contents');
        expect(contents.indexOf('MeasureText')).toBeGreaterThanOrEqual(0);
        const ds: string = annotation._dictionary.get('DS');
        expect(ds.indexOf('font:')).toBeGreaterThanOrEqual(0);
        expect(ds.indexOf('color:')).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should write Contents without text prefix when text is empty (catches if(this._text||...) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string = annotation._dictionary.get('Contents');
        expect(contents).toBeDefined();
        const parts: string[] = contents.split(' ');
        expect(parts.length).toEqual(2);
        document.destroy();
    });
    it('1041665 - Should write Contents with text prefix when text is set (catches if(this._text&&true) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    text: 'Label',
                    color: { r: 0, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string = annotation._dictionary.get('Contents');
        expect(contents.indexOf('Label')).toEqual(0);
        const parts: string[] = contents.split(' ');
        expect(parts.length).toEqual(3);
        document.destroy();
    });
    it('1041665 - Should not write AP Measure Contents when _isFlatten is true and isLoaded (catches (typeof _isFlatten!==undefined&&!_isFlatten)||!_isLoaded mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = true;
        loadedCircle._doPostProcess(true);
        expect(loadedCircle._dictionary.has('AP')).toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover loaded _doPostProcess with Measure key and setAppearance false and isFlatten false (catches (this._setAppearance||false)||... mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation = loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedCircle['_isLoaded'] = true;
        loadedCircle['_setAppearance'] = false;
        loadedCircle['_appearanceTemplate'] = undefined as any;
        loadedCircle._doPostProcess(false);
        expect(loadedCircle).toBeDefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should set _isTransparentColor true when no C in dictionary (catches _isTransparentColor=false mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation['_isTransparentColor']).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should have borderWidth 1 when BS not present and no explicit border (catches borderWidth if(false) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { color: { r: 100, g: 100, b: 100 } }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = true;
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use border width from existing BS dict when BS is present in dictionary (catches if(true)/if(BS){} mutations)', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 3;
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { color: { r: 0, g: 0, b: 0 }, border }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const firstBsPresent: boolean = annotation._dictionary.has('BS');
        annotation['_setAppearance'] = true;
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(false);
        expect(firstBsPresent).toBeTruthy();
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should have innerColor set in radius appearance (catches if(innerColor)→if(false) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const radiusWithInner: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius }
                }
            );
        page.annotations.add(radiusWithInner);
        radiusWithInner._doPostProcess(false);
        expect(radiusWithInner.innerColor).toBeDefined();
        expect(radiusWithInner._dictionary.has('AP')).toBeTruthy();
        expect(radiusWithInner.innerColor.g).toEqual(255);
        document.destroy();
    });
    it('1041665 - Should have no innerColor in diameter appearance (catches if(innerColor)→if(true) mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterNoInner: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                {
                    color: { r: 255, g: 0, b: 0 },
                    measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
                }
            );
        page.annotations.add(diameterNoInner);
        diameterNoInner._doPostProcess(false);
        expect(diameterNoInner['_innerColor']).toBeFalsy();
        expect(diameterNoInner._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should produce different Contents values for diameter vs radius (catches radius===value comparison mutation)', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const diameterAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter } }
            );
        const radiusAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 0, y: 0, width: 100, height: 100 },
                { measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.radius } }
            );
        page.annotations.add(diameterAnnotation);
        page.annotations.add(radiusAnnotation);
        diameterAnnotation._doPostProcess(false);
        radiusAnnotation._doPostProcess(false);
        const diamContents: string = diameterAnnotation._dictionary.get('Contents');
        const radContents: string = radiusAnnotation._dictionary.get('Contents');
        const diamValue: number = parseFloat(diamContents.split(' ')[0]);
        const radValue: number = parseFloat(radContents.split(' ')[0]);
        expect(diamValue).toBeCloseTo(radValue * 2, 1);
        document.destroy();
    });
    it('1041665 - should initialize all constructor properties and measurement settings', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 2;
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 20,
                width: 150,
                height: 120
            },
            {
                text: 'Circle Text',
                author: 'Syncfusion',
                subject: 'Circle Subject',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                opacity: 0.5,
                border,
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            }
        );
        expect(annotation.text).toEqual('Circle Text');
        expect(annotation.author).toEqual('Syncfusion');
        expect(annotation.subject).toEqual('Circle Subject');
        expect(annotation.color.r).toEqual(255);
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation.opacity).toEqual(0.5);
        expect(annotation.border.width).toEqual(2);
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toEqual(PdfMeasurementUnit.centimeter);
        expect(annotation.measureType).toEqual(PdfCircleMeasurementType.diameter);
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(150);
        expect(annotation.bounds.height).toEqual(120);
        expect(annotation._dictionary.get('Type'))
            .toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Circle'));
    });
    it('1041665 - should not assign bounds when width is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 10,
            y: 20,
            height: 120
        });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - should not assign bounds when height is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 10,
            y: 20,
            width: 120
        });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - should not assign bounds when x is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            y: 20,
            width: 120,
            height: 120
        });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - should not assign bounds when y is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 10,
            width: 120,
            height: 120
        });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - should leave optional properties undefined when properties object is empty', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 10,
            y: 10,
            width: 100,
            height: 100
        }, {});
        expect(annotation.text).toBeUndefined();
        expect(annotation.author).toBeUndefined();
        expect(annotation.subject).toBeUndefined();
        expect(annotation.color).toBeUndefined();
        expect(annotation.innerColor).toBeUndefined();
        expect(annotation.opacity).toBe(1);
        expect(annotation.measure).toBeFalsy();
    });
    it('1041665 - should initialize measurement using unit only', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                measure: {
                    unit: PdfMeasurementUnit.inch
                }
            }
        );
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toBe(PdfMeasurementUnit.inch);
    });
    it('1041665 - should initialize measurement using type only', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                measure: {
                    type: PdfCircleMeasurementType.radius
                }
            }
        );
        expect(annotation.measure).toBeTruthy();
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.radius);
    });
    it('1041665 - should not enable measurement when measure object is not provided', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                text: 'Circle'
            }
        );
        expect(annotation.measure).toBeFalsy();
        expect(annotation.unit)
            .toBe(PdfMeasurementUnit.centimeter);
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
    });
    it('1041665 - should create correct annotation dictionary entries', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 10,
            y: 10,
            width: 100,
            height: 100
        });
        const type: _PdfName = annotation._dictionary.get('Type');
        const subtype: _PdfName = annotation._dictionary.get('Subtype');
        expect(type).toBeDefined();
        expect(subtype).toBeDefined();
        expect(type.name).toBe('Annot');
        expect(subtype.name).toBe('Circle');
        expect(annotation._dictionary.has('')).toBeFalsy();
    });
    it('1041665 - should not set bounds is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 20,
            width: 100,
            height: 100
        });
        expect(annotation.bounds).toBeUndefined();
        const annotation1: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            y: 20,
            width: 100,
            height: 100
        });
        expect(annotation1.bounds).toBeUndefined();
        const annotation2: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 20,
            y: 20,
            height: 100
        });
        expect(annotation2.bounds).toBeUndefined();
        const annotation3: PdfCircleAnnotation = new PdfCircleAnnotation(<any>{
            x: 20,
            y: 20,
            width: 100
        });
        expect(annotation3.bounds).toBeUndefined();
        const annotationNull: PdfCircleAnnotation = new PdfCircleAnnotation(null as any, { innerColor: {} as any, measure: { unit: {} as any, type: {} as any } });
        annotationNull._isTextUpdated = false;
        expect(annotationNull.unit).toEqual({} as any);
        annotationNull._isTextUpdated = {} as any;
        expect(annotationNull.unit).toEqual({} as any);
        expect(annotationNull.bounds).toBeUndefined();
        expect(annotationNull.innerColor).toEqual({} as any);
        expect(annotationNull.measure).toBeTruthy();
    });
    it('1041665 - should not initialize optional properties when properties are empty', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 20,
                width: 100,
                height: 100
            },
            {});
        expect(annotation.text).toBeUndefined();
        expect(annotation.author).toBeUndefined();
        expect(annotation.subject).toBeUndefined();
        expect(annotation.color).toBeUndefined();
        expect(annotation.innerColor).toBeUndefined();
        expect(annotation.opacity).toBe(1);
        expect(annotation.measure).toBeFalsy();
    });
    it('1041665 - should enable measurement when only type is specified', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 50,
                y: 50,
                width: 100,
                height: 100
            },
            {
                measure: {
                    type: PdfCircleMeasurementType.radius
                }
            });
        expect(annotation.measure).toBeTruthy();
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.radius);
    });
    it('1041665 - should enable measurement when only unit is specified', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 20,
                width: 100,
                height: 100
            },
            {
                measure: {
                    unit: PdfMeasurementUnit.inch
                }
            });
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toBe(PdfMeasurementUnit.inch);
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
    });
    it('1041665 - should maintain default measurement values when measure is not provided', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 10,
            y: 20,
            width: 100,
            height: 100
        });
        expect(annotation.measure).toBeFalsy();
        expect(annotation.unit)
            .toBe(PdfMeasurementUnit.centimeter);
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(annotation.text).toBeUndefined();
        expect(annotation.author).toBeUndefined();
        expect(annotation.subject).toBeUndefined();
    });
    it('1041665 - should initialize constructor values and dictionary entries', (): void => {
        const annotationBorder: PdfAnnotationBorder = new PdfAnnotationBorder();
        annotationBorder.width = 2;
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 20,
                width: 150,
                height: 120
            },
            {
                text: 'Circle Text',
                author: 'Syncfusion',
                subject: 'Circle Subject',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                opacity: 0.5,
                border: annotationBorder,
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        expect(annotation).toBeDefined();
        expect(annotation.text).toBe('Circle Text');
        expect(annotation.author).toBe('Syncfusion');
        expect(annotation.subject).toBe('Circle Subject');
        expect(annotation.color.r).toBe(255);
        expect(annotation.color.g).toBe(0);
        expect(annotation.color.b).toBe(0);
        expect(annotation.innerColor.r).toBe(0);
        expect(annotation.innerColor.g).toBe(255);
        expect(annotation.innerColor.b).toBe(0);
        expect(annotation.opacity).toBe(0.5);
        expect(annotation.border.width).toBe(2);
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toBe(PdfMeasurementUnit.centimeter);
        expect(annotation.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(annotation.bounds.x).toBe(10);
        expect(annotation.bounds.y).toBe(20);
        expect(annotation.bounds.width).toBe(150);
        expect(annotation.bounds.height).toBe(120);
        expect(annotation._dictionary.get('Type'))
            .toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Circle'));
        expect(annotation._dictionary.has('')).toBeFalsy();
    });
    it('1041665 - Should cover diameter measure appearance branch', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 50,
                y: 50,
                width: 120,
                height: 120
            },
            {
                text: 'Diameter Circle',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 220, g: 220, b: 220 },
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        page.annotations.add(circle);
        circle._postProcess(false);
        expect(circle.measure).toBeTruthy();
        expect(circle.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(circle['_dictionary'].has('Measure'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create valid DS entry with font and color information', (): void => {
        let document = new PdfDocument();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 30,
                y: 30,
                width: 120,
                height: 120
            },
            {
                text: 'Circle Style',
                color: { r: 0, g: 0, b: 255 },
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.radius
                }
            });
        annotation._crossReference = document._crossReference;
        annotation._postProcess(false);
        const defaultStyle: string =
            annotation['_dictionary'].get('DS');
        expect(defaultStyle.indexOf('font:'))
            .toBeGreaterThanOrEqual(0);
        expect(defaultStyle.indexOf('pt; color:'))
            .toBeGreaterThanOrEqual(0);
        expect(defaultStyle.indexOf('color:'))
            .toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should cover contents generation with and without text', (): void => {
        let document = new PdfDocument();
        const circleWithText: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                text: 'Circle Caption',
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        circleWithText._crossReference = document._crossReference;
        circleWithText._postProcess(false);
        expect(circleWithText['_dictionary'].get('Contents'))
            .toContain('Circle Caption');
        const circleWithoutText: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        circleWithoutText._crossReference = document._crossReference;
        circleWithoutText._postProcess(false);
        expect(circleWithoutText['_dictionary'].get('Contents'))
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover radius measurement appearance path', (): void => {
        let document = new PdfDocument();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 120,
                height: 120
            },
            {
                text: 'Radius Circle',
                color: { r: 0, g: 0, b: 255 },
                innerColor: { r: 180, g: 180, b: 180 },
                measure: {
                    unit: PdfMeasurementUnit.inch,
                    type: PdfCircleMeasurementType.radius
                }
            });
        circle._crossReference = document._crossReference;
        circle._postProcess(false);
        expect(circle.measure).toBeTruthy();
        expect(circle.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(circle['_dictionary'].has('Measure'))
            .toBeTruthy();
        expect(circle['_dictionary'].get('DS'))
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover diameter measurement appearance path', (): void => {
        let document = new PdfDocument();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 120,
                height: 120
            },
            {
                text: 'Diameter Circle',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 220, g: 220, b: 220 },
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        circle._crossReference = document._crossReference;
        circle._postProcess(false);
        expect(circle.measure).toBeTruthy();
        expect(circle.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(circle['_dictionary'].has('Measure'))
            .toBeTruthy();
        expect(circle['_dictionary'].get('DS'))
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover non loaded post process branches', (): void => {
        let document = new PdfDocument();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 100
            },
            {
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        circle._crossReference = document._crossReference;
        circle._postProcess(false);
        expect(circle.color).toBeDefined();
        expect(circle['_dictionary'].has('BS')).toBeTruthy();
        expect(circle['_dictionary'].has('Measure')).toBeTruthy();
        expect(circle['_dictionary'].has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover measurement getters and post process branches', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 100
            },
            {
                text: 'Circle Measurement',
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.radius
                }
            });
        circle._crossReference = document._crossReference;
        page.annotations.add(circle);
        expect(circle.measure).toBeTruthy();
        expect(circle.unit).toBe(PdfMeasurementUnit.centimeter);
        expect(circle.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        circle['_isTextUpdated'] = true;
        expect(circle.unit)
            .toBe(PdfMeasurementUnit.centimeter);
        circle['_isTextUpdated'] = false;
        circle['_dictionary'].update('Contents', '1cm');
        circle['_isLoaded'] = true;
        circle._dictionary.update('Rect', [50, 50, 100, 100]);
        circle.bounds = {
            x: 50,
            y: 20,
            width: 100,
            height: 100
        };
        expect(circle.unit).toBeDefined();
        expect(circle.measureType).toBeDefined();
        circle['_isLoaded'] = false;
        circle._postProcess(false);
        expect(circle['_dictionary'].has('BS')).toBeTruthy();
        expect(circle.color).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover measurement appearance, text update and post process branches', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const measuredCircle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 50,
                y: 50,
                width: 120,
                height: 120
            },
            {
                text: 'Initial Measure',
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            });
        measuredCircle.setAppearance(true);
        page.annotations.add(measuredCircle);
        const savedData: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedData);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedCircle: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        expect(loadedCircle.measure).toBeTruthy();
        const originalText: string = loadedCircle.text;
        loadedCircle.text = 'Updated Measure';
        expect(loadedCircle['_isTextUpdated']).toBeTruthy();
        const unit: PdfMeasurementUnit = loadedCircle.unit;
        expect(unit).toBeDefined();
        const measureType: PdfCircleMeasurementType =
            loadedCircle.measureType;
        expect(measureType).toBeDefined();
        loadedCircle['_dictionary']._updated = true;
        loadedCircle._doPostProcess(false);
        expect(loadedCircle['_dictionary'].has('AP')).toBeTruthy();
        expect(loadedCircle['_dictionary'].has('Measure')).toBeTruthy();
        expect(loadedCircle['_dictionary'].get('Contents'))
            .not.toEqual(originalText);
        const ds: string = loadedCircle['_dictionary'].get('DS');
        expect(ds).toBeDefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should cover radius measure appearance branch', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const circle: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 50,
                y: 50,
                width: 120,
                height: 120
            },
            {
                text: 'Radius Circle',
                color: { r: 0, g: 0, b: 255 },
                innerColor: { r: 180, g: 180, b: 180 },
                measure: {
                    unit: PdfMeasurementUnit.inch,
                    type: PdfCircleMeasurementType.radius
                }
            });
        page.annotations.add(circle);
        circle._postProcess(false);
        expect(circle.measure).toBeTruthy();
        expect(circle.measureType)
            .toBe(PdfCircleMeasurementType.diameter);
        expect(circle['_dictionary'].has('Measure'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should handle text initialization scenarios', (): void => {
        const bounds: Rectangle = {
            x: 20,
            y: 20,
            width: 100,
            height: 100
        };
        // text = undefined
        const undefinedTextAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {
                text: undefined as any
            });
        expect(undefinedTextAnnotation.text).toBeUndefined();
        expect(undefinedTextAnnotation._text).toBeUndefined();
        expect(undefinedTextAnnotation._dictionary.has('Contents')).toBeFalsy();
        // text = null
        const nullTextAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {
                text: null as any
            });
        expect(nullTextAnnotation.text).toBeUndefined();
        expect(nullTextAnnotation._text).toBeUndefined();
        expect(nullTextAnnotation._dictionary.has('Contents')).toBeFalsy();
        // text = object
        const objectTextAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {
                text: {} as any
            });
        expect(objectTextAnnotation.text).toBeUndefined();
        expect(objectTextAnnotation._text).toBeUndefined();
        expect(objectTextAnnotation._dictionary.has('Contents')).toBeFalsy();
        // text property absent
        const noTextAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {});
        expect(noTextAnnotation.text).toBeUndefined();
        expect(noTextAnnotation._text).toBeUndefined();
        expect(noTextAnnotation._dictionary.has('Contents')).toBeFalsy();
        // valid string text
        const validTextAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {
                text: 'Circle Text'
            });
        expect(validTextAnnotation.text).toBe('Circle Text');
        expect(validTextAnnotation._text).toBe('Circle Text');
        expect(validTextAnnotation._dictionary.has('Contents')).toBeTruthy();
        // another valid string
        const text: string = 'Circle';
        const validTextAnnotation2: PdfCircleAnnotation =
            new PdfCircleAnnotation(bounds, {
                text
            });
        expect(validTextAnnotation2.text).toBe(text);
        expect(validTextAnnotation2._text).toBe(text);
        expect(validTextAnnotation2._dictionary.has('Contents')).toBeTruthy();
    });
    it('1041665 - Should not invoke setters when optional properties are absent', (): void => {
        const textSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'text',
            'set'
        ).and.callThrough();
        const authorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'author',
            'set'
        ).and.callThrough();
        const subjectSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'subject',
            'set'
        ).and.callThrough();
        const colorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'color',
            'set'
        ).and.callThrough();
        const opacitySpy = spyOnProperty(
            PdfAnnotation.prototype,
            'opacity',
            'set'
        ).and.callThrough();
        const borderSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'border',
            'set'
        ).and.callThrough();
        const measureSpy = spyOnProperty(
            PdfCircleAnnotation.prototype,
            'measure',
            'set'
        ).and.callThrough();
        const unitSpy = spyOnProperty(
            PdfCircleAnnotation.prototype,
            'unit',
            'set'
        ).and.callThrough();
        const measureTypeSpy = spyOnProperty(
            PdfCircleAnnotation.prototype,
            'measureType',
            'set'
        ).and.callThrough();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 100
            },
            {}
        );
        expect(annotation.text).toBeUndefined();
        expect(annotation._text).toBeUndefined();
        expect(annotation._dictionary.has('Contents')).toBeFalsy();
        expect(textSpy).not.toHaveBeenCalled();
        expect(authorSpy).not.toHaveBeenCalled();
        expect(subjectSpy).not.toHaveBeenCalled();
        expect(colorSpy).not.toHaveBeenCalled();
        expect(opacitySpy).not.toHaveBeenCalled();
        expect(borderSpy).not.toHaveBeenCalled();
        expect(measureSpy).not.toHaveBeenCalled();
        expect(unitSpy).not.toHaveBeenCalled();
        expect(measureTypeSpy).not.toHaveBeenCalled();
    });
    it('should derive centimeter unit from contents suffix', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation();
        annotation['_isLoaded'] = true;
        annotation['_unit'] = undefined as any;
        annotation._dictionary.update(
            'Contents',
            'Diameter 25cm'
        );
        expect(annotation.unit).toBe(
            PdfMeasurementUnit.centimeter
        );
        expect(annotation['_unitString']).toBe('cm');
    });
    it('should extract unit from last two characters of contents', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation();
        annotation['_isLoaded'] = true;
        annotation['_unit'] = undefined as any;
        annotation._dictionary.update(
            'Contents',
            'Diameter 25cm'
        );
        expect(annotation.unit).toEqual(
            PdfMeasurementUnit.centimeter
        );
        expect(annotation['_unitString']).toEqual('cm');
    });
    it('should return cached unit when text is already updated', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation();
        annotation['_isTextUpdated'] = true;
        annotation['_unit'] = PdfMeasurementUnit.inch;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
    });
    it('should create measure appearance when measure is enabled', (): void => {
        let document = new PdfDocument();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
        );
        annotation._crossReference = document._crossReference;
        annotation.measure = true;
        annotation.unit = PdfMeasurementUnit.centimeter;
        annotation.measureType = PdfCircleMeasurementType.diameter;
        annotation._postProcess(false);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('should create appearance when flattening without AP', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
        );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = false;
        annotation._postProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('should preserve border width when BS exists', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            },
            {
                border: { width: 8 } as any
            }
        );
        annotation._postProcess(false);
        expect(annotation.border.width).toBe(8);
    });
    it('should use existing border settings when BS is present', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
        );
        annotation.border = new PdfAnnotationBorder({ width: 5 });
        annotation._postProcess(false);
        expect(annotation.border.width).toBe(5);
    });
    it('should throw when bounds is undefined', (): void => {
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation();
        expect((): void => {
            annotation._postProcess(false);
        }).toThrowError('Bounds cannot be null or undefined');
    });
    it('1041665 - Should initialize border, color and appearance during post process', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            }
        );
        annotation._crossReference = document._crossReference;
        page.annotations.add(annotation);
        annotation['_measure'] = false;
        annotation['_setAppearance'] = true;
        annotation._postProcess(false);
        // BS dictionary should be created
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        const bs: any = annotation._dictionary.get('BS');
        expect(bs).toBeDefined();
        expect(bs.get('Type').name).toBe('Border');
        // Default color should be created
        expect(annotation._dictionary.has('C')).toBeTruthy();
        // Rect should be updated
        expect(annotation._dictionary.has('Rect')).toBeTruthy();
        // Appearance should be generated
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('should reuse AP appearance when appearanceTemplate is undefined', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        let annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 50, y: 50, width: 200, height: 200 });
        annotation.setAppearance(true);
        annotation['_appearanceTemplate'] = undefined as any;
        page.annotations.add(annotation);
        let updatedData = document.save();
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
        document = new PdfDocument(updatedData);
        annotation = document.getPage(0).annotations.at(0) as PdfCircleAnnotation;
        annotation.bounds = { x: 100, y: 100, width: 100, height: 100 };
        annotation.setAppearance(true);
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('should not create appearance template when AP dictionary lacks N', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation();
        page.annotations.add(annotation);
        annotation['_isLoaded'] = true;
        const ap: any = new _PdfDictionary();
        annotation._dictionary.update('AP', ap);
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeUndefined();
        document.destroy();
    });
    it('should reuse existing AP dictionary', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 50, y: 50, width: 100, height: 100 });
        annotation['_setAppearance'] = true;
        const ap: any = new _PdfDictionary();
        annotation._dictionary.update('AP', ap);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.get('AP')).toBe(ap);
        document.destroy();
    });
    it('should mark AP dictionary as updated', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 50, y: 50, width: 100, height: 100 });
        annotation['_setAppearance'] = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const apRef: any = annotation._dictionary.getRaw('AP');
        const ap: any = annotation._crossReference._cacheMap.get(apRef);
        expect(ap._updated).toBeTruthy();
        expect(annotation['_appearanceTemplate']._content.dictionary._update).toBeTruthy();
        document.destroy();
    });
    it('should not create popup appearance when flattenPopups is false', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(true);
        expect(annotation.flattenPopups).toBeFalsy();
        document.destroy();
    });
    it('should not create appearance template when AP has no N entry', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 10,
            y: 10,
            width: 100,
            height: 100
        });
        page.annotations.add(annotation);
        annotation['_isLoaded'] = true;
        const ap: any = new _PdfDictionary();
        annotation._dictionary.update('AP', ap);
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeUndefined();
        document.destroy();
    });
    it('should create and update AP dictionary during post process', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        annotation['_setAppearance'] = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        const apReference: any =
            annotation._dictionary.getRaw('AP');
        const appearance: any =
            annotation['_crossReference']._cacheMap.get(apReference);
        expect(appearance._updated).toBeTruthy();
        expect(annotation['_appearanceTemplate']).toBeDefined();
        expect(
            annotation['_appearanceTemplate']._content.dictionary._update
        ).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create measure appearance and update annotation dictionaries', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                text: 'Circle',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                measure: {
                    unit: PdfMeasurementUnit.centimeter,
                    type: PdfCircleMeasurementType.diameter
                }
            }
        );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation.measure = true;
        annotation.unit = PdfMeasurementUnit.centimeter;
        annotation.measureType = PdfCircleMeasurementType.diameter;
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        expect(annotation._dictionary.has('Contents')).toBeTruthy();
        expect(annotation._dictionary.has('DS')).toBeTruthy();
        expect(annotation._dictionary.get('Contents'))
            .toContain('cm');
        expect(annotation._dictionary.get('Subtype').name)
            .toBe('Circle');
        const apDictionary: any = annotation._dictionary.get('AP');
        expect(apDictionary).toBeDefined();
        expect(apDictionary.has('N')).toBeTruthy();
        const measureReference: any =
            annotation._dictionary.getRaw('Measure');
        expect(measureReference).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should use caption font when default font size is one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        page.annotations.add(annotation);
        annotation.measure = true;
        annotation._postProcess(false);
        expect(annotation['_pdfFont']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        page.annotations.add(annotation);
        annotation.measure = true;
        annotation.unit = PdfMeasurementUnit.centimeter;
        annotation._postProcess(false);
        const existingAP = annotation._dictionary.get('AP');
        annotation._postProcess(false);
        expect(annotation._dictionary.get('AP'))
            .not.toBeUndefined();
        document.destroy();
    });
    it('1041665 - Should create contents without annotation text', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        page.annotations.add(annotation);
        annotation.measure = true;
        annotation.unit = PdfMeasurementUnit.centimeter;
        annotation._postProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents).toContain('cm');
        expect(contents).not.toContain('undefined');
        document.destroy();
    });
    it('1041665 - Should create diameter measure appearance with text and inner color', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Circle',
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._postProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        expect(annotation._dictionary.has('Contents')).toBeTruthy();
        expect(annotation._dictionary.has('DS')).toBeTruthy();
        expect(annotation._dictionary.get('Contents'))
            .toContain('Circle');
        expect(annotation._dictionary.get('Contents'))
            .toContain('cm');
        document.destroy();
    });
    it('1041665 - Should resolve measureType as radius from loaded contents', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 144,
                    height: 144
                },
                {
                    text: 'Circle',
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument =
            new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            loadedDocument.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const measureType: PdfCircleMeasurementType =
            loadedAnnotation.measureType;
        expect(measureType)
            .toEqual(PdfCircleMeasurementType.diameter);
        expect(loadedAnnotation['_unitString'])
            .toEqual('in');
        loadedDocument.destroy();
    });
    it('1041665 - Should return different measure types for radius and diameter annotations', (): void => {
        const radiusAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 144,
                    height: 144
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        const diameterAnnotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 144,
                    height: 144
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        expect(radiusAnnotation.measureType)
            .toEqual(PdfCircleMeasurementType.radius);
        expect(diameterAnnotation.measureType)
            .toEqual(PdfCircleMeasurementType.diameter);
    });
    it('1041665 - Should use border width from existing BS dictionary during post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 5;
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    border,
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        expect(annotation.border.width).toEqual(5);
        const ap = annotation._dictionary.get('AP');
        const appearanceStream: _PdfBaseStream =
            ap.get('N');
        const parser: _ContentParser =
            new _ContentParser((appearanceStream as _PdfContentStream)._bytes);
        const recordCollection: _PdfRecord[] =
            parser._readContent();
        const widthRecord: _PdfRecord = recordCollection.filter(
            (record: _PdfRecord) => record._operator === 'w'
        )[0];
        expect(widthRecord).toBeDefined();
        expect(widthRecord._operands[0]).toEqual('5.000');
        document.destroy();
    });
    it('1041665 - Should use default border width when BS dictionary is not present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        const appearanceStream: _PdfBaseStream =
            appearanceDictionary.get('N');
        const parser: _ContentParser =
            new _ContentParser(
                (appearanceStream as _PdfContentStream)._bytes
            );
        const records: _PdfRecord[] = parser._readContent();
        const widthRecord: _PdfRecord = records.filter(
            (record: _PdfRecord) => record._operator === 'w'
        )[0];
        expect(widthRecord).toBeDefined();
        expect(widthRecord._operands[0]).toEqual('1.000');
        document.destroy();
    });
    it('1041665 - Should create appearance when custom template exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 }
            );
        annotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                { x: 0, y: 0, width: 20, height: 20 },
                document._crossReference
            );
        annotation['_customTemplate'].set('N', template);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance during flatten when AP is not present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 }
            );
        annotation['_setAppearance'] = false;
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('AP'))
            .toBeFalsy();
        expect(annotation._dictionary.has(''))
            .toBeFalsy();
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should load appearance stream reference from AP dictionary', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedAnnotation['_appearanceTemplate'] = undefined as any;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should not create appearance template when AP dictionary has no N entry', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const appearanceDictionary: _PdfDictionary =
            new _PdfDictionary();
        loadedAnnotation._dictionary.update('AP', appearanceDictionary);
        loadedAnnotation['_appearanceTemplate'] = undefined as any;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeUndefined();
        document.destroy();
    });
    it('1041665 - Should reuse existing appearance template during flattening', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedAnnotation['_appearanceTemplate'] =
            new PdfTemplate(
                { x: 0, y: 0, width: 10, height: 10 },
                document._crossReference
            );
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance when flattening loaded annotation without AP', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 20, y: 20, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        delete loadedAnnotation._dictionary._map.AP;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance from custom template on loaded annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                { x: 10, y: 10, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                { x: 0, y: 0, width: 20, height: 20 },
                document._crossReference
            );
        loadedAnnotation['_customTemplate'].set('N', template);
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should reuse existing appearance template when template already exists', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        const existingTemplate: PdfTemplate =
            new PdfTemplate(
                { x: 0, y: 0, width: 10, height: 10 },
                document._crossReference
            );
        loadedAnnotation['_appearanceTemplate'] =
            existingTemplate;
        loadedAnnotation._doPostProcess(true);
        expect(
            loadedAnnotation['_appearanceTemplate']
        ).toBe(existingTemplate);
        document.destroy();
    });
    it('1041665 - Should update AP normal appearance reference', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary)
            .toBeDefined();
        const normalReference: _PdfReference =
            appearanceDictionary.getRaw('N');
        expect(normalReference)
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary when appearance already exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary)
            .toBeDefined();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not flatten popups when flattenPopups is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(true);
        expect(annotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance template from existing AP dictionary when flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        annotation.setAppearance(true);
        annotation._doPostProcess(false);
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use circle caption font when obtained font size is one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        const originalObtainFont: () => PdfFont =
            annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return new PdfStandardFont(
                PdfFontFamily.helvetica,
                1
            );
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont'])
            .toBe(annotation['_circleCaptionFont']);
        expect(annotation._dictionary.has('Measure'))
            .toBeTruthy();
        expect(annotation._dictionary.has('Contents'))
            .toBeTruthy();
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should retain obtained font when font size is greater than one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        const validFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const originalObtainFont: () => PdfFont =
            annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return validFont;
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont'])
            .not.toBe(annotation['_circleCaptionFont']);
        expect(annotation._dictionary.has('Measure'))
            .toBeTruthy();
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should preserve inner color in radius measure appearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.innerColor).toBeDefined();
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create diameter measurement appearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.measureType)
            .toEqual(PdfCircleMeasurementType.diameter);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents).toContain('cm');
        document.destroy();
    });
    it('1041665 - Should create radius appearance content with measurement text', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Radius',
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents).toContain('Radius');
        expect(contents).toContain('in');
        document.destroy();
    });
    it('1041665 - Should create AP dictionary with normal appearance reference', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        const ap: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(ap.has('N')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create measure dictionary for measured circle', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('Measure'))
            .toBeTruthy();
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Circle'));
        document.destroy();
    });
    it('1041665 - Should write contents with text prefix', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Circle Label',
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents.indexOf('Circle Label'))
            .toEqual(0);
        document.destroy();
    });
    it('1041665 - Should write contents without text prefix when text is empty', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents.indexOf('cm'))
            .toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should create DS style string with font and color information', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    color: { r: 200, g: 50, b: 20 },
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const ds: string =
            annotation._dictionary.get('DS');
        expect(ds.indexOf('font:'))
            .toBeGreaterThanOrEqual(0);
        expect(ds.indexOf('color:'))
            .toBeGreaterThanOrEqual(0);
        expect(ds.indexOf('pt;'))
            .toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should use default border width when BS dictionary is not available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS'))
            .toBeFalsy();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS'))
            .toBeTruthy();
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        const appearanceStream =
            appearanceDictionary.get('N');
        const strm = annotation._crossReference._fetch(appearanceStream);
        const parser: _ContentParser =
            new _ContentParser(
                (strm as _PdfContentStream)._bytes
            );
        const records: _PdfRecord[] =
            parser._readContent();
        const widthRecord: _PdfRecord =
            records.filter(
                (record: _PdfRecord) => record._operator === 'w'
            )[0];
        expect(widthRecord).toBeDefined();
        expect(widthRecord._operands[0]).toEqual('1.000');
        document.destroy();
    });
    it('1041665 - Should not create appearance when AP exists during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        annotation['_appearanceTemplate'] = undefined as any;
        annotation['_setAppearance'] = false;
        expect(annotation['_customTemplate'].size)
            .toEqual(0);
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance template from AP dictionary for loaded annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfCircleAnnotation =
            loadedPage.annotations.at(0) as PdfCircleAnnotation;
        expect(loadedAnnotation['_isLoaded'])
            .toBeTruthy();
        expect(loadedAnnotation._dictionary.has('AP'))
            .toBeTruthy();
        const apDictionary: _PdfDictionary =
            loadedAnnotation._dictionary.get('AP');
        expect(apDictionary).toBeDefined();
        expect(apDictionary.has('N'))
            .toBeTruthy();
        loadedAnnotation['_appearanceTemplate'] =
            undefined as any;
        loadedAnnotation['_setAppearance'] = false;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        const appearanceStream: _PdfBaseStream =
            apDictionary.get('N');
        const reference: _PdfReference =
            apDictionary.getRaw('N');
        expect(appearanceStream).toBeDefined();
        expect(reference).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should not create appearance template when AP dictionary does not contain N', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        annotation['_isLoaded'] = true;
        const appearanceDictionary: _PdfDictionary =
            new _PdfDictionary();
        annotation._dictionary.update('AP', appearanceDictionary);
        annotation['_appearanceTemplate'] =
            undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeUndefined();
        document.destroy();
    });
    it('1041665 - Should create appearance template from existing AP dictionary during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        annotation['_appearanceTemplate'] =
            undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        expect(appearanceDictionary.has('N'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not flatten popup when flattenPopups is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(true);
        expect(annotation.flattenPopups)
            .toBeFalsy();
        document.destroy();
    });
    it('1041665 - Should execute flatten popup branch when flattenPopups is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(true);
        expect(annotation.flattenPopups)
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create AP dictionary when AP is not available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        if (annotation._dictionary.has('AP')) {
            delete annotation._dictionary._map.AP;
        }
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should update normal appearance reference', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        const normalReference: _PdfReference =
            appearanceDictionary.getRaw('N');
        expect(normalReference)
            .toBeDefined();
        expect(appearanceDictionary.has('N'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should retain obtained font when font size is greater than one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        const validFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const originalObtainFont: () => PdfFont =
            annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return validFont;
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont'])
            .not.toBe(annotation['_circleCaptionFont']);
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should use circle caption font when obtained font size is one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        const originalObtainFont: () => PdfFont =
            annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return new PdfStandardFont(
                PdfFontFamily.helvetica,
                1
            );
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont'])
            .toBe(annotation['_circleCaptionFont']);
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should create radius measurement appearance content correctly', (): void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    text: 'Radius',
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        page = document.getPage(0) as PdfPage;
        annotation = page.annotations.at(0) as PdfCircleAnnotation;
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents).toContain('Radius');
        expect(contents).toContain('in');
        expect(annotation.measureType)
            .toEqual(PdfCircleMeasurementType.diameter);
        document.destroy();
    });
    it('1041665 - Should preserve innerColor in circle measure appearance', (): void => {
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                },
                {
                    innerColor: {
                        r: 0,
                        g: 255,
                        b: 0
                    },
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.radius
                    }
                }
            );
        expect(annotation.innerColor).toBeDefined();
        expect(annotation.innerColor.g).toEqual(255);
    });
    it('1041665 - Should create AP, Measure and DS entries for measured circle', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Circle Measure',
                    measure: {
                        unit: PdfMeasurementUnit.centimeter,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        expect(annotation._dictionary.has('Measure'))
            .toBeTruthy();
        expect(annotation._dictionary.has('DS'))
            .toBeTruthy();
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Circle'));
        const ds: string =
            annotation._dictionary.get('DS');
        expect(ds.indexOf('font:'))
            .toBeGreaterThanOrEqual(0);
        expect(ds.indexOf('color:'))
            .toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should create contents with text prefix', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Circle Label',
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents.indexOf('Circle Label'))
            .toEqual(0);
        document.destroy();
    });
    it('1041665 - Should create contents without text prefix when text is empty', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                },
                {
                    measure: {
                        unit: PdfMeasurementUnit.inch,
                        type: PdfCircleMeasurementType.diameter
                    }
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string =
            annotation._dictionary.get('Contents');
        expect(contents).toContain('in');
        document.destroy();
    });
    it('1041665 - Should not recreate appearance when AP dictionary already exists during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        const existingTemplate: PdfTemplate = annotation['_appearanceTemplate'];
        annotation['_setAppearance'] = false;
        expect(annotation['_customTemplate'].size).toEqual(0);
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBe(existingTemplate);
        expect(annotation._dictionary.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041665 - Should use default border width when BS dictionary is not available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfCircleAnnotation =
            new PdfCircleAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        const ap: _PdfDictionary = annotation._dictionary.get('AP');
        const appearanceStream: _PdfBaseStream = ap.get('N');
        const parser: _ContentParser = new _ContentParser((appearanceStream as _PdfContentStream)._bytes);
        const records: _PdfRecord[] = parser._readContent();
        const widthRecord: _PdfRecord = records.filter((record: _PdfRecord) =>record._operator === 'w')[0];
        expect(widthRecord).toBeDefined();
        expect(widthRecord._operands[0]).toEqual('1.000');
        document.destroy();
    });
});
describe('1041665 - PdfEllipseAnnotation mutation coverage', () => {
    it('1041665 - Should cover ellipse constructor property initialization branches', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 2;
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 20,
                y: 30,
                width: 120,
                height: 80
            },
            {
                text: 'Ellipse Text',
                author: 'Syncfusion',
                subject: 'Ellipse Subject',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                opacity: 0.5,
                border: border
            });
        expect(ellipse.bounds).toBeDefined();
        expect(ellipse.text).toBe('Ellipse Text');
        expect(ellipse.subject).toBe('Ellipse Subject');
        expect(ellipse.opacity).toBe(0.5);
        expect(ellipse.border.width).toBe(2);
        ellipse.author = 'Syncfusion';
        expect(ellipse.author).toBe('Syncfusion');
    });
    it('1041665 - Should cover ellipse post process with default border and color branches', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 60
            });
        ellipse._crossReference = document._crossReference;
        page.annotations.add(ellipse);
        ellipse['_dictionary']._map.C = undefined;
        delete ellipse['_dictionary']._map.C;
        ellipse._postProcess(false);
        expect(ellipse['_dictionary'].has('BS')).toBeTruthy();
        expect(ellipse.color).toBeDefined();
        expect(ellipse['_dictionary'].has('Rect')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover ellipse post process when border style exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 100
            });
        ellipse._crossReference = document._crossReference;
        const borderDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        borderDictionary.update('Type', _PdfName.get('Border'));
        borderDictionary.update('W', 3);
        ellipse['_dictionary'].update('BS', borderDictionary);
        page.annotations.add(ellipse);
        ellipse._postProcess(false);
        expect(ellipse.border.width).toBe(3);
        document.destroy();
    });
    it('1041665 - Should cover ellipse appearance generation during post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 40,
                y: 40,
                width: 120,
                height: 90
            });
        ellipse._crossReference = document._crossReference;
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        ellipse._postProcess(false);
        expect(ellipse['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance dictionary during post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 25, y: 25, width: 110, height: 75 });
        ellipse._crossReference = document._crossReference;
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse['_dictionary'].has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover flatten appearance processing', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 60, y: 60, width: 120, height: 90 });
        ellipse._crossReference = document._crossReference;
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        ellipse._doPostProcess(true);
        expect(ellipse['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover loaded ellipse appearance processing', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 50, y: 50, width: 100, height: 100 });
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        const savedDocument: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedDocument);
        const loadedPage: PdfPage =
            loadedDocument.getPage(0) as PdfPage;
        const loadedEllipse: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedEllipse.setAppearance(true);
        loadedEllipse._doPostProcess(false);
        expect(loadedEllipse['_appearanceTemplate']).toBeDefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should create appearance when set appearance is enabled', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 30, y: 30, width: 100, height: 70 });
        ellipse._crossReference = document._crossReference;
        page.annotations.add(ellipse);
        ellipse.setAppearance(true);
        ellipse._postProcess(false);
        expect(ellipse['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should assign default color when color is not present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 20, y: 20, width: 80, height: 80 });
        ellipse._crossReference = document._crossReference;
        ellipse._postProcess(false);
        expect(ellipse.color).toBeDefined();
        expect(ellipse['_isTransparentColor']).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use existing border dictionary during ellipse post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 20, y: 20, width: 100, height: 60 });
        ellipse._crossReference = document._crossReference;
        const borderDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        borderDictionary.update('W', 4);
        ellipse['_dictionary'].update('BS', borderDictionary);
        ellipse._postProcess(false);
        expect(ellipse.border.width).toBe(4);
        document.destroy();
    });
    it('1041665 - Should create border dictionary during ellipse post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            { x: 10, y: 10, width: 100, height: 50 });
        ellipse._crossReference = document._crossReference;
        page.annotations.add(ellipse);
        ellipse._postProcess(false);
        expect(ellipse['_dictionary'].has('BS')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should initialize ellipse annotation properties from constructor', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 3;
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 20,
                y: 20,
                width: 120,
                height: 90
            },
            {
                text: 'Ellipse Text',
                author: 'Syncfusion',
                subject: 'Ellipse Subject',
                color: { r: 255, g: 0, b: 0 },
                innerColor: { r: 0, g: 255, b: 0 },
                opacity: 0.5,
                border: border
            });
        expect(ellipse.text).toBe('Ellipse Text');
        ellipse.author = 'Syncfusion';
        expect(ellipse.author).toBe('Syncfusion');
        expect(ellipse.subject).toBe('Ellipse Subject');
        expect(ellipse.opacity).toBe(0.5);
        expect(ellipse.border.width).toBe(3);
        expect(ellipse.color).toBeDefined();
        expect(ellipse.innerColor).toBeDefined();
    });
    it('1041665 - Should initialize ellipse annotation with valid bounds', (): void => {
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 20,
                width: 100,
                height: 80
            });
        expect(ellipse.bounds).toBeDefined();
        expect(ellipse.bounds.x).toBe(10);
        expect(ellipse.bounds.y).toBe(20);
        expect(ellipse.bounds.width).toBe(100);
        expect(ellipse.bounds.height).toBe(80);
    });
    it('1041665 - Should cover loaded ellipse flatten popup branch', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });
        ellipse.flattenPopups = true;
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse.flattenPopups).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should cover loaded ellipse flatten processing path', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 50,
                y: 50,
                width: 100,
                height: 100
            });
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            loadedDocument.getPage(0) as PdfPage;
        const loadedEllipse: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedEllipse['_isLoaded'] = true;
        loadedEllipse['_appearanceTemplate'] = undefined as any;
        loadedEllipse._doPostProcess(true);
        expect(loadedEllipse._dictionary.has('AP'))
            .toBeTruthy();
        loadedDocument.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary during ellipse appearance update', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 120,
                height: 120
            });
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse._dictionary.has('AP')).toBeTruthy();
        ellipse._doPostProcess(false);
        expect(ellipse._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create ellipse appearance when appearance flag is enabled', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 30,
                y: 30,
                width: 120,
                height: 80
            });
        ellipse.setAppearance(true);
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse['_appearanceTemplate']).toBeDefined();
        expect(ellipse._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should mark ellipse color as transparent when color is absent', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            });
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse['_isTransparentColor']).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use existing border dictionary in ellipse post process', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 4;
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {
                border
            });
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.annotations.add(ellipse);
        ellipse._doPostProcess(false);
        expect(ellipse.border.width).toBe(4);
        document.destroy();
    });
    it('1041665 - Should create border style dictionary during ellipse post process', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 80
            });
        page.annotations.add(ellipse);
        expect(ellipse._dictionary.has('BS')).toBeFalsy();
        ellipse._doPostProcess(false);
        expect(ellipse._dictionary.has('BS')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should leave optional ellipse properties undefined when properties are empty', (): void => {
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {}
        );
        expect(ellipse.text).toBeUndefined();
        expect(ellipse.author).toBeUndefined();
        expect(ellipse.subject).toBeUndefined();
        expect(ellipse.color).toBeUndefined();
        expect(ellipse.innerColor).toBeUndefined();
        expect(ellipse.opacity).toBe(1);
    });
    it('1041665 - Should leave optional ellipse properties undefined when properties are empty', (): void => {
        const ellipse: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 10,
                y: 10,
                width: 100,
                height: 100
            },
            {}
        );
        expect(ellipse.text).toBeUndefined();
        expect(ellipse.author).toBeUndefined();
        expect(ellipse.subject).toBeUndefined();
        expect(ellipse.color).toBeUndefined();
        expect(ellipse.innerColor).toBeUndefined();
        expect(ellipse.opacity).toBe(1);
    });
    it('1041665 - Ellipse Should not invoke setters when optional properties are absent', (): void => {
        const textSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'text',
            'set'
        ).and.callThrough();
        const authorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'author',
            'set'
        ).and.callThrough();
        const subjectSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'subject',
            'set'
        ).and.callThrough();
        const colorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'color',
            'set'
        ).and.callThrough();
        const opacitySpy = spyOnProperty(
            PdfAnnotation.prototype,
            'opacity',
            'set'
        ).and.callThrough();
        const borderSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'border',
            'set'
        ).and.callThrough();
        const annotation: PdfEllipseAnnotation = new PdfEllipseAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 50
            },
            {}
        );
        expect(annotation.text).toBeUndefined();
        expect(annotation._text).toBeUndefined();
        expect(annotation._dictionary.has('Contents')).toBeFalsy();
        expect(textSpy).not.toHaveBeenCalled();
        expect(authorSpy).not.toHaveBeenCalled();
        expect(subjectSpy).not.toHaveBeenCalled();
        expect(colorSpy).not.toHaveBeenCalled();
        expect(opacitySpy).not.toHaveBeenCalled();
        expect(borderSpy).not.toHaveBeenCalled();
    });
    it('1041665 - Should initialize ellipse annotation dictionary entries', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                }
            );
        expect(annotation._dictionary.get('Type'))
            .toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Circle'));
        expect(annotation._dictionary.has(''))
            .toBeFalsy();
    });
    it('1041665 - Should not assign bounds when required values are undefined', (): void => {
        const annotationWithoutX: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(<any>{
                y: 20,
                width: 100,
                height: 80
            });
        expect(annotationWithoutX.bounds).toBeUndefined();
        const annotationWithoutY: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(<any>{
                x: 20,
                width: 100,
                height: 80
            });
        expect(annotationWithoutY.bounds).toBeUndefined();
        const annotationWithoutWidth: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(<any>{
                x: 20,
                y: 20,
                height: 80
            });
        expect(annotationWithoutWidth.bounds).toBeUndefined();
        const annotationWithoutHeight: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(<any>{
                x: 20,
                y: 20,
                width: 100
            });
        expect(annotationWithoutHeight.bounds).toBeUndefined();
    });
    it('1041665 - Should assign bounds when all values are provided', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                }
            );
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(100);
        expect(annotation.bounds.height).toEqual(80);
    });
    it('1041665 - Should not initialize innerColor when property is omitted', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                },
                {}
            );
        expect(annotation.innerColor).toBeUndefined();
    });
    it('1041665 - Should initialize innerColor when provided', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                },
                {
                    innerColor: {
                        r: 0,
                        g: 255,
                        b: 0
                    }
                }
            );
        expect(annotation.innerColor.g)
            .toEqual(255);
    });
    it('1041665 - Should initialize all ellipse constructor properties', (): void => {
        const border: PdfAnnotationBorder =
            new PdfAnnotationBorder();
        border.width = 2;
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                },
                {
                    text: 'Ellipse Text',
                    author: 'Syncfusion',
                    subject: 'Ellipse Subject',
                    color: {
                        r: 255,
                        g: 0,
                        b: 0
                    },
                    innerColor: {
                        r: 0,
                        g: 255,
                        b: 0
                    },
                    opacity: 0.5,
                    border
                }
            );
        expect(annotation.text)
            .toEqual('Ellipse Text');
        expect(annotation.author)
            .toEqual('Syncfusion');
        expect(annotation.subject)
            .toEqual('Ellipse Subject');
        expect(annotation.color.r)
            .toEqual(255);
        expect(annotation.innerColor.g)
            .toEqual(255);
        expect(annotation.opacity)
            .toEqual(0.5);
        expect(annotation.border.width)
            .toEqual(2);
        expect(annotation._type)
            .toEqual(_PdfAnnotationType.ellipseAnnotation);
    });
    it('1041665 - Should throw when bounds is undefined', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(<any>{});
        expect((): void => {
            annotation._postProcess(false);
        }).toThrowError('Bounds cannot be null or undefined');
    });
    it('1041665 - Should create BS dictionary and use default border width', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS'))
            .toBeFalsy();
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BS'))
            .toBeTruthy();
        expect(annotation._dictionary.has(''))
            .toBeFalsy();
        expect(annotation['_isTransparentColor'])
            .toBeTruthy();
        expect(annotation.color.r).toEqual(0);
        expect(annotation.color.g).toEqual(0);
        expect(annotation.color.b).toEqual(0);
        document.destroy();
    });
    it('1041665 - Should use border width from existing BS dictionary', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const border: PdfAnnotationBorder =
            new PdfAnnotationBorder();
        border.width = 5;
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                },
                {
                    border,
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS'))
            .toBeTruthy();
        expect(annotation.border.width)
            .toEqual(5);
        document.destroy();
    });
    it('1041665 - Should create appearance when flattening and AP is absent', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        annotation['_setAppearance'] = false;
        expect(annotation._dictionary.has('AP'))
            .toBeFalsy();
        annotation._postProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance when custom template exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        annotation['_customTemplate'].set('N', template);
        page.annotations.add(annotation);
        annotation._postProcess(false);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should use false as default flatten value', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation._doPostProcess();
        expect(loadedAnnotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create appearance from custom template on loaded annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        loadedAnnotation['_customTemplate'].set('N', template);
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance when flattening loaded annotation without AP', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        delete loadedAnnotation._dictionary._map.AP;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should load appearance template from AP dictionary reference', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        const loadedPage: PdfPage =
            document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation =
            loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_appearanceTemplate'] =
            undefined as any;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate'])
            .toBeDefined();
        expect(loadedAnnotation._dictionary.has('AP'))
            .toBeTruthy();
        const appearanceDictionary: _PdfDictionary =
            loadedAnnotation._dictionary.get('AP');
        expect(appearanceDictionary.has('N'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not recreate appearance template when flatten is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const existingTemplate: PdfTemplate =
            annotation['_appearanceTemplate'];
        annotation._doPostProcess(false);
        expect(annotation['_appearanceTemplate']).not.toBeUndefined();
        document.destroy();
    });
    it('1041665 - Should load appearance template from AP dictionary during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate'])
            .toBeDefined();
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary.has('N'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not flatten popup when flattenPopups is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should execute flatten popup branch when flattenPopups is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.flattenPopups)
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary during appearance update', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        expect(appearanceDictionary)
            .toBeDefined();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create updated AP dictionary when AP is missing', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        delete annotation._dictionary._map.AP;
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP'))
            .toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should update normal appearance reference', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary =
            annotation._dictionary.get('AP');
        const normalReference: _PdfReference =
            appearanceDictionary.getRaw('N');
        expect(normalReference)
            .toBeDefined();
        document.destroy();
    });
    it('1041665 - Should not create appearance when appearance flags are not set', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_setAppearance'] = false;
        expect(annotation['_customTemplate'].size).toEqual(0);
        annotation._postProcess(false);
        expect(annotation['_appearanceTemplate']).toBeUndefined();
    });
    it('1041665 - Should create appearance when flattening and AP is not present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation['_setAppearance'] = false;
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('AP')).toBeFalsy();
        expect(annotation._dictionary.has('')).toBeFalsy();
        annotation._postProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should not create appearance when flatten is false and AP is absent', (): void => {
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation['_setAppearance'] = false;
        expect(annotation._dictionary.has('AP')).toBeFalsy();
        expect(annotation['_customTemplate'].size).toEqual(0);
        annotation._postProcess(false);
        expect(annotation['_appearanceTemplate']).toBeUndefined();
    });
    it('1041665 - Should throw error when bounds is undefined', (): void => {
        const annotation: PdfEllipseAnnotation = new PdfEllipseAnnotation(null as any);
        expect((): void => {
            annotation._postProcess(false);
        }).toThrowError('Bounds cannot be null or undefined');
    });
    it('1041665 - Should create BS dictionary and preserve default border width behavior', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        expect(annotation._dictionary.has('')).toBeFalsy();
        expect(annotation._dictionary.get('BS').get('Type')).toEqual(_PdfName.get('Border'));
        expect(annotation['_isTransparentColor']).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use border width from existing BS dictionary', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 5;
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                },
                {
                    border,
                    color: { r: 255, g: 0, b: 0 }
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        expect(annotation.border.width).toEqual(5);
        const ap: _PdfDictionary = annotation._dictionary.get('AP');
        const appearanceStream: _PdfBaseStream = ap.get('N');
        const parser: _ContentParser = new _ContentParser((appearanceStream as _PdfContentStream)._bytes);
        const records: _PdfRecord[] = parser._readContent();
        const widthRecord: _PdfRecord = records.filter((record: _PdfRecord) => record._operator === 'w')[0];
        expect(widthRecord._operands[0]).toEqual('5.000');
        document.destroy();
    });
    it('1041665 - Should load appearance template from AP dictionary', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation = loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_appearanceTemplate'] = undefined as any;
        loadedAnnotation['_setAppearance'] = false;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        const apDictionary: _PdfDictionary = loadedAnnotation._dictionary.get('AP');
        expect(apDictionary).toBeDefined();
        expect(apDictionary.has('N')).toBeTruthy();
        const appearanceStream: _PdfBaseStream = apDictionary.get('N');
        const reference: _PdfReference = apDictionary.getRaw('N');
        expect(appearanceStream).toBeDefined();
        expect(reference).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance during flattening when AP is absent', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation = loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        if (loadedAnnotation._dictionary.has('AP')) {
            delete loadedAnnotation._dictionary._map.AP;
        }
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance from custom template in loaded annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation = loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        loadedAnnotation['_customTemplate'].set('N', template);
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should use false as default flatten value for loaded ellipse annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfEllipseAnnotation = loadedPage.annotations.at(0) as PdfEllipseAnnotation;
        loadedAnnotation._doPostProcess();
        expect(loadedAnnotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should reuse existing appearance template when flatten is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const existingTemplate: PdfTemplate = annotation['_appearanceTemplate'];
        annotation._doPostProcess(false);
        expect(annotation['_appearanceTemplate']._content._bytes.length).toBe(existingTemplate._content._bytes.length);
        document.destroy();
    });
    it('1041665 - Should create appearance template from AP dictionary during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        expect(appearanceDictionary.has('N')).toBeTruthy();
        const reference: _PdfReference = appearanceDictionary.getRaw('N');
        expect(reference).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should not execute popup flattening when flattenPopups is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.flattenPopups).toBeFalsy();
        document.destroy();
    });
    it('1041665 - Should execute popup flattening path when flattenPopups is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.flattenPopups).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary for ellipse appearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create AP dictionary when AP is not available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        if (annotation._dictionary.has('AP')) {
            delete annotation._dictionary._map.AP;
        }
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should update normal appearance reference for ellipse annotation', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        const normalReference: _PdfReference = appearanceDictionary.getRaw('N');
        expect(normalReference).toBeDefined();
        expect(appearanceDictionary.has('N')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should draw custom appearance when custom template exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfEllipseAnnotation =
            new PdfEllipseAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                }
            );
        const template: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        annotation['_customTemplate'].set('N', template);
        annotation['_setAppearance'] = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation['_customTemplate'].size).toBeGreaterThan(0);
        document.destroy();
    });
});
describe('1041665 - PdfSquareAnnotation constructor mutation coverage', (): void => {
    it('1041665 - Should initialize all constructor properties and measurement unit', (): void => {
        const annotationBorder: PdfAnnotationBorder =
            new PdfAnnotationBorder();
        annotationBorder.width = 2;
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 120,
                    height: 100
                },
                {
                    text: 'Square Text',
                    author: 'Syncfusion',
                    subject: 'Square Subject',
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    opacity: 0.5,
                    border: annotationBorder,
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        expect(annotation.text).toEqual('Square Text');
        expect(annotation.author).toEqual('Syncfusion');
        expect(annotation.subject).toEqual('Square Subject');
        expect(annotation.color.r).toEqual(255);
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation.opacity).toEqual(0.5);
        expect(annotation.border.width).toEqual(2);
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(120);
        expect(annotation.bounds.height).toEqual(100);
        expect(annotation._dictionary.get('Type'))
            .toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Square'));
        expect(annotation._dictionary.has('')).toBeFalsy();
    });
    it('1041665 - Should not assign bounds when x is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(<any>{
                y: 20,
                width: 120,
                height: 100
            });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - Should not assign bounds when y is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(<any>{
                x: 10,
                width: 120,
                height: 100
            });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - Should not assign bounds when width is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(<any>{
                x: 10,
                y: 20,
                height: 100
            });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - Should not assign bounds when height is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(<any>{
                x: 10,
                y: 20,
                width: 120
            });
        expect(annotation.bounds).toBeUndefined();
    });
    it('1041665 - Should not initialize optional properties when properties object is empty', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {}
            );
        expect(annotation.text).toBeUndefined();
        expect(annotation.author).toBeUndefined();
        expect(annotation.subject).toBeUndefined();
        expect(annotation.color).toBeUndefined();
        expect(annotation.innerColor).toBeUndefined();
        expect(annotation.opacity).toEqual(1);
        expect(annotation.measure).toBeFalsy();
    });
    it('1041665 - Should enable measure when measurementUnit is provided', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit)
            .toEqual(PdfMeasurementUnit.centimeter);
    });
    it('1041665 - Should maintain default values when measurementUnit is not provided', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    text: 'Square'
                }
            );
        expect(annotation.measure).toBeFalsy();
        expect(annotation.unit)
            .toEqual(PdfMeasurementUnit.centimeter);
    });
    it('1041665 - Should initialize all constructor properties and measurement unit Appearance', (): void => {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotationBorder: PdfAnnotationBorder =
            new PdfAnnotationBorder();
        annotationBorder.width = 2;
        let annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 120,
                    height: 100
                },
                {
                    text: 'Square Text',
                    author: 'Syncfusion',
                    subject: 'Square Subject',
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    opacity: 0.5,
                    border: annotationBorder,
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        annotation.setAppearance(true);
        expect(annotation.text).toEqual('Square Text');
        expect(annotation.author).toEqual('Syncfusion');
        expect(annotation.subject).toEqual('Square Subject');
        expect(annotation.color.r).toEqual(255);
        expect(annotation.innerColor.g).toEqual(255);
        expect(annotation.opacity).toEqual(0.5);
        expect(annotation.border.width).toEqual(2);
        expect(annotation.measure).toBeTruthy();
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(120);
        expect(annotation.bounds.height).toEqual(100);
        expect(annotation._dictionary.get('Type'))
            .toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype'))
            .toEqual(_PdfName.get('Square'));
        expect(annotation._dictionary.has('')).toBeFalsy();
        page.annotations.add(annotation);
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0) as PdfPage;
        annotation = page.annotations.at(0) as PdfSquareAnnotation;
        let appearance = annotation._dictionary.get('AP').get('N');
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result[0]._operands).toEqual(['/DeviceRGB']);
        expect(result[0]._operator).toEqual('CS');
        expect(result[1]._operands).toEqual(['/DeviceRGB']);
        expect(result[1]._operator).toEqual('cs');
        expect(result[2]._operands).toEqual(['[]', '0']);
        expect(result[2]._operator).toEqual('d');
        expect(result[3]._operands).toEqual(['2.000']);
        expect(result[3]._operator).toEqual('w');
        expect(result[4]._operands).toEqual(['0']);
        expect(result[4]._operator).toEqual('j');
        expect(result[5]._operands).toEqual(['0']);
        expect(result[5]._operator).toEqual('J');
        expect(result[6]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('RG');
        expect(result[7]._operands).toEqual(['11.000', '119.000', '118.000', '-98.000']);
        expect(result[7]._operator).toEqual('re');
        expect(result[8]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('S');
        expect(result[9]._operands).toEqual([]);
        expect(result[9]._operator).toEqual('q');
        expect(result[10]._operands).toEqual([
            '1.00',
            '.00',
            '.00',
            '1.00',
            '10.00',
            '20.00',
        ]);
        expect(result[10]._operator).toEqual('cm');
        expect(result[11]._operands).toEqual([
            '1.00',
            '.00',
            '.00',
            '1.00',
            '42.66',
            '54.62',
        ]);
        expect(result[11]._operator).toEqual('cm');
        expect(result[12]._operands).toEqual([]);
        expect(result[12]._operator).toEqual('BT');
        expect(result[13]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[13]._operator).toEqual('rg');
        expect(result[14]._operator).toEqual('Tf');
        expect(result[15]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('Tr');
        expect(result[16]._operands).toEqual(['0.000']);
        expect(result[16]._operator).toEqual('Tc');
        expect(result[17]._operands).toEqual(['0.000']);
        expect(result[17]._operator).toEqual('Tw');
        expect(result[18]._operands).toEqual(['100.000']);
        expect(result[18]._operator).toEqual('Tz');
        expect(result[19]._operands).toEqual([
            '1.00',
            '.00',
            '.00',
            '1.00',
            '.00',
            '-7.45',
        ]);
        expect(result[19]._operator).toEqual('Tm');
        expect(result[20]._operands).toEqual(['(2.31 sq in)']);
        expect(result[20]._operator).toEqual("'");
        expect(result[21]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('ET');
        expect(result[22]._operands).toEqual([]);
        expect(result[22]._operator).toEqual('Q');
        document.destroy();
    });
    it('1041665 - Should return cached unit when text is updated and set unit when measure is enabled', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        annotation['_isLoaded'] = false;
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        annotation['_isTextUpdated'] = true;
        annotation['_unit'] = PdfMeasurementUnit.centimeter;
        annotation['_isTextUpdated'] = false;
    });
    it('1041665 - Should set measure only when annotation is not loaded', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            );
        annotation['_isLoaded'] = false;
        annotation.measure = true;
        expect(annotation.measure).toBeTruthy();
        annotation['_isLoaded'] = true;
        annotation.measure = false;
        expect(annotation.measure).toBeTruthy();
    });
    it('1041665 - Should execute loaded measure branch in doPostProcess', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = loadedPage.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_setAppearance'] = true;
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation._dictionary.has('AP')).toBeTruthy();
        expect(loadedAnnotation._dictionary.has('Measure')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should calculate rectangle area when width differs from height', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 120,
                    height: 80
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        const area: number = annotation._calculateAreaOfSquare();
        expect(area).toBeGreaterThan(0);
    });
    it('1041665 - Should calculate square area when width equals height', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        const area: number = annotation._calculateAreaOfSquare();
        expect(area).toBeGreaterThan(0);
    });
    it('1041665 - Should cover non loaded flatten popup branch', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should cover loaded flatten popup branch', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = loadedPage.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation.flattenPopups = true;
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should load appearance template from AP dictionary', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 10, y: 10, width: 100, height: 100 },
                {
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = loadedPage.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_appearanceTemplate'] = undefined as any;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create measure appearance after reload', (): void => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 20, y: 20, width: 100, height: 100 },
                {
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const bytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(bytes);
        const loadedPage: PdfPage = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = loadedPage.annotations.at(0) as PdfSquareAnnotation;
        expect(loadedAnnotation['_isLoaded']).toBeTruthy();
        loadedAnnotation['_setAppearance'] = true;
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use existing BS dictionary branch', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder();
        border.width = 4;
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 0, y: 0, width: 120, height: 120 },
                { border: border }
            );
        annotation._postProcess(false);
        expect(annotation.border.width).toEqual(4);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
    });
    it('1041665 - Should create BS dictionary when BS is not present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 0, y: 0, width: 100, height: 100 }
            );
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create BE dictionary for cloudy border effect', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 20, y: 20, width: 100, height: 100 }
            );
        const borderEffect: PdfBorderEffect = new PdfBorderEffect();
        borderEffect.style = PdfBorderEffectStyle.cloudy;
        borderEffect.intensity = 2;
        annotation.borderEffect = borderEffect;
        page.annotations.add(annotation);
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BE')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should load borderEffect from BE dictionary', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                { x: 10, y: 10, width: 100, height: 100 }
            );
        const beDictionary: _PdfDictionary = new _PdfDictionary();
        beDictionary.update('I', 2);
        beDictionary.update('S', _PdfName.get('C'));
        annotation._dictionary.update('BE', beDictionary);
        const borderEffect: PdfBorderEffect = annotation.borderEffect;
        expect(borderEffect).toBeDefined();
        expect(borderEffect._intensity).toEqual(2);
    });
    it('1041665 - Should not invoke setters when optional properties are absent', (): void => {
        const textSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'text',
            'set'
        ).and.callThrough();
        const authorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'author',
            'set'
        ).and.callThrough();
        const subjectSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'subject',
            'set'
        ).and.callThrough();
        const colorSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'color',
            'set'
        ).and.callThrough();
        const opacitySpy = spyOnProperty(
            PdfAnnotation.prototype,
            'opacity',
            'set'
        ).and.callThrough();
        const borderSpy = spyOnProperty(
            PdfAnnotation.prototype,
            'border',
            'set'
        ).and.callThrough();
        const measureSpy = spyOnProperty(
            PdfSquareAnnotation.prototype,
            'measure',
            'set'
        ).and.callThrough();
        const unitSpy = spyOnProperty(
            PdfSquareAnnotation.prototype,
            'unit',
            'set'
        ).and.callThrough();
        const annotation: PdfSquareAnnotation = new PdfSquareAnnotation(
            {
                x: 20,
                y: 20,
                width: 100,
                height: 100
            },
            {}
        );
        expect(annotation.text).toBeUndefined();
        expect(annotation._text).toBeUndefined();
        expect(annotation._dictionary.has('Contents')).toBeFalsy();
        expect(textSpy).not.toHaveBeenCalled();
        expect(authorSpy).not.toHaveBeenCalled();
        expect(subjectSpy).not.toHaveBeenCalled();
        expect(colorSpy).not.toHaveBeenCalled();
        expect(opacitySpy).not.toHaveBeenCalled();
        expect(borderSpy).not.toHaveBeenCalled();
        expect(measureSpy).not.toHaveBeenCalled();
        expect(unitSpy).not.toHaveBeenCalled();
    });
    it('1041665 - Should initialize square annotation correctly and should not assign bounds when required values are missing', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                }
            );
        expect(annotation.bounds.x).toEqual(10);
        expect(annotation.bounds.y).toEqual(20);
        expect(annotation.bounds.width).toEqual(100);
        expect(annotation.bounds.height).toEqual(80);
        expect(annotation._type).toEqual(_PdfAnnotationType.squareAnnotation);
        expect(annotation._dictionary.get('Type')).toEqual(_PdfName.get('Annot'));
        expect(annotation._dictionary.get('Subtype')).toEqual(_PdfName.get('Square'));
        expect(annotation._dictionary.has('')).toBeFalsy();
        const annotationWithoutX: PdfSquareAnnotation = new PdfSquareAnnotation(<any>{ y: 20, width: 100, height: 80 });
        expect(annotationWithoutX.bounds).toBeUndefined();
        const annotationWithoutY: PdfSquareAnnotation = new PdfSquareAnnotation(<any>{ x: 20, width: 100, height: 80 });
        expect(annotationWithoutY.bounds).toBeUndefined();
        const annotationWithoutWidth: PdfSquareAnnotation = new PdfSquareAnnotation(<any>{ x: 20, y: 20, height: 80 });
        expect(annotationWithoutWidth.bounds).toBeUndefined();
        const annotationWithoutHeight: PdfSquareAnnotation = new PdfSquareAnnotation(<any>{ x: 20, y: 20, width: 100 });
        expect(annotationWithoutHeight.bounds).toBeUndefined();
        const annotationWithNullBounds: PdfSquareAnnotation = new PdfSquareAnnotation(null as any);
        expect(annotationWithNullBounds.bounds).toBeUndefined();
    });
    it('1041665 - Should not initialize innerColor when property is not provided', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                },
                {}
            );
        expect(annotation.innerColor).toBeUndefined();
    });
    it('1041665 - Should initialize innerColor when property is provided', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 80
                },
                {
                    innerColor: {
                        r: 0,
                        g: 255,
                        b: 0
                    }
                }
            );
        expect(annotation.innerColor).toBeDefined();
        expect(annotation.innerColor.g).toEqual(255);
    });
    it('1041665 - Should not overwrite existing measure value from dictionary', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_measure'] = false;
        annotation._dictionary.update('Measure', true);
        expect(annotation.measure).toBeFalsy();
    });
    it('1041665 - Should not update measure when annotation is loaded', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_measure'] = false;
        annotation['_isLoaded'] = true;
        annotation.measure = true;
        expect(annotation['_measure']).toBeFalsy();
    });
    it('1041665 - Should not update measure when value is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_measure'] = false;
        annotation['_isLoaded'] = false;
        annotation.measure = undefined as any;
        expect(annotation['_measure']).toBeFalsy();
    });
    it('1041665 - Should update measure when annotation is not loaded', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_isLoaded'] = false;
        annotation.measure = true;
        expect(annotation.measure).toBeTruthy();
    });
    it('1041665 - Should return cached unit when text is updated', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation['_unit'] = PdfMeasurementUnit.inch;
        annotation['_isTextUpdated'] = true;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
        annotation['_isTextUpdated'] = false;
    });
    it('1041665 - Should resolve unit from contents dictionary', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(savedBytes);
        const loadedPage: PdfPage = loadedDocument.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = loadedPage.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_unit'] = undefined as any;
        loadedAnnotation['_isTextUpdated'] = false;
        expect(loadedAnnotation.unit).toBeUndefined();
        loadedDocument.destroy();
    });
    it('1041665 - Should not update unit when annotation is loaded', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        annotation['_isLoaded'] = true;
        const previousUnit: PdfMeasurementUnit = annotation['_unit'];
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation['_unit']).toEqual(previousUnit);
    });
    it('1041665 - Should not update unit when value is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        annotation['_isLoaded'] = false;
        const previousUnit: PdfMeasurementUnit = annotation['_unit'];
        annotation.unit = undefined as any;
        expect(annotation['_unit']).toEqual(previousUnit);
    });
    it('1041665 - Should update unit when measure is enabled and annotation is not loaded', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        annotation['_isLoaded'] = false;
        annotation.unit = PdfMeasurementUnit.inch;
        expect(annotation.unit).toEqual(PdfMeasurementUnit.inch);
    });
    it('1041665 - Should throw error when bounds is undefined', (): void => {
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(null as any);
        expect((): void => {
            annotation._postProcess(false);
        }).toThrowError('Bounds cannot be null or undefined');
    });
    it('1041665 - Should create BS dictionary and use transparent default color', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        expect(annotation._dictionary.has('BS')).toBeFalsy();
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BS')).toBeTruthy();
        expect(annotation._dictionary.has('')).toBeFalsy();
        expect(annotation['_isTransparentColor']).toBeTruthy();
        expect(annotation.color.r).toEqual(0);
        expect(annotation.color.g).toEqual(0);
        expect(annotation.color.b).toEqual(0);
        document.destroy();
    });
    it('1041665 - Should create appearance when custom template is available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        annotation['_customTemplate'].set('N', template);
        page.annotations.add(annotation);
        annotation._postProcess(false);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create BE dictionary for cloudy border effect', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        const borderEffect: PdfBorderEffect = new PdfBorderEffect();
        borderEffect.style = PdfBorderEffectStyle.cloudy;
        borderEffect.intensity = 2;
        annotation.borderEffect = borderEffect;
        page.annotations.add(annotation);
        annotation._postProcess(false);
        expect(annotation._dictionary.has('BE')).toBeTruthy();
        const beDictionary: _PdfDictionary = annotation._dictionary.get('BE');
        expect(beDictionary.get('I')).toEqual(2);
        expect(beDictionary.get('S')).toEqual(_PdfName.get('C'));
        document.destroy();
    });
    it('1041665 - Should create appearance from custom template for loaded square annotation', (): void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        const template: PdfTemplate =
            new PdfTemplate(
                { x: 0, y: 0, width: 20, height: 20 },
                document._crossReference
            );
        loadedAnnotation['_customTemplate'].set('N', template);
        loadedAnnotation._doPostProcess(false);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance when flattening loaded square annotation without AP', (): void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_setAppearance'] = false;
        if (loadedAnnotation._dictionary.has('AP')) {
            delete loadedAnnotation._dictionary._map.AP;
        }
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        document.destroy();
    });
    it('1041665 - Should create appearance template from AP dictionary stream', (): void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
        loadedAnnotation['_appearanceTemplate'] = undefined as any;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBeDefined();
        const appearanceDictionary: _PdfDictionary = loadedAnnotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        expect(appearanceDictionary.has('N')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should preserve existing appearance template when already available', (): void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        const savedBytes: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0) as PdfPage;
        const loadedAnnotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
        const existingTemplate: PdfTemplate =
            new PdfTemplate(
                { x: 0, y: 0, width: 10, height: 10 },
                document._crossReference
            );
        loadedAnnotation['_appearanceTemplate'] = existingTemplate;
        loadedAnnotation._doPostProcess(true);
        expect(loadedAnnotation['_appearanceTemplate']).toBe(existingTemplate);
        document.destroy();
    });
    it('1041665 - Should create appearance template from existing AP dictionary during flattening', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        annotation['_appearanceTemplate'] = undefined as any;
        annotation._doPostProcess(true);
        expect(annotation['_appearanceTemplate']).toBeDefined();
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        expect(appearanceDictionary.has('N')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should not flatten popups when flattenPopups is false', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = false;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.flattenPopups).toBeFalsy();
        document.destroy();
    });
    it('1041665 - Should execute flatten popup path when flattenPopups is true', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                }
            );
        annotation.flattenPopups = true;
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.flattenPopups).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should reuse existing AP dictionary when appearance already exists', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 30,
                    y: 30,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        expect(appearanceDictionary).toBeDefined();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should create AP dictionary when AP is not available', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 40,
                    y: 40,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        if (annotation._dictionary.has('AP')) {
            delete annotation._dictionary._map.AP;
        }
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should update normal appearance reference for square annotation', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 50,
                    y: 50,
                    width: 100,
                    height: 100
                }
            );
        annotation.setAppearance(true);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const appearanceDictionary: _PdfDictionary = annotation._dictionary.get('AP');
        const normalReference: _PdfReference = appearanceDictionary.getRaw('N');
        expect(normalReference).toBeDefined();
        expect(appearanceDictionary.has('N')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should use square caption font when obtained font size is one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        page.annotations.add(annotation);
        const originalObtainFont: () => PdfFont = annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return new PdfStandardFont(
                PdfFontFamily.helvetica,
                1
            );
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont']).toBe(annotation['_circleCaptionFont']);
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should preserve inner color in square measurement appearance', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 120,
                    height: 120
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation.innerColor).toBeDefined();
        expect(annotation.innerColor.g).toEqual(255);
        document.destroy();
    });
    it('1041665 - Should update rect correctly when custom template is present', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 50,
                    y: 60,
                    width: 100,
                    height: 80
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        const customTemplate: PdfTemplate =
            new PdfTemplate(
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20
                },
                document._crossReference
            );
        annotation['_customTemplate'].set('N', customTemplate);
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const rect: any = annotation._dictionary.getArray('Rect');
        expect(rect).toBeDefined();
        expect(rect.length).toEqual(4);
        document.destroy();
    });
    it('1041665 - Should retain valid font when font size is greater than one', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        page.annotations.add(annotation);
        const validFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const originalObtainFont: () => PdfFont = annotation['_obtainFont'];
        annotation['_obtainFont'] = (): PdfFont => {
            return validFont;
        };
        annotation._doPostProcess(false);
        expect(annotation['_pdfFont']).not.toBe(annotation['_circleCaptionFont']);
        annotation['_obtainFont'] = originalObtainFont;
        document.destroy();
    });
    it('1041665 - Should create complete square measure appearance with text', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 50,
                    y: 50,
                    width: 120,
                    height: 120
                },
                {
                    text: 'Square Measure',
                    color: { r: 255, g: 0, b: 0 },
                    innerColor: { r: 0, g: 255, b: 0 },
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        expect(annotation._dictionary.has('DS')).toBeTruthy();
        expect(annotation._dictionary.has('Contents')).toBeTruthy();
        expect(annotation._dictionary.has('Vertices')).toBeTruthy();
        expect(annotation._dictionary.get('Subject')).toEqual('Area Measurement');
        expect(annotation._dictionary.get('IT')).toEqual(_PdfName.get('SquareDimension'));
        expect(annotation._dictionary.get('Subtype')).toEqual(_PdfName.get('Square'));
        const vertices: any = annotation._dictionary.getArray('Vertices');
        expect(vertices.length).toEqual(8);
        const contents: string = annotation._dictionary.get('Contents');
        expect(contents.indexOf('Square Measure')).toBeGreaterThanOrEqual(0);
        const ds: string = annotation._dictionary.get('DS');
        expect(ds.indexOf('font:')).toBeGreaterThanOrEqual(0);
        expect(ds.indexOf('color:')).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should create contents without text prefix when text is empty', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 100
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const contents: string = annotation._dictionary.get('Contents');
        expect(contents.indexOf('sq')).toBeGreaterThanOrEqual(0);
        expect(contents.indexOf('cm')).toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    it('1041665 - Should replace existing AP and Measure references', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 120,
                    height: 120
                },
                {
                    measurementUnit: PdfMeasurementUnit.inch
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        annotation._doPostProcess(false);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        document.destroy();
    });
    it('1041665 - Should generate valid rectangle and vertices information', (): void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfSquareAnnotation =
            new PdfSquareAnnotation(
                {
                    x: 40,
                    y: 50,
                    width: 100,
                    height: 80
                },
                {
                    measurementUnit: PdfMeasurementUnit.centimeter
                }
            );
        page.annotations.add(annotation);
        annotation._doPostProcess(false);
        const rect: any = annotation._dictionary.getArray('Rect');
        expect(rect.length).toEqual(4);
        const vertices: any = annotation._dictionary.getArray('Vertices');
        expect(vertices.length).toEqual(8);
        expect(vertices[0]).toEqual(rect[0]);
        expect(vertices[2]).toEqual(rect[0]);
        expect(vertices[4]).toEqual(rect[2]);
        expect(vertices[6]).toEqual(rect[2]);
        document.destroy();
    });
});