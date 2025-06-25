import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

// file-menu.spec.js
describe('File Menu Tests', () => {
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

    it('should display File menu button', () => {
        // Verify File menu button is visible
        const fileButton = document.querySelector('[aria-label="File"]');
        expect(fileButton).not.toBeNull();
       
    });


    it('should show New document option', () => {
        container.documentEditor.editor.insertPageBreak();
        // Click File menu button
        const fileButton: HTMLElement = document.querySelector('[aria-label="File"]');
        fileButton.click();
        jasmine.clock().tick(100);
        container.documentEditor.editor.insertPageBreak();
        // Verify New option is visible
        const newOption:HTMLElement = document.querySelector('li[aria-label="New"]');
        expect(newOption).not.toBeNull();
        
        // Click New option
        newOption.click();
        jasmine.clock().tick(100);
        
        // Verify document is reset
        const documentContent = container.documentEditor.documentHelper.pages.length === 1;
        expect(documentContent).toBeTruthy();
    });

    it('should show Open document option', () => {
        // Click File menu button
        const fileButton: HTMLElement = document.querySelector('[aria-label="File"]');
        fileButton.click();
        jasmine.clock().tick(100);
        
        // Verify Open option is visible
        const openOption:HTMLElement =  document.querySelector('li[aria-label="New"]');;
        expect(openOption).not.toBeNull();
        
        // We can't fully test the file dialog as it's a system dialog
        // But we can verify it's clickable
        // Click outside to close menu
        expect(()=>{openOption.click()}).not.toThrowError();
        jasmine.clock().tick(100);
    });

    it('should show Export submenu when hovered', () => {
        // Click File menu button
        const fileButton: HTMLElement = document.querySelector('[aria-label="File"]');
        fileButton.click();
        jasmine.clock().tick(100);
        
        // Get Export option
        const exportOption: HTMLElement = document.querySelector('[aria-label="Export"]');
        expect(exportOption).not.toBeNull();
        const mouseoverEvent = document.createEvent('MouseEvents');
        mouseoverEvent.initEvent('mouseover', true, true);
        exportOption.dispatchEvent(mouseoverEvent);
        jasmine.clock().tick(100);
        
        // Verify export format options are visible
        const sfdtOption:HTMLElement = document.querySelector('li[aria-label="Syncfusion Document Text (*.sfdt)"]');
        expect(()=>{sfdtOption.click()}).not.toThrowError();
        expect(sfdtOption).not.toBeNull();
        fileButton.click();
        exportOption.dispatchEvent(mouseoverEvent);
        const docxOption:HTMLElement = document.querySelector('li[aria-label="Word Document (*.docx)"]');
        expect(()=>{docxOption.click()}).not.toThrowError();
        expect(docxOption).not.toBeNull();
        fileButton.click();
        exportOption.dispatchEvent(mouseoverEvent);
        const dotxOption:HTMLElement = document.querySelector('li[aria-label="Word Template (*.dotx)"]');
        expect(()=>{dotxOption.click()}).not.toThrowError();
        expect(dotxOption).not.toBeNull();
        fileButton.click();
        exportOption.dispatchEvent(mouseoverEvent);
        const txtOption:HTMLElement = document.querySelector('li[aria-label="Plain Text (*.txt)"]');
        expect(()=>{txtOption.click()}).not.toThrowError();
        expect(txtOption).not.toBeNull();
        
        // Click outside to close menu
        document.body.click();
        jasmine.clock().tick(100);
    });

    it('should show Print option', () => {
        // Click File menu button
        const fileButton: HTMLElement = document.querySelector('[aria-label="File"]');
        fileButton.click();
        jasmine.clock().tick(100);
        
        // Verify Print option is visible
        const printOption:HTMLElement = document.querySelector('li[aria-label="Print"]');
        expect(printOption).not.toBeNull();
        expect(()=>{printOption.click()}).not.toThrowError();
        // We can't fully test the print dialog as it's a system dialog
        // But we can verify it's clickable
        // Click outside to close menu
        document.body.click();
        jasmine.clock().tick(100);
    });

   
});