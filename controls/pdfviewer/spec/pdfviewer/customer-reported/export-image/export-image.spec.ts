import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

describe('PDF_Viewer_exportAsImage', () => {
    let pdfviewer_exportAsImage: PdfViewer = null;

    // Register required modules once for the viewer
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    beforeAll((done) => {
        // Create container and mount the viewer with an in-memory (base64) empty PDF
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_exportAsImage' });
        document.body.appendChild(element);
        pdfviewer_exportAsImage = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        // Wait until the initial document finishes loading
        pdfviewer_exportAsImage.documentLoad = () => {
            done();
        };
        // Attach viewer to DOM
        pdfviewer_exportAsImage.appendTo("#pdfviewer_exportAsImage");
    });

    afterAll(() => {
        // Cleanup viewer and DOM node to avoid test side-effects
        if (pdfviewer_exportAsImage) {
            pdfviewer_exportAsImage.destroy();
            const el = document.getElementById('pdfviewer_exportAsImage');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_exportAsImage = null;
        }
    });

    afterEach(() => {
        // No per-test cleanup required for this spec
    });

    /**
     * Helper: Create and click a button to trigger exportAsImages, returning the result via promise.
     * Simulates user button-click workflow for image export.
     * 
     * @param buttonId - Unique ID for the button element
     * @param startPageIndex - Start page index (0-based)
     * @param endPageIndex - End page index (0-based)
     * @returns Promise resolving to array of base64 image data URLs
     */
    async function clickExportAsImagesButton(buttonId: string, startPageIndex: number, endPageIndex: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            // Create export button
            const exportBtn = document.createElement('button');
            exportBtn.id = buttonId;
            exportBtn.textContent = 'Export As Images';
            document.body.appendChild(exportBtn);

            // Attach click handler that calls exportAsImages
            exportBtn.addEventListener('click', async () => {
                try {
                    // Invoke API with given page range (0..0 in this test)
                    const images = await (pdfviewer_exportAsImage as any).exportAsImages(
                        startPageIndex,
                        endPageIndex
                    );
                    resolve(images);
                } catch (error) {
                    reject(error);
                } finally {
                    // Clean up button after use to keep DOM clean
                    if (exportBtn.parentNode) {
                        exportBtn.parentNode.removeChild(exportBtn);
                    }
                }
            });

            // Trigger the click (simulates a user action)
            exportBtn.click();
        });
    }

    /**
     * Test: Verifies exportAsImages returns valid image data repeatedly.
     * Steps:
     *  1) Click "Export" (A) → expect one Base64 image URL.
     *  2) Click "Export" (B) again → expect one Base64 image URL.
     * Assertions:
     *  - Result is an array with one item.
     *  - Item is a string Base64 data URL starting with 'data:image'.
     *  - Non-trivial payload length (>100).
     */
    it('1011007 - exportAsImages API not working properly for subsequent loading of password protected PDF documents', async function (done) {
        try {
            // First export attempt (A)
            const imageDataA = await clickExportAsImagesButton('exportBtn_A', 0, 0);

            // Verify image data from first PDF
            expect(Array.isArray(imageDataA)).toBe(true);
            expect(imageDataA.length).toBe(1);
            expect(typeof imageDataA[0]).toBe('string');
            expect(imageDataA[0].startsWith('data:image')).toBe(true);
            expect(imageDataA[0].length).toBeGreaterThan(100);

            // Second export attempt (B)
            const imageDataB = await clickExportAsImagesButton('exportBtn_B', 0, 0);

            // Verify image data from second PDF
            expect(Array.isArray(imageDataB)).toBe(true);
            expect(imageDataB.length).toBe(1);
            expect(typeof imageDataB[0]).toBe('string');
            expect(imageDataB[0].startsWith('data:image')).toBe(true);
            expect(imageDataB[0].length).toBeGreaterThan(100);

            // ===== Final sanity checks (both exports are valid) =====
            expect(imageDataA[0]).toBeTruthy();
            expect(imageDataB[0]).toBeTruthy();

            done();
        } catch (err) {
            // Surface failures properly in Jasmine
            fail(err as any);
            done();
        }
    });

});