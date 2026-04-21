/**
 * insert-text plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';
describe('Markdown - insertText plugin', () => {
    const innerValue: string =
         `# Lists are a piece of cake
         They even auto continue as you type
         A double enter will end them
         Tabs and shift-tabs work too`;
    let editorObj: MarkdownParser;
    const textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
        id: 'markdown-editor',
        styles: 'width:200px;height:200px'
    });
    beforeEach(() => {
        document.body.appendChild(textArea);
        editorObj = new MarkdownParser({ element: textArea });
        textArea.value = innerValue;
        textArea.focus();
    });
    it(' Check the selection insertText insert  ', () => {
        editorObj.markdownSelection.save(2, 7);
        editorObj.markdownSelection.restore(textArea);
        let isCallBack: boolean = false;
        const item: string = 'test';
        editorObj.execCommand('Inserttext', null, null, () => {
            isCallBack = true;
        }, null, item);
        expect(textArea.value.substr(2, 4)).toBe('test');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe(' are ');
    });
    it('  Check the cursor inserttext insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 2);
        editorObj.markdownSelection.restore(textArea);
        const item: string = 'test';
        editorObj.execCommand('Inserttext', null, null, null, null, item);
        expect(textArea.value.substr(2, 4)).toBe('test');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('');
        expect(textArea.selectionStart).toBe(6);
    });
    it('  Check the multiple line inserttext insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 40);
        editorObj.markdownSelection.restore(textArea);
        const item: string = 'test';
        editorObj.execCommand('Inserttext', null, null, null, null, item);
        expect(textArea.value.substr(2, 49)).toBe('testy even auto continue as you type\n         A d');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('y even auto continue as you type\n     ');
        expect(textArea.selectionStart).toBe(6);
        expect(textArea.selectionEnd).toBe(44);
    });
    afterEach(() => {
        textArea.value = '';
        detach(textArea);
    });
});
