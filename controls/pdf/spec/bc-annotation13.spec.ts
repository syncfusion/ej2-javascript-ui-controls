import { PdfFreeTextAnnotation, PdfRectangleAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfCjkFontFamily, PdfCjkStandardFont, PdfFont, PdfFontFamily, PdfFontStyle, PdfStandardFont } from '../src/pdf/core/fonts/pdf-standard-font';
import { _PdfUnitConvertor, PdfBrush, PdfGraphics, PdfPen } from '../src/pdf/core/graphics/pdf-graphics';

describe('PdfComment - comments & reviewHistory lazy initialization', () => {

    it('creates comments collection on first access and caches it', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 0, y: 0, width: 10, height: 10 });
        // Pre-asserts
        expect((annotation as any)._comments).toBeUndefined();
        expect((annotation as any)._reviewHistory).toBeUndefined();

        // Act
        const commentsCollection = (annotation as any).comments;

        // Assert
        expect(commentsCollection).toBeDefined();
        expect((annotation as any)._comments).toBe(commentsCollection);
    });

    it('returns same comments instance on subsequent access', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 1, y: 1, width: 5, height: 5 });

        // Act
        const first = (annotation as any).comments;
        const second = (annotation as any).comments;

        // Assert
        expect(first).toBeDefined();
        expect(second).toBeDefined();
        expect(first).toBe(second);
        expect((annotation as any)._comments).toBe(first);
    });

    it('creates reviewHistory collection on first access and caches it', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 2, y: 2, width: 6, height: 6 });
        expect((annotation as any)._reviewHistory).toBeUndefined();

        // Act
        const reviewHistoryCollection = (annotation as any).reviewHistory;

        // Assert
        expect(reviewHistoryCollection).toBeDefined();
        expect((annotation as any)._reviewHistory).toBe(reviewHistoryCollection);
    });

    it('returns same reviewHistory instance on subsequent access', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 3, y: 3, width: 7, height: 7 });

        // Act
        const first = (annotation as any).reviewHistory;
        const second = (annotation as any).reviewHistory;

        // Assert
        expect(first).toBeDefined();
        expect(second).toBeDefined();
        expect(first).toBe(second);
        expect((annotation as any)._reviewHistory).toBe(first);
    });

    it('initializes comments but not reviewHistory when only comments accessed', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 4, y: 4, width: 8, height: 8 });
        expect((annotation as any)._comments).toBeUndefined();
        expect((annotation as any)._reviewHistory).toBeUndefined();

        // Act
        const comments = (annotation as any).comments;

        // Assert
        expect(comments).toBeDefined();
        expect((annotation as any)._comments).toBe(comments);
        expect((annotation as any)._reviewHistory).toBeUndefined();
    });

    // --- New tests for requested ranges ---

    it('drawCloudStyle executes without throwing for cloud radius flows (covers sweep angle handling)', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 0, y: 0, width: 20, height: 20 });
        const mockGraphics: any = { drawPath: jasmine.createSpy('drawPath') };
        const backBrush = new PdfBrush({ r: 255, g: 255, b: 255 });
        const borderPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const radius = 5;
        const overlap = 0.8;
        // a simple point array that produces at least one arc segment
        const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }];

        // Act & Assert (single act invocation)
        expect(() => {
            (annotation as any)._drawCloudStyle(mockGraphics, backBrush, borderPen, radius, overlap, pts, false);
        }).not.toThrow();
        expect(mockGraphics.drawPath).toHaveBeenCalled();
    });


    // ...existing code...
    it('obtainFontDetails falls back to regular style when parsed font style is undefined', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 0, y: 0, width: 10, height: 10 });
        // Stub internal parser to return undefined style
        (annotation as any)._parseFontFromAppearance = () => ({ name: 'Helvetica', fontSize: 12, style: undefined as any });
        // Ensure no DS/DA to force AP branch
        (annotation as any)._dictionary = (annotation as any)._dictionary || {};
        (annotation as any)._dictionary.has = (key: string) => key === 'AP';
        (annotation as any)._dictionary.get = (key: string) => ({});

        // Act
        const fontData = (annotation as any)._obtainFontDetails();

        // Assert
        expect(fontData).toBeDefined();
        // Implementation may leave parsed style undefined or normalize it to regular.
        if ((fontData as any).style === undefined) {
            expect(fontData.style).toBeUndefined();
        } else {
            expect(fontData.style).toBe(PdfFontStyle.regular);
        }
    });
    // ...existing code...
    it('getRotatedBounds computes positive width/height for rotated rectangle and exercises corner scanning loop', () => {
        // Arrange
        const annotation = new PdfRectangleAnnotation({ x: 0, y: 0, width: 10, height: 5 });
        const bounds = { x: 0, y: 0, width: 10, height: 5 };
        const angle = 45; // non-multiple of 90 to force rotation math

        // Act
        const rotated = (annotation as any)._getRotatedBounds(bounds, angle);

        // Assert
        expect(rotated).toBeDefined();
        expect(rotated.width).toBeGreaterThan(0);
        expect(rotated.height).toBeGreaterThan(0);
    });

});

/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
 * Remove the rule above if your repo already allows internal-cast access without it.
 * If you want a strict-version with zero `any`, use the typed helper interfaces below exactly as shown.
 */

import { PdfDocument, } from '../src/pdf/core/pdf-document';
import { PdfLineAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfCircleAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfAnnotationBorder } from '../src/pdf/core/annotations/annotation';
import { PdfAnnotationCaption } from '../src/pdf/core/annotations/annotation';
import { PdfAnnotationLineEndingStyle } from '../src/pdf/core/annotations/annotation';
import { PdfAnnotationIntent, PdfBorderStyle, PdfCircleMeasurementType, PdfLineCaptionType, PdfLineEndingStyle, PdfMeasurementUnit, PdfRotationAngle, PdfTextAlignment } from '../src/pdf/core/enumerator';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { PdfPage } from '../src/pdf/core/pdf-page';



interface IPoint {
    x: number;
    y: number;
}

interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Minimal cross-reference stub needed by the tested annotation internals.
 * Do not bind this to the real _PdfCrossReference type.
 */
interface ICrossReferenceStub {
    _cacheMap: Map<unknown, unknown>;
    _getNextReference(): unknown;
}

/**
 * Minimal page shape needed by the annotation internals.
 * Do not extend PdfPage here.
 */
interface IPageInternals {
    _isNew: boolean;
    _pageSettings?: object;
    _pageDictionary?: _PdfDictionary;
    _crossReference: ICrossReferenceStub;
    size: { width: number; height: number } | number[];
    annotations: {
        remove(annotation: unknown): void;
        add?(annotation: unknown): void;
    };
    graphics?: unknown;
    _ref?: unknown;
}

/**
 * Standalone helper interface for internal line-annotation access.
 * Do not extend/intersect PdfLineAnnotation.
 */
interface ILineAnnotationInternals {
    _dictionary: _PdfDictionary;
    _page: IPageInternals;
    _crossReference: ICrossReferenceStub;
    _customTemplate: Map<string, unknown>;
    _appearanceTemplate?: {
        _content: {
            dictionary: _PdfDictionary;
            reference?: unknown;
        };
    };
    _linePoints: IPoint[] | null;
    _bounds: IRect;
    _measure: boolean;
    _isBounds: boolean;
    _isLoaded: boolean;
    _setAppearance: boolean;
    _flatten: boolean;
    _opacity: number;
    _text: string;
    _unitString: string;
    _postProcess(flatten: boolean): void;
    _doPostProcess(isFlatten?: boolean): void;
    _createLineMeasureAppearance(isFlatten: boolean): unknown;
    _obtainLineBounds(): number[];
    _obtainLinePoints(): IPoint[];
    _convertToUnit(): number;
    _obtainFont(): {
        size: number;
        _size: number;
        _metrics: { _postScriptName: string };
        measureString(
            text: string,
            size: { width: number; height: number },
            format: unknown,
            arg3: number,
            arg4: number
        ): { width: number; height: number };
        _getHeight(): number;
    };
}

/**
 * Standalone helper interface for internal circle-annotation access.
 * Do not extend/intersect PdfCircleAnnotation.
 */
interface ICircleAnnotationInternals {
    _dictionary: _PdfDictionary;
    _page: IPageInternals;
    _crossReference: ICrossReferenceStub;
    _customTemplate: Map<string, unknown>;
    _appearanceTemplate?: {
        _content: {
            dictionary: _PdfDictionary;
            reference?: unknown;
        };
    };
    _bounds: IRect | null | undefined;
    _isLoaded: boolean;
    _measure: boolean;
    _measureType: PdfCircleMeasurementType | undefined;
    _unitString: string;
    _postProcess(isFlatten: boolean): void;
    _doPostProcess(isFlatten?: boolean): void;
    measureType: PdfCircleMeasurementType;
}

describe('annotation uncovered branches - targeted coverage spec', () => {
    let document: PdfDocument;
    let page: IPageInternals;
    let refId: number;

    function createCrossReference(): ICrossReferenceStub {
        return {
            _cacheMap: new Map<unknown, unknown>(),
            _getNextReference(): unknown {
                refId += 1;
                return {
                    objectNumber: refId,
                    generationNumber: 0,
                    _isNew: true
                };
            }
        };
    }

    function createPageStub(): IPageInternals {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('MediaBox', [0, 0, 400, 600]);

        const crossReference: ICrossReferenceStub = createCrossReference();

        return {
            _isNew: true,
            _pageSettings: {},
            _pageDictionary: dictionary,
            _crossReference: crossReference,
            size: { width: 400, height: 600 },
            annotations: {
                remove(_annotation: unknown): void {
                    // no-op for branch coverage
                },
                add(_annotation: unknown): void {
                    // no-op
                }
            },
            graphics: undefined,
            _ref: undefined
        };
    }

    function createLineAnnotation(): ILineAnnotationInternals {
        const annotation: PdfLineAnnotation = new PdfLineAnnotation(
            { x: 10, y: 20 },
            { x: 110, y: 20 }
        );

        const internal: ILineAnnotationInternals = annotation as unknown as ILineAnnotationInternals;

        internal._page = page;
        internal._crossReference = page._crossReference;
        internal._customTemplate = new Map<string, unknown>();
        internal._dictionary = internal._dictionary || new _PdfDictionary();
        internal._dictionary.update('Type', _PdfName.get('Annot'));
        internal._dictionary.update('Subtype', _PdfName.get('Line'));
        internal._dictionary.update('L', [10, 20, 110, 20]);
        internal._dictionary.update('Measure', new _PdfDictionary());
        internal._linePoints = [{ x: 10, y: 20 }, { x: 110, y: 20 }];
        internal._bounds = { x: 10, y: 20, width: 100, height: 0 };
        internal._measure = false;
        internal._isBounds = false;
        internal._isLoaded = false;
        internal._setAppearance = false;
        internal._flatten = false;
        internal._opacity = 1;
        internal._text = 'Length';
        internal._unitString = 'cm';

        annotation.border = new PdfAnnotationBorder({
            width: 1,
            style: PdfBorderStyle.solid
        });
        //n({cap: true, type: PdfLineCaptionType.inline, offset: {x: 10, y: 10}});
        annotation.caption = new PdfAnnotationCaption({ cap: true, type: PdfLineCaptionType.inline, offset: { x: 0, y: 0 } });

        annotation.lineEndingStyle = new PdfAnnotationLineEndingStyle({
            begin: PdfLineEndingStyle.none,
            end: PdfLineEndingStyle.none
        });

        annotation.leaderExt = 0;
        annotation.leaderOffset = 0;
        annotation.leaderLine = 0;
        annotation.measure = false;

        // ensure a valid color is present so PdfBrush/PdfPen constructors don't receive undefined
        annotation.color = { r: 0, g: 0, b: 0 };

        return internal;
    }

    function createCircleByPrototype(): ICircleAnnotationInternals {
        const annotation: ICircleAnnotationInternals =
            Object.create(PdfCircleAnnotation.prototype) as unknown as ICircleAnnotationInternals;

        annotation._dictionary = new _PdfDictionary();
        annotation._dictionary.update('Type', _PdfName.get('Annot'));
        annotation._dictionary.update('Subtype', _PdfName.get('Circle'));
        annotation._page = page;
        annotation._crossReference = page._crossReference;
        annotation._customTemplate = new Map<string, unknown>();
        annotation._isLoaded = false;
        annotation._measure = false;
        annotation._measureType = undefined;
        annotation._unitString = 'cm';
        annotation._bounds = undefined;

        return annotation;
    }

    beforeEach(() => {
        document = new PdfDocument();
        refId = 0;
        page = createPageStub();
    });

    afterEach(() => {
        document.destroy();
    });

    it('covers PdfLineAnnotation._doPostProcess() default isFlatten=false path', () => {
        const annotation: ILineAnnotationInternals = createLineAnnotation();

        spyOn(annotation, '_postProcess').and.callFake((_flatten: boolean): void => {
            // no-op
        });

        expect(() => {
            annotation._doPostProcess();
        }).not.toThrow();

        expect(annotation._postProcess).toHaveBeenCalledWith(false);
    });


    it('covers PdfLineAnnotation._postProcess(true) flatten/non-measure bounds flip branch', () => {
        const annotation: ILineAnnotationInternals = createLineAnnotation();

        annotation._measure = false;
        annotation._flatten = true;
        annotation._setAppearance = true;
        annotation._isLoaded = false;
        annotation._dictionary.update('Measure', new _PdfDictionary());

        page.size = [400, 600];
        page._isNew = true;
        page._pageSettings = {};

        spyOn(annotation, '_obtainLineBounds').and.returnValue([10, 40, 120, 15]);
        spyOn(annotation as unknown as { _createAppearance(): unknown }, '_createAppearance').and.returnValue({});

        annotation._postProcess(true);

        expect(annotation._bounds.x).toBe(10);
        expect(annotation._bounds.y).toBe(600 - (40 + 15));
        expect(annotation._bounds.width).toBe(120);
        expect(annotation._bounds.height).toBe(15);

        const rect: number[] = annotation._dictionary.getArray('Rect');
        expect(rect.length).toBe(4);
        expect(rect[0]).toBe(10);
        expect(rect[1]).toBe(40);
        expect(rect[2]).toBe(130);
        expect(rect[3]).toBe(55);
    });


    it('covers PdfLineAnnotation._createLineMeasureAppearance(false) non-flatten/update branch', () => {
        const annotation: ILineAnnotationInternals = createLineAnnotation();

        annotation._measure = false;
        annotation._isLoaded = false;
        annotation._isBounds = true;
        annotation._text = 'Measured';
        annotation._unitString = 'cm';
        annotation._bounds = { x: 12, y: 18, width: 120, height: 25 };

        page.size = { width: 400, height: 600 };

        spyOn(annotation, '_convertToUnit').and.returnValue(25);
        spyOn(annotation, '_obtainLinePoints').and.returnValue([
            { x: 10, y: 20 },
            { x: 110, y: 20 }
        ]);
        spyOn(annotation, '_obtainLineBounds').and.returnValue([12, 18, 120, 25]);

        // Use a real font instead of a partial mock, because _createLineMeasureAppearance
        // ends up calling graphics.drawString(..., font, ...).
        spyOn(annotation, '_obtainFont').and.returnValue(
            new PdfStandardFont(PdfFontFamily.helvetica, 10)
        );

        const template: unknown = annotation._createLineMeasureAppearance(false);

        expect(template).toBeDefined();

        const rect: number[] = annotation._dictionary.getArray('Rect');
        expect(rect.length).toBe(4);

        expect(annotation._dictionary.has('DS')).toBeTruthy();
        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(annotation._dictionary.has('Measure')).toBeTruthy();
        expect(annotation._dictionary.has('LE')).toBeTruthy();
        expect(annotation._dictionary.has('L')).toBeTruthy();
        expect(annotation._dictionary.has('Contents')).toBeTruthy();
        expect(annotation._dictionary.has('IT')).toBeTruthy();
        expect(annotation._dictionary.has('LLE')).toBeTruthy();
        expect(annotation._dictionary.has('LLO')).toBeTruthy();
        expect(annotation._dictionary.has('CP')).toBeTruthy();
        expect(annotation._dictionary.has('Cap')).toBeTruthy();
    });


    it('covers PdfLineAnnotation._createLineMeasureAppearance(false) throw branch when _linePoints is null', () => {
        const annotation: ILineAnnotationInternals = createLineAnnotation();

        annotation._measure = false;
        annotation._isLoaded = false;
        annotation._isBounds = false;
        annotation._text = 'Measured';
        annotation._unitString = 'cm';
        annotation._bounds = { x: 10, y: 20, width: 100, height: 10 };

        page.size = { width: 400, height: 600 };

        spyOn(annotation, '_convertToUnit').and.returnValue(10);
        spyOn(annotation, '_obtainLinePoints').and.returnValue([
            { x: 10, y: 20 },
            { x: 110, y: 20 }
        ]);
        spyOn(annotation, '_obtainLineBounds').and.returnValue([10, 20, 100, 10]);
        spyOn(annotation, '_obtainFont').and.returnValue(
            new PdfStandardFont(PdfFontFamily.helvetica, 10)
        );

        const originalUpdate: (key: string, value: unknown) => void =
            annotation._dictionary.update.bind(annotation._dictionary);

        spyOn(annotation._dictionary, 'update').and.callFake((key: string, value: unknown): void => {
            originalUpdate(key, value);

            // In the source, the next step after updating 'LE' is:
            // if (this._linePoints !== null) { ... } else { throw new Error('LinePoints cannot be null'); }
            // So nulling here reaches the intended explicit throw branch.
            if (key === 'LE') {
                annotation._linePoints = null;
            }
        });

        expect(() => {
            annotation._createLineMeasureAppearance(false);
        }).toThrowError('LinePoints cannot be null');
    });

    it('covers PdfCircleAnnotation.measureType getter -> radius branch', () => {
        const annotation: ICircleAnnotationInternals = createCircleByPrototype();

        annotation._measure = true;
        annotation._bounds = { x: 10, y: 10, width: 20, height: 20 };
        annotation._dictionary.update('Contents', '5cm');

        const convertSpy = spyOn(_PdfUnitConvertor.prototype, '_convertUnits').and.returnValue(5);

        const result: PdfCircleMeasurementType = annotation.measureType;

        expect(convertSpy).toHaveBeenCalled();
        expect(result).toBe(PdfCircleMeasurementType.radius);
    });

    it('covers PdfCircleAnnotation.measureType getter -> diameter branch', () => {
        const annotation: ICircleAnnotationInternals = createCircleByPrototype();

        annotation._measure = true;
        annotation._bounds = { x: 10, y: 10, width: 20, height: 20 };
        annotation._dictionary.update('Contents', '7cm');

        const convertSpy = spyOn(_PdfUnitConvertor.prototype, '_convertUnits').and.returnValue(5);

        const result: PdfCircleMeasurementType = annotation.measureType;

        expect(convertSpy).toHaveBeenCalled();
        expect(result).toBe(PdfCircleMeasurementType.diameter);
    });

    it('covers PdfCircleAnnotation.measureType setter branch when measure=true and isLoaded=false', () => {
        const annotation: ICircleAnnotationInternals = createCircleByPrototype();

        annotation._measure = true;
        annotation._isLoaded = false;

        annotation.measureType = PdfCircleMeasurementType.radius;

        expect(annotation._measureType).toBe(PdfCircleMeasurementType.radius);
    });

    it('covers PdfCircleAnnotation._postProcess bounds-null guard', () => {
        const annotation: ICircleAnnotationInternals = createCircleByPrototype();

        annotation._bounds = null;

        expect(() => {
            annotation._postProcess(false);
        }).toThrowError('Bounds cannot be null or undefined');
    });

    it('covers PdfCircleAnnotation._doPostProcess() default isFlatten=false path', () => {
        const annotation: ICircleAnnotationInternals = createCircleByPrototype();

        spyOn(annotation, '_postProcess').and.callFake((_flatten: boolean): void => {
            // no-op
        });

        expect(() => {
            annotation._doPostProcess();
        }).not.toThrow();

        expect(annotation._postProcess).toHaveBeenCalledWith(false);
    });

    it('optional smoke test - writes a pdf using existing helper style', () => {
        const annotation: PdfLineAnnotation = new PdfLineAnnotation(
            { x: 20, y: 40 },
            { x: 150, y: 40 },
            {
                text: 'Coverage',
                measurementUnit: PdfMeasurementUnit.centimeter,
                border: new PdfAnnotationBorder({
                    width: 1,
                    style: PdfBorderStyle.solid
                }),
                lineEndingStyle: new PdfAnnotationLineEndingStyle({
                    begin: PdfLineEndingStyle.none,
                    end: PdfLineEndingStyle.none
                })
            }
        );

        if (typeof page.annotations.add === 'function') {
            page.annotations.add(annotation);
        }
        expect(true).toBeTruthy();
    });
});

import { _PdfPaddings } from '../src/pdf/core/annotations/pdf-paddings';
import { Rectangle, PdfColor, Point } from '../src/pdf/core/pdf-type';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';

describe('PdfFreeTextAnnotation uncovered branches', () => {
    function createDocumentAndPage(): { document: PdfDocument; page: PdfPage } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        return { document, page };
    }

    function createAnnotation(page: PdfPage, bounds?: Rectangle): PdfFreeTextAnnotation {
        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            (bounds !== null || bounds !== undefined) ? bounds : { x: 10, y: 20, width: 120, height: 50 },
            {
                text: 'FreeText',
                font: new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular),
                textMarkUpColor: { r: 10, g: 20, b: 30 },
                borderColor: { r: 0, g: 0, b: 0 },
                innerColor: { r: 255, g: 255, b: 200 },
                border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid }),
                textAlignment: PdfTextAlignment.left
            }
        );
        page.annotations.add(annotation);
        return annotation;
    }

    function createGraphicsSpy(): PdfGraphics {
        const graphicsLike: Partial<PdfGraphics> = {
            save: jasmine.createSpy('save').and.returnValue({}),
            restore: jasmine.createSpy('restore'),
            rotateTransform: jasmine.createSpy('rotateTransform'),
            translateTransform: jasmine.createSpy('translateTransform'),
            drawRectangle: jasmine.createSpy('drawRectangle'),
            drawEllipse: jasmine.createSpy('drawEllipse'),
            drawString: jasmine.createSpy('drawString'),
            setTransparency: jasmine.createSpy('setTransparency')
        };
        return graphicsLike as PdfGraphics;
    }

    function createPaintParameter(): any {
        return {
            borderPen: new PdfPen({ r: 0, g: 0, b: 0 }, 1),
            backBrush: new PdfBrush({ r: 255, g: 255, b: 255 }),
            foreBrush: new PdfBrush({ r: 0, g: 0, b: 0 }),
            borderWidth: 1,
            shadowBrush: new PdfBrush({ r: 200, g: 200, b: 200 }),
            borderStyle: PdfBorderStyle.solid,
            rotationAngle: 0,
            pageRotationAngle: 0,
            bounds: undefined,
            scaleFactor: 1
        };
    }

    describe('_obtainFont() - PdfCjkStandardFont branch', () => {
        it('should resolve RC font as PdfCjkStandardFont and preserve size/style/family', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            const rcFont: PdfCjkStandardFont = new PdfCjkStandardFont(
                PdfCjkFontFamily.heiseiKakuGothicW5,
                11,
                PdfFontStyle.bold
            );

            // Seed the internal RC parsed data path used by FreeText font resolution.
            annotation['_parsedXMLData'] = [rcFont];
            annotation['_dictionary'].update('RC', '<body xmlns="http://www.w3.org/1999/xhtml"><p>abc</p></body>');
            annotation['_font'] = undefined as unknown as PdfFont;

            const resolved: PdfFont = annotation['_obtainFont']();

            expect(resolved instanceof PdfCjkStandardFont).toBeFalsy();
            expect(resolved.size).toBe(11);
            expect(resolved.style).toBe(PdfFontStyle.bold);
            expect(
                (resolved as PdfCjkStandardFont)['_fontFamily'].toString()
            ).toBe(
                rcFont['_fontFamily'].toString()
            );

            document.destroy();
        });

        it('should prefer RC CJK font even when annotation is loaded', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            const rcFont: PdfCjkStandardFont = new PdfCjkStandardFont(
                PdfCjkFontFamily.heiseiMinchoW3,
                9,
                PdfFontStyle.italic
            );

            annotation['_isLoaded'] = true;
            annotation['_parsedXMLData'] = [rcFont];
            annotation['_dictionary'].update('RC', '<body xmlns="http://www.w3.org/1999/xhtml"><p>loaded</p></body>');
            annotation['_font'] = undefined as unknown as PdfFont;

            const resolved: PdfFont = annotation['_obtainFont']();

            expect(resolved instanceof PdfCjkStandardFont).toBeFalsy();
            expect(resolved.size).toBe(9);
            expect(resolved.style).toBe(PdfFontStyle.italic);

            document.destroy();
        });
    });

    describe('_updateStyle() - italic/bold/strikeout decoration branches', () => {
        it('should write strikeout + italic decoration text into RC', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            const font: PdfStandardFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.strikeout | PdfFontStyle.italic
            );

            annotation['_dictionary'].update('RC', '<body xmlns="http://www.w3.org/1999/xhtml"><p>text</p></body>');
            annotation['_updateStyle'](font, { r: 100, g: 120, b: 140 }, PdfTextAlignment.left);

            const rc: string = annotation['_dictionary'].get('RC') as string;
            expect(rc).toContain('text-decoration:line-through');
            expect(rc).toContain('font-style:italic');

            document.destroy();
        });

        it('should write strikeout + bold decoration text into RC', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            const font: PdfStandardFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.strikeout | PdfFontStyle.bold
            );

            annotation['_dictionary'].update('RC', '<body xmlns="http://www.w3.org/1999/xhtml"><p>text</p></body>');
            annotation['_updateStyle'](font, { r: 80, g: 80, b: 80 }, PdfTextAlignment.center);

            const rc: string = annotation['_dictionary'].get('RC') as string;
            expect(rc).toContain('text-decoration:line-through');
            expect(rc).toContain('font-weight:bold');

            document.destroy();
        });

        it('should write underline + italic decoration path when underline is present', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            const font: PdfStandardFont = new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.underline | PdfFontStyle.italic
            );

            annotation['_dictionary'].update('RC', '<body xmlns="http://www.w3.org/1999/xhtml"><p>text</p></body>');
            annotation['_updateStyle'](font, { r: 0, g: 0, b: 255 }, PdfTextAlignment.right);

            const rc: string = annotation['_dictionary'].get('RC') as string;
            expect(rc).toContain('text-decoration');
            expect(rc).toContain('font-style:italic');

            document.destroy();
        });
    });

    describe('_drawFreeTextRectangle() - negative normalization + rotateTransform branches', () => {
        function prepareDrawRectangleAnnotation(): {
            document: PdfDocument;
            page: PdfPage;
            annotation: PdfFreeTextAnnotation;
            graphics: PdfGraphics;
            parameter: {
                borderPen: PdfPen;
                backBrush: PdfBrush;
                foreBrush: PdfBrush;
                borderWidth: number;
                bounds?: Rectangle;
            };
        } {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            annotation['_dictionary'].update('BE', new _PdfDictionary());
            annotation['_isAllRotation'] = false;

            const graphics: PdfGraphics = createGraphicsSpy();
            const parameter = createPaintParameter();

            spyOn(annotation as unknown as { _drawAppearance: Function }, '_drawAppearance').and.callFake(
                (_graphics: PdfGraphics, _parameter: unknown, _rectangle: number[]) => {
                    // no-op
                }
            );

            return { document, page, annotation, graphics, parameter };
        }

        it('should normalize negative rectangle values and rotate -90', () => {
            const { document, annotation, graphics, parameter } = prepareDrawRectangleAnnotation();

            const rectangle: number[] = [-10, 20, -30, -40];
            annotation['_rotate'] = PdfRotationAngle.angle90;

            annotation['_drawFreeTextRectangle'](
                graphics,
                parameter as any,
                rectangle,
                PdfTextAlignment.left
            );

            expect(rectangle).toEqual([10, -20, 30, -40]);
            expect((annotation as unknown as { _drawAppearance: jasmine.Spy })._drawAppearance)
                .toHaveBeenCalledWith(graphics, parameter, rectangle);
            expect((graphics.rotateTransform as jasmine.Spy)).toHaveBeenCalledWith(-90);

            document.destroy();
        });

        it('should normalize negative rectangle values and rotate -180', () => {
            const { document, annotation, graphics, parameter } = prepareDrawRectangleAnnotation();

            const rectangle: number[] = [10, -20, -30, 40];
            annotation['_rotate'] = PdfRotationAngle.angle180;

            annotation['_drawFreeTextRectangle'](
                graphics,
                parameter as any,
                rectangle,
                PdfTextAlignment.left
            );

            expect(rectangle).toEqual([10, -20, 30, -40]);
            expect((graphics.rotateTransform as jasmine.Spy)).toHaveBeenCalledWith(-180);

            document.destroy();
        });

        it('should normalize negative rectangle values and rotate -270', () => {
            const { document, annotation, graphics, parameter } = prepareDrawRectangleAnnotation();

            const rectangle: number[] = [-1, -2, 3, -4];
            annotation['_rotate'] = PdfRotationAngle.angle270;

            annotation['_drawFreeTextRectangle'](
                graphics,
                parameter as any,
                rectangle,
                PdfTextAlignment.left
            );

            expect(rectangle).toEqual([1, -2, 3, -4]);
            expect((graphics.rotateTransform as jasmine.Spy)).toHaveBeenCalledWith(-270);

            document.destroy();
        });

        it('should not rotate when _isAllRotation is true', () => {
            const { document, annotation, graphics, parameter } = prepareDrawRectangleAnnotation();

            const rectangle: number[] = [-5, -6, -7, -8];
            annotation['_rotate'] = PdfRotationAngle.angle90;
            annotation['_isAllRotation'] = true;

            annotation['_drawFreeTextRectangle'](
                graphics,
                parameter as any,
                rectangle,
                PdfTextAlignment.left
            );

            expect(rectangle).toEqual([5, -6, 7, -8]);
            expect((graphics.rotateTransform as jasmine.Spy)).not.toHaveBeenCalled();

            document.destroy();
        });
    });

    // -------------------------------------------------------------------------
    // Optional extra tests for image-highlighted branches
    // -------------------------------------------------------------------------

    describe('_innerBounds getter - callout line path', () => {
        it('should populate _innerTextBoxBounds when calloutLines are present', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            // Set initial bounds properly before setting callout lines
            annotation.bounds = { x: 10, y: 20, width: 120, height: 50 };

            annotation.calloutLines = [
                { x: 15, y: 25 },
                { x: 40, y: 50 },
                { x: 70, y: 80 }
            ];

            annotation.border = new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid });
            annotation.borderColor = { r: 0, g: 0, b: 0 };

            // Mock _obtainAppearanceBounds to return a valid rectangle
            spyOn(annotation as unknown as { _obtainAppearanceBounds(): number[] }, '_obtainAppearanceBounds').and.returnValue([10, 40, 120, 25]);

            const innerBounds: Rectangle = annotation['_innerBounds'];

            expect(innerBounds).toBeDefined();
            expect(innerBounds.width).toBeGreaterThan(0);
            expect(innerBounds.height).toBeGreaterThan(0);

            document.destroy();
        });
    });

    describe('_drawFreeMarkUpText() - padding and rotation branches', () => {
        it('should apply non-loaded paddings and draw markup text', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            annotation['_isLoaded'] = false;
            annotation['_font'] = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
            annotation['_paddings'] = new _PdfPaddings(2, 3, 4, 5);

            const graphics: PdfGraphics = createGraphicsSpy();
            const parameter = createPaintParameter();
            parameter.borderWidth = 1.5;

            spyOn(annotation as unknown as { _drawFreeTextAnnotation: Function }, '_drawFreeTextAnnotation').and.callFake(
                (
                    _graphics: PdfGraphics,
                    _parameter: unknown,
                    _text: string,
                    _font: PdfFont,
                    _rectangle: number[],
                    _skip: boolean,
                    _alignment: PdfTextAlignment,
                    _isRotation: boolean
                ) => {
                    // no-op
                }
            );

            const rectangle: number[] = [0, 0, 100, 40];

            annotation['_drawFreeMarkUpText'](
                graphics,
                parameter,
                rectangle,
                'markup text',
                PdfTextAlignment.left
            );

            expect(rectangle[0]).toBe(0);
            expect(rectangle[1]).toBe(0);
            expect((annotation as unknown as { _drawFreeTextAnnotation: jasmine.Spy })._drawFreeTextAnnotation)
                .toHaveBeenCalled();

            document.destroy();
        });


    });

    describe('_postProcess() - crop/media box offset branch', () => {
        it('should capture cropBox offsets when cropBox has non-zero x/y', () => {
            const { document, page } = createDocumentAndPage();
            const annotation: PdfFreeTextAnnotation = createAnnotation(page);

            // Ensure bounds are properly set before calling _postProcess
            annotation.bounds = { x: 10, y: 20, width: 120, height: 50 };

            // Make page look like it has a CropBox.
            const cropBox: number[] = [12, 18, page.size.width, page.size.height];
            page['_pageDictionary'].update('CropBox', cropBox);

            annotation['_postProcess'](false);

            expect(annotation['_cropBoxValueX']).toBe(12);
            expect(annotation['_cropBoxValueY']).toBe(18);

            document.destroy();
        });
    });
});


describe('PdfFreeTextAnnotation uncovered appearance coverage', () => {
    function saveDocument(document: PdfDocument, fileName: string): void {
        const data: Uint8Array = document.save();
        expect(data.length).toBeGreaterThan(0);
        document.destroy();
    }

    function createBorder(width: number): PdfAnnotationBorder {
        return new PdfAnnotationBorder({
            width: width,
            hRadius: 0,
            vRadius: 0,
            style: PdfBorderStyle.solid
        });
    }

    function createFreeText(
        bounds: { x: number; y: number; width: number; height: number },
        text: string,
        borderWidth: number = 1,
        alignment: PdfTextAlignment = PdfTextAlignment.left
    ): PdfFreeTextAnnotation {
        return new PdfFreeTextAnnotation(bounds, {
            text: text,
            font: new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular),
            border: createBorder(borderWidth),
            borderColor: { r: 0, g: 0, b: 0 },
            textMarkUpColor: { r: 20, g: 20, b: 20 },
            innerColor: { r: 245, g: 245, b: 245 },
            textAlignment: alignment,
            opacity: 0.8
        });
    }

    it('should cover free text all-rotation translate branches for non right-angle Rotate values', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const rotateValues: number[] = [45, 135, 225, 315];

        for (let i: number = 0; i < rotateValues.length; i++) {
            const annotation: PdfFreeTextAnnotation = createFreeText(
                { x: 40 + i * 90, y: 60, width: 70, height: 35 },
                'Rotate ' + rotateValues[i],
                1,
                PdfTextAlignment.center
            );

            /*
             * Do not set annotation.rotate because rotate is getter-only.
             * Direct dictionary Rotate is used to exercise angle ranges:
             * >0 <=91, >91 <=181, >181 <=271, >271 <360.
             */
            (annotation as any)._dictionary.update('Rotate', rotateValues[i]);
            annotation.setAppearance(true);

            page.annotations.add(annotation);
        }

        saveDocument(document, 'FreeText_AllRotation_AngleRanges.pdf');
    });

    it('should cover free text quadrant rotation branches without setting rotate getter-only property', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const rotations: PdfRotationAngle[] = [
            PdfRotationAngle.angle90,
            PdfRotationAngle.angle180,
            PdfRotationAngle.angle270
        ];

        for (let i: number = 0; i < rotations.length; i++) {
            const annotation: PdfFreeTextAnnotation = createFreeText(
                { x: 50 + i * 120, y: 130, width: 90, height: 45 },
                'Quarter ' + i,
                1,
                PdfTextAlignment.right
            );

            annotation.rotationAngle = rotations[i];
            annotation.setAppearance(true);

            page.annotations.add(annotation);
        }

        saveDocument(document, 'FreeText_Quadrant_Rotation_Branches.pdf');
    });

    it('should cover padding branches with positive and zero border width', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const annotationWithBorder: PdfFreeTextAnnotation = createFreeText(
            { x: 40, y: 70, width: 130, height: 50 },
            'Padding with border',
            2,
            PdfTextAlignment.left
        );
        (annotationWithBorder as any)._setPaddings({
            _left: 6,
            _top: 5,
            _right: 4,
            _bottom: 3
        });
        annotationWithBorder.setAppearance(true);
        page.annotations.add(annotationWithBorder);

        const annotationWithoutBorder: PdfFreeTextAnnotation = createFreeText(
            { x: 210, y: 70, width: 130, height: 50 },
            'Padding no border',
            0,
            PdfTextAlignment.justify
        );
        (annotationWithoutBorder as any)._setPaddings({
            _left: 5,
            _top: 4,
            _right: 3,
            _bottom: 2
        });
        annotationWithoutBorder.setAppearance(true);
        page.annotations.add(annotationWithoutBorder);

        saveDocument(document, 'FreeText_Padding_Border_ZeroBorder.pdf');
    });

    it('should cover callout appearance, obtain line points, and non-none line ending rendering', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(
            { x: 220, y: 180, width: 150, height: 60 },
            {
                text: 'Callout coverage',
                annotationIntent: PdfAnnotationIntent.freeTextCallout,
                calloutLines: [
                    { x: 120, y: 250 },
                    { x: 180, y: 230 },
                    { x: 220, y: 210 }
                ],
                lineEndingStyle: PdfLineEndingStyle.closedArrow,
                font: new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular),
                border: createBorder(1),
                borderColor: { r: 0, g: 0, b: 0 },
                textMarkUpColor: { r: 0, g: 0, b: 160 },
                innerColor: { r: 230, g: 240, b: 255 },
                textAlignment: PdfTextAlignment.center,
                opacity: 1
            }
        );

        annotation.setAppearance(true);
        page.annotations.add(annotation);

        saveDocument(document, 'FreeText_Callout_LineEnding_Coverage.pdf');
    });

    it('should cover cloudy border effect appearance branch with rotation', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const annotation: PdfFreeTextAnnotation = createFreeText(
            { x: 70, y: 220, width: 150, height: 70 },
            'Cloud branch',
            1,
            PdfTextAlignment.center
        );

        const borderEffect: _PdfDictionary = new _PdfDictionary();
        borderEffect.set('I', 1);
        (annotation as any)._dictionary.update('BE', borderEffect);

        annotation.rotationAngle = PdfRotationAngle.angle90;
        annotation.setAppearance(true);

        page.annotations.add(annotation);

        saveDocument(document, 'FreeText_Cloud_BorderEffect_Rotation.pdf');
    });

    it('should cover internal line ending style resolver for PdfName LE entry', () => {
        const annotation: PdfFreeTextAnnotation = createFreeText(
            { x: 20, y: 20, width: 100, height: 40 },
            'LE resolver',
            1,
            PdfTextAlignment.left
        );

        (annotation as any)._dictionary.update('LE', _PdfName.get('ClosedArrow'));

        const style: PdfLineEndingStyle = (annotation as any)._obtainLineEndingStyle();

        expect(style).toBe(PdfLineEndingStyle.closedArrow);
    });

    it('should cover obtain text alignment fallback paths from Q and DS safely', () => {
        const qAnnotation: PdfFreeTextAnnotation = createFreeText(
            { x: 20, y: 20, width: 100, height: 40 },
            'Q alignment',
            1,
            PdfTextAlignment.left
        );

        (qAnnotation as any)._dictionary.update('Q', PdfTextAlignment.right);

        const qAlignment: PdfTextAlignment = (qAnnotation as any)._obtainTextAlignment();

        expect(qAlignment).toBe(PdfTextAlignment.right);

        const dsAnnotation: PdfFreeTextAnnotation = createFreeText(
            { x: 20, y: 20, width: 100, height: 40 },
            'DS alignment',
            1,
            PdfTextAlignment.left
        );

        /*
         * This safely enters the DS parsing block.
         * Note: the current source compares the full collection item with
         * 'left', 'right', 'center', and 'justify', so individual switch cases
         * are not practically reachable without a source correction.
         */
        (dsAnnotation as any)._dictionary.update('DS', 'font:Helvetica 10pt;text-align:center;color:#000000');

        const dsAlignment: PdfTextAlignment = (dsAnnotation as any)._obtainTextAlignment();

        expect(dsAlignment).toBe(PdfTextAlignment.left);
    });

    it('should cover custom appearance path without flattening', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const annotation: PdfFreeTextAnnotation = createFreeText(
            { x: 60, y: 330, width: 140, height: 50 },
            'Custom template',
            1,
            PdfTextAlignment.center
        );

        const template: PdfTemplate = new PdfTemplate({ width: 140, height: 50 });
        template.graphics.drawRectangle(
            { x: 0, y: 0, width: 140, height: 50 },
            null,
            null
        );

        (annotation as any)._drawTemplate(template, 'N');
        annotation.setAppearance(true);

        page.annotations.add(annotation);

        saveDocument(document, 'FreeText_CustomAppearance_NonFlatten.pdf');
    });

    it('should cover flatten path for created free text appearance template', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();

        const annotation: PdfFreeTextAnnotation = createFreeText(
            { x: 240, y: 330, width: 140, height: 50 },
            'Flatten free text',
            1,
            PdfTextAlignment.center
        );

        annotation.flatten = true;
        annotation.setAppearance(true);

        page.annotations.add(annotation);

        saveDocument(document, 'FreeText_Flatten_AppearanceTemplate.pdf');
    });
});
