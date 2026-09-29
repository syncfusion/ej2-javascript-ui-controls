import { PdfUriAnnotation } from "../src/pdf/core/annotations/annotation";
import { _PdfStream } from "../src/pdf/core/base-stream";
import { DataFormat, PdfPageOrientation, PdfRotationAngle } from "../src/pdf/core/enumerator";
import { _PdfFlateStream } from "../src/pdf/core/flate-stream";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat } from "../src/pdf/core/fonts/pdf-string-format";
import { PdfGraphics, PdfPen } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfPageTemplateElement } from "../src/pdf/core/graphics/pdf-page-template-element";
import { PdfAnnotationExportSettings, PdfDocument, PdfDocumentSplitEventArgs, PdfFormFieldExportSettings, PdfMargins, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { _PdfNamedDestinationCollection } from "../src/pdf/core/pdf-outline";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfPageImportOptions } from "../src/pdf/core/pdf-page-import-options";
import { _PdfDictionary, _PdfName } from "../src/pdf/core/pdf-primitives";
import { PdfDocumentTemplate, Rectangle } from "../src/pdf/core/pdf-type";
describe('1041642 PdfDocument _doPostProcessOnFormFields', () => {
    it('1041642 uses false as default flatten value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        let receivedFlattenValue: boolean | undefined;
        document._catalog._catalogDictionary.update(
            'AcroForm',
            form._dictionary
        );
        form._requiresPostProcessing = true;
        form._doPostProcess = (
            isFlatten: boolean
        ): void => {
            receivedFlattenValue = isFlatten;
        };
        internalDocument._doPostProcessOnFormFields();
        form._doPostProcess =
            originalPostProcess;
        expect(receivedFlattenValue).toBe(false);
        expect(form._requiresPostProcessing).toBeFalsy();
        expect(form._doPostProcess).toBe(
            originalPostProcess
        );
        document.destroy();
    });
    it('1041642 marks newly created flattened form dictionary as updated', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        const originalClear: any =
            form._clear;
        let clearCallCount: number = 0;
        document._catalog._catalogDictionary.update(
            'AcroForm',
            form._dictionary
        );
        form._doPostProcess =
            (_isFlatten: boolean): void => {
                return;
            };
        form._clear = (): void => {
            clearCallCount++;
        };
        internalDocument._doPostProcessOnFormFields(
            true
        );
        const flattenedDictionary: _PdfDictionary =
            form._dictionary;
        form._doPostProcess =
            originalPostProcess;
        form._clear =
            originalClear;
        expect(flattenedDictionary).toBeDefined();
        expect(
            flattenedDictionary instanceof _PdfDictionary
        ).toBeTruthy();
        expect(flattenedDictionary._updated).toBeTruthy();
        expect(
            document._crossReference._allowCatalog
        ).toBeTruthy();
        expect(clearCallCount).toBe(1);
        document.destroy();
    });
    it('1041642 disables form post-processing requirement after processing', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        document._catalog._catalogDictionary.update(
            'AcroForm',
            form._dictionary
        );
        form._requiresPostProcessing = true;
        form._doPostProcess =
            (_isFlatten: boolean): void => {
                return;
            };
        internalDocument._doPostProcessOnFormFields(
            false
        );
        form._doPostProcess =
            originalPostProcess;
        expect(form._requiresPostProcessing).toBeFalsy();
        document.destroy();
    });
    it('1041642 keeps NeedAppearances unchanged when dictionary does not contain it', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        const formDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        document._catalog._catalogDictionary.update(
            'AcroForm',
            formDictionary
        );
        form._dictionary =
            formDictionary;
        form._isDefaultAppearance =
            false;
        form._isNeedAppearances =
            true;
        form._doPostProcess =
            (_isFlatten: boolean): void => {
                return;
            };
        internalDocument._doPostProcessOnFormFields(
            false
        );
        form._doPostProcess =
            originalPostProcess;
        expect(
            formDictionary.has('NeedAppearances')
        ).toBeFalsy();
        document.destroy();
    });
    it('1041642 sets NeedAppearances to false when required', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        const formDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        formDictionary.update(
            'NeedAppearances',
            true
        );
        document._catalog._catalogDictionary.update(
            'AcroForm',
            formDictionary
        );
        form._dictionary =
            formDictionary;
        form._isDefaultAppearance =
            false;
        form._isNeedAppearances =
            true;
        form._doPostProcess =
            (_isFlatten: boolean): void => {
                return;
            };
        internalDocument._doPostProcessOnFormFields(
            false
        );
        form._doPostProcess =
            originalPostProcess;
        expect(
            formDictionary.get('NeedAppearances')
        ).toBeFalsy();
        document.destroy();
    });
    it('1041642 uses form NeedAppearances value when appearance is not required', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const form: any = document.form;
        const originalPostProcess: any =
            form._doPostProcess;
        const formDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        formDictionary.update(
            'NeedAppearances',
            true
        );
        document._catalog._catalogDictionary.update(
            'AcroForm',
            formDictionary
        );
        form._dictionary =
            formDictionary;
        form._isDefaultAppearance =
            false;
        form._isNeedAppearances =
            false;
        form._doPostProcess =
            (_isFlatten: boolean): void => {
                return;
            };
        internalDocument._doPostProcessOnFormFields(
            false
        );
        form._doPostProcess =
            originalPostProcess;
        expect(
            formDictionary.get('NeedAppearances')
        ).toBe(form.needAppearances);
        document.destroy();
    });
});
describe('1041642 PdfDocument _doPostProcessOnAnnotations', () => {
    it('1041642 uses false as default annotation flatten value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetPage: any =
            document.getPage;
        const originalPageCount: number =
            internalDocument._pageCount;
        let receivedFlattenValue: boolean | undefined;
        let clearCallCount: number = 0;
        const pageDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const annotations: any = {
            _isExport: false,
            _doPostProcess: (
                isFlatten: boolean
            ): void => {
                receivedFlattenValue = isFlatten;
            },
            _clear: (): void => {
                clearCallCount++;
            }
        };
        const fakePage: any = {
            _pageDictionary: pageDictionary,
            annotations
        };
        internalDocument._pageCount = 1;
        document.getPage =
            (_pageIndex: number): PdfPage => {
                return fakePage as PdfPage;
            };
        internalDocument._doPostProcessOnAnnotations();
        document.getPage =
            originalGetPage;
        internalDocument._pageCount =
            originalPageCount;
        expect(receivedFlattenValue).toBe(false);
        expect(clearCallCount).toBe(0);
        expect(document.getPage).toBe(
            originalGetPage
        );
        document.destroy();
    });
    it('1041642 removes Annots and clears annotations when flattened', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetPage: any =
            document.getPage;
        const originalPageCount: number =
            internalDocument._pageCount;
        let receivedFlattenValue: boolean = false;
        let clearCallCount: number = 0;
        const pageDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        pageDictionary.update(
            'Annots',
            []
        );
        pageDictionary._updated = false;
        const annotations: any = {
            _isExport: false,
            _doPostProcess: (
                isFlatten: boolean
            ): void => {
                receivedFlattenValue = isFlatten;
            },
            _clear: (): void => {
                clearCallCount++;
            }
        };
        const fakePage: any = {
            _pageDictionary: pageDictionary,
            annotations
        };
        internalDocument._pageCount = 1;
        internalDocument._isExport = true;
        document.getPage =
            (_pageIndex: number): PdfPage => {
                return fakePage as PdfPage;
            };
        internalDocument._doPostProcessOnAnnotations(
            true
        );
        document.getPage =
            originalGetPage;
        internalDocument._pageCount =
            originalPageCount;
        expect(receivedFlattenValue).toBeTruthy();
        expect(annotations._isExport).toBeTruthy();
        expect(clearCallCount).toBe(1);
        expect(
            pageDictionary.has('Annots')
        ).toBeFalsy();
        expect(pageDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('1041642 does not remove unrelated dictionary entries', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetPage: any =
            document.getPage;
        const originalPageCount: number =
            internalDocument._pageCount;
        let clearCallCount: number = 0;
        const pageDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        pageDictionary.update(
            'Contents',
            'ExistingContents'
        );
        pageDictionary._updated = false;
        const annotations: any = {
            _isExport: false,
            _doPostProcess: (
                _isFlatten: boolean
            ): void => {
                return;
            },
            _clear: (): void => {
                clearCallCount++;
            }
        };
        const fakePage: any = {
            _pageDictionary: pageDictionary,
            annotations
        };
        internalDocument._pageCount = 1;
        document.getPage =
            (_pageIndex: number): PdfPage => {
                return fakePage as PdfPage;
            };
        internalDocument._doPostProcessOnAnnotations(
            true
        );
        document.getPage =
            originalGetPage;
        internalDocument._pageCount =
            originalPageCount;
        expect(clearCallCount).toBe(1);
        expect(
            pageDictionary.has('Annots')
        ).toBeFalsy();
        expect(
            pageDictionary.has('Contents')
        ).toBeTruthy();
        expect(
            pageDictionary.get('Contents')
        ).toBe('ExistingContents');
        expect(pageDictionary._updated).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument _addLincenseWaterMark', () => {
    it('1041642 uses reduced font size for narrow page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let receivedFontSize: number = 0;
        let receivedLastPageValue: boolean | undefined;
        const graphics: any = {
            clientSize: {
                width: 300,
                height: 500
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (): void => {
                return;
            }
        };
        const page: any = {
            size: {
                width: 300,
                height: 500
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage = (
            _page: any,
            font: any,
            _graphics: any,
            isLastPage: boolean
        ): void => {
            receivedFontSize = font.size;
            receivedLastPageValue = isLastPage;
        };
        internalDocument._addLincenseWaterMark(
            page,
            true,
            false
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(receivedFontSize).toBeCloseTo(
            10.5
        );
        expect(receivedLastPageValue).toBeFalsy();
        document.destroy();
    });
    it('1041642 keeps font size fourteen at page width boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let receivedFontSize: number = 0;
        const graphics: any = {
            clientSize: {
                width: 400,
                height: 500
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (): void => {
                return;
            }
        };
        const page: any = {
            size: {
                width: 400,
                height: 500
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage = (
            _page: any,
            font: any
        ): void => {
            receivedFontSize = font.size;
        };
        internalDocument._addLincenseWaterMark(
            page,
            true,
            false
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(receivedFontSize).toBe(14);
        document.destroy();
    });
    it('1041642 draws first-page watermark using false page flag', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let watermarkCallCount: number = 0;
        let receivedFlag: boolean | undefined;
        const graphics: any = {
            clientSize: {
                width: 600,
                height: 800
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (): void => {
                return;
            }
        };
        const page: any = {
            size: {
                width: 600,
                height: 800
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage = (
            _page: any,
            _font: any,
            _graphics: any,
            flag: boolean
        ): void => {
            watermarkCallCount++;
            receivedFlag = flag;
        };
        internalDocument._addLincenseWaterMark(
            page,
            true,
            true
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(watermarkCallCount).toBe(1);
        expect(receivedFlag).toBeFalsy();
        document.destroy();
    });
    it('1041642 draws last-page watermark using true page flag', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let watermarkCallCount: number = 0;
        let receivedFlag: boolean | undefined;
        const graphics: any = {
            clientSize: {
                width: 600,
                height: 800
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (): void => {
                return;
            }
        };
        const page: any = {
            size: {
                width: 600,
                height: 800
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage = (
            _page: any,
            _font: any,
            _graphics: any,
            flag: boolean
        ): void => {
            watermarkCallCount++;
            receivedFlag = flag;
        };
        internalDocument._addLincenseWaterMark(
            page,
            false,
            true
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(watermarkCallCount).toBe(1);
        expect(receivedFlag).toBeTruthy();
        document.destroy();
    });
    it('1041642 does not draw page-edge watermark when page is neither first nor last', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let watermarkCallCount: number = 0;
        const graphics: any = {
            clientSize: {
                width: 600,
                height: 800
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (): void => {
                return;
            }
        };
        const page: any = {
            size: {
                width: 600,
                height: 800
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage =
            (): void => {
                watermarkCallCount++;
            };
        internalDocument._addLincenseWaterMark(
            page,
            false,
            false
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(watermarkCallCount).toBe(0);
        document.destroy();
    });
    it('1041642 draws diagonal watermark using centered negative bounds', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalDrawWatermark: any =
            internalDocument._drawWatermarkOnPage;
        let receivedBounds: any;
        let receivedFont: any;
        const graphics: any = {
            clientSize: {
                width: 600,
                height: 800
            },
            save: (): any => {
                return {};
            },
            restore: (): void => {
                return;
            },
            translateTransform: (): void => {
                return;
            },
            setTransparency: (): void => {
                return;
            },
            rotateTransform: (): void => {
                return;
            },
            drawString: (
                _text: string,
                font: any,
                bounds: any
            ): void => {
                receivedFont = font;
                receivedBounds = bounds;
            }
        };
        const page: any = {
            size: {
                width: 600,
                height: 800
            },
            graphics,
            _isNew: true,
            rotation: PdfRotationAngle.angle0
        };
        internalDocument._drawWatermarkOnPage =
            (): void => {
                return;
            };
        internalDocument._addLincenseWaterMark(
            page,
            false,
            false
        );
        internalDocument._drawWatermarkOnPage =
            originalDrawWatermark;
        expect(receivedFont).toBeDefined();
        expect(receivedBounds).toBeDefined();
        const textSize: any =
            receivedFont.measureString(
                'Created with a trial version of Syncfusion PDF library.',
                600
            );
        const expectedX: number =
            -(textSize.width / 2);
        const expectedY: number =
            -(textSize.height / 4);
        const centerX: number = 300;
        const halfTextWidth: number =
            textSize.width / 2;
        const x1: number =
            centerX - halfTextWidth;
        const expectedWidth: number =
            600 - (x1 + x1);
        expect(receivedBounds.x).toBeCloseTo(
            expectedX
        );
        expect(receivedBounds.y).toBeCloseTo(
            expectedY
        );
        expect(receivedBounds.width).toBeCloseTo(
            expectedWidth
        );
        expect(receivedBounds.height).toBeCloseTo(
            textSize.height
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _drawWatermarkOnPage', () => {
    interface WatermarkResult {
        headerBounds: any;
        linkBounds: any;
        annotation: any;
        rotations: number[];
        saveCallCount: number;
        restoreCallCount: number;
    }
    function executeWatermark(
        document: PdfDocument,
        pageOptions: {
            isNew: boolean;
            rotation: PdfRotationAngle;
            orientation: PdfPageOrientation;
            width: number;
            height: number;
            clientWidth?: number;
            clientHeight?: number;
            isLastPage?: boolean;
        }
    ): WatermarkResult {
        const internalDocument: any =
            document as any;
        const originalAnnotationPostProcess: any =
            PdfUriAnnotation.prototype._doPostProcess;
        const drawCalls: any[] = [];
        const rotations: number[] = [];
        const annotations: any[] = [];
        let saveCallCount: number = 0;
        let restoreCallCount: number = 0;
        const graphics: any = {
            clientSize: {
                width:
                    typeof pageOptions.clientWidth === 'number'
                        ? pageOptions.clientWidth
                        : pageOptions.width,
                height:
                    typeof pageOptions.clientHeight === 'number'
                        ? pageOptions.clientHeight
                        : pageOptions.height
            },
            save: (): any => {
                saveCallCount++;
                return {};
            },
            restore: (): void => {
                restoreCallCount++;
            },
            rotateTransform: (
                angle: number
            ): void => {
                rotations.push(angle);
            },
            drawString: (
                text: string,
                _font: any,
                bounds: any
            ): void => {
                drawCalls.push({
                    text,
                    bounds: {
                        x: bounds.x,
                        y: bounds.y,
                        width: bounds.width,
                        height: bounds.height
                    }
                });
            }
        };
        const page: any = {
            _isNew: pageOptions.isNew,
            rotation: pageOptions.rotation,
            orientation: pageOptions.orientation,
            size: {
                width: pageOptions.width,
                height: pageOptions.height
            },
            graphics,
            annotations: {
                add: (
                    annotation: any
                ): void => {
                    annotations.push(annotation);
                }
            }
        };
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14,
                PdfFontStyle.regular
            );
        PdfUriAnnotation.prototype._doPostProcess =
            function (): void {
                return;
            };
        internalDocument._drawWatermarkOnPage(
            page,
            font,
            graphics,
            pageOptions.isLastPage === true
        );
        PdfUriAnnotation.prototype._doPostProcess =
            originalAnnotationPostProcess;
        expect(drawCalls.length).toBe(2);
        expect(annotations.length).toBe(1);
        expect(
            PdfUriAnnotation.prototype._doPostProcess
        ).toBe(originalAnnotationPostProcess);
        return {
            headerBounds: drawCalls[0].bounds,
            linkBounds: drawCalls[1].bounds,
            annotation: annotations[0],
            rotations,
            saveCallCount,
            restoreCallCount
        };
    }
    function getAnnotationBounds(
        annotation: any
    ): any {
        if (annotation.bounds) {
            return annotation.bounds;
        }
        if (annotation._bounds) {
            return annotation._bounds;
        }
        if (
            annotation._dictionary &&
            annotation._dictionary.has('Rect')
        ) {
            return annotation._dictionary.get('Rect');
        }
        return undefined;
    }
    it('1041642 uses rotated existing-page size for angle 90', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle90,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        /*
         * Existing rotated page size:
         * width = page height - 70 = 630
         */
        expect(
            result.headerBounds.width
        ).toBe(630);
        document.destroy();
    });
    it('1041642 uses rotated existing-page size for angle 270', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle270,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        expect(
            result.headerBounds.width
        ).toBe(630);
        document.destroy();
    });
    it('1041642 does not use rotated existing-page size for angle zero', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        expect(
            result.headerBounds.width
        ).toBe(430);
        document.destroy();
    });
    it('1041642 uses rotated available width for new angle 90 page', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle90,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        expect(result.rotations).toEqual([
            -90
        ]);
        expect(result.saveCallCount).toBe(1);
        expect(result.restoreCallCount).toBe(1);
        /*
         * Angle 90 header bounds are transformed.
         * The width comes from rect.height - xPosition.
         */
        expect(
            result.headerBounds.width
        ).toBe(590);
        document.destroy();
    });
    it('1041642 rotates a new angle 180 page and adjusts bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle180,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        expect(result.rotations).toEqual([
            -180
        ]);
        expect(
            result.headerBounds.x
        ).toBe(-460);
        expect(
            result.headerBounds.y
        ).toBe(-690);
        expect(
            result.headerBounds.width
        ).toBe(390);
        document.destroy();
    });
    it('1041642 rotates a new angle 270 page and adjusts bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle270,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700,
                    clientWidth: 500,
                    clientHeight: 700
                }
            );
        expect(result.rotations).toEqual([
            -270
        ]);
        expect(
            result.headerBounds.x
        ).toBe(40);
        expect(
            result.headerBounds.y
        ).toBe(-490);
        expect(
            result.headerBounds.width
        ).toBe(590);
        document.destroy();
    });
    it('1041642 does not rotate a new angle zero page', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 500,
                    height: 700
                }
            );
        expect(result.rotations.length).toBe(0);
        document.destroy();
    });
    it('1041642 positions last-page watermark above bottom edge', () => {
        const document: PdfDocument =
            new PdfDocument();
        const firstResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800,
                    isLastPage: false
                }
            );
        const lastResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800,
                    isLastPage: true
                }
            );
        expect(
            firstResult.headerBounds.y
        ).toBe(10);
        expect(
            lastResult.headerBounds.y
        ).toBeGreaterThan(
            firstResult.headerBounds.y
        );
        expect(
            lastResult.headerBounds.y
        ).toBeLessThan(800);
        document.destroy();
    });
    it('1041642 uses four line heights for landscape width 420', () => {
        const document: PdfDocument =
            new PdfDocument();
        const standardResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.landscape,
                    width: 500,
                    height: 600,
                    isLastPage: true
                }
            );
        const specialResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.landscape,
                    width: 420,
                    height: 600,
                    isLastPage: true
                }
            );
        expect(
            specialResult.headerBounds.y
        ).toBeLessThan(
            standardResult.headerBounds.y
        );
        document.destroy();
    });
    it('1041642 uses four line heights when page height is 420', () => {
        const document: PdfDocument =
            new PdfDocument();
        const standardResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 500,
                    isLastPage: true
                }
            );
        const specialResult: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 420,
                    isLastPage: true
                }
            );
        expect(
            specialResult.headerBounds.y
        ).toBeLessThan(
            standardResult.headerBounds.y
        );
        document.destroy();
    });
    it('1041642 creates new-page angle zero annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        document.destroy();
    });
    it('1041642 creates new-page angle 90 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle90,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        if (bounds.x !== undefined) {
            expect(bounds.width).toBeGreaterThan(0);
            expect(bounds.height).toBeGreaterThan(0);
        }
        document.destroy();
    });
    it('1041642 creates new-page angle 180 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle180,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        if (bounds.x !== undefined) {
            expect(bounds.x).toBeGreaterThan(0);
            expect(bounds.y).toBeGreaterThan(0);
        }
        document.destroy();
    });
    it('1041642 creates new-page angle 270 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle270,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        if (bounds.x !== undefined) {
            expect(bounds.width).toBeGreaterThan(0);
            expect(bounds.height).toBeGreaterThan(0);
        }
        document.destroy();
    });
    it('1041642 creates existing-page angle 90 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle90,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        document.destroy();
    });
    it('1041642 creates existing-page angle 180 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle180,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        document.destroy();
    });
    it('1041642 creates existing-page angle 270 annotation bounds', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: false,
                    rotation:
                        PdfRotationAngle.angle270,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        const bounds: any =
            getAnnotationBounds(
                result.annotation
            );
        expect(bounds).toBeDefined();
        document.destroy();
    });
    it('1041642 creates Syncfusion URI annotation', () => {
        const document: PdfDocument =
            new PdfDocument();
        const result: WatermarkResult =
            executeWatermark(
                document,
                {
                    isNew: true,
                    rotation:
                        PdfRotationAngle.angle0,
                    orientation:
                        PdfPageOrientation.portrait,
                    width: 600,
                    height: 800
                }
            );
        expect(
            result.annotation instanceof
            PdfUriAnnotation
        ).toBeTruthy();
        const internalAnnotation: any =
            result.annotation as any;
        if (
            typeof internalAnnotation.uri ===
            'string'
        ) {
            expect(
                internalAnnotation.uri
            ).toBe(
                'http://www.syncfusion.com'
            );
        } else if (
            typeof internalAnnotation._uri ===
            'string'
        ) {
            expect(
                internalAnnotation._uri
            ).toBe(
                'http://www.syncfusion.com'
            );
        }
        expect(
            result.annotation.border.width
        ).toBe(0);
        expect(
            result.annotation.border.hRadius
        ).toBe(0);
        expect(
            result.annotation.border.vRadius
        ).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument page import mutation coverage', () => {
    it('1041642 importPageRange rejects start index greater than end index', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const importInvalidRange: Function = (): void => {
            destinationDocument.importPageRange(sourceDocument, 1, 0);
        };
        expect(importInvalidRange).toThrowError(
            'The start index is greater then the end index, which might indicate the error in the program.'
        );
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange rejects start index equal to source page count', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const importOutOfRangePage: Function = (): void => {
            destinationDocument.importPageRange(
                sourceDocument,
                sourceDocument.pageCount,
                sourceDocument.pageCount
            );
        };
        expect(sourceDocument.pageCount).toBe(2);
        expect(importOutOfRangePage).toThrowError(
            'The start index is greater then the end index, which might indicate the error in the program.'
        );
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange rejects start index beyond source page count', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const importOutOfRangePage: Function = (): void => {
            destinationDocument.importPageRange(sourceDocument, 2, 2);
        };
        expect(importOutOfRangePage).toThrowError(
            'The start index is greater then the end index, which might indicate the error in the program.'
        );
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange accepts the complete valid range', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        destinationDocument.importPageRange(sourceDocument, 0, 2);
        expect(sourceDocument.pageCount).toBe(3);
        expect(destinationDocument.pageCount).toBe(3);
        expect(destinationDocument.getPage(0)).toBeDefined();
        expect(destinationDocument.getPage(1)).toBeDefined();
        expect(destinationDocument.getPage(2)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange imports pages from zero start index', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        destinationDocument.importPageRange(sourceDocument, 0, 1);
        expect(sourceDocument.pageCount).toBe(2);
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument.getPage(0)).toBeDefined();
        expect(destinationDocument.getPage(1)).toBeDefined();
        expect(destinationDocument.getPage(0)._pageIndex).toBe(0);
        expect(destinationDocument.getPage(1)._pageIndex).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange rejects target index greater than destination page count', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        sourceDocument.addPage();
        destinationDocument.addPage();
        importOptions.targetIndex = 2;
        const importAtInvalidTarget: Function = (): void => {
            destinationDocument.importPageRange(sourceDocument, 0, 0, importOptions);
        };
        expect(destinationDocument.pageCount).toBe(1);
        expect(importOptions.targetIndex).toBe(2);
        expect(importAtInvalidTarget).toThrowError('The target index is out of range.');
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange accepts target index equal to destination page count', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        sourceDocument.addPage();
        destinationDocument.addPage();
        importOptions.targetIndex = destinationDocument.pageCount;
        destinationDocument.importPageRange(sourceDocument, 0, 0, importOptions);
        expect(destinationDocument.pageCount).toBe(2);
        expect(importOptions.targetIndex).toBe(1);
        expect(destinationDocument._targetIndex).toBe(2);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPageRange inserts multiple pages at the requested target index', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        destinationDocument.addPage();
        destinationDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        importOptions.targetIndex = 1;
        destinationDocument.importPageRange(sourceDocument, 0, 1, importOptions);
        expect(destinationDocument.pageCount).toBe(4);
        expect(destinationDocument._targetIndex).toBe(3);
        expect(destinationDocument.getPage(0)._pageIndex).toBe(0);
        expect(destinationDocument.getPage(1)._pageIndex).toBe(1);
        expect(destinationDocument.getPage(2)._pageIndex).toBe(2);
        expect(destinationDocument.getPage(3)._pageIndex).toBe(3);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages assigns and reuses the source unique identifier', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        expect(sourceDocument._uniqueID).toBeUndefined();
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        const assignedIdentifier: string = sourceDocument._uniqueID;
        expect(assignedIdentifier).toBeDefined();
        expect(assignedIdentifier.length).toBeGreaterThan(0);
        expect(destinationDocument._mergeHelperCache.has(assignedIdentifier)).toBeTruthy();
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(sourceDocument._uniqueID).toBe(assignedIdentifier);
        expect(destinationDocument._mergeHelperCache.size).toBe(1);
        expect(destinationDocument.pageCount).toBe(2);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages processes every page in an inclusive range', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        destinationDocument.importPageRange(sourceDocument, 0, 2);
        expect(destinationDocument.pageCount).toBe(3);
        expect(destinationDocument.getPage(0)).toBeDefined();
        expect(destinationDocument.getPage(1)).toBeDefined();
        expect(destinationDocument.getPage(2)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages imports only the selected inclusive page range', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        destinationDocument.importPageRange(sourceDocument, 1, 2);
        expect(sourceDocument.pageCount).toBe(4);
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument.getPage(0)).toBeDefined();
        expect(destinationDocument.getPage(1)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 duplicate page import resets duplicate state and adds one page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        expect(document._isDuplicatePage).toBeFalsy();
        document.importPage(0);
        expect(document.pageCount).toBe(3);
        expect(document._isDuplicatePage).toBeFalsy();
        expect(document.getPage(2)).toBeDefined();
        document.destroy();
    });
    it('1041642 duplicate page import inserts at target index and increments internal index', () => {
        const document: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        document.addPage();
        document.addPage();
        importOptions.targetIndex = 1;
        document.importPage(0, importOptions);
        expect(document.pageCount).toBe(3);
        expect(document._targetIndex).toBe(2);
        expect(document._isDuplicatePage).toBeFalsy();
        expect(document.getPage(1)._pageIndex).toBe(1);
        document.destroy();
    });
    it('1041642 importPage accepts a PdfPage and source PdfDocument', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = sourceDocument.addPage();
        sourceDocument.addPage();
        destinationDocument.importPage(sourcePage, sourceDocument);
        expect(sourcePage._pageIndex).toBe(0);
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationDocument.getPage(0)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 importPage accepts a PdfPage with target options', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        const sourcePage: PdfPage = sourceDocument.addPage();
        destinationDocument.addPage();
        importOptions.targetIndex = 0;
        destinationDocument.importPage(sourcePage, sourceDocument, importOptions);
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument._targetIndex).toBe(1);
        expect(destinationDocument.getPage(0)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages fixes destinations only for nonduplicate imports', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationDocument._isDuplicatePage).toBeFalsy();
        expect(destinationDocument._mergeHelperCache.size).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
});
describe('1041642 PdfDocument annotation import mutation coverage', () => {
    it('1041642 _importPages preserves annotation dictionary when source is not flattened', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = sourceDocument.addPage();
        const annotation: PdfUriAnnotation = new PdfUriAnnotation(
            { x: 10, y: 10, width: 100, height: 20 },
            'https://www.syncfusion.com'
        );
        sourcePage.annotations.add(annotation);
        sourceDocument.flatten = false;
        expect(sourcePage.annotations.count).toBe(1);
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(sourcePage.annotations.count).toBe(1);
        expect(sourcePage._pageDictionary.has('Annots')).toBeTruthy();
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages removes annotations when the source is flattened', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = sourceDocument.addPage();
        const annotation: PdfUriAnnotation = new PdfUriAnnotation(
            { x: 10, y: 10, width: 100, height: 20 },
            'https://www.syncfusion.com'
        );
        sourcePage.annotations.add(annotation);
        sourceDocument.flatten = true;
        expect(sourcePage.annotations.count).toBe(1);
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(sourcePage.annotations.count).toBe(0);
        expect(sourcePage._pageDictionary.has('Annots')).toBeFalsy();
        expect(sourcePage._pageDictionary._updated).toBeTruthy();
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages handles a source page without annotations', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = sourceDocument.addPage();
        expect(sourcePage.annotations.count).toBe(0);
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(sourcePage.annotations.count).toBe(0);
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 _importPages forwards split-document state and imports the page', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument._isSplitDocument = true;
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(sourceDocument._isSplitDocument).toBeTruthy();
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationDocument.getPage(0)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
});
describe('1041642 PdfDocument layer import mutation coverage', () => {
    it('1041642 _importPages imports source optional content properties', () => {
        const destinationDocument: PdfDocument = new PdfDocument();
        const sourceDocument: PdfDocument = new PdfDocument();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(sourceDocument._crossReference);
        const defaultConfiguration: _PdfDictionary =
            new _PdfDictionary(sourceDocument._crossReference);
        sourceDocument.addPage();
        optionalContentProperties.update('D', defaultConfiguration);
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        expect(
            sourceDocument._catalog._catalogDictionary.has('OCProperties')
        ).toBeTruthy();
        destinationDocument.importPageRange(sourceDocument, 0, 0);
        expect(destinationDocument.pageCount).toBe(1);
        expect(
            destinationDocument._catalog._catalogDictionary.has('OCProperties')
        ).toBeTruthy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('1041642 duplicate import with optimized resources does not require source layers', () => {
        const document: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const defaultConfiguration: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        document.addPage();
        optionalContentProperties.update('D', defaultConfiguration);
        document._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        importOptions.optimizeResources = true;
        document.importPage(0, importOptions);
        expect(importOptions.optimizeResources).toBeTruthy();
        expect(document.pageCount).toBe(2);
        expect(document._isDuplicatePage).toBeFalsy();
        document.destroy();
    });
    it('1041642 duplicate import without resource optimization completes layer processing', () => {
        const document: PdfDocument = new PdfDocument();
        const importOptions: PdfPageImportOptions = new PdfPageImportOptions();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const defaultConfiguration: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        document.addPage();
        optionalContentProperties.update('D', defaultConfiguration);
        document._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        importOptions.optimizeResources = false;
        document.importPage(0, importOptions);
        expect(importOptions.optimizeResources).toBeFalsy();
        expect(document.pageCount).toBe(2);
        expect(document._isDuplicatePage).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument fixed split mutation coverage', () => {
    it('1041642 splitByFixedNumber emits one result for each page', () => {
        const document: PdfDocument = new PdfDocument();
        const receivedIndexes: number[] = [];
        const receivedData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            receivedIndexes.push(args.index);
            receivedData.push(args.pdfData);
        };
        document.splitByFixedNumber(1);
        expect(receivedIndexes.length).toBe(3);
        expect(receivedIndexes[0]).toBe(0);
        expect(receivedIndexes[1]).toBe(1);
        expect(receivedIndexes[2]).toBe(2);
        expect(receivedData[0] instanceof Uint8Array).toBeTruthy();
        expect(receivedData[1] instanceof Uint8Array).toBeTruthy();
        expect(receivedData[2] instanceof Uint8Array).toBeTruthy();
        expect(receivedData[0].length).toBeGreaterThan(0);
        expect(receivedData[1].length).toBeGreaterThan(0);
        expect(receivedData[2].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByFixedNumber includes a final partial group', () => {
        const document: PdfDocument = new PdfDocument();
        const receivedIndexes: number[] = [];
        const receivedData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            receivedIndexes.push(args.index);
            receivedData.push(args.pdfData);
        };
        document.splitByFixedNumber(2);
        expect(receivedIndexes.length).toBe(3);
        expect(receivedIndexes[0]).toBe(0);
        expect(receivedIndexes[1]).toBe(1);
        expect(receivedIndexes[2]).toBe(2);
        expect(receivedData.length).toBe(3);
        expect(receivedData[2].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByFixedNumber accepts a value equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        let eventCount: number = 0;
        let receivedIndex: number = -1;
        let receivedData: any;
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            eventCount++;
            receivedIndex = args.index;
            receivedData = args.pdfData;
        };
        document.splitByFixedNumber(document.pageCount);
        expect(eventCount).toBe(1);
        expect(receivedIndex).toBe(0);
        expect(receivedData instanceof Uint8Array).toBeTruthy();
        expect(receivedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 split delegates to splitByFixedNumber with one page', () => {
        const document: PdfDocument = new PdfDocument();
        const receivedIndexes: number[] = [];
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            receivedIndexes.push(args.index);
            expect(args.pdfData.length).toBeGreaterThan(0);
        };
        document.split();
        expect(receivedIndexes.length).toBe(2);
        expect(receivedIndexes[0]).toBe(0);
        expect(receivedIndexes[1]).toBe(1);
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects zero', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for zero.');
        };
        const splitWithZero: Function = (): void => {
            document.splitByFixedNumber(0);
        };
        expect(splitWithZero).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects a negative value', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for a negative value.');
        };
        const splitWithNegativeValue: Function = (): void => {
            document.splitByFixedNumber(-1);
        };
        expect(splitWithNegativeValue).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects a value greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an oversized value.');
        };
        const splitWithOversizedValue: Function = (): void => {
            document.splitByFixedNumber(3);
        };
        expect(splitWithOversizedValue).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects execution without a split event', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const splitWithoutEvent: Function = (): void => {
            document.splitByFixedNumber(1);
        };
        expect(document.splitEvent).toBeUndefined();
        expect(splitWithoutEvent).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument page range split mutation coverage', () => {
    it('1041642 splitByPageRanges processes multiple valid ranges', () => {
        const document: PdfDocument = new PdfDocument();
        const receivedIndexes: number[] = [];
        const receivedData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            receivedIndexes.push(args.index);
            receivedData.push(args.pdfData);
        };
        document.splitByPageRanges([
            [0, 1],
            [2, 3]
        ]);
        expect(receivedIndexes.length).toBe(2);
        expect(receivedIndexes[0]).toBe(0);
        expect(receivedIndexes[1]).toBe(1);
        expect(receivedData[0] instanceof Uint8Array).toBeTruthy();
        expect(receivedData[1] instanceof Uint8Array).toBeTruthy();
        expect(receivedData[0].length).toBeGreaterThan(0);
        expect(receivedData[1].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges accepts the complete boundary range', () => {
        const document: PdfDocument = new PdfDocument();
        let eventCount: number = 0;
        let receivedIndex: number = -1;
        let receivedData: any;
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            eventCount++;
            receivedIndex = args.index;
            receivedData = args.pdfData;
        };
        document.splitByPageRanges([[0, document.pageCount - 1]]);
        expect(eventCount).toBe(1);
        expect(receivedIndex).toBe(0);
        expect(receivedData instanceof Uint8Array).toBeTruthy();
        expect(receivedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges accepts a zero start and zero end', () => {
        const document: PdfDocument = new PdfDocument();
        let eventCount: number = 0;
        let receivedData: any;
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            eventCount++;
            expect(args.index).toBe(0);
            receivedData = args.pdfData;
        };
        document.splitByPageRanges([[0, 0]]);
        expect(eventCount).toBe(1);
        expect(receivedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects a range without an end index', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an incomplete range.');
        };
        const splitIncompleteRange: Function = (): void => {
            document.splitByPageRanges([[0]]);
        };
        expect(splitIncompleteRange).toThrowError(
            'Invalid page range. Start and end page indexes should be specified.'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects a negative start index', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for a negative start.');
        };
        const splitNegativeStart: Function = (): void => {
            document.splitByPageRanges([[-1, 0]]);
        };
        expect(splitNegativeStart).toThrowError(
            'Invalid page range: start (-1) and end (0).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects a negative end index', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for a negative end.');
        };
        const splitNegativeEnd: Function = (): void => {
            document.splitByPageRanges([[0, -1]]);
        };
        expect(splitNegativeEnd).toThrowError(
            'Invalid page range: start (0) and end (-1).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an invalid start.');
        };
        const splitInvalidStart: Function = (): void => {
            document.splitByPageRanges([[document.pageCount, document.pageCount]]);
        };
        expect(splitInvalidStart).toThrowError(
            'Invalid page range: start (2) and end (2).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an oversized start.');
        };
        const splitOversizedStart: Function = (): void => {
            document.splitByPageRanges([[3, 3]]);
        };
        expect(splitOversizedStart).toThrowError(
            'Invalid page range: start (3) and end (3).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects end index equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an invalid end.');
        };
        const splitInvalidEnd: Function = (): void => {
            document.splitByPageRanges([[0, document.pageCount]]);
        };
        expect(splitInvalidEnd).toThrowError(
            'Invalid page range: start (0) and end (2).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects end index greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for an oversized end.');
        };
        const splitOversizedEnd: Function = (): void => {
            document.splitByPageRanges([[0, 3]]);
        };
        expect(splitOversizedEnd).toThrowError(
            'Invalid page range: start (0) and end (3).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index greater than end index', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            fail('Split event should not be invoked for a reversed range.');
        };
        const splitReversedRange: Function = (): void => {
            document.splitByPageRanges([[2, 1]]);
        };
        expect(splitReversedRange).toThrowError(
            'Invalid page range: start (2) and end (1).'
        );
        document.destroy();
    });
    it('1041642 splitByPageRanges does not execute without a split event', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.splitByPageRanges([[0, 1]]);
        expect(document.splitEvent).toBeUndefined();
        expect(document._isSplitDocument).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument split event arguments mutation coverage', () => {
    it('1041642 PdfDocumentSplitEventArgs returns assigned index and PDF data', () => {
        const sourceData: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const eventArguments: PdfDocumentSplitEventArgs =
            new PdfDocumentSplitEventArgs(3, sourceData);
        expect(eventArguments.index).toBe(3);
        expect(eventArguments.pdfData).toBe(sourceData);
        expect(eventArguments.pdfData.length).toBe(4);
        expect(eventArguments.pdfData[0]).toBe(1);
        expect(eventArguments.pdfData[3]).toBe(4);
    });
});
describe('1041642 watermark link placement mutation coverage', () => {
    it('1041642 new angle0 page creates an unchanged annotation rectangle', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0] as string;
            const bounds: Rectangle = parameters[2] as Rectangle;
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle0);
        expect(page.annotations.count).toBe(1);
        expect(linkBounds).toBeDefined();
        expect(annotationBounds.x).toBeCloseTo(linkBounds.x, 5);
        expect(annotationBounds.y).toBeCloseTo(linkBounds.y, 5);
        expect(annotationBounds.width).toBeCloseTo(linkBounds.width, 5);
        expect(annotationBounds.height).toBeCloseTo(linkBounds.height, 5);
        expect(annotation.border.width).toBe(0);
        expect(annotation.border.hRadius).toBe(0);
        expect(annotation.border.vRadius).toBe(0);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 loaded angle0 page creates an unchanged annotation rectangle', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0] as string;
            const bounds: Rectangle = parameters[2] as Rectangle;
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle0);
        expect(page.annotations.count).toBe(1);
        expect(linkBounds).toBeDefined();
        expect(annotationBounds.x).toBeCloseTo(linkBounds.x, 5);
        expect(annotationBounds.y).toBeCloseTo(linkBounds.y, 5);
        expect(annotationBounds.width).toBeCloseTo(linkBounds.width, 5);
        expect(annotationBounds.height).toBeCloseTo(linkBounds.height, 5);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 new angle90 page calculates rotated annotation bounds', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle90
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        const originalRotateTransform: Function = graphics.rotateTransform;
        let rotatedLinkBounds: any;
        let rotationValue: number = 0;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                rotatedLinkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        graphics.rotateTransform = (angle: number): void => {
            rotationValue = angle;
            originalRotateTransform.call(graphics, angle);
        };
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: any = annotation.bounds;
        const linkX: number = rotatedLinkBounds.x + page.size.height;
        const linkY: number = rotatedLinkBounds.y;
        const linkWidth: number = rotatedLinkBounds.height;
        const linkHeight: number = rotatedLinkBounds.width + 40;
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        expect(rotationValue).toBe(-90);
        expect(annotationBounds.x).toBeCloseTo(linkY, 5);
        expect(annotationBounds.y).toBeCloseTo(
            page.size.height - linkX - linkWidth,
            5
        );
        expect(annotationBounds.width).toBeCloseTo(linkHeight, 5);
        expect(annotationBounds.height).toBeCloseTo(linkWidth, 5);
        graphics.drawString = originalDrawString as any;
        graphics.rotateTransform = originalRotateTransform as any;
        document.destroy();
    });
    it('1041642 new angle180 page calculates rotated annotation bounds', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle180
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        const originalRotateTransform: Function = graphics.rotateTransform;
        let rotatedLinkBounds: any;
        let rotationValue: number = 0;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                rotatedLinkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        graphics.rotateTransform = (angle: number): void => {
            rotationValue = angle;
            originalRotateTransform.call(graphics, angle);
        };
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        const linkX: number =
            rotatedLinkBounds.x + graphics.clientSize.width;
        const linkY: number =
            rotatedLinkBounds.y + graphics.clientSize.height;
        const linkWidth: number =
            rotatedLinkBounds.width + 40;
        const linkHeight: number =
            rotatedLinkBounds.height;
        const layoutWidth: number =
            graphics.clientSize.width - 70;
        const layoutHeight: number =
            graphics.clientSize.height;
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle180);
        expect(rotationValue).toBe(-180);
        expect(annotationBounds.x).toBeCloseTo(
            layoutWidth - linkX + 40,
            5
        );
        expect(annotationBounds.y).toBeCloseTo(
            layoutHeight - linkY - linkHeight,
            5
        );
        expect(annotationBounds.width).toBeCloseTo(linkWidth, 5);
        expect(annotationBounds.height).toBeCloseTo(linkHeight, 5);
        graphics.drawString = originalDrawString as any;
        graphics.rotateTransform = originalRotateTransform as any;
        document.destroy();
    });
    it('1041642 new angle270 page calculates rotated annotation bounds', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle270
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        const originalRotateTransform: Function = graphics.rotateTransform;
        let rotatedLinkBounds: any;
        let rotationValue: number = 0;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                rotatedLinkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        graphics.rotateTransform = (angle: number): void => {
            rotationValue = angle;
            originalRotateTransform.call(graphics, angle);
        };
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        const linkX: number = rotatedLinkBounds.x;
        const linkY: number =
            rotatedLinkBounds.y + page.size.width;
        const linkWidth: number = rotatedLinkBounds.height;
        const linkHeight: number = rotatedLinkBounds.width + 40;
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle270);
        expect(rotationValue).toBe(-270);
        expect(annotationBounds.x).toBeCloseTo(
            page.size.width - linkY - linkHeight,
            5
        );
        expect(annotationBounds.y).toBeCloseTo(linkX, 5);
        expect(annotationBounds.width).toBeCloseTo(linkHeight, 5);
        expect(annotationBounds.height).toBeCloseTo(linkWidth, 5);
        graphics.drawString = originalDrawString as any;
        graphics.rotateTransform = originalRotateTransform as any;
        document.destroy();
    });
    it('1041642 loaded angle90 page uses loaded-page dimensions', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle90
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        expect(annotationBounds.x).toBeCloseTo(linkBounds.y, 5);
        expect(annotationBounds.y).toBeCloseTo(
            page.size.height - linkBounds.x - linkBounds.width,
            5
        );
        expect(annotationBounds.width).toBeCloseTo(linkBounds.height, 5);
        expect(annotationBounds.height).toBeCloseTo(linkBounds.width, 5);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 loaded angle180 page uses loaded-page dimensions', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle180
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle180);
        expect(annotationBounds.x).toBeCloseTo(
            page.size.width - linkBounds.x - linkBounds.width,
            5
        );
        expect(annotationBounds.y).toBeCloseTo(
            page.size.height - linkBounds.y - linkBounds.height,
            5
        );
        expect(annotationBounds.width).toBeCloseTo(linkBounds.width, 5);
        expect(annotationBounds.height).toBeCloseTo(linkBounds.height, 5);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 loaded angle270 page uses loaded-page dimensions', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle270
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(page.annotations.count - 1) as PdfUriAnnotation;
        const annotationBounds: Rectangle = annotation.bounds;
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle270);
        expect(annotationBounds.x).toBeCloseTo(
            page.size.width - linkBounds.y - linkBounds.height,
            5
        );
        expect(annotationBounds.y).toBeCloseTo(linkBounds.x, 5);
        expect(annotationBounds.width).toBeCloseTo(linkBounds.height, 5);
        expect(annotationBounds.height).toBeCloseTo(linkBounds.width, 5);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 loaded rotated page uses swapped layout size', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 600, height: 800 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle90
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        expect(headerBounds).toBeDefined();
        expect(headerBounds.width).toBe(page.size.height - 70);
        expect(headerBounds.height).toBe(page.size.width);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 new rotated footer uses rotated page height', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 600, height: 800 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle90
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            true
        );
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        expect(headerBounds).toBeDefined();
        expect(linkBounds).toBeDefined();
        expect(headerBounds.width).toBeGreaterThan(0);
        expect(headerBounds.height).toBeGreaterThan(0);
        expect(linkBounds.y).toBeGreaterThan(10);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 loaded angle0 footer uses page height and subtracts position', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            true
        );
        expect(page._isNew).toBeFalsy();
        expect(headerBounds.y).toBeGreaterThan(10);
        expect(headerBounds.y).toBeLessThan(page.size.height);
        expect(linkBounds.y).toBeGreaterThanOrEqual(headerBounds.y);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
    it('1041642 portrait 420 width page uses the three-line footer offset', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 420, height: 595 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            true
        );
        const lineHeight: number =
            font.measureString(
                'Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the valid key, Click'
            ).height;
        const expectedY: number =
            graphics.clientSize.height - (lineHeight * 3) - 10;
        expect(page.orientation).toBe(PdfPageOrientation.portrait);
        expect(page.size.width).toBe(420);
        expect(page.size.height).toBe(595);
        expect(headerBounds).toBeDefined();
        expect(headerBounds.y).toBeCloseTo(expectedY, 5);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 landscape 420 point page uses the four-line footer offset', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 420 },
            orientation: PdfPageOrientation.landscape,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            true
        );
        const lineHeight: number =
            font.measureString(
                'Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the valid key, Click'
            ).height;
        const expectedY: number =
            graphics.clientSize.height - (lineHeight * 4) - 10;
        expect(page.orientation).toBe(PdfPageOrientation.landscape);
        expect(page.size.height).toBe(420);
        expect(headerBounds.y).toBeCloseTo(expectedY, 5);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 standard page uses the three-line footer offset', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            true
        );
        const lineHeight: number =
            font.measureString(
                'Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the valid key, Click'
            ).height;
        const expectedY: number =
            graphics.clientSize.height - (lineHeight * 3) - 10;
        expect(page.size.width).not.toBe(420);
        expect(page.size.height).not.toBe(420);
        expect(headerBounds.y).toBeCloseTo(expectedY, 5);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 narrow page wraps the link to the next line', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 180, height: 300 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalDrawString: Function = graphics.drawString;
        let headerBounds: any;
        let linkBounds: any;
        graphics.drawString = ((...parameters: any[]): void => {
            const text: string = parameters[0];
            const bounds: any = parameters[2];
            if (text.indexOf('Created with a trial version') !== -1) {
                headerBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                };
            }
            if (text === 'here') {
                linkBounds = {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width - 70,
                    height: bounds.height
                };
            }
            originalDrawString.apply(graphics, parameters);
        }) as any;
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        expect(page.size.width).toBe(180);
        expect(headerBounds).toBeDefined();
        expect(linkBounds).toBeDefined();
        expect(linkBounds.x).toBe(40);
        expect(linkBounds.y).toBeGreaterThan(headerBounds.y);
        expect(linkBounds.width).toBeGreaterThan(0);
        expect(linkBounds.height).toBeGreaterThan(0);
        expect(page.annotations.count).toBe(1);
        graphics.drawString = originalDrawString as any;
        document.destroy();
    });
    it('1041642 new rotated page restores the graphics state', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle270
        });
        const page: PdfPage = document.addPage(pageSettings);
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalSave: Function = graphics.save;
        const originalRestore: Function = graphics.restore;
        let saveCount: number = 0;
        let restoreCount: number = 0;
        graphics.save = (): any => {
            saveCount++;
            return originalSave.call(graphics);
        };
        graphics.restore = (state?: any): void => {
            restoreCount++;
            originalRestore.call(graphics, state);
        };
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(PdfRotationAngle.angle270);
        expect(saveCount).toBe(1);
        expect(restoreCount).toBe(1);
        expect(page.annotations.count).toBe(1);
        graphics.save = originalSave as any;
        graphics.restore = originalRestore as any;
        document.destroy();
    });
    it('1041642 loaded angle0 page saves the graphics state at completion', () => {
        const document: PdfDocument = new PdfDocument();
        const pageSettings: PdfPageSettings = new PdfPageSettings({
            size: { width: 595, height: 842 },
            orientation: PdfPageOrientation.portrait,
            rotation: PdfRotationAngle.angle0
        });
        const page: PdfPage = document.addPage(pageSettings);
        const originalIsNew: boolean = page._isNew;
        page._isNew = false;
        const graphics: PdfGraphics = page.graphics;
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14,
            PdfFontStyle.regular
        );
        const originalSave: Function = graphics.save;
        const originalRestore: Function = graphics.restore;
        let saveCount: number = 0;
        let restoreCount: number = 0;
        graphics.save = (): any => {
            saveCount++;
            return originalSave.call(graphics);
        };
        graphics.restore = (state?: any): void => {
            restoreCount++;
            originalRestore.call(graphics, state);
        };
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            graphics,
            false
        );
        expect(page._isNew).toBeFalsy();
        expect(page.rotation).toBe(PdfRotationAngle.angle0);
        expect(saveCount).toBe(1);
        expect(restoreCount).toBe(0);
        expect(page.annotations.count).toBe(1);
        graphics.save = originalSave as any;
        graphics.restore = originalRestore as any;
        page._isNew = originalIsNew;
        expect(page._isNew).toBe(originalIsNew);
        document.destroy();
    });
});
describe('1041642 splitByFixedNumber mutation coverage', () => {
    it('1041642 splitByFixedNumber accepts positive number equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        const splitIndexes: number[] = [];
        const splitData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitIndexes.push(args.index);
            splitData.push(args.pdfData);
        };
        document.splitByFixedNumber(2);
        expect(document.pageCount).toBe(2);
        expect(splitIndexes.length).toBe(1);
        expect(splitIndexes[0]).toBe(0);
        expect(splitData.length).toBe(1);
        expect(splitData[0] instanceof Uint8Array).toBeTruthy();
        expect(splitData[0].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByFixedNumber processes the final partial range once', () => {
        const document: PdfDocument = new PdfDocument();
        const splitIndexes: number[] = [];
        const splitData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitIndexes.push(args.index);
            splitData.push(args.pdfData);
        };
        document.splitByFixedNumber(2);
        expect(document.pageCount).toBe(3);
        expect(splitIndexes.length).toBe(2);
        expect(splitIndexes[0]).toBe(0);
        expect(splitIndexes[1]).toBe(1);
        expect(splitData.length).toBe(2);
        expect(splitData[0].length).toBeGreaterThan(0);
        expect(splitData[1].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects zero', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitWithZero: Function = (): void => {
            document.splitByFixedNumber(0);
        };
        expect(splitWithZero).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        expect(splitEventCalls).toBe(0);
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects negative number', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitWithNegativeNumber: Function = (): void => {
            document.splitByFixedNumber(-1);
        };
        expect(splitWithNegativeNumber).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        expect(splitEventCalls).toBe(0);
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects value greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitBeyondPageCount: Function = (): void => {
            document.splitByFixedNumber(3);
        };
        expect(splitBeyondPageCount).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        expect(splitEventCalls).toBe(0);
        expect(document.pageCount).toBe(2);
        document.destroy();
    });
    it('1041642 splitByFixedNumber rejects missing split event', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const splitWithoutEvent: Function = (): void => {
            document.splitByFixedNumber(1);
        };
        expect(document.splitEvent).toBeUndefined();
        expect(splitWithoutEvent).toThrowError(
            'Invalid split number. Split number should be greater than zero and less than or equal to page count.'
        );
        document.destroy();
    });
});
describe('1041642 splitByPageRanges mutation coverage', () => {
    it('1041642 splitByPageRanges does nothing without split event', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        expect(document.splitEvent).toBeUndefined();
        document.splitByPageRanges([[0, 1]]);
        expect(document._isSplitDocument).toBeFalsy();
        expect(document.pageCount).toBe(2);
        document.destroy();
    });
    it('1041642 splitByPageRanges accepts equal start and end indexes', () => {
        const document: PdfDocument = new PdfDocument();
        const splitIndexes: number[] = [];
        const splitData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitIndexes.push(args.index);
            splitData.push(args.pdfData);
        };
        document.splitByPageRanges([[0, 0]]);
        expect(splitIndexes.length).toBe(1);
        expect(splitIndexes[0]).toBe(0);
        expect(splitData.length).toBe(1);
        expect(splitData[0] instanceof Uint8Array).toBeTruthy();
        expect(splitData[0].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges increments split index for each range', () => {
        const document: PdfDocument = new PdfDocument();
        const splitIndexes: number[] = [];
        const splitData: Uint8Array[] = [];
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitIndexes.push(args.index);
            splitData.push(args.pdfData);
        };
        document.splitByPageRanges([
            [0, 0],
            [1, 2]
        ]);
        expect(splitIndexes.length).toBe(2);
        expect(splitIndexes[0]).toBe(0);
        expect(splitIndexes[1]).toBe(1);
        expect(splitData.length).toBe(2);
        expect(splitData[0].length).toBeGreaterThan(0);
        expect(splitData[1].length).toBeGreaterThan(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects range without end index', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitIncompleteRange: Function = (): void => {
            document.splitByPageRanges([[0]]);
        };
        expect(splitIncompleteRange).toThrowError(
            'Invalid page range. Start and end page indexes should be specified.'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects negative start index', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitNegativeStart: Function = (): void => {
            document.splitByPageRanges([[-1, 0]]);
        };
        expect(splitNegativeStart).toThrowError(
            'Invalid page range: start (-1) and end (0).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects negative end index', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitNegativeEnd: Function = (): void => {
            document.splitByPageRanges([[0, -1]]);
        };
        expect(splitNegativeEnd).toThrowError(
            'Invalid page range: start (0) and end (-1).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges accepts end index zero', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        let splitIndex: number = -1;
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitEventCalls++;
            splitIndex = args.index;
            expect(args.pdfData.length).toBeGreaterThan(0);
        };
        document.splitByPageRanges([[0, 0]]);
        expect(splitEventCalls).toBe(1);
        expect(splitIndex).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitInvalidStart: Function = (): void => {
            document.splitByPageRanges([[2, 2]]);
        };
        expect(splitInvalidStart).toThrowError(
            'Invalid page range: start (2) and end (2).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitOversizedStart: Function = (): void => {
            document.splitByPageRanges([[3, 3]]);
        };
        expect(splitOversizedStart).toThrowError(
            'Invalid page range: start (3) and end (3).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects end index equal to page count', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitInvalidEnd: Function = (): void => {
            document.splitByPageRanges([[0, 2]]);
        };
        expect(splitInvalidEnd).toThrowError(
            'Invalid page range: start (0) and end (2).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects end index greater than page count', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitOversizedEnd: Function = (): void => {
            document.splitByPageRanges([[0, 3]]);
        };
        expect(splitOversizedEnd).toThrowError(
            'Invalid page range: start (0) and end (3).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges rejects start index greater than end index', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (): void => {
            splitEventCalls++;
        };
        const splitReversedRange: Function = (): void => {
            document.splitByPageRanges([[2, 1]]);
        };
        expect(splitReversedRange).toThrowError(
            'Invalid page range: start (2) and end (1).'
        );
        expect(splitEventCalls).toBe(0);
        document.destroy();
    });
    it('1041642 splitByPageRanges accepts complete valid page boundary', () => {
        const document: PdfDocument = new PdfDocument();
        let splitEventCalls: number = 0;
        let splitIndex: number = -1;
        document.addPage();
        document.addPage();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            splitEventCalls++;
            splitIndex = args.index;
            expect(args.pdfData.length).toBeGreaterThan(0);
        };
        document.splitByPageRanges([[0, 2]]);
        expect(splitEventCalls).toBe(1);
        expect(splitIndex).toBe(0);
        expect(document.pageCount).toBe(3);
        document.destroy();
    });
});
describe('1041642 template content mutation coverage', () => {
    it('1041642 template content is false when no template is assigned', () => {
        const document: PdfDocument = new PdfDocument();
        expect(document._hasTemplateContentValue).toBeFalsy();
        document.destroy();
    });
    it('1041642 template content is false when template properties are null', () => {
        const document: PdfDocument = new PdfDocument();
        document.template.oddTop = null as any;
        document.template.evenTop = null as any;
        document.template.oddBottom = null as any;
        document.template.evenBottom = null as any;
        document.template.left = null as any;
        document.template.oddLeft = null as any;
        document.template.evenLeft = null as any;
        document.template.right = null as any;
        document.template.oddRight = null as any;
        document.template.evenRight = null as any;
        document.template.top = null as any;
        document.template.bottom = null as any;
        expect(document.template.oddTop).toBeNull();
        expect(document.template.evenTop).toBeNull();
        expect(document.template.oddBottom).toBeNull();
        expect(document.template.evenBottom).toBeNull();
        expect(document.template.left).toBeNull();
        expect(document.template.oddLeft).toBeNull();
        expect(document.template.evenLeft).toBeNull();
        expect(document.template.right).toBeNull();
        expect(document.template.oddRight).toBeNull();
        expect(document.template.evenRight).toBeNull();
        expect(document.template.top).toBeNull();
        expect(document.template.bottom).toBeNull();
        expect(document._hasTemplateContentValue).toBeFalsy();
        document.destroy();
    });
    it('1041642 oddTop template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.oddTop = { template };
        expect(document.template.oddTop).toBeDefined();
        expect(document.template.oddTop.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 evenTop template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.evenTop = { template };
        expect(document.template.oddTop).toBeUndefined();
        expect(document.template.evenTop).toBeDefined();
        expect(document.template.evenTop.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 oddBottom template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.oddBottom = { template };
        expect(document.template.oddTop).toBeUndefined();
        expect(document.template.evenTop).toBeUndefined();
        expect(document.template.oddBottom).toBeDefined();
        expect(document.template.oddBottom.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 evenBottom template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.evenBottom = { template };
        expect(document.template.oddBottom).toBeUndefined();
        expect(document.template.evenBottom).toBeDefined();
        expect(document.template.evenBottom.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 left template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.left = { template };
        expect(document.template.evenBottom).toBeUndefined();
        expect(document.template.left).toBeDefined();
        expect(document.template.left.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 oddLeft template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.oddLeft = { template };
        expect(document.template.left).toBeUndefined();
        expect(document.template.oddLeft).toBeDefined();
        expect(document.template.oddLeft.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 evenLeft template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.evenLeft = { template };
        expect(document.template.oddLeft).toBeUndefined();
        expect(document.template.evenLeft).toBeDefined();
        expect(document.template.evenLeft.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 right template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.right = { template };
        expect(document.template.evenLeft).toBeUndefined();
        expect(document.template.right).toBeDefined();
        expect(document.template.right.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 oddRight template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.oddRight = { template };
        expect(document.template.right).toBeUndefined();
        expect(document.template.oddRight).toBeDefined();
        expect(document.template.oddRight.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 evenRight template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 20, height: 100 });
        document.template.evenRight = { template };
        expect(document.template.oddRight).toBeUndefined();
        expect(document.template.evenRight).toBeDefined();
        expect(document.template.evenRight.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 top template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.top = { template };
        expect(document.template.evenRight).toBeUndefined();
        expect(document.template.top).toBeDefined();
        expect(document.template.top.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
    it('1041642 bottom template content is true', () => {
        const document: PdfDocument = new PdfDocument();
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({ width: 100, height: 20 });
        document.template.bottom = { template };
        expect(document.template.top).toBeUndefined();
        expect(document.template.bottom).toBeDefined();
        expect(document.template.bottom.template).toBe(template);
        expect(document._hasTemplateContentValue).toBeTruthy();
        document.destroy();
    });
});
describe('1041642 PDF export settings mutation coverage', () => {
    it('1041642 annotation export settings use default values', () => {
        const settings: PdfAnnotationExportSettings =
            new PdfAnnotationExportSettings();
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings.exportAppearance).toBeFalsy();
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings._exportAppearance).toBeFalsy();
    });
    it('1041642 annotation export settings update data format', () => {
        const settings: PdfAnnotationExportSettings =
            new PdfAnnotationExportSettings();
        settings.dataFormat = DataFormat.json;
        expect(settings.dataFormat).toBe(DataFormat.json);
        expect(settings._format).toBe(DataFormat.json);
        expect(settings.dataFormat).not.toBe(DataFormat.xfdf as any);
    });
    it('1041642 annotation export settings update export appearance', () => {
        const settings: PdfAnnotationExportSettings =
            new PdfAnnotationExportSettings();
        settings.exportAppearance = true;
        expect(settings.exportAppearance).toBeTruthy();
        expect(settings._exportAppearance).toBeTruthy();
        settings.exportAppearance = false;
        expect(settings.exportAppearance).toBeFalsy();
        expect(settings._exportAppearance).toBeFalsy();
    });
    it('1041642 form export settings use default values', () => {
        const settings: PdfFormFieldExportSettings =
            new PdfFormFieldExportSettings();
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings.exportName).toBe('');
        expect(settings.asPerSpecification).toBeTruthy();
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings._exportName).toBe('');
        expect(settings._asPerSpecification).toBeTruthy();
    });
    it('1041642 form export settings update all properties', () => {
        const settings: PdfFormFieldExportSettings =
            new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.xml;
        settings.exportName = 'FormData';
        settings.asPerSpecification = false;
        expect(settings.dataFormat).toBe(DataFormat.xml);
        expect(settings.exportName).toBe('FormData');
        expect(settings.asPerSpecification).toBeFalsy();
        expect(settings._format).toBe(DataFormat.xml);
        expect(settings._exportName).toBe('FormData');
        expect(settings._asPerSpecification).toBeFalsy();
    });
    it('1041642 form export settings restore updated values', () => {
        const settings: PdfFormFieldExportSettings =
            new PdfFormFieldExportSettings();
        settings.dataFormat = DataFormat.json;
        settings.exportName = 'Application';
        settings.asPerSpecification = false;
        expect(settings.dataFormat).toBe(DataFormat.json);
        expect(settings.exportName).toBe('Application');
        expect(settings.asPerSpecification).toBeFalsy();
        settings.dataFormat = DataFormat.xfdf;
        settings.exportName = '';
        settings.asPerSpecification = true;
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings.exportName).toBe('');
        expect(settings.asPerSpecification).toBeTruthy();
    });
});
describe('1041642 PdfPageSettings orientation and size mutation coverage', () => {
    it('1041642 orientation setter updates orientation and size', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = { width: 500, height: 700 };
        settings.orientation = PdfPageOrientation.landscape;
        expect(settings._isOrientation).toBeTruthy();
        expect(settings.orientation).toBe(PdfPageOrientation.landscape);
        expect(settings.size.width).toBe(700);
        expect(settings.size.height).toBe(500);
    });
    it('1041642 assigning same orientation preserves normalized size', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = { width: 500, height: 700 };
        settings.orientation = PdfPageOrientation.portrait;
        expect(settings._isOrientation).toBeTruthy();
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(500);
        expect(settings.size.height).toBe(700);
    });
    it('1041642 portrait orientation normalizes reversed page dimensions', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.orientation = PdfPageOrientation.portrait;
        settings.size = { width: 800, height: 500 };
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(500);
        expect(settings.size.height).toBe(800);
    });
    it('1041642 landscape orientation normalizes page dimensions', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.orientation = PdfPageOrientation.landscape;
        settings.size = { width: 500, height: 800 };
        expect(settings.orientation).toBe(PdfPageOrientation.landscape);
        expect(settings.size.width).toBe(800);
        expect(settings.size.height).toBe(500);
    });
    it('1041642 size setter updates orientation to portrait', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = { width: 400, height: 700 };
        expect(settings.size.width).toBe(400);
        expect(settings.size.height).toBe(700);
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
    });
    it('1041642 size setter updates orientation to landscape', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = { width: 700, height: 400 };
        expect(settings.size.width).toBe(700);
        expect(settings.size.height).toBe(400);
        expect(settings.orientation).toBe(PdfPageOrientation.landscape);
    });
    it('1041642 square size uses portrait orientation', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = { width: 500, height: 500 };
        expect(settings.size.width).toBe(500);
        expect(settings.size.height).toBe(500);
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
    });
    it('1041642 update size accepts page size object', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.orientation = PdfPageOrientation.portrait;
        settings._updateSize({ width: 900, height: 600 });
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(600);
        expect(settings.size.height).toBe(900);
    });
    it('1041642 update size accepts portrait orientation enum', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings._size = { width: 900, height: 600 };
        settings._updateSize(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(600);
        expect(settings.size.height).toBe(900);
    });
    it('1041642 update size accepts landscape orientation enum', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings._size = { width: 600, height: 900 };
        settings._updateSize(PdfPageOrientation.landscape);
        expect(settings.size.width).toBe(900);
        expect(settings.size.height).toBe(600);
    });
});
describe('1041642 PdfPageSettings rotation mutation coverage', () => {
    it('1041642 rotation accepts angle0 without normalization', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = PdfRotationAngle.angle0;
        expect(settings.rotation).toBe(PdfRotationAngle.angle0);
        expect(settings._rotation).toBe(PdfRotationAngle.angle0);
    });
    it('1041642 rotation accepts angle90 without normalization', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = PdfRotationAngle.angle90;
        expect(settings.rotation).toBe(PdfRotationAngle.angle90);
        expect(settings._rotation).toBe(PdfRotationAngle.angle90);
    });
    it('1041642 rotation accepts angle270 without normalization', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = PdfRotationAngle.angle270;
        expect(settings.rotation).toBe(PdfRotationAngle.angle270);
        expect(settings._rotation).toBe(PdfRotationAngle.angle270);
    });
    it('1041642 rotation normalizes value equal to four', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = 4 as PdfRotationAngle;
        expect(settings.rotation).toBe(PdfRotationAngle.angle0);
        expect(settings._rotation).toBe(0);
    });
    it('1041642 rotation normalizes value greater than four', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = 5 as PdfRotationAngle;
        expect(settings.rotation).toBe(PdfRotationAngle.angle90);
        expect(settings._rotation).toBe(1);
    });
    it('1041642 rotation normalizes multiple turns', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.rotation = 10 as PdfRotationAngle;
        expect(settings.rotation).toBe(PdfRotationAngle.angle180);
        expect(settings._rotation).toBe(2);
    });
});
describe('1041642 PdfMargins mutation coverage', () => {
    it('1041642 margins use forty as default for all sides', () => {
        const margins: PdfMargins = new PdfMargins();
        expect(margins.left).toBe(40);
        expect(margins.right).toBe(40);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        expect(margins._left).toBe(40);
        expect(margins._right).toBe(40);
        expect(margins._top).toBe(40);
        expect(margins._bottom).toBe(40);
    });
    it('1041642 margins accept same value for all sides', () => {
        const margins: PdfMargins = new PdfMargins(25);
        expect(margins.left).toBe(25);
        expect(margins.right).toBe(25);
        expect(margins.top).toBe(25);
        expect(margins.bottom).toBe(25);
    });
    it('1041642 margins accept zero for all sides', () => {
        const margins: PdfMargins = new PdfMargins(0);
        expect(margins.left).toBe(0);
        expect(margins.right).toBe(0);
        expect(margins.top).toBe(0);
        expect(margins.bottom).toBe(0);
    });
    it('1041642 margin setters update each side independently', () => {
        const margins: PdfMargins = new PdfMargins();
        margins.left = 10;
        margins.right = 20;
        margins.top = 30;
        margins.bottom = 50;
        expect(margins.left).toBe(10);
        expect(margins.right).toBe(20);
        expect(margins.top).toBe(30);
        expect(margins.bottom).toBe(50);
        expect(margins._left).toBe(10);
        expect(margins._right).toBe(20);
        expect(margins._top).toBe(30);
        expect(margins._bottom).toBe(50);
    });
    it('1041642 margin setters preserve unrelated sides', () => {
        const margins: PdfMargins = new PdfMargins(40);
        margins.left = 5;
        expect(margins.left).toBe(5);
        expect(margins.right).toBe(40);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        margins.right = 15;
        expect(margins.left).toBe(5);
        expect(margins.right).toBe(15);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        margins.top = 25;
        expect(margins.left).toBe(5);
        expect(margins.right).toBe(15);
        expect(margins.top).toBe(25);
        expect(margins.bottom).toBe(40);
        margins.bottom = 35;
        expect(margins.left).toBe(5);
        expect(margins.right).toBe(15);
        expect(margins.top).toBe(25);
        expect(margins.bottom).toBe(35);
    });
});
describe('1041642 direct accessor mutation coverage', () => {
    it('1041642 annotation export settings getters and setters return assigned values', () => {
        const settings: PdfAnnotationExportSettings =
            new PdfAnnotationExportSettings();
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings.exportAppearance).toBeFalsy();
        expect(settings._exportAppearance).toBeFalsy();
        settings.dataFormat = DataFormat.json;
        settings.exportAppearance = true;
        expect(settings.dataFormat).toBe(DataFormat.json);
        expect(settings._format).toBe(DataFormat.json);
        expect(settings.exportAppearance).toBeTruthy();
        expect(settings._exportAppearance).toBeTruthy();
        settings.dataFormat = DataFormat.xfdf;
        settings.exportAppearance = false;
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings.exportAppearance).toBeFalsy();
        expect(settings._exportAppearance).toBeFalsy();
    });
    it('1041642 form export settings getters and setters return assigned values', () => {
        const settings: PdfFormFieldExportSettings =
            new PdfFormFieldExportSettings();
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings.exportName).toBe('');
        expect(settings._exportName).toBe('');
        expect(settings.asPerSpecification).toBeTruthy();
        expect(settings._asPerSpecification).toBeTruthy();
        settings.dataFormat = DataFormat.json;
        settings.exportName = 'FormData';
        settings.asPerSpecification = false;
        expect(settings.dataFormat).toBe(DataFormat.json);
        expect(settings._format).toBe(DataFormat.json);
        expect(settings.exportName).toBe('FormData');
        expect(settings._exportName).toBe('FormData');
        expect(settings.asPerSpecification).toBeFalsy();
        expect(settings._asPerSpecification).toBeFalsy();
        settings.dataFormat = DataFormat.xfdf;
        settings.exportName = '';
        settings.asPerSpecification = true;
        expect(settings.dataFormat).toBe(DataFormat.xfdf);
        expect(settings._format).toBe(DataFormat.xfdf);
        expect(settings.exportName).toBe('');
        expect(settings._exportName).toBe('');
        expect(settings.asPerSpecification).toBeTruthy();
        expect(settings._asPerSpecification).toBeTruthy();
    });
    it('1041642 page settings getters and setters return assigned values', () => {
        const settings: PdfPageSettings = new PdfPageSettings();
        const margins: PdfMargins = new PdfMargins(20);
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
        expect(settings.margins.left).toBe(40);
        expect(settings.margins.right).toBe(40);
        expect(settings.margins.top).toBe(40);
        expect(settings.margins.bottom).toBe(40);
        expect(settings.rotation).toBe(PdfRotationAngle.angle0);
        settings.orientation = PdfPageOrientation.landscape;
        settings.size = { width: 900, height: 600 };
        settings.margins = margins;
        settings.rotation = PdfRotationAngle.angle180;
        expect(settings.orientation).toBe(PdfPageOrientation.landscape);
        expect(settings._orientation).toBe(PdfPageOrientation.landscape);
        expect(settings.size.width).toBe(900);
        expect(settings.size.height).toBe(600);
        expect(settings._size.width).toBe(900);
        expect(settings._size.height).toBe(600);
        expect(settings.margins).toBe(margins);
        expect(settings._margins).toBe(margins);
        expect(settings.margins.left).toBe(20);
        expect(settings.margins.right).toBe(20);
        expect(settings.margins.top).toBe(20);
        expect(settings.margins.bottom).toBe(20);
        expect(settings.rotation).toBe(PdfRotationAngle.angle180);
        expect(settings._rotation).toBe(PdfRotationAngle.angle180);
        settings.orientation = PdfPageOrientation.portrait;
        settings.size = { width: 500, height: 700 };
        settings.margins = new PdfMargins(40);
        settings.rotation = PdfRotationAngle.angle0;
        expect(settings.orientation).toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(500);
        expect(settings.size.height).toBe(700);
        expect(settings.margins.left).toBe(40);
        expect(settings.margins.right).toBe(40);
        expect(settings.margins.top).toBe(40);
        expect(settings.margins.bottom).toBe(40);
        expect(settings.rotation).toBe(PdfRotationAngle.angle0);
    });
    it('1041642 margin getters and setters update each side independently', () => {
        const margins: PdfMargins = new PdfMargins();
        expect(margins.left).toBe(40);
        expect(margins.right).toBe(40);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        expect(margins._left).toBe(40);
        expect(margins._right).toBe(40);
        expect(margins._top).toBe(40);
        expect(margins._bottom).toBe(40);
        margins.left = 10;
        expect(margins.left).toBe(10);
        expect(margins._left).toBe(10);
        expect(margins.right).toBe(40);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        margins.right = 20;
        expect(margins.left).toBe(10);
        expect(margins.right).toBe(20);
        expect(margins._right).toBe(20);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
        margins.top = 30;
        expect(margins.left).toBe(10);
        expect(margins.right).toBe(20);
        expect(margins.top).toBe(30);
        expect(margins._top).toBe(30);
        expect(margins.bottom).toBe(40);
        margins.bottom = 50;
        expect(margins.left).toBe(10);
        expect(margins.right).toBe(20);
        expect(margins.top).toBe(30);
        expect(margins.bottom).toBe(50);
        expect(margins._bottom).toBe(50);
        margins.left = 40;
        margins.right = 40;
        margins.top = 40;
        margins.bottom = 40;
        expect(margins.left).toBe(40);
        expect(margins.right).toBe(40);
        expect(margins.top).toBe(40);
        expect(margins.bottom).toBe(40);
    });
});
describe('1041642 PdfDocument decompressed stream bytes', () => {
    it('1041642 returns bytes from an uncompressed PDF stream', () => {
        const document: PdfDocument = new PdfDocument();
        const expectedBytes: Uint8Array = new Uint8Array([10, 20, 30]);
        const stream: _PdfStream = new _PdfStream(expectedBytes);
        const result: Uint8Array =
            document._getDecompressedStreamBytes(stream);
        expect(result).toBe(expectedBytes);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(30);
        document.destroy();
    });
    it('1041642 reads all bytes from a flate stream with byte storage', () => {
        const document: PdfDocument = new PdfDocument();
        const compressedBytes: Uint8Array = new Uint8Array([
            120, 156, 99, 100, 98, 102, 1, 0, 0, 24, 0, 11
        ]);
        const stream: _PdfFlateStream = new _PdfFlateStream(
            new _PdfStream(compressedBytes),
            compressedBytes.length
        );
        const result: Uint8Array =
            document._getDecompressedStreamBytes(stream);
        expect(result).toBeDefined();
        expect(result instanceof Uint8Array).toBeTruthy();
        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
        expect(result[3]).toBe(4);
        document.destroy();
    });
});
describe('1041642 PdfDocument template getter mutation coverage', () => {
    it('1041642 new document template getter creates one reusable template object', () => {
        const document: PdfDocument = new PdfDocument();
        expect(document._isLoaded).toBeFalsy();
        expect((document as any)._template).toBeUndefined();
        const firstTemplate: PdfDocumentTemplate = document.template;
        const secondTemplate: PdfDocumentTemplate = document.template;
        expect(firstTemplate).toBeDefined();
        expect(secondTemplate).toBe(firstTemplate);
        expect((document as any)._template).toBe(firstTemplate);
        document.destroy();
    });
    it('1041642 loaded document template getter returns the existing template', () => {
        const document: PdfDocument = new PdfDocument();
        const expectedTemplate: PdfDocumentTemplate = document.template;
        (document as any)._template = expectedTemplate;
        document._isLoaded = true;
        const result: PdfDocumentTemplate = document.template;
        expect(document._isLoaded).toBeTruthy();
        expect(result).toBe(expectedTemplate);
        expect((document as any)._template).toBe(expectedTemplate);
        document._isLoaded = false;
        document.destroy();
    });
});
describe('1041642 PdfDocument revision mutation coverage', () => {
    it('1041642 new document returns undefined revisions', () => {
        const document: PdfDocument = new PdfDocument();
        expect(document._isLoaded).toBeFalsy();
        expect(document.getRevisions()).toBeUndefined();
        document.destroy();
    });
    it('1041642 loaded document without cross-reference positions returns empty revisions', () => {
        const document: PdfDocument = new PdfDocument();
        document._isLoaded = true;
        document._startXRefParsedCache = [];
        const firstResult: number[] = document.getRevisions();
        const secondResult: number[] = document.getRevisions();
        expect(firstResult).toBeDefined();
        expect(firstResult.length).toBe(0);
        expect(secondResult).toBe(firstResult);
        expect((document as any)._revisions).toBe(firstResult);
        document._isLoaded = false;
        document.destroy();
    });
    it('1041642 returns cached revisions without reparsing', () => {
        const document: PdfDocument = new PdfDocument();
        const expectedRevisions: number[] = [25, 50];
        document._isLoaded = true;
        (document as any)._revisions = expectedRevisions;
        const result: number[] = document.getRevisions();
        expect(result).toBe(expectedRevisions);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(25);
        expect(result[1]).toBe(50);
        document._isLoaded = false;
        document.destroy();
    });
});
describe('1041642 PdfDocument information string mutation coverage', () => {
    it('1041642 writes a nonempty information value', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        document._writeInfoString(dictionary, 'Title', 'PDF Title');
        expect(dictionary.has('Title')).toBeTruthy();
        expect(dictionary.get('Title')).toBe('PDF Title');
        document.destroy();
    });
    it('1041642 writes an empty information string', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        document._writeInfoString(dictionary, 'Title', '');
        expect(dictionary.has('Title')).toBeTruthy();
        expect(dictionary.get('Title')).toBe('');
        document.destroy();
    });
    it('1041642 ignores null information value', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        document._writeInfoString(dictionary, 'Title', null as any);
        expect(dictionary.has('Title')).toBeFalsy();
        document.destroy();
    });
    it('1041642 ignores undefined information value', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        document._writeInfoString(dictionary, 'Title', undefined);
        expect(dictionary.has('Title')).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument page cache insertion mutation coverage', () => {
    it('1041642 insertion shifts pages at and after the insertion index', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        document._updatePageCache(1, true);
        expect(document._pages.size).toBe(3);
        expect(document._pages.get(0)).toBe(firstPage);
        expect(document._pages.get(2)).toBe(secondPage);
        expect(document._pages.get(3)).toBe(thirdPage);
        expect(firstPage._pageIndex).toBe(0);
        expect(secondPage._pageIndex).toBe(2);
        expect(thirdPage._pageIndex).toBe(3);
        document.destroy();
    });
});
describe('1041642 PdfDocument page cache removal mutation coverage', () => {
    it('1041642 removal deletes selected page and shifts following pages', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const removedPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        document._updatePageCache(1, false);
        expect(document._pages.size).toBe(2);
        expect(document._pageCount).toBe(2);
        expect(document._pages.get(0)).toBe(firstPage);
        expect(document._pages.get(1)).toBe(thirdPage);
        expect(document._pages.get(2)).toBeUndefined();
        expect(firstPage._pageIndex).toBe(0);
        expect(thirdPage._pageIndex).toBe(1);
        expect(document._pages.get(1)).not.toBe(removedPage);
        document.destroy();
    });
    it('1041642 removing last cache entry preserves earlier page indexes', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        document.addPage();
        document._updatePageCache(2, false);
        expect(document._pages.size).toBe(2);
        expect(document._pageCount).toBe(2);
        expect(document._pages.get(0)).toBe(firstPage);
        expect(document._pages.get(1)).toBe(secondPage);
        expect(firstPage._pageIndex).toBe(0);
        expect(secondPage._pageIndex).toBe(1);
        document.destroy();
    });
});
describe('1041642 PdfDocument updated page templates mutation coverage', () => {
    it('1041642 empty template collection remains unchanged', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const namedPages: _PdfDictionary[] = [];
        const result: _PdfDictionary[] =
            document._getUpdatedPageTemplates(namedPages, page);
        expect(result).toBe(namedPages);
        expect(result.length).toBe(0);
        document.destroy();
    });
    it('1041642 matching page template pair is removed', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const nameDictionary: _PdfDictionary = new _PdfDictionary();
        const namedPages: _PdfDictionary[] = [
            nameDictionary,
            page._pageDictionary
        ];
        const result: _PdfDictionary[] =
            document._getUpdatedPageTemplates(namedPages, page);
        expect(result).toBe(namedPages);
        expect(result.length).toBe(0);
        document.destroy();
    });
    it('1041642 nonmatching page template pair remains unchanged', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const nameDictionary: _PdfDictionary = new _PdfDictionary();
        const otherPageDictionary: _PdfDictionary = new _PdfDictionary();
        const namedPages: _PdfDictionary[] = [
            nameDictionary,
            otherPageDictionary
        ];
        const result: _PdfDictionary[] =
            document._getUpdatedPageTemplates(namedPages, page);
        expect(result).toBe(namedPages);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(nameDictionary);
        expect(result[1]).toBe(otherPageDictionary);
        document.destroy();
    });
    it('1041642 finds matching page in the second template pair', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstName: _PdfDictionary = new _PdfDictionary();
        const firstPage: _PdfDictionary = new _PdfDictionary();
        const secondName: _PdfDictionary = new _PdfDictionary();
        const namedPages: _PdfDictionary[] = [
            firstName,
            firstPage,
            secondName,
            page._pageDictionary
        ];
        const result: _PdfDictionary[] =
            document._getUpdatedPageTemplates(namedPages, page);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(firstName);
        expect(result[1]).toBe(firstPage);
        document.destroy();
    });
});
describe('1041642 PdfDocument array resource cloning mutation coverage', () => {
    it('1041642 clone inner resources appends only missing array entries', () => {
        const document: PdfDocument = new PdfDocument();
        const resourceDictionary: _PdfDictionary = new _PdfDictionary();
        const existingEntry: string = 'Existing';
        const newEntry: string = 'New';
        const existingValues: string[] = [existingEntry];
        resourceDictionary.update('ProcSet', existingValues);
        resourceDictionary._updated = false;
        document._cloneInnerResources(
            'ProcSet',
            [existingEntry, newEntry],
            resourceDictionary
        );
        const result: string[] = resourceDictionary.get('ProcSet');
        expect(result).toBe(existingValues);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(existingEntry);
        expect(result[1]).toBe(newEntry);
        expect(resourceDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('1041642 clone inner resources does not duplicate array entries', () => {
        const document: PdfDocument = new PdfDocument();
        const resourceDictionary: _PdfDictionary = new _PdfDictionary();
        const existingValues: string[] = ['Existing'];
        resourceDictionary.update('ProcSet', existingValues);
        resourceDictionary._updated = false;
        document._cloneInnerResources(
            'ProcSet',
            ['Existing'],
            resourceDictionary
        );
        const result: string[] = resourceDictionary.get('ProcSet');
        expect(result.length).toBe(1);
        expect(result[0]).toBe('Existing');
        expect(resourceDictionary._updated).toBeFalsy();
        document.destroy();
    });
    it('1041642 clone inner resources creates missing array entry', () => {
        const document: PdfDocument = new PdfDocument();
        const resourceDictionary: _PdfDictionary = new _PdfDictionary();
        const newValues: string[] = ['PDF', 'Text'];
        document._cloneInnerResources(
            'ProcSet',
            newValues,
            resourceDictionary
        );
        expect(resourceDictionary.has('ProcSet')).toBeTruthy();
        expect(resourceDictionary.get('ProcSet')).toBe(newValues);
        document.destroy();
    });
});
describe('1041642 PdfDocument saveAsBlob mutation coverage', () => {
    it('1041642 saveAsBlob resolves with a nonempty PDF Blob', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.saveAsBlob().then((result: { blobData: Blob }): void => {
            expect(result).toBeDefined();
            expect(result.blobData).toBeDefined();
            expect(result.blobData instanceof Blob).toBeTruthy();
            expect(result.blobData.type).toBe('application/pdf');
            expect(result.blobData.size).toBeGreaterThan(0);
            document.destroy();
            done();
        });
    });
});
describe('1041642 PdfDocument destination collection mutation coverage', () => {
    it('1041642 destination collection is created without a Names dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        expect(
            document._catalog._catalogDictionary.has('Names')
        ).toBeFalsy();
        const firstCollection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        const secondCollection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(firstCollection).toBeDefined();
        expect(secondCollection).toBe(firstCollection);
        expect(document._namedDestinationCollection).toBe(firstCollection);
        document.destroy();
    });
    it('1041642 destination collection uses the catalog Names dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const namesDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        const collection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(
            document._catalog._catalogDictionary.has('Names')
        ).toBeTruthy();
        expect(collection).toBeDefined();
        expect(document._namedDestinationCollection).toBe(collection);
        document.destroy();
    });
});
describe('1041642 PdfDocument password extraction mutation coverage', () => {
    it('1041642 extracts bytes before the complete padding sequence', () => {
        const document: PdfDocument = new PdfDocument();
        const padding: Uint8Array = new Uint8Array([10, 20, 30]);
        const decoded: Uint8Array =
            new Uint8Array([65, 66, 10, 20, 30, 99]);
        const result: Uint8Array =
            document._extractRealPassword(decoded, padding);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(65);
        expect(result[1]).toBe(66);
        document.destroy();
    });
    it('1041642 returns complete decoded value when padding does not match', () => {
        const document: PdfDocument = new PdfDocument();
        const padding: Uint8Array = new Uint8Array([10, 20, 30]);
        const decoded: Uint8Array =
            new Uint8Array([65, 66, 10, 21, 30]);
        const result: Uint8Array =
            document._extractRealPassword(decoded, padding);
        expect(result).toBe(decoded);
        expect(result.length).toBe(5);
        document.destroy();
    });
    it('1041642 returns empty password when padding starts at zero', () => {
        const document: PdfDocument = new PdfDocument();
        const padding: Uint8Array = new Uint8Array([10, 20, 30]);
        const decoded: Uint8Array =
            new Uint8Array([10, 20, 30, 65]);
        const result: Uint8Array =
            document._extractRealPassword(decoded, padding);
        expect(result.length).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument stream signature search mutation coverage', () => {
    it('1041642 forward search finds signature at the beginning', () => {
        const document: PdfDocument = new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([1, 2, 3, 4]));
        const signature: Uint8Array = new Uint8Array([1, 2]);
        const result: boolean =
            document._find(stream, signature, 4, false);
        expect(result).toBeTruthy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
    it('1041642 forward search finds signature after initial bytes', () => {
        const document: PdfDocument = new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([9, 8, 1, 2, 3]));
        const signature: Uint8Array = new Uint8Array([1, 2]);
        const result: boolean =
            document._find(stream, signature, 5, false);
        expect(result).toBeTruthy();
        expect(stream.position).toBe(2);
        document.destroy();
    });
    it('1041642 backward search finds the last matching signature', () => {
        const document: PdfDocument = new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([1, 2, 9, 1, 2]));
        const signature: Uint8Array = new Uint8Array([1, 2]);
        const result: boolean =
            document._find(stream, signature, 5, true);
        expect(result).toBeTruthy();
        expect(stream.position).toBe(3);
        document.destroy();
    });
    it('1041642 search returns false when signature is absent', () => {
        const document: PdfDocument = new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([1, 2, 3, 4]));
        const signature: Uint8Array = new Uint8Array([8, 9]);
        const result: boolean =
            document._find(stream, signature, 4, false);
        expect(result).toBeFalsy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
    it('1041642 search returns false when input is not longer than signature', () => {
        const document: PdfDocument = new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream(new Uint8Array([1, 2]));
        const signature: Uint8Array = new Uint8Array([1, 2]);
        const result: boolean =
            document._find(stream, signature, 2, false);
        expect(result).toBeFalsy();
        document.destroy();
    });
});