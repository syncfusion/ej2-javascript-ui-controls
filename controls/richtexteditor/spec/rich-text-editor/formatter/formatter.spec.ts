/**
 * RTE Formatter spec
 */
import { RichTextEditor, ActionBeginEventArgs } from "../../../src/rich-text-editor/index";
import { MarkdownFormatter } from '../../../src/rich-text-editor/formatter/markdown-formatter';
import { renderRTE, destroy, setCursorPoint } from './../render.spec';

describe('Formatter module', () => {

    describe('Markdown mode testing', () => {
        let rteObj: RichTextEditor;
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
                format: {
                    types: [
                        { text: 'Paragraph', value: 'P' },
                        { text: 'Code', value: 'Pre'},
                        { text: 'Quotation', value: 'BlockQuote'},
                        { text: 'Heading 1', value: 'H1' },
                        { text: 'Heading 2', value: 'H2' },
                        { text: 'Heading 3', value: 'H3' },
                        { text: 'Heading 4', value: 'H4' }
                    ]
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
            destroy(rteObj);
        });
    });

    describe('Markdown mode actionBegin event', () => {
        let rteObj: RichTextEditor;
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
            destroy(rteObj);
        });
    });
    describe('861633 - Table is created at the top instead of pointed place when using keyboard shortcut (Ctrl+Shift+E) ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let innerHTML: string = `<p class="focusNode">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
        <p><b>Toolbar</b></p>
        <ol>
            <li>
                <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
            </li>
            <li>
                <p>The Toolbar is fully customizable </p>
            </li>
        </ol>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Test - Check that the inserted table is in the current cursor position.', () => {
            rteObj.focusIn();
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 5);
            node.focus();
            const keyEvent = new KeyboardEvent("keydown", {
                key: "E",
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true,
                code: "KeyE",
                charCode: 0,
                keyCode: 69,
                which: 69
            } as EventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(keyEvent);
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            let focusNode: Element = (rteObj as any).inputElement.querySelector(".focusNode").nextSibling as Element;
            expect(focusNode.classList.contains('e-rte-table')).toBe(true);
        });
    });
});