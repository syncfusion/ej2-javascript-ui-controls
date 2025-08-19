import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';
// references-tab.spec.js

describe('References Tab Tests', () => {
  let container: DocumentEditorContainer;
  let containerElement:HTMLElement;

  // Helper function to hide cursor animation
  function hideCursorAnimation() {
    const element :HTMLElement= document.querySelector('[class="e-de-blink-cursor e-de-cursor-animation"]');
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

    // Click on References tab
    const referencesTab:HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_reference_tab"] div.e-tab-wrap[role="tab"]');
    if (referencesTab) {
      referencesTab.click();
      jasmine.clock().tick(100);
    } else {
      fail('References tab not found');
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



  it('should insert footnote when clicked', () => {
    // Type some text first
    container.documentEditor.editor.insertText('Testing footnotes');
    
    // Click Insert Footnote button
    const footnoteBtn:HTMLElement = document.querySelector('[aria-label="Insert Footnote"]');
    footnoteBtn.click();
    jasmine.clock().tick(100);
    
    // Verify footnote is inserted
    const hasFootnote = container.documentEditor.documentHelper.footnoteCollection.length > 0;
    expect(hasFootnote).toBe(true);
    
    // Verify we're in footnote editing context
    expect(container.documentEditor.selection.isinFootnote).toBe(true);
    const endnoteBtn:HTMLButtonElement = document.querySelector('[aria-label="Insert Endnote"]');
    expect(endnoteBtn.disabled).toBe(true);
  });

  it('should insert endnote when clicked', () => {
    container.documentEditor.selection.selectAll();
    container.documentEditor.editor.delete();
    container.documentEditor.openBlank();
    jasmine.clock().tick(1000);
    // Type some text first
    container.documentEditor.editor.insertText('Testing endnotes');
    
    // Click Insert Endnote button
    const endnoteBtn:HTMLElement = document.querySelector('[aria-label="Insert Endnote"]');
    endnoteBtn.click();
    jasmine.clock().tick(100);
    
    // Verify endnote is inserted
    const hasEndnote = container.documentEditor.documentHelper.endnoteCollection.length > 0;
    expect(hasEndnote).toBe(true);
    
    // Verify we're in endnote editing context
    expect(container.documentEditor.selection.isinEndnote).toBe(true);
  });

  it('should disable update table button when no TOC exists', () => {
    // Check if Update Table button is disabled when no TOC exists
    const updateTableBtn:HTMLButtonElement = document.querySelector('[aria-label="Update Table"]');
    expect(updateTableBtn.disabled).toBe(true);
  });
  it('should open table of contents dialog when clicked', () => {
    // Click Table of Contents button
    const tocBtn:HTMLElement = document.querySelector('[aria-label="Table of Contents"]');
    tocBtn.click();
    jasmine.clock().tick(100);
    
     // Verify TOC dialog appears
     const dialogElements = document.querySelectorAll('div.e-dlg-header');
     let errorMessageFound = false;
     for (let i = 0; i < dialogElements.length; i++) {
         if (dialogElements[i].textContent && dialogElements[i].textContent.indexOf('No Heading Found!')!=-1) {
           errorMessageFound = true;
           break;
         }
       }
       expect(errorMessageFound).toBe(true);
  });
  it('should enable update table button after TOC is inserted', () => {
    container.documentEditor.openBlank();
    jasmine.clock().tick(1000);
    // Type some text
    container.documentEditor.editor.insertText('Sample Heading');
    container.documentEditor.editor.applyStyle('Heading 1');
    container.documentEditor.selection.handleHomeKey();

    // Insert TOC
    const tocBtn:HTMLElement = document.querySelector('[aria-label="Table of Contents"]');
    tocBtn.click();
    jasmine.clock().tick(100);
    
    container.documentEditor.selection.handleUpKey();
    container.documentEditor.selection.handleUpKey();
    jasmine.clock().tick(1000);
    // Now check if Update Table button is enabled
    const updateTableBtn:HTMLButtonElement = document.querySelector('[aria-label="Update Table"]');
    expect(updateTableBtn.disabled).toBe(false);
    updateTableBtn.click();
  });

  it('should disable footnote/endnote buttons in header/footer', () => {
   container.documentEditor.selection.goToHeader();
   jasmine.clock().tick(1000);
    // Go back to References tab
    const referencesTab:HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_reference_tab"] div.e-tab-wrap[role="tab"]');
    referencesTab.click();
    jasmine.clock().tick(1000);
    
    // Check if Footnote button is disabled
    let footnoteBtn:HTMLButtonElement = document.querySelector('[aria-label="Insert Footnote"]');
    expect(footnoteBtn.disabled).toBe(true);
    
    // Check if Endnote button is disabled
    const endnoteBtn:HTMLButtonElement = document.querySelector('[aria-label="Insert Endnote"]');
    expect(endnoteBtn.disabled).toBe(true);

  });
});