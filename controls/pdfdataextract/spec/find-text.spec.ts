import { PdfBrush, PdfDocument, PdfFontFamily, PdfMargins, PdfPage, PdfPageSettings, PdfRotationAngle, PdfStandardFont,Rectangle } from '@syncfusion/ej2-pdf';
import { PdfDataExtractor, TextSearchResult} from '../src/pdf-data-extract/core/pdf-data-extractor';
import { pdfSuccinctly } from './inputs.spec';
describe('1030750 - findTextSync combined coverage', () => {
    const getTotalCount: (result: TextSearchResult) => number =
        (result: TextSearchResult): number => {
            let count: number = 0;
            result.searchResults.forEach((boundsCollection: Rectangle[]): void => {
                count += boundsCollection.length;
            });
            return count;
        };
    const getFirstBounds: (result: TextSearchResult) => Rectangle[] =
        (result: TextSearchResult): Rectangle[] => {
            let bounds: Rectangle[] = [];
            result.searchResults.forEach((boundsCollection: Rectangle[]): void => {
                if (bounds.length === 0 && boundsCollection.length > 0) {
                    bounds = boundsCollection;
                }
            });
            return bounds;
        };
    const getPageBounds: (result: TextSearchResult, pageNumber: number) => Rectangle[] =
        (result: TextSearchResult, pageNumber: number): Rectangle[] => {
            const bounds: Rectangle[] | undefined = result.searchResults.get(pageNumber);
            expect(bounds).toBeDefined();
            return bounds as Rectangle[];
        };
    it('1030750 - should validate reloaded page size, margin and rotation searches', () => {
        // Arrange
        const sourceDocument: PdfDocument = new PdfDocument();
        const font20: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 20);
        const font16: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 16);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const repeatedPage: PdfPage = sourceDocument.addPage();
        repeatedPage.graphics.drawString(
            'HelloWorldHelloWorld',
            font20,
            { x: 50, y: 100, width: 400, height: 40 },
            brush
        );
        const rotatedSettings: PdfPageSettings = new PdfPageSettings();
        rotatedSettings.size = { width: 595, height: 842 };
        rotatedSettings.margins = new PdfMargins(40);
        rotatedSettings.rotation = PdfRotationAngle.angle90;
        const rotatedPage: PdfPage = sourceDocument.addPage(rotatedSettings);
        rotatedPage.graphics.drawString(
            'RotatedfindTextSyncBounds',
            font20,
            { x: 50, y: 80, width: 350, height: 40 },
            brush
        );
        const pageSettings: Array<{ size: { width: number; height: number }; margins: PdfMargins; x: number; y: number }> = [
            { size: { width: 300, height: 300 }, margins: new PdfMargins(20), x: 20, y: 40 },
            { size: { width: 595, height: 842 }, margins: new PdfMargins(40), x: 80, y: 120 },
            { size: { width: 842, height: 595 }, margins: new PdfMargins(40), x: 150, y: 200 }
        ];
        for (const item of pageSettings) {
            const settings: PdfPageSettings = new PdfPageSettings();
            settings.size = item.size;
            settings.margins = item.margins;
            const page: PdfPage = sourceDocument.addPage(settings);
            page.graphics.drawString(
                'PageSizefindTextSync',
                font16,
                { x: item.x, y: item.y, width: 300, height: 30 },
                brush
            );
        }
        const marginSettings: Array<{ margins: PdfMargins; x: number; y: number }> = [
            { margins: new PdfMargins(0), x: 10, y: 20 },
            { margins: new PdfMargins(40), x: 20, y: 40 }
        ];
        const customMargins: PdfMargins = new PdfMargins();
        customMargins.left = 100;
        customMargins.top = 80;
        customMargins.right = 60;
        customMargins.bottom = 50;
        marginSettings.push({ margins: customMargins, x: 30, y: 60 });
        for (const item of marginSettings) {
            const settings: PdfPageSettings = new PdfPageSettings();
            settings.size = { width: 595, height: 842 };
            settings.margins = item.margins;
            const page: PdfPage = sourceDocument.addPage(settings);
            page.graphics.drawString(
                'MarginfindTextSync',
                font16,
                { x: item.x, y: item.y, width: 250, height: 30 },
                brush
            );
        }
        const rotations: PdfRotationAngle[] = [
            PdfRotationAngle.angle90,
            PdfRotationAngle.angle180,
            PdfRotationAngle.angle270
        ];
        const rotationLocations: Array<{ x: number; y: number }> = [
            { x: 40, y: 60 },
            { x: 70, y: 100 },
            { x: 100, y: 140 }
        ];
        for (let index: number = 0; index < rotations.length; index++) {
            const settings: PdfPageSettings = new PdfPageSettings();
            settings.size = { width: 595, height: 842 };
            settings.margins = new PdfMargins(40);
            settings.rotation = rotations[index];
            const page: PdfPage = sourceDocument.addPage(settings);
            page.graphics.drawString(
                'RotationAnglefindTextSync',
                font16,
                {
                    x: rotationLocations[index].x,
                    y: rotationLocations[index].y,
                    width: 300,
                    height: 30
                },
                brush
            );
        }
        const data: Uint8Array = sourceDocument.save();
        sourceDocument.destroy();
        const document: PdfDocument = new PdfDocument(data);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const results: TextSearchResult[] = extractor.findTextSync([
            'Hello',
            'RotatedfindTextSyncBounds',
            'PageSizefindTextSync',
            'MarginfindTextSync',
            'RotationAnglefindTextSync'
        ]);
        const repeatedBounds: Rectangle[] = getPageBounds(results[0], 1);
        const rotatedBounds: Rectangle[] = getPageBounds(results[1], 2);
        const smallBounds: Rectangle[] = getPageBounds(results[2], 3);
        const a4Bounds: Rectangle[] = getPageBounds(results[2], 4);
        const landscapeBounds: Rectangle[] = getPageBounds(results[2], 5);
        const zeroMarginBounds: Rectangle[] = getPageBounds(results[3], 6);
        const normalMarginBounds: Rectangle[] = getPageBounds(results[3], 7);
        const customMarginBounds: Rectangle[] = getPageBounds(results[3], 8);
        const angle90Bounds: Rectangle[] = getPageBounds(results[4], 9);
        const angle180Bounds: Rectangle[] = getPageBounds(results[4], 10);
        const angle270Bounds: Rectangle[] = getPageBounds(results[4], 11);
        // Assert
        expect(document.pageCount).toBe(11);
        expect(repeatedBounds.length).toBe(2);
        expect(repeatedBounds[0].x).toBe(90.00);
        expect(repeatedBounds[0].width).toBe(45.56);
        expect(repeatedBounds[1].x).toBe(187.78);
        expect(rotatedBounds[0].x).toBe(90.00);
        expect(rotatedBounds[0].width).toBe(253.46000000000004);
        expect(smallBounds[0].x).toBe(40.00);
        expect(smallBounds[0].width).toBe(160.96000000000004);
        expect(a4Bounds[0].x).toBe(120.00);
        expect(landscapeBounds[0].x).toBe(190.00);
        expect(zeroMarginBounds[0].x).toBe(10.00);
        expect(normalMarginBounds[0].x).toBe(60.00);
        expect(customMarginBounds[0].x).toBe(130.00);
        expect(angle90Bounds[0].x).toBe(80.00);
        expect(angle180Bounds[0].x).toBe(110.00);
        expect(angle270Bounds[0].x).toBe(140.00);
        document.destroy();
    });
    it('1030750 - should validate default, case-sensitive, partial and missing text searches', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument(pdfSuccinctly);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const defaultResults: TextSearchResult[] = extractor.findTextSync([
            'Succinctly',
            'PDF',
            'pDf',
            'Suc',
            'Header',
            'TextNotAvailableInPdfSuccinctlyDocument',
            ''
        ]);
        const succinctlyResult: TextSearchResult = defaultResults[0];
        const pdfResult: TextSearchResult = defaultResults[1];
        const defaultCaseResult: TextSearchResult = defaultResults[2];
        const defaultPartialResult: TextSearchResult = defaultResults[3];
        const headerResult: TextSearchResult = defaultResults[4];
        const missingResult: TextSearchResult = defaultResults[5];
        const emptyResult: TextSearchResult = defaultResults[6];
        const caseSensitiveResults: TextSearchResult[] = extractor.findTextSync(
            ['PDF', 'pDf'],
            { caseSensitive: true }
        );
        const exactCaseResult: TextSearchResult = caseSensitiveResults[0];
        const differentCaseResult: TextSearchResult = caseSensitiveResults[1];
        const explicitCaseInsensitiveResult: TextSearchResult = extractor.findTextSync(
            'pDf',
            { caseSensitive: false }
        );
        const succinctlyBounds: Rectangle[] = getFirstBounds(succinctlyResult);
        const pdfPage1Bounds: Rectangle[] = getPageBounds(pdfResult, 1);
        const pdfPage2Bounds: Rectangle[] = getPageBounds(pdfResult, 2);
        const defaultCaseBounds: Rectangle[] = getFirstBounds(defaultCaseResult);
        const explicitCaseInsensitiveBounds: Rectangle[] = getFirstBounds(explicitCaseInsensitiveResult);
        const defaultPartialBounds: Rectangle[] = getFirstBounds(defaultPartialResult);
        const headerBounds: Rectangle[] = getFirstBounds(headerResult);
        const exactCaseBounds: Rectangle[] = getPageBounds(exactCaseResult, 1);
        // Assert
        expect(defaultResults.length).toBe(7);
        expect(succinctlyResult.searchText).toBe('Succinctly');
        expect(succinctlyResult.searchResults instanceof Map).toBe(true);
        expect(succinctlyResult.searchResults.size).toBeGreaterThan(0);
        expect(succinctlyResult.searchResults.has(0)).toBe(false);
        expect(succinctlyBounds.length).toBeGreaterThan(0);
        expect(succinctlyBounds[0].x).toBe(254.69);
        expect(succinctlyBounds[0].y).toBe(92.65999999999997);
        expect(succinctlyBounds[0].width).toBe(202.656);
        expect(succinctlyBounds[0].height).toBe(48);
        expect(pdfResult.searchText).toBe('PDF');
        expect(pdfResult.searchResults.has(1)).toBe(true);
        expect(pdfResult.searchResults.has(2)).toBe(true);
        expect(pdfResult.searchResults.size).toBeGreaterThan(1);
        expect(pdfPage1Bounds[0].x).toBe(430.38600000000037);
        expect(pdfPage1Bounds[0].y).toBe(12.11099999999999);
        expect(pdfPage1Bounds[0].width).toBe(24);
        expect(pdfPage1Bounds[0].height).toBe(12);
        expect(pdfPage2Bounds[0].x).toBe(154.58);
        expect(pdfPage2Bounds[0].y).toBe(92.65999999999997);
        expect(pdfPage2Bounds[0].width).toBe(88.03200000000001);
        expect(pdfPage2Bounds[0].height).toBe(48);
        expect(exactCaseResult.searchText).toBe('PDF');
        expect(exactCaseResult.searchResults.size).toBeGreaterThan(0);
        expect(exactCaseBounds[0].x).toBe(430.38600000000037);
        expect(exactCaseBounds[0].width).toBe(24);
        expect(differentCaseResult.searchText).toBe('pDf');
        expect(differentCaseResult.searchResults.size).toBe(0);
        expect(getTotalCount(defaultCaseResult)).toBe(getTotalCount(explicitCaseInsensitiveResult));
        expect(defaultCaseBounds[0].x).toBe(430.38600000000037);
        expect(explicitCaseInsensitiveBounds[0].x).toBe(430.38600000000037);
        expect(defaultPartialResult.searchText).toBe('Suc');
        expect(defaultPartialResult.searchResults.size).toBeGreaterThan(0);
        expect(defaultPartialBounds[0].x).toBe(254.69);
        expect(defaultPartialBounds[0].y).toBe(92.65999999999997);
        expect(defaultPartialBounds[0].width).toBe(72);
        expect(defaultPartialBounds[0].height).toBe(48);
        expect(headerResult.searchText).toBe('Header');
        expect(headerBounds[0].x).toBe(104.42);
        expect(headerBounds[0].y).toBe(233.77999999999994);
        expect(headerBounds[0].width).toBe(36.07871999999999);
        expect(headerBounds[0].height).toBe(11.039999999999992);
        expect(missingResult.searchResults.size).toBe(0);
        expect(emptyResult.searchText).toBe('');
        expect(emptyResult.searchResults.size).toBe(0);
        document.destroy();
    });
    it('1030750 - should validate whole-word and combined option searches', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument(pdfSuccinctly);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const wholeWordResults: TextSearchResult[] = extractor.findTextSync(
            ['PDF', 'Suc'],
            { wholeWord: true }
        );
        const wholeWordResult: TextSearchResult = wholeWordResults[0];
        const unmatchedWholeWordResult: TextSearchResult = wholeWordResults[1];
        const combinedResults: TextSearchResult[] = extractor.findTextSync(
            ['PDF', 'pDf'],
            { caseSensitive: true, wholeWord: true }
        );
        const combinedMatchedResult: TextSearchResult = combinedResults[0];
        const combinedUnmatchedResult: TextSearchResult = combinedResults[1];
        const wholeWordBounds: Rectangle[] = getPageBounds(wholeWordResult, 1);
        const combinedBounds: Rectangle[] = getPageBounds(combinedMatchedResult, 1);
        // Assert
        expect(wholeWordResults.length).toBe(2);
        expect(wholeWordResult.searchText).toBe('PDF');
        expect(wholeWordResult.searchResults.size).toBeGreaterThan(0);
        expect(wholeWordBounds[0].x).toBe(430.38600000000037);
        expect(wholeWordBounds[0].y).toBe(12.11099999999999);
        expect(wholeWordBounds[0].width).toBe(24);
        expect(wholeWordBounds[0].height).toBe(12);
        expect(unmatchedWholeWordResult.searchText).toBe('Suc');
        expect(unmatchedWholeWordResult.searchResults.size).toBe(0);
        expect(combinedMatchedResult.searchResults.size).toBeGreaterThan(0);
        expect(combinedBounds[0].x).toBe(430.38600000000037);
        expect(combinedBounds[0].width).toBe(24);
        expect(combinedUnmatchedResult.searchResults.size).toBe(0);
        document.destroy();
    });
    it('1030750 - should validate generated and unsaved document searches', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const font18: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 18);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        for (let pageIndex: number = 0; pageIndex < 11; pageIndex++) {
            document.addPage();
        }
        const rotationSettings: PdfPageSettings = new PdfPageSettings();
        rotationSettings.size = { width: 595, height: 842 };
        rotationSettings.margins = new PdfMargins(40);
        rotationSettings.rotation = PdfRotationAngle.angle90;
        const rotationPage: PdfPage = document.addPage(rotationSettings);
        rotationPage.graphics.drawString(
            'ImmediateRotationSearchText',
            font18,
            { x: 50, y: 80, width: 360, height: 40 },
            brush
        );
        const drawPage: PdfPage = document.addPage();
        drawPage.graphics.drawString(
            'ImmediateDrawSearchText',
            font18,
            { x: 50, y: 100, width: 360, height: 40 },
            brush
        );
        const newDocumentPage: PdfPage = document.addPage();
        newDocumentPage.graphics.drawString(
            'NewDocumentfindTextSyncSupport',
            font18,
            { x: 60, y: 120, width: 360, height: 40 },
            brush
        );
        const specialPage: PdfPage = document.addPage();
        specialPage.graphics.drawString(
            'Special@#123_PDF!',
            font18,
            { x: 50, y: 140, width: 360, height: 40 },
            brush
        );
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const results: TextSearchResult[] = extractor.findTextSync([
            'ImmediateRotationSearchText',
            'ImmediateDrawSearchText',
            'NewDocumentfindTextSyncSupport',
            '@#123_'
        ]);
        const wholeWordResult: TextSearchResult = extractor.findTextSync(
            'Special@#123_PDF!',
            { wholeWord: true }
        );
        const rotationBounds: Rectangle[] = getPageBounds(results[0], 12);
        const drawBounds: Rectangle[] = getPageBounds(results[1], 13);
        const newDocumentBounds: Rectangle[] = getPageBounds(results[2], 14);
        const partialBounds: Rectangle[] = getPageBounds(results[3], 15);
        const wholeWordBounds: Rectangle[] = getPageBounds(wholeWordResult, 15);
        // Assert
        expect(results.length).toBe(4);
        expect(rotationBounds.length).toBe(1);
        expect(rotationBounds[0].x).toBe(90.00);
        expect(rotationBounds[0].y).toBe(123.25999999999999);
        expect(rotationBounds[0].width).toBe(243.09000000000003);
        expect(rotationBounds[0].height).toBe(18.00);
        expect(drawBounds[0].x).toBe(90.00);
        expect(drawBounds[0].y).toBe(143.26);
        expect(newDocumentBounds[0].x).toBe(100.00);
        expect(newDocumentBounds[0].y).toBe(163.26);
        expect(partialBounds[0].x).toBe(149.022);
        expect(partialBounds[0].width).toBe(68.31000000000003);
        expect(wholeWordBounds[0].x).toBe(90.00);
        expect(wholeWordBounds[0].width).toBe(168.336);
        document.destroy();
    });
    it('1030750 - should normalize bounds when width and height are negative', () => {
        // Arrange
        const extractor: PdfDataExtractor = new PdfDataExtractor(null as unknown as PdfDocument);
        const bounds: Rectangle = {
            x: 100,
            y: 200,
            width: -50,
            height: -30
        };
        // Act
        const result: Rectangle = (extractor as unknown as {
            _normalizeFindTextBounds: (value: Rectangle) => Rectangle;
        })._normalizeFindTextBounds(bounds);
        // Assert
        expect(result.x).toBe(50.00);
        expect(result.y).toBe(170.00);
        expect(result.width).toBe(50.00);
        expect(result.height).toBe(30.00);
    });
});
describe('1030750 - findText async combined coverage', () => {
    const getTotalCount: (result: TextSearchResult) => number =
        (result: TextSearchResult): number => {
            let count: number = 0;
            result.searchResults.forEach(
                (boundsCollection: Rectangle[]): void => {
                    count += boundsCollection.length;
                }
            );
            return count;
        };
    const getFirstBounds: (result: TextSearchResult) => Rectangle[] =
        (result: TextSearchResult): Rectangle[] => {
            let bounds: Rectangle[] = [];
            result.searchResults.forEach(
                (boundsCollection: Rectangle[]): void => {
                    if (bounds.length === 0 && boundsCollection.length > 0) {
                        bounds = boundsCollection;
                    }
                }
            );
            return bounds;
        };
    const getPageBounds: (
        result: TextSearchResult,
        pageNumber: number
    ) => Rectangle[] =
        (
            result: TextSearchResult,
            pageNumber: number
        ): Rectangle[] => {
            const bounds: Rectangle[] | undefined =
                result.searchResults.get(pageNumber);
            expect(bounds).toBeDefined();
            return bounds as Rectangle[];
        };
    it('1030750 - should asynchronously search multiple text values with all options', async () => {
        // Arrange
        const document: PdfDocument = new PdfDocument(pdfSuccinctly);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const extractedSearchTexts: string[] = [];
        const extractedSearchResults: Map<number, Rectangle[]>[] = [];
        // Act
        const results: TextSearchResult[] = await extractor.findText(
            [
                'Succinctly',
                'PDF',
                'document'
            ],
            {
                caseSensitive: false,
                wholeWord: false,
                startPageIndex: 0,
                endPageIndex : document.pageCount - 1
            }
        );
        for (const result of results) {
            const searchText: string = result.searchText;
            const searchResults: Map<number, Rectangle[]> =
                result.searchResults;
            extractedSearchTexts.push(searchText);
            extractedSearchResults.push(searchResults);
        }
        // Assert
        expect(results.length).toBe(3);
        expect(extractedSearchTexts).toEqual([
            'Succinctly',
            'PDF',
            'document'
        ]);
        expect(extractedSearchResults.length).toBe(3);
        expect(extractedSearchResults[0] instanceof Map).toBe(true);
        expect(extractedSearchResults[1] instanceof Map).toBe(true);
        expect(extractedSearchResults[2] instanceof Map).toBe(true);
        expect(getTotalCount(results[0])).toBeGreaterThan(0);
        expect(getTotalCount(results[1])).toBeGreaterThan(0);
        expect(getTotalCount(results[2])).toBeGreaterThan(0);
        document.destroy();
    });
    it('1030750 - should asynchronously validate default, case-sensitive, partial and missing text searches', async () => {
        // Arrange
        const document: PdfDocument = new PdfDocument(pdfSuccinctly);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const defaultResults: TextSearchResult[] =
            await extractor.findText([
                'Succinctly',
                'PDF',
                'pDf',
                'Suc',
                'Header',
                'TextNotAvailableInPdfSuccinctlyDocument',
                ''
            ]);
        const succinctlyResult: TextSearchResult = defaultResults[0];
        const pdfResult: TextSearchResult = defaultResults[1];
        const defaultCaseResult: TextSearchResult = defaultResults[2];
        const defaultPartialResult: TextSearchResult = defaultResults[3];
        const headerResult: TextSearchResult = defaultResults[4];
        const missingResult: TextSearchResult = defaultResults[5];
        const emptyResult: TextSearchResult = defaultResults[6];
        const caseSensitiveResults: TextSearchResult[] =
            await extractor.findText(
                ['PDF', 'pDf'],
                {
                    caseSensitive: true
                }
            );
        const exactCaseResult: TextSearchResult =
            caseSensitiveResults[0];
        const differentCaseResult: TextSearchResult =
            caseSensitiveResults[1];
        const explicitCaseInsensitiveResult: TextSearchResult =
            await extractor.findText(
                'pDf',
                {
                    caseSensitive: false
                }
            );
        const succinctlyBounds: Rectangle[] =
            getFirstBounds(succinctlyResult);
        const pdfPage1Bounds: Rectangle[] =
            getPageBounds(pdfResult, 1);
        const pdfPage2Bounds: Rectangle[] =
            getPageBounds(pdfResult, 2);
        const defaultCaseBounds: Rectangle[] =
            getFirstBounds(defaultCaseResult);
        const explicitCaseInsensitiveBounds: Rectangle[] =
            getFirstBounds(explicitCaseInsensitiveResult);
        const defaultPartialBounds: Rectangle[] =
            getFirstBounds(defaultPartialResult);
        const headerBounds: Rectangle[] =
            getFirstBounds(headerResult);
        const exactCaseBounds: Rectangle[] =
            getPageBounds(exactCaseResult, 1);
        // Assert
        expect(defaultResults.length).toBe(7);
        expect(succinctlyResult.searchText).toBe('Succinctly');
        expect(succinctlyResult.searchResults instanceof Map).toBe(true);
        expect(succinctlyResult.searchResults.size).toBeGreaterThan(0);
        expect(succinctlyResult.searchResults.has(0)).toBe(false);
        expect(succinctlyBounds.length).toBeGreaterThan(0);
        expect(succinctlyBounds[0].x).toBe(254.69);
        expect(succinctlyBounds[0].y).toBe(92.65999999999997);
        expect(succinctlyBounds[0].width).toBe(202.656);
        expect(succinctlyBounds[0].height).toBe(48);
        expect(pdfResult.searchText).toBe('PDF');
        expect(pdfResult.searchResults.has(1)).toBe(true);
        expect(pdfResult.searchResults.has(2)).toBe(true);
        expect(pdfResult.searchResults.size).toBeGreaterThan(1);
        expect(pdfPage1Bounds[0].x).toBe(430.38600000000037);
        expect(pdfPage1Bounds[0].y).toBe(12.11099999999999);
        expect(pdfPage1Bounds[0].width).toBe(24);
        expect(pdfPage1Bounds[0].height).toBe(12);
        expect(pdfPage2Bounds[0].x).toBe(154.58);
        expect(pdfPage2Bounds[0].y).toBe(92.65999999999997);
        expect(pdfPage2Bounds[0].width).toBe(88.03200000000001);
        expect(pdfPage2Bounds[0].height).toBe(48);
        expect(exactCaseResult.searchText).toBe('PDF');
        expect(exactCaseResult.searchResults.size).toBeGreaterThan(0);
        expect(exactCaseBounds[0].x).toBe(430.38600000000037);
        expect(exactCaseBounds[0].width).toBe(24);
        expect(differentCaseResult.searchText).toBe('pDf');
        expect(differentCaseResult.searchResults.size).toBe(0);
        expect(getTotalCount(defaultCaseResult)).toBe(
            getTotalCount(explicitCaseInsensitiveResult)
        );
        expect(defaultCaseBounds[0].x).toBe(430.38600000000037);
        expect(explicitCaseInsensitiveBounds[0].x)
            .toBe(430.38600000000037);
        expect(defaultPartialResult.searchText).toBe('Suc');
        expect(defaultPartialResult.searchResults.size)
            .toBeGreaterThan(0);
        expect(defaultPartialBounds[0].x).toBe(254.69);
        expect(defaultPartialBounds[0].y).toBe(92.65999999999997);
        expect(defaultPartialBounds[0].width).toBe(72);
        expect(defaultPartialBounds[0].height).toBe(48);
        expect(headerResult.searchText).toBe('Header');
        expect(headerBounds[0].x).toBe(104.42);
        expect(headerBounds[0].y).toBe(233.77999999999994);
        expect(headerBounds[0].width).toBe(36.07871999999999);
        expect(headerBounds[0].height).toBe(11.039999999999992);
        expect(missingResult.searchResults.size).toBe(0);
        expect(emptyResult.searchText).toBe('');
        expect(emptyResult.searchResults.size).toBe(0);
        document.destroy();
    });
    it('1030750 - should asynchronously validate whole-word and combined option searches', async () => {
        // Arrange
        const document: PdfDocument = new PdfDocument(pdfSuccinctly);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        // Act
        const wholeWordResults: TextSearchResult[] =
            await extractor.findText(
                ['PDF', 'Suc'],
                {
                    wholeWord: true
                }
            );
        const wholeWordResult: TextSearchResult =
            wholeWordResults[0];
        const unmatchedWholeWordResult: TextSearchResult =
            wholeWordResults[1];
        const combinedResults: TextSearchResult[] =
            await extractor.findText(
                ['PDF', 'pDf'],
                {
                    caseSensitive: true,
                    wholeWord: true
                }
            );
        const combinedMatchedResult: TextSearchResult =
            combinedResults[0];
        const combinedUnmatchedResult: TextSearchResult =
            combinedResults[1];
        const wholeWordBounds: Rectangle[] =
            getPageBounds(wholeWordResult, 1);
        const combinedBounds: Rectangle[] =
            getPageBounds(combinedMatchedResult, 1);
        // Assert
        expect(wholeWordResults.length).toBe(2);
        expect(wholeWordResult.searchText).toBe('PDF');
        expect(wholeWordResult.searchResults.size).toBeGreaterThan(0);
        expect(wholeWordBounds[0].x).toBe(430.38600000000037);
        expect(wholeWordBounds[0].y).toBe(12.11099999999999);
        expect(wholeWordBounds[0].width).toBe(24);
        expect(wholeWordBounds[0].height).toBe(12);
        expect(unmatchedWholeWordResult.searchText).toBe('Suc');
        expect(unmatchedWholeWordResult.searchResults.size).toBe(0);
        expect(combinedMatchedResult.searchResults.size)
            .toBeGreaterThan(0);
        expect(combinedBounds[0].x).toBe(430.38600000000037);
        expect(combinedBounds[0].width).toBe(24);
        expect(combinedUnmatchedResult.searchResults.size).toBe(0);
        document.destroy();
    });
    it('1030750 - should asynchronously validate generated and unsaved document searches', async () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const font18: PdfStandardFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 18);
        const brush: PdfBrush =
            new PdfBrush({ r: 0, g: 0, b: 0 });
        for (
            let pageIndex: number = 0;
            pageIndex < 11;
            pageIndex++
        ) {
            document.addPage();
        }
        const rotationSettings: PdfPageSettings =
            new PdfPageSettings();
        rotationSettings.size = {
            width: 595,
            height: 842
        };
        rotationSettings.margins = new PdfMargins(40);
        rotationSettings.rotation = PdfRotationAngle.angle90;
        const rotationPage: PdfPage =
            document.addPage(rotationSettings);
        rotationPage.graphics.drawString(
            'ImmediateRotationSearchText',
            font18,
            {
                x: 50,
                y: 80,
                width: 360,
                height: 40
            },
            brush
        );
        const drawPage: PdfPage = document.addPage();
        drawPage.graphics.drawString(
            'ImmediateDrawSearchText',
            font18,
            {
                x: 50,
                y: 100,
                width: 360,
                height: 40
            },
            brush
        );
        const newDocumentPage: PdfPage = document.addPage();
        newDocumentPage.graphics.drawString(
            'NewDocumentfindTextSupport',
            font18,
            {
                x: 60,
                y: 120,
                width: 360,
                height: 40
            },
            brush
        );
        const specialPage: PdfPage = document.addPage();
        specialPage.graphics.drawString(
            'Special@#123_PDF!',
            font18,
            {
                x: 50,
                y: 140,
                width: 360,
                height: 40
            },
            brush
        );
        const extractor: PdfDataExtractor =
            new PdfDataExtractor(document);
        // Act
        const results: TextSearchResult[] =
            await extractor.findText([
                'ImmediateRotationSearchText',
                'ImmediateDrawSearchText',
                'NewDocumentfindTextSupport',
                '@#123_'
            ]);
        const wholeWordResult: TextSearchResult =
            await extractor.findText(
                'Special@#123_PDF!',
                {
                    wholeWord: true
                }
            );
        const rotationBounds: Rectangle[] =
            getPageBounds(results[0], 12);
        const drawBounds: Rectangle[] =
            getPageBounds(results[1], 13);
        const newDocumentBounds: Rectangle[] =
            getPageBounds(results[2], 14);
        const partialBounds: Rectangle[] =
            getPageBounds(results[3], 15);
        const wholeWordBounds: Rectangle[] =
            getPageBounds(wholeWordResult, 15);
        // Assert
        expect(results.length).toBe(4);
        expect(rotationBounds.length).toBe(1);
        expect(rotationBounds[0].x).toBe(90.00);
        expect(rotationBounds[0].y).toBe(123.25999999999999);
        expect(rotationBounds[0].width).toBe(243.09000000000003);
        expect(rotationBounds[0].height).toBe(18.00);
        expect(drawBounds[0].x).toBe(90.00);
        expect(drawBounds[0].y).toBe(143.26);
        expect(newDocumentBounds[0].x).toBe(100.00);
        expect(newDocumentBounds[0].y).toBe(163.26);
        expect(partialBounds[0].x).toBe(149.022);
        expect(partialBounds[0].width).toBe(68.31000000000003);
        expect(wholeWordBounds[0].x).toBe(90.00);
        expect(wholeWordBounds[0].width).toBe(168.336);
        document.destroy();
    });
});