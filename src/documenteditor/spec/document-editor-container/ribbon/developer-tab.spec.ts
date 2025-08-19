import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

// developer-tab.spec.js
describe('Developer Tab Tests', () => {
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

        // Click on Developer tab
        const developerTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_developer_tab"] div.e-tab-wrap[role="tab"]');
        if (developerTab) {
            developerTab.click();
            jasmine.clock().tick(100);
        } else {
            fail('Developer tab not found');
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


    // it('should open form fields dropdown when clicked', () => {
    //     // Click Form Fields button
    //     const formFieldsBtn: HTMLElement = document.querySelector('[aria-label="Form Fields"]');
    //     formFieldsBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify dropdown menu appears
    //     const formFieldsDropdown = document.querySelector('ul[role="menu"]');
    //     expect(formFieldsDropdown).not.toBeNull();
       
        
    //     // Verify form field options are visible
    //     const textFormOption = document.querySelector('li[aria-label="Text Form"]');
    //     expect(textFormOption).not.toBeNull();
        
    //     const checkBoxOption = document.querySelector('li[aria-label="Check Box"]');
    //     expect(checkBoxOption).not.toBeNull();
        
    //     const dropDownOption = document.querySelector('li[aria-label="Drop-Down"]');
    //     expect(dropDownOption).not.toBeNull();
        
    //     // Click outside to close dropdown
    //     document.body.click();
    //     jasmine.clock().tick(100);
    // });

    it('should insert text form field when clicked', () => {
        // Click Form Fields button
        const formFieldsBtn: HTMLElement = document.querySelector('[aria-label="Form Fields"]');
        formFieldsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Text Form option
        const textFormOption: HTMLElement = document.querySelector('li[aria-label="Text Form"]');
        textFormOption.click();
        jasmine.clock().tick(100);
        
        
        expect(container.documentEditor.documentHelper.formFields.length).toBe(1);
    });

    it('should insert check box form field when clicked', () => {
        // Click Form Fields button
        const formFieldsBtn: HTMLElement = document.querySelector('[aria-label="Form Fields"]');
        formFieldsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Check Box option
        const checkBoxOption: HTMLElement = document.querySelector('li[aria-label="Check Box"]');
        checkBoxOption.click();
        jasmine.clock().tick(100);
        

        
        expect(container.documentEditor.documentHelper.formFields.length).toBe(2);
    });

    it('should insert drop-down form field when clicked', () => {
        // Click Form Fields button
        const formFieldsBtn: HTMLElement = document.querySelector('[aria-label="Form Fields"]');
        formFieldsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Drop-Down option
        const dropDownOption: HTMLElement = document.querySelector('li[aria-label="Drop-Down"]');
        dropDownOption.click();
        jasmine.clock().tick(100);
        
       
        
        expect(container.documentEditor.documentHelper.formFields.length).toBe(3);
    });


    it('should insert rich text content control when clicked', () => {
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Rich Text Content Control option
        const richTextOption: HTMLElement = document.querySelector('li[aria-label="Rich Text Content Control"]');
        richTextOption.click();
        jasmine.clock().tick(100);
        
        // Verify rich text content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should insert plain text content control when clicked', () => {
        // Clear the document first
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Plain Text Content Control option
        const plainTextOption: HTMLElement = document.querySelector('li[aria-label="Plain Text Content Control"]');
        plainTextOption.click();
        jasmine.clock().tick(100);
        
        // Verify plain text content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should insert combo box content control when clicked', () => {
        // Clear the document first
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Combo Box Content Control option
        const comboBoxOption: HTMLElement = document.querySelector('li[aria-label="Combo Box Content Control"]');
        comboBoxOption.click();
        jasmine.clock().tick(100);
        
        // Verify combo box content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should insert drop-down list content control when clicked', () => {
        // Clear the document first
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Drop-Down List Content Control option
        const dropDownListOption: HTMLElement = document.querySelector('li[aria-label="Drop-Down List Content Control"]');
        dropDownListOption.click();
        jasmine.clock().tick(100);
        
        // Verify drop-down list content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should insert date picker content control when clicked', () => {
        // Clear the document first
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Date Picker Content Control option
        const datePickerOption: HTMLElement = document.querySelector('li[aria-label="Date Picker Content Control"]');
        datePickerOption.click();
        jasmine.clock().tick(100);
        
        // Verify date picker content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should insert check box content control when clicked', () => {
        // Clear the document first
        container.documentEditor.openBlank();
        jasmine.clock().tick(100);
        
        // Click Content Control button
        const contentControlBtn: HTMLElement = document.querySelector('[aria-label="Content Control"]');
        contentControlBtn.click();
        jasmine.clock().tick(100);
        
        // Click Check Box Content Control option
        const checkBoxOption: HTMLElement = document.querySelector('li[aria-label="Check Box Content Control"]');
        checkBoxOption.click();
        jasmine.clock().tick(100);
        
        // Verify check box content control is inserted
        const contentControlInserted = container.documentEditor.documentHelper.contentControlCollection.length > 0;
        expect(contentControlInserted).toBe(true);
    });

    it('should open XML mapping pane when clicked', () => {
        // Click XML Mapping Pane button
        const xmlMappingPaneBtn: HTMLElement = document.querySelector('[aria-label="XML Mapping Pane"]');
        xmlMappingPaneBtn.click();
        jasmine.clock().tick(100);
        
        // Verify XML mapping pane appears
        const xmlMappingPane = document.querySelector('.e-de-op');
        expect(xmlMappingPane).not.toBeNull();
      
    });

    it('should open restrict editing pane when clicked', () => {
        // Click Restrict Editing button
        const restrictEditingBtn: HTMLElement = document.querySelector('[aria-label="Restrict Editing"]');
        restrictEditingBtn.click();
        jasmine.clock().tick(100);
        
        // Verify restrict editing pane appears
        const restrictEditingPane = document.querySelector('.e-de-restrict-pane');
        expect(restrictEditingPane).not.toBeNull();
       
        
        // // Verify restrict editing pane title
        // const paneTitle = document.querySelector('.e-de-restrict-pane-title:contains("Restrict Editing")');
        // expect(paneTitle).not.toBeNull();
    });
});