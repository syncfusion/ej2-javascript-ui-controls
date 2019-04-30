/**
 * Markdown renderer spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE } from './../render.spec';
import { MarkdownFormatter } from '../../../src/rich-text-editor/formatter/markdown-formatter';
import { ActionBeginEventArgs } from '../../../src';
import { MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

describe('Formatter module', () => {

    describe('Markdown mode testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let curDocument: Document;
        let mouseEventArgs: { [key: string]: HTMLElement };
        let editNode: HTMLTextAreaElement;
        let rteEle: Element;
        let innerValue: string =
            `Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'Formats', '|', 'OrderedList', 'UnorderedList']
                },
                editorMode: 'Markdown',
                formatter: new MarkdownFormatter({
                    listTags: { 'OL': '2. ', 'UL': '* ' }, formatTags: {
                        'h1': '* ',
                        'h2': '@@ ',
                        'h3': '+++ ',
                        'h4': '>>>> ',
                        'h5': '~~~~~ ',
                        'h6': ')))))) ',
                        'blockquote': '> ',
                        'pre': '```\n',
                        'p': ''
                    }
                })
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.value = innerValue;
        });
        it("Formats - H1", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(' + rteObj.formatter.editorManager.markdownSelection.replaceSpecialChar('* ') + ')', 'gim').test(line)).toBe(true);
        });
        it("Formats - h2", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(' + rteObj.formatter.editorManager.markdownSelection.replaceSpecialChar('@@ ') + ')', 'gim').test(line)).toBe(true);
        });
        it("Formats - h3", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(' + rteObj.formatter.editorManager.markdownSelection.replaceSpecialChar('+++ ') + ')', 'gim').test(line)).toBe(true);
        });
        it("Formats - h4", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(' + rteObj.formatter.editorManager.markdownSelection.replaceSpecialChar('>>>> ') + ')', 'gim').test(line)).toBe(true);
        });

        it("Lists - OL", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);

            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            (trgEle.childNodes[0] as HTMLElement).click();
            let lines: string[] = rteObj.formatter.editorManager.markdownSelection.getAllParents(editNode.value);
            for (let i: number = 0; lines[i!] == '' && i < lines.length; i++) {
                expect(new RegExp('^(2. )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it("Lists - UL", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[4];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            (trgEle.childNodes[0] as HTMLElement).click();
            let lines: string[] = rteObj.formatter.editorManager.markdownSelection.getAllParents(editNode.value);
            for (let i: number = 0; lines[i!] == '' && i < lines.length; i++) {
                expect(new RegExp('^(\\* )', 'gim').test(lines[i])).toBe(true);
            }
        });
        afterAll(() => {
            rteObj.destroy();
            detach(elem);
        });
    });

    describe('Markdown mode actionBegin event', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let curDocument: Document;
        let mouseEventArgs: { [key: string]: HTMLElement };
        let keyBoardEvent: any = { preventDefault: function () { }, key: 'A', stopPropagation: function () { }, shiftKey: false, which: 8 };
        let editNode: HTMLTextAreaElement;
        let rteEle: Element;
        let innerValue: string =
            `Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

        let listValue: string =
            `- Lists are a piece of cake
- They even auto continue as you type
- A double enter will end them
- Tabs and shift-tabs work too`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'Formats', '|', 'OrderedList', 'UnorderedList']
                },
                editorMode: 'Markdown',
                actionBegin: (e: ActionBeginEventArgs) => {
                    e.cancel = true;
                },
                formatter: new MarkdownFormatter({
                    listTags: { 'OL': '2. ', 'UL': '* ' }, formatTags: {
                        'h1': '* ',
                        'h2': '@@ ',
                        'h3': '+++ ',
                        'h4': '>>>> ',
                        'h5': '~~~~~ ',
                        'h6': ')))))) ',
                        'blockquote': '> ',
                        'pre': '```\n',
                        'p': ''
                    }
                })
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.value = innerValue;
        });
        it("Formats - H1 => Prevent the format", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(' + rteObj.formatter.editorManager.markdownSelection.replaceSpecialChar('* ') + ')', 'gim').test(line)).toBe(false);
        });

        it('prevent the tab key navigation in list', function () {
            editNode.value = listValue;
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[1].start as number, parents[1].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            parents = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            expect((parents[0].text as string).split('\t').length == 1).toBe(true);
        });

        afterAll(() => {
            rteObj.destroy();
            detach(elem);
        });
    });

});