import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { EMPTY_PDF_B64} from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_accessbility', () => {
    let pdfviewer_accessbility: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        // Arrange: mount a container for the PdfViewer
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_accessbility' });
        document.body.appendChild(element);

        // Initialize the viewer with a minimal/empty PDF
        pdfviewer_accessbility = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });

        // Open organizer and thumbnails immediately after document load so tests can run synchronously
        pdfviewer_accessbility.documentLoad = () => {
            // Ensures Organize Pages DOM and Thumbnail DOM are present before tests
            pdfviewer_accessbility.isPageOrganizerOpen = true;
            pdfviewer_accessbility.isThumbnailViewOpen = true;
            pdfviewer_accessbility.documentLoad = null;
            done();
        };

        // Mount the viewer to the DOM
        pdfviewer_accessbility.appendTo("#pdfviewer_accessbility");
    });

    afterAll(() => {
        // Cleanup to avoid leaking DOM and instances across test files
        if (pdfviewer_accessbility) {
            pdfviewer_accessbility.destroy();
            const el = document.getElementById('pdfviewer_accessbility');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_accessbility = null;
        }
    });

    afterEach(() => {
        // Reserved for per-test cleanup if needed later (left intentionally empty)
    });

    /**
     * PDF Viewer – Accessibility (Organize Pages and thumbnail) Task ID - 1009760
     *
     * Purpose:
     *  - Open the "Organize Pages" and "thumbnail" view.
     *  - Verify that key icon-only controls expose accessible names via `aria-label`.
     *  - Covered controls: rotate left/right, insert left/right, copy, delete, undo, redo, extract,
     *    and the page checkbox container.
     */

    // 1009760 - Ensure the sidebar content container is keyboard-focusable (tabindex="0") when thumbnails are open
    it('1009760 - ensures sideBarContent exists and has tabindex="0"', () => {
        // Base viewer id (adjust only if your spec uses a different mount id)
        const viewerId = 'pdfviewer_accessbility';

        // The sidebar content region created by the navigation pane
        const sideBarContent = document.getElementById(`${viewerId}_sideBarContent`) as HTMLElement | null;
        expect(sideBarContent).not.toBeNull();

        // Accessibility: region must be in tab order
        // 2) tabindex attribute must be present and equal to "0"
        const tabIndexAttr = sideBarContent ? sideBarContent.getAttribute('tabindex') : null;
        expect(tabIndexAttr).not.toBeNull();
        expect(tabIndexAttr).toBe('0');

        // Close thumbnails to avoid impacting subsequent tests (keeps state explicit)
        pdfviewer_accessbility.isThumbnailViewOpen = false;
    });

    // 1009760 - Validate the page tile checkbox exposes an accessible name "Select Page X"
    it('1009760 - verifies checkbox aria-label follows "Select Page X"', () => {
        // Organizer root should already be present from beforeAll
        const root = document.getElementById('pdfviewer_accessbility') as HTMLElement | null;
        expect(root).not.toBeNull();

        // Prefer querying by aria-label pattern; fallback to id pattern if needed
        const checkbox = root ? root.querySelector('[aria-label^="Select Page "]') ||
            root.querySelector('[id^="checkboxdiv_page_0]') : null;
        expect(checkbox).not.toBeNull();

        // Extract and validate the aria-label format
        var aria = checkbox ? checkbox.getAttribute('aria-label') : null;
        expect(aria).not.toBeNull();

        // Validate pattern without deriving the page index from id (avoids NaN cases).
        // Expected format: "Select Page <number>"
        expect(/^Select Page \d+$/.test(aria || '')).toBe(true);
    });

    // 1009760 - Ensure the Organize Pages tiles container is focusable (tabindex="0") for keyboard navigation
    it('1009760 - ensures the Organize Pages tile view container is keyboard-focusable (tabindex=0)', () => {
        // This should be the scrollable/focusable region that contains the tiles.
        const tileView = document.getElementById('pdfviewer_accessbility_organize_tile_view') as HTMLElement | null;

        // Presence check for the tile view region
        expect(tileView).not.toBeNull();

        // tabindex must be explicitly present and equal to "0" so the region is reachable via Tab
        const tabIndexAttr = tileView ? tileView.getAttribute('tabindex') : null;

        expect(tabIndexAttr).not.toBeNull();
        expect(tabIndexAttr).toBe('0');
    });

    // 1009760 - Verify core Organize Pages actions expose accessible names via aria-label
    it('1009760 - verifies aria-labels for Organize Pages controls', () => {
        // Target the organizer root directly (already opened in beforeAll via isPageOrganizerOpen)
        const viewerRoot = document.getElementById('pdfviewer_accessbility') as HTMLElement | null;
        expect(viewerRoot).not.toBeNull();

        // Utility: try multiple selectors for a control to support both toolbar and tile-level buttons
        const findWithin = (root: HTMLElement, selectors: string[]): HTMLElement | null => {
            for (const s of selectors) {
                const el = root.querySelector(s) as HTMLElement | null;
                if (el) { return el; }
            }
            return null;
        };

        // Assertion helper: control exists and provides a non-empty aria-label
        const verifyAria = (name: string, selectors: string[]) => {
            const el = viewerRoot ? findWithin(viewerRoot, selectors) : null;
            if (!el) { fail(`Missing element for ${name}. Tried: ${selectors.join(' | ')}`); return; }
            const aria = el.getAttribute('aria-label');
            if (aria == null) { fail(`aria-label missing for ${name}`); return; }
            expect(typeof aria).toBe('string');
            expect((aria as string).trim().length).toBeGreaterThan(0);
        };

        // Flexible selectors: support classes and common id patterns
        // Rotate Left control
        verifyAria('Rotate Left', [
            '[aria-label="Rotate Left"]',
            'button[aria-label="Rotate Left"]',
            '.e-pv-rotate-left-button',
            '[id^="pdfviewer_accessbility_rotate_page_0"]'
        ]);

        // Rotate Right control
        verifyAria('Rotate Right', [
            '[aria-label="Rotate Right"]',
            'button[aria-label="Rotate Right"]',
            '.e-pv-rotate-right-button',
            '[id^="pdfviewer_accessbility_rotate_page_0"]'
        ]);

        // Insert Left control
        verifyAria('Insert Left', [
            '[aria-label="Insert Left"]',
            'button[aria-label="Insert Left"]',
            '.e-pv-insert-left-button',
            '[id^="pdfviewer_accessbility_insert_page_0"]'
        ]);

        // Insert Right control
        verifyAria('Insert Right', [
            '[aria-label="Insert Right"]',
            'button[aria-label="Insert Right"]',
            '.e-pv-insert-right-button',
            '[id^="pdfviewer_accessbility_insert_page_0"]'
        ]);

        // Copy Page control
        verifyAria('Copy', [
            '[aria-label="Copy Page"]',
            'button[aria-label="Copy Page"]',
            '.e-pv-copy-button',
            '[id^="pdfviewer_accessbility_copy_page_0"]'
        ]);

        // Delete Page control
        verifyAria('Delete', [
            '[aria-label="Delete Page"]',
            'button[aria-label="Delete Page"]',
            '.e-pv-delete-button',
            '[id^="pdfviewer_accessbility_delete_page_0"]'
        ]);

        // Undo action in the organize toolbar
        verifyAria('Undo', [
            '[aria-label="Undo"]',
            '.e-pv-organize-undo',
            '[id^="pdfviewer_accessbility_undo_organize_Pages"]'
        ]);

        // Redo action in the organize toolbar
        verifyAria('Redo', [
            '[aria-label="Redo"]',
            '.e-pv-organize-redo',
            '[id^="pdfviewer_accessbility_redo_organize_Pages"]'
        ]);

        // Extract Pages action in the organize toolbar
        verifyAria('Extract', [
            '[aria-label^="Extract Pages"]',
            '.e-pv-organize-extract',
            '[id^="pdfviewer_accessbility_extract_pages"]'
        ]);

        // Close the organizer to restore baseline state after this test
        pdfviewer_accessbility.isPageOrganizerOpen = false;
    });

});