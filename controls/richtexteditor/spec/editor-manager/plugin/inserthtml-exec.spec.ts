/**
 * Insert HTML exec plugin spec
 */
import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { RichTextEditor } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/selection';
import { renderRTE, destroy } from "../../rich-text-editor/render.spec";
import { Dialog } from '@syncfusion/ej2-popups';

describe('Insert HTML  Exec plugin', () => {

    describe('apply bold testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label id="label1">First label Node</label>
           <label id="label2">Second label Node</label>
           </p>
           <p class='last-p-node'>
             <label id="label3">Third Label Node</label>
             <label id="label4">Last Label Node</label>
             <span id='span1'>
             <img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">
             <label id="label5">Content</label>
             </span>
             <span id='span2'>the</span>
             <span id='span3'>the<img width="250" height="250"></span>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Insert a Span', () => {
            let node1: HTMLElement = document.getElementById('label1');
            let node2: HTMLElement = document.getElementById('label2');
            editorObj.nodeSelection.setSelectionText(document, node1.childNodes[0], node2.childNodes[0], 0, 5);
            let node: Node = document.createElement('span');
            node.textContent = 'span Node';
            editorObj.execCommand("InsertHtml", null, null, ():boolean => { return true;}, node );
            //The below line has been changed because the inserthtml code has been changed.
            //When the whole text content in the element is selected, the selected content's element will be removed when inserting new content.
            expect(document.getElementById('label1')).toBe(null);
            expect(document.querySelector('.first-p-node').childNodes[5].nodeName.toLowerCase()).toBe('span');
        });
        it('Insert an Image', () => {
            let node: HTMLElement = document.getElementById('label3');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
            let img: HTMLImageElement = document.createElement('img');
            img.src = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            img.width = 250;
            img.height = 250;
            editorObj.execCommand("InsertHtml", null, null, null, img );
            expect(node.childNodes[1].nodeName.toLowerCase()).toBe('img');
        });
        it('Insert an Image selection', () => {
            let node: HTMLElement = document.getElementById('label4');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 4);
            let img: HTMLImageElement = document.createElement('img');
            img.src = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            img.width = 250;
            img.height = 250;
            editorObj.execCommand("InsertHtml", null, null, null, img );
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('img');
        });
        it('selecting an Image selection', () => {
            let node1: HTMLElement = document.getElementById('img1');
            let node2: HTMLElement = document.getElementById('label5');
            editorObj.nodeSelection.setSelectionText(document, node1, node2.childNodes[0], 0, 3);
            let img: HTMLImageElement = document.createElement('img');
            img.width = 250;
            img.height = 250;
            editorObj.execCommand("InsertHtml", null, null, null, img );
            expect(document.getElementById('span1').childNodes[1].nodeName.toLowerCase()).toBe('img');
        });
        it('last an Image selection', () => {
            let node1: HTMLElement = document.getElementById('span3');
            editorObj.nodeSelection.setSelectionText(document, node1.childNodes[0], node1.childNodes[0], 0, 0);
            let spanElem: HTMLElement = createElement('span', { id: 'insertspan' });
            spanElem.innerHTML = 'new span';
            editorObj.execCommand("InsertHtml", null, null, null, spanElem );
            expect(document.getElementById('span3')).not.toBe(null);
            expect(document.getElementById('span2').nextElementSibling.children[0].getAttribute('id')).toBe(spanElem.getAttribute('id'));
        });
        it('Insert a Span', () => {
            let node1: HTMLElement = document.getElementById('span2');
            editorObj.nodeSelection.setSelectionText(document, node1.childNodes[0], node1.childNodes[0], 0, 3);
            let node: Node = document.createElement('span');
            node.textContent = 'span Node';
            editorObj.execCommand("InsertHtml", null, null, ():boolean => { return true;}, node );
            expect(document.getElementById('span1').nextElementSibling.nodeName.toLowerCase()).toBe('span');
        });
        afterAll(() => {
            detach(elem);
        });
    });
    describe('977751: Blazor: Script error after inserting custom emoji and pressing Enter in Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        let editorObj: EditorManager;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>The custom command item 🙂 - <b>Insert Emoticons</b> is added to the Toolbar. Click on the command and choose the emoticon you want to include from the popup.</p>`
            });
            editorObj = new EditorManager({ document: document, editableElement: document.querySelector(".e-content") });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('apply emoji by selecting ctrl + A inside editor', () => {
            let targetEle: HTMLElement = rteObj.element.querySelector('p');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetEle.firstChild, targetEle.lastChild, 0, targetEle.lastChild.textContent.length);
            editorObj.execCommand("InsertHtml", null, null, null, '🙂' );
            expect(rteObj.inputElement.innerHTML === '<p>🙂</p>').toBe(true);
        });
    });

    describe('1011396 - Cursor position is not maintained correctly after inserting a video using executeCommand', function () {
        let rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                value: "<p>Testing</p>"
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Use the executeCommand method to insert the video', function (done) {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('p').firstChild as HTMLElement, 4);
            rteObj.executeCommand('insertVideo', {
                url: 'https://www.w3schools.com/tags/movie.mp4',
                cssClass: 'e-rte-video',
            });
            setTimeout(function () {
                expect(window.getSelection().getRangeAt(0).startOffset).toBe(2);
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('P');
                done();
            }, 100);
        });
        it('Use the executeCommand method to insert the audio', function (done) {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('p').firstChild as HTMLElement, 4);
            rteObj.executeCommand('insertAudio', {
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3',
                cssClass: 'e-rte-audio',
            });
            setTimeout(function () {
                expect(window.getSelection().getRangeAt(0).startOffset).toBe(2);
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('P');
                done();
            }, 100);
        });
    });
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
});