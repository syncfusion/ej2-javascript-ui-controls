/**
 * RTE - Emoji picker action spec
 */
import { createElement, detach } from "@syncfusion/ej2-base";
import { dispatchEvent, RichTextEditor } from "../../../src/rich-text-editor/index";
import { destroy, setCursorPoint } from "./../render.spec";

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
            setCursorPoint(firstP, 1);
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
            expect(firstP.innerHTML).toBe(' 😀');
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
            expect(firstP.innerHTML).toBe(' 😀😀');
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
        it('When click on the document popup will close   ', () => {
            const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            element.click();
            const ele: HTMLElement = rteObj.element.querySelector('.e-rte-content');
            let evnArg = {
                args: { target: ele, srcElement: ele },
            };
            rteObj.notify('docClick', evnArg);
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
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
    describe('Emoji picker - iconcss property' , () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
        beforeEach( () => {
            document.body.appendChild(defaultRTE);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
            rteObj.appendTo('#defaultRTE');
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach( () => {
            destroy(rteObj);
        });
        it('In tollbar render the iconCss property', (done: Function) => {
            setTimeout(() => {
                const element: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
                element.click();
                expect(rteObj.element.querySelector('.e-emoji')).not.toBe(null);
                done();
            }, 1000);
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
                setTimeout(function () {
                const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
                btnGroup[0].click();
                expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
                expect(firstP.innerHTML).toBe('Emoji picker : : : : : : 😀');
                done();
            }, 1000);
        });
    });
    describe('In rich editor content - intial we type colon render the popup ' , () => {
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
            setTimeout(function () {
            const btnGroup: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-emojipickerbtn-group button');
            btnGroup[0].click();
            expect(rteObj.element.querySelector('.e-rte-emojipicker-popup')).toBe(null);
            expect(firstP.innerHTML).toBe('😀');
            done();
        }, 1000);
        });
    });
    describe('When we call the public method of emoji pciker' , () => {
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
});