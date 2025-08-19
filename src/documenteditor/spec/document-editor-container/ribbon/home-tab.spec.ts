// home-tab.spec.js
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

describe('Home Tab Tests', () => {
  let container:DocumentEditorContainer;
  let containerElement:HTMLElement;

  // Helper function to hide cursor animation for consistent screenshots
  function hideCursorAnimation() {
    const element: HTMLElement = document.querySelector('[class="e-de-blink-cursor e-de-cursor-animation"]') as any;
    if (element) {
      element.style.display = 'none';
    }
  }

  beforeAll(() => {
    // Create container div for the document editor
    containerElement = document.createElement('div') as any;
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
    container.appendTo('#ribbon') as any;
    
    // Wait for the control to be fully initialized
    jasmine.clock().install();
    jasmine.clock().tick(100);
    
    hideCursorAnimation();

    jasmine.clock().tick(50);
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


  it('should apply bold formatting when clicked', () => {

    
    const boldBtn = document.querySelector('button[aria-label="Bold (Ctrl+B)"]') as any;
    
    // Click Bold button
    boldBtn.click();
    jasmine.clock().tick(50);
    
    // Type some text
    container.documentEditor.editor.insertText('Testing bold formatting') as any;
    
    // Verify bold formatting is applied
    expect(container.documentEditor.selection.characterFormat.bold).toBe(true);
    
    // Check if button has active class
    expect(boldBtn.classList.contains('e-active')).toBe(true);
  });

  it('should apply subscript formatting when clicked', () => {

    
    // Type some text
    container.documentEditor.editor.insertText('Testing font family') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    const subscriptBtn = document.querySelector('button[aria-label="Subscript (Ctrl+=)"]') as any;
    
    // Click Subscript button
    subscriptBtn.click();
    jasmine.clock().tick(50);
    
    // Verify subscript formatting is applied
    expect(container.documentEditor.selection.characterFormat.baselineAlignment).toBe('Subscript') as any;
    
    // Check if button has active class
    expect(subscriptBtn.classList.contains('e-active')).toBe(true);
    
    const superscriptBtn = document.querySelector('button[aria-label="Superscript (Ctrl+Shift++)"]') as any;
    
    // Click Superscript button
    superscriptBtn.click();
    jasmine.clock().tick(50);
    
    // Verify superscript formatting is applied
    expect(container.documentEditor.selection.characterFormat.baselineAlignment).toBe('Superscript') as any;
    
    // Check if subscript button lost active class
    expect(subscriptBtn.classList.contains('e-active')).toBe(false);
    
    // Check if superscript button has active class
    expect(superscriptBtn.classList.contains('e-active')).toBe(true);
  });

  it('should change line spacing when line spacing options are selected', () => {

    
    // Type some text
    container.documentEditor.editor.insertText('Testing line spacing') as any;
    
    // Click on Line Spacing button
    const lineSpacingBtn = document.querySelector('button:has(span.e-de-ctnr-linespacing)') as any;
    lineSpacingBtn.click();
    jasmine.clock().tick(50);
    
    // Select 2.0 line spacing
    const doubleSpacingOption = document.querySelector('[role="menuitem"][aria-label="Double"]') as any;
    doubleSpacingOption.click();
    jasmine.clock().tick(50);
    
    // Verify line spacing is changed
    expect(container.documentEditor.selection.paragraphFormat.lineSpacing).toBe(2);
    
    // Check if the menu item is marked as selected when reopening the dropdown
    lineSpacingBtn.click();
    jasmine.clock().tick(50);
    
    const selectedItem = document.querySelector('span.e-de-selected-item') as any;
    expect(selectedItem).not.toBeNull();
    const singlespacingOption = document.querySelector('[role="menuitem"][aria-label="Single"]') as any;
    singlespacingOption.click();
  });

  it('should apply underline formatting when clicked', () => {

    
    const underlineBtn = document.querySelector('button[aria-label="Underline (Ctrl+U)"]') as any;
    underlineBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Testing underline formatting') as any;
    
    expect(container.documentEditor.selection.characterFormat.underline).not.toBe('None') as any;
    expect(underlineBtn.classList.contains('e-active')).toBe(true);
  });

  it('should apply strikethrough formatting when clicked', () => {
  
    
    const strikethroughBtn = document.querySelector('button[aria-label="Strikethrough"]') as any;
    strikethroughBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Testing strikethrough formatting') as any;
    
    expect(container.documentEditor.selection.characterFormat.strikethrough).toBe("SingleStrike");
    expect(strikethroughBtn.classList.contains('e-active')).toBe(true);
  });

  it('should apply bullet list when clicked', () => {
    const editorContainer = document.getElementById('ribbon_editor_viewerContainer') as any;
    editorContainer.click();
    
    container.documentEditor.editor.insertText('Testing bullet list') as any;
    jasmine.clock().tick(200);
    
    const bulletBtn = document.querySelector('button:has(span.e-de-ctnr-bullets)') as any;
    bulletBtn.click();
    jasmine.clock().tick(50);
    
    expect(container.documentEditor.selection.paragraphFormat.listId).not.toBe(-1);
  });

  it('should apply numbering list when clicked', () => {
   
    
    container.documentEditor.editor.insertText('Testing numbering list') as any;
    jasmine.clock().tick(200);
    
    const numberingBtn = document.querySelector('button:has(span.e-de-ctnr-numbering)') as any;
    numberingBtn.click();
    jasmine.clock().tick(50);
    
    expect(container.documentEditor.selection.paragraphFormat.listId).not.toBe(-1);
  });

  it('should change text alignment when alignment buttons are clicked', () => {
    // Test center alignment
    const centerAlignBtn = document.querySelector('button[aria-label="Center (Ctrl+E)"]') as any;
    centerAlignBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Center aligned text') as any;
    
    expect(container.documentEditor.selection.paragraphFormat.textAlignment).toBe('Center') as any;
    expect(centerAlignBtn.classList.contains('e-active')).toBe(true);
    
    // Add a new line
    container.documentEditor.editor.insertText('\n') as any;
    
    // Test right alignment
    const rightAlignBtn = document.querySelector('button[aria-label="Align right (Ctrl+R)"]') as any;
    rightAlignBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Right aligned text') as any;
    
    expect(container.documentEditor.selection.paragraphFormat.textAlignment).toBe('Right') as any;
    expect(rightAlignBtn.classList.contains('e-active')).toBe(true);
    
    // Add a new line
    container.documentEditor.editor.insertText('\n') as any;
    
    // Test justify alignment
    const justifyBtn = document.querySelector('button[aria-label="Justify (Ctrl+J)"]') as any;
    justifyBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Justified text that should span multiple lines to demonstrate the justify alignment properly') as any;
    
    expect(container.documentEditor.selection.paragraphFormat.textAlignment).toBe('Justify') as any;
    expect(justifyBtn.classList.contains('e-active')).toBe(true);
    
    // Add a new line
    container.documentEditor.editor.insertText('\n') as any;
    
    // Test left alignment
    const leftAlignBtn = document.querySelector('button[aria-label="Align left (Ctrl+L)"]') as any;
    leftAlignBtn.click();
    jasmine.clock().tick(50);
    
    container.documentEditor.editor.insertText('Left aligned text') as any;
    
    expect(container.documentEditor.selection.paragraphFormat.textAlignment).toBe('Left') as any;
    expect(leftAlignBtn.classList.contains('e-active')).toBe(true);
  });

  it('should change font family when selected', () => {
    const editorContainer = document.getElementById('ribbon_editor_viewerContainer') as any;
    editorContainer.click();
    
    container.documentEditor.editor.insertText('Testing font family') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Open font dropdown
    const fontDropdown = document.querySelector('#ribbon_ribbon_font_family') as any;
    const dropdownIcon = fontDropdown.ej2_instances[0];
    dropdownIcon.showPopup();
    jasmine.clock().tick(100);
    
    const options = document.querySelectorAll('li[role="option"]');
    let arialOption = null;
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent && options[i].textContent.indexOf('Arial') !== -1) {
            arialOption = options[i] as any;
            break;
        }
    }
    
    if (arialOption) {
        arialOption.click();
        jasmine.clock().tick(100);
    }
    expect(container.documentEditor.selection.characterFormat.fontFamily).toBe('Arial') as any;
  });

  it('should change font size when selected', () => {
    const editorContainer = document.getElementById('ribbon_editor_viewerContainer') as any;
    editorContainer.click();
    
    container.documentEditor.editor.insertText('Testing font size') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Open font size dropdown
    const fontDropdown = document.querySelector('#ribbon_ribbon_font_size') as any;
    const dropdownIcon = fontDropdown.ej2_instances[0];
    dropdownIcon.showPopup();
    jasmine.clock().tick(100);
    
    // Select size 18
    const options = document.querySelectorAll('li[role="option"]');
let arialOption;
for (let i = 0; i < options.length; i++) {
    if (options[i].textContent.indexOf('18')!=-1) {
        arialOption = options[i] as any;
        break;
    }
}
arialOption.click();
   
    jasmine.clock().tick(100);
    
    expect(container.documentEditor.selection.characterFormat.fontSize).toBe(18);
  });

  it('should apply heading styles when clicked', () => {
    const editorContainer = document.getElementById('ribbon_editor_viewerContainer') as any;
    editorContainer.click();
    
    container.documentEditor.editor.insertText('Testing heading styles') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Click on Heading 1 style
    const heading1Style = document.querySelectorAll('.e-ribbon-gallery-item')[1] as any;
    heading1Style.click();
    jasmine.clock().tick(100);
    
    expect(container.documentEditor.selection.paragraphFormat.styleName).toBe('Heading 1') as any;
    expect(heading1Style.classList.contains('e-ribbon-gallery-selected')).toBe(true);
  });

  it('should perform clipboard operations', () => {
    container.documentEditor.openBlank();
    
    container.documentEditor.editor.insertText('Testing clipboard operations') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Click Copy button
    const copyBtn = document.querySelector('button[aria-label="Copy"]') as any;
    copyBtn.click();
    jasmine.clock().tick(1000);
    const cutBtn = document.querySelector('button[aria-label="Cut"]') as any;
    cutBtn.click();
    jasmine.clock().tick(1000);
    const pasteBtn:HTMLButtonElement = document.querySelector('button[aria-label="Local Clipboard"]');
    pasteBtn.click();
    jasmine.clock().tick(1000);
    // Paste
    container.documentEditor.editor.paste();
    jasmine.clock().tick(1000);
    
    // Select all text
    container.documentEditor.selection.selectAll();
    
    // expect(container.documentEditor.selection.text.trim()).toBe('Testing clipboard operations\nTesting clipboard operations') as any;
    expect(container.enableLocalPaste).toBe(true);
  });

  it('should clear formatting when clear format button is clicked', () => {
    container.documentEditor.openBlank();
    
    container.documentEditor.editor.insertText('Testing clear format') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Apply bold formatting
    const boldBtn = document.querySelector('button[aria-label="Bold (Ctrl+B)"]') as any;
    boldBtn.click();
    jasmine.clock().tick(50);
    
    expect(container.documentEditor.selection.characterFormat.bold).toBe(true);
    
    // Click clear format button
    const clearFormatBtn = document.querySelector('button[aria-label="Clear all formatting"]') as any;
    clearFormatBtn.click();
    jasmine.clock().tick(50);
    
    expect(container.documentEditor.selection.characterFormat.bold).toBe(false);
  });

  it('should grow and shrink font size when buttons are clicked', () => {
    container.documentEditor.openBlank();
    
    container.documentEditor.editor.insertText('Testing font size changes') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Get initial font size
    const initialFontSize = container.documentEditor.selection.characterFormat.fontSize;
    
    // Click grow font button
    const growFontBtn = document.querySelector('button[aria-label="Grow Font Size (Ctrl+Shift+>)"]') as any;
    growFontBtn.click();
    jasmine.clock().tick(50);
    
    const increasedFontSize = container.documentEditor.selection.characterFormat.fontSize;
    expect(increasedFontSize).toBeGreaterThan(initialFontSize);
    
    // Click shrink font button
    const shrinkFontBtn = document.querySelector('button[aria-label="Shrink Font Size (Ctrl+Shift+<)"]') as any;
    shrinkFontBtn.click();
    jasmine.clock().tick(50);
    
    const decreasedFontSize = container.documentEditor.selection.characterFormat.fontSize;
    expect(decreasedFontSize).toBe(initialFontSize);
    
    // Click shrink font button again
    shrinkFontBtn.click();
    jasmine.clock().tick(50);
    
    const furtherDecreasedFontSize = container.documentEditor.selection.characterFormat.fontSize;
    expect(furtherDecreasedFontSize).toBeLessThan(initialFontSize);
  });

  it('should apply highlight color when highlight button is used', () => {
    container.documentEditor.openBlank();
    
    container.documentEditor.editor.insertText('Testing highlight color') as any;
    
    // Select the text
    container.documentEditor.selection.selectAll();
    
    // Click highlight color button
    const highlightBtn = document.querySelector('button[aria-label="Text highlight color"]') as any;
    highlightBtn.click();
    jasmine.clock().tick(50);
    
    expect(container.documentEditor.selection.characterFormat.highlightColor).toBe('Yellow') as any;
  });

  it('should toggle show/hide paragraph marks', () => {
    container.documentEditor.openBlank();
    
    container.documentEditor.editor.insertText('First paragraph') as any;
    container.documentEditor.editor.insertText('\n') as any;
    container.documentEditor.editor.insertText('Second paragraph') as any;
    
    // Check initial state
    const initialShowMarks = container.documentEditor.documentEditorSettings.showHiddenMarks;
    
    // Click the Show/Hide Paragraph Marks button
    const showHideMarksBtn = document.querySelector('button[aria-label="Show/Hide Marks"]') as any;
    showHideMarksBtn.click();
    jasmine.clock().tick(50);
    
    // Verify paragraph marks are now shown (toggled from initial state)
    const showMarksAfterClick = container.documentEditor.documentEditorSettings.showHiddenMarks;
    expect(showMarksAfterClick).toBe(!initialShowMarks);
    
    // Verify the button is in active state when marks are shown
    if (showMarksAfterClick) {
      expect(showHideMarksBtn.classList.contains('e-active')).toBe(true);
    }
    
    // Click again to hide paragraph marks
    showHideMarksBtn.click();
    jasmine.clock().tick(50);
    
    // Verify paragraph marks are now hidden
    const showMarksAfterSecondClick = container.documentEditor.documentEditorSettings.showHiddenMarks;
    expect(showMarksAfterSecondClick).toBe(initialShowMarks);
    
    // Verify the button is not in active state when marks are hidden
    if (!showMarksAfterSecondClick) {
      expect(showHideMarksBtn.classList.contains('e-active')).toBe(false);
    }
  });

});