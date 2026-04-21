import { NodeSelection } from "../../../src/selection/selection";
import { RichTextEditor } from "../../../src/rich-text-editor/base";
import { ENTERKEY_EVENT_INIT, SHFIT_ENTERKEY_EVENT_INIT } from "../../constant.spec";
import { renderRTE, setCursorPoint, destroy, setSelection } from "../../rich-text-editor/render.spec";

const ENTER_KEY_DOWN_EVENT: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);

const ENTER_KEY_UP_EVENT: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);

const SHIFT_ENTER_KEY_DOWN_EVENT: KeyboardEvent = new KeyboardEvent('keydown', SHFIT_ENTERKEY_EVENT_INIT);

const SHIFT_ENTER_KEY_UP_EVENT: KeyboardEvent = new KeyboardEvent('keyup', SHFIT_ENTERKEY_EVENT_INIT);

describe('Enter Key plugin', ()=> {

    beforeAll((done: DoneFn)=> {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        link.onload= ()=> {
            done(); // Style should be loaded before done() called
        };
        link.onerror = (e) => {
            fail(`Failed to load stylesheet: ${link.href}`);
            done(); // still end the test run to avoid hanging
        };
        document.head.appendChild(link);

    });
    afterAll((done: DoneFn)=> {
        document.getElementById('materialTheme').remove();
        done();
    });
    describe('Enter Key: P, Shift Enter: BR', ()=> {
        describe('Enter action at start', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p>This is a paragraph content.</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('inserts a new paragraph before the current one and sets cursor correctly', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.firstElementChild;
                setCursorPoint(start.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><br></p><p>This is a paragraph content.</p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild);
                    done();
                }, 100);
            });

            it('preserves the block format when Enter is pressed at the beginning', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = `<h1>This is a paragraph content.</h1>`;
                const start: Element = editor.inputElement.firstElementChild;
                setCursorPoint(start.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<h1><br></h1><h1>This is a paragraph content.</h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild);
                    done();
                }, 100);
            });

            it('preserves inline formatting when Enter is pressed at the beginning', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = `<h1><b>This is a paragraph content.</b></h1>`;
                const start: Element = editor.inputElement.firstElementChild;
                setCursorPoint(start.firstChild.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<h1><b><br></b></h1><h1><b>This is a paragraph content.</b></h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild.firstChild);
                    done();
                }, 100);
            });

            it('preserves inline formatting for paragraphs', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = `<p><strong>This is a paragraph content.</strong></p>`;
                const start: Element = editor.inputElement.firstElementChild;
                setCursorPoint(start.firstChild.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><strong><br></strong></p><p><strong>This is a paragraph content.</strong></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild.firstChild);
                    done();
                }, 100);
            });

            it('creates new block with formatting and places cursor correctly', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = `<p><strong><br><br>This is a strong text with BR. Test the enter to get out of the text.</strong></p>`;
                const start: Element = editor.inputElement.querySelector('strong');
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('strong')[1];
                    const expectedElem: string = '<p><strong><br></strong></p><p><strong><br><br>This is a strong text with BR. Test the enter to get out of the text.</strong></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });

            it('enables undo button after Enter is pressed', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.firstElementChild;
                const undoButton: HTMLElement = editor.getToolbarElement().querySelector('.e-undo').parentElement.parentElement;
                const redoButton: HTMLElement = editor.getToolbarElement().querySelector('.e-redo').parentElement.parentElement;
                expect(undoButton.classList.contains('e-overlay')).toBe(true);
                expect(redoButton.classList.contains('e-overlay')).toBe(true);
                setCursorPoint(start.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    expect(undoButton.classList.contains('e-overlay')).toBe(false);
                    expect(redoButton.classList.contains('e-overlay')).toBe(true);
                    done();
                }, 100);
            });
        });

        describe('Enter action at end', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p>This is a paragraph content.</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('inserts a new paragraph after the current one and sets cursor correctly', (done: DoneFn) => {
                editor.focusIn();
                const end: Element = editor.inputElement.firstElementChild;
                setCursorPoint(end.firstChild, end.firstChild.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p>This is a paragraph content.</p><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });

            it('inserts new paragraph after heading and sets cursor correctly', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = '<h1>This is a paragraph content.</h1>';
                const end: Element = editor.inputElement.firstElementChild;
                setCursorPoint(end.firstChild, end.firstChild.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<h1>This is a paragraph content.</h1><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });

            it('preserves inline formatting when inserting new paragraph', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = '<h1><b>This is a paragraph content.</b></h1>';
                const end: Element = editor.inputElement.firstElementChild;
                setCursorPoint(end.firstChild.firstChild, end.firstChild.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<h1><b>This is a paragraph content.</b></h1><p><b><br></b></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild);
                    done();
                }, 100);
            });

            it('exits current block with BR and sets cursor in new paragraph', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.innerHTML = '<p><strong>This is a strong text with BR. Test the enter to get out of the text. <br><br></strong></p>';
                const end: Element = editor.inputElement.querySelector('strong');
                setCursorPoint(end, 2);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><strong>This is a strong text with BR. Test the enter to get out of the text. <br><br></strong></p><p><strong><br></strong></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild);
                    done();
                }, 100);
            });
        });

        describe('Enter action on Image', ()=>{
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"/></p>`
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('CASE 1: Enter infront of image. Should insert a new Paragraph before the image and cursor should be at the image.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.firstElementChild;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><br></p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 2: Enter after image. Should insert a new Paragraph after the image and cursor should be at the new Paragraph.', (done: DoneFn)=> {
                editor.focusIn();
                const end: Element = editor.inputElement.firstElementChild;
                setCursorPoint(end, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 3: Enter after image in a Paragraph with text content. Should split the paragraph to two paragraph.', (done: DoneFn)=> {
                editor.inputElement.innerHTML = '<p>This is a text with <img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 40px" class="e-rte-image e-img-inline"/> and more text</p>';
                editor.focusIn();
                const end: Element = editor.inputElement.firstElementChild;
                setCursorPoint(end, 2);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p>This is a text with <img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 40px" class="e-rte-image e-img-inline"></p><p>&nbsp;and more text</p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer.parentElement as Node).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });

        describe('Enter action on audio video', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"/></video></span><br/></p>
                            <p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"/></audio></span></span><br/></p>`
                });
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('CASE 1 Video Start Enter, Should create the Paragraph infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.querySelectorAll('p')[0];
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('p')[1] as Node;
                    const expectedElem: string = '<p><br></p><p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p><p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer.childNodes[range.startOffset] as HTMLElement).classList.contains('e-video-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 2 Video End Enter, Should create the Paragraph after and then maintain the cursor on the new inserted paragraph.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.querySelectorAll('p')[0];
                setCursorPoint(start, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('p')[1] as Node;
                    const expectedElem: string = '<p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p><p><br></p><p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 3 Audio Start Enter, Should create the Paragraph infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.querySelectorAll('p')[1];
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('p')[2] as Node;
                    const expectedElem: string = '<p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p><p><br></p><p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer.childNodes[range.startOffset] as HTMLElement).classList.contains('e-audio-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 4 Audio End Enter, Should create the Paragraph after and then maintain the cursor on the new inserted paragraph.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.querySelectorAll('p')[1];
                setCursorPoint(start, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('p')[2] as Node;
                    const expectedElem: string = '<p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p><p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br></p><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
            it ('CASE 5 Embed Video Start Enter, Should create the Paragraph infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<p><span class="e-embed-video-wrap" contenteditable="false" style="display: inline-block;"><span class="e-video-clickelem" style="cursor: auto;"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/lCxcTsOHrjo?si=IhPMtF4jeZbX1BT2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="e-video-inline e-rte-embed-url" style="min-width: 200px; max-width: 1491px; min-height: 90px; width: 362px; height: 181px; max-height: 381px;">&amp;ZeroWidthSpace;</iframe></span></span></p>`;
                editor.focusIn();
                const start: Element = editor.inputElement.querySelectorAll('p')[0];
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('p')[1] as Node;
                    const expectedElem: string = '<p><br></p><p><span class="e-embed-video-wrap" contenteditable="false" style="display: inline-block;"><span class="e-video-clickelem" style="cursor: auto;"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/lCxcTsOHrjo?si=IhPMtF4jeZbX1BT2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="e-video-inline e-rte-embed-url" style="min-width: 200px; max-width: 1491px; min-height: 90px; width: 362px; height: 181px; max-height: 381px;">&amp;ZeroWidthSpace;</iframe></span></span></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer.childNodes[range.startOffset] as HTMLElement).classList.contains('e-embed-video-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            });
        });

        describe('Selection Tests', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"/></p>`
                })
            });
            afterEach(()=> {
                destroy(editor);
            });
            it ('Should remove not the image in the selection.', (done: DoneFn) => {
                editor.focusIn();
                const start: Element = editor.inputElement.firstElementChild;
                setSelection(start, 0, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.children[1] as Node;
                    const expectedElem: string = '<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    done();
                }, 100);
            })
        });

        describe('1015094: Enter with P configuration', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content.<br/>You can try out a demo of this editor here.</p>`
                })
            });
            afterEach(()=> {
                destroy(editor);
            });
            it('Should split paragraph when pressing Shift+Enter and then Enter with P configuration', (done: DoneFn) => {
                editor.focusIn();
                const p: Element = editor.inputElement.firstElementChild;
                const firstTextNode: any = p.childNodes[0];
                // Place cursor at end of first text node (after "content.")
                setCursorPoint(firstTextNode, firstTextNode.textContent.length);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                    editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                    setTimeout(() => {
                        const expectedElem: string = '<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content.<br></p><p><br>You can try out a demo of this editor here.</p>';
                        expect(editor.inputElement.innerHTML).toBe(expectedElem);
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('1015094: BR elements with multiple Enter/Shift+Enter presses', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p>texting</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('should insert BRs after text when pressing Shift+Enter, then Enter, then Enter at end of text', (done: DoneFn) => {
                editor.focusIn();
                const p: Element = editor.inputElement.firstElementChild;
                const textNode: any = p.firstChild;
                // Place cursor at end of "texting"
                setCursorPoint(textNode, textNode.textContent.length);
                // First: Shift+Enter (should insert <br>)
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    // Second: Enter (should insert <br> then new <p>)
                    editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                    editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                    setTimeout(() => {
                        // Third: Enter (should insert another new <p>)
                        editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                        editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                        setTimeout(() => {
                            const expectedElem: string = '<p>texting<br><br></p><p><br></p><p><br></p>';
                            expect(editor.inputElement.innerHTML).toBe(expectedElem);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });

            it('should insert multiple BRs when pressing Shift+Enter twice at end of text', (done: DoneFn) => {
                editor.focusIn();
                const p: Element = editor.inputElement.firstElementChild;
                const textNode: any = p.firstChild;
                // Place cursor at end of "texting"
                setCursorPoint(textNode, textNode.textContent.length);
                // First: Shift+Enter (should insert <br>)
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    // Second: Shift+Enter (should insert another <br>)
                    editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                    editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                    setTimeout(() => {
                        // Third: Shift+Enter (should insert another <br>)
                        editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                        editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                        setTimeout(() => {
                            const expectedElem: string = '<p>texting<br><br><br><br></p>';
                            expect(editor.inputElement.innerHTML).toBe(expectedElem);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('1011822: Enter creates a <div> inside a <span> when editing image caption(Enter)', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p><span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:299"><span class="e-img-wrap"><img src="blob:http://127.0.0.1:5500/ba6f0242-1afa-4374-91d8-ca4e4e337934" class="e-rte-image" height="239" style="min-width: 0px; max-width: 1626px; min-height: 0px; width: inherit;"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span>&nbsp;</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('inserts a single <br> when Enter pressed at start of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                // place caret at the start of caption text
                setCursorPoint(caption.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });
            it('inserts a single <br> when Enter pressed in middle of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                // place caret in middle of caption text
                setCursorPoint(caption.firstChild, 4);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });

            it('inserts two <br> when Enter pressed at end of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                // place caret at end of caption text
                setCursorPoint(caption.firstChild, (caption.textContent || '').length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(/(<br[^>]*>\s*){2}$/.test(html)).toBe(true);
                    done();
                }, 100);
            });

            it('when selection inside caption, Enter replaces selection and inserts break', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                setSelection(caption.childNodes[0], 0, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });
        });

        describe('1011822: Enter creates a <div> inside a <span> when editing image caption(ShiftEnter)', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p><span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:299"><span class="e-img-wrap"><img src="blob:http://127.0.0.1:5500/ba6f0242-1afa-4374-91d8-ca4e4e337934" class="e-rte-image" height="239" style="min-width: 0px; max-width: 1626px; min-height: 0px; width: inherit;"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span>&nbsp;</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('inserts a single <br> when Shift+Enter pressed at start of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                setCursorPoint(caption.firstChild, 0);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });

            it('inserts a single <br> when Shift+Enter pressed in middle of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                setCursorPoint(caption.firstChild, 4);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });

            it('inserts a single <br> when Shift+Enter pressed at end of caption', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                setCursorPoint(caption.firstChild, (caption.textContent || '').length);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    // Ensure not two consecutive BRs at the end (Shift+Enter should insert a single BR)
                    expect(/(<br[^>]*>\s*){2}$/.test(html)).toBe(true);
                    done();
                }, 100);
            });

            it('when selection inside caption, Shift+Enter replaces selection and inserts break', (done: DoneFn) => {
                editor.focusIn();
                const caption: HTMLElement = editor.inputElement.querySelector('.e-img-caption-text') as HTMLElement;
                setSelection(caption.childNodes[0], 0, 1);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const html: string = caption.innerHTML;
                    expect(html.indexOf('<br') > -1).toBe(true);
                    expect(editor.inputElement.innerHTML.indexOf('<div') === -1).toBe(true);
                    done();
                }, 100);
            });
        });

        describe('1012287: Enter key deletes entire block when selecting text before a BR', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    enterKey: 'P',
                    value: `<p>Line 1<br>Line 2</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('Selecting text before a BR and pressing Enter preserves following content', (done: DoneFn) => {
                editor.focusIn();
                const p: Element = editor.inputElement.firstElementChild;
                const textNode: any = p.childNodes[0];
                setSelection(textNode, 0, textNode.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML).toBe('<p><br></p><p><br>Line 2</p>');
                    done();
                }, 100);
            });
        });
        
        describe('1012649: Shift+Enter creates empty p tag when cursor placed after the table', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    value: `<table><tbody><tr><td>Cell</td></tr></tbody></table>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });

            it('Shift+Enter before the table should not insert an empty paragraph', (done: DoneFn) => {
                editor.focusIn();
                const tableEl: HTMLTableElement = editor.inputElement.querySelector('table') as HTMLTableElement;
                // place caret before the table
                setCursorPoint(tableEl, 0);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const expectedElem: string = '<p><br></p><table class="e-rte-table"><tbody><tr><td>Cell</td></tr></tbody></table>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    done();
                }, 100);
            });

            it('Shift+Enter after the table should not insert an empty paragraph', (done: DoneFn) => {
                editor.focusIn();
                const tableEl: HTMLTableElement = editor.inputElement.querySelector('table') as HTMLTableElement;
                // place caret on the editable parent immediately after the table
                const parent: HTMLElement = editor.inputElement as HTMLElement;
                const tableIndex: number = Array.prototype.indexOf.call(parent.childNodes, tableEl);
                setCursorPoint(parent, tableIndex + 1);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const expectedElem: string = '<table class="e-rte-table"><tbody><tr><td>Cell</td></tr></tbody></table><p><br></p>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    done();
                }, 100);
            });
        });
    });

    describe('Enter Key: DIV, Shift Enter: BR', ()=> {
        let editor: RichTextEditor;
        beforeEach(()=> {
            editor = renderRTE({
                enterKey: 'DIV',
                value: `<div>This is a paragraph content.</div>`
            })
        });
        afterEach(()=>{
            destroy(editor);
        });
        it ('Should create div br on enter', (done: DoneFn)=>{
            editor.focusIn();
            const start: Element = editor.inputElement.firstElementChild;
            setCursorPoint(start.firstChild, start.firstChild.textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
            setTimeout(() => {
                const range: Range = editor.getRange();
                const cursorElement: Node = editor.inputElement.children[1] as Node;
                const expectedElem: string = '<div>This is a paragraph content.</div><div><br></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                expect(range.startContainer).toBe(cursorElement);
                done();
            }, 100);
        });
        // Migrated tests from spec/rich-text-editor/api/enter-key/enter-key.spec.ts
        it('Press enter at the end of the line', (done: DoneFn)=> {
            editor.inputElement.innerHTML = '<div>RTE Content</div>';
            const nodetext: any = editor.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div>RTE Content</div><div><br></div>');
                done();
            }, 100);
        });

        it('Press enter at the end of the line when styles are applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div>');
                done();
            }, 100);
        });

        it('Press enter at the start of the line', (done: DoneFn)=> {
            editor.value = '<div>RTE Content</div>';
            editor.inputElement.innerHTML = '<div>RTE Content</div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div><br></div><div>RTE Content</div>');
                done();
            }, 100);
        });

        it('Press enter at the start of the line when styles are applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong><br></strong></div><div><strong>​Line 1</strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('Press enter at the middle of the line', (done: DoneFn)=> {
            editor.value = '<div>RTE Content</div>';
            editor.inputElement.innerHTML = '<div>RTE Content</div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 2);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div>RT</div><div>E Content</div>');
                done();
            }, 100);
        });

        it('Press enter at the middle of the line when styles are applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 3);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div><strong>​Li</strong></div><div><strong>ne 1</strong></div>');
                done();
            }, 100);
        });

        it('When multiple lines - Press enter at the end of the first line', (done: DoneFn)=> {
            editor.value = '<div>Line 1</div><div>Line 2</div>';
            editor.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div>Line 2</div>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the end of the first line - Styles applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.childNodes[0].textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>');
                done();
            }, 100);
        });

        it('When multiple lines - Press enter at the start of the second line', (done: DoneFn)=> {
            editor.value = '<div>Line 1</div><div>Line 2</div>';
            editor.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div>Line 2</div>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the start of the second line - Styles applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div>';
            editor.dataBind();
            const nodetext: any = editor.inputElement.childNodes[1].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('When multiple lines - Press enter by selecting the whole line 2', (done: DoneFn)=> {
            editor.value = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
            editor.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
            editor.dataBind();
            const selectNode: any = editor.inputElement.childNodes[1].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, selectNode, selectNode, 0, selectNode.textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<div>Line 1</div><div><br></div><div><br></div><div>Line 3</div>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting the whole line 2 - Styles applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.dataBind();
            const selectNode: any = editor.inputElement.childNodes[1].childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, selectNode, selectNode, 0, selectNode.textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 3</strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('When multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3', (done: DoneFn)=> {
            editor.value = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
            editor.inputElement.innerHTML = '<div>Line 1</div><div>Line 2</div><div>Line 3</div>';
            editor.dataBind();
            const startNode: any = editor.inputElement.childNodes[1].childNodes[0];
            const endNode: any = editor.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div>Line 1</div><div>Li</div><div>ne 3</div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3 - Styles applied', (done: DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.dataBind();
            const startNode: any = editor.inputElement.childNodes[1].childNodes[0].childNodes[0];
            const endNode: any = editor.inputElement.childNodes[2].childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong>​Line 1</strong></div><div><strong>Li</strong></div><div><strong>ne 3</strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('When multiple lines - Press enter by selecting 2 empty lines - Coverage', (done: DoneFn)=> {
            editor.inputElement.innerHTML = '<div>Line 1</div><div><br></div><div><br></div><div>Line 2</div>';
            const startNode: any = editor.inputElement.childNodes[1];
            const endNode: any = editor.inputElement.childNodes[3];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div>Line 1</div><div><br></div><div>Line 2</div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting 2 empty lines - Styles applied - Coverage', (done: DoneFn)=> {
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>';
            const startNode: any = editor.inputElement.childNodes[1];
            const endNode: any = editor.inputElement.childNodes[3];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong>​Line 1</strong></div><div><strong><br></strong></div><div><strong>Line 2</strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
        
        it('Press enter by selecting few line from first line and few chars from third line', (done:DoneFn)=> {
            editor.inputElement.innerHTML = '<div>RTE Content</div><div>RTE Content</div><div>RTE Content</div>';
            const startNode: any = editor.inputElement.childNodes[0].childNodes[0];
            const endNode: any = editor.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 7, endNode.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div>RTE Con</div><div><br></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });

        it('Press enter by selecting few line from first line and few chars from third line', (done:DoneFn)=> {
            editor.value = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.inputElement.innerHTML = '<div><strong>​Line 1</strong></div><div><strong>Line 2</strong></div><div><strong>Line 3</strong></div>';
            editor.dataBind();
            const startNode: any = editor.inputElement.childNodes[0].childNodes[0].childNodes[0];
            const endNode: any = editor.inputElement.childNodes[2].childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 4, endNode.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                const expectedElem: string = '<div><strong>​Lin</strong></div><div><strong><br></strong></div>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe('Enter Key: DIV, Shift Enter: P', ()=> {
        let editor: RichTextEditor;
        beforeEach(()=> {
            editor = renderRTE({
                enterKey: 'DIV',
                shiftEnterKey: 'P',
                value: `<div>This is a paragraph content.</div>`
            })
        });
        afterEach(()=>{
            destroy(editor);
        });
        it ('Should create p br on shift enter', (done: DoneFn)=>{
            editor.focusIn();
            const start: Element = editor.inputElement.firstElementChild;
            setCursorPoint(start.firstChild, start.firstChild.textContent.length);
            editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_DOWN_EVENT);
            editor.inputElement.dispatchEvent(SHIFT_ENTER_KEY_UP_EVENT);
            setTimeout(() => {
                const range: Range = editor.getRange();
                const cursorElement: Node = editor.inputElement.children[1] as Node;
                const expectedElem: string = '<div>This is a paragraph content.</div><p><br></p>';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                expect(range.startContainer).toBe(cursorElement);
                done();
            }, 100);
        });
    });

    describe('Default Value Testing-', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'DIV'
            });
        });

        it('Default value when `DIV` is configured', function (): void {
            expect(rteObj.inputElement.innerHTML).toBe('<div><br></div>');
        });

        it('Default value when `BR` is configured', function (): void {
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            expect(rteObj.inputElement.innerHTML).toBe('<br>');
        });

        it('Default value when `P` is configured', function (): void {
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Source code Testing- ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: 'RTE Content',
                enterKey: 'DIV',
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteEle = rteObj.element;
        });

        it('Value when `DIV` is configured', (done:DoneFn)=> {
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            sourceTrgEle.click();
            expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === '<div>RTE Content</div>').toBe(true);
            (rteObj.element.querySelector('.e-rte-srctextarea') as any).value = '';
            const previewTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            previewTrgEle.click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<div><br></div>');
                done();
            }, 100);
        });

        it('Default value when `BR` is configured', (done:DoneFn)=> {
            rteObj.value = 'RTE BR configured';
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            sourceTrgEle.click();
            expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured');
            expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === 'RTE BR configured').toBe(true);
            (rteObj.element.querySelector('.e-rte-srctextarea') as any).value = '';
            const previewTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            previewTrgEle.click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<br>');
                done();
            }, 100);
        });

        it('Default value when `P` is configured', (done: DoneFn)=> {
            rteObj.value = 'RTE P configured';
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            sourceTrgEle.click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>RTE P configured</p>');
                expect((rteObj.element.querySelector('.e-rte-srctextarea') as any).value === '<p>RTE P configured</p>').toBe(true);
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter Key Press at List', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<ol><li>List 1</li><li><br></li></ol>',
                enterKey: 'P'
            });
        });

        it('Should exit the List when Press enter by at the empty list - P', (done: DoneFn) => {
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, 0);
            rteObj.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><p><br></p>');
                done();
            }, 100);
        });

        it('Should exit the List when Press enter by at the empty list - DIV', (done: DoneFn) => {
            rteObj.enterKey = 'DIV'
            rteObj.value = '<ol><li>List 1</li><li><br></li></ol>';
            rteObj.inputElement.innerHTML = '<ol><li>List 1</li><li><br></li></ol>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, 0);
            rteObj.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><div><br></div>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('1013978: Enter inside list in table cell', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                enterKey: 'P',
                value: `
                        <table class="e-rte-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <ul>
                                            <li class="start">Item 1</li>
                                        </ul>
                                    </td>
                                    <td><br></td>
                                </tr>
                            </tbody>
                        </table>
                    `
            });
        });
        afterAll(() => {
            destroy(editor);
        });

        it('creates a new list item when pressing Enter inside a list in a table cell', (done: DoneFn) => {
            const li = editor.inputElement.querySelector('li.start');
            setCursorPoint(li.firstChild as Element, li.firstChild.textContent.length);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
            setTimeout(() => {
                const lis = editor.inputElement.querySelectorAll('td ul li');
                expect(lis.length).toBe(2);
                done();
            }, 50);
        });
    });

    describe('Enter Key Press at Heading ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<h1>Heading</h1>',
                enterKey: 'P'
            });
        });

        it('Should Create P Tag when enter key press at the end of the heading.', (done: DoneFn) => {
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, startNode.length);
            rteObj.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><p><br></p>');
                done();
            }, 100);
        });

        it('Should Create DIV Tag when enter key press at the end of the heading.', (done: DoneFn) => {
            rteObj.enterKey = 'DIV'
            rteObj.value = '<h1>Heading</h1>';
            rteObj.inputElement.innerHTML = '<h1>Heading</h1>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, startNode.length);
            rteObj.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><div><br></div>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter Key Press at Horizontal Line', () => {
        let editor: RichTextEditor;
        beforeAll(()=> {

        });
        afterAll(()=> {

        });
        it ('')
    });

    describe('1011650: Selecting an image along with text and pressing Enter throws a console error.', () => {
        let editor: RichTextEditor;
        let consoleSpy: jasmine.Spy;
        beforeEach(() => {
            consoleSpy = jasmine.createSpy('console');
            editor = renderRTE({
                enterKey: 'P',
                value: `<p> The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>. </p>\n<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('does not call console.error when selection contains text and image and Enter is pressed', (done: DoneFn) => {
            editor.focusIn();
            const startTextNode: Node = editor.inputElement.childNodes[0].childNodes[0];
            const imageNode: Node = editor.inputElement.childNodes[1].childNodes[0];
            const nodeSelection: any = new NodeSelection();
            nodeSelection.setSelectionText(document, startTextNode, imageNode, 10, 0);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
            setTimeout(() => {
                expect(consoleSpy).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });
});

