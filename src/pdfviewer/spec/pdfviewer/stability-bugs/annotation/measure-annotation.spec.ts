import { createElement } from '@syncfusion/ej2-base';
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer } from '../../../../src/index';
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from '../../utils.spec';
import { EMPTY_PDF_B64 } from '../../Data/pdf-data.spec';

describe('PDF_Viewer_MeasurementAnnotations_Invisible', () => {
    let pdfviewer_measure: PdfViewer | null = null;

    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation,
        ThumbnailView, BookmarkView, TextSelection, TextSearch,
        Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    beforeAll((done: DoneFn) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_measure' });
        document.body.appendChild(element);
        pdfviewer_measure = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_measure.documentLoad = () => done();
        pdfviewer_measure.appendTo('#pdfviewer_measure');
    });

    afterAll(() => {
        if (pdfviewer_measure) {
            pdfviewer_measure.destroy();
            const el: HTMLElement | null = document.getElementById('pdfviewer_measure');
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
            pdfviewer_measure = null;
        }
    });

    function threePointCalibrate() {
        const target = getTarget('#pdfviewer_measure_textLayer_0');
        const rect = target.getBoundingClientRect();
        const aX = Math.round(rect.left + 100);
        const aY = Math.round(rect.top + 50);

        const bX = Math.round(rect.left + 200);
        const bY = Math.round(rect.top + 150);

        const cX = Math.round(rect.left + 50);
        const cY = Math.round(rect.top + 150);

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

        // Draw CA (closing triangle)
        mouseMoveEvent(target, cX, cY);
        mouseDownEvent(target, cX, cY);
        mouseMoveEvent(target, aX, aY);
        mouseUpEvent(target, aX, aY);
    }

    it('1009739-Distance annotation invisible when opacity=0', async () => {
        const target = getTarget('#pdfviewer_measure_textLayer_0');
        const rect = target.getBoundingClientRect();
        pdfviewer_measure.distanceSettings.opacity = 0;
        pdfviewer_measure.annotation.setAnnotationMode('Distance');
        const sx = rect.left + 50, sy = rect.top + 80;
        const ex = rect.left + 220, ey = rect.top + 80;
        mouseDownEvent(target, sx, sy);
        mouseMoveEvent(target, ex, ey);
        mouseUpEvent(target, ex, ey);
        const clickX = (sx + ex) / 2;
        const clickY = (sy + ey) / 2;
        mouseDownEvent(target, clickX, clickY);
        mouseUpEvent(target, clickX, clickY);
        await waitFor(() => pdfviewer_measure.annotationCollection && pdfviewer_measure.annotationCollection.length > 0);
        const annotations = pdfviewer_measure.annotationCollection[pdfviewer_measure.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Perimeter annotation invisible when opacity=0', async () => {
        pdfviewer_measure.perimeterSettings.opacity = 0;
        pdfviewer_measure.annotation.setAnnotationMode('Perimeter');
        threePointCalibrate();
        await waitFor(() => pdfviewer_measure.annotationCollection && pdfviewer_measure.annotationCollection.length > 0);
        const annotations = pdfviewer_measure.annotationCollection[pdfviewer_measure.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Area annotation invisible when opacity=0', async () => {
        pdfviewer_measure.areaSettings.opacity = 0;
        pdfviewer_measure.annotation.setAnnotationMode('Area');
        threePointCalibrate();
        await waitFor(() => pdfviewer_measure.annotationCollection && pdfviewer_measure.annotationCollection.length > 0);
        const annotations = pdfviewer_measure.annotationCollection[pdfviewer_measure.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Radius annotation invisible when opacity=0', async () => {
        const target = getTarget('#pdfviewer_measure_textLayer_0');
        const rect = target.getBoundingClientRect();
        pdfviewer_measure.radiusSettings.opacity = 0;
        pdfviewer_measure.annotation.setAnnotationMode('Radius');
        const sx = rect.left + 60, sy = rect.top + 260;
        const ex = rect.left + 120, ey = rect.top + 320;
        mouseDownEvent(target, sx, sy);
        const steps = 8;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const x = Math.round(sx + (ex - sx) * t);
            const y = Math.round(sy + (ey - sy) * t);
            mouseMoveEvent(target, x, y);
        }
        mouseUpEvent(target, ex, ey);
        await waitFor(() => pdfviewer_measure.annotationCollection && pdfviewer_measure.annotationCollection.length > 0);
        const annotations = pdfviewer_measure.annotationCollection[pdfviewer_measure.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Volume annotation invisible when opacity=0', async () => {
        const target = getTarget('#pdfviewer_measure_textLayer_0');
        const rect = target.getBoundingClientRect();
        pdfviewer_measure.volumeSettings.opacity = 0;
        pdfviewer_measure.annotation.setAnnotationMode('Volume');
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

        await waitFor(() => pdfviewer_measure.annotationCollection && pdfviewer_measure.annotationCollection.length > 0);
        const annotations = pdfviewer_measure.annotationCollection[pdfviewer_measure.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });
});
