/**
 * Content renderer spec
 */
import { detach } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, NodeSelection } from './../../../src/index';
import { QuickToolbar, Link, Image, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);

import { renderRTE, destroy } from "./../render.spec";

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
describe('HTML - Parent based selection', () => {
    let css: string = ".e-justify-left.e-icons::before { content: 'Alignments';} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: '' };

    let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

<p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

<p class='second-p-node'><label class='second-label'>label node</label></p>
<p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
<ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;
    describe(' Toolbar click action ', () => {
        let rteObj: RichTextEditor;
        let curDocument: Document;
        let mouseEventArgs: { [key: string]: HTMLElement };
        let editNode: Element;
        let nodeSelection: NodeSelection = new NodeSelection();
        let action: boolean = false;
        describe(' RTE with Content editable DIV ', () => {
            let rteEle: Element;
            let selectNode: Element;
            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                            'FontName']
                    },
                    value: innerHTMLStr,
                    actionComplete: (): void => {
                        action = true;
                    }
                });
                rteEle = rteObj.element;
                editNode = rteObj.contentModule.getEditPanel();
                curDocument = rteObj.contentModule.getDocument();
            });
            it("Font Name click", () => {
                let nodeselection: NodeSelection = new NodeSelection();
                selectNode = editNode.querySelector('.third-p-node');
                nodeselection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 3);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.fontNameDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.third-p-node');
                expect(selectNode.childNodes[0].nodeName.toLowerCase()).toBe('span');
            });
            it("Formats - P", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'p').toBe(true);
            });
            it("Formats - pre", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
            });
            it("Formats - P with selection", () => {
                action = false;
                selectNode = editNode.querySelector('.first-p-node');
                nodeSelection.setSelectionContents(document, selectNode);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.nodeName.toLowerCase() === 'p').toBe(true);
                expect(action).toBe(true);
            });
            it("Formats - blockquote", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'blockquote').toBe(true);
            });
            it("Formats - h1", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h1').toBe(true);
            });
            it("Formats - h2", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h2').toBe(true);
            });
            it("Formats - h3", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h3').toBe(true);
            });
            it("Formats - h4", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h4').toBe(true);
            });

            it("Alignments - JustifyLeft", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'left')
            });
            it("Alignments - JustifyCenter", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'center')
            });
            it("Alignments - JustifyRight", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'right')
            });
            it("Alignments - JustifyFull", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'justify').toBe(true);
            });

            it("Lists - OL", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[5];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName === 'OL').toBe(true);
            });
            it("Lists - UL", () => {
                selectNode = editNode.querySelector('.second-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.second-p-node');
                expect(selectNode.tagName === 'UL').toBe(true);
            });

            it(' tab key navigation from second li start point', () => {
                selectNode = editNode.querySelector('.ul-third-node');
                expect(selectNode.querySelector('ul')).toBeNull();
                setCursorPoint(curDocument, selectNode.childNodes[2] as Element, 0);
                (rteObj as any).keyDown(keyBoardEvent);
                expect(selectNode.querySelector('ul')).not.toBeNull();
            });

            it("Indents - Indent", () => {
                selectNode = editNode.querySelector('.third-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[8];
                (trgEle.childNodes[0] as HTMLElement).click();
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.third-p-node');
                expect((selectNode as HTMLElement).style.marginLeft === '40px').toBe(true);
            });
            it("Indents - Outdent", () => {
                selectNode = editNode.querySelector('.third-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[9];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.third-p-node');
                expect((selectNode as HTMLElement).style.marginLeft === '20px').toBe(true);
            });
            afterAll(() => {
                destroy(rteObj);
                detach(rteEle);
            });
        });
        describe(' RTE with Iframe content ', () => {
            let rteEle: Element;
            let selectNode: Element;
            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent']
                    }, iframeSettings: {
                        enable: true
                    },
                    value: innerHTMLStr
                });
                rteEle = rteObj.element;
                editNode = rteObj.contentModule.getEditPanel();
                curDocument = rteObj.contentModule.getDocument();
            });
            it("Formats - P", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'p').toBe(true);
            });
            it("Formats - pre", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
            });
            it("Formats - blockquote", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'blockquote').toBe(true);
            });
            it("Formats - h1", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h1').toBe(true);
            });
            it("Formats - h2", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h2').toBe(true);
            });
            it("Formats - h3", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h3').toBe(true);
            });
            it("Formats - h4", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName.toLowerCase() === 'h4').toBe(true);
            });

            it("Alignments - JustifyLeft", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'left')
            });
            it("Alignments - JustifyCenter", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'center')
            });
            it("Alignments - JustifyRight", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'right')
            });
            it("Alignments - JustifyFull", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                selectNode = editNode.querySelector('.first-p-node');
                expect((selectNode as HTMLElement).style.textAlign === 'justify').toBe(true);
            });

            it("Lists - OL", () => {
                selectNode = editNode.querySelector('.first-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[5];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.first-p-node');
                expect(selectNode.tagName === 'OL').toBe(true);
            });
            it("Lists - UL", () => {
                selectNode = editNode.querySelector('.second-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.second-p-node');
                expect(selectNode.tagName === 'UL').toBe(true);
            });

            it("Indents - Indent", () => {
                selectNode = editNode.querySelector('.third-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[8];
                (trgEle.childNodes[0] as HTMLElement).click();
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.third-p-node');
                expect((selectNode as HTMLElement).style.marginLeft === '40px').toBe(true);
            });
            it("Indents - Outdent", () => {
                selectNode = editNode.querySelector('.third-p-node');
                setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[9];
                (trgEle.childNodes[0] as HTMLElement).click();
                selectNode = editNode.querySelector('.third-p-node');
                expect((selectNode as HTMLElement).style.marginLeft === '20px').toBe(true);
            });
            afterAll(() => {
                destroy(rteObj);
                detach(rteEle);
            });
        });
    });
});

describe(' Markdown editor ', () => {
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let mouseEventArgs: { [key: string]: HTMLElement };
    let editNode: HTMLTextAreaElement;
    let rteEle: Element;
    let innerValue: string =
        `# Lists are a piece of cake
They even auto continue as you type
A double enter will end them
Tabs and shift-tabs work too`;

    describe(' Formats ', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'Formats', '|', 'OrderedList', 'UnorderedList']
                },
                editorMode: 'Markdown'
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.value = innerValue;
        });
        it("Formats - P", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(#)|^(>)', 'gim').test(line)).toBe(false);
        });
        it("Formats - pre", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.split('\n')[0].length + 4);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let lineNumber: number = rteObj.formatter.editorManager.markdownSelection.getLineNumber(editNode, 2);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            let prev: string = rteObj.formatter.editorManager.markdownSelection.getLine(editNode, lineNumber - 1);
            let next: string = rteObj.formatter.editorManager.markdownSelection.getLine(editNode, lineNumber + 2);
            expect(new RegExp('^(```)', 'gim').test(prev)).toBe(true);
            expect(new RegExp('^(```)', 'gim').test(next)).toBe(true);
        });
        it("Formats - blockquote", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            let line: string = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(> )', 'gim').test(line)).toBe(true);
        });
        it("Formats - h1", () => {
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
            expect(new RegExp('^(# )', 'gim').test(line)).toBe(true);
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
            expect(new RegExp('^(## )', 'gim').test(line)).toBe(true);
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
            expect(new RegExp('^(### )', 'gim').test(line)).toBe(true);
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
            expect(new RegExp('^(#### )', 'gim').test(line)).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(rteEle);
        });
    });
    describe(' Lists ', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'Formats', '|', 'OrderedList', 'UnorderedList', 'Image', 'CreateLink']
                },
                editorMode: 'Markdown'
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.value = innerValue;
            curDocument = rteObj.contentModule.getDocument();
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
                expect(new RegExp('^(' + (i + 1) + '. )', 'gim').test(lines[i])).toBe(true);
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
                expect(new RegExp('^(- )', 'gim').test(lines[i])).toBe(true);
            }
        });
        it('link and image', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[5];
            (trgEle.childNodes[0] as HTMLElement).click();
            let trgElet: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
            (trgElet.childNodes[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
        })
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });

    describe(' EJ2-14543 - HTMLEditor: ActionBegin and ActionComplete events ', () => {
        let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

        <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
        
        <p class='second-p-node'><label class='second-label'>label node</label></p>
        <p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
        <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;
        let actionBegin: boolean = false;
        let actionComplete: boolean = false;
        let controlId: string;
        let selectNode: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste']
                },
                value: innerHTMLStr,
                actionBegin: () => {
                    actionBegin = true;
                },
                actionComplete: () => {
                    actionComplete = true;

                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            curDocument = rteObj.contentModule.getDocument();
        });
        it(" Click the cut action", () => {
            let nodeSelection: NodeSelection = new NodeSelection();
            selectNode = editNode.querySelector('.third-p-node');
            nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 6);
            document.getElementById(controlId + "_toolbar_Cut").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });

        it(" Click the copy action", () => {
            let nodeSelection: NodeSelection = new NodeSelection();
            selectNode = editNode.querySelector('.third-p-node');
            nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 6);
            document.getElementById(controlId + "_toolbar_Copy").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });
        it(" Click the paste action", () => {
            let nodeSelection: NodeSelection = new NodeSelection();
            selectNode = editNode.querySelector('.third-p-node');
            nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 6);
            document.getElementById(controlId + "_toolbar_Paste").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });

        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });

    describe(' EJ2-14543 - MarkdownEditor: ActionBegin and ActionComplete events ', () => {
        let actionBegin: boolean = false;
        let actionComplete: boolean = false;
        let controlId: string;
        let selectNode: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste']
                },
                value: innerValue,
                editorMode: 'Markdown',
                actionBegin: () => {
                    actionBegin = true;
                },
                actionComplete: () => {
                    actionComplete = true;

                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            curDocument = rteObj.contentModule.getDocument();
        });
        it(" Click the cut action", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            document.getElementById(controlId + "_toolbar_Cut").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });

        it(" Click the copy action", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            document.getElementById(controlId + "_toolbar_Copy").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });
        it(" Click the paste action", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            document.getElementById(controlId + "_toolbar_Paste").click();
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
        });

        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });
});