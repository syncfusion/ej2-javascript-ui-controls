import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy, setCursorPoint, clickImage, dispatchEvent } from '../render.spec';
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, DELETE_EVENT_INIT, ENTERKEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from '../../constant.spec';
import { NodeSelection } from '../../../src/selection/selection';
import { Browser } from '@syncfusion/ej2-base';

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
   <p><span></span></p>
   <dd class="inline" style="border: 0px solid rgb(229, 231, 235); margin: 0px; display: inline;">Universally compatible with diverse operating systems and environments, including Linux, Windows, macOS, FreeBSD, Kubernetes, and etc. Compatible with multiple architectures, such as x86 and arm64.</dd>
</div>
<div class="relative pl-9" style="border: 0px solid rgb(229, 231, 235); position: relative; padding-left: 2.25rem; margin-bottom: 0px; margin-top: 32px; color: rgb(75, 85, 99); font-family: "Open Sans", -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">
   <dt class="inline font-semibold text-gray-900" style="border: 0px solid rgb(229, 231, 235); display: inline; font-weight: 600; color: rgb(17, 24, 39);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="absolute left-1 top-1 h-5 w-5 text-blue-600"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"></path></svg>Supported Frequent Databases</dt>
   <p><span></span></p>
   <dd class="inline" style="border: 0px solid rgb(229, 231, 235); margin: 0px; display: inline;">Offers seamless integration with various databases, including SQLite, MySQL, PostgreSQL, TiDB, MS SQL, and etc.</dd>
</div>
<div class="relative pl-9" style="border: 0px solid rgb(229, 231, 235); position: relative; padding-left: 2.25rem; margin-bottom: 0px; margin-top: 32px; color: rgb(75, 85, 99); font-family: "Open Sans", -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">
   <dt class="inline font-semibold text-gray-900" style="border: 0px solid rgb(229, 231, 235); display: inline; font-weight: 600; color: rgb(17, 24, 39);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="absolute left-1 top-1 h-5 w-5 text-blue-600"><path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z"></path><path fill-rule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clip-rule="evenodd"></path></svg>Flexible Deployment</dt>
   <p><span></span></p>
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


    describe('EJ2-18212 - RTE - Edited changes are not reflect using getHTML method through console window.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something'
            });
            rteObj.saveInterval = 10;
            rteObj.dataBind();
        });
        it("AutoSave the value in interval time", (done) => {
            rteObj.focusIn();
            (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
            expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
            setTimeout(() => {
                expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(true);
                (rteObj as any).inputElement.innerHTML = `<div><p>First p node-2</p></div>`;
                expect(rteObj.value !== '<div><p>First p node-2</p></div>').toBe(true);
                setTimeout(() => {
                    expect(rteObj.value === '<div><p>First p node-2</p></div>').toBe(true);
                    done();
                }, 400);
            }, 400);
        });
        it(" Clear the setInterval at component blur", (done) => {
            rteObj.focusOut();
            (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
            expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
            setTimeout(() => {
                expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(false);
                done();
            }, 110);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-20463 - Change event is triggered on clicking into html source code view in Edge browser', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let triggerChange: boolean = false;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<p id="rte">RichTextEditor</p>`,
                enableHtmlEncode: true,
                change: () => {
                    triggerChange = true;
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            rteObj.saveInterval = 100;
            rteObj.dataBind();
        });
        it(' change event not trigger while click on source code without edit ', (done) => {
            rteObj.focusIn();
            expect(triggerChange).toBe(false);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(item, 'mousedown');
            item.click();
            expect(triggerChange).toBe(false);
            setTimeout(() => {
                expect(triggerChange).toBe(false);
                done();
            }, 110);
        });

        it(' change event trigger while click on source code with edit ', (done) => {
            rteObj.focusIn();
            expect(triggerChange).toBe(false);
            (rteObj as any).inputElement.innerHTML = `<p id="rte">RichTextEditor component</p>`;
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(item, 'mousedown');
            item.click();
            expect(triggerChange).toBe(true);
            triggerChange = false;
            setTimeout(() => {
                expect(triggerChange).toBe(false);
                done();
            }, 110);
        });

        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('1021173: Backspace near HR inside list item', () => {
        let rteObj: RichTextEditor;
        const rteValue: string = `
<h1>Welcome to the Syncfusion Rich Text Editor</h1>
<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
<h2>Do you know the key features of the editor?</h2>
<hr/>
<ul>
   <li><hr/>
      Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.
   </li>
   <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li>
</ul>`;
        beforeEach(() => {
            rteObj = renderRTE({
                height: 400,
                value: rteValue
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Backspace at li boundary should leave only one hr element', (done: DoneFn) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const li: HTMLElement = rteObj.inputElement.querySelector('ul li') as HTMLElement;
            setCursorPoint(li, 1);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer === li).toBe(true);
                done();
            }, 100);
        });
    });
    describe('Bug 986390: Bullet Point Not Removed Properly When Using Backspace on Pasted Text in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ul><li><div>Line 1</div></li><li><div class="startNode">Line 2</div></li><li><div>Line 3</div></li></ul>',
            });
        });
        it(' pressing backspace in start of list, should remove the entire list', () => {
            const startNode: Element = rteObj.inputElement.querySelector('.startNode').firstChild as Element;
            setCursorPoint(startNode, 0);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
            expect(rteObj.inputElement.querySelectorAll('li').length).toBe(2);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
     describe('Bug 992064: Editor gets broken when pressing the backspace key after a link in the RichTextEditor', () => {
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `text
                <a
                  contenteditable="false"
                  href="https://google.com"
                  title=""
                  target="_blank"
                  style="word-break: normal"
                  data-tracking-enabled="false"
                  data-tracking-tag=""
                  >hyperlink</a
                >
                text`,
                enterKey: 'BR',
                shiftEnterKey: 'BR',
                });
            });
            it(' The editor should not be deleted when Backspace is pressed immediately following a link', () => {
                const startNode: Element = rteObj.inputElement.lastChild as Element;
                setCursorPoint(startNode, 0);
                const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
                rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
                expect(rteObj.inputElement).not.toBe(null);
                expect(rteObj.inputElement.textContent.length).not.toBe(0);
            });
            afterAll(() => {
                destroy(rteObj);
            });
        });
    describe('Bug 1011397: Backspace removes inserted video/image after pressing Enter multiple times, even when the media is not selected.', () => {
            let rteObj: RichTextEditor;
            const value: string = `<div style="display:block;"> <p style="margin-right:10px"> <span class="e-video-wrap" contenteditable="false" title="Screen Recording 2026-01-27 at 6.44.55PM.mov"><video class="e-rte-video e-video-inline" controls="" width="auto" height="auto" style="min-width: 0px; max-width: 1193px; min-height: 0px;"><source src="blob:http://127.0.0.1:5500/404b6da5-5bec-484c-876c-b1b56c70dbe9" type="video/mp4"></video></span> </p><p><br></p><p><br></p><p style="margin-right: 10px;">The custom command "insert special character" is configured as the last item of the toolbar. Click on the command and choose the special character you want to include from the popup. </p> </div>`;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: value
                });
            });
            it('video element should remain after pressing backspace 4 times from start of text content', (done: DoneFn) => {
                rteObj.focusIn();
                const targetParagraph: HTMLElement = Array.from(rteObj.inputElement.querySelectorAll('p')).filter((p: HTMLElement) => {
                    return p.textContent && p.textContent.indexOf('The custom command "insert special character"') > -1;
                })[0] as HTMLElement;
                setCursorPoint(targetParagraph.firstChild as Element, 0);
                const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
                for (let i: number = 0; i < 4; i++) {
                    rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
                    rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
                }
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('video')).not.toBe(null);
                    done();
                }, 100);
            });
            afterAll(() => {
                destroy(rteObj);
            });
        });
    describe('Bug 1026350: Cursor Moves Incorrectly and Clears Mention Chip on Backspace in iOS', () => {
            let rteObj: RichTextEditor;
            let iosUA: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';
            let defaultUA: string = navigator.userAgent;
            const mentionHtml: string = '<p><span contenteditable="false" class="e-mention-chip"><a href="mailto:camden@gmail.com" title="camden@gmail.com">@Camden Kate</a></span>\u00A0</p>';
            beforeAll(() => {
                Browser.userAgent = iosUA;
                rteObj = renderRTE({
                    value: mentionHtml
                });
            });
            afterAll(() => {
                destroy(rteObj);
                Browser.userAgent = defaultUA;
            });
            it('should replace the trailing nbsp with a zero-width space when backspace is pressed at the end of the mention element', (done: DoneFn) => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                const paragraph: HTMLElement = rteObj.inputElement.querySelector('p');
                rteObj.formatter.editorManager.nodeSelection.setCursorPoint(
                    document, paragraph.childNodes[1] as Element, 1);
                expect(rteObj.userAgentData.getPlatform()).toBe('iOS');
                const range: Range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
                const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
                rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
                setTimeout(() => {
                    const mentionChip: HTMLElement = rteObj.inputElement.querySelector('span.e-mention-chip');
                    expect(mentionChip).not.toBeNull();
                    // The trailing nbsp should have been replaced with a zero-width space (\u200B)
                    const paragraphAfter: HTMLElement = rteObj.inputElement.querySelector('p');
                    const lastChild: Node = paragraphAfter.lastChild;
                    expect(lastChild.nodeType).toBe(Node.TEXT_NODE);
                    expect(lastChild.nodeValue).toBe('\u200B');
                    expect(lastChild.textContent.length).toBe(1);
                    done();
                }, 100);
            });
        });
    describe('971893 - Backspacing the text elements inside the div does not work properly in RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Hi Janet,</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Thank you for reaching out!</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"> <div><div>Has the claimant previously been absent due to back problems?</div></div> <div><div>Were aware of any pre-existing back problems with the claimant?</div></div> <div><div class="focusNode">Risk assessment for slips, trips and falls together with adverse weather conditions;</div></div> <div><div>Whilst&nbsp;we note there is a stop work authority which the claimant alleges, he never really understood how it worked, did the other agents not know about it either - can we either provide training records or a read and sign;</div></div> </div>`,
            });
        });
        it('Rich Text Editor works properly when backspacing text inside nested <div> elements', (done) => {
            var startNode = rteObj.inputElement.querySelector(".focusNode").childNodes[0];
            setCursorPoint((startNode as Element), 0);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, code:'Backspace', key: 'backspace', action: 'backspace', keyCode: 8, stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.target = rteObj.inputElement;
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj as any).inputElement.innerHTML === '<div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Hi Janet,</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);">Thank you for reaching out!</div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><br></div><div style="font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; color: rgb(32, 31, 30); font-family: Aptos; font-size: 18.6667px; background-color: rgb(255, 255, 255);"><div><div>Has the claimant previously been absent due to back problems?</div></div><div><div>Were aware of any pre-existing back problems with the claimant?Risk assessment for slips, trips and falls together with adverse weather conditions;</div></div><div><div>Whilst&nbsp;we note there is a stop work authority which the claimant alleges, he never really understood how it worked, did the other agents not know about it either - can we either provide training records or a read and sign;</div></div></div>').toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Bug 969276: Backspace infront of the paragraph with List before is not working properly', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<ol> <li><br></li> </ol> <p id='testing'>Rich Text Editor</p> <p>Document Editor</p>`,
            });
        });
        it(' pressing backspace in front of the paragraph', () => {
            const element = document.getElementById("testing");
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(element.firstChild, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            element.focus();
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('937051 - Text format gets collapsed when we press backspace within the list elements in the RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<ol><li>asdfasdfas<br>fasdfa<br>asdfasdf<br>asdfasdf<br>asdsda<br></li></ol>`,
            });
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
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('960444 - Font color retention when pressing Backspace after Enter', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs: any;

        beforeAll(() => {
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
});
    describe('1014752: Deleting Horizontal Line Breaks List Rendering and Inserts Unwanted br Tags', () => {
        let rteObj: RichTextEditor;
        const rteValue: string = `
        <h1>Welcome to the Syncfusion Rich Text Editor</h1>
        <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
        <h2>Do you know the key features of the editor?</h2>
        <hr/>
        <ul>
        <li><hr/><hr/>
            Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.
        </li>
        <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li>
        </ul>`;
        beforeEach(() => {
            rteObj = renderRTE({
                    height: 400,
                    value: rteValue
                });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete hr element in list without replacing br tag', (done: DoneFn) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const hrElement: HTMLElement | null = rteObj.inputElement.querySelector('ul li hr') as HTMLElement;
            setCursorPoint(hrElement, 0);
            const deleteKeyDown: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            const deleteKeyUp: KeyboardEvent = new KeyboardEvent('keyup', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            rteObj.inputElement.dispatchEvent(deleteKeyUp);
            setTimeout(() => {
                const listItem: HTMLElement = rteObj.inputElement.querySelector('ul li');
                expect(!(listItem.querySelector('hr') && listItem.querySelector('br'))).toBe(true);
                done();
            }, 100);
        });
    });
