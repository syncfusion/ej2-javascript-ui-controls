import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Document Editor container
 */

describe('Show hide header footer pane', () => {
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
    it('Navigate to header and check pane display', () => {
        container.documentEditor.selection.goToHeader();
       expect(container.documentEditor.enableHeaderAndFooter).toBe(true);
    });
    it('Properties pane enable disable click function', () => {
        (container.toolbarModule as any).showHidePropertiesPane();
        expect(container.documentEditor.enableHeaderAndFooter).toBe(true);
    });
    it('Close header pane and check pane', () => {
        (container.toolbarModule as any).showHidePropertiesPane();
        (container.headerFooterProperties as any).onClose();
        expect(container.documentEditor.enableHeaderAndFooter).toBe(false);
    });

});