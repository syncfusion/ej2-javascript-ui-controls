/**
 * Toolbar action spec
 */
import { RichTextEditor, NodeSelection } from './../../../src/index';
import { MarkdownFormatter } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../render.spec";

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

describe('Toolbar actions ', () => {
    describe('HTML - Parent based selection', () => {
        let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);

        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: '' };

        let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
    <p id='convertPre'>converted to pre<p><p id='revertPre'>converted to pre<p>`;

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
                                'FontName', '|', 'InsertCode']
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
                        value: innerHTMLStr,
                        placeholder : 'Syncfusion RichTextEditor',
                        actionComplete: (): void => {
                            action = true;
                        }
                    });
                    rteEle = rteObj.element;
                    editNode = rteObj.contentModule.getEditPanel();
                    curDocument = rteObj.contentModule.getDocument();
                });
                afterAll(() => {
                    destroy(rteObj);
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
                    //The selection type was changed because the previous code will select the element along with the space content after the element
                    nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[1].childNodes[0], 0, 9);
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
                    expect(selectNode.parentElement.tagName === 'OL').toBe(true);
                });
                it("Lists - UL", () => {
                    selectNode = editNode.querySelector('.second-p-node');
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('.second-p-node');
                    expect(selectNode.parentElement.tagName === 'UL').toBe(true);
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
                it("check-placeholder", function () {
                    rteObj.value='';
                    rteObj.dataBind();
                    expect((document.getElementsByClassName('rte-placeholder')[0] as HTMLElement).classList.contains('enabled')).toBe(true);
                    var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[5];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    expect((document.getElementsByClassName('rte-placeholder')[0] as HTMLElement).classList.contains('enabled')).toBe(false);
                    expect((rteObj.inputElement.firstChild as HTMLElement).tagName).toBe('OL');
                });

                it("Formats - h4 by selecting all content and table at the last", () => {
                    let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id='p1'>Paragraph 1</p><p id='p2'>Paragraph 2</p><p id='p3'>Paragraph 3</p><table><tbody><tr><td>cell 1 1</td><td>cell 1 2</td></tr><tr><td>cell 2 1</td><td id="lastCell">Cell 2 2</td></tr></tbody></table></div>`;
                    rteObj.value = tableContent;
                    rteObj.dataBind();
                    rteObj.selectAll();
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                    mouseEventArgs = {
                        target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
                    };
                    (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                    expect(rteObj.getSelection().trim() === 'Paragraph 1Paragraph 2Paragraph 3cell 1 1cell 1 2cell 2 1Cell 2 2').toBe(true);
                });
                it("Insert Code Format testing", () => {
                    rteObj.value = innerHTMLStr;
                    rteObj.dataBind();
                    selectNode = editNode.querySelector('#convertPre');
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[13];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('#convertPre');
                    expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                });
                it("Revert the pre when Insert Code Format click on pre applied tag testing", () => {
                    rteObj.value = innerHTMLStr;
                    rteObj.dataBind();
                    selectNode = editNode.querySelector('#revertPre');
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[13];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('#revertPre');
                    expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('#revertPre');
                    expect(selectNode.tagName.toLowerCase() === 'p').toBe(true);
                });
                
                it("Formats - blockquote", () => {
                    rteObj.value = innerHTMLStr;
                    rteObj.dataBind();
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
                    expect(selectNode.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
                });
            });
            describe(' RTE with Iframe content ', () => {
                let rteEle: Element;
                let selectNode: Element;
                beforeAll(() => {
                    rteObj = renderRTE({
                        toolbarSettings: {
                            items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|', 'InsertCode']
                        }, iframeSettings: {
                            enable: true
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
                        value: innerHTMLStr
                    });
                    rteEle = rteObj.element;
                    editNode = rteObj.contentModule.getEditPanel();
                    curDocument = rteObj.contentModule.getDocument();
                });
                afterAll(() => {
                    destroy(rteObj);
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
                    expect(selectNode.parentElement.tagName === 'OL').toBe(true);
                });
                it("Lists - UL", () => {
                    selectNode = editNode.querySelector('.second-p-node');
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('.second-p-node');
                    expect(selectNode.parentElement.tagName === 'UL').toBe(true);
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
                it("Insert Code Format testing", () => {
                    rteObj.value = innerHTMLStr;
                    rteObj.dataBind();
                    selectNode = editNode.querySelector('#convertPre');
                    setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                    let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11];
                    (trgEle.childNodes[0] as HTMLElement).click();
                    selectNode = editNode.querySelector('#convertPre');
                    expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                });
                
                it("Formats - blockquote", () => {
                    rteObj.value = innerHTMLStr;
                    rteObj.dataBind();
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
                    expect(selectNode.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
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
                        listTags: { 'OL': '1. ', 'UL': '- ' }, formatTags: {
                            'h1': '# ',
                            'h2': '## ',
                            'h3': '### ',
                            'h4': '#### ',
                            'h5': '##### ',
                            'h6': '###### ',
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
            afterAll(() => {
                destroy(rteObj);
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
            beforeAll((done: DoneFn) => {
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
                done();
            });
            afterAll((done: DoneFn) => {
                destroy(rteObj);
                done();
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
            it(" Click the paste action", (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                selectNode = editNode.querySelector('.third-p-node');
                nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 6);
                document.getElementById(controlId + "_toolbar_Paste").click();
                expect(actionBegin).toBe(true);
                setTimeout(() => {
                    //The actioncomplete won't be triggered unless a data is pasted.
                    expect(actionComplete).toBe(false);
                    actionBegin = false;
                    actionComplete = false;
                    done();
                }, 10);
            });
        });

        describe(' EJ2-14543 - MarkdownEditor: ActionBegin and ActionComplete events ', () => {
            let actionBegin: boolean = false;
            let actionComplete: boolean = false;
            let controlId: string;
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
            afterAll(() => {
                destroy(rteObj);
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
            // it(" Click the paste action", (done) => {
            //     if (rteObj.getInjectedModules()[0].toString().indexOf('PasteCleanup')) {
            //         rteObj.getInjectedModules().shift();
            //     }
            //     rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            //     rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            //     document.getElementById(controlId + "_toolbar_Paste").click();
            //     setTimeout(() => {
            //         expect(actionBegin).toBe(true);
            //         expect(actionComplete).toBe(true);
            //         actionBegin = false;
            //         actionComplete = false;
            //         done();
            //     });
            // });
        });

        describe('RequestType check for FontFamily', () => {
            let rteEle: Element;
            let selectNode: Element;
            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                            'FontName', '|', 'InsertCode']
                    },
                    actionBegin: function (e) {
                        expect(e.requestType).toBe('FontName');
                    },
                    value: "RichTextEditor",
                });
                rteEle = rteObj.element;
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it("Check actionBegin Event args", () => {
                rteObj.inputElement.focus();          
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11];
                (trgEle.childNodes[0] as HTMLElement).click();
                let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                };
                (rteObj.toolbarModule as any).dropDownModule.fontNameDropDown.clickHandler(mouseEventArgs);
            });
        });

        describe('876823 - In IFrame mode, the list dropodown menu(ordered list & unordered list) not closed properly when focus on the editor. ', () => {
            let innerHTMLStr = "<p>First p node-0</p><p>First p node-1</p>\n\n    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>\n\n    <p class='second-p-node'><label class='second-label'>label node</label></p>\n    <p class='third-p-node'>dom node<label class='third-label'>label node</label></p>\n    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>\n    <p id='convertPre'>converted to pre<p><p id='revertPre'>converted to pre<p>";
            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'NumberFormatList', 'BulletFormatList']
                    },
                    value :innerHTMLStr,
                    iframeSettings: {
                        enable: true
                    },
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it("Dropdown hides when you click the focus from the dropdown.", () => {
                (rteObj as any).focusIn();
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                });
                let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1];
                trgEle.childNodes[0].dispatchEvent(mouseDownEvent);
                (trgEle.childNodes[0] as HTMLElement).click();
                (trgEle.childNodes[0] as HTMLElement).setAttribute("aria-expanded", 'true');
                let popupElement = document.querySelectorAll("#" + rteObj.getID() + "_toolbar_NumberFormatList-popup")[0];
                expect(popupElement != undefined ).toBe(true);
                (rteObj as any).inputElement.ownerDocument.dispatchEvent(mouseDownEvent);
                expect(popupElement.classList.contains("e-popup-close")).toBe(true);
            });
        });
    });
    describe('Coverage for the enter key with BR.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName']
                },
                enterKey: "BR",
                value: `wergwerg<br><strong>qwefqwefewq</strong><br><strong id='strong-elem'>s​</strong>`
            });
            done();
        });
        it('Check the first child as a text node when entering a key in the BR configuration to get the node.', (done) => {
            rteObj.focusIn();
            let node = rteObj.inputElement.querySelector("#strong-elem");
            let selection: NodeSelection = new NodeSelection();
            selection.setCursorPoint(document, node, 1);
            let keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 77,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'm',
                charCode: 77,
                which: 77,
                code: 'KeyM',
                action: 'KeyM',
                type: 'keyup'
            };
            (<any>rteObj).keyUp(keyboardEventArgs);
            expect(rteObj.inputElement.firstChild.nodeName === '#text').toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe('879942 - Include the inherited fontsize and font-family dropdown button in Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName']
                },
                value: "<p>Rich Text Editor</p>"
            });
            done();
        });
        it('Check the default toolbar UI', function (done) {
            rteObj.focusIn();
            let fontSize = rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-rte-toolbar .e-toolbar-item")[0].querySelector(".e-rte-dropdown-btn-text").textContent;
            let fontName = rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-rte-toolbar .e-toolbar-item")[1].querySelector(".e-rte-dropdown-btn-text").textContent;
            expect('Font Size' === fontSize).toBe(true);
            expect('Font Name' === fontName).toBe(true);
            done();
        });
        it('Check the preselect when the fontsize dropdown is opened.', function (done) {
            rteObj.focusIn();
            let node = rteObj.inputElement.querySelector("p");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, node.firstChild, node.firstChild, 1, 3);
            let fontSize = rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-rte-toolbar .e-toolbar-item")[0];
            fontSize.querySelector("button").click();
            setTimeout(function () {
                expect(document.querySelectorAll("#" + rteObj.getID() + "_toolbar_FontSize-popup UL LI")[0].classList.contains("e-active")).toBe(true);
                done();
            }, 100)
        });
        it('Check the preselect when the fontname dropdown is opened.', function (done) {
            rteObj.focusIn();
            let node = rteObj.inputElement.querySelector("p");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, node.firstChild, node.firstChild, 1, 3);
            let fontName = rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-rte-toolbar .e-toolbar-item")[1];
            fontName.querySelector("button").click();
            setTimeout(function () {
                expect(document.querySelectorAll("#" + rteObj.getID() + "_toolbar_FontName-popup UL LI")[0].classList.contains("e-active")).toBe(true);
                done();
            }, 100)
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe('879942 - Include the inherited fontsize and font-family dropdown button in Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName']
                },
                value: "<p>Rich Text Editor</p>"
            });
            done();
        });
        it('The fontSize need to be removed when apply the font style as default', function (done) {
            rteObj.focusIn();
            rteObj.value = '<p><span style="font-size: 24pt;">Rich Text Editor</span></p>';
            rteObj.dataBind();
            let node = rteObj.inputElement.querySelector("p");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, node.firstChild.firstChild, node.firstChild.firstChild, 1, 3);
            let fontName = rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-rte-toolbar .e-toolbar-item")[0];
            fontName.querySelector("button").click();
            setTimeout(function () {
                (document.querySelectorAll("#" + rteObj.getID() + "_toolbar_FontSize-popup UL LI")[0] as any).click();
                expect(node.childNodes.length > 1).toBe(true);
                done();
            }, 100)
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
});
