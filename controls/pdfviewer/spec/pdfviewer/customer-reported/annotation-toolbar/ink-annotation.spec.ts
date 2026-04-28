import { createElement } from '@syncfusion/ej2-base';
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from '../../../../src/index';
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, mouseClickEvent, openAnnotationToolbar } from '../../utils.spec';
import { HELLO_PDF_B64 } from '../../Data/pdf-data.spec';

// ─── Ink and Text Markup Annotation Toolbar Interaction Tests ──────────────
describe('PDF_Viewer_Annotation_InkTextMarkup', () => {
    let pdfviewer_ink_textmarkup: PdfViewer | null = null;
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    // ── Load PDF once; share across all tests ──────────────────────────────────
    beforeAll((done: DoneFn) => {
        const element = createElement('div', { id: 'pdfviewer_ink_textmarkup' });
        document.body.appendChild(element);
        pdfviewer_ink_textmarkup = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: 'data:application/pdf;base64,' + HELLO_PDF_B64
        });
        pdfviewer_ink_textmarkup.documentLoad = () => done();
        pdfviewer_ink_textmarkup.appendTo('#pdfviewer_ink_textmarkup');
    });

    // ── Cleanup ──────────────────────────────────────────────────────────────
    afterAll(() => {
        if (pdfviewer_ink_textmarkup) {
            pdfviewer_ink_textmarkup.destroy();
            const el = document.getElementById('pdfviewer_ink_textmarkup');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_ink_textmarkup = null;
        }
    });

    // ── Test Case 1: Direct Bug Replication ──────────────────────────────────
    it('1021689 - Ink annotation persists when switching to Text Markup without deselecting', async () => {
        const viewer = pdfviewer_ink_textmarkup!;
        const target = document.querySelector('#pdfviewer_ink_textmarkup_textLayer_0');
        const rect = target.getBoundingClientRect();
        const initialCount = viewer.annotationCollection.length;

        // Act 1: Open annotation toolbar and click Ink tool
        openAnnotationToolbar('pdfviewer_ink_textmarkup');
        const inkBtn = document.querySelector('#pdfviewer_ink_textmarkup_annotation_ink') as HTMLElement;
        expect(inkBtn).not.toBeNull();
        mouseClickEvent(inkBtn);

        const sx = Math.round(rect.left + 50);
        const sy = Math.round(rect.top + 80);
        const ex = Math.round(rect.left + 200);
        const ey = Math.round(rect.top + 140);

        mouseDownEvent(target, sx, sy);
        mouseMoveEvent(target, Math.round(rect.left + 120), Math.round(rect.top + 100));
        mouseMoveEvent(target, Math.round(rect.left + 160), Math.round(rect.top + 120));
        mouseUpEvent(target, ex, ey);

        // Act 2: Click Highlight tool without deselecting Ink
        const highlightBtn = document.querySelector('#pdfviewer_ink_textmarkup_highlight') as HTMLElement;
        expect(highlightBtn).not.toBeNull();

        const startingElement = document.getElementById('pdfviewer_ink_textmarkup_text_0_0');
        const endingElement = document.getElementById('pdfviewer_ink_textmarkup_text_0_4');
        const range = document.createRange();

        // Select the contents of the starting element
        range.selectNodeContents(startingElement);

        // Set the start position at the beginning of the starting element
        range.setStart(startingElement, 0);

        // Set the end position at the end of the ending element
        range.setEnd(endingElement, endingElement.childNodes.length);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        highlightBtn.click();
        expect(viewer.annotationCollection.length).toBe(initialCount + 2);
    });
});
