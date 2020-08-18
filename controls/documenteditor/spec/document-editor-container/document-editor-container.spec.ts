import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Document Editor container
 */

describe('Document Editor container initialization', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        element = undefined;
        container = undefined;
    });
    it('Init container with toolbar', () => {
        container.onPropertyChanged({}, {});
        expect(container.toolbarContainer.childNodes.length).toBeGreaterThan(0);
    });
    it('Get Persist Data', () => {
        expect(container.getPersistData()).toBe('documenteditor-container');
    });
    it('Test control destroy 1', () => {
        let element: HTMLElement = container.element;
        container.destroy();
        expect((element.parentNode as any).querySelectorAll('div').length).toBe(1);
    });
    it('Test control destroy 2', () => {
        let element: HTMLElement = container.element;
        container.destroy();
        expect(container.element).toBe(undefined);
    });
});

describe('Property vaidation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true, enableComment: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        element = undefined;
        container = undefined;
    });
    it('Check enable comment in DocumentEditor', (done) => {
        setTimeout(() => {
            expect(container.documentEditor.enableComment).toBe(false);
            done();
        }, 10);
    });
    it('Properties pane enable validation' , ()=> {
        (container.documentEditor as any).openBlank();
        container.restrictEditing = true;
        container.showPropertiesPane = true;
        expect(container.showPropertiesPane).toBe(true);
    });
});