import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import {DocumentEditor, ParagraphFormatProperties} from '../../../../src';
import { Item } from '@syncfusion/ej2-navigations';

/**
 * Document Editor container
 * Properties pane
 * Text properties
 */

describe('Image properties pane', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let editor: DocumentEditor;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
        editor = container.documentEditor;
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
        },100);
    });
    it('Image Width', () => {
        console.log('Image Width');
        editor.editor.insertPicture('data:image/png;base64,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', 100, 100, '', false);
        let image = editor.selection.start.currentWidget.children[0];
        editor.selection.select('0;0;0', '0;0;1');
        editor.selection.isImageSelected = true;
        (container.imageProperties as any).widthNumericBox.element.click();
        (container.imageProperties as any).widthNumericBox.value = 200;
        (container.imageProperties as any).applyImageWidth();
    });
    it('Image Height', () => {
        console.log('Image Height');
        (container.imageProperties as any).heightNumericBox.element.click();
        (container.imageProperties as any).heightNumericBox.value = 200;
        (container.imageProperties as any).applyImageHeight();
        expect(editor.selection.start.currentWidget.children[0].height).toBe(200);
    });
    it('image alternative text', () => {
        console.log('image alternative text');
        (container.imageProperties as any).textArea.value = 'alternative text';
        expect(()=>{ (container.imageProperties as any).applyImageAlternativeText();}).not.toThrowError();
        
    });
});

describe('Image properties pane - aspect ratio', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let editor: DocumentEditor;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
        editor = container.documentEditor;
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
        },100);
    });
    it('Image Width - aspect ratio', () => {
        console.log('Image Width - aspect ratio');
        editor.editor.insertPicture('data:image/png;base64,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', 100, 100, '', false);
        let image = editor.selection.start.currentWidget.children[0];
        editor.selection.select('0;0;0', '0;0;1');
        editor.selection.isImageSelected = true;
        (container.imageProperties as any).widthNumericBox.element.click();
        (container.imageProperties as any).widthNumericBox.value = 200;
        (container.imageProperties as any).isMaintainAspectRatio = true;
        (container.imageProperties as any).applyImageWidth();
    });
    it('Image Height - aspect ratio', () => {
        console.log('Image Height - aspect ratio');
        (container.imageProperties as any).heightNumericBox.element.click();
        (container.imageProperties as any).heightNumericBox.value = 200;
        (container.imageProperties as any).isMaintainAspectRatio = true;
        (container.imageProperties as any).applyImageHeight();
        expect(editor.selection.start.currentWidget.children[0].height).toBe(200);
    });
});

describe('Image properties pane - aspect ratio', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let editor: DocumentEditor;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
        editor = container.documentEditor;
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
        },100);
    });
    it('Image Width key', () => {
        console.log('Image Width key');
        let event: any = { keyCode: 13, preventDefault: function () { }, stopPropagation: function () { } };
        expect(()=> (container.imageProperties as any).onImageWidth(event)).not.toThrowError();
    });
    it('Image Height key', () => {
        console.log('Image Height key');
        let event: any = { keyCode: 13, preventDefault: function () { }, stopPropagation: function () { } };
        expect(()=> (container.imageProperties as any).onImageHeight(event)).not.toThrowError();
    });
    it('Aspect ratio key', () => {
        console.log('Aspect ratio key');
        (container.imageProperties as any).onAspectRatioBtnClick()
        expect((container.imageProperties as any).isMaintainAspectRatio).toBe(true);
    });
});