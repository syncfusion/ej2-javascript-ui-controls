


import {
    PdfFreeTextAnnotation,
    PdfAnnotationBorder,
    PdfBorderEffect,
    PdfLineAnnotation,
    PdfCircleAnnotation,
    PdfPolygonAnnotation,
    PdfSquareAnnotation,
    PdfRectangleAnnotation,
    PdfPolyLineAnnotation,
    PdfInkAnnotation,
    PdfAttachmentAnnotation,
    PdfDocumentLinkAnnotation,
    PdfPopupAnnotation,
    PdfRedactionAnnotation,
    PdfTextMarkupAnnotation,
    PdfUriAnnotation,
    PdfListFieldItem,
    PdfWatermarkAnnotation
} from '../src/pdf/core/annotations/annotation';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import {
    PdfBorderEffectStyle,
    PdfRotationAngle,
    PdfTextAlignment,
    PdfBorderStyle,
    PdfMeasurementUnit,
    PdfLineEndingStyle,
    PdfTextMarkupAnnotationType,
    PdfCircleMeasurementType
} from '../src/pdf/core/enumerator';
import { PdfBrush, PdfGraphics, PdfPen } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfStandardFont, PdfFontFamily, PdfFontStyle } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat, PdfVerticalAlignment } from '../src/pdf/core/fonts/pdf-string-format';
import { PdfDestination, PdfPage } from '../src/pdf/core/pdf-page';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfListBoxField, PdfRadioButtonListField } from '../src/pdf/core/form/field';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';

interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IGraphicsStub {
    save: jasmine.Spy;
    restore: jasmine.Spy;
    translateTransform: jasmine.Spy;
    rotateTransform: jasmine.Spy;
    drawRectangle: jasmine.Spy;
    drawEllipse: jasmine.Spy;
    drawPath: jasmine.Spy;
    drawString: jasmine.Spy;
    setTransparency: jasmine.Spy;
}

interface IPageStub {
    graphics: IGraphicsStub;
    size: { width: number; height: number };
    rotation: PdfRotationAngle;
    annotations: { remove: jasmine.Spy };
    _pageDictionary: _PdfDictionary;
    _isNew: boolean;
}

interface IPaintParameter {
    borderWidth: number;
    bounds: IRectangle;
    borderPen: PdfPen;
    backBrush?: PdfBrush;
    foreBrush?: PdfBrush;
    insertSpaces?: boolean;
    stringFormat?: PdfStringFormat;
}

interface IFreeTextInternal {
    _dictionary: _PdfDictionary;
    _bounds: IRectangle;
    _page: IPageStub;
    _isAllRotation: boolean;
    _isLoaded: boolean;
    _font: PdfStandardFont;
    _pdfFont: PdfStandardFont;
    _rCText: string;
    _drawCloudStyle: jasmine.Spy;
    _drawFreeTextAnnotation: jasmine.Spy;
    rotationAngle: PdfRotationAngle;
    _drawAppearance(graphics: IGraphicsStub, parameter: IPaintParameter, rectangle: number[]): void;
    _drawFreeTextRectangle(
        graphics: IGraphicsStub,
        parameter: IPaintParameter,
        rectangle: number[],
        alignment: PdfTextAlignment
    ): void;
    _drawFreeMarkUpText(
        graphics: IGraphicsStub,
        parameter: IPaintParameter,
        rectangle: number[],
        text: string,
        alignment: PdfTextAlignment
    ): void;
    _parseTextAlignment(value: string | number): PdfTextAlignment;
    _getFontDetails(
        input: string[],
        fontSize: number,
        textAlignment: PdfTextAlignment,
        fontStyle: PdfFontStyle,
        brush: PdfBrush | undefined
    ): Map<string, unknown>;
}

interface IBorderEffectInternal extends PdfBorderEffect {
    _getBorderEffect(value: string): PdfBorderEffectStyle;
    _styleToEffect(value: PdfBorderEffectStyle): string;
}

function createGraphicsStub(): IGraphicsStub {
    return {
        save: jasmine.createSpy('save').and.returnValue({}),
        restore: jasmine.createSpy('restore'),
        translateTransform: jasmine.createSpy('translateTransform'),
        rotateTransform: jasmine.createSpy('rotateTransform'),
        drawRectangle: jasmine.createSpy('drawRectangle'),
        drawEllipse: jasmine.createSpy('drawEllipse'),
        drawPath: jasmine.createSpy('drawPath'),
        drawString: jasmine.createSpy('drawString'),
        setTransparency: jasmine.createSpy('setTransparency')
    };
}

function createPageStub(): IPageStub {
    return {
        graphics: createGraphicsStub(),
        size: { width: 500, height: 700 },
        rotation: PdfRotationAngle.angle0,
        annotations: {
            remove: jasmine.createSpy('remove')
        },
        _pageDictionary: new _PdfDictionary(),
        _isNew: true
    };
}

function createParameter(): IPaintParameter {
    return {
        borderWidth: 1,
        bounds: { x: 10, y: 15, width: 120, height: 40 },
        borderPen: new PdfPen({ r: 0, g: 0, b: 0 }, 1),
        backBrush: new PdfBrush({ r: 255, g: 255, b: 0 }),
        foreBrush: new PdfBrush({ r: 0, g: 0, b: 0 }),
        stringFormat: new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.middle)
    };
}

function createFreeTextInternal(): IFreeTextInternal {
    const annotation: IFreeTextInternal = Object.create(
        PdfFreeTextAnnotation.prototype
    ) as IFreeTextInternal;

    annotation._dictionary = new _PdfDictionary();
    annotation._bounds = { x: 20, y: 30, width: 140, height: 60 };
    annotation._page = createPageStub();
    annotation._isAllRotation = false;
    annotation._isLoaded = false;
    annotation._font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
    annotation._pdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
    annotation._rCText = '';
    annotation._drawCloudStyle = jasmine.createSpy('_drawCloudStyle');
    annotation._drawFreeTextAnnotation = jasmine.createSpy('_drawFreeTextAnnotation');

    // minimal safe defaults used by internal methods
    annotation._dictionary.set('Type', _PdfName.get('Annot'));
    annotation._dictionary.set('Subtype', _PdfName.get('FreeText'));
    annotation._dictionary.set('Q', 0);

    // do NOT write to annotation.rotate (getter only)
    annotation.rotationAngle = PdfRotationAngle.angle0;
    return annotation;
}

describe('PdfFreeTextAnnotation internal coverage', (): void => {

    it('should cover _parseTextAlignment branches for right, justify and default', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();

        expect(annotation._parseTextAlignment('2')).toBe(PdfTextAlignment.right);
        expect(annotation._parseTextAlignment('3')).toBe(PdfTextAlignment.justify);
        expect(annotation._parseTextAlignment('99')).toBe(PdfTextAlignment.left);
    });

    it('should cover _getFontDetails branches for font-size, font-family and xfa-spacerun', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        annotation._rCText = 'sample';
        const details: Map<string, unknown> = annotation._getFontDetails(
            [
                'font-size: 14pt',
                'font-family: "Helvetica"',
                'xfa-spacerun: yes'
            ],
            10,
            PdfTextAlignment.left,
            PdfFontStyle.regular,
            undefined
        );

        expect(details.get('font-size')).toBe(14);
        expect(details.get('font-family')).toBeTruthy();
    });

    it('should cover _drawAppearance branch when BE.I = 1 (radius 4)', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        const be: _PdfDictionary = new _PdfDictionary();
        be.set('I', 1);
        annotation._dictionary.set('BE', be);

        annotation._drawAppearance(annotation._page.graphics, parameter, [0, 0, 100, 30]);

        expect(annotation._drawCloudStyle).toHaveBeenCalled();
        const args: unknown[] = annotation._drawCloudStyle.calls.mostRecent().args as unknown[];
        expect(args[3] as number).toBe(5);
    });

    it('should cover _drawAppearance branch when BE.I != 1 (radius 9)', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        const be: _PdfDictionary = new _PdfDictionary();
        be.set('I', 2);
        annotation._dictionary.set('BE', be);

        annotation._drawAppearance(annotation._page.graphics, parameter, [0, 0, 100, 30]);

        expect(annotation._drawCloudStyle).toHaveBeenCalled();
        const args: unknown[] = annotation._drawCloudStyle.calls.mostRecent().args as unknown[];
        expect(args[3] as number).toBe(10);
    });

    it('should cover _drawFreeTextRectangle branch that delegates to _drawAppearance when BE exists', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();
        const appearanceSpy: jasmine.Spy = spyOn(annotation, '_drawAppearance').and.callFake((): void => { /** no-op */ });

        const be: _PdfDictionary = new _PdfDictionary();
        be.set('I', 1);
        annotation._dictionary.set('BE', be);

        annotation._drawFreeTextRectangle(
            annotation._page.graphics,
            parameter,
            [0, 0, 100, 40],
            PdfTextAlignment.left
        );

        expect(appearanceSpy).toHaveBeenCalled();
    });

    it('should cover _drawFreeTextRectangle rotation branch for 90 degrees when !_isAllRotation', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        annotation._isAllRotation = false;
        annotation.rotationAngle = PdfRotationAngle.angle90;

        annotation._drawFreeTextRectangle(
            annotation._page.graphics,
            parameter,
            [10, 15, 100, 40],
            PdfTextAlignment.left
        );

        expect(annotation._page.graphics.rotateTransform).toHaveBeenCalledWith(-90);
        expect(parameter.bounds.width).toBeTruthy();
        expect(parameter.bounds.height).toBeTruthy();
    });

    it('should cover _drawFreeTextRectangle rotation branch for 180 degrees when !_isAllRotation', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        annotation._isAllRotation = false;
        annotation.rotationAngle = PdfRotationAngle.angle180;

        annotation._drawFreeTextRectangle(
            annotation._page.graphics,
            parameter,
            [10, 15, 100, 40],
            PdfTextAlignment.center
        );

        expect(annotation._page.graphics.rotateTransform).toHaveBeenCalledWith(-180);
        expect(parameter.bounds.width).toBeGreaterThan(0);
        expect(parameter.bounds.height).toBeGreaterThan(0);
    });

    it('should cover _drawFreeTextRectangle rotation branch for 270 degrees when !_isAllRotation', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        annotation._isAllRotation = false;
        annotation.rotationAngle = PdfRotationAngle.angle270;

        annotation._drawFreeTextRectangle(
            annotation._page.graphics,
            parameter,
            [10, 15, 100, 40],
            PdfTextAlignment.right
        );

        expect(annotation._page.graphics.rotateTransform).toHaveBeenCalledWith(-270);
        expect(parameter.bounds.width).toBeTruthy();
        expect(parameter.bounds.height).toBeTruthy();
    });

    it('should cover _drawFreeMarkUpText path for all-rotation rendering without throwing', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        annotation._isAllRotation = true;
        annotation.rotationAngle = PdfRotationAngle.angle90;

        annotation._drawFreeMarkUpText(
            annotation._page.graphics,
            parameter,
            [5, 10, 120, 50],
            'FreeText rotation branch',
            PdfTextAlignment.left
        );

        expect(annotation._drawFreeTextAnnotation).toHaveBeenCalled();
    });

    it('should cover _drawFreeMarkUpText path for non-all-rotation 180 degrees without throwing', (): void => {
        const annotation: IFreeTextInternal = createFreeTextInternal();
        const parameter: IPaintParameter = createParameter();

        annotation._isAllRotation = false;
        annotation.rotationAngle = PdfRotationAngle.angle180;

        annotation._drawFreeMarkUpText(
            annotation._page.graphics,
            parameter,
            [5, 10, 120, 50],
            'Branch 180',
            PdfTextAlignment.justify
        );

        expect(annotation._drawFreeTextAnnotation).toHaveBeenCalled();
    });
});

describe('PdfBorderEffect internal coverage', (): void => {

    it('should cover style setter and utility branches without throwing', (): void => {
        const effect: IBorderEffectInternal = new PdfBorderEffect({
            intensity: 1,
            style: PdfBorderEffectStyle.solid
        }) as IBorderEffectInternal;

        expect(effect._getBorderEffect('/C')).toBe(PdfBorderEffectStyle.cloudy);
        expect(effect._getBorderEffect('/S')).toBe(PdfBorderEffectStyle.solid);
        expect(effect._styleToEffect(PdfBorderEffectStyle.cloudy)).toBe('C');
        expect(effect._styleToEffect(PdfBorderEffectStyle.solid)).toBe('S');

        effect.style = PdfBorderEffectStyle.cloudy;
        expect(effect.style).toBe(PdfBorderEffectStyle.cloudy);

        // set same style again -> explicit else / unchanged path safety
        effect.style = PdfBorderEffectStyle.cloudy;
        expect(effect.style).toBe(PdfBorderEffectStyle.cloudy);
    });

    it('should cover PdfAnnotationBorder update path safely', (): void => {
        const border: PdfAnnotationBorder = new PdfAnnotationBorder({
            width: 1,
            hRadius: 0,
            vRadius: 0,
            style: PdfBorderStyle.solid,
            dash: [1, 1]
        });

        expect(border.width).toBe(1);
        border.width = 2;
        border.hRadius = 1;
        border.vRadius = 1;

        expect(border.width).toBe(2);
        expect(border.hRadius).toBe(1);
        expect(border.vRadius).toBe(1);
    });
});


function createDoc(): { document: PdfDocument; page: PdfPage } {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    return { document, page };
}

function saveAndAssert(document: PdfDocument): Uint8Array {
    const bytes: Uint8Array = document.save();
    expect(bytes).toBeDefined();
    expect(bytes.length).toBeGreaterThan(0);
    return bytes;
}

function destroyDoc(document: PdfDocument): void {
    document.destroy();
}

function setCommonAnnotationValues(annotation: unknown): void {
    setValue(annotation, 'author', 'coverage');
    setValue(annotation, 'subject', 'annotation');
    setValue(annotation, 'name', 'safe-annotation');
    setValue(annotation, 'text', 'coverage-text');
    setValue(annotation, 'opacity', 0.75);
    setValue(annotation, 'color', [120, 40, 200]);
    setValue(annotation, 'innerColor', [240, 230, 120]);
    setValue(annotation, 'modifiedDate', new Date());
    setValue(annotation, 'creationDate', new Date());
    setValue(annotation, 'flattenPopups', true);
}

describe('annotation.js coverage – safe uncovered line bundle', () => {

    type UnknownRecord = Record<string, unknown>;

    function asRecord(value: unknown): UnknownRecord {
        return value as UnknownRecord;
    }
    function setValue(target: unknown, key: string, value: unknown): void {
        if (!target || key === 'rotate') {
            return;
        }
        asRecord(target)[key] = value;
    }
    function tryCall(target: unknown, key: string, ...args: unknown[]): unknown {
        if (!target) {
            return undefined;
        }
        const fn: unknown = asRecord(target)[key];
        if (typeof fn === 'function') {
            const method: (...input: unknown[]) => unknown = fn as (...input: unknown[]) => unknown;
            return method.apply(target, args);
        }
        return undefined;
    }
    it('covers PdfLineAnnotation constructor, setter, explicit else and post-process branches', () => {
        const { document, page } = createDoc();

        const line: PdfLineAnnotation = new PdfLineAnnotation({ x: 30, y: 30 }, { x: 220, y: 120 });
        setCommonAnnotationValues(line);

        setValue(line, 'linePoints', [{ x: 30, y: 30 }, { x: 220, y: 120 }]);
        setValue(line, 'linePoints', [{ x: 30, y: 30 }, { x: 220, y: 120 }]);
        setValue(line, 'linePoints', undefined);
        setValue(line, 'linePoints', [{ x: 30, y: 30 }, { x: 220, y: 120 }]);

        setValue(line, 'leaderLine', 18);
        setValue(line, 'leaderExt', 10);
        setValue(line, 'caption', true);
        setValue(line, 'text', 'Line annotation branch coverage');
        setValue(line, 'border', { width: 1 });
        setValue(line, 'beginLineStyle', PdfLineEndingStyle.square);
        setValue(line, 'endLineStyle', PdfLineEndingStyle.diamond);

        page.annotations.add(line);

        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        tryCall(line, '_getBoundsFromLineEndStyle', { x: 30, y: 30 }, 8, PdfLineEndingStyle.diamond);
        tryCall(line, '_drawLineEndStyle', { x: 30, y: 30 }, page.graphics, 0, pen, undefined, PdfLineEndingStyle.square, 6, true);
        tryCall(line, '_drawLineEndStyle', { x: 220, y: 120 }, page.graphics, 45, pen, undefined, PdfLineEndingStyle.circle, 6, false);
        tryCall(line, '_drawLineEndStyle', { x: 220, y: 120 }, page.graphics, 45, pen, undefined, PdfLineEndingStyle.diamond, 6, false);
        tryCall(line, '_drawLineEndStyle', { x: 220, y: 120 }, page.graphics, 45, pen, undefined, PdfLineEndingStyle.butt, 6, false);

        tryCall(line, '_postProcess', page);
        tryCall(line, '_calculateLineBounds', [30, 30, 220, 120]);

        saveAndAssert(document);
        destroyDoc(document);
    });

    it('covers circle, square, rectangle, polygon, polyline and ink appearance branches', () => {
        const { document, page } = createDoc();

        const circle: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 20, y: 20, width: 70, height: 70 });
        const square: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 110, y: 20, width: 70, height: 70 });
        const rectangle: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 200, y: 20, width: 90, height: 60 });
        const polygon: PdfPolygonAnnotation = new PdfPolygonAnnotation(
            [
                { x: 40, y: 160 },
                { x: 80, y: 120 },
                { x: 120, y: 160 },
                { x: 70, y: 200 }
            ]
        );
        const polyline: PdfPolyLineAnnotation = new PdfPolyLineAnnotation(
            [
                { x: 160, y: 160 },
                { x: 200, y: 130 },
                { x: 240, y: 180 },
                { x: 280, y: 150 }
            ]
        );
        const ink: PdfInkAnnotation = new PdfInkAnnotation
            (
                { x: 0, y: 0, width: 300, height: 400 },
                [
                    { x: 40, y: 260 },
                    { x: 60, y: 280 },
                    { x: 80, y: 250 }
                ]
            );
        setCommonAnnotationValues(circle);
        setCommonAnnotationValues(square);
        setCommonAnnotationValues(rectangle);
        setCommonAnnotationValues(polygon);
        setCommonAnnotationValues(polyline);
        setCommonAnnotationValues(ink);

        setValue(circle, 'border', { width: 1 });
        setValue(square, 'border', { width: 1 });
        setValue(rectangle, 'border', { width: 1 });
        setValue(polygon, 'border', { width: 1 });
        setValue(polyline, 'border', { width: 1 });
        setValue(ink, 'border', { width: 1 });

        setValue(circle, 'text', 'shape');
        setValue(square, 'text', 'shape');
        setValue(rectangle, 'text', 'shape');
        setValue(polygon, 'text', 'shape');
        setValue(polyline, 'text', 'shape');
        setValue(ink, 'text', 'shape');

        setValue(circle, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });
        setValue(square, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });
        setValue(rectangle, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });
        setValue(polygon, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });
        setValue(polyline, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });
        setValue(ink, 'borderEffect', { style: PdfBorderEffectStyle.cloudy, intensity: 2 });

        page.annotations.add(circle);
        page.annotations.add(square);
        page.annotations.add(rectangle);
        page.annotations.add(polygon);
        page.annotations.add(polyline);
        page.annotations.add(ink);

        setValue(circle, 'innerColor', [255, 240, 120]);
        setValue(square, 'innerColor', [180, 220, 255]);
        setValue(rectangle, 'innerColor', [220, 255, 180]);
        setValue(polyline, 'beginLineStyle', PdfLineEndingStyle.openArrow);
        setValue(polyline, 'endLineStyle', PdfLineEndingStyle.closedArrow);

        tryCall(circle, '_postProcess', page);
        tryCall(square, '_postProcess', page);
        tryCall(rectangle, '_postProcess', page);
        tryCall(polyline, '_postProcess', page);
        tryCall(ink, '_postProcess', page);

        saveAndAssert(document);
        destroyDoc(document);
    });

    it('covers free text, text markup and redaction appearance branches safely', () => {
        const { document, page } = createDoc();

        const freeText: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 20, y: 20, width: 180, height: 60 });
        const markUp: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Text markup', { x: 20, y: 110, width: 220, height: 130 });
        //
        const redaction: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 20, y: 160, width: 180, height: 50 });//

        setCommonAnnotationValues(freeText);
        setCommonAnnotationValues(markUp);
        setCommonAnnotationValues(redaction);

        setValue(freeText, 'font', new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.bold));
        setValue(freeText, 'calloutLines', [200, 40, 220, 70, 190, 90]);
        setValue(freeText, 'border', { width: 1 });
        setValue(freeText, 'text', 'FreeText branch');
        setValue(freeText, 'open', false);

        setValue(markUp, 'textMarkUpColor', [255, 255, 0]);
        setValue(markUp, 'textMarkupType', PdfTextMarkupAnnotationType.highlight);

        setValue(redaction, 'overlayText', 'REDACTED');
        setValue(redaction, 'appearanceFillColor', [0, 0, 0]);
        setValue(redaction, 'font', new PdfStandardFont(PdfFontFamily.helvetica, 9, PdfFontStyle.regular));
        setValue(redaction, 'border', { width: 1 });

        page.annotations.add(freeText);
        page.annotations.add(markUp);
        page.annotations.add(redaction);

        tryCall(freeText, '_postProcess', page);
        tryCall(redaction, '_postProcess', page);

        saveAndAssert(document);
        destroyDoc(document);
    });


});
type UnknownRecord = Record<string, unknown>;

function setValue(target: unknown, key: string, value: unknown): void {
    if (!target || key === 'rotate') {
        return;
    }
    (target as UnknownRecord)[key] = value;
}

function tryCall(target: unknown, key: string, ...args: unknown[]): unknown {
    if (!target) {
        return undefined;
    }
    const fn: unknown = (target as UnknownRecord)[key];
    if (typeof fn === 'function') {
        const method: (...a: unknown[]) => unknown = fn as (...a: unknown[]) => unknown;
        return method.apply(target, args);
    }
    return undefined;
}
describe('PdfAnnotation – uncovered branches coverage', () => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    it('covers _getRectangleBoundsValue fallback return [0,0,0,0]', () => {
        const document = new PdfDocument();
        const page = document.addPage();

        // Popup annotation with NO popup dictionary after load
        const popup = new PdfPopupAnnotation('popup',
            { x: 10, y: 10, width: 30, height: 30 }

        );
        page.annotations.add(popup);

        const bytes = document.save();
        document.destroy();

        // Reload → get loaded annotation
        const loaded = new PdfDocument(bytes);
        const loadedPage: PdfPage = loaded.getPage(0);
        const loadedPopup = loadedPage.annotations.at(0) as unknown;

        // Kill Popup entry internally

        const dictionary = (loadedPopup as UnknownRecord)['_dictionary'] as UnknownRecord;
        if (dictionary && typeof dictionary === 'object') {
            delete dictionary['Popup'];
        }


        const rect = tryCall(loadedPopup, '_getRectangleBoundsValue') as number[];
        expect(rect).toEqual([0, 0, 0, 0]);

        loaded.destroy();
    });

    it('covers _drawAuthor transparent color branch', () => {
        const document = new PdfDocument();
        const page = document.addPage();

        const square = new PdfSquareAnnotation(
            { x: 20, y: 20, width: 80, height: 60 }
        );

        // Required author/subject
        setValue(square, 'author', 'Author');
        setValue(square, 'subject', 'Subject');

        // Transparent color → forces _isTransparentColor === true
        setValue(square, 'color', { r: 0, g: 0, b: 0 });
        setValue(square, 'opacity', 0);

        page.annotations.add(square);

        // Triggers _drawAuthor internally
        tryCall(square, '_postProcess', page);

        const bytes = document.save();
        expect(bytes.length).toBeGreaterThan(0);

        document.destroy();
    });


});

function asRecord(value: unknown): UnknownRecord {
    return value as UnknownRecord;
}


function getValue<T>(target: unknown, key: string): T | undefined {
    if (!target) { return undefined; }
    return asRecord(target)[key] as T | undefined;
}

/**
 * Safe dictionary update for internal _PdfDictionary-like objects.
 * - Uses .update when present
 * - Falls back to Reflect.set for plain objects
 */

function safeDictUpdate(dict: unknown, key: string, value: unknown): void {
    if (!dict) {
        return;
    }
    const rec: UnknownRecord = asRecord(dict);
    const upd: unknown = rec['update'];
    if (typeof upd === 'function') {
        const updateMethod: (...a: unknown[]) => unknown = upd as (...a: unknown[]) => unknown;
        updateMethod.apply(dict, [key, value]);
        return;
    }
    rec[key] = value;
}


/**
 * Only set rotate when the prototype has a setter (PdfWidgetAnnotation does),
 * to avoid: "Cannot set property rotate of <PdfAnnotation> which has only a getter".
 */

function setRotateIfWritable(target: unknown, value: number): void {
    if (!target) {
        return;
    }
    const proto: object | null = Object.getPrototypeOf(target as object);
    if (!proto) {
        return;
    }
    const desc: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(proto, 'rotate');
    if (desc && typeof desc.set === 'function') {
        asRecord(target)['rotate'] = value;
    }
}


/**
 * Minimal save assert (no write() usage).
 */
function saveBytesAndDestroy(document: PdfDocument): Uint8Array {
    const bytes: Uint8Array = document.save();
    expect(bytes).toBeDefined();
    expect(bytes.length).toBeGreaterThan(0);
    document.destroy();
    return bytes;
}

describe('annotation – cover highlighted uncovered branches (AAA)', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;


    function tryCall(target: unknown, name: string, ...args: unknown[]): unknown {
        if (!target) {
            return undefined;
        }
        const fn: unknown = asRecord(target)[name];
        if (typeof fn === 'function') {
            const method: (...a: unknown[]) => unknown = fn as (...a: unknown[]) => unknown;
            return method.apply(target, args);
        }
        return undefined;
    }

    it('Arrange/Act/Assert: covers popup rect fallback + author transparent + createTemplate fallback', () => {
        // ARRANGE
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();

        // 1) Popup annotation -> later we force missing Popup/Rect to hit:
        // PdfAnnotation.prototype._getRectangleBoundsValue -> return [0,0,0,0]
        const popup: PdfPopupAnnotation = new PdfPopupAnnotation(
            'popup',
            { x: 20, y: 20, width: 30, height: 30 }

        );
        page.annotations.add(popup);

        // 2) Author drawing with transparent color branch (highlighted)
        const sq: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 60, y: 20, width: 80, height: 60 });

        setValue(sq, 'author', 'Author');
        setValue(sq, 'subject', 'Subject');
        setValue(sq, 'opacity', 0);
        setValue(sq, 'color', { r: 0, g: 0, b: 0 });

        page.annotations.add(sq);

        // 3) createTemplate fallback size branch (highlighted in your screenshot)
        // remove AP/Vertices to force: template._size = { width: this.bounds.width, height: this.bounds.height }
        const sqDict: unknown = getValue<unknown>(sq, '_dictionary');
        safeDictUpdate(sqDict, 'AP', undefined);
        safeDictUpdate(sqDict, 'Vertices', undefined);

        // ACT
        // trigger author drawing / post-process
        tryCall(sq, '_postProcess', page);
        // explicitly invoke createTemplate key = 'N'
        tryCall(sq, '_createTemplate', 'N');

        // Save and reload to obtain a loaded annotation instance for _getRectangleBoundsValue
        const bytes: Uint8Array = saveBytesAndDestroy(doc);
        const loaded: PdfDocument = new PdfDocument(bytes);
        const lpage: PdfPage = loaded.getPage(0);

        // Force popup dictionary missing Rect to take the else branch
        const loadedAnnot: unknown = lpage.annotations.at(0);
        const ldict: unknown = getValue<unknown>(loadedAnnot, '_dictionary');

        // If the library stores Popup as a nested dict, ensure it is absent OR has no Rect:
        // Either case should reach fallback return [0,0,0,0]
        if (ldict) {
            // remove Popup entry if possible
            safeDictUpdate(ldict, 'Popup', undefined);
        }

        // ACT + ASSERT
        const rect: unknown = tryCall(loadedAnnot, '_getRectangleBoundsValue');
        expect(rect).toEqual([0, 0, 0, 0]);

        loaded.destroy();
    });

    it('Arrange/Act/Assert: covers PdfRedactionAnnotation overlayText rotation switch + rotatedRect swap (90/270)', () => {
        // ARRANGE
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();

        const redaction: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 20, y: 160, width: 180, height: 50 });
        // Ensure overlayText block runs
        setValue(redaction, 'overlayText', 'REDACTED');
        page.annotations.add(redaction);

        // Provide bounds collection to cover index / else branches inside _createNormalAppearance snippet
        // boundsCollection exists on redaction in EJ2 builds; set if present
        const boundsCollection: Array<{ x: number; y: number; width: number; height: number }> = [
            { x: 20, y: 160, width: 180, height: 50 },
            { x: 30, y: 220, width: 160, height: 40 }
        ];

        if (typeof getValue<unknown>(redaction, 'boundsCollection') !== 'undefined') {
            setValue(redaction, 'boundsCollection', boundsCollection);
        }


        // ACT:
        // 1) rotatedBounds branch (if (rotatedBounds) { ... })
        const rotatedBounds = { x: 10, y: 10, width: 50, height: 30 };
        tryCall(redaction, '_createNormalAppearance', 0, rotatedBounds, PdfRotationAngle.angle90);

        // 2) index in-range branch (else if index>=0 && index < boundsCollection.length)
        tryCall(redaction, '_createNormalAppearance', 0, undefined, PdfRotationAngle.angle270);

        // 3) else branch (iterate boundsCollection)
        // use invalid index to force fallback loop
        tryCall(redaction, '_createNormalAppearance', -1, undefined, PdfRotationAngle.angle180);

        // Also cover rotation switch cases for overlayText: 0 / 90 / 180 / 270
        // (this drives: rotateTransform + translateTransform branches)
        const rotations: PdfRotationAngle[] = [
            PdfRotationAngle.angle0,
            PdfRotationAngle.angle90,
            PdfRotationAngle.angle180,
            PdfRotationAngle.angle270
        ];
        for (const rot of rotations) {
            tryCall(redaction, '_createNormalAppearance', 0, rotatedBounds, rot);
        }

        // ASSERT (no throw + save ok)
        const bytes: Uint8Array = doc.save();
        expect(bytes.length).toBeGreaterThan(0);
        doc.destroy();
    });

    it('Arrange/Act/Assert: covers PdfWidgetAnnotation rotate getter/setter + font cache path safely (no PdfForm.fields/items)', () => {
        // ARRANGE
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const form = doc.form;

        // Create radio field + two items (items are widget annotations underneath)
        const radio: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'radioField');
        const itemA = radio.add('A', { x: 20, y: 20, width: 15, height: 15 });
        const itemB = radio.add('B', { x: 20, y: 45, width: 15, height: 15 });
        itemA.checked = true;
        itemB.checked = false;

        // Create list box field using correct API in your source:
        // - addItem(new PdfListFieldItem(...))
        const list: PdfListBoxField = new PdfListBoxField(page, 'listField', { x: 80, y: 20, width: 100, height: 60 });
        list.addItem(new PdfListFieldItem('One', 'One'));
        list.addItem(new PdfListFieldItem('Two', 'Two'));
        list.addItem(new PdfListFieldItem('Three', 'Three'));
        list.selectedIndex = 1;

        // Correct public API: form.add(field)
        form.add(radio);
        form.add(list);

        // ACT:
        // ---- rotate getter branch (mkDictionary has 'R') + (dictionary has 'R')
        // We avoid setting rotate on PdfAnnotation; we only set rotate on widget items *if setter exists*.
        setRotateIfWritable(itemA as unknown, 90);   // hits setter path that creates/updates MK 'R'
        setRotateIfWritable(itemB as unknown, 180);  // second value to cover _rotationAngle != value branch


        void getValue<unknown>(itemA, 'rotate');
        void getValue<unknown>(itemB, 'rotate');


        // ---- font getter caching branch (highlighted)
        // Trigger font resolution twice so cache hit branch can execute (if the build uses form._fontCache).
        // Access "font" only if property exists to avoid undefined errors.
        const proto = Object.getPrototypeOf(itemA as object);

        if (proto && Object.getOwnPropertyDescriptor(proto, 'font')) {
            void getValue<unknown>(itemA, 'font');
            void getValue<unknown>(itemA, 'font');
        }

        // ASSERT: save ok
        const bytes: Uint8Array = doc.save();
        expect(bytes.length).toBeGreaterThan(0);
        doc.destroy();
    });
});

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface SizeShape {
    width: number;
    height: number;
}

interface _PageInternals {
    _isNew: boolean;
    _pageDictionary: {
        has: (key: string) => boolean;
    };
    _pageSettings: {
        size: SizeShape;
    };
    _getActualBounds: (settings: unknown) => number[];
    _crossReference: unknown & any;
}

interface _TextMarkupAnnotationInternals {
    _page: PdfPage;
    _crossReference: unknown;
    _bounds: Rectangle;
    _quadPoints: number[] | null;
    _isLoaded: boolean;
    _setAppearance: boolean;
    _dictionary: _PdfDictionary;
    _isChanged: boolean;
    _boundsCollection: Rectangle[];
    _getCropOrMediaBox: () => number[];
    _getMediaOrCropBox: (page: PdfPage) => number[];
    _obtainNativeRectangle: () => number[];
    _postProcess: () => void;
    _createMarkupAppearance: () => unknown;
}

function _asPageInternals(page: PdfPage): PdfPage & _PageInternalsForWatermark {
    return page as unknown as PdfPage & _PageInternalsForWatermark;
}

function _asAnnotationInternals(annotation: PdfTextMarkupAnnotation): PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals {
    return annotation as unknown as PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals;
}

function _createDocumentAndPage(): { document: PdfDocument; page: PdfPage } {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage() as PdfPage;

    const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);
    if (!pageInternals._pageSettings) {
        (pageInternals as any)._pageSettings = {
            size: {
                width: page.size.width,
                height: page.size.height
            }
        };
    }
    if (typeof pageInternals._getActualBounds !== 'function') {
        pageInternals._getActualBounds = (): number[] => [0, 0, 0, 0];
    }
    pageInternals._isNew = false;

    return { document, page };
}

function _quadPointsForRect(pageHeight: number, rect: Rectangle): number[] {
    const top: number = pageHeight - rect.y;
    return [
        rect.x, top,
        rect.x + rect.width, top,
        rect.x, top - rect.height,
        rect.x + rect.width, top - rect.height
    ];
}

function _createLoadedSingleAnnotation(page: PdfPage, type: PdfTextMarkupAnnotationType, rect: Rectangle): PdfTextMarkupAnnotation {
    const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('loaded-markup', rect);
    const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);
    const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

    internal._page = page;
    (internal as any)._crossReference = pageInternals._crossReference as _CrossReferenceLike;
    internal._isLoaded = true;
    internal._setAppearance = false;
    internal._bounds = rect;
    internal._isChanged = true;

    const quadPoints: number[] = _quadPointsForRect(page.size.height, rect);
    internal._quadPoints = quadPoints;
    internal._dictionary.update('QuadPoints', quadPoints);

    annotation.textMarkupType = type;
    annotation.textMarkUpColor = { r: 255, g: 255, b: 0 };
    annotation.opacity = 0.5;

    spyOn(internal, '_getMediaOrCropBox').and.returnValue([0, 0, 0, 0]);

    return annotation;
}

function _createMultiBoundsAnnotation(page: PdfPage, type: PdfTextMarkupAnnotationType): PdfTextMarkupAnnotation {
    const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('multi-markup', {
        x: 0, y: 0, width: 0, height: 0
    });
    const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);
    const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

    internal._page = page;
    internal._crossReference = pageInternals._crossReference;
    internal._isLoaded = false;
    internal._setAppearance = false;
    internal._isChanged = true;

    spyOn(internal, '_getCropOrMediaBox').and.returnValue([0, 0, 0, 0]);

    annotation.textMarkupType = type;
    annotation.textMarkUpColor = { r: 255, g: 0, b: 0 };

    annotation.boundsCollection = [
        { x: 50, y: 100, width: 90, height: 12 },
        { x: 50, y: 116, width: 65, height: 12 }
    ];

    return annotation;
}

describe('PdfTextMarkupAnnotation coverage - highlighted branches', () => {
    let drawRectangleSpy: jasmine.Spy;
    let drawLineSpy: jasmine.Spy;
    let drawPathSpy: jasmine.Spy;
    let saveSpy: jasmine.Spy;
    let translateTransformSpy: jasmine.Spy;
    let setClipSpy: jasmine.Spy;
    let restoreSpy: jasmine.Spy;
    let setTransparencySpy: jasmine.Spy;

    beforeEach(() => {
        drawRectangleSpy = spyOn(PdfGraphics.prototype, 'drawRectangle').and.callFake((): void => undefined);
        drawLineSpy = spyOn(PdfGraphics.prototype, 'drawLine').and.callFake((): void => undefined);
        drawPathSpy = spyOn(PdfGraphics.prototype, 'drawPath').and.callFake((): void => undefined);
        saveSpy = spyOn(PdfGraphics.prototype, 'save').and.callFake((): void => undefined);
        translateTransformSpy = spyOn(PdfGraphics.prototype, 'translateTransform').and.callFake((): void => undefined);
        setClipSpy = spyOn(PdfGraphics.prototype, 'setClip').and.callFake((): void => undefined);
        restoreSpy = spyOn(PdfGraphics.prototype, 'restore').and.callFake((): void => undefined);
        setTransparencySpy = spyOn(PdfGraphics.prototype, 'setTransparency').and.callFake((): void => undefined);
    });

    describe('_obtainNativeRectangle()', () => {
        it('should swap crop values when cropOrMediaBox[3] is negative and then apply crop offsets', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('swap-negative-crop', { x: 50, y: 100, width: 100, height: 50 });
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);
            const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

            internal._page = page;
            internal._bounds = { x: 10, y: 20, width: 30, height: 40 };
            pageInternals._isNew = false;

            spyOn(internal, '_getCropOrMediaBox').and.returnValue([5, 15, 25, -35]);
            spyOn(pageInternals._pageDictionary, 'has').and.callFake((key: string): boolean => key === 'CropBox');

            const result: number[] = internal._obtainNativeRectangle();

            expect(result[0]).toBe(15);
            expect(result[1]).toBe(697);
            expect(result[2]).toBe(30);
            expect(result[3]).toBe(40);

            document.destroy();
        });

        it('should use cropOrMediaBox[3] when MediaBox exists without CropBox and cropOrMediaBox[3] is zero', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('mediabox-only', { x: 50, y: 100, width: 100, height: 50 });
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);
            const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

            internal._page = page;
            internal._bounds = { x: 10, y: 20, width: 30, height: 40 };
            pageInternals._isNew = false;

            spyOn(internal, '_getCropOrMediaBox').and.returnValue([7, 18, 100, 0]);
            spyOn(pageInternals._pageDictionary, 'has').and.callFake((key: string): boolean => {
                if (key === 'MediaBox') {
                    return true;
                }
                if (key === 'CropBox') {
                    return false;
                }
                return false;
            });

            const result: number[] = internal._obtainNativeRectangle();

            expect(result[0]).toBe(17);
            expect(result[1]).toBe(732);
            expect(result[2]).toBe(30);
            expect(result[3]).toBe(40);

            document.destroy();
        });
    });

    describe('_postProcess()', () => {
        it('should throw when bounds is undefined', () => {
            const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation();
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            internal._bounds = undefined as unknown as Rectangle;

            expect((): void => {
                internal._postProcess();
            }).toThrowError('Bounds cannot be null or undefined');
        });
    });

    describe('_createMarkupAppearance() - loaded single QuadPoints path', () => {
        const rect: Rectangle = { x: 40, y: 100, width: 80, height: 12 };

        it('should cover loaded single highlight path, opacity, textMarkUpColor and Rect update', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createLoadedSingleAnnotation(page, PdfTextMarkupAnnotationType.highlight, rect);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);
            const updateSpy: jasmine.Spy = spyOn(internal._dictionary, 'update').and.callThrough();

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(setTransparencySpy.calls.count()).toBe(1);
            expect(drawRectangleSpy.calls.count()).toBeGreaterThan(0);
            expect(updateSpy).toHaveBeenCalledWith('Rect', jasmine.any(Array) as unknown as never);

            document.destroy();
        });

        it('should cover loaded single underline path', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createLoadedSingleAnnotation(page, PdfTextMarkupAnnotationType.underline, rect);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawLineSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });

        it('should cover loaded single strikeOut path', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createLoadedSingleAnnotation(page, PdfTextMarkupAnnotationType.strikeOut, rect);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawLineSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });

        it('should cover loaded single squiggly path', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createLoadedSingleAnnotation(page, PdfTextMarkupAnnotationType.squiggly, rect);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawPathSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });
    });

    describe('_createMarkupAppearance() - multi boundsCollection path', () => {
        it('should cover multi-bounds highlight drawing branch', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createMultiBoundsAnnotation(page, PdfTextMarkupAnnotationType.highlight);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawRectangleSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });

        it('should cover multi-bounds underline drawing branch', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createMultiBoundsAnnotation(page, PdfTextMarkupAnnotationType.underline);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawLineSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });

        it('should cover multi-bounds strikeOut drawing branch', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createMultiBoundsAnnotation(page, PdfTextMarkupAnnotationType.strikeOut);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(drawLineSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });

        it('should cover multi-bounds squiggly drawing branch with save/translate/clip/drawPath/restore', () => {
            const { document, page } = _createDocumentAndPage();
            const annotation: PdfTextMarkupAnnotation = _createMultiBoundsAnnotation(page, PdfTextMarkupAnnotationType.squiggly);
            const internal: PdfTextMarkupAnnotation & _TextMarkupAnnotationInternals = _asAnnotationInternals(annotation);

            const template: unknown = internal._createMarkupAppearance();

            expect(template).toBeDefined();
            expect(saveSpy.calls.count()).toBeGreaterThan(0);
            expect(translateTransformSpy.calls.count()).toBeGreaterThan(0);
            expect(setClipSpy.calls.count()).toBeGreaterThan(0);
            expect(drawPathSpy.calls.count()).toBeGreaterThan(0);
            expect(restoreSpy.calls.count()).toBeGreaterThan(0);

            document.destroy();
        });
    });
});


interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface _CrossReferenceLike {
    _getNextReference: () => unknown;
    _cacheMap: Map<unknown, unknown>;
}

interface _PageInternalsForWatermark {
    _crossReference: _CrossReferenceLike;
    _isNew: boolean;
    rotation: PdfRotationAngle;
    _pageSettings: {
        margins?: {
            left: number;
            top: number;
            right: number;
            bottom: number;
        };
    };
}

interface _TemplateInternals {
    _content: {
        dictionary: _PdfDictionary;
        reference?: unknown;
    };
}

interface _WatermarkInternals {
    _page: PdfPage;
    _crossReference: _CrossReferenceLike;
    _dictionary: _PdfDictionary;
    _appearanceTemplate: PdfTemplate;
    _isLoaded: boolean;
    _postProcess: () => void;
    _createWatermarkAppearance: () => PdfTemplate;
    _validateTemplateMatrix: (dictionary: _PdfDictionary) => boolean;
    _flattenAnnotationTemplate: (template: PdfTemplate, isNormalMatrix: boolean) => void;
}

interface _FreeTextInternals {
    _page: PdfPage;
    _crossReference: _CrossReferenceLike;
    _dictionary: _PdfDictionary;
    _appearanceTemplate: PdfTemplate;
    _isLoaded: boolean;
    _setAppearance: boolean;
    _customTemplate: Map<string, PdfTemplate>;
    _isContentUpdated: boolean;
    _textMarkUpColor: { r: number; g: number; b: number };
    _postProcess: (isFlatten: boolean) => void;
    _createAppearance: () => PdfTemplate;
    _validateTemplateMatrix: (dictionary: _PdfDictionary) => boolean;
    _isValidTemplateMatrix: (dictionary: _PdfDictionary, bounds: Rectangle, appearanceTemplate: PdfTemplate) => boolean;
    _flattenAnnotationTemplate: (template: PdfTemplate, isNormalMatrix: boolean) => void;
    _updateStyle: (font: unknown, color: { r: number; g: number; b: number }, alignment: PdfTextAlignment) => void;
}

interface _AnnotationInternals {
    _page: PdfPage;
    _crossReference: {
        _getNextReference: () => unknown;
        _cacheMap: Map<unknown, unknown>;
    };
    _dictionary: _PdfDictionary;
    _isLoaded: boolean;
    _bounds: Rectangle;
    _createTemplate: (key?: string) => PdfTemplate;
    _postProcess: (isFlatten?: boolean) => void;
}

interface _CircleInternals extends _AnnotationInternals {
    _measure: boolean;
    _measureType: PdfCircleMeasurementType;
}



function _asWatermarkInternals(annotation: PdfWatermarkAnnotation): any {
    return annotation as any;
}

function _asFreeTextInternals(annotation: PdfFreeTextAnnotation): any {
    return annotation as any;
}

function _asTemplateInternals(template: PdfTemplate): any {
    return template as any;
}



function _createTemplate(page: PdfPage, width: number = 80, height: number = 30): PdfTemplate {
    const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);
    const template: PdfTemplate = new PdfTemplate([0, 0, width, height], pageInternals._crossReference as never);
    const templateInternals: PdfTemplate & _TemplateInternals = _asTemplateInternals(template);

    templateInternals._content.dictionary.update('BBox', [0, 0, width, height]);
    return template;
}

function _createReferencedApDictionary(page: PdfPage, template: PdfTemplate): _PdfDictionary {
    const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);
    const templateInternals: PdfTemplate & _TemplateInternals = _asTemplateInternals(template);
    const crossReference: _CrossReferenceLike = pageInternals._crossReference as _CrossReferenceLike;
    const apDictionary: _PdfDictionary = new _PdfDictionary(crossReference as never);
    const reference: unknown = crossReference._getNextReference();

    crossReference._cacheMap.set(reference, templateInternals._content as unknown);
    templateInternals._content.reference = reference;
    apDictionary.set('N', reference as never);

    return apDictionary;
}

describe('PdfWatermarkAnnotation _doPostProcess() coverage', () => {
    interface _WatermarkInternals {
        _page: PdfPage;
        _crossReference: _PdfCrossReference;
        _dictionary: _PdfDictionary;
        _appearanceTemplate: PdfTemplate;
        _isLoaded: boolean;
        _postProcess: () => void;
        _validateTemplateMatrix: (dictionary: _PdfDictionary) => boolean;
        _flattenAnnotationTemplate: (template: PdfTemplate, isNormalMatrix: boolean) => void;
    }

    interface _WatermarkAppearanceCreator {
        _createWatermarkAppearance: () => PdfTemplate;
    }

    function _asWatermarkInternals(annotation: PdfWatermarkAnnotation): _WatermarkInternals {
        return annotation as unknown as _WatermarkInternals;
    }

    function _createDocumentAndPage(): { document: PdfDocument; page: PdfPage } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage() as PdfPage;
        const pageInternals: PdfPage & _PageInternalsForWatermark = _asPageInternals(page) as PdfPage & _PageInternalsForWatermark;

        pageInternals._isNew = false;
        pageInternals.rotation = PdfRotationAngle.angle0;

        if (!pageInternals._pageSettings) {
            (pageInternals as any)._pageSettings = {};
        }

        return { document, page };
    }

    function _asPageInternals(page: PdfPage): PdfPage & _PageInternals {
        return page as unknown as PdfPage & _PageInternals;
    }

    it('should cover loaded + flatten + AP/N/reference path and update Matrix from BBox', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Watermark', {
            x: 10,
            y: 10,
            width: 100,
            height: 30
        });
        const internal: _WatermarkInternals = _asWatermarkInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 60, 20);
        const templateInternals: PdfTemplate & _TemplateInternals = _asTemplateInternals(template);
        const apDictionary: _PdfDictionary = _createReferencedApDictionary(page, template);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = true;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._dictionary.set('AP', apDictionary);

        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBeDefined();
        expect(templateInternals._content.dictionary.has('Matrix')).toBeTruthy();
        expect(flattenSpy).toHaveBeenCalled();
        document.destroy();
    });

    it('should cover non-loaded + flatten + no AP path and create watermark appearance', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Watermark', {
            x: 20,
            y: 20,
            width: 100,
            height: 40
        });
        const internal: _WatermarkInternals = _asWatermarkInternals(annotation);
        const creator: _WatermarkAppearanceCreator = annotation as unknown as _WatermarkAppearanceCreator;
        const template: PdfTemplate = _createTemplate(page, 70, 25);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = false;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;

        spyOn(internal, '_postProcess').and.callFake((): void => undefined);
        spyOn(creator, '_createWatermarkAppearance').and.returnValue(template);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBe(template);
        expect(flattenSpy).toHaveBeenCalledWith(template, true);
        document.destroy();
    });

    it('should cover non-loaded + flatten + AP/N/reference path', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Watermark', {
            x: 15,
            y: 15,
            width: 120,
            height: 45
        });
        const internal: _WatermarkInternals = _asWatermarkInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 75, 35);
        const apDictionary: _PdfDictionary = _createReferencedApDictionary(page, template);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = false;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._dictionary.set('AP', apDictionary);

        spyOn(internal, '_postProcess').and.callFake((): void => undefined);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBeDefined();
        expect(flattenSpy).toHaveBeenCalled();
        document.destroy();
    });

    it('should cover flatten remove branch when no appearance template is available', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Watermark', {
            x: 5,
            y: 5,
            width: 80,
            height: 20
        });
        const internal: _WatermarkInternals = _asWatermarkInternals(annotation);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = true;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;

        const removeSpy: jasmine.Spy = spyOn(page.annotations, 'remove').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(removeSpy).toHaveBeenCalledWith(annotation);
        document.destroy();
    });
});
``

describe('PdfFreeTextAnnotation _doPostProcess() coverage', () => {
    it('should cover loaded + flatten + AP/N/reference path and flatten through _isValidTemplateMatrix()', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({
            x: 30,
            y: 30,
            width: 140,
            height: 50
        });
        const internal: PdfFreeTextAnnotation & _FreeTextInternals = _asFreeTextInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 90, 30);
        const apDictionary: _PdfDictionary = _createReferencedApDictionary(page, template);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = true;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._setAppearance = false;
        internal._customTemplate = new Map<string, PdfTemplate>();
        internal._dictionary.set('AP', apDictionary);

        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        spyOn(internal, '_isValidTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBeDefined();
        expect(flattenSpy).toHaveBeenCalled();
        document.destroy();
    });

    it('should cover non-loaded + flatten + no AP path, create appearance, update Matrix from BBox, and flatten when page rotation is not angle0', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({
            x: 40,
            y: 40,
            width: 160,
            height: 60
        });
        const internal: PdfFreeTextAnnotation & _FreeTextInternals = _asFreeTextInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 100, 40);
        const templateInternals: PdfTemplate & _TemplateInternals = _asTemplateInternals(template);
        const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

        pageInternals.rotation = PdfRotationAngle.angle90;

        internal._page = page;
        internal._crossReference = pageInternals._crossReference;
        internal._isLoaded = false;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._setAppearance = false;
        internal._customTemplate = new Map<string, PdfTemplate>();

        spyOn(internal, '_postProcess').and.callFake((_isFlatten: boolean): void => undefined);
        spyOn(internal, '_createAppearance').and.returnValue(template);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBe(template);
        expect(templateInternals._content.dictionary.has('Matrix')).toBeTruthy();
        expect(flattenSpy).toHaveBeenCalledWith(template, true);
        document.destroy();
    });

    it('should cover non-loaded + flatten + no AP path and flatten through !dictionary.has(AP) branch', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({
            x: 50,
            y: 50,
            width: 120,
            height: 45
        });
        const internal: PdfFreeTextAnnotation & _FreeTextInternals = _asFreeTextInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 85, 28);
        const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

        pageInternals.rotation = PdfRotationAngle.angle0;

        internal._page = page;
        internal._crossReference = pageInternals._crossReference;
        internal._isLoaded = false;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._setAppearance = false;
        internal._customTemplate = new Map<string, PdfTemplate>();

        spyOn(internal, '_postProcess').and.callFake((_isFlatten: boolean): void => undefined);
        spyOn(internal, '_createAppearance').and.returnValue(template);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(flattenSpy).toHaveBeenCalledWith(template, true);
        document.destroy();
    });

    it('should cover non-loaded + flatten + AP/N/reference path and flatten through _isValidTemplateMatrix()', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({
            x: 60,
            y: 60,
            width: 150,
            height: 55
        });
        const internal: PdfFreeTextAnnotation & _FreeTextInternals = _asFreeTextInternals(annotation);
        const template: PdfTemplate = _createTemplate(page, 95, 32);
        const apDictionary: _PdfDictionary = _createReferencedApDictionary(page, template);
        const pageInternals: PdfPage & _PageInternals = _asPageInternals(page);

        pageInternals.rotation = PdfRotationAngle.angle0;

        internal._page = page;
        internal._crossReference = pageInternals._crossReference;
        internal._isLoaded = false;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._setAppearance = false;
        internal._customTemplate = new Map<string, PdfTemplate>();
        internal._dictionary.set('AP', apDictionary);

        spyOn(internal, '_postProcess').and.callFake((_isFlatten: boolean): void => undefined);
        spyOn(internal, '_validateTemplateMatrix').and.returnValue(true);
        spyOn(internal, '_isValidTemplateMatrix').and.returnValue(true);
        const flattenSpy: jasmine.Spy = spyOn(internal, '_flattenAnnotationTemplate').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(internal._appearanceTemplate).toBeDefined();
        expect(flattenSpy).toHaveBeenCalled();
        document.destroy();
    });

    it('should cover flatten remove branch when no appearance template is available', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({
            x: 70,
            y: 70,
            width: 130,
            height: 48
        });
        const internal: PdfFreeTextAnnotation & _FreeTextInternals = _asFreeTextInternals(annotation);

        internal._page = page;
        internal._crossReference = _asPageInternals(page)._crossReference;
        internal._isLoaded = true;
        internal._appearanceTemplate = undefined as unknown as PdfTemplate;
        internal._setAppearance = false;
        internal._customTemplate = new Map<string, PdfTemplate>();

        // Spy on _createAppearance to prevent it from being called
        spyOn(internal, '_createAppearance').and.returnValue(undefined as unknown as PdfTemplate);

        const removeSpy: jasmine.Spy = spyOn(page.annotations, 'remove').and.callFake((): void => undefined);

        annotation._doPostProcess(true);

        expect(removeSpy).toHaveBeenCalledWith(annotation);
        document.destroy();
    });
});
``

describe('PdfAnnotation base _createTemplate() coverage via PdfCircleAnnotation', () => {

    interface Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }


    interface _PageInternalsForWatermark {
        _crossReference: unknown;
        _isNew: boolean;
        rotation: PdfRotationAngle;
        _pageSettings: {
            margins?: {
                left: number;
                top: number;
                right: number;
                bottom: number;
            };
        };
    }
    interface _TemplateInternals {
        _content: {
            dictionary: _PdfDictionary;
            reference?: unknown;
        };
        _size: {
            width: number;
            height: number;
        };
        _templateOriginalSize?: {
            width: number;
            height: number;
        };
        _isExported: boolean;
    }

    interface _AnnotationInternals {
        _page: PdfPage;
        _crossReference: {
            _getNextReference: () => unknown;
            _cacheMap: Map<unknown, unknown>;
        };
        _dictionary: _PdfDictionary;
        _isLoaded: boolean;
        _bounds: Rectangle;
        _createTemplate: (key?: string) => PdfTemplate;
        _postProcess: (isFlatten?: boolean) => void;
    }

    interface _CircleInternals extends _AnnotationInternals {
        _measure: boolean;
        _measureType: PdfCircleMeasurementType;
    }

    function _asPageInternals(page: PdfPage): _PageInternals {
        return page as unknown as _PageInternals;
    }

    function _asTemplateInternals(template: PdfTemplate): _TemplateInternals {
        return template as unknown as _TemplateInternals;
    }

    function _asAnnotationInternals(annotation: PdfCircleAnnotation): _AnnotationInternals {
        return annotation as unknown as _AnnotationInternals;
    }



    function _createDocumentAndPage(): { document: PdfDocument; page: PdfPage } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage() as PdfPage;
        const pageInternals: PdfPage & _PageInternalsForWatermark = _asPageInternals(page) as PdfPage & _PageInternalsForWatermark;

        pageInternals._isNew = false;
        pageInternals.rotation = PdfRotationAngle.angle0;

        if (!pageInternals._pageSettings) {
            (pageInternals as any)._pageSettings = {};
        }

        return { document, page };
    }
    function _createTemplate(page: PdfPage, width: number = 80, height: number = 30): PdfTemplate {
        const pageInternals: _PageInternals = _asPageInternals(page);
        const template: PdfTemplate = new PdfTemplate([0, 0, width, height], pageInternals._crossReference as never);
        const templateInternals: _TemplateInternals = _asTemplateInternals(template);

        templateInternals._content.dictionary.update('BBox', [0, 0, width, height]);
        return template;
    }

    function _createReferencedApDictionary(page: PdfPage, template: PdfTemplate, key: string = 'N'): {
        apDictionary: _PdfDictionary;
        reference: unknown;
        appearanceStream: unknown;
    } {
        const pageInternals: _PageInternals = _asPageInternals(page);
        const templateInternals: _TemplateInternals = _asTemplateInternals(template);
        const crossReference: _CrossReferenceLike = pageInternals._crossReference as _CrossReferenceLike;
        const apDictionary: _PdfDictionary = new _PdfDictionary(crossReference as never);
        const reference: unknown = crossReference._getNextReference();
        const appearanceStream: unknown = templateInternals._content as unknown;

        crossReference._cacheMap.set(reference, appearanceStream);
        templateInternals._content.reference = reference;
        apDictionary.set(key, reference as never);

        return { apDictionary, reference, appearanceStream };
    }

    it('should cover no-Matrix branch and assign template size from annotation bounds when Vertices is absent', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 10,
            y: 20,
            width: 100,
            height: 60
        });
        const internal: _AnnotationInternals = _asAnnotationInternals(annotation);
        const pageInternals: _PageInternals = _asPageInternals(page);

        internal._page = page;
        internal._crossReference = pageInternals._crossReference;
        internal._isLoaded = true;
        internal._bounds = {
            x: 10,
            y: 20,
            width: 100,
            height: 60
        };

        const template: PdfTemplate = _createTemplate(page, 100, 60);
        const templateInternals: _TemplateInternals = _asTemplateInternals(template);

        // Ensure Matrix is absent so the target branch executes.
        if (templateInternals._content.dictionary.has('Matrix')) {
            delete (templateInternals._content.dictionary as unknown as { _map: Record<string, unknown> })._map.Matrix;
        }

        const { apDictionary, reference, appearanceStream } = _createReferencedApDictionary(page, template, 'N');
        internal._dictionary.set('AP', apDictionary);
        internal._dictionary.set('Rect', [0, 0, 100, 60]);

        const cacheSetSpy: jasmine.Spy = spyOn(pageInternals._crossReference._cacheMap, 'set').and.callThrough();

        const result: PdfTemplate = internal._createTemplate('N');
        const resultInternals: _TemplateInternals = _asTemplateInternals(result);

        expect(result).toBeDefined();
        expect(resultInternals._size.width).toBe(100);
        expect(resultInternals._size.height).toBe(60);
        expect(cacheSetSpy).toHaveBeenCalledWith(reference, appearanceStream);
        document.destroy();
    });

    it('should cover Matrix + BBox branch and reset appearance stream offset to zero', () => {
        const { document, page } = _createDocumentAndPage();
        const annotation: PdfCircleAnnotation = new PdfCircleAnnotation({
            x: 15,
            y: 25,
            width: 120,
            height: 80
        });
        const internal: _AnnotationInternals = _asAnnotationInternals(annotation);
        const pageInternals: _PageInternals = _asPageInternals(page);

        internal._page = page;
        internal._crossReference = pageInternals._crossReference;
        internal._isLoaded = true;
        internal._bounds = {
            x: 15,
            y: 25,
            width: 120,
            height: 80
        };

        const template: PdfTemplate = _createTemplate(page, 50, 20);
        const templateInternals: _TemplateInternals = _asTemplateInternals(template);

        templateInternals._content.dictionary.update('Matrix', [1, 0, 0, 1, 5, 7]);
        templateInternals._content.dictionary.update('BBox', [0, 0, 50, 20]);

        const streamWithOffset: {
            dictionary: _PdfDictionary;
            offset: number;
            reference?: unknown;
        } = templateInternals._content as unknown as {
            dictionary: _PdfDictionary;
            offset: number;
            reference?: unknown;
        };
        streamWithOffset.offset = 15;

        const { apDictionary } = _createReferencedApDictionary(page, template, 'N');
        internal._dictionary.set('AP', apDictionary);

        const result: PdfTemplate = internal._createTemplate('N');
        const resultInternals: _TemplateInternals = _asTemplateInternals(result);

        expect(result).toBeDefined();
        expect(resultInternals._size.width).toBeGreaterThan(0);
        expect(resultInternals._size.height).toBeGreaterThan(0);
        expect(streamWithOffset.offset).toBe(0);
        expect(resultInternals._templateOriginalSize).toBeDefined();
        document.destroy();
    });
});

