import { createElement } from '@syncfusion/ej2-base';
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer } from '../../../../src/index';
import { PDF_Succinctly } from '../../Data/pdf-data.spec';
import { getTarget, waitFor, simulateTyping, pressKey } from '../../utils.spec';

/**
 * Verifies that the text search loading spinner
 * stops correctly when searching for non-existent text.
 */
describe('PDF_Viewer_TextSearch_Spinner_NonExistentText', () => {
    let pdfviewer_search_spinner: PdfViewer | null = null;

    // Inject required PDF Viewer modules
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation,
        ThumbnailView, BookmarkView, TextSelection, TextSearch,
        Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    // Initialize PDF Viewer before tests
    beforeAll((done: DoneFn) => {
        const element = createElement('div', { id: 'pdfviewer_search_spinner' });
        document.body.appendChild(element);
        pdfviewer_search_spinner = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: 'data:application/pdf;base64,' + PDF_Succinctly
        });
        pdfviewer_search_spinner.documentLoad = () => {
            done();
        };
        pdfviewer_search_spinner.appendTo('#pdfviewer_search_spinner');
    });

    // Cleanup after all tests
    afterAll(() => {
        if (pdfviewer_search_spinner) {
            pdfviewer_search_spinner.destroy();
            pdfviewer_search_spinner = null;
        }
        const element = document.getElementById('pdfviewer_search_spinner');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });

    /**
     * Ensures spinner stops when clicking Next
     * after searching for non-existent text.
     * Bug: 1025523
     */
    it('1025523 - Spinner_Stops_When_Searching_NonExistent_Text_With_NextButton', async () => {
        // Open search toolbar
        const searchBtn = pdfviewer_search_spinner.viewerBase.getElement('_searchIcon') as HTMLElement;
        searchBtn.click();

        const searchInput = pdfviewer_search_spinner.viewerBase.getElement('_search_input') as HTMLInputElement;
        const spinnerIndicator = pdfviewer_search_spinner.viewerBase.getElement('_textSearchLoadingIndicator') as HTMLElement;
        const nextSearchBtn = pdfviewer_search_spinner.viewerBase.getElement('_next_occurrence') as HTMLElement;

        // Type a text that does not exist in the document
        searchInput.focus();
        searchInput.click();
        simulateTyping({ element: searchInput, text: 'sadsad' });

        // Trigger next search
        await waitFor(() => !nextSearchBtn.hasAttribute('disabled'));
        nextSearchBtn.click();

        // Spinner should stop once search completes
        expect(spinnerIndicator.classList.contains('e-spin-show')).toBe(false);

        // Notification should appear for no results
        const notificationPopup = document.querySelector('#pdfviewer_search_spinner_notify') as HTMLElement;
        expect(notificationPopup).toBeTruthy();
        expect(notificationPopup.style.display).not.toBe('none');

        // Search count should be zero
        expect(pdfviewer_search_spinner.textSearchModule.searchCount).toBe(0);
    });

    /**
     * Ensures spinner is fully hidden
     * after a non-existent text search completes.
     */
    fit('1025523 - Spinner_Completely_Hidden_After_NonExistent_Search_Completes', (done: DoneFn) => {
        // Open search toolbar
        const searchBtn = pdfviewer_search_spinner.viewerBase.getElement('_searchIcon') as HTMLElement;
        searchBtn.click();

        const searchInput = pdfviewer_search_spinner.viewerBase.getElement('_search_input') as HTMLInputElement;
        const spinnerIndicator = pdfviewer_search_spinner.viewerBase.getElement('_textSearchLoadingIndicator') as HTMLElement;

        // Type a non-existent text
        searchInput.focus();
        searchInput.click();
        simulateTyping({ element: searchInput, text: 'zzzzzzzzzz' });

        // Press Enter to start search
        pressKey({ element: searchInput, key: 'Enter', code: 'Enter' });

        // Spinner should not remain visible
        expect(spinnerIndicator.classList.contains('e-spin-show')).toBe(false);

        // Notification should appear for no results
        const notificationPopup = document.querySelector('#pdfviewer_search_spinner_notify') as HTMLElement;
        expect(notificationPopup).toBeTruthy();
        expect(notificationPopup.style.display).not.toBe('none');

        // Search count should be zero
        expect(pdfviewer_search_spinner.textSearchModule.searchCount).toBe(0);

        done();
    });
});