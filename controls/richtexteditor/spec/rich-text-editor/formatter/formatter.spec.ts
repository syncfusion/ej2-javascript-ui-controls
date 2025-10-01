/**
 * RTE Formatter spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { ActionBeginEventArgs } from "../../../src/common/interface";
import { MarkdownFormatter } from '../../../src/rich-text-editor/formatter/markdown-formatter';
import { renderRTE, destroy, setCursorPoint } from './../render.spec';
import { NodeSelection } from "../../../src/selection/selection";

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

    describe('Undo/Redo - Shift + Tab Key Handling', () => {
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let keyboardEventArgs: any = {
            preventDefault: () => { },
            stopPropagation: () => { },
            key: 'Tab',
            code: 'Tab',
            keyCode: 9,
            shiftKey: true,
            ctrlKey: false,
            altKey: false,
            action: 'shift-tab'
        };

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                }
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('should not enable Undo when Shift + Tab is pressed inside a paragraph', () => {
            editNode.innerHTML = '<p id="testPara">Test content</p>';
            const paragraph = editNode.querySelector('#testPara') as HTMLElement;
            paragraph.focus();
            rteObj.formatter.onKeyHandler(rteObj, keyboardEventArgs);
            const undoStatus = rteObj.formatter.editorManager.undoRedoManager.getUndoStatus();
            expect(undoStatus.undo).toBe(false);
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
    describe('Styles Applied Despite maxLength Restriction if all contents gets selected inside RTE ', () => {
        let rteObj: RichTextEditor;
        let innerHTML: `<p>RichTextEditor</p>`;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold'],
                },
                value: innerHTML,
                maxLength: 5
            });
            done();
        });
        afterAll((done: Function) => {
            rteObj.destroy();
            done();
        });
        it('Styles Applied Despite maxLength Restriction', (done: Function) => {
            rteObj.focusIn();
            let paragraph: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            const textNode = paragraph.firstChild;
            const length = textNode.textContent.length;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textNode, textNode, 0, length);
            let bold: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            bold.click();
            setTimeout(() => {
                expect((paragraph as HTMLInputElement).value).not.toBe('<p><strong>RichTextEditor</strong></p>');
            }, 100);
            done();
        });
    });
	    describe('Undo behavior with maxLength restriction', () => {
        let rteObj: RichTextEditor;
        let backSpaceEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let undoEvent = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 22,
            keyCode: 22,
            which: 22,
            code: 22,
            action: ''
        };
        
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ol><li id="firstli">list1</li><li>list2</li><li>list3</li><li id="lastli">list4</li></ol>',
                maxLength: 5,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                }
            });
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('should allow Undo to restore deleted character even when content exceeds maxLength)', (done: DoneFn) => {
            let startNode: any = (rteObj as any).inputElement.querySelector('#firstli');
            let endNode: any = (rteObj as any).inputElement.querySelector('#lastli');
            let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 5);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            backSpaceEvent.keyCode = 8;
            backSpaceEvent.code = 'Backspace';
            (rteObj as any).keyDown(backSpaceEvent);
            rteObj.formatter.saveData();
            setTimeout(() => {
                expect((rteObj as any).inputElement.querySelectorAll('ol').length).toBe(0);
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyUp({ event: undoEvent });
                (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Undo', null);
                expect((rteObj as any).inputElement.querySelector('#firstli')).not.toBeNull();
                done();
            }, 500);
        });
    });
});