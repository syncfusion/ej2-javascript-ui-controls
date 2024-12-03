import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { BeforeFileOpenArgs } from '../../../src/document-editor/base';
/**
 * Toolbar module spec
 */
describe('Initialize toolbar ', () => {
    it('without container component', () => {
        //expect(() => { new Toolbar(undefined); }).not.toThrowError();
    });
//     it('Destroy toolbar without container', () => {
// console.log('Destroy toolbar without container');
//         //let toolbar: Toolbar = new Toolbar(undefined);
//         //expect(() => { toolbar.destroy(); }).not.toThrowError();
//     });
});
describe('Customm toolbar validation', () => {
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
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('inject custom toolbar validation', () => {
console.log('inject custom toolbar validation');
        expect(container.toolbarModule).toBeUndefined();
        container.enableToolbar = true;
    },200);
    //it('remove toolbar after injection', () => {
//console.log('remove toolbar after injection');
 //       container.toolbarItems = ['Image', 'Break', 'RestrictEditing'];
  //      expect((container.toolbarModule as any).imgDropDwn).not.toBeUndefined();
  //      expect((container.toolbarModule as any).breakDropDwn).not.toBeUndefined();
  //      expect((container.toolbarModule as any).restrictDropDwn).not.toBeUndefined();
  //  },500);
});  

describe('Custom Toolbar with Desroy Validatio', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ enableToolbar: true });
        container.appendTo(element);
    });
    afterAll(() => {
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });

    // it('Custom Toolbar with Desroy Validation', () => {
    //     console.log('Custom Toolbar with Desroy Validation');
    //             container.toolbarItems = ['Image'];
    //             expect(container.toolbar).not.toBeUndefined();
    //             container.destroy();
    //         });
});
//https://syncfusion.atlassian.net/browse/EJ2-60031
describe('updating the custom toolbar validation', () => {
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
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('updating the custom toolbar', () => {
        console.log('updating the custom toolbar');
        expect(container.toolbarItems = ['Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Comments'
            , 'TrackChanges']).not.toThrowError;
    }, 500);
});  
