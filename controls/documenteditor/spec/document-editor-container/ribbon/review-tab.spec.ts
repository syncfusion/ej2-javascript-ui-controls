import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

// review-tab.spec.js
describe('Review Tab Tests - comments', () => {
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

        // Click on Review tab
        const reviewTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_review_tab"] div.e-tab-wrap[role="tab"]');
        if (reviewTab) {
            reviewTab.click();
            jasmine.clock().tick(100);
        } else {
            fail('Review tab not found');
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

  

    it('should open comment pane when New Comment button is clicked', () => {
        // Click New Comment button
        const newCommentBtn: HTMLElement = document.querySelector('[aria-label="New Comment"]');
        newCommentBtn.click();
        jasmine.clock().tick(100);

        // Verify comment pane appears
        const commentPane = document.querySelector('.e-de-cmt-pane');
        expect(commentPane).not.toBeNull();
        
        // Verify comment input area is visible
        const commentInput = document.querySelector('.e-de-cmt-textarea');
        expect(commentInput).not.toBeNull();
    });

    it('should add a comment and navigate through comments', () => {
        container.documentEditor.openBlank();
        // First, add a comment
        const newCommentBtn: HTMLElement = document.querySelector('[aria-label="New Comment"]');
        newCommentBtn.click();
        jasmine.clock().tick(100);
        
        // Type a comment
        container.documentEditor.editor.insertText('Test comment');
        container.documentEditor.selection.selectCurrentWord()
        container.documentEditor.editor.insertComment('first comment');
        jasmine.clock().tick(100);
        container.documentEditor.selection.moveToDocumentEnd();
       container.documentEditor.editor.onEnter();
        
        container.documentEditor.editor.insertText('Second test comment');
        container.documentEditor.selection.selectCurrentWord()
        container.documentEditor.editor.insertComment('second comment');
        jasmine.clock().tick(100);
        
        // Navigate to previous comment
        const previousBtn: HTMLElement = document.querySelector('[aria-label="Previous"]');
        previousBtn.click();
        jasmine.clock().tick(100);
        
        // Verify we're on the first comment
        const commentContent = document.querySelector('.e-de-cmt-content');
        expect(container.documentEditor.documentHelper.currentSelectedComment.text).toContain('first comment');
        
        // Navigate to next comment
        const nextBtn: HTMLElement = document.querySelector('[aria-label="Next"]');
        nextBtn.click();
        jasmine.clock().tick(100);
        
        // Verify we're on the second comment
        expect(container.documentEditor.documentHelper.currentSelectedComment.text).toContain('second comment');
    });

    it('should toggle show comments when clicked', () => {
      
        
        // Click the show comments button to toggle it
        const showCommentsBtn: HTMLElement = document.querySelector('[aria-label="Show Comments"]');
        showCommentsBtn.click();
        jasmine.clock().tick(100);

        expect(container.documentEditor.showComments).toBe(false);
        // Toggle back
        showCommentsBtn.click();
        jasmine.clock().tick(100);
        expect(container.documentEditor.showComments).toBe(true);
        // Verify comment pane is visible again
  
    });

    it('should delete all comments when Delete All is clicked', () => {
        
        
        // Verify comments exist
        const initialCommentCount = container.documentEditor.documentHelper.comments.length;
        expect(initialCommentCount).toBeGreaterThan(0);
        
        // Click the delete button to open dropdown
        const deleteBtn: HTMLElement = document.querySelector('[aria-label="Delete"]');
        deleteBtn.click();
        jasmine.clock().tick(100);
        
        // Select "Delete All" option from dropdown
        const deleteAllOption: HTMLElement = document.querySelector('li[role="menuitem"][aria-label="Delete All"]');
        deleteAllOption.click();
        jasmine.clock().tick(100);
        
        // Verify all comments are deleted
        const finalCommentCount = container.documentEditor.documentHelper.comments.length;
        expect(finalCommentCount).toBe(0);
    });
});
describe('Review Tab Tests - tracking and protect group', () => {
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
            ribbonLayout: 'Classic',
            enableTrackChanges:true
        });
        container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        container.appendTo('#ribbon');

        // Wait for the control to be fully initialized and rendered
        jasmine.clock().install();
        jasmine.clock().tick(500);
        hideCursorAnimation();

        // Click on Review tab
        const reviewTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_review_tab"] div.e-tab-wrap[role="tab"]');
        if (reviewTab) {
            reviewTab.click();
            jasmine.clock().tick(100);
        } else {
            fail('Review tab not found');
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
    // it('should toggle track changes when clicked', () => {
    //     container.documentEditor.openBlank();
    //     // Click Track Changes button
    //     const trackChangesBtn: HTMLElement = document.querySelector('[aria-label="Track Changes"]');
    //     trackChangesBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify track changes is enabled
    //     expect(container.documentEditor.enableTrackChanges).toBe(false);

    // });

    it('should make tracked changes when track changes is enabled', () => {
       container.enableTrackChanges=true;
        
       jasmine.clock().tick(2000);
        
        // Type some text
        container.documentEditor.editor.insertText('This is a tracked change');
        jasmine.clock().tick(100);
        
        // Verify the change is tracked
        expect(container.documentEditor.revisions.length).toBeGreaterThan(0);
    });

    it('should accept all changes when Accept All is clicked', () => {
      
        // Verify the change is tracked
        const initialRevisionCount = container.documentEditor.revisions.length;
        expect(initialRevisionCount).toBeGreaterThan(0);
        
        // Click Accept All button
        const acceptAllBtn: HTMLElement = document.querySelector('[aria-label="Accept All"]');
        acceptAllBtn.click();
        jasmine.clock().tick(100);
        
        // Verify all changes are accepted
        expect(container.documentEditor.revisions.length).toBe(0);
        container.documentEditor.editorHistory.undo();
    });

    it('should reject all changes when Reject All is clicked', () => {
      
        container.documentEditor.openBlank();
        container.documentEditor.editor.insertText('This is a tracked change');
        // Verify the change is tracked
        const revisionCount = container.documentEditor.revisions.length;
        expect(revisionCount).toBeGreaterThan(0);
        jasmine.clock().tick(1000);
        // Click Reject All button
        const rejectAllBtn: HTMLElement = document.querySelector('[aria-label="Reject All"]');
        rejectAllBtn.click();
        jasmine.clock().tick(1000);
        
        // Verify all changes are rejected
        expect(container.documentEditor.revisions.length).toBe(0);
  
    });
  it('should toggle track changes when clicked', () => {
    
        // Click Track Changes button
        const trackChangesBtn: HTMLElement = document.querySelector('[aria-label="Track Changes"]');
        trackChangesBtn.click();
        jasmine.clock().tick(100);
        
        // Verify track changes is enabled
        expect(container.enableTrackChanges).toBe(false);

    });

    it('should enable read-only mode when Read Only is clicked', () => {
        // Click Protect Document button
        const protectDocumentBtn: HTMLElement = document.querySelector('[aria-label="Protect Document"]');
        protectDocumentBtn.click();
        jasmine.clock().tick(100);
        
        // Click Read Only option
        const readOnlyOption: HTMLElement = document.querySelector('li[aria-label="Read Only"]');
        readOnlyOption.click();
        jasmine.clock().tick(100);
        
        // Verify document is in read-only mode
        expect(container.restrictEditing).toBe(true);
    });

    it('should open restrict editing pane when Restrict Editing is clicked', () => {
        // Click Protect Document button
        const protectDocumentBtn: HTMLElement = document.querySelector('[aria-label="Protect Document"]');
        protectDocumentBtn.click();
        jasmine.clock().tick(100);
        
        // Click Restrict Editing option
        const restrictEditingOption: HTMLElement = document.querySelector('li[aria-label="Restrict Editing"]');
        restrictEditingOption.click();
        jasmine.clock().tick(100);
        
        // Verify restrict editing pane appears
        const restrictEditingPane = document.querySelector('.e-de-restrict-pane');
        expect(restrictEditingPane).not.toBeNull();
        
    });
});