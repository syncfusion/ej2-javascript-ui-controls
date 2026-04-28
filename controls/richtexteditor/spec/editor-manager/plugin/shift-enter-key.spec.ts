import { RichTextEditor } from "../../../src";
import { ENTERKEY_EVENT_INIT, SHFIT_ENTERKEY_EVENT_INIT } from "../../constant.spec";
import { renderRTE, setCursorPoint, destroy, setSelection } from "../../rich-text-editor/render.spec";

const ENTER_KEY_DOWN_EVENT: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);

const ENTER_KEY_UP_EVENT: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);

const SHIFT_ENTER_KEY_DOWN_EVENT: KeyboardEvent = new KeyboardEvent('keydown', SHFIT_ENTERKEY_EVENT_INIT);

const SHIFT_ENTER_KEY_UP_EVENT: KeyboardEvent = new KeyboardEvent('keyup', SHFIT_ENTERKEY_EVENT_INIT);

describe('Shift Enter Key ', ()=> {

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
    describe('Enter Key: BR, Shift Enter: P', ()=> {
        describe('Enter at Start', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'BR',
                    shiftEnterKey: 'P',
                    value: `This is a paragraph content.`
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('inserts one br before the text node and cursor position remains unchanged.', (done: DoneFn)=>{
                editor.focusIn();
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1] as Node;
                    const expectedElem: string = '<br>This is a paragraph content.';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('inserts strong and br before the current text node and cursor remains unchanged,', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<strong>This is a bold text</strong>`;
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start.firstChild, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1] as Node;
                    const expectedElem: string = '<br><strong>This is a bold text</strong>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('insert a br tag infront of text node and then cursor remains unchanged.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<h1>This is a text node.</h1>';
                const start: Text = editor.inputElement.firstElementChild.firstChild as Text;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.firstElementChild.childNodes[1];
                    const expectedElem: string = '<h1><br>This is a text node.</h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('block node: insert a br tag infront of text node and then cursor remains unchanged.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<h1><strong>This is a text node.</strong></h1>';
                const start: Text = editor.inputElement.firstElementChild.firstChild.firstChild as Text;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.firstElementChild.childNodes[1];
                    const expectedElem: string = '<h1><br><strong>This is a text node.</strong></h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });

        describe('Enter at End', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'BR',
                    value: `This is a paragraph content.`
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('inserts two br after the text node and cursor position is set to second br.', (done: DoneFn)=>{
                editor.focusIn();
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, start.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2] as Node;
                    const expectedElem: string = 'This is a paragraph content.<br><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it ('inserts two br with strong after strong ndoe and then cursor position should be in second br', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<strong>This is a bold text</strong>`;
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start.firstChild, start.firstChild.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2].childNodes[0] as Node;
                    const expectedElem: string = '<strong>This is a bold text</strong><br><strong><br></strong>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it('block node : inserts two br tag after the text node and maintain the cursor at second br', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<h1>This is a heading</h1>`;
                const start: Text = editor.inputElement.firstElementChild.firstChild as Text;
                setCursorPoint(start, start.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1];
                    const expectedElem: string = '<h1>This is a heading</h1><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it('block node : inserts two br tag after the text node and maintain the cursor at second br', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<h1><strong>This is a heading</strong></h1>`;
                const start: Text = editor.inputElement.firstElementChild.firstChild.firstChild as Text;
                setCursorPoint(start, start.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1].childNodes[0];
                    const expectedElem: string = '<h1><strong>This is a heading</strong></h1><strong><br></strong>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it('br node : inserts one br tag after the current br and maintain the cursor at new br', (done: DoneFn) => {
                editor.inputElement.innerHTML = `Content`;
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, start.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2];
                    const expectedElem: string = 'Content<br><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                    editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                    setTimeout(() => {
                        const expectedElem: string = 'Content<br><br><br>';
                        expect(editor.inputElement.innerHTML).toBe(expectedElem);
                        const range: Range = editor.getRange();
                        const cursorElement: Node = editor.inputElement.childNodes[3];
                        expect(range.startContainer).toBe(cursorElement);
                        expect(range.startOffset).toBe(0);
                        done();
                    }, 100);
                }, 100);
            });

            it ('1015094: inserts a br before an existing br when cursor is at end before a br and moves cursor to the new br', (done: DoneFn) => {
                editor.inputElement.innerHTML = `The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content.<br/>You can try out a demo of this editor here.`;
                editor.focusIn();
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, start.textContent.length);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2];
                    const expectedElem: string = 'The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content.<br><br>You can try out a demo of this editor here.';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });

        describe('Enter at Middle', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'BR',
                    shiftEnterKey: 'P',
                    value: `This is a paragraph content.`
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('splits the text to two text nodes and then insert one br before the second text node and maintain the cursor at start.', (done: DoneFn)=>{
                editor.focusIn();
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, 19);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2] as Node;
                    const expectedElem: string = 'This is a paragraph<br>&nbsp;content.';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it ('splits the text to strong node to two node and then insert the one br before the second strong node and then maintain the cursor at second node start', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<strong>This is a bold text</strong>`;
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start.firstChild, 9);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2] as Node;
                    const expectedElem: string = '<strong>This is a</strong><br><strong>&nbsp;bold text</strong>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement.firstChild);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it ('block node: splits the text inside the heading and then insert a br tag inside the heading', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<h1>This is a heading</h1>`;
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start.firstChild, 9);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[0].childNodes[2];
                    const expectedElem: string = '<h1>This is a<br>&nbsp;heading</h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });

            it ('block node: splits the strong inside the heading and then insert a br tag inside the heading', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<h1><strong>This is a heading</strong></h1>`;
                const start: Text = editor.inputElement.firstElementChild.firstChild as Text;
                setCursorPoint(start.firstChild, 9);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[0].childNodes[2].firstChild;
                    const expectedElem: string = '<h1><strong>This is a</strong><br><strong>&nbsp;heading</strong></h1>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });

        describe('Enter at Image', () => {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'BR',
                    value: '<img alt="Editor Features" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 40px" class="e-rte-image e-img-inline"/>'
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('CASE 1: Enter infront of image. Should insert a new BR before the image and cursor should be at the image.', (done: DoneFn)=> {
                editor.focusIn();
                const start: Text = editor.inputElement.firstChild as Text;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1] as Node;
                    const expectedElem: string = '<br><img alt="Editor Features" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 40px" class="e-rte-image e-img-inline">';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('CASE 2: Enter after of image. Should insert a new BR after the image and cursor should be at the new BR.', (done: DoneFn)=> {
                editor.focusIn();
                const start: HTMLElement = editor.inputElement as HTMLElement;
                setCursorPoint(start, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[2];
                    const expectedElem: string = '<img alt="Editor Features" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 40px" class="e-rte-image e-img-inline"><br><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });

        describe('Enter at audio video', () => {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    enterKey: 'BR',
                    shiftEnterKey: 'P'
                })
            });
            afterEach(()=>{
                destroy(editor);
            });
            it ('CASE 1 Video Start Enter, Should create the Line Break infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span>';
                editor.focusIn();
                const start: Element = editor.inputElement;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1];
                    const expectedElem: string = '<br><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer as HTMLElement).classList.contains('e-video-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('CASE 2 Video End Enter, Should create the Line Break after and then maintain the cursor on the new inserted Line Break.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span>';
                editor.focusIn();
                const start: Element = editor.inputElement;
                setCursorPoint(start, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('br')[1] as Node;
                    const expectedElem: string = '<span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('CASE 3 Audio Start Enter, Should create the Line Break infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span>';
                editor.focusIn();
                const start: Element = editor.inputElement;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1];
                    const expectedElem: string = '<br><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer as HTMLElement).classList.contains('e-audio-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('CASE 4 Audio End Enter, Should create the Line Break after and then maintain the cursor on the new inserted Line Break.', (done: DoneFn) => {
                editor.inputElement.innerHTML = '<span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span>';
                editor.focusIn();
                const start: Element = editor.inputElement;
                setCursorPoint(start, 1);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.querySelectorAll('br')[1] as Node;
                    const expectedElem: string = '<span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3"></audio></span></span><br><br>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
            it ('CASE 5 Embed Video Start Enter, Should create the Line Break infront and then maintain the cursor on the same place.', (done: DoneFn) => {
                editor.inputElement.innerHTML = `<span class="e-embed-video-wrap" contenteditable="false" style="display: inline-block;"><span class="e-video-clickelem" style="cursor: auto;"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/lCxcTsOHrjo?si=IhPMtF4jeZbX1BT2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="e-video-inline e-rte-embed-url" style="min-width: 200px; max-width: 1491px; min-height: 90px; width: 362px; height: 181px; max-height: 381px;">&amp;ZeroWidthSpace;</iframe></span></span>`;
                editor.focusIn();
                const start: Element = editor.inputElement;
                setCursorPoint(start, 0);
                editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                setTimeout(() => {
                    const range: Range = editor.getRange();
                    const cursorElement: Node = editor.inputElement.childNodes[1];
                    const expectedElem: string = '<br><span class="e-embed-video-wrap" contenteditable="false" style="display: inline-block;"><span class="e-video-clickelem" style="cursor: auto;"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/lCxcTsOHrjo?si=IhPMtF4jeZbX1BT2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="e-video-inline e-rte-embed-url" style="min-width: 200px; max-width: 1491px; min-height: 90px; width: 362px; height: 181px; max-height: 381px;">&amp;ZeroWidthSpace;</iframe></span></span>';
                    expect(editor.inputElement.innerHTML).toBe(expectedElem);
                    expect((range.startContainer as HTMLElement).classList.contains('e-embed-video-wrap')).toBe(true);
                    expect(range.startContainer).toBe(cursorElement);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            });
        });
    });

    describe('Selection Tests', ()=> {
        let editor: RichTextEditor;
        beforeEach(()=> {
            editor = renderRTE({
                enterKey: 'BR',
                value: `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"/>`
            })
        });
        afterEach(()=> {
            destroy(editor);
        });
        it ('Should remove the image in the selection.', (done: DoneFn) => {
            editor.focusIn();
            const start: Element = editor.inputElement;
            setSelection(start, 0, 1);
            editor.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
            editor.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
            setTimeout(() => {
                const range: Range = editor.getRange();
                const cursorElement: Node = editor.inputElement.children[1] as Node;
                const expectedElem: string = '<br><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline">';
                expect(editor.inputElement.innerHTML).toBe(expectedElem);
                expect(range.startContainer).toBe(cursorElement);
                done();
            }, 100);
        })
    });
});
