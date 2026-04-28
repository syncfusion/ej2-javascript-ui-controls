/**
 * Lists plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownParser } from '../../../src/markdown-parser/index';

describe('Markdown - Formats plugin', () => {
    let innerValue: string =
        `# Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    let nestedValue: string =
        `- Lists are a piece of cake
\t- They even auto continue as you type
\t\t- A double enter will end them
\t- Tabs and shift-tabs work too`;

    let enterValue: string =
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

    describe(' OL testing', () => {
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

        it(' apply to single line  ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Lists", 'OL', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(1. )', 'gim').test(line)).toBe(true);
        });
        it('  apply to multi line   ', () => {
            editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(1. )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it('  apply to multi line with already applied OL ', () => {
            editorObj.markdownSelection.save(6, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; i < lines.length; i++) {
                expect(new RegExp('^(' + (i + 1) + '. ' + (i + 1) + '. )', 'gim').test(lines[i])).toBe(false);
            }
        });
        it('  apply OL to UL ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(- )', 'gim').test(lines[i])).toBe(true);
            }
        });

        it('  apply OL to first empty lines ', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(1. )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' UL testing', () => {
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

        it(' apply to single line  ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Lists", 'UL', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(- )', 'gim').test(line)).toBe(true);
        });
        it('  apply to multi line   ', () => {
            editorObj.markdownSelection.save(6,6);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(- )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it('  apply to multi line with already applied UL ', () => {
            editorObj.markdownSelection.save(6, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(- - )', 'gim').test(lines[i])).toBe(false);
            }
        });
        it('  apply UL to OL ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(1. )', 'gim').test(lines[i])).toBe(true);
            }
        });

        it('  apply UL to OL in nested level ', () => {
            textArea.value = nestedValue;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(1. )', 'gim').test(lines[i].trim())).toBe(true);
            }
        });

        it('  apply UL to first empty lines ', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(- )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' OL enter and tab, shift+tab key testing', () => {
        let editorObj: MarkdownParser;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 9 } };
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({ element: textArea });
            textArea.value = innerValue;
            textArea.focus();
        });

        it(' tab key navigation from second line  ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(false);
            }
            let line: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line.length + 3, line.length + 8);
            editorObj.markdownSelection.restore(textArea);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
        });
        it(' enter key navigation from nested line  ', () => {
            let textArea: HTMLTextAreaElement = (editorObj.element as HTMLTextAreaElement);
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let line2: string = editorObj.markdownSelection.getLine(textArea, 1);
            let length: number = line1.length + line2.length
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length + 2, length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 2);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
            expect(new RegExp('^(1.)', 'gim').test(line.trim())).toBe(true);
        });
        it(' shift+tab key navigation from nested line  ', () => {
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line1.length + 2, line1.length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            let prevSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let curSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            expect(prevSpace.length > curSpace.length).toBe(true);
        });

        it(' tab key navigation with multi lines  ', () => {
            (editorObj.element as HTMLTextAreaElement).value = innerValue;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let firstLine: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(firstLine.length + 1, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.shiftKey = false;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 1; lines[i].trim() !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(true);
                expect(new RegExp('^(1. )', 'gim').test(lines[i].trim())).toBe(true);
            }
        });
        it(' shift+tab key navigation with multi lines  ', () => {
            keyBoardEvent.event.shiftKey = true;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 1; lines[i].trim() !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(false);
            }
        });

        it(' shift+tab key navigation with nested last line  ', () => {
            (editorObj.element as HTMLTextAreaElement).value = nestedValue;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.markdownSelection.save(textArea.value.length - 6, textArea.value.length - 4);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.shiftKey = true;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let index: number = editorObj.markdownSelection.getLineNumber(textArea, (editorObj.element as HTMLTextAreaElement).selectionStart);
            let line: string = editorObj.markdownSelection.getLine(textArea, index);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(false);
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' UL enter and tab, shift+tab key testing', () => {
        let editorObj: MarkdownParser;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 9 } };
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({ element: textArea });
            textArea.value = innerValue;
            textArea.focus();
        });

        it(' tab key navigation from second line  ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(false);
            }
            let line: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line.length + 3, line.length + 8);
            editorObj.markdownSelection.restore(textArea);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
        });
        it(' enter key navigation from nested line  ', () => {

            let textArea: HTMLTextAreaElement = (editorObj.element as HTMLTextAreaElement);
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let line2: string = editorObj.markdownSelection.getLine(textArea, 1);
            let length: number = line1.length + line2.length
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length + 2, length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 2);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
            expect(new RegExp('^(-)', 'gim').test(line.trim())).toBe(true);
        });
        it(' shift+tab key navigation from nested line  ', () => {
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line1.length + 2, line1.length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            let prevSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let curSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            expect(prevSpace.length > curSpace.length).toBe(true);
        });

        it(' tab key navigation with multi lines  ', () => {
            (editorObj.element as HTMLTextAreaElement).value = innerValue;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let firstLine: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(firstLine.length + 1, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.shiftKey = false;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 1; lines[i].trim() !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(true);
                expect(new RegExp('^(- )', 'gim').test(lines[i].trim())).toBe(true);
            }
        });
        it(' shift+tab key navigation with multi lines  ', () => {
            keyBoardEvent.event.shiftKey = true;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 1; lines[i].trim() !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(false);
            }
        });
        it(' shift+tab key navigation with nested last line  ', () => {
            (editorObj.element as HTMLTextAreaElement).value = nestedValue;
            editorObj.markdownSelection.save(textArea.value.length - 6, textArea.value.length - 4);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.shiftKey = true;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let index: number = editorObj.markdownSelection.getLineNumber(textArea, (editorObj.element as HTMLTextAreaElement).selectionStart);
            let line: string = editorObj.markdownSelection.getLine(textArea, index);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(false);
        });
        afterAll(() => {
            detach(textArea);
        });
    });
    describe('UL and OL testing apply and remvoe command', () => {
        let innerValue: string =
        `Lists are a piece of cake
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

        it(' apply and remove OL ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Lists", 'OL', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(1. )', 'gim').test(line)).toBe(true);
             editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
             editorObj.execCommand("Lists", 'OL', null);
              line = editorObj.markdownSelection.getSelectedLine(textArea);
             expect(new RegExp('^(1. )', 'gim').test(line)).not.toBe(true);
        });
        it('  apply and remove UL   ', () => {
            editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
             expect(new RegExp('^(- )', 'gim').test(line)).toBe(true);
             editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'UL', null);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(- )', 'gim').test(line)).not.toBe(true);
            });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' OL testing with list tag as 1., 2., 3.,', () => {
        let editorObj: MarkdownParser;
        let innerValue: string =
        `one
two
three
four
five`;

let emptySpace: string =
        `
number one
number two
number three
number four
number five`;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({ element: textArea, listTags: { 'OL': '1., 2., 3.'} });
            textArea.value = innerValue;
            textArea.focus();
        });

        it(' apply to single line  ', () => {
            editorObj.markdownSelection.save(0, 2);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Lists", 'OL', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('^(1. )', 'gim').test(line)).toBe(true);
        });
        it('  apply to multi line   ', () => {
            editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^('+ (i + 1) + '. )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it('  apply to multi line with already applied OL ', () => {
            editorObj.markdownSelection.save(6, textArea.value.length);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; i < lines.length; i++) {
                expect(new RegExp('^(' + (i + 1) + '. ' + (i + 1) + '. )', 'gim').test(lines[i])).toBe(false);
            }
        });
        it('  apply OL to UL ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.execCommand("Lists", 'UL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(- )', 'gim').test(lines[i])).toBe(true);
            }
            editorObj.execCommand("Lists", 'OL', null);
            lines = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^('+ (i + 1) + '. )', 'gim').test(lines[i])).toBe(true);
            }
        });

        it('  apply OL with first lines as empty', () => {
            textArea.value = emptySpace;
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^('+ (i + 1) + '. )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            detach(textArea);
        });
    });

    describe(' OL enter and tab, shift+tab key testing when list tag as 1., 2., 3.,', () => {
        let innerValue: string =
        `one
two
three
four
five`;
let nestedValue: string =
        `1. one
\t1. two
\t\t1. three
4. four
5. five`;
let shiftnestedValue: string =
        `1. one
\t1. two
2. three`;

let enterTestValue: string =
        `1. one`;

let enterTestValueMultiLine: string =
`1. one


Line with more than one break line before`;

let enterMultiValue: string =
`1. one para`
        let editorObj: MarkdownParser;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 9 } };
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({ element: textArea, listTags: { 'OL': '1., 2., 3.'} });
            textArea.value = innerValue;
            textArea.focus();
        });

        it(' tab key navigation from second line  ', () => {
            editorObj.markdownSelection.save(0, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Lists", 'OL', null);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let lines: string[] = editorObj.markdownSelection.getAllParents(textArea.value);
            for (let i: number = 0; lines[i] !== '' && i < lines.length; i++) {
                expect(new RegExp('^(\t)', 'gim').test(lines[i])).toBe(false);
            }
            let line: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line.length + 3, line.length + 5);
            editorObj.markdownSelection.restore(textArea);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
            expect(new RegExp('^(1. )', 'gim').test(line.trim())).toBe(true);
        });
        it(' enter key navigation from nested line  ', () => {
            let textArea: HTMLTextAreaElement = (editorObj.element as HTMLTextAreaElement);
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let line2: string = editorObj.markdownSelection.getLine(textArea, 1);
            let length: number = line1.length + line2.length
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length + 2, length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 2);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
            expect(new RegExp('^(2.)', 'gim').test(line.trim())).toBe(true);
        });
        it(' shift+tab key navigation from nested line  ', () => {
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            editorObj.markdownSelection.save(line1.length + 2, line1.length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            let prevSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let curSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            expect(prevSpace.length > curSpace.length).toBe(true);
            keyBoardEvent.event.shiftKey = false;
        });
        it(' tab key navigation in nested list  ', () => {
            textArea.value = nestedValue;            
            let line: string = editorObj.markdownSelection.getLine(textArea, 3);
            editorObj.markdownSelection.save(line.length + 20, line.length + 23);
            editorObj.markdownSelection.restore(textArea);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            line = editorObj.markdownSelection.getLine(textArea, 3);
            expect(new RegExp('^(\t)', 'gim').test(line)).toBe(true);
            expect(new RegExp('^(2. )', 'gim').test(line.trim())).toBe(true);
        });
        it(' shift+tab key navigation from nested line  ', () => {
            textArea.value = shiftnestedValue;
            let line1: string = editorObj.markdownSelection.getLine(textArea, 1);
            editorObj.markdownSelection.save(line1.length + 2, line1.length + 2);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            let prevSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let curSpace: string = (editorObj.listObj as any).getTabSpace(editorObj.markdownSelection.getLine(textArea, 1));
            expect(prevSpace.length > curSpace.length).toBe(true);
            keyBoardEvent.event.shiftKey = false;
        });
        it(' enter key navigation ', () => {
            textArea.value = enterTestValue;
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let length: number = line1.length;
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length + 1, length + 1);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(2.)', 'gim').test(line.trim())).toBe(true);
        });
        it(' enter key navigation in the middle of the list', () => {
            textArea.value = enterMultiValue;
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let length: number = line1.length;
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length - 4, length - 4);
            editorObj.markdownSelection.restore(textArea);
            textArea.value = textArea.value.substr(0, length - 4) + '\n' + textArea.value.substring(length - 4, textArea.value.length)
            let line2: string = editorObj.markdownSelection.getLine(textArea, 0);
            let length2: number = line2.length;
            editorObj.markdownSelection.save(length + 1, length + 1);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(2.)', 'gim').test(line.trim())).toBe(true);
            expect(line === '2. para').toBe(true);
        });
        it(' enter key navigation with text having more than two break line', () => {
            textArea.value = enterTestValueMultiLine;
            let line1: string = editorObj.markdownSelection.getLine(textArea, 0);
            let length: number = line1.length;
            textArea.value = textArea.value.substr(0, length + 1) + '\n' + textArea.value.substring(length + 1, textArea.value.length)
            editorObj.markdownSelection.save(length + 1, length + 1);
            editorObj.markdownSelection.restore(textArea);
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyUp(keyBoardEvent);
            let line = editorObj.markdownSelection.getLine(textArea, 1);
            expect(new RegExp('^(2.)', 'gim').test(line.trim())).toBe(true);
            let expectTextAreaValue: string = `1. one
2. 


Line with more than one break line before
`;
            expect(textArea.value === expectTextAreaValue).toBe(true);
        });
        
        afterAll(() => {
            detach(textArea);
        });
    });
    describe('938234 - MAC: The Revert operation fails after pressing Enter on an empty list.', () => {
        let editorObj: MarkdownParser;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({ element: textArea });
            textArea.value = '1. RichTextEditor\n2. \n';
            textArea.focus();
        });
        it('should maintain the empty list item when Enter is pressed', (done) => {
            editorObj.markdownSelection.setSelection(textArea,textArea.value.length,textArea.value.length);
            editorObj.markdownSelection.save(textArea.value.length, textArea.value.length);
            editorObj.markdownSelection.restore(textArea);
            (editorObj as any).editorKeyUp(keyBoardEvent);
            expect(textArea.value === '1. RichTextEditor\n2. \n').toBe(true);
            done();
        });
        afterAll(() => {
            detach(textArea);
        });
    });
});