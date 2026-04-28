import { createElement } from '@syncfusion/ej2-base';
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer, DynamicStampItem } from '../../../../src/index';
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from '../../utils.spec';
import { EMPTY_PDF_B64 } from '../../Data/pdf-data.spec';

describe('PDF_Viewer_Stamp_Opacity_One', () => {
    let pdfviewer_stamp: PdfViewer | null = null;

    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView,
        BookmarkView, TextSelection, TextSearch, Print, Annotation,
        FormFields, FormDesigner, PageOrganizer
    );

    beforeAll((done) => {
        const element = createElement('div', { id: 'pdfviewer_stamp' });
        document.body.appendChild(element);
        pdfviewer_stamp = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_stamp.documentLoad = () => done();
        pdfviewer_stamp.appendTo('#pdfviewer_stamp');
    });

    afterAll(() => {
        if (pdfviewer_stamp) {
            pdfviewer_stamp.destroy();
            const el = document.getElementById('pdfviewer_stamp');
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
            pdfviewer_stamp = null;
        }
    });

    it('1009739-Stamp annotation invisible when opacity=0', async () => {
        const target = getTarget('#pdfviewer_stamp_textLayer_0');
        pdfviewer_stamp.stampSettings.opacity = 0;
        pdfviewer_stamp.annotation.setAnnotationMode("Stamp", DynamicStampItem.Approved)
        const rect = target.getBoundingClientRect();
        const cx = Math.floor(rect.left);
        const cy = Math.floor(rect.top);
        await waitFor(() => true);
        mouseMoveEvent(target, cx, cy);
        mouseMoveEvent(target, cx + 2, cy + 2);
        mouseDownEvent(target, cx + 2, cy + 2);
        mouseUpEvent(target, cx + 2, cy + 2);
        await waitFor(() => pdfviewer_stamp.annotationCollection && pdfviewer_stamp.annotationCollection.length > 0);
        const dynamicStampAnnotations = pdfviewer_stamp.annotationCollection[pdfviewer_stamp.annotationCollection.length - 1];
        expect(dynamicStampAnnotations).toBeDefined();
        expect(dynamicStampAnnotations.opacity).toBe(0);
    });
});

