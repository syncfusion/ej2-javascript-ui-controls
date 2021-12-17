import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Document Editor container
 */

describe('DocumentEditorContainer Events', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('View change event', () => {
        container.documentEditor.viewChange = function (event) {
            fail();
        }
        container.contentChange = function (event) {
            fail();
        };
        container.documentEditor.layoutType = 'Continuous';
    });
    it('Comments button click', () => {
        container.contentChange = function (event) {
            fail();
        };
        container.documentEditor.editor.isUserInsert =  true;
        container.documentEditor.editor.insertComment('');
        container.documentEditor.editor.isUserInsert =  false;
    });
});