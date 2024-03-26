/* eslint-disable */
declare let importScripts: (...scripts: string[]) => void;
// eslint-disable-next-line
export function PdfiumRunner(): void {

    let moduleString: string = "Module"
    let pageLoaded: boolean = false;
    let moduleLoaded: boolean = false;
    let FPDF: any = {};
    var pdfiumWindow: any = pdfiumWindow || {};
    let documentDetails: DocumentInfo;
    let PDFiumModule : any = typeof ((pdfiumWindow as any)[`${moduleString}`]) !== 'undefined' ? ((pdfiumWindow as any)[`${moduleString}`]) : {};

    const I8: Int8ArrayConstructor = Int8Array;
    const I16: Int16ArrayConstructor = Int16Array;
    const I32: Int32ArrayConstructor = Int32Array;
    const U8: Uint8ArrayConstructor = Uint8Array;
    const CH: Uint8ArrayConstructor = U8;
    const U16: Uint16ArrayConstructor = Uint16Array;
    const U32: Uint32ArrayConstructor = Uint32Array;
    const F32: Float32ArrayConstructor = Float32Array;
    const F64: Float64ArrayConstructor = Float64Array;

    const H = (t: Float64ArrayConstructor, s: number, d: number[]) => (f: any) => {
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

    const F: number = (FPDF as any).Bitmap_BGRA;
    const C: number = 4;

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
        Bitmap_Gray: 1,
        Bitmap_BGR: 2,
        Bitmap_BGRx: 3,
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

    function initializeFPDF() {
        (FPDF as any).Init = PDFiumModule.cwrap('FPDF_InitLibrary');
        (FPDF as any).RenderPageBitmap = PDFiumModule.cwrap('FPDF_RenderPageBitmap', '', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
        (FPDF as any).Bitmap_FillRect = PDFiumModule.cwrap('FPDFBitmap_FillRect', '', ['number', 'number', 'number', 'number', 'number', 'number']);
        (FPDF as any).Bitmap_CreateEx = PDFiumModule.cwrap('FPDFBitmap_CreateEx', 'number', ['number', 'number', 'number', 'number', 'number']);
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
            const a = Array(1 + s);
            a[0] = ({ s, J, Z, E, m, free: () => PDFiumModule.asm.free(m) });
            for (let i = 0; i < s; i++) a[i + 1] = ({ p: m + (i * Z), get v() { return E[m / Z + i]; } });
            return a;
        };
    }

    function checkIfEverythingWasLoaded() {
        pageLoaded = true;
        if (pageLoaded || moduleLoaded) {
            startApp();
        }
    }

    PDFiumModule.onRuntimeInitialized = function () {
        moduleLoaded = true;
        checkIfEverythingWasLoaded();
    };

    function startApp() {
        initializeFPDF();
        if (pdfiumWindow.loaded) {
            pdfiumWindow.loaded();
        }
    }

    pdfiumWindow.onload = function () {
        pageLoaded = true;
        checkIfEverythingWasLoaded();
    }

    pdfiumWindow.loaded = function () {
        ctx.postMessage({ message: 'loaded' });
    }

    const ctx: Worker = self as any;
    ctx.onmessage = function (event) {
        if (event.data.message === 'initialLoading') {
            importScripts(event.data.url + '/pdfium.js');
            PDFiumModule.url = event.data.url;
            PDFiumModule.onRuntimeInitialized = function () {
                moduleLoaded = true;
                checkIfEverythingWasLoaded();
            };
            (this as any)['PDFiumModule'](PDFiumModule);
        }
        else if (event.data.message === 'LoadPageCollection') {
            pdfiumWindow.fileByteArray = event.data.uploadedFile;
            let fileSize: number = pdfiumWindow.fileByteArray.length;
            FPDF.Init();
            let wasmBuffer: number = PDFiumModule.asm.malloc(fileSize);
            PDFiumModule.HEAPU8.set(pdfiumWindow.fileByteArray, wasmBuffer);
            documentDetails = new DocumentInfo({
                wasm: FPDF.LoadMemDocument(wasmBuffer, fileSize, event.data.password),
                wasmBuffer: wasmBuffer,
            });
            let pages: number = FPDF.GetPageCount(documentDetails.processor.wasmData.wasm);
            documentDetails.setPages(pages);
            documentDetails.createAllPages();
            ctx.postMessage({ message: 'PageLoaded', pageIndex: event.data.pageIndex, isZoomMode: event.data.isZoomMode });
        }
        else if (event.data.message === 'LoadPageStampCollection') {
            let fileSize: number = event.data.uploadedFile.length;
            FPDF.Init();
            let wasmBuffer: number = PDFiumModule.asm.malloc(fileSize);
            PDFiumModule.HEAPU8.set(event.data.uploadedFile, wasmBuffer);
            let documentDetailsNew = new DocumentInfo({
                wasm: FPDF.LoadMemDocument(wasmBuffer, fileSize, event.data.password),
                wasmBuffer: wasmBuffer,
            });
            let pages: number = FPDF.GetPageCount(documentDetailsNew.processor.wasmData.wasm);
            documentDetailsNew.setPages(pages);
            documentDetailsNew.createAllPages();
            let firstPage: Page = documentDetailsNew.getPage(event.data.pageIndex);
            let ImageData: any = event.data;
            let data: object = firstPage.render(null, ImageData.zoomFactor, false, null, null, null, true);
            (data as any).message = "LoadedStamp";
            (data as any).annotName = event.data.AnnotName;
            (data as any).rubberStampAnnotationPageNumber = event.data.rubberStampAnnotationPageNumber;
            (data as any).annotationOrder = event.data.annotationOrder;
            ctx.postMessage(data);
        }
        if (documentDetails) {
            if (event.data.message === 'renderPage') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let ImageData: any = event.data;
                let data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null, ImageData.textDetailsId);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderPageSearch') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let ImageData: any = event.data;
                let data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null, ImageData.textDetailsId);
                (data as any).message = 'imageRenderedSearch';
                ctx.postMessage(data);
            }
            else if (event.data.message === 'extractText') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let ImageData: any = event.data;
                let data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null, ImageData.textDetailsId);
                (data as any).message = 'textExtracted';
                (data as any).isLayout = event.data.isLayout;
                (data as any).isRenderText = event.data.isRenderText;
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderThumbnail') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let data: object = firstPage.render("thumbnail", null, false, null, null);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderPreviewTileImage') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let data: object = firstPage.render("thumbnail", null, false, null, null);
                (data as any).message = 'renderPreviewTileImage';
                (data as any).startIndex = event.data.startIndex;
                (data as any).endIndex = event.data.endIndex;
                ctx.postMessage(data);
            }
            else if (event.data.message === 'printImage') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let data: object = firstPage.render("print", null, false, event.data.printScaleFactor, event.data.printDevicePixelRatio);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'extractImage') {
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let ImageData: any = event.data;
                let data: object = firstPage.render(null, ImageData.zoomFactor, ImageData.isTextNeed, null, null, ImageData.textDetailsId);
                (data as any).message = 'imageExtracted';
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderImageAsTile') {
                let values = event.data;
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let data: object = firstPage.renderTileImage(values.tileX, values.tileY, values.tileXCount, values.tileYCount, values.zoomFactor, event.data.isTextNeed, event.data.textDetailsId);
                ctx.postMessage(data);
            }
            else if (event.data.message === 'renderImageAsTileSearch') {
                let values = event.data;
                let firstPage: Page = documentDetails.getPage(event.data.pageIndex);
                let data: object = firstPage.renderTileImage(values.tileX, values.tileY, values.tileXCount, values.tileYCount, values.zoomFactor, event.data.isTextNeed, event.data.textDetailsId);
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

    }

    class Page {
        public index: number;
        public src: string;
        public processor: Processor;

        constructor(index: number, processor?: Processor) {
            this.index = index;
            this.src = null;
            this.processor = processor;
        }

        public render(message: any, zoomFactor?: number, isTextNeed?: boolean, printScaleFactor?: any, printDevicePixelRatio?: number, textDetailsId?: any, isTransparent?: boolean ): object {
            return this.processor.render(this.index, message, zoomFactor, isTextNeed, printScaleFactor, printDevicePixelRatio, textDetailsId, isTransparent);
        }
        public renderTileImage(x: any, y: any, tileX: any, tileY: any, zoomFactor?: number, isTextNeed?: boolean, textDetailsId?: any) {
            return this.processor.renderTileImage(this.index, x, y, tileX, tileY, zoomFactor, isTextNeed, textDetailsId);
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
    };

    class Processor {
        public wasmData: any;
        public TextBounds: any = [];
        public TextContent: any = [];
        public CharacterBounds: any = [];
        public Rotation: number;
        public PageText: string = "";
        constructor(wasmData: any) {
            this.wasmData = wasmData;
        }

        public getPageSize(i = 0) {
            return H(F64, 2, [-1, -1])((w: any, h: any) => (FPDF as any).GetPageSizeByIndex(this.wasmData.wasm, i, w, h)).map((v: number) => parseInt((v * (96 / 72)).toString()));
        }

        public getCharBounds(pagePointer: any, i = 0) {
            return H(F64, 4, [-1, -1, -1, -1])((left: any, right: any, bottom: any, top: any) => (FPDF as any).GetCharBox(pagePointer, i, left, right, bottom, top));
        }

        public getRender(i = 0, w: any, h: any, isTextNeed: boolean, isTransparent?: boolean) {
            const flag = (FPDF as any).REVERSE_BYTE_ORDER;
            const heap = PDFiumModule.asm.malloc(w * h * 4);
            PDFiumModule.HEAPU8.fill(0, heap, heap + (w * h * 4));
            const bmap = (FPDF as any).Bitmap_CreateEx(w, h, (FPDF as any).Bitmap_BGRA, heap, w * 4);
            const page = (FPDF as any).LoadPage(this.wasmData.wasm, i);
            (FPDF as any).Bitmap_FillRect(bmap, 0, 0, w, h, isTransparent ? 0x00FFFFFF : 0xFFFFFFFF);
            (FPDF as any).RenderPageBitmap(bmap, page, 0, 0, w, h, 0, flag);
            (FPDF as any).Bitmap_Destroy(bmap);
            this.textExtraction(page, i, isTextNeed);
            (FPDF as any).ClosePage(page);
            return heap;
        }

        public textExtraction(pagePointer: any, pageIndex: number, isTextNeed: boolean) {
            if (isTextNeed) {
                const [pageWidth, pageHeight] = this.getPageSize(pageIndex);
                const textPage = (FPDF as any).LoadTextPage(pagePointer, pageIndex);
                const pageRotation = (FPDF as any).GetPageRotation(pagePointer);
                const totalCharacterCount = (FPDF as any).TextCountChars(textPage);
                this.TextBounds = [];
                this.TextContent = [];
                this.CharacterBounds = [];
                let pageText: string = "";
                let minTop: number = 0;
                let maxBottom: number = 0;
                let minLeft: number = 0;
                let maxRight: number = 0;
                let top: any = [];
                let bottom: any = [];
                let left: any = [];
                let right: any = [];
                let wordBounds: any = [];
                let word: string = "";
                let wordMinLeft: number = 0;
                let wordMaxRight: number = 0;
                let wordMinTop: number = 0;
                let wordMaxBottom: number = 0;
                let wordRotation: number = 0;
                let wordStart: boolean = true;
                let isZeroWidthSpace: boolean = false;
                let isPreviousSpace: boolean = false;
                let startNewLine: boolean = false;
                let maximumSpaceForNewLine: number = 11;
                for (let charCount: number = 0; charCount <= totalCharacterCount; charCount++) {
                    let result: any = (FPDF as any).GetUnicodeChar(textPage, charCount);
                    let rotationRadian : any = (FPDF as any).GetCharAngle(textPage, charCount);
                    let character: string = String.fromCharCode(result);
                    let [charLeft, charRight, charBottom, charTop] = this.getCharBounds(textPage, charCount);
                    let X: number = this.pointerToPixelConverter(charLeft);
                    let Y: number = (pageHeight) - this.pointerToPixelConverter(charTop);
                    let Width = this.pointerToPixelConverter(charRight - charLeft);
                    let Height = this.pointerToPixelConverter(charTop - charBottom);
                    let rotationAngle: number = parseInt((rotationRadian * 180 / Math.PI).toString());
                    if (charCount < totalCharacterCount) {
                        pageText += character;
                        let currentCharacterBounds: any = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                        this.CharacterBounds.push(currentCharacterBounds);
                    }
                    if (pageRotation == 1 || pageRotation == 3) {
                        Y = (pageWidth) - this.pointerToPixelConverter(charTop);
                    }
                    switch (character) {
                        case "\0":
                            minTop = Math.min.apply(Math, top);
                            maxBottom = Math.max.apply(Math, bottom);
                            minLeft = Math.min.apply(Math, left);
                            maxRight = Math.max.apply(Math, right);
                            let newWordBounds: any = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                            wordBounds.push(newWordBounds);
                            this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation, pageWidth, pageHeight);
                            wordBounds = [];
                            wordStart = true;
                            isPreviousSpace = false;
                            word = "";
                            top = [];
                            left = [];
                            bottom = [];
                            right = [];
                            minTop = 0;
                            maxBottom = 0;
                            minLeft = 0;
                            maxRight = 0;
                            break;
                        case "\r":
                            if (charCount < totalCharacterCount) {
                                let characterBounds: any = new RectAngle(X, Y, Width, Height, "\r\n", rotationAngle);
                                top.push(characterBounds.Top);
                                bottom.push(characterBounds.Bottom);
                                left.push(characterBounds.Left);
                                right.push(characterBounds.Right);
                                minTop = Math.min.apply(Math, top);
                                maxBottom = Math.max.apply(Math, bottom);
                                minLeft = Math.min.apply(Math, left);
                                maxRight = Math.max.apply(Math, right);
                                let newWordBounds: any;
                                if (wordStart == false) {
                                    newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                    wordBounds.push(newWordBounds);
                                }
                                wordBounds.push(characterBounds);
                                this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation, pageWidth, pageHeight);
                                wordBounds = [];
                                wordStart = true;
                                isPreviousSpace = false;
                                word = "";
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
                                rotationAngle = parseInt((rotationRadian * 180 / Math.PI).toString());
                                let currentCharacterBounds: any = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                                this.CharacterBounds.push(currentCharacterBounds);
                                charCount++;
                            }
                            break;
                        case "\u0002":
                        case "\ufffe":
                            {
                                let characterBounds: any = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                                top.push(characterBounds.Top);
                                bottom.push(characterBounds.Bottom);
                                left.push(characterBounds.Left);
                                right.push(characterBounds.Right);
                                minTop = Math.min.apply(Math, top);
                                maxBottom = Math.max.apply(Math, bottom);
                                minLeft = Math.min.apply(Math, left);
                                maxRight = Math.max.apply(Math, right);
                                let newWordBounds: any;
                                if (wordStart == false) {
                                    newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                    wordBounds.push(newWordBounds);
                                }
                                if (character == "\u0002") {
                                    wordBounds.push(characterBounds);
                                }
                                this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation, pageWidth, pageHeight);
                                wordBounds = [];
                                wordStart = true;
                                isPreviousSpace = false;
                                word = "";
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
                            if (Width == 0 || Height == 0) {
                                isZeroWidthSpace = true;
                                minTop = Math.min.apply(Math, top);
                                maxBottom = Math.max.apply(Math, bottom);
                                minLeft = Math.min.apply(Math, left);
                                maxRight = Math.max.apply(Math, right);
                                let newWordBounds: any = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                                let characterBounds: any = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                                wordMinTop = characterBounds.Top;
                                wordMaxBottom = characterBounds.Bottom;
                                wordMinLeft = characterBounds.Left;
                                wordMaxRight = characterBounds.Right;
                                word = character;
                                wordRotation = wordBounds[wordBounds.length - 1].Rotation;
                                newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                wordBounds.push(newWordBounds);
                                wordMinTop = 0;
                                wordMaxBottom = 0;
                                wordMinLeft = 0;
                                wordMaxRight = 0;
                                word = "";
                                wordRotation = 0;
                                wordStart = true;
                                isPreviousSpace = true;
                            }
                            else {
                                if (wordStart == true) {
                                    wordMinTop = Y;
                                    wordMaxBottom = Y + Height;
                                    wordMinLeft = X;
                                    wordMaxRight = X + Width;
                                }
                                let characterBounds = new RectAngle(X, Y, Width, Height, character, rotationAngle);
                                if (character != " ") {
                                    if (isPreviousSpace && wordBounds.length > 0 && (rotationAngle == wordBounds[0].Rotation)) {
                                        if ((rotationAngle == 180 || rotationAngle == 0) && (Math.abs(characterBounds.Y - wordBounds[0].Y) > maximumSpaceForNewLine)) {
                                            startNewLine = true;
                                        }
                                        if ((rotationAngle == 270 || rotationAngle == 90) && (Math.abs(characterBounds.X - wordBounds[0].X) > maximumSpaceForNewLine)) {
                                            startNewLine = true;
                                        }
                                    }
                                    if ((isZeroWidthSpace && wordBounds.length >= 1 && wordBounds[wordBounds.length - 1].Rotation != characterBounds.Rotation) || startNewLine) {
                                        isZeroWidthSpace = false;
                                        startNewLine = false;
                                        minTop = Math.min.apply(Math, top);
                                        maxBottom = Math.max.apply(Math, bottom);
                                        minLeft = Math.min.apply(Math, left);
                                        maxRight = Math.max.apply(Math, right);
                                        let newWordBounds: any;
                                        if (wordStart == false) {
                                            newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                            wordBounds.push(newWordBounds);
                                        }
                                        this.textBoundsCalculation(wordBounds, minTop, maxBottom, maxRight, minLeft, pageRotation, pageWidth, pageHeight);
                                        wordBounds = [];
                                        wordStart = true;
                                        word = "";
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
                                    let newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                    wordBounds.push(newWordBounds);
                                    wordMinTop = characterBounds.Top;
                                    wordMaxBottom = characterBounds.Bottom;
                                    wordMinLeft = characterBounds.Left;
                                    wordMaxRight = characterBounds.Right;
                                    word = character;
                                    wordRotation = characterBounds.Rotation;
                                    newWordBounds = new RectAngle(wordMinLeft, wordMinTop, wordMaxRight - wordMinLeft, wordMaxBottom - wordMinTop, word, wordRotation);
                                    wordBounds.push(newWordBounds);
                                    wordMinTop = 0;
                                    wordMaxBottom = 0;
                                    wordMinLeft = 0;
                                    wordMaxRight = 0;
                                    word = "";
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

        public textBoundsCalculation(wordBounds: any, minTop: number, maxBottom: number, maxRight: number, minLeft: number, pageRotation: number, pageWidth: number, pageHeight: number): void {
            let newWordBounds: any;
            let hasInBetweenRotation: boolean = false;
            let inBetweenRotatedText: string = "";
            let maximumSpaceBetweenWords: number = 30;
            let sentence: string = wordBounds.reduce((word: string, rect: any) => word + rect.Text, '');
            let isRTLText: boolean = this.checkIsRtlText(sentence);
            for (let count: number = 0; count < wordBounds.length; count++) {
                let textRotation: number = wordBounds[count].Rotation;
                if (textRotation == 0 || textRotation == 180) {
                    if (hasInBetweenRotation) {
                        this.TextBounds.push(newWordBounds);
                        this.TextContent.push(inBetweenRotatedText);
                        inBetweenRotatedText = "";
                    }
                    hasInBetweenRotation = false;
                    if (pageRotation == 0) {
                        newWordBounds = new RectAngle(wordBounds[count].Left, minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 1) {
                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count].Left, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 2) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[count].Left, pageHeight - minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 3) {
                        newWordBounds = new RectAngle(minTop, pageHeight - wordBounds[count].Left, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    }
                } else if (textRotation == 90 || textRotation == 270) {
                    if (hasInBetweenRotation) {
                        this.TextBounds.push(newWordBounds);
                        this.TextContent.push(inBetweenRotatedText);
                        inBetweenRotatedText = "";
                    }
                    hasInBetweenRotation = false;
                    if (pageRotation == 0) {
                        newWordBounds = new RectAngle(minLeft, wordBounds[count].Top, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 1) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[count].Top, minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 2) {
                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - wordBounds[count].Top, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 3) {
                        newWordBounds = new RectAngle(wordBounds[count].Top, pageHeight - minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                    }
                } else if (!hasInBetweenRotation) {
                    hasInBetweenRotation = true;
                    inBetweenRotatedText += wordBounds[count].Text;
                    if (pageRotation == 0) {
                        newWordBounds = new RectAngle(wordBounds[count].Left, minTop, maxRight - minLeft, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 1) {
                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count].Left, maxRight - minLeft, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 2) {
                        newWordBounds = new RectAngle(pageWidth - wordBounds[count].Left, pageHeight - minTop, maxRight - minLeft, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    } else if (pageRotation == 3) {
                        newWordBounds = new RectAngle(minTop, pageHeight - wordBounds[count].Left, maxRight - minLeft, maxBottom - minTop, wordBounds[count].Text, textRotation);
                    }
                } else {
                    inBetweenRotatedText += wordBounds[count].Text;
                }
                if (!hasInBetweenRotation && wordBounds[count].Text === " " && count !== 0 && count + 1 <= wordBounds.length) {
                    if (!isRTLText) {
                        if (count + 1 != wordBounds.length) {
                            let spaceWidth: number = 0;
                            switch (textRotation) {
                                case 0:
                                    spaceWidth = wordBounds[count + 1].Left - (wordBounds[count - 1].Left + wordBounds[count - 1].Width);
                                    if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                        spaceWidth = 0;
                                    }
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(wordBounds[count - 1].Left + wordBounds[count - 1].Width, minTop, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count - 1].Left + wordBounds[count - 1].Width, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left + wordBounds[count - 1].Width), pageHeight - minTop, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left + wordBounds[count - 1].Width), spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 90:
                                    spaceWidth = wordBounds[count + 1].Top - (wordBounds[count - 1].Top + wordBounds[count - 1].Height);
                                    if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                        spaceWidth = 0;
                                    }
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top + wordBounds[count - 1].Height, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top + wordBounds[count - 1].Height), minLeft, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - (wordBounds[count - 1].Top + wordBounds[count - 1].Height), maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle((wordBounds[count - 1].Top + wordBounds[count - 1].Height), pageHeight - minLeft, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 180:
                                    spaceWidth = wordBounds[count - 1].Left - (wordBounds[count + 1].Left + wordBounds[count + 1].Width);
                                    if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                        spaceWidth = 0;
                                    }
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(wordBounds[count + 1].Left + wordBounds[count + 1].Width, minTop, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count + 1].Left + wordBounds[count + 1].Width, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count + 1].Left + wordBounds[count + 1].Width), pageHeight - minTop, spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count + 1].Left + wordBounds[count + 1].Width), spaceWidth, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 270:
                                    spaceWidth = wordBounds[count - 1].Top - (wordBounds[count + 1].Top + wordBounds[count + 1].Height);
                                    if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                                        spaceWidth = 0;
                                    }
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(minLeft, wordBounds[count + 1].Top + wordBounds[count + 1].Height, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count + 1].Top + wordBounds[count + 1].Height), minLeft, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - (wordBounds[count + 1].Top + wordBounds[count + 1].Height), maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle((wordBounds[count + 1].Top + wordBounds[count + 1].Height), pageHeight - minLeft, maxRight - minLeft, spaceWidth, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                            }
                        } else {
                            switch (textRotation) {
                                case 90:
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top + wordBounds[count - 1].Height, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top + wordBounds[count - 1].Height), minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - (wordBounds[count - 1].Top + wordBounds[count - 1].Height), maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle((wordBounds[count - 1].Top + wordBounds[count - 1].Height), pageHeight - minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 270:
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(minLeft, wordBounds[count - 1].Top - wordBounds[count].Height, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Top - wordBounds[count].Height), minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - minLeft, pageHeight - wordBounds[count - 1].Top - wordBounds[count].Height, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle((wordBounds[count - 1].Top - wordBounds[count].Height), pageHeight - minLeft, maxRight - minLeft, wordBounds[count].Height, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 180:
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(wordBounds[count - 1].Left - wordBounds[count].Width, minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle((pageWidth - minTop), wordBounds[count - 1].Left - wordBounds[count].Width, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left - wordBounds[count].Width), pageHeight - minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left - wordBounds[count].Width), wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                                case 0:
                                    if (pageRotation == 0) {
                                        newWordBounds = new RectAngle(wordBounds[count - 1].Left + wordBounds[count - 1].Width, minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 1) {
                                        newWordBounds = new RectAngle(pageWidth - minTop, wordBounds[count - 1].Left + wordBounds[count - 1].Width, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 2) {
                                        newWordBounds = new RectAngle(pageWidth - (wordBounds[count - 1].Left + wordBounds[count - 1].Width), pageHeight - minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    } else if (pageRotation == 3) {
                                        newWordBounds = new RectAngle(minTop, pageHeight - (wordBounds[count - 1].Left + wordBounds[count - 1].Width), wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, textRotation);
                                    }
                                    break;
                            }
                        }
                    } else if (isRTLText && count + 1 != wordBounds.length) {
                        let spaceWidth = (wordBounds[count - 1].Left - (wordBounds[count + 1].Left + wordBounds[count + 1].Width));
                        if (maximumSpaceBetweenWords < spaceWidth || spaceWidth < 0) {
                            spaceWidth = 0;
                        }
                        newWordBounds = new RectAngle((wordBounds[count + 1].Left + wordBounds[count + 1].Width), minTop, spaceWidth, maxBottom - minTop, wordBounds[count].Text, wordBounds[count].Rotation);
                    } else if (isRTLText) {
                        newWordBounds = new RectAngle((wordBounds[count - 1].Left - wordBounds[count].Width), minTop, wordBounds[count].Width, maxBottom - minTop, wordBounds[count].Text, wordBounds[count].Rotation);
                    }
                }
                if (!hasInBetweenRotation) {
                    this.TextBounds.push(newWordBounds);
                    this.TextContent.push(wordBounds[count].Text);
                }
            }
            if (hasInBetweenRotation) {
                this.TextBounds.push(newWordBounds);
                this.TextContent.push(inBetweenRotatedText);
            }
        }

        public checkIsRtlText(text: string): boolean {
            // eslint-disable-next-line max-len
            const ltrChars: string = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
            const rtlChars: string = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
            // eslint-disable-next-line
            let rtlDirCheck: any = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
            return rtlDirCheck.test(text);
        }

        public getPageRender(n = 0, w: any, h: any, isTextNeed: boolean, isTransparent?: boolean ) {
            let pageRenderPtr = this.getRender(n, w, h, isTextNeed, isTransparent);
            let pageRenderData = [];
            pageRenderData = PDFiumModule.HEAPU8.slice(pageRenderPtr, pageRenderPtr + (w * h * 4));
            PDFiumModule.asm.free(pageRenderPtr);
            return pageRenderData;
        }

        public render(n = 0, message: any, zoomFactor: number, isTextNeed: boolean, printScaleFactor: any, printDevicePixelRatio: number, textDetailsId: any, isTransparent?: boolean ): object {
            const [w, h] = this.getPageSize(n);
            const scaleFactor = 1.5;
            const thumbnailWidth = 99.7;
            const thumbnailHeight = 141;
            if (message === 'thumbnail') {
                let newWidth = Math.round(thumbnailWidth * scaleFactor);
                let newHeight = Math.round(thumbnailHeight * scaleFactor);
                const data = this.getPageRender(n, newWidth, newHeight, false);
                return { value: data, width: newWidth, height: newHeight, pageIndex: n, message: 'renderThumbnail'};
            }
            else if (message === 'print') {
                //An A0 piece of paper measures 33.1 × 46.8 inches, with 46.8 inches being the greater dimension. The pixel value of 46.8 inches is 4493px. If the document size is too large, we may not be able to display the image. Therefore, we should consider the maximum size of A0 paper if the page size is greater than 4493 pixels.
                const maxPageSize = 4493;
                const scaleFactor = 1.5;
                const whichIsBigger = (w > h) ? 'Width' : 'Height';
                let maxWidth = w;
                let maxHeight = h;
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
                let newWidth = Math.round(maxWidth * printScaleFactor * scaleFactor);
                let newHeight = Math.round(maxHeight * printScaleFactor * scaleFactor);
                const data = this.getPageRender(n, newWidth, newHeight, false);
                return { value: data, width: newWidth, height: newHeight, pageIndex: n, pageWidth: w, pageHeight: h, message: 'printImage', printDevicePixelRatio };
            }
            else {
                let newWidth = Math.round(w * scaleFactor * zoomFactor);
                let newHeight = Math.round(h * scaleFactor * zoomFactor);
                // Reduce the zoom factor if the new image size exceeds the memory limit
                while (((newWidth * newHeight * 4) * 2) >= 2147483648) {
                    zoomFactor = zoomFactor - 0.1;
                    newWidth = Math.round(this.pointerToPixelConverter(w) * zoomFactor);
                    newHeight = Math.round(this.pointerToPixelConverter(h) * zoomFactor);
                }
                const data = this.getPageRender(n, newWidth, newHeight, isTextNeed, isTransparent);
                return { value: data, width: newWidth, height: newHeight, pageWidth: w, pageHeight: h, pageIndex: n, message: 'imageRendered', textBounds: this.TextBounds, textContent: this.TextContent, rotation: this.Rotation, pageText: this.PageText, characterBounds: this.CharacterBounds, zoomFactor: zoomFactor,isTextNeed: isTextNeed,textDetailsId: textDetailsId };
            }
        }

        public renderTileImage(n = 0, tileX: any, tileY: any, xCount: any, yCount: any, zoomFactor: number, isTextNeed: boolean, textDetailsId: any) : object{
            const [w, h] = this.getPageSize(n);
            var newWidth = Math.round(w * 1.5 * zoomFactor);
            var newHeight = Math.round(h * 1.5 * zoomFactor);

            let w1 = Math.round(newWidth / xCount);
            let h1 = Math.round(newHeight / yCount);

            const flag = FPDF.REVERSE_BYTE_ORDER;
            const heap = PDFiumModule.asm.malloc(w1 * h1 * 4);
            PDFiumModule.HEAPU8.fill(0, heap, heap + (w1 * h1 * 4));
            const bmap = FPDF.Bitmap_CreateEx(w1, h1, 4, heap, w1 * 4);
            const page = FPDF.LoadPage(this.wasmData.wasm, n);

            FPDF.Bitmap_FillRect(bmap, 0, 0, w1, h1, 0xFFFFFFFF);
            FPDF.RenderPageBitmap(bmap, page, -tileX * w1, -tileY * h1, newWidth, newHeight, 0, flag);
            FPDF.Bitmap_Destroy(bmap);
            this.textExtraction(page, n, isTextNeed);
            FPDF.ClosePage(page);
            let pageRenderPtr = heap;
            let data = [];
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
          };

        public getLastError() {
            let lastError = (FPDF as any).GetLastError();
            switch (lastError) {
                case (FPDF as any).LAST_ERROR.SUCCESS:
                    return "success";
                case (FPDF as any).LAST_ERROR.UNKNOWN:
                    return "unknown error";
                case (FPDF as any).LAST_ERROR.FILE:
                    return "file not found or could not be opened";
                case (FPDF as any).LAST_ERROR.FORMAT:
                    return "file not in PDF format or corrupted";
                case (FPDF as any).LAST_ERROR.PASSWORD:
                    return "password required or incorrect password";
                case (FPDF as any).LAST_ERROR.SECURITY:
                    return "unsupported security scheme";
                case (FPDF as any).LAST_ERROR.PAGE:
                    return "page not found or content error";
                default:
                    return "unknown error";
            }
        }
    }

    class DocumentInfo {
        public processor: Processor;
        public pages: any[] = [];
        constructor(wasmData: any) {
            this.processor = new Processor(wasmData);
        }

        public setPages(pagesCount: any) {
            this.pages = Array(pagesCount).fill(null);
        }

        public createAllPages() {
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[parseInt(i.toString(), 10)] = new Page(parseInt(i.toString(), 10), this.processor);
            }
        }

        public getPage(index: any) {
            // eslint-disable-next-line
            let page = this.pages[index];
            if (!page) {
                page = new Page(index);
                // eslint-disable-next-line
                this.pages[index] = page;
            }
            return page;
        }
    }
}

