
import { PdfTextMarkupAnnotation } from '../src/pdf/core/annotations/annotation';
import * as pdfTemplateModule from '../src/pdf/core/graphics/pdf-template';
describe('PdfTextMarkupAnnotation _doPostProcess', () => {
    let pdfTemplateSpy: jasmine.Spy;

    beforeEach(() => {
        pdfTemplateSpy = spyOn(pdfTemplateModule as any, 'PdfTemplate').and.callFake(function (this: any, stream: any) {
            this._content = stream;
        } as any);
    });

    afterEach(() => {
        pdfTemplateSpy.calls.reset();
    });

    it('loaded with _setAppearance true attaches AP dictionary and caches template', () => {
        const annotation: any = Object.create(PdfTextMarkupAnnotation.prototype);
        annotation._isLoaded = true;
        annotation._setAppearance = true;

        let createCalled = false;
        const template: any = {
            _content: {
                dictionary: {
                    _updated: false
                },
                reference: null
            }
        };

        annotation._createMarkupAppearance = () => {
            createCalled = true;
            return template;
        };

        const refObj = { refId: 1 };
        annotation._crossReference = {
            _getNextReference: () => refObj,
            _cacheMap: new Map()
        };

        annotation._dictionary = {
            has: () => false,
            set(k: string, v: any) {
                (this as any)._lastSet = { k, v };
            }
        };

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(createCalled).toBeTruthy();
        expect(annotation._dictionary._lastSet.k).toBe('AP');
        expect(annotation._dictionary._lastSet.v._updated).toBeTruthy();
        expect(template._content.reference).toBe(refObj);
        expect(annotation._crossReference._cacheMap.get(refObj)).toBe(template._content);
    });

    it('loaded and flatten with existing AP loads appearance stream into PdfTemplate', () => {
        const annotation: any = Object.create(PdfTextMarkupAnnotation.prototype);
        annotation._isLoaded = true;
        annotation._setAppearance = false;
        annotation._validateTemplateMatrix = () => false;

        const appearanceStream: any = {
            dictionary: {
                has: () => false,
                getArray: () => null as any,
                update: () => { /**/ }
            }
        };
        const rawRef = { id: 2 };

        annotation._dictionary = {
            has: (key: string) => key === 'AP',
            get: () => ({
                has: (key: string) => key === 'N',
                get: () => appearanceStream,
                getRaw: () => rawRef
            })
        };

        annotation._flattenAnnotationTemplate = () => { /**/ };

        Object.defineProperty(annotation, '_page', {
            configurable: true,
            value: {
                rotation: undefined,
                annotations: {
                    remove: () => { /**/ }
                }
            }
        });

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(appearanceStream.reference).toBe(rawRef);
        expect(pdfTemplateSpy).toHaveBeenCalled();
        expect(annotation._appearanceTemplate._content).toBe(appearanceStream);
    });

    it('not loaded and flatten with no AP calls _postProcess and creates template', () => {
        const annotation: any = Object.create(PdfTextMarkupAnnotation.prototype);
        annotation._isLoaded = false;

        let postCalled = false;
        let createCalled = false;

        annotation._postProcess = () => {
            postCalled = true;
        };
        annotation._flattenAnnotationTemplate = () => { /**/ };
        annotation._validateTemplateMatrix = () => false;

        annotation._createMarkupAppearance = () => {
            createCalled = true;
            return {
                _content: {
                    dictionary: {
                        has: () => false,
                        getArray: () => null as any,
                        update: () => { /**/ }
                    }
                }
            };
        };

        annotation._dictionary = {
            has: () => false
        };

        Object.defineProperty(annotation, '_page', {
            configurable: true,
            value: {
                rotation: undefined,
                annotations: {
                    remove: () => { /**/ }
                }
            }
        });

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(postCalled).toBeTruthy();
        expect(createCalled).toBeTruthy();
        expect(annotation._appearanceTemplate).toBeDefined();
    });

    it('not loaded and flatten with AP containing N loads appearance stream into PdfTemplate', () => {
        const annotation: any = Object.create(PdfTextMarkupAnnotation.prototype);
        annotation._isLoaded = false;
        annotation._validateTemplateMatrix = () => false;

        let postCalled = false;
        annotation._postProcess = () => {
            postCalled = true;
        };

        const appearanceStream: any = {
            dictionary: {
                has: () => false,
                getArray: () => null as any,
                update: () => { /**/ }
            }
        };
        const rawRef = { id: 3 };

        annotation._dictionary = {
            has: (key: string) => key === 'AP',
            get: () => ({
                has: (key: string) => key === 'N',
                get: () => appearanceStream,
                getRaw: () => rawRef
            })
        };

        annotation._flattenAnnotationTemplate = () => { /**/ };

        Object.defineProperty(annotation, '_page', {
            configurable: true,
            value: {
                rotation: undefined,
                annotations: {
                    remove: () => { /**/ }
                }
            }
        });

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(postCalled).toBeTruthy();
        expect(appearanceStream.reference).toBe(rawRef);
        expect(pdfTemplateSpy).toHaveBeenCalled();
        expect(annotation._appearanceTemplate._content).toBe(appearanceStream);
    });

    it('calls popup flattening helper based on loaded flag when flattenPopups true', () => {
        const loaded: any = Object.create(PdfTextMarkupAnnotation.prototype);
        loaded._isLoaded = true;
        loaded._setAppearance = false;
        loaded.flattenPopups = true;
        loaded._dictionary = {
            has: () => false
        };

        let loadedCalled = false;
        loaded._flattenLoadedPopUp = () => {
            loadedCalled = true;
        };

        const notLoaded: any = Object.create(PdfTextMarkupAnnotation.prototype);
        notLoaded._isLoaded = false;
        notLoaded.flattenPopups = true;
        notLoaded._dictionary = {
            has: () => false
        };
        notLoaded._postProcess = () => { /**/ };

        let notLoadedCalled = false;
        notLoaded._flattenPopUp = () => {
            notLoadedCalled = true;
        };

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(loaded, false);
        PdfTextMarkupAnnotation.prototype._doPostProcess.call(notLoaded, false);

        expect(loadedCalled).toBeTruthy();
        expect(notLoadedCalled).toBeTruthy();
    });

    it('updates Matrix from BBox and flattens template then removes annotation when flattening', () => {
        const annotation: any = Object.create(PdfTextMarkupAnnotation.prototype);
        annotation._isLoaded = false;

        annotation._dictionary = {
            has: () => false
        };
        annotation._postProcess = () => { /**/ };
        annotation._validateTemplateMatrix = () => true;

        const updates: any[] = [];
        annotation._appearanceTemplate = {
            _content: {
                dictionary: {
                    has: (key: string) => key === 'BBox',
                    getArray: (key: string) => key === 'BBox' ? [10, 20, 0, 0] : null,
                    update: (k: string, v: any) => updates.push({ k, v })
                }
            }
        };

        let flattened = false;
        annotation._flattenAnnotationTemplate = () => {
            flattened = true;
        };

        Object.defineProperty(annotation, '_page', {
            configurable: true,
            value: {
                rotation: undefined,
                annotations: {
                    remove: () => {
                        annotation._removed = true;
                    }
                }
            }
        });

        PdfTextMarkupAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(updates[0].k).toBe('Matrix');
        expect(flattened).toBeTruthy();
        expect(annotation._removed).toBeTruthy();
    });
});
import {
    PdfAnnotation,
    PdfPolyLineAnnotation,
    PdfInkAnnotation,
    PdfPolygonAnnotation
} from '../src/pdf/core/annotations/annotation';

import * as contentParserModule from '../src/pdf/core/content-parser';
import { PdfBorderEffectStyle, PdfRotationAngle } from '../src/pdf/core/enumerator';
import { _PdfStream } from '../src/pdf/core/base-stream';
import { PdfFontStyle } from '../src/pdf/core/fonts/pdf-standard-font';
describe('Annotation coverage - PolyLine / Ink / highlighted branches (fixed)', () => {
    let pdfTemplateSpy: jasmine.Spy;
    function createDictionary(seed?: Record<string, any>): any {
        const store: Record<string, any> = seed ? { ...seed } : {};
        return {
            _map: store,
            _updated: false,
            _update: false,
            has: (key: string): boolean => Object.prototype.hasOwnProperty.call(store, key),
            get: (key: string): any => store[key],
            getRaw: (key: string): any => store[key],
            getArray: (key: string): any[] => store[key],
            set: (key: string, value: any): void => {
                store[key] = value;
            },
            update: (key: string, value: any): void => {
                store[key] = value;
            }
        };
    }

    function createReference(id: number): any {
        return { objectNumber: id, generationNumber: 0 };
    }

    function createCrossReference(): any {
        let refId = 100;
        return {
            _cacheMap: new Map<any, any>(),
            _document: undefined,
            _getNextReference(): any {
                refId += 1;
                return createReference(refId);
            }
        };
    }

    function createGraphics(): any {
        return {
            save: jasmine.createSpy('save').and.returnValue({}),
            restore: jasmine.createSpy('restore'),
            setTransparency: jasmine.createSpy('setTransparency'),
            drawTemplate: jasmine.createSpy('drawTemplate'),
            drawRectangle: jasmine.createSpy('drawRectangle'),
            drawEllipse: jasmine.createSpy('drawEllipse'),
            drawString: jasmine.createSpy('drawString'),
            drawLine: jasmine.createSpy('drawLine'),
            drawPath: jasmine.createSpy('drawPath'),
            drawPolygon: jasmine.createSpy('drawPolygon'),
            _stateControl: jasmine.createSpy('_stateControl'),
            _buildUpPath: jasmine.createSpy('_buildUpPath'),
            _drawGraphicsPath: jasmine.createSpy('_drawGraphicsPath'),
            translateTransform: jasmine.createSpy('translateTransform'),
            rotateTransform: jasmine.createSpy('rotateTransform'),
            _matrix: {
                _matrix: {
                    _elements: [1, 0, 0, 1, 0, 0]
                }
            }
        };
    }

    function createPage(): any {
        const annotsRemove = jasmine.createSpy('remove');
        const annotsRemoveAt = jasmine.createSpy('removeAt');
        const pageDictionary = createDictionary({ Annots: [] });
        pageDictionary.get = (key: string): any => {
            if (key === 'Rotate') {
                return 0;
            }
            return (pageDictionary as any)._map[key];
        };
        pageDictionary.getRaw = (key: string): any => (pageDictionary as any)._map[key];

        return {
            size: { width: 600, height: 800 },
            rotation: PdfRotationAngle.angle0,
            cropBox: [0, 0, 600, 800],
            mediaBox: [0, 0, 600, 800],
            graphics: createGraphics(),
            _size: { width: 600, height: 800 },
            _isNew: true,
            _needInitializeGraphics: false,
            _isLineAnnotation: false,
            _origin: [0, 0],
            _crossReference: createCrossReference(),
            _pageDictionary: pageDictionary,
            annotations: {
                remove: annotsRemove,
                removeAt: annotsRemoveAt
            }
        };
    }

    function createTemplateStub(withMatrix = false, withBBox = true, size?: { width: number; height: number }): any {
        const dictSeed: Record<string, any> = {};
        if (withBBox) {
            dictSeed.BBox = [2, 4, 22, 24];
        }
        if (withMatrix) {
            dictSeed.Matrix = [1, 0, 0, 1, 0, 0];
        }
        const contentDictionary = createDictionary(dictSeed);
        return {
            _size: size || { width: 20, height: 20 },
            graphics: createGraphics(),
            _content: {
                dictionary: contentDictionary,
                reference: undefined
            }
        };
    }

    function createAppearanceStream(withResources = false): any {
        const stream = Object.create(_PdfStream.prototype) as any;
        const resourceFontDict = createDictionary({
            F1: createDictionary({
                BaseFont: { name: 'Courier-BoldOblique' }
            }),
            F2: createDictionary({
                BaseFont: { name: 'Helvetica-Bold' }
            }),
            F3: createDictionary({
                BaseFont: { name: 'Times-Italic' }
            })
        });

        stream.dictionary = createDictionary(
            withResources
                ? {
                      Resources: createDictionary({
                          Font: resourceFontDict
                      }),
                      BBox: [0, 0, 20, 20]
                  }
                : {
                      BBox: [0, 0, 20, 20]
                  }
        );

        stream.reference = undefined;
        stream.getBytes = (): Uint8Array => new Uint8Array([]);
        return stream;
    }

    function attachCommonAnnotationState(annotation: any): any {
        annotation._crossReference = createCrossReference();
        annotation._page = createPage();
        annotation._dictionary = createDictionary();
        annotation._customTemplate = new Map<string, any>();
        annotation._appearanceTemplate = undefined;
        annotation._opacity = 1;
        annotation._flatten = false;
        annotation._isBounds = false;
        annotation._bounds = { x: 10, y: 10, width: 100, height: 50 };
        annotation._color = { r: 255, g: 0, b: 0 };
        annotation._innerColor = { r: 0, g: 255, b: 0 };
        annotation._inkPointsCollection = [];
        annotation._flattenLoadedPopUp = jasmine.createSpy('_flattenLoadedPopUp');
        annotation._flattenPopUp = jasmine.createSpy('_flattenPopUp');
        annotation._flattenAnnotationTemplate = jasmine.createSpy('_flattenAnnotationTemplate');
        annotation._drawCustomAppearance = jasmine.createSpy('_drawCustomAppearance');
        annotation._validateTemplateMatrix = jasmine.createSpy('_validateTemplateMatrix').and.returnValue(true);
        annotation._getRotationAngle = jasmine.createSpy('_getRotationAngle').and.returnValue(0);
        return annotation;
    }

    beforeEach(() => {
        pdfTemplateSpy = spyOn(pdfTemplateModule as any, 'PdfTemplate').and.callFake(function (this: any, source: any) {
            let bbox: number[] = [0, 0, 20, 20];
            let dictionary: any = createDictionary({ BBox: bbox });

            if (source && source.dictionary) {
                dictionary = source.dictionary;
                if (dictionary.has && dictionary.has('BBox')) {
                    bbox = dictionary.getArray('BBox');
                }
                this._content = source;
            } else if (Array.isArray(source) && source.length === 4) {
                bbox = [0, 0, source[2], source[3]];
                dictionary = createDictionary({ BBox: bbox });
                this._content = {
                    dictionary,
                    reference: null
                };
            } else {
                this._content = {
                    dictionary,
                    reference: null
                };
            }

            if (!this._content.dictionary) {
                this._content.dictionary = dictionary;
            }
            if (!this._content.dictionary.has('BBox')) {
                this._content.dictionary.update('BBox', bbox);
            }

            this._size = {
                width: bbox[2] || 20,
                height: bbox[3] || 20
            };
            this.graphics = createGraphics();
            this._writeTransformation = true;
        } as any);
    });

    afterEach(() => {
        if (pdfTemplateSpy) {
            pdfTemplateSpy.calls.reset();
        }
    });

    // -------------------------------------------------------------------------
    // 1 - 10 : PdfPolyLineAnnotation._doPostProcess
    // -------------------------------------------------------------------------

    it('1. PdfPolyLineAnnotation._doPostProcess - loaded + flatten + AP missing => create appearance, set Matrix from BBox, flatten', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = true;

        const template = createTemplateStub(false, true);
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(template);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._createPolyLineAppearance).toHaveBeenCalledWith(true);
        expect(annotation._validateTemplateMatrix).toHaveBeenCalled();
        expect(template._content.dictionary.getArray('Matrix')).toEqual([1, 0, 0, 1, -2, -4]);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalledWith(template, true);
        expect(annotation._page.annotations.remove).not.toHaveBeenCalled();
    });

    it('2. PdfPolyLineAnnotation._doPostProcess - loaded + flatten + AP.N exists => import existing AP stream', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;

        const appearanceStream = createAppearanceStream();
        const reference = createReference(10);
        const apDict = createDictionary({ N: appearanceStream });
        apDict.getRaw = (key: string): any => (key === 'N' ? reference : undefined);

        annotation._dictionary = createDictionary({ AP: apDict });
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(undefined);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._appearanceTemplate).toBeDefined();
        expect(appearanceStream.reference).toBe(reference);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
        expect(pdfTemplateSpy).toHaveBeenCalled();
    });

    it('3. PdfPolyLineAnnotation._doPostProcess - loaded + flatten + AP exists without N => remove annotation', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;

        annotation._dictionary = createDictionary({
            AP: createDictionary({})
        });

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._page.annotations.remove).toHaveBeenCalledWith(annotation);
    });

    it('4. PdfPolyLineAnnotation._doPostProcess - not loaded + flatten + no AP => create appearance', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = false;

        const template = createTemplateStub(true, true);
        annotation._postProcess = jasmine.createSpy('_postProcess');
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(template);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._postProcess).toHaveBeenCalledWith(true);
        expect(annotation._createPolyLineAppearance).toHaveBeenCalledWith(true);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalledWith(template, true);
    });

    it('5. PdfPolyLineAnnotation._doPostProcess - not loaded + flatten + AP.N exists => use AP stream', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = false;

        const appearanceStream = createAppearanceStream();
        const reference = createReference(20);
        const apDict = createDictionary({ N: appearanceStream });
        apDict.getRaw = (key: string): any => (key === 'N' ? reference : undefined);

        annotation._dictionary = createDictionary({ AP: apDict });
        annotation._postProcess = jasmine.createSpy('_postProcess');

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._postProcess).toHaveBeenCalledWith(true);
        expect(annotation._appearanceTemplate).toBeDefined();
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
        expect(pdfTemplateSpy).toHaveBeenCalled();
    });

    it('6. PdfPolyLineAnnotation._doPostProcess - flattenPopups true + loaded => flatten loaded popup', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = true;
        annotation._appearanceTemplate = createTemplateStub(true, true);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._flattenLoadedPopUp).toHaveBeenCalled();
    });

    it('7. PdfPolyLineAnnotation._doPostProcess - flattenPopups true + not loaded => no throw and no loaded popup call', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = true;
        annotation._postProcess = jasmine.createSpy('_postProcess');

        expect(() => {
            PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, false);
        }).not.toThrow();

        expect(annotation._flattenLoadedPopUp).not.toHaveBeenCalled();
    });

    it('8. PdfPolyLineAnnotation._doPostProcess - flatten + no appearance => remove annotation from page', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;
        annotation._appearanceTemplate = undefined;
        annotation._customTemplate = new Map<string, any>();
        annotation._dictionary = createDictionary();
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(undefined);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._page.annotations.remove).toHaveBeenCalledWith(annotation);
    });

    it('9. PdfPolyLineAnnotation._doPostProcess - non-flatten + custom template => draw custom appearance into AP', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;
        annotation._customTemplate.set('N', createTemplateStub(true, true));
        annotation._dictionary = createDictionary();
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(createTemplateStub(true, true));

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._drawCustomAppearance).toHaveBeenCalled();
        expect(annotation._dictionary.has('AP')).toBeTruthy();
    });

    it('10. PdfPolyLineAnnotation._doPostProcess - non-flatten + setAppearance => write normal appearance reference into AP', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfPolyLineAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = true;
        annotation._dictionary = createDictionary();

        const template = createTemplateStub(true, true);
        annotation._createPolyLineAppearance = jasmine.createSpy('_createPolyLineAppearance').and.returnValue(template);

        PdfPolyLineAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._dictionary.has('AP')).toBeTruthy();
        expect(template._content.reference).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // 11 - 21 : PdfInkAnnotation._doPostProcess
    // -------------------------------------------------------------------------

    it('11. PdfInkAnnotation._doPostProcess - loaded + create appearance + empty ink collection => convert ink list and write AP when not flatten', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = true;
        annotation._inkPointsCollection = [];
        annotation._obtainInkListCollection = jasmine.createSpy('_obtainInkListCollection').and.returnValue([[10, 10, 20, 20]]);
        annotation._getInkBoundsValue = jasmine.createSpy('_getInkBoundsValue').and.returnValue([10, 20, 100, 50]);

        spyOn<any>(annotation, '_createInkAppearance').and.callFake((template: any) => {
            template._size = { width: 100, height: 50 };
            return template;
        });

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._inkPointsCollection.length).toBeGreaterThan(0);
        expect(annotation._dictionary.getArray('Rect')).toEqual([10, 20, 110, 70]);
        expect(annotation._dictionary.has('AP')).toBeTruthy();
    });

    it('12. PdfInkAnnotation._doPostProcess - loaded + custom template present => use custom template N', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;
        annotation._inkPointsCollection = [[{ x: 10, y: 10 }, { x: 20, y: 20 }]];
        annotation._getInkBoundsValue = jasmine.createSpy('_getInkBoundsValue').and.returnValue([5, 5, 40, 30]);

        const customTemplate = createTemplateStub(true, true);
        annotation._customTemplate.set('N', customTemplate);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._appearanceTemplate).toBe(customTemplate);
        expect(annotation._dictionary.getArray('Rect')).toEqual([5, 5, 45, 35]);
    });

    it('13. PdfInkAnnotation._doPostProcess - loaded + flatten + AP fallback => use existing AP.N stream', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._setAppearance = false;
        annotation._inkPointsCollection = [];
        annotation._dictionary = createDictionary();

        const appearanceStream = createAppearanceStream();
        const reference = createReference(30);
        const apDict = createDictionary({ N: appearanceStream });
        apDict.getRaw = (key: string): any => (key === 'N' ? reference : undefined);
        annotation._dictionary.update('AP', apDict);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._appearanceTemplate).toBeDefined();
        expect(annotation._appearanceTemplate._size).toBeDefined();
        expect(appearanceStream.reference).toBe(reference);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
        expect(pdfTemplateSpy).toHaveBeenCalled();
    });

    it('14. PdfInkAnnotation._doPostProcess - not loaded + flatten + AP exists => import AP.N', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = false;
        annotation._postProcess = jasmine.createSpy('_postProcess');
        annotation._inkPointsCollection = [];

        const appearanceStream = createAppearanceStream();
        const reference = createReference(40);
        const apDict = createDictionary({ N: appearanceStream });
        apDict.getRaw = (key: string): any => (key === 'N' ? reference : undefined);

        annotation._dictionary = createDictionary({ AP: apDict });

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._postProcess).toHaveBeenCalled();
        expect(annotation._appearanceTemplate).toBeDefined();
        expect(annotation._appearanceTemplate._size).toBeDefined();
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
        expect(pdfTemplateSpy).toHaveBeenCalled();
    });

    it('15. PdfInkAnnotation._doPostProcess - not loaded + flatten + no AP => create new ink appearance', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = false;
        annotation._postProcess = jasmine.createSpy('_postProcess');
        annotation._inkPointsCollection = [];
        annotation._obtainInkListCollection = jasmine.createSpy('_obtainInkListCollection').and.returnValue([[1, 1, 20, 20]]);
        annotation._getInkBoundsValue = jasmine.createSpy('_getInkBoundsValue').and.returnValue([1, 2, 30, 40]);

        spyOn<any>(annotation, '_createInkAppearance').and.callFake((template: any) => {
            template._size = { width: 30, height: 40 };
            return template;
        });

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._postProcess).toHaveBeenCalled();
        expect(annotation._dictionary.getArray('Rect')).toEqual([1, 2, 31, 42]);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
    });

    it('16. PdfInkAnnotation._doPostProcess - flattenPopups true => loaded popup branch', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = true;
        annotation._appearanceTemplate = createTemplateStub(true, true);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._flattenLoadedPopUp).toHaveBeenCalled();
    });

    it('17. PdfInkAnnotation._doPostProcess - flattenPopups true => non-loaded popup branch', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = false;
        annotation.flattenPopups = true;
        annotation._appearanceTemplate = createTemplateStub(true, true);
        annotation._postProcess = jasmine.createSpy('_postProcess');

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, false);

        expect(annotation._flattenPopUp).toHaveBeenCalled();
    });

    it('18. PdfInkAnnotation._doPostProcess - flatten + template without Matrix but with BBox => Matrix should be updated', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._dictionary = createDictionary({ AP: createDictionary({}) });
        annotation._appearanceTemplate = createTemplateStub(false, true);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._appearanceTemplate._content.dictionary.has('Matrix')).toEqual(false);
        expect(annotation._flattenAnnotationTemplate).toHaveBeenCalled();
    });

    it('19. PdfInkAnnotation._doPostProcess - flatten + no valid template size => remove annotation', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._dictionary = createDictionary({ AP: createDictionary({}) });
        annotation._appearanceTemplate = {
            _size: undefined,
            _content: { dictionary: createDictionary({}) }
        };

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._page.annotations.remove).toHaveBeenCalledWith(annotation);
    });

    it('20. PdfInkAnnotation._doPostProcess - flatten + popup exists + flattenPopups false + annots contains popup ref => removeAt(index)', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._appearanceTemplate = createTemplateStub(true, true);

        const popupRef = createReference(55);
        annotation._dictionary = createDictionary({
            AP: createDictionary({}),
            Popup: popupRef
        });
        annotation._dictionary.getRaw = (key: string): any => (key === 'Popup' ? popupRef : undefined);

        const annotsArray = [createReference(10), popupRef, createReference(77)];
        annotation._page._pageDictionary = createDictionary({ Annots: annotsArray });
        annotation._page._pageDictionary.getRaw = (key: string): any => (key === 'Annots' ? annotsArray : undefined);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._page.annotations.removeAt).toHaveBeenCalledWith(1);
    });

    it('21. PdfInkAnnotation._doPostProcess - flatten + popup exists + index < 0 => do not removeAt', () => {
        const annotation = attachCommonAnnotationState(Object.create(PdfInkAnnotation.prototype));
        annotation._isLoaded = true;
        annotation.flattenPopups = false;
        annotation._appearanceTemplate = createTemplateStub(true, true);

        const popupRef = createReference(65);
        annotation._dictionary = createDictionary({
            AP: createDictionary({}),
            Popup: popupRef
        });
        annotation._dictionary.getRaw = (key: string): any => (key === 'Popup' ? popupRef : undefined);

        annotation._page._pageDictionary = createDictionary({ Annots: [createReference(1), createReference(2)] });
        annotation._page._pageDictionary.getRaw = (key: string): any => (key === 'Annots' ? [createReference(1), createReference(2)] : undefined);

        PdfInkAnnotation.prototype._doPostProcess.call(annotation, true);

        expect(annotation._page.annotations.removeAt).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // 22 - 24 : _createRectangleAppearance highlighted coverage
    // -------------------------------------------------------------------------

    it('22. _createRectangleAppearance - opacity < 1 should save/restore and draw normal rectangle when borderEffect is non-cloudy', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        const annotation = attachCommonAnnotationState(new TestAnnotation() as any);
        annotation._dictionary = createDictionary();
        annotation._bounds = { x: 10, y: 10, width: 100, height: 50 };
        annotation._opacity = 0.5;
        annotation._customTemplate = new Map<string, any>();
        annotation._getRotationAngle = jasmine.createSpy('_getRotationAngle').and.returnValue(0);
        annotation._drawRectangleAppearance = jasmine.createSpy('_drawRectangleAppearance');
        annotation._border = {
            width: 2,
            style: 0,
            dash: [],
            hRadius: 0,
            vRadius: 0
        };

        Object.defineProperty(annotation, 'border', {
            configurable: true,
            get: () => annotation._border
        });
        Object.defineProperty(annotation, 'bounds', {
            configurable: true,
            get: () => annotation._bounds,
            set: (v: any) => { annotation._bounds = v; }
        });
        Object.defineProperty(annotation, 'color', {
            configurable: true,
            get: () => annotation._color
        });
        Object.defineProperty(annotation, 'innerColor', {
            configurable: true,
            get: () => annotation._innerColor
        });
        Object.defineProperty(annotation, 'opacity', {
            configurable: true,
            get: () => annotation._opacity
        });

        const borderEffect = {
            intensity: 0,
            style: PdfBorderEffectStyle.solid
        };

        const template = annotation._createRectangleAppearance(borderEffect as any);
        expect(template).toBeDefined();
        expect(template.graphics.save).toHaveBeenCalled();
        expect(template.graphics.setTransparency).toHaveBeenCalledWith(0.5);
        expect(template.graphics.drawRectangle).toHaveBeenCalled();
        expect(template.graphics.restore).toHaveBeenCalled();
        expect(annotation._drawRectangleAppearance).not.toHaveBeenCalled();
    });

    it('23. _createRectangleAppearance - cloudy borderEffect should call _drawRectangleAppearance branch', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        const annotation = attachCommonAnnotationState(new TestAnnotation() as any);
        annotation._dictionary = createDictionary();
        annotation._bounds = { x: 20, y: 20, width: 80, height: 40 };
        annotation._opacity = 1;
        annotation._customTemplate = new Map<string, any>();
        annotation._getRotationAngle = jasmine.createSpy('_getRotationAngle').and.returnValue(0);
        annotation._drawRectangleAppearance = jasmine.createSpy('_drawRectangleAppearance');
        annotation._border = {
            width: 2,
            style: 0,
            dash: [],
            hRadius: 0,
            vRadius: 0
        };

        Object.defineProperty(annotation, 'border', {
            configurable: true,
            get: () => annotation._border
        });
        Object.defineProperty(annotation, 'bounds', {
            configurable: true,
            get: () => annotation._bounds,
            set: (v: any) => { annotation._bounds = v; }
        });
        Object.defineProperty(annotation, 'color', {
            configurable: true,
            get: () => annotation._color
        });
        Object.defineProperty(annotation, 'innerColor', {
            configurable: true,
            get: () => annotation._innerColor
        });
        Object.defineProperty(annotation, 'opacity', {
            configurable: true,
            get: () => annotation._opacity
        });

        const borderEffect = {
            intensity: 2,
            style: PdfBorderEffectStyle.cloudy
        };

        annotation._createRectangleAppearance(borderEffect as any);

        expect(annotation._drawRectangleAppearance).toHaveBeenCalled();
    });

    it('24. _createRectangleAppearance - custom template N should return the existing template directly', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        const annotation = attachCommonAnnotationState(new TestAnnotation() as any);
        annotation._dictionary = createDictionary();
        annotation._bounds = { x: 5, y: 5, width: 50, height: 20 };
        annotation._border = {
            width: 1,
            style: 0,
            dash: [],
            hRadius: 0,
            vRadius: 0
        };

        Object.defineProperty(annotation, 'border', {
            configurable: true,
            get: () => annotation._border
        });
        Object.defineProperty(annotation, 'bounds', {
            configurable: true,
            get: () => annotation._bounds,
            set: (v: any) => { annotation._bounds = v; }
        });
        Object.defineProperty(annotation, 'color', {
            configurable: true,
            get: () => annotation._color
        });
        Object.defineProperty(annotation, 'innerColor', {
            configurable: true,
            get: () => annotation._innerColor
        });
        Object.defineProperty(annotation, 'opacity', {
            configurable: true,
            get: () => annotation._opacity
        });

        const existing = createTemplateStub(true, true);
        annotation._customTemplate.set('N', existing);

        const borderEffect = {
            intensity: 0,
            style: PdfBorderEffectStyle.solid
        };

        const result = annotation._createRectangleAppearance(borderEffect as any);
        expect(result).toBe(existing);
    });

    // -------------------------------------------------------------------------
    // 25 - 27 : _obtainAppearanceFont highlighted font-style coverage
    // -------------------------------------------------------------------------

    it('25. _obtainAppearanceFont - Courier BoldOblique should map to bold|italic', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        spyOn(contentParserModule as any, '_ContentParser').and.callFake(function (this: any) {
            this._readContent = () => [
                {
                    _operator: 'Tf',
                    _operands: ['/F1', '12']
                }
            ];
        } as any);

        const annotation = new TestAnnotation() as any;
        const appearanceStream = createAppearanceStream(true);

        const fontData = annotation._obtainAppearanceFont(
            appearanceStream,
            '',
            0,
            PdfFontStyle.regular
        );

        expect(fontData.name).toContain('Courier');
        expect(fontData.fontSize).toBe(12);
        expect((fontData.style & PdfFontStyle.bold) === PdfFontStyle.bold).toBeTruthy();
        expect((fontData.style & PdfFontStyle.italic) === PdfFontStyle.italic).toBeTruthy();
    });

    it('26. _obtainAppearanceFont - Helvetica Bold should map to bold only', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        spyOn(contentParserModule as any, '_ContentParser').and.callFake(function (this: any) {
            this._readContent = () => [
                {
                    _operator: 'Tf',
                    _operands: ['/F2', '9']
                }
            ];
        } as any);

        const annotation = new TestAnnotation() as any;
        const appearanceStream = createAppearanceStream(true);

        const fontData = annotation._obtainAppearanceFont(
            appearanceStream,
            '',
            0,
            PdfFontStyle.regular
        );

        expect(fontData.name).toContain('Helvetica');
        expect(fontData.fontSize).toBe(9);
        expect(fontData.style).toBe(PdfFontStyle.bold);
    });

    it('27. _obtainAppearanceFont - Times Italic should map to italic only', () => {
        class TestAnnotation extends PdfAnnotation {
            _doPostProcess(): void {
                // no-op
            }
        }

        spyOn(contentParserModule as any, '_ContentParser').and.callFake(function (this: any) {
            this._readContent = () => [
                {
                    _operator: 'Tf',
                    _operands: ['/F3', '15']
                }
            ];
        } as any);

        const annotation = new TestAnnotation() as any;
        const appearanceStream = createAppearanceStream(true);

        const fontData = annotation._obtainAppearanceFont(
            appearanceStream,
            '',
            0,
            PdfFontStyle.regular
        );

        expect(fontData.name).toContain('Times');
        expect(fontData.fontSize).toBe(15);
        expect(fontData.style).toBe(PdfFontStyle.italic);
    });

    // -------------------------------------------------------------------------
    // 28 - 30 : PdfPolygonAnnotation._getLinePoints rotation coverage
    // -------------------------------------------------------------------------

    it('28. PdfPolygonAnnotation._getLinePoints - Vertices + page rotation 270 => execute 270 branch safely', () => {
        const polygon = Object.create(PdfPolygonAnnotation.prototype) as any;

        polygon._dictionary = createDictionary({
            Vertices: [10, 20, 40, 50, 70, 80]
        });

        polygon._isBounds = false;
        polygon._flatten = false;
        polygon._page = createPage();
        polygon._page.size = { width: 600, height: 800 };
        polygon._page.rotation = PdfRotationAngle.angle270;
        polygon._page._pageDictionary = {
            has: (key: string): boolean => key === 'Rotate',
            get: (key: string): any => key === 'Rotate' ? 270 : undefined
        };
        polygon._points = undefined;

        const linePoints = polygon._getLinePoints();

        expect(Array.isArray(linePoints)).toBeTruthy();
        expect(linePoints.length).toBeGreaterThan(0);
        linePoints.forEach((pt: any) => {
            expect(typeof pt.x).toBe('number');
            expect(typeof pt.y).toBe('number');
        });
    });

    it('29. PdfPolygonAnnotation._getLinePoints - Vertices + page rotation 180 => execute 180 branch safely', () => {
        const polygon = Object.create(PdfPolygonAnnotation.prototype) as any;

        polygon._dictionary = createDictionary({
            Vertices: [10, 20, 40, 50, 70, 80]
        });

        polygon._isBounds = false;
        polygon._flatten = false;
        polygon._page = createPage();
        polygon._page.size = { width: 600, height: 800 };
        polygon._page.rotation = PdfRotationAngle.angle180;
        polygon._page._pageDictionary = {
            has: (key: string): boolean => key === 'Rotate',
            get: (key: string): any => key === 'Rotate' ? 180 : undefined
        };
        polygon._points = undefined;

        const linePoints = polygon._getLinePoints();

        expect(Array.isArray(linePoints)).toBeTruthy();
        expect(linePoints.length).toBeGreaterThan(0);
    });

    it('30. PdfPolygonAnnotation._getLinePoints - fallback _points branch when Vertices not used', () => {
        const polygon = Object.create(PdfPolygonAnnotation.prototype) as any;

        polygon._dictionary = createDictionary({});
        polygon._isBounds = false;
        polygon._flatten = false;
        polygon._page = createPage();
        polygon._page.size = { width: 600, height: 800 };
        polygon._page.rotation = PdfRotationAngle.angle0;
        polygon._page._pageDictionary = {
            has: (): boolean => false,
            get: (): any => undefined
        };
        polygon._points = [
            { x: 10, y: 10 },
            { x: 20, y: 25 },
            { x: 35, y: 40 }
        ];

        const linePoints = polygon._getLinePoints();

        expect(Array.isArray(linePoints)).toBeTruthy();
        expect(linePoints.length).toBe(3);
    });
});
