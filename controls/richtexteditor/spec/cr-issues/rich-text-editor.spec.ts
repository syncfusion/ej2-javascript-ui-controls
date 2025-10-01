/**
 * CR-Issues RTE spec
 */
import { createElement, Browser, extend } from '@syncfusion/ej2-base';
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { PasteCleanup } from "../../src/rich-text-editor/index";
import { renderRTE, destroy, dispatchEvent as dispatchEve, setCursorPoint } from './../rich-text-editor/render.spec';
import { NodeSelection } from '../../src/selection/selection';
import { Dialog } from '@syncfusion/ej2-popups';
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT, ESCAPE_KEY_EVENT_INIT } from '../constant.spec';

describe('RTE CR issues ', () => {

    describe('879054: InsertHtml executeCommand not inserts into the cursor position after inserting table in RichTextEditor ', () => {
        const selection: NodeSelection = new NodeSelection();
        let range: Range;
        let customBtn: HTMLElement;
        let dialogCtn: HTMLElement;
        let saveSelection: NodeSelection;
        dialogCtn = document.getElementById('rteSpecial_char');
        let dialogObj: Dialog;
        let rteObj: RichTextEditor;

        const onCreate = () => {
            customBtn = document.getElementById('custom_tbar') as HTMLElement;
            dialogCtn = document.getElementById('rteSpecial_char') as HTMLElement;
            dialogObj.target = document.getElementById('rteSection');
            customBtn.onclick = (e: Event) => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                dialogObj.element.style.display = '';
                range = selection.getRange(document);
                saveSelection = selection.save(range, document);
                dialogObj.show();
            };
        }
        const onInsert = () => {
            const activeEle: Element = dialogObj.element.querySelector(
                '.char_block.e-active'
            );
            if (activeEle) {
                if (rteObj.formatter.getUndoRedoStack().length === 0) {
                    rteObj.formatter.saveData();
                }
                if (Browser.isDevice && Browser.isIos) {
                    saveSelection.restore();
                }
                rteObj.executeCommand('insertHTML', activeEle.textContent);
                rteObj.formatter.saveData();
                rteObj.formatter.enableUndo(rteObj);
            }
            dialogOverlay();
        }
        const dialogOverlay = () => {
            const activeEle: Element = dialogObj.element.querySelector('.char_block.e-active');
            if (activeEle) {
                activeEle.classList.remove('e-active');
            }
            dialogObj.hide();
        }
        const dialogCreate = () => {
            dialogCtn = document.getElementById('rteSpecial_char');
            dialogCtn.onclick = (e: Event) => {
                const target: HTMLElement = e.target as HTMLElement;
                const activeEle: Element = dialogObj.element.querySelector(
                    '.char_block.e-active'
                );
                if (target.classList.contains('char_block')) {
                    target.classList.add('e-active');
                    if (activeEle) {
                        activeEle.classList.remove('e-active');
                    }
                }
            };
        }
        beforeAll(() => {
            let rteSection = createElement('div', { id: 'rteSection' });
            let customRTE = createElement('div', { id: 'customRTE' });
            let rteDialog = createElement('div', { id: 'rteDialog' });
            let rteSpecial_char = createElement('div', { id: 'rteSpecial_char' });
            rteSpecial_char.innerHTML = '<div class="char_block" title="^">^</div>';
            document.body.appendChild(rteSection);
            rteSection.appendChild(customRTE);
            rteSection.appendChild(rteDialog);
            rteDialog.appendChild(rteSpecial_char);

            dialogObj = new Dialog({
                buttons: [
                    {
                        buttonModel: { content: 'Insert', isPrimary: true },
                        click: onInsert
                    },
                    {
                        buttonModel: { content: 'Cancel' },
                        click: dialogOverlay
                    }
                ],
                overlayClick: dialogOverlay,
                header: 'Special Characters',
                visible: false,
                showCloseIcon: false,
                width: '43%',
                cssClass: 'e-rte-elements',
                target: document.getElementById('rteSection'),
                created: dialogCreate,
                isModal: true
            });
            dialogObj.appendTo('#rteDialog');

            rteObj = new RichTextEditor(
                {
                    toolbarSettings: {
                        items: ['CreateTable', {
                            tooltipText: 'Insert Symbol',
                            template:
                                '<button class="e-tbar-btn e-btn e-rte-elements" tabindex="-1" id="custom_tbar"  style="width:100%">' +
                                '<div class="e-tbar-btn-text" style="font-weight: 500;"> Ω</div></button>'
                        }]
                    },
                    created: onCreate,
                    value: `<div style="display:block;">
                            <p style="margin-right:10px">
                                The custom command "insert special character" is configured 
                                as the last item of the toolbar. Click on the command and choose the special character 
                                you want to include from the popup.
                            </p>
                        </div>`,
                }
            );
            rteObj.appendTo('#customRTE');
            if (rteObj.quickToolbarModule) {
                rteObj.quickToolbarModule.debounceTimeout = 0;
            }
        });

        it('insert the special character inside the table', () => {
            rteObj.dataBind();
            let start: Element =(document.querySelector('.e-content').childNodes[0] as HTMLElement).children[0] as Element;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, start.firstChild, 167, 167);
            (document.querySelector('[title="Create Table (Ctrl+Shift+E)"]') as HTMLElement).click();
            (document.querySelector('#customRTE_insertTable')as HTMLElement).click();
            (document.querySelector('.e-insert-table.e-primary')as HTMLElement).click();
            (document.getElementById('custom_tbar') as HTMLElement).click();
            (document.querySelector('[title="^"]') as HTMLElement).click();
            (document.querySelector('.e-rte-elements.e-primary') as HTMLElement).click();
            expect(window.getSelection().getRangeAt(0).startContainer.textContent === '^' ).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = "";
        });
    });
    describe('Bug 964391: Format tag inserted outside the <p> tag after clearing content ', () => {
        let customBtn: HTMLElement;
        let rteObj: RichTextEditor;
        const onCreate = () => {
            customBtn = document.getElementById('custom_tbar') as HTMLElement;
            customBtn.onclick = (e: Event) => {
                rteObj.value = '';
            };
        }
        beforeAll(() => {
            rteObj = renderRTE(
                {
                    toolbarSettings: {
                        items: [{
                            tooltipText: 'Change Text',
                            template:
                                '<button class="e-tbar-btn e-btn e-rte-elements" tabindex="-1" id="custom_tbar"  style="width:100%"> Change Text </button>'
                        }, 'Bold']
                    },
                    created: onCreate,
                    value: `<div style="display:block;">
                            <p style="margin-right:10px">
                                The custom command "insert special character" is configured 
                                as the last item of the toolbar. Click on the command and choose the special character 
                                you want to include from the popup.
                            </p>
                        </div>`,
                }
            );
        });
        it(' Format tag should be inserted within the p tag', () => {
            rteObj.focusIn();
            (document.getElementById('custom_tbar') as HTMLElement).click();
            rteObj.dataBind();
            (document.querySelector('[title="Bold (Ctrl+B)"]') as HTMLElement).click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === `<p><strong>​</strong></p>`).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = "";
        });
    });
    describe('930848: Formatting, Shift+Enter, and zero-width space removal', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs: any;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                value: '<p>testing\u200B</p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline']
                }
            });
            keyboardEventArgs = {
                preventDefault: () => {},
                stopPropagation: () => {},
                altKey: false,
                ctrlKey: false,
                shiftKey: true,
                char: '',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                which: 13,
                code: 'Enter',
                action: 'enter',
                type: 'keydown'
            };
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should remove zero-width spaces, apply formatting, and handle Shift+Enter without errors', (done) => {
            rteObj.focusIn();
            const editPanel = rteObj.contentModule.getEditPanel() as HTMLElement;
            const textNode: Element = editPanel.querySelector('p').firstChild as Element;
            new NodeSelection().setCursorPoint(document, textNode, textNode.textContent.length);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(
                rteObj.contentModule.getDocument(),
                textNode,
                textNode,
                textNode.textContent.length,
                textNode.textContent.length
            );
            const boldButton = rteObj.element.querySelector('[aria-label="Bold (Ctrl+B)"]') as HTMLElement;
            boldButton.click();
            spyOn(console, 'error');
            (<any>rteObj).keyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 16;
            keyboardEventArgs.charCode = 16;
            keyboardEventArgs.which = 16;
            keyboardEventArgs.shiftKey = false;
            (<any>rteObj).keyUp(keyboardEventArgs);
            setTimeout(() => {
                expect(console.error).not.toHaveBeenCalled();
                expect(editPanel.innerHTML).not.toContain('\u200B');
                expect(editPanel.innerHTML).toContain('<strong>');
                expect(editPanel.innerHTML).toContain('<br>');
                expect(rteObj.getRange().startContainer.nodeName.toLowerCase()).toBe('br');
                done();
            }, 100);
        });
    });
    describe('Bug 934842: Bullet/Numbered list font size not formatting consistent with the text', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p class="startNode">list 1</p><p>list 2</p><p class="endNode">list 3</p>',
                toolbarSettings: {
                    items: ['FontSize', 'OrderedList']
                },
                fontSize: {
                    default: "8pt",
                    width: "35px",
                    items: [
                        { text: "8", value: "8pt" },
                        { text: "10", value: "10pt" },
                        { text: "12", value: "12pt" },
                        { text: "14", value: "14pt" },
                        { text: "18", value: "18pt" },
                        { text: "24", value: "24pt" },
                        { text: "36", value: "36pt" }
                    ]
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' li tag should have font size style', () => {
            rteObj.focusIn();
            const editPanel = rteObj.contentModule.getEditPanel() as HTMLElement;
            const startNode: Element = editPanel.querySelector('.startNode').firstChild as Element;
            const endNode: Element = editPanel.querySelector('.endNode').firstChild as Element;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(
                rteObj.contentModule.getDocument(),
                startNode,
                endNode,
                0,
                endNode.textContent.length
            );
            const toolbarElems: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-toolbar-item');
            ((rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            ((document.querySelector('.e-font-size-tbar-btn ul') as HTMLElement).childNodes[5] as HTMLElement).click();
            ((rteObj.element.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).querySelector('button') as HTMLButtonElement).click();
            expect(rteObj.inputElement.innerHTML === '<ol><li class="startNode" style="font-size: 24pt;"><span style="font-size: 24pt;">list 1</span></li><li style="font-size: 24pt;"><span style="font-size: 24pt;">list 2</span></li><li class="endNode" style="font-size: 24pt;"><span style="font-size: 24pt;">list 3</span></li></ol>').toBe(true);        });
    });
    describe("966215 - Maximize Shortcut Does Not Work When Code View Is Enabled", () => {
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><b>Description:</b></p><p class="custom">The Rich Text Editor (RTE) control is an easy to render in client side.</p>`,
                    toolbarSettings: {
                        items: ['FullScreen', 'SourceCode']
                    }
                });
            });
            it("Maximize should work", (done) => {
                rteObj.focusIn();
                let keyboardEventArgs = {
                    preventDefault: function () { },
                    altKey: false,
                    ctrlKey: true,
                    shiftKey: true,
                    char: '',
                    key: 'F',
                    charCode: 0,
                    keyCode: 70,
                    which: 70,
                    code: 'KeyF',
                    action: '',
                    type: 'keydown'
                };
                const toolbarElems:NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-toolbar-item');
                toolbarElems[1].click();
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                textarea.dispatchEvent(new KeyboardEvent('keydown', keyboardEventArgs));
                expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(true);
                const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT);
                textarea.dispatchEvent(escapeKeyDownEvent);
                expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(false);
                done();
            });
            afterAll(() => {
                destroy(rteObj);
            });
        });
    describe('877787 - InsertHtml executeCommand deletes the entire content when we insert html by selection in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value:'testing the rich text editor',
            });
        });
        it('insert html to selection', () => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 12, 16)
            rteObj.executeCommand('insertHTML', '<span>Test</span>');
            expect(rteObj.inputElement.innerHTML === '<p>testing the <span>Test</span> text editor</p>').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Bug 940154: Pressing backspace twice inside a table removes the entire table in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><ul><li>Hi<br></li><li class="startNode">Hello<br></li><li class="endNode">Bye</li></ul></td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>',
            });
        });
        it(' pressing backspace twice in list inside a table , should not remove the entire table', () => {
            const startNode: Element = rteObj.inputElement.querySelector('.startNode').firstChild as Element;
            const endNode: Element = rteObj.inputElement.querySelector('.endNode').firstChild as Element;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, startNode.textContent.length)
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelector('table')).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('883844: When using the Refresh method, RichTextEditor doesnot get refreshed to initial rendering', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: [ 'FullScreen','Bold', 'Italic', 'Underline', 'StrikeThrough', 'SuperScript', 'SubScript', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'NumberFormatList', 'BulletFormatList', '|',
                    'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                    '|', 'EmojiPicker', 'Print', '|',
                    'SourceCode','|', 'Undo', 'Redo']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should remove the classnames properly when using refresh method.', () => {
            editor.focusIn();
            const toolbarElems:NodeListOf<HTMLElement> = editor.element.querySelectorAll('.e-toolbar-item');
            toolbarElems[0].click();
            expect(editor.element.classList.contains('e-rte-full-screen')).toBe(true);
            editor.refresh();
            expect(editor.element.classList.contains('e-rte-full-screen')).not.toBe(true);
        });
    });

    describe('Bug 980247: Script error throws when hovering over the Table in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table cellspacing="0" cellpadding="0"><tbody><tr><td colspan="1" width="5%" align="right" valign="top"> B </td><td colspan="11" width="95%"> B </td></tr><tr><td colspan="1" width="5%" align="right" valign="top"> C </td><td colspan="11" width="95%"> C </td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should create column resize icons with correct attributes', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            // Trigger resize helper to create resize elements and insertion icons
            (rteObj.tableModule as any).tableObj.resizeHelper({
                target: table,
                preventDefault: function () { }
            });
            setTimeout(() => {
                const colResizeIcons = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize');
                expect(colResizeIcons.length).toBeGreaterThan(0);
                // Check icon attributes
                const resizeIcon = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
                expect(resizeIcon.getAttribute('data-col')).toBe('12');
                done();
            }, 100);
        });
    });

    describe('Bug 983283: Text pasted at the last position instead of the cursor position in RichTextEditor', () => {
            let rteObj: RichTextEditor;
            const clipboardHtml: string = `<span>This is a paragraph.</span>`;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p id="start">Syncfusion</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it(' should paste content where the cursor is placed', (done: DoneFn) => {
                const startNode: HTMLElement = document.getElementById('start');
                const selection = new NodeSelection();
                if (startNode && startNode.firstChild) {
                    selection.setCursorPoint(document, startNode.firstChild as Element, 5);
                }
                const dataTransfer = new DataTransfer();
                dataTransfer.setData('text/html', clipboardHtml);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: dataTransfer
                } as ClipboardEventInit);
                rteObj.onPaste(pasteEvent);
                const pastedElm: string = (rteObj as any).inputElement.innerHTML;
                const expectedElem: string =
                    `<p id="start">Syncf<span>This is a paragraph.</span>usion</p>`;
                const expected: boolean = pastedElm.replace(/\s/g, '') === expectedElem.replace(/\s/g, '');
                expect(expected).toBe(true);
                done();
            });
        });

    describe('913719: Format Toolbar Becomes Empty When Focused Before the Table', ()=> {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Formats']
                },
                value: `<p>Paragraph 1</p><table class="e-rte-table" style="width: 20.6919%; min-width: 0px; height: 78px;"><tbody><tr style="height: 32.9114%;"><td class="" style="width: 33.3333%;"><br/></td></tr><tr style="height: 32.9114%;"><td style="width: 33.3333%;" class=""><br/></td></tr><tr style="height: 32.9114%;"><td style="width: 33.3333%;"><br/></td></tr></tbody></table><p>Paragraph 2</p>`
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should not have empty toolbar when focused before the table', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement, 1);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(editor.element.querySelector('.e-rte-dropdown-btn-text').textContent).not.toBe('');
                done();
            }, 100);
        });
        it ('Should not have empty toolbar when focused after the table', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.inputElement, 2);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(editor.element.querySelector('.e-rte-dropdown-btn-text').textContent).not.toBe('');
                done();
            }, 100);
        });
    });

    describe('Bug 934949: Cmd-Delete (macOS) does not trigger change function in Text Editor', () => {
        let rteObj: RichTextEditor;
        let isTriggered: boolean = false;
        let defaultUA: string = navigator.userAgent;
        let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeAll(() => {
            Browser.userAgent = safari;
            rteObj = renderRTE({
                value: `<p style="margin-left: 20px;" class="rte">RichTextEditor</p>`,
                autoSaveOnIdle: true,
                saveInterval: 0,
                change: ()=>{
                    isTriggered = true;
                }
            });
        });
        it(' change event trigger while cmd+backspace in mac ', (done) => {
            rteObj.focusIn();
            let selectNode: Element = rteObj.element.querySelector('.rte');
            selectNode.innerHTML += 'Hi there';
            const CMD_BACKSPACE_EVENT_INIT: any = extend(BACKSPACE_EVENT_INIT, {
                metaKey: true
            });
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', CMD_BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', CMD_BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            setTimeout(() => {
                expect(isTriggered).toBe(true);
                done();
            }, 400);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });

    describe('Bug 927325: The "& times;" symbol is converted to "x" when focus is removed from the editor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value: `<p>&times &divide &ne</p>`,
                placeholder: 'Type something'
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it("Value should be same as entered, should not change to x", (done) => {
            rteObj.focusIn();
            expect(rteObj.inputElement.innerText === '&times &divide &ne').toBe(true);
            done();
        });
        it("Value should be same as entered, should not change to x after the focus out", (done) => {
            rteObj.focusOut();
            setTimeout(() => {
                expect(rteObj.inputElement.innerText === '&times &divide &ne').toBe(true);
                done();
            }, 110);
        });
        it("Value should be same as entered, should not change to x after the code view switch", (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEve(sourceCode, 'mousedown');
            dispatchEve(sourceCode, 'mouseup');
            sourceCode.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                expect(textarea.value === `<p>&amp;times &amp;divide &amp;ne</p>`).toBe(true);
                done();
            }, 50)
        });
        it("Value should be same as entered, should not change to x after the code view switch and focus out", (done) => {
            rteObj.focusOut();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                expect(textarea.value === `<p>&amp;times &amp;divide &amp;ne</p>`).toBe(true);
                done();
            }, 50)
        });
        it("Value should be same as entered, should not change to x, after the pre view switch", (done) => {
            rteObj.focusIn();
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.inputElement.innerText === '&times &divide &ne').toBe(true);
            done();
        });
        it("Value should be same as entered, should not change to x after the code view switch and focus out, when sanitizer is off", (done) => {
            rteObj.enableHtmlSanitizer = false;
            rteObj.focusOut();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                expect(textarea.value === `<p>&amp;amp;times &amp;amp;divide &amp;amp;ne</p>`).toBe(true);
                done();
            }, 50)
        });
        it("Value should be same as entered, should not change to x, after the pre view switch, when sanitizer is off", (done) => {
            rteObj.enableHtmlSanitizer = false;
            rteObj.focusIn();
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.inputElement.innerText === '&times &divide &ne').toBe(true);
            done();
        });
        it("Value should be same as entered, should not change to x", (done) => {
            rteObj.enableHtmlSanitizer = true;
            rteObj.focusIn();
            rteObj.executeCommand('insertHTML', '<p>&times &divide &ne</p>');
            expect(rteObj.inputElement.innerText === '&times &divide &ne\n\n&times &divide &ne').toBe(true);
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('875856 - Using indents on Numbered or Bulleted list turns into nested list in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: Element;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ol style="list-style-image: none; list-style-type: upper-alpha;"><li>test1</li><li>test2</li><li>test3</li></ol>',
                toolbarSettings: {
                    items: ["Outdent",
                        "Indent"]
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('indent and outdent', (done: DoneFn) => {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement, rteObj.inputElement, 0, 1);
            const item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent');
            item.click();
            setTimeout(() => {
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement, rteObj.inputElement, 0, 1);
                const item1: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Outdent');
                item1.click();
                setTimeout(() => {
                    expect(rteObj.inputElement.innerHTML === '<ol style="list-style-image: none; list-style-type: upper-alpha; margin-left: 20px;"><li>test1</li><li>test2</li><li>test3</li></ol>').toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('885141: RichTextEditor creates P tag after pressing enter key on UL element on selection of DIV as enteraction in EnterKey Configuration', () => {
        let rteObj: RichTextEditor;
        let EnterkeyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 13,
            keyCode: 13,
            which: 13,
            code: 'Enter',
            action: 'enter',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ul><li><div>one</div></li><li><div>two</div></li><li><div class="test">three</div></li></ul>',
                enterKey: 'DIV',
                toolbarSettings: {
                    items:['UnorderedList']
                }
            });
        });
        it(' Deselect the "Bulleted List" and add the DIV to the Deselected list item', (done: DoneFn) => {
            rteObj.dataBind();
            let divElement: HTMLElement = rteObj.inputElement.querySelector('.test');
            setCursorPoint(divElement, 0);
            let targetElm: HTMLElement=rteObj.element.querySelector(".e-toolbar-item button");
            targetElm.click();
            rteObj.dataBind();
            (<any>rteObj).keyDown(EnterkeyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<ul><li><div>one</div></li><li><div>two</div></li></ul><div><br></div><div class="test">three</div>').toBe(true); 
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Bug 884738: Auto numbering or bulletin list not working with enterKey as BR in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, action:'space', key: 'Space', stopPropagation: () => { }, shiftKey: false, which: 32};
        beforeAll(() => {
            rteObj = renderRTE({
                value: 'test<br>1. ',
                enterKey: 'BR',
                toolbarSettings: {
                    items: [
                      'Alignments',
                      '|',
                      'NumberFormatList',
                      'BulletFormatList',
                      '|',
                      'Outdent',
                      'Indent',
                    ],
                  },
            });
        });
        it(' to create list when using br', (done: DoneFn) => {
            rteObj.dataBind();
            setCursorPoint(rteObj.inputElement.querySelector('br').nextSibling as Element, 2);
            keyBoardEvent.keyCode = 32;
            keyBoardEvent.code = 'Space';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === 'test<br><ol><li><br></li></ol>').toBe(true); 
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 930146: Numeric Bullet List Does Not Work Properly on iOS Devices in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, action:'space', key: 'Space', stopPropagation: () => { }, shiftKey: false, which: 32};
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ol><li>RTE</li><li>Menu</li></ol><p><br>1.</p><p><br></p>'
            });
        });
        it('Do not create list when shift enterkey is pressed', (done: DoneFn) => {
            rteObj.dataBind();
            setCursorPoint(rteObj.inputElement.querySelector('br').nextSibling as Element, 2);
            keyBoardEvent.keyCode = 32;
            keyBoardEvent.code = 'Space';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<ol><li>RTE</li><li>Menu</li></ol><p><br>1.</p><p><br></p>').toBe(true); 
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('883222 - Tab key press on selected paragraph deletes the entire line in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let ShiftTab: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let domSelection: NodeSelection = new NodeSelection();
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                value: `<p>hello world this is me</p>`,
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoTimer: 0
            });
            done();
        });
        it('Select and apply tab key and Shift tab key  ', (done: DoneFn) => {
            let startElement = rteObj.inputElement.querySelector('p');
            domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[0], 0, 20);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                startElement = rteObj.inputElement.querySelector('p');
                expect(startElement.style.marginLeft === '20px').toBe(true);
                (rteObj as any).keyDown(ShiftTab);
                setTimeout(() => {
                    expect(startElement.style.marginLeft === '').toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it('Select and apply tab key and Shift tab key when enterkey as BR other than startContainer offset ', (done: DoneFn) => {
            rteObj.enterKey='BR';
            let startElement = rteObj.inputElement.querySelector('p');
            domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[0], 5, 20);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(startElement.innerHTML==='hello&nbsp;&nbsp;&nbsp;&nbsp;me').toBe(true);
                done();
            }, 100);
        });
        it('Select and apply tab key for blocknodes and shift + tab ', (done: DoneFn) => {
            rteObj.value=`<p id='one'><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in the
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p><p id='two'><b>Functional
            Specifications/Requirements:</b></p>`;
            rteObj.dataBind();
            let startElement = rteObj.inputElement.querySelector('#one');
            let endElement = rteObj.inputElement.querySelector('#two');
            domSelection.setSelectionText(document, startElement.childNodes[0], endElement.childNodes[0], 0, 1);
            rteObj.keyDown(keyBoardEvent);
            setTimeout(() => {
                let val=rteObj.inputElement.querySelectorAll('p');
                expect(val[0].style.marginLeft==='20px');
                expect(val[1].style.marginLeft==='20px');
                expect(val[2].style.marginLeft==='20px');
                rteObj.keyDown(keyBoardEvent);
                setTimeout(() => {
                    val=rteObj.inputElement.querySelectorAll('p');
                    expect(val[0].style.marginLeft).toBe('40px');
                    expect(val[0].style.marginLeft).toBe('40px');
                    expect(val[0].style.marginLeft).toBe('40px');
                    rteObj.keyDown(ShiftTab);
                    setTimeout(() => {
                        val=rteObj.inputElement.querySelectorAll('p');
                        expect(val[0].style.marginLeft).toBe('20px');
                        expect(val[0].style.marginLeft).toBe('20px');
                        expect(val[0].style.marginLeft).toBe('20px');
                        rteObj.keyDown(ShiftTab);
                        setTimeout(() => {
                            val=rteObj.inputElement.querySelectorAll('p');
                            expect(val[0].style.marginLeft).toBe('');
                            expect(val[1].style.marginLeft).toBe('');
                            expect(val[2].style.marginLeft).toBe('');
                            done();
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        });
        it('Select and apply tab key for blocknodes when enter Key as BR ', (done: DoneFn) => {
            rteObj.value=`<p id='one'><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in the
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p><p id='two'><b>Functional
            Specifications/Requirements:</b></p>`;
            rteObj.enterKey='BR';
            rteObj.dataBind();
            let startElement = rteObj.inputElement.querySelector('#one');
            let endElement = rteObj.inputElement.querySelector('#two');
            domSelection.setSelectionText(document, startElement.childNodes[0], endElement.childNodes[0], 0, 1);
            rteObj.keyDown(keyBoardEvent);
            setTimeout(() => {
                let val=rteObj.inputElement.querySelectorAll('p');
                expect(val[0].style.marginLeft).toBe('20px');
                expect(val[0].style.marginLeft).toBe('20px');
                expect(val[0].style.marginLeft).toBe('20px');
                rteObj.keyDown(ShiftTab);
                setTimeout(() => {
                    val=rteObj.inputElement.querySelectorAll('p');
                    expect(val[0].style.marginLeft).toBe('');
                    expect(val[1].style.marginLeft).toBe('');
                    expect(val[2].style.marginLeft).toBe('');
                    done();
                }, 100);
            }, 100);
        });
        it('Select and apply tab key and using undo and redo', (done: DoneFn) => {
            let startElement = rteObj.inputElement.querySelector('p');
            domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[0], 0, 20);
            (rteObj as any).keyDown(keyBoardEvent);
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                startElement = rteObj.inputElement.querySelector('p');
                expect(startElement.style.marginLeft === '').toBe(true);
                (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                setTimeout(() => {
                    startElement = rteObj.inputElement.querySelector('p');
                    expect(startElement.style.marginLeft === '20px').toBe(true);
                    done();
                  }, 100);
            }, 100);
        });
        it('Select and apply tab key in list', (done: DoneFn) => {
        rteObj.value=`<ol id='ol'><li><p>Provide
        the tool bar support, it’s also customizable.</p></li><li id='one' ><p >Options
        to get the HTML elements with styles.</p></li><li><p>Support
        to insert image from a defined path.</p></li><li id='two'><p>Footer
        elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`;
        rteObj.dataBind();
        let startElement = rteObj.inputElement.querySelector('#one');
        let endElement = rteObj.inputElement.querySelector('#two');
        domSelection.setSelectionText(document, startElement.childNodes[0], endElement.childNodes[0], 6, 86);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            let value=rteObj.inputElement.querySelector('#ol');
            expect(value.innerHTML=== `<li>Provide the tool bar support, it’s also customizable.</li><li id="one">Option&nbsp;&nbsp;&nbsp;&nbsp;</li>`).toBe(true);
        rteObj.value=`<p id='one'><b>Functional Specifications/Requirements:</b></p><ol><li><p>Provide the tool bar support, it’s also customizable.</p></li><li id='two'><p>Options to get the HTML elements with styles.</p></li></ol>`;
            rteObj.dataBind();
            startElement = rteObj.inputElement.querySelector('#one');
            endElement = rteObj.inputElement.querySelector('#two');
            domSelection.setSelectionText(document, startElement.childNodes[0], endElement.childNodes[0], 0, 1);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.value==='<p id="one"><b>Functional Specifications/Requirements:</b></p><ol><li>Provide the tool bar support, it’s also customizable.</li><li id="two">Options to get the HTML elements with styles.</li></ol>').toBe(true);
                done();
            }, 100);
        }, 100);
        });
        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('929190 - Tab key not working properly inside list in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let ShiftTab: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let domSelection: NodeSelection = new NodeSelection();
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                value: `<p>hello world this is me</p>`,
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoTimer: 0
            });
            done();
        });
        it('Apply tab key in list', (done: DoneFn) => {
            rteObj.value=`<ul id='ul'><li id='one'>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id='two'>The toolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li></ul>`;
            rteObj.dataBind();
            let divElement: HTMLElement = rteObj.inputElement.querySelector('#one');
            setCursorPoint(divElement.firstChild as Element, 5);
            (rteObj as any).keyDown(keyBoardEvent);
            let value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML=== `<li id="one">Basic&nbsp;&nbsp;&nbsp;&nbsp; features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id="two">The toolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>`).toBe(true);
            divElement= rteObj.inputElement.querySelector('#two');
            setCursorPoint(divElement.firstChild as Element, 5);
            (rteObj as any).keyDown(keyBoardEvent);
            value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML=== `<li id="one">Basic&nbsp;&nbsp;&nbsp;&nbsp; features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id="two">The t&nbsp;&nbsp;&nbsp;&nbsp;oolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>`).toBe(true);
            divElement= rteObj.inputElement.querySelector('#one');
            setCursorPoint(divElement.firstChild as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML=== `<li style="list-style-type: none;"><ul><li id="one">Basic&nbsp;&nbsp;&nbsp;&nbsp; features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li></ul></li><li id="two">The t&nbsp;&nbsp;&nbsp;&nbsp;oolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>`).toBe(true);
            done();
        });
        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('Bug 970477: Texts in sub-bullet list turn into Bold in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
            });
            done();
        });
        it('Apply tab key in list', (done: DoneFn) => {
            rteObj.value = `<ul id="ul"><li style="font-weight: bold;"><strong>Hiiii</strong></li><li style="" id="sublist">Helloo</li></ul>`;
            rteObj.dataBind();
            let liElement: HTMLElement = rteObj.inputElement.querySelector('#sublist');
            setCursorPoint(liElement, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            let value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML === `<li style="font-weight: bold;"><strong>Hiiii</strong><ul><li style="font-weight: 400;" id="sublist">Helloo</li></ul></li>`).toBe(true);
            done();
        });
        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('Bug 983508: Images are not properly dropped after 1st time in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: "keydown",
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ""
        };
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveFormat: 'Base64',
                },
                value: `<div><p>First p node-0</p></div>`,
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Drag and dropping image multiple times ino the editor ", function (done: DoneFn) {
            rteObj.value = '<p>21</p>';
            rteObj.dataBind();
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            rteObj.focusIn();
            (rteObj.imageModule as any).insertDragImage(event);
            setTimeout(() => {
                let fileObj: File = new File(["Nice Two"], "sample.png", { lastModified: 0, type: "image/png" });
                let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
                rteObj.focusIn();
                (rteObj.imageModule as any).insertDragImage(event);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('img').length === 2).toBe(true);
                    done();
                }, 100);
            }, 200);
        });
    });

    describe('Bug 971752: Image Upload fails when dragging and dropping images into RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: "keydown",
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ""
        };
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Drag and dropping image without path configuration", function (done: DoneFn) {
            rteObj.value = '<p>21</p>';
            rteObj.dataBind();
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            rteObj.focusIn();
            (rteObj.imageModule as any).insertDragImage(event);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('img').length === 1).toBe(true);
                expect((rteObj.inputElement.querySelector('img') as HTMLImageElement).src.includes('blob')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Bug 971752: Image Upload fails when dragging and dropping images into RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: "keydown",
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ""
        };
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                pasteCleanupSettings: {
                    prompt: false,
                },
                value: `<div><p>First p node-0</p></div>`,
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Need to drag and drop the image after pasting the image", function (done: DoneFn) {
            rteObj.value = '<p>21</p>';
            rteObj.pasteCleanupSettings.prompt = false;
            rteObj.pasteCleanupSettings.plainText = false;
            rteObj.pasteCleanupSettings.keepFormat = true;
            rteObj.dataBind();
            setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
            let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
            (pasteCleanupObj as any).bindOnEnd();
            let elem: HTMLElement = createElement('span', {
                id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
            });
            (pasteCleanupObj as any).imageFormatting(keyBoardEvent, { elements: [elem.firstElementChild] });
            setTimeout(() => {
                let pastedElm: any = (rteObj as any).inputElement.innerHTML;
                expect(rteObj.inputElement.children[0].children[0].tagName.toLowerCase() === 'img').toBe(true);
                let expected: boolean = false;
                let expectedElem: string = `<p><img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus e-rte-image e-imginline">&nbsp;21</p>`;
                if (pastedElm === expectedElem) {
                    expected = true;
                }
                expect(expected).toBe(true);
                let image: HTMLElement = createElement("IMG");
                image.classList.add('e-rte-drag-image');
                image.setAttribute('src', 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
                let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
                rteObj.inputElement.appendChild(image);
                let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
                rteObj.focusIn();
                (rteObj.imageModule as any).insertDragImage(event);
                expect(rteObj.inputElement.querySelectorAll('img').length === 2).toBe(true);
                done();
            }, 100);
        });
    });

    describe('936824 - The Shift + Tab behavior needs to be changed when enableTabKey is enabled in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let ShiftTab: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let domSelection: NodeSelection = new NodeSelection();
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                value: `<p>hello world this is me</p>`,
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoTimer: 0
            });
            done();
        });
        it('Apply shift tab key in list', (done: DoneFn) => {
            rteObj.value=`<ul id='ul'><li id='one'>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id='two'>The toolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li></ul>`;
            rteObj.dataBind();
            let divElement: HTMLElement = rteObj.inputElement.querySelector('#one');
            setCursorPoint(divElement.firstChild as Element, 5);
            (rteObj as any).keyDown(ShiftTab);
            let value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML=== `<li id="one">Basic&nbsp;&nbsp;&nbsp;&nbsp; features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id="two">The toolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>`).toBe(true);
            divElement= rteObj.inputElement.querySelector('#two');
            setCursorPoint(divElement.firstChild as Element, 5);
            (rteObj as any).keyDown(ShiftTab);
            (rteObj as any).keyDown(ShiftTab);
            value = rteObj.inputElement.querySelector('#ul');
            expect(value.innerHTML=== `<li id="one">Basic&nbsp;&nbsp;&nbsp;&nbsp; features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id="two">The t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;oolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>`).toBe(true);
            divElement= rteObj.inputElement.querySelector('#one');
            setCursorPoint(divElement.firstChild as Element, 0);
            (rteObj as any).keyDown(ShiftTab);
            expect(rteObj.value === `<ul id="ul"><li id="one">Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li id="two">The toolbar has multi-row, expandable, and scrollable modes.</li><li>The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li></ul>`).toBe(true);
            done();
        });
        it('Select and apply the Shift tab key  ', (done: DoneFn) => {
            rteObj.value=`<p>hello world this is me</p>`;
            let startElement = rteObj.inputElement.querySelector('p');
            setCursorPoint(startElement.firstChild as Element, 5);
            (rteObj as any).keyDown(ShiftTab);
            let value = rteObj.inputElement.querySelector('p');
            expect(value.innerHTML=== `hello&nbsp;&nbsp;&nbsp;&nbsp; world this is me`).toBe(true);
            done();
        });
        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });


    describe('892829 - Setting layoutOption Break and width 100 percent in insertVideoSettings not working properly in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Break',
                    width: '100%',
                    height: 'auto',
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the iframe video element that has applied the styles and classes.', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/fTHVMInCEjg?si=kO_-qNSeCNfvYGps" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                setTimeout(() => {
                    (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                    setTimeout(() => {
                        expect((rteObj.inputElement.querySelector('.e-embed-video-wrap') as HTMLElement).style.display === 'block').toBe(true);
                        expect(rteObj.inputElement.querySelector('iframe').classList.contains("e-video-break")).toBe(true);
                        done();
                    }, 500);
                }, 100);
            }, 100);
        });
    });

     describe('888656 - Script error throws when we insert table into the RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table using quick toolbar ', (done: DoneFn) => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            rteEle.querySelector('.e-table-row').dispatchEvent(new Event("change"));
            (rteEle.querySelector('.e-table-row') as HTMLInputElement).blur();
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            setTimeout(() => {
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                done();
            }, 200);
        });
    });
    describe('Bug 966213: Table insertion does not replace selected content when selection is made bottom to top', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                value: `<p class='start'>1</p><p>2</p><p class='end'>3</p>`,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' While selecting multiple elements and applying table, table should replace all the content selected', (done: DoneFn) => {
            const startNode: Element = rteObj.inputElement.querySelector('.start').firstChild as Element;
            const endNode: Element = rteObj.inputElement.querySelector('.end').firstChild as Element;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, endNode, 0, endNode.textContent.length);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            rteEle.querySelector('.e-table-row').dispatchEvent(new Event("change"));
            (rteEle.querySelector('.e-table-row') as HTMLInputElement).blur();
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            setTimeout(() => {
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(rteObj.contentModule.getEditPanel().innerHTML === `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td class="e-cell-select"><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`).toBe(true);
                done();
            }, 200);
        });
    });
    describe('894730 - List not get reverted when using executeCommand in the RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                value: `<div style="display:block;"><p style="margin-right:10px">The custom command "insert special character" is configured as the last item of the toolbar. Click on the command and choose the special character you want to include from the popup.</p></div>`,
                toolbarSettings: {
                    items: [{
                        click: function () {
                            let customBtn = rteObj.element.querySelector('#custom_tbar');
                            rteObj.executeCommand('insertUnorderedList');
                        },
                        tooltipText: 'Insert Symbol',
                        template:
                            '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> Apply list</div></button>',
                    },
                        '|',
                        'Undo',
                    ]
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Apply and revert list using custom toolbar ', (done: DoneFn) => {
            document.getElementById('custom_tbar').click();
            document.getElementById('custom_tbar').click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<div style="display:block;"><p style="margin-right:10px">The custom command "insert special character" is configured as the last item of the toolbar. Click on the command and choose the special character you want to include from the popup.</p></div>`).toBe(true);
                done();
            }, 100);
        });
    });
    describe('895384 - The placeholder does not show up after cleaning up all the content in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let keyBoardEventDel: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2>`;
        beforeAll(() => {
            rteObj = renderRTE({
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: innerHTML

            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('select all content in rte and press back space ', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('h1').childNodes[0], rteObj.element.querySelector('h2'), 0, 1);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            rteObj.dataBind();
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p><br></p>').toBe(true);
                done();
            }, 100);
        });
        it('select all content in rte and press delete ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=innerHTML;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('h1').childNodes[0], rteObj.element.querySelector('h2'), 0, 1);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyDown(keyBoardEventDel);
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p><br></p>').toBe(true);
                done();
            }, 100);
        });
    });
    describe('894204: Deleting empty line removes the text in the first list in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs =  { code: 'Delete', preventDefault: function () { }, ctrlKey: false,keyCode:46, key: 'delete', stopPropagation: function () { }, shiftKey: false, which: 46 };
        beforeAll(() => {
            rteObj = renderRTE({
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: '<p>Hello</p><p><br></p><ul><li>line 1</li><li>line 2</li><li>line 3</li></ul>'

            });
            rteEle = rteObj.element;
        });
        it('Delete with Empty br node', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document,rteObj.inputElement.firstChild.nextSibling as HTMLElement,0);
            rteObj.dataBind();
            (rteObj as any).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p>Hello</p><ul><li>line 1</li><li>line 2</li><li>line 3</li></ul>').toBe(true);
                done();
            }, 100);
        });
        afterAll(()=> {
            destroy(rteObj);
        });
    });
    describe('Bug 916750: Empty Line Reappears in Rich Text Editor After Deletion When Clicking Outside', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = { code: 'Delete', preventDefault: function () { }, ctrlKey: false, keyCode: 46, key: 'delete', stopPropagation: function () { }, shiftKey: false, which: 46 };
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: '<p>Hello</p><p><br></p><ul><li>line 1</li><li>line 2</li><li>line 3</li></ul>'

            });
            done();
        });
        it('Delete with Empty br node when enterkey is configured as P', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.firstChild.nextSibling as HTMLElement, 0);
            rteObj.dataBind();
            (rteObj as any).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p>Hello</p><ul><li>line 1</li><li>line 2</li><li>line 3</li></ul>').toBe(true);
                done();
            }, 100);
        });
        it('Delete with Empty br node when enterkey is configured as DIV', (done: DoneFn) => {
            rteObj.enterKey = 'DIV';
            rteObj.value = `<div>Hello</div><div><br></div><ul><li><div>Line 1</div></li><li><div>Line 2</div></li><li><div>Line 3</div></li></ul>`;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.firstChild.nextSibling as HTMLElement, 0);
            rteObj.dataBind();
            (rteObj as any).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<div>Hello</div><ul><li><div>Line 1</div></li><li><div>Line 2</div></li><li><div>Line 3</div></li></ul>').toBe(true);
                done();
            }, 100);
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('898710 - Not able to do backspace inside the input field in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEventDel: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML: string = `<div style=" color: rgb(0, 0, 0); font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; margin: 0px;"><b style=" font-weight: 500;">Input field:</b></div><div style=" color: rgb(0, 0, 0); font-style: normal; font-weight: 400; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; margin: 1em 0px; text-align: left;">&nbsp;<label style=" color: var(--text-secondary-color,rgba(0, 0, 0, .55)); display: inline-block; max-width: 100%; margin: 0px 0px 0.5rem; font-size: 15px; font-family: Verdana, sans-serif;"><div style=" margin: 0px;">First name:</div></label><input type="text" value="John" style=" color: inherit; font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 16px; background-color: var(--background-color,rgba(255, 255, 255, 1)); margin: 0px;"><br></div>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: innerHTML

            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('select all content in rte and press delete ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=innerHTML;
            rteObj.dataBind();
            let input = rteObj.element.querySelector('input');
            input.focus();
            input.setSelectionRange(2, 2);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(input.value ==='John').toBe(true);
                done();
            }, 100);
        });
    });
    describe('902418 - Indendation does not get removed when the backspace action is performed.', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML: string = `<p style="margin-left: 20px;">Rich Text Editor</p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: innerHTML
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Press the backspace on the indent applied text', (done: DoneFn) => {
            const firstP = (rteObj as any).inputElement.querySelector('p');
            setCursorPoint(firstP, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === '<p style="">Rich Text Editor</p>').toBe(true);
                done();
            }, 100);
        });
        it('Press the backspace on the indent applied', function (done) {
            (rteObj as any).inputElement.innerHTML = '<p style="margin-left: 20px;"><strong>Rich Text Editor</strong></p>';
            const firstP = (rteObj as any).inputElement.querySelector('p strong');
            setCursorPoint(firstP, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            rteObj.keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === '<p style=""><strong>Rich Text Editor</strong></p>').toBe(true);
                done();
            }, 100);
        });
    });
      describe('902049 - After moving the new line, the cursor is not visible when it reaches the bottom of the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        const divElement = document.createElement('div');
        divElement.style.overflowY='scroll';
        divElement.style.height='60px';
        var innerHTML = `<p><br></p><p><br></p><p><br></p><p><br></p><p id='one'><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: innerHTML
            });
            divElement.appendChild(rteObj.element);
            document.body.appendChild(divElement);
        });
        afterAll(() => {
            destroy(rteObj);
            divElement.remove();
        });
        it('press enter 5 times', (done: DoneFn) => {
            rteObj.dataBind();
            let keyBoardEvent: any = { 
                type: 'keydown', 
                preventDefault: function () { }, 
                ctrlKey: false, 
                key: 'enter', 
                stopPropagation: function () { }, 
                shiftKey: false, 
                which: 13,
                keyCode: 13,
                action: 'enter'
            };
            let para = document.querySelector("#one");
            setCursorPoint(para, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.textContent ==='').toBe(true);
                done();
            }, 100);
        });
    });
      describe('898140 - Delete action inside the list not working properly.', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEventDel: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML: string = `<p>hello</p><ul><li>world</li><li id="one">this&nbsp;</li><li id="two">is</li></ul><p>me</p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: innerHTML

            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('select all last two contents of list and press delete ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=innerHTML;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#one').childNodes[0], rteObj.element.querySelector('#two'), 0, 1);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyDown(keyBoardEventDel);
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p>hello</p><ul><li>world</li></ul><p>me</p>').toBe(true);
                done();
            }, 100);
        });
        it('select all last two contents of list and press delete  for user case ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=`<p>assaassa</p><ol>
                <li>sssasa</li>
                <li id='one' >assaasas</li>
                <li id='two'>assasaas</li>
              </ol><p>assaassasa</p>`;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#one').childNodes[0], rteObj.element.querySelector('#two'), 0, 1);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyDown(keyBoardEventDel);
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p>assaassa</p><ol>\n                <li>sssasa</li>\n                \n              </ol><p>assaassasa</p>').toBe(true);
                done();
            }, 100);
        });
        it('select all last two contnets of list and press delete  for user case for p tag wrapped', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=`<p><b>Key features:</b></p><ul>
                    <li>
                        <p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>
                    </li>
                    <li>
                        <p>Capable of handling markdown editing.</p>
                    </li>
                    <li>
                        <p id='one'>Contains a modular library to load the necessary functionality on demand.</p>
                    </li>
                    <li><p id='two'>Provides a fully customizable toolbar.</p></li>

                </ul>`;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#one').childNodes[0], rteObj.element.querySelector('#two'), 0, 1);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyDown(keyBoardEventDel);
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p><b>Key features:</b></p><ul>\n                    <li>\n                        <p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>\n                    </li>\n                    <li>\n                        <p>Capable of handling markdown editing.</p>\n                    </li>\n                    \n\n                </ul>').toBe(true);
                done();
            }, 100);
        });
        it('select all entire of list and press delete  for user case for p tag wrapped', (done: DoneFn) => {
            rteObj.inputElement.innerHTML=`<p><b>Key features:</b></p><ul>
                    <li>
                        <p id='one'>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>
                    </li>
                    <li>
                        <p>Capable of handling markdown editing.</p>
                    </li>
                    <li>
                        <p>Contains a modular library to load the necessary functionality on demand.</p>
                    </li>
                    <li><p id='two'>Provides a fully customizable toolbar.</p></li>

                </ul>`;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#one').childNodes[0], rteObj.element.querySelector('#two'), 0, 1);
            keyBoardEventDel.keyCode = 46;
            keyBoardEventDel.code = 'Delete';
            keyBoardEventDel.action = 'delete';
            (rteObj as any).keyDown(keyBoardEventDel);
            (rteObj as any).keyUp(keyBoardEventDel);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML==='<p><b>Key features:</b></p>').toBe(true);
                done();
            }, 100);
        });
    });

    describe('908611 -In localiaztion, same text are used in alternative text quick toolbar item and alternative text dialog header.', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/></a><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML1,
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('image dialog quick toolbar alternative text check', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                let alternateButton = document.getElementById(rteEle.id+'_quick_AltText');
                expect(alternateButton.getAttribute('aria-label') === 'Alternate Text').toBe(true);
                done();
            }, 200);
        });
    });

     describe('912385 - Prevent inserting link when input contains only empty space', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking for insert link when input contains only empty space', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = ' ';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            target.click();
            expect(rteEle.innerText === 'syncfusion\n\nInsert Link\nWeb address\nDisplay text\nTitle\nOpen link in new window\nInsertCancel').toBe(true);    
        });
    });

    describe('911834 - Tooltip not shown correctly for custom toolbar items', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [ { tooltipText: 'Insert Video', template: "<button class=\"e-tbar-btn e-control e-btn e-lib e-icon-btn\" tabindex=\"-1\" id=\"custom_tbarbtn_3\" style=\"width:100%\"><span class=\"e-icons e-video e-btn-icon\"></span></button>" }, 'Bold', 'CreateLink' ] 
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the tooltip for custom toolbar item', () => {
            expect(document.querySelectorAll('.e-toolbar-item.e-template')[0].getAttribute('title')).toEqual('Insert Video');
        });
    });

    describe('Bug 984409: Need to add the aria multiline as true attribute to the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                locale: 'en'
            });
        });
        it('should have aria-multiline attribute for div', () => {
            const contentDiv = rteObj.contentModule.getPanel().querySelector('.e-content');
            expect(contentDiv.getAttribute('aria-multiline')).toBe('true');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 984409: Need to add the aria multiline as true attribute to the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                locale: 'en',
                iframeSettings: { enable: true }
            });
        });
        it('should have aria-multiline attribute for iframe', () => {
            const contentDiv = rteObj.element.querySelector('iframe').contentDocument.body;
            expect(contentDiv.getAttribute('aria-multiline')).toBe('true');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 984409: Need to add the aria multiline as true attribute to the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                locale: 'en',
                editorMode: 'Markdown'
            });
        });
        it('should have aria-multiline attribute for markdown editor', () => {
            const contentDiv = rteObj.contentModule.getPanel().querySelector('.e-content');
            expect(contentDiv.getAttribute('aria-multiline')).toBe('true');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('917630 - Error on Empty fontFamily and fontSize Items in Syncfusion Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                fontFamily: {
                    default: null,
                    items: [],
                  },
                fontSize:  {
                    default: null,
                    items: [],
                  },
            });
        });
        it(' Apply the underline and then apply the fontcolor', () => {
            (rteObj.element.querySelectorAll('.e-toolbar-item button')[0] as HTMLElement).click();
            (rteObj.element.querySelectorAll('.e-toolbar-item button')[1] as HTMLElement).click();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('914317 - Image duplicated when Shift enter action is performed on a paragraph', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: true,
            char: '',
            key: '',
            charCode: 13,
            keyCode: 13,
            which: 13,
            code: 'Enter',
            action: 'enter',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value:  `<p><img alt=\"Logo\" src=\"https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png\" style=\"width: 300px;\"> </p>`
            });
        });
        it('Image get duplicated after the shift + enter is pressed twice', function (done: DoneFn): void {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                setCursorPoint(nodetext, 0);
                (<any>rteObj).keyDown(keyboardEventArgs);
                setTimeout(() => {
                    expect(rteObj.inputElement.innerHTML).toBe('<p><br><br><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"> </p>');
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 936820: Duplication of Video When Pressing Shift Enter After Selecting Inserted Video', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: true,
            char: '',
            key: '',
            charCode: 13,
            keyCode: 13,
            which: 13,
            code: 'Enter',
            action: 'enter',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: `<p><video controls style="width: 30%;"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4" /></video></p>`
            });
        });
        it('Video get duplicated after the shift + enter is pressed', function (done: DoneFn): void {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br><br></p>');
                done();
            }, 100);
        });
        it('Audio get duplicated after the shift + enter is pressed', function (done: DoneFn): void {
            rteObj.value = `<p><audio controls><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></p>`;
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 0, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br></p>');
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('916204 - Link Dialog Not Closed but Link Inserted in Editor When args.cancel is Set to True in beforeDialogClose Event', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'CreateLink', 'Audio', 'Video']
                },
                value: `<p id="rte">RichTextEditor</p>`,
                beforeDialogClose: function (args) {
                    args.cancel = true;
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' inserting image', (done) => {
            rteObj.focusIn();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p id="rte">RichTextEditor</p>').toBe(true);
                done();
            }, 100);
        });
        it(' inserting video', (done) => {
            rteObj.focusIn();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Video');
            item.click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p id="rte">RichTextEditor</p>').toBe(true);
                done();
            }, 100);
        });
        it(' inserting audio', (done) => {
            rteObj.focusIn();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Audio');
            item.click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p id="rte">RichTextEditor</p>').toBe(true);
                done();
            }, 100);
        });
        it(' inserting link', (done) => {
            rteObj.focusIn();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateLink');
            item.click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusiocom';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === '<p id="rte">RichTextEditor</p>').toBe(true);
                done();
            }, 100);
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('919899 - Console error when clicking the "Image" toolbar icon in the Rich Text Editor .', ()=> {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: `<table class="e-rte-custom-table" style="width: 100%;"><tbody><tr><td>1</td><td>2</td></tr></tbody></table>`
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should not throw any console error when clicking the image toolbar icon.', (done: DoneFn) => {
            const errorSpy: jasmine.Spy = jasmine.createSpy('error');
            console.error = errorSpy;
            editor.focusIn();
            editor.formatter.editorManager.nodeSelection.setCursorPoint(editor.inputElement.ownerDocument, editor.inputElement, 1);
            const imageToolbarIcon: HTMLElement = editor.element.querySelector('.e-image');
            imageToolbarIcon.click();
            setTimeout(() => {
                expect(errorSpy).not.toHaveBeenCalled();
                done();
            }, 100);
        });

        it('Should not throw any console error when applying heading format. After Table.', (done: DoneFn) => {
            const errorSpy: jasmine.Spy = jasmine.createSpy('error');
            console.error = errorSpy;
            editor.focusIn();
            editor.formatter.editorManager.nodeSelection.setCursorPoint(editor.inputElement.ownerDocument, editor.inputElement, 1);
            const dropDownButton: HTMLElement = editor.element.querySelector('.e-formats-tbar-btn');
            dropDownButton.click();
            setTimeout(() => {
                const heading1: HTMLElement = document.querySelector('.e-rte-dropdown-popup .e-item.e-h1');
                heading1.click();
                setTimeout(() => {
                    expect(errorSpy).not.toHaveBeenCalled();
                    expect(editor.inputElement.querySelector('h1')).not.toBe(null);
                    done();
                }, 100);
            }, 100);
        });

        it('Should not throw any console error when applying heading format. Before Table.', (done: DoneFn) => {
            const errorSpy: jasmine.Spy = jasmine.createSpy('error');
            console.error = errorSpy;
            editor.focusIn();
            editor.formatter.editorManager.nodeSelection.setCursorPoint(editor.inputElement.ownerDocument, editor.inputElement, 0);
            const dropDownButton: HTMLElement = editor.element.querySelector('.e-formats-tbar-btn');
            dropDownButton.click();
            setTimeout(() => {
                const heading1: HTMLElement = document.querySelector('.e-rte-dropdown-popup .e-item.e-h1');
                heading1.click();
                setTimeout(() => {
                    expect(errorSpy).not.toHaveBeenCalled();
                    expect(editor.inputElement.querySelector('h1')).not.toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Bug 963324: RichTextEditor Content Height Is Rendered as 0 Inside Dialog When Using IframeSettings', () => {
        let editor: RichTextEditor;
        let height: number | string;
        const onCreate = () => {
            if (editor) {
                height = editor.element.querySelector('iframe').style.height;
            }
        }
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                created: onCreate,
                value: `<p><strong>The <span style="text-decoration: line-through;">Rich</span> Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>`
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it(' Height of the editor should be changed after refreshUi method is called when rte is rendered in iframe', (done: DoneFn) => {
            editor.refreshUI();
            expect(height !== editor.element.querySelector('iframe').style.height);
            done();
        });
    });

    describe('Bug 963324: RichTextEditor Content Height Is Rendered as 0 Inside Dialog When Using IframeSettings', () => {
        let editor: RichTextEditor;
        let height: number | string;
        const onCreate = () => {
            if (editor) {
                height = editor.inputElement.style.height;
            }
        }
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                created: onCreate,
                editorMode: 'Markdown',
                value: `<p><strong>The <span style="text-decoration: line-through;">Rich</span> Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>`
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it(' Height of the editor should be changed after refreshUi method is called when rte is rendered as markdown', (done: DoneFn) => {
            editor.refreshUI();
            expect(height !== editor.inputElement.style.height);
            done();
        });
    });

    describe('920157: The "Minimize" toolbar icon does not update when dynamically enabling and disabling the toolbar.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote', 'OrderedList',
                        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Print',
                        {
                            tooltipText: 'Custom Toolbar',
                            template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;">Custom Toolbar</div></button>'
                        }, '|', 'Undo', 'Redo', 'FullScreen'
                    ]               
                },          
                focus: focus,
                blur: blur
            });
        });
        function blur() {
            editorObj.toolbarSettings.enable = false;
            editorObj.dataBind();
        }
        function focus() {
            editorObj.toolbarSettings.enable = true;
            editorObj.dataBind();
        }
        it('should update minimize icon when toolbar is dynamically enabled/disabled', () => {
            const maximizeButton: HTMLElement = editorObj.element.querySelector('.e-maximize');
            expect(maximizeButton).not.toBeNull();
            maximizeButton.click();
            expect(editorObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            blur();
            expect(editorObj.toolbarSettings.enable).toBe(false);
            focus();
            expect(editorObj.toolbarSettings.enable).toBe(true);
            expect(editorObj.element.classList).toContain('e-rte-full-screen');       
            const toolbarMinimizeElement = editorObj.element.querySelector('.e-minimize');
            expect(toolbarMinimizeElement).not.toBeNull();
        });
        afterAll(() => {
            destroy(editorObj);
        });
    });
    describe('Bug 980252: Script error throws when calling the showInlineToolbar in RichTextEditor', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                inlineMode: {
                    enable: true,
                    onSelection: true,
                },
                focus: function () {
                    if (editorObj.value == null) {
                        editorObj.showInlineToolbar();
                    }
                }
            });
        });
        it('should render inline toolbar when no value is present', (done) => {
            editorObj.focusIn();
            setTimeout(() => {
                expect(editorObj.element.querySelector('.e-rte-inline-popup')).not.toBeNull();
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(editorObj);
        });
    });
    describe('920512-DIV element removed when pressing backspace at the start of the DIV element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            code: 'Backspace',
            preventDefault: function () { },
            ctrlKey: false,
            keyCode: 8,
            key: 'backspace',
            stopPropagation: function () { },
            shiftKey: false,
            which: 8
        };
    
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', 'Bold']
                },
                value: '<p><br/></p><div class="signatureDiv"><p>Regards,</p><p>Syncfusion</p></div><p><br/></p>',
            });
            rteEle = rteObj.element;
        });
    
        afterAll(() => {
            destroy(rteObj);
        });
    
        it('Backspace before the DIV element', () => {
            const editPanel = rteObj.contentModule.getEditPanel();
            const regardsElement = editPanel.querySelector('.signatureDiv p');
            if (regardsElement) {
                rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, regardsElement, 0);
            }
            rteObj.dataBind();
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(rteObj.inputElement.innerHTML).toBe('<div class="signatureDiv"><p>Regards,</p><p>Syncfusion</p></div><p><br></p>');
            const toolbarItems =rteObj.element.querySelectorAll(".e-toolbar-item");
            (toolbarItems[0] as any).click();
            (toolbarItems[1] as any).click();
            expect(rteObj.inputElement.innerHTML).toBe('<div class="signatureDiv"><p>Regards,</p><p>Syncfusion</p></div><p><br></p>');
        });
    });
    describe('924546 - The content does not scroll into the cursor position when inserted through the executeCommand method', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 150,
                width: 150,
                value: ``
            });
            rteEle = rteObj.element;
        });
        it('The content does not scroll into the cursor position when inserted through the executeCommand method', () => {
            rteObj.executeCommand('insertHTML', `HTML tags are like keywords which defines that how web browser will format and display the content. With the help of tags, a web browser can distinguish between an HTML content and a simple content. HTML tags contain three main parts: opening tag, content and closing tag. But some HTML tags are unclosed tags.When a web browser reads an HTML document, browser reads it from top to bottom and left to right. HTML tags are used to create HTML documents and render their properties. Each HTML tags have different properties.An HTML file must have some essential tags so that web browser can differentiate between a simple text and HTML text. You can use as many tags you want as per your code requirement.HTML tags are like keywords which defines that how web browser will format and display the content. With the help of tags, a web browser can distinguish between an HTML content and a simple content. HTML tags contain three main parts: opening tag, content and closing tag. But some HTML tags are unclosed tags.When a web browser reads an HTML document, browser reads it from top to bottom and left to right. HTML tags are used to create HTML documents and render their properties. Each HTML tags have different properties.An HTML file must have some essential tags so that web browser can differentiate between a simple text and HTML text. You can use as many tags you want as per your code requirement.`);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('919469 - Bold format getting removed for the whole paragraph instead of selected text', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'StrikeThrough']
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it('Reverting bold after applying strikethrough', (done) => {
            rteObj.focusIn();
            rteObj.value = `<p><strong>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interfacethat allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>`;
            rteObj.dataBind();
            let contentElem = rteEle.querySelector('.e-content');
            let range = new Range();
            range.setStart(contentElem.firstChild.firstChild.firstChild, 4);
            range.setEnd(contentElem.firstChild.firstChild.firstChild, 8);
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
            item.click();
            setTimeout(() => {
                let item1: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item1.click();
                setTimeout(() => {
                    expect(contentElem.innerHTML === `<p><strong>The </strong><span style="text-decoration: line-through;">Rich</span><strong> Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interfacethat allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>`).toBe(true);
                    done();
                }, 50);
            }, 50);
        });
        it('Reverting strikethrough after applying bold', (done) => {
            rteObj.focusIn();
            rteObj.value=`<p><strong>The <span style="text-decoration: line-through;">Rich</span> Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>`;
            rteObj.dataBind();
            let contentElem = rteEle.querySelector('.e-content');
            let range = new Range();
            range.setStart(contentElem.firstChild.firstChild.childNodes[1].childNodes[0], 2);
            range.setEnd(contentElem.firstChild.firstChild.childNodes[2], 3);
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            let item1: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
            item1.click();
            setTimeout(() => {
                expect(contentElem.innerHTML === '<p><strong>The <span style="text-decoration: line-through;">Ri</span></strong><span style="text-decoration: line-through;">ch</span> Te<strong>xt Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</strong></p>').toBe(true);
                expect(window.getSelection().toString() === 'ch Te').toBe(true);
                done();
            }, 50);
        })
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('933152 - The Div element is removed from the content when pressing the Enter key followed by the Backspace key', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><br/><br/></p><div id="user_email_signature_content"><p style="line-height: 1.5;"><span style="font-size: 12pt;"><span style="font-family: Trebuchet MS;">Testing</span></span></p></div>`,
            });
        });
        it('Press Enter and Backspace before text in div', (done: Function) => {
            rteObj.focusIn();
            let targetElement = rteObj.element.querySelector('#user_email_signature_content p span span') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, targetElement, 0);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT));
                rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT));
                setTimeout(() => {
                    expect(rteObj.value).toBe('<p><br><br></p><div id="user_email_signature_content"><p style="line-height: 1.5;"><span style="font-size: 12pt;"><span style="font-family: Trebuchet MS;">Testing</span></span></p></div>');
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Bug 984023: The getSelectedHtml function does not return the proper HTML for links in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><a class="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank" aria-label="Open in new window">link</a></p>`,
            });
        });
        it('getSelectedHtml method should return the anchor tag properly', (done: Function) => {
            const anchorTag: HTMLElement = rteObj.element.querySelector('a.e-rte-anchor');
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(anchorTag.childNodes[0], 0);
            range.setEnd(anchorTag.childNodes[0], anchorTag.childNodes[0].textContent.length);
            rteObj.selectRange(range);
            let str = rteObj.getSelectedHtml();
            expect((rteObj.contentModule.getEditPanel().firstChild as HTMLElement).innerHTML === str).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('929233 - Cursor Moves to the Last Position When Pressing Shift + Enter.', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `RichTextEditor`,
                enterKey: 'BR',
                shiftEnterKey: 'P',
            });
            done();
        });
        it('Press the Enter key in the middle of the text while configuring the enterKey as BR.', (done: DoneFn) => {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.childNodes[0] as Element, 5);
            (rteObj as any).keyDown({ keyCode: 13, which: 13, shiftKey: true, key: 'Enter', code: 'Enter', preventDefault: function () { } });
            expect(rteObj.inputElement.innerHTML).toBe('RichT<p>extEditor</p>');
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.childNodes[0] as Element, (rteObj.inputElement.childNodes[0] as Text).length);
            (rteObj as any).keyDown({ keyCode: 13, which: 13, shiftKey: true, key: 'Enter', code: 'Enter', preventDefault: function () { } });
            expect(rteObj.inputElement.innerHTML).toBe('RichT<p><br></p><p>extEditor</p>');
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.childNodes[0] as Element, 0);
            (rteObj as any).keyDown({ keyCode: 13, which: 13, shiftKey: true, key: 'Enter', code: 'Enter', preventDefault: function () { } });
            expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>RichT<p><br></p><p>extEditor</p>');
            rteObj.inputElement.innerHTML = '<br>';
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.childNodes[0] as Element, 0);
            (rteObj as any).keyDown({ keyCode: 13, which: 13, shiftKey: true, key: 'Enter', code: 'Enter', preventDefault: function () { } });
            expect(rteObj.inputElement.innerHTML).toBe('<br><p><br></p>');
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('923869 - The empty textarea element is not inserted using the ExecuteCommandAsync method', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p id="rte">RichTextEditor</p>`
            });
        });
        it('The empty textarea element is not inserted using the ExecuteCommandAsync method', () => {
            rteObj.executeCommand('insertHTML',`<textarea id="text" name="text" miplato_id="text"></textarea>`);
            expect(rteObj.inputElement.innerHTML).toBe('<p id="rte"><textarea id="text" name="text" miplato_id="text"></textarea>RichTextEditor</p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('939792 - Image Caption is Editable in Rich Text Editor After Posting', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="553" height="312" style="min-width: 0px; max-width: 553px; min-height: 0px;"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>`
            });
        });
        it('Image Caption is Editable in Rich Text Editor After Posting', () => {
            expect(rteObj.inputElement.innerHTML).toBe('<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="553" height="312" style="min-width: 0px; max-width: 553px; min-height: 0px;"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>');
                expect(rteObj.getHtml()).toBe('<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="553" height="312" style="min-width: 0px; max-width: 553px; min-height: 0px;"><span class="e-img-inner" contenteditable="false">Caption</span></span></span></p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('945968 - Listed table got removed while inserting new table into the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should not remove existing tables when inserting a new table below a numbered list', (done) => {
            rteObj.value = `<ol>
                                <li>Point 1</li>
                                <li>
                                    <table>
                                        <tr><td>Cell 1</td><td>Cell 2</td></tr>
                                    </table>
                                    <br>
                                </li>
                            </ol>`;
            rteObj.dataBind();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const node = rteObj.contentModule.getDocument().querySelector('table') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(rteObj.contentModule.getDocument(), node.parentNode as HTMLElement, 1);
            const createTableButton: HTMLElement = rteEle.querySelector('[aria-label="Create Table (Ctrl+Shift+E)"]');
            createTableButton.click();
            var tableDialogPrimaryButton: HTMLElement = document.body.querySelector('#' + rteObj.element.id + '_insertTable');
            tableDialogPrimaryButton.click();
            var insertButton: HTMLElement = document.querySelector('button.e-rte-elements.e-control.e-btn.e-lib.e-flat.e-insert-table.e-primary');
            insertButton.click();
            const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
            expect(tables.length).toBe(2);
            done();
        });
    });
    describe('942812 - RichTextEditor Image Interaction', () => {
        let rteObj: RichTextEditor;
        let changeSpy: jasmine.Spy;
        let rteEle: HTMLElement;
        beforeAll((done: Function) => {
            changeSpy = jasmine.createSpy('change');
            rteObj = renderRTE({
                value: '<img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="553" height="312" style="min-width: 0px; max-width: 553px; min-height: 0px;">',
                change: (args: any) => changeSpy(args),
                toolbarSettings: {
                    items: ['Image', 'Bold']
                }
            });
            rteEle = rteObj.element;
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should not trigger change event when clicking and unfocusing image', (done: Function) => {
            (rteObj as any).cloneValue = '<p><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="553" height="312" style="min-width: 0px; max-width: 553px; min-height: 0px;"></p>';
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
            rteObj.focusOut();
            setTimeout(() => {
                expect(changeSpy).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });
    describe('937051 - Text format gets collapsed when we press backspace within the list elements in the RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<ol><li>asdfasdfas<br>fasdfa<br>asdfasdf<br>asdfasdf<br>asdsda<br></li></ol>`,
            });
            done();
        });
        it('Should handle backspace correctly in various list positions', (done) => {
            var startNode = rteObj.inputElement.querySelector("OL li").childNodes[4];
            setCursorPoint((startNode as Element), 0);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'backspace', action: 'backspace', keyCode: 8, stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.target = rteObj.inputElement;
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj as any).inputElement.childNodes.length === 1).toBe(true);
            rteObj.value = `<ol><li>asdfasdfas<br>fasdfa<br><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;" class="e-list-elem">asdfasdf</span></span></em></strong><br>asdfasdf<br>asdsda<br></li></ol>`;
            rteObj.dataBind();
            startNode = rteObj.inputElement.querySelector("OL li .e-list-elem").childNodes[0];
            setCursorPoint((startNode as Element), 0);
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.inputElement.childNodes.length === 1).toBe(true);
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('960444 - Font color retention when pressing Backspace after Enter', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs: any;

        beforeAll((done: Function) => {
            keyboardEventArgs = {
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: '',
                charCode: 13,
                keyCode: 13,
                which: 13,
                code: 'Enter',
                action: 'enter',
                type: 'keydown'
            };
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: ''
            });
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should maintain font color when pressing Backspace after pressing Enter twice', (done) => {
            rteObj.value = '<p><span style="color: rgb(255, 0, 0);">Red text</span></p>';
            rteObj.inputElement.innerHTML = '<p><span style="color: rgb(255, 0, 0);">Red text</span></p>';
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('span').childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, startNode.textContent.length);
            (<any>rteObj).keyDown(keyboardEventArgs);
            (<any>rteObj).keyDown(keyboardEventArgs);
            const paragraphs = rteObj.inputElement.querySelectorAll('p');
            expect(paragraphs.length).toBe(3);
            (<any>rteObj).keyDown({
                ...keyboardEventArgs,
                charCode: 8,
                keyCode: 8,
                which: 8,
                code: 'Backspace'
            });
            setTimeout(() => {
                const currentParagraph = rteObj.inputElement.querySelectorAll('p')[1];
                const spanInCurrentParagraph: HTMLElement = currentParagraph.querySelector('span[style*="color"]');
                // Verify color formatting is preserved
                expect(spanInCurrentParagraph).not.toBeNull();
                expect(spanInCurrentParagraph.style.color).toBe('rgb(255, 0, 0)');
                // Check HTML structure matches expected format with color preserved
                expect(rteObj.inputElement.innerHTML).toContain('<p><span style="color: rgb(255, 0, 0);">Red text</span></p>');
                expect(rteObj.inputElement.innerHTML).toContain('<p><span style="color: rgb(255, 0, 0);">');
                done();
            }, 50);
        });

        it('should maintain complex formatting when pressing Backspace after Enter', (done) => {
            // Set initial content with multiple formatting styles
            rteObj.value = '<p><span style="color: rgb(255, 0, 0);"><strong><em>Formatted text</em></strong></span></p>';
            rteObj.inputElement.innerHTML = '<p><span style="color: rgb(255, 0, 0);"><strong><em>Formatted text</em></strong></span></p>';
            rteObj.dataBind();
            rteObj.focusIn();
            // Get the innermost text node
            const spanElement = rteObj.inputElement.querySelector('span');
            const startNode: any = rteObj.inputElement.querySelector('em').childNodes[0];
            // Place cursor at the end of the text
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, startNode.textContent.length);
            // Press Enter twice
            (<any>rteObj).keyDown(keyboardEventArgs);
            (<any>rteObj).keyDown(keyboardEventArgs);
            // Press Backspace
            (<any>rteObj).keyDown({
                ...keyboardEventArgs,
                charCode: 8,
                keyCode: 8,
                which: 8,
                code: 'Backspace'
            });
            setTimeout(() => {
                // Check if all formatting styles are preserved
                const currentParagraph = rteObj.inputElement.querySelectorAll('p')[1];
                const colorSpan: HTMLElement = currentParagraph.querySelector('span[style*="color"]');
                const strongTag = currentParagraph.querySelector('strong');
                const emTag = currentParagraph.querySelector('em');
                expect(colorSpan).not.toBeNull();
                expect(colorSpan.style.color).toBe('rgb(255, 0, 0)');
                expect(strongTag).not.toBeNull();
                expect(emTag).not.toBeNull();
                done();
            }, 50);
        });
    });
    describe('937864 - Inline Code Tooltip Missing Keyboard Shortcut', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['InlineCode']
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the tooltip for custom toolbar item', () => {
            expect(document.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Inline Code (Ctrl+`)");
        });
    });

    describe('966050 - Modified aria-label value gets reverted after reloading in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        const initialValue = `<p><a class="e-rte-anchor" href="https://ftngd" title="https://ftngd" target="_blank" aria-label="Open in new window">Link</a></p>`;
        const modifiedLabel = 'Modified';
        beforeAll(() => {
            rteObj = renderRTE({
                value: initialValue
            });
        });
        it('should change aria-label and persist after reload', (done: DoneFn) => {
            const linkElement = rteObj.element.querySelector('a.e-rte-anchor');
            expect(linkElement.getAttribute('aria-label')).toBe('Open in new window');
            linkElement.setAttribute('aria-label', modifiedLabel);
            localStorage.setItem('editorValue', rteObj.getHtml());
            const storedValue = localStorage.getItem('editorValue');
            rteObj.value = storedValue;
            rteObj.dataBind();
            rteObj.refresh();
            const refreshedLinkElement = rteObj.element.querySelector('a.e-rte-anchor');
            expect(refreshedLinkElement.getAttribute('aria-label')).toBe(modifiedLabel);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
            localStorage.removeItem('editorValue');
        });
    });

    describe('966048 - XSS security issues in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteEle = rteObj.element;
        });
        it('should sanitize and update the DOM after toggling source code view', (done) => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p>abc</p><p>afaf<img src="mir" onerror="alert`test`" /></p>';
            let sourceCodeButton: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            sourceCodeButton.click();
            const sourceCodeTextarea = rteObj.element.querySelector('.e-rte-srctextarea') as HTMLTextAreaElement;
            expect(sourceCodeTextarea).not.toBe(null);
            expect(sourceCodeTextarea.value).toBe('<p>abc</p>\n<p>afaf<img src="mir" class="e-rte-image e-imginline"/></p>');
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('967065 - Modified the modules rendering while toolbar disabled', function () {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false,
                    items: ['Image']
                },
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Check the image module is rendered or not", (done: DoneFn) => {
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            setTimeout(() => {
                let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                let trg = (document.querySelector('.e-rte-image') as HTMLElement);
                expect(trg).not.toBe(null);
                expect(document.querySelectorAll('img').length).toBe(1);
                expect((document.querySelector('img') as HTMLImageElement).src).toBe('https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png');
                done();
            }, 100);
        });
    });

    describe('968252 - Table is inserted along with placeholder text in Rich Text Editor when not focused', () => {
        let rteObj: RichTextEditor;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let keyboardEventArgs = {
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
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                height: 400,
                width: 200,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            rteObj.appendTo('#defaultRTE');
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Check if the table is inserted properly after undoing the already inserted table', () => {
            const createTableBtn = rteObj.element.querySelector('.e-create-table') as HTMLElement;
            expect(createTableBtn).not.toBeNull();
            createTableBtn.click();
            const insertTableButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertTableButton.click();
            const insertButton = document.querySelector('.e-insert-table') as HTMLElement;
            insertButton.click();
            const insertedTable = rteObj.contentModule.getEditPanel().querySelector('table');
            expect(insertedTable).not.toBeNull();
            expect(rteObj.element.querySelector('.e-placeholder-enabled')).toBeNull();
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyUp({ event: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Undo', null);
            expect(rteObj.element.querySelector('.e-rte-table')).toBeNull();
            const createTableBtn1 = rteObj.element.querySelector('.e-create-table') as HTMLElement;
            expect(createTableBtn1).not.toBeNull();
            createTableBtn.click();
            const insertTableButton1 = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertTableButton1.click();
            const insertButton1 = document.querySelector('.e-insert-table') as HTMLElement;
            insertButton1.click();
            const insertedTable1 = rteObj.contentModule.getEditPanel().querySelector('table');
            expect(insertedTable1).not.toBeNull();
            expect(rteObj.element.querySelector('.e-placeholder-enabled')).toBeNull();
        });
    });

    describe('971893 - Backspacing the text elements inside the div does not work properly in RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Hi Janet,</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Thank you for reaching out!</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"> <div><div>Has the claimant previously been absent due to back problems?</div></div> <div><div>Were aware of any pre-existing back problems with the claimant?</div></div> <div><div class="focusNode">Risk assessment for slips, trips and falls together with adverse weather conditions;</div></div> <div><div>Whilst&nbsp;we note there is a stop work authority which the claimant alleges, he never really understood how it worked, did the other agents not know about it either - can we either provide training records or a read and sign;</div></div> </div>`,
            });
            done();
        });
        it('Rich Text Editor works properly when backspacing text inside nested <div> elements', (done) => {
            var startNode = rteObj.inputElement.querySelector(".focusNode").childNodes[0];
            setCursorPoint((startNode as Element), 0);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, code:'Backspace', key: 'backspace', action: 'backspace', keyCode: 8, stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.target = rteObj.inputElement;
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj as any).inputElement.innerHTML === '<div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Hi Janet,</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Thank you for reaching out!</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"> <div><div>Has the claimant previously been absent due to back problems?</div></div> <div><div>Were aware of any pre-existing back problems with the claimant?Risk assessment for slips, trips and falls together with adverse weather conditions;</div></div> <div></div> <div><div>Whilst&nbsp;we note there is a stop work authority which the claimant alleges, he never really understood how it worked, did the other agents not know about it either - can we either provide training records or a read and sign;</div></div> </div>').toBe(true);
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('973867 - Binding value wrapped with div adds extra P tags in the RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `﻿<div><p>123</p></div>`,
            });
            done();
        });
        it('Rich Text Editor works properly when a binding value is wrapped with a `<div>`, and no extra `<p>` tags are added', (done) => {
            expect((rteObj as any).inputElement.innerHTML === '<div><p>123</p></div>').toBe(true);
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
});
