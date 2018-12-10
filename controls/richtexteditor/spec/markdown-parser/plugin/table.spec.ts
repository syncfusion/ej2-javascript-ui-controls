/**
 * MDTable plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - Table plugin', () => {
    
    let innerValueEmpty: string = ``;
    let singleLineText: string = `single text`;
        
    let editorObj: MarkdownParser;
    let textArea: HTMLTextAreaElement; 
    beforeAll(() => {
        textArea = document.createElement('textarea');
        document.body.appendChild(textArea);
        editorObj = new MarkdownParser({ element: textArea });
        textArea.value = innerValueEmpty;
        textArea.focus();
    });
    afterAll(() => {
        detach(textArea);
    });

    it(' Insesrting Table when no text in the text area ', () => {
        editorObj.markdownSelection.setSelection(textArea,0,0);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let isCallBack: boolean = false;
        let item: any = { headingText: 'Heading', colText: 'col' };
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
       
        expect(textArea.value).not.toBeNull();;
        textArea.value  = '';

    });
    it(' Inserting Table when single text in the text area ', () => {
        textArea.value  = 'table is';
        editorObj.markdownSelection.setSelection(textArea,2,4);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        expect(textArea.value).not.toBeNull();
        expect(textArea.value.split('\n').length).toBe(8);
    });
    afterAll(() => {
        textArea.value = '';
        detach(textArea);
    });
});