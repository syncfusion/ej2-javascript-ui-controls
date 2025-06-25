// insert-tab.spec.js
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

describe('Insert Tab Tests', () => {
  let container: DocumentEditorContainer;
  let containerElement:HTMLElement;

  // Helper function to hide cursor animation
  function hideCursorAnimation() {
    const element:HTMLElement = document.querySelector('[class="e-de-blink-cursor e-de-cursor-animation"]');
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

    // Click on Insert tab
    const insertTab:HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_insert_tab"] div.e-tab-wrap[role="tab"]');
    if (insertTab) {
      insertTab.click();
      jasmine.clock().tick(100);
    } else {
      fail('Insert tab not found');
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

  it('should insert page break when clicked', () => {
    // Get initial page number
    const initialPage = container.documentEditor.selection.startPage;
    
    // Click Page Break button
    const pageBreakBtn:HTMLElement = document.querySelector('[aria-label="Page Break"]');
    pageBreakBtn.click();
    jasmine.clock().tick(100);
    
    // Verify page number has increased
    const currentPage = container.documentEditor.selection.startPage;
    expect(currentPage).toBeGreaterThan(initialPage);
    
    
  });

  it('should open table dialog when clicked', () => {
    // Click Table button
    const tableBtn:HTMLElement = document.querySelector('[aria-label="Table"]');
    tableBtn.click();
    jasmine.clock().tick(100);
    
    // Verify table dialog appears
    const tableDialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
    expect(tableDialog).not.toBeNull();
    (document.querySelector('.e-table-ok') as HTMLElement).click();

    jasmine.clock().tick(100);
    expect(container.documentEditor.selection.contextType.indexOf('Table')).not.toBe(-1);

  });

  it('should open image dropdown when clicked', () => {
    // Click Image button
    const imageBtn:HTMLElement = document.querySelector('[aria-label="Image"]');
    imageBtn.click();
    jasmine.clock().tick(100);
    
    // Verify dropdown menu appears
    const imageDropdown = document.querySelector('ul[role="menu"]');
    expect(imageDropdown).not.toBeNull();
    
    // Verify Upload from computer option is visible
    const uploadOption = document.querySelector('li[aria-label="Upload from computer"]');
    expect(uploadOption).not.toBeNull();
  });

  it('should open link dialog when clicked', () => {
    const showDialogSpy = spyOn(container.documentEditor, 'showDialog').and.callThrough();
    // Click Link button
    const linkBtn:HTMLElement = document.querySelector('[aria-label="Link"]');
    linkBtn.click();
    jasmine.clock().tick(100);
    
    // Verify hyperlink dialog appears
    expect(showDialogSpy).toHaveBeenCalledWith('Hyperlink');
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

  it('should open insert bookmark dialog when Insert Bookmark is clicked', () => {
    // Click Bookmark button
    const bookmarkBtn:HTMLElement = document.querySelector('[aria-label="Bookmark"]');
    bookmarkBtn.click();
    jasmine.clock().tick(100);
    const showDialogSpy = spyOn(container.documentEditor, 'showDialog').and.callThrough();
    // Verify dropdown options are visible
    const insertBookmarkOption:HTMLElement = document.querySelector('[aria-label="Insert Bookmark"]');
    expect(insertBookmarkOption).not.toBeNull();
    
    // Click on Insert Bookmark option
    insertBookmarkOption.click();
    jasmine.clock().tick(100);
    

expect(showDialogSpy).toHaveBeenCalledWith('Bookmark');


  });

  it('should open navigation pane when All Bookmarks is clicked', () => {
    // Click Bookmark button
    const bookmarkBtn:HTMLElement = document.querySelector('[aria-label="Bookmark"]');
    bookmarkBtn.click();
    jasmine.clock().tick(100);
    
    // Verify dropdown options are visible
    const allBookmarksOption: HTMLElement = document.querySelector('[aria-label="All Bookmarks"]');
    expect(allBookmarksOption).not.toBeNull();
    
    // Click on All Bookmarks option
    allBookmarksOption.click();
    jasmine.clock().tick(100);
    
    expect(container.documentEditor.documentEditorSettings.showNavigationPane).toBe(true);
  });

  it('should open comment dialog when clicked', () => {
    // Click Comment button
    const commentBtn:HTMLElement = document.querySelector('[aria-label="New Comment"]');
    commentBtn.click();
    jasmine.clock().tick(100);
    
    // Verify comment dialog appears
    const commentDialog = document.querySelector('.e-de-cmt-pane');
    expect(commentDialog).not.toBeNull();
  });

  it('should open header dropdown when clicked', () => {
    // Click Header button
    const headerBtn:HTMLElement = document.querySelector('[aria-label="Header"]');
    headerBtn.click();
    jasmine.clock().tick(100);
    
    // Check the current context type
    const contextType = container.documentEditor.selection.contextType;
    
    // Verify we're in the header context
    expect(contextType).toBe('HeaderText');
  });

  it('should open footer dropdown when clicked', () => {
    // Click Footer button
    const footerBtn:HTMLElement = document.querySelector('[aria-label="Footer"]');
    footerBtn.click();
    jasmine.clock().tick(100);
    
    // Check the current context type
    const contextType = container.documentEditor.selection.contextType;
    
    // Verify we're in the footer context
    expect(contextType).toBe('FooterText');
  });

  it('should open page number dropdown when clicked', () => {
    container.documentEditor.openBlank();
    // Click Page Number button
    const pageNumberBtn:HTMLElement = document.querySelector('[aria-label="Page Number"]');
    pageNumberBtn.click();
    jasmine.clock().tick(100);
    
    // Select all text
    container.documentEditor.selection.selectAll();
    
    // Get the selected text
    const selectedContent = container.documentEditor.selection.text;
    
    // Verify it contains the page number
    expect(selectedContent).toContain('1');
  });
});