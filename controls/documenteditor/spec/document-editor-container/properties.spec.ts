import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Document Editor container
 */

describe('Document Editor container properties', () => {
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
    it('showPropertiesPane', () => {
        console.log('showPropertiesPane');
        container.onPropertyChanged({showPropertiesPane: false}, {});
        let ele: Element = document.getElementsByClassName("e-de-pane")[0];
        expect((ele as HTMLDivElement).style.display).toEqual("none");
        container.onPropertyChanged({showPropertiesPane: true}, {});
        ele = document.getElementsByClassName("e-de-pane")[0];
        expect((ele as HTMLDivElement).style.display).toEqual("block");
        container.onPropertyChanged({showPropertiesPane: false}, {});
        ele = document.getElementsByClassName("e-de-pane")[0];
        expect((ele as HTMLDivElement).style.display).toEqual("none");
    });
});