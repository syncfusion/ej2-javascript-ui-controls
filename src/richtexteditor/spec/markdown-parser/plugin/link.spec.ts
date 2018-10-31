/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - Link and Image plugin', () => {
    let innerValue: string =
        `# Lists are a piece of cake
        They even auto continue as you type
        A double enter will end them
        Tabs and shift-tabs work too`;
    let editorObj: MarkdownParser;
    let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
        id: 'markdown-editor',
        styles: 'width:200px;height:200px'
    });
    beforeAll(() => {
        document.body.appendChild(textArea);
        editorObj = new MarkdownParser({ element: textArea });
        textArea.value = innerValue;
        textArea.focus();
    });

    it(' Check the selection link insert  ', () => {
        editorObj.markdownSelection.save(2, 7);
        editorObj.markdownSelection.restore(textArea);
        let isCallBack: boolean = false;
        let item: any = { text: 'Lists', url: 'http://' };
        editorObj.execCommand("Links", 'Link', null, () => {
            isCallBack = true;
        }, null, item);
        expect(isCallBack).toBe(true);
        expect(textArea.value.substr(2, 16)).toBe('[Lists](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('Lists');
    });

    it(' Check the selection Image insert  ', () => {
        editorObj.markdownSelection.save(19, 22);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { url: 'http://' };
        editorObj.execCommand("Images", 'Image', null, null, null, item);
        expect(textArea.value.substr(19, 15)).toBe('![are](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('are');
        expect(textArea.selectionStart).toBe(21);
    });

    it('  Check the cursor link insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 2);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { url: 'http://', text: '' };
        editorObj.execCommand("Links", 'Link', null, null, null, item);
        expect(textArea.value.substr(2, 11)).toBe('[](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('');
        expect(textArea.selectionStart).toBe(3);
    });
    it('  Check the cursor image insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 2);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { url: 'http://' };
        editorObj.execCommand("Images", 'Image', null, null, null, item);
        expect(textArea.value.substr(2, 12)).toBe('![](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('');
        expect(textArea.selectionStart).toBe(4);
    });
    it('  Check the multiple line link insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 40);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { text: 'Lists are a piece of cake\n        They', url: 'http://' };
        editorObj.execCommand("Links", 'Link', null, null, null, item);
        expect(textArea.value.substr(2, 49)).toBe('[Lists are a piece of cake\n        They](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('Lists are a piece of cake\n        They');
        expect(textArea.selectionStart).toBe(3);
        expect(textArea.selectionEnd).toBe(41);
    });
    it('  Check the multiple line image insert   ', () => {
        textArea.value = innerValue;
        textArea.focus();
        editorObj.markdownSelection.save(2, 40);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { url: 'http://' };
        editorObj.execCommand("Images", 'Image', null, null, null, item);
        expect(textArea.value.substr(2, 50)).toBe('![Lists are a piece of cake\n        They](http://)');
        expect(editorObj.markdownSelection.getSelectedText(textArea)).toBe('Lists are a piece of cake\n        They');
        expect(textArea.selectionStart).toBe(4);
    });
    afterAll(() => {
        textArea.value = '';
        detach(textArea);
    });
});