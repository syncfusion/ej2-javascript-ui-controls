/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - Clear plugin', () => {
    let innerValue: string =
        `# ***~~<sub><sup>Lists</sup></sub>~~*** are a piece of cake
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

    it(' Check the Multiple tags selection ', () => {
        editorObj.markdownSelection.save(0, 39);
        editorObj.markdownSelection.restore(textArea);
        let isCallBack: boolean = false;
        editorObj.execCommand("Clear", 'ClearFormat', null, () => {
            isCallBack = true;
        });
        expect(isCallBack).toBe(true);
        expect(textArea.value.substr(0, 5)).toBe('Lists');
    });

    it(' Check the Format selection  ', () => {
        textArea.value = `###### Lists are a piece of cake \n
        They even auto continue as you type`;
        editorObj.markdownSelection.save(0, textArea.value.length);
        editorObj.markdownSelection.restore(textArea);
        editorObj.execCommand("Clear", 'ClearFormat', null);
        expect(textArea.value.substr(0, 5)).toBe('Lists');
    });
    afterAll(() => {
        textArea.value = '';
        detach(textArea);
    });
});