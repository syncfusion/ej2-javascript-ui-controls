/**
 * MarkdownSelection plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownSelection, MarkdownParser } from '../../../src/markdown-parser/index';


describe('Markdown - MarkdownSelection plugin', () => {
    let innerValue: string =
        `# Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    describe(' Public methods testing', () => {
        let editorObj: MarkdownSelection;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownSelection();
            textArea.value = innerValue;
            textArea.focus();
        });

        it(' getLineNumber - method ', () => {
            let line: number = editorObj.getLineNumber(textArea, 2);
            expect(line === 1).toBe(true);
        });
        it(' getSelectedText - method ', () => {
            editorObj.save(0, 7);
            editorObj.restore(textArea);
            let line: string = editorObj.getSelectedText(textArea);
            expect(line === '# Lists').toBe(true);
        });
        it(' getAllParents - method ', () => {
            editorObj.save(0, textArea.value.length);
            editorObj.restore(textArea);
            let lines: string[] = editorObj.getAllParents(textArea.value);
            expect(lines.length === 4).toBe(true);
        });

        it(' getSelectedLine - method ', () => {
            editorObj.save(0, 7);
            editorObj.restore(textArea);
            let lines: string = editorObj.getSelectedLine(textArea);
            expect(lines === '# Lists are a piece of cake').toBe(true);
        });

        it(' getLine - method ', () => {
            let lines: string = editorObj.getLine(textArea, 1);
            expect(lines === 'They even auto continue as you type').toBe(true);
        });

        it(' getSelectedParentPoints - method ', () => {
            editorObj.save(0, textArea.value.length);
            editorObj.restore(textArea);
            let lines: { [key: string]: string | number }[] = editorObj.getSelectedParentPoints(textArea);
            expect(lines.length === 4).toBe(true);
        });

        afterAll(() => {
            detach(textArea);
        });
    });

});