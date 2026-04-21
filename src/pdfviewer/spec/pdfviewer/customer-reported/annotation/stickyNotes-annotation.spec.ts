import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64, OLD_PDFVIEWER_JSON } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_StickyNotes', () => {
    let pdfviewer_sticky: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_sticky' });
        document.body.appendChild(element);
        pdfviewer_sticky = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_sticky.documentLoad = () => {
            done();
        }
        pdfviewer_sticky.appendTo("#pdfviewer_sticky");
    });

    afterAll(() => {
        if (pdfviewer_sticky) {
            pdfviewer_sticky.destroy();
            const el = document.getElementById('pdfviewer_sticky');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_sticky = null;
        }
    });

    afterEach(() => {
    });

    it('1008687 - Sticky notes annotation with comment lock', async function (done) {
        var target = document.querySelector('#pdfviewer_sticky_textLayer_0') || document.getElementById('pdfviewer_sticky');
        pdfviewer_sticky.annotation.setAnnotationMode('StickyNotes');
        var rect = target.getBoundingClientRect();
        var x = Math.round(rect.left + 100);
        var y = Math.round(rect.top + 100);
        mouseDownEvent(target, x, y);
        mouseUpEvent(target, x, y);
        await waitFor(() => pdfviewer_sticky.annotationCollection && pdfviewer_sticky.annotationCollection.length > 0);
        await waitFor(() => !!document.querySelector('#pdfviewer_sticky_commentdiv_1_0'));
        const btn = document.createElement('button');
        btn.id = 'test-view-button';
        btn.textContent = 'View';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            var collection = pdfviewer_sticky.annotationCollection[0];
            collection.isCommentLock = true;
            pdfviewer_sticky.annotation.editAnnotation(collection);
        });
        btn.click();
        const annotationBtn = document.querySelector(`#pdfviewer_sticky_annotation`) as HTMLElement;
        annotationBtn.click();

        const commentPanel = document.querySelector(`#pdfviewer_sticky_annotation_commentPanel`) as HTMLElement;
        commentPanel.click();

        var annot = document.querySelector(`#pdfviewer_sticky_commentdiv_1_0`) as HTMLElement;
        annot.click();

        const nodes = document.querySelectorAll('#pdfviewer_sticky_newcommentdiv_1_0');

        const visibleNodes = Array.from(nodes).filter(el => {
            return getComputedStyle(el).display !== 'none';
        });
        expect(visibleNodes.length).toEqual(1);
        done();
    });

    it('1009022 - Imports annotations with older JSON format for sticky notes annotation', async function (done) {
        const jsonObj = OLD_PDFVIEWER_JSON;

        let imported = false;
        if (typeof pdfviewer_sticky.importAnnotation === 'function') {
            pdfviewer_sticky.importAnnotation(jsonObj, AnnotationDataFormat.Json);
            imported = true;
        }
        if (!imported) {
            fail('No import API available for object JSON');
            done();
            return;
        }
        waitFor(() => !!pdfviewer_sticky.annotationCollection && pdfviewer_sticky.annotationCollection.length > 0);
        expect(pdfviewer_sticky.annotationCollection.length).toBeGreaterThan(0);
        const user1Annotations = pdfviewer_sticky.annotationCollection.filter(
            ann => ann.author === 'user 1'
        );
        expect(user1Annotations.length).toEqual(1);
        done();
    });
});