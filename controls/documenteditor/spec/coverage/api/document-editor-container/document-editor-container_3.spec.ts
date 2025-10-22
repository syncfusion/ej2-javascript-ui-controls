import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { CommentDeleteEventArgs, TrackChangeEventArgs, RevisionActionEventArgs, AutoResizeEventArgs } from '../../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { Ribbon } from '../../../../src/document-editor-container/ribbon/ribbon';
/**
 * Document Editor container
 */
describe('Document Editor container properties_API', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
    afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        }, 100);
    });
    it('DocumentEditorContainer_onWindowResize', () => {
        console.log('DocumentEditorContainer_onWindowResize');
        (container as any).onWindowResize();
        expect(container.documentEditor.isContainerResize).toBe(true);
    });
    it('DocumentEditorContainer_triggerAutoResize ', () => {
        console.log('triggerAutoResize ');
        (container as any).triggerAutoResize(args);
        function args(args: AutoResizeEventArgs): void {
            expect(args.cancel).toBe(true);
        }
    });
    it('DocumentEditorContainer_commentDelete', () => {
        console.log('commentDelete');
        container.documentEditor.editor.insertComment('hello');
        container.documentEditor.editor.deleteComment();
        container.documentEditor.commentDelete = dcomment;
        function dcomment(args: CommentDeleteEventArgs): void {
            expect(args.cancel).toBe(true);
        }
    });
    it('DocumentEditorContainer_trackchanges', () => {
        console.log('trackchanges');
        container.documentEditor.trackChange = change;
        function change(args: TrackChangeEventArgs): void {
            container.documentEditor.enableTrackChanges = true;
            expect(args.isTrackChangesEnabled).toBe(true);
        }
    });
    it('DocumentEditorContainer_beforeAcceptRejectChanges', () => {
        console.log('DocumentEditorContainer_beforeAcceptRejectChanges');
        container.documentEditor.currentUser = 'Hary';
        container.documentEditor.beforeAcceptRejectChanges = acceptRejectChanges;
        function acceptRejectChanges(args: RevisionActionEventArgs): void {
            if (args.author !== container.documentEditor.currentUser) {
                args.cancel = true;
                expect(args.cancel).toBe(true);
            }
        }
    });

});
describe('Document Editor container properties_changes', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
    afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        }, 100);
    });
    it('DocumentEditorContainer_updateShowHiddenMarks', () => {
        console.log('updateShowHiddenMarks');
        const settings = { showHiddenMarks: true }; // Mock settings object
        (container as any).updateShowHiddenMarks(settings);
        expect(container.documentEditorSettings.showHiddenMarks).toBe(true)
        expect(() => { (container.tableProperties.tableTextProperties.paragraph.toggleHiddenMarks) }).not.toThrowError();
    });
}); 

describe('Test Font Family', () => {
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

  it('Check if font family is undefined', () => {
    const editorContainer = document.getElementById('ribbon_editor_viewerContainer') as any;
    editorContainer.click();
    container.documentEditor.editor.insertText('Testing font family') as any;
    container.documentEditor.editor.onEnter();
    container.documentEditor.editor.onEnter();
    container.documentEditor.editor.insertText('Second Paragraph') as any;
    
    const selection = container.documentEditor.selection;
    selection.selectParagraph();
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

    // Select the whole text
    container.documentEditor.selection.selectAll();
    expect(container.documentEditor.selection.characterFormat.fontFamily).toBe(undefined) as any;
  });

});