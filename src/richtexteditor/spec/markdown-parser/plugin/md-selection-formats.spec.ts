/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownSelection, MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - selection command plugin', () => {
    let innerValue: string =
        `Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    describe(' style testing', () => {
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

        it(' apply to bold testing  ', () => {
            editorObj.markdownSelection.save(0, 5);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Style", 'Bold', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\\*\\* )', 'gim').test(line)).toBe(true);
            editorObj.markdownSelection.save(0, 10);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Style", 'Bold', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(line.indexOf('**') === 0).toBe(true);
            editorObj.execCommand("Style", 'Bold', null, () => {
                isCallBack = true;
            });
            expect(new RegExp('(\\*\\* )', 'gim').test(line)).not.toBe(true);
            editorObj.execCommand("Style", 'Bold', null, () => {
                isCallBack = true;
            });
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('Bold');
            expect(cmd).toBe(true);
        });
        it(' apply to italic testing  ', () => {
            editorObj.markdownSelection.save(13, 17);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\\* )', 'gim').test(line)).toBe(true);
            editorObj.markdownSelection.save(12, 19);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(line.indexOf('*', textArea.selectionStart - 1) === textArea.selectionStart - 1).toBe(true);
            editorObj.execCommand("Style", 'Italic', null);
            expect(line.indexOf('*', textArea.selectionStart - 1) !== textArea.selectionStart - 1).toBe(true);
            editorObj.execCommand("Style", 'Italic', null);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('Italic');
            expect(cmd).toBe(true);
        });
        it(' apply to StrikeThrough testing  ', () => {
            editorObj.markdownSelection.save(25, 30);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Style", 'StrikeThrough', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\\~~)', 'g').test(line)).toBe(true);
            editorObj.markdownSelection.save(27, 27);
            editorObj.markdownSelection.restore(textArea);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('StrikeThrough');
            expect(cmd).toBe(true);
            editorObj.markdownSelection.save(22, 35);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Style", 'StrikeThrough', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect((line as any).includes('~~')).toBe(true);
        });
        it(' apply to subscript testing  ', () => {
            editorObj.markdownSelection.save(37, 45);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Effects", 'SubScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\\<sub>)', 'g').test(line)).toBe(true);
            editorObj.markdownSelection.save(49, 49);
            editorObj.markdownSelection.restore(textArea);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('SubScript');
            expect(cmd).toBe(true);
            editorObj.markdownSelection.save(36, 60);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Effects", 'SubScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect((line as any).includes('<sub>')).toBe(true);
            editorObj.execCommand("Effects", 'SubScript', null, () => {
                isCallBack = true;
            });
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect((line as any).includes('<sub>')).toBe(true);
            editorObj.execCommand("Effects", 'SubScript', null, () => {
                isCallBack = true;
            });
        });
        it(' apply to superscript testing  ', () => {
            editorObj.markdownSelection.save(70, 80);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Effects", 'SuperScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\\<sup>)', 'g').test(line)).toBe(true);
            editorObj.markdownSelection.save(75, 75);
            editorObj.markdownSelection.restore(textArea);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('SuperScript');
            expect(cmd).toBe(true);
            editorObj.markdownSelection.save(70, 95);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Effects", 'SuperScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect((line as any).includes('<sup>')).toBe(true);
        });
        it(' apply to casing testing  ', () => {
            editorObj.markdownSelection.save(122, 125);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Casing", 'UpperCase', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: any = editorObj.markdownSelection.getSelectedInlinePoints(textArea);
            expect(new RegExp('^[A-Z]*$', 'g').test(line.text)).toBe(true);
            editorObj.markdownSelection.save(123, 123);
            editorObj.markdownSelection.restore(textArea);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('UpperCase');
            expect(cmd).toBe(true);
            editorObj.markdownSelection.save(122, 125);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Casing", 'LowerCase', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedInlinePoints(textArea);
            expect(new RegExp('^[a-z]*$', 'g').test(line.text)).toBe(true);
            editorObj.markdownSelection.save(200, 200);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Casing", 'UpperCase', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            line = editorObj.markdownSelection.getSelectedInlinePoints(textArea);
            expect(line.text === '').toBe(true);
        });
        it(' apply to code block testing  ', () => {
            editorObj.markdownSelection.save(140, 150);
            editorObj.markdownSelection.restore(textArea);
            (<any>editorObj).mdSelectionFormats.applyCommands({ subCommand: 'InlineCode', callBack: function () { } });
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\`)', 'gim').test(line)).toBe(true);
            editorObj.markdownSelection.save(155, 165);
            editorObj.markdownSelection.restore(textArea);
            (<any>editorObj).mdSelectionFormats.applyCommands({ subCommand: 'InlineCode', callBack: function () { } });
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\`)', 'gim').test(line)).toBe(true);
        });
        afterAll(() => {
            detach(textArea);
        });
    });
    describe(' style testing', () => {
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

        it(' apply all command combination testing  ', () => {
            editorObj.markdownSelection.save(3, 7);
            editorObj.markdownSelection.restore(textArea);
            let isCallBack: boolean = false;
            editorObj.execCommand("Style", 'StrikeThrough', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            let line: string = editorObj.markdownSelection.getSelectedLine(textArea);
            editorObj.markdownSelection.save(6, 6);
            editorObj.markdownSelection.restore(textArea);
            let cmd = editorObj.mdSelectionFormats.isAppliedCommand('StrikeThrough');
            expect(cmd).toBe(true);
            editorObj.markdownSelection.save(12, 18);
            editorObj.markdownSelection.restore(textArea);
            (<any>editorObj).mdSelectionFormats.applyCommands({ subCommand: 'InlineCode', callBack: function () { } });
            line = editorObj.markdownSelection.getSelectedLine(textArea);
            expect(new RegExp('(\`)', 'gim').test(line)).toBe(true);
            editorObj.markdownSelection.save(17, 17);
            editorObj.markdownSelection.restore(textArea);
            editorObj.mdSelectionFormats.isAppliedCommand('InlineCode');
            editorObj.markdownSelection.save(27, 32);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Effects", 'SuperScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            editorObj.markdownSelection.save(33, 33);
            editorObj.markdownSelection.restore(textArea);
            editorObj.markdownSelection.save(45, 55);
            editorObj.markdownSelection.restore(textArea);
            isCallBack = false;
            editorObj.execCommand("Effects", 'SubScript', null, () => {
                isCallBack = true;
            });
            expect(isCallBack).toBe(true);
            editorObj.markdownSelection.save(52, 52);
            editorObj.markdownSelection.restore(textArea);
            editorObj.markdownSelection.save(80, 90);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Bold', null, function () { isCallBack = true; });
            editorObj.markdownSelection.save(75, 96);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null, function () { isCallBack = true; });
            editorObj.markdownSelection.save(120, 130);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null, function () { isCallBack = true; });
            editorObj.execCommand("Style", 'Italic', null, function () { isCallBack = true; });
            editorObj.markdownSelection.save(115, 145);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Bold', null, function () { isCallBack = true; });
            editorObj.markdownSelection.save(110, 150);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null, function () { isCallBack = true; });
            expect(isCallBack).toBe(true);
            editorObj.markdownSelection.save(105, 160);
            editorObj.markdownSelection.restore(textArea);
            editorObj.execCommand("Style", 'Italic', null, function () { isCallBack = true; });
            expect(isCallBack).toBe(true);
        });
        afterAll(() => {
            detach(textArea);
        });
    });
});