import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { exportAnnotationsHelper, getTarget, importAnnotationsHelper, mouseDownEvent, mouseMoveEvent, mouseUpEvent, threePointCalibrate, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_Calibrate_Annotation', () => {
    let pdfviewer_calibrate: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_calibrate' });
        document.body.appendChild(element);
        pdfviewer_calibrate = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_calibrate.documentLoad = () => {
            done();
        }
        pdfviewer_calibrate.enableShapeLabel = true;
        pdfviewer_calibrate.appendTo("#pdfviewer_calibrate");
    });

    afterAll(() => {
        if (pdfviewer_calibrate) {
            pdfviewer_calibrate.destroy();
            const el = document.getElementById('pdfviewer_calibrate');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_calibrate = null;
        }
    });

    afterEach(() => {
    });

    it('1021100 - Area annotation with label', async (done) => {
        const target = getTarget('#pdfviewer_calibrate_textLayer_0');
        pdfviewer_calibrate.annotation.setAnnotationMode('Area');
        threePointCalibrate(target);
        //export and import
        const exportedData = await exportAnnotationsHelper(pdfviewer_calibrate);

        //Delete all annotations
        pdfviewer_calibrate.deleteAnnotations();
        await waitFor(() => pdfviewer_calibrate.annotationCollection.length === 0);
        expect(pdfviewer_calibrate.annotationCollection.length).toBe(0, 'All annotations should be deleted');

        //Import and validate
        importAnnotationsHelper(pdfviewer_calibrate, exportedData);
        expect(pdfviewer_calibrate.annotationCollection[0].labelContent).not.toBe(null);
        pdfviewer_calibrate.deleteAnnotations();
        done();
    })
    it('1021100 - Distance annotation with label', async (done) => {
        //distance
         const target = getTarget('#pdfviewer_calibrate_textLayer_0');
        const rect = target.getBoundingClientRect();
        pdfviewer_calibrate.annotation.setAnnotationMode('Distance');
        const sx = Math.round(rect.left + 50);
        const sy = Math.round(rect.top + 80);
        const ex = Math.round(rect.left + 200);
        const ey = Math.round(rect.top + 80);
        mouseMoveEvent(target, sx, sy);
        mouseDownEvent(target, sx, sy);
        mouseMoveEvent(target, ex, ey);
        mouseUpEvent(target, ex, ey);
        mouseUpEvent(target, ex, ey);
        console.log(pdfviewer_calibrate.annotationCollection[0]);
        //export and import
        const exportedData = await exportAnnotationsHelper(pdfviewer_calibrate);

        //Delete all annotations
        pdfviewer_calibrate.deleteAnnotations();
        await waitFor(() => pdfviewer_calibrate.annotationCollection.length === 0);
        expect(pdfviewer_calibrate.annotationCollection.length).toBe(0, 'All annotations should be deleted');

        //Import and validate
        importAnnotationsHelper(pdfviewer_calibrate, exportedData);
        expect(pdfviewer_calibrate.annotationCollection[0].labelContent).not.toBe(null);
        pdfviewer_calibrate.deleteAnnotations();
        done();
    })
    it('1021100 - Volume annotation with label', async (done) => {
        const target = getTarget('#pdfviewer_calibrate_textLayer_0');
        pdfviewer_calibrate.annotation.setAnnotationMode('Volume');
        const rect = target.getBoundingClientRect();
        const aX = Math.round(rect.left + 100);
        const aY = Math.round(rect.top + 50);
        const bX = Math.round(rect.left + 200);
        const bY = Math.round(rect.top + 50);
        const cX = Math.round(rect.left + 200);
        const cY = Math.round(rect.top + 150);
        const dX = Math.round(rect.left + 100);
        const dY = Math.round(rect.top + 150);

        // Draw AB
        mouseMoveEvent(target, aX, aY);
        mouseDownEvent(target, aX, aY);
        mouseMoveEvent(target, bX, bY);
        mouseUpEvent(target, bX, bY);

        // Draw BC
        mouseMoveEvent(target, bX, bY);
        mouseDownEvent(target, bX, bY);
        mouseMoveEvent(target, cX, cY);
        mouseUpEvent(target, cX, cY);

        // Draw CD
        mouseMoveEvent(target, cX, cY);
        mouseDownEvent(target, cX, cY);
        mouseMoveEvent(target, dX, dY);
        mouseUpEvent(target, dX, dY);

        // Draw DA (closing quadrilateral)
        mouseMoveEvent(target, dX, dY);
        mouseDownEvent(target, dX, dY);
        mouseMoveEvent(target, aX, aY);
        mouseUpEvent(target, aX, aY);
        console.log(pdfviewer_calibrate.annotationCollection[0]);
        //export and import
        const exportedData = await exportAnnotationsHelper(pdfviewer_calibrate);

        //Delete all annotations
        pdfviewer_calibrate.deleteAnnotations();
        await waitFor(() => pdfviewer_calibrate.annotationCollection.length === 0);
        expect(pdfviewer_calibrate.annotationCollection.length).toBe(0, 'All annotations should be deleted');

        //Import and validate
        importAnnotationsHelper(pdfviewer_calibrate, exportedData);
        expect(pdfviewer_calibrate.annotationCollection[0].labelContent).not.toBe(null);
        pdfviewer_calibrate.deleteAnnotations();
        done();
    })
    it('1021100 - Perimeter annotation with label', async (done) => {
        const target = getTarget('#pdfviewer_calibrate_textLayer_0');
        pdfviewer_calibrate.annotation.setAnnotationMode('Perimeter');
        threePointCalibrate(target);
        //export and import
        const exportedData = await exportAnnotationsHelper(pdfviewer_calibrate);

        //Delete all annotations
        pdfviewer_calibrate.deleteAnnotations();
        await waitFor(() => pdfviewer_calibrate.annotationCollection.length === 0);
        expect(pdfviewer_calibrate.annotationCollection.length).toBe(0, 'All annotations should be deleted');

        //Import and validate
        importAnnotationsHelper(pdfviewer_calibrate, exportedData);
        expect(pdfviewer_calibrate.annotationCollection[0].labelContent).not.toBe(null);
        pdfviewer_calibrate.deleteAnnotations();
        done();
    })
    it('1021100 - Radius annotation with label', async (done) => {
         const target = getTarget('#pdfviewer_calibrate_textLayer_0');
         const rect = target.getBoundingClientRect();
         const steps = 10;
        pdfviewer_calibrate.annotation.setAnnotationMode('Radius');
         const sx = Math.round(rect.left + 260);
        const sy = Math.round(rect.top + 80);
        const ex = Math.round(rect.left + 360);
        const ey = Math.round(rect.top + 140);
        mouseMoveEvent(target, sx, sy);
        mouseDownEvent(target, sx, sy);
        for (let i = 10; i <= steps; i++) {
          const t = i / steps;
          const x = Math.round(sx + (ex - sx) * t);
          const y = Math.round(sy + (ey - sy) * t);
          mouseMoveEvent(target, x, y);
        }
        mouseUpEvent(target, ex, ey);
        //export and import
        const exportedData = await exportAnnotationsHelper(pdfviewer_calibrate);

        //Delete all annotations
        pdfviewer_calibrate.deleteAnnotations();
        await waitFor(() => pdfviewer_calibrate.annotationCollection.length === 0);
        expect(pdfviewer_calibrate.annotationCollection.length).toBe(0, 'All annotations should be deleted');

        //Import and validate
        importAnnotationsHelper(pdfviewer_calibrate, exportedData);
        expect(pdfviewer_calibrate.annotationCollection[0].labelContent).not.toBe(null);
        pdfviewer_calibrate.deleteAnnotations();
        done();
    })
})