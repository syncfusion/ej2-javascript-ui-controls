import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import {DocumentEditor, ParagraphFormatProperties} from '../../../../src';
import { Item } from '@syncfusion/ej2-navigations';

describe('Header/Footer properties pane - key events', () => {
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
    it('Header from Top key', () => {
        console.log('Header from Top key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.headerFooterProperties as any).onHeaderValue(event)).not.toThrowError();
    });
    it('Footer from Bottom key', () => {
        console.log('Footer from Bottom key');
        const event: any = { key: 'Enter', code: 'Enter', preventDefault() { }, stopPropagation() { } };
        expect(() => (container.headerFooterProperties as any).onFooterValue(event)).not.toThrowError();
    });
});