import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { SpellChecker } from '../../../../src/document-editor/implementation/spell-check/spell-checker';

describe('Status bar for buttons', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({enableToolbar: true});
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
    it('webLayout', () => {
        console.log('webLayout');
        (container.statusBar as any).webBtn.click();
        expect(container.documentEditor.layoutType).toBe('Continuous');
    });
    it('printLayout', () => {
        console.log('printLayout');
        (container.statusBar as any).pageBtn.click();
        expect(container.documentEditor.layoutType).toBe('Pages');
    });
    it('Zoom - fit page', () => {
        console.log('Zoom - fit page');
        let args ={item:{text:'Fit one page'}};
        (container.statusBar as any).onZoom(args);
        expect(container.documentEditor.zoomFactor).not.toBe(1);
    });
    it('Zoom - fit page width', () => {
        
        console.log('Zoom - fit page width');
        let args ={item:{text:'Fit page width'}};
        (container.statusBar as any).onZoom(args);
        // expect(container.documentEditor.zoomFactor).toBeGreaterThan(1);
    });
    it('Zoom - 100%', () => {
        console.log('Zoom - 100%');
        let args ={item:{text:'100%'}};
        (container.statusBar as any).onZoom(args);
        expect(container.documentEditor.zoomFactor).toBe(1);
    });
    it('Zoom - 200%', () => {
        console.log('Zoom - 200%');
        let args ={item:{text:'200%'}};
        (container.statusBar as any).onZoom(args);
        expect(container.documentEditor.zoomFactor).toBe(2);
    });
});
describe('Status bar for spell chcek', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar, SpellChecker);
        container = new DocumentEditorContainer({enableToolbar: true, enableSpellCheck: true});
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
    it('spell check', () => {
        console.log('spell check');
        expect(container.documentEditor.enableSpellCheck).toBe(true);
    });
});

describe('Status bar for page number', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({enableToolbar: true});
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

    it('page number', () => {
        container.documentEditor.editor.insertPageBreak();
        // input element keydown event
        (container.statusBar as any).pageNumberInput.value = '2';
        (container.statusBar as any).pageNumberInput.value = '1';
        let event:any = { keyCode: 13, which:13, preventDefault: function () { } };
        (container.statusBar as any).pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', event));
        expect(container.documentEditor.selection.startPage).toBe(1);
    })
    it('invalid page number', () => {
        (container.statusBar as any).pageNumberInput.value = '3';
        let event:any = { keyCode: 13, which:13, preventDefault: function () { } };
        (container.statusBar as any).pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', event));
        expect(container.documentEditor.selection.startPage).toBe(1);
    });
});