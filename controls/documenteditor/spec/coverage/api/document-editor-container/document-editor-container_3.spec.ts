import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { CommentDeleteEventArgs, TrackChangeEventArgs, RevisionActionEventArgs, AutoResizeEventArgs } from '../../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
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