import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_TextBox', () => {
    let pdfviewer_textBox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_textBox' });
        document.body.appendChild(element);
        pdfviewer_textBox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_textBox.documentLoad = () => {
            done();
        }
        pdfviewer_textBox.appendTo("#pdfviewer_textBox");
    });

    afterAll(() => {
        if (pdfviewer_textBox) {
            pdfviewer_textBox.destroy();
            const el = document.getElementById('pdfviewer_textBox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_textBox = null;
        }
    });

    afterEach(() => {
    });

    it("1007499-Add textBox field without toolbar and save without errors", (done) => {
        let originalToolbar: any;
        try {
            // temporarily remove toolbarModule for this test only
            originalToolbar = (pdfviewer_textBox as any).toolbarModule;
            (pdfviewer_textBox as any).toolbarModule = undefined;
            expect(pdfviewer_textBox.toolbarModule).toBeUndefined();

            // spy on console.error to detect script errors
            const consoleErrorSpy = spyOn(console, 'error');

            // prefer text layer target, fallback to viewer container
            const target = (document.querySelector('#pdfviewer_textBox_textLayer_0') as HTMLElement) || (document.getElementById('viewerWithoutToolbar') as HTMLElement);
            if (!target) { throw new Error('Could not find target element for dispatching mouse events.'); }

            // set textbox form field mode
            if (!pdfviewer_textBox.formDesignerModule || typeof pdfviewer_textBox.formDesignerModule.setFormFieldMode !== 'function') {
                throw new Error('formDesignerModule.setFormFieldMode not available on viewer instance.');
            }
            pdfviewer_textBox.formDesignerModule.setFormFieldMode('Textbox');

            // Simulate adding a textbox field by dispatching mouse events
            const rect = target.getBoundingClientRect();
            const startX = Math.round(rect.left + 50);
            const startY = Math.round(rect.top + 50);
            const midX = Math.round(rect.left + 150);
            const midY = Math.round(rect.top + 100);
            const endX = Math.round(rect.left + 200);
            const endY = Math.round(rect.top + 120);

            mouseDownEvent(target, startX, startY);
            mouseMoveEvent(target, midX, midY);
            mouseMoveEvent(target, endX, endY);
            mouseUpEvent(target, endX, endY);

            // Exit designer mode and trigger save/download path
            pdfviewer_textBox.designerMode = false;
            if (typeof pdfviewer_textBox.download === 'function') {
                pdfviewer_textBox.download();
            }
            const collectionLen = Array.isArray(pdfviewer_textBox.formFieldCollection) ? pdfviewer_textBox.formFieldCollection.length : 0;
            try {
                expect(collectionLen).toBe(1);
                expect(consoleErrorSpy).not.toHaveBeenCalled();
            } finally {
                // restore toolbarModule for other tests
                (pdfviewer_textBox as any).toolbarModule = originalToolbar;
            }
            done();
        } catch (e) {
            if (originalToolbar !== undefined) {
                (pdfviewer_textBox as any).toolbarModule = originalToolbar;
            }
            done.fail(e);
        }
    });
});