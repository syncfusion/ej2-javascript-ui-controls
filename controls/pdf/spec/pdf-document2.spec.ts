import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { _PdfAlignmentStyle, _PdfDocumentTemplateKey, _TemplateSide, PdfTemplateHorizontalAlignment, PdfTemplateLayerMode, PdfTemplateVerticalAlignment } from "../src/pdf/core/enumerator";
import { PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfSection } from "../src/pdf/core/pdf-section";
describe('1041642 PdfDocument _renderPageTemplates', () => {
    it('1041642 ignores unavailable document and section templates', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        let sectionTemplateCallCount: number = 0;
        let documentTemplateCallCount: number = 0;
        internalDocument._sections = [];
        internalPage._getSectionIndex = (): number => {
            return -1;
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                sectionTemplateCallCount++;
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                documentTemplateCallCount++;
                return null;
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            undefined
        );
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        expect(
            internalDocument._templateRenderingStarted
        ).toBeTruthy();
        expect(sectionTemplateCallCount).toBe(0);
        expect(documentTemplateCallCount).toBe(4);
        expect(internalPage._getSectionIndex).toBe(
            originalGetSectionIndex
        );
        expect(
            internalDocument._getSectionTemplateForSide
        ).toBe(originalGetSectionTemplateForSide);
        expect(
            internalDocument._getTemplateForSide
        ).toBe(originalGetTemplateForSide);
        document.destroy();
    });
    it('1041642 rejects section index at collection length boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        let sectionTemplateCallCount: number = 0;
        internalDocument._sections = [
            document.addSection()
        ];
        internalPage._getSectionIndex = (): number => {
            return internalDocument._sections.length;
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                sectionTemplateCallCount++;
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            undefined
        );
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        expect(sectionTemplateCallCount).toBe(0);
        document.destroy();
    });
    it('1041642 skips unavailable template information', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        let documentTemplateCallCount: number = 0;
        internalPage._getSectionIndex = (): number => {
            return -1;
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                documentTemplateCallCount++;
                return null;
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            undefined
        );
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        expect(documentTemplateCallCount).toBe(4);
        document.destroy();
    });
    it('1041642 skips template when layer mode does not match', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        let sideCallCount: number = 0;
        let positionCallCount: number = 0;
        let drawCallCount: number = 0;
        const templateInformation: any = {
            template: {
                _draw: (): void => {
                    drawCallCount++;
                }
            },
            documentTemplate: undefined,
            alignment: undefined,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        internalPage._getSectionIndex = (): number => {
            return -1;
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                sideCallCount++;
                return sideCallCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                positionCallCount++;
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            PdfTemplateLayerMode.background
        );
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        expect(positionCallCount).toBe(0);
        expect(drawCallCount).toBe(0);
        document.destroy();
    });
    it('1041642 resolves direction when alignment is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const fakeGraphics: any = {};
        const fakePage: any = {
            _getSectionIndex: (): number => {
                return -1;
            },
            _g: fakeGraphics,
            _needInitializeGraphics: true,
            _accessedBeforeTemplate: false,
            _templatesRendered: false,
            graphics: fakeGraphics
        };
        let templateLookupCount: number = 0;
        let directionCallCount: number = 0;
        let drawCallCount: number = 0;
        let receivedDirection: string | undefined;
        const templateInformation: any = {
            template: {
                _draw: (
                    graphics: any,
                    _x: number,
                    _y: number,
                    _width: number,
                    _height: number,
                    direction: string | undefined
                ): void => {
                    drawCallCount++;
                    receivedDirection = direction;
                    expect(graphics).toBe(fakeGraphics);
                }
            },
            documentTemplate: undefined,
            alignment: undefined,
            templateLayerMode: undefined
        };
        internalDocument._sections = [];
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                templateLookupCount++;
                return templateLookupCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 10,
                    y: 20,
                    width: 100,
                    height: 30
                };
            };
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                directionCallCount++;
                return 'ResolvedDirection';
            };
        internalDocument._renderPageTemplates(
            fakePage,
            true,
            undefined
        );
        internalDocument._sections =
            originalSections;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        expect(templateLookupCount).toBe(4);
        expect(directionCallCount).toBe(1);
        expect(drawCallCount).toBe(1);
        expect(receivedDirection).toBe(
            'ResolvedDirection'
        );
        document.destroy();
    });
    it('1041642 leaves direction undefined when alignment is defined', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const fakeGraphics: any = {};
        const fakePage: any = {
            _getSectionIndex: (): number => {
                return -1;
            },
            _g: fakeGraphics,
            _needInitializeGraphics: true,
            _accessedBeforeTemplate: false,
            _templatesRendered: false,
            graphics: fakeGraphics
        };
        let templateLookupCount: number = 0;
        let directionCallCount: number = 0;
        let drawCallCount: number = 0;
        let receivedDirection: string | undefined =
            'InitialDirection';
        const templateInformation: any = {
            template: {
                _draw: (
                    graphics: any,
                    _x: number,
                    _y: number,
                    _width: number,
                    _height: number,
                    direction: string | undefined
                ): void => {
                    drawCallCount++;
                    receivedDirection = direction;
                    expect(graphics).toBe(fakeGraphics);
                }
            },
            documentTemplate: undefined,
            alignment: 1,
            templateLayerMode: undefined
        };
        internalDocument._sections = [];
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                templateLookupCount++;
                return templateLookupCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                directionCallCount++;
                return 'UnexpectedDirection';
            };
        internalDocument._renderPageTemplates(
            fakePage,
            true,
            undefined
        );
        internalDocument._sections =
            originalSections;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        expect(templateLookupCount).toBe(4);
        expect(directionCallCount).toBe(0);
        expect(drawCallCount).toBe(1);
        expect(receivedDirection).toBeUndefined();
        document.destroy();
    });
    it('1041642 does not use late graphics path when graphics are unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any =
            document as any;
        const page: PdfPage =
            document.addPage();
        const internalPage: any =
            page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalLoadContents: any =
            internalPage._loadContents;
        const originalParseGraphics: any =
            internalPage._parseGraphics;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        const originalGraphics: any =
            internalPage._g;
        const originalNeedInitializeGraphics: boolean =
            internalPage._needInitializeGraphics;
        const originalAccessedBeforeTemplate: boolean =
            internalPage._accessedBeforeTemplate;
        const originalTemplatesRendered: boolean =
            internalPage._templatesRendered;
        const originalContents: any =
            internalPage._contents;
        const testGraphics: any = {
            graphicsName: 'TestGraphics'
        };
        let sideCallCount: number = 0;
        let parseGraphicsCallCount: number = 0;
        let loadContentsCallCount: number = 0;
        let drawCallCount: number = 0;
        let receivedGraphics: any;
        const templateInformation: any = {
            template: {
                _draw: (
                    graphics: any,
                    _x: number,
                    _y: number,
                    _width: number,
                    _height: number,
                    _direction: string | undefined
                ): void => {
                    drawCallCount++;
                    receivedGraphics = graphics;
                }
            },
            documentTemplate: undefined,
            alignment: 1,
            templateLayerMode: undefined
        };
        internalPage._getSectionIndex =
            (): number => {
                return -1;
            };
        /*
         * The source isLateGraphics expression must be false because
         * page._g is undefined.
         *
         * Several mutants treat this state as late graphics because
         * _needInitializeGraphics is false.
         */
        internalPage._g = undefined;
        internalPage._needInitializeGraphics = false;
        internalPage._accessedBeforeTemplate = true;
        internalPage._templatesRendered = false;
        internalPage._contents = [];
        /*
         * Prevent the real page.graphics getter from parsing actual
         * page contents. Return a controlled graphics object instead.
         */
        internalPage._parseGraphics =
            (): any => {
                parseGraphicsCallCount++;
                internalPage._g = testGraphics;
                return testGraphics;
            };
        internalPage._loadContents =
            (): void => {
                loadContentsCallCount++;
                internalPage._contents = [];
            };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        /*
         * Return one template only. The other three template sides
         * return null.
         */
        internalDocument._getTemplateForSide =
            (): any => {
                sideCallCount++;
                return sideCallCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            undefined
        );
        /*
         * Capture values needed after restoration.
         */
        const capturedParseGraphicsCallCount: number =
            parseGraphicsCallCount;
        const capturedLoadContentsCallCount: number =
            loadContentsCallCount;
        const capturedDrawCallCount: number =
            drawCallCount;
        const capturedReceivedGraphics: any =
            receivedGraphics;
        const capturedTemplatesRendered: boolean =
            internalPage._templatesRendered;
        /*
         * Restore all changed methods and page state before assertions.
         */
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalPage._loadContents =
            originalLoadContents;
        internalPage._parseGraphics =
            originalParseGraphics;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        internalPage._g =
            originalGraphics;
        internalPage._needInitializeGraphics =
            originalNeedInitializeGraphics;
        internalPage._accessedBeforeTemplate =
            originalAccessedBeforeTemplate;
        internalPage._templatesRendered =
            originalTemplatesRendered;
        internalPage._contents =
            originalContents;
        expect(sideCallCount).toBe(4);
        /*
         * Source behavior:
         * isLateGraphics is false, so the normal graphics branch runs.
         */
        expect(capturedParseGraphicsCallCount).toBe(1);
        expect(capturedLoadContentsCallCount).toBe(0);
        expect(capturedDrawCallCount).toBe(1);
        expect(capturedReceivedGraphics).toBe(
            testGraphics
        );
        expect(capturedTemplatesRendered).toBeFalsy();
        expect(internalPage._getSectionIndex).toBe(
            originalGetSectionIndex
        );
        expect(internalPage._loadContents).toBe(
            originalLoadContents
        );
        expect(internalPage._parseGraphics).toBe(
            originalParseGraphics
        );
        expect(
            internalDocument._getSectionTemplateForSide
        ).toBe(originalGetSectionTemplateForSide);
        expect(
            internalDocument._getTemplateForSide
        ).toBe(originalGetTemplateForSide);
        expect(
            internalDocument._getTemplateAlignmentPosition
        ).toBe(originalGetTemplateAlignmentPosition);
        document.destroy();
    });
    it('1041642 initializes foreground graphics when contents are empty', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        const originalDrawForegroundTemplate: any =
            internalDocument._drawForegroundTemplate;
        let templateLookupCount: number = 0;
        let saveCallCount: number = 0;
        let restoreCallCount: number = 0;
        let foregroundCallCount: number = 0;
        let receivedPage: any;
        let receivedTemplate: any;
        const fakeGraphics: any = {
            save: (): any => {
                saveCallCount++;
                return {};
            },
            restore: (): void => {
                restoreCallCount++;
            }
        };
        const fakePage: any = {
            _getSectionIndex: (): number => {
                return -1;
            },
            _g: fakeGraphics,
            _needInitializeGraphics: false,
            _accessedBeforeTemplate: false,
            _templatesRendered: false,
            _contents: [],
            graphics: fakeGraphics
        };
        const innerTemplate: any = {
            name: 'ForegroundTemplate'
        };
        const templateInformation: any = {
            template: {
                _template: innerTemplate
            },
            documentTemplate: undefined,
            alignment: 1,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        internalDocument._sections = [];
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                templateLookupCount++;
                return templateLookupCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._drawForegroundTemplate = (
            targetPage: any,
            targetTemplate: any,
            _position: any
        ): void => {
            foregroundCallCount++;
            receivedPage = targetPage;
            receivedTemplate = targetTemplate;
        };
        internalDocument._renderPageTemplates(
            fakePage,
            true,
            PdfTemplateLayerMode.foreground
        );
        internalDocument._sections =
            originalSections;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        internalDocument._drawForegroundTemplate =
            originalDrawForegroundTemplate;
        expect(templateLookupCount).toBe(4);
        expect(saveCallCount).toBe(1);
        expect(restoreCallCount).toBe(1);
        expect(foregroundCallCount).toBe(1);
        expect(receivedPage).toBe(fakePage);
        expect(receivedTemplate).toBe(
            innerTemplate
        );
        document.destroy();
    });
    it('1041642 does not initialize foreground graphics when contents exist', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        const originalDrawForegroundTemplate: any =
            internalDocument._drawForegroundTemplate;
        let templateLookupCount: number = 0;
        let saveCallCount: number = 0;
        let restoreCallCount: number = 0;
        let foregroundCallCount: number = 0;
        const fakeGraphics: any = {
            save: (): any => {
                saveCallCount++;
                return {};
            },
            restore: (): void => {
                restoreCallCount++;
            }
        };
        const fakePage: any = {
            _getSectionIndex: (): number => {
                return -1;
            },
            _g: fakeGraphics,
            _needInitializeGraphics: false,
            _accessedBeforeTemplate: false,
            _templatesRendered: false,
            _contents: [{}],
            graphics: fakeGraphics
        };
        const templateInformation: any = {
            template: {
                _template: {}
            },
            documentTemplate: undefined,
            alignment: 1,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        internalDocument._sections = [];
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                templateLookupCount++;
                return templateLookupCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._drawForegroundTemplate =
            (): void => {
                foregroundCallCount++;
            };
        internalDocument._renderPageTemplates(
            fakePage,
            true,
            PdfTemplateLayerMode.foreground
        );
        internalDocument._sections =
            originalSections;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        internalDocument._drawForegroundTemplate =
            originalDrawForegroundTemplate;
        expect(saveCallCount).toBe(0);
        expect(restoreCallCount).toBe(0);
        expect(foregroundCallCount).toBe(1);
        document.destroy();
    });
    it('1041642 skips late content insertion when loaded contents are empty', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalGetSectionIndex: any =
            internalPage._getSectionIndex;
        const originalLoadContents: any =
            internalPage._loadContents;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateForSide: any =
            internalDocument._getTemplateForSide;
        const originalGetTemplateAlignmentPosition: any =
            internalDocument._getTemplateAlignmentPosition;
        let sideCallCount: number = 0;
        let loadContentsCallCount: number = 0;
        let drawCallCount: number = 0;
        const templateInformation: any = {
            template: {
                _draw: (): void => {
                    drawCallCount++;
                }
            },
            documentTemplate: undefined,
            alignment: 1,
            templateLayerMode: undefined
        };
        internalPage._getSectionIndex = (): number => {
            return -1;
        };
        internalPage._g = {};
        internalPage._needInitializeGraphics = false;
        internalPage._accessedBeforeTemplate = true;
        internalPage._templatesRendered = false;
        internalPage._contents = [];
        internalPage._loadContents = (): void => {
            loadContentsCallCount++;
            internalPage._contents = [];
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                return null;
            };
        internalDocument._getTemplateForSide =
            (): any => {
                sideCallCount++;
                return sideCallCount === 1
                    ? templateInformation
                    : null;
            };
        internalDocument._getTemplateAlignmentPosition =
            (): any => {
                return {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                };
            };
        internalDocument._renderPageTemplates(
            page,
            true,
            undefined
        );
        internalPage._getSectionIndex =
            originalGetSectionIndex;
        internalPage._loadContents =
            originalLoadContents;
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateForSide =
            originalGetTemplateForSide;
        internalDocument._getTemplateAlignmentPosition =
            originalGetTemplateAlignmentPosition;
        expect(loadContentsCallCount).toBe(1);
        expect(
            internalPage._templatesRendered
        ).toBeTruthy();
        expect(
            internalPage._contents.length
        ).toBe(0);
        expect(
            internalPage._pageDictionary.has('Contents')
        ).toBeFalsy();
        expect(drawCallCount).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument _drawForegroundTemplate', () => {
    it('1041642 creates page resources and XObject for foreground template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any =
            document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const originalPageDictionary: _PdfDictionary =
            internalPage._pageDictionary;
        const originalLoadContents: any =
            internalPage._loadContents;
        const testPageDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const templateContent: _PdfContentStream =
            new _PdfContentStream([]);
        const template: any = {
            _size: {
                width: 100,
                height: 50
            },
            _content: templateContent,
            _key: undefined
        };
        const bounds: any = {
            x: 10,
            y: 20,
            width: 200,
            height: 100
        };
        let loadContentsCallCount: number = 0;
        /*
         * Use an empty dictionary so Resources is guaranteed
         * to be absent without calling an unsupported delete method.
         */
        internalPage._pageDictionary =
            testPageDictionary;
        internalPage._contents = [];
        internalPage._loadContents = (): void => {
            loadContentsCallCount++;
            internalPage._contents = [];
        };
        expect(
            testPageDictionary.has('Resources')
        ).toBeFalsy();
        internalDocument._drawForegroundTemplate(
            page,
            template,
            bounds
        );
        /*
         * Capture all results before restoring the page dictionary.
         */
        const pageResources: _PdfDictionary =
            testPageDictionary.get('Resources');
        const xObject: _PdfDictionary =
            pageResources.get('XObject');
        const templateReference: _PdfReference =
            xObject.getRaw(
                template._key
            ) as _PdfReference;
        const contentReference: _PdfReference =
            internalPage._contents[0];
        const contentStream: _PdfContentStream =
            document._crossReference._fetch(
                contentReference
            ) as _PdfContentStream;
        /*
         * Restore methods and page state before assertions.
         */
        internalPage._loadContents =
            originalLoadContents;
        internalPage._pageDictionary =
            originalPageDictionary;
        expect(loadContentsCallCount).toBe(1);
        expect(
            testPageDictionary.has('Resources')
        ).toBeTruthy();
        expect(
            testPageDictionary.has('')
        ).toBeFalsy();
        expect(pageResources).toBeDefined();
        expect(
            pageResources instanceof _PdfDictionary
        ).toBeTruthy();
        expect(
            pageResources.has('XObject')
        ).toBeTruthy();
        expect(
            pageResources.has('')
        ).toBeFalsy();
        expect(xObject).toBeDefined();
        expect(
            xObject instanceof _PdfDictionary
        ).toBeTruthy();
        expect(template._key).toBeDefined();
        expect(typeof template._key).toBe('string');
        expect(
            template._key.length
        ).toBeGreaterThan(0);
        expect(
            xObject.has(template._key)
        ).toBeTruthy();
        expect(templateReference).toBeDefined();
        expect(
            templateReference instanceof _PdfReference
        ).toBeTruthy();
        expect(
            document._crossReference._fetch(
                templateReference
            )
        ).toBe(templateContent);
        expect(
            internalPage._contents.length
        ).toBe(1);
        expect(contentReference).toBeDefined();
        expect(
            contentReference instanceof _PdfReference
        ).toBeTruthy();
        expect(contentStream).toBeDefined();
        expect(
            contentStream instanceof _PdfContentStream
        ).toBeTruthy();
        expect(
            contentStream.dictionary.has('Resources')
        ).toBeTruthy();
        expect(
            contentStream.dictionary.has('')
        ).toBeFalsy();
        expect(
            contentStream.dictionary.get('Resources')
        ).toBe(pageResources);
        expect(
            internalPage._loadContents
        ).toBe(originalLoadContents);
        expect(
            internalPage._pageDictionary
        ).toBe(originalPageDictionary);
        document.destroy();
    });
    it('1041642 reuses existing page resources and XObject dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any =
            document as any;
        const page: PdfPage = document.addPage();
        const internalPage: any = page as any;
        const pageResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const xObject: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const templateContent: _PdfContentStream =
            new _PdfContentStream([]);
        const template: any = {
            _size: {
                width: 100,
                height: 50
            },
            _content: templateContent,
            _key: 'ExistingTemplateKey'
        };
        const bounds: any = {
            x: 0,
            y: 0,
            width: 100,
            height: 50
        };
        const originalLoadContents: any =
            internalPage._loadContents;
        xObject.update(
            'ExistingEntry',
            'ExistingValue'
        );
        pageResources.update(
            'XObject',
            xObject
        );
        page._pageDictionary.update(
            'Resources',
            pageResources
        );
        internalPage._contents = [];
        internalPage._loadContents = (): void => {
            internalPage._contents = [];
        };
        internalDocument._drawForegroundTemplate(
            page,
            template,
            bounds
        );
        internalPage._loadContents =
            originalLoadContents;
        expect(
            page._pageDictionary.get('Resources')
        ).toBe(pageResources);
        expect(
            pageResources.get('XObject')
        ).toBe(xObject);
        expect(
            xObject.get('ExistingEntry')
        ).toBe('ExistingValue');
        expect(template._key).toBe(
            'ExistingTemplateKey'
        );
        expect(
            xObject.has('ExistingTemplateKey')
        ).toBeTruthy();
        const templateReference: _PdfReference =
            xObject.getRaw(
                'ExistingTemplateKey'
            ) as _PdfReference;
        expect(
            document._crossReference._fetch(
                templateReference
            )
        ).toBe(templateContent);
        expect(pageResources.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 preserves existing foreground template key', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const page: PdfPage =
            document.addPage();
        const internalPage: any =
            page as any;
        const originalLoadContents: any =
            internalPage._loadContents;
        const template: any = {
            _size: {
                width: 100,
                height: 100
            },
            _content:
                new _PdfContentStream([]),
            _key: 'FixedTemplateKey'
        };
        internalPage._contents = [];
        internalPage._loadContents =
            (): void => {
                internalPage._contents = [];
            };
        /*
         * Call the method on PdfDocument.
         */
        internalDocument._drawForegroundTemplate(
            page,
            template,
            {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
        );
        internalPage._loadContents =
            originalLoadContents;
        expect(template._key).toBe(
            'FixedTemplateKey'
        );
        const pageResources: _PdfDictionary =
            page._pageDictionary.get(
                'Resources'
            );
        const xObject: _PdfDictionary =
            pageResources.get('XObject');
        expect(
            xObject.has('FixedTemplateKey')
        ).toBeTruthy();
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTemplateForSide', () => {
    it('1041642 returns null for an unsupported template side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTemplateByKey: any =
            internalDocument._getTemplateByKey;
        let templateLookupCallCount: number = 0;
        internalDocument._getTemplateByKey =
            (_key: any): any => {
                templateLookupCallCount++;
                return {
                    template: {}
                };
            };
        const result: any =
            internalDocument._getTemplateForSide(
                1041642,
                true
            );
        internalDocument._getTemplateByKey =
            originalGetTemplateByKey;
        expect(result).toBeNull();
        expect(templateLookupCallCount).toBe(0);
        expect(
            internalDocument._getTemplateByKey
        ).toBe(originalGetTemplateByKey);
        document.destroy();
    });
    it('1041642 uses explicit section index zero', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateByKey: any =
            internalDocument._getTemplateByKey;
        const section: any = {
            name: 'FirstSection'
        };
        const sectionTemplateInformation: any = {
            template: {
                name: 'SectionTemplate'
            },
            templateLayerMode:
                PdfTemplateLayerMode.background,
            alignment: 1,
            documentTemplate: undefined
        };
        let receivedSection: any;
        let sectionLookupCallCount: number = 0;
        let documentLookupCallCount: number = 0;
        internalDocument._sections = [
            section
        ];
        internalDocument._getSectionTemplateForSide =
            (
                receivedValue: any,
                side: _TemplateSide,
                isOddPage: boolean
            ): any => {
                sectionLookupCallCount++;
                receivedSection = receivedValue;
                expect(side).toBe(_TemplateSide.top);
                expect(isOddPage).toBeTruthy();
                return sectionTemplateInformation;
            };
        internalDocument._getTemplateByKey =
            (_key: any): any => {
                documentLookupCallCount++;
                return null;
            };
        const result: any =
            internalDocument._getTemplateForSide(
                _TemplateSide.top,
                true,
                0
            );
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateByKey =
            originalGetTemplateByKey;
        expect(sectionLookupCallCount).toBe(1);
        expect(documentLookupCallCount).toBe(0);
        expect(receivedSection).toBe(section);
        expect(result).toBe(
            sectionTemplateInformation
        );
        document.destroy();
    });
    it('1041642 does not use section when section index is omitted', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetSectionTemplateForSide: any =
            internalDocument._getSectionTemplateForSide;
        const originalGetTemplateByKey: any =
            internalDocument._getTemplateByKey;
        const expectedTemplate: any = {
            name: 'DocumentTemplate'
        };
        const documentTemplateData: any = {
            template: expectedTemplate,
            templateLayerMode:
                PdfTemplateLayerMode.foreground,
            alignment: 2
        };
        let sectionLookupCallCount: number = 0;
        let documentLookupCallCount: number = 0;
        internalDocument._sections = [
            {
                name: 'FirstSection'
            },
            {
                name: 'SecondSection'
            }
        ];
        internalDocument._template = {
            name: 'DocumentTemplateCollection'
        };
        internalDocument._getSectionTemplateForSide =
            (): any => {
                sectionLookupCallCount++;
                return {
                    template: {
                        name: 'UnexpectedSectionTemplate'
                    }
                };
            };
        internalDocument._getTemplateByKey =
            (_key: any): any => {
                documentLookupCallCount++;
                return documentLookupCallCount === 1
                    ? documentTemplateData
                    : null;
            };
        const result: any =
            internalDocument._getTemplateForSide(
                _TemplateSide.top,
                true
            );
        internalDocument._getSectionTemplateForSide =
            originalGetSectionTemplateForSide;
        internalDocument._getTemplateByKey =
            originalGetTemplateByKey;
        expect(sectionLookupCallCount).toBe(0);
        expect(documentLookupCallCount).toBe(1);
        expect(result).toBeDefined();
        expect(result.template).toBe(
            expectedTemplate
        );
        expect(result.templateLayerMode).toBe(
            PdfTemplateLayerMode.foreground
        );
        expect(result.alignment).toBe(2);
        expect(result.documentTemplate).toBe(
            internalDocument._template
        );
        document.destroy();
    });
    it('1041642 falls back to base template when odd template is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTemplateByKey: any =
            internalDocument._getTemplateByKey;
        const expectedTemplate: any = {
            name: 'BaseTopTemplate'
        };
        const baseTemplateData: any = {
            template: expectedTemplate,
            templateLayerMode:
                PdfTemplateLayerMode.background,
            alignment: 3
        };
        let lookupCallCount: number = 0;
        internalDocument._sections = [];
        internalDocument._template = {
            name: 'DocumentTemplateCollection'
        };
        internalDocument._getTemplateByKey =
            (_key: any): any => {
                lookupCallCount++;
                return lookupCallCount === 1
                    ? null
                    : baseTemplateData;
            };
        const result: any =
            internalDocument._getTemplateForSide(
                _TemplateSide.top,
                true,
                -1
            );
        internalDocument._getTemplateByKey =
            originalGetTemplateByKey;
        expect(lookupCallCount).toBe(2);
        expect(result).toBeDefined();
        expect(result.template).toBe(
            expectedTemplate
        );
        expect(result.templateLayerMode).toBe(
            PdfTemplateLayerMode.background
        );
        expect(result.alignment).toBe(3);
        expect(result.documentTemplate).toBe(
            internalDocument._template
        );
        document.destroy();
    });
    it('1041642 returns null when side templates are unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTemplateByKey: any =
            internalDocument._getTemplateByKey;
        let lookupCallCount: number = 0;
        internalDocument._sections = [];
        internalDocument._getTemplateByKey =
            (_key: any): any => {
                lookupCallCount++;
                return null;
            };
        const result: any =
            internalDocument._getTemplateForSide(
                _TemplateSide.bottom,
                false,
                -1
            );
        internalDocument._getTemplateByKey =
            originalGetTemplateByKey;
        expect(lookupCallCount).toBe(2);
        expect(result).toBeNull();
        document.destroy();
    });
});
describe('1041642 PdfDocument _getSectionIndexByPage', () => {
    it('1041642 returns minus one when sections are undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const parentReference: any = {};
        internalDocument._sections = undefined;
        const result: number =
            internalDocument._getSectionIndexByPage(
                parentReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(-1);
        expect(result).not.toBe(1);
        expect(internalDocument._sections).toBe(
            originalSections
        );
        document.destroy();
    });
    it('1041642 returns minus one when sections are empty', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const parentReference: any = {};
        internalDocument._sections = [];
        const result: number =
            internalDocument._getSectionIndexByPage(
                parentReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(-1);
        expect(result).not.toBe(1);
        document.destroy();
    });
    it('1041642 returns zero for the first matching section', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const firstReference: any = {};
        const secondReference: any = {};
        internalDocument._sections = [
            {
                _reference: firstReference
            },
            {
                _reference: secondReference
            }
        ];
        const result: number =
            internalDocument._getSectionIndexByPage(
                firstReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(0);
        expect(result).not.toBe(1);
        document.destroy();
    });
    it('1041642 returns the matching section index', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const firstReference: any = {};
        const secondReference: any = {};
        const thirdReference: any = {};
        internalDocument._sections = [
            {
                _reference: firstReference
            },
            {
                _reference: secondReference
            },
            {
                _reference: thirdReference
            }
        ];
        const result: number =
            internalDocument._getSectionIndexByPage(
                secondReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(1);
        document.destroy();
    });
    it('1041642 returns minus one when no section matches', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const firstReference: any = {};
        const secondReference: any = {};
        const unavailableReference: any = {};
        internalDocument._sections = [
            {
                _reference: firstReference
            },
            {
                _reference: secondReference
            }
        ];
        const result: number =
            internalDocument._getSectionIndexByPage(
                unavailableReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(-1);
        expect(result).not.toBe(1);
        document.destroy();
    });
    it('1041642 ignores unavailable section entries', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSections: any =
            internalDocument._sections;
        const matchingReference: any = {};
        internalDocument._sections = [
            undefined,
            {
                _reference: matchingReference
            }
        ];
        const result: number =
            internalDocument._getSectionIndexByPage(
                matchingReference
            );
        internalDocument._sections =
            originalSections;
        expect(result).toBe(1);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTemplateByKey', () => {
    it('1041642 returns undefined when document template is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        internalDocument._template = undefined;
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.left
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1041642 returns left document template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const leftTemplate: any = {
            name: 'LeftTemplate'
        };
        internalDocument._template = {
            left: leftTemplate
        };
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.left
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(leftTemplate);
        document.destroy();
    });
    it('1041642 returns even left document template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const evenLeftTemplate: any = {
            name: 'EvenLeftTemplate'
        };
        internalDocument._template = {
            evenLeft: evenLeftTemplate
        };
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.evenLeft
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(evenLeftTemplate);
        document.destroy();
    });
    it('1041642 returns odd top document template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const oddTopTemplate: any = {
            name: 'OddTopTemplate'
        };
        internalDocument._template = {
            oddTop: oddTopTemplate
        };
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.oddTop
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(oddTopTemplate);
        document.destroy();
    });
    it('1041642 returns odd bottom document template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const oddBottomTemplate: any = {
            name: 'OddBottomTemplate'
        };
        internalDocument._template = {
            oddBottom: oddBottomTemplate
        };
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.oddBottom
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(oddBottomTemplate);
        document.destroy();
    });
    it('1041642 returns odd left document template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const oddLeftTemplate: any = {
            name: 'OddLeftTemplate'
        };
        internalDocument._template = {
            oddLeft: oddLeftTemplate
        };
        const result: any =
            internalDocument._getTemplateByKey(
                _PdfDocumentTemplateKey.oddLeft
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(oddLeftTemplate);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getSectionTemplateForSide', () => {
    it('1041642 returns null for unsupported template side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const section: any = {
            template: {
                top: {
                    template: {
                        name: 'TopTemplate'
                    }
                }
            }
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                1041642,
                true
            );
        expect(result).toBeNull();
        document.destroy();
    });
    it('1041642 returns odd bottom section template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const oddBottomTemplate: any = {
            name: 'OddBottomTemplate'
        };
        const oddBottomInformation: any = {
            template: oddBottomTemplate,
            alignment: 2,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        const sectionTemplate: any = {
            bottom: {
                template: {
                    name: 'BaseBottomTemplate'
                }
            },
            oddBottom: oddBottomInformation
        };
        const section: any = {
            template: sectionTemplate
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                _TemplateSide.bottom,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(
            oddBottomTemplate
        );
        expect(result.alignment).toBe(2);
        expect(result.templateLayerMode).toBe(
            PdfTemplateLayerMode.foreground
        );
        expect(result.documentTemplate).toBe(
            sectionTemplate
        );
        document.destroy();
    });
    it('1041642 returns even left section template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const evenLeftTemplate: any = {
            name: 'EvenLeftTemplate'
        };
        const evenLeftInformation: any = {
            template: evenLeftTemplate,
            alignment: 3,
            templateLayerMode:
                PdfTemplateLayerMode.background
        };
        const sectionTemplate: any = {
            left: {
                template: {
                    name: 'BaseLeftTemplate'
                }
            },
            evenLeft: evenLeftInformation
        };
        const section: any = {
            template: sectionTemplate
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                _TemplateSide.left,
                false
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(
            evenLeftTemplate
        );
        expect(result.alignment).toBe(3);
        expect(result.templateLayerMode).toBe(
            PdfTemplateLayerMode.background
        );
        expect(result.documentTemplate).toBe(
            sectionTemplate
        );
        document.destroy();
    });
    it('1041642 returns odd right section template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const oddRightTemplate: any = {
            name: 'OddRightTemplate'
        };
        const oddRightInformation: any = {
            template: oddRightTemplate,
            alignment: 1,
            templateLayerMode: undefined
        };
        const sectionTemplate: any = {
            right: {
                template: {
                    name: 'BaseRightTemplate'
                }
            },
            oddRight: oddRightInformation
        };
        const section: any = {
            template: sectionTemplate
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                _TemplateSide.right,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(
            oddRightTemplate
        );
        expect(result.documentTemplate).toBe(
            sectionTemplate
        );
        document.destroy();
    });
    it('1041642 falls back to base template for odd page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const baseTemplate: any = {
            name: 'BaseTopTemplate'
        };
        const baseInformation: any = {
            template: baseTemplate,
            alignment: 1,
            templateLayerMode:
                PdfTemplateLayerMode.background
        };
        const sectionTemplate: any = {
            top: baseInformation
        };
        const section: any = {
            template: sectionTemplate
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                _TemplateSide.top,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(
            baseTemplate
        );
        expect(result.documentTemplate).toBe(
            sectionTemplate
        );
        document.destroy();
    });
    it('1041642 falls back to base template for even page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const baseTemplate: any = {
            name: 'BaseBottomTemplate'
        };
        const baseInformation: any = {
            template: baseTemplate,
            alignment: 2,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        const sectionTemplate: any = {
            bottom: baseInformation
        };
        const section: any = {
            template: sectionTemplate
        };
        const result: any =
            internalDocument._getSectionTemplateForSide(
                section,
                _TemplateSide.bottom,
                false
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(
            baseTemplate
        );
        expect(result.documentTemplate).toBe(
            sectionTemplate
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTemplateAlignmentPosition', () => {
    it('1041642 returns zero bounds when template is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const page: PdfPage = document.addPage();
        const documentTemplate: any = {};
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                return 'top';
            };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                undefined,
                _TemplateSide.top,
                true
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        expect(result).toEqual({
            x: 0,
            y: 0,
            width: 0,
            height: 0
        });
        document.destroy();
    });
    it('1041642 uses odd template alignment bounds for odd page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const originalGetAlignmentBounds: any =
            internalDocument._getAlignmentBounds;
        const originalGetTemplateDockBounds: any =
            internalDocument._getTemplateDockBounds;
        const oddTemplate: any = {
            name: 'OddTopTemplate'
        };
        const baseTemplate: any = {
            name: 'BaseTopTemplate'
        };
        const documentTemplate: any = {
            oddTop: {
                template: oddTemplate
            },
            top: {
                template: baseTemplate
            }
        };
        const expectedBounds: any = {
            x: 10,
            y: 20,
            width: 100,
            height: 30
        };
        let alignmentCallCount: number = 0;
        let dockCallCount: number = 0;
        let receivedTemplate: any;
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                return 'top';
            };
        internalDocument._getAlignmentBounds = (
            _side: _TemplateSide,
            template: any,
            targetPage: PdfPage,
            alignment: any
        ): any => {
            alignmentCallCount++;
            receivedTemplate = template;
            expect(targetPage).toBe(page);
            expect(alignment).toBe(1);
            return expectedBounds;
        };
        internalDocument._getTemplateDockBounds =
            (): any => {
                dockCallCount++;
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                1,
                _TemplateSide.top,
                true
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        internalDocument._getAlignmentBounds =
            originalGetAlignmentBounds;
        internalDocument._getTemplateDockBounds =
            originalGetTemplateDockBounds;
        expect(result).toBe(expectedBounds);
        expect(alignmentCallCount).toBe(1);
        expect(dockCallCount).toBe(0);
        expect(receivedTemplate).toBe(
            oddTemplate
        );
        document.destroy();
    });
    it('1041642 uses even template alignment bounds for even page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const originalGetAlignmentBounds: any =
            internalDocument._getAlignmentBounds;
        const evenTemplate: any = {
            name: 'EvenLeftTemplate'
        };
        const baseTemplate: any = {
            name: 'BaseLeftTemplate'
        };
        const documentTemplate: any = {
            evenLeft: {
                template: evenTemplate
            },
            left: {
                template: baseTemplate
            }
        };
        const expectedBounds: any = {
            x: 30,
            y: 40,
            width: 50,
            height: 60
        };
        let receivedTemplate: any;
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                return 'left';
            };
        internalDocument._getAlignmentBounds = (
            _side: _TemplateSide,
            template: any
        ): any => {
            receivedTemplate = template;
            return expectedBounds;
        };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                1,
                _TemplateSide.left,
                false
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        internalDocument._getAlignmentBounds =
            originalGetAlignmentBounds;
        expect(result).toBe(expectedBounds);
        expect(receivedTemplate).toBe(
            evenTemplate
        );
        document.destroy();
    });
    it('1041642 uses dock bounds when alignment is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const originalGetAlignmentBounds: any =
            internalDocument._getAlignmentBounds;
        const originalGetTemplateDockBounds: any =
            internalDocument._getTemplateDockBounds;
        const baseTemplate: any = {
            name: 'BaseRightTemplate'
        };
        const documentTemplate: any = {
            right: {
                template: baseTemplate
            }
        };
        const expectedBounds: any = {
            x: 5,
            y: 6,
            width: 7,
            height: 8
        };
        let sideToStringCallCount: number = 0;
        let alignmentCallCount: number = 0;
        let dockCallCount: number = 0;
        let receivedDirection: string = '';
        internalDocument._templateSideToString =
            (_side: _TemplateSide): string => {
                sideToStringCallCount++;
                return 'right';
            };
        internalDocument._getAlignmentBounds =
            (): any => {
                alignmentCallCount++;
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            };
        internalDocument._getTemplateDockBounds = (
            targetPage: PdfPage,
            template: any,
            direction: string
        ): any => {
            dockCallCount++;
            receivedDirection = direction;
            expect(targetPage).toBe(page);
            expect(template).toBe(baseTemplate);
            return expectedBounds;
        };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                undefined,
                _TemplateSide.right,
                true
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        internalDocument._getAlignmentBounds =
            originalGetAlignmentBounds;
        internalDocument._getTemplateDockBounds =
            originalGetTemplateDockBounds;
        expect(result).toBe(expectedBounds);
        expect(sideToStringCallCount).toBe(2);
        expect(alignmentCallCount).toBe(0);
        expect(dockCallCount).toBe(1);
        expect(receivedDirection).toBe('right');
        document.destroy();
    });
    it('1041642 uses dock bounds for vertical none alignment', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const originalGetAlignmentBounds: any =
            internalDocument._getAlignmentBounds;
        const originalGetTemplateDockBounds: any =
            internalDocument._getTemplateDockBounds;
        const template: any = {
            name: 'BottomTemplate'
        };
        const documentTemplate: any = {
            bottom: {
                template
            }
        };
        const expectedBounds: any = {
            x: 1,
            y: 2,
            width: 3,
            height: 4
        };
        let alignmentCallCount: number = 0;
        let dockCallCount: number = 0;
        internalDocument._templateSideToString =
            (): string => {
                return 'bottom';
            };
        internalDocument._getAlignmentBounds =
            (): any => {
                alignmentCallCount++;
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            };
        internalDocument._getTemplateDockBounds =
            (): any => {
                dockCallCount++;
                return expectedBounds;
            };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                PdfTemplateVerticalAlignment.none,
                _TemplateSide.bottom,
                true
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        internalDocument._getAlignmentBounds =
            originalGetAlignmentBounds;
        internalDocument._getTemplateDockBounds =
            originalGetTemplateDockBounds;
        expect(result).toBe(expectedBounds);
        expect(alignmentCallCount).toBe(0);
        expect(dockCallCount).toBe(1);
        document.destroy();
    });
    it('1041642 uses dock bounds for horizontal none alignment', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const originalTemplateSideToString: any =
            internalDocument._templateSideToString;
        const originalGetAlignmentBounds: any =
            internalDocument._getAlignmentBounds;
        const originalGetTemplateDockBounds: any =
            internalDocument._getTemplateDockBounds;
        const template: any = {
            name: 'LeftTemplate'
        };
        const documentTemplate: any = {
            left: {
                template
            }
        };
        const expectedBounds: any = {
            x: 5,
            y: 6,
            width: 7,
            height: 8
        };
        let alignmentCallCount: number = 0;
        let dockCallCount: number = 0;
        internalDocument._templateSideToString =
            (): string => {
                return 'left';
            };
        internalDocument._getAlignmentBounds =
            (): any => {
                alignmentCallCount++;
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            };
        internalDocument._getTemplateDockBounds =
            (): any => {
                dockCallCount++;
                return expectedBounds;
            };
        const result: any =
            internalDocument._getTemplateAlignmentPosition(
                page,
                documentTemplate,
                PdfTemplateHorizontalAlignment.none,
                _TemplateSide.left,
                true
            );
        internalDocument._templateSideToString =
            originalTemplateSideToString;
        internalDocument._getAlignmentBounds =
            originalGetAlignmentBounds;
        internalDocument._getTemplateDockBounds =
            originalGetTemplateDockBounds;
        expect(result).toBe(expectedBounds);
        expect(alignmentCallCount).toBe(0);
        expect(dockCallCount).toBe(1);
        document.destroy();
    });
    it('1041642 converts every template side to string', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._templateSideToString(
                _TemplateSide.top
            )
        ).toBe('top');
        expect(
            internalDocument._templateSideToString(
                _TemplateSide.bottom
            )
        ).toBe('bottom');
        expect(
            internalDocument._templateSideToString(
                _TemplateSide.left
            )
        ).toBe('left');
        expect(
            internalDocument._templateSideToString(
                _TemplateSide.right
            )
        ).toBe('right');
        document.destroy();
    });
    it('1041642 returns top for unsupported template side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: string =
            internalDocument._templateSideToString(
                1041642
            );
        expect(result).toBe('top');
        document.destroy();
    });
});
describe('1041642 PdfDocument _normalizeTemplateSide', () => {
    it('1041642 preserves direct template side values', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._normalizeTemplateSide(
                _TemplateSide.top
            )
        ).toBe(_TemplateSide.top);
        expect(
            internalDocument._normalizeTemplateSide(
                _TemplateSide.bottom
            )
        ).toBe(_TemplateSide.bottom);
        expect(
            internalDocument._normalizeTemplateSide(
                _TemplateSide.left
            )
        ).toBe(_TemplateSide.left);
        expect(
            internalDocument._normalizeTemplateSide(
                _TemplateSide.right
            )
        ).toBe(_TemplateSide.right);
        document.destroy();
    });
    it('1041642 normalizes top template keys', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.top
            )
        ).toBe(_TemplateSide.top);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.evenTop
            )
        ).toBe(_TemplateSide.top);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.oddTop
            )
        ).toBe(_TemplateSide.top);
        document.destroy();
    });
    it('1041642 normalizes bottom template keys', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.bottom
            )
        ).toBe(_TemplateSide.bottom);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.evenBottom
            )
        ).toBe(_TemplateSide.bottom);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.oddBottom
            )
        ).toBe(_TemplateSide.bottom);
        document.destroy();
    });
    it('1041642 normalizes left template keys', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.left
            )
        ).toBe(_TemplateSide.left);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.evenLeft
            )
        ).toBe(_TemplateSide.left);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.oddLeft
            )
        ).toBe(_TemplateSide.left);
        document.destroy();
    });
    it('1041642 normalizes right template keys', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.right
            )
        ).toBe(_TemplateSide.right);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.evenRight
            )
        ).toBe(_TemplateSide.right);
        expect(
            internalDocument._normalizeTemplateSide(
                _PdfDocumentTemplateKey.oddRight
            )
        ).toBe(_TemplateSide.right);
        document.destroy();
    });
    it('1041642 returns right for unsupported template key', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: _TemplateSide =
            internalDocument._normalizeTemplateSide(
                1041642
            );
        expect(result).toBe(
            _TemplateSide.right
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _mapTemplateAlignmentStyle', () => {
    it('1041642 maps undefined alignment using default styles', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.bottomLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    it('1041642 maps horizontal none alignment using default styles', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                PdfTemplateHorizontalAlignment.none
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.none
            )
        ).toBe(_PdfAlignmentStyle.bottomLeft);
        document.destroy();
    });
    it('1041642 maps vertical none alignment using default styles', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                PdfTemplateVerticalAlignment.none
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                PdfTemplateVerticalAlignment.none
            )
        ).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    it('1041642 maps top horizontal alignments', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                PdfTemplateHorizontalAlignment.left
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                PdfTemplateHorizontalAlignment.center
            )
        ).toBe(_PdfAlignmentStyle.topCenter);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                PdfTemplateHorizontalAlignment.right
            )
        ).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    it('1041642 maps bottom horizontal alignments', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.left
            )
        ).toBe(_PdfAlignmentStyle.bottomLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.center
            )
        ).toBe(_PdfAlignmentStyle.bottomCenter);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.right
            )
        ).toBe(_PdfAlignmentStyle.bottomRight);
        document.destroy();
    });
    it('1041642 maps left vertical alignments', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                PdfTemplateVerticalAlignment.top
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                PdfTemplateVerticalAlignment.middle
            )
        ).toBe(_PdfAlignmentStyle.middleLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                PdfTemplateVerticalAlignment.bottom
            )
        ).toBe(_PdfAlignmentStyle.bottomLeft);
        document.destroy();
    });
    it('1041642 maps right vertical alignments', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                PdfTemplateVerticalAlignment.top
            )
        ).toBe(_PdfAlignmentStyle.topRight);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                PdfTemplateVerticalAlignment.middle
            )
        ).toBe(_PdfAlignmentStyle.middleRight);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                PdfTemplateVerticalAlignment.bottom
            )
        ).toBe(_PdfAlignmentStyle.bottomRight);
        document.destroy();
    });
    it('1041642 normalizes document template keys before mapping alignment', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _PdfDocumentTemplateKey.oddTop,
                PdfTemplateHorizontalAlignment.center
            )
        ).toBe(_PdfAlignmentStyle.topCenter);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _PdfDocumentTemplateKey.evenBottom,
                PdfTemplateHorizontalAlignment.right
            )
        ).toBe(_PdfAlignmentStyle.bottomRight);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _PdfDocumentTemplateKey.oddLeft,
                PdfTemplateVerticalAlignment.middle
            )
        ).toBe(_PdfAlignmentStyle.middleLeft);
        expect(
            internalDocument._mapTemplateAlignmentStyle(
                _PdfDocumentTemplateKey.evenRight,
                PdfTemplateVerticalAlignment.bottom
            )
        ).toBe(_PdfAlignmentStyle.bottomRight);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTemplateAlignmentBounds', () => {
    it('1041642 does not calculate actual bounds for an existing page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: false,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                actualBoundsCallCount++;
                return [
                    5,
                    10,
                    500,
                    700
                ];
            }
        };
        let actualBoundsCallCount: number = 0;
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.top
            );
        expect(actualBoundsCallCount).toBe(0);
        expect(result).toBe(template._bounds);
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(40);
        document.destroy();
    });
    it('1041642 retains template bounds when actual bounds are unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): undefined => {
                return undefined;
            }
        };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.top
            );
        expect(result).toBe(template._bounds);
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(40);
        document.destroy();
    });
    it('1041642 retains template bounds when actual bounds are empty', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [];
            }
        };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.top
            );
        expect(result).toBe(template._bounds);
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(40);
        document.destroy();
    });
    it('1041642 applies top offset for top-left template on top side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [
                    10,
                    20,
                    500,
                    700
                ];
            }
        };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.top
            );
        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        document.destroy();
    });
    it('1041642 does not apply top offset for top-left template on left side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [
                    10,
                    20,
                    500,
                    700
                ];
            }
        };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.left
            );
        expect(result.x).toBe(-10);
        expect(result.y).toBe(0);
        document.destroy();
    });
    it('1041642 applies bottom indent only for bottom-left template on bottom side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [
                    10,
                    20,
                    500,
                    700
                ];
            }
        };
        let bottomIndentCallCount: number = 0;
        internalDocument._getBottomIndentHeight =
            (
                _page: any,
                includeMargins: boolean
            ): number => {
                bottomIndentCallCount++;
                expect(includeMargins).toBeFalsy();
                return 25;
            };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.bottomLeft,
                _TemplateSide.bottom
            );
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result.x).toBe(-10);
        expect(result.y).toBe(685);
        expect(bottomIndentCallCount).toBe(1);
        expect(
            internalDocument._getBottomIndentHeight
        ).toBe(originalGetBottomIndentHeight);
        document.destroy();
    });
    it('1041642 does not apply bottom indent for bottom-left template on left side', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 40
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {},
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [
                    10,
                    20,
                    500,
                    700
                ];
            }
        };
        let bottomIndentCallCount: number = 0;
        internalDocument._getBottomIndentHeight =
            (): number => {
                bottomIndentCallCount++;
                return 25;
            };
        const result: any =
            internalDocument._getTemplateAlignmentBounds(
                template,
                page,
                _PdfAlignmentStyle.bottomLeft,
                _TemplateSide.left
            );
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result.x).toBe(-10);
        expect(result.y).toBe(660);
        expect(bottomIndentCallCount).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument _isNonReservingTemplate', () => {
    it('1041642 returns false when template layer mode is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: boolean =
            internalDocument._isNonReservingTemplate(
                undefined
            );
        expect(result).toBeFalsy();
        expect(result).toBe(false);
        document.destroy();
    });
    it('1041642 returns true for background template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: boolean =
            internalDocument._isNonReservingTemplate(
                PdfTemplateLayerMode.background
            );
        expect(result).toBeTruthy();
        document.destroy();
    });
    it('1041642 returns true for foreground template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: boolean =
            internalDocument._isNonReservingTemplate(
                PdfTemplateLayerMode.foreground
            );
        expect(result).toBeTruthy();
        document.destroy();
    });
    it('1041642 returns false for normal reserving template mode', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: boolean =
            internalDocument._isNonReservingTemplate(
                1041642
            );
        expect(result).toBeFalsy();
        expect(result).toBe(false);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getLeftIndentWidth', () => {
    it('1041642 includes left margin when requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    left: 25
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getLeftIndentWidth(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(25);
        document.destroy();
    });
    it('1041642 excludes left margin when not requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    left: 25
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getLeftIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(0);
        document.destroy();
    });
    it('1041642 uses base and odd-left template widths for first page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    left: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            left: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddLeft: {
                template: {
                    _bounds: {
                        width: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenLeft: {
                template: {
                    _bounds: {
                        width: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getLeftIndentWidth(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(50);
        document.destroy();
    });
    it('1041642 uses base and even-left template widths for second page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    left: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            left: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddLeft: {
                template: {
                    _bounds: {
                        width: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenLeft: {
                template: {
                    _bounds: {
                        width: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getLeftIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(80);
        document.destroy();
    });
    it('1041642 ignores non-reserving left templates', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    left: 10
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            left: {
                template: {
                    _bounds: {
                        width: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.background
            },
            oddLeft: {
                template: {
                    _bounds: {
                        width: 200
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.foreground
            }
        };
        const result: number =
            internalDocument._getLeftIndentWidth(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(10);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getBottomIndentHeight', () => {
    it('1041642 includes bottom margin when requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 35
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(35);
        document.destroy();
    });
    it('1041642 excludes bottom margin when not requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 35
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(0);
        document.destroy();
    });
    it('1041642 uses odd bottom template height for first page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            bottom: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddBottom: {
                template: {
                    _bounds: {
                        height: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenBottom: {
                template: {
                    _bounds: {
                        height: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(50);
        document.destroy();
    });
    it('1041642 uses even bottom template height for second page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            bottom: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddBottom: {
                template: {
                    _bounds: {
                        height: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenBottom: {
                template: {
                    _bounds: {
                        height: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(80);
        document.destroy();
    });
    it('1041642 ignores non-reserving even bottom template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 0
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            bottom: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            evenBottom: {
                template: {
                    _bounds: {
                        height: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.background
            },
            oddBottom: {
                template: {
                    _bounds: {
                        height: 200
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(20);
        document.destroy();
    });
    it('1041642 ignores non-reserving odd bottom template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    bottom: 0
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            bottom: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddBottom: {
                template: {
                    _bounds: {
                        height: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.foreground
            },
            evenBottom: {
                template: {
                    _bounds: {
                        height: 200
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getBottomIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(20);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getRightIndentWidth', () => {
    it('1041642 includes right margin when requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 30
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(30);
        document.destroy();
    });
    it('1041642 excludes right margin when not requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 30
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(0);
        document.destroy();
    });
    it('1041642 uses odd right template width for first page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            right: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddRight: {
                template: {
                    _bounds: {
                        width: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenRight: {
                template: {
                    _bounds: {
                        width: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(50);
        document.destroy();
    });
    it('1041642 uses even right template width for second page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            right: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddRight: {
                template: {
                    _bounds: {
                        width: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenRight: {
                template: {
                    _bounds: {
                        width: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(80);
        document.destroy();
    });
    it('1041642 ignores non-reserving even right template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 0
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            right: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            evenRight: {
                template: {
                    _bounds: {
                        width: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.background
            },
            oddRight: {
                template: {
                    _bounds: {
                        width: 200
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(20);
        document.destroy();
    });
    it('1041642 ignores non-reserving odd right template', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    right: 0
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            right: {
                template: {
                    _bounds: {
                        width: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddRight: {
                template: {
                    _bounds: {
                        width: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.foreground
            },
            evenRight: {
                template: {
                    _bounds: {
                        width: 200
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getRightIndentWidth(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(20);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTopIndentHeight', () => {
    it('1041642 includes top margin when requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    top: 25
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getTopIndentHeight(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(25);
        expect(internalDocument._template).toBe(
            originalTemplate
        );
        document.destroy();
    });
    it('1041642 excludes top margin when not requested', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    top: 25
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = undefined;
        const result: number =
            internalDocument._getTopIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(0);
        document.destroy();
    });
    it('1041642 uses odd top template height for first page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    top: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            top: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddTop: {
                template: {
                    _bounds: {
                        height: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenTop: {
                template: {
                    _bounds: {
                        height: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getTopIndentHeight(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(50);
        document.destroy();
    });
    it('1041642 uses even top template height for second page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    top: 5
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 1
        };
        internalDocument._template = {
            top: {
                template: {
                    _bounds: {
                        height: 20
                    }
                },
                templateLayerMode: undefined
            },
            oddTop: {
                template: {
                    _bounds: {
                        height: 45
                    }
                },
                templateLayerMode: undefined
            },
            evenTop: {
                template: {
                    _bounds: {
                        height: 80
                    }
                },
                templateLayerMode: undefined
            }
        };
        const result: number =
            internalDocument._getTopIndentHeight(
                page,
                false
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(80);
        document.destroy();
    });
    it('1041642 ignores non-reserving top templates', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalTemplate: any =
            internalDocument._template;
        const page: any = {
            _pageSettings: {
                margins: {
                    top: 10
                }
            },
            _crossReference: {
                _document: document
            },
            _pageIndex: 0
        };
        internalDocument._template = {
            top: {
                template: {
                    _bounds: {
                        height: 100
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.background
            },
            oddTop: {
                template: {
                    _bounds: {
                        height: 200
                    }
                },
                templateLayerMode:
                    PdfTemplateLayerMode.foreground
            }
        };
        const result: number =
            internalDocument._getTopIndentHeight(
                page,
                true
            );
        internalDocument._template =
            originalTemplate;
        expect(result).toBe(10);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getTemplateDockBounds', () => {
    it('1041642 retains template bounds for an existing page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        let actualBoundsCallCount: number = 0;
        let actualSizeCallCount: number = 0;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: false,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    actualSizeCallCount++;
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                actualBoundsCallCount++;
                return [10, 20, 500, 700];
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(actualBoundsCallCount).toBe(0);
        expect(actualSizeCallCount).toBe(0);
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains template bounds when actual bounds are unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): undefined => {
                return undefined;
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains template bounds when actual size is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): undefined => {
                    return undefined;
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains template bounds for empty actual bounds', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [];
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains template bounds for empty actual size', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 calculates left dock bounds using reserving indents', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        let topIncludeMargins: boolean = true;
        let bottomIncludeMargins: boolean = true;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight = (
            _page: any,
            includeMargins: boolean
        ): number => {
            topIncludeMargins = includeMargins;
            return 30;
        };
        internalDocument._getBottomIndentHeight = (
            _page: any,
            includeMargins: boolean
        ): number => {
            bottomIncludeMargins = includeMargins;
            return 40;
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: 30,
            width: 100,
            height: 630
        });
        expect(topIncludeMargins).toBeFalsy();
        expect(bottomIncludeMargins).toBeFalsy();
        document.destroy();
    });
    it('1041642 uses zero left dock position for negative top indent', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return -10;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 40;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result.x).toBe(-10);
        expect(result.y).toBe(0);
        expect(result.width).toBe(100);
        expect(result.height).toBe(670);
        document.destroy();
    });
    it('1041642 calculates top dock bounds for positive page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 0;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'top'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: -20,
            width: 600,
            height: 50
        });
        document.destroy();
    });
    it('1041642 adjusts top dock position for negative page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, -700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 0;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'top'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: 780,
            width: 600,
            height: 50
        });
        document.destroy();
    });
    it('1041642 does not adjust top dock position for zero page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 0];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 0;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'top'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        expect(result.width).toBe(600);
        expect(result.height).toBe(50);
        document.destroy();
    });
    it('1041642 calculates right dock bounds using right indent', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const originalGetRightIndentWidth: any =
            internalDocument._getRightIndentWidth;
        let rightIncludeMargins: boolean = true;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 30;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 40;
            };
        internalDocument._getRightIndentWidth = (
            _page: any,
            includeMargins: boolean
        ): number => {
            rightIncludeMargins = includeMargins;
            return 25;
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'right'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        internalDocument._getRightIndentWidth =
            originalGetRightIndentWidth;
        expect(result).toEqual({
            x: 425,
            y: 30,
            width: 100,
            height: 630
        });
        expect(rightIncludeMargins).toBeFalsy();
        document.destroy();
    });
    it('1041642 uses zero right dock position for negative top indent', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const originalGetRightIndentWidth: any =
            internalDocument._getRightIndentWidth;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return -10;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 40;
            };
        internalDocument._getRightIndentWidth =
            (): number => {
                return 25;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'right'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        internalDocument._getRightIndentWidth =
            originalGetRightIndentWidth;
        expect(result.x).toBe(425);
        expect(result.y).toBe(0);
        expect(result.width).toBe(100);
        expect(result.height).toBe(670);
        document.destroy();
    });
    it('1041642 calculates bottom dock bounds for positive page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        let bottomIncludeMargins: boolean = true;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight = (
            _page: any,
            includeMargins: boolean
        ): number => {
            bottomIncludeMargins = includeMargins;
            return 25;
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'bottom'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: 675,
            width: 600,
            height: 50
        });
        expect(bottomIncludeMargins).toBeFalsy();
        document.destroy();
    });
    it('1041642 adjusts bottom dock position for negative page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, -700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 25;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'bottom'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: -1525,
            width: 600,
            height: 50
        });
        document.destroy();
    });
    it('1041642 does not adjust bottom dock position for zero page height', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 0];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 25;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'bottom'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: -25,
            width: 600,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains template bounds for unsupported dock value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (
                _settings: any
            ): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 0;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'unsupported'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains bounds when actual bounds are null', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (): null => {
                return null;
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 retains bounds when actual size is null', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const template: any = {
            _bounds: {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): null => {
                    return null;
                }
            },
            _getActualTemplateBounds: (): number[] => {
                return [10, 20, 500, 700];
            }
        };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        expect(result).toBe(template._bounds);
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 100,
            height: 50
        });
        document.destroy();
    });
    it('1041642 uses zero for left dock when top indent is zero', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 40;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'left'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        expect(result).toEqual({
            x: -10,
            y: 0,
            width: 100,
            height: 660
        });
        document.destroy();
    });
    it('1041642 uses zero for right dock when top indent is zero', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetTopIndentHeight: any =
            internalDocument._getTopIndentHeight;
        const originalGetBottomIndentHeight: any =
            internalDocument._getBottomIndentHeight;
        const originalGetRightIndentWidth: any =
            internalDocument._getRightIndentWidth;
        const template: any = {
            _bounds: {
                x: 0,
                y: 0,
                width: 100,
                height: 50
            }
        };
        const page: any = {
            _isNew: true,
            _pageSettings: {
                _getActualSize: (): number[] => {
                    return [600, 800];
                }
            },
            _getActualTemplateBounds: (): number[] => {
                return [10, 20, 500, 700];
            }
        };
        internalDocument._getTopIndentHeight =
            (): number => {
                return 0;
            };
        internalDocument._getBottomIndentHeight =
            (): number => {
                return 40;
            };
        internalDocument._getRightIndentWidth =
            (): number => {
                return 25;
            };
        const result: any =
            internalDocument._getTemplateDockBounds(
                page,
                template,
                'right'
            );
        internalDocument._getTopIndentHeight =
            originalGetTopIndentHeight;
        internalDocument._getBottomIndentHeight =
            originalGetBottomIndentHeight;
        internalDocument._getRightIndentWidth =
            originalGetRightIndentWidth;
        expect(result).toEqual({
            x: 425,
            y: 0,
            width: 100,
            height: 660
        });
        document.destroy();
    });
});