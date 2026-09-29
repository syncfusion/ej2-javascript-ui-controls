/**
 * KeyBoard spec
 */
import { Browser, createElement, detach, extend } from '@syncfusion/ej2-base';
import { KeyboardEvents } from './../../../src/rich-text-editor/actions/keyboard';
import { htmlKeyConfig } from './../../../src/common/config';
import { RichTextEditor } from "../../../src/rich-text-editor";
import { BACKSPACE_EVENT_INIT ,INSRT_IMG_EVENT_INIT, TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT, NUMPAD_ENTER_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE,setCursorPoint } from "../render.spec";
import { NodeSelection } from '../../../src/selection/index';
import { ActionBeginEventArgs } from "../../../src/common/interface";
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
describe('KeyBoard', () => {
    let keyObj: KeyboardEvents;
    let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
        id: 'editor',
        styles: 'width:200px;height:200px'
    });
    beforeAll(() => {
        document.body.appendChild(textArea);
        keyObj = new KeyboardEvents(textArea, { keyConfigs: htmlKeyConfig });
    });
    afterAll(() => {
        keyObj.destroy();
        detach(textArea);
    });
    it('KeyBoard', () => {
        (keyObj as any).keyPressHandler(keyboardEventArgs);
    });
    it('KeyBoard - onPropertyChanged method call', () => {
        (keyObj as any).onPropertyChanged ({}, {});
    });
});

describe('982113 - Dynamic Property changes for keyConfig', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                keyConfig: { 'bold': 'ctrl+g' },
                value: '<p id="pnode1">Sample</p>' +
                    '<p id="pnode4">Sample</p>' +
                    '<p id="pnode2">Sample</p>' +
                    '<p id="pnode3">Sample</p>'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Dynamic Property changes for keyConfig', () => {
            rteObj.keyConfig = { bold: 'ctrl+g' };
            rteObj.dataBind();
            let nodeSelection: NodeSelection = new NodeSelection();
            let node: HTMLElement = document.getElementById("pnode1");
            nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'g', stopPropagation: () => { }, shiftKey: false, which: 71 };
            keyBoardEvent.charCode = 71;
            keyBoardEvent.keyCode = 71;
            keyBoardEvent.bubbles = true;
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', keyBoardEvent));
            expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('strong');
            
        });
    });


describe('RTE Keyboard shortcut testing', () => {
    let rteObj: RichTextEditor;
    describe('Insert Image Shortcut testing', () => {
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
            done();
        });
        afterAll((done: Function) => {
            rteObj.destroy();
            done();
        });
        it('Check the dialog is open or not', () => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            expect(rteObj.element.querySelector('.e-rte-img-dialog')).not.toBe(null);
        });
    });
});

describe('Markdown Keyboard shortcut testing', () => {
    let rteObj: RichTextEditor;
    describe('Insert Image Shortcut testing', () => {
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                editorMode: 'Markdown'
            });
            done();
        });
        afterAll((done: Function) => {
            rteObj.destroy();
            done();
        });
        it('Check the dialog is open or not', () => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            expect(rteObj.element.querySelector('.e-rte-img-dialog')).not.toBe(null);
        });
    });
    describe( 'EJ2-62151 - Strikethrough and underline are removed when we select and press shift key on lists in RTE', () =>{
        let defaultRTE: RichTextEditor;
        let innerHTML = `<ol><li><p>Provide
            the tool bar <span class='FocusNode1' style="text-decoration: line-through;">support </span >, its also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li><p>Support
            to insert image from a defined path.</p></li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
            the editor support.</p></li><li><p>Provide
            efficient public methods and client side events.</p></li><li><p>Keyboard
            navigation support.</p></li></ol>`;
        beforeAll( () =>{
            defaultRTE = renderRTE( {
                height: 400,
                toolbarSettings: {
                    items: [ 'Undo', 'Redo', '|',
                        'Underline', 'StrikeThrough', '|',
                    ]
                },
                value: innerHTML
            } );
        } );
        afterAll( () =>{
            destroy( defaultRTE );
        } );
        it( 'should not remove current focus of selected text after pressing SHIFT key', () =>{
            let startContainer: any = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).childNodes[ 0 ];
            let endContainer: any = startContainer;
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'shift', stopPropagation: () => { }, shiftKey: true, which: 16 };
            defaultRTE.formatter.editorManager.nodeSelection.setSelectionText( document, startContainer, endContainer, 0, endContainer.textContent.length )
            keyBoardEvent.keyCode = 16;
            keyBoardEvent.code = 'Shift';
            let style = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).style.textDecoration;
            expect( style == "line-through" ).toBe( true );
            expect( defaultRTE.inputElement.textContent.length ).toBe(423);
            ( defaultRTE as any ).keyDown( keyBoardEvent );
            expect( defaultRTE.inputElement.textContent.length ).toBe(423);
            style = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).style.textDecoration;
            expect( style == "line-through" ).toBe( true );
        } );
    });
    describe('841892 - CTRL + Enter triggers the enter action in the Editor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Testing</p>`,
            });
        });
        it('Pressing Crt + enter key after ', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 4, 4);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.action = 'enter';
            keyBoardEvent.which = 13;
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === `<p>Testing</p>`).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('848791 - The CMD + B Shortcut not working on the Safari browser', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: Element;
        let editNode: HTMLElement;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({ height: 200 });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('Bold action in Mac machin : Command + b', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(selectNode, 0);
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.metaKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            expect( editNode.querySelector('.first-p').firstChild.nodeName === 'STRONG').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('904051: Number Pad Enter Key Does Not Trigger actionBegin Event in the Rich Text Editor.', () => {
            let editor: RichTextEditor;
            let isActionBegin: boolean = false;
            beforeAll(() => {
                editor = renderRTE({
                    actionBegin: (args: ActionBeginEventArgs) => {
                        if (args.requestType === 'EnterAction') {
                            isActionBegin  = true;
                        }
                    }
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it ('Should trigger the action begin even on NUMPAD enter action', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', NUMPAD_ENTER_EVENT_INIT));
                editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', NUMPAD_ENTER_EVENT_INIT));
                setTimeout(() => {
                    expect(isActionBegin).toBe(true);
                    done();
                }, 100);
            });
        });
    describe('1020152: Markdown Editor: Alt+F10 doesnot highlight Bold toolbar', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'StrikeThrough', '|', 'Formats', 'OrderedList', 'UnorderedList']
                },
                value: 'Markdown Editor content'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the toolbar item is focused on Alt+F10', () => {
            rteObj.focusIn();
            // Alt + F10
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT));
            const toolbarItem: HTMLElement = rteObj.element.querySelector('.e-toolbar-item .e-btn');
            expect(document.activeElement === toolbarItem).toBe(true);
        });
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
describe('883222 - Tab key press on selected paragraph deletes the entire line in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let ShiftTab: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9, key: 'Tab', keyCode: 9, target: document.body };
        let domSelection: NodeSelection = new NodeSelection();
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<p>hello world this is me</p>`,
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoTimer: 0
            });
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
            expect(value.innerHTML=== `<li>Provide         the tool bar support, it’s also customizable.</li><li id="one">Option&nbsp;&nbsp;&nbsp;&nbsp;Cancel))</li>`).toBe(true);
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
        afterEach(() => {
            destroy(rteObj);
        });
    });
describe('Bug 916750: Empty Line Reappears in Rich Text Editor After Deletion When Clicking Outside', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = { code: 'Delete', preventDefault: function () { }, ctrlKey: false, keyCode: 46, key: 'delete', stopPropagation: function () { }, shiftKey: false, which: 46 };
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: '<p>Hello</p><p><br></p><ul><li>line 1</li><li>line 2</li><li>line 3</li></ul>'

            });
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
        afterEach(() => {
            destroy(rteObj);
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