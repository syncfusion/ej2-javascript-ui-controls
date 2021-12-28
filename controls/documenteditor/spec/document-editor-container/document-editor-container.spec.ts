import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
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
    it('Init container with toolbar', () => {
console.log('Init container with toolbar');
        container.onPropertyChanged({}, {});
        expect(container.toolbarContainer.childNodes.length).toBeGreaterThan(0);
    });
    it('Get Persist Data', () => {
console.log('Get Persist Data');
        expect(container.getPersistData()).toBe('documenteditor-container');
    });
    it('Test control destroy 1', (done) => {
console.log('Test control destroy 1');
        let element: HTMLElement = container.element;
        
        setTimeout(function () {
            expect(function () { container.destroy(); }).not.toThrowError();
            expect(element.childNodes.length).toBe(0);
            document.body.innerHTML = '';
            element = undefined;
            container = undefined;
            done();
        }, 1000);
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
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Check enable comment in DocumentEditor', (done) => {
console.log('Check enable comment in DocumentEditor');
        setTimeout(() => {
            expect(container.documentEditor.enableComment).toBe(false);
            done();
        }, 10);
    });
    it('Properties pane enable validation' , ()=> {
console.log('Properties pane enable validation');
        (container.documentEditor as any).openBlank();
        container.restrictEditing = true;
        container.showPropertiesPane = true;
        expect(container.showPropertiesPane).toBe(true);
    });
});
// describe('Restrict editing enable validation', () => {
//     let container: DocumentEditorContainer;
//     let menu: ContextMenu;
//     let element: HTMLElement;
//     beforeAll(() => {
//         element = createElement('div');
//         document.body.appendChild(element);
//         DocumentEditorContainer.Inject(Toolbar);
//         container = new DocumentEditorContainer({ restrictEditing: true, showPropertiesPane: true });
//         container.appendTo(element);
        
//     });
//     afterAll(() => {
//         container.destroy();
//         expect(element.childNodes.length).toBe(0);
//         document.body.removeChild(element);
//         expect(() => { container.destroy(); }).not.toThrowError();
//         document.body.innerHTML = '';
//         element = undefined;
//         container = undefined;
//     });
    
//     it('Restrict editing enable validation', () => {
//         console.log('Restrict editing enable validation');
//                 (container.documentEditor as any).openBlank();
//         let classele: any = document.getElementsByClassName('e-toolbar-item');
//         for (let i: number = 0; i< classele.length; i++) {
//             let ele: any =classele[i];
//             let disabled: any = ele.ariaDisabled;
//             let label: any = ele.children[0];
//             if (isNullOrUndefined(label))
//             {
//                 continue;
//             }
//             let item: any = label.ariaLabel;
//             if (item === 'New' || item === 'Open' || item ==='Find' || item === 'LocalClipboard' || item === 'RestrictEditing') {
//                 expect(disabled).toBe('false');
//             }
//             if (item === 'Undo' || item === 'Redo' || item === 'Image dropdownbutton' || item === 'Table' || item === 'Link' || item ===  'Break dropdownbutton'|| item === 'PageNumber' || item === 'PageSetup' || item === 'Footer' || item === 'FormFields' || item === 'Header' || item === 'Comments' || item === 'TrackChanges' || item === 'Bookmark' || item === 'TableOfContents' ) {
//                 expect(disabled).toBe('true');
//             }
//         }
//         expect(container.toolbarModule.propertiesPaneButton.element.parentElement.classList.contains('e-de-overlay')).toBe(true);
//                 expect(container.showPropertiesPane).toBe(false);
//             });
// });


describe('Document Editor container initialization without element id', () => {
    let container: DocumentEditorContainer;
    let container2: DocumentEditorContainer;
    let element: HTMLElement;
    let element2: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        element2 = createElement('div');
        document.body.appendChild(element);
        document.body.appendChild(element2);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
        container2 = new DocumentEditorContainer({ showPropertiesPane: false });
        container2.appendTo(element2);
    });
    afterAll(() => {
        container.destroy();
        container2.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.removeChild(element2);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Open context menu with mutiple document editor in same page', () => {
        let event: MouseEvent = new MouseEvent('contextmenu', { clientX: 122, clientY: 156 });

        container.documentEditor.documentHelper.viewerContainer.dispatchEvent(event);
        var elements = document.getElementsByClassName('e-contextmenu-wrapper');
        for (let j: number = 0; j < elements.length; j++) {
            expect(elements[j].getElementsByClassName('e-de-copy').length).toBe(1);
        }
    });
});