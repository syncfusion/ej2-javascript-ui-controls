import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { openAnnotationToolbar, verifyAndClickButton, closeAnnotationToolbar } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";
import { mouseOverEvent,mouseClickEvent } from "../../utils.spec";

describe('PDF_Viewer - Annotation Toolbar', () => {
    let pdfviewer: PdfViewer = null;

    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer' });
        document.body.appendChild(element);

        pdfviewer = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });

        pdfviewer.documentLoad = () => {
            done();
        };

        pdfviewer.appendTo("#pdfviewer");
    });

    afterAll(() => {
        if (pdfviewer) {
            pdfviewer.destroy();
            pdfviewer = null;
        }
    });

    afterEach(async () => {
        // Close annotation toolbar if open
        await closeAnnotationToolbar('pdfviewer');
    });

    /**
     * PDF Viewer - Annotation Toolbar Dynamic Configuration Tests
     * Task ID: 1006545
     */
    it("1006545 - Dynamically update toolbar settings and verify annotation toolbar accessibility", async () => {
        // Configure toolbar dynamically
        (pdfviewer as any).toolbarSettings = {
            showTooltip: true,
            toolbarItems: [
                'OpenOption',
                'UndoRedoTool',
                'PageNavigationTool',
                'MagnificationTool',
                'PanTool',
                'SelectionTool',
                'CommentTool',
                'SubmitForm',
                'AnnotationEditTool',
                'FormDesignerEditTool',
                'SearchOption',
                'PrintOption',
                'DownloadOption'
            ],
        };
        pdfviewer.dataBind();

        // Verify toolbar container exists
        const toolbar = document.querySelector('#pdfviewer_toolbarContainer');
        expect(toolbar).not.toBeNull();

        // Open annotation toolbar and verify highlight button
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('button[id*="highlight"]', 'pdfviewer_highlight');
    });

    it("1006545 - Verify Free Text annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_annotation_freeTextEdit', 'pdfviewer_annotation_freeTextEdit');
    });

    it("1006545 - Verify Ink annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_annotation_ink', 'pdfviewer_annotation_ink');
    });

    it("1006545 - Verify Shape Line annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_shape_line', 'pdfviewer_shape_line');
    });

    it("1006545 - Verify Shape Arrow annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_shape_arrow', 'pdfviewer_shape_arrow');
    });

    it("1006545 - Verify Shape Rectangle annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_shape_rectangle', 'pdfviewer_shape_rectangle');
    });

    it("1006545 - Verify Shape Circle annotation tool can be activated from toolbar", async () => {
        await openAnnotationToolbar('pdfviewer');
        await verifyAndClickButton('#pdfviewer_shape_circle', 'pdfviewer_shape_circle');
    });

    it("1006545 - Verify sequential switching between multiple annotation tools", async () => {
        await openAnnotationToolbar('pdfviewer');

        const tools = [
            { selector: '#pdfviewer_annotation_freeTextEdit', id: 'pdfviewer_annotation_freeTextEdit' },
            { selector: '#pdfviewer_annotation_ink', id: 'pdfviewer_annotation_ink' },
            { selector: '#pdfviewer_shape_line', id: 'pdfviewer_shape_line' },
            { selector: '#pdfviewer_shape_arrow', id: 'pdfviewer_shape_arrow' },
            { selector: '#pdfviewer_shape_rectangle', id: 'pdfviewer_shape_rectangle' }
        ];

        for (const tool of tools) {
            await verifyAndClickButton(tool.selector, tool.id);
        }
    });
    it('1004722 - the tooltip is showing in the Shape Rectangle annotation even after disabling', async (done: DoneFn) => {
        try {
            // 1) Disable tooltip
            pdfviewer.toolbarSettings.showTooltip = false;
            // 2) Click the main Annotation button
            const annoBtn = document.querySelector('#pdfviewer_annotation') as HTMLElement | null;
            if (!annoBtn) { throw new Error('Annotation button not found: #pdfviewer_annotation'); }
            mouseClickEvent(annoBtn);
            // 3) Click the Shapes button in annotation toolbar
            const shapesBtn = document.querySelector('#pdfviewer_annotation_shapes') as HTMLElement | null;
            if (!shapesBtn) { throw new Error('Shapes button not found: #pdfviewer_annotation_shapes'); }
            mouseClickEvent(shapesBtn);
            // 4) Hover the Rectangle shape button
            const rectBtn = document.querySelector('#pdfviewer_shape_rectangle') as HTMLElement | null;
            if (!rectBtn) { throw new Error('Rectangle button not found: #pdfviewer_shape_rectangle'); }
            mouseOverEvent(rectBtn);
            // 5) Assertions: no tooltip should be shown
            expect(rectBtn).toBeTruthy();
            const aria: string | null = rectBtn.getAttribute('aria-describedby');
            const dataId: string | null = rectBtn.getAttribute('data-tooltip-id');
            // When showTooltip=false, these should be null/falsy
            expect(aria).toBeFalsy();
            expect(dataId).toBeFalsy();
            // Optional: ensure no tooltip container exists
            const wraps = document.querySelectorAll('.e-tooltip-wrap');
            expect(wraps.length).toBe(0);
            done();
        } catch (e) {
            done.fail(e as Error);
        }
    });
    it('1004722 - the tooltip is showing in the calibrate distance annotation even after disabling', async (done: DoneFn) => {
        try {
            pdfviewer.toolbarSettings.showTooltip = false;
            const annoBtn = document.querySelector('#pdfviewer_annotation') as HTMLElement | null;
            if (!annoBtn) { throw new Error('Annotation button not found: #pdfviewer_annotation'); }
            mouseClickEvent(annoBtn);
            const calibrateBtn = document.querySelector('#pdfviewer_annotation_calibrate') as HTMLElement | null;
            if (!calibrateBtn) { throw new Error('Calibrate button not found: #pdfviewer_annotation_calibrate'); }
            mouseClickEvent(calibrateBtn);
            const distanceBtn = document.querySelector('#pdfviewer_calibrate_distance') as HTMLElement | null;
            if (!distanceBtn) { throw new Error('Distance button not found: #pdfviewer_calibrate_distance'); }
            mouseOverEvent(distanceBtn);
            expect(distanceBtn).toBeTruthy();
            const aria: string | null = distanceBtn.getAttribute('aria-describedby');
            const dataId: string | null = distanceBtn.getAttribute('data-tooltip-id');
            expect(aria).toBeFalsy();
            expect(dataId).toBeFalsy();
            const wraps = document.querySelectorAll('.e-tooltip-wrap');
            expect(wraps.length).toBe(0);
            done();
        } catch (e) {
            done.fail(e as Error);
        }
    });
    it('1004722 - the tooltip is showing in the free text align even after disabling', async (done: DoneFn) => {
        try {
            pdfviewer.toolbarSettings.showTooltip = false;
            const annoBtn = document.querySelector('#pdfviewer_annotation') as HTMLElement | null;
            if (!annoBtn) { throw new Error('Annotation button not found: #pdfviewer_annotation'); }
            mouseClickEvent(annoBtn);
            const freeTextBtn = document.querySelector('#pdfviewer_annotation_freeTextEdit') as HTMLElement | null;
            if (!freeTextBtn) { throw new Error('Free Text button not found: #pdfviewer_annotation_freeTextEdit'); }
            mouseClickEvent(freeTextBtn);
            const textAlignBtn = document.querySelector('#pdfviewer_annotation_textalign') as HTMLElement | null;
            if (!textAlignBtn) { throw new Error('Text Align button not found: #pdfviewer_annotation_textalign'); }
            mouseClickEvent(textAlignBtn);
            const leftAlignBtn = document.querySelector('#pdfviewer_left_align') as HTMLElement | null;
            if (!leftAlignBtn) { throw new Error('Align Left button not found: #pdfviewer_left_align'); }
            mouseOverEvent(leftAlignBtn);
            expect(leftAlignBtn).toBeTruthy();
            const aria: string | null = leftAlignBtn.getAttribute('aria-describedby');
            const dataId: string | null = leftAlignBtn.getAttribute('data-tooltip-id');
            expect(aria).toBeFalsy();
            expect(dataId).toBeFalsy();
            const wraps = document.querySelectorAll('.e-tooltip-wrap');
            expect(wraps.length).toBe(0);
            done();
        } catch (e) {
            done.fail(e as Error);
        }
    });
    it('1004722 - the tooltip is showing in the free text properties even after disabling', async (done: DoneFn) => {
        try {
            pdfviewer.toolbarSettings.showTooltip = false;
            const annoBtn = document.querySelector('#pdfviewer_annotation') as HTMLElement | null;
            if (!annoBtn) { throw new Error('Annotation button not found: #pdfviewer_annotation'); }
            mouseClickEvent(annoBtn);
            const textPropsBtn = document.querySelector('#pdfviewer_annotation_textproperties') as HTMLElement | null;
            if (!textPropsBtn) { throw new Error('Text Properties button not found: #pdfviewer_annotation_textproperties'); }
            mouseClickEvent(textPropsBtn);
            const boldBtn = document.querySelector('#pdfviewer_bold') as HTMLElement | null;
            if (!boldBtn) { throw new Error('Bold button not found: #pdfviewer_bold'); }
            mouseOverEvent(boldBtn);
            expect(boldBtn).toBeTruthy();
            const aria: string | null = boldBtn.getAttribute('aria-describedby');
            const dataId: string | null = boldBtn.getAttribute('data-tooltip-id');
            expect(aria).toBeFalsy();
            expect(dataId).toBeFalsy();
            const wraps = document.querySelectorAll('.e-tooltip-wrap');
            expect(wraps.length).toBe(0);
            done();
        } catch (e) {
            done.fail(e as Error);
        }
    });
});