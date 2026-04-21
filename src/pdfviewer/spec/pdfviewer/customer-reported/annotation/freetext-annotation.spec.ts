import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer,
    AnnotationDataFormat
} from "../../../../src/index";
import { assertGeometryChanged, assertGeometryMatches, dblClickEvent, deleteAllAnnotationsHelper, exportAnnotationsHelper, focusOn, getTarget, importAnnotationsHelper, mouseDownEvent, mouseMoveEvent, mouseUpEvent, threePointCalibrate, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

describe('PDF_Viewer_Freetext', () => {
    let pdfviewer_freeText: PdfViewer = null;

    // Inject required PdfViewer modules
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    // Setup PdfViewer instance before running tests
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_freeText' });
        document.body.appendChild(element);
        pdfviewer_freeText = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_freeText.documentLoad = () => done();
        pdfviewer_freeText.appendTo('#pdfviewer_freeText');
    });

    // Cleanup PdfViewer instance after all tests complete
    afterAll(() => {
        if (pdfviewer_freeText) {
            pdfviewer_freeText.destroy();
            const el = document.getElementById('pdfviewer_freeText');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_freeText = null;
        }
    });

    it('1015701- Free text bounds are incorrect during export after updating the bounds using the editAnnotation method and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_freeText_textLayer_0');
            const rect = target.getBoundingClientRect();
            pdfviewer_freeText.annotation.setAnnotationMode('FreeText');
            const viewerContainer =
                document.getElementById('pdfviewer_freeText_viewerContainer') as HTMLElement;
            await waitFor(() => !!document.getElementById('pdfviewer_freeText_viewerContainer'));
            const annotationAdded = new Promise<void>((resolve) => {
                pdfviewer_freeText!.annotationAdd = () => resolve();
            });
            const x = Math.round(rect.left + rect.width / 2);
            const y = Math.round(rect.top + rect.height / 2);
            mouseMoveEvent(target, x, y);
            mouseDownEvent(target, x, y);
            mouseUpEvent(target, x, y);
            focusOn(viewerContainer);
            // Wait for annotationAdd event
            await annotationAdded;
            await waitFor(() => pdfviewer_freeText.annotationCollection && pdfviewer_freeText.annotationCollection.length > 0);

            const annotation = pdfviewer_freeText.annotationCollection[pdfviewer_freeText.annotationCollection.length - 1] as any;

            // Capture initial geometry
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Update bounds using editAnnotation API
            annotation.bounds.x += 100;
            annotation.bounds.y += 100;
            annotation.bounds.width += 50;
            pdfviewer_freeText.annotation.editAnnotation(annotation);

            await waitFor(() => pdfviewer_freeText.annotationCollection && pdfviewer_freeText.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_freeText.annotationCollection[pdfviewer_freeText.annotationCollection.length - 1] as any;

            // Validate geometry changes
            assertGeometryChanged(initialBounds, resizedAnnotation.bounds, 'bounds');

            const exportedData = await exportAnnotationsHelper(pdfviewer_freeText);

            // Delete and re-import annotations
            deleteAllAnnotationsHelper(pdfviewer_freeText);
            await waitFor(() => pdfviewer_freeText.annotationCollection.length === 0);

            importAnnotationsHelper(pdfviewer_freeText, exportedData);
            await waitFor(() => pdfviewer_freeText.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_freeText.annotationCollection[0] as any;

            // Validate imported geometry matches resized geometry
            expect(Math.round(importedAnnotation.bounds.x)).toBe(Math.round(resizedAnnotation.bounds.x));
            expect(Math.round(importedAnnotation.bounds.y)).toBe(Math.round(resizedAnnotation.bounds.y));
            expect(Math.round(importedAnnotation.bounds.width)).toBe(Math.round(resizedAnnotation.bounds.width));
            expect(Math.round(importedAnnotation.bounds.height)).toBe(Math.round(resizedAnnotation.bounds.height));
            expect(Math.round(importedAnnotation.bounds.left)).toBe(Math.round(resizedAnnotation.bounds.left));
            expect(Math.round(importedAnnotation.bounds.top)).toBe(Math.round(resizedAnnotation.bounds.top));

            deleteAllAnnotationsHelper(pdfviewer_freeText);
        } catch (e) {
            fail(e as Error);
        }
    });


});