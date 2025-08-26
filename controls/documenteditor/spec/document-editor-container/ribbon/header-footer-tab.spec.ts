import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

// header-and-footer-tab.spec.js
describe('Header & Footer Tab Tests', () => {
    let container: DocumentEditorContainer;
    let containerElement: HTMLElement;

    // Helper function to hide cursor animation
    function hideCursorAnimation() {
        const element: HTMLElement = document.querySelector('[class="e-de-blink-cursor e-de-cursor-animation"]');
        if (element) {
            element.style.display = 'none';
        }
    }

    beforeAll(() => {
        // Create container div for the document editor
        containerElement = document.createElement('div');
        containerElement.id = 'ribbon';
        document.body.appendChild(containerElement);

        // Initialize the DocumentEditorContainer
        DocumentEditorContainer.Inject(Ribbon);
        container = new DocumentEditorContainer({
            height: "590px",
            toolbarMode: 'Ribbon',
            ribbonLayout: 'Classic'
        });
        container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        container.appendTo('#ribbon');

        // Wait for the control to be fully initialized and rendered
        jasmine.clock().install();
        jasmine.clock().tick(500);
        hideCursorAnimation();

        container.documentEditor.selection.goToHeader();
        jasmine.clock().tick(1000);
    });

    afterAll(() => {
        // Clean up
        if (container) {
            container.destroy();
            container = null;
        }
        if (containerElement) {
            document.body.removeChild(containerElement);
        }
        jasmine.clock().uninstall();
    });

   

    it('should toggle Different First Page option when clicked', () => {
        // Get the initial state of the checkbox
        let differentFirstPageCheckbox:HTMLInputElement = document.querySelector('input[type="checkbox"]');
        const initialCheckedState = differentFirstPageCheckbox.checked;
        differentFirstPageCheckbox.click();

        jasmine.clock().tick(100);
        differentFirstPageCheckbox = document.querySelector('input[type="checkbox"]');
        // Verify the checkbox state has changed
        const newCheckedState = differentFirstPageCheckbox.checked;
        expect(newCheckedState).not.toBe(initialCheckedState);
        
        // Verify the document properties have been updated
        const differentFirstPage = container.documentEditor.selection.sectionFormat.differentFirstPage;
        expect(differentFirstPage).toBe(newCheckedState);
    });

    it('should toggle Different Odd & Even Pages option when clicked', () => {
        // Get the initial state of the checkbox
        let differentOddEvenCheckbox:HTMLInputElement = document.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
        const initialCheckedState = differentOddEvenCheckbox.checked;
        differentOddEvenCheckbox.click();
        // Click the checkbox to toggle it
        jasmine.clock().tick(100);
        differentOddEvenCheckbox = document.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
        // Verify the checkbox state has changed
        const newCheckedState = differentOddEvenCheckbox.checked;
        expect(newCheckedState).not.toBe(initialCheckedState);
        
        // Verify the document properties have been updated
        const differentOddEven = container.documentEditor.selection.sectionFormat.differentOddAndEvenPages;
        expect(differentOddEven).toBe(newCheckedState);
    });

    it('should toggle Link to Previous option when clicked', () => {
        // First, make sure we're in header or footer context
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        container.documentEditor.editor.insertSectionBreak();
        container.documentEditor.selection.goToHeader();
        jasmine.clock().tick(100);
        
        // Get the initial state of the checkbox
        const linkToPreviousCheckbox:HTMLInputElement = document.querySelectorAll('input[type="checkbox"]')[2] as HTMLInputElement;
        const initialCheckedState = linkToPreviousCheckbox.checked;
        linkToPreviousCheckbox.click();
        jasmine.clock().tick(100);
        
        // Verify the checkbox state has changed
        const newCheckedState = linkToPreviousCheckbox.checked;
        expect(newCheckedState).not.toBe(initialCheckedState);
    });

    it('should insert page number at current position', () => {
        // First, make sure we're in header or footer context
        container.documentEditor.selection.goToHeader();
        jasmine.clock().tick(100);
        
        // Click Page Number button
        const pageNumberBtn: HTMLElement = document.querySelector('[aria-label="Page Number"]');
        pageNumberBtn.click();
        jasmine.clock().tick(100);
        
        // Select all content in the header
        container.documentEditor.selection.selectAll();
        jasmine.clock().tick(100);
        
        // Get selected text
        const selectedText = container.documentEditor.selection.text;
        
        // Page number field should contain a number (typically "1")
        expect(selectedText.trim()).toContain('2');
    });

    it('should close header/footer view when Close button is clicked', () => {
        // First, make sure we're in header or footer context
        container.documentEditor.selection.goToHeader();
        jasmine.clock().tick(100);
        
        // Verify we're in header context
        const headerContext = container.documentEditor.selection.contextType;
        expect(headerContext).toBe('HeaderText');
        
        // Click Close button
        const closeBtn: HTMLElement = document.querySelector('.e-ribbon-item [aria-label="Close"]');
        closeBtn.click();
        jasmine.clock().tick(1000);
        
        // Verify we're back in body context
        const bodyContext = container.documentEditor.selection.contextType;
        expect(bodyContext).toBe('Text');
    });
});