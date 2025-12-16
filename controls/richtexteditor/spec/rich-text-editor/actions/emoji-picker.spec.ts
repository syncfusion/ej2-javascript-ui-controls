/**
 * RTE - Emoji picker action spec
 */
import { createElement, detach } from "@syncfusion/ej2-base";
import { dispatchEvent, RichTextEditor } from "../../../src/rich-text-editor/index";
import { ToolbarType } from "../../../src/common/enum";
import { ActionBeginEventArgs  } from "../../../src/common/interface";
import { destroy, renderRTE, setCursorPoint } from "./../render.spec";
import { EditorManager } from "../../../src";
import { ARROW_DOWN_EVENT_INIT, ARROW_LEFT_EVENT_INIT, ARROW_UP_EVENT_INIT, BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT, ESCAPE_KEY_EVENT_INIT } from "../../constant.spec";

let keyboardEventArgs: any = {
    preventDefault: function () { },
    keyCode: 186,
    shiftKey: true,
    altKey: false,
    ctrlKey: false,
    char: '',
    key: ':',
    charCode: 13,
    which: 13,
    code: 'Semicolon',
    action: 'Semicolon',
    type: 'keydown'
};

describe('Emoji picker module', () => {
    describe('When we click on the emoji toolbar icon render the emoji picker ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"> </p>`;
        beforeAll(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                value: innerHTML,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(defaultRTE);
        });
        it('Render emoji picker module', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
        it('when initial render input box should focus', () => {
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            expect(inputEle === document.activeElement).toBe(true);
        });
        it('when document click emoji picker should close ', () => {
            const inputEle: HTMLElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.click();
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.element.querySelector('.e-popup-open')).toBe(null);
        });
        it('when click on the toolbar emoji correspondingly focus on the set of first emoji', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const toolbarEle: HTMLElement = rteObj.element.querySelector('[title="Smilies & People"]');
            const spanELe: HTMLElement = toolbarEle.querySelector('span');
            rteObj.currentTarget = spanELe;
            spanELe.click();
            expect(document.activeElement.nodeName === 'BUTTON').toBe(true);
        });
        it('when click on the document the popup will close ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            dispatchEvent(rteObj.element, 'mousedown');
            expect(rteObj.element.querySelector('.e-popup-open')).toBe(null);
        });
        it('Filter the emoji in input box', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "grinning";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button')[0].innerHTML).toBe('😀');
            inputEle.value = 'sssssssssssssssss';
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelectorAll('.e-rte-emojiSearch-noEmoji')).not.toBe(null);
            inputEle.value = '';
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
        });
        it('showSearch box has to false  ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            rteObj.emojiPickerSettings.showSearchBox = false;
            element.click();
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-btn');
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).toBe(null);
        });
        it('space with colon (:) in rte content render the popup', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            rteObj.emojiPickerSettings.showSearchBox = true;
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            setCursorPoint(firstP.firstChild as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-toolbar')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
        it('space with colon (:) in rte content render the popup and keyboard action - down arrow', () => {
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 40,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowDown',
                charCode: 40,
                which: 40,
                code: 'ArrowDown',
                action: 'ArrowDown',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it('space with colon (:) in rte content render the popup and keyboard action - up arrow', () => {
            (<any>rteObj).keyDown(keyboardEventArgs);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 38,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowUp',
                charCode: 38,
                which: 38,
                code: 'ArrowUp',
                action: 'ArrowUp',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it('space with colon (:) in rte content render the popup and keyboard action - right arrow', () => {
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 39,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowRight',
                charCode: 39,
                which: 39,
                code: 'ArrowRight',
                action: 'ArrowRight',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            expect(btnGroup[1].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[1] === document.activeElement).toBe(true);
        });
        it('space with colon (:) in rte content render the popup and keyboard action - left arrow', () => {
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 37,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowLeft',
                charCode: 37,
                which: 37,
                code: 'ArrowLeft',
                action: 'ArrowLeft',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it('Insert the emoji in rte content ,close the popup ', () => {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            btnGroup[0].click();
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(firstP.innerHTML).toBe('😀');
        });
        it('Filter the emoji render the popup and keyboard action - down arrow', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "g";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button');
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 40,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowDown',
                charCode: 40,
                which: 40,
                code: 'ArrowDown',
                action: 'ArrowDown',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
            expect(btnGroup[0].getAttribute('aria-label') === "Grinning face").toBe(true);
        });
        it('Filter the emoji render the popup and keyboard action - right arrow', () => {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button');
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 39,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowRight',
                charCode: 39,
                which: 39,
                code: 'ArrowRight',
                action: 'ArrowRight',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(btnGroup[1].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[1] === document.activeElement).toBe(true);
        });
        it('Filter the emoji render the popup and keyboard action - up arrow', () => {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button');
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 38,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowUp',
                charCode: 38,
                which: 38,
                code: 'ArrowUp',
                action: 'ArrowUp',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it('Filter the emoji render the popup and keyboard action - left arrow', () => {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button');
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 37,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowLeft',
                charCode: 37,
                which: 37,
                code: 'ArrowLeft',
                action: 'ArrowLeft',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it('Insert the emoji when press the click action', () => {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojisearch-btn button');
            btnGroup[0].click();
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(firstP.innerHTML).toBe('😀😀');
        });
        it('When click the toolbar emoji the corresponding emoji set of first icon focused ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const toolbarEle: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll(".e-rte-emojipicker-toolbar button");
            toolbarEle[0].click();
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            expect(btnGroup[0].classList.contains('e-focus')).toBe(true);
            expect(btnGroup[0] === document.activeElement).toBe(true);
        });
        it("When press escape key the popup is closed", () => {
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 27,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'Escape',
                charCode: 27,
                which: 27,
                code: 'Escape',
                action: 'Escape',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
        });
        it('When click on the document popup will close   ', (done) => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const ele: HTMLElement = rteObj.element.querySelector('.e-rte-content');
            let evnArg = {
                args: { target: ele, srcElement: ele },
            };
            rteObj.notify('docClick', evnArg);
            setTimeout(() => {
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                 done();
            }, 100);
        });
        it('In scroll the emoji correspondingly the tollbar set has in hover state  ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const element1: HTMLElement = rteObj.element.querySelector(".e-rte-emojipicker-btn");
            element1.style.overflow = "auto";
            element1.style.height = "100px";
            element1.style.width = "100px";
            element1.scrollTo(0, 600);
            expect(rteObj.element.querySelector('.e-selected')).not.toBe(null);
        });
        it('space with colon (:) and filter the emoji', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const firstP: HTMLElement = rteObj.inputElement.querySelector('#rte-p');
            firstP.textContent = " ";
            setCursorPoint(firstP, 1);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 186,
                which: 186,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            firstP.textContent = "emoji :m";
            keyboardEventArgs = {
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
                type: 'keydown'
            };
            const range: Range = document.createRange();
            const selection = window.getSelection();
            range.setStart(firstP.firstChild, 8); // Assuming 'm' is at index 8
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            (<any>rteObj).keyUp(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojisearch-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojisearch-btn button').innerHTML).toBe('👨');
        });
    });
    describe('Emoji picker - Escape key focus fix', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
    
        beforeEach((done: DoneFn) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
    
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    
        it('should close the emoji picker and return focus to the button when Escape key is pressed', (done: Function) => {
            const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            emojiButton.click();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            const escapeEvent: KeyboardEvent = new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(escapeEvent);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(document.activeElement).toBe(emojiButton);
            done();
        });
    });
    describe('Emoji picker - iconcss property' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        beforeEach( (done: DoneFn) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach( (done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('In tollbar render the iconCss property', (done: Function) => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.element.querySelector('.e-emoji')).not.toBe(null);
            done();
        });
        it('Focus the input box by keyboard Navigation', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 40,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowDown',
                charCode: 40,
                which: 40,
                code: 'ArrowDown',
                action: 'ArrowDown',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 38,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowUp',
                charCode: 38,
                which: 38,
                code: 'ArrowUp',
                action: 'ArrowUp',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(document.activeElement.nodeName === "INPUT").toBe(true);
        });
        it('Reset the emoji icon when focus out ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputELe: HTMLElement = rteObj.element.querySelector('.e-rte-emoji-search');
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 40,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: 'ArrowDown',
                charCode: 40,
                which: 40,
                code: 'ArrowDown',
                action: 'ArrowDown',
                type: 'keydown',
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 38;
            (<any>rteObj).keyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 40;
            keyboardEventArgs.srcElement = inputELe;
            (<any>rteObj).keyDown(keyboardEventArgs);
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(document.activeElement.nodeName === "BUTTON").toBe(true);
        });
    });
    describe('many space with colon - text get deleted ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( (done: DoneFn) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach( (done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('many space with colon - text get deleted issue resolved ', (done: Function) => {
                const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
                const textNode = firstP.childNodes[0];
                textNode.textContent = "Emoji picker : : : : : : : ";
                const range = document.createRange();
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                keyboardEventArgs.keyCode = 186;
                keyboardEventArgs.shiftKey = true;
            (<any>rteObj).keyDown(keyboardEventArgs);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            btnGroup[0].click();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(firstP.innerHTML).toBe('Emoji picker : : : : : : 😀');
            done();
        });
    });
    describe('Bug 963296: Empty Bullet List Retains in Editor After Selecting All Content and Inserting Emoji ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-1p">Emoji picker : : : : : : :  </p><p id="rte-2p">Hello</p>`;
        beforeEach((done: DoneFn) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value: innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('selecting all element in editor and inserting emoji but does not remove empty node from dom', (done: Function) => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-1p');
            const textNode = firstP.childNodes[0];
            textNode.textContent = "";
            const secondP: Element = (rteObj as any).inputElement.querySelector('#rte-2p');
            var range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(secondP.firstChild, textNode.textContent.length);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs.keyCode = 186;
            keyboardEventArgs.shiftKey = true;
            (<any>rteObj).keyDown(keyboardEventArgs);
            textNode.textContent = ":";
            range.setStart(textNode, 0);
            range.setEnd(secondP.firstChild, secondP.firstChild.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            btnGroup[0].click();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(rteObj.inputElement.innerHTML).toBe('<p>😀</p>');
            done();
        });
    });
    describe('In rich editor content - intial we type colon render the popup ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">:</p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('insert the emot icon ', (done: Function) => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const textNode = firstP.childNodes[0];
            textNode.textContent = "";
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs.keyCode = 186;
            keyboardEventArgs.shiftKey = true;
            (<any>rteObj).keyDown(keyboardEventArgs);
            textNode.textContent = ":";
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            btnGroup[0].click();
            setTimeout(function () {
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                expect(firstP.innerHTML).toBe('😀');
                done();
            }, 100);
        });
    });
    describe('When we call the public method of emoji picker' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('emoji picker popup render', () => {
            rteObj.showEmojiPicker();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
    });
    describe('When toolbar is in extended the emoji picker popup z-index has greater than toolbar' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    type: ToolbarType.Expand,
                    items: ['EmojiPicker','Bold', 'Italic', 'Underline', 'StrikeThrough',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                    'Outdent', 'Indent', '|',
                    'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
                    'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('emoji picker popup z-index greater than toolbar', () => {
            const extendEle: HTMLElement = rteObj.element.querySelector('.e-toolbar-extended');
            extendEle.style.zIndex = '100000';
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.emojiPickerModule.popupObj.zIndex).toBe(100001);
        });
    });
    describe('Without using iconCss property and using combined emoji as button' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                emojiPickerSettings:{
                    iconsSet: [{name:"Smileys & People", code:"1f600",
                                icons: [{code:"1f600", desc:"Grinning face"},
                                {code:"1f601",desc:"Grinning Face with Smiling Eyes"},
                                {code:"1f469-1f469-1f466",desc:"Woman Woman Boy"},]}]
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('Render toolbar emojis as any unicode', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.element.querySelector('.e-tbar-btn-text').innerHTML).toBe('😀');
            expect(rteObj.element.querySelectorAll('.e-btn')[4].innerHTML).toBe('👩‍👩‍👦');
        });
    });
    describe('Space follwed by colon render the popup' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>
        <p class = "scroll">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum, dui ut imperdiet sodales, sem lacus volutpat risus, et euismod nunc felis ut risus</p>`;
        beforeEach( (done: Function) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                height: 100,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach( (done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('Scroll the Editor the popup has closed', (done: Function) => {
                const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
                const height: HTMLElement = (rteObj as any).element.querySelector('.e-rte-content');
                height.style.height = '100px';
                height.style.overflow = 'auto';
                const textNode = firstP.childNodes[0];
                textNode.textContent = "Emoji picker : : : : : : : ";
                const range = document.createRange();
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                keyboardEventArgs = {
                    preventDefault: function () { },
                    keyCode: 186,
                    shiftKey: true,
                    altKey: false,
                    ctrlKey: false,
                    char: '',
                    key: ':',
                    charCode: 13,
                    which: 13,
                    code: 'Semicolon',
                    action: 'Semicolon',
                    type: 'keydown'
                };
                (<any>rteObj).keyDown(keyboardEventArgs);
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
                const scrollEle: HTMLElement = rteObj.element.querySelector('.scroll');
                scrollEle.scrollIntoView();
                (<any>rteObj).emojiPickerModule.contentscroll({});
                setTimeout(function () {
                    expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                    done();
                },100);
        });
    });
    describe('ArrowDown action of set of last emoji', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value: innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('ArrowDown action of set of last emoji', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const emojiDiv: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group');
            emojiDiv[0].style.display = 'grid';
            emojiDiv[0].style.gridTemplateColumns = 'repeat(6, 1fr)';
            emojiDiv[1].style.display = 'grid';
            emojiDiv[1].style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[23].focus();
            emoji[23].classList.add('e-focus');
            const arrowDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowDownEvent);
            expect(document.activeElement.innerHTML).toBe('🧑');
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowDownEvent);
            expect(document.activeElement.innerHTML).toBe('🐹');
        });
    });
    describe('ArrowUp action for second set of emoji to first set of last emoji' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('ArrowUp action of set emoji', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const emojiDiv:NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group');
            emojiDiv[0].style.display = 'grid';
            emojiDiv[0].style.gridTemplateColumns = 'repeat(6, 1fr)';
            emojiDiv[1].style.display = 'grid';
            emojiDiv[1].style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[33].focus();
            emoji[33].classList.add('e-focus');
            const arrowUpEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowUpEvent);
            expect(document.activeElement.innerHTML).toBe('🧑');
        });
    });
    describe('ArrowUp action for second set of emoji to first set emoji' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('ArrowUp action of set emoji', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const emojiDiv:NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group');
            emojiDiv[0].style.display = 'grid';
            emojiDiv[0].style.gridTemplateColumns = 'repeat(6, 1fr)';
            emojiDiv[1].style.display = 'grid';
            emojiDiv[1].style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[29].focus();
            emoji[29].classList.add('e-focus');
            const arrowUpEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowUpEvent);
            expect(document.activeElement.innerHTML).toBe('💂');
        });
    });
    describe('ArrowUp action in emoji filtering case ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('ArrowUp action in emoji filtering case ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "g";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            const emojiDiv: HTMLElement = document.querySelector('.e-rte-emojisearch-btn');
            emojiDiv.style.display = 'grid';
            emojiDiv.style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojisearch-btn button');
            emoji[11].focus();
            emoji[11].classList.add('e-focus');
            const arrowUpEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowUpEvent);
            expect(document.activeElement.innerHTML).toBe('😄');
        });
    });
    describe('ArrowDown action in emoji filtering case ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( (done: DoneFn) => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach( (done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('ArrowDown action in emoji filtering case ', (done: Function) => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "g";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            const emojiDiv: HTMLElement = document.querySelector('.e-rte-emojisearch-btn');
            emojiDiv.style.display = 'grid';
            emojiDiv.style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojisearch-btn button');
            emoji[5].focus();
            emoji[5].classList.add('e-focus');
            const arrowDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowDownEvent);
            setTimeout(() => {
                expect(document.activeElement.innerHTML).toBe('🎮');
                done();
            }, 100);
        });
    });
    describe('ArrowLeft action in emoji filtering case ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('ArrowLeft action in emoji filtering case ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "g";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            const emojiDiv: HTMLElement = document.querySelector('.e-rte-emojisearch-btn');
            emojiDiv.style.display = 'grid';
            emojiDiv.style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojisearch-btn button');
            emoji[5].focus();
            emoji[5].classList.add('e-focus');
            const arrowLeftEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_LEFT_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowLeftEvent);
            expect(document.activeElement.innerHTML).toBe('😅');
        });
    });
    describe('When press Backspace key emoji popup will be closed' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('space followed by colon', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const height: HTMLElement = (rteObj as any).element.querySelector('.e-rte-content');
            height.style.height = '100px';
            height.style.overflow = 'auto';
            const textNode = firstP.childNodes[0];
            textNode.textContent = "Emoji picker : : : : : : : ";
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 13,
                which: 13,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            textNode.textContent = "Emoji picker : : : : : : :";
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 8,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 8,
                which: 8,
                code: 'Backspace',
                action: 'Backspace',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
        });
    });
    describe('Space followed by colon emoji popup will be open ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('After that space emoji popup will be closed', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const height: HTMLElement = (rteObj as any).element.querySelector('.e-rte-content');
            height.style.height = '100px';
            height.style.overflow = 'auto';
            const textNode = firstP.childNodes[0];
            textNode.textContent = "Emoji picker : : : : : : : ";
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 13,
                which: 13,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            textNode.textContent = "Emoji picker : : : : : : :";
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 32,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 32,
                which: 32,
                code: 'Space',
                action: 'Space',
                type: 'Space'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
        });
    });
    describe('When we press the enter key insert the emoji ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('Insert the emoji into editor', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const height: HTMLElement = (rteObj as any).element.querySelector('.e-rte-content');
            height.style.height = '100px';
            height.style.overflow = 'auto';
            const textNode = firstP.childNodes[0];
            textNode.textContent = "Emoji picker : : : : : : : ";
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 13,
                which: 13,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[0].focus();
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 13,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 13,
                which: 13,
                code: 'Enter',
                action: 'Enter',
                type: 'Enter',
                target: emoji[0]
            };
            (<any>rteObj).emojiPickerModule.onKeyDown({preventDefault: function () { },keyCode: 13, target: emoji[0], type: 'keydown'});
            expect(document.activeElement.innerHTML).toBe('<p id="rte-p">Emoji picker : : : : : : 😀</p>');
        });
    });
    describe('In filtering case after key action ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('When focused in first emoji to keyup - focus the input box', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "g";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            const emojiDiv: HTMLElement = document.querySelector('.e-rte-emojisearch-btn');
            emojiDiv.style.display = 'grid';
            emojiDiv.style.gridTemplateColumns = 'repeat(6, 1fr)';
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojisearch-btn button');
            emoji[0].focus();
            emoji[0].classList.add('e-focus');
            const arrowUpEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT);
            document.querySelector('.e-rte-emojipicker-popup').dispatchEvent(arrowUpEvent);
            expect(document.activeElement.nodeName).toBe('INPUT');
        });
    });
    describe('In filtering case show the No emoji case' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('If give correct emoji name no emoji content need to remove', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            inputEle.value = "gaaaaaaa";
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelector('.e-rte-emojiSearch-noEmoji')).not.toBe(null);
            inputEle.value = "g";
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelector('.e-rte-emojiSearch-noEmoji')).toBe(null);
        });
    });
    describe('When we call the public method of emoji picker' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                showTooltip: false,
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('emoji picker popup render', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const range = document.createRange();
            range.setStart(firstP, firstP.textContent.length);
            range.setEnd(firstP, firstP.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            rteObj.showEmojiPicker();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
    });
    describe('space follwed by colon - Keyup action ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('Filter Action and remove the filter reset the emoji', () => {
            const firstP: HTMLElement = rteObj.inputElement.querySelector('#rte-p');
            firstP.textContent = " ";
            const focusELe: HTMLElement = rteObj.element.querySelector('.e-content');
            focusELe.focus();
            setCursorPoint(firstP, 1);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 186,
                which: 186,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            firstP.textContent = "emoji :m";
            keyboardEventArgs = {
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
                type: 'keydown'
            };
            const range: Range = document.createRange();
            const selection = window.getSelection();
            range.setStart(firstP.firstChild, 8); // Assuming 'm' is at index 8
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            (<any>rteObj).keyUp(keyboardEventArgs);
            firstP.textContent = "emoji :";
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 186,
                which: 186,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            range.setStart(firstP.firstChild, 7); 
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            (<any>rteObj).keyUp(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
        });
    });
    describe('Didnot focus on editor ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('Filter case doesnot need to work', () => {
            const firstP: HTMLElement = rteObj.inputElement.querySelector('#rte-p');
            firstP.textContent = " ";
            setCursorPoint(firstP, 1);
            keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 186,
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 186,
                which: 186,
                code: 'Semicolon',
                action: 'Semicolon',
                type: 'keydown'
            };
            (<any>rteObj).keyDown(keyboardEventArgs);
            firstP.textContent = "emoji :m";
            keyboardEventArgs = {
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
                type: 'keydown'
            };
            const range: Range = document.createRange();
            const selection = window.getSelection();
            range.setStart(firstP.firstChild, 8);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[0].focus();
            (<any>rteObj).keyUp(keyboardEventArgs);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojisearch-btn')).toBe(null);
        });
    });
    describe('When insert emoji without focus on button' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('Emoji doesnot insert in editor ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const headerEle: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-name');
            headerEle.click();
            (<any>rteObj).emojiPickerModule.emojiBtnClick({target: headerEle});
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
            expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
    });
    describe('When Click in toolbar' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('- focus the corresponding set of first emoji ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const toolbarEle: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipicker-toolbar button');
            toolbarEle[1].click();
            toolbarEle[2].click();
            expect(document.activeElement.innerHTML).toBe('🍎');
        });
    });
    describe('Bug 922923: The emoji Picker icon is considered a link when inserted before or after a hyperlink', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"><a class="e-rte-anchor" id="rte-a" href="https://ej2.syncfusion.com/angular/demos/#/bootstrap5/rich-text-editor/tools" title="https://ej2.syncfusion.com/angular/demos/#/bootstrap5/rich-text-editor/tools" target="_blank" aria-label="Open in new window">RichTextEditor</a></p>`;
        beforeEach(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value: innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it(' Emoji is inserted after the hyperlink', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const firstA: Element = (rteObj as any).inputElement.querySelector('#rte-a');
            setCursorPoint(firstA.childNodes[0] as HTMLElement, firstA.childNodes[0].textContent.length);
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            (document.querySelector('.e-rte-emojipickerbtn-group [title="Grinning face"]') as HTMLElement).click();
            expect(firstP.innerHTML).toContain('😀');
            expect(firstA.innerHTML).not.toContain('😀');
            rteObj.value = innerHTML;
        });
        it(' Emoji is inserted before the hyperlink', () => {
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const firstA: Element = (rteObj as any).inputElement.querySelector('#rte-a');
            setCursorPoint(firstA.childNodes[0] as HTMLElement, 0);
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            (document.querySelector('.e-rte-emojipickerbtn-group [title="Grinning face"]') as HTMLElement).click();
            expect(firstP.innerHTML).toContain('😀');
            expect(firstA.innerHTML).not.toContain('😀');
        });
    });
    describe('Scroll the set of emoji' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('- Reverse scroll the emoji the toolbar focus state', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const toolbarEle: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipicker-toolbar button');
            toolbarEle[1].style.height = "200px";
            (<any>rteObj).emojiPickerModule.scrollEvent({});
            expect(toolbarEle[0].classList.contains('e-selected')).toBe(true);
        });
    });
    describe('ArrowUp on first row of emoji ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('- move into left side not upside', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
            emoji[5].focus();
            emoji[5].classList.add('e-focus');
            (<any>rteObj).emojiPickerModule.onKeyDown({preventDefault: function () { },keyCode: 38});
            expect(document.activeElement.innerHTML).toBe('😅');
        });
    });
    describe('Corresponding emoji popup open and close  ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('- space with colon to render the popup, after toolbar action close the already opened popup and open new popup', ( ) => {
                const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
                const textNode = firstP.childNodes[0];
                textNode.textContent = "Emoji picker : : : : : : : ";
                const range = document.createRange();
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                keyboardEventArgs.keyCode = 186;
                keyboardEventArgs.shiftKey = true;
                (<any>rteObj).keyDown(keyboardEventArgs);
                const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
                element.click();
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
                expect(rteObj.element.querySelector('.e-rte-emoji-search')).not.toBe(null);
                expect(rteObj.element.querySelector('.e-rte-emojipicker-btn')).not.toBe(null);
                expect(rteObj.element.querySelector('.e-rte-emojipicker-group')).not.toBe(null);
                expect(rteObj.element.querySelector('.e-rte-emojipicker-name')).not.toBe(null);
                expect(rteObj.element.querySelector('.e-rte-emojipickerbtn-group')).not.toBe(null);
        });
    });
    
    describe('850182-Tooltip not removed after close the emoji picker popup ' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">:</p>`;
        let spaceKeyEventArgs: any = {
            preventDefault: function () { },
            keyCode: 32,
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            char: '',
            key: ':',
            charCode: 0,
            which: 32,
            code: 'space',
            action: 'space',
            type: 'keydown'
        };
        beforeAll(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                value: innerHTML,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(defaultRTE);
        });
        it('check the tooltip destroy when close the popup using space key', () => {
            const firstP: HTMLElement = (rteObj as any).inputElement.querySelector('#rte-p');
            setCursorPoint(firstP, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            let event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
            let popupEle = document.querySelector(".e-rte-emojipickerbtn-group").firstChild;
            popupEle.dispatchEvent(event);
            expect(rteObj.element.ownerDocument.querySelectorAll('.e-tooltip-wrap').length > 0).toBe(true);
            let textNode: HTMLElement = (rteObj as any).inputElement.querySelector('#rte-p').childNodes[0];
            setCursorPoint(textNode, 1);
            rteObj.keyDown(spaceKeyEventArgs);
            expect(rteObj.element.ownerDocument.querySelectorAll('.e-tooltip-wrap').length > 0).toBe(false);
        });
    });

    describe('850181 - The emoji is inserted on the toolbar in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p">:</p>`;
        let spaceKeyEventArgs: any = {
            preventDefault: function () { },
            keyCode: 32,
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            char: '',
            key: ':',
            charCode: 0,
            which: 32,
            code: 'space',
            action: 'space',
            type: 'keydown'
        };
        beforeAll(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                value: innerHTML,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(defaultRTE);
        });
        it('The emoji is inserted in the toolbar of the Rich Text Editor.', () => {
            (<any>rteObj).toolbarModule.getToolbarElement().querySelector('.e-toolbar-items button').click();
            setTimeout(() => {
                (<any>rteObj).toolbarModule.getToolbarElement().querySelector('.e-toolbar-items button').click();
                (<any>rteObj).toolbarModule.getToolbarElement().querySelector('.e-toolbar-items button').click();
                var emoji: any = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
                (emoji[5] as any).click();
                function hasEmojiUTF16(text: string) {
                    var emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
                    return emojiRegex.test(text);
                }
                hasEmojiUTF16(rteObj.getText());
                expect(hasEmojiUTF16(rteObj.getText())).toBe(true);
            }, 0)
        });
    });

    describe('849570 - "No result found" text was not removed from the emoji picker even after clearing the invalid content from the search bar in the emoji picker', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"> </p>`;
        beforeAll(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                value: innerHTML,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(defaultRTE);
        });
        it('Emoji Picker input element close icon click ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
            const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
            inputEle.value = 'sssssssssssssssss';
            dispatchEvent(popupObj, 'keyup');
            (rteObj as any).element.querySelector(".e-rte-emojipicker-popup .e-input-group .e-clear-icon").click();
            dispatchEvent(popupObj, 'keyup');
            expect(rteObj.element.querySelector(".e-rte-emojipicker-popup .e-rte-emojiSearch-noEmoji") == null).toBe(true);
        });
    });

    describe('850067 - "Nested List element not removed while apply the emoji', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let editorObj: EditorManager;
        let innerHTML: string = `<ol><li>fristli<ol><li class="startContainer">second<ol><li>third<ol><li>fourth</li><li>fifth</li><li>sixth<ol><li class="endContainer">seventh</li><li>eidth<ol><li>ninth</li></ol></li></ol></li></ol></li></ol></li></ol></li><li>secondli</li><li>third</li><li>fourth<ol><li>first</li><li>second</li><li>third<ol><li>fourth</li></ol></li></ol></li></ol>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value: innerHTML
              });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check nested list element removed when apply the emoji', () => {
            const startContainer: HTMLElement = document.querySelector('.startContainer');
            const endContainer: HTMLElement = document.querySelector('.endContainer');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startContainer.firstChild, endContainer.firstChild, 4, 4);
            const emojiEle: HTMLElement = document.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
            emojiEle.click();
            (document.querySelector('.e-rte-emojipickerbtn-group [title="Grinning face"]') as HTMLElement).click();
            let innerHtml = '<ol><li>fristli<ol><li class="startContainer">seco😀<ol><li style="list-style-type: none;"><ol><li style="list-style-type: none;"><ol><li class="endContainer">nth</li><li>eidth<ol><li>ninth</li></ol></li></ol></li></ol></li></ol></li></ol></li><li>secondli</li><li>third</li><li>fourth<ol><li>first</li><li>second</li><li>third<ol><li>fourth</li></ol></li></ol></li></ol>';
            expect(rteObj.inputElement.innerHTML == innerHtml).toBe(true);
        });
    });

    describe('When rte reach the top position' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let innerHTML: string = `<p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p><p id=\"rte-p\">Emoji picker : : : : : : :  </p>`;
        beforeAll( () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value : innerHTML,
                height: 1000
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('- To open emoji picker popup at correct position', (done) => {
            const rteEle: HTMLElement = rteObj.element;
            rteEle.style.position = 'absolute';
            rteEle.style.top = '-100px';   
            const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            const textNode = firstP.childNodes[0];
            textNode.textContent = "Emoji picker : : : : : : : ";
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.setEnd(textNode, textNode.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            rteObj.showEmojiPicker();
            setTimeout(() => {
                const popEle: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
                expect(popEle.style.top).toBe('2982px');
                done();
            }, 100);
        });
    });
    describe('908192: Action begin event boolean value check in switch for emoji picker and format painter', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let innerHTML: string = `<p id="rte-p"> </p>`;
        let isEmojiPickerTriggered: boolean = false;
        beforeEach(() => {
            rteObj = renderRTE({
                value: innerHTML,
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                actionBegin: actionBegin,
            });
            function actionBegin(args: ActionBeginEventArgs): void {
                if (args.requestType === 'EmojiPicker') {
                    if (args.originalEvent) {
                        isEmojiPickerTriggered = true;
                    }
                }
            }
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach((done) => {
            destroy(rteObj);
            done();
        });

        it('should trigger EmojiPicker and check isEmojiPickerTriggered', (done: Function) => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            var btnGroup: NodeListOf<HTMLElement>  = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            if (btnGroup.length > 0) {
                btnGroup[0].click();
            }
            setTimeout(function () {
                expect(isEmojiPickerTriggered).toBe(true);
                element.click();
                rteObj.emojiPickerModule.isPopupDestroyed = true;
                element.click();
                rteObj.emojiPickerModule.isPopupDestroyed = false;
                done();
            }, 500); 
        });
    });

describe('Emoji Picker in IFrame - Close on outside click', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
    let innerHTML: string = `<p id="rte-p">Emoji picker test</p>`;

    beforeEach(() => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            iframeSettings: { enable: true },
            value: innerHTML
        });
        rteObj.appendTo('#defaultRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });

    afterEach(() => {
        destroy(rteObj);
    });

    it('Should close emoji popup when clicking outside in iframe', (done) => {
        const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        emojiButton.click();

        setTimeout(() => {
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
            // Simulate click inside iframe content
            const iframeDocument = (rteObj as any).inputElement.ownerDocument;
            const iframeMouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: iframeDocument.defaultView
            });
            iframeDocument.body.dispatchEvent(iframeMouseDownEvent);

            setTimeout(() => {
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                expect(rteObj.element.querySelector('.e-active')).toBe(null);
                done();
            }, 100);
        }, 100);
    });
});
describe('When we press the enter key insert the emoji in IFrame' , () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
    let innerHTML: string = `<p id="rte-p">Emoji picker : : : : : : :  </p>`;
    beforeEach( () => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            iframeSettings: { enable: true },
            value : innerHTML
        });
        rteObj.appendTo('#defaultRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });
    afterEach( () => {
        destroy(rteObj);
    });
    it('Insert the emoji into IFrame editor', () => {
        const firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
        const height: HTMLElement = (rteObj as any).element.querySelector('.e-rte-content');
        height.style.height = '100px';
        height.style.overflow = 'auto';
        const textNode = firstP.childNodes[0];
        textNode.textContent = "Emoji picker : : : : : : : ";
        const range = document.createRange();
        range.setStart(textNode, textNode.textContent.length);
        range.setEnd(textNode, textNode.textContent.length);
        const selection = (rteObj as any).inputElement.ownerDocument.defaultView.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 186,
            shiftKey: true,
            altKey: false,
            ctrlKey: false,
            char: '',
            key: ':',
            charCode: 13,
            which: 13,
            code: 'Semicolon',
            action: 'Semicolon',
            type: 'keydown'
        };
        (<any>rteObj).keyDown(keyboardEventArgs);
        const emoji: NodeListOf<HTMLElement> = document.querySelectorAll('.e-rte-emojipickerbtn-group button');
        emoji[0].focus();
        keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 13,
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            char: '',
            key: ':',
            charCode: 13,
            which: 13,
            code: 'Enter',
            action: 'Enter',
            type: 'Enter',
            target: emoji[0]
        };
        (<any>rteObj).emojiPickerModule.onKeyDown({preventDefault: function () { },keyCode: 13, target: emoji[0]});
        expect((rteObj as any).inputElement.ownerDocument.activeElement.innerHTML).toBe('<p id="rte-p">Emoji picker : : : : : : 😀</p>');
    });
});
describe('Insert Emoji into Nested List Items', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
    let initialHTML: string = `<ul><li style="list-style-type: none;"><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li></ul></li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul>`;
    beforeAll(() => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            value: initialHTML
        });
        rteObj.appendTo('#defaultRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('should insert emoji into first two nested list items', (done) => {
        const editor = rteObj.contentModule.getDocument();
        const firstNestedListItem = editor.querySelector('ul > li > ul > li');
        const secondNestedListItem = firstNestedListItem.nextElementSibling;
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, firstNestedListItem, secondNestedListItem, 0, 11);
        const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        emojiButton.click();
        setTimeout(() => {
            const firstEmojiButton: HTMLElement = document.querySelector('.e-rte-emojipickerbtn-group button');
            firstEmojiButton.click();
            const expectedHTML = `<ul><li style="list-style-type: none;"><ul><li>😀</li></ul></li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul>`;
            expect(rteObj.inputElement.innerHTML).toBe(expectedHTML);
            done();
        }, 100);
    });
});
describe('936848: Add Table Popup Gets Hidden Under the Lower Rich Text Editor’s Toolbar', () => {
    let rteObjOne : RichTextEditor;
    let rteObjTwo : RichTextEditor;
    beforeAll(() => {
        rteObjOne = renderRTE({
            toolbarSettings: {
                items: ['EmojiPicker'],
            },
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
        }
        );
        rteObjTwo = renderRTE({
            toolbarSettings: {
                items: ['EmojiPicker'],
            },
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
        }
        );
    });
    afterAll(() => {
        destroy(rteObjOne);
        destroy(rteObjTwo);
    });
    it("936848: Add Table Popup Gets Hidden Under the Lower Rich Text Editor’s Toolbar", () => {
        expect(rteObjOne.element.querySelectorAll('.e-rte-content').length).toBe(1);
        expect(rteObjTwo.element.querySelectorAll('.e-rte-content').length).toBe(1);
        (<HTMLElement>rteObjOne.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(rteObjOne.element.querySelectorAll('.e-popup').length === 1).toBe(true);
        expect((<HTMLElement>rteObjOne.element.querySelector(".e-toolbar-wrapper") as HTMLElement).style.zIndex === '11').toBe(true);
        (<HTMLElement>rteObjOne.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect((<HTMLElement>rteObjOne.element.querySelector(".e-toolbar-wrapper") as HTMLElement).style.zIndex === '').toBe(true);
    });
});

describe('935436 - "Added Test case for emoji picker searchFilter method coverage issue for Iframe', () => {
    let rteObj: RichTextEditor;
    let controlId: string;
    let innerHTML: string = `<p id="rte-p"> </p>`;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            iframeSettings: { enable: true },
            value: innerHTML
        });
        controlId = rteObj.element.id;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Covered the tescase with Iframe Setting enable true', () => {
        const element: HTMLElement = document.body.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        element.click();
        const inputEle: HTMLInputElement = rteObj.element.querySelector('.e-rte-emoji-search');
        const popupObj: HTMLElement = rteObj.element.querySelector('.e-rte-emojipicker-popup');
        inputEle.value = 'sssssssssssssssss';
        dispatchEvent(popupObj, 'keyup');
        (rteObj as any).element.querySelector(".e-rte-emojipicker-popup .e-input-group .e-clear-icon").click();
        dispatchEvent(popupObj, 'keyup');
        expect(rteObj.element.querySelector(".e-rte-emojipicker-popup .e-rte-emojiSearch-noEmoji") == null).toBe(true);
    });
});

describe('935436 - "Added Test case for emoji picker ToolbarClick method coverage issue for Inline Mode', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            inlineMode: {
                enable: true
            },
            value: `<p id="rte-p">Hello</p>`
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Covered the tescase with Inline mode true', (done: DoneFn) => {
        rteObj.focusIn();
        const textNode: Element = (rteObj as any).inputElement.querySelector('#rte-p').firstChild;
        setCursorPoint(textNode, 3);
        rteObj.showInlineToolbar();
        setTimeout(() => {
            const element: HTMLElement = document.body.querySelector('.e-emoji');
            element.click();
            setTimeout(() => {
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
                done();
            }, 100);
        }, 100);
    });
});

describe('Emoji Picker with bottom toolbar positioning', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'positionRTE' });
    let initialHTML: string = `<p>Emoji Picker Test</p>`;
    beforeAll(() => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                position: 'Bottom',
                items: ['EmojiPicker']
            },
            value: initialHTML
        });
        rteObj.appendTo('#positionRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('should position emoji picker above toolbar when no space below', (done) => {
        // Position the RTE at the bottom of the viewport to force upward positioning
        const viewportHeight = window.innerHeight;
        rteEle.style.position = 'absolute';
        rteEle.style.bottom = '10px';
        // Focus the editor first
        rteObj.focusIn();
        const editor = rteObj.contentModule.getDocument();
        const paragraph = editor.querySelector('p');
        // Get actual text content length and use it for selection
        const textLength = paragraph.textContent.length;
        // Select text - make sure we don't exceed the actual length
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(
            document, 
            paragraph.firstChild, // Select the text node specifically
            paragraph.firstChild, 
            0, 
            textLength > 0 ? textLength : 0
        );
        // Click emoji button
        const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        emojiButton.click();
        setTimeout(() => {
            // Get popup element
            const emojiPopup = document.querySelector('.e-rte-emojipicker-popup') as HTMLElement;
            expect(emojiPopup).not.toBeNull();
            // Verify popup is positioned above when space is limited
            if (emojiPopup.style.position === 'fixed' && emojiPopup.style.bottom !== '') {
                // Correct upward positioning
                expect(emojiPopup.style.top).toBe('auto');
                expect(emojiPopup.style.bottom).not.toBe('');
            }
            done();
        }, 100);
    });
});
  
  describe('946142 - Empty list not removing properly when selecting multiple list and inserting emoji', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
    let initialHTML: string = `<ul><li style="list-style-type: none;"><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li></ul></li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul>`;
    beforeAll(() => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                items: ['EmojiPicker']
            },
            value: initialHTML
        });
        rteObj.appendTo('#defaultRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('should insert emoji into first two nested list items', (done) => {
        const editor = rteObj.contentModule.getDocument();
        const firstNestedListItem = editor.querySelector('ul > li > ul > li');
        const secondNestedListItem = firstNestedListItem.nextElementSibling;
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, firstNestedListItem, secondNestedListItem, 0, 11);
        const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        emojiButton.click();
        setTimeout(() => {
            const firstEmojiButton: HTMLElement = document.querySelector('.e-rte-emojipickerbtn-group button');
            firstEmojiButton.click();
            const expectedHTML = `<ul><li style="list-style-type: none;"><ul><li>😀</li></ul></li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul>`;
            expect(rteObj.inputElement.innerHTML).toBe(expectedHTML);
            done();
        }, 100);
    });
});

    describe('Emoji Picker popup is not closing when we open repeatedly in the inline mode ',() => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let initialHTML: string = `<p>Emoji Picker Inline Test</p>`;
        beforeAll(() => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                inlineMode: { enable: true, onSelection: true },
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
                value: initialHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should open and close the emoji picker popup repeatedly in inline mode', (done: Function) => {
            // Click on the Emoji Picker button
            const editor = rteObj.contentModule.getDocument();
            const paragraph = editor.querySelector('p');
            // Focus the editor first
            rteObj.focusIn();
            // Position cursor to start of the node
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, paragraph.firstChild, paragraph.firstChild, 0, 0);
            // Show the inline toolbar
            rteObj.showInlineToolbar();
            const emojiButton: HTMLElement = document.querySelector('.e-emoji');
            emojiButton.click();
            setTimeout(() => {
                const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(mouseDownEvent);
                setTimeout(() => {
                    // Assert that the popup is closed
                    expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                    rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, paragraph.firstChild, paragraph.firstChild, 0, 0);
                    // Show the inline toolbar
                    rteObj.showInlineToolbar();
                    // Emoji picker should open again when clicked
                    const emojiButton: HTMLElement = document.querySelector('.e-emoji');
                    emojiButton.click();
                    setTimeout(() => {
                        expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).not.toBe(null);
                        done(); // Indicate the test is complete
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Emoji Picker positioning when it is the last item in a large toolbar', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;
    let defaultRTE: HTMLElement = createElement('div', { id: 'largeToolbarRTE' });
    let innerHTML: string = `<p id="rte-p">Emoji picker test with large toolbar</p>`;
    beforeAll(() => {
        document.body.appendChild(defaultRTE);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                items: [
                    'Bold', 'Italic', 'Underline', 'StrikeThrough',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                    'Outdent', 'Indent', '|',
                    'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
                    'SourceCode', 'FullScreen', '|', 'Undo', 'Redo', 'EmojiPicker'
                ]
            },
            value: innerHTML
        });
        rteObj.appendTo('#largeToolbarRTE');
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });
    afterAll(() => {
        destroy(rteObj);
        detach(defaultRTE);
    });
    it('962262 - should position emoji picker popup correctly ', (done) => {
        const toolbarItems = rteObj.element.querySelectorAll('.e-toolbar-item');
        expect(toolbarItems.length).toBeGreaterThan(10);
        const emojiButton: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
        emojiButton.click();
        setTimeout(() => {
            const emojiPopup = document.querySelector('.e-rte-emojipicker-popup') as HTMLElement;
            expect(emojiPopup).not.toBeNull();
            expect(emojiPopup.style.left).not.toBe('24px');
            done();
        }, 100);
    });
});

    describe('When toolbar is in extended the emoji picker popup z-index has greater than toolbar' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        let innerHTML: string = `<p id="rte-p"></p>`;
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    type: ToolbarType.Popup,
                    items: ['EmojiPicker','Bold', 'Italic', 'Underline', 'StrikeThrough',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                    'Outdent', 'Indent', '|',
                    'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
                    'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
                },
                value : innerHTML
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('emoji picker popup z-index greater than toolbar', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            expect(rteObj.emojiPickerModule.popupObj.zIndex).toBe(10002);
        });
    });
});