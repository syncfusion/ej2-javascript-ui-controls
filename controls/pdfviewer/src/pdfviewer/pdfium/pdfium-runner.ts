import { Rect, Size } from "@syncfusion/ej2-drawings";

declare let importScripts: (...scripts: string[]) => void;
/**
 *@returns {void}
 */
export function PdfiumRunner(): void {
    const moduleString: string = 'Module';
    let pageLoaded: boolean = false;
    let moduleLoaded: boolean = false;
    const FPDF: any = {};
    // eslint-disable-next-line
    var pdfiumWindow: any = pdfiumWindow || {};
    let documentDetails: DocumentInfo;
    const PDFiumModule: any = typeof ((pdfiumWindow as any)[`${moduleString}`]) !== 'undefined' ? ((pdfiumWindow as any)[`${moduleString}`]) : {};
    const F64: Float64ArrayConstructor = Float64Array;
    const H: any = (t: Float64ArrayConstructor, s: number, d: number[]) => (f: any) => {
        const [m, ...a] = (pdfiumWindow as any).heap(t, s);
        const v: number = f(...a.map((x: any) => x.p));
        if (!v) {
            m.free();
            return d;
        }
        const r: number[] = a.map((x: any) => x.v);
        m.free();
        return r;
    };

    Object.assign(FPDF, {
        LCD_TEXT: 0x02, // Set if using text rendering optimized for LCD display.
        NO_NATIVETEXT: 0x04, // Don't use the native text output available on some platforms
        GRAYSCALE: 0x08, // Grayscale output.
        DEBUG_INFO: 0x80, // Set if you want to get some debug info. Please discuss with Foxit first if you need to collect debug info.
        NO_CATCH: 0x100, // Set if you don't want to catch exception.
        RENDER_LIMITEDIMAGECACHE: 0x200, // Limit image cache size.
        RENDER_FORCEHALFTONE: 0x400, // Always use halftone for image stretching.
        PRINTING: 0x800, // Render for printing.
        REVERSE_BYTE_ORDER: 0x10, // Set whether render in a reverse Byte order, this flag only.
        // eslint-disable-next-line
        Bitmap_Gray: 1,
        // eslint-disable-next-line
        Bitmap_BGR: 2,
        // eslint-disable-next-line
        Bitmap_BGRx: 3,
        // eslint-disable-next-line
        Bitmap_BGRA: 4,
        LAST_ERROR: { // Last error types
            SUCCESS: 0,
            UNKNOWN: 1,
            FILE: 2,
            FORMAT: 3,
            PASSWORD: 4,
            SECURITY: 5,
            PAGE: 6
        }
    });

    /**
     *@returns {void}
     */
    function initializeFPDF(): void {
        (FPDF as any).Init = PDFiumModule.cwrap('FPDF_InitLibrary');
        (FPDF as any).RenderPageBitmap = PDFiumModule.cwrap('FPDF_RenderPageBitmap', '', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
        // eslint-disable-next-line
        (FPDF as any).Bitmap_FillRect = PDFiumModule.cwrap('FPDFBitmap_FillRect', '', ['number', 'number', 'number', 'number', 'number', 'number']);
        // eslint-disable-next-line
        (FPDF as any).Bitmap_CreateEx = PDFiumModule.cwrap('FPDFBitmap_CreateEx', 'number', ['number', 'number', 'number', 'number', 'number']);
        // eslint-disable-next-line
        (FPDF as any).Bitmap_Destroy = PDFiumModule.cwrap('FPDFBitmap_Destroy', '', ['number']);
        (FPDF as any).LoadPage = PDFiumModule.cwrap('FPDF_LoadPage', 'number', ['number', 'number']);
        (FPDF as any).ClosePage = PDFiumModule.cwrap('FPDF_ClosePage', '', ['number']);
        (FPDF as any).LoadMemDocument = PDFiumModule.cwrap('FPDF_LoadMemDocument', 'number', ['number', 'number', 'string']);
        (FPDF as any).GetPageSizeByIndex = PDFiumModule.cwrap('FPDF_GetPageSizeByIndex', 'number', ['number', 'number', 'number', 'number']);
        (FPDF as any).GetLastError = PDFiumModule.cwrap('FPDF_GetLastError', 'number');
        (FPDF as any).GetPageCount = PDFiumModule.cwrap('FPDF_GetPageCount', 'number', ['number']);
        (FPDF as any).CloseDocument = PDFiumModule.cwrap('FPDF_CloseDocument', '', ['number']);
        (FPDF as any).DestroyLibrary = PDFiumModule.cwrap('FPDF_DestroyLibrary');
        (FPDF as any).LoadTextPage = PDFiumModule.cwrap('FPDFText_LoadPage', 'number', ['number']);
        (FPDF as any).CloseTextPage = PDFiumModule.cwrap('FPDFText_ClosePage', '', ['number']);
        (FPDF as any).TextCountChars = PDFiumModule.cwrap('FPDFText_CountChars', 'number', ['number']);
        (FPDF as any).GetUnicodeChar = PDFiumModule.cwrap('FPDFText_GetUnicode', 'number', ['number']);
        (FPDF as any).GetCharBox = PDFiumModule.cwrap('FPDFText_GetCharBox', 'number', ['number', 'number', 'number', 'number', 'number']);
        (FPDF as any).GetPageRotation = PDFiumModule.cwrap('FPDFPage_GetRotation', 'number', ['number']);
        (FPDF as any).GetCharAngle = PDFiumModule.cwrap('FPDFText_GetCharAngle', 'number', ['number']);
        (pdfiumWindow as any).heap = (J: any, s: number) => {
            let E: any;
            switch (J) {
            case Int8Array: E = PDFiumModule.HEAP8; break;
            case Int16Array: E = PDFiumModule.HEAP16; break;
            case Int32Array: E = PDFiumModule.HEAP32; break;
            case Uint8Array: E = PDFiumModule.HEAPU8; break;
            case Uint16Array: E = PDFiumModule.HEAPU16; break;
            case Uint32Array: E = PDFiumModule.HEAPU32; break;
            case Float32Array: E = PDFiumModule.HEAPF32; break;
            case Float64Array: E = PDFiumModule.HEAPF64; break;
            }
            const Z: number = J.BYTES_PER_ELEMENT;
            const m: number = PDFiumModule.asm.malloc(s * Z);
            const a: any[] = Array(1 + s);
            a[0] = ({ s, J, Z, E, m, free: () => PDFiumModule.asm.free(m) });
            for (let i: number = 0; i < s; i++) { a[i + 1] = ({ p: m + (i * Z), get v(): any { return E[m / Z + i]; } }); }
            return a;
        };
    }

    /**
     *@returns {void}
     */
    function checkIfEverythingWasLoaded(): void {
        pageLoaded = true;
        if (pageLoaded || moduleLoaded) {
            startApp();
        }
    }

    PDFiumModule.onRuntimeInitialized = function (): void {
        moduleLoaded = true;
        checkIfEverythingWasLoaded();
    };

    /**
     *@returns {void}
     */
    function startApp(): void {
        initializeFPDF();
        if (pdfiumWindow.loaded) {
            pdfiumWindow.loaded();
        }
    }

    pdfiumWindow.onload = function (): void {
        pageLoaded = true;
        checkIfEverythingWasLoaded();
    };

    pdfiumWindow.loaded = function (): void {
        ctx.postMessage({ message: 'loaded' });
    };

    const ctx: Worker = self as any;
    ctx.onmessage = function (event: any): void {
        if (event.data.message === 'initialLoading') {
            importScripts(event.data.url + '/pdfium.js');
            PDFiumModule.url = event.data.url;
            PDFiumModule.onRuntimeInitialized = function (): void {
                moduleLoaded = true;
                checkIfEverythingWasLoaded();
            };
            (this as any)['PDFiumModule'](PDFiumModule);
        }
        else if (event.data.message === 'LoadPageCollection') {
            pdfiumWindow.fileByteArray = event.data.uploadedFile;
            const fileSize: number = pdfiumWindow.fileByteArray.length;
            FPDF.Init();
            const wasmBuffer: number = PDFiumModule.asm.malloc(fileSize);
            PDFiumModule.HEAPU8.set(pdfiumWindow.fileByteArray, wasmBuffer);
            pdfiumWindow.fileByteArray = null;
            documentDetails = new DocumentInfo({
                wasm: FPDF.LoadMemDocument(wasmBuffer, fileSize, event.data.password),
                wasmBuffer: wasmBuffer
            });
            const pages: number = FPDF.GetPageCount(documentDetails.processor.wasmData.wasm);
            documentDetails.setPages(pages);
            documentDetails.createAllPages();
            ctx.postMessage({ message: 'PageLoaded', pageIndex: event.data.pageIndex, isZoomMode: event.data.isZoomMode });
        }
        else if (event.data.message === 'LoadPageStampCollection') {
            const fileSize: number = event.data.uploadedFile.length;
            FPDF.Init();
            const wasmBuffer: number = PDFiumModule.asm.malloc(fileSize);
            PDFiumModule.HEAPU8.set(event.data.uploadedFile, wasmBuffer);
            const documentDetailsNew: DocumentInfo = new DocumentInfo({
                wasm: FPDF.LoadMemDocument(wasmBuffer, fileSize, event.data.password),
                wasmBuffer: wasmBuffer
            });
            const pages: number = FPDF.GetPageCount(documentDetailsNew.processor.wasmData.wasm);
            documentDetailsNew.setPages(pages);
            documentDetailsNew.createAllPages();
            const firstPage: Page = documentDetailsNew.getPage(event.data.pageIndex);
            const ImageData: any = event.data;
            const data: object = firstPage.render(null, ImageData.zoomFactor, false, null, null, null, true);
            (data as any).message = 'LoadedStamp';
            (data as any).annotName = event.data.AnnotName;
            (data as any).rubberStampAnnotationPageNumber = event.data.rubberStampAnnotationPageNumber;
            (data as any).annotationOrder = event.data.annotationOrder;
            (data as any).collectionOrder = event.data.collectionOrder;
            ctx.postMessage(data);
        }
        if (documentDetails) {
            if (event.data.message === 'renderPage') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const ImageData: any = event.data;
                const data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null,
                                                      ImageData.textDetailsId, null, event.data.cropBoxRect, event.data.mediaBoxRect);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderPageSearch') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const ImageData: any = event.data;
                const data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null,
                                                      ImageData.textDetailsId,null,event.data.cropBoxRect);
                (data as any).message = 'imageRenderedSearch';
                ctx.postMessage(data);
            }
            else if (event.data.message === 'extractText') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const ImageData: any = event.data;
                const data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null,
                                                      ImageData.textDetailsId);
                (data as any).message = 'textExtracted';
                (data as any).isLayout = event.data.isLayout;
                (data as any).isRenderText = event.data.isRenderText;
                (data as any).jsonObject = event.data.jsonObject;
                (data as any).requestType = event.data.requestType;
                (data as any).annotationObject = event.data.annotationObject;
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderThumbnail') {
                let thumbnail: Promise<any> = new Promise((resolve, reject) => {
                    // Simulate an asynchronous task
                    setTimeout(() => {
                        try {
                            const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                            if (firstPage.processor !== null && firstPage.processor !== undefined) {
                                const data: object = firstPage.render('thumbnail', null, false, null, null);
                                resolve(data);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    }, 1000);
                });

                thumbnail.then(results => {
                    ctx.postMessage(results);
                });
            }
            else if (event.data.message === 'renderPreviewTileImage') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const data: object = firstPage.render('thumbnail', null, false, null, null);
                (data as any).message = 'renderPreviewTileImage';
                (data as any).startIndex = event.data.startIndex;
                (data as any).endIndex = event.data.endIndex;
                ctx.postMessage(data);
            }
            else if (event.data.message === 'printImage') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const data: object = firstPage.render('print', null, false, event.data.printScaleFactor, event.data.printDevicePixelRatio);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'extractImage') {
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const ImageData: any = event.data;
                const data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null,
                                                      ImageData.textDetailsId,null, null,null, event.data.size);
                (data as any).message = 'imageExtracted';
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderImageAsTile') {
                const values: any = event.data;
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const data: object = firstPage.renderTileImage(values.tileX, values.tileY, values.tileXCount, values.tileYCount,
                                                               values.zoomFactor, event.data.isTextNeed, event.data.textDetailsId, event.data.cropBoxRect, event.data.mediaBoxRect);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderImageAsTileSearch') {
                const values: any = event.data;
                const firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                const data: object = firstPage.renderTileImage(values.tileX, values.tileY, values.tileXCount, values.tileYCount,
                                                               values.zoomFactor, event.data.isTextNeed, event.data.textDetailsId, event.data.cropBoxRect, event.data.mediaBoxRect);
                (data as any).message = 'renderTileImageSearch';
                ctx.postMessage(data);
            }
            else if (event.data.message === 'unloadFPDF') {
                if (documentDetails) {
                    PDFiumModule.asm.free(documentDetails.processor.wasmData.wasmBuffer);
                    FPDF.CloseDocument(documentDetails.processor.wasmData.wasm);
                    FPDF.DestroyLibrary();
                }
            }
        }

    };

    class Page {
        public index: number;
        public src: string;
        public processor: Processor;
        constructor(index: number, processor?: Processor) {
            this.index = index;
            this.src = null;
            this.processor = processor;
        }
        public render(message: any, zoomFactor?: number, isTextNeed?: boolean, printScaleFactor?: any,
                      printDevicePixelRatio?: number, textDetailsId?: any, isTransparent?: boolean, cropBoxRect?: Rect, mediaBoxRect?: Rect, size?: Size): object {
            return this.processor.render(this.index, message, zoomFactor, isTextNeed, printScaleFactor,
                                         printDevicePixelRatio, textDetailsId, isTransparent, cropBoxRect, mediaBoxRect, size);
        }
        public renderTileImage(x: any, y: any, tileX: any, tileY: any, zoomFactor?: number, isTextNeed?: boolean,
                               textDetailsId?: any, cropBoxRect?: Rect, mediaBoxRect?: Rect): object {
            return this.processor.renderTileImage(this.index, x, y, tileX, tileY, zoomFactor, isTextNeed, textDetailsId, cropBoxRect, mediaBoxRect);
        }
    }

    class RectAngle {
        public X: number;
        public Y: number;
        public Width: number;
        public Height: number;
        public Bottom: number;
        public Right: number;
        public Top: number;
        public Left: number;
        public Text: string;
        public Rotation: number;
        constructor(X: number, Y: number, Width: number, Height: number, Text: string, Rotation: number) {
            this.X = X;
            this.Y = Y;
            this.Width = Width;
            this.Height = Height;
            this.Bottom = this.Y + this.Height;
            this.Right = this.X + this.Width;
            this.Top = this.Y;
            this.Left = this.X;
            this.Rotation = Rotation;
            this.Text = Text;
        }
    }

    class Processor {
        public wasmData: any;
        public TextBounds: any = [];
        public TextContent: any = [];
        public CharacterBounds: any = [];
        public Rotation: number;
        public PageText: string = '';
        constructor(wasmData: any) {
            this.wasmData = wasmData;
        }

        public getPageSize(i: number = 0): number[] {
            return H(F64, 2, [-1, -1])((w: any, h: any) => (FPDF as any).GetPageSizeByIndex(this.wasmData.wasm, i, w, h)).
                map((v: number) => parseInt((v * (96 / 72)).toString(), 10));
        }

        public getCharBounds(pagePointer: any, i: number = 0): number[] {
            return H(F64, 4, [-1, -1, -1, -1])((left: any, right: any, bottom: any, top: any) => (FPDF as any).
                GetCharBox(pagePointer, i, left, right, bottom, top));
        }

        public getRender(i: number = 0, w: any, h: any, isTextNeed: boolean, isTransparent?: boolean, cropBoxRect?: Rect, mediaBoxRect?: Rect): any {
            const flag: any = (FPDF as any).REVERSE_BYTE_ORDER;
            const heap: any = PDFiumModule.asm.malloc(w * h * 4);
            PDFiumModule.HEAPU8.fill(0, heap, heap + (w * h * 4));
            const bmap: any = (FPDF as any).Bitmap_CreateEx(w, h, (FPDF as any).Bitmap_BGRA, heap, w * 4);
            const page: any = (FPDF as any).LoadPage(this.wasmData.wasm, i);
            (FPDF as any).Bitmap_FillRect(bmap, 0, 0, w, h, isTransparent ? 0x00FFFFFF : 0xFFFFFFFF);
            (FPDF as any).RenderPageBitmap(bmap, page, 0, 0, w, h, 0, flag);
            (FPDF as any).Bitmap_Destroy(bmap);
            this.textExtraction(page, i, isTextNeed, cropBoxRect, mediaBoxRect);
            (FPDF as any).ClosePage(page);
            return heap;
        }

        public textExtraction(pagePointer: any, pageIndex: number, isTextNeed: boolean, cropBoxRect?: Rect, mediaBoxRect?: Rect): void {
            if (isTextNeed) {
                let [pageWidth, pageHeight] = this.getPageSize(pageIndex);
                pageHeight = pageHeight + this.pointerToPixelConverter(mediaBoxRect && mediaBoxRect.y ? mediaBoxRect.y : 0);
                const textPage: any = (FPDF as any).LoadTextPage(pagePointer, pageIndex);
                const pageRotation: any = (FPDF as any).GetPageRotation(pagePointer);
                const totalCharacterCount: any = (FPDF as any).TextCountChars(textPage);
                this.TextBounds = [];
                this.TextContent = [];
                this.CharacterBounds = [];
                let pageText: string = '';
                let minTop: number = 0;
                let maxBottom: number = 0;
                let minLeft: number = 0;
                let maxRight: number = 0;
                let top: any = [];
                let bottom: any = [];
                let left: any = [];
                let right: any = [];
                let wordBounds: any = [];
                let word: string = '';
                let wordMinLeft: number = 0;
                let wordMaxRight: number = 0;
                let wordMinTop: number = 0;
                let wordMaxBottom: number = 0;
                let wordRotation: number = 0;
                let wordStart: boolean = true;
                let isZeroWidthSpace: boolean = false;
                let isPreviousSpace: boolean = false;
                let startNewLine: boolean = false;
                const maximumSpaceForNewLine: number = 11;
                for (let charCount: number = 0; charCount <= totalCharacterCount; charCount++) {
                    const result: any = (FPDF as any).GetUnicodeChar(textPage, charCount);
                    let rotationRadian: any = (FPDF as any).GetCharAngle(textPage, charCount);
                    const character: string = String.fromCharCode(result);
                    let [charLeft, charRight, charBottom, charTop] = this.getCharBounds(textPage, charCount);
                    let X: number = this.pointerToPixelConverter(charLeft) - this.pointerToPixelConverter(cropBoxRect && cropBoxRect.x ? cropBoxRect.x : 0);
                    let Y: number = (pageHeight + this.pointerToPixelConverter(cropBoxRect && cropBoxRect.y ? cropBoxRect.y : 0)) - this.pointerToPixelConverter(charTop);
                    let Width: number = this.pointerToPixelConverter(charRight - charLeft);
                    let Height: number = this.pointerToPixelConverter(charTop - charBottom);
                    let rotationAngle: number = parseInt((rotationRadian * 180 / Math.PI).toString(), 10);
                    if (charCount < totalCharacterCount) {
                        pageText += character;
                        const currentCharacterBounds: RectAngle = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                        this.CharacterBounds.push(currentCharacterBounds);
                    }
                    if (pageRotation === 1 || pageRotation === 3) {
                        Y = (pageWidth) - this.pointerToPixelConverter(charTop);
                    }
                    switch (character) {
                    case '\0': {
                        // eslint-disable-next-line
                        minTop = Math.min.apply(Math, top);
                        // eslint-disable-next-line
                        maxBottom = Math.max.apply(Math, bottom);
                        // eslint-disable-next-line
                        minLeft = Math.min.apply(Math, left);
                        // eslint-disable-next-line
                        maxRight = Math.max.apply(Math, right);
                        const newWordBounds: RectAngle = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                                       wordMaxBottom - wordMinTop, word, wordRotation);
                        wordBounds.push(newWordBounds);
                        this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation, pageWidth, pageHeight);
                        wordBounds = [];
                        wordStart = true;
                        isPreviousSpace = false;
                        word = '';
                        top = [];
                        left = [];
                        bottom = [];
                        right = [];
                        minTop = 0;
                        maxBottom = 0;
                        minLeft = 0;
                        maxRight = 0;
                        break;
                    }
                    case '\r':
                        if (charCount < totalCharacterCount) {
                            const characterBounds: RectAngle = new RectAngle(X, Y, Width, Height, '\r\n', rotationAngle);
                            top.push(characterBounds.Top);
                            bottom.push(characterBounds.Bottom);
                            left.push(characterBounds.Left);
                            right.push(characterBounds.Right);
                            // eslint-disable-next-line
                            minTop = Math.min.apply(Math, top);
                            // eslint-disable-next-line
                            maxBottom = Math.max.apply(Math, bottom);
                            // eslint-disable-next-line
                            minLeft = Math.min.apply(Math, left);
                            // eslint-disable-next-line
                            maxRight = Math.max.apply(Math, right);
                            let newWordBounds: any;
                            if (wordStart === false) {
                                newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                              wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                            }
                            wordBounds.push(characterBounds);
                            this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation,
                                                       pageWidth, pageHeight);
                            wordBounds = [];
                            wordStart = true;
                            isPreviousSpace = false;
                            word = '';
                            top = [];
                            left = [];
                            bottom = [];
                            right = [];
                            minTop = 0;
                            maxBottom = 0;
                            minLeft = 0;
                            maxRight = 0;
                            pageText += '\n';
                            rotationRadian = (FPDF as any).GetCharAngle(textPage, charCount);
                            [charLeft, charRight, charBottom, charTop] = this.getCharBounds(textPage, charCount);
                            X = this.pointerToPixelConverter(charLeft);
                            Y = (pageHeight) - this.pointerToPixelConverter(charTop);
                            Width = this.pointerToPixelConverter(charRight - charLeft);
                            Height = this.pointerToPixelConverter(charTop - charBottom);
                            rotationAngle = parseInt((rotationRadian * 180 / Math.PI).toString(), 10);
                            const currentCharacterBounds: RectAngle = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                            this.CharacterBounds.push(currentCharacterBounds);
                            charCount++;
                        }
                        break;
                    case '\u0002':
                    case '\ufffe':
                        {
                            const characterBounds: any = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                            top.push(characterBounds.Top);
                            bottom.push(characterBounds.Bottom);
                            left.push(characterBounds.Left);
                            right.push(characterBounds.Right);
                            // eslint-disable-next-line
                            minTop = Math.min.apply(Math, top);
                            // eslint-disable-next-line
                            maxBottom = Math.max.apply(Math, bottom);
                            // eslint-disable-next-line
                            minLeft = Math.min.apply(Math, left);
                            // eslint-disable-next-line
                            maxRight = Math.max.apply(Math, right);
                            let newWordBounds: any;
                            if (wordStart === false) {
                                newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                              wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                            }
                            if (character === '\u0002') {
                                wordBounds.push(characterBounds);
                            }
                            this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation,
                                                       pageWidth, pageHeight);
                            wordBounds = [];
                            wordStart = true;
                            isPreviousSpace = false;
                            word = '';
                            top = [];
                            left = [];
                            bottom = [];
                            right = [];
                            minTop = 0;
                            maxBottom = 0;
                            minLeft = 0;
                            maxRight = 0;
                        }
                        break;
                    default:
                        if (Width === 0 || Height === 0) {
                            isZeroWidthSpace = true;
                            // eslint-disable-next-line
                            minTop = Math.min.apply(Math, top);
                            // eslint-disable-next-line
                            maxBottom = Math.max.apply(Math, bottom);
                            // eslint-disable-next-line
                            minLeft = Math.min.apply(Math, left);
                            // eslint-disable-next-line
                            maxRight = Math.max.apply(Math, right);
                            let newWordBounds: any = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                                   wordMaxBottom - wordMinTop, word, wordRotation);
                            wordBounds.push(newWordBounds);
                            const characterBounds: RectAngle = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                            wordMinTop = characterBounds.Top;
                            wordMaxBottom = characterBounds.Bottom;
                            wordMinLeft = characterBounds.Left;
                            wordMaxRight = characterBounds.Right;
                            word = character;
                            wordRotation = wordBounds[wordBounds.length - 1].Rotation;
                            newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                          wordMaxBottom - wordMinTop, word, wordRotation);
                            wordBounds.push(newWordBounds);
                            wordMinTop = 0;
                            wordMaxBottom = 0;
                            wordMinLeft = 0;
                            wordMaxRight = 0;
                            word = '';
                            wordRotation = 0;
                            wordStart = true;
                            isPreviousSpace = true;
                        }
                        else {
                            if (wordStart === true) {
                                wordMinTop = Y;
                                wordMaxBottom = Y + Height;
                                wordMinLeft = X;
                                wordMaxRight = X + Width;
                            }
                            const characterBounds: RectAngle = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                            if (character !== ' ') {
                                if (isPreviousSpace && wordBounds.length > 0 && (rotationAngle === wordBounds[0].Rotation)) {
                                    if ((rotationAngle === 180 || rotationAngle === 0) &&
                                    (Math.abs(characterBounds.Y - wordBounds[0].Y) > maximumSpaceForNewLine)) {
                                        startNewLine = true;
                                    }
                                    if ((rotationAngle === 270 || rotationAngle === 90) &&
                                    (Math.abs(characterBounds.X - wordBounds[0].X) > maximumSpaceForNewLine)) {
                                        startNewLine = true;
                                    }
                                }
                                if ((isZeroWidthSpace && wordBounds.length >= 1 &&
                                    wordBounds[wordBounds.length - 1].Rotation !== characterBounds.Rotation) || startNewLine) {
                                    isZeroWidthSpace = false;
                                    startNewLine = false;
                                    // eslint-disable-next-line
                                    minTop = Math.min.apply(Math, top);
                                    // eslint-disable-next-line
                                    maxBottom = Math.max.apply(Math, bottom);
                                    // eslint-disable-next-line
                                    minLeft = Math.min.apply(Math, left);
                                    // eslint-disable-next-line
                                    maxRight = Math.max.apply(Math, right);
                                    let newWordBounds: any;
                                    if (wordStart === false) {
                                        newWordBounds = new RectAngle(wordMinLeft, wordMinTop,
                                                                      wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop,
                                                                      word, wordRotation);
                                        wordBounds.push(newWordBounds);
                                    }
                                    this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft,
                                                               pageRotation, pageWidth, pageHeight);
                                    wordBounds = [];
                                    wordStart = true;
                                    word = '';
                                    top = [];
                                    left = [];
                                    bottom = [];
                                    right = [];
                                    minTop = 0;
                                    maxBottom = 0;
                                    minLeft = 0;
                                    maxRight = 0;
                                }
                                top.push(characterBounds.Top);
                                bottom.push(characterBounds.Bottom);
                                left.push(characterBounds.Left);
                                right.push(characterBounds.Right);
                                wordMinTop = Math.min(wordMinTop, characterBounds.Top);
                                wordMaxBottom = Math.max(wordMaxBottom, characterBounds.Bottom);
                                wordMinLeft = Math.min(wordMinLeft, characterBounds.Left);
                                wordMaxRight = Math.max(wordMaxRight, characterBounds.Right);
                                word += character;
                                wordRotation = characterBounds.Rotation;
                                wordStart = false;
                                isPreviousSpace = false;
                            } else {
                                let newWordBounds: RectAngle = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                                             wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                                wordMinTop = characterBounds.Top;
                                wordMaxBottom = characterBounds.Bottom;
                                wordMinLeft = characterBounds.Left;
                                wordMaxRight = characterBounds.Right;
                                word = character;
                                wordRotation = characterBounds.Rotation;
                                newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft,
                                                              wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                                wordMinTop = 0;
                                wordMaxBottom = 0;
                                wordMinLeft = 0;
                                wordMaxRight = 0;
                                word = '';
                                wordRotation = 0;
                                wordStart = true;
                                isPreviousSpace = true;
                            }
                        }
                        break;
                    }
                }
                (FPDF as any).CloseTextPage(textPage);
                this.Rotation = pageRotation;
                this.PageText = pageText;
            }
        }

        public pointerToPixelConverter(pointerValue: number): number {
            return (pointerValue * (96 / 72));
        }

        public textBoundsCalculation(wordBounds: any, minTop: number, maxBottom: number, maxRight: number,
                                     minLeft: number, pageRotation: number, pageWidth: number, pageHeight: number): void {
            let newWordBounds: any;
            let hasInBetweenRotation: boolean = false;
            let inBetweenRotatedText: string = '';
            const maximumSpaceBetweenWords: number = 30;
            const sentence: string = wordBounds.reduce((word: string, rect: any) => word + rect.Text, '');
            const isRTLText: boolean = this.checkIsRtlText(sentence);
            for (let count: number = 0; count < wordBounds.length; count++) {
                const textRotation: number = wordBounds[parseInt(count.toString(), 10)].Rotation;
                if (textRotation === 0 || textRotation === 180) {
                    if (hasInBetweenRotation) {
                        this.TextBounds.push(newWordBounds);
                        this.TextContent.push(inBetweenRotatedText);
                        inBetweenRotatedText = '';
                    }
                    hasInBetweenRotation = false;
                    if (pageRotation === 0) {
                        newWordBounds = new RectAngle(wordBounds[parseInt(count.toString(), 10)].Left, minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 1) {
                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[parseInt(count.toString(), 10)].Left,
                                                      wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 2) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[parseInt(count.toString(), 10)].Left, pageHeight - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 3) {
                        newWordBounds = new RectAngle(minTop, pageHeight - wordBounds[parseInt(count.toString(), 10)].Left,
                                                      wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    }
                } else if (textRotation === 90 || textRotation === 270) {
                    if (hasInBetweenRotation) {
                        this.TextBounds.push(newWordBounds);
                        this.TextContent.push(inBetweenRotatedText);
                        inBetweenRotatedText = '';
                    }
                    hasInBetweenRotation = false;
                    if (pageRotation === 0) {
                        newWordBounds = new RectAngle(minLeft, wordBounds[parseInt(count.toString(), 10)].Top, maxRight - minLeft,
                                                      wordBounds[parseInt(count.toString(), 10)].Height,
                                                      wordBounds[parseInt(count.toString(), 10)].Text,
                                                      textRotation);
                    } else if (pageRotation === 1) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[parseInt(count.toString(), 10)].Top, minLeft,
                                                      maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 2) {
                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - wordBounds[parseInt(count.toString(), 10)].Top,
                                                      maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 3) {
                        newWordBounds = new RectAngle(wordBounds[parseInt(count.toString(), 10)].Top, pageHeight - minLeft,
                                                      maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    }
                } else if (!hasInBetweenRotation) {
                    hasInBetweenRotation = true;
                    inBetweenRotatedText += wordBounds[parseInt(count.toString(), 10)].Text;
                    if (pageRotation === 0) {
                        newWordBounds = new RectAngle(wordBounds[parseInt(count.toString(), 10)].Left, minTop, maxRight - minLeft,
                                                      maxBottom - minTop, wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 1) {
                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[parseInt(count.toString(), 10)].Left,
                                                      maxRight - minLeft, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    } else if (pageRotation === 2) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[parseInt(count.toString(), 10)].Left,
                                                      pageHeight - minTop, maxRight - minLeft, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text,
                                                      textRotation);
                    } else if (pageRotation === 3) {
                        newWordBounds = new RectAngle(minTop, pageHeight - wordBounds[parseInt(count.toString(), 10)].Left,
                                                      maxRight - minLeft, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                    }
                } else {
                    inBetweenRotatedText += wordBounds[parseInt(count.toString(), 10)].Text;
                }
                if (!hasInBetweenRotation && wordBounds[parseInt(count.toString(), 10)].Text === ' ' && count !== 0 && count + 1 <= wordBounds.length) {
                    if (!isRTLText) {
                        if (count + 1 !== wordBounds.length) {
                            let spaceWidth: number = 0;
                            switch (textRotation) {
                            case 0:
                                spaceWidth = wordBounds[count + 1].Left - (wordBounds[count - 1].Left + wordBounds[count - 1].Width);
                                if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                    spaceWidth = 0;
                                }
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(wordBounds[count - 1].Left + wordBounds[count - 1].Width,
                                                                  minTop, spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - minTop,
                                                                  wordBounds[count - 1].Left + wordBounds[count - 1].Width, spaceWidth,
                                                                  maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left +
                                        wordBounds[count - 1].Width), pageHeight - minTop, spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left +
                                        wordBounds[count - 1].Width), spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 90:
                                spaceWidth = wordBounds[count + 1].Top - (wordBounds[count - 1].Top + wordBounds[count - 1].Height);
                                if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                    spaceWidth = 0;
                                }
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top + wordBounds[count - 1].Height,
                                                                  maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top +
                                        wordBounds[count - 1].Height), minLeft, maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - (wordBounds[count - 1].Top +
                                        wordBounds[count - 1].Height), maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle((wordBounds[count - 1].Top + wordBounds[count - 1].Height),
                                                                  pageHeight - minLeft, maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 180:
                                spaceWidth = wordBounds[count - 1].Left - (wordBounds[count + 1].Left + wordBounds[count + 1].Width);
                                if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                    spaceWidth = 0;
                                }
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(wordBounds[count + 1].Left + wordBounds[count + 1].Width,
                                                                  minTop, spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count + 1].Left +
                                        wordBounds[count + 1].Width, spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count + 1].Left +
                                        wordBounds[count + 1].Width), pageHeight - minTop, spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count + 1].Left +
                                        wordBounds[count + 1].Width), spaceWidth, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 270:
                                spaceWidth = wordBounds[count - 1].Top - (wordBounds[count + 1].Top + wordBounds[count + 1].Height);
                                if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                    spaceWidth = 0;
                                }
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(minLeft, wordBounds[count + 1].Top + wordBounds[count + 1].Height,
                                                                  maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count + 1].Top +
                                        wordBounds[count + 1].Height), minLeft, maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight -
                                        (wordBounds[count + 1].Top + wordBounds[count + 1].Height), maxRight - minLeft,
                                                                  spaceWidth, wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle((wordBounds[count + 1].Top + wordBounds[count + 1].Height),
                                                                  pageHeight - minLeft, maxRight - minLeft, spaceWidth,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            }
                        } else {
                            switch (textRotation) {
                            case 90:
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top + wordBounds[count - 1].Height,
                                                                  maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top +
                                        wordBounds[count - 1].Height), minLeft, maxRight - minLeft,
                                                                  wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight -
                                        (wordBounds[count - 1].Top + wordBounds[count - 1].Height),
                                                                  maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle((wordBounds[count - 1].Top + wordBounds[count - 1].Height),
                                                                  pageHeight - minLeft, maxRight - minLeft,
                                                                  wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 270:
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top -
                                        wordBounds[parseInt(count.toString(), 10)].Height, maxRight - minLeft,
                                                                  wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top -
                                        wordBounds[parseInt(count.toString(), 10)].Height), minLeft, maxRight - minLeft,
                                                                  wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight -
                                        wordBounds[count - 1].Top - wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle((wordBounds[count - 1].Top -
                                        wordBounds[parseInt(count.toString(), 10)].Height), pageHeight - minLeft,
                                                                  maxRight - minLeft, wordBounds[parseInt(count.toString(), 10)].Height,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 180:
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(wordBounds[count - 1].Left -
                                        wordBounds[parseInt(count.toString(), 10)].Width, minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle((pageWidth - minTop), wordBounds[count - 1].Left -
                                    wordBounds[parseInt(count.toString(), 10)].Width,
                                                                  wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left -
                                        wordBounds[parseInt(count.toString(), 10)].Width), pageHeight - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left -
                                        wordBounds[parseInt(count.toString(), 10)].Width),
                                                                  wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                }
                                break;
                            case 0:
                                if (pageRotation === 0) {
                                    newWordBounds = new RectAngle(wordBounds[count - 1].Left + wordBounds[count - 1].Width,
                                                                  minTop, wordBounds[parseInt(count.toString(), 10)].Width,
                                                                  maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 1) {
                                    newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count - 1].Left +
                                        wordBounds[count - 1].Width, wordBounds[parseInt(count.toString(), 10)].Width,
                                                                  maxBottom - minTop, wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                } else if (pageRotation === 2) {
                                    newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left +
                                        wordBounds[count - 1].Width), pageHeight - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                                  wordBounds[parseInt(count.toString(), 10)].Text, textRotation);
                                } else if (pageRotation === 3) {
                                    newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left +
                                        wordBounds[count - 1].Width), wordBounds[parseInt(count.toString(), 10)].Width,
                                                                  maxBottom - minTop, wordBounds[parseInt(count.toString(), 10)].Text,
                                                                  textRotation);
                                }
                                break;
                            }
                        }
                    } else if (isRTLText && count + 1 !== wordBounds.length) {
                        let spaceWidth: number = (wordBounds[count - 1].Left - (wordBounds[count + 1].Left + wordBounds[count + 1].Width));
                        if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                            spaceWidth = 0;
                        }
                        newWordBounds = new RectAngle((wordBounds[count + 1].Left + wordBounds[count + 1].Width), minTop,
                                                      spaceWidth, maxBottom - minTop, wordBounds[parseInt(count.toString(), 10)].Text,
                                                      wordBounds[parseInt(count.toString(), 10)].Rotation);
                    } else if (isRTLText) {
                        newWordBounds = new RectAngle((wordBounds[count - 1].Left -
                            wordBounds[parseInt(count.toString(), 10)].Width), minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Width, maxBottom - minTop,
                                                      wordBounds[parseInt(count.toString(), 10)].Text,
                                                      wordBounds[parseInt(count.toString(), 10)].Rotation);
                    }
                }
                if (!hasInBetweenRotation) {
                    this.TextBounds.push(newWordBounds);
                    this.TextContent.push(wordBounds[parseInt(count.toString(), 10)].Text);
                }
            }
            if (hasInBetweenRotation) {
                this.TextBounds.push(newWordBounds);
                this.TextContent.push(inBetweenRotatedText);
            }
        }

        public checkIsRtlText(text: string): boolean {
            const ltrChars: string = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
            const rtlChars: string = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
            // eslint-disable-next-line
            const rtlDirCheck: any = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
            return rtlDirCheck.test(text);
        }

        public getPageRender(n: number = 0, w: any, h: any, isTextNeed: boolean, isTransparent?: boolean, cropBoxRect?: Rect, mediaBoxRect?: Rect): any {
            const pageRenderPtr: any = this.getRender(n, w, h, isTextNeed, isTransparent, cropBoxRect, mediaBoxRect);
            let pageRenderData: any[] = [];
            pageRenderData = PDFiumModule.HEAPU8.slice(pageRenderPtr, pageRenderPtr + (w * h * 4));
            PDFiumModule.asm.free(pageRenderPtr);
            return pageRenderData;
        }

        public render(n: number = 0, message: any, zoomFactor: number, isTextNeed: boolean, printScaleFactor: any,
                      printDevicePixelRatio: number, textDetailsId: any, isTransparent?: boolean, cropBoxRect?: Rect, mediaBoxRect?: Rect, size?: Size): object {
            const [w, h] = this.getPageSize(n);
            const scaleFactor: number = 1.5;
            const thumbnailWidth: number = 99.7;
            const thumbnailHeight: number = 141;
            if (message === 'thumbnail') {
                const newWidth: number = Math.round(thumbnailWidth * scaleFactor);
                const newHeight: number = Math.round(thumbnailHeight * scaleFactor);
                const data: any = this.getPageRender(n, newWidth, newHeight, false);
                return { value: data, width: newWidth, height: newHeight, pageIndex: n, message: 'renderThumbnail' };
            }
            else if (message === 'print') {
                //An A0 piece of paper measures 33.1 × 46.8 inches, with 46.8 inches being the greater dimension. The pixel value of 46.8 inches is 4493px. If the document size is too large, we may not be able to display the image. Therefore, we should consider the maximum size of A0 paper if the page size is greater than 4493 pixels.
                const maxPageSize: number = 4493;
                const scaleFactor: number = 1.5;
                const whichIsBigger: 'Width' | 'Height' = (w > h) ? 'Width' : 'Height';
                let maxWidth: number = w;
                let maxHeight: number = h;
                if (whichIsBigger === 'Width') {
                    maxWidth = (w > maxPageSize) ? maxPageSize : w;
                    if (maxWidth === maxPageSize) {
                        maxHeight = h / (w / maxPageSize);
                    }
                } else {
                    maxHeight = (h > maxPageSize) ? maxPageSize : h;
                    if (maxHeight === maxPageSize) {
                        maxWidth = w / (h / maxPageSize);
                    }
                }
                const newWidth: number = Math.round(maxWidth * printScaleFactor * scaleFactor);
                const newHeight: number = Math.round(maxHeight * printScaleFactor * scaleFactor);
                const data: any = this.getPageRender(n, newWidth, newHeight, false);
                return { value: data, width: newWidth, height: newHeight, pageIndex: n, pageWidth: w, pageHeight: h, message: 'printImage', printDevicePixelRatio };
            }
            else {
                let newWidth: number = Math.round(((size && size!== null) ? size.width : w) * scaleFactor * zoomFactor);
                let newHeight: number = Math.round(((size && size!== null) ? size.height : h) * scaleFactor * zoomFactor);
                // Reduce the zoom factor if the new image size exceeds the memory limit
                while (((newWidth * newHeight * 4) * 2) >= 2147483648) {
                    zoomFactor = zoomFactor - 0.1;
                    newWidth = Math.round(this.pointerToPixelConverter(w) * zoomFactor);
                    newHeight = Math.round(this.pointerToPixelConverter(h) * zoomFactor);
                }
                const data: any = this.getPageRender(n, newWidth, newHeight, isTextNeed, isTransparent, cropBoxRect, mediaBoxRect);
                return { value: data, width: newWidth, height: newHeight, pageWidth: w, pageHeight: h, pageIndex: n, message: 'imageRendered', textBounds: this.TextBounds, textContent: this.TextContent, rotation: this.Rotation, pageText: this.PageText, characterBounds: this.CharacterBounds, zoomFactor: zoomFactor, isTextNeed: isTextNeed, textDetailsId: textDetailsId };
            }
        }

        public renderTileImage(n: number = 0, tileX: any, tileY: any, xCount: any, yCount: any, zoomFactor: number,
                               isTextNeed: boolean, textDetailsId: any, cropBoxRect?: Rect, mediaBoxRect?: Rect): object {
            const [w, h] = this.getPageSize(n);
            const newWidth: number = Math.round(w * 1.5 * zoomFactor);
            const newHeight: number = Math.round(h * 1.5 * zoomFactor);
            const w1: number = Math.round(newWidth / xCount);
            const h1: number = Math.round(newHeight / yCount);
            const flag: any = FPDF.REVERSE_BYTE_ORDER;
            const heap: any = PDFiumModule.asm.malloc(w1 * h1 * 4);
            PDFiumModule.HEAPU8.fill(0, heap, heap + (w1 * h1 * 4));
            const bmap: any = FPDF.Bitmap_CreateEx(w1, h1, 4, heap, w1 * 4);
            const page: any = FPDF.LoadPage(this.wasmData.wasm, n);
            FPDF.Bitmap_FillRect(bmap, 0, 0, w1, h1, 0xFFFFFFFF);
            FPDF.RenderPageBitmap(bmap, page, -tileX * w1, -tileY * h1, newWidth, newHeight, 0, flag);
            FPDF.Bitmap_Destroy(bmap);
            this.textExtraction(page, n, isTextNeed, cropBoxRect, mediaBoxRect);
            FPDF.ClosePage(page);
            const pageRenderPtr: any = heap;
            let data: any[] = [];
            data = PDFiumModule.HEAPU8.slice(pageRenderPtr, pageRenderPtr + (w1 * h1 * 4));
            PDFiumModule.asm.free(pageRenderPtr);
            if (tileX === 0 && tileY === 0) {
                return {
                    value: data,
                    w: w1,
                    h: h1,
                    noTileX: xCount,
                    noTileY: yCount,
                    x: tileX,
                    y: tileY,
                    pageIndex: n,
                    message: 'renderTileImage',
                    textBounds: this.TextBounds,
                    textContent: this.TextContent,
                    rotation: this.Rotation,
                    pageText: this.PageText,
                    characterBounds: this.CharacterBounds,
                    textDetailsId: textDetailsId,
                    isTextNeed: isTextNeed,
                    zoomFactor: zoomFactor
                };
            } else {
                return {
                    value: data,
                    w: w1,
                    h: h1,
                    noTileX: xCount,
                    noTileY: yCount,
                    x: tileX,
                    y: tileY,
                    pageIndex: n,
                    message: 'renderTileImage',
                    textDetailsId: textDetailsId,
                    isTextNeed: isTextNeed,
                    zoomFactor: zoomFactor
                };
            }
        }

        public getLastError(): any {
            const lastError: any = (FPDF as any).GetLastError();
            switch (lastError) {
            case (FPDF as any).LAST_ERROR.SUCCESS:
                return 'success';
            case (FPDF as any).LAST_ERROR.UNKNOWN:
                return 'unknown error';
            case (FPDF as any).LAST_ERROR.FILE:
                return 'file not found or could not be opened';
            case (FPDF as any).LAST_ERROR.FORMAT:
                return 'file not in PDF format or corrupted';
            case (FPDF as any).LAST_ERROR.PASSWORD:
                return 'password required or incorrect password';
            case (FPDF as any).LAST_ERROR.SECURITY:
                return 'unsupported security scheme';
            case (FPDF as any).LAST_ERROR.PAGE:
                return 'page not found or content error';
            default:
                return 'unknown error';
            }
        }
    }

    class DocumentInfo {
        public processor: Processor;
        public pages: any[] = [];
        constructor(wasmData: any) {
            this.processor = new Processor(wasmData);
        }

        public setPages(pagesCount: any): void {
            this.pages = Array(pagesCount).fill(null);
        }

        public createAllPages(): void {
            for (let i: number = 0; i < this.pages.length; i++) {
                this.pages[parseInt(i.toString(), 10)] = new Page(parseInt(i.toString(), 10), this.processor);
            }
        }

        public getPage(index: any): any {
            let page: any = this.pages[parseInt(index.toString(), 10)];
            if (!page) {
                page = new Page(index);
                this.pages[parseInt(index.toString(), 10)] = page;
            }
            return page;
        }
    }
}
