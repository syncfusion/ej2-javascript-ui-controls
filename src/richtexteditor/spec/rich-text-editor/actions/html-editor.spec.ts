import { RichTextEditor } from '../../../src/rich-text-editor';
import { renderRTE, destroy, setCursorPoint, clickImage } from '../render.spec';
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, DELETE_EVENT_INIT, ENTERKEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from '../../constant.spec';
import { NodeSelection } from '../../../src';

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
describe('Html-Editor specs', ()=> {
    describe('1007050: Inline format preservation - Without Enter Key BR (Default P mode)', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                height: 400
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Single backspace/delete - Preserve inline formatting Should maintain the inline element after backspacing the whole content', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>Welcome</em></strong></p><p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[1].childNodes[0];
            setCursorPoint(node, node.textContent.length);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelectorAll('em').length === 2).toBe(true);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            expect(rteObj.inputElement.querySelectorAll('em').length === 3).toBe(true);
        });
        it('Single backspace/delete - Preserve inline formatting Should maintain the inline element after deleting the whole content', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>Welcome</em></strong></p><p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[1].childNodes[0];
            setCursorPoint(node, 0);
            const deleteKeyDown: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            const deleteKeyUp: KeyboardEvent = new KeyboardEvent('keyup', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            rteObj.inputElement.dispatchEvent(deleteKeyUp);
            expect(rteObj.inputElement.querySelectorAll('em').length === 2).toBe(true);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            expect(rteObj.inputElement.querySelectorAll('em').length === 3).toBe(true);
        });
        it('Double backspace/delete - Remove inline element Should delete the inline element after backspacing twice', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>Welcome</em></strong></p><p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[1].childNodes[0];
            setCursorPoint(node, node.textContent.length);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelectorAll('p')[1].innerHTML === '<br>').toBe(true);
        });
        it('Double backspace/delete - Remove inline element Should delete the inline element after deleting twice', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>Welcome</em></strong></p><p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[1].childNodes[0];
            setCursorPoint(node, 0);
            const deleteKeyDown: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            const deleteKeyUp: KeyboardEvent = new KeyboardEvent('keyup', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            rteObj.inputElement.dispatchEvent(deleteKeyUp);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            rteObj.inputElement.dispatchEvent(deleteKeyUp);
            expect(rteObj.inputElement.querySelectorAll('p')[1].innerHTML === '<br>').toBe(true);
        });
    });

    describe('1007050: Inline format preservation - With Enter Key BR', () => {
        let rteObj: RichTextEditor;
        let innerHTML1: string = '<strong><em>S</em></strong>';
        beforeEach(() => {
            rteObj = renderRTE({
                height: 400,
                enterKey: 'BR',
                value: innerHTML1
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Backspace behavior with BR mode Should preserve inline formatting on first backspace and remove on second', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const node = rteObj.inputElement.querySelectorAll('em')[0].childNodes[0];
            setCursorPoint(node, node.textContent.length);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            // First backspace - should preserve inline elements
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelectorAll('strong').length === 1).toBe(true);
            expect(rteObj.inputElement.querySelectorAll('em').length === 1).toBe(true);
            // Second backspace - should remove inline elements
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelectorAll('strong').length === 0).toBe(true);
            expect(rteObj.inputElement.querySelectorAll('em').length === 0).toBe(true);
        });
    });
    describe('1007050: Code Coverage - Edge cases', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                height: 400,
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Inline element preservation in mixed content Should not change inline element to empty text node when block has content', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p> The <strong>R</strong>ich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here. </p>';
            const node = rteObj.inputElement.querySelector('strong').childNodes[0];
            setCursorPoint(node, 1);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelector('strong').textContent === 'R').toBe(true);
        });
        it('Cursor at edge positions Should maintain text after pressing backspace at 0th offset', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[0].childNodes[0];
            setCursorPoint(node, 0);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelector('em').textContent === 'S').toBe(true);
        });
        it('Cursor at edge positions Should maintain text after pressing delete at end offset', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p><strong><em>S</em></strong></p>';
            const node = rteObj.inputElement.querySelectorAll('em')[0].childNodes[0];
            setCursorPoint(node, 1);
            const deleteKeyDown: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            const deleteKeyUp: KeyboardEvent = new KeyboardEvent('keyup', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            rteObj.inputElement.dispatchEvent(deleteKeyUp);
            expect(rteObj.inputElement.querySelector('em').textContent === 'S').toBe(true);
        });
        it('When range is not inside inline element range should be indie a block element', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.inputElement.innerHTML = '<p>S</p>';
            const node = rteObj.inputElement.querySelector('p').childNodes[0];
            setCursorPoint(node, 1);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelector('p').textContent === 'S').toBe(true);
        });
    });

    describe('1013961: Tab key behaviors', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let consoleSpy: jasmine.Spy;
        beforeEach(() => {
            consoleSpy = jasmine.createSpy('console');
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold', 'Italic','Underline', 'Audio', 'Video', 'Undo', 'Redo']
                },
                enableTabKey: true
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it('Tab on selected image should not throw any console error', (done) => {
            rteObj.focusIn();
            rteObj.inputElement.innerHTML = `<p>Syncfusion</p>`;
            let pTag: HTMLElement = rteEle.querySelector('p') as HTMLElement;
            setCursorPoint(pTag.firstChild, pTag.textContent.length);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            setTimeout(() => {
                const img: HTMLElement = rteObj.inputElement.querySelector('img') as HTMLElement;
                expect(img).not.toBeNull();
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, img, img, 0, 0);
                setTimeout(() => {
                    const tabDown: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(tabDown);
                    setTimeout(() => {
                        expect(consoleSpy).not.toHaveBeenCalled();
                        expect(pTag.style.marginLeft !== '20px').toBe(true);
                        expect(rteEle.querySelectorAll(".e-toolbar-item").length === 8).toBe(true);
                        done();
                    }, 0);
                }, 100);
            }, 100);
        });

        it('Tab on selected text should not collapse toolbar', (done) => {
            rteObj.focusIn();
            rteObj.inputElement.innerHTML = `<p>Syncfusion</p>`;
            const pTag: HTMLElement = rteEle.querySelector('p') as HTMLElement;
            const textNode: Node = pTag.firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textNode, textNode, 2, 5);
            const tabDown: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(tabDown);
            setTimeout(() => {
                expect(consoleSpy).not.toHaveBeenCalled();
                expect(rteEle.querySelectorAll('.e-toolbar-item').length === 8).toBe(true);
                expect(pTag.innerHTML === 'Sy&nbsp;&nbsp;&nbsp;&nbsp;usion').toBe(true);
                done();
            }, 0);
        });

        it('Tab on image+text selection should add margin when Tab is pressed', (done) => {
            const imgUrl = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png';
            rteObj.inputElement.innerHTML = `<p><img src="${imgUrl}" alt="img"/> Some text</p>`;
            const img: HTMLElement = rteObj.inputElement.querySelector('img') as HTMLElement;
            const textNode: Node | null = img.nextSibling && img.nextSibling.nodeType === Node.TEXT_NODE ? img.nextSibling : null;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, img, textNode, 0, 4);
            const tabDown: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(tabDown);
            setTimeout(() => {
                expect((img.parentElement as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            }, 50);
        });

        it('cursor before image + Tab inserts four &nbsp; and keeps caret before image', (done) => {
            const imgUrl = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png';
            rteObj.inputElement.innerHTML = `<p><img src="${imgUrl}" alt="img"/> Some</p>`;
            const pTag: HTMLElement = rteObj.inputElement.querySelector('p') as HTMLElement;
            setCursorPoint(pTag, 0);
            const tabDown: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(tabDown);
            setTimeout(() => {
                expect(pTag.innerHTML.indexOf('&nbsp;&nbsp;&nbsp;&nbsp;') !== -1).toBe(true);
                const sel = document.getSelection();
                expect(sel && sel.rangeCount > 0).toBe(true);
                const range = sel.getRangeAt(0);
                expect(range.collapsed).toBe(true);
                expect(range.startContainer.nodeType === Node.TEXT_NODE).toBe(true);
                expect(range.startOffset === 4).toBe(true);
                done();
            }, 50);
        });

        it('selecting entire text node + Tab should add margin before the node', (done) => {
            rteObj.inputElement.innerHTML = `<p>SelectionText</p>`;
            const pTag: HTMLElement = rteObj.inputElement.querySelector('p') as HTMLElement;
            const textNode: Node = pTag.firstChild as Node;
            const len = (textNode.textContent as string).length;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textNode, textNode, 0, len);
            const tabDown: KeyboardEvent = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(tabDown);
            setTimeout(() => {
                expect((pTag.style.marginLeft === '20px')).toBe(true);
                done();
            }, 50);
        });
    });

    describe('1018318: Backspace Key Not Removing Elements Properly When Content Contains SVG', () => {
        let rteObj: RichTextEditor;
        const originalHTML: string = `<div class="relative pl-9" style="border: 0px solid rgb(229, 231, 235); position: relative; padding-left: 2.25rem; color: rgb(75, 85, 99); font-family: "Open Sans", -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">
   <dt class="inline font-semibold text-gray-900" style="border: 0px solid rgb(229, 231, 235); display: inline; font-weight: 600; color: rgb(17, 24, 39);">Run Anywhere</dt>
   <p><span> </span></p>
   <dd class="inline" style="border: 0px solid rgb(229, 231, 235); margin: 0px; display: inline;">Universally compatible with diverse operating systems and environments, including Linux, Windows, macOS, FreeBSD, Kubernetes, and etc. Compatible with multiple architectures, such as x86 and arm64.</dd>
</div>
<div class="relative pl-9" style="border: 0px solid rgb(229, 231, 235); position: relative; padding-left: 2.25rem; margin-bottom: 0px; margin-top: 32px; color: rgb(75, 85, 99); font-family: "Open Sans", -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">
   <dt class="inline font-semibold text-gray-900" style="border: 0px solid rgb(229, 231, 235); display: inline; font-weight: 600; color: rgb(17, 24, 39);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="absolute left-1 top-1 h-5 w-5 text-blue-600"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"></path></svg>Supported Frequent Databases</dt>
   <p><span> </span></p>
   <dd class="inline" style="border: 0px solid rgb(229, 231, 235); margin: 0px; display: inline;">Offers seamless integration with various databases, including SQLite, MySQL, PostgreSQL, TiDB, MS SQL, and etc.</dd>
</div>
<div class="relative pl-9" style="border: 0px solid rgb(229, 231, 235); position: relative; padding-left: 2.25rem; margin-bottom: 0px; margin-top: 32px; color: rgb(75, 85, 99); font-family: "Open Sans", -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">
   <dt class="inline font-semibold text-gray-900" style="border: 0px solid rgb(229, 231, 235); display: inline; font-weight: 600; color: rgb(17, 24, 39);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="absolute left-1 top-1 h-5 w-5 text-blue-600"><path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z"></path><path fill-rule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clip-rule="evenodd"></path></svg>Flexible Deployment</dt>
   <p><span> </span></p>
   <dd class="inline" style="border: 0px solid rgb(229, 231, 235); margin: 0px; display: inline;">Provides flexible deployment options, supporting both single server setups and replication configurations.</dd>
</div>`;
        beforeEach(() => {
            rteObj = renderRTE({
                value: originalHTML
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Backspace at start of Supported Frequent text should not change HTML', (done: DoneFn) => {
            const expectedHTML: string = rteObj.inputElement.innerHTML;
            const targetTextNode: Node = rteObj.inputElement.querySelectorAll('dt')[1].childNodes[1];
            setCursorPoint(targetTextNode as Element, 0);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === expectedHTML).toBe(true);
                done();
            }, 100);
        });
    });
});