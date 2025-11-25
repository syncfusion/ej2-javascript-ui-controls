/**
 * RTE - Quick Toolbar action spec
 */
import { Browser, select, isNullOrUndefined } from "@syncfusion/ej2-base";
import { RichTextEditor, IQuickToolbar, QuickToolbar, HtmlEditor } from "../../../src/rich-text-editor/index";
import { BaseToolbar } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy, androidUA, iPhoneUA, currentBrowserUA, clickImage,setCursorPoint, setSelection } from "./../render.spec";
import { CLS_IMG_QUICK_TB, CLS_LINK_QUICK_TB, CLS_QUICK_POP, CLS_RTE_RES_HANDLE } from "../../../src/rich-text-editor/base/classes";
import { ARROWRIGHT_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, CONTROL_A_EVENT_INIT, ENTERKEY_EVENT_INIT, SHIFT_ARROW_DOWN_EVENT_INIT, SHIFT_ARROW_LEFT_EVENT_INIT, SHIFT_ARROW_RIGHT_EVENT_INIT, SHIFT_ARROW_UP_EVENT_INIT, SHIFT_END_EVENT_INIT, SHIFT_HOME_EVENT_INIT, SHITFT_PAGE_DOWN_EVENT_INIT, SHITFT_PAGE_UP_EVENT_INIT, TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT } from "../../constant.spec";

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const imageSRC: string = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';

const EDITOR_CONTENT: string = `<p>Text Content</p>
            <p><a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools.html"  aria-label="Open in new window">Link Content</a></p>
            <p><img alt="Logo" style="width: 300px;" src="${imageSRC}" class="e-rte-image e-imginline"></p>
            <p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p>
            <table class="e-rte-table" style="width: 80.4728%; min-width: 0px; height: 406px;"><tbody><tr style="height: 6.38821%;"><td style="width: 50%;">Issues</td><td style="width: 50%;">Status<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">Color picker popup opens outside the editor</td><td style="width: 50%;" class="">Not started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Native quick toolbar opened when text selection on Mobile device</td><td style="width: 50%;" class="">Not Started<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">On window resize dialog does not close.</td><td style="width: 50%;" class="">Not Started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Text quick toolbar opened when the Image resize is completed.</td><td style="width: 50%;" class="">Not Started</td></tr></tbody></table>`;


describe("Quick Toolbar Module", () => {

    beforeAll((done: DoneFn) => {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        document.head.appendChild(link);
        setTimeout(() => {
            done(); // Style should be loaded before done() called
        }, 1000);
    });

    afterAll((done: DoneFn) => {
        document.getElementById('materialTheme').remove();
        done();
    });

    describe("Render Testing.", () => {
        let editor: RichTextEditor;

        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Cut', 'Copy', 'Paste']
                },
                value: EDITOR_CONTENT
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Should open Link quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('a');
            setCursorPoint(target.firstChild, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                expect(editor.quickToolbarSettings.link.length).toBe(3);
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Should open Image quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                expect(editor.quickToolbarSettings.image.length).toBe(14);
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Should open Video quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarSettings.video.length).toBe(6);
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Video_Quick_Popup') >= 0).toBe(true);
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Should open Text quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarSettings.text.length).toBe(3);
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Should open Table quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('td');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarSettings.text.length).toBe(3);
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Table_Quick_Popup') >= 0).toBe(true);
                editor.inputElement.blur();
                done();
            }, 100);
        });
    });

    describe("Default Items testing", () => {
        let editor: RichTextEditor;
        
        beforeAll(() => {
            editor = renderRTE({
                value: EDITOR_CONTENT
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Link toolbar items testing.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('a');
            setCursorPoint(target.firstChild, 2);
            expect(editor.quickToolbarSettings.link.length).toBe(3);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const linkQuickToolbar: HTMLElement = document.body.querySelector('.' + CLS_LINK_QUICK_TB);
                const items: NodeListOf<HTMLElement> = linkQuickToolbar.querySelectorAll('.e-toolbar-item');
                expect(items[0].title).toBe('Open Link');
                expect(items[1].title).toBe('Edit Link');
                expect(items[2].title).toBe('Remove Link');
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Image toolbar items testing.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            expect(editor.quickToolbarSettings.image.length).toBe(14);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const imageQuickToolbar: HTMLElement = document.body.querySelector('.' + CLS_IMG_QUICK_TB);
                const items: NodeListOf<HTMLElement> = imageQuickToolbar.querySelectorAll('.e-toolbar-item');
                expect(items[0].title).toBe('Alternate Text');
                expect(items[1].title).toBe('Caption');
                expect(items[2].classList.contains('e-separator')).toBe(true);
                expect(items[3].title).toBe('Align');
                expect(items[4].title).toBe('Display');
                expect(items[5].classList.contains('e-separator')).toBe(true);
                expect(items[6].title).toBe('Insert Link');
                expect(items[7].title).toBe('Open Link');
                expect(items[8].title).toBe('Edit Link');
                expect(items[9].title).toBe('Remove Link');
                expect(items[10].classList.contains('e-separator')).toBe(true);
                expect(items[11].title).toBe('Change Size');
                expect(items[12].title).toBe('Replace');
                expect(items[13].title).toBe('Remove');
                editor.inputElement.blur();
                done();
            }, 100);
        });
    });

    describe("EJ2-59865 - css class dependency component", () => {
        let editor: RichTextEditor;

        beforeAll(() => {
            editor = renderRTE({
                value: EDITOR_CONTENT,
                cssClass: 'customClass',
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Should render with css class on popup element.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('a');
            setCursorPoint(target.firstChild, 2);
            expect(editor.quickToolbarSettings.link.length).toBe(3);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickToolbarPopup: HTMLElement = document.querySelector('.' + CLS_QUICK_POP);
                expect(quickToolbarPopup.classList.contains('customClass')).toBe(true);
                editor.cssClass = 'changedClass';
                editor.dataBind();
                setTimeout(() => {
                    editor.inputElement.blur();
                    done();
                }, 100);
            }, 100);
        });

        it("Shoulda add new class update on property changes", (done: DoneFn) => {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('a');
            setCursorPoint(target.firstChild, 2);
            expect(editor.quickToolbarSettings.link.length).toBe(3);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickToolbarPopup: HTMLElement = document.querySelector('.' + CLS_QUICK_POP);
                expect(quickToolbarPopup.classList.contains('changedClass')).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Dynamic quicktoolbar disable testing", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Instance Availability testing", (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule.textQTBar.isDestroyed).toBe(false);
                expect(editor.quickToolbarModule.linkQTBar.isDestroyed).toBe(false);
                expect(editor.quickToolbarModule.imageQTBar.isDestroyed).toBe(false);
                editor.quickToolbarSettings.enable = false;
                editor.dataBind();
                done();
            }, 100);
        });
        it("enable as false with quick toolbar availability testing", (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule).toBe(undefined);
                done();
            }, 100);
        });
    });

    describe("Empty QuickToolbar items value change with render testing", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    link: [
                        {
                            template: '<button class="e-tbar-btn e-btn"><span class="e-btn-icon e-icons e-copy-1"></span>',
                            tooltipText: 'Copy Link',
                            undo: false,
                        }
                    ],
                    text: ['Copy', 'Paste'],
                    image: []
                }
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Availability testing", (done: DoneFn) => {
            expect(editor.quickToolbarSettings.link.length).toBe(1);
            expect(editor.quickToolbarSettings.image.length).toBe(0);
            expect(editor.quickToolbarSettings.text.length).toBe(2);
            setTimeout(() => {
                editor.quickToolbarSettings.link = [];
                editor.quickToolbarSettings.image = ['Remove'];
                editor.quickToolbarSettings.text = [];
                editor.dataBind();
                done();
            }, 100);
        });

        it("Property change testing", (done: DoneFn) => {
            expect(editor.quickToolbarSettings.link.length).toBe(0);
            expect(editor.quickToolbarSettings.image.length).toBe(1);
            expect(editor.quickToolbarSettings.text.length).toBe(0);
            setTimeout(() => {
                done();
            }, 100);
        });
    });

    describe("QuickToolbar items value change with render testing", () => {
        let editor: RichTextEditor;

        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    link: ['Open', 'UnLink'],
                    image: ['InsertLink', 'Remove']
                },
                value: EDITOR_CONTENT
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Should open Link quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('a');
            setCursorPoint(target.firstChild, 2);
            expect(editor.quickToolbarSettings.link.length).toBe(2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                const quickToolbar: HTMLElement = document.querySelector('.' + CLS_LINK_QUICK_TB);
                const items: NodeListOf<HTMLElement> = quickToolbar.querySelectorAll('.e-toolbar-item');
                expect(items.length).toBe(2);
                expect(items[0].title).toBe('Open Link');
                expect(items[1].title).toBe('Remove Link');
                editor.inputElement.blur();
                done();
            }, 100);
        });

        it("Should open Image quick toolbar.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            expect(editor.quickToolbarSettings.image.length).toBe(2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                const quickToolbar: HTMLElement = document.querySelector('.' + CLS_IMG_QUICK_TB);
                const items: NodeListOf<HTMLElement> = quickToolbar.querySelectorAll('.e-toolbar-item');
                expect(items.length).toBe(2);
                expect(items[0].title).toBe('Insert Link');
                expect(items[1].title).toBe('Remove');
                editor.inputElement.blur();
                done();
            }, 100);
        });
    });

    xdescribe("Quick toolbar - showPopup method with popup open testing", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Undo', 'Redo']
                }
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Popup open testing", (done: Function) => {

        });

        it("Popup open with undo/redo disable testing", (done: Function) => {

        });

        it("Bottom collision testing", (done: Function) => {

        });

        it("Left collision testing", (done: Function) => {

        });

        it("Right collision testing", (done: Function) => {

        });

        it("Page scroll with popup hide testing", (done: Function) => {

        });

        it("Popup hide testing", () => {

        });
    });

    describe('Inline Quick toolbar - Keyboard actions - Case 1 Selection = false' , ()=> {
        let editor: RichTextEditor;
        beforeEach(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
        });
        afterEach(()=> {
            destroy(editor)
        });
        it ('Should open quick toolbar on key up action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 0);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_RIGHT_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        xit ('Should enable undo ', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 0);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_RIGHT_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                editor.formatter.enableUndo(editor);
                // To write.
                done();
            }, 100);
        });
    });

    describe('Inline Quick toolbar - Keyboard actions - Case 2 Selection = true' , ()=> {
        let editor: RichTextEditor;
        beforeEach(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: true
                },
                value: "<div>Syncfusion</div>"
            });
        });
        afterEach(()=> {
            destroy(editor)
        });
        it ('Should open on SHITF + RIGHT_ARROW up action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_RIGHT_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on CTRL + A key action.', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', CONTROL_A_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHIFT + PAGEUP key action.', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHITFT_PAGE_UP_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHIFT + PAGEDOWN key action.', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHITFT_PAGE_DOWN_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHIFT + HOME key action.', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_HOME_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHIFT + END key action.', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_END_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHITF + LEFT_ARROW up action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_LEFT_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHITF + UP_ARROW up action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_UP_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should open on SHITF + DOWN_ARROW up action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_DOWN_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                done();
            }, 100);
        });

        it ('Should close on keydown action', (done: DoneFn)=> {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setSelection(target.firstChild, 1, 3);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SHIFT_ARROW_RIGHT_EVENT_INIT);
            target.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(null);
                const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
                target.dispatchEvent(keyDownEvent);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0]).toBe(undefined);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe("Destroy method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: QuickToolbar;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            let trg: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Destroy testing", () => {
            QTBarModule.destroy();
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
        });
    });

    describe("EJ2-14777 - Inline Quick toolbar - fontcolor, backgrount color", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('KeyUp handler testing', (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-rte-font-colorpicker')[0]).not.toBe(null);
                expect(pop.querySelectorAll('.e-rte-background-colorpicker')[0]).not.toBe(null);                
                editor.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("EJ2-18674 - RTE Inline toolbar items are not changed dynamically", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('KeyUp handler testing', (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-undo')[0]).not.toBe(null);              
                editor.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("EJ2-18675 - RTE removeToolbarItem and addToolbarItem method does not work in inline toolbar", () => {
        let editor: any;

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            editor.removeToolbarItem('Undo');
        });

        afterEach(() => {
            destroy(editor);
        });

        it('KeyUp handler testing', (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-undo')[0]).toBe(undefined);
                editor.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("Desktop - Inline quick toolbar testing", () => {
        let editor: RichTextEditor;
        let trgNode: HTMLElement;
        beforeEach(() => {
            editor = renderRTE({
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<p><b>Syncfusion</b></p>"
            });
            trgNode = editor.inputElement.querySelector(".e-content p b");
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
        });

        afterEach(() => {
            destroy(editor);
        });

        it('Toolbar availability testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-mobile').length).toBe(0);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(0);
                done();
            }, 100);
        });

        it('getToolbar public method with toolbar testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.getToolbar()).not.toBe(null);
                done();
            }, 100);
        });

        it('getBaseToolbarObject private method with toolbar object testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.getBaseToolbarObject()).not.toBe(undefined);
                expect(editor.getBaseToolbarObject() instanceof BaseToolbar).toBe(true);
                done();
            }, 100);
        });

        it('MouseEvent args with mouseUp handler testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                done();
            }, 100);
        });

        it('TouchEvent args with mouseUp handler testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            const args = {
                preventDefault: function () { },
                action: 'mouseup',
                target: trgNode,
                x: 10, y: 200,
                touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }]
            };
            (editor.quickToolbarModule as any).mouseUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                done();
            }, 100);
        });

        it('KeyDown handler testing', (done: Function) => {
            const arrowRightKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ARROWRIGHT_EVENT_INIT);
            trgNode.dispatchEvent(arrowRightKeyDownEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).toBe(undefined);
                editor.quickToolbarModule.hideQuickToolbars();
                editor.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });

        it('hideInlineQTBar method testing', () => {
            editor.quickToolbarModule.hideInlineQTBar();
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            expect(pop).toBe(undefined);
        });
    });

    describe("Android device - Inline quick toolbar testing", () => {
        let args: any;
        let rteObj: any;
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let trgNode: HTMLElement;
        let clickEvent: MouseEvent;
        let QTBarModule: IQuickToolbar;
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUA;
            done();
        });

        beforeEach((done: Function) => {
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            rteObj = renderRTE({
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<p><b>Syncfusion</b></p>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            trgNode = <HTMLElement>rteEle.querySelector(".e-content p b");
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        afterAll((done: DoneFn)=> {
            Browser.userAgent = currentBrowserUA;
            done();
        });

        it('Toolbar availability testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(0);
                expect(document.querySelectorAll('.e-rte-tb-mobile').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile')[0].classList.contains('e-show')).toBe(true);
                done();
            }, 100);
        });

        it('getToolbar public method with toolbar testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(rteObj.getToolbar()).not.toBe(null);
                done();
            }, 100);
        });

        it('getBaseToolbarObject private method with toolbar object testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            trgNode.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(rteObj.getBaseToolbarObject()).not.toBe(undefined);
                expect(rteObj.getBaseToolbarObject() instanceof BaseToolbar).toBe(true);
                done();
            }, 100);
        });

        it('MouseEvent args with mouseUp handler testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            args = {
                preventDefault: function () { },
                action: 'mouseup',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(1);
                done();
            }, 100);
        });

        it('TouchEvent args with mouseUp handler testing', (done: Function) => {
            setCursorPoint(trgNode.firstChild, 1);
            args = {
                preventDefault: function () { },
                action: 'mouseup',
                target: trg,
                x: 10, y: 200,
                touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }]
            };
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(1);
                done();
            }, 100);
        });

        it('hideInlineQTBar method testing', () => {
            (QTBarModule as any).hideInlineQTBar();
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            expect(pop).toBe(undefined);
        });
    });

    describe("iOS device - Inline quick toolbar testing", () => {
        let args: any;
        let rteObj: any;
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let trgNode: HTMLElement;
        let clickEvent: MouseEvent;
        let QTBarModule: IQuickToolbar;
        beforeAll(() => {
            Browser.userAgent = iPhoneUA;
        });

        beforeEach((done: Function) => {
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            rteObj = renderRTE({
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div id='rte'><p><b>Syncfusion</b> Software</p>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            trgNode = <HTMLElement>rteEle.querySelector(".e-content p b");
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        afterAll((done: DoneFn)=> {
            Browser.userAgent = currentBrowserUA;
            done();
        });

        it('Toolbar availability testing', (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            trgNode.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-mobile').length).toBe(0);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(0);
                done();
            }, 100);
        });

        it('getToolbar public method with toolbar testing', (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            trgNode.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(rteObj.getToolbar()).not.toBe(null);
                done();
            }, 100);
        });

        it('getBaseToolbarObject private method with toolbar object testing', (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            trgNode.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(rteObj.getBaseToolbarObject()).not.toBe(undefined);
                expect(rteObj.getBaseToolbarObject() instanceof BaseToolbar).toBe(true);
                done();
            }, 100);
        });

        it('MouseEvent args with mouseUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'mouseup',
                target: trg,
                x: 10, y: 200
            };
            let touchData: any = { prevClientX: 0, prevClientY: 10, clientX: 0, clientY: 0 };
            rteObj.quickToolbarModule.mouseUpHandler({ args: args, touchData: touchData });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                done();
            }, 100);
        });

        it('TouchEvent args with mouseUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'mouseup',
                target: trg,
                x: 10, y: 200,
                touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }]
            };
            let touchData: any = { prevClientX: 0, prevClientY: 10, clientX: 0, clientY: 0 };
            rteObj.quickToolbarModule.mouseUpHandler({ args: args, touchData: touchData });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                done();
            }, 100);
        });

        it('SelectionChange event with quick toolbar availability testing', (done: Function) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            args = {
                preventDefault: function () { },
                action: 'selectionchange',
                target: trg
            };
            rteObj.quickToolbarModule.selectionChangeHandler(args); 
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(0);
                done();
            }, 100);
        });

        it('Quick toolbar open with selection change event action to quick toolbar availability testing', (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            trgNode.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
                args = {
                    preventDefault: function () { },
                    action: 'selectionchange',
                    target: trg
                };
                rteObj.quickToolbarModule.selectionChangeHandler(args); 
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                    done();
                }, 100);
            }, 100);
        });

        it('Selection change update with quick toolbar availability testing', (done: Function) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0].childNodes[0], pEle.childNodes[0].childNodes[0], 0, 1);
            args = {
                preventDefault: function () { },
                action: 'selectionchange',
                target: trg
            };
            rteObj.quickToolbarModule.selectionChangeHandler(args); 
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(0);
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 1);
                rteObj.quickToolbarModule.selectionChangeHandler(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });

        it('hideInlineQTBar method testing', () => {
            (QTBarModule as any).hideInlineQTBar();
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            expect(pop).toBe(undefined);
        });
    });
    describe('EJ2-59960 - Script error thrown when resizing the Rich Text Editor component with inline mode', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        let browseinfo: any;
        let resizeStartSpy: jasmine.Spy = jasmine.createSpy('onresizeStart');
        let resizingSpy: jasmine.Spy = jasmine.createSpy('onresizing');
        let resizeStopSpy: jasmine.Spy = jasmine.createSpy('onresizeStop');

        beforeAll((done: Function) => {
            browseinfo = Browser.info.name;
            Browser.info.name = 'msie';
            (window as any).sfBlazor={ renderComplete:()=> {return true;}};
            (window as any).Blazor = null;
            rteObj = renderRTE({
                enableResize: true,
                resizeStart: resizeStartSpy,
                resizing: resizingSpy,
                resizeStop: resizeStopSpy,
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            }),
            rteEle = rteObj.element;
            done();
        });

        afterAll((done: Function) => {
            Browser.info.name = browseinfo;
            delete (window as any).Blazor;
            delete (window as any).sfBlazor;
            destroy(rteObj);
            done();
        });
        it('resize event - mouse', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousemove", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                setTimeout(() => {
                    clickEvent = document.createEvent("MouseEvents");
                    clickEvent.initEvent("mouseup", false, true);
                    trg.dispatchEvent(clickEvent);
                    (rteObj.resizeModule as any).stopResize(clickEvent);
                    expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
                    done();
                }, 400);
            }, 100);
        });
    });
    describe("817012-text selection Quick toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: "<div class='test'>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('mouseUp handler testing', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('[title="Bold (Ctrl+B)"]')[0]).not.toBe(null);
                rteObj.quickToolbarModule.hideQuickToolbars();
                done();
            }, 100);
        });
    });
    describe("817012-text selection Quick toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['FormatPainter','FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: "<div class='test'>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('check the inline mode is enabled', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0];
                expect(pop).toBe(undefined);
                rteObj.quickToolbarModule.hideQuickToolbars();
                done();
            }, 100);
        });
    });
    describe("817012-text selection Quick toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline']
                },
                quickToolbarSettings: {
                    text: ['CreateTable', 'CreateLink', 'Image','Audio','Video','SourceCode']
                },
                value: "<div class='test'>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('Check text Quick toolbar hide while click Insert table', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0].querySelector('[title="Create Table (Ctrl+Shift+E)"]');
                pop.click();
                setTimeout(() => {
                    expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                    rteEle = rteObj.element;
                    trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    document.createEvent("MouseEvents");
                    clickEvent.initEvent("mousedown", true, true);
                    trg.dispatchEvent(clickEvent);
                    done();
                }, 500);
            }, 100);
        });
        it('Check text Quick toolbar hide while click Insert link', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0].querySelector('[title="Insert Link (Ctrl+K)"]');
                pop.click();
                setTimeout(() => {
                    expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                    rteEle = rteObj.element;
                    trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    document.createEvent("MouseEvents");
                    clickEvent.initEvent("mousedown", true, true);
                    trg.dispatchEvent(clickEvent);
                    done();
                }, 500);
            }, 100);
        });
        it('Check text Quick toolbar hide while click Insert image', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0].querySelector('[title="Insert Image (Ctrl+Shift+I)"]');
                pop.click();
                setTimeout(() => {
                    expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                    rteEle = rteObj.element;
                    trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    document.createEvent("MouseEvents");
                    clickEvent.initEvent("mousedown", true, true);
                    trg.dispatchEvent(clickEvent);
                    done();
                }, 500);
            }, 100);
        });
        it('Check text Quick toolbar hide while click Audio', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0].querySelector('[title="Insert Audio (Ctrl+Shift+A)"]');
                pop.click();
                setTimeout(() => {
                    expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                    rteEle = rteObj.element;
                    trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    document.createEvent("MouseEvents");
                    clickEvent.initEvent("mousedown", true, true);
                    trg.dispatchEvent(clickEvent);
                    done();
                }, 500);
            }, 100);
        });
        it('Check text Quick toolbar hide while click video', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0].querySelector('[title="Insert Video (Ctrl+Alt+V)"]');
                pop.click();
                setTimeout(() => {
                    expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                    rteEle = rteObj.element;
                    trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    document.createEvent("MouseEvents");
                    clickEvent.initEvent("mousedown", true, true);
                    trg.dispatchEvent(clickEvent);
                    done();
                }, 500);
            }, 100);
        });
    });
    describe('817012-text selection Quick toolbar' , () => {
        let rteObject : any ;
        let toolbarELem: HTMLElement;
        let rteEle: HTMLElement;
        let trg;
        const htmlToolbarClickArgs: any = {
            item: {
                subCommand: 'FormatPainter',
                command: 'FormatPainter'
            },
            originalEvent: {
                detail: 1,
                target: null
            },
            name: 'html-toolbar-click'
        };
        const editAreaClickArgs: any = {
            args: {
                which: 1,
                target: null
            },
            name: 'editAreaClick',
            member: 'editAreaClick'
        };
        beforeEach( () => {
            rteObject = renderRTE({
                quickToolbarSettings: {
                    text: ['CreateTable', 'CreateLink', 'Image', 'Audio', 'Video', 'SourceCode','FormatPainter']
                },
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: "<div class='test'>Syncfusion</div>"
            });
            rteEle = rteObject.element;
            trg = rteEle.querySelectorAll(".e-content")[0];
            let clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            toolbarELem = document.body.querySelector('.e-rte-format-painter');
            editAreaClickArgs.args.target = rteObject.element.querySelector('.e-content');
        });
        afterAll( () => {
            destroy(rteObject);
        });
        it('Check text Quick toolbar hide while click format painter', (done: Function) => {
            rteObject.formatter.editorManager.nodeSelection.setSelectionText(document, rteObject.element.querySelector('.test').childNodes[0], rteObject.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObject.mouseUp(clickEvent);
            htmlToolbarClickArgs.originalEvent.target = toolbarELem;
            rteObject.notify('html-toolbar-click', htmlToolbarClickArgs);
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-text-quicktoolbar')[0]).toBe(undefined);
                done();
            }, 300);
        });
    });

    describe('848813 - When clicking on the image to open the quick toolbar, the main toolbar icon should not be in a visible state', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""> <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/> <br></td></tr></tbody></table><p><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', 'FormatPainter', 'ClearFormat', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', 'EmojiPicker', '|',
                'Formats', 'Alignments', 'OrderedList', 'UnorderedList', '|',
                'CreateLink', 'CreateTable', 'Image', 'Audio', 'Video', 'FileManager', '|',
                'SourceCode', 'FullScreen']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Checking the main toolbar icon should not be in a visible state', (done: Function) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[3].classList.contains("e-overlay")).toBe(true);
                expect(rteEle.querySelectorAll(".e-toolbar-item")[4].classList.contains("e-overlay")).toBe(true);
                expect(rteEle.querySelectorAll(".e-toolbar-item")[6].classList.contains("e-overlay")).toBe(true);
                expect(rteEle.querySelectorAll(".e-toolbar-item")[25].classList.contains("e-overlay")).toBe(false);
                done();
            }, 100);
        });
    });

    describe('854233 - The quick format toolbar item status is not updated.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Undo', 'Redo', '|', 'Bold', 'Italic', '|', 'FontName', 'FontSize', 'Formats']
                },
                value: `<p><strong><em><span class="target" style="font-size: 18pt;">Text Quick toolbar</span></em></strong></p>`
            });
        });
        
        afterAll(() => {
            destroy(rteObj);
        });
        
        it('Check for the toolbar status in the Text Quick Edit toolbar', (done: Function) => {
            let trg: HTMLElement = rteObj.inputElement.firstChild as HTMLElement;
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, document.querySelector('.target').firstChild, document.querySelector('.target').firstChild, 0, 5);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            trg.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const items: NodeListOf<Element> = document.querySelector('.e-text-quicktoolbar').querySelectorAll('.e-toolbar-item');
                expect(items[0].classList.contains('e-overlay')).toBe(true);
                expect(items[1].classList.contains('e-overlay')).toBe(true);
                expect(items[3].classList.contains('e-overlay')).toBe(false);
                done();
            }, 100);
        });
    });

    describe('855892 - Quick format toolbar is not opened when the text is selected with Keyboard action.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: `<p>Solar energy is radiant light and heat from the sun that is harnessed and converted into usable forms of energy. It
                        is a clean, renewable, and abundant source of power that has a wide range of applications across various sectors.
                        Solar energy is typically harnessed through solar technologies, such as photovoltaic (PV) cells and solar thermal
                        systems.</p><p>Here's an overview of solar energy:</p>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Should open the quick toolbar when the text is selected with Keyboard action.', (done: Function) => {
            editorObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            editorObj.selectAll();
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                key: "ArrowRight",
                keyCode: 39,
                which: 39,
                code: "ArrowRight",
                location: 0,
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: true,
                repeat: false
            } as EventInit);
            editorObj.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', {
                key: "ArrowRight",
                keyCode: 39,
                which: 39,
                code: "ArrowRight",
                location: 0,
                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: true,
                repeat: false
            } as EventInit);
            editorObj.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-text-quicktoolbar').querySelectorAll('.e-toolbar-item').length).toBe(3);
                done();
            }, 100);
        });
    });

    describe('872942 - The ALT + F10  shortcut to focus the Quick Toolbar is not working properly.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                value: '<img alt="image 1" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 450px; height: 300px;" />'
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Should open the quick toolbar when the ALT + F10 shortcut is pressed.', (done: Function) => {
            const image: HTMLImageElement = editorObj.element.querySelector('img');
            clickImage(image);
            const shortCutKeyDownEvent: KeyboardEvent =  new KeyboardEvent('keydown', TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
            const shortCutKeyUpEvent: KeyboardEvent =  new KeyboardEvent('keyup', TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
            editorObj.inputElement.dispatchEvent(shortCutKeyDownEvent);
            editorObj.inputElement.dispatchEvent(shortCutKeyUpEvent);
            setTimeout(() => {
                expect(document.activeElement === editorObj.quickToolbarModule.imageQTBar.toolbarElement.querySelector('.e-toolbar-item'));
                done();
            }, 200);
        });
    });

    describe('937562 - MAC: The Quick toolbar closes when the Alt +F10 key is pressed to focus on the first icon of the toolbar.', () => {
        let rteObj: RichTextEditor;
        let EnterkeyboardEventArgs = {
            preventDefault: function () { },
            altKey: true,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 18,
            keyCode: 18,
            which: 18,
            code: 'AltLeft',
            action: 'AltLeft',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: "<div id='rte'><p><b>Syncfusion</b> Software</p>" + "<img id='imgTag' style='width: 200px' alt='Logo'" +
                    " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' />",
            });;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Should keep the image quick toolbar open when Alt and F10 keys are pressed", (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target: HTMLElement = rteObj.inputElement.querySelector('#imgTag');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (<any>rteObj).keyDown(EnterkeyboardEventArgs);
                let imageQuickToolbar: HTMLElement = document.querySelector(".e-rte-quick-popup .e-image-quicktoolbar");
                expect(imageQuickToolbar !== null).toBe(true);
                EnterkeyboardEventArgs.code = "F10";
                (<any>rteObj).keyDown(EnterkeyboardEventArgs);
                setTimeout(() => {
                    imageQuickToolbar = document.querySelector(".e-rte-quick-popup .e-image-quicktoolbar");
                    expect(imageQuickToolbar !== null).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('872307 - Tabel merge quick toolbar tooltip issues ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="td1" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the tooltip text of table cell items', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            rteObj.inputElement.dispatchEvent(clickEvent);
            let tdEle: HTMLElement = rteObj.element.querySelector(".td1");
            tdEle.focus();
            setCursorPoint(tdEle, 0);
            var eventsArg = { pageX: 50, pageY: 300, target: tdEle };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            let tableQTBarEle: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            let tableCell: HTMLElement = (tableQTBarEle.querySelector('[title="Column"]').nextElementSibling as HTMLElement).childNodes[0] as HTMLElement;
            tableCell.click();
            tableCell.dispatchEvent(clickEvent);
            setTimeout(() => {
                const mergeCell = document.body.querySelector('li[title="Merge cells"]') as HTMLElement;
                const horizSplit = document.body.querySelector('li[title="Horizontal split"]') as HTMLElement;
                const verriSplit = document.body.querySelector('li[title="Vertical split"]') as HTMLElement;
                expect(!isNullOrUndefined(mergeCell)).toBe(false);
                expect(!isNullOrUndefined(horizSplit)).toBe(false);
                expect(!isNullOrUndefined(verriSplit)).toBe(false);
                done();
            }, 100);
        });
    });

    describe('Bug 994222: Tooltip for table cell option in table quick toolbar is not available', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="td1" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Verify the tooltip text for the table cell option in the table quick toolbar.', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            rteObj.inputElement.dispatchEvent(clickEvent);
            let tdEle: HTMLElement = rteObj.element.querySelector(".td1");
            tdEle.focus();
            setCursorPoint(tdEle, 0);
            var eventsArg = { pageX: 50, pageY: 300, target: tdEle };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            let tableQTBarEle: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            let tableCell: HTMLElement = tableQTBarEle.querySelector('[title="Merge Cell"]') as HTMLElement;
            expect(tableCell).not.toBe(null);
            done();
        });
    });

    describe('942019 - Aria-Label Becomes Empty When Applying a Link to an Image.', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""> <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/> <br></td></tr></tbody></table><p><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', 'FormatPainter', 'ClearFormat', '|',
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', 'EmojiPicker', '|',
                        'Formats', 'Alignments', 'OrderedList', 'UnorderedList', '|',
                        'CreateLink', 'CreateTable', 'Image', 'Audio', 'Video', 'FileManager', '|',
                        'SourceCode', 'FullScreen']
                },
                quickToolbarSettings: {
                    image: ['InsertLink', 'Remove']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking the image link has ariaLabel', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: clickEvent });
            setTimeout(() => {
                (<any>rteObj).quickToolbarModule.imageQTBar.element.querySelectorAll(".e-toolbar-item")[0].firstChild.click();
                (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = 'http://www.goole.com';
                (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
                setTimeout(() => {
                    rteObj.inputElement.querySelector("img").parentElement.nodeName === 'A';
                    rteObj.inputElement.querySelector("img").parentElement.ariaLabel === 'Open in new window';
                    done();
                }, 0)
            }, 0)
        });
    });

    describe('936959 - MAC-After pressing the Escape key, both the dropdown popup and the quick toolbar are closing, although only the dropdown popup should close.', () => {
        let rteObj: any;
        let QTBarModule: IQuickToolbar;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: "<div id='rte'><p><b>Syncfusion</b> Software</p>" + "<img id='imgTag' style='width: 200px' alt='Logo'" +
                    " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' />",
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Should close only dropdown popup on Escape key press, not the entire quick toolbar", (done) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target: HTMLElement = rteEle.querySelector('#imgTag');
            setCursorPoint(target, 0);
            expect(rteObj.quickToolbarSettings.image.length).toBe(14);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (document.querySelectorAll(".e-rte-dropdown-btn")[1] as HTMLElement).click();
                var escapeKeyDown = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    bubbles: true,
                    cancelable: true
                } as KeyboardEventInit);
                let dropDownElem = document.querySelector("#" + rteObj.getID() + '_quick_Display-popup');
                dropDownElem.dispatchEvent(escapeKeyDown);
                setTimeout(() => {
                    let keyBoardEventDel: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Escape', stopPropagation: () => { }, shiftKey: false, which: 27 };
                    (rteObj as any).keyUp(keyBoardEventDel);
                    expect(document.querySelector(".e-rte-quick-popup .e-image-quicktoolbar") != null).toBe(true);
                    expect(dropDownElem.childNodes.length == 0).toBe(true);
                    (rteObj).keyUp(keyBoardEventDel);
                    expect(document.querySelector("#" + rteObj.getID() + '_quick_Display-popup')).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe("Background color testing.", () => {
        let editor: RichTextEditor;

        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Backgroundcolor']
                },
                value: EDITOR_CONTENT
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it("Should open Text quick toolbar and apply background color.", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                const fontColorButton: HTMLElement = quickPopup.querySelector('.e-toolbar-item button') as HTMLElement;
                fontColorButton.click();
                setTimeout(() => {
                    expect((target.childNodes[1] as HTMLElement).style.backgroundColor).toBe('rgb(255, 255, 0)')
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("961448 - Formatting options incorrectly enabled in popup toolbar inside Code Block", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: [ 'Italic', 'Fontcolor', 'Blockquote', '|' , 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent']
                },
                value: `<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor</code></pre><p>Rich</p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it("should disable certain toolbar items when range is inside the code block", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('pre code');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toBe(true);
                expect(quickPopup.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-overlay')).toBe(true);
                expect(quickPopup.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-overlay')).toBe(false);
                done();
            }, 100);
        });
        it("should enable all toolbar items when range is outside the code block", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('pre code');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toBe(true);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(quickPopup.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("980349 - Unselected Items Still Appear in Text Quick Toolbar After Configuration", () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Fontcolor', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent']
                },
                value: `<p>Syncfusion</p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it("should change quicktooolbar items dynamically", (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup).not.toBe(null);
            }, 100);
            editor.focusIn();
            editor.quickToolbarSettings.text = ['Formats', 'OrderedList', 'UnOrderedList'];
            editor.dataBind();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const targetTwo: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(targetTwo.firstChild, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup).not.toBe(null);
                expect(document.querySelectorAll('.e-text-quicktoolbar .e-toolbar-item').length === 3).toBe(true);
                done();
            }, 100);
        });
    });
    describe('982140 - Updated image options in the QuickToolbar settings are not reflected', () => {
        describe("982140 - Check with image quick toolbar", () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        image: ['Caption', '|', 'Align', 'Display', '|', 'InsertLink', 'OpenImageLink', 'EditImageLink', '|', 'Dimension', 'Replace', 'Remove'],
                    },
                    value: EDITOR_CONTENT
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it("should change image quicktooolbar items dynamically", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                    expect(editor.quickToolbarSettings.image.length).toBe(12);
                    editor.focusIn();
                    editor.quickToolbarSettings.image = ['Display', 'Dimension', 'Replace', 'Remove'];
                    editor.dataBind();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                        expect(editor.quickToolbarSettings.image.length).toBe(4);
                        expect(document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item').length === 4).toBe(true);
                        editor.inputElement.blur();
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe("982140 - Check with video quick toolbar", () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        video: ['VideoLayoutOption', 'VideoAlign', '|', 'VideoDimension', 'VideoReplace', 'VideoRemove'],
                    },
                    value: EDITOR_CONTENT
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it("should change video quicktooolbar items dynamically", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('video');
                setSelection(target, 0, 1);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarSettings.video.length).toBe(6);
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Video_Quick_Popup') >= 0).toBe(true);
                    expect(editor.quickToolbarSettings.video.length).toBe(6);
                    editor.inputElement.blur();
                    editor.focusIn();
                    editor.quickToolbarSettings.video = ['VideoLayoutOption', 'VideoDimension', 'VideoRemove'];
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('video');
                    setSelection(target, 0, 1);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Video_Quick_Popup') >= 0).toBe(true);
                        expect(editor.quickToolbarSettings.video.length).toBe(3);
                        expect(document.querySelectorAll('.e-video-quicktoolbar .e-toolbar-item').length === 3).toBe(true);
                        editor.inputElement.blur();
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe("982140 - Check with link quick toolbar", () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        link: ['Open', 'Edit', 'UnLink'],
                    },
                    value: EDITOR_CONTENT
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it("should change link quicktooolbar items dynamically", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('a');
                setCursorPoint(target.firstChild, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                    expect(editor.quickToolbarSettings.link.length).toBe(3);
                    editor.inputElement.blur();
                    editor.focusIn();
                    editor.quickToolbarSettings.link = ['Edit', 'UnLink'];
                    editor.dataBind();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('a');
                    setCursorPoint(target.firstChild, 2);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                        expect(editor.quickToolbarSettings.link.length).toBe(2);
                        expect(document.querySelectorAll('.e-link-quicktoolbar .e-toolbar-item').length === 2).toBe(true);
                        editor.inputElement.blur();
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe("982140 - Check with table quick toolbar", () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        table: ['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', '|', 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign']
                    },
                    value: EDITOR_CONTENT
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it("should change table quicktooolbar items dynamically", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarSettings.table.length).toBe(10);
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Table_Quick_Popup') >= 0).toBe(true);
                    editor.inputElement.blur();
                    editor.quickToolbarSettings.table = ['TableRemove', '|', 'TableRows', 'TableColumns', '|', 'Styles', 'BackgroundColor'];
                    editor.dataBind();
                    editor.focusIn();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Table_Quick_Popup') >= 0).toBe(true);
                        expect(editor.quickToolbarSettings.table.length).toBe(7);
                        expect(document.querySelectorAll('.e-table-quicktoolbar .e-toolbar-item').length === 7).toBe(true);
                        editor.inputElement.blur();
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe("982140 - Check with audio quick toolbar", () => {
            let editor: RichTextEditor;
            let innerHTML: string = `<p>testing&nbsp;<audio controls><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3" /></audio><br></p>`;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        audio: ['AudioLayoutOption', 'AudioReplace', 'AudioRemove'],
                    },
                    value: innerHTML
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it("should change audio quicktooolbar items dynamically", (done: DoneFn) => {
                const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let target = (editor.contentModule.getEditPanel() as HTMLElement).querySelector('.e-clickelem');
                (editor as any).formatter.editorManager.nodeSelection.setSelectionNode(editor.contentModule.getDocument(), target);
                editor.inputElement.querySelector('.e-clickelem').dispatchEvent(MOUSEUP_EVENT);
                setTimeout(function () {
                    let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                    expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                    expect(editor.quickToolbarSettings.audio.length).toBe(3)
                    editor.focusIn();
                    editor.quickToolbarSettings.audio = ['AudioReplace', 'AudioRemove'];
                    editor.dataBind();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    let target = (editor.contentModule.getEditPanel() as HTMLElement).querySelector('.e-clickelem');
                    (editor as any).formatter.editorManager.nodeSelection.setSelectionNode(editor.contentModule.getDocument(), target);
                    editor.inputElement.querySelector('.e-clickelem').dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(function () {
                        let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                        expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                        expect(editor.quickToolbarSettings.audio.length).toBe(2)
                        expect(document.querySelectorAll('.e-audio-quicktoolbar .e-toolbar-item').length === 2).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
    });
});
