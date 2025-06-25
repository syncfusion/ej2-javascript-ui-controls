// spec/document-editor-container/ribbon/numbering-list-group.spec.ts
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

describe('Numbering List Tests', () => {
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

        // Click on Home tab to ensure we're on the right tab
        const homeTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_home_tab"] div.e-tab-wrap[role="tab"]');
        if (homeTab) {
            homeTab.click();
            jasmine.clock().tick(500);
        } else {
            fail('Home tab not found');
        }
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

    beforeEach(() => {
        // Insert some text for each test
        container.documentEditor.editor.insertText('Testing numbering lists');
        jasmine.clock().tick(100);
        // Click numbering list button dropdown
        const numberingBtn: HTMLElement = document.querySelector('button:has(span.e-de-ctnr-numbering)') as any;
        (numberingBtn.nextElementSibling as HTMLElement).click();
        jasmine.clock().tick(500);
    });

    afterEach(() => {
        // Clear document content after each test
        container.documentEditor.selection.selectAll();
        container.documentEditor.editor.delete();
        jasmine.clock().tick(100);
    });

    it('should apply arabic numbering list when clicked', () => {
        // Click on arabic numbering option (first item in the dropdown)
        const arabicNumberingOption: HTMLElement = document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[1] as HTMLElement;
        arabicNumberingOption.click();
        jasmine.clock().tick(500);

        // Verify arabic numbering list is applied
        let paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).not.toBe(-1);
        
        // Test removing numbering
        (document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[0] as HTMLElement).click();
        paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).toBe(-1);
    });

    it('should apply lowercase letter numbering list when clicked', () => {
        // Click on lowercase letter numbering option
        const lowercaseLetterOption: HTMLElement = document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[2] as HTMLElement;
        lowercaseLetterOption.click();
        jasmine.clock().tick(500);

        // Verify lowercase letter numbering list is applied
        const paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).not.toBe(-1);
    });

    it('should apply uppercase letter numbering list when clicked', () => {
        // Click on uppercase letter numbering option
        const uppercaseLetterOption: HTMLElement = document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[3] as HTMLElement;
        uppercaseLetterOption.click();
        jasmine.clock().tick(500);

        // Verify uppercase letter numbering list is applied
        const paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).not.toBe(-1);
    });

    it('should apply lowercase roman numbering list when clicked', () => {
        // Click on lowercase roman numbering option
        const lowercaseRomanOption: HTMLElement = document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[4] as HTMLElement;
        lowercaseRomanOption.click();
        jasmine.clock().tick(500);

        // Verify lowercase roman numbering list is applied
        const paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).not.toBe(-1);
    });

    it('should apply uppercase roman numbering list when clicked', () => {
        // Click on uppercase roman numbering option
        const uppercaseRomanOption: HTMLElement = document.querySelectorAll('#ribbon_ribbon_number_list_div ul.e-de-floating-menu > li')[5] as HTMLElement;
        uppercaseRomanOption.click();
        jasmine.clock().tick(500);

        // Verify uppercase roman numbering list is applied
        const paragraphFormat = container.documentEditor.selection.paragraphFormat;
        expect(paragraphFormat.listId).not.toBe(-1);
    });

   
});