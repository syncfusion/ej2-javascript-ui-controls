import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer,
    AnnotationDataFormat
} from "../../../../src/index";
import { assertGeometryChanged, assertGeometryMatches, dblClickEvent, deleteAllAnnotationsHelper, exportAnnotationsHelper, getTarget, importAnnotationsHelper, mouseDownEvent, mouseMoveEvent, mouseUpEvent, threePointCalibrate, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";


// Test suite covering Line-type annotations (Line, Arrow)
describe('PDF_Viewer_Line_Type', () => {
    let pdfviewer_lineType: PdfViewer = null;

    // Inject required PdfViewer modules
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    // Setup PdfViewer instance before running tests
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_lineType' });
        document.body.appendChild(element);
        pdfviewer_lineType = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_lineType.documentLoad = () => done();
        pdfviewer_lineType.appendTo('#pdfviewer_lineType');
    });

    // Cleanup PdfViewer instance after all tests complete
    afterAll(() => {
        if (pdfviewer_lineType) {
            pdfviewer_lineType.destroy();
            const el = document.getElementById('pdfviewer_lineType');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_lineType = null;
        }
    });

    it('1014478- VertexPoints and bounds are updated properly after resizing Line annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');
            const rect = target.getBoundingClientRect();

            // Create Line annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Line');
            const sx = Math.round(rect.left + 50);
            const sy = Math.round(rect.top + 80);
            const ex = Math.round(rect.left + 200);
            const ey = Math.round(rect.top + 80);

            mouseMoveEvent(target, sx, sy);
            mouseDownEvent(target, sx, sy);
            mouseMoveEvent(target, ex, ey);
            mouseUpEvent(target, ex, ey);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Resize using segment handle
            let resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left + 50, handleRect.top + 30);
            mouseUpEvent(target, handleRect.left + 50, handleRect.top + 30);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Validate geometry changes
            assertGeometryChanged(initialVertexPoints, resizedAnnotation.vertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedAnnotation.bounds, 'bounds');

            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Delete and re-import annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            // Validate imported geometry matches resized geometry
            assertGeometryMatches(resizedAnnotation.vertexPoints, importedAnnotation.vertexPoints, 'Imported vertexPoints');
            assertGeometryMatches(resizedAnnotation.bounds, importedAnnotation.bounds, 'Imported bounds');

            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });

    it('1014478- VertexPoints and bounds are updated properly after resizing Arrow annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');
            const rect = target.getBoundingClientRect();

            // Create Arrow annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Arrow');
            const sx = Math.round(rect.left + 60);
            const sy = Math.round(rect.top + 140);
            const ex = Math.round(rect.left + 220);
            const ey = Math.round(rect.top + 140);

            mouseMoveEvent(target, sx, sy);
            mouseDownEvent(target, sx, sy);
            mouseMoveEvent(target, ex, ey);
            mouseUpEvent(target, ex, ey);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Resize using segment handle
            let resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left - 40, handleRect.top + 40);
            mouseUpEvent(target, handleRect.left - 40, handleRect.top + 40);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Validate geometry changes
            assertGeometryChanged(initialVertexPoints, resizedAnnotation.vertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedAnnotation.bounds, 'bounds');

            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Delete and re-import annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            // Validate imported geometry matches resized geometry
            assertGeometryMatches(resizedAnnotation.vertexPoints, importedAnnotation.vertexPoints, 'Imported vertexPoints');
            assertGeometryMatches(resizedAnnotation.bounds, importedAnnotation.bounds, 'Imported bounds');

            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });


    it('1014478- VertexPoints and bounds are updated properly after resizing Polygon annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');
            const rect = target.getBoundingClientRect();

            // Step 1: Create Polygon annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Polygon');

            const aX = Math.round(rect.left + 125);
            const aY = Math.round(rect.top + 40);
            const bX = Math.round(rect.left + 200);
            const bY = Math.round(rect.top + 90);
            const cX = Math.round(rect.left + 170);
            const cY = Math.round(rect.top + 160);
            const dX = Math.round(rect.left + 80);
            const dY = Math.round(rect.top + 160);
            const eX = Math.round(rect.left + 50);
            const eY = Math.round(rect.top + 90);

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

            // Draw DE
            mouseMoveEvent(target, dX, dY);
            mouseDownEvent(target, dX, dY);
            mouseMoveEvent(target, eX, eY);
            mouseUpEvent(target, eX, eY);

            // Draw EA (closing polygon)
            mouseMoveEvent(target, eX, eY);
            mouseDownEvent(target, eX, eY);
            mouseMoveEvent(target, aX, aY);
            mouseUpEvent(target, aX, aY);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 2: Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Step 3: Resize using DOM element
            let resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left + 80, handleRect.top);
            mouseUpEvent(target, handleRect.left + 80, handleRect.top);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 4: Validate geometry after resize
            const resizedVertexPoints = resizedAnnotation.vertexPoints;
            const resizedBounds = resizedAnnotation.bounds;

            assertGeometryChanged(initialVertexPoints, resizedVertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedBounds, 'bounds');

            expect(resizedVertexPoints.length).toBe(initialVertexPoints.length, 'Vertex count should remain same');

            // Step 5: Export
            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Step 6: Delete all annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            // Step 7: Import and validate
            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;
            assertGeometryMatches(resizedBounds, importedAnnotation.bounds, 'Imported bounds');

            // Cleanup
            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });


    it('1014478- VertexPoints and bounds are updated properly after resizing Distance annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');
            const rect = target.getBoundingClientRect();

            // Step 1: Create Distance annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Distance');
            const sx = rect.left + 50, sy = rect.top + 80;
            const ex = rect.left + 220, ey = rect.top + 80;
            mouseDownEvent(target, sx, sy);
            mouseMoveEvent(target, ex, ey);
            mouseUpEvent(target, ex, ey);
            const clickX = (sx + ex) / 2;
            const clickY = (sy + ey) / 2;
            mouseDownEvent(target, clickX, clickY);
            mouseUpEvent(target, clickX, clickY);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 2: Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            let leaderEle = document.getElementById("leaderThumb_3");
            const leaderRect = leaderEle.getBoundingClientRect();
            mouseMoveEvent(target, leaderRect.left, leaderRect.top);
            mouseDownEvent(target, leaderRect.left, leaderRect.top);
            mouseMoveEvent(target, leaderRect.left + 300, leaderRect.top);
            mouseUpEvent(target, leaderRect.left + 300, leaderRect.top);
            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const ResizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 5: Validate geometry after resize
            const resizedVertexPoints = ResizedAnnotation.vertexPoints;
            const resizedBounds = ResizedAnnotation.bounds;

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            assertGeometryChanged(initialVertexPoints, resizedVertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedBounds, 'bounds');

            const boundsChanged = resizedBounds.width !== initialBounds.width || resizedBounds.height !== initialBounds.height;
            expect(boundsChanged).toBe(true, 'Bounds dimensions should change after resize');

            // Step 6: Export and validate
            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Step 7: Delete all annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            expect(pdfviewer_lineType.annotationCollection.length).toBe(0, 'All annotations should be deleted');

            // Step 8: Import and validate
            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            assertGeometryMatches(resizedVertexPoints, importedAnnotation.vertexPoints, 'Imported vertexPoints');
            assertGeometryMatches(resizedBounds, importedAnnotation.bounds, 'Imported bounds');

            // Cleanup
            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });

    it('1014478- VertexPoints and bounds are updated properly after resizing Perimeter annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');

            // Step 1: Create Perimeter annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Perimeter');
            threePointCalibrate();

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 2: Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Step 3: Resize using DOM element
            const resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left + 80, handleRect.top);
            mouseUpEvent(target, handleRect.left + 80, handleRect.top);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 4: Validate geometry after resize
            const resizedVertexPoints = resizedAnnotation.vertexPoints;
            const resizedBounds = resizedAnnotation.bounds;

            assertGeometryChanged(initialVertexPoints, resizedVertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedBounds, 'bounds');

            expect(resizedVertexPoints.length).toBe(initialVertexPoints.length, 'Vertex count should remain same after resize');

            const boundsChanged = resizedBounds.width !== initialBounds.width || resizedBounds.height !== initialBounds.height;
            expect(boundsChanged).toBe(true, 'Bounds dimensions should change after resize');

            // Step 5: Export
            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Step 6: Delete all annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            expect(pdfviewer_lineType.annotationCollection.length).toBe(0, 'All annotations should be deleted');

            // Step 7: Import and validate
            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            assertGeometryMatches(resizedVertexPoints, importedAnnotation.vertexPoints, 'Imported vertexPoints');
            assertGeometryMatches(resizedBounds, importedAnnotation.bounds, 'Imported bounds');

            // Cleanup
            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });

    it('1014478- VertexPoints and bounds are updated properly after resizing Area annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');

            // Step 1: Create Area annotation
            pdfviewer_lineType.areaSettings.opacity = 0;
            pdfviewer_lineType.annotation.setAnnotationMode('Area');
            threePointCalibrate();

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 2: Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Step 3: Resize using DOM element
            const resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left + 70, handleRect.top);
            mouseUpEvent(target, handleRect.left + 70, handleRect.top);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 4: Validate geometry after resize
            const resizedVertexPoints = resizedAnnotation.vertexPoints;
            const resizedBounds = resizedAnnotation.bounds;

            assertGeometryChanged(initialVertexPoints, resizedVertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedBounds, 'bounds');

            expect(resizedVertexPoints.length).toBe(initialVertexPoints.length, 'Vertex count should remain same after resize');

            const boundsChanged = resizedBounds.width !== initialBounds.width || resizedBounds.height !== initialBounds.height;
            expect(boundsChanged).toBe(true, 'Bounds dimensions should change after resize');

            // Step 5: Export
            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Step 6: Delete all annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            expect(pdfviewer_lineType.annotationCollection.length).toBe(0, 'All annotations should be deleted');

            // Step 7: Import and validate
            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            assertGeometryMatches(resizedBounds, importedAnnotation.bounds, 'Imported bounds');

            // Cleanup
            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });

    it('1014478- VertexPoints and bounds are updated properly after resizing Volume annotation and persist through export/import', async () => {
        try {
            const target = getTarget('#pdfviewer_lineType_textLayer_0');
            const rect = target.getBoundingClientRect();

            // Step 1: Create Volume annotation
            pdfviewer_lineType.annotation.setAnnotationMode('Volume');
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

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);

            const annotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 2: Capture initial geometry
            const initialVertexPoints = JSON.parse(JSON.stringify(annotation.vertexPoints));
            const initialBounds = JSON.parse(JSON.stringify(annotation.bounds));

            // Step 3: Resize using DOM element
            const resizeHandle = document.getElementById("segementThumb_2");
            const handleRect = resizeHandle.getBoundingClientRect();
            mouseMoveEvent(target, handleRect.left, handleRect.top);
            mouseDownEvent(target, handleRect.left, handleRect.top);
            mouseMoveEvent(target, handleRect.left + 60, handleRect.top);
            mouseUpEvent(target, handleRect.left + 60, handleRect.top);

            await waitFor(() => pdfviewer_lineType.annotationCollection && pdfviewer_lineType.annotationCollection.length > 0);
            const resizedAnnotation = pdfviewer_lineType.annotationCollection[pdfviewer_lineType.annotationCollection.length - 1] as any;

            // Step 4: Validate geometry after resize
            const resizedVertexPoints = resizedAnnotation.vertexPoints;
            const resizedBounds = resizedAnnotation.bounds;

            assertGeometryChanged(initialVertexPoints, resizedVertexPoints, 'vertexPoints');
            assertGeometryChanged(initialBounds, resizedBounds, 'bounds');

            expect(resizedVertexPoints.length).toBe(initialVertexPoints.length, 'Vertex count should remain same after resize');

            const boundsChanged = resizedBounds.width !== initialBounds.width || resizedBounds.height !== initialBounds.height;
            expect(boundsChanged).toBe(true, 'Bounds dimensions should change after resize');

            // Step 5: Export
            const exportedData = await exportAnnotationsHelper(pdfviewer_lineType);

            // Step 6: Delete all annotations
            deleteAllAnnotationsHelper(pdfviewer_lineType);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length === 0);

            expect(pdfviewer_lineType.annotationCollection.length).toBe(0, 'All annotations should be deleted');

            // Step 7: Import and validate
            importAnnotationsHelper(pdfviewer_lineType, exportedData);
            await waitFor(() => pdfviewer_lineType.annotationCollection.length > 0);

            const importedAnnotation = pdfviewer_lineType.annotationCollection[0] as any;

            assertGeometryMatches(resizedBounds, importedAnnotation.bounds, 'Imported bounds');

            // Cleanup
            deleteAllAnnotationsHelper(pdfviewer_lineType);
        } catch (e) {
            fail(e as Error);
        }
    });

});