import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor, ParagraphFormatProperties } from '../../../../src';
import { Item } from '@syncfusion/ej2-navigations';

/**
 * Document Editor container
 * Properties pane
 * Table properties - margin key events
 */

describe('Table properties pane - margin key events', () => {
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
        (element as any) = undefined;
        (container as any) = undefined;
        setTimeout(() => {
            done();
        }, 100);
    });

    it('Top margin key', () => {
        console.log('Top margin key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.tableProperties as any).onTopMargin(event)).not.toThrowError();
    });

    it('Bottom margin key', () => {
        console.log('Bottom margin key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.tableProperties as any).onBottomMargin(event)).not.toThrowError();
    });

    it('Left margin key', () => {
        console.log('Left margin key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.tableProperties as any).onLeftMargin(event)).not.toThrowError();
    });

    it('Right margin key', () => {
        console.log('Right margin key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.tableProperties as any).onRightMargin(event)).not.toThrowError();
    });
});
