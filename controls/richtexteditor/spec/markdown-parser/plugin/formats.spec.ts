/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownSelection, MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - Formats plugin', () => {
    let innerValue: string =
        `# Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    let emptySpace: string =
        `
# Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    describe(' Paragraph Formats testing', () => {
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

        it(' apply p formats ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'p', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(#)|^(>)', 'gim').test(line)).toBe(false);
        });
        it(' apply p formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h2', null);
            editorObj.execCommand("Formats", 'p', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(#)', 'gim').test(lines[i])).toBe(false);
            }
        });
        it(' apply p formats ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'p', null);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(#)|^(>)', 'gim').test(line)).toBe(false);
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' Blockquote Formats testing', () => {
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

        it(' apply BlockQuote formats ', () => {
            editorObj.markdownSelection.save(0, 4);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'BlockQuote', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(> )', 'gim').test(line)).toBe(true);
        });

        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' Pre Formats testing', () => {
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

        it(' apply Pre formats ', () => {
            editorObj.markdownSelection.save(0, textArea.value.split('\n')[0].length + 4);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'Pre', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lineNumber: number = editorObj.markdownSelection.getLineNumber(textArea, 2);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            let prev: string = editorObj.markdownSelection.getLine(textArea, lineNumber - 1);
            let next: string = editorObj.markdownSelection.getLine(textArea, lineNumber + 2);
            expect(new RegExp('^(```)', 'gim').test(prev)).toBe(true);
            expect(new RegExp('^(```)', 'gim').test(next)).toBe(true);
        });
        it(' apply Pre formats - already applied Pre format', () => {
            editorObj.execCommand("Formats", 'Pre', null);
            let lineNumber: number = editorObj.markdownSelection.getLineNumber(textArea, 2);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            let prev: string = editorObj.markdownSelection.getLine(textArea, lineNumber - 1);
            let next: string = editorObj.markdownSelection.getLine(textArea, lineNumber + 2);
            expect(new RegExp('^(```)', 'gim').test(prev)).toBe(true);
            expect(new RegExp('^(```)', 'gim').test(next)).toBe(true);
        });
        it(' apply Pre inlineCode formats ', () => {
            editorObj.markdownSelection.save(textArea.value.length - 4, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'Pre', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let prev: string = editorObj.markdownSelection.getLine(textArea, textArea.value.split('\n').length - 1);
            expect(new RegExp('(`)', 'gim').test(prev)).toBe(true);
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' H1 Formats testing', () => {
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

        it(' apply h1 formats - already applied h1 format', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h1', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(# )', 'gim').test(line)).toBe(true);
        });

        it(' apply h1 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h1', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(# )', 'gim').test(lines[i])).toBe(true);
            }
        });

        it(' apply h1 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h1', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(# )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' H2 Formats testing', () => {
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

        it(' apply h2 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h2', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(## )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it(' apply h2 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h2', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(## )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' H3 Formats testing', () => {
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

        it(' apply h3 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h3', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it(' apply h3 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h3', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });
    describe(' H4 Formats testing', () => {
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

        it(' apply h4 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h4', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(#### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it(' apply h4 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h4', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(#### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' H5 Formats testing', () => {
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

        it(' apply h5 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h5', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(##### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it(' apply h5 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h5', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(##### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' H6 Formats testing', () => {
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

        it(' apply h6 formats - to selected multi lines', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Formats", 'h6', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(###### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it(' apply h6 formats - starting empty lines', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Formats", 'h6', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(###### )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });
});