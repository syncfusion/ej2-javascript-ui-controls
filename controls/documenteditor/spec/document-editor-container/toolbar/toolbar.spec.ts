import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Toolbar module spec
 */
describe('Initialize toolbar ', () => {
    it('without container component', () => {
        //expect(() => { new Toolbar(undefined); }).not.toThrowError();
    });
    it('Destroy toolbar without container', () => {
        //let toolbar: Toolbar = new Toolbar(undefined);
        //expect(() => { toolbar.destroy(); }).not.toThrowError();
    });
});

describe('Dynamic injection of toolbar validation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ enableToolbar: false });
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
    it('inject toolbar', () => {
        expect(container.toolbarModule).toBeUndefined();
        container.enableToolbar = true;
    },200);
    it('remove toolbar after injection', () => {
        expect(container.toolbarModule).not.toBeUndefined();
        container.enableToolbar = false;
    });
});