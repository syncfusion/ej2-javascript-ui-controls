import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { openAnnotationToolbar, verifyAndClickButton, closeAnnotationToolbar } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor, deleteAllAnnotationsHelper } from "../../utils.spec";


describe('PDF_Viewer - Annotation Toolbar', () => {
    // PdfViewer instance used across tests
    let pdfviewer_Toolbar: PdfViewer = null;

    // Inject required PDF Viewer modules
    PdfViewer.Inject(
        Toolbar,
        Magnification,
        Navigation,
        LinkAnnotation,
        ThumbnailView,
        BookmarkView,
        TextSelection,
        TextSearch,
        Print,
        Annotation,
        FormFields,
        FormDesigner,
        PageOrganizer
    );

    // Initialize PDF Viewer before tests
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_Toolbar' });
        document.body.appendChild(element);

        pdfviewer_Toolbar = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });

        // Wait until document is loaded
        pdfviewer_Toolbar.documentLoad = () => {
            done();
        };

        pdfviewer_Toolbar.appendTo("#pdfviewer_Toolbar");
    });

    // Cleanup viewer after all tests
    afterAll(() => {
        if (pdfviewer_Toolbar) {
            pdfviewer_Toolbar.destroy();
            pdfviewer_Toolbar = null;
        }
    });

    // Ensure annotation toolbar is closed after each test
    afterEach(async () => {
        await closeAnnotationToolbar('pdfviewer_Toolbar');
    });

    /**
     * Test: Verify opacity update and selection stability
     * Scenario: Adjust opacity slider rapidly and interact with PDF page
     * Task ID: 1016925
     */
    it("1016925 - Opacity is applied and annotation remains selected when adjusting opacity slider rapidly in UI", async () => {
        // Verify toolbar container is rendered
        const toolbar = document.querySelector('#pdfviewer_Toolbar_toolbarContainer');
        expect(toolbar).not.toBeNull();

        // Open annotation toolbar
        await openAnnotationToolbar('pdfviewer_Toolbar');

        // Get PDF text layer target for mouse interactions
        const target = getTarget('#pdfviewer_Toolbar_textLayer_0');
        const rect = target.getBoundingClientRect();

        // Create an Arrow annotation using mouse drag
        pdfviewer_Toolbar.annotation.setAnnotationMode('Arrow');
        const sx = Math.round(rect.left + 60);
        const sy = Math.round(rect.top + 140);
        const ex = Math.round(rect.left + 220);
        const ey = Math.round(rect.top + 140);

        mouseMoveEvent(target, sx, sy);
        mouseDownEvent(target, sx, sy);
        mouseMoveEvent(target, ex, ey);
        mouseUpEvent(target, ex, ey);

        // Wait until annotation is added
        await waitFor(() =>
            pdfviewer_Toolbar.annotationCollection &&
            pdfviewer_Toolbar.annotationCollection.length > 0
        );

        // Store initial annotation reference
        const annotationBefore = pdfviewer_Toolbar.annotationCollection[
            pdfviewer_Toolbar.annotationCollection.length - 1
        ] as any;

        // Validate annotation presence and default opacity
        expect(annotationBefore).toBeDefined();
        expect(annotationBefore.opacity).toBeGreaterThan(0);

        // Open opacity toolbar dropdown
        const opacityBtn = document.getElementById('pdfviewer_Toolbar_annotation_opacity') as HTMLElement | null;
        expect(opacityBtn).not.toBeNull();
        (opacityBtn as HTMLElement).click();

        // Wait for opacity slider handle to render
        await waitFor(() => {
            return !!document.querySelector('.e-pv-annotation-opacity-slider .e-handle');
        });

        // Capture slider handle element
        const sliderHandle = document.querySelector(
            '.e-pv-annotation-opacity-slider .e-handle'
        ) as HTMLElement;
        expect(sliderHandle).not.toBeNull();

        // Read slider handle position
        const sliderRect = sliderHandle.getBoundingClientRect();

        // Drag opacity slider using mouse events
        mouseMoveEvent(sliderHandle, sliderRect.left, sliderRect.top);
        mouseDownEvent(sliderHandle, sliderRect.left, sliderRect.top);

        // Simulate rapid slider movement
        mouseMoveEvent(sliderHandle, sliderRect.left + 100, sliderRect.top);
        mouseUpEvent(sliderHandle, sliderRect.left + 30, sliderRect.top);

        // Interact with PDF page to trigger potential unselect scenario
        mouseMoveEvent(target, 100, 100);
        mouseDownEvent(target, 100, 100);
        mouseMoveEvent(target, 200, 200);
        mouseUpEvent(target, 200, 200);

        // Re-select annotation if necessary
        if (pdfviewer_Toolbar.annotationCollection && pdfviewer_Toolbar.annotationCollection.length > 0) {
            pdfviewer_Toolbar.annotation.selectAnnotation(
                pdfviewer_Toolbar.annotationCollection[0].annotationId
            );
        }

        // Reopen opacity control and apply minimum opacity (0)
        opacityBtn.click();
        mouseDownEvent(sliderHandle, sliderRect.left + 100, sliderRect.top);
        mouseMoveEvent(target, rect.left + 10, rect.top);
        mouseUpEvent(target, rect.left + 10, rect.top);

        // Validate annotation remains selected
        const selectedItems = pdfviewer_Toolbar.selectedItems.annotations;
        expect(selectedItems.length).toBe(1);

        // Validate final opacity is applied correctly
        const annotationAfter = pdfviewer_Toolbar.annotationCollection[
            pdfviewer_Toolbar.annotationCollection.length - 1
        ] as any;
        expect(annotationAfter.opacity).toBe(0);

        // Cleanup: remove all annotations
        deleteAllAnnotationsHelper(pdfviewer_Toolbar);
        await waitFor(() => pdfviewer_Toolbar.annotationCollection.length === 0);
    });

    /**
     * PDF Viewer - Annotation thickness does not update correctly when adjusting thickness
     * Task ID: 1016926
     */
    it("1016926 - Thickness is applied and annotation remains selected when adjusting thickness slider rapidly in UI", async () => {
        // Verify toolbar container exists
        const toolbar = document.querySelector('#pdfviewer_Toolbar_toolbarContainer');
        expect(toolbar).not.toBeNull();

        // Open annotation toolbar
        await openAnnotationToolbar('pdfviewer_Toolbar');

        // Target PDF layer for mouse interaction
        const target = getTarget('#pdfviewer_Toolbar_textLayer_0');
        const rect = target.getBoundingClientRect();

        // Step 1: Create Arrow annotation
        pdfviewer_Toolbar.annotation.setAnnotationMode('Arrow');
        const sx = Math.round(rect.left + 60);
        const sy = Math.round(rect.top + 180);
        const ex = Math.round(rect.left + 220);
        const ey = Math.round(rect.top + 180);

        mouseMoveEvent(target, sx, sy);
        mouseDownEvent(target, sx, sy);
        mouseMoveEvent(target, ex, ey);
        mouseUpEvent(target, ex, ey);

        // Wait for annotation creation
        await waitFor(() =>
            pdfviewer_Toolbar.annotationCollection &&
            pdfviewer_Toolbar.annotationCollection.length > 0
        );

        const annotationBefore = pdfviewer_Toolbar.annotationCollection[
            pdfviewer_Toolbar.annotationCollection.length - 1
        ] as any;

        // Validate default thickness
        expect(annotationBefore).toBeDefined();
        expect(annotationBefore.thickness).toBeGreaterThan(0);

        // Step 2: Click thickness toolbar button
        const thicknessBtn = document.getElementById(
            'pdfviewer_Toolbar_annotation_thickness'
        ) as HTMLElement | null;

        expect(thicknessBtn).not.toBeNull();
        (thicknessBtn as HTMLElement).click();

        // Step 3: Wait for thickness slider handle
        await waitFor(() => {
            return !!document.querySelector('.e-pv-annotation-thickness-slider .e-handle');
        });

        const sliderHandle = document.querySelector(
            '.e-pv-annotation-thickness-slider .e-handle'
        ) as HTMLElement;

        expect(sliderHandle).not.toBeNull();

        // Read slider handle position
        const sliderRect = sliderHandle.getBoundingClientRect();

        // Drag opacity slider using mouse events
        mouseMoveEvent(sliderHandle, sliderRect.left, sliderRect.top);
        mouseDownEvent(sliderHandle, sliderRect.left, sliderRect.top);

        // Simulate rapid slider movement
        mouseMoveEvent(sliderHandle, sliderRect.left + 100, sliderRect.top);
        mouseUpEvent(sliderHandle, sliderRect.left + 30, sliderRect.top);

        // Interact with PDF page to trigger potential unselect scenario
        mouseMoveEvent(target, 100, 100);
        mouseDownEvent(target, 100, 100);
        mouseMoveEvent(target, 200, 200);
        mouseUpEvent(target, 200, 200);

        // Re-select annotation if necessary
        if (pdfviewer_Toolbar.annotationCollection && pdfviewer_Toolbar.annotationCollection.length > 0) {
            pdfviewer_Toolbar.annotation.selectAnnotation(
                pdfviewer_Toolbar.annotationCollection[0].annotationId
            );
        }

        // Reopen thickness control and apply minimum thickness (0)
        thicknessBtn.click();
        mouseDownEvent(sliderHandle, sliderRect.left + 100, sliderRect.top);
        mouseMoveEvent(target, rect.left + 10, rect.top);
        mouseUpEvent(target, rect.left + 10, rect.top);
        // Validate annotation remains selected
        const selectedItems = pdfviewer_Toolbar.selectedItems.annotations;
        expect(selectedItems.length).toBe(1);

        // Validate final thickness is applied correctly
        const annotationAfter = pdfviewer_Toolbar.annotationCollection[
            pdfviewer_Toolbar.annotationCollection.length - 1
        ] as any;

        expect(annotationAfter.thickness).not.toBe(annotationBefore.thickness);

        // Cleanup
        deleteAllAnnotationsHelper(pdfviewer_Toolbar);
        await waitFor(() => pdfviewer_Toolbar.annotationCollection.length === 0);
    });
});
