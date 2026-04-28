import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_Ink', () => {
    let pdfviewer_ink: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_ink' });
        document.body.appendChild(element);
        pdfviewer_ink = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_ink.documentLoad = () => {
            done();
        }
        pdfviewer_ink.appendTo("#pdfviewer_ink");
    });

    afterAll(() => {
        if (pdfviewer_ink) {
            pdfviewer_ink.destroy();
            const el = document.getElementById('pdfviewer_ink');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_ink = null;
        }
    });

    afterEach(() => {
    });

    it("1007499-Add ink annotation without toolbar and switch modes without errors", (done) => {
        let originalToolbar: any;
        try {
            // temporarily remove toolbarModule for this test only
            originalToolbar = (pdfviewer_ink as any).toolbarModule;
            (pdfviewer_ink as any).toolbarModule = undefined;
            expect(pdfviewer_ink.toolbarModule).toBeUndefined();

            // spy on console.error to detect script errors
            const consoleErrorSpy = spyOn(console, 'error');

            // prefer text layer target, fallback to viewer container
            const target = (document.querySelector('#pdfviewer_ink_textLayer_0') as HTMLElement) || (document.getElementById('pdfviewer') as HTMLElement);
            if (!target) { throw new Error('Could not find target element to dispatch mouse events.'); }

            // ensure annotation API available
            if (!pdfviewer_ink || !pdfviewer_ink.annotation || typeof pdfviewer_ink.annotation.setAnnotationMode !== 'function') {
                throw new Error('pdfviewer.annotation.setAnnotationMode not available. Ensure viewer and annotation module are initialized.');
            }

            // set ink annotation mode on the annotation API (ensures ink drawing behavior)
            pdfviewer_ink.annotation.setAnnotationMode('Ink');

            // Simulate adding an ink annotation by dispatching mouse events (more moves for visible stroke)
            const rect = target.getBoundingClientRect();
            const startX = Math.round(rect.left + 60);
            const startY = Math.round(rect.top + 60);
            const mid1X = Math.round(rect.left + 120);
            const mid1Y = Math.round(rect.top + 80);
            const mid2X = Math.round(rect.left + 160);
            const mid2Y = Math.round(rect.top + 100);
            const endX = Math.round(rect.left + 200);
            const endY = Math.round(rect.top + 120);

            mouseDownEvent(target, startX, startY);
            mouseMoveEvent(target, mid1X, mid1Y);
            mouseMoveEvent(target, mid2X, mid2Y);
            mouseMoveEvent(target, endX, endY);
            mouseUpEvent(target, endX, endY);
            mouseDownEvent(target, endX, endY);

            // Switch back to text selection and disable designer mode
            pdfviewer_ink.interactionMode = 'TextSelection';
            pdfviewer_ink.designerMode = false;

            // Allow handlers to process then assert
            try {
                expect(consoleErrorSpy).not.toHaveBeenCalled();
            } finally {
                // restore toolbarModule for other tests
                (pdfviewer_ink as any).toolbarModule = originalToolbar;
            }
            done();
        } catch (e) {
            if (originalToolbar !== undefined) {
                (pdfviewer_ink as any).toolbarModule = originalToolbar;
            }
            done.fail(e);
        }
    });
    it('1009739-ink annotation invisible when opacity = 0', async () => {
        const target = getTarget('#pdfviewer_ink_textLayer_0');
        const rect = target.getBoundingClientRect();
        pdfviewer_ink.annotation.setAnnotationMode('Ink');
        pdfviewer_ink.inkAnnotationSettings.opacity = 0;
        const startX1 = rect.left + 60, startY1 = rect.top + 60;
        const endX1 = rect.left + 200, endY1 = rect.top + 120;
        mouseDownEvent(target, startX1, startY1);
        mouseMoveEvent(target, rect.left + 120, rect.top + 80);
        mouseMoveEvent(target, rect.left + 160, rect.top + 100);
        mouseUpEvent(target, endX1, endY1);
        pdfviewer_ink.annotation.setAnnotationMode('None');
        await waitFor(() => pdfviewer_ink.annotationCollection && pdfviewer_ink.annotationCollection.length > 0)
        const annotations = pdfviewer_ink.annotationCollection[pdfviewer_ink.annotationCollection.length - 1];
        expect(annotations.opacity).toBe(0);
    });
});