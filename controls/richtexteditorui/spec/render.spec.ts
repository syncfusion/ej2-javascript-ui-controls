import { RichTextEditorUI } from '../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from './base.spec';

describe('Rendered basic RichTextEditor', () => {
    let editor: RichTextEditorUI;
    beforeEach(() => {
        editor = renderRTE({});
    });
    afterEach(() => {
        destroyRTE(editor);
    });
    it('Should render the basic structure of the RichTextEditor', () => {
        const edtiorElement: HTMLElement = document.querySelector('.e-control.e-richtexteditor-ui');
        expect(edtiorElement).not.toBe(null);
        const editorContainer: HTMLElement = edtiorElement.querySelector('.e-rte-ui-container');
        expect(editorContainer).not.toBe(null);
    });
});
