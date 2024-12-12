/**
 * Markdown Table plugin spec
 */
import { detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';

describe('Bug 913687: In a bulleted list, clicking the table icon in the toolbar fails to create a table in the editor', () => {
    let innerValueEmpty: string = ``;
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
        textArea.value = '';
        detach(textArea);
        editorObj.tableObj.destroy();
    });
    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the starting of the first line and end of the second line where the two lines are list', () => {
        textArea.value = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea, 0, 43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' + '|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value = '';
    });
    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the starting of the first line and end of the first line where the two lines are list', () => {
        textArea.value = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea, 0, 43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea, 3, 24);
        editorObj.markdownSelection.save(3, 24);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' + '|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value = '';
    });
    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the starting of the first line and middle of the first line where the two lines are list', () => {
        textArea.value = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea, 0, 43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea, 0, 21);
        editorObj.markdownSelection.save(0, 21);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' + '|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value = '';
    });
    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the middle of the first line and middle of the second line where the two lines are list', () => {
        textArea.value = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea, 0, 43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea, 12, 38);
        editorObj.markdownSelection.save(12, 38);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' + '|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value = '';
    });
});

describe('Markdown - Table plugin', () => {
    let innerValueEmpty: string = ``;
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
        textArea.value  = '';
        editorObj.markdownSelection.setSelection(textArea,0,0);
        editorObj.markdownSelection.save(0, 0);
        editorObj.markdownSelection.restore(textArea);
        let isCallBack: boolean = false;
        let item: any = { headingText: 'Heading', colText: 'col' };
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
       
        expect(textArea.value).not.toBeNull();
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor point is anywhere in the line', () => {
        textArea.value  = 'Line one in text area';
        editorObj.markdownSelection.setSelection(textArea,9,9);
        editorObj.markdownSelection.save(9, 9);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        expect(textArea.value).not.toBeNull();
        expect(textArea.value.split('\n').length > 1).toBe(true);
        let fullText: string = 'Line one in text area';
        expect(textArea.value.indexOf(fullText) < 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor is in the start of the line', () => {
        textArea.value  = `Line one in text area`;
        editorObj.markdownSelection.setSelection(textArea,0,0);
        editorObj.markdownSelection.save(0, 0);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        expect(textArea.value).not.toBeNull();
        expect(textArea.value.split('\n').length > 1).toBe(true);
        let fullText: string = 'Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor is in the end of the line', () => {
        textArea.value  = `Line one in text area`;
        editorObj.markdownSelection.setSelection(textArea,21,21);
        editorObj.markdownSelection.save(21, 21);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        expect(textArea.value).not.toBeNull();
        expect(textArea.value.split('\n').length > 1).toBe(true);
        let fullText: string = 'Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor is in between the heading syntax of the line', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,1,1);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) < 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor is in between the list syntax of the line', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.setSelection(textArea,1,1);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '1. Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) < 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area where the cursor is in between the quotation syntax of the line', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Formats", 'BlockQuote', null);
        editorObj.markdownSelection.setSelection(textArea,1,1);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '>  Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection selection ranges are different ', () => {
        textArea.value  = `Line one in text area`;
        editorObj.markdownSelection.setSelection(textArea,2,9);
        editorObj.markdownSelection.save(2, 9);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let clearText: string = 'ne one ';
        expect(textArea.value.indexOf(clearText) < 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection selection ranges are from start and end of the line ', () => {
        textArea.value  = `Line one in text area`;
        editorObj.markdownSelection.setSelection(textArea,0,21);
        editorObj.markdownSelection.save(0, 21);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let clearText: string = 'Line one in text area';
        expect(textArea.value.indexOf(clearText) < 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection ranges starts between the heading syntax and end anywhere', () => {
        textArea.value  = `Line one in text area`;
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,1,9);
        editorObj.markdownSelection.save(1, 1);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) < 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection is the start of the line with heading styles', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,0,0);
        editorObj.markdownSelection.save(0, 0);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection is the end of the line with heading styles', () => {
        textArea.value  = `Line one in text area`;
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,24,24);
        editorObj.markdownSelection.save(24, 24);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection is the cursor point in the middle where the line is applied the heading style', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,9,9);
        editorObj.markdownSelection.save(9, 9);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) < 0).toBe(true);
        let splitText: string = '## ne in text area';
        expect(textArea.value.indexOf(splitText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when single line in the text area having where the selection is the range from to middle where the line is a heading', () => {
        textArea.value  = 'Line one in text area';
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.setSelection(textArea,0,12);
        editorObj.markdownSelection.save(0, 12);
        editorObj.markdownSelection.restore(textArea);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area';
        expect(textArea.value.indexOf(fullText) < 0).toBe(true);
        let splitText: string = '## in text area';
        expect(textArea.value.indexOf(splitText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts from start of the first line and ends in the second line ', () => {
        textArea.value  = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea,0,43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,0,49);
        editorObj.markdownSelection.save(0, 49);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area' + '\n' + '## Line two in text area';
        expect(textArea.value.indexOf(fullText) < 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts from middle of the first line and ends in the middle of the second line ', () => {
        textArea.value  = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea,0,43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,15,38);
        editorObj.markdownSelection.save(15, 38);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let clearText: string = 'text area' + '\n' + '## Line two i';
        expect(textArea.value.indexOf(clearText) < 0).toBe(true);
        let splitText: string = '## n text area';
        expect(textArea.value.indexOf(splitText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the heading syntax of the first line and ends in the middle of the second line ', () => {
        textArea.value  = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea,0,43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,1,38);
        editorObj.markdownSelection.save(1, 38);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area' + '\n' + '## Line two in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) < 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the middle of the first line and ends in between the heading syntax of the second line ', () => {
        textArea.value  = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea,0,43);
        editorObj.markdownSelection.save(0, 43);
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,12,26);
        editorObj.markdownSelection.save(12, 26);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let fullText: string = '## Line one in text area' + '\n' + '## Line two in text area';
        expect(textArea.value.indexOf(fullText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) < 0).toBe(true);
        textArea.value  = '';
    });

    it(' Inserting Table when Two lines in the text area having where the selection selection ranges starts between the middle of the first line and middle of the second line where the second line is a list', () => {
        textArea.value  = 'Line one in text area' + '\n' + 'Line two in text area';
        editorObj.markdownSelection.setSelection(textArea,0,21);
        editorObj.markdownSelection.save(0, 21);
        editorObj.execCommand("Formats", 'h2', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,25,25);
        editorObj.markdownSelection.save(25, 25);
        editorObj.execCommand("Lists", 'OL', null);
        editorObj.markdownSelection.restore(textArea);
        editorObj.markdownSelection.setSelection(textArea,12,38);
        editorObj.markdownSelection.save(12, 38);
        let item: any = { headingText: 'Heading', colText: 'col' };
        let isCallBack: boolean = false;
        editorObj.execCommand("table", 'createtable', null, () => {
            isCallBack = true;
        }, null, item);
        let clearText: string = 'in text area' + '\n' + '1. Line two i';
        expect(textArea.value.indexOf(clearText) < 0).toBe(true);
        let splitText: string = '1. n text area';
        expect(textArea.value.indexOf(splitText) >= 0).toBe(true);
        let defaultText: string = '|Heading 1|Heading 2|' + '\n' + '|---------|---------|' + '\n' +'|col A1|col A2|' + '\n' + '|col B1|col B2|';
        expect(textArea.value.indexOf(defaultText) >= 0).toBe(true);
        textArea.value  = '';
    });

    afterAll(() => {
        textArea.value = '';
        detach(textArea);
        editorObj.tableObj.destroy();
    });
});